import type { Block } from 'payload'

export const CTABlock: Block = {
  slug: 'ctaBlock',

  fields: [
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'buttonText',
      type: 'text',
    },
    {
      name: 'buttonLink',
      type: 'text',
    },
  ],
}