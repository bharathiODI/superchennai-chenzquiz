import { GlobalConfig } from 'payload'
import { revalidateFooter } from './hooks/revalidateFooter'
import { isNotAdmin } from '@/access/checkRole'

const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  admin: {
    hidden: isNotAdmin,
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
