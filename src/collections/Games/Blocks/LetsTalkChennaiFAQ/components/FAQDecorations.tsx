'use client'

import React from 'react'

export function FAQDecorations() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 🛠️ Theme-related Glowing Ambient Lights (Neon Blue & Deep Indigo) */}
      <div className="absolute left-1/4 top-10 h-96 w-96 rounded-full bg-cyan-500/10 blur-[130px]" />
      <div className="absolute right-1/4 bottom-10 h-96 w-96 rounded-full bg-indigo-600/15 blur-[130px]" />

      {/* Top-Left Dotted Decorative Matrix (Theme: Electric Cyan) */}
      <div className="absolute left-4 top-12 hidden lg:block opacity-35">
        <div
          className="h-32 w-32"
          style={{
            backgroundImage: 'radial-gradient(circle, #38BDF8 1.5px, transparent 1.5px)',
            backgroundSize: '16px 16px',
          }}
        />
      </div>

      {/* Bottom-Right Dotted Decorative Matrix (Theme: Deep Indigo/Purple) */}
      <div className="absolute right-4 bottom-12 hidden lg:block opacity-35">
        <div
          className="h-32 w-32"
          style={{
            backgroundImage: 'radial-gradient(circle, #6366F1 1.5px, transparent 1.5px)',
            backgroundSize: '16px 16px',
          }}
        />
      </div>
    </div>
  )
}
