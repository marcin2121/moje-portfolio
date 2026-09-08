'use client';

import React, { useState, useMemo } from 'react';
import { Search, ExternalLink } from 'lucide-react';
import { PageAuditResult } from '@/app/api/audit-master/types';

interface PagesTableProps {
  pages: PageAuditResult[];
}

export default function PagesTable({ pages }: PagesTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredPages = useMemo(() => {
    return pages.filter(p => {
      const matchesSearch = p.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.title && p.title.toLowerCase().includes(searchTerm.toLowerCase()));

      if (!matchesSearch) return false;

      if (activeCategory === 'all') return true;
      if (activeCategory === 'issues') {
        return p.h1Count === 0 || !p.canonical || p.isThinContent || p.missingAltCount > 0 || p.statusCode !== 200;
      }
      return p.category === activeCategory;
    });
  }, [pages, searchTerm, activeCategory]);

  const categoryLabels: Record<string, string> = {
    home: 'Strona główna',
    product: 'Produkt',
    blog: 'Blog',
    shop: 'Sklep / Kategoria',
    info: 'Informacyjna'
  };

  return (
    <div className="bg-white/70 border border-slate-200/70 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.04)] mb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Wszystkie zbadane podstrony
          </h3>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Przeanalizowano {pages.length} unikalnych adresów URL w domenie
          </p>
        </div>

        {/* Wyszukiwarka */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Szukaj adresu URL lub tytułu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50/80 border border-slate-200/80 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 font-mono"
          />
        </div>
      </div>

      {/* Filtry kategorii */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          type="button"
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            activeCategory === 'all'
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/60'
          }`}
        >
          Wszystkie ({pages.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveCategory('issues')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            activeCategory === 'issues'
              ? 'bg-rose-600 text-white'
              : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
          }`}
        >
          Z problemami
        </button>
        {pages.some(p => p.category === 'product') && (
          <button
            type="button"
            onClick={() => setActiveCategory('product')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeCategory === 'product'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            Produkty ({pages.filter(p => p.category === 'product').length})
          </button>
        )}
        {pages.some(p => p.category === 'blog') && (
          <button
            type="button"
            onClick={() => setActiveCategory('blog')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeCategory === 'blog'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            Blog ({pages.filter(p => p.category === 'blog').length})
          </button>
        )}
        {pages.some(p => p.category === 'shop') && (
          <button
            type="button"
            onClick={() => setActiveCategory('shop')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeCategory === 'shop'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            Sklep / Kategorie ({pages.filter(p => p.category === 'shop').length})
          </button>
        )}
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200/60">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/90 border-b border-slate-200/70 font-mono text-[11px] text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Adres URL i Tytuł</th>
              <th className="py-3 px-3">Kategoria</th>
              <th className="py-3 px-3 text-center">Status</th>
              <th className="py-3 px-3 text-center">Czas</th>
              <th className="py-3 px-3 text-center">H1</th>
              <th className="py-3 px-3 text-center">Słowa</th>
              <th className="py-3 px-3 text-center">Canonical</th>
              <th className="py-3 px-3 text-center">Brak Alt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {filteredPages.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-slate-400 font-mono">
                  Brak wyników spełniających kryteria wyszukiwania.
                </td>
              </tr>
            ) : (
              filteredPages.map((p) => (
                <tr key={p.url} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 max-w-xs md:max-w-sm">
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-slate-800 hover:text-orange-600 truncate block font-medium group"
                      title={p.url}
                    >
                      <span className="group-hover:underline">{p.url}</span>
                      <ExternalLink className="w-3 h-3 inline-block ml-1 opacity-40" />
                    </a>
                    {p.title && (
                      <span className="text-[11px] text-slate-500 truncate block mt-0.5">
                        {p.title}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-[11px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {categoryLabels[p.category] || p.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-mono">
                    <span className={p.statusCode === 200 ? 'text-emerald-700 font-bold' : 'text-rose-600 font-bold'}>
                      {p.statusCode}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-slate-500">
                    {p.responseTimeMs}ms
                  </td>
                  <td className="py-3 px-3 text-center font-mono">
                    {p.h1Count === 1 ? (
                      <span className="text-emerald-700 font-bold">✓ 1</span>
                    ) : p.h1Count === 0 ? (
                      <span className="text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded">Brak</span>
                    ) : (
                      <span className="text-amber-600 font-bold">{p.h1Count}x</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center font-mono">
                    <span className={p.isThinContent ? 'text-amber-600 font-bold' : 'text-slate-600'}>
                      {p.wordCount}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-mono">
                    {p.canonical ? (
                      <span className="text-emerald-700 font-bold">✓</span>
                    ) : (
                      <span className="text-rose-600 font-bold">✕</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center font-mono">
                    {p.missingAltCount > 0 ? (
                      <span className="text-amber-600 font-bold">{p.missingAltCount}</span>
                    ) : (
                      <span className="text-slate-400">0</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
