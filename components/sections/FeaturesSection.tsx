'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { LayoutTemplate, Bot, LineChart } from 'lucide-react';
import { fixOrphans } from '@/utils/typography';

export function FeaturesSection({ isDevMode }: { isDevMode: boolean }) {
  const features = [
    {
      icon: <LayoutTemplate className="w-8 h-8 text-[#FF6900]" />,
      bizTitle: 'Dedykowany E-commerce & PWA',
      devTitle: 'Headless Commerce & PWA',
      bizDesc: 'Ultraszybkie aplikacje z pełną obsługą offline, powiadomieniami push i dynamicznym koszykiem działającym bez przeładowania strony.',
      devDesc: 'Next.js App Router implementations with Service Workers for offline-first capabilities. Utilizing Zustand/nuqs for frictionless checkout state without hydration overhead.',
    },
    {
      icon: <Bot className="w-8 h-8 text-[#FF6900]" />,
      bizTitle: 'Inteligentna Automatyzacja (n8n/Python)',
      devTitle: 'ETL & Automated Pipelines',
      bizDesc: 'Tworzenie mostów technologicznych łączących systemy CRM, ERP, hurtownie i bramki płatnicze w jeden, samonaprawiający się ekosystem.',
      devDesc: 'Building robust n8n and Python/FastAPI middleware. Intelligent webhooks parsing, automated retry logic, and seamless BaseLinker/Stripe/ERP API integrations.',
    },
    {
      icon: <LineChart className="w-8 h-8 text-[#FF6900]" />,
      bizTitle: 'Zaawansowane Systemy SaaS & BI',
      devTitle: 'Business Intelligence SaaS',
      bizDesc: 'Kompletne panele analityczne, systemy rezerwacji i panele Business Intelligence wspierające codzienne decyzje biznesowe w czasie rzeczywistym.',
      devDesc: 'Custom dashboard architectures combining React Recharts with Node.js/Python clustering algorithms (K-Means) for real-time market prediction and "What-If" simulations.',
    }
  ];

  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#0B0B0C] border-t border-[#161618] relative overflow-hidden z-10">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#161618]/50 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-[#F5F5F7] tracking-tight mb-6">
            {isDevMode ? 'Core Engineering Competencies' : 'Rozwiązania, które skalują Twój zysk'}
          </h2>
          <div className="w-20 h-1 bg-[#FF6900] rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="bg-[#161618] border border-[#222225] rounded-[2rem] p-8 md:p-10 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all group"
            >
              <div className="mb-8">{feat.icon}</div>
              <h3 className="text-2xl font-bold text-[#F5F5F7] mb-4">
                {isDevMode ? feat.devTitle : feat.bizTitle}
              </h3>
              <p className="text-[#A1A1A5] font-light leading-relaxed">
                {fixOrphans(isDevMode ? feat.devDesc : feat.bizDesc)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
