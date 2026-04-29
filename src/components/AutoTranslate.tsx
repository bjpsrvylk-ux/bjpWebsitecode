// components/AutoTranslate.tsx
import { translateText } from '@/lib/translate'; // Your API caller

export default async function AutoTranslate({ children, targetLang }: { children: string, targetLang: string }) {
  // 1. Check Supabase first: "Does this sentence already have a Kannada version?"
  // 2. If not, call Google Translate API.
  // 3. Save result to Supabase for next time.
  const translatedText = await translateText(children, targetLang);

  return <span>{translatedText}</span>;
}