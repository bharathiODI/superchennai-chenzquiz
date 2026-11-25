import type { CollectionConfig } from 'payload'
import { ADMINS, allow, hiddenUnless } from '@/access/roles'

// One row per player, per day, per round: the questions that player was given.
// Written only by the quiz APIs (overrideAccess); read-only for admins.
export const QuizRounds: CollectionConfig = {
  slug: 'quiz-rounds',
  labels: { singular: 'Play', plural: 'Plays' },
  disableDuplicate: true,
  admin: {
    useAsTitle: 'day',
    // Search box: player name, phone or game day (e.g. 2026-11-23)
    listSearchableFields: ['user.name', 'user.phone', 'day'],
    defaultColumns: ['user', 'quiz', 'day', 'status', 'score', 'timeTaken', 'tooFast', 'linked', 'completedAt'],
    hidden: hiddenUnless(ADMINS),
    description: 'One play per player per game day: the questions they got, score, time (server clock) and flags. Read-only here (written only by the game). Search: player name, phone or game day (e.g. 2026-11-23).',
    components: {
      beforeListTable: ['@/components/admin/SiteStatus#SiteStatus', '@/components/admin/ScoreExport#ScoreExport', '@/components/admin/ListExport#ListExport'],
    },
  },
  access: {
    read: allow(ADMINS),
    // Read-only in the CMS: scores and players are written only by the game itself, so nobody can
    // change them by mistake here. (Server code uses overrideAccess and is not affected.)
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  indexes: [{ fields: ['user', 'quiz', 'day', 'round'], unique: true }],
  fields: [
    { name: 'user', type: 'relationship', relationTo: 'quiz-users', required: true, index: true },
    { name: 'quiz', type: 'relationship', relationTo: 'quizzes', required: true, index: true },
    {
      type: 'row',
      fields: [
        { name: 'day', type: 'text', required: true, index: true, admin: { description: 'India date (YYYY-MM-DD)' } },
        { name: 'round', type: 'number', required: true, min: 1 },
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'assigned',
          options: [
            { label: 'Assigned', value: 'assigned' },
            { label: 'Completed', value: 'completed' },
          ],
        },
      ],
    },
    { name: 'questions', type: 'relationship', relationTo: 'questions', hasMany: true },
    { name: 'sponsoredQuestion', type: 'relationship', relationTo: 'questions' },
    {
      type: 'row',
      fields: [
        { name: 'score', type: 'number' },
        { name: 'completedAt', type: 'date' },
        { name: 'recycled', type: 'number', defaultValue: 0, admin: { description: 'Questions repeated because the player had seen every question that fits the slot' } },
      ],
    },
    {
      type: 'collapsible',
      label: 'Play details',
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'position', type: 'number', defaultValue: 0, admin: { width: '25%', description: 'Questions answered so far' } },
            { name: 'servedAt', type: 'date', admin: { width: '25%', description: 'When the current question was shown' } },
            { name: 'timeTaken', type: 'number', admin: { width: '25%', description: 'Seconds, from the server clock' } },
            { name: 'correctAnswers', type: 'number', admin: { width: '25%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'tooFast', type: 'checkbox', label: 'Too fast', index: true, admin: { width: '25%' } },
            { name: 'linked', type: 'checkbox', label: 'Linked numbers', index: true, admin: { width: '25%', description: 'Another number played from the same phone' } },
            { name: 'deviceId', type: 'text', index: true, admin: { width: '25%' } },
            { name: 'ip', type: 'text', admin: { width: '25%' } },
          ],
        },
        {
          name: 'slots',
          type: 'json',
          admin: { description: 'The Round layout as it was when this round was created (one entry per question).' },
        },
      ],
    },
  ],
}
