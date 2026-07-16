import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowLeft, Linkedin } from 'lucide-react';
import type { Metadata } from 'next';
import MagneticWrapper from '@/components/ui/MagneticWrapper';

export const metadata: Metadata = {
  title: 'Wiadomość Wysłana | Marcin Molenda',
  description: 'Dziękuję za wiadomość. Odezwę się w ciągu 24 godzin.',
  robots: {
    index: false,
    follow: false,
  }
};

export default function SuccessPage() {
  return (
    <main className="min-h-screen w-full bg-slate-50 text-slate-900 font-sans relative flex flex-col items-center justify-center px-6 pt-24">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-size-[40px_40px] pointer-events-none" />
      
      <div className="relative z-10 max-w-2xl w-full bg-white rounded-[2rem] p-8 sm:p-16 flex flex-col items-center text-center shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-emerald-100">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-8 mx-auto ring-8 ring-emerald-50">
          <CheckCircle2 size={40} strokeWidth={2.5} />
        </div>
        
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4 text-slate-900">
          Sukces.
        </h1>
        
        <p className="text-slate-600 mb-10 max-w-md mx-auto leading-relaxed text-lg">
          Otrzymałem Twoje zapytanie. Przeanalizuję temat i odezwę się na podany adres e-mail w ciągu maksymalnie <strong>24 godzin</strong> z konkretami.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <MagneticWrapper>
            <Link 
              href="https://www.linkedin.com/in/marcin-molenda/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-[#0A66C2] text-white rounded-xl font-medium hover:bg-[#084e96] transition-colors w-full sm:w-auto shadow-lg shadow-blue-500/20"
            >
              <Linkedin size={20} />
              Złapmy się na LinkedIn
            </Link>
          </MagneticWrapper>
          
          <MagneticWrapper>
            <Link 
              href="/"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors w-full sm:w-auto"
            >
              <ArrowLeft size={18} />
              Wróć na stronę
            </Link>
          </MagneticWrapper>
        </div>
      </div>
    </main>
  );
}
