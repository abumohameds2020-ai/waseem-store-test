"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Headphones, Zap, Radio, ChevronRight, Activity, X, ShieldCheck } from 'lucide-react';
import SafeImage from './SafeImage';
import EditableText from './EditableText';

export default function AIConcierge({ products, quizWeights }: { products: any[], quizWeights?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const quizOptions = [
    { id: 'preference', title: 'ACOUSTIC ARCHITECTURE', desc: 'Select your primary technical requirement.', options: [
      { id: 'bass', label: 'Tuned Low-End', desc: 'Sub-bass emphasis for cinematic depth.' },
      { id: 'clarity', label: 'Phase Coherent', desc: 'Neutral response for critical auditing.' },
      { id: 'gaming', label: 'Imaging Precision', desc: 'Pinpoint accuracy for tactical spatial awareness.' }
    ]},
    { id: 'gear', title: 'SIGNAL PROCESSING HUB', desc: 'Hardware currently in the chain.', options: [
      { id: 'mobile', label: 'Mobile Frequency', desc: 'Standard USB-C / Lighting Dongles.' },
      { id: 'dac', label: 'High-Res DAC/AMP', desc: 'Dedicated 32-bit ESS / AKM chipsets.' },
      { id: 'interface', label: 'Studio Interface', desc: 'Professional XLR/TRS balanced chains.' }
    ]},
    { id: 'genre', title: 'GENRE ALGORITHM', desc: 'Primary data stream to be processed.', options: [
      { id: 'electronic', label: 'Pulse & Synth', desc: 'Techno, EDM, Ambient Textures.' },
      { id: 'rock', label: 'Analog Strings', desc: 'Rock, Metal, Jazz Instrumental.' },
      { id: 'fps', label: 'Tactical Audio', desc: 'Competitive FPS Footsteps & Spatial Cues.' }
    ]}
  ];

  const handleSelect = (id: string) => {
    if (step < quizOptions.length - 1) {
      setStep(step + 1);
    } else {
      setIsAnalyzing(true);
      setTimeout(() => {
        let match;
        if (quizWeights) {
          const finalPref = id; // This is the last selected id from handleSelect
          // Simple mapping logic for demonstration, in real use you'd map finalPref to quizWeights key
          const weightKey = finalPref === 'fps' ? 'gaming' : (finalPref === 'electronic' ? 'bass' : 'clarity');
          const productId = quizWeights[weightKey];
          match = products.find(p => p.id === productId) || products[0];
        } else {
          match = products[Math.floor(Math.random() * products.length)];
        }
        const percentage = 92 + Math.floor(Math.random() * 7);
        setResult({ ...match, compatibility: percentage });
        setIsAnalyzing(false);
        setStep(quizOptions.length);
      }, 2800);
    }
  };

  const reset = () => {
    setIsOpen(false);
    setTimeout(() => {
      setStep(0);
      setResult(null);
      setIsAnalyzing(false);
    }, 500);
  };

  return (
    <section className="py-32 relative overflow-hidden bg-[#030303]">
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Main Entry Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onClick={() => setIsOpen(true)}
          className="group relative w-full h-[500px] rounded-[48px] overflow-hidden cursor-pointer border border-white/5 hover:border-cyan-500/30 transition-all duration-700"
        >
          <div className="absolute inset-0 bg-[#080808]">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=2000')] bg-cover bg-center opacity-20 group-hover:scale-105 transition-transform duration-[3000ms]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
          </div>

          <div className="absolute inset-0 p-12 lg:p-24 flex flex-col justify-end items-start">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-cyan-500/20 rounded-2xl border border-cyan-500/20 text-cyan-400">
                <Sparkles size={24} />
              </div>
              <EditableText 
                value="Neural Consultant Alpha" 
                path="cms.quiz.label"
                className="text-xs font-black text-cyan-500 uppercase tracking-[0.4em]"
              />
            </div>
            
            <h2 className="text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter mb-6 leading-none">
              <EditableText 
                value="Technical Diagnostic" 
                path="cms.quiz.title"
                multiline
                tagName="span"
              />
            </h2>
            
            <EditableText 
              value="Identify the optimal acoustic asset for your mission through our high-density technical matching algorithm." 
              path="cms.quiz.description"
              multiline
              tagName="p"
              className="text-gray-400 max-w-xl text-lg font-medium leading-relaxed mb-10"
            />

            <button className="flex items-center gap-4 px-10 py-5 bg-white text-black rounded-full font-black text-xs uppercase tracking-widest hover:bg-cyan-500 transition-all group-hover:shadow-[0_0_50px_rgba(255,255,255,0.2)]">
              <EditableText value="Initiate Diagnostic" path="cms.quiz.button" /> <ChevronRight size={16} />
            </button>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl"
          >
            <button 
              onClick={reset}
              className="absolute top-10 right-10 p-4 bg-white/5 border border-white/10 rounded-full text-white hover:bg-white/10 transition-all z-50"
            >
              <X size={24} />
            </button>

            <div className="max-w-4xl w-full">
              {step < quizOptions.length && !isAnalyzing && (
                <div className="space-y-16">
                  <header className="text-center">
                    <h3 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter mb-4">{quizOptions[step].title}</h3>
                    <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">{quizOptions[step].desc}</p>
                  </header>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {quizOptions[step].options.map(opt => (
                      <button 
                        key={opt.id}
                        onClick={() => handleSelect(opt.id)}
                        className="p-10 bg-white/5 border border-white/5 rounded-[40px] text-left hover:bg-white/10 hover:border-white/20 transition-all group relative overflow-hidden"
                      >
                         <h4 className="text-xl font-black text-white uppercase mb-4 tracking-tight group-hover:text-cyan-400 transition-colors">{opt.label}</h4>
                         <p className="text-xs text-gray-500 font-medium leading-relaxed uppercase tracking-widest mt-4">{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {isAnalyzing && (
                <div className="text-center space-y-8 py-20">
                  <div className="relative mx-auto w-40 h-40">
                     <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className="absolute inset-0 border-t-2 border-cyan-500 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                     />
                     <div className="absolute inset-4 border border-white/5 rounded-full flex items-center justify-center">
                        <Zap size={48} className="text-cyan-500 animate-pulse" />
                     </div>
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-widest">Analyzing Signal Integrity</h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] animate-pulse">Running Neural Cross-Reference</p>
                </div>
              )}

              {result && step === quizOptions.length && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col lg:flex-row gap-16 items-center"
                >
                   <div className="w-full lg:w-1/2 aspect-square bg-[#080808] border border-white/5 rounded-[64px] p-16 flex items-center justify-center relative group">
                      <SafeImage src={result.images?.product} alt={result.name} className="w-full h-full object-contain filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-1000" />
                      <div className="absolute top-10 left-10">
                         <span className="px-4 py-2 bg-cyan-500 text-black text-[9px] font-black uppercase rounded-full tracking-[0.3em]">{result.compatibility}% Match Verified</span>
                      </div>
                   </div>

                   <div className="w-full lg:w-1/2 space-y-8">
                      <div className="space-y-4">
                        <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.5em]">The Resulting Protocol</span>
                        <h3 className="text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter leading-none">{result.name}</h3>
                        <p className="text-gray-400 font-medium text-lg leading-relaxed">{result.headline || "Uncompromising performance found."}</p>
                      </div>

                      <div className="p-8 bg-white/5 border border-white/5 rounded-[32px] space-y-4">
                         <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest border-b border-white/5 pb-4">
                            <span className="text-gray-500">Tech Category</span>
                            <span className="text-white">{result.category}</span>
                          </div>
                          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                            <span className="text-gray-500">Acoustic Signature</span>
                            <span className="text-cyan-500">{result.signature}</span>
                          </div>
                      </div>

                      <div className="flex gap-4">
                         <button 
                           onClick={() => {
                             const event = new CustomEvent('kz-open-product', { detail: result });
                             window.dispatchEvent(event);
                             reset();
                           }}
                           className="flex-1 py-6 bg-white text-black font-black text-xs uppercase tracking-[0.3em] rounded-2xl hover:bg-cyan-500 transition-all shadow-xl hover:shadow-cyan-500/20"
                         >
                           Secure Asset
                         </button>
                         <button 
                           onClick={() => setStep(0)}
                           className="px-10 py-6 border border-white/10 text-white font-black text-xs uppercase tracking-[0.3em] rounded-2xl hover:bg-white/5 transition-all"
                         >
                           Audit Again
                         </button>
                      </div>
                   </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
