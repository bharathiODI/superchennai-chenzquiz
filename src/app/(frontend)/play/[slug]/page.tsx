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

export default async function PlayPage({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise

  const payload = await getPayload({ config: configPromise })

  const quizQuery = await payload
    .find({
      collection: 'quizzes',
      where: {
        slug: { equals: slug },
      },
      depth: 3,
      limit: 1,
      overrideAccess: true,
    })
    .catch(() => null)

  const rawQuiz = quizQuery?.docs?.[0]

  if (!rawQuiz) {
    notFound()
  }

  let populatedQuestions = rawQuiz.questions || []

  const isShallow = populatedQuestions.some(
    (q: any) => typeof q === 'object' && !q.gameType && q.id,
  )

  if (isShallow) {
    const questionIds = populatedQuestions.map((q: any) => (typeof q === 'object' ? q.id : q))

    const fullQuestions = await payload.find({
      collection: 'questions',
      where: {
        id: { in: questionIds },
      },
      depth: 2,
      limit: 100,
      overrideAccess: true,
    })

    populatedQuestions = questionIds
      .map((id: number | string) => fullQuestions.docs.find((doc) => doc.id === id))
      .filter(Boolean)
  }

  const quiz = {
    ...rawQuiz,
    questions: populatedQuestions,
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 pt-16 pb-24">
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
