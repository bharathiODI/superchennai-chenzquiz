import type { Metadata } from 'next/types'
import { getPayload } from 'payload'
import Link from 'next/link'
import configPromise from 'src/payload.config'

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

  // Pagination & Filter state from URL if applicable
  const pageParam = Number(resolvedSearchParams?.page) || 1
  const limit = 10
  const tab = (resolvedSearchParams?.tab as string) || 'all'

  // Fetch Top Leaderboard Users using Payload query
  const topUsersResult = await payload
    .find({
      collection: 'quiz-users',
      sort: '-totalXP',
      limit: 20,
      overrideAccess: true,
    })
    .catch(() => ({ docs: [], totalDocs: 0 }))

  const topUsers = topUsersResult.docs || []

  // Rank 1, 2, 3 extraction for podium
  const rank1 = topUsers[0]
  const rank2 = topUsers[1]
  const rank3 = topUsers[2]
  const remainingUsers = topUsers.slice(3)

  return (
    <div className="min-h-screen  text-slate-800 relative overflow-hidden py-12 px-4 sm:px-6 bg-[url('/app-images/background-three.png')]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-400/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="container mx-auto max-w-4xl relative z-10 space-y-6">
        <div className="bg-white/95 backdrop-blur-xl border border-white rounded-[28px] p-6 sm:p-10 shadow-xl shadow-purple-500/5">
          <Link
            href="/quizzes"
            className="px-4 py-2 bg-white/80 hover:bg-white text-slate-800 border border-slate-200 font-bold text-xs rounded-2xl shadow-xs transition"
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
          <div className="flex items-center justify-center gap-2 mb-10 overflow-x-auto pb-2">
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
              No champions ranked yet. Play a game to claim your spot!
            </div>
          ) : (
            <>
              {/* TOP 3 PODIUM SECTION */}
              <div className="grid grid-cols-3 gap-3 sm:gap-6 items-end mb-12 pt-6 pb-4">
                {/* RANK 2 (Left) */}
                {rank2 ? (
                  <div className="flex flex-col items-center text-center transform translate-y-4">
                    <div className="relative mb-3">
                      {/* Laurel / Ring accent */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-200 border-4 border-[#9AA3B8] flex items-center justify-center text-slate-700 font-black text-xl sm:text-2xl shadow-md">
                        {rank2.name?.[0]?.toUpperCase() || 'P'}
                      </div>
                      <div className="absolute -bottom-2 -right-1 w-6 h-6 sm:w-7 sm:h-7 bg-[#9AA3B8] text-white font-black text-xs rounded-full flex items-center justify-center border-2 border-white shadow">
                        2
                      </div>
                    </div>
                    <p className="font-bold text-slate-900 text-xs sm:text-sm truncate max-w-[100px] sm:max-w-[140px]">
                      {rank2.name || 'Player 2'}
                    </p>
                    <p className="text-xs font-black text-[#9AA3B8] mt-0.5">
                      {rank2.totalXP || 0} XP
                    </p>
                  </div>
                ) : (
                  <div />
                )}

                {/* RANK 1 (Center - Prominent) */}
                {rank1 ? (
                  <div className="flex flex-col items-center text-center z-10 -translate-y-4">
                    <div className="relative mb-3">
                      {/* Crown */}
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-amber-500 text-xl sm:text-2xl animate-bounce">
                        👑
                      </div>
                      {/* Avatar */}
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 border-4 border-[#F5A623] flex items-center justify-center text-white font-black text-2xl sm:text-3xl shadow-xl shadow-purple-500/20">
                        {rank1.name?.[0]?.toUpperCase() || 'C'}
                      </div>
                      <div className="absolute -bottom-2 -right-1 w-7 h-7 sm:w-8 sm:h-8 bg-[#F5A623] text-white font-black text-xs rounded-full flex items-center justify-center border-2 border-white shadow">
                        1
                      </div>
                    </div>
                    <p className="font-black text-slate-900 text-sm sm:text-base truncate max-w-[120px] sm:max-w-[160px]">
                      {rank1.name || 'Champion'}
                    </p>
                    <p className="text-xs sm:text-sm font-black text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full mt-1 border border-amber-200">
                      {rank1.totalXP || 0} XP
                    </p>
                  </div>
                ) : (
                  <div />
                )}

                {/* RANK 3 (Right) */}
                {rank3 ? (
                  <div className="flex flex-col items-center text-center transform translate-y-6">
                    <div className="relative mb-3">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-100 border-4 border-[#C96A3A] flex items-center justify-center text-[#C96A3A] font-black text-xl sm:text-2xl shadow-md">
                        {rank3.name?.[0]?.toUpperCase() || 'P'}
                      </div>
                      <div className="absolute -bottom-2 -right-1 w-6 h-6 sm:w-7 sm:h-7 bg-[#C96A3A] text-white font-black text-xs rounded-full flex items-center justify-center border-2 border-white shadow">
                        3
                      </div>
                    </div>
                    <p className="font-bold text-slate-900 text-xs sm:text-sm truncate max-w-[100px] sm:max-w-[140px]">
                      {rank3.name || 'Player 3'}
                    </p>
                    <p className="text-xs font-black text-[#C96A3A] mt-0.5">
                      {rank3.totalXP || 0} XP
                    </p>
                  </div>
                ) : (
                  <div />
                )}
              </div>

              {/* LEADERBOARD TABLE */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                <div className="grid grid-cols-12 bg-[#f8f9fc] px-4 sm:px-6 py-3.5 text-xs font-extrabold text-[#10145C] border-b border-slate-200 tracking-wider">
                  <div className="col-span-2 sm:col-span-1">Rank</div>
                  <div className="col-span-6 sm:col-span-7">Player</div>
                  <div className="col-span-4 sm:col-span-4 text-right">Score</div>
                </div>

                <div className="divide-y divide-slate-100">
                  {topUsers.map((user: any, index: number) => {
                    const rank = index + 1
                    return (
                      <div
                        key={user.id || index}
                        className={`grid grid-cols-12 px-4 sm:px-6 py-4 items-center text-sm transition hover:bg-slate-50/80 ${
                          rank <= 3 ? 'bg-purple-50/20 font-semibold' : ''
                        }`}
                      >
                        <div className="col-span-2 sm:col-span-1 font-black text-slate-700">
                          #{rank}
                        </div>
                        <div className="col-span-6 sm:col-span-7 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs shrink-0 border border-indigo-200">
                            {user.name?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <span className="font-bold text-slate-900 truncate">
                            {user.name || user.email || 'Anonymous'}
                          </span>
                        </div>
                        <div className="col-span-4 sm:col-span-4 text-right font-black text-purple-600">
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
  )
}

// import type { Metadata } from 'next/types'
// import { getPayload } from 'payload'
// import Link from 'next/link'
// import configPromise from 'src/payload.config'

// export const revalidate = 0

// export async function generateMetadata(): Promise<Metadata> {
//   return {
//     title: 'Top Quiz Champions | Super Chennai Leaderboard',
//   }
// }

// export default async function LeaderboardPage() {
//   const payload = await getPayload({ config: configPromise })

//   // Fetch submissions with depth 3 for relational lookup
//   const submissionsResult = await payload
//     .find({
//       collection: 'user-submissions',
//       depth: 3,
//       limit: 50,
//       sort: '-createdAt',
//       overrideAccess: true,
//     })
//     .catch(() => ({ docs: [] }))

//   // Fetch Top Leaderboard Users
//   const topUsersResult = await payload
//     .find({
//       collection: 'quiz-users',
//       sort: '-totalXP',
//       limit: 20,
//       overrideAccess: true,
//     })
//     .catch(() => ({ docs: [] }))

//   const submissions = submissionsResult.docs || []
//   const topUsers = topUsersResult.docs || []

//   return (
//     <div className="min-h-screen bg-slate-50 text-slate-800 pt-16 pb-24">
//       <div className="container mx-auto px-4 max-w-5xl space-y-12">
//         {/* Top Leaderboard Summary */}
//         <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs">
//           <h1 className="text-3xl font-black text-slate-900 mb-2">🏆 Champions Leaderboard</h1>
//           <p className="text-slate-500 text-sm mb-6">
//             Overall top points holders across all game types.
//           </p>

//           {topUsers.length === 0 ? (
//             <p className="text-slate-400 text-sm italic">
//               No users ranked yet. Play a game to get on top!
//             </p>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               {topUsers.slice(0, 3).map((user: any, idx: number) => (
//                 <div
//                   key={user.id || idx}
//                   className="p-5 bg-gradient-to-br from-slate-50 to-indigo-50/30 border border-slate-200 rounded-2xl flex items-center gap-4"
//                 >
//                   <span className="text-3xl font-black text-indigo-600">#{idx + 1}</span>
//                   <div>
//                     <p className="font-bold text-slate-900">
//                       {user.name || user.email || 'Anonymous Player'}
//                     </p>
//                     <p className="text-xs font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md inline-block mt-1">
//                       {user.totalXP || 0} XP
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Detailed Gameplay Activity Log */}
//         <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs">
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h2 className="text-2xl font-black text-slate-900">
//                 🎮 Live Submissions & Gameplay History
//               </h2>
//               <p className="text-xs text-slate-400 mt-1">
//                 Real-time breakdown of user answers and earned points.
//               </p>
//             </div>
//             <Link
//               href="/"
//               className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition"
//             >
//               Play More Quizzes
//             </Link>
//           </div>

//           {submissions.length === 0 ? (
//             <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-medium">
//               No game submissions found yet. Finish a quiz to record your activity!
//             </div>
//           ) : (
//             <div className="space-y-6">
//               {submissions.map((sub: any) => {
//                 const quizName =
//                   typeof sub.quiz === 'object'
//                     ? sub.quiz?.quizTitle || sub.quiz?.title
//                     : 'Chennai Quiz'
//                 const userName =
//                   typeof sub.user === 'object'
//                     ? sub.user?.name || sub.user?.email
//                     : 'Anonymous Gamer'
//                 const formattedDate = sub.createdAt
//                   ? new Date(sub.createdAt).toLocaleString('en-IN')
//                   : 'Just now'

//                 return (
//                   <div
//                     key={sub.id}
//                     className="border border-slate-200 rounded-2xl p-6 bg-slate-50/70 hover:bg-slate-50 transition"
//                   >
//                     <div className="flex flex-wrap justify-between items-center mb-4 pb-3 border-b border-slate-200 gap-2">
//                       <div>
//                         <span className="font-extrabold text-slate-900 text-base">{userName}</span>
//                         <span className="ml-2 text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
//                           {quizName}
//                         </span>
//                         <span className="text-xs text-slate-400 block mt-0.5">{formattedDate}</span>
//                       </div>
//                       <span className="bg-emerald-500 text-white font-black px-4 py-1.5 rounded-2xl text-sm shadow-xs">
//                         +{sub.score || 0} XP
//                       </span>
//                     </div>

//                     {/* Individual Question/Game Breakdowns */}
//                     <div className="space-y-3">
//                       {sub.answers?.map((ans: any, index: number) => (
//                         <div
//                           key={index}
//                           className="bg-white p-4 rounded-xl border border-slate-200/80 flex items-start justify-between gap-4 shadow-2xs"
//                         >
//                           <div className="space-y-1">
//                             <div className="flex items-center gap-2">
//                               <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-black uppercase rounded-md tracking-wider">
//                                 {ans.gameType ? ans.gameType.replace('_', ' ') : 'GAME'}
//                               </span>
//                               <span className="text-xs font-bold text-slate-800">
//                                 {ans.questionTitle || ans.title || `Question ${index + 1}`}
//                               </span>
//                             </div>
//                             <p className="text-xs text-slate-500">
//                               Answered:{' '}
//                               <span className="font-mono font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded">
//                                 {ans.userAnswer || '-'}
//                               </span>
//                             </p>
//                           </div>

//                           <span
//                             className={`text-xs font-bold px-3 py-1 rounded-lg shrink-0 ${
//                               ans.isCorrect
//                                 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
//                                 : 'bg-rose-50 text-rose-700 border border-rose-200'
//                             }`}
//                           >
//                             {ans.isCorrect ? '✓ Correct' : '✕ Wrong'}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )
//               })}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }
