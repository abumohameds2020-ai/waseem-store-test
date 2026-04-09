"use client";

import React from 'react';
import { motion } from 'framer-motion';

const BrandScroller = () => {
  const brands = [
    { name: 'KZ Audio', logo: 'KZ' },
    { name: 'THIEAUDIO', logo: 'THIEAUDIO' },
    { name: 'Kiwi Ears', logo: 'KIWI EARS' },
    { name: 'Tripowin', logo: 'TRIPOWIN' },
    { name: 'Linsoul', logo: 'LINSOUL' },
    { name: '7Hz', logo: '7Hz' },
    { name: 'BLON', logo: 'BLON' },
  ];

  return (
    <section id="brands" className="py-12 bg-gray-50 border-y border-gray-100 overflow-hidden">
      <div className="linsoul-container">
        <div className="flex flex-col items-center mb-8">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 mb-2">Our Authorized Partners</span>
          <div className="w-12 h-[1px] bg-gray-200"></div>
        </div>
        
        <div className="relative flex overflow-x-hidden">
          <div className="py-2 animate-marquee whitespace-nowrap flex items-center gap-16 md:gap-32">
            {[...brands, ...brands].map((brand, i) => (
              <span 
                key={i} 
                className="text-2xl md:text-3xl font-black text-gray-200 hover:text-black transition-colors cursor-default select-none tracking-tighter"
              >
                {brand.logo}
              </span>
            ))}
          </div>

          <div className="absolute top-0 py-2 animate-marquee2 whitespace-nowrap flex items-center gap-16 md:gap-32">
             {[...brands, ...brands].map((brand, i) => (
              <span 
                key={i} 
                className="text-2xl md:text-3xl font-black text-gray-200 hover:text-black transition-colors cursor-default select-none tracking-tighter"
              >
                {brand.logo}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee2 {
          0% { transform: translateX(50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee2 {
          animation: marquee 40s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default BrandScroller;
