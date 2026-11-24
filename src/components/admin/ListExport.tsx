'use client'
// "Export these rows (Excel)" above the Players & Scores lists: the list's own search, filters
// and sort, every page. Super Admins and Administrators (the lists are theirs).
import { useAuth } from '@payloadcms/ui'
import { usePathname, useSearchParams } from 'next/navigation'
import React from 'react'

import { ADMINS, userHas } from '@/access/roles'

export function ListExport() {
  const { user } = useAuth()
  const path = usePathname() || ''
  const sp = useSearchParams()
  if (!userHas(user, ADMINS)) return null
  const slug = path.split('/collections/')[1]?.split('/')[0]
  if (!slug) return null

  const params = new URLSearchParams(sp?.toString() ?? '')
  params.delete('page')
  params.delete('limit')
  params.set('collection', slug)
  const filtered = [...(sp?.keys() ?? [])].some((k) => k.startsWith('where') || (k === 'search' && sp?.get('search')))

  return (
    <div className="list-export">
      <a className="qd-export" href={`/api/reports/list?${params.toString()}`}>
        Export {filtered ? 'filtered' : 'all'} rows (Excel)
      </a>
      <span>
        {filtered
          ? 'Exactly the rows matching the search and filters above, every page.'
          : 'Use Search or Filters above to narrow the rows first.'}
      </span>
    </div>
  )
}
