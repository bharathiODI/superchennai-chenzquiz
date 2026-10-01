// 'use client'

// import React, { useRef } from 'react'
// import { Canvas, useFrame } from '@react-three/fiber'
// import { useGLTF, OrbitControls, Environment } from '@react-three/drei'
// import * as THREE from 'three'

// function VeniceModel() {
//   const { scene } = useGLTF('/models/venice.glb')
//   const modelRef = useRef<THREE.Group>(null)

//   // Subtle floating/rotation effect for nice visual presentation
//   useFrame((state) => {
//     if (modelRef.current) {
//       modelRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15
//     }
//   })

//   return (
//     <group ref={modelRef} position={[0, -1, 0]} scale={[1.21, 1.21, 1.21]}>
//       <primitive object={scene} />
//     </group>
//   )
// }

// export function VeniceCanvas() {
//   return (
//     <div className="absolute inset-0 pointer-events-auto opacity-10 lg:opacity-70 z-0 ">
//       <Canvas camera={{ position: [5, 4, 6], fov: 45 }} gl={{ antialias: true, alpha: true }}>
//         <ambientLight intensity={1.2} />
//         <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />
//         <pointLight position={[-10, -110, -10]} intensity={0.5} />
//         <VeniceModel />
//         <Environment preset="city" />
//         <OrbitControls
//           enableZoom={false}
//           enablePan={false}
//           autoRotate
//           autoRotateSpeed={0.5}
//           maxPolarAngle={Math.PI / 2.2}
//         />
//       </Canvas>
//     </div>
//   )
// }
'use client'

import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment } from '@react-three/drei'
import * as THREE from 'three'

function VeniceModel() {
  const { scene } = useGLTF('/models/venice.glb')
  const modelRef = useRef<THREE.Group>(null)

  // Subtle floating/rotation effect
  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15
    }
  })

  return (
    <group ref={modelRef} position={[0, -0.8, 0]} scale={[0.35, 0.35, 0.35]}>
      <primitive object={scene} />
    </group>
  )
}

export function VeniceCanvas() {
  return (
    <div className="absolute inset-0  z-0">
      {/* 🛠️ Camera Position: [18, 15, 22] (Perfect distance) */}
      <Canvas camera={{ position: [18, 15, 22], fov: 50 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <VeniceModel />
        <Environment preset="city" />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2.2}
        />
      </Canvas>
    </div>
  )
}