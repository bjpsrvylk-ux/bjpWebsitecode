"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext({
  lang: 'en',
  setLang: (lang: string) => {},
  t: (en: string, kn: string) => '',
  autoTranslate: (text: string) => text 
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    // Helper to read cookies
    const getCookie = (name: string) => {
      if (typeof document === 'undefined') return null;
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };

    // Check if Google is already translating to Kannada
    const savedGoogleLang = getCookie('googtrans');
    if (savedGoogleLang?.includes('/kn')) {
      setLang('kn');
    }
  }, []);

  // Manual fallback for specific static UI
  const t = (en: string, kn: string) => (lang === 'en' ? en : kn);

  // This is now just a pass-through because Google handles the DOM
  const autoTranslate = (text: string) => text || "";

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, autoTranslate }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => useContext(LanguageContext);