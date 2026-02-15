import React, { useState, useRef, useMemo } from 'react'
import { useSphere, useBox, usePointToPointConstraint } from '@react-three/cannon'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Rope from './Rope'
import { vertexShader, fragmentShader } from './balloonShader'

export default function BalloonSoftBody({ nodes, materials, ...props }) {
  const [ref, api] = useSphere(() => ({ mass: 1, position: props.position, linearDamping: 0.8 }))
  const [keelRef, keelApi] = useSphere(() => ({ mass: 0.1, position: [props.position[0], props.position[1] - 2, props.position[2]], linearDamping: 0.8 }))
  const [anchorRef] = useBox(() => ({ type: 'Static', position: [props.position[0], 0, props.position[2]] }))
  const [hovered, setHovered] = useState(false)
  const shaderRef = useRef()

  const uniforms = useMemo(
    () => ({
      poke_position: { value: new THREE.Vector3() },
      poke_strength: { value: 0.0 },
      color: { value: new THREE.Color(materials['Material.001'].color) },
    }),
    [materials]
  )

  useFrame(() => {
    if (shaderRef.current.uniforms.poke_strength.value > 0) {
      shaderRef.current.uniforms.poke_strength.value -= 0.01
    }
  })

  usePointToPointConstraint(anchorRef, keelRef, {
    pivotA: [0, 0, 0],
    pivotB: [0, 0, 0],
  })

  usePointToPointConstraint(ref, keelRef, {
    pivotA: [0, -1, 0],
    pivotB: [0, 1, 0],
  })

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    api.applyForce([Math.sin(t) * 0.1, 0.5 + Math.cos(t) * 0.1, Math.cos(t) * 0.1], [0, 0, 0])
  })

  return (
    <>
      <group ref={ref} dispose={null}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onPointerDown={(e) => {
          e.stopPropagation()
          const pokePosition = e.point.clone()
          ref.current.worldToLocal(pokePosition)
          shaderRef.current.uniforms.poke_position.value = pokePosition
          shaderRef.current.uniforms.poke_strength.value = 1.0
          api.applyImpulse([e.ray.direction.x * -2, e.ray.direction.y * -2, e.ray.direction.z * -2], [e.point.x - ref.current.position.x, e.point.y - ref.current.position.y, e.point.z - ref.current.position.z])
        }}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_4.geometry}
          scale={hovered ? 0.6 : 0.5}
        >
          <shaderMaterial
            ref={shaderRef}
            args={[
              {
                uniforms,
                vertexShader,
                fragmentShader,
              },
            ]}
          />
        </mesh>
      </group>
      <Rope from={anchorRef} to={keelRef} />
    </>
  )
}
