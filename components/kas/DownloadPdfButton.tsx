'use client';

import React from 'react';
import { Download, FileText } from 'lucide-react';

export default function DownloadPdfButton() {
  const handleDownload = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <button 
      onClick={handleDownload}
      className="flex w-full justify-center items-center gap-3 px-6 py-5 bg-orange-500 hover:bg-orange-600 text-white font-black uppercase tracking-widest rounded-2xl shadow-[0_0_40px_rgba(249,115,22,0.3)] hover:shadow-[0_0_60px_rgba(249,115,22,0.5)] hover:-translate-y-1 transition-all"
    >
      <FileText className="w-6 h-6" />
      Pobierz Ofertę PDF
      <Download className="w-5 h-5 ml-2" />
    </button>
  );
}
