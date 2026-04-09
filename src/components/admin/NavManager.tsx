"use client";

import React, { useState, useEffect } from 'react';
import { motion, Reorder } from 'framer-motion';
import { Plus, Trash2, GripVertical, Link2, LayoutGrid, Save, Edit3, X, ChevronDown, Check } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  type: 'direct' | 'mega';
  href: string;
  categories?: {
    title: string;
    items: { label: string; href: string; }[];
  }[];
}

const NavManager = () => {
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<NavItem | null>(null);

  useEffect(() => {
    fetchNav();
  }, []);

  const fetchNav = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/nav');
      const data = await res.json();
      setNavItems(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const saveNav = async (updatedItems?: NavItem[]) => {
    setIsSaving(true);
    const itemsToSave = updatedItems || navItems;
    try {
      await fetch('/api/nav', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemsToSave)
      });
      setNavItems(itemsToSave);
      setEditingItem(null);
    } catch (err) {
      console.error(err);
    }
    setIsSaving(false);
  };

  const addNewItem = () => {
    const newItem: NavItem = {
      id: `nav-${Date.now()}`,
      label: 'New Link',
      type: 'direct',
      href: '#'
    };
    setNavItems([...navItems, newItem]);
    setEditingItem(newItem);
  };

  const removeItem = (id: string) => {
    const updated = navItems.filter(item => item.id !== id);
    setNavItems(updated);
    saveNav(updated);
  };

  const updateItemField = (id: string, field: string, value: any) => {
    setNavItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
    if (editingItem?.id === id) {
      setEditingItem(prev => prev ? { ...prev, [field]: value } : null);
    }
  };

  const addMegaCategory = (id: string) => {
    setNavItems(prev => prev.map(item => {
      if (item.id === id) {
        const categories = item.categories || [];
        return {
          ...item,
          type: 'mega',
          categories: [...categories, { title: 'New Category', items: [{ label: 'Sublink', href: '#' }] }]
        };
      }
      return item;
    }));
  };

  if (loading) return <div className="py-20 text-center text-gray-500 font-bold uppercase tracking-widest text-[10px] animate-pulse">Syncing Tactical Grid...</div>;

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white italic">NAVIGATION COMMAND</h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Global Header Architecture & Logic</p>
        </div>
        <div className="flex gap-4">
          <button 
             onClick={addNewItem}
             className="px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all flex items-center gap-2"
          >
            <Plus size={14} /> Add Sector
          </button>
          <button 
             onClick={() => saveNav()}
             className="px-10 py-3 bg-blue-500 hover:bg-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all shadow-xl shadow-blue-500/20 flex items-center gap-2"
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Deploy Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Nav List */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">Primary Structure</h3>
          <Reorder.Group axis="y" values={navItems} onReorder={setNavItems} className="space-y-3">
             {navItems.map((item) => (
               <Reorder.Item 
                 key={item.id} 
                 value={item}
                 className={`p-5 rounded-3xl border transition-all cursor-grab active:cursor-grabbing group flex items-center justify-between ${editingItem?.id === item.id ? 'bg-blue-500/10 border-blue-500/50 shadow-xl' : 'bg-black/40 border-white/5 hover:border-white/20'}`}
                 onClick={() => setEditingItem(item)}
               >
                 <div className="flex items-center gap-4">
                   <GripVertical size={16} className="text-gray-700 group-hover:text-gray-500" />
                   <div>
                     <p className="text-xs font-black text-white uppercase tracking-widest">{item.label}</p>
                     <p className="text-[9px] text-gray-500 font-mono mt-0.5">{item.type.toUpperCase()} // {item.href}</p>
                   </div>
                 </div>
                 <button 
                    onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                    className="p-2 text-gray-700 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                 >
                   <Trash2 size={14} />
                 </button>
               </Reorder.Item>
             ))}
          </Reorder.Group>
        </div>

        {/* Editor Console */}
        <div className="lg:col-span-2">
           {editingItem ? (
             <motion.div 
               key={editingItem.id}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="p-10 bg-[#0a0a0a] border border-white/5 rounded-[40px] space-y-10"
             >
               <div className="flex items-center justify-between mb-4">
                 <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Sector Configuration</h3>
                 <button onClick={() => setEditingItem(null)} className="p-2 hover:bg-white/5 rounded-full"><X size={20} /></button>
               </div>

               <div className="grid grid-cols-2 gap-8">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Display Label</label>
                    <input 
                      value={editingItem.label}
                      onChange={(e) => updateItemField(editingItem.id, 'label', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold text-white outline-none focus:border-blue-500/50 transition-all"
                    />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Base Trajectory (URL)</label>
                    <input 
                      value={editingItem.href}
                      onChange={(e) => updateItemField(editingItem.id, 'href', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs font-mono text-blue-400 outline-none focus:border-blue-500/50 transition-all"
                    />
                 </div>
               </div>

               <div className="space-y-6">
                 <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Architecture Protocol</label>
                 <div className="flex gap-4">
                    <button 
                      onClick={() => updateItemField(editingItem.id, 'type', 'direct')}
                      className={`flex-1 p-6 rounded-3xl border transition-all flex flex-col items-center gap-3 ${editingItem.type === 'direct' ? 'bg-blue-500/10 border-blue-500/30' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                    >
                      <Link2 size={24} className={editingItem.type === 'direct' ? 'text-blue-500' : 'text-gray-600'} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Direct Link</span>
                    </button>
                    <button 
                      onClick={() => updateItemField(editingItem.id, 'type', 'mega')}
                      className={`flex-1 p-6 rounded-3xl border transition-all flex flex-col items-center gap-3 ${editingItem.type === 'mega' ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                    >
                      <LayoutGrid size={24} className={editingItem.type === 'mega' ? 'text-indigo-500' : 'text-gray-600'} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Mega Menu Expansion</span>
                    </button>
                 </div>
               </div>

               {editingItem.type === 'mega' && (
                 <div className="space-y-8 pt-8 border-t border-white/5">
                   <div className="flex items-center justify-between">
                      <h4 className="text-[11px] font-black text-indigo-400 uppercase tracking-widest">Expansion Categories</h4>
                      <button onClick={() => addMegaCategory(editingItem.id)} className="text-[9px] font-black text-white bg-white/5 px-4 py-2 rounded-xl hover:bg-white/10 transition-all uppercase tracking-widest">Add Category</button>
                   </div>
                   <div className="space-y-6">
                      {editingItem.categories?.map((cat, catIdx) => (
                        <div key={catIdx} className="p-8 bg-black/40 border border-white/5 rounded-[32px] space-y-6">
                           <div className="flex justify-between gap-4">
                              <input 
                                value={cat.title} 
                                onChange={(e) => {
                                  const newCats = [...(editingItem.categories || [])];
                                  newCats[catIdx].title = e.target.value;
                                  updateItemField(editingItem.id, 'categories', newCats);
                                }}
                                className="bg-transparent border-b border-white/10 text-xs font-black text-white uppercase tracking-widest focus:border-indigo-500 outline-none w-full"
                              />
                              <button className="text-red-500/50 hover:text-red-500"><Trash2 size={14}/></button>
                           </div>
                           <div className="space-y-3">
                              {cat.items.map((sub, subIdx) => (
                                <div key={subIdx} className="flex gap-3">
                                   <input 
                                      value={sub.label} 
                                      onChange={(e) => {
                                        const newCats = [...(editingItem.categories || [])];
                                        newCats[catIdx].items[subIdx].label = e.target.value;
                                        updateItemField(editingItem.id, 'categories', newCats);
                                      }}
                                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-bold text-gray-300 outline-none focus:border-indigo-500"
                                      placeholder="Label"
                                   />
                                   <input 
                                      value={sub.href} 
                                      onChange={(e) => {
                                        const newCats = [...(editingItem.categories || [])];
                                        newCats[catIdx].items[subIdx].href = e.target.value;
                                        updateItemField(editingItem.id, 'categories', newCats);
                                      }}
                                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-mono text-indigo-400 outline-none focus:border-indigo-500"
                                      placeholder="Href"
                                   />
                                   <button 
                                      onClick={() => {
                                        const newCats = [...(editingItem.categories || [])];
                                        newCats[catIdx].items.push({ label: 'New Link', href: '#' });
                                        updateItemField(editingItem.id, 'categories', newCats);
                                      }}
                                      className="p-2 bg-white/5 rounded-lg hover:bg-white/10"
                                   ><Plus size={14} /></button>
                                </div>
                              ))}
                           </div>
                        </div>
                      ))}
                   </div>
                 </div>
               )}

             </motion.div>
           ) : (
             <div className="h-full flex flex-col items-center justify-center p-20 border-2 border-dashed border-white/5 rounded-[40px] text-center space-y-6">
                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-gray-800">
                   <Edit3 size={32} />
                </div>
                <div>
                   <h3 className="text-sm font-black text-white uppercase tracking-widest">Awaiting Trajectory Selection</h3>
                   <p className="text-[10px] text-gray-600 font-medium mt-2 leading-relaxed italic">Select a sector from the left to reconfigure its architecture or create a new mission path.</p>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

const Loader2 = ({ size, className }: { size?: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={`lucide lucide-loader-2 animate-spin ${className}`}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export default NavManager;
