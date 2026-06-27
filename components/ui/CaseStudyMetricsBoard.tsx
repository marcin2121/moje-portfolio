import React from 'react';
import { motion } from 'framer-motion';
import { Gauge, HardDrive, Zap, TrendingUp, TrendingDown } from 'lucide-react';

interface MetricsProps {
  metricsBefore: { ttfbMs: number; lcpSeconds: number; bundleSizeKb: number };
  metricsAfter: { ttfbMs: number; lcpSeconds: number; bundleSizeKb: number };
}

export function CaseStudyMetricsBoard({ metricsBefore, metricsAfter }: MetricsProps) {
  const ttfbDiff = metricsBefore.ttfbMs - metricsAfter.ttfbMs;
  const lcpDiff = metricsBefore.lcpSeconds - metricsAfter.lcpSeconds;
  const bundleDiff = metricsBefore.bundleSizeKb - metricsAfter.bundleSizeKb;

  const ttfbPercent = Math.round((ttfbDiff / metricsBefore.ttfbMs) * 100);
  const lcpPercent = Math.round((lcpDiff / metricsBefore.lcpSeconds) * 100);
  const bundlePercent = Math.round((bundleDiff / metricsBefore.bundleSizeKb) * 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
      <MetricCard 
        title="Czas do Pierwszego Bajtu (TTFB)"
        icon={<Zap className="w-5 h-5 text-amber-500" />}
        before={`${metricsBefore.ttfbMs} ms`}
        after={`${metricsAfter.ttfbMs} ms`}
        percent={ttfbPercent}
      />
      <MetricCard 
        title="Wyrenderowanie Treści (LCP)"
        icon={<Gauge className="w-5 h-5 text-blue-500" />}
        before={`${metricsBefore.lcpSeconds} s`}
        after={`${metricsAfter.lcpSeconds} s`}
        percent={lcpPercent}
      />
      <MetricCard 
        title="Początkowy Rozmiar JS"
        icon={<HardDrive className="w-5 h-5 text-emerald-500" />}
        before={`${metricsBefore.bundleSizeKb} KB`}
        after={`${metricsAfter.bundleSizeKb} KB`}
        percent={bundlePercent}
      />
    </div>
  );
}

function MetricCard({ title, icon, before, after, percent }: { title: string, icon: React.ReactNode, before: string, after: string, percent: number }) {
  const isPositive = percent > 0;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="p-6 rounded-2xl bg-zinc-900/50 backdrop-blur-xl border border-white/10 shadow-2xl"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-zinc-950 border border-white/5 shadow-sm">
          {icon}
        </div>
        <h4 className="font-semibold text-white">{title}</h4>
      </div>
      
      <div className="flex justify-between items-end mb-4">
        <div>
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Przed</p>
          <p className="text-xl font-medium text-zinc-600 line-through decoration-zinc-700">{before}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Po</p>
          <p className="text-2xl font-bold text-white">{after}</p>
        </div>
      </div>
      
      <div className={`mt-4 pt-4 border-t border-white/5 flex items-center justify-between ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
        <span className="text-sm font-medium">Zysk z Optymalizacji</span>
        <div className="flex items-center gap-1.5 font-bold">
          {isPositive ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
          <span>{Math.abs(percent)}%</span>
        </div>
      </div>
    </motion.div>
  );
}
