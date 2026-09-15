'use client'

import { useState } from 'react'

export function WordleGame({ data, onComplete }: { data: any; onComplete: (res: any) => void }) {
  const [guess, setGuess] = useState('')
  const answer = data?.wordleGroup?.answerWord || ''
  const clue = data?.wordleGroup?.clueText

  const handleSubmit = () => {
    if (!guess.trim()) return
    onComplete({
      isCorrect: guess.trim().toUpperCase() === answer.toUpperCase(),
      answerDetail: guess,
    })
  }

  return (
    <div className="space-y-4">
      {clue && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-sm font-semibold">
          💡 Clue: {clue}
        </div>
      )}
      <input
        type="text"
        maxLength={answer.length || 10}
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        placeholder="TYPE YOUR ANSWER"
        className="w-full p-4 border-2 border-slate-200 rounded-2xl text-center text-2xl font-mono uppercase font-black text-slate-800 tracking-widest focus:border-indigo-600 outline-none"
      />
      <button
        onClick={handleSubmit}
        disabled={!guess.trim()}
        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-2xl transition shadow-md"
      >
        Submit Guess
      </button>
    </div>
  )
}