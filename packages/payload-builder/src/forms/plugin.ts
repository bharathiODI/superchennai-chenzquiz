import type { Access, CollectionConfig, Config, Plugin } from 'payload'

import { buildFormsCollection } from './collections/forms'
import { buildFormSubmissionsCollection } from './collections/submissions'
import { buildOptionsEndpoint } from './endpoints/options'
import { buildSubmitEndpoint } from './endpoints/submit'
import { buildUploadEndpoint } from './endpoints/upload'
import { buildFormMailSettingsGlobal } from './globals/mailSettings'
import { buildFormSecuritySettingsGlobal } from './globals/securitySettings'

/**
 * dynamicFormsPlugin — the CMS-driven form system in one call:
 *
 *   plugins: [
 *     dynamicFormsPlugin({
 *       optionsCollections: ['projects'],
 *       privateUploads: true,   // adds `private-media` for ID documents etc.
 *     }),
 *   ]
 *
 * Adds the `forms` + `form-submissions` collections, the mail/security
 * globals, and the /api/form-submit | form-upload | form-options endpoints.
 * Render any form on the front end with `<DynamicForm />` from
 * `@opendesigns/payload-builder/client`.
 */

export interface DynamicFormsPluginOptions {
  enabled?: boolean
  formsSlug?: string
  submissionsSlug?: string
  mailSettingsSlug?: string
  securitySlug?: string
  /** Upload collection for form file fields. Default: private uploads when enabled, else `media`. */
  uploadsSlug?: string
  /** Adds a `private-media` collection (auth-only read) and uses it for form uploads. */
  privateUploads?: boolean
  /**
   * Absolute directory for private uploads on disk. Pass one — a relative
   * default resolves against process.cwd(), which in a container is the
   * root-owned app directory, and the first CV upload fails with EACCES.
   * Ignored when a cloud storage plugin owns the collection.
   */
  privateUploadsDir?: string
  /** Collections a select field may draw options from. */
  optionsCollections?: string[]
  /** Media collection for success-action download files. */
  mediaSlug?: string
  /** Localize editor-facing form text (labels, placeholders, messages). */
  localized?: boolean
  /** Who may manage forms / read submissions. Default: any logged-in user. */
  access?: { manageForms?: Access; readSubmissions?: Access }
}

const buildPrivateMediaCollection = (slug: string, staticDir = 'private-media'): CollectionConfig => ({
  slug,
  access: {
    create: () => false, // the upload endpoint writes with overrideAccess
    delete: ({ req }) => Boolean(req.user),
    read: ({ req }) => Boolean(req.user), // Payload's file route enforces this too
    update: () => false,
  },
  admin: {
    description: 'Files uploaded through public forms. Not publicly readable.',
    group: 'Forms',
  },
  fields: [{ name: 'alt', type: 'text' }],
  labels: { plural: 'Form Uploads', singular: 'Form Upload' },
  upload: {
    // Word documents too: CV fields commonly accept .doc/.docx, and a type the
    // field allows but this list does not made the upload fail outright.
    // Payload checks the type detected from the file's bytes: a legacy .doc is
    // detected as `application/x-cfb` (OLE compound file), not
    // `application/msword`, so both are listed. The form field's `accept`
    // (extension list) still limits what the upload endpoint lets through.
    mimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/x-cfb',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    staticDir,
  },
})

export const dynamicFormsPlugin = (options: DynamicFormsPluginOptions = {}): Plugin => {
  const {
    access = {},
    enabled = true,
    formsSlug = 'forms',
    localized,
    mailSettingsSlug = 'form-mail-settings',
    mediaSlug = 'media',
    optionsCollections = [],
    privateUploads = false,
    privateUploadsDir,
    securitySlug = 'form-security-settings',
    submissionsSlug = 'form-submissions',
  } = options
  const uploadsSlug = options.uploadsSlug ?? (privateUploads ? 'private-media' : mediaSlug)

  return (incomingConfig: Config): Config => {
    if (!enabled) return incomingConfig

    const collections = [...(incomingConfig.collections ?? [])]
    const have = new Set(collections.map((c) => c.slug))

    if (!have.has(formsSlug))
      collections.push(
        buildFormsCollection({
          canManage: access.manageForms,
          localized,
          mediaSlug,
          optionsCollections,
          slug: formsSlug,
        }),
      )
    if (!have.has(submissionsSlug))
      collections.push(
        buildFormSubmissionsCollection({
          canRead: access.readSubmissions,
          formsSlug,
          slug: submissionsSlug,
          uploadsSlug,
        }),
      )
    if (privateUploads && !have.has(uploadsSlug))
      collections.push(buildPrivateMediaCollection(uploadsSlug, privateUploadsDir))

    return {
      ...incomingConfig,
      collections,
      endpoints: [
        ...(incomingConfig.endpoints ?? []),
        buildSubmitEndpoint({ formsSlug, mailSettingsSlug, securitySlug, submissionsSlug, uploadsSlug }),
        buildUploadEndpoint({ formsSlug, securitySlug, uploadsSlug }),
        buildOptionsEndpoint({ formsSlug }),
      ],
      globals: [
        ...(incomingConfig.globals ?? []),
        buildFormMailSettingsGlobal({ slug: mailSettingsSlug }),
        buildFormSecuritySettingsGlobal({ slug: securitySlug }),
      ],
    }
  }
}
