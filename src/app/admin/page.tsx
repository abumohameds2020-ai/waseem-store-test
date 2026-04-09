"use client";

import React, { useState, useEffect } from 'react';
import { Save, Package, Layout, ChevronRight, Edit3, Trash2, Plus, ArrowLeft, Loader2, CheckCircle, Smartphone, Monitor, ShieldCheck, Activity, Zap, Search, Filter, ShoppingBag, Database, Globe, Bell, Download, History, Star, Award, Palette, LayoutGrid, Settings2, Image as ImageIcon, X, Sparkles, Clock, CheckSquare, Command, GripHorizontal, FolderSearch, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import MediaVault from '@/components/admin/MediaVault';
import MediaVaultModal from '@/components/admin/MediaVaultModal';
import BulkImporter from '@/components/admin/BulkImporter';
import PreFlightAuditor from '@/components/admin/PreFlightAuditor';
import NavManager from '@/components/admin/NavManager';
import MarketingIntelligence from '@/components/admin/MarketingIntelligence';
import { trackTacticalEvent } from '@/utils/analytics';

interface Product {
  id: string;
  name: string;
  headline?: string ;
  description: string;
  category: string;
  driver_config: string;
  local_price: string | number;
  local_stock?: boolean;
  global_price: string | number;
  aliexpress_link?: string;
  is_featured?: boolean;
  glow_color?: string;
  slider_headline?: string;
  slider_image?: string;
  specs: {
    frequency_response: string;
    impedance: string;
    sensitivity: string;
  };
  signature: string;
  price_range: string;
  images: {
    product: string;
    graph: string;
    internal?: string;
  };
  gallery?: string[];
  links: {
    official: string;
  };
  inventory?: {
    stock: number;
    restock_note?: string;
  };
  flash_deal?: {
    active: boolean;
    expiry: string;
    price: number;
  };
  status?: 'Draft' | 'Live';
  local_shipping_time?: string;
  global_shipping_time?: string;
  local_price_history?: any[];
  tags?: string[];
}

interface Collection {
  id: string;
  name: string;
  description: string;
  productIds: string[];
}

interface Slide {
  id: string;
  headline: string;
  description: string;
  color: string;
  image: string;
  xray_external_image?: string;
  xray_internal_reveal?: string;
  rank?: number;
}

const PRESET_COLORS = [
  { name: 'Purple', value: '#9333ea' },
  { name: 'Gold', value: '#fbbf24' },
  { name: 'Cyan', value: '#00e5ff' },
  { name: 'Silver', value: '#cbd5e1' },
  { name: 'Midnight', value: '#1e293b' }
];

import ProductEditModal from '@/components/admin/ProductEditModal';

export default function AdminDashboard() {
  const [data, setData] = useState<{ 
    slider: { slides: Slide[] }, 
    products: Product[], 
    settings?: { 
      maintenanceMode: boolean;
      saleBanner?: {
        enabled: boolean;
        text: string;
        color: string;
      };
      businessContact?: {
        whatsapp: string;
      };
      seo?: {
        title: string;
        description: string;
      };
      scripts?: {
        header: string;
        footer: string;
      };
    };
    collections: Collection[];
    cms?: {
      about: { title: string; philosophy: string; description: string };
      anatomy: { image: string };
      collectionImages: { planar: string; esports: string; daily: string };
      quizWeights: { bass: string; clarity: string; gaming: string };
    };
  } | null>(null);
  const [activeTab, setActiveTab] = useState<'slider' | 'products' | 'orders' | 'media' | 'home' | 'logs' | 'promotions' | 'reviews' | 'comparison' | 'collections' | 'advanced' | 'audit' | 'navigation' | 'marketing'>('slider');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [vaultOpenForSlide, setVaultOpenForSlide] = useState<{slideIdx: number, field: string} | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [markupPercentage, setMarkupPercentage] = useState<number>(0);
  const [orders, setOrders] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [notifications, setNotifications] = useState(0);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [compareIds, setCompareIds] = useState({ left: '', right: '' });
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [health, setHealth] = useState<any>(null);
  const [loadTime, setLoadTime] = useState(0);
  const [accentColor, setAccentColor] = useState('#0070f3');
  
  // Smart Productivity Suite
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [tasks, setTasks] = useState<{id: string, text: string, done: boolean}[]>([]);
  const [newTask, setNewTask] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [showCmdK, setShowCmdK] = useState(false);
  const [cmdKQuery, setCmdKQuery] = useState('');
  const [imageAudit, setImageAudit] = useState<any>(null);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [isBulkImporterOpen, setIsBulkImporterOpen] = useState(false);
  const [auditLoading, setAuditLoading] = useState(false);

  const THEME_PRESETS = [
    { name: 'Neon Blue', value: '#0070f3', glow: 'rgba(0,112,243,0.3)' },
    { name: 'Emerald', value: '#10b981', glow: 'rgba(16,185,129,0.3)' },
    { name: 'Crimson', value: '#ef4444', glow: 'rgba(239,68,68,0.3)' },
  ];

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', accentColor);
  }, [accentColor]);

  // Timer & Cmd+K Listener
  useEffect(() => {
    const timer = setInterval(() => setSessionSeconds(s => s + 1), 1000);
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCmdK(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Load LocalStorage
    const savedTasks = localStorage.getItem('kz_admin_tasks');
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    const savedNote = localStorage.getItem('kz_admin_note');
    if (savedNote) setNoteContent(savedNote);

    return () => {
      clearInterval(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (tasks.length > 0) localStorage.setItem('kz_admin_tasks', JSON.stringify(tasks));
  }, [tasks]);
  useEffect(() => {
    if (noteContent) localStorage.setItem('kz_admin_note', noteContent);
  }, [noteContent]);

  const toggleTask = (id: string) => setTasks(ts => ts.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const removeTask = (id: string) => setTasks(ts => ts.filter(t => t.id !== id));
  const addTask = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTask.trim()) {
      setTasks([...tasks, { id: Date.now().toString(), text: newTask.trim(), done: false }]);
      setNewTask('');
    }
  };

  useEffect(() => {
    const startTime = performance.now();
    fetchData().then(() => {
      const endTime = performance.now();
      setLoadTime(Math.round(endTime - startTime));
    });
  }, []);

  const runImageAudit = async () => {
    setAuditLoading(true);
    try {
      const res = await fetch('/api/image-audit');
      const data = await res.json();
      setImageAudit(data);
      setShowAuditModal(true);
    } catch (err) {
      console.error('Audit failed:', err);
    }
    setAuditLoading(false);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [adminRes, ordersRes, logsRes, reviewsRes] = await Promise.all([
        fetch('/api/admin'),
        fetch('/api/orders'),
        fetch('/api/logs'),
        fetch('/api/reviews')
      ]);
      const adminJson = await adminRes.json();
      const ordersJson = await ordersRes.json();
      const logsJson = await logsRes.json();
      const reviewsJson = await reviewsRes.json();
      
      setData(adminJson);
      setOrders(ordersJson);
      setLogs(logsJson);
      setReviews(reviewsJson);

      // Simple notification logic: count pending orders + awaiting reviews
      const pendingCount = ordersJson.filter((o: any) => o.status === 'Pending').length;
      const awaitingReviews = reviewsJson.filter((r: any) => r.status === 'awaiting').length;
      setNotifications(pendingCount + awaitingReviews);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);

    // ✅ Health check runs AFTER dashboard is visible — non-blocking
    fetch('/api/health')
      .then(res => res.json())
      .then(healthJson => setHealth(healthJson))
      .catch(() => {}); // Silently fail — health is not critical
  };

  const recordActivity = async (action: string, details: string) => {
    try {
      const res = await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, details })
      });
      if (res.ok) {
        const fetchLogsRes = await fetch('/api/logs');
        const newLogs = await fetchLogsRes.json();
        setLogs(newLogs);
      }
    } catch (err) {
      console.error('Logging failed', err);
    }
  };

  const updateOrderStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        body: JSON.stringify({ id, status: newStatus })
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
        setMessage('Order Status Updated');
        recordActivity('Order Status Shift', `Order ${id} changed to ${newStatus}`);
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const exportOrdersCSV = () => {
    const headers = ["Order ID", "Date", "Customer", "Phone", "City", "Address", "Items (Manifest)", "Total ($)"];
    const rows = orders.map(o => {
      const manifest = o.items.map((i: any) => `${i.name} (${i.quantity}x)`).join(' | ');
      return [o.id, o.date || 'N/A', o.customer, o.phone, o.city, o.address, `"${manifest}"`, o.total];
    });

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(r => r.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `KZ_PHANTOM_LOGISTICS_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    recordActivity('Logistics Export', `Full order manifest exported to CSV`);
  };

  const applyGlobalMarkup = () => {
    if (!data || markupPercentage === 0) return;
    if (!confirm(`Apply ${markupPercentage}% price adjustment to ALL products?`)) return;

    const multiplier = 1 + (markupPercentage / 100);
    const updatedProducts = data.products.map(p => {
      const currentLocal = typeof p.local_price === 'string' ? parseFloat(p.local_price) : (p.local_price || 0);
      const currentGlobal = typeof p.global_price === 'string' ? parseFloat(p.global_price) : (p.global_price || 0);
      return {
        ...p,
        local_price: (currentLocal * multiplier).toFixed(2),
        global_price: (currentGlobal * multiplier).toFixed(2)
      };
    });

    const updatedData = { ...data, products: updatedProducts };
    setData(updatedData);
    handleGlobalStatusSync(updatedData);
    recordActivity('Strategic Markup', `Applied ${markupPercentage}% markup to all products`);
    setMarkupPercentage(0);
  };

  const handleGlobalStatusSync = async (updatedData: any) => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) setData(json.data);
        setMessage('System Synchronized');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  const toggleMaintenance = () => {
    if (!data) return;
    const isModeActive = !data.settings?.maintenanceMode;
    const currentSettings = data.settings;
    const updated = { 
        ...data, 
        settings: { 
          maintenanceMode: isModeActive,
          saleBanner: currentSettings?.saleBanner || { enabled: false, text: '', color: '#ef4444' }
        } 
    };
    setData(updated);
    handleGlobalStatusSync(updated);
    recordActivity('Maintenance Protocol', `System moved to ${isModeActive ? 'Offline/Maintenance' : 'Live/Active'}`);
  };

  const deleteProduct = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!data) return;
    const productToDelete = data.products.find(p => p.id === id);
    if (!confirm('Are you absolutely sure? This will purge the technical record from the database.')) return;
    
    const newProducts = data.products.filter(p => p.id !== id);
    const newSlides = data.slider.slides.filter(s => s.id !== id);
    
    const updatedData = { ...data, products: newProducts, slider: { slides: newSlides } };
    setData(updatedData);
    handleGlobalStatusSync(updatedData);
    recordActivity('Inventory Purge', `Model [${productToDelete?.name || id}] permanently archived.`);
  };

  const openEditModal = (product: Product | null) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const saveProductFromModal = (product: Product) => {
    if (!data) return;
    
    let newProducts = [...data.products];
    const index = newProducts.findIndex(p => p.id === product.id);
    
    if (index !== -1) {
      newProducts[index] = product;
    } else {
      newProducts.push(product);
    }

    const updatedData = { ...data, products: newProducts };
    setData(updatedData);
    setIsModalOpen(false);
    handleGlobalStatusSync(updatedData);
    recordActivity('Engineering Update', `Object [${product.name}] synchronized with Master Database.`);
  };

  const generateWhatsAppLink = (product: Product) => {
    const phone = (data?.settings as any)?.businessContact?.whatsapp || '+201234567890';
    const text = `Hi! I am interested in the ${product.name} [Model: ${product.id}] — Local: $${product.local_price || 'N/A'}, Global: $${product.global_price || 'N/A'}. Could you provide technical consultation?`;
    return `https://wa.me/${phone.replace('+', '')}?text=${encodeURIComponent(text)}`;
  };

  const moderateReview = async (id: string, status: 'live' | 'dismissed') => {
    try {
      const res = await fetch('/api/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r));
        recordActivity('Review Moderation', `Feedback ${id} status set to: ${status}`);
        setMessage('Review Processed');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) { console.error(err); }
  };

  const deleteReview = async (id: string) => {
    if (!confirm('Permanent purge confirmed?')) return;
    try {
      const res = await fetch(`/api/reviews?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setReviews(prev => prev.filter(r => r.id !== id));
        recordActivity('Review Purge', `Object review ${id} cleared from database.`);
      }
    } catch (err) { console.error(err); }
  };

  const updateProductInventory = (productId: string, stock: number, note: string) => {
    if (!data) return;
    const newProducts = data.products.map(p => 
      p.id === productId ? { ...p, inventory: { stock, restock_note: note } } : p
    );
    const updatedData = { ...data, products: newProducts };
    setData(updatedData);
    handleGlobalStatusSync(updatedData);
  };

  const triggerSecuritySnapshot = async () => {
    setMessage('Packaging Security Snapshot...');
    window.location.href = '/api/backup';
    setTimeout(() => setMessage(''), 3000);
    recordActivity('Security Audit', 'Manual database snapshot ZIP generated.');
  };

  const toggleProductSelection = (id: string) => {
    setSelectedProductIds(prev => 
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const handleMassAction = async (action: 'category' | 'stock' | 'tags', value: any) => {
    if (!data || selectedProductIds.length === 0) return;
    const newProducts = data.products.map(p => {
      if (!selectedProductIds.includes(p.id)) return p;
      const updated = { ...p };
      if (action === 'category') updated.category = value;
      if (action === 'stock') updated.inventory = { ...(updated.inventory || { stock: 0 }), stock: value === 'out' ? 0 : 50 };
      if (action === 'tags') updated.tags = Array.from(new Set([...(updated.tags || []), value]));
      return updated;
    });
    const updatedData = { ...data, products: newProducts };
    setData(updatedData);
    handleGlobalStatusSync(updatedData);
    setSelectedProductIds([]);
    recordActivity('Mass Edit Engine', `Protocols updated for ${selectedProductIds.length} objects.`);
    setMessage('Bulk Action Synchronized');
    setTimeout(() => setMessage(''), 3000);
  };

  const updateCollection = (collectionId: string, productIds: string[]) => {
    if (!data) return;
    const newCollections = data.collections.map(c => 
      c.id === collectionId ? { ...c, productIds } : c
    );
    const updatedData = { ...data, collections: newCollections };
    setData(updatedData);
    handleGlobalStatusSync(updatedData);
    recordActivity('Cluster Update', `Collection [${collectionId}] re-indexed.`);
  };

  const saveAdvancedSettings = (field: string, subField: string, value: string) => {
    if (!data) return;
    const updatedData = JSON.parse(JSON.stringify(data));
    if (!updatedData.settings[field]) updatedData.settings[field] = {};
    updatedData.settings[field][subField] = value;
    setData(updatedData);
    handleGlobalStatusSync(updatedData);
    recordActivity('Settings Protocol', `Advanced parameter [${field}.${subField}] reconfigured.`);
  };

  const handleBulkImport = (newProducts: any[]) => {
    if (!data) return;
    const updatedProducts = [...data.products, ...newProducts];
    const updatedData = { ...data, products: updatedProducts };
    setData(updatedData);
    handleGlobalStatusSync(updatedData);
    recordActivity('Bulk Infiltration', `Deployed ${newProducts.length} draft objects via CSV.`);
    setMessage(`${newProducts.length} Drafts Deployed!`);
    setTimeout(() => setMessage(''), 3000);
  };

  const updateSlide = (index: number, field: string, value: any) => {
    if (!data) return;
    const newSlides = [...data.slider.slides];
    newSlides[index] = { ...newSlides[index], [field]: value };
    setData({ ...data, slider: { slides: newSlides } });
  };

  const handleUpload = async (index: number, field: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSaving(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const json = await res.json();
      if (json.url) {
        updateSlide(index, field, json.url);
        setMessage('Image uploaded successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error('Upload failed:', err);
    }
    setSaving(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
      <Loader2 className="animate-spin mr-3 text-blue-500" /> Connecting to Command Center...
    </div>
  );

  if (!data) return <div className="text-white p-20">Access Denied / System Offline.</div>;

  const totalProducts = data.products.length;
  const featuredCount = data.products.filter(p => p.is_featured).length;

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 font-sans selection:bg-blue-500 selection:text-white">
      {/* Dynamic Command Header */}
      <header className="border-b border-white/5 bg-black/60 backdrop-blur-2xl sticky top-0 z-[100]">
        <div className="max-w-7xl mx-auto px-8 h-24 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            </Link>
            <div>
               <h1 className="text-sm font-black tracking-[0.4em] uppercase text-white flex items-center gap-3">
                 Command Center <span className="text-[9px] bg-blue-500 px-2 py-0.5 rounded-md">PRO</span>
               </h1>
               <div className="flex items-center gap-2 mt-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Protocol Active</span>
               </div>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <button 
              onClick={triggerSecuritySnapshot}
              className="p-4 bg-white/5 border border-white/10 rounded-2xl transition-all hover:bg-white/10 text-gray-400 hover:text-white"
              title="Download Security Snapshot"
            >
               <Download size={18} />
            </button>
            {/* Super-Admin Notification Bell */}
           <div className="relative group cursor-pointer">
              <div className={`p-4 bg-white/5 border border-white/10 rounded-2xl transition-all hover:bg-white/10 ${notifications > 0 ? 'ring-2 ring-blue-500/50 shadow-lg shadow-blue-500/10' : ''}`}>
                 <Bell size={18} className={notifications > 0 ? 'text-blue-400 animate-pulse' : 'text-gray-500'} />
              </div>
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-lg shadow-blue-500/40">
                  {notifications}
                </span>
              )}
              <div className="absolute top-full right-0 mt-4 w-64 bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 pointer-events-none transition-all z-[100] shadow-2xl">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">Live Protocols</h4>
                 {notifications > 0 ? (
                    <div className="flex items-center gap-3">
                       <div className="w-2 h-2 bg-blue-500 rounded-full" />
                       <span className="text-xs font-bold text-white">{notifications} Orders awaiting audit</span>
                    </div>
                 ) : (
                    <span className="text-xs text-gray-600">All protocols cleared.</span>
                 )}
              </div>
           </div>

            <div className="flex items-center gap-6 pr-6 border-r border-white/10">
               <div className="flex items-center gap-4 group cursor-pointer" onClick={toggleMaintenance}>
                  <div className={`w-12 h-6 rounded-full transition-all p-1 flex items-center ${data.settings?.maintenanceMode ? 'bg-red-500' : 'bg-white/10'}`}>
                     <div className={`w-4 h-4 bg-white rounded-full transition-all ${data.settings?.maintenanceMode ? 'translate-x-6' : 'translate-x-0'}`} />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${data.settings?.maintenanceMode ? 'text-red-400' : 'text-gray-500'}`}>Maintenance</span>
               </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl mr-2">
                 <Clock size={12} className="text-gray-400" />
                 <span className="text-[10px] font-mono text-gray-400 font-bold tracking-widest">{Math.floor(sessionSeconds / 60).toString().padStart(2, '0')}:{(sessionSeconds % 60).toString().padStart(2, '0')}</span>
              </div>
              {message && <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.2em] animate-fade-in">{message}</span>}
              <button 
                onClick={() => handleGlobalStatusSync(data)}
                disabled={saving}
                className="px-8 py-4 bg-[#0070f3] hover:bg-[#0061d5] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center gap-3 disabled:opacity-50 shadow-2xl shadow-blue-500/20"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                Deploy Changes
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Summary Bar */}
      <div className="max-w-7xl mx-auto px-8 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 flex items-center gap-6 hover:bg-white/[0.07] transition-all">
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-blue-500 border border-white/5"><Package size={24} /></div>
            <div>
               <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Master Inventory</p>
               <h3 className="text-2xl font-black text-white mt-1">{totalProducts} <span className="text-[10px] text-gray-500 ml-1 font-bold italic">Objects</span></h3>
            </div>
         </div>
         <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 flex items-center gap-6 hover:bg-white/[0.07] transition-all">
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-purple-500 border border-white/5"><Zap size={24} /></div>
            <div>
               <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Active Featured</p>
               <h3 className="text-2xl font-black text-white mt-1">{featuredCount} <span className="text-[10px] text-gray-500 ml-1 font-bold italic">Curated</span></h3>
            </div>
         </div>
         <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 flex items-center gap-6 hover:bg-white/[0.07] transition-all border-blue-500/20 shadow-lg shadow-blue-500/5 col-span-1 md:col-span-1 2xl:col-span-1">
            <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/10"><Activity size={24} /></div>
            <div className="flex-1 flex items-center justify-between">
               <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">System Health</p>
                  <h3 className="text-2xl font-black text-white mt-1">{health?.brokenLinks?.length > 0 ? 'Action Reqd' : 'Optimal'} <span className={`text-[10px] ${health?.brokenLinks?.length > 0 ? 'text-red-500' : 'text-green-500'} ml-1 font-bold`}>{health?.brokenLinks?.length > 0 ? `(${health.brokenLinks.length} BRKN)` : '100%'}</span></h3>
               </div>
               <button 
                 onClick={runImageAudit} 
                 disabled={auditLoading}
                 className="px-4 py-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-[9px] font-black uppercase text-blue-400 hover:bg-blue-500 hover:text-white transition-all flex items-center gap-2"
               >
                 {auditLoading ? <span className="animate-spin text-lg leading-none">⟳</span> : <ImageIcon size={12} />}
                 {auditLoading ? 'Auditing...' : 'Image Audit'}
               </button>
            </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto flex">
        <aside className="w-72 border-r border-white/5 min-h-[calc(100vh-176px)] p-8">
          <nav className="space-y-3">
            <button 
              onClick={() => setActiveTab('slider')}
              className={`w-full flex items-center gap-4 px-6 py-5 rounded-[24px] text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'slider' ? 'bg-white/10 text-white shadow-2xl border border-white/10' : 'text-gray-500 hover:bg-white/5'}`}
            >
              <Layout size={18} /> Presentation
            </button>
            <button 
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-4 px-6 py-5 rounded-[24px] text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'products' ? 'bg-white/10 text-white shadow-2xl border border-white/10' : 'text-gray-500 hover:bg-white/5'}`}
            >
              <Package size={18} /> Inventory
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-4 px-6 py-5 rounded-[24px] text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'orders' ? 'bg-white/10 text-white shadow-2xl border border-white/10' : 'text-gray-500 hover:bg-white/5'}`}
            >
              <ShoppingBag size={18} /> Orders Trace
            </button>
            <button 
              onClick={() => setActiveTab('home')}
              className={`w-full flex items-center gap-4 px-6 py-5 rounded-[24px] text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'home' ? 'bg-white/10 text-white shadow-2xl border border-white/10' : 'text-gray-500 hover:bg-white/5'}`}
            >
              <Layout size={18} /> Home Manager
            </button>
            <button 
              onClick={() => setActiveTab('media')}
              className={`w-full flex items-center gap-4 px-6 py-5 rounded-[24px] text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'media' ? 'bg-white/10 text-white shadow-2xl border border-white/10' : 'text-gray-500 hover:bg-white/5'}`}
            >
              <Database size={18} /> Media Vault
            </button>
            <button 
              onClick={() => setActiveTab('promotions')}
              className={`w-full flex items-center gap-4 px-6 py-5 rounded-[24px] text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'promotions' ? 'bg-amber-500/10 text-amber-500 shadow-2xl border border-amber-500/10' : 'text-gray-500 hover:bg-white/5'}`}
            >
              <Zap size={18} /> Flash Deals
            </button>
            <button 
              onClick={() => setActiveTab('comparison')}
              className={`w-full flex items-center gap-4 px-6 py-5 rounded-[24px] text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'comparison' ? 'bg-blue-500/10 text-blue-400 shadow-2xl border border-blue-500/10' : 'text-gray-500 hover:bg-white/5'}`}
            >
              <Monitor size={18} /> Sidebench
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`w-full flex items-center gap-4 px-6 py-5 rounded-[24px] text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'reviews' ? 'bg-emerald-500/10 text-emerald-500 shadow-2xl border border-emerald-500/10' : 'text-gray-500 hover:bg-white/5'}`}
            >
              <Star size={18} /> Audit Reviews
            </button>
            <button 
              onClick={() => setActiveTab('collections')}
              className={`w-full flex items-center gap-4 px-6 py-5 rounded-[24px] text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'collections' ? 'bg-indigo-500/10 text-indigo-400 shadow-2xl border border-indigo-500/10' : 'text-gray-500 hover:bg-white/5'}`}
            >
              <LayoutGrid size={18} /> Collections
            </button>
            <button 
              onClick={() => setActiveTab('advanced')}
              className={`w-full flex items-center gap-4 px-6 py-5 rounded-[24px] text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'advanced' ? 'bg-rose-500/10 text-rose-500 shadow-2xl border border-rose-500/10' : 'text-gray-500 hover:bg-white/5'}`}
            >
              <Settings2 size={18} /> Advanced
            </button>
            <button 
              onClick={() => setActiveTab('audit')}
              className={`w-full flex items-center gap-4 px-6 py-5 rounded-[24px] text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'audit' ? 'bg-blue-500/10 text-blue-400 shadow-2xl border border-blue-500/10' : 'text-gray-500 hover:bg-white/5'}`}
            >
              <ShieldCheck size={18} /> Pre-Flight Audit
            </button>
            <button 
              onClick={() => setActiveTab('navigation')}
              className={`w-full flex items-center gap-4 px-6 py-5 rounded-[24px] text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'navigation' ? 'bg-cyan-500/10 text-cyan-400 shadow-2xl border border-cyan-500/10' : 'text-gray-500 hover:bg-white/5'}`}
            >
              <Layout size={18} /> Navigation Hub
            </button>
            <button 
              onClick={() => setActiveTab('marketing')}
              className={`w-full flex items-center gap-4 px-6 py-5 rounded-[24px] text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'marketing' ? 'bg-rose-500/10 text-rose-500 shadow-2xl border border-rose-500/10' : 'text-gray-500 hover:bg-white/5'}`}
            >
              <Target size={18} /> Market Intel
            </button>
            <button 
              onClick={() => setActiveTab('logs')}
              className={`w-full flex items-center gap-4 px-6 py-5 rounded-[24px] text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'logs' ? 'bg-white/10 text-white shadow-2xl border border-white/10' : 'text-gray-500 hover:bg-white/5'}`}
            >
              <History size={18} /> History Logs
            </button>
          </nav>

          {/* Admin To-Do List */}
          <div className="mt-8 pt-8 border-t border-white/5 flex flex-col gap-4">
             <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2"><CheckSquare size={12}/> Pending Tasks</h4>
             <div className="space-y-2">
                {tasks.map(t => (
                  <div key={t.id} className="flex items-start gap-3 group">
                     <button onClick={() => toggleTask(t.id)} className={`w-4 h-4 rounded mt-0.5 border flex items-center justify-center flex-shrink-0 transition-all ${t.done ? 'bg-green-500 border-green-500 text-black' : 'bg-transparent border-white/20'}`}>
                        {t.done && <CheckCircle size={10} />}
                     </button>
                     <span className={`text-[11px] font-medium leading-tight flex-1 ${t.done ? 'text-gray-600 line-through' : 'text-gray-300'}`}>{t.text}</span>
                     <button onClick={() => removeTask(t.id)} className="opacity-0 group-hover:opacity-100 text-red-500/50 hover:text-red-500 mt-0.5 transition-all"><Trash2 size={12} /></button>
                  </div>
                ))}
                <input 
                  type="text" 
                  value={newTask}
                  onChange={e => setNewTask(e.target.value)}
                  onKeyDown={addTask}
                  placeholder="Type task & press Enter..."
                  className="w-full bg-black/50 border border-white/5 rounded-lg px-3 py-2 text-[10px] font-mono text-white outline-none focus:border-white/20"
                />
             </div>
          </div>
        </aside>
        <main className="flex-1 p-12">
          {activeTab === 'slider' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                 <h2 className="text-3xl font-black tracking-tight text-white">Hero Slider Management</h2>
                 <span className="text-xs text-gray-500 font-medium">Boutique Presentation Settings</span>
              </div>

              <div className="grid grid-cols-1 gap-12">
                {data.slider.slides.map((slide, idx) => (
                  <div key={idx} className="bg-[#0a0a0a] border border-white/5 rounded-[40px] p-8 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 text-[60px] font-black text-white/5 select-none uppercase italic">Slot 0{idx + 1}</div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                      <div className="space-y-6">
                        <div>
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 block">Linked Product</label>
                          <select 
                            value={slide.id}
                            onChange={(e) => updateSlide(idx, 'id', e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:border-[#0070f3] outline-none"
                          >
                            <option value="">Select an engineer object...</option>
                            {data.products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 block">Custom Marketing Headline</label>
                          <input 
                            value={slide.headline}
                            onChange={(e) => updateSlide(idx, 'headline', e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:border-[#0070f3] outline-none"
                            placeholder="Headline (e.g., Pure Planar Magic)"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 block text-center md:text-left">Ambient Glow Identity</label>
                          <div className="flex gap-4 p-2 bg-black/30 rounded-2xl border border-white/5 items-center">
                            {PRESET_COLORS.map(c => (
                              <button 
                                key={c.name}
                                onClick={() => updateSlide(idx, 'color', c.value)}
                                className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${slide.color === c.value ? 'border-white scale-110' : 'border-transparent hover:scale-105'}`}
                                style={{ backgroundColor: c.value }}
                              >
                                {slide.color === c.value && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
                              </button>
                            ))}
                            <input 
                              type="color" 
                              value={slide.color}
                              onChange={(e) => updateSlide(idx, 'color', e.target.value)}
                              className="ml-auto w-10 h-10 bg-transparent border-none cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 block">High-Resolution Render</label>
                          <div className="flex gap-2">
                            <input 
                              value={slide.image}
                              onChange={(e) => updateSlide(idx, 'image', e.target.value)}
                              className="flex-1 bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-[10px] font-mono focus:border-[#0070f3] outline-none"
                              placeholder="https://..."
                            />
                            <div className="relative flex">
                              <input 
                                type="file" 
                                className="hidden" 
                                id={`upload-${idx}`} 
                                accept="image/*"
                                onChange={(e) => handleUpload(idx, 'image', e)}
                              />
                              <label htmlFor={`upload-${idx}`} className="h-full px-4 flex items-center justify-center bg-white/5 border border-white/10 rounded-l-2xl hover:bg-white/10 cursor-pointer transition-all">
                                <Plus size={18} />
                              </label>
                              <button 
                                type="button" 
                                title="Select from Media Vault"
                                onClick={() => setVaultOpenForSlide({ slideIdx: idx, field: 'image' })} 
                                className="h-full px-4 flex items-center justify-center bg-white/5 border border-white/10 border-l-0 rounded-r-2xl hover:bg-cyan-500/20 hover:text-cyan-400 cursor-pointer transition-all"
                              >
                                <FolderSearch size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 block">X-Ray External Image</label>
                          <div className="flex gap-2">
                            <input 
                              value={slide.xray_external_image || ''}
                              onChange={(e) => updateSlide(idx, 'xray_external_image', e.target.value)}
                              className="flex-1 bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-[10px] font-mono focus:border-[#0070f3] outline-none"
                              placeholder="https://..."
                            />
                            <div className="relative flex">
                              <input 
                                type="file" 
                                className="hidden" 
                                id={`upload-xray-ext-${idx}`} 
                                accept="image/*"
                                onChange={(e) => handleUpload(idx, 'xray_external_image', e)}
                              />
                              <label htmlFor={`upload-xray-ext-${idx}`} className="h-full px-4 flex items-center justify-center bg-white/5 border border-white/10 rounded-l-2xl hover:bg-white/10 cursor-pointer transition-all">
                                <Plus size={18} />
                              </label>
                              <button 
                                type="button" 
                                title="Select from Media Vault"
                                onClick={() => setVaultOpenForSlide({ slideIdx: idx, field: 'xray_external_image' })} 
                                className="h-full px-4 flex items-center justify-center bg-white/5 border border-white/10 border-l-0 rounded-r-2xl hover:bg-cyan-500/20 hover:text-cyan-400 cursor-pointer transition-all"
                              >
                                <FolderSearch size={18} />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 block">X-Ray Internal Reveal</label>
                          <div className="flex gap-2">
                            <input 
                              value={slide.xray_internal_reveal || ''}
                              onChange={(e) => updateSlide(idx, 'xray_internal_reveal', e.target.value)}
                              className="flex-1 bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-[10px] font-mono focus:border-[#0070f3] outline-none"
                              placeholder="https://..."
                            />
                            <div className="relative flex">
                              <input 
                                type="file" 
                                className="hidden" 
                                id={`upload-xray-int-${idx}`} 
                                accept="image/*"
                                onChange={(e) => handleUpload(idx, 'xray_internal_reveal', e)}
                              />
                              <label htmlFor={`upload-xray-int-${idx}`} className="h-full px-4 flex items-center justify-center bg-white/5 border border-white/10 rounded-l-2xl hover:bg-white/10 cursor-pointer transition-all">
                                <Plus size={18} />
                              </label>
                              <button 
                                type="button" 
                                title="Select from Media Vault"
                                onClick={() => setVaultOpenForSlide({ slideIdx: idx, field: 'xray_internal_reveal' })} 
                                className="h-full px-4 flex items-center justify-center bg-white/5 border border-white/10 border-l-0 rounded-r-2xl hover:bg-cyan-500/20 hover:text-cyan-400 cursor-pointer transition-all"
                              >
                                <FolderSearch size={18} />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="aspect-square w-full bg-black rounded-[32px] border border-white/5 flex items-center justify-center p-8 overflow-hidden relative">
                           <div className="absolute inset-0 blur-[50px] opacity-20 pointer-events-none" style={{ backgroundColor: slide.color }} />
                           <img src={slide.image} alt="Preview" className="max-h-full object-contain relative z-10" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                 <div>
                    <h2 className="text-3xl font-black tracking-tight text-white">Engineering Inventory</h2>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Master Technical Repository</p>
                 </div>
                 
                 <div className="flex items-center gap-4">
                    <div className="relative">
                       <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                       <input 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-xs font-bold focus:border-blue-500 outline-none w-64"
                        placeholder="Search model..."
                       />
                    </div>
                    <select 
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold focus:border-blue-500 outline-none"
                    >
                      <option value="All">All Categories</option>
                      <option value="Planar">Planar</option>
                      <option value="Dynamic">Dynamic</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                    <button 
                      onClick={() => setIsBulkImporterOpen(true)}
                      className="px-8 py-4 bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5 text-blue-400 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3"
                    >
                      <Database size={16} /> Bulk Deployment
                    </button>
                    <button 
                      onClick={() => openEditModal(null)}
                      className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-500/10 flex items-center gap-3"
                    >
                      <Plus size={16} /> New Record
                    </button>
                 </div>
              </div>

              {/* Global Price Markup Tool */}
              <div className="p-8 bg-blue-500/5 border border-blue-500/20 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-8">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-[22px] flex items-center justify-center text-blue-400 border border-blue-500/10"><Globe size={28} /></div>
                    <div>
                       <h4 className="text-sm font-black uppercase tracking-widest text-white">Global Price Adjustment</h4>
                       <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase">Modify valuation across current active inventory</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="relative">
                       <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-xs">%</span>
                       <input 
                        type="number"
                        value={markupPercentage}
                        onChange={(e) => setMarkupPercentage(parseFloat(e.target.value) || 0)}
                        className="w-32 bg-black border border-white/10 rounded-2xl px-6 py-4 text-sm font-black focus:border-blue-500 outline-none text-center"
                        placeholder="0"
                       />
                    </div>
                    <button 
                      onClick={applyGlobalMarkup}
                      className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                      Apply Strategic Markup
                    </button>
                 </div>
              </div>

              <div className="bg-[#0a0a0a] border border-white/5 rounded-[32px] overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-500 tracking-widest">Model Identification</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-500 tracking-widest">Acoustic Class</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-500 tracking-widest">Technical Specs</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-500 tracking-widest text-right">Records Management</th>
                    </tr>
                  </thead>
                  <tbody>
                      {data.products
                        .filter(p => (categoryFilter === 'All' || p.category === categoryFilter) && p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map((product) => {
                        const lowStock = (product.inventory?.stock || 0) < 3;
                        return (
                         <tr 
                           key={product.id} 
                           onClick={() => openEditModal(product)}
                           className={`border-b border-white/5 hover:bg-white/[0.04] transition-all cursor-pointer group ${lowStock ? 'bg-red-500/[0.03]' : ''} ${selectedProductIds.includes(product.id) ? 'bg-blue-500/[0.05]' : ''} ${product.status === 'Draft' ? 'border-l-4 border-l-amber-500/50' : ''}`}
                         >
                          <td className="px-8 py-6" onClick={(e) => e.stopPropagation()}>
                             <input 
                               type="checkbox" 
                               checked={selectedProductIds.includes(product.id)}
                               onChange={() => toggleProductSelection(product.id)}
                               className="w-4 h-4 rounded border-white/10 bg-white/5 text-blue-500"
                             />
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-4">
                                {lowStock && <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />}
                                {health?.brokenLinks?.includes(product.id) && <div className="w-2 h-2 bg-rose-600 rounded-full shadow-lg shadow-rose-600/50" title="Broken Image Detected" />}
                                <div>
                                   <div className="flex items-center gap-2">
                                      <div className="font-bold text-white text-sm">{product.name}</div>
                                      {product.status === 'Draft' && (
                                        <span className="text-[8px] bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded font-black border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]">DRAFT</span>
                                      )}
                                   </div>
                                   <div className="text-[10px] text-gray-600 font-mono mt-1">{product.id}</div>
                                </div>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-widest">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-8">
                                <div className="flex flex-col gap-1">
                                   <div className={`px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest ${lowStock ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-white/5 border-white/10 text-gray-500'}`}>
                                      Stock: {product.inventory?.stock || 0}
                                   </div>
                                   {lowStock && (
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          const note = prompt('Enter protocol restock note:', product.inventory?.restock_note || '');
                                          if (note !== null) updateProductInventory(product.id, product.inventory?.stock || 0, note);
                                        }}
                                        className="text-[8px] font-black text-blue-500 uppercase hover:underline text-left pl-2"
                                      >
                                        + Protocol Restock Memo
                                      </button>
                                   )}
                                   {product.inventory?.restock_note && <div className="text-[8px] text-gray-600 italic pl-2 max-w-[120px] truncate" title={product.inventory.restock_note}>Note: {product.inventory.restock_note}</div>}
                                </div>
                                <div className="text-xs font-mono text-gray-400">
                                   {product.specs.impedance} / {product.specs.sensitivity}
                                </div>
                             </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                               <a 
                                 href={generateWhatsAppLink(product)} 
                                 target="_blank" 
                                 onClick={(e) => e.stopPropagation()}
                                 className="p-2 text-emerald-500/50 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-all"
                                 title="WhatsApp Link"
                               >
                                 <ShoppingBag size={16} />
                               </a>
                               <button 
                                 className="p-2 text-blue-500/50 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                               >
                                 <Edit3 size={16} />
                               </button>
                               <button 
                                 onClick={(e) => deleteProduct(product.id, e)}
                                 className="p-2 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                               >
                                 <Trash2 size={16} />
                               </button>
                            </div>
                          </td>
                        </tr>
                      )})}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-8">
               <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-black text-white">Acquisition Logs</h2>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Real-time Order Fulfillment</p>
                  </div>
                  <div className="flex items-center gap-4">
                     <button 
                       onClick={() => {
                         fetchData();
                         recordActivity('Manual Refresh', 'Order manifest synchronized with Command Center.');
                       }}
                       className="flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all text-blue-400"
                     >
                       <History size={16} /> Refresh Protocols
                     </button>
                     <button 
                       onClick={exportOrdersCSV}
                       className="flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all text-white"
                     >
                       <Download size={16} /> Export Logistics Manifest
                     </button>
                  </div>
               </div>

               <div className="bg-[#0a0a0a] border border-white/5 rounded-[40px] overflow-hidden">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="border-b border-white/5">
                           <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-500 tracking-widest">Recipient & Logistics</th>
                           <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-500 tracking-widest">Inventory Manifest</th>
                           <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-500 tracking-widest text-center">Protocol Status</th>
                           <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-500 tracking-widest text-right">Valuation</th>
                        </tr>
                     </thead>
                     <tbody>
                        {orders.map((order) => (
                           <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                              <td className="px-8 py-8">
                                 <div className="font-bold text-white text-sm">{order.customer}</div>
                                 <div className="text-[10px] text-gray-500 mt-1 uppercase font-black">{order.phone}</div>
                                 <div className="text-[9px] text-gray-600 mt-2 leading-relaxed">
                                    {order.address}, {order.city}
                                 </div>
                              </td>
                              <td className="px-8 py-8">
                                 {order.items.map((item: any, idx: number) => (
                                    <div key={idx} className="flex items-center gap-3 text-xs mb-1">
                                       <span className="text-blue-500 font-black">[{item.quantity}x]</span>
                                       <span className="text-gray-300 font-medium">{item.name}</span>
                                    </div>
                                 ))}
                              </td>
                              <td className="px-8 py-8">
                                 <div className="flex justify-center">
                                    <select 
                                      value={order.status}
                                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                      className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border focus:outline-none transition-all ${order.status === 'Shipped' ? 'bg-green-500/10 border-green-500/30 text-green-500' : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500'}`}
                                    >
                                       <option value="Pending">Pending Audit</option>
                                       <option value="Shipped">Dispatched</option>
                                    </select>
                                 </div>
                              </td>
                              <td className="px-8 py-8 text-right font-mono font-bold text-white">${order.total}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          )}

          {activeTab === 'media' && <MediaVault />}

          {activeTab === 'home' && (
            <div className="space-y-12">
               <div>
                  <h2 className="text-3xl font-black text-white">Home Experience Manager</h2>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Global Storefront Presentation Control</p>
               </div>

               {/* Sale Banner Controller */}
               <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[40px] space-y-8">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500"><Zap size={24} /></div>
                        <div>
                           <h4 className="text-sm font-black uppercase tracking-widest text-white">Global Promotion Banner</h4>
                           <p className="text-[10px] text-gray-500 font-bold mt-1 uppercase">Instant storefront notification system</p>
                        </div>
                     </div>
                     <button 
                        onClick={() => {
                          const currentSettings = data?.settings;
                          const newSettings = { 
                            maintenanceMode: currentSettings?.maintenanceMode || false,
                            saleBanner: { 
                              enabled: !currentSettings?.saleBanner?.enabled,
                              text: currentSettings?.saleBanner?.text || '',
                              color: currentSettings?.saleBanner?.color || '#ef4444'
                            } 
                          };
                          const updatedData = { ...data!, settings: newSettings };
                          setData(updatedData);
                          handleGlobalStatusSync(updatedData);
                        }}
                        className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${data?.settings?.saleBanner?.enabled ? 'bg-red-500 text-white shadow-xl shadow-red-500/20' : 'bg-white/5 text-gray-500 border border-white/10'}`}
                     >
                        {data?.settings?.saleBanner?.enabled ? 'Protocol Active' : 'Protocol Dormant'}
                     </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                     <div>
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 block">Promotion Text</label>
                        <input 
                           value={data?.settings?.saleBanner?.text || ''}
                           onChange={(e) => {
                             const currentSettings = data?.settings;
                             const updatedSettings = { ...currentSettings, saleBanner: { ...currentSettings?.saleBanner, text: e.target.value } };
                             setData({ ...data!, settings: updatedSettings as any });
                           }}
                           className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold text-white focus:border-red-500 outline-none"
                        />
                     </div>
                     <div>
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 block">Identity Color (HEX)</label>
                        <input 
                           value={data?.settings?.saleBanner?.color || '#ef4444'}
                           onChange={(e) => {
                             const currentSettings = data?.settings;
                             const updatedSettings = { ...currentSettings, saleBanner: { ...currentSettings?.saleBanner, color: e.target.value } };
                             setData({ ...data!, settings: updatedSettings as any });
                           }}
                           className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-xs font-mono text-white focus:border-red-500 outline-none uppercase"
                        />
                     </div>
                  </div>
               </div>

               {/* Slider Ranking Manager */}
               <div className="space-y-6">
                  <div className="flex items-center gap-6">
                     <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500"><Award size={24} /></div>
                     <div>
                        <h4 className="text-sm font-black uppercase tracking-widest text-white">Presentation Ranking</h4>
                        <p className="text-[10px] text-gray-500 font-bold mt-1 uppercase">Prioritize top 3 products for main hero</p>
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                     {data?.slider.slides.sort((a, b) => (a.rank || 9) - (b.rank || 9)).map((slide, idx) => (
                        <div key={idx} className="flex items-center gap-6 p-6 bg-white/[0.02] border border-white/5 rounded-3xl group">
                           <div className="w-12 h-12 flex items-center justify-center font-black text-xl text-blue-500 italic">#{slide.rank || idx + 1}</div>
                           <img src={slide.image} className="w-16 h-16 object-contain bg-black rounded-xl p-2" />
                           <div className="flex-1">
                              <div className="text-sm font-black text-white">{slide.headline}</div>
                           </div>
                           <div className="flex gap-2">
                              {[1, 2, 3, 4, 5].map(r => (
                                 <button 
                                    key={r}
                                    onClick={() => {
                                      const updatedSlides = data?.slider.slides.map(s => s.id === slide.id ? { ...s, rank: r } : s);
                                      setData({ ...data!, slider: { ...data!.slider, slides: updatedSlides } });
                                    }}
                                    className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all ${slide.rank === r ? 'bg-blue-500 text-white' : 'bg-white/5 text-gray-600'}`}
                                 >
                                    {r}
                                 </button>
                              ))}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Home Page Copywriter */}
               <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[40px] space-y-12">
                  <div className="flex items-center gap-6">
                     <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-500"><Edit3 size={24} /></div>
                     <div>
                        <h4 className="text-sm font-black uppercase tracking-widest text-white">Storefront Copywriter</h4>
                        <p className="text-[10px] text-gray-500 font-bold mt-1 uppercase">Manage primary storytelling and philosophy text</p>
                     </div>
                  </div>
                  <div className="space-y-8">
                     <div>
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 block">Headline Title</label>
                        <input 
                           value={data?.cms?.about?.title || ''}
                           onChange={(e) => setData({ ...data!, cms: { ...data!.cms!, about: { ...data!.cms!.about, title: e.target.value } } })}
                           className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold text-white focus:border-cyan-500 outline-none"
                        />
                     </div>
                     <div>
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 block">Philosophy Description</label>
                        <textarea 
                           rows={4}
                           value={data?.cms?.about?.description || ''}
                           onChange={(e) => setData({ ...data!, cms: { ...data!.cms!, about: { ...data!.cms!.about, description: e.target.value } } })}
                           className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold text-white focus:border-cyan-500 outline-none"
                        />
                     </div>
                  </div>
               </div>

               {/* Asset Manager */}
               <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[40px] space-y-12">
                  <div className="flex items-center gap-6">
                     <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500"><ImageIcon size={24} /></div>
                     <div>
                        <h4 className="text-sm font-black uppercase tracking-widest text-white">Visual Assets</h4>
                        <p className="text-[10px] text-gray-500 font-bold mt-1 uppercase">Swap high-end visuals and IDs</p>
                     </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div>
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 block">Anatomy Image Path</label>
                        <input 
                           value={data?.cms?.anatomy?.image || ''}
                           onChange={(e) => setData({ ...data!, cms: { ...data!.cms!, anatomy: { image: e.target.value } } })}
                           className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-xs font-mono text-gray-400"
                        />
                     </div>
                     <div>
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 block">Planar Collection Image</label>
                        <input 
                           value={data?.cms?.collectionImages?.planar || ''}
                           onChange={(e) => setData({ ...data!, cms: { ...data!.cms!, collectionImages: { ...data!.cms!.collectionImages, planar: e.target.value } } })}
                           className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-xs font-mono text-gray-400"
                        />
                     </div>
                  </div>
               </div>

               <div className="flex justify-center pb-20">
                  <button 
                     onClick={() => handleGlobalStatusSync(data)}
                     className="px-20 py-6 bg-cyan-500 text-black rounded-full text-xs font-black uppercase tracking-[0.4em] hover:bg-cyan-400 shadow-[0_0_80px_rgba(6,182,212,0.3)] transition-all flex items-center gap-6"
                  >
                     Deploy To Storefront <ChevronRight size={20} />
                  </button>
               </div>
            </div>
          )}

          {activeTab === 'promotions' && (
             <div className="space-y-8">
                <div>
                   <h2 className="text-3xl font-black text-white">Promotional Warfare</h2>
                   <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">High-Urgency Flash Deal Cycles</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {data.products.filter(p => p.flash_deal?.active).map(product => (
                      <div key={product.id} className="p-8 bg-[#0a0a0a] border border-amber-500/20 rounded-[40px] relative overflow-hidden group">
                         <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform"><Zap size={80} className="text-amber-500" /></div>
                         <div className="relative z-10">
                            <h4 className="text-xl font-black text-white">{product.name}</h4>
                            <div className="flex items-center gap-4 mt-4">
                               <div className="px-4 py-2 bg-amber-500 text-black text-[10px] font-black rounded-lg uppercase tracking-widest animate-pulse">FLASH ACTIVE</div>
                               <span className="text-xs text-gray-500 line-through">${product.local_price}</span>
                               <span className="text-xl font-black text-amber-500">${product.flash_deal?.price}</span>
                            </div>
                            <div className="mt-8 space-y-4">
                               <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Neon Expiry Timestamp</label>
                               <input 
                                 type="datetime-local"
                                 value={product.flash_deal?.expiry ? new Date(product.flash_deal.expiry).toISOString().slice(0, 16) : ''}
                                 onChange={(e) => {
                                    const updatedProducts = data.products.map(p => 
                                       p.id === product.id ? { ...p, flash_deal: { ...p.flash_deal!, expiry: new Date(e.target.value).toISOString() } } : p
                                    );
                                    handleGlobalStatusSync({ ...data!, products: updatedProducts });
                                 }}
                                 className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold text-amber-500 outline-none focus:border-amber-500/50"
                               />
                            </div>
                         </div>
                      </div>
                   ))}
                   <div className="p-8 border-2 border-dashed border-white/5 rounded-[40px] flex flex-center items-center justify-center text-center">
                      <p className="text-xs text-gray-600 font-bold uppercase tracking-widest">To activate a deal, adjust the object record in Inventory Console.</p>
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'reviews' && (
             <div className="space-y-8">
                <div>
                   <h2 className="text-3xl font-black text-white">Social Proof Moderation</h2>
                   <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Audit Customer Intelligence</p>
                </div>

                <div className="space-y-4">
                   {reviews.length === 0 && <div className="p-20 text-center text-gray-600 font-bold uppercase text-xs tracking-widest">No feedback cycles detected.</div>}
                   {reviews.map((rev) => (
                      <div key={rev.id} className={`p-8 bg-[#0a0a0a] border rounded-[32px] flex items-start gap-8 group transition-all ${rev.status === 'awaiting' ? 'border-amber-500/20' : 'border-white/5'}`}>
                         <div className="w-16 h-16 bg-white/5 rounded-[22px] flex items-center justify-center text-gray-500 border border-white/10">
                            <Star size={24} className={rev.status === 'live' ? 'text-emerald-500 shadow-lg shadow-emerald-500/20' : ''} />
                         </div>
                         <div className="flex-1">
                            <div className="flex items-center gap-4 mb-2">
                               <h4 className="text-sm font-black text-white uppercase tracking-widest">{rev.customer}</h4>
                               <div className="flex gap-0.5">
                                  {[...Array(5)].map((_, i) => <Star key={i} size={10} className={i < rev.rating ? 'fill-amber-500 text-amber-500' : 'text-gray-800'} />)}
                               </div>
                               <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${rev.status === 'live' ? 'bg-emerald-500 text-black' : 'bg-amber-500 text-black'}`}>{rev.status}</span>
                            </div>
                            <p className="text-xs text-gray-400 font-medium leading-relaxed italic">"{rev.comment}"</p>
                            <p className="text-[9px] text-gray-600 mt-3 font-mono">Product Reference: {rev.productId} | Internal Sync: {new Date(rev.date).toLocaleDateString()}</p>
                         </div>
                         <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {rev.status === 'awaiting' && (
                               <button 
                                 onClick={() => moderateReview(rev.id, 'live')}
                                 className="px-6 py-3 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                               >Approve</button>
                            )}
                            <button 
                               onClick={() => deleteReview(rev.id)}
                               className="px-6 py-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                            >Purge</button>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          )}
          {activeTab === 'comparison' && (
             <div className="space-y-8">
                <div>
                   <h2 className="text-3xl font-black text-white">Secret Weapon Workbench</h2>
                   <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Side-by-Side Technical Audit</p>
                </div>

                <div className="grid grid-cols-2 gap-8 sticky top-0 z-50 py-4 bg-[#050505]/80 backdrop-blur-xl">
                   <select 
                     value={compareIds.left}
                     onChange={(e) => setCompareIds(prev => ({ ...prev, left: e.target.value }))}
                     className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs font-black text-blue-400 outline-none"
                   >
                      <option value="">Select Protocol A</option>
                      {data.products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                   </select>
                   <select 
                     value={compareIds.right}
                     onChange={(e) => setCompareIds(prev => ({ ...prev, right: e.target.value }))}
                     className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs font-black text-purple-400 outline-none"
                   >
                      <option value="">Select Protocol B</option>
                      {data.products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                   </select>
                </div>

                <div className="grid grid-cols-2 gap-12 pt-8">
                   {[compareIds.left, compareIds.right].map((id, idx) => {
                      const p = data.products.find(prod => prod.id === id);
                      if (!p) return <div key={idx} className="h-96 border-2 border-dashed border-white/5 rounded-[40px] flex items-center justify-center text-xs text-gray-700 font-black uppercase tracking-widest">Waiting for selection...</div>;
                      return (
                         <div key={idx} className="space-y-8 animate-fade-in text-left">
                            <div className="aspect-video bg-black rounded-[32px] border border-white/5 overflow-hidden p-8 flex items-center justify-center">
                               <img src={p.images.product} className="max-h-full object-contain" />
                            </div>
                            <div className="space-y-4">
                               <h3 className="text-2xl font-black text-white">{p.name}</h3>
                               <div className="grid grid-cols-1 gap-2">
                                  <div className="p-4 bg-white/5 rounded-2xl flex justify-between items-center"><span className="text-[10px] font-black text-gray-500 uppercase">Class</span><span className="text-xs font-bold text-white">{p.category}</span></div>
                                  <div className="p-4 bg-white/5 rounded-2xl flex justify-between items-center"><span className="text-[10px] font-black text-gray-500 uppercase">Driver</span><span className="text-xs font-bold text-white">{p.driver_config}</span></div>
                                  <div className="p-4 bg-white/5 rounded-2xl flex justify-between items-center"><span className="text-[10px] font-black text-gray-500 uppercase">Impedance</span><span className="text-xs font-bold text-white">{p.specs.impedance}</span></div>
                                  <div className="p-4 bg-white/5 rounded-2xl flex justify-between items-center"><span className="text-[10px] font-black text-gray-500 uppercase">Sensitivity</span><span className="text-xs font-bold text-white">{p.specs.sensitivity}</span></div>
                                  <div className="p-4 bg-white/5 rounded-2xl flex justify-between items-center"><span className="text-[10px] font-black text-gray-500 uppercase">Signature</span><span className="text-xs font-bold text-white">{p.signature}</span></div>
                               </div>
                            </div>
                         </div>
                      );
                   })}
                </div>
             </div>
          )}
          {activeTab === 'collections' && (
             <div className="space-y-8">
                <div>
                   <h2 className="text-3xl font-black text-white">Cluster Management</h2>
                   <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Strategic Product Grouping</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {data.collections.map(col => (
                      <div key={col.id} className="p-8 bg-[#0a0a0a] border border-indigo-500/20 rounded-[40px] space-y-6">
                         <div className="flex justify-between items-start">
                            <div>
                               <h3 className="text-xl font-black text-white">{col.name}</h3>
                               <p className="text-xs text-gray-500 mt-1">{col.description}</p>
                            </div>
                            <span className="px-3 py-1 bg-indigo-500 text-black text-[8px] font-black rounded uppercase">{col.productIds.length} Models</span>
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Linked Protocols</label>
                            <div className="flex flex-wrap gap-2">
                               {data.products.map(p => (
                                  <button 
                                    key={p.id}
                                    onClick={() => {
                                       const newIds = col.productIds.includes(p.id) 
                                          ? col.productIds.filter(id => id !== p.id) 
                                          : [...col.productIds, p.id];
                                       updateCollection(col.id, newIds);
                                    }}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all ${col.productIds.includes(p.id) ? 'bg-indigo-500 text-black shadow-lg shadow-indigo-500/20' : 'bg-white/5 text-gray-500 border border-white/5 hover:border-white/10'}`}
                                  >
                                     {p.name}
                                  </button>
                               ))}
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          )}

          {activeTab === 'advanced' && (
             <div className="space-y-8">
                <div>
                   <h2 className="text-3xl font-black text-white">Global Site Intelligence</h2>
                   <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">SEO & Tracking Protocols</p>
                </div>

                <div className="grid grid-cols-1 gap-8">
                   <div className="p-10 bg-[#0a0a0a] border border-rose-500/20 rounded-[40px] space-y-8">
                      <div className="grid grid-cols-2 gap-8">
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Meta Title (Brand Relay)</label>
                            <input 
                              type="text"
                              value={(data.settings as any)?.seo?.title || ''}
                              onChange={(e) => saveAdvancedSettings('seo', 'title', e.target.value)}
                              className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold text-white outline-none focus:border-rose-500/50"
                            />
                         </div>
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Meta Description (Strategic Copy)</label>
                            <input 
                              type="text"
                              value={(data.settings as any)?.seo?.description || ''}
                              onChange={(e) => saveAdvancedSettings('seo', 'description', e.target.value)}
                              className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold text-white outline-none focus:border-rose-500/50"
                            />
                         </div>
                      </div>

                      <div className="h-px bg-white/5" />

                      <div className="grid grid-cols-2 gap-8">
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-rose-500 uppercase tracking-widest block">Tracking Scripts (Head Injection)</label>
                            <textarea 
                              rows={6}
                              placeholder="Paste Pixel / Analytics Head Scripts here..."
                              value={(data.settings as any)?.scripts?.header || ''}
                              onChange={(e) => saveAdvancedSettings('scripts', 'header', e.target.value)}
                              className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-[10px] font-mono text-rose-300 outline-none focus:border-rose-500/50"
                            />
                         </div>
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-rose-500 uppercase tracking-widest block">Conversion Scripts (Footer Injection)</label>
                            <textarea 
                              rows={6}
                              placeholder="Paste Checkout / Sales Scripts here..."
                              value={(data.settings as any)?.scripts?.footer || ''}
                              onChange={(e) => saveAdvancedSettings('scripts', 'footer', e.target.value)}
                              className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-[10px] font-mono text-rose-300 outline-none focus:border-rose-500/50"
                            />
                         </div>
                      </div>
                   </div>

                    {/* Marketing API Handshake */}
                    <div className="p-10 bg-[#0a0a0a] border border-cyan-500/20 rounded-[40px] space-y-8">
                       <div className="flex items-center justify-between">
                          <div>
                             <h3 className="text-xl font-black text-white flex items-center gap-3 italic"><Target size={20} className="text-cyan-500" /> Strategic Data Handshake</h3>
                             <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Connect Meta CAPI & TikTok Audiences</p>
                          </div>
                          <button 
                            onClick={() => {
                              trackTacticalEvent('TEST_UPLINK', { status: 'Protocol Test', timestamp: Date.now() });
                              alert('Test Signal Dispatched to Omni-Uplink. Check server logs for SHA-256 confirmation.');
                            }}
                            className="px-6 py-2.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-cyan-500 hover:text-black transition-all"
                          >
                             Run Test Protocol
                          </button>
                       </div>

                       <div className="grid grid-cols-2 gap-8">
                          <div className="space-y-4">
                             <label className="text-[10px] font-black text-cyan-500 uppercase tracking-widest block">Meta Pixel ID</label>
                             <input 
                               type="text"
                               placeholder="123456789..."
                               value={(data.settings as any)?.marketing?.pixel_id || ''}
                               onChange={(e) => saveAdvancedSettings('marketing', 'pixel_id', e.target.value)}
                               className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-xs font-mono text-cyan-300 outline-none focus:border-cyan-500/50"
                             />
                          </div>
                          <div className="space-y-4">
                             <label className="text-[10px] font-black text-cyan-500 uppercase tracking-widest block">Meta Access Token (CAPI)</label>
                             <input 
                               type="password"
                               placeholder="EAAB..."
                               value={(data.settings as any)?.marketing?.meta_token || ''}
                               onChange={(e) => saveAdvancedSettings('marketing', 'meta_token', e.target.value)}
                               className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-xs font-mono text-cyan-300 outline-none focus:border-cyan-500/50"
                             />
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-8">
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest block">TikTok Access Token</label>
                            <input 
                              type="password"
                              placeholder="TTA..."
                              value={(data.settings as any)?.marketing?.tiktok_token || ''}
                              onChange={(e) => saveAdvancedSettings('marketing', 'tiktok_token', e.target.value)}
                              className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-xs font-mono text-emerald-300 outline-none focus:border-emerald-500/50"
                            />
                         </div>
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest block">Facebook Page ID (Feedback Scraper)</label>
                            <input 
                              type="text"
                              placeholder="1000..."
                              value={(data.settings as any)?.marketing?.page_id || ''}
                              onChange={(e) => saveAdvancedSettings('marketing', 'page_id', e.target.value)}
                              className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-xs font-mono text-blue-300 outline-none focus:border-blue-500/50"
                            />
                         </div>
                       </div>

                       <div className="grid grid-cols-2 gap-8">
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-amber-500 uppercase tracking-widest block">GTM Container ID (Server-Side)</label>
                            <input 
                              type="text"
                              placeholder="GTM-XXXXXXX"
                              value={(data.settings as any)?.marketing?.gtm_id || ''}
                              onChange={(e) => saveAdvancedSettings('marketing', 'gtm_id', e.target.value)}
                              className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-xs font-mono text-amber-300 outline-none focus:border-amber-500/50"
                            />
                         </div>
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-amber-500 uppercase tracking-widest block">Stape.io Server URL</label>
                            <input 
                              type="text"
                              placeholder="https://gtm.yourdomain.com"
                              value={(data.settings as any)?.marketing?.stape_url || ''}
                              onChange={(e) => saveAdvancedSettings('marketing', 'stape_url', e.target.value)}
                              className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-xs font-mono text-amber-300 outline-none focus:border-amber-500/50"
                            />
                         </div>
                       </div>
                    </div>

                    {/* AI Engine Config */}
                   <div className="p-10 bg-[#0a0a0a] border border-purple-500/20 rounded-[40px] space-y-6">
                      <div>
                         <h3 className="text-xl font-black text-white flex items-center gap-3"><Sparkles size={20} className="text-purple-500" /> AI Generator Engine</h3>
                         <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Connect Gemini API for automated descriptions</p>
                      </div>
                      <div className="space-y-4">
                         <label className="text-[10px] font-black text-purple-500 uppercase tracking-widest block">Google Gemini API Key</label>
                         <input 
                           type="password"
                           placeholder="AIzaSy..."
                           value={(data.settings as any)?.ai?.gemini_key || ''}
                           onChange={(e) => saveAdvancedSettings('ai', 'gemini_key', e.target.value)}
                           className="w-full lg:w-1/2 bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-xs font-mono text-purple-300 outline-none focus:border-purple-500/50"
                         />
                      </div>
                   </div>

                   {/* Theme Engine */}
                   <div className="p-10 bg-[#0a0a0a] border border-violet-500/20 rounded-[40px] space-y-6">
                      <div>
                         <h3 className="text-xl font-black text-white">Command Center Theme</h3>
                         <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Visual Accent Protocol &mdash; Changes apply instantly</p>
                      </div>
                      <div className="flex gap-4">
                         {THEME_PRESETS.map(preset => (
                            <button
                              key={preset.value}
                              onClick={() => setAccentColor(preset.value)}
                              className={`flex-1 p-5 rounded-2xl border transition-all flex flex-col items-center gap-3 ${accentColor === preset.value ? 'border-violet-500/50 bg-violet-500/10' : 'border-white/5 bg-white/[0.02] hover:bg-white/5'}`}
                            >
                              <div className="w-10 h-10 rounded-xl" style={{ backgroundColor: preset.value, boxShadow: accentColor === preset.value ? `0 0 20px ${preset.glow}` : 'none' }} />
                              <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{preset.name}</span>
                              {accentColor === preset.value && <span className="text-[8px] font-black text-violet-400 uppercase tracking-widest">Active</span>}
                            </button>
                         ))}
                      </div>
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'navigation' && (
            <NavManager />
          )}

          {activeTab === 'marketing' && (
            <MarketingIntelligence />
          )}

          {activeTab === 'audit' && data && (
            <PreFlightAuditor products={data.products} />
          )}

          {activeTab === 'logs' && (
            <div className="space-y-8">
               <div>
                  <h2 className="text-3xl font-black text-white">System Protocol Logs</h2>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Immutable Operational History</p>
               </div>

               <div className="space-y-4 text-left">
                  {logs.map((log, idx) => (
                     <div key={idx} className="p-8 bg-[#0a0a0a] border border-white/5 rounded-[32px] flex items-center gap-8 group hover:bg-white/[0.02] transition-all">
                        <div className="w-16 h-16 bg-white/5 rounded-[22px] flex items-center justify-center text-gray-500 border border-white/10 group-hover:scale-110 transition-transform">
                           <ShieldCheck size={28} />
                        </div>
                        <div className="flex-1">
                           <div className="flex items-center gap-4 mb-1">
                              <h4 className="text-sm font-black uppercase tracking-widest text-white">{log.action}</h4>
                              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black text-gray-600 uppercase tracking-widest">{new Date(log.timestamp).toLocaleString()}</span>
                           </div>
                           <p className="text-xs text-gray-500 font-medium font-mono">{log.details}</p>
                        </div>
                        <div className="text-[10px] font-black text-gray-800 uppercase italic tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">VERIFIED</div>
                     </div>
                  ))}
               </div>
            </div>
          )}

          {/* Floating Mass Edit Bar */}
          {selectedProductIds.length > 0 && (
             <motion.div 
               initial={{ y: 100, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               className="fixed bottom-12 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-3xl border border-white/10 px-12 py-6 rounded-[32px] shadow-2xl z-[100] flex items-center gap-8"
             >
                <div className="flex flex-col">
                   <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{selectedProductIds.length} Objects Active</span>
                   <span className="text-[8px] text-gray-500 font-bold uppercase">Multi-Protocol Engine</span>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div className="flex gap-4">
                   <button 
                     onClick={() => {
                        const cat = prompt('New Category:');
                        if (cat) handleMassAction('category', cat);
                     }}
                     className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                   >Category</button>
                   <button 
                     onClick={() => handleMassAction('stock', 'out')}
                     className="px-6 py-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-red-500/20"
                   >Set OOS</button>
                   <button 
                     onClick={() => {
                        const tag = prompt('New Tag:');
                        if (tag) handleMassAction('tags', tag);
                     }}
                     className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                   >Add Tag</button>
                   <button 
                     onClick={() => setSelectedProductIds([])}
                     className="px-6 py-3 text-gray-600 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all"
                   >Cancel</button>
                </div>
             </motion.div>
          )}
        </main>
      </div>

      {/* Global Product Modal */}
      <ProductEditModal 
        isOpen={isModalOpen}
        product={editingProduct}
        onClose={() => setIsModalOpen(false)}
        onSave={saveProductFromModal}
      />

      {/* Image Audit Modal */}
      <AnimatePresence>
        {showAuditModal && imageAudit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setShowAuditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#0a0a0a] w-full max-w-2xl rounded-[40px] border border-white/10 shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8 border-b border-white/5 flex flex-col justify-center bg-black/40">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center border border-red-500/20 text-red-500">
                        <Monitor size={18} />
                     </div>
                     <div>
                        <h2 className="text-xl font-black text-white">Bulk Image Optimizer Alert</h2>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Scanned {imageAudit.totalChecked} Active Models</p>
                     </div>
                  </div>
                  <button onClick={() => setShowAuditModal(false)} className="p-3 hover:bg-white/5 rounded-full transition-colors"><X size={20} /></button>
                </div>
              </div>
              <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {imageAudit.oversized && imageAudit.oversized.length > 0 ? (
                  <div className="space-y-4">
                    <p className="text-[11px] font-black uppercase text-red-400 tracking-widest mb-4">
                      {imageAudit.oversized.length} Large Images Detected (&gt;1MB)
                    </p>
                    {imageAudit.oversized.map((img: any, idx: number) => (
                      <div key={idx} className="flex gap-4 p-4 bg-white/[0.02] border border-red-500/20 rounded-2xl items-center">
                        <img src={img.url} alt={img.name} className="w-12 h-12 object-contain bg-black/50 rounded-lg p-1 border border-white/5" />
                        <div className="flex-1 overflow-hidden">
                          <h4 className="text-[11px] font-black text-white uppercase tracking-widest truncate">{img.name}</h4>
                          <a href={img.url} target="_blank" rel="noreferrer" className="text-[9px] font-mono text-blue-400 hover:underline truncate block mt-1">{img.url}</a>
                        </div>
                        <div className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-[10px] font-black">
                          {img.sizeMB} MB
                        </div>
                      </div>
                    ))}
                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-relaxed">
                        Recommendation: Compress these renders using WebP / TinyPNG to reduce bandwidth overhead and improve storefront loading latency.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                      <ShieldCheck size={24} />
                    </div>
                    <h3 className="text-lg font-black text-white mb-1">Image Size Optimal</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">All product renders are below 1MB threshold.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Smart Shortcuts (Cmd+K) Modal */}
      <AnimatePresence>
        {showCmdK && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[400] flex items-start justify-center pt-[15vh] bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCmdK(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: -20 }}
              className="bg-[#111] w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center px-4 py-4 border-b border-white/5">
                <Search className="text-gray-500 mr-3" size={20} />
                <input 
                  autoFocus
                  type="text"
                  value={cmdKQuery}
                  onChange={e => setCmdKQuery(e.target.value)}
                  placeholder="Search products to quickly edit... (Cmd+K)"
                  className="flex-1 bg-transparent border-none text-white text-lg font-medium outline-none"
                />
                <div className="px-2 py-1 bg-white/5 text-[9px] font-bold text-gray-500 rounded uppercase tracking-widest">ESC</div>
              </div>
              <div className="max-h-[50vh] overflow-y-auto custom-scrollbar">
                {data?.products
                  ?.filter((p: Product) => p.name.toLowerCase().includes(cmdKQuery.toLowerCase()))
                  .map((p: Product) => (
                    <button
                      key={p.id}
                      onClick={() => {
                         setShowCmdK(false);
                         openEditModal(p);
                      }}
                      className="w-full text-left px-6 py-4 flex items-center justify-between border-b border-white/5 hover:bg-blue-500/10 transition-colors group"
                    >
                       <div>
                          <span className="text-sm font-black text-white group-hover:text-blue-400">{p.name}</span>
                          <span className="ml-3 text-[10px] font-black uppercase text-gray-500 tracking-widest">{p.category}</span>
                       </div>
                       <Command size={14} className="text-gray-600 group-hover:text-blue-500" />
                    </button>
                  ))}
                {data?.products?.filter((p: Product) => p.name.toLowerCase().includes(cmdKQuery.toLowerCase())).length === 0 && (
                   <div className="p-8 text-center text-gray-500 text-sm font-bold">No technical records found matching your query.</div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Sticky Note */}
      <motion.div
        drag
        dragMomentum={false}
        initial={{ x: 30, y: 300 }}
        className="fixed top-0 left-0 z-[350] w-64 bg-cyan-900/40 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-[0_0_40px_rgba(6,182,212,0.2)] overflow-hidden flex flex-col"
        style={{ cursor: 'grab' }}
        whileDrag={{ cursor: 'grabbing', scale: 1.02 }}
      >
        <div className="bg-cyan-500/20 px-4 py-2 flex items-center justify-between border-b border-cyan-500/30">
           <span className="text-[9px] font-black uppercase tracking-widest text-cyan-300 flex items-center gap-2"><GripHorizontal size={10} /> Quick Note</span>
        </div>
        <textarea 
          value={noteContent}
          onChange={e => setNoteContent(e.target.value)}
          placeholder="Jot down quick reminders here..."
          className="w-full bg-transparent p-4 min-h-[150px] resize-none text-xs text-cyan-50 font-medium leading-relaxed outline-none focus:bg-cyan-500/10 transition-colors custom-scrollbar"
        />
      </motion.div>

      {/* Media Vault Modal for Slides */}
      <MediaVaultModal 
        key="global-slide-media-vault"
        isOpen={!!vaultOpenForSlide} 
        onClose={() => setVaultOpenForSlide(null)} 
        onSelect={(url) => {
          if (vaultOpenForSlide) {
            updateSlide(vaultOpenForSlide.slideIdx, vaultOpenForSlide.field, url);
          }
        }} 
      />
      <BulkImporter 
        key="global-bulk-importer"
        isOpen={isBulkImporterOpen}
        onClose={() => setIsBulkImporterOpen(false)}
        onImport={handleBulkImport}
      />
    </div>
  );
}
