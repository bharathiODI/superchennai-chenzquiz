'use client'

import { useState } from 'react'

export function WordFinderGame({
  data,
  onComplete,
}: {
  data: any
  onComplete: (res: any) => void
}) {
  const targetWords = data?.wordFinderGroup?.wordsToFind || []
  const gridRows = data?.wordFinderGroup?.gridRows || []

  // Track found words state
  const [foundWords, setFoundWords] = useState<string[]>([])

  // Handle word selection/clicking (No auto-submit now)
  const handleWordClick = (wordObj: { id: string; word: string }) => {
    const word = wordObj.word.toUpperCase()

    // Toggle state: if already found, click again to unmark (optional) or just ignore/toggle
    if (foundWords.includes(word)) {
      setFoundWords(foundWords.filter((w) => w !== word))
    } else {
      setFoundWords([...foundWords, word])
    }
  }

  // Submit only when user clicks the final button manually
  const handleManualSubmit = () => {
    const allFound = foundWords.length === targetWords.length
    onComplete({
      isCorrect: allFound,
      answerDetail: `${foundWords.length}/${targetWords.length} words found`,
    })
  }

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="text-xs font-semibold text-slate-500 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100">
        🔍{' '}
        {data?.wordFinderGroup?.instruction ||
          'Find and click all the hidden target words in the grid below, then click Complete Challenge.'}
      </div>

      {/* Grid View */}
      <div className="bg-slate-900 text-green-400 p-5 rounded-2xl font-mono text-center tracking-[0.3em] leading-loose text-base overflow-x-auto shadow-inner border border-slate-800">
        {gridRows.map((r: any) => (
          <div key={r.id} className="hover:text-green-300 transition-colors cursor-default">
            {r.rowString}
          </div>
        ))}
      </div>

      {/* Target Words List to Click & Find */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Target Words ({foundWords.length}/{targetWords.length}):
          </p>
          <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
            Click words to mark found
          </span>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {targetWords.map((w: any) => {
            const wordStr = w.word.toUpperCase()
            const isFound = foundWords.includes(wordStr)

            return (
              <button
                type="button"
                key={w.id}
                onClick={() => handleWordClick(w)}
                className={`px-3.5 py-2 font-mono text-xs font-bold rounded-xl transition-all duration-200 border ${
                  isFound
                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm scale-95 line-through opacity-90'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-indigo-500 hover:text-indigo-600 shadow-xs'
                }`}
              >
                {isFound ? '✓ ' : ''}
                {w.word}
              </button>
            )
          })}
        </div>
      </div>

      {/* Manual Submit Button */}
      <button
        onClick={handleManualSubmit}
        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-bold rounded-2xl transition shadow-lg shadow-indigo-600/20"
      >
        {foundWords.length === targetWords.length ? '🎉 Complete Challenge' : 'Submit Progress'}
      </button>
    </div>
  )
}
