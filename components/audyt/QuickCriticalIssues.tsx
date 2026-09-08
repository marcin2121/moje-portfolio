'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ExternalLink, TrendingDown, Wrench, AlertOctagon } from 'lucide-react';
import { QuickCriticalIssue } from '@/app/api/audit-master/types';

interface QuickCriticalIssuesProps {
  issues: QuickCriticalIssue[];
}

export default function QuickCriticalIssues({ issues }: QuickCriticalIssuesProps) {
  const [openDrawerId, setOpenDrawerId] = useState<string | null>(null);

  if (!issues || issues.length === 0) return null;

  const toggleDrawer = (id: string) => {
    setOpenDrawerId(prev => (prev === id ? null : id));
  };

  const getSeverityStyle = (severity: 'critical' | 'warning') => {
    if (severity === 'critical') {
      return {
        tag: 'border border-rose-200/80 bg-rose-50/70 text-rose-700',
        label: 'Krytyczny wyciek / błąd',
        accentBar: 'border-l-4 border-l-rose-600'
      };
    }
    return {
      tag: 'border border-amber-200/80 bg-amber-50/70 text-amber-700',
      label: 'Wąskie gardło',
      accentBar: 'border-l-4 border-l-amber-500'
    };
  };

  return (
    <div className="bg-white/80 border border-slate-200/70 rounded-3xl p-6 md:p-10 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <AlertOctagon className="w-5 h-5 text-rose-600" />
          <span className="font-mono text-xs font-bold text-rose-600 uppercase tracking-widest">
            Szybka diagnoza krytyczna
          </span>
        </div>
        <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
          Co natychmiast blokuje Twój zysk i pozycje?
        </h3>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Oto {issues.length} najważniejsze techniczne bariery wyekstrahowane z kodu i analityki. Zamiast czekać miesiącami na agencyjne raporty, te elementy możesz wyeliminować od ręki.
        </p>
      </div>

      <div className="space-y-6">
        {issues.map((issue) => {
          const isOpen = openDrawerId === issue.id;
          const cleanTitle = issue.title.replace(/\b1 grup\b/g, '1 grupa');
          const cleanShortDesc = issue.shortDesc.replace(/(\d+)\s+podstron\s+posiada/g, (m, p1) => {
            const n = parseInt(p1, 10);
            if (n >= 2 && n <= 4) return `${n} podstrony posiadają`;
            if (n === 1) return `1 podstrona posiada`;
            return m;
          });
          const cleanDeveloperAction = issue.developerAction
            .replace(/^Marcin zaimplementuje/i, 'Zaimplementuję')
            .replace(/^Marcin wdroży/i, 'Wdrożę')
            .replace(/^Marcin wprowadzi/i, 'Wprowadzę')
            .replace(/^Marcin skonfiguruje/i, 'Skonfiguruję')
            .replace(/^Marcin podepnie/i, 'Podepnę')
            .replace(/^Marcin przeprowadzi/i, 'Przeprowadzę')
            .replace(/\bMarcin zaimplementuje\b/g, 'zaimplementuję')
            .replace(/\bMarcin wdroży\b/g, 'wdrożę')
            .replace(/\bMarcin wprowadzi\b/g, 'wprowadzę')
            .replace(/\bMarcin skonfiguruje\b/g, 'skonfiguruję')
            .replace(/\bMarcin podepnie\b/g, 'podepnę')
            .replace(/\bMarcin przeprowadzi\b/g, 'przeprowadzę');

          const affectedText = issue.affectedCount === 1
            ? '1 podstrona'
            : (issue.affectedCount && issue.affectedCount >= 2 && issue.affectedCount <= 4)
              ? `${issue.affectedCount} podstrony`
              : `${issue.affectedCount} podstron`;

          return (
            <div
              key={issue.id}
              className="p-6 md:p-8 rounded-2xl border border-slate-200/80 bg-slate-50/40 hover:bg-slate-50/70 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className={`font-mono text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                    issue.severity === 'critical'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {issue.severity === 'critical' ? 'Krytyczny wyciek / błąd' : 'Wąskie gardło'}
                  </span>
                  {issue.affectedCount !== undefined && (
                    <span className="font-mono text-xs text-slate-500">
                      Dotyczy: <strong className="text-slate-800">{affectedText}</strong>
                    </span>
                  )}
                </div>
              </div>

              <h4 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight mb-2">
                {cleanTitle}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 mb-5 leading-relaxed">
                {cleanShortDesc}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <div className="bg-rose-50/50 border border-rose-200/60 rounded-xl p-4 border-l-2 border-l-rose-600">
                  <div className="flex items-center gap-2 mb-1.5">
                    <TrendingDown className="w-4 h-4 text-rose-600 shrink-0" />
                    <span className="font-mono text-xs font-bold text-rose-900 uppercase tracking-wider">
                      Co tracisz (Wpływ biznesowy):
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {issue.businessImpact}
                  </p>
                </div>

                <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-4 border-l-2 border-l-slate-900">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Wrench className="w-4 h-4 text-slate-900 shrink-0" />
                    <span className="font-mono text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Co dla Ciebie wdrożę:
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {cleanDeveloperAction}
                  </p>
                </div>
              </div>

              {issue.details && issue.details.length > 0 && (
                <div className="pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => toggleDrawer(issue.id)}
                    className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>
                      {isOpen ? 'Ukryj dowody techniczne' : `Pokaż dowody techniczne i adresy URL (${issue.details.length})`}
                    </span>
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
                        <div className="mt-3 p-4 bg-slate-50/90 rounded-xl border border-slate-200/60 max-h-60 overflow-y-auto">
                          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 font-mono">
                            Zarejestrowane dowody w kodzie:
                          </p>
                          <ul className="divide-y divide-slate-200/50 text-xs font-mono">
                            {issue.details.map((detail, idx) => (
                              <li key={idx} className="py-2 flex flex-col gap-0.5">
                                {detail.url ? (
                                  <a
                                    href={detail.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-slate-800 hover:text-orange-600 hover:underline break-all inline-flex items-center gap-1"
                                  >
                                    <span>{detail.label || detail.url}</span>
                                    <ExternalLink className="w-3 h-3 shrink-0 opacity-50" />
                                  </a>
                                ) : (
                                  <span className="text-slate-800 break-all font-medium">
                                    {detail.label}
                                  </span>
                                )}
                                {detail.sublabel && (
                                  <span className="text-[11px] text-slate-500">
                                    {detail.sublabel}
                                  </span>
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
        })}
      </div>
    </div>
  );
}