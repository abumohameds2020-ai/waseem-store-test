"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Search, Image as ImageIcon, Loader2, Upload, Trash2, Filter, CheckSquare, Square, Zap, HardDriveUpload, AlertCircle } from 'lucide-react';
import Image from 'next/image';

interface MediaVaultProps {
  onSelect?: (url: string) => void;
  isModal?: boolean;
}

const MediaVault: React.FC<MediaVaultProps> = ({ onSelect, isModal }) => {
  const [images, setImages] = useState<{url: string, tag: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyUnassigned, setShowOnlyUnassigned] = useState(false);
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/upload');
      const data = await res.json();
      setImages(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress({ current: 0, total: files.length });

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append('file', files[i]);
      try {
        await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        setUploadProgress(prev => ({ ...prev, current: i + 1 }));
      } catch (err) {
        console.error('Upload failed for file:', files[i].name);
      }
    }

    setTimeout(() => {
      setIsUploading(false);
      setUploadProgress({ current: 0, total: 0 });
      fetchImages();
    }, 1000);
  };

  const bulkDelete = async () => {
    if (selectedUrls.length === 0) return;
    if (!confirm(`Purge ${selectedUrls.length} assets from the Media Vault permanently?`)) return;

    try {
      const res = await fetch('/api/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filenames: selectedUrls })
      });
      if (res.ok) {
        setSelectedUrls([]);
        fetchImages();
      }
    } catch (err) {
      console.error('Purge failed', err);
    }
  };

  const bulkTag = async (tag: string) => {
    if (selectedUrls.length === 0) return;
    try {
      await Promise.all(selectedUrls.map(url => 
        fetch('/api/upload', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: url, tag })
        })
      ));
      setSelectedUrls([]);
      fetchImages();
    } catch (err) {
      console.error('Bulk tagging failed', err);
    }
  };

  const toggleSelection = (url: string) => {
    setSelectedUrls(prev => prev.includes(url) ? prev.filter(u => u !== url) : [...prev, url]);
  };

  const copyToClipboard = (e: React.MouseEvent, url: string, index: number) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const updateTag = async (e: React.ChangeEvent<HTMLSelectElement>, url: string) => {
    e.stopPropagation();
    const newTag = e.target.value;
    setImages(prev => prev.map(img => img.url === url ? { ...img, tag: newTag } : img));
    fetch('/api/upload', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: url, tag: newTag })
    }).catch(console.error);
  };

  const filteredImages = images.filter(img => {
    const matchesSearch = img.url.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         img.tag.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUnassigned = showOnlyUnassigned ? img.tag === 'Unassigned' : true;
    return matchesSearch && matchesUnassigned;
  });

  return (
    <div className={`space-y-8 ${isModal ? 'p-6 max-h-[80vh] overflow-y-auto' : ''}`}>
      {/* HUD Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white italic">MEDIA VAULT</h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Audit & Assets Management Protocol</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Action Bar */}
          <div className="relative w-64">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-xs font-bold focus:border-blue-500 outline-none transition-all"
              placeholder="Search assets..."
            />
          </div>

          <button 
            onClick={() => setShowOnlyUnassigned(!showOnlyUnassigned)}
            className={`p-4 rounded-2xl border transition-all flex items-center gap-2 group ${showOnlyUnassigned ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'bg-white/5 border-white/10 text-gray-400'}`}
            title="Filter Unassigned"
          >
            <Filter size={18} className={showOnlyUnassigned ? 'animate-pulse' : ''} />
            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Unassigned</span>
          </button>

          <input type="file" ref={fileInputRef} onChange={handleBulkUpload} multiple className="hidden" accept="image/*" />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 shadow-xl shadow-blue-500/20 disabled:opacity-50"
          >
            {isUploading ? <Loader2 className="animate-spin" size={16} /> : <HardDriveUpload size={16} />}
            {isUploading ? `Uploading (${uploadProgress.current}/${uploadProgress.total})` : 'Infiltrate Assets'}
          </button>
        </div>
      </div>

      {/* Bulk Action Panel */}
      <AnimatePresence>
        {selectedUrls.length > 0 && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-blue-500 p-1 rounded-3xl">
              <div className="bg-black/90 backdrop-blur-xl rounded-[22px] px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center font-black text-sm">{selectedUrls.length}</div>
                   <span className="text-[10px] font-black text-white uppercase tracking-widest">Assets Selected for Operation</span>
                </div>
                <div className="flex items-center gap-4">
                   <select 
                     onChange={(e) => bulkTag(e.target.value)}
                     className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400 outline-none hover:border-blue-500/50 transition-all cursor-pointer"
                   >
                     <option value="">Bulk Categorize...</option>
                     <option value="Product">Product</option>
                     <option value="Header">Header</option>
                     <option value="X-Ray Internal">X-Ray Internal</option>
                     <option value="X-Ray External">X-Ray External</option>
                     <option value="Banner">Banner</option>
                   </select>
                   <button 
                     onClick={bulkDelete}
                     className="flex items-center gap-2 px-6 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest"
                   >
                     <Trash2 size={14} /> Purge Records
                   </button>
                   <button onClick={() => setSelectedUrls([])} className="text-[10px] font-black text-gray-500 uppercase hover:text-white">Deselect All</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex items-center justify-center py-20 bg-white/[0.02] border border-dashed border-white/5 rounded-[40px]">
          <Loader2 className="animate-spin text-blue-500 mr-3" /> Scouring Assets Protocol...
        </div>
      ) : filteredImages.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {filteredImages.map((img, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.02 }}
              onClick={() => {
                if (onSelect) onSelect(img.url);
                else toggleSelection(img.url);
              }}
              className={`bg-black/40 border rounded-3xl overflow-hidden group relative transition-all ${onSelect ? 'cursor-pointer hover:border-cyan-500 border-white/5' : (selectedUrls.includes(img.url) ? 'border-blue-500 ring-1 ring-blue-500/20' : 'border-white/5')}`}
            >
              {/* Checkbox Overlay */}
              {!onSelect && (
                <div className="absolute top-4 right-4 z-20" onClick={e => e.stopPropagation()}>
                  <button 
                    onClick={() => toggleSelection(img.url)}
                    className={`w-6 h-6 rounded-lg border transition-all flex items-center justify-center ${selectedUrls.includes(img.url) ? 'bg-blue-500 border-blue-500 text-white' : 'bg-black/60 border-white/20 text-transparent hover:border-white/40'}`}
                  >
                    <CheckSquare size={14} />
                  </button>
                </div>
              )}

              <div className="aspect-square flex items-center justify-center p-6 bg-white/5 relative">
                <Image src={img.url} alt="Vault item" width={300} height={300} className={`max-h-full object-contain drop-shadow-2xl transition-transform group-hover:scale-110 duration-500 ${selectedUrls.includes(img.url) ? 'scale-90 opacity-60' : ''}`} />
                
                {/* Tag Overlay */}
                <div className="absolute top-2 left-2" onClick={e => e.stopPropagation()}>
                  <select 
                    value={img.tag}
                    onChange={(e) => updateTag(e, img.url)}
                    className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded outline-none border border-white/10 appearance-none cursor-pointer ${img.tag !== 'Unassigned' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-black/60 text-gray-500 hover:bg-white/10 hover:text-white'}`}
                  >
                    <option value="Unassigned" className="bg-black text-gray-500">Unassigned</option>
                    <option value="Header" className="bg-black text-white">Header</option>
                    <option value="Product" className="bg-black text-white">Product</option>
                    <option value="X-Ray Internal" className="bg-black text-cyan-400">X-Ray Internal</option>
                    <option value="X-Ray External" className="bg-black text-cyan-400">X-Ray External</option>
                    <option value="Banner" className="bg-black text-white">Banner</option>
                    <option value="Iconography" className="bg-black text-white">Iconography</option>
                  </select>
                </div>
              </div>
              <div className="p-4 border-t border-white/5 flex items-center justify-between bg-black/60 relative z-10">
                <div className="truncate pr-4 flex-1">
                  <p className="text-[8px] font-mono text-gray-500 truncate" title={img.url.split('/').pop()}>{img.url.split('/').pop()}</p>
                </div>
                <button 
                  onClick={(e) => copyToClipboard(e, img.url, idx)}
                  className={`p-2 rounded-lg transition-all shrink-0 ${copiedIndex === idx ? 'bg-green-500/20 text-green-500' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}
                  title="Copy URL"
                >
                  {copiedIndex === idx ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
              {!onSelect && <div className={`absolute inset-0 pointer-events-none transition-all z-0 ${selectedUrls.includes(img.url) ? 'bg-blue-500/10' : 'bg-transparent group-hover:bg-white/[0.02]'}`} />}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 border-2 border-dashed border-white/5 rounded-[40px] bg-white/[0.01]">
           <AlertCircle size={48} className="text-gray-800 mx-auto mb-4" />
           <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">No media assets matched your filtering criteria</p>
           {showOnlyUnassigned && (
             <button onClick={() => setShowOnlyUnassigned(false)} className="mt-4 text-[9px] font-black text-blue-500 uppercase hover:underline">Reset Filter</button>
           )}
        </div>
      )}
    </div>
  );
};

export default MediaVault;
