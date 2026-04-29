"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, Newspaper, Search, ArrowUpDown, X, 
  ExternalLink, Loader2, Zap, Clock, ChevronRight, 
  PlayCircle, Layers, Quote, Tag
} from "lucide-react";

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [filteredNews, setFilteredNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAscending, setIsAscending] = useState(false);
  const [selectedNews, setSelectedNews] = useState<any | null>(null);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .eq("status", "published") 
        .order("publish_date", { ascending: isAscending });

      if (error) throw error;
      setNews(data || []);
      setFilteredNews(data || []);
    } catch (err) {
      console.error("Error fetching news:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNews(); }, [isAscending]);

  useEffect(() => {
    const filtered = news.filter((item) =>
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredNews(filtered);
  }, [searchQuery, news]);

  return (
    <div className="bg-[#F8F9FA] min-h-screen p-4 md:p-10 selection:bg-[#FF6600] selection:text-white font-sans">
      <div className="max-w-[1500px] mx-auto space-y-10">
        
        {/* --- BRAND HEADER --- */}
     <motion.header 
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  className="bg-[#FF6600] rounded-[2.5rem] p-8 md:p-14 shadow-[0_20px_50px_rgba(255,102,0,0.3)] flex flex-col lg:flex-row justify-between items-center gap-10 relative overflow-hidden"
>
  {/* Abstract Background Shapes for Depth */}
  <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full -mr-32 -mt-32" />
  <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 blur-[80px] rounded-full -ml-20 -mb-20" />

  <div className="relative z-10 space-y-5 text-center lg:text-left">
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white font-bold text-[10px] uppercase tracking-[0.3em]">
      <Newspaper size={14} className="animate-pulse" /> The News Room
    </div>
    
    <div className="space-y-2">
      <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-[0.85]">
        Latest <br /> <span className="text-black/20">Insights.</span>
      </h1>
      <p className="text-white/80 max-w-sm text-sm font-medium leading-relaxed ">
        Real-time editorial updates from our global initiatives and community breakthroughs.
      </p>
    </div>
  </div>

  <div className="flex flex-col sm:flex-row gap-4 relative z-10 w-full lg:w-auto">
    {/* Search Bar Input - Glassmorphism Style */}
    <div className="relative group flex-grow lg:w-96">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-white transition-colors">
        <Search size={20} />
      </div>
      <input 
        type="text"
        placeholder="Search the archives..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-14 pr-12 py-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[1.5rem] text-sm font-bold text-white placeholder:text-white/50 focus:outline-none focus:bg-white/20 focus:border-white/50 transition-all shadow-inner"
      />
      {searchQuery && (
        <button 
          onClick={() => setSearchQuery("")}
          className="absolute right-5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>
      )}
    </div>

    {/* Sort Toggle Button - Dark Contrast Style */}
    <button 
      onClick={() => setIsAscending(!isAscending)}
      className="flex items-center justify-center gap-4 px-8 py-5 bg-black rounded-[1.5rem] hover:bg-zinc-900 transition-all shadow-2xl group"
    >
      <ArrowUpDown size={20} className="text-[#FF6600] group-hover:rotate-180 transition-transform duration-500" />
      <div className="flex flex-col items-start leading-none">
        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">Sort By Date</span>
        <span className="text-xs font-black uppercase tracking-widest text-white">
          {isAscending ? "Oldest First" : "Latest First"}
        </span>
      </div>
    </button>
  </div>
</motion.header>


        {/* --- 2-COLUMN HORIZONTAL GRID --- */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="animate-spin text-[#FF6600]" size={48} />
            <p className="text-xs font-black uppercase tracking-widest text-zinc-400">Syncing Feed...</p>
          </div>
        ) : (
          <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredNews.map((n) => (
                <motion.div
                  key={n.id} layout
                  initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  onClick={() => setSelectedNews(n)}
                  className={`group relative flex flex-col sm:flex-row h-auto sm:h-[230px] bg-white rounded-[2.5rem] border transition-all duration-500 cursor-pointer overflow-hidden
                    ${n.is_breaking ? 'border-red-500 shadow-[0_15px_30px_rgba(239,68,68,0.1)]' : 'border-zinc-100 hover:shadow-xl'}`}
                >
                  {/* LEFT: IMAGE SECTION */}
                  <div className="w-full sm:w-[38%] h-[200px] sm:h-full relative overflow-hidden">
                    <img src={n.image_url || "/placeholder.jpg"} className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={n.title} />
                    {n.is_breaking && (
                      <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1.5 rounded-lg shadow-xl animate-pulse">
                        <Zap size={12} fill="white" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Breaking</span>
                      </div>
                    )}
                  </div>

                  {/* RIGHT: CONTENT SECTION */}
                  <div className="w-full sm:w-[62%] p-6 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.1em]">
                        <span className={`px-2 py-0.5 rounded-md ${n.is_breaking ? 'bg-red-50 text-red-600' : 'bg-zinc-100 text-zinc-500'}`}>
                          {n.category}
                        </span>
                        <div className="flex items-center gap-3 text-zinc-400">
                          <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(n.publish_date).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{n.reading_time || 5} Min</span>
                        </div>
                      </div>
                      
                      <h3 className={`text-xl md:text-2xl font-black uppercase tracking-tighter leading-tight transition-colors line-clamp-2
                        ${n.is_breaking ? 'group-hover:text-red-600' : 'group-hover:text-[#FF6600]'}`}>
                        {n.title}
                      </h3>
                      
                      <p className="text-zinc-500 text-[13px] line-clamp-2 leading-relaxed font-medium">
                        {n.excerpt}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-zinc-50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-[9px]
                          ${n.is_breaking ? 'bg-red-600' : 'bg-black'}`}>
                          {n.author?.charAt(0) || 'A'}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black uppercase text-zinc-800 tracking-tighter italic leading-none">{n.author || "Staff"}</span>
                          <span className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest">{n.bias_sentiment || 'Neutral'}</span>
                        </div>
                      </div>
                      <ChevronRight size={20} className={`transition-transform duration-300 group-hover:translate-x-1 ${n.is_breaking ? 'text-red-600' : 'text-[#FF6600]'}`} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </section>
        )}

        {/* --- EXPANDED MODAL (DISPLAYING ALL DATA) --- */}
        <AnimatePresence>
          {selectedNews && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedNews(null)} className="absolute inset-0 bg-black/98 backdrop-blur-2xl" />
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white w-full max-w-6xl rounded-[3.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row h-full max-h-[90vh]">
                
                {/* MODAL LEFT: MEDIA COLUMN */}
                <div className="w-full md:w-[45%] bg-zinc-50 overflow-y-auto p-6 space-y-6 no-scrollbar border-r border-zinc-100">
                  <img src={selectedNews.image_url} className="w-full rounded-[2.5rem] shadow-2xl" alt="Cover" />
                  
                  {/* GALLERY SECTION */}
                  {selectedNews.gallery_urls && selectedNews.gallery_urls.length > 0 && (
                    <div className="space-y-4">
                       <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-2 flex items-center gap-2">
                        <Layers size={14}/> Image Evidence Gallery
                       </h4>
                       <div className="grid grid-cols-2 gap-3">
                         {selectedNews.gallery_urls.map((url: string, idx: number) => (
                           <img key={idx} src={url} className="w-full h-24 object-cover rounded-2xl hover:opacity-80 transition-opacity cursor-pointer" />
                         ))}
                       </div>
                    </div>
                  )}

                  {/* VIDEO PREVIEW */}
                  {selectedNews.video_url && (
                    <div className="relative group rounded-[2.5rem] overflow-hidden aspect-video bg-black shadow-xl">
                       <div className="absolute inset-0 flex items-center justify-center z-10">
                          <a href={selectedNews.video_url} target="_blank" className="bg-white p-4 rounded-full text-black hover:scale-110 transition-transform shadow-2xl">
                             <PlayCircle size={32} />
                          </a>
                       </div>
                       <img src={selectedNews.image_url} className="absolute inset-0 w-full h-full object-cover opacity-40 blur-sm" />
                    </div>
                  )}
                </div>

                {/* MODAL RIGHT: INFO COLUMN */}
                <div className="w-full md:w-[55%] p-8 md:p-14 overflow-y-auto bg-white no-scrollbar flex flex-col">
                  <div className="flex justify-between items-center mb-10">
                    <div className="flex gap-2">
                      <span className={`text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest text-white ${selectedNews.is_breaking ? 'bg-red-600' : 'bg-[#FF6600]'}`}>
                        {selectedNews.category}
                      </span>
                      <span className="bg-zinc-100 text-zinc-500 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest">
                        {selectedNews.bias_sentiment}
                      </span>
                    </div>
                    <button onClick={() => setSelectedNews(null)} className="p-3 bg-zinc-50 hover:bg-zinc-100 rounded-full transition-colors"><X size={20}/></button>
                  </div>

                  <div className="space-y-6 flex-grow">
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-[0.95]">{selectedNews.title}</h2>
                    
                    <div className="flex flex-wrap gap-6 py-6 border-y border-zinc-100 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                      <span className="flex items-center gap-2 text-black"><Clock size={14} className="text-[#FF6600]"/> {new Date(selectedNews.publish_date).toDateString()}</span>
                      <span className="flex items-center gap-2"><Quote size={14} className="text-[#FF6600]"/> By {selectedNews.author}</span>
                      <span className="flex items-center gap-2"><Tag size={14} className="text-[#FF6600]"/> {selectedNews.tags || 'General'}</span>
                    </div>

                    <div className="prose prose-zinc max-w-none">
                      <p className="text-zinc-400 text-lg font-bold leading-relaxed mb-6 italic">"{selectedNews.excerpt}"</p>
                      <p className="text-zinc-600 text-base leading-relaxed whitespace-pre-wrap">{selectedNews.content}</p>
                    </div>
                  </div>

                  {selectedNews.external_link && (
                    <div className="mt-12">
                      <a href={selectedNews.external_link} target="_blank" className={`w-full text-white py-6 rounded-[2rem] flex items-center justify-center gap-3 font-black uppercase tracking-widest text-xs transition-all shadow-xl
                        ${selectedNews.is_breaking ? 'bg-red-600 hover:bg-red-700 shadow-red-200' : 'bg-black hover:bg-[#FF6600] shadow-zinc-200'}`}>
                        Access Original Source <ExternalLink size={18} />
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}