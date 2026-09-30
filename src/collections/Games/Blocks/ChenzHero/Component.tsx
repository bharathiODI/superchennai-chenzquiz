'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './styles.module.css'

export type ChenzHeroBlockProps = {
  eyebrow?: string
  subtitle?: string
  ctaLabel?: string
  ctaUrl?: string
  defaultLogoUrl?: string // Default logo if user hasn't uploaded one
  footerText?: string
  interactionEnabled?: boolean
}

export const ChenzHeroBlock: React.FC<ChenzHeroBlockProps> = ({
  eyebrow = 'The Ultimate Brain Battle :: 2026',
  subtitle = 'Test your knowledge, challenge friends, and climb the global leaderboards.',
  ctaLabel = 'Play Quiz Now',
  ctaUrl = '/play',
  defaultLogoUrl = '/Chenz Quiz.jpg.jpg', // Placeholder for the uploaded logo
  footerText = 'Global Arena',
  interactionEnabled = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const blobRef = useRef<HTMLDivElement>(null)
  const displacementRef = useRef<SVGFEDisplacementMapElement>(null)

  // State for Logo Upload functionality
  const [logoSrc, setLogoSrc] = useState<string>(defaultLogoUrl)
  // Dynamic Background Color state for magic hover shifting
  const [bgGradient, setBgGradient] = useState<string>('#0d061f')

  useEffect(() => {
    if (!interactionEnabled) return

    const container = containerRef.current
    const blob = blobRef.current
    const displacement = displacementRef.current

    if (!container || !blob) return

    const isTouch = window.matchMedia('(pointer: coarse)').matches
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isTouch || reducedMotion) return

    let targetX = 50
    let targetY = 50
    let currentBlobX = 0
    let currentBlobY = 0
    let currentDistortion = 8
    let raf = 0

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = ((event.clientX - rect.left) / rect.width) * 100
      const y = ((event.clientY - rect.top) / rect.height) * 100

      targetX = Math.max(0, Math.min(100, x))
      targetY = Math.max(0, Math.min(100, y))

      currentBlobX = (targetX - 50) * 0.6
      currentBlobY = (targetY - 50) * 0.6

      // Shift background gradients dynamically based on mouse placement
      if (x < 33) {
        setBgGradient('radial-gradient(circle at 20% 30%, #120338 0%, #0d061f 100%)')
      } else if (x < 66) {
        setBgGradient('radial-gradient(circle at 50% 50%, #22022b 0%, #0d061f 100%)')
      } else {
        setBgGradient('radial-gradient(circle at 80% 70%, #022033 0%, #0d061f 100%)')
      }
    }

    const animate = () => {
      if (blob) {
        blob.style.transform = `translate3d(${currentBlobX}px, ${currentBlobY}px, 0)`
      }

      const targetDistortion = Math.abs(targetX - 50) * 0.2 + 8
      currentDistortion += (targetDistortion - currentDistortion) * 0.1

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
  }, [interactionEnabled])

  // Handle custom file upload for the logo
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const objectUrl = URL.createObjectURL(file)
      setLogoSrc(objectUrl)
    }
  }

  return (
    <section
      ref={containerRef}
      className={styles.heroSection}
      style={{ background: bgGradient }}
    >
      {/* Hidden SVG Filter for Water/Paint Liquid Distortion */}
      <svg className="absolute w-0 h-0 overflow-hidden" aria-hidden="true">
        <filter id="magicLiquidWarp">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.015"
            numOctaves="3"
            result="noise"
          />
          <feDisplacementMap
            ref={displacementRef}
            in="SourceGraphic"
            in2="noise"
            scale="10"
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

        {/* ADMIN LOGO UPLOAD INPUT TOOL */}
        <div className="flex flex-col items-end gap-2">
          <div className={styles.menu}>CHENZ STUDIO ::</div>
          <label className="text-[10px] text-cyan-400 cursor-pointer bg-white/10 px-3 py-1.5 rounded-full hover:bg-white/20 transition">
            📁 Change Logo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoUpload}
            />
          </label>
        </div>
      </div>

      {/* MAIN HERO VISUAL */}
      <div className={styles.heroVisual}>
        {/* MAGIC GLOWING MULTI-COLOR BLOB BACKGROUND */}
        <div ref={blobRef} className={styles.liquidBlob} />

        {/* UPLOADED / DEFAULT LOGO WITH FLOATING ANIMATION */}
        <div className={styles.logoWrapper}>
          {logoSrc && (
            <Image
              src={logoSrc}
              alt="Chenz Quiz Logo"
              width={700}
              height={300}
              priority
              className={styles.logoImage}
            />
          )}
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