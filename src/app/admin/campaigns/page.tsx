"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import {
  Plus, Trash2, Edit2, X, Upload, Loader2
} from "lucide-react";

export default function ManageCampaigns() {
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

 const [form, setForm] = useState({
  name: "",
  description: "",
  category: "",
  status: "upcoming",
  start_date: "",
  end_date: "",
  current_engagement: 0,
  
  target: 0, // Ensure this is initialized as a number
  banner_url: ""
});

  // FETCH
  const fetchData = async () => {
    const { data } = await supabase.from("campaigns").select("*").order("created_at", { ascending: false });
    const { data: cat } = await supabase.from("categories").select("*");

    if (data) setItems(data);
    if (cat) setCategories(cat);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // UPLOAD IMAGE
  const uploadBanner = async () => {
    if (!file) return form.banner_url;

    const ext = file.name.split(".").pop();
    const fileName = `campaign-${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("campaigns")
      .upload(fileName, file);

    if (error) throw error;

    const { data } = supabase.storage.from("campaigns").getPublicUrl(fileName);
    return data.publicUrl;
  };

  // SAVE
  const handleSave = async () => {
    try {
      setLoading(true);

      const banner = await uploadBanner();

      const payload = { ...form, banner_url: banner };

      const { error } = editId
        ? await supabase.from("campaigns").update(payload).eq("id", editId)
        : await supabase.from("campaigns").insert([payload]);

      if (error) throw error;

      closeModal();
      fetchData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: any) => {
    setEditId(item.id);
    setForm(item);
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete campaign?")) return;
    await supabase.from("campaigns").delete().eq("id", id);
    fetchData();
  };

  const closeModal = () => {
    setIsOpen(false);
    setEditId(null);
    setFile(null);
    setForm({
      name: "",
      description: "",
      category: "",
      status: "upcoming",
      start_date: "",
      end_date: "",
      current_engagement: 0,
      target: 0,
      banner_url: ""
    });
  };

  return (
    <div className="p-8 space-y-8 bg-slate-50">

      {/* HEADER */}
      <div className="flex justify-between bg-white p-8 rounded-3xl">
        <h1 className="text-3xl font-black uppercase">Campaigns</h1>
        <button onClick={() => setIsOpen(true)} className="bg-black text-white px-6 py-3 rounded-xl flex gap-2">
          <Plus size={18} /> Create Campaign
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 text-xs uppercase text-slate-400">
            <tr>
              <th className="p-5">Banner</th>
              <th className="p-5">Name</th>
              <th className="p-5">Category</th>
              <th className="p-5">Status</th>
              <th className="p-5 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-5">
                  <img src={c.banner_url} className="w-20 h-12 object-cover rounded-lg" />
                </td>
                <td className="p-5 font-bold">{c.name}</td>
                <td className="p-5">{c.category}</td>
                <td className="p-5 capitalize">{c.status}</td>
                <td className="p-5 flex justify-end gap-2">
                  <button onClick={() => handleEdit(c)}><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(c.id)}><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl flex flex-col rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[95vh]">

            {/* HEADER */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-50">
              <div>
                <h2 className="font-black text-2xl text-gray-900 tracking-tight">
                  {editId ? "Edit Campaign" : "Create Campaign"}
                </h2>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mt-1">Campaign Details</p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-all active:scale-90"
              >
                <X size={22} className="text-gray-500" />
              </button>
            </div>

            {/* FORM BODY */}
            <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar">

              {/* Name & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase text-gray-400 ml-1">Campaign Name</label>
                  <input
                    placeholder="e.g. Summer Outreach"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-black outline-none transition-all bg-gray-50/50 hover:bg-gray-50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase text-gray-400 ml-1">Category</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-black outline-none transition-all bg-gray-50/50 cursor-pointer appearance-none"
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-gray-400 ml-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="What is this campaign about?"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-black outline-none transition-all bg-gray-50/50 resize-none"
                />
              </div>
              {/* Numbers Section: Target & Capacity */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* Target Goal Input */}
  <div className="space-y-1">
    <label className="text-[11px] font-bold uppercase text-gray-400 ml-1">
      Target Goal
    </label>
    <div className="relative">
      <input
        type="number"
        placeholder="100000"
        value={form.target}
        onChange={e => setForm({ ...form, target: parseInt(e.target.value) || 0 })}
        className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-black outline-none transition-all bg-gray-50/50 font-black text-xl"
      />
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 font-bold">
        GOAL
      </div>
    </div>
  </div>


</div>

              {/* Banner Upload */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-gray-400 ml-1">Campaign Banner</label>
                <label className="group border-2 border-dashed border-gray-200 p-6 text-center rounded-[2rem] cursor-pointer hover:border-black hover:bg-zinc-50 transition-all flex flex-col items-center justify-center">
                  <div className="p-3 bg-gray-100 rounded-2xl group-hover:bg-black group-hover:text-white transition-all duration-300">
                    <Upload size={20} />
                  </div>
                  <p className="text-sm font-bold mt-3 text-gray-700">Upload Banner Image</p>
                  <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-tighter">Recommended: 1200 x 400px</p>
                  <input type="file" hidden onChange={(e) => setFile(e.target.files?.[0] || null)} />
                </label>
              </div>

              {/* Timeline & Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase text-gray-400 ml-1">Start Date</label>
                  <input
                    type="date"
                    value={form.start_date}
                    onChange={e => setForm({ ...form, start_date: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-black outline-none transition-all bg-gray-50/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase text-gray-400 ml-1">End Date</label>
                  <input
                    type="date"
                    value={form.end_date}
                    onChange={e => setForm({ ...form, end_date: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-black outline-none transition-all bg-gray-50/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase text-gray-400 ml-1">Status</label>
                  <select
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-black outline-none transition-all bg-gray-50/50 font-semibold"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="p-8 bg-gray-50/50 border-t border-gray-50 flex justify-end items-center gap-6">
              <button
                onClick={closeModal}
                className="text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors"
              >
                Discard
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="bg-black text-white px-10 py-4 rounded-[1.25rem] font-bold hover:bg-zinc-800 active:scale-95 transition-all flex items-center justify-center min-w-[160px] shadow-lg shadow-black/10 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  editId ? "Update Campaign" : "Launch Campaign"
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}