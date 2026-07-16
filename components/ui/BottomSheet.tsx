'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function BottomSheet({ isOpen, onClose, children }: BottomSheetProps) {
  const dragControls = useDragControls();

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent scroll on body when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const scroller = document.getElementById('scroll-container');
      if (scroller) scroller.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      const scroller = document.getElementById('scroll-container');
      if (scroller) scroller.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[99] bg-slate-900/40 backdrop-blur-sm lg:hidden"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, { offset, velocity }) => {
              if (offset.y > 100 || velocity.y > 500) {
                onClose();
              }
            }}
            className="fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-slate-200 rounded-t-[2rem] shadow-premium-soft flex flex-col max-h-[90dvh] lg:hidden will-change-transform"
          >
            {/* Drag Handle Area */}
            <div 
              className="w-full flex items-center justify-center pt-4 pb-2 touch-none select-none cursor-grab active:cursor-grabbing"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 pb-4 border-b border-slate-200/50">
              <h2 className="text-slate-900 font-mono text-sm tracking-widest uppercase">Konfigurator</h2>
              <button 
                onClick={onClose}
                className="p-2 bg-slate-100 rounded-full text-slate-500 hover:text-slate-900 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content Container */}
            <div id="bottom-sheet-scroll" className="flex-1 overflow-y-auto overscroll-contain px-4 md:px-6 pt-4 pb-6" data-lenis-prevent="true">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
