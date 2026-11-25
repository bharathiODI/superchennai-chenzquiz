import type { CollectionBeforeValidateHook, CollectionConfig } from 'payload'
import { ValidationError } from 'payload'
import { DEFAULT_ROUND_LAYOUT } from '@/utilities/roundLayout'
import { revalidateQuiz, revalidateQuizDelete } from './hooks/revalidatePage'
import { EDITORS, allow, hiddenUnless } from '@/access/roles'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
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

/** Lean setup: one live quiz at a time, so players can never be split across two quizzes again. */
const onlyOneLiveQuiz: CollectionBeforeValidateHook = async ({ data, originalDoc, req }) => {
  const merged = { ...(originalDoc || {}), ...(data || {}) }
  if (merged.status !== 'active') return data
  const from = merged.quizDate ? new Date(merged.quizDate).getTime() : -Infinity
  const to = merged.quizEndDate ? new Date(merged.quizEndDate).getTime() : Infinity
  const others = await req.payload.find({
    collection: 'quizzes',
    where: {
      and: [{ status: { equals: 'active' } }, ...(originalDoc?.id ? [{ id: { not_equals: originalDoc.id } }] : [])],
    },
    depth: 0,
    pagination: false,
    overrideAccess: true,
    req,
  })
  const clash = (others.docs as any[]).find((q) => {
    const a = q.quizDate ? new Date(q.quizDate).getTime() : -Infinity
    const b = q.quizEndDate ? new Date(q.quizEndDate).getTime() : Infinity
    return a <= to && from <= b
  })
  if (clash) {
    throw new ValidationError({
      collection: 'quizzes',
      errors: [
        {
          path: 'status',
          message: `"${clash.quizTitle}" is already Scheduled / Active in these dates. Only one quiz can be live at a time: set "${clash.quizTitle}" to Completed first, or change the dates.`,
        },
      ],
    })
  }
  return data
}

export const Quizzes: CollectionConfig = {
  slug: 'quizzes',
  admin: {
    useAsTitle: 'quizTitle',
    defaultColumns: ['quizTitle', 'slug', 'quizDate', 'status'],
    hidden: hiddenUnless(EDITORS),
  },
  // Question pool and sponsor schedule: editors and up (WordPress roles).
  access: {
    create: allow(EDITORS),
    delete: allow(EDITORS),
    read: authenticatedOrPublished,
    update: allow(EDITORS),
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
      label: 'Question Pool (old)',
      // Lean setup (Nov 2026): the pool is every published question whose Quiz is this quiz.
      // Kept only so the data stays; not shown or used.
      admin: { hidden: true },
    },
    {
      name: 'roundLayout',
      type: 'array',
      label: 'Round layout',
      labels: { singular: 'Slot', plural: 'Slots' },
      minRows: 1,
      maxRows: 10,
      defaultValue: DEFAULT_ROUND_LAYOUT,
      admin: {
        description:
          'One row per question a player gets each day, in order (Q1, Q2, ...). General slots take questions marked General or Both; Sponsored slots take Sponsored or Both. Each player gets random questions they have never had. Changes apply from the next game day.',
        components: { RowLabel: '@/components/admin/SlotRowLabel#SlotRowLabel' },
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'source',
              type: 'select',
              label: 'Questions from',
              required: true,
              defaultValue: 'general',
              options: [
                { label: 'General', value: 'general' },
                { label: 'Sponsored', value: 'sponsored' },
              ],
              admin: { width: '25%' },
            },
            {
              name: 'extraSeconds',
              type: 'number',
              label: 'Extra time (seconds)',
              defaultValue: 0,
              min: 0,
              max: 120,
              admin: { width: '25%', description: 'Added to the normal time for this question.' },
            },
            {
              name: 'points',
              type: 'select',
              label: 'Points',
              required: true,
              defaultValue: 'normal',
              options: [
                { label: 'Normal', value: 'normal' },
                { label: 'Fixed', value: 'fixed' },
              ],
              admin: { width: '25%', description: 'Normal = points + speed bonus. Fixed = no speed bonus.' },
            },
            {
              name: 'fixedPoints',
              type: 'number',
              label: 'Fixed points',
              min: 0,
              admin: {
                width: '25%',
                condition: (_, row) => row?.points === 'fixed',
                description: "Empty = the question's own points.",
              },
            },
          ],
        },
        {
          type: 'row',
          admin: { condition: (_, row) => row?.source === 'sponsored' },
          fields: [
            { name: 'sponsorName', type: 'text', label: 'Sponsor name', admin: { width: '30%', placeholder: 'DRA Homes' } },
            {
              name: 'sponsorLine',
              type: 'text',
              label: 'Badge line',
              admin: { width: '40%', placeholder: 'Extra 10 seconds on this question, courtesy of DRA Homes' },
            },
            { name: 'sponsorLogo', type: 'upload', relationTo: 'media', label: 'Sponsor logo', admin: { width: '30%' } },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Daily Rounds & Sponsored Questions (old)',
      // Replaced by the Round layout. Kept only so the data stays; not shown or used.
      admin: { condition: () => false },
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
      admin: {
        description:
          'Only one quiz can be Scheduled / Active in the same dates. Set the other one to Completed first.',
      },
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
    beforeValidate: [onlyOneLiveQuiz],
    afterChange: [revalidateQuiz],
    afterDelete: [revalidateQuizDelete],
  },
}
