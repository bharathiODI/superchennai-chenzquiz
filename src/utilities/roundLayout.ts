// The Round layout on a quiz: one slot per question a player gets each day (lean setup, Nov 2026).
// Pure - safe on client and server.

export type SlotSource = 'general' | 'sponsored'

export type Slot = {
  source: SlotSource
  extraSeconds: number
  points: 'normal' | 'fixed'
  fixedPoints: number | null
  sponsorName: string
  sponsorLine: string
  sponsorLogo: string | null
}

export const DEFAULT_ROUND_LAYOUT = [
  { source: 'general', extraSeconds: 0, points: 'normal' },
  { source: 'general', extraSeconds: 0, points: 'normal' },
  { source: 'sponsored', extraSeconds: 10, points: 'normal', sponsorName: 'DRA Homes' },
]

const num = (v: unknown, fallback: number, min: number, max: number) => {
  const n = Number(v)
  return v !== null && v !== undefined && v !== '' && Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback
}

const mediaUrl = (v: any): string | null => (v && typeof v === 'object' && v.url ? String(v.url) : null)

export function normalizeSlot(raw: any): Slot {
  return {
    source: raw?.source === 'sponsored' ? 'sponsored' : 'general',
    extraSeconds: Math.round(num(raw?.extraSeconds, 0, 0, 120)),
    points: raw?.points === 'fixed' ? 'fixed' : 'normal',
    fixedPoints: raw?.fixedPoints === null || raw?.fixedPoints === undefined || raw?.fixedPoints === '' ? null : num(raw.fixedPoints, 0, 0, 1000),
    sponsorName: typeof raw?.sponsorName === 'string' ? raw.sponsorName.trim() : '',
    sponsorLine: typeof raw?.sponsorLine === 'string' ? raw.sponsorLine.trim() : '',
    sponsorLogo: typeof raw?.sponsorLogo === 'string' ? raw.sponsorLogo : mediaUrl(raw?.sponsorLogo),
  }
}

/**
 * The quiz's slots. Quizzes saved before the Round layout existed fall back to their old settings:
 * "Questions per round" slots with the sponsored one at "Sponsored question slot".
 */
export function quizSlots(quiz: any): Slot[] {
  const rows = Array.isArray(quiz?.roundLayout) ? quiz.roundLayout : []
  if (rows.length) return rows.slice(0, 10).map(normalizeSlot)
  const count = Math.round(num(quiz?.questionsPerRound, 3, 1, 10))
  const sponsoredAt = Math.round(num(quiz?.sponsoredPosition, 0, 0, 20))
  return Array.from({ length: count }, (_, i) =>
    normalizeSlot({ source: i + 1 === sponsoredAt ? 'sponsored' : 'general' }),
  )
}

/** "Q3 · Sponsored · +10 s · fixed" */
export function slotLabel(slot: Partial<Slot> | null | undefined, index: number): string {
  const s = normalizeSlot(slot)
  return [
    `Q${index + 1}`,
    s.source === 'sponsored' ? `Sponsored${s.sponsorName ? ` (${s.sponsorName})` : ''}` : 'General',
    s.extraSeconds ? `+${s.extraSeconds} s` : '',
    s.points === 'fixed' ? `fixed${s.fixedPoints !== null ? ` ${s.fixedPoints}` : ''} points` : '',
  ]
    .filter(Boolean)
    .join(' · ')
}
