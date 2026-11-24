import type { Field } from 'payload'

/**
 * Who created the document (payload-builder playbook `createdByField`). Authors and contributors
 * may edit only what they created, so this is what scopes them. Set once, never edited.
 */
export const createdByField = (): Field => ({
  name: 'createdBy',
  label: 'Created by',
  type: 'relationship',
  relationTo: 'users',
  access: { update: () => false },
  admin: { position: 'sidebar', readOnly: true },
  hooks: {
    beforeChange: [
      ({ operation, req, value }) => {
        if (operation === 'create' && req.user && (req.user as { collection?: string }).collection === 'users') {
          return req.user.id
        }
        return value
      },
    ],
  },
})
