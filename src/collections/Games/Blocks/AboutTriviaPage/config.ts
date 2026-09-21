import { Block } from 'payload'

export const AboutTriviaBlock: Block = {
  slug: 'AboutTriviaBlock',
  labels: {
    singular: 'About Trivia Section',
    plural: 'About Trivia Sections',
  },
  admin: {
    group: 'Common Blocks',
  },
  fields: [
    {
      name: 'mainTitle',
      type: 'text',
      label: 'Main Heading Title',
      defaultValue: 'Ready to Play',
    },
    {
      name: 'highlightText',
      type: 'text',
      label: 'Highlighted Word',
      defaultValue: 'Trivia?',
    },
    {
      name: 'subDescription',
      type: 'text',
      label: 'Sub Description',
      defaultValue: 'Join the Chennai Trivia community.',
    },
    {
      name: 'centerImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Center Featured Image',
      required: true,
    },
    // Left Side Cards (2 Cards)
    {
      name: 'leftCards',
      type: 'array',
      label: 'Left Side Feature Cards',
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
          name: 'iconType',
          type: 'select',
          label: 'Icon Choice',
          defaultValue: 'list',
          options: [
            { label: 'List Icon (Daily Trivia)', value: 'list' },
            { label: 'Star Icon (Earn Points)', value: 'star' },
          ],
        },
      ],
    },
    // Right Side Cards (2 Cards)
    {
      name: 'rightCards',
      type: 'array',
      label: 'Right Side Feature Cards',
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
          name: 'iconType',
          type: 'select',
          label: 'Icon Choice',
          defaultValue: 'fire',
          options: [
            { label: 'Fire Icon (Build Streak)', value: 'fire' },
            { label: 'Bar Chart Icon (Climb Leaderboard)', value: 'chart' },
          ],
        },
      ],
    },
    // Bottom Action Buttons
    {
      name: 'signUpText',
      type: 'text',
      label: 'Sign Up Button Text',
      defaultValue: 'Sign Up',
    },
    {
      name: 'signUpUrl',
      type: 'text',
      label: 'Sign Up Button URL',
      defaultValue: '/signup',
    },
    {
      name: 'loginText',
      type: 'text',
      label: 'Login Button Text',
      defaultValue: 'Login',
    },
    {
      name: 'loginUrl',
      type: 'text',
      label: 'Login Button URL',
      defaultValue: '/login',
    },
  ],
}
