'use client'
// Read-only "Game history" on a Quiz User's page: every round with its game day, score, correct
// answers and time. Display only (no data is stored by this field).
import { useDocumentInfo } from '@payloadcms/ui'
import { useEffect, useState } from 'react'

type Round = { id: number; quiz: any; day: string; round: number; status: string; score?: number; completedAt?: string; createdAt: string }
type Attempt = { id: number; quiz: any; round?: number; score: number; correctAnswers?: number; totalQuestions?: number; timeTaken?: number; completedAt: string }

const relId = (v: any) => (v && typeof v === 'object' ? v.id : v)
const fmt = (v?: string) =>
  v ? new Date(v).toLocaleString('en-GB', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false }) : '-'

export function PlayerHistory() {
  const { id } = useDocumentInfo()
  const [rows, setRows] = useState<Array<Round & { attempt?: Attempt; quizTitle?: string }> | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    const q = `where[user][equals]=${id}&limit=500&depth=0&sort=-createdAt`
    Promise.all([
      fetch(`/api/quiz-rounds?${q}`, { credentials: 'include' }).then((r) => r.json()),
      fetch(`/api/quiz-attempts?${q}`, { credentials: 'include' }).then((r) => r.json()),
      fetch('/api/quizzes?limit=100&depth=0', { credentials: 'include' }).then((r) => r.json()),
    ])
      .then(([rounds, attempts, quizzes]) => {
        const titles = new Map<string, string>((quizzes?.docs || []).map((x: any) => [String(x.id), x.quizTitle || x.title || `#${x.id}`]))
        const free: Attempt[] = [...(attempts?.docs || [])]
        setRows(
          (rounds?.docs || []).map((r: Round) => {
            // the score entry saved when this round was finished (same quiz/round, within 5 min)
            let attempt: Attempt | undefined
            if (r.completedAt) {
              const t = Date.parse(r.completedAt)
              const i = free.findIndex(
                (a) => String(relId(a.quiz)) === String(relId(r.quiz)) && (!a.round || a.round === r.round) && Math.abs(Date.parse(a.completedAt) - t) <= 300_000,
              )
              if (i >= 0) attempt = free.splice(i, 1)[0]
            }
            return { ...r, attempt, quizTitle: titles.get(String(relId(r.quiz))) }
          }),
        )
      })
      .catch(() => setError('Could not load the history.'))
  }, [id])

  if (!id) return null
  const done = (rows || []).filter((r) => r.status === 'completed')
  const days = new Set(done.map((r) => r.day)).size
  const total = done.reduce((s, r) => s + (Number(r.score) || 0), 0)
  const cell: React.CSSProperties = { padding: '6px 10px', borderBottom: '1px solid var(--theme-elevation-100)', textAlign: 'left' }

  return (
    <div style={{ margin: '24px 0' }}>
      <h3 style={{ margin: '0 0 8px' }}>Game history</h3>
      {error && <p>{error}</p>}
      {!rows && !error && <p>Loading...</p>}
      {rows && (
        <>
          <p style={{ margin: '0 0 12px', color: 'var(--theme-elevation-600)' }}>
            {done.length} finished round{done.length === 1 ? '' : 's'} on {days} game day{days === 1 ? '' : 's'} - {total} points
            {rows.length > done.length ? ` (${rows.length - done.length} not finished)` : ''}
          </p>
          {rows.length > 0 && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 13 }}>
                <thead>
                  <tr>
                    {['Game day', 'Quiz', 'Round', 'Status', 'Score', 'Correct', 'Time', 'Started', 'Finished'].map((h) => (
                      <th key={h} style={{ ...cell, fontWeight: 600 }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id}>
                      <td style={cell}>{r.day}</td>
                      <td style={cell}>{r.quizTitle || relId(r.quiz)}</td>
                      <td style={cell}>{r.round}</td>
                      <td style={cell}>{r.status === 'completed' ? 'Finished' : 'Not finished'}</td>
                      <td style={cell}>{r.status === 'completed' ? (r.score ?? 0) : '-'}</td>
                      <td style={cell}>{r.attempt ? `${r.attempt.correctAnswers ?? 0}/${r.attempt.totalQuestions ?? '-'}` : '-'}</td>
                      <td style={cell}>{r.attempt?.timeTaken != null ? `${r.attempt.timeTaken}s` : '-'}</td>
                      <td style={cell}>{fmt(r.createdAt)}</td>
                      <td style={cell}>{fmt(r.completedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  )
}
