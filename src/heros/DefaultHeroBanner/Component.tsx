// /* eslint-disable @next/next/no-img-element */
// import React from 'react'
// import defaultImage from '../../assets/images/AccodomationBannerr.jpg'

// interface ImageObject {
//   url: string
// }

// interface Props {
//   image?: string | ImageObject | null
//   heading?: string | null
//   mobileImage?: string | ImageObject | null
// }

// export const DefaultHeroBanner: React.FC<Props> = ({ heading, image, mobileImage }) => {
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

//   return (
//     <div className="w-full">
//       <div className="relative flex items-center justify-center h-[300px] md:h-[420px] lg:h-[520px] overflow-hidden mobileimagessss">
//         {/* Banner Image */}
//         <div className="absolute inset-0">
//           <img
//             src={imageUrl || defaultImage.src}
//             alt="Banner"
//             className="z-10 object-cover hidden sm:block w-full"
//           />

//           <img
//             src={mobileImageUrl || imageUrl || defaultImage.src}
//             alt="Mobile Banner"
//             className="z-10 object-cover block sm:hidden w-full"
//           />
//         </div>

//         {/* Dark Overlay */}
//         {/* <div className="absolute inset-0 bg-black/40" /> */}

//         {/* Heading */}
//         <div className="relative z-10 text-center px-4">
//           {/* <h3 className="text-white text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
//             {heading || 'Welcome'}
//           </h3> */}
//         </div>
//       </div>
//     </div>
//   )
// }

/* eslint-disable @next/next/no-img-element */
'use client' // <-- Intha line-ah top-la compulsory add pannunga

import React from 'react'
import defaultImage from '../../assets/images/AccodomationBannerr.jpg'
import Link from 'next/link' // Next.js Link import pannunga

interface ImageObject {
  url: string
}

interface Props {
  image?: string | ImageObject | null
  heading?: string | null
  mobileImage?: string | ImageObject | null
}

export const DefaultHeroBanner: React.FC<Props> = ({ heading, image, mobileImage }) => {
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

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    const targetElement = document.getElementById('upcomingevents')
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' })
    }
  }
  return (
    <Link href="#upcomingevents" onClick={handleScroll} className="block cursor-pointer headerrrheeight">
      <div className="w-full relative overflow-hidden">
        {/* Desktop Image */}
        <img
          src={imageUrl || defaultImage.src}
          alt="Banner"
          className="hidden sm:block w-full h-auto object-contain"
        />

        {/* Mobile Image */}
        <img
          src={mobileImageUrl || imageUrl || defaultImage.src}
          alt="Mobile Banner"
          className="block sm:hidden w-full h-auto object-contain"
        />

        {/* Heading */}
        <div className="absolute inset-0 flex items-center justify-center z-10 px-4">
          {/* <h3 className="text-white text-3xl md:text-5xl lg:text-6xl font-bold">
          {heading || 'Welcome'}
        </h3> */}
        </div>
      </div>
    </Link>
  )
}
