import { getNow } from '@/utilities/clock'
import { activeQuizHealth } from '@/utilities/quizHealth'
import type { Payload } from 'payload'

import { gameDayKey } from '@/utilities/gameDay'
import { getGameDaySettings } from '@/utilities/getGameTimers'
import { TEST_PLAYER_PHONES } from '@/utilities/testPlayers'

/**
 * Read-only queries behind the CMS Quiz Dashboard (players, plays, questions, sponsor report,
 * flags, player detail) and its
 * "Export these rows" Excel file - both use the same filters, so the file always matches the
 * screen. Aggregated in SQL so it stays quick with thousands of players. Test players are left
 * out unless asked for. A game day is the India date of (time - day start), as in the game.
 * Streaks follow utilities/quizStreak: the current streak is alive if the last day played is
 * today or yesterday; best = longest run of consecutive game days.
 */

export type Tab = 'players' | 'plays' | 'questions' | 'sponsor' | 'flags' | 'player'
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
export const PLAY_SORTS = {
  latest: 'Latest first',
  score: 'Score (high to low)',
  time: 'Fastest first',
} as const
export const QUESTION_SORTS = {
  given: 'Most given',
  hardest: 'Hardest (fewest right)',
  easiest: 'Easiest (most right)',
  slowest: 'Slowest answers',
  newest: 'Newest first',
} as const
const DEFAULT_SORT: Record<Tab, string> = {
  players: 'points',
  plays: 'latest',
  questions: 'given',
  sponsor: 'latest',
  flags: 'latest',
  player: 'latest',
}
export const defaultSort = (t: Tab) => DEFAULT_SORT[t]

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
  /** plays */
  status: 'all' | 'finished' | 'open'
  flag: 'any' | 'flagged' | 'tooFast' | 'linked'
  minScore: number | null
  maxScore: number | null
  /** questions */
  useIn: 'any' | 'general' | 'sponsored' | 'both' | 'none'
  /** player detail */
  playerId: number | null
  sort: string
}

// Last 10 digits of the reserved test numbers (+91 00000 00001 ... 10)
const TEST_TAILS = TEST_PLAYER_PHONES.map((p) => p.replace(/\D/g, '').slice(-10))

type Pool = { query: (text: string, params?: unknown[]) => Promise<{ rows: any[] }> }
const pool = (payload: Payload): Pool => (payload.db as unknown as { pool: Pool }).pool

const DATE = /^\d{4}-\d{2}-\d{2}$/

export function parseFilters(
  sp: Record<string, string | string[] | undefined> | undefined,
): Filters {
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
  // Old links: tab=attempts is now Plays, tab=quizzes is gone
  const t: Tab =
    tab === 'attempts'
      ? 'plays'
      : (['plays', 'questions', 'sponsor', 'flags', 'player'] as string[]).includes(tab)
        ? (tab as Tab)
        : 'players'
  const sorts: Record<string, string> =
    t === 'plays'
      ? PLAY_SORTS
      : t === 'questions'
        ? QUESTION_SORTS
        : t === 'players'
          ? PLAYER_SORTS
          : { latest: 'Latest first' }
  const status = one('status')
  const flag = one('flag')
  const useIn = one('useIn')
  const player = Number(one('player'))
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
    status: status === 'finished' || status === 'open' ? status : 'all',
    flag: flag === 'flagged' || flag === 'tooFast' || flag === 'linked' ? flag : 'any',
    minScore: num('minScore'),
    maxScore: num('maxScore'),
    useIn: (['general', 'sponsored', 'both', 'none'] as string[]).includes(useIn)
      ? (useIn as Filters['useIn'])
      : 'any',
    playerId: Number.isInteger(player) && player > 0 ? player : null,
    sort: sorts[one('sort')] ? one('sort') : DEFAULT_SORT[t],
  }
}

/** The filters as URL parameters (defaults left out) - for links, paging and the export. */
export function filterParams(f: Filters, change: Partial<Filters> = {}): URLSearchParams {
  const n = { ...f, ...change }
  const p = new URLSearchParams()
  const put = (k: string, v: unknown) => {
    if (v !== null && v !== undefined && v !== '' && v !== false)
      p.set(k, String(v === true ? 1 : v))
  }
  if (n.tab !== 'players') p.set('tab', n.tab)
  put('quiz', n.quizId)
  put('q', n.q)
  put('tests', n.tests)
  if (n.tab !== 'questions' || n.from || n.to) {
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
  if (n.tab === 'plays') {
    if (n.status !== 'all') p.set('status', n.status)
    if (n.flag !== 'any') p.set('flag', n.flag)
    put('minScore', n.minScore)
    put('maxScore', n.maxScore)
    if (n.sort !== 'latest') p.set('sort', n.sort)
  }
  if (n.tab === 'flags' && n.flag !== 'any' && n.flag !== 'flagged') p.set('flag', n.flag)
  if (n.tab === 'questions') {
    if (n.useIn !== 'any') p.set('useIn', n.useIn)
    if (n.sort !== 'given') p.set('sort', n.sort)
  }
  if (n.tab === 'player') put('player', n.playerId)
  if (n.page > 1) p.set('page', String(n.page))
  return p
}

/** Plain-language list of the filters in use (shown above the table and in the Excel file). */
export function describeFilters(f: Filters, quizTitle?: string): string[] {
  const out: string[] = []
  const range = (a: string | null, b: string | null) =>
    a && b ? (a === b ? a : `${a} to ${b}`) : a ? `from ${a}` : `until ${b}`
  if (quizTitle) out.push(`Quiz: ${quizTitle}`)
  if (f.from || f.to) out.push(`Game days: ${range(f.from, f.to)}`)
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
  if (f.tab === 'plays') {
    if (f.status === 'finished') out.push('Finished plays')
    if (f.status === 'open') out.push('Opened, not finished')
    if (f.flag === 'flagged') out.push('Flagged')
    if (f.minScore !== null) out.push(`Score ≥ ${f.minScore}`)
    if (f.maxScore !== null) out.push(`Score ≤ ${f.maxScore}`)
  }
  if ((f.tab === 'plays' || f.tab === 'flags') && f.flag === 'tooFast') out.push('Too fast')
  if ((f.tab === 'plays' || f.tab === 'flags') && f.flag === 'linked') out.push('Linked numbers')
  if (f.tab === 'questions' && f.useIn !== 'any') out.push(`Use in: ${f.useIn}`)
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

async function context(
  payload: Payload,
): Promise<Ctx & { gd: Awaited<ReturnType<typeof getGameDaySettings>> }> {
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
      f.played === 'yes'
        ? 'att.user_id IS NOT NULL'
        : f.played === 'no'
          ? 'att.user_id IS NULL'
          : 'TRUE'
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
           -- Days played and streaks: the game day saved on each finished play (quiz_rounds.day),
           -- not the finish time (the day start was 8 AM until 23 Nov). Players without any saved
           -- play (very old data) fall back to the finish time.
           rd AS (SELECT r.user_id, NULLIF(r.day, '')::date AS d FROM quiz_rounds r
                   WHERE r.status = 'completed' AND ${quizCond('r')} AND NULLIF(r.day, '') IS NOT NULL),
           pd AS (SELECT DISTINCT user_id, d FROM rd
                  UNION
                  SELECT DISTINCT a.user_id, ${DAY('a', s)} FROM quiz_attempts a
                   WHERE ${quizCond('a')} AND a.completed_at IS NOT NULL
                     AND NOT EXISTS (SELECT 1 FROM rd WHERE rd.user_id = a.user_id)),
           dp AS (SELECT user_id, count(*)::int AS days FROM pd
                   WHERE ${[opt(f.from, '::date', (p) => `d >= ${p}`), opt(f.to, '::date', (p) => `d <= ${p}`)].join(' AND ')}
                   GROUP BY user_id),
           isl AS (SELECT user_id, d, d - (row_number() OVER (PARTITION BY user_id ORDER BY d))::int AS g FROM pd),
           runs AS (SELECT user_id, count(*)::int AS len, max(d) AS last_d FROM isl GROUP BY user_id, g),
           stk AS (SELECT user_id, max(len)::int AS best,
                          coalesce(max(len) FILTER (WHERE last_d >= ${P.add(ctx.today, '::date')} - 1), 0)::int AS cur
                     FROM runs GROUP BY user_id)
         SELECT u.id, u.name, u.phone, u.email, u.created_at,
                coalesce(att.rounds, 0) AS rounds, coalesce(dp.days, 0) AS days,
                coalesce(att.points, 0) AS points, coalesce(att.secs, 0) AS secs, att.last_at,
                coalesce(stk.cur, 0) AS streak, coalesce(stk.best, 0) AS best,
                count(*) OVER()::int AS total
           FROM quiz_users u
           LEFT JOIN att ON att.user_id = u.id
           LEFT JOIN dp ON dp.user_id = u.id
           LEFT JOIN stk ON stk.user_id = u.id
          WHERE ${REAL()} AND ${SEARCH()} AND ${quizPlayers} AND ${playedCond}
            AND ${opt(f.regFrom, '::date', (p) => `${JOINED} >= ${p}`)}
            AND ${opt(f.regTo, '::date', (p) => `${JOINED} <= ${p}`)}
            AND ${opt(f.minPoints, '::float', (p) => `coalesce(att.points, 0) >= ${p}`)}
            AND ${opt(f.maxPoints, '::float', (p) => `coalesce(att.points, 0) <= ${p}`)}
            AND ${opt(f.minDays, '::int', (p) => `coalesce(dp.days, 0) >= ${p}`)}
            AND ${opt(f.minStreak, '::int', (p) => `coalesce(stk.cur, 0) >= ${p}`)}
            AND ${opt(f.minBest, '::int', (p) => `coalesce(stk.best, 0) >= ${p}`)}
          ORDER BY ${order[f.sort] ?? order.points}
          LIMIT ${P.add(limit, '::int')} OFFSET ${P.add(offset, '::int')}`
  } else if (f.tab === 'plays' || f.tab === 'flags') {
    // One row per play (quiz_rounds): finished or opened-not-finished, with flags
    const order: Record<string, string> = {
      latest: 'coalesce(r.completed_at, r.created_at) DESC, r.id DESC',
      score: 'r.score DESC NULLS LAST, r.time_taken ASC NULLS LAST, r.id',
      time: 'r.time_taken ASC NULLS LAST, r.score DESC NULLS LAST, r.id',
    }
    const flags =
      f.tab === 'flags' && f.flag === 'any'
        ? '(coalesce(r.too_fast, false) OR coalesce(r.linked, false))'
        : f.flag === 'flagged'
          ? '(coalesce(r.too_fast, false) OR coalesce(r.linked, false))'
          : f.flag === 'tooFast'
            ? 'coalesce(r.too_fast, false)'
            : f.flag === 'linked'
              ? 'coalesce(r.linked, false)'
              : 'TRUE'
    const statusCond =
      f.tab === 'plays' && f.status === 'finished'
        ? "r.status = 'completed'"
        : f.tab === 'plays' && f.status === 'open'
          ? "r.status <> 'completed'"
          : 'TRUE'
    sql = `SELECT r.id, u.id AS user_id, u.name, u.phone, u.email, coalesce(u.disqualified, false) AS disqualified,
                  coalesce(q.quiz_title, '') AS quiz, r.day AS game_day, r.status, r.score, r.correct_answers,
                  (SELECT count(*) FROM quiz_rounds_rels rel WHERE rel.parent_id = r.id AND rel.path = 'questions')::int AS questions,
                  r.time_taken, coalesce(r.too_fast, false) AS too_fast, coalesce(r.linked, false) AS linked,
                  r.device_id, r.ip, r.completed_at, r.created_at, coalesce(r.recycled, 0)::int AS recycled,
                  ${
                    f.tab === 'flags'
                      ? `(SELECT string_agg(DISTINCT coalesce(u2.name, '?') || ' ' || coalesce(u2.phone, ''), ', ')
                            FROM quiz_rounds r2 JOIN quiz_users u2 ON u2.id = r2.user_id
                           WHERE r.device_id IS NOT NULL AND r2.device_id = r.device_id AND r2.user_id <> r.user_id)`
                      : 'NULL'
                  } AS same_device,
                  count(*) OVER()::int AS total
             FROM quiz_rounds r JOIN quiz_users u ON u.id = r.user_id LEFT JOIN quizzes q ON q.id = r.quiz_id
            WHERE ${REAL()} AND ${SEARCH()} AND ${flags} AND ${statusCond}
              AND ${opt(f.quizId, '::int', (p) => `r.quiz_id = ${p}`)}
              AND ${opt(f.from, '::text', (p) => `r.day >= ${p}`)}
              AND ${opt(f.to, '::text', (p) => `r.day <= ${p}`)}
              AND ${opt(f.tab === 'plays' ? f.minScore : null, '::float', (p) => `r.score >= ${p}`)}
              AND ${opt(f.tab === 'plays' ? f.maxScore : null, '::float', (p) => `r.score <= ${p}`)}
            ORDER BY ${order[f.sort] ?? order.latest}
            LIMIT ${P.add(limit, '::int')} OFFSET ${P.add(offset, '::int')}`
  } else if (f.tab === 'questions') {
    // Per question: how often it was given, answered, right, timed out, and how fast
    const s = f.from || f.to ? start() : '0' // the day start is only needed with dates
    const ADAY = `((a.answered_at AT TIME ZONE 'Asia/Kolkata') - make_interval(mins => ${s}))::date`
    const order: Record<string, string> = {
      given: 'given DESC, qq.id DESC',
      hardest: 'pct ASC NULLS LAST, answered DESC, qq.id',
      easiest: 'pct DESC NULLS LAST, answered DESC, qq.id',
      slowest: 'secs DESC NULLS LAST, qq.id',
      newest: 'qq.created_at DESC, qq.id DESC',
    }
    const realUser = `EXISTS (SELECT 1 FROM quiz_users u WHERE u.id = %s AND ${REAL()})`
    sql = `WITH given AS (
             SELECT rel.questions_id AS qid, count(*)::int AS n, max(r.day) AS last_day
               FROM quiz_rounds_rels rel JOIN quiz_rounds r ON r.id = rel.parent_id
              WHERE rel.path = 'questions' AND ${realUser.replace('%s', 'r.user_id')}
                AND ${opt(f.from, '::text', (p) => `r.day >= ${p}`)} AND ${opt(f.to, '::text', (p) => `r.day <= ${p}`)}
              GROUP BY 1),
           ans AS (
             SELECT a.question_id AS qid, count(*)::int AS n, count(*) FILTER (WHERE a.correct)::int AS ok,
                    count(*) FILTER (WHERE a.timed_out)::int AS late,
                    avg(a.seconds) FILTER (WHERE NOT coalesce(a.timed_out, false))::float AS secs
               FROM quiz_answers a
              WHERE ${realUser.replace('%s', 'a.user_id')}
                AND ${opt(f.from, '::date', (p) => `${ADAY} >= ${p}`)} AND ${opt(f.to, '::date', (p) => `${ADAY} <= ${p}`)}
              GROUP BY 1)
           SELECT qq.id, coalesce(qq.question_title, qq.title) AS question, qq.use_in, qq._status AS status,
                  coalesce(z.quiz_title, '') AS quiz, coalesce(given.n, 0) AS given, given.last_day,
                  coalesce(ans.n, 0) AS answered, coalesce(ans.ok, 0) AS correct, coalesce(ans.late, 0) AS timeouts,
                  round(ans.secs::numeric, 1)::float AS secs,
                  CASE WHEN ans.n > 0 THEN round(100.0 * ans.ok / ans.n)::int END AS pct,
                  count(*) OVER()::int AS total
             FROM questions qq
             LEFT JOIN quizzes z ON z.id = qq.quiz_id
             LEFT JOIN given ON given.qid = qq.id
             LEFT JOIN ans ON ans.qid = qq.id
            WHERE ${opt(f.quizId, '::int', (p) => `qq.quiz_id = ${p}`)}
              AND ${f.useIn !== 'any' ? `qq.use_in::text = ${P.add(f.useIn, '::text')}` : 'TRUE'}
              AND ${likeValue ? `(qq.title ILIKE ${P.add(likeValue, '::text')} OR qq.question_title ILIKE ${P.add(likeValue, '::text')})` : 'TRUE'}
            ORDER BY ${order[f.sort] ?? order.given}
            LIMIT ${P.add(limit, '::int')} OFFSET ${P.add(offset, '::int')}`
  } else if (f.tab === 'sponsor') {
    // The daily sponsor report: answers given in sponsored slots, per game day
    const s = start()
    const ADAY = `((a.answered_at AT TIME ZONE 'Asia/Kolkata') - make_interval(mins => ${s}))::date`
    sql = `SELECT to_char(${ADAY}, 'YYYY-MM-DD') AS game_day, count(*)::int AS answered,
                  count(DISTINCT a.user_id)::int AS players, count(*) FILTER (WHERE a.correct)::int AS correct,
                  count(*) FILTER (WHERE a.timed_out)::int AS timeouts, count(DISTINCT a.question_id)::int AS questions,
                  round((avg(a.seconds) FILTER (WHERE NOT coalesce(a.timed_out, false)))::numeric, 1)::float AS secs,
                  round(100.0 * count(*) FILTER (WHERE a.correct) / count(*))::int AS pct,
                  count(*) OVER()::int AS total
             FROM quiz_answers a JOIN quiz_users u ON u.id = a.user_id
            WHERE a.sponsored AND ${REAL()} AND ${SEARCH()}
              AND ${opt(f.quizId, '::int', (p) => `a.quiz_id = ${p}`)}
              AND ${opt(f.from, '::date', (p) => `${ADAY} >= ${p}`)}
              AND ${opt(f.to, '::date', (p) => `${ADAY} <= ${p}`)}
            GROUP BY 1 ORDER BY 1 DESC
            LIMIT ${P.add(limit, '::int')} OFFSET ${P.add(offset, '::int')}`
  } else {
    return { rows: [], total: 0 }
  }
  const rows = (await pool(payload).query(sql, P.vals)).rows
  return { rows, total: rows[0]?.total ?? 0 }
}

export type DashboardData = Awaited<ReturnType<typeof loadDashboard>>

export async function loadDashboard(payload: Payload, f: Filters) {
  const db = pool(payload)
  const ctx = await context(payload)

  // Header numbers (they follow the quiz pill) and the data check
  const P = new Params()
  const tests = P.add(f.tests, '::bool')
  const tails = P.add(TEST_TAILS, '::text[]')
  const quiz = P.add(f.quizId, '::int')
  const today = P.add(ctx.today, '::text')
  const REAL = `(${tests} OR right(regexp_replace(coalesce(u.phone, ''), '\\D', '', 'g'), 10) <> ALL(${tails}))`
  const PLAYS = `quiz_rounds r JOIN quiz_users u ON u.id = r.user_id`
  const Q = `(${quiz} IS NULL OR r.quiz_id = ${quiz})`
  const [totals] = (
    await db.query(
      `SELECT
         (SELECT count(*) FROM quiz_users u WHERE ${REAL})::int AS players,
         (SELECT count(*) FROM quiz_users u WHERE ${REAL}
             AND (u.created_at AT TIME ZONE 'Asia/Kolkata')::date = ${today}::date)::int AS joined_today,
         (SELECT count(*) FROM ${PLAYS} WHERE ${REAL} AND ${Q} AND r.status = 'completed')::int AS plays,
         (SELECT count(DISTINCT r.user_id) FROM ${PLAYS} WHERE ${REAL} AND ${Q} AND r.status = 'completed' AND r.day = ${today})::int AS played_today,
         (SELECT count(*) FROM ${PLAYS} WHERE ${REAL} AND ${Q} AND r.status <> 'completed' AND r.day = ${today})::int AS open_today,
         (SELECT count(*) FROM ${PLAYS} WHERE ${REAL} AND ${Q} AND (coalesce(r.too_fast, false) OR coalesce(r.linked, false)))::int AS flagged,
         (SELECT count(*) FROM questions qq WHERE (${quiz} IS NULL OR qq.quiz_id = ${quiz}))::int AS questions,
         (SELECT count(DISTINCT ${ADAY_SQL(ctx.startMins)}) FROM quiz_answers a WHERE a.sponsored AND (${quiz} IS NULL OR a.quiz_id = ${quiz}))::int AS sponsor_days,
         -- data check: saved totals vs the sum of finished plays (attempts), and finished plays without their summary row
         (SELECT count(*) FROM quiz_users u LEFT JOIN (SELECT user_id, sum(score) s FROM quiz_attempts GROUP BY 1) x ON x.user_id = u.id
           WHERE coalesce(u.total_x_p, 0) <> coalesce(x.s, 0))::int AS total_mismatch,
         (SELECT count(*) FROM quiz_rounds r WHERE r.status = 'completed' AND r.slots IS NOT NULL
             AND NOT EXISTS (SELECT 1 FROM quiz_attempts a WHERE a.user_id = r.user_id AND a.quiz_id = r.quiz_id AND a.completed_at = r.completed_at))::int AS missing_summary`,
      P.vals,
    )
  ).rows
  const Q2 = new Params()
  const qTests = Q2.add(f.tests, '::bool')
  const qTails = Q2.add(TEST_TAILS, '::text[]')
  const quizzes: {
    id: number
    title: string
    players: number
    plays: number
    questions: number
  }[] = (
    await db.query(
      `SELECT q.id, coalesce(q.quiz_title, 'Quiz ' || q.id) AS title,
              count(DISTINCT r.user_id)::int AS players, count(r.id) FILTER (WHERE r.status = 'completed')::int AS plays,
              (SELECT count(*) FROM questions qq WHERE qq.quiz_id = q.id)::int AS questions
         FROM quizzes q
         LEFT JOIN quiz_rounds r ON r.quiz_id = q.id
              AND EXISTS (SELECT 1 FROM quiz_users u WHERE u.id = r.user_id
                          AND (${qTests} OR right(regexp_replace(coalesce(u.phone, ''), '\\D', '', 'g'), 10) <> ALL(${qTails})))
        GROUP BY q.id ORDER BY q.quiz_date DESC NULLS LAST, q.id DESC`,
      Q2.vals,
    )
  ).rows

  const { rows, total } =
    f.tab === 'player'
      ? { rows: [], total: 0 }
      : await queryRows(payload, f, ctx, PAGE_SIZE, (f.page - 1) * PAGE_SIZE)
  return {
    today: ctx.today,
    dayStart: ctx.gd,
    health: await activeQuizHealth(payload, await getNow(payload)),
    totals: totals as {
      players: number
      joined_today: number
      plays: number
      played_today: number
      open_today: number
      flagged: number
      questions: number
      sponsor_days: number
      total_mismatch: number
      missing_summary: number
    },
    quizzes,
    rows,
    total,
    pages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    player: f.tab === 'player' && f.playerId ? await loadPlayer(payload, f.playerId) : null,
  }
}

const ADAY_SQL = (startMins: number) =>
  `((a.answered_at AT TIME ZONE 'Asia/Kolkata') - make_interval(mins => ${Math.round(startMins)}))::date`

/** One player: who they are, and every play with each question and answer. */
export async function loadPlayer(payload: Payload, id: number) {
  const db = pool(payload)
  const [user] = (
    await db.query(
      `SELECT u.id, u.name, u.phone, u.email, u.created_at, coalesce(u.total_x_p, 0)::float AS total_xp,
              coalesce(u.total_time_taken, 0)::float AS total_time, coalesce(u.disqualified, false) AS disqualified,
              (SELECT count(*) FROM quiz_attempts a WHERE a.user_id = u.id)::int AS finished,
              (SELECT coalesce(sum(score), 0) FROM quiz_attempts a WHERE a.user_id = u.id)::float AS attempts_xp
         FROM quiz_users u WHERE u.id = $1`,
      [id],
    )
  ).rows
  if (!user) return null
  const lines = (
    await db.query(
      `SELECT r.id AS round_id, r.day, r.status, r.score, r.time_taken, coalesce(r.too_fast, false) AS too_fast,
              coalesce(r.linked, false) AS linked, r.device_id, r.completed_at, coalesce(z.quiz_title, '') AS quiz, r.slots,
              rel."order" AS pos, qq.id AS question_id, coalesce(qq.question_title, qq.title, '(deleted question)') AS question,
              a.answer, a.correct, a.timed_out, a.points, a.speed_bonus, a.seconds, a.sponsored
         FROM quiz_rounds r
         LEFT JOIN quizzes z ON z.id = r.quiz_id
         JOIN quiz_rounds_rels rel ON rel.parent_id = r.id AND rel.path = 'questions'
         LEFT JOIN questions qq ON qq.id = rel.questions_id
         LEFT JOIN quiz_answers a ON a.round_id = r.id AND a.question_id = rel.questions_id
        WHERE r.user_id = $1
        ORDER BY r.day DESC, r.round DESC, rel."order"`,
      [id],
    )
  ).rows
  const plays: any[] = []
  for (const l of lines) {
    let p = plays[plays.length - 1]
    if (!p || p.round_id !== l.round_id) {
      p = { ...l, answers: [] }
      plays.push(p)
    }
    p.answers.push(l)
  }
  return { user, plays }
}

/** Everything matching the filters (for the Excel export). */
export async function loadAllRows(payload: Payload, f: Filters) {
  const ctx = await context(payload)
  return { ...(await queryRows(payload, f, ctx, EXPORT_LIMIT, 0)), today: ctx.today }
}
