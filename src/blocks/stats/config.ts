import type { Block } from 'payload'

export const StatsBlock: Block = {
  slug: 'statsBlock',

  fields: [
    {
      name: 'stats',
      type: 'array',
      fields: [
        {
          name: 'number',
          type: 'text',
        },
        {
          name: 'label',
          type: 'text',
        },
      ],
    },
  ],
}