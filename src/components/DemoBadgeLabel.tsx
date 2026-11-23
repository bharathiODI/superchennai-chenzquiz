'use client'
import { useEffect, useState } from 'react'

export function DemoBadgeLabel({ initialLive }: { initialLive: boolean }) {
  const [live, setLive] = useState(initialLive)
  useEffect(() => {
    fetch('/api/site-status', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setLive(Boolean(d?.demoLiveData)))
      .catch(() => {})
  }, [])
  return (
    <div className="site-env-badge" style={{ background: live ? '#b45309' : '#d32f2f' }}>
      {live ? 'Demo site · live data' : 'Demo site'}
    </div>
  )
}
