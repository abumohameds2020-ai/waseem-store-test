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
  ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  const footerLinks = {
    "Shop": [
      { name: "All IEMs", href: "/#products" },
      { name: "Planar Series", href: "/#products" },
      { name: "Hybrid Tech", href: "/#products" },
      { name: "Accessories", href: "#" }
    ],
    "Support": [
      { name: "Shipping Policy", href: "#" },
      { name: "Warranty & Returns", href: "#" },
      { name: "FAQ", href: "/#faq" },
      { name: "Contact Us", href: "#" }
    ],
    "Company": [
      { name: "About Waseem's", href: "#" },
      { name: "Audiophile Blog", href: "#" },
      { name: "Wholesale", href: "#" },
      { name: "Affiliate", href: "#" }
    ]
  };

  return (
    <footer className="bg-white border-t border-gray-100 pt-24 pb-12">
      <div className="linsoul-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-20">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 pr-12">
            <Link href="/" className="flex items-center gap-3 mb-8 group">
              <div className="w-8 h-8 bg-black flex items-center justify-center rounded-sm">
                <span className="text-white font-black text-lg leading-none">W</span>
              </div>
              <span className="text-xl font-serif font-bold tracking-tight text-black">
                Waseem's Audio
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-sm">
              Curating the world's most precise audio equipment. From boutique planar designs to high-performance hybrids, we bring the concert to your ears.
            </p>
            <div className="flex items-center gap-6">
              <Globe size={20} className="text-gray-400 hover:text-black cursor-pointer transition-colors" />
               <Share2 size={20} className="text-gray-400 hover:text-black cursor-pointer transition-colors" />
              <MessageCircle size={20} className="text-gray-400 hover:text-black cursor-pointer transition-colors" />
              <ExternalLink size={20} className="text-gray-400 hover:text-black cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 mb-6 font-sans">
                {title}
              </h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="text-gray-500 hover:text-[#0070f3] text-sm transition-colors flex items-center gap-1 group"
                    >
                      {link.name}
                      <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-all -translate-y-0.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter / Contact Bar */}
        <div className="border-y border-gray-100 py-12 mb-12 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="flex flex-col md:flex-row items-center gap-8 text-sm font-medium text-gray-600">
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-[#0070f3]" />
              <span>sales@waseems-audio.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-[#0070f3]" />
              <span>+1 (888) LUX-AUDIO</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-[#0070f3]" />
              <span>Global Distribution</span>
            </div>
          </div>
          
          <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4">
            <input 
              type="email" 
              placeholder="Newsletter Subscription" 
              className="bg-gray-50 border border-gray-100 px-6 py-3 rounded-md text-sm outline-none focus:border-black transition-colors w-full sm:w-72"
            />
            <button className="bg-black text-white px-8 py-3 rounded-md text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
              Join
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">
          <p>© 2026 Waseem's Audio. All Rights Reserved.</p>
          <div className="flex items-center gap-8">
            <Link href="#" className="hover:text-black transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-black transition-colors">Terms</Link>
            <Link href="#" className="hover:text-black transition-colors">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
