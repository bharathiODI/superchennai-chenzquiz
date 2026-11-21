'use client'

import type { ClientBlock, ClientField } from 'payload'

/**
 * Schema discovery — what makes the builder generic.
 *
 * The canvas does not assume the plugin's own block names. It walks the
 * layout field's client config and works out, for each level, whether the
 * container is an `array` or a `blocks` field, what it is called, and what
 * schema path Payload will expect for `addFieldRow`.
 *
 * That lets one canvas drive both:
 *   - this plugin's schema: layout(blocks) → builderSection → rows(blocks)
 *     → builderRow → columns(array) → elements(blocks)
 *   - ERDC's existing erdcBlocks: layout(blocks) → erdcSection
 *     → tabs → rows(array) → columns(array) → content(blocks)
 * with no data migration on either side.
 *
 * Schema paths are computed with the same rules as Payload's
 * buildClientFieldSchemaMap/traverseFields + getFieldPaths, including the
 * `_index-N` segments for unnamed rows/collapsibles/tabs, so the Inspector's
 * RenderFields resolves correctly in both shapes.
 */

export type ContainerKind = 'array' | 'blocks'

export interface LevelSchema {
  /** Data-path field name of the container, e.g. 'rows' | 'columns' | 'content'. */
  containerName: string
  kind: ContainerKind
  /** schemaPath to pass to addFieldRow for this container. */
  containerSchemaPath: string
  /** For `blocks` containers with a single item type (section/row wrappers). */
  defaultBlockSlug?: string
  /** All block defs for this container (element level has many). */
  blocks?: ClientBlock[]
  /** Fields of one item — used by the Inspector. */
  itemFields: ClientField[]
  /** schemaPath of one item (block schema path, or the array's own path). */
  itemSchemaPath: string
  /** Name of the next level's container inside this item, if any. */
  childContainerName?: string
}

export interface BuilderSchema {
  section: LevelSchema
  row: LevelSchema
  column: LevelSchema
  element: LevelSchema
  /**
   * Top-level blocks that are NOT the section container.
   *
   * Real projects rarely have a layout made only of sections. ERDC's
   * `pages.layout` holds 24 block types — hero sliders, FAQ blocks, legal
   * content — of which exactly one (`erdcSection`) nests rows and columns.
   * The canvas renders these as flat cards alongside sections so nothing is
   * hidden, and so a page can mix purpose-built blocks with built layouts.
   */
  flatBlocks: ClientBlock[]
}

/* ------------------------------------------------------------------ */
/* Path arithmetic — mirrors payload/dist/fields/getFieldPaths.js       */
/* ------------------------------------------------------------------ */

const isNamed = (f: unknown): f is { name: string } =>
  !!f && typeof f === 'object' && 'name' in f && typeof (f as { name: unknown }).name === 'string'

interface Paths {
  indexPath: string
  schemaPath: string
}

const fieldPaths = (
  field: unknown,
  index: number,
  parentIndexPath: string,
  parentSchemaPath: string,
): Paths => {
  if (isNamed(field)) {
    return {
      indexPath: '',
      schemaPath: parentSchemaPath ? `${parentSchemaPath}.${field.name}` : field.name,
    }
  }
  const indexPath = `${parentIndexPath ? `${parentIndexPath}-` : ''}${index}`
  const indexSuffix = `_index-${indexPath}`
  const segs = parentSchemaPath.split('.')
  const parentUnnamed = segs[segs.length - 1]?.startsWith('_index-')
  return {
    indexPath,
    schemaPath: parentUnnamed
      ? `${parentSchemaPath}-${index}`
      : `${parentSchemaPath ? `${parentSchemaPath}.` : ''}${indexSuffix}`,
  }
}

interface Found {
  field: ClientField
  schemaPath: string
}

/**
 * Depth-first search for a named field, descending through presentational
 * wrappers (row / collapsible / tabs / tab / unnamed group) exactly the way
 * Payload's schema-map builder does, so the returned schemaPath is real.
 */
const findNamed = (
  fields: ClientField[] | undefined,
  names: string[],
  parentSchemaPath: string,
  parentIndexPath = '',
): Found | undefined => {
  if (!fields) return undefined

  for (const [index, field] of fields.entries()) {
    const { indexPath, schemaPath } = fieldPaths(field, index, parentIndexPath, parentSchemaPath)
    const type = (field as { type?: string }).type

    if (isNamed(field) && names.includes(field.name)) {
      return { field, schemaPath }
    }

    switch (type) {
      case 'row':
      case 'collapsible': {
        const hit = findNamed(
          (field as unknown as { fields: ClientField[] }).fields,
          names,
          schemaPath,
          indexPath,
        )
        if (hit) return hit
        break
      }
      case 'group': {
        // Named groups reset the index path; unnamed ones carry it.
        const hit = findNamed(
          (field as unknown as { fields: ClientField[] }).fields,
          names,
          schemaPath,
          isNamed(field) ? '' : indexPath,
        )
        if (hit) return hit
        break
      }
      case 'tabs': {
        const tabs = (field as unknown as { tabs: ClientField[] }).tabs ?? []
        for (const [ti, tab] of tabs.entries()) {
          const tabPaths = fieldPaths(tab, ti, indexPath, schemaPath)
          const hit = findNamed(
            (tab as unknown as { fields: ClientField[] }).fields,
            names,
            tabPaths.schemaPath,
            isNamed(tab) ? '' : tabPaths.indexPath,
          )
          if (hit) return hit
        }
        break
      }
    }
  }
  return undefined
}

/* ------------------------------------------------------------------ */
/* Level construction                                                  */
/* ------------------------------------------------------------------ */

/** Map of registered blocks by slug — ClientConfig.blocksMap in Payload 3.8x. */
export type BlocksMap = Record<string, ClientBlock>

/**
 * Resolves a blocks field's block list.
 *
 * Payload 3.8x deduplicates shared block definitions: when the same block is
 * used in more than one field, the client field carries `blockReferences`
 * (slug strings) resolved through `config.blocksMap`, and `blocks` is empty.
 * ERDC's blocks are shared, so reading only `blocks` saw an empty list and
 * detection failed. This mirrors BlocksField's own
 * `field.blockReferences ?? field.blocks` resolution.
 */
const blocksOf = (field: ClientField | undefined, blocksMap: BlocksMap = {}): ClientBlock[] => {
  const f = field as unknown as {
    blockReferences?: (ClientBlock | string)[]
    blocks?: (ClientBlock | string)[]
  }
  const source = f?.blockReferences ?? f?.blocks ?? []
  return source
    .map((entry) => (typeof entry === 'string' ? blocksMap[entry] : entry))
    .filter((b): b is ClientBlock => Boolean(b))
}

const buildLevel = (
  container: ClientField,
  containerSchemaPath: string,
  childNames: string[],
  preferredBlockSlug?: string,
  blocksMap: BlocksMap = {},
): LevelSchema | undefined => {
  const type = (container as { type?: string }).type
  const containerName = isNamed(container) ? container.name : ''

  if (type === 'array') {
    const itemFields = (container as unknown as { fields: ClientField[] }).fields ?? []
    const child = findNamed(itemFields, childNames, containerSchemaPath)
    return {
      containerName,
      containerSchemaPath,
      itemFields,
      itemSchemaPath: containerSchemaPath,
      kind: 'array',
      childContainerName: child && isNamed(child.field) ? child.field.name : undefined,
    }
  }

  if (type === 'blocks') {
    const blocks = blocksOf(container, blocksMap)
    if (!blocks.length) return undefined
    const chosen =
      (preferredBlockSlug && blocks.find((b) => b.slug === preferredBlockSlug)) ?? blocks[0]
    if (!chosen) return undefined
    const itemSchemaPath = `${containerSchemaPath}.${chosen.slug}`
    const child = findNamed(chosen.fields as ClientField[], childNames, itemSchemaPath)
    return {
      blocks,
      containerName,
      containerSchemaPath,
      defaultBlockSlug: chosen.slug,
      itemFields: (chosen.fields ?? []) as ClientField[],
      itemSchemaPath,
      kind: 'blocks',
      childContainerName: child && isNamed(child.field) ? child.field.name : undefined,
    }
  }

  return undefined
}

/** Names we accept at each level, most specific first. */
const ROW_NAMES = ['rows', 'row']
const COLUMN_NAMES = ['columns', 'cols', 'column']
const ELEMENT_NAMES = ['elements', 'content', 'blocks', 'items']

export interface DetectOptions {
  /** Force a section block slug when the layout field holds several. */
  sectionBlockSlug?: string
  /** ClientConfig.blocksMap — required to resolve shared block references. */
  blocksMap?: BlocksMap
}

/**
 * Derives the four levels from the layout field's client config.
 * Returns null when the field isn't a recognisable builder layout — the
 * canvas then falls back to Payload's default blocks UI.
 */
/**
 * Picks the section block: the explicitly configured one, otherwise the
 * first block that actually nests rows → columns → elements. Scanning for
 * structure rather than assuming block 0 is what lets the canvas find
 * `erdcSection` among 23 flat siblings.
 */
const findSectionSlug = (
  layoutField: ClientField,
  layoutSchemaPath: string,
  preferred?: string,
  blocksMap: BlocksMap = {},
): string | undefined => {
  const blocks = blocksOf(layoutField, blocksMap)
  if (preferred && blocks.some((b) => b.slug === preferred)) return preferred

  for (const block of blocks) {
    const itemSchemaPath = `${layoutSchemaPath}.${block.slug}`
    const rows = findNamed(block.fields as ClientField[], ROW_NAMES, itemSchemaPath)
    if (!rows) continue
    const rowLevel = buildLevel(rows.field, rows.schemaPath, COLUMN_NAMES, undefined, blocksMap)
    if (!rowLevel?.childContainerName) continue
    const cols = findNamed(rowLevel.itemFields, COLUMN_NAMES, rowLevel.itemSchemaPath)
    if (!cols) continue
    const colLevel = buildLevel(cols.field, cols.schemaPath, ELEMENT_NAMES, undefined, blocksMap)
    if (colLevel?.childContainerName) return block.slug
  }
  return undefined
}

/** Populated by detectBuilderSchema on failure, so the fallback can say why. */
export let lastDetectFailure = ''

export const detectBuilderSchema = (
  layoutField: ClientField,
  layoutSchemaPath: string,
  options: DetectOptions = {},
): BuilderSchema | null => {
  const blocksMap = options.blocksMap ?? {}
  lastDetectFailure = ''

  const all = blocksOf(layoutField, blocksMap)
  if (!all.length) {
    const f = layoutField as unknown as { blockReferences?: unknown[]; blocks?: unknown[] }
    lastDetectFailure =
      `no blocks resolved (blocks: ${f?.blocks?.length ?? 0}, ` +
      `blockReferences: ${f?.blockReferences?.length ?? 0}, ` +
      `blocksMap entries: ${Object.keys(blocksMap).length})`
    return null
  }

  const sectionSlug = findSectionSlug(layoutField, layoutSchemaPath, options.sectionBlockSlug, blocksMap)
  if (!sectionSlug) {
    lastDetectFailure = `no section-shaped block among: ${all.map((b) => b.slug).join(', ')}`
    return null
  }

  const section = buildLevel(layoutField, layoutSchemaPath, ROW_NAMES, sectionSlug, blocksMap)
  if (!section?.childContainerName) return null

  const rowsFound = findNamed(section.itemFields, [section.childContainerName], section.itemSchemaPath)
  if (!rowsFound) return null
  const row = buildLevel(rowsFound.field, rowsFound.schemaPath, COLUMN_NAMES, undefined, blocksMap)
  if (!row?.childContainerName) return null

  const colsFound = findNamed(row.itemFields, [row.childContainerName], row.itemSchemaPath)
  if (!colsFound) return null
  const column = buildLevel(colsFound.field, colsFound.schemaPath, ELEMENT_NAMES, undefined, blocksMap)
  if (!column?.childContainerName) return null

  const elsFound = findNamed(column.itemFields, [column.childContainerName], column.itemSchemaPath)
  if (!elsFound) return null
  const elementContainer = elsFound.field
  if ((elementContainer as { type?: string }).type !== 'blocks') return null

  const element: LevelSchema = {
    blocks: blocksOf(elementContainer, blocksMap),
    containerName: isNamed(elementContainer) ? elementContainer.name : '',
    containerSchemaPath: elsFound.schemaPath,
    itemFields: [],
    itemSchemaPath: elsFound.schemaPath,
    kind: 'blocks',
  }

  const flatBlocks = blocksOf(layoutField, blocksMap).filter((b) => b.slug !== sectionSlug)

  return { column, element, flatBlocks, row, section }
}

/** Looks up a top-level flat block definition by slug. */
export const flatBlock = (schema: BuilderSchema, slug: string | undefined): ClientBlock | undefined =>
  slug ? schema.flatBlocks.find((b) => b.slug === slug) : undefined

/** Fields of one element block, for the Inspector. */
export const elementBlock = (schema: BuilderSchema, slug: string | undefined): ClientBlock | undefined =>
  slug ? schema.element.blocks?.find((b) => b.slug === slug) : undefined

/** Structural children are edited on the canvas, not in the settings modal. */
export const withoutChild = (
  fields: ClientField[] | undefined,
  childName: string | undefined,
): ClientField[] => {
  if (!fields) return []
  if (!childName) return fields
  const strip = (list: ClientField[]): ClientField[] =>
    list
      .filter((f) => !(isNamed(f) && f.name === childName))
      .map((f) => {
        const type = (f as { type?: string }).type
        if (type === 'row' || type === 'collapsible') {
          const inner = (f as unknown as { fields: ClientField[] }).fields
          return { ...f, fields: strip(inner ?? []) } as ClientField
        }
        if (type === 'tabs') {
          const tabs = (f as unknown as { tabs: { fields: ClientField[] }[] }).tabs ?? []
          return {
            ...f,
            tabs: tabs.map((t) => ({ ...t, fields: strip(t.fields ?? []) })),
          } as unknown as ClientField
        }
        return f
      })
  return strip(fields)
}
