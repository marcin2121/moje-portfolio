'use client';

import { useEffect, useRef } from 'react';

export function useFrictionTelemetry(sessionId: string, device: string) {
  const startTime = useRef<number>(0);

  useEffect(() => {
    if (startTime.current === 0) {
      startTime.current = Date.now();
    }
  }, []);
  const maxScrollDepth = useRef(0);
  const sliderInteractionCount = useRef(0);
  const sent = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );
      if (scrollPercent > maxScrollDepth.current) {
        maxScrollDepth.current = scrollPercent;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const trackSliderInteraction = () => {
    sliderInteractionCount.current += 1;
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && !sent.current) {
        sent.current = true;
        
        const durationSeconds = Math.round((Date.now() - startTime.current) / 1000);
        
        const payload = {
          session_id: sessionId,
          device,
          duration_seconds: durationSeconds,
          max_scroll_depth: `${maxScrollDepth.current}%`,
          journey: [
            {
              timestamp: Date.now(),
              action: 'tab_abandoned',
              metadata_summary: `Interactions: ${sliderInteractionCount.current}`
            }
          ]
        };

        fetch('/api/ux-log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true, // Fire-and-forget, beacon-safe
        }).catch(err => console.error("Telemetry failed:", err));
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [sessionId, device]);

  return { trackSliderInteraction };
}
