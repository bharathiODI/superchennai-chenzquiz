


'use client'

import React, { useState, useEffect, useRef, Suspense, useMemo } from 'react'
import Link from 'next/link'
import { Canvas, useFrame } from '@react-three/fiber'
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
  Trees,
} from 'lucide-react'

// ==========================================
// 1. SOUND SYNTHESIZER (WEB AUDIO API)
// ==========================================
class SoundFX {
  private ctx: AudioContext | null = null
  private engineOsc: OscillatorNode | null = null
  private engineGain: GainNode | null = null
  public isMuted: boolean = false

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      this.ctx = new AudioCtx()
    }
    if (this.ctx.state === 'suspended') {
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
}

const audioFX = new SoundFX()

// ==========================================
// 2. PROCEDURAL ENVIRONMENT (TREES & MOUNTAINS)
// ==========================================

// Realistic Evergreen Pine Tree
function PineTree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Tree Trunk */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.25, 1.2, 8]} />
        <meshStandardMaterial color="#4A2E1A" roughness={0.9} />
      </mesh>

      {/* Layer 1 (Bottom Foliage) */}
      <mesh position={[0, 1.6, 0]} castShadow>
        <coneGeometry args={[1.1, 1.4, 7]} />
        <meshStandardMaterial color="#15803D" roughness={0.8} flatShading />
      </mesh>

      {/* Layer 2 (Middle Foliage) */}
      <mesh position={[0, 2.4, 0]} castShadow>
        <coneGeometry args={[0.85, 1.2, 7]} />
        <meshStandardMaterial color="#166534" roughness={0.8} flatShading />
      </mesh>

      {/* Layer 3 (Top Crown) */}
      <mesh position={[0, 3.1, 0]} castShadow>
        <coneGeometry args={[0.55, 1.0, 7]} />
        <meshStandardMaterial color="#22C55E" roughness={0.7} flatShading />
      </mesh>
    </group>
  )
}

// Distant Mountain Ranges
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
// 3. ULTRA-REALISTIC 3D SPORTS CAR MODEL
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
      {/* Lower Chassis Base */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.75, 0.35, 3.9]} />
        <meshStandardMaterial color={color} roughness={0.15} metalness={0.85} />
      </mesh>

      {/* Aerodynamic Cabin Glass */}
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

      {/* Front Hood Scoop */}
      <mesh position={[0, 0.48, 1.15]} castShadow>
        <boxGeometry args={[1.2, 0.1, 1.2]} />
        <meshStandardMaterial color={color} roughness={0.15} metalness={0.85} />
      </mesh>

      {/* Realistic LED Headlights */}
      <mesh position={[-0.62, 0.4, 1.96]}>
        <boxGeometry args={[0.32, 0.1, 0.05]} />
        <meshStandardMaterial color="#38BDF8" emissive="#38BDF8" emissiveIntensity={4} />
      </mesh>
      <mesh position={[0.62, 0.4, 1.96]}>
        <boxGeometry args={[0.32, 0.1, 0.05]} />
        <meshStandardMaterial color="#38BDF8" emissive="#38BDF8" emissiveIntensity={4} />
      </mesh>

      {/* Tail Light Strip */}
      <mesh position={[0, 0.48, -1.96]}>
        <boxGeometry args={[1.6, 0.08, 0.05]} />
        <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={5} />
      </mesh>

      {/* Racing Rear Spoiler */}
      <mesh position={[0, 0.88, -1.8]} castShadow>
        <boxGeometry args={[1.85, 0.06, 0.35]} />
        <meshStandardMaterial color="#0F172A" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* High-Detail Wheels */}
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
// 4. REALISTIC DAYLIGHT HIGHWAY SCENE
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

  // Pre-populate Static Roadside Trees
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

  // Keyboard Event Listeners
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

  // Reset Game Logic
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

  // Main 60FPS Game Loop
  useFrame((_, delta) => {
    if (gameState !== 'PLAYING') return

    // Steering Physics
    if (keysRef.current.left) playerXRef.current = Math.max(-5.2, playerXRef.current - 13 * delta)
    if (keysRef.current.right) playerXRef.current = Math.min(5.2, playerXRef.current + 13 * delta)

    // Gas & Brake Acceleration
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

    // Distance Calculation
    const moveDist = (currentSpeed * delta) / 3.6
    distanceRef.current += moveDist
    scoreRef.current += Math.round(moveDist)
    setScore(scoreRef.current)

    // Scroll Road Texture Offset
    if (roadMatRef.current && roadMatRef.current.map) {
      roadMatRef.current.map.offset.y = (distanceRef.current * 0.1) % 1
    }

    // Move Dynamic Trees
    treesRef.current.forEach((tree) => {
      tree.z += moveDist
      if (tree.z > 20) {
        tree.z = -140
      }
    })
    setTreesState([...treesRef.current])

    // Traffic Spawner
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

    // Traffic Physics & Collision Detection
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

  // Procedural Asphalt Texture Generation
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

      {/* Procedural Mountain Horizons */}
      <MountainRange side="left" />
      <MountainRange side="right" />

      {/* Main Asphalt Highway Surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -40]} receiveShadow>
        <planeGeometry args={[14, 180]} />
        <meshStandardMaterial ref={roadMatRef} map={roadTexture} roughness={0.35} />
      </mesh>

      {/* Green Landscape Side Belts */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-25, -0.05, -40]} receiveShadow>
        <planeGeometry args={[36, 180]} />
        <meshStandardMaterial color="#15803D" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[25, -0.05, -40]} receiveShadow>
        <planeGeometry args={[36, 180]} />
        <meshStandardMaterial color="#15803D" roughness={0.9} />
      </mesh>

      {/* Dynamic Roadside Trees */}
      {treesState.map((tree) => (
        <PineTree key={tree.id} position={[tree.x, 0, tree.z]} />
      ))}

      {/* Soft Contact Ground Shadows */}
      <ContactShadows position={[0, 0.01, 0]} opacity={0.6} scale={40} blur={2} far={10} />

      {/* Player Sports Car */}
      <SportsCar
        position={[playerXRef.current, 0, 0]}
        color="#4B20D8"
        isPlayer={true}
        isSteering={steeringDir}
      />

      {/* Enemy Traffic */}
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
// 5. MAIN PAGE & HUD OVERLAYS
// ==========================================
export default function NotFound() {
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER'>('START')
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [speed, setSpeed] = useState(0)
  const [isMuted, setIsMuted] = useState(false)

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

      {/* 3D CANVAS SCENE */}
      <div className="w-full h-full absolute inset-0 z-0">
        <Canvas shadows>
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
              You&lsquo;ve drifted off the main route! Cruise past pine forests and mountain ranges while
              dodging daytime highway traffic.
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



// // // 'use client'

// // // import React, { useEffect, useRef, useState } from 'react'
// // // import Link from 'next/link'
// // // import { motion } from 'framer-motion'
// // // import { Home, ArrowLeft, RotateCcw, Trophy, Gauge, Volume2, VolumeX } from 'lucide-react'

// // // export default function NotFound() {
// // //   const canvasRef = useRef<HTMLCanvasElement | null>(null)
// // //   const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER'>('START')
// // //   const [score, setScore] = useState(0)
// // //   const [highScore, setHighScore] = useState(0)
// // //   const [speed, setSpeed] = useState(0)
// // //   const [isMuted, setIsMuted] = useState(false)

// // //   // Game & Physics State Refs
// // //   const carPosRef = useRef({ x: 0.5 })
// // //   const speedRef = useRef(0)
// // //   const isAcceleratingRef = useRef(false)
// // //   const isBrakingRef = useRef(false)
// // //   const isSteeringLeftRef = useRef(false)
// // //   const isSteeringRightRef = useRef(false)
// // //   const scoreRef = useRef(0)
// // //   const isPlayingRef = useRef(false)
// // //   const obstaclesRef = useRef<{ x: number; y: number; speed: number; color: string }[]>([])

// // //   // Sound Synth Audio Context & Nodes
// // //   const audioCtxRef = useRef<AudioContext | null>(null)
// // //   const engineOscRef = useRef<OscillatorNode | null>(null)

// // //   // Initialize Web Audio API
// // //   const getAudioContext = () => {
// // //     if (!audioCtxRef.current) {
// // //       const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
// // //       audioCtxRef.current = new AudioCtx()
// // //     }
// // //     if (audioCtxRef.current.state === 'suspended') {
// // //       audioCtxRef.current.resume()
// // //     }
// // //     return audioCtxRef.current
// // //   }

// // //   // Audio: Continuous Engine Sound
// // //   useEffect(() => {
// // //     const startEngineSound = () => {
// // //       if (isMuted) return
// // //       try {
// // //         const ctx = getAudioContext()
// // //         if (engineOscRef.current) return

// // //         const osc = ctx.createOscillator()
// // //         const gain = ctx.createGain()

// // //         osc.type = 'sawtooth'
// // //         osc.frequency.setValueAtTime(45, ctx.currentTime)

// // //         gain.gain.setValueAtTime(0.04, ctx.currentTime)

// // //         osc.connect(gain)
// // //         gain.connect(ctx.destination)
// // //         osc.start()

// // //         engineOscRef.current = osc
// // //       } catch (e) {
// // //         console.error(e)
// // //       }
// // //     }

// // //     if (gameState === 'PLAYING') {
// // //       startEngineSound()
// // //     } else {
// // //       stopEngineSound()
// // //     }

// // //     return () => {
// // //       stopEngineSound()
// // //     }
// // //   }, [gameState, isMuted])

// // //   const stopEngineSound = () => {
// // //     if (engineOscRef.current) {
// // //       try {
// // //         engineOscRef.current.stop()
// // //         engineOscRef.current.disconnect()
// // //       } catch (e) {}
// // //       engineOscRef.current = null
// // //     }
// // //   }

// // //   // Audio FX: Crash Explosion Sound
// // //   const playCrashSound = () => {
// // //     if (isMuted) return
// // //     try {
// // //       const ctx = getAudioContext()
// // //       const osc = ctx.createOscillator()
// // //       const gain = ctx.createGain()

// // //       osc.type = 'sawtooth'
// // //       osc.frequency.setValueAtTime(140, ctx.currentTime)
// // //       osc.frequency.exponentialRampToValueAtTime(15, ctx.currentTime + 0.5)

// // //       gain.gain.setValueAtTime(0.4, ctx.currentTime)
// // //       gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5)

// // //       osc.connect(gain)
// // //       gain.connect(ctx.destination)

// // //       osc.start()
// // //       osc.stop(ctx.currentTime + 0.5)
// // //     } catch (e) {}
// // //   }

// // //   // Audio FX: Quick UI Click Sound
// // //   const playClickSound = () => {
// // //     if (isMuted) return
// // //     try {
// // //       const ctx = getAudioContext()
// // //       const osc = ctx.createOscillator()
// // //       const gain = ctx.createGain()

// // //       osc.type = 'sine'
// // //       osc.frequency.setValueAtTime(600, ctx.currentTime)
// // //       osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.08)

// // //       gain.gain.setValueAtTime(0.1, ctx.currentTime)
// // //       gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08)

// // //       osc.connect(gain)
// // //       gain.connect(ctx.destination)

// // //       osc.start()
// // //       osc.stop(ctx.currentTime + 0.08)
// // //     } catch (e) {}
// // //   }

// // //   // Keyboard Event Handlers
// // //   useEffect(() => {
// // //     const handleKeyDown = (e: KeyboardEvent) => {
// // //       if (!isPlayingRef.current) return

// // //       if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
// // //         isSteeringLeftRef.current = true
// // //       }
// // //       if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
// // //         isSteeringRightRef.current = true
// // //       }
// // //       if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
// // //         isAcceleratingRef.current = true
// // //       }
// // //       if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
// // //         isBrakingRef.current = true
// // //       }
// // //     }

// // //     const handleKeyUp = (e: KeyboardEvent) => {
// // //       if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
// // //         isSteeringLeftRef.current = false
// // //       }
// // //       if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
// // //         isSteeringRightRef.current = false
// // //       }
// // //       if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
// // //         isAcceleratingRef.current = false
// // //       }
// // //       if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
// // //         isBrakingRef.current = false
// // //       }
// // //     }

// // //     window.addEventListener('keydown', handleKeyDown)
// // //     window.addEventListener('keyup', handleKeyUp)

// // //     return () => {
// // //       window.removeEventListener('keydown', handleKeyDown)
// // //       window.removeEventListener('keyup', handleKeyUp)
// // //     }
// // //   }, [])

// // //   // Main Canvas Render Loop
// // //   useEffect(() => {
// // //     const canvas = canvasRef.current
// // //     if (!canvas) return
// // //     const ctx = canvas.getContext('2d')
// // //     if (!ctx) return

// // //     let animationFrameId: number
// // //     const trees: { side: -1 | 1; z: number }[] = []

// // //     for (let i = 0; i < 24; i++) {
// // //       trees.push({
// // //         side: i % 2 === 0 ? -1 : 1,
// // //         z: i * 0.04,
// // //       })
// // //     }

// // //     let distance = 0
// // //     let roadCurve = 0
// // //     let targetCurve = 0

// // //     const resizeCanvas = () => {
// // //       const parent = canvas.parentElement
// // //       if (parent) {
// // //         canvas.width = parent.clientWidth
// // //         canvas.height = Math.min(520, Math.max(380, window.innerHeight * 0.55))
// // //       }
// // //     }
// // //     resizeCanvas()
// // //     window.addEventListener('resize', resizeCanvas)

// // //     // Draw Pine Tree
// // //     const drawTree = (x: number, y: number, scale: number) => {
// // //       const treeWidth = 48 * scale
// // //       const treeHeight = 85 * scale

// // //       ctx.save()
// // //       ctx.translate(x, y)

// // //       ctx.fillStyle = '#4A3728'
// // //       ctx.fillRect(-treeWidth * 0.15, -treeHeight * 0.2, treeWidth * 0.3, treeHeight * 0.2)

// // //       const leafGrad = ctx.createLinearGradient(0, -treeHeight, 0, 0)
// // //       leafGrad.addColorStop(0, '#34D399')
// // //       leafGrad.addColorStop(0.5, '#059669')
// // //       leafGrad.addColorStop(1, '#047857')

// // //       ctx.fillStyle = leafGrad

// // //       ctx.beginPath()
// // //       ctx.moveTo(0, -treeHeight * 0.5)
// // //       ctx.lineTo(-treeWidth * 0.5, -treeHeight * 0.2)
// // //       ctx.lineTo(treeWidth * 0.5, -treeHeight * 0.2)
// // //       ctx.closePath()
// // //       ctx.fill()

// // //       ctx.beginPath()
// // //       ctx.moveTo(0, -treeHeight * 0.75)
// // //       ctx.lineTo(-treeWidth * 0.4, -treeHeight * 0.4)
// // //       ctx.lineTo(treeWidth * 0.4, -treeHeight * 0.4)
// // //       ctx.closePath()
// // //       ctx.fill()

// // //       ctx.beginPath()
// // //       ctx.moveTo(0, -treeHeight)
// // //       ctx.lineTo(-treeWidth * 0.28, -treeHeight * 0.6)
// // //       ctx.lineTo(treeWidth * 0.28, -treeHeight * 0.6)
// // //       ctx.closePath()
// // //       ctx.fill()

// // //       ctx.restore()
// // //     }

// // //     // High Quality Dynamic Sports Car Drawing
// // //     const drawSleekCar = (
// // //       x: number,
// // //       y: number,
// // //       width: number,
// // //       isPlayer: boolean,
// // //       mainColor?: string,
// // //       isCrashed: boolean = false,
// // //     ) => {
// // //       const height = width * 1.55

// // //       ctx.save()
// // //       ctx.translate(x, y)

// // //       // Ground Shadow
// // //       ctx.fillStyle = 'rgba(15, 23, 42, 0.35)'
// // //       ctx.beginPath()
// // //       ctx.ellipse(0, height * 0.32, width * 0.65, height * 0.18, 0, 0, Math.PI * 2)
// // //       ctx.fill()

// // //       // Wheels
// // //       ctx.fillStyle = '#0F172A'
// // //       ctx.beginPath()
// // //       ctx.roundRect(-width * 0.54, -height * 0.3, width * 0.15, height * 0.22, 4)
// // //       ctx.roundRect(width * 0.39, -height * 0.3, width * 0.15, height * 0.22, 4)
// // //       ctx.roundRect(-width * 0.54, height * 0.1, width * 0.15, height * 0.22, 4)
// // //       ctx.roundRect(width * 0.39, height * 0.1, width * 0.15, height * 0.22, 4)
// // //       ctx.fill()

// // //       // Main Car Chassis
// // //       const carGrad = ctx.createLinearGradient(0, -height * 0.5, 0, height * 0.5)
// // //       if (isPlayer) {
// // //         carGrad.addColorStop(0, '#818CF8')
// // //         carGrad.addColorStop(0.3, '#4F46E5')
// // //         carGrad.addColorStop(0.8, '#3730A3')
// // //         carGrad.addColorStop(1, '#1E1B4B')
// // //       } else {
// // //         const baseColor = mainColor || '#EF4444'
// // //         carGrad.addColorStop(0, '#FCA5A5')
// // //         carGrad.addColorStop(0.4, baseColor)
// // //         carGrad.addColorStop(1, '#7F1D1D')
// // //       }

// // //       ctx.fillStyle = carGrad
// // //       ctx.beginPath()
// // //       ctx.roundRect(-width * 0.46, -height * 0.45, width * 0.92, height * 0.85, [
// // //         width * 0.25,
// // //         width * 0.25,
// // //         width * 0.15,
// // //         width * 0.15,
// // //       ])
// // //       ctx.fill()

// // //       // Side Mirrors
// // //       ctx.fillStyle = isPlayer ? '#4338CA' : '#B91C1C'
// // //       ctx.beginPath()
// // //       ctx.roundRect(-width * 0.58, -height * 0.18, width * 0.14, height * 0.08, 3)
// // //       ctx.roundRect(width * 0.44, -height * 0.18, width * 0.14, height * 0.08, 3)
// // //       ctx.fill()

// // //       // Cabin & Glass Roof
// // //       const cabinGrad = ctx.createLinearGradient(0, -height * 0.25, 0, height * 0.15)
// // //       cabinGrad.addColorStop(0, '#334155')
// // //       cabinGrad.addColorStop(0.5, '#0F172A')
// // //       cabinGrad.addColorStop(1, '#020617')
// // //       ctx.fillStyle = cabinGrad
// // //       ctx.beginPath()
// // //       ctx.roundRect(-width * 0.34, -height * 0.26, width * 0.68, height * 0.42, width * 0.12)
// // //       ctx.fill()

// // //       // Windshield Highlight
// // //       ctx.fillStyle = '#38BDF8'
// // //       ctx.globalAlpha = 0.65
// // //       ctx.beginPath()
// // //       ctx.roundRect(-width * 0.28, -height * 0.21, width * 0.56, height * 0.14, width * 0.06)
// // //       ctx.fill()
// // //       ctx.globalAlpha = 1.0

// // //       // Spoiler Wing
// // //       ctx.fillStyle = '#020617'
// // //       ctx.fillRect(-width * 0.44, height * 0.34, width * 0.88, height * 0.05)

// // //       // Taillights
// // //       ctx.fillStyle = '#EF4444'
// // //       ctx.shadowColor = '#EF4444'
// // //       ctx.shadowBlur = isPlayer ? 10 : 4
// // //       ctx.fillRect(-width * 0.4, height * 0.28, width * 0.26, height * 0.06)
// // //       ctx.fillRect(width * 0.14, height * 0.28, width * 0.26, height * 0.06)

// // //       // License Plate Light / Exhaust
// // //       ctx.shadowBlur = 0
// // //       ctx.fillStyle = '#F59E0B'
// // //       ctx.fillRect(-width * 0.12, height * 0.31, width * 0.24, height * 0.04)

// // //       // Smoke Effect on Crash
// // //       if (isCrashed) {
// // //         ctx.fillStyle = 'rgba(100, 116, 139, 0.6)'
// // //         ctx.beginPath()
// // //         ctx.arc(-width * 0.2, -height * 0.3, width * 0.3, 0, Math.PI * 2)
// // //         ctx.arc(width * 0.1, -height * 0.5, width * 0.4, 0, Math.PI * 2)
// // //         ctx.fill()
// // //       }

// // //       ctx.restore()
// // //     }

// // //     // Main Loop
// // //     const render = () => {
// // //       ctx.clearRect(0, 0, canvas.width, canvas.height)

// // //       const w = canvas.width
// // //       const h = canvas.height

// // //       if (isPlayingRef.current) {
// // //         // Continuous Steering
// // //         if (isSteeringLeftRef.current) {
// // //           carPosRef.current.x = Math.max(0.08, carPosRef.current.x - 0.018)
// // //         }
// // //         if (isSteeringRightRef.current) {
// // //           carPosRef.current.x = Math.min(0.92, carPosRef.current.x + 0.018)
// // //         }

// // //         // Speed Physics
// // //         if (isAcceleratingRef.current) {
// // //           speedRef.current = Math.min(200, speedRef.current + 1.4)
// // //         } else if (isBrakingRef.current) {
// // //           speedRef.current = Math.max(0, speedRef.current - 4.0)
// // //         } else {
// // //           speedRef.current = Math.max(25, speedRef.current - 0.5)
// // //         }

// // //         setSpeed(Math.round(speedRef.current))

// // //         // Dynamic Sound Pitch
// // //         if (engineOscRef.current && audioCtxRef.current) {
// // //           const pitch = 45 + (speedRef.current / 200) * 120
// // //           engineOscRef.current.frequency.setValueAtTime(pitch, audioCtxRef.current.currentTime)
// // //         }

// // //         if (Math.random() < 0.01) {
// // //           targetCurve = (Math.random() - 0.5) * 2.2
// // //         }
// // //         roadCurve += (targetCurve - roadCurve) * 0.025
// // //         distance += speedRef.current * 0.12
// // //       }

// // //       // 1. Sky & Backdrop
// // //       const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.42)
// // //       skyGrad.addColorStop(0, '#BAE6FD')
// // //       skyGrad.addColorStop(0.6, '#E0F2FE')
// // //       skyGrad.addColorStop(1, '#F0F9FF')
// // //       ctx.fillStyle = skyGrad
// // //       ctx.fillRect(0, 0, w, h * 0.42)

// // //       // Mountain Range Silhouette
// // //       ctx.fillStyle = '#94A3B8'
// // //       ctx.beginPath()
// // //       ctx.moveTo(0, h * 0.42)
// // //       ctx.lineTo(w * 0.2, h * 0.26)
// // //       ctx.lineTo(w * 0.45, h * 0.38)
// // //       ctx.lineTo(w * 0.7, h * 0.24)
// // //       ctx.lineTo(w, h * 0.42)
// // //       ctx.closePath()
// // //       ctx.fill()

// // //       // 2. Widescreen Road & Grass Landscape
// // //       const horizonY = h * 0.38
// // //       const roadTopW = w * 0.12
// // //       const roadBotW = w * 0.94
// // //       const curveX = roadCurve * 110

// // //       const grassGrad = ctx.createLinearGradient(0, horizonY, 0, h)
// // //       grassGrad.addColorStop(0, '#A7F3D0')
// // //       grassGrad.addColorStop(1, '#6EE7B7')
// // //       ctx.fillStyle = grassGrad
// // //       ctx.fillRect(0, horizonY, w, h - horizonY)

// // //       ctx.beginPath()
// // //       ctx.moveTo(w / 2 - roadTopW / 2 + curveX, horizonY)
// // //       ctx.lineTo(w / 2 + roadTopW / 2 + curveX, horizonY)
// // //       ctx.lineTo(w / 2 + roadBotW / 2, h)
// // //       ctx.lineTo(w / 2 - roadBotW / 2, h)
// // //       ctx.closePath()

// // //       const roadGrad = ctx.createLinearGradient(0, horizonY, 0, h)
// // //       roadGrad.addColorStop(0, '#64748B')
// // //       roadGrad.addColorStop(1, '#334155')
// // //       ctx.fillStyle = roadGrad
// // //       ctx.fill()

// // //       // Red & White Road Curb Borders
// // //       const numSegments = 18
// // //       for (let i = numSegments - 1; i >= 0; i--) {
// // //         const p1 = (i / numSegments + (distance % 60) / 600) % 1
// // //         const p2 = ((i + 1) / numSegments + (distance % 60) / 600) % 1

// // //         const y1 = horizonY + p1 * p1 * (h - horizonY)
// // //         const y2 = horizonY + p2 * p2 * (h - horizonY)

// // //         const center1 = w / 2 + curveX * p1
// // //         const center2 = w / 2 + curveX * p2

// // //         const halfW1 = (roadTopW + p1 * (roadBotW - roadTopW)) / 2
// // //         const halfW2 = (roadTopW + p2 * (roadBotW - roadTopW)) / 2

// // //         ctx.fillStyle = i % 2 === 0 ? '#EF4444' : '#FFFFFF'
// // //         ctx.beginPath()
// // //         ctx.moveTo(center1 - halfW1 - 14 * p1, y1)
// // //         ctx.lineTo(center1 - halfW1, y1)
// // //         ctx.lineTo(center2 - halfW2, y2)
// // //         ctx.lineTo(center2 - halfW2 - 16 * p2, y2)
// // //         ctx.closePath()
// // //         ctx.fill()

// // //         ctx.beginPath()
// // //         ctx.moveTo(center1 + halfW1, y1)
// // //         ctx.lineTo(center1 + halfW1 + 14 * p1, y1)
// // //         ctx.lineTo(center2 + halfW2 + 16 * p2, y2)
// // //         ctx.lineTo(center2 + halfW2, y2)
// // //         ctx.closePath()
// // //         ctx.fill()
// // //       }

// // //       // Yellow Center Dashed Line
// // //       ctx.strokeStyle = '#FACC15'
// // //       ctx.lineWidth = 4
// // //       ctx.setLineDash([24, 24])
// // //       ctx.lineDashOffset = -distance * 1.8
// // //       ctx.beginPath()
// // //       ctx.moveTo(w / 2 + curveX, horizonY)
// // //       ctx.quadraticCurveTo(w / 2 + curveX * 0.5, horizonY + (h - horizonY) * 0.5, w / 2, h)
// // //       ctx.stroke()
// // //       ctx.setLineDash([])

// // //       // 3. Environment Trees
// // //       for (let i = 0; i < trees.length; i++) {
// // //         const tree = trees[i]
// // //         if (isPlayingRef.current) tree.z += 0.005 + (speedRef.current / 200) * 0.016
// // //         if (tree.z > 1) tree.z -= 1

// // //         const p = tree.z
// // //         const y = horizonY + p * p * (h - horizonY)
// // //         const scale = p * p * 1.3
// // //         const currentRoadW = roadTopW + p * (roadBotW - roadTopW)
// // //         const centerX = w / 2 + curveX * p
// // //         const x = centerX + tree.side * (currentRoadW / 2 + 50 + p * 110)

// // //         drawTree(x, y, scale)
// // //       }

// // //       // 4. Enemy Traffic Logic
// // //       if (isPlayingRef.current) {
// // //         scoreRef.current += Math.floor(speedRef.current / 25)
// // //         setScore(Math.floor(scoreRef.current / 10))

// // //         if (Math.random() < 0.028) {
// // //           obstaclesRef.current.push({
// // //             x: 0.12 + Math.random() * 0.76,
// // //             y: 0,
// // //             speed: 0.005 + Math.random() * 0.008,
// // //             color: Math.random() > 0.5 ? '#EF4444' : Math.random() > 0.5 ? '#06B6D4' : '#F59E0B',
// // //           })
// // //         }

// // //         const obsList = obstaclesRef.current
// // //         for (let i = obsList.length - 1; i >= 0; i--) {
// // //           const obs = obsList[i]
// // //           obs.y += obs.speed + (speedRef.current / 200) * 0.012

// // //           const p = obs.y
// // //           const y = horizonY + p * p * (h - horizonY)
// // //           const currentRoadW = roadTopW + p * (roadBotW - roadTopW)
// // //           const centerX = w / 2 + curveX * p
// // //           const obsX = centerX - currentRoadW / 2 + obs.x * currentRoadW
// // //           const carWidth = 16 + p * 48

// // //           drawSleekCar(obsX, y, carWidth, false, obs.color)

// // //           const playerY = h - 70
// // //           const playerX = w / 2 - roadBotW / 2 + carPosRef.current.x * roadBotW
// // //           const dist = Math.hypot(obsX - playerX, y - playerY)

// // //           if (dist < 36) {
// // //             isPlayingRef.current = false
// // //             playCrashSound()
// // //             setGameState('GAMEOVER')
// // //             setHighScore((prev) => Math.max(prev, Math.floor(scoreRef.current / 10)))
// // //           }

// // //           if (obs.y > 1) obsList.splice(i, 1)
// // //         }
// // //       }

// // //       // 5. Player Car Render
// // //       const playerY = h - 70
// // //       const playerX = w / 2 - roadBotW / 2 + carPosRef.current.x * roadBotW
// // //       drawSleekCar(playerX, playerY, 56, true, undefined, gameState === 'GAMEOVER')

// // //       animationFrameId = requestAnimationFrame(render)
// // //     }

// // //     render()

// // //     return () => {
// // //       cancelAnimationFrame(animationFrameId)
// // //       window.removeEventListener('resize', resizeCanvas)
// // //     }
// // //   }, [isMuted, gameState])

// // //   // Fresh Start Game Handler
// // //   const startGame = () => {
// // //     playClickSound()
// // //     scoreRef.current = 0
// // //     speedRef.current = 45
// // //     carPosRef.current.x = 0.5
// // //     obstaclesRef.current = [] // Clear previous obstacles completely
// // //     isSteeringLeftRef.current = false
// // //     isSteeringRightRef.current = false
// // //     isAcceleratingRef.current = false
// // //     isBrakingRef.current = false
// // //     setScore(0)
// // //     setSpeed(45)
// // //     setGameState('PLAYING')
// // //     isPlayingRef.current = true
// // //   }

// // //   return (
// // //     <section className="min-h-screen w-full bg-slate-50 text-slate-900 flex flex-col items-center justify-between p-4 sm:p-6 overflow-hidden select-none font-sans">
// // //       {/* HEADER HUD */}
// // //       <div className="w-full max-w-5xl flex items-center justify-between z-10 py-2">
// // //         <Link
// // //           href="/"
// // //           onClick={playClickSound}
// // //           className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-500 text-slate-700 font-bold text-xs shadow-sm transition"
// // //         >
// // //           <ArrowLeft className="w-4 h-4" /> Exit Game
// // //         </Link>

// // //         <div className="flex items-center gap-2 sm:gap-3">
// // //           <button
// // //             onClick={() => {
// // //               playClickSound()
// // //               setIsMuted(!isMuted)
// // //             }}
// // //             className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 shadow-sm cursor-pointer"
// // //           >
// // //             {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
// // //           </button>
// // //           <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold text-amber-600 shadow-sm">
// // //             <Trophy className="w-4 h-4" /> BEST: {highScore}
// // //           </div>
// // //           <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold text-indigo-600 shadow-sm">
// // //             <Gauge className="w-4 h-4" /> {speed} KM/H
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* CANVAS RACING DISPLAY */}
// // //       <div className="relative w-full max-w-5xl flex items-center justify-center my-auto">
// // //         <canvas
// // //           ref={canvasRef}
// // //           className="rounded-3xl border-2 border-slate-200 shadow-xl bg-sky-100 w-full"
// // //         />

// // //         {/* OVERLAY: START SCREEN */}
// // //         {gameState === 'START' && (
// // //           <div className="absolute inset-0 bg-white/90 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center p-6 text-center">
// // //             <motion.div
// // //               initial={{ scale: 0.85, opacity: 0 }}
// // //               animate={{ scale: 1, opacity: 1 }}
// // //               className="space-y-4"
// // //             >
// // //               <span className="px-3.5 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-600 font-mono font-bold text-xs rounded-full uppercase tracking-wider">
// // //                 Error 404: Route Lost
// // //               </span>
// // //               <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight">
// // //                  404
// // //               </h1>
// // //               <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed font-medium">
// // //                 The page you are looking for does not exist. Accelerate, dodge traffic on the
// // //                 highway, and score big!
// // //               </p>

// // //               <button
// // //                 onClick={startGame}
// // //                 className="mt-4 px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-indigo-600/30 transition cursor-pointer"
// // //               >
// // //                 START RACE
// // //               </button>

// // //               <p className="text-[11px] text-slate-500 font-semibold tracking-wider">
// // //                 USE ARROWS / WASD (UP: GAS, DOWN: BRAKE, LEFT/RIGHT: STEER)
// // //               </p>
// // //             </motion.div>
// // //           </div>
// // //         )}

// // //         {/* OVERLAY: GAME OVER SCREEN */}
// // //         {gameState === 'GAMEOVER' && (
// // //           <div className="absolute inset-0 bg-white/95 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center p-6 text-center">
// // //             <motion.div
// // //               initial={{ scale: 0.85, opacity: 0 }}
// // //               animate={{ scale: 1, opacity: 1 }}
// // //               className="space-y-4"
// // //             >
// // //               <h2 className="text-4xl sm:text-5xl font-black text-rose-600 tracking-tight">
// // //                 CRASHED!
// // //               </h2>
// // //               <p className="text-base text-slate-600 font-semibold">
// // //                 Distance Score:{' '}
// // //                 <span className="text-slate-900 font-mono font-bold text-lg">{score}</span>
// // //               </p>

// // //               <div className="flex gap-4 justify-center pt-2">
// // //                 <button
// // //                   onClick={startGame}
// // //                   className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-2 cursor-pointer shadow-md shadow-indigo-600/20"
// // //                 >
// // //                   <RotateCcw className="w-4 h-4" /> Try Again
// // //                 </button>

// // //                 <Link
// // //                   href="/"
// // //                   onClick={playClickSound}
// // //                   className="px-8 py-3.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition flex items-center gap-2"
// // //                 >
// // //                   <Home className="w-4 h-4" /> Back to Home
// // //                 </Link>
// // //               </div>
// // //             </motion.div>
// // //           </div>
// // //         )}
// // //       </div>

// // //       {/* MOBILE & ON-SCREEN CONTROLS WITH TOUCH HOLD */}
// // //       {gameState === 'PLAYING' && (
// // //         <div className="w-full max-w-5xl flex flex-col gap-2 mt-2 select-none touch-none">
// // //           <div className="grid grid-cols-2 gap-3">
// // //             <button
// // //               onTouchStart={(e) => {
// // //                 e.preventDefault()
// // //                 isSteeringLeftRef.current = true
// // //               }}
// // //               onTouchEnd={(e) => {
// // //                 e.preventDefault()
// // //                 isSteeringLeftRef.current = false
// // //               }}
// // //               onMouseDown={() => {
// // //                 isSteeringLeftRef.current = true
// // //               }}
// // //               onMouseUp={() => {
// // //                 isSteeringLeftRef.current = false
// // //               }}
// // //               onMouseLeave={() => {
// // //                 isSteeringLeftRef.current = false
// // //               }}
// // //               className="py-3.5 bg-white active:bg-slate-100 border border-slate-200 rounded-xl text-center font-bold text-xs text-slate-700 shadow-sm cursor-pointer select-none"
// // //             >
// // //               ◄ STEER LEFT
// // //             </button>
// // //             <button
// // //               onTouchStart={(e) => {
// // //                 e.preventDefault()
// // //                 isSteeringRightRef.current = true
// // //               }}
// // //               onTouchEnd={(e) => {
// // //                 e.preventDefault()
// // //                 isSteeringRightRef.current = false
// // //               }}
// // //               onMouseDown={() => {
// // //                 isSteeringRightRef.current = true
// // //               }}
// // //               onMouseUp={() => {
// // //                 isSteeringRightRef.current = false
// // //               }}
// // //               onMouseLeave={() => {
// // //                 isSteeringRightRef.current = false
// // //               }}
// // //               className="py-3.5 bg-white active:bg-slate-100 border border-slate-200 rounded-xl text-center font-bold text-xs text-slate-700 shadow-sm cursor-pointer select-none"
// // //             >
// // //               STEER RIGHT ►
// // //             </button>
// // //           </div>

// // //           <div className="grid grid-cols-2 gap-3">
// // //             <button
// // //               onTouchStart={(e) => {
// // //                 e.preventDefault()
// // //                 isBrakingRef.current = true
// // //               }}
// // //               onTouchEnd={(e) => {
// // //                 e.preventDefault()
// // //                 isBrakingRef.current = false
// // //               }}
// // //               onMouseDown={() => {
// // //                 isBrakingRef.current = true
// // //               }}
// // //               onMouseUp={() => {
// // //                 isBrakingRef.current = false
// // //               }}
// // //               onMouseLeave={() => {
// // //                 isBrakingRef.current = false
// // //               }}
// // //               className="py-3.5 bg-rose-50 active:bg-rose-100 border border-rose-200 rounded-xl text-center font-bold text-xs text-rose-700 shadow-sm cursor-pointer select-none"
// // //             >
// // //               🛑 BRAKE
// // //             </button>
// // //             <button
// // //               onTouchStart={(e) => {
// // //                 e.preventDefault()
// // //                 isAcceleratingRef.current = true
// // //               }}
// // //               onTouchEnd={(e) => {
// // //                 e.preventDefault()
// // //                 isAcceleratingRef.current = false
// // //               }}
// // //               onMouseDown={() => {
// // //                 isAcceleratingRef.current = true
// // //               }}
// // //               onMouseUp={() => {
// // //                 isAcceleratingRef.current = false
// // //               }}
// // //               onMouseLeave={() => {
// // //                 isAcceleratingRef.current = false
// // //               }}
// // //               className="py-3.5 bg-emerald-50 active:bg-emerald-100 border border-emerald-200 rounded-xl text-center font-bold text-xs text-emerald-700 shadow-sm cursor-pointer select-none"
// // //             >
// // //               ⚡ ACCELERATE
// // //             </button>
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* FOOTER */}
// // //       <footer className="text-center text-[11px] font-medium text-slate-500 pt-2">
// // //         Super Chennai Trivia • Light Edition 404
// // //       </footer>
// // //     </section>
// // //   )
// // // }

// // // // // // // 'use client'

// // // // // // // import React from 'react'
// // // // // // // import Link from 'next/link'
// // // // // // // import { motion } from 'framer-motion'
// // // // // // // import { Home, Gamepad2, ArrowLeft, Compass, Flame } from 'lucide-react'

// // // // // // // export default function NotFound() {
// // // // // // //   return (
// // // // // // //     <section className="relative min-h-screen w-full overflow-hidden bg-slate-50 text-slate-800 flex flex-col justify-between items-center px-4 sm:px-6 py-10">
// // // // // // //       {/* BACKGROUND GLOWS (LIGHT MODE) */}
// // // // // // //       <div className="absolute top-[-10%] left-[-10%] h-[400px] w-[400px] rounded-full bg-indigo-200/50 blur-[120px] pointer-events-none" />
// // // // // // //       <div className="absolute bottom-[-10%] right-[-10%] h-[400px] w-[400px] rounded-full bg-amber-200/50 blur-[120px] pointer-events-none" />

// // // // // // //       {/* TOP BADGE */}
// // // // // // //       <div className="relative z-10 text-center max-w-xl mx-auto mt-4">
// // // // // // //         <motion.div
// // // // // // //           initial={{ opacity: 0, y: -15 }}
// // // // // // //           animate={{ opacity: 1, y: 0 }}
// // // // // // //           className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-4 py-1.5 text-xs font-bold text-indigo-600 uppercase tracking-widest shadow-sm backdrop-blur-md mb-4"
// // // // // // //         >
// // // // // // //           <Compass className="h-4 w-4 animate-spin-slow text-indigo-500" />
// // // // // // //           404 Page Not Found
// // // // // // //         </motion.div>
// // // // // // //       </div>

// // // // // // //       {/* GAMING ANIMATION CONTAINER */}
// // // // // // //       <div className="relative z-10 w-full max-w-lg my-auto flex flex-col items-center text-center">
// // // // // // //         {/* ANIMATED GAME CONSOLE & 404 GRAPHIC */}
// // // // // // //         <div className="relative flex items-center justify-center mb-6">
// // // // // // //           {/* Floating Game Icons */}
// // // // // // //           <motion.div
// // // // // // //             animate={{ y: [-8, 8, -8], rotate: [-5, 5, -5] }}
// // // // // // //             transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
// // // // // // //             className="absolute -top-6 -left-8 p-3 rounded-2xl bg-white shadow-lg border border-slate-100 text-amber-500"
// // // // // // //           >
// // // // // // //             <Flame className="w-6 h-6" />
// // // // // // //           </motion.div>

// // // // // // //           <motion.div
// // // // // // //             animate={{ y: [8, -8, 8], rotate: [5, -5, 5] }}
// // // // // // //             transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
// // // // // // //             className="absolute -bottom-4 -right-6 p-3 rounded-2xl bg-white shadow-lg border border-slate-100 text-indigo-500"
// // // // // // //           >
// // // // // // //             <Gamepad2 className="w-6 h-6" />
// // // // // // //           </motion.div>

// // // // // // //           {/* MAIN 404 DISPLAY */}
// // // // // // //           <motion.div
// // // // // // //             initial={{ scale: 0.8, opacity: 0 }}
// // // // // // //             animate={{ scale: 1, opacity: 1 }}
// // // // // // //             transition={{ duration: 0.5 }}
// // // // // // //             className="bg-white/90 border border-slate-200/80 rounded-3xl p-8 shadow-xl shadow-indigo-100/50 backdrop-blur-xl flex flex-col items-center"
// // // // // // //           >
// // // // // // //             <motion.div
// // // // // // //               animate={{ scale: [1, 1.05, 1] }}
// // // // // // //               transition={{ duration: 2, repeat: Infinity }}
// // // // // // //               className="relative"
// // // // // // //             >
// // // // // // //               <h1 className="text-7xl sm:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-500">
// // // // // // //                 404
// // // // // // //               </h1>
// // // // // // //             </motion.div>

// // // // // // //             {/* Pixelated / Game Over Style Badge */}
// // // // // // //             <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-600 border border-rose-200 rounded-lg text-xs font-black uppercase tracking-wider">
// // // // // // //               <span>Game Over</span>
// // // // // // //             </div>
// // // // // // //           </motion.div>
// // // // // // //         </div>

// // // // // // //         {/* TEXT CONTENT */}
// // // // // // //         <motion.h2
// // // // // // //           initial={{ opacity: 0, y: 10 }}
// // // // // // //           animate={{ opacity: 1, y: 0 }}
// // // // // // //           transition={{ delay: 0.2 }}
// // // // // // //           className="text-2xl sm:text-3xl font-bold text-slate-800"
// // // // // // //         >
// // // // // // //           Lost in Chennai?
// // // // // // //         </motion.h2>

// // // // // // //         <motion.p
// // // // // // //           initial={{ opacity: 0, y: 10 }}
// // // // // // //           animate={{ opacity: 1, y: 0 }}
// // // // // // //           transition={{ delay: 0.3 }}
// // // // // // //           className="mt-2 text-sm sm:text-base text-slate-500 max-w-md"
// // // // // // //         >
// // // // // // //           Looks like this level doesn’t exist or has been moved. Let’s get you back to the main game!
// // // // // // //         </motion.p>

// // // // // // //         {/* NAVIGATION ACTION BUTTONS */}
// // // // // // //         <motion.div
// // // // // // //           initial={{ opacity: 0, y: 15 }}
// // // // // // //           animate={{ opacity: 1, y: 0 }}
// // // // // // //           transition={{ delay: 0.4 }}
// // // // // // //           className="mt-8 flex flex-wrap items-center justify-center gap-3"
// // // // // // //         >
// // // // // // //           <button
// // // // // // //             type="button"
// // // // // // //             onClick={() => window.history.back()}
// // // // // // //             className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm transition-all shadow-sm"
// // // // // // //           >
// // // // // // //             <ArrowLeft className="w-4 h-4" /> Go Back
// // // // // // //           </button>

// // // // // // //           <Link
// // // // // // //             href="/"
// // // // // // //             className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-indigo-200"
// // // // // // //           >
// // // // // // //             <Home className="w-4 h-4" /> Back To Home
// // // // // // //           </Link>
// // // // // // //         </motion.div>
// // // // // // //       </div>

// // // // // // //       {/* FOOTER */}
// // // // // // //       <div className="relative z-10 text-xs text-slate-400 text-center">
// // // // // // //         Need help? Check your URL or return home.
// // // // // // //       </div>
// // // // // // //     </section>
// // // // // // //   )
// // // // // // // }

// // 'use client'

// // import { PerspectiveCamera, Sky, Stars } from '@react-three/drei'
// // import { Canvas, useFrame } from '@react-three/fiber'
// // import confetti from 'canvas-confetti'
// // import { motion } from 'framer-motion'
// // import {
// //   ArrowLeft,
// //   Flame,
// //   Gauge,
// //   Home,
// //   RotateCcw,
// //   Sparkles,
// //   Trophy,
// //   Volume2,
// //   VolumeX,
// // } from 'lucide-react'
// // import Link from 'next/link'
// // import React, { Suspense, useEffect, useRef, useState } from 'react'
// // import * as THREE from 'three'

// // // ==========================================
// // // 1. SOUND SYNTHESIZER (WEB AUDIO API)
// // // ==========================================
// // class SoundFX {
// //   private ctx: AudioContext | null = null
// //   private engineOsc: OscillatorNode | null = null
// //   private engineGain: GainNode | null = null
// //   public isMuted: boolean = false

// //   private init() {
// //     if (!this.ctx) {
// //       const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
// //       this.ctx = new AudioCtx()
// //     }
// //     if (this.ctx.state === 'suspended') {
// //       this.ctx.resume()
// //     }
// //   }

// //   public startEngine() {
// //     if (this.isMuted) return
// //     this.init()
// //     if (!this.ctx || this.engineOsc) return

// //     try {
// //       this.engineOsc = this.ctx.createOscillator()
// //       this.engineGain = this.ctx.createGain()

// //       this.engineOsc.type = 'sawtooth'
// //       this.engineOsc.frequency.setValueAtTime(50, this.ctx.currentTime)

// //       this.engineGain.gain.setValueAtTime(0.05, this.ctx.currentTime)

// //       this.engineOsc.connect(this.engineGain)
// //       this.engineGain.connect(this.ctx.destination)
// //       this.engineOsc.start()
// //     } catch (e) {
// //       console.error(e)
// //     }
// //   }

// //   public updateEnginePitch(speed: number) {
// //     if (this.engineOsc && this.ctx) {
// //       const pitch = 45 + (speed / 240) * 160
// //       this.engineOsc.frequency.setValueAtTime(pitch, this.ctx.currentTime)
// //     }
// //   }

// //   public stopEngine() {
// //     if (this.engineOsc) {
// //       try {
// //         this.engineOsc.stop()
// //         this.engineOsc.disconnect()
// //       } catch (e) {}
// //       this.engineOsc = null
// //     }
// //   }

// //   public playCrash() {
// //     if (this.isMuted) return
// //     this.init()
// //     if (!this.ctx) return

// //     try {
// //       const osc = this.ctx.createOscillator()
// //       const gain = this.ctx.createGain()

// //       osc.type = 'sawtooth'
// //       osc.frequency.setValueAtTime(160, this.ctx.currentTime)
// //       osc.frequency.exponentialRampToValueAtTime(20, this.ctx.currentTime + 0.6)

// //       gain.gain.setValueAtTime(0.5, this.ctx.currentTime)
// //       gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.6)

// //       osc.connect(gain)
// //       gain.connect(this.ctx.destination)

// //       osc.start()
// //       osc.stop(this.ctx.currentTime + 0.6)
// //     } catch (e) {}
// //   }

// //   public playClick() {
// //     if (this.isMuted) return
// //     this.init()
// //     if (!this.ctx) return

// //     try {
// //       const osc = this.ctx.createOscillator()
// //       const gain = this.ctx.createGain()

// //       osc.type = 'sine'
// //       osc.frequency.setValueAtTime(700, this.ctx.currentTime)
// //       osc.frequency.exponentialRampToValueAtTime(250, this.ctx.currentTime + 0.08)

// //       gain.gain.setValueAtTime(0.12, this.ctx.currentTime)
// //       gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08)

// //       osc.connect(gain)
// //       gain.connect(this.ctx.destination)

// //       osc.start()
// //       osc.stop(this.ctx.currentTime + 0.08)
// //     } catch (e) {}
// //   }
// // }

// // const audioFX = new SoundFX()

// // // ==========================================
// // // 2. 3D SPORTS CAR MODEL
// // // ==========================================
// // function SportsCar({
// //   position,
// //   rotation = [0, 0, 0],
// //   color = '#4F46E5',
// //   isPlayer = false,
// //   isSteering = 0,
// // }: {
// //   position: [number, number, number]
// //   rotation?: [number, number, number]
// //   color?: string
// //   isPlayer?: boolean
// //   isSteering?: number
// // }) {
// //   const carRef = useRef<THREE.Group>(null)

// //   useFrame(() => {
// //     if (carRef.current && isPlayer) {
// //       // Smooth body roll/tilt while steering
// //       carRef.current.rotation.z = THREE.MathUtils.lerp(
// //         carRef.current.rotation.z,
// //         -isSteering * 0.08,
// //         0.1,
// //       )
// //       carRef.current.rotation.y = THREE.MathUtils.lerp(
// //         carRef.current.rotation.y,
// //         isSteering * 0.12,
// //         0.1,
// //       )
// //     }
// //   })

// //   return (
// //     <group ref={carRef} position={position} rotation={rotation}>
// //       {/* Chassis Main Body */}
// //       <mesh position={[0, 0.45, 0]} castShadow>
// //         <boxGeometry args={[1.7, 0.5, 3.8]} />
// //         <meshStandardMaterial color={color} roughness={0.15} metalness={0.85} />
// //       </mesh>

// //       {/* Cabin Glass Canopy */}
// //       <mesh position={[0, 0.8, -0.2]} castShadow>
// //         <boxGeometry args={[1.3, 0.45, 1.8]} />
// //         <meshStandardMaterial
// //           color="#0F172A"
// //           roughness={0.05}
// //           metalness={0.95}
// //           transparent
// //           opacity={0.9}
// //         />
// //       </mesh>

// //       {/* Front Hood Scoop */}
// //       <mesh position={[0, 0.55, 1.1]}>
// //         <boxGeometry args={[1.1, 0.12, 1.2]} />
// //         <meshStandardMaterial color={color} roughness={0.2} metalness={0.8} />
// //       </mesh>

// //       {/* Headlights */}
// //       <mesh position={[-0.6, 0.45, 1.91]}>
// //         <boxGeometry args={[0.35, 0.12, 0.05]} />
// //         <meshStandardMaterial color="#38BDF8" emissive="#38BDF8" emissiveIntensity={3} />
// //       </mesh>
// //       <mesh position={[0.6, 0.45, 1.91]}>
// //         <boxGeometry args={[0.35, 0.12, 0.05]} />
// //         <meshStandardMaterial color="#38BDF8" emissive="#38BDF8" emissiveIntensity={3} />
// //       </mesh>

// //       {/* Taillights */}
// //       <mesh position={[-0.65, 0.5, -1.91]}>
// //         <boxGeometry args={[0.35, 0.1, 0.05]} />
// //         <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={4} />
// //       </mesh>
// //       <mesh position={[0.65, 0.5, -1.91]}>
// //         <boxGeometry args={[0.35, 0.1, 0.05]} />
// //         <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={4} />
// //       </mesh>

// //       {/* Rear Spoiler */}
// //       <mesh position={[0, 0.95, -1.75]}>
// //         <boxGeometry args={[1.8, 0.08, 0.4]} />
// //         <meshStandardMaterial color="#020617" roughness={0.3} />
// //       </mesh>
// //       <mesh position={[-0.6, 0.75, -1.75]}>
// //         <boxGeometry args={[0.1, 0.3, 0.2]} />
// //         <meshStandardMaterial color="#020617" />
// //       </mesh>
// //       <mesh position={[0.6, 0.75, -1.75]}>
// //         <boxGeometry args={[0.1, 0.3, 0.2]} />
// //         <meshStandardMaterial color="#020617" />
// //       </mesh>

// //       {/* Wheels */}
// //       {[
// //         [-0.9, 0.3, 1.1],
// //         [0.9, 0.3, 1.1],
// //         [-0.9, 0.3, -1.2],
// //         [0.9, 0.3, -1.2],
// //       ].map((pos, i) => (
// //         <mesh
// //           key={i}
// //           position={pos as [number, number, number]}
// //           rotation={[0, 0, Math.PI / 2]}
// //           castShadow
// //         >
// //           <cylinderGeometry args={[0.32, 0.32, 0.28, 24]} />
// //           <meshStandardMaterial color="#020617" roughness={0.8} />
// //         </mesh>
// //       ))}
// //     </group>
// //   )
// // }

// // // ==========================================
// // // 3. 3D HIGHWAY & ENVIRONMENT SCENE
// // // ==========================================
// // function HighwayScene({
// //   gameState,
// //   setGameState,
// //   setScore,
// //   setSpeed,
// //   highScore,
// //   setHighScore,
// // }: {
// //   gameState: 'START' | 'PLAYING' | 'GAMEOVER'
// //   setGameState: (state: 'START' | 'PLAYING' | 'GAMEOVER') => void
// //   setScore: React.Dispatch<React.SetStateAction<number>>
// //   setSpeed: React.Dispatch<React.SetStateAction<number>>
// //   highScore: number
// //   setHighScore: React.Dispatch<React.SetStateAction<number>>
// // }) {
// //   const playerXRef = useRef(0)
// //   const speedRef = useRef(0)
// //   const distanceRef = useRef(0)
// //   const scoreRef = useRef(0)

// //   const keysRef = useRef<{ left: boolean; right: boolean; up: boolean; down: boolean }>({
// //     left: false,
// //     right: false,
// //     up: false,
// //     down: false,
// //   })

// //   const roadMatRef = useRef<THREE.MeshStandardMaterial>(null)
// //   const trafficRef = useRef<{ id: number; x: number; z: number; speed: number; color: string }[]>(
// //     [],
// //   )

// //   const [trafficState, setTrafficState] = useState<
// //     { id: number; x: number; z: number; color: string }[]
// //   >([])

// //   // Controls Listener
// //   useEffect(() => {
// //     const onKeyDown = (e: KeyboardEvent) => {
// //       if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keysRef.current.left = true
// //       if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keysRef.current.right = true
// //       if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') keysRef.current.up = true
// //       if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') keysRef.current.down = true
// //     }

// //     const onKeyUp = (e: KeyboardEvent) => {
// //       if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keysRef.current.left = false
// //       if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keysRef.current.right = false
// //       if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') keysRef.current.up = false
// //       if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') keysRef.current.down = false
// //     }

// //     window.addEventListener('keydown', onKeyDown)
// //     window.addEventListener('keyup', onKeyUp)
// //     return () => {
// //       window.removeEventListener('keydown', onKeyDown)
// //       window.removeEventListener('keyup', onKeyUp)
// //     }
// //   }, [])

// //   // Reset Game State on Start
// //   useEffect(() => {
// //     if (gameState === 'PLAYING') {
// //       playerXRef.current = 0
// //       speedRef.current = 60
// //       distanceRef.current = 0
// //       scoreRef.current = 0
// //       trafficRef.current = []
// //       audioFX.startEngine()
// //     } else {
// //       audioFX.stopEngine()
// //     }
// //   }, [gameState])

// //   // Main 60FPS Game Physics Loop
// //   useFrame((_, delta) => {
// //     if (gameState !== 'PLAYING') return

// //     // Steering Physics
// //     if (keysRef.current.left) playerXRef.current = Math.max(-5.2, playerXRef.current - 12 * delta)
// //     if (keysRef.current.right) playerXRef.current = Math.min(5.2, playerXRef.current + 12 * delta)

// //     // Acceleration & Braking Physics
// //     if (keysRef.current.up) {
// //       speedRef.current = Math.min(220, speedRef.current + 40 * delta)
// //     } else if (keysRef.current.down) {
// //       speedRef.current = Math.max(0, speedRef.current - 90 * delta)
// //     } else {
// //       speedRef.current = Math.max(30, speedRef.current - 12 * delta)
// //     }

// //     const currentSpeed = speedRef.current
// //     setSpeed(Math.round(currentSpeed))
// //     audioFX.updateEnginePitch(currentSpeed)

// //     // Distance & Score Calculation
// //     const moveDist = (currentSpeed * delta) / 3.6
// //     distanceRef.current += moveDist
// //     scoreRef.current += Math.round(moveDist)
// //     setScore(scoreRef.current)

// //     // Animate Road Texture Offset
// //     if (roadMatRef.current) {
// //       roadMatRef.current.map!.offset.y = (distanceRef.current * 0.1) % 1
// //     }

// //     // Traffic Spawner Logic
// //     if (Math.random() < 0.035) {
// //       const lanes = [-3.8, -1.3, 1.3, 3.8]
// //       const randomLane = lanes[Math.floor(Math.random() * lanes.length)]
// //       const colors = ['#EF4444', '#10B981', '#F59E0B', '#06B6D4', '#EC4899']

// //       trafficRef.current.push({
// //         id: Math.random(),
// //         x: randomLane,
// //         z: -120,
// //         speed: 20 + Math.random() * 30,
// //         color: colors[Math.floor(Math.random() * colors.length)],
// //       })
// //     }

// //     // Update Traffic Positions & Collision Check
// //     const playerX = playerXRef.current
// //     const updatedTraffic = []

// //     for (let i = 0; i < trafficRef.current.length; i++) {
// //       const vehicle = trafficRef.current[i]
// //       const relativeSpeed = currentSpeed - vehicle.speed
// //       vehicle.z += (relativeSpeed * delta) / 3.6

// //       // Collision Detection (Bounding Box)
// //       if (Math.abs(vehicle.z) < 3.2 && Math.abs(vehicle.x - playerX) < 1.5) {
// //         audioFX.playCrash()
// //         setGameState('GAMEOVER')
// //         setHighScore((prev) => {
// //           const newHigh = Math.max(prev, scoreRef.current)
// //           if (scoreRef.current > prev && scoreRef.current > 0) {
// //             confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
// //           }
// //           return newHigh
// //         })
// //         return
// //       }

// //       if (vehicle.z < 20) {
// //         updatedTraffic.push(vehicle)
// //       }
// //     }

// //     trafficRef.current = updatedTraffic
// //     setTrafficState([...trafficRef.current])
// //   })

// //   // Procedural Canvas Texture for High-Def Asphalt
// //   const roadTexture = React.useMemo(() => {
// //     const canvas = document.createElement('canvas')
// //     canvas.width = 512
// //     canvas.height = 512
// //     const ctx = canvas.getContext('2d')!

// //     ctx.fillStyle = '#1E293B'
// //     ctx.fillRect(0, 0, 512, 512)

// //     // White Outer Margins
// //     ctx.fillStyle = '#FFFFFF'
// //     ctx.fillRect(10, 0, 16, 512)
// //     ctx.fillRect(486, 0, 16, 512)

// //     // Yellow Center Double Lines
// //     ctx.fillStyle = '#FACC15'
// //     ctx.fillRect(250, 0, 4, 512)
// //     ctx.fillRect(258, 0, 4, 512)

// //     // Dashed Lane Dividers
// //     ctx.fillStyle = '#94A3B8'
// //     for (let i = 0; i < 512; i += 64) {
// //       ctx.fillRect(130, i, 6, 32)
// //       ctx.fillRect(376, i, 6, 32)
// //     }

// //     const texture = new THREE.CanvasTexture(canvas)
// //     texture.wrapS = THREE.RepeatWrapping
// //     texture.wrapT = THREE.RepeatWrapping
// //     texture.repeat.set(1, 10)
// //     return texture
// //   }, [])

// //   const steeringDir = keysRef.current.left ? -1 : keysRef.current.right ? 1 : 0

// //   return (
// //     <>
// //       <PerspectiveCamera makeDefault position={[0, 3.2, 7]} fov={60} />
// //       <ambientLight intensity={0.7} />
// //       <directionalLight position={[20, 40, 20]} intensity={1.5} castShadow />

// //       {/* Skybox & Environmental Atmosphere */}
// //       <Sky sunPosition={[100, 20, 100]} turbineTime={1} mieCoefficient={0.005} rayleigh={0.5} />
// //       <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />

// //       {/* Main Asphalt Highway Plane */}
// //       <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -40]} receiveShadow>
// //         <planeGeometry args={[14, 160]} />
// //         <meshStandardMaterial ref={roadMatRef} map={roadTexture} roughness={0.4} />
// //       </mesh>

// //       {/* Side Grass Fields */}
// //       <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-20, -0.05, -40]}>
// //         <planeGeometry args={[26, 160]} />
// //         <meshStandardMaterial color="#059669" roughness={0.9} />
// //       </mesh>
// //       <mesh rotation={[-Math.PI / 2, 0, 0]} position={[20, -0.05, -40]}>
// //         <planeGeometry args={[26, 160]} />
// //         <meshStandardMaterial color="#059669" roughness={0.9} />
// //       </mesh>

// //       {/* Player Car */}
// //       <SportsCar
// //         position={[playerXRef.current, 0, 0]}
// //         color="#4F46E5"
// //         isPlayer={true}
// //         isSteering={steeringDir}
// //       />

// //       {/* Dynamic Enemy Traffic */}
// //       {trafficState.map((vehicle) => (
// //         <SportsCar
// //           key={vehicle.id}
// //           position={[vehicle.x, 0, vehicle.z]}
// //           color={vehicle.color}
// //           rotation={[0, Math.PI, 0]}
// //         />
// //       ))}
// //     </>
// //   )
// // }

// // // ==========================================
// // // 4. MAIN PAGE & INTERFACE LAYOUT
// // // ==========================================
// // export default function NotFound() {
// //   const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER'>('START')
// //   const [score, setScore] = useState(0)
// //   const [highScore, setHighScore] = useState(0)
// //   const [speed, setSpeed] = useState(0)
// //   const [isMuted, setIsMuted] = useState(false)

// //   const toggleMute = () => {
// //     audioFX.isMuted = !isMuted
// //     setIsMuted(!isMuted)
// //     audioFX.playClick()
// //   }

// //   const startGame = () => {
// //     audioFX.playClick()
// //     setGameState('PLAYING')
// //   }

// //   return (
// //     <section className="relative w-full h-screen bg-slate-950 text-white overflow-hidden select-none font-sans flex flex-col justify-between">
// //       {/* HUD HEADER */}
// //       <header className="absolute top-0 left-0 right-0 z-20 p-4 sm:p-6 flex items-center justify-between max-w-7xl mx-auto w-full pointer-events-none">
// //         <Link
// //           href="/"
// //           onClick={() => audioFX.playClick()}
// //           className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800 hover:border-indigo-500 text-slate-200 font-bold text-xs shadow-xl transition"
// //         >
// //           <ArrowLeft className="w-4 h-4" /> Exit Game
// //         </Link>

// //         <div className="pointer-events-auto flex items-center gap-3">
// //           <button
// //             onClick={toggleMute}
// //             className="p-2.5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800 text-slate-300 hover:text-indigo-400 shadow-xl transition cursor-pointer"
// //           >
// //             {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
// //           </button>

// //           <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md border border-slate-800 px-4 py-2.5 rounded-2xl text-xs font-bold text-amber-400 shadow-xl">
// //             <Trophy className="w-4 h-4" /> BEST: {highScore}m
// //           </div>

// //           <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md border border-slate-800 px-4 py-2.5 rounded-2xl text-xs font-bold text-indigo-400 shadow-xl">
// //             <Gauge className="w-4 h-4" /> {speed} KM/H
// //           </div>
// //         </div>
// //       </header>

// //       {/* 3D CANVAS DISPLAY */}
// //       <div className="w-full h-full absolute inset-0 z-0">
// //         <Canvas shadows>
// //           <Suspense fallback={null}>
// //             <HighwayScene
// //               gameState={gameState}
// //               setGameState={setGameState}
// //               setScore={setScore}
// //               setSpeed={setSpeed}
// //               highScore={highScore}
// //               setHighScore={setHighScore}
// //             />
// //           </Suspense>
// //         </Canvas>
// //       </div>

// //       {/* OVERLAY: START SCREEN */}
// //       {gameState === 'START' && (
// //         <div className="absolute inset-0 z-30 bg-slate-950/80 backdrop-blur-lg flex flex-col items-center justify-center p-6 text-center">
// //           <motion.div
// //             initial={{ scale: 0.9, opacity: 0 }}
// //             animate={{ scale: 1, opacity: 1 }}
// //             className="max-w-md space-y-5"
// //           >
// //             <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-mono font-bold text-xs rounded-full uppercase tracking-wider">
// //               <Sparkles className="w-3.5 h-3.5" /> Error 404: Route Not Found
// //             </span>

// //             <h1 className="text-6xl sm:text-7xl font-black text-white tracking-tight leading-none drop-shadow-2xl">
// //               LOST ROAD
// //             </h1>

// //             <p className="text-sm text-slate-400 leading-relaxed font-medium">
// //               You've drifted off the map! Take control of the sports car, dodge highway traffic, and
// //               set the ultimate distance record.
// //             </p>

// //             <button
// //               onClick={startGame}
// //               className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-indigo-600/40 transition cursor-pointer flex items-center justify-center gap-2"
// //             >
// //               <Flame className="w-5 h-5 fill-white" /> START RACE
// //             </button>

// //             <div className="pt-2 text-[11px] text-slate-500 font-semibold tracking-wider uppercase">
// //               USE ARROWS / WASD TO DRIVE (UP: GAS | DOWN: BRAKE | LEFT/RIGHT: STEER)
// //             </div>
// //           </motion.div>
// //         </div>
// //       )}

// //       {/* OVERLAY: GAME OVER SCREEN */}
// //       {gameState === 'GAMEOVER' && (
// //         <div className="absolute inset-0 z-30 bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center">
// //           <motion.div
// //             initial={{ scale: 0.9, opacity: 0 }}
// //             animate={{ scale: 1, opacity: 1 }}
// //             className="max-w-md space-y-6"
// //           >
// //             <h2 className="text-5xl font-black text-rose-500 tracking-tight drop-shadow-lg">
// //               CRASHED!
// //             </h2>

// //             <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-2 shadow-2xl">
// //               <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
// //                 Total Distance Driven
// //               </p>
// //               <p className="text-4xl font-black text-white font-mono">{score} meters</p>
// //             </div>

// //             <div className="flex gap-3">
// //               <button
// //                 onClick={startGame}
// //                 className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/30"
// //               >
// //                 <RotateCcw className="w-4 h-4" /> Try Again
// //               </button>

// //               <Link
// //                 href="/"
// //                 onClick={() => audioFX.playClick()}
// //                 className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-2xl transition flex items-center justify-center gap-2"
// //               >
// //                 <Home className="w-4 h-4" /> Go Home
// //               </Link>
// //             </div>
// //           </motion.div>
// //         </div>
// //       )}

// //       {/* FOOTER BRANDING */}
// //       <footer className="absolute bottom-4 left-0 right-0 z-20 text-center text-[11px] font-semibold text-slate-500 pointer-events-none">
// //         TRIVIA by Super Chennai • 3D Edition
// //       </footer>
// //     </section>
// //   )
// // }

// 'use client'

// import React, { useState, useEffect, useRef, Suspense } from 'react'
// import Link from 'next/link'
// import { Canvas, useFrame } from '@react-three/fiber'
// import { PerspectiveCamera, Sky, Html, ContactShadows } from '@react-three/drei'
// import * as THREE from 'three'
// import { motion } from 'framer-motion'
// import confetti from 'canvas-confetti'
// import {
//   ArrowLeft,
//   RotateCcw,
//   Trophy,
//   Gauge,
//   Volume2,
//   VolumeX,
//   Sparkles,
//   Flame,
//   Home,
//   Sun,
// } from 'lucide-react'

// // ==========================================
// // 1. SOUND SYNTHESIZER (WEB AUDIO API)
// // ==========================================
// class SoundFX {
//   private ctx: AudioContext | null = null
//   private engineOsc: OscillatorNode | null = null
//   private engineGain: GainNode | null = null
//   public isMuted: boolean = false

//   private init() {
//     if (!this.ctx) {
//       const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
//       this.ctx = new AudioCtx()
//     }
//     if (this.ctx.state === 'suspended') {
//       this.ctx.resume()
//     }
//   }

//   public startEngine() {
//     if (this.isMuted) return
//     this.init()
//     if (!this.ctx || this.engineOsc) return

//     try {
//       this.engineOsc = this.ctx.createOscillator()
//       this.engineGain = this.ctx.createGain()

//       this.engineOsc.type = 'sawtooth'
//       this.engineOsc.frequency.setValueAtTime(50, this.ctx.currentTime)

//       this.engineGain.gain.setValueAtTime(0.04, this.ctx.currentTime)

//       this.engineOsc.connect(this.engineGain)
//       this.engineGain.connect(this.ctx.destination)
//       this.engineOsc.start()
//     } catch (e) {
//       console.error(e)
//     }
//   }

//   public updateEnginePitch(speed: number) {
//     if (this.engineOsc && this.ctx) {
//       const pitch = 50 + (speed / 240) * 180
//       this.engineOsc.frequency.setValueAtTime(pitch, this.ctx.currentTime)
//     }
//   }

//   public stopEngine() {
//     if (this.engineOsc) {
//       try {
//         this.engineOsc.stop()
//         this.engineOsc.disconnect()
//       } catch (e) {}
//       this.engineOsc = null
//     }
//   }

//   public playCrash() {
//     if (this.isMuted) return
//     this.init()
//     if (!this.ctx) return

//     try {
//       const osc = this.ctx.createOscillator()
//       const gain = this.ctx.createGain()

//       osc.type = 'sawtooth'
//       osc.frequency.setValueAtTime(180, this.ctx.currentTime)
//       osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.5)

//       gain.gain.setValueAtTime(0.6, this.ctx.currentTime)
//       gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5)

//       osc.connect(gain)
//       gain.connect(this.ctx.destination)

//       osc.start()
//       osc.stop(this.ctx.currentTime + 0.5)
//     } catch (e) {}
//   }

//   public playClick() {
//     if (this.isMuted) return
//     this.init()
//     if (!this.ctx) return

//     try {
//       const osc = this.ctx.createOscillator()
//       const gain = this.ctx.createGain()

//       osc.type = 'sine'
//       osc.frequency.setValueAtTime(800, this.ctx.currentTime)
//       osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.08)

//       gain.gain.setValueAtTime(0.1, this.ctx.currentTime)
//       gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08)

//       osc.connect(gain)
//       gain.connect(this.ctx.destination)

//       osc.start()
//       osc.stop(this.ctx.currentTime + 0.08)
//     } catch (e) {}
//   }
// }

// const audioFX = new SoundFX()

// // ==========================================
// // 2. ULTRA-REALISTIC 3D SPORTS CAR MODEL
// // ==========================================
// function SportsCar({
//   position,
//   rotation = [0, 0, 0],
//   color = '#4B20D8',
//   isPlayer = false,
//   isSteering = 0,
// }: {
//   position: [number, number, number]
//   rotation?: [number, number, number]
//   color?: string
//   isPlayer?: boolean
//   isSteering?: number
// }) {
//   const carRef = useRef<THREE.Group>(null)
//   const wheelRefs = useRef<THREE.Mesh[]>([])

//   useFrame((_, delta) => {
//     if (carRef.current && isPlayer) {
//       // Natural body roll physics on turns
//       carRef.current.rotation.z = THREE.MathUtils.lerp(
//         carRef.current.rotation.z,
//         -isSteering * 0.09,
//         0.12,
//       )
//       carRef.current.rotation.y = THREE.MathUtils.lerp(
//         carRef.current.rotation.y,
//         isSteering * 0.14,
//         0.12,
//       )
//     }

//     // Rotate wheels for real-motion feel
//     wheelRefs.current.forEach((wheel) => {
//       if (wheel) wheel.rotation.x += delta * 15
//     })
//   })

//   return (
//     <group ref={carRef} position={position} rotation={rotation}>
//       {/* Lower Chassis Base */}
//       <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
//         <boxGeometry args={[1.75, 0.35, 3.9]} />
//         <meshStandardMaterial color={color} roughness={0.15} metalness={0.85} />
//       </mesh>

//       {/* Aerodynamic Cabin Glass */}
//       <mesh position={[0, 0.68, -0.15]} castShadow>
//         <boxGeometry args={[1.35, 0.42, 1.9]} />
//         <meshPhysicalMaterial
//           color="#1E293B"
//           roughness={0.05}
//           metalness={0.9}
//           transmission={0.4}
//           transparent
//           opacity={0.85}
//         />
//       </mesh>

//       {/* Front Hood Scoop */}
//       <mesh position={[0, 0.48, 1.15]} castShadow>
//         <boxGeometry args={[1.2, 0.1, 1.2]} />
//         <meshStandardMaterial color={color} roughness={0.15} metalness={0.85} />
//       </mesh>

//       {/* Realistic LED Headlights */}
//       <mesh position={[-0.62, 0.4, 1.96]}>
//         <boxGeometry args={[0.32, 0.1, 0.05]} />
//         <meshStandardMaterial color="#38BDF8" emissive="#38BDF8" emissiveIntensity={4} />
//       </mesh>
//       <mesh position={[0.62, 0.4, 1.96]}>
//         <boxGeometry args={[0.32, 0.1, 0.05]} />
//         <meshStandardMaterial color="#38BDF8" emissive="#38BDF8" emissiveIntensity={4} />
//       </mesh>

//       {/* Tail Light Strip */}
//       <mesh position={[0, 0.48, -1.96]}>
//         <boxGeometry args={[1.6, 0.08, 0.05]} />
//         <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={5} />
//       </mesh>

//       {/* Racing Rear Spoiler */}
//       <mesh position={[0, 0.88, -1.8]} castShadow>
//         <boxGeometry args={[1.85, 0.06, 0.35]} />
//         <meshStandardMaterial color="#0F172A" roughness={0.2} metalness={0.9} />
//       </mesh>
//       <mesh position={[-0.65, 0.7, -1.8]}>
//         <boxGeometry args={[0.08, 0.3, 0.18]} />
//         <meshStandardMaterial color="#0F172A" />
//       </mesh>
//       <mesh position={[0.65, 0.7, -1.8]}>
//         <boxGeometry args={[0.08, 0.3, 0.18]} />
//         <meshStandardMaterial color="#0F172A" />
//       </mesh>

//       {/* High-Detail Wheels with Rims */}
//       {[
//         [-0.92, 0.3, 1.15],
//         [0.92, 0.3, 1.15],
//         [-0.92, 0.3, -1.25],
//         [0.92, 0.3, -1.25],
//       ].map((pos, i) => (
//         <group key={i} position={pos as [number, number, number]}>
//           <mesh
//             ref={(el) => {
//               if (el) wheelRefs.current[i] = el
//             }}
//             rotation={[0, 0, Math.PI / 2]}
//             castShadow
//           >
//             <cylinderGeometry args={[0.32, 0.32, 0.26, 32]} />
//             <meshStandardMaterial color="#1E293B" roughness={0.7} />
//           </mesh>
//         </group>
//       ))}
//     </group>
//   )
// }

// // ==========================================
// // 3. REALISTIC DAYLIGHT HIGHWAY SCENE
// // ==========================================
// function HighwayScene({
//   gameState,
//   setGameState,
//   setScore,
//   setSpeed,
//   highScore,
//   setHighScore,
// }: {
//   gameState: 'START' | 'PLAYING' | 'GAMEOVER'
//   setGameState: (state: 'START' | 'PLAYING' | 'GAMEOVER') => void
//   setScore: React.Dispatch<React.SetStateAction<number>>
//   setSpeed: React.Dispatch<React.SetStateAction<number>>
//   highScore: number
//   setHighScore: React.Dispatch<React.SetStateAction<number>>
// }) {
//   const playerXRef = useRef(0)
//   const speedRef = useRef(0)
//   const distanceRef = useRef(0)
//   const scoreRef = useRef(0)

//   const keysRef = useRef<{ left: boolean; right: boolean; up: boolean; down: boolean }>({
//     left: false,
//     right: false,
//     up: false,
//     down: false,
//   })

//   const roadMatRef = useRef<THREE.MeshStandardMaterial>(null)
//   const trafficRef = useRef<{ id: number; x: number; z: number; speed: number; color: string }[]>(
//     [],
//   )

//   const [trafficState, setTrafficState] = useState<
//     { id: number; x: number; z: number; color: string }[]
//   >([])

//   // Key Event Listeners
//   useEffect(() => {
//     const onKeyDown = (e: KeyboardEvent) => {
//       if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keysRef.current.left = true
//       if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keysRef.current.right = true
//       if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') keysRef.current.up = true
//       if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') keysRef.current.down = true
//     }

//     const onKeyUp = (e: KeyboardEvent) => {
//       if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keysRef.current.left = false
//       if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keysRef.current.right = false
//       if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') keysRef.current.up = false
//       if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') keysRef.current.down = false
//     }

//     window.addEventListener('keydown', onKeyDown)
//     window.addEventListener('keyup', onKeyUp)
//     return () => {
//       window.removeEventListener('keydown', onKeyDown)
//       window.removeEventListener('keyup', onKeyUp)
//     }
//   }, [])

//   // Reset Game State on Start
//   useEffect(() => {
//     if (gameState === 'PLAYING') {
//       playerXRef.current = 0
//       speedRef.current = 70
//       distanceRef.current = 0
//       scoreRef.current = 0
//       trafficRef.current = []
//       audioFX.startEngine()
//     } else {
//       audioFX.stopEngine()
//     }
//   }, [gameState])

//   // Game Loop (60 FPS)
//   useFrame((_, delta) => {
//     if (gameState !== 'PLAYING') return

//     // Steering Physics
//     if (keysRef.current.left) playerXRef.current = Math.max(-5.2, playerXRef.current - 13 * delta)
//     if (keysRef.current.right) playerXRef.current = Math.min(5.2, playerXRef.current + 13 * delta)

//     // Gas & Brake Dynamics
//     if (keysRef.current.up) {
//       speedRef.current = Math.min(230, speedRef.current + 45 * delta)
//     } else if (keysRef.current.down) {
//       speedRef.current = Math.max(0, speedRef.current - 95 * delta)
//     } else {
//       speedRef.current = Math.max(35, speedRef.current - 14 * delta)
//     }

//     const currentSpeed = speedRef.current
//     setSpeed(Math.round(currentSpeed))
//     audioFX.updateEnginePitch(currentSpeed)

//     // Distance Accumulation
//     const moveDist = (currentSpeed * delta) / 3.6
//     distanceRef.current += moveDist
//     scoreRef.current += Math.round(moveDist)
//     setScore(scoreRef.current)

//     // Animate Road Texture Offset
//     if (roadMatRef.current && roadMatRef.current.map) {
//       roadMatRef.current.map.offset.y = (distanceRef.current * 0.1) % 1
//     }

//     // Traffic Spawner Logic
//     if (Math.random() < 0.038) {
//       const lanes = [-3.8, -1.3, 1.3, 3.8]
//       const randomLane = lanes[Math.floor(Math.random() * lanes.length)]
//       const brightCarColors = ['#E11D48', '#2563EB', '#D97706', '#059669', '#7C3AED']

//       trafficRef.current.push({
//         id: Math.random(),
//         x: randomLane,
//         z: -125,
//         speed: 25 + Math.random() * 35,
//         color: brightCarColors[Math.floor(Math.random() * brightCarColors.length)],
//       })
//     }

//     // Update Traffic & Collision Check
//     const playerX = playerXRef.current
//     const updatedTraffic = []

//     for (let i = 0; i < trafficRef.current.length; i++) {
//       const vehicle = trafficRef.current[i]
//       const relativeSpeed = currentSpeed - vehicle.speed
//       vehicle.z += (relativeSpeed * delta) / 3.6

//       // Precise Bounding Box Collision
//       if (Math.abs(vehicle.z) < 3.3 && Math.abs(vehicle.x - playerX) < 1.45) {
//         audioFX.playCrash()
//         setGameState('GAMEOVER')
//         setHighScore((prev) => {
//           const newHigh = Math.max(prev, scoreRef.current)
//           if (scoreRef.current > prev && scoreRef.current > 0) {
//             confetti({ particleCount: 110, spread: 80, origin: { y: 0.6 } })
//           }
//           return newHigh
//         })
//         return
//       }

//       if (vehicle.z < 25) {
//         updatedTraffic.push(vehicle)
//       }
//     }

//     trafficRef.current = updatedTraffic
//     setTrafficState([...trafficRef.current])
//   })

//   // Procedural Ultra-Realistic Asphalt Texture
//   const roadTexture = React.useMemo(() => {
//     const canvas = document.createElement('canvas')
//     canvas.width = 1024
//     canvas.height = 1024
//     const ctx = canvas.getContext('2d')!

//     // Realistic Asphalt Dark Slate Base
//     ctx.fillStyle = '#334155'
//     ctx.fillRect(0, 0, 1024, 1024)

//     // Noise/Grit detail
//     for (let i = 0; i < 8000; i++) {
//       const x = Math.random() * 1024
//       const y = Math.random() * 1024
//       const opacity = Math.random() * 0.15
//       ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
//       ctx.fillRect(x, y, 2, 2)
//     }

//     // White Outer Margins
//     ctx.fillStyle = '#FFFFFF'
//     ctx.fillRect(20, 0, 24, 1024)
//     ctx.fillRect(980, 0, 24, 1024)

//     // Double Yellow Center Dividers
//     ctx.fillStyle = '#F59E0B'
//     ctx.fillRect(502, 0, 8, 1024)
//     ctx.fillRect(514, 0, 8, 1024)

//     // Crisp White Lane Dividers
//     ctx.fillStyle = '#E2E8F0'
//     for (let i = 0; i < 1024; i += 128) {
//       ctx.fillRect(260, i, 12, 64)
//       ctx.fillRect(752, i, 12, 64)
//     }

//     const texture = new THREE.CanvasTexture(canvas)
//     texture.wrapS = THREE.RepeatWrapping
//     texture.wrapT = THREE.RepeatWrapping
//     texture.repeat.set(1, 12)
//     return texture
//   }, [])

//   const steeringDir = keysRef.current.left ? -1 : keysRef.current.right ? 1 : 0

//   return (
//     <>
//       <PerspectiveCamera makeDefault position={[0, 3.4, 7.2]} fov={58} />

//       {/* Realistic Natural Daylight Lighting */}
//       <ambientLight intensity={0.9} />
//       <directionalLight
//         position={[30, 50, 20]}
//         intensity={2.2}
//         castShadow
//         shadow-mapSize-width={2048}
//         shadow-mapSize-height={2048}
//         shadow-camera-near={0.5}
//         shadow-camera-far={150}
//         shadow-camera-left={-20}
//         shadow-camera-right={20}
//         shadow-camera-top={20}
//         shadow-camera-bottom={-20}
//       />

//       {/* Realistic Bright Sky & Sun Orientation */}
//       <Sky
//         sunPosition={[100, 40, 100]}
//         turbidity={0.1}
//         rayleigh={0.8}
//         mieCoefficient={0.005}
//         mieDirectionalG={0.8}
//       />

//       {/* Main Asphalt Highway Surface */}
//       <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -40]} receiveShadow>
//         <planeGeometry args={[14, 180]} />
//         <meshStandardMaterial ref={roadMatRef} map={roadTexture} roughness={0.35} />
//       </mesh>

//       {/* Lush Green Side Landscapes */}
//       <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-25, -0.05, -40]} receiveShadow>
//         <planeGeometry args={[36, 180]} />
//         <meshStandardMaterial color="#10B981" roughness={0.9} />
//       </mesh>
//       <mesh rotation={[-Math.PI / 2, 0, 0]} position={[25, -0.05, -40]} receiveShadow>
//         <planeGeometry args={[36, 180]} />
//         <meshStandardMaterial color="#10B981" roughness={0.9} />
//       </mesh>

//       {/* Soft Contact Ground Shadows */}
//       <ContactShadows position={[0, 0.01, 0]} opacity={0.6} scale={40} blur={2} far={10} />

//       {/* Player Sports Car */}
//       <SportsCar
//         position={[playerXRef.current, 0, 0]}
//         color="#4B20D8"
//         isPlayer={true}
//         isSteering={steeringDir}
//       />

//       {/* Dynamic Enemy Traffic */}
//       {trafficState.map((vehicle) => (
//         <SportsCar
//           key={vehicle.id}
//           position={[vehicle.x, 0, vehicle.z]}
//           color={vehicle.color}
//           rotation={[0, Math.PI, 0]}
//         />
//       ))}
//     </>
//   )
// }

// // ==========================================
// // 4. MAIN PAGE & LIGHT MODE OVERLAYS
// // ==========================================
// export default function NotFound() {
//   const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER'>('START')
//   const [score, setScore] = useState(0)
//   const [highScore, setHighScore] = useState(0)
//   const [speed, setSpeed] = useState(0)
//   const [isMuted, setIsMuted] = useState(false)

//   const toggleMute = () => {
//     audioFX.isMuted = !isMuted
//     setIsMuted(!isMuted)
//     audioFX.playClick()
//   }

//   const startGame = () => {
//     audioFX.playClick()
//     setGameState('PLAYING')
//   }

//   return (
//     <section className="relative w-full h-screen bg-slate-50 text-slate-900 overflow-hidden select-none font-sans flex flex-col justify-between">
//       {/* HUD HEADER - LIGHT MODE GLASSMORPHISM */}
//       <header className="absolute top-0 left-0 right-0 z-20 p-4 sm:p-6 flex items-center justify-between max-w-7xl mx-auto w-full pointer-events-none">
//         <Link
//           href="/"
//           onClick={() => audioFX.playClick()}
//           className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200 hover:border-[#4B20D8] text-slate-800 font-bold text-xs shadow-lg transition"
//         >
//           <ArrowLeft className="w-4 h-4 text-[#4B20D8]" /> Exit Game
//         </Link>

//         <div className="pointer-events-auto flex items-center gap-3">
//           <button
//             onClick={toggleMute}
//             className="p-2.5 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200 text-slate-700 hover:text-[#4B20D8] shadow-lg transition cursor-pointer"
//             aria-label="Toggle Mute"
//           >
//             {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
//           </button>

//           <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-md border border-slate-200 px-4 py-2.5 rounded-2xl text-xs font-bold text-amber-600 shadow-lg">
//             <Trophy className="w-4 h-4 text-amber-500" /> BEST: {highScore}m
//           </div>

//           <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-md border border-slate-200 px-4 py-2.5 rounded-2xl text-xs font-bold text-[#4B20D8] shadow-lg">
//             <Gauge className="w-4 h-4 text-[#4B20D8]" /> {speed} KM/H
//           </div>
//         </div>
//       </header>

//       {/* 3D CANVAS SCENE */}
//       <div className="w-full h-full absolute inset-0 z-0">
//         <Canvas shadows>
//           <Suspense fallback={null}>
//             <HighwayScene
//               gameState={gameState}
//               setGameState={setGameState}
//               setScore={setScore}
//               setSpeed={setSpeed}
//               highScore={highScore}
//               setHighScore={setHighScore}
//             />
//           </Suspense>
//         </Canvas>
//       </div>

//       {/* START SCREEN OVERLAY */}
//       {gameState === 'START' && (
//         <div className="absolute inset-0 z-30 bg-slate-900/30 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
//           <motion.div
//             initial={{ scale: 0.9, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             className="max-w-md w-full bg-white/95 backdrop-blur-xl p-8 rounded-3xl border border-slate-200 shadow-2xl space-y-5"
//           >
//             <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-indigo-50 border border-indigo-200 text-[#4B20D8] font-mono font-bold text-xs rounded-full uppercase tracking-wider">
//               <Sun className="w-3.5 h-3.5 text-amber-500" /> Error 404: Route Not Found
//             </div>

//             <h1 className="text-5xl sm:text-6xl font-black text-[#11145A] tracking-tight leading-none">
//               LOST ROAD
//             </h1>

//             <p className="text-sm text-[#74799A] leading-relaxed font-medium">
//               You've drifted off the main route! Take the wheel, dodge daytime highway traffic, and
//               setting a high score record.
//             </p>

//             <button
//               onClick={startGame}
//               className="w-full py-4 bg-gradient-to-r from-[#4B20D8] to-[#5B2EE6] hover:from-[#3215A8] hover:to-[#4B20D8] text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-[#4B20D8]/30 transition cursor-pointer flex items-center justify-center gap-2"
//             >
//               <Flame className="w-5 h-5 fill-white" /> START DAY RACE
//             </button>

//             <div className="pt-2 text-[11px] text-[#858AA8] font-semibold tracking-wider uppercase">
//               USE ARROWS / WASD TO DRIVE (UP: GAS | DOWN: BRAKE | LEFT/RIGHT: STEER)
//             </div>
//           </motion.div>
//         </div>
//       )}

//       {/* GAME OVER OVERLAY */}
//       {gameState === 'GAMEOVER' && (
//         <div className="absolute inset-0 z-30 bg-slate-900/40 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
//           <motion.div
//             initial={{ scale: 0.9, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             className="max-w-md w-full bg-white/95 backdrop-blur-xl p-8 rounded-3xl border border-slate-200 shadow-2xl space-y-6"
//           >
//             <h2 className="text-5xl font-black text-rose-600 tracking-tight">CRASHED!</h2>

//             <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
//               <p className="text-xs font-bold text-[#74799A] uppercase tracking-wider">
//                 Total Distance Driven
//               </p>
//               <p className="text-4xl font-black text-[#11145A] font-mono">{score} meters</p>
//             </div>

//             <div className="flex gap-3">
//               <button
//                 onClick={startGame}
//                 className="flex-1 py-4 bg-[#4B20D8] hover:bg-[#3215A8] text-white font-bold text-xs rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#4B20D8]/20"
//               >
//                 <RotateCcw className="w-4 h-4" /> Try Again
//               </button>

//               <Link
//                 href="/"
//                 onClick={() => audioFX.playClick()}
//                 className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-2xl transition flex items-center justify-center gap-2"
//               >
//                 <Home className="w-4 h-4 text-slate-600" /> Go Home
//               </Link>
//             </div>
//           </motion.div>
//         </div>
//       )}

//       {/* FOOTER BRANDING */}
//       <footer className="absolute bottom-4 left-0 right-0 z-20 text-center text-[11px] font-semibold text-slate-500 pointer-events-none">
//         TRIVIA by Super Chennai • 3D Daylight Edition
//       </footer>
//     </section>
//   )
// }
