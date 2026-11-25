'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// One "Quiz settings" screen: the two settings pages share this tab bar.
const TABS = [
  { href: '/admin/globals/quiz-settings', label: 'Game, scoring & fair play' },
  { href: '/admin/globals/quiz-site-settings', label: 'Site pages & logins' },
]

export function SettingsTabs() {
  const path = usePathname() || ''
  return (
    <nav className="qs-tabs" aria-label="Quiz settings">
      {TABS.map((t) => (
        <Link key={t.href} href={t.href} className={`qs-tab${path.startsWith(t.href) ? ' is-on' : ''}`}>
          {t.label}
        </Link>
      ))}
    </nav>
  )
}
