import type { Where } from 'payload'

/**
 * Test players use the reserved numbers +91 00000 00001 ... +91 00000 00010.
 * Indian mobile numbers never start with 0, so these can't belong to a real player.
 *
 * - They log in with the code in TEST_OTP (server .env) instead of an SMS. If TEST_OTP is not
 *   set to 6 digits, test logins are switched off.
 * - They are hidden from the public leaderboard and the /dashboard stats.
 */
export const TEST_PLAYER_PHONES = Array.from(
  { length: 10 },
  (_, i) => `+91${String(i + 1).padStart(10, '0')}`,
)

const TEST_PLAYER_DIGITS = new Set(TEST_PLAYER_PHONES.map((p) => p.replace(/\D/g, '')))

export const isTestPhone = (phone?: string | null): boolean =>
  Boolean(phone) && TEST_PLAYER_DIGITS.has(String(phone).replace(/\D/g, ''))

/** The test OTP from the server environment, or null when test logins are off. */
export const getTestOtp = (): string | null => {
  const otp = process.env.TEST_OTP?.trim()
  return otp && /^\d{6}$/.test(otp) ? otp : null
}

/** quiz-users filter that leaves out test players (players without a phone are kept). */
export const realPlayersWhere: Where = {
  or: [{ phone: { not_in: TEST_PLAYER_PHONES } }, { phone: { exists: false } }],
}
