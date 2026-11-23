'use client'
// "Download scores" box shown above the Quiz Rounds and Quiz Users lists (CMS admins only).
import { useAuth } from '@payloadcms/ui'
import { useEffect, useState } from 'react'

type Quiz = { id: number | string; quizTitle?: string; title?: string }

export function ScoreExport() {
  const { user } = useAuth<any>()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [quiz, setQuiz] = useState<string>('')
  const [withTest, setWithTest] = useState(false)

  useEffect(() => {
    fetch('/api/quizzes?limit=100&depth=0&sort=-quizDate', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => {
        const list: Quiz[] = d?.docs || []
        setQuizzes(list)
        if (list[0]) setQuiz(String(list[0].id))
      })
      .catch(() => {})
  }, [])

  if (user?.role !== 'admin') return null

  const href = `/api/reports/scores?${new URLSearchParams({ ...(quiz ? { quiz } : {}), ...(withTest ? { test: '1' } : {}) })}`

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 12,
        padding: '12px 16px',
        margin: '0 0 16px',
        border: '1px solid var(--theme-elevation-150)',
        borderRadius: 4,
        background: 'var(--theme-elevation-50)',
      }}
    >
      <strong>Download scores (Excel)</strong>
      <select
        value={quiz}
        onChange={(e) => setQuiz(e.target.value)}
        style={{ padding: '6px 8px', background: 'var(--theme-input-bg)', color: 'var(--theme-text)', border: '1px solid var(--theme-elevation-150)', borderRadius: 4 }}
      >
        {quizzes.map((q) => (
          <option key={q.id} value={String(q.id)}>
            {q.quizTitle || q.title || `Quiz ${q.id}`}
          </option>
        ))}
        <option value="">All quizzes</option>
      </select>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <input type="checkbox" checked={withTest} onChange={(e) => setWithTest(e.target.checked)} />
        Include test players
      </label>
      <a className="btn btn--style-primary btn--size-small" style={{ margin: 0 }} href={href}>
        Download
      </a>
      <span style={{ color: 'var(--theme-elevation-500)', fontSize: 13 }}>
        Day-wise totals, daily ranking and every round in detail.
      </span>
    </div>
  )
}
