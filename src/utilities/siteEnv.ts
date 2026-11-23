// Which site this is. The demo site (internal testing) sets SITE_ENV=demo in its .env; as a
// fallback, an address containing "demo" (https://chenzquiz-demo.superchennai.com) also counts.
// SITE_DATA=live is set by `chenzquiz-site.sh demo-db live` while the demo uses the live database.
export const isDemoSite = (): boolean => {
  const env = (process.env.SITE_ENV || '').trim().toLowerCase()
  if (env) return env === 'demo'
  try {
    return new URL(process.env.NEXT_PUBLIC_SERVER_URL || '').hostname.includes('demo')
  } catch {
    return false
  }
}

export const demoUsesLiveData = (): boolean =>
  isDemoSite() && (process.env.SITE_DATA || '').trim().toLowerCase() === 'live'
