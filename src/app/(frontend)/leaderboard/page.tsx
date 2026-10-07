import type { Metadata } from 'next/types'
import { getPayload } from 'payload'
import Link from 'next/link'
import configPromise from 'src/payload.config'
import AuthGuard from './AuthGuard'

export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Top Quiz Champions | Super Chennai Leaderboard',
  }
}

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams
  const payload = await getPayload({ config: configPromise })

  const pageParam = Number(resolvedSearchParams?.page) || 1
  const limit = 10
  const tab = (resolvedSearchParams?.tab as string) || 'all'

  const whereClause: Record<string, any> = {}

  if (tab !== 'all') {
    const now = new Date()
    let startDate = new Date()

    if (tab === 'daily') {
      startDate.setHours(0, 0, 0, 0)
    } else if (tab === 'weekly') {
      const day = startDate.getDay()
      const diff = startDate.getDate() - day + (day === 0 ? -6 : 1) // இந்த வாரத்தின் திங்கள் கிழமை
      startDate = new Date(startDate.setDate(diff))
      startDate.setHours(0, 0, 0, 0)
    } else if (tab === 'monthly') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1) // இந்த மாதத்தின் 1-ஆம் தேதி
      startDate.setHours(0, 0, 0, 0)
    }

    // `updatedAt` அல்லது `createdAt` அடிப்படையில் வடிகட்டுதல்
    whereClause.updatedAt = {
      greater_than_equal: startDate.toISOString(),
    }
  }

  // 🔍 2. Payload DB Query-இல் `where` Condition சேர்த்தல்
  const topUsersResult = await payload
    .find({
      collection: 'quiz-users',
      where: whereClause, // 💥 Added Date Filter Here
      sort: ['-totalXP', 'totalTimeTaken', 'createdAt'],
      limit: 20,
      overrideAccess: true,
    })
    .catch(() => ({ docs: [], totalDocs: 0 }))

  const topUsers = topUsersResult.docs || []

  // Rank 1, 2, 3 extraction for podium
  const rank1 = topUsers[0]
  const rank2 = topUsers[1]
  const rank3 = topUsers[2]

  // Time Formatter Function
  function formatTime(seconds: number): string {
    if (!seconds || seconds <= 0) return '0s'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    if (mins === 0) return `${secs}s`
    return `${mins}m ${secs}s`
  }

  return (
    <AuthGuard>
      <div className="min-h-screen text-slate-800 relative overflow-hidden py-12 px-4 sm:px-6 bg-[url('/images/gamingpagebgg.jpeg')] bg-no-repeat bg-cover bg-center padddingtopppp leaderrrboardddcontainerr">
        {/* <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-400/10 blur-[120px] pointer-events-none rounded-full" /> */}

        <div className="container mx-auto max-w-4xl relative z-10 space-y-6">
          <div className="bg-white/95 backdrop-blur-xl border border-white rounded-[28px] p-6 sm:p-10 shadow-xl shadow-purple-500/5">
            <Link
              href="/quizzes"
              className="px-4 py-2 bg-white/80 hover:bg-white text-slate-800 border border-slate-200 font-bold text-xs rounded-2xl shadow-xs transition inline-block mb-4"
            >
              Play Quizzes
            </Link>

            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-5xl font-black text-[#10145C] tracking-tight mb-2">
                Leaderboard
              </h1>
              <p className="text-slate-500 text-sm font-medium">
                Top scorers and champions across all Chennai quiz challenges.
              </p>
            </div>

            {/* FILTER TABS */}
            <div className="flex items-center justify-center gap-2 mb-10 overflow-x-auto pb-2 formflexstatt">
              {[
                { id: 'daily', label: 'Daily' },
                { id: 'weekly', label: 'Weekly' },
                { id: 'monthly', label: 'Monthly' },
                { id: 'all', label: 'All Time' },
              ].map((t) => {
                const isActive = tab === t.id
                return (
                  <Link
                    key={t.id}
                    href={`/leaderboard?tab=${t.id}`}
                    className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 whitespace-nowrap border ${
                      isActive
                        ? 'bg-gradient-to-r from-[#6D20FF] to-[#8a4fff] text-white border-transparent shadow-md shadow-purple-500/25 scale-105'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    {t.label}
                  </Link>
                )
              })}
            </div>

            {topUsers.length === 0 ? (
              <div className="text-center py-16 text-slate-400 font-medium">
                No champions ranked for this period yet. Play a game to claim your spot!
              </div>
            ) : (
              <>
                {/* TOP 3 PODIUM SECTION */}
                <div className="grid grid-cols-3 gap-3 sm:gap-6 items-end mb-12 pt-6 pb-4 leaderrboradflexx">
                  {/* RANK 2 (Left) */}
                  {rank2 ? (
                    <div className="flex flex-col items-center text-center transform translate-y-4 flexxxxxxs">
                      <div className="relative mb-3">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-200 border-4 border-[#9AA3B8] flex items-center justify-center text-slate-700 font-black text-xl sm:text-2xl shadow-md">
                          {rank2.name?.[0]?.toUpperCase() || 'P'}
                        </div>
                        <div className="absolute -bottom-2 -right-1 w-6 h-6 sm:w-7 sm:h-7 bg-[#9AA3B8] text-white font-black text-xs rounded-full flex items-center justify-center border-2 border-white shadow">
                          2
                        </div>
                      </div>
                      <p className="font-bold text-slate-900 text-xs sm:text-sm truncate max-w-[auto] sm:max-w-[auto]">
                        {rank2.name || 'Player 2'}
                      </p>
                      <div className="flex flex-wrap justify-center items-center gap-1 mt-1">
                        <span className="text-xs font-black text-[#9AA3B8]">
                          {rank2.totalXP || 0} XP
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-full border border-slate-200">
                          ⏱️ {formatTime((rank2 as any).totalTimeTaken || 0)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div />
                  )}

                  {/* RANK 1 (Center - Champion) */}
                  {rank1 ? (
                    <div className="flex flex-col items-center text-center z-10 -translate-y-4 flexxxxxxs">
                      <div className="relative mb-3">
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-amber-500 text-xl sm:text-2xl animate-bounce">
                          👑
                        </div>
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 border-4 border-[#F5A623] flex items-center justify-center text-white font-black text-2xl sm:text-3xl shadow-xl shadow-purple-500/20">
                          {rank1.name?.[0]?.toUpperCase() || 'C'}
                        </div>
                        <div className="absolute -bottom-2 -right-1 w-7 h-7 sm:w-8 sm:h-8 bg-[#F5A623] text-white font-black text-xs rounded-full flex items-center justify-center border-2 border-white shadow">
                          1
                        </div>
                      </div>
                      <p className="font-black text-slate-900 text-sm sm:text-base truncate max-w-[auto] sm:max-w-[auto]">
                        {rank1.name || 'Champion'}
                      </p>
                      <div className="flex flex-wrap justify-center items-center gap-1 mt-1">
                        <span className="text-xs sm:text-sm font-black text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                          {rank1.totalXP || 0} XP
                        </span>
                        <span className="text-[10px] sm:text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                          ⏱️ {formatTime((rank1 as any).totalTimeTaken || 0)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div />
                  )}

                  {/* RANK 3 (Right) */}
                  {rank3 ? (
                    <div className="flex flex-col items-center text-center transform translate-y-6 flexxxxxxs">
                      <div className="relative mb-3">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-100 border-4 border-[#C96A3A] flex items-center justify-center text-[#C96A3A] font-black text-xl sm:text-2xl shadow-md">
                          {rank3.name?.[0]?.toUpperCase() || 'P'}
                        </div>
                        <div className="absolute -bottom-2 -right-1 w-6 h-6 sm:w-7 sm:h-7 bg-[#C96A3A] text-white font-black text-xs rounded-full flex items-center justify-center border-2 border-white shadow">
                          3
                        </div>
                      </div>
                      <p className="font-bold text-slate-900 text-xs sm:text-sm truncate max-w-[auto] sm:max-w-[auto]">
                        {rank3.name || 'Player 3'}
                      </p>
                      <div className="flex flex-wrap justify-center items-center gap-1 mt-1">
                        <span className="text-xs font-black text-[#C96A3A]">
                          {rank3.totalXP || 0} XP
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-full border border-slate-200">
                          ⏱️ {formatTime((rank3 as any).totalTimeTaken || 0)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div />
                  )}
                </div>

                {/* LEADERBOARD TABLE */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 bg-[#f8f9fc] px-4 sm:px-6 py-3.5 text-xs font-extrabold text-[#10145C] border-b border-slate-200 tracking-wider">
                    <div className="col-span-2 sm:col-span-1">Rank</div>
                    <div className="col-span-5 sm:col-span-6">Player</div>
                    <div className="col-span-2 sm:col-span-2 text-center">Time ⏱️</div>
                    <div className="col-span-3 sm:col-span-3 text-right">Score</div>
                  </div>

                  {/* Table Body */}
                  <div className="divide-y divide-slate-100">
                    {topUsers.map((user: any, index: number) => {
                      const rank = index + 1
                      return (
                        <div
                          key={user.id || index}
                          className={`grid grid-cols-12 px-4 sm:px-6 py-4 items-center text-sm transition hover:bg-slate-50/80 tableeeviewwws ${
                            rank <= 3 ? 'bg-purple-50/20 font-semibold' : ''
                          }`}
                        >
                          {/* Rank */}
                          <div className="col-span-2 sm:col-span-1 font-black text-slate-700">
                            #{rank}
                          </div>

                          {/* User Profile */}
                          <div className="col-span-5 sm:col-span-6 flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs shrink-0 border border-indigo-200">
                              {user.name?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <span className="font-bold text-slate-900 truncate">
                              {user.name || user.email || 'Anonymous'}
                            </span>
                          </div>

                          {/* Time Taken Column */}
                          <div className="col-span-2 sm:col-span-2 text-center font-bold text-slate-500 text-xs sm:text-sm">
                            {formatTime(user.totalTimeTaken || 0)}
                          </div>

                          {/* XP Score Column */}
                          <div className="col-span-3 sm:col-span-3 text-right font-black text-purple-600">
                            {user.totalXP || 0}{' '}
                            <span className="text-xs font-normal text-slate-400">XP</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* PAGINATION CONTROLS */}
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    disabled={pageParam <= 1}
                    className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    ←
                  </button>
                  <div className="px-4 py-2 rounded-full bg-purple-600 text-white font-bold text-xs shadow-sm">
                    {pageParam}
                  </div>
                  <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition">
                    →
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
