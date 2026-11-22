import { NextResponse } from 'next/server'
import { clearPlayerCookie } from '@/utilities/playerSession'

export const dynamic = 'force-dynamic'

// POST /api/quiz-users/logout -> logs the player out by removing the login cookie.
// (Payload's own /api/users/logout is for CMS staff and refuses a player's login, which is why
// the Logout buttons used to leave players logged in.)
export async function POST() {
  const res = NextResponse.json({ message: 'Logged out' }, { headers: { 'Cache-Control': 'no-store' } })
  clearPlayerCookie(res)
  return res
}
