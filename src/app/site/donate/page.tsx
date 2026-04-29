"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from "@/utils/supabase";
import {
  Building2,
  Landmark,
  Copy,
  Check,
  Heart,
  ShieldCheck,
  Smartphone,
  QrCode,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

export default function DonatePage() {
  const [bankData, setBankData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const brandColor = "#FF6600";

  useEffect(() => {
    const fetchBank = async () => {
      const { data } = await supabase.from('bank_details').select('*').single();
      if (data) setBankData(data);
    };
    fetchBank();
  }, []);

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">

        {/* HERO SECTION */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-[#FF6600] font-black text-[10px] uppercase tracking-widest mb-6"
          >
            <Heart size={14} fill={brandColor} /> Support Our Mission
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-zinc-900 mb-6">
            Small Help, <span style={{ color: brandColor }}>Big Impact.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-zinc-500 font-medium leading-relaxed">
            Your contributions directly fund our grassroots campaigns, community welfare programs, and the fight for a better future. Every rupee counts toward a stronger voice for our people.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* LEFT SIDE: WHY DONATE & TRUST */}
          <div className="space-y-8">
            <div className="p-8 rounded-[2.5rem] bg-zinc-50 border border-zinc-100 shadow-sm">
              <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
                <Info size={20} style={{ color: brandColor }} /> How your money helps:
              </h3>
              <div className="space-y-6">
                {[
                  { title: "Community Education", desc: "Providing study materials for underprivileged children." },
                  { title: "Local Campaigns", desc: "Organizing awareness drives and community meetings." },
                  { title: "Emergency Relief", desc: "Quick support for families during local crises." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center bg-white border border-zinc-200 shadow-sm">
                      <Check size={18} style={{ color: brandColor }} />
                    </div>
                    <div>
                      <h4 className="font-black text-sm uppercase">{item.title}</h4>
                      <p className="text-zinc-500 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 p-6 bg-zinc-900 rounded-3xl border border-zinc-800 shadow-xl">
              <ShieldCheck className="text-white" size={32} />
              <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest leading-tight">
                100% Transparency: All donations are strictly used for <span className="text-white">community welfare</span> and organizational growth.
              </p>
            </div>
          </div>

          {/* RIGHT SIDE: INTERACTIVE DONATION CARD */}
          <div className="sticky top-32">
            <div className="bg-zinc-950 rounded-[3rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden">

              {/* Background Decoration */}
              <div className="absolute top-0 right-0 p-10 opacity-5">
                <Landmark size={200} />
              </div>

              <div className="relative z-10">
                {/* Card Header */}
                <div className="flex justify-between items-start mb-10">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-zinc-500">
                      <Smartphone size={14} />
                      <span className="text-[9px] font-black uppercase tracking-[0.2em]">Payment Gateway</span>
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter">Official Portal</h2>
                  </div>

                  {bankData?.qr_code_url && (
                    <button
                      onClick={() => setShowQR(!showQR)}
                      className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-[#FF6600] transition-all group"
                      title="Toggle QR Scanner"
                    >
                      <QrCode size={20} className="group-hover:scale-110 transition-transform" />
                    </button>
                  )}
                </div>

                <AnimatePresence mode="wait">
                  {showQR && bankData?.qr_code_url ? (
                    /* QR SCANNER VIEW */
                    <motion.div
                      key="qr"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex flex-col items-center py-4"
                    >
                      <div className="bg-white p-4 rounded-[2.5rem] shadow-2xl shadow-orange-500/20 mb-6">
                        <img
                          src={bankData.qr_code_url}
                          alt="Donation QR Code"
                          className="w-56 h-56 object-contain"
                        />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 animate-pulse">
                        Scan with any UPI App
                      </p>
                      <button
                        onClick={() => setShowQR(false)}
                        className="mt-6 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
                      >
                        ← Back to Bank Details
                      </button>
                    </motion.div>
                  ) : (
                    /* BANK DETAILS VIEW */
                    <motion.div
                      key="details"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <div>
                        <label className="text-[9px] font-black uppercase text-zinc-600 tracking-[0.2em]">Bank Institution</label>
                        <div className="flex items-center gap-3 mt-1">
                          <Building2 size={18} style={{ color: brandColor }} />
                          <p className="text-xl font-black tracking-tighter">{bankData?.bank_name || 'Loading...'}</p>
                        </div>
                      </div>

                      <div className="group cursor-pointer" onClick={() => copyToClipboard(bankData?.account_number)}>
                        <label className="text-[9px] font-black uppercase text-zinc-600 tracking-[0.2em] flex items-center gap-2">
                          Account Number <Copy size={10} className="group-hover:text-white transition-colors" />
                        </label>
                        <p className="text-3xl font-mono tracking-widest group-hover:text-[#FF6600] transition-colors mt-1">
                          {bankData?.account_number || '0000 0000 0000'}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/5">
                        <div>
                          <label className="text-[9px] font-black uppercase text-zinc-600 tracking-[0.2em]">IFSC Code</label>
                          <p className="text-lg font-black mt-1 uppercase">{bankData?.ifsc_code || '---'}</p>
                        </div>
                        <div>
                          <label className="text-[9px] font-black uppercase text-zinc-600 tracking-[0.2em]">UPI ID</label>
                          <p className="text-lg font-black mt-1" style={{ color: brandColor }}>{bankData?.upi_id || "Not Linked"}</p>
                        </div>
                      </div>

                      <div>
                        <label className="text-[9px] font-black uppercase text-zinc-600 tracking-[0.2em]">Verified Account Holder</label>
                        <p className="text-xs font-bold uppercase text-zinc-400 mt-1">{bankData?.account_holder || '---'}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ACTION BUTTON */}
            <button
              onClick={() => copyToClipboard(bankData?.account_number)}
              disabled={!bankData}
              className="w-full mt-8 py-6 rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] transition-all flex items-center justify-center gap-4 shadow-2xl active:scale-[0.98]"
              style={{
                backgroundColor: copied ? '#22C55E' : brandColor,
                color: '#fff'
              }}
            >
              {copied ? (
                <><Check size={18} /> Details Copied</>
              ) : (
                <><Copy size={18} /> Copy & Pay Now</>
              )}
            </button>

            <p className="text-center mt-6 text-[9px] font-black uppercase text-zinc-400 tracking-widest">
              Need Help? <span className="text-zinc-900 cursor-pointer hover:underline">Contact Support</span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}