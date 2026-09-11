import { isNotAdmin } from '@/access/checkRole'
import { CollectionConfig } from 'payload'

export const EventFormFields: CollectionConfig = {
  slug: 'event-form-fields',

  admin: {
    hidden: isNotAdmin,
    useAsTitle: 'label',
    defaultColumns: ['label', 'name', 'type', 'required'],
  },

  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
      admin: {
        description: 'Form-இல் பயனருக்குத் தெரியும் தலைப்பு (e.g., "Nominee Name")',
      },
    },

    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Database / API-இல் சேமிக்கப்படும் பெயரின் identifier (e.g., "nomineeName")',
      },
    },

    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'text',
      options: [
        { label: 'Text', value: 'text' },
        { label: 'Email', value: 'email' },
        { label: 'Number', value: 'number' },
        { label: 'Textarea', value: 'textarea' },
        { label: 'Select', value: 'select' },
        { label: 'Radio', value: 'radio' },
        { label: 'Checkbox', value: 'checkbox' },
        { label: 'File Upload', value: 'file' },
        { label: 'Rich Text', value: 'richText' },
      ],
    },

    {
      name: 'placeholder',
      type: 'text',
    },

    {
      name: 'description',
      type: 'text',
      label: 'Help / Description Text',
      admin: {
        description: 'Field-க்கு கீழே காட்டப்படும் சிறு விளக்கம் (e.g., "Reels duration must be 90s")',
      },
    },

    {
      name: 'required',
      type: 'checkbox',
      defaultValue: false,
    },

    // =========================================================
    // VALIDATIONS (Numbers, Limits, etc.)
    // =========================================================
    {
      name: 'validation',
      type: 'group',
      label: 'Validation Settings',
      fields: [
        {
          name: 'min',
          type: 'number',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'number',
            description: 'Minimum Value (e.g., 0)',
          },
        },
        {
          name: 'max',
          type: 'number',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'number',
            description: 'Maximum Value (e.g., 90 for Reels)',
          },
        },
      ],
    },

    // =========================================================
    // OPTIONS (Select & Radio controls)
    // =========================================================
    {
      name: 'options',
      type: 'array',
      label: 'Dropdown / Radio Options',
      admin: {
        condition: (_, siblingData) =>
          siblingData?.type === 'select' || siblingData?.type === 'radio',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'value',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
