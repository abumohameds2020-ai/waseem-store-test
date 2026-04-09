"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import SafeImage from './SafeImage';
import EditableText from './EditableText';
import EditableImage from './EditableImage';

export default function AnatomyOfPrecision({ anatomy }: { anatomy?: any }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const scale = useTransform(scrollYProgress, [0.3, 0.5], [0.8, 1.1]);
  const opacity = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);

  const labels = [
    { id: 1, title: "Acoustic Chamber", pos: "top-1/4 left-1/4", desc: "Precision-milled aerospace aluminum for zero resonance." },
    { id: 2, title: "Planar Driver", pos: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2", desc: "13.2mm Nano-diaphragm with N52 magnets.", highlight: true },
    { id: 3, title: "Silver-Plated Cable", pos: "bottom-1/4 right-1/4", desc: "Oxygen-free copper with 200 silver strands for ultra-low impedance." }
  ];

  return (
    <section ref={containerRef} className="relative py-60 bg-black overflow-hidden border-t border-white/5">
      {/* Background technical grid */}
      <div className="absolute inset-0 tech-grid opacity-20 pointer-events-none" />
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <motion.div 
          style={{ opacity }}
          className="text-center mb-40"
        >
          <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.6em] mb-6 block">
            <EditableText value="Structural Integrity Scan" path="cms.anatomy.label" tagName="span" />
          </span>
          <h2 className="text-5xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-none mb-8">
            <EditableText 
              value="The Anatomy Of Precision" 
              path="cms.anatomy.title" 
              multiline
              tagName="span"
            />
          </h2>
          <div className="text-gray-500 text-lg font-medium max-w-xl mx-auto uppercase tracking-widest">
            <EditableText 
              value="Deconstructing the engineering masterpiece that redefines acoustic boundaries." 
              path="cms.anatomy.description" 
              multiline
              tagName="span"
            />
          </div>
        </motion.div>

        <div className="relative h-[800px] flex items-center justify-center">
          {/* Main Exploded Visual */}
          <motion.div 
            style={{ scale, y: y1 }}
            className="relative w-full max-w-3xl aspect-square flex items-center justify-center p-10"
          >
             {/* Core Driver (Main) */}
             <div className="relative z-20 w-full h-full max-w-[800px] max-h-[800px]">
                <EditableImage 
                  src={anatomy?.image || "/assets/exploded_iem.png"} 
                  path="cms.anatomy.image"
                  alt="Planar Core"
                  className="w-full h-full object-contain filter drop-shadow-[0_0_80px_rgba(6,182,212,0.4)]"
                />
             </div>
          </motion.div>

          {/* Interactive Technical Labels */}
          <div className="absolute inset-0 pointer-events-none">
             {labels.map((label, idx) => (
                <motion.div
                  key={label.id}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, margin: "-100px" }}
                  transition={{ delay: idx * 0.2, duration: 1 }}
                  className={`absolute ${label.pos} p-6 glass-card border-cyan-500/10 pointer-events-auto max-w-[280px] group`}
                >
                   <div className="flex items-center gap-4 mb-3">
                      <div className={`w-3 h-3 rounded-full ${label.highlight ? 'bg-cyan-500 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]' : 'bg-gray-700'}`} />
                      <h4 className="text-[11px] font-black text-white uppercase tracking-widest">{label.title}</h4>
                   </div>
                   <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                      {label.desc}
                   </p>
                   
                   {/* Connecting line decoration */}
                   <div className={`absolute top-1/2 ${idx % 2 === 0 ? 'left-full' : 'right-full'} w-20 h-[1px] bg-gradient-to-r from-cyan-500/20 to-transparent mt-px`} />
                </motion.div>
             ))}
          </div>
        </div>

        {/* Technical Footer */}
        <div className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/5 pt-20">
           {[
             { label: "Phase Coherence", value: "Absolute" },
             { label: "Harmonic Distortion", value: "<0.1%" },
             { label: "Internal Volume", value: "Optimized" }
           ].map(stat => (
             <div key={stat.label} className="text-center md:text-left">
                <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.4em] mb-4">{stat.label}</p>
                <p className="text-4xl font-black text-white uppercase tracking-tighter italic">{stat.value}</p>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
}
