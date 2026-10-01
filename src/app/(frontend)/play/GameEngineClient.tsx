'use client'

import { useState, useEffect, useRef } from 'react'
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

export default function GameEngineClient({ quiz }: { quiz: any }) {
  const router = useRouter()
  const questions = quiz?.questions || []
  const [currentIndex, setCurrentIndex] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [answersLog, setAnswersLog] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isLoadingAuth, setIsLoadingAuth] = useState(true)

  const currentQ = questions[currentIndex]
  const questionTimeLimit = Number(currentQ?.timeLimit ?? 60)
  // Timer State
  const [timeLeft, setTimeLeft] = useState<number>(questionTimeLimit)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // 1. Auth Protection Check & User Extraction
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const token = localStorage.getItem('token')

    if (!storedUser || !token) {
      router.push('/login')
    } else {
      try {
        const parsedUser = JSON.parse(storedUser)
        setCurrentUser(parsedUser)
      } catch (e) {
        router.push('/login')
      } finally {
        setIsLoadingAuth(false)
      }
    }
  }, [router])

  // 2. Active Countdown Timer Logic
  useEffect(() => {
    if (isCompleted || !currentQ) return

    // Reset timer when question index updates
    setTimeLeft(questionTimeLimit)

    if (timerRef.current) clearInterval(timerRef.current)

    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          // Handle automatic timeout submission (Wrong Answer/0 Points)
          handleGameCompletion({
            isCorrect: false,
            pointsEarned: 0,
            answerDetail: 'Time Out',
          })
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [currentIndex, isCompleted, questionTimeLimit])

  const handleGameCompletion = (result: {
    isCorrect: boolean
    pointsEarned?: number
    answerDetail?: any
  }) => {
    // Clear timer when user submits an answer
    if (timerRef.current) clearInterval(timerRef.current)

    const defaultPoints = Number(currentQ?.points ?? 10)
    const negativePoints = Number(currentQ?.negativePoints ?? 0)

    let pointsToAdd = 0
    if (result.isCorrect) {
      pointsToAdd = result.pointsEarned ?? defaultPoints
      if (currentQ?.enableDoubleUp) {
        pointsToAdd *= 2
      }
    } else {
      pointsToAdd = -Math.abs(negativePoints)
    }

    const updatedScore = totalScore + pointsToAdd
    const currentLog = {
      questionId: currentQ?.id,
      title: currentQ?.questionTitle || currentQ?.title,
      gameType: currentQ?.gameType,
      isCorrect: result.isCorrect,
      pointsEarned: pointsToAdd,
      userAnswer: result.answerDetail || null,
    }

    const updatedLog = [...answersLog, currentLog]

    setTotalScore(updatedScore)
    setAnswersLog(updatedLog)

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      setIsCompleted(true)
      submitFinalScore(updatedScore, updatedLog)
    }
  }

  const submitFinalScore = async (finalScore: number, logs: any[]) => {
    try {
      const activeUserId = currentUser?.id

      if (!activeUserId) {
        console.error('❌ User ID missing for submission')
        return
      }

      const res = await fetch('/api/quiz-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId: quiz?.id,
          userId: activeUserId,
          scoreEarned: finalScore,
          answers: logs,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        console.error('❌ API Error submitting score:', data)
      } else {
        console.log('✅ Score submitted successfully!', data)
      }
    } catch (err) {
      console.error('❌ Error submitting score:', err)
    }
  }


  if (isLoadingAuth) {
    return (
      <div className="relative flex flex-col items-center justify-center p-12 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-w-md mx-auto my-12">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex items-center justify-center mb-6">
          <svg
            className="w-16 h-16 animate-spin text-indigo-500"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="spinner-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
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
              stroke="url(#spinner-gradient)"
              strokeWidth="8"
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute text-indigo-400 animate-pulse">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 002-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        </div>

        <h3 className="text-lg font-bold text-white tracking-wide mb-1">Verifying Identity</h3>
        <p className="text-slate-400 text-sm font-medium flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Authenticating player profile...
        </p>
      </div>
    )
  }

  if (isCompleted) {
    return (
      <div className="bg-white border border-slate-200 p-10 rounded-3xl shadow-lg text-center max-w-lg mx-auto">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
          🏆
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">Quiz Completed!</h2>
        <p className="text-slate-500 mb-6">
          Great effort {currentUser?.name}! Here is your total score:
        </p>
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 max-w-xs mx-auto mb-8">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            Total Score
          </p>
          <p className="text-5xl font-black text-indigo-600">{totalScore} XP</p>
        </div>
        <Link
          href="/leaderboard"
          className="inline-block px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition"
        >
          View Leaderboard
        </Link>
      </div>
    )
  }

  if (!currentQ) {
    return (
      <div className="relative overflow-hidden bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-8 md:p-12 text-center shadow-xl shadow-slate-100/50 max-w-lg mx-auto">
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative mx-auto w-28 h-28 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 bg-indigo-50/80 rounded-full animate-pulse" />
          <svg
            className="relative w-16 h-16 text-indigo-500 drop-shadow-sm transition-transform duration-300 hover:scale-105"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" className="stroke-indigo-600" />
            <path d="m21 21-4.3-4.3" className="stroke-indigo-600" strokeWidth="2" />
            <path
              d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2 2-2 3"
              className="stroke-amber-500"
              strokeWidth="2"
            />
            <circle cx="12.5" cy="15" r="0.5" fill="currentColor" className="text-amber-500" />
          </svg>
        </div>

        <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">
          No Questions Available
        </h3>
        <p className="text-slate-500 text-sm md:text-base leading-relaxed mb-8 max-w-sm mx-auto">
          We couldn’t find any questions for this quiz module or all challenges have been completed.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => router.push('/quizzes')}
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold text-sm rounded-2xl shadow-lg shadow-slate-900/10 transition-all duration-200"
          >
            Explore Other Quizzes
          </button>
          <button
            onClick={() => router.refresh()}
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200/80 active:scale-95 text-slate-700 font-bold text-sm rounded-2xl transition-all duration-200"
          >
            Reload Page
          </button>
        </div>
      </div>
    )
  }

  // Extract Question Level Properties
  const gameType = currentQ?.gameType
  const points = currentQ?.points ?? 10
  const timeLimit = currentQ?.timeLimit ?? 60
  const difficulty = currentQ?.difficulty || 'Medium'
  const questionTitle = currentQ?.questionTitle || currentQ?.title || 'Challenge'
  const heroImage = currentQ?.heroImage
  const contentText = currentQ?.content

  // Structure Data payload passed into sub-components
  const gameData = {
    ...currentQ,
    // Inject top-level props directly into sub group objects if needed by child components
    mcqGroup: currentQ?.mcqGroup,
    dropdownGroup: currentQ?.dropdownGroup,
    wordleGroup: currentQ?.wordleGroup,
    wordFinderGroup: currentQ?.wordFinderGroup,
    matchGroup: currentQ?.matchGroup,
    spotLieGroup: currentQ?.spotLieGroup,
    reorderGroup: currentQ?.reorderGroup,
    dragDropGroup: currentQ?.dragDropGroup,
  }

  // Calculate Progress Bar %
  const timerPercentage = (timeLeft / questionTimeLimit) * 100
  const isTimeLow = timeLeft <= 10

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs">
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-6">
        <div
          className={`h-full transition-all duration-1000 ease-linear ${
            isTimeLow ? 'bg-rose-500' : 'bg-indigo-600'
          }`}
          style={{ width: `${timerPercentage}%` }}
        />
      </div>
      {/* Header Info Bar */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-full uppercase tracking-wider">
            Game {currentIndex + 1} of {questions.length}
          </span>
          <span
            className={`px-3 py-1 font-bold text-xs rounded-full transition-colors flex items-center gap-1 ${
              isTimeLow ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-slate-100 text-slate-700'
            }`}
          >
            ⏱️ {timeLeft}s
          </span>
          <span className="px-3 py-1 bg-slate-100 text-slate-600 font-semibold text-xs rounded-full uppercase">
            {gameType ? gameType.replace('_', ' ') : 'Loading...'}
          </span>
          <span className="px-2.5 py-1 bg-slate-100 text-slate-500 font-medium text-xs rounded-full">
            ⏱️ {timeLimit}s
          </span>
          <span className="px-2.5 py-1 bg-slate-100 text-slate-500 font-medium text-xs rounded-full">
            🎯 {difficulty}
          </span>
        </div>
        <span className="font-extrabold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full text-xs">
          +{points} XP {currentQ?.enableDoubleUp ? '(2x ⚡)' : ''}
        </span>
      </div>

      {/* Hero Image / Header Media */}
      {heroImage && (
        <div className="mb-6 overflow-hidden rounded-2xl border border-slate-100 max-h-72">
          <img src={heroImage} alt={questionTitle} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Question Title & Description */}
      <h2 className="text-2xl font-black text-slate-900 mb-2">{questionTitle}</h2>
      {contentText && (
        <p className="text-slate-600 text-sm leading-relaxed mb-6 whitespace-pre-line">
          {contentText}
        </p>
      )}

      {/* Active Game Component Container */}
      <div className="min-h-[250px] mt-4">
        {gameType === 'mcq' && <MCQGame data={gameData} onComplete={handleGameCompletion} />}
        {gameType === 'wordle' && <WordleGame data={gameData} onComplete={handleGameCompletion} />}
        {gameType === 'word_finder' && (
          <WordFinderGame data={gameData} onComplete={handleGameCompletion} />
        )}
        {gameType === 'dropdown' && (
          <DropdownGame data={gameData} onComplete={handleGameCompletion} />
        )}
        {gameType === 'match_following' && (
          <MatchGame data={gameData} onComplete={handleGameCompletion} />
        )}
        {gameType === 'spot_lie' && <SpotLieGame data={gameData} onSelect={handleGameCompletion} />}
        {gameType === 'reorder' && (
          <ReorderGame data={gameData} onComplete={handleGameCompletion} />
        )}
        {gameType === 'drag_drop' && (
          <DragDropGame data={gameData} onComplete={handleGameCompletion} />
        )}
      </div>

      {/* Explanation Footer (if present) */}
      {currentQ?.explanation && (
        <div className="mt-8 pt-4 border-t border-slate-100 bg-indigo-50/50 p-4 rounded-2xl text-xs text-indigo-900">
          <span className="font-bold block mb-1">💡 Hint / Explanation:</span>
          {currentQ.explanation}
        </div>
      )}
    </div>
  )
}
