"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, X, ChevronRight, Zap } from 'lucide-react';
import Link from 'next/link';
import SafeImage from './SafeImage';

export default function QuickArsenal({ products }: { products: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const topFlagships = products.slice(0, 5);

  return (
    <>
      <div className="fixed bottom-10 right-10 z-[100]">
         <motion.button
           whileHover={{ scale: 1.1 }}
           whileTap={{ scale: 0.9 }}
           onClick={() => setIsOpen(true)}
           className="w-20 h-20 rounded-full bg-cyan-500 text-black flex items-center justify-center shadow-[0_20px_50px_rgba(6,182,212,0.4)] relative"
         >
            <Target size={32} />
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center text-[10px] font-black border-4 border-black">
              5
            </span>
         </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[110]"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-[#080808] border-l border-white/5 z-[120] p-12 overflow-y-auto"
            >
               <div className="flex items-center justify-between mb-12">
                  <div className="flex items-center gap-4">
                     <Zap className="text-cyan-500" />
                     <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Quick Arsenal</h3>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white transition-colors">
                     <X size={24} />
                  </button>
               </div>

               <div className="space-y-6">
                  {topFlagships.map((p, i) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="group p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-all cursor-pointer flex items-center gap-6"
                    >
                       <div className="w-20 h-20 rounded-2xl bg-black overflow-hidden border border-white/10 group-hover:border-cyan-500/50 transition-all">
                          <SafeImage src={p.images?.product} className="w-full h-full object-cover p-2" />
                       </div>
                       <div className="flex-1">
                          <h4 className="text-lg font-black text-white uppercase tracking-tight">{p.name}</h4>
                          <p className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">{p.category}</p>
                           <div className="flex items-center gap-2 mt-1 flex-wrap">
                             {p.local_price && <span className="text-[10px] font-black text-[#ffd700]">⚡ ${p.local_price}</span>}
                             {p.aliexpress_link && p.global_price && <span className="text-[10px] font-black text-cyan-400">🌐 ${p.global_price}</span>}
                           </div>
                       </div>
                       <ChevronRight className="text-white/20 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all" />
                    </motion.div>
                  ))}
               </div>

               <Link href="/shop" className="block w-full mt-12">
                 <button className="w-full py-6 rounded-3xl bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-cyan-500 transition-colors">
                   View Full Armory
                 </button>
               </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
