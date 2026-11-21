import type { ElementDefinition } from '@opendesigns/payload-builder'
import { standardElements } from '@opendesigns/payload-builder/rsc'

import { chenzElements } from './chenzElements'

/**
 * Kit elements offered in the builder. Each element adds database tables, so the list is kept
 * short. To offer another one (accordion, gallery, table, ...), add its slug here and generate a
 * migration for the new tables.
 */
const STANDARD_SLUGS = ['heading', 'richText', 'button', 'image', 'video', 'divider', 'spacer']

export const standardSubset: ElementDefinition[] = STANDARD_SLUGS.map((slug) => {
  const el = standardElements.find((e) => e.slug === slug)
  if (!el) throw new Error(`[builder] unknown kit element "${slug}"`)
  return el
})

/** Every element the page builder offers: the kit subset plus the quiz site's own sections. */
export const builderElements: ElementDefinition[] = [...standardSubset, ...chenzElements]
