import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from 'src/payload.config'
import { getQuizTitles } from '@/utilities/getQuizTitles'
import { getTitleForXP } from '@/utilities/quizTitles'
import { getTodayStatus, relId, roundScoreBounds, toId } from '@/utilities/quizRounds'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const quizId = body.quizId ? toId(body.quizId) : null
    const userId = body.userId ? toId(body.userId) : null
    const roundId = body.roundId ? toId(body.roundId) : null
    let scoreEarned = Math.round(Number(body.scoreEarned ?? body.score ?? 0)) || 0
    const rawLogs = body.answers || body.logs || []
    const timeTaken = Math.max(0, Number(body.timeTaken || 0))

    if (!quizId || !userId) {
      return NextResponse.json(
        { success: false, error: 'Both quizId and userId are required.' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config: configPromise })
    let roundNo: number | null = null

    if (roundId) {
      // Daily rounds: the round must belong to this player and quiz, and not be submitted yet.
      const round: any = await payload
        .findByID({ collection: 'quiz-rounds' as any, id: roundId, depth: 0, overrideAccess: true })
        .catch(() => null)

      if (!round || String(relId(round.user)) !== String(userId) || String(relId(round.quiz)) !== String(quizId)) {
        return NextResponse.json({ success: false, error: 'Invalid round.' }, { status: 400 })
      }

      // Reject impossible scores (tampered requests)
      const { min, max } = await roundScoreBounds(payload, round)
      scoreEarned = Math.min(max, Math.max(min, scoreEarned))

      // Claim the round atomically so a double submit can't add XP twice
      const claimed = await payload.update({
        collection: 'quiz-rounds' as any,
        where: { and: [{ id: { equals: roundId } }, { status: { not_equals: 'completed' } }] },
        data: { status: 'completed', score: scoreEarned, completedAt: new Date().toISOString() } as any,
        overrideAccess: true,
      })
      if (!claimed.docs?.length) {
        return NextResponse.json(
          { success: false, alreadyPlayed: true, error: 'You have already completed this round.' },
          { status: 400 },
        )
      }
      roundNo = Number(round.round) || null
    } else {
      // Legacy flow (no rounds): one attempt per quiz per day
      const startOfToday = new Date()
      startOfToday.setHours(0, 0, 0, 0)
      const existingAttemptsToday = await payload.find({
        collection: 'quiz-attempts',
        where: {
          and: [
            { user: { equals: userId } },
            { quiz: { equals: quizId } },
            { completedAt: { greater_than_equal: startOfToday.toISOString() } },
          ],
        },
        limit: 1,
        overrideAccess: true,
      })
      if (existingAttemptsToday.docs.length > 0) {
        return NextResponse.json(
          {
            success: false,
            alreadyPlayed: true,
            error: 'You have already played this quiz today. Try again tomorrow!',
          },
          { status: 400 },
        )
      }
    }

    const totalQuestions = rawLogs.length
    const correctAnswers = rawLogs.filter((log: any) => Boolean(log.isCorrect)).length

    const attempt = await payload.create({
      collection: 'quiz-attempts',
      data: {
        user: userId,
        quiz: quizId,
        score: scoreEarned,
        totalQuestions,
        correctAnswers,
        timeTaken,
        completedAt: new Date().toISOString(),
        ...(roundNo ? { round: roundNo } : {}),
      } as any,
      overrideAccess: true,
    })

    const existingUser = await payload
      .findByID({ collection: 'quiz-users', id: userId, overrideAccess: true })
      .catch(() => null)

    let totalXP = scoreEarned
    if (existingUser) {
      totalXP = (Number(existingUser.totalXP) || 0) + scoreEarned
      await payload.update({
        collection: 'quiz-users',
        id: userId,
        data: {
          totalXP,
          totalTimeTaken: (Number((existingUser as any).totalTimeTaken) || 0) + timeTaken,
        },
        overrideAccess: true,
      })
    }

    // Player title (tier) based on the updated total XP
    const titleInfo = getTitleForXP(totalXP, await getQuizTitles(payload))
    const today = roundId ? await getTodayStatus(payload, quizId, userId) : null

    return NextResponse.json({
      success: true,
      attempt,
      scoreEarned,
      totalXP,
      rounds: today
        ? { completed: today.roundsCompleted, total: today.totalRounds, todayScore: today.todayScore }
        : null,
      title: {
        name: titleInfo.title.name,
        tierIndex: titleInfo.tierIndex,
        tierCount: titleInfo.tierCount,
        nextName: titleInfo.next?.name ?? null,
        xpToNext: titleInfo.xpToNext,
      },
    })
  } catch (error: any) {
    console.error('❌ [API SUBMIT ERROR]:', error?.message || error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Internal Server Error' },
      { status: 500 },
    )
  }
}
