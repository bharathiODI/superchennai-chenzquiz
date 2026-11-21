import type { FormFieldSpec } from '../types'

/**
 * Mail-tag rendering: `[field-name]`, `[all-fields]`, `[form-title]`,
 * `[page-url]`, `[date]`. Every submitted value is HTML-escaped before it
 * reaches an email body — this is the injection surface. A value only
 * becomes a link when it already looks like an http(s) URL.
 */

export const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

const isUrl = (value: string): boolean => /^https?:\/\/\S+$/i.test(value)

const htmlValue = (value: string): string => {
  const safe = escapeHtml(value)
  return isUrl(value) ? `<a href="${safe}">${safe}</a>` : safe.replaceAll('\n', '<br/>')
}

export interface MailTagContext {
  fields: FormFieldSpec[]
  values: Record<string, unknown>
  formTitle: string
  pageUrl?: string
  /**
   * How uploaded files appear, per field name (the raw value is an internal
   * file URL, meaningless to the reader). `html` is trusted markup built by
   * the submit endpoint from escaped parts.
   */
  fileDisplay?: Record<string, { html: string; text: string }>
}

const displayValue = (raw: unknown): string => {
  if (raw == null) return ''
  if (Array.isArray(raw)) return raw.map(String).join(', ')
  if (typeof raw === 'boolean') return raw ? 'Yes' : 'No'
  return String(raw)
}

const fieldHtml = (ctx: MailTagContext, name: string): string =>
  ctx.fileDisplay?.[name]?.html ?? htmlValue(displayValue(ctx.values[name]))

const fieldText = (ctx: MailTagContext, name: string): string =>
  ctx.fileDisplay?.[name]?.text ?? displayValue(ctx.values[name])

const allFieldsHtml = (ctx: MailTagContext): string => {
  const rows = ctx.fields
    .filter((f) => f.type !== 'hidden' || ctx.values[f.name])
    .map((f) => {
      const label = escapeHtml(f.label || f.name)
      return `<tr><td style="padding:6px 12px 6px 0;vertical-align:top;"><strong>${label}</strong></td><td style="padding:6px 0;">${fieldHtml(ctx, f.name)}</td></tr>`
    })
    .join('')
  return `<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${rows}</table>`
}

const allFieldsText = (ctx: MailTagContext): string =>
  ctx.fields.map((f) => `${f.label || f.name}: ${fieldText(ctx, f.name)}`).join('\n')

/** Replaces every mail-tag in a subject or body template. */
export const renderMailTags = (template: string, ctx: MailTagContext, html: boolean): string =>
  template.replace(/\[([a-zA-Z0-9_-]+)\]/g, (match, tag: string) => {
    if (tag === 'all-fields') return html ? allFieldsHtml(ctx) : allFieldsText(ctx)
    if (tag === 'form-title') return html ? escapeHtml(ctx.formTitle) : ctx.formTitle
    if (tag === 'page-url') return html ? escapeHtml(ctx.pageUrl ?? '') : (ctx.pageUrl ?? '')
    if (tag === 'date') return new Date().toISOString().slice(0, 16).replace('T', ' ')
    const field = ctx.fields.find((f) => f.name === tag)
    if (!field) return match // unknown tag stays literal, like CF7
    return html ? fieldHtml(ctx, tag) : fieldText(ctx, tag)
  })
