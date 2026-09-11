import React from 'react'

const FORMAT = {
  BOLD: 1,
  ITALIC: 1 << 1,
  UNDERLINE: 1 << 2,
}

export function renderText(children: any[]): React.ReactNode {
  if (!Array.isArray(children)) return null

  return children.map((child, i) => {
    if (child.type === 'text') {
      let el: React.ReactNode = child.text

      if (child.format & FORMAT.BOLD) el = <strong>{el}</strong>
      if (child.format & FORMAT.ITALIC) el = <em>{el}</em>
      if (child.format & FORMAT.UNDERLINE) el = <u>{el}</u>

      return <span key={i}>{el}</span>
    }

    if (child.type === 'link') {
      return (
        <a
          key={i}
          href={child.fields?.url}
          target="_blank"
          className="text-pink-600 underline"
        >
          {renderText(child.children)}
        </a>
      )
    }

    if (child.children) {
      return <span key={i}>{renderText(child.children)}</span>
    }

    return null
  })
}