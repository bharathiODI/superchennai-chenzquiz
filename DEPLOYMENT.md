# Deployment

Every push to `main` (including a merged pull request) deploys to
**chenzquiz.superchennai.com** via GitHub Actions (`.github/workflows/deploy.yml`).
You can also redeploy by hand: **Actions > Deploy to production > Run workflow**.

## How it works

1. GitHub Actions uploads the code to a new folder on the VPS: `/var/www/chenzquiz/releases/<time>-<commit>`.
2. `scripts/deploy.sh` runs there: links the shared `.env` and uploaded media, `npm ci`,
   runs Payload migrations (if `src/migrations/` has any), then `npm run build`.
   **The live site keeps running during all of this.** A failed install/build changes nothing.
3. `current` is switched to the new release and PM2 (`chenzquiz-superchennai`, port 3007) restarts it
   (a few seconds of downtime).
4. Health check on `http://127.0.0.1:3007/version.json`. If the new release doesn't come up within
   90 seconds, the previous release is restored automatically and the workflow fails.
5. The last 3 releases are kept for quick rollback.

```
/var/www/chenzquiz/
  current -> releases/20261121-093000-abc1234
  releases/...
  shared/.env       production env (edit here, then redeploy)
  shared/media/     Payload uploads (public/media in every release links here)
```

Apache keeps proxying to port 3007 - no Apache changes needed.

## One-time setup

**1. On the VPS** (hPanel > VPS > Web console, as the user that runs PM2 - normally `root`):

```bash
curl -fsSL https://raw.githubusercontent.com/bharathiODI/superchennai-chenzquiz/main/scripts/server-setup.sh -o server-setup.sh
bash server-setup.sh
```

It creates `/var/www/chenzquiz`, copies the current `.env` and uploads from
`/var/www/chenzquiz.superchennai.com`, creates a deploy SSH key and prints the values for step 2.
The running site is not touched.

**2. In GitHub**: repo > Settings > Secrets and variables > Actions > *New repository secret*:

| Secret | Value |
| --- | --- |
| `DEPLOY_HOST` | VPS IP (printed by the script) |
| `DEPLOY_USER` | `root` (printed) |
| `DEPLOY_SSH_KEY` | the private key block (printed, including BEGIN/END lines) |
| `DEPLOY_KNOWN_HOSTS` | the host key line (printed) - recommended |
| `DEPLOY_PATH` | optional, defaults to `/var/www/chenzquiz` |
| `DEPLOY_PORT` | optional, defaults to `22` |

Then delete the private key from the server: `rm ~/.ssh/chenzquiz_deploy`.

**3. First deploy**: merge to `main` or use *Run workflow*. The first deploy finds whichever PM2 app is
serving port 3007 (on this server it was `chenzquiz-payload-cms`, running from
`/var/www/chenzquiz.superchennai.com`), copies any new uploads, stops that app and starts
`chenzquiz-superchennai` from `/var/www/chenzquiz/current`. The old app is deleted from PM2 only after
the new release passes its health check; if it fails, the old app is started again.
The old folder is left in place; delete it once you're happy.

## Rolling back

Re-run an older successful run from the Actions tab, or on the server:

```bash
cd /var/www/chenzquiz && ls -1t releases          # pick a release
ln -sfn /var/www/chenzquiz/releases/<release> current.tmp && mv -Tf current.tmp current
pm2 reload chenzquiz-superchennai --update-env
```

## Database changes

`payload.config.ts` has `push: false`, so schema changes (new collections, globals or fields) are not
applied automatically. Create a migration locally with `npx payload migrate:create <name>` and commit
`src/migrations/` - the deploy runs `payload migrate` before building.
