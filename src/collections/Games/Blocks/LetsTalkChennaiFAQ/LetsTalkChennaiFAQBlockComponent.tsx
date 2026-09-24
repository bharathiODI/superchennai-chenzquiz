
'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { FAQHeader } from './components/FAQHeader'
import { FAQDecorations } from './components/FAQDecorations'
import { FAQItemCard, FAQItemData } from './components/FAQItemCard'

export type MediaType = {
  id?: string | number
  url?: string
  alt?: string
}

export type LetsTalkChennaiFAQBlockProps = {
  seoH1?: string
  bgImage?: MediaType | string | number | null
  eyebrow?: string
  heading?: string
  description?: string
  faqs?: FAQItemData[]
  allowMultipleOpen?: boolean
  ctaText?: string
  ctaUrl?: string
}

function getBgImageUrl(media?: MediaType | string | number | null): string | null {
  if (!media) return null
  if (typeof media === 'object' && 'url' in media && media.url) {
    return media.url
  }
  if (typeof media === 'string') {
    return media
  }
  return null
}

export default function LetsTalkChennaiFAQBlockComponent({
  seoH1,
  bgImage,
  eyebrow = 'FAQ',
  heading = 'Frequently Asked Questions',
  description,
  faqs = [],
  allowMultipleOpen = false,
  ctaText,
  ctaUrl,
}: LetsTalkChennaiFAQBlockProps) {
  const [openIndexes, setOpenIndexes] = useState<number[]>([])

  const backgroundImageUrl = getBgImageUrl(bgImage)

  const handleToggle = (index: number) => {
    if (allowMultipleOpen) {
      setOpenIndexes((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
      )
    } else {
      setOpenIndexes((prev) => (prev.includes(index) ? [] : [index]))
    }
  }

  return (
    <section className="relative overflow-hidden bg-slate-50 py-16 md:py-24 text-slate-900">
      {/* SECTION BACKGROUND IMAGE (IF PROVIDED) */}
      {backgroundImageUrl ? (
        <div className="absolute inset-0 z-0">
          <Image
            src={backgroundImageUrl}
            alt="FAQ Section Background"
            fill
            className="object-cover"
          />
          {/* Backdrop overlay for optimal text contrast */}
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px]" />
        </div>
      ) : (
        /* Fallback Ambient Glow & Decorative Dots */
        <FAQDecorations />
      )}

      {/* Visually Hidden SEO H1 */}
      {seoH1 && <h1 className="sr-only">{seoH1}</h1>}

      <div className="relative z-10 container max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Decorative Top Section Header */}
        <FAQHeader eyebrow={eyebrow} heading={heading} description={description} />

        {/* Main FAQ Accordion Container */}
        {faqs && faqs.length > 0 && (
          <div className="mt-12 md:mt-16 flex flex-col gap-4 md:gap-5 max-w-[1100px] mx-auto">
            {faqs.map((faqItem, idx) => (
              <FAQItemCard
                key={idx}
                item={faqItem}
                index={idx}
                isOpen={openIndexes.includes(idx)}
                onToggle={() => handleToggle(idx)}
              />
            ))}
          </div>
        )}

        {/* Bottom CTA Button Option - Updated with Theme Blue/Indigo Gradient */}
        {ctaText && ctaUrl && (
          <div className="mt-12 md:mt-16 text-center">
            <a
              href={ctaUrl}
              className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#2563EB] to-[#4F46E5] px-8 py-4 text-xs md:text-sm font-bold text-white shadow-[0_10px_30px_rgba(37,99,235,0.3)] transition-all duration-300 hover:scale-105 hover:shadow-[0_15px_35px_rgba(37,99,235,0.5)] active:scale-95 uppercase tracking-widest"
            >
              <span>{ctaText}</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
