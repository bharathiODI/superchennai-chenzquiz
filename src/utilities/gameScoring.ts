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

/* ---------- speed bonus (CMS > Quiz Settings > Game Timers & Scoring) ---------- */

/** A correct answer earns `bonus` when at least `minPercentLeft` % of the time limit is left. */
export type BonusTier = { minPercentLeft: number; bonus: number }
export type ScoringSettings = { speedBonus: boolean; tiers: BonusTier[] }

/** For a 20s MCQ: 20-17s left = 5, 16-14 = 4, 13-10 = 3, 9-5 = 2, 4-1 = 1, timeout = 0. */
export const DEFAULT_BONUS_TIERS: BonusTier[] = [
  { minPercentLeft: 85, bonus: 5 },
  { minPercentLeft: 70, bonus: 4 },
  { minPercentLeft: 50, bonus: 3 },
  { minPercentLeft: 25, bonus: 2 },
  { minPercentLeft: 0, bonus: 1 },
]

export const DEFAULT_SCORING: ScoringSettings = { speedBonus: true, tiers: DEFAULT_BONUS_TIERS }

/** Settings as saved in the CMS -> safe values (falls back to the defaults). */
export function normalizeScoring(raw?: Record<string, unknown> | null): ScoringSettings {
  const rows = Array.isArray(raw?.bonusTiers) ? (raw!.bonusTiers as Record<string, unknown>[]) : []
  const tiers = rows
    .map((r) => ({ minPercentLeft: Number(r?.minPercentLeft), bonus: Number(r?.bonus) }))
    .filter((t) => Number.isFinite(t.minPercentLeft) && Number.isFinite(t.bonus))
    .map((t) => ({
      minPercentLeft: Math.min(100, Math.max(0, t.minPercentLeft)),
      bonus: Math.min(100, Math.max(0, Math.round(t.bonus))),
    }))
    .sort((a, b) => b.minPercentLeft - a.minPercentLeft)
  return {
    speedBonus: raw?.speedBonus !== false,
    tiers: tiers.length ? tiers : DEFAULT_BONUS_TIERS,
  }
}

/** The largest bonus one answer can earn (used to cap submitted scores). */
export function maxSpeedBonus(scoring: ScoringSettings = DEFAULT_SCORING): number {
  return scoring.speedBonus ? Math.max(0, ...scoring.tiers.map((t) => t.bonus)) : 0
}

/** @deprecated use maxSpeedBonus(scoring) */
export const MAX_SPEED_BONUS = 5

/**
 * Speed bonus for a correct answer, scaled to the game's time limit: the first tier (highest
 * percentage first) whose share of the limit is still left. No time left = no bonus.
 */
export function speedBonus(
  secondsLeft: number,
  timeLimit: number,
  scoring: ScoringSettings = DEFAULT_SCORING,
): number {
  if (!scoring.speedBonus) return 0
  const limit = Math.max(1, Math.round(Number(timeLimit) || 0))
  const left = Math.min(limit, Math.max(0, Math.floor(Number(secondsLeft) || 0)))
  if (left <= 0) return 0
  for (const tier of scoring.tiers) {
    if (left >= Math.round(limit * (tier.minPercentLeft / 100))) return tier.bonus
  }
  return 0
}

/** Points for one answered question: (question points + speed bonus), doubled for Double Up. */
export function questionScore(opts: {
  isCorrect: boolean
  basePoints: number
  secondsLeft: number
  timeLimit: number
  doubleUp?: boolean
  negativePoints?: number
  scoring?: ScoringSettings
}): { points: number; bonus: number } {
  if (!opts.isCorrect) return { points: -Math.abs(Number(opts.negativePoints) || 0), bonus: 0 }
  const bonus = speedBonus(opts.secondsLeft, opts.timeLimit, opts.scoring)
  const points = (Math.max(0, Number(opts.basePoints) || 0) + bonus) * (opts.doubleUp ? 2 : 1)
  return { points, bonus }
}
