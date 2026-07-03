/**
 * Terminal-style preloader. Prints fake SSH lines and a progress bar,
 * then fades and removes itself. Skipped on repeat visits and for
 * users with prefers-reduced-motion.
 */

import { $, RM } from "./util.js";

const LINES = [
  "$ ssh guest@jihad.dev",
  "→ resolving host ............ <span class='ok'>done</span>",
  "→ loading experience ........ <span class='ok'>principal</span>",
  "→ mounting /projects ........ <span class='ok'>ok</span>",
  "→ starting animations ....... <span class='accent'>60fps</span>",
  "<span class='ok'>Welcome.</span>",
];

/**
 * Runs the boot sequence and fires `onReady` once the door opens.
 * @param {() => void} onReady - called after the boot fades away.
 */
export const runBoot = (onReady) => {
  const boot = $("#boot");
  const bootLog = $("#bootLog");
  const bootBar = $("#bootBar");

  const finish = () => {
    boot?.classList.add("done");
    document.body.classList.remove("no-scroll");
    onReady?.();
    setTimeout(() => boot?.remove(), 700);
  };

  // Fast path: reduced motion or a warm session — skip theatrics.
  if (RM || sessionStorage.getItem("booted")) {
    sessionStorage.setItem("booted", "1");
    finish();
    return;
  }

  sessionStorage.setItem("booted", "1");
  document.body.classList.add("no-scroll");

  let i = 0;
  const step = () => {
    if (i < LINES.length) {
      bootLog.innerHTML += LINES[i] + "\n";
      bootBar.style.width = `${((i + 1) / LINES.length) * 100}%`;
      i++;
      setTimeout(step, i === LINES.length ? 350 : 130 + Math.random() * 110);
    } else {
      finish();
    }
  };
  step();
};
