import { headers as getHeaders } from 'next/headers'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import * as XLSX from 'xlsx'

import { REPORT_READERS, userHas } from '@/access/roles'
import { describeFilters, EXPORT_LIMIT, loadAllRows, parseFilters } from '@/components/admin/QuizDashboard/data'
import { formatStartHour } from '@/utilities/gameDay'
import { getGameDaySettings } from '@/utilities/getGameTimers'
import { addSheet, istDate, istDateTime, istStamp, xlsxResponse } from '@/utilities/xlsxSheets'

// GET /api/reports/dashboard?<the Quiz Dashboard's filters> -> the filtered rows as Excel.
// Same filters and queries as the dashboard, every page. Super Admin, Administrator, Editor,
// Viewer (the file has players' phone numbers and emails).
export async function GET(request: Request) {
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: await getHeaders() })
  if (!userHas(user, REPORT_READERS)) {
    return NextResponse.json({ error: 'Only CMS admins, editors and viewers can export reports.' }, { status: 403 })
  }

  const sp = Object.fromEntries(new URL(request.url).searchParams.entries())
  const f = parseFilters(sp)
  const { rows, total } = await loadAllRows(payload, f)
  const gd = await getGameDaySettings(payload)
  const quizTitle = f.quizId
    ? String(
        ((await payload.findByID({ collection: 'quizzes', id: f.quizId, depth: 0, overrideAccess: true }).catch(() => null)) as any)
          ?.quizTitle ?? `Quiz ${f.quizId}`,
      )
    : undefined
  const active = describeFilters(f, quizTitle)
  const num = (v: unknown) => (v === null || v === undefined || v === '' ? '' : Number(v))

  let out: Record<string, unknown>[] = []
  let sheetName = ''
  if (f.tab === 'players') {
    sheetName = 'Players'
    out = rows.map((r, i) => ({
      '#': i + 1,
      Name: r.name ?? '',
      Phone: r.phone ?? '',
      Email: r.email ?? '',
      'Days played': num(r.days),
      'Finished plays': num(r.rounds),
      Points: num(r.points),
      'Time (s)': num(Math.round(Number(r.secs) || 0)),
      'Current streak': num(r.streak),
      'Best streak': num(r.best),
      'Last played (India time)': istDateTime(r.last_at),
      Joined: istDate(r.created_at),
    }))
  } else if (f.tab === 'plays' || f.tab === 'flags') {
    sheetName = f.tab === 'flags' ? 'Flags' : 'Plays'
    out = rows.map((r) => ({
      Player: r.name ?? '',
      Phone: r.phone ?? '',
      Email: r.email ?? '',
      Quiz: r.quiz ?? '',
      'Game day': r.game_day ?? '',
      Status: r.status === 'completed' ? 'Finished' : 'Opened, not finished',
      Score: num(r.score),
      Correct: num(r.correct_answers),
      Questions: num(r.questions),
      'Time (s)': num(r.time_taken),
      'Too fast': r.too_fast ? 'yes' : '',
      'Linked numbers': r.linked ? 'yes' : '',
      Disqualified: r.disqualified ? 'yes' : '',
      ...(f.tab === 'flags' ? { 'Other numbers on this phone': r.same_device ?? '', 'Device ID': r.device_id ?? '', 'IP address': r.ip ?? '' } : {}),
      'Finished at (India time)': istDateTime(r.completed_at),
    }))
  } else if (f.tab === 'questions') {
    sheetName = 'Questions'
    out = rows.map((r) => ({
      ID: r.id,
      Question: r.question ?? '',
      'Use in': r.use_in ?? '',
      Status: r.status ?? '',
      Quiz: r.quiz ?? '',
      Given: num(r.given),
      Answered: num(r.answered),
      Right: num(r.correct),
      'Right %': num(r.pct),
      'Time-outs': num(r.timeouts),
      'Avg time (s)': num(r.secs),
      'Last given': r.last_day ?? '',
    }))
  } else {
    sheetName = 'Sponsor report'
    out = rows.map((r) => ({
      'Game day': r.game_day,
      'Players who saw it': num(r.players),
      Answered: num(r.answered),
      Right: num(r.correct),
      'Right %': num(r.pct),
      'Time-outs': num(r.timeouts),
      'Avg time (s)': num(r.secs),
      'Sponsored questions used': num(r.questions),
    }))
  }

  const wb = XLSX.utils.book_new()
  addSheet(wb, out, sheetName, 'Nothing matches these filters.')
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet([
      [`Chenz Quiz - ${sheetName.toLowerCase()} (filtered)`],
      [],
      ['Rows', total > EXPORT_LIMIT ? `${EXPORT_LIMIT} of ${total} (narrow the filters for the rest)` : total],
      ['Filters', active.length ? active.join(' · ') : 'None (everything)'],
      ['Downloaded', `${new Date().toLocaleString('en-GB', { timeZone: 'Asia/Kolkata' })} (India time) by ${(user as any)?.email ?? ''}`],
      ['Game day', `Starts at ${formatStartHour(gd)} India time. Points, plays and days are for the chosen game days.`],
      ['Streaks', 'Current streak: game days in a row up to today or yesterday. Best streak: longest run ever.'],
    ]),
    'Filters',
  )
  const slug = sheetName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  return xlsxResponse(wb, `chenzquiz-${slug}-${istStamp()}${active.length ? '-filtered' : ''}.xlsx`)
}
