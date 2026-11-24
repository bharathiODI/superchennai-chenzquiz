import { redirect } from 'next/navigation'

import { cmsRole } from '@/access/roles'

/** A Viewer's home in the CMS is the Quiz Dashboard - the only thing their role opens. */
export function ViewerHome({ user }: { user?: unknown }) {
  if (cmsRole(user) === 'viewer') redirect('/admin/quiz-dashboard')
  return null
}
