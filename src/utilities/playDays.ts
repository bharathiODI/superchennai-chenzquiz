// The game days a player played, as the game saved them on each finished play (quiz_rounds.day).
// Streaks and "days played" use these, not the finish time: the day a time belongs to depends on
// the Quiz Settings game-day start, which changed on 23 Nov 2026 (8:00 AM -> 12:30 AM), so a play
// finished at 5:54 AM on 23 Nov was day 22 Nov for the game but would be re-counted as 23 Nov.
import type { Payload } from 'payload'

import { gameDayKey, type GameDaySettings } from './gameDay'

const DAY_KEY = /^\d{4}-\d{2}-\d{2}$/

/** user id -> sorted game-day keys of their finished plays. */
export async function playDaysByUser(payload: Payload, userIds: Array<string | number>) {
  const out = new Map<string, string[]>()
  const ids = userIds.map(Number).filter((n) => Number.isInteger(n) && n > 0)
  if (!ids.length) return out
  const { rows } = await (payload.db as any).pool.query(
    `SELECT user_id, array_agg(DISTINCT day ORDER BY day) AS days
       FROM quiz_rounds WHERE status = 'completed' AND user_id = ANY($1::int[]) AND day <> ''
      GROUP BY user_id`,
    [ids],
  )
  for (const r of rows)
    out.set(
      String(r.user_id),
      (r.days as string[]).filter((d) => DAY_KEY.test(d)),
    )
  return out
}

/** Day key for computeStreaks: a saved game-day key as it is, a time by the game-day setting. */
export const dayKeyOf =
  (gameDay: GameDaySettings) =>
  (d: string | number | Date): string | null =>
    typeof d === 'string' && DAY_KEY.test(d) ? d : gameDayKey(d, gameDay)
