/**
 * Default values for the "Quiz Site Settings" global. They are used as the CMS field defaults,
 * by the seed script, and as the fallback whenever the settings can't be read.
 */
export const QUIZ_SITE_DEFAULTS = {
  login: {
    loginHeading: 'Welcome Back',
    loginSubheading: 'Enter your mobile number to get OTP and access your dashboard',
    signupHeading: 'Create Account',
    signupSubheading: 'Join thousands of quiz fans across Chennai',
    requireEmail: true,
    showMessageField: true,
    termsUrl: '/terms',
    privacyUrl: '/privacy',
    sidePanelBadge: 'CHENNAI QUIZ MASTER',
    sidePanelText: 'Test your Chennai knowledge, climb the leaderboards & win daily rewards!',
    sidePanelFooter: 'Chennai Landmark Edition',
  },
  quizzesPage: {
    badge: '⚡ Daily Brain Challenge',
    heading: 'Super Chennai Quizzes',
    description:
      'Play today assigned interactive games, climb the local leaderboard, and claim your Chennai master badge!',
    emptyEyebrow: 'Daily Quiz Schedule',
    emptyHeading: 'No Active Quiz Scheduled',
    emptyText:
      'We are preparing fresh challenges! Check back in a bit or explore previous quizzes.',
  },
  leaderboard: {
    heading: 'Leaderboard',
    description: 'Top scorers and champions across all Chennai quiz challenges.',
    emptyText: 'No champions ranked for this period yet. Play a game to claim your spot!',
    rowsPerPage: 10,
    defaultTab: 'all' as 'daily' | 'weekly' | 'monthly' | 'all',
  },
  testPlayers: {
    allowTestLogins: true,
  },
}

export type QuizSiteSettingsData = typeof QUIZ_SITE_DEFAULTS
export type LoginSettings = QuizSiteSettingsData['login']
