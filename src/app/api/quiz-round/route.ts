import { NextResponse } from 'next/server'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getTodayRound } from '@/utilities/quizRounds'
import { readSiteFlags } from '@/utilities/siteFlags'

export const dynamic = 'force-dynamic'

// GET /api/quiz-round?quizId=1&userId=4 -> the player's round for today (created on first call).
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const quizId = searchParams.get('quizId')
    let userId: string | number | null = searchParams.get('userId')
    if (!quizId) return NextResponse.json({ error: 'quizId is required' }, { status: 400 })

    // Maintenance mode: no new rounds (a round already on screen can still be submitted)
    const flags = readSiteFlags()
    if (flags.maintenance) {
      return NextResponse.json({ state: 'maintenance', message: flags.message }, { headers: { 'Cache-Control': 'no-store' } })
    }

    const payload = await getPayload({ config: configPromise })

    // Prefer the logged-in player from the session cookie when there is one.
    const { user } = await payload.auth({ headers: await getHeaders() })
    if (user && (user as any).collection === 'quiz-users') userId = user.id
    if (!userId) return NextResponse.json({ error: 'Login required' }, { status: 401 })

    const result = await getTodayRound(payload, quizId, userId)
    return NextResponse.json(result, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error: any) {
    console.error('quiz-round error:', error?.message || error)
    return NextResponse.json({ error: 'Could not load your round' }, { status: 500 })
  }
}
