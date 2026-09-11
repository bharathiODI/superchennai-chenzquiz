'use client'

import React from 'react'
import { Media } from '@/components/Media'

import { Autoplay, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/pagination'

type Slide = {
  type: 'image' | 'video'
  desktopImage?: any
  mobileImage?: any
  desktopVideo?: any
  mobileVideo?: any
  alt?: string
}

type Props = {
  title?: string
  slides?: Slide[]
}

export const MediaCarouselBlock: React.FC<Props> = ({ title, slides = [] }) => {
  return (
    <section className="relative overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        loop
        speed={1000}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        className="mediaCarousel"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div className="relative  w-full overflow-hidden bg-black">
              {/* ================= IMAGE ================= */}
              {slide.type === 'image' && (
                <>
                  {/* Desktop */}
                  <div className="hidden md:block h-full w-full">
                    {slide.desktopImage && (
                      <Media resource={slide.desktopImage} className="h-full w-full object-cover" />
                    )}
                  </div>

                  {/* Mobile */}
                  <div className="block md:hidden h-full w-full">
                    <Media
                      resource={slide.mobileImage || slide.desktopImage}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </>
              )}

              {/* ================= VIDEO ================= */}
              {slide.type === 'video' && (
                <>
                  {/* Desktop Video */}
                  <div className="hidden md:block h-full w-full">
                    {slide.desktopVideo?.url && (
                      <video className="h-full w-full object-cover" autoPlay muted loop playsInline>
                        <source src={slide.desktopVideo.url} />
                      </video>
                    )}
                  </div>

                  {/* Mobile Video */}
                  <div className="block md:hidden h-full w-full">
                    {(slide.mobileVideo?.url || slide.desktopVideo?.url) && (
                      <video className="h-full w-full object-cover" autoPlay muted loop playsInline>
                        <source src={slide.mobileVideo?.url || slide.desktopVideo?.url} />
                      </video>
                    )}
                  </div>
                </>
              )}

            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Pagination Style */}
      <style jsx global>{`
        .mediaCarousel .swiper-pagination {
          bottom: 30px !important;
        }

        .mediaCarousel .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: rgba(255, 255, 255, 0.5);
          opacity: 1;
          transition: all 0.3s ease;
        }

        .mediaCarousel .swiper-pagination-bullet-active {
          width: 34px;
          border-radius: 999px;
          background: linear-gradient(90deg, #e0533c, #019492);
        }
      `}</style>
    </section>
  )
}
