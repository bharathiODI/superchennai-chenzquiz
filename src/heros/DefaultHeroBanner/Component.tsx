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
// export const DefaultHeroBanner: React.FC<Props> = ({ image, mobileImage }) => {
//   const imageUrl =
//     typeof image === 'object' && image?.url
//       ? image.url
//       : typeof image === 'string'
//         ? `/api/media/${image}`
//         : ''
//   const mobileImageUrl =
//     typeof mobileImage === 'object' && mobileImage?.url
//       ? mobileImage.url
//       : typeof mobileImage === 'string'
//         ? `/api/media/${mobileImage}`
//         : imageUrl
//   const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
//     e.preventDefault()
//     const targetElement = document.getElementById('upcomingevents')
//     if (targetElement) {
//       targetElement.scrollIntoView({ behavior: 'smooth' })
//     }
//   }
//   return (
//     <Link
//       href="#upcomingevents"
//       onClick={handleScroll}
//       className="block cursor-pointer headerrrheeight"
//     >
//       <div className="w-full relative overflow-hidden herbannersections">
//         <img
//           src={imageUrl || defaultImage.src}
//           alt="Banner"
//           className="hidden sm:block w-full h-[100%] object-cover"
//         />
//         <img
//           src={mobileImageUrl || imageUrl || defaultImage.src}
//           alt="Mobile Banner"
//           className="block sm:hidden w-full h-auto object-contain mobilbannerrimage"
//         />
//         <div className="absolute inset-0 flex items-center justify-center z-10 px-4"></div>
//       </div>
//     </Link>
//   )
// }
/* eslint-disable @next/next/no-img-element */
'use client'
import React from 'react'
import defaultImage from '../../assets/images/AccodomationBannerr.jpg'
import Link from 'next/link'

interface ImageObject {
  url: string
  alt?: string | null
}

interface Props {
  image?: string | ImageObject | null
  heading?: string | null
  mobileImage?: string | ImageObject | null
  alt?: string | null // 💡 Added
  mobileAlt?: string | null // 💡 Added
}

export const DefaultHeroBanner: React.FC<Props> = ({ image, mobileImage, alt, mobileAlt }) => {
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

  // 💡 Dynamic Alt text extraction with fallbacks
  const desktopAltText = alt || (typeof image === 'object' && image?.alt) || 'Super Chennai Banner'

  const mobileAltText =
    mobileAlt || (typeof mobileImage === 'object' && mobileImage?.alt) || desktopAltText

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    const targetElement = document.getElementById('upcomingevents')
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <Link
      href="#upcomingevents"
      onClick={handleScroll}
      className="block cursor-pointer headerrrheeight"
    >
      <div className="w-full relative overflow-hidden herbannersections">
        <img
          src={imageUrl || defaultImage.src}
          alt={desktopAltText} // 👈 Dynamic Alt
          className="hidden sm:block w-full h-[100%] object-cover"
        />
        <img
          src={mobileImageUrl || imageUrl || defaultImage.src}
          alt={mobileAltText} // 👈 Dynamic Mobile Alt
          className="block sm:hidden w-full h-auto object-contain mobilbannerrimage"
        />
        <div className="absolute inset-0 flex items-center justify-center z-10 px-4"></div>
      </div>
    </Link>
  )
}
