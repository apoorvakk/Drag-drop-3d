import React, { useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Physics, RigidBody } from '@react-three/rapier'
import { Environment, PerspectiveCamera } from '@react-three/drei'

function InteractiveShape({ children, position, colliders }) {
  const ref = useRef()

  const handlePointerOver = (e) => {
    e.stopPropagation()
    if (ref.current) {
      // Strong horizontal impulse, tiny upward bump, zero Z
      const x = (Math.random() - 0.5) * 40
      const y = (Math.random() * 5) + 2
      ref.current.applyImpulse({ x, y, z: 0 }, true)
      ref.current.applyTorqueImpulse({
        x: (Math.random() - 0.5) * 5,
        y: (Math.random() - 0.5) * 5,
        z: (Math.random() - 0.5) * 5,
      }, true)
    }
  }

  return (
    <RigidBody
      ref={ref}
      position={position}
      colliders={colliders}
      restitution={0.6}
      enabledTranslations={[true, true, false]}
    >
      <mesh onPointerOver={handlePointerOver} castShadow receiveShadow>
        {children}
      </mesh>
    </RigidBody>
  )
}

/** Uses Three.js viewport (world units) to place walls exactly at the screen edges */
function ScreenBounds() {
  const { viewport } = useThree()

  const hw = viewport.width / 2   // half width in world units
  const hh = viewport.height / 2  // half height in world units
  const thick = 2                  // wall thickness (thick enough to prevent tunneling)
  const depth = 4                // wall depth into Z

  return (
    <>
      {/* Floor — tilt slightly away from camera (bottom edge angles out) */}
      <RigidBody type="fixed" position={[0, -hh - thick / 2.5, 0]} rotation={[-0.3, 0, 0]} restitution={0.5} friction={0.8}>
        <mesh>
          <boxGeometry args={[viewport.width + thick * 2, thick, depth]} />
          <meshStandardMaterial color="#4f2187ff" />
        </mesh>
      </RigidBody>

      {/* Ceiling — tilt slightly away from camera (top edge angles out) */}
      <RigidBody type="fixed" position={[0, hh, 0]} rotation={[0.15, 0, 0]} restitution={0.4}>
        <mesh visible={false}>
          <boxGeometry args={[viewport.width + thick * 2, thick, depth]} />
          <meshStandardMaterial />
        </mesh>
      </RigidBody>

      {/* Left wall — tilt left edge out of viewport */}
      <RigidBody type="fixed" position={[-hw * 1.2, 0, 0]} rotation={[0, 0.6, 0]} restitution={0.6}>
        <mesh>
          <boxGeometry args={[thick, viewport.height + thick * 2, depth]} />
          <meshStandardMaterial color="#D1C0E6" />
        </mesh>
      </RigidBody>

      {/* Right wall — tilt right edge out of viewport */}
      <RigidBody type="fixed" position={[hw * 1.2, 0, 0]} rotation={[0, -0.6, 0]} restitution={0.6}>
        <mesh>
          <boxGeometry args={[thick, viewport.height + thick * 2, depth]} />
          <meshStandardMaterial color="#efedf3ff" />
        </mesh>
      </RigidBody>
    </>
  )
}

function App() {
  return (
    <>
      <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10, fontSize: '1.5rem', fontWeight: 'bold' }}>
        Interactive 3d shaeps
      </div>
      <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 10, fontSize: '1.5rem', fontWeight: 'bold' }}>
        By apoorva
      </div>

      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0.5, 9]} rotation={[0, 0, 0]} fov={40} />
        <ambientLight intensity={0.5} />
        <directionalLight
          castShadow
          position={[10, 10, 10]}
          intensity={1.5}
          shadow-mapSize={[1024, 1024]}
        />
        <Environment preset="city" />

        <Physics>
          <ScreenBounds />

          <InteractiveShape position={[0, 5, 0]} colliders="ball">
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color="#ff4060" roughness={0.2} metalness={0.1} />
          </InteractiveShape>

          <InteractiveShape position={[-3, 7, 0]} colliders="cuboid">
            <boxGeometry args={[1.5, 1.5, 1.5]} />
            <meshStandardMaterial color="#4060ff" roughness={0.3} />
          </InteractiveShape>

          <InteractiveShape position={[3, 9, 0]} colliders="hull">
            <icosahedronGeometry args={[1.2, 0]} />
            <meshStandardMaterial color="#40ff60" roughness={0.1} />
          </InteractiveShape>

          <InteractiveShape position={[-4, 11, 0]} colliders="cuboid">
            <torusGeometry args={[0.8, 0.3, 16, 32]} />
            <meshStandardMaterial color="#ffc107" roughness={0.1} metalness={0.5} />
          </InteractiveShape>

          <InteractiveShape position={[4, 13, 0]} colliders="ball">
            <coneGeometry args={[1, 1.5, 32]} />
            <meshStandardMaterial color="#9c27b0" roughness={0.4} />
          </InteractiveShape>
        </Physics>
      </Canvas>
    </>
  )
}

export default App
