// Per-game time limits and the speed bonus. Pure functions - safe on client and server.

export const GAME_TYPES = [
  { value: 'mcq', key: 'mcq', label: 'MCQ', defaultSeconds: 20 },
  { value: 'dropdown', key: 'dropdown', label: 'Dropdown', defaultSeconds: 60 },
  { value: 'wordle', key: 'wordle', label: 'Wordle', defaultSeconds: 60 },
  { value: 'word_finder', key: 'wordFinder', label: 'Word Finder', defaultSeconds: 60 },
  { value: 'match_following', key: 'matchFollowing', label: 'Match the Following', defaultSeconds: 60 },
  { value: 'spot_lie', key: 'spotLie', label: 'Spot the Lie', defaultSeconds: 60 },
  { value: 'reorder', key: 'reorder', label: 'Re-order', defaultSeconds: 60 },
  { value: 'drag_drop', key: 'dragDrop', label: 'Drag & Drop', defaultSeconds: 60 },
] as const

export type GameTimers = Record<string, number>

/** Time limit (seconds) per gameType value, e.g. { mcq: 20, word_finder: 60 }. */
export function normalizeGameTimers(raw?: Record<string, unknown> | null): GameTimers {
  const out: GameTimers = {}
  for (const g of GAME_TYPES) {
    const v = Number(raw?.[g.key])
    out[g.value] = Number.isFinite(v) && v >= 5 ? Math.round(v) : g.defaultSeconds
  }
  return out
}

export const MAX_SPEED_BONUS = 5

/**
 * Speed bonus for a correct answer, scaled to the game's time limit.
 * For a 20s MCQ: 20-17s left = 5, 16-14 = 4, 13-10 = 3, 9-5 = 2, 4-1 = 1, 0/timeout = 0.
 * Other limits use the same proportions (85% / 70% / 50% / 25% of the time left).
 */
export function speedBonus(secondsLeft: number, timeLimit: number): number {
  const limit = Math.max(1, Math.round(Number(timeLimit) || 0))
  const left = Math.min(limit, Math.max(0, Math.floor(Number(secondsLeft) || 0)))
  if (left <= 0) return 0
  if (left >= Math.round(limit * 0.85)) return 5
  if (left >= Math.round(limit * 0.7)) return 4
  if (left >= Math.round(limit * 0.5)) return 3
  if (left >= Math.round(limit * 0.25)) return 2
  return 1
}

/** Points for one answered question: (question points + speed bonus), doubled for Double Up. */
export function questionScore(opts: {
  isCorrect: boolean
  basePoints: number
  secondsLeft: number
  timeLimit: number
  doubleUp?: boolean
  negativePoints?: number
}): { points: number; bonus: number } {
  if (!opts.isCorrect) return { points: -Math.abs(Number(opts.negativePoints) || 0), bonus: 0 }
  const bonus = speedBonus(opts.secondsLeft, opts.timeLimit)
  const points = (Math.max(0, Number(opts.basePoints) || 0) + bonus) * (opts.doubleUp ? 2 : 1)
  return { points, bonus }
}
