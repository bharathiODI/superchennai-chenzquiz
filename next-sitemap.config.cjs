const SITE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  'https://example.com'

// Demo site (internal testing): robots.txt blocks everything (see src/utilities/siteEnv.ts)
const IS_DEMO = process.env.SITE_ENV
  ? process.env.SITE_ENV.trim().toLowerCase() === 'demo'
  : /demo/.test((() => { try { return new URL(SITE_URL).hostname } catch { return '' } })())

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,

  generateRobotsTxt: true,

  exclude: [ '/pages-sitemap.xml', '/quizzes-sitemap.xml', '/posts/*'],

  robotsTxtOptions: {
    policies: IS_DEMO
      ? [{ userAgent: '*', disallow: '/' }]
      : [
          {
            userAgent: '*',
            disallow: '/admin/',
          },
        ],

    additionalSitemaps: [
      `${SITE_URL}/pages-sitemap.xml`,
      `${SITE_URL}/quizzes-sitemap.xml`,
    ],
  },
}
