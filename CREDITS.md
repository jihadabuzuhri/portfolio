# Credits & Acknowledgments

The site is hand-crafted, but no engineer is an island. This page names the
people, tools, and ideas the portfolio leans on — and thanks them for
existing.

## People

- **Jihad Abu Zuhri** — design, architecture, code, content.
- **Claude Code** (Anthropic) — pair-engineering partner throughout the
  build. Assisted with the initial scaffold, content polish, and the
  modular refactor. Every commit lists this collaboration honestly.

## Typefaces

All served free by [Google Fonts](https://fonts.google.com) with the
[Open Font License](https://scripts.sil.org/OFL).

- **[Sora](https://fonts.google.com/specimen/Sora)** — display headings.
  Geometric, confident, slightly playful.
- **[Inter](https://fonts.google.com/specimen/Inter)** — body copy. The
  workhorse of the modern web.
- **[JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)** —
  code, terminal, dev-tool aesthetic. Its ligatures shape a lot of the
  personality here.

## Palette

Custom, but standing on the shoulders of
[Tailwind CSS's default palette](https://tailwindcss.com/docs/customizing-colors) —
`sky-400`, `indigo-400`, `pink-400`, `emerald-400`, `amber-400`. Chosen
because they harmonize at low saturation on dark surfaces.

## Techniques borrowed (with love)

- **Command palette** — an idiom borrowed from
  [VS Code](https://code.visualstudio.com/) / [Raycast](https://www.raycast.com).
- **Particle network hero** — a genre started (in my memory of the web)
  by [particles.js](https://vincentgarreau.com/particles.js/) and reimplemented
  here from first principles in ~120 lines of vanilla canvas.
- **API-endpoint section headers** (`GET /projects 200 OK`) — a personal
  spin on the "sections as routes" aesthetic popular in backend-engineer
  portfolios.
- **Boot-sequence preloader** — inspired by the tradition of Linux kernel
  boot messages and dotfiles README animations.
- **Matrix rain easter egg** — glyphs include the Arabic letters of *Jihad*
  (ج ه ا د). The rain is a classic; the letters are a signature.
- **Konami code activation** — because it's the correct amount of
  ridiculous, and half the fun of an easter egg is that it *is* one.
- **`profile.yaml` mock in the About card** — deploy-manifest aesthetic;
  makes the "who am I" feel like a config file, which is the correct
  mental model for a systems engineer.
- **Contact block as `POST /contact` with `201 Created`** — because a
  new connection *is* a created resource. That joke writes itself.

## Fonts of inspiration (portfolios that raised the bar)

Watched from a distance and admired the craft:
- [Rauno Freiberg](https://rauno.me) — precision as personality.
- [Brittany Chiang](https://brittanychiang.com) — the timeline / ownership
  layout everyone else quietly emulates.
- [Josh Comeau](https://www.joshwcomeau.com) — proves that "playful" and
  "principled" aren't opposites on the web.
- [Cassidy Williams](https://cassidoo.co) — proves personality scales.

None of these are cloned; each of them taught me a little bit about how
much a good portfolio can carry.

## Tools of the trade

- **GitHub Pages** for hosting.
- **GitHub Actions** (`actions/checkout`, `actions/configure-pages`,
  `actions/upload-pages-artifact`, `actions/deploy-pages`) for
  deployment.
- **Python's `http.server`** for local development. Zero-dependency all
  the way down.
- **A browser and a text editor.** That's it.

## Photo

The hero portrait was taken at a **Restaurant365 team event**. Original
resolution 2160×2160, unretouched. Everything else on the page is code.

---

If this site borrows from you and you're not credited above, please open
an issue — I'd rather get the acknowledgment right than get away with it.
