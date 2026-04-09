"use client";

import React from 'react';
import { VisualEditorProvider } from "@/context/VisualEditorContext";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ShopEngine from '@/components/ShopEngine';

export default function ShopWrapper({ products, fullConfig }: { products: any[], fullConfig: any }) {
  return (
    <VisualEditorProvider initialConfig={fullConfig}>
      <main className="relative min-h-screen bg-[#030303] text-white selection:bg-[#ffd700]/30 selection:text-[#ffd700]">
        <Navbar />
        <ShopEngine products={products} />
        <Footer />
      </main>
    </VisualEditorProvider>
  );
}
