// @ts-nocheck -- vendored kit source, type-checked under the kit's own settings, not this app's stricter tsconfig (see packages/payload-builder/VENDORED.md)
'use client'

import React from 'react'
import { useAllFormFields } from '@payloadcms/ui'

/**
 * Download links for the files sent with a form submission (CVs etc.), in
 * the admin. A submission stores each file as its URL in the uploads
 * collection; that route only serves logged-in staff, so the links work
 * here and nowhere else.
 */

type Row = { label?: string | null; name?: string | null; value?: string | null }
type FileLink = { filename: string; label: string; url: string }

const filesFrom = (rows: Row[], uploadsSlug: string): FileLink[] => {
  const marker = `/api/${uploadsSlug}/file/`
  return rows.flatMap((row) => {
    const value = typeof row.value === 'string' ? row.value.trim() : ''
    const at = value.indexOf(marker)
    if (at < 0) return []
    const path = value.slice(at)
    let filename = path.slice(marker.length)
    try {
      filename = decodeURIComponent(filename)
    } catch {
      /* keep as is */
    }
    return [{ filename, label: row.label || row.name || 'File', url: path }]
  })
}

const linkStyle: React.CSSProperties = { marginInlineStart: 12, whiteSpace: 'nowrap' }

/** Edit view: one line per file with Download / Open. Renders nothing when there are none. */
export const SubmissionFilesField: React.FC<{ uploadsSlug?: string }> = ({ uploadsSlug = 'media' }) => {
  const [fields] = useAllFormFields()
  const rows: Row[] = []
  for (const [key, state] of Object.entries(fields)) {
    const m = /^data\.(\d+)\.(label|name|value)$/.exec(key)
    if (!m) continue
    const i = Number(m[1])
    rows[i] = { ...rows[i], [m[2]]: state?.value as string }
  }
  const files = filesFrom(rows.filter(Boolean), uploadsSlug)
  if (!files.length) return null

  return (
    <div className="field-type" style={{ marginBottom: 24 }}>
      <label className="field-label">Files</label>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {files.map((f) => (
          <li key={f.url} style={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 4, padding: '6px 0' }}>
            <strong>{f.label}:</strong>&nbsp;<span>{f.filename}</span>
            <a className="btn btn--style-primary btn--size-small" download={f.filename} href={f.url} style={{ ...linkStyle, margin: '0 0 0 12px' }}>
              Download
            </a>
            <a href={f.url} rel="noopener noreferrer" style={linkStyle} target="_blank">
              Open
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** List view: a download link per file, "—" when the submission has none. */
export const SubmissionFilesCell: React.FC<{ rowData?: { data?: Row[] | null }; uploadsSlug?: string }> = ({
  rowData,
  uploadsSlug = 'media',
}) => {
  const files = filesFrom(rowData?.data ?? [], uploadsSlug)
  if (!files.length) return <span>—</span>
  return (
    <span>
      {files.map((f, i) => (
        <a download={f.filename} href={f.url} key={f.url} onClick={(e) => e.stopPropagation()} style={i ? linkStyle : undefined}>
          Download {f.filename.length > 28 ? `${f.filename.slice(0, 25)}…` : f.filename}
        </a>
      ))}
    </span>
  )
}
