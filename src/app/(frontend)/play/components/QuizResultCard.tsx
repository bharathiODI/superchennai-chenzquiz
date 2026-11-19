'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { FaInstagram, FaWhatsapp } from 'react-icons/fa'
import { Download } from 'lucide-react'
import { TitleBadge } from '@/components/quiz/TitleBadge'

export type SubmitTitle = {
  name: string
  tierIndex: number
  tierCount: number
  nextName: string | null
  xpToNext: number
}

type Props = {
  playerName?: string
  scoreEarned: number
  title: SubmitTitle | null
  isSubmitting: boolean
}

export default function QuizResultCard({ playerName, scoreEarned, title, isSubmitting }: Props) {
  const name = playerName?.trim() || 'Chennai Player'
  const [file, setFile] = useState<File | null>(null)
  const [busy, setBusy] = useState<'whatsapp' | 'instagram' | null>(null)
  const [note, setNote] = useState('')

  const scorecardUrl = useMemo(() => {
    if (!title) return null
    const params = new URLSearchParams({
      name,
      xp: String(scoreEarned),
      title: title.name,
      tier: String(title.tierIndex),
      tiers: String(title.tierCount),
    })
    return `/api/scorecard?${params.toString()}`
  }, [name, scoreEarned, title])

  // Pre-build the scorecard so the share sheet opens instantly on tap
  // (mobile browsers only allow navigator.share right after a user gesture).
  useEffect(() => {
    if (!scorecardUrl) return
    let cancelled = false
    fetch(scorecardUrl)
      .then((r) => (r.ok ? r.blob() : Promise.reject(new Error('scorecard'))))
      .then((blob) => {
        if (!cancelled) setFile(new File([blob], 'chenz-quiz-scorecard.png', { type: 'image/png' }))
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [scorecardUrl])

  const shareText = () => {
    const site = typeof window !== 'undefined' ? window.location.origin : ''
    const titlePart = title ? ` and earned the "${title.name}" title` : ''
    return `I scored ${scoreEarned} XP${titlePart} on the Super Chennai Quiz! Think you know Chennai better? Play now: ${site}`
  }

  const download = (f: File) => {
    const url = URL.createObjectURL(f)
    const a = document.createElement('a')
    a.href = url
    a.download = f.name
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 2000)
  }

  const handleShare = async (target: 'whatsapp' | 'instagram') => {
    setNote('')
    setBusy(target)
    try {
      let f = file
      if (!f && scorecardUrl) {
        const blob = await fetch(scorecardUrl).then((r) => r.blob())
        f = new File([blob], 'chenz-quiz-scorecard.png', { type: 'image/png' })
        setFile(f)
      }

      // Phones: native share sheet with the scorecard image (WhatsApp / Instagram appear there)
      if (f && typeof navigator !== 'undefined' && navigator.canShare?.({ files: [f] })) {
        await navigator.share({ files: [f], text: shareText(), title: 'Chenz Quiz' })
        return
      }

      // Desktop fallback: save the image, then open the app
      if (f) download(f)
      if (target === 'whatsapp') {
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText())}`, '_blank', 'noopener')
        setNote('Scorecard downloaded - attach it to your WhatsApp message.')
      } else {
        window.open('https://www.instagram.com/', '_blank', 'noopener')
        setNote('Scorecard downloaded - upload it to your Instagram story or post.')
      }
    } catch (err: any) {
      if (err?.name !== 'AbortError') setNote('Could not share right now. Please try again.')
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="relative mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-lg sm:p-10">
      <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-4xl">
        🏆
      </div>

      <h2 className="mb-2 text-3xl font-black text-slate-900">Quiz Completed!</h2>
      <p className="mb-6 text-slate-500">Great effort {name}! Here is your total score:</p>

      {/* Your Score */}
      <div className="mx-auto mb-6 max-w-xs rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-400">Your Score</p>
        <p className="text-5xl font-black text-indigo-600">{scoreEarned} XP</p>
      </div>

      {/* Your Title */}
      <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-400">Your Title</p>
      <div className="mb-2 flex min-h-[88px] items-center justify-center">
        {title ? (
          <TitleBadge
            variant="hero"
            name={title.name}
            tierIndex={title.tierIndex}
            tierCount={title.tierCount}
          />
        ) : isSubmitting ? (
          <div className="h-10 w-56 animate-pulse rounded-xl bg-purple-100" />
        ) : (
          <p className="text-sm text-slate-400">Title will appear on your profile.</p>
        )}
      </div>
      {title?.nextName ? (
        <p className="mb-6 text-xs font-semibold text-slate-500">
          {title.xpToNext} XP more to become{' '}
          <span className="font-extrabold text-[#6D28D9]">{title.nextName}</span>
        </p>
      ) : (
        <div className="mb-6" />
      )}

      {/* Share */}
      <div className="mb-6 border-t border-slate-100 pt-5">
        <p className="mb-3 text-sm font-extrabold text-slate-800">Share Your Result</p>
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => handleShare('whatsapp')}
            disabled={!title || busy !== null}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-emerald-400 px-5 py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaWhatsapp className="h-5 w-5 text-emerald-500" />
            {busy === 'whatsapp' ? 'Preparing...' : 'WhatsApp'}
          </button>
          <button
            type="button"
            onClick={() => handleShare('instagram')}
            disabled={!title || busy !== null}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-pink-400 px-5 py-2.5 text-sm font-bold text-pink-700 transition hover:bg-pink-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaInstagram className="h-5 w-5 text-pink-500" />
            {busy === 'instagram' ? 'Preparing...' : 'Instagram'}
          </button>
        </div>
        {file && (
          <button
            type="button"
            onClick={() => download(file)}
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-600"
          >
            <Download className="h-3.5 w-3.5" /> Download scorecard
          </button>
        )}
        {note && <p className="mt-2 text-xs font-semibold text-slate-500">{note}</p>}
      </div>

      <Link
        href="/leaderboard"
        className="inline-block rounded-2xl bg-slate-900 px-8 py-4 font-bold text-white transition hover:bg-slate-800"
      >
        View Leaderboard
      </Link>
    </div>
  )
}
