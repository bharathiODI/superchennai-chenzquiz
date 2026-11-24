import type { Payload } from 'payload'

import { gameDayKey } from '@/utilities/gameDay'
import { getGameDaySettings } from '@/utilities/getGameTimers'
import { TEST_PLAYER_PHONES } from '@/utilities/testPlayers'

/**
 * Read-only queries behind the CMS Quiz Dashboard (players, attempts, quiz details).
 * Aggregated in SQL so it stays quick with thousands of players. Test players are left out
 * unless asked for. A game day is the India date of (time - day start), as in the game.
 */

export type Tab = 'players' | 'attempts' | 'quizzes'
export const PAGE_SIZE = 25

export type Filters = {
  tab: Tab
  quizId: number | null
  q: string
  day: string | null // YYYY-MM-DD, attempts only
  tests: boolean
  page: number
}

// Last 10 digits of the reserved test numbers (+91 00000 00001 ... 10)
const TEST_TAILS = TEST_PLAYER_PHONES.map((p) => p.replace(/\D/g, '').slice(-10))

type Pool = { query: (text: string, params?: unknown[]) => Promise<{ rows: any[] }> }
const pool = (payload: Payload): Pool => (payload.db as unknown as { pool: Pool }).pool

export function parseFilters(sp: Record<string, string | string[] | undefined> | undefined): Filters {
  const one = (k: string) => {
    const v = sp?.[k]
    return (Array.isArray(v) ? v[0] : v)?.trim() ?? ''
  }
  const tab = one('tab')
  const quiz = Number(one('quiz'))
  const day = one('day')
  const page = Number(one('page'))
  return {
    tab: tab === 'attempts' || tab === 'quizzes' ? tab : 'players',
    quizId: Number.isInteger(quiz) && quiz > 0 ? quiz : null,
    q: one('q').slice(0, 80),
    day: /^\d{4}-\d{2}-\d{2}$/.test(day) ? day : null,
    tests: one('tests') === '1',
    page: Number.isInteger(page) && page > 0 ? page : 1,
  }
}

export type DashboardData = Awaited<ReturnType<typeof loadDashboard>>

export async function loadDashboard(payload: Payload, f: Filters) {
  const db = pool(payload)
  const gd = await getGameDaySettings(payload)
  const startMins = gd.startHour * 60 + gd.startMinute
  const today = gameDayKey(new Date(), gd) ?? new Date().toISOString().slice(0, 10)

  // $1 = day start (minutes), $2 = include test players, $3 = test number tails
  const base = [startMins, f.tests, TEST_TAILS]
  const DAY = `((a.completed_at AT TIME ZONE 'Asia/Kolkata') - make_interval(mins => $1::int))::date`
  const REAL = `($2::bool OR right(regexp_replace(coalesce(u.phone, ''), '\\D', '', 'g'), 10) <> ALL($3::text[]))`

  // Header numbers and per-quiz counts (for the quiz pills)
  const [totals] = (
    await db.query(
      `SELECT
         (SELECT count(*) FROM quiz_users u WHERE ${REAL})::int AS players,
         (SELECT count(*) FROM quiz_attempts a JOIN quiz_users u ON u.id = a.user_id
           WHERE ${REAL} AND ($4::int IS NULL OR a.quiz_id = $4))::int AS attempts,
         (SELECT count(DISTINCT a.user_id) FROM quiz_attempts a JOIN quiz_users u ON u.id = a.user_id
           WHERE ${REAL} AND ($4::int IS NULL OR a.quiz_id = $4) AND ${DAY} = $5::date)::int AS played_today,
         (SELECT count(*) FROM quizzes)::int AS quizzes`,
      [...base, f.quizId, today],
    )
  ).rows
  const quizzes: { id: number; title: string; players: number; attempts: number }[] = (
    await db.query(
      `SELECT q.id, coalesce(q.quiz_title, 'Quiz ' || q.id) AS title,
              count(DISTINCT a.user_id)::int AS players, count(a.id)::int AS attempts
         FROM quizzes q
         LEFT JOIN quiz_attempts a ON a.quiz_id = q.id
              AND EXISTS (SELECT 1 FROM quiz_users u WHERE u.id = a.user_id AND ${REAL})
        WHERE $1::int IS NOT NULL -- (keeps the shared parameter list typed)
        GROUP BY q.id ORDER BY q.quiz_date DESC NULLS LAST, q.id DESC`,
      base,
    )
  ).rows

  const like = f.q ? `%${f.q.replace(/[%_\\]/g, (m) => '\\' + m)}%` : ''
  const offset = (f.page - 1) * PAGE_SIZE
  let rows: any[] = []

  if (f.tab === 'players') {
    rows = (
      await db.query(
        `WITH att AS (
           SELECT a.user_id, count(*)::int AS rounds, count(DISTINCT ${DAY})::int AS days,
                  coalesce(sum(a.score), 0)::float AS points, coalesce(sum(a.time_taken), 0)::float AS secs,
                  max(a.completed_at) AS last_at
             FROM quiz_attempts a WHERE ($4::int IS NULL OR a.quiz_id = $4) GROUP BY a.user_id)
         SELECT u.id, u.name, u.phone, u.email, u.created_at, coalesce(att.rounds, 0) AS rounds,
                coalesce(att.days, 0) AS days, coalesce(att.points, 0) AS points, coalesce(att.secs, 0) AS secs,
                att.last_at, count(*) OVER()::int AS total
           FROM quiz_users u LEFT JOIN att ON att.user_id = u.id
          WHERE ${REAL} AND ($4::int IS NULL OR att.user_id IS NOT NULL)
            AND ($5::text = '' OR u.name ILIKE $5 OR u.phone ILIKE $5 OR u.email ILIKE $5)
          ORDER BY points DESC, secs ASC, u.created_at ASC, u.id
          LIMIT $6 OFFSET $7`,
        [...base, f.quizId, like, PAGE_SIZE, offset],
      )
    ).rows
  } else if (f.tab === 'attempts') {
    rows = (
      await db.query(
        `SELECT a.id, u.name, u.phone, coalesce(q.quiz_title, '') AS quiz, a.round, a.score, a.correct_answers,
                a.total_questions, a.time_taken, a.completed_at, to_char(${DAY}, 'YYYY-MM-DD') AS game_day,
                count(*) OVER()::int AS total
           FROM quiz_attempts a JOIN quiz_users u ON u.id = a.user_id LEFT JOIN quizzes q ON q.id = a.quiz_id
          WHERE ${REAL} AND ($4::int IS NULL OR a.quiz_id = $4)
            AND ($5::text = '' OR u.name ILIKE $5 OR u.phone ILIKE $5 OR u.email ILIKE $5)
            AND ($6::date IS NULL OR ${DAY} = $6::date)
          ORDER BY a.completed_at DESC NULLS LAST, a.id DESC
          LIMIT $7 OFFSET $8`,
        [...base, f.quizId, like, f.day, PAGE_SIZE, offset],
      )
    ).rows
  } else {
    rows = (
      await db.query(
        `SELECT q.id, coalesce(q.quiz_title, 'Quiz ' || q.id) AS title, q.status, q.quiz_date, q.quiz_end_date,
                q.rounds_per_day, q.questions_per_round,
                (SELECT count(*) FROM quizzes_rels r WHERE r.parent_id = q.id AND r.path = 'questions')::int AS pool,
                (SELECT count(*) FROM quizzes_rels r JOIN questions qq ON qq.id = r.questions_id
                  WHERE r.parent_id = q.id AND r.path = 'questions' AND qq._status = 'published')::int AS pool_live,
                count(DISTINCT a.user_id)::int AS players, count(a.id)::int AS attempts,
                round(avg(a.score)::numeric, 1)::float AS avg_score,
                count(DISTINCT a.user_id) FILTER (WHERE ${DAY} = $4::date)::int AS players_today,
                count(*) OVER()::int AS total
           FROM quizzes q
           LEFT JOIN quiz_attempts a ON a.quiz_id = q.id
                AND EXISTS (SELECT 1 FROM quiz_users u WHERE u.id = a.user_id AND ${REAL})
          WHERE ($5::text = '' OR q.quiz_title ILIKE $5)
          GROUP BY q.id ORDER BY q.quiz_date DESC NULLS LAST, q.id DESC
          LIMIT $6 OFFSET $7`,
        [...base, today, like, PAGE_SIZE, offset],
      )
    ).rows
  }

  const total = rows[0]?.total ?? 0
  return {
    today,
    dayStart: gd,
    totals: totals as { players: number; attempts: number; played_today: number; quizzes: number },
    quizzes,
    rows,
    total,
    pages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  }
}
