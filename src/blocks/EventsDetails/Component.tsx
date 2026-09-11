'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import {
  CalendarDays,
  Clock3,
  Languages,
  MapPin,
  Mic2,
  ShieldCheck,
  Ticket,
  Users,
  Wallet,
} from 'lucide-react'

export default function FeaturedEventBlockComponent() {
  const params = useParams()
  const slug = params?.slug as string
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (slug) {
      fetchEvent(slug)
    }
  }, [slug])

  const fetchEvent = async (eventSlug: string) => {
    try {
      setLoading(true)
      const res = await axios.get(`/api/summer-events-lisings/${eventSlug}`)
      setEvent(res?.data?.doc || null)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-10 w-72 rounded bg-gray-200" />
            <div className="h-5 w-full rounded bg-gray-200" />
            <div className="h-[300px] rounded bg-gray-200" />
          </div>
        </div>
      </section>
    )
  }

  if (!event) return null

  /* =========================================================
     EXTRACT EVENT DATA
  ========================================================= */
  const eventFields = event?.eventFields || {}
  const performer = eventFields?.performers?.[0]?.title || ''
  const eventDates = eventFields?.eventDates || []
  const ticketType = eventFields?.ticketType || ''
  const ticketPrice = eventFields?.ticketPrice || ''
  const ageLimit = eventFields?.ageLimit || ''
  const languages: string[] = Array.isArray(eventFields?.language) ? eventFields.language : []
  const familyFriendly = eventFields?.familyFriendly
  const eventLink = eventFields?.link || ''
  const eventLinkButton = eventFields?.linkbutton || ''

  const startTime = eventFields?.startTime || ''
  const endTime = eventFields?.endTime || ''
  const eventTime = startTime ? `${startTime}${endTime ? ` - ${endTime}` : ''}` : ''

  const aboutBlock = event?.content?.root?.children?.find(
    (item: any) => item?.fields?.blockType === 'aboutEventBlock',
  )
  const locationAddress = aboutBlock?.fields?.locationAddress || ''
  const locationTitle = aboutBlock?.fields?.locationTitle || 'Location'

  const externalUrl = eventLink
    ? eventLink.startsWith('http://') || eventLink.startsWith('https://')
      ? eventLink
      : `https://${eventLink}`
    : ''

  const WaveDecoration = () => (
    <span className="mx-2 inline-block font-serif text-lg tracking-widest text-[#007A87] opacity-60">
      ~~~
    </span>
  )

  return (
    <section className="py-16">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="h-max w-full rounded-2xl bg-white p-6 shadow-lg">
            
            {/* HEADER */}
            <div className="mb-12 text-center">
              <h2 className="flex items-center justify-center gap-2 text-sm font-extrabold uppercase tracking-widest text-[#005B70]">
                <WaveDecoration />
                Event Detail
                <WaveDecoration />
              </h2>

              <div className="mt-3 flex items-center justify-center">
                <div className="h-1 w-20 rounded bg-[#FCBA13]" />
              </div>
            </div>

            {/* EVENT DETAILS GRID/LIST */}
            <div className="space-y-3">
              {/* DATE */}
              {eventDates?.[0]?.date && (
                <div className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 hover:border-[rgb(226,140,39)]/30 hover:shadow-md">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[rgb(0,75,135)]/10">
                    <CalendarDays size={26} className="text-[rgb(0,75,135)]" />
                  </div>
                  <div>
                    <h6 className="text-sm font-bold text-gray-900">Event Date</h6>
                    <p className="mt-1 text-sm text-gray-600">
                      {new Date(eventDates[0].date).toLocaleDateString('en-IN', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              )}

              {/* TIME */}
              {eventTime.trim() && (
                <div className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[rgb(217,35,29)]/10">
                    <Clock3 size={26} className="text-[rgb(217,35,29)]" />
                  </div>
                  <div>
                    <h6 className="text-sm font-bold text-gray-900">Event Time</h6>
                    <p className="mt-1 text-sm text-gray-600">{eventTime}</p>
                  </div>
                </div>
              )}

              {/* PERFORMER */}
              {performer && (
                <div className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[rgb(226,140,39)]/10">
                    <Mic2 size={26} className="text-[rgb(226,140,39)]" />
                  </div>
                  <div>
                    <h6 className="text-sm font-bold text-gray-900">Performer</h6>
                    <p className="mt-1 text-sm text-gray-600">{performer}</p>
                  </div>
                </div>
              )}

              {/* TICKET TYPE */}
              {ticketType && (
                <div className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[rgb(0,75,135)]/10">
                    <Ticket size={26} className="text-[rgb(0,75,135)]" />
                  </div>
                  <div>
                    <h6 className="text-sm font-bold text-gray-900">Ticket Type</h6>
                    <p className="mt-1 text-sm text-gray-600">{ticketType}</p>
                  </div>
                </div>
              )}

              {/* TICKET PRICE */}
              {ticketPrice && (
                <div className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[rgb(0,75,135)]/10">
                    <Wallet size={26} className="text-[rgb(0,75,135)]" />
                  </div>
                  <div>
                    <h6 className="text-sm font-bold text-gray-900">Ticket Price</h6>
                    <p className="mt-1 text-sm text-gray-600">₹ {ticketPrice}</p>
                  </div>
                </div>
              )}

              {/* LOCATION */}
              {locationAddress && (
                <div className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[rgb(217,35,29)]/10">
                    <MapPin size={26} className="text-[rgb(217,35,29)]" />
                  </div>
                  <div>
                    <h6 className="text-sm font-bold text-gray-900">{locationTitle}</h6>
                    <p className="mt-1 text-sm text-gray-600">{locationAddress}</p>
                  </div>
                </div>
              )}

              {/* AGE LIMIT */}
              {ageLimit && (
                <div className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[rgb(226,140,39)]/10">
                    <ShieldCheck size={26} className="text-[rgb(226,140,39)]" />
                  </div>
                  <div>
                    <h6 className="text-sm font-bold text-gray-900">Age Limit</h6>
                    <p className="mt-1 text-sm text-gray-600">{ageLimit}</p>
                  </div>
                </div>
              )}

              {/* LANGUAGES */}
              {languages.length > 0 && (
                <div className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[rgb(0,75,135)]/10">
                    <Languages size={26} className="text-[rgb(0,75,135)]" />
                  </div>
                  <div>
                    <h6 className="text-sm font-bold text-gray-900">Languages</h6>
                    <p className="mt-1 text-sm text-gray-600">{languages.join(', ')}</p>
                  </div>
                </div>
              )}

              {/* FAMILY FRIENDLY */}
              {familyFriendly && (
                <div className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[rgb(217,35,29)]/10">
                    <Users size={26} className="text-[rgb(217,35,29)]" />
                  </div>
                  <div>
                    <h6 className="text-sm font-bold text-gray-900">Family Friendly</h6>
                    <p className="mt-1 text-sm text-gray-600">Suitable for families</p>
                  </div>
                </div>
              )}
            </div>

            {/* CALL TO ACTION BUTTON */}
            {externalUrl && eventLinkButton && (
              <div className="mt-6">
                <a
                  href={externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  <button className="w-full rounded-lg bg-[rgb(217,35,29)] px-4 py-3 font-semibold text-white transition-all duration-300 hover:bg-[rgb(0,75,135)]">
                    {eventLinkButton}
                  </button>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}