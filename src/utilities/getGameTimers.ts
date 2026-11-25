import type { Payload } from 'payload'
import {
  normalizeGameTimers,
  normalizeScoring,
  type GameTimers,
  type ScoringSettings,
} from './gameScoring'
import { normalizeGameDay, type GameDaySettings } from './gameDay'

async function readQuizSettings(payload: Payload): Promise<any> {
  try {
    return await payload.findGlobal({ slug: 'quiz-settings' as any, depth: 0, overrideAccess: true })
  } catch {
    return null
  }
}

/** Per-game time limits from the quiz-settings global (falls back to defaults). */
export async function getGameTimers(payload: Payload): Promise<GameTimers> {
  const settings = await readQuizSettings(payload)
  return normalizeGameTimers(settings?.gameTimers)
}

/** When the game day starts and the break before it (falls back to 12:30 AM, 60 min). */
export async function getGameDaySettings(payload: Payload): Promise<GameDaySettings> {
  const settings = await readQuizSettings(payload)
  return normalizeGameDay(settings?.gameDay)
}

/** Speed bonus settings from the quiz-settings global (falls back to defaults). */
export async function getScoringSettings(payload: Payload): Promise<ScoringSettings> {
  const settings = await readQuizSettings(payload)
  return normalizeScoring(settings?.scoring)
}

export type SafetySettings = { speedFloorSeconds: number; tooFastRoundSeconds: number; linkedWindowMinutes: number; shuffleOptions: boolean }

const safeNum = (v: unknown, fallback: number, min: number, max: number) => {
  const n = Number(v)
  return v !== null && v !== undefined && v !== '' && Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback
}

/** Fair-play rules (Quiz Settings > Game Timers & Scoring > Fair play). */
export async function getSafetySettings(payload: Payload): Promise<SafetySettings> {
  const s = (await readQuizSettings(payload))?.safety
  return {
    speedFloorSeconds: safeNum(s?.speedFloorSeconds, 1.5, 0, 30),
    tooFastRoundSeconds: safeNum(s?.tooFastRoundSeconds, 6, 0, 300),
    linkedWindowMinutes: safeNum(s?.linkedWindowMinutes, 60, 0, 1440),
    shuffleOptions: s?.shuffleOptions !== false,
  }
}

/** Everything the game needs from Quiz Settings, read once. */
export async function getGameSettings(payload: Payload) {
  const raw = await readQuizSettings(payload)
  return {
    timers: normalizeGameTimers(raw?.gameTimers),
    gameDay: normalizeGameDay(raw?.gameDay),
    scoring: normalizeScoring(raw?.scoring),
    safety: {
      speedFloorSeconds: safeNum(raw?.safety?.speedFloorSeconds, 1.5, 0, 30),
      tooFastRoundSeconds: safeNum(raw?.safety?.tooFastRoundSeconds, 6, 0, 300),
      linkedWindowMinutes: safeNum(raw?.safety?.linkedWindowMinutes, 60, 0, 1440),
      shuffleOptions: raw?.safety?.shuffleOptions !== false,
    } as SafetySettings,
  }
}
