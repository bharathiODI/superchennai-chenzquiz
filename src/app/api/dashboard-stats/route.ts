import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { headers } from 'next/headers'

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise })
    const headersList = await headers()
    const { user } = await payload.auth({ headers: headersList })

    if (!user || !('role' in user) || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Super Admin access required' }, { status: 403 })
    }

    // if (!user || user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Forbidden: Super Admin access required' }, { status: 403 })
    // }

    // 1. Fetch Total Counts
    const usersCount = await payload.count({ collection: 'users' })
    const quizzesCount = await payload.count({ collection: 'quizzes' })
    const attemptsCount = await payload.count({ collection: 'quiz-attempts' })

    // 2. Fetch Recent Users
    const recentUsers = await payload.find({
      collection: 'users',
      sort: '-createdAt',
      limit: 10,
    })

    // 3. Fetch All Quiz Attempts for Aggregation
    const allAttempts = await payload.find({
      collection: 'quiz-attempts',
      depth: 2,
      limit: 1000,
    })

    // 4. Calculate Top Play Winners (Leaderboard Aggregation)
    const userMap: Record<
      string,
      {
        id: string
        name: string
        email: string
        avatar?: string
        totalScore: number
        playedCount: number
        correctAnswers: number
      }
    > = {}

    allAttempts.docs.forEach((attempt: any) => {
      const uId = typeof attempt.user === 'object' ? attempt.user.id : attempt.user
      const uName = typeof attempt.user === 'object' ? attempt.user.name || 'Anonymous' : 'User'
      const uEmail = typeof attempt.user === 'object' ? attempt.user.email || '' : ''
      const uAvatar = typeof attempt.user === 'object' ? attempt.user.avatar : null

      if (!userMap[uId]) {
        userMap[uId] = {
          id: uId,
          name: uName,
          email: uEmail,
          avatar: uAvatar,
          totalScore: 0,
          playedCount: 0,
          correctAnswers: 0,
        }
      }

      userMap[uId].totalScore += attempt.score || 0
      userMap[uId].playedCount += 1
      userMap[uId].correctAnswers += attempt.correctAnswers || 0
    })

    // Sort Top Winners by Total XP/Score
    const topWinners = Object.values(userMap)
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 10)

    // 5. Recent Activity Attempts
    const recentAttempts = await payload.find({
      collection: 'quiz-attempts',
      depth: 2,
      sort: '-completedAt',
      limit: 10,
    })

    return NextResponse.json({
      summary: {
        totalUsers: usersCount.totalDocs,
        totalQuizzes: quizzesCount.totalDocs,
        totalAttempts: attemptsCount.totalDocs,
      },
      topWinners,
      recentUsers: recentUsers.docs,
      recentAttempts: recentAttempts.docs,
    })
  } catch (error: any) {
    console.error('Error fetching admin dashboard stats:', error)
    return NextResponse.json({ error: 'Server Error' }, { status: 500 })
  }
}
