// Picks the questions for one player's round. Pure - no database access.

export type Id = string | number

export type RoundPlanInput = {
  /** Every question in the challenge pool (published). */
  poolIds: Id[]
  /** Questions this player already answered in the challenge, oldest first. */
  answeredIds: Id[]
  /** Questions already given to this player today (other rounds). */
  todayIds: Id[]
  /** Questions used as sponsored questions anywhere in the schedule (never served as regular ones). */
  sponsoredIds: Id[]
  /** Sponsored question for this day + round, if any. */
  sponsoredId: Id | null
  questionsPerRound: number
  /** 1-based slot for the sponsored question (e.g. 3 = third question). */
  sponsoredPosition: number
  random?: () => number
}

export type RoundPlan = { questionIds: Id[]; sponsoredId: Id | null; recycled: number }

const key = (id: Id) => String(id)

export function shuffle<T>(list: T[], random: () => number = Math.random): T[] {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }
  return a
}

export function planRound(input: RoundPlanInput): RoundPlan {
  const random = input.random ?? Math.random
  const perRound = Math.max(1, Math.floor(input.questionsPerRound || 1))
  const sponsored = new Set(input.sponsoredIds.map(key))
  const answered = new Set(input.answeredIds.map(key))
  const today = new Set(input.todayIds.map(key))

  const sponsoredId = input.sponsoredId ?? null
  const hasSponsor = sponsoredId !== null && input.sponsoredPosition >= 1
  const regularNeeded = Math.max(0, perRound - (hasSponsor ? 1 : 0))

  const regularPool = input.poolIds.filter((id) => !sponsored.has(key(id)) && !today.has(key(id)))
  const fresh = regularPool.filter((id) => !answered.has(key(id)))
  let picks = shuffle(fresh, random).slice(0, regularNeeded)

  // Pool exhausted for this player: reuse their oldest answered questions rather than serve a short round.
  let recycled = 0
  if (picks.length < regularNeeded) {
    const inPool = new Set(regularPool.map(key))
    const oldestFirst = input.answeredIds.filter((id, i, arr) => inPool.has(key(id)) && arr.findIndex((x) => key(x) === key(id)) === i)
    const extra = oldestFirst.slice(0, regularNeeded - picks.length)
    recycled = extra.length
    picks = shuffle([...picks, ...extra], random)
  }

  const questionIds: Id[] = [...picks]
  if (hasSponsor) {
    const slot = Math.min(Math.max(1, Math.floor(input.sponsoredPosition)), questionIds.length + 1) - 1
    questionIds.splice(slot, 0, sponsoredId!)
  }

  return { questionIds, sponsoredId: hasSponsor ? sponsoredId : null, recycled }
}
