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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.ico" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <GoogleTagManager gtmId="GTM-P9G3PTT7" />
        <GoogleAnalytics gaId="G-XQNZ1N285N" />
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />
          <Header />
          {children}
          <Footer />
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
}
