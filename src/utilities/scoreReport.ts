// Day-wise score report for the CMS export (admins only - it contains phone numbers).
// Built from quiz rounds: every round records the player, its game day and its score, so the
// report always matches the leaderboard. Pure data shaping lives here; the route makes the file.
import type { Payload } from 'payload'
import { relId } from './play'
import { gameDayKey } from './gameDay'
import { getGameDaySettings } from './getGameTimers'
import { isTestPhone } from './testPlayers'

type Row = Record<string, string | number>

const IST = 'Asia/Kolkata'
const fmtTime = (v?: string | null) =>
  v
    ? new Date(v).toLocaleString('en-GB', { timeZone: IST, day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })
    : ''
const fmtDay = (key: string) => {
  const [y = 1970, m = 1, d = 1] = key.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-GB', { timeZone: 'UTC', day: '2-digit', month: 'short' })
}
const daysBetween = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / 86_400_000)

export type ScoreReport = {
  quizTitle: string
  days: string[]
  dayLabels: Record<string, string>
  summary: Row[]
  daily: Row[]
  rounds: Row[]
}

export async function buildScoreReport(
  payload: Payload,
  opts: { quizId?: string | number | null; includeTestPlayers?: boolean },
): Promise<ScoreReport> {
  const all = async (collection: string, where?: any) =>
    (await payload.find({ collection: collection as any, where, depth: 0, pagination: false, overrideAccess: true })).docs as any[]

  const quizWhere = opts.quizId ? { quiz: { equals: opts.quizId } } : undefined
  const [quizzes, rounds, attempts, players, gameDay] = await Promise.all([
    all('quizzes'),
    all('quiz-rounds', quizWhere),
    all('quiz-attempts', quizWhere),
    all('quiz-users'),
    getGameDaySettings(payload),
  ])
  const quizById = new Map(quizzes.map((q) => [String(q.id), q]))
  const playerById = new Map(players.map((p) => [String(p.id), p]))

  const questionIds = Array.from(new Set(rounds.flatMap((r) => (r.questions || []).map((q: any) => String(relId(q))))))
  const questions = questionIds.length ? await all('questions', { id: { in: questionIds } }) : []
  const questionById = new Map(questions.map((q) => [String(q.id), q]))
  const qLabel = (id: any) => {
    const q = questionById.get(String(relId(id)))
    if (!q) return `#${relId(id)}`
    return `${q.questionNumber ? `Q${q.questionNumber}: ` : ''}${q.questionTitle || q.title || `#${q.id}`}`
  }

  // Score entries carry correct answers and time; match each to its round (same player, quiz,
  // round number, finished within 5 minutes of each other).
  const attemptsByKey = new Map<string, any[]>()
  for (const a of attempts) {
    const k = `${relId(a.user)}|${relId(a.quiz)}`
    if (!attemptsByKey.has(k)) attemptsByKey.set(k, [])
    attemptsByKey.get(k)!.push(a)
  }
  const used = new Set<string>()
  const attemptFor = (r: any) => {
    if (!r.completedAt) return null
    const t = Date.parse(r.completedAt)
    let best: any = null
    let bestGap = 5 * 60_000
    for (const a of attemptsByKey.get(`${relId(r.user)}|${relId(r.quiz)}`) || []) {
      if (used.has(String(a.id)) || (a.round && r.round && Number(a.round) !== Number(r.round))) continue
      const gap = Math.abs(Date.parse(a.completedAt) - t)
      if (gap <= bestGap) {
        best = a
        bestGap = gap
      }
    }
    if (best) used.add(String(best.id))
    return best
  }

  const keep = (r: any) => {
    const p = playerById.get(String(relId(r.user)))
    return p && (opts.includeTestPlayers || !isTestPhone(p.phone))
  }
  const kept = rounds.filter(keep).sort((a, b) => String(a.day).localeCompare(String(b.day)) || Date.parse(a.createdAt) - Date.parse(b.createdAt))

  // Day numbers count from the first game day anyone played (or the quiz's start date if that is
  // earlier) - so a start date edited later can't produce "Day 0".
  const quiz = opts.quizId ? quizById.get(String(opts.quizId)) : null
  const days = Array.from(new Set(kept.map((r) => String(r.day)))).sort()
  const startDay = quiz?.quizDate ? gameDayKey(quiz.quizDate, gameDay) : null
  const firstDay = [startDay, days[0]].filter((d): d is string => Boolean(d)).sort()[0]
  const dayNo = (key: string) => (firstDay ? daysBetween(firstDay, key) + 1 : 0)
  const dayLabels = Object.fromEntries(days.map((d) => [d, quiz ? `Day ${dayNo(d)} (${fmtDay(d)})` : fmtDay(d)]))

  // ---- All rounds (detailed rows)
  type Agg = { player: any; quizId: string; byDay: Record<string, { score: number; time: number; at: string[] }> }
  const agg = new Map<string, Agg>()
  const roundsRows: Row[] = kept.map((r) => {
    const p = playerById.get(String(relId(r.user)))!
    const q = quizById.get(String(relId(r.quiz)))
    const a = attemptFor(r)
    const done = r.status === 'completed'
    const score = done ? Number(r.score) || 0 : 0
    const time = a ? Number(a.timeTaken) || 0 : 0
    if (done) {
      const k = `${p.id}|${relId(r.quiz)}`
      if (!agg.has(k)) agg.set(k, { player: p, quizId: String(relId(r.quiz)), byDay: {} })
      const day = (agg.get(k)!.byDay[r.day] ||= { score: 0, time: 0, at: [] })
      day.score += score
      day.time += time
      day.at.push(r.completedAt)
    }
    return {
      'Game day': fmtDay(String(r.day)),
      ...(quiz ? { 'Day no.': dayNo(String(r.day)) } : {}),
      Quiz: q?.quizTitle || q?.title || `#${relId(r.quiz)}`,
      Round: Number(r.round) || 1,
      Player: p.name || '',
      Phone: p.phone || '',
      Email: p.email || '',
      Status: done ? 'Finished' : 'Not finished',
      Score: score,
      Correct: a ? Number(a.correctAnswers) || 0 : '',
      Questions: (r.questions || []).length,
      'Time (s)': a ? time : '',
      Started: fmtTime(r.createdAt),
      Finished: fmtTime(r.completedAt),
      'Questions asked': (r.questions || []).map(qLabel).join(' | '),
      'Sponsored question': r.sponsoredQuestion ? qLabel(r.sponsoredQuestion) : '',
      'Player ID': p.id,
      'Round ID': r.id,
    }
  })

  // ---- Day-wise summary: one row per player (per quiz), one column per game day
  const summary: Row[] = Array.from(agg.values())
    .map(({ player, quizId, byDay }) => {
      const total = Object.values(byDay).reduce((s, d) => s + d.score, 0)
      const time = Object.values(byDay).reduce((s, d) => s + d.time, 0)
      const q = quizById.get(quizId)
      const row: Row = {
        Player: player.name || '',
        Phone: player.phone || '',
        Email: player.email || '',
        ...(opts.quizId ? {} : { Quiz: q?.quizTitle || q?.title || `#${quizId}` }),
      }
      // Per day: score and time side by side
      for (const d of days) {
        const label = dayLabels[d] ?? d
        row[`${label} score`] = byDay[d]?.score ?? ''
        row[`${label} time (s)`] = byDay[d]?.time ?? ''
        // when they played that day (finished the round), India time
        row[`${label} played at`] = byDay[d] ? byDay[d].at.map((t) => fmtTime(t)).join(', ') : ''
      }
      row['Days played'] = Object.keys(byDay).length
      row['Total score'] = total
      row['Total time (s)'] = time
      row['Joined'] = fmtTime(player.createdAt)
      row['Player ID'] = player.id
      return row
    })
    .sort((a, b) => Number(b['Total score']) - Number(a['Total score']) || Number(a['Total time (s)']) - Number(b['Total time (s)']))
    .map((row, i) => ({ Rank: i + 1, ...row }))

  // ---- Daily ranking: every finished round per day, best first (score, then less time)
  const daily: Row[] = []
  for (const d of days) {
    const dayRows = Array.from(agg.values())
      .filter((x) => x.byDay[d])
      .map((x) => ({ x, score: x.byDay[d]?.score ?? 0, time: x.byDay[d]?.time ?? 0, at: x.byDay[d]?.at ?? [] }))
      .sort((a, b) => b.score - a.score || a.time - b.time)
    dayRows.forEach(({ x, score, time, at }, i) =>
      daily.push({
        'Game day': dayLabels[d] ?? d,
        Rank: i + 1,
        Player: x.player.name || '',
        Phone: x.player.phone || '',
        Email: x.player.email || '',
        ...(opts.quizId ? {} : { Quiz: quizById.get(x.quizId)?.quizTitle || `#${x.quizId}` }),
        Score: score,
        'Time (s)': time,
        'Played at': at.map((t) => fmtTime(t)).join(', '),
        'Player ID': x.player.id,
      }),
    )
  }

  return { quizTitle: quiz ? quiz.quizTitle || quiz.title || `Quiz ${quiz.id}` : 'All quizzes', days, dayLabels, summary, daily, rounds: roundsRows }
}
