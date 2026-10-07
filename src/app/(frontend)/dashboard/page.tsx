'use client'

import {
  Calendar,
  Clock,
  Crown,
  Filter,
  HelpCircle,
  PlayCircle,
  Search,
  ShieldCheck,
  TrendingUp,
  Users,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AdminDashboardPage() {
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Search & Filter States
  const [searchUser, setSearchUser] = useState('')
  const [winnerTimeframe, setWinnerTimeframe] = useState<'today' | 'monthly' | 'yearly' | 'custom'>(
    'today',
  )
  const [customDate, setCustomDate] = useState('')

  useEffect(() => {
    async function fetchAdminStats() {
      try {
        const res = await fetch('/api/dashboard-stats')
        if (!res.ok) {
          router.push('/admin')
          return
        }
        const statsData = await res.json()
        setData(statsData)
      } catch (e) {
        console.error('Failed to load dashboard data:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchAdminStats()
  }, [router])

  // Utility: Calculate Last Active status indicator
  const getLastActiveStatus = (dateString?: string) => {
    if (!dateString) return { label: 'Inactive', isOnline: false }
    const lastActive = new Date(dateString)
    const now = new Date()
    const diffMinutes = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60))

    if (diffMinutes < 15) {
      return { label: 'Active Now', isOnline: true }
    } else if (diffMinutes < 60) {
      return { label: `${diffMinutes}m ago`, isOnline: false }
    } else if (diffMinutes < 1440) {
      return { label: `${Math.floor(diffMinutes / 60)}h ago`, isOnline: false }
    } else {
      return { label: lastActive.toLocaleDateString(), isOnline: false }
    }
  }

  // Filter Winners by Selected Timeframe (Today, Monthly, Yearly, Custom Date)
  const getFilteredWinners = () => {
    if (!data?.recentAttempts) return []

    const attempts = data.recentAttempts || []
    const now = new Date()

    const filtered = attempts.filter((attempt: any) => {
      const attemptDate = new Date(attempt.completedAt || attempt.createdAt)

      if (winnerTimeframe === 'today') {
        return attemptDate.toDateString() === now.toDateString()
      }
      if (winnerTimeframe === 'monthly') {
        return (
          attemptDate.getMonth() === now.getMonth() &&
          attemptDate.getFullYear() === now.getFullYear()
        )
      }
      if (winnerTimeframe === 'yearly') {
        return attemptDate.getFullYear() === now.getFullYear()
      }
      if (winnerTimeframe === 'custom' && customDate) {
        const selected = new Date(customDate)
        return attemptDate.toDateString() === selected.toDateString()
      }
      return true
    })

    // Group scores by User ID
    const userScores: { [key: string]: any } = {}

    filtered.forEach((attempt: any) => {
      const u = attempt.user
      const uId = typeof u === 'object' ? u?.id : u
      const uName = typeof u === 'object' ? u?.name : 'Player'
      const uEmail = typeof u === 'object' ? u?.email : 'No email'

      if (!uId) return

      if (!userScores[uId]) {
        userScores[uId] = {
          id: uId,
          name: uName,
          email: uEmail,
          totalScore: 0,
          playedCount: 0,
          correctAnswers: 0,
        }
      }

      userScores[uId].totalScore += attempt.score || 0
      userScores[uId].playedCount += 1
      userScores[uId].correctAnswers += attempt.correctAnswers || 0
    })

    return Object.values(userScores).sort((a: any, b: any) => b.totalScore - a.totalScore)
  }

  const winnersList = getFilteredWinners()

  // Filter Members Activity Table by Search Keyword
  const filteredAttempts = data?.recentAttempts?.filter((attempt: any) => {
    const uName = typeof attempt.user === 'object' ? attempt.user?.name : 'Player'
    const uPhone = typeof attempt.user === 'object' ? attempt.user?.phone : ''
    const qTitle =
      typeof attempt.quiz === 'object' ? attempt.quiz?.quizTitle || attempt.quiz?.title : 'Quiz'

    const query = searchUser.toLowerCase()
    return (
      uName?.toLowerCase().includes(query) ||
      uPhone?.toLowerCase().includes(query) ||
      qTitle?.toLowerCase().includes(query)
    )
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F1123] flex items-center justify-center text-white font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#5B2EFF] border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 font-bold text-sm">Loading Super Admin Control Panel...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0F1123] text-slate-100 font-sans pb-16">
      {/* Top Admin Header */}
      <header className="border-b border-slate-800 bg-[#161936]/80 backdrop-blur-md sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#5B2EFF] rounded-xl text-white">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg text-white leading-tight">
                Super Admin Control Center
              </h1>
              <p className="text-xs text-slate-400">Super Chennai Trivia Platform Management</p>
            </div>
          </div>

          <button
            onClick={() => router.push('/profile')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer"
          >
            My Profile
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-8 space-y-8">
        {/* 1. Summary Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-[#181C3F] border border-slate-800 p-6 rounded-3xl flex items-center justify-between shadow-xl">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Total Registered Users
              </p>
              <p className="text-4xl font-black text-white">{data?.summary?.totalUsers || 0}</p>
            </div>
            <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-2xl">
              <Users className="w-8 h-8" />
            </div>
          </div>

          <div className="bg-[#181C3F] border border-slate-800 p-6 rounded-3xl flex items-center justify-between shadow-xl">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Total Active Quizzes
              </p>
              <p className="text-4xl font-black text-white">{data?.summary?.totalQuizzes || 0}</p>
            </div>
            <div className="p-4 bg-purple-500/10 text-purple-400 rounded-2xl">
              <HelpCircle className="w-8 h-8" />
            </div>
          </div>

          <div className="bg-[#181C3F] border border-slate-800 p-6 rounded-3xl flex items-center justify-between shadow-xl">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Total Plays Completed
              </p>
              <p className="text-4xl font-black text-white">{data?.summary?.totalAttempts || 0}</p>
            </div>
            <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-2xl">
              <PlayCircle className="w-8 h-8" />
            </div>
          </div>
        </div>

        {/* 2. Winners Section (Today / Custom Date / Monthly / Yearly Filter) */}
        <section className="bg-[#181C3F] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Crown className="w-6 h-6 text-amber-400" />
              <div>
                <h2 className="text-xl font-extrabold text-white">Quiz Winners Board</h2>
                <p className="text-xs text-slate-400">Filter champions by specific time period</p>
              </div>
            </div>

            {/* Filter Tabs & Custom Date Selector */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'today', label: 'Today' },
                { id: 'monthly', label: 'This Month' },
                { id: 'yearly', label: 'This Year' },
                { id: 'custom', label: 'Custom Date' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setWinnerTimeframe(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border cursor-pointer ${
                    winnerTimeframe === tab.id
                      ? 'bg-[#5B2EFF] text-white border-[#5B2EFF] shadow-lg shadow-[#5B2EFF]/30'
                      : 'bg-[#11142D] text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <Filter className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}

              {winnerTimeframe === 'custom' && (
                <div className="flex items-center gap-1.5 bg-[#11142D] border border-slate-700 px-3 py-1 rounded-xl text-xs">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <input
                    type="date"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    className="bg-transparent text-white focus:outline-none cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Winner Cards Output */}
          {winnersList.length === 0 ? (
            <div className="p-8 text-center text-slate-500 font-bold text-xs bg-[#11142D] rounded-2xl border border-slate-800">
              No quiz winners found for the selected timeline.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {winnersList.slice(0, 6).map((winner: any, index: number) => {
                const isFirst = index === 0
                const isSecond = index === 1
                const isThird = index === 2

                return (
                  <div
                    key={winner.id}
                    className={`relative p-5 rounded-2xl border ${
                      isFirst
                        ? 'bg-gradient-to-br from-amber-500/20 to-amber-900/10 border-amber-500/40'
                        : isSecond
                          ? 'bg-gradient-to-br from-slate-400/20 to-slate-800/10 border-slate-400/40'
                          : isThird
                            ? 'bg-gradient-to-br from-orange-500/20 to-orange-900/10 border-orange-500/40'
                            : 'bg-[#11142D] border-slate-800'
                    } flex items-center gap-4`}
                  >
                    <div className="font-black text-xl w-8 text-center">
                      {isFirst ? '🥇' : isSecond ? '🥈' : isThird ? '🥉' : `#${index + 1}`}
                    </div>

                    <div className="w-12 h-12 rounded-full bg-[#5B2EFF] flex items-center justify-center font-black text-white text-lg flex-shrink-0">
                      {winner.name ? winner.name.charAt(0).toUpperCase() : 'W'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-extrabold text-white text-sm truncate">{winner.name}</p>
                      <p className="text-xs text-slate-400 truncate">{winner.email}</p>
                      <div className="flex items-center gap-3 mt-1.5 text-xs">
                        <span className="font-black text-amber-400">{winner.totalScore} XP</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400">{winner.playedCount} Games</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* 3. Members Detailed Game Attempts & Last Active Table */}
        <section className="bg-[#181C3F] border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-400" /> Members&lsquo; Quiz Activity
                Details
              </h2>
              <p className="text-xs text-slate-400">
                Detailed play records with date, time, marks, and last active status
              </p>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search by player or quiz..."
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                className="pl-9 pr-4 py-1.5 bg-[#11142D] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#5B2EFF] w-full sm:w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#11142D] border-b border-slate-800 text-slate-400 uppercase tracking-wider font-extrabold">
                  <th className="py-3.5 px-4">Member Name</th>
                  <th className="py-3.5 px-4">Quiz Game Title</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Marks / Score</th>
                  <th className="py-3.5 px-4 text-center">Last Active Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 bg-[#161936] font-semibold">
                {filteredAttempts?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500 font-bold">
                      No game activities match your search.
                    </td>
                  </tr>
                ) : (
                  filteredAttempts?.map((attempt: any) => {
                    const u = typeof attempt.user === 'object' ? attempt.user : {}
                    const q = typeof attempt.quiz === 'object' ? attempt.quiz : {}

                    const uName = u?.name || 'Player'
                    const uPhone = u?.phone || u?.email || 'N/A'
                    const qTitle = q?.quizTitle || q?.title || 'Quiz Game'

                    const playDate = attempt.completedAt
                      ? new Date(attempt.completedAt)
                      : new Date(attempt.createdAt)

                    const activeStatus = getLastActiveStatus(u?.updatedAt || attempt.completedAt)

                    return (
                      <tr key={attempt.id} className="hover:bg-slate-800/40 transition">
                        {/* Member */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#5B2EFF]/20 border border-[#5B2EFF]/40 flex items-center justify-center font-extrabold text-[#5B2EFF] text-xs">
                              {uName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-extrabold text-white">{uName}</p>
                              <p className="text-[10px] text-slate-400">{uPhone}</p>
                            </div>
                          </div>
                        </td>

                        {/* Quiz Title */}
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-200">{qTitle}</span>
                        </td>

                        {/* Date & Time */}
                        <td className="py-3.5 px-4 text-slate-300">
                          <div className="flex flex-col">
                            <span className="font-bold text-xs">
                              {playDate.toLocaleDateString()}
                            </span>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-500" />
                              {playDate.toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </td>

                        {/* Marks & Time Taken */}
                        <td className="py-3.5 px-4">
                          <div>
                            <span className="font-black text-amber-400 text-sm">
                              +{attempt.score} XP
                            </span>
                            <p className="text-[10px] text-slate-400">
                              {attempt.correctAnswers}/{attempt.totalQuestions || 2} Correct (
                              {attempt.timeTaken || 0}s)
                            </p>
                          </div>
                        </td>

                        {/* Last Active Status */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#11142D] border border-slate-800">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                activeStatus.isOnline
                                  ? 'bg-emerald-400 animate-pulse'
                                  : 'bg-slate-500'
                              }`}
                            />
                            <span
                              className={`text-[11px] font-bold ${
                                activeStatus.isOnline ? 'text-emerald-400' : 'text-slate-400'
                              }`}
                            >
                              {activeStatus.label}
                            </span>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}
