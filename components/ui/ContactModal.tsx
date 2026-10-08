'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import ContactForm from '@/components/ui/ContactForm';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end lg:items-center justify-center p-0 lg:p-6 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="relative z-10 w-full max-w-3xl bg-white border border-slate-200/80 rounded-t-[2.5rem] lg:rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.14)] max-h-[92dvh] overflow-y-auto p-4 sm:p-8 lg:p-10 flex flex-col"
            id="modal-scroll-container"
          >
            {/* Mobile swipe pill indicator */}
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-3 lg:hidden shrink-0" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 sm:top-6 right-4 sm:right-6 p-2.5 rounded-2xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer z-20"
              aria-label="Zamknij formularz wyceny"
            >
              <X size={20} />
            </button>

            <ContactForm isModal={true} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
