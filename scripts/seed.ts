/**
 * Imports the starting content. Safe to run again: nothing that already exists is changed.
 *
 *   npm run seed            (on the server: cd /var/www/chenzquiz/current && npm run seed)
 *
 * - Home page: adds the "Ready to Play Chenz Quiz?" rewards section if it is missing
 *
 * Run `npm run db:migrate` first if the database is new (deploys do this automatically).
 */
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { seedHomeRewards } from './seeds/homeRewards'

async function main() {
  // Outside production Payload "pushes" its schema to the database on start-up. Seeding only adds
  // rows, so never let it touch the tables (important when run on the live server).
  Object.assign(process.env, { NODE_ENV: 'production' })
  const payload = await getPayload({ config: configPromise })

  await seedHomeRewards(payload)

  console.log('\nSeed finished.\n')
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
