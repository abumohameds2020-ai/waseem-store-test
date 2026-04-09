"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ChevronLeft, ChevronRight, View, ShoppingBag } from 'lucide-react';
import SafeImage from './SafeImage';
import EditableText from './EditableText';

interface HeroSliderProps {
  sliderConfig: any;
  products: any[];
}

export default function HeroSlider({ sliderConfig, products }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);

  const slides = sliderConfig?.slides?.filter((s:any) => s.id) || [];
  const AUTO_PLAY_INTERVAL = 5000;
  const RESUME_DELAY = 10000;

  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      handleNext();
    }, AUTO_PLAY_INTERVAL);

    return () => clearInterval(timer);
  }, [current, slides.length, isPaused]);

  const handleNext = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const manualNavigate = (dir: number) => {
    // Stop autoplay
    setIsPaused(true);
    if (dir > 0) handleNext();
    else handlePrev();

    // Reset inactivity timer
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => {
      setIsPaused(false);
    }, RESUME_DELAY);
  };

  const jumpToSlide = (idx: number) => {
    setIsPaused(true);
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);

    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => {
      setIsPaused(false);
    }, RESUME_DELAY);
  };

  if (slides.length === 0) return null;

  const slide = slides[current];
  const product = products.find(p => p.id === slide?.id) || {};
  const glowColor = slide?.color || product.glow_color || '#0070f3';
  const headline = slide?.headline || product.headline || 'The Ultimate Experience';


  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 500 : -500, opacity: 0, filter: 'blur(10px)' }),
    center: { x: 0, opacity: 1, filter: 'blur(0px)' },
    exit: (dir: number) => ({ x: dir < 0 ? 500 : -500, opacity: 0, filter: 'blur(10px)' })
  };

  return (
    <div className="relative w-full h-[85vh] lg:h-screen bg-[#030303] overflow-hidden flex items-center justify-center">
      
      {/* Dynamic Background Glow */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 70% 50%, ${glowColor}40 0%, transparent 60%)`
          }}
        />
      </AnimatePresence>

      <div className="container mx-auto px-6 lg:px-20 relative z-10 w-full h-full flex items-center">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            {/* Typography Section */}
            <div className="space-y-8 pl-4 lg:pl-10">
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                <div 
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6 backdrop-blur-md"
                  style={{ borderColor: `${glowColor}40`, backgroundColor: `${glowColor}10` }}
                >
                  <Zap size={14} style={{ color: glowColor }} className="animate-pulse" />
                  <span className="text-[10px] font-black tracking-[0.3em] uppercase text-white">Featured Hardware</span>
                </div>
                
                <h1 className="text-6xl lg:text-9xl font-black tracking-tighter leading-[0.85] text-white uppercase italic">
                  <EditableText value={product.name || 'UNKNOWN'} path={`products.${products.indexOf(product)}.name`} />
                </h1>
                
                <h2 className="text-xl lg:text-3xl font-bold mt-8 text-gray-400 uppercase tracking-tight">
                  <EditableText value={headline} path={`slider.slides.${sliderConfig?.slides?.indexOf(slide)}.headline`} />
                </h2>
                
                <div className="text-sm lg:text-base text-gray-500 mt-8 max-w-md leading-relaxed uppercase tracking-widest font-medium">
                  <EditableText value={product.description?.substring(0, 120) + "..." || ""} path={`products.${products.indexOf(product)}.description`} multiline />
                </div>
              </motion.div>

              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="flex flex-col gap-6 pt-10">
                <div className="flex items-center gap-6">
                  {/* DEPLOY ASSET — opens ProductModal */}
                  <button 
                    onClick={() => window.dispatchEvent(new CustomEvent('kz-open-product', { detail: product }))}
                    className="group relative px-10 py-6 rounded-[32px] overflow-hidden flex items-center gap-4 transition-all hover:scale-105 active:scale-95"
                    style={{ backgroundColor: glowColor, boxShadow: `0 25px 50px -12px ${glowColor}60` }}
                  >
                    <span className="relative z-10 font-black uppercase tracking-widest text-xs">
                      <EditableText value={sliderConfig?.global?.deployBtn || "Deploy Asset"} path="slider.global.deployBtn" />
                    </span>
                    <ShoppingBag size={18} className="relative z-10 text-black" />
                  </button>

                  {/* VIEW X-RAY — cinematic anchor scroll & content lock */}
                  <button 
                    onClick={() => {
                      // Lock visual content to this exact slide
                      if (slide) {
                        window.dispatchEvent(new CustomEvent('kz-inspect-xray', { detail: { slide, product } }));
                      }
                      // Initial scroll execution
                      const el = document.getElementById('xray-scanner');
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className="px-10 py-6 rounded-[32px] border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-xl flex items-center gap-4 transition-all text-white group"
                  >
                    <span className="text-xs font-black uppercase tracking-widest">
                      <EditableText value={sliderConfig?.global?.xrayBtn || "View X-Ray"} path="slider.global.xrayBtn" />
                    </span>
                    <View size={18} className="group-hover:rotate-12 transition-transform" />
                  </button>
                </div>

                {/* Shipping time indicators */}
                <div className="flex items-center gap-8 pl-1">
                  {product.local_stock && product.local_shipping_time && (
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-[#ffd700] rounded-full" />
                      <span className="text-[9px] font-black text-[#ffd700]/70 uppercase tracking-widest">
                        ⚡ Local: <EditableText value={product.local_shipping_time || ""} path={`products.${products.indexOf(product)}.local_shipping_time`} />
                      </span>
                    </div>
                  )}
                  {product.aliexpress_link && product.global_shipping_time && (
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                      <span className="text-[9px] font-black text-cyan-400/70 uppercase tracking-widest">
                        🌐 Global: <EditableText value={product.global_shipping_time || ""} path={`products.${products.indexOf(product)}.global_shipping_time`} />
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Visual Section */}
            <div className="relative flex justify-center items-center h-[50vh] lg:h-[70vh] pointer-events-none">
              <div className="absolute inset-0 rounded-full blur-[120px] opacity-20" style={{ backgroundColor: glowColor }} />
              <SafeImage 
                src={slide.image || product.images?.product || ''}
                alt={product.name}
                className="w-full h-full object-contain filter drop-shadow-[0_0_80px_rgba(0,0,0,0.5)] transform scale-110"
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Cinematic Navigation */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex items-center gap-12">
        <button onClick={() => manualNavigate(-1)} className="text-white/30 hover:text-white transition-colors"><ChevronLeft size={32} /></button>
        
        <div className="flex items-center gap-4">
          {slides.map((_: any, idx: number) => (
            <button 
              key={idx}
              onClick={() => jumpToSlide(idx)}
              className={`relative h-1.5 rounded-full overflow-hidden transition-all duration-500 ${idx === current ? 'w-16 bg-white/10' : 'w-4 bg-white/20'}`}
            >
              {idx === current && !isPaused && (
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: AUTO_PLAY_INTERVAL / 1000, ease: "linear" }}
                  className="absolute inset-0 h-full"
                  style={{ backgroundColor: glowColor }}
                />
              )}
              {idx === current && isPaused && (
                <div className="absolute inset-0 h-full bg-white" />
              )}
            </button>
          ))}
        </div>

        <button onClick={() => manualNavigate(1)} className="text-white/30 hover:text-white transition-colors"><ChevronRight size={32} /></button>
      </div>
    </div>
  );
}
