"use client";

import { useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface CollageCardProps {
    photos: string[];
}

/**
 * Loads an image from a data URL and returns it as an HTMLImageElement.
 */
function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

/**
 * Draws a rounded rectangle path on the canvas context.
 */
function roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

/**
 * Draws the card image onto a Canvas and triggers a PNG download.
 * Uses the native Canvas 2D API — no html2canvas, no CSS parsing issues.
 */
async function drawCardAndDownload(photos: string[]) {
    const W = 960;
    const H = 1100;
    const PAD = 48;
    const GAP = 24;
    const PHOTO_R = 32;
    const CARD_R = 48;

    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;

    // --- Card background gradient ---
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#FFF0F5");
    bg.addColorStop(0.5, "#FFE4EC");
    bg.addColorStop(1, "#FFD1DC");
    roundRect(ctx, 0, 0, W, H, CARD_R);
    ctx.fillStyle = bg;
    ctx.fill();

    // --- 2x2 photo grid ---
    const photoSize = (W - PAD * 2 - GAP) / 2;
    const images = await Promise.all(photos.map(loadImage));

    for (let i = 0; i < 4; i++) {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = PAD + col * (photoSize + GAP);
        const y = PAD + row * (photoSize + GAP);

        // Save, clip to rounded rect, draw image, restore
        ctx.save();
        roundRect(ctx, x, y, photoSize, photoSize, PHOTO_R);
        ctx.clip();

        // Draw image cover-style
        const img = images[i];
        const imgRatio = img.width / img.height;
        const cellRatio = 1; // photoSize / photoSize = 1
        let sx = 0, sy = 0, sw = img.width, sh = img.height;
        if (imgRatio > cellRatio) {
            sw = img.height;
            sx = (img.width - sw) / 2;
        } else {
            sh = img.width;
            sy = (img.height - sh) / 2;
        }
        ctx.drawImage(img, sx, sy, sw, sh, x, y, photoSize, photoSize);
        ctx.restore();

        // White border
        ctx.save();
        roundRect(ctx, x, y, photoSize, photoSize, PHOTO_R);
        ctx.strokeStyle = "rgba(255,255,255,0.85)";
        ctx.lineWidth = 5;
        ctx.stroke();
        ctx.restore();
    }

    // --- Gradient overlay at bottom ---
    const photoBottom = PAD * 2 + photoSize * 2 + GAP; // y-coord where photos end roughly (actually PAD + photoSize*2 + GAP is exact bottom edge relative to top PAD)
    // Actually exact bottom y = PAD + (1) * (photoSize + GAP) + photoSize = PAD + photoSize + GAP + photoSize = PAD + photoSize*2 + GAP
    const actualPhotoBottom = PAD + photoSize * 2 + GAP;

    const gradY = actualPhotoBottom - 20;
    const grad = ctx.createLinearGradient(0, gradY, 0, H);
    grad.addColorStop(0, "rgba(232,83,109,0)");
    grad.addColorStop(0.4, "rgba(232,83,109,0.12)");
    grad.addColorStop(1, "rgba(232,83,109,0.28)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, gradY, W, H - gradY);

    // --- Calligraphy text ---
    // Line 1: "With You and Forever"
    ctx.fillStyle = "#E8536D";
    ctx.font = "700 72px 'Great Vibes', cursive";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    // Drop shadow for text
    ctx.shadowColor = "rgba(0,0,0,0.08)";
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 3;
    ctx.fillText("With You and Forever", W / 2, actualPhotoBottom + 40);

    // Line 2: "Thank You"
    ctx.fillStyle = "#8B5A6A";
    ctx.font = "500 48px 'Great Vibes', cursive";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 2;
    ctx.fillText("Thank You", W / 2, actualPhotoBottom + 120);

    // Reset shadow
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // --- Corner hearts ---
    ctx.font = "28px serif";
    ctx.globalAlpha = 0.4;
    ctx.textAlign = "left";
    ctx.fillText("💕", 20, 40);
    ctx.textAlign = "right";
    ctx.fillText("💕", W - 20, 40);
    ctx.globalAlpha = 1;

    // --- Download ---
    const link = document.createElement("a");
    link.download = "valentine-card.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
}

export default function CollageCard({ photos }: CollageCardProps) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: false, amount: 0.3 });

    const handleDownload = useCallback(() => {
        drawCardAndDownload(photos);
    }, [photos]);

    return (
        <section
            ref={sectionRef}
            className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 sm:px-8 py-12 sm:py-16 overflow-hidden"
        >
            {/* Background Layer */}
            <div
                className="absolute inset-0 -z-10"
                style={{
                    background:
                        "linear-gradient(180deg, #9B7EC8 0%, #E8536D 30%, #FFF0F5 60%, #FFE4EC 100%)",
                }}
            />

            <div className="relative z-20 w-full flex flex-col items-center">
                {/* Heading */}
                <motion.h2
                    className="font-calligraphy text-3xl sm:text-4xl md:text-5xl text-white mb-8 sm:mb-12 text-center drop-shadow-lg"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                >
                    Your Valentine&apos;s Card
                </motion.h2>

                {/* Visual Preview Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div
                        className="relative w-[320px] h-[420px] sm:w-[400px] sm:h-[520px] md:w-[480px] md:h-[620px] rounded-3xl overflow-hidden shadow-2xl"
                        style={{
                            background: "linear-gradient(145deg, #FFF0F5, #FFE4EC, #FFD1DC)",
                        }}
                    >
                        {/* 2x2 Photo Grid */}
                        <div className="grid grid-cols-2 gap-2 sm:gap-3 p-4 sm:p-5 md:p-6">
                            {photos.map((photo, i) => (
                                <div
                                    key={i}
                                    className="aspect-square rounded-2xl overflow-hidden shadow-lg"
                                    style={{ border: "3px solid rgba(255,255,255,0.8)" }}
                                >
                                    <img
                                        src={photo}
                                        alt={`Memory ${i + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Text overlay */}
                        <div
                            className="absolute bottom-0 left-0 right-0 py-6 sm:py-8 md:py-10 px-4 text-center"
                            style={{
                                background:
                                    "linear-gradient(transparent, rgba(232,83,109,0.15) 30%, rgba(232,83,109,0.25))",
                            }}
                        >
                            <p
                                className="font-calligraphy text-3xl sm:text-4xl md:text-5xl leading-tight"
                                style={{ color: "#E8536D", textShadow: "0 2px 4px rgba(0,0,0,0.06)" }}
                            >
                                With You and Forever
                            </p>
                            <p
                                className="font-calligraphy text-xl sm:text-2xl md:text-3xl mt-1 sm:mt-2"
                                style={{ color: "#8B5A6A" }}
                            >
                                Thank You
                            </p>
                        </div>

                        {/* Corner hearts */}
                        <span className="absolute top-2 left-3 text-lg sm:text-xl opacity-40">
                            💕
                        </span>
                        <span className="absolute top-2 right-3 text-lg sm:text-xl opacity-40">
                            💕
                        </span>
                    </div>
                </motion.div>

                {/* Download button */}
                <motion.div
                    className="mt-8 sm:mt-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.5 }}
                >
                    <Button
                        onClick={handleDownload}
                        className="font-calligraphy text-lg sm:text-xl px-8 sm:px-10 py-4 sm:py-5 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 gap-2 sm:gap-3"
                        style={{ backgroundColor: "#FFFFFF", color: "#E8536D" }}
                    >
                        <Download className="w-5 h-5" />
                        Save Your Card
                    </Button>
                </motion.div>

                {/* Footer */}
                <motion.p
                    className="mt-10 sm:mt-14 font-calligraphy text-lg sm:text-xl md:text-2xl text-center"
                    style={{ color: "rgba(232,83,109,0.7)" }}
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 1, delay: 0.8 }}
                >
                    Made with ❤️ this Valentine&apos;s Day
                </motion.p>
            </div>
        </section>
    );
}
