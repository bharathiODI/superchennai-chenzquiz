#!/usr/bin/env node
/**
 * 23 Nov 2026: at midnight the quiz started a new "day" while the question pool still held
 * day 1's questions, so players who had finished day 1 were given the same questions again
 * (a "recycled" round) and scored twice. This undoes it:
 *
 *  1. REPEATS - every recycled round started between midnight and 07:00 IST is removed. A
 *     finished one also loses its score entry, and its score and time come off the player's
 *     totals (back to what they had before). The player can then play today's round.
 *  2. LATE DAY-1 PLAYERS - rounds first played between midnight and 07:00 IST today (day 1
 *     questions, not repeats) are moved back to day 1 (22 Nov), so those players can play
 *     day 2 today instead of being told they already played.
 *
 *  Only rounds started BEFORE 07:00 are touched: the three questions were edited in place to
 *  day 2's text from 07:01, so later "recycled" rounds are genuine day-2 plays and stay.
 *
 * Run from the live app folder (uses its node_modules and .env):
 *   cd /var/www/chenzquiz/current
 *   node /root/2026-11-23-undo-repeat-rounds.mjs           # shows exactly what it would do
 *   node /root/2026-11-23-undo-repeat-rounds.mjs --apply   # does it
 * Everything runs in one transaction; the dry run does the same work and rolls it back.
 */
import { createRequire } from 'node:module'
import path from 'node:path'

const require = createRequire(path.join(process.cwd(), 'package.json'))
require('dotenv').config({ path: path.join(process.cwd(), '.env') })
const pg = require('pg')

const DAY = '2026-11-23' // the "day" the repeats were filed under
const DAY1 = '2026-11-22' // the real game day they belong to
const MIDNIGHT = '2026-11-23T00:00:00+05:30'
const CUTOFF = '2026-11-23T07:00:00+05:30' // questions were changed to day 2's text from 07:01

const apply = process.argv.includes('--apply')
if (!process.env.DATABASE_URI) {
  console.error('DATABASE_URI is not set - run this from /var/www/chenzquiz/current')
  process.exit(1)
}

const ist = (d) =>
  d ? new Date(d).toLocaleString('en-GB', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '-'
const num = (v) => Number(v) || 0

const db = new pg.Client({ connectionString: process.env.DATABASE_URI })
await db.connect()

try {
  await db.query('BEGIN')
  console.log(`\n${apply ? 'APPLYING' : 'DRY RUN (nothing is changed)'}\n`)

  // ---- 1. Repeats -------------------------------------------------------------------------
  const repeats = (
    await db.query(
      `SELECT r.id, r.user_id, r.quiz_id, r.day, r.round, r.status, r.score, r.completed_at, r.recycled, r.created_at,
              u.name, u.total_x_p, u.total_time_taken
         FROM quiz_rounds r LEFT JOIN quiz_users u ON u.id = r.user_id
        WHERE r.recycled > 0 AND r.created_at >= $1 AND r.created_at < $2
        ORDER BY r.created_at`,
      [MIDNIGHT, CUTOFF],
    )
  ).rows

  console.log(`1. Repeat rounds (same questions again) started midnight-7 AM: ${repeats.length}`)
  const players = new Map()
  for (const r of repeats) {
    const who = `${r.name ?? '(deleted player)'} (#${r.user_id})`
    let note = ''
    if (r.status === 'completed') {
      const att = (
        await db.query(
          `SELECT id, score, time_taken FROM quiz_attempts
            WHERE user_id = $1 AND quiz_id = $2 AND round IS NOT DISTINCT FROM $3
              AND completed_at BETWEEN $4::timestamptz - interval '5 minutes' AND $4::timestamptz + interval '5 minutes'
            ORDER BY abs(extract(epoch FROM completed_at - $4::timestamptz)) LIMIT 1`,
          [r.user_id, r.quiz_id, r.round, r.completed_at],
        )
      ).rows[0]
      if (att) {
        const xp = num(att.score)
        const secs = num(att.time_taken)
        await db.query(
          `UPDATE quiz_users SET total_x_p = GREATEST(0, COALESCE(total_x_p, 0) - $2),
                                 total_time_taken = GREATEST(0, COALESCE(total_time_taken, 0) - $3)
            WHERE id = $1`,
          [r.user_id, xp, secs],
        )
        await db.query('DELETE FROM quiz_attempts WHERE id = $1', [att.id])
        note = `-${xp} XP, -${secs}s`
      } else {
        note = 'no score entry found - totals left as they are'
      }
    } else {
      note = 'not finished - no score to take off'
    }
    await db.query('DELETE FROM quiz_rounds WHERE id = $1', [r.id])
    console.log(`   ${who.padEnd(34)} quiz ${r.quiz_id}  started ${ist(r.created_at)}  ${r.status.padEnd(9)} score ${num(r.score)}  -> removed (${note})`)
    if (!players.has(r.user_id)) players.set(r.user_id, { who, before: num(r.total_x_p) })
  }
  if (players.size) {
    console.log('\n   Totals:')
    for (const [id, p] of players) {
      const after = (await db.query('SELECT total_x_p FROM quiz_users WHERE id = $1', [id])).rows[0]
      console.log(`   ${p.who.padEnd(34)} ${p.before} XP -> ${after ? num(after.total_x_p) : '-'} XP`)
    }
  }

  // ---- 2. Late day-1 players -------------------------------------------------------------
  const late = (
    await db.query(
      `SELECT r.id, r.user_id, r.quiz_id, r.round, r.status, r.created_at, u.name
         FROM quiz_rounds r LEFT JOIN quiz_users u ON u.id = r.user_id
        WHERE r.day = $1 AND COALESCE(r.recycled, 0) = 0 AND r.created_at >= $2 AND r.created_at < $3
        ORDER BY r.created_at`,
      [DAY, MIDNIGHT, CUTOFF],
    )
  ).rows
  console.log(`\n2. First played day 1 between midnight and 7 AM (moved back to day 1, ${DAY1}): ${late.length}`)
  for (const r of late) {
    const who = `${r.name ?? '(deleted player)'} (#${r.user_id})`
    const clash = (
      await db.query('SELECT 1 FROM quiz_rounds WHERE user_id = $1 AND quiz_id = $2 AND day = $3 AND round = $4', [
        r.user_id,
        r.quiz_id,
        DAY1,
        r.round,
      ])
    ).rowCount
    if (clash) {
      console.log(`   ${who.padEnd(34)} started ${ist(r.created_at)}  already has a day-1 round - left as it is`)
      continue
    }
    await db.query('UPDATE quiz_rounds SET day = $2 WHERE id = $1', [r.id, DAY1])
    console.log(`   ${who.padEnd(34)} quiz ${r.quiz_id}  started ${ist(r.created_at)}  ${r.status} -> counts as day 1`)
  }

  if (apply) {
    await db.query('COMMIT')
    console.log('\nDone. The players above can play today\'s round now.\n')
  } else {
    await db.query('ROLLBACK')
    console.log('\nNothing changed. Run again with --apply to do it.\n')
  }
} catch (err) {
  await db.query('ROLLBACK').catch(() => {})
  console.error('\nFAILED - nothing was changed:', err.message)
  process.exitCode = 1
} finally {
  await db.end()
}
