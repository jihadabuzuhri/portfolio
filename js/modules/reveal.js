/**
 * Scroll-triggered reveals and animated number counters. Both use
 * IntersectionObserver so nothing runs off-screen.
 */

import { $$, RM, clamp } from "./util.js";

/**
 * Fade + slide-up elements marked `.reveal` as they enter the viewport.
 * Siblings sharing a parent are staggered (0, 90, 180, ..., 450ms).
 */
export const initReveals = () => {
  const els = $$(".reveal");
  if (RM || !("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("in"));
    return;
  }

  // Stagger siblings that share a parent
  const groups = new Map();
  els.forEach((el) => {
    const p = el.parentElement;
    if (!groups.has(p)) groups.set(p, 0);
    const idx = groups.get(p);
    el.style.setProperty("--reveal-delay", `${Math.min(idx * 90, 450)}ms`);
    groups.set(p, idx + 1);
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  els.forEach((el) => io.observe(el));
};

/**
 * Ease-out counters. Reads `data-count` (target) and `data-decimals`
 * (precision) off each element and animates from 0 → target on entry.
 */
export const runCounters = () => {
  const els = $$("[data-count]");

  const animate = (el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    if (RM) { el.textContent = target.toFixed(decimals); return; }

    const dur = 1500;
    const t0 = performance.now();
    const frame = (t) => {
      const p = clamp((t - t0) / dur, 0, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (p < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };

  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { animate(e.target); io.unobserve(e.target); }
    }),
    { threshold: 0.6 }
  );
  els.forEach((el) => io.observe(el));
};
