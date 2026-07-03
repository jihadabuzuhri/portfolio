/**
 * Typewriter role rotator in the hero. Types a role, holds, deletes,
 * moves to the next. Freezes on the first role for reduced-motion users.
 */

import { $, RM } from "./util.js";

const ROLES = [
  "Principal Software Engineer",
  "Platform & Systems Architect",
  "Backend Specialist — .NET & Spring",
  "Agentic AI Explorer",
  "Co-Founder @ HEARIZE",
  "Mentor · Instructor · Team Lead",
];

export const runTyped = () => {
  const el = $("#typed");
  if (!el) return;
  if (RM) { el.textContent = ROLES[0]; return; }

  let ri = 0, ci = 0, deleting = false;
  const tick = () => {
    const word = ROLES[ri];
    el.textContent = word.slice(0, ci);

    let wait = deleting ? 26 : 52 + Math.random() * 40;
    if (!deleting && ci === word.length) { wait = 1900; deleting = true; }
    else if (deleting && ci === 0) { deleting = false; ri = (ri + 1) % ROLES.length; wait = 380; }
    else ci += deleting ? -1 : 1;

    setTimeout(tick, wait);
  };
  tick();
};
