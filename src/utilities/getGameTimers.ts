import type { Payload } from 'payload'
import {
  normalizeGameTimers,
  normalizeScoring,
  type GameTimers,
  type ScoringSettings,
} from './gameScoring'

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

/** Speed bonus settings from the quiz-settings global (falls back to defaults). */
export async function getScoringSettings(payload: Payload): Promise<ScoringSettings> {
  const settings = await readQuizSettings(payload)
  return normalizeScoring(settings?.scoring)
}
