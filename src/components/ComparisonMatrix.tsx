"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Activity, Waves, Gauge } from 'lucide-react';
import EditableText from './EditableText';

const metrics = [
  { id: 'freq', label: 'Frequency Response', icon: Waves },
  { id: 'sens', label: 'Sensitivity', icon: Zap },
  { id: 'imp', label: 'Impedance', icon: Activity },
  { id: 'driver', label: 'Driver Configuration', icon: Gauge },
  { id: 'thd', label: 'T.H.D', icon: ShieldCheck }
];

const topProducts = [
  {
    name: "KZ Phantom",
    tag: "The Benchmark",
    freq: "20Hz - 40kHz",
    sens: "103dB ± 3dB",
    imp: "16Ω ± 3Ω",
    driver: "13.2mm Planar",
    thd: "<0.1%",
    highlight: true
  },
  {
    name: "CCA Hydro",
    tag: "The Hybrid King",
    freq: "15Hz - 40kHz",
    sens: "110dB ± 3dB",
    imp: "24Ω ± 3Ω",
    driver: "10-Driver Hybrid",
    thd: "<0.5%"
  },
  {
    name: "KZ AS24",
    tag: "BA Precision",
    freq: "20Hz - 40kHz",
    sens: "112dB ± 3dB",
    imp: "20Ω ± 3Ω",
    driver: "12 Balanced Armatures",
    thd: "<1.0%"
  }
];

export default function ComparisonMatrix() {
  return (
    <section className="relative py-40 bg-[#030303] overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="mb-24 flex flex-col md:flex-row items-end justify-between gap-12">
           <div className="max-w-2xl">
              <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.6em] mb-6 block">
                <EditableText value="Benchmark Protocols" path="cms.comparison.label" tagName="span" />
              </span>
              <h2 className="text-4xl lg:text-7xl font-black text-white uppercase tracking-tighter leading-tight mb-8">
                <EditableText 
                  value="The Technical Comparison Matrix" 
                  path="cms.comparison.title" 
                  multiline
                  tagName="span"
                />
              </h2>
           </div>
           <p className="text-gray-500 text-sm font-bold uppercase tracking-widest max-w-xs md:text-right">
              <EditableText 
                value="Direct telemetry comparison of our flagship series across primary acoustic metrics." 
                path="cms.comparison.description" 
                multiline
                tagName="span"
              />
           </p>
        </div>

        {/* Table Structure */}
        <div className="overflow-x-auto custom-scrollbar">
           <div className="min-w-[800px] grid grid-cols-4 gap-8">
              {/* Labels Column */}
              <div className="space-y-12 pt-40">
                 {metrics.map(m => (
                    <div key={m.id} className="flex items-center gap-4 py-8 group">
                       <m.icon size={14} className="text-gray-600 group-hover:text-cyan-500 transition-colors" />
                       <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-white transition-colors">
                         <EditableText value={m.label} path={`cms.comparison.metrics.${m.id}`} tagName="span" />
                       </span>
                    </div>
                 ))}
              </div>

              {/* Product Columns */}
              {topProducts.map((p, i) => (
                 <motion.div 
                    key={p.name}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`relative rounded-[48px] p-10 flex flex-col items-center text-center transition-all duration-500 group ${p.highlight ? 'bg-white/[0.03] border border-cyan-500/20 shadow-[0_40px_100px_rgba(0,0,0,0.4)]' : 'bg-transparent border border-white/5 opacity-60 hover:opacity-100'}`}
                 >
                    {p.highlight && <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-cyan-500 text-black text-[9px] font-black uppercase tracking-widest rounded-full shadow-[0_0_20px_rgba(6,182,212,0.6)]">
                      <EditableText value="REFERENCE STATUS" path="cms.comparison.status" tagName="span" />
                    </span>}
                    
                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4">
                      <EditableText value={p.tag} path={`cms.comparison.products.${i}.tag`} tagName="span" />
                    </span>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-20">
                      <EditableText value={p.name} path={`cms.comparison.products.${i}.name`} tagName="span" />
                    </h3>

                    <div className="space-y-12 w-full">
                       {metrics.map(m => (
                          <div key={m.id} className="py-8 border-t border-white/[0.04]">
                             <p className="text-lg font-black text-white tracking-widest font-mono">
                                <EditableText value={(p as any)[m.id]} path={`cms.comparison.products.${i}.${m.id}`} tagName="span" />
                             </p>
                          </div>
                       ))}
                    </div>
                    
                    <button className={`mt-20 px-8 py-4 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] transition-all ${p.highlight ? 'bg-cyan-500 text-black shadow-[0_20px_40px_rgba(6,182,212,0.2)]' : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'}`}>
                       <EditableText value="Secure Asset" path={`cms.comparison.button`} tagName="span" />
                    </button>
                 </motion.div>
              ))}
           </div>
        </div>
      </div>
    </section>
  );
}
