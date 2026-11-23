#!/usr/bin/env node
/**
 * READ-ONLY. Lists every score above a limit (default 30) and says how it got through:
 *
 *  - "NO ROUND (uncapped)": the score was sent without a round, through the old submit path
 *    that saves whatever number it is given. The normal game always sends a round, so these
 *    were not produced by playing normally.
 *  - "within this round's max": sent with a round; the server capped it at what that round's
 *    questions allow (points + speed bonus, x2 for Double Up). Shows each question's settings.
 *
 *   cd /var/www/chenzquiz/current
 *   node /root/2026-11-23-check-high-scores.mjs            # scores above 30
 *   node /root/2026-11-23-check-high-scores.mjs --over 25  # another limit
 */
import { createRequire } from 'node:module'
import path from 'node:path'

const require = createRequire(path.join(process.cwd(), 'package.json'))
require('dotenv').config({ path: path.join(process.cwd(), '.env') })
const pg = require('pg')

const i = process.argv.indexOf('--over')
const OVER = i > 0 ? Number(process.argv[i + 1]) : 30
if (!process.env.DATABASE_URI) {
  console.error('DATABASE_URI is not set - run this from /var/www/chenzquiz/current')
  process.exit(1)
}
const ist = (d) =>
  d ? new Date(d).toLocaleString('en-GB', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '-'
const n = (v) => Number(v) || 0

const db = new pg.Client({ connectionString: process.env.DATABASE_URI })
await db.connect()
try {
  const s = (await db.query('SELECT scoring_speed_bonus FROM quiz_settings LIMIT 1')).rows[0]
  const tiers = (await db.query('SELECT max(bonus) AS m FROM quiz_settings_scoring_bonus_tiers')).rows[0]
  const bonusCap = s && s.scoring_speed_bonus === false ? 0 : n(tiers?.m) || 5
  console.log(`\nSpeed bonus: up to ${bonusCap} per correct answer\n`)

  const rows = (
    await db.query(
      `SELECT a.id, a.user_id, a.quiz_id, a.score, a.total_questions, a.correct_answers, a.time_taken,
              a.completed_at, a.round, u.name, u.phone, u.total_x_p
         FROM quiz_attempts a LEFT JOIN quiz_users u ON u.id = a.user_id
        WHERE a.score > $1 ORDER BY a.score DESC, a.completed_at`,
      [OVER],
    )
  ).rows
  console.log(`Scores above ${OVER}: ${rows.length}\n`)

  for (const a of rows) {
    console.log(
      `#${a.id}  ${a.name ?? '(deleted)'} (player #${a.user_id}, ${a.phone ?? '-'})  quiz ${a.quiz_id}  ${ist(a.completed_at)}` +
        `\n   score ${n(a.score)}  answers ${n(a.correct_answers)}/${n(a.total_questions)} correct  time ${n(a.time_taken)}s  player total now ${n(a.total_x_p)} XP`,
    )
    const r = (
      await db.query(
        `SELECT id, day, status, score FROM quiz_rounds
          WHERE user_id = $1 AND quiz_id = $2 AND completed_at IS NOT NULL
            AND completed_at BETWEEN $3::timestamptz - interval '5 minutes' AND $3::timestamptz + interval '5 minutes'
          ORDER BY abs(extract(epoch FROM completed_at - $3::timestamptz)) LIMIT 1`,
        [a.user_id, a.quiz_id, a.completed_at],
      )
    ).rows[0]
    if (!a.round || !r) {
      console.log('   -> NO ROUND (uncapped): sent without a round, so the server never checked the score.\n')
      continue
    }
    const qs = (
      await db.query(
        `SELECT q.id, q.question_number, q.points, q.enable_double_up
           FROM quiz_rounds_rels rr JOIN questions q ON q.id = rr.questions_id
          WHERE rr.parent_id = $1 AND rr.path = 'questions' ORDER BY rr."order"`,
        [r.id],
      )
    ).rows
    let cap = 0
    const parts = qs.map((q) => {
      const each = ((n(q.points) || 10) + bonusCap) * (q.enable_double_up ? 2 : 1)
      cap += each
      return `Q#${q.id}(no.${q.question_number ?? '-'}): ${n(q.points) || 10} pts${q.enable_double_up ? ' x2 Double Up' : ''} -> max ${each}`
    })
    console.log(`   round #${r.id} (day ${r.day}): ${parts.join(' | ')}`)
    console.log(`   -> within this round's max of ${cap}${n(a.score) > cap ? ' - ABOVE IT (unexpected)' : ''}\n`)
  }
} finally {
  await db.end()
}
