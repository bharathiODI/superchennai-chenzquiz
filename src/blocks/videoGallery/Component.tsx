/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState } from 'react'
import { Media } from '@/components/Media'
import Slider from 'react-slick'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

type Props = {
  heading?: string
  subHeading?: string
  videos?: any[]
  autoPlay?: boolean
  backgroundImage?: any
  backgroundOverlay?: boolean
  backgroundOpacity?: number
  layoutStyle?: 'grid' | 'masonry' | 'carousel'
}

export const VideoGalleryBlockComponent: React.FC<Props> = ({
  heading,
  subHeading,
  videos = [],
  autoPlay = false,
  backgroundImage,
  backgroundOverlay = true,
  backgroundOpacity = 40,
  layoutStyle = 'masonry',
}) => {
  const [activeVideo, setActiveVideo] = useState(videos?.[0])

  const getYoutubeEmbedUrl = (url: string) => {
    const regExp = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/

    const match = url?.match(regExp)

    return match?.[1] ? `https://www.youtube.com/embed/${match[1]}` : ''
  }

  const NextArrow = ({ onClick }: any) => (
    <button
      onClick={onClick}
      className="absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#004B87] text-white shadow-lg hover:scale-110 transition"
    >
      →
    </button>
  )

  const PrevArrow = ({ onClick }: any) => (
    <button
      onClick={onClick}
      className="absolute -left-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#004B87] text-white shadow-lg hover:scale-110 transition"
    >
      ←
    </button>
  )
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  }

  return (
    <section className="relative py-20 px-6 md:px-12 lg:px-20 overflow-hidden">
      {/* Background Image */}
      {backgroundImage?.url && (
        <>
          <img
            src={backgroundImage.url}
            alt="Background"
            className="absolute inset-0 w-full h-full"
          />

          {backgroundOverlay && (
            <div
              className="absolute inset-0 bg-black"
              style={{
                opacity: backgroundOpacity / 100,
              }}
            />
          )}
        </>
      )}

      {/* Default Background */}
      {!backgroundImage?.url && <div className="absolute inset-0 bg-[#FAF8F5]" />}

      <div className="relative z-10">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-black text-[#004B87] tracking-tight">
            {heading}
          </h2>
          <p className="text-[#D9231D] font-semibold mt-3">{subHeading}</p>
        </div>
        {layoutStyle === 'masonry' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8">
              {activeVideo?.type === 'video' && activeVideo?.video && (
                <video
                  key={activeVideo.video.url}
                  className="w-full h-[500px] rounded-2xl object-cover"
                  controls
                  autoPlay={autoPlay}
                  muted={autoPlay}
                >
                  <source src={activeVideo.video.url} type="video/mp4" />
                </video>
              )}

              {activeVideo?.type === 'youtube' && activeVideo?.youtubeUrl && (
                <iframe
                  className="w-full h-[500px] rounded-2xl"
                  src={getYoutubeEmbedUrl(activeVideo.youtubeUrl)}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}

              {activeVideo?.type === 'image' && activeVideo?.image?.url && (
                <a href={activeVideo.href} target="_blank" rel="noopener noreferrer">
                  <img
                    src={activeVideo.image.url}
                    alt={activeVideo.title}
                    className="w-full h-[500px] rounded-2xl object-cover"
                  />
                </a>
              )}

              <div className="mt-4">
                <h3 className="text-2xl font-bold text-[#004B87]">{activeVideo?.title}</h3>

                <p className="text-gray-600 mt-2">{activeVideo?.description}</p>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="h-[600px] overflow-y-auto pr-2 space-y-4 scroll-smooth">
                {videos?.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => setActiveVideo(item)}
                    className={`cursor-pointer flex gap-3 p-3 rounded-xl transition ${
                      activeVideo?.video?.url === item?.video?.url
                        ? 'bg-[#004B87]/10 border border-[#004B87]'
                        : 'hover:bg-white'
                    }`}
                  >
                    <div className="w-28 h-20 rounded-lg overflow-hidden">
                      {item?.thumbnail?.url ? (
                        <img
                          src={item.thumbnail.url}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : item?.image?.url ? (
                        <img
                          src={item.image.url}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#004B87] text-white flex items-center justify-center text-xs">
                          Media
                        </div>
                      )}
                    </div>

                    {/* Text */}
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-[#004B87] line-clamp-2">
                        {item?.title}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-2">{item?.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* GRID */}
        {layoutStyle === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos?.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100"
              >
                <div className="aspect-video">
                  {item?.thumbnail?.url ? (
                    <img
                      src={item.thumbnail.url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : item?.image?.url ? (
                    <img
                      src={item.image.url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-[#004B87]">{item?.title}</h3>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-3">{item?.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CAROUSEL */}
        {layoutStyle === 'carousel' && (
          <div className="relative px-8">
            <Slider {...sliderSettings}>
              {videos?.map((item, index) => (
                <div key={index} className="px-3">
                  <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 hover:-translate-y-2 transition duration-300">
                    <div className="relative aspect-video overflow-hidden">
                      {item?.thumbnail?.url ? (
                        <img
                          src={item.thumbnail.url}
                          alt={item.title}
                          className="w-full h-full object-cover hover:scale-110 transition duration-500"
                        />
                      ) : item?.image?.url ? (
                        <img
                          src={item.image.url}
                          alt={item.title}
                          className="w-full h-full object-cover hover:scale-110 transition duration-500"
                        />
                      ) : null}
                    </div>

                    <div className="p-5">
                      <h3 className="font-black text-lg text-[#004B87] line-clamp-2">
                        {item?.title}
                      </h3>

                      <p className="text-gray-600 mt-2 text-sm line-clamp-3">{item?.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        )}
      </div>
    </section>
  )
}
