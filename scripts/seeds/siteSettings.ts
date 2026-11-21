import type { Payload } from 'payload'
import { QUIZ_SITE_DEFAULTS } from '../../src/globals/QuizSiteSettings/defaults'

/**
 * Fills "Quiz Site Settings" with the default text the first time. Once the settings have been
 * saved (by this seed or in the CMS) they are left alone, so CMS edits are never overwritten.
 */
export async function seedSiteSettings(payload: Payload): Promise<void> {
  console.log('\nQuiz Site Settings')
  const current = await payload.findGlobal({ slug: 'quiz-site-settings', depth: 0 })
  if (current?.updatedAt) {
    console.log('  already set up - edit it in the CMS (Globals > Quiz Site Settings)')
    return
  }
  await payload.updateGlobal({
    slug: 'quiz-site-settings',
    data: QUIZ_SITE_DEFAULTS,
    context: { disableRevalidate: true },
  })
  console.log('  default text and options imported')
}
