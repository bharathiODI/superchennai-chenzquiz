import type { Payload } from 'payload'

/**
 * Rebuilds a search index by re-saving every document in the given
 * collections (@payloadcms/plugin-search syncs on afterChange).
 *
 * One bad document must not abort the whole run — failures are collected
 * and reported so the culprit is identifiable, and everything else indexes.
 */

export interface ReindexFailure {
  collection: string
  error: string
  id: unknown
  title?: unknown
}

export interface ReindexResult {
  counts: Record<string, number>
  failures: ReindexFailure[]
  success: boolean
}

export const reindexCollections = async (
  payload: Payload,
  collections: readonly string[],
  { limit = 500 }: { limit?: number } = {},
): Promise<ReindexResult> => {
  const counts: Record<string, number> = {}
  const failures: ReindexFailure[] = []

  for (const collection of collections) {
    // The slug is a runtime string, so it can't narrow to the app's
    // generated collection union — hence the loose local view of find/update.
    const p = payload as unknown as {
      find: (args: Record<string, unknown>) => Promise<{ docs: { id: unknown; title?: unknown }[] }>
      update: (args: Record<string, unknown>) => Promise<unknown>
    }

    const docs = await p.find({
      collection,
      depth: 0,
      limit,
      overrideAccess: true,
      pagination: false,
    })

    let n = 0
    for (const doc of docs.docs) {
      try {
        await p.update({
          collection,
          context: { skipRevalidate: true },
          data: {},
          id: doc.id,
          overrideAccess: true,
        })
        n++
      } catch (err) {
        failures.push({
          collection,
          error: err instanceof Error ? err.message : String(err),
          id: doc.id,
          title: doc.title,
        })
      }
    }
    counts[collection] = n
  }

  return { counts, failures, success: failures.length === 0 }
}
