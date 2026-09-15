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

export const Questions: CollectionConfig<'questions'> = {
  slug: 'questions',
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
          collection: 'questions',
          req,
        })

        return path
      },
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'questions',
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
        // --- TAB 1: CONTENT & GAME BASICS ---
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
            {
              type: 'row',
              fields: [
                {
                  name: 'quiz',
                  type: 'relationship',
                  relationTo: 'quizzes',
                  required: true,
                  admin: { width: '50%' },
                },
                {
                  name: 'questionNumber',
                  type: 'number',
                  required: true,
                  admin: { width: '25%' },
                },
                {
                  name: 'gameType',
                  type: 'select',
                  required: true,
                  defaultValue: 'mcq',
                  options: [
                    { label: 'MCQ', value: 'mcq' },
                    { label: 'Dropdown', value: 'dropdown' },
                    { label: 'Wordle', value: 'wordle' },
                    { label: 'Word Finder', value: 'word_finder' },
                    { label: 'Match the Following', value: 'match_following' },
                    { label: 'Spot the Lie', value: 'spot_lie' },
                    { label: 'Re-order', value: 'reorder' },
                    { label: 'Drag & Drop', value: 'drag_drop' },
                  ],
                  admin: { width: '25%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'questionTitle',
                  type: 'text',
                  required: true,
                  label: 'Question Title / Header',
                  admin: { width: '70%' },
                },
                {
                  name: 'category',
                  type: 'select',
                  options: [
                    { label: 'Chennai', value: 'chennai' },
                    { label: 'General Knowledge', value: 'gk' },
                    { label: 'Science', value: 'science' },
                    { label: 'Geography', value: 'geography' },
                  ],
                  defaultValue: 'chennai',
                  admin: { width: '30%' },
                },
              ],
            },
          ],
        },

        // --- TAB 2: GAME SPECIFIC FIELDS (CONDITIONAL) ---
        {
          label: 'Game Configuration',
          fields: [
            // A. MCQ FIELDS
            {
              name: 'mcqGroup',
              type: 'group',
              label: 'MCQ Configuration',
              admin: {
                condition: (data) => data?.gameType === 'mcq',
              },
              fields: [
                {
                  name: 'questionText',
                  type: 'richText',
                  required: true,
                },
                {
                  name: 'questionImage',
                  type: 'upload',
                  relationTo: 'media',
                },
                {
                  name: 'options',
                  type: 'array',
                  required: true,
                  minRows: 2,
                  maxRows: 6,
                  fields: [
                    { name: 'optionText', type: 'text', required: true },
                    { name: 'optionImage', type: 'upload', relationTo: 'media' },
                  ],
                },
                {
                  name: 'correctOptionIndex',
                  type: 'number',
                  required: true,
                  label: 'Correct Option Index (0 for Option A, 1 for Option B, etc.)',
                },
              ],
            },

            // B. DROPDOWN FIELDS
            {
              name: 'dropdownGroup',
              type: 'group',
              label: 'Dropdown Configuration',
              admin: {
                condition: (data) => data?.gameType === 'dropdown',
              },
              fields: [
                {
                  name: 'sentenceText',
                  type: 'text',
                  label: 'Sentence (Use _____ for blank)',
                  required: true,
                },
                {
                  name: 'dropdownLabel',
                  type: 'text',
                  defaultValue: 'Select Answer',
                },
                {
                  name: 'options',
                  type: 'array',
                  required: true,
                  fields: [{ name: 'optionText', type: 'text', required: true }],
                },
                {
                  name: 'correctAnswer',
                  type: 'text',
                  required: true,
                },
              ],
            },

            // C. WORDLE FIELDS
            {
              name: 'wordleGroup',
              type: 'group',
              label: 'Wordle Configuration',
              admin: {
                condition: (data) => data?.gameType === 'wordle',
              },
              fields: [
                { name: 'clueText', type: 'text', required: true },
                {
                  name: 'answerWord',
                  type: 'text',
                  required: true,
                  label: 'Target Word (UPPERCASE)',
                },
                { name: 'attempts', type: 'number', defaultValue: 6 },
                { name: 'hint', type: 'text' },
                { name: 'hintImage', type: 'upload', relationTo: 'media' },
              ],
            },

            // D. WORD FINDER FIELDS
            {
              name: 'wordFinderGroup',
              type: 'group',
              label: 'Word Finder Configuration',
              admin: {
                condition: (data) => data?.gameType === 'word_finder',
              },
              fields: [
                { name: 'instruction', type: 'text', defaultValue: 'Find all the hidden words' },
                {
                  name: 'gridRows',
                  type: 'array',
                  label: 'Grid (Space separated characters per row)',
                  required: true,
                  fields: [{ name: 'rowString', type: 'text', required: true }],
                },
                {
                  name: 'wordsToFind',
                  type: 'array',
                  required: true,
                  fields: [{ name: 'word', type: 'text', required: true }],
                },
              ],
            },

            // E. MATCH THE FOLLOWING FIELDS
            {
              name: 'matchGroup',
              type: 'group',
              label: 'Match the Following Configuration',
              admin: {
                condition: (data) => data?.gameType === 'match_following',
              },
              fields: [
                {
                  name: 'instruction',
                  type: 'text',
                  defaultValue: 'Match the following correctly',
                },
                {
                  name: 'pairs',
                  type: 'array',
                  required: true,
                  fields: [
                    { name: 'leftItem', type: 'text', required: true },
                    { name: 'rightItem', type: 'text', required: true },
                  ],
                },
              ],
            },

            // F. SPOT THE LIE FIELDS
            {
              name: 'spotLieGroup',
              type: 'group',
              label: 'Spot the Lie Configuration',
              admin: {
                condition: (data) => data?.gameType === 'spot_lie',
              },
              fields: [
                {
                  name: 'statements',
                  type: 'array',
                  required: true,
                  minRows: 3,
                  fields: [
                    { name: 'statementText', type: 'text', required: true },
                    {
                      name: 'isLie',
                      type: 'checkbox',
                      defaultValue: false,
                      label: 'Is this statement the LIE?',
                    },
                  ],
                },
              ],
            },

            // G. RE-ORDER FIELDS
            {
              name: 'reorderGroup',
              type: 'group',
              label: 'Re-order Configuration',
              admin: {
                condition: (data) => data?.gameType === 'reorder',
              },
              fields: [
                { name: 'instruction', type: 'text', required: true },
                {
                  name: 'itemsInCorrectOrder',
                  type: 'array',
                  label: 'Enter items in the EXACT CORRECT sequence',
                  required: true,
                  fields: [{ name: 'itemText', type: 'text', required: true }],
                },
              ],
            },

            // H. DRAG & DROP FIELDS
            {
              name: 'dragDropGroup',
              type: 'group',
              label: 'Drag & Drop Configuration',
              admin: {
                condition: (data) => data?.gameType === 'drag_drop',
              },
              fields: [
                { name: 'instruction', type: 'text', required: true },
                {
                  name: 'dragMode',
                  type: 'select',
                  options: [
                    { label: 'Categorize into Zones', value: 'categories' },
                    { label: 'Sentence Builder', value: 'sentence' },
                  ],
                  defaultValue: 'sentence',
                },
                // Sentence Builder Mapping
                {
                  name: 'sentenceWordsOrder',
                  type: 'array',
                  label: 'Sentence Words in Correct Order',
                  admin: {
                    condition: (data) => data?.dragDropGroup?.dragMode === 'sentence',
                  },
                  fields: [{ name: 'word', type: 'text', required: true }],
                },
                // Category Zones Mapping
                {
                  name: 'dropZones',
                  type: 'array',
                  label: 'Drop Zones & Item Mapping',
                  admin: {
                    condition: (data) => data?.dragDropGroup?.dragMode === 'categories',
                  },
                  fields: [
                    { name: 'zoneTitle', type: 'text', required: true },
                    {
                      name: 'zoneItems',
                      type: 'array',
                      fields: [{ name: 'itemText', type: 'text', required: true }],
                    },
                  ],
                },
              ],
            },
          ],
        },

        // --- TAB 3: COMMON SETTINGS & EXPLANATION ---
        {
          label: 'Settings & Explanation',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'timeLimit',
                  type: 'number',
                  defaultValue: 60,
                  label: 'Time (Seconds)',
                  admin: { width: '25%' },
                },
                { name: 'points', type: 'number', defaultValue: 10, admin: { width: '25%' } },
                {
                  name: 'negativePoints',
                  type: 'number',
                  defaultValue: 0,
                  admin: { width: '25%' },
                },
                {
                  name: 'difficulty',
                  type: 'select',
                  options: ['Easy', 'Medium', 'Hard'],
                  defaultValue: 'Medium',
                  admin: { width: '25%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'enableDoubleUp',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'explanation',
              type: 'richText',
              label: 'Explanation (Shown after answering)',
            },
          ],
        },

        // --- TAB 4: SEO FIELDS ---
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
            MetaDescriptionField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
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
