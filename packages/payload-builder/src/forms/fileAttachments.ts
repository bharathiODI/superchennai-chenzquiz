import { readFile } from 'fs/promises'
import path from 'path'
import type { Payload, PayloadRequest } from 'payload'
import { createLocalReq } from 'payload'

import type { FormFieldSpec } from './types'

/**
 * Files uploaded through a form's `file` fields, read back for the admin
 * email. The submitted value is the stored file's URL
 * (`/api/<uploads>/file/<name>`); it comes from the browser, so it is only
 * trusted after it resolves to a record in the uploads collection that was
 * created recently (an applicant cannot attach someone else's older upload).
 *
 * Read through the collection's own storage handlers (Azure Blob, S3…) and
 * fall back to the local upload directory — the same order as Payload's file
 * route — so it works wherever the files live.
 */

/**
 * Most file bytes read for one email. The mail adapter decides what it can
 * actually send: the Graph adapter sends up to ~2.8 MB in one request and
 * larger files through an upload session when the mailbox permission allows,
 * otherwise it says so and the email goes without them (dashboard link).
 */
export const MAX_ATTACH_BYTES = 12 * 1024 * 1024
/** Uploads older than this are not attached (the form uploads just before submit). */
const MAX_UPLOAD_AGE_MS = 6 * 60 * 60 * 1000

export interface FormFile {
  field: string
  filename: string
  filesize: number
  mimeType: string
  /** Present when the file was read and fits in the email. */
  data?: Buffer
  /** Why it is not attached (too large, unreadable…). */
  skipped?: 'too-large' | 'unreadable'
}

type UploadDoc = { createdAt?: string; filename?: string; filesize?: number; mimeType?: string }
type FileHandler = (
  req: PayloadRequest,
  args: { doc?: unknown; headers?: Headers; params: { collection: string; filename: string } },
) => Promise<Response | void> | Response | void

const filenameFromValue = (value: unknown, uploadsSlug: string): string | null => {
  if (typeof value !== 'string' || !value) return null
  try {
    const { pathname } = new URL(value, 'http://local')
    const prefix = `/api/${uploadsSlug}/file/`
    if (!pathname.startsWith(prefix)) return null
    const name = decodeURIComponent(pathname.slice(prefix.length))
    return name && !/[/\\]/.test(name) && !name.includes('..') ? name : null
  } catch {
    return null
  }
}

const readStored = async (payload: Payload, uploadsSlug: string, doc: UploadDoc, filename: string): Promise<Buffer | null> => {
  // The slug is a plugin option, so look the collection up untyped (the app's
  // generated types only accept its own literal slugs).
  const collections = payload.collections as unknown as Record<string, { config?: { upload?: unknown } } | undefined>
  const upload = collections[uploadsSlug]?.config?.upload as { handlers?: FileHandler[]; staticDir?: string } | undefined
  if (upload?.handlers?.length) {
    const req = await createLocalReq({}, payload)
    for (const handler of upload.handlers) {
      const res = await handler(req, { doc, headers: new Headers(), params: { collection: uploadsSlug, filename } })
      if (res instanceof Response) {
        if (res.ok) return Buffer.from(await res.arrayBuffer())
        await res.arrayBuffer().catch(() => null)
        break
      }
    }
  }
  const dir = path.resolve(upload?.staticDir || uploadsSlug)
  const file = path.resolve(dir, filename)
  if (!file.startsWith(dir + path.sep)) return null
  return readFile(file).catch(() => null)
}

export const collectFormFiles = async (
  payload: Payload,
  fields: FormFieldSpec[],
  values: Record<string, unknown>,
  uploadsSlug: string,
): Promise<FormFile[]> => {
  const files: FormFile[] = []
  let budget = MAX_ATTACH_BYTES
  for (const field of fields.filter((f) => f.type === 'file')) {
    const filename = filenameFromValue(values[field.name], uploadsSlug)
    if (!filename) continue
    try {
      const { docs } = await payload.find({
        collection: uploadsSlug as never,
        depth: 0,
        limit: 1,
        overrideAccess: true,
        where: { filename: { equals: filename } },
      })
      const doc = docs[0] as UploadDoc | undefined
      if (!doc) continue
      const created = doc.createdAt ? Date.parse(doc.createdAt) : NaN
      if (!(Date.now() - created < MAX_UPLOAD_AGE_MS)) continue
      const meta = {
        field: field.name,
        filename,
        filesize: doc.filesize ?? 0,
        mimeType: doc.mimeType || 'application/octet-stream',
      }
      if (meta.filesize > budget) {
        files.push({ ...meta, skipped: 'too-large' })
        continue
      }
      const data = await readStored(payload, uploadsSlug, doc, filename)
      if (!data) {
        files.push({ ...meta, skipped: 'unreadable' })
        continue
      }
      budget -= data.length
      files.push({ ...meta, data })
    } catch (err) {
      payload.logger.warn(`Form file ${filename} could not be read for the email: ${err instanceof Error ? err.message : String(err)}`)
    }
  }
  return files
}

export const formatSize = (bytes: number): string =>
  bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`
