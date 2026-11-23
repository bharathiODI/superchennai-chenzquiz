import { computeStreaks } from '@/utilities/quizStreak'
import { DEFAULT_GAME_DAY, gameDayKey, type GameDaySettings } from '@/utilities/gameDay'

export interface QuizAttempt {
  id: number | string
  quiz?: { title?: string; quizTitle?: string } | number | string | null
  score: number
  totalQuestions: number
  correctAnswers: number
  timeTaken: number
  completedAt: string
}

export function formatTimeTaken(seconds: number): string {
  const total = Math.max(0, Math.round(Number(seconds) || 0))
  const mins = Math.floor(total / 60)
  const secs = total % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

/** Profile numbers. Total score is the player's saved XP when given, else the sum of attempts. */
export function calculateUserStats(
  attempts: QuizAttempt[],
  userTotalXP?: number,
  gameDay: GameDaySettings = DEFAULT_GAME_DAY,
) {
  const totalPlayed = attempts.length
  if (totalPlayed === 0) {
    return {
      quizzesPlayed: 0,
      correctAnswers: 0,
      accuracy: 0,
      totalScore: userTotalXP ?? 0,
      bestScore: '0 XP',
      averageScore: '0 XP',
      currentStreak: 0,
      bestStreak: 0,
    }
  }

  const correctAnswers = attempts.reduce((acc, curr) => acc + Number(curr.correctAnswers || 0), 0)
  const totalQuestionsSum = attempts.reduce((acc, curr) => acc + Number(curr.totalQuestions || 0), 0)
  const accuracy = totalQuestionsSum > 0 ? Math.round((correctAnswers / totalQuestionsSum) * 100) : 0

  const attemptsScoreSum = attempts.reduce((acc, curr) => acc + Number(curr.score || 0), 0)
  const totalScore = userTotalXP !== undefined ? userTotalXP : attemptsScoreSum

  // Best and average XP of a single quiz attempt
  const bestScore = `${Math.max(...attempts.map((a) => Number(a.score || 0)))} XP`
  const averageScore = `${Math.round(attemptsScoreSum / totalPlayed)} XP`

  // Streaks: consecutive game days (they start at the Quiz Settings hour, 8 AM by default)
  const { current: currentStreak, best: bestStreak } = computeStreaks(
    attempts.map((a) => a.completedAt).filter(Boolean),
    new Date(),
    (d) => gameDayKey(d, gameDay),
  )

  return {
    quizzesPlayed: totalPlayed,
    correctAnswers,
    accuracy,
    totalScore,
    bestScore,
    averageScore,
    currentStreak,
    bestStreak,
  }
}
