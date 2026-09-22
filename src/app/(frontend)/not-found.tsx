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
  Camera,
} from 'lucide-react'

import { useGLTF } from '@react-three/drei'

// Dynamic Import for Canvas to prevent SSR & Memory Overheads
const Canvas = dynamic(() => import('@react-three/fiber').then((m) => m.Canvas), {
  ssr: false,
})

// Camera Types
type CameraMode = 'CHASE' | 'FIRST_PERSON'

// ==========================================
// 1. SOUND SYNTHESIZER
// ==========================================
class SoundFX {
  private ctx: AudioContext | null = null
  private engineOsc: OscillatorNode | null = null
  private engineGain: GainNode | null = null
  public isMuted: boolean = false

  private init() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
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
      } catch (e) {
        // Silently catch audio stop errors
      }
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
    } catch (e) {
      // Silently catch audio play errors
    }
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
    } catch (e) {
      // Silently catch audio play errors
    }
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

// // ==========================================
// // 2. ENVIRONMENT COMPONENTS
// // ==========================================
// function PineTree({ position }: { position: [number, number, number] }) {
//   return (
//     <group position={position}>
//       <mesh position={[0, 0.6, 0]} castShadow>
//         <cylinderGeometry args={[0.15, 0.25, 1.2, 8]} />
//         <meshStandardMaterial color="#4A2E1A" roughness={0.9} />
//       </mesh>

//       <mesh position={[0, 1.6, 0]} castShadow>
//         <coneGeometry args={[1.1, 1.4, 7]} />
//         <meshStandardMaterial color="#15803D" roughness={0.8} flatShading />
//       </mesh>

//       <mesh position={[0, 2.4, 0]} castShadow>
//         <coneGeometry args={[0.85, 1.2, 7]} />
//         <meshStandardMaterial color="#166534" roughness={0.8} flatShading />
//       </mesh>

//       <mesh position={[0, 3.1, 0]} castShadow>
//         <coneGeometry args={[0.55, 1.0, 7]} />
//         <meshStandardMaterial color="#22C55E" roughness={0.7} flatShading />
//       </mesh>
//     </group>
//   )
// }

export function PineTree({ position }: { position: [number, number, number] }) {
  const { scene } = useGLTF('/models/pine_tree.glb')

  const treeModel = useMemo(() => {
    const cloned = scene.clone()
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
    return cloned
  }, [scene])

  return (
    <group position={position}>
      {/* 🛠️ CHANGED: scale-a 0.18-la irunthu 0.07-ku kammi panirken (perusa theriyathu) */}
      <primitive object={treeModel} scale={0.07} />
    </group>
  )
}

useGLTF.preload('/models/pine_tree.glb')

export function SportsCar({
  position,
  rotation = [0, 0, 0],
  color = '#4B20D8',
  isPlayer = false,
  isSteering = 0,
  cameraMode = 'CHASE',
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
  color?: string
  isPlayer?: boolean
  isSteering?: number
  cameraMode?: CameraMode
}) {
  const carRef = useRef<THREE.Group>(null)
  const steeringWheelRef = useRef<THREE.Mesh>(null)

  // 🛞 Wheels reference array to store extracted model wheels
  const modelWheelsRef = useRef<THREE.Mesh[]>([])

  // 1. Load GLB Model & Extract Wheels Automatically
  const { scene } = useGLTF('/models/car.glb')

  const carModel = useMemo(() => {
    const cloned = scene.clone()
    modelWheelsRef.current = [] // Reset wheels array on re-clone

    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        mesh.castShadow = true
        mesh.receiveShadow = true

        const meshName = mesh.name.toLowerCase()

        // 🛞 Automatically detect wheels from GLB model names
        if (meshName.includes('wheel') || meshName.includes('tyre') || meshName.includes('rim')) {
          modelWheelsRef.current.push(mesh)
        }

        // Glass transparency fix
        if (
          meshName.includes('glass') ||
          meshName.includes('window') ||
          meshName.includes('windshield')
        ) {
          if (mesh.material) {
            const mat = mesh.material as THREE.MeshPhysicalMaterial
            mat.transparent = true
            mat.opacity = 0.3
            mat.roughness = 0.1
            mat.metalness = 0.9
          }
        } else {
          if (mesh.material) {
            if ('roughness' in mesh.material)
              (mesh.material as THREE.MeshStandardMaterial).roughness = 0.4
            if ('metalness' in mesh.material)
              (mesh.material as THREE.MeshStandardMaterial).metalness = 0.6
          }
        }
      }
    })
    return cloned
  }, [scene])

  // Dynamic Canvas Texture for Chennai Number Plate
  const numberPlateTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 128
    const ctx = canvas.getContext('2d')

    if (ctx) {
      ctx.fillStyle = '#f0f0f0'
      ctx.fillRect(0, 0, 512, 128)

      ctx.strokeStyle = '#000000'
      ctx.lineWidth = 12
      ctx.strokeRect(6, 6, 500, 116)

      ctx.fillStyle = '#1D4ED8'
      ctx.fillRect(12, 12, 50, 104)

      ctx.fillStyle = '#000000'
      ctx.font = 'bold 50px monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('Super Chennai', 290, 64)
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    return texture
  }, [])

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

      if (steeringWheelRef.current) {
        steeringWheelRef.current.rotation.z = THREE.MathUtils.lerp(
          steeringWheelRef.current.rotation.z,
          -isSteering * 1.8,
          0.15,
        )
      }
    }

    // 🛞 Automatically spin all detected wheels inside the GLB model
    modelWheelsRef.current.forEach((wheel) => {
      if (wheel) {
        wheel.rotation.x -= delta * 20
      }
    })
  })

  return (
    <group ref={carRef} position={position} rotation={rotation}>
      {/* 
        🛠️ [FIXED FLOATING ISSUE]: 
        0.9-a iruntha height-a 0.1-ku or 0.0-ku mathiruken. 
        Innum car mela paranthuchina inga irukkira Y value-a (0.1) innum kammi pannunga (e.g. 0.0 or -0.1).
      */}
      <group position={[0, 0.1, 0]}>
        <primitive
          object={carModel}
          scale={1}
          rotation={[0, Math.PI, 0]}
          castShadow
          receiveShadow
        />
      </group>

      {/* REAR NUMBER PLATE */}
      <mesh position={[0, 0.35, 1.8]}>
        <planeGeometry args={[0.7, 0.18]} />
        <meshStandardMaterial map={numberPlateTexture} roughness={0.3} />
      </mesh>

      {/* INTERIOR DASHBOARD (First Person View) */}
      {isPlayer && cameraMode === 'FIRST_PERSON' && (
        <group position={[0, 0.4, -0.2]}>
          <mesh position={[0, 0.1, -0.35]}>
            <boxGeometry args={[1.35, 0.18, 0.4]} />
            <meshStandardMaterial color="#0F172A" roughness={0.8} />
          </mesh>

          <mesh position={[-0.28, 0.18, -0.18]} rotation={[-0.25, 0, 0]}>
            <planeGeometry args={[0.25, 0.09]} />
            <meshStandardMaterial color="#38BDF8" emissive="#38BDF8" emissiveIntensity={3} />
          </mesh>

          <mesh
            ref={steeringWheelRef}
            position={[-0.28, 0.16, -0.1]}
            rotation={[-Math.PI / 5, 0, 0]}
          >
            <torusGeometry args={[0.095, 0.02, 12, 24]} />
            {/* 🛠️ Fixed typo from meshStandardName to meshStandardMaterial */}
            <meshStandardMaterial color="#1E293B" roughness={0.4} />
          </mesh>
        </group>
      )}
    </group>
  )
}

useGLTF.preload('/models/car.glb')
// ==========================================
// 4. HIGHWAY SCENE WITH DYNAMIC CAMERA SWITCHING
// ==========================================
function HighwayScene({
  gameState,
  setGameState,
  setScore,
  setSpeed,
  setHighScore,
  cameraMode,
}: {
  gameState: 'START' | 'PLAYING' | 'GAMEOVER'
  setGameState: (state: 'START' | 'PLAYING' | 'GAMEOVER') => void
  setScore: React.Dispatch<React.SetStateAction<number>>
  setSpeed: React.Dispatch<React.SetStateAction<number>>
  highScore: number
  setHighScore: React.Dispatch<React.SetStateAction<number>>
  cameraMode: CameraMode
}) {
  const playerXRef = useRef(0)
  const speedRef = useRef(0)
  const distanceRef = useRef(0)
  const scoreRef = useRef(0)

  const cameraRef = useRef<THREE.PerspectiveCamera>(null)

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

  // useEffect(() => {
  //   const initialTrees = []
  //   for (let i = 0; i < 24; i++) {
  //     const z = -140 + i * 12
  //     initialTrees.push({ id: Math.random(), x: -10 - Math.random() * 4, z })
  //     initialTrees.push({ id: Math.random(), x: 10 + Math.random() * 4, z })
  //   }
  //   treesRef.current = initialTrees
  //   setTreesState(initialTrees)
  // }, [])

useEffect(() => {
    const initialTrees = []
    for (let i = 0; i < 10; i++) {
      const z = -140 + i * 28
      // 🛠️ CHANGED: x position-a innum 14-ku mela increase panirken (appothaan road-la irunthu veliya pogum)
      const leftX = -14 - Math.random() * 8
      const rightX = 14 + Math.random() * 8

      initialTrees.push({ id: Math.random(), x: leftX, z })
      initialTrees.push({ id: Math.random(), x: rightX, z })
    }
    treesRef.current = initialTrees
    setTreesState(initialTrees)
  }, [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keysRef.current.left = true
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keysRef.current.right = true
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') keysRef.current.up = true

      // ✅ FIXED: Down / S key press panpodhu true aaganum
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') keysRef.current.down = true
    }

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keysRef.current.left = false
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keysRef.current.right = false
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') keysRef.current.up = false

      // ✅ FIXED: Kai eduthathum thaan false aaganum
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

  useFrame((state, delta) => {
    // 1. OPTIMIZED CLEAR CAMERA POSITIONING
    if (cameraRef.current) {
      if (cameraMode === 'FIRST_PERSON') {
        // High Cockpit Seat Angle to clear Dashboard obstacles
        const targetCamX = playerXRef.current - 0.28
        const targetCamY = 1.12 // Raised height from 0.88 to 1.12
        const targetCamZ = -0.15 // Moved slightly forward

        cameraRef.current.position.x = THREE.MathUtils.lerp(
          cameraRef.current.position.x,
          targetCamX,
          0.15,
        )
        cameraRef.current.position.y = THREE.MathUtils.lerp(
          cameraRef.current.position.y,
          targetCamY,
          0.15,
        )
        cameraRef.current.position.z = THREE.MathUtils.lerp(
          cameraRef.current.position.z,
          targetCamZ,
          0.15,
        )

        // Look straight down the track line
        cameraRef.current.lookAt(playerXRef.current, 0.45, -25)
      } else {
        // Standard Chase Camera View
        const targetCamX = playerXRef.current * 0.45
        const targetCamY = 3.4
        const targetCamZ = 7.2

        cameraRef.current.position.x = THREE.MathUtils.lerp(
          cameraRef.current.position.x,
          targetCamX,
          0.1,
        )
        cameraRef.current.position.y = THREE.MathUtils.lerp(
          cameraRef.current.position.y,
          targetCamY,
          0.1,
        )
        cameraRef.current.position.z = THREE.MathUtils.lerp(
          cameraRef.current.position.z,
          targetCamZ,
          0.1,
        )

        cameraRef.current.lookAt(playerXRef.current, 0.5, -10)
      }
    }

    if (gameState !== 'PLAYING') return

    // 2. STEERING & MOVEMENT
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

    // 3. TRAFFIC SPAWN LOGIC
    if (Math.random() < 0.022) {
      const lanes = [-3.8, -1.3, 1.3, 3.8]

      const occupiedLanesAtSpawn = trafficRef.current.filter((c) => c.z < -95).map((c) => c.x)

      const availableLanes = lanes.filter((lane) => !occupiedLanesAtSpawn.includes(lane))

      if (availableLanes.length >= 2) {
        const randomLane = availableLanes[Math.floor(Math.random() * availableLanes.length)]

        // Ensure your array is typed explicitly as string[] or const tuple
        const brightCarColors = ['#ff0000', '#00ff00', '#0000ff'] as const

        // Pick a random color safely
        const randomColor =
          brightCarColors[Math.floor(Math.random() * brightCarColors.length)] || '#ff0000'

        trafficRef.current.push({
          id: Math.random(),
          x: randomLane ?? 0,
          z: -125,
          speed: 25 + Math.random() * 30,
          color: randomColor,
        })
      }
    }

    const playerX = playerXRef.current
    const updatedTraffic: { id: number; x: number; z: number; speed: number; color: string }[] = []

    for (const vehicle of trafficRef.current) {
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

  useEffect(() => {
    return () => {
      roadTexture.dispose()
    }
  }, [roadTexture])

  const steeringDir = keysRef.current.left ? -1 : keysRef.current.right ? 1 : 0

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 3.4, 7.2]} fov={62} />

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

      {/* <MountainRange side="left" /> */}
      {/* <MountainRange side="right" /> */}

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
        cameraMode={cameraMode}
      />

      {trafficState.map((vehicle) => (
        <SportsCar
          key={vehicle.id}
          position={[vehicle.x, 0, vehicle.z]}
          color={vehicle.color}
          // rotation={[0, Math.PI, 0]}
          rotation={[0, 0, 0]}
        />
      ))}
    </>
  )
}

// ==========================================
// 5. MAIN PAGE & UI OVERLAY
// ==========================================
export default function NotFound() {
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER'>('START')
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [speed, setSpeed] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [cameraMode, setCameraMode] = useState<CameraMode>('CHASE')

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

  const toggleCamera = () => {
    audioFX.playClick()
    setCameraMode((prev) => (prev === 'CHASE' ? 'FIRST_PERSON' : 'CHASE'))
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

        <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
          {/* CAMERA TOGGLE BUTTON */}
          <button
            onClick={toggleCamera}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200 text-slate-800 font-extrabold text-xs shadow-lg hover:border-[#4B20D8] transition cursor-pointer"
            aria-label="Toggle Camera View"
          >
            <Camera className="w-4 h-4 text-[#4B20D8]" />
            <span className="hidden sm:inline">
              {cameraMode === 'CHASE' ? 'Driver View' : 'Chase View'}
            </span>
          </button>

          <button
            onClick={toggleMute}
            className="p-2.5 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200 text-slate-700 hover:text-[#4B20D8] shadow-lg transition cursor-pointer"
            aria-label="Toggle Mute"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-md border border-slate-200 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-amber-600 shadow-lg">
            <Trophy className="w-4 h-4 text-amber-500" /> BEST: {highScore}m
          </div>

          <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-md border border-slate-200 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-[#4B20D8] shadow-lg">
            <Gauge className="w-4 h-4 text-[#4B20D8]" /> {speed} KM/H
          </div>
        </div>
      </header>

      {/* 3D CANVAS SCENE */}
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
              cameraMode={cameraMode}
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
              404
            </h1>

            <p className="text-sm text-[#74799A] leading-relaxed font-medium">
              You&apos;ve drifted off the main route! Switch camera modes to drive inside the
              cockpit or enjoy the third-person highway chase view.
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
        TRIVIA by Super Chennai
      </footer>
    </section>
  )
}
