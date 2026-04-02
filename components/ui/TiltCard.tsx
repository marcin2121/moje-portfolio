'use client';

import React, { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  disableDesktop?: boolean;
  onClick?: () => void;
}

export default function TiltCard({ children, className = '', disableDesktop = false, onClick }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  // We'll track a normalized value from -1 (bottom of screen) to 1 (top of screen)
  const viewY = useMotionValue(0);
  
  // Spring config for luxurious weight
  const smoothY = useSpring(viewY, {
    stiffness: 70,
    damping: 20,
    restDelta: 0.001
  });

  // Calculate rotations & fx
  const rotateX = useTransform(smoothY, [-1, 0, 1], [-8, 0, 8]);
  const rotateY = useTransform(smoothY, [-1, 0, 1], [-2, 0, 2]); // slight twist
  const scale = useTransform(smoothY, [-1, 0, 1], [0.95, 1, 0.95]);
  
  // Glare moves from top to bottom
  const glareOpacity = useTransform(smoothY, [-1, 0, 1], [0, 0.2, 0]);
  const glareY = useTransform(smoothY, [-1, 1], ['-100%', '100%']);

  useEffect(() => {
    let animationFrameId: number;
    let observer: IntersectionObserver;
    let isVisible = false;

    const measure = () => {
      if (isVisible && ref.current) {
        if (disableDesktop && window.innerWidth >= 1024) {
          viewY.set(0);
        } else {
          const rect = ref.current.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const centerOfCard = rect.top + rect.height / 2;
          
          // Normalize so center of screen = 0, top = 1, bottom = -1
          // We add some buffer so the effect completes slightly before leaving viewport
          const centerOfScreen = viewportHeight / 2;
          const normalized = (centerOfScreen - centerOfCard) / (viewportHeight * 0.6);
          
          // Clamp between -1 and 1
          viewY.set(Math.max(-1, Math.min(1, normalized)));
        }
      }
      animationFrameId = requestAnimationFrame(measure);
    };

    observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        measure();
      } else {
        cancelAnimationFrame(animationFrameId);
        viewY.set(0); // Return to flat when offscreen
      }
    }, { threshold: 0 });

    if (ref.current) observer.observe(ref.current);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, [viewY, disableDesktop]);

  return (
    <div ref={ref} className={`perspective-[2000px] w-full h-full ${className}`}>
      <motion.div
        onClick={onClick}
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full h-full rounded-2xl overflow-hidden will-change-transform shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] border border-white/5 bg-zinc-950"
      >
        {children}
        
        {/* Subtle dynamic lighting */}
        <motion.div 
          style={{ opacity: glareOpacity, y: glareY }}
          className="absolute inset-0 pointer-events-none bg-linear-to-b from-white/30 to-transparent mix-blend-overlay z-50 rounded-2xl"
        />
        <motion.div 
          style={{ opacity: glareOpacity }}
          className="absolute inset-0 pointer-events-none bg-radial-[at_50%_0%] from-orange-500/10 to-transparent mix-blend-screen z-40"
        />
      </motion.div>
    </div>
  );
}
