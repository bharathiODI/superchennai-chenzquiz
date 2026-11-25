import type { Field, GlobalConfig } from 'payload'
import { ADMINS, allow, hiddenUnless } from '@/access/roles'
import { DEFAULT_BONUS_TIERS, GAME_TYPES } from '@/utilities/gameScoring'

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
  // Appearance and quiz settings: Super Admins and Administrators (WordPress manage_options).
  access: {
    read: () => true,
    update: allow(ADMINS),
  },
  admin: {
    hidden: hiddenUnless(ADMINS),
    description: 'Game day, timers, speed bonus, fair play, player titles and the shareable scorecard.',
    components: { elements: { beforeDocumentControls: ['@/components/admin/SettingsTabs#SettingsTabs'] } },
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
            "Points for a correct answer = the question's points (set on each question, 10 by default) + the speed bonus below. Double Up questions count twice. A wrong answer takes off the question's negative points (0 by default). Changes apply to rounds started after saving.",
          fields: [
            {
              name: 'gameDay',
              type: 'group',
              label: 'Game day (India time)',
              admin: {
                description:
                  "Each day's play runs from the start time until the same time the next day. Nobody can start during the break just before it. Every player gets random questions they have never had, laid out by the quiz's Round layout; the pool is every published question of the live quiz (Use in: General, Sponsored or Both).",
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'startHour',
                      type: 'number',
                      label: 'New day starts at - hour (0-23)',
                      defaultValue: 0,
                      min: 0,
                      max: 23,
                      admin: {
                        width: '33%',
                        step: 1,
                        description: '0 = midnight, 8 = 8 AM, 20 = 8 PM',
                      },
                    },
                    {
                      name: 'startMinute',
                      type: 'number',
                      label: 'minute (0-59)',
                      defaultValue: 30,
                      min: 0,
                      max: 59,
                      admin: {
                        width: '33%',
                        step: 5,
                        description: 'hour 0 + minute 30 = 12:30 AM',
                      },
                    },
                    {
                      name: 'coolOffMinutes',
                      type: 'number',
                      label: 'Break before it (minutes)',
                      defaultValue: 60,
                      min: 0,
                      max: 720,
                      admin: {
                        width: '33%',
                        step: 5,
                        description:
                          '60 with a 12:30 AM start = no play 11:30 PM-12:30 AM. 0 = no break.',
                      },
                    },
                  ],
                },
              ],
            },
            {
              name: 'gameTimers',
              type: 'group',
              label: 'Time limit per game',
              fields: [
                { type: 'row', fields: timerFields.slice(0, 4) },
                { type: 'row', fields: timerFields.slice(4) },
              ],
            },
            {
              name: 'scoring',
              type: 'group',
              label: 'Speed bonus',
              fields: [
                {
                  name: 'speedBonus',
                  type: 'checkbox',
                  label: 'Give a speed bonus for fast correct answers',
                  defaultValue: true,
                },
                {
                  name: 'bonusTiers',
                  type: 'array',
                  label: 'Speed bonus tiers',
                  labels: { singular: 'Tier', plural: 'Tiers' },
                  defaultValue: DEFAULT_BONUS_TIERS,
                  admin: {
                    condition: (_, siblingData) => siblingData?.speedBonus !== false,
                    description:
                      "A correct answer gets the bonus of the first tier (highest % first) whose time is still left. % is of the question's time limit, so one set of tiers works for 20s and 60s games. Default for a 20s MCQ: 20-17s left = 5, 16-14s = 4, 13-10s = 3, 9-5s = 2, 4-1s = 1. A 0% row catches any answer with time left; a timeout gets nothing. Empty: the defaults.",
                  },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'minPercentLeft',
                          type: 'number',
                          label: 'Time left at least (%)',
                          required: true,
                          min: 0,
                          max: 100,
                          admin: { width: '50%' },
                        },
                        {
                          name: 'bonus',
                          type: 'number',
                          label: 'Bonus points',
                          required: true,
                          min: 0,
                          max: 100,
                          admin: { width: '50%' },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Fair play',
          description:
            'Answers are checked and timed on the server. These rules only flag unusual play on the Quiz Dashboard (Flags); an admin decides what to do - there are no automatic bans.',
          fields: [
            {
              name: 'safety',
              type: 'group',
              label: 'Rules',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'speedFloorSeconds',
                      type: 'number',
                      label: 'No speed bonus under (seconds per answer)',
                      defaultValue: 1.5,
                      min: 0,
                      max: 30,
                      admin: { width: '33%', step: 0.5 },
                    },
                    {
                      name: 'tooFastRoundSeconds',
                      type: 'number',
                      label: 'Flag a day finished under (seconds)',
                      defaultValue: 6,
                      min: 0,
                      max: 300,
                      admin: { width: '33%' },
                    },
                    {
                      name: 'linkedWindowMinutes',
                      type: 'number',
                      label: 'Flag numbers on one phone within (minutes)',
                      defaultValue: 60,
                      min: 0,
                      max: 1440,
                      admin: { width: '33%', description: '0 = off' },
                    },
                  ],
                },
                {
                  name: 'shuffleOptions',
                  type: 'checkbox',
                  label: 'Shuffle answer options for each player',
                  defaultValue: true,
                  admin: {
                    description:
                      'On: each player sees the options of a question (MCQ, Dropdown) in a different order, so answers can\'t be passed on as "the second one". Off: the order set on the question.',
                  },
                },
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
                        description:
                          'Use a colour version that shows on white. Empty: "SUPER CHENNAI" text.',
                      },
                    },
                    {
                      name: 'badgeLogo',
                      type: 'upload',
                      relationTo: 'media',
                      label: 'Logo, top right',
                      admin: {
                        width: '50%',
                        description: 'Empty: the right-side logo from Header settings.',
                      },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'headline',
                      type: 'text',
                      label: 'Headline',
                      defaultValue: 'I just played the',
                      admin: { width: '50%' },
                    },
                    {
                      name: 'highlight',
                      type: 'text',
                      label: 'Highlighted line',
                      defaultValue: 'Super Chennai Quiz!',
                      admin: { width: '50%' },
                    },
                  ],
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Picture at the bottom',
                  admin: {
                    description:
                      'Chennai landmarks or similar, wide (about 1800 x 600). Empty: the default skyline.',
                  },
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
