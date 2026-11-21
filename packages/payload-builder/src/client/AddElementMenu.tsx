'use client'

import React, { useEffect, useRef } from 'react'
import type { ElementMeta } from '../types'

interface AddElementMenuProps {
  elements: ElementMeta[]
  onPick: (slug: string) => void
  onClose: () => void
}

export const AddElementMenu: React.FC<AddElementMenuProps> = ({ elements, onClose, onPick }) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onDown = (e: MouseEvent): void => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const categories = [...new Set(elements.map((e) => e.category ?? 'basic'))]

  return (
    <div className="pb-menu" ref={ref}>
      {categories.map((cat) => (
        <React.Fragment key={cat}>
          <div className="pb-menu__cat">{cat}</div>
          {elements
            .filter((e) => (e.category ?? 'basic') === cat)
            .map((el) => (
              <button
                key={el.slug}
                type="button"
                className="pb-menu__item"
                onClick={() => onPick(el.slug)}
              >
                <span className="pb-chip__icon">{el.label.slice(0, 1)}</span>
                {el.label}
              </button>
            ))}
        </React.Fragment>
      ))}
    </div>
  )
}
