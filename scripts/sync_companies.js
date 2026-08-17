/* Inject companies data into curriculum JSON + regenerate website/data.js.
   Usage: node scripts/sync_companies.js
   Keeps curriculum/Platform-Engineering-Path.json and website/data.js in sync. */
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");

const jsonPath = path.join(ROOT, "curriculum", "Platform-Engineering-Path.json");
const dataJsPath = path.join(ROOT, "website", "data.js");
const companiesPath = path.join(ROOT, "scripts", "companies_data.js");

// load companies data
const compSrc = fs.readFileSync(companiesPath, "utf8");
eval(compSrc.replace("window.COMPANIES_DATA =", "var COMPANIES_DATA ="));
const companies = COMPANIES_DATA;

// load + patch curriculum JSON
const cur = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
cur.companies = companies;

// write JSON back (2-space indent, keep key order as-is)
fs.writeFileSync(jsonPath, JSON.stringify(cur, null, 1) + "\n", "utf8");

// regenerate data.js
fs.writeFileSync(dataJsPath, "window.PATH_DATA = " + JSON.stringify(cur, null, 1) + ";\n", "utf8");

console.log("companies injected:", companies.categories.length, "categories /",
  companies.categories.reduce((a, c) => a + c.companies.length, 0), "companies");
console.log("JSON + data.js written. Run check_site_sync.js to verify.");
