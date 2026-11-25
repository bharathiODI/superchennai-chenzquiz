// The daily play (lean setup, Nov 2026). Server only.
//
// * One play per player per game day: the quiz's Round layout decides the slots (Q1, Q2, ...).
// * Each slot gets a random question this player has never been given that fits the slot
//   (General slots: General or Both; Sponsored slots: Sponsored or Both). No unseen Sponsored
//   question left -> an unseen General one, badge kept. Nothing unseen at all -> the question the
//   player saw longest ago (counted as "recycled").
// * The browser gets one question at a time, without its answer. Every answer is checked and
//   timed on the server (the time starts when the question is sent), stored in quiz_answers, and
//   a reload resumes the same question with the time left.
import { createHash, randomInt } from 'node:crypto'
import type { Payload } from 'payload'
import { formatQuestion } from './formatQuestion'
import { formatStartHour, gameDayKey, isCoolOff } from './gameDay'
import { getGameSettings } from './getGameTimers'
import { questionScore, type ScoringSettings } from './gameScoring'
import { normalizeSlot, quizSlots, type Slot } from './roundLayout'
import { getQuizTitles } from './getQuizTitles'
import { getTitleForXP } from './quizTitles'

export type Id = number | string
export type PlayCtx = { now: Date; deviceId?: string | null; ip?: string | null }

/** Seconds an answer may arrive after the timer ends (network delay) and still count. */
export const GRACE_SECONDS = 2

export type SlotSnapshot = Slot & { fallback?: boolean; recycled?: boolean }

export const relId = (v: any): Id | null => (v && typeof v === 'object' ? (v.id ?? null) : (v ?? null))
export const toId = (v: any): Id => (/^\d+$/.test(String(v)) ? Number(v) : v)
const same = (a: any, b: any) => String(relId(a)) === String(relId(b))

const sql = (payload: Payload) => (payload.db as any).pool as { query: (q: string, p?: any[]) => Promise<{ rows: any[]; rowCount: number }> }

/* ------------------------------------------------------------------ question shape for the browser */

const hash = (s: string) => createHash('sha1').update(s).digest('hex')

/** The question as the browser gets it: no correct answer, no explanation, options shuffled per player (setting). */
export function clientQuestion(q: any, timeLimit: number, slot: SlotSnapshot, roundId: Id, shuffleOptions = true) {
  const order = (list: any[]) =>
    shuffleOptions
      ? [...list].sort((a: any, b: any) =>
          hash(`${roundId}:${q.id}:${a.id ?? a.optionText}`).localeCompare(hash(`${roundId}:${q.id}:${b.id ?? b.optionText}`)),
        )
      : list
  const f: any = formatQuestion(q, timeLimit, slot.source === 'sponsored')
  delete f.explanation
  if (f.mcqGroup) {
    delete f.mcqGroup.correctOptionIndex
    f.mcqGroup.options = order(f.mcqGroup.options)
  }
  if (f.dropdownGroup) {
    delete f.dropdownGroup.correctAnswer
    f.dropdownGroup.options = order((f.dropdownGroup.options || []).map((o: any) => ({ id: o.id, optionText: o.optionText })))
  }
  f.timeLimit = timeLimit
  f.slot = {
    sponsored: slot.source === 'sponsored',
    sponsorName: slot.sponsorName || '',
    sponsorLine: slot.sponsorLine || '',
    sponsorLogo: slot.sponsorLogo || null,
    extraSeconds: slot.extraSeconds || 0,
    fixedPoints: slot.points === 'fixed',
    // The player had seen every question that fits this slot, so this one is a repeat
    repeat: Boolean(slot.recycled),
    // No unseen sponsored question was left: a General question in the sponsored slot
    fallback: Boolean(slot.fallback),
  }
  return f
}

/** Game types whose answer the server checks itself (the browser never sees the answer). */
export const SERVER_CHECKED = new Set(['mcq', 'dropdown'])

/* ------------------------------------------------------------------ answer checking */

export type AnswerInput = { optionId?: string; value?: string; correct?: boolean; detail?: string; timeout?: boolean }

function checkAnswer(q: any, answer: AnswerInput): { correct: boolean; text: string; reveal: Record<string, unknown> } {
  if (q.gameType === 'mcq') {
    const options = (q.mcqGroup?.options || []) as any[]
    const right = options[Number(q.mcqGroup?.correctOptionIndex)]
    const picked = options.find((o) => String(o.id) === String(answer.optionId ?? ''))
    return {
      correct: Boolean(picked && right && String(picked.id) === String(right.id)),
      text: picked?.optionText ?? '',
      reveal: { correctOptionId: right?.id ?? null },
    }
  }
  if (q.gameType === 'dropdown') {
    const options = (q.dropdownGroup?.options || []) as any[]
    const value = String(answer.value ?? '')
    const rightText =
      q.dropdownGroup?.correctAnswer || options.find((o: any) => o.isCorrect)?.optionText || ''
    return {
      correct: Boolean(value) && (value === rightText || Boolean(options.find((o) => o.optionText === value)?.isCorrect)),
      text: value,
      reveal: { correctAnswer: rightText },
    }
  }
  // Other game types need the answer in the browser to be playable; the browser reports the result.
  return { correct: answer.correct === true, text: String(answer.detail ?? '').slice(0, 500), reveal: {} }
}

/* ------------------------------------------------------------------ helpers */

/** Only the quiz fields the game needs (the old pool list can be long), with the sponsor logo's URL. */
const QUIZ_FIELDS = {
  depth: 1,
  overrideAccess: true,
  select: {
    quizTitle: true,
    quizDate: true,
    quizEndDate: true,
    status: true,
    roundLayout: true,
    questionsPerRound: true,
    sponsoredPosition: true,
  },
} as any

function slotsOf(round: any, quiz: any): SlotSnapshot[] {
  const ids = ((round.questions || []) as any[]).map(relId)
  if (Array.isArray(round.slots) && round.slots.length === ids.length) return round.slots as SlotSnapshot[]
  // Rounds created before the Round layout: General everywhere except the sponsored question.
  const layout = quizSlots(quiz)
  return ids.map((id, i) => {
    const base = layout[i] ?? layout[layout.length - 1]
    return { ...base, source: same(id, round.sponsoredQuestion) ? 'sponsored' : 'general' } as SlotSnapshot
  })
}

const extraFor = (slot: SlotSnapshot | undefined) => Number(slot?.extraSeconds) || 0

/** The slot of a question (a round always has one per question; a safe default otherwise). */
const slotAt = (slots: SlotSnapshot[], i: number): SlotSnapshot => slots[i] ?? slots[slots.length - 1] ?? normalizeSlot({})

async function questionDocs(payload: Payload, ids: Id[]) {
  if (!ids.length) return new Map<string, any>()
  const res = await payload.find({
    collection: 'questions',
    where: { id: { in: ids } },
    depth: 2,
    pagination: false,
    overrideAccess: true,
  })
  return new Map((res.docs as any[]).map((d) => [String(d.id), d]))
}

/** Pick one random element. */
const pick = <T,>(list: T[]): T => list[randomInt(list.length)]!

/* ------------------------------------------------------------------ picking a new play */

async function createPlay(
  payload: Payload,
  quiz: any,
  userId: Id,
  day: string,
  roundNo: number,
  ctx: PlayCtx,
  linkedWindowMinutes: number,
): Promise<any | null> {
  const slots = quizSlots(quiz)

  // The bank: published questions of this quiz that are in play
  const bank = await payload.find({
    collection: 'questions',
    where: {
      and: [
        { quiz: { equals: quiz.id } },
        { _status: { equals: 'published' } },
        { useIn: { not_equals: 'none' } },
      ],
    },
    depth: 0,
    pagination: false,
    overrideAccess: true,
    select: { useIn: true },
  } as any)
  const all = (bank.docs as any[]).map((d) => ({ id: d.id as Id, useIn: (d.useIn || 'general') as string }))

  // Everything this player has ever been given (any quiz), with the last day they got it
  const seenRows = (
    await sql(payload).query(
      `SELECT rel.questions_id AS qid, max(r.day) AS last_day
         FROM quiz_rounds r JOIN quiz_rounds_rels rel ON rel.parent_id = r.id AND rel.path = 'questions'
        WHERE r.user_id = $1 AND rel.questions_id IS NOT NULL GROUP BY 1`,
      [userId],
    )
  ).rows
  const lastSeen = new Map(seenRows.map((r: any) => [String(r.qid), String(r.last_day)]))

  const fits = (useIn: string, source: string) =>
    source === 'sponsored' ? useIn === 'sponsored' || useIn === 'both' : useIn === 'general' || useIn === 'both'

  const chosen: Id[] = []
  const snapshots: SlotSnapshot[] = []
  let recycled = 0
  for (const slot of slots) {
    const free = (list: typeof all) => list.filter((q) => !chosen.some((c) => same(c, q.id)))
    const forSlot = free(all.filter((q) => fits(q.useIn, slot.source)))
    const unseen = forSlot.filter((q) => !lastSeen.has(String(q.id)))
    let choice: Id | null = null
    let fallback = false
    let reused = false
    if (unseen.length) choice = pick(unseen).id
    else if (slot.source === 'sponsored') {
      // No unseen sponsored question left: an unseen General one, badge kept
      const general = free(all.filter((q) => fits(q.useIn, 'general') && !lastSeen.has(String(q.id))))
      if (general.length) {
        choice = pick(general).id
        fallback = true
      }
    }
    if (choice === null) {
      // Seen everything that fits: the one seen longest ago
      const pool = forSlot.length ? forSlot : free(all.filter((q) => fits(q.useIn, 'general')))
      if (pool.length) {
        const oldest = [...pool].sort((a, b) =>
          (lastSeen.get(String(a.id)) ?? '').localeCompare(lastSeen.get(String(b.id)) ?? ''),
        )
        const oldestDay = lastSeen.get(String(oldest[0]!.id)) ?? ''
        choice = pick(oldest.filter((q) => (lastSeen.get(String(q.id)) ?? '') === oldestDay)).id
        reused = true
        recycled++
      }
    }
    if (choice === null) continue
    chosen.push(choice)
    snapshots.push({ ...slot, ...(fallback ? { fallback: true } : {}), ...(reused ? { recycled: true } : {}) })
  }
  if (!chosen.length) return null

  const sponsoredIndex = snapshots.findIndex((s) => s.source === 'sponsored')
  let created: any
  try {
    created = await payload.create({
      collection: 'quiz-rounds' as any,
      data: {
        user: userId,
        quiz: quiz.id,
        day,
        round: roundNo,
        status: 'assigned',
        questions: chosen,
        sponsoredQuestion: sponsoredIndex >= 0 ? chosen[sponsoredIndex] : null,
        recycled,
        position: 0,
        slots: snapshots,
        deviceId: ctx.deviceId || null,
        ip: ctx.ip || null,
      } as any,
      overrideAccess: true,
    })
  } catch (err) {
    // The same play created by a parallel request (unique index) - use that one.
    const again = await payload.find({
      collection: 'quiz-rounds' as any,
      where: { and: [{ user: { equals: userId } }, { quiz: { equals: quiz.id } }, { day: { equals: day } }, { round: { equals: roundNo } }] },
      depth: 0,
      limit: 1,
      overrideAccess: true,
    })
    if (!again.docs[0]) throw err
    return again.docs[0]
  }

  // Several numbers from one phone: flag this play and the other number's
  if (ctx.deviceId && linkedWindowMinutes > 0) {
    const r = await sql(payload).query(
      `UPDATE quiz_rounds SET linked = true
        WHERE device_id = $1 AND user_id <> $2 AND created_at >= now() - make_interval(mins => $3::int)
        RETURNING id`,
      [ctx.deviceId, userId, Math.round(linkedWindowMinutes)],
    )
    if (r.rowCount) {
      await sql(payload).query('UPDATE quiz_rounds SET linked = true WHERE id = $1', [created.id])
      created.linked = true
    }
  }
  return created
}

/* ------------------------------------------------------------------ recording answers */

type Recorded = { correct: boolean; timedOut: boolean; points: number; speedBonus: number; seconds: number }

async function recordAnswer(
  payload: Payload,
  round: any,
  position: number,
  q: any,
  slot: SlotSnapshot,
  data: Recorded & { text: string; servedAt: Date | null; answeredAt: Date },
): Promise<{ duplicate: boolean }> {
  try {
    await payload.create({
      collection: 'quiz-answers' as any,
      data: {
        user: relId(round.user),
        quiz: relId(round.quiz),
        round: round.id,
        question: q.id,
        position: position + 1,
        answer: data.timedOut ? 'Time out' : data.text,
        correct: data.correct,
        timedOut: data.timedOut,
        points: data.points,
        speedBonus: data.speedBonus,
        seconds: Math.round(data.seconds * 10) / 10,
        sponsored: slot.source === 'sponsored',
        servedAt: data.servedAt ? data.servedAt.toISOString() : null,
        answeredAt: data.answeredAt.toISOString(),
      } as any,
      overrideAccess: true,
    })
  } catch {
    return { duplicate: true } // this position was already answered (double tap / two tabs)
  }
  await sql(payload).query(
    'UPDATE quiz_rounds SET position = $2 + 1, served_at = NULL, updated_at = now() WHERE id = $1 AND position = $2',
    [round.id, position],
  )
  return { duplicate: false }
}

/** Closes a play: score, time, flags, the attempt row the reports read, and the player's totals. */
async function finalizePlay(payload: Payload, round: any, now: Date, tooFastRoundSeconds: number) {
  const totals = (
    await sql(payload).query(
      `SELECT coalesce(sum(points), 0)::float AS score, coalesce(sum(seconds) FILTER (WHERE NOT coalesce(timed_out, false)), 0)::float AS secs,
              coalesce(sum(seconds), 0)::float AS all_secs, count(*)::int AS answered,
              count(*) FILTER (WHERE correct)::int AS correct, count(*) FILTER (WHERE NOT coalesce(timed_out, false))::int AS in_time
         FROM quiz_answers WHERE round_id = $1`,
      [round.id],
    )
  ).rows[0]
  const score = Math.round(Number(totals.score) || 0)
  const timeTaken = Math.round(Number(totals.all_secs) || 0)
  const tooFast = Number(totals.in_time) > 0 && tooFastRoundSeconds > 0 && Number(totals.secs) < tooFastRoundSeconds
  const claimed = await sql(payload).query(
    `UPDATE quiz_rounds SET status = 'completed', score = $2, completed_at = $3, time_taken = $4, correct_answers = $5,
            too_fast = $6, served_at = NULL, updated_at = now()
      WHERE id = $1 AND status <> 'completed' RETURNING id`,
    [round.id, score, now.toISOString(), timeTaken, Number(totals.correct) || 0, tooFast],
  )
  if (!claimed.rowCount) return null // already closed by a parallel request

  // The attempt row: what the dashboard, leaderboard and exports read today
  await payload.create({
    collection: 'quiz-attempts',
    data: {
      user: relId(round.user),
      quiz: relId(round.quiz),
      score,
      totalQuestions: Number(totals.answered) || 0,
      correctAnswers: Number(totals.correct) || 0,
      timeTaken,
      completedAt: now.toISOString(),
      round: Number(round.round) || 1,
    } as any,
    overrideAccess: true,
  })
  const r = await sql(payload).query(
    `UPDATE quiz_users SET total_x_p = coalesce(total_x_p, 0) + $2, total_time_taken = coalesce(total_time_taken, 0) + $3, updated_at = now()
      WHERE id = $1 RETURNING total_x_p`,
    [relId(round.user), score, timeTaken],
  )
  return { score, totalXP: Number(r.rows[0]?.total_x_p) || score }
}

function timeoutRecord(): Recorded {
  return { correct: false, timedOut: true, points: 0, speedBonus: 0, seconds: 0 }
}

/** Records time-outs for every question left and closes the play (a play left open on an earlier day). */
async function closeStalePlay(payload: Payload, round: any, quiz: any, now: Date, tooFastRoundSeconds: number, timers: any) {
  const ids = ((round.questions || []) as any[]).map(relId).filter((x) => x !== null) as Id[]
  const slots = slotsOf(round, quiz)
  const docs = await questionDocs(payload, ids)
  for (let p = Number(round.position) || 0; p < ids.length; p++) {
    const q = docs.get(String(ids[p]))
    if (!q) continue
    const limit = (timers[q.gameType] || 20) + extraFor(slotAt(slots, p))
    const r = timeoutRecord()
    r.seconds = limit
    await recordAnswer(payload, { ...round, position: p }, p, q, slotAt(slots, p), { ...r, text: '', servedAt: null, answeredAt: now })
  }
  await finalizePlay(payload, round, now, tooFastRoundSeconds)
}

/* ------------------------------------------------------------------ the state the browser asks for */

export type PlayState =
  | { state: 'not_started' | 'closed' }
  | { state: 'cooloff'; opensAt: string }
  | { state: 'empty'; opensAt: string }
  | { state: 'done'; todayScore: number; opensAt: string; otherQuiz?: string | null; answers: AnsweredSummary[] }
  | {
      state: 'playing'
      roundId: Id
      position: number
      total: number
      question: ReturnType<typeof clientQuestion>
      timeLimit: number
      secondsLeft: number
      answers: AnsweredSummary[]
      scoreSoFar: number
      scoring: ScoringSettings
    }

export type AnsweredSummary = { position: number; correct: boolean; timedOut: boolean; points: number }

async function answeredSummary(payload: Payload, roundId: Id): Promise<AnsweredSummary[]> {
  const rows = (
    await sql(payload).query(
      'SELECT position::int AS position, coalesce(correct,false) AS correct, coalesce(timed_out,false) AS timed_out, coalesce(points,0)::float AS points FROM quiz_answers WHERE round_id = $1 ORDER BY position',
      [roundId],
    )
  ).rows
  return rows.map((r: any) => ({ position: r.position, correct: r.correct, timedOut: r.timed_out, points: r.points }))
}

/**
 * The player's play for today: creates it on the first call, sends the current question (starting
 * its timer), and records a time-out for a question whose time ran out while the page was closed.
 */
export async function getPlay(payload: Payload, quizIdRaw: Id, userIdRaw: Id, ctx: PlayCtx): Promise<PlayState> {
  const quizId = toId(quizIdRaw)
  const userId = toId(userIdRaw)
  const now = ctx.now
  const quiz: any = await payload.findByID({ collection: 'quizzes', id: quizId, ...QUIZ_FIELDS })
  if (quiz.quizDate && now < new Date(quiz.quizDate)) return { state: 'not_started' }
  if (quiz.quizEndDate && now > new Date(quiz.quizEndDate)) return { state: 'closed' }

  const settings = await getGameSettings(payload)
  const opensAt = formatStartHour(settings.gameDay)
  const day = gameDayKey(now, settings.gameDay)!

  const mine = (
    await payload.find({
      collection: 'quiz-rounds' as any,
      where: { user: { equals: userId } },
      sort: 'createdAt',
      depth: 0,
      pagination: false,
      overrideAccess: true,
    })
  ).docs as any[]

  // A play left open on an earlier day: close it, so the answers it has count
  for (const old of mine.filter((r) => r.status !== 'completed' && r.day < day && (Number(r.position) || 0) > 0)) {
    const oldQuiz = same(old.quiz, quizId) ? quiz : await payload.findByID({ collection: 'quizzes', id: relId(old.quiz)!, ...QUIZ_FIELDS }).catch(() => quiz)
    await closeStalePlay(payload, old, oldQuiz, now, settings.safety.tooFastRoundSeconds, settings.timers)
  }

  const today = mine.filter((r) => r.day === day)
  const elsewhere = today.find((r) => !same(r.quiz, quizId))
  if (elsewhere) {
    const other: any = await payload
      .findByID({ collection: 'quizzes', id: relId(elsewhere.quiz)!, depth: 0, overrideAccess: true })
      .catch(() => null)
    return { state: 'done', todayScore: Number(elsewhere.score) || 0, opensAt, otherQuiz: other?.quizTitle ?? null, answers: [] }
  }
  const here = today.filter((r) => same(r.quiz, quizId)).sort((a, b) => a.round - b.round)
  let current = here.find((r) => r.status !== 'completed')
  if (!current && here.length) {
    const last = here[here.length - 1]
    return {
      state: 'done',
      todayScore: here.reduce((a, r) => a + (Number(r.score) || 0), 0),
      opensAt,
      answers: await answeredSummary(payload, last.id),
    }
  }
  if (!current) {
    if (isCoolOff(now, settings.gameDay)) return { state: 'cooloff', opensAt }
    current = await createPlay(payload, quiz, userId, day, here.length + 1, ctx, settings.safety.linkedWindowMinutes)
    if (!current) return { state: 'empty', opensAt }
  }

  // Serve the current question; a question whose time ran out while away counts as a time-out
  const ids = ((current.questions || []) as any[]).map(relId).filter((x) => x !== null) as Id[]
  const slots = slotsOf(current, quiz)
  const docs = await questionDocs(payload, ids)
  let position = Number(current.position) || 0
  let servedAt: Date | null = current.servedAt ? new Date(current.servedAt) : null
  while (position < ids.length) {
    const q = docs.get(String(ids[position]))
    const limit = (settings.timers[q?.gameType] || 20) + extraFor(slots[position])
    if (!q) {
      // Question deleted since: skip it without points
      await sql(payload).query(
        'UPDATE quiz_rounds SET position = $2 + 1, served_at = NULL, updated_at = now() WHERE id = $1 AND position = $2',
        [current.id, position],
      )
      position++
      servedAt = null
      continue
    }
    if (servedAt && now.getTime() - servedAt.getTime() > (limit + GRACE_SECONDS) * 1000) {
      await recordAnswer(payload, current, position, q, slotAt(slots, position), { ...timeoutRecord(), seconds: limit, text: '', servedAt, answeredAt: now })
      position++
      servedAt = null
      continue
    }
    break
  }

  if (position >= ids.length) {
    await finalizePlay(payload, current, now, settings.safety.tooFastRoundSeconds)
    const fresh: any = await payload.findByID({ collection: 'quiz-rounds' as any, id: current.id, depth: 0, overrideAccess: true })
    return { state: 'done', todayScore: Number(fresh.score) || 0, opensAt, answers: await answeredSummary(payload, current.id) }
  }

  const q = docs.get(String(ids[position]))
  const timeLimit = (settings.timers[q.gameType] || 20) + extraFor(slots[position])
  if (!servedAt) {
    servedAt = now
    const set = await sql(payload).query(
      'UPDATE quiz_rounds SET served_at = $3, updated_at = now() WHERE id = $1 AND position = $2 AND served_at IS NULL RETURNING served_at',
      [current.id, position, now.toISOString()],
    )
    if (!set.rowCount) {
      const r = await sql(payload).query('SELECT served_at FROM quiz_rounds WHERE id = $1', [current.id])
      if (r.rows[0]?.served_at) servedAt = new Date(r.rows[0].served_at)
    }
  }
  const elapsed = Math.max(0, (now.getTime() - servedAt.getTime()) / 1000)
  const answers = await answeredSummary(payload, current.id)
  return {
    state: 'playing',
    roundId: current.id,
    position,
    total: ids.length,
    question: clientQuestion(q, timeLimit, slotAt(slots, position), current.id, settings.safety.shuffleOptions),
    timeLimit,
    secondsLeft: Math.max(0, Math.round((timeLimit - elapsed) * 10) / 10),
    answers,
    scoreSoFar: answers.reduce((a, r) => a + r.points, 0),
    scoring: settings.scoring,
  }
}

export type AnswerResult =
  | { ok: false; status: number; error: string }
  | {
      ok: true
      position: number
      total: number
      correct: boolean
      timedOut: boolean
      points: number
      speedBonus: number
      explanation: string | null
      reveal: Record<string, unknown>
      finished: boolean
      scoreSoFar: number
      result?: { todayScore: number; totalXP: number; title: any }
    }

/** One answer for the current question of a play (checked and timed here). */
export async function answerQuestion(
  payload: Payload,
  args: { roundId: Id; userId: Id; position: number; answer: AnswerInput },
  ctx: PlayCtx,
): Promise<AnswerResult> {
  const now = ctx.now
  const round: any = await payload
    .findByID({ collection: 'quiz-rounds' as any, id: toId(args.roundId), depth: 0, overrideAccess: true })
    .catch(() => null)
  if (!round || !same(round.user, args.userId)) return { ok: false, status: 404, error: 'Play not found.' }
  if (round.status === 'completed') return { ok: false, status: 409, error: 'This play is already finished.' }
  const position = Number(round.position) || 0
  if (Number(args.position) !== position) return { ok: false, status: 409, error: 'That question was already answered. Reload to continue.' }
  if (!round.servedAt) return { ok: false, status: 409, error: 'Reload to get the question.' }

  const quiz: any = await payload.findByID({ collection: 'quizzes', id: relId(round.quiz)!, ...QUIZ_FIELDS })
  const settings = await getGameSettings(payload)
  const ids = ((round.questions || []) as any[]).map(relId).filter((x) => x !== null) as Id[]
  const slots = slotsOf(round, quiz)
  const slot = slotAt(slots, position)
  const qid = ids[position]
  if (qid === undefined) return { ok: false, status: 409, error: 'Reload to continue.' }
  const q: any = (await questionDocs(payload, [qid])).get(String(qid))
  if (!q) return { ok: false, status: 409, error: 'Reload to continue.' }

  const servedAt = new Date(round.servedAt)
  const timeLimit = (settings.timers[q.gameType] || 20) + extraFor(slot)
  const seconds = Math.max(0, (now.getTime() - servedAt.getTime()) / 1000)
  const late = seconds > timeLimit + GRACE_SECONDS
  const timedOut = Boolean(args.answer?.timeout) || late

  let correct = false
  let text = ''
  let reveal: Record<string, unknown> = {}
  if (!timedOut) {
    const c = checkAnswer(q, args.answer || {})
    correct = c.correct
    text = c.text
    reveal = c.reveal
  } else if (q.gameType === 'mcq' || q.gameType === 'dropdown') {
    reveal = checkAnswer(q, {}).reveal
  }

  let points = 0
  let bonus = 0
  if (correct) {
    if (slot.points === 'fixed') {
      points = slot.fixedPoints !== null && slot.fixedPoints !== undefined ? Number(slot.fixedPoints) : Number(q.points) || 10
    } else {
      const tooQuick = seconds < settings.safety.speedFloorSeconds
      const scored = questionScore({
        isCorrect: true,
        basePoints: Number(q.points) || 10,
        secondsLeft: tooQuick ? 0 : Math.max(0, timeLimit - seconds),
        timeLimit,
        doubleUp: Boolean(q.enableDoubleUp),
        scoring: settings.scoring,
      })
      // secondsLeft 0 gives no bonus; base points still count
      points = tooQuick ? (Number(q.points) || 10) * (q.enableDoubleUp ? 2 : 1) : scored.points
      bonus = tooQuick ? 0 : scored.bonus
    }
  } else if (!timedOut) {
    points = -Math.abs(Number(q.negativePoints) || 0)
  }

  const rec = await recordAnswer(payload, round, position, q, slot, {
    correct,
    timedOut,
    points,
    speedBonus: bonus,
    seconds: Math.min(seconds, timeLimit + GRACE_SECONDS),
    text,
    servedAt,
    answeredAt: now,
  })
  if (rec.duplicate) return { ok: false, status: 409, error: 'That question was already answered. Reload to continue.' }

  const finished = position + 1 >= ids.length
  let result: { todayScore: number; totalXP: number; title: any } | undefined
  if (finished) {
    const closed = await finalizePlay(payload, round, now, settings.safety.tooFastRoundSeconds)
    const fresh: any = await payload.findByID({ collection: 'quiz-rounds' as any, id: round.id, depth: 0, overrideAccess: true })
    const user: any = await payload.findByID({ collection: 'quiz-users', id: relId(round.user)!, depth: 0, overrideAccess: true })
    const totalXP = closed?.totalXP ?? (Number(user?.totalXP) || 0)
    const t = getTitleForXP(totalXP, await getQuizTitles(payload))
    result = {
      todayScore: Number(fresh.score) || 0,
      totalXP,
      title: {
        name: t.title.name,
        tierIndex: t.tierIndex,
        tierCount: t.tierCount,
        nextName: t.next?.name ?? null,
        xpToNext: t.xpToNext,
      },
    }
  }
  const answers = await answeredSummary(payload, round.id)
  return {
    ok: true,
    position,
    total: ids.length,
    correct,
    timedOut,
    points,
    speedBonus: bonus,
    explanation: (formatQuestion(q).explanation as string) || null,
    reveal,
    finished,
    scoreSoFar: answers.reduce((a, r) => a + r.points, 0),
    ...(result ? { result } : {}),
  }
}

/** Today's progress without creating anything (quiz-check-played). */
export async function getTodayProgress(payload: Payload, quizId: Id, userId: Id, now: Date) {
  const settings = await getGameSettings(payload)
  const day = gameDayKey(now, settings.gameDay)!
  const rounds = (
    await payload.find({
      collection: 'quiz-rounds' as any,
      where: { and: [{ user: { equals: toId(userId) } }, { day: { equals: day } }] },
      depth: 0,
      pagination: false,
      overrideAccess: true,
    })
  ).docs as any[]
  const done = rounds.filter((r) => r.status === 'completed')
  return {
    hasPlayedToday: done.length > 0,
    todayScore: done.reduce((a, r) => a + (Number(r.score) || 0), 0),
    playedQuiz: done[0] ? relId(done[0].quiz) : null,
  }
}
