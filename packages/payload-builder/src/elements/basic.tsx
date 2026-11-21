import React from 'react'
import type { ElementComponentProps, ElementDefinition } from '../types'

/* ---------------- Heading ---------------- */

const Heading: React.FC<ElementComponentProps<{ text?: string; level?: string; eyebrow?: string }>> = ({
  data,
}) => {
  const Tag = (data.level ?? 'h2') as 'h2'
  return (
    <>
      {data.eyebrow ? <span className="pb-eyebrow">{data.eyebrow}</span> : null}
      <Tag className="pb-heading">{data.text}</Tag>
    </>
  )
}

export const headingElement: ElementDefinition = {
  slug: 'heading',
  Component: Heading,
  category: 'basic',
  excerpt: (d) => String(d.text ?? ''),
  fields: [
    { name: 'text', localized: true, required: true, type: 'text' },
    {
      name: 'eyebrow',
      admin: { description: 'Small label shown above the heading.' },
      localized: true,
      type: 'text',
    },
    {
      name: 'level',
      defaultValue: 'h2',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((v) => ({ label: v.toUpperCase(), value: v })),
      type: 'select',
    },
  ],
  icon: 'heading',
  label: 'Heading',
}

/* ---------------- Button ---------------- */

const SAFE_URL = /^(https?:\/\/|\/|#|mailto:|tel:)/i

const Button: React.FC<
  ElementComponentProps<{ text?: string; url?: string; variant?: string; size?: string; newTab?: boolean }>
> = ({ data }) => {
  const href = data.url && SAFE_URL.test(data.url) ? data.url : undefined
  if (!href || !data.text) return null
  return (
    <a
      className={`pb-button pb-button--${data.variant ?? 'primary'} pb-button--${data.size ?? 'md'}`}
      href={href}
      rel={data.newTab ? 'noopener noreferrer' : undefined}
      target={data.newTab ? '_blank' : undefined}
    >
      {data.text}
    </a>
  )
}

export const buttonElement: ElementDefinition = {
  slug: 'button',
  Component: Button,
  category: 'basic',
  excerpt: (d) => String(d.text ?? ''),
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'text', localized: true, required: true, type: 'text' },
        { name: 'url', required: true, type: 'text' },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'variant',
          defaultValue: 'primary',
          options: [
            { label: 'Primary', value: 'primary' },
            { label: 'Secondary', value: 'secondary' },
            { label: 'Outline', value: 'outline' },
            { label: 'Text only', value: 'ghost' },
          ],
          type: 'select',
        },
        {
          name: 'size',
          defaultValue: 'md',
          options: [
            { label: 'Small', value: 'sm' },
            { label: 'Medium', value: 'md' },
            { label: 'Large', value: 'lg' },
          ],
          type: 'select',
        },
        { name: 'newTab', defaultValue: false, label: 'Open in new tab', type: 'checkbox' },
      ],
    },
  ],
  icon: 'button',
  label: 'Button',
}

/* ---------------- Divider ---------------- */

const Divider: React.FC<ElementComponentProps<{ height?: number; line?: boolean }>> = ({ data }) => (
  <div
    aria-hidden="true"
    className={`pb-divider${data.line ? ' pb-divider--line' : ''}`}
    style={{ height: `${data.height ?? 32}px` }}
  />
)

export const dividerElement: ElementDefinition = {
  slug: 'divider',
  Component: Divider,
  category: 'basic',
  excerpt: (d) => `${d.height ?? 32}px${d.line ? ' · line' : ''}`,
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'height', defaultValue: 32, max: 400, min: 0, type: 'number' },
        { name: 'line', defaultValue: false, label: 'Show line', type: 'checkbox' },
      ],
    },
  ],
  icon: 'divider',
  label: 'Divider',
}

/* ---------------- Spacer ---------------- */

const Spacer: React.FC<ElementComponentProps<{ h?: number; hMd?: number; hSm?: number }>> = ({
  data,
}) => (
  <div
    aria-hidden="true"
    className="pb-spacer"
    style={
      {
        '--pb-spacer': `${data.h ?? 48}px`,
        '--pb-spacer-md': data.hMd != null ? `${data.hMd}px` : undefined,
        '--pb-spacer-sm': data.hSm != null ? `${data.hSm}px` : undefined,
        height: 'var(--pb-spacer)',
      } as React.CSSProperties
    }
  />
)

export const spacerElement: ElementDefinition = {
  slug: 'spacer',
  Component: Spacer,
  category: 'basic',
  excerpt: (d) => `${d.h ?? 48}px`,
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'h', defaultValue: 48, label: 'Desktop (px)', max: 600, min: 0, type: 'number' },
        { name: 'hMd', label: 'Tablet (px)', max: 600, min: 0, type: 'number' },
        { name: 'hSm', label: 'Mobile (px)', max: 600, min: 0, type: 'number' },
      ],
    },
  ],
  icon: 'spacer',
  label: 'Spacer',
}

/* ---------------- Icon ---------------- */

const Icon: React.FC<ElementComponentProps<{ svg?: string; size?: number; label?: string }>> = ({
  data,
}) => {
  // SVG markup is author-controlled admin content, but still only rendered
  // when it actually looks like an <svg> element.
  const svg = typeof data.svg === 'string' && /^\s*<svg[\s>]/i.test(data.svg) ? data.svg : ''
  if (!svg) return null
  return (
    <span
      aria-hidden={data.label ? undefined : 'true'}
      aria-label={data.label || undefined}
      className="pb-icon"
      dangerouslySetInnerHTML={{ __html: svg }}
      role={data.label ? 'img' : undefined}
      style={{ '--pb-icon-size': `${data.size ?? 32}px` } as React.CSSProperties}
    />
  )
}

export const iconElement: ElementDefinition = {
  slug: 'icon',
  Component: Icon,
  category: 'basic',
  excerpt: (d) => String(d.label ?? 'icon'),
  fields: [
    {
      name: 'svg',
      admin: { description: 'Paste inline SVG markup. Must start with <svg.' },
      label: 'SVG markup',
      type: 'textarea',
    },
    {
      type: 'row',
      fields: [
        { name: 'size', defaultValue: 32, max: 200, min: 8, type: 'number' },
        {
          name: 'label',
          admin: { description: 'Leave blank if decorative.' },
          label: 'Accessible label',
          localized: true,
          type: 'text',
        },
      ],
    },
  ],
  icon: 'icon',
  label: 'Icon',
}
