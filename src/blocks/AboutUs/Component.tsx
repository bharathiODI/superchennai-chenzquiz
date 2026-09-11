import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Media } from '@/payload-types' // Adjust path based on your Payload types generation

export type AboutUsBlockProps = {
  eyebrow?: string
  title?: string
  description?: string
  secondaryDescription?: string
  highlightText?: string
  image: Media | string | number
  showLogo?: boolean
  logo?: Media | string | number
  cta?: {
    enabled?: boolean
    label?: string
    url?: string
    openInNewTab?: boolean
  }
}

// Helper function to safely extract media properties
const getMediaDetails = (media: Media | string | number | undefined) => {
  if (typeof media === 'object' && media !== null) {
    return {
      url: media.url || '',
      alt: media.alt || 'About Us Visual',
      width: media.width || 800,
      height: media.height || 800,
    }
  }
  return null
}

export const AboutUsBlockComponent: React.FC<AboutUsBlockProps> = (props) => {
  const {
    eyebrow = 'About Us',
    title = 'chennai',
    description,
    secondaryDescription,
    highlightText,
    image,
    showLogo,
    logo,
    cta,
  } = props

  const imageData = getMediaDetails(image)
  const logoData = showLogo ? getMediaDetails(logo) : null

  return (
    <section className="relative overflow-hidden bg-[#FAF8F5] py-16 md:py-24 lg:py-32 text-slate-800">
      {/* Soft Background Decorative Blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-purple-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-0 h-96 w-96 rounded-full bg-pink-200/40 blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 items-center">
          
          {/* LEFT CONTENT COLUMN */}
          <div className="flex flex-col justify-center space-y-6 z-10">
            {/* Eyebrow */}
            {eyebrow && (
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-purple-700">
                {eyebrow}
              </span>
            )}

            {/* Main Title & Decorative Accent */}
            <div className="relative">
              <h2 className="text-5xl sm:text-7xl lg:text-8xl xl:text-[110px] font-extrabold tracking-tight leading-none text-slate-900">
                {title}
              </h2>
              {/* Pink/Purple accent line under title */}
              <div className="mt-2 h-1.5 w-24 sm:w-32 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full" />
            </div>

            {/* Description Text */}
            <div className="space-y-4 text-base sm:text-lg leading-relaxed text-slate-600 max-w-xl">
              {description && <p>{description}</p>}
              {secondaryDescription && <p>{secondaryDescription}</p>}
            </div>

            {/* Highlighted Text */}
            {highlightText && (
              <div className="p-4 rounded-xl bg-pink-50 border-l-4 border-pink-500 font-medium text-pink-700 text-sm sm:text-base">
                {highlightText}
              </div>
            )}

            {/* CTA Button */}
            {cta?.enabled && cta?.label && cta?.url && (
              <div className="pt-2">
                <Link
                  href={cta.url}
                  target={cta.openInNewTab ? '_blank' : '_self'}
                  rel={cta.openInNewTab ? 'noopener noreferrer' : undefined}
                  className="group inline-flex items-center justify-center space-x-3 rounded-xl bg-gradient-to-r from-purple-700 via-purple-600 to-pink-500 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-purple-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/30 hover:-translate-y-0.5"
                >
                  <span>{cta.label}</span>
                  <svg
                    className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </Link>
              </div>
            )}
          </div>

          {/* RIGHT VISUAL COLUMN */}
          <div className="relative z-10 w-full flex justify-center lg:justify-end">
            <div className="relative w-full max-w-2xl lg:max-w-none">
              
              {/* Decorative Background Elements behind media */}
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-purple-600/20 via-pink-500/20 to-amber-400/20 blur-xl opacity-75 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative overflow-hidden rounded-2xl bg-white p-2 shadow-2xl shadow-slate-200">
                {imageData ? (
                  <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-auto lg:h-[520px] xl:h-[600px] w-full overflow-hidden rounded-xl">
                    <Image
                      src={imageData.url}
                      alt={imageData.alt}
                      fill
                      priority
                      className="object-cover object-center transition-transform duration-500 hover:scale-[1.02]"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 60vw"
                    />
                  </div>
                ) : (
                  <div className="flex h-96 w-full items-center justify-center bg-slate-100 text-slate-400 rounded-xl">
                    No image provided
                  </div>
                )}

                {/* Optional Badge / Logo overlay */}
                {logoData && (
                  <div className="absolute bottom-6 right-6 z-20 rounded-xl bg-white/90 p-3 shadow-lg backdrop-blur-md">
                    <Image
                      src={logoData.url}
                      alt={logoData.alt}
                      width={logoData.width || 80}
                      height={logoData.height || 80}
                      className="h-12 w-auto object-contain"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}