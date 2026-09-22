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

  if (!user) {
    redirect('/login')
  }

  // 1. Get All User Attempts
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

  // 2. Calculate Rank based on Total XP
  const userXP = Number((user as any)?.totalXP || 0)

  // High XP Users counting for Rank
  const higherXPUsers = await payload.count({
    collection: 'quiz-users',
    where: {
      totalXP: {
        greater_than: userXP,
      },
    },
  })

  // Rank = Higher XP Users + 1
  const currentRank = higherXPUsers.totalDocs + 1

  const attempts = attemptsRes.docs as any[]
  const userStats = calculateUserStats(attempts)

  return (
    <div className="relative min-h-screen text-slate-800 pt-16 pb-24 border-t border-slate-100 bg-cover bg-center bg-no-repeat bg-fixed bg-[url('/app-images/background-three.png')]">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-100/40 via-purple-50/20 to-[#F8F8FC]" />
        <div className="absolute left-0 bottom-0 w-80 h-96 opacity-15 hidden lg:block bg-contain bg-no-repeat bg-left-bottom bg-[url('/images/chennai-landmarks-left.svg')]" />
        <div className="absolute right-0 bottom-0 w-96 h-96 opacity-15 hidden lg:block bg-contain bg-no-repeat bg-right-bottom bg-[url('/images/chennai-skyline-right.svg')]" />
      </div>
      <main className="relative z-10 max-w-[1100px] mx-auto px-4 md:px-6 pt-4">
        <ProfileHeaderCard user={user} />
        <MyStatsSection stats={userStats} />
        <RankAndStreakSection stats={userStats} currentRank={currentRank} />
        <QuizHistorySection attempts={attempts} />
        <LogoutButton />
      </main>
    </div>
  )
}
