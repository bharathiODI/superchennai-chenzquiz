# Starting a new project from this plugin

One call gives you the whole content model, the builder, settings and roles.

```ts
// payload.config.ts
import { builderPlugin } from '@opendesigns/payload-builder'
import { standardElements } from '@opendesigns/payload-builder/rsc'

export default buildConfig({
  admin: { user: 'users' },
  collections: [],            // the plugin scaffolds them
  editor: lexicalEditor(),
  plugins: [
    builderPlugin({
      elements: standardElements,
      scaffold: true,           // Users, Media, Pages, Posts, Categories, Tags
      settings: true,           // Site Settings, UI Strings, Menus
      layouts: true,            // global layout + conditional overrides
      // i18n: omit for a single-language project
    }),
  ],
  db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URL }, push: false }),
  secret: process.env.PAYLOAD_SECRET,
})
```

Then `payload generate:importmap` and `payload migrate:create`.

## What each option adds

### `scaffold`

| Collection | Notes |
|---|---|
| **Users** | Auth, 7 roles, per-locale translator restriction. The `roles` field is admin-writable only, so nobody can promote themselves. |
| **Media** | Alt text, caption, credit. Alt text carries guidance about decorative images. |
| **Pages** | Title, auto-slug, parent nesting, builder layout, SEO group, drafts. |
| **Posts** | Excerpt, featured image, categories, tags, featured flag, builder layout, SEO, drafts. |
| **Categories** | Hierarchical, with description, image and manual ordering. |
| **Tags** | Flat. |

Pass `{ blog: false }` to skip Posts, Categories and Tags. Any collection you
declare yourself with the same slug wins — the scaffold never overwrites.

### `settings`

**Site Settings** — General, Branding, Contact, Social, SEO, Scripts &
Analytics. Includes maintenance mode, brand colours, GTM/GA IDs, custom
head/body scripts, robots.txt additions and an Organization JSON-LD toggle.

**UI Strings** — every piece of interface text, in seven groups: General,
Search, Navigation, Forms, Listings, Errors, Accessibility. Around 60
strings out of the box, all translatable.

```tsx
import { t } from '@opendesigns/payload-builder'

const strings = await payload.findGlobal({ slug: 'ui-strings', locale })

<input placeholder={t(strings, 'search.placeholder')} />
<p>{t(strings, 'search.resultsCount', { count: 12, query: 'grants' })}</p>
```

Nothing user-visible should be hard-coded in a component. Add project
strings with `settings: { extraStringGroups: [...] }`.

**Menus** — header, footer, utility and legal areas, three levels deep.
Items link to a document (so the URL follows the page if its slug changes)
or to a custom URL. `menuHref(item)` resolves either.

### `layouts`

See [LAYOUTS.md](LAYOUTS.md).

### `i18n`

```ts
i18n: {
  locales: ['en', 'ar'],
  defaultLocale: 'en',
  rtl: ['ar'],
  labels: { en: 'English', ar: 'العربية' },
}
```

**Omit the block entirely for a single-language project.** Every field the
plugin generates goes through an `L()` helper that only marks fields
`localized` when i18n is configured — so a monolingual project gets a clean
single-column schema, with nothing to disable later and no per-locale rows.

This matters because turning localization off *after* content exists is a
migration, not a setting. Decide at the start.

## Roles

| Role | WordPress equivalent | Can |
|---|---|---|
| `superadmin` | Super Admin | Everything, including users and settings |
| `admin` | Administrator | Everything except deleting super admins |
| `editor` | Editor | Create, edit and publish all content |
| `author` | Author | Create and edit **their own** content |
| `contributor` | Contributor | Draft their own content, cannot publish |
| `translator` | — | Edit non-default locales only |
| `viewer` | Subscriber | Read the admin, change nothing |

Author and contributor scoping is a **query constraint**, not just a save
check — so list views are filtered too, and an author never sees a
colleague's drafts.

Add `createdByField()` to any collection using those roles; that's what the
scoping reads.

## Conventions worth keeping

**Migrations, not push.** Use `push: false` and versioned migrations in any
real project. Dev auto-push has proposed destructive table renames on this
stack before.

**Short field names inside groups.** These blocks nest four levels deep and
Postgres caps identifiers at 63 characters. Prefer `pt` over `paddingTop`.

**Text-only RTL.** Direction applies to typographic content, never to the
layout grid — rows and columns keep their order in Arabic. Numerals stay
LTR via `dir="ltr"`.
