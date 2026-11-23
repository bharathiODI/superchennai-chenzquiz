#!/usr/bin/env bash
# ONE-TIME setup of the DEMO site (internal testing) on the VPS, next to the live site.
# Run on the server as root:
#
#   bash demo-setup.sh                  set everything up (safe to run again - skips what exists)
#   bash demo-setup.sh --refresh-data   copy live content into the demo database again
#                                       (replaces demo content; demo players/scores are removed)
#
# What it creates (the live site and its database are only READ, never changed):
#   /var/www/chenzquiz-demo/{releases,shared/.env,shared/media}
#   database chenzquiz_demo   - copy of live: pages, quizzes, questions, settings, media, CMS
#                               logins. NO players, scores or form entries.
#   Apache site https://chenzquiz-demo.superchennai.com -> port 3017, hidden from search engines
# The demo app itself is started by the first GitHub deploy of the `demo` branch.
#
# Settings (override like: DEMO_DOMAIN=quiz-demo.superchennai.com bash demo-setup.sh)
set -Eeuo pipefail
cd /  # start somewhere that always exists: a deploy deletes old release folders, and pm2 fails if the shell was inside one

DEMO_DOMAIN="${DEMO_DOMAIN:-chenzquiz-demo.superchennai.com}"
DEMO_ROOT="${DEMO_ROOT:-/var/www/chenzquiz-demo}"
DEMO_PORT="${DEMO_PORT:-3017}"
DEMO_DB="${DEMO_DB:-chenzquiz_demo}"
DEMO_APP="${DEMO_APP:-chenzquiz-demo}"
LIVE_ROOT="${LIVE_ROOT:-/var/www/chenzquiz}"
SKIP_WEB="${SKIP_WEB:-0}"   # 1 = don't touch Apache/SSL (testing)
REFRESH=0
[ "${1:-}" = "--refresh-data" ] && REFRESH=1

say() { printf '\n\033[1;36m==> %s\033[0m\n' "$*"; }
ok() { printf '    %s\n' "$*"; }
fail() { printf '\n\033[1;31mERROR: %s\033[0m\n' "$*" >&2; exit 1; }

[ "$(id -u)" = 0 ] || fail "run this as root"
[ -f "$LIVE_ROOT/shared/.env" ] || fail "$LIVE_ROOT/shared/.env not found - is the live site set up?"
[ -d "$LIVE_ROOT/current/node_modules" ] || fail "$LIVE_ROOT/current/node_modules not found"
for cmd in node psql pg_dump rsync openssl shuf; do command -v "$cmd" >/dev/null || fail "'$cmd' is not installed"; done
[[ "$DEMO_DB" =~ ^[a-z][a-z0-9_]*$ ]] || fail "DEMO_DB must be lower-case letters, digits and _"

# ---- 1. Port -------------------------------------------------------------------------------
say "1. Port $DEMO_PORT"
if command -v ss >/dev/null && [ -n "$(ss -ltnH "sport = :$DEMO_PORT" 2>/dev/null)" ]; then
  if command -v pm2 >/dev/null && pm2 describe "$DEMO_APP" >/dev/null 2>&1; then
    ok "in use by the demo app ($DEMO_APP) - fine"
  else
    fail "port $DEMO_PORT is used by another app. Pick a free one: DEMO_PORT=3018 bash demo-setup.sh (and set DEMO_PORT=3018 in GitHub > Settings > Variables)"
  fi
else
  ok "free"
fi

# ---- 2. Database ---------------------------------------------------------------------------
say "2. Database $DEMO_DB"
# Read the live connection the way the app does (dotenv), from the live app folder.
LIVE_URI="$(cd "$LIVE_ROOT/current" && node -e 'require("dotenv").config({ path: process.argv[1], quiet: true }); process.stdout.write(process.env.DATABASE_URI || "")' "$LIVE_ROOT/shared/.env")"
[ -n "$LIVE_URI" ] || fail "DATABASE_URI not found in $LIVE_ROOT/shared/.env"
read -r LIVE_DB DB_ROLE DEMO_URI < <(node -e '
  const u = new URL(process.argv[1]); const live = decodeURIComponent(u.pathname.slice(1));
  const role = decodeURIComponent(u.username); u.pathname = "/" + process.argv[2];
  process.stdout.write([live, role, u.toString()].join(" ") + "\n")' "$LIVE_URI" "$DEMO_DB")
[ "$LIVE_DB" != "$DEMO_DB" ] || fail "demo database name is the same as live ($LIVE_DB)"
ok "live: $LIVE_DB (read only)   demo: $DEMO_DB (owner $DB_ROLE)"

pg_admin() { sudo -u postgres psql -X -q -v ON_ERROR_STOP=1 "$@"; }
exists="$(pg_admin -Atc "SELECT 1 FROM pg_database WHERE datname = '$DEMO_DB'")"
copy=0
if [ -z "$exists" ]; then
  pg_admin -c "CREATE DATABASE \"$DEMO_DB\" OWNER \"$DB_ROLE\""
  ok "created"
  copy=1
elif [ "$REFRESH" = 1 ]; then
  command -v pm2 >/dev/null && pm2 stop "$DEMO_APP" >/dev/null 2>&1 && ok "stopped $DEMO_APP while the data is replaced"
  pg_admin -c "DROP DATABASE \"$DEMO_DB\" WITH (FORCE)"
  pg_admin -c "CREATE DATABASE \"$DEMO_DB\" OWNER \"$DB_ROLE\""
  ok "emptied for a fresh copy"
  copy=1
else
  ok "already exists - kept as it is (use --refresh-data to copy live content again)"
fi

if [ "$copy" = 1 ]; then
  ok "copying live content..."
  pg_dump "$LIVE_URI" --no-owner --no-privileges | psql "$DEMO_URI" -X -q -v ON_ERROR_STOP=1 >/dev/null
  ok "copied $(psql "$DEMO_URI" -X -Atc "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public'") tables"

  ok "removing players, scores and form entries from the DEMO copy..."
  # launch-reset reads DATABASE_URI; run it from /tmp so no .env can point it anywhere else.
  out="$(cd /tmp && DATABASE_URI="$DEMO_URI" node "$LIVE_ROOT/current/scripts/launch-reset.mjs" --confirm)"
  grep -q "Database: $DEMO_DB " <<<"$out" || { echo "$out"; fail "wipe did not run on $DEMO_DB - stopped"; }
  ok "all players, rounds, scores and form entries removed from the demo copy"

  psql "$DEMO_URI" -X -q -c "UPDATE quiz_site_settings SET test_players_allow_test_logins = true" 2>/dev/null &&
    ok "test player logins switched on (Quiz Site Settings)"
fi

# ---- 3. Folders, .env, media ---------------------------------------------------------------
say "3. $DEMO_ROOT"
mkdir -p "$DEMO_ROOT/releases" "$DEMO_ROOT/shared/media"
ENV_FILE="$DEMO_ROOT/shared/.env"
if [ -f "$ENV_FILE" ]; then
  ok ".env exists - kept as it is"
else
  # Copy the live .env, then point it at the demo: database, address, its own secret, test OTP.
  node - "$LIVE_ROOT/shared/.env" "$ENV_FILE" "$DEMO_URI" "https://$DEMO_DOMAIN" "$(openssl rand -hex 32)" "$(shuf -i 100000-999999 -n 1)" <<'NODE'
const fs = require('fs')
const [src, dest, uri, url, secret, otp] = process.argv.slice(2)
const set = { DATABASE_URI: uri, NEXT_PUBLIC_SERVER_URL: url, PAYLOAD_SECRET: secret, SITE_ENV: 'demo' }
const seen = new Set()
const lines = fs.readFileSync(src, 'utf8').split(/\r?\n/).map((line) => {
  const m = line.match(/^(\s*(?:export\s+)?)([A-Za-z_][A-Za-z0-9_]*)(\s*=\s*)(.*)$/)
  if (!m) return line
  const [, pre, key, eq] = m
  seen.add(key)
  if (key in set) return `${pre}${key}${eq}${set[key]}`
  return line.replace(/chenzquiz\.superchennai\.com/g, new URL(url).host)
})
for (const k of Object.keys(set)) if (!seen.has(k)) lines.push(`${k}=${set[k]}`)
if (!seen.has('TEST_OTP')) lines.push(`TEST_OTP=${otp}`)
lines.unshift(`# DEMO site (internal testing) - made by scripts/demo-setup.sh on ${new Date().toISOString().slice(0, 10)} from the live .env`)
fs.writeFileSync(dest, lines.join('\n') + '\n', { mode: 0o600 })
NODE
  chmod 600 "$ENV_FILE"
  ok ".env created (demo database, https://$DEMO_DOMAIN, its own PAYLOAD_SECRET)"
fi
TEST_OTP_VALUE="$(cd "$LIVE_ROOT/current" && node -e 'require("dotenv").config({ path: process.argv[1], quiet: true }); process.stdout.write(process.env.TEST_OTP || "")' "$ENV_FILE")"
grep -qE '^\s*(SMTP_|FORM_)' "$ENV_FILE" && ok "note: email settings (SMTP_/FORM_ lines) were copied from live - edit them in $ENV_FILE if demo forms must not email the real recipients"

if [ "$copy" = 1 ] || [ -z "$(ls -A "$DEMO_ROOT/shared/media" 2>/dev/null)" ]; then
  rsync -a "$LIVE_ROOT/shared/media/" "$DEMO_ROOT/shared/media/"
  ok "media copied ($(find "$DEMO_ROOT/shared/media" -type f | wc -l) files)"
fi

# ---- 4. Apache + SSL -----------------------------------------------------------------------
say "4. https://$DEMO_DOMAIN"
if [ "$SKIP_WEB" = 1 ]; then
  ok "skipped (SKIP_WEB=1)"
else
  command -v apache2ctl >/dev/null || fail "Apache (apache2ctl) not found"
  SITE="/etc/apache2/sites-available/$DEMO_DOMAIN.conf"
  if [ ! -f "$SITE" ]; then
    cat > "$SITE" <<APACHE
<VirtualHost *:80>
    ServerName $DEMO_DOMAIN

    ProxyPreserveHost On
    ProxyRequests Off
    ProxyPass / http://localhost:$DEMO_PORT/
    ProxyPassReverse / http://localhost:$DEMO_PORT/

    # Internal testing site: keep it out of search results
    Header always set X-Robots-Tag "noindex, nofollow"

    ErrorLog \${APACHE_LOG_DIR}/error_chenzquiz_demo.log
    CustomLog \${APACHE_LOG_DIR}/access_chenzquiz_demo.log combined
</VirtualHost>
APACHE
    ok "wrote $SITE"
  else
    ok "$SITE exists - kept"
  fi
  a2enmod -q proxy proxy_http headers >/dev/null
  a2ensite -q "$DEMO_DOMAIN" >/dev/null
  apache2ctl configtest >/dev/null 2>&1 || { apache2ctl configtest; fail "Apache config test failed - nothing reloaded"; }
  systemctl reload apache2
  ok "Apache reloaded"

  SERVER_IPS="$(hostname -I)"
  DNS_IP="$(getent ahostsv4 "$DEMO_DOMAIN" | awk 'NR==1{print $1}')"
  if [ -f "/etc/letsencrypt/live/$DEMO_DOMAIN/fullchain.pem" ]; then
    ok "SSL certificate already there"
  elif [ -n "$DNS_IP" ] && grep -qw "$DNS_IP" <<<"$SERVER_IPS"; then
    certbot --apache -d "$DEMO_DOMAIN" --redirect --non-interactive --agree-tos --keep-until-expiring \
      && ok "SSL certificate issued" || ok "certbot failed - run: certbot --apache -d $DEMO_DOMAIN --redirect"
  else
    ok "DNS for $DEMO_DOMAIN does not point here yet (${DNS_IP:-no record}; this server: $SERVER_IPS)."
    ok "Add an A record  $DEMO_DOMAIN -> $(awk '{print $1}' <<<"$SERVER_IPS")  then run this script again for SSL."
  fi
fi

# ---- 5. Next steps -------------------------------------------------------------------------
cat <<MSG

==================================================================================
Demo site is set up. Next:
==================================================================================
1. Deploy the code: push the demo branch (or re-run the failed "Deploy" run for demo in
   GitHub > Actions). GitHub builds it here and starts PM2 app "$DEMO_APP" on port $DEMO_PORT.
2. After that first deploy, create the hidden test players:
     cd $DEMO_ROOT/current && npm run seed
3. Open https://$DEMO_DOMAIN  (CMS: https://$DEMO_DOMAIN/admin - same admin logins as live)
   Test players: +91 00000 00001 ... 00005, OTP ${TEST_OTP_VALUE:-"(set TEST_OTP in $ENV_FILE)"}
MSG
