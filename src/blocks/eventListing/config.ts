import type { Block } from 'payload'

export const EventListing: Block = {
  slug: 'eventListing',

  labels: {
    singular: 'Event Listing',
    plural: 'Event Listings',
  },

  admin: {
    group: 'Events',
  },

  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      defaultValue: 'Upcoming Events',
    },

    {
      name: 'PastEventHeading',
      type: 'text',
      label: 'Past Events',
      defaultValue: 'Past Events',
    },

    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
    },

    {
      name: 'limit',
      type: 'number',
      label: 'Events Limit',
      defaultValue: 6,
      min: 1,
      max: 20,
    },

    {
      name: 'featuredOnly',
      type: 'checkbox',
      label: 'Show Only Featured Events',
      defaultValue: false,
    },

    {
      name: 'showViewAll',
      type: 'checkbox',
      label: 'Show View All Button',
      defaultValue: true,
    },

    {
      name: 'viewAllLink',
      type: 'text',
      label: 'View All Link',
      defaultValue: '/summer',
      admin: {
        condition: (_, siblingData) => siblingData?.showViewAll,
      },
    },
    
  ],
}
