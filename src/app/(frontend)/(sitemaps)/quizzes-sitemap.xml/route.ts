import { getServerSideSitemap, ISitemapField } from 'next-sitemap'
import { getPayload } from 'payload'
import config from 'src/payload.config'
import { unstable_cache } from 'next/cache'

const getEventsSitemap = unstable_cache(
  async (): Promise<ISitemapField[]> => {
    try {
      const payload = await getPayload({ config })

      const SITE_URL =
        process.env.NEXT_PUBLIC_SERVER_URL ||
        (process.env.VERCEL_PROJECT_PRODUCTION_URL
          ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
          : 'https://example.com')

      const results = await payload.find({
        collection: 'quizzes',
        overrideAccess: false,
        draft: false,
        depth: 0,
        limit: 1000,
        pagination: false,
        where: {
          _status: {
            equals: 'published',
          },
        },
        select: {
          slug: true,
          updatedAt: true,
        },
      })

      const dateFallback = new Date().toISOString()

      return results.docs
        .filter((event) => Boolean(event?.slug))
        .map((event) => ({
          loc: `${SITE_URL}/quizzes/${event.slug}`,
          lastmod: event.updatedAt || dateFallback,
          changefreq: 'daily',
          priority: 0.7,
        }))
    } catch (error) {
      console.error('Error generating events sitemap:', error)
      return []
    }
  },
  ['events-sitemap'],
  {
    tags: ['events-sitemap'],
    revalidate: 3600, // 1 hour cache time
  },
)

export async function GET() {
  const fields = await getEventsSitemap()

  // next-sitemap App Router response format
  return getServerSideSitemap(fields)
}
// import { getServerSideSitemap } from 'next-sitemap'
// import { getPayload } from 'payload'
// import config from 'src/payload.config'
// import { unstable_cache } from 'next/cache'

// const getEventsSitemap = unstable_cache(
//   async () => {
//     const payload = await getPayload({ config })

//     const SITE_URL =
//       process.env.NEXT_PUBLIC_SERVER_URL ||
//       process.env.VERCEL_PROJECT_PRODUCTION_URL ||
//       'https://example.com'

//     const results = await payload.find({
//       collection: 'quizzes',
//       overrideAccess: false,
//       draft: false,
//       depth: 0,
//       limit: 1000,
//       pagination: false,
//       where: {
//         _status: {
//           equals: 'published',
//         },
//       },
//       select: {
//         slug: true,
//         updatedAt: true,
//       },
//     })

//     const dateFallback = new Date().toISOString()

//     return results.docs
//       .filter((event) => Boolean(event?.slug))
//       .map((event) => ({
//         loc: `${SITE_URL}/quizzes/${event.slug}`,
//         lastmod: event.updatedAt || dateFallback,
//       }))
//   },
//   ['events-sitemap'],
//   {
//     tags: ['events-sitemap'],
//   },
// )

// export async function GET() {
//   const sitemap = await getEventsSitemap()

//   return getServerSideSitemap(sitemap)
// }
