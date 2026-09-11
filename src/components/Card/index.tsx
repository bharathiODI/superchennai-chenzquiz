'use client'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React from 'react'

export type CardPostData = {
  slug?: string
  categories?: any[]
  meta?: any
  title?: string
  FeaturedImage?: any
  content?: any
  relationTo?: string

   collection?: string
  className?: string
  layout?: any
  
}

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPostData
  relationTo?: string
  showCategories?: boolean
  title?: string
}> = ({ className, doc, relationTo = 'posts', showCategories = true, title: titleFromProps }) => {
  const { card, link } = useClickableCard({})
  const { slug, categories, meta, title, FeaturedImage, content } = doc || {}

  const imageToUse = FeaturedImage || meta?.image

  const titleToUse = titleFromProps || title
  const description = content?.root?.children
    ?.map((child: any) =>
      child.type === 'paragraph' ? child.children.map((c: any) => c.text).join('') : '',
    )
    .join(' ')
    .trim()
    .substring(0, 180) 
  const sanitizedDescription = description ? `${description}...` : ''

  const href = `/${relationTo}/${slug}`
  const hasCategories = categories && Array.isArray(categories) && categories.length > 0

  return (
    <article
      ref={card.ref}
      className={cn(
        'group rounded-1xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-md hover:shadow-xl transition-shadow duration-300',
        className,
      )}
    >
      {/* Image */}
      <div className="relative w-full aspect-[16/9] bg-gray-100 dark:bg-gray-800 overflow-hidden">
        {imageToUse && typeof imageToUse !== 'string' ? (
          <Media
            resource={imageToUse}
            size="100vw"
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-400 text-sm">
            No image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col ">
        {/* Categories */}
        {showCategories && hasCategories && (
          <div className="flex flex-wrap gap-2 text-xs font-semibold text-primary-600 dark:text-primary-400">
            {categories.map((category, index) =>
              typeof category === 'object' ? (
                <span
                  key={index}
                  className="bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 px-2 py-1 rounded-full"
                >
                  {category.title || 'Untitled'}
                </span>
              ) : null,
            )}
          </div>
        )}

        {/* Title */}
        {titleToUse && (
          <h3 className="text-lg font-bold leading-snug text-gray-900 dark:text-white">
            <Link href={href} ref={link.ref} className="hover:underline underline-offset-4">
              {titleToUse}
            </Link>
          </h3>
        )}

        {/* Description */}
        {sanitizedDescription && <p className="">{sanitizedDescription}</p>}

        {/* View More */}
        <div className="mt-2">
          <Link
            href={href}
            className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
          >
            View More →
          </Link>
        </div>
      </div>
    </article>
  )
}
