'use client'

import { useState } from 'react'

// The pick goes to the server, which checks it (the browser never gets the answer).
export function DropdownGame({
  data,
  onComplete,
  locked = false,
}: {
  data: any
  onComplete: (res: { value: string; answerDetail: string }) => void
  locked?: boolean
}) {
  const [selectedVal, setSelectedVal] = useState('')
  const sentence = data?.dropdownGroup?.sentenceText || ''
  const options = data?.dropdownGroup?.options || []

  const handleSubmit = () => {
    if (!selectedVal || locked) return
    onComplete({ value: selectedVal, answerDetail: selectedVal })
  }

  return (
    <div className="space-y-6">
      <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-lg font-bold text-slate-800 leading-relaxed">
        <select
          value={selectedVal}
          disabled={locked}
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
      {!locked && (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!selectedVal}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-2xl transition shadow-md active:scale-[0.98] cursor-pointer"
        >
          Submit Selection
        </button>
      )}
    </div>
  )
}
