import { headers as getHeaders } from 'next/headers'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import * as XLSX from 'xlsx'
import { buildScoreReport } from '@/utilities/scoreReport'
import { formatStartHour } from '@/utilities/gameDay'
import { getGameDaySettings } from '@/utilities/getGameTimers'
import { REPORT_READERS, userHas } from '@/access/roles'

export const dynamic = 'force-dynamic'

// GET /api/reports/scores?quiz=19[&test=1] -> Excel file with the day-wise scores.
// CMS Super Admins, Administrators, Editors and Viewers (the file has players' phone numbers and emails).
export async function GET(req: Request) {
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: await getHeaders() })
  if (!userHas(user, REPORT_READERS)) {
    return NextResponse.json({ error: 'Only CMS admins, editors and viewers can download scores.' }, { status: 403 })
  }

  const params = new URL(req.url).searchParams
  const quizId = params.get('quiz') || null
  const includeTestPlayers = params.get('test') === '1'

  const report = await buildScoreReport(payload, { quizId, includeTestPlayers })
  const gameDay = await getGameDaySettings(payload)

  const wb = XLSX.utils.book_new()
  const sheet = (rows: Record<string, unknown>[], name: string, empty: string) => {
    const ws = rows.length ? XLSX.utils.json_to_sheet(rows) : XLSX.utils.aoa_to_sheet([[empty]])
    if (rows.length) {
      const keys = Object.keys(rows[0] ?? {})
      ws['!cols'] = keys.map((k) => ({
        wch: Math.min(60, Math.max(k.length, ...rows.slice(0, 500).map((r) => String(r[k] ?? '').length)) + 2),
      }))
      ws['!autofilter'] = { ref: XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: rows.length, c: keys.length - 1 } }) }
    }
    XLSX.utils.book_append_sheet(wb, ws, name)
  }
  sheet(report.summary, 'Day-wise scores', 'No finished rounds yet.')
  sheet(report.daily, 'Daily ranking', 'No finished rounds yet.')
  sheet(report.rounds, 'All rounds', 'No rounds yet.')
  const now = new Date()
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet([
      ['Chenz Quiz - scores'],
      [],
      ['Quiz', report.quizTitle],
      ['Downloaded', now.toLocaleString('en-GB', { timeZone: 'Asia/Kolkata' }) + ' (India time)'],
      ['Game day', `Starts at ${formatStartHour(gameDay)} India time and runs to the next day's start (Quiz Settings > Game day)`],
      ['Test players', includeTestPlayers ? 'Included' : 'Left out (numbers +91 00000 000xx)'],
      [],
      ['Day-wise scores', 'One row per player: score, time and when they played (India time) for each game day, then total score and total time (less time ranks higher on a tie).'],
      ['Daily ranking', "Each game day's players, best score first (ties: less time first)."],
      ['All rounds', 'Every round with its score, correct answers, time, start/finish and the questions asked.'],
    ]),
    'About',
  )

  const body = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer
  const slug = report.quizTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'quiz'
  const stamp = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })
  return new NextResponse(new Uint8Array(body), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="chenzquiz-scores-${slug}-${stamp}.xlsx"`,
      'Cache-Control': 'no-store',
    },
  })
}
