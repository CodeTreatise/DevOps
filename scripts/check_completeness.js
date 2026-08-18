// Pass 3: completeness check — module structure + research blocks + feature docs
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");
const j = JSON.parse(fs.readFileSync(path.join(ROOT, "curriculum", "Platform-Engineering-Path.json"), "utf8"));

const phases = [...j.phases[0].modules, ...j.phases[1].modules];
console.log("modules:", phases.length);

const issues = [];
const codes = new Set(phases.map((p) => p.id));
for (const m of phases) {
  const r = m.research || {};
  if (Object.keys(r).length === 0) issues.push(`${m.id}: NO research`);
  else {
    for (const k of ["interviewFocus", "demandNotes", "verifiedResources", "depthSequence"]) {
      if (!(k in r)) issues.push(`${m.id}: missing research.${k}`);
      else if (typeof r[k] === "string" && r[k].trim() === "") issues.push(`${m.id}: empty research.${k}`);
      else if (Array.isArray(r[k]) && r[k].length === 0) issues.push(`${m.id}: empty research.${k}`);
    }
    // certifications is optional; flag only if present-but-empty
    if ("certifications" in r && Array.isArray(r.certifications) && r.certifications.length === 0) {
      issues.push(`${m.id}: empty research.certifications`);
    }
  }
  const st = m.subTopics ? m.subTopics.length : 0;
  if (st === 0) issues.push(`${m.id}: NO subTopics`);
  if (!m.weeks || m.weeks === "") issues.push(`${m.id}: empty weeks`);
  // dependsOn optional for the entry module; flag only if present-but-not-an-array
  if ("dependsOn" in m && !Array.isArray(m.dependsOn)) issues.push(`${m.id}: malformed dependsOn`);
}
console.log("module issues:", issues.length ? issues : "NONE");

// feature docs vs JSON data
const docs = {
  "Certifications-TIMELINE.md": "certs",
  "System-Design-DEVOPS.md": "systemDesign",
  "Labs-CHECKLISTS.md": "labs",
  "Resume-Kit.md": "resumeTemplate",
  "Company-Question-Sets.md": "companyQs",
};
for (const [doc, key] of Object.entries(docs)) {
  const docPath = path.join(ROOT, "curriculum", doc);
  const hasDoc = fs.existsSync(docPath);
  const v = j[key];
  const hasData = !!v && (Array.isArray(v) ? v.length > 0 : Object.keys(v).length > 0);
  console.log(`doc ${doc}: ${hasDoc ? "OK" : "MISSING"} | data.${key}: ${hasData ? "OK" : "MISSING"}`);
}

// company Q-Set refs resolve to real modules
let refBad = 0;
for (const tier of j.companyQs.tiers || []) {
  for (const q of tier.questions || []) {
    const refs = (q.where || "").match(/[AB]\d{2}/g) || [];
    for (const ref of refs) if (!codes.has(ref)) { refBad++; console.log("  BAD ref", ref, "in tier", tier.id, "q:", q.q.slice(0, 50)); }
  }
}
console.log("companyQs bad refs:", refBad === 0 ? "NONE" : refBad);

// cert module refs resolve
let certBad = 0;
for (const c of j.certs.certs || []) {
  const refs = (c.module || "").match(/[AB]\d{2}/g) || [];
  for (const ref of refs) if (!codes.has(ref)) { certBad++; console.log("  BAD cert ref", ref, "in", c.name); }
}
console.log("cert bad module refs:", certBad === 0 ? "NONE" : certBad);

// labs module refs resolve
let labBad = 0;
for (const lab of j.labs.modules || []) {
  const refs = (lab.id || "").match(/[AB]\d{2}/g) || [];
  for (const ref of refs) if (!codes.has(ref)) { labBad++; console.log("  BAD lab ref", ref); }
}
console.log("labs bad module refs:", labBad === 0 ? "NONE" : labBad);

// sysdesign module refs resolve
let sdBad = 0;
for (const p of j.systemDesign.problems || []) {
  const refs = (p.modules || []).join(" ").match(/[AB]\d{2}/g) || [];
  for (const ref of refs) if (!codes.has(ref)) { sdBad++; console.log("  BAD sysdesign ref", ref, "in", p.id); }
}
console.log("sysdesign bad module refs:", sdBad === 0 ? "NONE" : sdBad);

// premium skills module refs resolve
let psBad = 0;
for (const ps of (j.marketData.premiumSkills || [])) {
  const refs = (ps.module || "").match(/[AB]\d{2}/g) || [];
  for (const ref of refs) if (!codes.has(ref)) { psBad++; console.log("  BAD premiumSkill ref", ref, "in", ps.name); }
}
console.log("premiumSkills bad refs:", psBad === 0 ? "NONE" : psBad);

// crosscheck present
console.log("crossCheck keys:", Object.keys(j.crossCheck).join(", "));
console.log("marketData keys:", Object.keys(j.marketData).join(", "));
