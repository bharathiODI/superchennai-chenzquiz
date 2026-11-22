import type { CollectionConfig } from 'payload'
import { revalidateQuiz, revalidateQuizDelete } from './hooks/revalidatePage'
import { isAdmin, isAdminAdminAccess } from '@/access/isAdmin'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { isNotAdmin } from '@/access/checkRole'
import { SEOFieldSchema } from '@/fields/seo'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

const formatSlug = (val: string): string =>
  val
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

export const Quizzes: CollectionConfig = {
  slug: 'quizzes',
  admin: {
    useAsTitle: 'quizTitle',
    defaultColumns: ['quizTitle', 'slug', 'quizDate', 'status'],
    hidden: isNotAdmin,
  },
  access: {
    // read: () => true,
    admin: isAdminAdminAccess,
    create: isAdmin,
    delete: isAdmin,
    read: authenticatedOrPublished,
    update: isAdmin,
  },
  fields: [
    {
      name: 'quizTitle',
      type: 'text',
      required: true,
      label: 'Quiz Title',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Auto-generated unique URL slug',
      },
      hooks: {
        beforeValidate: [
          ({ value, siblingData }) => {
            if (typeof value === 'string' && value.length > 0) {
              return formatSlug(value)
            }
            if (siblingData?.quizTitle) {
              return formatSlug(siblingData.quizTitle)
            }
            return value
          },
        ],
      },
    },
    {
      name: 'quizDate',
      type: 'date',
      required: true,
      label: 'Quiz Start Date & Time',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
          timeIntervals: 15,
        },
      },
    },
    {
      name: 'quizEndDate',
      type: 'date',
      required: true,
      label: 'Quiz End Date & Time',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
          timeIntervals: 15,
        },
        description: 'Set when this quiz should automatically conclude',
      },
    },
    {
      name: 'questions',
      type: 'relationship',
      relationTo: 'questions',
      hasMany: true,
      required: true,
      label: 'Question Pool',
      admin: {
        description:
          'All questions for this challenge. Each round gives a player the next questions they have not answered yet, in Question Number order (or shuffled, if "Shuffle questions" is ticked below).',
      },
    },
    {
      type: 'collapsible',
      label: 'Daily Rounds & Sponsored Questions',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'roundsPerDay',
              type: 'number',
              label: 'Rounds per day',
              defaultValue: 3,
              min: 1,
              max: 10,
              admin: { width: '33%' },
            },
            {
              name: 'questionsPerRound',
              type: 'number',
              label: 'Questions per round',
              defaultValue: 3,
              min: 1,
              max: 20,
              admin: { width: '33%' },
            },
            {
              name: 'sponsoredPosition',
              type: 'number',
              label: 'Sponsored question slot',
              defaultValue: 3,
              min: 0,
              max: 20,
              admin: {
                width: '33%',
                description: 'Which question in each round is sponsored (3 = third). 0 = no sponsored slot.',
              },
            },
          ],
        },
        {
          name: 'shuffleQuestions',
          type: 'checkbox',
          label: 'Shuffle questions for each player',
          defaultValue: false,
          admin: {
            description:
              'Off: every player gets the questions in Question Number order (then Display Order). On: each player gets them in a random order. The sponsored question always keeps its slot.',
          },
        },
        {
          name: 'sponsoredQuestions',
          type: 'array',
          label: 'Sponsored question schedule',
          admin: {
            description:
              'Sponsored question per day (same for every player). Leave "Round" empty to use it in all rounds that day. Days without one get a regular question in that slot. Sponsored questions are never served as regular questions.',
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'date',
                  type: 'date',
                  required: true,
                  admin: { width: '30%', date: { pickerAppearance: 'dayOnly', displayFormat: 'dd MMM yyyy' } },
                },
                {
                  name: 'round',
                  type: 'number',
                  min: 1,
                  max: 10,
                  admin: { width: '20%', placeholder: 'All rounds' },
                },
                {
                  name: 'question',
                  type: 'relationship',
                  relationTo: 'questions',
                  required: true,
                  admin: { width: '50%' },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Scheduled / Active', value: 'active' },
        { label: 'Completed', value: 'completed' },
      ],
      defaultValue: 'draft',
    },
    {
      name: 'meta',
      type: 'group',
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
            description: 'Paste valid JSON-LD schema for this quiz',
          },
        }, 
      ],
    },
  ],

  hooks: {
    afterChange: [revalidateQuiz],
    afterDelete: [revalidateQuizDelete],
  },
}
