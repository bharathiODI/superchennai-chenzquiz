// Per-site switches kept in a small JSON file next to the app: `site-flags.json` in the app folder,
// which on the server is a link to shared/site-flags.json (made by scripts/deploy.sh), so it is
// kept across deploys and separate for live and demo. Changed from the CMS (Site status box) or
// on the server with `chenzquiz-site.sh maintenance on|off`. Read at request time - no restart.
import fs from 'node:fs'
import path from 'node:path'

export type SiteFlags = {
  maintenance: boolean
  message: string
  since?: string
  by?: string
}

export const DEFAULT_MAINTENANCE_MESSAGE =
  'Chenz Quiz is being updated. New games will be back in a few minutes - thanks for waiting!'

const FILE = () => path.join(process.cwd(), 'site-flags.json')

let cache: { at: number; flags: SiteFlags } | null = null

export function readSiteFlags(): SiteFlags {
  if (cache && Date.now() - cache.at < 2000) return cache.flags
  let flags: SiteFlags = { maintenance: false, message: DEFAULT_MAINTENANCE_MESSAGE }
  try {
    const raw = JSON.parse(fs.readFileSync(FILE(), 'utf8'))
    flags = {
      maintenance: raw?.maintenance === true,
      message: typeof raw?.message === 'string' && raw.message.trim() ? raw.message.trim() : DEFAULT_MAINTENANCE_MESSAGE,
      since: typeof raw?.since === 'string' ? raw.since : undefined,
      by: typeof raw?.by === 'string' ? raw.by : undefined,
    }
  } catch {
    // no file (never switched on) or unreadable: treat as off
  }
  cache = { at: Date.now(), flags }
  return flags
}

export function writeSiteFlags(next: { maintenance: boolean; message?: string; by?: string }): SiteFlags {
  const flags: SiteFlags = {
    maintenance: next.maintenance,
    message: next.message?.trim() || DEFAULT_MAINTENANCE_MESSAGE,
    since: new Date().toISOString(),
    by: next.by,
  }
  fs.writeFileSync(FILE(), JSON.stringify(flags, null, 2) + '\n')
  cache = null
  return flags
}
