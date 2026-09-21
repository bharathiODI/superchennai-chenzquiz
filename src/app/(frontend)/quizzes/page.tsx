import type { Metadata } from 'next/types'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from 'src/payload.config'

export const revalidate = 600

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Daily Quizzes & Brain Games | Super Chennai',
    description: 'Play daily games, earn XP points, and rank up on the Super Chennai leaderboard!',
  }
}

export default async function QuizzesPage() {
  const payload = await getPayload({ config: configPromise })
  const todayStr = new Date().toISOString().split('T')[0]

  const quizzes = await payload.find({
    collection: 'quizzes',
    where: {
      status: { equals: 'active' },
    },
    limit: 10,
    depth: 2,
    overrideAccess: true,
  })

  const todayQuiz = quizzes.docs?.[0]

  // console.log("todayQuiz",todayQuiz)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pt-16 pb-24 border-t border-slate-100">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 bg-white p-8 rounded-3xl shadow-sm border border-slate-200/80">
          <div>
            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 font-semibold text-xs rounded-full uppercase tracking-wider mb-3">
              ⚡ Daily Brain Challenge
            </span>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Super Chennai Quizzes
            </h1>
            <p className="text-slate-500 mt-2 text-base max-w-xl">
              Play today assigned interactive games, climb the local leaderboard, and claim your
              Chennai master badge!
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/leaderboard"
              className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition shadow-xs"
            >
              Leaderboard
            </Link>
          </div>
        </div>

        {todayQuiz ? (
          <div className="mb-14 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
              <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white font-medium text-xs rounded-full mb-4">
                TODAY SPECIAL •{' '}
                {todayQuiz.quizDate
                  ? new Date(todayQuiz.quizDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })
                  : todayStr}
              </span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 leading-tight">
                {todayQuiz.quizTitle}
              </h2>
              <p className="text-indigo-100 text-lg mb-8">
                Features {todayQuiz.questions?.length || 0} unique interactive games (MCQ, Wordle,
                Spot Lie & more).
              </p>

              {/* URL updated to use slug */}
              <Link
                href={`/play/${todayQuiz.slug}`}
                className="inline-flex items-center gap-3 px-8 py-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-lg rounded-2xl shadow-lg transition transform hover:-translate-y-1"
              >
                <span>Play Today Game Now</span>
                <span className="text-xl">➔</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border border-slate-800/80 rounded-3xl p-10 md:p-14 text-center shadow-2xl mb-12">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-md mx-auto flex flex-col items-center">
              <div className="relative mb-8 group cursor-pointer">
                <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-lg group-hover:scale-110 transition duration-500" />

                <div className="relative w-28 h-28 bg-slate-800/90 border border-slate-700/80 rounded-full flex items-center justify-center shadow-inner group-hover:border-indigo-500/50 transition duration-300">
                  <svg
                    className="w-14 h-14 text-indigo-400 group-hover:scale-110 group-hover:rotate-6 transition duration-300"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="3" ry="3" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />

                    <circle
                      cx="16"
                      cy="16"
                      r="4.5"
                      fill="#1e293b"
                      stroke="#818cf8"
                      strokeWidth="1.5"
                    />
                    <polyline points="16 13.5 16 16 17.5 17.5" stroke="#818cf8" strokeWidth="1.5" />
                  </svg>

                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500" />
                  </span>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                Daily Quiz Schedule
              </div>

              <h3 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tight">
                No Active Quiz Today
              </h3>

              <p className="text-slate-400 text-base leading-relaxed mb-8">
                We are preparing fresh challenges for today! Check back in a bit or explore previous
                quizzes from our collection.
              </p>
            </div>
          </div>
        )}

        <div>
          <h3 className="text-2xl font-black text-slate-900 mb-6">Recent Quizzes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.docs.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition"
              >
                <div>
                  <span className="text-xs font-semibold text-slate-400">
                    {new Date(quiz.createdAt).toLocaleDateString('en-IN')}
                  </span>
                  <h4 className="text-xl font-bold text-slate-800 mt-2 mb-2 line-clamp-2">
                    {quiz.quizTitle}
                  </h4>
                  <p className="text-slate-500 text-sm mb-6">
                    {Array.isArray(quiz.questions) ? quiz.questions.length : 0} Games included
                  </p>
                </div>
                {/* URL updated to use slug */}
                <Link
                  href={`/play/${quiz.slug}`}
                  className="w-full text-center py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition"
                >
                  Play Quiz
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
