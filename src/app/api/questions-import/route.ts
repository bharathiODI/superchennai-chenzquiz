import { headers as getHeaders } from 'next/headers'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import { EDITORS, userHas } from '@/access/roles'
import { lexical, markExisting, nextQuestionNumber, parseImportFile } from '@/utilities/questionImport'

export const maxDuration = 300

// POST /api/questions-import  (multipart: file, quiz, status=draft|published, mode=preview|import)
// Editors and up. "preview" only checks the file; "import" creates the rows without errors.
export async function POST(req: Request) {
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: await getHeaders() })
  if (!userHas(user, EDITORS)) {
    return NextResponse.json({ error: 'Only Editors, Administrators and Super Admins can import questions.' }, { status: 403 })
  }
  const form = await req.formData().catch(() => null)
  const file = form?.get('file')
  if (!form || !file || typeof file === 'string') return NextResponse.json({ error: 'Choose a file.' }, { status: 400 })
  const mode = form.get('mode') === 'import' ? 'import' : 'preview'
  const status = form.get('status') === 'draft' ? 'draft' : 'published'

  // The quiz: the one picked, else the live one
  let quizId = Number(form.get('quiz')) || null
  if (!quizId) {
    const live = await payload.find({ collection: 'quizzes', where: { status: { equals: 'active' } }, sort: 'quizDate', limit: 1, depth: 0, overrideAccess: true })
    quizId = (live.docs[0]?.id as number) ?? null
  }
  if (!quizId) return NextResponse.json({ error: 'No live quiz: pick a quiz.' }, { status: 400 })

  const { rows, error } = parseImportFile(Buffer.from(await file.arrayBuffer()))
  if (error) return NextResponse.json({ error }, { status: 400 })
  await markExisting(payload, quizId, rows)
  const good = rows.filter((r) => !r.errors.length)

  if (mode === 'preview') {
    return NextResponse.json({ quizId, rows, ok: good.length, bad: rows.length - good.length })
  }

  // Import: next free Question Numbers, as the logged-in user (their role's rules apply)
  let next = await nextQuestionNumber(payload)
  const created: { row: number; id: number | string }[] = []
  const failed: { row: number; error: string }[] = []
  for (const r of good) {
    try {
      const doc = await payload.create({
        collection: 'questions',
        draft: status === 'draft',
        overrideAccess: false,
        user,
        data: {
          title: r.question.slice(0, 120),
          useIn: r.useIn,
          quiz: quizId,
          questionNumber: next,
          gameType: 'mcq',
          questionTitle: r.question,
          category: r.topic,
          points: r.points,
          mcqGroup: {
            questionText: lexical(r.question),
            options: r.options.map((optionText) => ({ optionText })),
            correctOptionIndex: r.correctIndex,
          },
          ...(r.explanation ? { explanation: lexical(r.explanation) } : {}),
          _status: status,
        } as any,
      })
      created.push({ row: r.row, id: doc.id })
      next++
    } catch (e: any) {
      failed.push({ row: r.row, error: e?.data?.errors?.[0]?.message || e?.message || 'failed' })
    }
  }
  return NextResponse.json({
    quizId,
    created: created.length,
    skipped: rows.length - good.length,
    failed,
    firstId: created[0]?.id ?? null,
  })
}
