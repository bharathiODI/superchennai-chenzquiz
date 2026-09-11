'use client'

import React from 'react'

import { renderNode } from './renderNode'

type Props = {
  content: any
  eventData?: any
}

const LexicalRenderer: React.FC<Props> = ({ content, eventData }) => {
  if (!content?.root?.children) return null

  return (
    <>
      {content.root.children.map((node: any, index: number) => renderNode(node, index, eventData))}
    </>
  )
}

export default LexicalRenderer
