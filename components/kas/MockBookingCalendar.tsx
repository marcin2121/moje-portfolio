'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function MockBookingCalendar() {
  const [step, setStep] = useState(1);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedHour, setSelectedHour] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 1)); 

  React.useEffect(() => {
    const now = new Date();
    setCurrentDate(new Date(now.getFullYear(), now.getMonth(), 1));
  }, []);

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const startDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const startOffset = startDay === 0 ? 6 : startDay - 1; 
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const monthNames = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
  const monthNamesGenitive = ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'];
  const monthName = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  const isPastDay = (day: number) => {
    const today = new Date();
    const dateToCheck = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const todayZero = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return dateToCheck < todayZero;
  };

  const hours = ['09:00', '10:00', '13:00', '15:30', '16:00', '18:00'];

  const handleDaySelect = (day: number) => {
    setSelectedDay(day);
    setStep(2);
  };

  const handleHourSelect = (hour: string) => {
    setSelectedHour(hour);
    setStep(3);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(4);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-12">
      <div className="flex-1 w-full max-w-md mx-auto relative">
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Wybór dnia */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <button onClick={prevMonth} aria-label="Poprzedni miesiąc" className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                  <h4 className="font-bold text-slate-800 w-40 text-center">{monthName}</h4>
                  <button onClick={nextMonth} aria-label="Następny miesiąc" className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"><ChevronRight className="w-5 h-5" /></button>
                </div>
                <div className="grid grid-cols-7 gap-2 text-center mb-2">
                  {['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'].map(d => (
                    <div key={d} className="text-xs font-bold text-slate-400">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1 sm:gap-2">
                  {Array(startOffset).fill(null).map((_, i) => <div key={`empty-${i}`} />)}
                  {days.map(day => {
                    const disabled = isPastDay(day);
                    return (
                      <button 
                        key={day} 
                        onClick={() => !disabled && handleDaySelect(day)}
                        disabled={disabled}
                        className={`aspect-square flex items-center justify-center rounded-xl font-medium transition-colors text-sm sm:text-base ${disabled ? 'text-slate-300 bg-slate-50/50 cursor-not-allowed' : 'text-slate-700 hover:bg-orange-500 hover:text-white cursor-pointer'}`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 2: Wybór godziny */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="p-6">
                <button onClick={() => setStep(1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 text-sm font-bold">
                  <ChevronLeft className="w-4 h-4" /> Wróć do kalendarza
                </button>
                <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Calendar className="w-5 h-5 text-orange-500" /> {selectedDay} {monthNamesGenitive[currentDate.getMonth()]} - Wybierz godzinę</h4>
                <div className="grid grid-cols-2 gap-3">
                  {hours.map(hour => (
                    <button 
                      key={hour}
                      onClick={() => handleHourSelect(hour)}
                      className="py-3 border-2 border-slate-200 rounded-xl text-slate-700 hover:border-orange-500 hover:text-orange-600 font-bold transition-all"
                    >
                      {hour}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 3: Formularz */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="p-6">
                <button onClick={() => setStep(2)} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 text-sm font-bold">
                  <ChevronLeft className="w-4 h-4" /> Zmień godzinę
                </button>
                <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-500" /> {selectedDay} {monthNamesGenitive[currentDate.getMonth()]}, {selectedHour}
                </h4>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Imię lub Pseudonim</label>
                    <input type="text" required placeholder="np. Jan" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-slate-900" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">E-mail (do wysłania linku na spotkanie)</label>
                    <input type="email" required placeholder="jan@example.com" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-slate-900" />
                  </div>
                  <button type="submit" className="w-full py-4 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20">
                    Potwierdź rezerwację
                  </button>
                </form>
              </motion.div>
            )}

            {/* STEP 4: Sukces */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-10 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-black text-2xl text-slate-900 mb-2">Zapisano!</h4>
                <p className="text-slate-600 mb-8">Twój termin to {selectedDay} {monthNamesGenitive[currentDate.getMonth()]} o {selectedHour}. Wysłaliśmy Ci maila z linkiem. Pamiętaj, jesteś w pełni anonimowy.</p>
                <button onClick={() => {setStep(1); setSelectedDay(null); setSelectedHour(null);}} className="text-orange-500 font-bold hover:underline">
                  Zarezerwuj kolejny termin
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      <div className="flex-1 lg:pl-12 flex flex-col justify-center">
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-3 text-rose-400 mb-3">
            <AlertTriangle className="w-6 h-6" />
            <h4 className="font-bold text-lg">Błąd "Kalendarz.php" rozwiązany</h4>
          </div>
          <p className="text-slate-300 leading-relaxed">
            Obecna strona potrafi się zawiesić wyświetlając błąd serwera <code>Kalendarz.php</code>. Taka awaria oznacza, że młody człowiek szukający pilnego wsparcia, odbija się od ściany.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-1">
              <span className="text-emerald-400 font-bold">1</span>
            </div>
            <div>
              <h5 className="font-bold text-white mb-1">Architektura Next.js (Frictionless)</h5>
              <p className="text-slate-400 text-sm">Zwróć uwagę, jak płynnie przebiega proces. Zero ładowania nowych podstron. Wszystko dzieje się natychmiast.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-1">
              <span className="text-emerald-400 font-bold">2</span>
            </div>
            <div>
              <h5 className="font-bold text-white mb-1">Anonimowość (Privacy by Design)</h5>
              <p className="text-slate-400 text-sm">Nie wymagamy dokładnych danych. Brak śledzenia IP i ciasteczek. "Imię lub pseudonim" buduje zaufanie do KAS.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-1">
              <span className="text-emerald-400 font-bold">3</span>
            </div>
            <div>
              <h5 className="font-bold text-white mb-1">Bezpieczeństwo na przeciążenia</h5>
              <p className="text-slate-400 text-sm">Nawet przy nagłym, gigantycznym ruchu na stronie (np. z kampanii w szkołach), ten interfejs nigdy nie rzuci błędem PHP, bo serwujemy go ze statycznego CDN.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
