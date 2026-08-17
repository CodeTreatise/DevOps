# 🧱 Platform Fundamentals — DevOps / SRE Learning Path

> **Goal:** Go from "uses a computer" to "runs infrastructure" — the durable, non-AI career lane.
> **Estimated time:** ~8–10 weeks part-time · **Cost:** $0 (everything below is free)
> **Companion note:** This is the fallback identity to the AI-Agents path — agents are the exciting portfolio, this is the guaranteed paycheck. The 5 topics below are the actual foundation of every platform/DevOps/SRE interview at entry level.

---

## 📌 Master Index

| # | Module | Type | Est. Time | Status |
| --- | --- | --- | --- | --- |
| 01 | Linux — the terminal is home | ⚙️ Foundation | Weeks 1–3 | ☐ |
| 02 | Git — snapshots & safety net | 🔀 Foundation | Week 4 | ☐ |
| 03 | Networking — IPs, ports, DNS, debug | 🌐 Foundation | Weeks 5–6 | ☐ |
| 04 | Docker — "works everywhere" | 🐳 Core | Weeks 7–8 | ☐ |
| 05 | CI/CD — automate every push | ⚡ Core | Weeks 9–10 | ☐ |
| 06 | Capstone — a deployed, tested, automated stack | 🏆 Final | Week 10 | ☐ |

**The golden order is dependency-based:** you can't run Docker without understanding processes (Linux) and versions (Git). You can't debug containers without ports/DNS (Networking). You can't do CI/CD without Docker + Git. Do NOT skip ahead.

---

## 01 · Linux — the terminal is home 🐧 (Weeks 1–3)

### Mental model: everything is a file

**Everything is a file** — processes, devices, configs are files; you manage the OS by managing files and permissions. There is no GUI safety net; the terminal *is* the interface.

### Core skills (the 20% that matters — master these, ignore the rest)

- [ ] **Navigation & file ops** — `cd`, `ls`, `pwd`, `mkdir`, `rm`, `cp`, `mv`, `cat`, `less`
  - 📚 [Linux Journey](https://linuxjourney.com/) (free interactive, community favorite) · [Ubuntu Command Line for Beginners](https://ubuntu.com/tutorials/command-line-for-beginners) (official free tutorial)
- [ ] **Editing & searching** — `nano`/`vim` basics, `grep`, `find`
  - 📚 [Linux Journey](https://linuxjourney.com/) (text-fu section) · [MIT Missing Semester](https://missing.csail.mit.edu/) (shell mastery — the famous course)
- [ ] **Permissions** — `rwx`, `chmod`, `chown`; why `755` vs `644`
  - 📚 [Linux Journey: Permissions](https://linuxjourney.com/lesson/file-permissions) · [Ubuntu tutorial](https://ubuntu.com/tutorials/command-line-for-beginners)
- [ ] **Processes** — `ps`, `kill`, `top`/`htop`; what a stuck process is and how to end it
  - 📚 [Linux Journey: Process Management](https://linuxjourney.com/lesson/process-management) · [KodeKloud Linux Basics](https://kodekloud.com/courses/linux-basics-for-devops/) (DevOps-standard, free tier)
- [ ] **Installing software** — `apt`, package managers, `sudo` and why it matters
  - 📚 [Ubuntu tutorial](https://ubuntu.com/tutorials/command-line-for-beginners) · [Linux Journey](https://linuxjourney.com/)
- [ ] **SSH** — connect to a remote box and work there
  - 📚 [Linux Journey: SSH](https://linuxjourney.com/lesson/ssh) · [DigitalOcean SSH guide](https://www.digitalocean.com/community/tutorials/how-to-use-ssh-to-connect-to-a-remote-server)

### Daily loop: 30 minutes in the terminal

- [ ] 30 min/day in the terminal doing real tasks — rename a folder with a loop, find every file containing a word, kill a stuck process. No GUI fallback.

**Exit test:** you can `ssh` into a box and find, read, edit, and run something without asking anyone.

---

## 02 · Git — snapshots & safety net 🔀 (Week 4)

### Mental model: snapshots of your project over time

**Snapshots of your project over time.** Commits are checkpoints; branches are parallel timelines you merge back together. Git exists so you can make a mess and always recover.

### Core skills: the daily flow

- [ ] **Daily flow** — `clone`, `add`, `commit`, `push`, `pull`
  - 📚 [Git Immersion](https://gitimmersion.com/) (hands-on labs, free) · [GitHub Skills](https://skills.github.com/) (official interactive courses)
- [ ] **Branches & merging** — `branch`, `checkout`, `merge`; what a merge conflict is
  - 📚 [Oh My Git!](https://ohmygit.org/) (learn branches by playing a game) · [Pro Git book](https://git-scm.com/book/en/v2) (free, the canonical reference)
- [ ] **Undoing mistakes** — `reset`, `revert`, `stash`, `log`, `diff`
  - 📚 [Git Immersion](https://gitimmersion.com/) · [Pro Git: Undoing](https://git-scm.com/book/en/v2/Git-Basics-Undoing-Things)
- [ ] **GitHub workflow** — pushing to a repo, opening a pull request
  - 📚 [GitHub Hello World](https://docs.github.com/en/get-started/quickstart/hello-world) · [GitHub Skills](https://skills.github.com/)

### Daily loop: commit everything

- [ ] Commit *everything* you do this week — every config, every script. `add` → `commit` → `push` at least once a day.

**Exit test:** you can branch, make a mess, and recover with `git reset` and `git stash` without panic.

---

## 03 · Networking — IPs, ports, DNS, debug 🌐 (Weeks 5–6)

### Mental model: servers are IP:port

**Servers are IP:port.** A web server is `192.168.1.5:80`; DNS turns `google.com` into an IP. Everything you'll ever debug is "can I reach that port?" — the answer is usually DNS, a dead server, or a blocked port.

### Core skills: ports, HTTP & diagnosis

- [ ] **Ports & protocols** — know exactly four: 22 SSH, 80 HTTP, 443 HTTPS, 5432 Postgres
  - 📚 [freeCodeCamp: Computer Networking course](https://www.youtube.com/watch?v=qiQR5rTSshw) (community-recommended primer) · [MDN HTTP Overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview)
- [ ] **HTTP request/response** — status codes (200/301/404/500), headers, JSON payloads
  - 📚 [MDN HTTP Overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview) · [curl docs](https://curl.se/docs/)
- [ ] **Diagnosing with `curl`** — `curl -v` shows the whole request/response; the debugger for 90% of problems
  - 📚 [curl docs](https://curl.se/docs/) · [howdns.works](https://howdns.works/) (interactive comic — actually good)
- [ ] **Host reachability** — `ping`, `ss -tulpn` (what's listening), `nslookup` (DNS lookup), `telnet host port` (raw port test)
  - 📚 [freeCodeCamp course](https://www.youtube.com/watch?v=qiQR5rTSshw) · [howdns.works](https://howdns.works/)

- [ ] **dig** — DNS lookup with full detail — TTL, record type, authoritative vs cached; the production upgrade from nslookup
  - 📚 [BIND 9 man pages: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility)
- [ ] **mtr** — Combines ping + traceroute in real time; the right tool for intermittent latency
  - 📚 [mtr (official site)](https://www.bitwizard.nl/mtr/)
- [ ] 🟡 **tcpdump** — Capture packets on the wire; the last-resort tool when nothing else shows what's happening
  - 📚 [Daniel Miessler: tcpdump primer](https://danielmiessler.com/blog/tcpdump)
- [ ] **Error semantics** — "connection refused" vs "timeout" vs "no route to host" mean different things; learn to read them
  - 📚 [freeCodeCamp course](https://www.youtube.com/watch?v=qiQR5rTSshw) · [curl docs](https://curl.se/docs/)

### Debug flow to internalize

- [ ] Given "my app won't connect": (1) is DNS resolving? (`nslookup`) → (2) is the host up? (`ping`) → (3) is the port open? (`telnet`) → (4) is my firewall/local port the issue? (`ss -tulpn`)

**Exit test:** you can classify any connection failure as DNS, dead server, or blocked port — using three commands.

---

## 04 · Docker — "works everywhere" 🐳 (Weeks 7–8)

### Mental model: blueprint vs running instance

**Code + OS + config bundled into one immutable unit.** "Works on my machine" dies. You never install Postgres on your laptop again — you `docker run` it. An **image** is a blueprint; a **container** is a running instance (class vs object).

### Core skills: run, build, stack

- [ ] **Run & manage** — `docker run`, `ps`, `logs`, `exec`, `rm`
  - 📚 [Docker Get Started](https://docs.docker.com/get-started/) (the best starting point, free) · [Play with Docker](https://labs.play-with-docker.com/) (practice in the browser, nothing to install)
- [ ] **Dockerfiles** — `FROM`, `RUN`, `COPY`, `CMD`; build with `docker build -t myapp .`
  - 📚 [Docker Get Started](https://docs.docker.com/get-started/) · [Docker Curriculum](https://docker-curriculum.com/) (community classic)
- [ ] **Ports & volumes** — `-p 8080:8080` exposes; `-v` mounts a folder so data survives
  - 📚 [Docker Get Started](https://docs.docker.com/get-started/) · [Docker Curriculum](https://docker-curriculum.com/)
- [ ] **Experimentation** — `docker run -it --rm ubuntu bash`; break things freely, they're throwaway
  - 📚 [Play with Docker](https://labs.play-with-docker.com/) · [Docker Get Started](https://docs.docker.com/get-started/)
- [ ] **Compose (multi-service stacks)** — `docker compose up`; web server + database together in one YAML
  - 📚 [Docker Compose overview](https://docs.docker.com/compose/) · [Docker Get Started](https://docs.docker.com/get-started/)

### One-week project

- [ ] Containerize a tiny web server (`python -m http.server` is fine), then build a **two-service stack** — web server + Postgres — with a `docker-compose.yml`

**Exit test:** you can write a `Dockerfile` + `docker-compose.yml` for a small app from memory.

---

## 05 · CI/CD — automate every push ⚡ (Weeks 9–10)

### Mental model: gates on every push

**Every push runs a pipeline automatically: test → build → deploy, gated by tests.** A pipeline is just a script that runs on every change. The magic is the **gate** — nothing deploys unless tests pass.

### Core skills: triggers, jobs, gates

- [ ] **Anatomy of a pipeline** — triggers, jobs, steps; `on: [push]` vs `on: [pull_request]`
  - 📚 [GitHub Actions docs](https://docs.github.com/en/actions) (official, free) · [GitHub Skills: GitHub Actions](https://skills.github.com/)
- [ ] **Write one workflow** — checkout → run tests → build, on every push
  - 📚 [GitHub Actions docs](https://docs.github.com/en/actions) · [GitHub Skills](https://skills.github.com/)
- [ ] **Gates** — the pipeline goes red on failure; that red is the feature
  - 📚 [GitHub Actions docs](https://docs.github.com/en/actions) · [Awesome CI/CD](https://github.com/ciandcd/awesome-ciandcd) (tool overview)
- [ ] **Deploy step** — a job that ships the built artifact (Docker image) after tests pass
  - 📚 [GitHub Actions docs](https://docs.github.com/en/actions) · [GitHub Skills](https://skills.github.com/)
- [ ] **Secrets in CI** — API keys, registry credentials; store in GitHub Secrets, never hardcode or log them; scope secrets to specific environments
  - 📚 [GitHub Actions: Using secrets](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions) · [GitHub Actions: Security hardening](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)

### Exit drill

- [ ] Push a deliberately broken change → pipeline goes red → read the log → fix → green. Repeat until it's boring.

**Exit test:** your repo builds and tests itself on every push, and you can read a failing pipeline log.

### On the radar: Jenkins & GitLab CI

GitHub Actions is the right learning tool — simple, free, no infrastructure. But the **Indian enterprise job market (TCS/Infosys/Accenture/Wipro) runs Jenkins**; GitLab CI is a "core must-have" in most India JDs. You don't need to master them now, but know they exist and why:

- [ ] **Jenkins awareness** — the dominant CI in Indian enterprises; declarative pipelines, master-agent model, plugins
  - 📚 [Jenkins docs](https://www.jenkins.io/doc/) · [Jenkins Pipeline tour](https://www.jenkins.io/doc/pipeline/tour/getting-started/)
- [ ] **GitLab CI awareness** — `.gitlab-ci.yml`, runners, built-in registry; appears in most Indian mid-level JDs
  - 📚 [GitLab CI docs](https://docs.gitlab.com/ee/ci/) · [GitLab: first pipeline](https://docs.gitlab.com/ci/quick_start/)

> 💡 Phase B (module B05) covers Jenkins and GitLab CI in full depth. Read these docs once now so they're not new words in an interview.

### Agile & delivery practice

- [ ] **Scrum essentials** — sprints, stand-ups, backlog, retrospectives; where delivery cadence meets CI/CD
  - 📚 [The Scrum Guide](https://scrumguides.org/) · [Atlassian Agile Coach](https://www.atlassian.com/agile)
- [ ] **Kanban & flow** — WIP limits, pull-based flow, lead time; when continuous flow beats sprints
  - 📚 [Atlassian: What is Kanban](https://www.atlassian.com/agile/kanban)
- [ ] **Agile vs Waterfall vs DevOps** — where DevOps fits in delivery culture; the ceremonies you'll actually attend
  - 📚 [Simplilearn: DevOps Engineer Skills (JD-derived)](https://www.simplilearn.com/devops-engineer-skills-article)

---

## 06 · Capstone — a deployed, tested, automated stack 🏆 (Week 10)

- [ ] **Bring it together:** one small app (any language) with:
  - A `Dockerfile` + `docker-compose.yml` (web + Postgres)
  - A **minimal test suite** — at least one unit test and one integration test (e.g. `pytest` for Python, `jest` for Node); the CI gate is only real when tests can fail
  - A GitHub repo with a CI workflow that runs tests on every push and goes **red** when they fail
  - A README that documents how to run it (so anyone can `docker compose up`)
- [ ] **Then one real-world variation:** deploy it to a free tier (Railway/Render/Fly) with a health check — now it's not a tutorial, it's a portfolio piece
  - 📚 [Render free tier docs](https://render.com/docs/free) · [Fly.io docs](https://fly.io/docs/) · [Docker health checks](https://docs.docker.com/reference/compose-file/services/#healthcheck)
- [ ] **Community project ladder** — roadmap.sh's beginner DevOps projects (community-tracked, difficulty-tagged — ~8K people started server-stats alone): server-stats, log archive tool, GitHub Pages deploy, basic Dockerfile, EC2 instance — exactly this path's scope, externally validated
  - 📚 [roadmap.sh DevOps projects](https://roadmap.sh/devops/projects) · [server-stats](https://roadmap.sh/projects/server-stats) · [log archive tool](https://roadmap.sh/projects/log-archive-tool) · [basic Dockerfile](https://roadmap.sh/projects/basic-dockerfile)

**Exit test (the whole path in one sentence):** "I can set up a Linux box, version my work with Git, debug network issues, run any app in Docker, and automate testing and deploying with CI/CD."

---

## ⏭️ Later — only when you hit the wall that needs it

- [ ] **Kubernetes** — start when "I have 5 servers" or "Docker alone isn't enough" becomes real
  - 📚 [Kubernetes docs tutorials](https://kubernetes.io/docs/tutorials/) · [k3s](https://k3s.io/) (lightweight local k8s) · [KodeKloud](https://kodekloud.com/)
- [ ] **Terraform / Infrastructure as Code** — start when "I keep setting up servers by hand" becomes real
  - 📚 [Terraform docs](https://developer.hashicorp.com/terraform/docs) · [KodeKloud](https://kodekloud.com/)
- [ ] **SRE depth** — SLOs, error budgets, incident response — the reliability math
  - 📚 [Google SRE books (free)](https://sre.google/books/) (the industry's canonical texts) · [Awesome SRE](https://github.com/dastergon/awesome-sre)

**Rule:** do NOT add these until the wall appears. The 5 core topics are the employable foundation; the rest compounds only when needed.

---

## 📊 Market Reality Check — entry level (2025–26 data)

> Same sources as the MidLevel index appendix (fetched 2026-08): SalaryExpert/ERI, Pune market reports, switchtodevops, Stack Overflow 2025. Entry-level numbers only — mid/senior figures live in the MidLevel index's Market Reality Check.

### Pune, India (your home market)

| Level | Range (LPA) | Sources |
| --- | --- | --- |
| Fresher (0–2 yrs) | ₹3.6–8 | devopstraininginstitute 2025 · SalaryExpert entry ₹15.9L (1–3 yrs) |
| Freelance (side income) | ₹800–3,000/hr | devopstraininginstitute · switchtodevops |

Entry pays modestly for the first year, then jumps fast: the mid-level sweet spot (2–5 yrs, ₹10–22L remote India) is one promotion away. 25% YoY growth in Pune DevOps openings; ~40% of India roles now offer some remote flexibility — the fundamentals here are what every one of those interviews tests first.

### What the market actually asks at entry level (Stack Overflow 2025)

- **Python + Bash/Shell are the #1 and #2 automation languages** (57.9% / 48.7% of devs) — exactly the Linux + scripting foundation this path teaches
- **GitHub is the top collaboration tool** (70.1% desired) — the Git module is market-aligned
- **Terraform is the most admired infra tool** (51.8%) — your "Later" item, right on schedule
- **84% of developers use AI tools** — but entry-level interviews still test the fundamentals this path covers

### Certifications that pay (entry → mid)

| Cert | Effect | When |
| --- | --- | --- |
| AWS Certified Cloud Practitioner | cheapest entry-level proof | after this path |
| AWS DevOps Engineer (associate) | ~+20–30% | after MidLevel M03 |
| CKA (Certified Kubernetes Admin) | ~+15–25% | after MidLevel M01 |

### Sources

SalaryExpert/ERI (Aug 2026) · devopstraininginstitute.com Pune report (Oct 2025) · switchtodevops.com Remote DevOps India 2026 · Stack Overflow Developer Survey 2025 · roadmap.sh project stats.

---

## ✅ What this lands in your lap

- [ ] Terminal fluency — the difference between "watching tutorials" and "working"
- [ ] A versioned, tested, containerized, auto-deployed repo — the portfolio piece
- [ ] The exact foundation of a junior platform/DevOps/SRE role — ~60–70% of what entry-level interviews test
- [ ] A career lane that is **not** AI-dependent and compounds with AI when you later add the agent path

> **Total cost: $0 · Total time: ~8–10 weeks part-time · All links free & community/industry-preferred.**
