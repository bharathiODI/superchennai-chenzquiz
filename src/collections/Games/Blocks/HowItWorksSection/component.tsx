'use client'

import React from 'react'

type StepItem = {
  id?: string
  stepNumber: string
  title: string
  description: string
  iconType?: 'userPlus' | 'quiz' | 'trophy' | 'gift' | string
}

type HowItWorksProps = {
  topSubtitle?: string
  mainTitle?: string
  highlightText?: string
  subDescription?: string
  steps?: StepItem[]
}

export default function HowItWorksComponent({
  topSubtitle = 'CHENZ QUIZ',
  mainTitle = 'How It',
  highlightText = 'Works',
  subDescription = 'Four simple steps to play, learn and celebrate Chennai.',
  steps = [
    {
      stepNumber: '01',
      title: 'Sign Up',
      description: 'Create your account in seconds and get ready to play.',
      iconType: 'userPlus',
    },
    {
      stepNumber: '02',
      title: 'Play the Quiz',
      description:
        'Answer fun questions about Chennai – from its history and culture to food, places and more.',
      iconType: 'quiz',
    },
    {
      stepNumber: '03',
      title: 'Earn Points',
      description: 'Score points for correct answers and climb the leaderboard.',
      iconType: 'trophy',
    },
    {
      stepNumber: '04',
      title: 'Win & Be a Chennai Champ!',
      description: 'Top scorers get exciting rewards and bragging rights!',
      iconType: 'gift',
    },
  ],
}: HowItWorksProps) {
  const renderIcon = (type?: string) => {
    switch (type) {
      case 'quiz':
        return (
          <svg
            className="w-10 h-10 text-[#5122f2]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
        )
      case 'trophy':
        return (
          <svg
            className="w-10 h-10 text-[#5122f2]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 21h8m-4-4v4m-5-9a5 5 0 0010 0V3H7v5zm-4-2h4v2H3V6zm14 0h4v2h-4V6z"
            />
          </svg>
        )
      case 'gift':
        return (
          <svg
            className="w-10 h-10 text-[#5122f2]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v13m0-13V3.5A2.5 2.5 0 109.5 6H12zm0 0v13m0-13V3.5A2.5 2.5 0 1114.5 6H12zM3 12h18M5 12v8a1 1 0 001 1h12a1 1 0 001-1v-8M5 12H3a1 1 0 01-1-1V9a1 1 0 011-1h18a1 1 0 011 1v2a1 1 0 01-1 1h-2"
            />
          </svg>
        )
      default: // userPlus
        return (
          <div className="relative">
            <svg className="w-10 h-10 text-[#5122f2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            <span className="absolute -bottom-1 -right-1 bg-[#5122f2] text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center font-bold">
              +
            </span>
          </div>
        )
    }
  }

  return (
    <section className="relative w-full py-16 px-4 bg-gradient-to-b from-[#f3f0ff] via-[#f7f5ff] to-[#e8e3ff] overflow-hidden howitworkssectionbg">
      {/* Title Block */}
      <div className="text-center mb-12 relative z-10">
        <div className="inline-block w-12 h-1 bg-[#6c42f5] rounded-full mb-2" />
        <p className="text-sm font-bold text-[#6c42f5] uppercase mb-2 paragraphfont">
          {topSubtitle}
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black  font-bold text-[#0f172a]">
          {mainTitle} <span className="text-[#5122f2]">{highlightText}</span>
        </h2>
        <p className="text-gray-600 mt-2 font-medium text-base sm:text-lg">{subDescription}</p>
      </div>

      {/* 4 Steps Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10 px-2 ">
        {steps?.map((step, idx) => (
          <div key={step.id || idx} className="relative group">
            {/* Dotted Line Connector for Desktop */}
            {idx < steps.length - 1 && (
              <div className="hidden lg:block absolute top-1/2 -right-9 transform -translate-y-1/2 z-20 pointer-events-none">
                <span className="text-[#a594f9] tracking-widest text-lg font-bold">•••</span>
              </div>
            )}

            <div className="h-full bg-white/90 backdrop-blur-md rounded-[28px] p-8 border border-white shadow-xl shadow-purple-500/5 flex flex-col items-center text-center relative transition-all duration-300 hover:-translate-y-1 hover:shadow-purple-500/10">
              {/* Step Number Tag */}
              <div className="absolute  rounded-[50%] top-4 left-4 bg-[#eeeaff] text-[#5122f2] text-xs font-black px-3 py-3 rounded-full">
                {step.stepNumber}
              </div>

              {/* Icon Container */}
              <div className="w-20 h-20 rounded-[50%] bg-[#eeeaff] flex items-center justify-center mt-4 mb-6 relative">
                {renderIcon(step.iconType)}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-[#111827] mb-3">{step.title}</h3>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed paragraphfont">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
