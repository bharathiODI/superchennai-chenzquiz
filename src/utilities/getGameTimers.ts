import type { Payload } from 'payload'
import { normalizeGameTimers, type GameTimers } from './gameScoring'

/** Per-game time limits from the quiz-settings global (falls back to defaults). */
export async function getGameTimers(payload: Payload): Promise<GameTimers> {
  try {
    const settings: any = await payload.findGlobal({
      slug: 'quiz-settings' as any,
      depth: 0,
      overrideAccess: true,
    })
    return normalizeGameTimers(settings?.gameTimers)
  } catch {
    return normalizeGameTimers(null)
  }
}
