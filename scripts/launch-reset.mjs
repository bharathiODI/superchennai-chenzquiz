#!/usr/bin/env node
/**
 * ONE-TIME launch wipe: deletes all player data so the contest starts from zero.
 *
 *   npm run launch:reset                 shows what would be deleted (changes nothing)
 *   npm run launch:reset -- --confirm    deletes it, in one transaction
 *
 * Deleted: every quiz player (including the hidden test players), their quiz attempts, daily
 * rounds, XP/scores and streaks, user submissions and form-builder entries.
 * Kept: admin logins, pages, media, quizzes, questions, Header/Footer and all settings.
 *
 * IDs are NOT restarted on purpose: a tester's old login token carries a player id, and a new
 * player must never inherit it. Take a database backup first. Afterwards run `npm run seed` to
 * re-create the hidden test players.
 */
import 'dotenv/config'
import pg from 'pg'

const confirm = process.argv.includes('--confirm')

if (!process.env.DATABASE_URI) {
  console.error('DATABASE_URI is not set')
  process.exit(1)
}

// Children before parents. Rows in *_rels and array tables go with their parent (ON DELETE CASCADE).
const TABLES = [
  ['quiz_rounds', 'Daily rounds'],
  ['quiz_attempts', 'Quiz attempts (scores)'],
  ['user_submissions', 'User submissions'],
  ['form_submissions', 'Form entries'],
  ['quiz_users', 'Players (incl. test players)'],
]

const client = new pg.Client({ connectionString: process.env.DATABASE_URI })
await client.connect()

const exists = async (table) =>
  (await client.query('SELECT to_regclass($1) IS NOT NULL AS ok', [`public.${table}`])).rows[0].ok

const counts = async () => {
  const out = []
  for (const [table, label] of TABLES) {
    const n = (await exists(table))
      ? Number((await client.query(`SELECT count(*)::int AS n FROM "${table}"`)).rows[0].n)
      : null
    out.push([label, n])
  }
  return out
}

const print = (rows) => {
  for (const [label, n] of rows) console.log(`  ${label.padEnd(32)} ${n === null ? '(no table)' : n}`)
}

try {
  const db = new URL(process.env.DATABASE_URI)
  console.log(`\nDatabase: ${db.pathname.slice(1)} on ${db.hostname}\n`)
  console.log(confirm ? 'Deleting:' : 'Would delete:')
  print(await counts())

  if (!confirm) {
    console.log(
      '\nNothing was changed. Take a backup, then run:\n  npm run launch:reset -- --confirm\n',
    )
  } else {
    await client.query('BEGIN')
    try {
      // Never hand a deleted player's id to a new player: move each id counter past every id
      // used so far (some counters were left behind by past data imports).
      for (const [table] of TABLES) {
        if (!(await exists(table))) continue
        const { seq } = (await client.query(`SELECT pg_get_serial_sequence($1, 'id') AS seq`, [`"${table}"`])).rows[0]
        if (!seq) continue
        const { last_value, is_called } = (await client.query(`SELECT last_value, is_called FROM ${seq}`)).rows[0]
        const { max } = (await client.query(`SELECT COALESCE(MAX(id), 0)::bigint AS max FROM "${table}"`)).rows[0]
        const used = Math.max(Number(max), is_called ? Number(last_value) : Number(last_value) - 1)
        if (used >= 1) await client.query('SELECT setval($1, $2, true)', [seq, used])
      }
      for (const [table] of TABLES) if (await exists(table)) await client.query(`DELETE FROM "${table}"`)
      // Admin-panel locks and saved list preferences that belonged to deleted records
      await client.query(
        'DELETE FROM payload_locked_documents d WHERE NOT EXISTS (SELECT 1 FROM payload_locked_documents_rels r WHERE r.parent_id = d.id)',
      )
      await client.query(
        'DELETE FROM payload_preferences p WHERE NOT EXISTS (SELECT 1 FROM payload_preferences_rels r WHERE r.parent_id = p.id)',
      )
      await client.query('COMMIT')
    } catch (error) {
      await client.query('ROLLBACK')
      console.error('\nWipe failed - nothing was deleted.')
      throw error
    }
    console.log('\nDone. Now:')
    print(await counts())
    console.log('\nRe-create the hidden test players with: npm run seed\n')
  }
} finally {
  await client.end()
}
