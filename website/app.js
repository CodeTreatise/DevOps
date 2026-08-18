/* Platform Engineering Path — static site app v2. Renders window.PATH_DATA. */
(function () {
  "use strict";

  const D = window.PATH_DATA;
  if (!D) {
    document.getElementById("view").innerHTML =
      '<div class="empty-state">data.js missing — regenerate from the JSON</div>';
    return;
  }

  const $view = document.getElementById("view");
  const PROGRESS_KEY = "platform-path-progress-v1";
  const TRACKER_KEY = "platform-path-tracker-v1";
  const LABS_KEY = "platform-path-labs-v1";
  const TRACKER_STAGES = ["📝 Applied", "🔍 Screening", "🧪 Tech R1", "🧪 Tech R2", "🏢 HR / Managerial", "🎉 Offer", "❌ Rejected", "⏸ On hold"];

  /* ---------------- helpers ---------------- */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function shortTitle(t) {
    for (const sep of [" — ", "—"]) {
      const idx = String(t || "").indexOf(sep);
      if (idx > 0) return String(t).slice(0, idx).trim();
    }
    return String(t || "");
  }

  // Wrap module codes (A01..B09) found in a plain-text string in clickable chips.
  function moduleCodesHTML(text) {
    if (!text) return "";
    const parts = String(text).split(/([AB]\d{2})/g);
    return parts.map((p) => {
      if (/^[AB]\d{2}$/.test(p)) {
        const mm = moduleById(p);
        return '<a href="#" class="mod-chip" data-view="module:' + esc(p) + '" title="' + esc(mm ? mm.title : p) + '">' + esc(p) + "</a>";
      }
      return esc(p);
    }).join("");
  }

  function allModules() {
    return D.phases.flatMap((p) => p.modules || []);
  }

  function moduleById(id) {
    return allModules().find((m) => m.id === id);
  }

  function moduleStats(m) {
    let items = 0, req = 0, res = 0;
    (m.subTopics || []).forEach((st) => {
      (st.items || []).forEach((i) => {
        items++;
        if (i.required !== false) req++;
        res += (i.resources || []).length;
      });
    });
    return { subtopics: (m.subTopics || []).length, items, req, optional: items - req, res };
  }

  /* ---------------- progress ---------------- */
  function getProgress() {
    try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}"); }
    catch (e) { return {}; }
  }
  function saveProgress(p) {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
    updateProgressUI();
  }
  function itemKey(mId, stName, iTitle) {
    return mId + "::" + stName + "::" + iTitle;
  }
  function toggleItem(mId, stName, iTitle, checked) {
    const p = getProgress();
    const k = itemKey(mId, stName, iTitle);
    if (checked) p[k] = 1; else delete p[k];
    saveProgress(p);
  }
  function moduleDone(m) {
    const p = getProgress();
    let done = 0;
    (m.subTopics || []).forEach((st) => (st.items || []).forEach((i) => {
      if (p[itemKey(m.id, st.name, i.title)]) done++;
    }));
    return done;
  }
  function modulePct(m) {
    const s = moduleStats(m);
    return s.items ? Math.round((moduleDone(m) / s.items) * 100) : 0;
  }

  /* ---------------- application tracker ---------------- */
  function getApps() {
    try { return JSON.parse(localStorage.getItem(TRACKER_KEY) || "[]"); }
    catch (e) { return []; }
  }
  function saveApps(list) {
    localStorage.setItem(TRACKER_KEY, JSON.stringify(list));
  }
  function appStats(list) {
    const st = { total: list.length };
    TRACKER_STAGES.forEach((s) => {
      st[s] = list.filter((a) => a.stage === s).length;
    });
    st.offers = st["🎉 Offer"];
    st.pipeline = list.filter((a) => !["❌ Rejected", "⏸ On hold", "🎉 Offer"].includes(a.stage)).length;
    return st;
  }

  /* ---------------- lab checklists ---------------- */
  function getLabDone() {
    try { return JSON.parse(localStorage.getItem(LABS_KEY) || "{}"); }
    catch (e) { return {}; }
  }
  function labKey(mId, i) { return mId + "::" + i; }
  function toggleLab(mId, i, checked) {
    const d = getLabDone();
    const k = labKey(mId, i);
    if (checked) d[k] = 1; else delete d[k];
    localStorage.setItem(LABS_KEY, JSON.stringify(d));
  }

  /* ---------------- practice mode + mastery ---------------- */
  const PRACTICE_KEY = "platform-path-practice-v1";
  const RATE_NAMES = ["🧠 Forgot", "🤏 Partial", "👍 Knew"];
  const RATE_DUE_DAYS = [0, 1, 3];
  const practiceState = { mid: "all", dueOnly: false, order: [], pos: 0, revealed: false };

  function getPractice() {
    try { return JSON.parse(localStorage.getItem(PRACTICE_KEY) || "{}"); }
    catch (e) { return {}; }
  }
  function savePractice(p) { localStorage.setItem(PRACTICE_KEY, JSON.stringify(p)); }
  function qid(mid, idx) { return mid + "-" + idx; }
  function stopSpeak() {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }

  function allQuestions() {
    const A = window.ANSWERS_DATA || {};
    const out = [];
    allModules().forEach((m) => {
      (A[m.id] || []).forEach((x, idx) => {
        out.push({ mid: m.id, title: m.title, icon: m.icon, idx, q: x.q, a: x.a, r: x.r, w: x.w });
      });
    });
    return out;
  }

  function buildPracticeOrder(mid, dueOnly) {
    const p = getPractice();
    const now = Date.now();
    const qs = allQuestions().filter((x) => mid === "all" || x.mid === mid);
    if (dueOnly) {
      return qs.filter((x) => { const rec = p[qid(x.mid, x.idx)]; return !rec || rec.d <= now; });
    }
    for (let i = qs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = qs[i]; qs[i] = qs[j]; qs[j] = t;
    }
    const due = qs.filter((x) => { const rec = p[qid(x.mid, x.idx)]; return rec && rec.d <= now; });
    const rest = qs.filter((x) => { const rec = p[qid(x.mid, x.idx)]; return !rec || rec.d > now; });
    return due.concat(rest);
  }

  function rateColor(r) {
    return r === 2 ? "var(--green)" : r === 1 ? "var(--cyan)" : "var(--accent)";
  }

  function masteryFor(mid, p) {
    const A = (window.ANSWERS_DATA || {})[mid] || [];
    if (!A.length) return { answered: 0, total: 0, pct: 0, avg: 0 };
    let score = 0, answered = 0;
    A.forEach((_, idx) => {
      const rec = p[qid(mid, idx)];
      if (rec) { answered++; score += rec.r; }
    });
    return { answered, total: A.length, pct: Math.round((score / (A.length * 2)) * 100), avg: answered ? score / answered : 0 };
  }

  function updateProgressUI() {
    const p = getProgress();
    let total = 0, done = 0;
    allModules().forEach((m) => {
      (m.subTopics || []).forEach((st) => (st.items || []).forEach((i) => {
        total++;
        if (p[itemKey(m.id, st.name, i.title)]) done++;
      }));
    });
    const pct = total ? Math.round((done / total) * 100) : 0;
    const fill = document.getElementById("progress-fill");
    const pctEl = document.getElementById("progress-pct");
    const txtEl = document.getElementById("progress-text");
    if (fill) fill.style.width = pct + "%";
    if (pctEl) pctEl.textContent = pct + "%";
    if (txtEl) txtEl.textContent = done + " / " + total + " items";
    // phase bars + nav counts + rings (when rendered)
    document.querySelectorAll(".phase-progress > div").forEach((bar) => {
      const phId = bar.dataset.phase;
      const ph = D.phases.find((x) => x.id === phId);
      if (ph) {
        let phTotal = 0, phDone = 0;
        (ph.modules || []).forEach((m) => (m.subTopics || []).forEach((st) => (st.items || []).forEach((i) => {
          phTotal++;
          if (p[itemKey(m.id, st.name, i.title)]) phDone++;
        })));
        bar.style.width = (phTotal ? Math.round((phDone / phTotal) * 100) : 0) + "%";
      }
    });
    document.querySelectorAll(".nav-count").forEach((el) => {
      const m = moduleById(el.dataset.module);
      if (m) el.textContent = moduleDone(m) + "/" + moduleStats(m).items;
    });
    document.querySelectorAll(".ring-fg[data-module]").forEach((r) => {
      const m = moduleById(r.dataset.module);
      if (m) setRing(r, modulePct(m));
    });
    document.querySelectorAll(".ring-txt[data-module]").forEach((t) => {
      const m = moduleById(t.dataset.module);
      if (m) t.textContent = modulePct(m) + "%";
    });
  }

  function setRing(circle, pct) {
    const r = 15;
    const c = 2 * Math.PI * r;
    circle.style.strokeDashoffset = c - (pct / 100) * c;
  }

  /* ---------------- renderers ---------------- */
  const RING_DEFS =
    '<svg width="0" height="0" style="position:absolute">' +
    '<defs><linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">' +
    '<stop offset="0%" stop-color="#6d8dff"/><stop offset="55%" stop-color="#b16dff"/>' +
    '<stop offset="100%" stop-color="#38e1e8"/>' +
    "</linearGradient></defs></svg>";

  function ringHTML(m, pct) {
    const r = 15, c = 2 * Math.PI * r;
    const off = c - (pct / 100) * c;
    return (
      '<svg class="ring" viewBox="0 0 36 36">' +
      '<circle class="ring-bg" cx="18" cy="18" r="' + r + '"/>' +
      '<circle class="ring-fg" data-module="' + esc(m.id) + '" cx="18" cy="18" r="' + r + '"' +
      ' stroke-dasharray="' + c + '" stroke-dashoffset="' + off + '"/>' +
      '<text class="ring-txt" data-module="' + esc(m.id) + '" x="18" y="21.5">' + pct + "%</text>" +
      "</svg>"
    );
  }

  function pagerHTML(m) {
    const mods = allModules();
    const idx = mods.findIndex((x) => x.id === m.id);
    const prev = idx > 0 ? mods[idx - 1] : null;
    const next = idx < mods.length - 1 ? mods[idx + 1] : null;
    let html = '<div class="pager">';
    if (prev) html += '<a href="#" class="pager-btn prev" data-view="module:' + esc(prev.id) + '">← ' + esc(prev.id) + " · " + esc(shortTitle(prev.title)) + "</a>";
    else html += '<span class="pager-btn disabled">← Start of path</span>';
    if (next) html += '<a href="#" class="pager-btn next" data-view="module:' + esc(next.id) + '">Next: ' + esc(next.id) + " · " + esc(shortTitle(next.title)) + " →</a>";
    else html += '<span class="pager-btn disabled">End of path 🎉</span>';
    html += "</div>";
    return html;
  }

  function badgeFor(r) {
    const kind = '<span class="badge kind">' + esc(r.kind || "link") + "</span>";
    if (r.verified === "fetch-verified")
      return kind + ' <span class="badge verified">✅ verified</span>';
    if (r.verified === "official-doc")
      return kind + ' <span class="badge official">📖 official</span>';
    return kind + ' <span class="badge unverified">❔ unverified</span>';
  }

  function researchHTML(block, title, open) {
    if (!block) return "";
    const hasAny =
      (block.interviewFocus && block.interviewFocus.length) ||
      block.practice || block.depthNote ||
      block.demandNotes || (block.verifiedResources && block.verifiedResources.length) ||
      (block.depthSequence && block.depthSequence.length) ||
      (block.certifications && block.certifications.length);
    if (!hasAny) return "";
    let body = "";
    if (block.interviewFocus && block.interviewFocus.length) {
      body += '<div class="rb-label">Interview focus</div><ul>';
      block.interviewFocus.forEach((q) => { body += "<li>" + esc(q) + "</li>"; });
      body += "</ul>";
    }
    if (block.practice) body += '<div class="rb-label">Practice</div><p>' + esc(block.practice) + "</p>";
    if (block.depthNote) body += '<div class="rb-label">Depth note</div><p>' + esc(block.depthNote) + "</p>";
    if (block.demandNotes) body += '<div class="rb-label">Demand</div><p>' + esc(block.demandNotes) + "</p>";
    if (block.verifiedResources && block.verifiedResources.length) {
      body += '<div class="rb-label">Verified resources</div><ul>';
      block.verifiedResources.forEach((r) => {
        const mark = r.verified === "fetch-verified" ? "✅" : "📖";
        body += '<li>' + mark + ' <a href="' + esc(r.url) + '" target="_blank" rel="noopener">' + esc(r.name) + "</a></li>";
      });
      body += "</ul>";
    }
    if (block.depthSequence && block.depthSequence.length) {
      body += '<div class="rb-label">Depth sequence</div><ul>';
      block.depthSequence.forEach((s) => { body += "<li>" + esc(s) + "</li>"; });
      body += "</ul>";
    }
    if (block.certifications && block.certifications.length) {
      body += '<div class="rb-label">Certifications</div><ul>';
      block.certifications.forEach((c) => {
        if (typeof c === "object" && c) body += "<li>" + esc(c.cert || c.name || "") + "</li>";
        else body += "<li>" + esc(c) + "</li>";
      });
      body += "</ul>";
    }
    return (
      '<details class="research-block"' + (open ? " open" : "") + ">" +
      "<summary><span class='caret'>▶</span> " + esc(title) + "</summary>" +
      '<div class="rb-body">' + body + "</div></details>"
    );
  }

  function renderSidebar() {
    const phasesEl = document.getElementById("nav-phases");
    let html = "";
    D.phases.forEach((ph) => {
      html += '<div class="phase-label">Phase ' + esc(ph.id) + " — " + esc(ph.name) + "</div>";
      html += '<div class="phase-progress"><div data-phase="' + esc(ph.id) + '" style="width:0%"></div></div>';
      (ph.modules || []).forEach((m) => {
        const s = moduleStats(m);
        const pct = modulePct(m);
        html +=
          '<a href="#" data-view="module:' + esc(m.id) + '" class="nav-link">' +
          '<span class="nav-ico">' + esc(m.icon) + "</span>" +
          "<span>" + esc(m.id + " " + m.title) + "</span>" +
          '<span class="nav-count" data-module="' + esc(m.id) + '">' + moduleDone(m) + "/" + s.items + "</span></a>";
      });
    });
    phasesEl.innerHTML = html;
    document.querySelectorAll("#nav .nav-link").forEach((a) => {
      a.classList.toggle("active", a.dataset.view === currentView);
    });
    updateProgressUI();
  }

  /* ---------------- state ---------------- */
  let currentView = "overview";
  const moduleState = {};
  function getMState(id) {
    if (!moduleState[id]) moduleState[id] = { search: "", hideOptional: false, openResearch: false };
    return moduleState[id];
  }

  /* ---------------- views ---------------- */
  function viewOverview() {
    const meta = D.meta;
    let html = '<div class="hero">';
    html += '<span class="eyebrow">● Interactive learning path</span>';
    const titleParts = meta.title.split(" — ");
    html += "<h1>" + esc(titleParts[0]) + ' <span class="grad-text">' + esc(titleParts[1] || "") + "</span></h1>";
    html += '<div class="sub">Version ' + esc(meta.version) + " · generated " + esc(meta.generated) + "</div>";

    const mods = allModules();
    const sTot = mods.reduce((a, m) => a + moduleStats(m).subtopics, 0);
    const iTot = mods.reduce((a, m) => a + moduleStats(m).items, 0);
    const rTot = mods.reduce((a, m) => a + moduleStats(m).res, 0);
    html += '<div class="chips">' +
      '<span class="chip">🧩 <b>' + mods.length + "</b> modules</span>" +
      '<span class="chip">📑 <b>' + sTot + "</b> sub-topics</span>" +
      '<span class="chip">✅ <b>' + iTot + "</b> items</span>" +
      '<span class="chip">🔗 <b>' + rTot + "</b> resources</span>" +
      '<span class="chip">💰 <b>$' + meta.totalCost + "</b> total cost</span>" +
      '<span class="chip">⏱ <b>' + esc(meta.totalTime) + "</b></span>" +
      "</div></div>";

    html += '<div class="howto-card"><div class="howto-title">🧭 How to use this path</div>' +
      '<div class="howto-grid">' +
      '<div class="howto-step"><b>1 · Follow the order</b><span>Modules are sequenced — each card shows 🧱 what it needs first. Do A01 → A06 in order, then follow each B module\'s needs.</span></div>' +
      '<div class="howto-step"><b>2 · Tick items as you do them</b><span>Progress is saved in your browser. A module is done when its 🎯 exit test is true — not just when boxes are ticked.</span></div>' +
      '<div class="howto-step"><b>3 · Use 🔬 Research for interviews</b><span>Every module and sub-topic has interview questions, a practice drill, and a depth note. Open them in module view before interviews.</span></div>' +
      '<div class="howto-step"><b>4 · Follow the depth sequence weekly</b><span>Each module lists a week-by-week plan — do it in order. Resources are tagged ✅ verified / 📖 official / ❔ unverified.</span></div>' +
      '<div class="howto-step"><b>5 · Use the Job Toolkit when applying</b><span>See who\'s hiring (<a href="#" class="howto-link" data-view="companies">🏢 Companies</a>), drill their questions (<a href="#" class="howto-link" data-view="companyqs">🎯 Q-Sets</a>), track every application (<a href="#" class="howto-link" data-view="tracker">🗂 Tracker</a>), and boost shortlists (<a href="#" class="howto-link" data-view="certs">🎓 Certs</a>).</span></div>' +
      "</div></div>";

    if (meta.notes && meta.notes.length) {
      html += '<details class="notes-card"><summary>📝 Notes · maintainer log (' + meta.notes.length + ')</summary><ul>';
      meta.notes.forEach((n) => { html += "<li>" + esc(n) + "</li>"; });
      html += "</ul></details>";
    }

    D.phases.forEach((ph, phIdx) => {
      html += '<section class="phase-section"><div class="phase-head">' +
        "<h2>Phase " + esc(ph.id) + " — " + esc(ph.name) + "</h2>" +
        '<span class="ph-badge">' + esc(ph.weeks) + "</span></div>";
      if (ph.goal) html += '<div class="phase-goal">' + esc(ph.goal) + "</div>";
      if (ph.prerequisites) html += '<div class="phase-prereq">🧱 Prerequisite: ' + esc(ph.prerequisites) + "</div>";
      html += '<div class="module-grid">';
      (ph.modules || []).forEach((m, mIdx) => {
        const s = moduleStats(m);
        const pct = modulePct(m);
        html +=
          '<div class="module-card" data-open="' + esc(m.id) + '" style="animation-delay:' + ((phIdx * 2 + mIdx) * 60) + 'ms">' +
          '<div class="mc-top">' +
          '<div class="mc-icon">' + esc(m.icon) + "</div>" +
          '<div class="mc-title"><span class="mc-id">' + esc(m.id) + "</span>" + esc(m.title) + "</div>" +
          '<div class="mc-ring">' + ringHTML(m, pct) + "</div>" +
          "</div>" +
          '<div class="mc-stats">' +
          '<span class="mc-stat">🧩 <b>' + s.subtopics + "</b></span>" +
          '<span class="mc-stat">✅ <b>' + s.items + "</b></span>" +
          '<span class="mc-stat">🟡 <b>' + s.optional + "</b></span>" +
          '<span class="mc-stat">🔗 <b>' + s.res + "</b></span>" +
          '<span class="mc-stat">⏱ <b>' + esc(m.weeks) + "</b></span>" +
          "</div>" +
          (m.dependsOn && m.dependsOn.length
            ? '<div class="needs">🧱 Needs: ' + m.dependsOn.map((x) => {
                const mm = moduleById(x);
                return '<span class="needs-chip" title="' + esc(mm ? mm.title : x) + '">' + esc(x) + "</span>";
              }).join(" ") + "</div>"
            : '<div class="needs start">🚀 Start here — no prerequisites</div>') +
          "</div>";
      });
      html += "</div></section>";
    });

    html += "<footer><span>Source of truth: <code>Platform-Engineering-Path.json</code></span>" +
      '<span class="dot">•</span><span>rendered 1:1 · offline-capable</span></footer>';
    $view.innerHTML = RING_DEFS + html;
  }

  function viewModule(id) {
    const m = moduleById(id);
    if (!m) { $view.innerHTML = '<div class="empty-state">Module not found</div>'; return; }
    const st = getMState(id);
    const s = moduleStats(m);
    const p = getProgress();
    const doneInMod = moduleDone(m);

    let html = '<a href="#" class="back-link" data-view="overview">← All modules</a>';
    html += pagerHTML(m);
    html += '<div class="module-head"><div class="mh-top">' +
      '<div class="mc-icon" style="width:52px;height:52px;font-size:26px">' + esc(m.icon) + "</div>" +
      "<h1>" + esc(m.id + " — " + m.title) + "</h1></div>";
    html += '<div class="meta-line">' +
      '<span class="meta-item">⏱ <b>' + esc(m.weeks) + "</b></span>" +
      '<span class="meta-item">🧩 <b>' + s.subtopics + "</b> sub-topics</span>" +
      '<span class="meta-item">✅ <b>' + s.items + "</b> items</span>" +
      '<span class="meta-item">🟡 <b>' + s.optional + "</b> optional</span>" +
      '<span class="meta-item">🔗 <b>' + s.res + "</b> resources</span>" +
      '<span class="meta-item">📈 <b>' + doneInMod + "/" + s.items + "</b> done</span>" +
      "</div>";
    if (m.dependsOn && m.dependsOn.length) {
      html += '<div class="needs-line">🧱 Depends on: ' + m.dependsOn.map((x) => {
        const mm = moduleById(x);
        return '<a href="#" data-view="module:' + esc(x) + '" class="needs-chip link">' + esc(x) + " · " + esc(mm ? shortTitle(mm.title) : "") + "</a>";
      }).join(" ") + "</div>";
    } else {
      html += '<div class="needs-line start">🚀 Start here — this module has no prerequisites.</div>';
    }
    html += "</div>";

    html += '<div class="callout"><span class="lbl">🧠 Mental model</span>' + esc(m.mentalModel) + "</div>";
    if (m.exitTest) html += '<div class="callout"><span class="lbl">🎯 Exit test</span>' + esc(m.exitTest) + "</div>";

    html += '<div class="toolbar">' +
      '<input type="search" id="mod-search" placeholder="Filter items in this module…" value="' + esc(st.search) + '">' +
      '<button class="toggle-btn' + (st.hideOptional ? " active" : "") + '" id="hide-opt">🟡 Hide optional</button>' +
      '<button class="toggle-btn' + (st.openResearch ? " active" : "") + '" id="open-res">🔬 Research</button>' +
      '<span class="counts" id="counts"></span></div>';

    let shown = 0;
    (m.subTopics || []).forEach((sub) => {
      const items = (sub.items || []).filter((i) => {
        const q = st.search.trim().toLowerCase();
        if (q) {
          const hay = (i.title + " " + i.detail).toLowerCase();
          if (!hay.includes(q)) return false;
        }
        if (st.hideOptional && i.required === false) return false;
        return true;
      });
      if (!items.length && st.search.trim()) return;
      html += '<section class="subtopic"><h2>' + esc(sub.name) + "</h2>";
      if (sub.note) html += '<div class="st-note">⚠️ ' + esc(sub.note) + "</div>";
      html += '<div class="items">';
      items.forEach((i) => {
        const k = itemKey(m.id, sub.name, i.title);
        const done = !!p[k];
        shown++;
        html += '<div class="item' + (done ? " done" : "") + '">' +
          '<input type="checkbox" data-key="' + esc(k) + '"' + (done ? " checked" : "") + ">" +
          '<div class="item-body">' +
          '<div class="item-title">' +
          (i.required === false ? '<span class="opt-tag">OPTIONAL</span>' : "") +
          esc(i.title) + "</div>" +
          (i.detail ? '<div class="item-detail">' + esc(i.detail) + "</div>" : "") +
          (i.resources && i.resources.length
            ? '<div class="resources">' + i.resources.map((r) =>
                '<span class="resource">📚 <a href="' + esc(r.url) + '" target="_blank" rel="noopener">' + esc(r.name) +
                "</a> " + badgeFor(r) + "</span>").join("") + "</div>"
            : "") +
          "</div></div>";
      });
      html += "</div>";
      html += researchHTML(sub.research, "Sub-topic research & interview prep", st.openResearch);
      html += "</section>";
    });

    if (shown === 0) {
      html += '<div class="empty-state" style="margin:20px 0">No items match' +
        (st.search.trim() ? ' “' + esc(st.search.trim()) + '”' : " the current filters") +
        " — clear the search or un-hide optional items.</div>";
    }

    html += researchHTML(m.research, "Module research & interview prep", st.openResearch);
    html += pagerHTML(m);

    $view.innerHTML = RING_DEFS + html;
    document.getElementById("counts").textContent = "showing " + shown + (st.hideOptional ? " · required only" : "");

    document.getElementById("mod-search").addEventListener("input", (e) => {
      st.search = e.target.value; viewModule(id);
    });
    document.getElementById("hide-opt").addEventListener("click", () => {
      st.hideOptional = !st.hideOptional; viewModule(id);
    });
    document.getElementById("open-res").addEventListener("click", () => {
      st.openResearch = !st.openResearch; viewModule(id);
    });
    document.querySelectorAll('.item input[type="checkbox"]').forEach((cb) => {
      cb.addEventListener("change", () => {
        const [mId, stName, ...rest] = cb.dataset.key.split("::");
        toggleItem(mId, stName, rest.join("::"), cb.checked);
        cb.closest(".item").classList.toggle("done", cb.checked);
        // update module header done count + sidebar
        const metaEl = document.querySelector('.meta-item[data-done]');
        if (metaEl) {
          const dm = moduleDone(m);
          metaEl.innerHTML = "📈 <b>" + dm + "/" + s.items + "</b> done";
        }
      });
    });
  }

  function viewMarket() {
    const md = D.marketData;
    let html = '<div class="appendix"><h1>📊 Market Data</h1>';
    html += '<p class="sec-desc">Salary & demand figures with per-region provenance — refreshed 2026.</p>';
    (md.regions || []).forEach((r) => {
      html += "<h2>" + esc(r.region) + "</h2>";
      html += '<div class="table-wrap"><table><thead><tr><th>Level</th><th>Salary range</th><th>Sources</th></tr></thead><tbody>';
      (r.rows || []).forEach((row) => {
        const srcs = Array.isArray(row.sources) ? row.sources.join("; ") : (row.sources || "");
        html += "<tr><td>" + esc(row.level) + "</td><td><b>" + esc(row.range) + "</b></td><td style='color:var(--text-dim);font-size:12px'>" + esc(srcs) + "</td></tr>";
      });
      html += "</tbody></table></div>";
      if (r.facts && r.facts.length) {
        html += '<ul class="facts-list">' + r.facts.map((f) => "<li>" + esc(f) + "</li>").join("") + "</ul>";
      }
    });

    if (md.premiumSkills && md.premiumSkills.length) {
      html += "<h2>💎 Premium skills</h2>";
      html += '<div class="table-wrap"><table><thead><tr><th>Skill</th><th>Premium</th><th>Module</th></tr></thead><tbody>';
      md.premiumSkills.forEach((p) => {
        html += "<tr><td>" + esc(p.skill) + "</td><td>" + esc(p.premium) + "</td><td>" + esc(p.module) + "</td></tr>";
      });
      html += "</tbody></table></div>";
    }

    if (md.certifications && md.certifications.length) {
      html += "<h2>🎓 Certifications</h2>";
      html += '<div class="table-wrap"><table><thead><tr><th>Certification</th><th>Effect</th><th>When</th></tr></thead><tbody>';
      md.certifications.forEach((c) => {
        html += "<tr><td>" + esc(c.cert) + "</td><td>" + esc(c.effect) + "</td><td>" + esc(c.when) + "</td></tr>";
      });
      html += "</tbody></table></div>";
      html += '<div class="chips" style="margin-top:10px"><a href="#" class="chip-link" data-view="certs">🎓 Full timeline, costs & study plans →</a></div>';
    }
    html += "</div>";
    $view.innerHTML = html;
  }

  function viewJobs() {
    const jr = D.jobRequirements;
    let html = '<div class="appendix"><h1>💼 Job Requirements</h1>';
    html += '<p class="sec-desc">' + esc(jr.source) + "</p>";
    const st = jr.stats || {};
    html += '<div class="chips">' +
      '<span class="chip">📋 <b>' + st.total + "</b> requirements</span>" +
      '<span class="chip">✅ <b>' + st.covered + "</b> covered</span>" +
      '<span class="chip">🟡 <b>' + st.partial + "</b> partial</span>" +
      '<span class="chip">❌ <b>' + st.gap + "</b> gap</span>" +
      "</div>";
    if (jr.note) html += '<div class="phase-prereq" style="color:var(--text-dim);border-color:var(--stroke-2);background:var(--panel)">⚠️ ' + esc(jr.note) + "</div>";
    html += '<div class="table-wrap"><table><thead><tr><th>JD Requirement</th><th>Status</th><th>Covered in</th><th>Note</th></tr></thead><tbody>';
    (jr.rows || []).forEach((r) => {
      const icon = r.status === "covered" ? "✅" : r.status === "partial" ? "🟡" : "❌";
      const cls = r.status === "gap" ? "badge unverified" : r.status === "partial" ? "badge unverified" : "badge verified";
      html += "<tr><td><b>" + esc(r.requirement) + "</b></td>" +
        '<td><span class="' + cls + '">' + icon + " " + esc(r.status) + "</span></td>" +
        "<td>" + esc(r.module) + "</td><td>" + esc(r.note) + "</td></tr>";
    });
    html += "</tbody></table></div>";
    html += '<div class="chips" style="margin-top:10px"><a href="#" class="chip-link" data-view="companies">🏢 Employers hiring these skills →</a></div>';
    html += "</div>";
    $view.innerHTML = html;
  }

  function viewCrossCheck() {
    const cc = D.crossCheck;
    let html = '<div class="appendix"><h1>🔗 Community Cross-Check</h1>';
    html += '<p class="sec-desc">Our path vs the community-maintained <b>roadmap.sh</b> — verified against its live inventories.</p>';
    if (cc.stats) {
      html += '<div class="chips">';
      Object.entries(cc.stats).forEach(([k, v]) => {
        if (k === "inventoryCounts") return;
        html += '<span class="chip">' + esc(k.replace(/([A-Z])/g, " $1")) + ": <b>" + esc(v) + "</b></span>";
      });
      html += "</div>";
    }
    html += "<h2>Coverage matrix</h2>";
    html += '<div class="table-wrap"><table><thead><tr><th>Area</th><th>Our stance</th><th>roadmap.sh</th></tr></thead><tbody>';
    (cc.rows || []).forEach((r) => {
      html += "<tr><td><b>" + esc(r.area) + "</b></td><td>" + esc(r.weHave) + "</td><td>" + esc(r.roadmapHas) + "</td></tr>";
    });
    html += "</tbody></table></div>";
    if (cc.urls && cc.urls.length) {
      html += "<h2>Trackers</h2><ul class='facts-list'>";
      cc.urls.forEach((u) => { html += '<li><a href="' + esc(u) + '" target="_blank" rel="noopener">' + esc(u) + "</a></li>"; });
      html += "</ul>";
    }
    html += "</div>";
    $view.innerHTML = html;
  }

  function viewSources() {
    const seen = new Set();
    const list = [];
    allModules().forEach((m) => (m.subTopics || []).forEach((st) => (st.items || []).forEach((i) => {
      (i.resources || []).forEach((r) => {
        if (!seen.has(r.url)) { seen.add(r.url); list.push(r); }
      });
    })));
    list.sort((a, b) => a.name.localeCompare(b.name));
    let html = '<div class="appendix"><h1>📚 Sources (' + list.length + " unique)</h1>";
    html += '<p class="sec-desc">Every resource referenced across all modules.</p>';
    html += '<div class="sources-list">';
    list.forEach((r) => {
      html += '<div class="src-item"><a href="' + esc(r.url) + '" target="_blank" rel="noopener">' + esc(r.name) + "</a></div>";
    });
    html += "</div></div>";
    $view.innerHTML = html;
  }

  function viewCompanies() {
    const cd = D.companies;
    if (!cd) {
      $view.innerHTML = '<div class="empty-state">Companies data missing — regenerate from the JSON</div>';
      return;
    }
    let html = '<div class="appendix"><h1>🏢 Companies to Apply</h1>';
    html += '<p class="sec-desc">Researched employers for Platform / DevOps / SRE roles — Pune, India-wide and remote-first. Openings change fast: always open the careers link and filter by role keyword.</p>';
    html += '<div class="chips">' +
      '<a href="#" class="chip-link" data-view="companyqs">🎯 Drill their questions →</a>' +
      '<a href="#" class="chip-link" data-view="tracker">🗂 Track applications →</a>' +
      "</div>";

    // jump nav for the long catalog
    html += '<div class="jump-nav">';
    (cd.categories || []).forEach((cat) => {
      html += '<a href="#" class="mod-chip" data-anchor="co-cat-' + esc(cat.id) + '">' + esc(cat.name.replace(/\(.*\)/, "").trim()) + "</a>";
    });
    if (cd.applyChannels && cd.applyChannels.length) html += '<a href="#" class="mod-chip" data-anchor="co-channels">📡 Channels</a>';
    if (cd.playbook && cd.playbook.length) html += '<a href="#" class="mod-chip" data-anchor="co-playbook">🗺 Playbook</a>';
    html += "</div>";

    // tier legend
    html += '<div class="tier-legend">';
    Object.entries(cd.tiers || {}).forEach(([k, v]) => {
      html += '<div class="tier-chip ' + esc(k) + '"><b>' + esc(k.replace("-", " ").toUpperCase()) + "</b> — " + esc(v) + "</div>";
    });
    html += "</div>";

    (cd.categories || []).forEach((cat) => {
      html += '<section class="company-cat" id="co-cat-' + esc(cat.id) + '">';
      html += '<div class="phase-head"><h2>' + esc(cat.name) + "</h2>" +
        '<span class="ph-badge">' + esc((cat.companies || []).length) + " companies</span></div>";
      if (cat.strategy) html += '<div class="phase-goal">' + esc(cat.strategy) + "</div>";
      html += '<div class="company-grid">';
      (cat.companies || []).forEach((co) => {
        html += '<div class="company-card">' +
          '<div class="co-head">' +
          '<div class="co-name">' + esc(co.name) + "</div>" +
          (co.location ? '<div class="co-loc">📍 ' + esc(co.location) + "</div>" : "") +
          "</div>" +
          (co.roles && co.roles.length
            ? '<div class="co-roles">' + co.roles.map((r) => '<span class="role-tag">' + esc(r) + "</span>").join("") + "</div>" : "") +
          (co.stack ? '<div class="co-stack">🛠 ' + esc(co.stack) + "</div>" : "") +
          (co.modules && co.modules.length
            ? '<div class="co-modules">📚 Prep: ' + co.modules.map((m) => {
                const mm = moduleById(m);
                return '<a href="#" class="mod-chip" data-view="module:' + esc(m) + '" title="' + esc(mm ? mm.title : m) + '">' + esc(m) + "</a>";
              }).join(" ") + "</div>" : "") +
          (co.note ? '<div class="co-note">💡 ' + esc(co.note) + "</div>" : "") +
          '<a class="co-apply" href="' + esc(co.careers) + '" target="_blank" rel="noopener">Apply → ' + esc(co.careers.replace(/^https?:\/\//, "").replace(/\/$/, "")) + "</a>" +
          "</div>";
      });
      html += "</div></section>";
    });

    // apply channels
    if (cd.applyChannels && cd.applyChannels.length) {
      html += '<h2 id="co-channels">📡 Where to apply — channels</h2>';
      html += '<div class="channels-grid">';
      cd.applyChannels.forEach((ch) => {
        html += '<div class="channel-card"><b>' + esc(ch.channel) + "</b><span>" + esc(ch.detail) + "</span></div>";
      });
      html += "</div>";
    }

    // playbook
    if (cd.playbook && cd.playbook.length) {
      html += '<h2 id="co-playbook">🗺 4-week application playbook</h2>';
      html += '<ol class="playbook-list">';
      cd.playbook.forEach((p) => { html += "<li>" + esc(p) + "</li>"; });
      html += "</ol>";
    }

    html += '<p class="sec-desc" style="margin-top:26px;font-size:12px">Source: ' + esc(cd.source) + "</p>";
    html += "</div>";
    $view.innerHTML = html;
  }

  /* ---------------- company question sets ---------------- */
  function viewCompanyQs() {
    const cq = D.companyQs;
    if (!cq) { $view.innerHTML = '<div class="empty-state">Company Q-Sets missing — regenerate from the JSON</div>'; return; }
    let html = '<div class="appendix"><h1>🎯 Company Question Sets</h1>';
    html += '<p class="sec-desc">Most-asked questions per hiring tier, each linked to where the full answer lives in your answer banks. Drill these BEFORE applying — not during.</p>';
    html += '<div class="chips">' +
      '<a href="#" class="chip-link" data-view="companies">🏢 See all 32 employers →</a>' +
      '<a href="#" class="chip-link" data-view="sysdesign">🧠 Practice System Design →</a>' +
      "</div>";
    html += '<ol class="playbook-list">' + (cq.howToUse || []).map((h) => "<li>" + esc(h) + "</li>").join("") + "</ol>";
    (cq.tiers || []).forEach((t) => {
      html += '<section class="company-cat"><div class="phase-head"><h2>' + esc(t.name) + "</h2>" +
        '<span class="ph-badge">' + (t.questions || []).length + " must-know</span></div>";
      html += '<div class="phase-goal">' + esc(t.pattern) + "</div>";
      html += '<div class="table-wrap"><table><thead><tr><th>#</th><th>Question</th><th>Where the answer lives</th></tr></thead><tbody>';
      (t.questions || []).forEach((q, i) => {
        html += "<tr><td>" + (i + 1) + '</td><td><b>' + esc(q.q) + "</b></td><td style='color:var(--text-dim);font-size:12px'>" + moduleCodesHTML(q.where) + "</td></tr>";
      });
      html += "</tbody></table></div></section>";
    });
    html += '<p class="sec-desc" style="margin-top:26px;font-size:12px">Source: ' + esc(cq.source) + "</p>";
    html += "</div>";
    $view.innerHTML = html;
  }

  /* ---------------- certifications ---------------- */
  function viewCerts() {
    const cd = D.certs;
    if (!cd) { $view.innerHTML = '<div class="empty-state">Certifications data missing — regenerate from the JSON</div>'; return; }
    let html = '<div class="appendix"><h1>🎓 Certification Timeline</h1>';
    html += "<p class=\"sec-desc\">Why each cert, when to take it in your path, what the exam is like, how to prep — and what it's worth. Prices checked 2026-08-17; verify before booking.</p>";
    html += '<div class="phase-goal">' + esc(cd.strategy) + "</div>";

    // timeline
    html += "<h2>🗓 When to take each cert</h2>";
    (cd.timeline || []).forEach((ph) => {
      html += '<div class="cert-phase"><div class="phase-head"><h3>📌 ' + esc(ph.phase) + "</h3></div>" +
        '<div class="phase-goal">' + esc(ph.recommendation) + "</div>";
      if (ph.certs && ph.certs.length) {
        html += '<div class="co-modules">' + ph.certs.map((c) => {
          const cc = (cd.certs || []).find((x) => x.id === c);
          return '<a href="#" class="mod-chip" data-anchor="cert-' + esc(c) + '">' + esc(cc ? cc.name : c) + "</a>";
        }).join(" ") + "</div>";
      }
      html += "</div>";
    });

    // cert cards
    html += "<h2>📇 The certs, explained</h2>";
    (cd.certs || []).forEach((c) => {
      html += '<div class="cert-card" id="cert-' + esc(c.id) + '">';
      html += '<div class="cert-head"><div class="co-name">' + esc(c.name) + "</div>" +
        '<div class="cert-meta">' + esc(c.org) + " · <b>" + esc(c.cost) + "</b></div></div>";
      html += '<div class="cert-facts"><span class="role-tag">🕐 ' + esc(c.exam) + "</span>" +
        '<span class="role-tag">📅 Validity: ' + esc(c.validity) + "</span></div>";
      if (c.module) {
        const mm = moduleById(c.module);
        html += '<div class="co-modules">📚 Study path: <a href="#" class="mod-chip" data-view="module:' + esc(c.module) + '" title="' + esc(mm ? mm.title : c.module) + '">' + esc(c.module) + (mm ? " · " + esc(shortTitle(mm.title)) : "") + "</a></div>";
      }
      html += '<div class="cert-why"><b>Why — </b>' + esc(c.why) + "</div>";
      html += '<div class="cert-why"><b>When — </b>' + esc(c.when) + "</div>";
      html += '<div class="rb-label" style="margin-top:10px">How to prep</div><ol class="playbook-list">' +
        (c.how || []).map((h) => "<li>" + esc(h) + "</li>").join("") + "</ol>";
      if (c.links && c.links.length) {
        html += '<div class="cert-links">' + c.links.map((l) =>
          '<a class="mod-chip link" href="' + esc(l.url) + '" target="_blank" rel="noopener">🔗 ' + esc(l.name) + "</a>"
        ).join(" ") + "</div>";
      }
      html += "</div>";
    });

    html += "<h2>📈 ROI order</h2>";
    html += '<ul class="facts-list">' + (cd.roi || []).map((r) => "<li>" + esc(r) + "</li>").join("") + "</ul>";
    html += '<p class="sec-desc" style="margin-top:26px;font-size:12px">Source: ' + esc(cd.source) + "</p>";
    html += "</div>";
    $view.innerHTML = html;
  }

  /* ---------------- system design ---------------- */
  function viewSysDesign() {
    const sd = D.systemDesign;
    if (!sd) { $view.innerHTML = '<div class="empty-state">System Design data missing — regenerate from the JSON</div>'; return; }
    let html = '<div class="appendix"><h1>🧠 System Design for DevOps</h1>';
    html += '<p class="sec-desc">The interview round where you architect infrastructure, not app code. Practice the framework, then drill the 8 scenarios below out loud.</p>';
    html += '<div class="phase-goal">' + esc(sd.what) + "</div>";

    // framework
    html += "<h2>🏗 The 6-step answer framework</h2>";
    html += '<div class="table-wrap"><table><thead><tr><th>Step</th><th>What to say</th></tr></thead><tbody>';
    (sd.framework.steps || []).forEach((s) => {
      html += "<tr><td><b>" + esc(s.step) + "</b></td><td>" + esc(s.detail) + "</td></tr>";
    });
    html += "</tbody></table></div>";

    // problems
    html += "<h2>📝 Practice scenarios (" + (sd.problems || []).length + ")</h2>";
    (sd.problems || []).forEach((p) => {
      html += '<details class="research-block sd-problem">';
      html += "<summary><span class='caret'>▶</span> " + esc(p.id) + " — " + esc(p.title) + "</summary>";
      if (p.modules && p.modules.length) {
        html += '<div class="co-modules">📚 Uses: ' + p.modules.map((m) => {
          const mm = moduleById(m);
          return '<a href="#" class="mod-chip" data-view="module:' + esc(m) + '">' + esc(m) + (mm ? " · " + esc(shortTitle(mm.title)) : "") + "</a>";
        }).join(" ") + "</div>";
      }
      html += '<div class="rb-label">Walkthrough</div><ol class="playbook-list">' +
        (p.walkthrough || []).map((w) => "<li>" + esc(w) + "</li>").join("") + "</ol>";
      if (p.talk_track) html += '<div class="cert-why"><b>🎙 Talk track — </b>' + esc(p.talk_track) + "</div>";
      html += "</details>";
    });

    html += '<p class="sec-desc" style="margin-top:26px;font-size:12px">Source: ' + esc(sd.source) + "</p>";
    html += "</div>";
    $view.innerHTML = html;
  }

  /* ---------------- resume kit ---------------- */
  function viewResume() {
    const rd = D.resumeTemplate;
    if (!rd) { $view.innerHTML = '<div class="empty-state">Resume data missing — regenerate from the JSON</div>'; return; }
    let html = '<div class="appendix"><h1>📄 Resume Kit — Platform/DevOps tuned</h1>';
    html += '<p class="sec-desc">ATS-first template with fill-in blanks, metric formulas, and per-job-type keyword centers. Build 3 master resumes from this.</p>';

    html += "<h2>⚠️ ATS rules (non-negotiable)</h2>";
    html += '<ul class="facts-list">' + (rd.ats || []).map((a) => "<li>" + esc(a) + "</li>").join("") + "</ul>";

    html += "<h2>🧩 Section-by-section template</h2>";
    const t = rd.template || {};
    const sec = (title, obj) => {
      if (!obj) return "";
      let h = '<details class="research-block" open><summary><span class="caret">▶</span> ' + title + "</summary>";
      if (obj.note) h += '<div class="phase-goal">' + esc(obj.note) + "</div>";
      if (obj.lines) h += '<div class="resume-lines">' + obj.lines.map((l) => '<div class="resume-line">' + esc(l) + "</div>").join("") + "</div>";
      if (obj.example) h += '<div class="cert-why"><b>Example — </b>' + esc(obj.example) + "</div>";
      if (obj.groups) h += '<ul class="facts-list">' + obj.groups.map((g) => "<li>" + esc(g) + "</li>").join("") + "</ul>";
      if (obj.examples) {
        obj.examples.forEach((ex) => {
          h += '<div class="cert-card" style="margin-top:10px"><div class="co-name">' + esc(ex.name) + "</div>" +
            '<ul class="facts-list">' + (ex.bullets || []).map((b) => "<li>" + esc(b) + "</li>").join("") + "</ul></div>";
        });
      }
      if (obj.bullet_verbs) h += '<div class="cert-why"><b>Verbs — </b>' + esc(obj.bullet_verbs.join(", ")) + "</div>";
      if (obj.metric_examples) h += '<div class="cert-why"><b>Metrics that land — </b>' + esc(obj.metric_examples.join(" | ")) + "</div>";
      if (obj.if_no_job_history) h += '<div class="phase-goal" style="margin-top:8px">💡 ' + esc(obj.if_no_job_history) + "</div>";
      h += "</details>";
      return h;
    };
    html += sec("Header", t.header) + sec("Summary", t.summary) + sec("Skills", t.skills) +
      sec("Projects (your A06 capstone + B05 GitOps)", t.projects) + sec("Experience", t.experience) +
      sec("Education & Certifications", t.education_certs);

    html += "<h2>🎯 Keyword centers per job type</h2>";
    if (rd.jds && rd.jds.centers) {
      Object.entries(rd.jds.centers).forEach(([k, v]) => {
        html += '<div class="cert-card" style="margin-top:10px"><div class="co-name">' + esc(k) + "</div>" +
          '<div class="co-stack">' + esc(v.join(" · ")) + "</div></div>";
      });
    }

    html += "<h2>✅ Pre-send checklist</h2>";
    html += '<ul class="facts-list">' + (rd.checklist || []).map((c) => "<li>" + esc(c) + "</li>").join("") + "</ul>";
    html += '<div class="chips" style="margin-top:10px"><a href="#" class="chip-link" data-view="labs">🧪 No projects yet? Build them first →</a></div>';
    html += '<p class="sec-desc" style="margin-top:26px;font-size:12px">Source: ' + esc(rd.source) + "</p>";
    html += "</div>";
    $view.innerHTML = html;
  }

  /* ---------------- lab checklists ---------------- */
  function viewLabs() {
    const ld = D.labs;
    if (!ld) { $view.innerHTML = '<div class="empty-state">Labs data missing — regenerate from the JSON</div>'; return; }
    const done = getLabDone();
    let total = 0, checked = 0;
    ld.modules.forEach((m) => (m.items || []).forEach((it, i) => {
      total++;
      if (done[labKey(m.id, i)]) checked++;
    }));
    const pct = total ? Math.round((checked / total) * 100) : 0;
    let html = '<div class="appendix"><h1>🧪 Hands-on Lab Checklists</h1>';
    html += "<p class=\"sec-desc\">Do the action for real → confirm the 'verify' line → tick it. 'Seen it in a video' doesn't count. Progress saves in your browser.</p>";
    html += '<div class="chips"><span class="chip">✅ <b>' + checked + "/" + total + "</b> labs done</span>" +
      '<span class="chip">📊 <b>' + pct + "%</b> complete</span></div>";
    html += '<ol class="playbook-list">' + (ld.howToUse || []).map((h) => "<li>" + esc(h) + "</li>").join("") + "</ol>";
    // Open only modules with partial progress; if nothing is started, open just the first.
    let anyInProgress = false;
    ld.modules.forEach((m) => {
      const mTotal = (m.items || []).length;
      const mDone = (m.items || []).filter((it, i) => done[labKey(m.id, i)]).length;
      if (mDone > 0 && mDone < mTotal) anyInProgress = true;
    });
    (ld.modules || []).forEach((m, mi) => {
      const mTotal = (m.items || []).length;
      const mDone = (m.items || []).filter((it, i) => done[labKey(m.id, i)]).length;
      const mm = moduleById(m.id);
      const inProgress = mDone > 0 && mDone < mTotal;
      const open = inProgress || (!anyInProgress && mi === 0 && mDone === 0);
      html += '<details class="research-block lab-module"' + (open ? " open" : "") + ">";
      html += "<summary><span class='caret'>▶</span> " + esc(m.id) + " — " + esc(m.title) +
        ' <span class="lab-prog">' + mDone + "/" + mTotal + (mDone === mTotal && mTotal > 0 ? " 🎉" : "") + "</span></summary>";
      html += '<div class="lab-list">';
      (m.items || []).forEach((it, i) => {
        const id = labKey(m.id, i);
        const chk = done[id] ? "checked" : "";
        html += '<label class="lab-item"><input type="checkbox" data-lab="' + esc(id) + '" ' + chk + "> " +
          '<span><b>Do:</b> ' + esc(it.do) + '<br><span class="lab-verify">✔ Verify: ' + esc(it.verify) + "</span></span></label>";
      });
      html += "</div></details>";
    });
    html += "</div>";
    $view.innerHTML = html;
  }

  /* ---------------- application tracker view ---------------- */
  function viewTracker() {
    const list = getApps();
    const st = appStats(list);
    let html = '<div class="appendix"><h1>🗂 Application Tracker</h1>';
    html += '<p class="sec-desc">Track every application. Data lives in YOUR browser (localStorage) — nothing is uploaded anywhere. Export to CSV/JSON to back up or open in Excel.</p>';
    html += '<div class="chips">' +
      '<span class="chip">📋 <b>' + st.total + "</b> total</span>" +
      '<span class="chip">🚀 <b>' + st.pipeline + "</b> in pipeline</span>" +
      '<span class="chip">🎉 <b>' + st.offers + "</b> offers</span>" +
      '<span class="chip">❌ <b>' + st["❌ Rejected"] + "</b> rejected</span>" +
      "</div>";

    // add form
    html += '<details class="research-block" open><summary><span class="caret">▶</span> ➕ Add application</summary><div class="rb-body">';
    html += '<div class="tracker-form">';
    html += '<input id="tr-company" placeholder="Company (e.g. Razorpay)" autocomplete="off">';
    html += '<input id="tr-role" placeholder="Role (e.g. Platform Engineer)" autocomplete="off">';
    html += '<input id="tr-date" type="date" value="' + new Date().toISOString().slice(0, 10) + '">';
    html += '<select id="tr-stage">' + TRACKER_STAGES.map((s) => '<option>' + esc(s) + "</option>").join("") + "</select>";
    html += '<input id="tr-link" placeholder="Job link (optional)" autocomplete="off">';
    html += '<input id="tr-notes" placeholder="Notes (recruiter name, date, follow-up…)" autocomplete="off">';
    html += '<button id="tr-add" class="co-apply" style="text-align:center">➕ Save application</button>';
    html += "</div></div></details>";

    // export buttons
    html += '<div class="tracker-export"><button id="tr-export-csv" class="ghost-btn">⬇ Export CSV</button> ' +
      '<button id="tr-export-json" class="ghost-btn">⬇ Export JSON</button> ' +
      '<button id="tr-clear" class="ghost-btn">🗑 Clear all</button></div>';

    if (!list.length) {
      html += '<div class="empty-state" style="margin-top:20px">No applications yet — add your first one above. Tip: open the 🏢 Companies view, pick a company, and paste its careers link here.</div>';
    } else {
      html += "<h2>📋 Applications</h2>";
      list.forEach((a, i) => {
        const status = a.stage === "❌ Rejected" ? "unverified" : "verified";
        html += '<div class="tracker-row"><div class="tracker-main">' +
          '<b>' + esc(a.company) + "</b>" +
          (a.role ? ' <span class="co-loc">' + esc(a.role) + "</span>" : "") +
          '<span class="badge ' + status + '">' + esc(a.stage) + "</span></div>" +
          '<div class="tracker-sub">' + (a.date ? "🗓 " + esc(a.date) : "") +
          (a.link ? ' · <a href="' + esc(a.link) + '" target="_blank" rel="noopener">link</a>' : "") +
          (a.notes ? " · " + esc(a.notes) : "") + "</div>" +
          '<div class="tracker-actions">' +
          '<select data-tr-stage="' + i + '">' + TRACKER_STAGES.map((s) => '<option' + (s === a.stage ? " selected" : "") + ">" + esc(s) + "</option>").join("") + "</select> " +
          '<button class="ghost-btn" data-tr-del="' + i + '">🗑</button></div></div>';
      });
    }
    html += "</div>";
    $view.innerHTML = html;
  }

  /* ---------------- global search view ---------------- */
  const searchState = { q: "", scope: "all", results: 0 };
  function searchableDocs() {
    const docs = [];
    allModules().forEach((m) => {
      docs.push({ type: "module", mid: m.id, icon: m.icon, title: m.id + " " + m.title,
        text: [m.title, m.goal, m.mentalModel, m.exitTest].join(" ") });
      (m.subTopics || []).forEach((st) => (st.items || []).forEach((i) => {
        docs.push({ type: "item", mid: m.id, icon: m.icon, title: i.title,
          text: (i.title + " " + (i.detail || "")).trim() });
      }));
    });
    const A = window.ANSWERS_DATA || {};
    Object.keys(A).forEach((mid) => (A[mid] || []).forEach((x, idx) => {
      const mm = moduleById(mid);
      docs.push({ type: "q", mid, idx, icon: mm ? mm.icon : "❓", title: x.q,
        text: (x.q + " " + (x.a || "") + " " + (x.r || "") + " " + (x.w || "")).trim() });
    }));
    const sd = D.starBank;
    (sd && sd.categories || []).forEach((c) => {
      (c.questions || []).forEach((q) => {
        docs.push({ type: "star", mid: c.id, icon: c.icon, title: q, text: q });
      });
    });
    return docs;
  }
  function runSearch(q, scope) {
    if (!q) return [];
    const ql = q.toLowerCase();
    const doc = searchableDocs();
    const out = [];
    doc.forEach((d) => {
      if (scope === "q" && d.type !== "q") return;
      if (scope === "mod" && d.type !== "module" && d.type !== "item") return;
      const ti = d.title.toLowerCase().indexOf(ql);
      if (ti >= 0) { out.push(Object.assign({}, d, { hit: d.title, pos: ti })); return; }
      const tx = d.text.toLowerCase().indexOf(ql);
      if (tx >= 0) out.push(Object.assign({}, d, { hit: d.text, pos: tx }));
    });
    return out.slice(0, 120);
  }
  function viewSearch() {
    let html = '<div class="appendix"><h1>🔍 Search</h1>';
    html += '<p class="sec-desc">Search every question, model answer, module topic and STAR prompt. Press <b>/</b> anywhere to jump here.</p>';
    html += '<div class="toolbar">' +
      '<input type="search" id="sr-input" placeholder="Search 426 answers + 15 modules…" value="' + esc(searchState.q) + '" autofocus>' +
      '<select id="sr-scope">' +
      '<option value="all"' + (searchState.scope === "all" ? " selected" : "") + ">Everything</option>" +
      '<option value="q"' + (searchState.scope === "q" ? " selected" : "") + ">Questions & answers</option>" +
      '<option value="mod"' + (searchState.scope === "mod" ? " selected" : "") + ">Modules & topics</option>" +
      "</select>" +
      '<span class="counts" id="sr-count">' + (searchState.q ? searchState.results + " hit" + (searchState.results === 1 ? "" : "s") : "") + "</span></div>";
    if (!searchState.q) {
      html += '<div class="empty-state">Type to search — try <b>“etcd”</b>, <b>“rollback”</b>, <b>“thundering herd”</b>.</div>';
      html += "</div>";
      $view.innerHTML = html;
      const inp = document.getElementById("sr-input");
      if (inp && document.activeElement !== inp) inp.focus();
      return;
    }
    const res = runSearch(searchState.q, searchState.scope);
    if (!res.length) {
      html += '<div class="empty-state">No matches for “' + esc(searchState.q) + '”. Try a shorter term.</div></div>';
      $view.innerHTML = html; return;
    }
    html += '<div class="sr-list">';
    res.forEach((r) => {
      const m = r.mid && (r.type === "q" || r.type === "item" || r.type === "module") ? moduleById(r.mid) : null;
      const v = r.type === "q" ? "module:" + r.mid : r.type === "module" ? "module:" + r.mid
        : r.type === "item" ? "module:" + r.mid : r.type === "star" ? "star" : "overview";
      const head = (m ? m.icon + " " + r.mid : (r.type === "star" ? "🗣 STAR" : "")) + (r.type === "q" ? " · Q" + (r.idx + 1) : "");
      html += '<div class="sr-item"><a href="#" data-view="' + esc(v) + '">' +
        '<div class="sr-head">' + esc(head) + " · " + esc(r.type === "item" ? r.mid + " " + (m ? m.title : "") : r.title.length > 70 ? r.title.slice(0, 70) + "…" : r.title) + "</div>" +
        '<div class="sr-snip">' + esc(r.hit.slice(Math.max(0, r.pos - 50), r.pos + 110)) + "</div>" +
        "</a></div>";
    });
    html += "</div></div>";
    $view.innerHTML = html;
  }

  /* ---------------- cheat sheets view ---------------- */
  const cheatsState = { mid: "A01" };
  function viewCheats() {
    const m = moduleById(cheatsState.mid) || allModules()[0];
    if (!m) { $view.innerHTML = '<div class="empty-state">No modules.</div>'; return; }
    let html = '<div class="appendix"><h1>📄 Cheat Sheets</h1>';
    html += '<p class="sec-desc">One-page must-know recap per module. Print it, fold it, drill it on the train.</p>';
    html += '<div class="toolbar">' +
      '<select id="ch-module">' +
      allModules().map((x) => '<option value="' + esc(x.id) + '"' + (x.id === m.id ? " selected" : "") + ">" + esc(x.id + " " + shortTitle(x.title)) + "</option>").join("") +
      "</select>" +
      '<button class="toggle-btn" id="ch-print">🖨 Print this sheet</button>' +
      '<span class="counts">' + esc(m.id) + " · " + (m.subTopics || []).reduce((a, s) => a + (s.items || []).length, 0) + " must-know points</span></div>";
    html += '<div class="cheatsheet" id="cheatsheet">';
    html += '<div class="cs-head"><div class="cs-icon">' + esc(m.icon || "📘") + "</div>" +
      '<div class="cs-title"><span class="cs-id">' + esc(m.id) + "</span> " + esc(m.title) + "</div></div>";
    if (m.mentalModel) html += '<div class="cs-block"><div class="rb-label">🧠 Mental model</div><p>' + esc(m.mentalModel) + "</p></div>";
    if (m.goal) html += '<div class="cs-block"><div class="rb-label">🎯 Goal</div><p>' + esc(m.goal) + "</p></div>";
    if (m.dependsOn && m.dependsOn.length) html += '<div class="cs-block"><div class="rb-label">🧱 Builds on</div><p>' + m.dependsOn.map((c) => '<span class="mod-chip">' + esc(c) + "</span>").join(" ") + "</p></div>";
    html += '<div class="cs-block"><div class="rb-label">📋 Must know</div>';
    (m.subTopics || []).forEach((st) => {
      html += '<div class="cs-sub"><div class="cs-sub-name">' + esc(st.name) + "</div><ul class='cs-items'>";
      (st.items || []).forEach((i) => {
        html += "<li><b>" + esc(i.title) + "</b>" + (i.detail ? " <span class='cs-detail'>— " + esc(i.detail) + "</span>" : "") + "</li>";
      });
      html += "</ul></div>";
    });
    html += "</div>";
    const focus = (m.research && m.research.interviewFocus) || [];
    if (focus.length) {
      html += '<div class="cs-block"><div class="rb-label">🎤 Practice questions</div><ol class="cs-focus">';
      focus.forEach((f) => { html += "<li>" + esc(f) + "</li>"; });
      html += "</ol></div>";
    }
    if (m.exitTest) html += '<div class="cs-block"><div class="rb-label">✅ Exit test</div><p>' + esc(m.exitTest) + "</p></div>";
    html += '<div class="cs-foot">Platform Engineering — ' + esc(m.id + " " + m.title) + " · codetreatise.github.io/DevOps</div>";
    html += "</div></div>";
    $view.innerHTML = html;
  }

  /* ---------------- practice mode view ---------------- */
  function viewPractice() {
    const A = window.ANSWERS_DATA;
    if (!A) { $view.innerHTML = '<div class="empty-state">answers.js missing — regenerate with python3 scripts/export_answers_js.py</div>'; return; }
    if (!practiceState.order.length) practiceState.order = buildPracticeOrder(practiceState.mid, practiceState.dueOnly);
    const order = practiceState.order;
    const q = order[practiceState.pos];
    const p = getPractice();
    let html = '<div class="appendix"><h1>🎴 Practice Mode</h1>';
    html += '<p class="sec-desc">Active recall beats re-reading: answer OUT LOUD before revealing, then rate yourself. Ratings feed the 📈 Mastery view and space out reviews.</p>';

    html += '<div class="toolbar">' +
      '<select id="pr-module">' +
      '<option value="all">All modules</option>' +
      allModules().map((m) => '<option value="' + esc(m.id) + '"' + (practiceState.mid === m.id ? " selected" : "") + ">" + esc(m.id + " " + shortTitle(m.title)) + "</option>").join("") +
      "</select>" +
      (practiceState.dueOnly
        ? '<span class="chip">🔁 Due now</span>'
        : '<button class="toggle-btn" id="pr-shuffle">🔀 Shuffle</button>') +
      '<span class="counts">' + (order.length ? practiceState.pos + 1 : 0) + " / " + order.length + (practiceState.dueOnly ? " due" : "") + "</span></div>";

    if (!order.length) {
      html += '<div class="empty-state" style="margin:24px 0">' +
        (practiceState.dueOnly ? "Nothing due right now 🎉 — practice everything or come back later." : "No questions here.") + "</div>";
      if (practiceState.dueOnly) html += '<button class="co-apply" id="pr-all">🎴 Practice all questions</button>';
      html += "</div>";
      $view.innerHTML = html;
      return;
    }

    const rec = p[qid(q.mid, q.idx)];
    const dueTxt = rec
      ? (rec.d <= Date.now() ? " · 🔁 due now" : " · next review " + Math.ceil((rec.d - Date.now()) / 86400000) + "d")
      : " · new";
    html += '<div class="practice-card">';
    html += '<div class="practice-top">' +
      '<span class="mod-chip" data-view="module:' + esc(q.mid) + '">' + esc(q.mid) + "</span>" +
      '<span class="practice-sub">' + esc(q.title) + "</span>" +
      '<span class="practice-due" style="color:' + (rec ? rateColor(rec.r) : "var(--text-dim)") + '">' +
      (rec ? RATE_NAMES[rec.r] + dueTxt : "Unrated") + "</span></div>";
    html += '<div class="practice-q">' + esc(q.q) + "</div>";

    if (practiceState.revealed) {
      html += '<div class="practice-ans"><div class="rb-label">Model answer</div><p>' + esc(q.a) + "</p>" +
        (q.r ? '<div class="rb-label">Rubric</div><p>' + esc(q.r) + "</p>" : "") +
        (q.w ? '<div class="rb-label">Why asked</div><p>' + esc(q.w) + "</p>" : "") + "</div>";
      html += '<div class="practice-rate"><span class="rate-label">Rate yourself:</span>' +
        RATE_NAMES.map((n, i) => '<button class="rate-btn" data-rate="' + i + '" data-mid="' + esc(q.mid) + '" data-idx="' + q.idx + '">' + n + "</button>").join("") + "</div>";
    } else {
      html += '<div class="practice-act"><button class="co-apply" id="pr-reveal">👁 Show answer</button> ' +
        '<button class="toggle-btn" id="pr-speak">🔊 Read question</button></div>';
    }
    html += '<div class="practice-nav">' +
      '<button class="ghost-btn" id="pr-prev"' + (practiceState.pos === 0 ? " disabled" : "") + ">← Prev</button> " +
      '<button class="ghost-btn" id="pr-next"' + (practiceState.pos >= order.length - 1 ? " disabled" : "") + ">Next →</button></div>";
    html += "</div></div>";
    $view.innerHTML = html;
  }

  /* ---------------- mastery view ---------------- */
  function viewMastery() {
    const A = window.ANSWERS_DATA;
    if (!A) { $view.innerHTML = '<div class="empty-state">answers.js missing</div>'; return; }
    const p = getPractice();
    let totalA = 0, totalQ = 0, totalScore = 0;
    const rows = allModules().map((m) => {
      const mm = masteryFor(m.id, p);
      totalA += mm.answered; totalQ += mm.total; totalScore += Math.round(mm.avg * mm.answered);
      return { m: m, mm: mm };
    }).filter((r) => r.mm.total > 0).sort((a, b) => a.mm.pct - b.mm.pct);

    const overall = totalQ ? Math.round((totalScore / (totalQ * 2)) * 100) : 0;
    let html = '<div class="appendix"><h1>📈 Mastery</h1>';
    html += '<p class="sec-desc">Built from your 🎴 Practice Mode self-ratings (👍 knew = 2 · 🤏 partial = 1 · 🧠 forgot = 0). Weakest modules float to the top.</p>';
    html += '<div class="chips">' +
      '<span class="chip">🎴 <b>' + totalA + "/" + totalQ + "</b> rated</span>" +
      '<span class="chip">📈 <b>' + overall + "%</b> overall</span>" +
      '<button class="ghost-btn" id="pr-clear">↺ Reset ratings</button></div>';

    html += "<h2>🔻 Weakest modules — practice these first</h2>";
    if (!rows.length) html += '<div class="empty-state">No ratings yet — start with 🎴 Practice Mode.</div>';
    rows.forEach((r) => {
      const pct = r.mm.pct;
      html += '<div class="mastery-row"><div class="mastery-name">' +
        '<a href="#" data-view="module:' + esc(r.m.id) + '" class="mod-chip">' + esc(r.m.id) + "</a> " + esc(shortTitle(r.m.title)) + "</div>" +
        '<div class="mastery-bar"><div class="mastery-fill" style="width:' + pct + '%;background:' + (pct < 40 ? "var(--accent)" : pct < 70 ? "var(--cyan)" : "var(--green)") + '"></div></div>' +
        '<div class="mastery-pct">' + pct + "%</div>" +
        '<div class="mastery-sub">' + r.mm.answered + "/" + r.mm.total + " rated</div></div>";
    });

    const now = Date.now();
    const due = allQuestions().filter((x) => { const rec = p[qid(x.mid, x.idx)]; return rec && rec.d <= now; });
    html += "<h2>🔁 Due for review</h2>";
    if (!due.length) html += '<div class="empty-state">Nothing due — ratings are fresh. 🎉</div>';
    else {
      html += '<p class="sec-desc"><b>' + due.length + "</b> questions due. <button class='co-apply' id='pr-due'>🎴 Practice due now</button></p>";
      due.slice(0, 10).forEach((x) => {
        const rec = p[qid(x.mid, x.idx)];
        html += '<div class="due-row"><span class="mod-chip" data-view="module:' + esc(x.mid) + '">' + esc(x.mid) + "</span> " + esc(x.q.slice(0, 90)) + "… <span style='color:" + rateColor(rec.r) + "'>" + RATE_NAMES[rec.r] + "</span></div>";
      });
      if (due.length > 10) html += '<p class="sec-desc">…and ' + (due.length - 10) + " more.</p>";
    }
    html += "</div>";
    $view.innerHTML = html;
  }

  /* ---------------- STAR story bank view ---------------- */
  function viewStar() {
    const sd = D.starBank;
    if (!sd) { $view.innerHTML = '<div class="empty-state">starBank missing — run node scripts/sync_extras.js</div>'; return; }
    let html = '<div class="appendix"><h1>🗣 STAR Story Bank</h1>';
    html += '<p class="sec-desc">Behavioral rounds decide offers. Write 5-10 real S/T/A/R stories from these prompts and practise them aloud in 90 seconds.</p>';
    html += '<details class="research-block" open><summary><span class="caret">▶</span> How to use</summary><div class="rb-body"><ul>' +
      sd.howToUse.map((h) => "<li>" + esc(h) + "</li>").join("") + "</ul></div></details>";
    (sd.categories || []).forEach((c) => {
      html += '<div class="star-cat"><h2>' + esc(c.icon + " " + c.name) + "</h2><ul class='star-qs'>";
      (c.questions || []).forEach((q) => { html += "<li>" + esc(q) + "</li>"; });
      html += "</ul>";
      if (c.template) {
        html += '<div class="star-tpl"><div class="rb-label">S/T/A/R template</div><ul>' +
          [["S", c.template.s], ["T", c.template.t], ["A", c.template.a], ["R", c.template.r]]
            .map((kv) => "<li><b>" + kv[0] + ":</b> " + esc(kv[1]) + "</li>").join("") + "</ul></div>";
      }
      if (c.example) {
        html += '<details class="research-block"><summary><span class="caret">▶</span> Worked example — ' + esc(c.example.title) + "</summary><div class='rb-body'>" +
          "<p>" + esc(c.example.story) + "</p>" +
          '<div class="rb-label">What the interviewer listens for</div><p>' + esc(c.example.signal) + "</p></div></details>";
      }
      html += "</div>";
    });
    html += "</div>";
    $view.innerHTML = html;
  }

  function render() {
    renderSidebar();
    if (currentView === "overview") viewOverview();
    else if (currentView === "market") viewMarket();
    else if (currentView === "jobs") viewJobs();
    else if (currentView === "crosscheck") viewCrossCheck();
    else if (currentView === "sources") viewSources();
    else if (currentView === "companies") viewCompanies();
    else if (currentView === "companyqs") viewCompanyQs();
    else if (currentView === "certs") viewCerts();
    else if (currentView === "sysdesign") viewSysDesign();
    else if (currentView === "resume") viewResume();
    else if (currentView === "labs") viewLabs();
    else if (currentView === "tracker") viewTracker();
    else if (currentView === "practice") viewPractice();
    else if (currentView === "mastery") viewMastery();
    else if (currentView === "star") viewStar();
    else if (currentView === "search") viewSearch();
    else if (currentView === "cheats") viewCheats();
    else if (currentView.startsWith("module:")) viewModule(currentView.slice(7));
    window.scrollTo(0, 0);
  }

  /* ---------------- events ---------------- */
  document.getElementById("nav").addEventListener("click", (e) => {
    const a = e.target.closest("a[data-view]");
    if (!a) return;
    e.preventDefault();
    currentView = a.dataset.view;
    render();
  });

  $view.addEventListener("click", (e) => {
    const a = e.target.closest("a[data-view]");
    if (a) {
      e.preventDefault();
      currentView = a.dataset.view;
      render();
      return;
    }
    const anch = e.target.closest("a[data-anchor]");
    if (anch) {
      e.preventDefault();
      const el = document.getElementById(anch.dataset.anchor);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    // practice mode: reveal / nav / shuffle / rate / clear
    if (e.target.id === "pr-reveal") { e.preventDefault(); stopSpeak(); practiceState.revealed = true; viewPractice(); return; }
    if (e.target.id === "pr-next") {
      e.preventDefault();
      if (practiceState.pos < practiceState.order.length - 1) { practiceState.pos++; practiceState.revealed = false; }
      stopSpeak();
      viewPractice(); return;
    }
    if (e.target.id === "pr-prev") {
      e.preventDefault();
      if (practiceState.pos > 0) { practiceState.pos--; practiceState.revealed = false; }
      stopSpeak();
      viewPractice(); return;
    }
    if (e.target.id === "pr-shuffle") {
      e.preventDefault();
      practiceState.order = buildPracticeOrder(practiceState.mid, false);
      practiceState.pos = 0; practiceState.revealed = false;
      stopSpeak();
      viewPractice(); return;
    }
    if (e.target.id === "pr-speak") {
      e.preventDefault();
      const q = practiceState.order[practiceState.pos];
      if (!q) return;
      if (window.speechSynthesis && window.speechSynthesis.speaking) { stopSpeak(); viewPractice(); return; }
      const u = new SpeechSynthesisUtterance(q.q);
      u.lang = "en-US"; u.rate = 0.95; u.pitch = 1;
      u.onend = () => viewPractice();
      window.speechSynthesis.speak(u);
      const b = document.getElementById("pr-speak");
      if (b) b.textContent = "⏹ Stop";
      return;
    }
    if (e.target.id === "ch-print") { e.preventDefault(); window.print(); return; }
    if (e.target.id === "pr-all") {
      e.preventDefault();
      practiceState.dueOnly = false; practiceState.order = []; practiceState.pos = 0; practiceState.revealed = false;
      viewPractice(); return;
    }
    if (e.target.id === "pr-due") {
      e.preventDefault();
      practiceState.mid = "all"; practiceState.dueOnly = true; practiceState.order = []; practiceState.pos = 0; practiceState.revealed = false;
      currentView = "practice"; render(); return;
    }
    if (e.target.id === "pr-clear") {
      e.preventDefault();
      if (confirm("Reset ALL practice ratings? This cannot be undone.")) {
        localStorage.removeItem(PRACTICE_KEY);
        viewMastery();
      }
      return;
    }
    const rateBtn = e.target.closest("button[data-rate]");
    if (rateBtn) {
      e.preventDefault();
      const p = getPractice();
      const k = qid(rateBtn.dataset.mid, parseInt(rateBtn.dataset.idx, 10));
      const rec = p[k] || {};
      rec.r = parseInt(rateBtn.dataset.rate, 10);
      rec.d = Date.now() + RATE_DUE_DAYS[rec.r] * 86400000;
      rec.n = (rec.n || 0) + 1;
      p[k] = rec;
      savePractice(p);
      stopSpeak();
      if (practiceState.pos < practiceState.order.length - 1) { practiceState.pos++; practiceState.revealed = false; }
      viewPractice();
      return;
    }
    // application tracker: add / delete / clear
    if (e.target.id === "tr-add") {
      e.preventDefault();
      const company = document.getElementById("tr-company").value.trim();
      if (!company) { alert("Company name is required."); return; }
      const list = getApps();
      list.push({
        company: company,
        role: document.getElementById("tr-role").value.trim(),
        date: document.getElementById("tr-date").value,
        stage: document.getElementById("tr-stage").value,
        link: document.getElementById("tr-link").value.trim(),
        notes: document.getElementById("tr-notes").value.trim(),
        added: new Date().toISOString()
      });
      saveApps(list);
      viewTracker();
      return;
    }
    if (e.target.id === "tr-export-csv") {
      e.preventDefault();
      const rows = [["company", "role", "date", "stage", "link", "notes"]].concat(
        getApps().map((x) => [x.company, x.role, x.date, x.stage, x.link, x.notes])
      );
      const csv = rows.map((r) => r.map((c) => '"' + String(c == null ? "" : c).replace(/"/g, '""') + '"').join(",")).join("\n");
      const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
      const dl = document.createElement("a");
      dl.href = url; dl.download = "applications.csv"; dl.click();
      URL.revokeObjectURL(url);
      return;
    }
    if (e.target.id === "tr-export-json") {
      e.preventDefault();
      const url = URL.createObjectURL(new Blob([JSON.stringify(getApps(), null, 2)], { type: "application/json" }));
      const dl = document.createElement("a");
      dl.href = url; dl.download = "applications.json"; dl.click();
      URL.revokeObjectURL(url);
      return;
    }
    if (e.target.id === "tr-clear") {
      e.preventDefault();
      if (confirm("Delete ALL applications? This cannot be undone.")) {
        localStorage.removeItem(TRACKER_KEY);
        viewTracker();
      }
      return;
    }
    if (e.target.dataset && e.target.dataset.trDel !== undefined) {
      e.preventDefault();
      const idx = parseInt(e.target.dataset.trDel, 10);
      const list = getApps();
      if (confirm('Delete "' + (list[idx] ? list[idx].company : "") + '"?')) {
        list.splice(idx, 1);
        saveApps(list);
        viewTracker();
      }
      return;
    }
    const card = e.target.closest(".module-card");
    if (card) {
      currentView = "module:" + card.dataset.open;
      render();
    }
  });

  // tracker: stage change + lab checkbox changes
  $view.addEventListener("change", (e) => {
    if (e.target.id === "pr-module") {
      practiceState.mid = e.target.value;
      practiceState.dueOnly = false;
      practiceState.order = [];
      practiceState.pos = 0;
      practiceState.revealed = false;
      stopSpeak();
      viewPractice();
      return;
    }
    if (e.target.id === "ch-module") {
      cheatsState.mid = e.target.value;
      viewCheats();
      return;
    }
    if (e.target.id === "sr-scope") {
      searchState.scope = e.target.value;
      searchState.results = searchState.q ? runSearch(searchState.q, searchState.scope).length : 0;
      viewSearch();
      const inp = document.getElementById("sr-input");
      if (inp) { inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length); }
      return;
    }
    if (e.target.dataset && e.target.dataset.trStage !== undefined) {
      const idx = parseInt(e.target.dataset.trStage, 10);
      const list = getApps();
      if (list[idx]) { list[idx].stage = e.target.value; saveApps(list); }
      return;
    }
    if (e.target.dataset && e.target.dataset.lab !== undefined) {
      toggleLab(e.target.dataset.lab.split("::")[0], parseInt(e.target.dataset.lab.split("::")[1], 10), e.target.checked);
      const label = e.target.closest("label");
      if (label) label.classList.toggle("lab-done", e.target.checked);
    }
  });

  document.getElementById("reset-btn").addEventListener("click", () => {
    if (confirm("Clear all checked items?")) {
      localStorage.removeItem(PROGRESS_KEY);
      updateProgressUI();
      render();
    }
  });

  $view.addEventListener("input", (e) => {
    if (e.target.id === "sr-input") {
      searchState.q = e.target.value.trim();
      if (!searchState.q) { searchState.results = 0; viewSearch(); return; }
      searchState.results = runSearch(searchState.q, searchState.scope).length;
      viewSearch();
      const inp = document.getElementById("sr-input");
      if (inp) { inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length); }
      return;
    }
  });

  /* ---------------- mobile nav drawer ---------------- */
  const sidebarEl = document.getElementById("sidebar");
  const navToggle = document.getElementById("nav-toggle");
  const navBackdrop = document.getElementById("nav-backdrop");
  function setNavOpen(open) {
    sidebarEl.classList.toggle("open", open);
    document.body.classList.toggle("nav-open", open);
    navBackdrop.classList.toggle("show", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.textContent = open ? "✕" : "☰";
  }
  navToggle.addEventListener("click", () => setNavOpen(!sidebarEl.classList.contains("open")));
  navBackdrop.addEventListener("click", () => setNavOpen(false));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setNavOpen(false); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) {
      e.preventDefault();
      currentView = "search";
      render();
      const inp = document.getElementById("sr-input");
      if (inp) inp.focus();
    }
  });
  // close drawer when a nav destination is chosen on mobile
  document.getElementById("nav").addEventListener("click", (e) => {
    if (e.target.closest("a[data-view]") && window.innerWidth <= 900) setNavOpen(false);
  });

  /* ---------------- scroll-to-top ---------------- */
  const toTopBtn = document.getElementById("to-top");
  window.addEventListener("scroll", () => {
    toTopBtn.hidden = window.scrollY < 600;
  }, { passive: true });
  toTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------------- init ---------------- */
  render();
  updateProgressUI();
})();
