/* eslint-disable @next/next/no-img-element */
import { getNow } from '@/utilities/clock'
import type { Metadata } from 'next/types'
import { getPayload } from 'payload'
import Link from 'next/link'
import configPromise from 'src/payload.config'
import { CalendarDays, CalendarRange, Crown, Flame, Sun } from 'lucide-react'
import AuthGuard from './AuthGuard'
import { Laurel, TitleBadge } from '@/components/quiz/TitleBadge'
import { getQuizTitles } from '@/utilities/getQuizTitles'
import { isTestPhone, realPlayersWhere } from '@/utilities/testPlayers'
import { getQuizSiteSettings } from '@/globals/QuizSiteSettings/getQuizSiteSettings'
import { getTitleForXP, type QuizTitle } from '@/utilities/quizTitles'
import { computeStreaks } from '@/utilities/quizStreak'
import { gameDayKey } from '@/utilities/gameDay'
import { getGameDaySettings } from '@/utilities/getGameTimers'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Top Quiz Champions | Super Chennai Leaderboard',
  }
}

type Tab = 'daily' | 'weekly' | 'monthly' | 'all'

/** The leaderboard is public: it lists only this many players, on every tab. */
const TOP_PLAYERS = 50

const TABS: { id: Tab; label: string; icon: typeof Sun; xpLabel: string }[] = [
  { id: 'daily', label: 'Daily', icon: Sun, xpLabel: 'XP (Today)' },
  { id: 'weekly', label: 'Weekly', icon: CalendarDays, xpLabel: 'XP (This Week)' },
  { id: 'monthly', label: 'Monthly', icon: CalendarRange, xpLabel: 'XP (This Month)' },
  { id: 'all', label: 'All Time', icon: Crown, xpLabel: 'XP (All Time)' },
]

type Ranked = {
  id: string
  xp: number
  timeTaken: number
  name: string
}

type Player = Ranked & {
  rank: number
  avatarUrl: string | null
  overallXP: number
  streak: number
  title: ReturnType<typeof getTitleForXP>
}

function relId(value: unknown): string | null {
  if (value === null || value === undefined) return null
  if (typeof value === 'object') {
    const id = (value as { id?: unknown }).id
    return id === null || id === undefined ? null : String(id)
  }
  return String(value)
}

function avatarOf(user: any): string | null {
  const a = user?.avatar
  if (a && typeof a === 'object' && a.url) return String(a.url)
  return null
}

// Start of the requested period in India time, returned as a UTC instant.
function getIndiaPeriodStart(tab: Tab, now: Date): Date {
  const indiaDate = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
  indiaDate.setHours(0, 0, 0, 0)

  if (tab === 'weekly') {
    const daysSinceMonday = (indiaDate.getDay() + 6) % 7
    indiaDate.setDate(indiaDate.getDate() - daysSinceMonday)
  } else if (tab === 'monthly') {
    indiaDate.setDate(1)
  }

  // Server clock may not be in IST: shift by the difference between local and IST offsets.
  const localOffsetMin = -indiaDate.getTimezoneOffset()
  return new Date(indiaDate.getTime() + (localOffsetMin - 330) * 60 * 1000)
}

function byRank(a: Ranked, b: Ranked) {
  return b.xp - a.xp || a.timeTaken - b.timeTaken || a.name.localeCompare(b.name)
}

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams
  const payload = await getPayload({ config: configPromise })
  // Text, page size and the first tab come from CMS > Globals > Quiz Site Settings > Leaderboard
  const { leaderboard: settings } = await getQuizSiteSettings()
  const PAGE_SIZE = Math.min(50, Math.max(5, Math.round(Number(settings.rowsPerPage) || 10)))
  const defaultTab: Tab = TABS.some((t) => t.id === settings.defaultTab)
    ? (settings.defaultTab as Tab)
    : 'all'

  // With the period tabs switched off (the default) the leaderboard is All Time only.
  const showTabs = Boolean(settings.showPeriodTabs)
  const requestedTab = resolvedSearchParams?.tab
  const tab: Tab = !showTabs
    ? 'all'
    : typeof requestedTab === 'string' && TABS.some((t) => t.id === requestedTab)
      ? (requestedTab as Tab)
      : defaultTab

  const requestedPage = Number(resolvedSearchParams?.page)
  const askedPage = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1
  const now = await getNow(payload)

  // ---------------------------------------------------------------
  // 1. Ranking for the selected period - only the top TOP_PLAYERS are shown publicly
  //    (a player outside them still sees their own rank on their profile)
  // ---------------------------------------------------------------
  let ranked: Ranked[] = []
  const usersById = new Map<string, any>()

  if (tab === 'all') {
    const result = await payload.find({
      collection: 'quiz-users',
      // test players and disqualified players are never ranked
      where: { and: [realPlayersWhere, { disqualified: { not_equals: true } }] },
      sort: ['-totalXP', 'totalTimeTaken', 'createdAt'],
      limit: TOP_PLAYERS,
      page: 1,
      depth: 1,
      overrideAccess: true,
    })

    const toRanked = (u: any): Ranked => {
      usersById.set(String(u.id), u)
      return {
        id: String(u.id),
        name: u.name || u.email || 'Anonymous',
        xp: Math.max(0, Number(u.totalXP) || 0),
        timeTaken: Math.max(0, Number(u.totalTimeTaken) || 0),
      }
    }

    ranked = result.docs.map(toRanked)
  } else {
    const startDate = getIndiaPeriodStart(tab, now)
    const stats = new Map<string, Ranked>()
    let page = 1
    let hasNextPage = true

    while (hasNextPage) {
      const res = await payload.find({
        collection: 'quiz-attempts',
        where: {
          and: [
            { completedAt: { greater_than_equal: startDate.toISOString() } },
            { completedAt: { less_than_equal: now.toISOString() } },
          ],
        },
        sort: 'completedAt',
        limit: 1000,
        page,
        depth: 0,
        overrideAccess: true,
      })

      for (const attempt of res.docs as any[]) {
        const userId = relId(attempt.user)
        if (!userId) continue
        const row = stats.get(userId) ?? { id: userId, name: '', xp: 0, timeTaken: 0 }
        row.xp += Math.max(0, Number(attempt.score) || 0)
        row.timeTaken += Math.max(0, Number(attempt.timeTaken) || 0)
        stats.set(userId, row)
      }

      hasNextPage = Boolean(res.hasNextPage)
      page += 1
    }

    // Names, avatars and overall XP for everyone ranked in this period
    const ids = Array.from(stats.keys())
    if (ids.length) {
      const users = await payload.find({
        collection: 'quiz-users',
        where: { id: { in: ids } },
        limit: ids.length,
        depth: 1,
        overrideAccess: true,
      })
      for (const u of users.docs as any[]) {
        usersById.set(String(u.id), u)
        const row = stats.get(String(u.id))
        if (row) row.name = u.name || u.email || 'Anonymous'
      }
    }

    ranked = Array.from(stats.values())
      // test players and disqualified players are never ranked
      .filter((r) => !isTestPhone(usersById.get(r.id)?.phone) && !usersById.get(r.id)?.disqualified)
      .map((r) => ({ ...r, name: r.name || 'Anonymous' }))
      .sort(byRank)
      .slice(0, TOP_PLAYERS)
  }

  const totalPages = Math.max(1, Math.ceil(ranked.length / PAGE_SIZE))
  const pageParam = Math.min(askedPage, totalPages)
  const pageRows = ranked.slice((pageParam - 1) * PAGE_SIZE, pageParam * PAGE_SIZE)
  const podiumRows = ranked.slice(0, 3)

  // ---------------------------------------------------------------
  // 2. Streaks + titles for the players on screen
  // ---------------------------------------------------------------
  const visibleIds = Array.from(new Set([...pageRows, ...podiumRows].map((r) => r.id)))
  const playDates = new Map<string, string[]>()

  if (visibleIds.length) {
    const attempts = await payload.find({
      collection: 'quiz-attempts',
      where: { user: { in: visibleIds } },
      limit: 10000,
      depth: 0,
      overrideAccess: true,
    })
    for (const a of attempts.docs as any[]) {
      const userId = relId(a.user)
      if (!userId || !a.completedAt) continue
      const list = playDates.get(userId) ?? []
      list.push(a.completedAt)
      playDates.set(userId, list)
    }
  }

  const titles: QuizTitle[] = await getQuizTitles(payload)
  const gameDay = await getGameDaySettings(payload)

  const enrich = (row: Ranked, rank: number): Player => {
    const user = usersById.get(row.id)
    const overallXP = Math.max(0, Number(user?.totalXP) || 0)
    return {
      ...row,
      rank,
      avatarUrl: avatarOf(user),
      overallXP,
      streak: computeStreaks(playDates.get(row.id) ?? [], now, (d) => gameDayKey(d, gameDay)).current,
      title: getTitleForXP(overallXP, titles),
    }
  }

  const players = pageRows.map((r, i) => enrich(r, (pageParam - 1) * PAGE_SIZE + i + 1))
  const podium = podiumRows.map((r, i) => enrich(r, i + 1))
  const [rank1, rank2, rank3] = podium
  const activeTab = TABS.find((t) => t.id === tab)!

  const pageHref = (page: number) =>
    showTabs ? `/leaderboard?tab=${tab}&page=${page}` : `/leaderboard?page=${page}`

  return (
    <AuthGuard>
      <div className="min-h-screen text-slate-800 relative overflow-hidden py-12 px-4 sm:px-6 bg-[url('/images/gamingpagebgg.jpeg')] bg-no-repeat bg-cover bg-center padddingtopppp leaderrrboardddcontainerr">
        <div className="container mx-auto max-w-4xl relative z-10 space-y-6">
          <div className="bg-white/95 backdrop-blur-xl border border-white rounded-[28px] p-5 sm:p-10 shadow-xl shadow-purple-500/5">
            <Link
              href="/quizzes"
              className="px-4 py-2 bg-white/80 hover:bg-white text-slate-800 border border-slate-200 font-bold text-xs rounded-2xl shadow-xs transition inline-block mb-4"
            >
              Play Quizzes
            </Link>

            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-5xl font-black text-[#10145C] tracking-tight mb-2">
                {settings.heading}
              </h1>
              <p className="text-slate-500 text-sm font-medium">{settings.description}</p>
            </div>

            {/* FILTER TABS (CMS > Quiz Site Settings > Leaderboard > Show Daily / Weekly / Monthly tabs) */}
            {showTabs && (
              <div className="flex justify-center mb-10">
                <div className="inline-flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-purple-100 bg-white p-1.5 shadow-md shadow-purple-500/10">
                  {TABS.map((t) => {
                    const isActive = tab === t.id
                    const Icon = t.icon
                    return (
                      <Link
                        key={t.id}
                        href={`/leaderboard?tab=${t.id}`}
                        className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition sm:px-6 sm:text-sm ${
                          isActive
                            ? 'bg-gradient-to-r from-[#6D20FF] to-[#8a4fff] text-white shadow-md shadow-purple-500/30'
                            : 'text-slate-600 hover:bg-purple-50'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {t.label}
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {players.length === 0 && podium.length === 0 ? (
              <div className="text-center py-16 text-slate-400 font-medium">
                {settings.emptyText}
              </div>
            ) : (
              <>
                {/* TOP 3 PODIUM */}
                <div className="mb-10 grid grid-cols-3 items-end gap-2 sm:gap-6">
                  <PodiumSpot player={rank2} place={2} />
                  <PodiumSpot player={rank1} place={1} />
                  <PodiumSpot player={rank3} place={3} />
                </div>

                {/* LEADERBOARD TABLE */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="grid grid-cols-12 gap-2 border-b border-slate-200 bg-[#f8f6ff] px-3 py-3.5 text-[11px] font-extrabold uppercase tracking-wider text-[#10145C] sm:px-6 sm:text-xs">
                    <div className="col-span-2 sm:col-span-1">Rank</div>
                    <div className="col-span-6 sm:col-span-4">Player</div>
                    <div className="hidden sm:block sm:col-span-2">Streak</div>
                    <div className="hidden sm:block sm:col-span-3">Title</div>
                    <div className="col-span-4 sm:col-span-2 text-right">{activeTab.xpLabel}</div>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {players.map((p) => (
                      <div
                        key={p.id}
                        className={`grid grid-cols-12 items-center gap-2 px-3 py-3.5 text-sm transition hover:bg-slate-50/80 sm:px-6 ${ROW_HIGHLIGHT[p.rank] ?? ''}`}
                      >
                        <div className="col-span-2 flex items-center gap-1 font-black text-slate-700 sm:col-span-1">
                          {p.rank <= 3 && <Crown className={`h-4 w-4 ${CROWN_TONE[p.rank]}`} />}#
                          {p.rank}
                        </div>

                        <div className="col-span-6 flex min-w-0 items-center gap-3 sm:col-span-4">
                          <Avatar player={p} size="sm" />
                          <div className="min-w-0">
                            <p className="truncate font-bold text-slate-900">{p.name}</p>
                            {/* mobile: streak + title under the name */}
                            <div className="mt-1 flex flex-wrap items-center gap-1.5 sm:hidden">
                              <TitleBadge
                                name={p.title.title.name}
                                tierIndex={p.title.tierIndex}
                                tierCount={p.title.tierCount}
                                className="!text-[10px] !px-2"
                              />
                              {p.streak > 0 && (
                                <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-orange-600">
                                  <Flame className="h-3 w-3 fill-orange-400" />
                                  {p.streak}d
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="hidden items-center gap-1 font-bold text-slate-600 sm:col-span-2 sm:flex">
                          {p.streak > 0 ? (
                            <>
                              <Flame className="h-4 w-4 fill-orange-400 text-orange-500" />
                              {p.streak} {p.streak === 1 ? 'day' : 'days'}
                            </>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </div>

                        <div className="hidden sm:col-span-3 sm:block">
                          <TitleBadge
                            name={p.title.title.name}
                            tierIndex={p.title.tierIndex}
                            tierCount={p.title.tierCount}
                          />
                        </div>

                        <div className="col-span-4 text-right font-black text-purple-600 sm:col-span-2">
                          {p.xp} <span className="text-xs font-semibold text-slate-400">XP</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="mt-3 text-center text-xs font-medium text-slate-400">
                  Top {TOP_PLAYERS} players. Your own rank is on your{' '}
                  <Link href="/profile" className="font-bold text-purple-600 hover:underline">
                    profile
                  </Link>
                  .
                </p>

                {/* PAGINATION CONTROLS */}
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Link
                    href={pageHref(Math.max(1, pageParam - 1))}
                    aria-disabled={pageParam <= 1}
                    className={`w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition ${
                      pageParam <= 1 ? 'pointer-events-none opacity-40' : ''
                    }`}
                  >
                    ←
                  </Link>

                  <div className="px-4 py-2 rounded-full bg-purple-600 text-white font-bold text-xs shadow-sm">
                    {pageParam} / {totalPages}
                  </div>

                  <Link
                    href={pageHref(Math.min(totalPages, pageParam + 1))}
                    aria-disabled={pageParam >= totalPages}
                    className={`w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition ${
                      pageParam >= totalPages ? 'pointer-events-none opacity-40' : ''
                    }`}
                  >
                    →
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}

const ROW_HIGHLIGHT: Record<number, string> = {
  1: 'bg-amber-50/80',
  2: 'bg-slate-50',
  3: 'bg-orange-50/60',
}

const CROWN_TONE: Record<number, string> = {
  1: 'fill-amber-400 text-amber-500',
  2: 'fill-slate-300 text-slate-400',
  3: 'fill-orange-300 text-orange-500',
}

const PLACE_STYLE: Record<1 | 2 | 3, { ring: string; badge: string; block: string }> = {
  1: {
    ring: 'ring-4 ring-amber-400',
    badge: 'bg-amber-400',
    block: 'h-24 sm:h-28 bg-gradient-to-b from-amber-200 to-amber-100',
  },
  2: {
    ring: 'ring-4 ring-slate-300',
    badge: 'bg-slate-400',
    block: 'h-16 sm:h-20 bg-gradient-to-b from-purple-200 to-purple-100',
  },
  3: {
    ring: 'ring-4 ring-orange-400',
    badge: 'bg-orange-500',
    block: 'h-12 sm:h-14 bg-gradient-to-b from-purple-200 to-purple-100',
  },
}

function Avatar({ player, size }: { player: Player; size: 'sm' | 'lg' | 'xl' }) {
  const dims = {
    sm: 'h-9 w-9 text-xs',
    lg: 'h-16 w-16 sm:h-20 sm:w-20 text-xl sm:text-2xl',
    xl: 'h-20 w-20 sm:h-24 sm:w-24 text-2xl sm:text-3xl',
  }[size]

  if (player.avatarUrl) {
    return (
      <img
        src={player.avatarUrl}
        alt={player.name}
        className={`${dims} shrink-0 rounded-full object-cover`}
      />
    )
  }

  return (
    <div
      className={`${dims} flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-purple-200 font-black text-indigo-700`}
    >
      {player.name?.[0]?.toUpperCase() || 'P'}
    </div>
  )
}

function PodiumSpot({ player, place }: { player?: Player; place: 1 | 2 | 3 }) {
  const style = PLACE_STYLE[place]

  return (
    <div className="flex flex-col items-center text-center">
      {player ? (
        <>
          <div className="relative mb-3 flex items-end">
            {place === 1 && <Laurel className="hidden h-20 w-9 sm:block" />}
            <div className="relative">
              {place === 1 && (
                <Crown className="absolute -top-7 left-1/2 h-7 w-7 -translate-x-1/2 fill-amber-400 text-amber-500" />
              )}
              <div className={`rounded-full ${style.ring} ring-offset-2`}>
                <Avatar player={player} size={place === 1 ? 'xl' : 'lg'} />
              </div>
              <span
                className={`absolute -bottom-2 left-1/2 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full border-2 border-white text-xs font-black text-white shadow ${style.badge}`}
              >
                {place}
              </span>
            </div>
            {place === 1 && <Laurel flip className="hidden h-20 w-9 sm:block" />}
          </div>
          <p className="mt-1 max-w-full truncate px-1 text-xs font-black text-slate-900 sm:text-base">
            {player.name}
          </p>
          <span className="mt-1 rounded-lg bg-[#2E1065] px-2.5 py-0.5 text-xs font-black text-white sm:text-sm">
            {player.xp} XP
          </span>
          <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 sm:text-xs">
            <Flame className="h-3.5 w-3.5 fill-orange-400 text-orange-500" />
            {player.streak > 0 ? `${player.streak}-day streak` : 'No streak yet'}
          </span>
          <div className="mt-1 hidden sm:block">
            <TitleBadge
              name={player.title.title.name}
              tierIndex={player.title.tierIndex}
              tierCount={player.title.tierCount}
            />
          </div>
        </>
      ) : (
        <div className="h-24" />
      )}
      <div className={`mt-3 w-full rounded-t-2xl ${style.block}`} />
    </div>
  )
}
