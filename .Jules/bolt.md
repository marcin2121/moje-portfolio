## 2026-06-30 - [Performance] Prevent Unnecessary Array Reallocation
**Learning:** In Next.js client components (like those using `framer-motion`), declaring static arrays (like list of projects, pricing tiers, or features) inside the functional component body causes the JavaScript engine to reallocate memory for that array on every single re-render. While V8 is fast, doing this for large arrays containing strings and nested objects creates unnecessary garbage collection pressure and CPU cycles, especially during rapid state changes (e.g. scrolling).
**Action:** Always move static, non-reactive data structures outside of the React component function scope so they are allocated exactly once when the module is evaluated.

## 2026-06-30 - [Performance] Particles.tsx Canvas CPU Drain
**Issue:** The equestAnimationFrame loop in the Particles component was running continuously, even when the hero section was completely out of the viewport. This caused a constant background CPU drain of ~10-15%. Additionally, the canvas lacked a resize listener, causing potential layout stretch bugs on mobile rotation.
**Fix:** Implemented an IntersectionObserver to set an isVisible flag, skipping the ctx.clearRect and particle math when off-screen. Added a esize event listener to dynamically update the internal canvas bounds.
