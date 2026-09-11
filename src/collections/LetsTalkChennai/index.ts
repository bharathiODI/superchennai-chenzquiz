import { isNotAdmin } from '@/access/checkRole'
import { isAdmin, isAdminAdminAccess } from '@/access/isAdmin'
import { AboutUsBlock } from '@/blocks/AboutUs/config'
import { Banner } from '@/blocks/Banner/config'
import { Code } from '@/blocks/Code/config'
import { EventRegistrationFormBlock } from '@/blocks/EventRegistrationForm/config'
import { EventDetailsBlock } from '@/blocks/EventsDetails/config'

import { MediaBlock } from '@/blocks/MediaBlock/config'
import { VideoBlock } from '@/blocks/VideoBlock/config'
import { VideoGalleryBlock } from '@/blocks/videoGallery/config'
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
import type { CollectionConfig } from 'payload'
import { slugField } from 'src/fields/slug'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'

export const LetsTalkChennai: CollectionConfig<'lets-talks-chennai'> = {
  slug: 'lets-talks-chennai',

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
  defaultSort: 'order',

  admin: {
    hidden: isNotAdmin,
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'lets-talks-chennai',
          req,
        })

        return path
      },
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'lets-talks-chennai',
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
          label: 'Content',
          fields: [
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'mobileImage',
              type: 'upload',
              relationTo: 'media',
            },
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
                        AboutUsBlock,
                        EventRegistrationFormBlock,
                        EventDetailsBlock,
                        VideoGalleryBlock,
                      ],
                    }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    HorizontalRuleFeature(),
                  ]
                },
              }),
              label: false,
            },
          ],
        },

        // =========================================================
        // EVENT DETAILS & GENERAL INFO
        // =========================================================
        {
          label: 'Event Details',
          fields: [
            {
              name: 'eventFields',
              type: 'group',
              label: 'General Event Info',
              fields: [
                {
                  name: 'TalkCategories',
                  type: 'relationship',
                  relationTo: 'talkcategories',
                  required: true,
                  hasMany: true,
                  label: 'talk Category',
                  admin: {
                    description: 'Select dynamic category created from Categories collection.',
                  },
                },
                {
                  name: 'shortDescription',
                  type: 'textarea',
                  label: 'Short Description',
                },
                {
                  name: 'familyFriendly',
                  type: 'checkbox',
                  label: 'Family Friendly',
                  defaultValue: false,
                },
                {
                  name: 'featured',
                  type: 'checkbox',
                  defaultValue: false,
                },
                {
                  name: 'link',
                  type: 'text',
                },
                {
                  name: 'linkbutton',
                  type: 'text',
                  label: 'CTA Button Name',
                  admin: {
                    placeholder: 'Buy Tickets / Book Now / Register',
                  },
                },
                {
                  name: 'enableExternalRedirect',
                  type: 'checkbox',
                  label: 'Enable External Redirect',
                  defaultValue: false,
                },
                {
                  name: 'externalUrl',
                  type: 'text',
                  label: 'External URL',
                  admin: {
                    condition: (_, siblingData) => siblingData?.enableExternalRedirect,
                  },
                },
                {
                  name: 'openInNewTab',
                  type: 'checkbox',
                  label: 'Open in New Tab',
                  defaultValue: false,
                },
              ],
            },
          ],
        },

        // =========================================================
        // DYNAMIC FORM SETTINGS
        // =========================================================
        {
          label: 'Form & Registration Settings',
          fields: [
            {
              name: 'regSettings',
              type: 'group',
              label: 'Registration Options',
              fields: [
                {
                  name: 'isRegistrationOpen',
                  type: 'checkbox',
                  defaultValue: true,
                },
                {
                  name: 'enableOTP',
                  type: 'checkbox',
                  defaultValue: true,
                },
                {
                  name: 'maxRegistrations',
                  type: 'number',
                },
                {
                  name: 'thankYouMessage',
                  type: 'textarea',
                },
              ],
            },
            {
              name: 'customFields',
              label: 'Dynamic Submitter/Form Fields',
              type: 'relationship',
              relationTo: 'event-form-fields',
              hasMany: true,
              admin: {
                description:
                  'Admin Dashboard-இல் உருவாக்கிய Field-களை இங்கு Select செய்து கொள்ளவும் (e.g., Reel Duration, Submitter Name, Nominee Info).',
              },
            },
          ],
        },

        // =========================================================
        // SEO TAB (Grouped under 'meta' to avoid duplicate 'title')
        // =========================================================
        {
          label: 'SEO',
          fields: [
            {
              name: 'meta',
              type: 'group',
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
              ],
            },
            {
              name: 'schema',
              type: 'json',
              label: 'Structured Data (JSON-LD)',
            },
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

    {
      name: 'order',
      type: 'number',
      label: 'Display Order / Priority',
      defaultValue: 10,
      admin: {
        position: 'sidebar',
        description: 'குறைந்த எண் (1, 2, 3) முதலில் தோன்றும்.',
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
