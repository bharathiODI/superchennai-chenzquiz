// 'use client'

// import { useState } from 'react'

// export function MatchGame({ data, onComplete }: { data: any; onComplete: (res: any) => void }) {
//   const pairs = data?.matchGroup?.pairs || []
//   const [selectedLeft, setSelectedLeft] = useState<string | null>(null)
//   const [matched, setMatched] = useState<Record<string, string>>({})

//   const handleRightSelect = (rightItem: string) => {
//     if (!selectedLeft) return
//     setMatched((prev) => ({ ...prev, [selectedLeft]: rightItem }))
//     setSelectedLeft(null)
//   }

//   const handleSubmit = () => {
//     const isAllCorrect = pairs.every((pair: any) => matched[pair.leftItem] === pair.rightItem)
//     onComplete({
//       isCorrect: isAllCorrect && Object.keys(matched).length === pairs.length,
//       answerDetail: matched,
//     })
//   }

//   return (
//     <div className="space-y-4">
//       <div className="grid grid-cols-2 gap-4">
//         {/* Left Column */}
//         <div className="space-y-2">
//           {pairs.map((p: any) => (
//             <button
//               key={p.id}
//               onClick={() => setSelectedLeft(p.leftItem)}
//               className={`w-full p-3 text-left rounded-xl border text-xs font-bold transition ${
//                 selectedLeft === p.leftItem
//                   ? 'bg-indigo-600 text-white'
//                   : matched[p.leftItem]
//                   ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
//                   : 'bg-slate-50 border-slate-200 text-slate-700'
//               }`}
//             >
//               {p.leftItem}
//             </button>
//           ))}
//         </div>

//         {/* Right Column */}
//         <div className="space-y-2">
//           {pairs.map((p: any) => (
//             <button
//               key={p.id}
//               onClick={() => handleRightSelect(p.rightItem)}
//               className="w-full p-3 text-left rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 text-slate-700 text-xs font-medium"
//             >
//               {p.rightItem}
//             </button>
//           ))}
//         </div>
//       </div>

//       <button
//         onClick={handleSubmit}
//         className="w-full mt-4 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition shadow-md"
//       >
//         Submit Matches
//       </button>
//     </div>
//   )
// }
'use client'

import { useState, useMemo } from 'react'

export function MatchGame({ data, onComplete }: { data: any; onComplete: (res: any) => void }) {
  const pairs = data?.matchGroup?.pairs || []
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null)
  const [matched, setMatched] = useState<Record<string, string>>({})

  // Shuffle right items once on load so it's a real puzzle challenge
  const shuffledRightItems = useMemo(() => {
    return [...pairs].map((p: any) => p.rightItem).sort(() => Math.random() - 0.5)
  }, [pairs])

  const handleRightSelect = (rightItem: string) => {
    if (!selectedLeft) return
    setMatched((prev) => ({ ...prev, [selectedLeft]: rightItem }))
    setSelectedLeft(null)
  }

  const handleResetMatches = () => {
    setMatched({})
    setSelectedLeft(null)
  }

  const handleSubmit = () => {
    const isAllCorrect = pairs.every((pair: any) => matched[pair.leftItem] === pair.rightItem)
    onComplete({
      isCorrect: isAllCorrect && Object.keys(matched).length === pairs.length,
      answerDetail: matched,
    })
  }

  const isComplete = Object.keys(matched).length === pairs.length

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="flex items-center justify-between bg-indigo-50/50 p-3 rounded-xl border border-indigo-100 text-xs font-semibold text-slate-600">
        <span>🔗 Tap an item on the left, then tap its matching pair on the right.</span>
        {Object.keys(matched).length > 0 && (
          <button
            type="button"
            onClick={handleResetMatches}
            className="text-indigo-600 hover:text-indigo-800 font-bold underline text-[11px]"
          >
            Reset Pairs
          </button>
        )}
      </div>

      {/* Match Columns Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Items:</p>
          {pairs.map((p: any) => {
            const isSelected = selectedLeft === p.leftItem
            const isMatched = Boolean(matched[p.leftItem])

            return (
              <button
                type="button"
                key={p.id}
                onClick={() => !isMatched && setSelectedLeft(p.leftItem)}
                className={`w-full p-4 text-left rounded-2xl border text-xs sm:text-sm font-bold transition-all duration-200 flex items-center justify-between ${
                  isMatched
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs'
                    : isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/25 scale-[1.02]'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-slate-50 shadow-2xs'
                }`}
              >
                <span>{p.leftItem}</span>
                <span className="text-xs font-mono">
                  {isMatched ? '✓ Matched' : isSelected ? '👉 Selected' : ''}
                </span>
              </button>
            )
          })}
        </div>

        {/* Right Column (Shuffled) */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Matches:</p>
          {shuffledRightItems.map((rightItem: string, idx: number) => {
            const isMatchedRight = Object.values(matched).includes(rightItem)

            return (
              <button
                type="button"
                key={idx}
                onClick={() => selectedLeft && handleRightSelect(rightItem)}
                disabled={isMatchedRight}
                className={`w-full p-4 text-left rounded-2xl border text-xs sm:text-sm font-bold transition-all duration-200 flex items-center justify-between ${
                  isMatchedRight
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 opacity-80'
                    : selectedLeft
                      ? 'bg-white text-slate-800 border-indigo-300 hover:bg-indigo-50/50 shadow-xs cursor-pointer animate-pulse'
                      : 'bg-white text-slate-700 border-slate-200 opacity-90'
                }`}
              >
                <span>{rightItem}</span>
                <span className="text-xs font-mono">
                  {isMatchedRight ? '🔒' : selectedLeft ? '✨ Tap' : ''}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Submit / Finish Button */}
      <button
        onClick={handleSubmit}
        disabled={!isComplete}
        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition shadow-lg shadow-indigo-600/20"
      >
        {isComplete
          ? '🎉 Submit All Matches'
          : `Match All Pairs (${Object.keys(matched).length}/${pairs.length})`}
      </button>
    </div>
  )
}
