import { Block } from 'payload'

export const CreativeHeroBlock: Block = {
  slug: 'creativeHero',
  labels: {
    singular: 'Creative Hero',
    plural: 'Creative Heroes',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      required: true,
      defaultValue: 'Creative Studio // 2026',
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'NOTHING',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      defaultValue: 'Exploring the intersection of brutalist typography and fluid motion.',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'ctaLabel',
          type: 'text',
          defaultValue: 'Book a Call',
          admin: { width: '50%' },
        },
        {
          name: 'ctaUrl',
          type: 'text',
          defaultValue: '/contact',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'imageAlt',
      type: 'text',
      defaultValue: 'Hero Visual',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'imageScale',
          type: 'select',
          defaultValue: '1',
          options: [
            { label: 'Compact (0.8x)', value: '0.8' },
            { label: 'Default (1x)', value: '1' },
            { label: 'Enlarged (1.2x)', value: '1.2' },
          ],
          admin: { width: '50%' },
        },
        {
          name: 'imageRotation',
          type: 'select',
          defaultValue: 'rotate-0',
          options: [
            { label: 'None', value: 'rotate-0' },
            { label: 'Slight Tilt (-3deg)', value: '-rotate-3' },
            { label: 'Dynamic Tilt (+4deg)', value: 'rotate-4' },
          ],
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'backgroundColor',
          type: 'text',
          defaultValue: '#ffffff',
          admin: { width: '50%' },
        },
        {
          name: 'textColor',
          type: 'text',
          defaultValue: '#0f172a',
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'interactionEnabled',
          type: 'checkbox',
          defaultValue: true,
          label: 'Enable Mouse-Follow & Parallax Interaction',
          admin: { width: '50%' },
        },
        {
          name: 'animationIntensity',
          type: 'select',
          defaultValue: 'medium',
          options: [
            { label: 'Low', value: 'low' },
            { label: 'Medium', value: 'medium' },
            { label: 'High', value: 'high' },
          ],
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'footerText',
      type: 'text',
      defaultValue: 'Paris / Tokyo / Remote',
    },
  ],
}