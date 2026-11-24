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
      Rounds: num(r.rounds),
      Points: num(r.points),
      'Time (s)': num(Math.round(Number(r.secs) || 0)),
      'Current streak': num(r.streak),
      'Best streak': num(r.best),
      'Last played (India time)': istDateTime(r.last_at),
      Joined: istDate(r.created_at),
    }))
  } else if (f.tab === 'attempts') {
    sheetName = 'Attempts'
    out = rows.map((r) => ({
      ID: r.id,
      Player: r.name ?? '',
      Phone: r.phone ?? '',
      Email: r.email ?? '',
      Quiz: r.quiz ?? '',
      'Game day': r.game_day ?? '',
      Round: num(r.round),
      Score: num(r.score),
      Correct: num(r.correct_answers),
      Questions: num(r.total_questions),
      'Time (s)': num(r.time_taken),
      'Finished at (India time)': istDateTime(r.completed_at),
    }))
  } else {
    sheetName = 'Quiz details'
    out = rows.map((r) => ({
      ID: r.id,
      Quiz: r.title,
      Status: r.status ?? '',
      Starts: istDateTime(r.quiz_date),
      Ends: istDateTime(r.quiz_end_date),
      'Rounds a day': num(r.rounds_per_day),
      'Questions a round': num(r.questions_per_round),
      'Question pool': num(r.pool),
      'Pool published': num(r.pool_live),
      Players: num(r.players),
      'Played today': num(r.players_today),
      'Finished rounds': num(r.attempts),
      'Average score': num(r.avg_score),
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
      ['Game day', `Starts at ${formatStartHour(gd)} India time. Points, rounds and days are for the chosen game days.`],
      ['Streaks', 'Current streak: game days in a row up to today or yesterday. Best streak: longest run ever.'],
    ]),
    'Filters',
  )
  const slug = sheetName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  return xlsxResponse(wb, `chenzquiz-${slug}-${istStamp()}${active.length ? '-filtered' : ''}.xlsx`)
}
