// @ts-nocheck -- vendored kit source, type-checked under the kit's own settings, not this app's stricter tsconfig (see packages/payload-builder/VENDORED.md)
'use client'

import React, { useEffect, useRef } from 'react'
import type { ColumnWidth } from '../types'

export interface ColumnPreset {
  label: string
  widths: ColumnWidth[]
}

/** Matches the approved design's "Add Section" modal. */
export const COLUMN_PRESETS: ColumnPreset[] = [
  { label: 'Full width', widths: ['1/1'] },
  { label: 'Two equal', widths: ['1/2', '1/2'] },
  { label: 'Three equal', widths: ['1/3', '1/3', '1/3'] },
  { label: 'Wide + narrow', widths: ['2/3', '1/3'] },
  { label: 'Narrow + wide', widths: ['1/3', '2/3'] },
  { label: 'Four equal', widths: ['1/4', '1/4', '1/4', '1/4'] },
  { label: 'Sidebar left', widths: ['1/4', '3/4'] },
  { label: 'Sidebar right', widths: ['3/4', '1/4'] },
]

const Schematic: React.FC<{ widths: ColumnWidth[] }> = ({ widths }) => (
  <span className="pb-preset__schematic" aria-hidden="true">
    {widths.map((w, i) => {
      const [num, den] = w.split('/').map(Number)
      const flex = den ? num / den : 1
      return <span key={i} className="pb-preset__cell" style={{ flexGrow: flex }} />
    })}
  </span>
)

interface Props {
  onPick: (widths: ColumnWidth[]) => void
  onClose: () => void
  title?: string
}

export const ColumnLayoutPicker: React.FC<Props> = ({ onClose, onPick, title = 'Choose a row layout' }) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onClose()
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
      <div className="pb-modal" ref={ref} role="dialog" aria-label={title}>
        <div className="pb-modal__head">
          <span className="pb-modal__title">{title}</span>
          <button type="button" className="pb-btn pb-btn--ghost pb-btn--icon" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="pb-preset__grid">
          {COLUMN_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              className="pb-preset"
              onClick={() => onPick(preset.widths)}
            >
              <Schematic widths={preset.widths} />
              <span className="pb-preset__label">{preset.label}</span>
              <span className="pb-preset__widths">{preset.widths.join(' · ')}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
