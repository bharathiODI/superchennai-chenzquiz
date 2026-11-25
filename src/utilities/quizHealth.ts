import type { Payload } from 'payload'

import { quizSlots } from './roundLayout'

const DAY_MS = 86_400_000
const WEEK = 7

export const fmtIndia = (d: Date) =>
  d.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })

export type QuizHealth = {
  id: number
  title: string
  endsAt: string | null
  endsAtIndia: string | null
  closed: boolean
  general: number
  sponsored: number
  drafts: number
  generalPerDay: number
  sponsoredPerDay: number
  warnings: string[]
}

/**
 * What the team must act on for a live quiz: its End date (after it nobody can play) and how many
 * questions are left in play (a player sees repeats once they've had them all).
 */
export async function quizHealth(payload: Payload, quiz: any, now: Date): Promise<QuizHealth> {
  const title = String(quiz.quizTitle || `Quiz ${quiz.id}`).trim()
  const slots = quizSlots(quiz)
  const sponsoredPerDay = slots.filter((s) => s.source === 'sponsored').length
  const generalPerDay = slots.length - sponsoredPerDay
  const sponsoredAt = slots.findIndex((s) => s.source === 'sponsored') + 1
  const {
    rows: [c],
  } = await (payload.db as any).pool.query(
    `SELECT count(*) FILTER (WHERE _status = 'published' AND use_in IN ('general', 'both'))::int AS general,
            count(*) FILTER (WHERE _status = 'published' AND use_in IN ('sponsored', 'both'))::int AS sponsored,
            count(*) FILTER (WHERE _status = 'draft')::int AS drafts
       FROM questions WHERE quiz_id = $1`,
    [quiz.id],
  )
  const end = quiz.quizEndDate ? new Date(quiz.quizEndDate) : null
  const closed = Boolean(end && end <= now)
  const fix = `Quizzes > ${title} > End date`
  const warnings: string[] = []
  if (end && closed) {
    warnings.push(
      `${title} closed on ${fmtIndia(end)} (its End date): nobody can play. Set the challenge's last day in ${fix}.`,
    )
  } else if (end && end.getTime() - now.getTime() < 3 * DAY_MS) {
    warnings.push(
      `${title} closes on ${fmtIndia(end)} (its End date): after that nobody can play. If the challenge runs longer, set its last day in ${fix}.`,
    )
  }
  if (sponsoredPerDay && !c.sponsored) {
    warnings.push(
      `No Sponsored questions in play for ${title}: Q${sponsoredAt} gets a General question. Add the DRA questions (Import Questions, use_in SPONSORED).`,
    )
  } else if (sponsoredPerDay && c.sponsored < WEEK * sponsoredPerDay) {
    warnings.push(
      `Only ${c.sponsored} Sponsored question(s) in play for ${title}: enough for ${Math.floor(c.sponsored / sponsoredPerDay)} day(s) before a player gets a General one in Q${sponsoredAt}.`,
    )
  }
  if (generalPerDay && c.general < WEEK * generalPerDay) {
    warnings.push(
      `Only ${c.general} General question(s) in play for ${title}: enough for ${Math.floor(c.general / generalPerDay)} day(s) before a player sees repeats. Add questions or switch "Not in play" ones to General.`,
    )
  }
  return {
    id: quiz.id,
    title,
    endsAt: end ? end.toISOString() : null,
    endsAtIndia: end ? fmtIndia(end) : null,
    closed,
    general: c.general,
    sponsored: c.sponsored,
    drafts: c.drafts,
    generalPerDay,
    sponsoredPerDay,
    warnings,
  }
}

/** Health of every Active quiz (normally one). */
export async function activeQuizHealth(payload: Payload, now: Date): Promise<QuizHealth[]> {
  const res = await payload.find({
    collection: 'quizzes',
    where: { status: { equals: 'active' } },
    sort: 'quizDate',
    depth: 0,
    pagination: false,
    overrideAccess: true,
    select: {
      quizTitle: true,
      quizEndDate: true,
      roundLayout: true,
      questionsPerRound: true,
      sponsoredPosition: true,
    },
  } as any)
  return Promise.all((res.docs as any[]).map((q) => quizHealth(payload, q, now)))
}
