import { NextResponse } from 'next/server'
import { CollectionSlug, getPayload } from 'payload'
import configPromise from 'src/payload.config'

export async function GET() {
  const payload = await getPayload({ config: configPromise })

  const collectionsToQuery: {
    slug: CollectionSlug
    titleField: string
    descriptionField: string
    slugField: string
  }[] = [
    {
      slug: 'pages' as CollectionSlug,
      titleField: 'title',
      descriptionField: 'description',
      slugField: 'slug',
    },
  ]

  const allSuggestions: {
    title: string
    description?: string
    slug?: string
    collection: string
  }[] = []

  for (const { slug, titleField, descriptionField, slugField } of collectionsToQuery) {
    try {
      const res = await payload.find({
        collection: slug,
        limit: 50,
        pagination: false,
        select: {
          [titleField]: true,
          [descriptionField]: true,
          [slugField]: true,
        },
      })

      res.docs.forEach((doc) => {
        const title = (doc as Record<string, any>)?.[titleField]
        const description = (doc as Record<string, any>)?.[descriptionField]
        const itemSlug = (doc as Record<string, any>)?.[slugField]

        if (typeof title === 'string') {
          allSuggestions.push({
            title,
            description,
            slug: itemSlug,
            collection: slug,
          })
        }
      })
    } catch (err) {
      console.error(`Error fetching from collection "${slug}":`, err)
    }
  }

  return NextResponse.json({ suggestions: allSuggestions })
}
