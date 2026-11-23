import { isNotAdmin } from '@/access/checkRole'
import type { CollectionConfig } from 'payload'

export const QuizAttempts: CollectionConfig = {
  slug: 'quiz-attempts',
  admin: {
    useAsTitle: 'id',
    // Search box: player name or phone (searching by record id broke on phone numbers)
    listSearchableFields: ['user.name', 'user.phone'],
    defaultColumns: ['user', 'quiz', 'score', 'correctAnswers', 'timeTaken', 'round', 'completedAt'],
    description: 'One entry per finished round. Read-only here (written only by the game). Search: player name or phone.',
     hidden: isNotAdmin,
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false

      const userRole = (user as any)?.role
      if (Array.isArray(userRole) ? userRole.includes('admin') : userRole === 'admin') {
        return true
      }

      return {
        user: {
          equals: user.id,
        },
      }
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
