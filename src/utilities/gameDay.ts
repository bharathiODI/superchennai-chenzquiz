// The quiz "game day": it starts at a set hour in India time (default 8:00 AM) and runs until the
// same hour the next day, with an optional break just before it (default 60 min = 7:00-8:00 AM)
// when nobody can start a round. Pure - no database access.
import { istDateKey } from './quizStreak'

export type GameDaySettings = { startHour: number; coolOffMinutes: number }

export const DEFAULT_GAME_DAY: GameDaySettings = { startHour: 8, coolOffMinutes: 60 }

const HOUR_MS = 60 * 60 * 1000
const IST_OFFSET_MIN = 330

const clampInt = (v: unknown, fallback: number, min: number, max: number) => {
  const n = Math.floor(Number(v))
  return v !== null && v !== undefined && v !== '' && Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback
}

export function normalizeGameDay(raw: any): GameDaySettings {
  return {
    startHour: clampInt(raw?.startHour, DEFAULT_GAME_DAY.startHour, 0, 23),
    coolOffMinutes: clampInt(raw?.coolOffMinutes, DEFAULT_GAME_DAY.coolOffMinutes, 0, 720),
  }
}

/**
 * The game day an instant belongs to, as yyyy-mm-dd: the India date on which that day's play
 * began. With an 8 AM start, 6:30 AM on the 23rd still belongs to the 22nd.
 */
export function gameDayKey(value: string | number | Date, s: GameDaySettings = DEFAULT_GAME_DAY): string | null {
  const t = new Date(value).getTime()
  if (!Number.isFinite(t)) return null
  return istDateKey(t - s.startHour * HOUR_MS)
}

/** True during the break before a new game day starts (no new rounds). */
export function isCoolOff(now: Date, s: GameDaySettings = DEFAULT_GAME_DAY): boolean {
  if (s.coolOffMinutes <= 0) return false
  const t = now.getTime()
  const istMinutes = (((Math.floor(t / 60000) + IST_OFFSET_MIN) % 1440) + 1440) % 1440
  const start = s.startHour * 60
  const from = start - s.coolOffMinutes
  return from >= 0 ? istMinutes >= from && istMinutes < start : istMinutes >= from + 1440 || istMinutes < start
}

/** "8:00 AM" */
export function formatStartHour(s: GameDaySettings = DEFAULT_GAME_DAY): string {
  const h = s.startHour % 12 === 0 ? 12 : s.startHour % 12
  return `${h}:00 ${s.startHour < 12 ? 'AM' : 'PM'}`
}
