"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useVelocity, useSpring, useMotionValue, useAnimationFrame } from 'framer-motion';
import SafeImage from './SafeImage';
import EditableText from './EditableText';
import EditableImage from './EditableImage';

export default function ParallaxEngineering() {
  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });

  const rotationAngle = useMotionValue(0);

  useAnimationFrame((t, delta) => {
    let moveBy = 0.5; // Base slow rotation
    moveBy += smoothVelocity.get() * 0.05; // React to scroll
    rotationAngle.set(rotationAngle.get() + moveBy * (delta / 16));
  });

  const rotateContainer = useTransform(rotationAngle, v => `${v}deg`);
  const counterRotate = useTransform(rotationAngle, v => `${-v}deg`);

  // Pulsation syncing with rotation
  const pulse = useTransform(rotationAngle, v => (Math.sin((v * Math.PI) / 90) + 1) / 2 * 0.6 + 0.1);

  // Cinematic dynamic lighting / shadow shifting
  const shadow1 = useTransform(rotationAngle, v => {
     const rad = (v * Math.PI) / 180;
     const h = Math.cos(rad) * 40;
     const vOffset = Math.sin(rad) * 40;
     return `drop-shadow(${h}px ${vOffset}px 25px rgba(6,182,212,0.6)) brightness(${1 + Math.sin(rad) * 0.3})`;
  });

  const shadow2 = useTransform(rotationAngle, v => {
     const rad = ((v + 180) * Math.PI) / 180;
     const h = Math.cos(rad) * 50;
     const vOffset = Math.sin(rad) * 50;
     return `drop-shadow(${h}px ${vOffset}px 30px rgba(200,200,200,0.3)) grayscale(${80 + Math.sin(rad) * 20}%) brightness(${0.8 - Math.sin(rad) * 0.2})`;
  });

  return (
    <section ref={containerRef} className="relative py-60 bg-[#030303] overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        
        <div className="relative order-2 lg:order-1 h-[600px] flex items-center justify-center">
           
           {/* Deep Space Pulsating Core */}
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
              <motion.div style={{ opacity: pulse, scale: useTransform(pulse, p => 0.9 + p * 0.2) }} className="absolute w-[550px] h-[550px] rounded-full border border-cyan-500/20 shadow-[0_0_100px_rgba(6,182,212,0.15)]" />
              <motion.div style={{ opacity: useTransform(pulse, p => p * 0.7) }} className="absolute w-[350px] h-[350px] rounded-full border-[2px] border-dashed border-white/10" />
              <motion.div style={{ opacity: pulse }} className="absolute w-[150px] h-[150px] rounded-full bg-cyan-500/5 blur-xl" />
           </div>

           {/* Orbiting Plane */}
           <motion.div style={{ rotate: rotateContainer }} className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
             
             {/* Orbital Body 1 (Top Left) */}
             <div className="absolute -translate-y-[220px] -translate-x-[120px]">
               <motion.div style={{ rotate: counterRotate, filter: shadow1 }} className="w-56 h-56 transition-all duration-300">
                 <EditableImage src="/assets/planar_core.png" path="cms.parallax.image_1" alt="Driver" className="w-full h-full object-contain" />
               </motion.div>
             </div>

             {/* Orbital Body 2 (Bottom Right) */}
             <div className="absolute translate-y-[180px] translate-x-[150px]">
               <motion.div style={{ rotate: counterRotate, filter: shadow2 }} className="w-80 h-80 transition-all duration-300">
                 <EditableImage src="/assets/exploded_iem.png" path="cms.parallax.image_2" alt="Shell" className="w-full h-full object-contain" />
               </motion.div>
             </div>

           </motion.div>
        </div>

        <div className="order-1 lg:order-2 space-y-10">
           <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.6em] mb-4 block">
             <EditableText value="Deconstructed Precision" path="cms.parallax.label" />
           </span>
           <h2 className="text-6xl lg:text-9xl font-black text-white uppercase tracking-tighter leading-[0.85]">
             <EditableText value="The Soul of" path="cms.parallax.title_1" tagName="span" /> <br />
             <span className="text-gray-500 italic">
               <EditableText value="Engineering" path="cms.parallax.title_2" tagName="span" />
             </span>
           </h2>
           <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-xl uppercase tracking-widest">
             <EditableText 
               value="Observe the microscopic tolerances and exotic alloy integration that give every KZ Phantom its distinctive acoustic signature." 
               path="cms.parallax.desc" 
               multiline
               tagName="span"
             />
           </p>
           
           <div className="grid grid-cols-3 gap-8 pt-12">
              {[
                { label: 'Tolerances', val: '0.01mm' },
                { label: 'Density', val: 'High' },
                { label: 'Resonance', val: 'Zero' }
              ].map(stat => (
                <div key={stat.label} className="space-y-2">
                   <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{stat.label}</p>
                   <p className="text-2xl font-black text-white uppercase tracking-tighter">{stat.val}</p>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Background Text Decor */}
      <h2 className="absolute -bottom-20 -left-20 text-[300px] font-black text-white/[0.02] select-none pointer-events-none uppercase tracking-tighter italic">
        PRECISION
      </h2>
    </section>
  );
}
