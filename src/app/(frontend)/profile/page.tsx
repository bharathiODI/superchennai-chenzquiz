import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import { getGameDaySettings } from '@/utilities/getGameTimers'
import configPromise from '@payload-config'
import {
  ProfileHeaderCard,
  MyStatsSection,
  RankAndStreakSection,
  QuizHistorySection,
  ClimbLeaderboardBanner,
  AchievementsSection,
  type Achievement,
} from './components/ProfileLayouts'
import { getQuizTitles } from '@/utilities/getQuizTitles'
import { getTitleForXP } from '@/utilities/quizTitles'
import { LogoutButton } from './components/ClientActions'
import { calculateUserStats } from './lib/profile-stats'
import { realPlayersWhere } from '@/utilities/testPlayers'

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

  const attemptsRes = await payload.find({
    collection: 'quiz-attempts',
    where: {
      user: {
        equals: user.id,
      },
    },
    sort: '-completedAt',
    limit: 1000,
    overrideAccess: true,
  })

  const userXP = Number((user as any)?.totalXP || 0)
  // Rank among real players (test players are left out, as on the leaderboard)
  const higherXPUsers = await payload.count({
    collection: 'quiz-users',
    where: {
      and: [{ totalXP: { greater_than: userXP } }, realPlayersWhere],
    },
    overrideAccess: true,
  })

  // Rank = Higher XP Users + 1
  const currentRank = higherXPUsers.totalDocs + 1
  const attempts = attemptsRes.docs as any[]
  const userStats = calculateUserStats(attempts, userXP, await getGameDaySettings(payload))

  // Title (tier) from total XP - tiers are editable in admin (Globals > Quiz Titles)
  const titles = await getQuizTitles(payload)
  const tier = getTitleForXP(userXP, titles)
  const titleInfo = {
    name: tier.title.name,
    tierIndex: tier.tierIndex,
    tierCount: tier.tierCount,
    nextName: tier.next?.name ?? null,
    xpToNext: tier.xpToNext,
    progress: tier.progress,
  }

  const hasPerfectRound = attempts.some(
    (a) => Number(a.totalQuestions) > 0 && Number(a.correctAnswers) >= Number(a.totalQuestions),
  )
  const achievements: Achievement[] = [
    {
      key: 'first-quiz',
      label: 'First Steps',
      description: 'Play your first quiz',
      earned: userStats.quizzesPlayed >= 1,
      icon: 'rocket',
    },
    {
      key: 'explorer',
      label: 'Quiz Explorer',
      description: 'Play 10 quizzes',
      earned: userStats.quizzesPlayed >= 10,
      icon: 'compass',
    },
    {
      key: 'perfect',
      label: 'Perfect Round',
      description: 'Answer every question right',
      earned: hasPerfectRound,
      icon: 'target',
    },
    {
      key: 'streak-3',
      label: 'Streak Starter',
      description: 'Play 3 days in a row',
      earned: userStats.bestStreak >= 3,
      icon: 'flame',
    },
    {
      key: 'streak-7',
      label: 'Streak Master',
      description: 'Play 7 days in a row',
      earned: userStats.bestStreak >= 7,
      icon: 'zap',
    },
    ...titles.slice(1).map((t) => ({
      key: `title-${t.minXP}`,
      label: t.name,
      description: `Reach ${t.minXP} XP`,
      earned: userXP >= t.minXP,
      icon: 'title' as const,
    })),
  ]

  return (
    <div className="relative min-h-screen text-slate-800 pt-16 pb-24 border-t border-slate-100 bg-cover bg-center bg-no-repeat bg-fixed bg-[url('/app-images/background-one.png')]">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-100/40 via-purple-50/20 to-[#F8F8FC]" />
        <div className="absolute left-0 bottom-0 w-80 h-96 opacity-15 hidden lg:block bg-contain bg-no-repeat bg-left-bottom bg-[url('/images/chennai-landmarks-left.svg')]" />
        <div className="absolute right-0 bottom-0 w-96 h-96 opacity-15 hidden lg:block bg-contain bg-no-repeat bg-right-bottom bg-[url('/images/chennai-skyline-right.svg')]" />
      </div>
      <main className="relative z-10 max-w-[1100px] mx-auto px-4 md:px-6 pt-4 padddingtopppp">
        <ProfileHeaderCard user={user} titleInfo={titleInfo} />
        <MyStatsSection stats={userStats} />
        {/* <RankAndStreakSection stats={userStats} currentRank={currentRank} /> */}
        <AchievementsSection achievements={achievements} />
        <ClimbLeaderboardBanner currentRank={currentRank} />
        <QuizHistorySection attempts={attempts} />
        <LogoutButton />
      </main>
    </div>
  )
}
