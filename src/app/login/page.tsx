"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowRight, Loader2, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simple placeholder logic
    if (password === 'admin123') {
      localStorage.setItem('kz_admin_auth', 'true');
      router.push('/');
    } else {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.15)_0%,transparent_100%)]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-12 bg-white/[0.02] border border-white/5 rounded-[64px] backdrop-blur-3xl shadow-2xl relative overflow-hidden"
      >
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-cyan-500/20 blur-[60px] rounded-full" />

        <div className="relative z-10 space-y-12 text-center">
            <div className="flex flex-col items-center gap-6">
                <div className="w-20 h-20 bg-white shadow-2xl shadow-white/10 rounded-3xl flex items-center justify-center text-black">
                   <ShieldCheck size={40} />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Command Center</h1>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Personnel Authentication Required</p>
                </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-6 text-left">
               <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-4">Security Protocol</label>
                  <div className="relative">
                    <input 
                       type="password" 
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       placeholder="Enter Access Key..."
                       className={`w-full bg-white/5 border ${error ? 'border-red-500' : 'border-white/10'} rounded-3xl px-8 py-6 text-white text-lg font-mono outline-none focus:border-cyan-500 focus:ring-4 ring-cyan-500/10 transition-all`}
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-700">
                       <Lock size={24} />
                    </div>
                  </div>
                  {error && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest text-center">Access Denied. Invalid Authorization.</p>}
               </div>

               <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-black font-black uppercase tracking-[0.3em] text-[10px] py-6 rounded-3xl hover:bg-cyan-500 transition-all shadow-xl shadow-white/5 flex items-center justify-center gap-4"
               >
                  {loading ? <Loader2 className="animate-spin" /> : <>Initiate Session <ArrowRight size={16} /></>}
               </button>
            </form>

            <p className="text-[8px] text-white/10 font-black uppercase tracking-[0.5em]">Authorized Access Only • System Log Point #275</p>
        </div>
      </motion.div>
    </div>
  );
}
