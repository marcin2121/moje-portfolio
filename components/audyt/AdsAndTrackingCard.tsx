'use client';

import React from 'react';
import {
  TrendingDown,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Tag,
  Share2,
  ShieldCheck,
  ShieldAlert,
  ShoppingCart,
  Database
} from 'lucide-react';
import { AdsAndTrackingAudit } from '@/app/api/audit-master/types';

interface AdsAndTrackingCardProps {
  tracking: AdsAndTrackingAudit;
  domain: string;
  siteType?: 'ecommerce' | 'services';
}

export default function AdsAndTrackingCard({ tracking, domain, siteType = 'services' }: AdsAndTrackingCardProps) {
  const isEcommerce = siteType === 'ecommerce';
  const isCritical = tracking.adBudgetLeakRisk === 'critical';
  const isMedium = tracking.adBudgetLeakRisk === 'medium';
  const hasAnyAdTracking = tracking.hasGoogleAds || tracking.hasMetaPixel || tracking.hasTikTokPixel || tracking.hasGoogleTagManager || tracking.hasGA4;
  const hasGoogleTracking = tracking.hasGoogleAds || tracking.hasGA4;
  const hasCart = isEcommerce || !!tracking.hasCartButtons;

  return (
    <div className="bg-white/80 border border-slate-200/70 rounded-3xl p-6 md:p-10 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
      {/* Nagłówek sekcji */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs font-bold text-slate-500 uppercase tracking-widest">
              Analityka & Kampanie Płatne {isEcommerce ? '· E-commerce' : '· Usługi / B2B'}
            </span>
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Budżet Reklamowy & Telemetryka (Google & Meta Ads)
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            {isEcommerce
              ? 'Czy Twój budżet na Google Ads i Meta Ads nie jest przepalany przez błędy w kodzie koszyka i brak telemetryki zdarzeń e-commerce?'
              : 'Czy Twój budżet na Google Ads i Meta Ads nie jest przepalany przez brak telemetryki wysłanych formularzy i zapytań B2B?'}
          </p>
        </div>

        {/* Globalny status ochrony budżetu */}
        <div className="shrink-0">
          {!hasAnyAdTracking ? (
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200/80 text-slate-700 font-mono text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-slate-400" />
              <span>BRAK TAGÓW REKLAMOWYCH</span>
            </div>
          ) : isCritical ? (
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-mono text-xs font-bold">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>RYZYKO PRZEPALANIA BUDŻETU</span>
            </div>
          ) : isMedium ? (
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 font-mono text-xs font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>CZĘŚCIOWE LUKI TELEMETRYCZNE</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>ŚLEDZENIE ZDARZEŃ POPRAWNE</span>
            </div>
          )}
        </div>
      </div>

      {/* Siatka 6 kafelków telemetrycznych */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {/* 1. Google Ads */}
        <div className={`p-4 rounded-2xl border ${tracking.hasGoogleAds ? 'bg-slate-50/70 border-slate-200/80' : 'bg-slate-50/30 border-slate-200/50'}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-orange-600" />
              <span className="font-bold text-xs text-slate-900">Google Ads</span>
            </div>
            {tracking.hasGoogleAds ? (
              <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                Wykryto
              </span>
            ) : (
              <span className="text-[11px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                Brak tagów
              </span>
            )}
          </div>
          <div className="font-mono text-xs text-slate-700 font-medium truncate">
            {tracking.googleAdsId || (tracking.hasGoogleAds ? 'Aktywne kody śledzące' : 'Brak bezpośrednich tagów AW-')}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Kampanie PPC w sieci wyszukiwania i Performance Max
          </div>
        </div>

        {/* 2. Google Tag Manager */}
        <div className={`p-4 rounded-2xl border ${tracking.hasGoogleTagManager ? 'bg-slate-50/70 border-slate-200/80' : 'bg-slate-50/30 border-slate-200/50'}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-sky-600" />
              <span className="font-bold text-xs text-slate-900">Google Tag Manager</span>
            </div>
            {tracking.hasGoogleTagManager ? (
              <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                Aktywny
              </span>
            ) : (
              <span className="text-[11px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                Brak GTM
              </span>
            )}
          </div>
          <div className="font-mono text-xs text-slate-700 font-medium truncate">
            {tracking.gtmId || (tracking.hasGoogleTagManager ? 'Kontener GTM zainstalowany' : 'Brak kontenera GTM-')}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Zarządzanie skryptami bez ingerencji w kod źródłowy
          </div>
        </div>

        {/* 3. GA4 */}
        <div className={`p-4 rounded-2xl border ${tracking.hasGA4 ? 'bg-slate-50/70 border-slate-200/80' : 'bg-slate-50/30 border-slate-200/50'}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="font-bold text-xs text-slate-900">Google Analytics 4</span>
            </div>
            {tracking.hasGA4 ? (
              <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                Połączono
              </span>
            ) : (
              <span className="text-[11px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                Brak GA4
              </span>
            )}
          </div>
          <div className="font-mono text-xs text-slate-700 font-medium truncate">
            {tracking.ga4Id || (tracking.hasGA4 ? 'Strumień GA4 aktywny' : 'Brak identyfikatora G-')}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Nowoczesne śledzenie ścieżek zakupowych użytkowników
          </div>
        </div>

        {/* 4. Meta Pixel (Facebook Ads) */}
        <div className={`p-4 rounded-2xl border ${tracking.hasMetaPixel ? 'bg-slate-50/70 border-slate-200/80' : 'bg-slate-50/30 border-slate-200/50'}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-indigo-600" />
              <span className="font-bold text-xs text-slate-900">Meta Pixel (FB Ads)</span>
            </div>
            {tracking.hasMetaPixel ? (
              <span className="text-[11px] font-mono font-bold text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded">
                Wykryto
              </span>
            ) : (
              <span className="text-[11px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                Brak Pixela
              </span>
            )}
          </div>
          <div className="font-mono text-xs text-slate-700 font-medium truncate">
            {tracking.hasMetaPixel ? 'Skrypt fbq() zainicjalizowany' : 'Brak kodu Facebook Pixel'}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Śledzenie odbiorców reklam na Facebooku i Instagramie
          </div>
        </div>

        {/* 5. Consent Mode v2 */}
        <div className={`p-4 rounded-2xl border ${
          hasGoogleTracking
            ? tracking.hasConsentModeV2
              ? 'bg-emerald-50/40 border-emerald-200/70'
              : 'bg-rose-50/40 border-rose-200/70'
            : 'bg-slate-50/30 border-slate-200/50'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {hasGoogleTracking && tracking.hasConsentModeV2 ? (
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              ) : hasGoogleTracking ? (
                <ShieldAlert className="w-4 h-4 text-rose-600" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-slate-400" />
              )}
              <span className="font-bold text-xs text-slate-900">Consent Mode v2</span>
            </div>
            {hasGoogleTracking ? (
              tracking.hasConsentModeV2 ? (
                <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Zgodny (UE)
                </span>
              ) : (
                <span className="text-[11px] font-mono font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                  BRAK!
                </span>
              )
            ) : (
              <span className="text-[11px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                Brak tagów
              </span>
            )}
          </div>
          <div className={`font-mono text-xs font-semibold truncate ${
            hasGoogleTracking
              ? tracking.hasConsentModeV2
                ? 'text-emerald-800'
                : 'text-rose-700'
              : 'text-slate-600'
          }`}>
            {hasGoogleTracking
              ? tracking.hasConsentModeV2
                ? 'ad_storage & ad_user_data OK'
                : 'Brak parametrów Consent v2'
              : 'Brak aktywnych tagów Google'}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {hasGoogleTracking
              ? 'Obowiązkowy wymóg Google od marca 2024 dla reklam w UE'
              : 'Wymagane dopiero przy uruchomieniu kampanii Google'}
          </div>
        </div>

        {/* 6. Zdarzenia koszykowe (e-commerce) / Lead konwersja (usługi) */}
        <div className={`p-4 rounded-2xl border ${
          isEcommerce
            ? tracking.hasAddToCartTracking
              ? 'bg-emerald-50/40 border-emerald-200/70'
              : 'bg-rose-50/40 border-rose-200/70'
            : tracking.hasDataLayer
              ? 'bg-emerald-50/40 border-emerald-200/70'
              : hasAnyAdTracking
                ? 'bg-amber-50/40 border-amber-200/70'
                : 'bg-slate-50/30 border-slate-200/50'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <ShoppingCart className={`w-4 h-4 ${isEcommerce ? 'text-amber-600' : 'text-slate-500'}`} />
              <span className="font-bold text-xs text-slate-900">
                {isEcommerce ? 'Zdarzenie add_to_cart' : 'Śledzenie Leadów / Formularzy'}
              </span>
            </div>
            {isEcommerce ? (
              tracking.hasAddToCartTracking ? (
                <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Rejestrowane
                </span>
              ) : (
                <span className="text-[11px] font-mono font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                  Brak w kodzie!
                </span>
              )
            ) : tracking.hasDataLayer ? (
              <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                dataLayer OK
              </span>
            ) : hasAnyAdTracking ? (
              <span className="text-[11px] font-mono font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                Brak eventu
              </span>
            ) : (
              <span className="text-[11px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                Brak koszyka
              </span>
            )}
          </div>
          <div className={`font-mono text-xs font-semibold truncate ${
            isEcommerce
              ? tracking.hasAddToCartTracking
                ? 'text-emerald-800'
                : 'text-rose-700'
              : tracking.hasDataLayer
                ? 'text-emerald-800'
                : hasAnyAdTracking
                  ? 'text-amber-800'
                  : 'text-slate-600'
          }`}>
            {isEcommerce
              ? tracking.hasAddToCartTracking
                ? 'dataLayer.push() aktywne'
                : 'Przycisk koszyka nie emituje eventu'
              : tracking.hasDataLayer
                ? 'Zdarzenia konwersji w dataLayer'
                : tracking.hasLeadForms
                  ? 'Wykryto formularz bez zdarzenia generate_lead'
                  : 'Serwis usługowy (brak koszyka e-commerce)'}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {isEcommerce
              ? 'Kluczowy sygnał intencji dla Smart Bidding Google Ads'
              : 'Dla witryn usługowych kluczowe jest mierzenie wysłanych zapytań (Leadów)'}
          </div>
        </div>
      </div>

      {/* Szczegółowa lista wykrytych wycieków i rekomendacji dewelopera */}
      {tracking.issues && tracking.issues.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-bold text-slate-900 text-sm tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Zdiagnozowane wąskie gardła analityczne na {domain}:</span>
          </h4>

          {tracking.issues.map((issue) => (
            <div
              key={issue.id}
              className={`p-5 rounded-2xl border ${
                issue.severity === 'critical'
                  ? 'border-rose-200/80 bg-rose-50/30'
                  : 'border-amber-200/80 bg-amber-50/30'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h5 className="font-bold text-slate-900 text-sm">
                  {issue.title}
                </h5>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                  issue.severity === 'critical' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {issue.severity}
                </span>
              </div>

              <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                {issue.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-200/60">
                <div className="flex items-start gap-2">
                  <TrendingDown className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-mono font-bold text-slate-800 block mb-0.5">
                      Wpływ na koszty reklam:
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {issue.impact}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Wrench className="w-4 h-4 text-slate-800 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-mono font-bold text-slate-800 block mb-0.5">
                      Co dla Ciebie wdrożę w kodzie:
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {issue.developerSolution}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}