// Daily-play streaks, counted in India time (Asia/Kolkata, UTC+05:30).

const IST_OFFSET_MS = 330 * 60 * 1000
const DAY_MS = 24 * 60 * 60 * 1000

/** yyyy-mm-dd of the given instant in India time. */
export function istDateKey(value: string | number | Date): string | null {
  const t = new Date(value).getTime()
  if (!Number.isFinite(t)) return null
  return new Date(t + IST_OFFSET_MS).toISOString().slice(0, 10)
}

function keyToDayNumber(key: string): number {
  return Math.round(new Date(`${key}T00:00:00Z`).getTime() / DAY_MS)
}

export function computeStreaks(
  dates: Array<string | number | Date | null | undefined>,
  now: Date = new Date(),
): { current: number; best: number } {
  const days = Array.from(
    new Set(
      dates
        .filter((d): d is string | number | Date => d !== null && d !== undefined)
        .map((d) => istDateKey(d))
        .filter((k): k is string => Boolean(k)),
    ),
  )
    .map(keyToDayNumber)
    .sort((a, b) => a - b)

  if (days.length === 0) return { current: 0, best: 0 }

  let best = 1
  let run = 1
  for (let i = 1; i < days.length; i++) {
    run = days[i]! - days[i - 1]! === 1 ? run + 1 : 1
    best = Math.max(best, run)
  }

  const today = keyToDayNumber(istDateKey(now)!)
  const last = days[days.length - 1]!
  let current = 0
  if (today - last <= 1) {
    current = 1
    for (let i = days.length - 1; i > 0; i--) {
      if (days[i]! - days[i - 1]! === 1) current++
      else break
    }
  }

  return { current, best: Math.max(best, current) }
}
