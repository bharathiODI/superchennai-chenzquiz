import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from 'src/payload.config'
import { getTodayProgress } from '@/utilities/play'
import { getNow } from '@/utilities/clock'
import { sessionPlayerId } from '@/utilities/playRequest'

export const dynamic = 'force-dynamic'

// GET /api/quiz-check-played?quizId=1 -> has the logged-in player played today?
export async function GET(req: Request) {
  try {
    const quizId = new URL(req.url).searchParams.get('quizId')
    const payload = await getPayload({ config: configPromise })
    const userId = await sessionPlayerId(payload)
    if (!userId || !quizId) return NextResponse.json({ hasPlayedToday: false })
    const status = await getTodayProgress(payload, quizId, userId, await getNow(payload))
    return NextResponse.json({ hasPlayedToday: status.hasPlayedToday, lastScore: status.todayScore })
  } catch {
    return NextResponse.json({ hasPlayedToday: false })
  }
}
