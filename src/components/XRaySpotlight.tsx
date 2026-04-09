"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVisualEditor } from '@/context/VisualEditorContext';
import EditableText from './EditableText';
import EditableImage from './EditableImage';
import { Sliders, Maximize, Circle } from 'lucide-react';

export default function XRaySpotlight() {
  const { isEditMode, draftConfig, updateDraft } = useVisualEditor();
  const [pos, setPos] = useState({ x: 50, y: 50 }); // Percentages
  const [isHovering, setIsHovering] = useState(false);
  const [activeProduct, setActiveProduct] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleSync = (e: any) => setActiveProduct(e.detail);
    window.addEventListener('kz-inspect-xray', handleSync);
    return () => window.removeEventListener('kz-inspect-xray', handleSync);
  }, []);

  // Load settings from draftConfig
  const radius = draftConfig?.cms?.xray?.radius || 150;
  const feather = draftConfig?.cms?.xray?.feather || 50;

  // Resolve dynamic sources
  const defaultExt = draftConfig?.cms?.xray?.shell_image || "/assets/planar_series.png";
  const defaultInt = draftConfig?.cms?.xray?.internals_image || "/assets/exploded_iem.png";
  
  const currentExtSrc = activeProduct?.slide?.xray_external_image || activeProduct?.product?.images?.xray_external_image || defaultExt;
  const currentIntSrc = activeProduct?.slide?.xray_internal_reveal || activeProduct?.product?.images?.xray_internal_reveal || defaultInt;

  const handleInteraction = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    setPos({ x, y });
  };

  const onMouseMove = (e: React.MouseEvent) => handleInteraction(e.clientX, e.clientY);
  const onTouchMove = (e: React.TouchEvent) => {
    setIsHovering(true);
    handleInteraction(e.touches[0].clientX, e.touches[0].clientY);
  };

  return (
    <section className="relative py-40 bg-[#030303] overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 text-center mb-20">
         <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-12 h-[1px] bg-cyan-500/30" />
            <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.8em]">Biological Scan Protocol</span>
            <div className="w-12 h-[1px] bg-cyan-500/30" />
         </div>
         <h2 className="text-6xl lg:text-8xl font-black text-white uppercase tracking-tighter mix-blend-difference">
           <EditableText value="Biological X-Ray" path="cms.xray.title" /> <br />
           <span className="text-gray-500 italic">Spotlight</span>
         </h2>
      </div>

      <div 
        ref={containerRef}
        onMouseMove={onMouseMove}
        onTouchMove={onTouchMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="relative max-w-6xl mx-auto aspect-[16/9] cursor-none group touch-none"
      >
        {/* Base Layer: External Shell */}
        <div className="absolute inset-0 z-10">
          <AnimatePresence mode="popLayout">
            <motion.img 
              key={currentExtSrc}
              src={currentExtSrc}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              alt="IEM External Shell"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none transition-all duration-700 group-hover:opacity-40" 
            />
          </AnimatePresence>
        </div>

        {/* X-Ray Layer (Revealed via Mask) */}
        <div 
          className="absolute inset-0 z-20 pointer-events-none transition-opacity duration-300"
          style={{
            opacity: isHovering ? 1 : 0,
            WebkitMaskImage: `radial-gradient(circle ${radius}px at ${pos.x}% ${pos.y}%, black 0%, transparent ${radius + feather}px)`,
            maskImage: `radial-gradient(circle ${radius}px at ${pos.x}% ${pos.y}%, black 0%, transparent ${radius + feather}px)`,
          }}
        >
          <AnimatePresence mode="popLayout">
            <motion.img 
              key={currentIntSrc}
              src={currentIntSrc}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              alt="IEM Internal Details"
              className="absolute inset-0 w-full h-full object-contain filter drop-shadow-[0_0_50px_rgba(6,182,212,0.8)]" 
            />
          </AnimatePresence>
        </div>

        {/* UI HUD Element (Follows scanner) */}
        <AnimatePresence>
          {isHovering && (
            <motion.div 
              className="absolute z-30 pointer-events-none flex flex-col items-center justify-center"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
               {/* Reticle */}
               <div className="w-[300px] h-[300px] border border-cyan-500/30 rounded-full flex items-center justify-center">
                  <div className="w-1 h-1 bg-cyan-500 rounded-full shadow-[0_0_10px_cyan]" />
                  <div className="absolute inset-0 border-[0.5px] border-cyan-500/10 rounded-full scale-90" />
               </div>
               
               {/* Floating Technical HUD */}
               <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl min-w-[180px] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                  <span className="text-[10px] font-black text-white uppercase tracking-widest block border-b border-white/10 pb-2 mb-2">
                    {activeProduct?.product?.name || 'Acoustic Sub-System'}
                  </span>
                  <div className="space-y-2">
                    <div className="flex justify-between gap-4">
                      <span className="text-[8px] text-gray-500 uppercase">Driver</span>
                      <span className="text-[8px] font-bold text-cyan-400 capitalize whitespace-nowrap">{activeProduct?.product?.driver_config || 'Planar Magnetic'}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-[8px] text-gray-500 uppercase">Impedance</span>
                      <span className="text-[8px] font-bold text-white whitespace-nowrap">{activeProduct?.product?.specs?.impedance || '16Ω'}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-[8px] text-gray-500 uppercase">Freq Range</span>
                      <span className="text-[8px] font-bold text-white whitespace-nowrap">{activeProduct?.product?.specs?.frequency_response || '20Hz - 40kHz'}</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-white/5 mt-3 flex justify-between">
                    <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">
                      X: {pos.x.toFixed(1)}%
                    </span>
                    <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">
                      Y: {pos.y.toFixed(1)}%
                    </span>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Controls (Only in Admin Mode) */}
        {isEditMode && (
          <div className="absolute -right-24 top-0 z-50 flex flex-col gap-4 bg-black/90 p-6 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl w-64">
             <div className="flex items-center gap-3 text-white mb-4">
                <Sliders size={18} className="text-cyan-500" />
                <span className="text-xs font-black uppercase tracking-widest">Scan Calibration</span>
             </div>

             <div className="space-y-6">
                <div className="space-y-3">
                   <div className="flex justify-between text-[10px] font-bold text-white/40 uppercase">
                      <span>Scanner Radius</span>
                      <span className="text-cyan-500">{radius}PX</span>
                   </div>
                   <input 
                     type="range" min="50" max="400" value={radius} 
                     onChange={(e) => updateDraft('cms.xray.radius', parseInt(e.target.value))}
                     className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                   />
                </div>

                <div className="space-y-3">
                   <div className="flex justify-between text-[10px] font-bold text-white/40 uppercase">
                      <span>Edge Feathering</span>
                      <span className="text-cyan-500">{feather}PX</span>
                   </div>
                   <input 
                     type="range" min="0" max="200" value={feather} 
                     onChange={(e) => updateDraft('cms.xray.feather', parseInt(e.target.value))}
                     className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                   />
                </div>
             </div>
             
             <div className="mt-6 pt-6 border-t border-white/5 space-y-2">
                <p className="text-[8px] text-white/30 font-bold uppercase tracking-widest leading-relaxed">
                   GPU Acceleration is active. Mask-Image rendering offloaded to hardware for 120FPS smoothness.
                </p>
             </div>
          </div>
        )}
      </div>

      {/* Military Grade Bottom HUD */}
      <div className="container mx-auto max-w-6xl mt-12 px-6 flex justify-between items-center opacity-40">
         <div className="flex items-center gap-6">
            <div className="flex flex-col">
               <span className="text-[8px] font-black text-white/60 uppercase tracking-widest">Scanner ID</span>
               <span className="text-[10px] font-black text-cyan-500">KZ-PHANTOM-SCAN-99</span>
            </div>
            <div className="w-[1px] h-6 bg-white/10" />
            <div className="flex flex-col">
               <span className="text-[8px] font-black text-white/60 uppercase tracking-widest">Target Render</span>
               <span className="text-[10px] font-black text-white">{activeProduct?.product?.name || 'SUBSURFACE-4K'}</span>
            </div>
         </div>
         <div className="text-[8px] font-black text-white/30 uppercase tracking-[0.4em]">
           Warning: Authorized Personnel Only
         </div>
      </div>
    </section>
  );
}
