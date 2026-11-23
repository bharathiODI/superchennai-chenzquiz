#!/usr/bin/env bash
# Site controls for chenzquiz. Run ON THE SERVER as root. Add "demo" to work on the demo site.
#
#   bash chenzquiz-site.sh status [demo]                     maintenance on/off, players mid-round, database
#   bash chenzquiz-site.sh playing [demo]                    who is mid-round right now
#   bash chenzquiz-site.sh maintenance on|off [demo] ["msg"] no new games or logins while on (no restart)
#   bash chenzquiz-site.sh demo-db live                      DEMO app uses the LIVE database (e.g. exports)
#   bash chenzquiz-site.sh demo-db demo                      DEMO back on its own database
#   bash chenzquiz-site.sh demo-ips "1.2.3.4 5.6.7.0/24"     only these IPs can open the demo site
#   bash chenzquiz-site.sh demo-ips open                     anyone with the link can open the demo
#
# Safe deploy: maintenance on -> wait until "playing" shows 0 -> merge/deploy -> maintenance off.
# The same switch is in the CMS dashboard (Site status).
set -Eeuo pipefail
cd /  # start somewhere that always exists: a deploy deletes old release folders, and pm2 fails if the shell was inside one

LIVE_ROOT=/var/www/chenzquiz
DEMO_ROOT=/var/www/chenzquiz-demo
DEMO_APP=chenzquiz-demo
DEMO_PORT=3017
DEMO_DOMAIN=chenzquiz-demo.superchennai.com
DEMO_ACCESS_CONF=/etc/apache2/chenzquiz-demo-access.conf

say() { printf '\n\033[1;36m== %s\033[0m\n' "$*"; }
fail() { printf '\n\033[1;31mERROR: %s\033[0m\n' "$*" >&2; exit 1; }
[ "$(id -u)" = 0 ] || fail "run this as root"

site_root() { [ "${1:-live}" = demo ] && echo "$DEMO_ROOT" || echo "$LIVE_ROOT"; }
# DATABASE_URI from a site's .env, read the way the app reads it (dotenv)
db_uri() {
  (cd "$LIVE_ROOT/current" && node -e 'require("dotenv").config({ path: process.argv[1], quiet: true }); process.stdout.write(process.env.DATABASE_URI || "")' "$1/shared/.env")
}
db_name() { node -e 'process.stdout.write(decodeURIComponent(new URL(process.argv[1]).pathname.slice(1)))' "$1"; }

write_flags() { # root on|off message
  node -e '
    const fs = require("fs"); const [file, on, msg] = process.argv.slice(1)
    const flags = { maintenance: on === "on", message: msg || undefined, since: new Date().toISOString(), by: "server (chenzquiz-site.sh)" }
    fs.writeFileSync(file, JSON.stringify(flags, null, 2) + "\n")' "$1/shared/site-flags.json" "$2" "${3:-}"
}
flags_state() { # prints "on" or "off"
  node -e 'try { process.stdout.write(JSON.parse(require("fs").readFileSync(process.argv[1], "utf8")).maintenance === true ? "on" : "off") } catch { process.stdout.write("off") }' "$1/shared/site-flags.json"
}

show_playing() { # root
  local uri; uri="$(db_uri "$1")"
  psql "$uri" -X -q -P footer=off -c "
    SELECT u.name AS player, u.phone, q.quiz_title AS quiz,
           to_char(r.created_at AT TIME ZONE 'Asia/Kolkata', 'HH24:MI') AS started,
           round(extract(epoch FROM now() - r.created_at) / 60) AS min_ago
      FROM quiz_rounds r JOIN quiz_users u ON u.id = r.user_id LEFT JOIN quizzes q ON q.id = r.quiz_id
     WHERE r.status = 'assigned' AND r.created_at > now() - interval '15 minutes'
     ORDER BY r.created_at DESC"
  printf 'Playing now: %s   (finished in the last 5 min: %s)\n' \
    "$(psql "$uri" -X -At -c "SELECT count(*) FROM quiz_rounds WHERE status = 'assigned' AND created_at > now() - interval '15 minutes'")" \
    "$(psql "$uri" -X -At -c "SELECT count(*) FROM quiz_rounds WHERE status = 'completed' AND completed_at > now() - interval '5 minutes'")"
}

wait_up() { # port
  local _
  for _ in $(seq 1 45); do
    curl -fsS -o /dev/null --max-time 3 "http://127.0.0.1:$1/login" 2>/dev/null && return 0
    sleep 2
  done
  return 1
}

set_env_line() { # file KEY value  (replace or add; value "" removes the line)
  node -e '
    const fs = require("fs"); const [file, key, val] = process.argv.slice(1)
    const re = new RegExp(`^\\s*(export\\s+)?${key}\\s*=`)
    let lines = fs.readFileSync(file, "utf8").split(/\r?\n/)
    const i = lines.findIndex((l) => re.test(l))
    if (val === "") lines = lines.filter((l) => !re.test(l))
    else if (i >= 0) lines[i] = `${key}=${val}`
    else { while (lines.length && lines[lines.length - 1] === "") lines.pop(); lines.push(`${key}=${val}`, "") }
    fs.writeFileSync(file, lines.join("\n"))' "$1" "$2" "$3"
}

cmd="${1:-}"
case "$cmd" in
status)
  root="$(site_root "${2:-}")"; uri="$(db_uri "$root")"
  say "$([ "${2:-}" = demo ] && echo DEMO || echo LIVE) site"
  echo "release:     $(readlink -e "$root/current" || echo '-')"
  echo "maintenance: $(flags_state "$root")"
  echo "database:    $(db_name "$uri")$([ -f "$root/shared/USING_LIVE_DB" ] && echo '   <-- the LIVE database (chenzquiz-site.sh demo-db demo to switch back)')"
  say "Players mid-round"
  show_playing "$root"
  ;;

playing)
  show_playing "$(site_root "${2:-}")"
  ;;

maintenance)
  state="${2:-}"; [ "$state" = on ] || [ "$state" = off ] || fail "use: maintenance on|off [demo] [\"message\"]"
  site="${3:-live}"; msg="${4:-}"
  if [ "$site" != demo ] && [ "$site" != live ]; then msg="$site"; site=live; fi
  root="$(site_root "$site")"
  write_flags "$root" "$state" "$msg"
  say "Maintenance $state on the $(tr a-z A-Z <<<"$site") site"
  if [ "$state" = on ]; then
    echo "New games and logins are paused; rounds already on screen can still be finished."
    echo "Wait until this shows 0, then deploy:  bash $0 playing $([ "$site" = demo ] && echo demo)"
    show_playing "$root"
  else
    echo "Players can play again."
  fi
  ;;

demo-db)
  target="${2:-}"; [ "$target" = live ] || [ "$target" = demo ] || fail "use: demo-db live|demo"
  ENV_FILE="$DEMO_ROOT/shared/.env"; SAVED="$DEMO_ROOT/shared/.env.demo-database"; MARK="$DEMO_ROOT/shared/USING_LIVE_DB"
  [ -f "$ENV_FILE" ] || fail "$ENV_FILE not found - set up the demo first (demo-setup.sh)"
  if [ "$target" = live ]; then
    [ -f "$MARK" ] && { echo "The demo already uses the live database."; exit 0; }
    live_uri="$(db_uri "$LIVE_ROOT")"; demo_uri="$(db_uri "$DEMO_ROOT")"
    [ -n "$live_uri" ] || fail "live DATABASE_URI not found"
    say "Switching the DEMO app to the LIVE database ($(db_name "$live_uri"))"
    # Migrations the demo code has that live hasn't had yet (their screens may error; exports work)
    missing=""
    for f in "$DEMO_ROOT"/current/migrations/[0-9]*.sql; do
      n="$(basename "$f")"
      [ "$(psql "$live_uri" -X -At -c "SELECT count(*) FROM app_migrations WHERE name = '$n'" 2>/dev/null || echo 0)" = 1 ] || missing="$missing $n"
    done
    [ -z "$missing" ] || echo "NOTE: live database hasn't had:$missing - CMS screens that need them may show errors on the demo until live is deployed. Score exports work."
    printf '%s\n' "$demo_uri" > "$SAVED"; chmod 600 "$SAVED"
    set_env_line "$ENV_FILE" DATABASE_URI "$live_uri"
    set_env_line "$ENV_FILE" SITE_DATA live
    was="$(flags_state "$DEMO_ROOT")"
    printf 'since=%s\nmaintenance_before=%s\n' "$(date -Is)" "$was" > "$MARK"
    # Nobody plays on live data through the demo: games and logins off on the demo
    write_flags "$DEMO_ROOT" on "The demo site is connected to live data - games are off."
    pm2 restart "$DEMO_APP" --update-env >/dev/null
    wait_up "$DEMO_PORT" || fail "demo app did not come back - check: pm2 logs $DEMO_APP"
    pm2 save >/dev/null 2>&1 || true
    cat <<MSG
Done. https://$DEMO_DOMAIN/admin now shows LIVE data (orange "live data" tags on the site and CMS).
  - Quiz Rounds > Download scores gives the live export.
  - CMS edits on the demo now change the LIVE site - only use it for exports/reading.
  - Games and logins are off on the demo. Deploys to the demo are blocked until you switch back:
      bash $0 demo-db demo
MSG
  else
    [ -f "$MARK" ] || { echo "The demo already uses its own database."; exit 0; }
    [ -f "$SAVED" ] || fail "$SAVED missing - can't restore the demo database address"
    say "Switching the DEMO app back to its own database"
    set_env_line "$ENV_FILE" DATABASE_URI "$(cat "$SAVED")"
    set_env_line "$ENV_FILE" SITE_DATA ""
    before="$(sed -n 's/^maintenance_before=//p' "$MARK")"
    write_flags "$DEMO_ROOT" "${before:-off}" ""
    rm -f "$MARK"
    pm2 restart "$DEMO_APP" --update-env >/dev/null
    wait_up "$DEMO_PORT" || fail "demo app did not come back - check: pm2 logs $DEMO_APP"
    pm2 save >/dev/null 2>&1 || true
    echo "Done. The demo uses $(db_name "$(db_uri "$DEMO_ROOT")") again; maintenance on the demo: $(flags_state "$DEMO_ROOT")."
  fi
  ;;

demo-ips)
  arg="${2:-}"; [ -n "$arg" ] || fail "use: demo-ips \"1.2.3.4 5.6.7.0/24\"   or   demo-ips open"
  sites=(/etc/apache2/sites-available/"$DEMO_DOMAIN".conf /etc/apache2/sites-available/"$DEMO_DOMAIN"-le-ssl.conf)
  for f in "${sites[@]}"; do [ -f "$f" ] || fail "$f not found - run demo-setup.sh first"; done
  if [ "$arg" = open ]; then
    body="# Demo site open to everyone (still not indexed by search engines)"
  else
    for ip in $arg; do [[ "$ip" =~ ^[0-9a-fA-F:.]+(/[0-9]{1,3})?$ ]] || fail "'$ip' is not an IP address or range"; done
    own="$(hostname -I)"
    body="# Only these addresses can open the demo site (this server is always allowed)
<Location />
    Require ip 127.0.0.1 ::1 $own $arg
</Location>
# Let's Encrypt must still reach the renewal check
<Location /.well-known/acme-challenge/>
    Require all granted
</Location>"
  fi
  backup="$(mktemp -d)"; cp "${sites[@]}" "$backup/"; [ -f "$DEMO_ACCESS_CONF" ] && cp "$DEMO_ACCESS_CONF" "$backup/access.conf"
  printf '# Managed by chenzquiz-site.sh demo-ips - do not edit by hand\n%s\n' "$body" > "$DEMO_ACCESS_CONF"
  for f in "${sites[@]}"; do
    grep -qF "Include $DEMO_ACCESS_CONF" "$f" || sed -i "0,/<\/VirtualHost>/s##    Include $DEMO_ACCESS_CONF\n</VirtualHost>#" "$f"
  done
  if ! apache2ctl configtest >/dev/null 2>&1; then
    apache2ctl configtest || true
    for f in "${sites[@]}"; do cp "$backup/$(basename "$f")" "$f"; done
    if [ -f "$backup/access.conf" ]; then cp "$backup/access.conf" "$DEMO_ACCESS_CONF"; else rm -f "$DEMO_ACCESS_CONF"; fi
    fail "Apache config test failed - put everything back, nothing changed"
  fi
  systemctl reload apache2
  code="$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "https://$DEMO_DOMAIN/login" || true)"
  say "Demo access: $([ "$arg" = open ] && echo 'open to everyone' || echo "only $arg")"
  echo "Check from this server: https://$DEMO_DOMAIN/login -> $code"
  [ -n "${SSH_CLIENT:-}" ] && echo "Your IP in this SSH session: ${SSH_CLIENT%% *}"
  ;;

*)
  sed -n 2,13p "$0"; exit 1 ;;
esac
