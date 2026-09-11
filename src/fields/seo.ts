// export const SEOFieldSchema = {
//   name: 'seo',
//   type: 'group',
//   label: 'SEO Settings',

//   fields: [
//     {
//       name: 'title',
//       type: 'text',
//       label: 'Meta Title',
//     },

//     {
//       name: 'description',
//       type: 'textarea',
//       label: 'Meta Description',
//     },

//     {
//       name: 'keywords',
//       type: 'array',
//       label: 'Keywords',
//       fields: [
//         {
//           name: 'keyword',
//           type: 'text',
//         },
//       ],
//     },

//     {
//       name: 'canonicalURL',
//       type: 'text',
//     },

//     {
//       name: 'ogImage',
//       type: 'upload',
//       relationTo: 'media',
      
//     },

//     // 🔥 JSON-LD structured data (important part)
//     {
//       name: 'structuredData',
//       type: 'json',
//       label: 'Schema (JSON-LD)',
//       admin: {
//         description: 'Paste JSON-LD structured data here',
//       },
//     },
//   ],
// }

import type { Field } from 'payload'

export const SEOFieldSchema: Field = {
  name: 'seo',
  type: 'group',
  label: 'SEO Settings',

  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Meta Title',
    },

    {
      name: 'description',
      type: 'textarea',
      label: 'Meta Description',
    },

    {
      name: 'keywords',
      type: 'array',
      label: 'Keywords',
      fields: [
        {
          name: 'keyword',
          type: 'text',
        },
      ],
    },

    {
      name: 'canonicalURL',
      type: 'text',
    },

    {
      name: 'ogImage',
      type: 'upload',
      relationTo: 'media', 
    },

    {
      name: 'structuredData',
      type: 'json',
      label: 'Schema (JSON-LD)',
    },
  ],
}