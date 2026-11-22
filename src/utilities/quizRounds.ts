// Daily rounds: which questions each player gets, per day and round (server only).
import type { Payload } from 'payload'
import { istDateKey } from './quizStreak'
import { planRound, type Id } from './roundPlanner'
import { getGameTimers, getScoringSettings } from './getGameTimers'
import { formatQuestion } from './formatQuestion'
import { maxSpeedBonus, type ScoringSettings } from './gameScoring'

export const relId = (v: any): Id | null =>
  v && typeof v === 'object' ? (v.id ?? null) : (v ?? null)

/** Postgres ids are numbers; query-string ids arrive as strings. */
export const toId = (v: any): Id => (/^\d+$/.test(String(v)) ? Number(v) : v)

const same = (a: any, b: any) => String(relId(a)) === String(relId(b))

const clampInt = (v: any, fallback: number, min: number, max: number) => {
  const n = Math.floor(Number(v))
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback
}

export function roundSettings(quiz: any) {
  return {
    totalRounds: clampInt(quiz?.roundsPerDay, 3, 1, 10),
    perRound: clampInt(quiz?.questionsPerRound, 3, 1, 20),
    sponsoredPosition: clampInt(quiz?.sponsoredPosition, 3, 0, 20),
  }
}

export type RoundSummary = { round: number; status: string; score: number | null }

export type RoundResult =
  | { state: 'not_started' | 'closed'; totalRounds: number }
  | { state: 'done'; totalRounds: number; rounds: RoundSummary[]; todayScore: number }
  | { state: 'empty'; totalRounds: number; round: number }
  | {
      state: 'ready'
      totalRounds: number
      round: number
      roundId: Id
      rounds: RoundSummary[]
      questions: ReturnType<typeof formatQuestion>[]
      scoring: ScoringSettings
    }

/** Question Number, then Display Order, then position in the quiz's question list. */
function sortByQuestionNumber<T extends { id: Id; questionNumber?: unknown; order?: unknown }>(
  docs: T[],
  quizOrder: (Id | null)[] = [],
): T[] {
  const pos = new Map(quizOrder.filter((x) => x !== null).map((id, i) => [String(id), i]))
  const num = (v: unknown) => (Number.isFinite(Number(v)) && v !== null && v !== '' ? Number(v) : Infinity)
  return [...docs].sort(
    (a, b) =>
      num(a.questionNumber) - num(b.questionNumber) ||
      num(a.order) - num(b.order) ||
      (pos.get(String(a.id)) ?? Infinity) - (pos.get(String(b.id)) ?? Infinity) ||
      String(a.id).localeCompare(String(b.id), undefined, { numeric: true }),
  )
}

async function findPlayerRounds(payload: Payload, quizId: Id, userId: Id) {
  const res = await payload.find({
    collection: 'quiz-rounds' as any,
    where: { and: [{ user: { equals: userId } }, { quiz: { equals: quizId } }] },
    sort: 'createdAt',
    depth: 0,
    pagination: false,
    overrideAccess: true,
  })
  return res.docs as any[]
}

/** Today's progress without creating anything (used by quiz-check-played and quiz-submit). */
export async function getTodayStatus(payload: Payload, quizId: Id, userId: Id, now = new Date()) {
  const quiz: any = await payload.findByID({ collection: 'quizzes', id: quizId, depth: 0, overrideAccess: true })
  const { totalRounds } = roundSettings(quiz)
  const day = istDateKey(now)!
  const today = (await findPlayerRounds(payload, quizId, userId)).filter((r) => r.day === day)
  const completed = today.filter((r) => r.status === 'completed')
  return {
    totalRounds,
    roundsCompleted: completed.length,
    todayScore: completed.reduce((a, r) => a + (Number(r.score) || 0), 0),
    hasPlayedToday: completed.length >= totalRounds,
  }
}

/** Returns the player's current round for today, creating it (with fresh questions) if needed. */
export async function getTodayRound(
  payload: Payload,
  quizIdRaw: Id,
  userIdRaw: Id,
  now = new Date(),
): Promise<RoundResult> {
  const quizId = toId(quizIdRaw)
  const userId = toId(userIdRaw)
  const quiz: any = await payload.findByID({ collection: 'quizzes', id: quizId, depth: 0, overrideAccess: true })
  const { totalRounds, perRound, sponsoredPosition } = roundSettings(quiz)

  if (quiz.quizDate && now < new Date(quiz.quizDate)) return { state: 'not_started', totalRounds }
  if (quiz.quizEndDate && now > new Date(quiz.quizEndDate)) return { state: 'closed', totalRounds }

  const day = istDateKey(now)!
  const all = await findPlayerRounds(payload, quizId, userId)
  const today = all.filter((r) => r.day === day).sort((a, b) => a.round - b.round)
  const summaries = (): RoundSummary[] =>
    today.map((r) => ({ round: r.round, status: r.status, score: r.score ?? null }))

  const completedToday = today.filter((r) => r.status === 'completed')
  if (completedToday.length >= totalRounds) {
    return {
      state: 'done',
      totalRounds,
      rounds: summaries(),
      todayScore: completedToday.reduce((a, r) => a + (Number(r.score) || 0), 0),
    }
  }

  let current = today.find((r) => r.status !== 'completed')

  if (!current) {
    const roundNo = today.reduce((m, r) => Math.max(m, Number(r.round) || 0), 0) + 1

    // Published questions in the pool
    const poolRaw = (quiz.questions || []).map(relId).filter((x: any) => x !== null) as Id[]
    const published = poolRaw.length
      ? await payload.find({
          collection: 'questions',
          where: { and: [{ id: { in: poolRaw } }, { _status: { equals: 'published' } }] },
          depth: 0,
          pagination: false,
          overrideAccess: true,
        })
      : { docs: [] as any[] }
    const poolIds = sortByQuestionNumber(published.docs as any[], poolRaw).map((d) => d.id as Id)

    // Sponsored schedule
    const schedule = ((quiz.sponsoredQuestions || []) as any[]).filter((row) => relId(row.question) !== null)
    const sponsoredIds = schedule.map((row) => relId(row.question) as Id)
    const todaysRows = schedule.filter((row) => row.date && istDateKey(row.date) === day)
    const sponsorRow =
      todaysRows.find((row) => Number(row.round) === roundNo) || todaysRows.find((row) => !row.round)
    const sponsoredId = sponsoredPosition > 0 && sponsorRow ? (relId(sponsorRow.question) as Id) : null

    // Already answered in this challenge (completed rounds, oldest first) and given today
    const answeredIds = all
      .filter((r) => r.status === 'completed')
      .flatMap((r) => (r.questions || []).map(relId).filter((q: any) => q !== null && !same(q, r.sponsoredQuestion)))
    const todayIds = today.flatMap((r) => (r.questions || []).map(relId))

    const plan = planRound({
      poolIds,
      answeredIds,
      todayIds,
      sponsoredIds,
      sponsoredId,
      questionsPerRound: perRound,
      sponsoredPosition,
      ordered: !quiz.shuffleQuestions,
    })

    if (plan.questionIds.length === 0) return { state: 'empty', totalRounds, round: roundNo }

    try {
      current = await payload.create({
        collection: 'quiz-rounds' as any,
        data: {
          user: userId,
          quiz: quizId,
          day,
          round: roundNo,
          status: 'assigned',
          questions: plan.questionIds,
          sponsoredQuestion: plan.sponsoredId,
          recycled: plan.recycled,
        } as any,
        overrideAccess: true,
      })
    } catch (err) {
      // Same round created by a parallel request (unique index) - use that one.
      const again = (await findPlayerRounds(payload, quizId, userId)).find(
        (r) => r.day === day && Number(r.round) === roundNo,
      )
      if (!again) throw err
      current = again
    }
    today.push(current)
  }

  const ids = ((current!.questions || []) as any[]).map(relId).filter((x) => x !== null) as Id[]
  const docs = ids.length
    ? await payload.find({
        collection: 'questions',
        where: { id: { in: ids } },
        depth: 2,
        pagination: false,
        overrideAccess: true,
      })
    : { docs: [] as any[] }
  const timers = await getGameTimers(payload)
  const byId = new Map((docs.docs as any[]).map((d) => [String(d.id), d]))
  let roundDocs = ids.map((id) => byId.get(String(id))).filter(Boolean) as any[]
  if (!quiz.shuffleQuestions) {
    // Serve in Question Number order (also fixes rounds planned before shuffling was turned off);
    // the sponsored question stays in the slot it was planned for.
    const slot = roundDocs.findIndex((q) => same(q.id, current!.sponsoredQuestion))
    const sponsoredDoc = slot >= 0 ? roundDocs[slot] : null
    const regular = sortByQuestionNumber(
      roundDocs.filter((q) => q !== sponsoredDoc),
      (quiz.questions || []).map(relId),
    )
    roundDocs = sponsoredDoc ? [...regular.slice(0, slot), sponsoredDoc, ...regular.slice(slot)] : regular
  }
  const questions = roundDocs.map((q: any) =>
    formatQuestion(q, timers[q.gameType], same(q.id, current!.sponsoredQuestion)),
  )

  return {
    state: 'ready',
    totalRounds,
    round: Number(current!.round),
    roundId: current!.id,
    rounds: summaries(),
    questions,
    scoring: await getScoringSettings(payload),
  }
}

/** Highest / lowest score a round can legitimately produce (used to reject tampered submissions). */
export async function roundScoreBounds(payload: Payload, round: any) {
  const ids = ((round.questions || []) as any[]).map(relId).filter((x) => x !== null) as Id[]
  if (!ids.length) return { min: 0, max: 0 }
  const res = await payload.find({
    collection: 'questions',
    where: { id: { in: ids } },
    depth: 0,
    pagination: false,
    overrideAccess: true,
  })
  const bonusCap = maxSpeedBonus(await getScoringSettings(payload))
  let max = 0
  let min = 0
  for (const q of res.docs as any[]) {
    const mult = q.enableDoubleUp ? 2 : 1
    max += ((Number(q.points) || 10) + bonusCap) * mult
    min -= Math.abs(Number(q.negativePoints) || 0)
  }
  return { min, max }
}
