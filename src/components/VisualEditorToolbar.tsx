"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVisualEditor } from '@/context/VisualEditorContext';
import { ShieldCheck, LogOut, Edit3, CheckCircle, XCircle, Save, Globe, Eye } from 'lucide-react';

export default function VisualEditorToolbar() {
  const { isAdmin, isEditMode, setEditMode, logout, publish, discard } = useVisualEditor();
  const [isSaving, setIsSaving] = useState(false);

  if (!isAdmin) return null;

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[9999]">
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="bg-black/80 backdrop-blur-2xl border border-white/10 px-8 py-5 rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.8)] flex items-center gap-8"
      >
        <div className="flex items-center gap-4 pr-8 border-r border-white/10">
          <div className="p-2 bg-cyan-500/10 rounded-xl text-cyan-500">
             <ShieldCheck size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-white uppercase tracking-widest">Command Center</p>
            <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Live Editor Active</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {!isEditMode ? (
            <button 
              onClick={() => setEditMode(true)}
              className="flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase text-white tracking-widest transition-all"
            >
              <Edit3 size={14} /> Enter Edit Mode
            </button>
          ) : (
            <>
              <button 
                onClick={discard}
                className="flex items-center gap-3 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase text-red-500 tracking-widest transition-all"
              >
                <XCircle size={14} /> Discard
              </button>
              <button 
                onClick={async () => {
                  setIsSaving(true);
                  await publish();
                  setIsSaving(false);
                }}
                disabled={isSaving}
                className="flex items-center gap-3 px-8 py-3 bg-cyan-500 text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-cyan-500/20 hover:scale-105 transition-all"
              >
                {isSaving ? <Globe className="animate-spin" size={14} /> : <CheckCircle size={14} />} 
                Publish Changes
              </button>
            </>
          )}
        </div>

        <button 
          onClick={logout}
          className="ml-4 p-3 hover:text-red-500 transition-colors text-gray-500"
        >
          <LogOut size={20} />
        </button>
      </motion.div>
    </div>
  );
}
