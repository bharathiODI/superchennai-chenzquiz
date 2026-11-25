import type { CollectionConfig } from 'payload'
import { ADMINS, allow, hiddenUnless } from '@/access/roles'

// One row per question a player answered (lean setup, Nov 2026): what they picked, whether it was
// right, and how long it took by the server clock. Written only by the game (overrideAccess).
export const QuizAnswers: CollectionConfig = {
  slug: 'quiz-answers',
  disableDuplicate: true, // player data is never copied
  labels: { singular: 'Answer', plural: 'Answers' },
  admin: {
    useAsTitle: 'answer',
    listSearchableFields: ['user.name', 'user.phone', 'answer'],
    defaultColumns: ['user', 'question', 'position', 'answer', 'correct', 'points', 'seconds', 'answeredAt'],
    hidden: hiddenUnless(ADMINS),
    description:
      'Every answer, one row per question. Read-only here (written only by the game). Search: player name, phone or answer.',
    components: {
      beforeListTable: ['@/components/admin/ListExport#ListExport'],
    },
  },
  access: {
    read: allow(ADMINS),
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  indexes: [{ fields: ['round', 'position'], unique: true }],
  fields: [
    { name: 'user', type: 'relationship', relationTo: 'quiz-users', required: true, index: true },
    { name: 'quiz', type: 'relationship', relationTo: 'quizzes', required: true, index: true },
    { name: 'round', type: 'relationship', relationTo: 'quiz-rounds', required: true, index: true },
    { name: 'question', type: 'relationship', relationTo: 'questions', required: true, index: true },
    {
      type: 'row',
      fields: [
        { name: 'position', type: 'number', required: true, admin: { width: '20%', description: '1 = Q1' } },
        { name: 'answer', type: 'text', admin: { width: '40%' } },
        { name: 'correct', type: 'checkbox', admin: { width: '20%' } },
        { name: 'timedOut', type: 'checkbox', label: 'Timed out', admin: { width: '20%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'points', type: 'number', admin: { width: '20%' } },
        { name: 'speedBonus', type: 'number', admin: { width: '20%' } },
        { name: 'seconds', type: 'number', admin: { width: '20%', description: 'Server clock' } },
        { name: 'sponsored', type: 'checkbox', admin: { width: '20%', description: 'Answered in a sponsored slot' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'servedAt', type: 'date', admin: { width: '50%', date: { pickerAppearance: 'dayAndTime' } } },
        { name: 'answeredAt', type: 'date', index: true, admin: { width: '50%', date: { pickerAppearance: 'dayAndTime' } } },
      ],
    },
  ],
}
