// The quiz "game day": it starts at a set time in India time (default 12:30 AM) and runs until the
// same time the next day, with an optional break just before it (default 60 min = 11:30 PM-12:30 AM)
// when nobody can start a round. Pure - no database access.
import { istDateKey } from './quizStreak'

export type GameDaySettings = { startHour: number; startMinute: number; coolOffMinutes: number }

export const DEFAULT_GAME_DAY: GameDaySettings = { startHour: 0, startMinute: 30, coolOffMinutes: 60 }

const MINUTE_MS = 60 * 1000
const IST_OFFSET_MIN = 330

const clampInt = (v: unknown, fallback: number, min: number, max: number) => {
  const n = Math.floor(Number(v))
  return v !== null && v !== undefined && v !== '' && Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback
}

export function normalizeGameDay(raw: any): GameDaySettings {
  return {
    startHour: clampInt(raw?.startHour, DEFAULT_GAME_DAY.startHour, 0, 23),
    startMinute: clampInt(raw?.startMinute, raw?.startHour !== undefined && raw?.startHour !== null ? 0 : DEFAULT_GAME_DAY.startMinute, 0, 59),
    coolOffMinutes: clampInt(raw?.coolOffMinutes, DEFAULT_GAME_DAY.coolOffMinutes, 0, 720),
  }
}

const startOfDayMinutes = (s: GameDaySettings) => s.startHour * 60 + s.startMinute

/**
 * The game day an instant belongs to, as yyyy-mm-dd: the India date on which that day's play
 * began. With a 12:30 AM start, 12:15 AM on the 24th still belongs to the 23rd.
 */
export function gameDayKey(value: string | number | Date, s: GameDaySettings = DEFAULT_GAME_DAY): string | null {
  const t = new Date(value).getTime()
  if (!Number.isFinite(t)) return null
  return istDateKey(t - startOfDayMinutes(s) * MINUTE_MS)
}

/** True during the break before a new game day starts (no new rounds). */
export function isCoolOff(now: Date, s: GameDaySettings = DEFAULT_GAME_DAY): boolean {
  if (s.coolOffMinutes <= 0) return false
  const istMinutes = (((Math.floor(now.getTime() / 60000) + IST_OFFSET_MIN) % 1440) + 1440) % 1440
  const start = startOfDayMinutes(s)
  const from = start - s.coolOffMinutes
  return from >= 0 ? istMinutes >= from && istMinutes < start : istMinutes >= from + 1440 || istMinutes < start
}

/** "12:30 AM", "8:00 AM", "8:00 PM" */
export function formatStartHour(s: GameDaySettings = DEFAULT_GAME_DAY): string {
  const h = s.startHour % 12 === 0 ? 12 : s.startHour % 12
  return `${h}:${String(s.startMinute).padStart(2, '0')} ${s.startHour < 12 ? 'AM' : 'PM'}`
}
