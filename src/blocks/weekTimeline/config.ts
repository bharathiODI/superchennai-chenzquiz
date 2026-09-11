import type { Block } from 'payload'

export const WeekTimeline: Block = {
  slug: 'weekTimeline',

  fields: [
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'weeks',
      type: 'array',
      fields: [
        {
          name: 'weekTitle',
          type: 'text',
        },
        {
          name: 'description',
          type: 'textarea',
        },
      ],
    },
  ],
}