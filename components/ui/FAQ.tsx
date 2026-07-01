'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { fixOrphans } from '@/utils/typography';

const FAQ_ITEMS = [
  {
    question: "Jak wyglądają kwestie płatności i zaliczki? Co, jeśli projekt mi się nie spodoba?",
    answer: "Pracujemy na absolutnie przejrzystych zasadach B2B, bez ukrytych gwiazdek. Aby zarezerwować termin i rozpocząć prace, pobieram standardową zaliczkę (zazwyczaj 30-40%). Twoje pieniądze są jednak w pełni bezpieczne, bo chroni Cię Żelazna Gwarancja 7 Dni. Jeśli po tygodniu od przedstawienia wstępnego projektu graficznego powiesz: „Marcin, to zupełnie nie moja bajka” – bez zadawania pytań odsyłam 100% zaliczki w 24 godziny. To ja ponoszę ryzyko. Resztę kwoty rozliczamy dopiero na samym końcu, gdy strona jest gotowa, przetestowana i w pełni spełnia Twoje oczekiwania."
  },
  {
    question: "Czy po oddaniu strony będę uwiązany jakimś abonamentem?",
    answer: "Nie. Kod strony jest w 100% Twoją własnością. Nie ma żadnych \"ukrytych licencji\" ani opłat za utrzymanie u mnie. Jeśli za rok zechcesz oddać tę stronę pod opiekę innemu programistowi – jednym kliknięciem przekazuję mu komplet uprawnień."
  },
  {
    question: "Dlaczego nie robisz stron na WordPressie? Mój znajomy mi to polecał.",
    answer: "Ponieważ 80% wszystkich ataków hakerskich w internecie dotyczy WordPressa, a jego darmowe wtyczki po aktualizacji potrafią \"wyłożyć\" sklep w najgorętszym okresie sprzedaży. Buduję strony w technologii Next.js (używa jej m.in. Netflix czy Nike). Dzięki temu Twoja strona jest praktycznie niemożliwa do zhakowania i działa z prędkością światła."
  },
  {
    question: "Co się stanie, jeśli po 3 miesiącach coś na stronie przestałoby działać?",
    answer: "W cenie każdego projektu dostajesz ode mnie 6 miesięcy opieki technicznej. Jeśli cokolwiek z winy kodu przestanie funkcjonować prawidłowo – naprawiam to na swój koszt. Po upływie pół roku możesz wykupić pakiet stałej opieki, ale nie dlatego, że się psują (bo są tak stabilne!), tylko po to abym mógł na bieżąco wprowadzać aktualizacje, które w tak szybko pędzącym świecie technologii pozwolą Ci zawsze być na topie i być zawsze o krok przed konkurencją."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <section id="faq" className="w-full py-24 sm:py-32 px-6 sm:px-10 lg:px-20 bg-transparent relative overflow-hidden border-t border-slate-200/50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="max-w-4xl mx-auto w-full">
        <div className="flex flex-col items-center text-center mb-10 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-md mb-6 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            <span className="font-mono text-[9px] text-slate-600 uppercase tracking-widest">FAQ</span>
          </div>
          <h2 className="text-4xl sm:text-6xl text-slate-900 tracking-tighter mb-6 font-black">Odpowiedzi na obawy</h2>
          <p className="text-slate-600 text-sm sm:text-base font-light max-w-2xl">
            {fixOrphans(`Inwestycja w nowoczesną stronę to odpowiedzialna decyzja. Oto wyjaśnienie najczęstszych kwestii, bez owijania w bawełnę.`)}
          </p>
        </div>

        <div className="space-y-4">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index}
                className={`group border rounded-2xl transition-all duration-500 ${isOpen ? 'bg-white border-slate-200 shadow-premium-soft' : 'bg-transparent border-slate-200/50 hover:border-slate-300 hover:bg-white/40'}`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-6 sm:p-8 text-left"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  id={`faq-question-${index}`}
                >
                  <span className={`text-lg sm:text-xl font-medium transition-colors duration-300 ${isOpen ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-900'}`}>
                    {fixOrphans(item.question)}
                  </span>
                  <div className={`p-2 rounded-full transition-transform duration-500 shrink-0 ml-4 ${isOpen ? 'bg-orange-50 border border-orange-200 rotate-180 text-orange-600' : 'bg-white border border-slate-200 text-slate-400'}`}>
                    <ChevronDown size={20} />
                  </div>
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${index}`}
                      role="region"
                      aria-labelledby={`faq-question-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-8 sm:px-8 text-slate-600 text-sm sm:text-base leading-relaxed font-light border-t border-slate-200/50 pt-6">
                        {fixOrphans(item.answer)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
