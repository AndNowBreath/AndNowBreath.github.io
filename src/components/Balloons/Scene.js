import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment } from '@react-three/drei'
import { Physics, usePlane } from '@react-three/cannon'
import Balloon from './Balloon'

function Plane(props) {
  const [ref] = usePlane(() => ({ rotation: props.rotation }))
  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <shadowMaterial color="#171717" />
    </mesh>
  )
}

function Model(props) {
  const { nodes, materials } = useGLTF('/low-poly_balloon.glb')
  return (
    <>
      <Plane rotation={[-Math.PI / 2, 0, 0]} />
      <Balloon nodes={nodes} materials={materials} position={[0, 5, 0]} />
      <Balloon nodes={nodes} materials={materials} position={[15, 5, -10]} />
      <Balloon nodes={nodes} materials={materials} position={[-15, 5, -10]} />
    </>
  )
}

export default function Scene() {
  return (
    <Canvas shadows>
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <directionalLight
          castShadow
          position={[10, 10, 10]}
          intensity={1}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <Physics>
          <Model />
        </Physics>
        <OrbitControls />
        <Environment preset="sunset" background />
      </Suspense>
    </Canvas>
  )
}
