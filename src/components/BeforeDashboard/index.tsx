/* eslint-disable @next/next/no-img-element */
'use client'

import React from 'react'
import { Banner } from '@payloadcms/ui/elements/Banner'
import { Gamepad2, Trophy, Swords, Compass, ExternalLink, Flame } from 'lucide-react'

import './index.scss'

const baseClass = 'before-dashboard'

const BeforeDashboard: React.FC = () => {
  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Gamepad2 size={18} />
          <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>
            Welcome to Super Chennai Game Management Hub
          </h4>
        </div>
      </Banner>

      <div style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            padding: '20px 24px',
            borderRadius: '12px',
            border: '1px solid #334155',
            color: '#fff',
            display: 'flex',

            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                color: '#f59e0b',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              <Swords size={14} /> Gaming Admin Portal
            </div>
            <h3 style={{ fontSize: '22px', margin: '4px 0', color: '#fff', fontWeight: '700' }}>
              Welcome back, Game Master! 🎮
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>
              Manage Chennai mini-games, update trivia sets, monitor player scores, and configure
              game content.
            </p>
          </div>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            style={{
              background: '#0284c7',
              color: '#fff',
              padding: '10px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'background 0.2s ease',
            }}
          >
            <Compass size={16} /> Test Live Games <ExternalLink size={14} />
          </a>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            marginTop: '12px',
          }}
        >
          <div
            style={{
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '10px',
              padding: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <Flame size={24} color="#f97316" />
            <div>
              <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>
                ACTIVE MINI-GAMES
              </span>
              <h4 style={{ margin: 0, fontSize: '16px', color: '#f8fafc' }}>
                Spot Lie, Reorder, Quiz
              </h4>
            </div>
          </div>

          <div
            style={{
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '10px',
              padding: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <Trophy size={24} color="#f59e0b" />
            <div>
              <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>
                SYSTEM STATUS
              </span>
              <h4 style={{ margin: 0, fontSize: '16px', color: '#10b981' }}>Leaderboards Active</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BeforeDashboard
