/**
 * Builders for Lexical `SerializedEditorState` values used by seeders.
 * Extracted from the ERDC seeders — the node shape mirrors exactly what
 * Payload/Lexical itself produces; every property Lexical writes has to be
 * present or the admin editor rejects the value.
 */

type LexNode = Record<string, unknown>
type EditorState = Record<string, unknown>

const textNode = (text: string): LexNode => ({
  type: 'text',
  detail: 0,
  format: 0,
  mode: 'normal',
  style: '',
  text,
  version: 1,
})

const paragraphNode = (text: string): LexNode => ({
  type: 'paragraph',
  children: text ? [textNode(text)] : [],
  direction: 'ltr',
  format: '',
  indent: 0,
  textFormat: 0,
  textStyle: '',
  version: 1,
})

const headingNode = (text: string, tag: 'h3' | 'h4' = 'h3'): LexNode => ({
  type: 'heading',
  children: [textNode(text)],
  direction: 'ltr',
  format: '',
  indent: 0,
  tag,
  version: 1,
})

const listItemNode = (text: string, value: number): LexNode => ({
  type: 'listitem',
  children: [textNode(text)],
  direction: 'ltr',
  format: '',
  indent: 0,
  value,
  version: 1,
})

const listNode = (items: string[]): LexNode => ({
  type: 'list',
  children: items.map((item, i) => listItemNode(item, i + 1)),
  direction: 'ltr',
  format: '',
  indent: 0,
  listType: 'bullet',
  start: 1,
  tag: 'ul',
  version: 1,
})

const BULLET = /^[•●▪\-*]\s+/

/**
 * Turns one seed string into block-level nodes. A plain string becomes one
 * paragraph; multi-line strings keep their structure — runs of lines
 * starting with "• " / "- " collapse into one bullet list, blank lines are
 * dropped, everything else is a paragraph.
 */
const blocksFromText = (text: string): LexNode[] => {
  if (!text.includes('\n')) return [paragraphNode(text)]

  const nodes: LexNode[] = []
  let bullets: string[] = []

  const flush = (): void => {
    if (!bullets.length) return
    nodes.push(listNode(bullets))
    bullets = []
  }

  for (const raw of text.split('\n')) {
    const line = raw.trim()
    if (!line) {
      flush()
      continue
    }
    if (BULLET.test(line)) {
      bullets.push(line.replace(BULLET, ''))
      continue
    }
    flush()
    nodes.push(paragraphNode(line))
  }
  flush()

  return nodes.length ? nodes : [paragraphNode('')]
}

const rootFrom = (children: LexNode[]): EditorState => ({
  root: {
    type: 'root',
    children: children.length ? children : [paragraphNode('')],
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  },
})

/** `rt('a', 'b')` → an editor state with one paragraph per argument. */
export const rt = (...paragraphs: string[]): EditorState =>
  rootFrom(paragraphs.flatMap(blocksFromText))

/** Sub-headed body copy — sections mixing a small heading with paragraphs/bullets. */
export const rtHeadingList = (
  items: { body: string; heading?: string }[],
  tag: 'h3' | 'h4' = 'h3',
): EditorState =>
  rootFrom(
    items.flatMap((item) => [
      ...(item.heading ? [headingNode(item.heading, tag)] : []),
      ...blocksFromText(item.body),
    ]),
  )

/**
 * Merges a secondary-locale seed over the saved default-locale document.
 *
 * The subtle part is Payload's row-id semantics: blocks and non-localized
 * arrays share ONE row across locales, so their ids MUST be reused; localized
 * arrays have per-locale rows, so default-locale ids are invalid there.
 * Getting this wrong silently orphans rows — this encapsulates the rules
 * proven on ERDC's 29 bilingual pages.
 *
 * @param defaultSaved  the document as saved in the default locale
 * @param translation   the translated values to lay over it
 * @param localeSaved   the document as currently saved in the target locale
 */
export const mergeLocaleStrings = (
  defaultSaved: unknown,
  translation: unknown,
  localeSaved: unknown,
): unknown => {
  if (Array.isArray(translation)) {
    const enArr = Array.isArray(defaultSaved) ? defaultSaved : []
    const arArr = Array.isArray(localeSaved) ? localeSaved : []
    return translation.map((item, i) => mergeLocaleStrings(enArr[i], item, arArr[i]))
  }

  // Lexical states are opaque values — the translated state replaces the
  // default one wholesale (and must not collect Payload row ids).
  if (translation !== null && typeof translation === 'object' && 'root' in translation) {
    return translation
  }

  if (translation !== null && typeof translation === 'object') {
    const enObj = (defaultSaved ?? {}) as Record<string, unknown>
    const arObj = (localeSaved ?? {}) as Record<string, unknown>
    const src = translation as Record<string, unknown>
    const out: Record<string, unknown> = { ...enObj }

    // Prefer an id that already exists in the target locale; fall back to
    // the default-locale id only when this is a shared (non-localized) row.
    const arId = arObj.id
    const enId = enObj.id
    if (typeof arId === 'string' || typeof arId === 'number') out.id = arId
    else if (Array.isArray(localeSaved) || localeSaved !== undefined) out.id = enId
    else delete out.id

    for (const [key, value] of Object.entries(src)) {
      if (key === 'id' || key === 'blockType') continue
      if (typeof value === 'string') out[key] = value
      else if (value !== null && typeof value === 'object') {
        out[key] = mergeLocaleStrings(enObj[key], value, arObj[key])
      } else if (value !== undefined) {
        out[key] = value
      }
    }
    return out
  }

  return translation !== undefined && translation !== null ? translation : defaultSaved
}
