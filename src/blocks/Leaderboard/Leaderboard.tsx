// components/ClientProvider.tsx
'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
// ungaloda maththa client components-a inga import pannunga

export default function LeaderboardComponent({ children }: { children?: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsLoggedIn(true)
    }
  }, [])

  return (
    <>
      {isLoggedIn ? (
        <div className="leaderboradsectionsss cursor-pointer">
          <Link href="/leaderboard">
            <div className="leaderboard-animated shadow-xl shadow-purple-500/10 hover:scale-105 transition-all">
              <img src="/images/leaderboard.jpg" alt="Leaderboard" />
            </div>
          </Link>
        </div>
      ) : (
        <></>
      )}
    </>
  )
}
