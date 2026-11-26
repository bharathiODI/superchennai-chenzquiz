import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getPlay } from '@/utilities/play'
import { getNow } from '@/utilities/clock'
import { readSiteFlags } from '@/utilities/siteFlags'
import { requestDevice, sessionPlayerId } from '@/utilities/playRequest'

export const dynamic = 'force-dynamic'
const noStore = { 'Cache-Control': 'no-store' }

// GET /api/quiz-round?quizId=1 -> the logged-in player's play for today: the current question
// (without its answer; its timer starts now), or why there is none.
export async function GET(req: Request) {
  try {
    const quizId = new URL(req.url).searchParams.get('quizId')
    if (!quizId) return NextResponse.json({ error: 'quizId is required' }, { status: 400 })

    // Maintenance mode: no new plays, but a play already on screen can be finished
    const flags = readSiteFlags()
    const maintenance = { state: 'maintenance', message: flags.message }

    const payload = await getPayload({ config: configPromise })
    const userId = await sessionPlayerId(payload)
    if (!userId) {
      if (flags.maintenance) return NextResponse.json(maintenance, { headers: noStore })
      return NextResponse.json(
        { state: 'login', error: 'Login required' },
        { status: 401, headers: noStore },
      )
    }

    const result = await getPlay(payload, quizId, userId, {
      now: await getNow(payload),
      ...(await requestDevice()),
      ...(flags.maintenance ? { noNewPlays: { message: flags.message } } : {}),
    })
    return NextResponse.json(result, { headers: noStore })
  } catch (error: any) {
    console.error('quiz-round error:', error?.message || error)
    return NextResponse.json(
      { error: 'Could not load your questions' },
      { status: 500, headers: noStore },
    )
  }
}
