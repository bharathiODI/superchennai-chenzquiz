'use client'

import React, { useEffect, useState } from 'react'
import type { Header as HeaderType } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token) // Convert to boolean
  }, [])

  return (
    <nav className="flex gap-2_5 items-center">
      {navItems.map(({ link }, i) => (
        <CMSLink key={i} {...link} appearance="link" />
      ))}

      {/* Conditionally render Sign In/Sign Up or My Account */}
      {isLoggedIn ? (
        <Link href="/dashboard" className="text-primary font-medium">
          My Account
        </Link>
      ) : (
        <Link href="/login" className="text-primary font-medium">
          Sign In / Sign Up
        </Link>
      )}

      {/* <Link href="/search">
        <span className="sr-only">Search</span>
        <SearchIcon className="w-5 text-primary" />
      </Link> */}
    </nav>
  )
}
