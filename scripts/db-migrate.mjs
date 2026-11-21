#!/usr/bin/env node
/**
 * Applies the SQL files in /migrations (in name order) that haven't run yet, each in its own
 * transaction, and records them in the `app_migrations` table.
 *
 *   npm run db:migrate          (deploy.sh runs this before every build)
 *
 * Why not `payload migrate`? On a database that was ever schema-pushed in dev mode, Payload
 * stops to ask a yes/no question; an unattended deploy can't answer it and the migration is
 * silently skipped. These files are plain, repeatable SQL (IF NOT EXISTS), generated from the
 * Payload schema diff, so running one twice does no harm.
 */
import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dir = path.join(root, 'migrations')

if (!process.env.DATABASE_URI) {
  console.error('DATABASE_URI is not set')
  process.exit(1)
}

const files = fs.existsSync(dir)
  ? fs.readdirSync(dir).filter((f) => f.endsWith('.sql')).sort()
  : []

const client = new pg.Client({ connectionString: process.env.DATABASE_URI })
await client.connect()

try {
  await client.query(`CREATE TABLE IF NOT EXISTS app_migrations (
    name varchar PRIMARY KEY,
    applied_at timestamptz NOT NULL DEFAULT now()
  )`)
  const { rows } = await client.query('SELECT name FROM app_migrations')
  const done = new Set(rows.map((r) => r.name))
  const pending = files.filter((f) => !done.has(f))

  if (!pending.length) console.log(`Database is up to date (${files.length} migration(s) applied).`)

  for (const file of pending) {
    const sql = fs.readFileSync(path.join(dir, file), 'utf8')
    console.log(`Applying ${file}`)
    await client.query('BEGIN')
    try {
      await client.query(sql)
      await client.query('INSERT INTO app_migrations (name) VALUES ($1)', [file])
      await client.query('COMMIT')
    } catch (error) {
      await client.query('ROLLBACK')
      console.error(`Migration ${file} failed - nothing from it was applied.`)
      throw error
    }
  }
} finally {
  await client.end()
}
