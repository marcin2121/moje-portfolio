'use client';

import React, { useEffect, useRef } from 'react';

export default function Particles({ color = '#f97316' }: { color?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles: { x: number, y: number, radius: number, speed: number, alpha: number }[] = [];
    
    // Tworzymy iskry
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2,
        speed: Math.random() * 0.5 + 0.1,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    let animationFrameId: number;
    let isVisible = true;

    // ⚡ BOLT FIX: Zatrzymanie CPU, gdy sekcja znika z ekranu
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(canvas);

    // ⚡ BOLT FIX: Obsługa responsywności (zapobiega rozmyciu)
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    const render = () => {
      if (isVisible) {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = color;

        particles.forEach((p) => {
          // Ruch w górę
          p.y -= p.speed;
          if (p.y < 0) {
            p.y = height;
            p.x = Math.random() * width;
          }

          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      animationFrameId = window.requestAnimationFrame(render);
    };

    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, [color]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-50 mix-blend-screen" />;
}