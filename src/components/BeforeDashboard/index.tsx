import Link from 'next/link'
import React from 'react'

import './index.scss'

const baseClass = 'before-dashboard'

/** Dashboard welcome panel, WordPress "Welcome" box style. */
const BeforeDashboard: React.FC = () => {
  return (
    <div className={baseClass}>
      <div className={`${baseClass}__welcome`}>
        <div className={`${baseClass}__intro`}>
          <h2>Welcome to the Super Chennai Game Management Hub</h2>
          <p>Manage the Chennai mini-games, update the trivia questions, follow player scores and set up game content.</p>
        </div>
        <div className={`${baseClass}__columns`}>
          <div>
            <h3>Get started</h3>
            <a className="wp-button wp-button--primary wp-button--hero" href="/" target="_blank" rel="noreferrer">
              Test live games
            </a>
            <p className={`${baseClass}__note`}>Opens the player site in a new tab.</p>
          </div>
          <div>
            <h3>Next steps</h3>
            <ul>
              <li>
                <Link href="/admin/quiz-dashboard">Quiz Dashboard - players, attempts, Excel</Link>
              </li>
              <li>
                <Link href="/admin/collections/questions">Write or edit questions</Link>
              </li>
              <li>
                <a href="/dashboard" target="_blank" rel="noreferrer">
                  Live games dashboard
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3>At a glance</h3>
            <ul>
              <li>Active mini-games: Spot the Lie, Re-order, Quiz</li>
              <li>
                Leaderboards: <b className={`${baseClass}__ok`}>active</b>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BeforeDashboard
