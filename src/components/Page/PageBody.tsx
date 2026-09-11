'use client'

import React from 'react'
import LexicalRenderer from '../lexical/LexicalRenderer'

interface PageBodyProps {
  content: any
}

const PageBody: React.FC<PageBodyProps> = ({ content }) => {
  if (!content) return null

  return (
    <section className="">
      <div className="">
        <div className="">
          <LexicalRenderer content={content} />
        </div>
      </div>
    </section>
  )
}

export default PageBody
