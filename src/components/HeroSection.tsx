"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Award, Zap, Truck } from 'lucide-react';
import SafeImage from './SafeImage';
import Magnetic from './interactive/Magnetic';

const HeroSection = () => {
  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center bg-[#f9f9f9] pt-28 overflow-hidden luxury-grid">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[50vw] h-full bg-white -skew-x-[12deg] translate-x-1/4 border-l border-gray-100 shadow-2xl pointer-events-none" />
      <div className="absolute top-[20%] left-[10%] w-[30vw] h-[30vh] bg-[#0070f3]/5 blur-[120px] pointer-events-none" />

      <div className="linsoul-container relative z-10 w-full py-12 lg:py-0">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-8">
          {/* Text Content */}
          <div className="w-full lg:w-[55%] flex flex-col items-start text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full"
            >
              <div className="flex justify-center lg:justify-start mb-8">
                <span className="badge-premium flex items-center gap-2">
                  <Award size={14} className="text-[#0070f3]" />
                  <span>PREMIUM SERIES</span>
                  <span className="text-gray-300 mx-2">|</span>
                  <span className="text-gray-900 font-bold">KZ PHANTOM</span>
                </span>
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl mb-8 leading-[1.1] tracking-tight font-serif">
                The Purest <br />
                <span className="text-[#0070f3]">Planar</span> Sound.
              </h1>
              
              <p className="text-lg md:text-xl text-gray-500 max-w-xl mb-12 leading-relaxed font-light mx-auto lg:mx-0">
                Experience the next evolution of in-ear monitoring. 
                The KZ Phantom combines ultra-thin planar technology 
                with a handcrafted astronomical design for the elite listener.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6"
            >
              <Magnetic>
                <button className="btn-accent px-12 py-5 text-sm tracking-[0.2em] uppercase flex items-center gap-3 shadow-2xl shadow-blue-500/20 group">
                  Explore Collections
                  <ArrowRight size={18} className="translate-x-0 group-hover:translate-x-1.5 transition-transform duration-500" />
                </button>
              </Magnetic>
              
              <button className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-colors duration-500 flex items-center gap-4 group">
                <div className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center group-hover:border-black transition-all">
                   <div className="w-1.5 h-1.5 bg-black rounded-full" />
                </div>
                View Blueprint
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-20 flex flex-wrap justify-center lg:justify-start items-center gap-12 border-l border-gray-200 pl-10 py-2"
            >
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <Zap size={14} className="text-[#0070f3]" />
                  <span className="text-2xl font-bold text-gray-900 leading-none">35+</span>
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">In-Stock Models</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <Truck size={14} className="text-[#0070f3]" />
                  <span className="text-2xl font-bold text-gray-900 leading-none">FREE</span>
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Global Express</span>
              </div>
            </motion.div>
          </div>

          {/* Product Hero Image */}
          <div className="w-full lg:w-[45%] relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.2, type: 'spring', stiffness: 50 }}
              className="relative w-full max-w-[650px] aspect-square mx-auto flex items-center justify-center p-8 lg:p-0"
            >
              {/* Product floating animation */}
              <motion.div
                animate={{ 
                  y: [0, -18, 0],
                  rotate: [0, 2, 0]
                }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="w-full h-full relative z-20"
              >
                <SafeImage 
                  src="https://kz-audio.com/media/catalog/product/k/z/kzphantom_1_.png"
                  alt="KZ Phantom Planar IEM"
                  className="w-full h-full object-contain filter drop-shadow-[0_35px_60px_rgba(0,0,0,0.15)]"
                />
              </motion.div>

              {/* Ambient Shadow behind image */}
              <div className="absolute inset-20 bg-[#0070f3]/5 blur-[100px] rounded-full z-10" />

              {/* Specs Bubble Overlay */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
                className="absolute top-1/4 -right-2 luxury-card p-6 shadow-2xl flex flex-col gap-1 hidden md:flex min-w-[180px]"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-[#0070f3] rounded-full animate-pulse" />
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em]">Core Spec</span>
                </div>
                <span className="text-xl font-bold text-gray-900 border-b border-gray-50 pb-2 mb-2 tracking-tight font-serif">Planar Driver</span>
                <span className="text-[10px] text-gray-500 font-medium tracking-wide uppercase">13.2mm Nano-composite</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 hidden lg:flex"
      >
        <span className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.4em] rotate-90 mb-8 mt-[-20px]">Explore</span>
        <div className="w-px h-16 bg-gradient-to-b from-gray-200 to-transparent" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
