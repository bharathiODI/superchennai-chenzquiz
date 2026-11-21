# Writing custom elements

An element is one file. Define it, pass it to the plugin, done — no plugin
code changes, no schema plumbing.

```ts
elements: [...standardElements, statBlock]
```

## The contract

```ts
import type { ElementDefinition } from '@opendesigns/payload-builder'

export const statBlock: ElementDefinition = {
  slug: 'statBlock',          // camelCase, unique, becomes the blockType
  label: 'Stat Block',        // shown in the add menu and on the canvas chip
  category: 'content',        // groups it in the add menu
  icon: 'counter',            // optional

  // Content tab — ordinary Payload fields, so localization,
  // validation, conditions and rich text all work natively.
  fields: [
    { name: 'value', type: 'text', required: true },
    { name: 'caption', type: 'text', localized: true },
  ],

  // Optional: extra options appended to the shared General tab.
  generalFields: [
    { name: 'emphasis', type: 'select', options: ['normal', 'large'] },
  ],

  // Frontend render — a React Server Component.
  Component: ({ data, locale }) => (
    <div className="stat">
      <strong dir="ltr">{data.value}</strong>
      <span>{data.caption}</span>
    </div>
  ),

  // One-line summary on the canvas chip.
  excerpt: (data) => String(data.value ?? ''),
}
```

That's the whole API. Everything else — Design, Background and Extras tabs,
spacing, responsive overrides, animation, visibility, CSS class/ID, custom
attributes, the wrapper div and its compiled styles — is added for you.

## Rules worth knowing

**Don't add your own spacing or background fields.** Every element already
gets the shared Design and Background tabs. Adding a `padding` field would
duplicate and conflict with them.

**Keep `fields` to content.** Anything about *how it sits on the page* is
already covered. Anything about *what it says* belongs in `fields`.

**Mark translatable fields `localized: true`.** Non-localized fields share
one row across locales; localized fields get one row per locale. Getting
this wrong is the single most common source of bilingual bugs.

**Numerals in RTL.** Wrap numbers, dates and codes in `dir="ltr"` — Arabic
text is RTL but figures should not flip. See `counter` and `progress` for
the pattern.

**`Component` is a server component.** No `useState`, no event handlers. If
you need interactivity, put a `'use client'` component in your project and
import it — or use `<details>`/CSS like the `accordion` element does.

**Sanitise anything raw.** If you render HTML or a URL from the CMS,
validate it. The `icon` element only accepts markup starting with `<svg`;
`button` only accepts `http(s)`, `/`, `#`, `mailto:` and `tel:` URLs;
`video` only accepts YouTube and Vimeo embed hosts. Follow that habit.

**Slug names are permanent.** The slug becomes the `blockType` stored in
every row and the Postgres table name. Renaming one after content exists
needs a migration.

**Keep field names short.** These blocks nest four levels deep and Postgres
caps identifiers at 63 characters. ERDC hit that ceiling in production.
Prefer `pt` over `paddingTop` for anything inside a group.

## Styling

Elements render inside a wrapper carrying the compiled classes and CSS
variables, so your component only needs its own inner markup. Style it in
your site CSS against a class you control (`.stat`), or use the variables
the engine sets (`--pb-color`, `--pb-fs`, …).

## The standard pack

20 elements, as a reference for your own:

| Category | Elements |
|---|---|
| Basic | Heading, Rich Text, Button, Icon, Divider, Spacer |
| Content | Card Row, Icon Box, Accordion/FAQ, Checklist, Testimonial, Counters, Progress Bars, Alert, Table |
| Media | Image, Gallery, Video |
| Interactive | Map, Social Links |

Use them all, subset them, or ignore them:

```ts
import { headingElement, richTextElement } from '@opendesigns/payload-builder/rsc'
elements: [headingElement, richTextElement, myElement]
```
