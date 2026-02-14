"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface UploadSectionProps {
    photos: (string | null)[];
    onPhotoUpload: (index: number, dataUrl: string) => void;
    onBeginJourney: () => void;
}

const QUADRANT_POSITIONS = [
    { top: "12%", left: "18%" },   // top-left quadrant
    { top: "8%", left: "68%" },   // top-right quadrant
    { top: "58%", left: "12%" },   // bottom-left quadrant
    { top: "62%", left: "72%" },   // bottom-right quadrant
];

const CHOCOLATE_LABELS = [
    "Trust",
    "Purity",
    "Commitment",
    "Devotion",
];

export default function UploadSection({
    photos,
    onPhotoUpload,
    onBeginJourney,
}: UploadSectionProps) {
    const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleClick = (index: number) => {
        fileInputRefs.current[index]?.click();
    };

    const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === "string") {
                onPhotoUpload(index, reader.result);
            }
        };
        reader.readAsDataURL(file);
    };

    const allUploaded = photos.every((p) => p !== null);

    return (
        <section className="relative w-full h-screen overflow-hidden flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #FFF0F5 0%, #FFE4EC 40%, #FFD1DC 100%)" }}
        >
            {/* Title */}
            <motion.div
                className="absolute top-6 sm:top-10 left-0 right-0 text-center z-10 px-4"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
            >
                <h1 className="font-calligraphy text-4xl sm:text-5xl md:text-7xl text-[#E8536D] mb-2 sm:mb-3 drop-shadow-lg">
                    Our Love Story
                </h1>
                <p className="font-calligraphy text-lg sm:text-xl md:text-2xl text-[#8B5A6A]">
                    Click each chocolate to add a memory
                </p>
            </motion.div>

            {/* 4 Chocolate slots in quadrants */}
            {QUADRANT_POSITIONS.map((pos, i) => (
                <motion.div
                    key={i}
                    className="absolute z-10"
                    style={{ top: pos.top, left: pos.left }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        y: [0, -15, 0],
                        rotate: [0, 2, -2, 0]
                    }}
                    transition={{
                        opacity: { delay: 0.3 + i * 0.2, duration: 0.5 },
                        scale: { delay: 0.3 + i * 0.2, type: "spring", stiffness: 200 },
                        y: { duration: 3 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 },
                        rotate: { duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }
                    }}
                >
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={(el) => { fileInputRefs.current[i] = el; }}
                        onChange={(e) => handleFileChange(i, e)}
                    />

                    {photos[i] ? (
                        /* Photo uploaded — show circular preview */
                        <motion.div
                            className="relative cursor-pointer group"
                            onClick={() => handleClick(i)}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                                <img
                                    src={photos[i]!}
                                    alt={`Memory ${i + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-10 sm:-bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
                                <span className="font-calligraphy text-2xl sm:text-3xl md:text-4xl text-[#E8536D] drop-shadow">
                                    {CHOCOLATE_LABELS[i]}
                                </span>
                            </div>
                            <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Upload className="w-6 h-6 text-white" />
                            </div>
                        </motion.div>
                    ) : (
                        /* No photo — show chocolate */
                        <motion.div
                            className="chocolate-hover flex flex-col items-center"
                            onClick={() => handleClick(i)}
                            whileHover={{ scale: 1.2, rotate: -10 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Card className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full flex flex-col items-center justify-center bg-gradient-to-br from-[#8B4513] via-[#A0522D] to-[#6B3410] border-none shadow-2xl cursor-pointer hover:shadow-3xl transition-shadow">
                                <span className="text-4xl sm:text-5xl md:text-6xl mb-1">🍫</span>
                                <span className="text-[10px] sm:text-xs text-amber-200/90 font-calligraphy">
                                    click me
                                </span>
                            </Card>
                            <span className="font-calligraphy text-2xl sm:text-3xl md:text-4xl text-[#8B5A6A] mt-4 sm:mt-5 drop-shadow">
                                {CHOCOLATE_LABELS[i]}
                            </span>
                        </motion.div>
                    )}
                </motion.div>
            ))}

            {/* Begin Journey button */}
            {allUploaded && (
                <motion.div
                    className="absolute bottom-8 sm:bottom-12 left-0 right-0 flex justify-center z-20"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <Button
                        onClick={onBeginJourney}
                        className="font-calligraphy text-xl sm:text-2xl px-8 sm:px-12 py-4 sm:py-6 rounded-full bg-gradient-to-r from-[#E8536D] to-[#D4447A] text-white shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 animate-gentle-bounce"
                    >
                        Begin Your Journey 💕
                    </Button>
                </motion.div>
            )}
        </section>
    );
}
