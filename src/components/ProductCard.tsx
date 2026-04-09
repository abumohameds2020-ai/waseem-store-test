"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import XRayImage from "./interactive/XRayImage";
import { useCompare } from "../context/CompareContext";
import Magnetic from "./interactive/Magnetic";
import { Scale, Check } from "lucide-react";

interface Product {
  id: string;
  name: string;
  headline?: string;
  description?: string;
  category: string;
  driver_config: string;
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
}

const getPrice = (product: Product) => {
  const { category, price_range } = product;
  
  if (price_range === "Budget") {
    return category === "Dynamic" ? 28 : category === "Hybrid" ? 35 : 25;
  }
  if (price_range === "Mid-range") {
    return category === "Planar" ? 89 : category === "Hybrid" ? 59 : 49;
  }
  if (price_range === "Flagship") {
    return category === "Planar" ? 149 : category === "Balanced Armature" ? 129 : 99;
  }
  
  // Default logic based on category as requested
  if (category === "Planar") return 85;
  if (category === "Dynamic") return 32;
  return 55;
};

const ProductCard: React.FC<{ product: Product; onSelect?: (p: Product) => void }> = ({ product, onSelect }) => {
  const price = getPrice(product);
  const isTopPick = product.name === "KZ Phantom" || product.name === "KZ ZSN Pro X";
  const { toggleProduct, selectedProducts, setIsCompareOpen } = useCompare();
  
  const isSelected = selectedProducts.find(p => p.id === product.id);

  return (
    <div 
      className="block group relative cursor-pointer"
      onClick={() => onSelect?.(product)}
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="luxury-card h-full flex flex-col overflow-hidden relative"
      >
        {/* Image Container with X-Ray Effect */}
        <div className="relative aspect-square overflow-hidden bg-white p-6">
          <XRayImage 
             primarySrc={product.images.product}
             internalSrc={product.images.internal || "https://images.unsplash.com/photo-1610410427814-1e03f001e715?q=80&w=600"}
             alt={product.name}
          />
          
          {/* Top Pick Badge */}
          {isTopPick && (
            <div className="absolute top-4 left-4 z-20">
              <span className="badge-pick">Waseem’s Top Pick</span>
            </div>
          )}

          {/* Comparison Toggle */}
          <div className="absolute top-4 right-4 z-20">
             <button
               onClick={(e) => {
                 e.preventDefault();
                 toggleProduct(product);
               }}
               className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border ${
                 isSelected 
                   ? "bg-[#0070f3] text-white border-[#0070f3] shadow-lg shadow-blue-500/30" 
                   : "bg-white/80 backdrop-blur-md text-gray-400 border-gray-100 hover:text-black hover:border-black"
               }`}
             >
               {isSelected ? <Check size={18} /> : <Scale size={18} />}
             </button>
          </div>
          
          {/* Price Tag */}
          <div className="absolute bottom-4 right-4 z-20">
            <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-100 shadow-sm">
              <span className="text-sm font-bold text-gray-900">${price}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold tracking-[0.1em] text-gray-400 uppercase">
              {product.category}
            </span>
            <Link 
               href={`/product/${product.id}`}
               className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-[#0070f3] hover:text-white hover:border-[#0070f3] transition-all"
               onClick={(e) => e.stopPropagation()}
            >
               View Dossier
            </Link>
          </div>
          
          <h3 className="text-xl mb-3 group-hover:text-[#0070f3] transition-colors line-clamp-1 font-serif font-black tracking-tight">
            {product.name}
          </h3>
          
          {product.description && (
            <p className="text-[10px] text-gray-500 leading-relaxed mb-4 line-clamp-2">
              {product.description}
            </p>
          )}
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="badge-premium !text-[9px] !py-1 !px-2">
              {product.signature}
            </span>
            <span className="badge-premium !text-[9px] !py-1 !px-2 !bg-gray-50">
              {product.driver_config.split(' ')[0]} tech
            </span>
          </div>

          <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 uppercase font-medium">Sensitivity</span>
              <span className="text-xs font-bold text-gray-700">{product.specs.sensitivity}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-gray-400 uppercase font-medium">Impedance</span>
              <span className="text-xs font-bold text-gray-700">{product.specs.impedance}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Comparison Floating Action */}
      {isSelected && selectedProducts.length === 2 && (
         <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[300]">
            <Magnetic>
              <button 
                onClick={() => setIsCompareOpen(true)}
                className="bg-black text-white px-10 py-5 rounded-full text-[10px] font-black tracking-widest uppercase flex items-center gap-3 shadow-2xl shadow-black/20 hover:scale-105 active:scale-95 transition-all"
              >
                 Launch AI Showdown <Scale size={16} className="text-[#0070f3]" />
              </button>
            </Magnetic>
         </div>
      )}
    </div>
  );
};

export default ProductCard;
