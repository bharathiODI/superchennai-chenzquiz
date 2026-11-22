import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { QUIZ_SITE_DEFAULTS, type QuizSiteSettingsData } from './defaults'
import { hasRichText } from './termsDefault'

type Section = keyof QuizSiteSettingsData

/** Keeps the default for any value the CMS left empty. */
const merge = <T extends Record<string, unknown>>(defaults: T, saved: unknown): T => {
  const result = { ...defaults }
  if (saved && typeof saved === 'object') {
    for (const key of Object.keys(defaults) as (keyof T)[]) {
      const value = (saved as Record<string, unknown>)[key as string]
      const empty =
        value === null ||
        value === undefined ||
        value === '' ||
        // an emptied rich-text editor still saves a blank paragraph
        (typeof value === 'object' && 'root' in (value as object) && !hasRichText(value))
      if (!empty) result[key] = value as T[keyof T]
    }
  }
  return result
}

/**
 * Reads the "Quiz Site Settings" global. Never throws: if the settings can't be read (for example
 * before the database migration has run) the built-in defaults are used, so pages keep working.
 */
export async function getQuizSiteSettings(): Promise<QuizSiteSettingsData> {
  try {
    const payload = await getPayload({ config: configPromise })
    const doc = (await payload.findGlobal({ slug: 'quiz-site-settings', depth: 0 })) as unknown as Record<
      string,
      unknown
    >
    const out = {} as QuizSiteSettingsData
    for (const section of Object.keys(QUIZ_SITE_DEFAULTS) as Section[]) {
      ;(out as Record<Section, unknown>)[section] = merge(QUIZ_SITE_DEFAULTS[section], doc?.[section])
    }
    return out
  } catch (error) {
    console.error('Could not read Quiz Site Settings, using defaults:', error)
    return QUIZ_SITE_DEFAULTS
  }
}
