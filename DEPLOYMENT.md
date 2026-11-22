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

An **empty** database gets the whole schema from `migrations/baseline/schema-after-NNN.sql` first
(then migrations up to NNN are marked as applied). When a new migration changes the schema,
regenerate the baseline from the schema (empty snapshot -> current) and bump NNN.

## Setting up another machine

The app never creates tables on its own (`push: false`), so a database that is missing tables shows
errors like `Failed query: select "pages"."id" ... "pages__blocks_builderSection"`. Fix: run
`npm run db:migrate` against that database.

With data (recommended, same content as live or as your machine):
```bash
# on the machine that has the data (Postgres bin folder on PATH, or use the full path)
pg_dump -h localhost -U postgres --no-owner --no-privileges -f chenzquiz.sql chenzquiz
# on the new machine
createdb -U postgres chenzquiz
psql -U postgres -d chenzquiz -f chenzquiz.sql
# .env: DATABASE_URI=postgres://postgres:<password>@localhost:5432/chenzquiz
npm install
npm run db:migrate      # brings an older backup up to date; does nothing if already current
npm run dev
```

Empty (no content): `createdb chenzquiz`, set `DATABASE_URI`, `npm install`, `npm run db:migrate`
(creates every table), `npm run dev`, create the first admin at `/admin`, then `npm run seed`.
Pages (including Home) then have to be created in the CMS.

Never commit a database dump: it contains players' phone numbers. Keep it in `_local/`.

## Launch wipe (one time)

Deletes all player data so the contest starts from zero: players (including test players), quiz
attempts, daily rounds, scores/XP/streaks, user submissions and form entries. Keeps admin logins,
pages, media, quizzes, questions and all settings. Player IDs are not reused, so old test logins
can't turn into new players' accounts.

```bash
cd /var/www/chenzquiz/current
set -a; . /var/www/chenzquiz/shared/.env; set +a
pg_dump "$DATABASE_URI" -Fc -f /root/chenzquiz-before-launch-wipe.dump   # backup first
npm run launch:reset                 # shows what would be deleted, changes nothing
npm run launch:reset -- --confirm    # deletes it
npm run seed                         # re-creates the hidden test players
```

## Seed data

```bash
cd /var/www/chenzquiz/current && npm run seed      # locally: npm run db:migrate && npm run seed
```

Safe to run any number of times; it never changes data that already exists:
- **Quiz Site Settings**: imports the default text and options the first time
- **Test players**: creates Test Player 1-5 (see below)

## CMS settings

Admin > Globals > **Quiz Site Settings** controls:
- **Login & Sign up**: headings, side panel text, "Email is required", "Show the Message field"
- **Quizzes page**: badge, heading, description, "no quiz today" text
- **Leaderboard**: heading, description, empty text, players per page, "Show Daily / Weekly /
  Monthly tabs" (off = All Time only), the tab shown first
- **Terms & Conditions**: the pop-up opened from the sign-up checkbox (title, agree button, text)
- **Test players**: allow / block test logins

Admin > Globals > **Quiz Settings** controls player titles (XP thresholds), the time limit per game
type, the speed bonus (on/off and tiers) and the share scorecard. Points per question, negative
points, difficulty and Double Up are set on each question; rounds per day, questions per round and
the sponsored question on each quiz.

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
