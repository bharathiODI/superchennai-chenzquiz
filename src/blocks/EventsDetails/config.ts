import type { Block } from 'payload'

export const EventDetailsBlock: Block = {
  slug: 'eventDetailsBlock',

  labels: {
    singular: 'Events Details',
    plural: 'Events Details',
  },

  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Events Details',
    },
    {
      name: 'description',
      type: 'textarea',
    },
  ],
}
