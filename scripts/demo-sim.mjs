#!/usr/bin/env node
/**
 * Automatic N-day run on the DEMO site (25 Nov 2026). Plays the 10 test players through N pretend
 * days with the demo tools (test clock + "log in as") and checks the daily play end to end.
 * Run it before every release to live. It changes only test-player data and the demo clock,
 * and puts the clock back to today at the end.
 *
 *   cd /var/www/chenzquiz-demo/current
 *   node scripts/demo-sim.mjs                                        # 30 days, 10 players (key from .env)
 *   node scripts/demo-sim.mjs --days 5 --players 3                   # quick run
 *   node scripts/demo-sim.mjs --url https://chenzquiz-demo.superchennai.com --key <KEY>
 *
 * Run from the demo's folder and it also checks the database (DATABASE_URI from its .env).
 * Exit code 0 = all checks passed.
 */
import { createRequire } from 'node:module'
import path from 'node:path'

const require = createRequire(path.join(process.cwd(), 'package.json'))
try {
  require('dotenv').config({ path: path.join(process.cwd(), '.env'), quiet: true })
} catch {}

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`)
  const v = i > 0 ? process.argv[i + 1] : undefined
  return v === undefined || v.startsWith('--') || v === '' ? fallback : v
}
const BASE = (arg('url', process.env.NEXT_PUBLIC_SERVER_URL || 'http://127.0.0.1:3000') || '').replace(/\/$/, '')
const KEY = arg('key', process.env.DEMO_TOOLS_KEY || '')
const DAYS = Math.max(1, Number(arg('days', 30)))
const PLAYERS = Math.max(1, Math.min(10, Number(arg('players', 10))))
if (!KEY) {
  console.error('Give the demo key: --key <DEMO_TOOLS_KEY> (in the demo .env)')
  process.exit(2)
}

let pass = 0
let fail = 0
const fails = []
const ok = (cond, label, detail = '') => {
  if (cond) pass++
  else {
    fail++
    fails.push(`${label}${detail ? ` - ${detail}` : ''}`)
    if (fails.length <= 30) console.log(`  FAIL ${label}${detail ? ` - ${detail}` : ''}`)
  }
}

async function demo(action, body = {}) {
  const r = await fetch(`${BASE}/api/demo/${action}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-demo-key': KEY },
    body: JSON.stringify(body),
  })
  const j = await r.json().catch(() => ({}))
  if (!r.ok || j.ok === false) throw new Error(`demo ${action}: ${j.error || r.status}`)
  return { json: j, cookie: (r.headers.get('set-cookie') || '').split(';')[0] }
}
async function api(method, url, cookie, body) {
  const r = await fetch(`${BASE}${url}`, {
    method,
    headers: { 'content-type': 'application/json', cookie, 'x-device-id': `sim-device-${cookie.slice(-12).replace(/[^a-zA-Z0-9]/g, 'x')}` },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  return { status: r.status, json: await r.json().catch(() => ({})) }
}

const statusRes = await fetch(`${BASE}/api/demo/status`)
const status = await statusRes.json().catch(() => ({}))
if (!status.enabled) {
  console.error(`Demo tools are not available on ${BASE}: ${status.error || statusRes.status}`)
  process.exit(2)
}
const quiz = status.quiz
if (!quiz) {
  console.error('No live quiz (status Scheduled / Active) on the demo site.')
  process.exit(2)
}
const layout = quiz.layout || []
console.log(`Demo site ${BASE}\nQuiz "${quiz.title}", layout ${layout.join(' / ')}; ${PLAYERS} test players x ${DAYS} days\n`)

await demo('reset-test-players')
const seen = new Map() // phone -> Set of question ids
const phones = status.testPlayers.slice(0, PLAYERS)
let plays = 0
let questions = 0
let repeats = 0
let fallbacks = 0

try {
  for (let d = 1; d <= DAYS; d++) {
    if (d > 1) await demo('clock', { op: 'next' })
    for (const [pi, phone] of phones.entries()) {
      const { cookie } = await demo('login-as', { phone })
      let s = await api('GET', `/api/quiz-round?quizId=${quiz.id}`, cookie)
      if (s.json.state === 'empty') {
        ok(true, 'empty')
        continue
      }
      ok(s.json.state === 'playing', `day ${d} ${phone}: gets a play`, s.json.state || s.status)
      if (s.json.state !== 'playing') continue
      plays++
      const mine = seen.get(phone) || new Set()
      for (let guard = 0; guard < 12 && s.json.state === 'playing'; guard++) {
        const q = s.json.question
        questions++
        ok(q.mcqGroup?.correctOptionIndex === undefined && q.explanation === undefined, 'question sent without its answer or explanation')
        ok(Boolean(q.slot?.sponsored) === (layout[s.json.position] === 'sponsored'), `Q${s.json.position + 1} is ${layout[s.json.position]} (badge shown)`, `day ${d} ${phone}`)
        ok(s.json.secondsLeft > 0 && s.json.secondsLeft <= s.json.timeLimit, 'timer starts on the server')
        ok(!mine.has(q.id) || q.slot?.repeat, `no repeated question`, `day ${d} ${phone} got question ${q.id} again`)
        if (q.slot?.repeat) repeats++
        if (q.slot?.fallback) fallbacks++
        mine.add(q.id)
        // A reload resumes the same question, with no extra time
        if (pi === 0) {
          const again = await api('GET', `/api/quiz-round?quizId=${quiz.id}`, cookie)
          ok(again.json.question?.id === q.id && again.json.position === s.json.position, 'reload resumes the same question')
          ok(again.json.secondsLeft <= s.json.secondsLeft, 'reload does not reset the timer', `${s.json.secondsLeft} -> ${again.json.secondsLeft}`)
        }
        let answer
        if (pi === 1 && s.json.position === 0) answer = { timeout: true }
        else if (q.gameType === 'mcq') {
          const opts = q.mcqGroup?.options || []
          answer = { optionId: opts[Math.floor(Math.random() * opts.length)]?.id }
        } else if (q.gameType === 'dropdown') answer = { value: q.dropdownGroup?.options?.[0]?.optionText }
        else answer = { correct: Math.random() < 0.5, detail: 'sim' }
        const a = await api('POST', '/api/quiz-answer', cookie, { roundId: s.json.roundId, position: s.json.position, answer })
        ok(a.status === 200 && a.json.ok, 'answer accepted', JSON.stringify(a.json).slice(0, 120))
        if (answer.timeout) ok(a.json.timedOut === true && a.json.points === 0, 'time-out scores 0')
        if (q.gameType === 'mcq' && !answer.timeout) ok(Boolean(a.json.reveal?.correctOptionId), 'right answer shown after answering')
        // The same answer again is refused (no double points)
        const dup = await api('POST', '/api/quiz-answer', cookie, { roundId: s.json.roundId, position: s.json.position, answer })
        ok(dup.status === 409, 'second answer to the same question refused', String(dup.status))
        s = await api('GET', `/api/quiz-round?quizId=${quiz.id}`, cookie)
      }
      seen.set(phone, mine)
      ok(s.json.state === 'done', `day ${d} ${phone}: done after the last question`, s.json.state)
      const again = await api('GET', `/api/quiz-round?quizId=${quiz.id}`, cookie)
      ok(again.json.state === 'done', 'a second play on the same day is refused', again.json.state)
    }
    process.stdout.write(`  day ${d} done (${pass} passed, ${fail} failed)\n`)
  }
} finally {
  await demo('clock', { op: 'today' }).catch(() => {})
}

// Database checks (when run from the demo folder)
if (process.env.DATABASE_URI) {
  const pg = require('pg')
  const db = new pg.Client({ connectionString: process.env.DATABASE_URI })
  await db.connect()
  const q = async (sql, p = []) => (await db.query(sql, p)).rows
  const testIds = (await q(`SELECT id FROM quiz_users WHERE phone = ANY($1)`, [phones])).map((r) => r.id)
  const bad1 = await q(
    `SELECT r.id FROM quiz_rounds r LEFT JOIN (SELECT round_id, sum(points) s FROM quiz_answers GROUP BY 1) a ON a.round_id = r.id
      WHERE r.user_id = ANY($1) AND r.status = 'completed' AND coalesce(a.s,0) <> coalesce(r.score,0)`, [testIds])
  ok(!bad1.length, 'play score = sum of its answers', `${bad1.length} plays differ`)
  const bad2 = await q(
    `SELECT u.id FROM quiz_users u LEFT JOIN (SELECT user_id, sum(score) s FROM quiz_attempts GROUP BY 1) a ON a.user_id = u.id
      WHERE u.id = ANY($1) AND coalesce(u.total_x_p,0) <> coalesce(a.s,0)`, [testIds])
  ok(!bad2.length, 'player total = sum of finished plays', `${bad2.length} players differ`)
  const bad3 = await q(`SELECT user_id, day FROM quiz_rounds WHERE user_id = ANY($1) GROUP BY 1,2 HAVING count(*) > 1`, [testIds])
  ok(!bad3.length, 'one play per player per day', `${bad3.length} player-days with more`)
  const bad4 = await q(
    `SELECT count(*)::int n FROM quiz_rounds r WHERE r.user_id = ANY($1) AND r.status = 'completed'
       AND NOT EXISTS (SELECT 1 FROM quiz_attempts a WHERE a.user_id = r.user_id AND a.quiz_id = r.quiz_id AND a.completed_at = r.completed_at)`, [testIds])
  ok(!bad4[0].n, 'every finished play has its attempt row', `${bad4[0].n} missing`)
  const rep = await q(
    `SELECT count(*)::int n FROM (SELECT r.user_id, rel.questions_id FROM quiz_rounds r JOIN quiz_rounds_rels rel ON rel.parent_id = r.id AND rel.path = 'questions'
      WHERE r.user_id = ANY($1) GROUP BY 1,2 HAVING count(*) > 1) x`, [testIds])
  const recycled = await q(`SELECT coalesce(sum(recycled),0)::int n FROM quiz_rounds WHERE user_id = ANY($1)`, [testIds])
  ok(rep[0].n <= recycled[0].n, 'repeats only when the player had seen every question that fits', `${rep[0].n} repeats, ${recycled[0].n} marked recycled`)
  await db.end()
} else {
  console.log('\n(Database checks skipped: run from the demo folder to include them.)')
}

console.log(`\n${plays} plays, ${questions} questions (${repeats} repeats because the player had seen every question that fits; ${fallbacks} General questions in a sponsored slot because no unseen sponsored question was left). ${pass} checks passed, ${fail} failed.`)
if (repeats) console.log('Repeats mean the question bank is too small for this many days: add questions.')
if (fail) {
  console.log('\nFailures:')
  ;[...new Set(fails)].slice(0, 40).forEach((f) => console.log(`  - ${f}`))
}
console.log('The test clock is back to today. Plays answered instantly are flagged "Too fast" - expected for this script.')
process.exit(fail ? 1 : 0)
