import type { Field } from 'payload'
import { linkGroup } from 'src/fields/linkGroup'

const isNotNone = (_: unknown, { siblingData }: any) => siblingData?.type !== 'none'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  label: false,
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'Defult',
      label: 'Type',
      required: true,
      options: [
        { label: 'None', value: 'none' },
        { label: 'Banner', value: 'Defult' },
      ],
      admin: {
        description: 'Choose the type of hero banner to display. Select "None" to hide the banner.',
      },
    },

    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      required: true,
      admin: {
        condition: isNotNone,
      },
    },
    {
      name: 'image',
      type: 'upload',
      label: 'Banner Image',
      relationTo: 'media',
      required: true,
      admin: {
        condition: isNotNone,
      },
    },

    {
      name: 'mobileImage',
      type: 'upload',
      label: 'Mobile Banner Image',
      relationTo: 'media',
      required: false,
      admin: {
        condition: isNotNone,
      },
    },
    {
      name: 'enableHero',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Enable or disable hero section for this page',
      },
    },

    linkGroup({
      overrides: {
        maxRows: 2,
        admin: {
          condition: isNotNone,
        },
      },
    }),
  ],
}
