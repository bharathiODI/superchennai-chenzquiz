# Vendored copy of @opendesigns/payload-builder 0.2.0

Installed through `"@opendesigns/payload-builder": "file:packages/payload-builder"` in the app's
package.json and compiled by Next (`transpilePackages` in next.config.js).

Changes from the 0.2.0 tarball, and nothing else:

1. `package.json`: `devDependencies` and `scripts` removed. With them, `npm install` put a second
   React and Next inside this folder, which breaks hooks in the admin canvas.
2. `// @ts-nocheck` added as the first line of the files that fail this app's stricter tsconfig
   (`noUncheckedIndexedAccess`, `noImplicitOverride`): client/ColumnLayoutPicker.tsx,
   client/Inspector.tsx, client/forms/SubmissionFiles.tsx, client/sectionClipboard.ts,
   forms/rateLimit.ts, globals/uiStrings.ts, layouts/resolve.ts, plugin.ts, sync/htmlToLexical.ts.
   No runtime change.
3. `src/client/utils.ts`: the canvas chip excerpt skips the style-option keys (align, spacing,
   background, ...), so a section shows its title instead of a default like "inherit".

To update the kit: replace `src/` and the docs with the new version, redo the changes above,
then run `npm install`, `npm run generate:importmap` and generate a migration if the block schema
changed.

How chenzquiz uses it: see `src/builder/` (element list, frontend registry, renderer) and the
Page Builder tab in `src/collections/Pages/index.ts`.
