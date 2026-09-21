import type { Metadata } from 'next/types'
import { getPayload } from 'payload'
import configPromise from 'src/payload.config'
import QuizCountdown from './QuizCountdown'
import QuizHeader from './QuizHeader'

export const revalidate = 600

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Daily Quizzes & Brain Games | Super Chennai',
    description: 'Play daily games, earn XP points, and rank up on the Super Chennai leaderboard!',
  }
}

export default async function QuizzesPage() {
  const payload = await getPayload({ config: configPromise })

  const quizzes = await payload.find({
    collection: 'quizzes',
    where: {
      status: { equals: 'active' },
    },
    sort: 'quizDate',
    limit: 10,
    depth: 2,
    overrideAccess: true,
  })

  const todayQuiz = quizzes.docs?.[0]

  return (
    /* BACKGROUND IMAGE STYLES ADDED HERE */
    <div className="relative min-h-screen text-slate-800 pt-16 pb-24 border-t border-slate-100 bg-cover bg-center bg-no-repeat bg-fixed bg-[url('/app-images/background-one.png')]">
      {/* Light Overlay for readability (optional: change bg-slate-50/90 if needed) */}
      {/* <div className="absolute inset-0 bg-slate-50/85 backdrop-blur-[2px] pointer-events-none" /> */}

      {/* Main Content Container (relative z-10 added so content stays above overlay) */}
      <div className="relative z-10 container mx-auto px-4 max-w-7xl ">
        <QuizHeader />

        {todayQuiz ? (
          <QuizCountdown
            quizDate={todayQuiz.quizDate}
            slug={todayQuiz.slug}
            questionCount={todayQuiz.questions?.length || 0}
            quizTitle={todayQuiz.quizTitle}
          />
        ) : (
          <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border border-slate-800/80 rounded-3xl p-10 md:p-14 text-center shadow-2xl mb-12 ">
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
                No Active Quiz Scheduled
              </h3>

              <p className="text-slate-400 text-base leading-relaxed mb-8">
                We are preparing fresh challenges! Check back in a bit or explore previous quizzes.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

