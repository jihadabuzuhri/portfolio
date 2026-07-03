/**
 * Small transient message shown at the bottom-center of the viewport.
 * Also exports copyEmail() since it's the most common toast trigger.
 */

import { $ } from "./util.js";

const EMAIL = "jihadabuzuhri@gmail.com";
let toastEl;
let toastTimer;

/** Display `msg` for ~2.4s. Reuses a single element. */
export const toast = (msg) => {
  toastEl ??= $("#toast");
  if (!toastEl) return;
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2400);
};

/** Copy the email to the clipboard and toast either way. */
export const copyEmail = async () => {
  try {
    await navigator.clipboard.writeText(EMAIL);
    toast("201 Created — email copied ✓");
  } catch {
    toast(EMAIL);
  }
};

export { EMAIL };
