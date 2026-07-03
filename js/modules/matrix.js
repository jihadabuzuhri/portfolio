/**
 * Full-viewport matrix rain easter egg. Uses Arabic letters of "Jihad"
 * (ج ه ا د) plus common code glyphs. Auto-stops after 14s or on click.
 * Also owns the Konami code detector that opens it.
 */

import { $ } from "./util.js";
import { toast } from "./toast.js";

let canvas;
let on = false;
let raf;
let timer;

export const isMatrixOn = () => on;

export const startMatrix = () => {
  canvas ??= $("#matrix");
  if (!canvas || on) return;

  on = true;
  canvas.hidden = false;
  document.body.classList.add("no-scroll");
  toast("🐇 follow the white rabbit — click or ESC to exit");

  const ctx = canvas.getContext("2d");
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width  = innerWidth  * DPR;
  canvas.height = innerHeight * DPR;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

  const GLYPHS = "ج ه ا د 0 1 { } < > / ; = λ # $ & %".split(" ");
  const fs   = 16;
  const cols = Math.ceil(innerWidth / fs);
  const drops = Array.from({ length: cols }, () => Math.random() * -40);

  let last = 0;
  const step = (t) => {
    if (!on) return;
    if (t - last > 50) {
      last = t;
      ctx.fillStyle = "rgba(2, 4, 8, 0.16)";
      ctx.fillRect(0, 0, innerWidth, innerHeight);
      ctx.font = `${fs}px "JetBrains Mono", monospace`;
      for (let i = 0; i < cols; i++) {
        const ch = GLYPHS[(Math.random() * GLYPHS.length) | 0];
        const y  = drops[i] * fs;
        ctx.fillStyle = Math.random() > 0.975 ? "#e8ecf8" : "rgba(52, 211, 153, 0.9)";
        ctx.fillText(ch, i * fs, y);
        if (y > innerHeight && Math.random() > 0.976) drops[i] = 0;
        drops[i]++;
      }
    }
    raf = requestAnimationFrame(step);
  };

  raf = requestAnimationFrame(step);
  timer = setTimeout(stopMatrix, 14000);
};

export const stopMatrix = () => {
  if (!on) return;
  on = false;
  cancelAnimationFrame(raf);
  clearTimeout(timer);
  canvas.hidden = true;
  canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  document.body.classList.remove("no-scroll");
};

/** Listen for ↑↑↓↓←→←→BA and drop into the matrix. */
export const initKonami = () => {
  canvas ??= $("#matrix");
  canvas?.addEventListener("click", stopMatrix);

  const CODE = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
  let idx = 0;
  document.addEventListener("keydown", (e) => {
    idx = e.key === CODE[idx] ? idx + 1 : (e.key === CODE[0] ? 1 : 0);
    if (idx === CODE.length) { idx = 0; startMatrix(); }
  });
};
