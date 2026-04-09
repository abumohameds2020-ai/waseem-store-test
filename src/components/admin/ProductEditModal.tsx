"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Plus, Trash2, Image as ImageIcon, Zap, Activity, Type, DollarSign, Layout, Palette, Monitor, Sparkles, History, ChevronDown, Globe, FolderSearch } from 'lucide-react';
import MediaVaultModal from './MediaVaultModal';

interface Product {
  id: string;
  name: string;
  headline?: string;
  description: string;
  category: string;
  driver_config: string;
  price?: number | string;
  is_featured?: boolean;
  status?: 'Draft' | 'Live';
  glow_color?: string;
  slider_headline?: string;
  slider_image?: string;
  chief_note?: string;
  specs: {
    frequency_response: string;
    impedance: string;
    sensitivity: string;
  };
  meta_title?: string;
  meta_keywords?: string;
  signature: string;
  price_range: string;
  local_price: string | number;
  local_stock?: boolean;
  global_price: string | number;
  aliexpress_link?: string;
  local_shipping_time?: string;
  global_shipping_time?: string;
  images: {
    product: string;
    graph: string;
    internal?: string;
    xray_external_image?: string;
    xray_internal_reveal?: string;
  };
  gallery?: string[];
  links: {
    official: string;
  };
  inventory?: {
    stock: number;
    restock_note?: string;
  };
  changelog?: {
    date: string;
    field: string;
    oldValue: string;
    newValue: string;
  }[];
}

interface ProductEditModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
}

const Edit3 = ({ size, className }: any) => (
  <Activity size={size} className={className} />
);

const ProductEditModal: React.FC<ProductEditModalProps> = ({ product, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Product | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [vaultOpenFor, setVaultOpenFor] = useState<{path: string, index?: number} | null>(null);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({ ...product });
    } else {
      setFormData({
        id: 'new',
        name: '',
        description: '',
        category: 'Dynamic',
        driver_config: '10mm Dynamic',
        local_price: 99,
        local_stock: true,
        global_price: 85,
        aliexpress_link: '',
        specs: { frequency_response: '20-40000Hz', impedance: '24Ω', sensitivity: '110dB' },
        signature: 'Balanced',
        price_range: 'Premium',
        images: { product: '', graph: '', internal: '' },
        gallery: [],
        chief_note: '',
        links: { official: '' }
      });
    }
    setShowAIPanel(false);
    setShowTimeline(false);
  }, [product, isOpen]);

  if (!isOpen || !formData) return null;

  const updateField = (path: string, value: any) => {
    const keys = path.split('.');
    const newData = JSON.parse(JSON.stringify(formData));
    let current: any = newData;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setFormData(newData);
  };

  const generateDescription = async () => {
    setIsGenerating(true);
    const prompt = `Write a premium marketing description for the ${formData.name || 'product'} — a ${formData.category} IEM with ${formData.driver_config} driver and ${formData.signature} acoustic signature. Make it technical yet compelling for audiophiles.`;
    
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      if (data.text) {
        updateField('description', data.text);
      } else if (data.error) {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to generate description");
    }
    setIsGenerating(false);
    setShowAIPanel(false);
  };

  const handleUpload = async (path: string, e: React.ChangeEvent<HTMLInputElement>, galleryIndex?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const uploadData = new FormData();
    uploadData.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: uploadData });
      const json = await res.json();
      if (json.url) {
        if (galleryIndex !== undefined) {
          const newGallery = [...(formData.gallery || [])];
          newGallery[galleryIndex] = json.url;
          updateField('gallery', newGallery);
        } else {
          updateField(path, json.url);
        }
      }
    } catch (err) {
      console.error('File upload failed:', err);
    }
    setIsUploading(false);
  };

  const addGalleryItem = () => updateField('gallery', [...(formData.gallery || []), '']);
  const removeGalleryItem = (index: number) => updateField('gallery', (formData.gallery || []).filter((_, i) => i !== index));
  const updateGalleryItem = (index: number, value: string) => {
    const newGallery = [...(formData.gallery || [])];
    newGallery[index] = value;
    updateField('gallery', newGallery);
  };

  const generateSEO = () => {
    updateField('meta_title', `${formData.name} - ${formData.category} Planar IEMs`);
    updateField('meta_keywords', `${formData.name}, KZ Phantom, Audiophile, In-Ear Monitors, ${formData.category}, ${formData.driver_config}`);
  };

  const handleSave = () => {
    // Auto-track changelog before saving
    const entries = [...(formData.changelog || [])];
    if (product && String(product.local_price) !== String(formData.local_price)) {
      entries.push({ date: new Date().toISOString(), field: 'Local Price', oldValue: String(product.local_price ?? 'N/A'), newValue: String(formData.local_price ?? 'N/A') });
    }
    onSave({ ...formData, changelog: entries });
  };

  const SectionTitle = ({ icon: Icon, title }: { icon: any, title: string }) => (
    <div className="flex items-center gap-3 mb-6 pb-2 border-b border-white/5">
      <Icon size={16} className="text-[#0070f3]" />
      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">{title}</h3>
    </div>
  );

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="product-edit-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="bg-[#0a0a0a] w-full max-w-5xl rounded-[40px] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/40">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                {product ? <Edit3 size={18} className="text-blue-500" /> : <Plus size={18} className="text-green-500" />}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-black text-white">{product ? 'Edit Engineering Dossier' : 'New Product Registration'}</h2>
                  {formData.status === 'Draft' && (
                    <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[8px] font-black rounded uppercase">Review Pending</span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{formData.id}</p>
                  <button 
                    onClick={() => updateField('status', formData.status === 'Draft' ? 'Live' : 'Draft')}
                    className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded transition-all ${formData.status === 'Live' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'}`}
                  >
                    {formData.status === 'Live' ? 'Status: Live' : 'Set to Live'}
                  </button>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-full transition-colors"><X size={20} /></button>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-12">

            {/* 1. Core Identity */}
            <section>
              <SectionTitle icon={Type} title="Product Identity & Narrative" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase ml-2">Display Name</label>
                  <input value={formData.name || ''} onChange={(e) => updateField('name', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:border-[#0070f3] outline-none" placeholder="e.g., KZ Symphony" />
                </div>
                <div></div>

                {/* Local Strategy */}
                <div className="p-6 bg-[#ffd700]/5 border border-[#ffd700]/20 rounded-3xl space-y-6">
                   <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-[#ffd700] uppercase tracking-widest flex items-center gap-2"><Zap size={12}/> Local Protocol</span>
                      <div className="flex items-center gap-3">
                         <input type="checkbox" checked={formData.local_stock} onChange={(e) => updateField('local_stock', e.target.checked)} className="w-4 h-4 rounded bg-black border-white/10 text-[#ffd700] focus:ring-[#ffd700]" />
                         <span className="text-[9px] font-black text-gray-500 uppercase">In Stock</span>
                      </div>
                   </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-[9px] font-bold text-gray-600 uppercase ml-1">Local Value ($)</label>
                          <input value={formData.local_price || ''} onChange={(e) => updateField('local_price', e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-[#ffd700]/50" placeholder="120.00" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[9px] font-bold text-gray-600 uppercase ml-1">Est. Delivery (Local)</label>
                          <input value={formData.local_shipping_time || ''} onChange={(e) => updateField('local_shipping_time', e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-[#ffd700]/50" placeholder="e.g. 24h - 48h" />
                       </div>
                    </div>
                </div>

                {/* Global Strategy */}
                <div className="p-6 bg-cyan-500/5 border border-cyan-500/20 rounded-3xl space-y-6">
                   <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2"><Globe size={12}/> Global Supply</span>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <label className="text-[9px] font-bold text-gray-600 uppercase ml-1">Global Value ($)</label>
                         <input value={formData.global_price || ''} onChange={(e) => updateField('global_price', e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-cyan-500/50" placeholder="95.00" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[9px] font-bold text-gray-600 uppercase ml-1">AliExpress Link</label>
                         <input value={formData.aliexpress_link || ''} onChange={(e) => updateField('aliexpress_link', e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs font-mono text-cyan-200 outline-none focus:border-cyan-500/50" placeholder="https://..." />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-bold text-gray-600 uppercase ml-1">Est. Delivery (Global)</label>
                      <input value={formData.global_shipping_time || ''} onChange={(e) => updateField('global_shipping_time', e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs font-bold text-cyan-200 outline-none focus:border-cyan-500/50" placeholder="e.g. 10 - 15 Days" />
                   </div>
                </div>

                {/* Description + AI Hook */}
                <div className="md:col-span-2 space-y-2">
                  <div className="flex items-center justify-between ml-2 mb-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Technical Description / Story</label>
                    <button
                      onClick={() => setShowAIPanel(!showAIPanel)}
                      className="flex items-center gap-2 px-4 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400 text-[9px] font-black uppercase tracking-widest hover:bg-purple-500/20 transition-all"
                    >
                      <Sparkles size={11} />
                      AI Generate
                    </button>
                  </div>

                  {/* AI Panel */}
                  {showAIPanel && (
                    <div className="mb-3 p-5 bg-purple-500/5 border border-purple-500/15 rounded-2xl space-y-3">
                      <div className="flex items-start gap-3">
                        <Sparkles size={14} className="text-purple-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-[10px] font-black text-purple-300 uppercase tracking-widest mb-2">AI Prompt Preview</p>
                          <p className="text-[10px] font-mono text-gray-400 leading-relaxed bg-black/30 rounded-xl p-3">
                            "Write a premium marketing description for the <strong className="text-white">{formData.name || '[Product Name]'}</strong> — a <strong className="text-white">{formData.category}</strong> IEM with <strong className="text-white">{formData.driver_config}</strong> driver and <strong className="text-white">{formData.signature}</strong> acoustic signature. Make it technical yet compelling for audiophiles."
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 pt-1">
                        <button 
                          disabled={isGenerating}
                          onClick={generateDescription}
                          className="flex items-center gap-2 px-5 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-lg shadow-purple-500/20"
                        >
                          {isGenerating ? <span className="animate-spin">⟳</span> : <Sparkles size={10} />}
                          {isGenerating ? 'Synthesizing...' : 'Execute Gemini Generation'}
                        </button>
                        <span className="text-[9px] text-gray-600 font-bold">Ensure API key is linked in Advanced Settings</span>
                      </div>
                    </div>
                  )}

                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => updateField('description', e.target.value)}
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-medium leading-relaxed focus:border-[#0070f3] outline-none resize-none mb-4"
                    placeholder="Describe the acoustic architecture..."
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase ml-2 italic">Exclusive Chief Engineer's Narrative</label>
                  <textarea value={formData.chief_note || ''} onChange={(e) => updateField('chief_note', e.target.value)} rows={2} className="w-full bg-blue-500/5 border border-blue-500/10 rounded-2xl px-6 py-4 text-sm font-medium leading-relaxed focus:border-[#0070f3] outline-none resize-none" placeholder="Insightful engineering comment for this specific model..." />
                </div>
              </div>
            </section>

            {/* 2. Acoustic DNA */}
            <section>
              <SectionTitle icon={Zap} title="Acoustic Engineering DNA" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { label: 'Driver Configuration', path: 'driver_config', placeholder: '10mm Dynamic' },
                  { label: 'Impedance (Resistance)', path: 'specs.impedance', placeholder: '24Ω' },
                  { label: 'Sensitivity (SPL)', path: 'specs.sensitivity', placeholder: '110dB' },
                  { label: 'Freq. Response Scope', path: 'specs.frequency_response', placeholder: '20Hz - 40kHz' },
                  { label: 'Acoustic Signature', path: 'signature', placeholder: 'Balanced / U-Shaped' },
                ].map(({ label, path, placeholder }) => (
                  <div key={path} className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase ml-2">{label}</label>
                    <input
                      value={(path.includes('.') ? (formData as any)[path.split('.')[0]]?.[path.split('.')[1]] : (formData as any)[path]) || ''}
                      onChange={(e) => updateField(path, e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-mono focus:border-[#0070f3] outline-none"
                      placeholder={placeholder}
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* 3. Media Assets */}
            <section>
              <SectionTitle icon={ImageIcon} title="Visual Assets & Blueprint Suite" />
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    { label: 'Primary Product Render URL', path: 'images.product', uploadId: 'upload-primary' },
                    { label: 'Blueprint / X-Ray Image URL', path: 'images.internal', uploadId: 'upload-internal' },
                    { label: 'X-Ray Scanner Base Image', path: 'images.xray_external_image', uploadId: 'upload-xray-ext' },
                    { label: 'X-Ray Scanner Internals Revealed', path: 'images.xray_internal_reveal', uploadId: 'upload-xray-int' },
                  ].map(({ label, path, uploadId }) => (
                    <div key={path} className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase ml-2">{label}</label>
                      <div className="flex gap-2">
                        <input
                          value={(path.includes('.') ? (formData as any)[path.split('.')[0]]?.[path.split('.')[1]] : (formData as any)[path]) || ''}
                          onChange={(e) => updateField(path, e.target.value)}
                          className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-[10px] font-mono focus:border-[#0070f3] outline-none"
                          placeholder="https://..."
                        />
                        <div className="relative flex">
                          <input type="file" className="hidden" id={uploadId} accept="image/*" onChange={(e) => handleUpload(path, e)} />
                          <label htmlFor={uploadId} className="h-full px-4 flex items-center justify-center bg-white/5 border border-white/10 rounded-l-2xl hover:bg-white/10 cursor-pointer transition-all"><Plus size={18} /></label>
                          <button 
                            type="button" 
                            title="Select from Media Vault"
                            onClick={() => setVaultOpenFor({ path })} 
                            className="h-full px-4 flex items-center justify-center bg-white/5 border border-white/10 border-l-0 rounded-r-2xl hover:bg-cyan-500/20 hover:text-cyan-400 cursor-pointer transition-all"
                          >
                            <FolderSearch size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-black/20 p-8 rounded-[32px] border border-white/5">
                  <div className="flex items-center justify-between mb-6">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Detail Gallery Expansion</label>
                    <button onClick={addGalleryItem} className="p-2 bg-[#0070f3]/10 text-[#0070f3] rounded-lg hover:bg-[#0070f3]/20 transition-all flex items-center gap-2 text-[10px] font-black uppercase"><Plus size={14} /> Add Detail Slot</button>
                  </div>
                  <div className="space-y-4">
                    {formData.gallery?.map((url, idx) => (
                      <div key={idx} className="flex gap-4">
                        <input value={url} onChange={(e) => updateGalleryItem(idx, e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-mono focus:border-[#0070f3] outline-none" placeholder="Gallery URL..." />
                        <div className="relative flex">
                          <input type="file" className="hidden" id={`upload-gallery-${idx}`} accept="image/*" onChange={(e) => handleUpload('gallery', e, idx)} />
                          <label htmlFor={`upload-gallery-${idx}`} className="h-full px-4 flex items-center justify-center bg-white/5 border border-white/10 rounded-l-xl hover:bg-white/10 cursor-pointer transition-all"><Plus size={14} /></label>
                          <button 
                            type="button" 
                            title="Select from Media Vault"
                            onClick={() => setVaultOpenFor({ path: 'gallery', index: idx })} 
                            className="h-full px-4 flex items-center justify-center bg-white/5 border border-white/10 border-l-0 rounded-r-xl hover:bg-cyan-500/20 hover:text-cyan-400 cursor-pointer transition-all"
                          >
                            <FolderSearch size={14} />
                          </button>
                        </div>
                        <button onClick={() => removeGalleryItem(idx)} className="text-red-500/50 hover:text-red-500 p-2"><Trash2 size={16} /></button>
                      </div>
                    ))}
                    {(!formData.gallery || formData.gallery.length === 0) && (
                      <div className="text-center py-4 border-2 border-dashed border-white/5 rounded-2xl">
                        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">No additional gallery assets defined</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* 4. Hero Slider & Live Preview */}
            <section>
              <SectionTitle icon={Layout} title="Hero Slider & Visual Identity" />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* 1:1 Live Preview */}
                <div className="lg:col-span-1 space-y-6">
                  <SectionTitle icon={Monitor} title="Command Live-Preview" />
                  <div className="relative group">
                    <div className="w-full bg-[#0a0a0a] border border-white/10 rounded-[40px] p-10 relative overflow-hidden shadow-2xl transition-all duration-500 hover:border-blue-500/30">
                      <div className="absolute inset-0 blur-[80px] opacity-20 pointer-events-none transition-all duration-700" style={{ background: `radial-gradient(circle at center, ${formData.glow_color || '#0070f3'} 0%, transparent 70%)` }} />
                      <div className="relative z-10 space-y-8">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <h4 className="text-[8px] font-black text-blue-500 uppercase tracking-widest">{formData.category} PROTOCOL</h4>
                            <h3 className="text-xl font-black text-white leading-tight">{formData.name || 'UNNAMED_OBJECT'}</h3>
                          </div>
                          <div className="text-sm font-black text-white italic">${formData.price || '0.00'}</div>
                        </div>
                        <div className="aspect-square w-full flex items-center justify-center p-4 relative">
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent h-1 w-full animate-scan z-20" />
                          {formData.images.product ? (
                            <motion.img key={formData.images.product} src={formData.images.product} className="max-h-full object-contain relative z-10 drop-shadow-[0_0_30px_rgba(0,112,243,0.3)]" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} />
                          ) : (
                            <div className="text-center text-gray-800"><ImageIcon size={48} className="mx-auto mb-2 opacity-20" /><p className="text-[8px] font-black uppercase tracking-widest">Awaiting Render</p></div>
                          )}
                        </div>
                        <div className="space-y-3">
                          <div className="h-px bg-white/5 w-full" />
                          <div className="flex justify-between items-center text-[8px] font-black text-gray-500 uppercase tracking-widest">
                            <span>Spec Index: Alpha</span>
                            <span className="text-blue-500">Master Verified</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                      <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest italic">1:1 fidelity simulation of the storefront vibe.</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-8">
                  <div className="p-8 bg-blue-500/5 rounded-[32px] border border-blue-500/10 space-y-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <input type="checkbox" id="is_featured" checked={!!formData.is_featured} onChange={(e) => updateField('is_featured', e.target.checked)} className="w-6 h-6 rounded-lg bg-white/5 border-white/10 text-blue-500 accent-blue-500" />
                        <label htmlFor="is_featured" className="text-sm font-bold text-white select-none cursor-pointer">Set as 'Featured Candidate'</label>
                      </div>
                      {formData.is_featured && <span className="text-[9px] font-black uppercase tracking-widest text-blue-500 animate-pulse">ACTIVE ON LANDING</span>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <label className="text-[10px] font-bold text-gray-500 uppercase ml-2 italic">Aesthetic Render (Transparent PNG)</label>
                        <div className="flex gap-4">
                          <input value={formData.slider_image || ''} onChange={(e) => updateField('slider_image', e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-[10px] font-mono focus:border-[#0070f3] outline-none" placeholder="Slider Render URL..." />
                          <div className="relative">
                            <input type="file" className="hidden" id="upload-slider-img" accept="image/*" onChange={(e) => handleUpload('slider_image', e)} />
                            <label htmlFor="upload-slider-img" className="h-full px-6 flex items-center justify-center bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-2xl hover:bg-blue-500 hover:text-white cursor-pointer transition-all"><Plus size={18} /></label>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase ml-2">Slider Marketing Headline</label>
                        <input value={formData.slider_headline || ''} onChange={(e) => updateField('slider_headline', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:border-[#0070f3] outline-none" placeholder="e.g., Pure Planar Perfection" disabled={!formData.is_featured} />
                      </div>
                      <div className="space-y-2 pt-4">
                        <label className="text-[10px] font-bold text-gray-500 uppercase ml-2">Ambient Glow Identity (HEX)</label>
                        <div className="flex gap-4">
                          <input value={formData.glow_color || '#0070f3'} onChange={(e) => updateField('glow_color', e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-mono focus:border-[#0070f3] outline-none uppercase" placeholder="#0070f3" disabled={!formData.is_featured} />
                          <div className="relative">
                            <input type="color" value={formData.glow_color || '#0070f3'} onChange={(e) => updateField('glow_color', e.target.value)} className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" disabled={!formData.is_featured} />
                            <div className="w-14 h-14 rounded-2xl border border-white/10 shadow-lg shrink-0 pointer-events-none" style={{ backgroundColor: formData.glow_color || '#0070f3', boxShadow: `0 0 20px ${(formData.glow_color || '#0070f3')}44` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 5. SEO */}
            <section>
              <SectionTitle icon={Palette} title="SEO & Search Visibility" />
              <div className="p-8 bg-purple-500/5 rounded-[32px] border border-purple-500/10 space-y-8">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Metadata Optimization Suite</p>
                  <button onClick={generateSEO} className="px-4 py-2 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-xl text-[9px] font-black uppercase hover:bg-purple-500 hover:text-white transition-all flex items-center gap-2">
                    <Zap size={12} /> Auto-Generate SEO Strategy
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase ml-2">Meta Title</label>
                    <input value={formData.meta_title || ''} onChange={(e) => updateField('meta_title', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:border-purple-500 outline-none" placeholder="e.g., KZ PR3 - Planar Perfection IEM" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase ml-2">SEO Keywords (Comma Separated)</label>
                    <input value={formData.meta_keywords || ''} onChange={(e) => updateField('meta_keywords', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs font-mono focus:border-purple-500 outline-none" placeholder="audiophile, planar, kz audio..." />
                  </div>
                </div>
              </div>
            </section>

            {/* 6. Product Timeline */}
            <section>
              <button
                onClick={() => setShowTimeline(!showTimeline)}
                className="w-full flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/5 transition-all"
              >
                <div className="flex items-center gap-3">
                  <History size={14} className="text-amber-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Change History</span>
                  {formData.changelog && formData.changelog.length > 0 && (
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-[8px] font-black rounded-full">{formData.changelog.length} entries</span>
                  )}
                </div>
                <ChevronDown size={14} className={`text-gray-600 transition-transform duration-300 ${showTimeline ? 'rotate-180' : ''}`} />
              </button>
              {showTimeline && (
                <div className="mt-3 space-y-2">
                  {formData.changelog && formData.changelog.length > 0 ? (
                    formData.changelog.slice().reverse().map((entry, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0" />
                        <div className="flex-1 grid grid-cols-3 gap-4">
                          <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest">{entry.field}</span>
                          <span className="text-[9px] font-mono text-gray-500">{entry.oldValue} <span className="text-gray-700 mx-1">→</span> <span className="text-white">{entry.newValue}</span></span>
                          <span className="text-[9px] text-gray-700 text-right">{new Date(entry.date).toLocaleString()}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center border border-white/5 rounded-2xl">
                      <p className="text-[9px] font-black text-gray-700 uppercase tracking-widest">No changes recorded yet. Price or Stock updates will appear here automatically.</p>
                    </div>
                  )}
                </div>
              )}
            </section>

          </div>

          {/* Modal Footer */}
          <div className="p-8 border-t border-white/5 bg-black/40 flex items-center justify-end gap-6">
            <button onClick={onClose} className="text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Discard Alterations</button>
            <button
              onClick={handleSave}
              className="px-10 py-5 bg-[#0070f3] hover:bg-[#0061d5] text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] transition-all flex items-center gap-3 shadow-2xl shadow-blue-500/20"
            >
              <Save size={18} /> Deploy Technical Record
            </button>
          </div>
        </motion.div>
      </motion.div>
      
      <MediaVaultModal 
        key="media-vault-modal-internal"
        isOpen={!!vaultOpenFor} 
        onClose={() => setVaultOpenFor(null)} 
        onSelect={(url) => {
          if (vaultOpenFor) {
            if (vaultOpenFor.path === 'gallery' && vaultOpenFor.index !== undefined) {
              updateGalleryItem(vaultOpenFor.index, url);
            } else {
              updateField(vaultOpenFor.path, url);
            }
          }
        }} 
      />
    </AnimatePresence>
  );
};

export default ProductEditModal;
