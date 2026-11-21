import type { Block, Field } from 'payload'
import type React from 'react'

export type { Field }

/**
 * Data shape of the style controls attached to every node
 * (section / row / column / element). Produced by the fields in
 * `fields/common.ts`, consumed by `style/engine.ts`.
 */
export interface StyleControls {
  cssClass?: string | null
  cssId?: string | null
  attrs?: { key?: string | null; value?: string | null; id?: string | null }[] | null
  hide?: {
    desktop?: boolean | null
    tablet?: boolean | null
    mobile?: boolean | null
  } | null
  spacing?: {
    marginTop?: string | null
    marginBottom?: string | null
    paddingTop?: string | null
    paddingBottom?: string | null
    paddingLeft?: string | null
    paddingRight?: string | null
  } | null
  background?: {
    type?: 'none' | 'color' | 'image' | null
    color?: string | null
    image?: unknown
    overlay?: string | null
  } | null
  border?: {
    width?: string | null
    color?: string | null
    radius?: string | null
  } | null
  animation?: {
    preset?: 'none' | 'fade' | 'fade-up' | 'fade-down' | 'zoom' | null
    duration?: number | null
    delay?: number | null
  } | null
}

export type ColumnWidth =
  | '1/1' | '1/2' | '1/3' | '2/3' | '1/4' | '3/4' | '1/5' | '2/5' | '3/5' | '4/5' | '1/6' | '5/6' | 'auto'

export interface ColumnData extends StyleControls {
  id?: string | null
  width?: ColumnWidth | null
  elements?: ElementData[] | null
}

export interface ElementData extends StyleControls {
  id?: string | null
  blockType: string
  [key: string]: unknown
}

export interface RowData extends StyleControls {
  id?: string | null
  blockType: 'builderRow'
  label?: string | null
  columns?: ColumnData[] | null
}

export interface SectionData extends StyleControls {
  id?: string | null
  blockType: 'builderSection'
  label?: string | null
  widthMode?: 'contained' | 'full' | null
  rows?: RowData[] | null
}

/** Props every element render component receives on the frontend. */
export interface ElementComponentProps<TData = Record<string, unknown>> {
  data: TData & ElementData
  locale: string
}

/**
 * An element definition — the unit of extension, like an Elementor widget.
 * `fields` are ordinary Payload fields, so localization and validation
 * stay native. `Component` is a React Server Component rendering the
 * element on the frontend.
 */
export interface ElementDefinition {
  slug: string
  label: string
  /** Lucide-style icon name used by the canvas chip (falls back to a generic icon). */
  icon?: string
  category?: 'basic' | 'content' | 'media' | 'interactive' | 'layout' | (string & {})
  /** The element's own content fields — rendered as the Content tab. */
  fields: Field[]
  /** Extra layout options appended to the shared General tab. */
  generalFields?: Field[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: React.ComponentType<ElementComponentProps<any>>
  /** One-line grey excerpt shown on the canvas chip. */
  excerpt?: (data: ElementData, locale: string) => string
  /** Extra Payload block config merged into the generated element block. */
  blockOverrides?: Partial<Block>
}

export interface BuilderCollectionTarget {
  slug: string
  /** Name of the layout field to inject. Default: `layout`. */
  fieldName?: string
  /** Localize element content fields. Default: true. */
  localized?: boolean
}

export interface BuilderLayoutsOptions {
  sectionsSlug?: string
  layoutsSlug?: string
}

export interface BuilderScaffoldOptions {
  pagesSlug?: string
  mediaSlug?: string
  usersSlug?: string
  /** Absolute path for local media uploads. Omit when using cloud storage. */
  mediaDir?: string
  /** Set false to skip Posts, Categories and Tags. Default: true. */
  blog?: boolean
}

export interface BuilderSettingsOptions {
  /** Set false to skip the UI Strings global. Default: true. */
  uiStrings?: boolean
  /** Set false to skip the Menus global. Default: true. */
  menus?: boolean
  /** Collections menu items may link to. */
  linkableCollections?: string[]
  /** Project-specific UI string groups appended to the defaults. */
  extraStringGroups?: { fields: Field[]; label: string; name: string }[]
}

/**
 * Multilingual configuration. Omit it entirely for a single-language
 * project — every plugin field then drops `localized`, giving a clean
 * single-column schema with nothing to turn off later.
 */
export interface BuilderI18nOptions {
  locales: string[]
  defaultLocale?: string
  /** Locale codes that render right-to-left. */
  rtl?: string[]
  /** Display names, e.g. { en: 'English', ar: 'العربية' } */
  labels?: Record<string, string>
  fallback?: boolean
}

export interface BuilderPluginOptions {
  /** Collections that receive the builder layout field. Optional when scaffolding. */
  collections?: (string | BuilderCollectionTarget)[]
  /** Element definitions available in the builder. */
  elements: ElementDefinition[]
  /** Set false to keep Payload's default blocks UI (no canvas). Default: true. */
  enableCanvas?: boolean
  /** Disable the plugin without removing the field schema (keeps migrations stable). */
  enabled?: boolean
  /**
   * Adds the Layouts collections — reusable layout sections plus
   * conditional assignment (Avada Layouts model). Default: false.
   */
  layouts?: boolean | BuilderLayoutsOptions
  /**
   * Creates the standard content model: Users, Media, Pages and
   * (optionally) Posts, Categories, Tags. Existing collections with the
   * same slug are left alone. Default: false.
   */
  scaffold?: boolean | BuilderScaffoldOptions
  /**
   * Adds Site Settings, UI Strings and Menus globals. Default: false.
   */
  settings?: boolean | BuilderSettingsOptions
  /** Multilingual setup. Omit for a single-language project. */
  i18n?: BuilderI18nOptions
}

/** Serializable element metadata passed to client canvas components. */
export interface ElementMeta {
  slug: string
  label: string
  icon?: string
  category?: string
}
