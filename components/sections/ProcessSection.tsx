'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { fixOrphans } from '@/utils/typography';

export function ProcessSection({ isDevMode }: { isDevMode: boolean }) {
  const steps = [
    {
      num: '01',
      bizTitle: 'Audyt i Projekt Architektury',
      devTitle: 'Systems Audit & Architecture Design',
      bizDesc: 'Rozbijam Twój proces biznesowy na czynniki pierwsze. Zanim napiszę linijkę kodu, projektuję stabilną architekturę i schemat bazy danych, aby uniknąć kosztownych poprawek w przyszłości.',
      devDesc: 'Mapping legacy monoliths to decoupled micro-frontends and serverless functions. Designing database schemas (PostgreSQL) and drawing API contracts before writing code.',
    },
    {
      num: '02',
      bizTitle: 'Precyzyjny Build',
      devTitle: 'Test-Driven Development',
      bizDesc: 'Piszę czysty, zoptymalizowany pod kątem wydajności kod, unikając gotowych, obciążających wtyczek. Strona ładuje się w ułamku sekundy i jest w 100% responsywna na urządzeniach mobilnych.',
      devDesc: 'Writing strictly typed (TypeScript), clean Next.js/React and Python code. Implementing strict ESLint rules, unit tests, and avoiding third-party bloat to maintain perfect Lighthouse scores.',
    },
    {
      num: '03',
      bizTitle: 'Wdrożenie i Nadzór',
      devTitle: 'CI/CD & Infrastructure Deployment',
      bizDesc: 'Umieszczam system w bezpiecznej chmurze i gwarantuję jego ciągłe działanie w ramach opieki technicznej. Ty skupiasz się na biznesie, ja zajmuję się serwerami.',
      devDesc: 'Deploying via automated GitHub Actions pipelines to Edge networks (Vercel/Cloudflare) or dedicated Hetzner/Coolify instances. 24/7 PM2/Docker monitoring and automated backups.',
    }
  ];

  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#161618] border-t border-[#222225] relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-black text-[#F5F5F7] tracking-tight mb-6">
            {isDevMode ? 'Engineering Lifecycle' : 'Proces nastawiony na wyniki'}
          </h2>
          <p className="text-[#A1A1A5] text-lg max-w-2xl mx-auto font-light leading-relaxed">
            {fixOrphans(isDevMode ? 'A rigorous, systematic approach to software delivery ensuring zero downtime and high maintainability.' : 'Brak ukrytych kosztów i niedotrzymanych terminów. Pracujemy na czystych zasadach, według sprawdzonego schematu inżynieryjnego.')}
          </p>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="hidden lg:block absolute top-[40px] left-[10%] right-[10%] h-0.5 bg-[#222225]" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                className="relative"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-[#0B0B0C] border-2 border-[#FF6900] flex items-center justify-center text-2xl font-black text-[#FF6900] mb-8 relative z-10 shadow-[0_0_30px_rgba(255,105,0,0.2)]">
                    {step.num}
                  </div>
                  <h3 className="text-2xl font-bold text-[#F5F5F7] mb-4">
                    {isDevMode ? step.devTitle : step.bizTitle}
                  </h3>
                  <p className="text-[#A1A1A5] font-light leading-relaxed">
                    {fixOrphans(isDevMode ? step.devDesc : step.bizDesc)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
