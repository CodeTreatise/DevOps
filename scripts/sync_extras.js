/* Inject extras (certs, system design, labs, resume, company questions)
   into curriculum JSON + regenerate website/data.js.
   Usage: node scripts/sync_extras.js
   Run AFTER sync_companies.js (companies must exist first). */
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");

const jsonPath = path.join(ROOT, "curriculum", "Platform-Engineering-Path.json");
const dataJsPath = path.join(ROOT, "website", "data.js");

function loadJs(file, varName) {
  const src = fs.readFileSync(path.join(ROOT, "scripts", file), "utf8");
  const code = src.replace(new RegExp("window\\." + varName + "\\s*="), "var " + varName + " =");
  eval(code);
  return eval(varName);
}

const certs = loadJs("certs_data.js", "CERTS_DATA");
const sysdesign = loadJs("sysdesign_data.js", "SYSDESIGN_DATA");
const labs = loadJs("labs_data.js", "LABS_DATA");
const resume = loadJs("resume_data.js", "RESUME_DATA");
const companyQs = loadJs("company_qs_data.js", "COMPANY_QS_DATA");
const star = loadJs("star_data.js", "STAR_DATA");

const cur = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
cur.certs = certs;
cur.systemDesign = sysdesign;
cur.labs = labs;
cur.resumeTemplate = resume;
cur.companyQs = companyQs;
cur.starBank = star;

fs.writeFileSync(jsonPath, JSON.stringify(cur, null, 1) + "\n", "utf8");
fs.writeFileSync(dataJsPath, "window.PATH_DATA = " + JSON.stringify(cur, null, 1) + ";\n", "utf8");

console.log(
  "extras injected: certs=" + certs.certs.length +
  ", sysdesign problems=" + sysdesign.problems.length +
  ", labs modules=" + labs.modules.length +
  ", companyQs tiers=" + companyQs.tiers.length +
  ", star categories=" + star.categories.length +
  ", resume sections ok"
);
console.log("JSON + data.js written. Run check_site_sync.js to verify.");
