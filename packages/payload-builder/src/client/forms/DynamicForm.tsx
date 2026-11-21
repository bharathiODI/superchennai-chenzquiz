'use client'

/**
 * <DynamicForm /> — renders any `forms` document. One component, every
 * field type, inline validation shared verbatim with the server
 * (../../forms/validation), phone with per-country completeness, file
 * pre-upload, reCAPTCHA v3 and the five success actions.
 *
 * Styling: the markup carries stable class hooks (df-form, df-field,
 * df-label, df-control, df-error, is-invalid…) plus the editor's own
 * cssClass/wrapperClass, and widths flow through a 12-column inline grid,
 * so it drops into any design system unstyled or fully themed.
 *
 * The consuming app should import 'react-international-phone/style.css'
 * once (e.g. in its root layout) when phone fields are used.
 */

import type { FormEvent } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { PhoneInput } from 'react-international-phone'

import type {
  FormContext,
  FormFieldSpec,
  FormSpec,
  SubmitResponse,
} from '../../forms/types'
import type { ValidationMessages } from '../../forms/validation'
import { countryDigitCount, validateField } from '../../forms/validation'

/* ------------------------------------------------------------------ */

const SPAN: Record<string, number> = {
  '1/2': 6,
  '1/3': 4,
  '1/4': 3,
  '2/3': 8,
  '3/4': 9,
  full: 12,
}

interface RecaptchaLike {
  execute: (siteKey: string, opts: { action: string }) => Promise<string>
  ready: (cb: () => void) => void
}

declare global {
  interface Window {
    grecaptcha?: RecaptchaLike
  }
}

const loadRecaptcha = (siteKey: string): Promise<RecaptchaLike | null> =>
  new Promise((resolve) => {
    if (window.grecaptcha) return resolve(window.grecaptcha)
    const existing = document.querySelector<HTMLScriptElement>('script[data-df-recaptcha]')
    const done = () => window.grecaptcha?.ready(() => resolve(window.grecaptcha ?? null))
    if (existing) {
      existing.addEventListener('load', done)
      return
    }
    const script = document.createElement('script')
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`
    script.async = true
    script.dataset.dfRecaptcha = 'true'
    script.addEventListener('load', done)
    script.addEventListener('error', () => resolve(null))
    document.head.appendChild(script)
  })

/** Popup-blocker-safe download: a real <a download>, never window.open. */
const triggerDownload = (url: string, name?: string): void => {
  const a = document.createElement('a')
  a.href = url
  a.download = name || ''
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()
}

const fileUrl = (file: unknown): string =>
  typeof file === 'object' && file !== null ? ((file as { url?: string }).url ?? '') : ''

/* ------------------------------------------------------------------ */

export interface DynamicFormProps {
  form: FormSpec
  /** Passed by the trigger (card / popup opener); cleared by the opener on close. */
  context?: FormContext | null
  /** From the form-security-settings global. */
  recaptcha?: { enabled?: boolean | null; siteKey?: string | null } | null
  /** Override validation copy (e.g. Arabic). */
  messages?: ValidationMessages
  /** Content locale — sent with the submission so localized success/email copy follows it. */
  locale?: string
  /** UI error copy overrides (localizable). */
  strings?: { submitError?: string; uploadError?: string }
  apiBase?: string
  className?: string
  onSuccess?: (response: SubmitResponse) => void
}

type Status = 'idle' | 'sending' | 'sent' | 'error'

export function DynamicForm({
  apiBase = '/api',
  className,
  context,
  form,
  locale,
  messages,
  onSuccess,
  recaptcha,
  strings,
}: DynamicFormProps) {
  const fields = useMemo(() => form.fields ?? [], [form.fields])

  const initialValues = useMemo(() => {
    const v: Record<string, unknown> = {}
    for (const f of fields) {
      if (f.type === 'checkbox') v[f.name] = f.defaultValue === 'true'
      else v[f.name] = f.defaultValue ?? ''
      if (f.type === 'tel' && f.intlPhone) v[`${f.name}__iso2`] = (f.defaultCountry ?? 'ae').toLowerCase()
    }
    return v
  }, [fields])

  const [values, setValues] = useState<Record<string, unknown>>(initialValues)
  const [files, setFiles] = useState<Record<string, File | null>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<Status>('idle')
  const [failMessage, setFailMessage] = useState<string | null>(null)
  const [dynamicOptions, setDynamicOptions] = useState<Record<string, { label: string; value: string }[]>>({})
  const rootRef = useRef<HTMLFormElement>(null)

  const siteKey = recaptcha?.enabled ? (recaptcha.siteKey ?? '') : ''

  /* Warm the reCAPTCHA script on mount so the first submit isn't slow. */
  useEffect(() => {
    if (siteKey) void loadRecaptcha(siteKey)
  }, [siteKey])

  /* Dynamic select options. */
  useEffect(() => {
    for (const f of fields) {
      if ((f.type === 'select' || f.type === 'radio') && f.optionsSource === 'collection') {
        void fetch(`${apiBase}/form-options?formId=${encodeURIComponent(String(form.id))}&field=${encodeURIComponent(f.name)}`)
          .then((r) => (r.ok ? r.json() : null))
          .then((json: { options?: { label: string; value: string }[] } | null) => {
            if (json?.options) setDynamicOptions((prev) => ({ ...prev, [f.name]: json.options! }))
          })
          .catch(() => undefined)
      }
    }
  }, [apiBase, fields, form.id])

  const setValue = useCallback((name: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [name]: value }))
  }, [])

  const fileCheckOf = (f: File | null | undefined) =>
    f ? { name: f.name, size: f.size, type: f.type } : null

  const validateOne = useCallback(
    (field: FormFieldSpec, nextValues: Record<string, unknown>) => {
      const message = validateField(field, nextValues, fileCheckOf(files[field.name]), messages)
      setErrors((prev) => {
        const next = { ...prev }
        if (message) next[field.name] = message
        else delete next[field.name]
        return next
      })
      return !message
    },
    [files, messages],
  )

  const validateEverything = useCallback((): boolean => {
    const next: Record<string, string> = {}
    for (const field of fields) {
      const message = validateField(field, values, fileCheckOf(files[field.name]), messages)
      if (message) next[field.name] = message
    }
    setErrors(next)
    const first = fields.find((f) => next[f.name])
    if (first) {
      const el = rootRef.current?.querySelector(`[data-df-field="${first.name}"]`)
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    return !Object.keys(next).length
  }, [fields, files, messages, values])

  /* ---------------------------- submit ---------------------------- */

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFailMessage(null)
    if (!validateEverything()) return
    setStatus('sending')

    try {
      /* Files first — the field's value becomes the stored URL. */
      const data: Record<string, unknown> = { ...values }
      for (const field of fields) {
        const file = files[field.name]
        if (field.type !== 'file' || !file) continue
        const fd = new FormData()
        fd.set('formId', String(form.id))
        fd.set('field', field.name)
        fd.set('file', file)
        const res = await fetch(`${apiBase}/form-upload`, { body: fd, method: 'POST' })
        const json = (await res.json()) as { message?: string; ok?: boolean; url?: string }
        if (!res.ok || !json.ok || !json.url) {
          setErrors((prev) => ({
            ...prev,
            [field.name]: strings?.uploadError ?? json.message ?? 'Upload failed.',
          }))
          setStatus('idle')
          return
        }
        data[field.name] = json.url
      }

      let recaptchaToken: string | undefined
      if (siteKey) {
        const g = await loadRecaptcha(siteKey)
        if (g) recaptchaToken = await g.execute(siteKey, { action: 'form_submit' }).catch(() => undefined)
      }

      const res = await fetch(`${apiBase}/form-submit`, {
        body: JSON.stringify({
          context: context ?? undefined,
          data,
          formId: form.id,
          locale,
          pageUrl: window.location.href,
          recaptchaToken,
        }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })
      const json = (await res.json()) as SubmitResponse

      if (!res.ok || !json.ok) {
        if (json.errors?.length) {
          setErrors(Object.fromEntries(json.errors.map((e) => [e.name, e.message])))
        }
        setFailMessage(strings?.submitError ?? json.message ?? 'Something went wrong. Please try again.')
        setStatus('error')
        return
      }

      setStatus('sent')
      onSuccess?.(json)
      runSuccessAction()
    } catch {
      setFailMessage(strings?.submitError ?? 'Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  const runSuccessAction = () => {
    const action = form.successAction ?? 'message'
    const ownFile = fileUrl(form.successFile)
    if (action === 'downloadFile' && ownFile) triggerDownload(ownFile)
    if (action === 'downloadContext' && context?.downloadUrl)
      triggerDownload(context.downloadUrl, context.downloadName)
    if (action === 'redirect' && form.redirectUrl) window.location.assign(form.redirectUrl)
    if (action === 'redirectDownload') {
      const url = ownFile || context?.downloadUrl
      if (url) triggerDownload(url, context?.downloadName)
      if (form.redirectUrl) {
        const target = form.redirectUrl
        // Give the download request time to fire before navigation.
        window.setTimeout(() => window.location.assign(target), 1200)
      }
    }
  }

  /* ---------------------------- controls --------------------------- */

  const control = (field: FormFieldSpec) => {
    const invalid = Boolean(errors[field.name])
    const base = {
      className: `df-control${invalid ? ' is-invalid' : ''}${field.cssClass ? ` ${field.cssClass}` : ''}`,
      id: `df-${form.id}-${field.name}`,
      name: field.name,
      onBlur: () => validateOne(field, values),
    }
    const text = String(values[field.name] ?? '')

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            {...base}
            onChange={(e) => setValue(field.name, e.target.value)}
            placeholder={field.placeholder ?? undefined}
            rows={field.rows ?? 4}
            value={text}
          />
        )

      case 'select': {
        const options =
          field.optionsSource === 'collection'
            ? (dynamicOptions[field.name] ?? [])
            : (field.options ?? []).map((o) => ({ label: o.option, value: o.option }))
        return (
          <select {...base} onChange={(e) => setValue(field.name, e.target.value)} value={text}>
            <option value="">{field.placeholder || field.label || '—'}</option>
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        )
      }

      case 'radio': {
        const options =
          field.optionsSource === 'collection'
            ? (dynamicOptions[field.name] ?? [])
            : (field.options ?? []).map((o) => ({ label: o.option, value: o.option }))
        return (
          <div className={`df-radio-group${invalid ? ' is-invalid' : ''}`} role="radiogroup">
            {options.map((o) => (
              <label className="df-radio" key={o.value}>
                <input
                  checked={text === o.value}
                  name={field.name}
                  onBlur={base.onBlur}
                  onChange={() => setValue(field.name, o.value)}
                  type="radio"
                  value={o.value}
                />
                <span>{o.label}</span>
              </label>
            ))}
          </div>
        )
      }

      case 'checkbox':
        return (
          <label className="df-checkbox">
            <input
              checked={Boolean(values[field.name])}
              className={invalid ? 'is-invalid' : undefined}
              id={base.id}
              name={field.name}
              onBlur={base.onBlur}
              onChange={(e) => setValue(field.name, e.target.checked)}
              type="checkbox"
            />
            <span>{field.label}</span>
          </label>
        )

      case 'file': {
        const chosen = files[field.name]
        const accept = field.accept ?? 'image/jpeg,image/png,image/webp,application/pdf'
        // "PDF / DOC / DOCX, max 5MB" — derived from the field config so the
        // hint never drifts from what the server actually accepts.
        const kinds = accept
          .split(',')
          .map((a) => a.trim())
          .filter(Boolean)
          .map((a) => (a.startsWith('.') ? a.slice(1) : (a.split('/')[1] ?? a)).replace('*', '').toUpperCase())
          .filter(Boolean)
          .join(' / ')
        const hint =
          chosen?.name ||
          [kinds, field.maxSizeMB ? `max ${field.maxSizeMB}MB` : null].filter(Boolean).join(', ')
        return (
          // The input stays the labelled control (visually hidden via CSS);
          // the button is a real <label for>, like the static design.
          <div className={`df-file${invalid ? ' is-invalid' : ''}`}>
            <input
              accept={accept}
              id={base.id}
              name={field.name}
              onBlur={base.onBlur}
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null
                setFiles((prev) => ({ ...prev, [field.name]: file }))
                // Fail a 20 MB file instantly, before any upload starts.
                const message = validateField(
                  field,
                  { ...values, [field.name]: file ? file.name : '' },
                  fileCheckOf(file),
                  messages,
                )
                setErrors((prev) => {
                  const next = { ...prev }
                  if (message) next[field.name] = message
                  else delete next[field.name]
                  return next
                })
                if (file) setValue(field.name, file.name)
              }}
              type="file"
            />
            <label className="df-file-btn" htmlFor={base.id}>
              {field.placeholder || 'Upload'}
            </label>
            <span className="df-file-name">{hint}</span>
          </div>
        )
      }

      case 'tel':
        if (field.intlPhone) {
          const iso2 = String(values[`${field.name}__iso2`] ?? field.defaultCountry ?? 'ae')
          const digits = countryDigitCount(iso2)
          const mask =
            field.phoneMaskPlaceholder && digits ? '_'.repeat(digits) : (field.placeholder ?? undefined)
          return (
            <div className={`df-phone${invalid ? ' is-invalid' : ''}`} data-df-phone>
              <PhoneInput
                defaultCountry={(field.defaultCountry ?? 'ae').toLowerCase()}
                // With the dial code inside the input the placeholder never
                // shows, so keep it outside and display it disabled.
                disableDialCodeAndPrefix={Boolean(field.phoneMaskPlaceholder)}
                showDisabledDialCodeAndPrefix={Boolean(field.phoneMaskPlaceholder)}
                inputProps={{ id: base.id, onBlur: base.onBlur, placeholder: mask }}
                onChange={(phone, meta) => {
                  const country = meta?.country
                  const dial = country?.dialCode ?? ''
                  const national = phone.replace(/\D/g, '').replace(new RegExp(`^${dial}`), '')
                  setValues((prev) => ({
                    ...prev,
                    [field.name]: national,
                    [`${field.name}__dial`]: dial,
                    [`${field.name}__display`]: phone,
                    [`${field.name}__iso2`]: country?.iso2 ?? iso2,
                  }))
                }}
                value={String(values[`${field.name}__display`] ?? '')}
              />
              {/* Hidden mirrors — what actually submits and validates. */}
              <input name={field.name} type="hidden" value={text} />
              <input name={`${field.name}__dial`} type="hidden" value={String(values[`${field.name}__dial`] ?? '')} />
              <input name={`${field.name}__iso2`} type="hidden" value={iso2} />
            </div>
          )
        }
        return (
          <input
            {...base}
            inputMode="tel"
            onChange={(e) => setValue(field.name, e.target.value)}
            placeholder={field.placeholder ?? undefined}
            type="tel"
            value={text}
          />
        )

      case 'hidden':
        return <input name={field.name} type="hidden" value={text} />

      default:
        return (
          <input
            {...base}
            onChange={(e) => setValue(field.name, e.target.value)}
            placeholder={field.placeholder ?? undefined}
            type={field.type === 'number' ? 'number' : field.type}
            value={text}
          />
        )
    }
  }

  /* ---------------------------- render ----------------------------- */

  if (status === 'sent' && (form.successAction ?? 'message') === 'message') {
    return (
      <div className="df-success" role="status">
        {form.successMessage || 'Thank you — your enquiry has been sent.'}
      </div>
    )
  }

  const attrs = Object.fromEntries((form.attributes ?? []).map((a) => [a.name, a.value]))

  return (
    <form
      {...attrs}
      className={['df-form', form.cssClass, className].filter(Boolean).join(' ')}
      noValidate
      onSubmit={onSubmit}
      ref={rootRef}
    >
      {form.heading && <h3 className="df-heading">{form.heading}</h3>}
      {form.intro && <p className="df-intro">{form.intro}</p>}

      <div className="df-grid" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(12, 1fr)' }}>
        {fields.map((field) => {
          if (field.type === 'hidden') return <span key={field.name}>{control(field)}</span>
          const span = SPAN[field.width ?? 'full'] ?? 12
          return (
            <div
              className={['df-field', `df-type-${field.type}`, field.wrapperClass].filter(Boolean).join(' ')}
              data-df-field={field.name}
              key={field.name}
              style={{ gridColumn: `span ${span}` }}
            >
              {field.showLabel && field.type !== 'checkbox' && (
                <label className="df-label" htmlFor={`df-${form.id}-${field.name}`}>
                  {field.label || field.name}
                  {field.required && <span className="df-required"> *</span>}
                </label>
              )}
              {control(field)}
              {errors[field.name] && (
                <p className="df-error" role="alert">
                  {errors[field.name]}
                </p>
              )}
            </div>
          )
        })}
      </div>

      <button className="df-submit" disabled={status === 'sending'} type="submit">
        {status === 'sending' ? '…' : form.submitLabel || 'Submit'}
        <svg aria-hidden="true" className="btn-icon df-submit-icon" viewBox="0 0 16 16">
          <path
            d="M3 8h9M8.5 4l4 4-4 4"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </svg>
      </button>

      <p aria-live="polite" className="df-status" role="status">
        {status === 'error' && (failMessage ?? 'Something went wrong. Please try again.')}
      </p>
    </form>
  )
}

export default DynamicForm
