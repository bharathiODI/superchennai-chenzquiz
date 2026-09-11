import type { Metadata } from 'next'
import type { Media, Page, Post, Config } from '../payload-types'
import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()
  let url = serverUrl + '/website-template-OG.webp'

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url
    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }
  return url
}

// export const generateMeta = async (args: {
//   doc: Partial<Page> | Partial<Post> | null
// }): Promise<Metadata> => {

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
  collection?: string
}): Promise<Metadata> => {

  const { doc, collection } = args

  // const { doc } = args
  const serverUrl = getServerSideURL()

  const ogImage = getImageURL(doc?.meta?.image)

  const title = doc?.meta?.title ? `${doc.meta.title} ` : ''

  const description = doc?.meta?.description || ''

  const slug = doc?.slug ?? ''
    
  // const canonicalUrl = slug === 'home' ? serverUrl : `${serverUrl}/${slug}`
  const canonicalUrl =
  slug === 'home'
    ? serverUrl
    : `${serverUrl}/${collection ? `${collection}/` : ''}${slug}`

  return {
    metadataBase: new URL(serverUrl),
    title,
    description,
    keywords: [''],

    authors: [
      {
        name: 'Super Chennai',
      },
    ],

    publisher: 'Super Chennai',

    robots: {
      index: true,
      follow: true,
    },

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: mergeOpenGraph({
      title,
      description,

      url: canonicalUrl,

      images: ogImage
        ? [
            {
              url: ogImage,
              width: 1200,
              height: 630,
            },
          ]
        : undefined,
    }),

    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
  }
}

























// import type { Metadata } from 'next'

// import type { Media, Page, Post, Config } from '../payload-types'

// import { mergeOpenGraph } from './mergeOpenGraph'
// import { getServerSideURL } from './getURL'

// const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
//   const serverUrl = getServerSideURL()

//   let url = serverUrl + '/website-template-OG.webp'

//   if (image && typeof image === 'object' && 'url' in image) {
//     const ogUrl = image.sizes?.og?.url

//     url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
//   }

//   return url
// }

// export const generateMeta = async (args: {
//   doc: Partial<Page> | Partial<Post> | null
// }): Promise<Metadata> => {
//   const { doc } = args

//   const ogImage = getImageURL(doc?.meta?.image)

//   const title = doc?.meta?.title
//     ? doc?.meta?.title + ' | Super Chennai'
//     : ' Super Chennai '

//   return {
//     description: doc?.meta?.description,
//     openGraph: mergeOpenGraph({
//       description: doc?.meta?.description || 'Super Chennai',
//       images: ogImage
//         ? [
//             {
//               url: ogImage,
//             },
//           ]
//         : undefined,
//       title,
//       url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
//     }),
//     title,
//   }
// }
