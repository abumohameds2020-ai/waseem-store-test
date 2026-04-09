import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import MediaVault from './MediaVault';

interface MediaVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

export default function MediaVaultModal({ isOpen, onClose, onSelect }: MediaVaultModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-7xl max-h-[90vh] bg-[#0a0a0a] rounded-[40px] border border-white/10 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-white/5 bg-white/5">
              <div>
                <h3 className="text-xl font-black text-white">Select from Media Vault</h3>
                <p className="text-[10px] uppercase text-gray-500 tracking-widest mt-1">Click any asset to securely link its trajectory</p>
              </div>
              <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all">
                <X size={20} className="text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#030303]">
              <MediaVault isModal={true} onSelect={(url) => { onSelect(url); onClose(); }} />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
