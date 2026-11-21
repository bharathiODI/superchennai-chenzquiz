/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { ArrowRight, CalendarDays, ClipboardList, Gift, Trophy } from 'lucide-react'

type Media = { url?: string | null; alt?: string | null } | number | string | null | undefined

type ChallengeCard = {
  icon?: Media
  title?: string
  description?: string
  scheduleLabel?: string
  scheduleTime?: string
  buttonText?: string
  buttonUrl?: string
  bgColor?: string
  accentColor?: string
}

type RewardCard = {
  icon?: Media
  title?: string
  description?: string
  voucherImage?: Media
  voucherAmount?: string
  voucherLabel?: string
  buttonText?: string
  buttonUrl?: string
  bgColor?: string
  accentColor?: string
}

type Props = {
  eyebrow?: string
  title?: string
  subtitle?: string
  backgroundImage?: Media
  challengeCard?: ChallengeCard
  rewardCard?: RewardCard
}

const mediaUrl = (m: Media) => (m && typeof m === 'object' && m.url ? m.url : null)
const mediaAlt = (m: Media, fallback: string) =>
  (m && typeof m === 'object' && m.alt) || fallback
const color = (value: string | undefined, fallback: string) =>
  value && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value.trim()) ? value.trim() : fallback

export default function QuizRewardsComponent({
  eyebrow = 'CHENZ QUIZ',
  title = 'Ready to Play Chenz Quiz?',
  subtitle = 'Think You Know Chennai?',
  backgroundImage,
  challengeCard = {},
  rewardCard = {},
}: Props) {
  const bg = mediaUrl(backgroundImage) || '/images/readytoplaysection.png'

  const left = {
    title: challengeCard.title || 'Ready to Take the Challenge?',
    description:
      challengeCard.description ||
      'Play the daily Chennai quiz, answer three questions and earn points. Build your score, maintain your streak and climb the leaderboard.',
    scheduleLabel: challengeCard.scheduleLabel || 'Daily Quiz',
    scheduleTime: challengeCard.scheduleTime || '7:00 AM - 11:00 PM',
    buttonText: challengeCard.buttonText || "Play Today's Quiz",
    buttonUrl: challengeCard.buttonUrl || '/quizzes',
    bg: color(challengeCard.bgColor, '#FFE8F3'),
    accent: color(challengeCard.accentColor, '#F0157D'),
    icon: mediaUrl(challengeCard.icon),
  }

  const right = {
    title: rewardCard.title || 'Your Knowledge Deserves Rewards!',
    description:
      rewardCard.description || 'Compete with fellow Chennai lovers and stand a chance to win a',
    voucher: mediaUrl(rewardCard.voucherImage),
    voucherAlt: mediaAlt(rewardCard.voucherImage, rewardCard.voucherLabel || 'Daily Winner Voucher'),
    voucherAmount: rewardCard.voucherAmount || '₹300',
    voucherLabel: rewardCard.voucherLabel || 'Daily Winner Voucher',
    buttonText: rewardCard.buttonText || 'View Leaderboard',
    buttonUrl: rewardCard.buttonUrl || '/leaderboard',
    bg: color(rewardCard.bgColor, '#EFE9FF'),
    accent: color(rewardCard.accentColor, '#5B21F5'),
    icon: mediaUrl(rewardCard.icon),
  }

  return (
    <section
      className="relative w-full overflow-hidden bg-cover bg-bottom bg-no-repeat px-4 py-16 sm:py-20"
      style={{ backgroundImage: `url('${bg}')` }}
    >
      <div className="relative z-10 mx-auto mb-10 text-center">
        {eyebrow && (
          <p className="mb-1 text-[18px] font-extrabold uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#03045e] via-[#7000ff] to-[#ff007a]">
            {eyebrow}
          </p>
        )}
        <h2 className="text-3xl font-black tracking-tight text-[#1E1B9B] sm:text-4xl md:text-5xl">
          {title}
        </h2>
        {subtitle && <p className="mt-2 text-base font-semibold text-slate-600 sm:text-lg">{subtitle}</p>}
      </div>

      <div className="relative z-10 mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
        {/* Left card - daily challenge */}
        <div
          className="flex flex-col items-center rounded-[28px] border border-white/80 p-7 text-center shadow-xl shadow-purple-500/10 sm:p-9"
          style={{ backgroundColor: left.bg }}
        >
          {left.icon ? (
            <img src={left.icon} alt="" className="mb-4 h-20 w-20 object-contain" />
          ) : (
            <div
              className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-md"
              style={{ color: left.accent }}
            >
              <ClipboardList className="h-10 w-10" />
            </div>
          )}
          <h3 className="mb-3 text-2xl font-black leading-tight text-[#0f172a]">{left.title}</h3>
          <p className="mb-5 max-w-xs text-sm leading-relaxed text-slate-600">{left.description}</p>

          <div
            className="mb-6 inline-flex items-center gap-2 rounded-full border-2 bg-white px-4 py-2 text-xs font-bold text-slate-700 sm:text-sm"
            style={{ borderColor: left.accent }}
          >
            <CalendarDays className="h-4 w-4" style={{ color: left.accent }} />
            <span style={{ color: left.accent }}>{left.scheduleLabel}</span>
            <span className="text-slate-300">|</span>
            <span>{left.scheduleTime}</span>
          </div>

          <Link
            href={left.buttonUrl}
            className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:scale-[1.02] hover:brightness-110"
            style={{ backgroundColor: left.accent }}
          >
            {left.buttonText} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Right card - rewards */}
        <div
          className="flex flex-col items-center rounded-[28px] border border-white/80 p-7 text-center shadow-xl shadow-purple-500/10 sm:p-9"
          style={{ backgroundColor: right.bg }}
        >
          {right.icon ? (
            <img src={right.icon} alt="" className="mb-4 h-20 w-20 object-contain" />
          ) : (
            <div className="mb-4 flex flex-col items-center">
              <Trophy className="h-12 w-12 fill-amber-300 text-amber-500" />
              <div className="mt-1 flex items-end gap-0.5">
                <span className="flex h-5 w-7 items-center justify-center rounded-t bg-slate-400 text-[10px] font-black text-white">2</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-t bg-amber-400 text-[10px] font-black text-white">1</span>
                <span className="flex h-4 w-7 items-center justify-center rounded-t bg-orange-500 text-[10px] font-black text-white">3</span>
              </div>
            </div>
          )}
          <h3 className="mb-3 text-2xl font-black leading-tight text-[#0f172a]">{right.title}</h3>
          <p className="mb-5 max-w-xs text-sm leading-relaxed text-slate-600">{right.description}</p>

          {right.voucher ? (
            <img
              src={right.voucher}
              alt={right.voucherAlt}
              className="mb-6 max-h-28 w-auto max-w-full object-contain"
            />
          ) : (
            <div className="mb-6 inline-flex items-center gap-3 rounded-2xl border-2 border-dashed border-amber-400 bg-gradient-to-r from-amber-50 to-yellow-100 px-5 py-3 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 text-white">
                <Gift className="h-6 w-6" />
              </div>
              <div className="text-left">
                <p className="text-3xl font-black leading-none text-[#B45309]">{right.voucherAmount}</p>
                <p className="text-xs font-bold text-slate-700">{right.voucherLabel}</p>
              </div>
            </div>
          )}

          <Link
            href={right.buttonUrl}
            className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:scale-[1.02] hover:brightness-110"
            style={{ backgroundColor: right.accent }}
          >
            {right.buttonText} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
