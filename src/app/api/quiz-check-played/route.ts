// import { NextResponse } from 'next/server'
// import { getPayload } from 'payload'
// import configPromise from 'src/payload.config'

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url)
//     const userId = searchParams.get('userId')
//     const quizId = searchParams.get('quizId')

//     if (!userId || !quizId) {
//       return NextResponse.json({ hasPlayedToday: false })
//     }

//     const payload = await getPayload({ config: configPromise })

//     // இன்றைய நாளின் ஆரம்பம் (00:00:00)
//     const startOfToday = new Date()
//     startOfToday.setHours(0, 0, 0, 0)

//     const attemptsToday = await payload.find({
//       collection: 'quiz-attempts',
//       where: {
//         and: [
//           { user: { equals: userId } },
//           { quiz: { equals: quizId } },
//           { completedAt: { greater_than_equal: startOfToday.toISOString() } },
//         ],
//       },
//       sort: '-completedAt',
//       limit: 1,
//       overrideAccess: true,
//     })

//     if (attemptsToday.docs.length > 0) {
//       return NextResponse.json({
//         hasPlayedToday: true,
//         lastScore: attemptsToday.docs[0].score,
//       })
//     }

//     return NextResponse.json({ hasPlayedToday: false })
//   } catch (err) {
//     return NextResponse.json({ hasPlayedToday: false })
//   }
// }

import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from 'src/payload.config'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const quizId = searchParams.get('quizId')

    if (!userId || !quizId) {
      return NextResponse.json({ hasPlayedToday: false })
    }

    const payload = await getPayload({ config: configPromise })

    // இன்றைய நாளின் ஆரம்பம் (00:00:00)
    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)

    const attemptsToday = await payload.find({
      collection: 'quiz-attempts',
      where: {
        and: [
          { user: { equals: userId } },
          { quiz: { equals: quizId } },
          { completedAt: { greater_than_equal: startOfToday.toISOString() } },
        ],
      },
      sort: '-completedAt',
      limit: 1,
      overrideAccess: true,
    })

    // 💡 Optional Chaining (?.) மற்றும் Array Safe Check
    const docs = attemptsToday?.docs || []

    if (docs.length > 0) {
      return NextResponse.json({
        hasPlayedToday: true,
        lastScore: docs[0]?.score ?? 0,
      })
    }

    return NextResponse.json({ hasPlayedToday: false })
  } catch (err) {
    return NextResponse.json({ hasPlayedToday: false })
  }
}
