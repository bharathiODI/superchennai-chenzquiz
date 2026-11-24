import type { AdminViewServerProps } from 'payload'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import { redirect } from 'next/navigation'
import React from 'react'

import { REPORT_READERS, cmsRole, userHas } from '@/access/roles'
import { formatStartHour } from '@/utilities/gameDay'

import { type Filters, PAGE_SIZE, loadDashboard, parseFilters } from './data'

/**
 * Quiz Dashboard (/admin/quiz-dashboard): players, attempts and quiz details, read-only, with an
 * Excel export. For Super Admins, Administrators, Editors and Viewers; a Viewer sees only this.
 * Plain links and a GET form - no client code, nothing here can change data.
 */

const IST = 'Asia/Kolkata'
const fmtDateTime = (v: unknown) =>
  v
    ? new Intl.DateTimeFormat('en-IN', {
        timeZone: IST,
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }).format(new Date(String(v)))
    : '-'
const fmtDate = (v: unknown) =>
  v
    ? new Intl.DateTimeFormat('en-IN', { timeZone: IST, day: '2-digit', month: 'short', year: 'numeric' }).format(
        new Date(String(v)),
      )
    : '-'
const fmtDay = (ymd: string) => fmtDate(`${ymd}T12:00:00+05:30`)
const fmtSecs = (s: unknown) => {
  const n = Math.round(Number(s) || 0)
  return n >= 60 ? `${Math.floor(n / 60)}m ${n % 60}s` : `${n}s`
}
const num = (v: unknown) => new Intl.NumberFormat('en-IN').format(Number(v) || 0)

function href(f: Filters, change: Partial<Filters>) {
  const n = { ...f, page: 1, ...change }
  const p = new URLSearchParams()
  if (n.tab !== 'players') p.set('tab', n.tab)
  if (n.quizId) p.set('quiz', String(n.quizId))
  if (n.q) p.set('q', n.q)
  if (n.day && n.tab === 'attempts') p.set('day', n.day)
  if (n.tests) p.set('tests', '1')
  if (n.page > 1) p.set('page', String(n.page))
  const s = p.toString()
  return `/admin/quiz-dashboard${s ? `?${s}` : ''}`
}

export async function QuizDashboardView({ initPageResult, params, searchParams }: AdminViewServerProps) {
  const { req, permissions, visibleEntities, locale } = initPageResult
  const user = req.user
  if (!user) redirect('/admin/login?redirect=%2Fadmin%2Fquiz-dashboard')

  const template = (children: React.ReactNode) => (
    <DefaultTemplate
      i18n={req.i18n}
      locale={locale}
      params={params}
      payload={req.payload}
      permissions={permissions}
      searchParams={searchParams}
      user={user || undefined}
      visibleEntities={visibleEntities}
    >
      <Gutter>{children}</Gutter>
    </DefaultTemplate>
  )

  if (!userHas(user, REPORT_READERS)) {
    return template(
      <div className="qd">
        <div className="qd-card qd-head">
          <h1 className="qd-title">Quiz Dashboard</h1>
          <p className="qd-sub">Your role doesn&apos;t include the quiz dashboard. Ask a Super Admin.</p>
        </div>
      </div>,
    )
  }

  const f = parseFilters(searchParams as Record<string, string>)
  const d = await loadDashboard(req.payload, f)
  const exportHref = `/api/reports/scores?${new URLSearchParams({
    ...(f.quizId ? { quiz: String(f.quizId) } : {}),
    ...(f.tests ? { test: '1' } : {}),
  })}`
  const tabs: { id: Filters['tab']; label: string; count: number }[] = [
    { id: 'players', label: 'Players', count: d.totals.players },
    { id: 'attempts', label: 'Attempts', count: d.totals.attempts },
    { id: 'quizzes', label: 'Quiz details', count: d.totals.quizzes },
  ]
  const from = d.total ? (f.page - 1) * PAGE_SIZE + 1 : 0
  const to = Math.min(d.total, f.page * PAGE_SIZE)
  const quizCount = (q: (typeof d.quizzes)[number]) => (f.tab === 'attempts' ? q.attempts : q.players)

  return template(
    <div className="qd">
      <div className="qd-card qd-head">
        <div>
          <div className="qd-eyebrow">Quiz reports{cmsRole(user) === 'viewer' ? ' · view only' : ''}</div>
          <h1 className="qd-title">Quiz Dashboard</h1>
          <p className="qd-sub">
            Players, attempts and quiz details. Today&apos;s game day: {fmtDay(d.today)} (starts{' '}
            {formatStartHour(d.dayStart)} India time).
          </p>
        </div>
        <div className="qd-head__right">
          <div className="qd-stat">
            <b>{num(d.totals.players)}</b>
            <span>Players</span>
          </div>
          <div className="qd-stat">
            <b>{num(d.totals.played_today)}</b>
            <span>Played today</span>
          </div>
          <div className="qd-stat">
            <b>{num(d.totals.attempts)}</b>
            <span>Finished rounds</span>
          </div>
          <a className="qd-export" href={exportHref}>
            Export to Excel
          </a>
        </div>
      </div>

      <nav className="qd-pills" aria-label="Report">
        {tabs.map((t) => (
          <a
            key={t.id}
            className={`qd-pill${f.tab === t.id ? ' is-active' : ''}`}
            href={href(f, { tab: t.id, day: null })}
          >
            {t.label} <span className="qd-count">{num(t.count)}</span>
          </a>
        ))}
      </nav>

      {f.tab !== 'quizzes' && (
        <nav className="qd-pills qd-pills--sub" aria-label="Quiz">
          <a className={`qd-pill${!f.quizId ? ' is-active' : ''}`} href={href(f, { quizId: null })}>
            All quizzes
          </a>
          {d.quizzes.map((q) => (
            <a
              key={q.id}
              className={`qd-pill${f.quizId === q.id ? ' is-active' : ''}`}
              href={href(f, { quizId: q.id })}
            >
              {q.title} <span className="qd-count">{num(quizCount(q))}</span>
            </a>
          ))}
        </nav>
      )}

      <form className="qd-filters" method="get" action="/admin/quiz-dashboard">
        {f.tab !== 'players' && <input type="hidden" name="tab" value={f.tab} />}
        {f.quizId && <input type="hidden" name="quiz" value={f.quizId} />}
        <input
          className="qd-input"
          type="search"
          name="q"
          defaultValue={f.q}
          placeholder={f.tab === 'quizzes' ? 'Search quiz title' : 'Search name, phone or email'}
        />
        {f.tab === 'attempts' && (
          <label className="qd-day">
            Game day <input className="qd-input" type="date" name="day" defaultValue={f.day ?? ''} />
          </label>
        )}
        <label className="qd-check">
          <input type="checkbox" name="tests" value="1" defaultChecked={f.tests} /> Include test players
        </label>
        <button className="qd-btn" type="submit">
          Filter
        </button>
        {(f.q || f.day || f.tests) && (
          <a className="qd-reset" href={href(f, { q: '', day: null, tests: false })}>
            Clear
          </a>
        )}
      </form>

      <div className="qd-card qd-table-wrap">
        <table className="qd-table">
          <thead>
            {f.tab === 'players' && (
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th className="r">Days played</th>
                <th className="r">Rounds</th>
                <th className="r">Points</th>
                <th className="r">Time</th>
                <th>Last played</th>
                <th>Joined</th>
              </tr>
            )}
            {f.tab === 'attempts' && (
              <tr>
                <th>ID</th>
                <th>Player</th>
                <th>Phone</th>
                <th>Quiz</th>
                <th>Game day</th>
                <th className="r">Round</th>
                <th className="r">Score</th>
                <th className="r">Correct</th>
                <th className="r">Time</th>
                <th>Finished at</th>
              </tr>
            )}
            {f.tab === 'quizzes' && (
              <tr>
                <th>ID</th>
                <th>Quiz</th>
                <th>Status</th>
                <th>Starts</th>
                <th>Ends</th>
                <th className="r">Rounds × questions a day</th>
                <th className="r">Question pool (published)</th>
                <th className="r">Players</th>
                <th className="r">Played today</th>
                <th className="r">Finished rounds</th>
                <th className="r">Avg score</th>
              </tr>
            )}
          </thead>
          <tbody>
            {d.rows.length === 0 && (
              <tr>
                <td className="qd-empty" colSpan={11}>
                  Nothing to show for these filters.
                </td>
              </tr>
            )}
            {f.tab === 'players' &&
              d.rows.map((r, i) => (
                <tr key={r.id}>
                  <td className="muted">{from + i}</td>
                  <td className="strong">{r.name || '-'}</td>
                  <td>{r.phone || '-'}</td>
                  <td>{r.email || '-'}</td>
                  <td className="r">{num(r.days)}</td>
                  <td className="r">{num(r.rounds)}</td>
                  <td className="r strong">{num(r.points)}</td>
                  <td className="r">{fmtSecs(r.secs)}</td>
                  <td>{fmtDateTime(r.last_at)}</td>
                  <td>{fmtDate(r.created_at)}</td>
                </tr>
              ))}
            {f.tab === 'attempts' &&
              d.rows.map((r) => (
                <tr key={r.id}>
                  <td className="muted">#{r.id}</td>
                  <td className="strong">{r.name || '-'}</td>
                  <td>{r.phone || '-'}</td>
                  <td>{r.quiz || '-'}</td>
                  <td>{r.game_day ? fmtDay(r.game_day) : '-'}</td>
                  <td className="r">{num(r.round)}</td>
                  <td className="r strong">{num(r.score)}</td>
                  <td className="r">
                    {num(r.correct_answers)} / {num(r.total_questions)}
                  </td>
                  <td className="r">{fmtSecs(r.time_taken)}</td>
                  <td>{fmtDateTime(r.completed_at)}</td>
                </tr>
              ))}
            {f.tab === 'quizzes' &&
              d.rows.map((r) => (
                <tr key={r.id}>
                  <td className="muted">#{r.id}</td>
                  <td className="strong">
                    <a href={href(f, { tab: 'players', quizId: r.id, q: '' })}>{r.title}</a>
                  </td>
                  <td>
                    <span className={`qd-badge qd-badge--${r.status || 'draft'}`}>{r.status || 'draft'}</span>
                  </td>
                  <td>{fmtDateTime(r.quiz_date)}</td>
                  <td>{fmtDateTime(r.quiz_end_date)}</td>
                  <td className="r">
                    {num(r.rounds_per_day)} × {num(r.questions_per_round)}
                  </td>
                  <td className="r">
                    {num(r.pool)} ({num(r.pool_live)})
                  </td>
                  <td className="r">{num(r.players)}</td>
                  <td className="r">{num(r.players_today)}</td>
                  <td className="r">{num(r.attempts)}</td>
                  <td className="r">{r.avg_score ?? '-'}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="qd-pager">
        <span>
          {d.total ? `Showing ${num(from)}–${num(to)} of ${num(d.total)}` : 'No rows'}
        </span>
        <span className="qd-pager__links">
          {f.page > 1 ? <a href={href(f, { page: f.page - 1 })}>‹ Previous</a> : <span className="off">‹ Previous</span>}
          <span>
            Page {f.page} of {d.pages}
          </span>
          {f.page < d.pages ? <a href={href(f, { page: f.page + 1 })}>Next ›</a> : <span className="off">Next ›</span>}
        </span>
      </div>
    </div>,
  )
}
