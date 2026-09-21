'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

interface QuizCountdownProps {
  quizDate: string
  slug: string
  questionCount: number
  quizTitle: string
}

export default function QuizCountdown({
  quizDate,
  slug,
  questionCount,
  quizTitle,
}: QuizCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)

  const [status, setStatus] = useState<'UPCOMING' | 'LIVE' | 'EXPIRED'>('UPCOMING')

  useEffect(() => {
    const startTime = new Date(quizDate).getTime()
    // 24 Hours duration for live quiz (Adjust if needed)
    const endTime = startTime + 24 * 60 * 60 * 1000

    const updateTimer = () => {
      const now = new Date().getTime()

      if (now >= endTime) {
        // Time expired / Completed
        setStatus('EXPIRED')
        setTimeLeft(null)
      } else if (now >= startTime) {
        // Quiz is currently active
        setStatus('LIVE')
        setTimeLeft(null)
      } else {
        // Upcoming quiz
        const difference = startTime - now
        setStatus('UPCOMING')
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [quizDate])

  // Hydration state placeholder
  if (timeLeft === null && status === 'UPCOMING') {
    return (
      <div className="animate-pulse flex space-x-4 py-8 mb-14">
        <div className="h-48 bg-slate-200/60 rounded-3xl w-full"></div>
      </div>
    )
  }

  /* ================= 1. EXPIRED / COMPLETED STATE ================= */
  if (status === 'EXPIRED') {
    return (
      <div className="mb-14 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden border border-indigo-500/20 text-center md:text-left ">
        {/* Background Decorative Lighting */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            QUIZ CONCLUDED • THANK YOU
          </div>

          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4 text-white">
            {quizTitle}
          </h2>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 mb-8 space-y-3">
            <p className="text-xl font-bold text-amber-300 flex items-center justify-center md:justify-start gap-2">
              <span>🌟</span> Thank You for Your Amazing Participation!
            </p>
            <p className="text-slate-300 text-base leading-relaxed">
              This daily challenge has officially ended. We truly appreciate your enthusiasm and
              brainpower! Check the leaderboard to see the final ranks, or get ready for our next
              upcoming daily quiz!
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <Link
              href="/leaderboard"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm rounded-xl shadow-lg transition transform hover:-translate-y-0.5"
            >
              <span>🏆 View Final Leaderboard</span>
            </Link>

            <span className="text-slate-400 text-sm font-medium">
              Next challenge arriving soon! ⚡
            </span>
          </div>
        </div>
      </div>
    )
  }

  /* ================= 2. LIVE & UPCOMING STATES ================= */
  return (
    <div className="mb-14 bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 text-white rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden border border-indigo-500/20 ">
      {/* Background Decorative Lighting */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold uppercase tracking-wider mb-6">
          <span
            className={`w-2 h-2 rounded-full ${
              status === 'LIVE' ? 'bg-emerald-400 animate-ping' : 'bg-amber-400 animate-pulse'
            }`}
          />
          {status === 'LIVE' ? 'LIVE NOW' : 'UPCOMING QUIZ'} •{' '}
          {new Date(quizDate).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>

        <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 leading-tight">
          {quizTitle}
        </h2>
        <p className="text-indigo-200 text-base md:text-lg mb-8">
          Features {questionCount} unique interactive games (MCQ, Wordle, Spot Lie & more).
        </p>

        {status === 'LIVE' ? (
          /* Quiz is Active - Direct Play Button */
          <div className="space-y-4">
            <Link
              href={`/play/${slug}`}
              className="inline-flex items-center gap-3 px-8 py-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-lg rounded-2xl shadow-xl hover:shadow-amber-400/20 transition transform hover:-translate-y-1 cursor-pointer"
            >
              <span>Play Today Game Now</span>
              <span className="text-xl">➔</span>
            </Link>
          </div>
        ) : (
          /* Quiz is Scheduled - Professional Timer */
          <div className="space-y-6">
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-300">
              Quiz Starts In:
            </p>
            <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-xl">
              <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-3 sm:p-4 text-center">
                <span className="block text-2xl sm:text-4xl font-black text-white font-mono">
                  {String(timeLeft?.days).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-indigo-200 uppercase tracking-wider mt-1 block">
                  Days
                </span>
              </div>

              <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-3 sm:p-4 text-center">
                <span className="block text-2xl sm:text-4xl font-black text-white font-mono">
                  {String(timeLeft?.hours).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-indigo-200 uppercase tracking-wider mt-1 block">
                  Hours
                </span>
              </div>

              <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-3 sm:p-4 text-center">
                <span className="block text-2xl sm:text-4xl font-black text-white font-mono">
                  {String(timeLeft?.minutes).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-indigo-200 uppercase tracking-wider mt-1 block">
                  Mins
                </span>
              </div>

              <div className="bg-amber-400/20 backdrop-blur-xl border border-amber-400/40 rounded-2xl p-3 sm:p-4 text-center">
                <span className="block text-2xl sm:text-4xl font-black text-amber-300 font-mono animate-pulse">
                  {String(timeLeft?.seconds).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-amber-200 uppercase tracking-wider mt-1 block">
                  Secs
                </span>
              </div>
            </div>

            <button
              disabled
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-indigo-200 font-bold text-base rounded-2xl cursor-not-allowed opacity-80"
            >
              <span>🔒 Registration Open • Game Locked</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
