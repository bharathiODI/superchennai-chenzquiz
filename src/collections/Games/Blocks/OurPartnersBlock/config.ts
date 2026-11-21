import type { Block } from 'payload'

export const OurPartnersBlock: Block = {
  slug: 'ourPartners',
  interfaceName: 'OurPartnersBlockType',
  labels: {
    singular: 'Our Partners Section',
    plural: 'Our Partners Sections',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Section Heading',
      defaultValue: 'Our Proud Partners',
      required: true,
    },
    {
      name: 'scrollSpeed',
      type: 'number',
      label: 'Marquee Speed (in seconds)',
      defaultValue: 35,
      admin: {
        description: 'Lower value = faster scroll, Higher value = slower scroll',
      },
    },
    {
      name: 'partners',
      type: 'array',
      label: 'Partner Logos',
      minRows: 1,
      labels: {
        singular: 'Partner',
        plural: 'Partners',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Partner Name (Alt Text)',
          required: true,
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          label: 'Partner Logo',
          required: true,
        },
        {
          name: 'link',
          type: 'text',
          label: 'Partner Website URL (Optional)',
          admin: {
            placeholder: 'https://example.com',
          },
        },
      ],
    },
  ],
}