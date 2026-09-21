// src/app/(frontend)/profile/components/ProfileLayouts.tsx
import Link from 'next/link'
import { 
  Calendar, 
  HelpCircle, 
  CheckCircle2, 
  Star, 
  Trophy, 
  Crown, 
  Target, 
  Flame, 
  ChevronRight,
  ArrowRight
} from 'lucide-react'
import { EditProfileModal } from './ClientActions'

// 1. Profile Header Card
export function ProfileHeaderCard({ user }: { user: any }) {
  const memberYear = user?.createdAt ? new Date(user.createdAt).getFullYear() : 2026
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'S'

  return (
    <div className="bg-white/90 backdrop-blur-md border border-slate-100/80 rounded-3xl p-6 md:p-8 shadow-xl shadow-indigo-950/5 mb-8 transition-all hover:shadow-2xl hover:shadow-indigo-950/10">
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-5 md:gap-6">
          {/* Avatar with Purple Gradient */}
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-[#5B2EFF] to-[#a855f7] p-1 shadow-lg shadow-[#5B2EFF]/20 flex-shrink-0">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user?.name || 'User'}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-[#5B2EFF] flex items-center justify-center text-white text-4xl md:text-5xl font-black">
                {initial}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-black text-[#11145A] tracking-tight">
              {user?.name || 'Chennai Player'}
            </h1>
            <p className="text-[#5B2EFF] font-bold text-sm md:text-base mt-0.5">
              Trivia Enthusiast
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-slate-400 font-medium text-xs md:text-sm mt-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Member since {memberYear}</span>
            </div>
          </div>
        </div>

        <div className="self-center sm:self-start">
          <EditProfileModal user={user} />
        </div>
      </div>
    </div>
  )
}

// 2. My Stats Grid Card
export function MyStatsSection({ stats }: { stats: any }) {
  const statCards = [
    {
      label: 'Quizzes Played',
      value: stats.quizzesPlayed,
      icon: HelpCircle,
      iconBg: 'bg-indigo-50 text-[#5B2EFF]',
    },
    {
      label: 'Correct Answers',
      value: stats.correctAnswers,
      secondary: `${stats.accuracy}% Accuracy`,
      icon: CheckCircle2,
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'Total Score',
      value: stats.totalScore,
      icon: Star,
      iconBg: 'bg-amber-50 text-[#F5A623]',
    },
    {
      label: 'Best Score',
      value: stats.bestScore,
      icon: Trophy,
      iconBg: 'bg-orange-50 text-[#F97316]',
    },
  ]

  return (
    <div className="mb-8">
      <h2 className="text-xl md:text-2xl font-extrabold text-[#11145A] mb-4">My Stats</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {statCards.map((card, idx) => {
          const IconComponent = card.icon
          return (
            <div
              key={idx}
              className="bg-white border border-slate-100 rounded-3xl p-5 md:p-6 shadow-md shadow-slate-100/80 transition-all hover:-translate-y-1 hover:shadow-xl duration-200"
            >
              <div className="flex items-center gap-3.5 mb-3">
                <div className={`p-3 rounded-2xl ${card.iconBg}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {card.label}
                </span>
              </div>
              <p className="text-3xl md:text-4xl font-black text-[#11145A] tracking-tight">
                {card.value}
              </p>
              {card.secondary && (
                <p className="text-xs font-extrabold text-emerald-600 mt-1">
                  {card.secondary}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// 3. Rank + Streak Section
export function RankAndStreakSection({ stats }: { stats: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* My Rank Card */}
      <div>
        <h2 className="text-xl font-extrabold text-[#11145A] mb-4">My Rank</h2>
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-md shadow-slate-100/80 flex items-center justify-between">
          <div className="text-center flex-1">
            <div className="inline-flex p-2 bg-indigo-50 text-[#5B2EFF] rounded-xl mb-2">
              <Trophy className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Current Rank
            </p>
            <p className="text-2xl md:text-3xl font-black text-[#11145A]">#8</p>
          </div>

          <div className="w-[1px] h-12 bg-slate-100" />

          <div className="text-center flex-1">
            <div className="inline-flex p-2 bg-amber-50 text-[#F5A623] rounded-xl mb-2">
              <Crown className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Best Rank
            </p>
            <p className="text-2xl md:text-3xl font-black text-[#11145A]">#5</p>
          </div>

          <div className="w-[1px] h-12 bg-slate-100" />

          <div className="text-center flex-1">
            <div className="inline-flex p-2 bg-slate-100 text-slate-600 rounded-xl mb-2">
              <Target className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Avg Score
            </p>
            <p className="text-xl md:text-2xl font-black text-[#11145A]">
              {stats.averageScore}
            </p>
          </div>
        </div>
      </div>

      {/* My Streak Card */}
      <div>
        <h2 className="text-xl font-extrabold text-[#11145A] mb-4">My Streak</h2>
        <div className="bg-gradient-to-r from-amber-50/60 to-orange-50/40 border border-amber-200/50 rounded-3xl p-6 shadow-md shadow-slate-100/80 flex items-center justify-around">
          <div className="text-center flex-1">
            <div className="inline-flex p-2.5 bg-orange-500 text-white rounded-2xl mb-2 shadow-md shadow-orange-500/20">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Current Streak
            </p>
            <p className="text-2xl md:text-3xl font-black text-[#11145A]">
              {stats.currentStreak} Days
            </p>
          </div>

          <div className="w-[1px] h-12 bg-amber-200/60" />

          <div className="text-center flex-1">
            <div className="inline-flex p-2.5 bg-amber-500 text-white rounded-2xl mb-2 shadow-md shadow-amber-500/20">
              <Trophy className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Best Streak
            </p>
            <p className="text-2xl md:text-3xl font-black text-[#11145A]">
              {stats.bestStreak} Days
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// 4. Quiz History List Table
export function QuizHistorySection({ attempts }: { attempts: any[] }) {
  if (!attempts || attempts.length === 0) {
    return (
      <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center shadow-md shadow-slate-100/80">
        <div className="w-16 h-16 bg-indigo-50 text-[#5B2EFF] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
          🎪
        </div>
        <h3 className="text-lg font-black text-[#11145A] mb-1">No quizzes played yet</h3>
        <p className="text-slate-400 text-sm mb-6">
          Start your first Chennai quiz challenge today!
        </p>
        <Link
          href="/quizzes"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#5B2EFF] hover:bg-[#4c22e0] text-white font-bold text-sm rounded-2xl shadow-lg shadow-[#5B2EFF]/20 transition active:scale-95"
        >
          Play Quiz <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-md shadow-slate-100/80">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-extrabold text-[#11145A]">
          Quiz History <span className="text-sm font-normal text-slate-400">(Recent 5)</span>
        </h2>
        <Link
          href="/history"
          className="text-[#5B2EFF] hover:text-[#4c22e0] font-bold text-xs md:text-sm flex items-center gap-1 transition"
        >
          View All <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <th className="pb-4 font-bold">Date</th>
              <th className="pb-4 font-bold">Quiz</th>
              <th className="pb-4 font-bold text-center">Score</th>
              <th className="pb-4 font-bold text-right">Time Taken</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-sm font-semibold text-[#11145A]">
            {attempts.slice(0, 5).map((item) => {
              const formattedDate = new Date(item.completedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
              const mins = Math.floor(item.timeTaken / 60)
              const secs = item.timeTaken % 60
              const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`

              return (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 text-slate-500 font-medium">{formattedDate}</td>
                  <td className="py-4 font-bold text-[#11145A]">
                    {typeof item.quiz === 'object' ? item.quiz.title : 'Chennai Challenge'}
                  </td>
                  <td className="py-4 text-center">
                    <span className="px-3 py-1 bg-indigo-50 text-[#5B2EFF] font-black rounded-full text-xs">
                      {item.score} / {item.totalQuestions * 10}
                    </span>
                  </td>
                  <td className="py-4 text-right font-mono text-slate-500 text-xs">
                    {formattedTime}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View */}
      <div className="sm:hidden space-y-3">
        {attempts.slice(0, 5).map((item) => {
          const formattedDate = new Date(item.completedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })
          const mins = Math.floor(item.timeTaken / 60)
          const secs = item.timeTaken % 60
          const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`

          return (
            <div
              key={item.id}
              className="p-4 bg-slate-50/70 rounded-2xl flex items-center justify-between"
            >
              <div>
                <p className="font-bold text-sm text-[#11145A] mb-0.5">
                  {typeof item.quiz === 'object' ? item.quiz.title : 'Chennai Challenge'}
                </p>
                <p className="text-xs text-slate-400">{formattedDate} • {formattedTime}</p>
              </div>
              <span className="px-3 py-1 bg-[#5B2EFF] text-white font-black rounded-xl text-xs">
                {item.score} XP
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}