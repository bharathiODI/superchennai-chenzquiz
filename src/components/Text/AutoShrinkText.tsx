import React from 'react'
import './TextStyle.css'

interface AutoShrinkTextProps {
  text?: string
  baseSize?: number
  minSize?: number
  maxChars?: number
  className?: string
  maxLines?: number
  width?: string
  align?: 'left' | 'center' | 'right'
}

const AutoShrinkText: React.FC<AutoShrinkTextProps> = ({
  text = '',
  baseSize = 60,
  minSize = 18,
  maxChars = 40,
  className = '',
  maxLines = 2,
  width = '100%',
  align = 'center',
}) => {
  const length = text?.length || 0

  const ratio = length > maxChars ? maxChars / length : 1

  const fontSize = Math.max(minSize, baseSize * ratio * 1.1)

  return (
    <h3
      className={`autoShrinkText ${className}`}
      style={
        {
          '--dynamic-font-size': `${fontSize}px`,
          width,
          lineHeight: '0.9',
          margin: '0 auto',
          textAlign: align,
          whiteSpace: length < maxChars / 1.5 ? 'nowrap' : 'normal',
          WebkitLineClamp: maxLines,
        } as React.CSSProperties
      }
      title={text}
    >
      {text}
    </h3>
  )
}

export default AutoShrinkText