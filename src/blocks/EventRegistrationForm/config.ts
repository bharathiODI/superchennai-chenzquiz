import type { Block } from 'payload'

export const EventRegistrationFormBlock: Block = {
  slug: 'eventRegistrationFormBlock',

  labels: {
    singular: 'Event Registration Form',
    plural: 'Event Registration Forms',
  },

  fields: [
    {
      name: 'showForm',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show Form Section',
    },
    {
      name: 'mainsectionTitle',
      type: 'text',
      defaultValue: 'Main Register For This Event',
      label: 'main',
    },
    {
      name: 'sectionTitle',
      type: 'text',
      defaultValue: 'Register For This Event',
      label: 'Section Badge Title',
    },
    {
      name: 'sectionSubTitle',
      type: 'text',
      defaultValue: 'Submit Your Data',
      label: 'Main Heading',
    },
    {
      name: 'sectionDescrption',
      type: 'textarea',
      defaultValue:
        'Fill out the registration form below to participate in this event. Our team will contact you with further details after submission.',
      label: 'Description Text',
    },

    /* =========================================================
       IMAGE SETTINGS
    ========================================================= */
    {
      name: 'showImage',
      label: 'Show Side Image',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'sideImage',
      label: 'Side Image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, siblingData) => Boolean(siblingData?.showImage),
      },
    },
    {
      name: 'imagePosition',
      label: 'Image Position',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ],
      admin: {
        condition: (_, siblingData) => Boolean(siblingData?.showImage),
      },
    },
  ],
}