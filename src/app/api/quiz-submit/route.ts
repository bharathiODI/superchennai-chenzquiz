import { NextResponse } from 'next/server'

// Retired (25 Nov 2026): answers are now checked one by one on the server (/api/quiz-answer).
// A page opened before the update ends up here - it only needs a reload.
export async function POST() {
  return NextResponse.json(
    { success: false, reload: true, error: 'The quiz was updated. Please reload the page to continue.' },
    { status: 410 },
  )
}
