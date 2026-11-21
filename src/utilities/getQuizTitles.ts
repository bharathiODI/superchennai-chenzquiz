import type { Payload } from 'payload'
import { DEFAULT_QUIZ_TITLES, normalizeTitles, type QuizTitle } from './quizTitles'

/** Reads title tiers from the `quiz-settings` global, falling back to defaults. */
export async function getQuizTitles(payload: Payload): Promise<QuizTitle[]> {
  try {
    const settings: any = await payload.findGlobal({
      slug: 'quiz-settings' as any,
      depth: 0,
      overrideAccess: true,
    })
    return normalizeTitles(settings?.titles)
  } catch {
    return DEFAULT_QUIZ_TITLES
  }
}
