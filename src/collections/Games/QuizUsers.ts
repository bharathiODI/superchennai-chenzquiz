import { isNotAdmin } from '@/access/checkRole'
import type { CollectionConfig } from 'payload'

export const QuizUsers: CollectionConfig = {
  slug: 'quiz-users',

  auth: {
    disableLocalStrategy: true,
    tokenExpiration: 2592000,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'totalXP', 'createdAt'],
     hidden: isNotAdmin,
  },
  access: {
    create: () => true,
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    // delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      required: false,
    },
    {
      name: 'email',
      type: 'text',
      required: false,
      admin: {
        placeholder: 'example@domain.com',
      },
    },
    {
      name: 'message',
      type: 'textarea',
      required: false,
      admin: {
        placeholder: 'Enter optional message or note',
      },
    },
    {
      name: 'totalXP',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Total XP earned by playing daily quizzes',
      },
    },
    {
      name: 'totalTimeTaken', 
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Total time taken in seconds across all quizzes',
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
