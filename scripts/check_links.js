// Pass 4: HTTP-check all external URLs from data.js
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");
const s = fs.readFileSync(path.join(ROOT, "website", "data.js"), "utf8");
const urls = [...new Set(s.match(/https?:\/\/[^\s"\\\)]+/g) || [])].filter((u) => !u.includes("github.com/CodeTreatise"));

const results = { ok: [], dead: [], unknown: [] };
let idx = 0;
const CONCURRENCY = 8;

function check(url) {
  return new Promise((resolve) => {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 15000);
    const tryHead = fetch(url, { method: "HEAD", redirect: "follow", signal: ctl.signal, headers: { "user-agent": "Mozilla/5.0 (link-checker)" } })
      .then((r) => ({ status: r.status, finalUrl: r.url }))
      .catch(() => null);
    tryHead.then((head) => {
      if (head && head.status >= 200 && head.status < 400) {
        clearTimeout(t);
        resolve({ url, status: head.status, finalUrl: head.finalUrl });
        return;
      }
      // HEAD blocked/redirected to login — try GET
      const ctl2 = new AbortController();
      const t2 = setTimeout(() => ctl2.abort(), 20000);
      fetch(url, { method: "GET", redirect: "follow", signal: ctl2.signal, headers: { "user-agent": "Mozilla/5.0 (link-checker)", "accept": "text/html,application/xhtml+xml,*/*" } })
        .then((r) => { clearTimeout(t2); resolve({ url, status: r.status, finalUrl: r.url }); })
        .catch(() => { clearTimeout(t2); resolve({ url, status: 0, finalUrl: null }); });
    });
  });
}

async function run() {
  while (idx < urls.length) {
    const batch = [];
    for (let i = 0; i < CONCURRENCY && idx < urls.length; i++) batch.push(check(urls[idx++]));
    const out = await Promise.all(batch);
    for (const r of out) {
      if (r.status >= 200 && r.status < 400) results.ok.push(r);
      else if (r.status === 0) results.unknown.push(r);
      else results.dead.push(r);
    }
    console.log(`progress ${idx}/${urls.length} ok=${results.ok.length} dead=${results.dead.length} unknown=${results.unknown.length}`);
  }
  const report = path.join(process.env.TMPDIR || "/tmp", "link_check_report.json");
  fs.writeFileSync(report, JSON.stringify(results, null, 1));
  console.log("=== DEAD (4xx/5xx) ===");
  for (const d of results.dead) console.log(d.status, d.url, "->", d.finalUrl || "");
  console.log("=== UNKNOWN (timeout/network) ===");
  for (const u of results.unknown) console.log("timeout", u.url);
  console.log("\nreport:", report);
}

run();
