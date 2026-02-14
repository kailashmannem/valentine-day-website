"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Preload } from "@react-three/drei";
import * as THREE from "three";

// ─── Earth / Globe 3D Model ─────────────────────────────────────────────────

function EarthModel() {
    const earth = useGLTF("/models/planet/scene.gltf");
    const meshRef = useRef<THREE.Group>(null);

    useFrame((_, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.15;
        }
    });

    return (
        <primitive
            ref={meshRef}
            object={earth.scene}
            scale={2.5}
            position={[0, 0, 0]}
        />
    );
}

// ─── Loading Spinner ────────────────────────────────────────────────────────

function GlobeLoader() {
    return (
        <mesh>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color="#00f0ff" wireframe transparent opacity={0.3} />
        </mesh>
    );
}

// ─── Exported Canvas ────────────────────────────────────────────────────────

export function EarthCanvas() {
    return (
        <Canvas
            shadows
            frameloop="always"
            dpr={[1, 2]}
            gl={{ preserveDrawingBuffer: true }}
            camera={{
                fov: 45,
                near: 0.1,
                far: 200,
                position: [-4, 3, 6],
            }}
            className="cursor-grab active:cursor-grabbing"
        >
            <Suspense fallback={<GlobeLoader />}>
                <ambientLight intensity={0.3} />
                <directionalLight position={[5, 5, 5]} intensity={1} />
                <pointLight position={[-5, -5, -5]} intensity={0.3} color="#00f0ff" />
                <OrbitControls
                    autoRotate
                    enableZoom={false}
                    maxPolarAngle={Math.PI / 2}
                    minPolarAngle={Math.PI / 2}
                />
                <EarthModel />
            </Suspense>
            <Preload all />
        </Canvas>
    );
}
