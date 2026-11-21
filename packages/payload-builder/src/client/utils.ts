'use client'

/** Node kinds addressable on the canvas. */
export type NodeKind = 'section' | 'row' | 'column' | 'element' | 'block'

export interface Selection {
  kind: NodeKind
  /** Form-state data path, e.g. `layout.0.rows.1.columns.0.elements.2` */
  path: string
  /** Path of the list containing this node (for move/remove). */
  listPath: string
  index: number
  blockSlug?: string
}

/* ------------------------------------------------------------------ */
/* Generic excerpt: first human-looking string in the node's data.     */
/* ------------------------------------------------------------------ */

const SKIP_KEYS = new Set(['id', 'blockType', 'blockName', 'width', 'cssClass', 'cssId', 'level', 'variant', 'ratio', 'type', 'preset', 'widthMode',
  // style options (General / Design / Background / Extras tabs) — their defaults such as
  // "inherit" are not content (chenzquiz change, see VENDORED.md)
  'align', 'maxWidth', 'space', 'spaceMd', 'spaceSm', 'color', 'fontSize', 'lineHeight', 'fontWeight', 'transform', 'letterSpacing',
  'bw', 'bc', 'br', 'bs', 'bg', 'anim', 'hide', 'attrs', 'valign', 'justify', 'gap', 'height', 'tag', 'minHeight', 'linkUrl'])

const findText = (value: unknown, depth: number): string | undefined => {
  if (depth > 4 || value == null) return undefined
  if (typeof value === 'string') {
    const v = value.trim()
    return v.length > 1 ? v : undefined
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      const t = findText(item, depth + 1)
      if (t) return t
    }
    return undefined
  }
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>
    // Lexical state: dive into root
    if ('root' in obj) return findText(obj.root, depth + 1)
    for (const [k, v] of Object.entries(obj)) {
      if (SKIP_KEYS.has(k)) continue
      const t = findText(v, depth + 1)
      if (t) return t
    }
  }
  return undefined
}

export const excerptOf = (data: Record<string, unknown> | undefined): string =>
  (data ? findText(data, 0) ?? '' : '').slice(0, 90)

/** Section header hues from the approved design, cycled by index. */
export const SECTION_HUES = ['#4f716f', '#82565c', '#7f6c48', '#5a6296']
