"use client";

import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "@/utils/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Phone, Users, ArrowUpDown, Sparkles,
  X, Globe, ExternalLink, Award
} from "lucide-react";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.05 }
  })
};

export default function LeadersPage() {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAscending, setIsAscending] = useState(false);
  const [selectedLeader, setSelectedLeader] = useState<any | null>(null);

  useEffect(() => {
    fetchLeaders();
  }, []);

  const fetchLeaders = async () => {
    const { data, error } = await supabase.from("leaders").select("*");
    if (!error) setLeaders(data || []);
    setLoading(false);
  };

  const sortedLeaders = useMemo(() => {
    let result = [...leaders];
    result.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return isAscending ? dateA - dateB : dateB - dateA;
    });
    return result;
  }, [leaders, isAscending]);

  return (
    <div className="bg-[#FAFAFA] min-h-screen p-4 md:p-8 selection:bg-[#FF6600] selection:text-white font-sans">
      <div className="max-w-8xl mx-auto space-y-16">

        {/* --- PREMIUM CINEMATIC HEADER --- */}
        {/* --- BRAND HEADER CARD --- */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#FF6600] rounded-[2.5rem] p-8 md:p-14 shadow-[0_20px_50px_rgba(255,102,0,0.3)] flex flex-col lg:flex-row justify-between items-center gap-10 relative overflow-hidden"
        >
          {/* Background Polish */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 blur-[80px] rounded-full -ml-20 -mb-20" />

          <div className="relative z-10 space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white font-bold text-[10px] uppercase tracking-[0.3em]">
              <Users size={14} className="animate-pulse" /> Core Leadership
            </div>

            <div className="space-y-2">
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-[0.85]">
                Our <br /> <span className="text-black/20">Visionaries.</span>
              </h1>
              <p className="text-white/80 max-w-sm text-sm font-medium leading-relaxed">
                Meet the strategic minds driving innovation and global structural impact.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 relative z-10 w-full lg:w-auto">
            {/* Sort Toggle Button */}
            <button
              onClick={() => setIsAscending(!isAscending)}
              className="flex items-center justify-center gap-4 px-8 py-5 bg-black rounded-[1.5rem] hover:bg-zinc-900 transition-all shadow-2xl group"
            >
              <ArrowUpDown size={20} className="text-[#FF6600] group-hover:rotate-180 transition-transform duration-500" />
              <div className="flex flex-col items-start leading-none text-left">
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">Join Date</span>
                <span className="text-xs font-black uppercase tracking-widest text-white">
                  {isAscending ? "Early Added" : "Latest Added"}
                </span>
              </div>
            </button>
          </div>
        </motion.header>

        {/* --- GRID SECTION (Compact Edition) --- */}
        <section className="pb-24">
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {sortedLeaders.map((l, idx) => (
                <motion.div
                  layout
                  key={l.id}
                  variants={cardVariants}
                  custom={idx}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ y: -6 }}
                  onClick={() => setSelectedLeader(l)}
                  className="group cursor-pointer relative bg-white rounded-[1.5rem] border border-zinc-100 p-3 hover:shadow-xl transition-all duration-500"
                >
                  {/* Smaller Aspect Ratio Image Container */}
                  <div className="relative aspect-square rounded-[1.2rem] overflow-hidden mb-4 bg-zinc-50">
                    <img
                      src={l.image_url || "/placeholder.jpg"}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                      alt={l.name}
                    />
                    {/* Subtle Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-[#FF6600] text-[8px] font-black uppercase tracking-[0.2em] mb-1">
                        {l.role}
                      </p>
                      <h3 className="text-lg font-black text-white uppercase tracking-tighter leading-tight">
                        {l.name}
                      </h3>
                    </div>
                  </div>

                  {/* Compact Bottom Bar */}
                  <div className="px-1 pb-1 flex justify-between items-center">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-[#FF6600] transition-colors">
                      Full Profile
                    </span>
                    <div className="w-7 h-7 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-300 group-hover:bg-[#FF6600]/10 group-hover:text-[#FF6600] transition-all">
                      <ExternalLink size={12} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* --- MODAL (Medium Size) --- */}
        <AnimatePresence>
          {selectedLeader && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setSelectedLeader(null)}
                className="absolute inset-0 bg-zinc-900/60 backdrop-blur-md"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden"
              >
                {/* Close */}
                <button
                  onClick={() => setSelectedLeader(null)}
                  className="absolute top-6 right-6 z-50 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center border border-zinc-100 hover:bg-zinc-900 hover:text-white transition-all shadow-sm"
                >
                  <X size={18} />
                </button>

                {/* Profile Header (Half Image) */}
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-1/3 aspect-square md:aspect-auto h-auto min-h-[250px]">
                    <img src={selectedLeader.image_url} className="w-full h-full object-cover" alt="" />
                  </div>

                  <div className="w-full md:w-2/3 p-8 md:p-10 flex flex-col justify-center bg-white">
                    <div className="inline-flex items-center gap-2 text-[#FF6600] mb-3">
                      <Sparkles size={14} fill="currentColor" />
                      <span className="text-[9px] font-black uppercase tracking-[0.3em]">{selectedLeader.role}</span>
                    </div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter text-zinc-900 mb-6">
                      {selectedLeader.name}
                    </h2>

                    <p className="text-zinc-500 text-sm font-medium leading-relaxed italic mb-8">
                      "{selectedLeader.description}"
                    </p>

                    <div className="space-y-4 border-t border-zinc-50 pt-6">
                      <div className="flex items-center gap-4 group">
                        <div className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:text-[#FF6600] transition-colors">
                          <Mail size={14} />
                        </div>
                        <div>
                          <p className="text-[8px] font-black text-zinc-300 uppercase tracking-widest">Email</p>
                          <p className="text-xs font-bold text-zinc-700">{selectedLeader.email || "N/A"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 group">
                        <div className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:text-[#00a958] transition-colors">
                          <Phone size={14} />
                        </div>
                        <div>
                          <p className="text-[8px] font-black text-zinc-300 uppercase tracking-widest">Phone</p>
                          <p className="text-xs font-bold text-zinc-700">{selectedLeader.phone || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* --- EMPTY STATE --- */}
        {leaders.length === 0 && !loading && (
          <div className="py-40 text-center bg-white rounded-[3rem] border-2 border-dashed border-zinc-100">
            <Users size={48} className="mx-auto mb-6 text-zinc-100" />
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-300">No Leaders Found</p>
          </div>
        )}
      </div>
    </div>
  );
}