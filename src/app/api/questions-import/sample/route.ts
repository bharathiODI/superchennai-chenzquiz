import * as XLSX from 'xlsx'
import { sampleWorkbook } from '@/utilities/questionImport'

// GET /api/questions-import/sample?format=xlsx|csv -> the sample file for Import Questions
export async function GET(req: Request) {
  const format = new URL(req.url).searchParams.get('format') === 'csv' ? 'csv' : 'xlsx'
  const wb = sampleWorkbook()
  if (format === 'csv') {
    const csv = XLSX.utils.sheet_to_csv(wb.Sheets['Questions']!)
    return new Response('﻿' + csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="chenzquiz-questions-sample.csv"',
      },
    })
  }
  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer
  return new Response(new Uint8Array(buf), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="chenzquiz-questions-sample.xlsx"',
    },
  })
}
