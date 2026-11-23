import { demoUsesLiveData, isDemoSite } from '@/utilities/siteEnv'

// Strip across the top of the CMS on the demo site, so nobody mistakes it for live.
export function SiteEnvBanner() {
  if (!isDemoSite()) return null
  const live = demoUsesLiveData()
  return (
    <div
      style={{
        background: live ? '#b45309' : '#d32f2f',
        color: '#fff',
        padding: '6px 16px',
        fontSize: 13,
        fontWeight: 600,
        textAlign: 'center',
        letterSpacing: '0.02em',
      }}
    >
      {live
        ? 'DEMO CMS - connected to the LIVE database. Changes here change the live site.'
        : 'DEMO CMS - test copy. Changes here do not affect the live site.'}
    </div>
  )
}
