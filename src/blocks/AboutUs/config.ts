import type { Block } from 'payload'

export const AboutUsBlock: Block = {
  slug: 'aboutUs',
  labels: {
    singular: 'About Us',
    plural: 'About Us Sections',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Main Content',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'eyebrow',
                  type: 'text',
                  defaultValue: 'About Us',
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'title',
                  type: 'text',
                  defaultValue: 'chennai',
                  required: true,
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
              admin: {
                description: 'Primary paragraph text describing your section/brand.',
              },
            },
            {
              name: 'secondaryDescription',
              type: 'textarea',
              admin: {
                description: 'Optional additional paragraph text.',
              },
            },
            {
              name: 'highlightText',
              type: 'text',
              admin: {
                description: 'Highlighted text displayed with pink accent styling.',
              },
            },
          ],
        },
        {
          label: 'Media & Badge',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
              admin: {
                description: 'Upload the main About Us artwork/collage displayed on the right.',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'showLogo',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    width: '30%',
                  },
                },
                {
                  name: 'logo',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    width: '70%',
                    condition: (_, siblingData) => Boolean(siblingData?.showLogo),
                    description: 'Optional overlay logo or emblem.',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Call To Action',
          fields: [
            {
              name: 'cta',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'enabled',
                      type: 'checkbox',
                      defaultValue: true,
                      admin: {
                        width: '30%',
                      },
                    },
                    {
                      name: 'openInNewTab',
                      type: 'checkbox',
                      defaultValue: false,
                      admin: {
                        width: '30%',
                        condition: (_, siblingData) => Boolean(siblingData?.enabled),
                      },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      defaultValue: 'Explore More',
                      admin: {
                        width: '50%',
                        condition: (_, siblingData) => Boolean(siblingData?.enabled),
                      },
                    },
                    {
                      name: 'url',
                      type: 'text',
                      defaultValue: '#',
                      admin: {
                        width: '50%',
                        condition: (_, siblingData) => Boolean(siblingData?.enabled),
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}