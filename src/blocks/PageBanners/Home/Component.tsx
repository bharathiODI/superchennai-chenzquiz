'use client'

import { useState, useEffect } from 'react'
import { Media } from 'src/payload-types'
import Image from 'next/image'
// import './style.css'
// import GlobalSearch from '@/blocks/HomePage/GlobalSearch/Component'

type Slide = {
  image: string | Media
  title?: string
  description?: string
}

export default function HeroSliderBlock({ slides = [] }: { slides: Slide[] }) {
  const [current, setCurrent] = useState(0)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted || slides.length === 0) return

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isMounted, slides.length])

  return (
    <div className="herobannerSection">
      <div className="relative w-full h-[105vh] overflow-hidden mobileBanneerHeroSlider ">
        {slides.map((slide, index) => {
          const imageUrl =
            typeof slide.image === 'string' ? slide.image : slide.image?.url || '/fallback.jpg'

          const uniqueKey = `slide-${
            typeof slide.image === 'string' ? slide.image : slide.image?.id || 'noid'
          }-${index}`

          return (
            <div
              key={uniqueKey}
              className={`bsolute w-full h-full transition-opacity duration-1000 ease-in-out  ${
                index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <Image
                src={imageUrl}
                alt={slide.title || ''}
                fill
                className="w-full h-full object-cover DesktopBanner"
                priority
              />

              <Image
                src={imageUrl}
                alt={slide.title || ''}
                fill
                className="w-full h-full object-cover MobileBanner"
                priority
              />
              <div className="absolute inset-0  flex flex-col justify-center items-center text-white text-center p-4"></div>
            </div>
          )
        })}

        <div className="absolute bottom-19 left-1/2 -translate-x-1/2 flex gap-3 z-20 heroSliderDots">
          {slides.map((_, i) => (
            <button
              key={`dot-${i}`}
              onClick={() => setCurrent(i)}
              className={`w-[32px] h-[7px] rounded-full transition-colors duration-300 ${
                current === i ? 'bg-[#995098]' : 'bg-[#b6bec5] hover:bg-[#995098]'
              }`}
              style={{ border: 'none' }}
            />
          ))}
        </div>
      </div>
      <div className="notHomePageSearch">
        {/* <GlobalSearch placeholderText={'Explore Chennai'} buttonText={'Search'} /> */}
      </div>
    </div>
  )
}
