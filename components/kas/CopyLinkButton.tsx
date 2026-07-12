'use client';

import React, { useState } from 'react';
import { Link as LinkIcon, Check } from 'lucide-react';

export default function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <button 
      onClick={handleCopy}
      className="flex w-full justify-center items-center gap-3 px-6 py-5 bg-slate-800 hover:bg-slate-700 text-white font-bold uppercase tracking-widest rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all border border-slate-700"
    >
      {copied ? <Check className="w-6 h-6 text-green-400" /> : <LinkIcon className="w-6 h-6 text-blue-400" />}
      {copied ? 'Skopiowano!' : 'Skopiuj szybki link do udostępnienia'}
    </button>
  );
}
