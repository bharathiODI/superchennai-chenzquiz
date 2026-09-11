'use client'

import React, { useEffect, useMemo, useState } from 'react'

import axios from 'axios'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react'

import './style.css'

type Props = {
  heading?: string
  description?: string
  showViewAll?: boolean
  viewAllLink?: string
  PastEventHeading?: string
}

export default function EventListingComponent({
  heading,
  description,
  showViewAll = true,
  viewAllLink = '/summer',
  PastEventHeading,
}: Props) {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [activeWeek, setActiveWeek] = useState<string>('all')
  const [showAllUpcoming, setShowAllUpcoming] = useState(false)
  const [showAllPast, setShowAllPast] = useState(false)

  /* ======================================================
     FETCH EVENTS
  ====================================================== */

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setLoading(true)

      const res = await axios.get('/api/summer-events-lisings')

      setEvents(res?.data?.docs || [])
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  /* ======================================================
     WEEK LIST
  ====================================================== */

  const weeks = useMemo(() => {
    const allWeeks = events?.map((event) => event?.eventFields?.week) || []

    const uniqueWeeks = allWeeks.filter(
      (week, index, self) => week && index === self.findIndex((w) => w?.id === week?.id),
    )

    return uniqueWeeks.sort((a: any, b: any) => (a?.weekNumber || 0) - (b?.weekNumber || 0))
  }, [events])

  /* ======================================================
     FILTER EVENTS
  ====================================================== */

  const now = new Date()

  const filteredEvents = (
    activeWeek === 'all'
      ? events
      : events.filter((event) => String(event?.eventFields?.week?.id) === activeWeek)
  ).sort((a, b) => {
    const aDate = new Date(a?.eventFields?.eventDates?.[0]?.date || 0)
    const bDate = new Date(b?.eventFields?.eventDates?.[0]?.date || 0)

    const aPast = aDate < now
    const bPast = bDate < now

    // Upcoming events first
    if (aPast !== bPast) {
      return aPast ? 1 : -1
    }

    // Sort by nearest date
    return aDate.getTime() - bDate.getTime()
  })

  /* ======================================================
     HELPERS
  ====================================================== */

  const WaveDecoration = () => (
    <span className="mx-2 inline-block font-serif text-lg tracking-widest text-[#007A87] opacity-60">
      ~~~
    </span>
  )

  const categoryStyles: Record<
    string,
    {
      bg: string
      text: string
    }
  > = {
    Music: {
      bg: 'bg-[#007A87]',
      text: 'text-[#007A87]',
    },

    Food: {
      bg: 'bg-[#E0533C]',
      text: 'text-[#E0533C]',
    },

    'Art & Culture': {
      bg: 'bg-[#E5A93C]',
      text: 'text-[#E5A93C]',
    },
  }

  // const now = new Date()

  const selectedEvents =
    activeWeek === 'all'
      ? events
      : events.filter((event) => String(event?.eventFields?.week?.id) === activeWeek)

  const upcomingEvents = selectedEvents
    .filter((event) => {
      const eventDate = new Date(event?.eventFields?.eventDates?.[0]?.date || 0)
      return eventDate >= now
    })
    .sort((a, b) => {
      const aDate = new Date(a?.eventFields?.eventDates?.[0]?.date || 0)
      const bDate = new Date(b?.eventFields?.eventDates?.[0]?.date || 0)

      return aDate.getTime() - bDate.getTime()
    })

  const pastEvents = selectedEvents
    .filter((event) => {
      const eventDate = new Date(event?.eventFields?.eventDates?.[0]?.date || 0)
      return eventDate < now
    })
    .sort((a, b) => {
      const aDate = new Date(a?.eventFields?.eventDates?.[0]?.date || 0)
      const bDate = new Date(b?.eventFields?.eventDates?.[0]?.date || 0)

      return bDate.getTime() - aDate.getTime()
    })

  /* ======================================================
     LOADING
  ====================================================== */

  if (loading) {
    return <div className="py-24 text-center text-xl font-bold">Loading Events...</div>
  }

  if (!events?.length) return null

  return (
    <section
      id="upcomingevents"
      className="relative overflow-hidden bg-white py-5 "
      style={{
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div className="container mx-auto max-w-7xl px-4 mt-10">
        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="mb-10 text-center">
          <h2 className="text-sm font-bold tracking-widest text-[#061E43] flex items-center justify-center uppercase festmainheadingsss">
            <WaveDecoration />

            {heading || ''}

            <WaveDecoration />
          </h2>

          {/* {description && (
            <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-gray-600">
              {description}
            </p>
          )} */}
        </div>

        {/* ======================================================
            WEEK TABS
        ====================================================== */}

        <div className="mb-14 grid grid-cols-2 gap-9 md:grid-cols-5 flexcardscontainerrr">
          <button
            onClick={() => setActiveWeek('all')}
            className={`eveetscardsbuttonss rounded-xl border px-4 py-4 text-center transition-all ${
              activeWeek === 'all'
                ? ' border-[#005B70] bg-[#005B70] font-semibold text-white shadow-md'
                : ' border-gray-200 bg-white text-slate-700 hover:border-gray-300'
            }`}
          >
            <div className="text-[10px] uppercase font-semibold tracking-widest opacity-90 festviewwdetails">
              ALL EVENTS
            </div>

            <div
              className={`text-xs font-bold mt-1 festparaa ${
                activeWeek === 'all' ? ' !text-white ' : ''
              } `}
            >
              Summer Fest
            </div>
          </button>

          {weeks.map((week: any) => {
            const startDate = week?.startDate
              ? new Date(week.startDate).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                })
              : ''

            const endDate = week?.endDate
              ? new Date(week.endDate).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                })
              : ''

            return (
              <button
                key={week?.id}
                onClick={() => setActiveWeek(String(week?.id))}
                className={`rounded-xl border px-4 py-4 text-center transition-all ${
                  activeWeek === String(week?.id)
                    ? 'border-[#005B70] bg-[#005B70] font-semibold text-white shadow-md'
                    : 'border-gray-200 bg-white text-slate-700 hover:border-gray-300'
                }`}
              >
                <div className="text-[10px] uppercase font-semibold tracking-widest opacity-90 festviewwdetails">
                  {week?.title || `WEEK ${week?.weekNumber}`}
                </div>

                <div className="text-xs font-bold mt-1 festparaa ">
                  {startDate} - {endDate}
                </div>
              </button>
            )
          })}
        </div>

        {/* ======================================================
            EVENTS GRID
        ====================================================== */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-[30px]">
          {(showAllUpcoming ? upcomingEvents : upcomingEvents.slice(0, 6)).map(
            (event: any, index: number) => {
              const eventData = event?.eventFields || {}

              const category = eventData?.eventType?.title || 'EVENT'

              const categoryStyle = categoryStyles[category] || {
                bg: 'bg-orange-500',
                text: 'text-orange-500',
              }

              const image =
                eventData?.featuredImage?.sizes?.large?.url ||
                eventData?.featuredImage?.url ||
                '/placeholder.jpg'

              const title = eventData?.title || event?.title

              const shortDescription = eventData?.shortDescription
              const venue = eventData?.venue?.title
              const startTime = eventData?.startTime
              const endTime = eventData?.endTime
              const slug = event?.slug

              const eventDate = eventData?.eventDates?.[0]?.date

              const formattedDate = eventDate
                ? new Date(eventDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : ''

              const price = eventData?.ticketPrice

              return (
                <motion.div
                  key={event?.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={`/events/${slug}`}>
                    <div className="relative h-48 w-full bg-slate-200 overflow-hidden">
                      <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                      <span
                        className={`absolute top-4 left-4 px-3 py-1 text-[13px] font-bold text-white rounded-full tracking-widest ${categoryStyle.bg}`}
                      >
                        {category}
                      </span>

                      {price && (
                        <span className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm text-[#007A87] px-3 py-1 rounded-full text-sm font-bold shadow-md">
                          ₹ {price}
                        </span>
                      )}
                    </div>
                  </Link>

                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <h3 className="text-lg font-bold text-[#061E43] mb-4 tracking-wide festheadingsss">
                        {title}
                      </h3>

                      {shortDescription && (
                        <p className="text-xs text-[#000] line-clamp-2 mb-3 leading-relaxed font-medium festparaa !text-[16px]">
                          {shortDescription}
                        </p>
                      )}

                      <div className="space-y-3 text-[#000] font-medium tracking-wide festesssss">
                        {formattedDate && (
                          <div className="flex items-center gap-2">
                            <Calendar className={`h-4 w-4 ${categoryStyle.text}`} />
                            <span className="festparaa">{formattedDate}</span>
                          </div>
                        )}

                        {(startTime || endTime) && (
                          <div className="flex items-center gap-2">
                            <Clock className={`h-4 w-4 ${categoryStyle.text}`} />
                            <span className="festparaa">
                              {startTime} - {endTime}
                            </span>
                          </div>
                        )}

                        {venue && (
                          <div className="flex items-center gap-2">
                            <MapPin className={`h-4 w-4 ${categoryStyle.text}`} />
                            <span className="festparaa">{venue}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-2 pt-3">
                      <Link
                        href={`/events/${slug}`}
                        className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase text-[#007A87] hover:opacity-80 transition-opacity"
                      >
                        View Details
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )
            },
          )}
        </div>

        {upcomingEvents.length > 6 && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setShowAllUpcoming((prev) => !prev)}
              className="group flex items-center gap-2 rounded-full bg-[#005B70] px-6 py-3 text-sm font-bold uppercase tracking-widest text-white transition-all hover:opacity-90 hover:scale-105"
            >
              {showAllUpcoming ? (
                <>
                  Show Less
                  <svg
                    className="h-4 w-4 transition-transform group-hover:-translate-y-0.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 15l-6-6-6 6" />
                  </svg>
                </>
              ) : (
                <>
                  View More
                  <svg
                    className="h-4 w-4 transition-transform group-hover:translate-y-0.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </>
              )}
            </button>
          </div>
        )}

        {(showAllPast ? pastEvents : pastEvents.slice(0, 6)).length > 0 && (
          <>
            {/* HEADER */}
            <div className="mb-10 mt-20 text-center">
              <h3 className="text-sm font-extrabold tracking-widest text-[#061E43] flex items-center justify-center uppercase festmainheadingsss">
                <WaveDecoration />
                {PastEventHeading || 'Past Events'}
                <WaveDecoration />
              </h3>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-[30px]">
              {(showAllPast ? pastEvents : pastEvents.slice(0, 6)).map(
                (event: any, index: number) => {
                  const eventData = event?.eventFields || {}

                  const category = eventData?.eventType?.title || 'EVENT'

                  const categoryStyle = categoryStyles[category] || {
                    bg: 'bg-orange-500',
                    text: 'text-orange-500',
                  }

                  const image =
                    eventData?.featuredImage?.sizes?.large?.url ||
                    eventData?.featuredImage?.url ||
                    '/placeholder.jpg'

                  const title = eventData?.title || event?.title
                  const shortDescription = eventData?.shortDescription
                  const venue = eventData?.venue?.title
                  const startTime = eventData?.startTime
                  const endTime = eventData?.endTime
                  const slug = event?.slug

                  const eventDate = eventData?.eventDates?.[0]?.date

                  const formattedDate = eventDate
                    ? new Date(eventDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })
                    : ''

                  const price = eventData?.ticketPrice

                  return (
                    <motion.div
                      key={event?.id}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow"
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Link href={`/events/${slug}`}>
                        <div className="relative h-48 w-full bg-slate-200 overflow-hidden">
                          <Image
                            src={image}
                            alt={title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />

                          <span
                            className={`absolute top-4 left-4 px-3 py-1 text-[13px] font-bold text-white rounded-full tracking-widest ${categoryStyle.bg}`}
                          >
                            {category}
                          </span>

                          {price && (
                            <span className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm text-[#007A87] px-3 py-1 rounded-full text-sm font-bold shadow-md">
                              ₹ {price}
                            </span>
                          )}
                        </div>
                      </Link>

                      <div className="flex flex-1 flex-col justify-between p-6">
                        <div>
                          <h3 className="text-lg font-bold text-[#061E43] mb-4 tracking-wide festheadingsss">
                            {title}
                          </h3>

                          {shortDescription && (
                            <p className="text-xs text-[#000] line-clamp-2 mb-3 leading-relaxed font-medium festparaa !text-[16px]">
                              {shortDescription}
                            </p>
                          )}

                          <div className="space-y-3 text-[#000] font-medium tracking-wide festesssss">
                            {formattedDate && (
                              <div className="flex items-center gap-2">
                                <Calendar className={`h-4 w-4 ${categoryStyle.text}`} />
                                <span className="festparaa">{formattedDate}</span>
                              </div>
                            )}

                            {(startTime || endTime) && (
                              <div className="flex items-center gap-2">
                                <Clock className={`h-4 w-4 ${categoryStyle.text}`} />
                                <span className="festparaa">
                                  {startTime} - {endTime}
                                </span>
                              </div>
                            )}

                            {venue && (
                              <div className="flex items-center gap-2">
                                <MapPin className={`h-4 w-4 ${categoryStyle.text}`} />
                                <span className="festparaa">{venue}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mt-2 pt-3">
                          <Link
                            href={`/events/${slug}`}
                            className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase cursor-pointer hover:opacity-80 transition-opacity text-[#007A87] festviewwdetails"
                          >
                            View Details
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )
                },
              )}
            </div>
          </>
        )}
 
        {pastEvents.length > 6 && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setShowAllPast((prev) => !prev)}
              className="group flex items-center gap-2 rounded-full bg-[#061E43] px-6 py-3 text-sm font-bold uppercase tracking-widest text-white transition-all hover:opacity-90 hover:scale-105"
            >
              {showAllPast ? (
                <>
                  Show Less
                  <svg
                    className="h-4 w-4 transition-transform group-hover:-translate-y-0.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 15l-6-6-6 6" />
                  </svg>
                </>
              ) : (
                <>
                  View More
                  <svg
                    className="h-4 w-4 transition-transform group-hover:translate-y-0.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </>
              )}
            </button>
          </div>
        )}

        {/* ======================================================
            VIEW ALL
        ====================================================== */}

        {/* {showViewAll && (
          <div className="mt-5 flex justify-center">
            <Link
              href={viewAllLink}
              className="rounded-full bg-[#005B70] px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:scale-105"
            >
              View All Events
            </Link>
          </div>
        )} */}

      </div>
    </section>
  )
}
