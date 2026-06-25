"use client";
import { useEffect, useRef } from "react";

export default function UxLogger() {
  const state = useRef({
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
    t0: Date.now(),
    maxS: 0,
    dev: typeof window !== 'undefined' ? (window.innerWidth < 768 ? 'mobile' : 'desktop') : 'unknown',
    log: [{ t: "0s", action: "session_start", meta: "App initialized" }]
  });

  useEffect(() => {
    const s = state.current;
    const push = (a: string, m?: string) => s.log.push({ t: `${Math.round((Date.now() - s.t0) / 1000)}s`, action: a, meta: m || "" });
    
    let scrollT: NodeJS.Timeout;
    const onScroll = () => {
      clearTimeout(scrollT);
      scrollT = setTimeout(() => {
        // Top 1%: Żelazny standard W3C zapobiegający Infinity i NaN (błąd body.scrollHeight)
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        let pct = docHeight > 0 ? Math.round((window.scrollY / docHeight) * 100) : 0;
        
        if (pct > s.maxS) { s.maxS = pct; push("scroll_to", `${pct}% depth`); }
      }, 1000);
    };

    let clicks = 0;
    let clickT: NodeJS.Timeout;
    let lastTarget = "";
    
    const onClick = (e: MouseEvent) => {
      let target = (e.target as HTMLElement)?.innerText?.trim().slice(0, 30) || (e.target as HTMLElement)?.tagName;
      
      // Top 1%: Jeśli target się zmienił, traktujemy to jako zupełnie nową serię kliknięć 
      // i zapisujemy stary target jeśli licznik > 0
      if (lastTarget !== target) {
        clicks = 0;
        lastTarget = target;
      }
      
      clicks++;
      clearTimeout(clickT);
      
      if (clicks === 4) push("rage_click", target);
      else if (clicks === 1) push("click", target);
      
      clickT = setTimeout(() => {
        clicks = 0;
        lastTarget = "";
      }, 800);
    };

    const send = () => {
      if (s.log[s.log.length - 1]?.action === "tab_closed") return;
      push("tab_closed");
      navigator.sendBeacon("/api/ux-log", JSON.stringify({
        session_id: s.id, device: s.dev, duration_seconds: Math.round((Date.now() - s.t0) / 1000),
        max_scroll_depth: `${s.maxS}%`, journey: s.log
      }));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("click", onClick, { passive: true });
    window.addEventListener("visibilitychange", () => document.visibilityState === 'hidden' && send());
    
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("click", onClick);
      send();
    };
  }, []);

  return null;
}
