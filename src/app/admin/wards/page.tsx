"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { 
  Plus, Hash, MapPin, Search, 
  Trash2, Edit3, Loader2, X, CheckCircle2 
} from "lucide-react";

export default function WardsAdmin() {
  const [wards, setWards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    ward_number: "",
    ward_name: "",
    area_name: ""
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchWards();
  }, []);

  const fetchWards = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("wards")
      .select("*")
      .order("ward_number", { ascending: true });
    if (!error) setWards(data);
    setLoading(false);
  };

  // --- DELETE FUNCTION ---
  const handleDeleteWard = async (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      const { error } = await supabase
        .from("wards")
        .delete()
        .eq("id", id);

      if (error) {
        alert("Error deleting ward: " + error.message);
      } else {
        // Refresh local state immediately
        setWards(wards.filter(w => w.id !== id));
      }
    }
  };

  // --- OPEN EDIT MODAL ---
  const startEdit = (ward: any) => {
    setEditingId(ward.id);
    setFormData({
      ward_number: ward.ward_number,
      ward_name: ward.ward_name,
      area_name: ward.area_name || ""
    });
    setIsModalOpen(true);
  };

  // --- SAVE (ADD or UPDATE) ---
  const handleSaveWard = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (editingId) {
      // UPDATE EXISTING
      const { error } = await supabase
        .from("wards")
        .update(formData)
        .eq("id", editingId);

      if (error) alert(error.message);
    } else {
      // INSERT NEW
      const { error } = await supabase
        .from("wards")
        .insert([formData]);

      if (error) alert(error.message);
    }

    setSubmitting(false);
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ ward_number: "", ward_name: "", area_name: "" });
    fetchWards();
  };

  const filteredWards = wards.filter(w => 
    w.ward_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    w.ward_number.includes(searchTerm)
  );

  return (
    <div className="p-8 min-h-screen bg-[#FDFDFD]">
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900">Ward Control</h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em] mt-1">Territory Management</p>
        </div>
        
        <button 
          onClick={() => {
            setEditingId(null);
            setFormData({ ward_number: "", ward_name: "", area_name: "" });
            setIsModalOpen(true);
          }}
          className="bg-black text-white px-8 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest flex items-center gap-3 hover:bg-brand-green transition-all shadow-xl shadow-slate-200"
        >
          <Plus size={16} /> Add New Ward
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="relative mb-8 max-w-md">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
        <input 
          placeholder="Filter by Ward Name or Number..."
          className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-[1.5rem] outline-none focus:ring-2 focus:ring-black font-bold text-sm transition-all shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* WARDS TABLE */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="p-8 text-[10px] font-black uppercase text-slate-400 tracking-widest">Number</th>
              <th className="p-8 text-[10px] font-black uppercase text-slate-400 tracking-widest">Ward Identity</th>
              <th className="p-8 text-[10px] font-black uppercase text-slate-400 tracking-widest">Area / Landmark</th>
              <th className="p-8 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan={4} className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-slate-200" size={40}/></td></tr>
            ) : filteredWards.map((w) => (
              <tr key={w.id} className="group hover:bg-slate-50/50 transition-all">
                <td className="p-8">
                  <div className="bg-slate-100 w-10 h-10 rounded-xl flex items-center justify-center font-black text-slate-500 group-hover:bg-black group-hover:text-white transition-all">
                    {w.ward_number}
                  </div>
                </td>
                <td className="p-8 font-black text-slate-900 text-lg uppercase tracking-tight">
                  {w.ward_name}
                </td>
                <td className="p-8 text-slate-500 font-bold text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-slate-300" />
                    {w.area_name || "Not Specified"}
                  </div>
                </td>
                <td className="p-8 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => startEdit(w)}
                      className="p-3 hover:bg-white hover:shadow-md rounded-xl text-slate-400 hover:text-black transition-all"
                    >
                      <Edit3 size={16}/>
                    </button>
                    <button 
                      onClick={() => handleDeleteWard(w.id, w.ward_name)}
                      className="p-3 hover:bg-white hover:shadow-md rounded-xl text-slate-400 hover:text-red-500 transition-all"
                    >
                      <Trash2 size={16}/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADD/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl p-10 animate-in fade-in zoom-in-95">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-300 hover:text-black transition-colors"><X size={24} /></button>
            
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-8">
              {editingId ? "Update Territory" : "Register Territory"}
            </h2>
            
            <form onSubmit={handleSaveWard} className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Ward Number</label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-black font-bold transition-all"
                    placeholder="e.g. 01..."
                    value={formData.ward_number}
                    onChange={(e) => setFormData({...formData, ward_number: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Ward Name</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-black font-bold transition-all"
                    placeholder="e.g. Kempegowda Ward"
                    value={formData.ward_name}
                    onChange={(e) => setFormData({...formData, ward_name: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Area / Landmark</label>
                <input 
                  className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-black font-bold transition-all"
                  placeholder="e.g. Market Street Area"
                  value={formData.area_name}
                  onChange={(e) => setFormData({...formData, area_name: e.target.value})}
                />
              </div>

              <button 
                disabled={submitting}
                className="w-full bg-black text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-brand-green transition-all shadow-xl shadow-slate-200"
              >
                {submitting ? <Loader2 className="animate-spin" /> : <><CheckCircle2 size={16}/> {editingId ? "Update Ward" : "Save Ward Details"}</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}