"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, ArrowRight } from "lucide-react";
import Magnetic from "./Magnetic";

interface StickyBuyBarProps {
  productName: string;
  productPrice: number;
}

export const StickyBuyBar = ({ productName, productPrice }: StickyBuyBarProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 500px or so
      setIsVisible(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-2xl border-t border-gray-100 p-4 z-[100] md:hidden"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase text-gray-400 tracking-tighter truncate max-w-[150px]">{productName}</span>
              <span className="text-lg font-black text-[#0070f3] tracking-tighter">${productPrice}.00</span>
            </div>
            
            <div className="flex-1">
               <button className="btn-accent w-full flex items-center justify-center gap-2 py-3 shadow-xl shadow-blue-500/20">
                 <ShoppingCart size={16} />
                 Buy Now
               </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyBuyBar;
