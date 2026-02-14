"use client";

import { useEffect, useState } from "react";

interface Heart {
    id: number;
    left: number;
    size: number;
    delay: number;
    duration: number;
    opacity: number;
}

export default function FloatingHearts() {
    const [hearts, setHearts] = useState<Heart[]>([]);

    useEffect(() => {
        const generated: Heart[] = Array.from({ length: 20 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            size: Math.random() * 20 + 12,
            delay: Math.random() * 8,
            duration: Math.random() * 6 + 8,
            opacity: Math.random() * 0.4 + 0.1,
        }));
        setHearts(generated);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {hearts.map((heart) => (
                <span
                    key={heart.id}
                    className="absolute animate-float-up"
                    style={{
                        left: `${heart.left}%`,
                        fontSize: `${heart.size}px`,
                        animationDelay: `${heart.delay}s`,
                        animationDuration: `${heart.duration}s`,
                        opacity: heart.opacity,
                        animationIterationCount: "infinite",
                    }}
                >
                    💕
                </span>
            ))}
        </div>
    );
}
