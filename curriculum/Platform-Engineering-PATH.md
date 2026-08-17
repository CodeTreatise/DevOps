# Platform Engineering — The Full Path (DevOps / SRE)

> **Version:** 1.0.0 · **Generated:** 2026-08-14
> **Total cost:** $0 · **Total time:** ~18–22 weeks part-time (Phases A + B)

**Built from:** Platform-Fundamentals-INDEX.md, Platform-MidLevel-INDEX.md

**Notes:**

- Every item carries required=true|false (🟡 in markdown = optional)
- Every resource carries verified=fetch-verified|official-doc|null (our verification history)
- Market figures carry provenance per region/level
- This JSON is the source of truth; the merged markdown renders from it 1:1
- Per-module research blocks added: interviewFocus, demandNotes, verifiedResources, depthSequence (sources: InterviewBit live question banks, Argo CD docs, roadmap.sh project stats, Google SRE).
- URL audit 2026-08-14: 239 unique URLs checked; 8 dead replaced (kodekloud linux course->the-linux-basics-course, k8s VPA->concepts/workloads/autoscaling/vertical-pod-autoscale, sre distributed-tracing->OpenTelemetry traces, sre data-integrity->data-integrity, sre effective-documentation->Google tech-writing, trivy scanner+sbom->docs/latest/guide, GCP zero-trust-architecture->zero-trust). Bot-blocked-but-live (InterviewBit x12, linuxjourney, realpython, iso 27001, aws cost-management, OPA, BashGuide, docker-curriculum) marked fetch-verified.
- Sub-topic research 2026-08-14: all 62 sub-topics carry research{interviewFocus[3-5 Qs], practice, depthNote} — built from module-level research + InterviewBit banks + roadmap.sh projects + docs (see research blocks per module for certifications).
- Market data refresh 2026-08-14: Pune rows refreshed (SalaryExpert/salaryinsight/vtricks/Lavatech); NEW national-India region (Tutorac/switchtodevops/TrueDirectory/Nexson: fresher 4-7L, senior 15-28L, lead 30-60L+); NEW platform-engineer India row (avg 17.5L, entry 12.65L, Blr top-10% 45-70L); International expanded to 9 rows (SIVARO 2026: US 90K-600K+ by level, FAANG L5 350-500K TC, London 130-180K GBP, Berlin 120-160K EUR); premium skills 12 (+AI infra 20-30%, IDP Backstage/Port, deep K8s 15-25%); certs 5 (+GCP PCA, NVIDIA AI-infra + cert-myth caveat).

**Data sources:** SalaryExpert/ERI (Aug 2026), devopstraininginstitute.com Pune report (Oct 2025), Lavatech Pune guide (Jan 2026), switchtodevops.com Remote DevOps India 2026, Stack Overflow Developer Survey 2025, DORA research, CNCF Annual Survey 2024, roadmap.sh (repo inventories + project stats)

---

## Table of Contents

- [Phase A — Foundations](#phase-a--foundations)
- [Phase B — Mid-Level Depth](#phase-b--mid-level-depth)
- [Appendix: Market Data](#appendix-market-data)
- [Appendix: Community Cross-Check (roadmap.sh)](#appendix-community-cross-check-roadmapsh)
- [Appendix: Sources](#appendix-sources)

## Phase A — Foundations

> **Goal:** Go from 'uses a computer' to 'runs infrastructure' — the durable, non-AI career lane.
> **Duration:** 1–10 · **Exit test:** Junior-ready checkpoint: a deployed, tested, containerized, auto-deployed repo; ~60–70% of entry-level interview topics.

---

### A01 🐧 Linux — the terminal is home

> **Mental model:** Everything is a file — processes, devices, configs are files; you manage the OS by managing files and permissions. The terminal is the interface.
> **Duration:** 1–3 · **Type:** foundation
>
> **Exit test:** You can ssh into a box and find, read, edit, and run something without asking anyone.
> **Start here:** no prerequisites — this is the path's entry point.

#### Core skills (the 20% that matters)

- **Navigation & file ops** — cd, ls, pwd, mkdir, rm, cp, mv, cat, less
  - 📚 [Linux Journey](https://linuxjourney.com/) · interactive · ✅ verified
  - 📚 [Ubuntu Command Line for Beginners](https://ubuntu.com/tutorials/command-line-for-beginners) · official-docs · 📖 official

- **Editing & searching** — nano/vim basics, grep, find
  - 📚 [Linux Journey (text-fu)](https://linuxjourney.com/) · interactive · ✅ verified
  - 📚 [MIT Missing Semester](https://missing.csail.mit.edu/) · course · 📖 official

- **Permissions** — rwx, chmod, chown; why 755 vs 644
  - 📚 [Linux Journey: Permissions](https://linuxjourney.com/lesson/file-permissions) · interactive · ✅ verified
  - 📚 [Ubuntu tutorial](https://ubuntu.com/tutorials/command-line-for-beginners) · official-docs · 📖 official

- **Processes** — ps, kill, top/htop; what a stuck process is and how to end it
  - 📚 [Linux Journey: Process Management](https://linuxjourney.com/lesson/process-management) · interactive · ✅ verified
  - 📚 [KodeKloud Linux Basics](https://kodekloud.com/courses/the-linux-basics-course/) · course · 📖 official

- **Installing software** — apt, package managers, sudo and why it matters
  - 📚 [Ubuntu tutorial](https://ubuntu.com/tutorials/command-line-for-beginners) · official-docs · 📖 official
  - 📚 [Linux Journey](https://linuxjourney.com/) · interactive · ✅ verified

- **SSH** — Connect to a remote box and work there
  - 📚 [Linux Journey: SSH](https://linuxjourney.com/lesson/ssh) · interactive · ✅ verified
  - 📚 [DigitalOcean SSH guide](https://www.digitalocean.com/community/tutorials/how-to-use-ssh-to-connect-to-a-remote-server) · community · 📖 official

##### Sub-topic research

**Interview focus:**

- Walk me through what happens when you type a command in a terminal — PATH lookup, fork/exec, stdin/stdout/stderr
- What's in /proc? How would you find a process listening on port 8080 and kill it safely?
- File permissions: what do 755, 644, and 4755 mean? What does umask do?
- Explain systemd: what does systemctl daemon-reload do and when do you need it? How do you follow logs for one unit?
- Disk full — how do you find the culprit (df, du, lsof deleted files) and free space without rebooting?

**Practice:** Daily: do 20–30 min in the terminal; weekly: reproduce an InterviewBit scenario (slow server, disk full, zombie) on your own VM and fix it, then write the bash commands from memory.

**Depth note:** This is the 20% that carries 80% of interviews — master the file/permission model, process model, systemd, and storage diagnosis cold before touching anything else.

#### Daily loop

- **30 minutes in the terminal** — 30 min/day doing real tasks — rename a folder with a loop, find every file containing a word, kill a stuck process. No GUI fallback.

##### Sub-topic research

**Interview focus:**

- What did you build/break/fix today? (expect a follow-up drill on any command you claim)
- Show me your shell history — what's your most-used command and why?
- What's the difference between a file you created yesterday and one created today when both have the same permissions?

**Practice:** Keep a daily log: 5 new commands learned, 1 thing automated, 1 thing fixed. Re-run the week's commands from memory on Sunday.

**Depth note:** The daily loop is the habit that makes Linux an instinct, not a skill — consistency here compounds faster than any course.

#### Module research

**Interview focus:**

- File system trivia: filename max 255 bytes, inode contents, /proc virtual FS, superblock/boot/data blocks
- Permissions: rwx for user/group/others, 755 vs 644, SUID(4000)/SGID(2000)/sticky bit(1000), umask
- Processes: states (new/ready/running/blocked/terminated), zombie vs orphan, init PID 1, daemons, fork() copy-on-write
- systemd: systemctl daemon-reload, journalctl -u <svc> -f, unit vs service, cgroups (CPUQuota/MemoryMax, cgroups v2, OOM killer)
- Disk: df -h, du -sh /*, lsof +L1, truncate to free deleted-file space; LVM lvextend/lvreduce; fstab; swap ~2x RAM
- Users: useradd -m -s /bin/bash, usermod -aG, /etc/passwd format, visudo, chage, /etc/security/limits.conf, ulimit -n
- Scheduling: crontab 5-field syntax, cron vs anacron, cron.allow/cron.deny
- Networking: ip netns namespaces, veth, docker0 bridge, CNI (Flannel/Calico); ss -tulnp vs netstat, TIME_WAIT
- Diagnosis: 7-step flow (ip addr show -> ping -> mtr -> nc -zv -> dig +short -> curl -v -> tcpdump); iperf3, ethtool
- SSH: ssh-keygen -t ed25519, ssh-copy-id, .ssh 700 / authorized_keys 600, ProxyJump, PasswordAuthentication no, -L/-R/-D tunnels
- Firewalls: iptables filter/nat/mangle + INPUT/OUTPUT/FORWARD, nftables, firewalld zones/services
- Scenario answers: slow server (top, vmstat 1 5, iostat -x 1 5, iotop, free -h, strace, perf top); memory hog (ps aux --sort=-%rss | awk '$6>1048576', kill -15 then -9)

**Demand:** Linux is the #1 screening topic for platform/DevOps roles in Pune and remote-India market (see marketData premiumSkills: systemd + troubleshooting appear in nearly every JD). 30-40% of a DevOps interview is Linux + shell. Salary uplift: candidates who nail diagnosis scenarios quote 15-25% above base.

**Verified resources:**

- ✅ [InterviewBit Linux Interview Questions](https://www.interviewbit.com/linux-interview-questions/) · interactive
- ✅ [InterviewBit Shell Scripting Interview Questions](https://www.interviewbit.com/shell-scripting-interview-questions/) · interactive
- ✅ [Linux Journey](https://linuxjourney.com/) · interactive
- 📖 [DigitalOcean Linux System Administration tutorials](https://www.digitalocean.com/community/tutorials?q=linux) · community

**Depth sequence:**

- Week 1: shell basics + file/permission model (rwx, umask, links) — daily terminal use, no GUI
- Week 2: processes, systemd units, journalctl, cron — automate one task per day
- Week 3: users/permissions hardening, sudoers, limits + cgroups
- Week 4: storage (df/du/LVM/fstab) + networking (ss, ip, tcpdump basics)
- Practice: reproduce the InterviewBit scenario questions (slow server, disk full, zombie) on your own VM; write a bash script that applies all hardening steps

**Certifications:**

- RHCSA / LFCS (optional — strong Linux-depth signal)

---

### A02 🔀 Git — snapshots & safety net

> **Mental model:** Snapshots of your project over time. Commits are checkpoints; branches are parallel timelines you merge back. Git exists so you can make a mess and always recover.
> **Duration:** Week 4 · **Type:** foundation
>
> **Exit test:** You can branch, make a mess, and recover with git reset and git stash without panic.
> **Start here:** no prerequisites — this is the path's entry point.

#### Core skills: the daily flow

- **Daily flow** — clone, add, commit, push, pull
  - 📚 [Git Immersion](https://gitimmersion.com/) · interactive · 📖 official
  - 📚 [GitHub Skills](https://skills.github.com/) · interactive · 📖 official

- **Branches & merging** — branch, checkout, merge; what a merge conflict is
  - 📚 [Oh My Git!](https://ohmygit.org/) · interactive · 📖 official
  - 📚 [Pro Git book](https://git-scm.com/book/en/v2) · book · 📖 official

- **Undoing mistakes** — reset, revert, stash, log, diff
  - 📚 [Git Immersion](https://gitimmersion.com/) · interactive · 📖 official
  - 📚 [Pro Git: Undoing](https://git-scm.com/book/en/v2/Git-Basics-Undoing-Things) · book · 📖 official

- **GitHub workflow** — Pushing to a repo, opening a pull request
  - 📚 [GitHub Hello World](https://docs.github.com/en/get-started/quickstart/hello-world) · official-docs · 📖 official
  - 📚 [GitHub Skills](https://skills.github.com/) · interactive · 📖 official

##### Sub-topic research

**Interview focus:**

- git status vs git diff vs git diff --staged — what does each show?
- Explain HEAD. What happens with git reset --hard vs git revert? When is revert the right choice for pushed work?
- You deleted a branch that had unmerged work — recover it. (reflog)
- What's a detached HEAD and how do you get out of it?
- Branch hygiene: git branch --merged, deleting local + remote branches, keeping a PR reviewable

**Practice:** Deliberately break a repo (bad merge, lost commit, detached HEAD) and recover each; write the recovery steps from memory; run the InterviewBit Git MCQs.

**Depth note:** Interviewers probe undo/recovery mechanics relentlessly — reset modes, revert, reflog, and cherry-pick are the highest-yield Git topics.

#### Daily loop

- **Commit everything** — Commit everything you do this week — every config, every script. add → commit → push at least once a day.

##### Sub-topic research

**Interview focus:**

- What did you commit today and why was it atomic?
- How do you structure a commit message a reviewer will thank you for?
- You just pushed a bad commit — walk me through your day's Git commands

**Practice:** Every coding session ends with clean, atomic commits + a short commit message; Sunday: recover a deliberately lost commit from memory.

**Depth note:** Daily Git practice builds the muscle memory interviewers test with live terminal questions.

#### Module research

**Interview focus:**

- Basics: repo, clone, git config levels (--system/--global/--local), git status vs git diff, index/staging area
- HEAD mechanics: HEAD~1, reset HEAD~3, reset --hard, revert --no-commit, detached HEAD (checkout -b)
- Recovery: reflog, recover deleted branch, revert bad pushed commit (new commit preferred), cherry-pick
- Branching: git branch --merged/--no-merged, delete local+remote branch, PR vs branch, Git vs GitHub
- History rewriting: squash via rebase -i HEAD~N, amend vs new commit (new commit safer), merge vs rebase (merge preferred, rebase destructive)
- Stash: apply vs pop (= apply + drop), when to stash
- Finding bugs: git bisect (start/bad/good), git annotate/blame
- Undo: reset --mixed, merge --abort, remove file from index (git reset + .gitignore)
- GitOps tie-in: why Git as single source of truth (audit trail, rollback anywhere) — foundation for B05

**Demand:** Git questions are universal and cheap to ask — expect 5-10 min in every round. Advanced recovery/reset/rebase questions separate mid-level from junior; strong GitOps story (Git as source of truth) maps directly to ArgoCD adoption in Indian product companies.

**Verified resources:**

- ✅ [InterviewBit Git Interview Questions](https://www.interviewbit.com/git-interview-questions/) · interactive
- 📖 [Git Handbook (GitHub Guides)](https://guides.github.com/introduction/git-handbook/) · official-docs
- 📖 [Pro Git book (free)](https://git-scm.com/book/en/v2) · book
- 📖 [Learn Git Branching (interactive)](https://learngitbranching.js.org/) · interactive

**Depth sequence:**

- Week 1: init/clone/add/commit/status/diff, branches, merge, PR flow (GitHub)
- Week 2: undo mechanics — reset (soft/mixed/hard), revert, stash, reflog recovery, detached HEAD
- Week 3: rebase -i squash, cherry-pick, bisect, .gitignore hygiene, commit hygiene (atomic commits)
- Practice: deliberately break a repo and recover it; write the 'lost branch' recovery from memory; run through all InterviewBit Git MCQs

---

### A03 🌐 Networking — IPs, ports, DNS, debug

> **Mental model:** Servers are IP:port. A web server is 192.168.1.5:80; DNS turns google.com into an IP. Everything you debug is 'can I reach that port?'.
> **Duration:** 5–6 · **Type:** foundation
>
> **Exit test:** You can classify any connection failure as DNS, dead server, or blocked port — using three commands.
> **Depends on:** A01 Linux

#### Core skills: ports, HTTP & diagnosis

- **Ports & protocols** — Know exactly four: 22 SSH, 80 HTTP, 443 HTTPS, 5432 Postgres
  - 📚 [freeCodeCamp: Computer Networking course](https://www.youtube.com/watch?v=qiQR5rTSshw) · video · 📖 official
  - 📚 [MDN HTTP Overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview) · official-docs · 📖 official

- **HTTP request/response** — Status codes (200/301/404/500), headers, JSON payloads
  - 📚 [MDN HTTP Overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview) · official-docs · 📖 official
  - 📚 [curl docs](https://curl.se/docs/) · official-docs · 📖 official

- **Diagnosing with curl** — curl -v shows the whole request/response; the debugger for 90% of problems
  - 📚 [curl docs](https://curl.se/docs/) · official-docs · 📖 official
  - 📚 [howdns.works](https://howdns.works/) · interactive · 📖 official

- **Host reachability** — ping, ss -tulpn (what's listening), nslookup (DNS lookup), telnet host port (raw port test)
  - 📚 [freeCodeCamp course](https://www.youtube.com/watch?v=qiQR5rTSshw) · video · 📖 official
  - 📚 [howdns.works](https://howdns.works/) · interactive · 📖 official

- **dig** — DNS lookup with full detail — TTL, record type, authoritative vs cached; the production upgrade from nslookup
  - 📚 [BIND 9 man pages: dig](https://bind9.readthedocs.io/en/latest/manpages.html#dig-dns-lookup-utility) · official-docs · 📖 official
- **mtr** — Combines ping + traceroute in real time; the right tool for intermittent latency
  - 📚 [mtr (official site)](https://www.bitwizard.nl/mtr/) · official-docs · 📖 official
- 🟡 **tcpdump** — Capture packets on the wire; the last-resort tool when nothing else shows what's happening
  - 📚 [Daniel Miessler: tcpdump primer](https://danielmiessler.com/blog/tcpdump) · community · ✅ verified

- **Error semantics** — 'connection refused' vs 'timeout' vs 'no route to host' mean different things; learn to read them
  - 📚 [freeCodeCamp course](https://www.youtube.com/watch?v=qiQR5rTSshw) · video · 📖 official
  - 📚 [curl docs](https://curl.se/docs/) · official-docs · 📖 official

##### Sub-topic research

**Interview focus:**

- What happens when you type https://example.com and press Enter — walk through all layers (DNS → TCP → TLS → HTTP)
- Ping works but the browser fails — how do you diagnose? Which layer is the problem?
- Explain the TCP handshake and how a firewall can break it; what are ephemeral ports?
- Ports: what's listening on 80/443/22/3306/6379 by default? How do you check and who listens where?
- CIDR: what does 192.168.1.0/24 mean? How many usable IPs? Do subnetting drills

**Practice:** Subnetting drills daily until 95%+ on subnettingpractice.com; build two VMs + a router, break connectivity at each layer, and fix it; explain the 7-step connectivity flow aloud.

**Depth note:** The 'ping works but HTTP fails' ladder is the single most asked diagnostic pattern — know exactly which layer each tool (ping, traceroute, ss, dig, curl -v) inspects.

#### Debug flow to internalize

- **Given 'my app won't connect'** — (1) is DNS resolving? (nslookup) → (2) is the host up? (ping) → (3) is the port open? (telnet) → (4) is my firewall/local port the issue? (ss -tulpn)

##### Sub-topic research

**Interview focus:**

- Your app is slow only for some users — walk me through your diagnostic order (latency vs throughput, network vs app)
- traceroute shows high latency at hop 3 — is that necessarily the router's fault?
- How do you check DNS resolution, then TCP reachability, then TLS, then the HTTP response — in order, with the right tools?

**Practice:** Rehearse the 7-step flow (local → DNS → TCP → TLS → HTTP → app → logs) until it's automatic; do one broken-network drill per week.

**Depth note:** This debug flow is the interview answer skeleton — a calm, layer-by-layer diagnostic is worth more than knowing any single tool.

#### Module research

**Interview focus:**

- Scope: PAN/LAN/MAN/WAN/GAN, network topologies, IPv4 classes A-E, private IPs (10/8, 172.16/12, 192.168/16, 127 loopback)
- Models: OSI 7 layers vs TCP/IP 4 layers, devices per layer (switch L2/MAC, router L3/IP, bridge)
- Delays: propagation vs transmission vs processing vs queueing
- Diagnostics: ping/TTL (Linux 64, Windows 128), traceroute, 'ping works but HTTP fails' = higher-layer issue
- TLS handshake: asymmetric -> symmetric key exchange, TLS 1.3; certificates
- VLAN 802.1Q + inter-VLAN routing; forward vs reverse proxy (Nginx/Cloudflare); port ranges (0-1023 well-known, 22/80/443/5432)
- Subnetting/CIDR: /24 = 254 usable, /25 split, VLSM
- NAT/PAT: SNAT vs DNAT, when each applies
- TCP: 3-way handshake (SYN/SYN-ACK/ACK), connection states (LISTEN, SYN-SENT, ESTABLISHED, FIN-WAIT...), SYN flood, FIN-ACK-FIN-ACK teardown
- IPv6: 128-bit, SLAAC, IPSec built-in, dual-stack, NAT64
- SRE crossover: DHCP/DNS/ARP mechanics, CDN, TCP state machine (appears in SRE interviews)

**Demand:** Networking is the most commonly under-prepared area — interviewers love it. Subnetting and TCP handshake are near-guaranteed questions; SNAT/DNAT and TLS handshake show depth. Strong networking = edge over 60% of candidates who skip it.

**Verified resources:**

- ✅ [InterviewBit Networking Interview Questions](https://www.interviewbit.com/networking-interview-questions/) · interactive
- 📖 [Computer Networking: A Top-Down Approach (Kurose & Ross)](https://gaia.cs.umass.edu/kurose_ross/index.php) · book
- 📖 [subnettingpractice.com (CIDR drills)](https://subnettingpractice.com/) · interactive
- 📖 [Practical Networking TLS handshake video series](https://www.practicalnetworking.net/series/packet-travels/tls-handshake/) · video

**Depth sequence:**

- Week 1: models, addressing (classes/private/CIDR), subnetting drills daily until instant
- Week 2: TCP/UDP mechanics, handshake/teardown, ports, NAT/PAT, DHCP/DNS/ARP
- Week 3: L2/L3 devices, VLANs, proxies, TLS handshake, IPv6
- Week 4: real diagnostics — build two VMs + one router on your laptop, break and fix connectivity
- Practice: complete subnettingpractice.com until 95%+; explain the 7-step connectivity flow aloud (interview-style)

---

### A04 🐳 Docker — 'works everywhere'

> **Mental model:** Code + OS + config bundled into one immutable unit. 'Works on my machine' dies. An image is a blueprint; a container is a running instance.
> **Duration:** 7–8 · **Type:** core
>
> **Exit test:** You can write a Dockerfile + docker-compose.yml for a small app from memory.
> **Depends on:** A01 Linux, A03 Networking

#### Core skills: run, build, stack

- **Run & manage** — docker run, ps, logs, exec, rm
  - 📚 [Docker Get Started](https://docs.docker.com/get-started/) · official-docs · 📖 official
  - 📚 [Play with Docker](https://labs.play-with-docker.com/) · interactive · 📖 official

- **Dockerfiles** — FROM, RUN, COPY, CMD; build with docker build -t myapp .
  - 📚 [Docker Get Started](https://docs.docker.com/get-started/) · official-docs · 📖 official
  - 📚 [Docker Curriculum](https://docker-curriculum.com/) · community · ✅ verified

- **Ports & volumes** — -p 8080:8080 exposes; -v mounts a folder so data survives
  - 📚 [Docker Get Started](https://docs.docker.com/get-started/) · official-docs · 📖 official
  - 📚 [Docker Curriculum](https://docker-curriculum.com/) · community · ✅ verified

- **Experimentation** — docker run -it --rm ubuntu bash; break things freely, they're throwaway
  - 📚 [Play with Docker](https://labs.play-with-docker.com/) · interactive · 📖 official
  - 📚 [Docker Get Started](https://docs.docker.com/get-started/) · official-docs · 📖 official

- **Compose (multi-service stacks)** — docker compose up; web server + database together in one YAML
  - 📚 [Docker Compose overview](https://docs.docker.com/compose/) · official-docs · 📖 official
  - 📚 [Docker Get Started](https://docs.docker.com/get-started/) · official-docs · 📖 official

##### Sub-topic research

**Interview focus:**

- Image vs container vs layer — what's the difference and what happens on docker run?
- CMD vs ENTRYPOINT, exec vs shell form — when does each matter?
- COPY vs ADD; why multi-stage builds? Why .dockerignore?
- How do namespaces and cgroups provide isolation? What can a container still see?
- docker run vs start vs exec vs attach — lifecycle states and when to use each

**Practice:** Containerize the A06 server-stats project with a multi-stage, non-root, healthchecked Dockerfile; run Docker Bench Security and fix findings; build a 3-service compose stack.

**Depth note:** Docker interviews hinge on the mental model (image vs container, isolation primitives) more than command trivia — nail the model first.

#### One-week project

- **Containerize a tiny web server** — python -m http.server is fine, then build a two-service stack — web server + Postgres — with a docker-compose.yml

##### Sub-topic research

**Interview focus:**

- Walk me through your compose stack — why those services, how do they talk, what survives a restart?
- Your container crashed at 3am — how do you find out why (logs, restart policy, healthcheck)?
- How would you ship this stack to a team — what's in the repo, what's in the docs?

**Practice:** Build one 3-service app (app+db+cache) with compose, depends_on + healthchecks, env overrides, named volumes; then re-create it from scratch on day 7 from memory.

**Depth note:** The one-week project converts Docker knowledge into a demo you can walk through — the basis of every later container story.

#### Module research

**Interview focus:**

- Architecture: 3 components (Client/Docker Host/Registry), daemon vs client, image vs container vs layer
- Dockerfile: FROM/LABEL/RUN/CMD, COPY vs ADD, CMD vs ENTRYPOINT (exec vs shell form), multi-stage builds, .dockerignore
- Lifecycle: created/running/paused/stopped/deleted; docker run vs start vs exec vs attach
- Isolation: namespaces (PID/Mount/User/Network/IPC/UTS), cgroups limits, no full isolation (shared kernel)
- Storage: volumes (-v, /var/lib/docker/volumes/), bind mounts, tmpfs, data persistence patterns
- Restart policies: no/on-failure/unless-stopped/always; exit codes
- Compose: up/run/start, depends_on ordering, environment overrides, docker-compose.{env}.yml, JSON compose (-f)
- Distribution: save/load vs push/pull, tags, registry vs repository
- Security (SRE crossover): content trust, resource limits, Docker Bench Security, minimal base images, non-root user
- Conceptual: virtualization vs containerization, Docker Swarm vs Kubernetes (one-line difference)

**Demand:** Docker is the must-have baseline — every Pune/remote JD lists it. Mid-level bar: you should be able to write a production Dockerfile (multi-stage, non-root, healthcheck) and debug container networking. Docker + compose is also the fastest path to portfolio demos for A06.

**Verified resources:**

- ✅ [InterviewBit Docker Interview Questions](https://www.interviewbit.com/docker-interview-questions/) · interactive
- 📖 [Docker official docs — Get Started](https://docs.docker.com/get-started/) · official-docs
- 📖 [Play with Docker (interactive sandbox)](https://labs.play-with-docker.com/) · interactive
- 📖 [Dockerfile best practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/) · official-docs

**Depth sequence:**

- Week 1: install, run/pull/exec/logs, image vs container mental model, volumes + restart policies
- Week 2: write real Dockerfiles — multi-stage, non-root, healthcheck; COPY vs ADD; .dockerignore
- Week 3: docker-compose for a 3-service app (app+db+cache), depends_on + healthchecks, env overrides
- Week 4: networking (bridge/host/none, user-defined networks), save/load, image layers & caching, security hardening
- Practice: containerize the A06 server-stats project; Docker Bench Security scan + fix findings

---

### A05 ⚡ CI/CD — automate every push

> **Mental model:** Every push runs a pipeline automatically: test → build → deploy, gated by tests. The magic is the gate — nothing deploys unless tests pass.
> **Duration:** 9–10 · **Type:** core
>
> **Exit test:** Your repo builds and tests itself on every push, and you can read a failing pipeline log.
> **Depends on:** A02 Git, A04 Docker

#### Core skills: triggers, jobs, gates

- **Anatomy of a pipeline** — Triggers, jobs, steps; on: [push] vs on: [pull_request]
  - 📚 [GitHub Actions docs](https://docs.github.com/en/actions) · official-docs · 📖 official
  - 📚 [GitHub Skills: GitHub Actions](https://skills.github.com/) · interactive · 📖 official

- **Write one workflow** — Checkout → run tests → build, on every push
  - 📚 [GitHub Actions docs](https://docs.github.com/en/actions) · official-docs · 📖 official
  - 📚 [GitHub Skills](https://skills.github.com/) · interactive · 📖 official

- **Gates** — The pipeline goes red on failure; that red is the feature
  - 📚 [GitHub Actions docs](https://docs.github.com/en/actions) · official-docs · 📖 official
  - 📚 [Awesome CI/CD](https://github.com/ciandcd/awesome-ciandcd) · community · 📖 official

- **Deploy step** — A job that ships the built artifact (Docker image) after tests pass
  - 📚 [GitHub Actions docs](https://docs.github.com/en/actions) · official-docs · 📖 official
  - 📚 [GitHub Skills](https://skills.github.com/) · interactive · 📖 official

- **Secrets in CI** — API keys, registry credentials; store in GitHub Secrets, never hardcode or log them; scope secrets to specific environments
  - 📚 [GitHub Actions: Using secrets](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions) · official-docs · 📖 official
  - 📚 [GitHub Actions: Security hardening](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions) · official-docs · 📖 official
- Design a pipeline for a web app: stages, caching, secrets, artifact promotion — what runs where and why?
- Blue/green vs canary vs rolling — tradeoffs and how you'd roll back each
- Your build is flaky — how do you make CI trustworthy (retries, quarantine, deterministic tests)?

**Practice:** Build a GitHub Actions pipeline (lint→test→build→push with caching + secrets) AND a Jenkins declarative pipeline from scratch; instrument both and write a blameless post-mortem for a fake failure.

**Depth note:** Pipeline design is the interview core — stage order, gate placement, and rollback strategy matter more than any specific tool.

#### Exit drill

- **Break it on purpose** — Push a deliberately broken change → pipeline goes red → read the log → fix → green. Repeat until it's boring.

##### Sub-topic research

**Interview focus:**

- Deploy a change to staging and production with a gate — walk me through the whole flow from commit to live
- Your production deploy broke everything — what's your rollback playbook (in order)?
- How do you prove the pipeline works — metrics, alerts, verification steps after deploy?

**Practice:** The exit drill: push a change → pipeline runs → manual gate → deploy → verify → rollback drill — done solo, timed, from memory.

**Depth note:** This drill is the A05 exit test and the template for every B05 production pipeline — practice it until it's one continuous flow.

#### On the radar: Jenkins & GitLab CI

GitHub Actions is the right learning tool for this phase — simple, free, no infrastructure. But the Indian enterprise market (TCS/Infosys/Accenture/Wipro) runs Jenkins and GitLab CI is a "core must-have" in most India JDs. Know they exist:

- **Jenkins awareness** — the dominant CI in Indian enterprises; declarative pipelines, master-agent model, plugins
  - 📚 [Jenkins docs](https://www.jenkins.io/doc/) · official-docs · ✅ verified
  - 📚 [Jenkins Pipeline tour](https://www.jenkins.io/doc/pipeline/tour/getting-started/) · official-docs · 📖 official

- **GitLab CI awareness** — `.gitlab-ci.yml`, runners, built-in registry & security; appears in most Indian mid-level JDs
  - 📚 [GitLab CI docs](https://docs.gitlab.com/ee/ci/) · official-docs · ✅ verified
  - 📚 [GitLab: first pipeline](https://docs.gitlab.com/ci/quick_start/) · official-docs · 📖 official

##### Sub-topic research

**Interview focus:**

- GitHub Actions vs Jenkins vs GitLab CI — what's different and when would a company use each?
- Jenkins master/agent: what does an agent run and why split from master?
- A company says "we use Jenkins" — what's your first question? (What version? Declarative or scripted? Where are the secrets?)

**Practice:** Read the Jenkins getting-started docs and run one Jenkinsfile locally via Docker; read one `.gitlab-ci.yml` in a public repo. Goal: recognize them in interviews, not master them (B05 does that).

**Depth note:** India enterprise hiring is Jenkins-heavy — being unable to read a Jenkinsfile at all is a visible gap. One read-through of the pipeline tour closes it.

#### Agile & delivery practice

- **Scrum essentials** — Sprints, stand-ups, backlog, retrospectives; where delivery cadence meets CI/CD
  - 📚 [The Scrum Guide](https://scrumguides.org/) · book · 📖 official
  - 📚 [Atlassian Agile Coach](https://www.atlassian.com/agile) · official-docs · 📖 official

- **Kanban & flow** — WIP limits, pull-based flow, lead time; when continuous flow beats sprints
  - 📚 [Atlassian: What is Kanban](https://www.atlassian.com/agile/kanban) · official-docs · 📖 official

- **Agile vs Waterfall vs DevOps** — Where DevOps fits in delivery culture; the ceremonies you'll actually attend
  - 📚 [Simplilearn: DevOps Engineer Skills (JD-derived)](https://www.simplilearn.com/devops-engineer-skills-article) · community · ✅ verified

##### Sub-topic research

**Interview focus:**

- Walk me through a sprint: what happens in planning, stand-up, review, retro — and where does the pipeline gate fit?
- Scrum vs Kanban — when would you choose each for a platform team?
- Your team has a 2-week release cadence but incidents weekly — how do you reconcile Agile with on-call?

**Practice:** Run a daily stand-up cadence on your own learning (blocker + plan + done); run one retrospective; map your A05 pipeline work to a Kanban board with WIP limits.

**Depth note:** Interviewers (esp. mid-level) test whether you can speak delivery culture, not just tools — sprint/retro/incident language shows you've operated in a team.

#### Module research

**Interview focus:**

- Culture: CAMS (Culture, Automation, Measurement, Sharing), Agile vs DevOps, 6 phases of DevOps lifecycle
- CI: build/test automation, continuous testing, shift-left testing, git hooks (pre-commit, pre-receive/update/post-receive)
- CD: continuous delivery vs continuous deployment (one explicit approval vs zero), deployment strategies (blue/green, canary, rolling)
- KPIs: deploy frequency, failed deployment %, MTTR/MTTD, change failure rate
- Jenkins: master-slave/agent model, plugins, $JENKINS_HOME/plugins, restart vs safeRestart, pipeline vs freestyle
- IaC tie-in: imperative vs declarative (Ansible/Terraform), config drift
- Anti-patterns: pipeline as snowflake, long-running builds, flaky tests, manual release steps, post-mortem blame culture
- Post-mortems: blameless, action items, incident timelines

**Demand:** CI/CD is the core of the DevOps role — expect scenario questions ('how would you roll out to production safely?'). Blue/green + canary answers earn senior-level credit. In remote-India market, GitHub Actions familiarity is increasingly expected alongside Jenkins.

**Verified resources:**

- ✅ [InterviewBit DevOps Interview Questions](https://www.interviewbit.com/devops-interview-questions/) · interactive
- 📖 [Jenkins official docs — Pipeline](https://www.jenkins.io/doc/book/pipeline/) · official-docs
- 📖 [GitHub Actions documentation](https://docs.github.com/en/actions) · official-docs
- 📖 [DORA State of DevOps Report](https://dora.dev/publications/) · community

**Depth sequence:**

- Week 1: CI concepts, git hooks, build+test a sample project in Jenkins and GitHub Actions
- Week 2: pipelines as code (Jenkinsfile, workflow YAML), stages, artifacts, caching, secrets
- Week 3: deployment strategies — implement blue/green + canary for a demo app; rollback drills
- Week 4: metrics + post-mortems — instrument your pipeline, write a blameless post-mortem for a fake incident
- Practice: the A06 github-actions-deployment project (888 starters) plus a Jenkins declarative pipeline from scratch

---

### A06 🏆 Capstone — a deployed, tested, automated stack

> **Mental model:** Bring it together: one small app, fully automated, deployed for free.
> **Duration:** Week 10 · **Type:** final
>
> **Exit test:** 'I can set up a Linux box, version my work with Git, debug network issues, run any app in Docker, and automate testing and deploying with CI/CD.'
> **Depends on:** A01 Linux, A02 Git, A03 Networking, A04 Docker, A05 CI/CD

#### The capstone

- **Bring it together** — One small app (any language) with: a Dockerfile + docker-compose.yml (web + Postgres); a **minimal test suite** (at least one unit test + one integration/smoke test — `pytest` for Python, `jest` for Node; the CI gate is only real when tests can fail); a GitHub repo with a CI workflow that runs tests on every push and goes red when they fail; a README that documents how to run it

- **One real-world variation** — Deploy it to a free tier (Railway/Render/Fly) with a health check — now it's not a tutorial, it's a portfolio piece
  - 📚 [Render free tier docs](https://render.com/docs/free) · official-docs · 📖 official
  - 📚 [Fly.io docs](https://fly.io/docs/) · official-docs · 📖 official
  - 📚 [Docker health checks](https://docs.docker.com/reference/compose-file/services/#healthcheck) · official-docs · 📖 official

- 🟡 **Community project ladder** — roadmap.sh beginner DevOps projects (community-tracked, difficulty-tagged — ~8K people started server-stats alone): server-stats, log archive tool, GitHub Pages deploy, basic Dockerfile, EC2 instance
  - 📚 [roadmap.sh DevOps projects](https://roadmap.sh/devops/projects) · community · ✅ verified
  - 📚 [server-stats](https://roadmap.sh/projects/server-stats) · community · ✅ verified
  - 📚 [log archive tool](https://roadmap.sh/projects/log-archive-tool) · community · ✅ verified
  - 📚 [basic Dockerfile](https://roadmap.sh/projects/basic-dockerfile) · community · ✅ verified

##### Sub-topic research

**Interview focus:**

- Walk me through your capstone: what it does, stack, how you'd scale it, what breaks first
- Why these projects in this order — what did each teach you?
- What would you change if you had another week? (looks for prioritization + judgment)

**Practice:** Do 2 beginner projects/week (server-stats → log-archive → basic-dockerfile → nginx-log-analyser), then github-actions-deployment → ec2-instance (real free tier) → static-site-server; finish with READMEs + diagrams + a 3-min walkthrough video.

**Depth note:** Quality over quantity: one fully-deployed, documented, automated project beats five half-finished ones in every interview.

#### Later — only when you hit the wall

> Rule: do NOT add these until the wall appears. The 5 core topics are the employable foundation; the rest compounds only when needed.

- **Kubernetes** — Start when "I have 5 servers" or "Docker alone isn't enough" becomes real.
  - 📚 [Kubernetes docs tutorials](https://kubernetes.io/docs/tutorials/) · official-docs · 📖 official
  - 📚 [k3s](https://k3s.io/) · official-docs · 📖 official
  - 📚 [KodeKloud](https://kodekloud.com/) · course · ❔ unverified

- **Terraform / Infrastructure as Code** — Start when "I keep setting up servers by hand" becomes real.
  - 📚 [Terraform docs](https://developer.hashicorp.com/terraform/docs) · official-docs · 📖 official
  - 📚 [KodeKloud](https://kodekloud.com/) · course · ❔ unverified

- **SRE depth** — SLOs, error budgets, incident response — the reliability math.
  - 📚 [Google SRE books (free)](https://sre.google/books/) · book · 📖 official
  - 📚 [Awesome SRE](https://github.com/dastergon/awesome-sre) · community · ❔ unverified

##### Sub-topic research

**Interview focus:**

- What's the trigger that tells you it's time to learn Kubernetes/Terraform/SRE? (looking for honest self-assessment)
- What did you build before learning it, and what problem did it solve?
- What's your learning order and why that order?

**Practice:** Don't front-load these — reach the wall (a deployment too slow to manage manually, a server you can't rebuild) first, then start the B-phase module that solves it.

**Depth note:** These three 'Later' items are the doorway into B01/B02/B06 — they're marked Later on purpose: context makes the learning 10x faster.

#### What this lands in your lap

> Total cost: $0 · Total time: ~8–10 weeks part-time · All links free & community/industry-preferred.

- **Terminal fluency** — The difference between "watching tutorials" and "working".

- **A versioned, tested, containerized, auto-deployed repo** — The portfolio piece.

- **The exact foundation of a junior platform/DevOps/SRE role** — ~60–70% of what entry-level interviews test.

- **A career lane that is not AI-dependent** — Compounds with AI when you later add the agent path.

##### Sub-topic research

**Interview focus:**

- Summarize this path in 60 seconds — what can you now do that you couldn't 10 weeks ago?
- Which 3 projects are your portfolio and why those?
- What's your honest level: what would you need to learn to be production-safe in a junior role?

**Practice:** Write a 1-page 'what I can do' summary; list the 3 portfolio projects with URLs; schedule the first entry-level applications.

**Depth note:** This sub-topic is the A-phase payoff — be able to claim each capability with a project behind it, never with words alone.

#### Module research

**Interview focus:**

- Be able to walk through every project: what it does, stack, how you'd scale it, what breaks
- server-stats (8,038 starters), log-archive-tool (2,031), basic-dockerfile (1,255), file-integrity-checker (1,168), github-actions-deployment (888), nginx-log-analyser (884), ssh-remote-server (595), ec2-instance (502), static-site-server (345), simple-monitoring/Netdata (328), basic-dns (262), dummy-systemd (203)
- Intermediate: pomodoro (601), configuration-management/Ansible (339), multi-container (260), automated-backups (132), dockerized-service (178), nodejs-service (149), iac-digitalocean (171), bastion-host (59), vpn-server (56)
- Advanced: blue-green (582), multiservice-docker (406), prometheus-grafana (296), service-discovery/Consul (253)
- Portfolio story: pick 1 from each tier, deploy to a real cloud, write README + architecture diagram

**Demand:** Live starter counts (roadmap.sh, fetched) show what recruiters actually search for: server-stats and log-archive dominate as screening demos; blue-green + prometheus-grafana signal seniority. A deployed portfolio (Github + live URL) is the single strongest interview artifact.

**Verified resources:**

- ✅ [roadmap.sh DevOps Projects](https://roadmap.sh/devops/projects) · interactive
- 📖 [roadmap.sh DevOps Roadmap](https://roadmap.sh/devops) · community
- ✅ [roadmap.sh Kubernetes Roadmap](https://roadmap.sh/kubernetes) · community
- ✅ [roadmap.sh AWS Roadmap](https://roadmap.sh/aws) · community

**Depth sequence:**

- Do 2 beginner projects per week in order: server-stats -> log-archive -> basic-dockerfile -> nginx-log-analyser
- Then: github-actions-deployment -> ec2-instance (real AWS free tier) -> static-site-server
- Then intermediate: configuration-management (Ansible) -> multi-container -> iac-digitalocean
- Then advanced: blue-green -> prometheus-grafana -> service-discovery (Consul)
- Finish: deploy all to one cluster/account, add README + diagrams, record a 3-min walkthrough video

---

## Phase B — Mid-Level Depth

> **Goal:** Go from 'junior foundation' to 'mid-level operator' — depth, judgment, ownership. The 3 shifts: junior does tasks, mid owns systems; junior knows tools, mid knows failure modes; junior follows runbooks, mid writes them.
> **Duration:** 11–22 (plus ongoing modules)

---

### B01 🐳 Kubernetes — operate, don't deploy

> **Mental model:** Not 'deployed once' — operates it daily. A junior knows what a pod is; a mid knows what a crash-looping pod is and how to fix it in 3 commands.
> **Duration:** Weeks 1–2 · **Type:** core
>
> **Exit test:** You can debug a crash-looping pod from a blank screen in under 10 minutes, and roll back a bad deploy without reading docs.
> **Depends on:** A04 Docker, A06 Capstone
> **Timing:** The "Weeks 1–2" figure covers the core kubectl + debugging loop only. Full depth (RBAC hardening, service mesh, operators, cluster backup) realistically takes 4–6 weeks part-time.

#### Workloads & objects

- **Workloads** — Deployments, StatefulSets, DaemonSets, Jobs/CronJobs; know which to reach for when
  - 📚 [Kubernetes Workloads](https://kubernetes.io/docs/concepts/workloads/) · official-docs · 📖 official
  - 📚 [Kubernetes Concepts](https://kubernetes.io/docs/concepts/) · official-docs · 📖 official

- **Networking objects** — Services (ClusterIP/NodePort/LoadBalancer), Ingress + controllers, TLS termination
  - 📚 [Kubernetes Services & Networking](https://kubernetes.io/docs/concepts/services-networking/) · official-docs · 📖 official
  - 📚 [Kubernetes Tutorials](https://kubernetes.io/docs/tutorials/) · official-docs · 📖 official

- **Config & storage** — ConfigMaps, Secrets, PVCs/PVs; ephemeral vs persistent
  - 📚 [Kubernetes: Persistent Volumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/) · official-docs · 📖 official
  - 📚 [Kubernetes Concepts](https://kubernetes.io/docs/concepts/) · official-docs · 📖 official

- **Namespaces & labels** — Organizing, multi-tenancy basics, label selectors
  - 📚 [Kubernetes: Namespaces](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/) · official-docs · 📖 official
  - 📚 [kubectl Cheatsheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/) · official-docs · ✅ verified

##### Sub-topic research

**Interview focus:**

- Pod vs Deployment vs StatefulSet vs DaemonSet vs Job/CronJob — when do you choose each?
- What are init containers for? Give a real example.
- requests vs limits — what's the QoS model and what happens when a pod exceeds its limits?
- A pod is CrashLoopBackOff — walk me through your diagnosis (describe, events, logs, probes)

**Practice:** Create each workload type on minikube; break a Deployment (bad image, bad probe) and fix via kubectl describe + logs; convert a Deployment to a StatefulSet with a PVC.

**Depth note:** Workload selection is the #1 K8s interview question family — know the controller's contract (ordering, identity, scheduling) not just the name.

#### Operating the cluster

- **The daily commands** — kubectl get/describe/logs/exec/port-forward, -o yaml, contexts (config use-context)
  - 📚 [kubectl Cheatsheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/) · official-docs · ✅ verified

- **Node operations** — cordon, drain, uncordon, taints & tolerations; maintenance without downtime
  - 📚 [kubectl Cheatsheet: Nodes](https://kubernetes.io/docs/reference/kubectl/cheatsheet/) · official-docs · ✅ verified
  - 📚 [Kubernetes: Taints & Tolerations](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/) · official-docs · 📖 official

- **Rolling deploy + rollback from muscle memory** — rollout status, rollout undo, --record
  - 📚 [kubectl Cheatsheet: Updating resources](https://kubernetes.io/docs/reference/kubectl/cheatsheet/) · official-docs · ✅ verified
  - 📚 [Kubernetes: Rolling updates](https://kubernetes.io/docs/tutorials/kubernetes-basics/update/update-intro/) · official-docs · 📖 official

- **Helm** — Package apps as charts; helm install/upgrade/rollback
  - 📚 [Helm docs](https://helm.sh/docs/) · official-docs · 📖 official
  - 📚 [Kubernetes Tutorials](https://kubernetes.io/docs/tutorials/) · official-docs · 📖 official

- **etcd backup & restore** — etcdctl snapshot save/restore; backup frequency; store snapshots safely off-cluster
  - 📚 [Kubernetes: Configure etcd (backup)](https://kubernetes.io/docs/tasks/administer-cluster/configure-upgrade-etcd/) · official-docs · 📖 official

##### Sub-topic research

**Interview focus:**

- Control plane vs nodes — name the components and what each does (apiserver, scheduler, controller-manager, etcd | kubelet, kube-proxy, runtime)
- What does cordon + drain do and why use a PodDisruptionBudget first?
- Taints & tolerations vs nodeSelector vs nodeAffinity — when is each appropriate?
- A node is unhealthy — how do you detect it and evacuate workloads safely?
- Cluster upgrades: how would you upgrade a self-managed cluster without downtime?
- etcd backup & restore — how do you snapshot etcd and restore a cluster from it (etcdctl snapshot save/restore, frequency, off-cluster storage)?

**Practice:** Practice maintenance drills: cordon/drain/uncordon a node with a PDB in place; add taints/tolerations; schedule a pod with nodeAffinity and verify placement.

**Depth note:** Operators are hired to keep clusters healthy, not to deploy apps — maintenance commands and their failure modes are the interview meat.

#### Debugging & failure modes

- **The four horsemen** — OOMKilled, ImagePullBackOff, CrashLoopBackOff, node pressure; kubectl describe + logs --previous are your first two moves
  - 📚 [Kubernetes: Debugging](https://kubernetes.io/docs/tasks/debug/) · official-docs · 📖 official
  - 📚 [kubectl Cheatsheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/) · official-docs · ✅ verified

- **Debug in-place** — exec, ephemeral containers, port-forward, kubectl top for live metrics
  - 📚 [kubectl Cheatsheet: Interacting with pods](https://kubernetes.io/docs/reference/kubectl/cheatsheet/) · official-docs · ✅ verified
  - 📚 [Kubernetes: Debug](https://kubernetes.io/docs/tasks/debug/) · official-docs · 📖 official

##### Sub-topic research

**Interview focus:**

- Pod stuck Pending — enumerate every cause and how you'd confirm each (describe events first)
- ImagePullBackOff vs CrashLoopBackOff vs OOMKilled — distinct diagnoses for each
- Service not reachable from outside — check ordering: pod → endpoints → service → ingress → DNS → security group
- How do you debug DNS inside the cluster (CoreDNS, nslookup, /etc/resolv.conf)?

**Practice:** Intentionally break deployments (bad image, missing configmap, wrong selector, probe timeout) and fix each; time yourself and write the diagnosis order on a card.

**Depth note:** Troubleshooting questions outnumber definition questions in CKA-style interviews — practice the describe→logs→events ladder until it's reflexive.

#### Scheduling & resources

- **Requests & limits** — How the scheduler places pods; QoS classes (Guaranteed/Burstable/BestEffort)
  - 📚 [Kubernetes: Managing resources](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/) · official-docs · 📖 official
  - 📚 [Kubernetes Concepts](https://kubernetes.io/docs/concepts/) · official-docs · 📖 official

- **Scaling** — HPA (Horizontal Pod Autoscaler) basics, kubectl scale
  - 📚 [Kubernetes: HPA](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/) · official-docs · 📖 official
  - 📚 [kubectl Cheatsheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/) · official-docs · ✅ verified

- 🟡 **VPA & cluster autoscaling** — Vertical Pod Autoscaler (right-size requests) + Cluster Autoscaler/Karpenter (scale nodes); the full autoscaling story beyond HPA
  - 📚 [Kubernetes: VPA](https://kubernetes.io/docs/concepts/workloads/autoscaling/vertical-pod-autoscale/) · official-docs · 📖 official
  - 📚 [Karpenter](https://karpenter.sh/) · official-docs · 📖 official
  - 📚 [Cluster Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler) · official-docs · 📖 official

- **Pod Disruption Budgets** — Protect availability during drains/upgrades; minAvailable/maxUnavailable
  - 📚 [Kubernetes: Configure PDBs](https://kubernetes.io/docs/tasks/run-application/configure-pdb/) · official-docs · 📖 official
  - 📚 [Kubernetes: Disruptions](https://kubernetes.io/docs/concepts/workloads/pods/disruptions/) · official-docs · 📖 official

- **ResourceQuota & LimitRange** — Namespace-level governance; stop one team eating the whole cluster
  - 📚 [Kubernetes: ResourceQuota](https://kubernetes.io/docs/concepts/policy/resource-quotas/) · official-docs · 📖 official
  - 📚 [Kubernetes: LimitRange](https://kubernetes.io/docs/concepts/policy/limit-range/) · official-docs · 📖 official

- 🟡 **Advanced scheduling** — Topology Spread Constraints, Pod Priorities, node affinity/selectors, evictions; placement control beyond the basics
  - 📚 [Kubernetes: Topology Spread Constraints](https://kubernetes.io/docs/concepts/scheduling-eviction/topology-spread-constraints/) · official-docs · 📖 official
  - 📚 [Kubernetes: Assigning pods to nodes](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/) · official-docs · 📖 official

##### Sub-topic research

**Interview focus:**

- How does the scheduler pick a node — filtering, scoring, and what data does it use?
- Why is a pod stuck Pending — top causes and how events reveal the answer
- HPA vs VPA vs Cluster Autoscaler vs Karpenter — what does each scale and what are the limits?
- requests vs limits: why set requests low but limits high, or match them? What breaks if you omit them?
- Topology Spread Constraints and node affinity — when do you need them?

**Practice:** Deploy HPA + VPA side by side; drive load with a load generator and watch replica count and node scaling; simulate a Pending pod and explain the events.

**Depth note:** The autoscaling stack (HPA/VPA/CA/Karpenter) is where platform engineers earn their keep — know the division of labor cold.

#### Security & RBAC

- **RBAC** — ServiceAccounts, Roles/RoleBindings vs ClusterRoles; least-privilege default
  - 📚 [Kubernetes: RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) · official-docs · 📖 official
  - 📚 [Kubernetes: RBAC good practices](https://kubernetes.io/docs/concepts/security/rbac-good-practices/) · official-docs · 📖 official

- **Pod security** — securityContext, runAsNonRoot, Pod Security Standards
  - 📚 [Kubernetes: Pod Security Standards](https://kubernetes.io/docs/concepts/security/pod-security-standards/) · official-docs · 📖 official
  - 📚 [Kubernetes Concepts](https://kubernetes.io/docs/concepts/) · official-docs · 📖 official

##### Sub-topic research

**Interview focus:**

- How do RBAC roles, RoleBindings, ClusterRoles, and ClusterRoleBindings differ? Give a least-privilege example
- ServiceAccounts: why do pods need one and what happens with automountServiceAccountToken?
- Pod Security Standards (baseline vs restricted) — how do you enforce them?
- Secrets: how are they stored in etcd and what are the real-world options (encryption at rest, External Secrets)?

**Practice:** Create a least-privilege RBAC policy for a CI pipeline (read pods/logs in one namespace); enable PSS restricted on a namespace and fix a violating pod; explore kubectl auth can-i.

**Depth note:** RBAC + ServiceAccounts + PSS are the 3 security questions that recur in every platform interview — least privilege is the answer theme.

#### Network policies & service mesh

- **NetworkPolicies** — Default-deny thinking; CNI support (Calico/Cilium); micro-segmentation between pods
  - 📚 [Kubernetes: Network Policies](https://kubernetes.io/docs/concepts/services-networking/network-policies/) · official-docs · 📖 official
  - 📚 [Cilium docs](https://docs.cilium.io/) · official-docs · 📖 official

- 🟡 **Service mesh** — Istio/Linkerd: mTLS, traffic shifting, retries at the mesh level (a ~+30% premium skill per India market data)
  - 📚 [Istio docs](https://istio.io/latest/docs/) · official-docs · ✅ verified
  - 📚 [Linkerd docs](https://linkerd.io/2.16/overview/) · official-docs · 📖 official
  - 📚 [Kubernetes: Services & Networking](https://kubernetes.io/docs/concepts/services-networking/) · official-docs · 📖 official

##### Sub-topic research

**Interview focus:**

- How do NetworkPolicies work — pod selectors, ingress/egress, default-deny vs allow-all?
- Istio vs Linkerd: sidecar model, mTLS, traffic shifting — when would you adopt a mesh?
- What's the cost of a service mesh (latency, ops, resource)? When is it overkill?
- How do you enforce 'no pod-to-pod except API' with NetworkPolicies?

**Practice:** Write a default-deny + allow-API NetworkPolicy and verify with a probe pod; install Linkerd, enable mTLS and inspect the mesh dashboard; shift traffic 10/90.

**Depth note:** NetworkPolicy is mandatory baseline; service mesh is the ~30% premium skill — know both, and know when the mesh is the wrong answer.

#### Extensions & the Operator pattern

- 🟡 **CRDs & Operators** — Why Argo CD, Kyverno, Prometheus Operator all work: they're just controllers watching custom resources; this mental model unlocks every cloud-native tool
  - 📚 [Kubernetes: Custom Resources](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) · official-docs · 📖 official
  - 📚 [Operator pattern](https://kubernetes.io/docs/concepts/extend-kubernetes/operator/) · official-docs · 📖 official

- 🟡 **Managed vs self-managed + multi-cluster** — The judgment call every platform team faces; EKS/AKS/GKE vs kubeadm; multi-cluster via Argo CD / Cluster API
  - 📚 [Cluster API](https://cluster-api.sigs.k8s.io/) · official-docs · 📖 official
  - 📚 [AWS EKS docs](https://docs.aws.amazon.com/eks/) · official-docs · 📖 official

##### Sub-topic research

**Interview focus:**

- What is a CRD and how does the Operator pattern extend Kubernetes?
- Explain the reconcile loop — what does the controller do when desired != current?
- Give examples of well-known Operators (Prometheus, ArgoCD, cert-manager) and what they automate
- When would you write an Operator vs use plain manifests + ArgoCD?

**Practice:** Install cert-manager or Prometheus Operator on minikube; create a CR and watch the controller reconcile; read one Operator's code path (e.g., a simple sample-operator).

**Depth note:** Operators are how everything in B05/B08 gets installed — the mental model (declarative desired state + reconcile loop) unlocks ArgoCD, Kyverno, Prometheus-Operator.

#### Practice environment

- **Local cluster** — kind or k3s; the whole mid-level set runs on a laptop
  - 📚 [kind](https://kind.sigs.k8s.io/) · official-docs · 📖 official
  - 📚 [k3s](https://k3s.io/) · official-docs · 📖 official

##### Sub-topic research

**Interview focus:**

- minikube vs kind vs a managed cluster (EKS/AKS/GKE) — when would you choose each?
- How do you keep a local cluster from eating your laptop (resources, ephemeral)?
- What's the fastest way to recreate a clean cluster for an experiment?

**Practice:** Run minikube AND kind locally; destroy/recreate both; then stand up one managed cluster (EKS free tier or AKS) and run the same workloads on it.

**Depth note:** The environment is the multiplier — the CKA/CKAD labs are the gold standard practice, and the managed cluster is where B03/B05 skills meet.

#### Module research

**Interview focus:**

- Control plane vs nodes: apiserver, scheduler, controller-manager, etcd | kubelet, kube-proxy, container runtime
- Workloads: Pod vs Deployment vs StatefulSet vs DaemonSet vs Job/CronJob; init containers; requests vs limits (QoS)
- Scheduling: nodeName vs nodeSelector vs nodeAffinity; why a pod stays Pending (kubectl describe, events)
- Maintenance: cordon/drain (PDB minAvailable), taints/tolerations
- Networking: service types (ClusterIP/NodePort/LoadBalancer), Ingress (L7, default backend, TLS secretName), NetworkPolicies
- Storage: PVC/PV/StorageClass, CSI, emptyDir vs hostPath vs volumes
- Config: ConfigMap vs Secret, secretKeyRef, envFrom
- Logging: node agent vs sidecar, EFK/ELK stack
- Monitoring: Prometheus (server, client libraries, pushgateway, exporters, alertmanager), Grafana
- Security: RBAC, namespaces (blue/green, multi-team), admission controllers, audit logs, PodSecurity
- Operators: custom resources + control loops; controller pattern
- Concepts: Docker Swarm vs K8s, imperative vs declarative (kubectl apply), self-healing/reconciliation
- Service mesh: Istio/Linkerd — sidecar injection, mTLS, traffic routing/shift; when a mesh beats NetworkPolicies alone (~+30% premium skill in India data)
- Autoscaling: HPA (metrics-driven) vs VPA (recommender) vs Cluster Autoscaler vs Karpenter — which layer handles what
- ServiceAccounts: how pods authenticate to the API server, RBAC rolebinding, securityContext + Pod Security Standards
- Practice environments: minikube vs kind vs k3s vs managed (EKS/AKS/GKE) — why a real cluster beats a playground
- Operator pattern deep: CRDs (custom resource definitions), controller reconcile loop, Operator SDK; real examples (Prometheus Operator, Argo CD, Kyverno)

**Demand:** Kubernetes is the #1 premium skill in the mid-level market (see marketData.premiumSkills). Expect a dedicated K8s round: architecture + troubleshooting (Pending/CrashLoopBackOff) are the most-asked. CKA-style hands-on is a differentiator for remote India roles.

**Verified resources:**

- ✅ [InterviewBit Kubernetes Interview Questions](https://www.interviewbit.com/kubernetes-interview-questions/) · interactive
- 📖 [Kubernetes official docs — Concepts](https://kubernetes.io/docs/concepts/) · official-docs
- 📖 [Killercoda interactive K8s playground](https://killercoda.com/) · interactive
- ✅ [roadmap.sh Kubernetes Roadmap](https://roadmap.sh/kubernetes) · community

**Depth sequence:**

- Week 1: architecture + kubectl basics — run pods, deployments, services, expose an app
- Week 2: scheduling + workloads — StatefulSet/DaemonSet/Job, requests/limits, taints, cordon/drain with PDB
- Week 3: config+storage+networking — ConfigMaps/Secrets, PVC, Ingress, NetworkPolicies
- Week 4: troubleshooting drills — intentionally break deployments, fix Pending/CrashLoopBackOff/OOMKilled via describe + logs
- Week 5+: operators, RBAC hardening, Prometheus/Grafana on cluster, ArgoCD (ties to B05)
- Practice environment: run minikube AND kind locally, then one managed cluster (EKS/AKS free tier) — do every drill on a real cluster
- Week 4+: add a service mesh lab (Istio or Linkerd) — install, observe mTLS, traffic split for canary

**Certifications:**

- CKA (Certified Kubernetes Administrator) — after B01; ~+15-25% per marketData
- CKAD (optional — app-developer flavor, lighter on cluster ops)

---

### B02 🏗️ Terraform & IaC — state & modularity

> **Mental model:** Terraform's power and its curse is state — the record of what exists. Mid-level is when you stop fighting state and start managing it: remote, locked, planned.
> **Duration:** Weeks 3–4 · **Type:** core
>
> **Exit test:** You can refactor a monolith main.tf into modules, move state to remote, and safely import an existing resource — without terraform destroy as your only undo.
> **Depends on:** A01 Linux, A03 Networking, A06 Capstone

#### Core language

- **Blocks & providers** — Provider config, resource/data blocks, provider version pinning
  - 📚 [Terraform: Language](https://developer.hashicorp.com/terraform/language) · official-docs · 📖 official
  - 📚 [Terraform Tutorials](https://developer.hashicorp.com/terraform/tutorials) · official-docs · ✅ verified

- **Variables, outputs, locals** — Parameterize everything; no hardcoded values; tfvars for environments
  - 📚 [Terraform: Values](https://developer.hashicorp.com/terraform/language/values) · official-docs · 📖 official
  - 📚 [Terraform: Language](https://developer.hashicorp.com/terraform/language) · official-docs · 📖 official

- **Expressions & meta-arguments** — for_each/count, depends_on, dynamic blocks
  - 📚 [Terraform: Expressions](https://developer.hashicorp.com/terraform/language/expressions) · official-docs · 📖 official
  - 📚 [Terraform: Meta-arguments](https://developer.hashicorp.com/terraform/language/meta-arguments/for_each) · official-docs · 📖 official

- 🟡 **OpenTofu** — The open-source fork of Terraform (HashiCorp relicensed to BSL in 2023); drop-in compatible, community-preferred where licensing matters
  - 📚 [OpenTofu docs](https://opentofu.org/docs/) · official-docs · ✅ verified
  - 📚 [Terraform: Language](https://developer.hashicorp.com/terraform/language) · official-docs · 📖 official

- 🟡 **Pulumi awareness** — TypeScript/Python-native IaC; real programming languages instead of HCL; increasingly in product-company JDs
  - 📚 [Pulumi docs](https://www.pulumi.com/docs/) · official-docs · 📖 official

- 🟡 **AWS-native IaC awareness** — CloudFormation & AWS CDK: many AWS-heavy Indian shops never touch Terraform; know enough to read and extend
  - 📚 [AWS CloudFormation docs](https://docs.aws.amazon.com/cloudformation/) · official-docs · 📖 official
  - 📚 [AWS CDK docs](https://docs.aws.amazon.com/cdk/) · official-docs · 📖 official

##### Sub-topic research

**Interview focus:**

- Walk me through write → plan → apply — what happens at each step and what can go wrong?
- provider vs resource vs data source vs variable vs output — the dependency graph between them
- Terraform vs OpenTofu: what changed after the BSL relicensing and why does it matter?
- Pulumi vs Terraform — what does IaC in a real programming language (TypeScript/Python) give you, and when would you choose it?
- How does Terraform know what to change (state diff)? What does plan output actually tell you?

**Practice:** Provision a VPC + EC2 (or AKS/EKS) purely from a .tf file with variables + outputs; run fmt/validate before every apply; destroy and recreate to prove reproducibility.

**Depth note:** The write→plan→apply mental model is the interview core — practice explaining each phase aloud with the state file as the connective tissue.

#### State management

- **Remote state + locking** — State in S3/GCS/Terraform Cloud; plan before apply is a habit
  - 📚 [Terraform: State](https://developer.hashicorp.com/terraform/language/state) · official-docs · 📖 official
  - 📚 [Terraform Tutorials: cloud-get-started](https://developer.hashicorp.com/terraform/tutorials/cloud-get-started) · official-docs · 📖 official

- **State surgery** — Drift, import, state mv/rm; when the real world diverges from config
  - 📚 [Terraform: CLI state commands](https://developer.hashicorp.com/terraform/cli/commands/state) · official-docs · 📖 official
  - 📚 [Terraform: Import](https://developer.hashicorp.com/terraform/cli/import) · official-docs · 📖 official

- **Workspaces** — Separating environments (dev/stage/prod) on one config
  - 📚 [Terraform: Workspaces](https://developer.hashicorp.com/terraform/language/state/workspaces) · official-docs · 📖 official
  - 📚 [Terraform: State](https://developer.hashicorp.com/terraform/language/state) · official-docs · 📖 official

##### Sub-topic research

**Interview focus:**

- What is terraform state and why does it matter? What breaks if you lose it?
- Remote backend: S3 + DynamoDB locking — what does each provide and why both?
- When do you use terraform import vs state rm vs state mv? Give real scenarios
- Sensitive state: how do you keep secrets out of the state file and plan output?

**Practice:** Migrate a local-state project to S3 + DynamoDB locking; simulate a corrupted state file and recover; import an existing resource and fold it into your config.

**Depth note:** State questions separate juniors from mid-levels — locking, import, and recovery are the interview winners.

#### Modules & reuse

- **Write modular, reusable config** — Modules with inputs/outputs, not one giant main.tf
  - 📚 [Terraform: Modules](https://developer.hashicorp.com/terraform/language/modules) · official-docs · 📖 official
  - 📚 [Terraform Tutorials](https://developer.hashicorp.com/terraform/tutorials) · official-docs · ✅ verified

- **Module registry & versioning** — Local vs registry modules; pin versions
  - 📚 [Terraform: Module sources](https://developer.hashicorp.com/terraform/language/modules/sources) · official-docs · 📖 official
  - 📚 [Terraform Registry](https://registry.terraform.io/) · official-docs · 📖 official

- 🟡 **Terragrunt** — The DRY wrapper teams love: tiny module calls, per-environment state config; 'have you seen it' interview knowledge
  - 📚 [Terragrunt docs](https://terragrunt.gruntwork.io/docs/) · official-docs · 📖 official
  - 📚 [Terraform: Modules](https://developer.hashicorp.com/terraform/language/modules) · official-docs · 📖 official

##### Sub-topic research

**Interview focus:**

- What makes a good module — inputs, outputs, versioning, and when is a module overkill?
- How do you version modules (registry, Git tags) and pin them safely?
- count vs for_each — when each, and how do you reference their resources?
- How do you share modules across teams without publishing publicly?

**Practice:** Write one module (e.g., vpc or eks) and consume it from two different root configs; version it with a Git tag; refactor a duplicated config into modules.

**Depth note:** Module design (small inputs, rich outputs, explicit versioning) is the mid-level Terraform interview test.

#### Plan/apply discipline

- **Plan reading** — A terraform plan that shows only the intended diff; knowing when a diff is suspicious
  - 📚 [Terraform: Plan](https://developer.hashicorp.com/terraform/cli/commands/plan) · official-docs · 📖 official
  - 📚 [Terraform Tutorials](https://developer.hashicorp.com/terraform/tutorials) · official-docs · ✅ verified

- **Lifecycle guards** — lifecycle block, prevent_destroy, create_before_destroy; safe destruction
  - 📚 [Terraform: Lifecycle](https://developer.hashicorp.com/terraform/language/meta-arguments/lifecycle) · official-docs · 📖 official
  - 📚 [Terraform: Language](https://developer.hashicorp.com/terraform/language) · official-docs · 📖 official

- 🟡 **IaC quality gates** — fmt/validate/tflint in CI, checkov/terrascan security scanning, terraform test; DevSecOps wants misconfig caught before apply
  - 📚 [Terraform: CLI commands](https://developer.hashicorp.com/terraform/cli/commands) · official-docs · 📖 official
  - 📚 [Checkov](https://www.checkov.io/) · official-docs · 📖 official
  - 📚 [Terraform: Test](https://developer.hashicorp.com/terraform/language/tests) · official-docs · 📖 official

- 🟡 **Infracost** — Cost estimation for Terraform plans; CI integration shows $ impact per PR before apply
  - 📚 [Infracost docs](https://www.infracost.io/docs/) · official-docs · 📖 official

##### Sub-topic research

**Interview focus:**

- What checks run before apply in a good pipeline (fmt, validate, plan review, tflint, checkov)?
- Infracost — how do you estimate a plan's cost before apply and gate expensive changes in CI?
- Someone ran apply directly against prod — how do you prevent it (state locking, approval, plan-as-code)?
- What's the difference between apply -replace and taint, and why is -replace preferred?
- Drift: someone changed infra in the console — how do you detect and reconcile it?

**Practice:** Wire terraform fmt --check + validate + plan into a CI pipeline with a human approve gate; trigger drift manually and reconcile via plan/apply; practice apply -replace.

**Depth note:** The discipline (plan review + gates + drift handling) is what makes Terraform safe at work — interviewers probe it to gauge production-readiness.

#### Module research

**Interview focus:**

- Core workflow: write -> plan -> apply; providers, resources, data sources
- Commands: init/validate/plan/apply/destroy/fmt; apply -replace (preferred over deprecated taint)
- State: tfstate, remote backend (S3 + DynamoDB locking), state file locking, sensitive state, refresh vs plan
- Modules: terraform-<PROVIDER>-<NAME> naming, registry, outputs -> variables wiring, versioning
- Idempotency/rollback: recommit old code (Terraform has no built-in rollback), import existing resources
- Advanced: null_resource, count vs for_each, terraform_workspace vs terraform_remote_state, Terragrunt (DRY, immutable versioned modules)
- Comparisons: vs Ansible (provision vs config, declarative vs procedural), vs CloudFormation (multi-cloud, HCL vs JSON/YAML, state)
- Terraform Cloud/Enterprise: workspaces, policy-as-code (Sentinel/OPA), runs, VCS-driven
- Request flow architecture: CLI -> provider -> API; graph execution, parallelism

**Demand:** Terraform is co-listed with Kubernetes in most senior JDs. State management + modules + backend questions are the differentiator. Terragrunt knowledge gives strong bonus points in product companies running multi-env IaC.

**Verified resources:**

- ✅ [InterviewBit Terraform Interview Questions](https://www.interviewbit.com/terraform-interview-questions/) · interactive
- 📖 [Terraform official docs — Intro](https://developer.hashicorp.com/terraform/docs) · official-docs
- 📖 [KodeKloud Terraform course](https://kodekloud.com/) · course
- 📖 [Terraform Registry](https://registry.terraform.io/) · official-docs

**Depth sequence:**

- Week 1: providers, resources, plan/apply/destroy; variable + output basics; terraform fmt/validate
- Week 2: state + remote backends (S3+DynamoDB), locking, import, state move/rm
- Week 3: modules — write and publish one; count/for_each; data sources; workspaces
- Week 4: real infra — provision a VPC+EC2 or AKS/EKS cluster via modules; destroy/recreate
- Practice: iac-digitalocean project (roadmap.sh) then rewrite as modular code; simulate a broken state file and recover

**Certifications:**

- HashiCorp Certified: Terraform Associate

---

### B03 ☁️ Cloud (AWS) — VPC, IAM, cost

> **Mental model:** One primary cloud (usually AWS). Not 'click in the console' — infrastructure as components you can describe and secure: VPC, subnets, security groups, IAM.
> **Duration:** Weeks 5–6 · **Type:** core
>
> **Exit test:** You can describe your architecture in terms of VPC/subnet/security-group, and explain who can access what (IAM) without guessing.
> **Depends on:** A01 Linux, A03 Networking, A04 Docker

#### Compute & storage

- **Compute** — EC2 (instances, AMIs, key pairs), EBS volumes; knowing the free tier boundaries
  - 📚 [AWS EC2 docs](https://docs.aws.amazon.com/ec2/) · official-docs · 📖 official
  - 📚 [AWS Free Tier](https://aws.amazon.com/free/) · official-docs · 📖 official

- **Object storage** — S3 (buckets, versioning, lifecycle, buckets-as-backends)
  - 📚 [AWS S3 docs](https://docs.aws.amazon.com/s3/) · official-docs · 📖 official
  - 📚 [AWS Well-Architected](https://docs.aws.amazon.com/wellarchitected/) · official-docs · 📖 official

- **Managed databases** — RDS (Postgres/MySQL), backups, multi-AZ
  - 📚 [AWS RDS docs](https://docs.aws.amazon.com/rds/) · official-docs · 📖 official
  - 📚 [AWS Free Tier](https://aws.amazon.com/free/) · official-docs · 📖 official

- **Serverless** — Lambda: when serverless fits vs containers; triggers, cold starts, function design
  - 📚 [AWS Lambda docs](https://docs.aws.amazon.com/lambda/) · official-docs · 📖 official
  - 📚 [AWS Compute](https://aws.amazon.com/lambda/) · official-docs · 📖 official

- 🟡 **Containers on AWS** — ECS/Fargate + ECR vs EKS: when the managed container service beats running your own k8s (very common in Indian companies)
  - 📚 [AWS ECS docs](https://docs.aws.amazon.com/ecs/) · official-docs · 📖 official
  - 📚 [AWS Fargate](https://aws.amazon.com/fargate/) · official-docs · 📖 official
  - 📚 [AWS ECR](https://docs.aws.amazon.com/ecr/) · official-docs · 📖 official

- 🟡 **Serverless ecosystem** — API Gateway + DynamoDB: the pattern that pairs with Lambda in real apps
  - 📚 [AWS API Gateway docs](https://docs.aws.amazon.com/apigateway/) · official-docs · 📖 official
  - 📚 [AWS DynamoDB docs](https://docs.aws.amazon.com/dynamodb/) · official-docs · 📖 official

##### Sub-topic research

**Interview focus:**

- EC2 instance families — how do you pick the right one for a workload (general/compute/memory/storage/accelerated)?
- On-demand vs spot vs reserved/Savings Plans — cost/latency tradeoffs and when spot is acceptable
- stop vs terminate — what survives each? EBS volume lifecycle and snapshots
- S3 storage classes + lifecycle rules — when does cold storage make sense?
- EBS vs EFS vs S3 — pick storage for a stateful app and justify

**Practice:** Launch an EC2 via console and via Terraform; attach a volume, snapshot it, restore it; create an S3 lifecycle policy; right-size one instance using CloudWatch metrics.

**Depth note:** EC2/S3 choices with justification are the core AWS interview pattern — always answer with 'for this workload, because...'.

#### Databases in production

- **SQL vs NoSQL** — When to reach for Postgres vs DynamoDB/MongoDB: relations, scale, access patterns
  - 📚 [AWS DynamoDB docs](https://docs.aws.amazon.com/dynamodb/) · official-docs · 📖 official
  - 📚 [MongoDB documentation](https://www.mongodb.com/docs/) · official-docs · 📖 official

- **Backups & point-in-time recovery** — Snapshot, PITR, restore drill; tie to the RTO/RPO targets from B06
  - 📚 [AWS RDS docs](https://docs.aws.amazon.com/rds/) · official-docs · 📖 official
  - 📚 [PostgreSQL backup docs](https://www.postgresql.org/docs/current/backup-dump.html) · official-docs · 📖 official

- **Connection pooling & slow queries** — PgBouncer, indexes, EXPLAIN ANALYZE; the database as the app's bottleneck
  - 📚 [PgBouncer](https://www.pgbouncer.org/) · official-docs · 📖 official
  - 📚 [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html) · official-docs · 📖 official

##### Sub-topic research

**Interview focus:**

- SQL vs NoSQL — how do you decide for a new service? Give a decision rule, not a preference
- A query is slow in production — what's your diagnosis order (EXPLAIN, indexes, connection pool, locks)?
- Walk me through a restore drill: snapshot → PITR → verify — and how it maps to your RTO/RPO

**Practice:** Run Postgres in Docker, load data, add an index, EXPLAIN ANALYZE before/after; set up a nightly pg_dump + a restore drill; stand up PgBouncer and watch connection limits.

**Depth note:** Databases are the #1 'sleeper' interview topic for platform roles — most candidates skip it, and a confident SQL-vs-NoSQL + restore answer separates you fast.

#### Networking

- **VPC & subnets** — CIDR blocks, public/private subnets, route tables, internet gateway, NAT gateway
  - 📚 [AWS VPC docs](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html) · official-docs · 📖 official
  - 📚 [AWS EC2 docs](https://docs.aws.amazon.com/ec2/) · official-docs · 📖 official

- **Security groups & NACLs** — Instance-level vs subnet-level filtering; default-deny discipline
  - 📚 [AWS VPC: Security groups](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html) · official-docs · 📖 official
  - 📚 [AWS VPC docs](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html) · official-docs · 📖 official

- **DNS & routing** — Route 53: hosted zones, records, aliases; how traffic finds your service
  - 📚 [AWS Route 53 docs](https://docs.aws.amazon.com/route53/) · official-docs · 📖 official
  - 📚 [AWS Networking](https://docs.aws.amazon.com/whitepapers/latest/aws-vpc-connectivity-options/welcome.html) · official-docs · 📖 official

##### Sub-topic research

**Interview focus:**

- VPC anatomy: subnets/AZ, IGW, NAT, route tables — draw the flow of a request in vs out
- Security Groups vs NACLs — stateful vs stateless, and why SG rules are inbound-only
- How do you diagnose a blocked connection (VPC Flow Logs, SG/NACL rules, reachability analyzer)?
- VPC peering vs Transit Gateway vs VPN — when each

**Practice:** Build a 2-tier VPC (public web + private app) with NAT; block traffic via SG and via NACL and observe the difference; enable VPC Flow Logs and query them.

**Depth note:** The SG/NACL stateful-vs-stateless distinction and the in/out request flow are the two most-asked AWS networking questions.

#### Load balancing & scaling

- **Load balancers** — ALB/NLB; target groups, listeners, health checks
  - 📚 [AWS Elastic Load Balancing docs](https://docs.aws.amazon.com/elasticloadbalancing/) · official-docs · 📖 official
  - 📚 [AWS EC2 docs](https://docs.aws.amazon.com/ec2/) · official-docs · 📖 official

- **Auto Scaling Groups** — Launch templates, min/max/desired, scaling policies
  - 📚 [AWS EC2 Auto Scaling docs](https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html) · official-docs · 📖 official
  - 📚 [AWS EC2 docs](https://docs.aws.amazon.com/ec2/) · official-docs · 📖 official

- **Managed Kubernetes** — EKS basics; how it maps to the k8s you learned in B01
  - 📚 [AWS EKS docs](https://docs.aws.amazon.com/eks/) · official-docs · 📖 official
  - 📚 [Kubernetes Tutorials](https://kubernetes.io/docs/tutorials/) · official-docs · 📖 official

- **Well-Architected thinking** — The 6 pillars (Operational Excellence, Security, Reliability, Performance, Cost, Sustainability) as your design-review checklist; interviews ask for it
  - 📚 [AWS Well-Architected](https://docs.aws.amazon.com/wellarchitected/) · official-docs · 📖 official
  - 📚 [AWS WAF Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html) · official-docs · 📖 official

##### Sub-topic research

**Interview focus:**

- ALB vs NLB vs CLB — protocol, features, and when you'd pick each
- How does an ASG work with an ELB — health checks, cooldown, lifecycle hooks, scaling policies
- Target groups, sticky sessions, and connection draining — what problem does each solve?
- Route 53 routing policies: simple, weighted, latency, failover — give a use case for each

**Practice:** Deploy a web app behind ALB + ASG; set up a scale-out policy and drive load to watch it scale; configure weighted routing and failover; drain + replace an instance.

**Depth note:** ELB+ASG integration is the classic mid-level AWS scenario — know the health-check → deregister → scale cycle end to end.

#### IAM & security

- **IAM least-privilege** — 'Who can touch what' is second nature; roles, policies, no root keys in code
  - 📚 [AWS IAM docs](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html) · official-docs · 📖 official
  - 📚 [AWS Well-Architected](https://docs.aws.amazon.com/wellarchitected/) · official-docs · 📖 official

- **Credentials hygiene** — No keys in code/repos; roles for EC2; SSO/identity center
  - 📚 [AWS IAM: Best practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html) · official-docs · 📖 official
  - 📚 [AWS IAM docs](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html) · official-docs · 📖 official

- **AWS Organizations & SCPs** — Multi-account strategy; SCPs as guardrails that override IAM; OU hierarchy
  - 📚 [AWS Organizations: What is AWS Organizations](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html) · official-docs · 📖 official
  - 📚 [AWS: SCPs](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html) · official-docs · 📖 official

- 🟡 **Second cloud awareness** — Azure is growing fast in India (Pune MNCs); multi-cloud is a premium skill: learn the concepts once, the console differs
  - 📚 [Azure DevOps docs](https://learn.microsoft.com/en-us/azure/devops/) · official-docs · 📖 official
  - 📚 [GCP DevOps](https://cloud.google.com/architecture/devops) · official-docs · 📖 official

##### Sub-topic research

**Interview focus:**

- IAM policy structure: Effect/Action/Resource/Condition — write a least-privilege S3 policy from scratch
- Roles vs users vs instance profiles — when does an EC2 get credentials and how?
- How do you scope an IAM role for a CI/CD pipeline (short-lived creds, external ID)?
- What is the AWS shared responsibility model and where does IAM sit in it?
- AWS Organizations & SCPs — how do SCPs act as guardrails that override IAM, and what's a multi-account OU strategy?

**Practice:** Write policies for: read-only S3, full EKS, and CI deploy; attach a role to an EC2 via instance profile; test over-permission and under-permission scenarios; use Access Analyzer.

**Depth note:** IAM policy authoring is a hands-on interview task — practice writing JSON policies cold, and always answer with least privilege.

#### Cost & FinOps

- **Cost awareness** — Read a bill, find the money, tag resources, set budgets
  - 📚 [AWS Cost Management](https://docs.aws.amazon.com/cost-management/) · official-docs · 📖 official
  - 📚 [AWS Well-Architected: Cost pillar](https://docs.aws.amazon.com/wellarchitected/latest/cost-optimization-pillar/welcome.html) · official-docs · 📖 official

- **Monitoring basics** — CloudWatch metrics, alarms, log groups
  - 📚 [AWS CloudWatch docs](https://docs.aws.amazon.com/cloudwatch/) · official-docs · 📖 official
  - 📚 [AWS Well-Architected](https://docs.aws.amazon.com/wellarchitected/) · official-docs · 📖 official

##### Sub-topic research

**Interview focus:**

- Your bill doubled — walk me through your investigation order (Cost Explorer, tags, unused resources)
- Right-sizing: how do you find over-provisioned instances and what's the fix?
- Spot/reserved/Savings Plans: how would you design a cost strategy for dev vs prod?
- How do you enforce tagging and budgets so costs don't recur (Budget alerts, anomaly detection)?

**Practice:** Enable Cost Explorer + budgets with alerts; tag all resources; run a right-sizing pass on every running instance; find and kill 3 idle resources; document the savings.

**Depth note:** FinOps answers show ownership — the investigation order (find → tag → right-size → alert) is the interview story skeleton.

#### Module research

**Interview focus:**

- Compute: EC2 (types by use: general/compute/memory/storage/accelerated; T2 burstable), on-demand vs spot vs reserved, stop vs terminate, key pairs, AMI components, private IP immutable
- Network: VPC (200 subnets max), subnets/AZ, IGW/NAT, security groups (stateful, inbound-only rules) vs NACLs (stateless, explicit in+out), CloudWatch + VPC Flow Logs for monitoring
- Storage: S3 storage classes (Standard/IA/RRS/Glacier), multipart upload >100MB, S3 as REST service, EBS vs instance store, connection draining (ELB)
- DNS/CDN: Route 53 (global DNS, nearest DC routing), CloudFront (Geo-Targeting)
- IAM: roles, federated access, Power User vs Admin, password policies, least privilege
- Scaling/HA: AZ vs Region, autoscaling lifecycle hooks, consistency models (eventual vs strong), RTO/RPO
- Service model: IaaS/PaaS/SaaS, Snowball (data transfer), CloudWatch alarms
- Cost & FinOps: right-sizing from CloudWatch metrics, spot vs reserved mix + Savings Plans, tagging strategy + cost allocation tags, AWS Budgets + anomaly detection alerts, idle cleanup (unattached EBS, unused EIPs, stopped instances)
- ELB specifics: ALB vs NLB vs CLB, target groups, health checks, sticky sessions, connection draining
- Route 53 routing policies: simple / weighted / latency / failover / geolocation, alias vs CNAME records
- IAM deep: policy structure (Effect/Action/Resource/Condition), inline vs managed policies, roles vs users, instance profiles, cross-account assume-role

**Demand:** AWS is the dominant cloud in the Indian market (see marketData). Focus on the core trio (EC2/VPC/S3) + IAM for interviews; serverless (Lambda) is a plus. Hands-on free-tier projects (ec2-instance, iac-digitalocean/AWS equivalent) prove real experience.

**Verified resources:**

- ✅ [InterviewBit AWS Interview Questions](https://www.interviewbit.com/aws-interview-questions/) · interactive
- 📖 [AWS official docs — Getting Started](https://docs.aws.amazon.com/) · official-docs
- ✅ [roadmap.sh AWS Roadmap](https://roadmap.sh/aws) · community
- 📖 [AWS Skill Builder free courses](https://skillbuilder.aws/) · course

**Depth sequence:**

- Week 1: EC2 + key pairs + security groups; launch a web server via SSH; stop vs terminate
- Week 2: VPC — subnets, IGW, NAT, route tables; SG vs NACL hands-on; VPC Flow Logs
- Week 3: S3 (classes, multipart, presigned URLs) + IAM (roles/policies, least privilege)
- Week 4: ELB + ASG + lifecycle hooks + CloudWatch; Route 53 basics
- Practice: repeat the A06 ec2-instance + static-site projects on real free-tier; build one full 3-tier app
- Week 4 add: cost dashboard + AWS Budgets + tagging policy; do a right-sizing pass on every running instance

**Certifications:**

- AWS Certified DevOps Engineer – Associate — after B03; ~+20-30% per marketData
- AWS Certified Solutions Architect – Associate (optional — broader, good for platform roles)

---

### B04 📊 Observability depth — SLOs & traces

> **Mental model:** A junior installs Prometheus; a mid writes dashboards that answer questions and knows the math of reliability: SLOs and error budgets.
> **Duration:** Weeks 5–6 · **Type:** core
>
> **Exit test:** Given a slow endpoint, you can say which metric moved, follow the trace to the culprit service, and decide whether it's an alert or noise.
> **Depends on:** A03 Networking, B01 Kubernetes

#### Metrics

- **Metrics that matter** — RED (Rate, Errors, Duration) and USE (Utilization, Saturation, Errors); p50/p95/p99 and why percentiles matter
  - 📚 [Prometheus Overview](https://prometheus.io/docs/introduction/overview/) · official-docs · ✅ verified
  - 📚 [Prometheus: Querying basics (PromQL)](https://prometheus.io/docs/prometheus/latest/querying/basics/) · official-docs · 📖 official

- **PromQL** — Queries, rate/irate, aggregations, recording rules
  - 📚 [Prometheus: PromQL basics](https://prometheus.io/docs/prometheus/latest/querying/basics/) · official-docs · 📖 official
  - 📚 [Prometheus: Recording rules](https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/) · official-docs · 📖 official

- **Instrumentation** — Exposing your own app's metrics (counters, gauges, histograms)
  - 📚 [Prometheus: Instrumenting](https://prometheus.io/docs/instrumenting/clientlibs/) · official-docs · 📖 official
  - 📚 [Prometheus Overview](https://prometheus.io/docs/introduction/overview/) · official-docs · ✅ verified

##### Sub-topic research

**Interview focus:**

- Prometheus pull model — how does scraping work and what happens when a target is down?
- Counter vs gauge vs histogram vs summary — give a real metric for each
- Labels: how do you design them to avoid cardinality explosions?
- Recording rules — when to precompute and why?

**Practice:** Install Prometheus + node-exporter; scrape 3 targets; write queries for CPU, memory, request rate, error rate; create 3 recording rules; alert on one.

**Depth note:** Metric types + labels are the Prometheus interview core — answer with concrete examples, not definitions.

#### Dashboards & visualization

- **Grafana** — Dashboards that answer questions; templating, annotations, dashboard-as-code
  - 📚 [Grafana docs](https://grafana.com/docs/) · official-docs · 📖 official
  - 📚 [Prometheus Overview](https://prometheus.io/docs/introduction/overview/) · official-docs · ✅ verified

##### Sub-topic research

**Interview focus:**

- What makes a dashboard useful at 3am — what belongs on the wall vs the page?
- Grafana: data sources, variables, and how you avoid dashboard sprawl
- Red-yellow-green vs raw numbers — what do senior engineers actually look at first?

**Practice:** Build a Grafana dashboard for your demo service: RED metrics, one variable, one alert; then delete half the panels — keep only what a new on-call would need.

**Depth note:** Dashboard design is judged by judgment, not tooling — interviewers ask what you'd show, not how to click.

#### Logs

- **Log aggregation** — Loki or ELK; central search across services
  - 📚 [Grafana Loki docs](https://grafana.com/docs/loki/latest/) · official-docs · 📖 official
  - 📚 [Grafana docs](https://grafana.com/docs/) · official-docs · 📖 official

- **Log correlation** — Linking a trace ID to logs; logs as the second stop after traces
  - 📚 [OpenTelemetry docs](https://opentelemetry.io/docs/) · official-docs · ✅ verified
  - 📚 [Grafana Loki docs](https://grafana.com/docs/loki/latest/) · official-docs · 📖 official

##### Sub-topic research

**Interview focus:**

- Structured vs unstructured logs — what does each give you and how do you enforce structure?
- Centralized logging: EFK/ELK vs Loki — pull vs push, index vs label tradeoffs
- How do you trace one request across 5 services using correlation IDs?
- Log rotation and retention — how do you avoid the disk-full-and-logs-are-the-cause trap?

**Practice:** Ship logs from a demo app to Loki (or ELK); query with filters; add a correlation ID through a 2-service flow; set up logrotate + retention.

**Depth note:** Correlation across services is the senior-logging test — structured logs + correlation IDs are the answer template.

#### Tracing

- **OpenTelemetry** — Traces/spans, contexts, propagation; follow one request through 5 services
  - 📚 [OpenTelemetry docs](https://opentelemetry.io/docs/) · official-docs · ✅ verified
  - 📚 [OpenTelemetry: Distributed tracing (traces)](https://opentelemetry.io/docs/concepts/signals/traces/) · official-docs · 📖 official

- **Sampling & cost** — Head vs tail sampling; traces-first, logs-second discipline
  - 📚 [OpenTelemetry: Sampling](https://opentelemetry.io/docs/concepts/sampling/) · official-docs · 📖 official
  - 📚 [OpenTelemetry docs](https://opentelemetry.io/docs/) · official-docs · ✅ verified

- **OpenTelemetry Collector** — Receives traces/metrics/logs from apps, processes, and routes to backends; replaces direct SDK→backend coupling
  - 📚 [OpenTelemetry Collector docs](https://opentelemetry.io/docs/collector/) · official-docs · 📖 official
- 🟡 **Grafana Alloy** — Grafana-native unified collector (successor to Grafana Agent); pipelines for metrics, logs, traces
  - 📚 [Grafana Alloy docs](https://grafana.com/docs/alloy/latest/) · official-docs · 📖 official

##### Sub-topic research

**Interview focus:**

- Trace vs span vs context propagation — how does a trace span service boundaries?
- Sampling: head vs tail, and why trace 100% is a trap
- OpenTelemetry: how do you instrument an app without touching business logic?
- How do you use a trace to find a 500ms hidden dependency?
- OpenTelemetry Collector — what role does it play between apps and backends (receivers, processors, exporters)?
- Grafana Alloy vs OTel Collector — when would you use the Grafana-native collector?

**Practice:** Instrument a 2-service app with OpenTelemetry; export to a tracing backend; add sampling; find a slow dependency in the waterfall and confirm with the trace.

**Depth note:** Tracing is the newest and most premium observability skill — be ready to explain propagation and sampling fluently.

#### SLOs & alerting

- **SLOs & error budgets** — '99.9% availability = ~43 min downtime/month'; budget for deploys, not just measure uptime
  - 📚 [Google SRE books (free)](https://sre.google/books/) · book · 📖 official
  - 📚 [Prometheus: Alerting best practices](https://prometheus.io/docs/practices/alerting/) · official-docs · 📖 official

- **Alerting that doesn't scream** — Fewer, better alerts; alert on symptoms not causes; severity vs silence
  - 📚 [Prometheus: Alerting](https://prometheus.io/docs/alerting/latest/overview/) · official-docs · 📖 official
  - 📚 [Prometheus: Alertmanager](https://prometheus.io/docs/alerting/latest/alertmanager/) · official-docs · 📖 official
  - 📚 [Google SRE: Monitoring](https://sre.google/sre-book/monitoring-distributed-systems/) · book · 📖 official

##### Sub-topic research

**Interview focus:**

- SLI vs SLO vs SLA — define each and give a real example with numbers
- Error budgets: how do you decide when to freeze features? Walk through the math
- Alert on symptom or cause? Give an alert that follows the rule and one that breaks it
- What's the difference between alerting on burn rate vs static thresholds?

**Practice:** Define SLI/SLO for your demo service (e.g., 99.9% availability over 30d); build an error-budget burn alert; page yourself with a test alert and write the runbook.

**Depth note:** SLO math (availability %, error budget, burn rate) is the SRE interview signature — practice explaining it with concrete numbers.

#### Module research

**Interview focus:**

- Definitions: SLI vs SLO vs SLA (measurable indicator, internal target, legal commitment); error budgets
- Three pillars: metrics, logs, traces; observability vs monitoring (unknown unknowns)
- Prometheus: pull model, metrics types (counter/gauge/histogram/summary), labels, recording rules, alerting (Alertmanager), exporters, pushgateway
- Grafana: dashboards, data sources, alerting, variables; Loki for logs; Tempo for traces; OpenTelemetry (vendor-neutral instrumentation)
- Stack on K8s: node-exporter, kube-state-metrics, cAdvisor; EFK/ELK for logs (filebeat/Fluentd -> ES -> Kibana)
- APR (Accelerated Problem Resolution): monitoring & alerting -> rapid diagnosis -> mitigation -> post-mortem -> improvement
- Practical: build a monitoring strategy for a service that has none (classic SRE question)

**Demand:** Observability is a premium skill in mid-level JDs (Prometheus + Grafana appear in ~70% of senior postings). SRE salaries in India: 6-15 LPA fresher, 13-26 LPA experienced (InterviewBit). The prometheus-grafana project (296 starters) is the go-to portfolio piece.

**Verified resources:**

- ✅ [InterviewBit SRE Interview Questions](https://www.interviewbit.com/sre-interview-questions/) · interactive
- 📖 [Prometheus official docs](https://prometheus.io/docs/) · official-docs
- 📖 [Grafana Labs docs (Grafana/Loki/Tempo)](https://grafana.com/docs/) · official-docs
- 📖 [OpenTelemetry docs](https://opentelemetry.io/docs/) · official-docs

**Depth sequence:**

- Week 1: SLI/SLO/SLA + error budgets; define SLOs for a demo service
- Week 2: Prometheus — install, scrape config, node-exporter, metrics types, recording rules, Alertmanager
- Week 3: Grafana — dashboards, alerting, Loki logs; instrument an app with OpenTelemetry
- Week 4: full stack on K8s — prometheus-grafana project (roadmap.sh, 296 starters), EFK for logs
- Practice: run the simple-monitoring (Netdata) project first, then upgrade to Prometheus+Grafana

---

### B05 ⚡ CI/CD as a product — GitOps & canary

> **Mental model:** A junior writes one pipeline; a mid writes reusable, parameterized pipelines and treats Git as the source of truth (GitOps).
> **Duration:** Weeks 7–8 · **Type:** core
>
> **Exit test:** You can promote a change through staging → prod with a canary step, and roll it back by reverting one Git commit.
> **Depends on:** A02 Git, A05 CI/CD, B01 Kubernetes

#### Pipeline design

- **Reusable pipelines** — Shared workflows, matrix builds, templates; one change fixes every pipeline
  - 📚 [GitHub Actions docs](https://docs.github.com/en/actions) · official-docs · 📖 official
  - 📚 [GitHub Skills: Actions](https://skills.github.com/) · interactive · 📖 official

- **Caching & speed** — Dependency caching, parallel jobs, buildkit; pipelines that don't waste developer time
  - 📚 [GitHub Actions: Caching](https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows) · official-docs · 📖 official
  - 📚 [GitHub Actions docs](https://docs.github.com/en/actions) · official-docs · 📖 official

- **Jenkins** — Still the dominant CI in Indian enterprise/service companies (TCS/Infosys/Accenture); declarative pipelines, plugins, master-agent
  - 📚 [Jenkins docs](https://www.jenkins.io/doc/) · official-docs · ✅ verified
  - 📚 [Jenkins Pipeline tutorial](https://www.jenkins.io/doc/pipeline/tour/getting-started/) · official-docs · 📖 official

- **GitLab CI** — One of the 'core must-haves' in India job posts; .gitlab-ci.yml, runners, built-in registry & security
  - 📚 [GitLab CI docs](https://docs.gitlab.com/ee/ci/) · official-docs · ✅ verified
  - 📚 [GitLab: first pipeline](https://docs.gitlab.com/ci/quick_start/) · official-docs · 📖 official

- **DORA metrics instrumentation** — Measure deploy frequency, lead time, change failure rate, MTTR; use CI/CD event data + Grafana/custom dashboards
  - 📚 [DORA (canonical source)](https://dora.dev/) · official-docs · 📖 official
  - 📚 [Google: Four Keys to measure DevOps performance](https://cloud.google.com/blog/products/devops-sre/using-the-four-keys-to-measure-your-devops-performance) · community · ✅ verified

##### Sub-topic research

**Interview focus:**

- Design a production pipeline: lint → test → build → push → deploy — where do gates, caching, and secrets live?
- Build once, deploy many — how do you avoid rebuilding per environment?
- Pipeline as code: Jenkinsfile vs GitHub Actions workflow — structure, stages, artifacts
- Your pipeline is the bottleneck — where do you speed it up (cache, parallel, selective runs)?
- DORA metrics — what are the Four Key Metrics and how do you instrument them from CI/CD data?

**Practice:** Build a real Jenkins + GitHub Actions pipeline with lint→test→build→push, caching + secrets; draw the CI/CD handoff diagram (who owns artifact promotion).

**Depth note:** Pipeline design is the B05 foundation — the handoff from CI (build/test) to CD (deploy) must be crisp before GitOps makes sense.

#### Environments & gates

- **Environments & approvals** — Staging vs prod, manual approval gates, protection rules
  - 📚 [GitHub Actions: Environments](https://docs.github.com/en/actions/deployment) · official-docs · 📖 official
  - 📚 [GitHub Skills](https://skills.github.com/) · interactive · 📖 official

- **Secrets in CI** — Encrypted secrets, scoping, rotation; never in logs
  - 📚 [GitHub Actions: Secrets](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions) · official-docs · 📖 official
  - 📚 [GitHub Actions: Security](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions) · official-docs · 📖 official

##### Sub-topic research

**Interview focus:**

- dev → staging → prod — what's promoted and what changes between environments (config, not code)?
- How do you prevent 'works on my machine' — parity, immutable artifacts, env-specific config?
- Manual approval gates vs automated quality gates — where does each belong?
- How do you handle hotfixes bypassing the pipeline safely?

**Practice:** Set up 3 environments with one promoted artifact (same image tag, different config); add a UAT approval gate; practice a hotfix path that still records a trace.

**Depth note:** Environment/gate design is where interviewers test production judgment — promote artifacts, not code; gate with evidence, not vibes.

#### GitOps

- **GitOps** — Git is the source of truth; the cluster syncs itself (Argo CD or Flux)
  - 📚 [Argo CD docs](https://argo-cd.readthedocs.io/en/stable/) · official-docs · ✅ verified
  - 📚 [Flux docs](https://fluxcd.io/docs/) · official-docs · ✅ verified

- **Sync & drift** — How Argo CD/Flux reconcile, OutOfSync states, auto-sync policies
  - 📚 [Argo CD: User guide](https://argo-cd.readthedocs.io/en/stable/user-guide/) · official-docs · 📖 official
  - 📚 [Flux: Core concepts](https://fluxcd.io/flux/concepts/) · official-docs · 📖 official

##### Sub-topic research

**Interview focus:**

- GitOps principles: Git as single source of truth, declarative state, automated convergence — why is this better than kubectl apply?
- ArgoCD: how does the app controller detect and fix drift? What is OutOfSync?
- ArgoCD vs Flux — architecture and when you'd choose each
- Secrets in GitOps: SOPS/External Secrets/Sealed Secrets — how do you keep Git the source of truth without leaking?

**Practice:** Deploy ArgoCD to a local cluster; register a repo; create an Application; watch sync/OutOfSync; try auto vs manual sync; delete a manifest and watch it reconcile.

**Depth note:** GitOps is the platform-engineering identity — the reconcile loop and 'no kubectl apply from CI' handoff are the interview pillars.

#### Progressive delivery

- **Canary & blue-green** — Deploys that dare to go wrong slowly; traffic shifting, automated analysis
  - 📚 [Argo Rollouts docs](https://argoproj.github.io/argo-rollouts/) · official-docs · 📖 official
  - 📚 [Flagger docs](https://flagger.app/) · official-docs · 📖 official
  - 📚 [GitHub Actions docs](https://docs.github.com/en/actions) · official-docs · 📖 official

- **Feature flags** — Dark launches; flag-driven behavior as a rollout tool
  - 📚 [Flagger docs](https://flagger.app/) · official-docs · 📖 official
  - 📚 [Argo Rollouts docs](https://argoproj.github.io/argo-rollouts/) · official-docs · 📖 official

##### Sub-topic research

**Interview focus:**

- Canary vs blue/green vs rolling — tradeoffs and how you shift traffic safely
- Argo Rollouts: how do analysis steps (metrics) gate a canary automatically?
- How do you observe a canary — what metrics prove it's safe before 100%?
- What's the rollback story for each strategy — how fast, how clean?

**Practice:** Install Argo Rollouts; run a blue/green and a canary with an analysis step; send bad traffic and watch the rollout abort; roll back deliberately.

**Depth note:** Progressive delivery pairs with GitOps in every senior JD — the analysis-step gate is the differentiator between demo and production.

#### Artifacts & rollback

- **Artifacts & registries** — Container registry, immutable tags, versioning
  - 📚 [GitHub Packages](https://docs.github.com/en/packages) · official-docs · 📖 official
  - 📚 [Docker Registry docs](https://docs.docker.com/registry/) · official-docs · 📖 official

- **Rollback built in** — Every pipeline has a rollback path, not bolted on after an incident
  - 📚 [GitHub Actions: Deployment protection rules](https://docs.github.com/en/actions/deployment) · official-docs · 📖 official
  - 📚 [Argo CD: Rollback](https://argo-cd.readthedocs.io/en/stable/user-guide/) · official-docs · 📖 official

##### Sub-topic research

**Interview focus:**

- Immutable artifacts: why tag images by SHA, never by 'latest'? What's the registry layout?
- SBOM: what's inside your artifact and why does DevSecOps demand it?
- Rollback strategies: roll forward vs roll back vs freeze — decision framework at 2am
- How do you prove a rollback worked (verification, not just 'it's deployed')?

**Practice:** Set up an artifact registry with SHA tags; generate an SBOM with Trivy/Syft; practice roll-forward and roll-back drills with verification steps.

**Depth note:** Artifact discipline (immutable + SBOM + attestation) is the modern supply-chain interview answer — rollback strategy is its operational twin.

#### Module research

**Interview focus:**

- GitOps principles: Git = single source of truth, declarative desired state, automated convergence, auditability
- ArgoCD: declarative GitOps CD for K8s; app controller continuously compares live vs desired state; OutOfSync detection
- Architecture: Application Controller, Repo Server, API Server, Dex/SSO; kubectl apply -n argocd install
- Manifest sources: kustomize, helm, jsonnet, plain YAML, config management plugins
- Tracking: branch, tag, or pinned commit; sync policies (auto/manual), sync waves + phases, PreSync/Sync/PostSync hooks (blue/green & canary)
- Features: multi-cluster management, RBAC/multi-tenancy, SSO (OIDC/OAuth2/LDAP/SAML), rollback to any commit, drift detection, webhooks (GitHub/BitBucket/GitLab), Prometheus metrics
- Flux vs ArgoCD (one-line each; ArgoCD has richer UI, Flux is tighter with GitOps toolkit)
- Secret management: sealed-secrets, SOPS, External Secrets Operator
- Pipeline design: build once / deploy many (artifact reuse), pipeline as code (Jenkinsfile / GitHub Actions YAML / GitLab CI), stages (lint→test→build→scan→push→deploy), caching, parallel jobs, secrets injection
- Environments & gates: dev/staging/prod parity, manual approval gates vs auto-promote, UAT, environment-specific config, promotion vs re-deploy
- Artifacts & rollback: container registry (ECR/GHCR/Artifactory), immutable tags (sha256), semver, artifact provenance/SBOM, rollback options (revert commit vs redeploy previous artifact vs ArgoCD rollback)
- CI vs CD handoff: CI builds the artifact, CD deploys it; with GitOps nobody kubectl-applies from CI — the controller syncs from Git

**Demand:** GitOps/ArgoCD is the fastest-rising premium skill (see marketData.premiumSkills) — mid-level JDs increasingly require it. Being able to demo a working ArgoCD sync on your own cluster is a top-tier interview differentiator in the Pune/remote market.

**Verified resources:**

- ✅ [Argo CD official docs — Overview](https://argo-cd.readthedocs.io/en/stable/) · official-docs
- 📖 [Argo Rollouts (blue/green + canary) docs](https://argo-rollouts.readthedocs.io/en/stable/) · official-docs
- 📖 [Flux CD docs](https://fluxcd.io/flux/) · official-docs
- 📖 [GitOps definition (CNCF)](https://opengitops.dev/) · community

**Depth sequence:**

- Week 1: pipeline design FIRST — build a real Jenkins + GitHub Actions pipeline (lint→test→build→push), with caching + secrets; write the CI/CD handoff diagram
- Week 2: GitOps mental model; deploy ArgoCD to a local cluster (kubectl apply, get admin password, argocd login)
- Week 3: register a Git repo, create an Application, watch sync/OutOfSync; auto vs manual sync policies
- Week 4: kustomize + helm sources; sync waves + hooks; blue/green with Argo Rollouts
- Week 5: multi-cluster + RBAC + SSO; secrets with SOPS/External Secrets; webhook-triggered sync; artifacts & rollback drill

---

### B06 🛡️ Reliability craft — incidents & chaos

> **Mental model:** The part that can't be learned from a course — but can be practiced: incidents, chaos experiments, scaling, and restore drills.
> **Duration:** Weeks 9–10 · **Type:** core
>
> **Exit test:** You can run a kill-a-pod experiment, observe the steady state, and write a blameless postmortem with a real follow-up action.
> **Depends on:** B01 Kubernetes, B04 Observability depth

#### Incident response

- **Incident response** — Severity levels, triage, comms, incident commander role; calm under the pager
  - 📚 [Google SRE books (free)](https://sre.google/books/) · book · 📖 official
  - 📚 [Google SRE: Postmortem culture](https://sre.google/sre-book/postmortem-culture/) · book · 📖 official

- **Escalation & comms** — When to escalate, status updates, blameless culture
  - 📚 [Google SRE: Being on-call](https://sre.google/sre-book/being-on-call/) · book · 📖 official
  - 📚 [Google SRE books](https://sre.google/books/) · book · 📖 official

##### Sub-topic research

**Interview focus:**

- Walk me through an incident from detection to resolution — who does what, when do you escalate?
- Severity levels: define SEV1–SEV3 and give the escalation criteria for each
- Mitigate vs fix: why do you restore service first and debug later? Give an example
- How do you communicate during an incident (status pages, war room, stakeholder updates)?
- Your page fires at 3am — what's your first 10 minutes in order?

**Practice:** Run a game day: break a service, practice the full loop (detect → triage → mitigate → communicate → resolve); write a status-page update under time pressure; drill the first-10-minutes aloud.

**Depth note:** The incident-response interview tests process, not heroics — mitigate first, communicate early, and always have the severity/escalation ladder memorized.

#### Postmortems

- **Blameless postmortems** — Timeline, root cause, action items, follow-up ownership
  - 📚 [Google SRE: Postmortem culture](https://sre.google/sre-book/postmortem-culture/) · book · 📖 official
  - 📚 [Google SRE books](https://sre.google/books/) · book · 📖 official

##### Sub-topic research

**Interview focus:**

- What makes a postmortem blameless? How do you write action items that actually prevent recurrence?
- Postmortem structure: timeline, root cause, contributing factors, actions — what belongs in each?
- How do you handle a postmortem where the 'cause' is human error?
- How do you track postmortem action items to completion without a bureaucracy?

**Practice:** Write a full blameless postmortem for a fake (or real) incident: timeline, impact, 5-whys root cause, 3 action items with owners; review it as if you were a peer.

**Depth note:** Blameless culture is the SRE signature — interviewers listen for blame-free language and concrete, owned action items.

#### Chaos engineering

- **Chaos thinking** — Steady state, hypothesis, controlled experiments, blast radius
  - 📚 [Principles of Chaos Engineering](https://principlesofchaos.org/) · community · ✅ verified
  - 📚 [Chaos Monkey](https://netflix.github.io/chaosmonkey/) · official-docs · 📖 official

- **Game days** — Kill a pod, throttle a network, see what breaks before production does
  - 📚 [Principles of Chaos Engineering](https://principlesofchaos.org/) · community · ✅ verified
  - 📚 [Chaos Monkey](https://netflix.github.io/chaosmonkey/) · official-docs · 📖 official

- **Chaos Mesh (k8s-native)** — Install, run a pod-kill / network-latency experiment, verify the hypothesis
  - 📚 [Chaos Mesh docs](https://chaos-mesh.org/docs/) · official-docs · 📖 official
- **Litmus Chaos** — CNCF k8s-native alternative; Litmus portal for experiment management
  - 📚 [LitmusChaos](https://litmuschaos.io/) · official-docs · 📖 official

##### Sub-topic research

**Interview focus:**

- What is chaos engineering and what is it NOT (it's not random breaking)?
- Design a chaos experiment: hypothesis, blast radius, rollback — walk me through one
- Chaos Mesh vs Litmus vs Gremlin — when would you use each?
- How do you convince a skeptical team to allow chaos in staging/prod?

**Practice:** Run one Litmus/Chaos Mesh experiment (pod kill, network latency) on your cluster with a stated hypothesis; verify the system's behavior matches your prediction; write up the result.

**Depth note:** The hypothesis-driven experiment is the interview core — chaos without a hypothesis is just breaking things.

#### Capacity & scaling

- **Autoscaling** — HPA, when to scale up vs out, quotas
  - 📚 [Kubernetes: Horizontal Pod Autoscaling](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/) · official-docs · 📖 official
  - 📚 [Kubernetes docs](https://kubernetes.io/docs/) · official-docs · 📖 official

- **Load & performance testing** — Baseline, soak, spike; k6 as the standard tool
  - 📚 [k6 docs](https://k6.io/docs/) · official-docs · 📖 official
  - 📚 [Google SRE books](https://sre.google/books/) · book · 📖 official

##### Sub-topic research

**Interview focus:**

- How do you forecast capacity — what metrics, what lead time, and what's the margin?
- Scale up vs scale out — when each, and what breaks when you scale out (state, sessions)?
- How do you load test safely — tooling, staged ramp, and how you read the knee of the curve?
- Your service hit 100% CPU — what's the triage order (hot path, autoscaling, throttling)?

**Practice:** Load test your demo service with k6 (staged ramp to find the knee); wire autoscaling to the metric; run a 'capacity table' exercise forecasting 2x traffic.

**Depth note:** Capacity answers with numbers (knee, margin, lead time) signal real operational experience — always quantify.

#### Backups & DR

- **Backups & restore drills** — Have actually restored from backup, not just taken backups; drills are the test
  - 📚 [PostgreSQL backup docs](https://www.postgresql.org/docs/current/backup-dump.html) · official-docs · 📖 official
  - 📚 [Google SRE: Data integrity](https://sre.google/sre-book/data-integrity/) · book · 📖 official

- **RTO/RPO & failover** — Recovery objectives; multi-AZ, multi-region thinking
  - 📚 [AWS Disaster Recovery](https://aws.amazon.com/disaster-recovery/) · official-docs · 📖 official
  - 📚 [Google SRE: Data integrity](https://sre.google/sre-book/data-integrity/) · book · 📖 official

- **Cluster backup with Velero** — Backup/restore/migrate entire k8s clusters + persistent volumes; the standard DR answer
  - 📚 [Velero docs](https://velero.io/docs/) · official-docs · ✅ verified
  - 📚 [Velero: disaster recovery](https://velero.io/docs/v1.18/disaster-case) · official-docs · 📖 official

##### Sub-topic research

**Interview focus:**

- RTO vs RPO — define and give a target for a database service; how do you choose?
- 3-2-1 backup rule — what is it and how does it apply to databases and clusters?
- Velero: how do you back up and restore a Kubernetes cluster? What does it NOT back up?
- Disaster recovery strategies: backup/restore vs pilot light vs warm standby vs multi-region — tradeoffs
- When was the last time you tested a restore — and why does untested backup not count?

**Practice:** Set up Velero on minikube; schedule a backup; destroy a namespace and restore it; run a restore drill on a real DB (pg_dump/pg_restore) and time the RTO/RPO.

**Depth note:** The restore drill is the answer to almost every backup interview question — 'backed up' means 'restored and verified', always.

#### Module research

**Interview focus:**

- SRE fundamentals: what is SRE vs DevOps (DevOps = how software is built; SRE = keeping it running), error budgets, toil reduction, automation
- Incident response: detection (monitoring/alerting), rapid diagnosis, mitigation (hotfix, reroute, scale), post-mortem (blameless, action items, documentation), continuous improvement
- SLI/SLO/SLA + error budget math; APR stages
- Reliability patterns: redundancy, failover, retries/backoff, circuit breakers, rate limiting, graceful degradation
- Chaos engineering: game days, chaos experiments (Chaos Monkey, litmus/chaos-mesh), blast radius control
- Capacity/scaling: vertical vs horizontal, autoscaling, load testing
- Backups/DR: RTO/RPO, RAID levels, backups + restore drills, 3-2-1 rule
- Culture: blameless post-mortems, on-call best practices, incident communication
- Incident mechanics: severity levels (SEV1-3), escalation paths, status pages + stakeholder comms, runbook quality, incident timeline reconstruction
- Backups: 3-2-1 rule, Velero for Kubernetes, restore drills, RTO/RPO validation (backups you never restore = fiction)

**Demand:** SRE roles pay premium (13-26 LPA experienced in India). Reliability questions combine ops + engineering judgment — practice the 'how would you handle an outage' scenario. Chaos engineering and error budgets are the senior differentiators.

**Verified resources:**

- ✅ [InterviewBit SRE Interview Questions](https://www.interviewbit.com/sre-interview-questions/) · interactive
- 📖 [Google SRE Book (free)](https://sre.google/sre-book/table-of-contents/) · book
- 📖 [Chaos Mesh docs](https://chaos-mesh.org/) · official-docs
- 📖 [PagerDuty incident response docs](https://response.pagerduty.com/) · official-docs

**Depth sequence:**

- Week 1: SRE principles — error budgets, toil, automation; read SRE book ch.1-4
- Week 2: SLI/SLO/SLA — define + monitor for your own service; alert on error budget burn
- Week 3: incident response — run a game day; write a blameless post-mortem template; practice on-call scenarios aloud
- Week 4: chaos + capacity — run a chaos experiment (Chaos Mesh/litmus) on your cluster; load test + autoscale
- Practice: connect everything to B04 monitoring; every project should have an SLO + post-mortem doc

---

### B07 🔧 Automation — idempotent scripts

> **Mental model:** The force multiplier: one good script saves a hundred manual hours; a mid's scripts run unattended and fail loudly.
> **Duration:** Ongoing · **Type:** force-multiplier
>
> **Exit test:** Your scripts run unattended, fail loudly with a clear message, and can be re-run safely.
> **Depends on:** A01 Linux, A06 Capstone

#### Bash mastery

- **Real Bash** — Globbing, pipes, exit codes, error handling, set -euo pipefail
  - 📚 [BashGuide (wooledge)](https://mywiki.wooledge.org/BashGuide) · community · ✅ verified
  - 📚 [ShellCheck](https://github.com/koalaman/shellcheck) · community · 📖 official

- **Text processing** — jq for JSON, awk/sed for logs, cut/tr for parsing
  - 📚 [jq manual](https://jqlang.github.io/jq/) · official-docs · 📖 official
  - 📚 [BashGuide](https://mywiki.wooledge.org/BashGuide) · community · ✅ verified

##### Sub-topic research

**Interview focus:**

- set -euo pipefail — what does each flag do and why do you use them in every script?
- Write a function that retries a command 3 times with backoff — live
- Exit codes, $?, positional params, $@ vs $* — scripting fundamentals
- sed/awk/grep/find — pick the right one for: parse a log, replace in-place, find files by age
- Debugging: set -x, shellcheck — how do you make a failing script explain itself?

**Practice:** Write 5 utility scripts (backup, log rotator, health check, retry wrapper, cron-driven cleanup); run shellcheck until 0 warnings; refactor one script to be idempotent.

**Depth note:** Live shell scripting is a guaranteed interview segment — set -euo pipefail + shellcheck-clean is the baseline everyone checks for.

#### Python glue

- **Python for glue** — The automation language; argparse, requests, clear error handling
  - 📚 [Python docs](https://docs.python.org/3/) · official-docs · 📖 official
  - 📚 [Real Python](https://realpython.com/) · community · ✅ verified

- 🟡 **Go (read-level, optional)** — The language k8s, Terraform, and most cloud-native tools are written in; reading tool source is a mid-level superpower
  - 📚 [Go docs](https://go.dev/doc/) · official-docs · 📖 official
  - 📚 [Go by Example](https://gobyexample.com/) · community · 📖 official

- **Logging & observability of scripts** — Output that a future-you can read at 3am
  - 📚 [BashGuide: Input and Output](https://mywiki.wooledge.org/BashGuide/InputAndOutput) · community · ✅ verified
  - 📚 [Python logging docs](https://docs.python.org/3/howto/logging.html) · official-docs · 📖 official

##### Sub-topic research

**Interview focus:**

- Write a script that reads a JSON config, calls an API, and fails loudly — live
- argparse vs env vars for CLI tools — when does each make sense?
- boto3/requests: error handling, retries with backoff, and how to avoid silent failures
- How do you decide bash vs Python for a task? Give the rule of thumb
- YAML/JSON parsing with pyyaml — how do you validate config before acting on it?

**Practice:** Write a Python ops script that reads YAML, calls an API, retries with backoff, logs structured output, and exits non-zero on failure; add unit tests with pytest + vcrpy.

**Depth note:** Python is the 'automation language' in JDs — interviewers want to see robust error handling, not clever one-liners.

#### Safety & idempotency

- **Idempotency** — 'Run twice = run once'; every script should be re-runnable without damage
  - 📚 [BashGuide: Practices](https://mywiki.wooledge.org/BashGuide/Practices) · community · ✅ verified
  - 📚 [ShellCheck](https://github.com/koalaman/shellcheck) · community · 📖 official

- **Dry-run & guards** — --dry-run flags, lock files, explicit confirmation for destructive steps
  - 📚 [BashGuide: Practices](https://mywiki.wooledge.org/BashGuide/Practices) · community · ✅ verified
  - 📚 [Python docs](https://docs.python.org/3/) · official-docs · 📖 official

##### Sub-topic research

**Interview focus:**

- What makes a script idempotent? Give a concrete example (e.g., creating a user or a cron entry)
- Lock files / flock — how do you prevent two concurrent runs from corrupting state?
- Dry-run mode and --force flags — how do you design safe destructive operations?
- How do you handle partial failure — run the whole thing or leave it half-done? What's the recovery?

**Practice:** Rewrite your backup script to be fully idempotent with flock; add a --dry-run; simulate a partial failure and a re-run to prove it converges.

**Depth note:** Idempotency is the difference between scripts and engineering — every interview follow-up on automation leads here.

#### Scheduling & tooling

- **Scheduling** — Cron, systemd timers, CI cron; cron expression mastery
  - 📚 [crontab.guru](https://crontab.guru/) · interactive · 📖 official
  - 📚 [systemd timers](https://www.freedesktop.org/software/systemd/man/latest/systemd.timer.html) · official-docs · 📖 official

- **Task runners** — Makefile as the universal entry point; make test, make deploy
  - 📚 [GNU Make manual](https://www.gnu.org/software/make/manual/make.html) · official-docs · 📖 official
  - 📚 [BashGuide](https://mywiki.wooledge.org/BashGuide) · community · ✅ verified

- **tmux** — Terminal multiplexer; persist sessions across SSH disconnects; split panes for parallel monitoring during incidents
  - 📚 [tmux wiki](https://github.com/tmux/tmux/wiki) · official-docs · 📖 official
  - 📚 [Ham Vocke: A quick and easy guide to tmux](https://www.hamvocke.com/blog/a-quick-and-easy-guide-to-tmux/) · community · ✅ verified

##### Sub-topic research

**Interview focus:**

- cron vs systemd timers — when would you choose a timer and what do you get (persist, calendar syntax, logging)?
- How do you monitor that a scheduled job actually ran (exit status, output, alerts)?
- make for task automation — when is it the right tool vs a shell script?
- Log rotation: how do you stop logs from filling the disk (logrotate, retention)?
- tmux — how do you keep a session alive across SSH disconnects and split panes for parallel monitoring?

**Practice:** Convert a cron job to a systemd timer; add a success/failure notification; create a Makefile that wraps your project's tasks (lint/test/build); set up logrotate.

**Depth note:** Scheduled-job reliability is a real on-call pain — 'did it run and did it alert if not' is the answer interviewers want.

#### Config management (Ansible)

- **Ansible basics** — Inventory, ad-hoc commands, playbooks; the #1 config-management tool named in Pune/India job skill lists
  - 📚 [Ansible docs](https://docs.ansible.com/ansible/latest/index.html) · official-docs · ✅ verified
  - 📚 [Ansible: Getting started](https://docs.ansible.com/ansible/latest/getting_started/index.html) · official-docs · 📖 official

- **Ansible Vault & idempotency** — Encrypt secrets in playbooks; playbooks safe to re-run (module/state model)
  - 📚 [Ansible Vault](https://docs.ansible.com/ansible/latest/vault_guide/index.html) · official-docs · 📖 official
  - 📚 [Ansible: modules intro](https://docs.ansible.com/ansible/latest/module_plugin_guide/modules_intro.html) · official-docs · 📖 official

- **Where Ansible fits vs Terraform** — Terraform provisions, Ansible configures; the division of labor every team debates
  - 📚 [Ansible vs Terraform (Red Hat)](https://www.redhat.com/en/topics/automation/ansible-vs-terraform) · community · 📖 official
  - 📚 [Ansible docs](https://docs.ansible.com/ansible/latest/index.html) · official-docs · ✅ verified

- **Ansible collections** — The modern packaging unit (replaces standalone roles); ansible-galaxy collection install; community.general, amazon.aws, kubernetes.core
  - 📚 [Ansible: Collections guide](https://docs.ansible.com/ansible/latest/collections_guide/index.html) · official-docs · 📖 official
  - 📚 [Ansible Galaxy](https://galaxy.ansible.com/) · official-docs · 📖 official

##### Sub-topic research

**Interview focus:**

- Ansible ad-hoc vs playbooks vs roles — when does each scale?
- Idempotency in Ansible: modules vs shell — why is the apt/service module safer than shell?
- handlers/notify, register/set_fact, delegate_to — give a real use case for each
- Ansible Vault: how do you store secrets and when do you NOT put them in the repo?
- Dynamic inventory (aws_ec2 plugin) — how does Ansible know about your cloud hosts?
- Ansible collections vs roles — what changed and how do you install/use collections (ansible-galaxy)?

**Practice:** Write an install-nginx playbook with handlers; add a role; encrypt a secret with vault; use dynamic AWS inventory; run the roadmap.sh configuration-management project.

**Depth note:** Ansible is dominant in Indian enterprise (TCS/Infosys/Accenture) — module-idempotency over shell is the answer theme interviewers check.

#### Module research

**Interview focus:**

- Bash: shebang, exit codes ($?), positional params ($1..$n, $#, $*, $@), variables (env vs user-defined), control flow (if/case/for/while/until), functions, pipes, metacharacters, sed/awk/grep/find, debug (set -x/-v), $/$$/$!
- Cron/anacron: scheduling, cron.allow/cron.deny, log rotation (logrotate)
- Python for ops: scripting, requests/boto3, argparse, error handling, YAML/JSON parsing (pyyaml)
- jq: JSON parsing on CLI for API/cloud automation
- Ansible: agentless + SSH push model, inventory (static/dynamic), playbooks/tasks/handlers, modules (core vs extras), roles + Galaxy, ad-hoc commands, vault (secrets), register/set_fact, delegate_to, become, synchronize/rsync, Tower/AWX
- Config management: declarative vs imperative, idempotency, config drift
- Ansible vs Puppet vs Chef vs Terraform (one-line each)
- Task tooling: make for task automation, cron alternatives (systemd timers, Jenkins scheduled jobs), lock files / flock for idempotent concurrent runs

**Demand:** Automation is where 'senior' is proven — interviewers ask you to write a script live. Shell + Python + Ansible is the standard toolkit; jq appears in cloud automation tasks. Ansible roles + vault are expected mid-level depth.

**Verified resources:**

- ✅ [InterviewBit Ansible Interview Questions](https://www.interviewbit.com/ansible-interview-questions/) · interactive
- ✅ [InterviewBit Shell Scripting Interview Questions](https://www.interviewbit.com/shell-scripting-interview-questions/) · interactive
- 📖 [Ansible official docs — Getting Started](https://docs.ansible.com/ansible/latest/user_guide/intro_getting_started.html) · official-docs
- 📖 [Bash Reference Manual](https://www.gnu.org/software/bash/manual/) · official-docs

**Depth sequence:**

- Week 1: bash — control flow, functions, sed/awk/grep, pipes; write 5 utility scripts (backup, log rotator, health check)
- Week 2: python for ops — script that reads YAML/JSON, calls an API, and fails loudly; argparse + logging
- Week 3: Ansible — inventory, ad-hoc, playbooks, handlers, modules; install nginx playbook (InterviewBit exercise)
- Week 4: Ansible deep — roles, vault, register/set_fact, delegate_to, dynamic inventory (aws_ec2); configuration-management project (roadmap.sh, 339 starters)
- Practice: automate your own VM setup end-to-end with one Ansible playbook; keep every script on GitHub

**Certifications:**

- Red Hat Certified Specialist in Ansible Automation (optional — enterprise signal)

---

### B08 🧭 Ownership — on-call & runbooks

> **Mental model:** Mid-level is where you stop being assigned work and start owning systems. This is the least 'technical' module and the most valuable.
> **Duration:** Ongoing · **Type:** career
>
> **Exit test:** A stranger could take your on-call shift using only your runbooks, and your systems have no secrets in code.
> **Depends on:** B01 Kubernetes, B03 Cloud (AWS), B07 Automation

#### On-call

- **On-call maturity** — Calm under the pager; know when to escalate, not just fix
  - 📚 [Google SRE: Being on-call](https://sre.google/sre-book/being-on-call/) · book · 📖 official
  - 📚 [Google SRE books](https://sre.google/books/) · book · 📖 official

- **Rotations & handoff** — Good shift handoffs, documentation of open issues, pager discipline
  - 📚 [Google SRE: Being on-call](https://sre.google/sre-book/being-on-call/) · book · 📖 official
  - 📚 [Google SRE books](https://sre.google/books/) · book · 📖 official

##### Sub-topic research

**Interview focus:**

- Walk me through your on-call rotation: what's in your runbook, how do you triage, when do you escalate?
- Severity levels + escalation tree — define them for a service you own
- A page fires at 3am and the runbook is wrong — what do you do (and how do you fix the runbook after)?
- How do you reduce on-call load over time (toil reduction, alert hygiene, automation)?
- How do you hand over an incident shift cleanly?
- On-call across time zones — how do you run a follow-the-sun rotation and what makes the handoff safe when you've never met your counterpart?
- An incident fires at 2am your time and the rest of the team is asleep in other zones — walk me through your response and escalation.

**Practice:** Write runbooks for your own services (symptoms → diagnosis → fix → escalate); define severity + escalation tree; do a practice on-call shift with mock pages.

**Depth note:** On-call questions test ownership — the runbook-first, escalate-with-evidence, fix-the-process mindset is what interviewers screen for.

#### Documentation

- **Runbooks & docs** — Written so a future junior can do the job without you
  - 📚 [Google Technical Writing courses](https://developers.google.com/tech-writing/) · course · 📖 official
  - 📚 [Google SRE books](https://sre.google/books/) · book · 📖 official

- **ADRs & architecture notes** — Recording why decisions were made, not just what
  - 📚 [ADR GitHub](https://adr.github.io/) · community · 📖 official
  - 📚 [Google Technical Writing courses](https://developers.google.com/tech-writing/) · course · 📖 official

##### Sub-topic research

**Interview focus:**

- What belongs in a runbook vs an architecture doc vs an ADR? When do you write each?
- How do you keep docs from rotting — ownership, review cadence, doc-as-code?
- Remote-first async work — how does it change how you document and communicate? Give your async communication pattern.
- Write an ADR for a decision you made — walk me through the format and why it matters
- How do you document for a future junior so they can do the job without you?

**Practice:** Ship every project with a runbook, one ADR, and a README that a stranger can follow; take Google's Technical Writing courses; review a teammate's doc.

**Depth note:** Documentation is the B08 theme that ties to on-call — 'a future junior can do it' is the quality bar interviewers probe.

#### Security instinct

- **Security instinct** — Secrets, least privilege, patching cadence as default behavior, not an afterthought
  - 📚 [OWASP](https://owasp.org/) · community · 📖 official
  - 📚 [AWS IAM docs](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html) · official-docs · 📖 official

- **CVE triage** — Knowing what to patch now vs next Tuesday; supply-chain awareness
  - 📚 [OWASP](https://owasp.org/) · community · 📖 official
  - 📚 [GitHub Advisory Database](https://github.com/advisories) · official-docs · 📖 official

##### Sub-topic research

**Interview focus:**

- Least privilege — walk me through applying it to a new service (IAM, RBAC, network, secrets)
- Secrets management: Vault vs SOPS vs External Secrets — when do you reach for each?
- SSH hardening: what do you actually change on a server (keys, root login, ports, 2FA)?
- TLS everywhere: where do certs come from and how do you rotate them automatically?
- How do you respond to a reported vulnerability in a dependency you run?

**Practice:** Threat-model one project with STRIDE; harden SSH on a test VM and verify; install cert-manager and auto-rotate a cert; scan a container image and fix findings.

**Depth note:** Security instinct = asking 'who can do what, and how would I know if it was abused' — least privilege + secrets hygiene are the recurring answers.

#### Container & supply-chain security

- **Image scanning** — Trivy/Grype in CI: scan every image for CVEs before it ships; fail the build on criticals
  - 📚 [Trivy docs](https://trivy.dev/docs/) · official-docs · ✅ verified
  - 📚 [Trivy: vulnerability scanning](https://trivy.dev/docs/latest/guide/scanner/vulnerability/) · official-docs · 📖 official

- **SBOM & provenance** — Know what's inside your images; attestations; the supply-chain story DevSecOps demands
  - 📚 [SLSA framework](https://slsa.dev/) · community · 📖 official
  - 📚 [Trivy: SBOM](https://trivy.dev/docs/latest/guide/supply-chain/sbom/) · official-docs · 📖 official

- **Container image signing (Cosign)** — Keyless signing via Sigstore OIDC; verify signatures in CI before deploy
  - 📚 [Cosign docs (Sigstore)](https://docs.sigstore.dev/cosign/) · official-docs · 📖 official
- **Enforce signed images with Kyverno** — Policy that rejects unsigned images in prod namespaces
  - 📚 [Kyverno docs](https://kyverno.io/docs/) · official-docs · 📖 official

- **Policy as code** — Kyverno/OPA gate what can be deployed (no latest tags, no privileged pods, image allow-lists)
  - 📚 [Kyverno docs](https://kyverno.io/docs/) · official-docs · ✅ verified
  - 📚 [OPA docs](https://www.openpolicyagent.org/docs/latest/) · official-docs · ✅ verified

- **Secrets management at scale** — Vault: dynamic secrets, rotation, audit; SOPS covers the basics, Vault is the enterprise answer; in GitOps, External Secrets Operator / Sealed Secrets sync secrets from Git safely
  - 📚 [HashiCorp Vault docs](https://developer.hashicorp.com/vault/docs) · official-docs · ✅ verified
  - 📚 [Vault: getting started](https://developer.hashicorp.com/vault/tutorials/getting-started) · official-docs · 📖 official
  - 📚 [External Secrets Operator](https://external-secrets.io/) · official-docs · 📖 official

##### Sub-topic research

**Interview focus:**

- Trivy: image vs filesystem vs SBOM scanning — what does each catch and how do you gate builds on it?
- SBOM + SLSA: what's in your artifact, who built it, and can you prove it?
- How do you secure the pipeline itself (secrets, trusted builders, pinned base images)?
- Policy as code: Kyverno vs OPA/Gatekeeper — how do you enforce 'no latest tag' or 'must have SBOM'?
- What do you do when a scan finds a critical CVE with no fixed version?
- Cosign image signing — how do you sign and verify container images (keyless OIDC) and enforce with Kyverno?

**Practice:** Scan images with Trivy in CI and fail on criticals; generate an SBOM; write one Kyverno policy (block latest tag) and test it; set up image signing/attestation awareness.

**Depth note:** Supply-chain security is the fastest-growing interview area — scan-in-CI, SBOM, and policy-as-code form the expected answer stack.

#### Threat modeling & compliance

- 🟡 **Threat modeling** — STRIDE: what could go wrong in this system; the question behind 'secure by design'
  - 📚 [OWASP: Threat modeling](https://owasp.org/www-community/Threat_Modeling) · community · 📖 official
  - 📚 [Microsoft STRIDE](https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool-threats) · official-docs · 📖 official

- 🟡 **Zero Trust** — The industry model: never trust, always verify; identity is the perimeter
  - 📚 [NIST SP 800-207 (Zero Trust)](https://csrc.nist.gov/pubs/sp/800/207/final) · official-docs · 📖 official
  - 📚 [Zero Trust architecture (Google Cloud)](https://cloud.google.com/architecture/security/zero-trust) · official-docs · 📖 official

- 🟡 **Compliance awareness** — SOC 2 / ISO 27001 / NIST; what auditors actually check (logs, access reviews, patching) — big signal in enterprise & remote hiring
  - 📚 [SOC 2 (AICPA)](https://www.aicpa-cima.com/topic/audit-assurance/audit-and-assurance-greater-than-soc-2) · official-docs · 📖 official
  - 📚 [ISO/IEC 27001](https://www.iso.org/standard/27001) · official-docs · ✅ verified
  - 📚 [NIST CSF](https://www.nist.gov/cyberframework) · official-docs · 📖 official

##### Sub-topic research

**Interview focus:**

- STRIDE — walk me through threat modeling a simple web service
- Zero Trust: what does 'never trust, always verify' mean operationally (mTLS, identity, microsegmentation)?
- ISO 27001 vs SOC 2 vs NIST CSF — what do they certify and when does a company need each?
- How does compliance show up in your daily work (audit trails, change control, evidence)?

**Practice:** STRIDE-model a 2-service app; map its controls to ISO 27001/SOC 2 categories; write the 'who can access what and how we prove it' evidence list for an audit.

**Depth note:** Compliance answers show enterprise-readiness — tie controls to evidence, and know which standard maps to which business need.

#### Cost responsibility

- **Cost responsibility** — Asking 'how much does this cost?' before building
  - 📚 [AWS Cost Management](https://docs.aws.amazon.com/cost-management/) · official-docs · 📖 official
  - 📚 [FinOps Foundation](https://www.finops.org/) · community · 📖 official

- **FinOps basics** — Tagging discipline, right-sizing, reservations vs on-demand
  - 📚 [FinOps Foundation](https://www.finops.org/) · community · 📖 official
  - 📚 [AWS Cost Management](https://docs.aws.amazon.com/cost-management/) · official-docs · 📖 official

##### Sub-topic research

**Interview focus:**

- A team's bill is exploding — how do you investigate and communicate the fix?
- How do you make cost a team responsibility (budgets, tagging, dashboards, reviews)?
- Right-sizing vs scheduling vs spot — order your cost levers for a stateless service
- How do you prove cost savings to management (before/after numbers)?

**Practice:** Tag all resources; build a cost dashboard; set budget alerts; right-size + schedule instances; run a monthly cost review with a before/after report.

**Depth note:** Cost responsibility is the 'ownership' interview — quantify everything and always show before/after evidence.

#### Team skills

- **Code review** — Reviewing others' infra/scripts with a reliability lens
  - 📚 [Google eng-practices: Code review](https://google.github.io/eng-practices/review/) · official-docs · 📖 official
  - 📚 [Google SRE books](https://sre.google/books/) · book · 📖 official

- **Mentoring & blameless culture** — Teaching juniors, modeling calm, writing the culture you want
  - 📚 [Google SRE: Postmortem culture](https://sre.google/sre-book/postmortem-culture/) · book · 📖 official
  - 📚 [Google SRE books](https://sre.google/books/) · book · 📖 official

##### Sub-topic research

**Interview focus:**

- Tell me about a time you disagreed with a teammate on approach — what happened and how did you resolve it?
- How do you give a code review that's firm but kind? What do you check first?
- How do you onboard a new engineer — what do they need in week 1?
- How do you communicate with a non-technical stakeholder during an outage?
- How do you run a blameless postmortem with a remote, async team spread across time zones?

**Practice:** Review a real PR with a written, structured review; mentor someone through one task; write a 1-page onboarding checklist for a new team member; practice incident comms aloud.

**Depth note:** Team-skill answers (review, mentoring, comms) are the behavioral layer — use STAR stories with concrete outcomes.

#### Module research

**Interview focus:**

- On-call: runbooks, severity levels, escalation paths, incident communication, post-incident review, on-call rotations & load
- Documentation: runbooks, architecture docs, decision records (ADRs), README discipline, wiki hygiene
- Security basics: least privilege, RBAC, secrets management (vault/SOPS/External Secrets), SSH hardening, TLS, container security (content trust, resource limits, Bench Security), supply chain (image scanning, SBOM)
- Threat modeling: STRIDE, attack surface review, threat model as code, OWASP Top 10 awareness
- Cost: FinOps — right-sizing, spot/reserved mix, tagging, cost allocation, idle resource cleanup, budget alerts
- Compliance/audit: audit logs, access reviews, SOC2/ISO awareness, data retention
- SRE crossover: toil reduction, automation of repetitive ops, error budgets as guardrails
- Team skills: code review culture (security + reliability lens), mentoring juniors, cross-team collaboration, incident communication (status updates, stakeholder comms), teaching/onboarding docs, pushing back on scope with data
- On-call deep: rotation load, severity + escalation, runbook quality, post-incident communication

**Demand:** Ownership skills (on-call maturity, docs, security, cost) are the hidden differentiators for senior + staff roles — they rarely appear as headline JD keywords but decide hiring at the top of the funnel. Cost optimization is exploding in demand in the Indian market (FinOps roles).

**Verified resources:**

- 📖 [OWASP Top 10](https://owasp.org/www-project-top-ten/) · official-docs
- 📖 [Google SRE Workbook — On-Call (free)](https://sre.google/workbook/on-call/) · book
- 📖 [FinOps Foundation](https://www.finops.org/) · community
- 📖 [Ansible Vault docs](https://docs.ansible.com/ansible/latest/vault_guide/index.html) · official-docs

**Depth sequence:**

- Week 1: on-call — write runbooks for your own services; define severity levels + escalation tree
- Week 2: docs — architecture diagram + ADR for one project; README discipline
- Week 3: security — threat-model your A06 projects (STRIDE); harden SSH, containers, secrets; scan images
- Week 4: cost — tag all cloud resources, build a cost dashboard, right-size + schedule instances, budget alerts
- Practice: every project ships with a runbook, ADR, and security checklist

---

### B09 🏆 Mid interview prep + portfolio upgrade

> **Mental model:** The index above is the knowledge; the interview needs the story. Two things convert it: a portfolio that shows mid-level behavior, and the incident war-story.
> **Duration:** Weeks 11–12 · **Type:** final
>
> **Exit test:** You can answer the 2am litmus test fluently, design a deployment pipeline, and point to a repo that is unmistakably mid-level.
> **Depends on:** B01–B08 — the full Phase B experience.

#### The 2am litmus test

- **The 2am litmus test** — Practice answering: 'A service is slow in production at 2am. Walk me through what you do.' (Traces first → which metric moved → bad deploy? → dependency? → escalate when?)
  - 📚 [Google SRE books](https://sre.google/books/) · book · 📖 official
  - 📚 [Awesome SRE](https://github.com/dastergon/awesome-sre) · community · 📖 official

- **Debugging story frameworks** — Symptom → hypothesis → isolate → confirm → fix → verify; speak it fluently
  - 📚 [Google SRE books](https://sre.google/books/) · book · 📖 official
  - 📚 [Awesome SRE](https://github.com/dastergon/awesome-sre) · community · 📖 official

##### Sub-topic research

**Interview focus:**

- You're alone at 2am and the deploy is broken — walk me through the decision: roll forward, roll back, or freeze?
- What's in your runbook that makes the 2am call safe?
- Kill a service, deploy a bad artifact, roll back — do it live and explain each step
- What does 'done' look like at 2am — what proves the system is actually stable again?

**Practice:** The week-4 drill: kill a service → deploy a bad artifact → roll back with verification — solo, timed, from memory; then write the decision tree for roll-forward-vs-back-vs-freeze.

**Depth note:** This is the ownership litmus — interviewers want to hear calm, ordered, verified recovery, not heroics.

#### System design for ops

- **Design a deployment pipeline** — Stages, gates, rollback, observability; talk through trade-offs
  - 📚 [Argo CD docs](https://argo-cd.readthedocs.io/en/stable/) · official-docs · ✅ verified
  - 📚 [GitHub Actions docs](https://docs.github.com/en/actions) · official-docs · 📖 official

- **Design monitoring for a service** — SLIs, dashboards, alerting, on-call
  - 📚 [Prometheus docs](https://prometheus.io/docs/introduction/overview/) · official-docs · ✅ verified
  - 📚 [Google SRE books](https://sre.google/books/) · book · 📖 official

##### Sub-topic research

**Interview focus:**

- Design a CI/CD system for a team of 20 — scale, failure modes, cost
- Design a monitoring/alerting system for a microservices fleet — pillars, cardinality, alerting
- Design an autoscaling setup for a stateless API — metrics, cooldown, burst handling
- Design a multi-region deployment — failover, data replication, RTO/RPO
- What breaks at 10x traffic and how do you find it?

**Practice:** Practice 4 design problems (CI/CD, monitoring, autoscaling, multi-region); draw diagrams; present each aloud in 10 minutes with scale + failure modes + cost.

**Depth note:** Ops system design is scored on structure (requirements → components → failure modes → scale) — always answer in that shape.

#### Your war-story

- **Your incident war-story** — One real (or practiced) incident, told end-to-end: symptom → diagnosis → fix → postmortem → prevention
  - 📚 [Google SRE: Postmortem culture](https://sre.google/sre-book/postmortem-culture/) · book · 📖 official
  - 📚 [Blameless (blog)](https://www.blameless.com/blog) · community · 📖 official

##### Sub-topic research

**Interview focus:**

- Tell me about the worst production incident you've handled — what happened, what did you do, what changed after?
- What's a project you're proud of and what was genuinely hard about it?
- Tell me about a time you automated away a painful task — before/after numbers
- What's a mistake you made and what did it teach you?

**Practice:** Write 3 STAR war-stories (incident, automation win, hard project); rehearse each in 2 minutes; tighten them until they're 90% outcome-focused.

**Depth note:** War-stories ARE the interview — a calm, quantified, outcome-focused story beats any list of technologies.

#### Behavioral & ownership

- **Ownership stories** — Times you owned a system, escalated well, or mentored someone; STAR format
  - 📚 [Google SRE books](https://sre.google/books/) · book · 📖 official
  - 📚 [Google eng-practices: Review](https://google.github.io/eng-practices/review/) · official-docs · 📖 official

##### Sub-topic research

**Interview focus:**

- Why DevOps/SRE and not pure development? What draws you to ownership?
- Tell me about a time you owned something end-to-end — what did 'done' mean?
- How do you handle being on-call for a system you didn't build?
- How do you prioritize when everything is urgent (framework, not vibes)?
- Why do you want a remote role, and how do you prove you'll be productive without supervision?
- How do you prepare differently for a remote-first product company vs an Indian services firm — what does each screen for?

**Practice:** Write STAR stories for 10 behavioral scenarios; rehearse 'why SRE/DevOps' until it's 30 seconds and genuine; do a mock behavioral round.

**Depth note:** Behavioral rounds reward ownership language — 'I owned, I measured, I improved' beats 'we/team did' every time.

#### Portfolio upgrade

- **Portfolio upgrade** — One repo that is unmistakably mid-level: GitOps-managed, Terraform-defined, SLO'd, chaos-tested
  - 📚 [Argo CD docs](https://argo-cd.readthedocs.io/en/stable/) · official-docs · ✅ verified
  - 📚 [Terraform Tutorials](https://developer.hashicorp.com/terraform/tutorials) · official-docs · ✅ verified
  - 📚 [Prometheus docs](https://prometheus.io/docs/introduction/overview/) · official-docs · ✅ verified

- 🟡 **Community project ladder** — roadmap.sh's DevOps projects as an externally-validated build list: intermediate → Ansible config mgmt, Terraform IaC, automated DB backups, bastion host; advanced → blue-green deploy, Prometheus+Grafana, service discovery (beginner tier lives in Phase A Capstone)
  - 📚 [roadmap.sh DevOps projects](https://roadmap.sh/devops/projects) · community · ✅ verified
  - 📚 [roadmap.sh AWS projects](https://roadmap.sh/aws/projects) · community · ✅ verified
  - 📚 [roadmap.sh DevOps roadmap](https://roadmap.sh/devops) · community · ✅ verified

##### Sub-topic research

**Interview focus:**

- Walk me through your GitHub — how is it organized and which 3 repos prove your level?
- What's in a repo that makes a reviewer trust it (README, diagrams, CI badge, runbook, ADR)?
- Record a 3-minute demo — what do you show and what do you leave out?
- How do you tailor your portfolio to the roles you're applying for?

**Practice:** Polish GitHub (READMEs, diagrams, CI badges, runbooks); record a 3-min walkthrough video; do 3 full mock interview cycles (Linux/cloud, K8s/IaC, behavioral/system design).

**Depth note:** The portfolio is your 24/7 interviewer — repos that look production-owned (docs, CI, runbooks) do half the interview for you.

#### Module research

**Interview focus:**

- System design for ops: design a CI/CD system, a monitoring/alerting system, an autoscaling setup, a multi-region deployment — scale, failure modes, cost
- Behavioral: why DevOps/SRE vs SDE, on-call experience, incident stories (STAR), collaboration, blameless culture
- Coding: shell + python live tasks (file processing, log parsing, API automation), basic DSA awareness (arrays, strings, hashmaps — SRE coding questions like pacific-atlantic, good nodes)
- Portfolio walkthrough: deploy architecture diagram, GitHub profile, live demo, metrics showing impact
- Mock interviews: 30-min Linux + 30-min cloud/containers + 30-min behavioral per cycle
- Salary anchoring: SRE 6-15 LPA fresher / 13-26 LPA experienced (India, InterviewBit); DevOps comparable band in Pune
- The 2am litmus test: could you deploy AND roll back your service alone at 2am? one-command deploy, automated rollback, decision tree (roll forward vs roll back vs freeze) — the seniority question

**Demand:** Final polish determines offer level: portfolio + system design + behavioral stories. Candidates who demo a deployed, monitored, GitOps-driven project quote +20-30% over candidates who only list skills. Market references: marketData.regions rows for Pune/remote/international.

**Verified resources:**

- ✅ [InterviewBit System Design Interview Questions](https://www.interviewbit.com/system-design-interview-questions/) · interactive
- ✅ [InterviewBit SRE Interview Questions (FAQ + coding)](https://www.interviewbit.com/sre-interview-questions/) · interactive
- ✅ [roadmap.sh DevOps Projects (portfolio)](https://roadmap.sh/devops/projects) · interactive
- 📖 [Google SRE Book + Workbook (free)](https://sre.google/books/) · book

**Depth sequence:**

- Week 1: system design for ops — practice 4 design problems (CI/CD, monitoring, autoscaling, multi-region)
- Week 2: behavioral — write STAR stories for 10 scenarios; rehearse 'why SRE/DevOps'
- Week 3: coding — shell + python live drills daily; solve 2 SRE coding problems (pacific-atlantic, good nodes)
- Week 4: portfolio — polish GitHub, READMEs, diagrams; record demo video; schedule mock interviews
- Final: 3 full mock interview cycles (Linux+cloud / K8s+IaC / behavioral+system design) before real interviews
- Week 4 add: 2am drill — kill a service, deploy a bad artifact, roll back within 15 min alone, all from runbooks

---

## Appendix: Market Data

### Pune, India (home market)

| Level | Salary range | Sources |
| --- | --- | --- |
| Fresher (0–2 yrs) | ₹3.6–8 LPA | devopstraininginstitute 2025; SalaryExpert entry ₹15.9L (1–3 yrs); Tutorac 2026 India fresher ₹4–7L |
| Mid (2–5 yrs) | ₹8–15 LPA | devopstraininginstitute; Lavatech 2026 ₹8–14L; salaryinsight.in 2026 mid-career avg ₹19.9L; Glassdoor India 90th pct ₹16.5L |
| Senior (5–8 yrs) | ₹15–28 LPA | devopstraininginstitute; SalaryExpert senior ₹25.9L; salaryinsight.in 2026 senior ₹23.1–50.4L; Tutorac 2026 senior ₹15–28L |
| Lead/Architect (8+) | ₹23–60+ LPA | devopstraininginstitute; Tutorac 2026 lead ₹30–60L+; switchtodevops 2026 lead ₹30–60L+ |
| Freelance | ₹800–3,000/hr | devopstraininginstitute; switchtodevops |

- ~450k tech professionals; 25% YoY growth in DevOps openings
- Hubs: Hinjewadi 50% / Magarpatta 30% / Kharadi 15%
- Certs (AWS DevOps, CKA) add ~20–30%; deep K8s + Terraform add another ~15–25% (2026)
- Glassdoor: Pune pays ~3% below national average (90th pct ₹16.5L)
- Big hirers: TCS, Infosys, Accenture, Capgemini, IBM, HCL, Amdocs, ZS, Barclays, PhonePe
- Production-environment ownership (incidents, on-call, SLOs) commands the premium band

### India (national, 2026 refresh)

| Level | Salary range | Sources |
| --- | --- | --- |
| Fresher (0–2 yrs) | ₹4–7 LPA | Tutorac 2026; switchtodevops 2026 |
| Mid (2–5 yrs) | ₹8–15 LPA | Tutorac 2026; Nexson 2026; TrueDirectory 2026 |
| Senior (5–8 yrs) | ₹15–28 LPA | Tutorac 2026; switchtodevops 2026 ₹18–35L; TrueDirectory 2026 ₹18–35L+ |
| Lead/Architect (8+) | ₹30–60+ LPA | Tutorac 2026; switchtodevops 2026; Nexson 2026 (Hyd/Blr top ₹25–45L) |
| Platform Engineer (India, new role) | avg ₹17.5L · entry (1–3y) ₹12.65L · Bangalore top-10% ₹45–70L | SalaryExpert 2026; SIVARO 2026 geographic table |

- GCC (global capability centres) pay more than Indian services firms — same skills, ~20–40% premium
- Multi-cloud + Kubernetes + Terraform unlock the highest bands (Nexson 2026)
- Platform engineer is the 2026 evolution of the DevOps title — owns IDP + SLOs + cloud bill (SIVARO 2026)
- Kubernetes/Terraform skill premium confirmed across Tutorac, TrueDirectory, Nexson, switchtodevops

### Remote India

| Level | Salary range | Sources |
| --- | --- | --- |
| Fresher | ₹4–8 LPA | switchtodevops |
| Mid (2–5 yrs) | ₹10–22 LPA | switchtodevops |
| Senior (5–8 yrs) | ₹20–40 LPA | switchtodevops; Tutorac 2026 remote ₹18–35L |
| Lead/Architect | ₹35–70 LPA | switchtodevops |
| International remote (US/EU pay) | $40k–90k (₹33–75L) | switchtodevops |

- Remote pays ~5–15% less than metro on-site, but net win after commute/relocation
- ~40% of India DevOps roles have remote flexibility; fully remote ~15–20%, growing ~25% YoY
- Top remote employers (reported): GitLab ₹25–55L · HashiCorp ₹30–60L · Confluent ₹28–55L · Elastic ₹26–50L · Razorpay ₹18–42L · Postman ₹20–45L
- Remote-first firms (GitLab, Stripe, Datadog) pay near-SF rates regardless of location (SIVARO 2026)

### International

| Level | Salary range | Sources |
| --- | --- | --- |
| US DevOps/SRE mid-level | $129k–142k | ERI/SalaryExpert 2026 |
| US platform/SRE — Junior (0–2 yrs) | $90K–160K TC | SIVARO 2026; Levels.fyi via SIVARO |
| US platform/SRE — Mid (3–5 yrs) | $130K–250K TC | SIVARO 2026 |
| US platform/SRE — Senior (5–8 yrs) | $180K–400K TC | SIVARO 2026; Glassdoor Remote platform 90th pct $195.6K |
| US platform/SRE — Staff+ (8+ yrs) | $220K–600K+ TC | SIVARO 2026 (OpenAI staff offer $660K yr-1) |
| FAANG senior (L5) | $350K–500K TC | SIVARO 2026; Levels.fyi |
| Remote US (LCOL) | $180K–250K | SIVARO 2026 (Tulsa senior $195K base) |
| UK London | £130K–180K | SIVARO 2026 |
| EU Berlin | €120K–160K | SIVARO 2026 |

- Stack Overflow 2025: 32.4% fully remote (US 45%); Terraform most admired infra tool; GitHub top collab, GitLab #3; India = 3rd-largest respondent base; 84% use AI tools
- DORA: the canonical model = Four Key Metrics + SLOs — exactly what B04/B06 teach
- CNCF 2024: ~1/4 of orgs run nearly all workloads cloud-native; Kubernetes is the default platform
- 2026 premium stack (15–25% above base): deep K8s (CNI/CSI/admission controllers), Terraform custom providers, ArgoCD/Flux, Crossplane, Istio/Cilium, OpenTelemetry, Backstage/Port IDPs (SIVARO 2026)
- AI infrastructure skill (GPU orchestration, vLLM/TensorRT-LLM inference) commands +20–30% (SIVARO 2026)
- Legacy stack (Jenkins-only, Puppet/Chef, Nagios) = salary discount; on-call burden usually compensated ~10–15%
- Cert myth (SIVARO 2026): general certs (CKA etc.) don't move salary vs strong projects — rare certs (GCP PCA, NVIDIA AI-infra) do

### Premium skills

| Skill | Premium | Module |
| --- | --- | --- |
| Kubernetes production experience | required in ~90% of remote roles | B01 |
| Terraform / IaC | 'non-negotiable' | B02 |
| GitOps (Argo CD) | ~+30% | B05 |
| Service mesh (Istio/Linkerd) | ~+30% | B01 |
| Observability stack (Prometheus/Grafana) | core | B04 |
| DevSecOps / security automation | ~+30% | B08 |
| Multi-cloud | ~+30% | B03 |
| Jenkins + GitLab CI | core must-have (India enterprise) | B05 |
| Ansible | core must-have (India enterprise) | B07 |
| Production AI / GPU infra (vLLM, GPU scheduling) | +20–30% (2026 fastest-growing) | B01/B08 |
| Internal developer platforms (Backstage/Port) | top-band differentiator | B05 |
| Deep Kubernetes (CNI/CSI/admission controllers) | +15–25% vs surface-level k8s | B01 |

### Certifications

| Certification | Effect | When |
| --- | --- | --- |
| AWS Certified Cloud Practitioner | cheapest entry-level proof | after Phase A |
| AWS DevOps Engineer (associate) | ~+20–30% | after B03 |
| CKA (Certified Kubernetes Admin) | ~+15–25% | after B01 |
| GCP Professional Cloud Architect (rare-signal) | commands premium only for GCP-migrating firms | optional — after B03 |
| NVIDIA AI Infrastructure (rare-signal) | premium for GPU/AI platform roles | optional — after B01 |

---

## Appendix: Community Cross-Check (roadmap.sh)

> Source: **roadmap.sh (2026)**
> **githubStars:** 364K (6th most-starred repo) · **users:** 2.8M registered · **devopsTrackers:** 58K+ · **note:** Full-inventory verified from repo content files (github.com/nilbuild/developer-roadmap, roadmaps/<slug>/content/, branch master) · **inventoryCounts:** {"devops": "~95 topics", "kubernetes": "~68 topics", "aws": "~105 topics", "terraform": "~130 topics", "devsecops": "~95 topics"}

| Area | Our stance | roadmap.sh |
| --- | --- | --- |
| Languages | Python + Bash (B07) | Python, Go, Rust, JS/Node |
| k8s autoscaling | HPA (B01) | HPA + VPA + Cluster Autoscaler |
| k8s scheduling | taints + PDBs + quotas (B01) | taints, topology spread, priorities, evictions |
| IaC | Terraform + OpenTofu (B02) | Terraform + CDK + CloudFormation + Pulumi |
| Config mgmt | Ansible (B07) | Ansible, Chef, Puppet |
| CI/CD | GH Actions + Jenkins + GitLab CI (B05) | GH Actions, GitLab CI, Jenkins, CircleCI |
| Secrets | Vault + SOPS (B08) | Sealed Secrets, Vault |
| Security | Trivy, Kyverno, SLSA, Vault (B08) | DevSecOps roadmap (SBOM, Zero Trust, IR) |
| k8s extensions | B01 (Extensions & Operators) | CRDs, Operators, custom controllers |
| Terraform depth | B02 (quality gates) | testing, Checkov/Terrascan, Terragrunt |
| AWS containers | B03 | ECS/Fargate, ECR, API Gateway, DynamoDB |
| Security model | B08 | threat modeling, Zero Trust, SOC 2/ISO 27001 |
| Projects | A06 (beginner) + B09 (advanced) | DevOps project ladder (beginner→advanced) |

**Trackers:**

- https://roadmap.sh/devops
- https://roadmap.sh/kubernetes
- https://roadmap.sh/aws
- https://roadmap.sh/devsecops
- https://roadmap.sh/devops/projects

---

## Appendix: Sources

| Resource | URL |
| --- | --- |
| Linux Journey | https://linuxjourney.com/ |
| Ubuntu Command Line for Beginners | https://ubuntu.com/tutorials/command-line-for-beginners |
| MIT Missing Semester | https://missing.csail.mit.edu/ |
| Linux Journey: Permissions | https://linuxjourney.com/lesson/file-permissions |
| Linux Journey: Process Management | https://linuxjourney.com/lesson/process-management |
| KodeKloud Linux Basics | https://kodekloud.com/courses/the-linux-basics-course/ |
| Linux Journey: SSH | https://linuxjourney.com/lesson/ssh |
| DigitalOcean SSH guide | https://www.digitalocean.com/community/tutorials/how-to-use-ssh-to-connect-to-a-remote-server |
| Git Immersion | https://gitimmersion.com/ |
| GitHub Skills | https://skills.github.com/ |
| Oh My Git! | https://ohmygit.org/ |
| Pro Git book | https://git-scm.com/book/en/v2 |
| Pro Git: Undoing | https://git-scm.com/book/en/v2/Git-Basics-Undoing-Things |
| GitHub Hello World | https://docs.github.com/en/get-started/quickstart/hello-world |
| freeCodeCamp: Computer Networking course | https://www.youtube.com/watch?v=qiQR5rTSshw |
| MDN HTTP Overview | https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview |
| curl docs | https://curl.se/docs/ |
| howdns.works | https://howdns.works/ |
| Docker Get Started | https://docs.docker.com/get-started/ |
| Play with Docker | https://labs.play-with-docker.com/ |
| Docker Curriculum | https://docker-curriculum.com/ |
| Docker Compose overview | https://docs.docker.com/compose/ |
| GitHub Actions docs | https://docs.github.com/en/actions |
| Awesome CI/CD | https://github.com/ciandcd/awesome-ciandcd |
| Render free tier docs | https://render.com/docs/free |
| Fly.io docs | https://fly.io/docs/ |
| Docker health checks | https://docs.docker.com/reference/compose-file/services/#healthcheck |
| roadmap.sh DevOps projects | https://roadmap.sh/devops/projects |
| server-stats | https://roadmap.sh/projects/server-stats |
| log archive tool | https://roadmap.sh/projects/log-archive-tool |
| basic Dockerfile | https://roadmap.sh/projects/basic-dockerfile |
| Kubernetes docs tutorials | https://kubernetes.io/docs/tutorials/ |
| k3s | https://k3s.io/ |
| KodeKloud | https://kodekloud.com/ |
| Terraform docs | https://developer.hashicorp.com/terraform/docs |
| Google SRE books (free) | https://sre.google/books/ |
| Awesome SRE | https://github.com/dastergon/awesome-sre |
| Kubernetes Workloads | https://kubernetes.io/docs/concepts/workloads/ |
| Kubernetes Concepts | https://kubernetes.io/docs/concepts/ |
| Kubernetes Services & Networking | https://kubernetes.io/docs/concepts/services-networking/ |
| Kubernetes: Persistent Volumes | https://kubernetes.io/docs/concepts/storage/persistent-volumes/ |
| Kubernetes: Namespaces | https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/ |
| kubectl Cheatsheet | https://kubernetes.io/docs/reference/kubectl/cheatsheet/ |
| Kubernetes: Taints & Tolerations | https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/ |
| Kubernetes: Rolling updates | https://kubernetes.io/docs/tutorials/kubernetes-basics/update/update-intro/ |
| Helm docs | https://helm.sh/docs/ |
| Kubernetes: Debugging | https://kubernetes.io/docs/tasks/debug/ |
| Kubernetes: Managing resources | https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/ |
| Kubernetes: HPA | https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/ |
| Kubernetes: VPA | https://kubernetes.io/docs/concepts/workloads/autoscaling/vertical-pod-autoscale/ |
| Karpenter | https://karpenter.sh/ |
| Cluster Autoscaler | https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler |
| Kubernetes: Configure PDBs | https://kubernetes.io/docs/tasks/run-application/configure-pdb/ |
| Kubernetes: Disruptions | https://kubernetes.io/docs/concepts/workloads/pods/disruptions/ |
| Kubernetes: ResourceQuota | https://kubernetes.io/docs/concepts/policy/resource-quotas/ |
| Kubernetes: LimitRange | https://kubernetes.io/docs/concepts/policy/limit-range/ |
| Kubernetes: Topology Spread Constraints | https://kubernetes.io/docs/concepts/scheduling-eviction/topology-spread-constraints/ |
| Kubernetes: Assigning pods to nodes | https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/ |
| Kubernetes: RBAC | https://kubernetes.io/docs/reference/access-authn-authz/rbac/ |
| Kubernetes: RBAC good practices | https://kubernetes.io/docs/concepts/security/rbac-good-practices/ |
| Kubernetes: Pod Security Standards | https://kubernetes.io/docs/concepts/security/pod-security-standards/ |
| Kubernetes: Network Policies | https://kubernetes.io/docs/concepts/services-networking/network-policies/ |
| Cilium docs | https://docs.cilium.io/ |
| Istio docs | https://istio.io/latest/docs/ |
| Linkerd docs | https://linkerd.io/2.16/overview/ |
| Kubernetes: Custom Resources | https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/ |
| Operator pattern | https://kubernetes.io/docs/concepts/extend-kubernetes/operator/ |
| Cluster API | https://cluster-api.sigs.k8s.io/ |
| AWS EKS docs | https://docs.aws.amazon.com/eks/ |
| kind | https://kind.sigs.k8s.io/ |
| Terraform: Language | https://developer.hashicorp.com/terraform/language |
| Terraform Tutorials | https://developer.hashicorp.com/terraform/tutorials |
| Terraform: Values | https://developer.hashicorp.com/terraform/language/values |
| Terraform: Expressions | https://developer.hashicorp.com/terraform/language/expressions |
| Terraform: Meta-arguments | https://developer.hashicorp.com/terraform/language/meta-arguments/for_each |
| OpenTofu docs | https://opentofu.org/docs/ |
| AWS CloudFormation docs | https://docs.aws.amazon.com/cloudformation/ |
| AWS CDK docs | https://docs.aws.amazon.com/cdk/ |
| Terraform: State | https://developer.hashicorp.com/terraform/language/state |
| Terraform Tutorials: cloud-get-started | https://developer.hashicorp.com/terraform/tutorials/cloud-get-started |
| Terraform: CLI state commands | https://developer.hashicorp.com/terraform/cli/commands/state |
| Terraform: Import | https://developer.hashicorp.com/terraform/cli/import |
| Terraform: Workspaces | https://developer.hashicorp.com/terraform/language/state/workspaces |
| Terraform: Modules | https://developer.hashicorp.com/terraform/language/modules |
| Terraform: Module sources | https://developer.hashicorp.com/terraform/language/modules/sources |
| Terraform Registry | https://registry.terraform.io/ |
| Terragrunt docs | https://terragrunt.gruntwork.io/docs/ |
| Terraform: Plan | https://developer.hashicorp.com/terraform/cli/commands/plan |
| Terraform: Lifecycle | https://developer.hashicorp.com/terraform/language/meta-arguments/lifecycle |
| Terraform: CLI commands | https://developer.hashicorp.com/terraform/cli/commands |
| Checkov | https://www.checkov.io/ |
| Terraform: Test | https://developer.hashicorp.com/terraform/language/tests |
| AWS EC2 docs | https://docs.aws.amazon.com/ec2/ |
| AWS Free Tier | https://aws.amazon.com/free/ |
| AWS S3 docs | https://docs.aws.amazon.com/s3/ |
| AWS Well-Architected | https://docs.aws.amazon.com/wellarchitected/ |
| AWS RDS docs | https://docs.aws.amazon.com/rds/ |
| AWS Lambda docs | https://docs.aws.amazon.com/lambda/ |
| AWS Compute | https://aws.amazon.com/lambda/ |
| AWS ECS docs | https://docs.aws.amazon.com/ecs/ |
| AWS Fargate | https://aws.amazon.com/fargate/ |
| AWS ECR | https://docs.aws.amazon.com/ecr/ |
| AWS API Gateway docs | https://docs.aws.amazon.com/apigateway/ |
| AWS DynamoDB docs | https://docs.aws.amazon.com/dynamodb/ |
| AWS VPC docs | https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html |
| AWS VPC: Security groups | https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html |
| AWS Route 53 docs | https://docs.aws.amazon.com/route53/ |
| AWS Networking | https://docs.aws.amazon.com/whitepapers/latest/aws-vpc-connectivity-options/welcome.html |
| AWS Elastic Load Balancing docs | https://docs.aws.amazon.com/elasticloadbalancing/ |
| AWS EC2 Auto Scaling docs | https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html |
| AWS WAF Framework | https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html |
| AWS IAM docs | https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html |
| AWS IAM: Best practices | https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html |
| Azure DevOps docs | https://learn.microsoft.com/en-us/azure/devops/ |
| GCP DevOps | https://cloud.google.com/architecture/devops |
| AWS Cost Management | https://docs.aws.amazon.com/cost-management/ |
| AWS Well-Architected: Cost pillar | https://docs.aws.amazon.com/wellarchitected/latest/cost-optimization-pillar/welcome.html |
| AWS CloudWatch docs | https://docs.aws.amazon.com/cloudwatch/ |
| Prometheus Overview | https://prometheus.io/docs/introduction/overview/ |
| Prometheus: Querying basics (PromQL) | https://prometheus.io/docs/prometheus/latest/querying/basics/ |
| Prometheus: Recording rules | https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/ |
| Prometheus: Instrumenting | https://prometheus.io/docs/instrumenting/clientlibs/ |
| Grafana docs | https://grafana.com/docs/ |
| Grafana Loki docs | https://grafana.com/docs/loki/latest/ |
| OpenTelemetry docs | https://opentelemetry.io/docs/ |
| OpenTelemetry: Distributed tracing (traces) | https://opentelemetry.io/docs/concepts/signals/traces/ |
| OpenTelemetry: Sampling | https://opentelemetry.io/docs/concepts/sampling/ |
| Prometheus: Alerting best practices | https://prometheus.io/docs/practices/alerting/ |
| Prometheus: Alerting | https://prometheus.io/docs/alerting/latest/overview/ |
| Prometheus: Alertmanager | https://prometheus.io/docs/alerting/latest/alertmanager/ |
| Google SRE: Monitoring | https://sre.google/sre-book/monitoring-distributed-systems/ |
| GitHub Actions: Caching | https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows |
| Jenkins docs | https://www.jenkins.io/doc/ |
| Jenkins Pipeline tutorial | https://www.jenkins.io/doc/pipeline/tour/getting-started/ |
| GitLab CI docs | https://docs.gitlab.com/ee/ci/ |
| GitLab: first pipeline | https://docs.gitlab.com/ci/quick_start/ |
| GitHub Actions: Environments | https://docs.github.com/en/actions/deployment |
| GitHub Actions: Secrets | https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions |
| GitHub Actions: Security | https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions |
| Argo CD docs | https://argo-cd.readthedocs.io/en/stable/ |
| Flux docs | https://fluxcd.io/docs/ |
| Argo CD: User guide | https://argo-cd.readthedocs.io/en/stable/user-guide/ |
| Flux: Core concepts | https://fluxcd.io/flux/concepts/ |
| Argo Rollouts docs | https://argoproj.github.io/argo-rollouts/ |
| Flagger docs | https://flagger.app/ |
| GitHub Packages | https://docs.github.com/en/packages |
| Docker Registry docs | https://docs.docker.com/registry/ |
| Google SRE: Postmortem culture | https://sre.google/sre-book/postmortem-culture/ |
| Google SRE: Being on-call | https://sre.google/sre-book/being-on-call/ |
| Principles of Chaos Engineering | https://principlesofchaos.org/ |
| Chaos Monkey | https://netflix.github.io/chaosmonkey/ |
| Kubernetes docs | https://kubernetes.io/docs/ |
| k6 docs | https://k6.io/docs/ |
| PostgreSQL backup docs | https://www.postgresql.org/docs/current/backup-dump.html |
| Google SRE: Data integrity | https://sre.google/sre-book/data-integrity/ |
| AWS Disaster Recovery | https://aws.amazon.com/disaster-recovery/ |
| Velero docs | https://velero.io/docs/ |
| Velero: disaster recovery | https://velero.io/docs/v1.18/disaster-case |
| BashGuide (wooledge) | https://mywiki.wooledge.org/BashGuide |
| ShellCheck | https://github.com/koalaman/shellcheck |
| jq manual | https://jqlang.github.io/jq/ |
| Python docs | https://docs.python.org/3/ |
| Real Python | https://realpython.com/ |
| Go docs | https://go.dev/doc/ |
| Go by Example | https://gobyexample.com/ |
| BashGuide: Input and Output | https://mywiki.wooledge.org/BashGuide/InputAndOutput |
| Python logging docs | https://docs.python.org/3/howto/logging.html |
| BashGuide: Practices | https://mywiki.wooledge.org/BashGuide/Practices |
| crontab.guru | https://crontab.guru/ |
| systemd timers | https://www.freedesktop.org/software/systemd/man/latest/systemd.timer.html |
| GNU Make manual | https://www.gnu.org/software/make/manual/make.html |
| Ansible docs | https://docs.ansible.com/ansible/latest/index.html |
| Ansible: Getting started | https://docs.ansible.com/ansible/latest/getting_started/index.html |
| Ansible Vault | https://docs.ansible.com/ansible/latest/vault_guide/index.html |
| Ansible: modules intro | https://docs.ansible.com/ansible/latest/module_plugin_guide/modules_intro.html |
| Ansible vs Terraform (Red Hat) | https://www.redhat.com/en/topics/automation/ansible-vs-terraform |
| Google Technical Writing courses | https://developers.google.com/tech-writing/ |
| ADR GitHub | https://adr.github.io/ |
| OWASP | https://owasp.org/ |
| GitHub Advisory Database | https://github.com/advisories |
| Trivy docs | https://trivy.dev/docs/ |
| Trivy: vulnerability scanning | https://trivy.dev/docs/latest/guide/scanner/vulnerability/ |
| SLSA framework | https://slsa.dev/ |
| Trivy: SBOM | https://trivy.dev/docs/latest/guide/supply-chain/sbom/ |
| Kyverno docs | https://kyverno.io/docs/ |
| OPA docs | https://www.openpolicyagent.org/docs/latest/ |
| HashiCorp Vault docs | https://developer.hashicorp.com/vault/docs |
| Vault: getting started | https://developer.hashicorp.com/vault/tutorials/getting-started |
| External Secrets Operator | https://external-secrets.io/ |
| OWASP: Threat modeling | https://owasp.org/www-community/Threat_Modeling |
| Microsoft STRIDE | https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool-threats |
| NIST SP 800-207 (Zero Trust) | https://csrc.nist.gov/pubs/sp/800/207/final |
| Zero Trust architecture (Google Cloud) | https://cloud.google.com/architecture/security/zero-trust |
| SOC 2 (AICPA) | https://www.aicpa-cima.com/topic/audit-assurance/audit-and-assurance-greater-than-soc-2 |
| ISO/IEC 27001 | https://www.iso.org/standard/27001 |
| NIST CSF | https://www.nist.gov/cyberframework |
| FinOps Foundation | https://www.finops.org/ |
| Google eng-practices: Code review | https://google.github.io/eng-practices/review/ |
| Blameless (blog) | https://www.blameless.com/blog |
| roadmap.sh AWS projects | https://roadmap.sh/aws/projects |
| roadmap.sh DevOps roadmap | https://roadmap.sh/devops |

---

## 💼 Job Requirements — Real-Market Audit (2026-08-14)

> **Source:** Simplilearn "DevOps Engineer Skills" (live fetch) + SIVARO 2026 platform-engineer stack + roadmap.sh inventories + DORA/CNCF.
> **Note:** LinkedIn/Naukri/Indeed block automated scraping; each row maps a real JD requirement to our modules.
> **Status:** ✅ covered · 🟡 partial · ❌ gap

| Requirement | Status | Covered in | Note |
| --- | --- | --- | --- |
| Linux fundamentals (files, permissions, processes, systemd, CLI) | ✅ | A01 | The 20% core — 30-40% of a DevOps interview |
| Coding & scripting (Python, Bash) | ✅ | B07 | Python + Bash; Go optional read-level |
| Git / source code management (branch, merge, recovery, PR flow) | ✅ | A02 | Undo/recovery + reflog = interview favorites |
| Docker + container lifecycle (images, compose, multi-stage, non-root) | ✅ | A04 | Production-grade Dockerfile is the mid-level bar |
| CI/CD pipelines (Jenkins, GitHub Actions, GitLab CI) | ✅ | A05/B05 | All three mandatory in India enterprise |
| Kubernetes production operation (workloads, netpol, storage, debugging) | ✅ | B01 | Required in ~90% of remote roles |
| Terraform / IaC (state, modules, providers) | ✅ | B02 | Listed as non-negotiable |
| Cloud provisioning + cost (AWS VPC/IAM/cost) | ✅ | B03 | Provision, manage, optimize cost |
| Configuration management (Ansible) | ✅ | B07 | Core must-have in India enterprise |
| Monitoring & observability (Prometheus, Grafana, SLOs) | ✅ | B04 | Also error budgets + tracing (SRE math) |
| Security / DevSecOps (SBOM, scanning, secrets, supply chain) | ✅ | B08 | Trivy, Kyverno, Vault, SLSA; ~+30% premium |
| Automated testing woven into pipelines | ✅ | A05 | Gates + deploy verification in A06 capstone |
| System administration (user mgmt, software install, monitoring) | 🟡 | A01 | Covered at foundation; deepen via B08 runbooks/on-call |
| Database & network management (MySQL/Postgres/NoSQL, network config) | ✅ | B03 | New sub-topic: SQL vs NoSQL, backups & PITR, pooling & slow queries |
| Computer programming depth (algorithms, design patterns) | 🟡 | B07/B09 | Python scripting + STAR stories; algorithm fundamentals not taught |
| Agile / Scrum / Kanban methodologies | ✅ | A05 | New sub-topic: Scrum essentials, Kanban & flow, Agile vs Waterfall vs DevOps |
| Soft skills (communication, collaboration, on-call incidents) | ✅ | B08/B09 | Incident comms + status updates + STAR behavioral |
| GitOps / service mesh / IDP (Argo CD, Istio, Backstage) | ✅ | B05/B01 | Premium differentiators; AI/GPU infra +20-30% (2026) |

**Audit summary:** 18 rows — 16 covered · 2 partial · 0 gap
