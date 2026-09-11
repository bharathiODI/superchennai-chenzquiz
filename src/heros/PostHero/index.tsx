'use client'

import Link from 'next/link'
import './style.css'

import AutoShrinkText from '@/components/Text/AutoShrinkText'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Media } from 'src/components/Media'
import type { Post } from 'src/payload-types'

export const PostHero: React.FC<{
  post: Post 
}> = ({ post }) => {
  const { heroImage, title } = post
  const pathname = usePathname()

  const [parentCrumb, setParentCrumb] = useState<{ name: string; href: string } | null>(null)
  const ignoredSegments = [
    'visits',
    'place',
    'live',
    'investments',
    'place',
    'innovate',
    'events',
    'volunteer',
    'work',
  ]

  const pathSegments = pathname
    .split('/')
    .filter((segment) => segment && !ignoredSegments.includes(segment.toLowerCase()))

  const breadcrumbLinks = pathSegments.map((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/')
    return { name: segment.replace(/-/g, ' ').toUpperCase(), href }
  })

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

  useEffect(() => {
    const storedSlug = sessionStorage.getItem('parentSlug')
    if (storedSlug) {
      const slug = storedSlug.replace('/', '')
      setParentCrumb({ name: slug.replace(/-/g, ' ').toUpperCase(), href: storedSlug })

      sessionStorage.removeItem('parentSlug')
    }
  }, [])

  return (
    <div className="accaodomationBannerSection relative min-h-[50vh]">
      {heroImage && typeof heroImage !== 'string' && (
        <Media fill priority imgClassName="-z-10 object-cover" resource={heroImage} />
      )}

      <div className="accodoamationBannerContainer relative z-10">
        <div className="accodoamationBannerText">
          <AutoShrinkText
            baseSize={60}
            minSize={40}
            maxChars={40}
            className="accodoamationBannerText"
            width="80%"
            maxLines={2}
          />

          <div className="breadCrum">
            {parentCrumb && (
              <>
                <Link href={parentCrumb.href}>{parentCrumb.name}</Link>
                {breadcrumbLinks.length > 0 && ' - '}
              </>
            )}
            {breadcrumbLinks.map((crumb, index) => (
              <React.Fragment key={crumb.href}>
                <Link href={crumb.href}>{crumb.name}</Link>
                {index < breadcrumbLinks.length - 1 && ' - '}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
