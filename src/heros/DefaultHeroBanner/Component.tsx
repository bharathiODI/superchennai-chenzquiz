/* eslint-disable @next/next/no-img-element */
'use client'
import React from 'react'
import defaultImage from '../../assets/images/AccodomationBannerr.jpg'
import Link from 'next/link'
interface ImageObject {
  url: string
}
interface Props {
  image?: string | ImageObject | null
  heading?: string | null
  mobileImage?: string | ImageObject | null
}
export const DefaultHeroBanner: React.FC<Props> = ({ image, mobileImage }) => {
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
    <Link
      href="#upcomingevents"
      onClick={handleScroll}
      className="block cursor-pointer headerrrheeight"
    >
      <div className="w-full relative overflow-hidden herbannersections">
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
        <div className="absolute inset-0 flex items-center justify-center z-10 px-4"></div>
      </div>
    </Link>
  )
}

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
//       className="block cursor-pointer relative group overflow-hidden w-full"
//     >
//       <div className="w-full relative overflow-hidden min-h-[220px] sm:min-h-[350px] flex items-end">
//         {/* Desktop Image */}
//         <img
//           src={imageUrl || defaultImage.src}
//           alt="Banner"
//           className="hidden sm:block w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
//         />

//         {/* Mobile Image */}
//         <img
//           src={mobileImageUrl || imageUrl || defaultImage.src}
//           alt="Mobile Banner"
//           className="block sm:hidden w-full h-auto object-contain"
//         />

//         {/* Gradient Overlay for Text/Icon Visibility */}
//         <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent z-10 pointer-events-none" />

//         {/* 👑 BOTTOM ALIGNED SVG GRAPHICS & CROWN (z-index: 30) */}
//         <div className="absolute bottom-0 left-0 right-0 z-30 flex items-end justify-between px-4 sm:px-12 pb-4 sm:pb-6 pointer-events-none">
//           {/* Left: Mind / Brain Floating Card */}
//           <div
//             className="hidden md:flex flex-col items-center gap-2 animate-bounce"
//             style={{ animationDuration: '3s' }}
//           >
//             <div className="relative p-3 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-indigo-500/40 shadow-xl shadow-indigo-500/20">
//               <div className="absolute -inset-1 rounded-2xl bg-indigo-500/30 blur-sm animate-pulse" />
//               <svg
//                 className="relative w-8 h-8 sm:w-10 sm:h-10 text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="1.8"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
//                 <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
//                 <path d="M12 5v13" />
//                 <path d="M12 9h4" />
//                 <path d="M12 13h-4" />
//               </svg>
//             </div>
//             <span className="text-[10px] font-black uppercase tracking-wider text-indigo-200 bg-indigo-950/80 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
//               Brain Power ⚡
//             </span>
//           </div>

//           {/* Center: Crown & Championship Badge (Bottom Center) */}
//           <div className="mx-auto flex flex-col items-center justify-end text-center">
//             {/* Animated Crown */}
//             <div className="relative mb-1 animate-bounce" style={{ animationDuration: '2s' }}>
//               <div className="absolute -inset-2 bg-amber-400/40 rounded-full blur-md animate-pulse" />
//               <svg
//                 className="relative w-12 h-12 sm:w-16 sm:h-16 text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.9)]"
//                 viewBox="0 0 24 24"
//                 fill="currentColor"
//               >
//                 <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
//               </svg>
//             </div>

//             {/* Glowing Tag */}
//             <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900/90 backdrop-blur-md rounded-full border border-amber-400/50 shadow-lg">
//               <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
//               <span className="text-xs sm:text-sm font-extrabold text-amber-300 uppercase tracking-wider">
//                 Daily Quiz League 👑
//               </span>
//             </div>
//           </div>

//           {/* Right: Trophy Floating Card */}
//           <div
//             className="hidden md:flex flex-col items-center gap-2 animate-bounce"
//             style={{ animationDuration: '3.5s' }}
//           >
//             <div className="relative p-3 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-amber-500/40 shadow-xl shadow-amber-500/20">
//               <div className="absolute -inset-1 rounded-2xl bg-amber-500/30 blur-sm animate-pulse" />
//               <svg
//                 className="relative w-8 h-8 sm:w-10 sm:h-10 text-amber-300 drop-shadow-[0_0_8px_rgba(252,211,77,0.8)]"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="1.8"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
//                 <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
//                 <path d="M4 22h16" />
//                 <path d="M10 14.66V17c0 .55-.45 1-1 1H7" />
//                 <path d="M14 14.66V17c0 .55.45 1 1 1h2" />
//                 <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
//               </svg>
//             </div>
//             <span className="text-[10px] font-black uppercase tracking-wider text-amber-200 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-500/30">
//               Win Rewards 🏆
//             </span>
//           </div>
//         </div>
//       </div>
//     </Link>
//   )
// }
