/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useEffect } from 'react'
import { Media } from 'src/components/Media'
// import type { Arattai } from 'src/payload-types'

export const SummerHero: React.FC<{ arattai: any }> = ({ arattai }) => {
  const { heroImage,mobileImage } = arattai

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        document.body.classList.remove('post-hero-active')
      } else {
        document.body.classList.add('post-hero-active')
      }
    }
    document.body.classList.add('post-hero-active')
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => {
      document.body.classList.remove('post-hero-active')
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className="accaodomationBannerSection relative max-h-[100vh] min-h-[80vh]">
     
      {heroImage && typeof heroImage !== 'string' && (
        <Media fill priority imgClassName="-z-10 object-cover hidden sm:block w-full" resource={heroImage} />
      )}
        {mobileImage && typeof mobileImage !== 'string' && (
        <Media fill priority imgClassName="-z-10 object-cover block sm:hidden w-full" resource={mobileImage} />
      )}
    </div>
  )
}
