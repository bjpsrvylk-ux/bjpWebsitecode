"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { 
  Users, Search, MapPin, Phone, 
  RotateCcw, Globe, Shield, User, ChevronRight
} from "lucide-react";

export default function MembersAdmin() {
  const [members, setMembers] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [wardFilter, setWardFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Wards for the dropdown
      const { data: wData } = await supabase.from("wards").select("*");
      if (wData) setWards(wData);

      // 2. Fetch Profiles with Ward info
      // We use left join logic to ensure even if ward_id is null, the member shows up
      const { data: pData, error } = await supabase
        .from("profiles")
        .select(`
          *,
          wards:ward_id (
            ward_name,
            ward_number
          )
        `);
      
      if (error) throw error;
      if (pData) setMembers(pData);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // CLEAR ALL FILTERS
  const resetFilters = () => {
    setSearch("");
    setWardFilter("all");
    setTypeFilter("all");
  };

  // FILTER LOGIC (Safe handling of nulls)
  const filtered = members.filter(m => {
    const s = search.toLowerCase();
    const matchesSearch = 
      (m.full_name?.toLowerCase() || "").includes(s) || 
      (m.phone_number || "").includes(s);
    
    const matchesWard = wardFilter === "all" || m.ward_id?.toString() === wardFilter;
    
    // Normalize null membership_type to "None" for filtering
    const mType = m.membership_type || "None";
    const matchesType = typeFilter === "all" || mType === typeFilter;

    return matchesSearch && matchesWard && matchesType;
  });

  return (
    <div className="p-4 md:p-10 bg-[#F8FAFC] min-h-screen font-sans">
      
      {/* TOP HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-[900] text-slate-900 tracking-tight uppercase">Member Central</h1>
          <p className="text-slate-500 font-bold text-sm tracking-widest mt-1">
            Displaying <span className="text-black">{filtered.length}</span> of {members.length} Total Records
          </p>
        </div>
        
        <button 
          onClick={resetFilters}
          className="flex items-center gap-2 bg-white border-2 border-slate-200 px-6 py-3 rounded-2xl font-black text-xs uppercase hover:bg-black hover:text-white hover:border-black transition-all shadow-sm"
        >
          <RotateCcw size={14} /> Clear All Filters
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
          <input 
            className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-[1.5rem] outline-none focus:ring-2 focus:ring-black font-bold transition-all"
            placeholder="Search by Name or Phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <select 
          className="w-full px-6 py-4 bg-slate-50 rounded-[1.5rem] outline-none font-black text-xs uppercase appearance-none cursor-pointer border-2 border-transparent focus:border-slate-200"
          value={wardFilter}
          onChange={e => setWardFilter(e.target.value)}
        >
          <option value="all">Filter by Ward (All)</option>
          {wards.map(w => <option key={w.id} value={w.id}>Ward {w.ward_number}: {w.ward_name}</option>)}
        </select>

        <select 
          className="w-full px-6 py-4 bg-slate-50 rounded-[1.5rem] outline-none font-black text-xs uppercase appearance-none cursor-pointer border-2 border-transparent focus:border-slate-200"
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
        >
          <option value="all">All Membership Types</option>
          <option value="Volunteer">Volunteer</option>
          <option value="Support">Support</option>
          <option value="None">None / Unassigned</option>
        </select>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/60 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Personal Info</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Phone Number</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Location Details</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Membership</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan={4} className="p-20 text-center animate-pulse font-black text-slate-300">LOADING DATABASE...</td></tr>
            ) : filtered.map((m) => (
              <tr key={m.id} className="group hover:bg-slate-50/80 transition-all cursor-default">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-black group-hover:text-white transition-all">
                      <User size={22} />
                    </div>
                    <div>
                      <p className="font-black text-slate-900 text-lg leading-tight">{m.full_name || "Anonymous"}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-tighter">ID: {m.id.slice(0,8)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2 text-slate-700 font-bold">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Phone size={14}/></div>
                    {m.phone_number || "No Phone"}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><MapPin size={14}/></div>
                    <div>
                      <p className="text-xs font-black text-slate-800 uppercase">{m.wards?.ward_name || "General Ward"}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{m.city}, {m.state}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <TypeBadge type={m.membership_type} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* EMPTY STATE */}
        {!loading && filtered.length === 0 && (
          <div className="p-24 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200">
               <RotateCcw size={40} />
            </div>
            <p className="text-slate-400 font-black uppercase text-xs tracking-widest">No matching members found</p>
            <button onClick={resetFilters} className="mt-4 text-black font-bold text-sm underline">Reset all filters</button>
          </div>
        )}
      </div>
    </div>
  );
}

function TypeBadge({ type }: { type: string }) {
  const styles: any = {
    Volunteer: "bg-orange-100 text-orange-600 border-orange-200",
    Support: "bg-blue-100 text-blue-600 border-blue-200",
    default: "bg-slate-100 text-slate-400 border-slate-200"
  };

  const currentStyle = styles[type] || styles.default;

  return (
    <span className={`px-4 py-2 border rounded-xl text-[10px] font-[900] uppercase tracking-widest flex items-center gap-2 w-fit ${currentStyle}`}>
      <Shield size={10} /> {type || "None"}
    </span>
  );
}