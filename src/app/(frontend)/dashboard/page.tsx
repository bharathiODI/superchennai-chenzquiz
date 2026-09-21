'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Users,
  Trophy,
  Award,
  HelpCircle,
  PlayCircle,
  TrendingUp,
  Crown,
  ShieldCheck,
  Search,
  CheckCircle2,
  Calendar,
  LogOut,
} from 'lucide-react'

export default function AdminDashboardPage() {
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchUser, setSearchUser] = useState('')

  useEffect(() => {
    async function fetchAdminStats() {
      try {
        const res = await fetch('/api/dashboard-stats')
        if (!res.ok) {
          router.push('/admin')
          return
        }
        console.log("resdsfsdfsdf",res)
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

  const filteredUsers = data?.recentUsers?.filter(
    (u: any) =>
      u.name?.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchUser.toLowerCase()),
  )

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

        {/* 2. Top Play Winners (Leaderboard Section) */}
        <section className="bg-[#181C3F] border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Crown className="w-6 h-6 text-amber-400" />
              <h2 className="text-xl font-extrabold text-white">Top Play Winners (Leaderboard)</h2>
            </div>
            <span className="text-xs font-bold bg-amber-400/10 text-amber-400 border border-amber-400/20 px-3 py-1 rounded-full">
              Ranked by XP Points
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.topWinners?.slice(0, 6).map((winner: any, index: number) => {
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
                    {winner.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-extrabold text-white text-sm truncate">{winner.name}</p>
                    <p className="text-xs text-slate-400 truncate">{winner.email}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs">
                      <span className="font-black text-amber-400">{winner.totalScore} XP</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400">{winner.playedCount} Plays</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* 3. User Management & Recent Quiz Plays */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User List */}
          <section className="bg-[#181C3F] border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" /> Users List
              </h2>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search user..."
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  className="pl-9 pr-4 py-1.5 bg-[#11142D] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#5B2EFF]"
                />
              </div>
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase">
                    <th className="py-3 px-2">User</th>
                    <th className="py-3 px-2">Role</th>
                    <th className="py-3 px-2">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-semibold">
                  {filteredUsers?.map((u: any) => (
                    <tr key={u.id} className="hover:bg-slate-800/30">
                      <td className="py-3 px-2 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white text-xs">
                          {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-white">{u.name || 'User'}</p>
                          <p className="text-[10px] text-slate-400">{u.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                            u.roles?.includes('admin')
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {u.roles?.includes('admin') ? 'ADMIN' : 'PLAYER'}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-slate-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Recent Quiz Attempts */}
          <section className="bg-[#181C3F] border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col">
            <h2 className="text-xl font-extrabold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" /> Recent Quiz Activity
            </h2>

            <div className="space-y-3 flex-1">
              {data?.recentAttempts?.map((attempt: any) => {
                const uName = typeof attempt.user === 'object' ? attempt.user?.name : 'Player'
                const qTitle = typeof attempt.quiz === 'object' ? attempt.quiz?.title : 'Quiz'

                return (
                  <div
                    key={attempt.id}
                    className="p-3.5 bg-[#11142D] border border-slate-800 rounded-2xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-white">{uName}</p>
                      <p className="text-slate-400 text-[11px]">{qTitle}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-amber-400 text-sm block">
                        +{attempt.score} XP
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(attempt.completedAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
