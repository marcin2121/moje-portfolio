import React from 'react';
import DownloadPdfButton from '@/components/kas/DownloadPdfButton';
import CopyLinkButton from '@/components/kas/CopyLinkButton';

export default function KasContactSection() {
  return (
    <section id="pdf" className="px-6 md:px-12 lg:px-24 max-w-[90rem] mx-auto text-center">
      <div className="bg-slate-900 text-white rounded-[3rem] p-12 md:p-20 relative overflow-hidden flex flex-col items-center">
        
        <p className="text-slate-400 text-lg md:text-xl mb-10 max-w-3xl mx-auto relative z-10 leading-relaxed">
          Jeśli chcą Państwo po prostu skonsultować techniczne aspekty działania czatu lub kalendarza - czekam na wiadomość. Szanuję Państwa czas: jeśli ten projekt nie jest teraz priorytetem, krótka informacja zwrotna (nawet jedno zdanie) będzie dla mnie niezwykle pomocna.
        </p>
        
        <div className="relative z-10 mb-16 w-full px-2">
          <a href="mailto:kontakt@molendadevelopment.pl" className="block text-2xl sm:text-3xl md:text-5xl font-black text-white hover:text-blue-400 transition-colors break-all">
            kontakt@molendadevelopment.pl
          </a>
        </div>
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
          {/* PDF Button */}
          <div className="flex flex-col items-center">
            <DownloadPdfButton />
            <p className="mt-4 text-sm text-slate-400 max-w-sm text-center">
              Dedykowany, czysty dokument sformatowany do druku A4 - idealny do rozdania na fizycznym spotkaniu decydentów
            </p>
          </div>

          {/* Copy Link Button */}
          <div className="flex flex-col items-center">
            <CopyLinkButton />
            <p className="mt-4 text-sm text-slate-400 max-w-sm text-center">
              Skopiuj bezpośredni odnośnik do tej podstrony
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
