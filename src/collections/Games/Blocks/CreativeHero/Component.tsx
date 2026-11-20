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

// // // //   const scaleClass =
// // // //     imageScale === '0.8' ? 'scale-80 max-w-[280px]' : imageScale === '1.2' ? 'scale-120 max-w-[460px]' : 'max-w-[360px]'

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

// // //   const scaleClass =
// // //     imageScale === '0.8'
// // //       ? 'scale-80 max-w-[280px]'
// // //       : imageScale === '1.2'
// // //         ? 'scale-120 max-w-[460px]'
// // //         : 'max-w-[360px]'

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

// //     raf = requestAnimationFrame(animate)

// //       cancelAnimationFrame(raf)
// //     }
// //   }, [interactionEnabled, intensity])

// //         <div className={styles.menu}>
// //           MENU ::
// //         </div>
// //       </div>

// //       {/* HERO */}
// //       <div className={styles.heroVisual}>

// //         {/* BASE BLACK TEXT */}
// //         <h1 className={styles.heroHeading}>
// //           {heading}
// //         </h1>

// //       {/* BOTTOM */}
// //       <div className={styles.bottomBar}>
// //         <p>{subtitle}</p>

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

//       reveal.style.setProperty('--mouse-x', `${currentX}%`)
//       reveal.style.setProperty('--mouse-y', `${currentY}%`)

//       blob.style.transform = `translate3d(${currentBlobX}px, ${currentBlobY}px, 0)`

//       raf = requestAnimationFrame(animate)
//     }

//     container.addEventListener('mousemove', handleMouseMove, { passive: true })
//     raf = requestAnimationFrame(animate)

//       {/* HERO VISUAL AREA */}
//       <div className={styles.heroVisual}>
//         {/* ORGANIC BLACK BLOB (Reveals on Hover) */}
//         <div ref={blobRef} className={styles.liquidBlob} />

//         {/* BASE OUTLINE TYPOGRAPHY */}
//         <h1 className={styles.heroHeading}>{heading}</h1>

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
