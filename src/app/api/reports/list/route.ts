import { headers as getHeaders } from 'next/headers'
import { NextResponse } from 'next/server'
import { flattenTopLevelFields, getPayload, type Field, type Where } from 'payload'
import configPromise from '@payload-config'
import { parse } from 'qs-esm'
import * as XLSX from 'xlsx'

import { ADMINS, userHas } from '@/access/roles'
import { addSheet, istDateTime, istStamp, xlsxResponse } from '@/utilities/xlsxSheets'

// GET /api/reports/list?collection=<slug>&search=...&where[...]=...&sort=...
// The CMS list's own search, filters and sort -> every matching row as Excel.
// Super Admins / Administrators, Players & Scores lists only; read with the user's own access.
const ALLOWED = ['quiz-users', 'quiz-rounds', 'quiz-answers', 'quiz-attempts', 'user-submissions'] as const
const MAX_ROWS = 50_000
const SKIP_TYPES = new Set(['ui', 'join', 'richText', 'blocks', 'password'])

const labelOf = (f: any): string => {
  const l = f.label
  if (typeof l === 'string' && l) return l
  if (l && typeof l === 'object' && typeof l.en === 'string') return l.en
  return String(f.name)
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, (c) => c.toUpperCase())
}
const titleOf = (v: any): string => {
  if (v === null || v === undefined) return ''
  if (typeof v !== 'object') return String(v)
  return String(v.name ?? v.title ?? v.quizTitle ?? v.email ?? v.phone ?? v.filename ?? v.id ?? '')
}
const short = (v: unknown) => {
  const s = JSON.stringify(v)
  return s && s.length > 300 ? `${s.slice(0, 297)}...` : (s ?? '')
}

function cell(field: any, v: any): unknown {
  if (v === null || v === undefined) return ''
  switch (field.type) {
    case 'relationship':
    case 'upload':
      return Array.isArray(v) ? v.map((x) => titleOf(x?.value ?? x)).join(', ') : titleOf(v?.value ?? v)
    case 'date':
      return istDateTime(v)
    case 'checkbox':
      return v ? 'Yes' : 'No'
    case 'array':
      return Array.isArray(v) ? `${v.length} item(s): ${short(v)}` : short(v)
    case 'group':
    case 'json':
    case 'point':
      return short(v)
    case 'select':
      return Array.isArray(v) ? v.join(', ') : v
    default:
      return typeof v === 'object' ? short(v) : v
  }
}

export async function GET(request: Request) {
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: await getHeaders() })
  if (!userHas(user, ADMINS)) {
    return NextResponse.json({ error: 'Only Super Admins and Administrators can export these lists.' }, { status: 403 })
  }
  const q = parse(new URL(request.url).search.slice(1), { depth: 10, arrayLimit: 1000 }) as Record<string, any>
  const slug = String(q.collection ?? '') as (typeof ALLOWED)[number]
  if (!ALLOWED.includes(slug)) return NextResponse.json({ error: 'This list has no export.' }, { status: 400 })
  const coll = payload.collections[slug].config

  // Same where as the list: its filters, plus the search box over its searchable fields
  let where: Where = q.where && typeof q.where === 'object' ? (q.where as Where) : {}
  const search = typeof q.search === 'string' ? q.search.trim() : ''
  if (search) {
    const fields: string[] = (coll.admin?.listSearchableFields as string[] | undefined)?.length
      ? (coll.admin!.listSearchableFields as string[])
      : [coll.admin?.useAsTitle].filter((x): x is string => Boolean(x) && x !== 'id')
    if (fields.length) {
      const or: Where[] = fields.map((f) => ({ [f]: { like: search } }))
      where = Object.keys(where).length ? { and: [where, { or }] } : { or }
    }
  }
  const sort = typeof q.sort === 'string' && q.sort ? q.sort : '-createdAt'

  let res
  try {
    res = await payload.find({
      collection: slug,
      where,
      sort,
      depth: 1,
      limit: MAX_ROWS,
      pagination: false,
      overrideAccess: false,
      user,
    })
  } catch (e) {
    return NextResponse.json({ error: `Couldn't read the list with these filters: ${(e as Error).message}` }, { status: 400 })
  }

  const fields = (flattenTopLevelFields(coll.fields as Field[]) as any[]).filter(
    (f) => f.name && !SKIP_TYPES.has(f.type) && !f.hidden && !['id', 'createdAt', 'updatedAt'].includes(f.name),
  )
  const rows = res.docs.map((doc: any) => {
    const row: Record<string, unknown> = { ID: doc.id }
    for (const f of fields) row[labelOf(f)] = cell(f, doc[f.name])
    row['Created (India time)'] = istDateTime(doc.createdAt)
    row['Updated (India time)'] = istDateTime(doc.updatedAt)
    return row
  })

  const name = typeof coll.labels?.plural === 'string' ? coll.labels.plural : slug
  const filtered = Boolean(search) || Object.keys(q.where ?? {}).length > 0
  const wb = XLSX.utils.book_new()
  addSheet(wb, rows, name, 'Nothing matches these filters.')
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet([
      [`Chenz Quiz - ${name}`],
      [],
      ['Rows', rows.length >= MAX_ROWS ? `${MAX_ROWS} (limit - narrow the filters)` : rows.length],
      ['Search', search || '-'],
      ['Filters', Object.keys(q.where ?? {}).length ? JSON.stringify(q.where) : '-'],
      ['Sort', sort],
      ['Downloaded', `${new Date().toLocaleString('en-GB', { timeZone: 'Asia/Kolkata' })} (India time) by ${(user as any)?.email ?? ''}`],
    ]),
    'Filters',
  )
  return xlsxResponse(wb, `chenzquiz-${slug}-${istStamp()}${filtered ? '-filtered' : ''}.xlsx`)
}
