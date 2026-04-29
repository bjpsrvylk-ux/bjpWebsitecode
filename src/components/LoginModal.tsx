"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from "@/utils/supabase";
import { X, User, Lock, Loader2, Mail, BadgeCheck, Sparkles, MapPin, Phone, Hash, ChevronDown } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ViewMode = 'login' | 'register';

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [view, setView] = useState<ViewMode>('login');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [wards, setWards] = useState<{ id: number, ward_number: string, ward_name: string }[]>([]);

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [state, setState] = useState('Karnataka');
  const [city, setCity] = useState('Bangalore');
  const [phone, setPhone] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [agreed, setAgreed] = useState(false);
const [membershipType, setMembershipType] = useState('');
  useEffect(() => {
    if (isOpen) {
      const fetchWards = async () => {
        const { data, error } = await supabase.from('wards').select('*').order('ward_number', { ascending: true });
        if (!error && data) setWards(data);
      };
      fetchWards();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    if (view === 'register' && !agreed) {
      setMessage({ type: 'error', text: 'Please agree to terms.' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    // Identify if user is using phone or email
    let identifier = view === 'login' ? email.trim() : (email.trim() || `${phone}@skjv.com`);

    if (identifier !== '' && !identifier.includes('@')) {
      identifier = `${identifier}@skjv.com`;
    }

    if (view === 'login') {
      const { error } = await supabase.auth.signInWithPassword({
        email: identifier,
        password: password,
      });

      if (error) {
        setMessage({ type: 'error', text: "Invalid credentials. Please check your phone/email and password." });
      } else {
        setMessage({ type: 'success', text: 'Welcome back!' });
        setTimeout(() => { onClose(); window.location.reload(); }, 1500);
      }
    } else {
      const { data, error } = await supabase.auth.signUp({
        email: identifier,
        password,
        options: {
          data: {
            full_name: fullName,
            state: state,
            city: city,
            phone_number: phone,
            alt_phone_number: altPhone,
            ward_id: parseInt(selectedWard),
            membership_type: membershipType // <--- Add this line
          }
        },
      });

      if (error) {
        setMessage({ type: 'error', text: error.message });
      } else if (data.user && data.user.identities?.length === 0) {
        setMessage({ type: 'error', text: 'This phone/email is already registered.' });
      } else {
        setMessage({ type: 'success', text: 'Application Submitted Successfully!' });
      }
    }
    setLoading(false);
  };

  const inputClass = "w-full bg-zinc-900 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold text-white placeholder:text-zinc-600 focus:ring-2 focus:ring-indigo-500/50 outline-none appearance-none";
  const labelClass = "text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-1";
  const selectClass = "w-full bg-zinc-900 border border-white/10 rounded-2xl py-3 pl-12 pr-10 text-sm font-bold text-white focus:ring-2 focus:ring-indigo-500/50 outline-none appearance-none cursor-pointer";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-5xl flex flex-col md:flex-row bg-zinc-950 rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/5 animate-in fade-in zoom-in-95">

        {/* LEFT SIDE */}
        <div className="hidden md:flex w-2/5 bg-black relative items-center justify-center">
          <img 
          src="https://archive.siasat.com/wp-content/uploads/2022/09/BJP-Rally.jpg" className="absolute inset-0 w-full h-full object-cover opacity-30" alt="Branding" />
          <div className="relative z-20 p-10 text-center">
            <Sparkles className="text-brand-green mb-6 mx-auto" size={40} />
            <h3 className="text-3xl font-black text-white uppercase">Bharatiya <br /><span className="text-brand-green">Janata Party</span></h3>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-3/5 p-8 md:p-12 max-h-[90vh] overflow-y-auto bg-zinc-950">
          <button onClick={onClose} className="absolute top-8 right-8 text-zinc-500 hover:text-white"><X size={20} /></button>

          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
              {view === 'login' ? 'Sign In' : 'Membership Registration'}
            </h2>

            {message.text && (
              <div className={`p-4 rounded-xl text-xs font-bold ${message.type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                {message.text}
              </div>
            )}

            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleAuth}>
              {view === 'register' && (
                <>
                  <div className="space-y-1 md:col-span-2">
                    <label className={labelClass}>Full Name</label>
                    <div className="relative">
                      <BadgeCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                      <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} placeholder="Full Name" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className={labelClass}>Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                      <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} placeholder="Primary Mobile" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className={labelClass}>Alt Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                      <input type="tel" value={altPhone} onChange={(e) => setAltPhone(e.target.value)} className={inputClass} placeholder="Secondary Mobile" />
                    </div>
                  </div>
                  {/* Membership Type Selection */}
<div className="space-y-1 md:col-span-2">
  <label className={labelClass}>Membership Type</label>
  <div className="relative">
    <BadgeCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
    <select 
      required 
      value={membershipType} 
      onChange={(e) => setMembershipType(e.target.value)} 
      className={selectClass}
    >
      <option value="" className="bg-zinc-900 text-zinc-500">Select Membership Type</option>
      <option value="Volunteer" className="bg-zinc-900 text-white">Volunteer</option>
      <option value="Support" className="bg-zinc-900 text-white">Support</option>
    </select>
    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
  </div>
</div>

                  <div className="space-y-1">
                    <label className={labelClass}>State</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                      <select value={state} onChange={(e) => setState(e.target.value)} className={selectClass}>
                        <option value="Karnataka" className="bg-zinc-900">Karnataka</option>
                        <option value="Andhra Pradesh" className="bg-zinc-900">Andhra Pradesh</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className={labelClass}>City</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                      <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className={inputClass} />
                    </div>
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className={labelClass}>Ward Selection</label>
                    <div className="relative">
                      <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                      <select required value={selectedWard} onChange={(e) => setSelectedWard(e.target.value)} className={selectClass}>
                        <option value="" className="bg-zinc-900">Select Ward</option>
                        {wards.map((w) => (
                          <option key={w.id} value={w.id} className="bg-zinc-900 text-white">Ward {w.ward_number} - {w.ward_name}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-1 md:col-span-2">
                <label className={labelClass}>
                  {view === 'login' ? 'Phone Number or Email' : 'Email (Optional)'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                    placeholder={view === 'login' ? "Phone or Email" : "email@example.com"}
                  />
                </div>
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className={labelClass}>Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                  <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} placeholder="••••••••" />
                </div>
              </div>

              {view === 'register' && (
                <div className="md:col-span-2 flex items-start gap-3 py-2">
                  <input type="checkbox" required checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1 accent-indigo-500" />
                  <p className="text-[10px] text-zinc-400 font-bold leading-tight uppercase tracking-widest">
                    I pledge to work towards the betterment of the nation.
                  </p>
                </div>
              )}

              <button disabled={loading} className="md:col-span-2 w-full bg-white text-black py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-indigo-500 hover:text-white transition-all disabled:opacity-50">
                {loading ? <Loader2 className="animate-spin" /> : (view === 'login' ? 'Enter Portal' : 'Submit Application')}
              </button>
            </form>

            <div className="text-center">
              <button onClick={() => setView(view === 'login' ? 'register' : 'login')} className="text-[10px] font-black uppercase text-zinc-500 hover:text-white">
                {view === 'login' ? "Need an account? Register Now" : "Have an account? Sign In"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}