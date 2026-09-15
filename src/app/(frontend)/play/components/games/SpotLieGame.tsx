'use client'

import { useState } from 'react'

export function SpotLieGame({ data, onSelect }: { data: any; onSelect: (res: any) => void }) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const statements = data?.spotLieGroup?.statements || []

  const handleSubmit = () => {
    const chosen = statements.find((s: any) => s.id === selectedId)
    if (!chosen) return
    onSelect({
      isCorrect: chosen.isLie === true,
      answerDetail: chosen.statementText,
    })
  }

  return (
    <div className="space-y-4">
      <p className="text-sm font-bold text-slate-500 mb-2">
        Tap the statement that is a <span className="text-rose-600 uppercase">Lie</span>:
      </p>
      <div className="space-y-3">
        {statements.map((stmt: any) => (
          <button
            key={stmt.id}
            onClick={() => setSelectedId(stmt.id)}
            className={`w-full p-4 text-left rounded-2xl border font-semibold text-sm transition ${
              selectedId === stmt.id
                ? 'bg-rose-50 border-rose-500 text-rose-900 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {stmt.statementText}
          </button>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        disabled={!selectedId}
        className="w-full mt-4 py-4 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold rounded-2xl transition shadow-md"
      >
        Spot the Lie
      </button>
    </div>
  )
}