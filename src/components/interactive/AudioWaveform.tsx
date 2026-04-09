"use client";

import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

interface AudioWaveformProps {
  profile?: "balanced" | "bass" | "hifi";
  isActive?: boolean;
}

export const AudioWaveform = ({ profile = "balanced", isActive = true }: AudioWaveformProps) => {
  const bars = Array.from({ length: 40 });
  
  const getAnimation = (index: number) => {
    if (!isActive) return { height: "4px" };

    let duration: number;
    let amplitude: number[];

    switch (profile) {
      case "bass":
        duration = 0.8 + Math.random() * 0.4;
        amplitude = [10, 60, 20, 80, 10];
        break;
      case "hifi":
        duration = 0.3 + Math.random() * 0.2;
        amplitude = [5, 25, 10, 30, 5];
        break;
      default: // balanced
        duration = 0.5 + Math.random() * 0.3;
        amplitude = [8, 40, 15, 45, 8];
        break;
    }

    return {
      height: amplitude.map(v => `${v}px`),
      transition: {
        duration,
        repeat: Infinity,
        ease: "easeInOut" as any,
        delay: index * 0.02
      }
    };
  };

  return (
    <div className="flex items-center justify-center gap-[2px] h-24 w-full overflow-hidden">
      {bars.map((_, i) => (
        <motion.div
          key={i}
          initial={{ height: "4px" }}
          animate={getAnimation(i)}
          className={`w-1 rounded-full ${
            profile === "bass" 
              ? "bg-[#0070f3]" 
              : profile === "hifi" 
                ? "bg-gray-900" 
                : "bg-[#0070f3]/60"
          }`}
          style={{
            opacity: 1 - Math.abs(i - 20) / 25 // Fade edges
          }}
        />
      ))}
    </div>
  );
};

export default AudioWaveform;
