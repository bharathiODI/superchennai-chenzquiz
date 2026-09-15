'use client'

import { useState } from 'react'

export function ReorderGame({ data, onComplete }: { data: any; onComplete: (res: any) => void }) {
  const initialItems = data?.reorderGroup?.itemsInCorrectOrder || []
  const [items, setItems] = useState(() => [...initialItems].sort(() => Math.random() - 0.5))

  const moveItem = (from: number, to: number) => {
    const updated = [...items]
    const [moved] = updated.splice(from, 1)
    updated.splice(to, 0, moved)
    setItems(updated)
  }

  const handleSubmit = () => {
    const isCorrect = items.every((item, idx) => item.id === initialItems[idx]?.id)
    onComplete({
      isCorrect,
      answerDetail: items.map((i) => i.itemText),
    })
  }

  return (
    <div className="space-y-4">
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
        {data?.reorderGroup?.instruction || 'Reorder items into correct order:'}
      </p>
      <div className="space-y-2">
        {items.map((item: any, idx: number) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-800"
          >
            <span>{idx + 1}. {item.itemText}</span>
            <div className="flex items-center gap-1">
              <button
                disabled={idx === 0}
                onClick={() => moveItem(idx, idx - 1)}
                className="p-2 bg-white border rounded-xl disabled:opacity-30 text-xs font-black"
              >
                ▲
              </button>
              <button
                disabled={idx === items.length - 1}
                onClick={() => moveItem(idx, idx + 1)}
                className="p-2 bg-white border rounded-xl disabled:opacity-30 text-xs font-black"
              >
                ▼
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className="w-full mt-4 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition shadow-md"
      >
        Confirm Order
      </button>
    </div>
  )
}