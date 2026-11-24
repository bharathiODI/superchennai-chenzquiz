'use client'

import { PublishButton, useAuth } from '@payloadcms/ui'
import React from 'react'

/**
 * WordPress roles: contributors write drafts and an editor publishes them, so they get no
 * Publish button (the server refuses a contributor's publish anyway).
 */
export function RolePublishButton(props: React.ComponentProps<typeof PublishButton>) {
  const { user } = useAuth<{ role?: string }>()
  if (user?.role === 'contributor') return null
  return <PublishButton {...props} />
}
