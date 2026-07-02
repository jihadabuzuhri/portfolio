# >_ jihad.dev — Portfolio

Personal portfolio of **Jihad Abu Zuhri** — Principal Software Engineer (Backend Systems · Platform Architecture · Agentic AI).

Hand-crafted from scratch. **Zero frameworks, zero templates, zero build step, zero dependencies.** Just HTML, CSS, and vanilla JavaScript doing more than people think they can.

## ✨ Features

- **Terminal boot sequence** — the site "SSHes in" before it loads (skipped on repeat visits & for reduced-motion users)
- **Interactive particle network** in the hero — a living distributed-systems topology that reacts to your cursor
- **`⌘K` command palette** — navigate the entire site like a dev tool
- **A real working terminal** — press <kbd>`</kbd> and try `help`, `neofetch`, `cat profile.json`, `sudo hire-me`
- **API-styled sections** — `GET /experience 200 OK`, because backend is a personality trait
- **Career timeline** — Intern → Principal in under 4 years, with promotion markers
- **Custom cursor, magnetic buttons, 3D tilt cards, scroll reveals, animated counters, infinite marquee**
- **Matrix easter egg** — Konami code (`↑↑↓↓←→←→BA`), the `matrix` terminal command, or the palette
- **Print-ready résumé** at [`resume.html`](resume.html) — "Download PDF" straight from the browser
- **Accessible & responsive** — semantic landmarks, keyboard support, `prefers-reduced-motion` respected, mobile-first breakpoints
- **SEO-ready** — Open Graph tags + JSON-LD structured data

## 🗂 Structure

```
├── index.html        # the portfolio
├── resume.html       # print-optimized résumé (always up to date)
├── css/style.css     # design system + all animation
├── js/main.js        # interaction engine (palette, terminal, canvas, …)
└── assets/           # photo, favicon
```

## 🚀 Run locally

Any static server works:

```bash
python3 -m http.server 4173
# → http://localhost:4173
```

## 🌍 Deploy to GitHub Pages

1. Create a repo (e.g. `jihadabuzuhri.github.io` for a root domain, or any name for a project page)
2. Push:
   ```bash
   git remote add origin git@github.com:jihadabuzuhri/<repo>.git
   git push -u origin main
   ```
3. Repo **Settings → Pages → Source: main branch** — done.

## 🥚 Easter eggs

| Trigger | Result |
|---|---|
| <kbd>⌘K</kbd> / <kbd>Ctrl+K</kbd> | Command palette |
| <kbd>`</kbd> | Terminal |
| `sudo hire-me` (in terminal) | Access granted ✓ |
| `↑↑↓↓←→←→BA` | 🐇 |
| DevTools console | A note for fellow engineers |

---

© 2026 Jihad Abu Zuhri · Designed & engineered by hand.
