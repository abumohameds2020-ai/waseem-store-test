"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, TrendingUp, Users, Zap, Hash, BarChart3, 
  Share2, MessageSquare, Award, Brain, Activity, 
  MousePointer2, Layers, DollarSign, ArrowUpRight, 
  Bot, AlertCircle, ShoppingCart, Loader2, CheckCircle
} from 'lucide-react';
import { trackTacticalEvent } from '@/utils/analytics';

const MarketingIntelligence = () => {
  const [activeSegment, setActiveSegment] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState<string | null>(null);
  const [liveData, setLiveData] = useState<any>(null);

  useEffect(() => {
    // Simulate fetching live performance data from handshake
    const fetchLiveStats = async () => {
      // In real scenario, this calls /api/admin or a dedicated marketing analytics endpoint
      const res = await fetch('/api/admin');
      const data = await res.json();
      setLiveData(data.settings?.marketing || {});
    };
    fetchLiveStats();
  }, []);

  const factions = [
    { id: 'bass', name: 'Bass Hunters', color: 'blue', count: 1240, ctr: '4.2%', aov: '$180', growth: '+12%', interest: 'Dynamic Drivers, Sub-bass' },
    { id: 'pro', name: 'Pro-Gamers', color: 'cyan', count: 850, ctr: '3.8%', aov: '$140', growth: '+25%', interest: 'Imaging, Clarity, Latency' },
    { id: 'hi-fi', name: 'High-Ticket Audiophiles', color: 'purple', count: 420, ctr: '2.1%', aov: '$450', growth: '+5%', interest: 'Planar Magnetic, Frequency Response' },
  ];

  const adsPerformance = [
    { platform: 'Meta CAPI', spend: '$1,200', roas: '4.5x', events: 12400, active: !!liveData?.meta_token },
    { platform: 'TikTok Events', spend: '$800', roas: '3.2x', events: 8900, active: !!liveData?.tiktok_token },
    { platform: 'GTM Server-Side', spend: 'N/A', roas: 'Sync', events: 15600, active: !!liveData?.gtm_id },
  ];

  const runAction = async (actionId: string, label: string) => {
    setIsSyncing(actionId);
    await trackTacticalEvent('ADMIN_ACTION', { action: actionId, label });
    // Mock simulation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSyncing(null);
    alert(`${label} Protocol Successfully Executed.`);
  };

  return (
    <div className="space-y-10 pb-20">
      {/* HUD Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase underline decoration-cyan-500/50 underline-offset-8">Marketing Intelligence Hub</h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.5em] mt-3">Tactical Analytics & Event Synchronization Protocol</p>
        </div>
        <div className="flex gap-4">
           <div className={`px-6 py-3 rounded-2xl flex items-center gap-3 border ${liveData?.stape_url ? 'bg-amber-500/10 border-amber-500/20' : 'bg-white/5 border-white/10'}`}>
              <div className={`w-2 h-2 rounded-full ${liveData?.stape_url ? 'bg-amber-500 animate-pulse' : 'bg-gray-600'}`} />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">
                Server-Side: {liveData?.stape_url ? 'ESTABLISHED' : 'OFFLINE'}
              </span>
           </div>
           <div className={`px-6 py-3 rounded-2xl flex items-center gap-3 border ${liveData?.meta_token ? 'bg-cyan-500/10 border-cyan-500/20' : 'bg-white/5 border-white/10'}`}>
              <div className={`w-2 h-2 rounded-full ${liveData?.meta_token ? 'bg-emerald-500 animate-pulse' : 'bg-gray-600'}`} />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">
                Omni-Uplink: {liveData?.meta_token ? 'ACTIVE' : 'IDLE'}
              </span>
           </div>
        </div>
      </div>

      {/* 1. The Omni-Uplink Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {adsPerformance.map((ad, i) => (
          <div key={i} className={`p-8 bg-black/40 border rounded-[40px] space-y-6 group transition-all ${ad.active ? 'border-cyan-500/30' : 'border-white/5 opacity-50'}`}>
             <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{ad.platform}</span>
                <Share2 size={18} className={ad.active ? 'text-cyan-500' : 'text-gray-700'} />
             </div>
             <div className="flex items-end justify-between">
                <div>
                  <p className="text-4xl font-black text-white tracking-tighter">{ad.roas}</p>
                  <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mt-1">Real-Time ROAS</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-emerald-400">{ad.spend}</p>
                  <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mt-1">Ad Spend</p>
                </div>
             </div>
             <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-bold">
                <span className="text-gray-400">{ad.events.toLocaleString()} Signal Events</span>
                <span className={ad.active ? 'text-emerald-500 flex items-center gap-1' : 'text-gray-600'}>
                   {ad.active ? 'Synchronized' : 'Offline'} {ad.active && <Zap size={10} />}
                </span>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* 2. Behavioral DNA & Segmentation (The Brain) */}
        <div className="space-y-6">
           <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
              <Brain size={18} className="text-purple-500" /> Behavioral DNA Factions
           </h3>
           <div className="bg-[#0a0a0a] border border-white/5 rounded-[40px] overflow-hidden">
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="border-b border-white/5 bg-white/5">
                    <th className="px-8 py-5 font-black uppercase text-gray-500 tracking-tighter">Faction Profile</th>
                    <th className="px-8 py-5 font-black uppercase text-gray-500 tracking-tighter">Volume</th>
                    <th className="px-8 py-5 font-black uppercase text-gray-500 tracking-tighter">CTR / AOV</th>
                    <th className="px-8 py-5 font-black uppercase text-gray-500 tracking-tighter text-right">Growth</th>
                  </tr>
                </thead>
                <tbody>
                  {factions.map((f) => (
                    <tr key={f.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => setActiveSegment(f.id)}>
                      <td className="px-8 py-5">
                         <div className="font-bold text-white uppercase">{f.name}</div>
                         <div className="text-[9px] text-gray-600 mt-1 italic">{f.interest}</div>
                      </td>
                      <td className="px-8 py-5 font-mono text-gray-400">{f.count}</td>
                      <td className="px-8 py-5">
                         <div className="text-cyan-400 font-bold">{f.ctr}</div>
                         <div className="text-white font-black">{f.aov}</div>
                      </td>
                      <td className="px-8 py-5 text-right font-black text-emerald-500">{f.growth}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>

           {/* Interest Heatmap Simulator */}
           <div className="p-8 bg-[#0a0a0a] border border-white/5 rounded-[40px] space-y-6">
              <div className="flex items-center justify-between">
                 <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Feature Interest Heatmap</h4>
                 <Activity size={16} className="text-rose-500" />
              </div>
              <div className="space-y-4">
                 {[
                   { label: 'Planar Driver Tech', value: 85, color: 'cyan' },
                   { label: 'X-Ray Scanner Usage', value: 62, color: 'blue' },
                   { label: 'Sound Signature Match', value: 94, color: 'purple' },
                   { label: 'Local Shipping Urgency', value: 45, color: 'amber' },
                 ].map((item, idx) => (
                   <div key={idx} className="space-y-2">
                      <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                         <span className="text-gray-300">{item.label}</span>
                         <span className="text-white">{item.value}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                         <div className={`h-full bg-${item.color}-500`} style={{ width: `${item.value}%` }} />
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* 4. AI Recommendation HUD */}
        <div className="space-y-6">
           <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
              <Bot size={18} className="text-cyan-500" /> Intelligence Recommendations
           </h3>
           <div className="space-y-4">
              <div className="p-8 bg-blue-500/5 border border-blue-500/20 rounded-[40px] flex items-start gap-6 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[60px] group-hover:bg-blue-500/20 transition-all" />
                 <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center shrink-0 border border-blue-500/30">
                    <Target size={24} className="text-blue-400" />
                 </div>
                 <div className="space-y-3">
                    <h4 className="text-xs font-black text-white uppercase tracking-widest">Opportunity Detected: Alexandria High-Value Segment</h4>
                    <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                      "Based on high engagement for the <span className="text-blue-400 font-bold">KZ PR3</span> Planar in Alexandria/Egypt, we recommend increasing Meta budget by <span className="text-emerald-400 font-bold">15%</span> for the 'Analytical' creative set."
                    </p>
                    <button 
                      onClick={() => runAction('APPLY_AD_MANAGER', 'Increase Meta Budget (+15%)')}
                      disabled={isSyncing === 'APPLY_AD_MANAGER'}
                      className="px-6 py-2.5 bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-2"
                    >
                       {isSyncing === 'APPLY_AD_MANAGER' ? <Loader2 size={12} className="animate-spin" /> : <TrendingUp size={12} />}
                       Apply to Ad Manager
                    </button>
                 </div>
              </div>

              <div className="p-8 bg-purple-500/5 border border-purple-500/20 rounded-[40px] flex items-start gap-6 relative overflow-hidden group">
                 <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center shrink-0 border border-purple-500/30">
                    <Hash size={24} className="text-purple-400" />
                 </div>
                 <div className="space-y-3">
                    <h4 className="text-xs font-black text-white uppercase tracking-widest">Dynamic Retargeting Update</h4>
                    <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                      Automatically synced <span className="text-purple-400 font-bold">240 new 'Bass Hunters'</span> to TikTok Custom Audiences. Deploying 'Extreme Bass' creative sequence...
                    </p>
                    <div className="flex items-center gap-2 text-[9px] font-black text-emerald-500 uppercase">
                       <Zap size={10} /> Sync Complete
                    </div>
                 </div>
              </div>
           </div>

           {/* Social Proof Scraper (Automated Trust) */}
           <div className="space-y-6 pt-6">
              <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                 <MessageSquare size={18} className="text-emerald-500" /> Verified Tactical Feedback
              </h3>
              <div className="grid grid-cols-2 gap-4">
                 {[
                   { user: '@ziko_audiophile', platform: 'Instagram', text: 'The Planar clarity on PR3 is insane for the price.', rating: 5 },
                   { user: 'Ahmed G.', platform: 'Facebook', text: 'Shipping to Cairo took 2 days. Absolute beasts.', rating: 5 },
                 ].map((rev, idx) => (
                   <div key={idx} className="p-6 bg-[#0a0a0a] border border-white/5 rounded-3xl space-y-4">
                      <div className="flex items-center justify-between">
                         <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">{rev.platform}</span>
                         <div className="flex gap-0.5">
                            {[...Array(rev.rating)].map((_, i) => <Award key={i} size={10} className="text-amber-500" />)}
                         </div>
                      </div>
                      <p className="text-[11px] text-white font-medium italic">"{rev.text}"</p>
                      <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{rev.user}</div>
                   </div>
                 ))}
              </div>
              <button 
                onClick={() => runAction('SCRAPER_SCAN', 'Social Feedback Refresh')}
                disabled={isSyncing === 'SCRAPER_SCAN'}
                className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all text-gray-400 flex items-center justify-center gap-3"
              >
                 {isSyncing === 'SCRAPER_SCAN' ? <Loader2 size={14} className="animate-spin" /> : <Activity size={14} />}
                 {isSyncing === 'SCRAPER_SCAN' ? 'Initializing Strategic Scrape...' : 'Trigger Scraper Scan (Manual Sync)'}
              </button>
           </div>
        </div>
      </div>

      {/* 5. Precision Retargeting & Audience Builder */}
      <div className="p-10 bg-[#0a0a0a] border border-white/5 rounded-[40px] space-y-10">
         <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-white flex items-center gap-3 italic uppercase"><Layers size={22} className="text-cyan-500" /> Precision Audience Architecture</h3>
            <button 
              onClick={() => runAction('COMMIT_SOCIAL_APIS', 'Push Custom Audiences')}
              disabled={isSyncing === 'COMMIT_SOCIAL_APIS'}
              className="px-8 py-3 bg-cyan-500 text-black rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-cyan-500/20 transition-all hover:scale-105 flex items-center gap-3"
            >
               {isSyncing === 'COMMIT_SOCIAL_APIS' ? <Loader2 size={16} className="animate-spin" /> : <Share2 size={16} />}
               Commit To Social APIs
            </button>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Sound: Bass Heavy', sync: 'Live', source: 'Quiz/DNA', count: '4.2k' },
              { label: 'Signature: Analytical', sync: 'Pending', source: 'Product Scroll', count: '1.8k' },
              { label: 'Tier: High-Ticket', sync: 'Live', source: 'Checkout Begun', count: '640' },
              { label: 'Geo: Alexandria Hub', sync: 'Live', source: 'Local Interest', count: '2.5k' },
            ].map((aud, idx) => (
              <div key={idx} className="p-6 bg-black/40 border border-white/5 rounded-3xl space-y-4 relative group hover:border-cyan-500/50 transition-all">
                 <div className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{aud.source}</div>
                 <div className="text-lg font-black text-white uppercase italic">{aud.label}</div>
                 <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-white tracking-tighter">{aud.count}</span>
                    <span className="text-[8px] font-black text-gray-500 uppercase">Profiles</span>
                 </div>
                 <div className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md inline-block ${aud.sync === 'Live' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                    Sync {aud.sync}
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default MarketingIntelligence;
