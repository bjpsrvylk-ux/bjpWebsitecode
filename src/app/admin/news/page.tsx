"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import {
  Plus, Trash2, Edit2, X, Loader2,
  AlertCircle, Video, Image as ImageIcon, Link as LinkIcon,
  User, Clock, Tag, Calendar, AlignLeft
} from "lucide-react";

export default function ManageNews() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const initialForm = {
    title: "",
    excerpt: "", // Added excerpt
    content: "",
    image_url: "",
    gallery_urls: [] as string[],
    video_url: "",
    external_link: "",
    publish_date: new Date().toISOString().split('T')[0],
    status: "published",
    category: "Elections",
    author: "",
    reading_time: 5,
    is_breaking: false,
    bias_sentiment: "Neutral",
    tags: ""
  };

  const [form, setForm] = useState(initialForm);

  const fetchPosts = async () => {
    const { data } = await supabase.from("news").select("*").order("created_at", { ascending: false });
    if (data) setPosts(data);
  };

  useEffect(() => { fetchPosts(); }, []);

  const uploadToStorage = async (file: File, bucket: string) => {
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(fileName, file);
    if (error) throw error;
    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      let newGalleryUrls = [...(form.gallery_urls || [])];
      if (imageFiles.length > 0) {
        const uploadPromises = imageFiles.map(file => uploadToStorage(file, "news"));
        const uploadedPaths = await Promise.all(uploadPromises);
        newGalleryUrls = [...newGalleryUrls, ...uploadedPaths];
      }

      let newVideoUrl = form.video_url;
      if (videoFile) {
        newVideoUrl = await uploadToStorage(videoFile, "videos");
      }

      const payload = {
        ...form,
        image_url: newGalleryUrls[0] || form.image_url,
        gallery_urls: newGalleryUrls,
        video_url: newVideoUrl
      };

      const { error } = editId
        ? await supabase.from("news").update(payload).eq("id", editId)
        : await supabase.from("news").insert([payload]);

      if (error) throw error;
      closeModal();
      fetchPosts();
    } catch (err: any) {
      alert("Upload Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    await supabase.from("news").delete().eq("id", id);
    fetchPosts();
  };

  const closeModal = () => {
    setIsOpen(false);
    setEditId(null);
    setForm(initialForm);
    setImageFiles([]);
    setVideoFile(null);
  };

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen font-sans text-slate-900">
      {/* HEADER */}
      <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter">News Room</h1>
          <p className="text-slate-400 font-medium text-sm mt-1">Total Articles: {posts.length}</p>
        </div>
        <button onClick={() => setIsOpen(true)} className="bg-black text-white px-8 py-4 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-xs hover:bg-zinc-800 transition-all shadow-xl shadow-black/10">
          <Plus size={20} /> Create Report
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[10px] uppercase font-black text-slate-400 tracking-widest border-b">
            <tr>
              <th className="p-6">Article & Author</th>
              <th className="p-6">Multimedia</th>
              <th className="p-6">Bias / Category</th>
              <th className="p-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {posts.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="p-6">
                  <div className="flex gap-4 items-center">
                    <img src={p.image_url || "/api/placeholder/400/320"} className="w-20 h-14 object-cover rounded-xl shadow-sm border" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {p.is_breaking && <span className="bg-red-500 text-white text-[8px] px-2 py-0.5 rounded-full font-black animate-pulse">BREAKING</span>}
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{p.category}</span>
                      </div>
                      <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">{p.title}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 flex items-center gap-1"><User size={10} /> {p.author || 'Staff'}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex gap-3 text-slate-300">
                    <span className={`flex items-center gap-1 text-xs font-bold ${p.gallery_urls?.length ? 'text-green-500' : ''}`}><ImageIcon size={14} /> {p.gallery_urls?.length || 0}</span>
                    <span className={`flex items-center gap-1 text-xs font-bold ${p.video_url ? 'text-blue-500' : ''}`}><Video size={14} /> {p.video_url ? '1' : '0'}</span>
                    {p.external_link && <LinkIcon size={14} className="text-purple-500" />}
                  </div>
                </td>
                <td className="p-6">
                  <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${p.bias_sentiment === 'Neutral' ? 'bg-slate-100 text-slate-500' : 'bg-orange-100 text-orange-600'}`}>
                    {p.bias_sentiment}
                  </span>
                </td>
                <td className="p-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => { setForm(p); setEditId(p.id); setIsOpen(true); }} className="p-3 hover:bg-blue-50 text-blue-600 rounded-xl transition-all"><Edit2 size={18} /></button>
                    <button onClick={() => handleDelete(p.id)} className="p-3 hover:bg-red-50 text-red-600 rounded-xl transition-all"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-white w-full max-w-4xl flex flex-col rounded-[3rem] shadow-2xl overflow-hidden max-h-[95vh]">

            <div className="p-8 border-b flex justify-between items-center bg-slate-50/50">
              <h2 className="font-black text-2xl uppercase tracking-tighter italic">Political Briefing Editor</h2>
              <button onClick={closeModal} className="p-3 hover:bg-white rounded-full transition-all border shadow-sm"><X size={20} /></button>
            </div>

            <div className="p-8 space-y-6 overflow-y-auto">

              {/* 1. TOP METADATA ROW */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Political Domain</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full p-3 rounded-xl border bg-slate-50 text-sm font-bold">
                    <option value="Elections">Elections</option>
                    <option value="Policy">Public Policy</option>
                    <option value="International">International</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Sentiment/Bias</label>
                  <select value={form.bias_sentiment} onChange={e => setForm({ ...form, bias_sentiment: e.target.value })} className="w-full p-3 rounded-xl border bg-slate-50 text-sm font-bold">
                    <option value="Neutral">Neutral</option>
                    <option value="Opinion">Opinion Piece</option>
                    <option value="Left-Leaning">Left-Leaning</option>
                    <option value="Right-Leaning">Right-Leaning</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Publish Date</label>
                  <input type="date" value={form.publish_date} onChange={e => setForm({ ...form, publish_date: e.target.value })} className="w-full p-3 rounded-xl border bg-slate-50 text-sm font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Reading (Min)</label>
                  <input type="number" value={form.reading_time} onChange={e => setForm({ ...form, reading_time: parseInt(e.target.value) })} className="w-full p-3 rounded-xl border bg-slate-50 text-sm font-bold" />
                </div>
              </div>

              {/* 2. HEADLINE & AUTHOR */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400">Headline</label>
                  <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:border-black transition-all font-bold text-lg" placeholder="Major legislative shift..." />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400">Author/Reporter</label>
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200" placeholder="Name of correspondent" />
                  </div>
                </div>
              </div>

              {/* 3. EXCERPT (THE PART YOU REQUESTED) */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400">Excerpt / Brief Summary</label>
                <div className="relative">
                  <AlignLeft size={18} className="absolute left-4 top-4 text-slate-300" />
                  <textarea 
                    rows={2}
                    value={form.excerpt} 
                    onChange={e => setForm({ ...form, excerpt: e.target.value })} 
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 outline-none focus:border-black transition-all font-medium italic" 
                    placeholder="A short summary for the news feed card..." 
                  />
                </div>
              </div>

              {/* 4. LINKS & BREAKING TOGGLE */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400">Source Link</label>
                  <div className="relative">
                    <LinkIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input value={form.external_link} onChange={e => setForm({ ...form, external_link: e.target.value })} className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200" placeholder="https://source.com" />
                  </div>
                </div>
                <label className="flex items-center gap-4 p-4 rounded-2xl border border-red-100 bg-red-50/20 cursor-pointer hover:bg-red-50 transition-all">
                  <input type="checkbox" checked={form.is_breaking} onChange={e => setForm({ ...form, is_breaking: e.target.checked })} className="w-6 h-6 rounded-lg border-red-300 text-red-600 focus:ring-red-500" />
                  <div className="flex items-center gap-2">
                    <AlertCircle size={20} className="text-red-500" />
                    <span className="text-xs font-black uppercase text-red-700">Breaking News</span>
                  </div>
                </label>
              </div>

              {/* MEDIA GALLERY & VIDEO (SAME AS YOUR CODE) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-xs font-black uppercase text-slate-400">Gallery</label>
                  <div className="grid grid-cols-3 gap-2">
                    {form.gallery_urls?.map((url, idx) => (
                      <div key={`db-${idx}`} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200">
                        <img src={url} className="w-full h-full object-cover opacity-70" />
                        <button onClick={() => setForm({ ...form, gallery_urls: form.gallery_urls.filter((_, i) => i !== idx) })} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"><X size={10} /></button>
                      </div>
                    ))}
                    {imageFiles.map((file, idx) => (
                      <div key={`local-${idx}`} className="relative aspect-square rounded-xl overflow-hidden border-2 border-black">
                        <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                        <button onClick={() => setImageFiles(imageFiles.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-black text-white rounded-full p-1"><X size={10} /></button>
                      </div>
                    ))}
                    <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer">
                      <Plus size={16} className="text-slate-300" />
                      <input type="file" hidden multiple accept="image/*" onChange={e => setImageFiles([...imageFiles, ...Array.from(e.target.files || [])])} />
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-black uppercase text-slate-400">Video</label>
                  {(videoFile || form.video_url) ? (
                    <div className="p-4 bg-blue-50 border rounded-2xl flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-700 truncate max-w-[150px]">{videoFile ? videoFile.name : "Saved Video"}</span>
                      <button onClick={() => { setVideoFile(null); setForm({ ...form, video_url: "" }); }} className="text-red-400"><Trash2 size={16}/></button>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center p-4 border-2 border-dashed rounded-2xl cursor-pointer hover:bg-blue-50">
                      <Video size={16} className="mr-2 text-slate-400" /> <span className="text-[10px] font-black uppercase">Add Video</span>
                      <input type="file" hidden accept="video/*" onChange={e => setVideoFile(e.target.files?.[0] || null)} />
                    </label>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400">Full Content</label>
                <textarea rows={6} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} className="w-full p-6 rounded-[2rem] border border-slate-200 bg-slate-50/30 outline-none focus:bg-white transition-all font-medium leading-relaxed" placeholder="Detailed report..." />
              </div>

            </div>

            <div className="p-8 bg-slate-50 border-t flex justify-end gap-6 items-center">
              <button onClick={closeModal} className="px-8 py-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Discard</button>
              <button onClick={handleSave} disabled={loading} className="bg-black text-white px-14 py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:scale-[1.03] active:scale-95 transition-all disabled:opacity-50 shadow-2xl shadow-black/20">
                {loading ? <Loader2 className="animate-spin" size={18} /> : editId ? "Update Report" : "Launch Post"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}