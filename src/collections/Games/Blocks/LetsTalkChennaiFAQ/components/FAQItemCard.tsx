
'use client'

import React from 'react'
import { Plus } from 'lucide-react'

export type FAQItemData = {
  question?: string
  answer?: string
}

type FAQItemCardProps = {
  item: FAQItemData
  index: number
  isOpen: boolean
  onToggle: () => void
}

export function FAQItemCard({ item, index, isOpen, onToggle }: FAQItemCardProps) {
  const formattedNumber = String(index + 1).padStart(2, '0')
  const answerId = `faq-answer-${index}`
  const buttonId = `faq-button-${index}`

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-white transition-all duration-300 border border-slate-100 ${
        isOpen
          ? 'shadow-[0_12px_35px_rgba(79,70,229,0.12)] border-indigo-200'
          : 'shadow-[0_6px_25px_rgba(20,20,60,0.06)] hover:shadow-[0_10px_30px_rgba(79,70,229,0.08)]'
      }`}
    >
      {/* 🎨 Theme Gradient Accent Line (Left Border) */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-indigo-600 to-violet-600 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'
        }`}
      />

      {/* ACCORDION HEADER / CONTROL BUTTON */}
      <button
        type="button"
        id={buttonId}
        aria-expanded={isOpen}
        aria-controls={answerId}
        onClick={onToggle}
        className="flex w-full items-center justify-between p-5 md:p-6 lg:p-7 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 rounded-2xl"
      >
        <div className="flex items-center gap-4 md:gap-6 pr-4">
          {/* Decorative Number Shield Badge */}
          <div className="relative flex h-11 w-11 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 shadow-inner">
            <span className="text-lg md:text-xl font-extrabold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              {formattedNumber}
            </span>
          </div>

          {/* Question Text */}
          <span className="text-base md:text-lg lg:text-xl font-bold text-slate-900 transition-colors duration-200 group-hover:text-indigo-600">
            {item.question}
          </span>
        </div>

        {/* Plus / Rotating Action Button */}
        <div
          className={`flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-full border-2 border-indigo-600/30 text-indigo-600 transition-all duration-300 ${
            isOpen
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-transparent rotate-45 shadow-md'
              : 'bg-white group-hover:border-indigo-600 group-hover:bg-indigo-50/50'
          }`}
        >
          <Plus className="h-5 w-5 md:h-6 md:w-6 transition-transform" />
        </div>
      </button>

      {/* ACCORDION ANSWER PANEL */}
      <div
        id={answerId}
        role="region"
        aria-labelledby={buttonId}
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100 pb-6 md:pb-7' : 'grid-rows-[0fr] opacity-0 pb-0'
        }`}
      >
        <div className="overflow-hidden px-5 md:px-6 lg:px-7 pl-[4.25rem] md:pl-[5.25rem]">
          <div className="pt-1 text-sm md:text-base leading-relaxed text-slate-600 border-t border-slate-100">
            <p className="mt-3">{item.answer}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
