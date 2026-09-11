import type { Block } from 'payload'

export const VideoBlock: Block = {
  slug: 'videoBlock',
  interfaceName: 'VideoBlock',
  fields: [
    {
      name: 'source',
      type: 'select',
      required: true,
      options: [
        { label: 'YouTube', value: 'youtube' },
        { label: 'Instagram', value: 'instagram' },
        { label: 'Direct Video URL (mp4)', value: 'mp4' },
      ],
    },
    {
      name: 'url',
      type: 'text',
      required: true,
      label: 'Video URL',
      admin: {
        description: 'Paste YouTube / Instagram / mp4 URL',
      },
    },
    {
      name: 'autoplay',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      label: 'Thumbnail / Cover Image (Instagram only)',
      admin: {
        description: 'Optional: Add a cover image for Instagram posts',
      },
    },
  ],
}
