'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

type PayloadMedia = {
  url: string
  alt?: string
}

type FeatureCard = {
  id?: string
  title: string
  description: string
  iconType?: 'list' | 'star' | 'fire' | 'chart' | string
}

type AboutTriviaProps = {
  mainTitle?: string
  highlightText?: string
  subDescription?: string
  centerImage?: PayloadMedia | string
  leftCards?: FeatureCard[]
  rightCards?: FeatureCard[]
  signUpText?: string
  signUpUrl?: string
  loginText?: string
  loginUrl?: string
}

export default function AboutTriviaComponent({
  mainTitle = 'Ready to Play',
  highlightText = 'Trivia?',
  subDescription = 'Join the Chennai Trivia community.',
  centerImage,
  leftCards = [
    {
      title: 'Daily Trivia',
      description: 'Answer a new set of Chennai-inspired questions every day.',
      iconType: 'list',
    },
    {
      title: 'Earn Points',
      description: 'Score high and collect points with every correct answer.',
      iconType: 'star',
    },
  ],
  rightCards = [
    {
      title: 'Build Your Streak',
      description: 'Play daily and keep your streak alive.',
      iconType: 'fire',
    },
    {
      title: 'Climb the Leaderboard',
      description: 'See where you stand among Chennai’s trivia players.',
      iconType: 'chart',
    },
  ],
  signUpText = 'Sign Up',
  signUpUrl = '/signup',
  loginText = 'Login',
  loginUrl = '/login',
}: AboutTriviaProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Check login state from localStorage on client side
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsLoggedIn(true)
    }
  }, [])

  const imageUrl = typeof centerImage === 'object' ? centerImage?.url : centerImage

  const renderIcon = (type?: string) => {
    switch (type) {
      case 'star':
        return <img src="/images/icons/quizzzz.png" alt="" className="svgtopngicon" />
      case 'fire':
        return <img src="/images/icons/personm.png" alt="" className="svgtopngicon" />
      case 'chart':
        return <img src="/images/icons/win-icons.png" alt="" className="svgtopngicon" />
      default:
        return (
          // <svg
          //   className="w-6 h-6 text-[#5122f2]"
          //   fill="none"
          //   stroke="currentColor"
          //   strokeWidth="2"
          //   viewBox="0 0 24 24"
          // >
          //   <path
          //     strokeLinecap="round"
          //     strokeLinejoin="round"
          //     d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          //   />
          // </svg>
          <>
            <img src="/images/icons/pulb-new.png" alt="" className="svgtopngicon" />
          </>
        )
    }
  }

  return (
    <section className="relative w-full py-16 px-4 bg-[#fff] overflow-hidden triviabgsection-hide padddinggmobile">
      {/* Title Area */}
      {/* <div className="text-center mb-12 relative z-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-bold text-[#0f172a]">
          {mainTitle} <span className="text-[#5122f2]">{highlightText}</span>
        </h2>
        <p className="text-gray-600 mt-2 font-medium text-base sm:text-lg">{subDescription}</p>
      </div> */}

      <div className="text-center mb-5 relative z-10 flex flex-col items-center">
        {/* Top Badge/Subheading */}
        <p className="text-[18px] font-extrabold  uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#03045e] via-[#7000ff] to-[#ff007a] mb-0">
          {mainTitle || 'READY TO PLAY'}
        </p>

        {/* Main Heading with Side Sparkles/Dashes */}
        <div className="relative inline-flex items-center justify-center my-2 headingggtexxt">
          {/* Left Decorative Dashes */}
          <div className="hidden sm:flex flex-col gap-1.5 absolute -left-12 md:-left-16 top-1/2 -translate-y-1/2">
            <span className="w-4 h-1 bg-[#ec4899] rounded-full transform -rotate-45 -translate-x-1" />
            <span className="w-5 h-1 bg-[#8b5cf6] rounded-full" />
            <span className="w-4 h-1 bg-[#6366f1] rounded-full transform rotate-45 -translate-x-1" />
          </div>

          {/* Gradient Title */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#03045e] via-[#7000ff] to-[#ff007a] px-0 py-0">
            {highlightText || 'Trivia?'}
          </h2>

          {/* Right Decorative Dashes */}
          <div className="hidden sm:flex flex-col gap-1.5 absolute -right-12 md:-right-16 top-1/2 -translate-y-1/2">
            <span className="w-4 h-1 bg-[#8b5cf6] rounded-full transform rotate-45 translate-x-1" />
            <span className="w-5 h-1 bg-[#ec4899] rounded-full" />
            <span className="w-4 h-1 bg-[#d946ef] rounded-full transform -rotate-45 translate-x-1" />
          </div>
        </div>

        {/* Subtitle Description */}
        <p className="text-gray-600 mt-2 font-medium text-base sm:text-lg">
          {subDescription || 'Join the Chenz Quiz community.'}
        </p>
      </div>

      {/* Main Grid Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 items-center relative z-10">
        {/* Left 2 Cards */}
        {/* <div className="flex flex-col gap-6">
          {leftCards?.map((card, idx) => (
            <div
              key={card.id || idx}
              className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-white shadow-xl shadow-purple-500/5 flex items-start gap-4 transition-transform duration-300 hover:-translate-y-1 triviaaboutbga"
            >
              <div className="w-12 h-12 rounded-xl bg-[#eeeaff] flex items-center justify-center shrink-0 triviaaaimage">
                {renderIcon(card.iconType)}
              </div>
              <div>
                <h3 className="text-lg font-bold headingtexttriviaaa text-[#111827] mb-1">
                  {card.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed paragraphfont">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div> */}

        {/* <div className="flex flex-col gap-6">
          {leftCards?.map((card, idx) => (
            <motion.div
              key={card.id || idx}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: 0.5,
                delay: idx * 0.15, // dynamic delay for staggered effect
                ease: 'easeOut',
              }}
              className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-white shadow-xl shadow-purple-500/5 flex items-start gap-4 transition-transform duration-300 hover:-translate-y-1 triviaaboutbga"
            >
              <div className="w-12 h-12 rounded-xl bg-[#eeeaff] flex items-center justify-center shrink-0 triviaaaimage">
                {renderIcon(card.iconType)}
              </div>
              <div>
                <h3 className="text-lg font-bold headingtexttriviaaa text-[#111827] mb-1">
                  {card.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed paragraphfont">
                  {card.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div> */}

        <div className="flex flex-col gap-6">
          {leftCards?.map((card, idx) => (
            <motion.div
              key={card.id || idx}
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.8, // AOS style smooth duration
                ease: [0.16, 1, 0.3, 1], // AOS signature ease-out-expo curve
                delay: idx * 0.12, // Staggered entry
              }}
              className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-white shadow-xl shadow-purple-500/5 flex items-start gap-4 transition-transform duration-300 hover:-translate-y-1 triviaaboutbga"
            >
              <div className="w-8 h-8 rounded-xl bg-[#eeeaff] flex items-center justify-center shrink-0 triviaaaimage">
                {renderIcon(card.iconType)}
              </div>
              <div>
                <h3 className="text-lg font-bold headingtexttriviaaa text-[#111827] mb-1">
                  {card.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed paragraphfont">
                  {card.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Center Image */}
        <div className="rounded-3xl overflow-hidden shadow-2xl shadow-purple-900/10 border-4 border-white aspect-square sm:aspect-[4/3] lg:aspect-square relative">
          <img
            src={imageUrl || '/images/chennai-central.jpg'}
            alt="Chennai Central"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right 2 Cards */}
        {/* <div className="flex flex-col gap-6">
          {rightCards?.map((card, idx) => (
            <div
              key={card.id || idx}
              className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-white shadow-xl shadow-purple-500/5 flex items-start gap-4 transition-transform duration-300 hover:-translate-y-1 triviaaboutbga1"
            >
              <div className="w-12 h-12 rounded-xl bg-[#eeeaff] flex items-center justify-center shrink-0 triviaaaimage">
                {renderIcon(card.iconType)}
              </div>
              <div>
                <h3 className="text-lg font-bold headingtexttriviaaa text-[#111827] mb-1">
                  {card.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed paragraphfont">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div> */}
        {/* 
        <div className="flex flex-col gap-6">
          {rightCards?.map((card, idx) => (
            <motion.div
              key={card.id || idx}
              initial={{ opacity: 0, x: 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                type: 'spring',
                stiffness: 40, // Low stiffness = soft and smooth movement
                damping: 15, // Prevents harsh stopping or sticking
                mass: 0.8, // Light feel
                delay: idx * 0.1, // Smooth stagger delay
              }}
              className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-white shadow-xl shadow-purple-500/5 flex items-start gap-4 transition-transform duration-300 hover:-translate-y-1 triviaaboutbga1"
            >
              <div className="w-12 h-12 rounded-xl bg-[#eeeaff] flex items-center justify-center shrink-0 triviaaaimage">
                {renderIcon(card.iconType)}
              </div>
              <div>
                <h3 className="text-lg font-bold headingtexttriviaaa text-[#111827] mb-1">
                  {card.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed paragraphfont">
                  {card.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div> */}

        <div className="flex flex-col gap-6">
          {rightCards?.map((card, idx) => (
            <motion.div
              key={card.id || idx}
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.8, // Slightly longer duration for a buttery feel
                ease: [0.16, 1, 0.3, 1], // AOS signature ease-out-expo curve
                delay: idx * 0.12, // Smooth sequential entrance
              }}
              className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-white shadow-xl shadow-purple-500/5 flex items-start gap-4 transition-transform duration-300 hover:-translate-y-1 triviaaboutbga1"
            >
              <div className="w-12 h-12 rounded-xl bg-[#eeeaff] flex items-center justify-center shrink-0 triviaaaimage">
                {renderIcon(card.iconType)}
              </div>
              <div>
                <h3 className="text-lg font-bold headingtexttriviaaa text-[#111827] mb-1">
                  {card.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed paragraphfont">
                  {card.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom CTA Buttons / Dynamic Play Button if logged in */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4 relative z-10">
        {isLoggedIn ? (
          <Link
            href="/quizzes"
            className="py-4 px-10 rounded-2xl bg-gradient-to-r from-[#5122f2] to-[#6d3aff] text-white font-extrabold text-lg shadow-xl shadow-purple-500/30 hover:scale-105 transition-all flex items-center gap-3 animate-pulse buttonpaaddinggg"
          >
            <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            <span>Play Now</span>
          </Link>
        ) : (
          <>
            <Link
              href={signUpUrl}
              className="py-3 px-8 rounded-xl bg-gradient-to-r from-[#5122f2] to-[#6d3aff] text-white font-semibold text-base shadow-lg shadow-purple-500/25 hover:opacity-95 transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              <span>{signUpText}</span>
            </Link>

            <Link
              href={loginUrl}
              className="py-3 px-8 rounded-xl bg-white/80 hover:bg-white text-[#5122f2] border border-[#5122f2]/30 font-semibold text-base shadow-sm transition-all flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              <span>{loginText}</span>
            </Link>
          </>
        )}
      </div>
    </section>
  )
}
