"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Award, Zap, Microscope, Headphones, ShieldCheck, Star } from 'lucide-react';
import EditableText from './EditableText';
import EditableImage from './EditableImage';

export default function AboutCraft({ about }: { about?: any }) {
  const features = [
    {
      icon: <Microscope size={32} />,
      title: "Tactical Tuning",
      desc: "Every frequency is managed by our neural-mapping algorithms to ensure phase coherence."
    },
    {
      icon: <Zap size={32} />,
      title: "Exotic Materials",
      desc: "From aerospace-grade alloys to pure silver cabling, no compromises are made in the signal path."
    },
    {
      icon: <Award size={32} />,
      title: "Elite Selection",
      desc: "We hand-pick and calibrate every internal driver before it earns the Phantom designation."
    }
  ];

  return (
    <section className="py-40 bg-[#030303] overflow-hidden relative">
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-32">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <div className="flex items-center gap-4">
              <span className="w-12 h-[1px] bg-cyan-500" />
              <EditableText 
                value={about?.philosophy || "Our Philosophy"} 
                path="cms.about.philosophy"
                className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.5em]"
              />
            </div>
            
            <h2 className="text-6xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9]">
              <EditableText 
                value={about?.title || "Precision Audio For The Elite"} 
                path="cms.about.title"
                tagName="span"
              />
            </h2>

            <EditableText 
              value={about?.description || "Waseem's Audio is not a store. It is a technical armory where pure acoustic science meets ultra-modern luxury. We don't sell headphones; we deploy auditory tools."} 
              path="cms.about.description"
              multiline
              tagName="p"
              className="text-xl text-gray-500 font-medium leading-relaxed max-w-xl"
            />

            <div className="flex gap-16 pt-8">
               <div className="space-y-2">
                  <div className="text-4xl font-black text-white tracking-widest uppercase">127+</div>
                  <p className="text-[10px] text-gray-700 font-bold uppercase tracking-widest">Active Prototypes</p>
               </div>
               <div className="space-y-2">
                  <div className="text-4xl font-black text-white tracking-widest uppercase">0.05%</div>
                  <p className="text-[10px] text-gray-700 font-bold uppercase tracking-widest">THD Reference</p>
               </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
             <div className="aspect-square relative rounded-[64px] overflow-hidden border border-white/5 bg-white/5 group">
                <EditableImage 
                  src={about?.mainImage || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1000'}
                  path="cms.about.mainImage"
                  alt="About Craft"
                  className="absolute inset-0 w-full h-full object-cover opacity-40 hover:scale-110 transition-transform duration-[3000ms]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                   <div className="w-24 h-24 bg-white text-black rounded-full flex items-center justify-center animate-pulse shadow-[0_0_50px_rgba(255,255,255,0.2)]">
                      <Zap size={40} />
                   </div>
                </div>
             </div>
             {/* Floating badge */}
             <div className="absolute -bottom-10 -left-10 p-12 bg-black border border-white/5 rounded-[40px] shadow-2xl backdrop-blur-xl group hover:border-cyan-500/30 transition-all">
                <div className="flex items-center gap-4 mb-4">
                   <ShieldCheck className="text-cyan-500" />
                   <span className="text-[10px] font-black uppercase text-white tracking-widest">
                     <EditableText value="Verified Craft" path="cms.about.badge" />
                   </span>
                </div>
                <div className="flex gap-1 text-amber-500">
                   {[0,1,2,3,4].map(i => <Star key={i} size={12} fill="currentColor" />)}
                </div>
             </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="p-12 bg-white/[0.02] border border-white/5 rounded-[48px] hover:bg-white/[0.04] hover:border-white/10 transition-all group"
            >
              <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-white mb-8 group-hover:scale-110 group-hover:text-cyan-500 transition-all duration-500">
                {f.icon}
              </div>
              <h3 className="text-2xl font-black text-white uppercase mb-4 tracking-tight">
                <EditableText value={f.title} path={`cms.features.${i}.title`} tagName="span" />
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed font-medium uppercase tracking-[0.05em]">
                <EditableText value={f.desc} path={`cms.features.${i}.desc`} tagName="span" multiline />
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl aspect-square bg-cyan-500/5 rounded-full blur-[200px] pointer-events-none" />
    </section>
  );
}
