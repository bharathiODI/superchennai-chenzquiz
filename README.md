# Chenz Quiz (Super Chennai)

Daily Chennai trivia at [chenzquiz.superchennai.com](https://chenzquiz.superchennai.com).
Next.js 15 + Payload CMS 3 (Postgres), Tailwind.

## Local setup (Windows)

Needs Node 20+ and PostgreSQL 16+.

1. Copy `.env.example` to `.env` and fill in `DATABASE_URI` (local Postgres) and the secrets.
2. Put a database dump (`*.sql` from `pg_dump`) in `db/` (git-ignored).
3. Run from the project root:

   ```powershell
   powershell -ExecutionPolicy Bypass -File .\scripts\setup-local.ps1
   ```

   It checks Node/Postgres, creates the database, imports the dump, installs packages and starts
   the dev server on http://localhost:3000 (admin at `/admin`). Add `-Reimport` to replace local data.

Uploaded images live in `public/media/` (git-ignored) and are not in the repo; copy them from the server.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run generate:types` | Regenerate `src/payload-types.ts` |
| `npm run generate:importmap` | Regenerate the admin import map |

## Project structure

```
src/
  app/(frontend)/   Site pages: quizzes, play/[slug], leaderboard, profile, login, CMS pages ([slug])
  app/(payload)/    Payload admin + REST/GraphQL API
  app/api/          Custom API routes (quiz-submit, quiz-check-played, quiz-users/*, scorecard, ...)
  collections/      Payload collections (Games = quizzes, questions, quiz users, attempts)
    Games/Blocks/   Home-page blocks (hero, how it works, FAQ, rewards, ...)
  globals/          Payload globals (Quiz Titles)
  components/       Shared UI (lexical renderer, quiz title badge, ...)
  utilities/        Helpers (quiz titles, streaks, email, sms)
scripts/            Local tooling
```

## Quiz titles

Player titles are based on total XP and are edited in admin under **Globals > Quiz Titles**
(defaults: Chennai Rookie 0-49, Namma Chennai Expert 50-149, Chennai Master 150+).

## Deployment

Live runs on the Super Chennai VPS behind Apache, managed by PM2 (`chenzquiz-superchennai`, port 3007).
The Postgres adapter has `push: false`, so schema changes (new collections, globals or fields)
need a Payload migration before deploying.
