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
      {/* Change 1: Added h-[60vh] for mobile, md:h-screen for desktop */}
      <section className="relative h-[60vh] md:h-screen w-full overflow-hidden">
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

            {/* Change 2: Adjusted text sizes for smaller mobile height */}
            <h1 className="mb-4 text-4xl font-black uppercase tracking-tighter text-white md:text-8xl lg:text-9xl leading-none md:mb-6">
              Modern <span className="text-orange-500">Governance</span>
            </h1>

            <p className="mx-auto mb-6 max-w-2xl text-base font-medium text-slate-200 md:mb-10 md:text-xl">
              Driving progress through transparent policies and citizen-centric development.
            </p>

            {/* Change 3: Compact buttons for mobile */}
            {/* Container changed to flex-row by default, justifying center */}
            <div className="flex flex-row items-center justify-center gap-2 sm:gap-4">

              {/* Link width changed to w-auto to prevent stretching */}
              <Link href="/site/Campaigns" className="w-auto">
                <button className="whitespace-nowrap rounded-xl bg-white px-4 py-3 text-[10px] font-black uppercase tracking-wider text-black transition-all hover:bg-orange-500 hover:text-white md:rounded-2xl md:px-10 md:py-5 md:text-sm md:tracking-widest">
                  Explore
                </button>
              </Link>

              <Link href="/site/about" className="w-auto">
                <button className="whitespace-nowrap rounded-xl bg-black/20 px-4 py-3 text-[10px] font-black uppercase tracking-wider text-white backdrop-blur-xl transition-all hover:bg-white/10 border border-white/20 md:rounded-2xl md:px-10 md:py-5 md:text-sm md:tracking-widest">
                  About Us
                </button>
              </Link>

            </div>
          </motion.div>

          {/* Scroll Indicator - Hidden on mobile to save space */}
          <div className="absolute bottom-6 animate-bounce hidden md:block">
            <ChevronDown className="text-white opacity-50" size={32} />
          </div>
        </div>
      </section>

      {/* --- POLICY & GOVERNANCE SECTION --- */}
      <section className="relative z-20 -mt-10 px-4 pb-12 md:-mt-20 md:px-6 md:pb-20">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 md:grid-cols-2 lg:grid-cols-4 md:gap-6">

          {/* CARD 1: CONSTITUTION */}
          <PolicyCard
            number="01"
            title="Constitution"
            desc="The foundational rules governing our movement and integrity."
            link="/policies/constitution"
            accentColor="bg-[#FF6600]"
          />

          {/* CARD 2: ETHICS CODE */}
          <PolicyCard
            number="02"
            title="Code of Ethics"
            desc="Strict guidelines for representatives and public service."
            link="/policies/ethics"
            accentColor="bg-[#00a958]"
          />

          {/* CARD 3: CITIZEN CHARTER */}
          <PolicyCard
            number="03"
            title="Citizen Charter"
            desc="Our commitment to time-bound delivery and accountability."
            link="/policies/charter"
            accentColor="bg-[#FF6600]"
          />

          {/* CARD 4: DATA PRIVACY */}
          <PolicyCard
            number="04"
            title="Digital Policy"
            desc="Frameworks for secure digital infrastructure and data."
            link="/policies/digital"
            accentColor="bg-[#00a958]"
          />

        </div>
      </section>

      {/* --- CORE VALUES (REFINED DESIGN) --- */}
      <section className="py-12 md:py-24 px-6 bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-10 md:gap-16 items-start">

            {/* Header Side - Removed sticky on mobile for better flow */}
            <div className="lg:col-span-5 lg:sticky lg:top-32">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-center lg:text-left" // Centered on mobile
              >
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#00a958] mb-4 md:mb-6 inline-block bg-[#00a958]/10 px-4 py-1 rounded-full">
                  Our DNA
                </span>
                <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.95] mb-6 md:mb-8 text-slate-900">
                  Principles <br className="hidden md:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6600] to-orange-400">
                    Redefining
                  </span> <br />
                  Progress.
                </h3>
                <p className="text-slate-500 text-base md:text-lg leading-relaxed max-w-md font-medium mx-auto lg:mx-0">
                  Our foundation is built on an unwavering commitment to the people. We don't just set goals; we set standards.
                </p>

                <div className="mt-8 md:mt-10 flex items-center justify-center lg:justify-start gap-4">
                  <div className="h-px w-12 bg-slate-200"></div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Values & Mission</span>
                </div>
              </motion.div>
            </div>

            {/* Interactive Value Cards */}
            <div className="lg:col-span-7 flex flex-col gap-4 md:gap-6">
              {[
                {
                  title: "Nationalism",
                  desc: "Upholding the sovereignty and cultural integrity of our nation.",
                  icon: ShieldCheck,
                  color: "group-hover:text-[#FF6600]",
                  glow: "hover:shadow-[#FF6600]/10",
                  border: "hover:border-[#FF6600]/30"
                },
                {
                  title: "Development",
                  desc: "Focusing on expansion, infrastructure, and future-ready jobs.",
                  icon: TrendingUp,
                  color: "group-hover:text-[#00a958]",
                  glow: "hover:shadow-[#00a958]/10",
                  border: "hover:border-[#00a958]/30"
                },
                {
                  title: "Governance",
                  desc: "Radical transparency and digital-first citizen administration.",
                  icon: Landmark,
                  color: "group-hover:text-slate-900",
                  glow: "hover:shadow-slate-900/10",
                  border: "hover:border-slate-900/30"
                }
              ].map((val, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  // ADJUSTED: Changed p-12 to p-6 for mobile, md:p-12 for desktop
                  className={`group relative p-6 md:p-12 bg-white rounded-3xl md:rounded-[3rem] border border-slate-100 transition-all duration-500 flex flex-row items-center md:items-center gap-5 md:gap-10 cursor-default shadow-sm ${val.glow} ${val.border} hover:shadow-2xl hover:-translate-y-1`}
                >
                  {/* Icon Wrapper - Scaled down for mobile */}
                  <div className="relative z-10 w-14 h-14 md:w-20 md:h-20 shrink-0 bg-slate-50 rounded-2xl md:rounded-3xl flex items-center justify-center transition-all duration-500 group-hover:bg-white group-hover:rotate-6 group-hover:shadow-xl">
                    <val.icon className={`w-6 h-6 md:w-10 md:h-10 text-slate-400 transition-colors duration-500 ${val.color}`} />
                  </div>

                  <div className="relative z-10">
                    <h4 className="text-lg md:text-2xl font-black uppercase tracking-tight mb-1 md:mb-3 text-slate-900">
                      {val.title}
                    </h4>
                    <p className="text-slate-500 text-xs md:text-base leading-snug md:leading-relaxed font-medium">
                      {val.desc}
                    </p>
                  </div>

                  {/* Hover Arrow - Hidden on mobile to keep clean lines */}
                  <div className="ml-auto hidden md:flex items-center justify-center w-12 h-12 rounded-full border border-slate-100 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-4 group-hover:translate-x-0">
                    <ArrowUpRight className="text-slate-300 group-hover:text-slate-900" />
                  </div>

                  {/* Background Numbering - Scaled for mobile */}
                  <span className="absolute right-6 top-6 text-4xl md:text-8xl md:right-10 md:top-10 font-black text-slate-50 opacity-[0.05] select-none pointer-events-none group-hover:opacity-[0.1] transition-opacity">
                    0{i + 1}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================== BANNERS (Premium Orange Theme) ================== */}
      <section className="relative w-full bg-[#FF6600] py-10 px-4 md:py-20 md:px-16 overflow-hidden">

        {/* 1. BACKGROUND TEXT - Scaled down for mobile */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-10">
          <AnimatePresence mode="wait">
            <motion.h1
              key={active}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              className="text-[25vw] md:text-[18vw] font-black uppercase whitespace-nowrap leading-none -ml-5 md:-ml-10 mt-5 md:mt-10 text-transparent"
              style={{ WebkitTextStroke: '1px rgba(0,0,0,0.15)' }}
            >
              {fallbackData[active].title.split(' ')[0]}
            </motion.h1>
          </AnimatePresence>
        </div>

        <div className="max-w-[1400px] mx-auto relative z-10">
          {/* Flex-col-reverse on mobile puts the image/video above the text for better visual impact */}
          <div className="flex flex-col-reverse lg:flex-row items-stretch gap-8 md:gap-16">

            {/* LEFT: CONTENT */}
            <div className="w-full lg:w-1/3 flex flex-col justify-between py-2">
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-black flex items-center justify-center shadow-lg">
                    <Plus size={12} className="text-[#FF6600]" />
                  </div>
                  <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] text-black">
                    Featured Project
                  </span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85] mb-3 md:mb-5 text-black">
                      {fallbackData[active].title}
                    </h2>
                    <p className="text-black/80 text-sm md:text-base font-medium leading-relaxed max-w-sm mb-6 md:mb-10">
                      {fallbackData[active].desc}
                    </p>


                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation Controls - Centered on mobile */}
              <div className="flex items-center justify-between md:justify-start gap-6 mt-10 md:mt-16">
                <div className="flex bg-black/10 p-1 rounded-full border border-black/5 backdrop-blur-md">
                  <button onClick={prev} className="p-3 text-black hover:bg-black hover:text-[#FF6600] rounded-full transition-all">
                    <MoveLeft size={20} />
                  </button>
                  <button onClick={next} className="p-3 text-black hover:bg-black hover:text-[#FF6600] rounded-full transition-all">
                    <MoveRight size={20} />
                  </button>
                </div>
                <div className="text-[12px] font-mono font-black text-black/30">
                  0{active + 1} / 0{banners.length}
                </div>
              </div>
            </div>

            {/* RIGHT: THE MEDIA */}
            <div className="w-full lg:w-2/3 relative group">
              <div className="relative h-[300px] md:h-[500px] lg:h-full rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl border-2 border-black/5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, filter: "grayscale(100%)" }}
                    animate={{ opacity: 1, filter: "grayscale(0%)" }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
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

                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-black/10">
                  <motion.div
                    className="h-full bg-white"
                    initial={{ width: "0%" }}
                    animate={{ width: `${((active + 1) / banners.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Floating Tag - Smaller for mobile */}
              <div className="absolute -top-2 -left-2 md:-top-3 md:-left-3 bg-white text-black px-3 py-1.5 md:px-5 md:py-2.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-tighter shadow-xl rotate-[-5deg] border border-black/5">
                Live Preview
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ================== INSTAGRAM ================== */}
      {/* ================== INSTAGRAM ================== */}
      {/* ================== INSTAGRAM (Horizontal Scroll Mobile) ================== */}
      <section className="py-12 md:py-24 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">

          {/* Header Section */}
          <div className="flex items-center justify-between mb-8 md:mb-12">
            <div>
              <span className="text-[#FF6600] text-[10px] md:text-xs font-black uppercase tracking-[0.4em] mb-2 block">
                Social Feed
              </span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-900 leading-none">
                Instagram <span className="text-[#FF6600] italic">Reels</span>
              </h2>
            </div>

            <a
              href="https://instagram.com"
              target="_blank"
              className="text-[10px] md:text-xs font-bold uppercase tracking-widest border-b-2 border-[#FF6600] pb-1 hover:text-[#FF6600] transition-colors"
            >
              Follow Us
            </a>
          </div>

          {/* Scroll Container */}
          {/* md:grid-cols-4 for desktop, flex-row with overflow-x-auto for mobile */}
          <div className="flex flex-row overflow-x-auto pb-8 gap-6 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-4 md:overflow-visible">
            {reels.map((reel) => {
              const baseUrl = reel.url.split('?')[0];
              const embedUrl = `${baseUrl}${baseUrl.endsWith('/') ? '' : '/'}embed/`;

              return (
                <div
                  key={reel.id}
                  className="group relative min-w-[280px] sm:min-w-[320px] md:min-w-full snap-center"
                >
                  <div className="relative aspect-[9/16] w-full rounded-[2rem] overflow-hidden bg-slate-100 shadow-lg transition-all duration-500 md:hover:-translate-y-2 md:hover:shadow-2xl border border-slate-200">
                    <iframe
                      src={embedUrl}
                      className="w-full h-full"
                      frameBorder="0"
                      scrolling="no"
                      allowTransparency={true}
                      allow="encrypted-media"
                    ></iframe>

                    {/* Interaction Overlay - Hidden on touch devices to allow scrolling, visible on hover for desktop */}
                    <a
                      href={reel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 bg-black/20 opacity-0 md:group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]"
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