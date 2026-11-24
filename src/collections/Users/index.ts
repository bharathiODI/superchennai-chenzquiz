import type { CollectionConfig, Where } from 'payload'
import { ADMINS, ROLE_OPTIONS, cmsRole, hiddenUnless, userHas } from '@/access/roles'

// Super Admins manage everyone; Administrators manage everyone except Super Admins;
// everybody else sees and edits only their own profile.
const selfOnly = (user: unknown): Where => ({ id: { equals: (user as { id?: number | string })?.id } })

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    // Entering the CMS: any real role. "No access" accounts stay out.
    admin: ({ req }) => cmsRole(req.user) !== null,
    // Only admins add CMS users. The very first account (/admin/create-first-user) doesn't use
    // this rule; it becomes a Super Admin (hook below).
    create: ({ req }) => userHas(req.user, ADMINS),
    read: ({ req }) => {
      const r = cmsRole(req.user)
      if (!r) return false
      return ADMINS.includes(r) ? true : selfOnly(req.user)
    },
    update: ({ req }) => {
      const r = cmsRole(req.user)
      if (!r) return false
      if (r === 'superadmin') return true
      if (r === 'admin') return { or: [{ role: { not_equals: 'superadmin' } }, selfOnly(req.user)] }
      return selfOnly(req.user)
    },
    delete: ({ req }) => {
      const r = cmsRole(req.user)
      if (r === 'superadmin') return true
      if (r === 'admin') return { role: { not_equals: 'superadmin' } }
      return false
    },
  },
  admin: {
    defaultColumns: ['name', 'email', 'role', 'updatedAt'],
    useAsTitle: 'name',
    hidden: hiddenUnless(ADMINS),
  },
  // Sessions (on by default since Payload 3.4x) stay off so admin logins behave as before the upgrade.
  auth: { useSessions: false },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'viewer',
      options: ROLE_OPTIONS,
      admin: {
        description:
          'What this person can do in the CMS (WordPress roles). Only a Super Admin can give or take the Super Admin role.',
      },
      // Nobody promotes themselves: only admins write this field.
      access: {
        create: ({ req }) => userHas(req.user, ADMINS),
        update: ({ req }) => userHas(req.user, ADMINS),
      },
      hooks: {
        beforeChange: [
          // The first account ever created is the Super Admin (WordPress first-user model).
          async ({ operation, req, value }) => {
            if (operation !== 'create') return value
            const existing = await req.payload.count({ collection: 'users', overrideAccess: true, req })
            return existing.totalDocs === 0 ? 'superadmin' : value
          },
        ],
      },
      validate: async (value: unknown, { req, previousValue, id }: any) => {
        const me = cmsRole(req?.user)
        const touchesSuper = value === 'superadmin' || previousValue === 'superadmin'
        if (me && touchesSuper && value !== previousValue && me !== 'superadmin') {
          return 'Only a Super Admin can give or take the Super Admin role.'
        }
        // Never leave the CMS without a Super Admin.
        if (previousValue === 'superadmin' && value !== 'superadmin' && req?.payload) {
          const others = await req.payload.count({
            collection: 'users',
            overrideAccess: true,
            where: { and: [{ role: { equals: 'superadmin' } }, { id: { not_equals: id } }] },
          })
          if (others.totalDocs === 0) return 'This is the only Super Admin. Make someone else Super Admin first.'
        }
        return true
      },
    },

    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'phone',
      type: 'text',
      required: false,
    },

    {
      name: 'location',
      type: 'text',
      required: false,
    },

    {
      name: 'profileImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Profile Image',
      admin: {
        description: 'Upload author profile photo (square image preferred)',
      },
    },

    {
      name: 'phoneVerified',
      type: 'checkbox',
      defaultValue: false,
    },

    {
      name: 'otp',
      type: 'text',
      admin: { hidden: true },
    },

    {
      name: 'otpExpires',
      type: 'date',
      admin: { hidden: true },
    },
  ],
  timestamps: true,
}

