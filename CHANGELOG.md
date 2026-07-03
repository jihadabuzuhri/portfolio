# Changelog

All notable changes to this portfolio.

The format is loosely based on [Keep a Changelog](https://keepachangelog.com),
and the project follows [semantic-ish versioning](https://semver.org) — with
version numbers matching *content maturity*, not API stability, since there's
no public API to break.

---

## [Unreleased]

### Changed
- **Complete modular refactor.** Monolithic `css/style.css` split into 8 focused
  stylesheets (`tokens`, `base`, `backgrounds`, `layout`, `components`,
  `overlays`, `animations`, `responsive`); monolithic `js/main.js` split into
  11 native ES modules under `js/modules/`. Same UX, dramatically better
  maintenance surface.

### Added
- **`/writing` section** on the main page — dev.to articles surfaced as cards
  with title, excerpt, publish date, read time, tag row and a "Read on dev.to"
  CTA. Nav link, mobile sheet entry, command palette shortcut, and terminal
  `writing` command all wired to match.
- Custom `404.html` with glitch animation and terminal trace.
- `robots.txt` and `sitemap.xml` for search-engine friendliness.
- `.editorconfig` to keep formatting consistent across editors.
- This `CHANGELOG.md` and a `CREDITS.md`.

---

## [0.4.0] — 2026-07-03

### Changed
- **Hero pitch rewritten** as *confession → trajectory → coda*
  ("Backend systems have quietly obsessed me since my first commit…").
- HEARIZE mention abstracted — no product-detail spoilers in the hero.
- Payroll wording genericized: "Multi-Position Sync" → "Sync Architecture";
  removed "position" / "job-level" language everywhere.
- Reordered **Provisioning & Activation Architecture** to slot #2, right
  after HEARIZE.

### Added
- Hero-picture credibility chip: **`< 4 yrs · Intern → Principal`** (green).
- Core stack chips: **EF Core** and **MongoDB**.
- New project cards: Performance & Reliability, Observability & Incident
  Investigation, Architecture Council, Analytics/Scoring/Recommendations,
  Composable Dashboard Framework, Daily Dashboard (personal PWA — live +
  code links), Provisioning & Activation Architecture.

_Commits: `d615d2f`, `f1eeb78`, `a65c208`, `34e0fcb`, `3c66927`, `1d45974`,
`d7802b6`_

---

## [0.3.0] — 2026-07-03

### Added
- **GitHub Actions deployment workflow** (`.github/workflows/deploy.yml`).
  Replaces the legacy branch-based Pages build, which was queueing badly
  under load. Deploys in ~15s.

_Commits: `5a52388`_

---

## [0.2.0] — 2026-07-03

### Added
- GitHub Pages support: `.nojekyll`, canonical URL, absolute Open Graph tags.
- `_source/` folder for private research materials (git-ignored).

_Commits: `1a7ca16`, `13027bd`_

---

## [0.1.0] — 2026-07-02

The initial launch.

### Added
- Single-page portfolio: hero with typewriter role rotator, particle
  network, floating credential chips, animated stat counters, and marquee.
- API-styled sections (`GET /experience 200 OK`) covering About, Experience,
  Projects, Skills, Education, and Contact.
- Design system built from scratch — 4-color accent gradient, dark surfaces,
  aurora backgrounds, film-grain noise, and a mono-code aesthetic.
- Career timeline with promotion markers (Intern → Principal).
- Interactive layer: `⌘K` command palette, `\``-key working terminal
  (`help`, `neofetch`, `sudo hire-me`, `cat profile.json`, and more),
  matrix rain easter egg (Konami code or terminal command).
- Custom cursor, magnetic buttons, 3D tilt cards, scroll-triggered reveals,
  boot preloader with terminal-style SSH lines.
- Print-optimized `resume.html` — always kept in sync with the site.
- Full responsive layout (desktop / tablet / mobile), `prefers-reduced-motion`
  respected, semantic HTML, JSON-LD structured data, Open Graph tags.

_Commits: `590f96a`, `933d6c1`, `8e171c7`_

---

[Unreleased]: https://github.com/jihadabuzuhri/portfolio/compare/v0.4.0...HEAD
[0.4.0]: https://github.com/jihadabuzuhri/portfolio/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/jihadabuzuhri/portfolio/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/jihadabuzuhri/portfolio/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/jihadabuzuhri/portfolio/releases/tag/v0.1.0
