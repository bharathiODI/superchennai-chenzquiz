import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { demoToolsConfigured, isDemoDatabase } from '@/utilities/clock'
import { demoStatus, findOrCreatePlayer, moveClock, removeSimPlayers, resetPlayer, simulatePlayers } from '@/utilities/demoTools'
import { issuePlayerToken, setPlayerCookie } from '@/utilities/playerSession'
import { TEST_PLAYER_PHONES } from '@/utilities/testPlayers'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

const noStore = { 'Cache-Control': 'no-store' }
const json = (body: any, status = 200) => NextResponse.json(body, { status, headers: noStore })

async function guard(req: Request, needKey: boolean) {
  if (!demoToolsConfigured()) return { error: json({ enabled: false, error: 'Demo tools are off on this site' }, 404) }
  const payload = await getPayload({ config: configPromise })
  if (!(await isDemoDatabase(payload))) {
    return { error: json({ enabled: false, error: 'This site is not using a demo database (no demo_flag table). Demo tools stay off.' }, 409) }
  }
  if (needKey && req.headers.get('x-demo-key') !== process.env.DEMO_TOOLS_KEY) {
    return { error: json({ enabled: true, error: 'Wrong demo key' }, 403) }
  }
  return { payload }
}

// GET /api/demo/status -> pretend date for the banner (no key needed: nothing secret in it)
export async function GET(req: Request, { params }: { params: Promise<{ action: string }> }) {
  const { action } = await params
  if (action !== 'status') return json({ error: 'Not found' }, 404)
  const g = await guard(req, false)
  if (g.error) return g.error
  return json({ enabled: true, ...(await demoStatus(g.payload!)) })
}

// POST /api/demo/<action> with header x-demo-key
export async function POST(req: Request, { params }: { params: Promise<{ action: string }> }) {
  const { action } = await params
  const g = await guard(req, true)
  if (g.error) return g.error
  const payload = g.payload!
  const body = await req.json().catch(() => ({}))
  try {
    switch (action) {
      case 'check':
        return json({ ok: true })
      case 'clock':
        await moveClock(payload, String(body.op || ''), body.value)
        return json({ ok: true, ...(await demoStatus(payload)) })
      case 'login-as': {
        const phone = String(body.phone || '')
        const n = TEST_PLAYER_PHONES.indexOf(phone)
        if (n < 0) return json({ ok: false, error: 'Pick one of the 10 test numbers' }, 400)
        const user = await findOrCreatePlayer(payload, phone, `Test Player ${n + 1}`)
        const token = await issuePlayerToken(payload, user)
        const res = json({ ok: true, token, user })
        setPlayerCookie(res, token)
        return res
      }
      case 'reset-player':
        return json({ ok: true, reset: await resetPlayer(payload, String(body.phone || '')) })
      case 'reset-test-players': {
        let reset = 0
        for (const phone of TEST_PLAYER_PHONES) reset += await resetPlayer(payload, phone)
        return json({ ok: true, reset })
      }
      case 'simulate':
        return json({ ok: true, ...(await simulatePlayers(payload, Number(body.count) || 20)) })
      case 'remove-sim':
        return json({ ok: true, removed: await removeSimPlayers(payload) })
      default:
        return json({ ok: false, error: 'Unknown action' }, 404)
    }
  } catch (e: any) {
    return json({ ok: false, error: e?.message || 'Failed' }, 400)
  }
}
