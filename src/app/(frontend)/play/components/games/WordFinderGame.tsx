'use client'

import { useState } from 'react'

export function WordFinderGame({ data, onComplete }: { data: any; onComplete: (res: any) => void }) {
  const targetWords = data?.wordFinderGroup?.wordsToFind || []
  const gridRows = data?.wordFinderGroup?.gridRows || []
  const [foundCount, setFoundCount] = useState(0)

  const handleSimulateFind = () => {
    setFoundCount(targetWords.length)
  }

  const handleSubmit = () => {
    onComplete({
      isCorrect: true,
      answerDetail: `${targetWords.length} words found`,
    })
  }

  return (
    <div className="space-y-4">
      <div className="bg-slate-900 text-green-400 p-4 rounded-2xl font-mono text-center tracking-widest leading-loose text-sm overflow-x-auto">
        {gridRows.map((r: any) => (
          <div key={r.id}>{r.rowString}</div>
        ))}
      </div>

      <div className="p-3 bg-slate-100 rounded-xl">
        <p className="text-xs font-bold text-slate-500 mb-2">TARGET WORDS:</p>
        <div className="flex flex-wrap gap-2">
          {targetWords.map((w: any) => (
            <span key={w.id} className="px-2 py-1 bg-white border border-slate-300 font-mono text-xs rounded-md">
              {w.word}
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition shadow-md"
      >
        Complete Grid Challenge
      </button>
    </div>
  )
}