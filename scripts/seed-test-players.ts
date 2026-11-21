/**
 * Creates the test players described in src/utilities/testPlayers.ts. Safe to run again.
 *
 *   cd /var/www/chenzquiz/current && NODE_ENV=production npx payload run scripts/seed-test-players.ts
 *
 * Test players log in with their number (typed without +91) and the TEST_OTP from the
 * server .env. They never appear on the leaderboard or in the /dashboard stats.
 */
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { TEST_PLAYER_PHONES, getTestOtp } from '../src/utilities/testPlayers'

const HOW_MANY = 5

async function main() {
  // Outside production Payload "pushes" its schema to the database on start-up. This script only
  // adds rows, so never let it touch the tables (important when run on the live server).
  Object.assign(process.env, { NODE_ENV: 'production' })
  const payload = await getPayload({ config: configPromise })

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
      ? '\nLog in at /login with one of the numbers above and the TEST_OTP code from the .env file.\n'
      : '\nTEST_OTP is not set: add TEST_OTP=<6 digits> to the .env file and restart the app to turn test logins on.\n',
  )
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
