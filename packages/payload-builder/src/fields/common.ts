import type { Field } from 'payload'
import type { ColumnWidth } from '../types'

/**
 * Shared node options, organised as Avada-style tabs:
 *
 *   General · Design · Background · Extras
 *
 * (Elements get a Content tab first, holding their own fields.)
 *
 * **Naming discipline:** these groups sit up to four levels deep
 * (layout → section → rows → columns → elements), and Postgres caps
 * identifiers at 63 characters. ERDC already hit that ceiling — its column
 * table name alone ate 41 characters, so `background_position` overflowed.
 * Property names here are therefore deliberately terse in the database
 * (`bg`, `pt`, `mb`, `anim`) while carrying readable labels in the admin.
 */

/* ------------------------------------------------------------------ */
/* Primitives                                                          */
/* ------------------------------------------------------------------ */

export const WIDTH_OPTIONS: { label: string; value: ColumnWidth }[] = [
  { label: '1/1 — full', value: '1/1' },
  { label: '1/2', value: '1/2' },
  { label: '1/3', value: '1/3' },
  { label: '2/3', value: '2/3' },
  { label: '1/4', value: '1/4' },
  { label: '3/4', value: '3/4' },
  { label: '1/5', value: '1/5' },
  { label: '2/5', value: '2/5' },
  { label: '3/5', value: '3/5' },
  { label: '4/5', value: '4/5' },
  { label: '1/6', value: '1/6' },
  { label: '5/6', value: '5/6' },
  { label: 'Auto', value: 'auto' },
]

const size = (name: string, label: string, placeholder = 'e.g. 24px, 2rem, 5%'): Field => ({
  name,
  admin: { placeholder },
  label,
  type: 'text',
})

const colour = (name: string, label: string, placeholder = '#0E4C45 or var(--brand)'): Field => ({
  name,
  admin: { placeholder },
  label,
  type: 'text',
})

/** Padding + margin box, short DB names (pt/pb/pl/pr/mt/mb). */
const spacingBox = (name: string, label: string, description?: string): Field => ({
  name,
  admin: { description, hideGutter: true },
  fields: [
    {
      type: 'row',
      fields: [size('pt', 'Padding top'), size('pr', 'Padding right')],
    },
    {
      type: 'row',
      fields: [size('pb', 'Padding bottom'), size('pl', 'Padding left')],
    },
    {
      type: 'row',
      fields: [size('mt', 'Margin top'), size('mb', 'Margin bottom')],
    },
  ],
  label,
  type: 'group',
})

/* ------------------------------------------------------------------ */
/* General — layout options, per node type                             */
/* ------------------------------------------------------------------ */

export const sectionGeneralFields: Field[] = [
  {
    type: 'row',
    fields: [
      {
        name: 'label',
        admin: { description: 'Internal name shown in the builder.' },
        label: 'Section name',
        type: 'text',
      },
      {
        name: 'tag',
        defaultValue: 'section',
        label: 'HTML tag',
        options: ['section', 'div', 'header', 'footer', 'main', 'aside', 'nav'].map((v) => ({
          label: `<${v}>`,
          value: v,
        })),
        type: 'select',
      },
    ],
  },
  {
    type: 'row',
    fields: [
      {
        name: 'widthMode',
        admin: { description: 'Whether inner content is capped to the site width.' },
        defaultValue: 'contained',
        label: 'Interior content width',
        options: [
          { label: 'Site width', value: 'contained' },
          { label: '100% width', value: 'full' },
        ],
        type: 'select',
      },
      {
        name: 'height',
        defaultValue: 'auto',
        label: 'Height',
        options: [
          { label: 'Auto', value: 'auto' },
          { label: 'Full height', value: 'full' },
          { label: 'Minimum height', value: 'min' },
        ],
        type: 'select',
      },
    ],
  },
  {
    name: 'minHeight',
    admin: {
      condition: (_d, sibling) => sibling?.height === 'min',
      placeholder: 'e.g. 480px, 60vh',
    },
    label: 'Minimum height',
    type: 'text',
  },
]

export const rowGeneralFields: Field[] = [
  {
    type: 'row',
    fields: [
      {
        name: 'label',
        admin: { description: 'Internal name shown in the builder.' },
        label: 'Row name',
        type: 'text',
      },
      {
        name: 'gap',
        defaultValue: 'md',
        label: 'Column gap',
        options: [
          { label: 'None', value: 'none' },
          { label: 'Small', value: 'sm' },
          { label: 'Medium', value: 'md' },
          { label: 'Large', value: 'lg' },
        ],
        type: 'select',
      },
    ],
  },
  {
    type: 'row',
    fields: [
      {
        name: 'valign',
        admin: { description: 'How columns align vertically within the row.' },
        defaultValue: 'start',
        label: 'Column alignment',
        options: [
          { label: 'Top', value: 'start' },
          { label: 'Middle', value: 'center' },
          { label: 'Bottom', value: 'end' },
          { label: 'Stretch', value: 'stretch' },
        ],
        type: 'select',
      },
      {
        name: 'justify',
        admin: { description: 'How columns are justified horizontally.' },
        defaultValue: 'start',
        label: 'Column justification',
        options: [
          { label: 'Left', value: 'start' },
          { label: 'Centre', value: 'center' },
          { label: 'Right', value: 'end' },
          { label: 'Space between', value: 'between' },
          { label: 'Space around', value: 'around' },
          { label: 'Space evenly', value: 'evenly' },
        ],
        type: 'select',
      },
    ],
  },
  {
    name: 'wrap',
    admin: { description: 'Allow columns to wrap onto more than one line.' },
    defaultValue: true,
    label: 'Content wrap',
    type: 'checkbox',
  },
]

export const columnGeneralFields: Field[] = [
  {
    type: 'row',
    fields: [
      {
        name: 'width',
        defaultValue: '1/1',
        label: 'Width',
        options: WIDTH_OPTIONS,
        type: 'select',
      },
      {
        name: 'valign',
        defaultValue: 'inherit',
        label: 'Vertical alignment',
        options: [
          { label: 'Inherit from row', value: 'inherit' },
          { label: 'Top', value: 'start' },
          { label: 'Middle', value: 'center' },
          { label: 'Bottom', value: 'end' },
        ],
        type: 'select',
      },
    ],
  },
  {
    name: 'linkUrl',
    admin: {
      description:
        'Makes the whole column a link. Links on elements inside are disabled when this is set.',
    },
    label: 'Column link',
    type: 'text',
  },
]

export const elementGeneralFields: Field[] = [
  {
    type: 'row',
    fields: [
      {
        name: 'align',
        defaultValue: 'inherit',
        label: 'Alignment',
        options: [
          { label: 'Inherit', value: 'inherit' },
          { label: 'Left', value: 'start' },
          { label: 'Centre', value: 'center' },
          { label: 'Right', value: 'end' },
        ],
        type: 'select',
      },
      size('maxWidth', 'Max width', 'e.g. 640px, 80%'),
    ],
  },
]

/* ------------------------------------------------------------------ */
/* Design                                                              */
/* ------------------------------------------------------------------ */

export const designFields: Field[] = [
  {
    type: 'collapsible',
    fields: [spacingBox('space', 'Desktop')],
    label: 'Spacing — desktop',
  },
  {
    type: 'collapsible',
    admin: { initCollapsed: true },
    fields: [
      spacingBox('spaceMd', 'Tablet', 'Leave blank to inherit the desktop value.'),
      spacingBox('spaceSm', 'Mobile', 'Leave blank to inherit the tablet value.'),
    ],
    label: 'Spacing — responsive overrides',
  },
  {
    type: 'collapsible',
    admin: { initCollapsed: true },
    fields: [
      {
        type: 'row',
        fields: [
          colour('color', 'Text colour'),
          size('fontSize', 'Font size', 'e.g. 18px, 1.125rem'),
          size('lineHeight', 'Line height', 'e.g. 1.5'),
        ],
      },
      {
        type: 'row',
        fields: [
          {
            name: 'fontWeight',
            label: 'Font weight',
            options: ['300', '400', '500', '600', '700', '800'].map((v) => ({ label: v, value: v })),
            type: 'select',
          },
          {
            name: 'transform',
            label: 'Text transform',
            options: [
              { label: 'None', value: 'none' },
              { label: 'UPPERCASE', value: 'uppercase' },
              { label: 'lowercase', value: 'lowercase' },
              { label: 'Capitalise', value: 'capitalize' },
            ],
            type: 'select',
          },
          size('letterSpacing', 'Letter spacing', 'e.g. .02em'),
        ],
      },
    ],
    label: 'Typography',
  },
  {
    type: 'collapsible',
    admin: { initCollapsed: true },
    fields: [
      {
        type: 'row',
        fields: [
          size('bw', 'Border width', 'e.g. 1px'),
          colour('bc', 'Border colour', '#e2e2e4'),
          size('br', 'Corner radius', 'e.g. 6px'),
        ],
      },
      {
        name: 'bs',
        admin: { placeholder: 'e.g. 0 8px 24px rgba(0,0,0,.12)' },
        label: 'Box shadow',
        type: 'text',
      },
    ],
    label: 'Border & shadow',
  },
]

/* ------------------------------------------------------------------ */
/* Background — the full set from the Avada container dialog           */
/* ------------------------------------------------------------------ */

export const backgroundFields: Field[] = [
  {
    name: 'bg',
    admin: { hideGutter: true },
    fields: [
      {
        name: 'type',
        defaultValue: 'none',
        label: 'Background type',
        options: [
          { label: 'None', value: 'none' },
          { label: 'Colour', value: 'color' },
          { label: 'Gradient', value: 'gradient' },
          { label: 'Image', value: 'image' },
          { label: 'Video', value: 'video' },
        ],
        type: 'select',
      },

      /* Colour */
      {
        name: 'color',
        admin: {
          condition: (_d, s) => s?.type === 'color',
          placeholder: '#0E4C45 or var(--brand)',
        },
        label: 'Background colour',
        type: 'text',
      },

      /* Gradient */
      {
        type: 'row',
        admin: { condition: (_d, s) => s?.type === 'gradient' },
        fields: [
          colour('gFrom', 'Gradient from', '#0E4C45'),
          colour('gTo', 'Gradient to', '#1B8A7A'),
          {
            name: 'gAngle',
            admin: { placeholder: '135' },
            label: 'Angle (deg)',
            max: 360,
            min: 0,
            type: 'number',
          },
        ],
      },

      /* Image */
      {
        name: 'image',
        admin: { condition: (_d, s) => s?.type === 'image' },
        label: 'Background image',
        relationTo: 'media',
        type: 'upload',
      },
      {
        type: 'row',
        admin: { condition: (_d, s) => s?.type === 'image' },
        fields: [
          {
            name: 'pos',
            defaultValue: 'center-center',
            label: 'Image position',
            options: [
              { label: 'Left top', value: 'left-top' },
              { label: 'Left centre', value: 'left-center' },
              { label: 'Left bottom', value: 'left-bottom' },
              { label: 'Centre top', value: 'center-top' },
              { label: 'Centre', value: 'center-center' },
              { label: 'Centre bottom', value: 'center-bottom' },
              { label: 'Right top', value: 'right-top' },
              { label: 'Right centre', value: 'right-center' },
              { label: 'Right bottom', value: 'right-bottom' },
            ],
            type: 'select',
          },
          {
            name: 'fit',
            defaultValue: 'cover',
            label: 'Image size',
            options: [
              { label: 'Cover', value: 'cover' },
              { label: 'Contain', value: 'contain' },
              { label: 'Auto', value: 'auto' },
            ],
            type: 'select',
          },
        ],
      },
      {
        type: 'row',
        admin: { condition: (_d, s) => s?.type === 'image' },
        fields: [
          {
            name: 'repeat',
            defaultValue: 'no-repeat',
            label: 'Image repeat',
            options: [
              { label: 'No repeat', value: 'no-repeat' },
              { label: 'Repeat', value: 'repeat' },
              { label: 'Repeat X', value: 'repeat-x' },
              { label: 'Repeat Y', value: 'repeat-y' },
            ],
            type: 'select',
          },
          {
            name: 'attach',
            defaultValue: 'scroll',
            label: 'Background attachment',
            options: [
              { label: 'Scroll', value: 'scroll' },
              { label: 'Fixed', value: 'fixed' },
              { label: 'Parallax', value: 'parallax' },
            ],
            type: 'select',
          },
        ],
      },
      {
        name: 'blend',
        admin: { condition: (_d, s) => s?.type === 'image' || s?.type === 'gradient' },
        defaultValue: 'normal',
        label: 'Blend mode',
        options: [
          'normal',
          'multiply',
          'screen',
          'overlay',
          'darken',
          'lighten',
          'soft-light',
          'luminosity',
        ].map((v) => ({ label: v, value: v })),
        type: 'select',
      },

      /* Video */
      {
        name: 'video',
        admin: {
          condition: (_d, s) => s?.type === 'video',
          description: 'MP4 recommended. Plays muted and looped.',
        },
        label: 'Background video',
        relationTo: 'media',
        type: 'upload',
      },
      {
        name: 'poster',
        admin: { condition: (_d, s) => s?.type === 'video' },
        label: 'Video poster image',
        relationTo: 'media',
        type: 'upload',
      },

      /* Overlay — applies to image and video */
      {
        type: 'row',
        admin: { condition: (_d, s) => s?.type === 'image' || s?.type === 'video' },
        fields: [
          colour('overlay', 'Overlay colour', 'rgba(0,0,0,.4)'),
          {
            name: 'overlayOpacity',
            admin: { placeholder: '0.4', step: 0.05 },
            label: 'Overlay opacity',
            max: 1,
            min: 0,
            type: 'number',
          },
        ],
      },
    ],
    label: 'Background',
    type: 'group',
  },
]

/* ------------------------------------------------------------------ */
/* Extras — animation, visibility, CSS hooks                           */
/* ------------------------------------------------------------------ */

export const extrasFields: Field[] = [
  {
    name: 'anim',
    admin: { hideGutter: true },
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'preset',
            defaultValue: 'none',
            label: 'Animation',
            options: [
              { label: 'None', value: 'none' },
              { label: 'Fade', value: 'fade' },
              { label: 'Fade up', value: 'fade-up' },
              { label: 'Fade down', value: 'fade-down' },
              { label: 'Fade left', value: 'fade-left' },
              { label: 'Fade right', value: 'fade-right' },
              { label: 'Zoom', value: 'zoom' },
            ],
            type: 'select',
          },
          {
            name: 'duration',
            admin: { placeholder: '400' },
            label: 'Duration (ms)',
            type: 'number',
          },
          { name: 'delay', admin: { placeholder: '0' }, label: 'Delay (ms)', type: 'number' },
        ],
      },
      {
        name: 'onScroll',
        admin: { description: 'Animate when the node scrolls into view rather than on load.' },
        defaultValue: true,
        label: 'Trigger on scroll',
        type: 'checkbox',
      },
    ],
    label: 'Animation',
    type: 'group',
  },
  {
    name: 'hide',
    admin: { hideGutter: true },
    fields: [
      {
        type: 'row',
        fields: [
          { name: 'desktop', defaultValue: false, label: 'Desktop', type: 'checkbox' },
          { name: 'tablet', defaultValue: false, label: 'Tablet', type: 'checkbox' },
          { name: 'mobile', defaultValue: false, label: 'Mobile', type: 'checkbox' },
        ],
      },
    ],
    label: 'Hide on',
    type: 'group',
  },
  {
    type: 'row',
    fields: [
      {
        name: 'cssClass',
        admin: { description: 'Space-separated. Letters, digits and hyphens only.' },
        label: 'CSS class',
        type: 'text',
      },
      { name: 'cssId', label: 'CSS ID', type: 'text' },
    ],
  },
  {
    name: 'attrs',
    admin: {
      description:
        'Rendered on the wrapper. Event handlers and style/class/id are ignored for security.',
      initCollapsed: true,
    },
    fields: [
      {
        type: 'row',
        fields: [
          { name: 'key', type: 'text' },
          { name: 'value', type: 'text' },
        ],
      },
    ],
    label: 'Custom attributes',
    type: 'array',
  },
]

/* ------------------------------------------------------------------ */
/* Tab assembly                                                        */
/* ------------------------------------------------------------------ */

export interface NodeTabsOptions {
  /** The node's own content fields — becomes the first tab. */
  contentFields?: Field[]
  /** Layout options specific to this node type. */
  generalFields?: Field[]
  contentLabel?: string
}

/**
 * The four-tab option set attached to every node.
 * Unnamed tabs add no path segment for data, so existing field names are
 * unaffected by wrapping them this way.
 */
export const nodeTabs = ({
  contentFields,
  contentLabel = 'Content',
  generalFields = [],
}: NodeTabsOptions = {}): Field => {
  const tabs: { description?: string; fields: Field[]; label: string }[] = []

  if (contentFields?.length) {
    tabs.push({ fields: contentFields, label: contentLabel })
  }
  if (generalFields.length) {
    tabs.push({ fields: generalFields, label: 'General' })
  }
  tabs.push({ fields: designFields, label: 'Design' })
  tabs.push({ fields: backgroundFields, label: 'Background' })
  tabs.push({ fields: extrasFields, label: 'Extras' })

  return { tabs, type: 'tabs' }
}

/** @deprecated kept so existing imports keep compiling — use `nodeTabs`. */
export const styleTab = (): Field => nodeTabs()
