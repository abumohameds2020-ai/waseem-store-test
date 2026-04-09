"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Zap, Waves, ChevronRight, Speaker } from 'lucide-react';
import EditableText from './EditableText';
import { useVisualEditor } from '@/context/VisualEditorContext';

const profiles = [
  {
    id: 'gaming',
    name: 'Gaming / Pro',
    label: 'Spatial Accuracy',
    desc: 'Enhanced directional cues and tactical soundstaging.',
    color: '#06b6d4',
    products: ['Phantom', 'PR3', 'AS24']
  },
  {
    id: 'audiophile',
    name: 'Audiophile',
    label: 'Sonic Purity',
    desc: 'Linear frequency response for absolute signal honesty.',
    color: '#f59e0b',
    products: ['Symphony', 'Hydro', 'PR2']
  },
  {
    id: 'vshape',
    name: 'V-Shape / Bass',
    label: 'Sub-Atomic Impact',
    desc: 'Aggressive low-end shelf with shimmering treble detail.',
    color: '#ef4444',
    products: ['Castor', 'ZAX', 'ZS10 Pro']
  }
];

export default function AcousticDNA() {
  const [activeTab, setActiveTab] = useState(profiles[0].id);
  const { setAccentColor } = useVisualEditor();

  const handleProfileClick = (profile: typeof profiles[0]) => {
    setActiveTab(profile.id);
    setAccentColor(profile.color);
    // Synesthesia event
    window.dispatchEvent(new CustomEvent('kz-synesthesia', { detail: profile.color }));
    // Filter event
    window.dispatchEvent(new CustomEvent('kz-nav-filter', { detail: profile.id === 'vshape' ? 'Dynamic' : profile.id === 'gaming' ? 'Planar Magnetic' : 'All' }));
  };

  return (
    <section className="py-40 bg-black relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-24">
           <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] mb-4 block">Neural Sound Engine</span>
           <h2 className="text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter mb-8 leading-tight">
             Visualizing <br /> <span className="text-gray-500 italic">Sound DNA</span>
           </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {profiles.map((profile) => (
            <motion.div
              key={profile.id}
              whileHover={{ y: -10 }}
              onClick={() => handleProfileClick(profile)}
              className={`relative cursor-pointer group p-12 rounded-[48px] border transition-all duration-700 ${
                activeTab === profile.id 
                ? 'bg-white/[0.03] border-white/20 shadow-[0_40px_100px_rgba(0,0,0,0.5)]' 
                : 'bg-transparent border-white/5 opacity-40 grayscale hover:grayscale-0 hover:opacity-100'
              }`}
            >
               {/* Animated Pulse Waveforms */}
               <div className="h-48 flex items-end justify-center gap-1.5 mb-12">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        height: activeTab === profile.id 
                          ? [20, Math.random() * 120 + 20, 40, Math.random() * 120 + 20, 20] 
                          : [20, 30, 20],
                        opacity: activeTab === profile.id ? [0.4, 1, 0.4] : 0.2
                      }}
                      transition={{
                        duration: profile.id === 'gaming' ? 0.8 : profile.id === 'audiophile' ? 2.5 : 1.2,
                        repeat: Infinity,
                        delay: i * 0.05,
                        ease: "easeInOut"
                      }}
                      className="w-1.5 rounded-full"
                      style={{ backgroundColor: profile.color, opacity: activeTab === profile.id ? 1 : 0.3 }}
                    />
                  ))}
               </div>

               <span className="text-[10px] font-black uppercase text-cyan-500 tracking-widest mb-4 block" style={{ color: profile.color }}>
                  {profile.label}
               </span>
               <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">
                 <EditableText value={profile.name} path={`cms.dna.${profile.id}.name`} tagName="span" />
               </h3>
               <p className="text-gray-500 text-sm font-medium uppercase tracking-widest leading-relaxed mb-8">
                 <EditableText value={profile.desc} path={`cms.dna.${profile.id}.desc`} tagName="span" multiline />
               </p>

               <div className="flex flex-wrap gap-2">
                  {profile.products.map(p => (
                    <span key={p} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[8px] font-black text-white uppercase tracking-widest group-hover:border-white/30 transition-all">
                      {p}
                    </span>
                  ))}
               </div>

               <div className={`absolute bottom-12 right-12 w-10 h-10 rounded-full flex items-center justify-center transition-all ${activeTab === profile.id ? 'bg-white text-black scale-110' : 'bg-white/5 text-white/20'}`}>
                  <Speaker size={20} />
               </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Global Background Bloom */}
      <motion.div 
        animate={{ color: profiles.find(p => p.id === activeTab)?.color }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl aspect-square bg-white opacity-5 rounded-full blur-[200px] pointer-events-none" 
        style={{ backgroundColor: profiles.find(p => p.id === activeTab)?.color }}
      />
    </section>
  );
}
