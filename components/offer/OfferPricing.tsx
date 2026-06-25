"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import Link from 'next/link';
import Pricing from '@/components/Pricing';
import { ClientOffer } from '@/data/offers';
import { fixOrphans } from '@/utils/typography';

interface OfferPricingProps {
  packages: ClientOffer['packages'];
  companyName: string;
}

export default function OfferPricing({ packages, companyName }: OfferPricingProps) {
  const [showGeneralOffer, setShowGeneralOffer] = useState(false);
  const [acceptedTier, setAcceptedTier] = useState<string | null>(null);

  const handleSelectPackage = async (pkgName: string, price: string) => {
    // 1. Zdarzenie Umami
    if (typeof window !== 'undefined' && (window as any).umami) {
      const slug = pkgName.toLowerCase().replace(/\s+/g, '_');
      (window as any).umami.track(`oferta_click_tier_${slug}`);
    }

    // 2. Pokazanie panelu w interfejsie
    setAcceptedTier(pkgName);

    // 3. Wysłanie powiadomienia Resend
    try {
      await fetch('/api/accept-offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName, packageName: pkgName, price })
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-full bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
            Dedykowana Wycena
          </h2>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            {fixOrphans(`Wybierz wariant współpracy, który najlepiej odpowiada Twojemu obecnemu budżetowi i apetytowi na rozwój.`)}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {packages.map((pkg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative p-8 rounded-[32px] border flex flex-col h-full bg-zinc-900/50 border-white/10"
            >


              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                <p className="text-zinc-400 text-sm">{fixOrphans(pkg.target)}</p>
              </div>

              <div className="mb-8">
                {pkg.originalPrice && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg text-zinc-500 line-through">{pkg.originalPrice} zł</span>
                    {pkg.discountBadge && (
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-md border border-emerald-400/20">
                        {pkg.discountBadge}
                      </span>
                    )}
                  </div>
                )}
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-white">{pkg.price}</span>
                  <span className="text-zinc-500">zł netto</span>
                </div>
              </div>

              <ul className="space-y-4 mb-10 flex-grow">
                {pkg.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-3 text-zinc-300 text-sm">
                    <Check className="shrink-0 mt-0.5 text-zinc-500" size={18} />
                    <span>{fixOrphans(feature)}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSelectPackage(pkg.name, pkg.price)}
                className="w-full py-4 rounded-xl font-bold transition-all duration-300 hover:-translate-y-1 bg-white text-black hover:bg-zinc-200"
              >
                {pkg.ctaText}
              </button>

              <AnimatePresence>
                {acceptedTier === pkg.name && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm leading-relaxed">
                      <p className="font-bold mb-1">Świetny wybór.</p>
                      <p>
                        Zablokowałem dla Ciebie ten pakiet w cenie partnerskiej ({pkg.price} zł). Marcin dostał właśnie powiadomienie systemowe - odezwie się do Ciebie w ciągu kilku godzin.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-16 relative z-20">
          <button 
            onClick={() => setShowGeneralOffer(!showGeneralOffer)}
            className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-8 py-4 rounded-xl bg-zinc-900 border border-orange-500/30 text-zinc-200 font-medium hover:bg-orange-500 hover:border-orange-500 hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(249,115,22,0.1)] hover:shadow-[0_10px_30px_rgba(249,115,22,0.3)] hover:-translate-y-0.5"
          >
            {showGeneralOffer ? 'Ukryj ogólną ofertę' : 'Zobacz ogólną ofertę'}
          </button>
          <Link 
            href="/"
            className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-8 py-4 rounded-xl bg-transparent border border-white/10 text-zinc-400 font-medium hover:bg-zinc-900 hover:text-white transition-all duration-300"
          >
            Strona główna
          </Link>
        </div>
      </div>
    </section>

    {showGeneralOffer && (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="border-t border-white/10 bg-black"
      >
        <Pricing />
      </motion.div>
    )}
    </>
  );
}
