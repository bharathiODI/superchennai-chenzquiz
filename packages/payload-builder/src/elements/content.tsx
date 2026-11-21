import React from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import type { ElementComponentProps, ElementDefinition } from '../types'

/* ---------------- Rich Text ---------------- */

const lexicalExcerpt = (state: unknown): string => {
  const walk = (node: unknown): string => {
    if (!node || typeof node !== 'object') return ''
    const n = node as { text?: unknown; children?: unknown[] }
    if (typeof n.text === 'string') return n.text
    if (Array.isArray(n.children)) return n.children.map(walk).join(' ')
    return ''
  }
  return walk((state as { root?: unknown })?.root).trim().slice(0, 120)
}

const RichTextEl: React.FC<ElementComponentProps<{ content?: SerializedEditorState | null }>> = ({
  data,
}) => (data.content ? <div className="pb-richtext"><RichText data={data.content} /></div> : null)

export const richTextElement: ElementDefinition = {
  slug: 'richText',
  Component: RichTextEl,
  category: 'content',
  excerpt: (d) => lexicalExcerpt(d.content),
  fields: [{ name: 'content', localized: true, type: 'richText' }],
  icon: 'text',
  label: 'Rich Text',
}

/* ---------------- Card Row ---------------- */

interface Card {
  id?: string
  title?: string
  text?: string
  url?: string
  icon?: unknown
}

const CardRow: React.FC<ElementComponentProps<{ cards?: Card[]; columns?: string; style?: string }>> = ({
  data,
}) => {
  if (!data.cards?.length) return null
  return (
    <div
      className={`pb-cardrow pb-cardrow--${data.style ?? 'bordered'}`}
      style={{ '--pb-cards': data.columns ?? '3' } as React.CSSProperties}
    >
      {data.cards.map((card, i) => {
        const inner = (
          <>
            {card.title ? <h3 className="pb-card-title">{card.title}</h3> : null}
            {card.text ? <p className="pb-card-text">{card.text}</p> : null}
          </>
        )
        return card.url ? (
          <a className="pb-card pb-card--link" href={card.url} key={card.id ?? i}>
            {inner}
          </a>
        ) : (
          <div className="pb-card" key={card.id ?? i}>
            {inner}
          </div>
        )
      })}
    </div>
  )
}

export const cardRowElement: ElementDefinition = {
  slug: 'cardRow',
  Component: CardRow,
  category: 'content',
  excerpt: (d) =>
    (Array.isArray(d.cards) ? (d.cards as Card[]) : [])
      .map((c) => c.title)
      .filter(Boolean)
      .join(' · ')
      .slice(0, 110),
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'columns',
          defaultValue: '3',
          options: ['2', '3', '4'].map((v) => ({ label: `${v} columns`, value: v })),
          type: 'select',
        },
        {
          name: 'style',
          defaultValue: 'bordered',
          options: [
            { label: 'Bordered', value: 'bordered' },
            { label: 'Filled', value: 'filled' },
            { label: 'Plain', value: 'plain' },
          ],
          type: 'select',
        },
      ],
    },
    {
      name: 'cards',
      fields: [
        { name: 'title', localized: true, type: 'text' },
        { name: 'text', localized: true, type: 'textarea' },
        { name: 'url', type: 'text' },
      ],
      labels: { plural: 'Cards', singular: 'Card' },
      type: 'array',
    },
  ],
  icon: 'cards',
  label: 'Card Row',
}

/* ---------------- Icon Box / Content Box ---------------- */

const IconBox: React.FC<
  ElementComponentProps<{ title?: string; text?: string; svg?: string; layout?: string; url?: string }>
> = ({ data }) => {
  const svg = typeof data.svg === 'string' && /^\s*<svg[\s>]/i.test(data.svg) ? data.svg : ''
  const body = (
    <>
      {svg ? (
        <span aria-hidden="true" className="pb-iconbox__icon" dangerouslySetInnerHTML={{ __html: svg }} />
      ) : null}
      <span className="pb-iconbox__body">
        {data.title ? <h3 className="pb-iconbox__title">{data.title}</h3> : null}
        {data.text ? <p className="pb-iconbox__text">{data.text}</p> : null}
      </span>
    </>
  )
  const cls = `pb-iconbox pb-iconbox--${data.layout ?? 'top'}`
  return data.url ? (
    <a className={`${cls} pb-iconbox--link`} href={data.url}>{body}</a>
  ) : (
    <div className={cls}>{body}</div>
  )
}

export const iconBoxElement: ElementDefinition = {
  slug: 'iconBox',
  Component: IconBox,
  category: 'content',
  excerpt: (d) => String(d.title ?? ''),
  fields: [
    { name: 'title', localized: true, type: 'text' },
    { name: 'text', localized: true, type: 'textarea' },
    { name: 'svg', label: 'SVG markup', type: 'textarea' },
    {
      type: 'row',
      fields: [
        {
          name: 'layout',
          defaultValue: 'top',
          options: [
            { label: 'Icon on top', value: 'top' },
            { label: 'Icon on the side', value: 'side' },
          ],
          type: 'select',
        },
        { name: 'url', label: 'Link', type: 'text' },
      ],
    },
  ],
  icon: 'iconbox',
  label: 'Icon Box',
}

/* ---------------- Accordion ---------------- */

interface AccordionItem {
  id?: string
  title?: string
  body?: SerializedEditorState | null
}

const Accordion: React.FC<ElementComponentProps<{ items?: AccordionItem[]; openFirst?: boolean }>> = ({
  data,
}) => {
  if (!data.items?.length) return null
  return (
    <div className="pb-accordion">
      {data.items.map((item, i) => (
        <details className="pb-accordion__item" key={item.id ?? i} open={data.openFirst && i === 0}>
          <summary className="pb-accordion__summary">{item.title}</summary>
          <div className="pb-accordion__body">
            {item.body ? <RichText data={item.body} /> : null}
          </div>
        </details>
      ))}
    </div>
  )
}

export const accordionElement: ElementDefinition = {
  slug: 'accordion',
  Component: Accordion,
  category: 'content',
  excerpt: (d) =>
    (Array.isArray(d.items) ? (d.items as AccordionItem[]) : [])
      .map((i) => i.title)
      .filter(Boolean)
      .join(' · ')
      .slice(0, 110),
  fields: [
    { name: 'openFirst', defaultValue: true, label: 'Open the first item', type: 'checkbox' },
    {
      name: 'items',
      fields: [
        { name: 'title', localized: true, required: true, type: 'text' },
        { name: 'body', localized: true, type: 'richText' },
      ],
      labels: { plural: 'Items', singular: 'Item' },
      type: 'array',
    },
  ],
  icon: 'accordion',
  label: 'Accordion / FAQ',
}

/* ---------------- Checklist ---------------- */

const Checklist: React.FC<
  ElementComponentProps<{ items?: { id?: string; text?: string }[]; marker?: string; columns?: string }>
> = ({ data }) => {
  if (!data.items?.length) return null
  return (
    <ul
      className={`pb-checklist pb-checklist--${data.marker ?? 'check'}`}
      style={{ '--pb-list-cols': data.columns ?? '1' } as React.CSSProperties}
    >
      {data.items.map((item, i) => (
        <li key={item.id ?? i}>{item.text}</li>
      ))}
    </ul>
  )
}

export const checklistElement: ElementDefinition = {
  slug: 'checklist',
  Component: Checklist,
  category: 'content',
  excerpt: (d) =>
    (Array.isArray(d.items) ? (d.items as { text?: string }[]) : [])
      .map((i) => i.text)
      .filter(Boolean)
      .join(' · ')
      .slice(0, 110),
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'marker',
          defaultValue: 'check',
          options: [
            { label: 'Check', value: 'check' },
            { label: 'Arrow', value: 'arrow' },
            { label: 'Bullet', value: 'bullet' },
            { label: 'Numbered', value: 'number' },
          ],
          type: 'select',
        },
        {
          name: 'columns',
          defaultValue: '1',
          options: ['1', '2', '3'].map((v) => ({ label: `${v} column${v === '1' ? '' : 's'}`, value: v })),
          type: 'select',
        },
      ],
    },
    {
      name: 'items',
      fields: [{ name: 'text', localized: true, required: true, type: 'text' }],
      labels: { plural: 'Items', singular: 'Item' },
      type: 'array',
    },
  ],
  icon: 'list',
  label: 'Checklist',
}

/* ---------------- Testimonial / Quote ---------------- */

const Testimonial: React.FC<
  ElementComponentProps<{ quote?: string; author?: string; role?: string; photo?: unknown }>
> = ({ data }) => {
  if (!data.quote) return null
  const photo =
    data.photo && typeof data.photo === 'object' && 'url' in data.photo
      ? (data.photo as { alt?: string; url?: string })
      : null
  return (
    <figure className="pb-quote">
      <blockquote className="pb-quote__text">{data.quote}</blockquote>
      <figcaption className="pb-quote__by">
        {photo?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img alt={photo.alt ?? ''} className="pb-quote__photo" loading="lazy" src={photo.url} />
        ) : null}
        <span>
          {data.author ? <strong>{data.author}</strong> : null}
          {data.role ? <span className="pb-quote__role">{data.role}</span> : null}
        </span>
      </figcaption>
    </figure>
  )
}

export const testimonialElement: ElementDefinition = {
  slug: 'testimonial',
  Component: Testimonial,
  category: 'content',
  excerpt: (d) => String(d.quote ?? '').slice(0, 110),
  fields: [
    { name: 'quote', localized: true, required: true, type: 'textarea' },
    {
      type: 'row',
      fields: [
        { name: 'author', localized: true, type: 'text' },
        { name: 'role', localized: true, type: 'text' },
      ],
    },
    { name: 'photo', relationTo: 'media', type: 'upload' },
  ],
  icon: 'quote',
  label: 'Testimonial',
}

/* ---------------- Counter / Stats ---------------- */

const Counter: React.FC<
  ElementComponentProps<{
    items?: { id?: string; value?: string; label?: string; prefix?: string; suffix?: string }[]
    columns?: string
  }>
> = ({ data }) => {
  if (!data.items?.length) return null
  return (
    <div
      className="pb-counters"
      style={{ '--pb-counters': data.columns ?? '3' } as React.CSSProperties}
    >
      {data.items.map((item, i) => (
        <div className="pb-counter" key={item.id ?? i}>
          {/* Numerals stay LTR even in Arabic content. */}
          <div className="pb-counter__value" dir="ltr">
            {item.prefix}
            {item.value}
            {item.suffix}
          </div>
          <div className="pb-counter__label">{item.label}</div>
        </div>
      ))}
    </div>
  )
}

export const counterElement: ElementDefinition = {
  slug: 'counter',
  Component: Counter,
  category: 'content',
  excerpt: (d) =>
    (Array.isArray(d.items) ? (d.items as { value?: string }[]) : [])
      .map((i) => i.value)
      .filter(Boolean)
      .join(' · '),
  fields: [
    {
      name: 'columns',
      defaultValue: '3',
      options: ['2', '3', '4'].map((v) => ({ label: `${v} columns`, value: v })),
      type: 'select',
    },
    {
      name: 'items',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'prefix', type: 'text' },
            { name: 'value', required: true, type: 'text' },
            { name: 'suffix', type: 'text' },
          ],
        },
        { name: 'label', localized: true, type: 'text' },
      ],
      labels: { plural: 'Counters', singular: 'Counter' },
      type: 'array',
    },
  ],
  icon: 'counter',
  label: 'Counters / Stats',
}

/* ---------------- Alert ---------------- */

const Alert: React.FC<ElementComponentProps<{ text?: string; tone?: string; title?: string }>> = ({
  data,
}) => {
  if (!data.text && !data.title) return null
  return (
    <div className={`pb-alert pb-alert--${data.tone ?? 'info'}`} role="note">
      {data.title ? <strong className="pb-alert__title">{data.title}</strong> : null}
      {data.text ? <span>{data.text}</span> : null}
    </div>
  )
}

export const alertElement: ElementDefinition = {
  slug: 'alert',
  Component: Alert,
  category: 'content',
  excerpt: (d) => String(d.title ?? d.text ?? ''),
  fields: [
    { name: 'title', localized: true, type: 'text' },
    { name: 'text', localized: true, type: 'textarea' },
    {
      name: 'tone',
      defaultValue: 'info',
      options: [
        { label: 'Info', value: 'info' },
        { label: 'Success', value: 'success' },
        { label: 'Warning', value: 'warning' },
        { label: 'Error', value: 'error' },
      ],
      type: 'select',
    },
  ],
  icon: 'alert',
  label: 'Alert',
}

/* ---------------- Progress bar ---------------- */

const Progress: React.FC<
  ElementComponentProps<{ items?: { id?: string; label?: string; percent?: number }[] }>
> = ({ data }) => {
  if (!data.items?.length) return null
  return (
    <div className="pb-progress">
      {data.items.map((item, i) => {
        const pct = Math.max(0, Math.min(100, Number(item.percent ?? 0)))
        return (
          <div className="pb-progress__item" key={item.id ?? i}>
            <div className="pb-progress__head">
              <span>{item.label}</span>
              <span dir="ltr">{pct}%</span>
            </div>
            <div
              aria-valuemax={100}
              aria-valuemin={0}
              aria-valuenow={pct}
              className="pb-progress__track"
              role="progressbar"
            >
              <span className="pb-progress__bar" style={{ width: `${pct}%` }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export const progressElement: ElementDefinition = {
  slug: 'progress',
  Component: Progress,
  category: 'content',
  excerpt: (d) =>
    (Array.isArray(d.items) ? (d.items as { label?: string }[]) : [])
      .map((i) => i.label)
      .filter(Boolean)
      .join(' · '),
  fields: [
    {
      name: 'items',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', localized: true, type: 'text' },
            { name: 'percent', max: 100, min: 0, required: true, type: 'number' },
          ],
        },
      ],
      labels: { plural: 'Bars', singular: 'Bar' },
      type: 'array',
    },
  ],
  icon: 'progress',
  label: 'Progress Bars',
}

/* ---------------- Table ---------------- */

const Table: React.FC<
  ElementComponentProps<{
    header?: { id?: string; cell?: string }[]
    rows?: { id?: string; cells?: { id?: string; cell?: string }[] }[]
  }>
> = ({ data }) => {
  if (!data.rows?.length && !data.header?.length) return null
  return (
    <div className="pb-table__scroll">
      <table className="pb-table">
        {data.header?.length ? (
          <thead>
            <tr>
              {data.header.map((h, i) => (
                <th key={h.id ?? i}>{h.cell}</th>
              ))}
            </tr>
          </thead>
        ) : null}
        <tbody>
          {(data.rows ?? []).map((row, ri) => (
            <tr key={row.id ?? ri}>
              {(row.cells ?? []).map((c, ci) => (
                <td key={c.id ?? ci}>{c.cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export const tableElement: ElementDefinition = {
  slug: 'table',
  Component: Table,
  category: 'content',
  excerpt: (d) => `${(d.rows as unknown[] | undefined)?.length ?? 0} rows`,
  fields: [
    {
      name: 'header',
      fields: [{ name: 'cell', localized: true, type: 'text' }],
      labels: { plural: 'Header cells', singular: 'Header cell' },
      type: 'array',
    },
    {
      name: 'rows',
      fields: [
        {
          name: 'cells',
          fields: [{ name: 'cell', localized: true, type: 'text' }],
          labels: { plural: 'Cells', singular: 'Cell' },
          type: 'array',
        },
      ],
      labels: { plural: 'Rows', singular: 'Row' },
      type: 'array',
    },
  ],
  icon: 'table',
  label: 'Table',
}
