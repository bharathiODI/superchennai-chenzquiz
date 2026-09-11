import type { Block } from 'payload'

export const MediaCarousel: Block = {
  slug: 'mediaCarousel',

  fields: [
    {
      name: 'title',
      type: 'text',
    },

    {
      name: 'slides',
      type: 'array',
      minRows: 1,

      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          defaultValue: 'image',
          options: [
            { label: 'Image', value: 'image' },
            { label: 'Video', value: 'video' },
          ],
        },

        // IMAGE
        {
          name: 'desktopImage',
          type: 'upload',
          relationTo: 'media',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'image',
          },
        },

        {
          name: 'mobileImage',
          type: 'upload',
          relationTo: 'media',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'image',
          },
        },

        // VIDEO
        {
          name: 'desktopVideo',
          type: 'upload',
          relationTo: 'media',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'video',
          },
        },

        {
          name: 'mobileVideo',
          type: 'upload',
          relationTo: 'media',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'video',
          },
        },

        {
          name: 'alt',
          type: 'text',
        },
      ],
    },
  ],
}