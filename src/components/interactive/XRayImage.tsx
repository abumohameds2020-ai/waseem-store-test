"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SafeImage from "../SafeImage";

interface XRayImageProps {
  primarySrc: string;
  internalSrc: string;
  alt: string;
  className?: string;
}

/**
 * XRayImage Component - HIGH STABILITY VERSION
 * 
 * Logic:
 * 1. Bottom Layer (HTML <img>): The Technical/Internal View (internalSrc).
 * 2. Top Layer (HTML5 Canvas): The Normal Exterior View (primarySrc).
 * 3. Interaction: Scratching the Canvas erases the top layer to reveal the bottom.
 * 
 * Visibility Rule: User MUST see normal product on load.
 */
export const XRayImage = ({ primarySrc, internalSrc, alt, className }: XRayImageProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Track states for initialization
  const [isInitialized, setIsInitialized] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Ref to store the loaded HTMLImageElement for the canvas
  const primaryImgRef = useRef<HTMLImageElement | null>(null);

  // 1. Initial Load & Drawing Logic
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = primaryImgRef.current;
    
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    // Get exact pixel dimensions
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    // High DPI / Retina Calibration
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    // Scale context to use CSS pixels
    ctx.scale(dpr, dpr);
    
    // Paint the Normal Exterior view on the canvas (Top Layer)
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.drawImage(img, 0, 0, rect.width, rect.height);
    
    // Set initialized to true only AFTER the draw call is complete
    setIsInitialized(true);
  }, []);

  // Use Effect to handle image loading or source changes
  useEffect(() => {
    setIsInitialized(false); // Reset on source change
    
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = primarySrc;
    
    img.onload = () => {
      primaryImgRef.current = img;
      // Wait for next tick to ensure canvas ref is updated and layout is stable
      setTimeout(setupCanvas, 50);
    };

    img.onerror = () => {
      console.warn("XRay primary image failed, using fallback:", primarySrc);
      // Fallback to a high-quality stable placeholder if the official link is down
      img.src = `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop`;
    };

    window.addEventListener("resize", setupCanvas);
    return () => window.removeEventListener("resize", setupCanvas);
  }, [primarySrc, setupCanvas]);

  // 2. Scratching Logic
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isInitialized || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Erase the Top Layer (Canvas) to reveal the Bottom Layer (CSS Image)
    ctx.globalCompositeOperation = "destination-out";
    
    const brushSize = 60;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, brushSize);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.4)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, brushSize, 0, Math.PI * 2);
    ctx.fill();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Reset the "scratch" surface by re-doing the initial setup
    setupCanvas();
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    // Re-sync just in case layout changed
    setupCanvas();
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full aspect-square overflow-hidden rounded-2xl bg-white select-none ${className}`}
    >
      {/* 🟢 STEP 1: THE BOTTOM LAYER (Internal X-Ray View)
          We only show this if the initialization is done, but the canvas 
          is rendered on TOP of it, effectively hiding it.
      */}
      <div className="absolute inset-0 z-0">
        <SafeImage
          src={internalSrc}
          alt={`${alt} Internal Components`}
          // Styled with classic X-Ray blue tint and high contrast
          className="w-full h-full object-contain filter invert hue-rotate-180 brightness-110 contrast-125 opacity-100 scale-95"
          fallbackSrc="https://placehold.co/600x600/0070f3/ffffff?text=X-RAY+COMPONENT+SCAN"
        />
      </div>
      
      {/* 🔴 STEP 2: THE TOP LAYER (Opaque Normal Canvas)
          This canvas MUST render the primaryExteriorImage.
          We keep it hidden (opacity 0) until setupCanvas() confirms it is painted.
      */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 w-full h-full object-contain cursor-crosshair"
        style={{ 
          opacity: isInitialized ? 1 : 0,
          transition: "opacity 0.3s ease-in-out"
        }}
      />

      {/* 🔵 STEP 3: INTERACTIVE HUD
          Floating data points that react to the hover state.
      */}
      <AnimatePresence>
        {isHovered && isInitialized && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="absolute top-6 left-6 z-20 pointer-events-none"
          >
            <div className="bg-black text-white px-4 py-2 rounded-lg border border-[#0070f3]/40 backdrop-blur-xl shadow-2xl">
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#0070f3] rounded-full animate-ping" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Core Analysis Active</span>
               </div>
               <div className="mt-1 text-[7px] text-gray-400 font-bold uppercase tracking-widest pl-5">
                  Structural Scan: {alt.split(' ')[0]} PRO Series
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Placeholder to hide the internals while the canvas is painting */}
      {!isInitialized && (
        <div className="absolute inset-0 z-[100] bg-white flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gray-100 border-t-[#0070f3] rounded-full animate-spin" />
        </div>
      )}

      {/* Subtle Grid Interaction Layer */}
      <div className="absolute inset-0 z-[5] pointer-events-none opacity-[0.05] bg-[radial-gradient(#0070f3_1px,transparent_1px)] bg-[size:24px_24px]" />
    </div>
  );
};

export default XRayImage;
