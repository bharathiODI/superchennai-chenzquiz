'use client'

import { useState } from 'react'

// The browser never knows the right answer: the pick goes to the server, which replies with the
// result. After that, `reveal` marks the right option (and the player's pick if it was wrong).
export function MCQGame({
  data,
  onComplete,
  locked = false,
  reveal,
}: {
  data: any
  onComplete: (res: { optionId: string; answerDetail: string }) => void
  locked?: boolean
  reveal?: { pickedId?: string | null; correctOptionId?: string | null } | null
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const options = (data?.mcqGroup?.options || []) as any[]

  const handleSubmit = () => {
    if (!selectedId || locked) return
    const opt = options.find((o) => String(o.id) === selectedId)
    onComplete({ optionId: selectedId, answerDetail: opt?.optionText ?? '' })
  }

  const style = (id: string) => {
    if (reveal?.correctOptionId) {
      if (id === String(reveal.correctOptionId)) return 'bg-emerald-50 border-emerald-600 text-emerald-900'
      if (id === reveal.pickedId) return 'bg-rose-50 border-rose-500 text-rose-900'
      return 'bg-slate-50 border-slate-200 text-slate-400'
    }
    return selectedId === id
      ? 'bg-indigo-50 border-indigo-600 text-indigo-900 shadow-xs'
      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3">
        {options.map((opt: any) => (
          <button
            key={opt.id}
            type="button"
            disabled={locked}
            onClick={() => setSelectedId(String(opt.id))}
            className={`p-4 text-left rounded-2xl border font-bold transition ${style(String(opt.id))}`}
          >
            {opt.optionText}
          </button>
        ))}
      </div>
      {!locked && (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!selectedId}
          className="w-full mt-6 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-2xl transition shadow-md"
        >
          Submit Answer
        </button>
      )}
    </div>
  )
}
