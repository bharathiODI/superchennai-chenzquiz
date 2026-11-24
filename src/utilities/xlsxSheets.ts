import { NextResponse } from 'next/server'
import * as XLSX from 'xlsx'

/** A sheet from row objects: column widths fitted, filter arrows on the header row. */
export function addSheet(wb: XLSX.WorkBook, rows: Record<string, unknown>[], name: string, empty: string) {
  const ws = rows.length ? XLSX.utils.json_to_sheet(rows) : XLSX.utils.aoa_to_sheet([[empty]])
  if (rows.length) {
    const keys = Object.keys(rows[0] ?? {})
    ws['!cols'] = keys.map((k) => ({
      wch: Math.min(60, Math.max(k.length, ...rows.slice(0, 500).map((r) => String(r[k] ?? '').length)) + 2),
    }))
    ws['!autofilter'] = { ref: XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: rows.length, c: keys.length - 1 } }) }
  }
  XLSX.utils.book_append_sheet(wb, ws, name.slice(0, 31))
}

export function xlsxResponse(wb: XLSX.WorkBook, filename: string) {
  const body = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer
  return new NextResponse(new Uint8Array(body), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${filename.replace(/[^a-zA-Z0-9._-]/g, '-')}"`,
      'Cache-Control': 'no-store',
    },
  })
}

const IST = 'Asia/Kolkata'
/** India date + time, e.g. "24 Nov 2026, 9:05 pm" ('' when empty) */
export const istDateTime = (v: unknown) =>
  v
    ? new Intl.DateTimeFormat('en-IN', {
        timeZone: IST,
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }).format(new Date(String(v)))
    : ''
/** India date, e.g. "24 Nov 2026" */
export const istDate = (v: unknown) =>
  v ? new Intl.DateTimeFormat('en-IN', { timeZone: IST, day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(String(v))) : ''
export const istStamp = () => new Date().toLocaleDateString('en-CA', { timeZone: IST })
