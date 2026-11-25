'use client'

import { useState } from 'react'

type Row = {
  row: number
  useIn: string
  question: string
  options: string[]
  correctLetter: string
  topic: string
  points: number
  errors: string[]
}
const USE: Record<string, string> = { general: 'General', sponsored: 'Sponsored', both: 'Both', none: 'Not in play' }

export function ImportQuestionsClient({ quizzes }: { quizzes: { id: number; title: string; live: boolean }[] }) {
  const live = quizzes.find((q) => q.live)
  const [quiz, setQuiz] = useState<string>(live ? String(live.id) : String(quizzes[0]?.id ?? ''))
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<'published' | 'draft'>('published')
  const [rows, setRows] = useState<Row[] | null>(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string; link?: string } | null>(null)

  const send = async (mode: 'preview' | 'import') => {
    if (!file) return
    setBusy(true)
    setMsg(null)
    try {
      const fd = new FormData()
      fd.set('file', file)
      fd.set('quiz', quiz)
      fd.set('status', status)
      fd.set('mode', mode)
      const r = await fetch('/api/questions-import', { method: 'POST', body: fd, credentials: 'include' })
      const j = await r.json().catch(() => ({}))
      if (!r.ok) {
        setMsg({ kind: 'err', text: j.error || `Failed (${r.status})` })
        return
      }
      if (mode === 'preview') {
        setRows(j.rows)
        if (!j.rows.length) setMsg({ kind: 'err', text: 'No questions found in the file.' })
      } else {
        setRows(null)
        const failed = (j.failed || []) as { row: number; error: string }[]
        setMsg({
          kind: failed.length ? 'err' : 'ok',
          text:
            `${j.created} question${j.created === 1 ? '' : 's'} imported${status === 'draft' ? ' as drafts' : ' and published'}.` +
            (j.skipped ? ` ${j.skipped} row(s) with problems were skipped.` : '') +
            (failed.length ? ` Not saved: ${failed.map((f) => `row ${f.row} (${f.error})`).join('; ')}` : ''),
          link: `/admin/collections/questions?where[quiz][equals]=${j.quizId}&sort=-createdAt`,
        })
      }
    } finally {
      setBusy(false)
    }
  }

  const good = rows?.filter((r) => !r.errors.length).length ?? 0
  const bad = (rows?.length ?? 0) - good

  return (
    <>
      <div className="qd-card qd-filterbox">
        <div className="qd-frow">
          <span className="qd-flabel">1. Sample</span>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- a file download, not a page */}
          <a className="qd-btn" href="/api/questions-import/sample?format=xlsx" download>
            Download sample (Excel)
          </a>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- a file download, not a page */}
          <a className="qd-reset" href="/api/questions-import/sample?format=csv" download>
            or CSV
          </a>
          <span className="qd-sub">
            Columns: use_in (GENERAL / SPONSORED / BOTH), question, option_a to option_f, correct (a letter), topic, explanation, points.
          </span>
        </div>
        <div className="qd-frow">
          <span className="qd-flabel">2. File</span>
          <label className="qd-field">
            Quiz{' '}
            <select className="qd-input" value={quiz} onChange={(e) => setQuiz(e.target.value)}>
              {quizzes.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.title}
                  {q.live ? ' (live)' : ''}
                </option>
              ))}
            </select>
          </label>
          <input
            className="qd-input"
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={(e) => {
              setFile(e.target.files?.[0] ?? null)
              setRows(null)
              setMsg(null)
            }}
          />
          <button className="qd-btn" type="button" disabled={!file || busy} onClick={() => send('preview')}>
            {busy && !rows ? 'Checking...' : 'Check file'}
          </button>
        </div>
        {rows && rows.length > 0 && (
          <div className="qd-frow">
            <span className="qd-flabel">3. Import</span>
            <label className="qd-field">
              Save as{' '}
              <select className="qd-input" value={status} onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}>
                <option value="published">Published (in play straight away)</option>
                <option value="draft">Drafts (publish later)</option>
              </select>
            </label>
            <button className="qd-btn" type="button" disabled={busy || !good} onClick={() => send('import')}>
              {busy ? 'Importing...' : `Import ${good} question${good === 1 ? '' : 's'}`}
            </button>
            {bad > 0 && <span className="qd-sub">{bad} row(s) with problems will be skipped - fix them in the file and check again.</span>}
          </div>
        )}
      </div>

      {msg && (
        <div className={`qd-card qd-msg qd-msg--${msg.kind}`}>
          {msg.text}{' '}
          {msg.link && (
            <a href={msg.link} className="qd-reset">
              See the questions
            </a>
          )}
        </div>
      )}

      {rows && rows.length > 0 && (
        <div className="qd-card qd-table-wrap">
          <table className="qd-table qd-import">
            <thead>
              <tr>
                <th>Row</th>
                <th>Check</th>
                <th>Use in</th>
                <th>Question</th>
                <th>Options</th>
                <th>Answer</th>
                <th>Topic</th>
                <th className="r">Points</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.row} className={r.errors.length ? 'qd-row-bad' : ''}>
                  <td className="muted">{r.row}</td>
                  <td>{r.errors.length ? <span className="qd-bad">{r.errors.join('; ')}</span> : <span className="qd-ok">OK</span>}</td>
                  <td>{USE[r.useIn] ?? '-'}</td>
                  <td className="strong">{r.question || '-'}</td>
                  <td>{r.options.map((o, i) => `${'ABCDEF'[i]}. ${o}`).join('  ')}</td>
                  <td>{r.correctLetter ? `${r.correctLetter}. ${r.options[r.correctLetter.charCodeAt(0) - 65] ?? ''}` : '-'}</td>
                  <td>{r.topic || '-'}</td>
                  <td className="r">{r.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
