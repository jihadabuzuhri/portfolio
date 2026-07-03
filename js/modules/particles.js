/**
 * Interactive particle network behind the hero. Nodes drift, connect
 * with fading lines below a distance threshold, and gently repel the
 * cursor. Auto-pauses when the tab is hidden or the canvas scrolls off.
 */

import { $, RM, clamp } from "./util.js";

export const initParticles = () => {
  const canvas = $("#net");
  if (!canvas || RM) return;

  const ctx = canvas.getContext("2d");
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  const LINK_DIST = 135;
  let W, H, nodes = [], visible = true;
  const mouse = { x: -9999, y: -9999 };

  const resize = () => {
    const r = canvas.parentElement.getBoundingClientRect();
    W = r.width; H = r.height;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    const count = clamp(Math.round((W * H) / 16000), 30, 90);
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: 1 + Math.random() * 1.6,
    }));
  };

  const draw = () => {
    if (!visible || document.hidden) { requestAnimationFrame(draw); return; }
    ctx.clearRect(0, 0, W, H);

    // Update positions (with gentle mouse repulsion)
    for (const n of nodes) {
      const dx = n.x - mouse.x, dy = n.y - mouse.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < 22500) {
        const d = Math.sqrt(d2) || 1;
        n.vx += (dx / d) * 0.045;
        n.vy += (dy / d) * 0.045;
      }
      n.vx = clamp(n.vx, -0.6, 0.6);
      n.vy = clamp(n.vy, -0.6, 0.6);
      n.x += n.vx; n.y += n.vy;
      if (n.x < -20) n.x = W + 20; if (n.x > W + 20) n.x = -20;
      if (n.y < -20) n.y = H + 20; if (n.y > H + 20) n.y = -20;
    }

    // Edges
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.hypot(dx, dy);
        if (d < LINK_DIST) {
          const o = (1 - d / LINK_DIST) * 0.5;
          ctx.strokeStyle = `rgba(110, 140, 248, ${o * 0.55})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // Nodes
    ctx.fillStyle = "rgba(96, 165, 250, 0.75)";
    for (const n of nodes) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(draw);
  };

  canvas.parentElement.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });
  canvas.parentElement.addEventListener("pointerleave", () => {
    mouse.x = -9999; mouse.y = -9999;
  });

  new IntersectionObserver((e) => { visible = e[0].isIntersecting; }).observe(canvas);
  window.addEventListener("resize", resize);
  resize();
  draw();
};
