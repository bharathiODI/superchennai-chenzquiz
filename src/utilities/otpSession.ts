import crypto from 'crypto'
import type { NextRequest, NextResponse } from 'next/server'

/**
 * Server-side OTP check, kept in two short-lived signed cookies (no database table needed):
 *
 *   send-otp   -> CHALLENGE cookie: HMAC of (phone + OTP + expiry); the OTP itself never reaches the browser
 *   verify-otp -> checks the typed OTP against it, then sets the VERIFIED cookie for that phone
 *   login-otp / user-login -> only work for a phone with a valid VERIFIED cookie
 *
 * The app runs as a single PM2 process, so in-memory counters are enough to cap wrong guesses
 * and to rate-limit SMS sends.
 */
const CHALLENGE_COOKIE = 'sc_otp_challenge'
const VERIFIED_COOKIE = 'sc_otp_verified'
const CHALLENGE_TTL_SECONDS = 10 * 60
const VERIFIED_TTL_SECONDS = 15 * 60
const MAX_VERIFY_ATTEMPTS = 5
export const RESEND_COOLDOWN_SECONDS = 30

type Challenge = { id: string; phone: string; exp: number; h: string }
type Verified = { phone: string; exp: number; h: string }
export type OtpCheck = { ok: true } | { ok: false; status: number; message: string }

const secret = (): string => {
  const value = process.env.PAYLOAD_SECRET
  if (!value) throw new Error('PAYLOAD_SECRET is not set')
  return value
}

const sign = (value: string): string =>
  crypto.createHmac('sha256', secret()).update(value).digest('base64url')

const safeEqual = (a: string, b: string): boolean => {
  const x = Buffer.from(a)
  const y = Buffer.from(b)
  return x.length === y.length && crypto.timingSafeEqual(x, y)
}

const encode = (data: object): string => Buffer.from(JSON.stringify(data)).toString('base64url')

const decode = <T>(value?: string): T | null => {
  if (!value) return null
  try {
    return JSON.parse(Buffer.from(value, 'base64url').toString('utf8')) as T
  } catch {
    return null
  }
}

const cookieOptions = (maxAge: number) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge,
})

const lastSentAt = new Map<string, number>()
const wrongAttempts = new Map<string, { count: number; exp: number }>()

const prune = () => {
  const now = Date.now()
  for (const [id, entry] of wrongAttempts) if (entry.exp < now) wrongAttempts.delete(id)
  for (const [phone, at] of lastSentAt) {
    if (now - at > RESEND_COOLDOWN_SECONDS * 1000) lastSentAt.delete(phone)
  }
}

/**
 * A mobile number as the login page sends it: +91 and 10 digits. Spacing is tolerated, because
 * existing accounts are stored exactly as players typed them and are looked up the same way.
 */
export const isValidMobile = (phone: unknown): phone is string =>
  typeof phone === 'string' && /^91\d{10}$/.test(phone.replace(/\D/g, ''))

export const generateOtp = (): string => crypto.randomInt(100000, 1000000).toString()

/** Seconds until another OTP may be sent to this phone (0 = now). */
export const resendWaitSeconds = (phone: string): number => {
  prune()
  const at = lastSentAt.get(phone)
  if (!at) return 0
  return Math.max(0, Math.ceil((at + RESEND_COOLDOWN_SECONDS * 1000 - Date.now()) / 1000))
}

export function startOtpChallenge(res: NextResponse, phone: string, otp: string): void {
  const id = crypto.randomUUID()
  const exp = Date.now() + CHALLENGE_TTL_SECONDS * 1000
  const h = sign(`challenge|${id}|${phone}|${otp}|${exp}`)
  lastSentAt.set(phone, Date.now())
  res.cookies.set(CHALLENGE_COOKIE, encode({ id, phone, exp, h }), cookieOptions(CHALLENGE_TTL_SECONDS))
}

export function checkOtp(req: NextRequest, phone: string, otp: string): OtpCheck {
  const challenge = decode<Challenge>(req.cookies.get(CHALLENGE_COOKIE)?.value)
  if (
    !challenge ||
    challenge.phone !== phone ||
    typeof challenge.exp !== 'number' ||
    challenge.exp < Date.now()
  ) {
    return { ok: false, status: 400, message: 'OTP expired or not requested. Please send a new OTP.' }
  }

  prune()
  const attempts = wrongAttempts.get(challenge.id) ?? { count: 0, exp: challenge.exp }
  if (attempts.count >= MAX_VERIFY_ATTEMPTS) {
    return { ok: false, status: 429, message: 'Too many attempts. Please send a new OTP.' }
  }
  attempts.count += 1
  wrongAttempts.set(challenge.id, attempts)

  const expected = sign(`challenge|${challenge.id}|${phone}|${otp}|${challenge.exp}`)
  if (!safeEqual(expected, String(challenge.h))) {
    return { ok: false, status: 400, message: 'Invalid OTP entered. Please check and try again.' }
  }

  // An OTP works once
  wrongAttempts.set(challenge.id, { count: MAX_VERIFY_ATTEMPTS, exp: challenge.exp })
  return { ok: true }
}

export function markPhoneVerified(res: NextResponse, phone: string): void {
  const exp = Date.now() + VERIFIED_TTL_SECONDS * 1000
  const h = sign(`verified|${phone}|${exp}`)
  res.cookies.set(VERIFIED_COOKIE, encode({ phone, exp, h }), cookieOptions(VERIFIED_TTL_SECONDS))
  res.cookies.set(CHALLENGE_COOKIE, '', cookieOptions(0))
}

export function isPhoneVerified(req: NextRequest, phone: string): boolean {
  const verified = decode<Verified>(req.cookies.get(VERIFIED_COOKIE)?.value)
  return Boolean(
    verified &&
      verified.phone === phone &&
      typeof verified.exp === 'number' &&
      verified.exp > Date.now() &&
      safeEqual(sign(`verified|${verified.phone}|${verified.exp}`), String(verified.h)),
  )
}

export function clearPhoneVerified(res: NextResponse): void {
  res.cookies.set(VERIFIED_COOKIE, '', cookieOptions(0))
}
