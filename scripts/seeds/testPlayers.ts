import type { Payload } from 'payload'
import { TEST_PLAYER_PHONES, getTestOtp } from '../../src/utilities/testPlayers'

const HOW_MANY = 5

/** Creates Test Player 1-5 (numbers 0000000001-0000000005). Existing ones are left alone. */
export async function seedTestPlayers(payload: Payload): Promise<void> {
  console.log('\nTest players')
  for (const [i, phone] of TEST_PLAYER_PHONES.slice(0, HOW_MANY).entries()) {
    const name = `Test Player ${i + 1}`
    const login = phone.replace('+91', '')

    const existing = await payload.find({
      collection: 'quiz-users',
      where: { phone: { equals: phone } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })

    const found = existing.docs[0]
    if (found) {
      console.log(`  already there  ${login}  ${found.name}`)
      continue
    }

    await payload.create({
      collection: 'quiz-users',
      data: {
        name,
        phone,
        email: `test${i + 1}@superchennai.test`,
        message: 'Test account - hidden from the leaderboard and dashboard',
      },
      overrideAccess: true,
    })
    console.log(`  created        ${login}  ${name}`)
  }

  console.log(
    getTestOtp()
      ? '  Log in at /login with one of these numbers and the TEST_OTP code from the .env file.'
      : '  TEST_OTP is not set: add TEST_OTP=<6 digits> to the .env file and restart the app to turn test logins on.',
  )
}
