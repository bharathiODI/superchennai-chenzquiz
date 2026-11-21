// @ts-nocheck -- vendored kit source, type-checked under the kit's own settings, not this app's stricter tsconfig (see packages/payload-builder/VENDORED.md)
/**
 * Sliding-window rate limiter, in-memory — right for a single instance
 * (PM2 / one Docker container). Swap for Redis when horizontally scaled.
 */

const buckets = new Map<string, number[]>()

export interface RateLimitResult {
  allowed: boolean
  /** Seconds until the oldest hit leaves the window (for Retry-After). */
  retryAfter: number
}

export const rateLimit = (
  bucket: string,
  ip: string,
  max: number,
  windowMinutes: number,
): RateLimitResult => {
  const key = `${bucket}:${ip}`
  const windowMs = windowMinutes * 60_000
  const now = Date.now()
  const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs)

  if (recent.length >= max) {
    buckets.set(key, recent)
    return { allowed: false, retryAfter: Math.ceil((recent[0] + windowMs - now) / 1000) }
  }

  recent.push(now)
  buckets.set(key, recent)

  // Cap memory. Clearing resets counters — acceptable for this scale.
  if (buckets.size > 10_000) buckets.clear()

  return { allowed: true, retryAfter: 0 }
}

/** First hop of x-forwarded-for, or 'unknown'. */
export const clientIp = (headers: Headers): string =>
  headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
