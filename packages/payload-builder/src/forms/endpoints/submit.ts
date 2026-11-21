import { after } from 'next/server'
import type { Endpoint, Payload, PayloadRequest } from 'payload'

import { escapeHtml, renderMailTags } from '../email/mailTags'
import { appendFailedSubmission } from '../failsafe'
import { collectFormFiles, formatSize, type FormFile } from '../fileAttachments'
import { clientIp, rateLimit } from '../rateLimit'
import { verifyRecaptcha } from '../recaptcha'
import type { FormFieldSpec, SubmitPayload } from '../types'
import { validateAll } from '../validation'

/**
 * POST /api/forms/submit — the whole delivery path, in the order that
 * matters: rate limit → parse → reCAPTCHA → server-side re-validation →
 * store (with JSONL failsafe) → respond → admin + user email. Nothing here
 * throws a lead away silently.
 *
 * Emails go out after the response once the submission is stored, so the
 * visitor never waits for Microsoft Graph or for an attachment to be read.
 * If the store failed, the email is the only copy, so it is sent before
 * responding, as before.
 */

export interface SubmitEndpointOptions {
  formsSlug?: string
  submissionsSlug?: string
  mailSettingsSlug?: string
  securitySlug?: string
  /** Upload collection of the form's file fields (attached to the admin email). */
  uploadsSlug?: string
}

/** Runs after the response is sent; outside a request scope it just runs. */
const afterResponse = (task: () => Promise<void>): void => {
  try {
    after(task)
  } catch {
    void task()
  }
}

/** Absolute base URL for links in emails — never taken from the request. */
const siteBaseUrl = (payload: Payload): string =>
  (payload.config.serverURL || process.env.NEXT_PUBLIC_SERVER_URL || process.env.PAYLOAD_PUBLIC_SERVER_URL || '').replace(/\/+$/, '')

/**
 * How each uploaded file reads in the emails. Admin: name, size and either
 * "attached" or a link to the submission in the dashboard. Visitor: the file
 * name only (the stored URL is internal and needs a staff login).
 */
const fileDisplays = (files: FormFile[], dashboardUrl: string | null) => {
  const admin: Record<string, { html: string; text: string }> = {}
  const user: Record<string, { html: string; text: string }> = {}
  for (const f of files) {
    const name = `${f.filename} (${formatSize(f.filesize)})`
    const note = f.data
      ? 'attached'
      : f.skipped === 'too-large'
        ? 'too large to attach — download it from the dashboard'
        : 'could not be attached — download it from the dashboard'
    const link = dashboardUrl
      ? ` <a href="${escapeHtml(dashboardUrl)}">Open in dashboard</a>`
      : ''
    admin[f.field] = {
      html: `${escapeHtml(name)} — ${escapeHtml(note)}.${link}`,
      text: `${name} — ${note}.${dashboardUrl ? ` ${dashboardUrl}` : ''}`,
    }
    user[f.field] = { html: escapeHtml(f.filename), text: f.filename }
  }
  return { admin, user }
}

interface FormDoc {
  id: number | string
  title: string
  fields?: FormFieldSpec[] | null
  storeSubmissions?: boolean | null
  adminEmail?: {
    enabled?: boolean | null
    to?: { email: string }[] | null
    cc?: { email: string }[] | null
    bcc?: { email: string }[] | null
    replyToField?: string | null
    subject?: string | null
    body?: string | null
  } | null
  userEmail?: {
    enabled?: boolean | null
    toField?: string | null
    subject?: string | null
    body?: string | null
  } | null
}

const emails = (rows?: { email: string }[] | null): string[] =>
  (rows ?? []).map((r) => r.email).filter(Boolean)

const attribution = (pageUrl?: string) => {
  try {
    const params = new URL(pageUrl ?? '').searchParams
    const urlParams = params.toString()
    return {
      campaign: params.get('utm_campaign') ?? '',
      medium: params.get('utm_medium') ?? '',
      source: params.get('utm_source') ?? params.get('ref') ?? '',
      urlParams: urlParams ? urlParams.slice(0, 2000) : '',
    }
  } catch {
    return { campaign: '', medium: '', source: '', urlParams: '' }
  }
}

/** Plain-text templates (no tags) keep their line breaks in the HTML mail. */
const toHtmlBody = (template: string, rendered: string): string =>
  /<[a-z]/i.test(template) ? rendered : rendered.replace(/\n/g, '<br/>')

const sendMails = async (
  payload: Payload,
  form: FormDoc,
  values: Record<string, unknown>,
  pageUrl: string | undefined,
  defaultAdminTo: string | undefined,
  uploadsSlug: string,
  dashboardUrl: string | null,
): Promise<boolean> => {
  const fields = form.fields ?? []
  // Uploaded files: attached to the admin email when they fit.
  const files = fields.some((f) => f.type === 'file')
    ? await collectFormFiles(payload, fields, values, uploadsSlug)
    : []
  const display = fileDisplays(files, dashboardUrl)
  const ctx = { fields, fileDisplay: display.admin, formTitle: form.title, pageUrl, values }
  const userCtx = { ...ctx, fileDisplay: display.user }
  let allSent = true

  const admin = form.adminEmail
  const adminTo = emails(admin?.to)
  const to = adminTo.length ? adminTo : defaultAdminTo ? [defaultAdminTo] : []
  if (admin?.enabled !== false && to.length) {
    const replyTo =
      admin?.replyToField && typeof values[admin.replyToField] === 'string'
        ? (values[admin.replyToField] as string)
        : undefined
    const template = admin?.body || '[all-fields]'
    const sendAdmin = (list: FormFile[]) => {
      const c = { ...ctx, fileDisplay: fileDisplays(list, dashboardUrl).admin }
      const attachments = list
        .filter((f) => f.data)
        .map((f) => ({ content: f.data, contentType: f.mimeType, filename: f.filename }))
      return payload.sendEmail({
        ...(attachments.length ? { attachments } : {}),
        bcc: emails(admin?.bcc).join(',') || undefined,
        cc: emails(admin?.cc).join(',') || undefined,
        html: toHtmlBody(template, renderMailTags(template, c, true)),
        replyTo,
        subject: renderMailTags(admin?.subject || `New enquiry — [form-title]`, c, false),
        text: renderMailTags(template, c, false),
        to: to.join(','),
      })
    }
    try {
      try {
        await sendAdmin(files)
      } catch (err) {
        // The mail adapter could not send files this large (e.g. Graph without
        // Mail.ReadWrite): send again with only what fits; the rest are named
        // with a link to the dashboard.
        if ((err as { code?: string })?.code !== 'ATTACHMENTS_TOO_LARGE') throw err
        const max = Number((err as { maxBytes?: number }).maxBytes) || 0
        let used = 0
        const fitting = files.map((f) => {
          if (!f.data) return f
          if (used + f.data.length <= max) {
            used += f.data.length
            return f
          }
          return { ...f, data: undefined, skipped: 'too-large' as const }
        })
        payload.logger.warn(`Form "${form.title}": ${(err as Error).message} — sent with a dashboard link instead`)
        await sendAdmin(fitting)
      }
    } catch (err) {
      allSent = false
      payload.logger.error(
        `CRITICAL: form "${form.title}" admin email failed (likely mail adapter/credentials): ${err instanceof Error ? err.message : String(err)}`,
      )
    }
  }

  const user = form.userEmail
  const userTo = user?.toField ? values[user.toField] : undefined
  if (user?.enabled && typeof userTo === 'string' && userTo.includes('@')) {
    try {
      const template = user.body || 'Thank you — we received your message.'
      await payload.sendEmail({
        html: toHtmlBody(template, renderMailTags(template, userCtx, true)),
        subject: renderMailTags(user.subject || 'Thank you — [form-title]', userCtx, false),
        text: renderMailTags(template, userCtx, false),
        to: userTo,
      })
    } catch (err) {
      allSent = false
      payload.logger.error(
        `CRITICAL: form "${form.title}" user acknowledgement failed: ${err instanceof Error ? err.message : String(err)}`,
      )
    }
  }

  return allSent
}

export const buildSubmitEndpoint = ({
  formsSlug = 'forms',
  mailSettingsSlug = 'form-mail-settings',
  securitySlug = 'form-security-settings',
  submissionsSlug = 'form-submissions',
  uploadsSlug = 'media',
}: SubmitEndpointOptions = {}): Endpoint => ({
  handler: async (req: PayloadRequest) => {
    const { payload } = req
    const ip = clientIp(req.headers)

    /* 1 — security settings + rate limit */
    const security = (await payload
      .findGlobal({ slug: securitySlug as never })
      .catch(() => null)) as {
      rateLimitEnabled?: boolean
      rateLimitMax?: number
      rateLimitWindowMinutes?: number
      recaptchaEnabled?: boolean
      recaptchaMinScore?: number
    } | null

    if (security?.rateLimitEnabled !== false) {
      const limit = rateLimit('submit', ip, security?.rateLimitMax ?? 8, security?.rateLimitWindowMinutes ?? 10)
      if (!limit.allowed) {
        payload.logger.warn(`Form submit rate-limited (ip ${ip})`)
        return Response.json(
          { message: 'Too many submissions — please try again shortly.', ok: false },
          { headers: { 'Retry-After': String(limit.retryAfter) }, status: 429 },
        )
      }
    }

    /* 2 — parse */
    let body: SubmitPayload
    try {
      body = (await req.json?.()) as SubmitPayload
      if (!body || typeof body !== 'object' || !body.formId || typeof body.data !== 'object')
        throw new Error('bad shape')
    } catch {
      return Response.json({ message: 'Invalid request body.', ok: false }, { status: 400 })
    }

    /* 3 — reCAPTCHA */
    if (security?.recaptchaEnabled) {
      const check = await verifyRecaptcha({
        minScore: security.recaptchaMinScore ?? 0.5,
        remoteIp: ip,
        token: body.recaptchaToken,
      })
      if (!check.ok) {
        payload.logger.warn(`Form submit blocked by reCAPTCHA (${check.reason}, ip ${ip})`)
        return Response.json({ message: 'Verification failed — please try again.', ok: false }, { status: 403 })
      }
    }

    /* 4 — load the form + server-side re-validation. Fetched in the
       submitter's locale so stored labels, the success copy and the user
       acknowledgement follow the language they submitted in. */
    const locale = typeof body.locale === 'string' && /^[a-z-]{2,10}$/i.test(body.locale) ? body.locale : undefined
    const form = (await payload
      .findByID({
        id: body.formId as never,
        collection: formsSlug as never,
        ...(locale ? { locale: locale as never } : {}),
        overrideAccess: true,
      })
      .catch(() => null)) as FormDoc | null
    if (!form) return Response.json({ message: 'Unknown form.', ok: false }, { status: 404 })

    const fields = form.fields ?? []
    const values: Record<string, unknown> = {}
    for (const [key, raw] of Object.entries(body.data)) {
      // Only declared names and their phone helpers pass through.
      const base = key.replace(/__(dial|iso2)$/, '')
      if (fields.some((f) => f.name === base)) values[key] = typeof raw === 'string' ? raw.trim() : raw
    }

    const errors = validateAll(fields, values)
    if (errors.length) return Response.json({ errors, ok: false }, { status: 422 })

    /* 5 — store */
    let stored = false
    let submissionId: number | string | null = null
    if (form.storeSubmissions !== false) {
      const visible = fields.filter((f) => f.type !== 'hidden')
      const summary = visible
        .slice(0, 3)
        .map((f) => String(values[f.name] ?? ''))
        .filter(Boolean)
        .join(' — ')
        .slice(0, 140)
      try {
        const created = await payload.create({
          collection: submissionsSlug as never,
          data: {
            attribution: attribution(body.pageUrl),
            data: fields.map((f) => ({
              label: f.label || f.name,
              name: f.name,
              value: String(values[f.name] ?? ''),
            })),
            form: form.id,
            formTitle: form.title,
            pageUrl: body.pageUrl?.slice(0, 500) ?? '',
            submittedAt: new Date().toISOString(),
            summary,
          } as never,
          overrideAccess: true,
        })
        submissionId = (created as { id?: number | string }).id ?? null
        stored = true
      } catch (err) {
        payload.logger.error(
          `CRITICAL: form "${form.title}" submission DB write failed (likely DB credentials/schema): ${err instanceof Error ? err.message : String(err)}`,
        )
        const file = await appendFailedSubmission({ data: values, formId: form.id, formTitle: form.title, pageUrl: body.pageUrl })
        payload.logger.error(
          file
            ? `Submission preserved at ${file} — replay it once the DB is healthy.`
            : 'CRITICAL: JSONL failsafe also failed — this submission exists only in the email (if any).',
        )
      }
    }

    /* 6 — email: after the response when the submission is safely stored */
    const mail = (await payload
      .findGlobal({ slug: mailSettingsSlug as never })
      .catch(() => null)) as { defaultAdminTo?: string; enabled?: boolean } | null
    const base = siteBaseUrl(payload)
    const dashboardUrl =
      submissionId != null && base
        ? `${base}${payload.config.routes?.admin ?? '/admin'}/collections/${submissionsSlug}/${submissionId}`
        : null
    const deliver = async (): Promise<boolean> => {
      if (mail?.enabled === false) return false
      const emailed = await sendMails(
        payload,
        form,
        values,
        body.pageUrl,
        mail?.defaultAdminTo,
        uploadsSlug,
        dashboardUrl,
      ).catch((err) => {
        payload.logger.error(`CRITICAL: form "${form.title}" email step failed: ${err instanceof Error ? err.message : String(err)}`)
        return false
      })
      payload.logger.info(`Form "${form.title}" emails ${emailed ? 'sent' : 'NOT sent'} (submission ${submissionId ?? 'not stored'})`)
      return emailed
    }

    let emailed: boolean | undefined
    if (stored) afterResponse(async () => void (await deliver()))
    else emailed = await deliver()

    payload.logger.info(`Form "${form.title}" submitted (ip ${ip}, stored ${stored}${stored ? ', emails queued' : `, emailed ${emailed}`})`)

    /* 7 — honest flags (`emailed` only when it was sent before responding) */
    return Response.json({ ...(emailed !== undefined ? { emailed } : {}), ok: true, stored })
  },
  method: 'post',
  // NOT under /forms/… — that prefix belongs to the forms collection's own
  // REST routes, which swallow the request and 404.
  path: '/form-submit',
})
