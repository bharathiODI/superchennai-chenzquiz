import type { Access, CollectionConfig } from 'payload'

/**
 * `form-submissions` — write-once records, readable only by logged-in
 * staff. `create` is denied to everyone: the submit endpoint writes with
 * `overrideAccess`, so neither REST nor GraphQL can insert (or read)
 * anonymously. The fields are read-only in the admin: a submission is
 * evidence, not content.
 */

export interface SubmissionsCollectionOptions {
  slug?: string
  formsSlug?: string
  canRead?: Access
  /** Upload collection of form files — its URLs get Download links in the admin. */
  uploadsSlug?: string
}

const loggedIn: Access = ({ req }) => Boolean(req.user)
const never: Access = () => false

export const buildFormSubmissionsCollection = ({
  canRead,
  formsSlug = 'forms',
  slug = 'form-submissions',
  uploadsSlug = 'media',
}: SubmissionsCollectionOptions = {}): CollectionConfig => ({
  slug,
  access: {
    create: never,
    delete: canRead ?? loggedIn,
    read: canRead ?? loggedIn,
    update: never,
  },
  admin: {
    defaultColumns: ['formTitle', 'summary', 'files', 'submittedAt'],
    group: 'Forms',
    useAsTitle: 'summary',
  },
  disableDuplicate: true,
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'formTitle', admin: { readOnly: true }, type: 'text' },
        { name: 'form', admin: { readOnly: true }, relationTo: formsSlug as never, type: 'relationship' },
        { name: 'submittedAt', admin: { readOnly: true }, type: 'date' },
      ],
    },
    {
      name: 'summary',
      admin: { description: 'First few field values, for the list view.', readOnly: true },
      type: 'text',
    },
    // Download links for uploaded files (no stored data — read from `data`).
    {
      name: 'files',
      admin: {
        components: {
          Cell: { clientProps: { uploadsSlug }, path: '@opendesigns/payload-builder/client#SubmissionFilesCell' },
          Field: { clientProps: { uploadsSlug }, path: '@opendesigns/payload-builder/client#SubmissionFilesField' },
        },
      },
      label: 'Files',
      type: 'ui',
    },
    { name: 'pageUrl', admin: { readOnly: true }, type: 'text' },
    {
      name: 'data',
      admin: { readOnly: true },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text' },
            { name: 'name', type: 'text' },
            { name: 'value', type: 'textarea' },
          ],
        },
      ],
      type: 'array',
    },
    {
      name: 'attribution',
      admin: { description: 'Captured from the landing URL.', readOnly: true },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'source', type: 'text' },
            { name: 'medium', type: 'text' },
            { name: 'campaign', type: 'text' },
          ],
        },
        { name: 'urlParams', type: 'textarea' },
      ],
      type: 'group',
    },
  ],
  timestamps: true,
})
