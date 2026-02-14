"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface PhotoSectionProps {
    image: string;
    color: string;
    symbolism: string;
    description: string;
    index: number;
}

export default function PhotoSection({
    image,
    color,
    symbolism,
    description,
    index,
}: PhotoSectionProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: false, amount: 0.3 });
    const isEven = index % 2 === 0;

    return (
        <section
            ref={ref}
            className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
        >
            {/* Background Color Layer */}
            <div
                className="absolute inset-0 transition-colors duration-1000"
                style={{ backgroundColor: color }}
            />

            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-white/10 blur-3xl"
                    animate={{
                        y: [0, 50, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute -bottom-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-white/5 blur-3xl"
                    animate={{
                        y: [0, -40, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1,
                    }}
                />
            </div>

            <div className={`relative z-20 flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-8 md:gap-16 px-6 sm:px-12 md:px-20 max-w-6xl w-full`}>
                {/* Photo */}
                <motion.div
                    className="flex-shrink-0"
                    initial={{ opacity: 0, x: isEven ? -80 : 80, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50 rotate-2 hover:rotate-0 transition-transform duration-500">
                        <img
                            src={image}
                            alt={`Memory - ${symbolism}`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </motion.div>

                {/* Text */}
                <motion.div
                    className="text-center md:text-left"
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                >
                    <h2
                        className="font-calligraphy text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-4 drop-shadow-lg"
                        style={{
                            color: color === "#F8F4F0" ? "#4A1A2E" : "#FFFFFF",
                        }}
                    >
                        {symbolism}
                    </h2>
                    <p
                        className="text-lg sm:text-xl md:text-2xl max-w-md leading-relaxed font-light"
                        style={{
                            fontFamily: "var(--font-sans-custom), serif",
                            color: color === "#F8F4F0" ? "#6B4A5A" : "rgba(255,255,255,0.9)",
                        }}
                    >
                        {description}
                    </p>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
                <span
                    className="text-2xl sm:text-3xl opacity-60"
                    style={{ color: color === "#F8F4F0" ? "#4A1A2E" : "#FFFFFF" }}
                >
                    ↓
                </span>
            </motion.div>
        </section>
    );
}
