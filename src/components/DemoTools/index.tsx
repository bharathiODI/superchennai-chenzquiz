import { demoToolsConfigured } from '@/utilities/clock'
import { DemoToolsPanel } from './Panel'

// Demo site only (SITE_ENV=demo + DEMO_TOOLS_KEY, not while it uses the live database): the test
// clock banner and the demo tools panel. Renders nothing on the live site.
export function DemoTools() {
  if (!demoToolsConfigured()) return null
  return <DemoToolsPanel />
}
