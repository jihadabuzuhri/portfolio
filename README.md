<div align="center">

# `>_ jihad.dev`

**Personal portfolio of [Jihad Abu Zuhri](https://www.linkedin.com/in/jihadabuzuhri/)** —
Principal Software Engineer · Backend Systems · Platform Architecture · Agentic AI.

Hand-built from scratch. **Zero frameworks, zero templates, zero build step, zero dependencies.**
Just HTML, CSS, and vanilla JavaScript doing more than people think they can.

**[→ Visit the site](https://jihadabuzuhri.github.io/portfolio/)**

</div>

---

## Table of contents

- [What this is](#what-this-is)
- [Highlights](#highlights)
- [Project structure](#project-structure)
- [Running locally](#running-locally)
- [Editing content](#editing-content)
- [Deploying](#deploying)
- [Easter eggs](#easter-eggs)
- [Design notes](#design-notes)
- [Contributing](#contributing)
- [Docs in this repo](#docs-in-this-repo)
- [License](#license)

---

## What this is

A single-page static portfolio that tries to feel like a piece of software,
not a résumé. Every interaction is hand-rolled: the boot preloader, the
command palette, the working terminal, the matrix rain, the particle
network. Nothing is behind a `npm install`.

**It exists to:**
1. Represent me accurately at the current stage of my career.
2. Demonstrate that thoughtful engineering is visible in the small stuff.
3. Be a place I actually enjoy pointing people to.

---

## Highlights

<table>
  <tr>
    <td width="50%" valign="top">

**Interaction layer**
- ⌘K / Ctrl+K — command palette (VS Code style)
- ` — real working terminal (`help`, `neofetch`, `sudo hire-me`…)
- ↑↑↓↓←→←→BA — matrix easter egg
- Custom cursor, magnetic buttons, 3D tilt cards
- Interactive canvas particle network in the hero

    </td>
    <td width="50%" valign="top">

**Content presentation**
- API-styled section headers (`GET /experience 200 OK`)
- Career timeline with promotion markers
- 13 project cards including live open-source demo links
- Animated stat counters, typewriter role rotator
- Print-optimized [resume.html](resume.html) — one browser action away from a PDF

    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">

**Engineering hygiene**
- Modular CSS (8 focused stylesheets)
- Modular JS (11 native ES modules)
- Semantic HTML, ARIA labels, skip link
- Full keyboard navigation
- `prefers-reduced-motion` respected everywhere
- Fully responsive: 1024 → 880 → 560 breakpoints
- SEO-ready: Open Graph, JSON-LD, sitemap, robots.txt

    </td>
    <td width="50%" valign="top">

**Deploy pipeline**
- GitHub Pages via a GitHub Actions workflow
- Deploys every push to `main` in ~15 seconds
- Custom 404 page with glitch and terminal trace

    </td>
  </tr>
</table>

---

## Project structure

```
├─ .github/
│  └─ workflows/
│     └─ deploy.yml               ← GitHub Actions → GitHub Pages
├─ assets/
│  ├─ favicon.svg
│  └─ jihad.jpg                   ← hero portrait
├─ css/                           ← 8 modular stylesheets, cascade-ordered
│  ├─ tokens.css                  ← design system variables
│  ├─ base.css                    ← reset, typography, utilities
│  ├─ backgrounds.css             ← aurora, grid, noise
│  ├─ layout.css                  ← nav, hero, sections, footer
│  ├─ components.css              ← buttons, cards, chips, timeline, projects, skills
│  ├─ overlays.css                ← boot, palette, terminal, matrix, toast, cursor
│  ├─ animations.css              ← all @keyframes + reveal utility
│  └─ responsive.css              ← media queries + reduced-motion
├─ js/
│  ├─ main.js                     ← ES module entry — imports & wires the rest
│  └─ modules/
│     ├─ util.js                  ← $, $$, clamp, escapeHtml, RM, FINE
│     ├─ toast.js                 ← copy-email + transient notifications
│     ├─ boot.js                  ← terminal-style preloader
│     ├─ reveal.js                ← IntersectionObserver reveals + counters
│     ├─ typed.js                 ← hero role rotator
│     ├─ nav.js                   ← scroll progress, active section, mobile sheet
│     ├─ particles.js             ← hero canvas network
│     ├─ interactions.js          ← custom cursor + magnetic + 3D tilt
│     ├─ matrix.js                ← matrix rain + Konami code detector
│     ├─ terminal.js              ← interactive shell overlay
│     └─ palette.js               ← command palette (⌘K)
├─ index.html                     ← main single-page site
├─ resume.html                    ← print-ready résumé (self-contained)
├─ 404.html                       ← custom not-found with glitch + trace
├─ robots.txt                     ← SEO: crawl policy + sitemap pointer
├─ sitemap.xml                    ← SEO: URL inventory
├─ .editorconfig                  ← editor-agnostic formatting rules
├─ .nojekyll                      ← tell GitHub Pages to skip Jekyll processing
├─ .gitignore
├─ README.md                      ← you are here
├─ CHANGELOG.md                   ← human-readable version history
└─ CREDITS.md                     ← acknowledgments (fonts, ideas, tools)
```

**Design principle:** every file is small enough to hold in your head, and
its name predicts its contents. `css/overlays.css` has the palette CSS;
`js/modules/palette.js` has the palette behavior. No hunting.

---

## Running locally

You need a static file server — any will do. The site has **no build step**.

**Python (already on your Mac):**
```sh
python3 -m http.server 4173
open http://localhost:4173
```

**Node (if you prefer):**
```sh
npx serve .
```

**One-liner via `Makefile`:** you don't have one, and you don't need one.

---

## Editing content

The site keeps content close to where it renders. Reasonable places to
look:

| Change | File |
|---|---|
| Hero name, pitch, stats | `index.html` § hero |
| Career timeline entries | `index.html` § experience |
| Project cards | `index.html` § projects |
| Skill chips | `index.html` § skills |
| Résumé | `resume.html` (self-contained) |
| Terminal commands / neofetch text | `js/modules/terminal.js` |
| Command palette entries | `js/modules/palette.js` |
| Role rotator strings | `js/modules/typed.js` |
| Design tokens (colors, fonts, sizes) | `css/tokens.css` |
| A single animation timing | `css/animations.css` |

For any content edit, the flow is: **edit → save → refresh browser**. That's
the whole loop.

---

## Deploying

Automated. Every push to `main` triggers `.github/workflows/deploy.yml`,
which uploads the repo as a Pages artifact and publishes to
[jihadabuzuhri.github.io/portfolio](https://jihadabuzuhri.github.io/portfolio/).
Typical deploy time: **~15 seconds**.

**Prerequisites** (one-time on a fresh repo):
1. Repo must be **public** (free-plan Pages requirement).
2. **Settings → Pages → Source = GitHub Actions**.

Manual re-deploy if the queue is misbehaving:
```sh
gh workflow run deploy.yml
```

---

## Easter eggs

Some are documented; the fun ones aren't. Non-spoiler list:

| Trigger | Payoff |
|---|---|
| <kbd>⌘K</kbd> / <kbd>Ctrl+K</kbd> | Command palette |
| <kbd>`</kbd> | Working terminal |
| `help` in terminal | List of commands |
| `sudo hire-me` in terminal | Access granted ✓ |
| Open DevTools console | A signed note for fellow engineers |
| ↑↑↓↓←→←→BA | 🐇 |

The rest you'll find by clicking around. That's the point of an easter egg.

---

## Design notes

**Zero dependencies is a feature, not an achievement.** It forces every
decision through a "do I really need this?" filter. Result: fewer moving
parts, smaller download, no supply-chain surface.

**Cascade order matters.** The stylesheets are loaded in this exact order,
and I lean on that: tokens → base → backgrounds → layout → components →
overlays → animations → responsive (last wins). If you split them
differently, expect surprises.

**Modules are lazy, not eager.** ES modules are auto-deferred, so the
`<script type="module">` tag doesn't block rendering. Every module
initializer is a pure function; the entry point wires them together at
the very end.

**Reduced motion is respected everywhere.** All keyframe-driven effects
short-circuit for users with `prefers-reduced-motion: reduce`. The
particle network and custom cursor simply don't initialize; typewriter
freezes on the first role; reveals become instant.

**Accessibility is not an afterthought.** Skip link, ARIA labels, focus
rings, keyboard shortcuts, semantic landmarks, and correct heading order.
Test with `Tab` — every interactive element is reachable.

---

## Contributing

This is a **personal portfolio**, so I don't expect merges from strangers —
but if you find:

- A **typo** or a **wrong fact** → open an issue or PR, I'll fix it.
- A **bug** in the interaction layer → same, please include browser/device.
- An **accessibility issue** → this is a top priority. Please file it.
- A **suggestion for how the site should present me** → I'm happy to hear it
  but reserve the right to disagree without discussion.
- A **cool new easter egg idea** → drop it in an issue with the tag
  `easter-egg`. If I use it, I'll credit you in [CREDITS.md](CREDITS.md).

**How to contribute a change:**

```sh
# 1. Fork and clone
git clone https://github.com/<you>/portfolio.git && cd portfolio

# 2. Run locally
python3 -m http.server 4173

# 3. Branch → change → test in the browser → commit
git checkout -b fix/typo-in-about
# ...edit files...
git commit -m "fix: typo in about section"

# 4. Push and open a PR
git push origin fix/typo-in-about
```

**Style rules:** follow `.editorconfig` (2-space indent, LF, UTF-8). Match
the surrounding code — this repo has one voice, not many.

---

## Docs in this repo

- 📓 **[CHANGELOG.md](CHANGELOG.md)** — every notable change, versioned.
- 🙏 **[CREDITS.md](CREDITS.md)** — fonts, ideas, tools, and shoulders stood on.

---

## License

The **code** — HTML, CSS, JS, workflow — is licensed **MIT** (though
there is no `LICENSE` file yet; treat this section as authoritative until
one lands). Feel free to fork, remix, and learn from it.

The **content** — writing, biography, photograph, name — is **not
licensed for reuse**. Please don't ship a portfolio claiming to be
someone else's career.

---

<div align="center">

Built by hand, in Nablus, Palestine 🇵🇸<br/>
Deployed automatically. Maintained lovingly.

</div>
