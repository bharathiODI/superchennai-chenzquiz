#!/usr/bin/env bash
# Safety steps around a chenzquiz deploy. Run ON THE SERVER as root.
#
#   bash chenzquiz-deploy.sh before [demo]     backup + what's live + who is playing (before merging)
#   bash chenzquiz-deploy.sh after [demo]      checks once GitHub Actions shows the deploy finished
#   bash chenzquiz-deploy.sh rollback [demo]   put the previous release back (if "after" shows a problem)
#
# Without "demo" it works on the LIVE site; with "demo" on the demo site.
# Read-only except: "before" writes a backup file, "rollback" switches the live release.
# It never posts anything to the site.
set -Eeuo pipefail
cd /  # start somewhere that always exists: a deploy deletes old release folders, and pm2 fails if the shell was inside one

case "${2:-live}" in
  live) SITE=live APP_ROOT=/var/www/chenzquiz APP_NAME=chenzquiz-superchennai PORT=3007 ;;
  demo) SITE=demo APP_ROOT=/var/www/chenzquiz-demo APP_NAME=chenzquiz-demo PORT=3017 ;;
  *) echo "second word must be 'demo' (or nothing for live)"; exit 1 ;;
esac
BACKUPS=/var/www/backups

cd "$APP_ROOT/current"
# Read the .env the way the app does (dotenv), not with bash: lines like "KEY = value" are fine
# for the app but are errors when a shell sources the file.
DATABASE_URI="$(node -e 'require("dotenv").config({ path: process.argv[1], quiet: true }); process.stdout.write(process.env.DATABASE_URI || "")' "$APP_ROOT/shared/.env")"
[ -n "$DATABASE_URI" ] || { echo "DATABASE_URI not found in $APP_ROOT/shared/.env"; exit 1; }
export DATABASE_URI
sql() { psql "$DATABASE_URI" -X -q -v ON_ERROR_STOP=1 "$@"; }
say() { printf '\n\033[1;36m== %s\033[0m\n' "$*"; }

case "${1:-}" in
before)
  say "1. Database backup"
  mkdir -p "$BACKUPS"; chmod 700 "$BACKUPS"
  f="$BACKUPS/chenzquiz-$([ "$SITE" = demo ] && echo demo-)$(date +%Y%m%d-%H%M).sql.gz"
  pg_dump "$DATABASE_URI" --no-owner --no-privileges | gzip > "$f"
  chmod 600 "$f"
  gzip -t "$f" && echo "OK  $f ($(du -h "$f" | cut -f1))"

  say "2. $SITE site now"
  echo "release: $(readlink -e "$APP_ROOT/current")"
  curl -fsS "http://127.0.0.1:$PORT/version.json" && echo

  say "3. CMS accounts - every one of these should be someone you know"
  sql -c "select id, email, role, created_at::timestamp(0) as created from users order by id"

  say "4. Players mid-round right now (rounds started in the last 5 minutes, not finished)"
  sql -At -c "select count(*) from quiz_rounds where status='assigned' and created_at > now() - interval '5 minutes'"
  echo "(0 or a handful is fine - the switch itself takes a few seconds)"
  ;;

after)
  say "1. Deployed version"
  echo "release: $(readlink -e "$APP_ROOT/current")"
  curl -fsS "http://127.0.0.1:$PORT/version.json" && echo
  pm2 describe "$APP_NAME" | grep -E "status|restarts|uptime" | head -3 || true

  say "2. Database migrations (latest 3)"
  sql -c "select name, applied_at::timestamp(0) from app_migrations order by name desc limit 3"

  say "3. Pages answer"
  for p in / /quizzes /leaderboard /login /admin/login /api/globals/quiz-settings; do
    printf '%-32s %s\n' "$p" "$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:$PORT$p")"
  done
  printf '%-32s %s (want 403)\n' "/api/users (no login)" "$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:$PORT/api/users")"

  say "4. Recent errors in the app log (empty is good)"
  pm2 logs "$APP_NAME" --err --lines 15 --nostream 2>/dev/null | grep -v "^\s*$" | tail -15 || true
  ;;

rollback)
  live="$(readlink -e "$APP_ROOT/current")"
  prev="$(ls -1dt "$APP_ROOT"/releases/*/ | sed 's:/$::' | grep -vx "$live" | head -n1 || true)"
  [ -n "$prev" ] || { echo "No previous release folder to go back to."; exit 1; }
  say "Switching back: $(basename "$live") -> $(basename "$prev")"
  ln -sfn "$prev" "$APP_ROOT/current.tmp" && mv -Tf "$APP_ROOT/current.tmp" "$APP_ROOT/current"
  PORT=$PORT NODE_ENV=production pm2 reload "$APP_NAME" --update-env
  sleep 5
  curl -fsS "http://127.0.0.1:$PORT/version.json" && echo
  pm2 save >/dev/null
  echo "Done. The new database column (migration 007) can stay - the older code ignores it."
  ;;

*)
  sed -n 2,9p "$0"; exit 1 ;;
esac
