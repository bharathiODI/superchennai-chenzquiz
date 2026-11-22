import type { Access } from 'payload'

import { isCmsUser } from './isCmsUser'

// CMS users see drafts too; everyone else (players included) sees published documents only.
export const authenticatedOrPublished: Access = (args) => {
  if (isCmsUser(args)) {
    return true
  }

  return {
    _status: {
      equals: 'published',
    },
  }
}
