/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @next/next/no-img-element */
// /* eslint-disable @next/next/no-html-link-for-pages */
// /* eslint-disable @next/next/no-img-element */
// 'use client'

// import { AnimatePresence, motion } from 'framer-motion'
// import Link from 'next/link'
// import { useRouter } from 'next/navigation'
// import React, { useEffect, useState } from 'react'
// //######################## ASSETS  #############################################
// import iconEmail from '../assets/images/HomePage-Images/Icons/mobile-Header-Email.svg'
// import iconEvents from '../assets/images/HomePage-Images/Icons/mobile-Header-Events.svg'

// //######################## TYPES  #############################################
// import { HeaderClientProps, MenuItem } from '@/models/Header'
// import Image from 'next/image'
// export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
//   //##################### STATE  ##############################################
//   const [menuItems, setMenuItems] = useState<MenuItem[]>([])
//   const [activeMenu, setActiveMenu] = useState<MenuItem | null>(null)
//   const [scrolled, setScrolled] = useState(false)
//   const router = useRouter()
//   //##################### TIMEOUT  ############################################
//   let menuTimeout: NodeJS.Timeout

//   //##################### INITIALIZATION #######################################
//   useEffect(() => {
//     const fetchMenuItems = async () => {
//       try {
//         setMenuItems(
//           (data?.navItems || []).map((item: any) => ({
//             label: item.link.label,
//             link: item.link.reference?.value?.slug
//               ? `/${item.link.reference.value.slug}`
//               : item.link.url || '#',
//             content: Array.isArray(item?.link?.content)
//               ? item.link.content.filter((block: any) => block.title && block.desc && block.link)
//               : [],
//             contentImage: item?.link?.contentImage
//               ? {
//                   filename: item.link.contentImage.filename,
//                   mimeType: item.link.contentImage.mimeType,
//                   url: `/media/${item.link.contentImage.filename}`,
//                 }
//               : undefined,
//           })),
//         )
//         // setDraweLogo(data?.logo)
//         // setDrawerMenuItems(data?.drawerMenu || [])
//         // setSocialLinks(data?.socialLinks || [])
//       } catch (error) {
//         console.error('Failed to fetch menu items', error)
//       }
//     }

//     fetchMenuItems()
//     // setPointCast(data?.pointCast || null)
//   }, [data])

//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 50)
//     window.addEventListener('scroll', handleScroll)
//     return () => window.removeEventListener('scroll', handleScroll)
//   }, [])
//   //############################# HELPER FUNCTIONS ###############################
//   const handleMenuEnter = (item: MenuItem) => {
//     clearTimeout(menuTimeout)
//     setActiveMenu(item)
//   }

//   const handleMenuLeave = () => {
//     menuTimeout = setTimeout(() => {
//       setActiveMenu(null)
//     }, 200)
//   }

//   //################# STICKY LOGIC ###################

//   const [footerReached, setFooterReached] = useState(false)

//   useEffect(() => {
//     const handleFooterScroll = () => {
//       const footer = document.querySelector('footer')

//       if (!footer) return

//       const footerTop = footer.getBoundingClientRect().top
//       const windowHeight = window.innerHeight

//       setFooterReached(footerTop <= windowHeight)
//     }

//     window.addEventListener('scroll', handleFooterScroll)

//     return () => window.removeEventListener('scroll', handleFooterScroll)
//   }, [])

//   //#################### RENDER UI#################################################
//   return (
//     <div className="w-full">
//       <header
//         className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
//           scrolled ? 'bg-white shadow-md' : 'bg-transparent'
//         }`}
//       >
//         {/* #################### DESKTOP MENU NAVBAR ########################### */}

//         <nav className="relative hidden w-full flex-col md:flex" onMouseLeave={handleMenuLeave}>
//           <div
//             className={`grid grid-cols-3 items-center px-8 py-5 transition-all duration-300 ${
//               activeMenu ? 'bg-white shadow-md' : ''
//             }`}
//           >
//             {/* LOGO */}
//             <div className="flex justify-start">
//               <a href="https://www.superchennai.com/" aria-label="Home">
//                 {data?.logo && typeof data.logo === 'object' && 'filename' in data.logo && (
//                   <img
//                     src={`/media/${data.logo.filename}`}
//                     alt={data.logo.alt || 'Site Logo'}
//                     width={150}
//                     height={60}
//                     className="h-auto w-[100px] object-contain "
//                   />
//                 )}
//               </a>
//             </div>

//             {/* DESKTOP MENU CENTER */}
//             <div className="flex justify-center">
//               <ul className="flex items-center gap-8">
//                 {menuItems.map((item, i) => (
//                   <li
//                     key={i}
//                     className="cursor-pointer text-sm font-medium uppercase tracking-wide text-black transition hover:text-gray-600"
//                     onMouseEnter={() => handleMenuEnter(item)}
//                   >
//                     <Link href={item.link}>{item.label}</Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* RIGHT SIDE */}
//             <div className="flex justify-end">
//               <a href="/" aria-label="Home">
//                 {data?.secondarylogo &&
//                   typeof data.secondarylogo === 'object' &&
//                   'filename' in data.secondarylogo && (
//                     <img
//                       src={`/media/${data.secondarylogo.filename}`}
//                       alt={data.secondarylogo.alt || 'Secondary Logo'}
//                       width={150}
//                       height={60}
//                       className="h-auto w-[100px] object-contain "
//                     />
//                   )}
//               </a>
//             </div>
//           </div>

//           {/* #################### HOVER MENU ########################### */}

//           <AnimatePresence mode="wait">
//             {activeMenu && (
//               <motion.div
//                 key={activeMenu.label}
//                 className="absolute top-full left-0 hidden w-full bg-white shadow-2xl md:block"
//                 initial={{ opacity: 0, y: -20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 transition={{ duration: 0.3, ease: 'easeInOut' }}
//                 onMouseLeave={() => setActiveMenu(null)}
//               >
//                 <motion.div
//                   className="mx-auto flex max-w-7xl items-start justify-between gap-12 px-10 py-12"
//                   initial="hidden"
//                   animate="show"
//                   exit="hidden"
//                   variants={{
//                     hidden: {},
//                     show: {
//                       transition: {
//                         staggerChildren: 0.07,
//                         delayChildren: 0.1,
//                       },
//                     },
//                   }}
//                 >
//                   {/* MENU CONTENT */}

//                   <div className="grid flex-1 grid-cols-2 gap-8">
//                     {activeMenu.content.map((block, index) => (
//                       <motion.div
//                         key={index}
//                         className="cursor-pointer rounded-2xl border border-gray-100 p-5 transition hover:bg-gray-50"
//                         variants={{
//                           hidden: { opacity: 0, y: 10 },
//                           show: { opacity: 1, y: 0 },
//                         }}
//                         transition={{ duration: 0.3, ease: 'easeOut' }}
//                         onClick={() => {
//                           const linkPath = block.link.startsWith('/')
//                             ? block.link
//                             : `/${block.link}`

//                           if (activeMenu?.link) {
//                             sessionStorage.setItem('parentSlug', activeMenu.link)
//                           }

//                           router.push(linkPath)

//                           setActiveMenu(null)

//                           window.scrollTo({
//                             top: 0,
//                             behavior: 'smooth',
//                           })
//                         }}
//                       >
//                         <h4 className="mb-2 text-lg font-semibold text-black">{block.title}</h4>

//                         <p className="text-sm leading-relaxed text-gray-600">{block.desc}</p>
//                       </motion.div>
//                     ))}
//                   </div>

//                   {/* IMAGE */}

//                   {activeMenu?.contentImage?.url && (
//                     <div className="w-[320px] overflow-hidden rounded-3xl">
//                       <img
//                         className="h-full w-full object-cover"
//                         src={activeMenu.contentImage.url}
//                         alt="Menu Content"
//                       />
//                     </div>
//                   )}
//                 </motion.div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </nav>

//         {/* #################### MOBILE NAVBAR ########################### */}

//         <div className="flex items-center justify-between bg-white px-4 py-3 shadow-sm md:hidden mobileeebannerrrsss">
//           {/* EVENTS ICON */}

//           {/* <div className="flex h-10 w-10 items-center justify-center">
//             <img src={iconEvents.src} alt="Events Icon" />
//           </div> */}

//           <div className="flex h-10 w-10  items-center justify-center mobilebannerrrlayouuttt">
//             <Link href="https://www.superchennai.com/">
//               {data?.logo && typeof data.logo === 'object' && 'url' in data.logo && (
//                 <img
//                   src={`/media/${data.logo.filename}`}
//                   alt={data.logo.alt || 'Site Logo'}
//                   className="max-h-[150px] object-contain superchennailogoosizeee"
//                 />
//               )}
//             </Link>
//           </div>

//           <div className="flex h-10 w-10 items-center justify-center  mobilebannerrrlayouuttt">
//             <Link href="/">
//               {data?.secondarylogo &&
//                 typeof data.secondarylogo === 'object' &&
//                 'url' in data.secondarylogo && (
//                   <img
//                     src={`/media/${data.secondarylogo.filename}`}
//                     alt={data.secondarylogo.alt || 'Site Logo'}
//                     className="max-h-[150px] object-contain superchennailogoosizeee"
//                   />
//                 )}
//             </Link>
//           </div>
//         </div>
//       </header>
//     </div>
//   )
// }

'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

//######################## TYPES  #############################################
import { HeaderClientProps, MenuItem } from '@/models/Header'

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  //##################### STATE  ##############################################
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [activeMenu, setActiveMenu] = useState<MenuItem | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()
  let menuTimeout: NodeJS.Timeout

  //##################### HELPER TO GET IMAGE URL SAFELY #####################
  const getImageUrl = (imageObj: any) => {
    if (!imageObj || typeof imageObj !== 'object') return ''
    if (imageObj.url) return imageObj.url
    if (imageObj.filename) return `/media/${imageObj.filename}`
    return ''
  }

  // 🌟 HELPER TO GET ALT TEXT SAFELY (TS Fix)
  const getAltText = (imageObj: any, fallback: string) => {
    if (
      imageObj &&
      typeof imageObj === 'object' &&
      'alt' in imageObj &&
      typeof imageObj.alt === 'string'
    ) {
      return imageObj.alt
    }
    return fallback
  }

  //##################### INITIALIZATION #######################################
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setMenuItems(
          (data?.navItems || []).map((item: any) => {
            const imgUrl = getImageUrl(item?.link?.contentImage)
            return {
              label: item.link.label,
              link: item.link.reference?.value?.slug
                ? `/${item.link.reference.value.slug}`
                : item.link.url || '#',
              content: Array.isArray(item?.link?.content)
                ? item.link.content.filter((block: any) => block.title && block.desc && block.link)
                : [],
              contentImage: imgUrl
                ? {
                    filename: item.link.contentImage.filename,
                    mimeType: item.link.contentImage.mimeType,
                    url: imgUrl,
                  }
                : undefined,
            }
          }),
        )
      } catch (error) {
        console.error('Failed to fetch menu items', error)
      }
    }

    fetchMenuItems()
  }, [data])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  //############################# HELPER FUNCTIONS ###############################
  const handleMenuEnter = (item: MenuItem) => {
    clearTimeout(menuTimeout)
    setActiveMenu(item)
  }

  const handleMenuLeave = () => {
    menuTimeout = setTimeout(() => {
      setActiveMenu(null)
    }, 200)
  }

  // Logo URLs
  const mainLogoUrl = getImageUrl(data?.logo)
  const secondaryLogoUrl = getImageUrl(data?.secondarylogo)

  // Alt Texts (Safely Handled)
  const mainLogoAlt = getAltText(data?.logo, 'Site Logo')
  const secondaryLogoAlt = getAltText(data?.secondarylogo, 'Secondary Logo')

  //#################### RENDER UI #################################################
  return (
    <div className="w-full">
      <header
        className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
          scrolled ? 'bg-white shadow-md' : 'bg-transparent'
        }`}
      >
        {/* #################### DESKTOP MENU NAVBAR ########################### */}
        <nav className="relative hidden w-full flex-col md:flex" onMouseLeave={handleMenuLeave}>
          <div
            className={`grid grid-cols-3 items-center px-8 py-5 transition-all duration-300 ${
              activeMenu ? 'bg-white shadow-md' : ''
            }`}
          >
            {/* LOGO */}
            <div className="flex justify-start">
              <a href="https://www.superchennai.com/" aria-label="Home">
                {mainLogoUrl && (
                  <img
                    src={mainLogoUrl}
                    alt={mainLogoAlt}
                    width={150}
                    height={60}
                    className="h-auto w-[100px] object-contain"
                  />
                )}
              </a>
            </div>

            {/* DESKTOP MENU CENTER */}
            <div className="flex justify-center">
              <ul className="flex items-center gap-8">
                {menuItems.map((item, i) => (
                  <li
                    key={i}
                    className="cursor-pointer text-sm font-medium uppercase tracking-wide text-black transition hover:text-gray-600"
                    onMouseEnter={() => handleMenuEnter(item)}
                  >
                    <Link href={item.link}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex justify-end">
              <a href="/" aria-label="Home">
                {secondaryLogoUrl && (
                  <img
                    src={secondaryLogoUrl}
                    alt={secondaryLogoAlt}
                    width={150}
                    height={60}
                    className="h-auto w-[100px] object-contain"
                  />
                )}
              </a>
            </div>
          </div>

          {/* #################### HOVER MENU ########################### */}
          <AnimatePresence mode="wait">
            {activeMenu && (
              <motion.div
                key={activeMenu.label}
                className="absolute top-full left-0 hidden w-full bg-white shadow-2xl md:block"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <motion.div
                  className="mx-auto flex max-w-7xl items-start justify-between gap-12 px-10 py-12"
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  variants={{
                    hidden: {},
                    show: {
                      transition: {
                        staggerChildren: 0.07,
                        delayChildren: 0.1,
                      },
                    },
                  }}
                >
                  {/* MENU CONTENT */}
                  <div className="grid flex-1 grid-cols-2 gap-8">
                    {activeMenu.content.map((block, index) => (
                      <motion.div
                        key={index}
                        className="cursor-pointer rounded-2xl border border-gray-100 p-5 transition hover:bg-gray-50"
                        variants={{
                          hidden: { opacity: 0, y: 10 },
                          show: { opacity: 1, y: 0 },
                        }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        onClick={() => {
                          const linkPath = block.link.startsWith('/')
                            ? block.link
                            : `/${block.link}`

                          if (activeMenu?.link) {
                            sessionStorage.setItem('parentSlug', activeMenu.link)
                          }

                          router.push(linkPath)
                          setActiveMenu(null)

                          window.scrollTo({
                            top: 0,
                            behavior: 'smooth',
                          })
                        }}
                      >
                        <h4 className="mb-2 text-lg font-semibold text-black">{block.title}</h4>
                        <p className="text-sm leading-relaxed text-gray-600">{block.desc}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* IMAGE */}
                  {activeMenu?.contentImage?.url && (
                    <div className="w-[320px] overflow-hidden rounded-3xl">
                      <img
                        className="h-full w-full object-cover"
                        src={activeMenu.contentImage.url}
                        alt="Menu Content"
                      />
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* #################### MOBILE NAVBAR ########################### */}
        <div className="flex items-center justify-between bg-white px-4 py-3 shadow-sm md:hidden mobileeebannerrrsss">
          <div className="flex h-10 w-10 items-center justify-center mobilebannerrrlayouuttt">
            <Link href="https://www.superchennai.com/">
              {mainLogoUrl && (
                <img
                  src={mainLogoUrl}
                  alt={mainLogoAlt}
                  className="max-h-[150px] object-contain superchennailogoosizeee"
                />
              )}
            </Link>
          </div>

          <div className="flex h-10 w-10 items-center justify-center mobilebannerrrlayouuttt">
            <Link href="/">
              {secondaryLogoUrl && (
                <img
                  src={secondaryLogoUrl}
                  alt={secondaryLogoAlt}
                  className="max-h-[150px] object-contain superchennailogoosizeee"
                />
              )}
            </Link>
          </div>
        </div>
      </header>
    </div>
  )
}
