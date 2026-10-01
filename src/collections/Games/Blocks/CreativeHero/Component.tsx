// // // // 'use client'

// // // // import React, { useEffect, useRef } from 'react'
// // // // import Image from 'next/image'
// // // // import Link from 'next/link'
// // // // import styles from './styles.module.css'

// // // // type MediaObject = {
// // // //   url: string
// // // //   alt?: string
// // // //   width?: number
// // // //   height?: number
// // // // }

// // // // export type CreativeHeroBlockProps = {
// // // //   eyebrow?: string
// // // //   heading: string
// // // //   subtitle?: string
// // // //   ctaLabel?: string
// // // //   ctaUrl?: string
// // // //   image: MediaObject | string
// // // //   imageAlt?: string
// // // //   imageScale?: '0.8' | '1' | '1.2'
// // // //   imageRotation?: string
// // // //   backgroundColor?: string
// // // //   textColor?: string
// // // //   interactionEnabled?: boolean
// // // //   animationIntensity?: 'low' | 'medium' | 'high'
// // // //   footerText?: string
// // // // }

// // // // export const CreativeHeroBlock: React.FC<CreativeHeroBlockProps> = ({
// // // //   eyebrow = 'Creative Studio',
// // // //   heading = 'NOTHING',
// // // //   subtitle,
// // // //   ctaLabel,
// // // //   ctaUrl,
// // // //   image,
// // // //   imageAlt = 'Hero Image',
// // // //   imageScale = '1',
// // // //   imageRotation = 'rotate-0',
// // // //   backgroundColor = '#ffffff',
// // // //   textColor = '#0f172a',
// // // //   interactionEnabled = true,
// // // //   animationIntensity = 'medium',
// // // //   footerText,
// // // // }) => {
// // // //   const containerRef = useRef<HTMLDivElement>(null)
// // // //   const blobRef = useRef<HTMLDivElement>(null)
// // // //   const imageWrapperRef = useRef<HTMLDivElement>(null)

// // // //   const imageUrl = typeof image === 'object' && image?.url ? image.url : (image as string)
// // // //   const altText = (typeof image === 'object' && image?.alt) || imageAlt

// // // //   // Multiplier based on intensity setting
// // // //   const intensityFactor =
// // // //     animationIntensity === 'low' ? 0.05 : animationIntensity === 'high' ? 0.25 : 0.12

// // // //   useEffect(() => {
// // // //     if (!interactionEnabled) return

// // // //     // Check for touch device or reduced motion preferences
// // // //     const isTouchScreen = window.matchMedia('(pointer: coarse)').matches
// // // //     const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// // // //     if (isTouchScreen || prefersReducedMotion) return

// // // //     const container = containerRef.current
// // // //     const blob = blobRef.current
// // // //     const imgWrap = imageWrapperRef.current

// // // //     if (!container || !blob || !imgWrap) return

// // // //     let mouseX = 0
// // // //     let mouseY = 0
// // // //     let currentBlobX = 0
// // // //     let currentBlobY = 0
// // // //     let currentImgX = 0
// // // //     let currentImgY = 0
// // // //     let animationFrameId: number

// // // //     const handleMouseMove = (e: MouseEvent) => {
// // // //       const rect = container.getBoundingClientRect()
// // // //       // Calculate mouse position relative to container center (-0.5 to 0.5)
// // // //       mouseX = (e.clientX - rect.left) / rect.width - 0.5
// // // //       mouseY = (e.clientY - rect.top) / rect.height - 0.5
// // // //     }

// // // //     const render = () => {
// // // //       // Lerp (Linear Interpolation) for buttery smooth 60fps tracking
// // // //       currentBlobX += (mouseX * 50 * intensityFactor - currentBlobX) * 0.08
// // // //       currentBlobY += (mouseY * 50 * intensityFactor - currentBlobY) * 0.08

// // // //       currentImgX += (mouseX * 90 * intensityFactor - currentImgX) * 0.06
// // // //       currentImgY += (mouseY * 90 * intensityFactor - currentImgY) * 0.06

// // // //       blob.style.transform = `translate3d(${currentBlobX}px, ${currentBlobY}px, 0) scale(1.02)`
// // // //       imgWrap.style.transform = `translate3d(${currentImgX}px, ${currentImgY}px, 0)`

// // // //       animationFrameId = requestAnimationFrame(render)
// // // //     }

// // // //     container.addEventListener('mousemove', handleMouseMove, { passive: true })
// // // //     animationFrameId = requestAnimationFrame(render)

// // // //     return () => {
// // // //       container.removeEventListener('mousemove', handleMouseMove)
// // // //       cancelAnimationFrame(animationFrameId)
// // // //     }
// // // //   }, [interactionEnabled, intensityFactor])

// // // //   const scaleClass =
// // // //     imageScale === '0.8' ? 'scale-80 max-w-[280px]' : imageScale === '1.2' ? 'scale-120 max-w-[460px]' : 'max-w-[360px]'

// // // //   return (
// // // //     <section
// // // //       ref={containerRef}
// // // //       className={`relative w-full min-h-[90vh] flex flex-col justify-between overflow-hidden px-6 lg:px-16 py-12 selection:bg-black selection:text-white ${styles.heroSection}`}
// // // //       style={{ backgroundColor, color: textColor }}
// // // //     >
// // // //       {/* Top Navigation / Header Info */}
// // // //       <div className="w-full flex justify-between items-start z-30">
// // // //         <div>
// // // //           <span className="text-xs uppercase tracking-widest font-mono opacity-70 block mb-3">
// // // //             {eyebrow}
// // // //           </span>
// // // //           {ctaLabel && ctaUrl && (
// // // //             <Link
// // // //               href={ctaUrl}
// // // //               className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold border border-current px-5 py-2.5 rounded-full transition-all hover:bg-current hover:text-white"
// // // //             >
// // // //               <span>{ctaLabel}</span>
// // // //               <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // // //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
// // // //               </svg>
// // // //             </Link>
// // // //           )}
// // // //         </div>
// // // //         <div className="text-right">
// // // //           <span className="text-xs font-mono uppercase tracking-widest opacity-70">
// // // //             MENU ::
// // // //           </span>
// // // //         </div>
// // // //       </div>

// // // //       {/* Center Composition: Oversized Typography + Blob + Overlapping Image */}
// // // //       <div className="relative my-auto py-12 flex items-center justify-center w-full">
// // // //         {/* Organic Black Blob Layer */}
// // // //         <div
// // // //           ref={blobRef}
// // // //           className={`absolute z-10 w-[320px] sm:w-[450px] lg:w-[560px] aspect-square bg-black transition-transform duration-100 ease-out pointer-events-none ${styles.organicBlob}`}
// // // //         />

// // // //         {/* Huge Brutalist Heading */}
// // // //         <h1
// // // //           className={`relative z-20 font-black uppercase text-center tracking-tighter leading-[0.8] select-none ${styles.heroHeading}`}
// // // //         >
// // // //           {heading}
// // // //         </h1>

// // // //         {/* Overlapping Hero Image */}
// // // //         <div
// // // //           ref={imageWrapperRef}
// // // //           className={`absolute z-30 transition-transform duration-100 ease-out w-full ${scaleClass} ${imageRotation}`}
// // // //         >
// // // //           <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10">
// // // //             {imageUrl ? (
// // // //               <Image
// // // //                 src={imageUrl}
// // // //                 alt={altText}
// // // //                 fill
// // // //                 priority
// // // //                 sizes="(max-width: 768px) 80vw, 400px"
// // // //                 className="object-cover"
// // // //               />
// // // //             ) : (
// // // //               <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-white text-xs">
// // // //                 No Image Provided
// // // //               </div>
// // // //             )}
// // // //           </div>
// // // //         </div>
// // // //       </div>

// // // //       {/* Bottom Footer Info */}
// // // //       <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 z-30 pt-6 border-t border-current/10">
// // // //         <p className="text-xs font-mono opacity-80 max-w-xs">{subtitle}</p>
// // // //         {footerText && <span className="text-xs font-mono uppercase tracking-widest opacity-60">{footerText}</span>}
// // // //       </div>
// // // //     </section>
// // // //   )
// // // // }

// // // 'use client'

// // // import React, { useEffect, useRef } from 'react'
// // // import Image from 'next/image'
// // // import Link from 'next/link'
// // // import styles from './styles.module.css'

// // // type MediaObject = {
// // //   url: string
// // //   alt?: string
// // //   width?: number
// // //   height?: number
// // // }

// // // export type CreativeHeroBlockProps = {
// // //   eyebrow?: string
// // //   heading: string
// // //   subtitle?: string
// // //   ctaLabel?: string
// // //   ctaUrl?: string
// // //   image: MediaObject | string
// // //   imageAlt?: string
// // //   imageScale?: '0.8' | '1' | '1.2'
// // //   imageRotation?: string
// // //   backgroundColor?: string
// // //   textColor?: string
// // //   interactionEnabled?: boolean
// // //   animationIntensity?: 'low' | 'medium' | 'high'
// // //   footerText?: string
// // // }

// // // export const CreativeHeroBlock: React.FC<CreativeHeroBlockProps> = ({
// // //   eyebrow = 'Creative Studio',
// // //   heading = 'NOTHING',
// // //   subtitle,
// // //   ctaLabel,
// // //   ctaUrl,
// // //   image,
// // //   imageAlt = 'Hero Image',
// // //   imageScale = '1',
// // //   imageRotation = 'rotate-0',
// // //   backgroundColor = '#ffffff',
// // //   textColor = '#0f172a',
// // //   interactionEnabled = true,
// // //   animationIntensity = 'medium',
// // //   footerText,
// // // }) => {
// // //   const containerRef = useRef<HTMLDivElement>(null)
// // //   const blobRef = useRef<HTMLDivElement>(null)
// // //   const imageWrapperRef = useRef<HTMLDivElement>(null)
// // //   const displacementRef = useRef<SVGFEDisplacementMapElement>(null)

// // //   const imageUrl = typeof image === 'object' && image?.url ? image.url : (image as string)
// // //   const altText = (typeof image === 'object' && image?.alt) || imageAlt

// // //   const intensityFactor =
// // //     animationIntensity === 'low' ? 0.05 : animationIntensity === 'high' ? 0.25 : 0.12

// // //   useEffect(() => {
// // //     if (!interactionEnabled) return

// // //     const isTouchScreen = window.matchMedia('(pointer: coarse)').matches
// // //     const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// // //     if (isTouchScreen || prefersReducedMotion) return

// // //     const container = containerRef.current
// // //     const blob = blobRef.current
// // //     const imgWrap = imageWrapperRef.current
// // //     const displacement = displacementRef.current

// // //     if (!container || !blob || !imgWrap) return

// // //     let mouseX = 0
// // //     let mouseY = 0
// // //     let currentBlobX = 0
// // //     let currentBlobY = 0
// // //     let currentImgX = 0
// // //     let currentImgY = 0
// // //     let currentDistortion = 10
// // //     let animationFrameId: number

// // //     const handleMouseMove = (e: MouseEvent) => {
// // //       const rect = container.getBoundingClientRect()
// // //       mouseX = (e.clientX - rect.left) / rect.width - 0.5
// // //       mouseY = (e.clientY - rect.top) / rect.height - 0.5
// // //     }

// // //     const render = () => {
// // //       // Smooth tracking with lerp
// // //       currentBlobX += (mouseX * 60 * intensityFactor - currentBlobX) * 0.08
// // //       currentBlobY += (mouseY * 60 * intensityFactor - currentBlobY) * 0.08

// // //       currentImgX += (mouseX * 100 * intensityFactor - currentImgX) * 0.06
// // //       currentImgY += (mouseY * 100 * intensityFactor - currentImgY) * 0.06

// // //       // Dynamic water ripple distortion intensity based on mouse movement speed/distance
// // //       const targetDistortion = Math.abs(mouseX) * 50 * (intensityFactor * 5) + 10
// // //       currentDistortion += (targetDistortion - currentDistortion) * 0.1

// // //       blob.style.transform = `translate3d(${currentBlobX}px, ${currentBlobY}px, 0) scale(1.02)`
// // //       imgWrap.style.transform = `translate3d(${currentImgX}px, ${currentImgY}px, 0)`

// // //       if (displacement) {
// // //         displacement.scale.baseVal = currentDistortion
// // //       }

// // //       animationFrameId = requestAnimationFrame(render)
// // //     }

// // //     container.addEventListener('mousemove', handleMouseMove, { passive: true })
// // //     animationFrameId = requestAnimationFrame(render)

// // //     return () => {
// // //       container.removeEventListener('mousemove', handleMouseMove)
// // //       cancelAnimationFrame(animationFrameId)
// // //     }
// // //   }, [interactionEnabled, intensityFactor])

// // //   const scaleClass =
// // //     imageScale === '0.8'
// // //       ? 'scale-80 max-w-[280px]'
// // //       : imageScale === '1.2'
// // //         ? 'scale-120 max-w-[460px]'
// // //         : 'max-w-[360px]'

// // //   return (
// // //     <section
// // //       ref={containerRef}
// // //       className={`relative w-full min-h-[90vh] flex flex-col justify-between overflow-hidden px-6 lg:px-16 py-12 selection:bg-black selection:text-white ${styles.heroSection}`}
// // //       style={{ backgroundColor, color: textColor }}
// // //     >
// // //       {/* Hidden SVG Filter for Water Ripple / Liquid Distortion Effect */}
// // //       <svg className="absolute w-0 h-0 overflow-hidden" aria-hidden="true">
// // //         <filter id="waterWarp">
// // //           <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" result="noise" />
// // //           <feDisplacementMap
// // //             ref={displacementRef}
// // //             in="SourceGraphic"
// // //             in2="noise"
// // //             scale="10"
// // //             xChannelSelector="R"
// // //             yChannelSelector="G"
// // //           />
// // //         </filter>
// // //       </svg>

// // //       {/* Top Navigation / Header Info */}
// // //       <div className="w-full flex justify-between items-start z-30">
// // //         <div>
// // //           <span className="text-xs uppercase tracking-widest font-mono opacity-70 block mb-3">
// // //             {eyebrow}
// // //           </span>
// // //           {ctaLabel && ctaUrl && (
// // //             <Link
// // //               href={ctaUrl}
// // //               className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold border border-current px-5 py-2.5 rounded-full transition-all hover:bg-current hover:text-white"
// // //             >
// // //               <span>{ctaLabel}</span>
// // //               <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // //                 <path
// // //                   strokeLinecap="round"
// // //                   strokeLinejoin="round"
// // //                   strokeWidth="2"
// // //                   d="M14 5l7 7m0 0l-7 7m7-7H3"
// // //                 />
// // //               </svg>
// // //             </Link>
// // //           )}
// // //         </div>
// // //         <div className="text-right">
// // //           <span className="text-xs font-mono uppercase tracking-widest opacity-70">MENU ::</span>
// // //         </div>
// // //       </div>

// // //       {/* Center Composition with Water Liquid Filter Applied */}
// // //       <div
// // //         className={`relative my-auto py-12 flex items-center justify-center w-full ${styles.liquidContainer}`}
// // //       >
// // //         {/* Organic Black Blob Layer with Liquid Filter Effect */}
// // //         <div
// // //           ref={blobRef}
// // //           className={`absolute z-10 w-[320px] sm:w-[450px] lg:w-[560px] aspect-square bg-black transition-transform duration-100 ease-out pointer-events-none ${styles.organicBlob}`}
// // //         />

// // //         {/* Huge Brutalist Heading */}
// // //         <h1
// // //           className={`relative z-20 font-black uppercase text-center tracking-tighter leading-[0.8] select-none ${styles.heroHeading}`}
// // //         >
// // //           {heading}
// // //         </h1>

// // //         {/* Overlapping Hero Image */}
// // //         <div
// // //           ref={imageWrapperRef}
// // //           className={`absolute z-30 transition-transform duration-100 ease-out w-full ${scaleClass} ${imageRotation}`}
// // //         >
// // //           <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10">
// // //             {imageUrl ? (
// // //               <Image
// // //                 src={imageUrl}
// // //                 alt={altText}
// // //                 fill
// // //                 priority
// // //                 sizes="(max-width: 768px) 80vw, 400px"
// // //                 className="object-cover"
// // //               />
// // //             ) : (
// // //               <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-white text-xs">
// // //                 No Image Provided
// // //               </div>
// // //             )}
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Bottom Footer Info */}
// // //       <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 z-30 pt-6 border-t border-current/10">
// // //         <p className="text-xs font-mono opacity-80 max-w-xs">{subtitle}</p>
// // //         {footerText && (
// // //           <span className="text-xs font-mono uppercase tracking-widest opacity-60">
// // //             {footerText}
// // //           </span>
// // //         )}
// // //       </div>
// // //     </section>
// // //   )
// // // }
// // 'use client'

// // import React, { useEffect, useRef } from 'react'
// // import Image from 'next/image'
// // import Link from 'next/link'
// // import styles from './styles.module.css'

// // type MediaObject = {
// //   url: string
// //   alt?: string
// //   width?: number
// //   height?: number
// // }

// // export type CreativeHeroBlockProps = {
// //   eyebrow?: string
// //   heading: string
// //   subtitle?: string
// //   ctaLabel?: string
// //   ctaUrl?: string
// //   image: MediaObject | string
// //   imageAlt?: string
// //   imageScale?: '0.8' | '1' | '1.2'
// //   imageRotation?: string
// //   backgroundColor?: string
// //   textColor?: string
// //   interactionEnabled?: boolean
// //   animationIntensity?: 'low' | 'medium' | 'high'
// //   footerText?: string
// // }

// // export const CreativeHeroBlock: React.FC<CreativeHeroBlockProps> = ({
// //   eyebrow = 'Creative Studio',
// //   heading = 'NOTHING',
// //   subtitle,
// //   ctaLabel,
// //   ctaUrl,
// //   image,
// //   imageAlt = 'Hero Image',
// //   imageScale = '1',
// //   imageRotation = 'rotate-0',
// //   backgroundColor = '#ffffff',
// //   textColor = '#000000',
// //   interactionEnabled = true,
// //   animationIntensity = 'medium',
// //   footerText,
// // }) => {
// //   const containerRef = useRef<HTMLDivElement>(null)
// //   const revealRef = useRef<HTMLDivElement>(null)
// //   const blobRef = useRef<HTMLDivElement>(null)

// //   const imageUrl =
// //     typeof image === 'object' && image?.url
// //       ? image.url
// //       : (image as string)

// //   const altText =
// //     (typeof image === 'object' && image?.alt) || imageAlt

// //   const intensity =
// //     animationIntensity === 'low'
// //       ? 0.5
// //       : animationIntensity === 'high'
// //         ? 1.5
// //         : 1

// //   useEffect(() => {
// //     if (!interactionEnabled) return

// //     const container = containerRef.current
// //     const reveal = revealRef.current
// //     const blob = blobRef.current

// //     if (!container || !reveal || !blob) return

// //     const isTouch =
// //       window.matchMedia('(pointer: coarse)').matches

// //     const reducedMotion =
// //       window.matchMedia(
// //         '(prefers-reduced-motion: reduce)',
// //       ).matches

// //     if (isTouch || reducedMotion) return

// //     let targetX = 50
// //     let targetY = 50

// //     let currentX = 50
// //     let currentY = 50

// //     let targetBlobX = 0
// //     let targetBlobY = 0

// //     let currentBlobX = 0
// //     let currentBlobY = 0

// //     let raf = 0

// //     const handleMouseMove = (event: MouseEvent) => {
// //       const rect = container.getBoundingClientRect()

// //       const x =
// //         ((event.clientX - rect.left) / rect.width) * 100

// //       const y =
// //         ((event.clientY - rect.top) / rect.height) * 100

// //       targetX = Math.max(0, Math.min(100, x))
// //       targetY = Math.max(0, Math.min(100, y))

// //       targetBlobX =
// //         (targetX - 50) * 0.7 * intensity

// //       targetBlobY =
// //         (targetY - 50) * 0.7 * intensity
// //     }

// //     const animate = () => {
// //       currentX +=
// //         (targetX - currentX) * 0.08

// //       currentY +=
// //         (targetY - currentY) * 0.08

// //       currentBlobX +=
// //         (targetBlobX - currentBlobX) * 0.08

// //       currentBlobY +=
// //         (targetBlobY - currentBlobY) * 0.08

// //       /*
// //        * The image inside the text follows the mouse.
// //        */
// //       reveal.style.setProperty(
// //         '--mouse-x',
// //         `${currentX}%`,
// //       )

// //       reveal.style.setProperty(
// //         '--mouse-y',
// //         `${currentY}%`,
// //       )

// //       /*
// //        * Organic black shape follows mouse
// //        * with a slightly different speed.
// //        */
// //       blob.style.transform = `
// //         translate3d(
// //           ${currentBlobX}px,
// //           ${currentBlobY}px,
// //           0
// //         )
// //       `

// //       raf = requestAnimationFrame(animate)
// //     }

// //     container.addEventListener(
// //       'mousemove',
// //       handleMouseMove,
// //       { passive: true },
// //     )

// //     raf = requestAnimationFrame(animate)

// //     return () => {
// //       container.removeEventListener(
// //         'mousemove',
// //         handleMouseMove,
// //       )

// //       cancelAnimationFrame(raf)
// //     }
// //   }, [interactionEnabled, intensity])

// //   return (
// //     <section
// //       ref={containerRef}
// //       className={styles.heroSection}
// //       style={{
// //         backgroundColor,
// //         color: textColor,
// //       }}
// //     >
// //       {/* TOP */}
// //       <div className={styles.topBar}>
// //         <div>
// //           {eyebrow && (
// //             <div className={styles.eyebrow}>
// //               {eyebrow}
// //             </div>
// //           )}

// //           {ctaLabel && ctaUrl && (
// //             <Link
// //               href={ctaUrl}
// //               className={styles.cta}
// //             >
// //               <span>{ctaLabel}</span>

// //               <span className={styles.arrow}>
// //                 →
// //               </span>
// //             </Link>
// //           )}
// //         </div>

// //         <div className={styles.menu}>
// //           MENU ::
// //         </div>
// //       </div>

// //       {/* HERO */}
// //       <div className={styles.heroVisual}>

// //         {/* BLACK LIQUID SHAPE */}
// //         <div
// //           ref={blobRef}
// //           className={styles.liquidBlob}
// //         />

// //         {/* BASE BLACK TEXT */}
// //         <h1 className={styles.heroHeading}>
// //           {heading}
// //         </h1>

// //         {/* IMAGE INSIDE TEXT */}
// //         <div
// //           ref={revealRef}
// //           className={styles.textImageReveal}
// //           style={
// //             {
// //               '--hero-image': `url(${imageUrl})`,
// //               '--image-scale':
// //                 imageScale === '0.8'
// //                   ? 0.8
// //                   : imageScale === '1.2'
// //                     ? 1.2
// //                     : 1,
// //             } as React.CSSProperties
// //           }
// //         >
// //           <div className={styles.maskedText}>
// //             {heading}
// //           </div>

// //           {/* floating image */}
// //           <div
// //             className={`${styles.floatingImage} ${imageRotation}`}
// //           >
// //             {imageUrl && (
// //               <Image
// //                 src={imageUrl}
// //                 alt={altText}
// //                 fill
// //                 priority
// //                 sizes="100vw"
// //                 className={styles.image}
// //               />
// //             )}
// //           </div>
// //         </div>
// //       </div>

// //       {/* BOTTOM */}
// //       <div className={styles.bottomBar}>
// //         <p>{subtitle}</p>

// //         {footerText && (
// //           <span>
// //             {footerText}
// //           </span>
// //         )}
// //       </div>
// //     </section>
// //   )
// // }

// 'use client'

// import React, { useEffect, useRef } from 'react'
// import Link from 'next/link'
// import styles from './styles.module.css'

// type MediaObject = {
//   url: string
//   alt?: string
//   width?: number
//   height?: number
// }

// export type CreativeHeroBlockProps = {
//   eyebrow?: string
//   heading: string
//   subtitle?: string
//   ctaLabel?: string
//   ctaUrl?: string
//   image: MediaObject | string
//   imageAlt?: string
//   imageScale?: '0.8' | '1' | '1.2'
//   imageRotation?: string
//   backgroundColor?: string
//   textColor?: string
//   interactionEnabled?: boolean
//   animationIntensity?: 'low' | 'medium' | 'high'
//   footerText?: string
// }

// export const CreativeHeroBlock: React.FC<CreativeHeroBlockProps> = ({
//   eyebrow = 'Not a style, a perspective.',
//   heading = 'NOTHING',
//   subtitle = 'Because Nothin’ is Everythin’.',
//   ctaLabel = 'Book a Call',
//   ctaUrl = '/contact',
//   image,
//   backgroundColor = '#ffffff',
//   textColor = '#000000',
//   interactionEnabled = true,
//   animationIntensity = 'medium',
//   footerText = 'Creative studio in Paris',
// }) => {
//   const containerRef = useRef<HTMLDivElement>(null)
//   const revealRef = useRef<HTMLDivElement>(null)
//   const blobRef = useRef<HTMLDivElement>(null)

//   const imageUrl = typeof image === 'object' && image?.url ? image.url : (image as string)
//   const intensity = animationIntensity === 'low' ? 0.4 : animationIntensity === 'high' ? 1.4 : 0.9

//   useEffect(() => {
//     if (!interactionEnabled) return

//     const container = containerRef.current
//     const reveal = revealRef.current
//     const blob = blobRef.current

//     if (!container || !reveal || !blob) return

//     const isTouch = window.matchMedia('(pointer: coarse)').matches
//     const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

//     if (isTouch || reducedMotion) return

//     let targetX = 50
//     let targetY = 50
//     let currentX = 50
//     let currentY = 50

//     let targetBlobX = 0
//     let targetBlobY = 0
//     let currentBlobX = 0
//     let currentBlobY = 0

//     let raf = 0

//     const handleMouseMove = (event: MouseEvent) => {
//       const rect = container.getBoundingClientRect()
//       const x = ((event.clientX - rect.left) / rect.width) * 100
//       const y = ((event.clientY - rect.top) / rect.height) * 100

//       targetX = Math.max(0, Math.min(100, x))
//       targetY = Math.max(0, Math.min(100, y))

//       targetBlobX = (targetX - 50) * 0.45 * intensity
//       targetBlobY = (targetY - 50) * 0.45 * intensity
//     }

//     const animate = () => {
//       currentX += (targetX - currentX) * 0.09
//       currentY += (targetY - currentY) * 0.09
//       currentBlobX += (targetBlobX - currentBlobX) * 0.09
//       currentBlobY += (targetBlobY - currentBlobY) * 0.09

//       reveal.style.setProperty('--mouse-x', `${currentX}%`)
//       reveal.style.setProperty('--mouse-y', `${currentY}%`)

//       blob.style.transform = `translate3d(${currentBlobX}px, ${currentBlobY}px, 0)`

//       raf = requestAnimationFrame(animate)
//     }

//     container.addEventListener('mousemove', handleMouseMove, { passive: true })
//     raf = requestAnimationFrame(animate)

//     return () => {
//       container.removeEventListener('mousemove', handleMouseMove)
//       cancelAnimationFrame(raf)
//     }
//   }, [interactionEnabled, intensity])

//   return (
//     <section
//       ref={containerRef}
//       className={styles.heroSection}
//       style={{
//         backgroundColor,
//         color: textColor,
//       }}
//     >
//       {/* TOP BAR */}
//       <div className={styles.topBar}>
//         <div>
//           {eyebrow && <div className={styles.eyebrow}>{eyebrow}</div>}
//           {ctaLabel && ctaUrl && (
//             <Link href={ctaUrl} className={styles.cta}>
//               <span>{ctaLabel}</span>
//               <span className={styles.arrow}>→</span>
//             </Link>
//           )}
//         </div>
//         <div className={styles.menu}>MENU ::</div>
//       </div>

//       {/* HERO VISUAL AREA */}
//       <div className={styles.heroVisual}>
//         {/* ORGANIC BLACK BLOB (Reveals on Hover) */}
//         <div ref={blobRef} className={styles.liquidBlob} />

//         {/* BASE OUTLINE TYPOGRAPHY */}
//         <h1 className={styles.heroHeading}>{heading}</h1>

//         {/* IMAGE INSIDE TEXT REVEAL LAYER (Appears on Hover) */}
//         <div
//           ref={revealRef}
//           className={styles.textImageReveal}
//           style={
//             {
//               '--hero-image': `url(${imageUrl})`,
//             } as React.CSSProperties
//           }
//         >
//           <div className={styles.maskedText}>{heading}</div>
//         </div>
//       </div>

//       {/* BOTTOM FOOTER BAR */}
//       <div className={styles.bottomBar}>
//         <p>{subtitle}</p>
//         {footerText && <span>{footerText}</span>}
//       </div>
//     </section>
//   )
// }

'use client'

import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import styles from './styles.module.css'

type MediaObject = {
  url: string
  alt?: string
  width?: number
  height?: number
}

export type CreativeHeroBlockProps = {
  eyebrow?: string
  heading: string
  subtitle?: string
  ctaLabel?: string
  ctaUrl?: string
  image: MediaObject | string
  imageAlt?: string
  imageScale?: '0.8' | '1' | '1.2'
  imageRotation?: string
  backgroundColor?: string
  textColor?: string
  interactionEnabled?: boolean
  animationIntensity?: 'low' | 'medium' | 'high'
  footerText?: string
}

export const CreativeHeroBlock: React.FC<CreativeHeroBlockProps> = ({
  eyebrow = 'Not a style, a perspective.',
  heading = 'NOTHING',
  subtitle = 'Because Nothin’ is Everythin’.',
  ctaLabel = 'Book a Call',
  ctaUrl = '/contact',
  image,
  backgroundColor = '#ffffff',
  textColor = '#000000',
  interactionEnabled = true,
  animationIntensity = 'medium',
  footerText = 'Creative studio in Paris',
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const revealRef = useRef<HTMLDivElement>(null)
  const blobRef = useRef<HTMLDivElement>(null)
  const displacementRef = useRef<SVGFEDisplacementMapElement>(null)

  const imageUrl = typeof image === 'object' && image?.url ? image.url : (image as string)
  const intensity = animationIntensity === 'low' ? 0.4 : animationIntensity === 'high' ? 1.4 : 0.9

  useEffect(() => {
    if (!interactionEnabled) return

    const container = containerRef.current
    const reveal = revealRef.current
    const blob = blobRef.current
    const displacement = displacementRef.current

    if (!container || !reveal || !blob) return

    const isTouch = window.matchMedia('(pointer: coarse)').matches
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (isTouch || reducedMotion) return

    let targetX = 50
    let targetY = 50
    let currentX = 50
    let currentY = 50

    let targetBlobX = 0
    let targetBlobY = 0
    let currentBlobX = 0
    let currentBlobY = 0
    let currentDistortion = 10

    let raf = 0

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = ((event.clientX - rect.left) / rect.width) * 100
      const y = ((event.clientY - rect.top) / rect.height) * 100

      targetX = Math.max(0, Math.min(100, x))
      targetY = Math.max(0, Math.min(100, y))

      targetBlobX = (targetX - 50) * 0.45 * intensity
      targetBlobY = (targetY - 50) * 0.45 * intensity
    }

    const animate = () => {
      currentX += (targetX - currentX) * 0.09
      currentY += (targetY - currentY) * 0.09
      currentBlobX += (targetBlobX - currentBlobX) * 0.09
      currentBlobY += (targetBlobY - currentBlobY) * 0.09

      // Dynamic water ripple distortion intensity based on movement
      const targetDistortion = Math.abs(targetX - currentX) * 4 + 10
      currentDistortion += (targetDistortion - currentDistortion) * 0.1

      reveal.style.setProperty('--mouse-x', `${currentX}%`)
      reveal.style.setProperty('--mouse-y', `${currentY}%`)

      blob.style.transform = `translate3d(${currentBlobX}px, ${currentBlobY}px, 0)`

      if (displacement) {
        displacement.scale.baseVal = currentDistortion
      }

      raf = requestAnimationFrame(animate)
    }

    container.addEventListener('mousemove', handleMouseMove, { passive: true })
    raf = requestAnimationFrame(animate)

    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(raf)
    }
  }, [interactionEnabled, intensity])

  return (
    <section
      ref={containerRef}
      className={styles.heroSection}
      style={{
        backgroundColor,
        color: textColor,
      }}
    >
      {/* Hidden SVG Filter for Water Liquid Paint Effect */}
      <svg className="absolute w-0 h-0 overflow-hidden" aria-hidden="true">
        <filter id="waterWarp">
          <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="3" result="noise" />
          <feDisplacementMap
            ref={displacementRef}
            in="SourceGraphic"
            in2="noise"
            scale="12"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      {/* TOP BAR */}
      <div className={styles.topBar}>
        <div>
          {eyebrow && <div className={styles.eyebrow}>{eyebrow}</div>}
          {ctaLabel && ctaUrl && (
            <Link href={ctaUrl} className={styles.cta}>
              <span>{ctaLabel}</span>
              <span className={styles.arrow}>→</span>
            </Link>
          )}
        </div>
        <div className={styles.menu}>MENU ::</div>
      </div>

      {/* HERO VISUAL AREA */}
      <div className={styles.heroVisual}>
        {/* ORGANIC BLACK BLOB (Paint Reveal) */}
        <div ref={blobRef} className={styles.liquidBlob} />

        {/* BASE OUTLINE TYPOGRAPHY */}
        <h1 className={styles.heroHeading}>{heading}</h1>

        {/* IMAGE INSIDE TEXT REVEAL LAYER */}
        <div
          ref={revealRef}
          className={styles.textImageReveal}
          style={
            {
              '--hero-image': `url(${imageUrl})`,
            } as React.CSSProperties
          }
        >
          <div className={styles.maskedText}>{heading}</div>
        </div>
      </div>

      {/* BOTTOM FOOTER BAR */}
      <div className={styles.bottomBar}>
        <p>{subtitle}</p>
        {footerText && <span>{footerText}</span>}
      </div>
    </section>
  )
}
