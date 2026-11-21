# Layouts

The Avada Layouts model, in Payload. Enable it with one option:

```ts
builderPlugin({
  collections: ['pages'],
  elements: standardElements,
  layouts: true,
})
```

That adds two collections under a **Layouts** admin group.

## Layout Sections

Reusable chunks built with the same canvas — a header, a footer, a page
title bar, a CTA band. Each is tagged with the slot it's meant for, which
filters the pickers on the Layouts screen.

## Layouts

A Layout assigns sections to four slots and says *where* it applies.

| Slot | Typical use |
|---|---|
| `header` | Site header / navigation |
| `pageTitle` | Page title bar, breadcrumbs |
| `content` | Usually empty — the page's own layout renders |
| `footer` | Site footer |

**Global layout.** Tick *Global layout* on one document. It applies
everywhere nothing more specific matches. This is your site-wide header and
footer.

**Conditions.** Any other layout applies when **any** of its conditions
match:

- **Whole collection** — every document in `pages`
- **Specific page (by slug)** — one page
- **Path starts with** — e.g. `/news` covers the whole news tree
- **Locale** — e.g. a different header for `ar`

## How a layout is chosen

1. Every non-global layout whose conditions match is a candidate.
2. Candidates sort by **priority** (higher first), then by **specificity**:
   slug (40) > path prefix (30) > locale (20) > collection (10).
3. The winner fills the slots it defines.
4. **Any slot it leaves empty falls back to the global layout.**

Step 4 is the useful part. A "News" layout can override only the page title
bar and still inherit the global header and footer — you don't restate the
whole layout to change one band.

## Rendering

```tsx
import { resolveBuilderLayout, sectionLayout } from '@opendesigns/payload-builder'
import { BuilderRenderer, BuilderAnimations } from '@opendesigns/payload-builder/rsc'

const layout = await resolveBuilderLayout({
  payload, collection: 'pages', slug, path, locale,
})

<BuilderRenderer layout={sectionLayout(layout.header)} registry={registry} locale={locale} />
<main>
  <BuilderRenderer
    layout={layout.content ? sectionLayout(layout.content) : page.layout}
    registry={registry}
    locale={locale}
  />
</main>
<BuilderRenderer layout={sectionLayout(layout.footer)} registry={registry} locale={locale} />
<BuilderAnimations />
```

`dev/src/app/(frontend)/[[...slug]]/page.tsx` is a working example.

`layout.matchedTitle` tells you which layout won — useful when a page
renders with an unexpected header.

## Notes

- `resolveBuilderLayout` runs one query per request, with `depth: 3` so
  sections arrive populated. Cache it if your traffic warrants.
- Layout sections support drafts, so a header can be revised and previewed
  before publishing.
- Sections are localized like any other builder content — an Arabic header
  is the same document with Arabic field values, not a separate one.
