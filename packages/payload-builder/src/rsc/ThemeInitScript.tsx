import React from 'react'
import Script from 'next/script'

/**
 * Sets the theme attribute on <html> before first paint, so a stored
 * dark/light preference never flashes the wrong theme.
 *
 * Rendered through next/script with `beforeInteractive`: the script is
 * injected into the initial HTML <head> and executes before hydration —
 * the same no-flash guarantee as a raw <script>, without the React 19
 * dev error ("Encountered a script tag while rendering React component")
 * that a raw tag now triggers on client re-renders.
 *
 * `beforeInteractive` requires a ROOT layout (one that renders <html>).
 * Route-group root layouts qualify.
 */
export const ThemeInitScript: React.FC<{
  /** Attribute set on <html>. Default: data-theme. */
  attribute?: string
  /** Used when no stored or OS preference exists. */
  defaultTheme?: 'dark' | 'light'
  /** localStorage key holding the user's choice. */
  storageKey?: string
}> = ({ attribute = 'data-theme', defaultTheme = 'light', storageKey = 'payload-theme' }) => (
  <Script
    id="pb-theme-init"
    strategy="beforeInteractive"
    dangerouslySetInnerHTML={{
      __html: `(function () {
  function implicitPreference() {
    var mql = window.matchMedia('(prefers-color-scheme: dark)')
    if (typeof mql.matches === 'boolean') return mql.matches ? 'dark' : 'light'
    return null
  }
  function valid(theme) { return theme === 'light' || theme === 'dark' }

  var theme = ${JSON.stringify(defaultTheme)}
  try {
    var stored = window.localStorage.getItem(${JSON.stringify(storageKey)})
    if (valid(stored)) theme = stored
    else {
      var implicit = implicitPreference()
      if (implicit) theme = implicit
    }
  } catch (e) { /* storage unavailable — keep the default */ }

  document.documentElement.setAttribute(${JSON.stringify(attribute)}, theme)
})();`,
    }}
  />
)
