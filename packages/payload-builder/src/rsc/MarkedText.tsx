import React, { Fragment } from 'react'

/**
 * Renders a string where `\n` becomes a line break and *asterisk-wrapped*
 * runs render emphasised. The syntax editors type into plain text fields for
 * headlines and taglines:
 *
 *   "BUILDING THE\n*FOUNDATION* FOR"
 *
 * One syntax across every project; components choose the wrapper element.
 */
export const MarkedText: React.FC<{
  text?: string | null
  /** Class on each line's wrapping span (omit for inline flow). */
  lineClassName?: string
  /** Element for the emphasised runs. Default: strong. */
  as?: 'strong' | 'em' | 'span'
}> = ({ as: Emphasis = 'strong', lineClassName, text }) => (
  <>
    {(text ?? '').split('\n').map((line, lineIndex) => (
      <Fragment key={lineIndex}>
        {lineIndex > 0 && !lineClassName ? <br /> : null}
        <span className={lineClassName}>
          {line.split(/(\*[^*]+\*)/g).map((part, partIndex) =>
            part.startsWith('*') && part.endsWith('*') && part.length > 2 ? (
              <Emphasis key={partIndex}>{part.slice(1, -1)}</Emphasis>
            ) : (
              <Fragment key={partIndex}>{part}</Fragment>
            ),
          )}
        </span>
      </Fragment>
    ))}
  </>
)
