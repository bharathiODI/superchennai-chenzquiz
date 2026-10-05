'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'

// Swiper Styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

type PayloadMedia = {
  url: string
  alt?: string
}

type ReelItem = {
  id?: string
  title?: string
  subtitle?: string
  thumbnail: PayloadMedia | string
  redirectUrl: string
}

type InstaReelsProps = {
  topBadge?: string
  mainHeading?: string
  highlightText?: string
  subDescription?: string
  reels?: ReelItem[]
}

export default function InstaReelsSliderComponent({
  topBadge = 'INSTAGRAM REELS',
  mainHeading = 'Watch & Explore Our',
  highlightText = 'Reels',
  subDescription = 'Check out our latest trending Instagram reels and stories below!',
  reels = [
    {
      title: 'Chennai Quiz Highlights',
      subtitle: '@chenzquiz',
      thumbnail: '/images/reel-1.jpg',
      redirectUrl: 'https://instagram.com',
    },
    {
      title: 'Daily Challenge Winner',
      subtitle: '@chenzquiz',
      thumbnail: '/images/reel-2.jpg',
      redirectUrl: 'https://instagram.com',
    },
    {
      title: 'Trivia Time Special',
      subtitle: '@chenzquiz',
      thumbnail: '/images/reel-3.jpg',
      redirectUrl: 'https://instagram.com',
    },
  ],
}: InstaReelsProps) {
  const getImage = (media: PayloadMedia | string) => {
    return typeof media === 'object' ? media?.url : media
  }

  return (
    <section className="relative w-full py-16 px-4 bg-white overflow-hidden">
      {/* Header Area */}
      <div className="text-center mb-10 relative z-10 flex flex-col items-center">
        {topBadge && (
          <p className="text-[18px] font-extrabold uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#03045e] via-[#7000ff] to-[#ff007a] mb-0">
            {topBadge}
          </p>
        )}

        <div className="relative inline-flex items-center justify-center my-2">
          {/* Left Dashes */}
          <div className="hidden sm:flex flex-col gap-1.5 absolute -left-12 md:-left-16 top-1/2 -translate-y-1/2">
            <span className="w-4 h-1 bg-[#ec4899] rounded-full transform -rotate-45 -translate-x-1" />
            <span className="w-5 h-1 bg-[#8b5cf6] rounded-full" />
            <span className="w-4 h-1 bg-[#6366f1] rounded-full transform rotate-45 -translate-x-1" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#0f172a] px-2">
            {mainHeading}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7000ff] to-[#ff007a]">
              {highlightText}
            </span>
          </h2>

          {/* Right Dashes */}
          <div className="hidden sm:flex flex-col gap-1.5 absolute -right-12 md:-right-16 top-1/2 -translate-y-1/2">
            <span className="w-4 h-1 bg-[#8b5cf6] rounded-full transform rotate-45 translate-x-1" />
            <span className="w-5 h-1 bg-[#ec4899] rounded-full" />
            <span className="w-4 h-1 bg-[#d946ef] rounded-full transform -rotate-45 translate-x-1" />
          </div>
        </div>

        {subDescription && (
          <p className="text-gray-600 mt-1 font-medium text-base sm:text-lg max-w-xl">
            {subDescription}
          </p>
        )}
      </div>

      {/* Swiper Reels Slider */}
      <div className="max-w-7xl mx-auto relative z-10 px-2 sm:px-6">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          breakpoints={{
            480: { slidesPerView: 2, spaceBetween: 16 },
            768: { slidesPerView: 3, spaceBetween: 20 },
            1024: { slidesPerView: 4, spaceBetween: 24 },
          }}
          className="pb-14 reels-swiper"
        >
          {reels?.map((reel, idx) => {
            const imgUrl = getImage(reel.thumbnail)

            return (
              <SwiperSlide key={reel.id || idx}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                    delay: idx * 0.1,
                  }}
                  className="group relative rounded-3xl overflow-hidden aspect-[9/16] shadow-xl border-4 border-white bg-slate-900 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer"
                >
                  <a
                    href={reel.redirectUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full h-full relative"
                  >
                    {/* Thumbnail Image */}
                    <img
                      src={imgUrl || '/images/reel-placeholder.jpg'}
                      alt={reel.title || 'Instagram Reel'}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                    {/* Instagram Reel Badge Icon (Top Right) */}
                    <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </div>

                    {/* Play Icon Center Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-[#ff007a]/80 group-hover:bg-[#ff007a] group-hover:scale-110 text-white flex items-center justify-center shadow-lg transition-all duration-300 backdrop-blur-sm">
                        <svg className="w-7 h-7 fill-white ml-1" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>

                    {/* Bottom Title Info */}
                    <div className="absolute bottom-0 inset-x-0 p-5 text-left text-white z-10">
                      {reel.subtitle && (
                        <p className="text-xs font-semibold text-pink-300 uppercase tracking-wider mb-1">
                          {reel.subtitle}
                        </p>
                      )}
                      {reel.title && (
                        <h3 className="text-base font-bold line-clamp-2 leading-snug drop-shadow-sm">
                          {reel.title}
                        </h3>
                      )}
                    </div>
                  </a>
                </motion.div>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>
    </section>
  )
}