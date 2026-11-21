/**
 * Shared shapes for the CMS-driven form system. Everything here is
 * isomorphic — imported by the admin collection config, the server
 * endpoints AND the client renderer, so keep it free of payload/react
 * imports.
 */

export const FIELD_TYPES = [
  'text',
  'email',
  'tel',
  'number',
  'textarea',
  'select',
  'radio',
  'checkbox',
  'date',
  'time',
  'file',
  'hidden',
] as const

export type FormFieldType = (typeof FIELD_TYPES)[number]

export const FIELD_WIDTHS = ['full', '1/2', '1/3', '2/3', '1/4', '3/4'] as const
export type FieldWidth = (typeof FIELD_WIDTHS)[number]

/** One row of the form's `fields` array, as stored and as rendered. */
export interface FormFieldSpec {
  label?: string | null
  name: string
  type: FormFieldType
  placeholder?: string | null
  defaultValue?: string | null
  required?: boolean | null
  showLabel?: boolean | null
  width?: FieldWidth | null
  rows?: number | null
  cssClass?: string | null
  wrapperClass?: string | null

  /* validation */
  minLength?: number | null
  maxLength?: number | null
  pattern?: string | null
  patternMessage?: string | null
  minDate?: string | null
  maxDate?: string | null
  minTime?: string | null
  maxTime?: string | null

  /* select / radio */
  options?: { option: string }[] | null
  optionsSource?: 'static' | 'collection' | null
  optionsCollection?: string | null
  optionsLabelField?: string | null
  optionsSort?: 'default' | 'newest' | 'oldest' | 'name' | null

  /* tel */
  intlPhone?: boolean | null
  defaultCountry?: string | null
  phoneMaskPlaceholder?: boolean | null

  /* file */
  accept?: string | null
  maxSizeMB?: number | null
}

export type SuccessAction =
  | 'message'
  | 'downloadFile'
  | 'downloadContext'
  | 'redirect'
  | 'redirectDownload'

/** The subset of a form document the renderer and validators need. */
export interface FormSpec {
  id: number | string
  title: string
  slug?: string | null
  heading?: string | null
  intro?: string | null
  cssClass?: string | null
  attributes?: { name: string; value: string }[] | null
  fields: FormFieldSpec[]
  submitLabel?: string | null
  successMessage?: string | null
  successAction?: SuccessAction | null
  successFile?: unknown
  redirectUrl?: string | null
}

/** Context a trigger (card, popup opener) passes into the form. */
export interface FormContext {
  downloadUrl?: string
  downloadName?: string
  [key: string]: unknown
}

/** What the client submits to POST /api/forms/submit. */
export interface SubmitPayload {
  formId: number | string
  data: Record<string, unknown>
  pageUrl?: string
  context?: FormContext
  recaptchaToken?: string
  /** Content locale — localized success/user-email copy follows it. */
  locale?: string
}

export interface SubmitResponse {
  ok: boolean
  stored?: boolean
  emailed?: boolean
  errors?: { name: string; message: string }[]
  message?: string
}

/** Minimal file descriptor so validation runs identically on both sides. */
export interface FileCheck {
  name: string
  size: number
  type: string
}

export const DEFAULT_UPLOAD_MIME = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
export const HARD_MAX_UPLOAD_MB = 10
