# Deployment

Every push to `main` (including a merged pull request) deploys to
**chenzquiz.superchennai.com** via GitHub Actions (`.github/workflows/deploy.yml`).
You can also redeploy by hand: **Actions > Deploy to production > Run workflow**.

## How it works

1. GitHub Actions uploads the code to a new folder on the VPS: `/var/www/chenzquiz/releases/<time>-<commit>`.
2. `scripts/deploy.sh` runs there: links the shared `.env` and uploaded media, `npm ci`,
   applies new database migrations (`migrations/*.sql`), then `npm run build`.
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

## Database changes (migrations)

Production never changes the database schema by itself. New tables and columns go in
`migrations/NNN_name.sql`; every deploy runs `npm run db:migrate` (`scripts/db-migrate.mjs`) before
the build. It applies the files that haven't run yet, each in a transaction, and records them in the
`app_migrations` table. Migrations must be additive and repeatable (`IF NOT EXISTS`), so the old
release keeps working while the new one builds.

Writing one: change the Payload config, then generate the SQL from the schema diff (compare the
Drizzle snapshot of `main` with yours, see `migrations/001_quiz_site_settings.sql`), wrap any
`CREATE TYPE` in a `DO $$ ... EXCEPTION WHEN duplicate_object` block, and test it on a copy of the
live database with `npm run db:migrate`.

(`payload migrate` isn't used: on a database that was ever schema-pushed in dev mode it waits for a
yes/no answer, which an unattended deploy can't give.)

## Seed data

```bash
cd /var/www/chenzquiz/current && npm run seed      # locally: npm run db:migrate && npm run seed
```

Safe to run any number of times; it never changes data that already exists:
- **Quiz Site Settings**: imports the default text and options the first time
- **Test players**: creates Test Player 1-5 (see below)

## CMS settings

Admin > Globals > **Quiz Site Settings** controls:
- **Login & Sign up**: headings, side panel text, Terms/Privacy links, "Email is required",
  "Show the Message field"
- **Quizzes page**: badge, heading, description, "no quiz today" text
- **Leaderboard**: heading, description, empty text, players per page, the tab shown first
- **Test players**: allow / block test logins

Saving refreshes `/login`, `/quizzes` and `/leaderboard` immediately. If the settings can't be read,
the pages fall back to the built-in defaults (`src/globals/QuizSiteSettings/defaults.ts`).

## Test players

Numbers `0000000001` to `0000000010` (stored as `+910000000001` ...) are reserved for testing
(`src/utilities/testPlayers.ts`). They are hidden from the leaderboard and the `/dashboard` stats,
and they log in with a fixed code instead of an SMS.

1. Turn test logins on (once): add a 6-digit code to the server env and restart the app
   ```bash
   echo "TEST_OTP=$(shuf -i 100000-999999 -n 1)" >> /var/www/chenzquiz/shared/.env
   pm2 restart chenzquiz-superchennai
   grep TEST_OTP /var/www/chenzquiz/shared/.env
   ```
2. Create the players: `npm run seed` (see above).
3. Log in at `/login` with e.g. `0000000001` and the TEST_OTP code. Test logins can be blocked from
   the CMS (Quiz Site Settings > Test players) or by removing the `TEST_OTP` line and restarting.
