// import type { Metadata } from 'next/types'
// import { notFound } from 'next/navigation'
// import { getPayload } from 'payload'
// import configPromise from 'src/payload.config'
// import GameEngineClient from '../GameEngineClient'
// import { Question } from '@/payload-types'

// export const revalidate = 0

// type Args = {
//   params: Promise<{
//     slug: string
//   }>
// }

// export default async function PlayPage({ params: paramsPromise }: Args) {
//   const { slug } = await paramsPromise

//   const payload = await getPayload({ config: configPromise })

//   const quizQuery = await payload
//     .find({
//       collection: 'quizzes',
//       where: {
//         slug: { equals: slug },
//       },
//       depth: 3,
//       limit: 1,
//       overrideAccess: true,
//     })
//     .catch(() => null)

//   const rawQuiz = quizQuery?.docs?.[0]

//   if (!rawQuiz) {
//     notFound()
//   }

//   let populatedQuestions = rawQuiz.questions || []

//   const isShallow = populatedQuestions.some(
//     (q: any) => typeof q === 'object' && !q.gameType && q.id,
//   )

//   if (isShallow) {
//     const questionIds = populatedQuestions.map((q: any) => (typeof q === 'object' ? q.id : q))

//     const fullQuestions = await payload.find({
//       collection: 'questions',
//       where: {
//         id: { in: questionIds },
//       },
//       depth: 2,
//       limit: 100,
//       overrideAccess: true,
//     })

//     populatedQuestions = questionIds
//       .map((id: number | string) => fullQuestions.docs.find((doc) => doc.id === id))
//       .filter((question): question is Question => Boolean(question))
//   }

//   const quiz = {
//     ...rawQuiz,
//     questions: populatedQuestions,
//   }

//   return (
//     <div className="min-h-screen bg-slate-100 text-slate-800 pt-16 pb-24">
//       <div className="container mx-auto px-4 max-w-3xl">
//         <GameEngineClient quiz={quiz} />
//       </div>
//     </div>
//   )
// }

// export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
//   const { slug } = await paramsPromise
//   const payload = await getPayload({ config: configPromise })

//   const quizQuery = await payload
//     .find({
//       collection: 'quizzes',
//       where: {
//         slug: { equals: slug },
//       },
//       depth: 1,
//       limit: 1,
//       overrideAccess: true,
//     })
//     .catch(() => null)

//   const quiz = quizQuery?.docs?.[0]

//   return {
//     title: quiz ? `Playing: ${quiz.quizTitle}` : 'Play Super Chennai Quiz',
//   }
// }
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

// Helper to extract clean text from Lexical RichText Object
function extractRichText(content: any): string {
  if (!content) return ''
  if (typeof content === 'string') return content
  try {
    const root = content.root || content
    if (!root || !root.children) return ''
    return root.children
      .map((paragraph: any) =>
        paragraph.children ? paragraph.children.map((c: any) => c.text || '').join('') : '',
      )
      .filter(Boolean)
      .join('\n')
  } catch (e) {
    return ''
  }
}

// Helper to sanitize media object or URL string
function resolveImageUrl(imageField: any): string | null {
  if (!imageField) return null
  if (typeof imageField === 'string') return imageField
  if (typeof imageField === 'object' && imageField.url) {
    return imageField.url
  }
  return null
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
      depth: 3, // Deep depth for images and nested relations
      limit: 1,
      overrideAccess: true,
    })
    .catch(() => null)

  const rawQuiz = quizQuery?.docs?.[0]

  if (!rawQuiz) {
    notFound()
  }

  let rawQuestions = rawQuiz.questions || []

  // Handle shallow relationships if IDs are returned instead of documents
  const isShallow = rawQuestions.some(
    (q: any) => typeof q === 'object' && !q.gameType && q.id,
  )

  if (isShallow) {
    const questionIds = rawQuestions.map((q: any) => (typeof q === 'object' ? q.id : q))

    const fullQuestions = await payload.find({
      collection: 'questions',
      where: {
        id: { in: questionIds },
      },
      depth: 3,
      limit: 100,
      overrideAccess: true,
    })

    rawQuestions = questionIds
      .map((id: number | string) => fullQuestions.docs.find((doc) => doc.id === id))
      .filter(Boolean)
  }

  // Format and restructure all question parameters into client ready payload
  const formattedQuestions = rawQuestions.map((q: any) => {
    return {
      id: q.id,
      title: q.title,
      questionTitle: q.questionTitle || q.title,
      gameType: q.gameType,
      category: q.category,
      questionNumber: q.questionNumber,
      
      // Global Media & Content
      heroImage: resolveImageUrl(q.heroImage),
      mobileImage: resolveImageUrl(q.mobileImage),
      content: extractRichText(q.content),

      // Timing & Points Config
      timeLimit: q.timeLimit || 60,
      points: q.points || 10,
      negativePoints: q.negativePoints || 0,
      difficulty: q.difficulty || 'Medium',
      enableDoubleUp: Boolean(q.enableDoubleUp),
      explanation: extractRichText(q.explanation) || q.explanation,

      // Game Specific Config Groups mapped safely with extracted text and images
      mcqGroup: q.mcqGroup
        ? {
            questionText: extractRichText(q.mcqGroup.questionText),
            questionImage: resolveImageUrl(q.mcqGroup.questionImage),
            correctOptionIndex: q.mcqGroup.correctOptionIndex,
            options: (q.mcqGroup.options || []).map((opt: any) => ({
              id: opt.id,
              optionText: opt.optionText,
              optionImage: resolveImageUrl(opt.optionImage),
            })),
          }
        : null,

      dropdownGroup: q.dropdownGroup
        ? {
            sentenceText: extractRichText(q.dropdownGroup.sentenceText),
            dropdownLabel: q.dropdownGroup.dropdownLabel,
            options: q.dropdownGroup.options || [],
            correctAnswer: q.dropdownGroup.correctAnswer,
          }
        : null,

      wordleGroup: q.wordleGroup
        ? {
            clueText: extractRichText(q.wordleGroup.clueText) || q.wordleGroup.clueText,
            answerWord: q.wordleGroup.answerWord,
            attempts: q.wordleGroup.attempts || 6,
            hint: q.wordleGroup.hint,
            hintImage: resolveImageUrl(q.wordleGroup.hintImage),
          }
        : null,

      wordFinderGroup: q.wordFinderGroup
        ? {
            instruction: q.wordFinderGroup.instruction,
            gridRows: q.wordFinderGroup.gridRows || [],
            wordsToFind: q.wordFinderGroup.wordsToFind || [],
          }
        : null,

      matchGroup: q.matchGroup
        ? {
            instruction: q.matchGroup.instruction,
            pairs: q.matchGroup.pairs || [],
          }
        : null,

      spotLieGroup: q.spotLieGroup
        ? {
            statements: q.spotLieGroup.statements || [],
          }
        : null,

      reorderGroup: q.reorderGroup
        ? {
            instruction: q.reorderGroup.instruction,
            itemsInCorrectOrder: q.reorderGroup.itemsInCorrectOrder || [],
          }
        : null,

      dragDropGroup: q.dragDropGroup
        ? {
            instruction: q.dragDropGroup.instruction,
            dragMode: q.dragDropGroup.dragMode,
            sentenceWordsOrder: q.dragDropGroup.sentenceWordsOrder || [],
            dropZones: q.dragDropGroup.dropZones || [],
          }
        : null,
    }
  })

  const quiz = {
    ...rawQuiz,
    questions: formattedQuestions,
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