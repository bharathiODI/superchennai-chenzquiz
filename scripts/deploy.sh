#!/usr/bin/env bash
# Deploy - runs ON THE SERVER, called by .github/workflows/deploy.yml for both sites:
#   live: APP_ROOT=/var/www/chenzquiz       APP_NAME=chenzquiz-superchennai APP_PORT=3007
#   demo: APP_ROOT=/var/www/chenzquiz-demo  APP_NAME=chenzquiz-demo         APP_PORT=3017
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
# successful build is `current` switched and the app restarted; if the new release does
# not answer on $APP_PORT the previous app is put back automatically.
#
# The app that is live is found by the port it listens on, not by its PM2 name, so the
# first deploy also takes over from an app that was started by hand. That app is only
# stopped (not deleted) until the new release passes its health check.
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
LOCK_DIR=/tmp/chenzquiz-deploy.lock
LOCKED=0

log() { printf '\n\033[1;36m==> %s\033[0m\n' "$*"; }
fail() { printf '\n\033[1;31mERROR: %s\033[0m\n' "$*" >&2; exit 1; }

[[ "$RELEASE" =~ ^[A-Za-z0-9._-]+$ && "$RELEASE" != *..* ]] || fail "invalid release name '$RELEASE'"

# Anything that fails before the switch leaves the live site untouched; drop the half-built release.
# shellcheck disable=SC2329  # called by the EXIT trap
on_exit() {
  local rc=$?
  if [ "$rc" != 0 ] && [ "$SWITCHED" = 0 ]; then
    echo "Deploy failed before going live - the site was not changed."
    rm -rf "$RELEASE_DIR"
  fi
  if [ "$LOCKED" = 1 ]; then rm -rf "$LOCK_DIR"; fi
}
trap on_exit EXIT

# Node/PM2 may come from nvm, which non-interactive SSH sessions don't load
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
# shellcheck disable=SC1091
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
export PATH="$PATH:/usr/local/bin:/usr/bin:/bin"

for cmd in node npm pm2 curl rsync ss; do
  command -v "$cmd" >/dev/null 2>&1 || fail "'$cmd' is not installed on the server"
done
[ -d "$RELEASE_DIR" ] || fail "release folder $RELEASE_DIR not found"
[ -f "$SHARED/.env" ] || fail "$SHARED/.env missing - run scripts/server-setup.sh first"
[ ! -f "$SHARED/USING_LIVE_DB" ] || fail "this site is using the LIVE database (chenzquiz-site.sh demo-db live). Switch back first: bash chenzquiz-site.sh demo-db demo"

# Live and demo build on this one server: run one deploy at a time (the other waits here).
# A lock folder (not an open file, which PM2 could inherit) holding the deploy's pid;
# a lock left by a deploy that died is taken over.
waited=0
until mkdir "$LOCK_DIR" 2>/dev/null; do
  holder="$(cat "$LOCK_DIR/pid" 2>/dev/null || true)"
  if [ -n "$holder" ] && ! kill -0 "$holder" 2>/dev/null; then rm -rf "$LOCK_DIR"; continue; fi
  [ "$waited" = 0 ] && echo "Another chenzquiz deploy is running on this server (pid ${holder:-?}) - waiting for it to finish..."
  sleep 10
  waited=$((waited + 10))
  [ "$waited" -lt 2700 ] || fail "gave up waiting for the other deploy (45 min)"
done
echo $$ > "$LOCK_DIR/pid"
LOCKED=1

port_busy() { [ -n "$(ss -ltnH "sport = :$APP_PORT" 2>/dev/null)" ]; }

wait_port_free() {
  local _
  for _ in $(seq 1 30); do
    port_busy || return 0
    sleep 1
  done
  return 1
}

# The PM2 app serving $APP_PORT, as "<pm2 id><TAB><name><TAB><cwd>".
# Prints "unmanaged<TAB><pid>" when something outside PM2 holds the port, nothing when it is free.
port_owner() {
  local pid
  pid="$(ss -ltnpH "sport = :$APP_PORT" 2>/dev/null | grep -o 'pid=[0-9]*' | head -n1 | cut -d= -f2 || true)"
  if [ -z "$pid" ]; then
    if port_busy; then printf 'unmanaged\t?'; fi
    return 0
  fi
  # shellcheck disable=SC2016  # JavaScript, not shell
  pm2 jlist 2>/dev/null | node -e '
    const fs = require("fs"); let d = "";
    process.stdin.on("data", (c) => (d += c)).on("end", () => {
      let apps = [];
      try { apps = JSON.parse(d.slice(d.indexOf("["))) } catch {}
      const byPid = new Map(apps.filter((a) => a.pid).map((a) => [String(a.pid), a]));
      let pid = process.argv[1];
      for (let hops = 0; pid && pid !== "0" && pid !== "1" && hops < 50; hops++) {
        const a = byPid.get(pid);
        if (a) return process.stdout.write(`${a.pm_id}\t${a.name}\t${a.pm2_env.pm_cwd}`);
        try { pid = fs.readFileSync(`/proc/${pid}/status`, "utf8").match(/^PPid:\s*(\d+)/m)[1] } catch { break }
      }
      process.stdout.write(`unmanaged\t${process.argv[1]}`);
    })' "$pid"
}

check_port_owner() {
  OWNER="$(port_owner)"
  OWNER_ID="" OWNER_NAME="" OWNER_CWD=""
  if [ -n "$OWNER" ]; then IFS=$'\t' read -r OWNER_ID OWNER_NAME OWNER_CWD <<<"$OWNER"; fi
  if [ "$OWNER_ID" = unmanaged ]; then
    fail "port $APP_PORT is held by a process PM2 does not manage (pid $OWNER_NAME). Stop it, then re-run this deploy."
  fi
}

start_app() {
  PORT="$APP_PORT" NODE_ENV=production pm2 start npm --name "$APP_NAME" --cwd "$CURRENT" -- start
}

reload_app() {
  PORT="$APP_PORT" NODE_ENV=production pm2 reload "$APP_NAME" --update-env
}

log "Release $RELEASE ($SHA)"
check_port_owner   # fail fast, before spending minutes on install and build
echo "Live app on port $APP_PORT: ${OWNER_NAME:-none} ${OWNER_CWD:+($OWNER_CWD)}"
cd "$RELEASE_DIR"

log "Linking shared .env and media"
ln -sfn "$SHARED/.env" "$RELEASE_DIR/.env"
# Per-site switches (maintenance mode) - kept across deploys; the app writes through this link
ln -sfn "$SHARED/site-flags.json" "$RELEASE_DIR/site-flags.json"
mkdir -p "$SHARED/media" "$RELEASE_DIR/public"
rm -rf "$RELEASE_DIR/public/media"
ln -sfn "$SHARED/media" "$RELEASE_DIR/public/media"
printf '{"release":"%s","sha":"%s"}\n' "$RELEASE" "$SHA" > "$RELEASE_DIR/public/version.json"

log "Installing dependencies"
ELECTRON_SKIP_BINARY_DOWNLOAD=1 npm ci --no-audit --no-fund

# Plain-SQL migrations in /migrations (additive and repeatable). They run before the build so
# pages that read new tables can be built; the live app is unaffected by new tables or columns.
if [ -f scripts/db-migrate.mjs ]; then
  log "Applying database migrations"
  node scripts/db-migrate.mjs
fi

log "Building"
NODE_OPTIONS="--max-old-space-size=4096" npm run build

# What is live right now, so it can be put back
PREVIOUS_RELEASE=""
if [ -L "$CURRENT" ]; then PREVIOUS_RELEASE="$(readlink -e "$CURRENT" || true)"; fi
if [ "$PREVIOUS_RELEASE" = "$RELEASE_DIR" ]; then PREVIOUS_RELEASE=""; fi
check_port_owner

if [ "$OWNER_NAME" = "$APP_NAME" ] && [ "$OWNER_CWD" = "$CURRENT" ]; then
  MODE=reload     # normal deploy: the live app already runs from `current`
else
  MODE=takeover   # first deploy, or the app was (re)started by hand somewhere else
fi

# Bring over uploads made in the old app folder since server-setup.sh copied them
if [ -n "$OWNER_CWD" ] && [ "$OWNER_CWD" != "$CURRENT" ] && [ -d "$OWNER_CWD/public/media" ] && [ ! -L "$OWNER_CWD/public/media" ]; then
  log "Copying latest uploads from $OWNER_CWD"
  rsync -a "$OWNER_CWD/public/media/" "$SHARED/media/"
fi

log "Going live"
ln -sfn "$RELEASE_DIR" "$APP_ROOT/current.tmp"
mv -Tf "$APP_ROOT/current.tmp" "$CURRENT"
SWITCHED=1
# From here a failing command must not abort the script: the health check decides,
# and a failed release is rolled back instead.
set +e

KEPT_ID="" RECREATE_CWD=""
if [ "$MODE" = reload ]; then
  reload_app
else
  if [ -n "$OWNER_ID" ] && [ "$OWNER_NAME" != "$APP_NAME" ]; then
    log "Stopping '$OWNER_NAME' (PM2 id $OWNER_ID) - it is removed once the new release is healthy"
    pm2 stop "$OWNER_ID"
    KEPT_ID="$OWNER_ID"
  elif [ -n "$OWNER_ID" ]; then
    RECREATE_CWD="$OWNER_CWD"
  fi
  pm2 delete "$APP_NAME" >/dev/null 2>&1   # a stale entry, or the old app under the same name
  wait_port_free || echo "Port $APP_PORT is still in use after stopping the old app."
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
  pm2 logs "$APP_NAME" --lines 40 --nostream

  if [ -n "$PREVIOUS_RELEASE" ] && [ -d "$PREVIOUS_RELEASE" ]; then
    ln -sfn "$PREVIOUS_RELEASE" "$APP_ROOT/current.tmp"
    mv -Tf "$APP_ROOT/current.tmp" "$CURRENT"
  elif [ "$MODE" = takeover ]; then
    rm -f "$CURRENT"
  fi

  if [ "$MODE" = reload ]; then
    [ -n "$PREVIOUS_RELEASE" ] && reload_app
  else
    pm2 delete "$APP_NAME" >/dev/null 2>&1
    wait_port_free
    if [ -n "$KEPT_ID" ]; then
      pm2 restart "$KEPT_ID"
    elif [ -n "$RECREATE_CWD" ]; then
      PORT="$APP_PORT" NODE_ENV=production pm2 start npm --name "$APP_NAME" --cwd "$RECREATE_CWD" -- start
    elif [ -n "$PREVIOUS_RELEASE" ]; then
      start_app
    fi
  fi
  pm2 save >/dev/null

  if [ "$(readlink -e "$CURRENT" 2>/dev/null)" != "$RELEASE_DIR" ]; then rm -rf "$RELEASE_DIR"; fi
  fail "release $RELEASE failed its health check - the previous version is back"
fi

if [ -n "$KEPT_ID" ]; then
  log "Removing the old PM2 app '$OWNER_NAME'"
  pm2 delete "$KEPT_ID" >/dev/null
fi
pm2 save >/dev/null

log "Cleaning up old releases (keeping $KEEP_RELEASES)"
LIVE="$(readlink -e "$CURRENT")"
# shellcheck disable=SC2012  # release names are <timestamp>-<sha>, safe for ls
for old in $(ls -1dt "$APP_ROOT"/releases/*/ 2>/dev/null | sed 's:/$::' | tail -n +"$((KEEP_RELEASES + 1))"); do
  if [ "$old" != "$LIVE" ]; then rm -rf "$old"; fi
done

log "Deployed $RELEASE ($SHA) - live on port $APP_PORT"
exit 0
