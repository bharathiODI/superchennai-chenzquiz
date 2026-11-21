'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  BlocksField,
  DraggableSortable,
  DraggableSortableItem,
  toast,
  useAllFormFields,
  useConfig,
  useDocumentInfo,
  useForm,
  useFormModified,
} from '@payloadcms/ui'
import type { BlocksFieldClientComponent, ClientField } from 'payload'
import type { ColumnWidth, ElementMeta } from '../types'
import { COLUMN_FRACTIONS } from '../style/engine'
import { AddBlockMenu } from './AddBlockMenu'
import { AddElementMenu } from './AddElementMenu'
import { ColumnLayoutPicker } from './ColumnLayoutPicker'
import { Inspector } from './Inspector'
import { buildClipboardEntry, type ClipboardEntry } from './clipboard'
import {
  clearSectionClip,
  copySection,
  pasteSection,
  readSectionClip,
  subscribeSectionClip,
  type ApiContext,
  type SectionClip,
} from './sectionClipboard'
import {
  detectBuilderSchema,
  elementBlock,
  flatBlock,
  lastDetectFailure,
  withoutChild,
  type LevelSchema,
} from './schema'
import { excerptOf, SECTION_HUES, type Selection } from './utils'
import './canvas.css'

/**
 * BuilderField — backend-builder canvas.
 *
 * Schema-agnostic: every container name, kind (array vs blocks) and schema
 * path comes from `detectBuilderSchema`, so the same canvas drives this
 * plugin's blocks schema and a project's existing one (e.g. ERDC's
 * erdcSection → rows[] → columns[] → content[]) with no data migration.
 *
 * Document data lives exclusively in Payload form state; this component
 * holds only UI state (selection, collapse, menus, clipboard).
 */

interface MenuState {
  columnPath: string
  x: number
  y: number
}

const keyOf = (id: string | null | undefined, fallback: string): string => id ?? fallback

const asArray = (value: unknown): Record<string, unknown>[] =>
  Array.isArray(value) ? (value as Record<string, unknown>[]) : []

const idOf = (node: Record<string, unknown>): string | undefined =>
  typeof node.id === 'string' ? node.id : undefined

/** Block labels come from the config; fall back to a readable slug. */
const blockLabel = (
  block: { labels?: { singular?: unknown } } | undefined,
  slug: string | undefined,
): string => {
  const singular = block?.labels?.singular
  if (typeof singular === 'string' && singular) return singular
  if (!slug) return 'Block'
  return slug
    .replace(/^erdc/, '')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, (c) => c.toUpperCase())
    .trim()
}

export const BuilderField: BlocksFieldClientComponent = (props) => {
  const { field, path: pathFromProps, permissions, readOnly, schemaPath: schemaPathFromProps } = props
  const path = pathFromProps ?? field.name
  const schemaPath = schemaPathFromProps ?? field.name

  const { addFieldRow, dispatchFields, getDataByPath, moveFieldRow, removeFieldRow, setModified } =
    useForm()
  const [formFields] = useAllFormFields()
  const { config } = useConfig()

  const builderCustom = useMemo(() => {
    const custom = (config.admin?.custom ?? {}) as {
      payloadBuilder?: { elements?: ElementMeta[]; sectionBlockSlug?: string }
    }
    return custom.payloadBuilder ?? {}
  }, [config])

  /** Discovered once per field config — this is what makes the canvas generic. */
  const schema = useMemo(
    () =>
      detectBuilderSchema(field as unknown as ClientField, schemaPath, {
        // Shared block definitions arrive as slug references resolved
        // through the config's blocksMap (Payload 3.8x deduplication).
        blocksMap: (config as unknown as { blocksMap?: Record<string, never> }).blocksMap ?? {},
        sectionBlockSlug: builderCustom.sectionBlockSlug,
      }),
    [field, schemaPath, builderCustom.sectionBlockSlug, config],
  )

  /** Element list for the add menu: registry metadata if present, else block labels. */
  const elementsMeta: ElementMeta[] = useMemo(() => {
    if (builderCustom.elements?.length) return builderCustom.elements
    return (schema?.element.blocks ?? []).map((b) => ({
      category: 'basic',
      label:
        (typeof b.labels?.singular === 'string' ? b.labels.singular : undefined) ?? b.slug,
      slug: b.slug,
    }))
  }, [builderCustom.elements, schema])

  const sections = useMemo(
    () => asArray(getDataByPath(path)),
    // formFields is the change signal; getDataByPath is stable but its result is not
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getDataByPath, path, formFields],
  )

  const [view, setView] = useState<'canvas' | 'form'>('canvas')
  const [selection, setSelection] = useState<Selection | null>(null)
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())
  const [menu, setMenu] = useState<MenuState | null>(null)
  const [rowPicker, setRowPicker] = useState<{ sectionIndex: number } | null>(null)
  const [blockPicker, setBlockPicker] = useState<{ index?: number } | null>(null)
  const [clipboard, setClipboard] = useState<ClipboardEntry | null>(null)

  /* ---------------- cross-page section clipboard ---------------------- */

  const { collectionSlug, id: docId } = useDocumentInfo()
  const modified = useFormModified()
  const [sectionClip, setSectionClip] = useState<SectionClip | null>(null)
  const [clipBusy, setClipBusy] = useState(false)

  useEffect(() => {
    const sync = () => setSectionClip(readSectionClip())
    sync()
    return subscribeSectionClip(sync)
  }, [])

  const apiCtx: ApiContext | null = useMemo(() => {
    if (!collectionSlug) return null
    const c = config as unknown as {
      localization?: false | { defaultLocale?: string; locales?: ({ code: string } | string)[] }
      routes?: { api?: string }
      serverURL?: string
    }
    const codes = c.localization
      ? (c.localization.locales ?? []).map((l) => (typeof l === 'string' ? l : l.code))
      : []
    const def = c.localization ? c.localization.defaultLocale : undefined
    const ordered = def ? [def, ...codes.filter((x) => x !== def)] : codes
    return {
      apiBase: `${c.serverURL ?? ''}${c.routes?.api ?? '/api'}`,
      collection: collectionSlug,
      locales: ordered,
    }
  }, [collectionSlug, config])

  /** Block types this field accepts — a clip of any other type can't be pasted. */
  const acceptedTypes = useMemo(
    () =>
      new Set(
        [schema?.section.defaultBlockSlug, ...(schema?.flatBlocks ?? []).map((b) => b.slug)].filter(
          Boolean,
        ) as string[],
      ),
    [schema],
  )
  const canPasteClip = Boolean(
    sectionClip &&
      apiCtx &&
      docId &&
      sectionClip.collection === apiCtx.collection &&
      (!sectionClip.blockType || acceptedTypes.has(sectionClip.blockType)),
  )

  const copySectionAt = useCallback(
    async (si: number, label: string) => {
      if (!apiCtx || !docId) {
        toast.error('Save the page first, then copy the section.')
        return
      }
      const blockId = sections[si] ? idOf(sections[si]) : undefined
      if (!blockId) {
        toast.error('Save the page first, then copy the section.')
        return
      }
      if (
        modified &&
        !window.confirm(
          'This page has unsaved changes. The copy is taken from the last saved version.\n\nCopy anyway?',
        )
      ) {
        return
      }
      setClipBusy(true)
      try {
        await copySection(apiCtx, { blockId, docId, fieldPath: path, label })
        toast.success(`"${label}" copied — open any page and use "Paste section".`)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Copy failed.')
      } finally {
        setClipBusy(false)
      }
    },
    [apiCtx, docId, modified, path, sections],
  )

  const pasteSectionAt = useCallback(
    async (index: number) => {
      if (!sectionClip || !apiCtx || !docId) return
      if (modified) {
        window.alert(
          'Save this page first — pasting reloads the editor, so unsaved changes would be lost.',
        )
        return
      }
      setClipBusy(true)
      try {
        await pasteSection(apiCtx, { clip: sectionClip, docId, fieldPath: path, index })
        toast.success('Section pasted as a draft — reloading…')
        window.location.reload()
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Paste failed.')
        setClipBusy(false)
      }
    },
    [apiCtx, docId, modified, path, sectionClip],
  )

  /** Small "paste here" control shown beside each insert point. */
  const pasteHere = (index: number) =>
    canPasteClip && !readOnly ? (
      <button
        className="pb-insert__btn pb-insert__btn--paste"
        disabled={clipBusy}
        onClick={() => pasteSectionAt(index)}
        title={`Paste "${sectionClip?.label}" here`}
        type="button"
      >
        ⎘
      </button>
    ) : null

  /* ---------------- generic add helpers ------------------------------- */

  /** One call shape for both array and blocks containers. */
  const addTo = useCallback(
    (
      level: LevelSchema,
      dataPath: string,
      opts: { rowIndex?: number; blockType?: string; subFieldState?: unknown } = {},
    ) => {
      addFieldRow({
        blockType: level.kind === 'blocks' ? (opts.blockType ?? level.defaultBlockSlug) : undefined,
        path: dataPath,
        rowIndex: opts.rowIndex,
        schemaPath: level.containerSchemaPath,
        subFieldState: opts.subFieldState as never,
      })
    },
    [addFieldRow],
  )

  const addSection = useCallback(
    (index?: number) => {
      if (!schema) return
      addTo(schema.section, path, { rowIndex: index })
    },
    [addTo, path, schema],
  )

  /** Adds one of the project's purpose-built top-level blocks. */
  const addFlatBlock = useCallback(
    (slug: string, index?: number) => {
      if (!schema) return
      addTo(schema.section, path, { blockType: slug, rowIndex: index })
      setBlockPicker(null)
    },
    [addTo, path, schema],
  )

  /**
   * Adds a row then one column per chosen width.
   *
   * The column dispatches must wait for the row to land in form state:
   * `addFieldRow` is a reducer dispatch, so the new row is not addressable
   * by path until React commits it. Firing them in the same tick silently
   * produced rows with zero columns.
   */
  const addRowWithLayout = useCallback(
    (sectionIndex: number, widths: ColumnWidth[]) => {
      if (!schema) return
      const rowsName = schema.section.childContainerName
      const colsName = schema.row.childContainerName
      if (!rowsName || !colsName) return

      const rowsPath = `${path}.${sectionIndex}.${rowsName}`
      const rowIndex = asArray(getDataByPath(rowsPath)).length
      addTo(schema.row, rowsPath)
      setRowPicker(null)

      const columnsPath = `${rowsPath}.${rowIndex}.${colsName}`
      widths.forEach((width, i) => {
        setTimeout(() => {
          addTo(schema.column, columnsPath, {
            rowIndex: i,
            subFieldState: { width: { initialValue: width, valid: true, value: width } },
          })
        }, 0)
      })
    },
    [addTo, getDataByPath, path, schema],
  )

  const addColumn = useCallback(
    (rowPath: string) => {
      if (!schema?.row.childContainerName) return
      addTo(schema.column, `${rowPath}.${schema.row.childContainerName}`)
    },
    [addTo, schema],
  )

  const addElement = useCallback(
    (columnPath: string, blockType: string) => {
      if (!schema?.column.childContainerName) return
      addTo(schema.element, `${columnPath}.${schema.column.childContainerName}`, { blockType })
      setMenu(null)
    },
    [addTo, schema],
  )

  const move = useCallback(
    (listPath: string, from: number, to: number, count: number) => {
      if (to < 0 || to >= count || from === to) return
      moveFieldRow({ moveFromIndex: from, moveToIndex: to, path: listPath })
      setSelection(null)
    },
    [moveFieldRow],
  )

  const remove = useCallback(
    (listPath: string, index: number) => {
      removeFieldRow({ path: listPath, rowIndex: index })
      setSelection(null)
    },
    [removeFieldRow],
  )

  /** Payload's own action — handles ids and nested state correctly. */
  const duplicate = useCallback(
    (listPath: string, index: number) => {
      dispatchFields({ type: 'DUPLICATE_ROW', path: listPath, rowIndex: index })
      setModified(true)
    },
    [dispatchFields, setModified],
  )

  const copyElement = useCallback(
    (elPath: string, blockType: string | undefined, label: string) => {
      setClipboard(buildClipboardEntry(formFields, elPath, blockType, label))
    },
    [formFields],
  )

  const pasteElement = useCallback(
    (columnPath: string) => {
      if (!clipboard || !schema?.column.childContainerName) return
      addTo(schema.element, `${columnPath}.${schema.column.childContainerName}`, {
        blockType: clipboard.blockType,
        subFieldState: clipboard.subFieldState,
      })
      setMenu(null)
    },
    [addTo, clipboard, schema],
  )

  const toggleCollapse = useCallback((key: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  /* ---------------- inspector wiring ---------------------------------- */

  const inspector = useMemo(() => {
    if (!selection || !schema) return null
    switch (selection.kind) {
      case 'section':
        return {
          crumb: 'Section settings',
          fields: withoutChild(schema.section.itemFields, schema.section.childContainerName),
          parentSchemaPath: schema.section.itemSchemaPath,
        }
      case 'row':
        return {
          crumb: 'Row settings',
          fields: withoutChild(schema.row.itemFields, schema.row.childContainerName),
          parentSchemaPath: schema.row.itemSchemaPath,
        }
      case 'column':
        return {
          crumb: 'Column settings',
          fields: withoutChild(schema.column.itemFields, schema.column.childContainerName),
          parentSchemaPath: schema.column.itemSchemaPath,
        }
      case 'element': {
        const block = elementBlock(schema, selection.blockSlug)
        const label = elementsMeta.find((e) => e.slug === selection.blockSlug)?.label
        return {
          crumb: `${label ?? selection.blockSlug ?? 'Element'} settings`,
          fields: (block?.fields ?? []) as ClientField[],
          parentSchemaPath: `${schema.element.containerSchemaPath}.${selection.blockSlug ?? ''}`,
        }
      }
      case 'block': {
        const block = flatBlock(schema, selection.blockSlug)
        return {
          crumb: `${blockLabel(block, selection.blockSlug)} settings`,
          fields: (block?.fields ?? []) as ClientField[],
          parentSchemaPath: `${schema.section.containerSchemaPath}.${selection.blockSlug ?? ''}`,
        }
      }
    }
  }, [selection, schema, elementsMeta])

  /* ---------------- render -------------------------------------------- */

  // Unrecognised layout shape — fall back rather than render a broken canvas.
  if (!schema) {
    return (
      <div className="pb-canvas">
        <div className="pb-canvas__note">
          This field&rsquo;s structure was not recognised as a builder layout, so the standard editor
          is shown instead. The builder expects sections → rows → columns → elements.
          {lastDetectFailure ? <> Diagnostic: {lastDetectFailure}.</> : null}
        </div>
        <BlocksField {...props} />
      </div>
    )
  }

  if (view === 'form') {
    return (
      <div className="pb-canvas">
        <div className="pb-canvas__bar">
          <span className="pb-canvas__bar-title">{field.label?.toString() ?? 'Layout'}</span>
          <button type="button" className="pb-btn" onClick={() => setView('canvas')}>
            ← Back to builder
          </button>
        </div>
        <BlocksField {...props} />
      </div>
    )
  }

  const rowsName = schema.section.childContainerName as string
  const colsName = schema.row.childContainerName as string
  const elsName = schema.column.childContainerName as string

  const spanOf = (col: Record<string, unknown>): number => {
    const width = col.width as ColumnWidth | undefined
    if (width && width !== 'auto' && COLUMN_FRACTIONS[width] != null) {
      return Math.round(COLUMN_FRACTIONS[width] * 5)
    }
    // Projects may store width as a number fraction (ERDC uses 0–1 values).
    if (typeof col.width === 'number' && col.width > 0 && col.width <= 1) {
      return Math.round(col.width * 60)
    }
    return 60
  }

  const widthLabel = (col: Record<string, unknown>): string => {
    if (typeof col.width === 'string') return col.width
    if (typeof col.width === 'number') return `${Math.round(col.width * 100)}%`
    return 'auto'
  }

  return (
    <div className="pb-canvas">
      <div className="pb-canvas__bar">
        <span className="pb-canvas__bar-title">{field.label?.toString() ?? 'Layout'}</span>
        {clipboard && (
          <span className="pb-canvas__clip" title="An element is on the clipboard">
            📋 {clipboard.label}
            <button
              type="button"
              className="pb-btn pb-btn--ghost pb-btn--icon"
              onClick={() => setClipboard(null)}
              aria-label="Clear clipboard"
            >
              ✕
            </button>
          </span>
        )}
        {sectionClip && (
          <span
            className="pb-canvas__clip pb-canvas__clip--section"
            title={`Copied from "${sectionClip.sourceTitle ?? 'a page'}" — English and Arabic included`}
          >
            📋 Section: {sectionClip.label}
            {sectionClip.sourceTitle ? (
              <span className="pb-canvas__clip-src"> · from {sectionClip.sourceTitle}</span>
            ) : null}
            {canPasteClip && !readOnly && (
              <button
                type="button"
                className="pb-btn pb-btn--primary"
                disabled={clipBusy}
                onClick={() => pasteSectionAt(sections.length)}
                title="Paste at the end of this page (saved as a draft)"
              >
                {clipBusy ? 'Working…' : 'Paste section'}
              </button>
            )}
            {!canPasteClip && docId && (
              <span className="pb-canvas__clip-src"> · can’t be pasted here</span>
            )}
            {!docId && <span className="pb-canvas__clip-src"> · save this page first to paste</span>}
            <button
              type="button"
              className="pb-btn pb-btn--ghost pb-btn--icon"
              onClick={() => clearSectionClip()}
              aria-label="Clear section clipboard"
            >
              ✕
            </button>
          </span>
        )}
        <button
          type="button"
          className="pb-btn"
          onClick={() => setView('form')}
          title="Edit with the standard Payload form"
        >
          Form view
        </button>
        {!readOnly && schema.flatBlocks.length > 0 && (
          <button className="pb-btn" onClick={() => setBlockPicker({})} type="button">
            + Add block
          </button>
        )}
        {!readOnly && (
          <button type="button" className="pb-btn pb-btn--primary" onClick={() => addSection()}>
            + Add section
          </button>
        )}
      </div>

      {sections.length === 0 && (
        <div className="pb-empty">
          <div>
            Nothing here yet. Add a <strong>section</strong> to build a layout from rows and columns,
            or a ready-made <strong>block</strong>.
          </div>
          {!readOnly && (
            <div className="pb-empty__actions">
              <button type="button" className="pb-btn pb-btn--primary" onClick={() => addSection()}>
                + Add section
              </button>
              {schema.flatBlocks.length > 0 && (
                <button className="pb-btn" onClick={() => setBlockPicker({})} type="button">
                  + Add block
                </button>
              )}
            </div>
          )}
        </div>
      )}

      <DraggableSortable
        ids={sections.map((s, i) => keyOf(idOf(s), `sec-${i}`))}
        onDragEnd={({ moveFromIndex, moveToIndex }) =>
          move(path, moveFromIndex, moveToIndex, sections.length)
        }
      >
        {sections.map((section, si) => {
          const sectionPath = `${path}.${si}`
          const sectionId = keyOf(idOf(section), `sec-${si}`)
          const hue = SECTION_HUES[si % SECTION_HUES.length]
          const isCollapsed = collapsed.has(sectionPath)
          const rows = asArray(section[rowsName])
          const label = (section.label as string) || (section.blockName as string) || `Section ${si + 1}`
          const slug = section.blockType as string | undefined

          /* A purpose-built top-level block rather than a section: render a
             flat card. Its own fields open in the settings modal. */
          if (slug && slug !== schema.section.defaultBlockSlug) {
            const def = flatBlock(schema, slug)
            const name = blockLabel(def, slug)
            return (
              <DraggableSortableItem key={sectionId} id={sectionId}>
                {({ attributes, listeners, setNodeRef, transform, transition }) => (
                  <div ref={setNodeRef} style={{ transform, transition } as React.CSSProperties}>
                    {!readOnly && (
                      <div className="pb-insert">
                        <div className="pb-insert__line" />
                        <button
                          className="pb-insert__btn"
                          onClick={() => setBlockPicker({ index: si })}
                          title="Insert here"
                          type="button"
                        >
                          +
                        </button>
                        {pasteHere(si)}
                        <div className="pb-insert__line" />
                      </div>
                    )}
                    <div
                      className={`pb-block${selection?.path === sectionPath ? ' pb-block--selected' : ''}`}
                      onClick={() =>
                        setSelection({
                          blockSlug: slug,
                          index: si,
                          kind: 'block',
                          listPath: path,
                          path: sectionPath,
                        })
                      }
                    >
                      {!readOnly && (
                        <span
                          className="pb-grip"
                          onClick={(e) => e.stopPropagation()}
                          title="Drag to reorder"
                          {...attributes}
                          {...listeners}
                        >
                          ⠿
                        </span>
                      )}
                      <span className="pb-block__icon">{name.slice(0, 1)}</span>
                      <span className="pb-block__label">{name}</span>
                      <span className="pb-block__excerpt">{excerptOf(section)}</span>
                      {!readOnly && (
                        <span className="pb-block__actions" onClick={(e) => e.stopPropagation()}>
                          <button
                            className="pb-btn pb-btn--icon pb-btn--ghost"
                            disabled={clipBusy}
                            onClick={() => copySectionAt(si, name)}
                            title="Copy — paste on any page (English and Arabic)"
                            type="button"
                          >
                            ⎘
                          </button>
                          <button
                            className="pb-btn pb-btn--icon pb-btn--ghost"
                            onClick={() => duplicate(path, si)}
                            title="Duplicate"
                            type="button"
                          >
                            ⧉
                          </button>
                          <button
                            className="pb-btn pb-btn--icon pb-btn--ghost pb-btn--danger"
                            onClick={() => remove(path, si)}
                            title="Delete"
                            type="button"
                          >
                            🗑
                          </button>
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </DraggableSortableItem>
            )
          }

          return (
            <DraggableSortableItem key={sectionId} id={sectionId}>
              {({ attributes, listeners, setNodeRef, transform, transition }) => (
                <div ref={setNodeRef} style={{ transform, transition } as React.CSSProperties}>
                  {!readOnly && (
                    <div className="pb-insert">
                      <div className="pb-insert__line" />
                      <button
                        type="button"
                        className="pb-insert__btn"
                        title="Insert section here"
                        onClick={() => addSection(si)}
                      >
                        +
                      </button>
                      {pasteHere(si)}
                      <div className="pb-insert__line" />
                    </div>
                  )}

                  <div className={`pb-sec${selection?.path === sectionPath ? ' pb-sec--selected' : ''}`}>
                    <div
                      className="pb-sec__head"
                      style={{ background: hue }}
                      onClick={() =>
                        setSelection({ index: si, kind: 'section', listPath: path, path: sectionPath })
                      }
                    >
                      {!readOnly && (
                        <span
                          className="pb-grip"
                          title="Drag to reorder"
                          {...attributes}
                          {...listeners}
                          onClick={(e) => e.stopPropagation()}
                        >
                          ⠿
                        </span>
                      )}
                      <span className="pb-sec__head-label">{label}</span>
                      <span className="pb-sec__head-meta">
                        {rows.length} row{rows.length === 1 ? '' : 's'}
                      </span>
                      <span className="pb-sec__head-actions" onClick={(e) => e.stopPropagation()}>
                        {!readOnly && (
                          <>
                            <button
                              type="button"
                              className="pb-btn pb-btn--icon"
                              disabled={clipBusy}
                              title="Copy section — paste on any page (English and Arabic)"
                              onClick={() => copySectionAt(si, label)}
                            >
                              ⎘
                            </button>
                            <button
                              type="button"
                              className="pb-btn pb-btn--icon"
                              title="Duplicate section"
                              onClick={() => duplicate(path, si)}
                            >
                              ⧉
                            </button>
                            <button
                              type="button"
                              className="pb-btn pb-btn--icon pb-btn--danger"
                              title="Delete section"
                              onClick={() => remove(path, si)}
                            >
                              🗑
                            </button>
                          </>
                        )}
                        <button
                          type="button"
                          className="pb-btn pb-btn--icon"
                          title={isCollapsed ? 'Expand' : 'Collapse'}
                          onClick={() => toggleCollapse(sectionPath)}
                        >
                          {isCollapsed ? '▸' : '▾'}
                        </button>
                      </span>
                    </div>

                    {!isCollapsed && (
                      <div className="pb-sec__body">
                        <DraggableSortable
                          ids={rows.map((r, i) => keyOf(idOf(r), `${sectionId}-row-${i}`))}
                          onDragEnd={({ moveFromIndex, moveToIndex }) =>
                            move(`${sectionPath}.${rowsName}`, moveFromIndex, moveToIndex, rows.length)
                          }
                        >
                          {rows.map((row, ri) => {
                            const rowPath = `${sectionPath}.${rowsName}.${ri}`
                            const rId = keyOf(idOf(row), `${sectionId}-row-${ri}`)
                            const columns = asArray(row[colsName])

                            return (
                              <DraggableSortableItem key={rId} id={rId}>
                                {({
                                  attributes: rAttrs,
                                  listeners: rListeners,
                                  setNodeRef: rRef,
                                  transform: rTransform,
                                  transition: rTransition,
                                }) => (
                                  <div
                                    ref={rRef}
                                    style={
                                      { transform: rTransform, transition: rTransition } as React.CSSProperties
                                    }
                                    className={`pb-rowcard${selection?.path === rowPath ? ' pb-rowcard--selected' : ''}`}
                                  >
                                    <div className="pb-rowcard__head">
                                      {!readOnly && (
                                        <span className="pb-grip" title="Drag to reorder" {...rAttrs} {...rListeners}>
                                          ⠿
                                        </span>
                                      )}
                                      <span
                                        style={{ cursor: 'pointer' }}
                                        onClick={() =>
                                          setSelection({
                                            index: ri,
                                            kind: 'row',
                                            listPath: `${sectionPath}.${rowsName}`,
                                            path: rowPath,
                                          })
                                        }
                                      >
                                        {(row.label as string) || `Row ${ri + 1}`} · {columns.length} col
                                        {columns.length === 1 ? '' : 's'}
                                      </span>
                                      {!readOnly && (
                                        <span className="pb-rowcard__head-actions">
                                          <button
                                            type="button"
                                            className="pb-btn pb-btn--icon pb-btn--ghost"
                                            title="Add column"
                                            onClick={() => addColumn(rowPath)}
                                          >
                                            + col
                                          </button>
                                          <button
                                            type="button"
                                            className="pb-btn pb-btn--icon pb-btn--ghost"
                                            title="Duplicate row"
                                            onClick={() => duplicate(`${sectionPath}.${rowsName}`, ri)}
                                          >
                                            ⧉
                                          </button>
                                          <button
                                            type="button"
                                            className="pb-btn pb-btn--icon pb-btn--ghost pb-btn--danger"
                                            title="Delete row"
                                            onClick={() => remove(`${sectionPath}.${rowsName}`, ri)}
                                          >
                                            🗑
                                          </button>
                                        </span>
                                      )}
                                    </div>

                                    {columns.length === 0 && !readOnly && (
                                      <div className="pb-row__empty">
                                        This row has no columns yet.
                                        <button
                                          type="button"
                                          className="pb-btn pb-btn--primary"
                                          onClick={() => addColumn(rowPath)}
                                        >
                                          + Add a column
                                        </button>
                                      </div>
                                    )}

                                    <div className="pb-rowcard__grid">
                                      {columns.map((col, ci) => {
                                        const colPath = `${rowPath}.${colsName}.${ci}`
                                        const els = asArray(col[elsName])
                                        const colId = keyOf(idOf(col), `${rId}-col-${ci}`)

                                        return (
                                          <div
                                            key={colId}
                                            className={`pb-col${selection?.path === colPath ? ' pb-col--selected' : ''}`}
                                            style={{ ['--pb-span' as string]: String(spanOf(col)) }}
                                          >
                                            <span className="pb-col__meta">
                                              <button
                                                type="button"
                                                className="pb-col__width"
                                                title="Column settings (width, spacing, background)"
                                                onClick={() =>
                                                  setSelection({
                                                    index: ci,
                                                    kind: 'column',
                                                    listPath: `${rowPath}.${colsName}`,
                                                    path: colPath,
                                                  })
                                                }
                                              >
                                                {widthLabel(col)}
                                              </button>
                                              {!readOnly && (
                                                <button
                                                  type="button"
                                                  className="pb-btn pb-btn--ghost pb-btn--danger"
                                                  title="Delete column"
                                                  onClick={() => remove(`${rowPath}.${colsName}`, ci)}
                                                >
                                                  ✕
                                                </button>
                                              )}
                                            </span>

                                            <DraggableSortable
                                              ids={els.map((e, i) => keyOf(idOf(e), `${colId}-el-${i}`))}
                                              onDragEnd={({ moveFromIndex, moveToIndex }) =>
                                                move(
                                                  `${colPath}.${elsName}`,
                                                  moveFromIndex,
                                                  moveToIndex,
                                                  els.length,
                                                )
                                              }
                                            >
                                              {els.map((el, ei) => {
                                                const elPath = `${colPath}.${elsName}.${ei}`
                                                const elId = keyOf(idOf(el), `${colId}-el-${ei}`)
                                                const slug = el.blockType as string | undefined
                                                const elLabel =
                                                  elementsMeta.find((m) => m.slug === slug)?.label ??
                                                  slug ??
                                                  'Element'

                                                return (
                                                  <DraggableSortableItem key={elId} id={elId}>
                                                    {({
                                                      attributes: eAttrs,
                                                      listeners: eListeners,
                                                      setNodeRef: eRef,
                                                      transform: eTransform,
                                                      transition: eTransition,
                                                    }) => (
                                                      <div
                                                        ref={eRef}
                                                        style={
                                                          {
                                                            transform: eTransform,
                                                            transition: eTransition,
                                                          } as React.CSSProperties
                                                        }
                                                        className={`pb-chip${selection?.path === elPath ? ' pb-chip--selected' : ''}`}
                                                        onClick={() =>
                                                          setSelection({
                                                            blockSlug: slug,
                                                            index: ei,
                                                            kind: 'element',
                                                            listPath: `${colPath}.${elsName}`,
                                                            path: elPath,
                                                          })
                                                        }
                                                      >
                                                        {!readOnly && (
                                                          <span
                                                            className="pb-grip"
                                                            title="Drag to reorder"
                                                            {...eAttrs}
                                                            {...eListeners}
                                                            onClick={(ev) => ev.stopPropagation()}
                                                          >
                                                            ⠿
                                                          </span>
                                                        )}
                                                        <span className="pb-chip__icon">
                                                          {elLabel.slice(0, 1)}
                                                        </span>
                                                        <span className="pb-chip__label">{elLabel}</span>
                                                        <span className="pb-chip__excerpt">
                                                          {excerptOf(el)}
                                                        </span>
                                                        {!readOnly && (
                                                          <span
                                                            className="pb-chip__actions"
                                                            onClick={(ev) => ev.stopPropagation()}
                                                          >
                                                            <button
                                                              type="button"
                                                              className="pb-btn pb-btn--icon pb-btn--ghost"
                                                              title="Copy (paste into any column)"
                                                              onClick={() =>
                                                                copyElement(elPath, slug, elLabel)
                                                              }
                                                            >
                                                              ⎘
                                                            </button>
                                                            <button
                                                              type="button"
                                                              className="pb-btn pb-btn--icon pb-btn--ghost"
                                                              title="Duplicate"
                                                              onClick={() =>
                                                                duplicate(`${colPath}.${elsName}`, ei)
                                                              }
                                                            >
                                                              ⧉
                                                            </button>
                                                            <button
                                                              type="button"
                                                              className="pb-btn pb-btn--icon pb-btn--ghost pb-btn--danger"
                                                              title="Delete"
                                                              onClick={() =>
                                                                remove(`${colPath}.${elsName}`, ei)
                                                              }
                                                            >
                                                              ✕
                                                            </button>
                                                          </span>
                                                        )}
                                                      </div>
                                                    )}
                                                  </DraggableSortableItem>
                                                )
                                              })}
                                            </DraggableSortable>

                                            {!readOnly && (
                                              <div className="pb-col__add">
                                                <button
                                                  type="button"
                                                  className="pb-col__empty"
                                                  onClick={(e) => {
                                                    const rect = (
                                                      e.currentTarget as HTMLElement
                                                    ).getBoundingClientRect()
                                                    setMenu({
                                                      columnPath: colPath,
                                                      x: rect.left,
                                                      y: rect.bottom,
                                                    })
                                                  }}
                                                >
                                                  + Add element
                                                </button>
                                                {clipboard && (
                                                  <button
                                                    type="button"
                                                    className="pb-btn pb-btn--ghost pb-col__paste"
                                                    title={`Paste ${clipboard.label} here`}
                                                    onClick={() => pasteElement(colPath)}
                                                  >
                                                    Paste
                                                  </button>
                                                )}
                                              </div>
                                            )}
                                          </div>
                                        )
                                      })}
                                    </div>
                                  </div>
                                )}
                              </DraggableSortableItem>
                            )
                          })}
                        </DraggableSortable>

                        {!readOnly && (
                          <button
                            type="button"
                            className="pb-btn"
                            onClick={() => setRowPicker({ sectionIndex: si })}
                          >
                            + Add row
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </DraggableSortableItem>
          )
        })}
      </DraggableSortable>

      {menu && (
        <div style={{ left: menu.x, position: 'fixed', top: menu.y, zIndex: 100 }}>
          <AddElementMenu
            elements={elementsMeta}
            onClose={() => setMenu(null)}
            onPick={(slug) => addElement(menu.columnPath, slug)}
          />
        </div>
      )}

      {rowPicker && (
        <ColumnLayoutPicker
          onClose={() => setRowPicker(null)}
          onPick={(widths) => addRowWithLayout(rowPicker.sectionIndex, widths)}
        />
      )}

      {blockPicker && (
        <AddBlockMenu
          blocks={schema.flatBlocks.map((b) => ({
            label: blockLabel(b, b.slug),
            slug: b.slug,
          }))}
          onClose={() => setBlockPicker(null)}
          onPick={(slug) => addFlatBlock(slug, blockPicker.index)}
        />
      )}

      {selection && inspector && (
        <Inspector
          crumb={inspector.crumb}
          fields={inspector.fields}
          parentSchemaPath={inspector.parentSchemaPath}
          permissions={permissions}
          readOnly={readOnly}
          selection={selection}
          onClose={() => setSelection(null)}
        />
      )}
    </div>
  )
}
