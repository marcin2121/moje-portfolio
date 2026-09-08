'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ExternalLink } from 'lucide-react';

export interface AuditEvidenceCardProps {
  title: string;
  description: string;
  status: 'ok' | 'warn' | 'bad' | 'info';
  percentage: number;
  metaText?: string;
  detailsLabel?: string;
  details?: {
    url?: string;
    label?: string;
    sublabel?: string;
  }[];
}

export default function AuditEvidenceCard({
  title,
  description,
  status,
  percentage,
  metaText,
  detailsLabel = 'Przykładowe adresy URL:',
  details = []
}: AuditEvidenceCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getStatusBorder = () => {
    switch (status) {
      case 'ok': return 'border-l-4 border-l-emerald-600 bg-white/70 border-slate-200/70';
      case 'warn': return 'border-l-4 border-l-amber-600 bg-amber-50/20 border-slate-200/70';
      case 'bad': return 'border-l-4 border-l-rose-600 bg-rose-50/20 border-slate-200/70';
      case 'info': return 'border-l-4 border-l-sky-600 bg-white/70 border-slate-200/70';
    }
  };

  const getBarColor = () => {
    switch (status) {
      case 'ok': return 'bg-emerald-600';
      case 'warn': return 'bg-amber-500';
      case 'bad': return 'bg-rose-600';
      case 'info': return 'bg-sky-500';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'ok': return <span className="text-emerald-600 text-sm font-black font-mono">✓</span>;
      case 'warn': return <span className="text-amber-600 text-sm font-black font-mono">!</span>;
      case 'bad': return <span className="text-rose-600 text-sm font-black font-mono">✕</span>;
      case 'info': return <span className="text-sky-600 text-sm font-black font-mono">i</span>;
    }
  };

  return (
    <div className={`p-5 rounded-2xl border transition-all ${getStatusBorder()} shadow-[0_4px_20px_rgba(0,0,0,0.02)]`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
            {getStatusIcon()}
          </div>
          <h4 className="font-bold text-slate-900 text-sm tracking-tight">{title}</h4>
        </div>
        {metaText && (
          <span className="font-mono text-xs text-slate-500 font-semibold shrink-0">
            {metaText}
          </span>
        )}
      </div>

      <p className="text-slate-600 text-xs leading-relaxed mb-3">
        {description}
      </p>

      {/* Pasek postępu */}
      <div className="w-full bg-slate-100 h-1.5 rounded-sm overflow-hidden mb-2">
        <motion.div
          className={`h-full ${getBarColor()}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
        <span>Zgodność</span>
        <span>{Math.round(percentage)}%</span>
      </div>

      {/* Rozwijana lista twardych dowodów */}
      {details.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 transition-colors"
          >
            <span>{isOpen ? 'Ukryj szczegóły' : `Pokaż szczegóły (${details.length})`}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-2.5 p-3 bg-slate-50/80 rounded-xl border border-slate-200/50 max-h-56 overflow-y-auto">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 font-mono">
                    {detailsLabel}
                  </p>
                  <ul className="divide-y divide-slate-200/50 text-xs font-mono">
                    {details.map((item, idx) => (
                      <li key={idx} className="py-1.5 flex flex-col gap-0.5">
                        {item.url ? (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-800 hover:text-orange-600 hover:underline break-all inline-flex items-center gap-1"
                          >
                            <span>{item.label || item.url}</span>
                            <ExternalLink className="w-3 h-3 shrink-0 opacity-50" />
                          </a>
                        ) : (
                          <span className="text-slate-800 break-all">{item.label}</span>
                        )}
                        {item.sublabel && (
                          <span className="text-[11px] text-slate-500">{item.sublabel}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
