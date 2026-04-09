"use client";

import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface XRaySpotlightProps {
  primaryImage: string;
  internalImage: string;
  glowColor: string;
}

const XRaySpotlight: React.FC<XRaySpotlightProps> = ({ primaryImage, internalImage, glowColor }) => {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Motion values for smooth tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Sprung motion values for 'lagging' high-tech feel
  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full aspect-square max-w-[800px] cursor-none select-none rounded-[60px] overflow-hidden bg-black/40 border border-white/5 group"
    >
      {/* 1. Underlying Internal Layer (Blueprint) */}
      <div className="absolute inset-0 z-0 p-12">
        {internalImage ? (
          <img 
            src={internalImage} 
            alt="Internal Engineering" 
            className="w-full h-full object-contain filter brightness-50 opacity-100 transition-opacity grayscale" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/5 italic text-sm">
             Engineering Blueprint Not Found
          </div>
        )}
      </div>

      {/* 2. Top Primary Layer (Revealed Area) */}
      <motion.div 
        className="absolute inset-0 z-10 p-12 overflow-hidden pointer-events-none"
        style={{
          clipPath: isHovered 
            ? `circle(120px at var(--x) var(--y))` 
            : `circle(0px at 50% 50%)`,
          '--x': springX,
          '--y': springY,
        } as any}
      >
        <img 
          src={primaryImage} 
          alt="Primary Render" 
          className="w-full h-full object-contain filter drop-shadow-2xl" 
        />
      </motion.div>

      {/* 3. Static Dimmed Primary Layer (Background) */}
      <div className="absolute inset-0 z-5 p-12 pointer-events-none opacity-30 grayscale saturate-0">
        <img 
          src={primaryImage} 
          alt="Dimmed Primary" 
          className="w-full h-full object-contain" 
        />
      </div>

      {/* 4. High-Tech Cursor UI */}
      <motion.div
        className="absolute z-30 pointer-events-none flex items-center justify-center"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: isHovered ? 1 : 0
        }}
      >
        {/* Spotlight Ring */}
        <div 
          className="w-[240px] h-[240px] rounded-full border-2 border-white/20 relative flex items-center justify-center animate-pulse-slow"
          style={{ borderColor: `${glowColor}44` }}
        >
           <div className="absolute inset-0 rounded-full blur-2xl opacity-20" style={{ backgroundColor: glowColor }} />
           
           {/* Crosshair UI */}
           <div className="w-4 h-[1px] bg-white/40 absolute left-[-10px]" />
           <div className="w-4 h-[1px] bg-white/40 absolute right-[-10px]" />
           <div className="h-4 w-[1px] bg-white/40 absolute top-[-10px]" />
           <div className="h-4 w-[1px] bg-white/40 absolute bottom-[-10px]" />

           {/* Tech Data Overlay */}
           <div className="absolute top-[110%] left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
              <span className="text-[8px] font-black uppercase text-white/50 tracking-widest font-mono">
                X-RAY SCANNER ACTIVE // {Math.round(springX.get())}:{Math.round(springY.get())}
              </span>
           </div>
        </div>
      </motion.div>

      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.02); opacity: 1; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default XRaySpotlight;
