/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useEffect, useState } from 'react'
import defaultImage from '../../assets/images/AccodomationBannerr.jpg'
import Link from 'next/link'

interface ImageObject {
  url: string
}

interface Props {
  image?: string | ImageObject | null
  heading?: string | null
  mobileImage?: string | ImageObject | null
  signUpText?: string
  signUpUrl?: string
  loginText?: string
  loginUrl?: string
}

export const DefaultHeroBanner: React.FC<Props> = ({
  image,
  mobileImage,
  signUpText = 'Sign Up',
  signUpUrl = '/signup',
  loginText = 'Login',
  loginUrl = '/login',
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Check login state from localStorage on client side
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsLoggedIn(true)
    }
  }, [])

  const imageUrl =
    typeof image === 'object' && image?.url
      ? image.url
      : typeof image === 'string'
        ? `/api/media/${image}`
        : ''

  const mobileImageUrl =
    typeof mobileImage === 'object' && mobileImage?.url
      ? mobileImage.url
      : typeof mobileImage === 'string'
        ? `/api/media/${mobileImage}`
        : imageUrl

  const handleBannerClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault()
    const targetElement = document.getElementById('upcomingevents')
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Prevent inner button clicks from triggering the banner's scroll handler
  const handleInnerClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <div
      onClick={handleBannerClick}
      className="block headerrrheeight w-full relative overflow-hidden herbannersections"
    >
      <img
        src={imageUrl || defaultImage.src}
        alt="Banner"
        className="hidden sm:block w-full h-[100%] object-cover"
      />
      <img
        src={mobileImageUrl || imageUrl || defaultImage.src}
        alt="Mobile Banner"
        className="block sm:hidden w-full h-auto object-contain mobilbannerrimage"
      />

      <div
        className="absolute inset-0 flex items-center justify-center z-10 px-4 gap-4 newbuttonchangeee"
        onClick={handleInnerClick}
      >
        {isLoggedIn ? (

          <Link
            href="/quizzes"
            className="hk-animated-btn py-3 px-6 shadow-xl shadow-purple-500/10 hover:scale-105 transition-all inline-flex items-center justify-center"
          >
            <div className="hk-btn-content">
              <svg className="w-6 h-6" fill="#4e0360" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span className="font-extrabold text-lg bg-gradient-to-r from-[#241182] via-[#241182] to-[#0420a3] bg-clip-text text-transparent">
                Play Now
              </span>
            </div>
          </Link>
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}

// /* eslint-disable @next/next/no-img-element */
// 'use client'
// import React, { useEffect, useState } from 'react'
// import defaultImage from '../../assets/images/AccodomationBannerr.jpg'
// import Link from 'next/link'
// interface ImageObject {
//   url: string
// }
// interface Props {
//   image?: string | ImageObject | null
//   heading?: string | null
//   mobileImage?: string | ImageObject | null
// }

// type PayloadMedia = {
//   url: string
//   alt?: string
// }

// type FeatureCard = {
//   id?: string
//   title: string
//   description: string
//   iconType?: 'list' | 'star' | 'fire' | 'chart' | string
// }

// type AboutTriviaProps = {
//   mainTitle?: string
//   highlightText?: string
//   subDescription?: string
//   centerImage?: PayloadMedia | string
//   leftCards?: FeatureCard[]
//   rightCards?: FeatureCard[]
//   signUpText?: string
//   signUpUrl?: string
//   loginText?: string
//   loginUrl?: string
// }
// export const DefaultHeroBanner: React.FC<Props> = ({ image, mobileImage }) => {
//   signUpText = 'Sign Up',
//   signUpUrl = '/signup',
//   loginText = 'Login',
//   loginUrl = '/login',

//     const [isLoggedIn, setIsLoggedIn] = useState(false)

//           </div>

//       </div>
//     </Link>
//   )
// }

// /* eslint-disable @next/next/no-img-element */
// 'use client'
// import React from 'react'
// import defaultImage from '../../assets/images/AccodomationBannerr.jpg'
// import Link from 'next/link'

// interface ImageObject {
//   url: string
// }

// interface Props {
//   image?: string | ImageObject | null
//   heading?: string | null
//   mobileImage?: string | ImageObject | null
// }

//         {/* Gradient Overlay for Text/Icon Visibility */}
//         <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent z-10 pointer-events-none" />

