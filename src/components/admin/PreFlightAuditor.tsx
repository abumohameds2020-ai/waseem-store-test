"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, AlertTriangle, FileSearch, Database, Zap, HardDrive, BarChart3, CheckCircle2, XCircle, Info } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  status?: string;
  local_price: any;
  description: string;
  images: { product: string };
  gallery?: string[];
}

interface PreFlightAuditorProps {
  products: Product[];
}

const PreFlightAuditor: React.FC<PreFlightAuditorProps> = ({ products }) => {
  const [mediaVault, setMediaVault] = useState<{url: string, tag: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/upload');
      const data = await res.json();
      setMediaVault(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // 1. Stats Calculation
  const totalAssets = mediaVault.length;
  const deployedAssets = mediaVault.filter(m => m.tag === 'Deployed' || m.tag === 'Product').length;
  const unassignedAssets = mediaVault.filter(m => m.tag === 'Unassigned').length;

  const liveProducts = products.filter(p => !p.status || p.status === 'Live').length;
  const draftProducts = products.filter(p => p.status === 'Draft').length;

  // 2. Asset Gap Analysis
  const assetGaps = products.map(p => {
    const hasMain = !!p.images.product;
    const hasGallery = p.gallery && p.gallery.length > 0;
    const mainFoundInVault = mediaVault.some(m => m.url === p.images.product);
    
    return {
      name: p.name,
      id: p.id,
      mainOk: hasMain && mainFoundInVault,
      galleryStatus: hasGallery ? `${p.gallery?.length} Units` : '0 Units',
      missing: !hasMain || !mainFoundInVault
    };
  }).filter(gap => gap.missing);

  // 3. Health Check (Drafts missing data)
  const healthIssues = products.filter(p => p.status === 'Draft').map(p => {
    const missingPrice = !p.local_price || p.local_price === '0' || p.local_price === 0;
    const missingDesc = !p.description || p.description.length < 20;
    return {
      name: p.name,
      id: p.id,
      missingPrice,
      missingDesc
    };
  }).filter(issue => issue.missingPrice || issue.missingDesc);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase text-gray-500 tracking-[0.3em]">Calibrating Control Room...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white italic">PRE-FLIGHT AUDITOR</h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Strategic Integrity Control Room</p>
        </div>
        <div className="px-6 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center gap-3">
           <ShieldCheck size={16} className="text-blue-500" />
           <span className="text-[10px] font-black text-white uppercase tracking-widest">Protocol V2.0 Active</span>
        </div>
      </div>

      {/* 1. Live Sync Status Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 bg-black/40 border border-white/5 rounded-[40px] space-y-6">
           <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Asset Repository</span>
              <HardDrive size={18} className="text-blue-500" />
           </div>
           <div className="flex items-end gap-3">
              <span className="text-4xl font-black text-white">{totalAssets}</span>
              <span className="text-[10px] font-black text-gray-600 mb-2 uppercase">Total Files</span>
           </div>
           <div className="space-y-2">
              <div className="flex justify-between text-[9px] font-black uppercase">
                 <span className="text-emerald-500">Deployed</span>
                 <span className="text-white">{deployedAssets}</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500" style={{ width: `${(deployedAssets/totalAssets)*100}%` }} />
              </div>
           </div>
        </div>

        <div className="p-8 bg-black/40 border border-white/5 rounded-[40px] space-y-6">
           <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Infiltration Status</span>
              <Zap size={18} className="text-amber-500" />
           </div>
           <div className="flex items-end gap-3">
              <span className="text-4xl font-black text-white">{draftProducts + liveProducts}</span>
              <span className="text-[10px] font-black text-gray-600 mb-2 uppercase">Core Units</span>
           </div>
           <div className="space-y-2">
              <div className="flex justify-between text-[9px] font-black uppercase">
                 <span className="text-amber-500">Drafts Pending Review</span>
                 <span className="text-white">{draftProducts}</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-amber-500" style={{ width: `${(draftProducts/(draftProducts+liveProducts))*100}%` }} />
              </div>
           </div>
        </div>

        <div className="p-8 bg-black/40 border border-white/5 rounded-[40px] space-y-6">
           <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Integrity Score</span>
              <BarChart3 size={18} className="text-purple-500" />
           </div>
           <div className="flex items-end gap-3">
              <span className="text-4xl font-black text-white">{Math.max(0, 100 - (assetGaps.length + healthIssues.length))}%</span>
              <span className="text-[10px] font-black text-gray-600 mb-2 uppercase">Mission Readiness</span>
           </div>
           <div className="flex gap-2">
              <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-purple-500" style={{ width: '85%' }} />
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* 2. Asset Gap Analysis */}
        <div className="space-y-6">
           <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                 <FileSearch size={18} className="text-blue-500" /> Asset Gap Analysis
              </h3>
              {assetGaps.length === 0 && <span className="text-[9px] font-black text-emerald-500 uppercase">Synchronized</span>}
           </div>
           <div className="bg-[#0a0a0a] border border-white/5 rounded-[32px] overflow-hidden">
              {assetGaps.length > 0 ? (
                <table className="w-full text-left text-[10px]">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/5">
                      <th className="px-6 py-4 font-black uppercase text-gray-500">Model ID</th>
                      <th className="px-6 py-4 font-black uppercase text-gray-500">Main Render</th>
                      <th className="px-6 py-4 font-black uppercase text-gray-500">Gallery</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assetGaps.map((gap, idx) => (
                      <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.02]">
                        <td className="px-6 py-4 font-bold text-white uppercase truncate max-w-[120px]">{gap.name}</td>
                        <td className="px-6 py-4">
                           {gap.mainOk ? <CheckCircle2 size={14} className="text-emerald-500" /> : <XCircle size={14} className="text-rose-500" />}
                        </td>
                        <td className="px-6 py-4 font-mono text-gray-500">{gap.galleryStatus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-20 text-center">
                   <ShieldCheck className="mx-auto mb-4 text-emerald-500 opacity-20" size={40} />
                   <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">All models successfully paired with visual assets</p>
                </div>
              )}
           </div>
        </div>

        {/* 3. Health Check */}
        <div className="space-y-6">
           <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                 <AlertTriangle size={18} className="text-amber-500" /> Persona Health Check
              </h3>
              {healthIssues.length === 0 && <span className="text-[9px] font-black text-emerald-500 uppercase">Validated</span>}
           </div>
           <div className="bg-[#0a0a0a] border border-white/5 rounded-[32px] overflow-hidden">
              {healthIssues.length > 0 ? (
                <table className="w-full text-left text-[10px]">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/5">
                      <th className="px-6 py-4 font-black uppercase text-gray-500">Object Identification</th>
                      <th className="px-6 py-4 font-black uppercase text-gray-500">Price Check</th>
                      <th className="px-6 py-4 font-black uppercase text-gray-500">Intel Check</th>
                    </tr>
                  </thead>
                  <tbody>
                    {healthIssues.map((issue, idx) => (
                      <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.02]">
                        <td className="px-6 py-4 font-bold text-white uppercase truncate max-w-[120px]">{issue.name}</td>
                        <td className="px-6 py-4">
                           {issue.missingPrice ? <div className="text-rose-500 flex items-center gap-1 font-black"><AlertTriangle size={10} /> MISSING</div> : <CheckCircle2 size={14} className="text-emerald-500" />}
                        </td>
                        <td className="px-6 py-4">
                           {issue.missingDesc ? <div className="text-rose-500 flex items-center gap-1 font-black"><AlertTriangle size={10} /> INCOMPLETE</div> : <CheckCircle2 size={14} className="text-emerald-500" />}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-20 text-center">
                   <CheckCircle2 className="mx-auto mb-4 text-emerald-500 opacity-20" size={40} />
                   <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">All draft personas fully calibrated for deployment</p>
                </div>
              )}
           </div>
        </div>
      </div>

      {/* Action Recommendation */}
      {(assetGaps.length > 0 || healthIssues.length > 0) && (
        <div className="p-8 bg-blue-500/5 border border-blue-500/20 rounded-[40px] flex items-center gap-6">
           <div className="w-12 h-12 bg-blue-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Info size={24} />
           </div>
           <div className="flex-1">
              <h4 className="text-xs font-black text-white uppercase tracking-widest">Pre-Flight Recommendation</h4>
              <p className="text-[10px] text-gray-500 font-medium mt-1 leading-relaxed">
                Detected incomplete records. It is highly recommended to <span className="text-blue-400">upload missing assets to the Media Vault</span> or use the <span className="text-blue-400">Bulk Infiltration tool</span> to re-inject missing persona data before taking these products Live.
              </p>
           </div>
        </div>
      )}
    </div>
  );
};

export default PreFlightAuditor;
