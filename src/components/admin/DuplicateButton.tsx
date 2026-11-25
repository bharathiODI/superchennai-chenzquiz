'use client'
import { useDocumentInfo } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

// A visible "Duplicate" next to Save/Publish (the same as ... > Duplicate). The copy opens as a
// draft, titled "... (copy)"; questions get the next free Question Number, quizzes stay Draft.
export function DuplicateButton() {
  const { id, collectionSlug } = useDocumentInfo()
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  if (!id || !collectionSlug) return null
  const go = async () => {
    setBusy(true)
    try {
      const r = await fetch(`/api/${collectionSlug}/${id}/duplicate?draft=true`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      })
      const j = await r.json().catch(() => ({}))
      const newId = j?.doc?.id ?? j?.id
      if (!r.ok || !newId) {
        alert(j?.errors?.[0]?.message || 'Could not duplicate')
        return
      }
      router.push(`/admin/collections/${collectionSlug}/${newId}`)
    } finally {
      setBusy(false)
    }
  }
  return (
    <button type="button" className="btn btn--style-secondary btn--size-medium dup-btn" disabled={busy} onClick={go}>
      {busy ? 'Duplicating...' : 'Duplicate'}
    </button>
  )
}
