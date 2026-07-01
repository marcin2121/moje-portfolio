'use client';

import { ReactLenis } from 'lenis/react';
import { ReactNode, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    let checkLenis: NodeJS.Timeout;
    
    const updateLenis = (time: number) => lenisRef.current?.lenis?.raf(time * 1000);
    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    const initLenisSync = () => {
      const lenis = lenisRef.current?.lenis;
      if (lenis) {
        lenis.on('scroll', ScrollTrigger.update);
        clearInterval(checkLenis);
      }
    };

    // W React 18 / Next.js instancja lenis może pojawić się milisekundy po montażu rodzica
    checkLenis = setInterval(initLenisSync, 50);
    initLenisSync();
    
    const currentLenis = lenisRef.current?.lenis;
    return () => {
      clearInterval(checkLenis);
      if (currentLenis) currentLenis.off('scroll', ScrollTrigger.update);
      gsap.ticker.remove(updateLenis);
    };
  }, []);

  return (
    <ReactLenis 
      root 
      ref={lenisRef}
      options={{ 
        duration: 1.2, 
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1.1,
        touchMultiplier: 1.5,
        autoRaf: false, // We use GSAP's ticker
      }}
    >
      {children}
    </ReactLenis>
  );
}
