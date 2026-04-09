"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Disc3,
  Radio,
  Aperture,
  Cable,
  Plug,
  Gauge,
  Volume2,
  Ruler,
  Activity
} from "lucide-react";
import EditableText from './EditableText';
import EditableImage from './EditableImage';

const specs = [
  {
    icon: Disc3,
    title: "13.2mm Planar Magnetic Driver",
    description: "2nd-gen Dome Core large-diaphragm driver with multi-layer nano-composite for ultra-low distortion and blazing transient response.",
    highlight: "FLAGSHIP",
  },
  {
    icon: Radio,
    title: "20Hz – 40kHz Response",
    description: "Extended frequency response captures every micro-detail from sub-bass rumble to ultra-high harmonics beyond human hearing.",
    highlight: "HI-RES",
  },
  {
    icon: Aperture,
    title: "Semi-Open Back Design",
    description: "Natural soundstage expansion with controlled air flow. Delivers an open-back feel without sacrificing isolation.",
    highlight: "ACOUSTIC",
  },
  {
    icon: Gauge,
    title: "41Ω Impedance Optimization",
    description: "Optimized for both portable and desktop setups. Drive it effortlessly from your phone or scale up with a dedicated DAC/Amp.",
    highlight: "VERSATILE",
  },
  {
    icon: Volume2,
    title: "128dB ±2dB Sensitivity",
    description: "High-efficiency design ensures loud, detailed playback even at low volume. Perfect for quiet listening sessions.",
    highlight: "EFFICIENT",
  },
  {
    icon: Cable,
    title: "Silver-Plated Copper Cable",
    description: "Dual-parallel silver-plated copper cable (120cm) with 0.78mm 2-pin connectors for clean signal transfer.",
    highlight: "PREMIUM",
  },
  {
    icon: Activity,
    title: "DSP Integrated Module",
    description: "Type-C version includes an integrated DSP chip for real-time audio processing, EQ tuning, and FPS positional audio.",
    highlight: "TECH",
  },
  {
    icon: Ruler,
    title: "Full-Metal Cavity Build",
    description: "CNC-machined aluminum alloy shell with precision-engineered internal chambers for resonance-free performance.",
    highlight: "CRAFTSMAN",
  },
];

export default function TechSpecsGrid() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="specs"
      className="relative py-32 bg-[#030303] overflow-hidden"
      ref={ref}
    >
      <div className="relative z-10 container mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-24"
        >
          <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.5em] mb-6 block">
            <EditableText value="ENGINEERING MANIFESTO" path="cms.specs.label" tagName="span" />
          </span>
          <h2 className="text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter mb-8 leading-tight">
             <EditableText value="Engineered Without" path="cms.specs.title_main" tagName="span" /> <br />
             <span className="text-gray-500">
               <EditableText value="Compromise" path="cms.specs.title_sub" tagName="span" />
             </span>
          </h2>
          <p className="text-gray-500 text-lg font-medium max-w-2xl mx-auto uppercase tracking-widest">
             <EditableText 
               value="Every component is precision-engineered for absolute phase coherence and reference-grade performance." 
               path="cms.specs.description" 
               multiline
               tagName="span"
             />
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
          {specs.map((spec, i) => (
            <motion.div
              key={spec.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative glass-card p-10 hover:border-cyan-500/30 transition-all duration-500 cursor-default"
            >
              <span className="absolute top-8 right-8 text-[8px] font-black tracking-[0.2em] text-cyan-500 bg-cyan-500/10 px-3 py-1 rounded-full">
                <EditableText value={spec.highlight} path={`cms.specs.items.${i}.highlight`} tagName="span" />
              </span>

              <div className="mb-10">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-black transition-all duration-500">
                  <spec.icon size={24} className="text-gray-400 group-hover:text-inherit transition-colors" />
                </div>
              </div>

              <h3 className="text-xl font-black text-white mb-4 uppercase tracking-tight">
                <EditableText value={spec.title} path={`cms.specs.items.${i}.title`} tagName="span" />
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed font-bold uppercase tracking-widest">
                <EditableText value={spec.description} path={`cms.specs.items.${i}.description`} tagName="span" multiline />
              </p>
            </motion.div>
          ))}
        </div>

        {/* Planar Core Highlight */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center bg-white/[0.02] border border-white/5 rounded-[64px] p-12 lg:p-24 overflow-hidden group">
           <div className="relative aspect-square rounded-[40px] overflow-hidden border border-white/10 group-hover:border-cyan-500/30 transition-all duration-700">
              <EditableImage 
                src="https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=1000" 
                path="cms.specs.banner_image"
                alt="KZ Phantom Planar Core"
                className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-[3000ms]"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-transparent pointer-events-none" />
           </div>
           <div className="space-y-10">
              <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.6em] mb-4 block">
                <EditableText value="Core Acoustic Evolution" path="cms.specs.banner_label" />
              </span>
              <h2 className="text-5xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9]">
                 <EditableText value="The Planar" path="cms.specs.banner_title_1" tagName="span" /> <br />
                 <span className="text-gray-500 italic">
                   <EditableText value="Magnetic Core" path="cms.specs.banner_title_2" tagName="span" />
                 </span>
              </h2>
              <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-xl uppercase tracking-widest">
                 <EditableText 
                   value="Unlike traditional dynamic drivers, the Waseem's Audio planar module distributes electrical signals across an ultra-thin diaphragm suspended between powerful N52 neodymium magnets for zero-distortion playback." 
                   path="cms.specs.banner_desc" 
                   multiline
                   tagName="span"
                 />
              </p>
           </div>
        </div>
      </div>
    </section>
  );
}
