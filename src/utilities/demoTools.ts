// Demo tools (demo site only): test clock, switch to a test player, reset, simulate players.
// Every action needs the DEMO_TOOLS_KEY (demo server .env) and a demo database (demo_flag table).
import type { Payload } from 'payload'
import { gameDayKey } from './gameDay'
import { getGameDaySettings } from './getGameTimers'
import { clockOffsetMs, getNow, resetClockCache } from './clock'
import { answerQuestion, getPlay, relId } from './play'
import { TEST_PLAYER_PHONES } from './testPlayers'
import { quizSlots } from './roundLayout'

const DAY_MS = 86400000
const IST_MS = 330 * 60000
const db = (payload: Payload) => (payload.db as any).pool

export const SIM_PHONE_PREFIX = '+9188888'
export const simPhone = (n: number) => `${SIM_PHONE_PREFIX}${String(n).padStart(5, '0')}`

export async function liveQuiz(payload: Payload, now: Date): Promise<any | null> {
  const res = await payload.find({
    collection: 'quizzes',
    where: { status: { equals: 'active' } },
    sort: 'quizDate',
    depth: 0,
    pagination: false,
    overrideAccess: true,
    select: { quizTitle: true, slug: true, quizDate: true, quizEndDate: true, roundLayout: true },
  } as any)
  const docs = res.docs as any[]
  return (
    docs.find((q) => (!q.quizDate || new Date(q.quizDate) <= now) && (!q.quizEndDate || new Date(q.quizEndDate) >= now)) ||
    docs[0] ||
    null
  )
}

export async function demoStatus(payload: Payload) {
  const offsetMs = await clockOffsetMs(payload, true)
  const now = await getNow(payload)
  const gd = await getGameDaySettings(payload)
  const quiz = await liveQuiz(payload, now)
  const today = gameDayKey(now, gd)
  const startDay = quiz?.quizDate ? gameDayKey(quiz.quizDate, gd) : null
  const dayNumber =
    today && startDay ? Math.round((Date.parse(`${today}T00:00:00Z`) - Date.parse(`${startDay}T00:00:00Z`)) / DAY_MS) + 1 : null
  return {
    offsetMs,
    offsetDays: Math.round((offsetMs / DAY_MS) * 100) / 100,
    now: now.toISOString(),
    nowIndia: now.toLocaleString('en-GB', { timeZone: 'Asia/Kolkata', weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
    gameDay: today,
    dayNumber,
    quiz: quiz ? { id: quiz.id, title: quiz.quizTitle, slug: quiz.slug, layout: quizSlots(quiz).map((s) => s.source) } : null,
    testPlayers: TEST_PLAYER_PHONES,
  }
}

async function setOffset(payload: Payload, offsetMs: number) {
  await db(payload).query('UPDATE demo_flag SET clock_offset_ms = $1, updated_at = now()', [Math.round(offsetMs)])
  resetClockCache()
}

/** next | prev | today | day (N = day of the live quiz) | time ("HH:MM" India time on the pretend date) */
export async function moveClock(payload: Payload, op: string, value?: string | number) {
  const offset = await clockOffsetMs(payload, true)
  if (op === 'today') return setOffset(payload, 0)
  if (op === 'next') return setOffset(payload, offset + DAY_MS)
  if (op === 'prev') return setOffset(payload, offset - DAY_MS)
  if (op === 'day') {
    const status = await demoStatus(payload)
    const n = Math.round(Number(value))
    if (!status.dayNumber || !Number.isFinite(n) || n < 1) throw new Error('Pick a day number of the live quiz (1, 2, ...)')
    return setOffset(payload, offset + (n - status.dayNumber) * DAY_MS)
  }
  if (op === 'time') {
    const m = /^(\d{1,2}):(\d{2})$/.exec(String(value || ''))
    if (!m) throw new Error('Time as HH:MM (India time), e.g. 00:29')
    const now = await getNow(payload)
    const indiaMidnight = Math.floor((now.getTime() + IST_MS) / DAY_MS) * DAY_MS - IST_MS
    const target = indiaMidnight + (Number(m[1]) * 60 + Number(m[2])) * 60000
    return setOffset(payload, offset + (target - now.getTime()))
  }
  throw new Error('Unknown clock action')
}

export async function findOrCreatePlayer(payload: Payload, phone: string, name: string) {
  const found = await payload.find({ collection: 'quiz-users', where: { phone: { equals: phone } }, limit: 1, depth: 0, overrideAccess: true })
  if (found.docs[0]) return found.docs[0] as any
  return (await payload.create({ collection: 'quiz-users', data: { name, phone, totalXP: 0, totalTimeTaken: 0 } as any, overrideAccess: true })) as any
}

/** Clears a test or simulated player's plays, answers and score. Never touches real players. */
export async function resetPlayer(payload: Payload, phone: string) {
  if (!TEST_PLAYER_PHONES.includes(phone) && !phone.startsWith(SIM_PHONE_PREFIX)) throw new Error('Only test or simulated players can be reset')
  const found = await payload.find({ collection: 'quiz-users', where: { phone: { equals: phone } }, limit: 1, depth: 0, overrideAccess: true })
  const user = found.docs[0] as any
  if (!user) return 0
  for (const t of ['quiz_answers', 'quiz_attempts', 'quiz_rounds']) await db(payload).query(`DELETE FROM ${t} WHERE user_id = $1`, [user.id])
  await db(payload).query('UPDATE quiz_users SET total_x_p = 0, total_time_taken = 0 WHERE id = $1', [user.id])
  return 1
}

/** Deletes every simulated player (and what they played). */
export async function removeSimPlayers(payload: Payload) {
  const ids = (await db(payload).query(`SELECT id FROM quiz_users WHERE phone LIKE $1`, [`${SIM_PHONE_PREFIX}%`])).rows.map((r: any) => r.id)
  if (!ids.length) return 0
  for (const t of ['quiz_answers', 'quiz_attempts', 'quiz_rounds']) await db(payload).query(`DELETE FROM ${t} WHERE user_id = ANY($1)`, [ids])
  await db(payload).query('DELETE FROM quiz_users WHERE id = ANY($1)', [ids])
  return ids.length
}

/**
 * Simulated players play today's questions with random answers and times (about 70% right,
 * 3-15 s each). They are normal players on the leaderboard: phones +91 88888 xxxxx.
 */
export async function simulatePlayers(payload: Payload, count: number) {
  const n = Math.max(1, Math.min(500, Math.round(count)))
  const now = await getNow(payload)
  const quiz = await liveQuiz(payload, now)
  if (!quiz) throw new Error('No live quiz')
  const started = Date.now()
  let played = 0
  let skipped = 0
  const one = async (i: number) => {
    const user = await findOrCreatePlayer(payload, simPhone(i), `Sim Player ${String(i).padStart(3, '0')}`)
    let t = now.getTime()
    for (let guard = 0; guard < 12; guard++) {
      const state: any = await getPlay(payload, quiz.id, user.id, { now: new Date(t), deviceId: `sim${i}`, ip: '10.0.0.1' })
      if (state.state !== 'playing') {
        if (guard === 0) skipped++
        else played++
        return
      }
      const q: any = await payload.findByID({ collection: 'questions', id: state.question.id, depth: 0, overrideAccess: true })
      const right = Math.random() < 0.7
      let answer: any = { correct: right, detail: 'sim' }
      if (q.gameType === 'mcq') {
        const opts = (q.mcqGroup?.options || []) as any[]
        const good = opts[Number(q.mcqGroup?.correctOptionIndex)]
        const bad = opts.filter((o) => o.id !== good?.id)
        answer = { optionId: right || !bad.length ? good?.id : bad[Math.floor(Math.random() * bad.length)].id }
      } else if (q.gameType === 'dropdown') {
        answer = { value: right ? q.dropdownGroup?.correctAnswer : '__wrong__' }
      }
      t += (3 + Math.random() * 12) * 1000
      await answerQuestion(payload, { roundId: state.roundId, userId: user.id, position: state.position, answer }, { now: new Date(t) })
    }
  }
  const queue = Array.from({ length: n }, (_, i) => i + 1)
  await Promise.all(
    Array.from({ length: 8 }, async () => {
      while (queue.length) await one(queue.shift()!)
    }),
  )
  return { players: n, played, alreadyPlayed: skipped, seconds: Math.round((Date.now() - started) / 100) / 10 }
}

export { relId }
