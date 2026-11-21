import type { EmailAdapter, SendEmailOptions } from 'payload'

/**
 * Microsoft Graph email adapter (OAuth 2.0 client credentials) — no SMTP.
 *
 * Mail is sent through `/users/{sender}/sendMail` using an Entra ID
 * application identity, so no mailbox username/password or SMTP host is ever
 * configured. Built for ERDC (whose IT forbids SMTP) and generic to any
 * Microsoft 365 tenant.
 *
 * Required Entra ID application permission: Mail.Send (application,
 * admin-consented — delegated will not work, there is no signed-in user).
 *
 *   email: graphEmailAdapter({
 *     tenantId: process.env.GRAPH_TENANT_ID!,
 *     clientId: process.env.GRAPH_CLIENT_ID!,
 *     clientSecret: process.env.GRAPH_CLIENT_SECRET!,
 *     sender: process.env.GRAPH_SENDER_ADDRESS!,
 *   })
 */

type TokenCache = { expiresAt: number; token: string }
let cache: TokenCache | null = null

const getAccessToken = async (
  tenantId: string,
  clientId: string,
  clientSecret: string,
): Promise<string> => {
  // Reuse the token until 60s before expiry.
  if (cache && cache.expiresAt > Date.now() + 60_000) return cache.token

  const res = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials',
      scope: 'https://graph.microsoft.com/.default',
    }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'POST',
  })

  if (!res.ok) {
    throw new Error(`Graph token request failed (${res.status}): ${await res.text()}`)
  }

  const json = (await res.json()) as { access_token: string; expires_in: number }
  cache = { expiresAt: Date.now() + json.expires_in * 1000, token: json.access_token }
  return json.access_token
}

const toRecipients = (value: SendEmailOptions['to']): { emailAddress: { address: string } }[] => {
  if (!value) return []
  const list = Array.isArray(value) ? value : String(value).split(',')
  return list
    .map((entry) => (typeof entry === 'string' ? entry : String(entry)).trim())
    .filter(Boolean)
    .map((address) => ({ emailAddress: { address } }))
}

/**
 * Attachments.
 *
 * - Whole request ≤ ~3.5 MB (Graph's limit is 4 MB, ≈ 2.8 MB of file once
 *   base64-encoded): one `sendMail` call — needs Mail.Send only.
 * - Larger: the message is created as a draft, each big file is uploaded in
 *   chunks through an upload session, then the draft is sent. Creating the
 *   draft needs **Mail.ReadWrite** (application) on the sender mailbox.
 *   Without it Graph answers 403 and this adapter throws
 *   `AttachmentsTooLargeError` (code `ATTACHMENTS_TOO_LARGE`, `maxBytes`), so
 *   the caller can send again without the large files — the form system then
 *   links them to the dashboard instead. The 403 is remembered for 30 minutes
 *   so each submission does not retry a call that is known to fail.
 */
type MailAttachment = { content?: unknown; contentType?: string; encoding?: string; filename?: string }
type RawAttachment = { contentType: string; data: Buffer; name: string }

/** Largest total file size that fits in one sendMail request. */
export const GRAPH_INLINE_ATTACHMENT_BYTES = Math.floor(2.8 * 1024 * 1024)
const INLINE_REQUEST_BYTES = Math.floor(3.5 * 1024 * 1024)
/** Files under this go on the draft as plain attachments; bigger ones use an upload session. */
const SIMPLE_ATTACHMENT_BYTES = 3 * 1024 * 1024
/** Upload-session chunk: a multiple of 320 KiB, under 4 MB. */
const CHUNK_BYTES = 320 * 1024 * 10

export class AttachmentsTooLargeError extends Error {
  code = 'ATTACHMENTS_TOO_LARGE' as const
  maxBytes = GRAPH_INLINE_ATTACHMENT_BYTES
  constructor(detail: string) {
    super(`Attachments too large for this mailbox's permissions: ${detail}`)
  }
}

let largeUnsupportedUntil = 0

const toRawAttachments = (list: unknown): RawAttachment[] =>
  (Array.isArray(list) ? (list as MailAttachment[]) : []).flatMap((a) => {
    const content = a?.content
    if (content == null) return []
    const data = Buffer.isBuffer(content)
      ? content
      : content instanceof Uint8Array
        ? Buffer.from(content)
        : Buffer.from(String(content), a.encoding === 'base64' ? 'base64' : 'utf8')
    return [{ contentType: a.contentType || 'application/octet-stream', data, name: a.filename || 'attachment' }]
  })

const toFileAttachment = (a: RawAttachment) => ({
  '@odata.type': '#microsoft.graph.fileAttachment',
  contentBytes: a.data.toString('base64'),
  contentType: a.contentType,
  name: a.name,
})

class GraphHttpError extends Error {
  constructor(
    public step: string,
    public status: number,
    detail: string,
  ) {
    super(`Graph ${step} failed (${status}): ${detail.slice(0, 500)}`)
  }
}

const graphCall = async (step: string, url: string, token: string, method: string, body?: unknown) => {
  const res = await fetch(url, {
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    method,
  })
  if (!res.ok) throw new GraphHttpError(step, res.status, await res.text())
  return res
}

/** Draft → attachments (upload sessions for big files) → send. Needs Mail.ReadWrite. */
const sendWithLargeAttachments = async (
  base: string,
  token: string,
  message: Record<string, unknown>,
  attachments: RawAttachment[],
): Promise<void> => {
  const draft = (await (await graphCall('create draft', `${base}/messages`, token, 'POST', message)).json()) as { id: string }
  const msg = `${base}/messages/${encodeURIComponent(draft.id)}`
  try {
    for (const a of attachments) {
      if (a.data.length < SIMPLE_ATTACHMENT_BYTES) {
        await graphCall('add attachment', `${msg}/attachments`, token, 'POST', toFileAttachment(a))
        continue
      }
      const session = (await (
        await graphCall('create upload session', `${msg}/attachments/createUploadSession`, token, 'POST', {
          AttachmentItem: { attachmentType: 'file', contentType: a.contentType, name: a.name, size: a.data.length },
        })
      ).json()) as { uploadUrl: string }
      // The upload URL is pre-authorised: no Authorization header.
      for (let start = 0; start < a.data.length; start += CHUNK_BYTES) {
        const end = Math.min(start + CHUNK_BYTES, a.data.length) - 1
        const res = await fetch(session.uploadUrl, {
          body: a.data.subarray(start, end + 1),
          headers: { 'Content-Range': `bytes ${start}-${end}/${a.data.length}`, 'Content-Type': 'application/octet-stream' },
          method: 'PUT',
        })
        if (!res.ok) throw new GraphHttpError('upload attachment', res.status, await res.text())
        await res.arrayBuffer().catch(() => null)
      }
    }
    await graphCall('send draft', `${msg}/send`, token, 'POST')
  } catch (err) {
    // Do not leave a half-built draft in the mailbox.
    await fetch(msg, { headers: { Authorization: `Bearer ${token}` }, method: 'DELETE' }).catch(() => null)
    throw err
  }
}

export interface GraphEmailAdapterArgs {
  tenantId: string
  clientId: string
  clientSecret: string
  /** Mailbox the mail is sent from — needs Mail.Send over it. */
  sender: string
  defaultFromName?: string
  /** Keep a copy in the mailbox's Sent Items for auditability. Default true. */
  saveToSentItems?: boolean
}

export const graphEmailAdapter = ({
  clientId,
  clientSecret,
  defaultFromName = 'Website',
  saveToSentItems = true,
  sender,
  tenantId,
}: GraphEmailAdapterArgs): EmailAdapter =>
  ({ payload }) => ({
    defaultFromAddress: sender,
    defaultFromName,
    name: 'microsoft-graph',
    sendEmail: async (message) => {
      const token = await getAccessToken(tenantId, clientId, clientSecret)
      const raw = toRawAttachments((message as { attachments?: unknown }).attachments)
      const base = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(sender)}`

      const graphMessage = {
        bccRecipients: toRecipients(message.bcc),
        body: {
          content: (message.html as string) ?? (message.text as string) ?? '',
          contentType: message.html ? 'HTML' : 'Text',
        },
        ccRecipients: toRecipients(message.cc),
        // Contact-form mail sets this to the enquirer, so a mailbox "Reply"
        // goes to them instead of the sender address.
        replyTo: toRecipients(message.replyTo as SendEmailOptions['to']),
        subject: message.subject ?? '',
        toRecipients: toRecipients(message.to),
      }
      const body = JSON.stringify({
        message: { ...graphMessage, ...(raw.length ? { attachments: raw.map(toFileAttachment) } : {}) },
        saveToSentItems,
      })

      if (Buffer.byteLength(body) <= INLINE_REQUEST_BYTES) {
        const res = await fetch(`${base}/sendMail`, {
          body,
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          method: 'POST',
        })
        if (!res.ok) {
          const detail = await res.text()
          payload.logger.error(`Graph sendMail failed (${res.status}): ${detail}`)
          throw new Error(`Graph sendMail failed (${res.status})`)
        }
        return { messageId: `graph-${Date.now()}` }
      }

      // Too big for one request: large-attachment path (needs Mail.ReadWrite).
      const total = raw.reduce((n, a) => n + a.data.length, 0)
      if (Date.now() < largeUnsupportedUntil) {
        throw new AttachmentsTooLargeError(`${total} bytes; Mail.ReadWrite not granted (cached)`)
      }
      try {
        await sendWithLargeAttachments(base, token, graphMessage, raw)
        payload.logger.info(`Graph: sent with large attachments (${total} bytes)`)
        return { messageId: `graph-${Date.now()}` }
      } catch (err) {
        if (err instanceof GraphHttpError && err.step === 'create draft' && (err.status === 401 || err.status === 403)) {
          largeUnsupportedUntil = Date.now() + 30 * 60 * 1000
          payload.logger.warn(
            `Graph: large attachments need Mail.ReadWrite on ${sender} (not granted) — sending without them. ${err.message}`,
          )
          throw new AttachmentsTooLargeError(`${total} bytes; Mail.ReadWrite not granted`)
        }
        payload.logger.error(`Graph large-attachment send failed: ${err instanceof Error ? err.message : String(err)}`)
        // Anything else: let the caller fall back to a message without the large files.
        throw new AttachmentsTooLargeError(`${total} bytes; ${err instanceof Error ? err.message : String(err)}`)
      }
    },
  })
