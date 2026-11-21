import type { Field, GlobalAfterChangeHook, GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'
import { isAdmin } from '@/access/isAdmin'
import { isNotAdmin } from '@/access/checkRole'
import { QUIZ_SITE_DEFAULTS as D } from './defaults'

const text = (name: string, label: string, defaultValue: string, description?: string): Field => ({
  name,
  label,
  type: 'text',
  defaultValue,
  admin: description ? { description } : undefined,
})

const textarea = (name: string, label: string, defaultValue: string): Field => ({
  name,
  label,
  type: 'textarea',
  defaultValue,
})

const revalidateQuizPages: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info('Revalidating quiz pages after settings change')
    for (const path of ['/login', '/quizzes', '/leaderboard']) revalidatePath(path)
  }
  return doc
}

export const QuizSiteSettings: GlobalConfig = {
  slug: 'quiz-site-settings',
  label: 'Quiz Site Settings',
  access: {
    read: () => true,
    update: isAdmin,
  },
  admin: {
    hidden: isNotAdmin,
    description: 'Text and options for the login, quizzes and leaderboard pages.',
  },
  hooks: {
    afterChange: [revalidateQuizPages],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          name: 'login',
          label: 'Login & Sign up',
          fields: [
            {
              type: 'row',
              fields: [
                text('loginHeading', 'Login heading', D.login.loginHeading),
                text('signupHeading', 'Sign up heading', D.login.signupHeading),
              ],
            },
            text('loginSubheading', 'Login subheading', D.login.loginSubheading),
            text('signupSubheading', 'Sign up subheading', D.login.signupSubheading),
            {
              type: 'row',
              fields: [
                {
                  name: 'requireEmail',
                  label: 'Email is required on sign up',
                  type: 'checkbox',
                  defaultValue: D.login.requireEmail,
                },
                {
                  name: 'showMessageField',
                  label: 'Show the optional "Message" field',
                  type: 'checkbox',
                  defaultValue: D.login.showMessageField,
                },
              ],
            },
            {
              type: 'row',
              fields: [
                text('termsUrl', 'Terms & Conditions link', D.login.termsUrl),
                text('privacyUrl', 'Privacy Policy link', D.login.privacyUrl),
              ],
            },
            text('sidePanelBadge', 'Side panel badge', D.login.sidePanelBadge),
            textarea('sidePanelText', 'Side panel text', D.login.sidePanelText),
            text('sidePanelFooter', 'Side panel footer', D.login.sidePanelFooter),
          ],
        },
        {
          name: 'quizzesPage',
          label: 'Quizzes page',
          fields: [
            text('badge', 'Badge', D.quizzesPage.badge),
            text('heading', 'Heading', D.quizzesPage.heading),
            textarea('description', 'Description', D.quizzesPage.description),
            text('emptyEyebrow', 'No quiz today: small title', D.quizzesPage.emptyEyebrow),
            text('emptyHeading', 'No quiz today: heading', D.quizzesPage.emptyHeading),
            textarea('emptyText', 'No quiz today: text', D.quizzesPage.emptyText),
          ],
        },
        {
          name: 'leaderboard',
          label: 'Leaderboard',
          fields: [
            text('heading', 'Heading', D.leaderboard.heading),
            textarea('description', 'Description', D.leaderboard.description),
            textarea('emptyText', 'Text when nobody has played yet', D.leaderboard.emptyText),
            {
              type: 'row',
              fields: [
                {
                  name: 'rowsPerPage',
                  label: 'Players per page',
                  type: 'number',
                  min: 5,
                  max: 50,
                  defaultValue: D.leaderboard.rowsPerPage,
                },
                {
                  name: 'defaultTab',
                  label: 'Tab shown first',
                  type: 'select',
                  defaultValue: D.leaderboard.defaultTab,
                  options: [
                    { label: 'Daily', value: 'daily' },
                    { label: 'Weekly', value: 'weekly' },
                    { label: 'Monthly', value: 'monthly' },
                    { label: 'All Time', value: 'all' },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: 'testPlayers',
          label: 'Test players',
          description:
            'Test players use the numbers 0000000001 to 0000000010 and the TEST_OTP code from the server .env file instead of an SMS. They never appear on the leaderboard or the dashboard. Create them with "npm run seed".',
          fields: [
            {
              name: 'allowTestLogins',
              label: 'Allow test player logins',
              type: 'checkbox',
              defaultValue: D.testPlayers.allowTestLogins,
              admin: {
                description:
                  'Untick to block every test login. Test logins also need TEST_OTP in the server .env.',
              },
            },
          ],
        },
      ],
    },
  ],
}
