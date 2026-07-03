/**
 * Nav-related behaviors that don't belong to any single overlay:
 *  - Scroll progress bar
 *  - `.nav.scrolled` styling toggle
 *  - Active-section link highlighting
 *  - Mobile sheet open/close
 */

import { $, $$ } from "./util.js";

let sheetEl;
let burgerEl;

/**
 * Open/close the mobile menu sheet.
 * @param {boolean} [open] Force to this state; toggle if omitted.
 */
export const toggleSheet = (open) => {
  if (!sheetEl || !burgerEl) return;
  const isOpen = open ?? !sheetEl.classList.contains("open");
  sheetEl.classList.toggle("open", isOpen);
  burgerEl.classList.toggle("open", isOpen);
  burgerEl.setAttribute("aria-expanded", String(isOpen));
  sheetEl.setAttribute("aria-hidden", String(!isOpen));
};

export const isSheetOpen = () => sheetEl?.classList.contains("open") ?? false;

export const initNav = () => {
  const progressBar = $("#progressBar");
  const nav = $("#nav");
  sheetEl = $("#sheet");
  burgerEl = $("#burger");

  // Scroll progress + nav background toggle
  const onScroll = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    if (progressBar) progressBar.style.transform = `scaleX(${max > 0 ? h.scrollTop / max : 0})`;
    nav?.classList.toggle("scrolled", h.scrollTop > 24);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Active section highlighting
  const navLinks = $$("[data-nav]");
  const sections = navLinks.map((a) => $(`#${a.dataset.nav}`)).filter(Boolean);
  if (sections.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            navLinks.forEach((a) =>
              a.classList.toggle("active", a.dataset.nav === e.target.id)
            );
          }
        });
      },
      { rootMargin: "-38% 0px -55% 0px" }
    );
    sections.forEach((s) => io.observe(s));
  }

  // Mobile menu
  burgerEl?.addEventListener("click", () => toggleSheet());
  $$(".sheet-links a").forEach((a) =>
    a.addEventListener("click", () => toggleSheet(false))
  );
};
