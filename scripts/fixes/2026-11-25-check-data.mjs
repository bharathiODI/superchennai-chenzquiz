/**
 * READ-ONLY data check (25 Nov 2026). Changes nothing. Answers "do the numbers add up?":
 *
 *  1. Player totals: the total points/time saved on each player vs the sum of their finished
 *     rounds (the leaderboard uses the saved total, the Quiz Dashboard sums the rounds).
 *  2. Rounds vs attempts: every finished round should have exactly one score entry (attempt).
 *  3. Two or more finished rounds on the same game day (e.g. played TRIVIA and "Day3 - Trivia").
 *  4. Rounds whose stored day differs from when they were actually finished.
 *  5. Very fast rounds (possible cheating).
 *  6. Quizzes: pools and players per game day.
 *
 *   cd /var/www/chenzquiz/current
 *   node /root/2026-11-25-check-data.mjs              # summary + up to 15 examples per check
 *   node /root/2026-11-25-check-data.mjs --all        # every row
 */
import { createRequire } from 'node:module'
import path from 'node:path'

const require = createRequire(path.join(process.cwd(), 'package.json'))
require('dotenv').config({ path: path.join(process.cwd(), '.env') })
const pg = require('pg')

const ALL = process.argv.includes('--all')
const LIMIT = ALL ? 100000 : 15
if (!process.env.DATABASE_URI) {
  console.error('DATABASE_URI is not set - run this from /var/www/chenzquiz/current')
  process.exit(1)
}
const db = new pg.Client({ connectionString: process.env.DATABASE_URI })
await db.connect()
const q = async (sql, params = []) => (await db.query(sql, params)).rows
const ist = (d) =>
  d
    ? new Date(d).toLocaleString('en-GB', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '-'
const head = (t) => console.log(`\n=== ${t} ${'='.repeat(Math.max(0, 70 - t.length))}`)
const show = (rows, fmt) => {
  rows.slice(0, LIMIT).forEach((r) => console.log('  ' + fmt(r)))
  if (rows.length > LIMIT) console.log(`  ... ${rows.length - LIMIT} more (use --all)`)
}

// Game day = India date of (time - day start), as in the game
let startMins = 30
try {
  const [s] = await q(
    'SELECT game_day_start_hour AS h, game_day_start_minute AS m FROM quiz_settings LIMIT 1',
  )
  if (s) startMins = (Number(s.h) || 0) * 60 + (s.m === null || s.m === undefined ? 0 : Number(s.m))
} catch {}
const DAY = (a) =>
  `((${a}.completed_at AT TIME ZONE 'Asia/Kolkata') - make_interval(mins => ${startMins}))::date`
const TEST = `right(regexp_replace(coalesce(u.phone,''),'\\D','','g'),10) ~ '^00000000(0[1-9]|10)$'`

const [tot] = await q(`SELECT
  (SELECT count(*) FROM quiz_users u WHERE NOT ${TEST})::int AS players,
  (SELECT count(*) FROM quiz_rounds)::int AS rounds,
  (SELECT count(*) FROM quiz_rounds WHERE status = 'completed')::int AS finished_rounds,
  (SELECT count(*) FROM quiz_rounds WHERE status <> 'completed')::int AS open_rounds,
  (SELECT count(*) FROM quiz_attempts)::int AS attempts,
  (SELECT count(*) FROM quiz_attempts WHERE round IS NULL)::int AS attempts_without_round`)
head('Totals')
console.log(`  Real players: ${tot.players}`)
console.log(
  `  Rounds handed out: ${tot.rounds} (finished ${tot.finished_rounds}, not finished ${tot.open_rounds})`,
)
console.log(
  `  Score entries (attempts): ${tot.attempts} (of which without a round number: ${tot.attempts_without_round})`,
)

// 1. saved totals vs sum of attempts
const drift =
  await q(`SELECT u.id, u.name, u.phone, coalesce(u.total_x_p,0)::float AS saved_pts, coalesce(s.pts,0)::float AS sum_pts,
    coalesce(u.total_time_taken,0)::float AS saved_secs, coalesce(s.secs,0)::float AS sum_secs
  FROM quiz_users u LEFT JOIN (SELECT user_id, sum(score) pts, sum(time_taken) secs FROM quiz_attempts GROUP BY user_id) s ON s.user_id = u.id
  WHERE coalesce(u.total_x_p,0) <> coalesce(s.pts,0) OR coalesce(u.total_time_taken,0) <> coalesce(s.secs,0)
  ORDER BY abs(coalesce(u.total_x_p,0) - coalesce(s.pts,0)) DESC`)
head(`1. Saved total vs sum of rounds: ${drift.length} player(s) differ`)
show(
  drift,
  (r) =>
    `#${r.id} ${r.name ?? '-'} ${r.phone ?? ''}: points saved ${r.saved_pts} vs rounds ${r.sum_pts}; time saved ${r.saved_secs}s vs rounds ${r.sum_secs}s`,
)

// 2. finished rounds without an attempt / attempts without a finished round
const noAttempt =
  await q(`SELECT r.id, u.name, u.phone, r.day, r.round, qz.quiz_title AS quiz, r.score, r.completed_at
  FROM quiz_rounds r JOIN quiz_users u ON u.id = r.user_id LEFT JOIN quizzes qz ON qz.id = r.quiz_id
  WHERE r.status = 'completed' AND NOT EXISTS (
    SELECT 1 FROM quiz_attempts a WHERE a.user_id = r.user_id AND a.quiz_id = r.quiz_id AND a.round = r.round
      AND abs(extract(epoch FROM a.completed_at - r.completed_at)) < 600)
  ORDER BY r.completed_at`)
const noRound =
  await q(`SELECT a.id, u.name, u.phone, qz.quiz_title AS quiz, a.round, a.score, a.completed_at
  FROM quiz_attempts a JOIN quiz_users u ON u.id = a.user_id LEFT JOIN quizzes qz ON qz.id = a.quiz_id
  WHERE NOT EXISTS (
    SELECT 1 FROM quiz_rounds r WHERE r.user_id = a.user_id AND r.quiz_id = a.quiz_id AND r.round = a.round
      AND r.status = 'completed' AND abs(extract(epoch FROM a.completed_at - r.completed_at)) < 600)
  ORDER BY a.completed_at`)
head(`2. Finished rounds with no score entry: ${noAttempt.length}`)
show(
  noAttempt,
  (r) =>
    `round #${r.id} ${r.name ?? '-'} ${r.phone ?? ''} ${r.quiz ?? ''} day ${r.day} round ${r.round} score ${r.score} at ${ist(r.completed_at)}`,
)
head(`2b. Score entries with no finished round: ${noRound.length}`)
show(
  noRound,
  (r) =>
    `attempt #${r.id} ${r.name ?? '-'} ${r.phone ?? ''} ${r.quiz ?? ''} round ${r.round ?? '-'} score ${r.score} at ${ist(r.completed_at)}`,
)

// 3. more than one finished round on the same game day
const multi =
  await q(`SELECT u.id, u.name, u.phone, to_char(${DAY('a')}, 'YYYY-MM-DD') AS day, count(*)::int AS rounds,
    string_agg(coalesce(qz.quiz_title, '?') || ' ' || coalesce(a.score::text, '0') || 'pts', ', ' ORDER BY a.completed_at) AS detail
  FROM quiz_attempts a JOIN quiz_users u ON u.id = a.user_id LEFT JOIN quizzes qz ON qz.id = a.quiz_id
  WHERE NOT ${TEST}
  GROUP BY u.id, u.name, u.phone, ${DAY('a')} HAVING count(*) > 1
  ORDER BY day, u.name`)
const perDay = {}
multi.forEach((r) => (perDay[r.day] = (perDay[r.day] || 0) + 1))
head(`3. Players with 2+ finished rounds on the same game day: ${multi.length}`)
Object.entries(perDay).forEach(([d, n]) => console.log(`  ${d}: ${n} player(s)`))
show(
  multi,
  (r) => `${r.day} #${r.id} ${r.name ?? '-'} ${r.phone ?? ''}: ${r.rounds} rounds - ${r.detail}`,
)

// 4. stored day vs finished day
const moved =
  await q(`SELECT r.id, u.name, r.day, to_char(${DAY('r')}, 'YYYY-MM-DD') AS finished_day, r.completed_at
  FROM quiz_rounds r JOIN quiz_users u ON u.id = r.user_id
  WHERE r.status = 'completed' AND r.completed_at IS NOT NULL AND r.day <> to_char(${DAY('r')}, 'YYYY-MM-DD')
  ORDER BY r.completed_at`)
head(`4. Rounds stored on a different day than they were finished: ${moved.length}`)
show(
  moved,
  (r) =>
    `round #${r.id} ${r.name ?? '-'}: stored ${r.day}, finished ${r.finished_day} (${ist(r.completed_at)})`,
)

// 5. very fast rounds
const fast =
  await q(`SELECT u.id, u.name, u.phone, count(*)::int AS rounds, min(a.time_taken)::float AS fastest,
    round(avg(a.score)::numeric,1)::float AS avg_score
  FROM quiz_attempts a JOIN quiz_users u ON u.id = a.user_id
  WHERE NOT ${TEST} AND a.time_taken < 8 AND coalesce(a.score,0) > 0
  GROUP BY u.id, u.name, u.phone ORDER BY rounds DESC, fastest`)
const [dist] =
  await q(`SELECT count(*) FILTER (WHERE time_taken < 5)::int AS under5, count(*) FILTER (WHERE time_taken < 8)::int AS under8,
    count(*) FILTER (WHERE time_taken < 15)::int AS under15, count(*)::int AS total FROM quiz_attempts`)
head(
  `5. Fast rounds: <5s ${dist.under5}, <8s ${dist.under8}, <15s ${dist.under15} (of ${dist.total})`,
)
show(
  fast,
  (r) =>
    `#${r.id} ${r.name ?? '-'} ${r.phone ?? ''}: ${r.rounds} round(s) under 8s, fastest ${r.fastest}s, avg score ${r.avg_score}`,
)

// 6. quizzes
const [{ lean }] = await q(`SELECT EXISTS (SELECT 1 FROM information_schema.columns
  WHERE table_name = 'questions' AND column_name = 'use_in') AS lean`)
const bank = lean
  ? `, (SELECT count(*) FROM questions qq WHERE qq.quiz_id = qz.id AND qq._status = 'published' AND qq.use_in IN ('general', 'both'))::int AS general,
       (SELECT count(*) FROM questions qq WHERE qq.quiz_id = qz.id AND qq._status = 'published' AND qq.use_in IN ('sponsored', 'both'))::int AS sponsored,
       (SELECT count(*) FROM questions qq WHERE qq.quiz_id = qz.id AND qq.use_in = 'none')::int AS not_in_play`
  : ''
const quizzes =
  await q(`SELECT qz.id, qz.quiz_title AS title, qz.status, qz.quiz_date, qz.quiz_end_date, qz.rounds_per_day, qz.questions_per_round,
    qz.sponsored_position, qz.shuffle_questions,
    (SELECT count(*) FROM quizzes_rels r WHERE r.parent_id = qz.id AND r.path = 'questions')::int AS pool ${bank}
  FROM quizzes qz ORDER BY qz.id`)
head('6. Quizzes')
quizzes.forEach((z) => {
  const ends = z.quiz_end_date
    ? `, ends ${ist(z.quiz_end_date)}${new Date(z.quiz_end_date) < new Date() ? ' (ENDED)' : ''}`
    : ''
  const inPlay = lean
    ? `in play: ${z.general} General, ${z.sponsored} Sponsored; ${z.not_in_play} Not in play`
    : `${z.rounds_per_day} round(s) x ${z.questions_per_round} q, sponsored slot ${z.sponsored_position}, shuffle ${z.shuffle_questions ? 'on' : 'off'}, pool ${z.pool}`
  console.log(
    `  #${z.id} ${String(z.title).trim()} [${z.status}] starts ${ist(z.quiz_date)}${ends}: ${inPlay}`,
  )
})
const days =
  await q(`SELECT to_char(${DAY('a')}, 'YYYY-MM-DD') AS day, coalesce(qz.quiz_title,'?') AS quiz, count(DISTINCT a.user_id)::int AS players, count(*)::int AS rounds
  FROM quiz_attempts a LEFT JOIN quizzes qz ON qz.id = a.quiz_id GROUP BY 1, 2 ORDER BY 1, 2`)
days.forEach((d) => console.log(`  ${d.day}  ${d.quiz}: ${d.players} players, ${d.rounds} rounds`))
const overlap =
  await q(`SELECT a.parent_id AS quiz_a, b.parent_id AS quiz_b, count(*)::int AS shared
  FROM quizzes_rels a JOIN quizzes_rels b ON a.questions_id = b.questions_id AND a.parent_id < b.parent_id
  WHERE a.path = 'questions' AND b.path = 'questions' GROUP BY 1, 2`)
overlap.forEach((o) =>
  console.log(`  Quiz #${o.quiz_a} and #${o.quiz_b} share ${o.shared} question(s) in their pools`),
)

await db.end()
console.log('\nRead-only: nothing was changed.')
