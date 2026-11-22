import type { CollectionConfig } from 'payload'

export const UserSubmissions: CollectionConfig = {
  slug: 'user-submissions',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['user', 'quiz', 'score', 'createdAt'],
  },
  // Admin only over the REST API (players are logged in to the same API)
  access: {
    create: ({ req: { user } }) => (user as any)?.collection === 'users' && (user as any)?.role === 'admin',
    read: ({ req: { user } }) => (user as any)?.collection === 'users' && (user as any)?.role === 'admin',
    update: ({ req: { user } }) => (user as any)?.collection === 'users' && (user as any)?.role === 'admin',
    delete: ({ req: { user } }) => (user as any)?.collection === 'users' && (user as any)?.role === 'admin',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'quiz-users',
      required: true,
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
    },
    {
      name: 'answers',
      type: 'json', 
    },
  ],
}