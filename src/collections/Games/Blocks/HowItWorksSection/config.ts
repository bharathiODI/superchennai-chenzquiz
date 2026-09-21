import { Block } from 'payload'

export const HowItWorksBlock: Block = {
  slug: 'HowItWorksBlock',
  labels: {
    singular: 'How It Works Section',
    plural: 'How It Works Sections',
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
      label: 'Main Heading Title',
      defaultValue: 'How It',
    },
    {
      name: 'highlightText',
      type: 'text',
      label: 'Highlight Title Word',
      defaultValue: 'Works',
    },
    {
      name: 'subDescription',
      type: 'text',
      label: 'Sub Description',
      defaultValue: 'Four simple steps to play, learn and celebrate Chennai.',
    },
    {
      name: 'steps',
      type: 'array',
      label: 'Step Cards',
      minRows: 4,
      maxRows: 4,
      fields: [
        {
          name: 'stepNumber',
          type: 'text',
          label: 'Step Number (e.g. 01)',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          label: 'Step Title',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Step Description',
          required: true,
        },
        {
          name: 'iconType',
          type: 'select',
          label: 'Icon Type',
          defaultValue: 'userPlus',
          options: [
            { label: 'Sign Up (User Plus)', value: 'userPlus' },
            { label: 'Play Quiz (List with Cursor)', value: 'quiz' },
            { label: 'Earn Points (Trophy)', value: 'trophy' },
            { label: 'Win & Be Champ (Gift Box)', value: 'gift' },
          ],
        },
      ],
    },
  ],
}
