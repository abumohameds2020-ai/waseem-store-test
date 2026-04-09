"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, View, Database, Loader2, Sparkles } from 'lucide-react';
import SafeImage from './SafeImage';
import ProductModal from './ProductModal';

interface ProductCatalogProps {
  products: any[];
}

const PLACEHOLDER_ITEMS = [
  {
    id: 'placeholder-1',
    name: 'Phantom Planar X',
    category: 'Planar Magnetic',
    signature: 'Analytical',
    local_price: '299',
    images: { product: '' },
    is_placeholder: true
  },
  {
    id: 'placeholder-2',
    name: 'Phantom Dynamic Pro',
    category: 'Dynamic',
    signature: 'Bass Boost',
    local_price: '149',
    images: { product: '' },
    is_placeholder: true
  },
  {
    id: 'placeholder-3',
    name: 'Phantom Hybrid Ultra',
    category: 'Hybrid',
    signature: 'Balanced',
    local_price: '199',
    images: { product: '' },
    is_placeholder: true
  }
];

export default function ProductCatalog({ products }: ProductCatalogProps) {
  const [filter, setFilter] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [visibleCount, setVisibleCount] = useState(12);

  // Use real products if available, otherwise placeholders
  const displayProducts = products.length > 0 ? products : PLACEHOLDER_ITEMS;

  useEffect(() => {
    const handleFilter = (e: any) => {
       const targetFilter = e.detail;
       setFilter(targetFilter);
       // Scroll to section for better UX
       const element = document.getElementById('catalog');
       if (element) {
         element.scrollIntoView({ behavior: 'smooth' });
       }
    };
    window.addEventListener('kz-nav-filter', handleFilter);
    return () => window.removeEventListener('kz-nav-filter', handleFilter);
  }, []);

  const activeProducts = useMemo(() => {
    return displayProducts.filter((p: any) => 
      (filter === 'All' || p.category.toLowerCase().includes(filter.toLowerCase())) && 
      (!p.inventory || p.inventory.stock !== 0) // Hide explicitly out of stock
    );
  }, [displayProducts, filter]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: displayProducts.length };
    displayProducts.forEach((p: any) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [displayProducts]);

  const categories = ['All', 'Dynamic', 'Hybrid', 'Planar Magnetic', 'Electrostatic'];

  return (
    <section id="catalog" className="relative py-32 bg-[#030303] text-white overflow-hidden min-h-screen">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[500px] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        
        <div className="flex flex-col lg:flex-row gap-12 items-end justify-between mb-16">
          <div className="space-y-4">
            <h2 className="text-4xl lg:text-7xl font-black uppercase tracking-tighter text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.1)] italic">
              PRIMARY ARSENAL
            </h2>
            <div className="flex items-center gap-6">
               <p className="text-[10px] font-black tracking-[0.3em] text-cyan-500 uppercase flex items-center gap-3 bg-cyan-500/5 px-6 py-3 border border-cyan-500/20 rounded-full">
                 <Database size={14} />
                 {products.length === 0 ? "Logistics Awaiting Persona Infiltration" : `${activeProducts.length} ACOUSTIC UNITS INITIALIZED`}
               </p>
               {products.length === 0 && (
                 <div className="flex items-center gap-2 text-[10px] font-black text-amber-500 animate-pulse uppercase tracking-widest">
                    <Loader2 size={12} className="animate-spin" /> Simulated Feed Active
                 </div>
               )}
            </div>
          </div>

          {/* Filtering HUD */}
          <div className="flex flex-wrap gap-4 bg-white/5 p-2 rounded-[32px] border border-white/5 backdrop-blur-xl">
            {categories.map(cat => {
              const isActive = filter === cat || (filter === 'All' && cat === 'All');
              return (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-8 py-4 rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 ${isActive ? 'bg-cyan-500 text-black shadow-[0_0_25px_rgba(6,182,212,0.5)]' : 'hover:bg-white/5 text-gray-500 hover:text-white'}`}
                >
                  {cat} 
                  {categoryCounts[cat] > 0 && <span className={`px-2 py-0.5 rounded-md text-[8px] ${isActive ? 'bg-black/20' : 'bg-white/10'}`}>{categoryCounts[cat]}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* The Glassmorphism Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          <AnimatePresence mode="popLayout">
            {activeProducts.slice(0, visibleCount).map((product: any) => {
              const glow = product.glow_color || '#0070f3';
              
              return (
                <motion.div
                  layout
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="group cursor-pointer flex flex-col"
                  onClick={() => setSelectedProduct(product)}
                >
                  {/* Glass Card */}
                  <div className="relative aspect-square w-full rounded-[48px] bg-[#070707] border border-white/10 overflow-hidden transition-all duration-700 group-hover:border-cyan-500/30 group-hover:shadow-[0_0_50px_rgba(6,182,212,0.1)]">
                    
                    {/* Inner Ambient Glow */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-20 blur-[80px] transition-opacity duration-1000 pointer-events-none"
                      style={{ backgroundColor: glow }}
                    />

                    {/* Scan Lines Overlay */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />

                    {/* Product Image */}
                    <div className="absolute inset-x-12 inset-y-16 z-10 flex items-center justify-center">
                      {product.is_placeholder ? (
                         <div className="flex flex-col items-center gap-4 text-gray-800 group-hover:text-cyan-900 transition-colors">
                            <Sparkles size={48} className="animate-pulse" />
                            <span className="text-[8px] font-black uppercase tracking-[0.4em]">Simulated Mesh</span>
                         </div>
                      ) : (
                        <SafeImage 
                          src={product.images?.product || ''}
                          alt={product.name}
                          className="w-full h-full object-contain filter drop-shadow-[0_30px_50px_rgba(0,0,0,0.8)] transition-transform duration-1000 ease-[0.16, 1, 0.3, 1] group-hover:scale-110 group-hover:-rotate-3"
                        />
                      )}
                    </div>

                    {/* Status Badges */}
                    <div className="absolute top-8 left-8 z-20 flex flex-col gap-3">
                       {product.is_featured && <span className="px-4 py-1.5 bg-white/5 backdrop-blur-xl border border-white/10 text-white text-[9px] font-black uppercase tracking-[0.3em] rounded-full">Legendary Class</span>}
                       {product.is_placeholder && <span className="px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[9px] font-black uppercase tracking-[0.3em] rounded-full">Classified</span>}
                    </div>

                    {/* Tactical Overlay */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center z-30">
                       <div className="flex flex-col items-center gap-6 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-700 ease-[0.16, 1, 0.3, 1]">
                          <div className="flex gap-2">
                             {[1,2,3].map(i => <div key={i} className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />)}
                          </div>
                          <button className="px-8 py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-cyan-500 transition-colors shadow-2xl shadow-white/10">
                             Initiate Scan
                          </button>
                       </div>
                    </div>
                  </div>

                  {/* Product Metadata */}
                  <div className="mt-8 px-4 flex flex-col items-center text-center">
                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] mb-3 group-hover:text-cyan-500/50 transition-colors">{product.category} // {product.signature}</span>
                    <h3 className="text-2xl font-black text-white group-hover:text-cyan-400 transition-all duration-500 uppercase tracking-tighter italic">{product.name}</h3>
                     <div className="mt-4 flex items-center justify-center gap-6">
                       {product.local_price && <span className="text-sm font-black text-[#ffd700] tracking-[0.2em] bg-white/5 px-4 py-1 rounded-lg">⚡ ${product.local_price}</span>}
                       {product.is_placeholder && <span className="text-[10px] font-black text-gray-500 border border-white/5 px-3 py-1 rounded-md uppercase tracking-widest">PENDING DATA</span>}
                     </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {visibleCount < activeProducts.length && (
          <div className="mt-24 flex justify-center">
            <button 
              onClick={() => setVisibleCount(v => v + 12)}
              className="px-16 py-6 border border-white/10 hover:border-cyan-500/30 hover:bg-cyan-500/5 rounded-3xl text-[10px] font-black uppercase tracking-[0.5em] text-white transition-all shadow-2xl relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              Load Additional Technical Protocols
            </button>
          </div>
        )}
      </div>

      <ProductModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />
    </section>
  );
}
