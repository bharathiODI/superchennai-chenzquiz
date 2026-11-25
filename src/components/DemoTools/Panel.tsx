'use client'

import { useCallback, useEffect, useState } from 'react'

type Status = {
  enabled: boolean
  offsetMs: number
  nowIndia: string
  gameDay: string | null
  dayNumber: number | null
  quiz: {
    title: string
    health?: {
      endsAtIndia: string | null
      closed: boolean
      general: number
      sponsored: number
      warnings: string[]
    }
  } | null
  testPlayers: string[]
  error?: string
}

const KEY = 'chenz-demo-key'

export function DemoToolsPanel() {
  const [status, setStatus] = useState<Status | null>(null)
  const [open, setOpen] = useState(false)
  const [key, setKey] = useState('')
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const [day, setDay] = useState('')
  const [time, setTime] = useState('00:29')
  const [phone, setPhone] = useState('')
  const [count, setCount] = useState('50')

  const refresh = useCallback(async () => {
    const r = await fetch('/api/demo/status', { cache: 'no-store' }).catch(() => null)
    if (!r) return
    setStatus(await r.json().catch(() => null))
  }, [])

  useEffect(() => {
    try {
      setKey(localStorage.getItem(KEY) || '')
    } catch {
      /* ignore */
    }
    refresh()
  }, [refresh])

  const call = async (action: string, body: Record<string, unknown> = {}, reload = false) => {
    setBusy(true)
    setMsg('Working...')
    try {
      const r = await fetch(`/api/demo/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-demo-key': key },
        body: JSON.stringify(body),
      })
      const data = await r.json().catch(() => ({}))
      if (!r.ok || data.ok === false) {
        setMsg(data.error || `Failed (${r.status})`)
        return null
      }
      try {
        localStorage.setItem(KEY, key)
      } catch {
        /* ignore */
      }
      await refresh()
      if (reload) window.location.reload()
      return data
    } finally {
      setBusy(false)
    }
  }

  if (!status?.enabled) return null
  const moved = status.offsetMs !== 0
  const health = status.quiz?.health
  const quizTitle = String(status.quiz?.title || 'The quiz').trim()
  const btn =
    'px-2.5 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-bold disabled:opacity-50'
  const input = 'px-2 py-1.5 rounded-lg border border-slate-300 text-xs w-full'

  return (
    <>
      {moved && (
        <div className="fixed top-0 inset-x-0 z-[2147483001] bg-yellow-300 text-slate-900 text-center text-xs font-bold py-1 shadow">
          DEMO CLOCK: {status.nowIndia} (India) · game day {status.gameDay}
          {status.dayNumber ? ` · day ${status.dayNumber}` : ''}
          {health?.closed ? (
            <span className="text-red-700">
              {' '}
              · {quizTitle} has ended (End date {health.endsAtIndia}): change it in the CMS or go
              Back to today
            </span>
          ) : null}
        </div>
      )}
      <div className="fixed right-3 bottom-28 md:bottom-3 z-[2147483001] text-left">
        {!open ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="px-3 py-2 rounded-full bg-yellow-300 text-slate-900 text-xs font-black shadow-lg"
          >
            Demo tools
          </button>
        ) : (
          <div className="w-[300px] max-h-[80vh] overflow-auto rounded-2xl bg-white border border-slate-200 shadow-2xl p-4 space-y-3 text-slate-800">
            <div className="flex items-center justify-between">
              <strong className="text-sm">Demo tools</strong>
              <button type="button" className="text-xs underline" onClick={() => setOpen(false)}>
                close
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Now: {status.nowIndia} · game day {status.gameDay}
              {status.dayNumber ? ` (day ${status.dayNumber} of ${quizTitle})` : ''}
            </p>
            {health && (
              <p className="text-[11px] text-slate-500">
                {quizTitle} {health.closed ? 'ended' : 'open until'}{' '}
                {health.endsAtIndia ?? '(no end date)'} · in play: {health.general} General,{' '}
                {health.sponsored} Sponsored
              </p>
            )}
            {health?.warnings?.length ? (
              <ul className="text-[11px] text-red-700 bg-red-50 border border-red-200 rounded-lg p-2 space-y-1 list-disc pl-5">
                {health.warnings.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            ) : null}
            <label className="block text-[11px] font-bold">
              Demo key
              <input
                className={input}
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="DEMO_TOOLS_KEY"
              />
            </label>

            <div className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase text-slate-500">Test clock</div>
              <div className="flex gap-1.5 flex-wrap">
                <button
                  type="button"
                  disabled={busy}
                  className={btn}
                  onClick={() => call('clock', { op: 'prev' }, true)}
                >
                  ← Day
                </button>
                <button
                  type="button"
                  disabled={busy}
                  className={btn}
                  onClick={() => call('clock', { op: 'next' }, true)}
                >
                  Next day →
                </button>
                <button
                  type="button"
                  disabled={busy}
                  className={btn}
                  onClick={() => call('clock', { op: 'today' }, true)}
                >
                  Back to today
                </button>
              </div>
              <div className="flex gap-1.5">
                <input
                  className={input}
                  placeholder="Day N"
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                />
                <button
                  type="button"
                  disabled={busy || !day}
                  className={btn}
                  onClick={() => call('clock', { op: 'day', value: day }, true)}
                >
                  Jump
                </button>
              </div>
              <div className="flex gap-1.5">
                <input
                  className={input}
                  placeholder="HH:MM"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
                <button
                  type="button"
                  disabled={busy}
                  className={btn}
                  onClick={() => call('clock', { op: 'time', value: time }, true)}
                >
                  Set time
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase text-slate-500">Player</div>
              <select className={input} value={phone} onChange={(e) => setPhone(e.target.value)}>
                <option value="">Pick a test player</option>
                {status.testPlayers.map((p, i) => (
                  <option key={p} value={p}>
                    Test Player {i + 1} ({p})
                  </option>
                ))}
              </select>
              <div className="flex gap-1.5 flex-wrap">
                <button
                  type="button"
                  disabled={busy || !phone}
                  className={btn}
                  onClick={async () => {
                    const d = await call('login-as', { phone })
                    if (d?.token) {
                      localStorage.setItem('token', d.token)
                      localStorage.setItem('user', JSON.stringify(d.user))
                      window.location.href = '/quizzes'
                    }
                  }}
                >
                  Log in as
                </button>
                <button
                  type="button"
                  disabled={busy || !phone}
                  className={btn}
                  onClick={async () =>
                    (await call('reset-player', { phone })) && setMsg('Player reset')
                  }
                >
                  Reset player
                </button>
                <button
                  type="button"
                  disabled={busy}
                  className={btn}
                  onClick={async () =>
                    (await call('reset-test-players')) && setMsg('All test players reset')
                  }
                >
                  Reset all 10
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase text-slate-500">
                Simulated players
              </div>
              <div className="flex gap-1.5">
                <input className={input} value={count} onChange={(e) => setCount(e.target.value)} />
                <button
                  type="button"
                  disabled={busy}
                  className={btn}
                  onClick={async () => {
                    const d = await call('simulate', { count: Number(count) })
                    if (d)
                      setMsg(
                        `${d.played} played today, ${d.alreadyPlayed} had already played (${d.seconds}s)`,
                      )
                  }}
                >
                  Play today
                </button>
              </div>
              <button
                type="button"
                disabled={busy}
                className={btn}
                onClick={async () => {
                  const d = await call('remove-sim')
                  if (d) setMsg(`${d.removed} simulated players removed`)
                }}
              >
                Remove simulated players
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Full reset from live data: on the server,{' '}
              <code>bash chenzquiz-site.sh demo-db copy-live</code>.
            </p>
            {msg && <p className="text-xs font-semibold text-indigo-700">{msg}</p>}
          </div>
        )}
      </div>
    </>
  )
}
