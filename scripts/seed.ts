/**
 * Imports the starting data. Safe to run again: nothing that already exists is changed.
 *
 *   npm run seed
 *   (on the server: cd /var/www/chenzquiz/current && npm run seed)
 *
 * - Quiz Site Settings: default text and options, only if they were never saved
 * - Test players: Test Player 1-5 (see src/utilities/testPlayers.ts)
 * - Home page: adds the "Ready to Play Chenz Quiz?" rewards section if it is missing
 *
 * Run `npm run db:migrate` first if the database is new (deploys do this automatically).
 */
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { seedHomeRewards } from './seeds/homeRewards'
import { seedSiteSettings } from './seeds/siteSettings'
import { seedTestPlayers } from './seeds/testPlayers'

async function main() {
  // Outside production Payload "pushes" its schema to the database on start-up. Seeding only adds
  // rows, so never let it touch the tables (important when run on the live server).
  Object.assign(process.env, { NODE_ENV: 'production' })
  const payload = await getPayload({ config: configPromise })

  await seedSiteSettings(payload)
  await seedTestPlayers(payload)
  await seedHomeRewards(payload)

  console.log('\nSeed finished.\n')
  process.exit(0)
}

// `payload run` exits as soon as this module finishes loading (Payload 3.87),
// so the script has to await its work at the top level.
await main().catch((error) => {
  console.error(error)
  process.exit(1)
})
