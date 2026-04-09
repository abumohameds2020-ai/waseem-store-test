"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Scale, Zap, Waves, Activity, Volume2, MoveHorizontal } from "lucide-react";
import { useCompare } from "../../context/CompareContext";
import SafeImage from "../SafeImage";

const getQualitativeDiff = (p1: any, p2: any) => {
  const c1 = p1.category.toLowerCase();
  const c2 = p2.category.toLowerCase();

  if (c1.includes("planar") && c2.includes("dynamic")) {
    return {
      title: "Speed vs Impact",
      description: `The ${p1.name}'s planar technology offers surgical transient speed and micro-detail, while the ${p2.name}'s dynamic driver provides a more physical, visceral bass impact.`,
      metrics: [
        { label: "Transient Speed", v1: 95, v2: 70 },
        { label: "Bass Depth", v1: 75, v2: 90 },
        { label: "Technicality", v1: 98, v2: 75 }
      ]
    };
  }
  
  if (c1.includes("planar") && c2.includes("hybrid")) {
    return {
      title: "Coherency vs Multi-Texture",
      description: `The ${p1.name} provides a seamless, uniform frequency response. The ${p2.name} offers a more 'flavored' experience with specialized drivers for different regions.`,
      metrics: [
        { label: "Spectral Cohesion", v1: 100, v2: 80 },
        { label: "Midrange Detail", v1: 95, v2: 90 },
        { label: "Excitement", v1: 85, v2: 95 }
      ]
    };
  }

  // Default
  return {
    title: "Signature Comparison",
    description: `Comparing the ${p1.name} and ${p2.name} reveals two distinct approaches to high-fidelity sound. ${p1.name} focuses on ${p1.signature.toLowerCase()} while ${p2.name} is tuned for ${p2.signature.toLowerCase()}.`,
    metrics: [
        { label: "Clarity", v1: 85, v2: 85 },
        { label: "Soundstage", v1: 80, v2: 85 },
        { label: "Energy", v1: 90, v2: 80 }
      ]
  };
};

export const ComparisonDrawer = () => {
  const { selectedProducts, clearCompare, isCompareOpen, setIsCompareOpen } = useCompare();

  if (selectedProducts.length < 2) return null;

  const [p1, p2] = selectedProducts;
  const analysis = getQualitativeDiff(p1, p2);

  return (
    <AnimatePresence>
      {isCompareOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={clearCompare}
            className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[150]"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 h-[85vh] bg-white rounded-t-[40px] z-[200] overflow-hidden flex flex-col p-8 md:p-16"
          >
            <div className="flex justify-between items-center mb-12">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-[#0070f3] text-white rounded-2xl flex items-center justify-center shadow-2xl">
                    <Scale size={24} />
                 </div>
                 <h2 className="text-3xl font-serif font-bold text-gray-900 tracking-tighter">AI Comparison Engine</h2>
              </div>
              <button onClick={() => setIsCompareOpen(false)} className="p-4 hover:bg-gray-50 rounded-full transition-colors border border-gray-100">
                <X size={24} className="text-gray-400 hover:text-black" />
              </button>
            </div>

            <div className="grid md:grid-cols-[1fr_300px_1fr] gap-12 flex-1 overflow-y-auto linsoul-container pb-12">
              {/* Product 1 */}
              <div className="space-y-8">
                <div className="aspect-square bg-gray-50 rounded-3xl p-12 border border-gray-100 relative group overflow-hidden">
                   <SafeImage src={p1.images.product} alt={p1.name} className="w-full h-full object-contain filter group-hover:scale-110 transition-transform duration-700" />
                   <div className="absolute top-6 left-6 badge-pick">{p1.category}</div>
                </div>
                <div>
                  <h3 className="text-4xl font-serif font-black text-gray-900 tracking-tighter mb-2">{p1.name}</h3>
                  <span className="text-[#0070f3] text-xs font-bold tracking-[0.4em] uppercase">{p1.signature} Tuned</span>
                </div>
              </div>

              {/* Central Analysis */}
              <div className="flex flex-col items-center justify-center text-center py-12 px-6 bg-[#0070f3]/5 rounded-3xl border border-[#0070f3]/10 relative">
                <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 w-20 h-20 bg-white border border-[#0070f3]/20 rounded-full flex items-center justify-center shadow-2xl">
                    <Zap className="text-[#0070f3]" />
                </div>
                <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Technical Duel</h4>
                <h5 className="text-xl font-serif font-bold text-gray-900 mb-6">{analysis.title}</h5>
                <p className="text-gray-500 text-sm leading-relaxed mb-8 font-medium">{analysis.description}</p>
                
                <div className="space-y-6 w-full">
                  {analysis.metrics.map((m, i) => (
                    <div key={i} className="space-y-2">
                       <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                          <span>{m.label}</span>
                       </div>
                       <div className="relative h-1 w-full bg-gray-100 rounded-full overflow-hidden flex">
                          <div className="h-full bg-black/40" style={{ width: `${m.v1}%` }} />
                          <div className="h-full bg-[#0070f3]" style={{ width: `${m.v2}%` }} />
                       </div>
                    </div>
                  ))}
                  <div className="flex justify-center gap-4 mt-6">
                     <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-black/40 rounded-full" />
                        <span className="text-[10px] font-bold text-gray-400">A</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#0070f3] rounded-full" />
                        <span className="text-[10px] font-bold text-gray-400">B</span>
                     </div>
                  </div>
                </div>
              </div>

              {/* Product 2 */}
              <div className="space-y-8 text-right">
                <div className="aspect-square bg-gray-50 rounded-3xl p-12 border border-gray-100 relative group overflow-hidden">
                   <SafeImage src={p2.images.product} alt={p2.name} className="w-full h-full object-contain filter group-hover:scale-110 transition-transform duration-700" />
                   <div className="absolute top-6 right-6 badge-pick">{p2.category}</div>
                </div>
                <div>
                  <h3 className="text-4xl font-serif font-black text-gray-900 tracking-tighter mb-2">{p2.name}</h3>
                  <span className="text-[#0070f3] text-xs font-bold tracking-[0.4em] uppercase">{p2.signature} Tuned</span>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-100 flex items-center justify-between">
               <div className="flex items-center gap-3 text-gray-400">
                  <Activity size={16} />
                  <span className="text-[10px] font-bold tracking-widest">REAL-TIME SPECTROGRAM ACTIVE</span>
               </div>
               <button onClick={clearCompare} className="text-[10px] font-black tracking-widest text-[#0070f3] uppercase border-b-2 border-transparent hover:border-[#0070f3] transition-all">Clear All and Reset</button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ComparisonDrawer;
