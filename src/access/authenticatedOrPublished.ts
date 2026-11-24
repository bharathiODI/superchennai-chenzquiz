import type { Access } from 'payload'

import { WRITERS, userHas } from './roles'

// People who write content (Super Admin ... Contributor) see drafts too; everyone else - players,
// visitors and CMS Viewers - sees published documents only (drafts can hold tomorrow's answers).
export const authenticatedOrPublished: Access = ({ req: { user } }) => {
  if (userHas(user, WRITERS)) {
    return true
  }

  return {
    _status: {
      equals: 'published',
    },
  }
}
