"use client";

import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "@/utils/supabase";
import { motion, AnimatePresence, Variants } from "framer-motion"; // Add Variants to imports
import { toast, Toaster } from "react-hot-toast";
import { 
  ArrowUpRight, Activity, Sparkles, 
  ArrowUpDown, CheckCircle2, Lock, LogOut,
  ShieldCheck, Zap, BarChart3, Target
} from "lucide-react";

// --- ANIMATION VARIANTS (Fixed) ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = { // Add the : Variants type here
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.8, 
      ease: [0.22, 1, 0.36, 1], 
      delay: i * 0.05
    } 
  })
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [joinedIds, setJoinedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAscending, setIsAscending] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const initialize = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      await fetchCampaigns();
      if (currentUser) await fetchUserMemberships(currentUser.id);
    };
    initialize();
  }, []);

  const fetchCampaigns = async () => {
    const { data, error } = await supabase
      .from("campaigns")
      .select(`id, name, description, status, start_date, current_engagement, target, banner_url`);
    if (!error) setCampaigns(data || []);
    setLoading(false);
  };

  const fetchUserMemberships = async (userId: string) => {
    const { data } = await supabase.from('campaign_members').select('campaign_id').eq('user_id', userId);
    if (data) setJoinedIds(data.map(m => m.campaign_id));
  };

const handleJoinCampaign = async () => {
  if (!user || !selectedCampaign) return;

  // 1. Define the async logic
  const joinAction = async () => {
    // We add .select() to ensure the operation returns the data for the toast to resolve
    const { data, error } = await supabase
      .from('campaign_members')
      .insert([{ campaign_id: selectedCampaign.id, user_id: user.id }])
      .select(); 
    
    if (error) throw error; 
    return data;
  };

  // 2. Execute and capture the promise
  const actionPromise = joinAction();

  // 3. Pass the promise to the toast
  toast.promise(actionPromise, {
    loading: 'Enrolling...',
    success: 'Welcome to the movement! 🎉',
    error: 'Error joining initiative.',
  });

  try {
    // 4. Await the CORRECT variable name (actionPromise)
    await actionPromise;

    // 5. Update local state on success
    setJoinedIds(prev => [...prev, selectedCampaign.id]);
    setCampaigns(prev => prev.map(c => 
      c.id === selectedCampaign.id 
        ? { ...c, current_engagement: (c.current_engagement || 0) + 1 } 
        : c
    ));
    setSelectedCampaign(null); 
  } catch (err) {
    // Log the error for debugging; the toast handles the user-facing message
    console.error("Join failed:", err);
  }
};

  const handleLeaveCampaign = async (campaignId: string, campaignName: string) => {
    if (!user) return;

    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-bold text-zinc-900">Leave <strong>{campaignName}</strong>?</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const { error } = await supabase
                .from('campaign_members')
                .delete()
                .eq('campaign_id', campaignId)
                .eq('user_id', user.id);

              if (!error) {
                setJoinedIds(prev => prev.filter(id => id !== campaignId));
                setCampaigns(prev => prev.map(c => 
                  c.id === campaignId ? { ...c, current_engagement: Math.max(0, (c.current_engagement || 0) - 1) } : c
                ));
                toast.success("Initiative left successfully", { icon: '👋' });
              }
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest"
          >
            Confirm
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-zinc-100 text-zinc-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 5000, position: 'top-center' });
  };

  const filteredCampaigns = useMemo(() => {
    let result = [...campaigns];
    if (statusFilter !== 'all') result = result.filter(c => c.status === statusFilter);
    result.sort((a, b) => {
      const dateA = new Date(a.start_date).getTime();
      const dateB = new Date(b.start_date).getTime();
      return isAscending ? dateA - dateB : dateB - dateA;
    });
    return result;
  }, [campaigns, statusFilter, isAscending]);

  return (
    <div className="bg-[#F8F9FA] min-h-screen p-4 md:p-8 space-y-12">
      <Toaster position="bottom-right" reverseOrder={false} />

      {/* --- HEADER --- */}
      <motion.header 
               initial={{ opacity: 0, y: -20 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-[#FF6600] rounded-[2.5rem] p-8 md:p-14 shadow-[0_20px_50px_rgba(255,102,0,0.3)] flex flex-col lg:flex-row justify-between items-center gap-10 relative overflow-hidden"
             >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 blur-[120px] rounded-full -mr-48 -mt-48" />
        <div className="relative z-10 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white font-bold text-[10px] uppercase tracking-[0.3em]">
            <Activity size={14} className="animate-pulse" /> System Status: Live
          </div>
         
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-[0.8]">
            Impact <br /> <span className="text-black/20">Tracker.</span>
          </h1>
          <p className="max-w-md text-white/80 text-sm md:text-base font-medium leading-tight tracking-tight">
        Quantifying global change through real-time engagement data <br className="hidden md:block" /> 
        and strategic initiative monitoring for a better tomorrow.
      </p>
        </div>
        <div className="relative z-10">
          <button 
            onClick={() => setIsAscending(!isAscending)}
            className="flex items-center gap-5 px-10 py-6 bg-black rounded-[2rem] hover:scale-[1.02] transition-all shadow-2xl group"
          >
            <ArrowUpDown size={24} className="text-[#FF6600]" />
            <div className="flex flex-col items-start leading-none text-left">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1.5">Timeline</span>
              <span className="text-sm font-black uppercase tracking-widest text-white">
                {isAscending ? "Oldest First" : "Latest First"}
              </span>
            </div>
          </button>
        </div>
      </motion.header>

      {/* --- STATUS NAVIGATION --- */}
      <div className="flex justify-center sticky top-8 z-50">
        <nav className="inline-flex items-center gap-2 p-2 bg-white/80 backdrop-blur-2xl rounded-full border border-zinc-200 shadow-xl overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Initiatives' },
            { id: 'active', label: 'On Going' },
            { id: 'upcoming', label: 'Up Coming' },
            { id: 'completed', label: 'Completed' }
          ].map((status) => (
            <button
              key={status.id}
              onClick={() => setStatusFilter(status.id)}
              className={`whitespace-nowrap px-10 py-4 text-[10px] font-black uppercase tracking-widest rounded-full transition-all duration-500 ${
                statusFilter === status.id 
                  ? 'bg-[#FF6600] text-white shadow-[0_15px_30px_rgba(255,102,0,0.3)] scale-105' 
                  : 'text-zinc-400 hover:text-black hover:bg-zinc-50'
              }`}
            >
              {status.label}
            </button>
          ))}
        </nav>
      </div>

      {/* --- CAMPAIGN GRID --- */}
      <section className="max-w-[1600px] mx-auto px-6 pb-32">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10"
        >
          <AnimatePresence mode="popLayout">
            {filteredCampaigns.map((c: any, idx: number) => {
              const isJoined = joinedIds.includes(c.id);
              const progress = c.target ? (c.current_engagement / c.target) * 100 : 0;

              return (
                <motion.div
                  layout
                  key={c.id}
                  variants={itemVariants}
                  custom={idx} // Passing index to the variant for stagger
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group relative bg-white rounded-[3rem] p-5 border border-zinc-100 hover:border-zinc-200 hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] transition-all duration-700 flex flex-col h-full"
                >
                  {/* Visual Image Section */}
                  <div className="relative h-96 rounded-[2.5rem] overflow-hidden mb-8 shadow-2xl">
                    <img 
                      src={c.banner_url || "/placeholder.jpg"} 
                      className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110 grayscale-[20%] group-hover:grayscale-0" 
                      alt={c.name} 
                    />
                    <div className="absolute top-6 left-6 flex gap-2">
                      <span className="px-5 py-2.5 bg-black/40 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-[0.3em] text-white border border-white/20">
                        {c.status}
                      </span>
                      {isJoined && (
                        <span className="px-5 py-2.5 bg-[#00a958]/80 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-[0.3em] text-white border border-white/20 flex items-center gap-2">
                          <ShieldCheck size={12} /> Active
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2rem] flex items-center justify-between overflow-hidden">
                      <div className="relative z-10">
                        <p className="text-[8px] font-black text-white/60 uppercase tracking-[0.2em] mb-1">Current Reach</p>
                        <p className="text-2xl font-black text-white leading-none">
                          {Math.round(progress)}% <span className="text-xs font-medium text-white/40 uppercase ml-2 tracking-widest">Growth</span>
                        </p>
                      </div>
                      <div className="relative z-10 w-12 h-12 rounded-full bg-[#FF6600] flex items-center justify-center text-white shadow-xl animate-pulse">
                          <Zap size={20} fill="currentColor" />
                      </div>
                      <div 
                        className="absolute bottom-0 left-0 h-1 bg-[#FF6600] transition-all duration-1000" 
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="px-4 flex flex-col flex-grow">
                    <div className="flex justify-between items-start gap-6 mb-4">
                      <h3 className="text-4xl font-black uppercase tracking-tighter leading-[0.85] text-zinc-900 group-hover:text-[#FF6600] transition-colors duration-500">
                        {c.name}
                      </h3>
                      
                    </div>

                    <p className="text-zinc-500 text-sm font-medium leading-relaxed mb-8 line-clamp-3">
                      {c.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-zinc-50 rounded-3xl p-5 border border-zinc-100 flex items-center gap-4 group/stat">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#FF6600] shadow-sm group-hover/stat:bg-[#FF6600] group-hover/stat:text-white transition-all">
                          <BarChart3 size={18} />
                        </div>
                        <div>
                          <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Impact</p>
                          <p className="text-lg font-black text-zinc-900">{c.current_engagement.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="bg-zinc-50 rounded-3xl p-5 border border-zinc-100 flex items-center gap-4 group/stat">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#00a958] shadow-sm group-hover/stat:bg-[#00a958] group-hover/stat:text-white transition-all">
                          <Target size={18} />
                        </div>
                        <div>
                          <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Goal</p>
                          <p className="text-lg font-black text-zinc-900">{c.target.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto">
                      {isJoined ? (
                        <button 
                          onClick={() => handleLeaveCampaign(c.id, c.name)}
                          className="w-full py-6 bg-zinc-50 text-zinc-400 hover:bg-red-50 hover:text-red-600 rounded-[2rem] font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 transition-all border border-zinc-100"
                        >
                          <LogOut size={16} /> Opt-out of Initiative
                        </button>
                      ) : (
                        <button 
                          onClick={() => setSelectedCampaign(c)}
                          className="w-full py-6 bg-black text-white hover:bg-[#FF6600] rounded-[2rem] font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 shadow-2xl transition-all active:scale-[0.98] group/btn"
                        >
                          <Sparkles size={16} className="group-hover/btn:rotate-12 transition-transform" /> Join the Movement
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Join Modal */}
      <AnimatePresence>
        {selectedCampaign && (
          <JoinDetailModal 
            isOpen={!!selectedCampaign}
            campaign={selectedCampaign}
            onClose={() => setSelectedCampaign(null)}
            isLoggedIn={!!user}
            onJoin={handleJoinCampaign}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function JoinDetailModal({ isOpen, onClose, campaign, onJoin, isLoggedIn }: any) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
      <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative bg-white w-full max-w-xl rounded-[3.5rem] p-12 shadow-2xl overflow-hidden">
        <div className="relative z-10 space-y-8">
          <div className="w-20 h-2 bg-[#FF6600] rounded-full" />
          <div className="space-y-4">
            <h2 className="text-5xl font-black uppercase tracking-tighter text-zinc-900 leading-[0.9]">{campaign?.name}</h2>
            <p className="text-zinc-500 font-medium leading-relaxed">
              By confirming your enrollment, you become a stakeholder in this initiative. You'll receive real-time updates as we approach the target goal of {campaign?.target?.toLocaleString()} participants.
            </p>
          </div>
          
          {!isLoggedIn && (
            <div className="flex items-center gap-4 bg-amber-50 p-6 rounded-[2rem] border border-amber-100 text-amber-700 text-xs font-black uppercase tracking-widest">
              <Lock size={20} /> Authentication required to sync progress.
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              onClick={isLoggedIn ? onJoin : onClose} 
              className="flex-[2] bg-[#FF6600] text-white py-6 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-lg shadow-orange-200 active:scale-95 transition-transform"
            >
              {isLoggedIn ? "Confirm Enrollment" : "I Understand"}
            </button>
            <button 
              onClick={onClose} 
              className="flex-1 px-8 py-6 bg-zinc-100 text-zinc-500 rounded-[2rem] font-black uppercase tracking-widest text-[10px] hover:bg-zinc-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}