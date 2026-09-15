'use client'

import { useState } from 'react'

export function MCQGame({ data, onComplete }: { data: any; onComplete: (res: any) => void }) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const options = data?.mcqGroup?.options || []
  const correctIdx = data?.mcqGroup?.correctOptionIndex ?? 0

  const handleSubmit = () => {
    if (selectedIdx === null) return
    onComplete({
      isCorrect: selectedIdx === correctIdx,
      answerDetail: options[selectedIdx]?.optionText,
    })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3">
        {options.map((opt: any, idx: number) => (
          <button
            key={opt.id || idx}
            onClick={() => setSelectedIdx(idx)}
            className={`p-4 text-left rounded-2xl border font-bold transition ${
              selectedIdx === idx
                ? 'bg-indigo-50 border-indigo-600 text-indigo-900 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {opt.optionText}
          </button>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        disabled={selectedIdx === null}
        className="w-full mt-6 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-2xl transition shadow-md"
      >
        Submit Answer
      </button>
    </div>
  )
}