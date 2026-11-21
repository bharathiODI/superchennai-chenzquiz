/**
 * Key gate for maintenance API routes (seed, import, reindex, test-email).
 *
 * The key is the first 12 characters of PAYLOAD_SECRET — enough entropy for
 * a maintenance endpoint, and always available without introducing another
 * secret to manage across environments.
 *
 *   if (!isRequestAuthorized(request)) {
 *     return Response.json({ error: 'Not allowed' }, { status: 403 })
 *   }
 */
export const isRequestAuthorized = (
  request: Request,
  {
    allowInDev = true,
    secret = process.env.PAYLOAD_SECRET,
  }: { allowInDev?: boolean; secret?: string } = {},
): boolean => {
  if (allowInDev && process.env.NODE_ENV === 'development') return true
  const expected = (secret ?? '').slice(0, 12)
  if (!expected) return false
  return new URL(request.url).searchParams.get('key') === expected
}
