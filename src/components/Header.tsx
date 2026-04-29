"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from "@/utils/supabase";
import Link from 'next/link';
import { useTheme } from "next-themes";
import { useRouter } from 'next/navigation';
import { useLang } from "@/components/LanguageContext";
import {
  Menu,
  X,
  User,
  LogOut,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import LoginModal from './LoginModal';

export default function Header() {
  const { lang, setLang, t, autoTranslate } = useLang();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [siteData, setSiteData] = useState<any>(null);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // 1. Logic to trigger the Google Translate Plugin
  // Inside your Header component
const handleLanguageSwitch = (langCode: string) => {
  // 1. Update your Context state
  setLang(langCode);

  // 2. Set the Google Translate Cookie
  // This tells the Google script to translate the page to Kannada on load
  const cookieValue = `/en/${langCode}`;
  document.cookie = `googtrans=${cookieValue}; path=/`;
  // Also set it for the domain to ensure it persists across subpages
  document.cookie = `googtrans=${cookieValue}; domain=${window.location.hostname}; path=/`;

  // 3. Force a reload
  // This is the "secret sauce" to make sure Next.js and Google don't fight.
  // When the page reloads, Google reads the cookie and translates BEFORE the UI flickers.
  window.location.reload();
};

useEffect(() => {
  const timer = setTimeout(() => {
    handleLanguageSwitch(lang);
  }, 10000000);

  return () => clearTimeout(timer);
}, []);

  const logoVariants = {
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
      // 1. Tell Supabase to end the session
      await supabase.auth.signOut();
      
      // 2. Clear local user state immediately so the UI updates
      setUser(null);
      
      // 3. Close mobile menu if it's open
      setMobileMenuOpen(false);

      // 4. Refresh and Redirect
      // router.refresh() updates the server components
      // window.location.href forces a hard reload to the home page 
      // which is the safest way to clear all auth states.
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
      <nav className={`px-6 md:px-12 transition-all duration-700 border-b ${isScrolled
        ? 'bg-black/95 backdrop-blur-2xl shadow-2xl py-3 border-brand-green/20'
        : 'bg-black/40 backdrop-blur-md py-5 border-white/5'
        }`}>
        <motion.div className="max-w-[1400px] mx-auto flex items-center justify-between">

          {/* LOGO SECTION */}
          <motion.div variants={logoVariants} initial="initial" animate="animate">
            <Link href="/" className="flex items-center gap-5 group">
              {siteData.logo_url && (
                <motion.div
                  className="relative p-2.5 bg-white/5 rounded-2xl shadow-2xl backdrop-blur-md border border-white/10 overflow-hidden group"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-green/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <motion.img
                    src={siteData.logo_url}
                    alt="Logo"
                    className="w-12 h-12 object-contain relative z-10 filter drop-shadow-md"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-green scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </motion.div>
              )}

              <div className="flex flex-col">
                <span className="text-2xl font-black text-white uppercase tracking-tighter">
                  {/* Ensure this is clean text for Google to detect */}
                  <span>{siteData.site_name}</span>
                  <span className="text-brand-yellow">.</span>
                </span>

                <span className="text-[10px] font-bold text-brand-green uppercase tracking-[0.2em] mt-1.5">
                  {/* Ensure this is clean text for Google to detect */}
                  <span>{siteData.tag_line}</span>
                </span>
              </div>
            </Link>
          </motion.div>

          {/* DESKTOP NAV & ACTIONS */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className="group relative text-[11px] font-black uppercase tracking-[0.2em] text-white transition-all duration-300"
              >
                <span>{link.name}</span>
                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-brand-green transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}

            {/* --- PREMIUM LANGUAGE TOGGLE --- */}
            <div className="flex items-center bg-white/5 border border-white/10 p-1 rounded-xl ml-4">
              <button
                onClick={() => handleLanguageSwitch('en')}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black transition-all ${lang === 'en' ? 'bg-brand-green text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
              >
                EN
              </button>
              <button
                onClick={() => handleLanguageSwitch('kn')}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black transition-all ${lang === 'kn' ? 'bg-brand-green text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
              >
                ಕನ್ನಡ
              </button>
            </div>

            {/* DONATE BUTTON */}
            <Link href="/site/donate">
              <motion.button
                className="flex items-center gap-3 bg-white text-black px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all hover:bg-brand-green hover:text-white"
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <Heart size={14} className="fill-current" />
                <span>{t("Donate Now", "ಈಗಲೇ ದೇಣಿಗೆ ನೀಡಿ")}</span>
              </motion.button>
            </Link>

            {/* AUTH SECTION */}
            <AnimatePresence mode="wait">
              {user ? (
                <div className="group relative">
                  <motion.button
                    className="w-11 h-11 rounded-xl border border-white/10 p-0.5 overflow-hidden shadow-lg hover:border-brand-green transition-all"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="w-full h-full bg-zinc-800 text-brand-green flex items-center justify-center rounded-[10px]">
                      <User size={18} />
                    </div>
                  </motion.button>
                  <div className="absolute right-0 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible z-50 transition-all duration-200">
                    <div className="bg-zinc-950 border border-white/10 rounded-3xl shadow-2xl p-2 w-64 backdrop-blur-xl">
                      <div className="p-1 space-y-1">
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 text-red-500 hover:bg-red-500/10 rounded-2xl text-xs font-bold uppercase transition-all">
                          <LogOut size={14} /> Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <motion.button
                  onClick={() => setIsLoginOpen(true)}
                  className="bg-brand-green text-white px-8 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-brand-green/20 hover:brightness-110"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t("Join Now", "ಈಗಲೇ ಸೇರಿ")}
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="lg:hidden flex items-center gap-4">
            <button
              onClick={() => handleLanguageSwitch(lang === 'en' ? 'kn' : 'en')}
              className="text-[10px] font-black text-brand-green border border-brand-green/30 px-3 py-2 rounded-lg uppercase"
            >
              {lang === 'en' ? "ಕನ್ನಡ" : "EN"}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="p-3 text-brand-green bg-white/5 rounded-xl"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </motion.div>
      </nav>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </header>
  );
}