/**
 * The one validation module — imported by the client renderer AND the
 * submit endpoint, so the rules cannot drift apart. Bypassing the browser
 * gains nothing: the server re-runs exactly this.
 */
import { defaultCountries, parseCountry } from 'react-international-phone'

import type { FileCheck, FormFieldSpec } from './types'
import { DEFAULT_UPLOAD_MIME, HARD_MAX_UPLOAD_MB } from './types'

export interface FieldError {
  name: string
  message: string
}

/** Overridable so a bilingual frontend can translate; keys are stable. */
export interface ValidationMessages {
  required: string
  email: string
  /** `{digits}` and `{country}` interpolate. */
  phoneCountry: string
  phoneGeneric: string
  minLength: string
  maxLength: string
  pattern: string
  number: string
  dateRange: string
  timeRange: string
  fileRequired: string
  fileType: string
  fileSize: string
}

export const DEFAULT_MESSAGES: ValidationMessages = {
  required: 'This field is required.',
  email: 'Enter a valid email address.',
  phoneCountry: 'Enter the full {digits}-digit number for {country}.',
  phoneGeneric: 'Enter a valid phone number.',
  minLength: 'Must be at least {min} characters.',
  maxLength: 'Must be at most {max} characters.',
  pattern: 'The value does not match the expected format.',
  number: 'Enter a number.',
  dateRange: 'Choose a date between {min} and {max}.',
  timeRange: 'Choose a time between {min} and {max}.',
  fileRequired: 'Choose a file.',
  fileType: 'That file type is not accepted.',
  fileSize: 'The file is larger than {max} MB.',
}

const fill = (template: string, vars: Record<string, string | number>): string =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? ''))

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/* ------------------------------------------------------------------ */
/* Phone: per-country digit counts from the phone library's own masks   */
/* ------------------------------------------------------------------ */

interface CountryDigits {
  name: string
  digits: number | null
}

let countryCache: Map<string, CountryDigits> | null = null

const countries = (): Map<string, CountryDigits> => {
  if (countryCache) return countryCache
  countryCache = new Map()
  for (const raw of defaultCountries) {
    const c = parseCountry(raw)
    const format = typeof c.format === 'string' ? c.format : c.format?.default
    const digits = format ? (format.match(/\./g)?.length ?? null) : null
    countryCache.set(c.iso2, { digits, name: c.name })
  }
  return countryCache
}

/** Expected national digit count for an ISO2 country, null when unknown. */
export const countryDigitCount = (iso2: string): number | null =>
  countries().get(iso2.toLowerCase())?.digits ?? null

export const countryName = (iso2: string): string =>
  countries().get(iso2.toLowerCase())?.name ?? iso2.toUpperCase()

/* ------------------------------------------------------------------ */
/* Single-field validation                                             */
/* ------------------------------------------------------------------ */

/**
 * Validates one field. `value` is the submitted value; phone fields also
 * read `values[name + '__iso2']`. Returns a message or null.
 */
export const validateField = (
  field: FormFieldSpec,
  values: Record<string, unknown>,
  file?: FileCheck | null,
  messages: ValidationMessages = DEFAULT_MESSAGES,
): string | null => {
  const raw = values[field.name]
  const value = typeof raw === 'string' ? raw.trim() : raw
  const empty =
    value == null || value === '' || value === false || (Array.isArray(value) && !value.length)

  if (field.type === 'file') {
    if (field.required && !file && !value) return messages.fileRequired
    if (file) {
      const accept = (field.accept ?? '')
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean)
      const allowed = accept.length
        ? accept
        : DEFAULT_UPLOAD_MIME
      const matches = allowed.some(
        (a) =>
          a === file.type.toLowerCase() ||
          (a.endsWith('/*') && file.type.toLowerCase().startsWith(a.slice(0, -1))) ||
          (a.startsWith('.') && file.name.toLowerCase().endsWith(a)),
      )
      if (!matches) return messages.fileType
      const maxMB = Math.min(field.maxSizeMB ?? HARD_MAX_UPLOAD_MB, HARD_MAX_UPLOAD_MB)
      if (file.size > maxMB * 1024 * 1024) return fill(messages.fileSize, { max: maxMB })
    }
    return null
  }

  if (empty) return field.required ? messages.required : null

  const text = String(value)

  switch (field.type) {
    case 'email':
      if (!EMAIL_RE.test(text)) return messages.email
      break

    case 'tel': {
      const digits = text.replace(/\D/g, '')
      if (field.intlPhone) {
        const iso2 = String(values[`${field.name}__iso2`] ?? field.defaultCountry ?? '').toLowerCase()
        const expected = iso2 ? countryDigitCount(iso2) : null
        if (expected != null) {
          if (digits.length !== expected)
            return fill(messages.phoneCountry, { country: countryName(iso2), digits: expected })
        } else if (digits.length < 4 || digits.length > 15) {
          return messages.phoneGeneric
        }
      } else {
        const min = field.minLength ?? 10
        const max = field.maxLength ?? 10
        if (digits.length < min) return fill(messages.minLength, { min })
        if (digits.length > max) return fill(messages.maxLength, { max })
        const pattern = field.pattern ?? '[6-9][0-9]{9}'
        if (!new RegExp(`^(?:${pattern})$`).test(digits))
          return field.patternMessage || messages.phoneGeneric
      }
      break
    }

    case 'number':
      if (Number.isNaN(Number(text))) return messages.number
      break

    case 'date':
      if (
        (field.minDate && text < field.minDate) ||
        (field.maxDate && text > field.maxDate)
      )
        return fill(messages.dateRange, {
          max: field.maxDate ?? '…',
          min: field.minDate ?? '…',
        })
      break

    case 'time':
      if (
        (field.minTime && text < field.minTime) ||
        (field.maxTime && text > field.maxTime)
      )
        return fill(messages.timeRange, {
          max: field.maxTime ?? '…',
          min: field.minTime ?? '…',
        })
      break

    default:
      break
  }

  /* generic text rules (text, textarea, and anything with lengths) */
  if (field.type === 'text' || field.type === 'textarea') {
    if (field.minLength && text.length < field.minLength)
      return fill(messages.minLength, { min: field.minLength })
    if (field.maxLength && text.length > field.maxLength)
      return fill(messages.maxLength, { max: field.maxLength })
    if (field.pattern) {
      try {
        if (!new RegExp(`^(?:${field.pattern})$`).test(text))
          return field.patternMessage || messages.pattern
      } catch {
        /* an invalid editor regex never blocks a real person */
      }
    }
  }

  return null
}

/** Validates every field; helper `__` keys and unknown keys are ignored. */
export const validateAll = (
  fields: FormFieldSpec[],
  values: Record<string, unknown>,
  files?: Record<string, FileCheck | null>,
  messages?: ValidationMessages,
): FieldError[] => {
  const errors: FieldError[] = []
  for (const field of fields) {
    const message = validateField(field, values, files?.[field.name] ?? null, messages)
    if (message) errors.push({ message, name: field.name })
  }
  return errors
}
