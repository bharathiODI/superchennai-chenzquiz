# Adding the builder canvas to an existing Payload project

The canvas is **schema-agnostic**: it reads the layout field's config and
adapts, so an existing project keeps its own block names. **No schema change,
no migration, no data transform.** ERDC adopted it this way with its own
`erdcBlocks` model and 29 seeded pages left byte-identical.

Detection is covered by `pnpm --filter @opendesigns/payload-builder test:schema`:

| | This plugin | A typical existing schema (ERDC) |
|---|---|---|
| Section | `blocks` → `builderSection` | `blocks` → `erdcSection` |
| Rows | `blocks` → `builderRow` | **`array`**, nested inside **tabs** |
| Columns | `array` | `array` |
| Elements | `blocks` named `elements` | `blocks` named **`content`** |
| Column width | select `'1/2'` | **number** `0.5` |

Array-vs-blocks containers, the `_index-0-0` schema-path segments Payload
generates for unnamed tabs, the container name `content` and fractional
numeric widths are all handled. If the shape is not recognised, the canvas
says so and renders Payload's default blocks editor instead of failing.

## Steps (on a branch)

1. **Vendor the package** inside the app (keep it inside the Docker build
   context): copy `packages/builder` to `<app>/packages/payload-builder`, then
   in `package.json`:

   ```json
   "dependencies": { "@opendesigns/payload-builder": "link:packages/payload-builder" }
   ```

   and in `next.config`: `transpilePackages: ['@opendesigns/payload-builder']`.
   `pnpm install`.

2. **Point the layout field at the canvas:**

   ```ts
   {
     name: 'layout',
     type: 'blocks',
     blocks: [MySection],
     admin: { components: { Field: '@opendesigns/payload-builder/client#BuilderField' } },
   }
   ```

3. **Regenerate the import map:** `pnpm payload generate:importmap`.

4. *Optional* — icons/categories for elements, or pin the section block when
   the field holds more than one block type:

   ```ts
   admin: {
     custom: {
       payloadBuilder: {
         sectionBlockSlug: 'mySection',
         elements: [{ slug: 'myHeading', label: 'Heading', category: 'basic' }],
       },
     },
   }
   ```

## Test before merge

1. Open an existing page — the canvas must show its real sections, rows,
   columns and content.
2. Edit one element, save, check the frontend renders identically.
3. Switch locale (e.g. AR) — content still loads; canvas chrome stays LTR.
4. **Form view** — Payload's own editor must still work (escape hatch).

## Rollback

Remove the `admin.components.Field` line and regenerate the import map. The
default blocks UI returns; nothing in the database changed.
