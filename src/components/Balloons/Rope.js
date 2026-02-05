import React, { useRef } from 'react'

import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Rope({ from, to }) {
    const ref = useRef()
    useFrame(() => {
        if (from.current && to.current) {
            const fromPoint = new THREE.Vector3().fromArray(from.current.getWorldPosition(new THREE.Vector3()))
            const toPoint = new THREE.Vector3().fromArray(to.current.getWorldPosition(new THREE.Vector3()))
            const distance = fromPoint.distanceTo(toPoint)
            ref.current.position.copy(fromPoint)
            ref.current.lookAt(toPoint)
            ref.current.scale.z = distance
        }
    })

    return (
        <mesh ref={ref}>
            <cylinderGeometry args={[0.05, 0.05, 1, 8]} />
            <meshStandardMaterial color="black" />
        </mesh>
    )
}
