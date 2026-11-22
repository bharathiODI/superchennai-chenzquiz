#!/usr/bin/env node
/**
 * Launch-day fix (22 Nov 2026): today's three MCQ questions were saved with a 1-based
 * "Correct Option Index" (the field counts from 0), so every right answer was marked wrong.
 *
 * Run from the live app folder (uses its node_modules and .env):
 *   cd /var/www/chenzquiz/current
 *   node /root/2026-11-22-fix-mcq-answers.mjs                    # shows what it would do
 *   node /root/2026-11-22-fix-mcq-answers.mjs --apply            # fixes the three answers
 *   node /root/2026-11-22-fix-mcq-answers.mjs --apply --replay   # ...and lets today's players replay
 *
 * --replay: every round completed today that contained one of these questions is cleared - its
 * attempt is deleted and its score/time taken off the player's totals - so the player can play
 * the round again with the corrected answers. Rounds still in progress are left alone.
 * Everything runs in one transaction; a question that was already changed by hand is skipped.
 */
import { createRequire } from 'node:module'
import path from 'node:path'

const require = createRequire(path.join(process.cwd(), 'package.json'))
require('dotenv').config({ path: path.join(process.cwd(), '.env') })
const pg = require('pg')

const FIXES = [
  { id: 22, from: 3, to: 2, answer: 'Viswanathan Anand', title: "India's first Grandmaster" },
  { id: 23, from: 1, to: 0, answer: 'St. Thomas Mount', title: 'Suburban Railway, MRTS and Metro' },
  { id: 24, from: 1, to: 0, answer: 'DakshinaChitra', title: 'living-history museum' },
]

const apply = process.argv.includes('--apply')
const replay = process.argv.includes('--replay')
const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date())

if (!process.env.DATABASE_URI) {
  console.error('DATABASE_URI is not set - run this from /var/www/chenzquiz/current')
  process.exit(1)
}

const db = new pg.Client({ connectionString: process.env.DATABASE_URI })
await db.connect()

try {
  await db.query('BEGIN')
  console.log(`\n${apply ? 'APPLYING' : 'DRY RUN (nothing is changed)'} - IST day ${today}\n`)

  console.log('Correct answers')
  const fixedIds = []
  for (const f of FIXES) {
    const q = (
      await db.query('SELECT question_title, mcq_group_correct_option_index AS idx FROM questions WHERE id = $1', [f.id])
    ).rows[0]
    if (!q) {
      console.log(`  Q${f.id}: not found - skipped`)
      continue
    }
    const options = (
      await db.query('SELECT option_text FROM questions_mcq_group_options WHERE _parent_id = $1 ORDER BY _order', [f.id])
    ).rows.map((r) => r.option_text)
    const label = `  Q${f.id} "${String(q.question_title).slice(0, 50)}..."`
    if (!String(q.question_title).includes(f.title) || options[f.to] !== f.answer) {
      console.log(`${label}: question text or options differ from expected - skipped`)
      continue
    }
    fixedIds.push(f.id)
    if (Number(q.idx) === f.to) {
      console.log(`${label}: already correct (${f.answer})`)
      continue
    }
    if (Number(q.idx) !== f.from) {
      console.log(`${label}: index is ${q.idx}, changed since - skipped`)
      fixedIds.pop()
      continue
    }
    console.log(`${label}: ${options[f.from]} -> ${f.answer}`)
    await db.query('UPDATE questions SET mcq_group_correct_option_index = $1 WHERE id = $2', [f.to, f.id])
    // the admin edits the latest version, so keep it in step
    await db.query(
      'UPDATE _questions_v SET version_mcq_group_correct_option_index = $1 WHERE parent_id = $2 AND latest = true',
      [f.to, f.id],
    )
  }

  console.log(`\nRounds completed today with these questions${replay ? '' : ' (cleared only with --replay)'}`)
  const rounds = fixedIds.length
    ? (
        await db.query(
          `SELECT DISTINCT r.id, r.user_id, r.quiz_id, r.round, r.score, u.name
             FROM quiz_rounds r
             JOIN quiz_rounds_rels rr ON rr.parent_id = r.id AND rr.questions_id = ANY($1::int[])
             LEFT JOIN quiz_users u ON u.id = r.user_id
            WHERE r.day = $2 AND r.status = 'completed'
            ORDER BY r.id`,
          [fixedIds, today],
        )
      ).rows
    : []
  if (!rounds.length) console.log('  none')
  for (const r of rounds) {
    const attempts = (
      await db.query(
        `SELECT id, score, time_taken FROM quiz_attempts
          WHERE user_id = $1 AND quiz_id = $2 AND round = $3
            AND (completed_at AT TIME ZONE 'Asia/Kolkata')::date = $4::date`,
        [r.user_id, r.quiz_id, r.round, today],
      )
    ).rows
    const score = attempts.reduce((s, a) => s + (Number(a.score) || 0), 0)
    const time = attempts.reduce((s, a) => s + (Number(a.time_taken) || 0), 0)
    console.log(`  round ${r.id}: ${r.name ?? 'player ' + r.user_id} - round ${r.round}, scored ${score}`)
    if (!replay) continue
    await db.query(
      `UPDATE quiz_users SET total_x_p = GREATEST(COALESCE(total_x_p, 0) - $1, 0),
                             total_time_taken = GREATEST(COALESCE(total_time_taken, 0) - $2, 0)
        WHERE id = $3`,
      [score, time, r.user_id],
    )
    if (attempts.length) await db.query('DELETE FROM quiz_attempts WHERE id = ANY($1::int[])', [attempts.map((a) => a.id)])
    await db.query('DELETE FROM quiz_rounds WHERE id = $1', [r.id])
  }

  await db.query(apply ? 'COMMIT' : 'ROLLBACK')
  console.log(
    apply
      ? `\nDone.${replay && rounds.length ? ` ${rounds.length} player round(s) can be played again.` : ''}\n`
      : '\nNothing was changed. Add --apply (and --replay to let these players play again).\n',
  )
} catch (error) {
  await db.query('ROLLBACK').catch(() => {})
  console.error('\nFailed - nothing was changed.\n', error)
  process.exitCode = 1
} finally {
  await db.end()
}
