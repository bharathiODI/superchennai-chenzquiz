// @ts-nocheck -- vendored kit source, type-checked under the kit's own settings, not this app's stricter tsconfig (see packages/payload-builder/VENDORED.md)
'use client'

/**
 * Cross-page section clipboard.
 *
 * The canvas' in-memory clipboard dies with the page. Copying a whole section
 * to another page needs two things it cannot give: persistence across
 * navigation, and every language at once (the admin form only ever holds the
 * locale being edited).
 *
 * So this works from saved data, over the REST API:
 *   copy  — read the section from the source document in every locale and
 *           keep it in localStorage (per browser, per site);
 *   paste — insert it into the target document, one locale at a time, as a
 *           DRAFT, then reload the editor. Nothing is published: the editor
 *           reviews the page and publishes as usual.
 *
 * Row ids are regenerated on paste (one new id per original id, shared by all
 * locales) so the pasted copy is independent of the source and the locales
 * line up on the same rows. Media, forms and other relationships keep their
 * ids, which is why a clipboard only pastes on the site it was copied from.
 */

const STORAGE_KEY = 'payload-builder:section-clipboard'
const EVENT = 'payload-builder:section-clipboard-change'

export interface SectionClip {
  v: 1
  origin: string
  collection: string
  sourceId: string | number
  sourceTitle?: string
  blockType?: string
  label: string
  /** The section as stored, keyed by locale code ('' when unlocalised). */
  locales: Record<string, Record<string, unknown>>
  copiedAt: string
}

export interface ApiContext {
  /** e.g. '' + '/api' */
  apiBase: string
  collection: string
  /** Locale codes, default locale first. Empty when localization is off. */
  locales: string[]
}

/* ------------------------------------------------------------------ store */

export const readSectionClip = (): SectionClip | null => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const clip = JSON.parse(raw) as SectionClip
    if (clip?.v !== 1 || clip.origin !== window.location.origin) return null
    return clip
  } catch {
    return null
  }
}

const writeSectionClip = (clip: SectionClip | null) => {
  try {
    if (clip) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(clip))
    else window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* storage unavailable (private mode, quota) — copy simply does nothing */
  }
  window.dispatchEvent(new Event(EVENT))
}

export const clearSectionClip = () => writeSectionClip(null)

/** Fires on copy/clear in this tab and in any other tab of the same site. */
export const subscribeSectionClip = (onChange: () => void): (() => void) => {
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) onChange()
  }
  window.addEventListener(EVENT, onChange)
  window.addEventListener('storage', onStorage)
  return () => {
    window.removeEventListener(EVENT, onChange)
    window.removeEventListener('storage', onStorage)
  }
}

/* ---------------------------------------------------------------- helpers */

const getByPath = (obj: unknown, path: string): unknown =>
  path.split('.').reduce<unknown>(
    (acc, key) => (acc && typeof acc === 'object' ? (acc as Record<string, unknown>)[key] : undefined),
    obj,
  )

const setByPath = (path: string, value: unknown): Record<string, unknown> => {
  const keys = path.split('.')
  const root: Record<string, unknown> = {}
  let cur = root
  keys.forEach((key, i) => {
    if (i === keys.length - 1) cur[key] = value
    else {
      cur[key] = {}
      cur = cur[key] as Record<string, unknown>
    }
  })
  return root
}

const localeQuery = (locale: string) =>
  locale ? `locale=${encodeURIComponent(locale)}&fallback-locale=none&` : ''

async function fetchDoc(ctx: ApiContext, id: string | number, locale: string) {
  const res = await fetch(
    `${ctx.apiBase}/${ctx.collection}/${encodeURIComponent(String(id))}?${localeQuery(locale)}depth=0&draft=true`,
    { credentials: 'include', cache: 'no-store' },
  )
  if (!res.ok) throw new Error(`Could not read the page (HTTP ${res.status}).`)
  return (await res.json()) as Record<string, unknown>
}

async function patchDraft(
  ctx: ApiContext,
  id: string | number,
  locale: string,
  body: Record<string, unknown>,
) {
  const res = await fetch(
    `${ctx.apiBase}/${ctx.collection}/${encodeURIComponent(String(id))}?${localeQuery(locale)}depth=0&draft=true`,
    {
      body: JSON.stringify(body),
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      method: 'PATCH',
    },
  )
  if (!res.ok) {
    let detail = ''
    try {
      const j = (await res.json()) as { errors?: { message?: string }[] }
      detail = j.errors?.map((e) => e.message).filter(Boolean).join('; ') ?? ''
    } catch {
      /* ignore */
    }
    throw new Error(`Saving the ${locale || 'page'} version failed (HTTP ${res.status})${detail ? `: ${detail}` : ''}.`)
  }
}

/** 24-hex, same shape as the ids Payload generates for rows. */
const newRowId = (): string => {
  const bytes = new Uint8Array(12)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

/** Deep copy with every row id swapped through `idMap` (shared across locales). */
const remapIds = (value: unknown, idMap: Map<string, string>): unknown => {
  if (Array.isArray(value)) return value.map((v) => remapIds(v, idMap))
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [key, v] of Object.entries(value as Record<string, unknown>)) {
      if (key === 'id' && typeof v === 'string') {
        if (!idMap.has(v)) idMap.set(v, newRowId())
        out.id = idMap.get(v)
      } else {
        out[key] = remapIds(v, idMap)
      }
    }
    return out
  }
  return value
}

/* ------------------------------------------------------------------- copy */

export async function copySection(
  ctx: ApiContext,
  args: { docId: string | number; fieldPath: string; blockId: string; label: string },
): Promise<SectionClip> {
  const codes = ctx.locales.length ? ctx.locales : ['']
  const locales: SectionClip['locales'] = {}
  let sourceTitle: string | undefined
  let blockType: string | undefined

  for (const code of codes) {
    const doc = await fetchDoc(ctx, args.docId, code)
    if (!sourceTitle) sourceTitle = (doc.title as string) || (doc.slug as string) || undefined
    const list = getByPath(doc, args.fieldPath)
    const block = Array.isArray(list)
      ? (list as Record<string, unknown>[]).find((b) => b?.id === args.blockId)
      : undefined
    if (!block) {
      throw new Error(
        'This section is not in the saved page yet. Save the page first, then copy it.',
      )
    }
    blockType = (block.blockType as string) ?? blockType
    locales[code] = block
  }

  const clip: SectionClip = {
    v: 1,
    blockType,
    collection: ctx.collection,
    copiedAt: new Date().toISOString(),
    label: args.label,
    locales,
    origin: window.location.origin,
    sourceId: args.docId,
    sourceTitle,
  }
  writeSectionClip(clip)
  return clip
}

/* ------------------------------------------------------------------ paste */

export async function pasteSection(
  ctx: ApiContext,
  args: { docId: string | number; fieldPath: string; index: number; clip: SectionClip },
): Promise<void> {
  const codes = ctx.locales.length ? ctx.locales : ['']
  const idMap = new Map<string, string>()

  // Default locale first: it lays down the structure every other locale
  // then fills in. Fall back to whatever locale the clipboard does have.
  const firstSource = args.clip.locales[codes[0]] ?? Object.values(args.clip.locales)[0]
  if (!firstSource) throw new Error('The clipboard is empty.')

  let newBlockId: string | undefined

  for (const [i, code] of codes.entries()) {
    const source = i === 0 ? firstSource : args.clip.locales[code]
    if (!source) continue // clipboard taken without this locale — leave it empty

    const block = remapIds(source, idMap) as Record<string, unknown>
    if (i === 0) newBlockId = block.id as string

    const doc = await fetchDoc(ctx, args.docId, code)
    const current = getByPath(doc, args.fieldPath)
    const list = Array.isArray(current) ? [...(current as Record<string, unknown>[])] : []

    const existing = newBlockId ? list.findIndex((b) => b?.id === newBlockId) : -1
    if (existing >= 0) list[existing] = block
    else list.splice(Math.max(0, Math.min(args.index, list.length)), 0, block)

    await patchDraft(ctx, args.docId, code, setByPath(args.fieldPath, list))
  }
}
