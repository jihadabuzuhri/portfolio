/* ═══════════════════════════════════════════════════════════════
   JIHAD ABU ZUHRI — PORTFOLIO ENGINE
   Zero dependencies. Hand-rolled with love (and requestAnimationFrame).
   ═══════════════════════════════════════════════════════════════ */

(() => {
  "use strict";

  /* ── Utilities ────────────────────────────────────────────── */
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  const RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const FINE = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const escapeHtml = (s) =>
    s.replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));

  /* ── Toast ────────────────────────────────────────────────── */
  const toastEl = $("#toast");
  let toastTimer;
  const toast = (msg) => {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2400);
  };

  /* ── Boot sequence ────────────────────────────────────────── */
  const boot = $("#boot");
  const bootLog = $("#bootLog");
  const bootBar = $("#bootBar");

  const finishBoot = () => {
    boot.classList.add("done");
    document.body.classList.remove("no-scroll");
    initReveals();
    setTimeout(() => boot.remove(), 700);
  };

  const runBoot = () => {
    if (RM || sessionStorage.getItem("booted")) {
      sessionStorage.setItem("booted", "1");
      finishBoot();
      return;
    }
    sessionStorage.setItem("booted", "1");
    document.body.classList.add("no-scroll");

    const lines = [
      { t: "$ ssh guest@jihad.dev", c: "" },
      { t: "→ resolving host ............ <span class='ok'>done</span>", c: "" },
      { t: "→ loading experience ........ <span class='ok'>principal</span>", c: "" },
      { t: "→ mounting /projects ........ <span class='ok'>ok</span>", c: "" },
      { t: "→ starting animations ....... <span class='accent'>60fps</span>", c: "" },
      { t: "Welcome.", c: "ok" },
    ];

    let i = 0;
    const step = () => {
      if (i < lines.length) {
        const l = lines[i];
        bootLog.innerHTML += (l.c ? `<span class="${l.c}">${l.t}</span>` : l.t) + "\n";
        bootBar.style.width = `${((i + 1) / lines.length) * 100}%`;
        i++;
        setTimeout(step, i === lines.length ? 350 : 130 + Math.random() * 110);
      } else {
        finishBoot();
      }
    };
    step();
  };

  /* ── Reveal on scroll ─────────────────────────────────────── */
  const initReveals = () => {
    const els = $$(".reveal");
    if (RM || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    // Stagger siblings that share a parent
    const groups = new Map();
    els.forEach((el) => {
      const p = el.parentElement;
      if (!groups.has(p)) groups.set(p, 0);
      const idx = groups.get(p);
      el.style.setProperty("--reveal-delay", `${Math.min(idx * 90, 450)}ms`);
      groups.set(p, idx + 1);
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => io.observe(el));
  };

  /* ── Typed rotator ────────────────────────────────────────── */
  const typedEl = $("#typed");
  const ROLES = [
    "Principal Software Engineer",
    "Platform & Systems Architect",
    "Backend Specialist — .NET & Spring",
    "Agentic AI Explorer",
    "Co-Founder @ HEARIZE",
    "Mentor · Instructor · Team Lead",
  ];

  const runTyped = () => {
    if (RM) {
      typedEl.textContent = ROLES[0];
      return;
    }
    let ri = 0, ci = 0, deleting = false;
    const tick = () => {
      const word = ROLES[ri];
      typedEl.textContent = word.slice(0, ci);
      let wait = deleting ? 26 : 52 + Math.random() * 40;
      if (!deleting && ci === word.length) { wait = 1900; deleting = true; }
      else if (deleting && ci === 0) { deleting = false; ri = (ri + 1) % ROLES.length; wait = 380; }
      else ci += deleting ? -1 : 1;
      setTimeout(tick, wait);
    };
    tick();
  };

  /* ── Counters ─────────────────────────────────────────────── */
  const runCounters = () => {
    const els = $$("[data-count]");
    const animate = (el) => {
      const target = parseFloat(el.dataset.count);
      const decimals = parseInt(el.dataset.decimals || "0", 10);
      if (RM) { el.textContent = target.toFixed(decimals); return; }
      const dur = 1500;
      const t0 = performance.now();
      const frame = (t) => {
        const p = clamp((t - t0) / dur, 0, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(decimals);
        if (p < 1) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { animate(e.target); io.unobserve(e.target); }
      }),
      { threshold: 0.6 }
    );
    els.forEach((el) => io.observe(el));
  };

  /* ── Scroll progress + nav state ──────────────────────────── */
  const progressBar = $("#progressBar");
  const nav = $("#nav");

  const onScroll = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    progressBar.style.transform = `scaleX(${max > 0 ? h.scrollTop / max : 0})`;
    nav.classList.toggle("scrolled", h.scrollTop > 24);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Active section highlighting
  const navLinks = $$("[data-nav]");
  const sections = navLinks
    .map((a) => $(`#${a.dataset.nav}`))
    .filter(Boolean);
  if (sections.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            navLinks.forEach((a) =>
              a.classList.toggle("active", a.dataset.nav === e.target.id)
            );
          }
        });
      },
      { rootMargin: "-38% 0px -55% 0px" }
    );
    sections.forEach((s) => io.observe(s));
  }

  /* ── Particle network (hero) ──────────────────────────────── */
  const initNet = () => {
    const canvas = $("#net");
    if (!canvas || RM) return;
    const ctx = canvas.getContext("2d");
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let W, H, nodes = [], running = true, visible = true;
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

    const LINK = 135;
    const draw = () => {
      if (!running) return;
      if (!visible || document.hidden) { requestAnimationFrame(draw); return; }
      ctx.clearRect(0, 0, W, H);

      for (const n of nodes) {
        // gentle mouse repulsion
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

      // edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < LINK) {
            const o = (1 - d / LINK) * 0.5;
            ctx.strokeStyle = `rgba(110, 140, 248, ${o * 0.55})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // nodes
      for (const n of nodes) {
        ctx.fillStyle = "rgba(96, 165, 250, 0.75)";
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

  /* ── Custom cursor ────────────────────────────────────────── */
  const initCursor = () => {
    if (!FINE || RM) return;
    const dot = $("#cursorDot");
    const ring = $("#cursorRing");
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

  /* ── Magnetic buttons ─────────────────────────────────────── */
  const initMagnetic = () => {
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

  /* ── Tilt cards ───────────────────────────────────────────── */
  const initTilt = () => {
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

  /* ── Mobile sheet ─────────────────────────────────────────── */
  const burger = $("#burger");
  const sheet = $("#sheet");
  const toggleSheet = (open) => {
    const isOpen = open ?? !sheet.classList.contains("open");
    sheet.classList.toggle("open", isOpen);
    burger.classList.toggle("open", isOpen);
    burger.setAttribute("aria-expanded", String(isOpen));
    sheet.setAttribute("aria-hidden", String(!isOpen));
  };
  burger.addEventListener("click", () => toggleSheet());
  $$(".sheet-links a").forEach((a) => a.addEventListener("click", () => toggleSheet(false)));

  /* ── Copy email ───────────────────────────────────────────── */
  const EMAIL = "jihadabuzuhri@gmail.com";
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      toast("201 Created — email copied ✓");
    } catch {
      toast(EMAIL);
    }
  };
  $("#copyEmail")?.addEventListener("click", copyEmail);

  /* ── Command palette ──────────────────────────────────────── */
  const palette = $("#palette");
  const paletteInput = $("#paletteInput");
  const paletteList = $("#paletteList");

  const go = (id) => {
    closePalette();
    $(id)?.scrollIntoView({ behavior: RM ? "auto" : "smooth" });
  };

  const COMMANDS = [
    { icon: "👤", label: "Go to About", hint: "/about", kw: "about bio", run: () => go("#about") },
    { icon: "📈", label: "Go to Experience", hint: "/experience", kw: "experience career jobs timeline", run: () => go("#experience") },
    { icon: "🛠️", label: "Go to Projects", hint: "/projects", kw: "projects work hearize", run: () => go("#projects") },
    { icon: "⚡", label: "Go to Skills", hint: "/skills", kw: "skills stack tech", run: () => go("#skills") },
    { icon: "🎓", label: "Go to Education", hint: "/education", kw: "education degree university", run: () => go("#education") },
    { icon: "✉️", label: "Go to Contact", hint: "/contact", kw: "contact email reach", run: () => go("#contact") },
    { icon: "📄", label: "Open résumé", hint: "resume.html", kw: "resume cv download pdf", run: () => { closePalette(); window.location.href = "resume.html"; } },
    { icon: "⧉", label: "Copy email address", hint: EMAIL, kw: "copy email clipboard", run: () => { closePalette(); copyEmail(); } },
    { icon: "🐙", label: "Open GitHub", hint: "↗", kw: "github code repos", run: () => { closePalette(); window.open("https://github.com/jihadabuzuhri", "_blank"); } },
    { icon: "💼", label: "Open LinkedIn", hint: "↗", kw: "linkedin profile", run: () => { closePalette(); window.open("https://www.linkedin.com/in/jihadabuzuhri/", "_blank"); } },
    { icon: ">_", label: "Open terminal", hint: "`", kw: "terminal shell console cli", run: () => { closePalette(); openTerm(); } },
    { icon: "🟩", label: "Enter the matrix", hint: "easter egg", kw: "matrix rain easter egg fun", run: () => { closePalette(); startMatrix(); } },
    { icon: "↑", label: "Back to top", hint: "home", kw: "top home start", run: () => go("#top") },
  ];

  let filtered = [...COMMANDS];
  let activeIdx = 0;

  const renderPalette = () => {
    if (!filtered.length) {
      paletteList.innerHTML = `<li class="palette-empty mono">no results — 404</li>`;
      return;
    }
    paletteList.innerHTML = filtered
      .map(
        (c, i) => `
        <li class="palette-item ${i === activeIdx ? "active" : ""}" data-idx="${i}">
          <span class="pi-icon">${c.icon}</span>
          <span class="pi-label">${c.label}</span>
          <span class="pi-hint">${c.hint}</span>
        </li>`
      )
      .join("");
    paletteList.querySelector(".active")?.scrollIntoView({ block: "nearest" });
  };

  const openPalette = () => {
    palette.hidden = false;
    document.body.classList.add("no-scroll");
    paletteInput.value = "";
    filtered = [...COMMANDS];
    activeIdx = 0;
    renderPalette();
    requestAnimationFrame(() => paletteInput.focus());
  };
  const closePalette = () => {
    palette.hidden = true;
    document.body.classList.remove("no-scroll");
  };

  $("#paletteBtn").addEventListener("click", openPalette);
  $$("[data-palette-close]").forEach((el) => el.addEventListener("click", closePalette));

  paletteInput.addEventListener("input", () => {
    const q = paletteInput.value.trim().toLowerCase();
    filtered = COMMANDS.filter(
      (c) => c.label.toLowerCase().includes(q) || c.kw.includes(q)
    );
    activeIdx = 0;
    renderPalette();
  });

  paletteInput.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); activeIdx = (activeIdx + 1) % filtered.length; renderPalette(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); activeIdx = (activeIdx - 1 + filtered.length) % filtered.length; renderPalette(); }
    else if (e.key === "Enter" && filtered[activeIdx]) filtered[activeIdx].run();
  });

  paletteList.addEventListener("click", (e) => {
    const item = e.target.closest(".palette-item");
    if (item) filtered[+item.dataset.idx]?.run();
  });

  /* ── Terminal ─────────────────────────────────────────────── */
  const term = $("#terminal");
  const termBody = $("#termBody");
  const termInput = $("#termInput");
  let termBooted = false;
  const history = [];
  let histIdx = -1;

  const tPrint = (html = "") => {
    termBody.insertAdjacentHTML("beforeend", html + "\n");
    termBody.scrollTop = termBody.scrollHeight;
  };

  const NEOFETCH = [
    '<span class="t-sky">      ██╗███████╗</span>   <span class="t-cmd">jihad</span>@<span class="t-cmd">dev</span>',
    '<span class="t-sky">      ██║╚══███╔╝</span>   ─────────────',
    '<span class="t-sky">      ██║  ███╔╝ </span>   <span class="t-pink">role</span>    Principal Software Engineer',
    '<span class="t-sky"> ██   ██║ ███╔╝  </span>   <span class="t-pink">org</span>     FTS × Restaurant365',
    '<span class="t-sky"> ╚█████╔╝███████╗</span>   <span class="t-pink">base</span>    Nablus, Palestine',
    '<span class="t-sky">  ╚════╝ ╚══════╝</span>   <span class="t-pink">stack</span>   .NET · Spring · SQL · AWS',
    '                     <span class="t-pink">focus</span>   Platform Architecture · Agentic AI',
    '                     <span class="t-pink">uptime</span>  coding since 2018, shipping since day 1',
  ].join("\n");

  const TCOMMANDS = {
    help: () =>
      tPrint(
        [
          '<span class="t-ok">available commands:</span>',
          '  <span class="t-cmd">whoami</span>       who is this guy?',
          '  <span class="t-cmd">neofetch</span>     system info, dev edition',
          '  <span class="t-cmd">skills</span>       the toolbox',
          '  <span class="t-cmd">experience</span>   career log',
          '  <span class="t-cmd">projects</span>     things built',
          '  <span class="t-cmd">awards</span>       trophy shelf',
          '  <span class="t-cmd">contact</span>      reach out',
          '  <span class="t-cmd">resume</span>       open the résumé',
          '  <span class="t-cmd">cat profile.json</span>',
          '  <span class="t-cmd">sudo hire-me</span>',
          '  <span class="t-cmd">matrix</span>       🐇',
          '  <span class="t-cmd">ls</span> · <span class="t-cmd">cd &lt;section&gt;</span> · <span class="t-cmd">clear</span> · <span class="t-cmd">exit</span>',
        ].join("\n")
      ),
    whoami: () =>
      tPrint(
        'Jihad Abu Zuhri — <span class="t-sky">Principal Software Engineer</span>.\nBackend & platform architect. Intern → Principal in &lt;4 years.\nCo-founder of HEARIZE. Currently exploring <span class="t-hot">Agentic AI</span>.'
      ),
    neofetch: () => tPrint(NEOFETCH),
    skills: () =>
      tPrint(
        '<span class="t-sky">langs</span>      C# · Java · Python · JS · SQL · C++\n<span class="t-sky">backend</span>    .NET Core · Spring Boot · REST · JWT/OAuth2 · EF Core · JPA\n<span class="t-sky">arch</span>       Clean Architecture · DDD · Microservices · System Design\n<span class="t-sky">data</span>       SQL Server · PostgreSQL · Oracle · Redis\n<span class="t-sky">infra</span>      AWS · Docker · CI/CD · RabbitMQ · Nginx · Linux\n<span class="t-sky">ai/ml</span>      TensorFlow · PyTorch · OpenCV · CNNs · Agentic systems'
      ),
    experience: () =>
      tPrint(
        '<span class="t-ok">2026 →</span>  Principal Software Engineer @ FTS × Restaurant365\n<span class="t-dim">2025</span>    Senior SWE — Payroll Platform · Architecture Council liaison\n<span class="t-dim">2022</span>    Backend Engineer → Mid-level (promoted)\n<span class="t-dim">2022</span>    Backend Intern — where it all started\n<span class="t-dim">2021</span>    Co-Founder & Tech Lead @ HEARIZE (ongoing)\n<span class="t-dim">2022</span>    Instructor @ CSE Academy (2 yrs)'
      ),
    projects: () =>
      tPrint(
        '<span class="t-cmd">HEARIZE</span>     sign language ↔ speech, real-time, deep learning 🤟\n<span class="t-cmd">payroll</span>     platform architecture @ R365 — 6 teams, 1 council seat\n<span class="t-cmd">community</span>   CSE Academy · IEEEXtreme · ACM-ICPC · AAUP dev communities\n<span class="t-cmd">this-site</span>   vanilla JS, 0 dependencies, 100% handmade'
      ),
    awards: () =>
      tPrint(
        '<span class="t-hot">🏆 IEEE Pioneer</span>\n<span class="t-hot">🏆 Doc-Tech</span>\n<span class="t-hot">🏆 GIC</span>\n<span class="t-hot">🏆 IEEE Region 8 Entrepreneurship</span>\n<span class="t-hot">🎓 3.9/4.0 GPA — top of class</span>'
      ),
    contact: () =>
      tPrint(
        'email     <a href="mailto:jihadabuzuhri@gmail.com">jihadabuzuhri@gmail.com</a>\nlinkedin  <a href="https://www.linkedin.com/in/jihadabuzuhri/" target="_blank" rel="noopener">/in/jihadabuzuhri</a>\ngithub    <a href="https://github.com/jihadabuzuhri" target="_blank" rel="noopener">@jihadabuzuhri</a>'
      ),
    resume: () => { tPrint('<span class="t-ok">opening resume.html…</span>'); setTimeout(() => (window.location.href = "resume.html"), 400); },
    ls: () => tPrint('<span class="t-sky">about/  experience/  projects/  skills/  education/  contact/</span>  <span class="t-cmd">profile.json</span>'),
    date: () => tPrint(new Date().toString()),
    matrix: () => { closeTerm(); startMatrix(); },
    clear: () => (termBody.innerHTML = ""),
    exit: () => closeTerm(),
    quit: () => closeTerm(),
  };

  const PROFILE_JSON = {
    name: "Jihad Abu Zuhri",
    role: "Principal Software Engineer",
    org: "Foothill Technology Solutions × Restaurant365",
    base: "Nablus, Palestine",
    trajectory: ["intern", "backend", "mid-level", "senior", "principal"],
    focus: ["backend", "platform-architecture", "distributed-systems", "agentic-ai"],
    startup: { name: "HEARIZE", mission: "give sign language a voice", awards: 4 },
    gpa: 3.9,
    hireable_for: "hard problems",
  };

  const runTermCmd = (raw) => {
    const input = raw.trim();
    if (!input) return;
    tPrint(`<span class="t-ok">guest@jihad.dev:~$</span> <span class="t-cmd">${escapeHtml(input)}</span>`);
    history.unshift(input);
    histIdx = -1;

    const [cmd, ...args] = input.split(/\s+/);
    const arg = args.join(" ");
    const c = cmd.toLowerCase();

    if (TCOMMANDS[c] && c !== "cat" && c !== "cd" && c !== "echo" && c !== "sudo") return TCOMMANDS[c]();

    switch (c) {
      case "cat":
        if (/profile\.json/.test(arg)) tPrint(`<span class="t-sky">${escapeHtml(JSON.stringify(PROFILE_JSON, null, 2))}</span>`);
        else tPrint(`<span class="t-err">cat: ${escapeHtml(arg || "")}: No such file — try 'cat profile.json'</span>`);
        break;
      case "cd": {
        const target = arg.replace(/\/$/, "");
        const valid = ["about", "experience", "projects", "skills", "education", "contact", "top"];
        if (valid.includes(target)) {
          tPrint(`<span class="t-ok">→ navigating to /${target}</span>`);
          closeTerm();
          $(`#${target}`)?.scrollIntoView({ behavior: RM ? "auto" : "smooth" });
        } else tPrint(`<span class="t-err">cd: no such directory: ${escapeHtml(arg)}</span>`);
        break;
      }
      case "echo":
        tPrint(escapeHtml(arg));
        break;
      case "sudo":
        if (/hire-?me/i.test(arg)) {
          tPrint('<span class="t-ok">[sudo] permission granted ✓\nACCESS LEVEL: PRINCIPAL\nopening secure channel…</span>');
          setTimeout(() => (window.location.href = "mailto:jihadabuzuhri@gmail.com?subject=Let's%20build%20something"), 900);
        } else tPrint(`<span class="t-err">guest is not in the sudoers file. This incident will be reported. 😄</span>`);
        break;
      case "rm":
        tPrint('<span class="t-err">nice try.</span>🙃');
        break;
      default:
        tPrint(`<span class="t-err">command not found: ${escapeHtml(cmd)}</span> — try <span class="t-cmd">help</span>`);
    }
  };

  const openTerm = () => {
    term.hidden = false;
    document.body.classList.add("no-scroll");
    if (!termBooted) {
      termBooted = true;
      tPrint('<span class="t-dim">Last login: from somewhere curious 🌍</span>');
      tPrint('Welcome to <span class="t-sky">jihad.dev</span> — type <span class="t-cmd">help</span> to explore, <span class="t-cmd">exit</span> to leave.\n');
    }
    requestAnimationFrame(() => termInput.focus());
  };
  const closeTerm = () => {
    term.hidden = true;
    document.body.classList.remove("no-scroll");
  };

  $$("[data-open-terminal]").forEach((el) => el.addEventListener("click", openTerm));
  $$("[data-term-close]").forEach((el) => el.addEventListener("click", closeTerm));
  $(".term-window").addEventListener("click", () => termInput.focus());

  termInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      runTermCmd(termInput.value);
      termInput.value = "";
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (histIdx < history.length - 1) termInput.value = history[++histIdx] || "";
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx > 0) termInput.value = history[--histIdx];
      else { histIdx = -1; termInput.value = ""; }
    }
  });

  /* ── Matrix rain ──────────────────────────────────────────── */
  const matrixCanvas = $("#matrix");
  let matrixOn = false, matrixRAF, matrixTimeout;

  const startMatrix = () => {
    if (matrixOn) return;
    matrixOn = true;
    matrixCanvas.hidden = false;
    document.body.classList.add("no-scroll");
    toast("🐇 follow the white rabbit — click or ESC to exit");

    const ctx = matrixCanvas.getContext("2d");
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    matrixCanvas.width = innerWidth * DPR;
    matrixCanvas.height = innerHeight * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    const GLYPHS = "ج ه ا د 0 1 { } < > / ; = λ # $ & %".split(" ");
    const fs = 16;
    const cols = Math.ceil(innerWidth / fs);
    const drops = Array.from({ length: cols }, () => Math.random() * -40);

    let last = 0;
    const step = (t) => {
      if (!matrixOn) return;
      if (t - last > 50) {
        last = t;
        ctx.fillStyle = "rgba(2, 4, 8, 0.16)";
        ctx.fillRect(0, 0, innerWidth, innerHeight);
        ctx.font = `${fs}px "JetBrains Mono", monospace`;
        for (let i = 0; i < cols; i++) {
          const ch = GLYPHS[(Math.random() * GLYPHS.length) | 0];
          const y = drops[i] * fs;
          ctx.fillStyle = Math.random() > 0.975 ? "#e8ecf8" : "rgba(52, 211, 153, 0.9)";
          ctx.fillText(ch, i * fs, y);
          if (y > innerHeight && Math.random() > 0.976) drops[i] = 0;
          drops[i]++;
        }
      }
      matrixRAF = requestAnimationFrame(step);
    };
    matrixRAF = requestAnimationFrame(step);
    matrixTimeout = setTimeout(stopMatrix, 14000);
  };

  const stopMatrix = () => {
    if (!matrixOn) return;
    matrixOn = false;
    cancelAnimationFrame(matrixRAF);
    clearTimeout(matrixTimeout);
    matrixCanvas.hidden = true;
    matrixCanvas.getContext("2d").clearRect(0, 0, matrixCanvas.width, matrixCanvas.height);
    document.body.classList.remove("no-scroll");
  };
  matrixCanvas.addEventListener("click", stopMatrix);

  /* ── Konami code ──────────────────────────────────────────── */
  const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
  let kIdx = 0;
  document.addEventListener("keydown", (e) => {
    kIdx = e.key === KONAMI[kIdx] ? kIdx + 1 : (e.key === KONAMI[0] ? 1 : 0);
    if (kIdx === KONAMI.length) { kIdx = 0; startMatrix(); }
  });

  /* ── Global keyboard shortcuts ────────────────────────────── */
  document.addEventListener("keydown", (e) => {
    const typing = /^(input|textarea|select)$/i.test(document.activeElement?.tagName || "");

    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      palette.hidden ? openPalette() : closePalette();
      return;
    }
    if (e.key === "Escape") {
      if (matrixOn) return stopMatrix();
      if (!palette.hidden) return closePalette();
      if (!term.hidden) return closeTerm();
      if (sheet.classList.contains("open")) return toggleSheet(false);
    }
    if (e.key === "`" && !typing && palette.hidden) {
      e.preventDefault();
      term.hidden ? openTerm() : closeTerm();
    }
  });

  /* ── Small delights ───────────────────────────────────────── */
  const hour = new Date().getHours();
  $("#greeting").textContent =
    hour < 5 ? "Up late?" : hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  $("#year").textContent = new Date().getFullYear();

  // Console signature for fellow engineers
  console.log(
    "%c>_ jihad.dev %c\n\nInspecting the source? Respect. 🤝\nThis site is 100% handmade — no frameworks, no templates.\nTry the terminal: press ` — or ⌘K for the palette.\n",
    "font-size:18px;font-weight:bold;background:linear-gradient(90deg,#38bdf8,#818cf8,#f472b6);color:#fff;padding:6px 14px;border-radius:8px;",
    "color:#93a0ba;font-size:12px;"
  );

  /* ── Ignition ─────────────────────────────────────────────── */
  runBoot();
  runTyped();
  runCounters();
  initNet();
  initCursor();
  initMagnetic();
  initTilt();
})();
