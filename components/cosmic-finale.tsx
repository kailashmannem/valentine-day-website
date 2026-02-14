"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { EarthCanvas } from "./canvas/EarthCanvas";
import { StarsCanvas } from "./canvas/StarsCanvas";

export default function CosmicFinale() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { amount: 0.3 });

    return (
        <section
            ref={ref}
            className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center"
        >
            {/* Stars Background */}
            <div className="absolute inset-0 z-0">
                <StarsCanvas />
            </div>

            {/* Earth & Content */}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center pointer-events-none">
                {/* 3D Earth interacts with mouse but we need to pass events through if overlaid? 
                    EarthCanvas handles its own events. 
                    We need to make sure this container doesn't block it. 
                    So let's put EarthCanvas in a separate absolute layer.
                */}
            </div>

            <div className="absolute inset-0 z-10">
                <EarthCanvas />
            </div>

            {/* Text Overlay */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className="text-center"
                >
                    <h2
                        className="font-calligraphy text-4xl sm:text-6xl md:text-8xl text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] mb-4"
                    >
                        Till Eternity and Beyond...
                    </h2>
                    <p className="font-calligraphy text-xl sm:text-2xl md:text-3xl text-gray-300 opacity-80">
                        Forever & Always
                    </p>
                </motion.div>
            </div>

            {/* Fade in overlay from top? No, natural scroll handles transition. */}
        </section>
    );
}
