import { NextResponse } from 'next/server'
import { getPayload, type Where } from 'payload'
import configPromise from '@payload-config'
import { TEST_PLAYER_PHONES, realPlayersWhere } from '@/utilities/testPlayers'

const DASHBOARD_ROLES = ['admin', 'client']
// The winners board filters by today / this month / this year / a chosen date
const WINNER_WINDOW_DAYS = 366

export async function GET(req: Request) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers: req.headers })

    const role = user && 'role' in user ? String(user.role) : ''
    if (!DASHBOARD_ROLES.includes(role)) {
      return NextResponse.json({ error: 'Forbidden: admin access required' }, { status: 403 })
    }

    // Everything below counts real players only; test players are left out
    const testPlayers = await payload.find({
      collection: 'quiz-users',
      where: { phone: { in: TEST_PLAYER_PHONES } },
      depth: 0,
      pagination: false,
      overrideAccess: true,
    })
    const testIds = testPlayers.docs.map((p) => p.id)
    const realAttemptsWhere: Where = testIds.length ? { user: { not_in: testIds } } : {}

    const players = await payload.find({
      collection: 'quiz-users',
      where: realPlayersWhere,
      sort: '-createdAt',
      depth: 0,
      pagination: false,
      overrideAccess: true,
    })
    const playerById = new Map(players.docs.map((p) => [String(p.id), p]))

    const [quizzesCount, attemptsCount] = await Promise.all([
      payload.count({ collection: 'quizzes', where: { status: { equals: 'active' } } }),
      payload.count({ collection: 'quiz-attempts', where: realAttemptsWhere }),
    ])

    // Attempts for the winners board, with just the fields it needs
    const since = new Date(Date.now() - WINNER_WINDOW_DAYS * 24 * 60 * 60 * 1000).toISOString()
    const windowAttempts = await payload.find({
      collection: 'quiz-attempts',
      where: { createdAt: { greater_than_equal: since } },
      sort: '-createdAt',
      depth: 0,
      pagination: false,
      overrideAccess: true,
    })

    const winnerAttempts = windowAttempts.docs.flatMap((attempt) => {
      const userId = typeof attempt.user === 'object' ? attempt.user?.id : attempt.user
      const player = userId != null ? playerById.get(String(userId)) : undefined
      if (!player) return []
      return [
        {
          id: attempt.id,
          score: attempt.score || 0,
          correctAnswers: attempt.correctAnswers || 0,
          completedAt: attempt.completedAt || attempt.createdAt,
          user: { id: player.id, name: player.name, email: player.email, phone: player.phone },
        },
      ]
    })

    const totals = new Map<
      string,
      { id: string; name: string; email: string; totalScore: number; playedCount: number; correctAnswers: number }
    >()
    for (const attempt of winnerAttempts) {
      const key = String(attempt.user.id)
      const entry = totals.get(key) ?? {
        id: key,
        name: attempt.user.name || 'Anonymous',
        email: attempt.user.email || '',
        totalScore: 0,
        playedCount: 0,
        correctAnswers: 0,
      }
      entry.totalScore += attempt.score
      entry.playedCount += 1
      entry.correctAnswers += attempt.correctAnswers
      totals.set(key, entry)
    }
    const topWinners = [...totals.values()].sort((a, b) => b.totalScore - a.totalScore).slice(0, 10)

    // Latest activity for the members table
    const recentAttempts = await payload.find({
      collection: 'quiz-attempts',
      where: realAttemptsWhere,
      sort: '-createdAt',
      limit: 50,
      depth: 1,
      overrideAccess: true,
    })

    return NextResponse.json({
      summary: {
        totalUsers: players.docs.length,
        totalQuizzes: quizzesCount.totalDocs,
        totalAttempts: attemptsCount.totalDocs,
      },
      topWinners,
      recentUsers: players.docs.slice(0, 10),
      recentAttempts: recentAttempts.docs,
      winnerAttempts,
    })
  } catch (error: any) {
    console.error('Error fetching admin dashboard stats:', error)
    return NextResponse.json({ error: 'Server Error' }, { status: 500 })
  }
}
