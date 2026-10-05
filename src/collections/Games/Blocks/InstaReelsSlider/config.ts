import { Block } from 'payload'

export const InstaReelsBlock: Block = {
  slug: 'InstaReelsBlock',
  labels: {
    singular: 'Instagram Reels Slider Section',
    plural: 'Instagram Reels Slider Sections',
  },
  admin: {
    group: 'Common Blocks',
  },
  fields: [
    {
      name: 'topBadge',
      type: 'text',
      label: 'Top Badge / Subheading',
      defaultValue: 'INSTAGRAM REELS',
    },
    {
      name: 'mainHeading',
      type: 'text',
      label: 'Main Heading Text',
      defaultValue: 'Watch & Explore Our',
    },
    {
      name: 'highlightText',
      type: 'text',
      label: 'Highlighted Word',
      defaultValue: 'Reels',
    },
    {
      name: 'subDescription',
      type: 'text',
      label: 'Sub Description',
      defaultValue: 'Check out our latest trending Instagram reels and stories below!',
    },

    // Reels Repeater Array
    {
      name: 'reels',
      type: 'array',
      label: 'Reels List',
      minRows: 1,
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Reel Title / Caption',
          required: true,
        },
        {
          name: 'subtitle',
          type: 'text',
          label: 'Subtitle / Handle (e.g., @chenzquiz)',
          defaultValue: '@chenzquiz',
        },
        {
          name: 'thumbnail',
          type: 'upload',
          relationTo: 'media',
          label: 'Reel Thumbnail Cover Image (9:16 Aspect Ratio Preferred)',
          required: true,
        },
        {
          name: 'redirectUrl',
          type: 'text',
          label: 'Instagram Reel Target URL',
          required: true,
          defaultValue: 'https://instagram.com',
        },
      ],
    },
  ],
}