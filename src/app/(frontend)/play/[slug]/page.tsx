import type { Metadata } from 'next/types'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from 'src/payload.config'
import GameEngineClient from '../GameEngineClient'

export const revalidate = 0

type Args = {
  params: Promise<{
    slug: string
  }>
}

// Questions are not sent from here: each player's round is fetched by the game
// from /api/quiz-round, so players only ever receive their own questions.
export default async function PlayPage({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  const quizQuery = await payload
    .find({
      collection: 'quizzes',
      where: { slug: { equals: slug } },
      depth: 0,
      limit: 1,
      overrideAccess: true,
    })
    .catch(() => null)

  const rawQuiz: any = quizQuery?.docs?.[0]
  if (!rawQuiz) notFound()

  const quiz = {
    id: rawQuiz.id,
    quizTitle: rawQuiz.quizTitle,
    slug: rawQuiz.slug,
    quizDate: rawQuiz.quizDate,
    quizEndDate: rawQuiz.quizEndDate,
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 pt-16 pb-24 gamingpagebgss">
      <div className="container mx-auto px-4 max-w-3xl">
        <GameEngineClient quiz={quiz} />
      </div>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  const quizQuery = await payload
    .find({
      collection: 'quizzes',
      where: {
        slug: { equals: slug },
      },
      depth: 1,
      limit: 1,
      overrideAccess: true,
    })
    .catch(() => null)

  const quiz = quizQuery?.docs?.[0]

  return {
    title: quiz ? `Playing: ${quiz.quizTitle}` : 'Play Super Chennai Quiz',
  }
}
