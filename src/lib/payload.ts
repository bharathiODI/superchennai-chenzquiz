const PAYLOAD_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export async function fetchDailyQuiz() {
  const today = new Date().toISOString().split('T')[0]
  const res = await fetch(
    `${PAYLOAD_URL}/api/quizzes?where[quizDate][equals]=${today}&where[status][equals]=active&depth=2`,
    { cache: 'no-store' }
  )
  const data = await res.json()
  return data.docs?.[0] || null
}

export async function submitQuizScore(token: string, quizId: string, userId: string, score: number) {
  const res = await fetch(`${PAYLOAD_URL}/api/user-submissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify({
      user: userId,
      quiz: quizId,
      score: score,
    }),
  })
  return res.json()
}