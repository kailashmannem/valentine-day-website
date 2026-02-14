"use client";

import { useState, useRef } from "react";
import FloatingHearts from "@/components/floating-hearts";
import UploadSection from "@/components/upload-section";
import PhotoSection from "@/components/photo-section";
import CollageCard from "@/components/collage-card";
import ScrollProgressLine from "@/components/scroll-progress-line";
import CosmicFinale from "@/components/cosmic-finale";

const SECTIONS = [
  {
    color: "#4A90D9",
    symbolism: "Trust",
    description:
      "In every glance, every whispered word — there is a trust that binds our hearts, a silent promise that says 'I believe in you, always.'",
  },
  {
    color: "#F8F4F0",
    symbolism: "Purity",
    description:
      "Our love is pure like the first snowfall — untouched, gentle, and breathtakingly beautiful. A feeling that needs no words.",
  },
  {
    color: "#D4A574",
    symbolism: "Commitment",
    description:
      "Like gold forged through time and fire, our commitment only grows stronger. Through every storm, we choose each other again.",
  },
  {
    color: "#9B7EC8",
    symbolism: "Devotion",
    description:
      "A devotion so deep it echoes in every heartbeat. You are not just my love — you are my forever, my everything.",
  },
];

export default function Home() {
  const [photos, setPhotos] = useState<(string | null)[]>([null, null, null, null]);
  const [journeyStarted, setJourneyStarted] = useState(false);
  const scrollTarget = useRef<HTMLDivElement>(null);
  const journeyRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePhotoUpload = (index: number, dataUrl: string) => {
    setPhotos((prev) => {
      const updated = [...prev];
      updated[index] = dataUrl;
      return updated;
    });
  };

  const handleBeginJourney = () => {
    setJourneyStarted(true);
    audioRef.current?.play().catch((e) => console.log("Audio play failed", e));
    setTimeout(() => {
      scrollTarget.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <main className="relative">
      <audio ref={audioRef} src="/songs/tuned_piano.mp3" loop />
      <FloatingHearts />

      {/* Phase 1: Upload */}
      <UploadSection
        photos={photos}
        onPhotoUpload={handlePhotoUpload}
        onBeginJourney={handleBeginJourney}
      />

      {/* Phase 2: Scroll sections (visible after journey starts) */}
      {journeyStarted && (
        <>
          <div ref={journeyRef} className="relative">
            <div ref={scrollTarget} />

            <ScrollProgressLine containerRef={journeyRef} />

            {SECTIONS.map((section, i) => (
              <PhotoSection
                key={i}
                image={photos[i]!}
                color={section.color}
                symbolism={section.symbolism}
                description={section.description}
                index={i}
              />
            ))}

            {/* Phase 3: Collage card */}
            <CollageCard photos={photos.filter(Boolean) as string[]} />
          </div>

          {/* Phase 4: Cosmic Finale */}
          <CosmicFinale />
        </>
      )}
    </main>
  );
}
