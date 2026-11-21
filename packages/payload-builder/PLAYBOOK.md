# Payload CMS Builder — Playbook

How to start (or upgrade) a Payload CMS website with **`@opendesigns/payload-builder`**, the kit built and hardened on the ERDC site (erdc.gov.ae). Read this once at kickoff; keep it open while setting up.

| Doc | Read when |
|---|---|
| **PLAYBOOK.md** (this) | Starting a project, deploying, checking a gotcha |
| [README.md](README.md) | What the builder canvas does, architecture |
| [BOILERPLATE.md](BOILERPLATE.md) | Options of the full starter kit (scaffold, settings, i18n, roles) |
| [ELEMENTS.md](ELEMENTS.md) | Writing a custom element |
| [LAYOUTS.md](LAYOUTS.md) | Global layout + conditional overrides |
| [USING_WITH_EXISTING_PROJECT.md](USING_WITH_EXISTING_PROJECT.md) | Adding only the canvas to a project that already has blocks |
| [CHANGELOG.md](CHANGELOG.md) | What changed between versions |

---

## 1. What you get

| Import | What it gives you |
|---|---|
| `@opendesigns/payload-builder` | `builderPlugin` (canvas field, scaffolded collections, Site Settings / SEO / UI Strings / Menus, Layouts, roles, i18n switch), `dynamicFormsPlugin` (CMS-driven forms), `graphEmailAdapter` (Microsoft 365 mail, no SMTP), `runStartupMigrations`, `importContent` / `htmlToLexical` (static → CMS), `reindexCollections`, `isRequestAuthorized` (maintenance-route key), `rt()` Lexical seed helpers, style engine, attribute sanitizers |
| `@opendesigns/payload-builder/client` | `BuilderField` (admin canvas), `DynamicForm` (frontend form renderer), `SubmissionFilesField/Cell` (dashboard downloads), client-safe validation |
| `@opendesigns/payload-builder/rsc` | `BuilderRenderer`, `BuilderSection`, `BuilderAnimations`, `standardElements` (20 elements), `MarkedText`, `ThemeInitScript` |
| CSS | `@opendesigns/payload-builder/rsc/builder.css` (frontend), `/client/canvas.css` (admin, loaded by the field) |

Everything is **opt-in**: a project can take only the forms, only the canvas, or the whole kit.

## 2. Pick your path

| Situation | Path | Time |
|---|---|---|
| New website | **A — full kit** (§4) | 1 day to a running admin |
| Existing Payload site that already has section/row/column blocks | **B — canvas only** ([USING_WITH_EXISTING_PROJECT.md](USING_WITH_EXISTING_PROJECT.md)) | 1–2 hours, no migration |
| Any Payload site that needs contact/careers forms | **C — forms only** (§6) | half a day |

## 3. Requirements and install

**Stack the package is tested on:** Payload **3.87**, Next.js **16.2** (15.x works), React **19**, PostgreSQL (`@payloadcms/db-postgres`), Node **22**, **pnpm**. Payload minor versions move fast — upgrade Payload and this package together.

The package ships **TypeScript source** (no build step), so the app must transpile it.

**Recommended: vendor + link** (what ERDC does — works inside Docker/Azure build contexts):

```text
<app>/
  packages/payload-builder/      ← copy of packages/builder (or unpack the .tgz here)
  package.json                   "@opendesigns/payload-builder": "link:packages/payload-builder"
  next.config.mjs                transpilePackages: ['@opendesigns/payload-builder']
```

**Alternative: tarball** — `pnpm add ./opendesigns-payload-builder-0.2.0.tgz` (still needs `transpilePackages`).

Then, always:

```bash
pnpm install
pnpm payload generate:importmap   # after adding the plugin or changing admin components
pnpm payload migrate:create        # schema changes go through migrations (§8)
```

**Dockerfile:** copy `packages/payload-builder/package.json` before `pnpm install` so the workspace link resolves in the deps stage (see ERDC's `Dockerfile`).

## 4. Path A — new project, step by step

### 4.1 `payload.config.ts`

```ts
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'
import { builderPlugin, dynamicFormsPlugin, graphEmailAdapter } from '@opendesigns/payload-builder'
import { standardElements } from '@opendesigns/payload-builder/rsc'

export default buildConfig({
  admin: { user: 'users' },
  collections: [],                       // scaffolded below; your own slugs win
  editor: lexicalEditor(),
  localization: { locales: ['en', 'ar'], defaultLocale: 'en', fallback: true }, // omit if single-language
  plugins: [
    builderPlugin({
      elements: standardElements,        // + your own elements (ELEMENTS.md)
      scaffold: true,                    // Users, Media, Pages, Posts, Categories, Tags
      settings: true,                    // Site Settings, UI Strings, Menus
      layouts: true,                     // header/footer/global layout + overrides
      i18n: { locales: ['en', 'ar'], defaultLocale: 'en', rtl: ['ar'], labels: { en: 'English', ar: 'العربية' } },
    }),
    dynamicFormsPlugin({
      localized: true,
      privateUploads: true,              // CVs/IDs in an auth-only collection
      privateUploadsDir: path.resolve(dirname, '../private-media'), // absolute! (see §10)
    }),
  ],
  ...(process.env.GRAPH_CLIENT_ID ? {
    email: graphEmailAdapter({
      tenantId: process.env.GRAPH_TENANT_ID!, clientId: process.env.GRAPH_CLIENT_ID!,
      clientSecret: process.env.GRAPH_CLIENT_SECRET!, sender: process.env.GRAPH_SENDER_ADDRESS!,
      defaultFromName: 'Client Name',
    }),
  } : {}),                               // console transport locally
  db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URL }, push: false }),
  secret: process.env.PAYLOAD_SECRET!,
  sharp,
})
```

Decide **single vs multi-language on day one** — turning localization off after content exists is a migration (BOILERPLATE.md → i18n).

### 4.2 Migrations at container start (`src/instrumentation.ts`)

```ts
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return
  const { runStartupMigrations } = await import('@opendesigns/payload-builder')
  await runStartupMigrations({
    importConfig: () => import('@payload-config'),
    importMigrations: () => import('./migrations'),
  })
}
```

Advisory-locked (one replica migrates), so the image can be **built without a database** — required when the CI identity has no secrets. `RUN_MIGRATIONS_ON_START=false` skips it.

### 4.3 Frontend

```tsx
// app/(frontend)/layout.tsx
import '@opendesigns/payload-builder/rsc/builder.css'
import { ThemeInitScript } from '@opendesigns/payload-builder/rsc'
// <head><ThemeInitScript /></head>   ·   <html lang={locale} dir={rtl ? 'rtl' : 'ltr'}>

// app/(frontend)/[...slug]/page.tsx
import { createElementRegistry } from '@opendesigns/payload-builder'
import { BuilderRenderer, standardElements } from '@opendesigns/payload-builder/rsc'
const registry = createElementRegistry([...standardElements /*, ...myElements */])
// <BuilderRenderer layout={page.layout} registry={registry} locale={locale} />
```

- **Layouts** (header/footer/global sections): `resolveBuilderLayout(...)` then render each slot with `BuilderRenderer` — LAYOUTS.md.
- **Interface text:** never hard-code; `t(await payload.findGlobal({ slug: 'ui-strings', locale }), 'search.placeholder')`.
- **Menus:** `menuHref(item)` — links to documents follow slug changes.
- **Highlighted words** in headings: `MarkedText` renders `*word*` markers.

### 4.4 First run

`pnpm dev` → `/admin` → create the first user (gets `superadmin`) → Site Settings → a Page with the canvas → view it at `/<slug>` and `/ar/<slug>`.

## 5. Path B — canvas on an existing project

Follow [USING_WITH_EXISTING_PROJECT.md](USING_WITH_EXISTING_PROJECT.md): add one `admin.components.Field: '@opendesigns/payload-builder/client#BuilderField'` line to the layout field, regenerate the import map. No schema change; rollback = remove the line.

## 6. Forms (Path C, or part of A)

**Backend:** `dynamicFormsPlugin({...})` adds **Forms**, **Form Submissions**, **Form Uploads** (private, with `privateUploads`), **Form Mail Settings**, **Form Security Settings**, and the endpoints `POST /api/form-submit`, `POST /api/form-upload`, `GET /api/form-options`.

Options: `localized`, `privateUploads`, `privateUploadsDir`, `optionsCollections` (selects fed from a collection), `access: { manageForms, readSubmissions }`, and slug overrides.

**Build a form in the admin:** Forms → fields (text, email, phone with country, select, checkbox, date, file …, widths ½ / ⅓), success message or redirect, **Admin email** (To/Cc/Bcc, reply-to field, subject/body with mail tags `[field-name]`, `[all-fields]`, `[form-title]`, `[page-url]`, `[date]`), **User email** (acknowledgement). With no "To", the admin email goes to **Form Mail Settings → default admin address**.

**Frontend:** fetch on the server and pass a **public-safe projection** (never pass recipients/email bodies to a client component — see ERDC `src/lib/forms.ts → fetchForm`), then:

```tsx
'use client'
import { DynamicForm, DEFAULT_MESSAGES } from '@opendesigns/payload-builder/client'
<DynamicForm form={formSpec} locale={locale} recaptcha={recaptcha}
  messages={locale === 'ar' ? AR_MESSAGES : DEFAULT_MESSAGES} className="MyForm" />
```

**What the pipeline guarantees** (`/api/form-submit`): rate limit → reCAPTCHA v3 (`RECAPTCHA_SECRET_KEY`, score threshold in Form Security Settings) → server-side re-validation of every field → store (JSONL failsafe if the DB write fails) → **respond** → admin + user emails **after the response** (`next/server` `after()`), so the visitor never waits for mail.

**Files** (CVs etc.): uploaded first to `/api/form-upload` (type allow-list from the field's `accept`, size cap ≤ 10 MB, stored privately). In the admin email the file is **attached** (≤ ~2.8 MB via Graph `sendMail`; larger with Mail.ReadWrite — §7) or named with an **"Open in dashboard"** link. Staff download from **Form Submissions → Files**. Without a login, file URLs return 403.

## 7. Email — Microsoft Graph (no SMTP)

1. Client IT creates an **Entra ID app registration** with application permission **Mail.Send** (admin consent) and a client secret.
2. Env: `GRAPH_TENANT_ID`, `GRAPH_CLIENT_ID`, `GRAPH_CLIENT_SECRET` (Key Vault), `GRAPH_SENDER_ADDRESS` (e.g. `info@client.gov.ae`).
3. *Optional, for attachments over ~2.8 MB:* **Mail.ReadWrite** (application), **scoped to the sender mailbox only** via Exchange *RBAC for Applications* / *Application Access Policy*. Without it, large files fall back to the dashboard link automatically.
4. Test with a key-gated test route before go-live; check the mail lands outside Junk.

## 8. Deploy

**Environment variables**

| Variable | Notes |
|---|---|
| `DATABASE_URL` | Postgres |
| `PAYLOAD_SECRET` | Also the source of the maintenance-route key (first 12 chars) — keep it in Key Vault, rotate if exposed |
| `NEXT_PUBLIC_SERVER_URL` | Absolute site URL — used for canonical/og URLs and the dashboard links in form emails |
| `GRAPH_*` | §7 |
| `RECAPTCHA_SECRET_KEY` | Env only — never in the CMS |
| `AZURE_STORAGE_CONNECTION_STRING`, `AZURE_STORAGE_CONTAINER` | When media lives in Blob |
| `RUN_MIGRATIONS_ON_START` | `false` to skip startup migrations |

**Rules that saved us on ERDC**

- **Migrations, never `push`,** in every shared environment. Migrations use schema + raw SQL only — **never the Payload Local API** inside a migration. Snapshot the DB before migrating production; flag destructive migrations in the release notes.
- **Build is DB-free:** `next build` must succeed with no database (CI has no secrets); the schema is touched only at container start (§4.2).
- **Uploads on disk** (Docker volume): the volume keeps the owner it was created with — **chown it to the app user on every deploy**, or the first upload fails with `EACCES` (`docker compose exec -u 0 app chown -R nextjs:nodejs /app/private-media /app/public/media`).
- **Uploads in Azure Blob** with a private endpoint: files are streamed **through Payload** (`/api/media/file/...`), never public Blob URLs. Upload media **sequentially** (parallel uploads once created records whose files never reached Blob).
- **WAF:** allow-list the maintenance routes you use (`/api/content-release`, `/api/reindex-search`, `/api/form-*`) and the admin.
- **Health:** expose `/api/health` and gate the deploy on it.
- **Staging first, production after sign-off.** Content changes move as reviewed releases, not hand edits on two environments.

## 9. Maintenance routes and utilities

- Gate every maintenance route: `if (!isRequestAuthorized(request)) return Response.json({ error: 'Not allowed' }, { status: 403 })` → call as `?key=<first 12 chars of PAYLOAD_SECRET>`. Never paste the full secret anywhere.
- `reindexCollections(payload, ...)` — rebuild the search index without re-saving pages.
- `importContent` / `htmlToLexical` — import a static HTML build into the CMS (EN + AR).
- **Recipes in the ERDC repo** (copy and adapt — app-specific, not in the package yet): content releases with dry run inside a rolled-back transaction (`src/utilities/contentRelease.ts`), weighted bilingual site search with per-page keywords (`src/search/`), canonical/hreflang/sitemap (`src/lib/canonical.ts`), crawlable favicon route (`src/app/(frontend)/site-icon.png`).

## 10. Gotchas we hit (and the fix)

| Symptom | Cause | Fix |
|---|---|---|
| Upload fails "Upload failed", log `EACCES` | Upload dir relative to `process.cwd()` or root-owned volume | Absolute `privateUploadsDir`; chown volumes on deploy |
| `.doc` upload refused ("Invalid MIME type: application/x-cfb") | Payload detects legacy Word as OLE container | Allowed since 0.2.0 |
| Large CV not attached | Graph `sendMail` 4 MB request limit | Mail.ReadWrite (scoped) or accept the dashboard link |
| Release / script save fails "The following field is invalid: Title" on one locale | Payload builds a save on the page's **latest version** — an unpublished draft (here with an empty Arabic title) | Publish or discard the draft first; never let a script publish an editor's draft |
| Google shows a blank favicon | Favicon under `/api/` (robots.txt blocks it) and fallback `.ico` white-on-transparent | Serve from a crawlable path, square multiple of 48 px, dark mark on white |
| Every page has the same `<title>` | Empty SEO titles + site-name-only fallback | Fallback to `Page title \| Site name`; use SEO title exactly as written |
| Arabic page shows English SEO title | Locale fallback | Read head metadata with `fallbackLocale: false` for non-default locales |
| Dev server proposes dropping tables | `push: true` on a real DB | `push: false` + migrations everywhere except a throwaway DB |
| Postgres "identifier too long" | Deeply nested group/field names (63-char limit) | Short names inside nested groups (`pt`, not `paddingTop`) |
| New list column not visible for some admins | Saved column preferences | Columns → enable it (or reset preferences) |
| Images missing after a sync, records exist | File never reached Blob | Re-upload in place (`overwriteExistingFiles`) or write the blob under the recorded name |

## 11. Security conventions (keep them)

- The CMS **never injects raw markup**: no free-text script slots; analytics by ID only; custom attributes pass `sanitizeAttrs` (drops `on*`, `style`, url-bearing attrs).
- Secrets only in env / Key Vault; nothing secret in the repo, image or CMS.
- Private uploads are auth-only; email links to submissions require a login.
- Form submissions are write-once (no create/update over REST).
- Mail by Graph, no SMTP credentials.
- Maintenance routes key-gated and WAF-listed.

## 12. Upgrading the package in a project

1. Replace `<app>/packages/payload-builder/` with the new version (or the new `.tgz`).
2. Read the CHANGELOG; run `pnpm install`, `pnpm payload generate:importmap`.
3. `pnpm tsc --noEmit` and `pnpm build` — the package is type-checked against **your** generated types, so slug unions etc. surface here, not in the package.
4. If the CHANGELOG mentions schema, run `pnpm payload migrate:create` and review the SQL.
5. Test on the internal server, then staging, then production.

## 13. Kickoff checklist

- [ ] Languages decided (single or EN/AR) — before any content
- [ ] Repo with `packages/payload-builder` linked, `transpilePackages` set
- [ ] `payload.config.ts` per §4.1, `push: false`, first migration created
- [ ] `instrumentation.ts` startup migrations
- [ ] Storage decided (disk volume with chown, or Azure Blob)
- [ ] Entra app + Mail.Send (Mail.ReadWrite scoped if CVs > 2.8 MB matter)
- [ ] reCAPTCHA keys (secret in env)
- [ ] Site Settings: name, logo, favicon (square, ≥ 192 px, dark on light), default SEO
- [ ] UI Strings and Menus filled in both languages
- [ ] Forms built; admin "To" set (or Form Mail Settings default); test submission end to end
- [ ] robots.txt / sitemap / canonical / hreflang checked; favicon reachable by crawlers
- [ ] WAF allow-list and health check in place
- [ ] Release flow agreed: internal → staging → production after sign-off
