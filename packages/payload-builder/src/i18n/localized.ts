import type { Field } from 'payload'

/**
 * The multilingual switch.
 *
 * Every field the plugin generates goes through `L()`. When the plugin is
 * configured with `i18n: false` (or omitted), `localized` is stripped
 * everywhere, so a single-language project gets a clean single-column
 * schema with no per-locale rows — nothing to disable by hand later.
 *
 * ERDC runs with i18n on (en + ar). Most other projects won't.
 */

let localizationEnabled = false

/** Called once by builderPlugin before any field factory runs. */
export const setLocalizationEnabled = (enabled: boolean): void => {
  localizationEnabled = enabled
}

export const isLocalizationEnabled = (): boolean => localizationEnabled

/**
 * Marks a field localized only when the project is multilingual.
 *
 *   L({ name: 'title', type: 'text' })
 */
export const L = <T extends Field>(field: T): T =>
  localizationEnabled ? ({ ...field, localized: true } as T) : field

/** Applies `L` across a list. */
export const LAll = (fields: Field[]): Field[] => fields.map((f) => L(f))
