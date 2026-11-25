// Shared bits for the play APIs: the logged-in player (session cookie only), device and network.
import { headers as getHeaders } from 'next/headers'
import type { Payload } from 'payload'

/** The player from the login cookie. The game never trusts a player id sent by the browser. */
export async function sessionPlayerId(payload: Payload): Promise<number | string | null> {
  const { user } = await payload.auth({ headers: await getHeaders() })
  return user && (user as any).collection === 'quiz-users' ? (user.id as any) : null
}

export async function requestDevice(): Promise<{ deviceId: string | null; ip: string | null }> {
  const h = await getHeaders()
  const raw = h.get('x-device-id') || ''
  const deviceId = /^[a-zA-Z0-9_-]{8,64}$/.test(raw) ? raw : null
  const ip = ((h.get('x-forwarded-for') || '').split(',')[0] ?? '').trim() || h.get('x-real-ip') || null
  return { deviceId, ip: ip ? ip.slice(0, 64) : null }
}
