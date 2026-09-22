"use client";

import { useEffect, useRef } from 'react';

interface OfferTelemetryTrackerProps {
  slug: string;
  companyName: string;
  clientName?: string;
}

export default function OfferTelemetryTracker({
  slug,
  companyName,
  clientName
}: OfferTelemetryTrackerProps) {
  const totalSecondsRef = useRef(0);
  const sectionTimesRef = useRef<Record<string, number>>({});
  const activeSectionRef = useRef<string>('hero');
  const hasSentOpenedRef = useRef(false);
  const lastReportedSecondsRef = useRef(0);

  useEffect(() => {
    // 1. Wykrycie typu urządzenia
    const isMobile = window.innerWidth <= 768;
    const deviceType = isMobile ? 'Smartfon (Mobile)' : 'Komputer (Desktop)';

    // 2. Wysłanie alertu "Otwarto ofertę" po 1.5 sekundy (odfiltrowanie natychmiastowych bounce'ów)
    const openTimer = setTimeout(() => {
      if (hasSentOpenedRef.current) return;
      hasSentOpenedRef.current = true;

      fetch('/api/oferta/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'opened',
          slug,
          companyName,
          clientName,
          deviceType,
          referrer: document.referrer || undefined
        })
      }).catch(err => console.error('[Telemetry Client] Błąd wysyłki opened:', err));
    }, 1500);

    // 3. Obserwacja sekcji na ekranie za pomocą IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        let bestRatio = 0;
        let mostVisibleSection = activeSectionRef.current;

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio;
            const secName = entry.target.getAttribute('data-section');
            if (secName) {
              mostVisibleSection = secName;
            }
          }
        });

        if (bestRatio > 0.2) {
          activeSectionRef.current = mostVisibleSection;
        }
      },
      {
        threshold: [0.1, 0.3, 0.5, 0.7, 1.0]
      }
    );

    // Obserwuj wszystkie sekcje oznaczone atrybutem data-section
    const trackedElements = document.querySelectorAll('[data-section]');
    trackedElements.forEach((el) => observer.observe(el));

    // 4. Timer mierzący aktywny czas (tylko gdy karta jest aktywna i widoczna)
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        totalSecondsRef.current += 1;
        const currentSec = activeSectionRef.current;
        sectionTimesRef.current[currentSec] = (sectionTimesRef.current[currentSec] || 0) + 1;
      }
    }, 1000);

    // 5. Funkcja wysyłająca mapę uwagi
    const sendAttentionSummary = () => {
      const totalSec = totalSecondsRef.current;
      // Wysyłaj tylko, jeśli klient spędził co najmniej 8 sekund i przybyło co najmniej 5 sekund od ostatniego raportu
      if (totalSec < 8 || totalSec <= lastReportedSecondsRef.current + 4) return;

      lastReportedSecondsRef.current = totalSec;

      const payload = JSON.stringify({
        action: 'attention',
        slug,
        companyName,
        totalSeconds: totalSec,
        sectionTimes: sectionTimesRef.current
      });

      if (navigator.sendBeacon) {
        const blob = new Blob([payload], { type: 'application/json' });
        navigator.sendBeacon('/api/oferta/telemetry', blob);
      } else {
        fetch('/api/oferta/telemetry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true
        }).catch(() => {});
      }
    };

    // 6. Nasłuchiwanie na opuszczenie strony / przełączenie karty
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        sendAttentionSummary();
      }
    };

    const handlePageHide = () => {
      sendAttentionSummary();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('beforeunload', handlePageHide);

    return () => {
      clearTimeout(openTimer);
      clearInterval(interval);
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('beforeunload', handlePageHide);
      sendAttentionSummary();
    };
  }, [slug, companyName, clientName]);

  return null; // Komponent czysto telemetryczny, niewidoczny w DOM
}
