import { getNow } from '@/utilities/clock'
import type { Payload } from 'payload'

import { gameDayKey } from '@/utilities/gameDay'
import { getGameDaySettings } from '@/utilities/getGameTimers'
import { TEST_PLAYER_PHONES } from '@/utilities/testPlayers'

/**
 * Read-only queries behind the CMS Quiz Dashboard (players, attempts, quiz details) and its
 * "Export these rows" Excel file - both use the same filters, so the file always matches the
 * screen. Aggregated in SQL so it stays quick with thousands of players. Test players are left
 * out unless asked for. A game day is the India date of (time - day start), as in the game.
 * Streaks follow utilities/quizStreak: the current streak is alive if the last day played is
 * today or yesterday; best = longest run of consecutive game days.
 */

export type Tab = 'players' | 'attempts' | 'quizzes'
export const PAGE_SIZE = 25
export const EXPORT_LIMIT = 100_000

export const PLAYER_SORTS = {
  points: 'Points (high to low)',
  streak: 'Current streak',
  best: 'Best streak',
  days: 'Days played',
  last: 'Last played',
  joined: 'Newest first',
  name: 'Name (A-Z)',
} as const
export const ATTEMPT_SORTS = {
  latest: 'Latest first',
  score: 'Score (high to low)',
  time: 'Fastest first',
} as const

export type Filters = {
  tab: Tab
  quizId: number | null
  q: string
  tests: boolean
  page: number
  /** game-day period (players: stats are for this period; attempts: rows in it) */
  from: string | null
  to: string | null
  /** players: any / played in the period / didn't play in the period */
  played: 'any' | 'yes' | 'no'
  /** players: joined (registered) between these India dates */
  regFrom: string | null
  regTo: string | null
  minPoints: number | null
  maxPoints: number | null
  minDays: number | null
  minStreak: number | null
  minBest: number | null
  /** attempts */
  round: number | null
  minScore: number | null
  maxScore: number | null
  sort: string
}

// Last 10 digits of the reserved test numbers (+91 00000 00001 ... 10)
const TEST_TAILS = TEST_PLAYER_PHONES.map((p) => p.replace(/\D/g, '').slice(-10))

type Pool = { query: (text: string, params?: unknown[]) => Promise<{ rows: any[] }> }
const pool = (payload: Payload): Pool => (payload.db as unknown as { pool: Pool }).pool

const DATE = /^\d{4}-\d{2}-\d{2}$/

export function parseFilters(sp: Record<string, string | string[] | undefined> | undefined): Filters {
  const one = (k: string) => {
    const v = sp?.[k]
    return (Array.isArray(v) ? v[0] : v)?.trim() ?? ''
  }
  const date = (k: string) => (DATE.test(one(k)) ? one(k) : null)
  const num = (k: string) => {
    const s = one(k)
    if (s === '') return null
    const n = Number(s)
    return Number.isFinite(n) && n >= 0 ? n : null
  }
  const int = (k: string) => {
    const n = num(k)
    return n === null ? null : Math.floor(n)
  }
  const tab = one('tab')
  const quiz = Number(one('quiz'))
  const page = Number(one('page'))
  const played = one('played')
  const t: Tab = tab === 'attempts' || tab === 'quizzes' ? tab : 'players'
  const sorts: Record<string, string> = t === 'attempts' ? ATTEMPT_SORTS : PLAYER_SORTS
  const legacyDay = date('day') // old links: ?day=YYYY-MM-DD
  let from = date('from') ?? legacyDay
  let to = date('to') ?? legacyDay
  if (from && to && from > to) [from, to] = [to, from]
  let regFrom = date('regFrom')
  let regTo = date('regTo')
  if (regFrom && regTo && regFrom > regTo) [regFrom, regTo] = [regTo, regFrom]
  return {
    tab: t,
    quizId: Number.isInteger(quiz) && quiz > 0 ? quiz : null,
    q: one('q').slice(0, 80),
    tests: one('tests') === '1',
    page: Number.isInteger(page) && page > 0 ? page : 1,
    from,
    to,
    played: played === 'yes' || played === 'no' ? played : 'any',
    regFrom,
    regTo,
    minPoints: num('minPoints'),
    maxPoints: num('maxPoints'),
    minDays: int('minDays'),
    minStreak: int('minStreak'),
    minBest: int('minBest'),
    round: int('round'),
    minScore: num('minScore'),
    maxScore: num('maxScore'),
    sort: sorts[one('sort')] ? one('sort') : t === 'attempts' ? 'latest' : 'points',
  }
}

/** The filters as URL parameters (defaults left out) - for links, paging and the export. */
export function filterParams(f: Filters, change: Partial<Filters> = {}): URLSearchParams {
  const n = { ...f, ...change }
  const p = new URLSearchParams()
  const put = (k: string, v: unknown) => {
    if (v !== null && v !== undefined && v !== '' && v !== false) p.set(k, String(v === true ? 1 : v))
  }
  if (n.tab !== 'players') p.set('tab', n.tab)
  put('quiz', n.quizId)
  put('q', n.q)
  put('tests', n.tests)
  if (n.tab !== 'quizzes') {
    put('from', n.from)
    put('to', n.to)
  }
  if (n.tab === 'players') {
    if (n.played !== 'any') p.set('played', n.played)
    put('regFrom', n.regFrom)
    put('regTo', n.regTo)
    put('minPoints', n.minPoints)
    put('maxPoints', n.maxPoints)
    put('minDays', n.minDays)
    put('minStreak', n.minStreak)
    put('minBest', n.minBest)
    if (n.sort !== 'points') p.set('sort', n.sort)
  }
  if (n.tab === 'attempts') {
    put('round', n.round)
    put('minScore', n.minScore)
    put('maxScore', n.maxScore)
    if (n.sort !== 'latest') p.set('sort', n.sort)
  }
  if (n.page > 1) p.set('page', String(n.page))
  return p
}

/** Plain-language list of the filters in use (shown above the table and in the Excel file). */
export function describeFilters(f: Filters, quizTitle?: string): string[] {
  const out: string[] = []
  const range = (a: string | null, b: string | null) => (a && b ? (a === b ? a : `${a} to ${b}`) : a ? `from ${a}` : `until ${b}`)
  if (quizTitle) out.push(`Quiz: ${quizTitle}`)
  if (f.tab !== 'quizzes' && (f.from || f.to)) out.push(`Game days: ${range(f.from, f.to)}`)
  if (f.tab === 'players') {
    if (f.played === 'yes') out.push(f.from || f.to ? 'Played in these days' : 'Has played')
    if (f.played === 'no') out.push(f.from || f.to ? "Didn't play in these days" : 'Never played')
    if (f.regFrom || f.regTo) out.push(`Joined: ${range(f.regFrom, f.regTo)}`)
    if (f.minPoints !== null) out.push(`Points ≥ ${f.minPoints}`)
    if (f.maxPoints !== null) out.push(`Points ≤ ${f.maxPoints}`)
    if (f.minDays !== null) out.push(`Days played ≥ ${f.minDays}`)
    if (f.minStreak !== null) out.push(`Current streak ≥ ${f.minStreak}`)
    if (f.minBest !== null) out.push(`Best streak ≥ ${f.minBest}`)
  }
  if (f.tab === 'attempts') {
    if (f.round !== null) out.push(`Round ${f.round}`)
    if (f.minScore !== null) out.push(`Score ≥ ${f.minScore}`)
    if (f.maxScore !== null) out.push(`Score ≤ ${f.maxScore}`)
  }
  if (f.q) out.push(`Search: "${f.q}"`)
  if (f.tests) out.push('Including test players')
  return out
}

/** Builds a parameter list: add(value) returns "$n". */
class Params {
  vals: unknown[] = []
  add(v: unknown, cast = '') {
    this.vals.push(v)
    return `$${this.vals.length}${cast}`
  }
}

type Ctx = { startMins: number; today: string }

async function context(payload: Payload): Promise<Ctx & { gd: Awaited<ReturnType<typeof getGameDaySettings>> }> {
  const gd = await getGameDaySettings(payload)
  const now = await getNow(payload) // the demo test clock moves "today" too
  return {
    gd,
    startMins: gd.startHour * 60 + gd.startMinute,
    today: gameDayKey(now, gd) ?? now.toISOString().slice(0, 10),
  }
}

/** Rows of the chosen tab: one page (limit) or everything (export). */
export async function queryRows(
  payload: Payload,
  f: Filters,
  ctx: Ctx,
  limit: number,
  offset = 0,
): Promise<{ rows: any[]; total: number }> {
  const P = new Params()
  // shared pieces (each adds its parameters only when used)
  const start = () => P.add(ctx.startMins, '::int')
  const DAY = (alias: string, s: string) =>
    `((${alias}.completed_at AT TIME ZONE 'Asia/Kolkata') - make_interval(mins => ${s}))::date`
  const REAL = () =>
    `(${P.add(f.tests, '::bool')} OR right(regexp_replace(coalesce(u.phone, ''), '\\D', '', 'g'), 10) <> ALL(${P.add(TEST_TAILS, '::text[]')}))`
  const likeValue = f.q ? `%${f.q.replace(/[%_\\]/g, (m) => '\\' + m)}%` : ''
  const SEARCH = () => {
    if (!likeValue) return 'TRUE'
    const l = P.add(likeValue, '::text')
    return `(u.name ILIKE ${l} OR u.phone ILIKE ${l} OR u.email ILIKE ${l})`
  }
  /** "(value IS NULL OR expr OP value)" - an optional filter */
  const opt = (v: unknown, cast: string, expr: (p: string) => string) => {
    if (v === null || v === undefined) return 'TRUE'
    return expr(P.add(v, cast))
  }

  let sql = ''
  if (f.tab === 'players') {
    const s = start()
    const quizCond = (alias: string) => opt(f.quizId, '::int', (p) => `${alias}.quiz_id = ${p}`)
    const inPeriod = (alias: string) =>
      [
        opt(f.from, '::date', (p) => `${DAY(alias, s)} >= ${p}`),
        opt(f.to, '::date', (p) => `${DAY(alias, s)} <= ${p}`),
      ].join(' AND ')
    const JOINED = `(u.created_at AT TIME ZONE 'Asia/Kolkata')::date`
    const order: Record<string, string> = {
      points: 'points DESC, secs ASC, u.created_at ASC, u.id',
      streak: 'streak DESC, best DESC, points DESC, u.id',
      best: 'best DESC, streak DESC, points DESC, u.id',
      days: 'days DESC, points DESC, u.id',
      last: 'last_at DESC NULLS LAST, u.id',
      joined: 'u.created_at DESC, u.id DESC',
      name: 'lower(u.name) ASC NULLS LAST, u.id',
    }
    const playedCond =
      f.played === 'yes' ? 'att.user_id IS NOT NULL' : f.played === 'no' ? 'att.user_id IS NULL' : 'TRUE'
    // A quiz chosen: its players (or, for "didn't play", everyone)
    const quizPlayers =
      f.quizId && f.played !== 'no'
        ? `EXISTS (SELECT 1 FROM quiz_attempts e WHERE e.user_id = u.id AND ${quizCond('e')})`
        : 'TRUE'
    sql = `WITH att AS (
             SELECT a.user_id, count(*)::int AS rounds, count(DISTINCT ${DAY('a', s)})::int AS days,
                    coalesce(sum(a.score), 0)::float AS points, coalesce(sum(a.time_taken), 0)::float AS secs,
                    max(a.completed_at) AS last_at
               FROM quiz_attempts a
              WHERE ${quizCond('a')} AND ${inPeriod('a')}
              GROUP BY a.user_id),
           pd AS (SELECT DISTINCT a.user_id, ${DAY('a', s)} AS d FROM quiz_attempts a
                   WHERE ${quizCond('a')} AND a.completed_at IS NOT NULL),
           isl AS (SELECT user_id, d, d - (row_number() OVER (PARTITION BY user_id ORDER BY d))::int AS g FROM pd),
           runs AS (SELECT user_id, count(*)::int AS len, max(d) AS last_d FROM isl GROUP BY user_id, g),
           stk AS (SELECT user_id, max(len)::int AS best,
                          coalesce(max(len) FILTER (WHERE last_d >= ${P.add(ctx.today, '::date')} - 1), 0)::int AS cur
                     FROM runs GROUP BY user_id)
         SELECT u.id, u.name, u.phone, u.email, u.created_at,
                coalesce(att.rounds, 0) AS rounds, coalesce(att.days, 0) AS days,
                coalesce(att.points, 0) AS points, coalesce(att.secs, 0) AS secs, att.last_at,
                coalesce(stk.cur, 0) AS streak, coalesce(stk.best, 0) AS best,
                count(*) OVER()::int AS total
           FROM quiz_users u
           LEFT JOIN att ON att.user_id = u.id
           LEFT JOIN stk ON stk.user_id = u.id
          WHERE ${REAL()} AND ${SEARCH()} AND ${quizPlayers} AND ${playedCond}
            AND ${opt(f.regFrom, '::date', (p) => `${JOINED} >= ${p}`)}
            AND ${opt(f.regTo, '::date', (p) => `${JOINED} <= ${p}`)}
            AND ${opt(f.minPoints, '::float', (p) => `coalesce(att.points, 0) >= ${p}`)}
            AND ${opt(f.maxPoints, '::float', (p) => `coalesce(att.points, 0) <= ${p}`)}
            AND ${opt(f.minDays, '::int', (p) => `coalesce(att.days, 0) >= ${p}`)}
            AND ${opt(f.minStreak, '::int', (p) => `coalesce(stk.cur, 0) >= ${p}`)}
            AND ${opt(f.minBest, '::int', (p) => `coalesce(stk.best, 0) >= ${p}`)}
          ORDER BY ${order[f.sort] ?? order.points}
          LIMIT ${P.add(limit, '::int')} OFFSET ${P.add(offset, '::int')}`
  } else if (f.tab === 'attempts') {
    const s = start()
    const order: Record<string, string> = {
      latest: 'a.completed_at DESC NULLS LAST, a.id DESC',
      score: 'a.score DESC NULLS LAST, a.time_taken ASC NULLS LAST, a.id',
      time: 'a.time_taken ASC NULLS LAST, a.score DESC NULLS LAST, a.id',
    }
    sql = `SELECT a.id, u.name, u.phone, u.email, coalesce(q.quiz_title, '') AS quiz, a.round, a.score,
                  a.correct_answers, a.total_questions, a.time_taken, a.completed_at,
                  to_char(${DAY('a', s)}, 'YYYY-MM-DD') AS game_day, count(*) OVER()::int AS total
             FROM quiz_attempts a JOIN quiz_users u ON u.id = a.user_id LEFT JOIN quizzes q ON q.id = a.quiz_id
            WHERE ${REAL()} AND ${SEARCH()}
              AND ${opt(f.quizId, '::int', (p) => `a.quiz_id = ${p}`)}
              AND ${opt(f.from, '::date', (p) => `${DAY('a', s)} >= ${p}`)}
              AND ${opt(f.to, '::date', (p) => `${DAY('a', s)} <= ${p}`)}
              AND ${opt(f.round, '::int', (p) => `a.round = ${p}`)}
              AND ${opt(f.minScore, '::float', (p) => `a.score >= ${p}`)}
              AND ${opt(f.maxScore, '::float', (p) => `a.score <= ${p}`)}
            ORDER BY ${order[f.sort] ?? order.latest}
            LIMIT ${P.add(limit, '::int')} OFFSET ${P.add(offset, '::int')}`
  } else {
    const s = start()
    sql = `SELECT q.id, coalesce(q.quiz_title, 'Quiz ' || q.id) AS title, q.status, q.quiz_date, q.quiz_end_date,
                  q.rounds_per_day, q.questions_per_round,
                  (SELECT count(*) FROM quizzes_rels r WHERE r.parent_id = q.id AND r.path = 'questions')::int AS pool,
                  (SELECT count(*) FROM quizzes_rels r JOIN questions qq ON qq.id = r.questions_id
                    WHERE r.parent_id = q.id AND r.path = 'questions' AND qq._status = 'published')::int AS pool_live,
                  count(DISTINCT a.user_id)::int AS players, count(a.id)::int AS attempts,
                  round(avg(a.score)::numeric, 1)::float AS avg_score,
                  count(DISTINCT a.user_id) FILTER (WHERE ${DAY('a', s)} = ${P.add(ctx.today, '::date')})::int AS players_today,
                  count(*) OVER()::int AS total
             FROM quizzes q
             LEFT JOIN quiz_attempts a ON a.quiz_id = q.id
                  AND EXISTS (SELECT 1 FROM quiz_users u WHERE u.id = a.user_id AND ${REAL()})
            WHERE ${likeValue ? `q.quiz_title ILIKE ${P.add(likeValue, '::text')}` : 'TRUE'}
            GROUP BY q.id ORDER BY q.quiz_date DESC NULLS LAST, q.id DESC
            LIMIT ${P.add(limit, '::int')} OFFSET ${P.add(offset, '::int')}`
  }
  const rows = (await pool(payload).query(sql, P.vals)).rows
  return { rows, total: rows[0]?.total ?? 0 }
}

export type DashboardData = Awaited<ReturnType<typeof loadDashboard>>

export async function loadDashboard(payload: Payload, f: Filters) {
  const db = pool(payload)
  const ctx = await context(payload)

  // Header numbers and per-quiz counts (for the quiz pills)
  const P = new Params()
  const start = P.add(ctx.startMins, '::int')
  const tests = P.add(f.tests, '::bool')
  const tails = P.add(TEST_TAILS, '::text[]')
  const quiz = P.add(f.quizId, '::int')
  const today = P.add(ctx.today, '::date')
  const DAY = `((a.completed_at AT TIME ZONE 'Asia/Kolkata') - make_interval(mins => ${start}))::date`
  const REAL = `(${tests} OR right(regexp_replace(coalesce(u.phone, ''), '\\D', '', 'g'), 10) <> ALL(${tails}))`
  const [totals] = (
    await db.query(
      `SELECT
         (SELECT count(*) FROM quiz_users u WHERE ${REAL})::int AS players,
         (SELECT count(*) FROM quiz_users u WHERE ${REAL}
             AND (u.created_at AT TIME ZONE 'Asia/Kolkata')::date = ${today})::int AS joined_today,
         (SELECT count(*) FROM quiz_attempts a JOIN quiz_users u ON u.id = a.user_id
           WHERE ${REAL} AND (${quiz} IS NULL OR a.quiz_id = ${quiz}))::int AS attempts,
         (SELECT count(DISTINCT a.user_id) FROM quiz_attempts a JOIN quiz_users u ON u.id = a.user_id
           WHERE ${REAL} AND (${quiz} IS NULL OR a.quiz_id = ${quiz}) AND ${DAY} = ${today})::int AS played_today,
         (SELECT count(*) FROM quizzes)::int AS quizzes`,
      P.vals,
    )
  ).rows
  const Q = new Params()
  const qTests = Q.add(f.tests, '::bool')
  const qTails = Q.add(TEST_TAILS, '::text[]')
  const quizzes: { id: number; title: string; players: number; attempts: number }[] = (
    await db.query(
      `SELECT q.id, coalesce(q.quiz_title, 'Quiz ' || q.id) AS title,
              count(DISTINCT a.user_id)::int AS players, count(a.id)::int AS attempts
         FROM quizzes q
         LEFT JOIN quiz_attempts a ON a.quiz_id = q.id
              AND EXISTS (SELECT 1 FROM quiz_users u WHERE u.id = a.user_id
                          AND (${qTests} OR right(regexp_replace(coalesce(u.phone, ''), '\\D', '', 'g'), 10) <> ALL(${qTails})))
        GROUP BY q.id ORDER BY q.quiz_date DESC NULLS LAST, q.id DESC`,
      Q.vals,
    )
  ).rows

  const { rows, total } = await queryRows(payload, f, ctx, PAGE_SIZE, (f.page - 1) * PAGE_SIZE)
  return {
    today: ctx.today,
    dayStart: ctx.gd,
    totals: totals as { players: number; joined_today: number; attempts: number; played_today: number; quizzes: number },
    quizzes,
    rows,
    total,
    pages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  }
}

/** Everything matching the filters (for the Excel export). */
export async function loadAllRows(payload: Payload, f: Filters) {
  const ctx = await context(payload)
  return { ...(await queryRows(payload, f, ctx, EXPORT_LIMIT, 0)), today: ctx.today }
}
