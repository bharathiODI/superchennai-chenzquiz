'use client'

import React from 'react'
import { MessagesSquare } from 'lucide-react'

type FAQHeaderProps = {
  eyebrow?: string
  heading?: string
  description?: string
}

export function FAQHeader({
  eyebrow = 'FAQ',
  heading = 'Frequently Asked Questions',
  description,
}: FAQHeaderProps) {
  return (
    <div className="text-center mb-10 relative z-10 flex flex-col items-center">
      <p className="text-[18px] font-extrabold uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#03045e] via-[#7000ff] to-[#ff007a] mb-0">
        {eyebrow}
      </p>

      <div className="relative inline-flex items-center justify-center my-2 headingggtexxt">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#03045e] via-[#7000ff] to-[#ff007a] px-2 py-1">
          {heading}
        </h2>
      </div>

      {description && (
        <p className="text-gray-600 mt-0 font-medium text-base sm:text-lg">{description}</p>
      )}
    </div>
  )
}
