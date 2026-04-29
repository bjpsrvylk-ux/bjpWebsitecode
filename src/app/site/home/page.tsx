"use client";

import React, { useState, useEffect } from "react"; // ✅ FIXED
import Link from "next/link";
import {
  ArrowUpRight, TrendingUp, Landmark,
  ArrowRight, ShieldCheck, ChevronDown, ArrowLeft, ChevronLeft, ChevronRight, Volume2, Plus, MoveLeft, MoveRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/utils/supabase"; // ✅ FIXED (adjust path if needed)

export default function HomePage() {

  // ✅ STATE
  const [banners, setBanners] = useState<any[]>([]);
  const [reels, setReels] = useState<any[]>([]);

  // ✅ FETCH BANNERS
  useEffect(() => {
    const fetchBanners = async () => {
      const { data } = await supabase
        .from("home_sliders")
        .select("*")
        .eq("active_status", true)
        .order("display_order", { ascending: true });

      if (data) setBanners(data);
    };

    fetchBanners();
  }, []);

  // ✅ FETCH REELS
  useEffect(() => {
    const fetchReels = async () => {
      const { data } = await supabase
        .from("instagram_feeds")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) setReels(data);
    };

    fetchReels();
  }, []);

  const [active, setActive] = useState(0);

  const fallbackData = [
    { title: "Empowering Communities", desc: "Driving inclusive development through grassroots initiatives and local support." },
    { title: "Digital India Growth", desc: "Building a foundation of technology for long-term national progress." },
    { title: "Future Infrastructure", desc: "Investing in sustainable and strong infrastructure for the next generation." },
    { title: "Citizen First Policies", desc: "Prioritizing transparency and accountability in every decision we make." },
    { title: "Smart Governance", desc: "Leveraging innovation to streamline governance and serve you better." }
  ];
  const next = () => setActive((prev) => (prev + 1) % banners.length);
  const prev = () => setActive((prev) => (prev - 1 + banners.length) % banners.length);
  if (!banners.length) return null;

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* --- HERO VIDEO SECTION --- */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/bannervideo.mp4" type="video/mp4" />
        </video>

        {/* Dark Overlay for Readability */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

        {/* Content Overlay */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <span className="mb-4 inline-block rounded-full bg-orange-500 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-white">
              Building a Stronger Nation
            </span>
            <h1 className="mb-6 text-5xl font-black uppercase tracking-tighter text-white md:text-8xl lg:text-9xl leading-none">
              Modern <span className="text-orange-500">Governance</span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg font-medium text-slate-200 md:text-xl">
              Driving progress through transparent policies, digital infrastructure,
              and citizen-centric development for a better tomorrow.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/site/Campaigns" className="w-full sm:w-auto">
                <button className="w-full rounded-2xl bg-white px-10 py-5 text-sm font-black uppercase tracking-widest text-black transition-all hover:bg-orange-500 hover:text-white sm:w-auto">
                  Explore Campaigns
                </button>
              </Link>

              <Link href="/site/about" className="w-full sm:w-auto">
                <button className="w-full rounded-2xl bg-black/20 px-10 py-5 text-sm font-black uppercase tracking-widest text-white backdrop-blur-xl transition-all hover:bg-white/10 sm:w-auto border border-white/20">
                  About US
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-10 animate-bounce">
            <ChevronDown className="text-white opacity-50" size={32} />
          </div>
        </div>
      </section>

      {/* --- QUICK ACTION SECTION (About, Help, Donations) --- */}
      {/* --- POLICY & GOVERNANCE SECTION --- */}
      <section className="relative z-20 -mt-20 px-6 pb-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">

          {/* CARD 1: CONSTITUTION */}
          <PolicyCard
            number="01"
            title="Core Constitution"
            desc="The foundational rules governing our movement, ensuring democratic integrity and internal transparency."
            link="/policies/constitution"
            accentColor="bg-[#FF6600]" // Brand Green (Orange)
          />

          {/* CARD 2: ETHICS CODE */}
          <PolicyCard
            number="02"
            title="Code of Ethics"
            desc="Strict guidelines for representatives and members to maintain the highest standards of public service."
            link="/policies/ethics"
            accentColor="bg-[#00a958]" // Brand Yellow (Green)
          />

          {/* CARD 3: CITIZEN CHARTER */}
          <PolicyCard
            number="03"
            title="Citizen Charter"
            desc="Our commitment to time-bound delivery of services and accountability to every individual we serve."
            link="/policies/charter"
            accentColor="bg-[#FF6600]"
          />

          {/* CARD 4: DATA PRIVACY */}
          <PolicyCard
            number="04"
            title="Digital Policy"
            desc="Frameworks for secure digital infrastructure and protecting citizen data in the modern age."
            link="/policies/digital"
            accentColor="bg-[#00a958]"
          />

        </div>
      </section>

      {/* --- 2. CORE VALUES (STRUCTURAL DESIGN) --- */}
      {/* --- CORE VALUES (REFINED DESIGN) --- */}
      <section className="py-4   px-6 bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-16 items-start">

            {/* Sticky Header Side */}
            <div className="lg:col-span-5 sticky top-32">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#00a958] mb-6 inline-block bg-[#00a958]/10 px-4 py-1 rounded-full">
                  Our DNA
                </span>
                <h3 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9] mb-8 text-slate-900">
                  Principles <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6600] to-orange-400">
                    Redefining
                  </span> <br />
                  Progress.
                </h3>
                <p className="text-slate-500 text-lg leading-relaxed max-w-md font-medium">
                  Our foundation is built on an unwavering commitment to the people. We don't just set goals; we set standards.
                </p>

                <div className="mt-10 flex items-center gap-4">
                  <div className="h-px w-12 bg-slate-200"></div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Scroll to Explore</span>
                </div>
              </motion.div>
            </div>

            {/* Interactive Value Cards */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {[
                {
                  title: "Nationalism",
                  desc: "Upholding the sovereignty, unity, and cultural integrity of our nation at every level of policy.",
                  icon: ShieldCheck,
                  color: "group-hover:text-[#FF6600]",
                  glow: "hover:shadow-[#FF6600]/10",
                  border: "hover:border-[#FF6600]/30"
                },
                {
                  title: "Development",
                  desc: "Hyper-focused on economic expansion, sustainable infrastructure, and future-ready job creation.",
                  icon: TrendingUp,
                  color: "group-hover:text-[#00a958]",
                  glow: "hover:shadow-[#00a958]/10",
                  border: "hover:border-[#00a958]/30"
                },
                {
                  title: "Governance",
                  desc: "A commitment to radical transparency and digital-first administration that puts citizens first.",
                  icon: Landmark,
                  color: "group-hover:text-slate-900",
                  glow: "hover:shadow-slate-900/10",
                  border: "hover:border-slate-900/30"
                }
              ].map((val, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className={`group relative p-12 bg-white rounded-[3rem] border border-slate-100 transition-all duration-500 flex flex-col md:flex-row md:items-center gap-10 cursor-default shadow-sm ${val.glow} ${val.border} hover:shadow-2xl hover:-translate-y-1`}
                >
                  {/* Icon Wrapper with Glass effect */}
                  <div className="relative z-10 w-20 h-20 shrink-0 bg-slate-50 rounded-3xl flex items-center justify-center transition-all duration-500 group-hover:bg-white group-hover:rotate-6 group-hover:shadow-xl">
                    <val.icon size={40} className={`text-slate-400 transition-colors duration-500 ${val.color}`} />
                  </div>

                  <div className="relative z-10">
                    <h4 className="text-2xl font-black uppercase tracking-tight mb-3 text-slate-900">
                      {val.title}
                    </h4>
                    <p className="text-slate-500 text-base leading-relaxed font-medium">
                      {val.desc}
                    </p>
                  </div>

                  {/* Hover Arrow */}
                  <div className="ml-auto flex items-center justify-center w-12 h-12 rounded-full border border-slate-100 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-4 group-hover:translate-x-0">
                    <ArrowUpRight className="text-slate-300 group-hover:text-slate-900" />
                  </div>

                  {/* Background Subtle Numbering */}
                  <span className="absolute right-10 top-10 text-8xl font-black text-slate-50 opacity-[0.03] select-none pointer-events-none group-hover:opacity-[0.07] transition-opacity">
                    0{i + 1}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================== BANNERS (Premium Orange Theme) ================== */}
      <section className="relative w-full bg-[#FF6600] py-12 px-6 lg:px-16 overflow-hidden">

        {/* 1. COMPACT BACKGROUND TEXT (Black Stroke for subtle depth) */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-10">
          <AnimatePresence mode="wait">
            <motion.h1
              key={active}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="text-[18vw] font-black uppercase whitespace-nowrap leading-none -ml-10 mt-10 text-transparent"
              style={{ WebkitTextStroke: '1px rgba(0,0,0,0.2)' }}
            >
              {fallbackData[active].title.split(' ')[0]}
            </motion.h1>
          </AnimatePresence>
        </div>

        <div className="max-w-[1400px] mx-auto relative z-10">

          <div className="flex flex-col lg:flex-row items-stretch gap-10 min-h-[500px]">

            {/* LEFT: CONTENT (High Contrast Ebony Text) */}
            <div className="w-full lg:w-1/3 flex flex-col justify-between py-4">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  {/* Swapping background to Black for the icon */}
                  <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center shadow-lg">
                    <Plus size={14} className="text-[#FF6600]" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-black">
                    Featured Project
                  </span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* Using Black for the Title makes it look expensive */}
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.85] mb-4 text-black">
                      {fallbackData[active].title}
                    </h2>
                    {/* Using 70% black for description for better hierarchy */}
                    <p className="text-black/70 text-sm font-medium leading-relaxed max-w-xs mb-8">
                      {fallbackData[active].desc}
                    </p>

                    <button className="px-8 py-3 bg-black text-white hover:bg-white hover:text-black transition-all text-[10px] font-bold uppercase tracking-widest rounded-full shadow-xl">
                      View Case Study
                    </button>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Compact Nav Controls (Refined for Dark-on-Orange) */}
              <div className="flex items-center gap-6 pt-10">
                <div className="flex bg-black/10 p-1 rounded-full border border-black/10 backdrop-blur-md">
                  <button onClick={prev} className="p-3 text-black hover:bg-black hover:text-[#FF6600] rounded-full transition-all">
                    <MoveLeft size={18} />
                  </button>
                  <button onClick={next} className="p-3 text-black hover:bg-black hover:text-[#FF6600] rounded-full transition-all">
                    <MoveRight size={18} />
                  </button>
                </div>
                <div className="text-[11px] font-mono font-bold text-black/40">
                  0{active + 1} // 0{banners.length}
                </div>
              </div>
            </div>

            {/* RIGHT: THE MEDIA (With Darker Shadow) */}
            <div className="w-full lg:w-2/3 relative group">
              <div className="relative h-[350px] lg:h-full rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border-4 border-black/5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
                    className="w-full h-full"
                  >
                    {banners[active].file_type === "video" ? (
                      <video
                        src={banners[active].file_url}
                        autoPlay muted loop playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={banners[active].file_url}
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Progress Bar (Using White for contrast against Media) */}
                <div className="absolute bottom-0 left-0 w-full h-1.5 bg-black/20">
                  <motion.div
                    className="h-full bg-white"
                    initial={{ width: "0%" }}
                    animate={{ width: `${((active + 1) / banners.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Floating Tag (Vibe addition) */}
              <div className="absolute -top-3 -left-3 bg-white text-black px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-lg rotate-[-5deg]">
                Live Preview
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ================== INSTAGRAM ================== */}
     {/* ================== INSTAGRAM ================== */}
<section className="py-24 px-6 bg-white">
  <div className="max-w-7xl mx-auto">
    <div className="flex items-end justify-between mb-12">
      <div>
        <span className="text-[#FF6600] text-xs font-black uppercase tracking-[0.4em] mb-2 block">
          Social Feed
        </span>
        <h2 className="text-5xl font-black tracking-tighter text-slate-900 leading-none">
          Instagram <span className="text-[#FF6600] italic">Reels</span>
        </h2>
      </div>
      <a 
        href="https://instagram.com" 
        target="_blank" 
        className="hidden md:block text-xs font-bold uppercase tracking-widest border-b-2 border-[#FF6600] pb-1 hover:text-[#FF6600] transition-colors"
      >
        Follow Us
      </a>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {reels.map((reel) => {
        // CLEANUP LOGIC: Ensures the URL ends with /embed/
        const baseUrl = reel.url.split('?')[0]; // Remove query params
        const embedUrl = `${baseUrl}${baseUrl.endsWith('/') ? '' : '/'}embed/`;

        return (
          <div key={reel.id} className="group relative">
            <div className="relative aspect-[9/16] w-full rounded-[2rem] overflow-hidden bg-slate-100 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl border border-slate-200">
              <iframe
                src={embedUrl}
                className="w-full h-full"
                frameBorder="0"
                scrolling="no"
                allowTransparency={true}
                allow="encrypted-media"
              ></iframe>

              {/* Interaction Overlay */}
              <a 
                href={reel.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]"
              >
                <div className="bg-white text-black px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl">
                  View on Instagram
                </div>
              </a>
            </div>
          </div>
        );
      })}
    </div>
  </div>
</section>

    </div>
  );
}



function ActionCard({ title, desc, icon, link, bg, isDark = false }: any) {
  return (
    <Link href={link}>
      <motion.div
        whileHover={{ y: -10 }}
        className={`${bg} group p-10 rounded-[3rem] shadow-2xl shadow-slate-200/50 flex flex-col justify-between h-[320px] transition-all cursor-pointer border border-slate-100`}
      >
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isDark ? 'bg-white/10 text-white' : 'bg-black text-white'}`}>
          {icon}
        </div>
        <div>
          <h3 className={`text-3xl font-black uppercase tracking-tighter mb-4 ${isDark ? 'text-white' : 'text-black'}`}>
            {title}
          </h3>
          <p className={`text-sm font-medium leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {desc}
          </p>
        </div>
        <div className={`mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-orange-500' : 'text-black'}`}>
          Explore More <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
        </div>
      </motion.div>
    </Link>
  );
}

function PolicyCard({ number, title, desc, link, accentColor }: any) {
  return (
    <Link href={link}>
      <motion.div
        whileHover={{ y: -10 }}
        /* Removed flex flex-col justify-between */
        className="group relative h-[320px] overflow-hidden rounded-[2.5rem] bg-white p-10 shadow-2xl shadow-slate-200/50 transition-all border border-slate-100"
      >
        {/* Animated Background Accent */}
        <div className={`absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-10 transition-all group-hover:scale-[5] ${accentColor}`} />

        <div className="relative z-10">
          <span className={`inline-block text-xs font-black tracking-[0.3em] mb-4 px-3 py-1 rounded-full text-white ${accentColor}`}>
            RULE {number}
          </span>
          <h3 className="text-3xl font-black uppercase tracking-tighter leading-none text-slate-900 group-hover:text-slate-800 transition-colors">
            {title}
          </h3>

          {/* Description moved immediately below title with small top margin */}
          <p className="mt-4 text-sm font-medium leading-relaxed text-slate-500">
            {desc}
          </p>
        </div>

        {/* Action button container */}
        <div className="relative z-10 mt-8">
          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">
            Read Full Document
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-white transition-transform group-hover:translate-x-2 ${accentColor}`}>
              <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}