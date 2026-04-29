import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/components/LanguageContext";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Suvarna karnataka Janashakthi Vedike",
  description: "Suvarna karnataka Janashakthi Vedike",
};

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
          /* Hide Google Translate UI elements */
          .goog-te-banner-frame, .skiptranslate, .goog-te-balloon-frame, #goog-gt-tt {
            display: none !important;
            visibility: hidden !important;
          }
          body { top: 0 !important; }
          .goog-text-highlight {
            background-color: transparent !important;
            box-shadow: none !important;
          }
        `}</style>
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LanguageProvider>
            {/* The single anchor for Google Translate */}
            <div id="google_translate_element" style={{ display: 'none' }}></div>
            {children}
          </LanguageProvider>
        </ThemeProvider>

        <Script id="google-translate-init" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'kn,en',
                autoDisplay: false
              }, 'google_translate_element');
            }
          `}
        </Script>
        <Script
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}