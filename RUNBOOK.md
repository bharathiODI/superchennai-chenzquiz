# Chenz Quiz - Runbook

All the important commands and notes in one place. Last updated 24 Nov 2026.
More detail: [DEPLOYMENT.md](DEPLOYMENT.md) (deploys, migrations, seed) and [README.md](README.md) (local setup).

---

## 1. At a glance

| | LIVE | DEMO (internal testing) |
|---|---|---|
| Site | https://chenzquiz.superchennai.com | https://chenzquiz-demo.superchennai.com |
| CMS | https://chenzquiz.superchennai.com/admin | https://chenzquiz-demo.superchennai.com/admin |
| Git branch | `main` | `demo` |
| Server folder | `/var/www/chenzquiz` | `/var/www/chenzquiz-demo` |
| PM2 app / port | `chenzquiz-superchennai` / 3007 | `chenzquiz-demo` / 3017 |
| Database | live (from `shared/.env`) | `chenzquiz_demo` |
| Settings file | `/var/www/chenzquiz/shared/.env` | `/var/www/chenzquiz-demo/shared/.env` |

- **Repo:** github.com/bharathiODI/superchennai-chenzquiz. Local copy: `D:\kavi\superchennai\chenzquiz`
- **Server:** `root@89.116.21.132` (srv820798). Server scripts are copied to `/root` (`chenzquiz-deploy.sh`, `chenzquiz-site.sh`, `demo-setup.sh`, fix scripts).
- **Deploys are automatic:** a push or merged pull request to `demo` deploys the demo; to `main` deploys live (GitHub > Actions > Deploy).
- **Release folders:** each deploy is a new folder in `releases/`; `current` points at the live one; the last 3 are kept.
- **Version check:** `https://<site>/version.json` shows the release that's running.

---

## 2. Golden rules

1. **Demo first.** Every change goes to `demo`, gets tested on the demo site, then demo is merged into `main`.
2. **Run server scripts from `/root`** (`cd /root` first). A deploy deletes old release folders, and a terminal still sitting in one makes pm2 crash (`ENOENT uv_cwd`).
3. **Never `source` a `.env` file in bash.** Lines like `FORM_CC_EMAIL = x` are fine for the app but break bash. The scripts read `.env` the way the app does.
4. **Never commit** `.env` files or database dumps (they hold players' phone numbers). Keep dumps in `_local/`.
5. **`TEST_OTP` lives only in the server `.env`.** Don't paste it in chats or code.
6. **On the demo, use test numbers only.** The demo sends real SMS, so typing a real player's number sends them a real OTP.
7. **Swap quiz questions only in the 11:30 PM - 12:30 AM break** (see section 8).
8. **Back up before anything risky:** `bash /root/chenzquiz-deploy.sh before` writes a database backup to `/var/www/backups/`.

---

## 3. Releasing a change (demo -> live)

**On your PC** (`D:\kavi\superchennai\chenzquiz`):
```powershell
git checkout demo
git pull
# ...make or bring in the change on demo...
git push origin demo            # the demo site redeploys in a few minutes (GitHub > Actions)
```
If the demo is switched to live data, deploys to the demo are blocked. Switch it back first: `bash /root/chenzquiz-site.sh demo-db demo`.

**Test on the demo:** test players (section 11), the CMS, and the Quiz Dashboard.

**Go live:**
```bash
cd /root
bash /root/chenzquiz-deploy.sh before     # backup + what's live + who is playing
```
1. On GitHub: **Pull requests > New**, set base `main` and compare `demo`, then **Create**, then **Merge**.
2. Wait for **Actions > Deploy** (the live run) to show a green tick (a few minutes; the site stays up).
3. Then run:
```bash
bash /root/chenzquiz-deploy.sh after      # migrations applied, pages answer, no errors
bash /root/chenzquiz-deploy.sh rollback   # ONLY if "after" shows a problem: previous release back
```

**Safest moment to deploy:** 11:30 PM - 12:30 AM (nobody can start a round). Or use maintenance:
```bash
bash /root/chenzquiz-site.sh maintenance on      # no new games/logins; rounds on screen can finish
bash /root/chenzquiz-site.sh playing             # wait until it shows 0
# ...deploy...
bash /root/chenzquiz-site.sh maintenance off
```

**Urgent live fix:** branch from `main`, make a pull request into `main`, and afterwards bring `main` into `demo`:
```bash
git checkout demo && git merge main && git push
```

---

## 4. Server commands

### Deploy safety - `chenzquiz-deploy.sh` (add `demo` for the demo site)
```bash
bash /root/chenzquiz-deploy.sh before [demo]     # backup to /var/www/backups + status
bash /root/chenzquiz-deploy.sh after [demo]      # checks after the GitHub deploy finished
bash /root/chenzquiz-deploy.sh rollback [demo]   # put the previous release back
```

### Site controls - `chenzquiz-site.sh` (add `demo` for the demo site)
```bash
bash /root/chenzquiz-site.sh status [demo]                     # maintenance, players mid-round, database
bash /root/chenzquiz-site.sh playing [demo]                    # who is mid-round right now
bash /root/chenzquiz-site.sh maintenance on|off [demo] ["msg"] # same switch as the CMS Site status box
bash /root/chenzquiz-site.sh demo-db copy-live                 # copy ALL live data into the demo's own DB (for testing)
bash /root/chenzquiz-site.sh demo-db live                      # demo app reads the LIVE database (exports/reading only)
bash /root/chenzquiz-site.sh demo-db demo                      # demo back on its own database
bash /root/chenzquiz-site.sh demo-ips "1.2.3.4 5.6.7.0/24"     # only these IPs can open the demo
bash /root/chenzquiz-site.sh demo-ips open                     # anyone with the link (still hidden from Google)
bash /root/chenzquiz-site.sh demo-tools on|off|key             # demo tools: test clock, log in as a test player, simulate players
```
- **`copy-live` vs `demo-db live`:**
  - `copy-live` gives the demo its own snapshot of live: players, scores, content, CMS logins and media. Games and logins work on it, and changes affect only the copy. The old demo data is backed up to `/root/_local/`. Run it again for fresher data.
  - `demo-db live` points the demo at the live database itself. Games and logins are then off on the demo, and CMS edits there change LIVE. Use it only for reading and exports, then switch back with `demo-db demo`.
- **Content-only refresh** (live content, no players or scores): `bash /var/www/chenzquiz-demo/current/scripts/demo-setup.sh --refresh-data`

### PM2 and logs
```bash
pm2 status
pm2 logs chenzquiz-superchennai --lines 100     # live app log (demo: chenzquiz-demo)
pm2 restart chenzquiz-superchennai --update-env # after editing shared/.env
```

### Updating the scripts in /root
The repo copies are in `scripts/`, and a copy is also kept in `D:\kavi\superchennai\server-conf\`. After a change, copy them to the server:
```powershell
scp D:\kavi\superchennai\server-conf\chenzquiz-site.sh D:\kavi\superchennai\server-conf\chenzquiz-deploy.sh root@89.116.21.132:/root/
```

---

## 5. Database and migrations

- **Every deploy backs up the database first:** `shared/backups/before-<release>.sql.gz` (the last 5 are kept). Restore one with `gunzip -c <file> | psql "$DATABASE_URI"` on an emptied database.
- **The app never changes tables by itself.** Every deploy runs `npm run db:migrate` (`scripts/db-migrate.mjs`), which applies the new files in `migrations/` in order and records them in the `app_migrations` table. It's safe to run again; it skips what's already done.
- **Do NOT use `npx payload migrate`.** It stops to ask yes/no on databases that were set up in dev mode.

| Migration | What it did |
|---|---|
| 001-006 | Site settings, quiz titles + daily rounds, scorecard, Payload 3.87, page builder, launch terms/scoring/leaderboard |
| 007 | Question order (Question Number) |
| 008 | Game day window (start time + break) |
| 009 | Game day starts **12:30 AM** (minutes field); T&C text 8:00 AM -> 12:30 AM |
| 010-011 | WordPress roles (Super Admin ... Viewer); admins -> Super Admin, old "client" -> Viewer; "Created by" on questions and posts |
| 012 | Lean setup, new columns and tables only: Use in, Round layout, answers, play fields, Disqualified, fair-play settings |
| 013 | Lean setup, data: questions in the sponsored schedule -> Sponsored; pool questions -> that quiz; published questions in no pool and no schedule -> Not in play; Round layout from the old settings. Nothing is deleted |
| 014 | DRA questions 22, 29, 35 (DRA banner image, tagged General by 013) -> Sponsored, only while they still carry the banner |

**On any machine** (it uses `DATABASE_URI` from that machine's `.env`):
```bash
npm run db:migrate
# "Applying 0NN_..." for each new file, or "Database is up to date (N migration(s) applied)."
```

**Backup / restore (manual):**
```bash
pg_dump -h localhost -U postgres --no-owner --no-privileges -f _local/chenzquiz.sql chenzquiz
createdb -U postgres chenzquiz && psql -U postgres -d chenzquiz -f _local/chenzquiz.sql
npm run db:migrate          # bring an older copy up to date
```

**Writing a new migration:** add `migrations/0NN_name.sql`. Keep it additive and repeatable (`IF NOT EXISTS`, `DO $$ ... EXCEPTION WHEN duplicate_object`). Test it on a copy of live, then on the demo, before it goes live. A new Postgres enum value needs its own file, because it can't be used in the same transaction that adds it.

---

## 6. Local development (any machine)

```powershell
git clone https://github.com/bharathiODI/superchennai-chenzquiz.git   # once
cd superchennai-chenzquiz
git checkout demo
git pull
npm install
# .env: DATABASE_URI=postgres://postgres:<password>@127.0.0.1:5432/chenzquiz  (+ the other secrets)
npm run db:migrate
npm run dev                                   # http://localhost:3000  (CMS at /admin)
```
- **Empty database:** create it first (`CREATE DATABASE chenzquiz;`), then run `npm run db:migrate`, which builds every table. The **first account you create becomes Super Admin**. Then run `npm run seed` (default settings + test players).
- **Windows one-shot setup with a dump:** put the dump in `db\`, then run `powershell -ExecutionPolicy Bypass -File .\scripts\setup-local.ps1`.
- **After changing collections or fields:** run `npm run generate:types` and `npm run generate:importmap`.
- **Images:** they live in `public/media/` (not in git); copy them from the server if you need them.

---

## 7. Game rules (what players get)

Lean setup from 25 Nov 2026. Plan and diagrams: https://claude.ai/artifact/NKfhERTyz8r8jcxN9bfnN1

| Rule | Value |
|---|---|
| Live quiz | **One at a time.** A second quiz can't be set to Scheduled / Active in the same dates. |
| Pool | **Every published question of the live quiz** whose *Use in* is General, Sponsored or Both. No pool list to maintain. |
| Per day | **One play per player per day**, laid out by the quiz's **Round layout** (default: Q1 General, Q2 General, Q3 Sponsored +10 s, DRA Homes). |
| Questions | Each slot gets a **random question this player has never been given** that fits the slot (General slot: General or Both; Sponsored slot: Sponsored or Both). |
| Run out | No unseen Sponsored question left: an unseen General one, badge kept. Nothing unseen at all: the one the player saw longest ago (a repeat). Keep the bank topped up. |
| Answers | Checked and timed **on the server**. The browser never gets the right answer or the explanation before the player answers. Options shuffled per player (setting). |
| One at a time | No Back or Skip. A reload resumes the same question with the time left. Time runs out = 0 points. |
| Game day | **12:30 AM to 12:30 AM India time**; break **11:30 PM - 12:30 AM** (no new plays; a play on screen can finish) |
| Timer | Quiz Settings > time limit per game (MCQ 20 s) + the slot's extra time |
| Points | Question points (10) + speed bonus 1-5 (none under 1.5 s); slot set to Fixed = no speed bonus; Double Up x2; wrong = minus negative points (0) |
| Fair play | Flags, not bans: **Too fast** (day finished under 6 s) and **Linked numbers** (2+ numbers on one phone within 60 min) on Quiz Rounds. Tick **Disqualified** on a player to take them off the leaderboard. |
| Streak | Game days in a row; stays alive if the player played today or yesterday |
| Leaderboard | Public, **top 50 only**, on every tab; test and disqualified players hidden |

All of these are in the CMS: the quiz (Round layout, dates, status), each question (*Use in*), and Settings > Quiz Settings > Game Timers & Scoring (game day, timers, speed bonus, **Fair play**). Changing the game day time or the speed bonus during the contest changes everyone's scores and days, so ask the developer first.

---

## 8. Adding questions

The CMS guide for the content team is at https://claude.ai/artifact/Aebp3j4RN4vePAvKReNnXs (written before the lean setup: there is no pool list or schedule any more).

1. **Add New Question:** Quiz = the live quiz (filled in for you), **Use in** = General (Q1/Q2), Sponsored (the DRA slot) or Both, then **Publish**. It's in play straight away.
2. **Add as many as you like at once** (all remaining days, or 30 every 10 days): players get random ones they haven't seen, so publishing early doesn't reveal a daily set.
3. **Keep a question out without unpublishing it:** Use in = **Not in play**.
4. **How many:** a daily player uses 2 General + 1 Sponsored a day. 90 days with no repeats = 180 General + 90 Sponsored.

- Don't rewrite an old question to reuse it: players who saw it still count it as seen. Add a new one (Duplicate is in the ... menu).
- "Schedule publish" doesn't work on this server (no job runner). Publish by hand.

---

## 9. CMS roles and accounts

| Role | Can |
|---|---|
| Super Admin | Everything, including other Super Admins |
| Administrator | Everything except Super Admin accounts: settings, Header/Footer, users, players and scores |
| Editor | Quizzes and question pool, everyone's questions, pages, posts, media; Quiz Dashboard |
| Author | Writes and publishes their own questions and posts; uploads media |
| Contributor | Writes their own questions/posts as drafts (no Publish button); an Editor publishes |
| Viewer | **Quiz Dashboard + Excel export only** (CMS home goes straight there) |
| No access | Can't open the CMS (blocked account) |

- **Add an account:** CMS > Users > **Add New User**, then set the email, role and a password you choose.
- **hello@superchennai.com** = **Viewer** (create it on demo first to check, then on live).
- **Super Admin rules:**
  - Only a Super Admin can give or take the Super Admin role.
  - The last Super Admin can't be demoted.
  - On an empty database, the first account becomes Super Admin.
- **Editing the T&C, Quiz Settings or Header/Footer** needs Administrator or above.

---

## 10. Reports and exports

| Where | Who | What |
|---|---|---|
| CMS > **Quiz Dashboard** | Super Admin, Admin, Editor, Viewer | Tabs below, with filters that update in place; **Export these N rows (Excel)** = exactly the filtered rows |
| Quiz Dashboard > **Full score report (Excel)** | same | Day-wise scores (score, time, played-at per day), daily ranking, every play |
| CMS > Players & Scores lists | Super Admin, Admin | Players, Plays, Answers, Finished plays: **Export filtered rows (Excel)** using the list's own search, filters and sort |

**Quiz Dashboard tabs:**
- **Players:** played on (Today, Yesterday, Last 7/30 days, This month, your own dates), show who played / didn't, joined dates, points, days played, current and best streak, search, sort. Click a name for the **player detail**: every play, each question, the answer given, right or wrong, points and seconds (answers are stored from 25 Nov 2026).
- **Plays:** one row per player per day: finished or opened-not-finished, score, correct, time (server clock), Too fast / Linked flags.
- **Questions:** how often each question was given, answered, % right, time-outs, average time. Sort by hardest or easiest to spot bad questions. Filter by Use in.
- **Sponsor report:** per game day, the sponsored slot: players who saw it, answered, % right, time-outs, average time. Export it for DRA.
- **Flags:** Too fast and Linked numbers (other numbers on the same phone). Administrators see **Disqualify / Clear** (takes a player off the leaderboard; nothing is deleted).
- **Header:** registered players, joined today, played today, opened today but not finished, finished plays, and a **data check** line (green when every player's total equals their finished plays).
- **Test players:** "Include test players" adds them (left out by default). The Excel file has a **Filters** sheet.

**Questions in the CMS:**
- **Import Questions** (Quiz menu, Editors and up): download the sample (Excel or CSV), fill one row per question (use_in, question, option_a ... option_f, correct as a letter, topic, explanation, points), **Check file** (row-by-row problems), then **Import** as Published or Drafts. A question already in the quiz is skipped.
- **Duplicate** (button next to Save/Publish on a question or quiz): the copy is a Draft titled "(copy)"; a question gets the next Question Number; a quiz keeps its Round layout. Players and their data can't be duplicated.
- **Settings:** the two Quiz settings pages share a tab bar: *Game, scoring & fair play* and *Site pages & logins*.

---

## 11. Test players

- **Numbers:** `0000000001` to `0000000010` (stored as `+910000000001` ...).
- **OTP:** use the `TEST_OTP` code in the site's `.env`. To see it:
  ```bash
  grep TEST_OTP /var/www/chenzquiz-demo/shared/.env     # demo
  grep TEST_OTP /var/www/chenzquiz/shared/.env          # live
  ```
- **Switching test logins on or off:** CMS > Settings > Quiz Site Settings > Test players. Removing the `TEST_OTP` line (then `pm2 restart ... --update-env`) also turns them off.
- **Where they don't count:** test players are hidden from the leaderboard and from dashboard counts unless you tick "Include test players".
- **Creating them:** `npm run seed` in the app folder (safe to repeat), or "Log in as" in the demo tools.

### Demo tools (demo site only)

Turn on once: `bash /root/chenzquiz-site.sh demo-tools on` (it prints the key). Then on https://chenzquiz-demo.superchennai.com click **Demo tools** (bottom right) and enter the key once.

- **Test clock:** Next day / Jump to day N / Set time (e.g. 00:29 to test the 12:30 AM change) / Back to today. The whole demo moves together: questions, the one-play-a-day rule, streaks, leaderboard tabs, dashboard. A yellow bar shows the pretend date.
- **Player:** log in as any of the 10 test numbers without an SMS; reset one or all of them.
- **Simulated players:** bots (+91 88888 xxxxx) play today's questions; they show on the demo leaderboard. "Remove simulated players" deletes them.
- **Safety:** the tools work only with the key **and** on a database marked as a demo database (`demo_flag` table, created by `demo-db copy-live` / `demo-db demo` / `demo-tools on`). On live, or while the demo uses the live database, they don't exist.

**Automatic 30-day run** (before every release to live):
```bash
cd /var/www/chenzquiz-demo/current
node scripts/demo-sim.mjs --url http://127.0.0.1:3017                                         # 10 players x 30 days (key read from the demo .env)
node scripts/demo-sim.mjs --url http://127.0.0.1:3017 --days 5 --players 3                                      # quick run
```
It plays the test players through pretend days and checks: no answer in the browser, Q3 sponsored, no repeats while unseen questions exist, reload resumes, time-outs score 0, one play a day, scores add up. Exit code 0 = all passed; the clock goes back to today.

---

## 12. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `ENOENT ... uv_cwd` from pm2 when running a script | The terminal was inside a release folder that a deploy deleted | `cd /root`, run it again. If a `demo-db` switch stopped halfway: `demo-db demo`, then run the switch again |
| `FORM_CC_EMAIL: command not found` | Someone ran `source .env` in bash | Don't source it; use the scripts (they read `.env` correctly) |
| Demo deploy fails: "USING_LIVE_DB" | The demo is switched to the live database | `bash /root/chenzquiz-site.sh demo-db demo`, then redeploy (Actions > Deploy > Run workflow > demo) |
| CMS error `Failed query: select ... pages__blocks...` | Database missing new tables | `npm run db:migrate` against that database |
| A player stays "logged in" with an old or deleted account | Old login saved in their browser | Ask them to log out and log in again (or clear the site's data in the browser) |
| Players see "You've played all the questions" during the day | No new published questions in the pool for them | Publish the day's drafts and check the Question Pool |
| A player got a question again | It was edited and published again while still in the pool | Remove old questions from the pool; don't edit answered questions |
| A score looks too high | - | Read-only check: `cd /var/www/chenzquiz/current && node /root/2026-11-23-check-high-scores.mjs` (`--over 25` for another limit) |
| Demo content is out of date | - | `bash /root/chenzquiz-site.sh demo-db copy-live` |

---

## 13. One-off fix scripts (history, in `scripts/fixes/`)

Run them from the live app folder: `cd /var/www/chenzquiz/current && node /root/<script>`. Without `--apply` they only show what they would do.

| Script | Date | What it was for |
|---|---|---|
| `2026-11-22-fix-mcq-answers.mjs` | 22 Nov | MCQ correct answers saved 1-based; `--apply`, `--apply --replay` |
| `2026-11-23-undo-repeat-rounds.mjs` | 23 Nov | Undid the overnight repeated rounds; `--apply` |
| `2026-11-23-check-high-scores.mjs` | 23 Nov | Read-only list of scores above a limit |
| `2026-11-25-check-data.mjs` | 25 Nov | Read-only: do totals, rounds and attempts add up; double plays; fast rounds; quizzes. `--all` for every row |
| `2026-11-25-merge-quiz.mjs` | 25 Nov | Merge "Day3 - Trivia" into TRIVIA. Dry run by default (lists double plays); `--apply` backs up first |
