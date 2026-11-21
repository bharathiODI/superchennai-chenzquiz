// Player titles (tiers) based on total XP.
// Values are managed in Payload admin: Globals -> Quiz Titles & Rewards.
// These defaults apply until that global is saved.

export type QuizTitle = { name: string; minXP: number }

export type TitleResult = {
  title: QuizTitle
  /** 0 = lowest tier. Used for badge colours. */
  tierIndex: number
  tierCount: number
  next: QuizTitle | null
  xpToNext: number
  /** Progress (0-100) from the current tier towards the next one. */
  progress: number
}

export const DEFAULT_QUIZ_TITLES: QuizTitle[] = [
  { name: 'Chennai Rookie', minXP: 0 },
  { name: 'Namma Chennai Expert', minXP: 50 },
  { name: 'Chennai Master', minXP: 150 },
]

export function normalizeTitles(raw?: unknown): QuizTitle[] {
  const list = Array.isArray(raw)
    ? raw
        .map((t: any) => ({ name: String(t?.name || '').trim(), minXP: Number(t?.minXP) }))
        .filter((t) => t.name && Number.isFinite(t.minXP) && t.minXP >= 0)
    : []

  if (list.length === 0) return DEFAULT_QUIZ_TITLES

  return list.sort((a, b) => a.minXP - b.minXP)
}

export function getTitleForXP(xp: number, titles: QuizTitle[] = DEFAULT_QUIZ_TITLES): TitleResult {
  const sorted = normalizeTitles(titles)
  const safeXP = Math.max(0, Number(xp) || 0)

  let tierIndex = 0
  sorted.forEach((t, i) => {
    if (safeXP >= t.minXP) tierIndex = i
  })

  const title = sorted[tierIndex] ?? DEFAULT_QUIZ_TITLES[0]!
  const next = sorted[tierIndex + 1] ?? null
  const xpToNext = next ? Math.max(0, next.minXP - safeXP) : 0
  const span = next ? next.minXP - title.minXP : 0
  const progress = next && span > 0 ? Math.min(100, Math.round(((safeXP - title.minXP) / span) * 100)) : 100

  return { title, tierIndex, tierCount: sorted.length, next, xpToNext, progress }
}

/** Colour family for a tier, spread across however many tiers exist. */
export function tierTone(tierIndex: number, tierCount: number): 'rookie' | 'expert' | 'master' {
  if (tierCount <= 1) return 'rookie'
  if (tierIndex >= tierCount - 1) return 'master'
  if (tierIndex === 0) return 'rookie'
  return 'expert'
}
