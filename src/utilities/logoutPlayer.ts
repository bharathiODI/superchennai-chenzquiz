/**
 * Logs the player out everywhere: the saved copy in the browser and the server login cookie,
 * then does a full page load of /login so no page keeps showing the old login.
 * Browser-only (call it from a click handler in a client component).
 */
export async function logoutPlayer(): Promise<void> {
  try {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  } catch {
    // storage blocked (private mode etc.) - the cookie below is what matters
  }
  try {
    await fetch('/api/quiz-users/logout', { method: 'POST', credentials: 'same-origin' })
  } catch (err) {
    console.error('Logout error:', err)
  }
  window.location.assign('/login')
}
