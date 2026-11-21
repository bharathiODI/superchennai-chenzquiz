'use client'

/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { useState } from 'react'
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
  ArrowRight,
  Play,
  Award,
  Lock,
  Medal,
  Rocket,
  Sparkles,
  Zap,
  X,
} from 'lucide-react'
import { EditProfileModal } from './ClientActions'
import { TitleBadge } from '@/components/quiz/TitleBadge'

export type ProfileTitleInfo = {
  name: string
  tierIndex: number
  tierCount: number
  nextName: string | null
  xpToNext: number
  progress: number
}

export type Achievement = {
  key: string
  label: string
  description: string
  earned: boolean
  icon: 'rocket' | 'compass' | 'target' | 'flame' | 'zap' | 'title'
}

export function ProfileHeaderCard({
  user,
  titleInfo,
}: {
  user: any
  titleInfo?: ProfileTitleInfo
}) {
  const memberYear = user?.createdAt ? new Date(user.createdAt).getFullYear() : 2026
  const initial = user?.name ? user.name.trim().charAt(0).toUpperCase() : 'S'

  return (
    <div className="bg-white/90 backdrop-blur-md border border-slate-100/80 rounded-3xl p-6 md:p-8 shadow-xl shadow-indigo-950/5 mb-8 transition-all hover:shadow-2xl hover:shadow-indigo-950/10 ">
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-5 md:gap-6">
          {/* Avatar with Purple Gradient */}
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-[#5B2EFF] to-[#a855f7] p-1 shadow-lg shadow-[#5B2EFF]/20 flex-shrink-0">
            {user?.avatar ? (
              <img
                src={typeof user.avatar === 'object' ? user.avatar.url : user.avatar}
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
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#03045e] via-[#7000ff] to-[#ff007a]">
              {user?.name || 'Chennai Player'}
            </h1>
            {titleInfo ? (
              <div className="mt-2 flex flex-col items-center sm:items-start">
                <TitleBadge
                  name={titleInfo.name}
                  tierIndex={titleInfo.tierIndex}
                  tierCount={titleInfo.tierCount}
                  variant="hero"
                  className="origin-center scale-90 sm:origin-left"
                />
                {titleInfo.nextName ? (
                  <div className="mt-2 w-56">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-purple-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#5B2EFF] to-[#a855f7]"
                        style={{ width: `${titleInfo.progress}%` }}
                      />
                    </div>
                    <p className="mt-1 text-[11px] font-semibold text-slate-500">
                      {titleInfo.xpToNext} XP to{' '}
                      <span className="font-extrabold text-[#5B2EFF]">{titleInfo.nextName}</span>
                    </p>
                  </div>
                ) : (
                  <p className="mt-1 text-[11px] font-semibold text-amber-600">Top title unlocked!</p>
                )}
              </div>
            ) : (
              <p className="text-[#5B2EFF] font-bold text-sm md:text-base mt-0.5">
                Trivia Enthusiast
              </p>
            )}
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-slate-400 font-medium text-xs md:text-sm mt-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Member since {memberYear}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons: Play Quiz + Edit Profile */}
        <div className="flex flex-col sm:flex-row items-center gap-3 self-center sm:self-start w-full sm:w-auto">
          <Link
            href="/quizzes"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#5B2EFF] hover:bg-[#4a22dd] text-white font-bold text-sm rounded-2xl shadow-lg shadow-[#5B2EFF]/25 transition transform active:scale-95 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Play Quiz</span>
          </Link>

          <EditProfileModal user={user} />
        </div>
      </div>
    </div>
  )
}

// 2. My Stats Grid Card
export function MyStatsSection({ stats }: { stats: any }) {
  // Same order as the profile design: score, quizzes played, winning streak (+ accuracy)
  const statCards = [
    {
      label: 'Total Score',
      value: `${stats.totalScore} XP`,
      icon: Star,
      iconBg: 'bg-amber-50 text-[#F5A623]',
    },
    {
      label: 'Quizzes Played',
      value: stats.quizzesPlayed,
      icon: HelpCircle,
      iconBg: 'bg-indigo-50 text-[#5B2EFF]',
    },
    {
      label: 'Winning Streak',
      value: `${stats.currentStreak || 0} ${stats.currentStreak === 1 ? 'day' : 'days'}`,
      secondary: stats.bestStreak ? `Best: ${stats.bestStreak} ${stats.bestStreak === 1 ? 'day' : 'days'}` : undefined,
      icon: Flame,
      iconBg: 'bg-orange-50 text-orange-500',
    },
    {
      label: 'Correct Answers',
      value: stats.correctAnswers,
      secondary: `${stats.accuracy}% Accuracy`,
      icon: CheckCircle2,
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    // {
    //   label: 'Best Score',
    //   value: stats.bestScore,
    //   icon: Trophy,
    //   iconBg: 'bg-orange-50 text-[#F97316]',
    // },
  ]

  return (
    <div className="mb-8">
      <h2 className="text-xl md:text-2xl font-extrabold text-[#fff] mb-4">My Stats</h2>
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
                <p className="text-xs font-extrabold text-emerald-600 mt-1">{card.secondary}</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function RankAndStreakSection({
  stats,
  currentRank = 1,
}: {
  stats: any
  currentRank?: number
}) {
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
            <p className="text-2xl md:text-3xl font-black text-[#11145A]">#{currentRank}</p>
          </div>

          <div className="w-[1px] h-12 bg-slate-100" />

          <div className="text-center flex-1">
            <div className="inline-flex p-2 bg-amber-50 text-[#F5A623] rounded-xl mb-2">
              <Crown className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Best Rank
            </p>
            <p className="text-2xl md:text-3xl font-black text-[#11145A]">#{currentRank}</p>
          </div>

          <div className="w-[1px] h-12 bg-slate-100" />

          <div className="text-center flex-1">
            <div className="inline-flex p-2 bg-slate-100 text-slate-600 rounded-xl mb-2">
              <Target className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Avg Score
            </p>
            <p className="text-xl md:text-2xl font-black text-[#11145A]">{stats.averageScore}</p>
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
  const [showAllModal, setShowAllModal] = useState(false)

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

  // Dynamic helper to extract quiz title accurately from Payload relation
  const getQuizTitle = (item: any) => {
    if (typeof item?.quiz === 'object' && item.quiz !== null) {
      return item.quiz.quizTitle || item.quiz.title || `Quiz #${item.quiz.id || item.id}`
    }
    return `Quiz Challenge #${item?.id}`
  }

  const renderHistoryTable = (list: any[]) => (
    <>
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
            {list.map((item) => {
              const formattedDate = item?.completedAt
                ? new Date(item.completedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Recent'

              const timeTakenSecs = Number(item?.timeTaken || 0)
              const mins = Math.floor(timeTakenSecs / 60)
              const secs = timeTakenSecs % 60
              const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`

              return (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 text-slate-500 font-medium">{formattedDate}</td>
                  <td className="py-4 font-bold text-[#11145A]">{getQuizTitle(item)}</td>
                  <td className="py-4 text-center">
                    <span className="px-3 py-1 bg-indigo-50 text-[#5B2EFF] font-black rounded-full text-xs">
                      {item.score ?? 0} XP
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

      <div className="sm:hidden space-y-3">
        {list.map((item) => {
          const formattedDate = item?.completedAt
            ? new Date(item.completedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })
            : 'Recent'

          const timeTakenSecs = Number(item?.timeTaken || 0)
          const mins = Math.floor(timeTakenSecs / 60)
          const secs = timeTakenSecs % 60
          const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`

          return (
            <div
              key={item.id}
              className="p-4 bg-slate-50/70 rounded-2xl flex items-center justify-between"
            >
              <div>
                <p className="font-bold text-sm text-[#11145A] mb-0.5">{getQuizTitle(item)}</p>
                <p className="text-xs text-slate-400">
                  {formattedDate} • {formattedTime}
                </p>
              </div>
              <span className="px-3 py-1 bg-[#5B2EFF] text-white font-black rounded-xl text-xs">
                {item.score ?? 0} XP
              </span>
            </div>
          )
        })}
      </div>
    </>
  )

  return (
    <>
      <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-md shadow-slate-100/80">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-extrabold text-[#11145A]">
            Quiz History <span className="text-sm font-normal text-slate-400">(Recent 5)</span>
          </h2>
          <button
            onClick={() => setShowAllModal(true)}
            className="text-[#5B2EFF] hover:text-[#4c22e0] font-bold text-xs md:text-sm flex items-center gap-1 transition cursor-pointer"
          >
            View All ({attempts.length}) <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {renderHistoryTable(attempts.slice(0, 5))}
      </div>

      {/* FULL HISTORY MODAL */}
      {showAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#11145A]/50 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative">
            <div className="flex items-center justify-between mb-6 border-b pb-4">
              <h3 className="text-xl font-extrabold text-[#11145A]">
                All Quiz Attempts ({attempts.length})
              </h3>
              <button
                onClick={() => setShowAllModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {renderHistoryTable(attempts)}
          </div>
        </div>
      )}
    </>
  )
}

export function ClimbLeaderboardBanner({ currentRank }: { currentRank?: number }) {
  return (
    <div className="mb-8 flex flex-col items-center gap-5 rounded-3xl border border-purple-100 bg-gradient-to-r from-[#F3EEFF] via-white to-[#FFF4E5] p-6 text-center shadow-md shadow-purple-500/5 sm:flex-row sm:text-left md:p-7">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-orange-400 shadow-lg shadow-orange-500/20">
        <Trophy className="h-9 w-9 text-white" />
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-black text-[#2E1065] md:text-2xl">Climb the Leaderboard</h3>
        <p className="mt-1 text-sm font-medium text-slate-500">
          Keep playing daily quizzes and earn more XP to move up the rankings!
          {currentRank ? (
            <>
              {' '}
              You are currently <span className="font-extrabold text-[#5B2EFF]">#{currentRank}</span>.
            </>
          ) : null}
        </p>
      </div>
      <Link
        href="/leaderboard"
        className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-gradient-to-r from-[#5B2EFF] to-[#7c3aed] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#5B2EFF]/25 transition hover:scale-[1.02]"
      >
        View Leaderboard <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  )
}

const ACHIEVEMENT_ICONS = {
  rocket: Rocket,
  compass: Sparkles,
  target: Target,
  flame: Flame,
  zap: Zap,
  title: Crown,
} as const

export function AchievementsSection({ achievements }: { achievements: Achievement[] }) {
  const earnedCount = achievements.filter((a) => a.earned).length

  return (
    <div className="mb-8">
      <h2 className="mb-4 flex items-center gap-2 text-xl font-extrabold text-[#fff] md:text-2xl">
        <Award className="h-6 w-6" /> My Achievements
        <span className="text-sm font-bold opacity-80">
          ({earnedCount}/{achievements.length})
        </span>
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 md:gap-4">
        {achievements.map((a) => {
          const Icon = ACHIEVEMENT_ICONS[a.icon] ?? Medal
          return (
            <div
              key={a.key}
              className={`rounded-2xl border p-4 transition ${
                a.earned
                  ? 'border-purple-100 bg-white shadow-md shadow-purple-500/5'
                  : 'border-white/60 bg-white/90'
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    a.earned
                      ? 'bg-gradient-to-br from-[#5B2EFF] to-[#a855f7] text-white'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                {!a.earned && <Lock className="h-4 w-4 text-slate-300" />}
              </div>
              <p className={`text-sm font-extrabold ${a.earned ? 'text-[#11145A]' : 'text-slate-500'}`}>
                {a.label}
              </p>
              <p className={`mt-0.5 text-xs ${a.earned ? 'text-slate-500' : 'text-slate-400'}`}>
                {a.description}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
