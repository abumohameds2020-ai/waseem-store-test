"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Headphones, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import EditableText from './EditableText';
import EditableImage from './EditableImage';

export default function CollectionTiles({ collectionImages }: { collectionImages?: any }) {
  const collections = [
    {
      id: 'planar',
      title: 'The Planar Series',
      desc: 'Nano-diaphragm speed for transparent detail.',
      image: collectionImages?.planar || '/assets/planar_series.png',
      path: 'cms.collectionImages.planar',
      color: 'from-blue-500/20',
      icon: <Sparkles size={32} />
    },
    {
      id: 'esports',
      title: 'The Esports Killers',
      desc: 'Pinpoint imaging for the most competitive play.',
      image: collectionImages?.esports || '/assets/esports_series.png',
      path: 'cms.collectionImages.esports',
      color: 'from-amber-500/20',
      icon: <Zap size={32} />
    },
    {
      id: 'daily',
      title: 'Daily Drivers',
      desc: 'Balanced fun for your everyday acoustic fix.',
      image: collectionImages?.daily || '/assets/daily_series.png',
      path: 'cms.collectionImages.daily',
      color: 'from-purple-500/20',
      icon: <Headphones size={32} />
    }
  ];

  return (
    <section className="py-40 bg-[#030303]">
      <div className="container mx-auto px-6 lg:px-12 mb-20 text-center">
         <h2 className="text-4xl lg:text-7xl font-black text-white uppercase tracking-tighter mb-6">
           <EditableText value="Explore the" path="cms.collection_header.prefix" tagName="span" /> <br /> 
           <span className="text-gray-500">
             <EditableText value="Curated Arsenal" path="cms.collection_header.main" tagName="span" />
           </span>
         </h2>
         <p className="text-xs text-gray-700 font-bold uppercase tracking-[0.5em]">
           <EditableText value="Tactically Grouped By Acoustic DNA" path="cms.collection_header.sub" />
         </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 h-screen min-h-[600px] gap-6 px-6 lg:px-12">
        {collections.map((col, i) => (
          <motion.div 
            key={col.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2 }}
            whileHover={{ scale: 1.02 }}
            className="group relative h-full rounded-[48px] overflow-hidden border border-white/5 cursor-pointer shadow-2xl transition-shadow hover:shadow-cyan-500/10"
          >
            {/* Background Image with Hover Effect */}
            <div className="absolute inset-0 bg-[#080808]">
              <div className="absolute inset-0 group-hover:scale-110 transition-transform duration-[3000ms] grayscale group-hover:grayscale-0 transition-opacity group-hover:opacity-60">
                 <EditableImage src={col.image} path={col.path} alt={col.title} className="w-full h-full object-cover" />
              </div>
              <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex-col justify-end p-12 transition-all group-hover:bg-gradient-to-b group-hover:from-black/10 group-hover:to-black/90 pointer-events-none`} />
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br ${col.color} to-transparent pointer-events-none transition-opacity`} />
            </div>

            {/* Content Container */}
            <div className="absolute inset-0 p-16 flex flex-col justify-end gap-6 z-10 pointer-events-none">
               <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white mb-4 group-hover:border-white/30 transition-all">
                  {col.icon}
               </div>

               <h3 className="text-4xl font-black text-white uppercase tracking-tighter group-hover:translate-x-2 transition-transform pointer-events-auto">
                 <EditableText value={col.title} path={`cms.collections.${i}.title`} tagName="span" />
               </h3>
               <p className="text-gray-400 font-medium text-lg leading-relaxed max-w-[280px] group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-700 pointer-events-auto">
                 <EditableText value={col.desc} path={`cms.collections.${i}.desc`} tagName="span" multiline />
               </p>

               <div className="pt-8 opacity-0 group-hover:opacity-100 translate-y-10 group-hover:translate-y-0 transition-all duration-700 pointer-events-auto">
                  <Link 
                     href="/shop" 
                     className="flex items-center gap-4 text-[10px] font-black text-white hover:text-cyan-500 uppercase tracking-widest transition-colors scale-90 group-hover:scale-100 origin-left"
                   >
                     <EditableText value="Explore Collection" path={`cms.collections.${i}.cta`} tagName="span" /> <ChevronRight size={16} />
                  </Link>
               </div>
            </div>

            {/* Counter */}
            <div className="absolute top-12 right-12 text-6xl font-black text-white/5 italic select-none group-hover:text-white/10 transition-colors">
               0{i + 1}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
