import { WRITERS, createContent, deleteContent, hiddenUnless, updateContent } from '@/access/roles'
import { nextQuestionNumber } from '@/utilities/questionNumber'
import { createdByField } from '@/fields/createdBy'
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

import { revalidateQuiz, revalidateQuizDelete } from './hooks/revalidatePage' // (Or wherever your hook file is located)
import { InstaReelsBlock } from './Blocks/InstaReelsSlider/config'

export const Questions: CollectionConfig<'questions'> = {
  slug: 'questions',
  // WordPress roles: editors and up - any question; authors - their own; contributors - their own
  // drafts only (no Publish button for them). Players read published questions.
  access: {
    create: createContent,
    delete: deleteContent,
    read: authenticatedOrPublished,
    update: updateContent,
  },
  defaultPopulate: {
    title: true,
    slug: true,
  },
  defaultSort: 'order',
  admin: {
    hidden: hiddenUnless(WRITERS),
    defaultColumns: ['title', 'useIn', 'quiz', '_status', 'updatedAt'],
    components: {
      edit: {
        PublishButton: '@/components/admin/RolePublishButton#RolePublishButton',
        beforeDocumentControls: ['@/components/admin/DuplicateButton#DuplicateButton'],
      },
    },
    // No preview: questions have no public page of their own
    useAsTitle: 'title',
  },
  fields: [
    createdByField(),
    {
      name: 'title',
      type: 'text',
      required: true,
      hooks: { beforeDuplicate: [({ value }) => (value ? `${value} (copy)` : value)] },
    },
    {
      name: 'useIn',
      type: 'select',
      label: 'Use in',
      required: true,
      defaultValue: 'general',
      index: true,
      options: [
        { label: 'General (Q1, Q2 ...)', value: 'general' },
        { label: 'Sponsored (sponsored slot)', value: 'sponsored' },
        { label: 'Both', value: 'both' },
        { label: 'Not in play', value: 'none' },
      ],
      admin: {
        position: 'sidebar',
        description:
          'Which slots of the Round layout this question can fill. Published questions of the live quiz are in play straight away; "Not in play" keeps one out without unpublishing it.',
      },
    },
    // --- TAB 1: CONTENT & GAME BASICS ---
    {
      type: 'collapsible',
      label: 'Question',
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
          admin: { hidden: true }, // the game never shows it
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
                    InstaReelsBlock,
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
              // New questions go to the live quiz
              defaultValue: async ({ req }: any) => {
                try {
                  const live = await req.payload.find({
                    collection: 'quizzes',
                    where: { status: { equals: 'active' } },
                    sort: 'quizDate',
                    limit: 1,
                    depth: 0,
                    overrideAccess: true,
                  })
                  return live.docs[0]?.id ?? undefined
                } catch {
                  return undefined
                }
              },
              admin: { width: '50%' },
            },
            {
              name: 'questionNumber',
              type: 'number',
              required: true,
              // A copy gets the next free number
              hooks: {
                beforeDuplicate: [
                  async ({ req }: any) => nextQuestionNumber(req.payload),
                ],
              },
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
              label: 'Topic',
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
      type: 'collapsible',
      label: 'Answer options',
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
              // Stored as the option's position (Option A = 0); editors pick the answer by its
              // text in the admin, so it can't be entered counting from 1 by mistake.
              name: 'correctOptionIndex',
              type: 'number',
              required: true,
              label: 'Correct answer',
              admin: {
                components: { Field: '@/components/admin/CorrectOptionField#CorrectOptionField' },
              },
              validate: ((value: unknown, { siblingData }: { siblingData?: any }) => {
                const count = Array.isArray(siblingData?.options) ? siblingData.options.length : 0
                if (value === null || value === undefined || value === '')
                  return 'Choose the correct answer'
                const n = Number(value)
                if (!Number.isInteger(n) || n < 0 || n >= count)
                  return `Choose one of the ${count} options as the correct answer`
                return true
              }) as any,
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
      type: 'collapsible',
      label: 'Points & explanation',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'timeLimit',
              type: 'number',
              defaultValue: 60,
              label: 'Time (Seconds)',
              // Not used: the time comes from Quiz Settings (per game type) + the slot's extra time
              admin: { width: '25%', hidden: true },
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
              admin: { width: '25%', hidden: true }, // not shown to players
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
      type: 'group',
      label: 'SEO',
      // Questions have no public page: kept only so the data stays
      admin: { hidden: true },
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
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        hidden: true,
      },
    },

    {
      name: 'order',
      type: 'number',
      label: 'Display Order / Priority',
      defaultValue: 10,
      // Not used since questions are picked at random per player
      admin: { position: 'sidebar', hidden: true },
    },
    // Questions have no public page: the slug is kept only so the data stays
    ...slugField().map((f: any) => ({
      ...f,
      admin: { ...(f.admin || {}), hidden: true },
      ...(f.name === 'slug'
        ? {
            hooks: {
              ...(f.hooks || {}),
              beforeDuplicate: [({ value }: any) => (value ? `${value}-copy-${Date.now().toString(36)}` : value)],
            },
          }
        : {}),
    })),
  ],
  hooks: {
    afterChange: [revalidateQuiz],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateQuizDelete],
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
