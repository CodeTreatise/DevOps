/* Cross-reference validator: every module code referenced anywhere
   (certs, sysdesign, labs, companyQs, companies, module dependsOn,
   marketData/jobRequirements modules) must point to a real module A01-B09.
   Also validates cert ids, tier ids, and company category refs.
   Usage: node scripts/check_crossrefs.js */
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");
const j = JSON.parse(fs.readFileSync(path.join(ROOT, "curriculum", "Platform-Engineering-Path.json"), "utf8"));

const mods = new Set();
for (const ph of j.phases) for (const m of ph.modules || []) mods.add(m.id);
console.log("modules:", [...mods].join(", "));

const problems = [];
function checkRef(ref, where, kind) {
  if (!mods.has(ref)) problems.push(kind + ": '" + ref + "' (in " + where + ") not a real module");
}

// module dependsOn
for (const ph of j.phases) for (const m of ph.modules || []) {
  (m.dependsOn || []).forEach(d => checkRef(d, m.id + ".dependsOn", "dependsOn"));
}

// companies
for (const cat of (j.companies || {}).categories || []) {
  for (const co of cat.companies || []) {
    (co.modules || []).forEach(m => checkRef(m, "companies:" + co.name, "company.modules"));
  }
}

// certs
for (const c of (j.certs || {}).certs || []) {
  if (c.module) checkRef(c.module, "certs:" + c.id, "cert.module");
  for (const ph of (j.certs || {}).timeline || []) {
    (ph.certs || []).forEach(ci => {
      if (!(j.certs.certs || []).some(x => x.id === ci)) problems.push("timeline.certs: '" + ci + "' (in " + ph.phase + ") not a real cert id");
    });
  }
}

// sysdesign
for (const p of (j.systemDesign || {}).problems || []) {
  (p.modules || []).forEach(m => checkRef(m, "sysdesign:" + p.id, "sysdesign.modules"));
}

// labs
for (const m of (j.labs || {}).modules || []) {
  checkRef(m.id, "labs", "lab.module");
}

// marketData premiumSkills + certifications + jobRequirements rows
for (const p of (j.marketData || {}).premiumSkills || []) {
  if (p.module) {
    const m = String(p.module).match(/[AB]\d{2}/g) || [];
    m.forEach(x => checkRef(x, "marketData.premiumSkills:" + p.skill, "premiumSkill.module"));
  }
}
for (const c of (j.marketData || {}).certifications || []) {
  if (c.when && /[AB]\d{2}/.test(c.when)) {
    const m = c.when.match(/[AB]\d{2}/g);
    m.forEach(x => checkRef(x, "marketData.certifications:" + c.cert, "cert.when"));
  }
}
for (const r of (j.jobRequirements || {}).rows || []) {
  if (r.module && r.module !== "—") {
    // module may be a list "A01, A05" or single or "External"
    r.module.split(/[,+]/).map(s => s.trim()).filter(Boolean).forEach(x => {
      if (/^[AB]\d{2}$/.test(x)) checkRef(x, "jobRequirements:" + r.requirement, "jobReq.module");
    });
  }
}

// companyQs tiers references
const tierIds = new Set((j.companies || {}).categories.map(c => c.tier));
for (const t of (j.companyQs || {}).tiers || []) {
  if (t.id && !["tier1", "tier2", "tier3"].includes(t.id)) problems.push("companyQs.tier id '" + t.id + "' unexpected");
  // check q.where mentions module codes
  for (const q of t.questions || []) {
    const m = String(q.where).match(/[AB]\d{2}/g) || [];
    m.forEach(x => checkRef(x, "companyQs:" + q.q.slice(0, 30), "companyQs.where"));
  }
}

// phases: sanity check — module week strings should be non-empty and roughly match phase span
for (const ph of j.phases) {
  (ph.modules || []).forEach((m) => {
    if (!String(m.weeks || "").trim()) problems.push("phase " + ph.id + " module " + m.id + " has no weeks");
  });
}

console.log(problems.length ? "PROBLEMS:\n" + problems.join("\n") : "CROSSREFS OK ✅");
process.exit(problems.length ? 1 : 0);
