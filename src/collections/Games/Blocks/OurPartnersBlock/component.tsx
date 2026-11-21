'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface MediaType {
    id: string
    url?: string
    alt?: string
    width?: number
    height?: number
}

interface PartnerItem {
    id?: string
    name: string
    logo: MediaType | string
    link?: string | null
}

interface OurPartnersProps {
    heading?: string
    scrollSpeed?: number
    partners?: PartnerItem[]
}

export const OurPartners: React.FC<OurPartnersProps> = ({
    heading = 'Our Proud Partners',
    scrollSpeed = 35,
    partners = [],
}) => {
    if (!partners || partners.length === 0) return null

    // Seamless infinite loop-kaga logos-a duplicate panrom
    const duplicatedPartners = [...partners, ...partners]

    return (
        <div className="ourpartnerssssection bg-[#f1f1f1]">
            <section className="relative overflow-hidden py-20">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="absolute inset-0"></div>

                    <div className="relative container mx-auto max-w-7xl px-4 mt-10">
                        {/* Section Heading */}
                        <div className="mx-auto mb-13 max-w-3xl text-center">
                            {/* <p className='text-[18px] font-extrabold uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#03045e] via-[#7000ff] to-[#ff007a] mb-0'> */}
                            <p className="inline-block text-[18px] font-extrabold uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#03045e] from-[15%] via-[#7000ff] via-[55%] to-[#ff007a] to-[95%] mb-0">

                                CHENZ QUIZ</p>
                            <div className="mb-10 text-center">
                                {/* <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#03045e] via-[#7000ff] to-[#ff007a] px-2 py-1"> */}
                                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#03045e] from-[15%] via-[#7000ff] via-[45%] to-[#ff007a] to-[95%] px-2 py-1">
                                    {heading}
                                </h2>
                            </div>
                        </div>

                        {/* Left & Right Edge Overlays */}
                        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24"></div>
                        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24"></div>

                        {/* Carousel Wrapper */}
                        <div className="relative overflow-hidden group/marquee">
                            <div
                                className="flex w-max gap-8 paddingcarsouel animate-partner-marquee group-hover/marquee:[animation-play-state:paused] mt-5"
                                style={{
                                    animationDuration: `${scrollSpeed}s`,
                                }}
                            >
                                {duplicatedPartners.map((partner, index) => {
                                    const logoUrl =
                                        typeof partner.logo === 'object' && partner.logo?.url
                                            ? partner.logo.url
                                            : typeof partner.logo === 'string'
                                                ? partner.logo
                                                : ''

                                    if (!logoUrl) return null

                                    const cardContent = (
                                        <div className="relative z-10 flex items-center justify-center h-full w-full">
                                            <Image
                                                src={logoUrl}
                                                alt={partner.name || 'Partner Logo'}
                                                width={180}
                                                height={100}
                                                loading="lazy"
                                                className="max-h-[100%] w-auto object-contain transition-all duration-500 mt-0 mb-0 group-hover:scale-105"
                                            />
                                        </div>
                                    )

                                    const cardClasses =
                                        'group relative flex h-[140px] w-[240px] flex-shrink-0 items-center justify-center overflow-hidden border border-gray-100 bg-white/90 p-8 rounded-[5px] transition-all duration-500 hovereddbossss'

                                    return partner.link ? (
                                        <Link
                                            key={`${partner.id || partner.name}-${index}`}
                                            href={partner.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={cardClasses}
                                        >
                                            {cardContent}
                                        </Link>
                                    ) : (
                                        <div
                                            key={`${partner.id || partner.name}-${index}`}
                                            className={cardClasses}
                                        >
                                            {cardContent}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}