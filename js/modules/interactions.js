/**
 * Pointer-driven flourishes for desktops with a real cursor:
 *  - Two-part custom cursor (dot + lagging ring)
 *  - Magnetic buttons ([data-magnetic])
 *  - 3D tilt cards     ([data-tilt])
 *
 * All three no-op on touch devices or with reduced-motion.
 */

import { $, $$, RM, FINE, lerp } from "./util.js";

/** Two-part cursor: a dot that follows exactly, a ring that lags smoothly. */
export const initCursor = () => {
  if (!FINE || RM) return;
  const dot = $("#cursorDot");
  const ring = $("#cursorRing");
  if (!dot || !ring) return;

  let x = -100, y = -100, rx = -100, ry = -100, started = false;

  window.addEventListener("pointermove", (e) => {
    x = e.clientX; y = e.clientY;
    if (!started) {
      started = true;
      rx = x; ry = y;
      document.body.classList.add("cursor-on");
      loop();
    }
    dot.style.transform = `translate(${x}px, ${y}px) translate(-50%,-50%)`;
  });

  const loop = () => {
    rx = lerp(rx, x, 0.16);
    ry = lerp(ry, y, 0.16);
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  };

  const HOVERABLE = "a, button, input, [data-tilt], kbd";
  document.addEventListener("pointerover", (e) => {
    if (e.target.closest(HOVERABLE)) ring.classList.add("hover");
  });
  document.addEventListener("pointerout", (e) => {
    if (e.target.closest(HOVERABLE)) ring.classList.remove("hover");
  });
};

/** Buttons that lean toward the cursor when it approaches. */
export const initMagnetic = () => {
  if (!FINE || RM) return;
  $$("[data-magnetic]").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const mx = e.clientX - (r.left + r.width / 2);
      const my = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${mx * 0.18}px, ${my * 0.22}px)`;
    });
    el.addEventListener("pointerleave", () => {
      el.style.transition = "transform .45s cubic-bezier(.2,.8,.3,1.4)";
      el.style.transform = "";
      setTimeout(() => (el.style.transition = ""), 460);
    });
  });
};

/** Cards that rotate slightly on pointer hover for a parallax feel. */
export const initTilt = () => {
  if (!FINE || RM) return;
  $$("[data-tilt]").forEach((el) => {
    const strength = el.classList.contains("contact-card") ? 2.4 : 5.5;
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform =
        `perspective(900px) rotateX(${(-py * strength).toFixed(2)}deg) rotateY(${(px * strength).toFixed(2)}deg) translateY(-2px)`;
    });
    el.addEventListener("pointerleave", () => {
      el.style.transition = "transform .5s cubic-bezier(.2,.8,.3,1)";
      el.style.transform = "";
      setTimeout(() => (el.style.transition = ""), 520);
    });
  });
};
