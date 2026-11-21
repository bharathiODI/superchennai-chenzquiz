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
      label: 'Select Games/Questions for Today',
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
