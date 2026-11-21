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

/** Sets the cookie that server pages use to recognise the logged-in player. */
export function setPlayerCookie(res: NextResponse, token: string): void {
  res.cookies.set('payload-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: THIRTY_DAYS_SECONDS,
  })
}
