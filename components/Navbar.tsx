'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { label: 'Wdrożenia', href: '/wdrozenia' },
  { label: 'Bezpłatne testy', href: '/narzedzia' },
  { label: 'Cennik', href: '/#cennik' },
  { label: 'Gwarancja', href: '/#faq' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
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

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-[100] transition-all duration-500 flex justify-center px-4 sm:px-6 mt-4 md:mt-6 ${
          isScrolled ? 'translate-y-0' : 'translate-y-0'
        }`}
      >
        <div 
          className={`w-full max-w-5xl flex items-center justify-between transition-all duration-500 rounded-full border ${
            isScrolled 
              ? 'bg-[#0B0B0C]/80 backdrop-blur-2xl border-white/10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] py-3 px-6' 
              : 'bg-transparent border-transparent py-4 px-2'
          }`}
        >
          {/* Logo */}
          <Link href="/" className="group inline-flex items-center gap-1.5 font-mono tracking-tight select-none">
            <span className="text-base font-bold tracking-wider text-zinc-100 group-hover:text-white transition-colors">
              MOLENDA
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 inline-block shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
            <span className="text-xs md:text-sm font-medium tracking-normal text-zinc-500 group-hover:text-zinc-400 transition-colors uppercase">
              DEVELOPMENT
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 pl-4">
            {NAV_LINKS.map((link) => {
              const isActive = pathname.startsWith(link.href) && link.href !== '/';
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                    isActive 
                      ? 'text-white bg-white/10' 
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors rounded-full"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[90] bg-[#0B0B0C]/95 backdrop-blur-3xl pt-24 pb-8 px-6 flex flex-col md:hidden"
          >
            <nav className="flex flex-col gap-2 w-full">
              {NAV_LINKS.map((link) => {
                const isActive = pathname.startsWith(link.href) && link.href !== '/';
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-6 py-4 rounded-2xl text-lg font-medium transition-colors ${
                      isActive
                        ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                        : 'bg-zinc-900/50 text-zinc-300 border border-white/5 hover:bg-zinc-800'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            
            <div className="mt-auto flex justify-center pb-6">
              <Link 
                href="/#kontakt" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-black font-semibold py-4 rounded-2xl transition-colors shadow-[0_0_20px_rgba(249,115,22,0.3)] text-center flex items-center justify-center"
              >
                Wyceń projekt
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
