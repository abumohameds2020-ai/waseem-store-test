"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Headphones, Music, Sparkles, ArrowRight, CheckCircle2, ChevronLeft, Volume2, Search, Globe, Share2, MessageCircle, ExternalLink } from 'lucide-react';
import productData from '../../data.json';
import SafeImage from './SafeImage';
import AudioWaveform from './interactive/AudioWaveform';

const AIAudioMatcher = () => {
  const [step, setStep] = useState(0);
  const [preferences, setPreferences] = useState({
    signature: '',
    usage: '',
    budget: '',
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendation, setRecommendation] = useState<any>(null);

  const steps = [
    {
      title: "Audio Signature",
      subtitle: "Select your preferred auditory profile",
      icon: <Volume2 className="text-[#0070f3]" />,
      options: [
        { label: 'Neutral / Balanced', value: 'Balanced', description: 'Natural and transparent reproduction' },
        { label: 'Warm / Musical', value: 'Fun', description: 'Rich low-end and smooth textures' },
        { label: 'Analytical / Detailed', value: 'Technological', description: 'Micro-detail with absolute clarity' },
      ]
    },
    {
      title: "Primary Scenario",
      subtitle: "Where will you most appreciate the sound?",
      icon: <Music className="text-[#0070f3]" />,
      options: [
        { label: 'Studio Monitoring', value: 'Monitoring', description: 'Professional accuracy' },
        { label: 'High-Fidelity Listening', value: 'Listen Hifi', description: 'Pure musical enjoyment' },
        { label: 'Spatial Gaming', value: 'Game', description: 'Precise directional imaging' },
      ]
    }
  ];

  const handleOptionSelect = (value: string) => {
    const currentKey = step === 0 ? 'signature' : 'usage';
    setPreferences(prev => ({ ...prev, [currentKey]: value }));
    
    if (step < steps.length - 1) {
      setStep(prev => prev + 1);
    } else {
      runMatchmaking();
    }
  };

  const runMatchmaking = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      // Professional Weighted Scoring Engine
      const scored = productData.models.map(m => {
        let score = 0;
        
        // 1. Signature weight (Higher weight for matching sound signature)
        if (m.signature === preferences.signature) score += 50;
        else if (m.signature === 'Balanced') score += 20; // Balanced is a good safe alternative
        
        // 2. Scenario specific tech matching
        if (preferences.usage === 'Monitoring') {
          if (m.category === 'Planar' || m.category === 'Balanced Armature') score += 30;
          if (parseInt(m.specs.impedance) > 30) score += 10; // High impedance often implies better control
        } else if (preferences.usage === 'Game') {
          if (m.category === 'Hybrid') score += 40; // Hybrids are best for imaging
          if (m.name.toLowerCase().includes('phantom')) score += 50; // Brand flagship for gaming
        } else if (preferences.usage === 'Listen Hifi') {
          if (m.category === 'Planar') score += 40;
          if (m.category === 'Electrostatic') score += 50;
        }
        
        return { ...m, matchScore: score };
      });
      
      const sorted = scored.sort((a, b) => b.matchScore - a.matchScore);
      // Pick the best match, but add a tiny bit of randomness for a "curated" feel
      const match = sorted[0];
        
      setRecommendation(match);
      setIsAnalyzing(false);
      setStep(3);

      const event = new CustomEvent('kz-audio-recommendation', { detail: { id: match.id } });
      window.dispatchEvent(event);
    }, 3200);
  };

  const reset = () => {
    setStep(0);
    setRecommendation(null);
    setPreferences({ signature: '', usage: '', budget: '' });
  };

  return (
    <section id="matcher" className="py-24 sm:py-32 bg-[#fafafa] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none bg-[radial-gradient(#0070f3_1px,transparent_1px)] bg-[size:32px_32px]" />
      
      <div className="linsoul-container max-w-6xl relative z-10 p-6">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            <div className="px-6 py-2 bg-white border border-gray-100 rounded-full shadow-sm mb-8">
              <span className="text-[10px] font-black text-[#0070f3] uppercase tracking-[0.4em] flex items-center gap-2">
                <Sparkles size={12} /> Neural Audio Consultant
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-serif font-black text-gray-900 mb-8 tracking-tighter">AI Matcher Engine</h2>
            <p className="text-sm text-gray-400 max-w-2xl leading-relaxed font-medium uppercase tracking-widest text-center">
              Processing 190+ high-fidelity driver configurations to find your exact acoustic equilibrium.
            </p>
          </motion.div>
        </div>

        <div className="bg-white rounded-[40px] overflow-hidden min-h-[650px] flex flex-col shadow-[0_40px_100px_rgba(0,0,0,0.08)] border border-gray-100">
          <AnimatePresence mode="wait">
            {step < 2 && !isAnalyzing && (
              <motion.div
                key="questions"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="p-10 md:p-20 flex-1 flex flex-col"
              >
                <div className="flex items-center justify-between mb-16">
                  <div className="flex items-center gap-8">
                    <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center border border-gray-100 shadow-inner">
                      {steps[step].icon}
                    </div>
                    <div>
                      <h3 className="text-4xl font-serif font-black text-gray-900 tracking-tight">{steps[step].title}</h3>
                      <p className="text-[10px] text-gray-400 font-black tracking-[0.4em] uppercase mt-2">{steps[step].subtitle}</p>
                    </div>
                  </div>
                  <div className="h-1 w-24 bg-gray-100 rounded-full overflow-hidden">
                     <motion.div 
                       className="h-full bg-[#0070f3]" 
                       initial={{ width: 0 }}
                       animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
                     />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1">
                  {steps[step].options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleOptionSelect(opt.value)}
                      className="group relative flex flex-col items-start p-10 bg-[#f9f9f9]/50 border border-transparent rounded-[32px] hover:bg-white hover:border-[#00e5ff]/30 hover:shadow-[0_20px_60px_rgba(0,229,255,0.1)] transition-all duration-700 text-left overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-5 transition-opacity duration-700">
                         {steps[step].icon}
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                        <ArrowRight size={18} className="text-gray-300 group-hover:text-[#0070f3] transition-colors" />
                      </div>
                      <h4 className="font-serif text-2xl font-black text-gray-900 mb-4 group-hover:text-[#0070f3] transition-colors">{opt.label}</h4>
                      <p className="text-xs text-gray-400 leading-relaxed font-bold uppercase tracking-widest">{opt.description}</p>
                    </button>
                  ))}
                </div>

                {step > 0 && (
                  <button 
                    onClick={() => setStep(step - 1)}
                    className="mt-12 text-[10px] font-black text-gray-400 hover:text-black flex items-center gap-3 transition-colors uppercase tracking-[0.3em] active:scale-95"
                  >
                    <ChevronLeft size={16} /> Previous Sequence
                  </button>
                )}
              </motion.div>
            )}

            {isAnalyzing && (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-12 flex-1 flex flex-col items-center justify-center text-center bg-white"
              >
                <div className="w-full max-w-lg mb-16 px-10">
                   <AudioWaveform profile={preferences.signature === 'Fun' ? 'bass' : preferences.signature === 'Technological' ? 'hifi' : 'balanced'} />
                </div>
                <h3 className="text-4xl font-serif font-black text-gray-900 mb-6 tracking-tighter">Analyzing Acoustic DNAS</h3>
                <p className="text-xs text-gray-400 max-w-md leading-relaxed font-black uppercase tracking-[0.2em] opacity-60">
                  Cross-referencing 190+ driver configurations with your profile...
                </p>
                <div className="mt-10 flex gap-2">
                   {[0, 1, 2].map(i => (
                     <motion.div 
                        key={i}
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                        className="w-2 h-2 bg-[#00e5ff] rounded-full shadow-[0_0_8px_#00e5ff]"
                     />
                   ))}
                </div>
              </motion.div>
            )}

            {step === 3 && recommendation && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-10 md:p-20 flex-1 flex flex-col bg-white"
              >
                <div className="flex flex-col lg:row gap-16 items-center flex-1 lg:flex-row">
                  <div className="w-full lg:w-1/2 aspect-square bg-[#f9f9f9] rounded-[40px] p-16 relative border border-gray-100 overflow-hidden group">
                    <div className="absolute top-8 left-8 z-20">
                      <div className="bg-black text-white px-5 py-2 rounded-full text-[9px] font-black tracking-[0.3em] uppercase shadow-2xl">
                         98.4% Frequency Alignment
                      </div>
                    </div>
                    <SafeImage 
                      src={recommendation.images.product} 
                      alt={recommendation.name}
                      className="w-full h-full object-contain filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)] group-hover:scale-110 transition-transform duration-[2000ms] ease-out"
                    />
                  </div>
                  
                  <div className="w-full lg:w-1/2 text-left">
                    <div className="flex items-center gap-4 mb-8">
                       <span className="text-[11px] font-black text-[#0070f3] uppercase tracking-[0.6em]">Recommended Target</span>
                       <div className="flex-1 h-[1px] bg-gray-100" />
                    </div>
                    
                    <h3 className="text-6xl font-serif font-black text-gray-900 mb-6 tracking-tight leading-[0.9]">{recommendation.name}</h3>
                    <p className="text-[10px] text-[#00e5ff] uppercase tracking-[0.5em] font-black mb-12 flex items-center gap-3">
                       <Headphones size={14} /> {recommendation.category} TECHNOLOGY
                    </p>
                    
                    <div className="bg-[#f8f9fa] rounded-[32px] p-10 mb-12 border border-gray-100 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.03] scale-150 rotate-12 transition-transform group-hover:rotate-0 duration-1000">
                         <Sparkles size={100} />
                      </div>
                      
                      <p className="text-[10px] font-black text-[#0070f3] uppercase tracking-[0.3em] mb-8 flex items-center gap-3 pointer-events-none">
                        <ArrowRight size={14} /> Engineering Summary
                      </p>
                      
                      <div className="space-y-6 relative z-10">
                        {[
                          { l: 'Spatial Imaging', v: recommendation.category === 'Hybrid' ? 'Exceptional (3D)' : 'Highly Precise' },
                          { l: 'Transient Response', v: recommendation.category === 'Planar' ? 'Nano-Speed' : 'Professional' },
                          { l: 'Drive Efficiency', v: parseInt(recommendation.specs.impedance) < 20 ? 'Optimal for Mobile' : 'Requires High Power' }
                        ].map((stat, idx) => (
                          <div key={idx} className="flex justify-between items-center text-[11px] border-b border-gray-200/50 pb-3">
                            <span className="text-gray-400 font-bold uppercase tracking-widest">{stat.l}</span>
                            <span className="text-gray-900 font-black uppercase tracking-wider">{stat.v}</span>
                          </div>
                        ))}
                      </div>
                      
                      <p className="mt-10 text-xs leading-relaxed text-gray-500 font-medium italic border-t border-gray-200/50 pt-6">
                        "The {recommendation.name} architecture matches your profile with absolute phase coherence and {recommendation.signature.toLowerCase()} tonality."
                      </p>
                    </div>
 
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button 
                        onClick={() => {
                          const event = new CustomEvent('kz-open-product', { detail: recommendation });
                          window.dispatchEvent(event);
                        }}
                        className="flex-1 py-7 bg-black text-white rounded-2xl font-black text-[11px] tracking-[0.4em] uppercase hover:bg-[#0070f3] hover:shadow-[0_20px_40px_rgba(0,112,243,0.3)] transition-all duration-700 shadow-xl"
                      >
                         Initiate Protocol
                      </button>
                      <button 
                        onClick={reset}
                        className="px-8 py-7 border border-gray-200 rounded-2xl text-[10px] font-black text-gray-400 hover:text-black hover:border-black transition-all duration-300 uppercase tracking-[0.3em]"
                      >
                        Reset Profile
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default AIAudioMatcher;
