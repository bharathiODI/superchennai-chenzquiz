import type { BlocksField, CollectionConfig } from 'payload'

import { slugField } from 'src/fields/slug'
import { hero } from 'src/heros/config'
import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'

import { Banner } from '@/blocks/Banner/config'
import { Code } from '@/blocks/Code/config'
import { EventListing } from '@/blocks/eventListing/config'

import { MediaBlock } from '@/blocks/MediaBlock/config'
import { MediaCarousel } from '@/blocks/MediaCarousel/config'
import { VideoBlock } from '@/blocks/VideoBlock/config'
import { VideoGalleryBlock } from '@/blocks/videoGallery/config'
import { SEOFieldSchema } from '@/fields/seo'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { isNotAdmin } from '@/access/checkRole'
import { AboutTriviaBlock } from '../Games/Blocks/AboutTriviaPage/config'
import { HowItWorksBlock } from '../Games/Blocks/HowItWorksSection/config'
import { LetsTalkChennaiFAQBlock } from '../Games/Blocks/LetsTalkChennaiFAQ/config'
import { TriviaAuthBlock } from '../Games/Blocks/ReadytoPlay/config'
import { CreativeHeroBlock } from '../Games/Blocks/CreativeHero/config'
import { InstaReelsBlock } from '../Games/Blocks/InstaReelsSlider/config'
import { QuizRewardsBlock } from '../Games/Blocks/QuizRewards/config'
import { isAdmin, isAdminAdminAccess } from '@/access/isAdmin'
import { OurPartnersBlock } from '../Games/Blocks/OurPartnersBlock/config'
import { buildLayoutField } from '@opendesigns/payload-builder'
import { builderElements } from '@/builder/elements'

// Optional page-builder sections (Section > Row > Column > Element). They render below the
// Content tab, so pages that leave this empty look exactly as before.
const builderLayout = buildLayoutField(builderElements, 'layout', true) as BlocksField

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  access: {
    admin: isAdminAdminAccess,
    create: isAdmin,
    delete: isAdmin,
    read: authenticatedOrPublished,
    update: isAdmin,
  },
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    hidden: isNotAdmin,
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'pages',
          req,
        })

        return path
      },
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'pages',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [hero],
          label: 'Hero',
        },
        {
          fields: [
            {
              name: 'content',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    BlocksFeature({
                      blocks: [
                        Banner,
                        Code,
                        MediaBlock,
                        VideoBlock,
                        EventListing,
                        MediaCarousel,
                        VideoGalleryBlock,
                        TriviaAuthBlock,
                        AboutTriviaBlock,
                        HowItWorksBlock,
                        LetsTalkChennaiFAQBlock,
                        CreativeHeroBlock,
                        InstaReelsBlock,
                        QuizRewardsBlock,
                        OurPartnersBlock
                      ],
                    }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    HorizontalRuleFeature(),
                  ]
                },
              }),
              label: false,
              admin: {
                description:
                  'The page content. Leave it empty if the page is built only in the Page Builder tab.',
              },
            },
          ],
          label: 'Content',
        },
        {
          label: 'Page Builder',
          description:
            'Optional. Sections built here appear on the page below the Content tab, in this order. Leave it empty to show only the Content tab.',
          fields: [{ ...builderLayout, label: 'Sections' }],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),

            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
            {
              name: 'schema',
              type: 'json',
              label: 'Structured Data (JSON-LD)',
              admin: {
                description: 'Paste valid JSON-LD schema (Event schema for SEO)',
              },
            },
            SEOFieldSchema,
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    ...slugField(),
  ],
  hooks: {
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
