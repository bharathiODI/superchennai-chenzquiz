'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function StickyNavigation() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <div className="stickeyfooterr">
        <div className="flex items-center gap-4">
          {/* Leadership Button (Secondary / Glass Style) */}
          <Link
            href="/leaderboard"
            className="px-6 py-2.5 text-sm font-semibold  rounded-full border border-transparent [background:linear-gradient(white,white)_padding-box,linear-gradient(to_right,#03045e,#7000ff,#ff007a)_border-box] transition-all duration-300 shadow-sm active:scale-95 text-[#3302a5] bg-clip-text bg-gradient-to-r from-[#03045e] via-[#7000ff] to-[#ff007a]"
          >
            Leaderboard
          </Link>

          {/* Profile Button (Primary Gradient Style) */}
          <Link
            href="/profile"
            className="px-6 py-2.5 text-sm font-semibold text-white rounded-full bg-gradient-to-r from-[#03045e] via-[#7000ff] to-[#ff007a] hover:opacity-90 hover:shadow-lg hover:shadow-[#7000ff]/30 transition-all duration-300 active:scale-95"
          >
            Profile
          </Link>
        </div>
      </div>
    </>
  )
}
