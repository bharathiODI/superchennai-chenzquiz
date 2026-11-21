import type { Endpoint, PayloadRequest } from 'payload'

import { clientIp, rateLimit } from '../rateLimit'
import type { FormFieldSpec } from '../types'
import { DEFAULT_UPLOAD_MIME, HARD_MAX_UPLOAD_MB } from '../types'

/**
 * POST /api/forms/upload — multipart, one file per request, called before
 * the main submit; the field's submitted value becomes the stored file's
 * URL. Every guard is server-side:
 *
 * - the formId + field name must resolve to a real `type: 'file'` field on
 *   that form — the client never chooses a destination;
 * - MIME allow-list (default JPEG/PNG/WEBP/PDF, narrowable per field);
 * - size capped at the field's maxSizeMB, hard-capped at 10 MB;
 * - filename stripped of path separators;
 * - rate limited per IP;
 * - stored through a Payload upload collection (its access control decides
 *   who can read the file back — use a private collection for ID documents).
 */

export interface UploadEndpointOptions {
  formsSlug?: string
  securitySlug?: string
  /** Upload collection files land in. Point at a private collection for sensitive uploads. */
  uploadsSlug?: string
}

export const buildUploadEndpoint = ({
  formsSlug = 'forms',
  securitySlug = 'form-security-settings',
  uploadsSlug = 'media',
}: UploadEndpointOptions = {}): Endpoint => ({
  handler: async (req: PayloadRequest) => {
    const { payload } = req
    const ip = clientIp(req.headers)

    const security = (await payload
      .findGlobal({ slug: securitySlug as never })
      .catch(() => null)) as {
      rateLimitEnabled?: boolean
      rateLimitWindowMinutes?: number
      uploadLimitMax?: number
    } | null

    if (security?.rateLimitEnabled !== false) {
      const limit = rateLimit('upload', ip, security?.uploadLimitMax ?? 20, security?.rateLimitWindowMinutes ?? 10)
      if (!limit.allowed)
        return Response.json(
          { message: 'Too many uploads — please try again shortly.', ok: false },
          { headers: { 'Retry-After': String(limit.retryAfter) }, status: 429 },
        )
    }

    let formData: FormData
    try {
      formData = await (req as unknown as Request).formData()
    } catch {
      return Response.json({ message: 'Expected multipart form data.', ok: false }, { status: 400 })
    }

    const formId = formData.get('formId')
    const fieldName = formData.get('field')
    const file = formData.get('file')
    if (typeof formId !== 'string' || typeof fieldName !== 'string' || !(file instanceof File)) {
      return Response.json({ message: 'formId, field and file are required.', ok: false }, { status: 400 })
    }

    /* The destination is decided by the form config, never the client. */
    const form = (await payload
      .findByID({ id: formId as never, collection: formsSlug as never, overrideAccess: true })
      .catch(() => null)) as { fields?: FormFieldSpec[] | null; title?: string } | null
    const field = form?.fields?.find((f) => f.name === fieldName && f.type === 'file')
    if (!field) return Response.json({ message: 'No such file field on that form.', ok: false }, { status: 400 })

    const accept = (field.accept ?? '')
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
    const allowed = accept.length ? accept : DEFAULT_UPLOAD_MIME
    const mime = file.type.toLowerCase()
    const nameOk = (a: string) => a.startsWith('.') && file.name.toLowerCase().endsWith(a)
    if (!allowed.some((a) => a === mime || (a.endsWith('/*') && mime.startsWith(a.slice(0, -1))) || nameOk(a))) {
      return Response.json({ message: 'That file type is not accepted.', ok: false }, { status: 415 })
    }

    const maxMB = Math.min(field.maxSizeMB ?? HARD_MAX_UPLOAD_MB, HARD_MAX_UPLOAD_MB)
    if (file.size > maxMB * 1024 * 1024) {
      return Response.json({ message: `The file is larger than ${maxMB} MB.`, ok: false }, { status: 413 })
    }

    const safeName = file.name.replace(/[/\\]/g, '_').replace(/\.{2,}/g, '.').slice(-120) || 'upload'

    try {
      const doc = (await payload.create({
        collection: uploadsSlug as never,
        data: { alt: `Form upload — ${form?.title ?? formId}` } as never,
        file: {
          data: Buffer.from(await file.arrayBuffer()),
          mimetype: file.type,
          name: safeName,
          size: file.size,
        },
        overrideAccess: true,
      })) as { id: number | string; url?: string | null; filename?: string | null }

      const url = doc.url ?? `/api/${uploadsSlug}/file/${encodeURIComponent(doc.filename ?? String(doc.id))}`
      payload.logger.info(`Form upload stored (form "${form?.title}", field ${fieldName}, ip ${ip})`)
      return Response.json({ id: doc.id, ok: true, url })
    } catch (err) {
      payload.logger.error(
        `CRITICAL: form upload write failed (collection ${uploadsSlug}): ${err instanceof Error ? err.message : String(err)}`,
      )
      return Response.json({ message: 'Upload failed — please try again.', ok: false }, { status: 500 })
    }
  },
  method: 'post',
  path: '/form-upload', // outside the forms collection's REST prefix
})
