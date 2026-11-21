/**
 * Security filter for user-supplied attributes, classes and ids.
 * Same policy proven on ERDC: never allow event handlers or attributes
 * that could inject script/style, regardless of who typed them into the CMS.
 */

const BLOCKED_ATTRS = new Set([
  'style',
  'class',
  'id',
  'dangerouslysetinnerhtml',
  'srcdoc',
  'href',
  'src',
  'formaction',
  'action',
])

const ATTR_NAME_RE = /^[a-zA-Z_][a-zA-Z0-9_:-]*$/

export const sanitizeAttrs = (
  attrs: { key?: string | null; value?: string | null }[] | null | undefined,
): Record<string, string> => {
  const out: Record<string, string> = {}
  if (!attrs) return out
  for (const { key, value } of attrs) {
    if (!key || typeof value !== 'string') continue
    const k = key.trim()
    const lower = k.toLowerCase()
    if (!ATTR_NAME_RE.test(k)) continue
    if (lower.startsWith('on')) continue
    if (BLOCKED_ATTRS.has(lower)) continue
    out[k] = value
  }
  return out
}

const CSS_IDENT_RE = /^-?[A-Za-z_][A-Za-z0-9_-]*$/

/** Allow only space-separated CSS identifiers; drop anything else. */
export const sanitizeCssClass = (value: string | null | undefined): string | undefined => {
  if (!value) return undefined
  const classes = value.split(/\s+/).filter((c) => c && CSS_IDENT_RE.test(c))
  return classes.length ? classes.join(' ') : undefined
}

export const sanitizeCssId = (value: string | null | undefined): string | undefined => {
  if (!value) return undefined
  const v = value.trim()
  return CSS_IDENT_RE.test(v) ? v : undefined
}

/** Values interpolated into inline style — permit only safe CSS value characters. */
export const sanitizeCssValue = (value: string | null | undefined): string | undefined => {
  if (value == null) return undefined
  const v = String(value).trim()
  if (!v) return undefined
  if (/[;{}<>]|url\s*\(|expression|javascript:/i.test(v)) return undefined
  return v
}
