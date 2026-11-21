'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'

export interface BlockChoice {
  slug: string
  label: string
}

interface Props {
  blocks: BlockChoice[]
  onPick: (slug: string) => void
  onClose: () => void
  title?: string
}

/**
 * Searchable picker for top-level blocks. ERDC has 24, so a plain list is
 * unusable — the search box is not decoration.
 */
export const AddBlockMenu: React.FC<Props> = ({ blocks, onClose, onPick, title = 'Add to page' }) => {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return blocks
    return blocks.filter((b) => b.label.toLowerCase().includes(q) || b.slug.toLowerCase().includes(q))
  }, [blocks, query])

  return (
    <div
      className="pb-modal__backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="pb-modal pb-modal--blocks" role="dialog" aria-label={title}>
        <div className="pb-modal__head">
          <span className="pb-modal__title">{title}</span>
          <button type="button" className="pb-btn pb-btn--ghost pb-btn--icon" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="pb-modal__search">
          <input
            className="pb-input"
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search blocks…"
            ref={inputRef}
            type="search"
            value={query}
          />
        </div>

        <div className="pb-blockgrid">
          {filtered.map((b) => (
            <button
              className="pb-blockcard"
              key={b.slug}
              onClick={() => onPick(b.slug)}
              type="button"
            >
              <span className="pb-blockcard__icon">{b.label.slice(0, 1).toUpperCase()}</span>
              <span className="pb-blockcard__label">{b.label}</span>
            </button>
          ))}
          {!filtered.length && <p className="pb-blockgrid__empty">No blocks match “{query}”.</p>}
        </div>
      </div>
    </div>
  )
}
