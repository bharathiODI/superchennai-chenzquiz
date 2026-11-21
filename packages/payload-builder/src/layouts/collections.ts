import type { CollectionConfig } from 'payload'
import type { ElementDefinition } from '../types'
import { buildLayoutField } from '../fields/blocks'

/**
 * Avada-style Layouts.
 *
 * Two collections:
 *
 * - **Layout Sections** (`builder-sections`) — reusable chunks built with
 *   the same canvas: a header, a footer, a CTA band, a page-title bar.
 * - **Layouts** (`builder-layouts`) — assemble sections into slots
 *   (header / page title / content / footer) and say *where* the layout
 *   applies through conditions.
 *
 * Resolution mirrors Avada: the most specific matching layout wins, and a
 * layout marked `isGlobal` is the fallback for everything else. Slots left
 * empty on a matching layout fall back to the global layout's slot, so a
 * "Projects" layout can override only the content area and still inherit
 * the global header and footer.
 */

export const SECTION_SLOTS = ['header', 'pageTitle', 'content', 'footer'] as const
export type SectionSlot = (typeof SECTION_SLOTS)[number]

export interface LayoutCollectionOptions {
  elements: ElementDefinition[]
  /** Collections that layouts may target. Used for the condition dropdown. */
  targetCollections?: string[]
  sectionsSlug?: string
  layoutsSlug?: string
  enableCanvas?: boolean
}

export const buildSectionsCollection = ({
  elements,
  enableCanvas = true,
  sectionsSlug = 'builder-sections',
}: LayoutCollectionOptions): CollectionConfig => ({
  slug: sectionsSlug,
  admin: {
    defaultColumns: ['title', 'slot', 'updatedAt'],
    description: 'Reusable layout sections — headers, footers, page title bars, CTA bands.',
    group: 'Layouts',
    useAsTitle: 'title',
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'title', required: true, type: 'text' },
        {
          name: 'slot',
          admin: { description: 'Which layout slot this section is intended for.' },
          defaultValue: 'content',
          options: [
            { label: 'Header', value: 'header' },
            { label: 'Page title bar', value: 'pageTitle' },
            { label: 'Content', value: 'content' },
            { label: 'Footer', value: 'footer' },
          ],
          type: 'select',
        },
      ],
    },
    buildLayoutField(elements, 'layout', enableCanvas),
  ],
  versions: { drafts: true },
})

export const buildLayoutsCollection = ({
  layoutsSlug = 'builder-layouts',
  sectionsSlug = 'builder-sections',
  targetCollections = ['pages'],
}: LayoutCollectionOptions): CollectionConfig => ({
  slug: layoutsSlug,
  admin: {
    defaultColumns: ['title', 'isGlobal', 'priority', 'updatedAt'],
    description:
      'Assign layout sections to pages. The global layout applies everywhere; other layouts override it where their conditions match.',
    group: 'Layouts',
    useAsTitle: 'title',
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'title', required: true, type: 'text' },
        {
          name: 'isGlobal',
          admin: {
            description:
              'The fallback used when no other layout matches. Only one layout should be global.',
          },
          defaultValue: false,
          label: 'Global layout',
          type: 'checkbox',
        },
        {
          name: 'priority',
          admin: {
            description: 'Higher wins when several layouts match. Ties break on specificity.',
          },
          defaultValue: 0,
          type: 'number',
        },
      ],
    },

    {
      type: 'collapsible',
      admin: {
        description: 'Leave a slot empty to inherit it from the global layout.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'header',
              filterOptions: () => ({ slot: { equals: 'header' } }),
              relationTo: sectionsSlug as never,
              type: 'relationship',
            },
            {
              name: 'pageTitle',
              filterOptions: () => ({ slot: { equals: 'pageTitle' } }),
              label: 'Page title bar',
              relationTo: sectionsSlug as never,
              type: 'relationship',
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'content',
              admin: {
                description:
                  "Usually left empty so the page's own layout renders. Set it to wrap or replace page content.",
              },
              filterOptions: () => ({ slot: { equals: 'content' } }),
              relationTo: sectionsSlug as never,
              type: 'relationship',
            },
            {
              name: 'footer',
              filterOptions: () => ({ slot: { equals: 'footer' } }),
              relationTo: sectionsSlug as never,
              type: 'relationship',
            },
          ],
        },
      ],
      label: 'Sections',
    },

    {
      name: 'conditions',
      admin: {
        condition: (_d, sibling) => !sibling?.isGlobal,
        description: 'The layout applies when ANY condition matches. Global layouts need none.',
        initCollapsed: false,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'type',
              defaultValue: 'collection',
              options: [
                { label: 'Whole collection', value: 'collection' },
                { label: 'Specific page (by slug)', value: 'slug' },
                { label: 'Path starts with', value: 'prefix' },
                { label: 'Locale', value: 'locale' },
              ],
              type: 'select',
            },
            {
              name: 'collection',
              admin: { condition: (_d, s) => s?.type === 'collection' },
              defaultValue: targetCollections[0],
              options: targetCollections.map((c) => ({ label: c, value: c })),
              type: 'select',
            },
            {
              name: 'value',
              admin: {
                condition: (_d, s) => s?.type !== 'collection',
                description: 'Slug, path prefix (e.g. /news), or locale code.',
              },
              type: 'text',
            },
          ],
        },
      ],
      labels: { plural: 'Conditions', singular: 'Condition' },
      type: 'array',
    },
  ],
  versions: { drafts: true },
})
