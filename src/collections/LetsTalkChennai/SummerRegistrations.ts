// import type { CollectionConfig } from 'payload'

// export const SummerRegistrations: CollectionConfig = {
//   slug: 'summer-registrations',

//   admin: {
//     useAsTitle: 'name',
//     defaultColumns: ['name', 'email', 'status', 'thankYouMailSent', 'createdAt'],
//     group: 'USER REGISTRATIONS',
//   },

//   access: {
//     read: () => true,
//     create: () => true,
//     update: () => true,
//     delete: () => true,
//   },

//   fields: [
//     /* ======================================================
//        EVENT RELATION & STATUS
//     ====================================================== */
//     {
//       type: 'row',
//       fields: [
//         {
//           name: 'summer',
//           label: 'Summer Event',
//           type: 'relationship',
//           relationTo: 'lets-talks-chennai',
//           required: true,
//           admin: {
//             width: '50%',
//           },
//         },
//         {
//           name: 'status',
//           type: 'select',
//           defaultValue: 'pending',
//           options: [
//             { label: 'Pending', value: 'pending' },
//             { label: 'Confirmed', value: 'confirmed' },
//             { label: 'Rejected', value: 'rejected' },
//           ],
//           admin: {
//             width: '50%',
//           },
//         },
//       ],
//     },

//     /* ======================================================
//        PRIMARY USER INFO (Basic Contacts)
//     ====================================================== */
//     {
//       type: 'row',
//       fields: [
//         {
//           name: 'name',
//           type: 'text',
//           required: true,
//           admin: {
//             width: '33%',
//           },
//         },
//         {
//           name: 'email',
//           type: 'email',
//           required: true,
//           admin: {
//             width: '33%',
//           },
//         },
//         {
//           name: 'phone',
//           type: 'text',
//           admin: {
//             width: '34%',
//           },
//         },
//       ],
//     },

//     /* ======================================================
//        DYNAMIC REGISTRATION FORM DATA
//     ====================================================== */
//     {
//       name: 'values',
//       label: 'Submitted Form Data',
//       type: 'json',
//       admin: {
//         description: 'Dynamic form values submitted by the user',
//         components: {
//           Field: '@/collections/LetsTalkChennai/components/RegistrationViewer',
//         },
//       },
//     },

//     /* ======================================================
//        UPLOADED ATTACHMENTS
//     ====================================================== */
//     {
//       name: 'attachments',
//       label: 'Uploaded Media / Files',
//       type: 'array',
//       admin: {
//         description: 'Uploaded images, reels, documents from dynamic dynamic fields',
//       },
//       fields: [
//         {
//           name: 'fieldName',
//           type: 'text',
//           admin: {
//             description: 'Target field identifier (e.g., "featuredImage", "supportingDocument")',
//           },
//         },
//         {
//           name: 'file',
//           type: 'upload',
//           relationTo: 'media',
//         },
//       ],
//     },

//     /* ======================================================
//        EMAIL MANAGEMENT
//     ====================================================== */
//     {
//       type: 'collapsible',
//       label: 'Email Management',
//       admin: {
//         initCollapsed: true,
//       },
//       fields: [
//         {
//           type: 'row',
//           fields: [
//             {
//               name: 'thankYouMailSent',
//               type: 'checkbox',
//               defaultValue: false,
//               admin: {
//                 width: '50%',
//                 readOnly: true,
//               },
//             },
//             {
//               name: 'confirmedAt',
//               type: 'date',
//               admin: {
//                 width: '50%',
//                 date: {
//                   pickerAppearance: 'dayAndTime',
//                 },
//               },
//             },
//           ],
//         },
//         {
//           name: 'adminMessage',
//           type: 'textarea',
//           admin: {
//             description: 'This message will be included in the confirmation email.',
//           },
//         },
//         {
//           name: 'mailResponse',
//           type: 'textarea',
//           admin: {
//             readOnly: true,
//           },
//         },
//       ],
//     },
//   ],

//   timestamps: true,
// }

import type { CollectionConfig } from 'payload'

export const SummerRegistrations: CollectionConfig = {
  slug: 'summer-registrations',

  labels: {
    singular: 'Lets Talk Registration',
    plural: 'Lets Talk Registrations',
  },

  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'phone', 'status', 'createdAt'],
    group: 'USER REGISTRATIONS',
  },

  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },

  fields: [
    /* ======================================================
       EVENT RELATION & STATUS
    ====================================================== */
    {
      type: 'row',
      fields: [
        {
          name: 'summer',
          label: 'Summer Event',
          type: 'relationship',
          relationTo: 'lets-talks-chennai',
          required: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'status',
          type: 'select',
          defaultValue: 'pending',
          options: [
            { label: 'Pending', value: 'pending' },
            { label: 'Confirmed', value: 'confirmed' },
            { label: 'Rejected', value: 'rejected' },
          ],
          admin: {
            width: '50%',
          },
        },
      ],
    },

    /* ======================================================
       PRIMARY USER INFO
    ====================================================== */
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: {
            width: '25%',
          },
        },
        {
          name: 'email',
          type: 'email',
          required: true,
          admin: {
            width: '25%',
          },
        },
        {
          name: 'phone',
          type: 'text',
          admin: {
            width: '25%',
          },
        },
        {
          name: 'company',
          type: 'text',
          admin: {
            width: '25%',
          },
        },
      ],
    },

    /* ======================================================
       DYNAMIC REGISTRATION FORM DATA
    ====================================================== */
    {
      name: 'values',
      label: 'Submitted Form Data',
      type: 'json',
      admin: {
        description: 'Dynamic form values submitted by the user',
        components: {
          Field: '@/collections/LetsTalkChennai/components/RegistrationViewer',
        },
      },
    },

    /* ======================================================
       UPLOADED ATTACHMENTS
    ====================================================== */
    {
      name: 'attachments',
      label: 'Uploaded Media / Files',
      type: 'array',
      admin: {
        description: 'Uploaded images, reels, or documents from dynamic fields',
      },
      fields: [
        {
          name: 'fieldName',
          type: 'text',
          admin: {
            description: 'Target field identifier',
          },
        },
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },

    /* ======================================================
       EMAIL MANAGEMENT
    ====================================================== */
    {
      type: 'collapsible',
      label: 'Email Management',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'thankYouMailSent',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                width: '50%',
                readOnly: true,
              },
            },
            {
              name: 'confirmedAt',
              type: 'date',
              admin: {
                width: '50%',
                date: {
                  pickerAppearance: 'dayAndTime',
                },
              },
            },
          ],
        },
        {
          name: 'adminMessage',
          type: 'textarea',
          admin: {
            description: 'This message will be included in the confirmation email.',
          },
        },
        {
          name: 'mailResponse',
          type: 'textarea',
          admin: {
            readOnly: true,
          },
        },
      ],
    },
  ],

  timestamps: true,
}
