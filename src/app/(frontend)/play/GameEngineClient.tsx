/* eslint-disable @next/next/no-img-element */
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

import confetti from 'canvas-confetti'

export default function GameEngineClient({ quiz }: { quiz: any }) {
  const router = useRouter()
  const questions = quiz?.questions || []
  const [currentIndex, setCurrentIndex] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [answersLog, setAnswersLog] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isLoadingAuth, setIsLoadingAuth] = useState(true)
  const [alreadyPlayedToday, setAlreadyPlayedToday] = useState(false)
  const [lastAttemptScore, setLastAttemptScore] = useState<number | null>(null)

  const [userAnswersState, setUserAnswersState] = useState<Record<number, any>>({})

  const [showSkipWarningModal, setShowSkipWarningModal] = useState(false)
  const [pendingFinalSubmit, setPendingFinalSubmit] = useState<{
    score: number
    logs: any[]
  } | null>(null)

  const currentQ = questions[currentIndex]
  const questionTimeLimit = Number(currentQ?.timeLimit ?? 60)
  const [timeLeft, setTimeLeft] = useState<number>(questionTimeLimit)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // ⏱️ கேம் ஆரம்பிக்கும் நேரத்தை சேமிக்க Ref
  const startTimeRef = useRef<number>(Date.now())

  // 1. Auth Protection Check & User Status Check
  useEffect(() => {
    const checkUserAndStatus = async () => {
      const storedUser = localStorage.getItem('user')
      const token = localStorage.getItem('token')

      if (!storedUser || !token) {
        router.push('/login')
        return
      }

      try {
        const parsedUser = JSON.parse(storedUser)
        setCurrentUser(parsedUser)

        if (quiz?.id && parsedUser?.id) {
          const res = await fetch(
            `/api/quiz-check-played?userId=${parsedUser.id}&quizId=${quiz.id}`,
          )
          const data = await res.json()

          if (data?.hasPlayedToday) {
            setAlreadyPlayedToday(true)
            setLastAttemptScore(data?.lastScore ?? 0)
          }
        }
      } catch (e) {
        console.error('Error verifying daily status:', e)
      } finally {
        setIsLoadingAuth(false)
      }
    }

    checkUserAndStatus()
  }, [router, quiz?.id])

  // 2. Active Countdown Timer Logic
  useEffect(() => {
    if (isCompleted || !currentQ || showSkipWarningModal) return

    setTimeLeft(questionTimeLimit)

    if (timerRef.current) clearInterval(timerRef.current)

    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
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
  }, [currentIndex, isCompleted, questionTimeLimit, showSkipWarningModal])

  const celebrate = () => {
    // Center burst
    confetti({
      particleCount: 100,
      spread: 80,
      startVelocity: 45,
      origin: { x: 0.5, y: 0.65 },
    })

    // Left burst
    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 70,
        startVelocity: 50,
        origin: { x: 0, y: 0.65 },
      })
    }, 200)

    // Right burst
    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 70,
        startVelocity: 50,
        origin: { x: 1, y: 0.65 },
      })
    }, 400)

    // More falling confetti
    setTimeout(() => {
      confetti({
        particleCount: 120,
        spread: 120,
        startVelocity: 30,
        gravity: 0.8,
        scalar: 1.1,
        origin: { x: 0.5, y: 0.3 },
      })
    }, 700)
  }

  useEffect(() => {
    if (isCompleted) {
      // confetti({
      //   particleCount: 150,
      //   spread: 100,
      //   origin: { y: 0.6 },
      // })

      celebrate()
    }

    if (alreadyPlayedToday) {
      // confetti({
      //   particleCount: 150,
      //   spread: 100,
      //   origin: { y: 0.6 },
      // })

      celebrate()
    }
  }, [isCompleted, alreadyPlayedToday])

  // Helper to trigger completion or warning
  const processNextOrFinish = (newScore: number, updatedLog: any[]) => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      // Check if any question was skipped
      const hasSkipped = updatedLog.some((log) => log.userAnswer === 'Skipped')

      if (hasSkipped) {
        setPendingFinalSubmit({ score: newScore, logs: updatedLog })
        setShowSkipWarningModal(true)
      } else {
        completeAndSubmitQuiz(newScore, updatedLog)
      }
    }
  }

  // 🎯 Game Completion Logic
  // const handleGameCompletion = (result: {
  //   isCorrect: boolean
  //   pointsEarned?: number
  //   answerDetail?: any
  // }) => {
  //   if (timerRef.current) clearInterval(timerRef.current)

  //   const defaultPoints = Number(currentQ?.points ?? 10)
  //   const negativePoints = Number(currentQ?.negativePoints ?? 0)

  //   let pointsToAdd = 0
  //   if (result.isCorrect) {
  //     pointsToAdd = result.pointsEarned ?? defaultPoints
  //     if (currentQ?.enableDoubleUp) {
  //       pointsToAdd *= 2
  //     }
  //   } else {
  //     pointsToAdd =
  //       result.pointsEarned !== undefined ? result.pointsEarned : -Math.abs(negativePoints)
  //   }

  //   const newScore = totalScore + pointsToAdd
  //   const currentLog = {
  //     questionId: currentQ?.id,
  //     title: currentQ?.questionTitle || currentQ?.title,
  //     gameType: currentQ?.gameType,
  //     isCorrect: result.isCorrect,
  //     pointsEarned: pointsToAdd,
  //     userAnswer: result.answerDetail || null,
  //   }

  //   const updatedLog = [...answersLog, currentLog]

  //   setTotalScore(newScore)
  //   setAnswersLog(updatedLog)

  //   processNextOrFinish(newScore, updatedLog)
  // }

  // 🎯 Game Completion Logic
  const handleGameCompletion = (result: {
    isCorrect: boolean
    pointsEarned?: number
    answerDetail?: any
  }) => {
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
      pointsToAdd =
        result.pointsEarned !== undefined ? result.pointsEarned : -Math.abs(negativePoints)
    }

    // 💡 ADD THIS: Current index-kku user select panna answer-a save panrom
    setUserAnswersState((prev) => ({
      ...prev,
      [currentIndex]: result.answerDetail || null,
    }))

    const newScore = totalScore + pointsToAdd
    const currentLog = {
      questionId: currentQ?.id,
      title: currentQ?.questionTitle || currentQ?.title,
      gameType: currentQ?.gameType,
      isCorrect: result.isCorrect,
      pointsEarned: pointsToAdd,
      userAnswer: result.answerDetail || null,
    }

    // 💡 UPDATE THIS: Array length increase aagama current index log-a replace/update panrom
    const updatedLog = [...answersLog]
    updatedLog[currentIndex] = currentLog

    setTotalScore(newScore)
    setAnswersLog(updatedLog)

    processNextOrFinish(newScore, updatedLog)
  }

  // ⏭️ Skip Question Logic
  // const handleSkip = () => {
  //   if (timerRef.current) clearInterval(timerRef.current)

  //   const currentLog = {
  //     questionId: currentQ?.id,
  //     title: currentQ?.questionTitle || currentQ?.title,
  //     gameType: currentQ?.gameType,
  //     isCorrect: false,
  //     pointsEarned: 0,
  //     userAnswer: 'Skipped',
  //   }

  //   const updatedLog = [...answersLog, currentLog]
  //   setAnswersLog(updatedLog)

  //   processNextOrFinish(totalScore, updatedLog)
  // }

  // ⏭️ Skip Question Logic
  const handleSkip = () => {
    if (timerRef.current) clearInterval(timerRef.current)

    const currentLog = {
      questionId: currentQ?.id,
      title: currentQ?.questionTitle || currentQ?.title,
      gameType: currentQ?.gameType,
      isCorrect: false,
      pointsEarned: 0,
      userAnswer: 'Skipped',
    }

    const updatedLog = [...answersLog]
    updatedLog[currentIndex] = currentLog

    setAnswersLog(updatedLog)

    processNextOrFinish(totalScore, updatedLog)
  }

  const handleBackToSkippedQuestion = () => {
    setShowSkipWarningModal(false)
    const firstSkippedIndex = answersLog.findIndex((log) => log?.userAnswer === 'Skipped')
    if (firstSkippedIndex !== -1) {
      setCurrentIndex(firstSkippedIndex)
    } else if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      if (timerRef.current) clearInterval(timerRef.current)

      const prevLog = answersLog[currentIndex - 1]
      if (prevLog && prevLog.userAnswer !== 'Skipped') {
        setTotalScore((prevScore) => Math.max(0, prevScore - (prevLog.pointsEarned || 0)))
      }

      setCurrentIndex((prev) => prev - 1)
    }
  }

  // Final Submit Handler
  const completeAndSubmitQuiz = (finalScore: number, logs: any[]) => {
    setIsCompleted(true)
    setShowSkipWarningModal(false)
    const timeSpentInSeconds = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000))
    submitFinalScore(finalScore, logs, timeSpentInSeconds)
  }

  const submitFinalScore = async (finalScore: number, logs: any[], timeSpentSeconds: number) => {
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
          timeTaken: timeSpentSeconds,
        }),
      })

      const data = await res.json()

      if (!res.ok && data.alreadyPlayed) {
        setAlreadyPlayedToday(true)
      } else {
        console.log('✅ Quiz Submitted Successfully:', data)
      }
    } catch (err) {
      console.error('❌ Error submitting score:', err)
    }
  }

  // Loading View
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

  // Already Played View
  if (alreadyPlayedToday) {
    return (
      <div className="relative overflow-hidden bg-white/95 backdrop-blur-xl border border-amber-200/80 rounded-3xl p-8 sm:p-10 text-center shadow-xl shadow-amber-500/5 max-w-lg mx-auto my-6">
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative mx-auto w-20 h-20 mb-6 flex items-center justify-center bg-amber-100 rounded-full text-4xl shadow-inner border border-amber-200">
          ⏳
        </div>

        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#03045e] via-[#7000ff] to-[#ff007a] mb-2">
          Already Played Today!
        </h2>

        <p className="text-slate-600 text-sm leading-relaxed mb-6">
          You can attempt this challenge again tomorrow.
        </p>

        {lastAttemptScore !== null && (
          <div className="bg-amber-50/80 border border-amber-200/60 rounded-2xl p-4 max-w-xs mx-auto mb-8">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-0.5">
              Today&apos;s Score
            </span>
            <span className="text-3xl font-black text-amber-900">+{lastAttemptScore} XP</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/leaderboard"
            className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-purple-500/20 transition-all duration-200"
          >
            Check Leaderboard
          </Link>
          <Link
            href="/quizzes"
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-bold text-sm rounded-2xl transition-all duration-200"
          >
            Explore Other Quizzes
          </Link>
        </div>
      </div>
    )
  }

  // Completed View
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

  // No Question Available Screen
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
  const difficulty = currentQ?.difficulty || 'Medium'
  const questionTitle = currentQ?.questionTitle || currentQ?.title || 'Challenge'
  const heroImage = currentQ?.heroImage
  const contentText = currentQ?.content
  const initialAnswer = userAnswersState[currentIndex] || null
  const gameData = {
    ...currentQ,
    points: points,
    initialAnswer,
    mcqGroup: currentQ?.mcqGroup,
    dropdownGroup: currentQ?.dropdownGroup,
    wordleGroup: currentQ?.wordleGroup,
    wordFinderGroup: currentQ?.wordFinderGroup,
    matchGroup: currentQ?.matchGroup,
    spotLieGroup: currentQ?.spotLieGroup,
    reorderGroup: currentQ?.reorderGroup,
    dragDropGroup: currentQ?.dragDropGroup,
  }

  const timerPercentage = (timeLeft / questionTimeLimit) * 100
  const isTimeLow = timeLeft <= 10

  return (
    <div className="relative bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs">
      {/* ⚠️ SKIPPED QUESTION WARNING MODAL */}
      {showSkipWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center relative overflow-hidden">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
              ⚠️
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 mb-2">
              Skipped Questions Pending!
            </h3>

            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Oops! You Skipped Some Questions 😅 You’ve got a few unanswered questions. Wanna go
              back and finish them before submitting?
            </p>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={handleBackToSkippedQuestion}
                className="w-full py-3 px-5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-sm rounded-xl transition shadow-md shadow-indigo-500/20"
              >
                ⬅️ Back to Quiz & Answer
              </button>

              <button
                onClick={() => {
                  if (pendingFinalSubmit) {
                    completeAndSubmitQuiz(pendingFinalSubmit.score, pendingFinalSubmit.logs)
                  }
                }}
                className="w-full py-3 px-5 bg-slate-100 hover:bg-slate-200/80 active:scale-95 text-slate-700 font-bold text-sm rounded-xl transition"
              >
                Submit Anyway ⏩
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Timer Progress Bar */}
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
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-bold text-[18px] rounded-full uppercase">
            Game {currentIndex + 1} of {questions.length}
          </span>
          <span
            className={`px-3 py-1 font-bold text-[18px] rounded-full transition-colors flex items-center gap-1 ${
              isTimeLow ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-slate-100 text-slate-700'
            }`}
          >
            ⏱️ 00 : {timeLeft}s
          </span>
          <span className="px-3 py-1 bg-slate-100 text-slate-600 font-semibold text-xs rounded-full uppercase">
            {gameType ? gameType.replace('_', ' ') : 'Loading...'}
          </span>
          <span className="px-2.5 py-1 bg-slate-100 text-slate-500 font-medium text-xs rounded-full">
            🎯 {difficulty}
          </span>
        </div>
        <span className="font-extrabold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full text-xs">
          +{points} XP {currentQ?.enableDoubleUp ? '(2x ⚡)' : ''}
        </span>
      </div>

      {/* Hero Image */}
      {heroImage && (
        <div className="mb-6 overflow-hidden rounded-2xl border border-slate-100 max-h-72">
          <img
            src={heroImage}
            alt={questionTitle}
            className="w-full h-full object-cover quizzzimagesectionnn "
          />
        </div>
      )}

      {/* Title & Description with Gradient Styling */}
      <h2 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#03045e] via-[#7000ff] to-[#ff007a] mb-2">
        {questionTitle}
      </h2>
      {contentText && (
        <p className="text-slate-600 text-sm leading-relaxed mb-6 whitespace-pre-line">
          {contentText}
        </p>
      )}

      {/* Active Sub Game Component Container */}
      <div className="min-h-[250px] mt-4">
        {/* {gameType === 'mcq' && (
          <MCQGame
            key={currentQ?.id || currentIndex}
            data={gameData}
            onComplete={handleGameCompletion}
          />
        )}
        {gameType === 'wordle' && (
          <WordleGame
            key={currentQ?.id || currentIndex}
            data={gameData}
            onComplete={handleGameCompletion}
          />
        )}
        {gameType === 'word_finder' && (
          <WordFinderGame
            key={currentQ?.id || currentIndex}
            data={gameData}
            onComplete={handleGameCompletion}
          />
        )}
        {gameType === 'dropdown' && (
          <DropdownGame
            key={currentQ?.id || currentIndex}
            data={gameData}
            onComplete={handleGameCompletion}
          />
        )}
        {gameType === 'match_following' && (
          <MatchGame
            key={currentQ?.id || currentIndex}
            data={gameData}
            onComplete={handleGameCompletion}
          />
        )}
        {gameType === 'spot_lie' && (
          <SpotLieGame
            key={currentQ?.id || currentIndex}
            data={gameData}
            onSelect={handleGameCompletion}
          />
        )}
        {gameType === 'reorder' && (
          <ReorderGame
            key={currentQ?.id || currentIndex}
            data={gameData}
            onComplete={handleGameCompletion}
          />
        )}
        {gameType === 'drag_drop' && (
          <DragDropGame
            key={currentQ?.id || currentIndex}
            data={gameData}
            onComplete={handleGameCompletion}
          />
        )} */}

        <div className="min-h-[250px] mt-4">
          {gameType === 'mcq' && (
            <MCQGame key={currentQ?.id} data={gameData} onComplete={handleGameCompletion} />
          )}
          {gameType === 'wordle' && (
            <WordleGame key={currentQ?.id} data={gameData} onComplete={handleGameCompletion} />
          )}
          {gameType === 'word_finder' && (
            <WordFinderGame key={currentQ?.id} data={gameData} onComplete={handleGameCompletion} />
          )}
          {gameType === 'dropdown' && (
            <DropdownGame key={currentQ?.id} data={gameData} onComplete={handleGameCompletion} />
          )}
          {gameType === 'match_following' && (
            <MatchGame key={currentQ?.id} data={gameData} onComplete={handleGameCompletion} />
          )}
          {gameType === 'spot_lie' && (
            <SpotLieGame key={currentQ?.id} data={gameData} onSelect={handleGameCompletion} />
          )}
          {gameType === 'reorder' && (
            <ReorderGame key={currentQ?.id} data={gameData} onComplete={handleGameCompletion} />
          )}
          {gameType === 'drag_drop' && (
            <DragDropGame key={currentQ?.id} data={gameData} onComplete={handleGameCompletion} />
          )}
        </div>
      </div>
      {/* Navigation Controls: Previous & Skip Buttons */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className={`px-5 py-2.5 text-sm font-bold rounded-xl transition flex items-center gap-1 ${
            currentIndex === 0
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-60'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95'
          }`}
        >
          <span>⬅️ Previous</span>
        </button>

        <button
          onClick={handleSkip}
          className="px-5 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold text-sm rounded-xl transition active:scale-95 flex items-center gap-1"
        >
          <span>Skip ⏩</span>
        </button>
      </div>

      {/* Explanation / Hint Footer */}
      {currentQ?.explanation && (
        <div className="mt-6 pt-4 border-t border-slate-100 bg-indigo-50/50 p-4 rounded-2xl text-xs text-indigo-900">
          <span className="font-bold block mb-1">💡 Hint / Explanation:</span>
          {currentQ.explanation}
        </div>
      )}
    </div>
  )
}
