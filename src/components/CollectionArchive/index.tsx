

import React from 'react'
import { Card, CardPostData } from '@/components/Card'

export type Props = {
  posts: CardPostData[]
  relationTo?: string
}

export const CollectionArchive: React.FC<Props> = ({
  posts,
  relationTo = 'posts',
}) => {
  if (!posts || posts.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 text-center">
        <div>
          <h3 className="text-xl font-semibold mb-2">No posts found</h3>
          <p className="text-muted-foreground">Please check back later.</p>
        </div>
      </div>
    )
  }

  return (
    <section className="container mx-auto px-4 py-8 mt-10">
      {/* Grid: 3 columns per row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <Card
            key={index}
            className="h-full w-full"
            doc={post}
            relationTo={relationTo}
            showCategories
          />
        ))}
      </div>
    </section>
  )
}