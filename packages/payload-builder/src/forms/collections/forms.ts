import type { Access, CollectionConfig, Field } from 'payload'

import { isLocalizationEnabled } from '../../i18n/localized'
import { FIELD_TYPES, FIELD_WIDTHS } from '../types'

/**
 * `forms` — one document = one reusable form, Contact Form 7 style:
 * the editor picks fields, validation, the success behaviour and the
 * two emails (admin notification + user acknowledgement) with mail-tags.
 *
 * Field-level `access.read` keeps recipient addresses and email bodies out
 * of the anonymous shape: the public REST read only serves what the
 * renderer needs.
 */

export interface FormsCollectionOptions {
  slug?: string
  /**
   * Localize editor-facing text (labels, placeholders, messages) so a
   * bilingual site can translate each form. Defaults to the builder
   * plugin's i18n switch — set explicitly when using this plugin without
   * builderPlugin (e.g. ERDC passes true).
   */
  localized?: boolean
  /** Collections a select field may draw its options from. */
  optionsCollections?: string[]
  /** Upload collection for success-action files. */
  mediaSlug?: string
  canManage?: Access
}

const loggedIn: Access = ({ req }) => Boolean(req.user)

/** Field-level read access — hides a field from anonymous API reads. */
const staffOnly = { read: ({ req }: { req: { user?: unknown } }) => Boolean(req.user) }

const when =
  (key: string, test: (v: unknown) => boolean) =>
  (_data: unknown, sibling: Record<string, unknown> | undefined): boolean =>
    test(sibling?.[key])

const typeIs = (...types: string[]) => when('type', (v) => types.includes(String(v)))

const fieldRow = (optionsCollections: string[], Lz: <T extends Field>(f: T) => T): Field[] => [
  {
    type: 'row',
    fields: [
      Lz({ name: 'label', type: 'text' }),
      {
        name: 'name',
        admin: {
          description: 'Key in the submission and the [mail-tag] token. Letters, digits, - and _.',
        },
        required: true,
        type: 'text',
        validate: (value: unknown) =>
          typeof value === 'string' && /^[a-zA-Z][a-zA-Z0-9_-]*$/.test(value)
            ? true
            : 'Use letters, digits, hyphen or underscore, starting with a letter.',
      },
      {
        name: 'type',
        defaultValue: 'text',
        options: FIELD_TYPES.map((t) => ({ label: t, value: t })),
        required: true,
        type: 'select',
      },
      {
        name: 'width',
        defaultValue: 'full',
        options: FIELD_WIDTHS.map((w) => ({ label: w, value: w })),
        type: 'select',
      },
    ],
  },
  {
    type: 'row',
    fields: [
      Lz({
        name: 'placeholder',
        admin: { condition: typeIs('text', 'email', 'tel', 'number', 'textarea', 'select', 'date', 'time') },
        type: 'text',
      }),
      { name: 'defaultValue', type: 'text' },
      { name: 'required', defaultValue: false, type: 'checkbox' },
      {
        name: 'showLabel',
        admin: { description: 'Render the label above the input (with a red * when required).' },
        defaultValue: false,
        type: 'checkbox',
      },
    ],
  },
  {
    name: 'rows',
    admin: { condition: typeIs('textarea') },
    defaultValue: 4,
    type: 'number',
  },
  {
    type: 'row',
    fields: [
      { name: 'cssClass', label: 'CSS class (control)', type: 'text' },
      { name: 'wrapperClass', label: 'CSS class (wrapper)', type: 'text' },
    ],
  },

  /* ---------- validation ---------- */
  {
    type: 'row',
    admin: { condition: typeIs('text', 'textarea', 'tel') },
    fields: [
      { name: 'minLength', type: 'number' },
      { name: 'maxLength', type: 'number' },
    ],
  },
  {
    type: 'row',
    admin: { condition: typeIs('text', 'textarea', 'tel') },
    fields: [
      {
        name: 'pattern',
        admin: { description: 'Regex without slashes, e.g. [6-9][0-9]{9}' },
        type: 'text',
      },
      Lz({ name: 'patternMessage', admin: { description: 'Shown when the pattern fails.' }, type: 'text' }),
    ],
  },
  {
    type: 'row',
    admin: { condition: typeIs('date') },
    fields: [
      { name: 'minDate', admin: { description: 'YYYY-MM-DD' }, type: 'text' },
      { name: 'maxDate', admin: { description: 'YYYY-MM-DD' }, type: 'text' },
    ],
  },
  {
    type: 'row',
    admin: { condition: typeIs('time') },
    fields: [
      { name: 'minTime', admin: { description: 'HH:MM (24h)' }, type: 'text' },
      { name: 'maxTime', admin: { description: 'HH:MM (24h)' }, type: 'text' },
    ],
  },

  /* ---------- select / radio options ---------- */
  {
    name: 'optionsSource',
    admin: { condition: typeIs('select', 'radio') },
    defaultValue: 'static',
    options: [
      { label: 'Static list', value: 'static' },
      ...(optionsCollections.length ? [{ label: 'From a collection', value: 'collection' }] : []),
    ],
    type: 'select',
  },
  {
    name: 'options',
    admin: {
      condition: (data, sibling) =>
        typeIs('select', 'radio')(data, sibling) && sibling?.optionsSource !== 'collection',
    },
    fields: [Lz({ name: 'option', required: true, type: 'text' })],
    type: 'array',
  },
  ...(optionsCollections.length
    ? ([
        {
          type: 'row',
          admin: {
            condition: (data: unknown, sibling: Record<string, unknown> | undefined) =>
              typeIs('select', 'radio')(data, sibling) && sibling?.optionsSource === 'collection',
          },
          fields: [
            {
              name: 'optionsCollection',
              options: optionsCollections.map((slug) => ({ label: slug, value: slug })),
              type: 'select',
            },
            {
              name: 'optionsLabelField',
              admin: { description: 'Field used as the option label. Default: title.' },
              type: 'text',
            },
            {
              name: 'optionsSort',
              defaultValue: 'default',
              options: ['default', 'newest', 'oldest', 'name'].map((v) => ({ label: v, value: v })),
              type: 'select',
            },
          ],
        },
      ] as Field[])
    : []),

  /* ---------- tel ---------- */
  {
    type: 'row',
    admin: { condition: typeIs('tel') },
    fields: [
      {
        name: 'intlPhone',
        admin: { description: 'Country flag + dial-code selector with per-country validation.' },
        defaultValue: false,
        type: 'checkbox',
      },
      {
        name: 'defaultCountry',
        admin: {
          condition: when('intlPhone', Boolean),
          description: 'ISO2 code, e.g. ae, in, us.',
        },
        defaultValue: 'ae',
        type: 'text',
      },
      {
        name: 'phoneMaskPlaceholder',
        admin: {
          condition: when('intlPhone', Boolean),
          description: "Shows the country's number format as underscores.",
        },
        defaultValue: false,
        type: 'checkbox',
      },
    ],
  },

  /* ---------- file ---------- */
  {
    type: 'row',
    admin: { condition: typeIs('file') },
    fields: [
      {
        name: 'accept',
        admin: { description: 'Comma-separated MIME types or extensions. Default: JPEG, PNG, WEBP, PDF.' },
        type: 'text',
      },
      { name: 'maxSizeMB', admin: { description: 'Hard server cap: 10 MB.' }, defaultValue: 5, type: 'number' },
    ],
  },
]

export const buildFormsCollection = ({
  canManage,
  localized,
  mediaSlug = 'media',
  optionsCollections = [],
  slug = 'forms',
}: FormsCollectionOptions = {}): CollectionConfig => {
  const loc = localized ?? isLocalizationEnabled()
  const Lz = <T extends Field>(field: T): T => (loc ? ({ ...field, localized: true } as T) : field)
  return {
  slug,
  access: {
    create: canManage ?? loggedIn,
    delete: canManage ?? loggedIn,
    read: () => true, // the renderer needs field definitions; email config is field-gated below
    update: canManage ?? loggedIn,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    group: 'Forms',
    useAsTitle: 'title',
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'title', required: true, type: 'text' },
        {
          name: 'slug',
          admin: { description: 'Stable handle for picking the form in code or blocks.' },
          index: true,
          type: 'text',
          unique: true,
        },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Fields',
          fields: [
            Lz({ name: 'heading', admin: { description: 'Shown above the form (popups).' }, type: 'text' }),
            Lz({ name: 'intro', type: 'textarea' }),
            {
              name: 'fields',
              admin: {
                components: undefined,
                description: 'The form, top to bottom. Widths flow left to right in a 12-column grid.',
                initCollapsed: true,
              },
              fields: fieldRow(optionsCollections, Lz),
              labels: { plural: 'Fields', singular: 'Field' },
              type: 'array',
            },
          ],
        },
        {
          label: 'Submit & success',
          fields: [
            {
              type: 'row',
              fields: [
                Lz({ name: 'submitLabel', defaultValue: 'Submit', type: 'text' }),
                {
                  name: 'successAction',
                  defaultValue: 'message',
                  options: [
                    { label: 'Show a message', value: 'message' },
                    { label: 'Download this form’s file', value: 'downloadFile' },
                    { label: 'Download the trigger’s file (context)', value: 'downloadContext' },
                    { label: 'Redirect', value: 'redirect' },
                    { label: 'Download, then redirect', value: 'redirectDownload' },
                  ],
                  type: 'select',
                },
              ],
            },
            Lz({
              name: 'successMessage',
              defaultValue: 'Thank you — your enquiry has been sent.',
              type: 'textarea',
            }),
            {
              name: 'successFile',
              admin: {
                condition: when('successAction', (v) => v === 'downloadFile' || v === 'redirectDownload'),
              },
              relationTo: mediaSlug as never,
              type: 'upload',
            },
            {
              name: 'redirectUrl',
              admin: {
                condition: when('successAction', (v) => v === 'redirect' || v === 'redirectDownload'),
              },
              type: 'text',
            },
          ],
        },
        {
          label: 'Email',
          fields: [
            {
              name: 'adminEmail',
              access: staffOnly,
              admin: {
                description:
                  'Notification to your team. Mail-tags: [field-name], [all-fields], [form-title], [page-url], [date].',
              },
              fields: [
                { name: 'enabled', defaultValue: true, type: 'checkbox' },
                {
                  type: 'row',
                  fields: [
                    { name: 'to', fields: [{ name: 'email', required: true, type: 'email' }], type: 'array' },
                    { name: 'cc', fields: [{ name: 'email', required: true, type: 'email' }], type: 'array' },
                    { name: 'bcc', fields: [{ name: 'email', required: true, type: 'email' }], type: 'array' },
                  ],
                },
                {
                  name: 'replyToField',
                  admin: { description: 'Name of a form field whose value becomes Reply-To.' },
                  type: 'text',
                },
                { name: 'subject', defaultValue: 'New enquiry — [form-title]', type: 'text' },
                {
                  name: 'body',
                  admin: { description: 'HTML allowed. Submitted values are escaped automatically.' },
                  defaultValue: '[all-fields]',
                  type: 'textarea',
                },
              ],
              type: 'group',
            },
            {
              name: 'userEmail',
              access: staffOnly,
              admin: { description: 'Optional acknowledgement to the person who submitted.' },
              fields: [
                { name: 'enabled', defaultValue: false, type: 'checkbox' },
                {
                  name: 'toField',
                  admin: { description: 'Name of the form field holding their email address.' },
                  type: 'text',
                },
                Lz({ name: 'subject', type: 'text' }),
                Lz({ name: 'body', type: 'textarea' }),
              ],
              type: 'group',
            },
          ],
        },
        {
          label: 'Advanced',
          fields: [
            {
              name: 'storeSubmissions',
              admin: { description: 'Keep a copy of every submission in the database.' },
              defaultValue: true,
              type: 'checkbox',
            },
            { name: 'cssClass', admin: { description: 'Class on the <form> element.' }, type: 'text' },
            {
              name: 'attributes',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'name', required: true, type: 'text' },
                    { name: 'value', type: 'text' },
                  ],
                },
              ],
              type: 'array',
            },
          ],
        },
      ],
    },
  ],
}
}
