import { Crown } from 'lucide-react'
import { tierTone } from '@/utilities/quizTitles'

type Props = {
  name: string
  tierIndex: number
  tierCount: number
  /** pill = compact badge for tables; hero = laurels + crown for result/profile */
  variant?: 'pill' | 'hero'
  className?: string
}

const PILL_TONES = {
  rookie: 'bg-gradient-to-r from-sky-500 to-blue-600 text-white',
  expert: 'bg-gradient-to-r from-[#5B21B6] to-[#7C3AED] text-white',
  master: 'bg-gradient-to-r from-[#3B0A8F] to-[#6D28D9] text-amber-200 ring-1 ring-amber-400/70',
} as const

export function Laurel({ flip = false, className = '' }: { flip?: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 32 64"
      aria-hidden="true"
      className={`${flip ? '-scale-x-100' : ''} ${className}`}
      fill="#F5A623"
    >
      <path
        d="M26 61 C 10 50, 5 30, 15 5"
        stroke="#E8941A"
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx="10" cy="12" rx="3.2" ry="6.4" transform="rotate(-28 10 12)" />
      <ellipse cx="6.8" cy="24" rx="3.2" ry="6.4" transform="rotate(-12 6.8 24)" />
      <ellipse cx="7.2" cy="36.5" rx="3.2" ry="6.4" transform="rotate(12 7.2 36.5)" />
      <ellipse cx="11.5" cy="48" rx="3.2" ry="6.4" transform="rotate(38 11.5 48)" />
      <ellipse cx="18.5" cy="19" rx="2.7" ry="5.4" transform="rotate(32 18.5 19)" />
      <ellipse cx="17" cy="31" rx="2.7" ry="5.4" transform="rotate(48 17 31)" />
      <ellipse cx="20" cy="43" rx="2.7" ry="5.4" transform="rotate(62 20 43)" />
    </svg>
  )
}

export function TitleBadge({ name, tierIndex, tierCount, variant = 'pill', className = '' }: Props) {
  const tone = tierTone(tierIndex, tierCount)

  if (variant === 'pill') {
    return (
      <span
        className={`inline-flex items-center gap-1 whitespace-nowrap rounded-lg px-2.5 py-1 text-[11px] font-extrabold leading-none shadow-sm ${PILL_TONES[tone]} ${className}`}
      >
        {tone === 'master' && <Crown className="h-3 w-3 fill-amber-300 text-amber-300" />}
        {name}
      </span>
    )
  }

  return (
    <div className={`relative inline-flex items-center justify-center gap-1 ${className}`}>
      <Laurel className="h-16 w-8 shrink-0" />
      <div className="relative flex flex-col items-center">
        <Crown className="mb-[-6px] h-7 w-7 fill-amber-400 text-amber-500 drop-shadow" />
        <span
          className={`relative rounded-xl px-5 py-2 text-center text-base font-black leading-tight shadow-lg shadow-purple-900/30 sm:text-lg ${PILL_TONES[tone]}`}
        >
          {name}
        </span>
      </div>
      <Laurel flip className="h-16 w-8 shrink-0" />
    </div>
  )
}
