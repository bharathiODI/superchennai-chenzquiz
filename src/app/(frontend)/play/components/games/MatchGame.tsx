'use client'

import { useState } from 'react'

export function MatchGame({ data, onComplete }: { data: any; onComplete: (res: any) => void }) {
  const pairs = data?.matchGroup?.pairs || []
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null)
  const [matched, setMatched] = useState<Record<string, string>>({})

  const handleRightSelect = (rightItem: string) => {
    if (!selectedLeft) return
    setMatched((prev) => ({ ...prev, [selectedLeft]: rightItem }))
    setSelectedLeft(null)
  }

  const handleSubmit = () => {
    const isAllCorrect = pairs.every((pair: any) => matched[pair.leftItem] === pair.rightItem)
    onComplete({
      isCorrect: isAllCorrect && Object.keys(matched).length === pairs.length,
      answerDetail: matched,
    })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-2">
          {pairs.map((p: any) => (
            <button
              key={p.id}
              onClick={() => setSelectedLeft(p.leftItem)}
              className={`w-full p-3 text-left rounded-xl border text-xs font-bold transition ${
                selectedLeft === p.leftItem
                  ? 'bg-indigo-600 text-white'
                  : matched[p.leftItem]
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              {p.leftItem}
            </button>
          ))}
        </div>

        {/* Right Column */}
        <div className="space-y-2">
          {pairs.map((p: any) => (
            <button
              key={p.id}
              onClick={() => handleRightSelect(p.rightItem)}
              className="w-full p-3 text-left rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 text-slate-700 text-xs font-medium"
            >
              {p.rightItem}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full mt-4 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition shadow-md"
      >
        Submit Matches
      </button>
    </div>
  )
}