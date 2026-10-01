// 'use client'

// import { useState } from 'react'

// export function DragDropGame({ data, onComplete }: { data: any; onComplete: (res: any) => void }) {
//   const originalWords = data?.dragDropGroup?.sentenceWordsOrder || []
//   const [availableWords, setAvailableWords] = useState(() =>
//     [...originalWords].sort(() => Math.random() - 0.5)
//   )
//   const [constructed, setConstructed] = useState<any[]>([])

//   const addWord = (wordObj: any) => {
//     setConstructed((prev) => [...prev, wordObj])
//     setAvailableWords((prev) => prev.filter((w) => w.id !== wordObj.id))
//   }

//   const removeWord = (wordObj: any) => {
//     setAvailableWords((prev) => [...prev, wordObj])
//     setConstructed((prev) => prev.filter((w) => w.id !== wordObj.id))
//   }

//   const handleSubmit = () => {
//     const isCorrect = constructed.every((w, idx) => w.id === originalWords[idx]?.id)
//     onComplete({
//       isCorrect: isCorrect && constructed.length === originalWords.length,
//       answerDetail: constructed.map((w) => w.word).join(' '),
//     })
//   }

//   return (
//     <div className="space-y-6">
//       {/* Constructed Output Area */}
//       <div className="min-h-[80px] p-4 bg-indigo-50/50 border-2 border-dashed border-indigo-300 rounded-2xl flex flex-wrap gap-2 items-center">
//         {constructed.length === 0 && (
//           <span className="text-slate-400 text-sm font-medium">Tap words below to build sentence...</span>
//         )}
//         {constructed.map((w) => (
//           <button
//             key={w.id}
//             onClick={() => removeWord(w)}
//             className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl shadow-xs text-sm"
//           >
//             {w.word} ✕
//           </button>
//         ))}
//       </div>

//       {/* Word Options */}
//       <div className="flex flex-wrap gap-2">
//         {availableWords.map((w) => (
//           <button
//             key={w.id}
//             onClick={() => addWord(w)}
//             className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-bold rounded-xl text-sm"
//           >
//             + {w.word}
//           </button>
//         ))}
//       </div>

//       <button
//         onClick={handleSubmit}
//         disabled={constructed.length === 0}
//         className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-2xl transition shadow-md"
//       >
//         Check Sentence
//       </button>
//     </div>
//   )
// }

'use client'

import { useState } from 'react'

export function DragDropGame({ data, onComplete }: { data: any; onComplete: (res: any) => void }) {
  const originalWords = data?.dragDropGroup?.sentenceWordsOrder || []
  const [availableWords, setAvailableWords] = useState(() =>
    [...originalWords].sort(() => Math.random() - 0.5),
  )
  const [constructed, setConstructed] = useState<any[]>([])

  const addWord = (wordObj: any) => {
    setConstructed((prev) => [...prev, wordObj])
    setAvailableWords((prev) => prev.filter((w) => w.id !== wordObj.id))
  }

  const removeWord = (wordObj: any) => {
    setAvailableWords((prev) => [...prev, wordObj])
    setConstructed((prev) => prev.filter((w) => w.id !== wordObj.id))
  }

  const handleSubmit = () => {
    const isCorrect = constructed.every((w, idx) => w.id === originalWords[idx]?.id)
    onComplete({
      isCorrect: isCorrect && constructed.length === originalWords.length,
      answerDetail: constructed.map((w) => w.word).join(' '),
    })
  }

  return (
    <div className="space-y-6">
      {/* Instruction Box */}
      <div className="text-xs font-semibold text-slate-500 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100">
        ✨ Tap the words below in the correct sequence to build the sentence.
      </div>

      {/* Constructed Output Drop Area */}
      <div className="min-h-[100px] p-5 bg-gradient-to-br from-indigo-50/70 to-purple-50/40 border-2 border-dashed border-indigo-300/80 rounded-2xl flex flex-wrap gap-2.5 items-center shadow-inner transition-all">
        {constructed.length === 0 ? (
          <span className="text-slate-400 text-sm font-medium italic">
            Your constructed sentence will appear here...
          </span>
        ) : (
          constructed.map((w, index) => (
            <button
              type="button"
              key={w.id}
              onClick={() => removeWord(w)}
              className="group px-4 py-2.5 bg-indigo-600 hover:bg-rose-600 text-white font-bold rounded-xl shadow-md shadow-indigo-600/20 text-sm flex items-center gap-2 transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95"
            >
              <span className="text-[10px] bg-white/20 text-indigo-100 px-1.5 py-0.5 rounded-md font-mono">
                {index + 1}
              </span>
              <span>{w.word}</span>
              <span className="text-white/70 group-hover:text-white transition-colors">✕</span>
            </button>
          ))
        )}
      </div>

      {/* Available Word Choices Bank */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Available Words Bank:
        </p>
        <div className="flex flex-wrap gap-2.5">
          {availableWords.length === 0 ? (
            <span className="text-xs text-slate-400 italic font-medium py-2">
              All words selected! Review your sentence above.
            </span>
          ) : (
            availableWords.map((w) => (
              <button
                type="button"
                key={w.id}
                onClick={() => addWord(w)}
                className="px-4 py-2.5 bg-white hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 border border-slate-200 text-slate-700 font-bold rounded-xl text-sm shadow-xs transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-1.5"
              >
                <span className="text-indigo-500 font-bold">+</span>
                <span>{w.word}</span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Submit / Check Button */}
      <button
        onClick={handleSubmit}
        disabled={constructed.length === 0}
        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition shadow-lg shadow-indigo-600/20"
      >
        Check Sentence
      </button>
    </div>
  )
}
