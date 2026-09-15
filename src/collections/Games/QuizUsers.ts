import type { CollectionConfig } from 'payload'

export const QuizUsers: CollectionConfig = {
  slug: 'quiz-users',
  auth: true, 
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'totalXP', 'createdAt'],
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
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}