/* =========================================================
   Rey Timson — Timson AI Academy
   Shared site script: header/footer, theme, multi-course
   progress, quizzes, certificates and glossary search
   ========================================================= */
(function () {
  "use strict";

  var ROOT = document.body.getAttribute("data-root") || "./";
  var PAGE = document.body.getAttribute("data-page") || "";
  var SITE_NAME = "Rey Timson";
  var CONTACT_EMAIL = "reytimson@gmail.com";
  var LINKEDIN = "https://www.linkedin.com/in/rey-timson-a367001bb";

  /* ---------- Course registry ----------
     Add a course here and give its pages <body data-course="slug">. */
  var COURSES = {
    "eu-ai-act": {
      title: "EU AI Act Fundamentals",
      key: "rta-euaiact-progress", certKey: "rta-cert-id", certPrefix: "EUAIA",
      modules: ["What is the EU AI Act?", "The risk-based approach", "Prohibited AI practices", "High-risk AI systems", "Transparency & general-purpose AI", "Governance, enforcement & compliance"]
    },
    "ai-literacy": {
      title: "AI Literacy for Work",
      certPrefix: "AILIT",
      modules: ["What AI is — and isn't", "The main types of AI", "Using generative AI at work", "Data, privacy and confidentiality", "Risks and how to spot them", "Your responsible AI habits"]
    },
    "how-ai-works": {
      title: "How AI and Large Language Models Work",
      certPrefix: "HAIW",
      modules: ["From rules to learning", "Types of machine learning", "Neural networks and deep learning", "Language as numbers", "Transformers and how LLMs are trained", "Why LLMs get things wrong"]
    },
    "prompt-engineering": {
      title: "Prompt Engineering & Working with Generative AI",
      certPrefix: "PROMPT",
      modules: ["How prompts work", "Anatomy of a strong prompt", "Core prompting techniques", "Documents, data and images", "Templates and reusable workflows", "GenAI for research, writing and analysis"]
    },
    "validating-ai-output": {
      title: "Critical Thinking: Checking and Validating AI Output",
      certPrefix: "VALID",
      modules: ["Why validation matters", "How AI gets things wrong", "Fact-checking AI output", "Spotting bias", "Checking numbers, data and code", "When a human must decide"]
    },
    "responsible-ai": {
      title: "Responsible AI Principles & Ethics",
      certPrefix: "RAI",
      modules: ["Why responsible AI matters", "The principles landscape", "Fairness and bias", "Transparency, explainability and accountability", "Privacy, safety and human agency", "Ethics in practice"]
    },
    "ai-governance": {
      title: "AI Governance, Risk & Compliance",
      certPrefix: "AIGRC",
      modules: ["What AI governance is", "The regulatory landscape", "The NIST AI Risk Management Framework", "ISO/IEC 42001 and AI management systems", "Inventories, risk and impact assessment", "Running an AI governance programme"]
    },
    "ai-security": {
      title: "AI Security & Safety",
      certPrefix: "AISEC",
      modules: ["The AI threat landscape", "Prompt injection and jailbreaks", "Attacks on data and models", "Securing LLM applications", "Securing AI agents", "Red teaming, evaluation and secure operations"]
    },
    "rag": {
      title: "Building LLM Applications with RAG",
      certPrefix: "RAG",
      modules: ["Why LLMs need your data", "Embeddings and vector search", "Preparing documents: chunking and metadata", "Retrieval that works", "Generating grounded answers", "Evaluating and improving RAG"]
    },
    "ai-agents": {
      title: "AI Agents & Agentic Workflows",
      certPrefix: "AGENT",
      modules: ["What makes an AI agent", "Tool use and the Model Context Protocol", "Workflow patterns", "Building an agent loop", "Guardrails and human-in-the-loop", "Evaluating and operating agents"]
    },
    "fine-tuning": {
      title: "Fine-tuning & Model Optimisation",
      certPrefix: "FTUNE",
      modules: ["When to fine-tune", "Fine-tuning methods", "Preparing training data", "Running a fine-tune", "Evaluating fine-tuned models", "Making models smaller, faster and cheaper"]
    },
    "llmops": {
      title: "Evaluating & Deploying AI (LLMOps)",
      certPrefix: "LLMOPS",
      modules: ["From prototype to production", "Evaluating LLM quality", "Guardrails and safety in production", "Deploying AI applications", "Monitoring and observability", "Managing cost, change and governance"]
    },
    "python-for-ai": {
      title: "Python for AI",
      certPrefix: "PYAI",
      modules: ["Getting started with Python", "Data structures, logic and functions", "Files, text and JSON", "Working with data in pandas", "Calling AI model APIs", "Project: analysing reviews with AI"]
    },
    "data-quality": {
      title: "Data Quality & Preparation for AI",
      certPrefix: "DATAQ",
      modules: ["Why data quality decides AI quality", "Profiling and exploring data", "Cleaning data", "Labelling and annotation", "Representativeness, splits and leakage", "Documenting and governing data"]
    },
    "ml-fundamentals": {
      title: "Machine Learning Fundamentals",
      certPrefix: "MLF",
      modules: ["The machine learning workflow", "Regression: predicting numbers", "Classification and evaluation", "Better models: overfitting, ensembles and validation", "Unsupervised learning", "Interpreting and deploying models"]
    },
    "nlp-fundamentals": {
      title: "NLP Fundamentals",
      certPrefix: "NLP",
      modules: ["Text as data", "Text classification", "Embeddings and semantic search", "Information extraction", "Transformers and LLMs for NLP", "NLP in practice"]
    },
    "ai-business-strategy": {
      title: "AI Business Strategy",
      certPrefix: "AISTRAT",
      modules: ["AI and business value", "Finding and prioritising use cases", "Business cases and measuring value", "Build, buy and foundations", "Operating model, governance and risk", "Roadmaps and scaling"]
    },
    "ai-product-management": {
      title: "AI Product Management",
      certPrefix: "AIPM",
      modules: ["What makes AI products different", "Discovery: the right problem", "Designing AI experiences", "Specifying quality with evals", "Building and launching", "Operating and improving"]
    },
    "leading-ai-adoption": {
      title: "Leading AI Adoption & Change",
      certPrefix: "AIADOPT",
      modules: ["Why AI adoption is a people challenge", "Leading the change", "Building AI skills", "Redesigning work", "Trust, rules and responsible use", "Measuring and sustaining adoption"]
    }
  };
  Object.keys(COURSES).forEach(function (slug) {
    var c = COURSES[slug];
    c.slug = slug;
    if (!c.key) c.key = "rta-" + slug + "-progress";
    if (!c.certKey) c.certKey = "rta-cert-id-" + slug;
  });
  var CURRENT = document.body.getAttribute("data-course") || (PAGE === "course" ? "eu-ai-act" : null);
  var COURSE = CURRENT ? COURSES[CURRENT] : null;

  /* ---------- Safe storage ---------- */
  var store = {
    get: function (k, fallback) {
      try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
    },
    set: function (k, v) {
      try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ }
    }
  };
  function courseOf(slug) { return COURSES[slug || CURRENT] || COURSES["eu-ai-act"]; }
  function getProgress(slug) { return store.get(courseOf(slug).key, {}); }
  function setModule(id, data, slug) {
    var c = courseOf(slug);
    var p = store.get(c.key, {});
    p[id] = Object.assign({}, p[id] || {}, data);
    store.set(c.key, p);
  }

  /* ---------- Theme ---------- */
  var savedTheme = store.get("rta-theme", null);
  if (savedTheme) document.documentElement.setAttribute("data-theme", savedTheme);
  function toggleTheme() {
    var current = document.documentElement.getAttribute("data-theme");
    var isDark = current !== "light";            /* dark is the default theme */
    var next = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    store.set("rta-theme", next);
  }

  /* ---------- Header & footer ---------- */
  var navItems = [
    { id: "home", label: "Home", href: "index.html" },
    { id: "academy", label: "Academy", href: "academy/index.html" },
    { id: "tools", label: "Risk checker", href: "tools/risk-checker.html" },
    { id: "insights", label: "Insights", href: "insights/ai-skills-in-demand.html" },
    { id: "contact", label: "Contact", href: "index.html#contact" }
  ];

  function header() {
    var active = PAGE === "course" ? "academy" : PAGE;
    var links = navItems.map(function (n) {
      var cur = n.id === active ? ' aria-current="page"' : "";
      return '<a href="' + ROOT + n.href + '"' + cur + ">" + n.label + "</a>";
    }).join("");
    return (
      '<a class="skip-link" href="#main">Skip to content</a>' +
      '<header class="site-header"><div class="container bar">' +
      '<a class="brand" href="' + ROOT + 'index.html"><span class="brand-mark">RT</span><span>' + SITE_NAME + "</span></a>" +
      '<div style="display:flex;align-items:center;gap:8px">' +
      '<nav class="nav" id="site-nav" aria-label="Main">' + links + "</nav>" +
      '<button class="icon-btn" id="theme-btn" aria-label="Toggle dark mode" title="Toggle dark mode">' +
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg></button>' +
      '<button class="icon-btn menu-btn" id="menu-btn" aria-label="Open menu" aria-expanded="false" aria-controls="site-nav">' +
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg></button>' +
      "</div></div></header>"
    );
  }

  function footer() {
    var y = new Date().getFullYear();
    var a = ROOT + "academy/";
    return (
      '<footer class="site-footer"><div class="container">' +
      '<div class="footer-grid">' +
      "<div><h4>" + SITE_NAME + "</h4><p>Learning designer and AI educator. Practical, evidence-based learning in AI — from AI literacy and generative AI to machine learning, AI engineering and responsible AI.</p></div>" +
      '<div><h4>AI Foundations</h4><ul>' +
      '<li><a href="' + a + 'ai-literacy/index.html">AI Literacy for Work</a></li>' +
      '<li><a href="' + a + 'how-ai-works/index.html">How AI and LLMs Work</a></li>' +
      '<li><a href="' + a + 'prompt-engineering/index.html">Prompt Engineering</a></li>' +
      '<li><a href="' + a + 'validating-ai-output/index.html">Validating AI Output</a></li></ul></div>' +
      '<div><h4>Responsible AI</h4><ul>' +
      '<li><a href="' + a + 'eu-ai-act/index.html">EU AI Act Fundamentals</a></li>' +
      '<li><a href="' + a + 'responsible-ai/index.html">Responsible AI Principles</a></li>' +
      '<li><a href="' + a + 'ai-governance/index.html">AI Governance, Risk &amp; Compliance</a></li>' +
      '<li><a href="' + a + 'ai-security/index.html">AI Security &amp; Safety</a></li>' +
      '<li><a href="' + ROOT + 'tools/risk-checker.html">AI Act risk checker</a></li></ul></div>' +
      '<div><h4>Build &amp; lead</h4><ul>' +
      '<li><a href="' + a + 'index.html#data-ml">Data &amp; Machine Learning</a></li>' +
      '<li><a href="' + a + 'python-for-ai/index.html">Python for AI</a></li>' +
      '<li><a href="' + a + 'index.html#engineering">Generative AI Engineering</a></li>' +
      '<li><a href="' + a + 'rag/index.html">Building with RAG</a></li>' +
      '<li><a href="' + a + 'index.html#business">Business &amp; Leaders</a></li>' +
      '<li><a href="' + a + 'ai-business-strategy/index.html">AI Business Strategy</a></li></ul></div>' +
      '<div><h4>Connect</h4><ul>' +
      '<li><a href="' + a + 'index.html">All courses</a></li>' +
      '<li><a href="' + ROOT + 'insights/ai-skills-in-demand.html">In-demand AI skills</a></li>' +
      '<li><a href="mailto:' + CONTACT_EMAIL + '">Email</a></li>' +
      '<li><a href="' + LINKEDIN + '" target="_blank" rel="noopener">LinkedIn</a></li>' +
      '<li><a href="' + ROOT + 'index.html#contact">Work with me</a></li></ul></div>' +
      "</div>" +
      '<p class="disclaimer">Educational content only — not legal, security or professional advice. EU AI Act content reflects Regulation (EU) 2024/1689 as amended by the Digital Omnibus on AI, Regulation (EU) 2026/1744 (in force 27 July 2026). Last reviewed October 2026. Courses created with AI assistance and human review — <a href="' + a + 'how-these-courses-were-made.html">how these courses were made</a>. © ' + y + " " + SITE_NAME + ".</p>" +
      "</div></footer>"
    );
  }

  var h = document.getElementById("site-header");
  if (h) h.outerHTML = header();
  var f = document.getElementById("site-footer");
  if (f) f.outerHTML = footer();

  var tb = document.getElementById("theme-btn");
  if (tb) tb.addEventListener("click", toggleTheme);
  var mb = document.getElementById("menu-btn");
  if (mb) mb.addEventListener("click", function () {
    var nav = document.getElementById("site-nav");
    var open = nav.classList.toggle("open");
    mb.setAttribute("aria-expanded", open ? "true" : "false");
  });

  /* ---------- Course sidebar ---------- */
  var side = document.getElementById("course-nav");
  if (side && COURSE) {
    var cur = side.getAttribute("data-current");
    var prog = getProgress();
    var li = COURSE.modules.map(function (t, i) {
      var id = "m" + (i + 1);
      var c = cur === id ? ' aria-current="page"' : "";
      return '<li class="' + (prog[id] && prog[id].done ? "done" : "") + '"><a href="module-' + (i + 1) + '.html"' + c + ">" + (i + 1) + ". " + t.replace(/&/g, "&amp;") + "</a></li>";
    }).join("");
    var extras = [
      ["assessment", "assessment.html", "Final assessment"],
      ["certificate", "certificate.html", "Certificate"],
      ["glossary", "glossary.html", "Glossary"]
    ].map(function (x) {
      return '<li><a href="' + x[1] + '"' + (cur === x[0] ? ' aria-current="page"' : "") + ">" + x[2] + "</a></li>";
    }).join("");
    side.innerHTML = '<div class="side-title"><a href="index.html" style="text-decoration:none">' + COURSE.title.replace(/&/g, "&amp;") + "</a></div>" +
      '<div class="progress" style="margin:8px 0 6px" aria-hidden="true"><span data-progress-bar></span></div>' +
      '<p class="muted" style="font-size:.82rem;margin:0 0 14px" data-progress-text></p>' +
      "<ol>" + li + "</ol>" + '<div class="side-title">Wrap up</div><ol>' + extras + "</ol>";
  }

  /* ---------- Course progress UI ---------- */
  function slugFor(el) {
    var host = el.closest("[data-course]");
    return host ? host.getAttribute("data-course") : (CURRENT || "eu-ai-act");
  }
  function summary(slug) {
    var c = courseOf(slug), p = getProgress(slug);
    var n = c.modules.length;
    var done = 0;
    for (var i = 1; i <= n; i++) if (p["m" + i] && p["m" + i].done) done++;
    return { c: c, p: p, n: n, done: done };
  }
  function renderProgress() {
    document.querySelectorAll("[data-progress-bar]").forEach(function (el) {
      var s = summary(slugFor(el));
      el.style.width = Math.round((s.done / s.n) * 100) + "%";
    });
    document.querySelectorAll("[data-progress-text]").forEach(function (el) {
      var s = summary(slugFor(el));
      var a = s.p.assessment;
      el.textContent = s.done + " of " + s.n + " modules complete" +
        (a && a.passed ? " · Final assessment passed (" + a.score + "%)" : "");
    });
    if (!COURSE) return;
    var s = summary(CURRENT);
    document.querySelectorAll("[data-module]").forEach(function (el) {
      var rec = s.p[el.getAttribute("data-module")];
      if (rec && rec.done) {
        el.classList.add("done");
        var pill = el.querySelector(".status-pill");
        if (pill) pill.textContent = "Completed · " + rec.score + "%";
      }
    });
    var resume = document.querySelector("[data-resume]");
    if (resume) {
      var next = null;
      for (var i = 1; i <= s.n; i++) { if (!(s.p["m" + i] && s.p["m" + i].done)) { next = i; break; } }
      if (!next) {
        resume.textContent = (s.p.assessment && s.p.assessment.passed) ? "View your certificate" : "Take the final assessment";
        resume.href = (s.p.assessment && s.p.assessment.passed) ? "certificate.html" : "assessment.html";
      } else if (s.done > 0) {
        resume.textContent = "Continue: Module " + next;
        resume.href = "module-" + next + ".html";
      }
    }
  }
  renderProgress();

  /* ---------- Quiz engine ----------
     <div class="quiz" data-quiz="m1" data-pass="80">
       <script type="application/json">[{ "q": "...", "options": [...], "answer": 0, "explain": "..." }]</script>
     </div>
  */
  function shuffleOrder(n) {
    var a = []; for (var i = 0; i < n; i++) a.push(i);
    for (var j = a.length - 1; j > 0; j--) {
      var k = Math.floor(Math.random() * (j + 1));
      var t = a[j]; a[j] = a[k]; a[k] = t;
    }
    return a;
  }

  function buildQuiz(root) {
    var id = root.getAttribute("data-quiz");
    var pass = parseInt(root.getAttribute("data-pass") || "70", 10);
    var dataEl = root.querySelector('script[type="application/json"]');
    if (!dataEl) return;
    var items = JSON.parse(dataEl.textContent);
    var title = root.getAttribute("data-title") || "Knowledge check";
    var intro = root.getAttribute("data-intro") || ("Answer all " + items.length + " questions, then check your answers. Score " + pass + "% or more to complete this module.");

    var html = '<h2>' + title + '</h2><p class="muted">' + intro + "</p><form novalidate>";
    items.forEach(function (it, qi) {
      html += '<fieldset class="q" style="border:0;margin:0;padding-left:0;padding-right:0"><legend class="q-text"><span class="q-num">' + (qi + 1) + ".</span>" + it.q + '</legend><div class="opts">';
      shuffleOrder(it.options.length).forEach(function (oi) {
        html += '<label class="opt"><input type="radio" name="' + id + "-q" + qi + '" value="' + oi + '"><span>' + it.options[oi] + "</span></label>";
      });
      html += '</div><div class="feedback" aria-live="polite"></div></fieldset>';
    });
    html += '<div class="btn-row" style="margin-top:20px"><button type="submit" class="btn btn-primary">Check answers</button>' +
      '<button type="button" class="btn btn-ghost" data-reset>Try again</button></div>' +
      '<div class="quiz-result" aria-live="polite"></div></form>';
    root.innerHTML = html;

    var form = root.querySelector("form");
    var result = root.querySelector(".quiz-result");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var unanswered = 0, correct = 0;
      items.forEach(function (it, qi) {
        if (!form.querySelector('input[name="' + id + "-q" + qi + '"]:checked')) unanswered++;
      });
      if (unanswered) {
        result.className = "quiz-result show";
        result.innerHTML = "Please answer all questions (" + unanswered + " left).";
        return;
      }
      var fs = form.querySelectorAll(".q");
      items.forEach(function (it, qi) {
        var chosen = form.querySelector('input[name="' + id + "-q" + qi + '"]:checked');
        var val = parseInt(chosen.value, 10);
        var ok = val === it.answer;
        if (ok) correct++;
        fs[qi].querySelectorAll(".opt").forEach(function (o) {
          o.classList.remove("correct", "wrong");
          var v = parseInt(o.querySelector("input").value, 10);
          if (v === it.answer) o.classList.add("correct");
          else if (v === val) o.classList.add("wrong");
        });
        var fb = fs[qi].querySelector(".feedback");
        fb.className = "feedback show " + (ok ? "good" : "bad");
        fb.innerHTML = "<b>" + (ok ? "Correct. " : "Not quite. ") + "</b>" + (it.explain || "");
      });
      var score = Math.round((correct / items.length) * 100);
      var passed = score >= pass;
      result.className = "quiz-result show";

      if (id === "assessment") {
        var prev = getProgress().assessment || {};
        var best = Math.max(score, prev.score || 0);
        setModule("assessment", { score: best, passed: passed || !!prev.passed, date: passed ? new Date().toISOString() : (prev.date || null) });
        result.innerHTML = '<div class="score-big">' + score + "%</div><p>" + correct + " of " + items.length + " correct. " +
          (passed ? "You passed the " + courseOf().title + " assessment." : "The pass mark is " + pass + "%. Review the explanations above and try again.") + "</p>" +
          (passed ? '<a class="btn btn-primary" href="certificate.html">Get your certificate</a>' : "");
      } else {
        var prevM = getProgress()[id] || {};
        if (passed || prevM.done) setModule(id, { done: true, score: Math.max(score, prevM.score || 0) });
        var nextHref = root.getAttribute("data-next");
        result.innerHTML = '<div class="score-big">' + score + "%</div><p>" + correct + " of " + items.length + " correct. " +
          (passed ? "Module complete — well done." : "You need " + pass + "% to complete this module. Read the explanations and try again.") + "</p>" +
          (passed && nextHref ? '<a class="btn btn-primary" href="' + nextHref + '">Continue →</a>' : "");
      }
      renderProgress();
      result.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    root.querySelector("[data-reset]").addEventListener("click", function () {
      form.reset();
      form.querySelectorAll(".opt").forEach(function (o) { o.classList.remove("correct", "wrong"); });
      form.querySelectorAll(".feedback").forEach(function (fb) { fb.className = "feedback"; fb.innerHTML = ""; });
      result.className = "quiz-result"; result.innerHTML = "";
      root.scrollIntoView({ behavior: "smooth" });
    });
  }
  document.querySelectorAll(".quiz[data-quiz]").forEach(buildQuiz);

  /* ---------- Certificate (pages with <div id="cert" data-auto>) ---------- */
  function initCertificate() {
    var cert = document.getElementById("cert");
    if (!cert || !cert.hasAttribute("data-auto") || !COURSE) return;
    var a = getProgress().assessment;
    if (!a || !a.passed) { document.getElementById("locked").style.display = "block"; return; }
    document.getElementById("unlocked").style.display = "block";
    var d = a.date ? new Date(a.date) : new Date();
    document.getElementById("cert-score").textContent = a.score + "%";
    document.getElementById("cert-date").textContent = d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    var cid = store.get(COURSE.certKey, null);
    if (!cid) {
      cid = COURSE.certPrefix + "-" + d.getFullYear() + "-" + Math.random().toString(36).slice(2, 8).toUpperCase();
      store.set(COURSE.certKey, cid);
    }
    document.getElementById("cert-id").textContent = cid;
    var input = document.getElementById("cert-input");
    var nameEl = document.getElementById("cert-name");
    var saved = store.get("rta-cert-name", "");
    if (saved) { input.value = saved; nameEl.textContent = saved; }
    input.addEventListener("input", function () {
      nameEl.textContent = input.value.trim() || "Your name";
      store.set("rta-cert-name", input.value.trim());
    });
    document.getElementById("print-btn").addEventListener("click", function () {
      if (!input.value.trim()) { input.focus(); input.setAttribute("aria-invalid", "true"); return; }
      window.print();
    });
  }
  initCertificate();

  /* ---------- Glossary search (<input id="g-search" data-auto>) ---------- */
  var gs = document.getElementById("g-search");
  if (gs && gs.hasAttribute("data-auto")) {
    var dts = Array.prototype.slice.call(document.querySelectorAll("#glossary dt"));
    gs.addEventListener("input", function () {
      var q = gs.value.trim().toLowerCase(), shown = 0;
      dts.forEach(function (dt) {
        var dd = dt.nextElementSibling;
        var match = !q || (dt.textContent + " " + dd.textContent).toLowerCase().indexOf(q) !== -1;
        dt.style.display = dd.style.display = match ? "" : "none";
        if (match) shown++;
      });
      document.getElementById("g-empty").style.display = shown ? "none" : "block";
    });
  }

  /* ---------- Copy buttons for prompt and code blocks ---------- */
  document.querySelectorAll("pre[data-copy]").forEach(function (pre) {
    var btn = document.createElement("button");
    btn.type = "button"; btn.className = "copy-btn"; btn.textContent = "Copy";
    btn.addEventListener("click", function () {
      var src = (pre.querySelector("code") || pre).cloneNode(true);
      src.querySelectorAll(".label, .copy-btn").forEach(function (n) { n.remove(); });
      var text = src.textContent.replace(/^\n+/, "");
      var done = function () { btn.textContent = "Copied"; setTimeout(function () { btn.textContent = "Copy"; }, 1500); };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () {});
    });
    pre.appendChild(btn);
  });

  /* ---------- Expose helpers for page scripts ---------- */
  window.RTA = { store: store, courses: COURSES, getProgress: getProgress, setModule: setModule, renderProgress: renderProgress };
})();
