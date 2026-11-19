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
          // <Link
          //   href="/quizzes"
          //   // className="py-2 px-5 rounded-xl bg-white shadow-xl shadow-purple-500/10 hover:scale-105 transition-all flex items-center gap-3 buttonpaaddinggg"
          //   className="relative py-2 px-5 rounded-xl bg-white shadow-xl shadow-purple-500/10 hover:scale-105 transition-all flex items-center gap-3 buttonpaaddinggg overflow-hidden group animated-red-border-btn"
          // >
          //   <svg className="w-6 h-6" fill="#4e0360" viewBox="0 0 24 24">
          //     <path d="M8 5v14l11-7z" />
          //   </svg>
          //   <span
          //     className="font-extrabold text-lg bg-gradient-to-r from-[#4e0360] via-[#241182] to-[#0420a3] bg-clip-text text-transparent"
          //     style={{
          //       backgroundSize: '200% auto',
          //       animation: 'gradientMove 3s linear infinite',
          //     }}
          //   >
          //     Play Now
          //   </span>

          //   {/* Add this style tag locally if you don't have it in your global CSS */}
          //   <style jsx>{`
          //     @keyframes gradientMove {
          //       0% {
          //         background-position: 0% 50%;
          //       }
          //       50% {
          //         background-position: 100% 50%;
          //       }
          //       100% {
          //         background-position: 0% 50%;
          //       }
          //     }
          //   `}</style>
          // </Link>
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

//     const [isLoggedIn, setIsLoggedIn] = useState(false)

//     // Check login state from localStorage on client side
//     useEffect(() => {
//       const token = localStorage.getItem('token')
//       if (token) {
//         setIsLoggedIn(true)
//       }
//     }, [])
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
//         <div className="absolute inset-0 flex items-center justify-center z-10 px-4">
//                {isLoggedIn ? (
//           <Link
//             href="/quizzes"
//             className="py-4 px-10 rounded-2xl bg-gradient-to-r from-[#5122f2] to-[#6d3aff] text-white font-extrabold text-lg shadow-xl shadow-purple-500/30 hover:scale-105 transition-all flex items-center gap-3 animate-pulse buttonpaaddinggg"
//           >
//             <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
//               <path d="M8 5v14l11-7z" />
//             </svg>
//             <span>Play Now</span>
//           </Link>
//         ) : (
//           <>
//             <Link
//               href={signUpUrl}
//               className="py-3 px-8 rounded-xl bg-gradient-to-r from-[#5122f2] to-[#6d3aff] text-white font-semibold text-base shadow-lg shadow-purple-500/25 hover:opacity-95 transition-all flex items-center gap-2"
//             >
//               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
//                 <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
//               </svg>
//               <span>{signUpText}</span>
//             </Link>

//             <Link
//               href={loginUrl}
//               className="py-3 px-8 rounded-xl bg-white/80 hover:bg-white text-[#5122f2] border border-[#5122f2]/30 font-semibold text-base shadow-sm transition-all flex items-center gap-2"
//             >
//               <svg
//                 className="w-5 h-5"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
//                 />
//               </svg>
//               <span>{loginText}</span>
//             </Link>
//           </>
//         )}

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
