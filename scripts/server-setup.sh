#!/usr/bin/env bash
# One-time setup on the VPS for automatic deploys. Run as the user that owns the PM2 apps:
#
#   bash server-setup.sh
#
# - creates /var/www/chenzquiz/{releases,shared}
# - copies the current production .env and uploaded media from the existing app folder
# - creates an SSH key that GitHub Actions uses to deploy, and prints the values to
#   paste into GitHub (repo > Settings > Secrets and variables > Actions)
# The running site is not touched; the first deploy switches PM2 over to the new layout.
set -Eeuo pipefail

APP_ROOT="${APP_ROOT:-/var/www/chenzquiz}"
OLD_APP="${OLD_APP:-/var/www/chenzquiz.superchennai.com}"
KEY="$HOME/.ssh/chenzquiz_deploy"

echo "==> Creating $APP_ROOT"
mkdir -p "$APP_ROOT/releases" "$APP_ROOT/shared/media"

if [ ! -f "$APP_ROOT/shared/.env" ]; then
  for f in .env .env.production .env.local; do
    if [ -f "$OLD_APP/$f" ]; then
      cp "$OLD_APP/$f" "$APP_ROOT/shared/.env"
      echo "    copied $OLD_APP/$f -> shared/.env"
      break
    fi
  done
fi
if [ -f "$APP_ROOT/shared/.env" ]; then
  chmod 600 "$APP_ROOT/shared/.env"
else
  echo "    WARNING: no .env found in $OLD_APP - create $APP_ROOT/shared/.env before the first deploy"
fi

if [ -d "$OLD_APP/public/media" ]; then
  echo "==> Copying uploaded media"
  rsync -a "$OLD_APP/public/media/" "$APP_ROOT/shared/media/"
  echo "    $(find "$APP_ROOT/shared/media" -type f | wc -l) files in shared/media"
fi

for cmd in node npm pm2 rsync curl; do
  command -v "$cmd" >/dev/null 2>&1 || echo "    WARNING: '$cmd' not found on PATH"
done

echo "==> Deploy key"
mkdir -p "$HOME/.ssh" && chmod 700 "$HOME/.ssh"
if [ ! -f "$KEY" ]; then
  ssh-keygen -t ed25519 -N "" -C "github-actions-chenzquiz" -f "$KEY" >/dev/null
fi
touch "$HOME/.ssh/authorized_keys" && chmod 600 "$HOME/.ssh/authorized_keys"
grep -qF "$(cat "$KEY.pub")" "$HOME/.ssh/authorized_keys" || cat "$KEY.pub" >> "$HOME/.ssh/authorized_keys"

HOST_IP="$(hostname -I | awk '{print $1}')"
cat <<MSG

==================================================================================
Add these in GitHub: repo > Settings > Secrets and variables > Actions > New secret
==================================================================================
DEPLOY_HOST         $HOST_IP
DEPLOY_USER         $(whoami)
DEPLOY_PATH         $APP_ROOT
DEPLOY_KNOWN_HOSTS  (the line below)
$(for k in /etc/ssh/ssh_host_ed25519_key.pub /etc/ssh/ssh_host_ecdsa_key.pub; do [ -f "$k" ] && echo "$HOST_IP $(cut -d' ' -f1,2 "$k")"; done)

DEPLOY_SSH_KEY      (everything between the lines, including BEGIN/END)
----------------------------------------------------------------------------------
$(cat "$KEY")
----------------------------------------------------------------------------------

After saving DEPLOY_SSH_KEY in GitHub you can delete the private key here:
  rm $KEY
MSG
