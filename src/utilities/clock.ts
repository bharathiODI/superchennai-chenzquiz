// The game's clock. On the live site this is simply the real time. On the demo site, testers can
// move it forward with the demo tools (test clock), so the whole game - which questions a player
// gets, the one-play-a-day rule, streaks, leaderboard tabs, the dashboard - moves together.
//
// The offset lives in the `demo_flag` table, which exists only in a demo database (created by
// `chenzquiz-site.sh demo-db demo|copy-live` / the demo tools setup). A live database never has
// it, so even a demo app pointed at the live database runs on the real time.
import type { Payload } from 'payload'
import { demoUsesLiveData, isDemoSite } from './siteEnv'

let cache: { at: number; offsetMs: number } | null = null

export const demoToolsConfigured = () => isDemoSite() && !demoUsesLiveData() && Boolean(process.env.DEMO_TOOLS_KEY)

async function pool(payload: Payload): Promise<any | null> {
  return (payload.db as any)?.pool ?? null
}

/** Offset (ms) of the demo test clock; 0 when there is no demo database. */
export async function clockOffsetMs(payload: Payload, fresh = false): Promise<number> {
  if (!isDemoSite() || demoUsesLiveData()) return 0
  if (!fresh && cache && Date.now() - cache.at < 1000) return cache.offsetMs
  let offsetMs = 0
  try {
    const db = await pool(payload)
    const r = await db?.query("SELECT clock_offset_ms FROM demo_flag WHERE to_regclass('public.demo_flag') IS NOT NULL LIMIT 1")
    offsetMs = Number(r?.rows?.[0]?.clock_offset_ms) || 0
  } catch {
    offsetMs = 0 // no demo_flag table: not a demo database
  }
  cache = { at: Date.now(), offsetMs }
  return offsetMs
}

/** "Now" for game logic: real time, plus the test clock offset on a demo database. */
export async function getNow(payload: Payload): Promise<Date> {
  return new Date(Date.now() + (await clockOffsetMs(payload)))
}

/** True when this server may use the demo tools: demo site, a key set, and a demo database. */
export async function isDemoDatabase(payload: Payload): Promise<boolean> {
  if (!demoToolsConfigured()) return false
  try {
    const db = await pool(payload)
    const r = await db?.query("SELECT to_regclass('public.demo_flag') IS NOT NULL AS ok")
    return Boolean(r?.rows?.[0]?.ok)
  } catch {
    return false
  }
}

export function resetClockCache() {
  cache = null
}
