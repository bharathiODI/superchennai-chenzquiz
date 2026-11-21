import type { Access, CollectionConfig, Field } from 'payload'
import type { ElementDefinition } from '../types'
import { buildLayoutField } from '../fields/blocks'
import { L } from '../i18n/localized'
import { seoFields } from '../globals/siteSettings'
import { canCreate, canDeleteContent, canUpdateContent, createdByField } from '../access/roles'

/**
 * Generic content collections every project starts with — Pages, Posts,
 * Categories, Tags. Each is a factory so slugs, labels and extra fields
 * can be adjusted per project without forking the plugin.
 */

const slugField = (): Field => ({
  name: 'slug',
  admin: {
    description: 'The URL segment. Lower case, hyphens instead of spaces.',
    position: 'sidebar',
  },
  hooks: {
    beforeValidate: [
      ({ data, value }) => {
        if (value) return String(value).toLowerCase().trim().replace(/\s+/g, '-')
        const title = (data as { title?: string } | undefined)?.title
        if (title) {
          return title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
        }
        return value
      },
    ],
  },
  index: true,
  required: true,
  type: 'text',
  unique: true,
})

const publishFields = (): Field[] => [
  {
    name: 'publishedAt',
    admin: { date: { pickerAppearance: 'dayAndTime' }, position: 'sidebar' },
    type: 'date',
  },
]

export interface ContentCollectionOptions {
  elements: ElementDefinition[]
  slug?: string
  mediaSlug?: string
  usersSlug?: string
  categoriesSlug?: string
  enableCanvas?: boolean
  extraFields?: Field[]
  access?: {
    create?: Access
    delete?: Access
    read?: Access
    update?: Access
  }
}

const baseAccess = (overrides: ContentCollectionOptions['access']) => ({
  create: overrides?.create ?? canCreate,
  delete: overrides?.delete ?? canDeleteContent,
  read: overrides?.read ?? (() => true),
  update: overrides?.update ?? canUpdateContent,
})

/* ---------------- Pages ---------------- */

export const buildPagesCollection = ({
  access,
  elements,
  enableCanvas = true,
  extraFields = [],
  mediaSlug = 'media',
  slug = 'pages',
  usersSlug = 'users',
}: ContentCollectionOptions): CollectionConfig => ({
  slug,
  access: baseAccess(access),
  admin: {
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    group: 'Content',
    useAsTitle: 'title',
  },
  fields: [
    L({ name: 'title', required: true, type: 'text' }),
    slugField(),
    {
      name: 'parent',
      admin: { description: 'Nest this page under another.', position: 'sidebar' },
      relationTo: slug as never,
      type: 'relationship',
    },
    buildLayoutField(elements, 'layout', enableCanvas),
    seoFields(mediaSlug),
    ...publishFields(),
    createdByField(usersSlug),
    ...extraFields,
  ],
  versions: { drafts: true },
})

/* ---------------- Posts ---------------- */

export const buildPostsCollection = ({
  access,
  categoriesSlug = 'categories',
  elements,
  enableCanvas = true,
  extraFields = [],
  mediaSlug = 'media',
  slug = 'posts',
  usersSlug = 'users',
}: ContentCollectionOptions): CollectionConfig => ({
  slug,
  access: baseAccess(access),
  admin: {
    defaultColumns: ['title', 'categories', '_status', 'publishedAt'],
    group: 'Content',
    useAsTitle: 'title',
  },
  fields: [
    L({ name: 'title', required: true, type: 'text' }),
    slugField(),
    L({
      name: 'excerpt',
      admin: { description: 'Shown in listings and used as the fallback meta description.' },
      type: 'textarea',
    }),
    { name: 'featuredImage', relationTo: mediaSlug as never, type: 'upload' },
    {
      name: 'categories',
      admin: { position: 'sidebar' },
      hasMany: true,
      relationTo: categoriesSlug as never,
      type: 'relationship',
    },
    {
      name: 'tags',
      admin: { position: 'sidebar' },
      hasMany: true,
      relationTo: 'tags' as never,
      type: 'relationship',
    },
    {
      name: 'featured',
      admin: { description: 'Pins this post to the top of listings.', position: 'sidebar' },
      defaultValue: false,
      type: 'checkbox',
    },
    buildLayoutField(elements, 'layout', enableCanvas),
    seoFields(mediaSlug),
    ...publishFields(),
    createdByField(usersSlug),
    ...extraFields,
  ],
  versions: { drafts: true },
})

/* ---------------- Taxonomies ---------------- */

export interface TaxonomyOptions {
  slug?: string
  labelSingular?: string
  labelPlural?: string
  mediaSlug?: string
  hierarchical?: boolean
  access?: ContentCollectionOptions['access']
}

export const buildTaxonomyCollection = ({
  access,
  hierarchical = true,
  labelPlural = 'Categories',
  labelSingular = 'Category',
  mediaSlug = 'media',
  slug = 'categories',
}: TaxonomyOptions = {}): CollectionConfig => ({
  slug,
  access: baseAccess(access),
  admin: {
    defaultColumns: ['title', 'slug'],
    group: 'Content',
    useAsTitle: 'title',
  },
  fields: [
    L({ name: 'title', required: true, type: 'text' }),
    slugField(),
    L({ name: 'description', type: 'textarea' }),
    ...(hierarchical
      ? [
          {
            name: 'parent',
            admin: { position: 'sidebar' as const },
            relationTo: slug as never,
            type: 'relationship' as const,
          } satisfies Field,
        ]
      : []),
    { name: 'image', relationTo: mediaSlug as never, type: 'upload' },
    {
      name: 'order',
      admin: { description: 'Lower numbers appear first.', position: 'sidebar' },
      defaultValue: 0,
      type: 'number',
    },
  ],
  labels: { plural: labelPlural, singular: labelSingular },
})

/* ---------------- Media ---------------- */

export const buildMediaCollection = ({
  access,
  slug = 'media',
  staticDir,
}: { access?: ContentCollectionOptions['access']; slug?: string; staticDir?: string } = {}): CollectionConfig => ({
  slug,
  access: {
    create: access?.create ?? canCreate,
    delete: access?.delete ?? canDeleteContent,
    read: access?.read ?? (() => true),
    update: access?.update ?? canUpdateContent,
  },
  admin: { group: 'Content' },
  fields: [
    L({
      name: 'alt',
      admin: {
        description:
          'Describes the image for screen readers and search engines. Leave blank only if the image is purely decorative.',
      },
      type: 'text',
    }),
    L({ name: 'caption', type: 'text' }),
    { name: 'credit', type: 'text' },
  ],
  upload: staticDir ? { staticDir } : true,
})
