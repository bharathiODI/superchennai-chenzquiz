/**
 * reCAPTCHA v3, server-side verification.
 *
 * Fail OPEN when Google itself is unreachable — never lose a real enquiry
 * to an outage (rate limiting and validation still apply). Fail CLOSED on
 * a missing, expired, replayed or low-score token. Skipped entirely when
 * no secret is configured, so local dev works untouched.
 */

export interface RecaptchaResult {
  ok: boolean
  reason?: string
  score?: number
}

export const verifyRecaptcha = async ({
  expectedAction = 'form_submit',
  minScore = 0.5,
  remoteIp,
  token,
}: {
  expectedAction?: string
  minScore?: number
  remoteIp?: string
  token: string | undefined
}): Promise<RecaptchaResult> => {
  const secret = process.env.RECAPTCHA_SECRET_KEY
  if (!secret) return { ok: true, reason: 'not configured' }

  if (!token) return { ok: false, reason: 'missing token' }

  let json: {
    action?: string
    'error-codes'?: string[]
    score?: number
    success?: boolean
  }
  try {
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      body: new URLSearchParams({
        response: token,
        secret,
        ...(remoteIp && remoteIp !== 'unknown' ? { remoteip: remoteIp } : {}),
      }),
      method: 'POST',
    })
    json = (await res.json()) as typeof json
  } catch {
    return { ok: true, reason: 'verifier unreachable — failing open' }
  }

  if (!json.success) return { ok: false, reason: (json['error-codes'] ?? []).join(', ') || 'invalid token' }
  if (json.action && json.action !== expectedAction) return { ok: false, reason: `action mismatch (${json.action})` }
  if ((json.score ?? 0) < minScore) return { ok: false, reason: 'low score', score: json.score }

  return { ok: true, score: json.score }
}
