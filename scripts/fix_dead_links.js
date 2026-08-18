// Pass 4 fix: replace dead interviewbit URLs with verified working alternatives
// Run: node scripts/fix_dead_links.js
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");

const REPLACEMENTS = {
  "https://www.interviewbit.com/linux-interview-questions/": {
    url: "https://www.geeksforgeeks.org/linux-interview-questions/",
    name: "GeeksforGeeks Linux Interview Questions",
  },
  "https://www.interviewbit.com/shell-scripting-interview-questions/": {
    url: "https://www.shellscript.sh/",
    name: "Shell Scripting Tutorial (shellscript.sh)",
  },
  "https://www.interviewbit.com/git-interview-questions/": {
    url: "https://git-scm.com/book/en/v2",
    name: "Pro Git book (official)",
  },
  "https://www.interviewbit.com/networking-interview-questions/": {
    url: "https://www.geeksforgeeks.org/networking-interview-questions/",
    name: "GeeksforGeeks Networking Interview Questions",
  },
  "https://www.interviewbit.com/docker-interview-questions/": {
    url: "https://www.geeksforgeeks.org/docker-interview-questions/",
    name: "GeeksforGeeks Docker Interview Questions",
  },
  "https://www.interviewbit.com/devops-interview-questions/": {
    url: "https://www.geeksforgeeks.org/devops-interview-questions/",
    name: "GeeksforGeeks DevOps Interview Questions",
  },
  "https://www.interviewbit.com/kubernetes-interview-questions/": {
    url: "https://www.geeksforgeeks.org/kubernetes-interview-questions/",
    name: "GeeksforGeeks Kubernetes Interview Questions",
  },
  "https://www.interviewbit.com/terraform-interview-questions/": {
    url: "https://www.geeksforgeeks.org/terraform-interview-questions/",
    name: "GeeksforGeeks Terraform Interview Questions",
  },
  "https://www.interviewbit.com/aws-interview-questions/": {
    url: "https://www.geeksforgeeks.org/aws-interview-questions/",
    name: "GeeksforGeeks AWS Interview Questions",
  },
  "https://www.interviewbit.com/sre-interview-questions/": {
    url: "https://sre.google/sre-book/",
    name: "Google SRE Book (free)",
  },
  "https://www.interviewbit.com/ansible-interview-questions/": {
    url: "https://www.geeksforgeeks.org/ansible-interview-questions/",
    name: "GeeksforGeeks Ansible Interview Questions",
  },
  "https://www.interviewbit.com/system-design-interview-questions/": {
    url: "https://github.com/donnemartin/system-design-primer",
    name: "System Design Primer (GitHub)",
  },
};

// 1) JSON (canonical)
const jsonPath = path.join(ROOT, "curriculum", "Platform-Engineering-Path.json");
let j = fs.readFileSync(jsonPath, "utf8");
let jsonHits = 0;
for (const [oldUrl, rep] of Object.entries(REPLACEMENTS)) {
  // replace URL + the name above it
  const nameOld = oldUrl.includes("linux") ? "InterviewBit Linux Interview Questions"
    : oldUrl.includes("shell") ? "InterviewBit Shell Scripting Interview Questions"
    : oldUrl.includes("git") ? "InterviewBit Git Interview Questions"
    : oldUrl.includes("networking") ? "InterviewBit Networking Interview Questions"
    : oldUrl.includes("docker") ? "InterviewBit Docker Interview Questions"
    : oldUrl.includes("devops") ? "InterviewBit DevOps Interview Questions"
    : oldUrl.includes("kubernetes") ? "InterviewBit Kubernetes Interview Questions"
    : oldUrl.includes("terraform") ? "InterviewBit Terraform Interview Questions"
    : oldUrl.includes("aws") ? "InterviewBit AWS Interview Questions"
    : oldUrl.includes("sre") ? "InterviewBit SRE Interview Questions"
    : oldUrl.includes("ansible") ? "InterviewBit Ansible Interview Questions"
    : oldUrl.includes("system-design") ? "InterviewBit System Design Interview Questions"
    : null;
  // JSON is minified-ish (2-space indent, multi-line strings) — replace url occurrence
  while (j.includes(oldUrl)) { j = j.replace(oldUrl, rep.url); jsonHits++; }
  if (nameOld && j.includes(nameOld)) j = j.split(nameOld).join(rep.name);
}
fs.writeFileSync(jsonPath, j);
console.log("JSON: replaced", jsonHits, "URLs");

// 2) PATH.md
const mdPath = path.join(ROOT, "curriculum", "Platform-Engineering-PATH.md");
let m = fs.readFileSync(mdPath, "utf8");
let mdHits = 0;
for (const [oldUrl, rep] of Object.entries(REPLACEMENTS)) {
  while (m.includes(oldUrl)) { m = m.replace(oldUrl, rep.url); mdHits++; }
  // update link text like "[InterviewBit Linux Interview Questions]"
  const names = {
    "InterviewBit Linux Interview Questions": rep.name,
    "InterviewBit Shell Scripting Interview Questions": rep.name,
    "InterviewBit Git Interview Questions": rep.name,
    "InterviewBit Networking Interview Questions": rep.name,
    "InterviewBit Docker Interview Questions": rep.name,
    "InterviewBit DevOps Interview Questions": rep.name,
    "InterviewBit Kubernetes Interview Questions": rep.name,
    "InterviewBit Terraform Interview Questions": rep.name,
    "InterviewBit AWS Interview Questions": rep.name,
    "InterviewBit SRE Interview Questions": rep.name,
    "InterviewBit Ansible Interview Questions": rep.name,
    "InterviewBit System Design Interview Questions": rep.name,
  };
  for (const [n, val] of Object.entries(names)) {
    while (m.includes(`[${n}]`)) m = m.split(`[${n}]`).join(`[${val}]`);
  }
}
fs.writeFileSync(mdPath, m);
console.log("PATH.md: replaced", mdHits, "URLs");

// 3) check any leftover interviewbit refs
const leftoverJ = (fs.readFileSync(jsonPath, "utf8").match(/interviewbit/g) || []).length;
const leftoverM = (fs.readFileSync(mdPath, "utf8").match(/interviewbit/g) || []).length;
console.log("leftover interviewbit in JSON:", leftoverJ, "| PATH.md:", leftoverM);
