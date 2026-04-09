"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, CreditCard, ChevronRight, Share2, Heart } from 'lucide-react';
import XRaySpotlight from './XRaySpotlight';
import TechnicalDossier from './TechnicalDossier';

interface ProductPageContentProps {
  product: any;
}

const ProductPageContent: React.FC<ProductPageContentProps> = ({ product }) => {
  const glowColor = product.glow_color || '#0070f3';
  const [activeImage, setActiveImage] = React.useState(product.slider_image || product.images.product);

  return (
    <div className="relative pt-32 pb-32 overflow-hidden bg-[#050505]">
      {/* 1. Dynamic Atmospheric Glow System */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div 
           className="absolute top-[-20%] right-[-10%] w-[70vw] h-[70vw] rounded-full blur-[160px] opacity-20 transition-all duration-1000"
           style={{ backgroundColor: glowColor }} 
         />
         <div 
           className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[140px] opacity-10 transition-all duration-1000"
           style={{ backgroundColor: glowColor, animationDelay: '1s' }} 
         />
         <div className="absolute inset-0 bg-[#050505]/40" />
      </div>

      <div className="linsoul-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          
          {/* Left Side: X-Ray Scanner & Gallery */}
          <div className="sticky top-32 space-y-12">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: 'easeOut' }}
            >
              <XRaySpotlight 
                primaryImage={activeImage} 
                internalImage={product.images.internal} 
                glowColor={glowColor}
              />
            </motion.div>

            {/* Gallery Strip */}
            {product.gallery && product.gallery.length > 0 && (
              <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                {/* Add primary image to gallery if not there, or just show gallery */}
                {[product.slider_image || product.images.product, ...product.gallery.filter((g: string) => g !== (product.slider_image || product.images.product))].map((img: string, idx: number) => (
                  <div 
                    key={idx} 
                    onClick={() => setActiveImage(img)}
                    className={`w-24 h-24 rounded-2xl bg-white/5 border transition-all flex-shrink-0 group overflow-hidden cursor-pointer ${activeImage === img ? 'border-blue-500 scale-105 shadow-lg' : 'border-white/10 opacity-60 hover:opacity-100 hover:border-white/30'}`}
                    style={{ borderColor: activeImage === img ? glowColor : '' }}
                  >
                     <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Side: Engineering Dossier & Purchase */}
          <div className="space-y-16">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex items-center gap-4 mb-6">
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">ID: {product.id} // CATALOG RECORD</span>
                 <div className="h-[1px] flex-1 bg-white/5" />
                 <div className="flex gap-4">
                    <button className="text-gray-500 hover:text-white transition-colors"><Heart size={16} /></button>
                    <button className="text-gray-500 hover:text-white transition-colors"><Share2 size={16} /></button>
                 </div>
              </div>

              <h1 className="text-6xl md:text-8xl font-serif font-black text-white leading-none tracking-tighter mb-4">
                {product.name}
              </h1>
              <p className="text-2xl md:text-3xl font-bold tracking-tight mb-8" style={{ color: glowColor }}>
                {product.slider_headline || product.headline}
              </p>

              <div className="flex items-center gap-6 mb-12 flex-wrap">
                 {product.local_price && (
                   <div className="flex flex-col">
                     <span className="text-[9px] text-[#ffd700]/60 font-black uppercase tracking-widest mb-1">⚡ Local</span>
                     <div className="text-4xl font-black text-[#ffd700]">${product.local_price}</div>
                   </div>
                 )}
                 {product.global_price && product.aliexpress_link && (
                   <div className="flex flex-col">
                     <span className="text-[9px] text-cyan-400/60 font-black uppercase tracking-widest mb-1">🌐 Global</span>
                     <div className="text-4xl font-black text-cyan-400">${product.global_price}</div>
                   </div>
                 )}
                 {!product.local_price && !product.aliexpress_link && (
                   <div className="text-4xl font-black text-white">Priceless</div>
                 )}
                 <div className="px-4 py-1.5 bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-black uppercase tracking-widest rounded-full">Engineering Optimized</div>
              </div>

              <div className="space-y-6 text-gray-400 text-lg leading-relaxed font-normal max-w-xl">
                 <p>{product.description}</p>
                 <div className="p-6 bg-white/[0.03] border border-white/10 rounded-[32px]">
                    <div className="text-[10px] font-black uppercase tracking-widest mb-2 text-gray-400 italic">Chief Engineer's Note</div>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {product.chief_note || `The acoustic architecture of the ${product.name} represents a milestone in planar discovery, merging high-resolution sensitivity with a balanced signature that defies traditional driver logic.`}
                    </p>
                 </div>
              </div>
            </motion.div>

            {/* Quick Specs Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <TechnicalDossier 
                specs={product.specs} 
                driverConfig={product.driver_config} 
                glowColor={glowColor}
              />
            </motion.div>

            {/* CTA Strategy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 pt-12 border-t border-white/5"
            >
              <button className="flex-1 group relative px-12 py-6 bg-white rounded-full text-[11px] font-black uppercase tracking-[0.4em] overflow-hidden transition-all duration-500 hover:scale-[1.02] active:scale-95 shadow-2xl shadow-white/5">
                 <span className="relative z-10 text-black flex items-center justify-center gap-3">
                   <ShoppingBag size={16} /> Deploy to Cart
                 </span>
                 <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500" style={{ backgroundColor: `${glowColor}` }} />
              </button>

              <button 
                className="flex-1 group relative px-12 py-6 rounded-full text-[11px] font-black uppercase tracking-[0.4em] border border-white/10 overflow-hidden transition-all duration-500 hover:border-white/30 animate-pulse-glow"
                style={{ '--glow-color': `${glowColor}66` } as any}
              >
                 <span className="relative z-10 text-white flex items-center justify-center gap-3">
                   <CreditCard size={16} /> Direct Acquisition
                 </span>
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 10px var(--glow-color); }
          50% { box-shadow: 0 0 30px var(--glow-color); }
        }
        .animate-pulse-glow {
          animation: pulse-glow 3s infinite ease-in-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default ProductPageContent;
