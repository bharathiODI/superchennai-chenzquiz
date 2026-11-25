import { ADMINS, hiddenUnless, userHas } from '@/access/roles'
import type { CollectionConfig } from 'payload'

export const QuizAttempts: CollectionConfig = {
  slug: 'quiz-attempts',
  labels: { singular: 'Finished play', plural: 'Finished plays' },
  disableDuplicate: true, // player data is never copied
  admin: {
    useAsTitle: 'id',
    // Search box: player name or phone (searching by record id broke on phone numbers)
    listSearchableFields: ['user.name', 'user.phone'],
    defaultColumns: ['user', 'quiz', 'score', 'correctAnswers', 'timeTaken', 'round', 'completedAt'],
    description: 'One summary row per finished play (score, correct answers, time), written together with the play. The leaderboard and reports read it. Read-only here. Search: player name or phone.',
    hidden: hiddenUnless(ADMINS),
    components: { beforeListTable: ['@/components/admin/ListExport#ListExport'] },
  },
  access: {
    // CMS admins: all. A player: their own. Other CMS roles: none (a CMS user's id is not a player id).
    read: ({ req: { user } }) => {
      if (userHas(user, ADMINS)) return true
      if ((user as any)?.collection === 'quiz-users') return { user: { equals: user!.id } }
      return false
    },
    // Read-only in the CMS: scores and players are written only by the game itself, so nobody can
    // change them by mistake here. (Server code uses overrideAccess and is not affected.)
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'quiz-users',
      required: true,
      index: true,
    },
    {
      name: 'quiz',
      type: 'relationship',
      relationTo: 'quizzes',
      required: true,
    },
    {
      name: 'score',
      type: 'number',
      required: true,
      defaultValue: 0,
    },
    {
      name: 'totalQuestions',
      type: 'number',
      required: true,
      defaultValue: 0,
    },
    {
      name: 'correctAnswers',
      type: 'number',
      required: true,
      defaultValue: 0,
    },
    {
      name: 'timeTaken',
      type: 'number',
      required: true,
      defaultValue: 0,
    },
    {
      name: 'completedAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date(),
    },
    {
      name: 'rankAtCompletion',
      type: 'number',
    },
    {
      name: 'round',
      type: 'number',
      admin: { description: 'Round of the day (1, 2, 3...)' },
    },
  ],
}
// import type { CollectionConfig } from 'payload'

// export const QuizAttempts: CollectionConfig = {
//   slug: 'quiz-attempts',
//   admin: {
//     useAsTitle: 'id',
//     defaultColumns: ['user', 'quiz', 'score', 'completedAt'],
//   },
//   access: {
//     read: ({ req: { user } }) => {
//       if (!user) return true // Profile page fetch and client view match
//       if (user.role?.includes('admin')) return true
//       return {
//         user: {
//           equals: user.id,
//         },
//       }
//     },
//     create: () => true, // Allow API route & authenticated users to log attempts
//     update: ({ req: { user } }) => Boolean(user?.role?.includes('admin')),
//     delete: ({ req: { user } }) => Boolean(user?.role?.includes('admin')),
//   },
//   fields: [
//     {
//       name: 'user',
//       type: 'relationship',
//       relationTo: 'quiz-users', // Corrected to match your user collection 'quiz-users'
//       required: true,
//       index: true,
//     },
//     {
//       name: 'quiz',
//       type: 'relationship',
//       relationTo: 'quizzes',
//       required: true,
//     },
//     {
//       name: 'score',
//       type: 'number',
//       required: true,
//       defaultValue: 0,
//     },
//     {
//       name: 'totalQuestions',
//       type: 'number',
//       required: true,
//       defaultValue: 0,
//     },
//     {
//       name: 'correctAnswers',
//       type: 'number',
//       required: true,
//       defaultValue: 0,
//     },
//     {
//       name: 'timeTaken',
//       type: 'number',
//       required: true,
//       defaultValue: 0,
//     },
//     {
//       name: 'completedAt',
//       type: 'date',
//       required: true,
//       defaultValue: () => new Date(),
//     },
//     {
//       name: 'rankAtCompletion',
//       type: 'number',
//     },
//   ],
// }
