"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import SafeImage from '../SafeImage';

import { useRouter } from 'next/navigation';

export default function CartDrawer() {
  const { cart, removeFromCart, totalPrice, totalCount, isCartOpen, setIsCartOpen } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    setIsCartOpen(false);
    router.push('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
          />

          {/* Drawer */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#080808] border-l border-white/5 z-[210] shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white border border-white/10">
                  <ShoppingBag size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">Your Arsenal</h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{totalCount} Modules Prepared</p>
                </div>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-40">
                  <ShoppingBag size={64} className="text-gray-600" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Inventory Empty</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map((item) => (
                    <motion.div 
                      key={`${item.id}-${item.fulfillment}`}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-6 p-4 rounded-2xl bg-white/[0.02] border border-white/5 group"
                    >
                      <div className="w-20 h-20 bg-white/5 rounded-xl p-2 relative overflow-hidden">
                        <SafeImage src={item.image} alt={item.name} className="w-full h-full object-contain filter drop-shadow-lg" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div className="flex justify-between gap-4">
                          <h4 className="text-sm font-black text-white uppercase tracking-tight truncate">{item.name}</h4>
                          <button 
                            onClick={() => removeFromCart(item.id, item.fulfillment)}
                            className="text-gray-600 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="flex justify-between items-end">
                          <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                            QTY: {item.quantity}
                          </div>
                          <div className="text-sm font-black text-white">${item.price.toFixed(2)}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-8 border-t border-white/5 bg-black/40 backdrop-blur-md">
                <div className="flex justify-between items-end mb-8">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Total Value</span>
                  <span className="text-3xl font-serif font-black text-white tracking-tighter">${totalPrice.toFixed(2)}</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="w-full py-6 bg-cyan-500 text-black font-black text-[12px] uppercase tracking-[0.4em] rounded-[20px] hover:bg-cyan-400 transition-all shadow-[0_10px_30px_rgba(6,182,212,0.3)] flex items-center justify-center gap-4 group"
                >
                  Finalize Acquisition <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
