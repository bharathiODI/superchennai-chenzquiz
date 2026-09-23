import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'
import type { Quiz } from '../../../payload-types' // Unga payload types path ku etha mathri mathikonga

export const revalidateQuiz: CollectionAfterChangeHook<Quiz> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    // 🛠️ FIX: Custom status field check ('active' irundha mattum revalidate aagum)
    if (doc.status === 'active') {
      const path = doc.slug === 'home' ? '/quizzes' : `/quizzes/${doc.slug}`

      payload.logger.info(`Revalidating quiz at path: ${path}`)

      revalidatePath(path)
      revalidatePath('/quizzes') 
      revalidateTag('quizzes-sitemap')
    }

    // 🛠️ FIX: Previous status 'active' irundhu ippo 'draft' / 'completed' aana old path-um revalidate aagum
    if (previousDoc?.status === 'active' && doc.status !== 'active') {
      const oldPath = previousDoc.slug === 'home' ? '/quizzes' : `/quizzes/${previousDoc.slug}`

      payload.logger.info(`Revalidating old quiz at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidatePath('/quizzes')
      revalidateTag('quizzes-sitemap')
    }
  }
  return doc
}

export const revalidateQuizDelete: CollectionAfterDeleteHook = async ({ doc }) => {
  process.nextTick(() => {
    try {
      revalidatePath('/quizzes')

      if (doc?.slug) {
        revalidatePath(`/quizzes/${doc.slug}`)
      }
      revalidateTag('quizzes-sitemap')
    } catch (err) {
      console.error(err)
    }
  })

  return doc
}