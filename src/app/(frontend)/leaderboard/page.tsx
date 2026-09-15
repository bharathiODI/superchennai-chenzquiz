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

//   // Fetch submissions with depth to expand User, Quiz, and Answers details
//   const submissions = await payload.find({
//     collection: 'user-submissions',
//     depth: 3, // Important: Populates relational data
//     limit: 50,
//     sort: '-createdAt',
//     overrideAccess: true,
//   })

//   // Fetch Top Users
//   const topUsers = await payload.find({
//     collection: 'quiz-users',
//     sort: '-totalXP',
//     limit: 20,
//     overrideAccess: true,
//   })

//   return (
//     <div className="min-h-screen bg-slate-50 text-slate-800 pt-16 pb-24">
//       <div className="container mx-auto px-4 max-w-5xl space-y-12">

//         {/* Top Leaderboard Summary */}
//         <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs">
//           <h1 className="text-3xl font-black text-slate-900 mb-2">🏆 Champions Leaderboard</h1>
//           <p className="text-slate-500 text-sm mb-6">Overall top points holders across all game types.</p>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             {topUsers.docs.slice(0, 3).map((user, idx) => (
//               <div key={user.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-4">
//                 <span className="text-2xl font-black text-indigo-600">#{idx + 1}</span>
//                 <div>
//                   <p className="font-bold text-slate-900">{user.name}</p>
//                   <p className="text-xs font-semibold text-amber-600">{user.totalXP || 0} XP</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Detailed Gameplay Activity Log */}
//         <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs">
//           <h2 className="text-2xl font-black text-slate-900 mb-6">🎮 Live Game Submissions & History</h2>

//           <div className="space-y-6">
//             {submissions.docs.map((sub: any) => (
//               <div key={sub.id} className="border border-slate-200 rounded-2xl p-6 bg-slate-50">
//                 <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-200">
//                   <div>
//                     <span className="font-bold text-slate-900 text-lg">{sub.user?.name || 'Anonymous User'}</span>
//                     <span className="text-xs text-slate-400 block">{new Date(sub.createdAt).toLocaleString('en-IN')}</span>
//                   </div>
//                   <span className="bg-emerald-100 text-emerald-800 font-black px-4 py-1.5 rounded-full text-sm">
//                     +{sub.score || 0} XP
//                   </span>
//                 </div>

//                 {/* Individual Question/Game Breakdowns */}
//                 <div className="space-y-3">
//                   {sub.answers?.map((ans: any, index: number) => (
//                     <div key={index} className="bg-white p-4 rounded-xl border border-slate-200/80 flex items-start justify-between gap-4">
//                       <div>
//                         <div className="flex items-center gap-2 mb-1">
//                           <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-black uppercase rounded-md">
//                             {ans.gameType || 'GAME'}
//                           </span>
//                           <span className="text-xs font-bold text-slate-700">{ans.questionTitle}</span>
//                         </div>
//                         <p className="text-xs text-slate-500">
//                           User Input/Selection: <span className="font-mono font-bold text-slate-800">{ans.userAnswer}</span>
//                         </p>
//                       </div>

//                       <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
//                         ans.isCorrect ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
//                       }`}>
//                         {ans.isCorrect ? '✓ Correct' : '✕ Wrong'}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//       </div>
//     </div>
//   )
// }

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

export default async function LeaderboardPage() {
  const payload = await getPayload({ config: configPromise })

  // Fetch submissions with depth 3 for relational lookup
  const submissionsResult = await payload
    .find({
      collection: 'user-submissions',
      depth: 3,
      limit: 50,
      sort: '-createdAt',
      overrideAccess: true,
    })
    .catch(() => ({ docs: [] }))

  // Fetch Top Leaderboard Users
  const topUsersResult = await payload
    .find({
      collection: 'quiz-users',
      sort: '-totalXP',
      limit: 20,
      overrideAccess: true,
    })
    .catch(() => ({ docs: [] }))

  const submissions = submissionsResult.docs || []
  const topUsers = topUsersResult.docs || []

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pt-16 pb-24">
      <div className="container mx-auto px-4 max-w-5xl space-y-12">
        {/* Top Leaderboard Summary */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs">
          <h1 className="text-3xl font-black text-slate-900 mb-2">🏆 Champions Leaderboard</h1>
          <p className="text-slate-500 text-sm mb-6">
            Overall top points holders across all game types.
          </p>

          {topUsers.length === 0 ? (
            <p className="text-slate-400 text-sm italic">
              No users ranked yet. Play a game to get on top!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topUsers.slice(0, 3).map((user: any, idx: number) => (
                <div
                  key={user.id || idx}
                  className="p-5 bg-gradient-to-br from-slate-50 to-indigo-50/30 border border-slate-200 rounded-2xl flex items-center gap-4"
                >
                  <span className="text-3xl font-black text-indigo-600">#{idx + 1}</span>
                  <div>
                    <p className="font-bold text-slate-900">
                      {user.name || user.email || 'Anonymous Player'}
                    </p>
                    <p className="text-xs font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md inline-block mt-1">
                      {user.totalXP || 0} XP
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detailed Gameplay Activity Log */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                🎮 Live Submissions & Gameplay History
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Real-time breakdown of user answers and earned points.
              </p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition"
            >
              Play More Quizzes
            </Link>
          </div>

          {submissions.length === 0 ? (
            <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-medium">
              No game submissions found yet. Finish a quiz to record your activity!
            </div>
          ) : (
            <div className="space-y-6">
              {submissions.map((sub: any) => {
                const quizName =
                  typeof sub.quiz === 'object'
                    ? sub.quiz?.quizTitle || sub.quiz?.title
                    : 'Chennai Quiz'
                const userName =
                  typeof sub.user === 'object'
                    ? sub.user?.name || sub.user?.email
                    : 'Anonymous Gamer'
                const formattedDate = sub.createdAt
                  ? new Date(sub.createdAt).toLocaleString('en-IN')
                  : 'Just now'

                return (
                  <div
                    key={sub.id}
                    className="border border-slate-200 rounded-2xl p-6 bg-slate-50/70 hover:bg-slate-50 transition"
                  >
                    <div className="flex flex-wrap justify-between items-center mb-4 pb-3 border-b border-slate-200 gap-2">
                      <div>
                        <span className="font-extrabold text-slate-900 text-base">{userName}</span>
                        <span className="ml-2 text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                          {quizName}
                        </span>
                        <span className="text-xs text-slate-400 block mt-0.5">{formattedDate}</span>
                      </div>
                      <span className="bg-emerald-500 text-white font-black px-4 py-1.5 rounded-2xl text-sm shadow-xs">
                        +{sub.score || 0} XP
                      </span>
                    </div>

                    {/* Individual Question/Game Breakdowns */}
                    <div className="space-y-3">
                      {sub.answers?.map((ans: any, index: number) => (
                        <div
                          key={index}
                          className="bg-white p-4 rounded-xl border border-slate-200/80 flex items-start justify-between gap-4 shadow-2xs"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-black uppercase rounded-md tracking-wider">
                                {ans.gameType ? ans.gameType.replace('_', ' ') : 'GAME'}
                              </span>
                              <span className="text-xs font-bold text-slate-800">
                                {ans.questionTitle || ans.title || `Question ${index + 1}`}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500">
                              Answered:{' '}
                              <span className="font-mono font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded">
                                {ans.userAnswer || '-'}
                              </span>
                            </p>
                          </div>

                          <span
                            className={`text-xs font-bold px-3 py-1 rounded-lg shrink-0 ${
                              ans.isCorrect
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {ans.isCorrect ? '✓ Correct' : '✕ Wrong'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
