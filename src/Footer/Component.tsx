/* eslint-disable @next/next/no-img-element */

import defaultImage from '../assets/images/default/default.png'
import { getCachedGlobal } from '@/utilities/getGlobals'

export default async function Footer() {
  try {
    const footer = (await getCachedGlobal('footer', 1)()) as any
    const { copyright, companyInfo, socialMedia } = footer || {}

    return (
      <footer className="relative w-full overflow-hidden bg-[#4A154B] text-white">
        {/* =====================================================
            1. BACKGROUND ANIMATION & LIGHTING EFFECTS
        ===================================================== */}
        <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
          {/* Subtle Ambient Radial Glows */}
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl animate-pulse" />
          <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />

          {/* Golden Sun / Horizon Glow Overlay */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
        </div>

        {/* =====================================================
            2. CHENNAI OCEAN WAVE SVG ANIMATION LAYER
        ===================================================== */}
        <div className="relative w-full overflow-hidden leading-none z-10 opacity-30">
          <svg
            className="relative block w-full h-12 text-[#6B21A8] animate-wave"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 C150,90 350,-40 500,65 C650,170 900,-10 1200,40 L1200,0 L0,0 Z"
              fill="currentColor"
            />
          </svg>
        </div>

        {/* =====================================================
            3. MAIN FOOTER CONTENT AREA
        ===================================================== */}
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 md:flex-row md:items-center md:justify-between">
          {/* LEFT SIDE — SOCIAL MEDIA (HOVER ANIMATIONS) */}
          <div className="flex items-center gap-4 flexxxconatinerrr justify-center md:justify-start">
            {socialMedia?.map((item: any, index: number) => {
              const imageUrl =
                item?.icon?.url || item?.icon?.sizes?.thumbnail?.url || defaultImage.src

              return (
                <a
                  key={index}
                  href={item?.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full transition-all duration-300"
                  aria-label={item?.platform}
                >
                  <img
                    src={imageUrl}
                    alt={item?.platform}
                    className="h-10 w-10 object-contain  transition-all duration-300 group-hover:invert-0 group-hover:opacity-100 group-hover:scale-110"
                  />
                </a>
              )
            })}
          </div>

          {/* CENTER — COPYRIGHT & CHENNAI SPARKLE */}
          <div className="text-center">
            <p className="text-sm font-medium tracking-wide text-purple-100/90">
              {copyright || ''}
            </p>
            {/* <span className="mt-1 block text-[11px] font-semibold uppercase tracking-widest text-amber-400/80">
              Crafted with Warmth in Chennai 🌊
            </span> */}
          </div>

          {/* RIGHT SIDE — COMPANY EMAIL & CONTACT */}
          <div className="text-center md:text-right">
            {companyInfo?.supportEmail && (
              <a
                href={`mailto:${companyInfo?.supportEmail}`}
                className="inline-flex items-center gap-2 rounded-full border border-purple-300/20 bg-white/5 px-5 py-2 text-xs font-semibold text-purple-100 backdrop-blur-md transition-all duration-300 hover:border-amber-400/60 hover:bg-white/15 hover:text-amber-300 shadow-sm"
              >
                <span>{companyInfo?.supportEmail}</span>
              </a>
            )}
          </div>
        </div>
      </footer>
    )
  } catch (error) {
    console.error('Footer Error:', error)

    return <footer className="bg-slate-900 py-8 text-center text-white">Footer Failed</footer>
  }
}
