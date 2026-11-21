import type { Field, GlobalConfig } from 'payload'
import { isNotAdmin } from '@/access/checkRole'
import { GAME_TYPES } from '@/utilities/gameScoring'

const timerFields: Field[] = GAME_TYPES.map((g) => ({
  name: g.key,
  type: 'number',
  label: `${g.label} (seconds)`,
  defaultValue: g.defaultSeconds,
  min: 5,
  max: 600,
  admin: { width: '25%' },
}))

export const QuizSettings: GlobalConfig = {
  slug: 'quiz-settings',
  label: 'Quiz Settings',
  access: {
    read: () => true,
  },
  admin: {
    hidden: isNotAdmin,
    description: 'Player titles, per-game timers and the shareable scorecard.',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Player Titles',
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
        },
        {
          label: 'Game Timers & Scoring',
          description:
            'Time limit for each game type. A correct answer scores the question points plus a speed bonus of 5/4/3/2/1 by time left (for a 20s MCQ: 20-17s = 5, 16-14s = 4, 13-10s = 3, 9-5s = 2, 4-1s = 1, timeout = 0). Other limits use the same proportions.',
          fields: [
            {
              name: 'gameTimers',
              type: 'group',
              label: 'Time limit per game',
              fields: [
                { type: 'row', fields: timerFields.slice(0, 4) },
                { type: 'row', fields: timerFields.slice(4) },
              ],
            },
          ],
        },
        {
          label: 'Share Scorecard',
          description:
            'The image players share on WhatsApp and Instagram from the Quiz Completed screen. Empty fields use the built-in look.',
          fields: [
            {
              name: 'scorecard',
              type: 'group',
              label: 'Scorecard',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'logo',
                      type: 'upload',
                      relationTo: 'media',
                      label: 'Logo, top left',
                      admin: {
                        width: '50%',
                        description: 'Use a colour version that shows on white. Empty: "SUPER CHENNAI" text.',
                      },
                    },
                    {
                      name: 'badgeLogo',
                      type: 'upload',
                      relationTo: 'media',
                      label: 'Logo, top right',
                      admin: { width: '50%', description: 'Empty: the right-side logo from Header settings.' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'headline', type: 'text', label: 'Headline', defaultValue: 'I just played the', admin: { width: '50%' } },
                    { name: 'highlight', type: 'text', label: 'Highlighted line', defaultValue: 'Super Chennai Quiz!', admin: { width: '50%' } },
                  ],
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Picture at the bottom',
                  admin: { description: 'Chennai landmarks or similar, wide (about 1800 x 600). Empty: the default skyline.' },
                },
                {
                  name: 'footerText',
                  type: 'text',
                  label: 'Line under the card',
                  defaultValue: 'Think you know Chennai? Play at chenzquiz.superchennai.com',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
