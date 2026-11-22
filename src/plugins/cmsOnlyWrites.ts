import type { Plugin } from 'payload'

import { isCmsUser } from '@/access/isCmsUser'

// Payload's default access, used wherever a collection or global sets no rule of its own, is
// "anyone logged in". Players are logged in too (quiz-users), so without this a player could save
// the Header, Footer or Quiz Settings, or add forms and redirects, straight through the REST API.
//
// This fills in only the write rules that were left on the default, with "CMS users only".
// Rules a collection or plugin sets itself (e.g. public form submissions) are left alone, and
// reads are not touched. Put it LAST in the plugins list so it sees plugin-added collections.
const COLLECTION_WRITES = ['create', 'update', 'delete'] as const

export const cmsOnlyWrites: Plugin = (config) => ({
  ...config,
  collections: (config.collections || []).map((collection) => {
    const access = { ...(collection.access || {}) } as Record<string, unknown>
    for (const op of COLLECTION_WRITES) {
      if (access[op] === undefined) access[op] = isCmsUser
    }
    return { ...collection, access }
  }),
  globals: (config.globals || []).map((global) => {
    const access = { ...(global.access || {}) } as Record<string, unknown>
    if (access.update === undefined) access.update = isCmsUser
    return { ...global, access }
  }),
})
