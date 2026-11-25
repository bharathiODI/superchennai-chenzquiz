'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

/** Disqualify / Clear a player (Administrators and up). Disqualified players leave the leaderboard. */
export function DisqualifyButton({ id, disqualified }: { id: number; disqualified: boolean }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const toggle = async () => {
    if (!disqualified && !confirm('Disqualify this player? They stay able to log in but leave the leaderboard.')) return
    setBusy(true)
    try {
      const r = await fetch(`/api/quiz-users/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ disqualified: !disqualified }),
      })
      if (!r.ok) alert('Could not save - only Administrators can do this.')
      router.refresh()
    } finally {
      setBusy(false)
    }
  }
  return (
    <button type="button" className={`qd-mini${disqualified ? '' : ' qd-mini--danger'}`} disabled={busy} onClick={toggle}>
      {busy ? '...' : disqualified ? 'Clear' : 'Disqualify'}
    </button>
  )
}
