"use client";

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Zap, Activity } from 'lucide-react';
import SafeImage from './SafeImage';
import XRayImage from './interactive/XRayImage';
import EditableText from './EditableText';
import { useVisualEditor } from '@/context/VisualEditorContext';

const TechVisualizer = ({ label, value, max, icon: Icon }: { label: string, value: string, max: number, icon: any }) => {
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
  const percentage = Math.min((numericValue / max) * 100, 100);

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <h4 className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold flex items-center gap-2">
          <Icon size={12} className="text-[#00e5ff]" /> {label}
        </h4>
        <span className="text-xs font-mono font-bold text-gray-900">{value}</span>
      </div>
      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden relative">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-y-0 left-0 bg-[#00e5ff] shadow-[0_0_10px_#00e5ff]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] animate-shimmer" />
      </div>
    </div>
  );
};

import { useCart } from '@/context/CartContext';

interface Product {
  id: string;
  name: string;
  headline?: string;
  description?: string;
  category: string;
  driver_config: string;
  local_price: string | number;
  global_price: string | number;
  local_stock?: boolean;
  aliexpress_link?: string;
  local_shipping_time?: string;
  global_shipping_time?: string;
  specs: {
    frequency_response: string;
    impedance: string;
    sensitivity: string;
  };
  signature: string;
  price_range: string;
  images: {
    product: string;
    graph: string;
    internal?: string;
  };
  gallery?: string[];
  all_internal_assets?: string[];
  links: {
    official: string;
  };
}

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const { draftConfig } = useVisualEditor();
  
  if (!product) return null;

  // Find the live index for proper saving
  const productIndex = draftConfig?.products?.findIndex((p: any) => p.id === product.id) ?? -1;

  const hasLocal = product.local_price && product.local_price !== "0.00";
  const hasGlobal = !!product.aliexpress_link;
  const isLocalOut = product.local_stock === false;

  const internalImage = product.images.internal || "https://images.unsplash.com/photo-1610410427814-1e03f001e715?q=80&w=600";
  const hasInternal = !!product.images.internal;

  const handleAddLocal = () => {
    addToCart(product, 'local');
    onClose();
  };

  const handleAddGlobal = () => {
    addToCart(product, 'global');
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-2xl"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 50 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="bg-[#050505] w-full max-w-7xl max-h-[95vh] overflow-hidden rounded-[48px] shadow-[0_0_150px_rgba(6,182,212,0.1)] relative flex flex-col md:flex-row border border-white/5"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 w-14 h-14 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full flex items-center justify-center transition-all duration-300 z-[110] group active:scale-90"
          >
            <X size={24} className="text-white group-hover:rotate-90 transition-transform duration-500" />
          </button>

          {/* Left: Technical Analysis */}
          <div className="w-full md:w-[60%] p-8 md:p-16 bg-[#030303] flex flex-col relative overflow-y-auto custom-scrollbar border-b md:border-b-0 md:border-r border-white/5">
            <div className="flex items-center gap-6 mb-12">
               <div className="w-12 h-[2px] bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.6)]" />
               <span className="text-[10px] font-black uppercase tracking-[0.6em] text-cyan-500 animate-pulse">STRUCTURAL SCANNER</span>
            </div>

            <div className="relative group mb-14 mx-auto w-full max-w-[600px] aspect-square flex items-center justify-center">
              <XRayImage 
                primarySrc={product.images.product}
                internalSrc={internalImage}
                alt={product.name}
                className="w-full h-full object-contain filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
              />
              
              {!hasInternal && (
                <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
                   <div className="bg-black/80 border border-white/10 px-8 py-4 rounded-2xl backdrop-blur-md">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Awaiting Engineering CAD</span>
                   </div>
                </div>
              )}

              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-cyan-500 text-black px-8 py-3 rounded-full text-[9px] font-black tracking-[0.4em] uppercase opacity-0 group-hover:opacity-100 transition-all duration-700 shadow-[0_0_30px_rgba(6,182,212,0.4)] translate-y-4 group-hover:translate-y-0">
                SWEEP TO REVEAL LAYERS
              </div>
            </div>

            {/* Dashboards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
               <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[40px] group">
                  <p className="text-[9px] text-gray-500 uppercase tracking-[0.4em] mb-8 flex items-center gap-3 font-black">
                    <Activity size={12} className="text-cyan-500" /> ACOUSTIC FINGERPRINT
                  </p>
                  <div className="aspect-[16/10] w-full bg-black rounded-2xl border border-white/5 overflow-hidden relative">
                    <SafeImage src={product.images.graph || ""} alt="Graph" className="w-full h-full object-cover opacity-60 mix-blend-screen" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                  </div>
               </div>
               
               <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[40px] flex flex-col justify-center space-y-12">
                  <TechVisualizer label="DRIVE RESISTANCE" value={product.specs.impedance} max={150} icon={Zap} />
                  <TechVisualizer label="SPL SENSITIVITY" value={product.specs.sensitivity} max={140} icon={Activity} />
                  <div className="pt-6 border-t border-white/5">
                     <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-2">RESPONSE SPECTRUM</p>
                     <p className="text-xl font-black text-white tracking-tighter">{product.specs.frequency_response}</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Right: Specs & Action */}
          <div className="w-full md:w-[40%] p-8 md:p-16 flex flex-col bg-[#050505] overflow-y-auto custom-scrollbar">
            <div className="mb-14">
              <div className="flex items-center gap-3 mb-8">
                 <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                 <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em]">{product.category} UNIT</span>
              </div>
              
              <h2 className="text-6xl font-black text-white mb-8 tracking-tighter leading-none uppercase">{product.name}</h2>
              <p className="text-gray-400 font-medium text-lg leading-relaxed mb-12">
                {product.description || "Precision engineered for absolute phase coherence and tactical sound stage imaging."}
              </p>
            </div>

            <div className="space-y-14 flex-1">
               <div>
                  <h4 className="text-[9px] uppercase tracking-[0.4em] text-gray-600 font-black mb-6">Technical Intelligence</h4>
                  <div className="p-8 bg-white/[0.03] border border-white/5 rounded-[32px] text-gray-400 font-medium leading-relaxed">
                    {product.driver_config}
                  </div>
               </div>

               <div>
                  <h4 className="text-[9px] uppercase tracking-[0.4em] text-gray-600 font-black mb-6">TECHNICAL SIGNATURES</h4>
                  <div className="flex flex-wrap gap-3">
                    {[product.signature, 'PhaseSync™', 'N52 Neodymium'].map(tag => (
                      <span key={tag} className="px-6 py-3 bg-white/5 border border-white/5 rounded-2xl text-[9px] font-black text-gray-400 uppercase tracking-widest hover:border-cyan-500/50 hover:text-white transition-all cursor-default">
                        {tag}
                      </span>
                    ))}
                  </div>
               </div>
            </div>

            <div className="mt-20 space-y-6">
               <div className="grid grid-cols-1 gap-4">
                  {hasLocal && (
                    <button 
                      onClick={handleAddLocal}
                      disabled={isLocalOut}
                      className={`w-full py-8 ${isLocalOut ? 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5' : 'bg-[#ffd700] text-black hover:bg-[#ffed4a] shadow-[0_20px_60px_rgba(255,215,0,0.2)]'} rounded-[32px] font-black text-[11px] tracking-[0.2em] uppercase transition-all duration-500 flex flex-col items-center justify-center group active:scale-95`}
                    >
                      <div className="flex items-center gap-3">
                        <Zap size={16} /> 
                        <span>Instant Deployment</span>
                      </div>
                      <span className="text-[9px] opacity-70 mt-1">${product.local_price} — Local Dispatch</span>
                      {product.local_shipping_time && (
                        <span className="text-[8px] opacity-50 mt-0.5">
                          Est. Delivery: {productIndex !== -1 ? (
                            <EditableText value={product.local_shipping_time} path={`products.${productIndex}.local_shipping_time`} />
                          ) : product.local_shipping_time}
                        </span>
                      )}
                    </button>
                  )}

                  {hasGlobal && (
                    <button 
                      onClick={handleAddGlobal}
                      className="w-full py-8 bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-cyan-500/50 hover:shadow-[0_20px_60px_rgba(6,182,212,0.1)] rounded-[32px] font-black text-[11px] tracking-[0.2em] uppercase transition-all duration-500 flex flex-col items-center justify-center group active:scale-95"
                    >
                      <div className="flex items-center gap-3">
                        <ShoppingCart size={16} className="text-cyan-500" /> 
                        <span>Global Supply</span>
                      </div>
                      <span className="text-[9px] text-gray-500 mt-1">${product.global_price} — Int'l Handoff</span>
                      {product.global_shipping_time && (
                        <span className="text-[8px] text-gray-600 mt-0.5">
                          Est. Delivery: {productIndex !== -1 ? (
                            <EditableText value={product.global_shipping_time} path={`products.${productIndex}.global_shipping_time`} />
                          ) : product.global_shipping_time}
                        </span>
                      )}
                    </button>
                  )}
               </div>
               
               <p className="text-center text-[10px] font-black text-gray-700 uppercase tracking-widest">
                 MULTI-CHANNEL LOGISTICS: VERIFIED
               </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductModal;
