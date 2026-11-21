import type { Access, CollectionConfig, Field, PayloadRequest } from 'payload'

/**
 * Roles and capabilities — the WordPress model, adapted.
 *
 * | Role        | WordPress equivalent | Can                                        |
 * |-------------|----------------------|--------------------------------------------|
 * | superadmin  | Super Admin          | Everything, including users and settings    |
 * | admin       | Administrator        | Everything except deleting super admins     |
 * | editor      | Editor               | Create/edit/publish anyone's content        |
 * | author      | Author               | Create and edit *their own* content         |
 * | contributor | Contributor          | Draft their own content, cannot publish     |
 * | translator  | —                    | Edit non-default locales only               |
 * | viewer      | Subscriber           | Read the admin, change nothing              |
 */

export const ROLES = [
  'superadmin',
  'admin',
  'editor',
  'author',
  'contributor',
  'translator',
  'viewer',
] as const

export type Role = (typeof ROLES)[number]

export const ROLE_LABELS: Record<Role, string> = {
  admin: 'Administrator — full access except super admin management',
  author: 'Author — create and edit their own content',
  contributor: 'Contributor — draft their own content, cannot publish',
  editor: 'Editor — create, edit and publish all content',
  superadmin: 'Super Admin — full access including users and settings',
  translator: 'Translator — edit translations only',
  viewer: 'Viewer — read-only access to the admin',
}

interface UserWithRoles {
  id: number | string
  roles?: Role[] | null
}

export const getRoles = (req: PayloadRequest): Role[] =>
  ((req.user as UserWithRoles | null)?.roles ?? []) as Role[]

export const hasRole =
  (...roles: Role[]): Access =>
  ({ req }) =>
    getRoles(req).some((r) => roles.includes(r))

export const isSuperAdmin: Access = ({ req }) => getRoles(req).includes('superadmin')

export const isAdmin: Access = ({ req }) =>
  getRoles(req).some((r) => r === 'superadmin' || r === 'admin')

export const isEditor: Access = ({ req }) =>
  getRoles(req).some((r) => ['superadmin', 'admin', 'editor'].includes(r))

/** Anyone with any role can reach the admin. */
export const isLoggedIn: Access = ({ req }) => Boolean(req.user)

/** Everyone except viewers may create content. */
export const canCreate: Access = ({ req }) => {
  const roles = getRoles(req)
  if (!roles.length) return false
  return !(roles.length === 1 && roles[0] === 'viewer')
}

/**
 * Editors and above update anything. Authors and contributors are scoped
 * to documents they created — expressed as a query constraint so Payload
 * filters list views too, not just individual saves.
 */
export const canUpdateContent: Access = ({ req }) => {
  const roles = getRoles(req)
  if (roles.some((r) => ['superadmin', 'admin', 'editor', 'translator'].includes(r))) return true
  if (roles.some((r) => ['author', 'contributor'].includes(r)) && req.user) {
    return { createdBy: { equals: req.user.id } }
  }
  return false
}

/** Only editors and above may delete; authors may delete their own drafts. */
export const canDeleteContent: Access = ({ req }) => {
  const roles = getRoles(req)
  if (roles.some((r) => ['superadmin', 'admin', 'editor'].includes(r))) return true
  if (roles.includes('author') && req.user) {
    return { createdBy: { equals: req.user.id } }
  }
  return false
}

/** Contributors may not publish — enforced on the `_status` field. */
export const canPublish: Access = ({ req }) =>
  getRoles(req).some((r) => ['superadmin', 'admin', 'editor', 'author'].includes(r))

/** Self, or a super admin — for the Users collection. */
export const isSelfOrSuperAdmin: Access = ({ id, req }) => {
  if (getRoles(req).includes('superadmin')) return true
  return Boolean(req.user && id && String(req.user.id) === String(id))
}

/* ------------------------------------------------------------------ */
/* Users collection                                                    */
/* ------------------------------------------------------------------ */

export interface UsersCollectionOptions {
  slug?: string
  /** Extra profile fields. */
  extraFields?: Field[]
  /** Locale codes translators can be restricted to. */
  locales?: string[]
}

/**
 * True while the system has no superadmin — the bootstrap window.
 * During it, role rules relax so the instance can never dead-lock.
 * (A user existing with NULL roles — e.g. created before this collection
 * was adopted — previously produced "Unauthorized" with no way back in.)
 */
const noSuperAdminExists = async (req: PayloadRequest, slug: string): Promise<boolean> => {
  const found = await req.payload.find({
    collection: slug as never,
    depth: 0,
    limit: 1,
    where: { roles: { contains: 'superadmin' } },
  })
  return found.totalDocs === 0
}

export const buildUsersCollection = ({
  extraFields = [],
  locales = [],
  slug = 'users',
}: UsersCollectionOptions = {}): CollectionConfig => ({
  slug,
  access: {
    // `admin` gates entry to the panel and must return a plain boolean.
    // Any authenticated user may ENTER — what they can do inside is
    // governed by the role rules. Locking the door on role-less users
    // (legacy rows, aborted setups) created an unrecoverable state.
    admin: ({ req }) => Boolean(req.user),
    create: isAdmin,
    delete: isSuperAdmin,
    read: isLoggedIn,
    update: isSelfOrSuperAdmin,
  },
  admin: {
    defaultColumns: ['name', 'email', 'roles'],
    group: 'Settings',
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'roles',
      access: {
        // Users must never promote themselves — only an admin writes this
        // field. EXCEPT during bootstrap: while no superadmin exists,
        // whoever is signed in may claim the role (the WordPress
        // first-user model, made self-healing).
        create: async ({ req }) =>
          getRoles(req).some((r) => r === 'superadmin' || r === 'admin') ||
          (await noSuperAdminExists(req, slug)),
        update: async ({ req }) =>
          getRoles(req).some((r) => r === 'superadmin' || r === 'admin') ||
          (await noSuperAdminExists(req, slug)),
      },
      admin: { description: 'What this person may do. Most people need exactly one role.' },
      defaultValue: ['viewer'],
      hasMany: true,
      hooks: {
        beforeChange: [
          // The first user ever created becomes superadmin automatically.
          async ({ operation, req, value }) => {
            if (operation !== 'create') return value
            const existing = await req.payload.find({
              collection: slug as never,
              depth: 0,
              limit: 1,
            })
            return existing.totalDocs === 0 ? ['superadmin'] : value
          },
        ],
      },
      options: ROLES.map((r) => ({ label: ROLE_LABELS[r], value: r })),
      required: true,
      type: 'select',
    },
    ...(locales.length
      ? [
          {
            name: 'allowedLocales',
            admin: {
              condition: (_d: unknown, sibling: { roles?: string[] }) =>
                Boolean(sibling?.roles?.includes('translator')),
              description: 'Translators may only edit these locales. Leave empty to allow all.',
            },
            hasMany: true,
            options: locales.map((l) => ({ label: l, value: l })),
            type: 'select' as const,
          } satisfies Field,
        ]
      : []),
    ...extraFields,
  ],
})

/* ------------------------------------------------------------------ */
/* Authorship tracking                                                 */
/* ------------------------------------------------------------------ */

/**
 * Records who created a document, which is what makes the author and
 * contributor scoping above work. Add to any collection using those roles.
 */
export const createdByField = (usersSlug = 'users'): Field => ({
  name: 'createdBy',
  access: { update: () => false },
  admin: { position: 'sidebar', readOnly: true },
  hooks: {
    beforeChange: [
      ({ operation, req, value }) => {
        if (operation === 'create' && req.user) return req.user.id
        return value
      },
    ],
  },
  relationTo: usersSlug as never,
  type: 'relationship',
})
