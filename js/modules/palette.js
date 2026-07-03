/**
 * Command palette (⌘K / Ctrl+K). Fuzzy-ish keyword search, arrow/enter
 * to run. Commands can navigate the page, open the terminal, launch
 * the matrix easter egg, copy the email, or open external profiles.
 */

import { $, $$, RM } from "./util.js";
import { openTerm } from "./terminal.js";
import { startMatrix } from "./matrix.js";
import { copyEmail, EMAIL } from "./toast.js";

let palette, paletteInput, paletteList;
let filtered = [];
let activeIdx = 0;

const goTo = (id) => {
  closePalette();
  $(id)?.scrollIntoView({ behavior: RM ? "auto" : "smooth" });
};

const COMMANDS = [
  { icon: "👤",  label: "Go to About",         hint: "/about",       kw: "about bio",                    run: () => goTo("#about") },
  { icon: "📈",  label: "Go to Experience",    hint: "/experience",  kw: "experience career jobs timeline", run: () => goTo("#experience") },
  { icon: "🛠️",  label: "Go to Projects",      hint: "/projects",    kw: "projects work hearize",         run: () => goTo("#projects") },
  { icon: "✍️",  label: "Go to Writing",        hint: "/writing",     kw: "writing articles blog dev.to posts", run: () => goTo("#writing") },
  { icon: "⚡",  label: "Go to Skills",         hint: "/skills",      kw: "skills stack tech",             run: () => goTo("#skills") },
  { icon: "🎓",  label: "Go to Education",     hint: "/education",   kw: "education degree university",   run: () => goTo("#education") },
  { icon: "✉️",  label: "Go to Contact",       hint: "/contact",     kw: "contact email reach",           run: () => goTo("#contact") },
  { icon: "📄",  label: "Open résumé",         hint: "resume.html",  kw: "resume cv download pdf",        run: () => { closePalette(); window.location.href = "resume.html"; } },
  { icon: "⧉",   label: "Copy email address",  hint: EMAIL,          kw: "copy email clipboard",          run: () => { closePalette(); copyEmail(); } },
  { icon: "🐙",  label: "Open GitHub",         hint: "↗",            kw: "github code repos",             run: () => { closePalette(); window.open("https://github.com/jihadabuzuhri", "_blank"); } },
  { icon: "💼",  label: "Open LinkedIn",       hint: "↗",            kw: "linkedin profile",              run: () => { closePalette(); window.open("https://www.linkedin.com/in/jihadabuzuhri/", "_blank"); } },
  { icon: "📝",  label: "Open dev.to profile", hint: "↗",            kw: "devto dev.to blog articles writing", run: () => { closePalette(); window.open("https://dev.to/jihadabuzuhri", "_blank"); } },
  { icon: ">_",  label: "Open terminal",       hint: "`",            kw: "terminal shell console cli",    run: () => { closePalette(); openTerm(); } },
  { icon: "🟩",  label: "Enter the matrix",    hint: "easter egg",   kw: "matrix rain easter egg fun",    run: () => { closePalette(); startMatrix(); } },
  { icon: "↑",   label: "Back to top",         hint: "home",         kw: "top home start",                run: () => goTo("#top") },
];

const render = () => {
  if (!filtered.length) {
    paletteList.innerHTML = `<li class="palette-empty mono">no results — 404</li>`;
    return;
  }
  paletteList.innerHTML = filtered
    .map(
      (c, i) => `
        <li class="palette-item ${i === activeIdx ? "active" : ""}" data-idx="${i}">
          <span class="pi-icon">${c.icon}</span>
          <span class="pi-label">${c.label}</span>
          <span class="pi-hint">${c.hint}</span>
        </li>`
    )
    .join("");
  paletteList.querySelector(".active")?.scrollIntoView({ block: "nearest" });
};

export const openPalette = () => {
  palette ??= $("#palette");
  if (!palette) return;
  palette.hidden = false;
  document.body.classList.add("no-scroll");
  paletteInput.value = "";
  filtered = [...COMMANDS];
  activeIdx = 0;
  render();
  requestAnimationFrame(() => paletteInput.focus());
};

export const closePalette = () => {
  if (!palette) return;
  palette.hidden = true;
  document.body.classList.remove("no-scroll");
};

export const isPaletteOpen = () => palette && !palette.hidden;

export const initPalette = () => {
  palette = $("#palette");
  paletteInput = $("#paletteInput");
  paletteList = $("#paletteList");
  if (!palette) return;

  $("#paletteBtn")?.addEventListener("click", openPalette);
  $$("[data-palette-close]").forEach((el) => el.addEventListener("click", closePalette));

  paletteInput.addEventListener("input", () => {
    const q = paletteInput.value.trim().toLowerCase();
    filtered = COMMANDS.filter(
      (c) => c.label.toLowerCase().includes(q) || c.kw.includes(q)
    );
    activeIdx = 0;
    render();
  });

  paletteInput.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); activeIdx = (activeIdx + 1) % filtered.length; render(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); activeIdx = (activeIdx - 1 + filtered.length) % filtered.length; render(); }
    else if (e.key === "Enter" && filtered[activeIdx]) filtered[activeIdx].run();
  });

  paletteList.addEventListener("click", (e) => {
    const item = e.target.closest(".palette-item");
    if (item) filtered[+item.dataset.idx]?.run();
  });
};
