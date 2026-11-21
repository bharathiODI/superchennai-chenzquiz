#!/usr/bin/env bash
# Production deploy - runs ON THE SERVER, called by .github/workflows/deploy.yml.
#
#   bash scripts/deploy.sh <release-name> [git-sha]
#
# Layout (created once by scripts/server-setup.sh):
#   $APP_ROOT/releases/<release>/   one folder per deploy (code uploaded by GitHub Actions)
#   $APP_ROOT/shared/.env           production env (linked into every release)
#   $APP_ROOT/shared/media/         Payload uploads (linked to public/media)
#   $APP_ROOT/current -> releases/<live release>
#
# The live site keeps running while the new release installs and builds. Only after a
# successful build is `current` switched and PM2 restarted; if the health check fails
# the previous release is restored automatically.
set -Eeuo pipefail

APP_ROOT="${APP_ROOT:-/var/www/chenzquiz}"
APP_NAME="${APP_NAME:-chenzquiz-superchennai}"
APP_PORT="${APP_PORT:-3007}"
KEEP_RELEASES="${KEEP_RELEASES:-3}"
RELEASE="${1:?usage: deploy.sh <release-name> [git-sha]}"
SHA="${2:-unknown}"

RELEASE_DIR="$APP_ROOT/releases/$RELEASE"
CURRENT="$APP_ROOT/current"
SHARED="$APP_ROOT/shared"
SWITCHED=0

log() { printf '\n\033[1;36m==> %s\033[0m\n' "$*"; }
fail() { printf '\n\033[1;31mERROR: %s\033[0m\n' "$*" >&2; exit 1; }

# Node/PM2 may come from nvm, which non-interactive SSH sessions don't load
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
# shellcheck disable=SC1091
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
export PATH="$PATH:/usr/local/bin:/usr/bin:/bin"

for cmd in node npm pm2 curl rsync; do
  command -v "$cmd" >/dev/null 2>&1 || fail "'$cmd' is not installed on the server"
done
[ -d "$RELEASE_DIR" ] || fail "release folder $RELEASE_DIR not found"
[ -f "$SHARED/.env" ] || fail "$SHARED/.env missing - run scripts/server-setup.sh first"

# A failed install/build never touches the live site; just drop the half-built release.
on_error() {
  if [ "$SWITCHED" = 0 ]; then
    echo "Deploy failed before going live - the site was not changed."
    rm -rf "$RELEASE_DIR"
  fi
}
trap on_error ERR

pm2_cwd() {
  pm2 jlist 2>/dev/null | node -e '
    let d = ""; process.stdin.on("data", c => d += c).on("end", () => {
      try { const p = JSON.parse(d).find(x => x.name === process.argv[1]); process.stdout.write(p ? p.pm2_env.pm_cwd : "") }
      catch { process.stdout.write("") }
    })' "$APP_NAME"
}

start_app() {
  PORT="$APP_PORT" NODE_ENV=production pm2 start npm --name "$APP_NAME" --cwd "$CURRENT" -- start
}

log "Release $RELEASE ($SHA)"
cd "$RELEASE_DIR"

log "Linking shared .env and media"
ln -sfn "$SHARED/.env" "$RELEASE_DIR/.env"
mkdir -p "$SHARED/media" "$RELEASE_DIR/public"
rm -rf "$RELEASE_DIR/public/media"
ln -sfn "$SHARED/media" "$RELEASE_DIR/public/media"
printf '{"release":"%s","sha":"%s"}\n' "$RELEASE" "$SHA" > "$RELEASE_DIR/public/version.json"

log "Installing dependencies"
ELECTRON_SKIP_BINARY_DOWNLOAD=1 npm ci --no-audit --no-fund

if compgen -G "src/migrations/*.ts" >/dev/null; then
  log "Running database migrations"
  npx payload migrate
fi

log "Building"
NODE_OPTIONS="--max-old-space-size=4096" npm run build

# Remember what is live now so we can roll back
PREVIOUS_RELEASE="$(readlink -f "$CURRENT" 2>/dev/null || true)"
OLD_CWD="$(pm2_cwd || true)"

# First deploy only: the app was running from a plain folder - bring over any uploads made since setup
if [ -n "$OLD_CWD" ] && [ "$OLD_CWD" != "$CURRENT" ] && [ -d "$OLD_CWD/public/media" ] && [ ! -L "$OLD_CWD/public/media" ]; then
  log "Copying latest uploads from $OLD_CWD"
  rsync -a "$OLD_CWD/public/media/" "$SHARED/media/"
fi

log "Going live"
ln -sfn "$RELEASE_DIR" "$APP_ROOT/current.tmp"
mv -Tf "$APP_ROOT/current.tmp" "$CURRENT"
SWITCHED=1
trap - ERR

if [ -n "$OLD_CWD" ] && [ "$OLD_CWD" = "$CURRENT" ]; then
  pm2 reload "$APP_NAME" --update-env
else
  # Not managed from $CURRENT yet (first deploy) - recreate the PM2 process
  pm2 delete "$APP_NAME" >/dev/null 2>&1 || true
  start_app
fi

log "Health check"
healthy=0
for _ in $(seq 1 45); do
  if curl -fsS --max-time 5 "http://127.0.0.1:$APP_PORT/version.json" 2>/dev/null | grep -q "\"$RELEASE\""; then
    healthy=1
    break
  fi
  sleep 2
done

if [ "$healthy" != 1 ]; then
  echo "New release did not come up on port $APP_PORT - rolling back."
  pm2 logs "$APP_NAME" --lines 40 --nostream || true
  if [ -n "$PREVIOUS_RELEASE" ] && [ -d "$PREVIOUS_RELEASE" ] && [ "$PREVIOUS_RELEASE" != "$RELEASE_DIR" ]; then
    ln -sfn "$PREVIOUS_RELEASE" "$APP_ROOT/current.tmp"
    mv -Tf "$APP_ROOT/current.tmp" "$CURRENT"
    pm2 reload "$APP_NAME" --update-env
    echo "Restored $(basename "$PREVIOUS_RELEASE")."
  elif [ -n "$OLD_CWD" ] && [ "$OLD_CWD" != "$CURRENT" ]; then
    pm2 delete "$APP_NAME" >/dev/null 2>&1 || true
    PORT="$APP_PORT" NODE_ENV=production pm2 start npm --name "$APP_NAME" --cwd "$OLD_CWD" -- start
    echo "Restored the previous app in $OLD_CWD."
  fi
  pm2 save >/dev/null
  fail "deploy of $RELEASE failed health check"
fi

pm2 save >/dev/null

log "Cleaning up old releases (keeping $KEEP_RELEASES)"
LIVE="$(readlink -f "$CURRENT")"
# shellcheck disable=SC2012  # release names are <timestamp>-<sha>, safe for ls
for old in $(ls -1dt "$APP_ROOT"/releases/*/ 2>/dev/null | sed 's:/$::' | tail -n +"$((KEEP_RELEASES + 1))"); do
  if [ "$old" != "$LIVE" ]; then rm -rf "$old"; fi
done

log "Deployed $RELEASE ($SHA) - live on port $APP_PORT"
