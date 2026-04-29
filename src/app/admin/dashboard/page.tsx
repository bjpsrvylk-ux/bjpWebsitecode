"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/utils/supabase";
import { 
  LayoutDashboard, Info, AppWindow, Camera, ImageIcon, 
  MapPin, UserCheck, Newspaper, Megaphone, Users, 
  HeartHandshake, ShieldCheck, ArrowUpRight, Activity
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    members: 0,
    wards: 0,
    news: 0,
    leaders: 0,
    campaigns: 0
  });

  useEffect(() => {
    async function fetchStats() {
      const [members, wards, news, leaders, campaigns] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("wards").select("*", { count: "exact", head: true }),
        supabase.from("news").select("*", { count: "exact", head: true }),
        supabase.from("leaders").select("*", { count: "exact", head: true }),
        supabase.from("campaigns").select("*", { count: "exact", head: true }),
      ]);

      setStats({
        members: members.count || 0,
        wards: wards.count || 0,
        news: news.count || 0,
        leaders: leaders.count || 0,
        campaigns: campaigns.count || 0,
      });
    }
    fetchStats();
  }, []);

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/admin/dashboard' },
    { name: 'Wards', icon: <MapPin size={18} />, path: '/admin/wards', count: stats.wards },
    { name: 'Leaders', icon: <UserCheck size={18} />, path: '/admin/leaders', count: stats.leaders },
    { name: 'News', icon: <Newspaper size={18} />, path: '/admin/news', count: stats.news },
    { name: 'Members', icon: <Users size={18} />, path: '/admin/members', count: stats.members },
    { name: 'Campaigns', icon: <Megaphone size={18} />, path: '/admin/campaigns', count: stats.campaigns },
    { name: 'Donations', icon: <HeartHandshake size={18} />, path: '/admin/donations' },
    { name: 'Banner', icon: <AppWindow size={18} />, path: '/admin/home-banner' },
    { name: 'Gallery', icon: <ImageIcon size={18} />, path: '/admin/gallery' },
    { name: 'Instagram', icon: <Camera size={18} />, path: '/admin/instagram' },
    { name: 'About Us', icon: <Info size={18} />, path: '/admin/about-us' },
  ];

  return (
    <div className="bg-white text-black p-4 md:p-8 lg:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* --- COMPACT HEADER --- */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-8 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tighter leading-none">Command Center</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">SKJV Admin Suite</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-widest">System Active</span>
          </div>
        </header>

        {/* --- COMPACT STATS TILES --- */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <CompactStat label="Total Leaders" value={stats.leaders} color="text-blue-600" />
          <CompactStat label="Active Campaigns" value={stats.campaigns} color="text-emerald-600" />
          <CompactStat label="Verified Members" value={stats.members} color="text-black" />
          <CompactStat label="Total Wards" value={stats.wards} color="text-orange-600" />
        </section>

        {/* --- QUICK ACTIONS GRID (Smaller & Tighter) --- */}
        <div className="space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Quick Management</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {menuItems.map((item) => (
              <Link key={item.name} href={item.path}>
                <motion.div 
                  whileHover={{ y: -2 }}
                  className="group relative p-4 bg-white border border-slate-100 rounded-2xl hover:border-black hover:shadow-xl hover:shadow-slate-100 transition-all cursor-pointer flex flex-col items-center text-center"
                >
                  <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-black group-hover:text-white transition-all mb-3">
                    {item.icon}
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-tight text-black">{item.name}</p>
                    {item.count !== undefined && (
                      <div className="text-[8px] font-black text-white bg-black/10 text-black px-1.5 py-0.5 rounded uppercase">
                        {item.count} qty
                      </div>
                    )}
                  </div>

                  <ArrowUpRight className="absolute top-3 right-3 text-slate-200 group-hover:text-black" size={12} />
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        {/* --- TIGHT FOOTER ACTION --- */}
        <div className="mt-12 p-6 bg-black rounded-3xl text-white flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-xl"><Activity size={18}/></div>
              <div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Network Analytics</p>
                <p className="text-xs font-medium">All data nodes are syncing with Supabase Realtime.</p>
              </div>
           </div>
           <button className="hidden sm:block px-6 py-3 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all">
             Audit Logs
           </button>
        </div>

      </div>
    </div>
  );
}

// Sub-components for tight layout
function CompactStat({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm">
      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
      <h3 className={`text-2xl font-black tracking-tighter ${color}`}>{value.toLocaleString()}</h3>
    </div>
  );
}