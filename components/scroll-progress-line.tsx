"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgressLine({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end end"]
    });

    const pathLength = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Mobile: Straight line down the center */}
                <motion.path
                    d="M 50 0 L 50 100" // 0 to 100 relative to viewBox if I could set it, but here it's pixels? No, need logical coords.
                    // Better to use % relative coordinates if possible? SVG doesn't support % in d.
                    // So we rely on vector-effect="non-scaling-stroke" and a 0-100 viewBox.
                    className="md:hidden"
                    fill="none"
                    stroke="rgba(232, 83, 109, 0.3)" /* track */
                    strokeWidth="4"
                    vectorEffect="non-scaling-stroke"
                />
                <motion.path
                    d="M 50 0 L 50 100"
                    className="md:hidden"
                    fill="none"
                    stroke="#E8536D"
                    strokeWidth="4"
                    vectorEffect="non-scaling-stroke"
                    style={{ pathLength }}
                />

                {/* Desktop: Zigzag curve */}
                {/* 
            Coordinates (0-100):
            Start: 50, 0
            S1 (Left photo): 25, 10
            S2 (Right photo): 75, 30
            S3 (Left photo): 25, 50
            S4 (Right photo): 75, 70
            End (Card Heading): 50, 90
        */}
                <motion.path
                    d="M 50 0 
             C 50 5, 25 5, 25 10 
             C 25 20, 75 20, 75 30 
             C 75 40, 25 40, 25 50 
             C 25 60, 75 60, 75 70 
             C 75 80, 50 85, 50 90"
                    className="hidden md:block"
                    fill="none"
                    stroke="rgba(232, 83, 109, 0.2)" /* track */
                    strokeWidth="3"
                    vectorEffect="non-scaling-stroke"
                />
                <motion.path
                    d="M 50 0 
             C 50 5, 25 5, 25 10 
             C 25 20, 75 20, 75 30 
             C 75 40, 25 40, 25 50 
             C 25 60, 75 60, 75 70 
             C 75 80, 50 85, 50 90"
                    className="hidden md:block"
                    fill="none"
                    stroke="#E8536D"
                    strokeWidth="3"
                    vectorEffect="non-scaling-stroke"
                    style={{ pathLength }}
                />
            </svg>
        </div>
    );
}
