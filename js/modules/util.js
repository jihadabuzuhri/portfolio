/**
 * DOM helpers, math helpers, environment flags, and a safe HTML escaper.
 * These are dependency-free and shared by every other module.
 */

export const $  = (s, c = document) => c.querySelector(s);
export const $$ = (s, c = document) => [...c.querySelectorAll(s)];

export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const lerp  = (a, b, t) => a + (b - a) * t;

/** True if the user prefers reduced motion. Respected everywhere. */
export const RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** True on devices that support real hover (desktop mice/trackpads). */
export const FINE = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/** Escape user input before inserting into HTML. */
export const escapeHtml = (s) =>
  s.replace(/[&<>"']/g, (m) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m])
  );
