import type { Payload } from 'payload'

import { htmlToLexical, isStaticRichText } from './htmlToLexical'

/**
 * Imports a static-site content export back into the CMS.
 *
 * The companion of a static-export workflow: a script pulls localized page
 * copy out of Payload into JSON, the static site renders from it, editors
 * correct copy on either side, and this walks the export back in.
 *
 * Guarantees, proven on ERDC (308 changes, EN+AR, converged to zero on
 * re-run):
 * - Only fields the export contains are touched — media and uploads survive.
 * - Payload row `id`s are preserved, so blocks update rather than replace.
 * - `{ html, text }` rich text is rebuilt as Lexical, compared against what
 *   would actually be written (idempotent).
 * - Strings that look like asset paths are never written into upload fields.
 * - A block-type mismatch throws rather than guessing.
 * - Numbers/booleans stringified by the export are coerced back.
 *
 * Always run with `dryRun` first.
 */

type Json = Record<string, unknown>

const snakeToCamel = (key: string): string =>
  key.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase())

const isPlainObject = (v: unknown): v is Json =>
  Boolean(v) && typeof v === 'object' && !Array.isArray(v)

export interface ImportReport {
  page: string
  locale: string
  changes: string[]
  error?: string
}

export interface ImportContentOptions {
  /** Static export, keyed by CMS document slug: { slug: { en: {...}, ar: {...} } } */
  content: Record<string, Record<string, Json | undefined>>
  collection?: string
  locales?: string[]
  /** Report without writing. */
  dryRun?: boolean
  /** Limit to these slugs. */
  only?: string[]
  /**
   * Keys the export carries but the schema does not. Payload silently drops
   * unknown keys on update, so they would re-report as changes forever.
   * Global names, or scoped per blockType: { erdcTimeline: ['ctaLabel'] }
   */
  skipKeys?: string[]
  skipKeysByBlockType?: Record<string, string[]>
  /** Regex for asset-path strings that must never reach upload fields. */
  assetPathPattern?: RegExp
}

const truncate = (s: string | undefined, n = 60): string => {
  if (s === undefined) return '(unset)'
  const t = s.replace(/\s+/g, ' ')
  return t.length > n ? `${t.slice(0, n)}…` : t
}

/** Flattens a Lexical state to comparable plain text. */
const plainText = (value: unknown): string => {
  const walk = (node: unknown): string => {
    if (!node || typeof node !== 'object') return ''
    const n = node as { children?: unknown[]; text?: unknown }
    if (typeof n.text === 'string') return n.text
    if (Array.isArray(n.children)) return n.children.map(walk).join(' ')
    return ''
  }
  return walk((value as { root?: unknown })?.root)
    .replace(/\s+/g, ' ')
    .trim()
}

const coerceToSavedType = (saved: unknown, incoming: unknown): unknown => {
  if (typeof saved === 'number' && typeof incoming === 'string') {
    const n = Number(incoming)
    if (!Number.isNaN(n)) return n === saved ? saved : n
  }
  if (typeof saved === 'boolean' && typeof incoming === 'string') {
    if (incoming === 'true' || incoming === 'false') {
      const b = incoming === 'true'
      return b === saved ? saved : b
    }
  }
  return incoming
}

const makeMerge = (options: Required<Pick<ImportContentOptions, 'assetPathPattern' | 'skipKeys' | 'skipKeysByBlockType'>>) => {
  const merge = (saved: unknown, incoming: unknown, path: string, changes: string[]): unknown => {
    if (isStaticRichText(incoming)) {
      const next = htmlToLexical(incoming.html)
      if (plainText(saved) !== plainText(next)) {
        changes.push(`${path}: rich text updated`)
        return next
      }
      return saved
    }

    if (Array.isArray(incoming)) {
      const savedArr = Array.isArray(saved) ? saved : []
      const out = incoming.map((item, i) => merge(savedArr[i], item, `${path}[${i}]`, changes))
      if (savedArr.length > incoming.length) {
        changes.push(`${path}: ${savedArr.length - incoming.length} item(s) removed`)
      } else if (incoming.length > savedArr.length) {
        changes.push(`${path}: ${incoming.length - savedArr.length} item(s) added`)
      }
      return out
    }

    if (isPlainObject(incoming)) {
      const savedObj = isPlainObject(saved) ? saved : {}
      // Start from what Payload already has, so media and ids carry through.
      const out: Json = { ...savedObj }
      const blockType = snakeToCamel(String(savedObj.blockType ?? incoming.blockType ?? ''))

      for (const [rawKey, value] of Object.entries(incoming)) {
        if (rawKey === 'id') continue
        const key = snakeToCamel(rawKey)

        if (options.skipKeys.includes(key)) continue
        if (options.skipKeysByBlockType[blockType]?.includes(key)) continue

        if (key === 'blockType') {
          const incomingType = snakeToCamel(String(value))
          if (savedObj.blockType && savedObj.blockType !== incomingType) {
            throw new Error(
              `${path}: block type mismatch — CMS has "${String(savedObj.blockType)}", ` +
                `export has "${incomingType}". The layouts diverged structurally; resolve by hand.`,
            )
          }
          out.blockType = savedObj.blockType ?? incomingType
          continue
        }

        out[key] = merge(savedObj[key], value, `${path}.${key}`, changes)
      }
      return out
    }

    if (incoming === undefined) return saved

    // Media stays managed in the CMS — never write an asset path string
    // into what may be an upload relation.
    if (typeof incoming === 'string' && options.assetPathPattern.test(incoming)) {
      return saved
    }

    const coerced = coerceToSavedType(saved, incoming)
    if (coerced === saved) return saved

    const before = typeof saved === 'string' ? saved : JSON.stringify(saved)
    const after = typeof coerced === 'string' ? coerced : JSON.stringify(coerced)
    changes.push(`${path}: ${truncate(before)} → ${truncate(after)}`)
    return coerced
  }
  return merge
}

export const importContent = async (
  payload: Payload,
  {
    assetPathPattern = /^\/(images|videos|media|files)\//,
    collection = 'pages',
    content,
    dryRun = false,
    locales = ['en'],
    only,
    skipKeys = [],
    skipKeysByBlockType = {},
  }: ImportContentOptions,
): Promise<ImportReport[]> => {
  const merge = makeMerge({ assetPathPattern, skipKeys, skipKeysByBlockType })
  const reports: ImportReport[] = []

  for (const [slug, doc] of Object.entries(content)) {
    if (only?.length && !only.includes(slug)) continue

    for (const locale of locales) {
      const incoming = doc[locale]
      if (!incoming?.layout) continue

      const changes: string[] = []
      try {
        // Runtime collection slugs can't narrow to the app's generated
        // union types — use a loose local view of the two methods we call.
        const p = payload as unknown as {
          find: (args: Record<string, unknown>) => Promise<{ docs: Json[] }>
          update: (args: Record<string, unknown>) => Promise<unknown>
        }

        const found = await p.find({
          collection,
          depth: 0,
          // Without this an untranslated field falls back to the default
          // locale and looks like a difference on every string.
          fallbackLocale: false,
          limit: 1,
          locale,
          where: { slug: { equals: slug } },
        })

        const existing = found.docs[0] as (Json & { id: number | string }) | undefined
        if (!existing) {
          reports.push({ changes: [], error: 'page not found in CMS', locale, page: slug })
          continue
        }

        // Updates merge into the LATEST version — if that is a pending draft,
        // the update would republish its stale values (this is how a staging
        // environment reverted SQL style backfills, 2026-09-07). Re-assert
        // the published status so the merged content is what goes live.
        const wasPublished = (existing as { _status?: unknown })._status === 'published'

        const layout = merge(existing.layout, incoming.layout, 'layout', changes)

        const data: Record<string, unknown> = { layout }
        // The export carries the localized page title; apply it too — titles
        // drifting while body copy syncs was a real gap (AR titles stayed
        // English on a fresh environment).
        const incomingTitle = (incoming as { title?: unknown }).title
        if (
          typeof incomingTitle === 'string' &&
          incomingTitle.trim() &&
          incomingTitle !== existing.title
        ) {
          data.title = incomingTitle
          changes.push(`title: ${truncate(String(existing.title ?? ''))} → ${truncate(incomingTitle)}`)
        }

        if (changes.length && !dryRun) {
          await p.update({
            collection,
            data: { ...data, ...(wasPublished ? { _status: 'published' } : {}) },
            depth: 0,
            id: existing.id,
            locale,
          })
        }

        reports.push({ changes, locale, page: slug })
      } catch (err) {
        reports.push({
          changes,
          error: err instanceof Error ? err.message : String(err),
          locale,
          page: slug,
        })
      }
    }
  }

  return reports
}
