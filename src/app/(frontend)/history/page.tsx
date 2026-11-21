import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, Trophy } from 'lucide-react'

export const metadata = {
  title: 'Full Quiz History | Super Chennai Trivia',
  description: 'View all your completed quiz challenges.',
}

export default async function HistoryPage() {
  const payload = await getPayload({ config: configPromise })
  const headersList = await headers()
  const { user } = await payload.auth({ headers: headersList })

  if (!user) {
    redirect('/login')
  }

  // Fetch ALL quiz attempts for this user (Limit: 1000)
  const attemptsRes = await payload.find({
    collection: 'quiz-attempts',
    where: {
      user: {
        equals: user.id,
      },
    },
    sort: '-completedAt',
    limit: 1000,
  })

  const attempts = attemptsRes.docs as any[]

  return (
    <div className="relative min-h-screen text-slate-800 pt-16 pb-24 bg-cover bg-center bg-no-repeat bg-fixed bg-[url('/app-images/background-one.png')]">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-100/40 via-purple-50/20 to-[#F8F8FC]" />
      </div>

      <main className="relative z-10 max-w-[1100px] mx-auto px-4 md:px-6 pt-6">
        {/* Header & Back Button */}
        <div className="flex items-center justify-between mb-8 bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-slate-100 shadow-xl">
          <div>
            <Link
              href="/profile"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5B2EFF] hover:underline mb-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Profile
            </Link>
            <h1 className="text-2xl md:text-3xl font-black text-[#11145A]">
              Complete Quiz History
            </h1>
            <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">
              Total {attempts.length} quiz attempts recorded
            </p>
          </div>
        </div>

        {/* History Records Container */}
        {attempts.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-lg">
            <div className="w-16 h-16 bg-indigo-50 text-[#5B2EFF] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              🎪
            </div>
            <h3 className="text-lg font-black text-[#11145A] mb-1">No quizzes played yet</h3>
            <p className="text-slate-400 text-sm mb-6">
              Start your first Chennai quiz challenge today!
            </p>
            <Link
              href="/quizzes"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#5B2EFF] hover:bg-[#4c22e0] text-white font-bold text-sm rounded-2xl shadow-lg transition"
            >
              Play Quiz
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-xl">
            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-4 font-bold">#</th>
                    <th className="pb-4 font-bold">Date</th>
                    <th className="pb-4 font-bold">Quiz Name</th>
                    <th className="pb-4 font-bold text-center">Score</th>
                    <th className="pb-4 font-bold text-right">Time Taken</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm font-semibold text-[#11145A]">
                  {attempts.map((item, index) => {
                    const formattedDate = new Date(item.completedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                    const mins = Math.floor(item.timeTaken / 60)
                    const secs = item.timeTaken % 60
                    const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`

                    const quizTitle =
                      typeof item.quiz === 'object' && item.quiz !== null
                        ? item.quiz.quizTitle || item.quiz.title || 'Chennai Special Challenge'
                        : 'Chennai Special Challenge'

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 text-slate-400 font-mono text-xs">{index + 1}</td>
                        <td className="py-4 text-slate-500 font-medium">{formattedDate}</td>
                        <td className="py-4 font-bold text-[#11145A]">{quizTitle}</td>
                        <td className="py-4 text-center">
                          <span className="px-3 py-1 bg-indigo-50 text-[#5B2EFF] font-black rounded-full text-xs">
                            {item.score} XP
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

            {/* Mobile Card View */}
            <div className="sm:hidden space-y-3">
              {attempts.map((item) => {
                const formattedDate = new Date(item.completedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
                const mins = Math.floor(item.timeTaken / 60)
                const secs = item.timeTaken % 60
                const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`

                const quizTitle =
                  typeof item.quiz === 'object' && item.quiz !== null
                    ? item.quiz.quizTitle || item.quiz.title || 'Chennai Special Challenge'
                    : 'Chennai Special Challenge'

                return (
                  <div
                    key={item.id}
                    className="p-4 bg-slate-50/80 border border-slate-100 rounded-2xl flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-sm text-[#11145A] mb-0.5">{quizTitle}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-2">
                        <span>{formattedDate}</span> • <span>⏱️ {formattedTime}</span>
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-[#5B2EFF] text-white font-black rounded-xl text-xs">
                      {item.score} XP
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}