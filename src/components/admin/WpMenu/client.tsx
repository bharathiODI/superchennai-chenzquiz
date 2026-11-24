'use client'

import { useNav } from '@payloadcms/ui'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

export type MenuItem = {
  id: string
  label: string
  icon: 'home' | 'chart' | 'puzzle' | 'trophy' | 'pin' | 'image' | 'page' | 'brush' | 'users' | 'sliders' | 'dots'
  href: string
  exact?: boolean
  children: { label: string; href: string }[]
}

// Simple line icons (drawn for this menu), 20x20, currentColor
const ICONS: Record<MenuItem['icon'], React.ReactNode> = {
  home: <path d="M3 9.5 10 4l7 5.5V16a1 1 0 0 1-1 1h-3.5v-4.5h-5V17H4a1 1 0 0 1-1-1Z" />,
  chart: <path d="M3 17h14M5.5 14V9M10 14V5M14.5 14v-3" />,
  puzzle: (
    <path d="M8 3h4v2a1.5 1.5 0 1 0 3 0V3h2v5h-2a1.5 1.5 0 1 0 0 3h2v6h-5v-2a1.5 1.5 0 1 0-3 0v2H3v-5h2a1.5 1.5 0 1 0 0-3H3V3h5Z" />
  ),
  trophy: <path d="M6 3h8v4a4 4 0 0 1-8 0Zm0 1.5H3.5a2.5 2.5 0 0 0 2.6 3.4M14 4.5h2.5a2.5 2.5 0 0 1-2.6 3.4M10 11v3M7 17h6M8 14h4v3H8Z" />,
  pin: <path d="M12 3 17 8l-3 1-3 3 .5 3.5L10 17l-3.5-3.5L3 17m3.5-3.5L3 10l1.5-1.5L8 9l3-3 1-3Z" />,
  image: <path d="M3 4h14v12H3Zm0 9 4-4 3 3 2-2 5 5M12.5 7.5h.01" />,
  page: <path d="M5 2.5h6.5L15 6v11.5H5Zm6 0V6.5h4M7.5 10h5M7.5 13h5" />,
  brush: <path d="M16.5 3.5 9 11l-1.5-1.5L15 2Zm-8 7.5c-2-.5-3.5 1-3.5 3S3 16.5 3 16.5s4.5 1 6-1.5c.8-1.4.3-2.8-.5-4Z" />,
  users: <path d="M7.5 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM2 17c0-3 2.5-5 5.5-5S13 14 13 17M13 3.5a3 3 0 0 1 0 5.5M15 12c1.8.7 3 2.6 3 5" />,
  sliders: <path d="M4 3v14M10 3v14M16 3v14M2.5 6.5h3M8.5 12.5h3M14.5 8.5h3" />,
  dots: <path d="M5 10h.01M10 10h.01M15 10h.01" />,
}

const matches = (path: string, href: string) => path === href || path.startsWith(`${href}/`)

export function WpMenuClient({ items }: { items: MenuItem[] }) {
  const path = (usePathname() || '').replace(/\/$/, '')

  // WordPress keeps its menu open on desktop; Payload closes it below 1441px wide on page load.
  // Reopen it on screens 1025px+ during the first moments after load (a user's own close later stays).
  const { navOpen, setNavOpen } = useNav()
  const loadedAt = React.useRef(Date.now())
  React.useEffect(() => {
    if (navOpen || Date.now() - loadedAt.current > 2000) return
    if (!window.matchMedia('(min-width: 1025px)').matches) return
    const t = setTimeout(() => setNavOpen(true), 30)
    return () => clearTimeout(t)
  }, [navOpen, setNavOpen])

  // The current entry is the longest href that matches (so ".../questions/create" beats ".../questions")
  let current = ''
  for (const it of items) {
    for (const h of [it.href, ...it.children.map((c) => c.href)]) {
      const ok = it.exact && h === it.href ? path === h : matches(path, h)
      if (ok && h.length > current.length) current = h
    }
  }
  const isOpen = (it: MenuItem) => current === it.href || it.children.some((c) => c.href === current)

  return (
    <nav className="wpm" aria-label="CMS menu">
      <ul className="wpm-list">
        {items.map((it) => {
          const open = isOpen(it)
          return (
            <li key={it.id} className={`wpm-item${open ? ' is-open' : ''}${it.children.length ? ' has-sub' : ''}`}>
              <Link className="wpm-top" href={it.href} aria-current={open && !it.children.length ? 'page' : undefined}>
                <svg className="wpm-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  {ICONS[it.icon]}
                </svg>
                <span>{it.label}</span>
              </Link>
              {it.children.length > 0 && (
                <ul className="wpm-sub">
                  {it.children.map((c) => (
                    <li key={c.href}>
                      <Link href={c.href} className={c.href === current ? 'is-current' : undefined} aria-current={c.href === current ? 'page' : undefined}>
                        {c.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
