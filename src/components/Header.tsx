"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from "@/utils/supabase";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLang } from "@/components/LanguageContext";
import {
  Menu,
  X,
  User,
  LogOut,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence, Variants } from "framer-motion";
import LoginModal from './LoginModal';

export default function Header() {
  const { lang, setLang, t } = useLang();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [siteData, setSiteData] = useState<any>(null);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  const handleLanguageSwitch = (langCode: string) => {
    setLang(langCode);
    const cookieValue = `/en/${langCode}`;
    document.cookie = `googtrans=${cookieValue}; path=/`;
    document.cookie = `googtrans=${cookieValue}; domain=${window.location.hostname}; path=/`;
    window.location.reload();
  };

  const logoVariants: Variants = {
    initial: { opacity: 0, scale: 0.8, y: -20 },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  useEffect(() => {
    setMounted(true);
    const initializeHeader = async () => {
      const { data: settings } = await supabase.from('site_settings').select('*').eq('id', 1).single();
      if (settings) setSiteData(settings);
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    initializeHeader();
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setMobileMenuOpen(false);
      router.refresh();
      window.location.href = '/site/home';
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navLinks = [
    { name: t('Home', 'ಮನೆ'), path: '/site/home' },
    { name: t('Leaders', 'ನಾಯಕರು'), path: '/site/Leaders' },
    { name: t('News', 'ಸುದ್ದಿ'), path: '/site/News' },
    { name: t('Campaigns', 'ಅಭಿಯಾನಗಳು'), path: '/site/Campaigns' },
    { name: t('Gallery', 'ಗ್ಯಾಲರಿ'), path: '/site/gallery' },
    { name: t('About Us', 'ನಮ್ಮ ಬಗ್ಗೆ'), path: '/site/about' },
  ];

  if (!siteData || !mounted) return null;

  return (
    <header className="w-full fixed top-0 z-[100] transition-all duration-300">
      {/* --- MAIN NAVIGATION BAR --- */}
      <nav className={`px-6 md:px-12 transition-all duration-700 border-b ${isScrolled
        ? 'bg-black/95 backdrop-blur-2xl shadow-2xl py-3 border-brand-green/20'
        : 'bg-black/40 backdrop-blur-md py-5 border-white/5'
        }`}>
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          
          {/* LOGO */}
          <motion.div variants={logoVariants} initial="initial" animate="animate">
            <Link href="/" className="flex items-center gap-5 group">
              {siteData.logo_url && (
                <div className="relative p-2.5 bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                  <img src={siteData.logo_url} alt="Logo" className="w-10 h-10 md:w-12 md:h-12 object-contain" />
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter">
                  {siteData.site_name}<span className="text-brand-yellow">.</span>
                </span>
                <span className="text-[9px] md:text-[10px] font-bold text-brand-green uppercase tracking-[0.2em]">
                  {siteData.tag_line}
                </span>
              </div>
            </Link>
          </motion.div>

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.path} className="text-[11px] font-black uppercase tracking-[0.2em] text-white hover:text-brand-green transition-all">
                {link.name}
              </Link>
            ))}
            
            <div className="flex items-center bg-white/5 border border-white/10 p-1 rounded-xl ml-4">
              <button onClick={() => handleLanguageSwitch('en')} className={`px-3 py-1.5 rounded-lg text-[9px] font-black ${lang === 'en' ? 'bg-brand-green text-white' : 'text-white'}`}>EN</button>
              <button onClick={() => handleLanguageSwitch('kn')} className={`px-3 py-1.5 rounded-lg text-[9px] font-black ${lang === 'kn' ? 'bg-brand-green text-white' : 'text-white'}`}>ಕನ್ನಡ</button>
            </div>

            <Link href="/site/donate">
              <button className="flex items-center gap-3 bg-white text-black px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-brand-green hover:text-white transition-all">
                <Heart size={14} className="fill-current" />
                <span>{t("Donate Now", "ಈಗಲೇ ದೇಣಿಗೆ ನೀಡಿ")}</span>
              </button>
            </Link>

            {user ? (
              <button onClick={handleLogout} className="text-white hover:text-red-500 transition-colors"><LogOut size={20}/></button>
            ) : (
              <button onClick={() => setIsLoginOpen(true)} className="bg-brand-green text-white px-8 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest">{t("Join Now", "ಈಗಲೇ ಸೇರಿ")}</button>
            )}
          </div>

          {/* MOBILE TOGGLE BUTTON */}
          <div className="lg:hidden flex items-center gap-3">
             <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-3 text-brand-green bg-white/5 rounded-xl border border-white/10"
              >
                <Menu size={24} />
              </button>
          </div>
        </div>
      </nav>

      {/* --- MOBILE MENU OVERLAY (Properly Outside Nav) --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[120] bg-black flex flex-col lg:hidden"
          >
            <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
              <span className="text-xl font-black text-white uppercase">{siteData.site_name}</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-3 text-brand-green bg-white/5 rounded-xl">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-10 flex flex-col gap-8">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.path} onClick={() => setMobileMenuOpen(false)} className="text-4xl font-black uppercase tracking-tighter text-white">
                  {link.name}
                </Link>
              ))}
              
              <div className="flex flex-col gap-4 mt-4">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Select Language</p>
                <div className="flex gap-2">
                  <button onClick={() => handleLanguageSwitch('en')} className={`px-6 py-3 rounded-xl font-black text-xs ${lang === 'en' ? 'bg-brand-green text-white' : 'bg-white/5 text-white'}`}>EN</button>
                  <button onClick={() => handleLanguageSwitch('kn')} className={`px-6 py-3 rounded-xl font-black text-xs ${lang === 'kn' ? 'bg-brand-green text-white' : 'bg-white/5 text-white'}`}>ಕನ್ನಡ</button>
                </div>
              </div>
            </div>

            <div className="p-8 bg-zinc-950 space-y-4">
              <Link href="/site/donate" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full flex items-center justify-center gap-3 bg-white text-black py-5 rounded-2xl font-black uppercase text-xs">
                  <Heart size={18} className="fill-current" /> {t("Donate Now", "ಈಗಲೇ ದೇಣಿಗೆ ನೀಡಿ")}
                </button>
              </Link>
              {user ? (
                <button onClick={handleLogout} className="w-full py-5 rounded-2xl bg-red-500/10 text-red-500 font-black uppercase text-xs border border-red-500/20">Sign Out</button>
              ) : (
                <button onClick={() => {setMobileMenuOpen(false); setIsLoginOpen(true);}} className="w-full bg-brand-green text-white py-5 rounded-2xl font-black uppercase text-xs">{t("Join Now", "ಈಗಲೇ ಸೇರಿ")}</button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </header>
  );
}