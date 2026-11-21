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

import { useState, useEffect } from 'react'

export function DropdownGame({ data, onComplete }: { data: any; onComplete: (res: any) => void }) {
  const [selectedVal, setSelectedVal] = useState('')
  const sentence = data?.dropdownGroup?.sentenceText || ''
  const options = data?.dropdownGroup?.options || []
  const correctAnswer = data?.dropdownGroup?.correctAnswer

  // 💡 Initial value varumpodhu selected value-a restore panrom
  useEffect(() => {
    if (data?.initialAnswer && data.initialAnswer !== 'Skipped') {
      setSelectedVal(data.initialAnswer)
    } else {
      setSelectedVal('')
    }
  }, [data?.initialAnswer])

  const handleSubmit = () => {
    if (!selectedVal) return

    // Check if selected option matches correct answer or correct option configuration
    const isCorrect =
      selectedVal === correctAnswer ||
      options.find((opt: any) => opt.optionText === selectedVal)?.isCorrect ||
      selectedVal === options[0]?.optionText

    onComplete({
      isCorrect,
      answerDetail: selectedVal,
    })
  }

  return (
    <div className="space-y-6">
      <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-lg font-bold text-slate-800 leading-relaxed">
        <select
          value={selectedVal}
          onChange={(e) => setSelectedVal(e.target.value)}
          className="inline-block px-4 py-2 mr-2 border-2 border-indigo-500 rounded-xl bg-white text-indigo-900 font-bold outline-none cursor-pointer focus:ring-2 focus:ring-indigo-300"
        >
          <option value="">-- Choose --</option>
          {options.map((opt: any, idx: number) => (
            <option key={opt.id || idx} value={opt.optionText}>
              {opt.optionText}
            </option>
          ))}
        </select>
        <span>{sentence}</span>
      </div>
      <button
        onClick={handleSubmit}
        disabled={!selectedVal}
        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-2xl transition shadow-md active:scale-[0.98] cursor-pointer"
      >
        Submit Selection
      </button>
    </div>
  )
}
