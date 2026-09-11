import type { Metadata } from 'next/types'

import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import ArattaiDetails from '@/components/Summer/SummerDetails'
import { Pagination } from 'src/components/Pagination'
import configPromise from 'src/payload.config'
import PageClient from './page.client'

export const revalidate = 600

type Args = {
  params: Promise<{
    pageNumber: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { pageNumber } = await paramsPromise
  const payload = await getPayload({ config: configPromise })
  const sanitizedPageNumber = Number(pageNumber)
  if (!Number.isInteger(sanitizedPageNumber)) notFound()

  const arattai = await payload.find({
    collection: 'lets-talks-chennai',
    depth: 3,
    limit: 1000,
    page: sanitizedPageNumber,
    overrideAccess: true,
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>summerFestEvents</h1>
        </div>
      </div>

      <ArattaiDetails data={arattai} />

      <div className="container">
        {arattai?.page && arattai?.totalPages > 1 && (
          <Pagination page={arattai.page} totalPages={arattai.totalPages} />
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { pageNumber } = await paramsPromise
  return {
    title: `Super Chennai events Page ${pageNumber || ''}`,
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const { totalDocs } = await payload.count({
    collection: 'lets-talks-chennai',
    overrideAccess: false,
  })

  const totalPages = Math.ceil(totalDocs / 10)

  const pages: { pageNumber: string }[] = []

  for (let i = 1; i <= totalPages; i++) {
    pages.push({ pageNumber: String(i) })
  }

  return pages
}
