"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { 
  Building2, User, Hash, CheckCircle2, 
  Loader2, Save, Landmark, QrCode, Upload, X 
} from "lucide-react";

export default function DonationsAdmin() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [bankData, setBankData] = useState({
    id: null,
    bank_name: "",
    account_holder: "",
    account_number: "",
    ifsc_code: "",
    upi_id: "",
    qr_code_url: ""
  });

  useEffect(() => {
    fetchBankDetails();
  }, []);

  const fetchBankDetails = async () => {
    const { data } = await supabase.from('bank_details').select('*').single();
    if (data) setBankData(data);
    setLoading(false);
  };

  // --- QR CODE UPLOAD LOGIC ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = e.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `qr-code-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('donations')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('donations')
        .getPublicUrl(filePath);

      setBankData({ ...bankData, qr_code_url: publicUrl });
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateBank = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase
      .from('bank_details')
      .update(bankData)
      .eq('id', bankData.id);

    if (error) alert(error.message);
    else alert("Information & QR Scanner updated!");
    setSubmitting(false);
  };

  if (loading) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-slate-200" size={40}/></div>;

  return (
    <div className="p-8 min-h-screen bg-[#FDFDFD]">
      <div className="mb-10">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900">Donation Settings</h1>
        <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em] mt-1">Manage Bank & QR Scanner</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl p-10">
            <form onSubmit={handleUpdateBank} className="space-y-8">
              
              {/* QR UPLOAD SECTION */}
              <div className="p-8 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-4">UPI QR Scanner Image</label>
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  {bankData.qr_code_url ? (
                    <div className="relative group">
                      <img src={bankData.qr_code_url} className="w-40 h-40 object-contain bg-white rounded-2xl border shadow-lg" alt="QR" />
                      <button 
                        type="button"
                        onClick={() => setBankData({...bankData, qr_code_url: ""})}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:scale-110 transition-all"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-40 h-40 bg-white border rounded-2xl flex items-center justify-center text-slate-300">
                      <QrCode size={48} strokeWidth={1} />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 font-medium mb-4">Upload your Google Pay, PhonePe or Bank UPI QR code so donors can scan directly.</p>
                    <label className="cursor-pointer bg-white border border-slate-200 px-6 py-3 rounded-xl font-bold text-xs uppercase flex items-center gap-2 hover:bg-slate-50 transition-all w-fit">
                      {uploading ? <Loader2 className="animate-spin" size={16}/> : <Upload size={16}/>}
                      {bankData.qr_code_url ? "Change QR Code" : "Upload QR Code"}
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
                    </label>
                  </div>
                </div>
              </div>

              {/* BANK FIELDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">Bank Name</label>
                  <input className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none font-bold" value={bankData.bank_name} onChange={(e) => setBankData({...bankData, bank_name: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">Account Holder</label>
                  <input className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none font-bold" value={bankData.account_holder} onChange={(e) => setBankData({...bankData, account_holder: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">Account Number</label>
                  <input className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none font-bold" value={bankData.account_number} onChange={(e) => setBankData({...bankData, account_number: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">IFSC Code</label>
                  <input className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none font-bold" value={bankData.ifsc_code} onChange={(e) => setBankData({...bankData, ifsc_code: e.target.value})} />
                </div>
              </div>

              <button disabled={submitting || uploading} className="w-full bg-black text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-brand-green transition-all shadow-xl">
                {submitting ? <Loader2 className="animate-spin" /> : <><Save size={16}/> Save Everything</>}
              </button>
            </form>
          </div>
        </div>

        {/* PREVIEW */}
        <div className="lg:col-span-1">
          <div className="bg-zinc-950 rounded-[2.5rem] p-8 text-white shadow-2xl sticky top-8">
            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-6">User Preview</p>
            
            {bankData.qr_code_url ? (
               <div className="bg-white p-4 rounded-3xl mb-6">
                 <img src={bankData.qr_code_url} className="w-full aspect-square object-contain" alt="Preview QR" />
                 <p className="text-black text-center text-[10px] font-black mt-2 uppercase">Scan to Donate</p>
               </div>
            ) : (
              <div className="aspect-square bg-white/5 border border-white/10 rounded-3xl mb-6 flex items-center justify-center text-zinc-700 italic text-xs">
                QR Scanner not uploaded
              </div>
            )}

            <div className="space-y-4 border-t border-white/10 pt-6">
              <div>
                <p className="text-[8px] text-zinc-500 font-black uppercase tracking-widest">Payable to</p>
                <p className="font-bold text-sm uppercase">{bankData.account_holder || "---"}</p>
              </div>
              <div>
                <p className="text-[8px] text-zinc-500 font-black uppercase tracking-widest">Bank Details</p>
                <p className="font-mono text-xs tracking-tighter opacity-70">{bankData.bank_name} - {bankData.account_number}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}