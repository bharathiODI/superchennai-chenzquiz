'use client'
// Thin notice at the top of every page while maintenance mode is on (checked on page load).
import { useEffect, useState } from 'react'

export function MaintenanceBanner() {
  const [message, setMessage] = useState<string | null>(null)
  useEffect(() => {
    fetch('/api/site-status', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setMessage(d?.maintenance ? d.message || 'Chenz Quiz is being updated.' : null))
      .catch(() => {})
  }, [])
  if (!message) return null
  return (
    <div
      role="status"
      style={{
        background: '#1e1b4b',
        color: '#fff',
        textAlign: 'center',
        padding: '10px 16px',
        fontSize: 14,
        fontWeight: 600,
        position: 'relative',
        zIndex: 60,
      }}
    >
      {message}
    </div>
  )
}
