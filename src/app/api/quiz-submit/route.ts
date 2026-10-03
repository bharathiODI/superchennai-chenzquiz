// import { NextResponse } from 'next/server'
// import { getPayload } from 'payload'
// import configPromise from 'src/payload.config'

// export async function POST(req: Request) {
//   try {
//     const body = await req.json()

//     const quizId = body.quizId
//     const userId = body.userId
//     const scoreEarned = Number(body.scoreEarned ?? body.score ?? 0)
//     const rawLogs = body.answers || body.logs || []

//     // Time taken in seconds (default 0 if not passed from client)
//     const timeTaken = Number(body.timeTaken || 0)

//     console.log('📝 [API SUBMIT] Processing submission for User ID:', userId)

//     if (!quizId || !userId) {
//       return NextResponse.json(
//         { success: false, error: 'Both quizId and userId are required.' },
//         { status: 400 },
//       )
//     }

//     const payload = await getPayload({ config: configPromise })

//     const totalQuestions = rawLogs.length
//     const correctAnswers = rawLogs.filter((log: any) => Boolean(log.isCorrect)).length

//     // 1. Save directly into 'quiz-attempts' Collection
//     const attempt = await payload.create({
//       collection: 'quiz-attempts',
//       data: {
//         user: userId,
//         quiz: quizId,
//         score: scoreEarned,
//         totalQuestions: totalQuestions,
//         correctAnswers: correctAnswers,
//         timeTaken: timeTaken,
//         completedAt: new Date().toISOString(),
//       },
//       overrideAccess: true,
//     })

//     // 2. Increment Total XP on User Profile
//     const existingUser = await payload
//       .findByID({
//         collection: 'quiz-users',
//         id: userId,
//         overrideAccess: true,
//       })
//       .catch(() => null)

//     if (existingUser) {
//       await payload.update({
//         collection: 'quiz-users',
//         id: userId,
//         data: {
//           totalXP: (Number(existingUser.totalXP) || 0) + scoreEarned,
//           totalTimeTaken: (Number((existingUser as any).totalTimeTaken) || 0) + timeTaken,
//         },
//         overrideAccess: true,
//       })
//     }

//     return NextResponse.json({ success: true, attempt })
//   } catch (error: any) {
//     console.error('❌ [API SUBMIT ERROR]:', error?.message || error)
//     return NextResponse.json(
//       { success: false, error: error?.message || 'Internal Server Error' },
//       { status: 500 },
//     )
//   }
// }


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
    const timeTaken = Number(body.timeTaken || 0)

    if (!quizId || !userId) {
      return NextResponse.json(
        { success: false, error: 'Both quizId and userId are required.' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config: configPromise })

    // 🛑 1. CHECK IF USER ALREADY PLAYED TODAY
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

    const totalQuestions = rawLogs.length
    const correctAnswers = rawLogs.filter((log: any) => Boolean(log.isCorrect)).length

    // 2. Save into 'quiz-attempts' Collection
    const attempt = await payload.create({
      collection: 'quiz-attempts',
      data: {
        user: userId,
        quiz: quizId,
        score: scoreEarned,
        totalQuestions: totalQuestions,
        correctAnswers: correctAnswers,
        timeTaken: timeTaken,
        completedAt: new Date().toISOString(),
      },
      overrideAccess: true,
    })

    // 3. Increment Total XP on User Profile
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
          totalTimeTaken: (Number((existingUser as any).totalTimeTaken) || 0) + timeTaken,
        },
        overrideAccess: true,
      })
    }

    return NextResponse.json({ success: true, attempt })
  } catch (error: any) {
    console.error('❌ [API SUBMIT ERROR]:', error?.message || error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Internal Server Error' },
      { status: 500 },
    )
  }
}
