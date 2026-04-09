"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ChevronLeft, MapPin, Phone, User, Building, CheckCircle2, Loader2, ArrowRight, ShieldCheck, Mail, Hash, Headphones, FileText } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import SafeImage from '@/components/SafeImage';
import Navbar from '@/components/Navbar';
import { useVisualEditor } from '@/context/VisualEditorContext';
import { toast } from 'react-hot-toast';

export default function CheckoutPage() {
  const { cart, totalPrice, totalCount, clearCart } = useCart();
  const { draftConfig } = useVisualEditor();
  const router = useRouter();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    backupPhone: '',
    address: '',
    city: '',
    zip: '',
    hardware: '',
    notes: ''
  });
  const [error, setError] = useState('');

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.zip) {
      setError('Engineering Protocols Incomplete: Core fields required');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Protocol Error: Invalid Communications Uplink format');
      return false;
    }

    // WhatsApp 11 digits validation
    const phoneDigits = formData.phone.replace(/[^0-9]/g, '');
    if (phoneDigits.length !== 11) {
      setError('Protocol Error: Primary WhatsApp must be exactly 11 digits');
      return false;
    }
    
    if (formData.backupPhone) {
      const backupDigits = formData.backupPhone.replace(/[^0-9]/g, '');
      if (backupDigits.length !== 11) {
        setError('Protocol Error: Backup frequency must be 11 digits if provided');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setError('');
    setIsSubmitting(true);
    
    // Simulate telemetric handshake
    await new Promise(r => setTimeout(r, 2000));
    
    const orderData = {
      customer: formData.name,
      email: formData.email,
      phone: formData.phone,
      backupPhone: formData.backupPhone,
      address: formData.address,
      city: formData.city,
      zip: formData.zip,
      hardware: formData.hardware,
      notes: formData.notes,
      items: cart,
      total: totalPrice,
      status: 'Pending'
    };
    
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      
      if (res.ok) {
        // Capture is complete. Now check if we need to hand off to AliExpress.
        const globalItem = cart.find(item => item.fulfillment === 'global' && item.aliexpress_link);
        
        if (globalItem && globalItem.aliexpress_link) {
          // Handoff to AliExpress
          toast.success('Handoff Protocol Initialized: Redirecting to global hub...');
          await new Promise(r => setTimeout(r, 2000));
          window.location.href = globalItem.aliexpress_link as string;
          return;
        }

        setIsSuccess(true);
        clearCart();
      } else {
        setError('Encryption Failure: Could not transmit order to Command Center');
      }
    } catch (err) {
      setError('Signal Lost: Check your neural link');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0 && !isSuccess) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center p-6">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag size={32} className="text-gray-600" />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Your Arsenal is Empty</h2>
          <Link href="/shop" className="inline-block px-8 py-4 bg-white text-black font-black text-xs uppercase tracking-widest rounded-full hover:bg-cyan-500 transition-colors">
            Return to Armory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      <Navbar />
      
      <div className="container mx-auto px-6 lg:px-12 py-32">
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div 
              key="checkout-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-6xl mx-auto"
            >
              <div className="flex flex-col lg:flex-row gap-16">
                
                {/* Left: Form */}
                <div className="flex-1 space-y-12">
                  <header>
                    <Link href="/shop" className="flex items-center gap-2 text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest mb-6 transition-colors group">
                      <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Armory
                    </Link>
                    <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">Acquisition Protocol</h1>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Finalize your technical dossier for deployment.</p>
                  </header>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    {error && (
                      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] font-black text-red-500 uppercase tracking-widest animate-pulse">
                        {error}
                      </div>
                    )}

                    {/* Row 1: Primary Intel */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Commander Name</label>
                        <div className="relative">
                          <User size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" />
                          <input 
                            type="text" placeholder="Full Name" value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            className="w-full bg-white/5 border border-white/5 hover:border-white/20 focus:border-cyan-500/50 rounded-2xl py-5 pl-14 pr-6 text-sm font-bold text-white outline-none transition-all placeholder:text-gray-700 backdrop-blur-md" 
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Communications Uplink</label>
                        <div className="relative">
                          <Mail size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" />
                          <input 
                            type="email" placeholder="Email Address" value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                            className="w-full bg-white/5 border border-white/5 hover:border-white/20 focus:border-cyan-500/50 rounded-2xl py-5 pl-14 pr-6 text-sm font-bold text-white outline-none transition-all placeholder:text-gray-700 backdrop-blur-md" 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Row 2: Frequency Link */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">WhatsApp Frequency</label>
                        <div className="relative">
                          <Phone size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" />
                          <input 
                            type="tel" placeholder="010XXXXXXXX" value={formData.phone}
                            onChange={e => setFormData({...formData, phone: e.target.value})}
                            className="w-full bg-white/5 border border-white/5 hover:border-white/20 focus:border-cyan-500/50 rounded-2xl py-5 pl-14 pr-6 text-sm font-bold text-white outline-none transition-all placeholder:text-gray-700 backdrop-blur-md" 
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 flex justify-between">
                          <span>Backup Frequency</span>
                          <span className="text-cyan-500/50">(OPTIONAL)</span>
                        </label>
                        <div className="relative">
                          <Hash size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" />
                          <input 
                            type="tel" placeholder="Secondary Phone" value={formData.backupPhone}
                            onChange={e => setFormData({...formData, backupPhone: e.target.value})}
                            className="w-full bg-white/5 border border-white/5 hover:border-white/20 focus:border-cyan-500/50 rounded-2xl py-5 pl-14 pr-6 text-sm font-bold text-white outline-none transition-all placeholder:text-gray-700 backdrop-blur-md" 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Row 3: Deployment Zone Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Intelligence Sector (City)</label>
                        <div className="relative">
                          <Building size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 z-10" />
                          <select 
                            value={formData.city}
                            onChange={e => setFormData({...formData, city: e.target.value})}
                            className="w-full bg-white/5 border border-white/5 hover:border-white/20 focus:border-cyan-500/50 rounded-2xl py-5 pl-14 pr-6 text-sm font-bold text-white outline-none transition-all appearance-none cursor-pointer backdrop-blur-md [&>option]:bg-[#0a0a0a] [&>option]:text-white relative"
                          >
                            <option value="" className="bg-[#0a0a0a] text-white">Select Sector</option>
                            <option value="Cairo" className="bg-[#0a0a0a] text-white">Cairo</option>
                            <option value="Giza" className="bg-[#0a0a0a] text-white">Giza</option>
                            <option value="Alexandria" className="bg-[#0a0a0a] text-white">Alexandria</option>
                            <option value="Delta" className="bg-[#0a0a0a] text-white">Delta Regions</option>
                            <option value="UpperEgypt" className="bg-[#0a0a0a] text-white">Upper Egypt</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Sector Zip Code</label>
                        <div className="relative">
                          <MapPin size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" />
                          <input 
                            type="text" placeholder="Postal Code" value={formData.zip}
                            onChange={e => setFormData({...formData, zip: e.target.value})}
                            className="w-full bg-white/5 border border-white/5 hover:border-white/20 focus:border-cyan-500/50 rounded-2xl py-5 pl-14 pr-6 text-sm font-bold text-white outline-none transition-all placeholder:text-gray-700 backdrop-blur-md" 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Row 4: Full Address */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Deployment Location</label>
                      <div className="relative">
                        <MapPin size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" />
                        <input 
                          type="text" placeholder="Detailed Street Address, Building, Apartment" value={formData.address}
                          onChange={e => setFormData({...formData, address: e.target.value})}
                          className="w-full bg-white/5 border border-white/5 hover:border-white/20 focus:border-cyan-500/50 rounded-2xl py-5 pl-14 pr-6 text-sm font-bold text-white outline-none transition-all placeholder:text-gray-700 backdrop-blur-md" 
                        />
                      </div>
                    </div>

                    {/* Optional Field Intelligence */}
                    <div className="space-y-6 pt-6 border-t border-white/5">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Field Intelligence <span className="text-cyan-500/50">(OPTIONAL)</span></h3>
                      
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Source Hardware</label>
                        <div className="relative">
                          <Headphones size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" />
                          <input 
                            type="text" placeholder="What device will you power these with? (e.g. DAC, PC, Mobile)" value={formData.hardware}
                            onChange={e => setFormData({...formData, hardware: e.target.value})}
                            className="w-full bg-white/5 border border-white/5 hover:border-white/20 focus:border-cyan-500/50 rounded-2xl py-5 pl-14 pr-6 text-sm font-bold text-white outline-none transition-all placeholder:text-gray-700 backdrop-blur-md" 
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Field Notes</label>
                        <div className="relative">
                          <FileText size={16} className="absolute left-5 top-6 -translate-y-1/2 text-gray-600" />
                          <textarea 
                            placeholder="Special instructions for delivery..." 
                            value={formData.notes}
                            onChange={e => setFormData({...formData, notes: e.target.value})}
                            rows={3}
                            className="w-full bg-white/5 border border-white/5 hover:border-white/20 focus:border-cyan-500/50 rounded-2xl py-5 pl-14 pr-6 text-sm font-bold text-white outline-none transition-all placeholder:text-gray-700 backdrop-blur-md resize-none" 
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                          Logistics Status: {cart.length > 0 ? (
                            cart[0].fulfillment === 'global' ? 
                              (draftConfig?.products?.find((p:any)=>p.id===cart[0].id)?.global_shipping_time || 'Calculating Intelligence...') : 
                              (draftConfig?.products?.find((p:any)=>p.id===cart[0].id)?.local_shipping_time || 'Calculating Intelligence...')
                          ) : 'Calculating Intelligence...'}
                        </span>
                      </div>
                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-8 bg-cyan-500 text-black font-black text-sm uppercase tracking-[0.5em] rounded-[32px] shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_60px_rgba(6,182,212,0.7)] animate-[pulse_2s_ease-in-out_infinite] hover:animate-none hover:scale-[1.02] transition-all flex items-center justify-center gap-4 group"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 size={24} className="animate-spin" /> Synchronizing...
                          </>
                        ) : (
                          <>
                            Confirm Deployment <ArrowRight size={20} className="group-hover:translate-x-3 transition-transform" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Right: Summary */}
                <div className="w-full lg:w-[400px]">
                  <div className="sticky top-40 bg-white/[0.03] border border-white/5 rounded-[40px] p-10 space-y-10">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Arsenal Manifest</h3>
                    
                    <div className="space-y-6">
                      {cart.map(item => {
                        const productDetails = draftConfig?.products?.find((p: any) => p.id === item.id);
                        return (
                          <div key={`${item.id}-${item.fulfillment}`} className="flex gap-4 items-center">
                            <div className="w-16 h-16 bg-white/5 rounded-2xl border border-white/5 p-2 shrink-0">
                              <SafeImage src={item.image} alt={item.name} className="w-full h-full object-contain" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2 truncate">
                                {item.name}
                                <span className={`px-1.5 py-[2px] text-[8px] rounded ${item.fulfillment === 'global' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                  [{item.fulfillment.toUpperCase()}]
                                </span>
                              </h4>
                              <div className="text-[9px] font-mono text-gray-500 uppercase mt-2 tracking-widest border border-white/5 bg-black/40 p-2 rounded-lg">
                                {productDetails?.driver_config || 'Precision Config'} • {productDetails?.specs?.impedance || 'Standard Ω'}
                              </div>
                              <p className="text-[8px] text-gray-500 font-bold uppercase mt-1">QTY: {item.quantity}</p>
                            </div>
                            <div className="text-[10px] font-black text-white">${(item.price * item.quantity).toFixed(2)}</div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Tactical Access Code */}
                    <div className="space-y-3 pt-6 border-t border-white/5">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Tactical Access Code</label>
                      <div className="relative flex gap-2">
                        <input type="text" placeholder="Enter Promo Code..." className="flex-1 bg-white/5 backdrop-blur-[10px] border border-white/5 rounded-2xl py-4 px-6 text-xs font-mono text-white outline-none focus:border-cyan-500/50" />
                        <button type="button" className="px-6 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] uppercase font-black tracking-widest transition-colors text-white">Apply</button>
                      </div>
                    </div>

                    <div className="pt-10 border-t border-white/5 space-y-6">
                      <div className="flex justify-between items-center">
                         <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Operational Count</span>
                         <span className="text-sm font-bold">{totalCount} Models</span>
                      </div>
                      <div className="flex flex-col gap-2 border-t border-white/5 pt-6 mt-2">
                         <div className="flex items-center gap-1.5 text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.8)] self-end">
                           <ShieldCheck size={12} />
                           <span className="text-[8px] font-black uppercase tracking-widest">Verified Authentic Gear</span>
                         </div>
                         <div className="flex justify-between items-end">
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Grand Total</span>
                            <span className="text-4xl font-serif font-black text-cyan-500 tracking-tighter">${totalPrice.toFixed(2)}</span>
                         </div>
                      </div>
                    </div>

                    <div className="p-6 bg-cyan-500/5 border border-cyan-500/10 rounded-2xl flex items-center gap-4">
                       <CheckCircle2 size={24} className="text-cyan-500" />
                       <div className="text-[8px] font-bold text-gray-400 uppercase leading-relaxed tracking-widest">
                         Acquisition is non-reversible once deployment signal is sent.
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="success-message"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-xl mx-auto text-center space-y-12 py-20"
            >
              <div className="relative mx-auto w-48 h-48 flex items-center justify-center">
                {/* Radar Animation Layers */}
                <div className="absolute inset-0 border border-cyan-500/20 rounded-full" />
                <div className="absolute inset-4 border border-cyan-500/10 rounded-full" />
                <div className="absolute inset-8 border border-cyan-500/5 rounded-full" />
                
                {/* Rotating Sweep */}
                <motion.div 
                   animate={{ rotate: 360 }}
                   transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                   className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-transparent rounded-full"
                />

                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 10, stiffness: 100, delay: 0.2 }}
                  className="relative z-10 w-24 h-24 bg-cyan-500 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.4)]"
                >
                  <CheckCircle2 size={48} className="text-black" />
                </motion.div>
                <div className="absolute inset-0 border-2 border-cyan-500 rounded-full animate-ping opacity-20" />
              </div>

              <div className="space-y-6">
                <h1 className="text-5xl font-black uppercase tracking-tighter">Mission Accomplished</h1>
                <div className="flex flex-col gap-2">
                   <p className="text-cyan-500 font-black text-xs uppercase tracking-[0.3em] animate-pulse">Your Gear is being prepped for dispatch</p>
                   <p className="text-gray-500 font-medium leading-relaxed max-w-sm mx-auto">
                     Your acquisition request is being processed. 
                     Our tactical units will reach out via WhatsApp shortly to finalize deployment.
                   </p>
                </div>
                <div className="pt-8 flex flex-col gap-4">
                   <Link href="/shop" className="w-full py-6 bg-white text-black font-black text-[12px] uppercase tracking-[0.4em] rounded-[24px] hover:bg-gray-200 transition-all shadow-xl text-center">
                     Return to Arsenal
                   </Link>
                   <button 
                      onClick={() => {
                        const text = `I just secured my next audio upgrade from Waseem's Audio! Check my acquisition dossier: ORD-${Math.floor(Math.random() * 99999)}`;
                        const url = window.location.origin;
                        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
                      }}
                      className="w-full py-6 bg-white/5 border border-white/10 text-white font-black text-[12px] uppercase tracking-[0.4em] rounded-[24px] hover:bg-white/10 transition-all flex items-center justify-center gap-4"
                    >
                      Share Your Acquisition
                    </button>
                   <p className="text-[9px] font-black text-gray-700 uppercase tracking-widest">Order Reference: ORD-{Math.floor(Math.random() * 99999)}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
