import type { Metadata } from 'next'

import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'
import { cn } from 'src/utilities/ui'
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'
import { draftMode } from 'next/headers'
import { AdminBar } from 'src/components/AdminBar'
import { Providers } from 'src/providers'
import { InitTheme } from 'src/providers/Theme/InitTheme'
import { mergeOpenGraph } from 'src/utilities/mergeOpenGraph'

import { Header } from '@/Header/Component'
import Footer from 'src/Footer/Component'
import { getServerSideURL } from 'src/utilities/getURL'
import './globals.css'

import '@/assets/Css/style.css'
import Link from 'next/link'
import LeaderboardComponent from '@/blocks/Leaderboard/Leaderboard'
import StickyNavigation from '@/blocks/StickyNavigation/StickyNavigation'
import { SiteEnvBadge } from '@/components/SiteEnvBadge'
import { MaintenanceBanner } from '@/components/MaintenanceBanner'
import { isDemoSite } from '@/utilities/siteEnv'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()
  // The demo site (internal testing) must not send visits to the live analytics
  const demo = isDemoSite()

  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.ico" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        {!demo && <GoogleTagManager gtmId="GTM-53P93R9G" />}
        {!demo && <GoogleAnalytics gaId="G-ZEMVJH3G2E" />}
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />
          <MaintenanceBanner />
          <Header />
          {children}
          <Footer />
          <LeaderboardComponent />
          <StickyNavigation />
          <SiteEnvBadge />
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
  verification: {
    google: 'TV8yLsjwGYJA-dPtmW_ruGvrLxa9c6Hpx1sNSMoxm2w',
  },
  // Demo site: keep it out of search engines
  ...(isDemoSite() ? { robots: { index: false, follow: false } } : {}),
}
