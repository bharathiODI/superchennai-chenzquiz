import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from 'src/payload.config'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const quizId = body.quizId
    const userId = body.userId
    const scoreEarned = Number(body.scoreEarned ?? body.score ?? 0)
    const rawLogs = body.answers || body.logs || []

    console.log('📝 [API SUBMIT] Processing submission for User ID:', userId)

    if (!quizId || !userId) {
      return NextResponse.json(
        { success: false, error: 'Both quizId and userId are required.' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config: configPromise })

    const formattedAnswers = rawLogs.map((log: any) => ({
      questionTitle: String(log.title || log.questionTitle || 'Question'),
      gameType: String(log.gameType || 'game'),
      userAnswer:
        typeof log.userAnswer === 'object'
          ? JSON.stringify(log.userAnswer)
          : String(log.userAnswer || '-'),
      isCorrect: Boolean(log.isCorrect),
      pointsEarned: Number(log.pointsEarned || 0),
    }))

    // 1. Save Game Submission Record
    const submission = await payload.create({
      collection: 'user-submissions',
      data: {
        user: userId,
        quiz: quizId,
        score: scoreEarned,
        answers: formattedAnswers,
      },
      overrideAccess: true,
    })

    // 2. Increment Total XP on User Profile
    const existingUser = await payload
      .findByID({
        collection: 'quiz-users',
        id: userId,
        overrideAccess: true,
      })
      .catch(() => null)

    if (existingUser) {
      await payload.update({
        collection: 'quiz-users',
        id: userId,
        data: {
          totalXP: (Number(existingUser.totalXP) || 0) + scoreEarned,
        },
        overrideAccess: true,
      })
    }

    return NextResponse.json({ success: true, submission })
  } catch (error: any) {
    console.error('❌ [API SUBMIT ERROR]:', error?.message || error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Internal Server Error' },
      { status: 500 },
    )
  }
}
