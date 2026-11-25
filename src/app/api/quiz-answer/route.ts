import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { answerQuestion } from '@/utilities/play'
import { getNow } from '@/utilities/clock'
import { requestDevice, sessionPlayerId } from '@/utilities/playRequest'

export const dynamic = 'force-dynamic'
const noStore = { 'Cache-Control': 'no-store' }

// POST /api/quiz-answer { roundId, position, answer } -> checked and timed on the server.
// answer: { optionId } (MCQ) | { value } (Dropdown) | { correct, detail } (other games) | { timeout: true }
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    if (!body?.roundId || body?.position === undefined) {
      return NextResponse.json({ ok: false, error: 'roundId and position are required' }, { status: 400, headers: noStore })
    }
    const payload = await getPayload({ config: configPromise })
    const userId = await sessionPlayerId(payload)
    if (!userId) return NextResponse.json({ ok: false, error: 'Login required' }, { status: 401, headers: noStore })

    const result = await answerQuestion(
      payload,
      { roundId: body.roundId, userId, position: Number(body.position), answer: body.answer || {} },
      { now: await getNow(payload), ...(await requestDevice()) },
    )
    if (!result.ok) return NextResponse.json(result, { status: result.status, headers: noStore })
    return NextResponse.json(result, { headers: noStore })
  } catch (error: any) {
    console.error('quiz-answer error:', error?.message || error)
    return NextResponse.json({ ok: false, error: 'Could not save your answer. Please try again.' }, { status: 500, headers: noStore })
  }
}
