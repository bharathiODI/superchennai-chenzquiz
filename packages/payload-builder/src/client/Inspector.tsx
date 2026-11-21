// @ts-nocheck -- vendored kit source, type-checked under the kit's own settings, not this app's stricter tsconfig (see packages/payload-builder/VENDORED.md)
'use client'

import React, { useEffect } from 'react'
import { RenderFields } from '@payloadcms/ui'
import type { ClientField, SanitizedFieldPermissions } from 'payload'
import type { Selection } from './utils'

interface InspectorProps {
  selection: Selection
  crumb: string
  fields: ClientField[]
  /** Schema path of the block (or array item scope) that owns `fields`. */
  parentSchemaPath: string
  permissions: SanitizedFieldPermissions | { [fieldName: string]: SanitizedFieldPermissions } | undefined
  readOnly?: boolean
  onClose: () => void
}

class InspectorBoundary extends React.Component<
  React.PropsWithChildren<object>,
  { failed: boolean }
> {
  state = { failed: false }

  static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true }
  }

  render(): React.ReactNode {
    if (this.state.failed) {
      return (
        <p style={{ padding: 16, fontSize: 13 }}>
          The settings panel failed to render this node — use the <strong>Form view</strong> toggle
          to edit it with the standard editor.
        </p>
      )
    }
    return this.props.children
  }
}

/**
 * Node settings, rendered as a centered modal.
 *
 * Modal rather than a docked sidebar because the canvas is wide: a 400px
 * rail squeezed the row grid and made 4-column layouts unreadable. The
 * modal also gives fields room to breathe, which matters most for rich
 * text and media pickers.
 */
export const Inspector: React.FC<InspectorProps> = ({
  crumb,
  fields,
  parentSchemaPath,
  permissions,
  readOnly,
  selection,
  onClose,
}) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      // Ignore Escape raised from inside a nested drawer/menu.
      if (e.key === 'Escape' && !e.defaultPrevented) onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="pb-modal__backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="pb-modal pb-modal--inspector" role="dialog" aria-label={crumb} aria-modal="true">
        <div className="pb-modal__head">
          <span className="pb-modal__title">{crumb}</span>
          <button
            type="button"
            className="pb-btn pb-btn--ghost pb-btn--icon"
            onClick={onClose}
            aria-label="Close settings"
          >
            ✕
          </button>
        </div>

        <div className="pb-modal__body">
          <InspectorBoundary>
            <RenderFields
              fields={fields}
              parentIndexPath=""
              parentPath={selection.path}
              parentSchemaPath={parentSchemaPath}
              permissions={permissions ?? true}
              readOnly={readOnly}
            />
          </InspectorBoundary>
        </div>

        <div className="pb-modal__foot">
          <span className="pb-modal__hint">Changes apply immediately — save the page to keep them.</span>
          <button type="button" className="pb-btn pb-btn--primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
