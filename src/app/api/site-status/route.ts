import { headers as getHeaders } from 'next/headers'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { readSiteFlags, writeSiteFlags } from '@/utilities/siteFlags'
import { demoUsesLiveData } from '@/utilities/siteEnv'
import { ADMINS, userHas } from '@/access/roles'

export const dynamic = 'force-dynamic'

const PLAYING_WINDOW_MIN = 15 // a round takes a couple of minutes; older open rounds were abandoned

const relId = (v: any) => (v && typeof v === 'object' ? v.id : v)

async function cmsAdmin() {
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: await getHeaders() })
  const ok = userHas(user, ADMINS)
  return { payload, user: ok ? (user as any) : null }
}

// GET /api/site-status -> { maintenance, message } for everyone.
// CMS admins also get the players mid-round right now (for safe deploys).
export async function GET() {
  const flags = readSiteFlags()
  const base = { maintenance: flags.maintenance, message: flags.message, demoLiveData: demoUsesLiveData() }
  const { payload, user } = await cmsAdmin()
  if (!user) return NextResponse.json(base, { headers: { 'Cache-Control': 'no-store' } })

  const since = new Date(Date.now() - PLAYING_WINDOW_MIN * 60_000).toISOString()
  const recent = new Date(Date.now() - 5 * 60_000).toISOString()
  const [open, finished] = await Promise.all([
    payload.find({
      collection: 'quiz-rounds' as any,
      where: { and: [{ status: { equals: 'assigned' } }, { createdAt: { greater_than_equal: since } }] },
      depth: 1,
      limit: 500,
      sort: '-createdAt',
      overrideAccess: true,
    }),
    payload.count({
      collection: 'quiz-rounds' as any,
      where: { and: [{ status: { equals: 'completed' } }, { completedAt: { greater_than_equal: recent } }] },
      overrideAccess: true,
    }),
  ])
  const playing = (open.docs as any[]).map((r) => ({
    player: r.user?.name || `#${relId(r.user)}`,
    phone: r.user?.phone || '',
    quiz: r.quiz?.quizTitle || r.quiz?.title || `#${relId(r.quiz)}`,
    startedAt: r.createdAt,
    minutesAgo: Math.max(0, Math.round((Date.now() - Date.parse(r.createdAt)) / 60_000)),
  }))
  return NextResponse.json(
    { ...base, since: flags.since, by: flags.by, playing, playingWindowMin: PLAYING_WINDOW_MIN, finishedLast5Min: finished.totalDocs },
    { headers: { 'Cache-Control': 'no-store' } },
  )
}

// POST /api/site-status { maintenance: true|false, message? } - CMS admins only.
export async function POST(req: Request) {
  const { user } = await cmsAdmin()
  if (!user) return NextResponse.json({ error: 'Only CMS admins can change this.' }, { status: 403 })
  const body = await req.json().catch(() => ({}))
  if (typeof body?.maintenance !== 'boolean') {
    return NextResponse.json({ error: 'maintenance must be true or false' }, { status: 400 })
  }
  try {
    const flags = writeSiteFlags({ maintenance: body.maintenance, message: body.message, by: user.email })
    return NextResponse.json({ maintenance: flags.maintenance, message: flags.message, since: flags.since, by: flags.by })
  } catch (err: any) {
    console.error('site-status write error:', err?.message || err)
    return NextResponse.json({ error: 'Could not save the switch on the server.' }, { status: 500 })
  }
}
