"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, Menu, X, ChevronDown, Sparkles, Zap, Activity, Shield, Box, Target, Zap as Bolt } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

import { useCart } from '@/context/CartContext';
import EditableText from './EditableText';

interface NavLink {
  id: string;
  label: string;
  type: 'direct' | 'mega';
  href: string;
  categories?: {
    title: string;
    items: { label: string; href: string; }[];
  }[];
}

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [navLinks, setNavLinks] = useState<NavLink[]>([]);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');
  
  const pathname = usePathname();
  const { totalCount, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Fetch Core Settings
    fetch('/api/admin')
      .then(res => res.json())
      .then(data => setSettings(data.settings))
      .catch(err => console.error(err));

    // Fetch Dynamic Navigation Architecture
    fetch('/api/nav')
      .then(res => res.json())
      .then(data => setNavLinks(data))
      .catch(err => console.error(err));

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent, label: string, href: string) => {
    // Determine category based on label or href
    const categoryName = label;

    if (href.startsWith('#')) {
      e.preventDefault();
      setMobileMenuOpen(false);
      setActiveMegaMenu(null);
      
      if (pathname === '/') {
        setActiveFilter(categoryName);
        window.dispatchEvent(new CustomEvent('kz-nav-filter', { detail: categoryName }));
        const targetId = href.substring(1);
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // If we are on /shop, navigate to home first then filter (optional)
        router.push('/' + href);
      }
    } else {
      setMobileMenuOpen(false);
      // Let standard Link handle the navigation to /shop
    }
  };

  const getCategoryIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('planar') || t.includes('acoustic')) return <Zap size={14} className="text-cyan-500" />;
    if (t.includes('dynamic') || t.includes('activity')) return <Activity size={14} className="text-cyan-500" />;
    if (t.includes('support') || t.includes('shield')) return <Shield size={14} className="text-cyan-500" />;
    if (t.includes('shop') || t.includes('kit')) return <Box size={14} className="text-cyan-500" />;
    if (t.includes('grade') || t.includes('target')) return <Target size={14} className="text-cyan-500" />;
    return <Bolt size={14} className="text-cyan-500" />;
  };

  return (
    <>
      {settings?.saleBanner?.enabled && (
        <div 
          className="w-full py-2 text-center text-[10px] font-black uppercase tracking-[0.4em] overflow-hidden relative z-[90] text-black shadow-lg"
          style={{ backgroundColor: settings.saleBanner.color || '#ffd700' }}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: '-100%' }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="whitespace-nowrap inline-block"
          >
             {settings.saleBanner.text} &nbsp;&nbsp;&bull;&nbsp;&nbsp; 
             TACTICAL GEAR DEPLOYMENT IN PROGRESS &nbsp;&nbsp;&bull;&nbsp;&nbsp; 
             {settings.saleBanner.text}
          </motion.div>
        </div>
      )}
      
      <nav 
        className={`fixed left-0 w-full z-[80] transition-all duration-700 ${
          settings?.saleBanner?.enabled ? (isScrolled ? 'top-0' : 'top-[36px]') : 'top-0'
        } ${
          isScrolled 
            ? 'bg-black/85 backdrop-blur-[40px] shadow-[0_15px_60px_rgba(0,0,0,0.9)] py-4 border-b border-white/5' 
            : 'bg-transparent py-8 border-b border-transparent'
        }`}
        onMouseLeave={() => setActiveMegaMenu(null)}
      >
        <div className="container mx-auto px-6 lg:px-16 flex items-center justify-between">
          
          {/* Brand Identity Slot */}
          <Link href="/" onClick={() => setActiveFilter('All')} className="flex items-center gap-4 group relative z-10 shrink-0">
            <div className="w-11 h-11 bg-white flex items-center justify-center rounded-sm transition-all duration-700 shadow-[0_0_30px_rgba(255,255,255,0.05)] relative overflow-hidden group-hover:shadow-[0_0_40px_rgba(6,182,212,0.3)]">
              <span className="text-black font-black text-2xl relative z-10">W</span>
              <div className="absolute inset-x-0 bottom-0 h-0 group-hover:h-full bg-cyan-500 transition-all duration-500 opacity-20" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-serif font-black tracking-tight text-white leading-none">
                WASEEM'S
              </span>
              <span className="text-[8px] uppercase tracking-[0.5em] font-sans font-black text-cyan-500/80 group-hover:text-cyan-400 mt-1 transition-colors">AUDIO COMMAND</span>
            </div>
          </Link>

          {/* Tactical Nav Structure */}
          <div className="hidden lg:flex items-center gap-14">
            {navLinks.map((link) => {
              const isActive = (link.href === '#' ? activeFilter !== 'All' : pathname === link.href) || activeMegaMenu === link.id;
              return (
                <div 
                  key={link.id} 
                  className="relative"
                  onMouseEnter={() => setActiveMegaMenu(link.type === 'mega' ? link.id : null)}
                >
                  <Link 
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.label, link.href)}
                    className={`relative text-[11px] font-black uppercase tracking-[0.35em] py-4 transition-all duration-500 flex items-center gap-2.5 ${
                      isActive ? 'text-cyan-400' : 'text-gray-500 hover:text-white'
                    }`}
                  >
                    {link.label}
                    {link.type === 'mega' && <ChevronDown size={14} className={`transition-transform duration-500 ${activeMegaMenu === link.id ? 'rotate-180 text-cyan-400' : 'text-gray-700'}`} />}
                    
                    {isActive && (
                      <motion.div 
                        layoutId="nav-line"
                        className="absolute -bottom-1 left-0 right-0 h-[2px] bg-cyan-500 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.6)]"
                      />
                    )}
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Logistics & Actions */}
          <div className="flex items-center gap-4 md:gap-8 relative z-10 shrink-0">
            <button className="p-3 hover:bg-white/5 rounded-full transition-all duration-500 text-gray-600 hover:text-cyan-400">
              <Search size={19} />
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all duration-700 text-white group"
            >
              <ShoppingBag size={20} className="group-hover:rotate-12 transition-transform" />
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-cyan-600 text-black text-[9px] flex items-center justify-center rounded-full font-black shadow-[0_0_20px_rgba(8,145,178,0.5)] border border-black">{totalCount}</span>
            </button>
            
            <button 
              className="lg:hidden p-3 bg-white/5 rounded-xl text-white border border-white/10"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mega Menu Expansion 2.0 (Tactical Glass) */}
        <AnimatePresence>
          {activeMegaMenu && navLinks.find(l => l.id === activeMegaMenu)?.type === 'mega' && (
            <motion.div
              initial={{ opacity: 0, scaleY: 0, originY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute top-full left-0 w-full bg-black/95 backdrop-blur-[30px] border-b border-cyan-500/20 py-20 shadow-[0_40px_100px_rgba(0,0,0,1)]"
              onMouseEnter={() => setActiveMegaMenu(activeMegaMenu)}
            >
              {/* Neon Glow Border */}
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50 shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
              
              <div className="container mx-auto px-16 grid grid-cols-4 gap-20 relative z-10">
                {navLinks.find(l => l.id === activeMegaMenu)?.categories?.map((cat, idx) => (
                  <div key={idx} className="space-y-10 group/cat">
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-cyan-500/5 rounded-xl border border-cyan-500/10 group-hover/cat:border-cyan-500/40 transition-all duration-500">
                          {getCategoryIcon(cat.title)}
                       </div>
                       <h4 className="text-[12px] font-black text-white uppercase tracking-[0.4em] italic">{cat.title}</h4>
                    </div>
                    <div className="flex flex-col gap-5 pl-4 border-l border-white/5 group-hover/cat:border-cyan-500/20 transition-all duration-700">
                      {cat.items.map((item, i) => (
                        <button 
                          key={i} 
                          onClick={(e) => handleNavClick(e, item.label, item.href)}
                          className="text-[11px] font-bold text-gray-500 hover:text-white uppercase tracking-[0.25em] transition-all duration-300 flex items-center gap-3 group/sub text-left"
                        >
                          <div className="w-1 h-1 bg-gray-800 rounded-full group-hover/sub:bg-cyan-500 transition-colors" />
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                
                {/* Advanced Featured Card Expansion */}
                <div className="col-span-1 bg-[#050505] rounded-[48px] border border-white/10 p-12 flex flex-col justify-between group overflow-hidden relative shadow-2xl">
                   <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-1000">
                      <img src="/phantom_feature_card_1775682725200.png" alt="Featured" className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[2000ms]" />
                   </div>
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                   
                   <div className="relative z-10">
                      <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                         <Sparkles className="text-cyan-400" size={24} />
                      </div>
                      <h5 className="text-2xl font-black text-white italic leading-none tracking-tighter">PHANTOM<br/>REGISTRY</h5>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.3em] mt-5 leading-loose">Access classified acoustics<br/>and studio-grade builds.</p>
                   </div>
                   
                   <button 
                     onClick={(e) => handleNavClick(e, 'All', '/shop')}
                     className="relative z-10 text-[10px] font-black uppercase text-cyan-400 tracking-[0.4em] flex items-center gap-3 mt-10 hover:gap-6 transition-all duration-500 group-hover:text-white"
                   >
                      DEPLOY ARSENAL
                      <ShoppingBag size={14} className="animate-pulse" />
                   </button>
                </div>
              </div>

              {/* Decorative HUD Scan Line */}
              <div className="absolute inset-x-0 bottom-4 h-px bg-white/5 opacity-30" />
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile Tactical Overhaul */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col p-12 backdrop-blur-3xl"
          >
            <div className="flex justify-between items-center mb-20">
               <div className="flex flex-col">
                 <span className="text-xs font-black uppercase tracking-[0.5em] text-cyan-500 italic">Command Structure</span>
                 <span className="text-[8px] text-gray-600 uppercase tracking-widest mt-1">Authorized Access Only</span>
               </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="w-16 h-16 flex items-center justify-center rounded-full bg-white/5 text-white border border-white/10 active:scale-90 transition-all"
              >
                <X size={28} />
              </button>
            </div>
            <div className="flex flex-col gap-12">
              {navLinks.map((link, i) => (
                <motion.div 
                  key={link.id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <button 
                    onClick={(e) => handleNavClick(e, link.label, link.href)}
                    className="text-5xl font-serif font-black text-white hover:text-cyan-400 transition-colors uppercase italic tracking-tighter text-left"
                  >
                    {link.label}
                  </button>
                  {link.type === 'mega' && (
                     <div className="flex flex-wrap gap-3 mt-6">
                        {link.categories?.[0]?.items.slice(0, 3).map((sub, idx) => (
                           <button 
                             key={idx} 
                             onClick={(e) => handleNavClick(e, sub.label, sub.href)}
                             className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-5 py-2.5 bg-white/5 border border-white/5 rounded-full shrink-0"
                           >
                             {sub.label}
                           </button>
                        ))}
                     </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
