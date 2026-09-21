
import type { CollectionConfig } from 'payload'

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
  },
  access: {
    read: () => true,
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
  ],
}
