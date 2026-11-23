import { demoUsesLiveData, isDemoSite } from '@/utilities/siteEnv'
import { DemoBadgeLabel } from './DemoBadgeLabel'

// "DEMO SITE" tag on every page of the demo site (nothing on live). Whether the demo is on live
// data can change after the build (chenzquiz-site.sh demo-db live), so the label checks it on load.
export function SiteEnvBadge() {
  if (!isDemoSite()) return null
  return (
    <>
      <style>{`.site-env-badge{position:fixed;left:12px;bottom:12px;z-index:2147483000;pointer-events:none;
        font:700 11px/1 system-ui,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#fff;
        padding:7px 11px;border-radius:999px;box-shadow:0 2px 8px rgba(0,0,0,.25)}
        @media (max-width:768px){.site-env-badge{bottom:84px}}`}</style>
      <DemoBadgeLabel initialLive={demoUsesLiveData()} />
    </>
  )
}
