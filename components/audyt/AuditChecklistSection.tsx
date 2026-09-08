'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueryState } from 'nuqs';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Wrench,
  Search,
  Filter,
  ArrowUpRight,
  ShieldCheck,
  ShoppingBag,
  Zap,
  Smartphone,
  Layers,
  Sparkles
} from 'lucide-react';
import {
  CheckpointCategory,
  CheckpointEvaluation,
  CheckpointStats,
  MergedCheckpoint
} from '@/app/api/audit-master/types';
import { CHECKPOINTS_CATALOG } from '@/app/api/audit-master/utils/checkpointsCatalog';

interface AuditChecklistSectionProps {
  evaluations?: CheckpointEvaluation[];
  stats?: CheckpointStats;
  domain: string;
  siteType?: 'ecommerce' | 'services';
}

const CATEGORY_LABELS: Record<CheckpointCategory, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  tracking_ads: { label: 'Analityka & Ads', icon: Zap },
  ecommerce_cro: { label: 'E-Commerce & CRO', icon: ShoppingBag },
  seo_indexing: { label: 'SEO & Indeksacja', icon: Search },
  performance_vitals: { label: 'Wydajność & Vitals', icon: Sparkles },
  ux_mobile: { label: 'UX & Smartfony', icon: Smartphone },
  security_compliance: { label: 'Bezpieczeństwo & Prawo', icon: ShieldCheck }
};

export default function AuditChecklistSection({
  evaluations = [],
  stats,
  domain,
  siteType = 'services'
}: AuditChecklistSectionProps) {
  // Synchronizacja filtrów w URL za pomocą nuqs (łatwe udostępnianie klientom precyzyjnych widoków)
  const [selectedStatus, setSelectedStatus] = useQueryState('status', {
    defaultValue: 'all',
    shallow: true
  });
  const [selectedCategory, setSelectedCategory] = useQueryState('cat', {
    defaultValue: 'all',
    shallow: true
  });

  // Lokalny filtr wyszukiwania tekstowego
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Scalenie ewaluacji z bazą wiedzy (katalogiem 80 punktów)
  const mergedCheckpoints = useMemo<MergedCheckpoint[]>(() => {
    return Object.keys(CHECKPOINTS_CATALOG).map(id => {
      const def = CHECKPOINTS_CATALOG[id];
      const evaluation = evaluations.find(e => e.id === id);
      const status = evaluation ? evaluation.status : 'passed';
      const metric = evaluation?.metric;
      const evidence = evaluation?.evidence;
      const diagnosis = evaluation?.customDiagnosis
        || (status === 'passed' ? def.defaultDiagnosisPassed : def.defaultDiagnosisFailed);

      return {
        ...def,
        status,
        metric,
        evidence,
        diagnosis
      };
    });
  }, [evaluations]);

  // Dynamiczne przeliczenie statystyk jeśli nie zostały przekazane bezpośrednio
  const computedStats = useMemo(() => {
    if (stats) return stats;
    const total = mergedCheckpoints.length;
    const failed = mergedCheckpoints.filter(c => c.status === 'failed').length;
    const warning = mergedCheckpoints.filter(c => c.status === 'warning').length;
    const passed = mergedCheckpoints.filter(c => c.status === 'passed').length;
    const criticalLeaksCount = mergedCheckpoints.filter(c => c.status === 'failed' && c.severity === 'critical').length;
    return { total, failed, warning, passed, criticalLeaksCount };
  }, [mergedCheckpoints, stats]);

  // Filtrowanie listy
  const filteredCheckpoints = useMemo(() => {
    return mergedCheckpoints.filter(cp => {
      // Filtr statusu
      if (selectedStatus === 'failed' && cp.status !== 'failed') return false;
      if (selectedStatus === 'warning' && cp.status !== 'warning') return false;
      if (selectedStatus === 'passed' && cp.status !== 'passed') return false;

      // Filtr kategorii
      if (selectedCategory !== 'all' && cp.category !== selectedCategory) return false;

      // Szukajka tekstowa
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = cp.name.toLowerCase().includes(query);
        const matchesDiagnosis = cp.diagnosis.toLowerCase().includes(query);
        const matchesBenefit = cp.businessBenefit.toLowerCase().includes(query);
        const matchesImpact = cp.businessImpact.toLowerCase().includes(query);
        if (!matchesName && !matchesDiagnosis && !matchesBenefit && !matchesImpact) return false;
      }

      return true;
    });
  }, [mergedCheckpoints, selectedStatus, selectedCategory, searchQuery]);

  const scrollToConsultation = (issueTitle?: string) => {
    const el = document.getElementById('consultation-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    // Jeśli w formularzu jest pole tematu, można je opcjonalnie uzupełnić
    if (issueTitle) {
      const subjectInput = document.querySelector<HTMLInputElement>('input[name="subject"], input[name="topic"]');
      if (subjectInput) {
        subjectInput.value = `Zlecenie naprawy błędu: ${issueTitle}`;
      }
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <section className="bg-white/80 border border-slate-200/70 rounded-3xl p-6 md:p-10 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
      {/* Nagłówek Sekcji */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Layers className="w-5 h-5 text-indigo-600" />
          <span className="font-mono text-xs font-bold text-indigo-600 uppercase tracking-widest">
            Rejestr Kontrolny & Korzyści Biznesowe
          </span>
        </div>
        <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
          Kompleksowa inspekcja {computedStats.total} punktów kontrolnych
        </h3>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
          Pełny rejestr technicznych i biznesowych obszarów badanych w domenie <strong className="text-slate-900 font-semibold">{domain}</strong>.
          Każdy punkt zawiera twardą diagnozę w kodzie, ocenę strat, <strong className="text-indigo-700 font-semibold">bezpośrednią korzyść z naprawy (Twój zysk & ROI)</strong> oraz konkretny plan wdrożenia inżynieryjnego.
        </p>
      </div>

      {/* Bento Grid Statystyk */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <button
          type="button"
          onClick={() => setSelectedStatus('all')}
          className={`text-left p-4 md:p-5 rounded-2xl border transition-all cursor-pointer ${
            selectedStatus === 'all'
              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
              : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-50 text-slate-900'
          }`}
        >
          <span className={`font-mono text-xs uppercase tracking-wider block mb-1 ${selectedStatus === 'all' ? 'text-slate-300' : 'text-slate-500'}`}>
            Wszystkie testy
          </span>
          <span className="text-2xl md:text-3xl font-black font-mono">
            {computedStats.total}
          </span>
          <span className={`text-[11px] block mt-1 ${selectedStatus === 'all' ? 'text-slate-300' : 'text-slate-500'}`}>
            Inspekcja 360°
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedStatus('failed')}
          className={`text-left p-4 md:p-5 rounded-2xl border transition-all cursor-pointer ${
            selectedStatus === 'failed'
              ? 'bg-rose-900 text-white border-rose-900 shadow-sm'
              : 'bg-rose-50/50 border-rose-200/80 hover:bg-rose-50 text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className={`font-mono text-xs uppercase tracking-wider ${selectedStatus === 'failed' ? 'text-rose-200' : 'text-rose-700'}`}>
              Krytyczne błędy
            </span>
            <XCircle className={`w-4 h-4 ${selectedStatus === 'failed' ? 'text-rose-300' : 'text-rose-600'}`} />
          </div>
          <span className={`text-2xl md:text-3xl font-black font-mono ${selectedStatus === 'failed' ? 'text-white' : 'text-rose-600'}`}>
            {computedStats.failed}
          </span>
          <span className={`text-[11px] block mt-1 ${selectedStatus === 'failed' ? 'text-rose-200' : 'text-rose-600'}`}>
            Do natychmiastowej naprawy
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedStatus('warning')}
          className={`text-left p-4 md:p-5 rounded-2xl border transition-all cursor-pointer ${
            selectedStatus === 'warning'
              ? 'bg-amber-900 text-white border-amber-900 shadow-sm'
              : 'bg-amber-50/50 border-amber-200/80 hover:bg-amber-50 text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className={`font-mono text-xs uppercase tracking-wider ${selectedStatus === 'warning' ? 'text-amber-200' : 'text-amber-700'}`}>
              Wąskie gardła
            </span>
            <AlertTriangle className={`w-4 h-4 ${selectedStatus === 'warning' ? 'text-amber-300' : 'text-amber-600'}`} />
          </div>
          <span className={`text-2xl md:text-3xl font-black font-mono ${selectedStatus === 'warning' ? 'text-white' : 'text-amber-600'}`}>
            {computedStats.warning}
          </span>
          <span className={`text-[11px] block mt-1 ${selectedStatus === 'warning' ? 'text-amber-200' : 'text-amber-700'}`}>
            Ostrzeżenia i straty
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedStatus('passed')}
          className={`text-left p-4 md:p-5 rounded-2xl border transition-all cursor-pointer ${
            selectedStatus === 'passed'
              ? 'bg-emerald-900 text-white border-emerald-900 shadow-sm'
              : 'bg-emerald-50/50 border-emerald-200/80 hover:bg-emerald-50 text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className={`font-mono text-xs uppercase tracking-wider ${selectedStatus === 'passed' ? 'text-emerald-200' : 'text-emerald-700'}`}>
              Zaliczone
            </span>
            <CheckCircle2 className={`w-4 h-4 ${selectedStatus === 'passed' ? 'text-emerald-300' : 'text-emerald-600'}`} />
          </div>
          <span className={`text-2xl md:text-3xl font-black font-mono ${selectedStatus === 'passed' ? 'text-white' : 'text-emerald-600'}`}>
            {computedStats.passed}
          </span>
          <span className={`text-[11px] block mt-1 ${selectedStatus === 'passed' ? 'text-emerald-200' : 'text-emerald-700'}`}>
            Wzorowy standard
          </span>
        </button>
      </div>

      {/* Pasek Filtrów i Wyszukiwarki */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center pb-6 mb-6 border-b border-slate-200/70">
        {/* Filtry Kategorii */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            Wszystkie ({mergedCheckpoints.length})
          </button>
          {(Object.keys(CATEGORY_LABELS) as CheckpointCategory[]).map(catKey => {
            const cat = CATEGORY_LABELS[catKey];
            const Icon = cat.icon;
            const count = mergedCheckpoints.filter(c => c.category === catKey).length;
            const isCatSelected = selectedCategory === catKey;
            const tabLabel = (siteType === 'services' && catKey === 'ecommerce_cro') ? 'E-Commerce (Pominięto)' : cat.label;
            return (
              <button
                key={catKey}
                type="button"
                onClick={() => setSelectedCategory(catKey)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  isCatSelected
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tabLabel}</span>
                <span className={`text-[10px] font-mono px-1 rounded ${isCatSelected ? 'bg-slate-800 text-slate-300' : 'text-slate-400'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Wyszukiwarka na żywo */}
        <div className="relative min-w-[240px] md:min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Szukaj błędu, korzyści, ROI..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 text-slate-900 placeholder:text-slate-400 transition-all font-sans"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-mono cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Informacja o pominięciu E-Commerce dla profilu usługowego */}
      {siteType === 'services' && selectedCategory === 'ecommerce_cro' && (
        <div className="mb-4 p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 text-xs font-mono text-slate-600 flex items-center gap-2">
          <span>ℹ️ Wybrano profil <strong>Strona Firmowa / Usługi</strong>. Punkty specyficzne dla koszyka, wariantów i checkoutu sklepu internetowego zostały automatycznie oznaczone jako nie dotyczy.</span>
        </div>
      )}

      {/* Licznik aktywnych wyników */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-mono mb-4">
        <span>
          Wyświetlanie: <strong className="text-slate-800">{filteredCheckpoints.length}</strong> z {computedStats.total} punktów kontrolnych
        </span>
        {(selectedStatus !== 'all' || selectedCategory !== 'all' || searchQuery) && (
          <button
            type="button"
            onClick={() => {
              setSelectedStatus('all');
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="text-xs text-indigo-600 hover:underline font-semibold cursor-pointer"
          >
            Resetuj filtry
          </button>
        )}
      </div>

      {/* Lista Punktów Kontrolnych */}
      <div className="space-y-4">
        {filteredCheckpoints.length === 0 ? (
          <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-slate-200/60 p-8">
            <Filter className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">Brak punktów spełniających wybrane kryteria</p>
            <p className="text-xs text-slate-500 mt-1">Zmień filtr statusu lub wyczyść zapytanie wyszukiwania.</p>
          </div>
        ) : (
          filteredCheckpoints.map(cp => {
            const isExpanded = expandedId === cp.id;
            const isFailed = cp.status === 'failed';
            const isWarning = cp.status === 'warning';

            const statusBadgeBg = isFailed
              ? 'bg-rose-50 text-rose-800 border border-rose-200'
              : isWarning
                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200';

            const statusText = isFailed
              ? 'Do natychmiastowej naprawy'
              : isWarning
                ? 'Wąskie gardło / Ostrzeżenie'
                : 'Standard spełniony';

            return (
              <div
                key={cp.id}
                className={`rounded-2xl border transition-all p-5 md:p-6 ${
                  isFailed
                    ? 'bg-rose-50/20 border-rose-200/70 hover:border-rose-300'
                    : isWarning
                      ? 'bg-amber-50/20 border-amber-200/70 hover:border-amber-300'
                      : 'bg-slate-50/30 border-slate-200/70 hover:border-slate-300'
                }`}
              >
                {/* Górny Pasek: Kategoria + Status + Metryka */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      {CATEGORY_LABELS[cp.category]?.label || cp.category}
                    </span>
                    <span className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded-md tracking-wider ${statusBadgeBg}`}>
                      {statusText}
                    </span>
                  </div>

                  {cp.metric && (
                    <span className="font-mono text-xs text-slate-600 bg-white/80 border border-slate-200/80 px-2 py-0.5 rounded-md">
                      {cp.metric}
                    </span>
                  )}
                </div>

                {/* Tytuł i Diagnoza */}
                <h4 className="text-base md:text-lg font-bold text-slate-900 tracking-tight mb-1.5">
                  {cp.name}
                </h4>
                <p className="text-xs md:text-sm text-slate-600 mb-4 leading-relaxed">
                  {cp.diagnosis}
                </p>

                {/* Kluczowe Panele: Wpływ Biznesowy vs Korzyść z Naprawy (Twój zysk / ROI) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {/* Panel 1: Wpływ Błędu / Strata */}
                  <div className="bg-white/80 border border-slate-200/80 rounded-xl p-3.5 border-l-2 border-l-rose-500">
                    <div className="flex items-center gap-1.5 mb-1 text-rose-700 font-mono text-xs font-bold uppercase tracking-wider">
                      <TrendingDown className="w-3.5 h-3.5 shrink-0" />
                      <span>Co ryzykujesz / tracisz:</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {cp.businessImpact}
                    </p>
                  </div>

                  {/* Panel 2 (GŁÓWNY PUNKT): Bezpośrednia korzyść z naprawy (ROI & ZYSK) */}
                  <div className="bg-emerald-50/60 border border-emerald-200/70 rounded-xl p-3.5 border-l-2 border-l-emerald-600">
                    <div className="flex items-center gap-1.5 mb-1 text-emerald-800 font-mono text-xs font-bold uppercase tracking-wider">
                      <TrendingUp className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                      <span>Korzyść z naprawy (Twój zysk & ROI):</span>
                    </div>
                    <p className="text-xs text-slate-800 leading-relaxed font-medium">
                      {cp.businessBenefit}
                    </p>
                  </div>
                </div>

                {/* Panel 3: Plan inżynieryjny w 24–48h */}
                <div className="bg-slate-100/70 border border-slate-200/70 rounded-xl p-3.5 mb-3">
                  <div className="flex items-center gap-1.5 mb-1 text-slate-800 font-mono text-xs font-bold uppercase tracking-wider">
                    <Wrench className="w-3.5 h-3.5 shrink-0 text-slate-900" />
                    <span>Plan inżynieryjny w 24–48h:</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {cp.developerSolution}
                  </p>
                </div>

                {/* Dolny pasek: Akcja naprawy & Rozwijane dowody */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div>
                    {cp.evidence && cp.evidence.length > 0 && (
                      <button
                        type="button"
                        onClick={() => toggleExpand(cp.id)}
                        className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>{isExpanded ? 'Ukryj dowody' : `Pokaż powiązane adresy URL (${cp.evidence.length})`}</span>
                      </button>
                    )}
                  </div>

                  {/* Przycisk Zlecenia Naprawy jeśli błąd lub ostrzeżenie */}
                  {(isFailed || isWarning) && (
                    <button
                      type="button"
                      onClick={() => scrollToConsultation(cp.name)}
                      className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer ml-auto"
                    >
                      <span>Zleć naprawę tego punktu</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-300" />
                    </button>
                  )}
                </div>

                {/* Rozwijana lista dowodów URL */}
                <AnimatePresence>
                  {isExpanded && cp.evidence && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden mt-3"
                    >
                      <div className="p-3 bg-white/90 border border-slate-200/70 rounded-xl text-xs font-mono text-slate-700 max-h-48 overflow-y-auto">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Adresy powiązane z diagnozą:
                        </span>
                        <ul className="space-y-1">
                          {cp.evidence.map((url, idx) => (
                            <li key={idx} className="break-all">
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-indigo-600 hover:underline"
                              >
                                {url}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
