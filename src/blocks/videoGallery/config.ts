import type { Block } from 'payload'

export const VideoGalleryBlock: Block = {
  slug: 'videoGalleryBlock',
  labels: {
    singular: 'Video Gallery',
    plural: 'Video Galleries',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Festival Moments',
    },
    {
      name: 'subHeading',
      type: 'text',
      defaultValue: 'Captured memories from Summer Fest',
    },
    {
      name: 'layoutStyle',
      type: 'select',
      defaultValue: 'masonry',
      options: [
        { label: 'Grid', value: 'grid' },
        { label: 'Masonry', value: 'masonry' },
        { label: 'Carousel', value: 'carousel' },
      ],
    },
    {
      name: 'backgroundImage',
      label: 'Background Image',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },

    {
      name: 'backgroundOverlay',
      label: 'Dark Overlay',
      type: 'checkbox',
      defaultValue: true,
    },

    {
      name: 'backgroundOpacity',
      label: 'Overlay Opacity',
      type: 'number',
      defaultValue: 40,
      min: 0,
      max: 100,
    },
    {
      name: 'autoPlay',
      type: 'checkbox',
      label: 'Enable Auto Play (Main Video)',
      defaultValue: true,
    },

    {
      name: 'videos',
      type: 'array',
      label: 'Gallery Items',
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'description',
          type: 'textarea',
        },

        // Content Type
        {
          name: 'type',
          type: 'select',
          defaultValue: 'video',
          options: [
            {
              label: 'Uploaded Video',
              value: 'video',
            },
            {
              label: 'YouTube Video',
              value: 'youtube',
            },
            {
              label: 'Image Link',
              value: 'image',
            },
          ],
        },

        // Thumbnail
        {
          name: 'thumbnail',
          type: 'upload',
          relationTo: 'media',
        },

        // Upload Video
        {
          name: 'video',
          type: 'upload',
          relationTo: 'media',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'video',
          },
        },

        // Youtube
        {
          name: 'youtubeUrl',
          type: 'text',
          label: 'YouTube URL',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'youtube',
          },
        },

        // Image
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'image',
          },
        },

        {
          name: 'href',
          type: 'text',
          label: 'Redirect URL',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'image',
          },
        },
      ],
    },
  ],
}
