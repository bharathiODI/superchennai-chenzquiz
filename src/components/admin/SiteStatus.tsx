'use client'
// "Site status" box (CMS admins): players mid-round right now, and the maintenance switch.
// Safe deploy: switch maintenance ON -> wait until "Playing now" is 0 -> deploy -> switch OFF.
import { useAuth } from '@payloadcms/ui'
import { useCallback, useEffect, useState } from 'react'
import { ADMINS, userHas } from '@/access/roles'

type Playing = { player: string; phone: string; quiz: string; startedAt: string; minutesAgo: number }
type Status = {
  maintenance: boolean
  message: string
  since?: string
  by?: string
  playing?: Playing[]
  playingWindowMin?: number
  finishedLast5Min?: number
}

const box: React.CSSProperties = {
  padding: '14px 16px',
  margin: '0 0 16px',
  border: '1px solid var(--theme-elevation-150)',
  borderRadius: 4,
  background: 'var(--theme-elevation-50)',
}

export function SiteStatus() {
  const { user } = useAuth<any>()
  const [s, setS] = useState<Status | null>(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const [checked, setChecked] = useState<Date | null>(null)

  const load = useCallback(() => {
    fetch('/api/site-status', { credentials: 'include', cache: 'no-store' })
      .then((r) => r.json())
      .then((d: Status) => {
        setS(d)
        setChecked(new Date())
        setMsg((m) => m || d.message || '')
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    load()
    const t = setInterval(load, 15_000)
    return () => clearInterval(t)
  }, [load])

  if (!userHas(user, ADMINS) || !s) return null

  const toggle = async () => {
    const on = !s.maintenance
    if (!window.confirm(on ? 'Switch maintenance ON? Players cannot start new games or log in until you switch it off.' : 'Switch maintenance OFF and let players play again?')) return
    setBusy(true)
    await fetch('/api/site-status', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ maintenance: on, message: msg }),
    }).catch(() => {})
    setBusy(false)
    load()
  }

  const playing = s.playing || []
  const cell: React.CSSProperties = { padding: '4px 10px 4px 0', textAlign: 'left', fontSize: 13 }

  return (
    <div style={box}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
        <strong>Site status</strong>
        <span
          style={{
            padding: '3px 10px',
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 700,
            color: '#fff',
            background: s.maintenance ? '#b45309' : '#15803d',
          }}
        >
          {s.maintenance ? 'MAINTENANCE ON - new games paused' : 'Open - players can play'}
        </span>
        <span style={{ fontWeight: 600 }}>
          Playing now: {playing.length}
          {typeof s.finishedLast5Min === 'number' ? ` · finished in the last 5 min: ${s.finishedLast5Min}` : ''}
        </span>
        <button type="button" className="btn btn--style-secondary btn--size-small" style={{ margin: 0 }} onClick={load}>
          Refresh
        </button>
        <span style={{ color: 'var(--theme-elevation-500)', fontSize: 12 }}>
          {checked ? `updated ${checked.toLocaleTimeString('en-GB')}` : ''} (every 15 s)
        </span>
      </div>

      {playing.length > 0 && (
        <table style={{ marginTop: 10, borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Player', 'Phone', 'Quiz', 'Started'].map((h) => (
                <th key={h} style={{ ...cell, fontWeight: 600 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {playing.map((p, i) => (
              <tr key={i}>
                <td style={cell}>{p.player}</td>
                <td style={cell}>{p.phone}</td>
                <td style={cell}>{p.quiz}</td>
                <td style={cell}>{p.minutesAgo === 0 ? 'just now' : `${p.minutesAgo} min ago`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, marginTop: 12 }}>
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Message players see during maintenance"
          style={{ flex: '1 1 320px', padding: '6px 8px', background: 'var(--theme-input-bg)', color: 'var(--theme-text)', border: '1px solid var(--theme-elevation-150)', borderRadius: 4 }}
        />
        <button
          type="button"
          disabled={busy}
          className={`btn btn--size-small ${s.maintenance ? 'btn--style-primary' : 'btn--style-secondary'}`}
          style={{ margin: 0 }}
          onClick={toggle}
        >
          {s.maintenance ? 'Switch maintenance OFF' : 'Switch maintenance ON'}
        </button>
      </div>
      <p style={{ margin: '8px 0 0', fontSize: 12, color: 'var(--theme-elevation-500)' }}>
        {s.maintenance && s.since ? `On since ${new Date(s.since).toLocaleString('en-GB', { timeZone: 'Asia/Kolkata' })}${s.by ? ` by ${s.by}` : ''}. ` : ''}
        Safe deploy: switch ON, wait until Playing now is 0, deploy, then switch OFF. Rounds already on screen can still
        be finished. &quot;Playing now&quot; = rounds started in the last {s.playingWindowMin ?? 15} minutes and not finished.
      </p>
    </div>
  )
}
