"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, View, ShoppingBag, LayoutGrid, List, Search, Filter } from 'lucide-react';
import Navbar from './Navbar';
import ModernFooter from './ModernFooter';
import SafeImage from './SafeImage';
import ProductModal from './ProductModal';
import { useCart } from '@/context/CartContext';

const SAMPLE_ARSENAL = [
  { id: 's1', name: 'KZ PR3 Planar', category: 'Planar Magnetic', local_price: '299', signature: 'High Fidelity', images: { product: '' } },
  { id: 's2', name: 'KZ ZSN Pro X', category: 'Hybrid', local_price: '149', signature: 'V-Shape', images: { product: '' } },
  { id: 's3', name: 'KZ Castor', category: 'Dynamic', local_price: '129', signature: 'Bass Version', images: { product: '' } },
  { id: 's4', name: 'KZ Krila', category: 'Hybrid', local_price: '179', signature: 'Neutral', images: { product: '' } },
  { id: 's5', name: 'KZ AS24', category: 'Balanced Armature', local_price: '399', signature: 'Analytical', images: { product: '' } },
  { id: 's6', name: 'KZ D-Fi', category: 'Dynamic', local_price: '99', signature: 'Warm', images: { product: '' } },
  { id: 's7', name: 'KZ PR2 Real', category: 'Planar Magnetic', local_price: '249', signature: 'Transparent', images: { product: '' } },
  { id: 's8', name: 'KZ Carol', category: 'Dynamic', local_price: '159', signature: 'Musical', images: { product: '' } },
];

export default function ShopEngine({ products }: { products: any[] }) {
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  
  const displayProducts = products.length > 0 ? products : SAMPLE_ARSENAL;

  const filtered = useMemo(() => {
    return displayProducts.filter(p => 
      (filter === 'All' || p.category === filter) &&
      (p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [displayProducts, filter, searchQuery]);

  const categories = ['All', ...new Set(displayProducts.map(p => p.category))];

  return (
    <div className="bg-[#030303] min-h-screen pt-40">
      <Navbar />
      
      <div className="container mx-auto px-6 lg:px-12">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="space-y-4">
             <h1 className="text-5xl lg:text-8xl font-black italic uppercase tracking-tighter text-white">TOTAL ARSENAL</h1>
             <p className="text-[10px] font-black tracking-[0.4em] text-cyan-500 uppercase flex items-center gap-3">
               <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
               Global Inventory Link: {displayProducts.length} Units Online
             </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search Design Protocol..." 
                className="bg-white/5 border border-white/10 rounded-2xl pl-16 pr-8 py-4 text-xs font-bold text-white outline-none focus:border-cyan-500/50 transition-all w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Sidebar Filter */}
          <aside className="w-full lg:w-64 space-y-12 shrink-0">
             <div className="space-y-6">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-3">
                   <Filter size={14} /> Filter Protocols
                </h3>
                <div className="flex flex-col gap-2">
                   {categories.map(cat => (
                     <button 
                       key={cat}
                       onClick={() => setFilter(cat)}
                       className={`text-left px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === cat ? 'bg-cyan-500 text-black shadow-xl shadow-cyan-500/20' : 'bg-white/5 text-gray-500 hover:text-white hover:bg-white/10'}`}
                     >
                       {cat}
                     </button>
                   ))}
                </div>
             </div>

             <div className="p-8 bg-cyan-500/5 border border-cyan-500/10 rounded-[32px] space-y-4">
                <h4 className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Global Shipping</h4>
                <p className="text-[9px] text-gray-500 font-bold leading-relaxed">Automatic tactical routing enabled for all global logistics paths.</p>
             </div>
          </aside>

          {/* Grid Area */}
          <div className="flex-1 space-y-10">
            <div className="flex items-center justify-between bg-white/[0.02] border border-white/5 p-4 rounded-[24px]">
               <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-4">{filtered.length} Objects Loaded</span>
               <div className="flex items-center gap-2">
                  <button onClick={() => setLayout('grid')} className={`p-3 rounded-xl transition-all ${layout === 'grid' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}><LayoutGrid size={16}/></button>
                  <button onClick={() => setLayout('list')} className={`p-3 rounded-xl transition-all ${layout === 'list' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}><List size={16}/></button>
               </div>
            </div>

            <motion.div 
               layout
               className={layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8' : 'flex flex-col gap-4'}
            >
               <AnimatePresence mode="popLayout">
                 {filtered.map(p => (
                   <motion.div
                     key={p.id}
                     layout
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.9 }}
                     className={`group relative bg-[#070707] border border-white/5 rounded-[40px] overflow-hidden hover:border-cyan-500/30 transition-all duration-700 ${layout === 'list' ? 'flex items-center p-6 gap-8' : 'p-8'}`}
                     onClick={() => setSelectedProduct(p)}
                   >
                     {/* Product Visual */}
                     <div className={`relative bg-black/40 rounded-[32px] overflow-hidden flex items-center justify-center shrink-0 ${layout === 'list' ? 'w-40 h-40' : 'aspect-square w-full mb-8'}`}>
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
                        {p.images?.product ? (
                           <img src={p.images.product} className="w-full h-full object-contain filter drop-shadow-2xl transition-transform duration-1000 group-hover:scale-110" alt="" />
                        ) : (
                           <div className="text-gray-800 flex flex-col items-center gap-3">
                              <ShoppingBag size={48} />
                              <span className="text-[8px] font-black uppercase tracking-widest">Mesh Required</span>
                           </div>
                        )}
                        <div className="absolute inset-0 bg-cyan-500/0 group-hover:bg-cyan-500/10 transition-colors duration-700" />
                     </div>

                     <div className="flex-1 space-y-4">
                        <div>
                           <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2 block">{p.category}</span>
                           <h3 className="text-xl font-black text-white group-hover:text-cyan-400 transition-colors tracking-tighter uppercase">{p.name}</h3>
                        </div>
                        <div className="flex items-center gap-4">
                           <span className="text-sm font-black text-[#ffd700] tracking-widest">${p.local_price}</span>
                           <button className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Details</button>
                        </div>
                     </div>

                     {/* Tactical Decoration */}
                     <div className="absolute top-6 right-6 w-1 h-1 bg-cyan-500/20 rounded-full group-hover:scale-[60] transition-transform duration-1000 pointer-events-none" />
                   </motion.div>
                 ))}
               </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>

      <ModernFooter />
      
      <ProductModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />
    </div>
  );
}
