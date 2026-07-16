import React from 'react';
import { Clock, Activity } from 'lucide-react';
import MockBookingCalendar from '@/components/kas/MockBookingCalendar';
import ApiSimulator from '@/components/kas/ApiSimulator';

export default function KasPrototypesSection() {
  return (
    <section id="prototypy" className="py-24 bg-slate-900 text-white rounded-[3rem] mx-4 md:mx-12 lg:mx-24 mb-32 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black mb-6">Zobacz, jak działa niezawodna technologia.</h2>
          <p className="text-slate-400 text-lg">Przetestuj interaktywne prototypy poniżej. To ułamek tego, co otrzymacie w finalnym produkcie.</p>
        </div>

        <div className="space-y-24">
          {/* Prototyp 1: Kalendarz */}
          <div>
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-3"><Clock className="text-orange-500" /> Prototyp 1: Niezawodny system zapisów</h3>
            <p className="text-slate-400 mb-8">Zauważyłem ślady po próbie wdrożenia kalendarza (skrypt Kalendarz.php). Rozumiem, jak bardzo potrzebujecie tego narzędzia. Powyższy prototyp Next.js działa bez przeładowania strony, jest w 100% odporny na awarie bazodanowe i chroni anonimowość podopiecznych.</p>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-12 print:hidden">
              <MockBookingCalendar />
            </div>
          </div>

          {/* Prototyp 2: Symulator API */}
          <div>
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-3"><Activity className="text-orange-500" /> Prototyp 2: Pełna Automatyzacja (n8n)</h3>
            <p className="text-slate-400 mb-8">Zobacz na żywo, jak dane wędrują w bezpieczny i zaszyfrowany sposób, odciążając Was od papierkowej roboty.</p>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-12 print:hidden">
              <ApiSimulator />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
