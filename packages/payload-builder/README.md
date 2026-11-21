# @opendesigns/payload-builder

Visual page-builder plugin for Payload CMS. Backend-builder canvas
(Avada-backend/WPBakery style) over a Section → Row → Column → Element
model stored as ordinary Payload blocks — localization, drafts, versions,
access control and migrations all stay native.

**Version 0.2.0 — in production on erdc.gov.ae.** Start with
[PLAYBOOK.md](PLAYBOOK.md) (new project, forms, email, deploy, gotchas);
[USING_WITH_EXISTING_PROJECT.md](USING_WITH_EXISTING_PROJECT.md) drops the
canvas onto an existing project; [CHANGELOG.md](CHANGELOG.md) lists changes.

## Works with any Section → Row → Column → Element schema

The canvas is **schema-agnostic**. It inspects the layout field's client
config and adapts to whatever it finds: container names (`elements` vs
`content`), container kinds (`array` vs `blocks`), section block slug,
fields nested inside tabs, and string or numeric column widths. Schema paths
are computed with the same rules as Payload's own
`buildClientFieldSchemaMap`, including `_index-N` segments for unnamed
rows/collapsibles/tabs.

That means an existing project adopts the builder by adding one
`admin.components.Field` line — **no schema change and no data migration**.
If the shape isn't recognised, the canvas says so and renders Payload's
default blocks editor instead of failing.

Covered by `pnpm --filter @opendesigns/payload-builder test:schema`.

## Quick start (Windows, matches the ERDC workflow)

```
setup-local.bat    # install, create DB, generate import map
run-dev.bat        # http://localhost:3000/admin
```

Create the first user, add a Page, and the **Layout** field renders the
builder. The frontend at `http://localhost:3000/<slug>` (and `/ar/<slug>`)
renders the same page through `BuilderRenderer`.

## Using in a real project

```ts
// payload.config.ts
import { builderPlugin } from '@opendesigns/payload-builder'
import { standardElements } from '@opendesigns/payload-builder/rsc'

plugins: [
  builderPlugin({
    collections: ['pages'],
    elements: standardElements,
    layouts: true,   // adds the Layout Sections + Layouts collections
  }),
]
```

```tsx
// frontend page
import { createElementRegistry } from '@opendesigns/payload-builder'
import { BuilderRenderer, standardElements } from '@opendesigns/payload-builder/rsc'

const registry = createElementRegistry(standardElements)
<BuilderRenderer layout={page.layout} registry={registry} locale={locale} />
```

Import `packages/builder/src/rsc/builder.css` once in the site layout.
After adding the plugin, run `payload generate:importmap`.

### Adding a custom element

```ts
import type { ElementDefinition } from '@opendesigns/payload-builder'

export const statBlock: ElementDefinition = {
  slug: 'statBlock',
  label: 'Stat Block',
  category: 'content',
  fields: [
    { name: 'value', type: 'text', localized: true },
    { name: 'caption', type: 'text', localized: true },
  ],
  Component: ({ data }) => (
    <div className="stat"><strong>{data.value}</strong><span>{data.caption}</span></div>
  ),
  excerpt: (d) => String(d.value ?? ''),
}
```

Pass it in `elements: [...standardElements, statBlock]` — no plugin change.

## Architecture notes

- **Data:** real Payload blocks (`builderSection` → `builderRow` →
  `columns[]` → element blocks). Never a JSON blob — that is what keeps
  EN/AR localization semantics native (ERDC lesson).
- **Canvas:** custom `admin.components.Field` on the layout field. UI state
  only (selection, collapse); document data lives exclusively in Payload
  form state via `useForm` dispatches (`addFieldRow` / `moveFieldRow` /
  `removeFieldRow` — verified against @payloadcms/ui 3.87 source: ADD_ROW
  is a local dispatch, no schemaPath round-trip needed).
- **Inspector:** renders the selected node's real Payload fields via
  `RenderFields` (schema paths follow `${fieldSchemaPath}.${blockSlug}`,
  same as Payload's buildClientFieldSchemaMap). Wrapped in an error
  boundary; if it ever fails, the **Form view** toggle mounts Payload's
  own `BlocksField` as escape hatch.
- **Style engine:** controls compile to CSS variables server-side; custom
  attrs pass the same security filter as ERDC (drops `on*`, `style`, `id`,
  `class`, url-bearing attrs).
- **Dev DB:** `push: true` here because this database is disposable.
  Client projects must use `push: false` + migrations.

## Feature summary

| | |
|---|---|
| **Builder canvas** | Backend builder (Avada backend editor / WPBakery style): sections → rows → columns → elements, drag to reorder, duplicate, copy/paste across columns, column layout picker |
| **Node options** | Four tabs per node — **General · Design · Background · Extras** — mirroring Avada's container dialog |
| **Backgrounds** | Colour, gradient (with angle), image (position / size / repeat / attachment / parallax), video with poster, colour overlay with opacity, blend modes |
| **Responsive** | Tablet and mobile spacing overrides that cascade; per-breakpoint hiding |
| **Elements** | 20 in the standard pack; custom ones are a single file — see [ELEMENTS.md](ELEMENTS.md) |
| **Layouts** | Global layout plus conditional overrides with slot inheritance — see [LAYOUTS.md](LAYOUTS.md) |
| **Schema-agnostic** | Drives an existing project's schema with no migration — see [USING_WITH_EXISTING_PROJECT.md](USING_WITH_EXISTING_PROJECT.md) |
| **Starter kit** | Users (7 roles), Media, Pages, Posts, Categories, Tags; Site Settings, SEO, UI Strings, Menus; EN/AR switch — see [BOILERPLATE.md](BOILERPLATE.md) |
| **Forms** | CMS-built forms, private file uploads, reCAPTCHA, rate limit, admin/user emails with CV attachments, dashboard downloads — see [PLAYBOOK.md](PLAYBOOK.md) §6 |
| **Ops** | Microsoft Graph mail (no SMTP), startup migrations behind an advisory lock, static → CMS import, search reindex, key-gated maintenance routes |

## What the canvas does

- **Drag to reorder** sections, rows and elements (Payload's own
  `DraggableSortable`, so no extra dependency).
- **Duplicate** any node via Payload's `DUPLICATE_ROW` action.
- **Copy/paste elements across columns** — ⎘ copies, a Paste button appears
  in every column. Implemented by rebuilding `subFieldState` from public
  form state rather than Payload's internal clipboard helpers.
- **Column layout picker** on "+ Add row": full width, two/three/four equal,
  wide+narrow, sidebar left/right — creates the row and its columns at the
  right widths in one action.
- **Settings modal** rendering the node's real Payload fields, so
  localization, validation and rich text all behave natively.
- **Form view** escape hatch that mounts Payload's own `BlocksField`.

## Known limitations

- Elements drag within a column; moving between columns uses copy/paste.
- Column widths are edited in the column settings, not by dragging edges.
- No saved section presets yet (Phase 5).
- Live WYSIWYG preview is deliberately deferred — see the plan's Phase 4.

## Testing

```
pnpm --filter @opendesigns/payload-builder typecheck
pnpm --filter @opendesigns/payload-builder test:schema
pnpm --filter dev build
```

The dev build runs with an invalid `DATABASE_URL` on purpose: the build must
never touch the database.
