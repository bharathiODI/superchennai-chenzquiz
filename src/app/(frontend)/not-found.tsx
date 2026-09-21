'use client'

import React, { useState, useEffect, useRef, Suspense, useMemo } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useFrame } from '@react-three/fiber'
import { PerspectiveCamera, Sky, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import {
  ArrowLeft,
  RotateCcw,
  Trophy,
  Gauge,
  Volume2,
  VolumeX,
  Flame,
  Home,
  Sun,
} from 'lucide-react'

// Dynamic Import for Canvas to prevent SSR & Memory Overheads when page is not rendered
const Canvas = dynamic(() => import('@react-three/fiber').then((m) => m.Canvas), {
  ssr: false,
})

// ==========================================
// 1. SOUND SYNTHESIZER (WITH CLEANUP)
// ==========================================
class SoundFX {
  private ctx: AudioContext | null = null
  private engineOsc: OscillatorNode | null = null
  private engineGain: GainNode | null = null
  public isMuted: boolean = false

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  public startEngine() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx || this.engineOsc) return

    try {
      this.engineOsc = this.ctx.createOscillator()
      this.engineGain = this.ctx.createGain()

      this.engineOsc.type = 'sawtooth'
      this.engineOsc.frequency.setValueAtTime(50, this.ctx.currentTime)
      this.engineGain.gain.setValueAtTime(0.04, this.ctx.currentTime)

      this.engineOsc.connect(this.engineGain)
      this.engineGain.connect(this.ctx.destination)
      this.engineOsc.start()
    } catch (e) {
      console.error(e)
    }
  }

  public updateEnginePitch(speed: number) {
    if (this.engineOsc && this.ctx) {
      const pitch = 50 + (speed / 240) * 180
      this.engineOsc.frequency.setValueAtTime(pitch, this.ctx.currentTime)
    }
  }

  public stopEngine() {
    if (this.engineOsc) {
      try {
        this.engineOsc.stop()
        this.engineOsc.disconnect()
      } catch (e) {}
      this.engineOsc = null
    }
  }

  public playCrash() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return

    try {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(180, this.ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.5)

      gain.gain.setValueAtTime(0.6, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start()
      osc.stop(this.ctx.currentTime + 0.5)
    } catch (e) {}
  }

  public playClick() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return

    try {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(800, this.ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.08)

      gain.gain.setValueAtTime(0.1, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start()
      osc.stop(this.ctx.currentTime + 0.08)
    } catch (e) {}
  }

  public destroy() {
    this.stopEngine()
    if (this.ctx) {
      this.ctx.close()
      this.ctx = null
    }
  }
}

const audioFX = new SoundFX()

// ==========================================
// 2. PROCEDURAL ENVIRONMENT
// ==========================================
function PineTree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.25, 1.2, 8]} />
        <meshStandardMaterial color="#4A2E1A" roughness={0.9} />
      </mesh>

      <mesh position={[0, 1.6, 0]} castShadow>
        <coneGeometry args={[1.1, 1.4, 7]} />
        <meshStandardMaterial color="#15803D" roughness={0.8} flatShading />
      </mesh>

      <mesh position={[0, 2.4, 0]} castShadow>
        <coneGeometry args={[0.85, 1.2, 7]} />
        <meshStandardMaterial color="#166534" roughness={0.8} flatShading />
      </mesh>

      <mesh position={[0, 3.1, 0]} castShadow>
        <coneGeometry args={[0.55, 1.0, 7]} />
        <meshStandardMaterial color="#22C55E" roughness={0.7} flatShading />
      </mesh>
    </group>
  )
}

function MountainRange({ side }: { side: 'left' | 'right' }) {
  const xOffset = side === 'left' ? -38 : 38

  const mountainPeaks = useMemo(() => {
    const peaks = []
    for (let i = 0; i < 9; i++) {
      peaks.push({
        id: i,
        x: xOffset + (Math.random() * 12 - 6),
        z: -140 + i * 22,
        scale: [12 + Math.random() * 8, 14 + Math.random() * 12, 12 + Math.random() * 8] as [
          number,
          number,
          number,
        ],
        color: i % 2 === 0 ? '#334155' : '#1E293B',
      })
    }
    return peaks
  }, [xOffset])

  return (
    <group>
      {mountainPeaks.map((peak) => (
        <mesh key={peak.id} position={[peak.x, peak.scale[1] / 2 - 2, peak.z]} castShadow>
          <coneGeometry args={[1, 1, 5]} />
          <meshStandardMaterial color={peak.color} roughness={0.95} flatShading />
        </mesh>
      ))}
    </group>
  )
}

// ==========================================
// 3. SPORTS CAR MODEL
// ==========================================
function SportsCar({
  position,
  rotation = [0, 0, 0],
  color = '#4B20D8',
  isPlayer = false,
  isSteering = 0,
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
  color?: string
  isPlayer?: boolean
  isSteering?: number
}) {
  const carRef = useRef<THREE.Group>(null)
  const wheelRefs = useRef<THREE.Mesh[]>([])

  useFrame((_, delta) => {
    if (carRef.current && isPlayer) {
      carRef.current.rotation.z = THREE.MathUtils.lerp(
        carRef.current.rotation.z,
        -isSteering * 0.09,
        0.12,
      )
      carRef.current.rotation.y = THREE.MathUtils.lerp(
        carRef.current.rotation.y,
        isSteering * 0.14,
        0.12,
      )
    }

    wheelRefs.current.forEach((wheel) => {
      if (wheel) wheel.rotation.x += delta * 15
    })
  })

  return (
    <group ref={carRef} position={position} rotation={rotation}>
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.75, 0.35, 3.9]} />
        <meshStandardMaterial color={color} roughness={0.15} metalness={0.85} />
      </mesh>

      <mesh position={[0, 0.68, -0.15]} castShadow>
        <boxGeometry args={[1.35, 0.42, 1.9]} />
        <meshPhysicalMaterial
          color="#1E293B"
          roughness={0.05}
          metalness={0.9}
          transmission={0.4}
          transparent
          opacity={0.85}
        />
      </mesh>

      <mesh position={[0, 0.48, 1.15]} castShadow>
        <boxGeometry args={[1.2, 0.1, 1.2]} />
        <meshStandardMaterial color={color} roughness={0.15} metalness={0.85} />
      </mesh>

      <mesh position={[-0.62, 0.4, 1.96]}>
        <boxGeometry args={[0.32, 0.1, 0.05]} />
        <meshStandardMaterial color="#38BDF8" emissive="#38BDF8" emissiveIntensity={4} />
      </mesh>
      <mesh position={[0.62, 0.4, 1.96]}>
        <boxGeometry args={[0.32, 0.1, 0.05]} />
        <meshStandardMaterial color="#38BDF8" emissive="#38BDF8" emissiveIntensity={4} />
      </mesh>

      <mesh position={[0, 0.48, -1.96]}>
        <boxGeometry args={[1.6, 0.08, 0.05]} />
        <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={5} />
      </mesh>

      <mesh position={[0, 0.88, -1.8]} castShadow>
        <boxGeometry args={[1.85, 0.06, 0.35]} />
        <meshStandardMaterial color="#0F172A" roughness={0.2} metalness={0.9} />
      </mesh>

      {[
        [-0.92, 0.3, 1.15],
        [0.92, 0.3, 1.15],
        [-0.92, 0.3, -1.25],
        [0.92, 0.3, -1.25],
      ].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh
            ref={(el) => {
              if (el) wheelRefs.current[i] = el
            }}
            rotation={[0, 0, Math.PI / 2]}
            castShadow
          >
            <cylinderGeometry args={[0.32, 0.32, 0.26, 32]} />
            <meshStandardMaterial color="#1E293B" roughness={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// ==========================================
// 4. HIGHWAY SCENE WITH TEXTURE CLEANUP
// ==========================================
function HighwayScene({
  gameState,
  setGameState,
  setScore,
  setSpeed,
  setHighScore,
}: {
  gameState: 'START' | 'PLAYING' | 'GAMEOVER'
  setGameState: (state: 'START' | 'PLAYING' | 'GAMEOVER') => void
  setScore: React.Dispatch<React.SetStateAction<number>>
  setSpeed: React.Dispatch<React.SetStateAction<number>>
  highScore: number
  setHighScore: React.Dispatch<React.SetStateAction<number>>
}) {
  const playerXRef = useRef(0)
  const speedRef = useRef(0)
  const distanceRef = useRef(0)
  const scoreRef = useRef(0)

  const keysRef = useRef<{ left: boolean; right: boolean; up: boolean; down: boolean }>({
    left: false,
    right: false,
    up: false,
    down: false,
  })

  const roadMatRef = useRef<THREE.MeshStandardMaterial>(null)
  const trafficRef = useRef<{ id: number; x: number; z: number; speed: number; color: string }[]>(
    [],
  )
  const treesRef = useRef<{ id: number; x: number; z: number }[]>([])

  const [trafficState, setTrafficState] = useState<
    { id: number; x: number; z: number; color: string }[]
  >([])
  const [treesState, setTreesState] = useState<{ id: number; x: number; z: number }[]>([])

  useEffect(() => {
    const initialTrees = []
    for (let i = 0; i < 24; i++) {
      const z = -140 + i * 12
      initialTrees.push({ id: Math.random(), x: -10 - Math.random() * 4, z })
      initialTrees.push({ id: Math.random(), x: 10 + Math.random() * 4, z })
    }
    treesRef.current = initialTrees
    setTreesState(initialTrees)
  }, [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keysRef.current.left = true
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keysRef.current.right = true
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') keysRef.current.up = true
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') keysRef.current.down = true
    }

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keysRef.current.left = false
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keysRef.current.right = false
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') keysRef.current.up = false
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') keysRef.current.down = false
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  useEffect(() => {
    if (gameState === 'PLAYING') {
      playerXRef.current = 0
      speedRef.current = 70
      distanceRef.current = 0
      scoreRef.current = 0
      trafficRef.current = []
      audioFX.startEngine()
    } else {
      audioFX.stopEngine()
    }
  }, [gameState])

  useFrame((_, delta) => {
    if (gameState !== 'PLAYING') return

    if (keysRef.current.left) playerXRef.current = Math.max(-5.2, playerXRef.current - 13 * delta)
    if (keysRef.current.right) playerXRef.current = Math.min(5.2, playerXRef.current + 13 * delta)

    if (keysRef.current.up) {
      speedRef.current = Math.min(230, speedRef.current + 45 * delta)
    } else if (keysRef.current.down) {
      speedRef.current = Math.max(0, speedRef.current - 95 * delta)
    } else {
      speedRef.current = Math.max(35, speedRef.current - 14 * delta)
    }

    const currentSpeed = speedRef.current
    setSpeed(Math.round(currentSpeed))
    audioFX.updateEnginePitch(currentSpeed)

    const moveDist = (currentSpeed * delta) / 3.6
    distanceRef.current += moveDist
    scoreRef.current += Math.round(moveDist)
    setScore(scoreRef.current)

    if (roadMatRef.current && roadMatRef.current.map) {
      roadMatRef.current.map.offset.y = (distanceRef.current * 0.1) % 1
    }

    treesRef.current.forEach((tree) => {
      tree.z += moveDist
      if (tree.z > 20) {
        tree.z = -140
      }
    })
    setTreesState([...treesRef.current])

    if (Math.random() < 0.038) {
      const lanes = [-3.8, -1.3, 1.3, 3.8]
      const randomLane = lanes[Math.floor(Math.random() * lanes.length)]
      const brightCarColors = ['#E11D48', '#2563EB', '#D97706', '#059669', '#7C3AED']

      trafficRef.current.push({
        id: Math.random(),
        x: randomLane,
        z: -125,
        speed: 25 + Math.random() * 35,
        color: brightCarColors[Math.floor(Math.random() * brightCarColors.length)],
      })
    }

    const playerX = playerXRef.current
    const updatedTraffic = []

    for (let i = 0; i < trafficRef.current.length; i++) {
      const vehicle = trafficRef.current[i]
      const relativeSpeed = currentSpeed - vehicle.speed
      vehicle.z += (relativeSpeed * delta) / 3.6

      if (Math.abs(vehicle.z) < 3.3 && Math.abs(vehicle.x - playerX) < 1.45) {
        audioFX.playCrash()
        setGameState('GAMEOVER')
        setHighScore((prev) => {
          const newHigh = Math.max(prev, scoreRef.current)
          if (scoreRef.current > prev && scoreRef.current > 0) {
            confetti({ particleCount: 110, spread: 80, origin: { y: 0.6 } })
          }
          return newHigh
        })
        return
      }

      if (vehicle.z < 25) {
        updatedTraffic.push(vehicle)
      }
    }

    trafficRef.current = updatedTraffic
    setTrafficState([...trafficRef.current])
  })

  // Procedural Canvas Texture with Auto Dispose
  const roadTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 1024
    const ctx = canvas.getContext('2d')!

    ctx.fillStyle = '#334155'
    ctx.fillRect(0, 0, 1024, 1024)

    for (let i = 0; i < 8000; i++) {
      const x = Math.random() * 1024
      const y = Math.random() * 1024
      const opacity = Math.random() * 0.15
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
      ctx.fillRect(x, y, 2, 2)
    }

    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(20, 0, 24, 1024)
    ctx.fillRect(980, 0, 24, 1024)

    ctx.fillStyle = '#F59E0B'
    ctx.fillRect(502, 0, 8, 1024)
    ctx.fillRect(514, 0, 8, 1024)

    ctx.fillStyle = '#E2E8F0'
    for (let i = 0; i < 1024; i += 128) {
      ctx.fillRect(260, i, 12, 64)
      ctx.fillRect(752, i, 12, 64)
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(1, 12)
    return texture
  }, [])

  // Memory Dispose when component unmounts
  useEffect(() => {
    return () => {
      roadTexture.dispose()
    }
  }, [roadTexture])

  const steeringDir = keysRef.current.left ? -1 : keysRef.current.right ? 1 : 0

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 3.4, 7.2]} fov={58} />

      <ambientLight intensity={0.9} />
      <directionalLight
        position={[30, 50, 20]}
        intensity={2.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      <Sky
        sunPosition={[100, 40, 100]}
        turbidity={0.1}
        rayleigh={0.8}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />

      <MountainRange side="left" />
      <MountainRange side="right" />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -40]} receiveShadow>
        <planeGeometry args={[14, 180]} />
        <meshStandardMaterial ref={roadMatRef} map={roadTexture} roughness={0.35} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-25, -0.05, -40]} receiveShadow>
        <planeGeometry args={[36, 180]} />
        <meshStandardMaterial color="#15803D" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[25, -0.05, -40]} receiveShadow>
        <planeGeometry args={[36, 180]} />
        <meshStandardMaterial color="#15803D" roughness={0.9} />
      </mesh>

      {treesState.map((tree) => (
        <PineTree key={tree.id} position={[tree.x, 0, tree.z]} />
      ))}

      <ContactShadows position={[0, 0.01, 0]} opacity={0.6} scale={40} blur={2} far={10} />

      <SportsCar
        position={[playerXRef.current, 0, 0]}
        color="#4B20D8"
        isPlayer={true}
        isSteering={steeringDir}
      />

      {trafficState.map((vehicle) => (
        <SportsCar
          key={vehicle.id}
          position={[vehicle.x, 0, vehicle.z]}
          color={vehicle.color}
          rotation={[0, Math.PI, 0]}
        />
      ))}
    </>
  )
}

// ==========================================
// 5. MAIN PAGE & CLEANUP OVERLAY
// ==========================================
export default function NotFound() {
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER'>('START')
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [speed, setSpeed] = useState(0)
  const [isMuted, setIsMuted] = useState(false)

  // Destroy Web Audio Instance when user navigates away from 404 page
  useEffect(() => {
    return () => {
      audioFX.destroy()
    }
  }, [])

  const toggleMute = () => {
    audioFX.isMuted = !isMuted
    setIsMuted(!isMuted)
    audioFX.playClick()
  }

  const startGame = () => {
    audioFX.playClick()
    setGameState('PLAYING')
  }

  return (
    <section className="relative w-full h-screen bg-slate-50 text-slate-900 overflow-hidden select-none font-sans flex flex-col justify-between">
      {/* HUD HEADER */}
      <header className="absolute top-0 left-0 right-0 z-20 p-4 sm:p-6 flex items-center justify-between max-w-7xl mx-auto w-full pointer-events-none">
        <Link
          href="/"
          onClick={() => audioFX.playClick()}
          className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200 hover:border-[#4B20D8] text-slate-800 font-bold text-xs shadow-lg transition"
        >
          <ArrowLeft className="w-4 h-4 text-[#4B20D8]" /> Exit Game
        </Link>

        <div className="pointer-events-auto flex items-center gap-3">
          <button
            onClick={toggleMute}
            className="p-2.5 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200 text-slate-700 hover:text-[#4B20D8] shadow-lg transition cursor-pointer"
            aria-label="Toggle Mute"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-md border border-slate-200 px-4 py-2.5 rounded-2xl text-xs font-bold text-amber-600 shadow-lg">
            <Trophy className="w-4 h-4 text-amber-500" /> BEST: {highScore}m
          </div>

          <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-md border border-slate-200 px-4 py-2.5 rounded-2xl text-xs font-bold text-[#4B20D8] shadow-lg">
            <Gauge className="w-4 h-4 text-[#4B20D8]" /> {speed} KM/H
          </div>
        </div>
      </header>

      {/* 3D CANVAS SCENE WITH DYNAMIC SSR FALSE */}
      <div className="w-full h-full absolute inset-0 z-0">
        <Canvas shadows gl={{ antialias: true, powerPreference: 'high-performance' }}>
          <Suspense fallback={null}>
            <HighwayScene
              gameState={gameState}
              setGameState={setGameState}
              setScore={setScore}
              setSpeed={setSpeed}
              highScore={highScore}
              setHighScore={setHighScore}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* START OVERLAY */}
      {gameState === 'START' && (
        <div className="absolute inset-0 z-30 bg-slate-900/30 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md w-full bg-white/95 backdrop-blur-xl p-8 rounded-3xl border border-slate-200 shadow-2xl space-y-5"
          >
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-indigo-50 border border-indigo-200 text-[#4B20D8] font-mono font-bold text-xs rounded-full uppercase tracking-wider">
              <Sun className="w-3.5 h-3.5 text-amber-500" /> Error 404: Route Not Found
            </div>

            <h1 className="text-5xl sm:text-6xl font-black text-[#11145A] tracking-tight leading-none">
              Error 404
            </h1>

            <p className="text-sm text-[#74799A] leading-relaxed font-medium">
              You&apos;ve drifted off the main route! Cruise past pine forests and mountain ranges
              while dodging daytime highway traffic.
            </p>

            <button
              onClick={startGame}
              className="w-full py-4 bg-gradient-to-r from-[#4B20D8] to-[#5B2EE6] hover:from-[#3215A8] hover:to-[#4B20D8] text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-[#4B20D8]/30 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Flame className="w-5 h-5 fill-white" /> START DAY RACE
            </button>

            <div className="pt-2 text-[11px] text-[#858AA8] font-semibold tracking-wider uppercase">
              USE ARROWS / WASD TO DRIVE (UP: GAS | DOWN: BRAKE | LEFT/RIGHT: STEER)
            </div>
          </motion.div>
        </div>
      )}

      {/* GAME OVER OVERLAY */}
      {gameState === 'GAMEOVER' && (
        <div className="absolute inset-0 z-30 bg-slate-900/40 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md w-full bg-white/95 backdrop-blur-xl p-8 rounded-3xl border border-slate-200 shadow-2xl space-y-6"
          >
            <h2 className="text-5xl font-black text-rose-600 tracking-tight">CRASHED!</h2>

            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <p className="text-xs font-bold text-[#74799A] uppercase tracking-wider">
                Total Distance Driven
              </p>
              <p className="text-4xl font-black text-[#11145A] font-mono">{score} meters</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={startGame}
                className="flex-1 py-4 bg-[#4B20D8] hover:bg-[#3215A8] text-white font-bold text-xs rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#4B20D8]/20"
              >
                <RotateCcw className="w-4 h-4" /> Try Again
              </button>

              <Link
                href="/"
                onClick={() => audioFX.playClick()}
                className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-2xl transition flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4 text-slate-600" /> Go Home
              </Link>
            </div>
          </motion.div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="absolute bottom-4 left-0 right-0 z-20 text-center text-[11px] font-semibold text-slate-500 pointer-events-none">
        TRIVIA by Super Chennai • 3D Daylight Edition
      </footer>
    </section>
  )
}
