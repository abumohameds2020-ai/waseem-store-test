"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface Product {
  id: string;
  name: string;
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
  };
}

interface CompareContextType {
  selectedProducts: Product[];
  toggleProduct: (product: Product) => void;
  clearCompare: () => void;
  isCompareOpen: boolean;
  setIsCompareOpen: (isOpen: boolean) => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider = ({ children }: { children: ReactNode }) => {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const toggleProduct = (product: Product) => {
    setSelectedProducts((prev) => {
      const isSelected = prev.find((p) => p.id === product.id);
      if (isSelected) {
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length < 2) {
        return [...prev, product];
      }
      // Replace the last one if already 2
      return [prev[0], product];
    });
  };

  const clearCompare = () => {
    setSelectedProducts([]);
    setIsCompareOpen(false);
  };

  return (
    <CompareContext.Provider value={{ selectedProducts, toggleProduct, clearCompare, isCompareOpen, setIsCompareOpen }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
};
