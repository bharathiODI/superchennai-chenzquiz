'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Trophy, User, LogOut, LogIn } from 'lucide-react'

export default function QuizHeader() {
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        setUser(null)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    router.push('/login')
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 bg-white p-8 rounded-3xl shadow-sm border border-slate-200/80">
      <div>
        <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 font-semibold text-xs rounded-full uppercase tracking-wider mb-3">
          ⚡ Daily Brain Challenge
        </span>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Super Chennai Quizzes</h1>
        <p className="text-slate-500 mt-2 text-base max-w-xl">
          Play today assigned interactive games, climb the local leaderboard, and claim your Chennai
          master badge!
        </p>
      </div>

      <div className="flex items-center flex-wrap gap-3">
        {/* Leaderboard Button */}
        <Link
          href="/leaderboard"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition shadow-xs cursor-pointer"
        >
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>Leaderboard</span>
        </Link>

        {user ? (
          <>
            {/* Profile Button */}
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-sm transition border border-indigo-100 shadow-xs cursor-pointer"
            >
              <User className="w-4 h-4 text-indigo-600" />
              <span className="max-w-[120px] truncate">{user.name || 'Profile'}</span>
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-sm transition border border-rose-100 cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </>
        ) : (
          /* Login Button if not authenticated */
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#4B20D8] hover:bg-[#3215A8] text-white font-bold text-sm transition shadow-md shadow-indigo-200 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Login / Register</span>
          </Link>
        )}
      </div>
    </div>
  )
}
