import type { CollectionConfig } from 'payload'

export const QuizAttempts: CollectionConfig = {
  slug: 'quiz-attempts',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['user', 'quiz', 'score', 'completedAt'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return true

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
    create: () => true,
    update: ({ req: { user } }) => {
      const userRole = (user as any)?.role
      return Array.isArray(userRole) ? userRole.includes('admin') : userRole === 'admin'
    },
    delete: ({ req: { user } }) => {
      const userRole = (user as any)?.role
      return Array.isArray(userRole) ? userRole.includes('admin') : userRole === 'admin'
    },
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
