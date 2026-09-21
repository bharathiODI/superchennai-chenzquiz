// src/collections/QuizAttempts.ts
import type { CollectionConfig } from 'payload'

export const QuizAttempts: CollectionConfig = {
  slug: 'quiz-attempts',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['user', 'quiz', 'score', 'completedAt'],
  },
  access: {
    // Users can only view their own attempts, Admins see all
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.roles?.includes('admin')) return true
      return {
        user: {
          equals: user.id,
        },
      }
    },
    // Only system or logged in user can record their attempt
    create: ({ req: { user } }) => Boolean(user),
    // Prevent modifying completed attempt scores on client
    update: ({ req: { user } }) => user?.roles?.includes('admin') || false,
    delete: ({ req: { user } }) => user?.roles?.includes('admin') || false,
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
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
    },
    {
      name: 'totalQuestions',
      type: 'number',
      required: true,
    },
    {
      name: 'correctAnswers',
      type: 'number',
      required: true,
    },
    {
      name: 'timeTaken', // In seconds (e.g., 147 = 02:27)
      type: 'number',
      required: true,
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