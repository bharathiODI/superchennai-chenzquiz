'use client'

import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  MapPin,
  Utensils,
  ShoppingBag,
  Palette,
  Trees,
  Calendar,
  Sparkles,
  Tag,
  HeartHandshake,
} from 'lucide-react'

import './style.css'

type Props = {
  heading?: string
  description?: string
  showViewAll?: boolean
  viewAllLink?: string
}

/* ======================================================
   CATEGORY COLOR & ICON MAPPER
====================================================== */
const getCategoryMeta = (categoryName: string) => {
  const normalized = categoryName?.toLowerCase() || ''

  if (
    normalized.includes('attraction') ||
    normalized.includes('place') ||
    normalized.includes('sight')
  ) {
    return {
      bg: 'bg-gradient-to-r from-rose-500 to-pink-500',
      text: 'text-rose-600',
      border: 'border-rose-100',
      shadow: 'shadow-rose-500/20',
      icon: MapPin,
    }
  }
  if (
    normalized.includes('food') ||
    normalized.includes('caf') ||
    normalized.includes('dine') ||
    normalized.includes('restaurant')
  ) {
    return {
      bg: 'bg-gradient-to-r from-purple-600 to-indigo-600',
      text: 'text-purple-600',
      border: 'border-purple-100',
      shadow: 'shadow-purple-500/20',
      icon: Utensils,
    }
  }
  if (
    normalized.includes('shop') ||
    normalized.includes('market') ||
    normalized.includes('store')
  ) {
    return {
      bg: 'bg-gradient-to-r from-orange-500 to-amber-500',
      text: 'text-orange-600',
      border: 'border-orange-100',
      shadow: 'shadow-orange-500/20',
      icon: ShoppingBag,
    }
  }
  if (
    normalized.includes('art') ||
    normalized.includes('culture') ||
    normalized.includes('heritage') ||
    normalized.includes('museum')
  ) {
    return {
      bg: 'bg-gradient-to-r from-blue-600 to-cyan-600',
      text: 'text-blue-600',
      border: 'border-blue-100',
      shadow: 'shadow-blue-500/20',
      icon: Palette,
    }
  }
  if (
    normalized.includes('park') ||
    normalized.includes('outdoor') ||
    normalized.includes('nature') ||
    normalized.includes('beach') ||
    normalized.includes('reels')
  ) {
    return {
      bg: 'bg-gradient-to-r from-emerald-500 to-teal-600',
      text: 'text-emerald-600',
      border: 'border-emerald-100',
      shadow: 'shadow-emerald-500/20',
      icon: Trees,
    }
  }

  return {
    bg: 'bg-gradient-to-r from-cyan-500 to-blue-600',
    text: 'text-cyan-600',
    border: 'border-cyan-100',
    shadow: 'shadow-cyan-500/20',
    icon: Calendar,
  }
}

export default function EventListingComponent({
  heading,
  description,
  showViewAll = true,
  viewAllLink = '/summer',
}: Props) {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [showAllUpcoming, setShowAllUpcoming] = useState(false)

  /* ======================================================
     FETCH EVENTS WITH DEPTH
  ====================================================== */
  useEffect(() => {
    fetchEvents()
  }, [])

  // const fetchEvents = async () => {
  //   try {
  //     setLoading(true)
  //     const res = await axios.get('/api/lets-talks-chennai-lisitngs')
  //     setEvents(res?.data?.docs || [])
  //   } catch (error) {
  //     console.error('Error fetching events:', error)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const fetchEvents = async () => {
    try {
      setLoading(true)

      const res = await axios.get('/api/lets-talks-chennai-lisitngs?sort=order&limit=100000')

      const rawDocs = res?.data?.docs || []

      const sortedDocs = [...rawDocs].sort((a: any, b: any) => {
        const orderA = typeof a.order === 'number' ? a.order : 9999
        const orderB = typeof b.order === 'number' ? b.order : 9999
        return orderA - orderB
      })

      setEvents(sortedDocs)
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  /* ======================================================
     DYNAMICALLY EXTRACT CATEGORIES (FROM TalkCategories Array)
  ====================================================== */
  const categories = useMemo(() => {
    const allCategories: string[] = []

    events?.forEach((event) => {
      // 1. Check TalkCategories inside eventFields OR event level
      const talkCats = event?.eventFields?.TalkCategories || event?.TalkCategories
      if (Array.isArray(talkCats)) {
        talkCats.forEach((catItem: any) => {
          const catName = typeof catItem === 'object' ? catItem?.name : catItem
          if (catName) allCategories.push(catName)
        })
      }

      // 2. Fallback to old single category field if present
      const singleCat = event?.eventFields?.category || event?.category
      if (singleCat && typeof singleCat === 'string') {
        allCategories.push(singleCat)
      }
    })

    return Array.from(new Set(allCategories))
  }, [events])

  /* ======================================================
     FILTER EVENTS BY SELECTED CATEGORY
  ====================================================== */
  const filteredEvents = useMemo(() => {
    if (activeCategory === 'all') return events

    return events.filter((event) => {
      const talkCats = event?.eventFields?.TalkCategories || event?.TalkCategories

      // Multi category match
      if (Array.isArray(talkCats)) {
        const hasMatch = talkCats.some((catItem: any) => {
          const catName = typeof catItem === 'object' ? catItem?.name : catItem
          return catName?.toLowerCase() === activeCategory?.toLowerCase()
        })
        if (hasMatch) return true
      }

      // Single category fallback match
      const singleCat = event?.eventFields?.category || event?.category
      return singleCat?.toLowerCase() === activeCategory?.toLowerCase()
    })
  }, [events, activeCategory])

  /* ======================================================
     LOADING SKELETON STATE
  ====================================================== */
  if (loading) {
    return (
      <section className="relative overflow-hidden bg-slate-50/80 py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto h-8 w-64 rounded-full bg-slate-200 animate-pulse" />
          <div className="mx-auto mt-4 h-4 w-96 rounded-full bg-slate-200 animate-pulse" />
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-96 rounded-3xl bg-slate-200 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!events?.length) return null

  return (
    <section
      id="upcomingevents"
      className="relative overflow-hidden bg-slate-50 py-20 lg:py-32"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* BACKGROUND GRAPHICS & MESH GRADIENTS */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-20 top-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-cyan-200/40 via-blue-200/30 to-transparent blur-3xl" />
        <div className="absolute -right-20 top-2/3 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-amber-200/40 via-orange-100/30 to-transparent blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(#090d16 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        {/* SECTION HEADER */}
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-[#fff1f2cc] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#ec265b] backdrop-blur-md mb-4 shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#ec265b]" />
            Discover Chennai Experience
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl font-black tracking-tight text-[#6d4399] uppercase sm:text-4xl lg:text-5xl"
          >
            {heading || 'EXPLORE CHENNAI'}
          </motion.h2>

          <div className="mx-auto mt-4 flex items-center justify-center gap-1.5">
            <div className="h-1 w-2.5 rounded-full bg-[#007A87]" />
            <div className="h-1 w-14 rounded-full bg-gradient-to-r from-[#007A87] via-amber-400 to-orange-500" />
            <div className="h-1 w-2.5 rounded-full bg-orange-500" />
          </div>

          {description && (
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base"
            >
              {description}
            </motion.p>
          )}
        </div>

        {/* CATEGORY TABS */}
        {categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            viewport={{ once: true }}
            className="mb-14 flex flex-wrap justify-center gap-2.5 sm:gap-3"
          >
            <button
              onClick={() => setActiveCategory('all')}
              className={`relative rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                activeCategory === 'all'
                  ? 'bg-[#6d4399] text-white shadow-xl shadow-slate-900/20 scale-105'
                  : 'bg-white/80 backdrop-blur-md text-slate-600 hover:bg-white hover:text-slate-900 border border-slate-200/80 shadow-sm'
              }`}
            >
              All Items
            </button>
            {categories.map((cat: string) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20 scale-105'
                    : 'bg-white/80 backdrop-blur-md text-slate-600 hover:bg-white hover:text-slate-900 border border-slate-200/80 shadow-sm'
                }`}
              >
                {cat.replace('-', ' ')}
              </button>
            ))}
          </motion.div>
        )}

        {/* EVENTS GRID */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7"
          >
            {(showAllUpcoming ? filteredEvents : filteredEvents.slice(0, 8)).map(
              (event: any, index: number) => {
                const eventFields = event?.eventFields || {}

                const title = event?.title || eventFields?.title
                const shortDescription = eventFields?.shortDescription
                const familyFriendly = eventFields?.familyFriendly
                const buttonText = eventFields?.linkbutton || 'Register Now'

                // Extract array of TalkCategories
                const talkCategoriesList: any[] =
                  eventFields?.TalkCategories || event?.TalkCategories || []

                // Primary category name for icon style mapping
                const primaryCategory =
                  talkCategoriesList[0]?.name || eventFields?.category || 'General'

                const catMeta = getCategoryMeta(primaryCategory)
                const CategoryIcon = catMeta.icon

                const heroImage = event?.heroImage || eventFields?.featuredImage
                const image = heroImage?.sizes?.large?.url || heroImage?.url || '/placeholder.jpg'

                const { enableExternalRedirect, externalUrl, openInNewTab } = eventFields
                const slug = event?.slug
                const eventLink =
                  enableExternalRedirect && externalUrl ? externalUrl : `/events/${slug}`

                return (
                  <motion.div
                    key={event?.id || index}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="group relative flex flex-col rounded-[24px] bg-white/90 backdrop-blur-lg border border-slate-200/60 shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all duration-500 hover:-translate-y-2.5 hover:shadow-[0_22px_45px_rgba(0,0,0,0.12)] hover:border-slate-300 overflow-hidden"
                  >
                    <Link
                      href={eventLink}
                      target={openInNewTab ? '_blank' : undefined}
                      rel={openInNewTab ? 'noopener noreferrer' : undefined}
                      prefetch={false}
                      className="flex flex-col h-full"
                    >
                      {/* IMAGE AREA WITH OVERLAY BADGES */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                        <Image
                          src={image}
                          alt={title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        />

                        {/* Top Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-black/20 opacity-80" />

                        {/* TOP RIGHT BADGES (FAMILY FRIENDLY + TALK CATEGORIES SIDE BY SIDE) */}
                        <div className="absolute top-3 right-3 z-10 flex flex-wrap gap-1.5 justify-end max-w-[85%]">
                          {/* Family Friendly Badge */}
                          {familyFriendly && (
                            <span className="inline-flex items-center gap-1 bg-slate-900/80 backdrop-blur-md text-white border border-white/20 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg">
                              <HeartHandshake className="w-3 h-3 text-pink-400" />
                              Family
                            </span>
                          )}

                          {/* TalkCategories Badges side by side */}
                          {talkCategoriesList.map((catObj: any, cIdx: number) => {
                            const catName = typeof catObj === 'object' ? catObj?.name : catObj
                            if (!catName) return null
                            return (
                              <span
                                key={catObj?.id || cIdx}
                                className="inline-flex items-center gap-1 bg-purple-950/80 backdrop-blur-md text-purple-200 border border-purple-400/30 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg"
                              >
                                <Tag className="w-2.5 h-2.5 text-purple-300" />
                                {catName}
                              </span>
                            )
                          })}
                        </div>
                      </div>

                      {/* Overlapping Floating Icon Badge */}
                      <div className="relative -mt-6 ml-6 z-10 flex">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${catMeta.bg} text-white shadow-lg ${catMeta.shadow} ring-4 ring-white transition-transform duration-300 group-hover:scale-110`}
                        >
                          <CategoryIcon className="h-5 w-5 stroke-[2.2]" />
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="flex flex-1 flex-col justify-between p-6 pt-3">
                        <div>
                          {/* PRIMARY CATEGORY HEADER */}
                          <span
                            className={`block text-[11px] font-extrabold uppercase tracking-widest ${catMeta.text} mb-1.5`}
                          >
                            {primaryCategory}
                          </span>

                          <h3 className="text-base font-bold text-slate-900 tracking-tight line-clamp-2 leading-snug transition-colors group-hover:text-black">
                            {title}
                          </h3>

                          {shortDescription && (
                            <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
                              {shortDescription}
                            </p>
                          )}
                        </div>

                        {/* Card Action Link */}
                        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase ${catMeta.text}`}
                          >
                            {buttonText}
                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              },
            )}
          </motion.div>
        </AnimatePresence>

        {/* VIEW MORE BUTTON */}
        {(filteredEvents.length > 8 || showViewAll) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-16 flex justify-center"
          >
            {filteredEvents.length > 8 ? (
              <button
                onClick={() => setShowAllUpcoming((prev) => !prev)}
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-slate-900 px-9 py-4 text-xs font-bold uppercase tracking-widest text-white shadow-xl shadow-slate-900/20 transition-all duration-300 hover:scale-105 hover:bg-black"
              >
                <span>{showAllUpcoming ? 'Show Less' : 'Explore More Events'}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
              </button>
            ) : showViewAll && viewAllLink ? (
              <Link
                href={viewAllLink}
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-slate-900 px-9 py-4 text-xs font-bold uppercase tracking-widest text-white shadow-xl shadow-slate-900/20 transition-all duration-300 hover:scale-105 hover:bg-black"
              >
                <span>View All Collection</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
              </Link>
            ) : null}
          </motion.div>
        )}
      </div>
    </section>
  )
}
