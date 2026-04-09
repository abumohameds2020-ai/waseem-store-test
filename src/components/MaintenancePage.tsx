"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Cpu, ShieldCheck, Zap } from 'lucide-react';

const MaintenancePage = () => {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-2xl w-full bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[48px] p-12 md:p-20 text-center relative z-10 shadow-2xl"
      >
        <div className="flex justify-center mb-10">
           <div className="w-24 h-24 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-3xl border border-white/10 flex items-center justify-center relative group">
              <div className="absolute inset-0 bg-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <Settings size={44} className="text-white animate-spin-slow" />
           </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6 uppercase">
          Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-black italic">Recalibration</span>
        </h1>
        
        <p className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed mb-12">
          The KZ Phantom digital core is currently undergoing a boutique upgrade to enhance your acoustic discovery experience. We will be back online shortly.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-12 border-t border-white/5">
           <div className="flex flex-col items-center gap-3">
              <Cpu size={20} className="text-blue-500" />
              <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Core Update</span>
           </div>
           <div className="flex flex-col items-center gap-3 border-x border-white/5">
              <ShieldCheck size={20} className="text-green-500" />
              <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Securing Data</span>
           </div>
           <div className="hidden md:flex flex-col items-center gap-3">
              <Zap size={20} className="text-yellow-500" />
              <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Optimizing</span>
           </div>
        </div>

        <div className="mt-16">
           <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 rounded-full border border-white/10">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
              <span className="text-[10px] font-black uppercase text-blue-400 tracking-widest">System Status: Updating</span>
           </div>
        </div>
      </motion.div>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default MaintenancePage;
