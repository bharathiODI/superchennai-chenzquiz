import type { Payload } from 'payload'

/** The next free Question Number (drafts included). */
export async function nextQuestionNumber(payload: Payload): Promise<number> {
  const r = await (payload.db as any).pool.query(
    'SELECT greatest(coalesce((SELECT max(question_number) FROM questions), 0), coalesce((SELECT max(version_question_number) FROM _questions_v), 0))::bigint AS n',
  )
  return Number(r.rows[0]?.n || 0) + 1
}
