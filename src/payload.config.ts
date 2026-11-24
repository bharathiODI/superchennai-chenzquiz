import { postgresAdapter } from '@payloadcms/db-postgres'
import 'dotenv/config'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import sharp from 'sharp'
import { defaultLexical } from 'src/fields/defaultLexical'
import { fileURLToPath } from 'url'
import { Questions } from './collections/Games'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import Footer from './Footer/config'
import { Header } from './Header/config'
import { QuizSiteSettings } from './globals/QuizSiteSettings/config'
import { plugins } from './plugins'
import { builderPlugin } from '@opendesigns/payload-builder'
import { builderElements } from './builder/elements'
import { getServerSideURL } from './utilities/getURL'
import { QuizUsers } from './collections/Games/QuizUsers'
import { Quizzes } from './collections/Games/Quizzes'
import { UserSubmissions } from './collections/Games/UserSubmissions'
import { QuizAttempts } from './collections/Games/QuizAttempts'
import { QuizRounds } from './collections/Games/QuizRounds'
import { QuizSettings } from './globals/QuizSettings'
import { cmsOnlyWrites } from './plugins/cmsOnlyWrites'
import { isDemoSite } from './utilities/siteEnv'

// Put a collection or global under a heading in the CMS menu
function inGroup<T extends { admin?: Record<string, any> }>(entity: T, group: string): T {
  return { ...entity, admin: { ...(entity.admin || {}), group } }
}

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    components: {
      beforeLogin: ['@/components/BeforeLogin'],
      // WordPress-style menu (roles decide what shows); Payload's own grouped list is hidden in CSS
      beforeNavLinks: ['@/components/admin/WpMenu#WpMenu'],
      // Viewers go straight to the Quiz Dashboard. Site status (playing now + maintenance) next.
      beforeDashboard: [
        '@/components/admin/ViewerHome#ViewerHome',
        '@/components/admin/SiteStatus#SiteStatus',
        '@/components/BeforeDashboard',
      ],
      // "DEMO CMS" strip on the demo site (renders nothing on live)
      header: ['@/components/admin/SiteEnvBanner#SiteEnvBanner'],
      views: {
        // Players, attempts and quiz details + Excel export (admins, editors, viewers)
        quizDashboard: { Component: '@/components/admin/QuizDashboard#QuizDashboardView', path: '/quiz-dashboard' },
      },
      graphics: {
        Logo: '@/components/admin/AdminLogo',
        Icon: '@/components/admin/AdminIcon',
      },
    },

    importMap: {
      baseDir: path.resolve(dirname),
    },
    // WordPress admin is light; the WP look in custom.scss is written for the light theme.
    theme: 'light',
    ...(isDemoSite() ? { meta: { titleSuffix: ' - DEMO' } } : {}),
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  editor: defaultLexical,

  db: postgresAdapter({
    pool: {
      max: 10,
      connectionString: process.env.DATABASE_URI,

      connectionTimeoutMillis: 300000,
      idleTimeoutMillis: 300000,
    },
    push: false,
  }),

  // CMS menu groups, WordPress order. The sidebar itself is components/admin/WpMenu; these groups
  // are what Payload shows elsewhere (dashboard cards, search).
  collections: [
    inGroup(Questions, 'Quiz'),
    inGroup(Quizzes, 'Quiz'),
    inGroup(QuizUsers, 'Players & Scores'),
    inGroup(QuizRounds, 'Players & Scores'),
    inGroup(QuizAttempts, 'Players & Scores'),
    inGroup(UserSubmissions, 'Players & Scores'),
    inGroup(Posts, 'Posts'),
    inGroup(Media, 'Media'),
    inGroup(Pages, 'Pages'),
    inGroup(Users, 'Users'),
  ],

  // #################################################################################
  // ################## DONT TOCH THIS PART MODIFIED BY OPEN DESIGN  #################
  // #################################################################################

  cors: [
    'https://www.superchennai.com',
    'http://localhost:5173',
    'http://localhost:5174',
    getServerSideURL(),
  ].filter(Boolean),

  globals: [
    inGroup(Header, 'Appearance'),
    inGroup(Footer, 'Appearance'),
    inGroup(QuizSettings, 'Settings'),
    inGroup(QuizSiteSettings, 'Settings'),
  ],
  blocks: [],
  plugins: [
    ...plugins,
    // Page builder canvas. The Pages collection adds its own layout field (Page Builder tab);
    // the plugin only registers the element list for the admin canvas.
    builderPlugin({ collections: [], elements: builderElements }),
    // Keep last: anything still on Payload's default write access becomes CMS-users-only.
    cmsOnlyWrites,
  ],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        if (req.user) return true

        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    tasks: [],
  },
})
