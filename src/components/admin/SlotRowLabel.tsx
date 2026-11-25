'use client'
import { useRowLabel } from '@payloadcms/ui'
import { slotLabel } from '@/utilities/roundLayout'

/** Round layout rows read "Q3 · Sponsored (DRA Homes) · +10 s" instead of "Slot 03". */
export function SlotRowLabel() {
  const { data, rowNumber } = useRowLabel<any>()
  return <span>{slotLabel(data, rowNumber ?? 0)}</span>
}
