import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { isAdmin, isAdminOrClientAdminAccess } from '@/access/isAdmin'
import { isNotAdmin } from '@/access/checkRole'

export const Users: CollectionConfig = {
  slug: 'users',
  // access: {
  //   admin: authenticated,
  //   create: () => true,
  //   delete: authenticated,
  //   read: authenticated,
  //   update: authenticated,
  // },
  // admin: {
  //   defaultColumns: ['name', 'email', 'role', 'profileImage'],
  //   useAsTitle: 'name',
  // },
 access: {
    // Admin & Client user role login panna Admin Panel allow panrom:
    admin: isAdminOrClientAdminAccess,
    create: () => true,
    delete: isAdmin,
    read: authenticated,
    update: isAdmin,
  },
  admin: {
    defaultColumns: ['name', 'email', 'role', 'profileImage'],
    useAsTitle: 'name',
    // Client role user-kku Users tab sidebar-la hide aagum:
    hidden: isNotAdmin,
  },
  auth: true,
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'client',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Client', value: 'client' },
        { label: 'User', value: 'user' },
      ],
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


