'use client'
import React from 'react'
import { useField, useFormFields } from '@payloadcms/ui'

/**
 * "Correct answer" picker for MCQ questions. Editors choose the option by its text; the field
 * still stores the option's position (Option A = 0), so nothing changes for the game or the
 * database. Replaces a bare number box that was easy to fill in counting from 1.
 */
export function CorrectOptionField({ path }: { path: string }) {
  const { value, setValue, showError, errorMessage } = useField<number | null>({ path })

  const parent = path.split('.').slice(0, -1).join('.')
  const prefix = parent ? `${parent}.options` : 'options'
  // joined into one string so the picker only re-renders when the option texts change
  const joined = useFormFields(([fields]) => {
    const texts: string[] = []
    for (let i = 0; i < 26; i++) {
      const f = fields[`${prefix}.${i}.optionText`]
      if (!f) break
      texts.push(String(f.value ?? ''))
    }
    return texts.join('\u0000')
  })
  const options = joined ? joined.split('\u0000') : []

  const index = typeof value === 'number' && Number.isFinite(value) ? value : null
  const outOfRange = index !== null && (index < 0 || index >= options.length)

  return (
    <div className="field-type" style={{ marginBottom: 'var(--spacing-field, 24px)' }}>
      <label htmlFor={`field-${path}`} className="field-label">
        Correct answer <span className="required">*</span>
      </label>
      <select
        id={`field-${path}`}
        value={index === null || outOfRange ? '' : String(index)}
        onChange={(e) => setValue(e.target.value === '' ? null : Number(e.target.value))}
        style={{
          width: '100%',
          height: 40,
          padding: '0 12px',
          borderRadius: 'var(--style-radius-s, 4px)',
          border: `1px solid ${showError || outOfRange ? 'var(--theme-error-500)' : 'var(--theme-elevation-150)'}`,
          background: 'var(--theme-input-bg, var(--theme-elevation-0))',
          color: 'var(--theme-elevation-800)',
          fontSize: 14,
        }}
      >
        <option value="">— Choose the right option —</option>
        {options.map((text, i) => (
          <option key={i} value={i}>
            {String.fromCharCode(65 + i)}. {text || '(option text not filled in yet)'}
          </option>
        ))}
      </select>
      {outOfRange && (
        <p style={{ color: 'var(--theme-error-500)', margin: '6px 0 0', fontSize: 13 }}>
          The saved answer points to option {index! + 1}, which doesn&apos;t exist. Choose the right option.
        </p>
      )}
      {showError && errorMessage && !outOfRange && (
        <p style={{ color: 'var(--theme-error-500)', margin: '6px 0 0', fontSize: 13 }}>{errorMessage}</p>
      )}
      <p className="field-description" style={{ margin: '6px 0 0' }}>
        Players are scored against this option. Add or reorder options above first, then pick the answer.
      </p>
    </div>
  )
}

export default CorrectOptionField
