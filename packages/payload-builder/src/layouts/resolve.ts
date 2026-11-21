// @ts-nocheck -- vendored kit source, type-checked under the kit's own settings, not this app's stricter tsconfig (see packages/payload-builder/VENDORED.md)
import type { Payload } from 'payload'
import type { SectionSlot } from './collections'

/**
 * Layout resolution — mirrors Avada's model.
 *
 * 1. Every non-global layout whose conditions match the request is a
 *    candidate.
 * 2. Candidates sort by `priority` (desc), then by condition specificity
 *    (slug > prefix > locale > collection), so a rule about one page beats
 *    a rule about its whole collection.
 * 3. The winner's slots are filled in; any slot it leaves empty falls back
 *    to the global layout's slot.
 *
 * That fallback is the point: a "News" layout can override just the page
 * title bar and still inherit the global header and footer.
 */

export interface ResolveArgs {
  payload: Payload
  /** Collection of the document being rendered, e.g. 'pages'. */
  collection: string
  slug?: string
  /** Full request path, used by `prefix` conditions. e.g. '/news/item-1' */
  path?: string
  locale?: string
  layoutsSlug?: string
  draft?: boolean
}

export interface ResolvedLayout {
  header?: unknown
  pageTitle?: unknown
  content?: unknown
  footer?: unknown
  /** Which layout document won, for debugging. */
  matchedTitle?: string
}

interface Condition {
  type?: string
  collection?: string
  value?: string
}

interface LayoutDoc {
  id: string | number
  title?: string
  isGlobal?: boolean
  priority?: number
  conditions?: Condition[]
  header?: unknown
  pageTitle?: unknown
  content?: unknown
  footer?: unknown
}

const SPECIFICITY: Record<string, number> = {
  slug: 40,
  prefix: 30,
  locale: 20,
  collection: 10,
}

const matches = (condition: Condition, args: ResolveArgs): number => {
  switch (condition.type) {
    case 'collection':
      return condition.collection === args.collection ? SPECIFICITY.collection : 0
    case 'slug':
      return condition.value && condition.value === args.slug ? SPECIFICITY.slug : 0
    case 'prefix': {
      if (!condition.value || !args.path) return 0
      const prefix = condition.value.startsWith('/') ? condition.value : `/${condition.value}`
      return args.path.startsWith(prefix) ? SPECIFICITY.prefix : 0
    }
    case 'locale':
      return condition.value && condition.value === args.locale ? SPECIFICITY.locale : 0
    default:
      return 0
  }
}

/** Best specificity across a layout's conditions; 0 means no match. */
export const scoreLayout = (layout: LayoutDoc, args: ResolveArgs): number => {
  if (!layout.conditions?.length) return 0
  return layout.conditions.reduce((best, c) => Math.max(best, matches(c, args)), 0)
}

const SLOTS: SectionSlot[] = ['header', 'pageTitle', 'content', 'footer']

export const resolveBuilderLayout = async (args: ResolveArgs): Promise<ResolvedLayout> => {
  const { draft = false, layoutsSlug = 'builder-layouts', payload } = args

  const { docs } = await payload.find({
    // Slug is configurable, so it can't be narrowed to the generated union.
    collection: layoutsSlug as never,
    depth: 3,
    draft,
    limit: 100,
    locale: args.locale as never,
    pagination: false,
  })

  const layouts = docs as unknown as LayoutDoc[]
  const global = layouts.find((l) => l.isGlobal)

  const scored = layouts
    .filter((l) => !l.isGlobal)
    .map((l) => ({ layout: l, score: scoreLayout(l, args) }))
    .filter((entry) => entry.score > 0)
    .sort(
      (a, b) =>
        (b.layout.priority ?? 0) - (a.layout.priority ?? 0) || b.score - a.score,
    )

  const winner = scored[0]?.layout
  const resolved: ResolvedLayout = { matchedTitle: winner?.title ?? global?.title }

  for (const slot of SLOTS) {
    resolved[slot] = winner?.[slot] ?? global?.[slot]
  }

  return resolved
}

/** Pulls the `layout` array off a populated section relationship. */
export const sectionLayout = (section: unknown): unknown[] => {
  if (section && typeof section === 'object' && 'layout' in section) {
    const l = (section as { layout?: unknown }).layout
    if (Array.isArray(l)) return l
  }
  return []
}
