import type { Metadata } from 'next'

/* =========================================================
   IMPORTANT
   Prevent Next.js static cache
========================================================= */

export const dynamic = 'force-dynamic'

import { draftMode } from 'next/headers'
import { getPayload } from 'payload'

import { PayloadRedirects } from 'src/components/PayloadRedirects'
import configPromise from 'src/payload.config'

import SummerDetails from '@/components/Summer/SummerDetails'
import { LivePreviewListener } from 'src/components/LivePreviewListener'
import { generateMeta } from 'src/utilities/generateMeta'
import PageClient from './page.client'

/* =========================================================
   REMOVE generateStaticParams
   because it creates static pages
========================================================= */

/* =========================================================
   TYPES
========================================================= */

type Args = {
  params: Promise<{
    slug?: string
  }>
}

/* =========================================================
   PAGE
========================================================= */

export default async function ArrataiPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()

  const { slug = '' } = await paramsPromise

  const url = '/events/' + slug

  const arattai = await queryPostBySlug({
    slug,
  })

  // console.log('summerFestEvents', arattai)

  if (!arattai) {
    return <PayloadRedirects url={url} />
  }

  return (
    <div>
      <PageClient />

      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <div>
        <SummerDetails data={arattai} />
      </div>
    </div>
  )
}

/* =========================================================
   SEO
========================================================= */

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise

  const LetsTalkChennai = await queryPostBySlug({
    slug,
  })

  return generateMeta({
    doc: LetsTalkChennai as any,
    collection: 'events',
  })
}

/* =========================================================
   QUERY
========================================================= */

const queryPostBySlug = async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({
    config: configPromise,
  })

  const result = await payload.find({
    collection: 'lets-talks-chennai',

    draft,

    limit: 1,

    depth: 5,

    overrideAccess: true,

    pagination: false,

    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
}
