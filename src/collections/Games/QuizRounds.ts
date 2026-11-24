import type { CollectionConfig } from 'payload'
import { ADMINS, allow, hiddenUnless } from '@/access/roles'

// One row per player, per day, per round: the questions that player was given.
// Written only by the quiz APIs (overrideAccess); read-only for admins.
export const QuizRounds: CollectionConfig = {
  slug: 'quiz-rounds',
  labels: { singular: 'Quiz Round', plural: 'Quiz Rounds' },
  admin: {
    useAsTitle: 'day',
    // Search box: player name, phone or game day (e.g. 2026-11-23)
    listSearchableFields: ['user.name', 'user.phone', 'day'],
    defaultColumns: ['user', 'quiz', 'day', 'round', 'status', 'score', 'completedAt'],
    hidden: hiddenUnless(ADMINS),
    description: 'Questions given to each player per game day and round. Read-only here (written only by the game). Search: player name, phone or game day (e.g. 2026-11-23).',
    components: { beforeListTable: ['@/components/admin/SiteStatus#SiteStatus', '@/components/admin/ScoreExport#ScoreExport'] },
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
        { name: 'recycled', type: 'number', defaultValue: 0, admin: { description: 'Questions reused because the pool ran out (only rounds before 23 Nov 2026 - questions are no longer repeated)' } },
      ],
    },
  ],
}
