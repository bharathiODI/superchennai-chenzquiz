/* eslint-disable @next/next/no-img-element */
'use client'

// The daily play (lean setup, Nov 2026). One question at a time: the server sends the question
// without its answer and starts its timer; each answer goes to the server, which checks it, times
// it and replies with the result. A reload resumes the same question with the time left.
import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MCQGame } from './components/games/MCQGame'
import { WordleGame } from './components/games/WordleGame'
import { WordFinderGame } from './components/games/WordFinderGame'
import { DropdownGame } from './components/games/DropdownGame'
import { ReorderGame } from './components/games/ReorderGame'
import { MatchGame } from './components/games/MatchGame'
import { SpotLieGame } from './components/games/SpotLieGame'
import { DragDropGame } from './components/games/DragDropGame'

import confetti from 'canvas-confetti'
import QuizResultCard, { type SubmitTitle } from './components/QuizResultCard'
import { DEFAULT_SCORING, speedBonus, type ScoringSettings } from '@/utilities/gameScoring'

type Answered = { position: number; correct: boolean; timedOut: boolean; points: number }
type Play = {
  roundId: string | number
  position: number
  total: number
  question: any
  timeLimit: number
  secondsLeft: number
  answers: Answered[]
  scoreSoFar: number
  scoring: ScoringSettings
}
type Feedback = {
  position: number
  total: number
  correct: boolean
  timedOut: boolean
  points: number
  speedBonus: number
  explanation: string | null
  reveal: { correctOptionId?: string | null; correctAnswer?: string | null }
  pickedId?: string | null
  finished: boolean
  scoreSoFar: number
  result?: { todayScore: number; totalXP: number; title: SubmitTitle }
}

const DEVICE_KEY = 'chenz-device-id'
function deviceId(): string {
  try {
    let id = localStorage.getItem(DEVICE_KEY)
    if (!id || !/^[a-zA-Z0-9_-]{8,64}$/.test(id)) {
      id =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID().replace(/-/g, '')
          : `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`
      localStorage.setItem(DEVICE_KEY, id)
    }
    return id
  } catch {
    return ''
  }
}

const celebrate = () => {
  confetti({ particleCount: 100, spread: 80, startVelocity: 45, origin: { x: 0.5, y: 0.65 } })
  setTimeout(
    () =>
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 70,
        startVelocity: 50,
        origin: { x: 0, y: 0.65 },
      }),
    200,
  )
  setTimeout(
    () =>
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 70,
        startVelocity: 50,
        origin: { x: 1, y: 0.65 },
      }),
    400,
  )
}

export default function GameEngineClient({ quiz }: { quiz: any }) {
  const router = useRouter()
  const [phase, setPhase] = useState<
    'loading' | 'notice' | 'playing' | 'feedback' | 'finished' | 'done'
  >('loading')
  const [play, setPlay] = useState<Play | null>(null)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [notice, setNotice] = useState<{ title?: string; text: string } | null>(null)
  const [done, setDone] = useState<{
    todayScore: number
    opensAt: string | null
    otherQuiz?: string | null
  } | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const deadlineRef = useRef(0)
  const busyRef = useRef(false)

  const headers = useCallback(
    (): HeadersInit => ({ 'Content-Type': 'application/json', 'x-device-id': deviceId() }),
    [],
  )

  /** Today's state from the server: the current question, or why there is none. */
  const load = useCallback(async () => {
    setError(null)
    try {
      const res = await fetch(`/api/quiz-round?quizId=${quiz.id}`, {
        cache: 'no-store',
        headers: headers(),
      })
      if (res.status === 401) {
        router.push('/login')
        return
      }
      const data = await res.json()
      setFeedback(null)
      if (data?.state === 'playing') {
        setPlay(data)
        deadlineRef.current = Date.now() + Number(data.secondsLeft) * 1000
        setTimeLeft(Math.ceil(Number(data.secondsLeft)))
        setPhase('playing')
      } else if (data?.state === 'done') {
        setDone({
          todayScore: Number(data.todayScore) || 0,
          opensAt: data.opensAt ?? null,
          otherQuiz: data.otherQuiz ?? null,
        })
        setPhase('done')
      } else {
        const when = (iso?: string | null) =>
          iso
            ? new Date(iso).toLocaleString('en-IN', {
                timeZone: 'Asia/Kolkata',
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              })
            : ''
        const texts: Record<string, { title?: string; text: string }> = {
          not_started: {
            title: 'Starting soon',
            text: data.startsAt
              ? `This quiz opens on ${when(data.startsAt)}. Check back then!`
              : 'This quiz has not started yet. Check back soon!',
          },
          closed: {
            title: 'This quiz has ended',
            text: data.endsAt
              ? `It closed on ${when(data.endsAt)}. Thanks for playing!`
              : 'Thanks for playing!',
          },
          maintenance: {
            title: 'Back in a few minutes',
            text: data.message || 'Chenz Quiz is being updated. Please try again in a few minutes.',
          },
          cooloff: {
            title: "Today's round has closed",
            text: `Today's round has closed. New questions open at ${data.opensAt || '12:30 AM'}.`,
          },
          empty: {
            text: `You've played all the questions available right now. New questions open at ${data.opensAt || '12:30 AM'}.`,
          },
        }
        setNotice(
          texts[data?.state] || {
            text: 'We could not load your questions. Please reload the page.',
          },
        )
        setPhase('notice')
      }
    } catch {
      setNotice({
        text: 'We could not load your questions. Please check your connection and reload.',
      })
      setPhase('notice')
    }
  }, [quiz.id, headers, router])

  // Logged in? Then load today's play.
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    if (!storedUser || !token) {
      router.push('/login')
      return
    }
    try {
      setCurrentUser(JSON.parse(storedUser))
    } catch {
      /* ignore */
    }
    load()
  }, [load, router])

  /** Sends one answer (or a time-out) for the current question. */
  const sendAnswer = useCallback(
    async (answer: Record<string, unknown>, pickedId: string | null = null) => {
      if (!play || busyRef.current) return
      busyRef.current = true
      setBusy(true)
      setError(null)
      try {
        const res = await fetch('/api/quiz-answer', {
          method: 'POST',
          headers: headers(),
          body: JSON.stringify({ roundId: play.roundId, position: play.position, answer }),
        })
        if (res.status === 401) {
          router.push('/login')
          return
        }
        const data = await res.json().catch(() => null)
        if (res.status === 409) {
          await load() // already answered (another tab) or out of step: take the server's state
          return
        }
        if (!res.ok || !data?.ok) {
          setError(data?.error || 'Could not save your answer. Please try again.')
          return
        }
        setFeedback({ ...data, pickedId })
        setPhase('feedback')
        if (data.finished) celebrate()
      } catch {
        setError('Could not reach the server. Check your connection and try again.')
      } finally {
        busyRef.current = false
        setBusy(false)
      }
    },
    [play, headers, load, router],
  )

  // Countdown from the server's time left; at zero, a time-out is recorded.
  useEffect(() => {
    if (phase !== 'playing' || !play) return
    const tick = () => {
      const left = Math.max(0, (deadlineRef.current - Date.now()) / 1000)
      setTimeLeft(Math.ceil(left))
      if (left <= 0) {
        clearInterval(timer)
        sendAnswer({ timeout: true })
      }
    }
    const timer = setInterval(tick, 250)
    tick()
    return () => clearInterval(timer)
  }, [phase, play, sendAnswer])

  useEffect(() => {
    if (phase === 'done') celebrate()
  }, [phase])

  /** A game component finished: turn its result into the answer the server expects. */
  const onGameAnswer = (res: any) => {
    const type = play?.question?.gameType
    if (type === 'mcq') sendAnswer({ optionId: res.optionId }, res.optionId)
    else if (type === 'dropdown') sendAnswer({ value: res.value ?? res.answerDetail })
    else
      sendAnswer({
        correct: Boolean(res?.isCorrect),
        detail:
          typeof res?.answerDetail === 'string'
            ? res.answerDetail
            : JSON.stringify(res?.answerDetail ?? ''),
      })
  }

  const next = () => {
    if (feedback?.finished) setPhase('finished')
    else {
      setPhase('loading')
      load()
    }
  }

  /* ------------------------------------------------------------------ screens */

  if (phase === 'loading') {
    return (
      <div className="relative flex flex-col items-center justify-center p-12 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-w-md mx-auto my-12">
        <div className="relative flex items-center justify-center mb-6">
          <svg className="w-16 h-16 animate-spin text-indigo-500" viewBox="0 0 100 100" fill="none">
            <circle
              className="opacity-15"
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
            />
            <path
              d="M50 10 A 40 40 0 0 1 90 50"
              stroke="#7c3aed"
              strokeWidth="8"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-white tracking-wide mb-1">Loading your question</h3>
        <p className="text-slate-400 text-sm font-medium">
          Getting today&apos;s challenge ready...
        </p>
      </div>
    )
  }

  if (phase === 'done' && done) {
    return (
      <div className="relative overflow-hidden bg-white/95 backdrop-blur-xl border border-amber-200/80 rounded-3xl p-8 sm:p-10 text-center shadow-xl shadow-amber-500/5 max-w-lg mx-auto my-6">
        <div className="relative mx-auto w-20 h-20 mb-6 flex items-center justify-center bg-amber-100 rounded-full text-4xl shadow-inner border border-amber-200">
          ⏳
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#03045e] via-[#7000ff] to-[#ff007a] mb-2">
          Already Played Today!
        </h2>
        <p className="text-slate-600 text-sm leading-relaxed mb-6">
          {done.otherQuiz ? `You've played today's questions in ${done.otherQuiz}. ` : ''}
          {done.opensAt
            ? `New questions open at ${done.opensAt}.`
            : 'Come back tomorrow for a fresh set of questions.'}
        </p>
        <div className="bg-amber-50/80 border border-amber-200/60 rounded-2xl p-4 max-w-xs mx-auto mb-8">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-0.5">
            Today&apos;s Score
          </span>
          <span className="text-3xl font-black text-amber-900">+{done.todayScore} XP</span>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/leaderboard"
            className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-purple-500/20 transition-all duration-200"
          >
            Check Leaderboard
          </Link>
          <Link
            href="/profile"
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-bold text-sm rounded-2xl transition-all duration-200"
          >
            My Profile
          </Link>
        </div>
      </div>
    )
  }

  if (phase === 'finished' && feedback?.result) {
    return (
      <QuizResultCard
        playerName={currentUser?.name}
        scoreEarned={feedback.result.todayScore}
        title={feedback.result.title}
        isSubmitting={false}
      />
    )
  }

  if (phase === 'notice' || !play) {
    return (
      <div className="relative overflow-hidden bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-8 md:p-12 text-center shadow-xl shadow-slate-100/50 max-w-lg mx-auto">
        <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">
          {notice?.title || 'No Questions Available'}
        </h3>
        <p className="text-slate-500 text-sm md:text-base leading-relaxed mb-8 max-w-sm mx-auto">
          {notice?.text || 'We could not find any questions right now.'}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => router.push('/quizzes')}
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold text-sm rounded-2xl shadow-lg transition-all duration-200"
          >
            Back to Quizzes
          </button>
          <button
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200/80 active:scale-95 text-slate-700 font-bold text-sm rounded-2xl transition-all duration-200"
          >
            Reload Page
          </button>
        </div>
      </div>
    )
  }

  /* ------------------------------------------------------------------ the question */

  const q = play.question
  const gameType = q?.gameType
  const slot = q?.slot || {}
  const locked = phase === 'feedback' || busy
  const timeLimit = Number(play.timeLimit) || 20
  const shownLeft = phase === 'feedback' ? 0 : timeLeft
  const timerPercentage = Math.max(0, Math.min(100, (shownLeft / timeLimit) * 100))
  const isTimeLow = shownLeft <= 5 && phase === 'playing'
  const scoring = play.scoring || DEFAULT_SCORING
  const gameData = { ...q, initialAnswer: null }
  const sponsorText =
    slot.sponsorLine ||
    (slot.extraSeconds && slot.sponsorName
      ? `+${slot.extraSeconds} seconds on this question, courtesy of ${slot.sponsorName}`
      : '')

  return (
    <div className="relative bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs">
      {/* Timer bar */}
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-6">
        <div
          className={`h-full transition-all duration-300 ease-linear ${isTimeLow ? 'bg-rose-500' : 'bg-indigo-600'}`}
          style={{ width: `${timerPercentage}%` }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6 flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-bold text-[18px] rounded-full uppercase">
            Question {play.position + 1} of {play.total}
          </span>
          {phase === 'playing' && (
            <span
              className={`px-3 py-1 font-bold text-[18px] rounded-full transition-colors ${
                isTimeLow
                  ? 'bg-rose-100 text-rose-700 animate-pulse'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              ⏱️ {shownLeft}s
            </span>
          )}
          <span className="flex items-center gap-1" aria-label="Your answers so far">
            {Array.from({ length: play.total }, (_, i) => {
              const a = play.answers.find((x) => x.position === i + 1)
              const mine = feedback && feedback.position === i ? feedback : null
              const ok = a ? a.correct : mine ? mine.correct : null
              return (
                <span
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full ${ok === true ? 'bg-emerald-500' : ok === false ? 'bg-rose-400' : i === play.position ? 'bg-indigo-500' : 'bg-slate-200'}`}
                />
              )
            })}
          </span>
        </div>
        <span className="font-extrabold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full text-xs">
          +{q?.points ?? 10} XP {q?.enableDoubleUp ? '(2x)' : ''}
          {!slot.fixedPoints && scoring.speedBonus && phase === 'playing' && (
            <> · ⚡ +{speedBonus(shownLeft, timeLimit, scoring)} speed</>
          )}
        </span>
      </div>

      {/* Sponsored question */}
      {slot.sponsored && (
        <div className="mb-5 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
          {slot.sponsorLogo && (
            <img
              src={slot.sponsorLogo}
              alt={slot.sponsorName || 'Sponsor'}
              className="h-10 w-auto max-w-[120px] object-contain"
            />
          )}
          <div className="text-left">
            <span className="block text-xs font-bold uppercase tracking-wider text-amber-700">
              Sponsored{slot.sponsorName ? ` by ${slot.sponsorName}` : ''}
            </span>
            {sponsorText && (
              <span className="block text-sm font-semibold text-amber-900">{sponsorText}</span>
            )}
          </div>
        </div>
      )}

      {q?.heroImage && (
        <div className="mb-6 overflow-hidden rounded-2xl border border-slate-100 max-h-72">
          <img
            src={q.heroImage}
            alt={q?.questionTitle || 'Question'}
            className="w-full h-full object-cover quizzzimagesectionnn "
          />
        </div>
      )}

      <h2 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#03045e] via-[#7000ff] to-[#ff007a] mb-2">
        {q?.questionTitle || q?.title || 'Challenge'}
      </h2>
      {q?.content && (
        <p className="text-slate-600 text-sm leading-relaxed mb-6 whitespace-pre-line">
          {q.content}
        </p>
      )}

      <div
        className={`min-h-[250px] mt-4 ${locked && gameType !== 'mcq' ? 'pointer-events-none opacity-70' : ''}`}
      >
        {gameType === 'mcq' && (
          <MCQGame
            key={`${play.roundId}-${play.position}`}
            data={gameData}
            onComplete={onGameAnswer}
            locked={locked}
            reveal={
              feedback
                ? {
                    pickedId: feedback.pickedId ?? null,
                    correctOptionId: feedback.reveal?.correctOptionId ?? null,
                  }
                : null
            }
          />
        )}
        {gameType === 'dropdown' && (
          <DropdownGame
            key={`${play.roundId}-${play.position}`}
            data={gameData}
            onComplete={onGameAnswer}
            locked={locked}
          />
        )}
        {gameType === 'wordle' && (
          <WordleGame
            key={`${play.roundId}-${play.position}`}
            data={gameData}
            onComplete={onGameAnswer}
          />
        )}
        {gameType === 'word_finder' && (
          <WordFinderGame
            key={`${play.roundId}-${play.position}`}
            data={gameData}
            onComplete={onGameAnswer}
          />
        )}
        {gameType === 'match_following' && (
          <MatchGame
            key={`${play.roundId}-${play.position}`}
            data={gameData}
            onComplete={onGameAnswer}
          />
        )}
        {gameType === 'spot_lie' && (
          <SpotLieGame
            key={`${play.roundId}-${play.position}`}
            data={gameData}
            onSelect={onGameAnswer}
          />
        )}
        {gameType === 'reorder' && (
          <ReorderGame
            key={`${play.roundId}-${play.position}`}
            data={gameData}
            onComplete={onGameAnswer}
          />
        )}
        {gameType === 'drag_drop' && (
          <DragDropGame
            key={`${play.roundId}-${play.position}`}
            data={gameData}
            onComplete={onGameAnswer}
          />
        )}
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          {error}{' '}
          <button type="button" className="underline" onClick={() => load()}>
            Reload the question
          </button>
        </div>
      )}

      {/* Result of this answer */}
      {phase === 'feedback' && feedback && (
        <div
          className={`mt-6 rounded-2xl border p-5 ${
            feedback.correct ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'
          }`}
        >
          <p
            className={`text-lg font-black ${feedback.correct ? 'text-emerald-800' : 'text-rose-800'}`}
          >
            {feedback.correct ? '✅ Correct!' : feedback.timedOut ? "⏱️ Time's up" : '❌ Not quite'}
            {feedback.points !== 0 && (
              <span className="ml-2 text-base font-bold">
                {feedback.points > 0 ? '+' : ''}
                {feedback.points} XP
                {feedback.speedBonus ? ` (⚡ +${feedback.speedBonus} speed)` : ''}
              </span>
            )}
          </p>
          {!feedback.correct && feedback.reveal?.correctAnswer && (
            <p className="mt-1 text-sm font-semibold text-slate-700">
              Answer: {feedback.reveal.correctAnswer}
            </p>
          )}
          {feedback.explanation && (
            <p className="mt-2 text-sm text-slate-700">
              <span className="font-bold">💡 </span>
              {feedback.explanation}
            </p>
          )}
          <button
            type="button"
            onClick={next}
            className="mt-4 w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition shadow-md"
          >
            {feedback.finished ? 'See my score' : 'Next question →'}
          </button>
        </div>
      )}
    </div>
  )
}
