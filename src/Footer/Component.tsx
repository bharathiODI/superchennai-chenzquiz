/* eslint-disable @next/next/no-img-element */

import defaultImage from '../assets/images/default/default.png'
import { getCachedGlobal } from '@/utilities/getGlobals'

export default async function Footer() {
  try {
    const footer = (await getCachedGlobal('footer', 1)()) as any
    const { copyright, companyInfo, socialMedia } = footer || {}

    return (
      <footer className="relative w-full overflow-hidden bg-gradient-to-b from-[#11145A] via-[#1a1c6e] to-[#0d0f42] text-white border-t border-purple-500/20 shadow-2xl">
        {/* =====================================================
            1. GAMING NEON GLOW & LIGHTING EFFECTS
        ===================================================== */}
        <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
          {/* Top Border Vibrant Glow Line */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#5B2EFF] to-amber-400" />
          
          {/* Subtle Ambient Radial Glows */}
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#5B2EFF]/25 blur-3xl animate-pulse" />
          <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-amber-500/15 blur-3xl" />
        </div>

        {/* =====================================================
            2. CHENNAI TRIVIA WAVE DECORATION
        ===================================================== */}
        <div className="relative w-full overflow-hidden leading-none z-10 opacity-20">
          <svg
            className="relative block w-full h-10 text-[#5B2EFF]"
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
            3. MAIN FOOTER CONTENT AREA (GAMING STYLE)
        ===================================================== */}
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 md:flex-row md:items-center md:justify-between">
          
          {/* Social Media Icons Container */}
          <div className="flex items-center gap-3.5 justify-center md:justify-start">
            {socialMedia?.map((item: any, index: number) => {
              const imageUrl =
                item?.icon?.url || item?.icon?.sizes?.thumbnail?.url || defaultImage.src

              return (
                <a
                  key={index}
                  href={item?.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 p-2 border border-white/10 backdrop-blur-md transition-all duration-300 hover:bg-[#5B2EFF] hover:border-purple-400/50 hover:scale-110 hover:shadow-lg hover:shadow-[#5B2EFF]/40"
                  aria-label={item?.platform}
                >
                  <img
                    src={imageUrl}
                    alt={item?.platform}
                    className="h-full w-full object-contain transition-all duration-300 group-hover:brightness-125"
                  />
                </a>
              )
            })}
          </div>

          {/* Copyright & Branding */}
          <div className="text-center">
            <p className="text-xs md:text-sm font-bold tracking-wide text-purple-200/90 flex items-center justify-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              {copyright || '© 2026 Super Chennai Trivia. All rights reserved.'}
            </p>
          </div>

          {/* Support Email Card */}
          <div className="text-center md:text-right">
            {companyInfo?.supportEmail && (
              <a
                href={`mailto:${companyInfo?.supportEmail}`}
                className="inline-flex items-center gap-2.5 rounded-2xl border border-purple-400/30 bg-white/5 px-5 py-2.5 text-xs font-black tracking-wide text-purple-100 backdrop-blur-md transition-all duration-300 hover:border-amber-400/80 hover:bg-amber-400/10 hover:text-amber-300 shadow-md hover:shadow-amber-500/20 active:scale-95"
              >
                <span className="text-amber-400 font-bold">✉ Support:</span>
                <span>{companyInfo?.supportEmail}</span>
              </a>
            )}
          </div>
        </div>
      </footer>
    )
  } catch (error) {
    console.error('Footer Error:', error)

    return (
      <footer className="bg-[#11145A] py-8 text-center text-white text-sm font-bold">
        Super Chennai Trivia
      </footer>
    )
  }
}