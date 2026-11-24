import type { Access, Where } from 'payload'

/**
 * CMS roles - the WordPress model from the payload-builder playbook, on this app's single
 * `role` field (users have exactly one role).
 *
 * | Role        | WordPress     | Can                                                                   |
 * |-------------|---------------|-----------------------------------------------------------------------|
 * | superadmin  | Super Admin   | Everything, including other super admins                              |
 * | admin       | Administrator | Everything except super admin accounts                                |
 * | editor      | Editor        | Quizzes, questions, pages, posts, media - anyone's; quiz dashboard    |
 * | author      | Author        | Write and publish their OWN questions and posts; upload media         |
 * | contributor | Contributor   | Draft their OWN questions and posts; cannot publish                   |
 * | viewer      | Subscriber    | Quiz dashboard (players, quiz details, attempts) + Excel export only  |
 * | user        | -             | No access: cannot open the CMS (blocked / old accounts)               |
 *
 * Settings (Quiz Settings, Quiz Site Settings), Appearance (Header, Footer), Users and the
 * Players & Scores records are administrators' (WordPress `manage_options`).
 * Players (quiz-users) log in to the same API and never have a CMS role.
 */
export const ROLES = ['superadmin', 'admin', 'editor', 'author', 'contributor', 'viewer'] as const
export type Role = (typeof ROLES)[number]

export const ROLE_OPTIONS: { label: string; value: Role | 'user' }[] = [
  { label: 'Super Admin - everything, including users and settings', value: 'superadmin' },
  { label: 'Administrator - everything except Super Admin accounts', value: 'admin' },
  { label: 'Editor - quizzes, questions, pages, posts and media (anyone\'s)', value: 'editor' },
  { label: 'Author - writes and publishes their own questions and posts', value: 'author' },
  { label: 'Contributor - drafts their own questions and posts, cannot publish', value: 'contributor' },
  { label: 'Viewer - quiz dashboard and Excel export only', value: 'viewer' },
  { label: 'No access - cannot open the CMS', value: 'user' },
]

export const ROLE_NAMES: Record<string, string> = {
  superadmin: 'Super Admin',
  admin: 'Administrator',
  editor: 'Editor',
  author: 'Author',
  contributor: 'Contributor',
  viewer: 'Viewer',
  user: 'No access',
  client: 'No access',
}

export const ADMINS: Role[] = ['superadmin', 'admin']
export const EDITORS: Role[] = [...ADMINS, 'editor']
/** May write questions and posts (authors and contributors only their own). */
export const WRITERS: Role[] = [...EDITORS, 'author', 'contributor']
/** May upload media. */
export const UPLOADERS: Role[] = [...EDITORS, 'author']
/** May open the quiz dashboard and download the Excel report. */
export const REPORT_READERS: Role[] = [...EDITORS, 'viewer']

type MaybeUser = { collection?: string; role?: unknown; id?: number | string } | null | undefined

/** The CMS role of a logged-in user; null for players, visitors and blocked accounts. */
export function cmsRole(user: unknown): Role | null {
  const u = user as MaybeUser
  if (!u || u.collection !== 'users') return null
  const r = String(u.role ?? '')
  return (ROLES as readonly string[]).includes(r) ? (r as Role) : null
}

export const userHas = (user: unknown, roles: readonly Role[]): boolean => {
  const r = cmsRole(user)
  return Boolean(r && roles.includes(r))
}

/** Access rule: only these roles. */
export const allow =
  (roles: readonly Role[]): Access =>
  ({ req }) =>
    userHas(req.user, roles)

/** For `admin.hidden`: hide from the menu unless the user has one of these roles. */
export const hiddenUnless =
  (roles: readonly Role[]) =>
  ({ user }: { user: unknown }): boolean =>
    !userHas(user, roles)

const own = (user: unknown): Where => ({ createdBy: { equals: (user as MaybeUser)?.id } })

/** Create a question / post: writers; contributors only as a draft. */
export const createContent: Access = ({ req, data }) => {
  const r = cmsRole(req.user)
  if (!r || !WRITERS.includes(r)) return false
  if (r === 'contributor' && data?._status === 'published') return false
  return true
}

/** Edit: editors and up anyone's; authors and contributors only their own (contributors never publish). */
export const updateContent: Access = ({ req, data }) => {
  const r = cmsRole(req.user)
  if (!r) return false
  if (EDITORS.includes(r)) return true
  if (r === 'author') return own(req.user)
  if (r === 'contributor') return data?._status === 'published' ? false : own(req.user)
  return false
}

/** Delete: editors and up anyone's; authors their own. */
export const deleteContent: Access = ({ req }) => {
  const r = cmsRole(req.user)
  if (!r) return false
  if (EDITORS.includes(r)) return true
  if (r === 'author') return own(req.user)
  return false
}
