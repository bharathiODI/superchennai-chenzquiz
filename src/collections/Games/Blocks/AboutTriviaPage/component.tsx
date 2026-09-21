'use client'

import React from 'react'
import Link from 'next/link'

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
  const imageUrl = typeof centerImage === 'object' ? centerImage?.url : centerImage

  const renderIcon = (type?: string) => {
    switch (type) {
      case 'star':
        return (
          <svg
            className="w-6 h-6 text-[#5122f2]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        )
      case 'fire':
        return (
          <svg className="w-6 h-6 text-[#5122f2]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 23c4.97 0 9-3.58 9-8 0-4.19-3.25-7.01-6.13-9.58-.87-.77-1.74-1.55-2.37-2.42-.31-.43-.72-.88-1.05-1.39a1 1 0 00-1.7 0c-.33.51-.74.96-1.05 1.39-.63.87-1.5 1.65-2.37 2.42C3.25 7.99 0 10.81 0 15c0 4.42 4.03 8 9 8h3z" />
          </svg>
        )
      case 'chart':
        return (
          <svg className="w-6 h-6 text-[#5122f2]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 19h4v-7H4v7zm6 0h4V5h-4v14zm6 0h4v-10h-4v10z" />
          </svg>
        )
      default: // list icon
        return (
          <svg
            className="w-6 h-6 text-[#5122f2]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
        )
    }
  }

  return (
    <section className="relative w-full py-16 px-4 bg-gradient-to-b from-[#f3f0ff] via-[#f7f5ff] to-[#e8e3ff] overflow-hidden triviabgsection">
      {/* Title Area */}
      <div className="text-center mb-12 relative z-10">
        <div className="inline-block w-12 h-1 bg-[#6c42f5] rounded-full mb-2" />
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-bold text-[#0f172a]">
          {mainTitle} <span className="text-[#5122f2]">{highlightText}</span>
        </h2>
        <p className="text-gray-600 mt-2 font-medium text-base sm:text-lg">{subDescription}</p>
      </div>

      {/* Main Grid Section */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 items-center relative z-10">
        {/* Left 2 Cards */}
        <div className="flex flex-col gap-6">
          {leftCards?.map((card, idx) => (
            <div
              key={card.id || idx}
              className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-white shadow-xl shadow-purple-500/5 flex items-start gap-4 transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-[#eeeaff] flex items-center justify-center shrink-0">
                {renderIcon(card.iconType)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#111827] mb-1">{card.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed paragraphfont">
                  {card.description}
                </p>
              </div>
            </div>
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
        <div className="flex flex-col gap-6">
          {rightCards?.map((card, idx) => (
            <div
              key={card.id || idx}
              className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-white shadow-xl shadow-purple-500/5 flex items-start gap-4 transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-[#eeeaff] flex items-center justify-center shrink-0">
                {renderIcon(card.iconType)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#111827] mb-1">{card.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed paragraphfont">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA Buttons */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4 relative z-10">
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
      </div>
    </section>
  )
}
