import type { AdminViewServerProps } from 'payload'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import { redirect } from 'next/navigation'
import React from 'react'

import { ADMINS, REPORT_READERS, cmsRole, userHas } from '@/access/roles'
import { formatStartHour } from '@/utilities/gameDay'

import {
  type Filters,
  PAGE_SIZE,
  PLAYER_SORTS,
  PLAY_SORTS,
  QUESTION_SORTS,
  defaultSort,
  describeFilters,
  filterParams,
  loadDashboard,
  parseFilters,
} from './data'
import { DisqualifyButton } from './DisqualifyButton'
import { SoftNav } from './SoftNav'

/**
 * Quiz Dashboard (/admin/quiz-dashboard): players, plays, questions, the daily sponsor report,
 * flags and each player's answers, with an Excel export of exactly the filtered rows. For Super
 * Admins, Administrators, Editors and Viewers (a Viewer sees only this). Filters update the page
 * in place (SoftNav). Only Administrators see the Disqualify buttons.
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
  if (s === null || s === undefined) return '-'
  const n = Math.round(Number(s) || 0)
  return n >= 60 ? `${Math.floor(n / 60)}m ${n % 60}s` : `${n}s`
}
const num = (v: unknown) => new Intl.NumberFormat('en-IN').format(Number(v) || 0)
const USE_IN: Record<string, string> = { general: 'General', sponsored: 'Sponsored', both: 'Both', none: 'Not in play' }

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

const CLEARED: Partial<Filters> = {
  q: '',
  tests: false,
  from: null,
  to: null,
  played: 'any',
  regFrom: null,
  regTo: null,
  minPoints: null,
  maxPoints: null,
  minDays: null,
  minStreak: null,
  minBest: null,
  status: 'all',
  flag: 'any',
  minScore: null,
  maxScore: null,
  useIn: 'any',
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

  const canFlag = userHas(user, ADMINS)
  const f = parseFilters(searchParams as Record<string, string>)
  const d = await loadDashboard(req.payload, f)
  const reportHref = `/api/reports/scores?${new URLSearchParams({
    ...(f.quizId ? { quiz: String(f.quizId) } : {}),
    ...(f.tests ? { test: '1' } : {}),
  })}`
  const rowsExportHref = `/api/reports/dashboard?${filterParams(f, { page: 1 }).toString()}`
  const tabs: { id: Filters['tab']; label: string; count?: number }[] = [
    { id: 'players', label: 'Players', count: d.totals.players },
    { id: 'plays', label: 'Plays', count: d.totals.plays },
    { id: 'questions', label: 'Questions', count: d.totals.questions },
    { id: 'sponsor', label: 'Sponsor report', count: d.totals.sponsor_days },
    { id: 'flags', label: 'Flags', count: d.totals.flagged },
  ]
  const from = d.total ? (f.page - 1) * PAGE_SIZE + 1 : 0
  const to = Math.min(d.total, f.page * PAGE_SIZE)
  const quizCount = (q: (typeof d.quizzes)[number]) =>
    f.tab === 'questions' ? q.questions : f.tab === 'players' ? q.players : q.plays
  const quizTitle = d.quizzes.find((q) => q.id === f.quizId)?.title
  const active = describeFilters(f, quizTitle)
  const noun = { players: 'players', plays: 'plays', questions: 'questions', sponsor: 'game days', flags: 'flagged plays', player: '' }[f.tab]
  const dataOk = d.totals.total_mismatch === 0 && d.totals.missing_summary === 0

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
  const sorts = f.tab === 'plays' ? PLAY_SORTS : f.tab === 'questions' ? QUESTION_SORTS : f.tab === 'players' ? PLAYER_SORTS : null
  const playerLink = (id: number) => href({ ...f, tab: 'player', sort: 'latest' }, { playerId: id })
  const flagBadges = (r: any) => (
    <>
      {r.too_fast && <span className="qd-badge qd-badge--warn">Too fast</span>}
      {r.linked && <span className="qd-badge qd-badge--warn">Linked</span>}
      {r.disqualified && <span className="qd-badge qd-badge--bad">Disqualified</span>}
    </>
  )

  /* ------------------------------------------------------------------ player detail */
  if (f.tab === 'player') {
    const p = d.player
    return template(
      <SoftNav>
        <div className="qd">
          <div className="qd-card qd-head">
            <div>
              <div className="qd-eyebrow">
                <a href={href({ ...f, tab: 'players', sort: 'points' }, { playerId: null })}>‹ Quiz Dashboard</a>
              </div>
              <h1 className="qd-title">{p ? p.user.name || 'Player' : 'Player not found'}</h1>
              {p && (
                <p className="qd-sub">
                  {p.user.phone || '-'} · {p.user.email || 'no email'} · joined {fmtDate(p.user.created_at)}
                </p>
              )}
            </div>
            {p && (
              <div className="qd-head__right">
                <div className="qd-stat">
                  <b>{num(p.user.total_xp)}</b>
                  <span>Total points</span>
                </div>
                <div className="qd-stat">
                  <b>{num(p.user.finished)}</b>
                  <span>Finished plays</span>
                </div>
                <div className="qd-stat">
                  <b>{fmtSecs(p.user.total_time)}</b>
                  <span>Total time</span>
                </div>
                {p.user.disqualified && <span className="qd-badge qd-badge--bad">Disqualified</span>}
                {canFlag && <DisqualifyButton id={p.user.id} disqualified={p.user.disqualified} />}
              </div>
            )}
          </div>
          {p && p.user.total_xp !== p.user.attempts_xp && (
            <div className="qd-card qd-msg qd-msg--err">
              Saved total ({num(p.user.total_xp)}) differs from the sum of finished plays ({num(p.user.attempts_xp)}).
            </div>
          )}
          {p &&
            p.plays.map((pl: any) => (
              <div key={pl.round_id} className="qd-card qd-play">
                <div className="qd-play__head">
                  <b>{fmtDay(pl.day)}</b>
                  <span>{pl.quiz}</span>
                  <span>{pl.status === 'completed' ? `${num(pl.score)} points · ${fmtSecs(pl.time_taken)}` : 'Opened, not finished'}</span>
                  {flagBadges(pl)}
                </div>
                <table className="qd-table qd-table--compact">
                  <thead>
                    <tr>
                      <th>Q</th>
                      <th>Question</th>
                      <th>Answer</th>
                      <th className="r">Points</th>
                      <th className="r">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pl.answers.map((a: any) => (
                      <tr key={`${pl.round_id}-${a.pos}`}>
                        <td className="muted">
                          Q{a.pos}
                          {a.sponsored ? ' ★' : ''}
                        </td>
                        <td>{a.question}</td>
                        <td>
                          {a.answer === null || a.answer === undefined ? (
                            <span className="muted">{pl.status === 'completed' ? 'not recorded (before 25 Nov)' : '-'}</span>
                          ) : a.timed_out ? (
                            <span className="qd-bad">Time out</span>
                          ) : (
                            <span className={a.correct ? 'qd-ok' : 'qd-bad'}>
                              {a.correct ? '✓' : '✗'} {a.answer}
                            </span>
                          )}
                        </td>
                        <td className="r">
                          {a.points === null || a.points === undefined ? '-' : num(a.points)}
                          {Number(a.speed_bonus) > 0 ? <span className="muted"> (+{a.speed_bonus})</span> : null}
                        </td>
                        <td className="r">{a.seconds === null || a.seconds === undefined ? '-' : `${a.seconds}s`}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          {p && !p.plays.length && <div className="qd-card">No plays yet.</div>}
          <p className="qd-sub">★ = sponsored slot. Time is measured on the server.</p>
        </div>
      </SoftNav>,
    )
  }

  /* ------------------------------------------------------------------ the lists */
  return template(
    <SoftNav>
      <div className="qd">
        <div className="qd-card qd-head">
          <div>
            <div className="qd-eyebrow">Quiz reports{cmsRole(user) === 'viewer' ? ' · view only' : ''}</div>
            <h1 className="qd-title">Quiz Dashboard</h1>
            <p className="qd-sub">
              Today&apos;s game day: {fmtDay(d.today)} (starts {formatStartHour(d.dayStart)} India time).{' '}
              <span className={dataOk ? 'qd-ok' : 'qd-bad'}>
                {dataOk
                  ? 'Data check: player totals match their finished plays.'
                  : `Data check: ${d.totals.total_mismatch} player total(s) differ from their finished plays${d.totals.missing_summary ? `, ${d.totals.missing_summary} play(s) without a summary row` : ''} - run the data check script.`}
              </span>
            </p>
          </div>
          <div className="qd-head__right">
            <div className="qd-stat">
              <b>{num(d.totals.players)}</b>
              <span>Registered players</span>
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
              <b>{num(d.totals.open_today)}</b>
              <span>Opened today, not finished</span>
            </div>
            <div className="qd-stat">
              <b>{num(d.totals.plays)}</b>
              <span>Finished plays</span>
            </div>
            <a className="qd-report" href={reportHref} title="Day-wise scores, daily ranking and every play">
              Full score report (Excel)
            </a>
          </div>
        </div>

        <nav className="qd-pills" aria-label="Report">
          {tabs.map((tb) => (
            <a
              key={tb.id}
              className={`qd-pill${f.tab === tb.id ? ' is-active' : ''}`}
              href={href({ ...f, sort: defaultSort(tb.id) }, { tab: tb.id, flag: 'any', status: 'all' })}
            >
              {tb.label} {tb.count !== undefined && <span className="qd-count">{num(tb.count)}</span>}
            </a>
          ))}
        </nav>

        <nav className="qd-pills qd-pills--sub" aria-label="Quiz">
          <a className={`qd-pill${!f.quizId ? ' is-active' : ''}`} href={href(f, { quizId: null })}>
            All quizzes
          </a>
          {d.quizzes.map((q) => (
            <a key={q.id} className={`qd-pill${f.quizId === q.id ? ' is-active' : ''}`} href={href(f, { quizId: q.id })}>
              {q.title} <span className="qd-count">{num(quizCount(q))}</span>
            </a>
          ))}
        </nav>

        <form className="qd-card qd-filterbox" method="get" action="/admin/quiz-dashboard" data-soft>
          {f.tab !== 'players' && <input type="hidden" name="tab" value={f.tab} />}
          {f.quizId && <input type="hidden" name="quiz" value={f.quizId} />}
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

          {f.tab === 'players' && (
            <>
              <div className="qd-frow">
                <span className="qd-flabel">Joined</span>
                <span className="qd-chips">
                  {joinedRanges.map((p) => (
                    <a key={p.label} className={`qd-chip${isJoined(p) ? ' is-on' : ''}`} href={href(f, { regFrom: p.regFrom, regTo: p.regTo })}>
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
                  Points from <input className="qd-input qd-num" type="number" min="0" name="minPoints" defaultValue={f.minPoints ?? ''} />
                </label>
                <label className="qd-field">
                  to <input className="qd-input qd-num" type="number" min="0" name="maxPoints" defaultValue={f.maxPoints ?? ''} />
                </label>
                <label className="qd-field">
                  Days played ≥ <input className="qd-input qd-num" type="number" min="0" name="minDays" defaultValue={f.minDays ?? ''} />
                </label>
                <label className="qd-field">
                  Current streak ≥{' '}
                  <input className="qd-input qd-num" type="number" min="0" name="minStreak" defaultValue={f.minStreak ?? ''} />
                </label>
                <label className="qd-field">
                  Best streak ≥ <input className="qd-input qd-num" type="number" min="0" name="minBest" defaultValue={f.minBest ?? ''} />
                </label>
              </div>
            </>
          )}

          {f.tab === 'plays' && (
            <div className="qd-frow">
              <span className="qd-flabel">Play</span>
              <label className="qd-field">
                Status{' '}
                <select className="qd-input" name="status" defaultValue={f.status}>
                  <option value="all">All</option>
                  <option value="finished">Finished</option>
                  <option value="open">Opened, not finished</option>
                </select>
              </label>
              <label className="qd-field">
                Flags{' '}
                <select className="qd-input" name="flag" defaultValue={f.flag}>
                  <option value="any">Any</option>
                  <option value="flagged">Flagged</option>
                  <option value="tooFast">Too fast</option>
                  <option value="linked">Linked numbers</option>
                </select>
              </label>
              <label className="qd-field">
                Score from <input className="qd-input qd-num" type="number" min="0" name="minScore" defaultValue={f.minScore ?? ''} />
              </label>
              <label className="qd-field">
                to <input className="qd-input qd-num" type="number" min="0" name="maxScore" defaultValue={f.maxScore ?? ''} />
              </label>
            </div>
          )}

          {f.tab === 'flags' && (
            <div className="qd-frow">
              <span className="qd-flabel">Flag</span>
              <label className="qd-field">
                <select className="qd-input" name="flag" defaultValue={f.flag === 'any' ? '' : f.flag}>
                  <option value="">Too fast or linked</option>
                  <option value="tooFast">Too fast</option>
                  <option value="linked">Linked numbers (same phone)</option>
                </select>
              </label>
              <span className="qd-sub">Flags, not bans: an Administrator decides (Disqualify takes a player off the leaderboard).</span>
            </div>
          )}

          {f.tab === 'questions' && (
            <div className="qd-frow">
              <span className="qd-flabel">Question</span>
              <label className="qd-field">
                Use in{' '}
                <select className="qd-input" name="useIn" defaultValue={f.useIn}>
                  <option value="any">Any</option>
                  <option value="general">General</option>
                  <option value="sponsored">Sponsored</option>
                  <option value="both">Both</option>
                  <option value="none">Not in play</option>
                </select>
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
              placeholder={f.tab === 'questions' ? 'Question text' : 'Name, phone or email'}
            />
            {sorts && (
              <label className="qd-field">
                Sort{' '}
                <select className="qd-input" name="sort" defaultValue={f.sort}>
                  {Object.entries(sorts).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </label>
            )}
            {f.tab !== 'questions' && (
              <label className="qd-check">
                <input type="checkbox" name="tests" value="1" defaultChecked={f.tests} /> Include test players
              </label>
            )}
            <button className="qd-btn" type="submit">
              Apply
            </button>
            {active.length > (quizTitle ? 1 : 0) && (
              <a className="qd-reset" href={href({ ...f, sort: defaultSort(f.tab) }, CLEARED)}>
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
                  <th className="r">Finished plays</th>
                  <th className="r">Points</th>
                  <th className="r">Time</th>
                  <th className="r">Streak</th>
                  <th className="r">Best streak</th>
                  <th>Last played</th>
                  <th>Joined</th>
                </tr>
              )}
              {(f.tab === 'plays' || f.tab === 'flags') && (
                <tr>
                  <th>Player</th>
                  <th>Phone</th>
                  <th>Quiz</th>
                  <th>Game day</th>
                  <th>Status</th>
                  <th className="r">Score</th>
                  <th className="r">Correct</th>
                  <th className="r">Time</th>
                  <th>Flags</th>
                  {f.tab === 'flags' ? <th>Other numbers on this phone</th> : <th>Finished at</th>}
                  {f.tab === 'flags' && canFlag && <th />}
                </tr>
              )}
              {f.tab === 'questions' && (
                <tr>
                  <th>ID</th>
                  <th>Question</th>
                  <th>Use in</th>
                  <th>Status</th>
                  <th className="r">Given</th>
                  <th className="r">Answered</th>
                  <th className="r">Right</th>
                  <th className="r">Time-outs</th>
                  <th className="r">Avg time</th>
                  <th>Last given</th>
                </tr>
              )}
              {f.tab === 'sponsor' && (
                <tr>
                  <th>Game day</th>
                  <th className="r">Players who saw it</th>
                  <th className="r">Answered</th>
                  <th className="r">Right</th>
                  <th className="r">Time-outs</th>
                  <th className="r">Avg time</th>
                  <th className="r">Sponsored questions used</th>
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
                    <td className="strong">
                      <a href={playerLink(r.id)}>{r.name || '-'}</a>
                    </td>
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
              {(f.tab === 'plays' || f.tab === 'flags') &&
                d.rows.map((r) => (
                  <tr key={r.id}>
                    <td className="strong">
                      <a href={playerLink(r.user_id)}>{r.name || '-'}</a>
                    </td>
                    <td>{r.phone || '-'}</td>
                    <td>{r.quiz || '-'}</td>
                    <td>{r.game_day ? fmtDay(r.game_day) : '-'}</td>
                    <td>{r.status === 'completed' ? 'Finished' : 'Opened'}</td>
                    <td className="r strong">{r.score === null ? '-' : num(r.score)}</td>
                    <td className="r">{r.correct_answers === null ? '-' : `${num(r.correct_answers)} / ${num(r.questions)}`}</td>
                    <td className="r">{fmtSecs(r.time_taken)}</td>
                    <td>{flagBadges(r)}</td>
                    {f.tab === 'flags' ? <td>{r.same_device || '-'}</td> : <td>{fmtDateTime(r.completed_at)}</td>}
                    {f.tab === 'flags' && canFlag && (
                      <td>
                        <DisqualifyButton id={r.user_id} disqualified={r.disqualified} />
                      </td>
                    )}
                  </tr>
                ))}
              {f.tab === 'questions' &&
                d.rows.map((r) => (
                  <tr key={r.id}>
                    <td className="muted">
                      <a href={`/admin/collections/questions/${r.id}`}>#{r.id}</a>
                    </td>
                    <td className="strong">{r.question}</td>
                    <td>{USE_IN[r.use_in] ?? r.use_in ?? '-'}</td>
                    <td>{r.status === 'published' ? 'Published' : 'Draft'}</td>
                    <td className="r">{num(r.given)}</td>
                    <td className="r">{num(r.answered)}</td>
                    <td className="r">{r.pct === null ? '-' : `${r.pct}%`}</td>
                    <td className="r">{num(r.timeouts)}</td>
                    <td className="r">{r.secs === null ? '-' : `${r.secs}s`}</td>
                    <td>{r.last_day ? fmtDay(r.last_day) : '-'}</td>
                  </tr>
                ))}
              {f.tab === 'sponsor' &&
                d.rows.map((r) => (
                  <tr key={r.game_day}>
                    <td className="strong">{fmtDay(r.game_day)}</td>
                    <td className="r">{num(r.players)}</td>
                    <td className="r">{num(r.answered)}</td>
                    <td className="r">
                      {num(r.correct)} ({r.pct}%)
                    </td>
                    <td className="r">{num(r.timeouts)}</td>
                    <td className="r">{r.secs === null ? '-' : `${r.secs}s`}</td>
                    <td className="r">{num(r.questions)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {f.tab === 'questions' && (
          <p className="qd-sub">
            Given = times the question was handed to a player. Right, time-outs and time count answers from 25 Nov 2026 (when
            answers started being stored).
          </p>
        )}
        {f.tab === 'sponsor' && <p className="qd-sub">One row per game day: answers given in the sponsored slot (Q3).</p>}

        <div className="qd-pager">
          <span>{d.total ? `Showing ${num(from)}–${num(to)} of ${num(d.total)}` : 'No rows'}</span>
          <span className="qd-pager__links">
            {f.page > 1 ? <a href={href(f, { page: f.page - 1 })}>‹ Previous</a> : <span className="off">‹ Previous</span>}
            <span>
              Page {f.page} of {d.pages}
            </span>
            {f.page < d.pages ? <a href={href(f, { page: f.page + 1 })}>Next ›</a> : <span className="off">Next ›</span>}
          </span>
        </div>
      </div>
    </SoftNav>,
  )
}
