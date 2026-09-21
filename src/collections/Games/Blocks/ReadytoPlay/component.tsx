'use client'

import React from 'react'
import Link from 'next/link'

type CardItem = {
  id?: string
  title: string
  description: string
  buttonText: string
  buttonUrl: string
  cardBgColor?: 'white' | 'cream' | string
}

type TriviaAuthProps = {
  topSubtitle?: string
  mainTitle?: string
  highlightText?: string
  subDescription?: string
  cards?: CardItem[]
}

export default function TriviaAuthComponent({
  topSubtitle = 'CHENZ QUIZ',
  mainTitle = 'Ready to Play',
  highlightText = 'Trivia?',
  subDescription = 'Join the Chennai Trivia community.',
  cards = [
    {
      title: 'Login',
      description: 'Already have an account? Jump back in and continue your quiz journey.',
      buttonText: 'Login',
      buttonUrl: '/login',
      cardBgColor: 'white',
    },
    {
      title: 'Sign Up',
      description:
        'New to CHENZ Quiz? Create your account and start testing your Chennai knowledge.',
      buttonText: 'Sign Up',
      buttonUrl: '/signup',
      cardBgColor: 'cream',
    },
  ],
}: TriviaAuthProps) {
  return (
    <section className="relative w-full py-16 px-4 bg-gradient-to-b from-[#f3f0ff] via-[#f7f5ff] to-[#e8e3ff] overflow-hidden loginsignupbg">
      {/* Title Header */}
      <div className="text-center mb-10 relative z-10">
        <div className="inline-block w-12 h-1 bg-[#6c42f5] rounded-full mb-2" />
        <p className="text-sm font-bold text-[#6c42f5] uppercase mb-2 paragraphfont">
          {topSubtitle}
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl   font-bold font-black text-[#0f172a] ">
          {mainTitle} <span className="text-[#5122f2]">{highlightText}</span>
        </h2>
        <p className="text-gray-600 mt-2 font-medium text-base sm:text-lg">{subDescription}</p>
      </div>

      {/* Cards Container */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 px-2">
        {cards?.map((card, idx) => {
          const isCream = card.cardBgColor === 'cream'
          const isSignUp = card.title.toLowerCase().includes('sign')

          return (
            <div
              key={card.id || idx}
              className={`rounded-[32px] p-8 sm:p-10 flex flex-col items-center text-center shadow-xl shadow-purple-500/5 backdrop-blur-md transition-transform duration-300 hover:-translate-y-1 ${
                isCream
                  ? 'bg-[#fdfbf7]/90 border border-[#f5efe6]'
                  : 'bg-white/90 border border-white'
              }`}
            >
              {/* Card Icon */}
              <div className="w-20 h-20 rounded-2xl bg-[#eeeaff] flex items-center justify-center mb-6 relative">
                {isSignUp ? (
                  <div className="relative">
                    <svg
                      className="w-10 h-10 text-[#5122f2]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                    <span className="absolute -bottom-1 -right-1 bg-[#5122f2] text-white rounded-full w-5 h-5 text-xs flex items-center justify-center font-bold">
                      +
                    </span>
                  </div>
                ) : (
                  <svg
                    className="w-10 h-10 text-[#5122f2]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                )}
              </div>

              {/* Title & Description */}
              <h3 className="text-2xl font-bold text-[#111827] mb-3">{card.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed paragraphfont mb-6 max-w-xs min-h-[48px]">
                {card.description}
              </p>

              {/* Redirect Action Button */}
              <Link
                href={card.buttonUrl}
                className="w-full mt-auto py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#5122f2] to-[#6d3aff] text-white font-semibold text-base shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:opacity-95 transition-all flex items-center justify-center gap-2 group"
              >
                <span>{card.buttonText}</span>
                <svg
                  className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </div>
          )
        })}
      </div>
    </section>
  )
}
