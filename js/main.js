/**
 * ═══════════════════════════════════════════════════════════════
 * jihad.dev — entry point
 *
 * Wires together the modules under ./modules/. Load order matters
 * only where a module needs another already installed (palette →
 * terminal → matrix). Everything else is independent.
 *
 * Zero dependencies. Zero build step. Pure ES modules.
 * ═══════════════════════════════════════════════════════════════
 */

import { $ }             from "./modules/util.js";
import { runBoot }       from "./modules/boot.js";
import { initReveals, runCounters } from "./modules/reveal.js";
import { runTyped }      from "./modules/typed.js";
import { initNav, toggleSheet, isSheetOpen } from "./modules/nav.js";
import { initParticles } from "./modules/particles.js";
import { initCursor, initMagnetic, initTilt } from "./modules/interactions.js";
import { initKonami, stopMatrix, isMatrixOn }  from "./modules/matrix.js";
import { initTerminal, openTerm, closeTerm, isTermOpen } from "./modules/terminal.js";
import { initPalette, openPalette, closePalette, isPaletteOpen } from "./modules/palette.js";
import { copyEmail }     from "./modules/toast.js";

/* ── Global keyboard shortcuts ─────────────────────────────── */
const initShortcuts = () => {
  document.addEventListener("keydown", (e) => {
    const typing = /^(input|textarea|select)$/i.test(document.activeElement?.tagName || "");

    // ⌘/Ctrl + K — toggle command palette
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      isPaletteOpen() ? closePalette() : openPalette();
      return;
    }

    // Escape — collapse whichever overlay is on top
    if (e.key === "Escape") {
      if (isMatrixOn())      return stopMatrix();
      if (isPaletteOpen())   return closePalette();
      if (isTermOpen())      return closeTerm();
      if (isSheetOpen())     return toggleSheet(false);
    }

    // Backtick — toggle terminal (unless typing or palette is open)
    if (e.key === "`" && !typing && !isPaletteOpen()) {
      e.preventDefault();
      isTermOpen() ? closeTerm() : openTerm();
    }
  });
};

/* ── Small delights ────────────────────────────────────────── */
const initDelights = () => {
  const hour = new Date().getHours();
  const greeting = $("#greeting");
  if (greeting) {
    greeting.textContent =
      hour < 5  ? "Up late?"       :
      hour < 12 ? "Good morning"   :
      hour < 18 ? "Good afternoon" : "Good evening";
  }

  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  // Signature for anyone brave enough to open DevTools
  console.log(
    "%c>_ jihad.dev %c\n\nInspecting the source? Respect. 🤝\nThis site is 100% handmade — no frameworks, no templates.\nTry the terminal: press ` — or ⌘K for the palette.\n",
    "font-size:18px;font-weight:bold;background:linear-gradient(90deg,#38bdf8,#818cf8,#f472b6);color:#fff;padding:6px 14px;border-radius:8px;",
    "color:#93a0ba;font-size:12px;"
  );

  // Copy-email button (contact section)
  $("#copyEmail")?.addEventListener("click", copyEmail);
};

/* ── Ignition ──────────────────────────────────────────────── */
initNav();
initPalette();
initTerminal();
initKonami();
initShortcuts();
initDelights();

runTyped();
runCounters();
initParticles();
initCursor();
initMagnetic();
initTilt();

// Boot fades away, then reveals kick in.
runBoot(initReveals);
