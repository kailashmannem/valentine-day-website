"use client";

import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import * as THREE from "three";

// ─── Star Field ─────────────────────────────────────────────────────────────

function Stars() {
    const ref = useRef<THREE.Points>(null);

    const geometry = useMemo(() => {
        const count = 3000;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const radius = 1.2 + Math.random() * 4;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi);

            const isAccent = Math.random() > 0.92;
            const isCyan = Math.random() > 0.5;
            colors[i3] = isAccent ? (isCyan ? 0.0 : 0.99) : 0.7 + Math.random() * 0.3;
            colors[i3 + 1] = isAccent ? (isCyan ? 0.94 : 0.93) : 0.7 + Math.random() * 0.3;
            colors[i3 + 2] = isAccent ? (isCyan ? 1.0 : 0.04) : 0.75 + Math.random() * 0.25;
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
        geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
        return geo;
    }, []);

    useFrame((_, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta * 0.02;
            ref.current.rotation.y -= delta * 0.03;
        }
    });

    return (
        <points ref={ref} geometry={geometry}>
            <pointsMaterial
                size={0.003}
                sizeAttenuation
                vertexColors
                transparent
                opacity={0.8}
                depthWrite={false}
            />
        </points>
    );
}

// ─── Exported Canvas ────────────────────────────────────────────────────────

export function StarsCanvas() {
    return (
        <div className="w-full h-full absolute inset-0 z-0 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 1.5]}>
                <Suspense fallback={null}>
                    <Stars />
                </Suspense>
                <Preload all />
            </Canvas>
        </div>
    );
}
