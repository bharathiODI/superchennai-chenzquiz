/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text */
import { ImageResponse } from 'next/og'
import { readFile } from 'fs/promises'
import path from 'path'
import { tierTone } from '@/utilities/quizTitles'

// Shareable scorecard PNG (1080x1350, Instagram/WhatsApp friendly).
// GET /api/scorecard?name=Vaishnavi&xp=20&title=Namma%20Chennai%20Expert&tier=1&tiers=3

export const runtime = 'nodejs'

const W = 1080
const H = 1350

let assetsPromise: Promise<{ black: Buffer; bold: Buffer; skyline: string }> | null = null

function loadAssets() {
  if (!assetsPromise) {
    const root = process.cwd()
    const fontDir = path.join(root, 'node_modules', 'geist', 'dist', 'fonts', 'geist-sans')
    assetsPromise = Promise.all([
      readFile(path.join(fontDir, 'Geist-Black.ttf')),
      readFile(path.join(fontDir, 'Geist-Bold.ttf')),
      readFile(path.join(root, 'public', 'images', 'scorecard-skyline.jpg')),
    ]).then(([black, bold, sky]) => ({
      black,
      bold,
      skyline: `data:image/jpeg;base64,${sky.toString('base64')}`,
    }))
    assetsPromise.catch(() => {
      assetsPromise = null
    })
  }
  return assetsPromise
}

const laurelSvg = (flip: boolean) =>
  `data:image/svg+xml;base64,${Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 64"><g fill="#F5A623" ${
      flip ? 'transform="translate(32 0) scale(-1 1)"' : ''
    }><path d="M26 61 C 10 50, 5 30, 15 5" stroke="#E8941A" stroke-width="2.4" fill="none" stroke-linecap="round"/><ellipse cx="10" cy="12" rx="3.2" ry="6.4" transform="rotate(-28 10 12)"/><ellipse cx="6.8" cy="24" rx="3.2" ry="6.4" transform="rotate(-12 6.8 24)"/><ellipse cx="7.2" cy="36.5" rx="3.2" ry="6.4" transform="rotate(12 7.2 36.5)"/><ellipse cx="11.5" cy="48" rx="3.2" ry="6.4" transform="rotate(38 11.5 48)"/><ellipse cx="18.5" cy="19" rx="2.7" ry="5.4" transform="rotate(32 18.5 19)"/><ellipse cx="17" cy="31" rx="2.7" ry="5.4" transform="rotate(48 17 31)"/><ellipse cx="20" cy="43" rx="2.7" ry="5.4" transform="rotate(62 20 43)"/></g></svg>`,
  ).toString('base64')}`

const crownSvg = `data:image/svg+xml;base64,${Buffer.from(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#FBBF24" stroke="#D97706" stroke-width="1.2" stroke-linejoin="round" d="M3 18 L2 7 L7.5 11 L12 4 L16.5 11 L22 7 L21 18 Z"/><rect x="3" y="19" width="18" height="2.4" rx="1" fill="#D97706"/></svg>',
).toString('base64')}`

const BADGE_BG = {
  rookie: 'linear-gradient(90deg, #0EA5E9, #2563EB)',
  expert: 'linear-gradient(90deg, #5B21B6, #7C3AED)',
  master: 'linear-gradient(90deg, #3B0A8F, #6D28D9)',
} as const

function clean(value: string | null, max: number, fallback: string) {
  const v = (value || '').replace(/\s+/g, ' ').trim().slice(0, max)
  return v || fallback
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const name = clean(searchParams.get('name'), 28, 'Chennai Player')
  const title = clean(searchParams.get('title'), 32, 'Chennai Rookie')
  const xp = Math.max(0, Math.min(999999, Math.round(Number(searchParams.get('xp')) || 0)))
  const tier = Math.max(0, Number(searchParams.get('tier')) || 0)
  const tiers = Math.max(1, Number(searchParams.get('tiers')) || 3)
  const tone = tierTone(tier, tiers)

  const { black, bold, skyline } = await loadAssets()

  return new ImageResponse(
    (
      <div
        style={{
          width: W,
          height: H,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: 'linear-gradient(135deg, #4C1DDB 0%, #8B2CF5 45%, #E0249A 100%)',
          fontFamily: 'Geist',
        }}
      >
        <div
          style={{
            width: 900,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            borderRadius: 56,
            overflow: 'hidden',
            boxShadow: '0 30px 80px rgba(30, 0, 80, 0.45)',
          }}
        >
          {/* Top bar */}
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '44px 56px 0',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
              <div style={{ fontSize: 34, fontWeight: 900, color: '#10145C', letterSpacing: 1 }}>
                SUPER
              </div>
              <div style={{ fontSize: 34, fontWeight: 900, color: '#E0249A', letterSpacing: 1 }}>
                CHENNAI
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                padding: '12px 26px',
                borderRadius: 999,
                backgroundImage: 'linear-gradient(90deg, #FACC15, #F97316)',
                color: '#3B0764',
                fontSize: 28,
                fontWeight: 900,
              }}
            >
              CHENZ QUIZ
            </div>
          </div>

          {/* Headline */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 40 }}>
            <div style={{ fontSize: 44, fontWeight: 700, color: '#1E1B4B' }}>I just played the</div>
            <div style={{ fontSize: 60, fontWeight: 900, color: '#6D28D9', marginTop: 4 }}>
              Super Chennai Quiz!
            </div>
          </div>

          {/* Score */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: 36,
              padding: '26px 80px',
              borderRadius: 32,
              backgroundColor: '#F5F3FF',
              border: '2px solid #E9E3FF',
            }}
          >
            <div style={{ fontSize: 30, fontWeight: 700, color: '#64748B' }}>My Score</div>
            <div style={{ fontSize: 120, fontWeight: 900, color: '#4F46E5', lineHeight: 1.05 }}>
              {`${xp} XP`}
            </div>
          </div>

          {/* Title badge */}
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 36 }}>
            <img src={laurelSvg(false)} width={64} height={128} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 10px' }}>
              <img src={crownSvg} width={64} height={64} style={{ marginBottom: -10 }} />
              <div
                style={{
                  display: 'flex',
                  padding: '18px 40px',
                  borderRadius: 24,
                  backgroundImage: BADGE_BG[tone],
                  color: tone === 'master' ? '#FDE68A' : '#FFFFFF',
                  fontSize: 44,
                  fontWeight: 900,
                }}
              >
                {title}
              </div>
            </div>
            <img src={laurelSvg(true)} width={64} height={128} />
          </div>

          <div style={{ display: 'flex', marginTop: 22, fontSize: 32, fontWeight: 700, color: '#475569' }}>
            {`- ${name}`}
          </div>

          {/* Skyline */}
          <img src={skyline} width={900} height={152} style={{ marginTop: 24 }} />
        </div>

        <div style={{ display: 'flex', marginTop: 44, fontSize: 34, fontWeight: 700, color: '#FFFFFF' }}>
          Think you know Chennai? Play at chenzquiz.superchennai.com
        </div>
      </div>
    ),
    {
      width: W,
      height: H,
      fonts: [
        { name: 'Geist', data: black, weight: 900, style: 'normal' },
        { name: 'Geist', data: bold, weight: 700, style: 'normal' },
      ],
      headers: { 'Cache-Control': 'public, max-age=3600' },
    },
  )
}
