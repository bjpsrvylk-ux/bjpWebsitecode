"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import {
    Plus, Trash2, Edit2, X, User, Upload, Loader2
} from "lucide-react";

export default function ManageLeaders() {
    const [leaders, setLeaders] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);

    const [form, setForm] = useState({
        name: "",
        role: "",
        description: "",
        email: "",
        phone: "",
        image_url: ""
    });

    const [file, setFile] = useState<File | null>(null);

    // 🔄 Fetch Leaders
    const fetchLeaders = async () => {
        const { data } = await supabase
            .from("leaders")
            .select("*")
            .order("created_at", { ascending: false });

        if (data) setLeaders(data);
    };

    useEffect(() => {
        fetchLeaders();
    }, []);

    // 📤 Upload Image
    const uploadImage = async () => {
        if (!file) return form.image_url;

        const fileExt = file.name.split(".").pop();
        const fileName = `leader-${Date.now()}.${fileExt}`;

        const { error } = await supabase.storage
            .from("leaders")
            .upload(fileName, file);

        if (error) throw error;

        const { data } = supabase.storage
            .from("leaders")
            .getPublicUrl(fileName);

        return data.publicUrl;
    };

    // 💾 Save Leader
    const handleSave = async () => {
        try {
            setLoading(true);

            const imageUrl = await uploadImage();

            const payload = {
                ...form,
                image_url: imageUrl
            };

            if (editId) {
                await supabase.from("leaders").update(payload).eq("id", editId);
            } else {
                const { error } = await supabase.from("leaders").insert([payload]);

                if (error) {
                    console.error("DB ERROR:", error);
                    alert(error.message);
                    return;
                }
            }

            closeModal();
            fetchLeaders();
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ✏️ Edit
    const handleEdit = (item: any) => {
        setEditId(item.id);
        setForm(item);
        setIsOpen(true);
    };

    // ❌ Delete
    const handleDelete = async (id: string) => {
        if (!confirm("Delete this leader?")) return;
        await supabase.from("leaders").delete().eq("id", id);
        fetchLeaders();
    };

    const closeModal = () => {
        setIsOpen(false);
        setEditId(null);
        setForm({
            name: "",
            role: "",
            description: "",
            email: "",
            phone: "",
            image_url: ""
        });
        setFile(null);
    };

    return (
        <div className="p-8 space-y-8 bg-slate-50">

            {/* HEADER */}
            <div className="flex justify-between items-center bg-white p-8 rounded-3xl shadow-sm">
                <h1 className="text-3xl font-black uppercase">Manage Leaders</h1>
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-black text-white px-6 py-3 rounded-xl flex gap-2 items-center"
                >
                    <Plus size={18} /> Add Leader
                </button>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-400">
                        <tr>
                            <th className="p-5">Leader</th>
                            <th className="p-5">Role</th>
                            <th className="p-5">Contact</th>
                            <th className="p-5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaders.map((l) => (
                            <tr key={l.id} className="border-t">
                                <td className="p-5 flex items-center gap-3">
                                    {l.image_url ? (
                                        <img src={l.image_url} className="w-10 h-10 rounded-full object-cover" />
                                    ) : (
                                        <User />
                                    )}
                                    <span className="font-bold">{l.name}</span>
                                </td>
                                <td className="p-5">{l.role}</td>
                                <td className="p-5 text-sm">
                                    {l.email}<br />{l.phone}
                                </td>
                                <td className="p-5 text-right flex justify-end gap-2">
                                    <button onClick={() => handleEdit(l)}><Edit2 size={16} /></button>
                                    <button onClick={() => handleDelete(l.id)}><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 transition-all">
      {/* MODAL CONTAINER */}
      <div className="bg-white w-full max-w-lg overflow-hidden rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-gray-100 p-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {editId ? "Edit Leader" : "Add New Leader"}
          </h2>
          <button 
            onClick={closeModal} 
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* FORM BODY */}
        <div className="max-h-[70vh] overflow-y-auto p-8 space-y-5">
          
          <div className="grid gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 ml-1">Full Name</label>
              <input 
                placeholder="e.g. Jane Doe"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all bg-gray-50/50" 
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 ml-1">Role / Position</label>
              <input 
                placeholder="e.g. Chief Executive Officer"
                value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all bg-gray-50/50" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700 ml-1">Email</label>
                <input 
                  type="email"
                  placeholder="name@company.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all bg-gray-50/50" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700 ml-1">Phone</label>
                <input 
                  placeholder="+1 (555) 000-0000"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all bg-gray-50/50" 
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 ml-1">Biography</label>
              <textarea 
                rows={3}
                placeholder="Tell us about this leader..."
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all bg-gray-50/50 resize-none" 
              />
            </div>
          </div>

          {/* IMAGE UPLOAD */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 ml-1">Profile Photo</label>
            <label className="group flex flex-col items-center justify-center border-2 border-dashed border-gray-200 p-8 rounded-2xl cursor-pointer hover:border-black hover:bg-gray-50 transition-all">
                <div className="bg-gray-100 p-3 rounded-full group-hover:scale-110 transition-transform">
                    <Upload size={20} className="text-gray-600" />
                </div>
                <p className="text-sm font-medium mt-3">Click to upload or drag & drop</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG or WEBP (Max 5MB)</p>
                <input type="file" hidden onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </label>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="bg-gray-50 px-8 py-6 flex justify-end items-center gap-4">
          <button 
            onClick={closeModal} 
            className="text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors px-4"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            disabled={loading}
            className="flex items-center justify-center bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-zinc-800 active:scale-95 transition-all min-w-[140px] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              editId ? "Save Changes" : "Create Leader"
            )}
          </button>
        </div>

      </div>
    </div>
            )}
        </div>
    );
}