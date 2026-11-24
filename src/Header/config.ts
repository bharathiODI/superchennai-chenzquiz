import type { GlobalConfig } from 'payload'
import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'
import { ADMINS, allow, hiddenUnless } from '@/access/roles'

export const Header: GlobalConfig = {
  slug: 'header',
  // Appearance and quiz settings: Super Admins and Administrators (WordPress manage_options).
  access: {
    read: () => true,
    update: allow(ADMINS),
  },
  admin: {
    hidden: hiddenUnless(ADMINS),
  },
  fields: [
    // #################### LOGO FIELD #######################
    {
      name: 'logo',
      label: 'Logo',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Upload the logo for the header.',
      },
    },
    {
      name: 'secondarylogo',
      label: 'rightsideLogo',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Upload the logo for the header right side.',
      },
    },
    // #################### NAV ITEMS #######################

    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 20,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
