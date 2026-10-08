import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from 'src/payload.config'
import { unstable_cache } from 'next/cache'

const getQuizzesSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })

    const SITE_URL =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      'https://example.com'

    const results = await payload.find({
      collection: 'quizzes',
      overrideAccess: true,
      depth: 0,
      limit: 1000,
      pagination: false,
      where: {
        status: {
          in: ['active', 'completed'],
        },
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    const dateFallback = new Date().toISOString()

    return results.docs
      .filter((quiz) => Boolean(quiz?.slug))
      .map((quiz) => ({
        loc: `${SITE_URL}/quizzes/${quiz.slug}`,
        lastmod: quiz.updatedAt || dateFallback,
      }))
  },
  ['quizzes-sitemap'],
  {
    tags: ['quizzes-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getQuizzesSitemap()

  return getServerSideSitemap(sitemap)
}
