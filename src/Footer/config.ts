import { GlobalConfig } from 'payload'
import { revalidateFooter } from './hooks/revalidateFooter'
import { ADMINS, allow, hiddenUnless } from '@/access/roles'

const Footer: GlobalConfig = {
  slug: 'footer',
  // Appearance and quiz settings: Super Admins and Administrators (WordPress manage_options).
  access: {
    read: () => true,
    update: allow(ADMINS),
  },
  admin: {
    hidden: hiddenUnless(ADMINS),
  },
  fields: [
    /* =========================================================
       COPYRIGHT
    ========================================================= */

    {
      type: 'text',
      name: 'copyright',
      label: 'Copyright Text',
    },

    /* =========================================================
       COMPANY / DOMAIN
    ========================================================= */

    {
      type: 'group',
      name: 'companyInfo',
      label: 'Company Information',

      fields: [
        {
          name: 'supportEmail',
          type: 'email',
          label: 'Support Email',
          admin: {
            placeholder: 'support@example.com',
          },
        },
      ],
    },

    /* =========================================================
       SOCIAL MEDIA LINKS
    ========================================================= */

    {
      name: 'socialMedia',
      label: 'Social Media Links',
      type: 'array',

      labels: {
        singular: 'Social Link',
        plural: 'Social Links',
      },

      fields: [
        {
          name: 'platform',
          type: 'text',
          required: true,

          admin: {
            placeholder: 'Instagram',
          },
        },

        {
          name: 'url',
          type: 'text',
          required: true,

          admin: {
            placeholder: 'https://instagram.com/yourprofile',
          },
        },

        {
          name: 'icon',
          label: 'Social Icon',
          type: 'upload',
          relationTo: 'media',
          required: false,
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}

export default Footer
