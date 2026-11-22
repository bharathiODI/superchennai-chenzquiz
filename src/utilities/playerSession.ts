import { SignJWT } from 'jose'
import type { NextResponse } from 'next/server'
import type { Payload } from 'payload'

const THIRTY_DAYS_SECONDS = 2592000

/** Signs the 30-day login token for a quiz player (same format Payload expects for quiz-users). */
export async function issuePlayerToken(
  payload: Payload,
  user: { id: number | string; email?: string | null; phone?: string | null },
): Promise<string> {
  const secretKey = new TextEncoder().encode(payload.secret)
  return new SignJWT({
    id: user.id,
    collection: 'quiz-users',
    email: user.email || user.phone,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('30d')
    .sign(secretKey)
}

const PLAYER_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
}

/** Sets the cookie that server pages use to recognise the logged-in player. */
export function setPlayerCookie(res: NextResponse, token: string): void {
  res.cookies.set('payload-token', token, { ...PLAYER_COOKIE_OPTIONS, maxAge: THIRTY_DAYS_SECONDS })
}

/** Removes the player's login cookie (same name/path/flags as setPlayerCookie, so the browser drops it). */
export function clearPlayerCookie(res: NextResponse): void {
  res.cookies.set('payload-token', '', { ...PLAYER_COOKIE_OPTIONS, maxAge: 0, expires: new Date(0) })
}
