

'use client'

import { useState, useEffect } from 'react'
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

  // 1. Auth Protection Check & User Extraction
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const token = localStorage.getItem('token')

    if (!storedUser || !token) {
      // User Not Logged In -> Redirect to Login
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

  const currentQ = questions[currentIndex]

  const handleGameCompletion = (result: {
    isCorrect: boolean
    pointsEarned?: number
    answerDetail?: any
  }) => {
    const defaultPoints = currentQ?.points || 10
    const pointsToAdd = result.isCorrect ? (result.pointsEarned ?? defaultPoints) : 0

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
          userId: activeUserId, // Pass logged in user ID
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
      <div className="bg-white p-12 rounded-3xl text-center border border-slate-200">
        <p className="text-slate-500 font-bold">Verifying Authentication...</p>
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
        <p className="text-slate-500 mb-6">Great effort {currentUser?.name}! Here is your total score:</p>
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
      <div className="bg-white p-8 rounded-2xl text-center border border-slate-200">
        <p className="text-slate-500">No questions found in this quiz session.</p>
      </div>
    )
  }

  const gameType = currentQ?.gameType
  const points = currentQ?.points || 10
  const questionTitle = currentQ?.questionTitle || currentQ?.title || 'Challenge'

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-full uppercase tracking-wider">
            Game {currentIndex + 1} of {questions.length}
          </span>
          <span className="px-3 py-1 bg-slate-100 text-slate-600 font-semibold text-xs rounded-full uppercase">
            {gameType ? gameType.replace('_', ' ') : 'Loading...'}
          </span>
        </div>
        <span className="font-extrabold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full text-xs">
          +{points} XP
        </span>
      </div>

      <h2 className="text-2xl font-black text-slate-900 mb-6">{questionTitle}</h2>

      <div className="min-h-[250px]">
        {gameType === 'mcq' && <MCQGame data={currentQ} onComplete={handleGameCompletion} />}
        {gameType === 'wordle' && <WordleGame data={currentQ} onComplete={handleGameCompletion} />}
        {gameType === 'word_finder' && (
          <WordFinderGame data={currentQ} onComplete={handleGameCompletion} />
        )}
        {gameType === 'dropdown' && (
          <DropdownGame data={currentQ} onComplete={handleGameCompletion} />
        )}
        {gameType === 'match_following' && (
          <MatchGame data={currentQ} onComplete={handleGameCompletion} />
        )}
        {gameType === 'spot_lie' && (
          <SpotLieGame data={currentQ} onSelect={handleGameCompletion} />
        )}
        {gameType === 'reorder' && (
          <ReorderGame data={currentQ} onComplete={handleGameCompletion} />
        )}
        {gameType === 'drag_drop' && (
          <DragDropGame data={currentQ} onComplete={handleGameCompletion} />
        )}
      </div>
    </div>
  )
}