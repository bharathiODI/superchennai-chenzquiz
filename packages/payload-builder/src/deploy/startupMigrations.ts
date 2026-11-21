/**
 * Startup migrations with a Postgres advisory lock.
 *
 * Built for pipelines whose build identity has no access to secrets: the
 * image is built with no DATABASE_URL and the build stays side-effect free;
 * the running container is the first safe moment to touch the schema. The
 * advisory lock makes concurrent replica start-up safe — exactly one replica
 * migrates, the others boot straight away.
 *
 * Wire it from the app's `instrumentation.ts`:
 *
 *   export async function register() {
 *     const { runStartupMigrations } = await import('@opendesigns/payload-builder')
 *     await runStartupMigrations({
 *       importConfig: () => import('@payload-config'),
 *       // Imported, not read from disk: the standalone output does not ship
 *       // src/migrations and has no Payload CLI.
 *       importMigrations: () => import('./migrations'),
 *     })
 *   }
 *
 * Escape hatch: RUN_MIGRATIONS_ON_START=false boots without migrating.
 */

type PoolClientLike = {
  query: <T>(text: string, values?: unknown[]) => Promise<{ rows: T[] }>
  release: () => void
}

type PostgresAdapterLike = {
  migrate: (args?: { migrations?: unknown[] }) => Promise<void>
  pool: { connect: () => Promise<PoolClientLike> }
}

export interface StartupMigrationsArgs {
  importConfig: () => Promise<{ default: unknown }>
  importMigrations: () => Promise<{ migrations: unknown[] }>
  /**
   * Any stable 64-bit integer unique to this app within its database.
   * Override when two apps share one Postgres cluster.
   */
  lockKey?: number
  log?: (message: string) => void
}

export const runStartupMigrations = async ({
  importConfig,
  importMigrations,
  lockKey = 762_401_390_112_233,
  log = (m) => console.info(m),
}: StartupMigrationsArgs): Promise<void> => {
  // Also invoked for the edge runtime, where `pg` cannot run.
  if (process.env.NEXT_RUNTIME !== 'nodejs') return

  if (process.env.RUN_MIGRATIONS_ON_START === 'false') {
    log('[migrate] RUN_MIGRATIONS_ON_START=false — skipping startup migrations')
    return
  }

  // Lazy imports keep the module graph clean for the edge runtime.
  const [{ getPayload }, { default: config }, { migrations }] = await Promise.all([
    import('payload'),
    importConfig(),
    importMigrations(),
  ])

  const payload = await getPayload({ config: config as never })
  const db = payload.db as unknown as PostgresAdapterLike

  // Session-level lock: it must be taken and released on the SAME connection,
  // hence a dedicated client rather than pool.query.
  const client = await db.pool.connect()
  let locked = false

  try {
    const { rows } = await client.query<{ locked: boolean }>(
      'SELECT pg_try_advisory_lock($1) AS locked',
      [lockKey],
    )
    locked = rows[0]?.locked === true

    if (!locked) {
      log('[migrate] another replica holds the migration lock — skipping and continuing boot')
      return
    }

    log('[migrate] lock acquired, running pending Payload migrations…')
    await db.migrate({ migrations })
    log('[migrate] migrations up to date')
  } catch (error) {
    // Rethrow: better to fail the health check than serve a stale schema.
    console.error('[migrate] startup migrations failed', error)
    throw error
  } finally {
    if (locked) {
      try {
        await client.query('SELECT pg_advisory_unlock($1)', [lockKey])
      } catch (unlockError) {
        console.error('[migrate] failed to release the advisory lock', unlockError)
      }
    }
    client.release()
  }
}
