import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from 'src/payload.config'
import { getTodayStatus } from '@/utilities/quizRounds'

// GET /api/quiz-check-played?userId=4&quizId=1 -> has the player finished all of today's rounds?
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const quizId = searchParams.get('quizId')
    if (!userId || !quizId) return NextResponse.json({ hasPlayedToday: false })

    const payload = await getPayload({ config: configPromise })
    const status = await getTodayStatus(payload, quizId, userId)
    return NextResponse.json({
      hasPlayedToday: status.hasPlayedToday,
      roundsCompleted: status.roundsCompleted,
      totalRounds: status.totalRounds,
      lastScore: status.todayScore,
    })
  } catch {
    return NextResponse.json({ hasPlayedToday: false })
  }
}
