// src/app/(frontend)/profile/page.tsx
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import {
  ProfileHeaderCard,
  MyStatsSection,
  RankAndStreakSection,
  QuizHistorySection,
} from './components/ProfileLayouts'
import { LogoutButton } from './components/ClientActions'
import { calculateUserStats } from './lib/profile-stats'

export const metadata = {
  title: 'My Profile | Super Chennai Trivia',
  description: 'View your quiz statistics, rank, streak and attempt history.',
}

export default async function ProfilePage() {
  const payload = await getPayload({ config: configPromise })
  const headersList = await headers()
  const { user } = await payload.auth({ headers: headersList })

  // Protect server route
  if (!user) {
    redirect('/login')
  }

  // Fetch only this authenticated user's attempts
  const attemptsRes = await payload.find({
    collection: 'quiz-attempts',
    where: {
      user: {
        equals: user.id,
      },
    },
    sort: '-completedAt',
    limit: 10,
  })

  const attempts = attemptsRes.docs as any[]
  const userStats = calculateUserStats(attempts)

  return (
    <div className="relative min-h-screen bg-[#F8F8FC] overflow-x-hidden font-sans pb-16">
 
      {/* 1. CHENNAI THEMED ILLUSTRATED BACKGROUND OVERLAY */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
        {/* Soft Sky Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-100/40 via-purple-50/20 to-[#F8F8FC]" />

        {/* Left Chennai Landmark Vector (Kapaleeshwarar Temple / Central Tower visual outline) */}
        <div className="absolute left-0 bottom-0 w-80 h-96 opacity-15 hidden lg:block bg-contain bg-no-repeat bg-left-bottom bg-[url('/images/chennai-landmarks-left.svg')]" />

        {/* Right Marina Beach Skyline Vector (Lighthouse / Coastline visual outline) */}
        <div className="absolute right-0 bottom-0 w-96 h-96 opacity-15 hidden lg:block bg-contain bg-no-repeat bg-right-bottom bg-[url('/images/chennai-skyline-right.svg')]" />
      </div>

      {/* 2. HEADER BRANDING BAR */}
      <header className="relative z-10 max-w-6xl mx-auto px-4 pt-6 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="leading-none font-black text-[#11145A] tracking-tighter text-xl">
            SUPER
            <br />
            <span className="text-[#5B2EFF]">CHENNAI</span>
          </div>
        </div>
        <div className="text-right">
          <p className="font-extrabold text-[#11145A] text-sm md:text-base leading-tight">
            Chennai
          </p>
          {/* <p className="text-xs text-slate-400 font-semibold italic">"Always a Good Idea"</p> */}
        </div>
      </header>

      {/* 3. MAIN CENTERED CONTENT CONTAINER */}
      <main className="relative z-10 max-w-[1100px] mx-auto px-4 md:px-6 pt-4">
        {/* Profile Card */}
        <ProfileHeaderCard user={user} />

        {/* Stats Grid */}
        <MyStatsSection stats={userStats} />

        {/* Rank + Streak Dual Columns */}
        <RankAndStreakSection stats={userStats} />

        {/* Quiz Attempts History */}
        <QuizHistorySection attempts={attempts} />

        {/* Dynamic Safe Logout */}
        <LogoutButton />
      </main>
    </div>
  )
}
