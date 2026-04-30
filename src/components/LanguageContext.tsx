"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Define a strict interface for the context
interface LanguageContextType {
  lang: string;
  setLang: (lang: string) => void;
  t: (en: string, kn: string) => string; // explicitly set return to string
  autoTranslate: (text: string) => string;
}

// 2. Initialize with the interface to avoid the "" literal trap
const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: (en: string, kn: string) => en, 
  autoTranslate: (text: string) => text 
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const getCookie = (name: string) => {
      if (typeof document === 'undefined') return null;
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };

    const savedGoogleLang = getCookie('googtrans');
    if (savedGoogleLang?.includes('/kn')) {
      setLang('kn');
    }
  }, []);

  // 3. Explicitly type the return as string
  const t = (en: string, kn: string): string => (lang === 'en' ? en : kn);

  const autoTranslate = (text: string): string => text || "";

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, autoTranslate }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => useContext(LanguageContext);