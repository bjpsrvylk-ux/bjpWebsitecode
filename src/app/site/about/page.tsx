"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from "@/utils/supabase";
import {
  Users, Target, Mail, Phone, MapPin,
  Sparkles, Quote, MoveRight, Shield,MoveLeft,ArrowUpRight,
  Heart, Handshake, CheckCircle, Activity
} from 'lucide-react';
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from 'lucide-react';

// --- ANIMATION CONFIG ---
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.8, 
      ease: [0.22, 1, 0.36, 1] 
    } 
  }
};
// Define a type for your state to keep it clean
type PageData = {
  story: string;
  mission: string;
  team: any[];
  stats: any[];
  journey: any[];
};

export default function AboutUsPage() {
  const [settings, setSettings] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
const [data, setData] = useState<PageData>({
    story: '',
    mission: '',
    team: [],
    stats: [],
    journey: []
  });
  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const { data: settingsData } = await supabase.from('site_settings').select('*').eq('id', 1).single();
        const { data: sections } = await supabase.from('about_sections').select('*');
        const { data: teamData } = await supabase.from('team_members').select('*').order('priority', { ascending: true });
        const { data: statsData } = await supabase.from('about_stats').select('*');
        const { data: journeyData } = await supabase.from('about_journey').select('*').order('year', { ascending: true });

        setSettings(settingsData);
        setData({
          story: sections?.find(s => s.section_type === 'story')?.content || '',
          mission: sections?.find(s => s.section_type === 'mission')?.content || '',
          team: teamData || [],
          stats: statsData || [],
          journey: journeyData || []
        });
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchAll();
  }, []);

  return (
    <div className="bg-[#F8F9FA] text-zinc-900 selection:bg-[#FF6600] selection:text-white overflow-hidden">

      {/* --- 1. PREMIUM MINIMALIST HERO --- */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24 py-20 overflow-hidden bg-white">

        {/* Right-side Image Composition */}
        <div className="absolute top-0 right-0 w-full lg:w-1/2 h-[45vh] lg:h-full z-0">
          <div className="relative w-full h-full">
            <motion.div
              initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
              animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
              transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
              className="relative w-full h-full overflow-hidden rounded-bl-[4rem] lg:rounded-bl-[10rem] shadow-2xl"
            >
              <motion.img
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 2 }}
                src="/ban.jpg"
                className="w-full h-full object-cover brightness-90 hover:grayscale-0 transition-all duration-1000"
              />

              {/* --- CLIENT SATISFACTION FLOATING BADGE --- */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 }}
                className="absolute bottom-10 left-10 lg:left-[-15%] p-6 backdrop-blur-xl bg-white/80 border border-white/20 shadow-2xl rounded-2xl max-w-[200px] z-20"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-[#FF6600] text-3xl font-black ">100%</span>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-800 leading-tight">
                    Client <br /> Satisfaction
                  </span>
                  <div className="w-8 h-[2px] bg-[#FF6600] mt-2" />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <div className="relative z-10 max-w-4xl">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>

            {/* REDUCED SIZE TITLE */}
            <div className="flex items-center gap-3 mb-8">
              <div className="h-[1px] w-8 bg-[#FF6600]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400">
                Global Leadership <span className="text-zinc-800">/</span> Est. 2008
              </span>
            </div>

            {/* SCALE REDUCED HEADLINE (From 10rem to 7rem) */}
            <h1 className="text-6xl md:text-[6rem] lg:text-[7.5rem] font-black leading-[0.9] tracking-tighter uppercase mb-8 text-zinc-900">
              Shape <br />
              <span className="text-[#FF6600] relative">
                The future.
                <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-zinc-100" />
              </span>
            </h1>

            <p className="text-lg md:text-xl text-zinc-500 max-w-xl font-medium leading-relaxed pl-8 border-l-2 border-[#FF6600]/30">
              {settings?.description || "Building structural excellence and community impact through visionary leadership."}
            </p>
          </motion.div>
        </div>

        {/* STATS BAR */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-4xl relative z-10"
        >
          {data.stats.slice(0, 4).map((s: any, i: number) => (
            <div key={i} className="group cursor-default">
              <h2 className="text-3xl font-black text-zinc-900 group-hover:text-[#FF6600] transition-colors duration-300">
                {s.value}<span className="text-[#FF6600] text-sm ml-0.5">+</span>
              </h2>
              <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">{s.label}</p>
            </div>
          ))}
        </motion.div>

      </section>

      {/* --- 2. FOUNDER ARCHETYPE --- */}
      <section className="py-2 bg-zinc-900 text-white rounded-[4rem] lg:rounded-[10rem] mx-4">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} className="relative">
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 p-4 bg-white/5 backdrop-blur-sm">
              <img src="/Vishwanath.jpg" alt="Founder" className="w-full h-full object-cover rounded-[2rem] grayscale hover:grayscale-0 transition-all duration-1000" />
            </div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#FF6600] rounded-full flex items-center justify-center p-8 text-center rotate-12">
              <p className="text-xs font-black uppercase leading-tight">16+ Years of Governance</p>
            </div>
          </motion.div>

          <div className="space-y-10">
            <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none">
              The <span className="text-[#FF6600]">Architect</span> <br /> of Change.
            </h2>
            <div className="space-y-6">
              <Quote size={40} className="text-[#FF6600]" />
              <p className="text-2xl md:text-3xl font-light leading-relaxed">
                "Real leadership isn't about power—it's about the <span className="text-[#FF6600] font-bold">infrastructure of trust</span> we build within our community."
              </p>
              <div className="pt-6">
                <h4 className="text-xl font-black uppercase">S.R. Vishwanath</h4>
                <p className="text-zinc-500 font-bold text-sm uppercase tracking-widest">MLA, Karnataka Legislative Assembly</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 3. STORY & JOURNEY SPLIT --- */}
      <section className="py-14 max-w-[1600px] mx-auto px-6 bg-[#fafafa]">
        <div className="grid lg:grid-cols-12 gap-16 xl:gap-24">

          {/* LEFT SIDE: STATIC STORY & MISSION */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-32">
              <div className="inline-flex items-center gap-3 mb-6">
                <span className="h-[2px] w-8 bg-[#FF6600]"></span>
                <span className="text-[#FF6600] font-black text-xs uppercase tracking-[0.4em]">Our Origin</span>
              </div>

              <h2 className="text-6xl xl:text-7xl font-black uppercase tracking-tighter mb-8 leading-[0.9]">
                A Legacy <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6600] to-orange-400">
                  in the Making.
                </span>
              </h2>

              <p className="text-zinc-600 text-lg leading-relaxed whitespace-pre-wrap max-w-xl">
                {data.story}
              </p>

              {/* MISSION CARD - Modernized */}
              <div className="mt-16 relative">
                <div className="absolute inset-0 bg-[#FF6600] rounded-[3rem] rotate-2 scale-105 opacity-5 blur-xl"></div>
                <div className="relative p-10 bg-white border border-zinc-100 rounded-[3rem] shadow-2xl shadow-zinc-200/40 group overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Target size={120} />
                  </div>

                  <Target className="text-[#FF6600] mb-6 group-hover:rotate-12 transition-transform duration-500" size={40} />
                  <h3 className="text-2xl font-black uppercase mb-4 tracking-tight">The Mission</h3>
                  <p className="text-zinc-500 text-lg font-medium  leading-snug">
                    "{data.mission}"
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: SCROLLABLE JOURNEY */}
          <div className="lg:col-span-7 space-y-2 relative">
            {/* Decorative Timeline Line */}
            <div className="absolute left-[2.2rem] md:left-[3.1rem] top-10 bottom-10 w-[1px] bg-zinc-200 hidden md:block"></div>

            {data.journey.map((item: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group relative flex flex-col md:flex-row gap-6 md:gap-12 p-8 md:p-12 rounded-[2.5rem] transition-all duration-500 hover:bg-white hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)]"
              >
                {/* Year Indicator */}
                <div className="relative z-10 shrink-0">
                  <span className="text-5xl md:text-7xl font-black text-black group-hover:text-[#FF6600] transition-colors duration-500 tabular-nums leading-none">
                    {item.year}
                  </span>
                  {/* Animated Dot on the Line */}
                  <div className="absolute top-1/2 -left-[1.85rem] w-3 h-3 rounded-full bg-zinc-200 border-2 border-[#fafafa] group-hover:bg-[#FF6600] group-hover:scale-150 transition-all duration-300 hidden md:block"></div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="h-px w-6 bg-[#FF6600] opacity-0 group-hover:opacity-100 transition-all duration-500"></span>
                    <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight group-hover:text-[#FF6600] transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-zinc-500 text-base md:text-lg leading-relaxed max-w-lg">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 4. CORE BELIEFS: ARCHITECTURAL GLASS --- */}
      <section className="py-4 bg-[#fcfaf7] rounded-[4rem] lg:rounded-[8rem] relative z-20 border-y border-zinc-100">
        <div className="max-w-7xl mx-auto px-6">

          {/* HEADER: Clean & Minimal */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-[1px] bg-[#FF6600]" />
                <p className="text-[#FF6600] font-black uppercase tracking-[0.4em] text-[10px]">Our Philosophy</p>
              </div>
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none text-zinc-900">
                Core <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6600] to-[#ff9933]">Beliefs.</span>
              </h2>
            </div>
            <p className="text-zinc-500 font-medium max-w-sm border-l border-zinc-200 pl-6 ">
              "Guided by principles that prioritize the community, fueled by a purpose that shapes the future."
            </p>
          </div>

          {/* GRID: Interactive Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Cultural Nationalism", icon: Shield, desc: "Preserving heritage through modern progress." },
              { title: "Integral Humanism", icon: Heart, desc: "Focusing on the holistic growth of every individual." },
              { title: "Social Harmony", icon: Handshake, desc: "Building bridges across all sections of society." },
              { title: "Good Governance", icon: CheckCircle, desc: "Transparency and efficiency in every action." }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="group relative p-10 rounded-[3rem] bg-white border border-zinc-200/50 hover:border-[#FF6600]/30 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(255,102,0,0.1)] overflow-hidden"
              >
                {/* Background Index Number (Decorative) */}
                <span className="absolute -bottom-4 -right-2 text-9xl font-black text-zinc-50 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500">
                  0{idx + 1}
                </span>

                {/* Icon Composition */}
                <div className="relative w-16 h-16 mb-8">
                  <div className="absolute inset-0 bg-zinc-900 rounded-2xl rotate-3 group-hover:rotate-12 group-hover:bg-[#FF6600] transition-all duration-500 shadow-lg shadow-zinc-200" />
                  <div className="absolute inset-0 flex items-center justify-center text-white">
                    <item.icon size={26} strokeWidth={2.5} />
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-xl font-black uppercase tracking-tight text-zinc-900 mb-3 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-zinc-500 text-sm font-medium leading-relaxed group-hover:text-zinc-700 transition-colors">
                    {item.desc}
                  </p>

                  {/* Minimalist Bottom Indicator */}
                  <div className="mt-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                    <div className="w-4 h-[1px] bg-[#FF6600]" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#FF6600]">Priority</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 5. THE TEAM (HORIZONTAL SCROLL STYLE) --- */}
  <section className="py-4 bg-zinc-50 overflow-hidden">
    <div className="max-w-7xl mx-auto px-6 mb-16">
      <div className="flex flex-col md:flex-row justify-between items-end gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-12 h-[2px] bg-[#FF6600]"></span>
            <span className="text-[#FF6600] font-black text-xs uppercase tracking-widest">Leadership</span>
          </div>
          <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85]">
            The <br /> <span className="text-[#FF6600]">Enablers.</span>
          </h2>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => scroll('left')}
            className="w-16 h-16 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300 group"
          >
            <ChevronLeft size={24} className="group-active:scale-75 transition-transform" />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="w-16 h-16 rounded-full bg-[#FF6600] text-white flex items-center justify-center hover:bg-black transition-all duration-300 shadow-xl shadow-orange-200 group"
          >
            <ChevronRight size={24} className="group-active:scale-75 transition-transform" />
          </button>
        </div>
      </div>
    </div>

    {/* Draggable / Scrollable Container */}
    <div 
      ref={scrollRef}
      className="flex gap-8 overflow-x-auto no-scrollbar snap-x snap-mandatory px-[max(1.5rem,calc((100vw-80rem)/2))] pb-12 cursor-grab active:cursor-grabbing"
      style={{ scrollbarWidth: 'none' }}
    >
      {data.team.map((m: any, i: number) => (
        <motion.div
          key={m.id}
          className="min-w-[350px] md:min-w-[450px] snap-start"
        >
          <div className="relative group">
            {/* Background Decorative Layer */}
            <div className="absolute inset-0 bg-[#FF6600] rounded-[4rem] translate-x-2 translate-y-2 opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10" />
            
            <div className="bg-white p-10 md:p-14 rounded-[4rem] border border-zinc-100 shadow-xl shadow-zinc-200/50 relative z-10 transition-transform duration-500 group-hover:-translate-y-2 group-hover:-translate-x-2">
              <div className="flex justify-between items-start mb-12">
                {/* Modern Avatar */}
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#FF6600] to-[#ff8533] rounded-[2rem] rotate-6 absolute inset-0 opacity-20 group-hover:rotate-12 transition-transform" />
                  <div className="w-24 h-24 bg-zinc-900 rounded-[2rem] flex items-center justify-center text-4xl font-black text-white relative z-10 group-hover:bg-[#FF6600] transition-colors duration-500">
                    {m.name.charAt(0)}
                  </div>
                </div>
                <div className="p-3 bg-zinc-50 rounded-2xl">
                  <Sparkles className="text-zinc-300 group-hover:text-[#FF6600] transition-colors" size={24} />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-3xl font-black uppercase tracking-tighter leading-none mb-2">
                    {m.name}
                  </h4>
                  <div className="inline-block px-3 py-1 bg-orange-50 rounded-full">
                    <p className="text-[#FF6600] text-[10px] font-black uppercase tracking-widest">{m.role}</p>
                  </div>
                </div>
                
                <p className="text-zinc-500 text-base leading-relaxed line-clamp-4 font-medium">
                  {m.bio}
                </p>

                <div className="pt-8 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="text-xs font-black uppercase tracking-widest text-zinc-400">View Profile</span>
                  <div className="h-[1px] flex-grow bg-zinc-100" />
                  <MoveRight size={20} className="text-[#FF6600]" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </section>

      {/* --- 6. MODERN CONTACT FOOTER --- */}
    {/* --- 5. CONTACT / CTA SECTION --- */}
{/* --- 6. COMPACT ARCHITECTURAL FOOTER --- */}
<section className="px-4 pb-0 pt-6 bg-white"> {/* Removed bottom padding */}
  <div className="bg-[#FAF9F6] rounded-t-[3.5rem] lg:rounded-t-[6rem] rounded-b-[1rem] p-8 md:p-16 lg:p-20 relative overflow-hidden border border-zinc-100 border-b-0">
    
    {/* DYNAMIC BACKGROUND WATERMARK */}
    <div className="absolute top-0 right-0 w-full h-full opacity-[0.02] pointer-events-none select-none">
      <div className="text-[20vw] font-black uppercase leading-none transform translate-x-10 translate-y-10 text-zinc-900">
        Impact
      </div>
    </div>

    <div className="relative z-10 grid lg:grid-cols-12 gap-10 items-center">
      
      {/* LEFT: THE CALL TO ACTION */}
      <div className="lg:col-span-6 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="w-12 h-[1px] bg-[#FF6600]" />
             <span className="text-[#FF6600] text-[10px] font-black uppercase tracking-[0.4em]">Contact</span>
          </div>
          <h3 className="text-4xl md:text-6xl lg:text-[5.5rem] font-black uppercase tracking-tighter leading-[0.85] text-zinc-900">
            Start your <br /> 
            <span className="text-[#FF6600]">Journey.</span>
          </h3>
        </div>
        
        <p className="text-base text-zinc-500 max-w-sm font-medium leading-relaxed">
          Connect with our leadership team for structural collaborations.
        </p>
      </div>

      {/* RIGHT: CONTACT MODULES */}
      <div className="lg:col-span-6 grid gap-3 w-full">
        {[
          { icon: Mail, label: "Email", val: settings?.email },
          { icon: Phone, label: "Phone", val: settings?.phone_number },
          { icon: MapPin, label: "Address", val: settings?.address }
        ].map((item, i) => (
          <motion.div 
            key={i} 
            whileHover={{ x: 5 }}
            className="bg-white p-5 md:p-6 rounded-[2rem] flex items-center gap-5 border border-zinc-100 shadow-sm transition-all duration-500 group"
          >
            <div className="flex-shrink-0 w-12 h-12 bg-zinc-50 rounded-xl flex items-center justify-center group-hover:bg-[#FF6600] transition-all">
              <item.icon size={20} className="text-zinc-400 group-hover:text-white transition-colors" />
            </div>
            
            <div className="flex-grow min-w-0">
              <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#FF6600] mb-0.5">{item.label}</p>
              <p className="text-sm md:text-base font-bold text-zinc-800 truncate">{item.val}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>

    {/* TIGHTER FOOTER BOTTOM */}
    <div className="mt-10 pt-6 border-t border-zinc-200/50 flex justify-between items-center text-[8px] font-bold uppercase tracking-widest text-zinc-400">
       <p>© 2026 Prashanthi Vidyalaya</p>
       <div className="flex gap-4">
          {["Insta", "YT", "WA"].map(s => <span key={s} className="hover:text-[#FF6600] cursor-pointer">{s}</span>)}
       </div>
    </div>
  </div>
</section>
    </div>
  );
}