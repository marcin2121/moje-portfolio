# 🚀 Marcin Molenda - Premium Portfolio 2026

Portfolio stworzone w technologii **Next.js**, zaprojektowane jako interaktywne i płynne doświadczenie użytkownika (UI/UX) wykorzystujące model 3D oraz motion design.

---

## 🛠️ Architektura i Stack Technologiczny

Projekt łączy w sobie najnowsze standardy web developmentu:

- **Framework:** [Next.js](https://nextjs.org/) (App Router, dynamiczne ładowanie)
- **3D & Canvas:** [@react-three/fiber](https://r3f.docs.pmnd.rs/), [@react-three/drei](https://github.com/pmndrs/drei), [Three.js](https://threejs.org/)
- **Animacje:** [GSAP](https://gsap.com/) + [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/), [Framer Motion](https://www.framer.com/motion/)
- **Smooth Scroll:** [Lenis](https://lenis.darkroom.engineering/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Biblioteki Pomocnicze:** Lucide Icons, use-sound, Radix UI

---

## ✨ Kluczowe Funkcje

- **Interaktywność 3D:** Model `UrwisModel` osadzony w scenie R3F, reagujący na interakcję i płynnie wkomponowany w układ strony.
- **Scroll Snapping & Bento Grid:** Praca z wieloma sekcjami oparta na płynnym scrollowaniu horyzontalnym sterowanym za pomocą GSAP.
- **Wbudowane demo (Viewport Preview):** Modal pozwalający na testowanie działania innych projektów (np. Sklep Urwis, zamowtu.pl) w widoku **Desktop / Mobile** bezpośrednio w interfejsie portfolio.
- **Głęboka Optymalizacja:** Wykorzystanie `dynamic()` i `requestIdleCallback` (rIC) dla maksymalnego odciążenia głównego wątku przeglądarki i błyskawicznego ładowania.

---

## 📁 Struktura Projektu

- `/app` – Główna struktura stron (Next.js App Router). Zawiera `page.tsx` z globalną nawigacją i płynną logiką ScrollTrigger.
- `/components` – Modułowe komponenty:
  - `/ui` – `MagicBento`, `MagneticWrapper`, `Particles` itp.
  - `Hero.tsx` – Landing i intro.
  - `UrwisModel.tsx` – Logika canvasu 3D.
- `/public` – Zasoby statyczne (modele 3D, grafiki, efekty dźwiękowe).

---

## 🚀 Instalacja i Uruchomienie

Aby uruchomić projekt lokalnie, wykonaj poniższe kroki.

### Instalacja Zależności
```bash
npm install
```

### Uruchomienie Serwera Develomentu
```bash
npm run dev
```

Otwórz [http://localhost:3000](http://localhost:3000) w przeglądarce, aby zobaczyć efekt.

### Budowanie Wersji Produkcyjnej
```bash
npm run build
```

---

## 🤝 Kontakt
- **Email:** kontakt@molendadevelopment.pl
