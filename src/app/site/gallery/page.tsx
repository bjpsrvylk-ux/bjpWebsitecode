"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from "@/utils/supabase";
import { motion, AnimatePresence, Variants } from "framer-motion"; // Add Variants to your import
import { X, Play, Sparkles, LayoutGrid, ArrowUpDown, Filter, Eye } from 'lucide-react';

const itemVariants: Variants = { // Define the type here
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.6, 
      ease: [0.22, 1, 0.36, 1], 
      delay: i * 0.05 
    } 
  })
};

export default function GalleryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [filter, setFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [categories, setCategories] = useState<string[]>(['All']);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    const { data } = await supabase.from('gallery').select('*');
    if (data) {
      setItems(data);
      const cats = ['All', ...Array.from(new Set(data.map((item: any) => item.category_name)))];
      setCategories(cats as string[]);
    }
    setLoading(false);
  };

  const processedItems = useMemo(() => {
    let result = [...items];
    if (filter !== 'All') result = result.filter(item => item.category_name === filter);
    result.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
    return result;
  }, [items, filter, sortOrder]);

  return (
    <div className="bg-[#F8F9FA] min-h-screen p-4 md:p-8 selection:bg-[#FF6600] selection:text-white">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* --- VIBRANT BRAND HEADER CARD (Matching News/Campaigns) --- */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#FF6600] rounded-[2.5rem] p-8 md:p-14 shadow-[0_20px_50px_rgba(255,102,0,0.3)] flex flex-col lg:flex-row justify-between items-center gap-10 relative overflow-hidden"
        >
          {/* Decorative Depth Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 blur-[80px] rounded-full -ml-20 -mb-20" />

          <div className="relative z-10 space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white font-bold text-[10px] uppercase tracking-[0.3em]">
              <Sparkles size={14} className="text-white animate-pulse" /> Media Archive
            </div>
            
            <div className="space-y-2">
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-[0.85]">
                Visual <br /> <span className="text-black/20">Library.</span>
              </h1>
              <p className="text-white/80 max-w-sm text-sm font-medium leading-relaxed ">
                A high-fidelity collection of captured moments and campaign highlights.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 relative z-10 w-full lg:w-auto">
            {/* Sort Toggle - Glassmorphism */}
            <button 
              onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
              className="flex items-center justify-center gap-4 px-8 py-5 bg-black rounded-[1.5rem] hover:bg-zinc-900 transition-all shadow-2xl group"
            >
              <ArrowUpDown size={20} className="text-[#FF6600]" />
              <div className="flex flex-col items-start leading-none text-left">
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">Sorting Order</span>
                <span className="text-xs font-black uppercase tracking-widest text-white">
                  {sortOrder === 'newest' ? "Newest First" : "Oldest First"}
                </span>
              </div>
            </button>
          </div>
        </motion.header>

        {/* --- CATEGORY NAVIGATION --- */}
        <div className="flex justify-center">
          <nav className="inline-flex items-center gap-1.5 p-1.5 bg-white rounded-full border border-zinc-200 shadow-sm overflow-x-auto max-w-full no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`whitespace-nowrap px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-full transition-all duration-300 ${
                  filter === cat 
                    ? 'bg-[#FF6600] text-white shadow-[0_10px_20px_rgba(255,102,0,0.2)]' 
                    : 'text-zinc-400 hover:text-[#FF6600]'
                }`}
              >
                {cat}
              </button>
            ))}
          </nav>
        </div>

        {/* --- MEDIA GRID --- */}
        <section className="pb-20">
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {processedItems.map((item, idx) => {
                const fileUrl = item.media?.[0]?.url || item.media?.[0] || "";
                const isVideo = fileUrl.toLowerCase().match(/\.(mp4|webm|ogg|mov)$/) || item.file_type?.includes('video');

                return (
                  <motion.div
                    layout
                    key={item.id}
                    variants={itemVariants}
                    custom={idx}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="group bg-white rounded-[2rem] border border-zinc-200/50 p-3 hover:shadow-2xl hover:shadow-zinc-200 transition-all duration-500 cursor-pointer"
                    onClick={() => setSelectedImg(fileUrl)}
                  >
                    <div className="relative aspect-[3/4] rounded-[1.5rem] overflow-hidden bg-zinc-100">
                      {isVideo ? (
                        <video autoPlay muted loop playsInline className="w-full h-full object-cover">
                          <source src={fileUrl} type="video/mp4" />
                        </video>
                      ) : (
                        <img src={fileUrl} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={item.title} />
                      )}
                      
                      {/* Overlay Info */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                        <div className="flex items-center justify-between items-end">
                          <div className="space-y-1">
                            <span className="text-[#FF6600] text-[9px] font-black uppercase tracking-widest">{item.category_name}</span>
                            <h3 className="text-lg font-black text-white uppercase tracking-tight leading-none">{item.title}</h3>
                          </div>
                          <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30">
                            <Eye size={18} />
                          </div>
                        </div>
                      </div>

                      {/* Video Indicator */}
                      {isVideo && (
                        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md p-2 rounded-full text-white">
                          <Play size={12} fill="white" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </section>
      </div>

      {/* --- LIGHTBOX (Inverted for High-End Feel) --- */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12"
            onClick={() => setSelectedImg(null)}
          >
            <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"><X size={40} /></button>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="relative max-w-6xl w-full">
              {selectedImg.match(/\.(mp4|webm|ogg|mov)$/) ? (
                <video autoPlay controls className="rounded-[2rem] shadow-2xl w-full max-h-[80vh] border border-white/10">
                  <source src={selectedImg} type="video/mp4" />
                </video>
              ) : (
                <img src={selectedImg} className="w-full max-h-[85vh] object-contain rounded-[2rem] shadow-2xl border border-white/10" />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}