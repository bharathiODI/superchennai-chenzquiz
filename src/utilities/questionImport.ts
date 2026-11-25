// Import questions from an Excel or CSV file (Editors and up). One row per MCQ question:
//   use_in, question, option_a ... option_f, correct (letter), topic, explanation, points
// The correct answer is a letter, so there's no mix-up over counting options from 0 or 1.
import type { Payload } from 'payload'
import * as XLSX from 'xlsx'
export { nextQuestionNumber } from './questionNumber'

export const IMPORT_COLUMNS = [
  'use_in',
  'question',
  'option_a',
  'option_b',
  'option_c',
  'option_d',
  'option_e',
  'option_f',
  'correct',
  'topic',
  'explanation',
  'points',
] as const

export const MAX_IMPORT_ROWS = 1000
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']
const USE_IN: Record<string, string> = {
  general: 'general',
  sponsored: 'sponsored',
  dra: 'sponsored',
  dra_sponsored: 'sponsored',
  both: 'both',
  none: 'none',
  not_in_play: 'none',
}
const TOPICS: Record<string, string> = {
  chennai: 'chennai',
  gk: 'gk',
  general_knowledge: 'gk',
  science: 'science',
  geography: 'geography',
}

export type ImportRow = {
  row: number // spreadsheet row number (header = 1)
  useIn: string
  question: string
  options: string[]
  correctIndex: number
  correctLetter: string
  topic: string
  explanation: string
  points: number
  errors: string[]
}

const key = (s: unknown) =>
  String(s ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ')

/** Reads the first sheet of an .xlsx/.xls/.csv file into checked rows. */
export function parseImportFile(buffer: Buffer): { rows: ImportRow[]; error?: string } {
  let wb: XLSX.WorkBook
  try {
    wb = XLSX.read(buffer, { type: 'buffer', raw: false })
  } catch {
    return { rows: [], error: 'Could not read the file. Use the sample file (Excel or CSV).' }
  }
  const sheet = wb.Sheets[wb.SheetNames[0] ?? '']
  if (!sheet) return { rows: [], error: 'The file has no sheet.' }
  const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '', raw: false })
  if (!raw.length) return { rows: [], error: 'The file has no rows under the header.' }
  if (raw.length > MAX_IMPORT_ROWS) return { rows: [], error: `At most ${MAX_IMPORT_ROWS} questions per file.` }
  const headers = Object.keys(raw[0] ?? {}).map(key)
  if (!headers.includes('question') || !headers.includes('correct')) {
    return { rows: [], error: 'The header row must include at least "question", "option_a", "option_b" and "correct". Download the sample file.' }
  }
  const rows: ImportRow[] = []
  raw.forEach((r, i) => {
    const v: Record<string, string> = {}
    for (const [k, val] of Object.entries(r)) v[key(k)] = String(val ?? '').trim()
    if (Object.values(v).every((x) => !x)) return // blank line
    const errors: string[] = []
    const useInRaw = key(v.use_in || 'general')
    const useIn = USE_IN[useInRaw] ?? ''
    if (!useIn) errors.push(`use_in "${v.use_in}" - use GENERAL, SPONSORED, BOTH or NOT_IN_PLAY`)
    const question = v.question || ''
    if (!question) errors.push('question is empty')
    const letters = LETTERS.map((l) => v[`option_${l.toLowerCase()}`] || '')
    const last = letters.reduce((m, t, j) => (t ? j : m), -1)
    const options = letters.slice(0, last + 1)
    if (options.some((t) => !t)) errors.push('options must be filled in order (no gaps)')
    if (options.length < 2) errors.push('at least 2 options (option_a, option_b)')
    const correctLetter = (v.correct || '').toUpperCase().replace(/[^A-F]/g, '')
    const correctIndex = correctLetter.length === 1 ? LETTERS.indexOf(correctLetter) : -1
    if (correctIndex < 0) errors.push(`correct "${v.correct}" - use one letter, A to ${LETTERS[Math.max(1, options.length - 1)]}`)
    else if (!options[correctIndex]) errors.push(`correct is ${correctLetter} but option_${correctLetter.toLowerCase()} is empty`)
    const topicRaw = key(v.topic || 'chennai')
    const topic = TOPICS[topicRaw] ?? ''
    if (!topic) errors.push(`topic "${v.topic}" - use chennai, gk, science or geography`)
    const points = v.points ? Number(v.points) : 10
    if (!Number.isFinite(points) || points < 0 || points > 1000) errors.push(`points "${v.points}" is not a number from 0 to 1000`)
    rows.push({
      row: i + 2,
      useIn,
      question,
      options,
      correctIndex,
      correctLetter,
      topic,
      explanation: v.explanation || '',
      points: Number.isFinite(points) ? Math.round(points) : 10,
      errors,
    })
  })
  // The same question twice in the file
  const seen = new Map<string, number>()
  for (const r of rows) {
    if (!r.question) continue
    const k = norm(r.question)
    const first = seen.get(k)
    if (first) r.errors.push(`same question as row ${first}`)
    else seen.set(k, r.row)
  }
  return { rows }
}

/** Marks rows whose question already exists in the quiz (same text, any status). */
export async function markExisting(payload: Payload, quizId: number | string, rows: ImportRow[]) {
  const existing = await payload.find({
    collection: 'questions',
    where: { quiz: { equals: quizId } },
    depth: 0,
    pagination: false,
    overrideAccess: true,
    draft: true,
    select: { questionTitle: true, title: true },
  } as any)
  const have = new Set((existing.docs as any[]).map((d) => norm(String(d.questionTitle || d.title || ''))))
  for (const r of rows) if (r.question && have.has(norm(r.question))) r.errors.push('already in this quiz')
}

/** Rich text (Lexical) with one paragraph per line. */
export function lexical(text: string) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim())
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: (lines.length ? lines : ['']).map((line) => ({
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        textFormat: 0,
        children: line ? [{ type: 'text', text: line, format: 0, detail: 0, mode: 'normal', style: '', version: 1 }] : [],
      })),
    },
  }
}

/** The sample file: Instructions + Questions sheets (xlsx) or the questions only (csv). */
export function sampleWorkbook(): XLSX.WorkBook {
  const rows = [
    {
      use_in: 'GENERAL',
      question: 'Which river flows past Kotturpuram?',
      option_a: 'Adyar',
      option_b: 'Cooum',
      option_c: 'Kosasthalaiyar',
      option_d: 'Palar',
      option_e: '',
      option_f: '',
      correct: 'A',
      topic: 'chennai',
      explanation: 'The Adyar flows past Kotturpuram to the sea.',
      points: 10,
    },
    {
      use_in: 'SPONSORED',
      question: '[DRA question text]',
      option_a: '[option]',
      option_b: '[option]',
      option_c: '[option]',
      option_d: '[option]',
      option_e: '',
      option_f: '',
      correct: 'B',
      topic: 'chennai',
      explanation: '[short line about the DRA project]',
      points: 10,
    },
  ]
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(rows, { header: [...IMPORT_COLUMNS] })
  ws['!cols'] = IMPORT_COLUMNS.map((c) => ({ wch: c === 'question' || c === 'explanation' ? 48 : 14 }))
  XLSX.utils.book_append_sheet(wb, ws, 'Questions')
  const help = XLSX.utils.aoa_to_sheet([
    ['Chenz Quiz - question import'],
    [],
    ['Column', 'What to put'],
    ['use_in', 'GENERAL (Q1/Q2), SPONSORED (the DRA slot), BOTH, or NOT_IN_PLAY. Empty = GENERAL.'],
    ['question', 'The question as players see it.'],
    ['option_a ... option_f', 'At least option_a and option_b, filled in order.'],
    ['correct', 'The letter of the right option: A, B, C ...'],
    ['topic', 'chennai, gk, science or geography. Empty = chennai.'],
    ['explanation', 'Shown after the player answers (optional).'],
    ['points', 'Points for a right answer (optional, default 10).'],
    [],
    ['Delete the two example rows before importing. One question per row; the header row stays.'],
    ['Images can be added in the CMS after the import. A question already in the quiz (same text) is skipped.'],
  ])
  help['!cols'] = [{ wch: 22 }, { wch: 90 }]
  XLSX.utils.book_append_sheet(wb, help, 'Instructions')
  return wb
}
