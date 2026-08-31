'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { label: 'Realizacje', href: '/#realizacje' },
  { label: 'Architektura', href: '/#architektura' },
  { label: 'Opinie', href: '/#opinie' },
  { label: 'Cennik', href: '/#cennik' },
  { label: 'Audyt AI', href: '/narzedzia/audyt' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open (UX improvement)
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleLinkClick = (href: string) => {
    if (href.startsWith('/#') && pathname === '/') {
      const id = href.substring(2);
      const elem = document.getElementById(id);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-[100] flex justify-center px-4 sm:px-6 pt-4 md:pt-6 pointer-events-none">
        <div 
          className={`w-full max-w-6xl flex items-center justify-between transition-all duration-500 rounded-full border pointer-events-auto ${
            isScrolled 
              ? 'bg-white/85 backdrop-blur-2xl border-slate-200/80 shadow-premium-soft py-2.5 px-6' 
              : 'bg-white/60 backdrop-blur-xl border-slate-200/50 shadow-xs py-3 px-6'
          }`}
        >
          {/* Logo */}
          <Link href="/" className="group inline-flex items-center gap-1.5 font-mono tracking-tight select-none">
            <span className="text-sm sm:text-base font-bold tracking-wider text-slate-900 group-hover:text-black transition-colors">
              MOLENDA
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 inline-block shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
            <span className="text-[11px] sm:text-xs font-medium tracking-normal text-slate-500 group-hover:text-slate-700 transition-colors uppercase">
              DEVELOPMENT
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => handleLinkClick(link.href)}
                  className="px-3.5 py-1.5 text-xs font-medium rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-all"
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA Button */}
          <div className="hidden md:flex items-center">
            <Link
              href="/#kontakt"
              onClick={() => handleLinkClick('/#kontakt')}
              className="inline-flex items-center gap-2 px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all shadow-[0_4px_14px_rgba(234,88,12,0.3)] hover:scale-105 active:scale-95"
            >
              <span>Wycena w 24h</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 transition-colors rounded-full"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[90] bg-white/95 backdrop-blur-3xl pt-24 pb-8 px-6 flex flex-col md:hidden"
          >
            <nav className="flex flex-col gap-2 w-full">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => {
                    handleLinkClick(link.href);
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-6 py-4 rounded-2xl text-base font-medium transition-colors bg-slate-50 text-slate-800 border border-slate-200/80 active:bg-orange-50 active:text-orange-600"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            
            <div className="mt-auto flex justify-center pb-6">
              <Link 
                href="/#kontakt" 
                onClick={() => {
                  handleLinkClick('/#kontakt');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl transition-colors shadow-[0_0_20px_rgba(249,115,22,0.3)] text-center flex items-center justify-center gap-2"
              >
                <span>Wycena w 24h</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
