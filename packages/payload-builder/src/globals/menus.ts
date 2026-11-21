import type { Access, GlobalConfig } from 'payload'
import { L } from '../i18n/localized'

/**
 * Navigation Menus — WordPress Appearance → Menus, as a global.
 *
 * Three levels of nesting is enough for any site navigation and keeps the
 * schema flat enough for Postgres. Each item is either an internal
 * reference (so the URL follows the page if its slug changes) or a plain
 * URL.
 */

export interface MenusOptions {
  slug?: string
  canUpdate?: Access
  /** Collections an item may point at. */
  linkableCollections?: string[]
  /** Menu areas the theme renders. */
  areas?: { label: string; name: string }[]
}

const linkFields = (linkable: string[]) => [
  {
    type: 'row' as const,
    fields: [
      L({ name: 'label', required: true, type: 'text' as const }),
      {
        name: 'linkType',
        defaultValue: 'internal',
        options: [
          { label: 'Page', value: 'internal' },
          { label: 'Custom URL', value: 'custom' },
        ],
        type: 'select' as const,
      },
    ],
  },
  {
    name: 'doc',
    admin: { condition: (_d: unknown, s: { linkType?: string }) => s?.linkType !== 'custom' },
    label: 'Page',
    relationTo: linkable as never,
    type: 'relationship' as const,
  },
  {
    type: 'row' as const,
    fields: [
      {
        name: 'url',
        admin: { condition: (_d: unknown, s: { linkType?: string }) => s?.linkType === 'custom' },
        type: 'text' as const,
      },
      { name: 'newTab', defaultValue: false, label: 'Open in new tab', type: 'checkbox' as const },
    ],
  },
  {
    type: 'row' as const,
    fields: [
      { name: 'cssClass', label: 'CSS class', type: 'text' as const },
      {
        name: 'highlight',
        admin: { description: 'Renders as a button rather than a plain link.' },
        defaultValue: false,
        type: 'checkbox' as const,
      },
    ],
  },
]

export const buildMenusGlobal = ({
  areas = [
    { label: 'Header', name: 'header' },
    { label: 'Footer', name: 'footer' },
    { label: 'Utility / top bar', name: 'utility' },
    { label: 'Legal', name: 'legal' },
  ],
  canUpdate,
  linkableCollections = ['pages'],
  slug = 'menus',
}: MenusOptions = {}): GlobalConfig => ({
  slug,
  access: { read: () => true, ...(canUpdate ? { update: canUpdate } : {}) },
  admin: {
    description: 'Site navigation. Drag to reorder; up to three levels deep.',
    group: 'Appearance',
  },
  fields: [
    {
      tabs: areas.map((area) => ({
        name: area.name,
        fields: [
          {
            name: 'items',
            admin: { initCollapsed: true },
            fields: [
              ...linkFields(linkableCollections),
              {
                name: 'children',
                admin: { initCollapsed: true },
                fields: [
                  ...linkFields(linkableCollections),
                  {
                    name: 'children',
                    admin: { initCollapsed: true },
                    fields: linkFields(linkableCollections),
                    labels: { plural: 'Sub-items', singular: 'Sub-item' },
                    type: 'array',
                  },
                ],
                labels: { plural: 'Sub-items', singular: 'Sub-item' },
                type: 'array',
              },
            ],
            labels: { plural: 'Menu items', singular: 'Menu item' },
            type: 'array',
          },
        ],
        label: area.label,
      })),
      type: 'tabs',
    },
  ],
  label: 'Menus',
})

/* ------------------------------------------------------------------ */
/* Frontend helper                                                     */
/* ------------------------------------------------------------------ */

export interface MenuItem {
  label?: string
  linkType?: string
  doc?: unknown
  url?: string
  newTab?: boolean
  cssClass?: string
  highlight?: boolean
  children?: MenuItem[]
}

/**
 * Resolves a menu item to an href. Internal links follow the referenced
 * document's slug, so renaming a page updates every menu automatically.
 */
export const menuHref = (item: MenuItem, localePrefix = ''): string => {
  if (item.linkType === 'custom') return item.url ?? '#'
  const doc = item.doc
  if (doc && typeof doc === 'object') {
    const d = doc as { slug?: string; breadcrumbs?: { url?: string }[] }
    const crumb = d.breadcrumbs?.[d.breadcrumbs.length - 1]?.url
    const path = crumb ?? (d.slug ? `/${d.slug}` : '/')
    return `${localePrefix}${path}`
  }
  return item.url ?? '#'
}
