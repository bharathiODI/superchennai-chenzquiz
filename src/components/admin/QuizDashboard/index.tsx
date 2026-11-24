import type { AdminViewServerProps } from 'payload'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import { redirect } from 'next/navigation'
import React from 'react'

import { REPORT_READERS, cmsRole, userHas } from '@/access/roles'
import { formatStartHour } from '@/utilities/gameDay'

import {
  ATTEMPT_SORTS,
  type Filters,
  PAGE_SIZE,
  PLAYER_SORTS,
  describeFilters,
  filterParams,
  loadDashboard,
  parseFilters,
} from './data'

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
  const p = filterParams(f, { page: 1, ...change })
  const q = p.toString()
  return `/admin/quiz-dashboard${q ? `?${q}` : ''}`
}

/** YYYY-MM-DD plus n days */
function addDays(ymd: string, n: number) {
  const d = new Date(`${ymd}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
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
  const reportHref = `/api/reports/scores?${new URLSearchParams({
    ...(f.quizId ? { quiz: String(f.quizId) } : {}),
    ...(f.tests ? { test: '1' } : {}),
  })}`
  const rowsExportHref = `/api/reports/dashboard?${filterParams(f, { page: 1 }).toString()}`
  const tabs: { id: Filters['tab']; label: string; count: number }[] = [
    { id: 'players', label: 'Players', count: d.totals.players },
    { id: 'attempts', label: 'Attempts', count: d.totals.attempts },
    { id: 'quizzes', label: 'Quiz details', count: d.totals.quizzes },
  ]
  const from = d.total ? (f.page - 1) * PAGE_SIZE + 1 : 0
  const to = Math.min(d.total, f.page * PAGE_SIZE)
  const quizCount = (q: (typeof d.quizzes)[number]) => (f.tab === 'attempts' ? q.attempts : q.players)
  const quizTitle = d.quizzes.find((q) => q.id === f.quizId)?.title
  const active = describeFilters(f, quizTitle)
  const noun = f.tab === 'players' ? 'players' : f.tab === 'attempts' ? 'rounds' : 'quizzes'

  // Quick date ranges (India game days)
  const t = d.today
  const periods: { label: string; from: string | null; to: string | null }[] = [
    { label: 'All time', from: null, to: null },
    { label: 'Today', from: t, to: t },
    { label: 'Yesterday', from: addDays(t, -1), to: addDays(t, -1) },
    { label: 'Last 7 days', from: addDays(t, -6), to: t },
    { label: 'Last 30 days', from: addDays(t, -29), to: t },
    { label: 'This month', from: `${t.slice(0, 8)}01`, to: t },
  ]
  const joinedRanges: { label: string; regFrom: string | null; regTo: string | null }[] = [
    { label: 'Any time', regFrom: null, regTo: null },
    { label: 'Today', regFrom: t, regTo: t },
    { label: 'Yesterday', regFrom: addDays(t, -1), regTo: addDays(t, -1) },
    { label: 'Last 7 days', regFrom: addDays(t, -6), regTo: t },
  ]
  const isPeriod = (p: { from: string | null; to: string | null }) => p.from === f.from && p.to === f.to
  const isJoined = (p: { regFrom: string | null; regTo: string | null }) => p.regFrom === f.regFrom && p.regTo === f.regTo

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
            <b>{num(d.totals.joined_today)}</b>
            <span>Joined today</span>
          </div>
          <div className="qd-stat">
            <b>{num(d.totals.played_today)}</b>
            <span>Played today</span>
          </div>
          <div className="qd-stat">
            <b>{num(d.totals.attempts)}</b>
            <span>Finished rounds</span>
          </div>
          <a className="qd-report" href={reportHref} title="Day-wise scores, daily ranking and every round">
            Full score report (Excel)
          </a>
        </div>
      </div>

      <nav className="qd-pills" aria-label="Report">
        {tabs.map((tb) => (
          <a
            key={tb.id}
            className={`qd-pill${f.tab === tb.id ? ' is-active' : ''}`}
            href={href({ ...f, sort: tb.id === 'attempts' ? 'latest' : 'points' }, { tab: tb.id })}
          >
            {tb.label} <span className="qd-count">{num(tb.count)}</span>
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

      <form className="qd-card qd-filterbox" method="get" action="/admin/quiz-dashboard">
        {f.tab !== 'players' && <input type="hidden" name="tab" value={f.tab} />}
        {f.quizId && <input type="hidden" name="quiz" value={f.quizId} />}

        {f.tab !== 'quizzes' && (
          <div className="qd-frow">
            <span className="qd-flabel">{f.tab === 'players' ? 'Played on' : 'Game days'}</span>
            <span className="qd-chips">
              {periods.map((p) => (
                <a key={p.label} className={`qd-chip${isPeriod(p) ? ' is-on' : ''}`} href={href(f, { from: p.from, to: p.to })}>
                  {p.label}
                </a>
              ))}
            </span>
            <label className="qd-field">
              From <input className="qd-input" type="date" name="from" defaultValue={f.from ?? ''} />
            </label>
            <label className="qd-field">
              To <input className="qd-input" type="date" name="to" defaultValue={f.to ?? ''} />
            </label>
            {f.tab === 'players' && (
              <label className="qd-field">
                Show{' '}
                <select className="qd-input" name="played" defaultValue={f.played}>
                  <option value="any">All players</option>
                  <option value="yes">Who played in these days</option>
                  <option value="no">Who didn&apos;t play in these days</option>
                </select>
              </label>
            )}
          </div>
        )}

        {f.tab === 'players' && (
          <>
            <div className="qd-frow">
              <span className="qd-flabel">Joined</span>
              <span className="qd-chips">
                {joinedRanges.map((p) => (
                  <a
                    key={p.label}
                    className={`qd-chip${isJoined(p) ? ' is-on' : ''}`}
                    href={href(f, { regFrom: p.regFrom, regTo: p.regTo })}
                  >
                    {p.label}
                  </a>
                ))}
              </span>
              <label className="qd-field">
                From <input className="qd-input" type="date" name="regFrom" defaultValue={f.regFrom ?? ''} />
              </label>
              <label className="qd-field">
                To <input className="qd-input" type="date" name="regTo" defaultValue={f.regTo ?? ''} />
              </label>
            </div>
            <div className="qd-frow">
              <span className="qd-flabel">Score &amp; streak</span>
              <label className="qd-field">
                Points from{' '}
                <input className="qd-input qd-num" type="number" min="0" name="minPoints" defaultValue={f.minPoints ?? ''} />
              </label>
              <label className="qd-field">
                to <input className="qd-input qd-num" type="number" min="0" name="maxPoints" defaultValue={f.maxPoints ?? ''} />
              </label>
              <label className="qd-field">
                Days played ≥{' '}
                <input className="qd-input qd-num" type="number" min="0" name="minDays" defaultValue={f.minDays ?? ''} />
              </label>
              <label className="qd-field">
                Current streak ≥{' '}
                <input className="qd-input qd-num" type="number" min="0" name="minStreak" defaultValue={f.minStreak ?? ''} />
              </label>
              <label className="qd-field">
                Best streak ≥{' '}
                <input className="qd-input qd-num" type="number" min="0" name="minBest" defaultValue={f.minBest ?? ''} />
              </label>
            </div>
          </>
        )}

        {f.tab === 'attempts' && (
          <div className="qd-frow">
            <span className="qd-flabel">Round &amp; score</span>
            <label className="qd-field">
              Round <input className="qd-input qd-num" type="number" min="1" name="round" defaultValue={f.round ?? ''} />
            </label>
            <label className="qd-field">
              Score from{' '}
              <input className="qd-input qd-num" type="number" min="0" name="minScore" defaultValue={f.minScore ?? ''} />
            </label>
            <label className="qd-field">
              to <input className="qd-input qd-num" type="number" min="0" name="maxScore" defaultValue={f.maxScore ?? ''} />
            </label>
          </div>
        )}

        <div className="qd-frow">
          <span className="qd-flabel">Search</span>
          <input
            className="qd-input qd-search"
            type="search"
            name="q"
            defaultValue={f.q}
            placeholder={f.tab === 'quizzes' ? 'Quiz title' : 'Name, phone or email'}
          />
          {f.tab !== 'quizzes' && (
            <label className="qd-field">
              Sort{' '}
              <select className="qd-input" name="sort" defaultValue={f.sort}>
                {Object.entries(f.tab === 'attempts' ? ATTEMPT_SORTS : PLAYER_SORTS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </label>
          )}
          <label className="qd-check">
            <input type="checkbox" name="tests" value="1" defaultChecked={f.tests} /> Include test players
          </label>
          <button className="qd-btn" type="submit">
            Apply filters
          </button>
          {active.length > (quizTitle ? 1 : 0) && (
            <a className="qd-reset" href={href({ ...f, sort: f.tab === 'attempts' ? 'latest' : 'points' }, {
              q: '', tests: false, from: null, to: null, played: 'any', regFrom: null, regTo: null,
              minPoints: null, maxPoints: null, minDays: null, minStreak: null, minBest: null,
              round: null, minScore: null, maxScore: null,
            })}>
              Clear filters
            </a>
          )}
        </div>
      </form>

      <div className="qd-resultbar">
        <div>
          <b>
            {num(d.total)} {noun}
          </b>
          {active.length > 0 && <span className="qd-active"> · {active.join(' · ')}</span>}
        </div>
        <a className="qd-export" href={rowsExportHref}>
          Export {d.total === 1 ? 'this row' : `these ${num(d.total)} rows`} (Excel)
        </a>
      </div>

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
                <th className="r">Streak</th>
                <th className="r">Best streak</th>
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
                <td className="qd-empty" colSpan={12}>
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
                  <td className="r">{num(r.streak)}</td>
                  <td className="r">{num(r.best)}</td>
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
