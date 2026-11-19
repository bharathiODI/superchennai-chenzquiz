import type { Block, Field } from 'payload'

const hexColor = (value: any) =>
  !value || /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(String(value).trim()) || 'Use a hex colour like #F0157D'

const colorField = (name: string, label: string, defaultValue: string): Field => ({
  name,
  type: 'text',
  label,
  defaultValue,
  validate: hexColor,
  admin: { width: '50%', description: `Hex colour, e.g. ${defaultValue}` },
})

export const QuizRewardsBlock: Block = {
  slug: 'QuizRewardsBlock',
  labels: {
    singular: 'Quiz Rewards Section',
    plural: 'Quiz Rewards Sections',
  },
  admin: {
    group: 'Common Blocks',
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'eyebrow', type: 'text', label: 'Small heading', defaultValue: 'CHENZ QUIZ' },
        { name: 'title', type: 'text', label: 'Title', defaultValue: 'Ready to Play Chenz Quiz?' },
        { name: 'subtitle', type: 'text', label: 'Subtitle', defaultValue: 'Think You Know Chennai?' },
      ],
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Section background (optional)',
      admin: { description: 'Leave empty to use the default Chennai skyline background.' },
    },
    {
      name: 'challengeCard',
      type: 'group',
      label: 'Left card - Daily challenge',
      fields: [
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          label: 'Icon image (optional)',
        },
        { name: 'title', type: 'text', defaultValue: 'Ready to Take the Challenge?' },
        {
          name: 'description',
          type: 'textarea',
          defaultValue:
            'Play the daily Chennai quiz, answer three questions and earn points. Build your score, maintain your streak and climb the leaderboard.',
        },
        {
          type: 'row',
          fields: [
            { name: 'scheduleLabel', type: 'text', label: 'Schedule label', defaultValue: 'Daily Quiz' },
            { name: 'scheduleTime', type: 'text', label: 'Schedule time', defaultValue: '7:00 AM - 11:00 PM' },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'buttonText', type: 'text', defaultValue: "Play Today's Quiz" },
            { name: 'buttonUrl', type: 'text', defaultValue: '/quizzes' },
          ],
        },
        {
          type: 'row',
          fields: [
            colorField('bgColor', 'Card background colour', '#FFE8F3'),
            colorField('accentColor', 'Button / accent colour', '#F0157D'),
          ],
        },
      ],
    },
    {
      name: 'rewardCard',
      type: 'group',
      label: 'Right card - Rewards',
      fields: [
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          label: 'Icon image (optional)',
        },
        { name: 'title', type: 'text', defaultValue: 'Your Knowledge Deserves Rewards!' },
        {
          name: 'description',
          type: 'textarea',
          defaultValue: 'Compete with fellow Chennai lovers and stand a chance to win a',
        },
        {
          name: 'voucherImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Voucher image',
          admin: {
            description:
              'Upload the voucher artwork (e.g. Rs.300 Daily Winner Voucher). If empty, the amount and label below are shown instead.',
          },
        },
        {
          type: 'row',
          fields: [
            { name: 'voucherAmount', type: 'text', label: 'Voucher amount', defaultValue: '₹300' },
            { name: 'voucherLabel', type: 'text', label: 'Voucher label', defaultValue: 'Daily Winner Voucher' },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'buttonText', type: 'text', defaultValue: 'View Leaderboard' },
            { name: 'buttonUrl', type: 'text', defaultValue: '/leaderboard' },
          ],
        },
        {
          type: 'row',
          fields: [
            colorField('bgColor', 'Card background colour', '#EFE9FF'),
            colorField('accentColor', 'Button / accent colour', '#5B21F5'),
          ],
        },
      ],
    },
  ],
}
