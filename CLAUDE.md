# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Personal portfolio site for Jihad Abu Zuhri — a zero-dependency static site.
No frameworks, no build step, no npm. Just HTML, CSS, and vanilla JS.

Live at: https://jihadabuzuhri.github.io/portfolio/

## Architecture

- **index.html** — single-page portfolio (hero, about, experience, projects, skills, education, contact)
- **resume.html** — print-optimized résumé (self-contained, browser print-to-PDF)
- **404.html** — custom not-found page with glitch animation
- **css/** — 8 modular stylesheets loaded in cascade order: tokens → base → backgrounds → layout → components → overlays → animations → responsive
- **js/main.js** — ES module entry point (`<script type="module">`)
- **js/modules/** — 11 native ES modules (util, toast, boot, reveal, typed, nav, particles, interactions, matrix, terminal, palette)
- **.github/workflows/deploy.yml** — GitHub Actions deploy to GitHub Pages

## Rules

- **Zero dependencies.** No npm, no CDN libs, no build tools. If it needs `npm install`, it doesn't belong here.
- **No build step.** Files serve as-is. `python3 -m http.server` is the dev server.
- **CSS cascade order matters.** The 8 stylesheets are loaded in a specific order in index.html. Don't reorder them.
- **ES modules, not bundled.** `<script type="module">` auto-defers. Each module exports pure init functions; main.js wires them.
- **Content stays in HTML.** No JSON data files, no template engine. Edit the HTML directly.
- **resume.html must stay in sync** with index.html content (experience, skills, education).
- **resume.html is self-contained** — inline `<style>`, no external CSS/JS imports. Don't link it to `css/` or `js/`; the print flow depends on it standing alone.
- **Respect `prefers-reduced-motion`.** All animations must short-circuit for users with reduced motion.
- **Semantic HTML + accessibility.** Skip link, ARIA labels, focus rings, keyboard navigation, correct heading order.

## Confidentiality

This repo was built from private career materials. When editing content:

- **Never expose** internal codenames, partner names, colleague names, ticket IDs, internal repo names, or Jira/Slack/Confluence links.
- **Genericize** employer-specific terminology into transferable skills and impact.
- The `_source/` folder is gitignored and must never be committed or referenced in code.

## Running locally

```sh
python3 -m http.server 4173
# open http://localhost:4173
```

Or use the Claude Code preview server: `preview_start` with name `portfolio` (defined in `.claude/launch.json`, binds 127.0.0.1:4173).

## Deploying

Push to `main`. GitHub Actions handles the rest (~15s deploys).

## Key files to keep in sync

When changing career content (new role, new project, updated skills):
1. `index.html` — main site sections
2. `resume.html` — print résumé
3. `js/modules/terminal.js` — `neofetch` output and `cat profile.json`
4. `js/modules/palette.js` — command palette entries (if adding new sections)
5. `sitemap.xml` — if adding new pages
6. `CHANGELOG.md` — for anything notable enough to be user-visible
