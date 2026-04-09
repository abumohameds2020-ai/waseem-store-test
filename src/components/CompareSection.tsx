"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Layers,
  Zap,
  Music,
  TrendingUp,
  Weight,
  DollarSign,
  Check,
  X,
  Target,
  Scale
} from "lucide-react";

interface ComparisonRow {
  feature: string;
  Icon: React.ElementType;
  planar: string;
  dynamic: string;
  planarWins: boolean;
}

const comparisons: ComparisonRow[] = [
  {
    feature: "Diaphragm Technology",
    Icon: Layers,
    planar: "Ultra-thin nano-film driven by magnetic array",
    dynamic: "Traditional cone diaphragm with voice coil",
    planarWins: true,
  },
  {
    feature: "Total Harmonic Distortion",
    Icon: TrendingUp,
    planar: "<0.1% — professional reference grade",
    dynamic: "0.3–1.0% typical at high SPL",
    planarWins: true,
  },
  {
    feature: "Transient Response",
    Icon: Zap,
    planar: "Instantaneous attack & micro-decay",
    dynamic: "Limited by cone displacement mass",
    planarWins: true,
  },
  {
    feature: "Soundstage Imaging",
    Icon: Target,
    planar: "Expansive, holographic 3D layering",
    dynamic: "Narrower, conventional presentation",
    planarWins: true,
  },
  {
    feature: "Driver Weight",
    Icon: Weight,
    planar: "Slightly increased due to magnet density",
    dynamic: "Lightweight polymer construction",
    planarWins: false,
  },
  {
    feature: "Value Engineering",
    Icon: Scale,
    planar: "Premium performance at boutique scale",
    dynamic: "Mass-produced efficiency pricing",
    planarWins: false,
  },
];

export default function CompareSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="compare"
      className="relative py-24 sm:py-32 bg-white overflow-hidden luxury-grid"
      ref={ref}
    >
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-100 to-transparent" />

      <div className="relative z-10 linsoul-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <span className="badge-premium mb-4">
            ACOUSTIC BENCHMARKS
          </span>
          <h2 className="section-title mb-6">
            Planar vs <span className="text-gray-400">Dynamic</span>
          </h2>
          <p className="section-subtitle max-w-xl mx-auto">
            Why professional audiophiles are transitioning to planar magnetic technology — and how the KZ Phantom redefines the price-to-performance ratio.
          </p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="luxury-card rounded-3xl overflow-hidden border border-gray-100 bg-white"
        >
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_1fr_1fr] border-b border-gray-50 bg-gray-50/30">
            <div className="p-6 sm:p-8">
              <span className="text-[10px] text-gray-400 font-bold tracking-[0.2em] uppercase">
                Architecture
              </span>
            </div>
            <div className="p-6 sm:p-8 border-l border-gray-50 bg-[#0070f3]/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#0070f3]" />
                <span className="text-sm font-bold text-gray-900 tracking-tight uppercase">
                  Planar Magnetic
                </span>
              </div>
              <span className="text-[9px] text-[#0070f3] mt-2 block font-bold tracking-widest">
                KZ PHANTOM SERIES
              </span>
            </div>
            <div className="p-6 sm:p-8 border-l border-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                <span className="text-sm font-bold text-gray-400 tracking-tight uppercase">
                  Dynamic Driver
                </span>
              </div>
              <span className="text-[9px] text-gray-400 mt-2 block font-bold tracking-widest">
                CONVENTIONAL IEM
              </span>
            </div>
          </div>

          {/* Rows */}
            {comparisons.map((row, i) => {
              const RowIcon = row.Icon;
              return (
              <motion.div
              key={row.feature}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
              className="grid grid-cols-[1fr_1fr_1fr] border-b border-gray-50 last:border-0 group hover:bg-gray-50/50 transition-colors"
            >
              {/* Feature name */}
              <div className="p-6 sm:p-7 flex items-start gap-5">
                {React.createElement(RowIcon as any, { className: "w-5 h-5 text-gray-300 shrink-0 mt-0.5 transition-colors group-hover:text-[#0070f3]" })}
                <span className="text-sm text-gray-900 font-serif font-bold leading-tight">
                  {row.feature}
                </span>
              </div>

              {/* Planar column */}
              <div className="p-6 sm:p-7 border-l border-gray-50 bg-[#0070f3]/[0.01] group-hover:bg-[#0070f3]/[0.03] transition-colors">
                <div className="flex items-start gap-3">
                  {row.planarWins ? (
                    <Check className="w-5 h-5 text-[#0070f3] shrink-0" />
                  ) : (
                    <X className="w-5 h-5 text-gray-300 shrink-0" />
                  )}
                  <span className={`text-sm leading-relaxed font-medium tracking-tight ${row.planarWins ? 'text-gray-900' : 'text-gray-400'}`}>
                    {row.planar}
                  </span>
                </div>
              </div>

              {/* Dynamic column */}
              <div className="p-6 sm:p-7 border-l border-gray-50 group-hover:bg-gray-50/30 transition-colors">
                <div className="flex items-start gap-3">
                  {!row.planarWins ? (
                    <Check className="w-5 h-5 text-gray-400 shrink-0" />
                  ) : (
                    <X className="w-5 h-5 text-gray-200 shrink-0" />
                  )}
                  <span className={`text-sm leading-relaxed font-medium tracking-tight ${!row.planarWins ? 'text-gray-600' : 'text-gray-400'}`}>
                    {row.dynamic}
                  </span>
                </div>
              </div>
            </motion.div>
              );
            })}
        </motion.div>

        {/* Verdict Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-4 bg-white px-10 py-5 rounded-full border border-gray-100 shadow-xl shadow-black/5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#0070f3] animate-pulse" />
            <p className="text-sm font-medium text-gray-500 tracking-tight">
              <span className="text-gray-900 font-bold uppercase mr-2 font-sans text-xs tracking-widest">Final Verdict:</span>{" "}
              The KZ Phantom delivers professional planar performance at an{" "}
              <span className="text-[#0070f3] font-bold">unrivaled price-to-fidelity ratio</span>.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
