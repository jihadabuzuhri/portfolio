/**
 * Interactive terminal overlay. Real command loop with history, a small
 * shell surface (help, ls, cd, cat, echo, sudo …), and site navigation
 * via `cd <section>`. Escapes user input before rendering.
 */

import { $, $$, RM, escapeHtml } from "./util.js";
import { startMatrix } from "./matrix.js";

let term, termBody, termInput;
let booted = false;
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
  '<span class="t-sky">  ╚════╝ ╚══════╝</span>   <span class="t-pink">stack</span>   .NET · K8s · Azure · SQL',
  '                     <span class="t-pink">leads</span>   architecture council · 6 teams',
  '                     <span class="t-pink">focus</span>   Platform Architecture · Agentic AI',
  '                     <span class="t-pink">uptime</span>  coding since 2018, shipping since day 1',
].join("\n");

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

const BUILTINS = {
  help: () =>
    tPrint(
      [
        '<span class="t-ok">available commands:</span>',
        '  <span class="t-cmd">whoami</span>       who is this guy?',
        '  <span class="t-cmd">neofetch</span>     system info, dev edition',
        '  <span class="t-cmd">skills</span>       the toolbox',
        '  <span class="t-cmd">experience</span>   career log',
        '  <span class="t-cmd">projects</span>     things built',
        '  <span class="t-cmd">writing</span>      articles & posts',
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
      '<span class="t-sky">langs</span>      C# · Java · Python · JS · SQL · C++\n<span class="t-sky">backend</span>    ASP.NET Core 9 · Minimal APIs · Spring Boot · MediatR · Refit · EF Core\n<span class="t-sky">arch</span>       Clean Architecture · DDD · Event-Driven · Microservices · API Gateway\n<span class="t-sky">data</span>       SQL Server · PostgreSQL · Oracle · Redis\n<span class="t-sky">infra</span>      Kubernetes · AKS · ArgoCD · Azure · AWS · Docker · GitLab CI/CD\n<span class="t-sky">observe</span>    OpenTelemetry · Elasticsearch · Kibana · tracing\n<span class="t-sky">ai/ml</span>      Agentic agents · AI dev tooling · TensorFlow · PyTorch · OpenCV · CNNs'
    ),
  experience: () =>
    tPrint(
      '<span class="t-ok">2026 →</span>  Principal Software Engineer @ FTS × Restaurant365\n<span class="t-dim">2025</span>    Senior SWE — Payroll Platform · Architecture Council liaison\n<span class="t-dim">2022</span>    Backend Engineer → Mid-level (promoted)\n<span class="t-dim">2022</span>    Backend Intern — where it all started\n<span class="t-dim">2021</span>    Co-Founder & Tech Lead @ HEARIZE (ongoing)\n<span class="t-dim">2022</span>    Instructor @ CSE Academy (2 yrs)'
    ),
  projects: () =>
    tPrint(
      '<span class="t-cmd">HEARIZE</span>     sign language ↔ speech, real-time, deep learning 🤟\n<span class="t-cmd">payroll</span>     high-throughput payroll platform & sync architecture @ R365\n<span class="t-cmd">platform</span>    gateway, integration, observability & agentic dev tooling\n<span class="t-cmd">council</span>     founded & run a weekly architecture council · 6 teams\n<span class="t-cmd">daily</span>       offline-first PWA dashboard — <a href="https://jihadabuzuhri.github.io/daily-dashboard/" target="_blank" rel="noopener">live</a> · <a href="https://github.com/jihadabuzuhri/daily-dashboard" target="_blank" rel="noopener">code</a>\n<span class="t-cmd">community</span>   CSE Academy · IEEEXtreme · ACM-ICPC · AAUP dev communities\n<span class="t-cmd">this-site</span>   vanilla JS, 0 dependencies, 100% handmade'
    ),
  awards: () =>
    tPrint(
      '<span class="t-hot">🏆 IEEE Pioneer</span>\n<span class="t-hot">🏆 Doc-Tech</span>\n<span class="t-hot">🏆 GIC</span>\n<span class="t-hot">🏆 IEEE Region 8 Entrepreneurship</span>\n<span class="t-hot">🎓 3.9/4.0 GPA — top of class</span>'
    ),
  writing: () =>
    tPrint(
      '<span class="t-sky">jun 2026</span>  <a href="https://dev.to/jihadabuzuhri/refactoring-in-the-ai-era-code-smells-software-engineers-should-still-know-2ino" target="_blank" rel="noopener">Refactoring in the AI Era — Code Smells Software Engineers Should Still Know</a>  <span class="t-dim">· 9 min</span>\n<span class="t-sky">dec 2024</span>  <a href="https://dev.to/jihadabuzuhri/understanding-rate-limiting-an-essential-guide-for-developers-2pa2" target="_blank" rel="noopener">Understanding Rate Limiting — An Essential Guide for Developers</a>  <span class="t-dim">· 5 min</span>\n\n<span class="t-dim">full archive →</span> <a href="https://dev.to/jihadabuzuhri" target="_blank" rel="noopener">dev.to/jihadabuzuhri</a>'
    ),
  contact: () =>
    tPrint(
      'email     <a href="mailto:jihadabuzuhri@gmail.com">jihadabuzuhri@gmail.com</a>\nlinkedin  <a href="https://www.linkedin.com/in/jihadabuzuhri/" target="_blank" rel="noopener">/in/jihadabuzuhri</a>\ngithub    <a href="https://github.com/jihadabuzuhri" target="_blank" rel="noopener">@jihadabuzuhri</a>'
    ),
  resume: () => { tPrint('<span class="t-ok">opening resume.html…</span>'); setTimeout(() => (window.location.href = "resume.html"), 400); },
  ls:     () => tPrint('<span class="t-sky">about/  experience/  projects/  writing/  skills/  education/  contact/</span>  <span class="t-cmd">profile.json</span>'),
  date:   () => tPrint(new Date().toString()),
  matrix: () => { closeTerm(); startMatrix(); },
  clear:  () => (termBody.innerHTML = ""),
  exit:   () => closeTerm(),
  quit:   () => closeTerm(),
};

const runCmd = (raw) => {
  const input = raw.trim();
  if (!input) return;
  tPrint(`<span class="t-ok">guest@jihad.dev:~$</span> <span class="t-cmd">${escapeHtml(input)}</span>`);
  history.unshift(input);
  histIdx = -1;

  const [cmd, ...args] = input.split(/\s+/);
  const arg = args.join(" ");
  const c = cmd.toLowerCase();

  // Args-consuming commands (cat, cd, echo, sudo) must fall through to
  // the switch below rather than hit BUILTINS.
  if (BUILTINS[c] && !["cat", "cd", "echo", "sudo"].includes(c)) return BUILTINS[c]();

  switch (c) {
    case "cat":
      if (/profile\.json/.test(arg)) tPrint(`<span class="t-sky">${escapeHtml(JSON.stringify(PROFILE_JSON, null, 2))}</span>`);
      else tPrint(`<span class="t-err">cat: ${escapeHtml(arg || "")}: No such file — try 'cat profile.json'</span>`);
      break;
    case "cd": {
      const target = arg.replace(/\/$/, "");
      const valid = ["about", "experience", "projects", "writing", "skills", "education", "contact", "top"];
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

export const openTerm = () => {
  term ??= $("#terminal");
  termBody ??= $("#termBody");
  termInput ??= $("#termInput");
  if (!term) return;

  term.hidden = false;
  document.body.classList.add("no-scroll");
  if (!booted) {
    booted = true;
    tPrint('<span class="t-dim">Last login: from somewhere curious 🌍</span>');
    tPrint('Welcome to <span class="t-sky">jihad.dev</span> — type <span class="t-cmd">help</span> to explore, <span class="t-cmd">exit</span> to leave.\n');
  }
  requestAnimationFrame(() => termInput.focus());
};

export const closeTerm = () => {
  if (!term) return;
  term.hidden = true;
  document.body.classList.remove("no-scroll");
};

export const isTermOpen = () => term && !term.hidden;

export const initTerminal = () => {
  term = $("#terminal");
  termBody = $("#termBody");
  termInput = $("#termInput");
  if (!term) return;

  $$("[data-open-terminal]").forEach((el) => el.addEventListener("click", openTerm));
  $$("[data-term-close]").forEach((el) => el.addEventListener("click", closeTerm));
  $(".term-window")?.addEventListener("click", () => termInput.focus());

  termInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      runCmd(termInput.value);
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
};
