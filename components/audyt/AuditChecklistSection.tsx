'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueryState } from 'nuqs';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
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
  MergedCheckpoint,
  SiteType,
  SITE_TYPE_LABELS
} from '@/app/api/audit-master/types';
import { CHECKPOINTS_CATALOG } from '@/app/api/audit-master/utils/checkpointsCatalog';

interface AuditChecklistSectionProps {
  evaluations?: CheckpointEvaluation[];
  stats?: CheckpointStats;
  domain: string;
  siteType?: SiteType;
}

const CATEGORY_LABELS: Record<CheckpointCategory, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  tracking_ads: { label: 'Analityka & Ads', icon: Zap },
  ecommerce_cro: { label: 'E-Commerce & CRO', icon: ShoppingBag },
  seo_indexing: { label: 'SEO & Indeksacja', icon: Search },
  performance_vitals: { label: 'Wydajność & Vitals', icon: Sparkles },
  ux_mobile: { label: 'UX & Smartfony', icon: Smartphone },
  security_compliance: { label: 'Bezpieczeństwo & Prawo', icon: ShieldCheck }
};

/**
 * Formatowanie rekomendacji inżynieryjnych:
 * Konwersja czasowników 1. osoby na rzeczowniki odczasownikowe (styl architektoniczny),
 * usunięcie obietnic czasowych "w 24h" i normalizacja znaków interpunkcyjnych.
 */
export function formatEngineeringRecommendation(text?: string): string {
  if (!text) return '';
  let clean = text
    .replace(/\s*(?:w|w ciągu)\s*24[-–—]?48h\.?/gi, '.')
    .replace(/\s*(?:w|w ciągu)\s*24h\.?/gi, '.')
    .replace(/\s*(?:w|w ciągu)\s*48h\.?/gi, '.')
    .replace(/^Wdrożę darmowy, w 100% zgodny z RODO skrypt Microsoft Clarity/i, 'Wdrożenie darmowego, w 100% zgodnego z RODO skryptu Microsoft Clarity')
    .replace(/^Wdrożę precyzyjne wywołanie/i, 'Wdrożenie precyzyjnego wywołania')
    .replace(/^Wdrożę automatyczny dispatch/i, 'Wdrożenie automatycznego dispatchu')
    .replace(/^Wdrożę zoptymalizowany asynchroniczny/i, 'Wdrożenie zoptymalizowanego asynchronicznego')
    .replace(/^Wdrożę automatyczny, lekki moduł/i, 'Wdrożenie automatycznego, lekkiego modułu')
    .replace(/^Wdrożę poprawny kod/i, 'Wdrożenie poprawnego kodu')
    .replace(/^Wdrożę interaktywny widżet/i, 'Wdrożenie interaktywnego widżetu')
    .replace(/^Wdrożę przejrzystą sekcję/i, 'Wdrożenie przejrzystej sekcji')
    .replace(/^Wdrożę automatyczny fallback/i, 'Wdrożenie automatycznego fallbacku')
    .replace(/^Wdrożę dynamiczny generator/i, 'Wdrożenie dynamicznego generatora')
    .replace(/^Wdrożę automatyczne generowanie/i, 'Wdrożenie automatycznego generowania')
    .replace(/^Wdrożę zautomatyzowane moduły/i, 'Wdrożenie zautomatyzowanych modułów')
    .replace(/^Wdrożę pełne mikrodane/i, 'Wdrożenie pełnych mikrodanych')
    .replace(/^Wdrożę edge caching/i, 'Wdrożenie edge cachingu')
    .replace(/^Wdrożę natywny atrybut/i, 'Wdrożenie natywnego atrybutu')
    .replace(/^Wdrożę automatyczną konwersję/i, 'Wdrożenie automatycznej konwersji')
    .replace(/^Wdrożę preload/i, 'Wdrożenie preloadu')
    .replace(/^Wdrożę i skonfiguruję/i, 'Wdrożenie i konfiguracja')
    .replace(/^Wdrożę listener/i, 'Wdrożenie listenera')
    .replace(/^Wdrożę nowoczesne, lekkie menu/i, 'Wdrożenie nowoczesnego, lekkiego menu')
    .replace(/^Wdrożę kontrastowy, elegancki/i, 'Wdrożenie kontrastowego, eleganckiego')
    .replace(/^Wdrożę nagłówek/i, 'Wdrożenie nagłówka')
    .replace(/^Wdrożę reguły/i, 'Wdrożenie reguł')
    .replace(/^Wdrożę zgodną/i, 'Wdrożenie zgodnej')
    .replace(/^Wdrożę\s+/i, 'Wdrożenie ')
    .replace(/^Zaimplementuję zdarzenie/i, 'Implementacja zdarzenia')
    .replace(/^Zaimplementuję ustandaryzowaną/i, 'Implementacja ustandaryzowanej')
    .replace(/^Zaimplementuję skrypt/i, 'Implementacja skryptu')
    .replace(/^Zaimplementuję automatyczny tracker/i, 'Implementacja automatycznego trackera')
    .replace(/^Zaimplementuję szybki komponent/i, 'Implementacja szybkiego komponentu')
    .replace(/^Zaimplementuję dynamiczny pasek/i, 'Implementacja dynamicznego paska')
    .replace(/^Zaimplementuję dynamiczny znacznik/i, 'Implementacja dynamicznego znacznika')
    .replace(/^Zaimplementuję automatyczne reguły/i, 'Implementacja automatycznych reguł')
    .replace(/^Zaimplementuję\s+/i, 'Implementacja ')
    .replace(/^Skonfiguruję certyfikowaną/i, 'Konfiguracja certyfikowanej')
    .replace(/^Skonfiguruję TikTok Pixel/i, 'Konfiguracja TikTok Pixela')
    .replace(/^Skonfiguruję mapę przekierowań/i, 'Konfiguracja mapy przekierowań')
    .replace(/^Skonfiguruję wzorcowy plik/i, 'Konfiguracja wzorcowego pliku')
    .replace(/^Skonfiguruję inline critical CSS/i, 'Konfiguracja inline critical CSS')
    .replace(/^Skonfiguruję nagłówek/i, 'Konfiguracja nagłówka')
    .replace(/^Skonfiguruję skalibrowaną/i, 'Konfiguracja skalibrowanej')
    .replace(/^Skonfiguruję\s+/i, 'Konfiguracja ')
    .replace(/^Zoptymalizuję zapytania SQL/i, 'Optymalizacja zapytań SQL')
    .replace(/^Zoptymalizuję\s+/i, 'Optymalizacja ')
    .replace(/^Podepnę i skonfiguruję/i, 'Podpięcie i konfiguracja')
    .replace(/^Podepnę wywołanie/i, 'Podpięcie wywołania')
    .replace(/^Podepnę aktywne linki/i, 'Podpięcie aktywnych linków')
    .replace(/^Podepnę\s+/i, 'Podpięcie ')
    .replace(/^Przeprowadzę kompleksową naprawę/i, 'Kompleksowa naprawa')
    .replace(/^Przeprowadzę refaktoryzację/i, 'Refaktoryzacja')
    .replace(/^Przeprowadzę\s+/i, 'Przeprowadzenie ')
    .replace(/^Zintegruję bramkę/i, 'Integracja bramki')
    .replace(/^Zintegruję niewidoczną/i, 'Integracja niewidocznej')
    .replace(/^Zintegruję\s+/i, 'Integracja ')
    .replace(/^Rozszerzę schemat/i, 'Rozszerzenie schematu')
    .replace(/^Rozszerzę\s+/i, 'Rozszerzenie ')
    .replace(/^Dodam automatyczną flagę/i, 'Dodanie automatycznej flagi')
    .replace(/^Dodam atrybuty/i, 'Dodanie atrybutów')
    .replace(/^Dodam zoptymalizowany tag/i, 'Dodanie zoptymalizowanego tagu')
    .replace(/^Dodam nagłówek/i, 'Dodanie nagłówka')
    .replace(/^Dodam bezpośrednie odnośniki/i, 'Dodanie bezpośrednich odnośników')
    .replace(/^Dodam\s+/i, 'Dodanie ')
    .replace(/^Przebuduję przyciski/i, 'Przebudowa przycisków')
    .replace(/^Przebuduję\s+/i, 'Przebudowa ')
    .replace(/^Zaprojektuję elegancki/i, 'Wdrożenie eleganckiego')
    .replace(/^Zaprojektuję\s+/i, 'Wdrożenie ')
    .replace(/^Zaktualizuję wewnętrzną strukturę/i, 'Aktualizacja wewnętrznej struktury')
    .replace(/^Zaktualizuję\s+/i, 'Aktualizacja ')
    .replace(/^Dostosuję formułę/i, 'Dostosowanie formuły')
    .replace(/^Dostosuję skalę/i, 'Dostosowanie skali')
    .replace(/^Dostosuję\s+/i, 'Dostosowanie ')
    .replace(/^Skalibruję długość/i, 'Kalibracja długości')
    .replace(/^Skalibruję minimalne strefy/i, 'Kalibracja minimalnych stref')
    .replace(/^Skalibruję\s+/i, 'Kalibracja ')
    .replace(/^Wprowadzę automatyczny nagłówek/i, 'Wprowadzenie automatycznego nagłówka')
    .replace(/^Wprowadzę\s+/i, 'Wprowadzenie ')
    .replace(/^Przekształcę nadmiarowe tagi/i, 'Przekształcenie nadmiarowych tagów')
    .replace(/^Przekształcę wszystkie numery/i, 'Przekształcenie numerów')
    .replace(/^Przekształcę\s+/i, 'Przekształcenie ')
    .replace(/^Uporządkuję logikę/i, 'Uporządkowanie logiki')
    .replace(/^Uporządkuję\s+/i, 'Uporządkowanie ')
    .replace(/^Usunę blokady noindex/i, 'Usunięcie blokad noindex')
    .replace(/^Usunę tag generator/i, 'Usunięcie tagu generator')
    .replace(/^Usunę\s+/i, 'Usunięcie ')
    .replace(/^Rozbuduję strukturę/i, 'Rozbudowa struktury')
    .replace(/^Rozbuduję\s+/i, 'Rozbudowa ')
    .replace(/^Zastąpię generyczne etykiety/i, 'Zastąpienie generycznych etykiet')
    .replace(/^Zastąpię leciwe skrypty/i, 'Zastąpienie biblioteki')
    .replace(/^Zastąpię\s+/i, 'Zastąpienie ')
    .replace(/^Odchudzę strukturę HTML/i, 'Odchudzenie struktury HTML')
    .replace(/^Odchudzę\s+/i, 'Optymalizacja ')
    .replace(/^Oferuję stopniową migrację/i, 'Stopniowa migracja')
    .replace(/^Wyekstrahuję powtarzalne style/i, 'Ekstrakcja powtarzalnych stylów')
    .replace(/^Wyekstrahuję\s+/i, 'Ekstrakcja ')
    .replace(/^Uzupełnię wymiary/i, 'Uzupełnienie wymiarów')
    .replace(/^Uzupełnię stopkę/i, 'Uzupełnienie stopki')
    .replace(/^Uzupełnię\s+/i, 'Uzupełnienie ')
    .replace(/^Przygotuję pakiet ikon/i, 'Wdrożenie pakietu ikon')
    .replace(/^Przygotuję\s+/i, 'Przygotowanie ')
    .replace(/^Wymuszę automatyczne przekierowanie/i, 'Wymuszenie automatycznego przekierowania')
    .replace(/^Wymuszę\s+/i, 'Wymuszenie ')
    .replace(/–/g, '-')
    .replace(/—/g, '-');

  clean = clean.trim();
  if (!clean.endsWith('.')) {
    clean += '.';
  }
  return clean;
}

/**
 * Waga priorytetu sortowania punktów kontrolnych:
 * 1. Błędy krytyczne (failed + critical) - waga 500
 * 2. Pozostałe błędy (failed) - waga 400
 * 3. Ostrzeżenia krytyczne (warning + critical) - waga 300
 * 4. Pozostałe ostrzeżenia (warning) - waga 200
 * 5. Zaliczone testy (passed) - waga 100
 */
function getCheckpointRank(cp: MergedCheckpoint): number {
  if (cp.status === 'failed') {
    return cp.severity === 'critical' ? 500 : 400;
  }
  if (cp.status === 'warning') {
    return cp.severity === 'critical' ? 300 : 200;
  }
  return 100;
}

export default function AuditChecklistSection({
  evaluations = [],
  stats,
  domain,
  siteType = 'services'
}: AuditChecklistSectionProps) {
  // Synchronizacja filtrów w URL za pomocą nuqs (domyślnie pokazujemy tylko kwestie wymagające uwagi)
  const [selectedStatus, setSelectedStatus] = useQueryState('status', {
    defaultValue: 'issues',
    shallow: true
  });
  const [selectedCategory, setSelectedCategory] = useQueryState('cat', {
    defaultValue: 'all',
    shallow: true
  });

  // Lokalny filtr wyszukiwania tekstowego
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Automatyczny reset filtru kategorii, gdy witryna nie-ecommerce ma w URL wybrane ecommerce_cro
  useEffect(() => {
    if (siteType !== 'ecommerce' && selectedCategory === 'ecommerce_cro') {
      setSelectedCategory('all');
    }
  }, [siteType, selectedCategory, setSelectedCategory]);

  // Scalenie ewaluacji z bazą wiedzy z inteligentną filtracją profilu biznesowego
  const mergedCheckpoints = useMemo<MergedCheckpoint[]>(() => {
    return Object.keys(CHECKPOINTS_CATALOG)
      .filter(id => {
        const def = CHECKPOINTS_CATALOG[id];
        const evaluation = (evaluations || []).find(e => e.id === id);

        // 1. Zawsze odrzuć jeśli ewaluacja wprost stwierdza "Nie dotyczy"
        if (evaluation?.metric?.toLowerCase().includes('nie dotyczy')) {
          return false;
        }

        // 2. Jeśli profil to nie e-commerce (usługi, B2B, urząd, szkoła, NGO):
        if (siteType !== 'ecommerce') {
          // Całkowite wykluczenie modułów koszykowych / e-commerce
          if (def.category === 'ecommerce_cro') {
            return false;
          }
          // Wykluczenie e-commerce specyficznych trackingów (add_to_cart, purchase, view_item)
          if (['track-add-to-cart', 'track-purchase', 'track-view-item'].includes(id)) {
            // Ukryj jeśli brak ewaluacji lub ewaluacja mówi o braku koszyka/reklam
            if (
              !evaluation ||
              evaluation.metric?.toLowerCase().includes('brak reklam') ||
              evaluation.metric?.toLowerCase().includes('brak transakcji') ||
              evaluation.metric?.toLowerCase().includes('brak katalogu') ||
              evaluation.metric?.toLowerCase().includes('brak koszyka')
            ) {
              return false;
            }
          }
        }

        return true;
      })
      .map(id => {
        const def = CHECKPOINTS_CATALOG[id];
        const evaluation = (evaluations || []).find(e => e.id === id);
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
  }, [evaluations, siteType]);

  // Dynamiczne przeliczenie statystyk ściśle na podstawie zakwalifikowanych punktów
  const computedStats = useMemo(() => {
    if (stats && stats.total === mergedCheckpoints.length) {
      return stats;
    }
    const total = mergedCheckpoints.length;
    const failed = mergedCheckpoints.filter(c => c.status === 'failed').length;
    const warning = mergedCheckpoints.filter(c => c.status === 'warning').length;
    const passed = mergedCheckpoints.filter(c => c.status === 'passed').length;
    const criticalLeaksCount = mergedCheckpoints.filter(c => c.status === 'failed' && c.severity === 'critical').length;
    return { total, failed, warning, passed, criticalLeaksCount };
  }, [mergedCheckpoints, stats]);

  const issuesCount = computedStats.failed + computedStats.warning;

  // Filtrowanie listy z priorytetyzacją wag i hierarchią ważności (błędy krytyczne zawsze na początku)
  const filteredCheckpoints = useMemo(() => {
    return mergedCheckpoints
      .filter(cp => {
        // Filtr statusu: 'issues' filtruje failed i warning
        if (selectedStatus === 'issues') {
          if (cp.status !== 'failed' && cp.status !== 'warning') return false;
        } else if (selectedStatus === 'failed') {
          if (cp.status !== 'failed') return false;
        } else if (selectedStatus === 'warning') {
          if (cp.status !== 'warning') return false;
        } else if (selectedStatus === 'passed') {
          if (cp.status !== 'passed') return false;
        }

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
      })
      .sort((a, b) => {
        const rankDiff = getCheckpointRank(b) - getCheckpointRank(a);
        if (rankDiff !== 0) return rankDiff;
        return a.name.localeCompare(b.name, 'pl');
      });
  }, [mergedCheckpoints, selectedStatus, selectedCategory, searchQuery]);

  const scrollToConsultation = (issueTitle?: string) => {
    if (typeof window !== 'undefined') {
      if (issueTitle) {
        window.dispatchEvent(
          new CustomEvent('select-consultation-topic', {
            detail: { topic: issueTitle }
          })
        );
      }
      const el = document.getElementById('consultation-form');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
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
        <div className="flex flex-wrap items-center gap-2.5 mb-2">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <span className="font-mono text-xs font-bold text-indigo-600 uppercase tracking-widest">
              Rejestr Kontrolny Architektury i Kodu
            </span>
          </div>
          <span className="font-mono text-[11px] font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200/80">
            {SITE_TYPE_LABELS[siteType] ? `Profil: ${SITE_TYPE_LABELS[siteType]}` : (siteType === 'ecommerce' ? 'Profil: E-Commerce & Sklep' : 'Profil: Usługi / B2B')}
          </span>
        </div>
        <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
          Kompleksowa inspekcja {computedStats.total} punktów kontrolnych
        </h3>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
          Szczegółowy przegląd badanych obszarów technicznych w domenie <strong className="text-slate-900 font-semibold">{domain}</strong>.
          Poniżej wyodrębniono obszary wymagające optymalizacji oraz zweryfikowano spełnione standardy jakości.
        </p>
      </div>

      {/* Bento Grid Statystyk */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <button
          type="button"
          onClick={() => setSelectedStatus('issues')}
          className={`text-left p-4 md:p-5 rounded-2xl border transition-all cursor-pointer ${
            selectedStatus === 'issues'
              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
              : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-50 text-slate-900'
          }`}
        >
          <span className="flex items-center justify-between mb-1">
            <span className={`font-mono text-xs uppercase tracking-wider ${selectedStatus === 'issues' ? 'text-slate-300' : 'text-slate-500'}`}>
              Wymagające uwagi
            </span>
            <AlertTriangle className={`w-4 h-4 ${selectedStatus === 'issues' ? 'text-amber-400' : 'text-slate-500'}`} />
          </span>
          <span className="text-2xl md:text-3xl font-black font-mono">
            {issuesCount}
          </span>
          <span className={`text-[11px] block mt-1 ${selectedStatus === 'issues' ? 'text-slate-300' : 'text-slate-500'}`}>
            Błędy i zalecenia
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
          <span className="flex items-center justify-between mb-1">
            <span className={`font-mono text-xs uppercase tracking-wider ${selectedStatus === 'failed' ? 'text-rose-200' : 'text-rose-700'}`}>
              Błędy w kodzie
            </span>
            <XCircle className={`w-4 h-4 ${selectedStatus === 'failed' ? 'text-rose-300' : 'text-rose-600'}`} />
          </span>
          <span className={`text-2xl md:text-3xl font-black font-mono ${selectedStatus === 'failed' ? 'text-white' : 'text-rose-600'}`}>
            {computedStats.failed}
          </span>
          <span className={`text-[11px] block mt-1 ${selectedStatus === 'failed' ? 'text-rose-200' : 'text-rose-600'}`}>
            Wymaga poprawy
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
          <span className="flex items-center justify-between mb-1">
            <span className={`font-mono text-xs uppercase tracking-wider ${selectedStatus === 'warning' ? 'text-amber-200' : 'text-amber-700'}`}>
              Optymalizacje
            </span>
            <AlertTriangle className={`w-4 h-4 ${selectedStatus === 'warning' ? 'text-amber-300' : 'text-amber-600'}`} />
          </span>
          <span className={`text-2xl md:text-3xl font-black font-mono ${selectedStatus === 'warning' ? 'text-white' : 'text-amber-600'}`}>
            {computedStats.warning}
          </span>
          <span className={`text-[11px] block mt-1 ${selectedStatus === 'warning' ? 'text-amber-200' : 'text-amber-700'}`}>
            Zalecana uwaga
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
          <span className="flex items-center justify-between mb-1">
            <span className={`font-mono text-xs uppercase tracking-wider ${selectedStatus === 'passed' ? 'text-emerald-200' : 'text-emerald-700'}`}>
              Zaliczone
            </span>
            <CheckCircle2 className={`w-4 h-4 ${selectedStatus === 'passed' ? 'text-emerald-300' : 'text-emerald-600'}`} />
          </span>
          <span className={`text-2xl md:text-3xl font-black font-mono ${selectedStatus === 'passed' ? 'text-white' : 'text-emerald-600'}`}>
            {computedStats.passed}
          </span>
          <span className={`text-[11px] block mt-1 ${selectedStatus === 'passed' ? 'text-emerald-200' : 'text-emerald-700'}`}>
            Zgodne ze standardem
          </span>
        </button>
      </div>

      {/* Pasek Filtrów i Wyszukiwarki */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center pb-6 mb-6 border-b border-slate-200/70">
        {/* Filtry Kategorii */}
        <div className="relative -mx-2 px-2 lg:mx-0 lg:px-0">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none scroll-smooth pr-6 lg:pr-0">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              Wszystkie obszary ({mergedCheckpoints.length})
            </button>
            {(Object.keys(CATEGORY_LABELS) as CheckpointCategory[])
              .filter(catKey => {
                if (siteType !== 'ecommerce' && catKey === 'ecommerce_cro') return false;
                return true;
              })
              .map(catKey => {
                const cat = CATEGORY_LABELS[catKey];
                const Icon = cat.icon;
                const count = mergedCheckpoints.filter(c => c.category === catKey).length;
                const isCatSelected = selectedCategory === catKey;
                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => setSelectedCategory(catKey)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer shrink-0 ${
                      isCatSelected
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.label}</span>
                    <span className={`text-[10px] font-mono px-1 rounded ${isCatSelected ? 'bg-slate-800 text-slate-300' : 'text-slate-400'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
          </div>
          {/* Subtelny wskaźnik przewijania poziomego na smartfonach */}
          <div aria-hidden="true" className="pointer-events-none absolute right-0 top-0 bottom-2 w-6 bg-gradient-to-l from-white via-white/80 to-transparent lg:hidden" />
        </div>

        {/* Wyszukiwarka na żywo */}
        <div className="relative min-w-[240px] md:min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Szukaj parametru lub diagnozy..."
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

      {/* Licznik aktywnych wyników */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 font-mono mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span>
            Wyświetlanie: <strong className="text-slate-800">{filteredCheckpoints.length}</strong> {selectedStatus === 'issues' ? 'kwestii wymagających uwagi' : `z ${computedStats.total} punktów kontrolnych`}
          </span>
          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-800 text-[11px] font-sans font-medium">
              <span>Obszar: {CATEGORY_LABELS[selectedCategory as CheckpointCategory]?.label || selectedCategory}</span>
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className="hover:text-indigo-950 font-bold ml-1 cursor-pointer"
                title="Wyczyść filtr obszaru"
              >
                ✕
              </button>
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {selectedStatus !== 'all' && (
            <button
              type="button"
              onClick={() => setSelectedStatus('all')}
              className="text-xs text-slate-600 hover:text-slate-900 font-semibold cursor-pointer underline"
            >
              Pokaż wszystkie ({computedStats.total})
            </button>
          )}
          {(selectedStatus !== 'issues' || selectedCategory !== 'all' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedStatus('issues');
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="text-xs text-indigo-600 hover:underline font-semibold cursor-pointer"
            >
              Resetuj filtry
            </button>
          )}
        </div>
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
            const isPassed = cp.status === 'passed';

            // Zwięzły, kompaktowy widok dla zaliczonych testów
            if (isPassed) {
              return (
                <div
                  key={cp.id}
                  className="p-4 md:p-5 rounded-2xl border border-emerald-200/60 bg-emerald-50/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors"
                >
                  <div className="flex items-start gap-3 flex-grow">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <button
                          type="button"
                          onClick={() => setSelectedCategory(cp.category)}
                          className="font-mono text-[11px] font-semibold text-slate-500 hover:text-indigo-600 uppercase tracking-wider transition-colors cursor-pointer text-left inline-flex items-center gap-1 group"
                          title={`Filtruj wg obszaru: ${CATEGORY_LABELS[cp.category]?.label || cp.category}`}
                        >
                          <span className="group-hover:underline">{CATEGORY_LABELS[cp.category]?.label || cp.category}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedStatus('passed')}
                          className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
                          title="Filtruj: Zgodne ze standardem"
                        >
                          Zgodne ze standardem
                        </button>
                      </div>
                      <h4 className="text-sm md:text-base font-bold text-slate-900 tracking-tight">
                        {cp.name}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {cp.diagnosis}
                      </p>
                    </div>
                  </div>

                  {cp.metric && (
                    <span className="font-mono text-xs text-emerald-800 bg-white/80 border border-emerald-200/80 px-2.5 py-1 rounded-md shrink-0">
                      {cp.metric}
                    </span>
                  )}
                </div>
              );
            }

            // Karta dla błędów i ostrzeżeń
            const statusBadgeBg = isFailed
              ? 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
              : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100';

            const statusText = isFailed
              ? 'Wymaga poprawy'
              : 'Zalecana uwaga';

            return (
              <div
                key={cp.id}
                className={`rounded-2xl border transition-all p-5 md:p-6 ${
                  isFailed
                    ? 'bg-rose-50/20 border-rose-200/70 hover:border-rose-300'
                    : 'bg-amber-50/20 border-amber-200/70 hover:border-amber-300'
                }`}
              >
                {/* Górny Pasek: Kategoria + Status + Metryka */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedCategory(cp.category)}
                      className="font-mono text-[11px] font-semibold text-slate-500 hover:text-indigo-600 uppercase tracking-wider transition-colors cursor-pointer text-left inline-flex items-center gap-1 group"
                      title={`Filtruj wg obszaru: ${CATEGORY_LABELS[cp.category]?.label || cp.category}`}
                    >
                      <span className="group-hover:underline">{CATEGORY_LABELS[cp.category]?.label || cp.category}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedStatus(isFailed ? 'failed' : 'warning')}
                      className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded-md tracking-wider transition-colors cursor-pointer ${statusBadgeBg}`}
                      title={`Filtruj tylko: ${statusText}`}
                    >
                      {statusText}
                    </button>
                  </div>

                  {cp.metric && (
                    cp.evidence && cp.evidence.length > 0 ? (
                      <button
                        type="button"
                        onClick={() => toggleExpand(cp.id)}
                        className="font-mono text-xs text-slate-700 bg-white/90 hover:bg-white border border-slate-200/90 hover:border-slate-400 px-2.5 py-0.5 rounded-md transition-all cursor-pointer inline-flex items-center gap-1 shadow-2xs group"
                        title={isExpanded ? 'Ukryj powiązane adresy URL' : 'Pokaż powiązane adresy URL'}
                      >
                        <span>{cp.metric}</span>
                        <span className="text-[10px] text-slate-400 group-hover:text-slate-700 font-sans">
                          ({isExpanded ? 'zwiń' : 'szczegóły'})
                        </span>
                      </button>
                    ) : (
                      <span className="font-mono text-xs text-slate-600 bg-white/80 border border-slate-200/80 px-2 py-0.5 rounded-md">
                        {cp.metric}
                      </span>
                    )
                  )}
                </div>

                {/* Tytuł i Diagnoza */}
                <h4 className="text-base md:text-lg font-bold text-slate-900 tracking-tight mb-1.5">
                  {cp.name}
                </h4>
                <p className="text-xs md:text-sm text-slate-600 mb-4 leading-relaxed">
                  {cp.diagnosis}
                </p>

                {/* Panele: Wpływ na serwis vs Rekomendacja inżynieryjna */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <div className="bg-white/80 border border-slate-200/80 rounded-xl p-3.5 border-l-2 border-l-rose-500">
                    <div className="flex items-center gap-1.5 mb-1 text-rose-700 font-mono text-xs font-bold uppercase tracking-wider">
                      <TrendingDown className="w-3.5 h-3.5 shrink-0" />
                      <span>Wpływ na działanie witryny:</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {cp.businessImpact}
                    </p>
                  </div>

                  <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-3.5 border-l-2 border-l-slate-800">
                    <div className="flex items-center gap-1.5 mb-1 text-slate-800 font-mono text-xs font-bold uppercase tracking-wider">
                      <Wrench className="w-3.5 h-3.5 shrink-0 text-slate-900" />
                      <span>Rekomendacja inżynieryjna:</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {formatEngineeringRecommendation(cp.developerSolution)}
                    </p>
                  </div>
                </div>

                {/* Dolny pasek: Rozwijane dowody & Konsultacja */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div>
                    {cp.evidence && cp.evidence.length > 0 && (
                      <button
                        type="button"
                        onClick={() => toggleExpand(cp.id)}
                        className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>{isExpanded ? 'Ukryj powiązane adresy' : `Pokaż powiązane adresy URL (${cp.evidence.length})`}</span>
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => scrollToConsultation(cp.name)}
                    className="text-xs font-semibold text-slate-700 hover:text-slate-900 inline-flex items-center gap-1.5 transition-colors cursor-pointer py-1.5 px-3 rounded-lg border border-slate-200/90 bg-white hover:bg-slate-50 shadow-xs ml-auto"
                  >
                    <span>Skonsultuj rozwiązanie</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
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

      {/* Elegancki pasek przejścia do zaliczonych testów, gdy aktywny jest filtr zagadnień do poprawy */}
      {selectedStatus === 'issues' && computedStats.passed > 0 && (
        <div className="mt-8 pt-6 border-t border-slate-200/70 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50 p-6 rounded-2xl border border-slate-200/60">
          <div className="flex items-center gap-3 text-left">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-sm font-bold text-slate-900">
                Pozostałe {computedStats.passed} testów zakończone sukcesem
              </p>
              <p className="text-xs text-slate-500">
                Fundamenty bezpieczeństwa, SSL, responsywności i podstawowego SEO są zgodne ze standardem inżynieryjnym.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSelectedStatus('passed')}
            className="shrink-0 px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors shadow-sm cursor-pointer"
          >
            Pokaż zaliczone testy ({computedStats.passed})
          </button>
        </div>
      )}
    </section>
  );
}
