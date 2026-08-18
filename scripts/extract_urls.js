// Pass 4 helper: extract all external URLs from data.js for link checking
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");
const s = fs.readFileSync(path.join(ROOT, "website", "data.js"), "utf8");
const urls = [...new Set(s.match(/https?:\/\/[^\s"\\\)]+/g) || [])];
const out = path.join(process.env.TMPDIR || "/tmp", "all_urls.txt");
fs.writeFileSync(out, urls.join("\n"));
const ext = urls.filter((u) => !u.includes("github.com/CodeTreatise"));
console.log("unique URLs:", urls.length);
console.log("external (non-own-repo):", ext.length);
console.log("written to", out);
