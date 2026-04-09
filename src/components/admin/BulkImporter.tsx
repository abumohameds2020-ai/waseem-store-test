"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Database, CheckCircle, AlertCircle, Loader2, FileSpreadsheet, Zap, Sparkles, Image as ImageIcon } from 'lucide-react';

interface BulkImporterProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (products: any[]) => void;
}

const BulkImporter: React.FC<BulkImporterProps> = ({ isOpen, onClose, onImport }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<any[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        setError('Logistics protocol rejected: Please upload a valid CSV manifest.');
        return;
      }
      setFile(selectedFile);
      setError(null);
      parseCSV(selectedFile);
    }
  };

  const parseCSV = (file: File) => {
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const rows = text.split('\n').filter(row => row.trim());
        const headers = rows[0].split(',').map(h => h.trim().toLowerCase());

        // Fetch media vault for deep linking
        const mediaRes = await fetch('/api/upload');
        const mediaVault = await mediaRes.json();

        const linkedMedia: string[] = [];

        const products = rows.slice(1).map((row) => {
          // Handle quoted values with commas (standard CSV parsing)
          const values: string[] = [];
          let current = '';
          let inQuotes = false;
          for (let i = 0; i < row.length; i++) {
            if (row[i] === '"') inQuotes = !inQuotes;
            else if (row[i] === ',' && !inQuotes) { values.push(current.trim()); current = ''; }
            else { current += row[i]; }
          }
          values.push(current.trim());

          const data: any = {};
          headers.forEach((header, i) => {
            data[header] = values[i]?.replace(/^"|"$/g, ''); 
          });

          // 1. Smart Image Mapping (Fallback to Name)
          let mainImage = '';
          const searchName = data.main_image || data.name;

          if (searchName) {
            const fileNamePattern = searchName.toLowerCase();
            const matched = mediaVault.find((m: any) => 
               m.url.toLowerCase().includes(fileNamePattern)
            );
            if (matched) {
              mainImage = matched.url;
              linkedMedia.push(matched.url);
            }
          }

          // 2. Gallery Expansion
          const gallery: string[] = [];
          if (data.gallery_images) {
            const galleryQueries = data.gallery_images.split(';').map((q: string) => q.trim().toLowerCase());
            galleryQueries.forEach((query: string) => {
              const matched = mediaVault.find((m: any) => m.url.toLowerCase().includes(query));
              if (matched) {
                gallery.push(matched.url);
                linkedMedia.push(matched.url);
              }
            });
          }

          // 3. ID Generation
          const safeId = (data.name || 'product').toLowerCase().trim()
            .replace(/ /g, '-')
            .replace(/[^-a-z0-9]/g, '') + '-' + Math.random().toString(36).substr(2, 5);

          return {
            id: safeId,
            status: 'Draft',
            name: data.name || 'Untitled Object',
            description: data.description || `Tactical high-fidelity deployment for ${data.name || 'unidentified unit'}.`,
            local_price: data.local_price || '0',
            global_price: data.global_price || '0',
            aliexpress_link: data.aliexpress_link || '',
            driver_config: data.driver_config || 'Standard Dynamic',
            specs: {
              impedance: data.impedance || '24Ω',
              frequency_response: data.frequency_response || '20-40000Hz',
              sensitivity: data.sensitivity || '110dB'
            },
            local_shipping_time: data.local_shipping_time || '24h',
            global_shipping_time: data.global_shipping_time || '14 Days',
            images: {
              product: mainImage,
              graph: '',
              internal: ''
            },
            gallery: gallery,
            category: data.category || 'Dynamic',
            signature: data.signature || data.sound_signature || 'Balanced',
            driver_config: data.driver_config || data.driver_tech || 'Standard Dynamic',
            price_range: data.price_range || 'Premium',
            links: { official: '' },
            is_featured: false,
            inventory: { stock: 50, restock_note: 'Initial Deployment' },
            changelog: [{ date: new Date().toISOString(), action: 'Bulk Infiltration', user: 'SYSTEM' }]
          };
        });

        // Store linked media to update tags later
        (window as any).__lastLinkedMedia = [...new Set(linkedMedia)];

        setPreview(products);
        setIsProcessing(false);
      } catch (err) {
        console.error(err);
        setError('Protocol Error: Failed to parse CSV manifest. Check column formatting.');
        setIsProcessing(false);
      }
    };
    reader.readAsText(file);
  };

  const handleExecute = async () => {
    if (preview.length > 0) {
      // 3. Asset Vault Sync: Update tags for linked media
      const linked = (window as any).__lastLinkedMedia || [];
      if (linked.length > 0) {
        try {
          await Promise.all(linked.map((url: string) => 
            fetch('/api/upload', {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ filename: url, tag: 'Deployed' })
            })
          ));
        } catch (e) {
          console.error('Failed to sync media tags', e);
        }
      }

      onImport(preview);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-[#0a0a0a] w-full max-w-5xl rounded-[40px] border border-white/10 shadow-3xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 text-blue-500">
              <Sparkles size={22} className="animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white italic">ADVANCED INFILTRATION SYSTEM</h2>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Status: Ready for Bulk Persona Injection</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-full transition-colors"><X size={20} /></button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-12 space-y-12">
          {!file ? (
            <div className="border-2 border-dashed border-white/5 rounded-[40px] p-24 text-center space-y-8 hover:border-blue-500/30 transition-all group cursor-pointer relative">
              <input type="file" accept=".csv" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" id="csv-upload" />
              <div className="w-24 h-24 bg-blue-500/5 rounded-full mx-auto flex items-center justify-center text-gray-700 group-hover:text-blue-500 group-hover:bg-blue-500/10 transition-all">
                <Database size={40} />
              </div>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Connect Logistics Manifest</h3>
                <p className="text-[10px] text-gray-600 font-medium mt-3 leading-relaxed">System expects CSV with: <span className="text-blue-400">name, description, main_image, gallery_images, local_price, driver_config</span>, etc.</p>
              </div>
              <div className="inline-block px-10 py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest group-hover:bg-white/10 transition-all">Select CSV Protocol</div>
            </div>
          ) : (
            <div className="space-y-10">
              <div className="flex items-center justify-between bg-blue-500/5 p-8 rounded-[32px] border border-blue-500/10">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400">
                     <FileSpreadsheet size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{file.name}</p>
                    <p className="text-lg font-black text-white mt-1">{preview.length} Complete Personas Decoded</p>
                  </div>
                </div>
                <button onClick={() => {setFile(null); setPreview([]);}} className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black text-gray-500 uppercase transition-all">Reset Manifest</button>
              </div>

              {isProcessing ? (
                <div className="py-24 text-center space-y-6">
                  <Loader2 className="animate-spin text-blue-500 mx-auto" size={40} />
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest animate-pulse">Running Deep Media Scan & Auto-Linking Registry...</p>
                </div>
              ) : (
                <div className="space-y-6">
                   <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-3">
                     <Zap size={14} className="text-blue-500" /> Logical Projection Preview
                   </h4>
                   <div className="bg-black/40 border border-white/5 rounded-[40px] overflow-hidden">
                      <table className="w-full text-left text-[11px]">
                        <thead>
                          <tr className="border-b border-white/5 bg-white/5">
                            <th className="px-8 py-5 font-black uppercase text-gray-500 tracking-tighter">Persona Identifier</th>
                            <th className="px-8 py-5 font-black uppercase text-gray-500 tracking-tighter">Main Render</th>
                            <th className="px-8 py-5 font-black uppercase text-gray-500 tracking-tighter">Gallery Units</th>
                            <th className="px-8 py-5 font-black uppercase text-gray-500 tracking-tighter text-right">Draft Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {preview.slice(0, 10).map((p, i) => (
                            <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                              <td className="px-8 py-5">
                                 <div className="font-bold text-white text-sm">{p.name}</div>
                                 <div className="text-[10px] text-gray-600 truncate max-w-[200px] mt-1 italic">{p.description.substring(0, 40)}...</div>
                              </td>
                              <td className="px-8 py-5">
                                {p.images.product ? (
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-black/60 rounded-lg p-1 border border-blue-500/20">
                                       <img src={p.images.product} className="w-full h-full object-contain" alt="Match" />
                                    </div>
                                    <span className="text-blue-400 font-black uppercase text-[9px] tracking-widest">Linked</span>
                                  </div>
                                ) : (
                                  <span className="flex items-center gap-2 text-amber-500 font-black uppercase text-[9px] tracking-widest">
                                    <AlertCircle size={12} /> Unlinked
                                  </span>
                                ) }
                              </td>
                              <td className="px-8 py-5">
                                 <div className="flex items-center gap-1">
                                    {p.gallery.length > 0 ? (
                                       <div className="flex items-center justify-center w-8 h-8 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-400 font-black text-[10px]">
                                          {p.gallery.length}
                                       </div>
                                    ) : (
                                       <span className="text-gray-700 font-black text-[10px]">0</span>
                                    )}
                                 </div>
                              </td>
                              <td className="px-8 py-5 text-right font-black text-amber-500 uppercase tracking-widest">DRAFT</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {preview.length > 10 && (
                        <div className="p-6 text-center text-[10px] font-black text-gray-600 uppercase tracking-widest bg-black/20 italic">
                          + {preview.length - 10} additional personas verified and ready for deployment
                        </div>
                      )}
                   </div>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="p-8 bg-red-500/10 border border-red-500/20 rounded-[32px] flex items-center gap-6 text-red-500 animate-shake">
              <AlertCircle size={24} />
              <p className="text-xs font-bold">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-white/5 bg-black/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
             <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Secure Logistics Channel Active</span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={onClose} className="text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Abort Mission</button>
            <button
              disabled={preview.length === 0 || isProcessing}
              onClick={handleExecute}
              className="px-12 py-5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] transition-all flex items-center gap-3 shadow-2xl shadow-blue-500/30 group"
            >
              <Zap size={18} className="group-hover:animate-bounce" /> Execute Final Infiltration
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BulkImporter;
