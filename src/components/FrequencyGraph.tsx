"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Activity, Zap, Waves } from "lucide-react";

type SoundProfile = "v-shaped" | "balanced" | "warm";

interface ProfileData {
  label: string;
  description: string;
  color: string;
  points: number[];
}

const profiles: Record<SoundProfile, ProfileData> = {
  "v-shaped": {
    label: "V-Shaped (Standard)",
    description:
      "Enhanced bass and treble with a recessed midrange. Ideal for EDM, Hip-Hop, and cinematic gaming.",
    color: "#0070f3",
    points: [85, 78, 65, 55, 48, 45, 42, 44, 50, 58, 65, 72, 78, 82, 88, 90],
  },
  balanced: {
    label: "Natural Reference",
    description:
      "Flat, reference-grade response across all frequencies. Perfect for critical listening and classical monitors.",
    color: "#10b981",
    points: [62, 63, 64, 63, 62, 61, 60, 60, 61, 62, 63, 64, 63, 62, 61, 60],
  },
  warm: {
    label: "Musical Warmth",
    description:
      "Emphasized low-mids and smooth treble roll-off. Great for Jazz, Acoustic, and long fatigue-free sessions.",
    color: "#f59e0b",
    points: [88, 85, 80, 75, 68, 62, 58, 55, 52, 50, 48, 46, 44, 42, 40, 38],
  },
};

const freqLabels = [
  "20",
  "40",
  "80",
  "160",
  "315",
  "630",
  "1k",
  "2k",
  "4k",
  "6k",
  "8k",
  "10k",
  "14k",
  "20k",
  "30k",
  "40k",
];

function buildPath(points: number[], width: number, height: number): string {
  const padding = 40;
  const graphWidth = width - padding * 2;
  const graphHeight = height - padding * 2;
  const stepX = graphWidth / (points.length - 1);

  const coords = points.map((pt, i) => ({
    x: padding + i * stepX,
    y: padding + graphHeight - (pt / 100) * graphHeight,
  }));

  let path = `M ${coords[0].x} ${coords[0].y}`;
  for (let i = 1; i < coords.length; i++) {
    const prev = coords[i - 1];
    const curr = coords[i];
    const cpx1 = prev.x + stepX * 0.4;
    const cpx2 = curr.x - stepX * 0.4;
    path += ` C ${cpx1} ${prev.y}, ${cpx2} ${curr.y}, ${curr.x} ${curr.y}`;
  }
  return path;
}

function buildAreaPath(points: number[], width: number, height: number): string {
  const padding = 40;
  const graphHeight = height - padding * 2;
  const linePath = buildPath(points, width, height);
  const graphWidth = width - padding * 2;
  const lastX = padding + graphWidth;
  const bottomY = padding + graphHeight;
  return `${linePath} L ${lastX} ${bottomY} L ${padding} ${bottomY} Z`;
}

export default function FrequencyGraph() {
  const [activeProfile, setActiveProfile] = useState<SoundProfile>("v-shaped");
  const [hoveredFreq, setHoveredFreq] = useState<number | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const WIDTH = 800;
  const HEIGHT = 360;
  const PADDING = 40;
  const profile = profiles[activeProfile];

  return (
    <section
      id="frequency"
      className="relative py-24 sm:py-32 bg-white overflow-hidden luxury-grid"
      ref={ref}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-[#f9f9f9]/50 pointer-events-none" />

      <div className="relative z-10 linsoul-container">
        {/* Header */}
        <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="text-center mb-16"
            >
          <span className="badge-premium mb-4">
                ACOUSTIC ANALYSIS
              </span>
          <h2 className="section-title mb-6">
                Frequency Response
              </h2>
          <p className="section-subtitle max-w-xl mx-auto">
            Explore the KZ Phantom&apos;s tunable sound signatures. Switch tuning
            profiles to experience the precision of planar engineering.
          </p>
        </motion.div>

        {/* Profile Selector */}
        <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-4 mb-16"
            >
          {(Object.keys(profiles) as SoundProfile[]).map((key) => (
            <button
                  key={key}
                  onClick={() => setActiveProfile(key)}
                  className={`px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500 border ${
                    activeProfile === key
                      ? "bg-white text-gray-900 border-gray-200 shadow-xl shadow-black/5"
                      : "text-gray-400 bg-transparent border-transparent hover:border-gray-100 hover:text-gray-600"
                  }`}
                >
              <span
                    className="inline-block w-2.5 h-2.5 rounded-full mr-3 shadow-inner"
                    style={{ backgroundColor: profiles[key].color }}
                  />
              {profiles[key].label}
            </button>
          ))}
        </motion.div>

        {/* Graph Container */}
        <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="luxury-card rounded-3xl p-6 sm:p-12 shadow-2xl shadow-black/5 bg-white border border-gray-100"
            >
          <div className="mb-8 flex items-center justify-between border-b border-gray-50 pb-6">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
                 <Activity size={18} className="text-[#0070f3]" />
               </div>
               <div>
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest">{profile.label}</h4>
                  <p className="text-[10px] text-gray-400 font-medium">Digital Frequency Analysis v2.0</p>
               </div>
            </div>
            <div className="hidden sm:flex items-center gap-6">
               <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-gray-900">128dB</span>
                  <span className="text-[8px] text-gray-400 uppercase font-bold">Sensitivity</span>
               </div>
               <div className="w-px h-6 bg-gray-100" />
               <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-gray-900">41.0 Ω</span>
                  <span className="text-[8px] text-gray-400 uppercase font-bold">Impedance</span>
               </div>
            </div>
          </div>

          <svg
                viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
                className="w-full h-auto"
                preserveAspectRatio="xMidYMid meet"
              >
            <defs>
              <linearGradient
                    id="areaGrad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                <stop
                      offset="0%"
                      stopColor={profile.color}
                      stopOpacity="0.1"
                    />
                <stop
                      offset="100%"
                      stopColor={profile.color}
                      stopOpacity="0"
                    />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((pct) => {
              const y =
                PADDING +
                (HEIGHT - PADDING * 2) -
                (pct / 100) * (HEIGHT - PADDING * 2);
              return (
                <g key={pct}>
                  <line
                        x1={PADDING}
                        y1={y}
                        x2={WIDTH - PADDING}
                        y2={y}
                        stroke="#f1f1f1"
                        strokeDasharray="2 2"
                      />
                  <text
                        x={PADDING - 12}
                        y={y + 3}
                        textAnchor="end"
                        fill="#ccc"
                        fontSize="8"
                        fontWeight="bold"
                        fontFamily="sans-serif"
                      >
                    {pct === 0 ? "-20" : pct === 25 ? "-10" : pct === 50 ? "0" : pct === 75 ? "+10" : "+20"}dB
                  </text>
                </g>
              );
            })}

            {/* Frequency labels */}
            {freqLabels.map((label, i) => {
              const x =
                PADDING +
                (i / (freqLabels.length - 1)) * (WIDTH - PADDING * 2);
              return (
                <text
                      key={label}
                      x={x}
                      y={HEIGHT - 10}
                      textAnchor="middle"
                      fill={hoveredFreq === i ? "#0070f3" : "#ddd"}
                      fontSize="8"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                      className="transition-all duration-300"
                    >
                  {label}
                </text>
              );
            })}

            {/* Area fill */}
            <motion.path
                  key={`area-${activeProfile}`}
                  d={buildAreaPath(profile.points, WIDTH, HEIGHT)}
                  fill="url(#areaGrad)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                />

            {/* Main line */}
            <motion.path
                  key={`line-${activeProfile}`}
                  d={buildPath(profile.points, WIDTH, HEIGHT)}
                  fill="none"
                  stroke={profile.color}
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />

            {/* Data points */}
            {profile.points.map((pt, i) => {
              const x =
                PADDING +
                (i / (profile.points.length - 1)) * (WIDTH - PADDING * 2);
              const y =
                PADDING +
                (HEIGHT - PADDING * 2) -
                (pt / 100) * (HEIGHT - PADDING * 2);
              return (
                <g key={i}>
                  <circle
                        cx={x}
                        cy={y}
                        r={hoveredFreq === i ? 6 : 0}
                        fill={profile.color}
                        opacity={hoveredFreq === i ? 1 : 0}
                        className="transition-all duration-300"
                      />
                  {/* Invisible hover target */}
                  <rect
                        x={x - 20}
                        y={PADDING}
                        width={40}
                        height={HEIGHT - PADDING * 2}
                        fill="transparent"
                        onMouseEnter={() => setHoveredFreq(i)}
                        onMouseLeave={() => setHoveredFreq(null)}
                        className="cursor-crosshair"
                      />
                  {/* Tooltip */}
                  {hoveredFreq === i && (
                    <g>
                      <line
                            x1={x}
                            y1={PADDING}
                            x2={x}
                            y2={HEIGHT - PADDING}
                            stroke="#f1f1f1"
                            strokeWidth="1"
                          />
                      <rect
                            x={x - 35}
                            y={y - 35}
                            width={70}
                            height={24}
                            rx={4}
                            fill="#000"
                            className="shadow-xl"
                          />
                      <text
                            x={x}
                            y={y - 19}
                            textAnchor="middle"
                            fill="#fff"
                            fontSize="9"
                            fontWeight="bold"
                          >
                        {freqLabels[i]}Hz
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Description */}
          <div className="mt-12 p-8 bg-gray-50 rounded-2xl flex items-center gap-6 border border-gray-100">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
               <Zap size={20} className="text-[#0070f3]" />
            </div>
            <p className="text-sm text-gray-500 leading-relaxed font-medium tracking-tight italic">
              &quot;{profile.description}&quot;
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
