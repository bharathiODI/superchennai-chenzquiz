'use client'

import type { FormState } from 'payload'

/**
 * Cross-column moves and duplication.
 *
 * Payload's own clipboard helpers live behind internal paths, so instead we
 * reconstruct a `subFieldState` from public form state: take every entry
 * under the source node's path, re-key it relative to that node, and hand
 * the result to `addFieldRow({ subFieldState })`. That is the documented
 * shape for seeding a new row, so no internals are touched.
 */

export interface ClipboardEntry {
  blockType?: string
  /** Form state re-keyed relative to the copied node. */
  subFieldState: FormState
  /** For the paste menu label. */
  label?: string
}

/** Extract the form state beneath `path`, re-keyed relative to it. */
export const extractSubFieldState = (formState: FormState, path: string): FormState => {
  const prefix = `${path}.`
  const out: FormState = {}
  for (const key of Object.keys(formState)) {
    if (!key.startsWith(prefix)) continue
    const relative = key.slice(prefix.length)
    if (!relative) continue
    const field = formState[key]
    if (!field) continue
    // Strip transient UI/validation state so the pasted row starts clean.
    const { errorMessage: _e, valid: _v, ...rest } = field as Record<string, unknown>
    out[relative] = { ...rest, initialValue: (rest as { value?: unknown }).value } as FormState[string]
  }
  return out
}

/** Row ids must be regenerated on paste, or Payload rejects duplicate ids. */
export const stripRowIds = (state: FormState): FormState => {
  const out: FormState = {}
  for (const [key, field] of Object.entries(state)) {
    if (key === 'id' || key.endsWith('.id')) continue
    out[key] = field
  }
  return out
}

export const buildClipboardEntry = (
  formState: FormState,
  path: string,
  blockType?: string,
  label?: string,
): ClipboardEntry => ({
  blockType,
  label,
  subFieldState: stripRowIds(extractSubFieldState(formState, path)),
})
