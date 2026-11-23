import type { CollectionConfig } from 'payload'

export const UserSubmissions: CollectionConfig = {
  slug: 'user-submissions',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['user', 'quiz', 'score', 'createdAt'],
  },
  // Admin only over the REST API (players are logged in to the same API)
  access: {
    // Read-only in the CMS: scores and players are written only by the game itself, so nobody can
    // change them by mistake here. (Server code uses overrideAccess and is not affected.)
    create: () => false,
    read: ({ req: { user } }) => (user as any)?.collection === 'users' && (user as any)?.role === 'admin',
    update: () => false,
    delete: () => false,
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