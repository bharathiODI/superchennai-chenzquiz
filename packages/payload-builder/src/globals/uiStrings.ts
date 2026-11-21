// @ts-nocheck -- vendored kit source, type-checked under the kit's own settings, not this app's stricter tsconfig (see packages/payload-builder/VENDORED.md)
import type { Field, GlobalConfig } from 'payload'
import { L } from '../i18n/localized'

/**
 * UI Strings — every piece of interface text the site renders, editable
 * from the admin and translatable.
 *
 * The point: nothing user-visible should be hard-coded in a component.
 * A search placeholder, a "Read more" link, a form validation message —
 * an editor can change all of it without a deploy, in every locale.
 *
 * Grouped into tabs so the list stays navigable as it grows. Projects add
 * their own strings through `extraGroups`.
 */

const str = (name: string, label: string, defaultValue: string): Field =>
  L({
    name,
    admin: { placeholder: defaultValue },
    defaultValue,
    label,
    type: 'text',
  })

export const defaultStringGroups: { fields: Field[]; label: string; name: string }[] = [
  {
    name: 'general',
    fields: [
      str('readMore', 'Read more', 'Read more'),
      str('learnMore', 'Learn more', 'Learn more'),
      str('viewAll', 'View all', 'View all'),
      str('back', 'Back', 'Back'),
      str('next', 'Next', 'Next'),
      str('previous', 'Previous', 'Previous'),
      str('close', 'Close', 'Close'),
      str('menu', 'Menu', 'Menu'),
      str('skipToContent', 'Skip to content', 'Skip to content'),
      str('loading', 'Loading', 'Loading…'),
    ],
    label: 'General',
  },
  {
    name: 'search',
    fields: [
      str('label', 'Search label', 'Search'),
      str('placeholder', 'Search placeholder', 'Search the site…'),
      str('submit', 'Search button', 'Search'),
      str('resultsTitle', 'Results heading', 'Search results'),
      str('resultsCount', 'Results count', '{count} results for “{query}”'),
      str('noResults', 'No results', 'No results found for “{query}”.'),
      str('noResultsHint', 'No results hint', 'Try a different word or check the spelling.'),
      str('clear', 'Clear', 'Clear'),
    ],
    label: 'Search',
  },
  {
    name: 'nav',
    fields: [
      str('home', 'Home', 'Home'),
      str('breadcrumbHome', 'Breadcrumb home', 'Home'),
      str('languageSwitch', 'Language switch label', 'Language'),
      str('openMenu', 'Open menu', 'Open menu'),
      str('closeMenu', 'Close menu', 'Close menu'),
    ],
    label: 'Navigation',
  },
  {
    name: 'forms',
    fields: [
      str('submit', 'Submit button', 'Submit'),
      str('sending', 'Sending', 'Sending…'),
      str('required', 'Required marker', 'Required'),
      str('optional', 'Optional marker', 'Optional'),
      str('successTitle', 'Success title', 'Thank you'),
      str('successMessage', 'Success message', 'We have received your message and will be in touch.'),
      str('errorTitle', 'Error title', 'Something went wrong'),
      str('errorMessage', 'Error message', 'Please try again, or contact us directly.'),
      str('invalidEmail', 'Invalid email', 'Enter a valid email address.'),
      str('fieldRequired', 'Field required', 'This field is required.'),
      str('fileTooLarge', 'File too large', 'That file is too large.'),
      str('uploadCv', 'Upload CV label', 'Upload your CV'),
    ],
    label: 'Forms',
  },
  {
    name: 'listing',
    fields: [
      str('filterBy', 'Filter by', 'Filter by'),
      str('allCategories', 'All categories', 'All'),
      str('sortBy', 'Sort by', 'Sort by'),
      str('newest', 'Newest', 'Newest first'),
      str('oldest', 'Oldest', 'Oldest first'),
      str('empty', 'Empty listing', 'Nothing to show yet.'),
      str('page', 'Page', 'Page'),
      str('of', 'Of (pagination)', 'of'),
      str('publishedOn', 'Published on', 'Published on'),
      str('minRead', 'Minutes to read', '{minutes} min read'),
    ],
    label: 'Listings',
  },
  {
    name: 'errors',
    fields: [
      str('notFoundTitle', '404 title', 'Page not found'),
      str('notFoundBody', '404 body', 'The page you are looking for may have moved or no longer exists.'),
      str('notFoundCta', '404 button', 'Go to the home page'),
      str('serverErrorTitle', '500 title', 'Something went wrong'),
      str('serverErrorBody', '500 body', 'Please try again shortly.'),
    ],
    label: 'Errors',
  },
  {
    name: 'a11y',
    fields: [
      str('playVideo', 'Play video', 'Play video'),
      str('pauseVideo', 'Pause video', 'Pause video'),
      str('nextSlide', 'Next slide', 'Next slide'),
      str('prevSlide', 'Previous slide', 'Previous slide'),
      str('goToSlide', 'Go to slide', 'Go to slide {number}'),
      str('newWindow', 'Opens in new window', 'Opens in a new window'),
    ],
    label: 'Accessibility',
  },
]

export interface UiStringsOptions {
  slug?: string
  /** Extra string groups specific to the project. */
  extraGroups?: { fields: Field[]; label: string; name: string }[]
  /** Access control for updating. */
  canUpdate?: GlobalConfig['access'] extends { update?: infer U } ? U : never
}

export const buildUiStringsGlobal = (options: UiStringsOptions = {}): GlobalConfig => {
  const groups = [...defaultStringGroups, ...(options.extraGroups ?? [])]

  return {
    slug: options.slug ?? 'ui-strings',
    access: { read: () => true, ...(options.canUpdate ? { update: options.canUpdate } : {}) },
    admin: {
      description:
        'Every piece of interface text on the site. Change it here rather than in code — it takes effect immediately, in every language.',
      group: 'Settings',
    },
    fields: [
      {
        tabs: groups.map((g) => ({
          name: g.name,
          fields: g.fields,
          label: g.label,
        })),
        type: 'tabs',
      },
    ],
    label: 'UI Strings',
  }
}

/* ------------------------------------------------------------------ */
/* Frontend helper                                                     */
/* ------------------------------------------------------------------ */

export type UiStrings = Record<string, Record<string, string>>

/**
 * Reads a string by dotted path, with placeholder substitution:
 *
 *   t(strings, 'search.placeholder')
 *   t(strings, 'search.resultsCount', { count: 12, query: 'grants' })
 *
 * Falls back to the key itself so a missing string is visible in
 * development rather than rendering as an empty element.
 */
export const t = (
  strings: UiStrings | null | undefined,
  path: string,
  vars?: Record<string, number | string>,
): string => {
  const [group, key] = path.split('.')
  let value = (strings?.[group]?.[key] as string | undefined) ?? path

  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      value = value.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v))
    }
  }
  return value
}
