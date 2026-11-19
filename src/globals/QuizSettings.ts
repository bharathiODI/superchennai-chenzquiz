import type { GlobalConfig } from 'payload'
import { isNotAdmin } from '@/access/checkRole'

export const QuizSettings: GlobalConfig = {
  slug: 'quiz-settings',
  label: 'Quiz Titles',
  access: {
    read: () => true,
  },
  admin: {
    hidden: isNotAdmin,
    description:
      'Player titles shown on the quiz result screen, leaderboard and profile, based on total XP.',
  },
  fields: [
    {
      name: 'titles',
      type: 'array',
      label: 'Player Titles',
      admin: {
        description:
          'A player gets the highest title whose "Min XP" is at or below their total XP. The first row should start at 0.',
      },
      defaultValue: [
        { name: 'Chennai Rookie', minXP: 0 },
        { name: 'Namma Chennai Expert', minXP: 50 },
        { name: 'Chennai Master', minXP: 150 },
      ],
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'name', type: 'text', label: 'Title', required: true },
            { name: 'minXP', type: 'number', label: 'Min XP', required: true, min: 0 },
          ],
        },
      ],
    },
  ],
}
