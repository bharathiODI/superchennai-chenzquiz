
'use client'

import { Media } from '@/components/Media'
import { ArrowRight, CalendarDays, Clock3 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export type SummerCardData = {
  slug?: string
  title?: string
  heroImage?: any
  mobileImage?: any
  eventFields?: {
    title?: string
    shortDescription?: string
    eventDates?: { date?: string }[]
    startTime?: string
    endTime?: string
    featuredImage?: any
  }
}

export const SummerCard: React.FC<{ doc: SummerCardData }> = ({ doc }) => {
  const { slug, title, heroImage, mobileImage, eventFields } = doc || {}

  /* ======================================================
     IMAGE & DETAILS EXTRACTOR
  ====================================================== */
  const imageToUse = eventFields?.featuredImage || heroImage || mobileImage
  const eventDate = eventFields?.eventDates?.[0]?.date

  const formattedDate = eventDate
    ? new Date(eventDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  const eventTime =
    eventFields?.startTime && eventFields?.endTime
      ? `${eventFields.startTime} - ${eventFields.endTime}`
      : null

  const href = `/events/${slug}`

  return (
    <Link href={href} className="group block h-full select-none">
      <article className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all duration-500 hover:-translate-y-2 hover:border-pink-300 hover:shadow-[0_22px_50px_rgba(0,0,0,0.12)]">
        {/* TOP IMAGE SECTION WITH GRADIENT OVERLAYS */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
          {imageToUse ? (
            <Media
              resource={imageToUse}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">No Image</span>
            </div>
          )}

          {/* Dual Gradient Overlays for Sunlight/Shadow effect */}
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-black/20" />
          <div className="absolute inset-0 z-10 bg-gradient-to-tr from-pink-600/20 via-transparent to-amber-500/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {/* DATE & TIME BADGES OVERLAY */}
          <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2">
            {formattedDate && (
              <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-slate-950/60 px-3 py-1 text-[11px] font-semibold tracking-wide text-white backdrop-blur-md shadow-md">
                <CalendarDays className="h-3 w-3 text-pink-400" />
                {formattedDate}
              </div>
            )}

            {eventTime && (
              <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-slate-950/60 px-3 py-1 text-[11px] font-semibold tracking-wide text-white backdrop-blur-md shadow-md">
                <Clock3 className="h-3 w-3 text-amber-400" />
                {eventTime}
              </div>
            )}
          </div>

          {/* CARD TITLE INSIDE IMAGE OVERLAY */}
          <div className="absolute bottom-0 left-0 z-20 w-full p-5 sm:p-6">
            <h3 className="line-clamp-2 text-xl sm:text-2xl font-black leading-snug text-white transition-all duration-300 group-hover:translate-x-1 group-hover:text-amber-200">
              {eventFields?.title || title}
            </h3>
          </div>
        </div>

        {/* CARD BODY CONTENT */}
        <div className="flex flex-1 flex-col justify-between p-5 sm:p-6 bg-white">
          {eventFields?.shortDescription && (
            <p className="line-clamp-2 text-sm leading-relaxed text-slate-600 font-normal festparaa">
              {eventFields.shortDescription}
            </p>
          )}

          {/* DIVIDER & ACTION CTA */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-black tracking-widest uppercase text-[#007A87] transition-all duration-300 group-hover:text-[#ec265b] festviewwdetails">
              View Details
            </span>

            {/* FLOATING ACTION BUTTON */}
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-[#ec265b] via-purple-600 to-indigo-600 text-white shadow-md transition-all duration-300 group-hover:scale-110 group-hover:rotate-[-10deg] group-hover:shadow-lg group-hover:shadow-pink-500/25">
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>

        {/* HOVER GLOW BORDER ACCENT */}
        <div className="pointer-events-none absolute inset-0 rounded-3xl border border-transparent transition-colors duration-500 group-hover:border-pink-500/30" />
      </article>
    </Link>
  )
}
