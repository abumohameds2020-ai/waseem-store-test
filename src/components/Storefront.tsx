"use client";

import React, { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import HeroSlider from "@/components/HeroSlider";
import AIConcierge from "@/components/AIConcierge";
import AboutCraft from "@/components/AboutCraft";
import CollectionTiles from "@/components/CollectionTiles";
import ProductCatalog from "@/components/ProductCatalog";
import TechSpecsGrid from "@/components/TechSpecsGrid";
import FAQ from "@/components/FAQ";
import ModernFooter from "@/components/ModernFooter";
import ProductModal from "@/components/ProductModal";
import AnatomyOfPrecision from "@/components/AnatomyOfPrecision";
import ComparisonMatrix from "@/components/ComparisonMatrix";
import AcousticDNA from "@/components/AcousticDNA";
import ParallaxEngineering from "@/components/ParallaxEngineering";
import QuickArsenal from "@/components/QuickArsenal";
import Testimonials from "@/components/Testimonials";
import { VisualEditorProvider } from "@/context/VisualEditorContext";
import VisualEditorToolbar from "@/components/VisualEditorToolbar";
import XRaySpotlight from "@/components/XRaySpotlight";
import ThreeDVisualizer from "@/components/ThreeDVisualizer";
import { useVisualEditor } from "@/context/VisualEditorContext";
import { motion } from "framer-motion";

function StorefrontContent({ products, sliderConfig, cms }: { products: any[], sliderConfig: any, cms: any }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { accentColor } = useVisualEditor();

  useEffect(() => {
    const handleOpenProduct = (e: any) => {
      setSelectedProduct(e.detail);
    };
    window.addEventListener('kz-open-product', handleOpenProduct);
    return () => window.removeEventListener('kz-open-product', handleOpenProduct);
  }, []);

  return (
    <main 
      className="relative min-h-screen bg-[#030303] text-white selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden font-sans transition-colors duration-1000"
      style={{ '--accent-primary': accentColor } as React.CSSProperties}
    >
      <Navbar />
      <HeroSlider sliderConfig={sliderConfig} products={products} />
      
      {/* Synesthesia Pulse Overlay */}
      <motion.div 
        animate={{ opacity: [0, 0.1, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="fixed inset-0 pointer-events-none z-[200] mix-blend-color"
        style={{ backgroundColor: accentColor }}
      />

      {/* New Premium Sections */}
      <AIConcierge products={products} quizWeights={cms?.quizWeights} />
      <AcousticDNA />
      
      {/* 2050 Cinematic Tech Sections */}
      <div id="xray-scanner">
        <XRaySpotlight />
      </div>
      <ThreeDVisualizer />
      
      <ParallaxEngineering />
      <AboutCraft about={cms?.about} />
      <ComparisonMatrix />
      <CollectionTiles collectionImages={cms?.collectionImages} />
      
      <ProductCatalog products={products} />
      <TechSpecsGrid />
      <Testimonials />
      <FAQ />

      <ModernFooter />
      
      <ProductModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />

      <QuickArsenal products={products} />
      <VisualEditorToolbar />
    </main>
  );
}

export default function Storefront({ products, sliderConfig, cms, fullConfig }: { products: any[], sliderConfig: any, cms: any, fullConfig: any }) {
  return (
    <StorefrontContent products={products} sliderConfig={sliderConfig} cms={cms} />
  );
}
