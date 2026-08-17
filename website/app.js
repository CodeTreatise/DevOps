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
    html += "</tbody></table></div></div>";
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

    // tier legend
    html += '<div class="tier-legend">';
    Object.entries(cd.tiers || {}).forEach(([k, v]) => {
      html += '<div class="tier-chip ' + esc(k) + '"><b>' + esc(k.replace("-", " ").toUpperCase()) + "</b> — " + esc(v) + "</div>";
    });
    html += "</div>";

    (cd.categories || []).forEach((cat) => {
      html += '<section class="company-cat">';
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
      html += "<h2>📡 Where to apply — channels</h2>";
      html += '<div class="channels-grid">';
      cd.applyChannels.forEach((ch) => {
        html += '<div class="channel-card"><b>' + esc(ch.channel) + "</b><span>" + esc(ch.detail) + "</span></div>";
      });
      html += "</div>";
    }

    // playbook
    if (cd.playbook && cd.playbook.length) {
      html += "<h2>🗺 4-week application playbook</h2>";
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
    html += '<ol class="playbook-list">' + (cq.howToUse || []).map((h) => "<li>" + esc(h) + "</li>").join("") + "</ol>";
    (cq.tiers || []).forEach((t) => {
      html += '<section class="company-cat"><div class="phase-head"><h2>' + esc(t.name) + "</h2>" +
        '<span class="ph-badge">' + (t.questions || []).length + " must-know</span></div>";
      html += '<div class="phase-goal">' + esc(t.pattern) + "</div>";
      html += '<div class="table-wrap"><table><thead><tr><th>#</th><th>Question</th><th>Where the answer lives</th></tr></thead><tbody>';
      (t.questions || []).forEach((q, i) => {
        html += "<tr><td>" + (i + 1) + '</td><td><b>' + esc(q.q) + "</b></td><td style='color:var(--text-dim);font-size:12px'>" + esc(q.where) + "</td></tr>";
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
        '<span class="role-tag">📅 Validity: ' + esc(c.validity) + "</span>" +
        '<span class="role-tag">📍 Module: ' + esc(c.module) + "</span></div>";
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
    (ld.modules || []).forEach((m) => {
      const mTotal = (m.items || []).length;
      const mDone = (m.items || []).filter((it, i) => done[labKey(m.id, i)]).length;
      const mm = moduleById(m.id);
      html += '<details class="research-block lab-module"' + (mDone === mTotal && mTotal > 0 ? "" : " open") + ">";
      html += "<summary><span class='caret'>▶</span> " + esc(m.id) + " — " + esc(m.title) +
        ' <span class="lab-prog">' + mDone + "/" + mTotal + "</span></summary>";
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
