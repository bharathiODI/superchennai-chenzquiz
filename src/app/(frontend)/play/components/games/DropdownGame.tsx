// 'use client'

// import { useState } from 'react'

// export function DropdownGame({ data, onComplete }: { data: any; onComplete: (res: any) => void }) {
//   const [selectedVal, setSelectedVal] = useState('')
//   const sentence = data?.dropdownGroup?.sentenceText || ''
//   const options = data?.dropdownGroup?.options || []
//   const correctAnswer = data?.dropdownGroup?.correctAnswer

//   const handleSubmit = () => {
//     if (!selectedVal) return
//     onComplete({
//       isCorrect: selectedVal === correctAnswer || selectedVal === options[0]?.optionText,
//       answerDetail: selectedVal,
//     })
//   }

//   return (
//     <div className="space-y-6">
//       <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-lg font-bold text-slate-800 leading-relaxed">
//         <select
//           value={selectedVal}
//           onChange={(e) => setSelectedVal(e.target.value)}
//           className="inline-block px-4 py-2 mr-2 border-2 border-indigo-500 rounded-xl bg-white text-indigo-900 font-bold outline-none"
//         >
//           <option value="">-- Choose --</option>
//           {options.map((opt: any) => (
//             <option key={opt.id} value={opt.optionText}>
//               {opt.optionText}
//             </option>
//           ))}
//         </select>
//         <span>{sentence}</span>
//       </div>
//       <button
//         onClick={handleSubmit}
//         disabled={!selectedVal}
//         className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-2xl transition shadow-md"
//       >
//         Submit Selection
//       </button>
//     </div>
//   )
// }

'use client'

import { useState } from 'react'

export function DropdownGame({ data, onComplete }: { data: any; onComplete: (res: any) => void }) {
  const [selectedVal, setSelectedVal] = useState('')
  const sentence = data?.dropdownGroup?.sentenceText || ''
  const options = data?.dropdownGroup?.options || []
  const correctAnswer = data?.dropdownGroup?.correctAnswer

  const handleSelect = (optionText: string) => {
    setSelectedVal(optionText)
  }

  const handleSubmit = () => {
    if (!selectedVal) return
    const isCorrect = selectedVal === correctAnswer || selectedVal === options[0]?.optionText
    onComplete({
      isCorrect,
      answerDetail: selectedVal,
    })
  }

  return (
    <div className="space-y-6">
      {/* Sentence Box with Highlighted Blank Area */}
      <div className="p-6 bg-gradient-to-br from-indigo-50/60 to-purple-50/40 border border-indigo-100 rounded-2xl text-base sm:text-lg font-medium text-slate-800 leading-relaxed shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3.5 py-1.5 bg-white border-2 border-indigo-500 text-indigo-700 font-black rounded-xl shadow-xs inline-flex items-center gap-1.5 min-w-[120px] justify-center">
            {selectedVal ? (
              <span>{selectedVal}</span>
            ) : (
              <span className="text-slate-400 font-normal text-sm animate-pulse">
                Select below 👇
              </span>
            )}
          </span>
          <span className="text-slate-800">{sentence}</span>
        </div>
      </div>

      {/* Modern Options Pill Cards */}
      <div className="space-y-3">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Choose your answer:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((opt: any) => {
            const isSelected = selectedVal === opt.optionText
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelect(opt.optionText)}
                className={`p-4 rounded-2xl border text-left font-bold text-sm transition-all duration-200 flex items-center justify-between ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20 scale-[1.01]'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-slate-50/80 shadow-2xs'
                }`}
              >
                <span>{opt.optionText}</span>
                <span
                  className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs ${
                    isSelected
                      ? 'border-white bg-white/20 text-white font-black'
                      : 'border-slate-300 text-transparent'
                  }`}
                >
                  ✓
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!selectedVal}
        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition shadow-lg shadow-indigo-600/20"
      >
        Submit Selection
      </button>
    </div>
  )
}
