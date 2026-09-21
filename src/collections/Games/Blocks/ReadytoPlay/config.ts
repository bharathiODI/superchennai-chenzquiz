import { Block } from 'payload'

export const TriviaAuthBlock: Block = {
  slug: 'TriviaAuthBlock',
  labels: {
    singular: 'Trivia Auth Section',
    plural: 'Trivia Auth Sections',
  },
  admin: {
    group: 'Common Blocks',
  },
  fields: [
    {
      name: 'topSubtitle',
      type: 'text',
      label: 'Top Subtitle',
      defaultValue: 'CHENZ QUIZ',
    },
    {
      name: 'mainTitle',
      type: 'text',
      label: 'Main Title',
      defaultValue: 'Ready to Play',
    },
    {
      name: 'highlightText',
      type: 'text',
      label: 'Highlight Title Word',
      defaultValue: 'Trivia?',
    },
    {
      name: 'subDescription',
      type: 'text',
      label: 'Sub Description',
      defaultValue: 'Join the Chennai Trivia community.',
    },
    {
      name: 'cards',
      type: 'array',
      label: 'Auth Cards',
      minRows: 2,
      maxRows: 2,
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Card Title',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Card Description',
          required: true,
        },
        {
          name: 'buttonText',
          type: 'text',
          label: 'Button Text',
          required: true,
        },
        {
          name: 'buttonUrl',
          type: 'text',
          label: 'Button URL',
          required: true,
        },
        {
          name: 'cardBgColor',
          type: 'select',
          label: 'Background Tint',
          defaultValue: 'white',
          options: [
            { label: 'White Tint', value: 'white' },
            { label: 'Cream Tint', value: 'cream' },
          ],
        },
      ],
    },
  ],
}
