"use client";

import React from 'react';
import { 
  Globe, 
  Share2, 
  MessageCircle, 
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  PackageCheck
} from 'lucide-react';
import Link from 'next/link';
import EditableText from './EditableText';

const ModernFooter = () => {
  const footerLinks = {
    "The Armory": [
      { name: "Full Inventory", href: "/shop" },
      { name: "Planar Technology", href: "/shop" },
      { name: "Hybrid Evolution", href: "/shop" },
      { name: "Tactical Cables", href: "#" }
    ],
    "Operations": [
      { name: "Track Your Mission", href: "/checkout" },
      { name: "Shipping Protocols", href: "#" },
      { name: "Service & Returns", href: "#" },
      { name: "Technical FAQ", href: "/#faq" }
    ],
    "Organization": [
      { name: "About the Craft", href: "#" },
      { name: "Engineering Blog", href: "#" },
      { name: "B2B Solutions", href: "#" },
      { name: "Affiliate Intel", href: "#" }
    ]
  };

  return (
    <footer className="bg-[#030303] border-t border-white/5 pt-32 pb-16 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80vw] h-[500px] bg-amber-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Newsletter Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 mb-32 p-12 lg:p-20 bg-white/[0.02] border border-white/5 rounded-[64px] relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 transition-transform group-hover:rotate-0 group-hover:scale-125 duration-[2000ms]">
              <Sparkles size={200} className="text-amber-500" />
           </div>

           <div className="max-w-xl text-center lg:text-left space-y-6">
              <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
                 <ShieldCheck className="text-amber-500" />
                 <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.5em]">Intel Subscription</span>
              </div>
              <h3 className="text-4xl lg:text-6xl font-black text-white uppercase tracking-tighter leading-tight">
                 <EditableText value="Join the" path="cms.footer.newsletter_prefix" tagName="span" /> <br /> 
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-200 animate-pulse">
                   <EditableText value="Acoustic Elite" path="cms.footer.newsletter_highlight" tagName="span" />
                 </span>
              </h3>
              <p className="text-gray-500 text-lg font-medium leading-relaxed uppercase tracking-wider">
                 <EditableText 
                   value="Get tactical updates on prototype releases and limited drops directly to your neural link." 
                   path="cms.footer.newsletter_desc" 
                   multiline
                   tagName="span"
                 />
              </p>
           </div>

           <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4 relative z-10">
              <input 
                type="email" 
                placeholder="Secure Email Access" 
                className="bg-black border border-white/10 px-8 py-5 rounded-2xl text-sm font-bold text-white outline-none focus:border-amber-500/50 transition-all w-full sm:w-80 shadow-inner"
              />
              <button className="bg-amber-500 text-black px-12 py-5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-amber-400 transition-all shadow-[0_15px_40px_rgba(245,158,11,0.3)] hover:shadow-[0_20px_50px_rgba(245,158,11,0.5)] active:scale-95 flex items-center justify-center gap-4 group">
                Engage <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </button>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-20 lg:gap-12 mb-32">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 pr-12 space-y-10">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="w-12 h-12 bg-white flex items-center justify-center rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                <span className="text-black font-black text-2xl leading-none">W</span>
              </div>
              <span className="text-3xl font-black tracking-tighter text-white uppercase">
                Waseem's Audio
              </span>
            </Link>
            
            <p className="text-gray-500 text-lg font-medium leading-relaxed max-w-sm">
              <EditableText 
                value="Curating the world's most precise audio equipment. From boutique planar designs to high-performance hybrids, we bring the concert to your ears." 
                path="cms.footer.about_desc" 
                multiline
                tagName="span"
              />
            </p>

            <div className="flex items-center gap-8">
              {[Globe, Share2, MessageCircle, ExternalLink].map((Icon, idx) => (
                <Icon key={idx} size={24} className="text-gray-600 hover:text-white cursor-pointer transition-all hover:scale-110 active:scale-90" />
              ))}
            </div>

            <div className="pt-10 flex flex-col gap-4">
               <div className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-cyan-500 transition-all group-hover:bg-cyan-500 group-hover:text-black">
                     <Mail size={18} />
                  </div>
                  <span className="text-xs font-black text-gray-500 uppercase tracking-widest group-hover:text-white transition-colors">Tactical Support</span>
               </div>
               <div className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-amber-500 transition-all group-hover:bg-amber-500 group-hover:text-black">
                     <PackageCheck size={18} />
                  </div>
                  <span className="text-xs font-black text-gray-500 uppercase tracking-widest group-hover:text-white transition-colors">Mission Tracking</span>
               </div>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-10">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white flex items-center gap-3">
                 <span className="w-4 h-[2px] bg-cyan-500" /> {title}
              </h4>
              <ul className="space-y-6">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="text-gray-500 hover:text-cyan-500 text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 group translate-x-0 hover:translate-x-3"
                    >
                      {link.name}
                      <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-all -translate-y-1" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Global Distribution Status */}
        <div className="border-t border-white/5 py-12 flex flex-col md:row items-center justify-between gap-8 md:flex-row">
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                 <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Global Logistics: Online</span>
              </div>
              <div className="w-[1px] h-4 bg-white/5" />
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                 <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Acoustic Sync: 99.9%</span>
              </div>
           </div>

           <div className="flex flex-col md:flex-row items-center gap-12 text-[9px] font-black text-gray-700 uppercase tracking-[0.3em]">
              <p>© 2026 Waseem's Audio. All Rights Reserved.</p>
              <div className="flex items-center gap-10">
                <Link href="#" className="hover:text-white transition-colors">Privacy Protocols</Link>
                <Link href="#" className="hover:text-white transition-colors">Terms of Engagement</Link>
              </div>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default ModernFooter;
