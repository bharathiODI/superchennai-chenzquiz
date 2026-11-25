/**
 * Merge one quiz into another (25 Nov 2026): "Day3 - Trivia" (created by mistake) into "TRIVIA".
 * DRY RUN by default: shows what would change and lists the players who played both quizzes on
 * the same day (decision 2), then undoes everything. Add --apply to make the change.
 *
 *   cd /var/www/chenzquiz/current
 *   node /root/2026-11-25-merge-quiz.mjs                               # dry run, Day3 - Trivia -> TRIVIA
 *   node /root/2026-11-25-merge-quiz.mjs --apply                       # merge (backs up first)
 *   node /root/2026-11-25-merge-quiz.mjs --from "Day3 - Trivia" --to "TRIVIA"
 *
 * What moves to the target quiz: rounds, finished rounds (attempts), answers, and the questions
 * whose Quiz is the source. The source is set to Completed. Player totals, the leaderboard and
 * streaks don't change (they already count across quizzes). A player with a round in both
 * quizzes on the same day keeps both: the moved one becomes that day's round 2.
 */
import { createRequire } from 'node:module'
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const require = createRequire(path.join(process.cwd(), 'package.json'))
require('dotenv').config({ path: path.join(process.cwd(), '.env'), quiet: true })
const pg = require('pg')

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`)
  return i > 0 ? process.argv[i + 1] : fallback
}
const APPLY = process.argv.includes('--apply')
const FROM = arg('from', 'Day3 - Trivia')
const TO = arg('to', 'TRIVIA')
if (!process.env.DATABASE_URI) {
  console.error('DATABASE_URI is not set - run this from /var/www/chenzquiz/current')
  process.exit(1)
}

const db = new pg.Client({ connectionString: process.env.DATABASE_URI })
await db.connect()
const q = async (sql, params = []) => (await db.query(sql, params)).rows

const find = async (name) => {
  const rows = await q(
    /^\d+$/.test(name)
      ? 'SELECT id, quiz_title, status FROM quizzes WHERE id = $1'
      : 'SELECT id, quiz_title, status FROM quizzes WHERE lower(trim(quiz_title)) = lower(trim($1))',
    [name],
  )
  if (rows.length !== 1) {
    console.error(`Quiz "${name}": found ${rows.length}. Use the exact title or the quiz id.`)
    console.error('Quizzes:', (await q('SELECT id, quiz_title, status FROM quizzes ORDER BY id')).map((r) => `#${r.id} ${r.quiz_title} [${r.status}]`).join(', '))
    process.exit(1)
  }
  return rows[0]
}
const src = await find(FROM)
const dst = await find(TO)
if (src.id === dst.id) {
  console.error('Source and target are the same quiz.')
  process.exit(1)
}
console.log(`${APPLY ? 'MERGING' : 'DRY RUN'}: #${src.id} "${src.quiz_title}" [${src.status}]  ->  #${dst.id} "${dst.quiz_title}" [${dst.status}]\n`)

if (APPLY) {
  fs.mkdirSync('/root/_local', { recursive: true, mode: 0o700 })
  const file = `/root/_local/before-merge-quiz-${new Date().toISOString().slice(0, 16).replace(/[:T]/g, '')}.sql.gz`
  console.log(`Backup first: ${file}`)
  execSync(`pg_dump "${process.env.DATABASE_URI}" --no-owner --no-privileges | gzip > "${file}" && chmod 600 "${file}"`, { stdio: 'inherit', shell: '/bin/bash' })
}

const count = async (sql) => Number((await q(sql, [src.id]))[0].n)
const before = {
  rounds: await count('SELECT count(*) n FROM quiz_rounds WHERE quiz_id = $1'),
  attempts: await count('SELECT count(*) n FROM quiz_attempts WHERE quiz_id = $1'),
  answers: await count('SELECT count(*) n FROM quiz_answers WHERE quiz_id = $1').catch(() => 0),
  questions: await count('SELECT count(*) n FROM questions WHERE quiz_id = $1'),
}
const totalsBefore = (await q('SELECT coalesce(sum(total_x_p),0)::float s FROM quiz_users'))[0].s

const both = await q(
  `SELECT * FROM (
     SELECT DISTINCT ON (a.id) u.name, u.phone, a.day, a.score AS src_score,
            (SELECT sum(score) FROM quiz_rounds b WHERE b.user_id = a.user_id AND b.day = a.day AND b.quiz_id = $2) AS dst_score,
            a.id AS src_round
       FROM quiz_rounds a JOIN quiz_rounds b ON b.user_id = a.user_id AND b.day = a.day AND b.quiz_id = $2
       JOIN quiz_users u ON u.id = a.user_id
      WHERE a.quiz_id = $1) x ORDER BY day, name`,
  [src.id, dst.id],
)

await db.query('BEGIN')
try {
  // A round on a day the player also has in the target: numbered after the target's rounds that
  // day (target's last round + its own number, so two moved rounds never clash)
  for (const r of both) {
    await db.query(
      `UPDATE quiz_rounds SET round = round + (SELECT coalesce(max(round), 0) FROM quiz_rounds x WHERE x.user_id = quiz_rounds.user_id AND x.day = quiz_rounds.day AND x.quiz_id = $2)
        WHERE id = $1`,
      [r.src_round, dst.id],
    )
  }
  await db.query('UPDATE quiz_rounds SET quiz_id = $2 WHERE quiz_id = $1', [src.id, dst.id])
  await db.query('UPDATE quiz_attempts SET quiz_id = $2 WHERE quiz_id = $1', [src.id, dst.id])
  await db.query('UPDATE quiz_answers SET quiz_id = $2 WHERE quiz_id = $1', [src.id, dst.id]).catch(() => {})
  await db.query('UPDATE _questions_v SET version_quiz_id = $2 WHERE version_quiz_id = $1', [src.id, dst.id])
  await db.query('UPDATE questions SET quiz_id = $2 WHERE quiz_id = $1', [src.id, dst.id])
  await db.query("UPDATE quizzes SET status = 'completed' WHERE id = $1", [src.id])

  const after = {
    rounds: await count('SELECT count(*) n FROM quiz_rounds WHERE quiz_id = $1'),
    attempts: await count('SELECT count(*) n FROM quiz_attempts WHERE quiz_id = $1'),
    questions: await count('SELECT count(*) n FROM questions WHERE quiz_id = $1'),
  }
  const totalsAfter = (await q('SELECT coalesce(sum(total_x_p),0)::float s FROM quiz_users'))[0].s
  console.log(`Moves to "${dst.quiz_title}": ${before.rounds} rounds, ${before.attempts} finished rounds, ${before.answers} answers, ${before.questions} questions.`)
  console.log(`Left on "${src.quiz_title}" afterwards: ${after.rounds} rounds, ${after.attempts} finished rounds, ${after.questions} questions; status Completed.`)
  console.log(`Player totals unchanged: ${totalsBefore === totalsAfter ? 'yes' : `NO (${totalsBefore} -> ${totalsAfter})`}`)

  console.log(`\nPlayers with a round in BOTH quizzes on the same day: ${both.length} (decision 2 - their points are kept)`)
  both.forEach((r) => console.log(`  ${r.day}  ${r.name ?? '-'} ${r.phone ?? ''}: ${dst.quiz_title} ${r.dst_score ?? '-'} pts + ${src.quiz_title} ${r.src_score ?? '-'} pts`))

  if (APPLY && totalsBefore === totalsAfter && after.rounds === 0) {
    await db.query('COMMIT')
    console.log('\nMerged.')
  } else {
    await db.query('ROLLBACK')
    console.log(APPLY ? '\nSomething did not add up - nothing was changed.' : '\nDry run - nothing was changed. Add --apply to merge.')
  }
} catch (e) {
  await db.query('ROLLBACK')
  console.error('Failed - nothing was changed:', e.message)
  process.exitCode = 1
}
await db.end()
