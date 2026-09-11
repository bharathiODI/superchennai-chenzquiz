'use client'

import React from 'react'
import { useField } from '@payloadcms/ui'

export default function RegistrationViewer() {
  const { value } = useField<Record<string, unknown>>({
    path: 'values',
  })

  if (!value || typeof value !== 'object' || Object.keys(value).length === 0) {
    return (
      <div
        style={{
          padding: '24px',
          border: '1px dashed #d1d5db',
          background: '#f9fafb',
          textAlign: 'center',
          color: '#6b7280',
          borderRadius: '8px',
        }}
        
      >
        No additional form data submitted.
      </div>
    )
  }

  const entries = Object.entries(value)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px',  }}>
      {/* HEADER */}
      <div
        style={{
          borderRadius: '8px',
          padding: '16px 20px',
          color: '#ffffff',
          background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: 700,
          }}
        >
          Submitted  Data
        </h3>
      </div>

      {/* DATA GRID */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '12px',
        }}
      >
        {entries.map(([key, val], index) => (
          <div
            key={index}
            style={{
              borderRadius: '8px',
              padding: '14px 16px',
              border: '1px solid #e5e7eb',
              background: '#ffffff',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            }}
          >
            {/* FIELD NAME / LABEL */}
            <p
              style={{
                margin: '0 0 6px 0',
                fontSize: '11px',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: '#ec4899',
                fontWeight: 700,
              }}
            >
              {formatLabel(key)}
            </p>

            {/* FIELD VALUE */}
            <div
              style={{
                fontSize: '15px',
                fontWeight: 600,
                color: '#111827',
                wordBreak: 'break-word',
              }}
            >
              {renderValue(val)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ======================================================
   HELPER FUNCTIONS
====================================================== */

function formatLabel(text: string): string {
  return text
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function renderValue(val: unknown): React.ReactNode {
  if (Array.isArray(val)) {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {val.map((item, i) => (
          <span
            key={i}
            style={{
              padding: '4px 10px',
              borderRadius: '999px',
              background: '#fce7f3',
              color: '#be185d',
              fontSize: '12px',
              fontWeight: 500,
            }}
          >
            {String(item)}
          </span>
        ))}
      </div>
    )
  }

  if (typeof val === 'boolean') {
    return (
      <span
        style={{
          color: val ? '#059669' : '#dc2626',
          fontWeight: 700,
        }}
      >
        {val ? 'Yes' : 'No'}
      </span>
    )
  }

  if (val === null || val === undefined || val === '') {
    return <span style={{ color: '#9ca3af' }}>—</span>
  }

  return String(val)
}