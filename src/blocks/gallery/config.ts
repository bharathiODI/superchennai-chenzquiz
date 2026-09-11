import type { Block } from 'payload'

export const GalleryBlock: Block = {
  slug: 'galleryBlock',

  fields: [
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
    },
  ],
}