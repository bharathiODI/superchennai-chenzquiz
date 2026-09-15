'use client'

import { useState } from 'react'

export function DragDropGame({ data, onComplete }: { data: any; onComplete: (res: any) => void }) {
  const originalWords = data?.dragDropGroup?.sentenceWordsOrder || []
  const [availableWords, setAvailableWords] = useState(() =>
    [...originalWords].sort(() => Math.random() - 0.5)
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
      {/* Constructed Output Area */}
      <div className="min-h-[80px] p-4 bg-indigo-50/50 border-2 border-dashed border-indigo-300 rounded-2xl flex flex-wrap gap-2 items-center">
        {constructed.length === 0 && (
          <span className="text-slate-400 text-sm font-medium">Tap words below to build sentence...</span>
        )}
        {constructed.map((w) => (
          <button
            key={w.id}
            onClick={() => removeWord(w)}
            className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl shadow-xs text-sm"
          >
            {w.word} ✕
          </button>
        ))}
      </div>

      {/* Word Options */}
      <div className="flex flex-wrap gap-2">
        {availableWords.map((w) => (
          <button
            key={w.id}
            onClick={() => addWord(w)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-bold rounded-xl text-sm"
          >
            + {w.word}
          </button>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={constructed.length === 0}
        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-2xl transition shadow-md"
      >
        Check Sentence
      </button>
    </div>
  )
}