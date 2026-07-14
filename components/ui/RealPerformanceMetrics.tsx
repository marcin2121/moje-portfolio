import React from 'react';
import { Smartphone, Zap, CheckCircle2 } from 'lucide-react';
import { fixOrphans } from '@/utils/typography';

export function RealPerformanceMetrics() {
  return (
    <div className="w-full max-w-6xl mx-auto px-6 mb-32 relative z-10">
      <div className="flex flex-col md:flex-row items-center gap-12 bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">

        {/* Lewa strona - Opis */}
        <div className="flex-1 space-y-6 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-widest border border-emerald-100">
            <Zap size={14} className="fill-emerald-600" /> Case Study: Sklep Urwis
          </div>
          <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Architektura klasy &quot;Top 1%&quot;
          </h3>
          <p className="text-slate-600 leading-relaxed font-light">
            {fixOrphans(`Twój system musi być szybki nie tylko u Ciebie w biurze na światłowodzie, ale przede wszystkim w pociągu, na starym smartfonie Twojego klienta. Poniżej twarde dane z systemów telemetrii Vercel Speed Insights (bazujące na realnych urządzeniach) dla jednego z wdrożonych przeze mnie projektów klienckich.`)}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
             <div className="flex items-center gap-2 text-sm text-slate-700 font-medium bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
                <CheckCircle2 size={16} className="text-emerald-500" /> Zerowe spadki (0 CLS)
             </div>
             <div className="flex items-center gap-2 text-sm text-slate-700 font-medium bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
                <Smartphone size={16} className="text-slate-500" /> Rzeczywiści użytkownicy (RUM)
             </div>
          </div>
        </div>

        {/* Prawa strona - Dashboard Liczb */}
        <div className="w-full md:w-1/2 lg:w-2/5 shrink-0 bg-slate-900 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[60px] rounded-full pointer-events-none" />

          <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
            <div className="text-slate-400 font-mono text-xs uppercase tracking-widest">Real Experience Score</div>
            <div className="text-emerald-400 text-3xl font-black">98<span className="text-slate-500 text-lg">/100</span></div>
          </div>

          <div className="grid grid-cols-2 gap-y-6 gap-x-4">
            <MetricItem label="First Contentful Paint" value="1.3 s" status="good" />
            <MetricItem label="Largest Contentful Paint" value="2.2 s" status="good" />
            <MetricItem label="Interaction to Next Paint" value="200 ms" status="good" />
            <MetricItem label="Time to First Byte" value="0.38 s" status="good" />
            <MetricItem label="First Input Delay" value="24 ms" status="good" />
            <MetricItem label="Cumulative Layout Shift" value="0" status="good" />
          </div>

          <div className="mt-8 text-[10px] text-slate-500 font-mono uppercase tracking-widest text-center border-t border-slate-800 pt-4">
            Dane zweryfikowane przez Vercel Speed Insights
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricItem({ label, value, status }: { label: string, value: string, status: 'good' | 'warn' }) {
  return (
    <div className="flex flex-col">
      <span className="text-slate-500 text-[10px] uppercase font-mono tracking-wider mb-1 line-clamp-1" title={label}>{label}</span>
      <span className={`text-lg font-bold font-mono tracking-tight ${status === 'good' ? 'text-white' : 'text-amber-400'}`}>
        {value}
      </span>
    </div>
  );
}
