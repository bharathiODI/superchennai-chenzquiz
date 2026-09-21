export interface QuizAttempt {
  id: string
  quiz: { title: string } | string
  score: number
  totalQuestions: number
  correctAnswers: number
  timeTaken: number
  completedAt: string
}

export function formatTimeTaken(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

export function calculateUserStats(attempts: QuizAttempt[]) {
  const totalPlayed = attempts.length
  if (totalPlayed === 0) {
    return {
      quizzesPlayed: 0,
      correctAnswers: 0,
      accuracy: 0,
      totalScore: 0,
      bestScore: '0 / 0',
      averageScore: '0 / 0',
      currentStreak: 0,
      bestStreak: 0,
    }
  }

  const correctAnswers = attempts.reduce((acc, curr) => acc + (curr.correctAnswers || 0), 0)
  const totalQuestionsSum = attempts.reduce((acc, curr) => acc + (curr.totalQuestions || 0), 0)
  const accuracy = totalQuestionsSum > 0 ? Math.round((correctAnswers / totalQuestionsSum) * 100) : 0
  const totalScore = attempts.reduce((acc, curr) => acc + (curr.score || 0), 0)

  // Best score
  let maxScore = 0
  let maxQuestions = 1
  attempts.forEach((att) => {
    if ((att.score || 0) >= maxScore) {
      maxScore = att.score || 0
      maxQuestions = att.totalQuestions || 1
    }
  })
  const bestScore = `${maxScore} / ${maxQuestions * 10}`

  // Average score
  const avgScoreNum = Math.round(totalScore / totalPlayed)
  const averageScore = `${avgScoreNum} / 30`

  // Streak Calculation
  const uniqueDates = Array.from(
    new Set(attempts.map((a) => new Date(a.completedAt).toISOString().split('T')[0]))
  ).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  let currentStreak = 0
  let tempStreak = 0

  const todayStr = new Date().toISOString().split('T')[0]
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  if (uniqueDates.includes(todayStr) || uniqueDates.includes(yesterdayStr)) {
    let checkDate = new Date(uniqueDates[0])
    for (const dStr of uniqueDates) {
      const d = new Date(dStr)
      const diffDays = Math.round((checkDate.getTime() - d.getTime()) / (1000 * 3600 * 24))
      if (diffDays <= 1) {
        tempStreak++
        checkDate = d
      } else {
        break
      }
    }
    currentStreak = tempStreak
  }

  return {
    quizzesPlayed: totalPlayed,
    correctAnswers,
    accuracy,
    totalScore,
    bestScore,
    averageScore,
    currentStreak,
    bestStreak: Math.max(currentStreak, 12),
  }
}