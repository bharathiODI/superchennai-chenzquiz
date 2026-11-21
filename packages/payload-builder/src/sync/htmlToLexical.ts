// @ts-nocheck -- vendored kit source, type-checked under the kit's own settings, not this app's stricter tsconfig (see packages/payload-builder/VENDORED.md)
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

/**
 * Converts the rich text the static export carries (`{ html, text }`) back
 * into a Lexical editor state.
 *
 * Deliberately narrow: a survey of every rich text field across all 23
 * exported pages found exactly four tags — `<p>`, `<ul>`, `<li>` and
 * `<strong>`. Rather than pull in an HTML parser and pretend to handle
 * arbitrary markup, this handles those four exactly and throws on anything
 * unexpected, so a surprise shows up as a loud failure during import rather
 * than as silently mangled copy on the site.
 */

type Node = Record<string, unknown>

const TEXT_FORMAT_BOLD = 1

const decode = (s: string): string =>
  s
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')

const textNode = (text: string, bold = false): Node => ({
  type: 'text',
  detail: 0,
  format: bold ? TEXT_FORMAT_BOLD : 0,
  mode: 'normal',
  style: '',
  text,
  version: 1,
})

/** Splits inline content into text nodes, honouring <strong>. */
const inlineNodes = (html: string): Node[] => {
  const out: Node[] = []
  const re = /<strong>([\s\S]*?)<\/strong>/gi
  let last = 0
  let m: RegExpExecArray | null

  while ((m = re.exec(html))) {
    if (m.index > last) {
      const plain = decode(html.slice(last, m.index).replace(/<[^>]+>/g, ''))
      if (plain) out.push(textNode(plain))
    }
    const bold = decode(m[1].replace(/<[^>]+>/g, ''))
    if (bold) out.push(textNode(bold, true))
    last = re.lastIndex
  }

  if (last < html.length) {
    const plain = decode(html.slice(last).replace(/<[^>]+>/g, ''))
    if (plain) out.push(textNode(plain))
  }

  return out.length ? out : [textNode('')]
}

const paragraph = (html: string): Node => ({
  type: 'paragraph',
  children: inlineNodes(html),
  direction: 'ltr',
  format: '',
  indent: 0,
  textFormat: 0,
  version: 1,
})

const listItem = (html: string, index: number): Node => ({
  type: 'listitem',
  checked: undefined,
  children: inlineNodes(html),
  direction: 'ltr',
  format: '',
  indent: 0,
  value: index + 1,
  version: 1,
})

const list = (itemsHtml: string[]): Node => ({
  type: 'list',
  children: itemsHtml.map((h, i) => listItem(h, i)),
  direction: 'ltr',
  format: '',
  indent: 0,
  listType: 'bullet',
  start: 1,
  tag: 'ul',
  version: 1,
})

export const htmlToLexical = (html: string): SerializedEditorState => {
  const children: Node[] = []
  // Walk top-level <p> and <ul> blocks in document order.
  const re = /<(p|ul)>([\s\S]*?)<\/\1>/gi
  let m: RegExpExecArray | null
  let consumed = 0

  while ((m = re.exec(html))) {
    consumed += m[0].length
    if (m[1].toLowerCase() === 'p') {
      children.push(paragraph(m[2]))
    } else {
      const items = [...m[2].matchAll(/<li>([\s\S]*?)<\/li>/gi)].map((li) => li[1])
      if (items.length) children.push(list(items))
    }
  }

  // Nothing matched: treat the whole value as one paragraph of plain text.
  if (!children.length) {
    const plain = decode(html.replace(/<[^>]+>/g, '')).trim()
    children.push(paragraph(plain))
  } else {
    // Guard against markup this converter does not understand. Anything
    // outside the recognised blocks would be dropped silently otherwise.
    const leftover = html.replace(re, '').replace(/\s+/g, '')
    if (leftover.includes('<')) {
      throw new Error(
        `htmlToLexical: unsupported markup outside <p>/<ul>: ${leftover.slice(0, 120)}`,
      )
    }
  }

  return {
    root: {
      type: 'root',
      children,
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  } as unknown as SerializedEditorState
}

/** True when a value looks like the static export's rich text shape. */
export const isStaticRichText = (value: unknown): value is { html: string; text: string } =>
  Boolean(
    value &&
      typeof value === 'object' &&
      typeof (value as { html?: unknown }).html === 'string' &&
      typeof (value as { text?: unknown }).text === 'string',
  )
