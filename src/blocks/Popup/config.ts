import { Block } from 'payload'

export const PopupBannerBlock: Block = {
  slug: 'popupBanner',

  labels: {
    singular: 'Popup Banner',
    plural: 'Popup Banners',
  },

  admin: {
    group: 'Global Sections',
  },

  fields: [
    // ENABLE / DISABLE #####################################
    {
      name: 'enablePopup',
      type: 'checkbox',
      defaultValue: true,
      label: 'Enable Popup',
    },

    // GLOBAL SHOW ##########################################
    {
      name: 'isGlobal',
      type: 'checkbox',
      defaultValue: false,
      label: 'Show On All Pages',
    },

    // SELECTED PAGES #######################################
    {
      name: 'selectedPages',
      type: 'relationship',
      relationTo: 'pages',
      hasMany: true,
      required: false,
      admin: {
        condition: (_, siblingData) => !siblingData?.isGlobal,
        description:
          'Choose pages where popup should appear',
      },
    },

    // POPUP IMAGE ##########################################
    {
      name: 'popupImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },

    // REDIRECT LINK ########################################
    {
      name: 'redirectLink',
      type: 'text',
      required: false,
      defaultValue: '/',
    },

    // OPEN IN NEW TAB ######################################
    {
      name: 'openInNewTab',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}