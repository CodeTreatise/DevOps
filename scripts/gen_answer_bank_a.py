#!/usr/bin/env python3
# Generates Platform-Answer-Bank.md — Phase A (A01-A06)
# Keyed by exact question text; any missing question is flagged (nothing missed).
import json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CURRICULUM = os.path.join(ROOT, 'curriculum')
ANSWER_BANK = os.path.join(ROOT, 'answer-bank')

d = json.load(open(os.path.join(CURRICULUM, 'Platform-Engineering-Path.json'), encoding='utf-8'))

# --- curated answers: (question, model_answer, rubric_1, rubric_2, rubric_3, why) ---
ANSWERS = {
"A01": [
 ("Walk me through what happens when you type a command in a terminal — PATH lookup, fork/exec, stdin/stdout/stderr",
  "The shell parses the line (words/quoting), looks up the command in $PATH (left to right, first executable match; also aliases/functions first), then forks a child process and exec()s the binary. The child gets three open fds: stdin (0), stdout (1), stderr (2). The shell waits; on exit the child reports its status (0 = success). Built-ins (cd, echo) skip fork.",
  "1 = says 'it runs the command'. 2 = mentions PATH + fork/exec. 3 = names stdin/stdout/stderr, exit codes, and built-ins vs binaries.",
  "PATH lookup + fork/exec is THE Linux fundamentals question — it tests whether you understand the OS, not just commands. Job: Linux fundamentals (A01)."),
 ("What's in /proc? How would you find a process listening on port 8080 and kill it safely?",
  "/proc is a virtual filesystem exposing kernel/process state — /proc/<pid>/ for each process (cmdline, fd/, environ, status), plus /proc/cpuinfo, /proc/meminfo, /proc/net/tcp. Find the listener: `ss -tulpn | grep 8080` (or lsof -i :8080) → get PID. Kill safely: check what it is first (`ps -fp <pid>`), try SIGTERM (`kill <pid>`), escalate to SIGKILL only if needed, and prefer systemd `systemctl stop` when the process is a managed service.",
  "1 = knows /proc exists, can find PID. 2 = uses ss/lsof and explains SIGTERM-first. 3 = adds safe-kill nuance: verify identity, prefer service manager, SIGKILL as last resort."),
 ("File permissions: what do 755, 644, and 4755 mean? What does umask do?",
  "755 = rwxr-xr-x (owner rwx, group r-x, others r-x) — directories and executables. 644 = rw-r--r-- — regular files. 4755 = SUID bit + rwxr-xr-x: the file runs with the owner's privileges (e.g. /usr/bin/passwd). umask sets the default permissions for new files/dirs by masking bits out — typical 022 → files 644, dirs 755.",
  "1 = reads one of them. 2 = reads all three + explains umask direction. 3 = explains SUID security implication and the file-vs-dir default difference."),
 ("Explain systemd: what does systemctl daemon-reload do and when do you need it? How do you follow logs for one unit?",
  "systemd is the init system: PID 1, starts services in dependency order, supervises them (restart on crash), and manages units via systemctl. `daemon-reload` re-reads unit files from disk — needed after editing a unit file (new/changed directives) or adding/removing unit files, because the running manager caches them. Follow logs for a unit: `journalctl -u <service> -f` (tail -f equivalent).",
  "1 = knows systemctl exists. 2 = explains daemon-reload purpose + journalctl -u. 3 = adds when-you-need-it nuance (after unit edits, not after config edits) and journalctl -u -f -n 50."),
 ("Disk full — how do you find the culprit (df, du, lsof deleted files) and free space without rebooting?",
  "Order: `df -h` to see which mount is full → `du -sh /*` (and drill down with du -xhs /var/* etc.) to find the biggest consumers. The classic gotcha: a deleted-but-open file still holds space — `lsof +L1` lists unlinked open files; truncate the fd (`: > /proc/<pid>/fd/<n>` or kill the process). Free space without reboot: clean logs (journalctl --vacuum), apt cache, docker (docker system prune), and truncate that deleted file.",
  "1 = uses df/du. 2 = finds deleted open files with lsof +L1. 3 = frees space safely (vacuum logs, prune docker, truncate fd) and explains why the file still holds blocks."),
 ("What did you build/break/fix today? (expect a follow-up drill on any command you claim)",
  "Honest, specific, one line per item — and be ready to reproduce any command you name. Frame: 'Today I built X (command), broke Y by accident (what I saw), fixed it with Z (why Z worked)'. The interviewer drills the 'fix' — so pick something you genuinely understand.",
  "1 = vague ('did some Linux stuff'). 2 = names a concrete task + command. 3 = tells the break/fix story with the actual command and the diagnostic reasoning."),
 ("Show me your shell history — what's your most-used command and why?",
  "This is a proxy for workflow. A strong answer reveals habit: `history | awk '{print $2}' | sort | uniq -c | sort -rn | head` shows your top commands; expect ls/cd/git/kubectl/docker. Tie it to the job: 'my loop is kubectl describe → logs → edit, so those dominate'.",
  "1 = can't think of one. 2 = names a top command and its use. 3 = connects the pattern to an actual daily workflow (debug loop, git flow)."),
 ("What's the difference between a file you created yesterday and one created today when both have the same permissions?",
  "Permissions are only part of the metadata. The files differ in ctime (metadata change time / inode change), mtime (content modified), atime (access), birth time (creation), inode number, and possibly owner/group. `stat` shows all timestamps; `ls -la` shows mtime. Even with identical permissions the inodes are different.",
  "1 = says 'nothing'. 2 = mentions mtime/ctime difference. 3 = names stat, inode number, and what each timestamp records."),
 ("File system trivia: filename max 255 bytes, inode contents, /proc virtual FS, superblock/boot/data blocks",
  "ext4 limits a single filename to 255 bytes (not chars — multibyte UTF-8 names are shorter in chars). An inode stores metadata: permissions, owner, size, timestamps, and pointers to data blocks (direct/indirect), NOT the filename (the directory entry maps name→inode). /proc is a virtual FS backed by kernel data, no disk blocks. The disk layout: boot block → superblock (fs metadata, backup copies exist) → inode table → data blocks.",
  "1 = knows 255-byte limit. 2 = explains inode-vs-filename and /proc virtual. 3 = ties superblock backups to fsck/recovery."),
 ("Permissions: rwx for user/group/others, 755 vs 644, SUID(4000)/SGID(2000)/sticky bit(1000), umask",
  "rwx triads for user/group/other; directories need x to traverse. 755/644 as above. SUID (4) runs with owner euid; SGID (2) on dirs inherits group; sticky (1) on /tmp means only owner/root can delete. umask 022 default → 644/755. Never put SUID on scripts; audit with find / -perm -4000.",
  "1 = reads triads + umask. 2 = explains all three special bits. 3 = adds the security angle (SUID audit, why sticky on /tmp)."),
 ("Processes: states (new/ready/running/blocked/terminated), zombie vs orphan, init PID 1, daemons, fork() copy-on-write",
  "Process states: new → ready → running → blocked (I/O wait) → terminated. A zombie is a terminated child whose parent hasn't reaped it (wait()) — it consumes only a PID/table slot; orphans are reparented to PID 1 (init/systemd) which reaps them. Daemons detach from the terminal. fork() creates a child via copy-on-write — the memory is shared until one side writes.",
  "1 = names zombie vs orphan. 2 = explains states + reparenting. 3 = adds fork/COW and how systemd reaps orphans (why PID 1 matters)."),
 ("systemd: systemctl daemon-reload, journalctl -u <svc> -f, unit vs service, cgroups (CPUQuota/MemoryMax, cgroup v2)",
  "A unit is the generic systemd object (service, socket, timer, mount...); a .service unit describes a supervised process. cgroups (v2 unified hierarchy) let systemd set resource limits: CPUQuota= (e.g. 50%), MemoryMax=, and slice/tree organization — the container story later (Docker uses cgroups). daemon-reload re-reads unit files; journalctl -u <svc> -f tails that unit's logs.",
  "1 = unit vs service. 2 = adds cgroup limits. 3 = connects to containers (cgroups + namespaces) and explains resource throttling symptoms."),
 ("Disk: df -h, du -sh /*, lsof +L1, truncate to free deleted-file space; LVM lvextend/lvreduce; fstab; swap ~2x RAM",
  "df shows filesystem usage; du shows directory tree usage (du -sh /* top-level). lsof +L1 lists deleted-but-open files holding space — truncate via the fd to free instantly. LVM: lvextend -L +10G /dev/vg/lv then resize2fs/xfs_growfs; lvreduce with care (shrink filesystem first). fstab defines mounts on boot (use UUIDs). Swap historically ~2x RAM is outdated guidance — for modern workloads size swap by need, often less.",
  "1 = df/du basics. 2 = lsof +L1 + truncate trick. 3 = adds LVM grow/shrink order and challenges the 2x-RAM rule."),
 ("Users: useradd -m -s /bin/bash, usermod -aG, /etc/passwd format, visudo, chage, /etc/security/limits.conf, ulimit",
  "useradd -m creates home, -s sets shell. usermod -aG <group> <user> adds group membership (the -a is critical — without it you replace groups). /etc/passwd: name:x:uid:gid:gecos:home:shell (x = shadowed password in /etc/shadow). visudo safely edits sudoers. chage sets password expiry. limits.conf + ulimit control per-user limits (nofile, nproc).",
  "1 = useradd/usermod basics. 2 = passwd format + visudo. 3 = adds chage/limits.conf and the -aG gotcha."),
 ("Scheduling: crontab 5-field syntax, cron vs anacron, cron.allow/cron.deny",
  "crontab: minute hour day-of-month month day-of-week command. cron runs jobs at fixed times but not if the machine was off; anacron catches missed runs for jobs not tied to a clock time (daily/weekly). Access control: cron.allow (allowlist, takes precedence) / cron.deny (denylist). For distributed/cloud scheduling you'd graduate to systemd timers or k8s CronJobs.",
  "1 = reads 5-field syntax. 2 = cron vs anacron. 3 = adds allow/deny precedence and when to move off cron entirely."),
 ("Networking: ip netns namespaces, veth, docker0 bridge, CNI (Flannel/Calico); ss -tulnp vs netstat, TIME_WAIT",
  "Network namespaces isolate networking per container; veth pairs link a container to the host; docker0 is the default bridge. CNI plugins (Flannel overlay, Calico BGP/eBPF) wire k8s pod networking. ss -tulnp is the modern netstat replacement (faster, better state info): t=TCP u=UDP l=listen n=numeric p=process. TIME_WAIT is the TCP state after close — it lets late packets die safely; high counts are normal under load, but a flood of connections can exhaust ports (tune via net.ipv4 settings).",
  "1 = uses ss -tulnp. 2 = explains netns/veth/bridge + CNI at a high level. 3 = adds TIME_WAIT meaning and the port-exhaustion operational angle."),
 ("Diagnosis: 7-step flow (ip addr show -> ping -> mtr -> nc -zv -> dig +short -> curl -v -> tcpdump); iperf3, ethtool",
  "The ladder tests each layer bottom-up: ip addr show (interface up?) → ping (L3 reachability) → mtr (path/latency) → nc -zv host port (L4 reachable?) → dig +short (DNS resolves?) → curl -v (HTTP/TLS details) → tcpdump (see the actual packets). iperf3 measures throughput; ethtool inspects link speed/duplex. This is the A03 debug flow to internalize.",
  "1 = names a couple tools. 2 = orders the layer-by-layer ladder correctly. 3 = reads the results and can say WHICH layer failed from each symptom."),
 ("SSH: ssh-keygen -t ed25519, ssh-copy-id, .ssh 700 / authorized_keys 600, ProxyJump, PasswordAuthentication no",
  "ssh-keygen -t ed25519 generates the modern key (no -b needed). ssh-copy-id installs the public key into ~/.ssh/authorized_keys on the server. Harden: ~/.ssh 700, authorized_keys 600, PasswordAuthentication no (keys only), PermitRootLogin no. ProxyJump lets you hop via a bastion: ssh -J bastion target. Use an agent for passphrase-protected keys.",
  "1 = generates + copies a key. 2 = explains permissions and hardening. 3 = adds ProxyJump + agent forwarding tradeoffs."),
 ("Firewalls: iptables filter/nat/mangle + INPUT/OUTPUT/FORWARD, nftables, firewalld zones/services",
  "iptables chains per table: filter (INPUT/OUTPUT/FORWARD = the default policy chains), nat (PREROUTING/OUTPUT/POSTROUTING for SNAT/DNAT), mangle (packet alteration). Default policy drop + explicit allow is the safe pattern. nftables is the modern replacement (single tool, cleaner syntax, used by RHEL 9+/Debian 12). firewalld is the distro front-end with zones (public/trusted) + services (http, ssh).",
  "1 = knows filter table chains. 2 = explains default-drop pattern + nat chain purpose. 3 = contrasts nftables vs iptables and firewalld zones."),
 ("Scenario answers: slow server (top, vmstat 1 5, iostat -x 1 5, iotop, free -h, strace, perf top); memory hog (OOM kill, swap)",
  "Slow server: top first (CPU/mem per process) → vmstat 1 5 (runnable queue, swapping, interrupts) → iostat -x 1 5 (await/util, I/O bottleneck?) → iotop (per-process I/O) → free -h (memory pressure). If CPU is high but nothing obvious: strace -p (syscalls) and perf top (kernel/user hot spots). Memory hog: the OOM killer picks a victim (check dmesg/journal for oom-kill) — the fix is limits + tuning, not just restarting.",
  "1 = runs top. 2 = orders vmstat/iostat/free into a sane sequence. 3 = explains OOM-killer behavior and strace/perf escalation."),
],
"A02": [
 ("git status vs git diff vs git diff --staged — what does each show?",
  "git status shows the working tree vs index vs HEAD at a glance (untracked, modified, staged). git diff shows unstaged working-tree changes vs the index. git diff --staged (aka --cached) shows staged changes vs HEAD — what will be committed.",
  "1 = vague. 2 = separates unstaged vs staged. 3 = connects each to the commit workflow precisely."),
 ("Explain HEAD. What happens with git reset --hard vs git revert? When is revert the right choice for pushed work?",
  "HEAD points at your current commit (usually the tip of the current branch). reset --hard <commit> moves HEAD/branch and throws away working-tree changes — destructive, never use on shared history. revert creates a NEW commit that undoes a previous one — safe for pushed/shared work because history stays intact. Revert is right when others may have pulled; reset is fine only for local/unpushed work.",
  "1 = knows HEAD. 2 = explains both commands. 3 = gives the shared-history rule and when each is appropriate."),
 ("You deleted a branch that had unmerged work — recover it. (reflog)",
  "git reflog lists every HEAD move and branch update (including deletions); find the branch's last commit hash, then git branch <name> <hash> (or git checkout -b). The reflog is local-only and expires (~90 days by default), so recovery works if done promptly on the same machine.",
  "1 = knows reflog exists. 2 = recovers the branch with the hash. 3 = explains expiry/GC caveat and safety net."),
 ("What's a detached HEAD and how do you get out of it?",
  "Detached HEAD = HEAD points at a commit, not a branch — you're not on any branch; new commits are orphaned if you switch away. Escape: create a branch to keep work (git switch -c new-branch) or git switch <existing-branch> to abandon. It's normal when checking out a tag/SHA to inspect.",
  "1 = knows what it is. 2 = explains how you got there + escape hatch. 3 = mentions the orphan-commit risk and branch-to-save pattern."),
 ("Branch hygiene: git branch --merged, deleting local + remote branches, keeping a PR reviewable",
  "git branch --merged shows branches whose work is already in the current branch (safe to delete). Delete local: git branch -d (safe, refuses unmerged) / -D (force). Remote: git push origin --delete <branch>. PR reviewable: small focused diffs, one logical change, good title + description, rebase/squash before merge.",
  "1 = lists merged branches. 2 = deletes local+remote correctly. 3 = adds PR-reviewability practices (small diffs, squash)."),
 ("What did you commit today and why was it atomic?",
  "Atomic = one commit, one logical change; it can be reverted or cherry-picked alone without dragging other changes. Strong answer ties each commit to a unit of work and uses `git add -p` to stage only the relevant hunks. 'I committed the retry logic separately from the refactor so the refactor can be reverted independently.'",
  "1 = no clear reason. 2 = defines atomic. 3 = shows staging discipline (add -p) and revert-safety reasoning."),
 ("How do you structure a commit message a reviewer will thank you for?",
  "Conventional Commits style: a short imperative summary (fix: / feat: / refactor:), a blank line, then WHY and WHAT in a few bullet lines — context beats mechanics. Reference the issue. Keep under ~72 chars for the subject.",
  "1 = one vague line. 2 = imperative subject + body. 3 = adds type prefix, issue ref, and why-not-what emphasis."),
 ("You just pushed a bad commit — walk me through your day's Git commands",
  "If it's the latest commit and only I have it: amend or reset --hard + force-with-lease push. If others may have pulled: revert (new commit). If it's buried: revert that SHA, or revert a range. Never rewrite shared history; use git revert for anything pushed to a shared branch. The 'day' ends with verifying: git log --oneline, git status clean, CI green.",
  "1 = panics. 2 = picks revert for pushed. 3 = explains the force-with-lease vs revert decision boundary clearly."),
 ("Basics: repo, clone, git config levels (--system/--global/--local), git status vs git diff, index/staging area",
  "git init creates a repo; clone copies a remote. Config precedence: --system (/etc) < --global (~/.gitconfig) < --local (repo .git/config). The index (staging area) is the intermediate between working tree and HEAD: git add puts changes in the index, git commit snapshots the index. status summarizes; diff shows content.",
  "1 = knows clone/add/commit. 2 = explains config levels. 3 = nails the index model and why it exists."),
 ("HEAD mechanics: HEAD~1, reset HEAD~3, reset --hard, revert --no-commit, detached HEAD (checkout -b)",
  "HEAD~N = N commits back from HEAD. reset HEAD~3 moves the branch pointer back 3 commits (--hard also wipes work; --soft keeps staged; default --mixed unstages). revert --no-commit applies the inverse as a staged change (lets you batch multiple reverts into one commit). Detached HEAD: checkout a SHA — save work with checkout -b newbranch before switching.",
  "1 = HEAD~1 meaning. 2 = reset modes. 3 = revert --no-commit batching + detached-HEAD rescue."),
 ("Recovery: reflog, recover deleted branch, revert bad pushed commit (new commit preferred), cherry-pick",
  "reflog = safety net for HEAD/branch moves; recover any lost commit. Revert bad pushed commit with a new commit (never rewrite). cherry-pick applies one commit onto the current branch — for selective backports (hotfix to an old release branch).",
  "1 = knows revert. 2 = uses reflog for recovery. 3 = picks cherry-pick for selective backports and explains when rewrite is forbidden."),
 ("Branching: git branch --merged/--no-merged, delete local+remote branch, PR vs branch, Git vs GitHub",
  "Git = the VCS (local, commands); GitHub = a hosting/collaboration platform (PRs, issues, CI). A branch is a movable pointer; a PR is a request to merge a branch with review. --merged lists branches safe to delete; delete local -d, remote push origin --delete. PRs enable review gates — the 'pull request' workflow is GitHub's contribution, not Git's.",
  "1 = branch basics. 2 = deletes branches correctly. 3 = separates Git vs GitHub and explains PR as a review gate."),
 ("History rewriting: squash via rebase -i HEAD~N, amend vs new commit (new commit safer), merge vs rebase (merge preserves history)",
  "rebase -i HEAD~N lets you squash/fixup/reword — used to clean up local history before push. amend changes the last commit (use only if unpushed; it rewrites the SHA). New commit is always safer than amend/rebase on shared history. merge creates a merge commit preserving both histories; rebase replays your commits onto the target for a linear history. Merge for shared branches; rebase for local cleanup.",
  "1 = knows squash exists. 2 = explains amend-vs-new-commit safety. 3 = merge-vs-rebase tradeoff and when each is used in teams."),
 ("Stash: apply vs pop (= apply + drop), when to stash",
  "git stash saves WIP without committing; stash pop = apply + drop. apply keeps the stash (useful when applying to multiple branches); pop is the normal path. Stash when you need to switch branches with dirty work, or pull before committing.",
  "1 = knows stash. 2 = apply vs pop difference. 3 = gives the when-to-stash workflow and the stash list/drop management."),
 ("Finding bugs: git bisect (start/bad/good), git annotate/blame",
  "git bisect does binary search over history to find the commit that introduced a bug: bisect start → bad <known-bad> → good <known-good> → test each checkout (good/bad) until it lands on the culprit. blame (annotate) shows per-line last-touching commit — for 'who/when changed this line'.",
  "1 = knows blame. 2 = walks bisect start/bad/good. 3 = explains bisect automation (bisect run script) for regression hunting."),
 ("Undo: reset --mixed, merge --abort, remove file from index (git reset + .gitignore)",
  "reset --mixed (default) unstages but keeps working tree — the 'undo add'. merge --abort aborts a conflicted merge back to pre-merge state. To stop tracking a file: add to .gitignore FIRST, then git rm --cached <file> (keeps the working copy, removes from index).",
  "1 = knows reset. 2 = merge --abort. 3 = the untrack-but-keep pattern (git rm --cached + gitignore order)."),
 ("GitOps tie-in: why Git as single source of truth (audit trail, rollback anywhere) — foundation for B05",
  "Git as source of truth gives: full audit trail (every change attributed), instant rollback (revert a commit → system reconciles back), review gates (PRs), and reproducibility (same repo, same result anywhere). This is the GitOps model that ArgoCD/Flux build on in B05: the cluster converges to what Git declares.",
  "1 = 'Git stores stuff'. 2 = names audit + rollback. 3 = connects to GitOps reconcile loop (B05 preview) with concrete benefits."),
],
"A03": [
 ("What happens when you type https://example.com and press Enter — walk through all layers (DNS → TCP → TLS → HTTP)",
  "1) DNS: resolve example.com → IP (browser cache → OS cache → resolver → recursive servers). 2) TCP: 3-way handshake (SYN/SYN-ACK/ACK) to port 443. 3) TLS: ClientHello → ServerHello + cert → key exchange (asymmetric) → session keys (symmetric). 4) HTTP/2 request over the TLS stream → server responds → browser renders. Add: CDN/load balancer may sit in front; keep-alive for subsequent requests.",
  "1 = names DNS then HTTP. 2 = includes TCP handshake. 3 = full ladder incl. TLS exchange and where a proxy/CDN sits."),
 ("Ping works but the browser fails — how do you diagnose? Which layer is the problem?",
  "Ping = ICMP (L3). Browser = TCP/TLS/HTTP (L4–L7). If ping works but HTTP fails: test the port (nc -zv host 443), check firewall (L4 block), then TLS (openssl s_client -connect), then HTTP (curl -v — look at the response, redirects, cert errors). The layer is almost certainly above L3: blocked port, TLS issue, proxy/DNS-based redirect, or app-level error.",
  "1 = says 'network issue'. 2 = tests port then TLS then HTTP in order. 3 = pinpoints which layer from each symptom (L4 block vs cert vs app error)."),
 ("Explain the TCP handshake and how a firewall can break it; what are ephemeral ports?",
  "TCP handshake: client SYN → server SYN-ACK → client ACK (opens the connection). A firewall can break it by dropping SYN (connection times out) or sending RST (connection refused). Ephemeral ports: the client-side source ports (Linux default 32768–60999) chosen per connection; a stateful firewall must track them. If ephemeral port range is exhausted you see 'cannot assign requested address' under connection floods.",
  "1 = describes handshake. 2 = explains firewall breakage (drop vs RST). 3 = adds ephemeral ports + exhaustion symptom."),
 ("Ports: what's listening on 80/443/22/3306/6379 by default? How do you check and who listens where?",
  "80 = HTTP (nginx/apache/web app), 443 = HTTPS, 22 = SSH, 3306 = MySQL/MariaDB, 6379 = Redis. Check: ss -tulpn (listen, numeric, process) — the p flag shows the owning process; lsof -i :port as alternative. On k8s/containers these become service ports, but the fundamentals are the same.",
  "1 = knows a couple. 2 = knows all five + ss -tulpn. 3 = reads the process column and explains why you check before troubleshooting."),
 ("CIDR: what does 192.168.1.0/24 mean? How many usable IPs? Do subnetting drills",
  "/24 = 24 bits of network, 8 bits host → 256 addresses, 2 reserved (network + broadcast) = 254 usable. 192.168.1.0 is the network address. Drill: /25 = 126 usable, /26 = 62, /27 = 30, /28 = 14. VLSM splits further. This maps to VPC subnets in AWS (B03).",
  "1 = knows /24 basics. 2 = computes usable hosts. 3 = splits subnets (VLSM) and ties to real VPC design."),
 ("Your app is slow only for some users — walk me through your diagnostic order (latency vs throughput, network vs app)",
  "1) Isolate: some users = geography/CDN/ISP path likely — compare with a fast user's path. 2) Measure: curl -w timing (DNS, connect, TTFB, total) from multiple vantage points; mtr to see path loss/latency. 3) Network vs app: TTFB high = server/app problem; connect slow = network/path. 4) Throughput: iperf3 to separate latency from bandwidth. 5) App layer: server metrics (CPU/DB), logs for slow queries.",
  "1 = 'check the server'. 2 = separates latency vs throughput with curl -w/mtr. 3 = full isolation order incl. vantage-point comparison and TTFB reasoning."),
 ("traceroute shows high latency at hop 3 — is that necessarily the router's fault?",
  "No. Routers may not reply to ICMP in-path (rate-limiting or policy) and may process probe packets in the slow path — the displayed latency can be the router's control-plane, not the data path. Real test: high latency on MULTIPLE consecutive hops or packet loss + mtr sustained = genuine path issue; single hop spike is often cosmetic.",
  "1 = 'yes it's that router'. 2 = knows ICMP rate-limiting caveat. 3 = explains control-plane vs data-path and mtr multi-hop confirmation."),
 ("How do you check DNS resolution, then TCP reachability, then TLS, then the HTTP response — in order, with the right tools?",
  "DNS: dig +short example.com (also dig A/AAAA, +trace for delegation issues; nslookup for quick). TCP: nc -zv example.com 443 (or telnet). TLS: openssl s_client -connect example.com:443 -servername example.com (cert chain, expiry, SNI). HTTP: curl -vI https://example.com (status, headers, redirects, timing). This exact order = the A03 debug ladder.",
  "1 = knows dig/curl. 2 = orders DNS→TCP→TLS→HTTP. 3 = reads each tool's output (TTL, cert expiry, HTTP status) and explains what each layer passing/failing means."),
 ("Scope: PAN/LAN/MAN/WAN/GAN, network topologies, IPv4 classes A-E, private IPs (10/8, 172.16/12, 192.168/16)",
  "Scales: PAN (personal, ~meters) → LAN (office/building) → MAN (city) → WAN (country/world) → GAN (global). Topologies: star, bus, ring, mesh. IPv4 classes: A (1–126, /8), B (128–191, /16), C (192–223, /24), D multicast, E reserved. Private ranges (RFC 1918): 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16 — not routable on the public internet, NAT'd at the edge.",
  "1 = knows the three private ranges. 2 = explains classes. 3 = ties class/private/CIDR to real cloud VPC design."),
 ("Models: OSI 7 layers vs TCP/IP 4 layers, devices per layer (switch L2/MAC, router L3/IP, bridge)",
  "OSI: Physical, Data Link, Network, Transport, Session, Presentation, Application. TCP/IP condenses: Link, Internet, Transport, Application. Devices: switch = L2 (MAC forwarding, VLANs), router = L3 (IP routing), bridge = L2 segment connector, gateway = L3+/protocol translation, load balancer = L4/L7.",
  "1 = names 7 layers. 2 = maps devices to layers. 3 = explains the practical reason for TCP/IP model and where proxies/LB sit."),
 ("Delays: propagation vs transmission vs processing vs queueing",
  "Propagation: time for signal to travel distance (speed-of-light bound, fixed by distance). Transmission: time to put bits on the wire (size ÷ bandwidth). Processing: router/switch decision time. Queueing: waiting in router buffers (the variable one — grows with congestion; this is what mtr spikes show).",
  "1 = mixes them up. 2 = separates propagation vs transmission. 3 = identifies queueing as the congestion culprit and what tools measure each."),
 ("Diagnostics: ping/TTL (Linux 64, Windows 128), traceroute, 'ping works but HTTP fails' = higher-layer issue",
  "TTL (time-to-live) decrements per hop; Linux defaults 64, Windows 128 — a reply with TTL ~50 means ~14 hops away. traceroute sends probes with increasing TTL to map the path. The core diagnostic principle: ping OK but HTTP fails → the failure is above L3 (port/firewall/TLS/app) — go up the ladder, don't blame the network.",
  "1 = knows ping/traceroute. 2 = explains TTL defaults. 3 = states the layer-ladder principle with an example."),
 ("TLS handshake: asymmetric -> symmetric key exchange, TLS 1.3; certificates",
  "Purpose: authenticate the server + establish a shared symmetric key. Flow: ClientHello (ciphers, TLS 1.3) → ServerHello + certificate → (TLS 1.3) client/server exchange key-share and derive keys; 1.2 does a separate key-exchange round-trip. Asymmetric crypto (RSA/ECDHE) protects the key exchange; symmetric (AES) encrypts the actual data (faster). Certificate = server identity signed by a CA; browsers trust the chain.",
  "1 = knows TLS exists. 2 = explains asymmetric-then-symmetric. 3 = explains cert chain trust, SNI, and the TLS 1.3 round-trip reduction."),
 ("VLAN 802.1Q + inter-VLAN routing; forward vs reverse proxy (Nginx/Cloudflare); port ranges (0-1023 well-known...)",
  "VLANs (802.1Q tag) segment a switch into multiple L2 domains; inter-VLAN routing needs a router (or L3 switch) — one leg per VLAN. Forward proxy: sits in front of clients (outbound, e.g. corporate proxy). Reverse proxy: sits in front of servers (inbound: nginx, Cloudflare; TLS termination, LB, caching). Ports: 0–1023 well-known, 1024–49151 registered, 49152+ ephemeral.",
  "1 = reverse vs forward proxy. 2 = explains VLAN + inter-VLAN routing. 3 = adds port ranges + when to use a reverse proxy (TLS, LB, cache)."),
 ("Subnetting/CIDR: /24 = 254 usable, /25 split, VLSM",
  "/24 → 254 usable hosts (256 − network − broadcast). Split /24 into two /25 = 126 usable each — e.g. 192.168.1.0/25 (hosts .1–.126) and 192.168.1.128/25 (.129–.254). VLSM = splitting subnets to different sizes per need (e.g. /27 for a small team, /24 for servers) to avoid waste — core AWS VPC design skill.",
  "1 = /24 count. 2 = /25 split math. 3 = VLSM reasoning for real VPC layouts."),
 ("NAT/PAT: SNAT vs DNAT, when each applies",
  "SNAT (source NAT): rewrites the source IP for outbound traffic (private→public, e.g. home router / AWS NAT gateway); PAT = SNAT + port mapping so many hosts share one IP. DNAT (destination NAT): rewrites the destination IP/port for inbound (public IP → private server, e.g. port forwarding to an instance). SNAT for egress, DNAT for ingress.",
  "1 = knows NAT exists. 2 = SNAT vs DNAT direction. 3 = adds PAT multiplexing and maps to AWS NAT gateway vs ALB target routing."),
 ("TCP: 3-way handshake (SYN/SYN-ACK/ACK), connection states (LISTEN, SYN-SENT, ESTABLISHED, FIN-WAIT...), SYN flood",
  "Handshake: SYN → SYN-ACK → ACK. States: LISTEN (server waiting), SYN-SENT, SYN-RECEIVED, ESTABLISHED, FIN-WAIT-1/2, TIME-WAIT, CLOSE-WAIT, CLOSED. SYN flood: attacker sends SYN without completing handshakes → exhausts the listen backlog (half-open connections) → legitimate clients can't connect; mitigation: SYN cookies, rate limits.",
  "1 = describes handshake. 2 = lists key states. 3 = explains SYN-flood mechanics + SYN-cookie mitigation and what ss shows during one."),
 ("IPv6: 128-bit, SLAAC, IPSec built-in, dual-stack, NAT64",
  "IPv6 = 128-bit (huge space), written as 8×16-bit hex groups. SLAAC: stateless auto-configuration from router advertisements (no DHCP needed). IPSec was designed-in (though not mandatory in practice). Dual-stack: run v4+v6 simultaneously (the pragmatic migration path). NAT64: translates v6→v4 for legacy reachability. Interview-wise: know the address format, why it matters, and dual-stack as today's reality.",
  "1 = knows 128-bit. 2 = explains SLAAC + dual-stack. 3 = adds NAT64/transition mechanics and practical adoption stance."),
 ("SRE crossover: DHCP/DNS/ARP mechanics, CDN, TCP state machine (appears in SRE interviews)",
  "DHCP: client broadcasts DISCOVER → server OFFER → REQUEST → ACK (lease). DNS: hierarchical resolution with caching (TTL) — the 'phonebook'. ARP: maps IP→MAC on the local segment (gratuitous ARP for failover/HA). CDN: edge caching + routing to reduce latency and origin load. TCP state machine: the full LISTEN→SYN→ESTABLISHED→FIN/CLOSE state transitions — SREs must reason about it from ss/netstat output during incidents.",
  "1 = knows ARP purpose. 2 = explains DHCP 4-step + DNS cache. 3 = ties CDN, TCP states to real incident diagnosis."),
],
"A04": [
 ("Image vs container vs layer — what's the difference and what happens on docker run?",
  "An image is an immutable read-only template (layered FS + config); a container is a running instance (image + writable layer + namespaces + cgroups). Layers: each Dockerfile instruction adds a layer; layers are cached and shared between images (that's why base layers pull once). docker run: daemon checks local image → pulls if missing → creates a container from the image → sets up namespaces/cgroups → runs CMD/ENTRYPOINT with the writable layer on top.",
  "1 = image vs container. 2 = layers + caching. 3 = full run lifecycle incl. namespaces/cgroups and writable-layer behavior."),
 ("CMD vs ENTRYPOINT, exec vs shell form — when does each matter?",
  "ENTRYPOINT defines the fixed executable; CMD provides default arguments (and can be overridden by docker run args). Together: ENTRYPOINT ['docker-entrypoint.sh'], CMD ['nginx'] → the script runs with nginx as arg. Exec form (JSON array) runs directly — receives signals, no shell; shell form (string) wraps in /bin/sh -c — does variable expansion but mangles signals/PID 1. Use exec form in production.",
  "1 = knows they differ. 2 = explains override behavior. 3 = exec-vs-shell form tradeoffs (signals, PID 1, variable expansion)."),
 ("COPY vs ADD; why multi-stage builds? Why .dockerignore?",
  "COPY copies local files; ADD additionally auto-extracts tarballs and fetches URLs (rarely needed; COPY + explicit RUN tar is clearer). Multi-stage: multiple FROM in one Dockerfile — build deps in stage 1, copy only artifacts into a slim final image (e.g. go build → scratch/alpine). .dockerignore excludes local junk (node_modules, .git) from the build context — smaller context = faster builds + no secrets in image.",
  "1 = knows COPY vs ADD. 2 = explains multi-stage value. 3 = adds .dockerignore rationale and how it protects secrets."),
 ("How do namespaces and cgroups provide isolation? What can a container still see?",
  "Namespaces isolate views: PID, Mount, User, Network, IPC, UTS (hostname). cgroups limit resources: CPU shares/quota, memory max, I/O. A container shares the host KERNEL — so it sees kernel version, and without seccomp/AppArmor it can attempt host kernel syscalls; PID 1 is namespaced, devices are filtered. 'Docker is not a security boundary' — containers share kernel, need defense in depth.",
  "1 = names namespaces. 2 = namespaces vs cgroups split. 3 = explains shared-kernel risk and why containers ≠ VMs for security."),
 ("docker run vs start vs exec vs attach — lifecycle states and when to use each",
  "run = create + start a new container (foreground -it or detached -d). start = start an existing stopped container. exec = run a new process in a RUNNING container (debugging: docker exec -it <c> sh). attach = connect your terminal to the container's main process. States: created → running → paused → stopped → deleted.",
  "1 = run vs exec. 2 = all four commands. 3 = maps each to a scenario (exec for debug, attach for logs, start to resume)."),
 ("Walk me through your compose stack — why those services, how do they talk, what survives a restart?",
  "Compose defines multi-container apps: services (web, db), networks (default bridge — services resolve by name), volumes (named volumes survive restarts/rebuilds), depends_on ordering, env overrides. Survives restart: data in named volumes, config in compose file/env; ephemeral: container FS, process state. 'They talk' = service DNS name + internal port, not localhost.",
  "1 = names services. 2 = service-to-service networking + volumes. 3 = explains restart/rebuild survival and env separation."),
 ("Your container crashed at 3am — how do you find out why (logs, restart policy, healthcheck)?",
  "Order: docker ps -a (status/exit code) → docker logs <c> (stderr, app errors; -f to follow) → check restart policy (unless-stopped/always vs on-failure) → exit code analysis (137 = OOM-killed, 0/1 = app-level). Add a HEALTHCHECK so the orchestrator/load balancer sees failures before users do; set restart policies so the container recovers automatically.",
  "1 = docker logs. 2 = exit codes + restart policy. 3 = healthchecks + the 3am operational story (what you'd automate)."),
 ("How would you ship this stack to a team — what's in the repo, what's in the docs?",
  "Repo: Dockerfile(s) with exec-form + multi-stage, .dockerignore, docker-compose.yml (dev) with env var placeholders (.env.example), a Makefile/task runner, tests, CI workflow. Docs: README with prerequisites, quickstart (cp .env.example .env; docker compose up), architecture diagram, ports/health endpoints, troubleshooting + how to add a service.",
  "1 = 'put it on GitHub'. 2 = lists repo artifacts. 3 = complete onboarding story incl. env handling, CI, and docs structure."),
 ("Architecture: 3 components (Client/Docker Host/Registry), daemon vs client, image vs container vs layer",
  "Client (docker CLI) talks to the daemon (dockerd) via a socket (Unix socket, root by default, or remote API). The daemon builds/runs/pulls. Registry stores/distributes images (Docker Hub, ECR, GHCR). Image = layered read-only template; container = runnable instance; layer = one instruction's FS diff. The client-server split matters for security (root daemon socket) and for remote Docker contexts.",
  "1 = names 3 components. 2 = daemon vs client split. 3 = explains socket security + registry role in supply chain (B08)."),
 ("Dockerfile: FROM/LABEL/RUN/CMD, COPY vs ADD, CMD vs ENTRYPOINT (exec vs shell form), multi-stage builds, .dockerignore",
  "FROM = base image; LABEL = metadata; RUN = build-time command (each RUN = a layer, chain with &&); COPY = copy files; CMD/ENTRYPOINT as above. Multi-stage: builder stage compiles, final stage copies artifacts → tiny image. .dockerignore shrinks context. Best practice: pin base image digests (supply chain), run as non-root, one process per container.",
  "1 = writes a basic Dockerfile. 2 = optimizes (multi-stage, .dockerignore). 3 = security-aware (digest pinning, non-root, USER) — B08 crossover."),
 ("Lifecycle: created/running/paused/stopped/deleted; docker run vs start vs exec vs attach",
  "States: created (fs ready, not started), running, paused (SIGSTOP), stopped (SIGTERM/SIGKILL exit), deleted (fs removed). Commands map: run = create+start; start = stopped→running; exec = new process in running container; attach = attach to main process stdout. pause freezes processes — useful for debugging without killing.",
  "1 = knows the states. 2 = maps commands to states. 3 = explains pause semantics and exec-in-running use cases."),
 ("Isolation: namespaces (PID/Mount/User/Network/IPC/UTS), cgroups limits, no full isolation (shared kernel)",
  "Namespaces give each container its own view of PID/mount/user/net/IPC/hostname. cgroups enforce resource limits (CPU, memory, I/O). NOT isolated: the kernel (shared), and by default devices/sysfs exposure — containers share the host kernel, so a kernel vuln affects all containers; defense: seccomp, AppArmor/SELinux, rootless, read-only rootfs.",
  "1 = namespaces + cgroups. 2 = which view is isolated. 3 = shared-kernel risk and hardening stack (seccomp/AppArmor/rootless)."),
 ("Storage: volumes (-v, /var/lib/docker/volumes/), bind mounts, tmpfs, data persistence patterns",
  "Volumes: managed by Docker in /var/lib/docker/volumes/ — survive container removal, portable via docker volume. Bind mounts: host path mounted into container (dev convenience; host-dependent). tmpfs: in-memory, lost on stop — for secrets/cache that must not hit disk. Pattern: named volume per data service (db), bind for dev hot-reload, tmpfs for ephemeral.",
  "1 = volume vs bind. 2 = tmpfs purpose. 3 = picks the right storage per workload (db → volume, dev → bind, scratch → tmpfs)."),
 ("Restart policies: no/on-failure/unless-stopped/always; exit codes",
  "no = never auto-restart (default). on-failure: restart only on non-zero exit, with max retries. unless-stopped: restart unless the operator explicitly stopped it (survives daemon restart). always: always restart. Exit codes: 0 clean, 1 app error, 137 = SIGKILL/OOM, 125/126/127 docker launcher errors. Combine with healthchecks for real self-healing.",
  "1 = lists policies. 2 = matches policies to scenarios. 3 = exit-code forensics (137/OOM) + healthcheck interplay."),
 ("Compose: up/run/start, depends_on ordering, environment overrides, docker-compose.{env}.yml, JSON compose (-f)",
  "up = create + start + attach logs (the main command); run = one-off command in a service (e.g. migrations); start = start existing containers. depends_on orders startup (with condition: service_healthy for readiness). Env: ${VAR} substitution + env_file; override files: docker-compose.override.yml (auto) or -f base.yml -f prod.yml. Compose v2 reads the same spec from JSON when given -f.",
  "1 = up vs run. 2 = depends_on + env substitution. 3 = override file layering for dev/prod and service_healthy gating."),
 ("Distribution: save/load vs push/pull, tags, registry vs repository",
  "save/load = tarball transfer (air-gapped, offline) — not for normal distribution. push/pull = registry transfer (the normal path). Tags: name:tag — :latest is a moving target, use immutable tags (SHA, build ID) for production. Registry = service hosting images (Harbor/ECR); repository = a named collection of image versions (e.g. repo 'api' with tags 1.0, 1.1).",
  "1 = push/pull. 2 = save/load vs push/pull. 3 = immutable tags + registry-vs-repo vocabulary (B08 supply chain)."),
 ("Security (SRE crossover): content trust, resource limits, Docker Bench Security, minimal base images, non-root",
  "Content trust: sign images so pullers can verify provenance. Resource limits: --memory/--cpus prevent noisy neighbors. Docker Bench Security: automated audit of host/daemon config. Minimal base: scratch/alpine/distroless reduce attack surface. Non-root: USER directive + no privileged mode; read-only rootfs. This is the bridge to B08 DevSecOps (Trivy scanning, SBOM, Cosign signing).",
  "1 = knows non-root. 2 = content trust + limits. 3 = full hardening posture tied to B08 (scan/sign/sbom)."),
 ("Conceptual: virtualization vs containerization, Docker Swarm vs Kubernetes (one-line difference)",
  "Virtualization: hypervisor runs full VMs (own kernel) — heavy isolation, slow start. Containerization: shared host kernel + namespaces/cgroups — light, fast, but weaker isolation. Docker Swarm vs K8s one-liner: Swarm is Docker's simple built-in orchestrator; Kubernetes is the extensible industry-standard platform for large-scale production orchestration (B01).",
  "1 = VM vs container. 2 = adds resource/speed tradeoffs. 3 = Swarm-vs-K8s positioning and why the market chose K8s."),
],
"A05": [
 ("CI vs CD vs CDE — define each and where the human approval sits",
  "CI (continuous integration): every push builds + runs tests automatically — catches integration problems early. CD (continuous delivery): the artifact is always deployable; a human presses the button for production. CDE (continuous deployment): every change that passes CI goes to production automatically — no human gate. Human approval sits between CI and production in CD, and is removed in CDE.",
  "1 = mixes them up. 2 = defines all three. 3 = adds where the human approval lives and the risk tradeoff per stage."),
 ("Design a pipeline for a web app: stages, caching, secrets, artifact promotion — what runs where and why?",
  "Stages: lint → unit tests → build (immutable artifact: image/tarball with version tag) → push artifact to registry → deploy to staging → integration/e2e tests → (approval gate) → deploy to prod → post-deploy verification (health, smoke, metrics). Caching: dependencies (npm/pip cache) per branch to cut build time. Secrets: injected at runtime from a secrets manager (never baked into images). Artifact promotion: same artifact promoted env→env (build once, deploy many) — no rebuild per environment.",
  "1 = lists stages. 2 = immutability + caching + secrets. 3 = full promotion story with gates and post-deploy verification."),
 ("Blue/green vs canary vs rolling — tradeoffs and how you'd roll back each",
  "Blue/green: two full environments; switch traffic at once (router/LB). Rollback = instant flip back. Cost: 2× infra. Canary: send % of traffic to new version, observe metrics, ramp up. Rollback = set canary to 0 / flip traffic. Requires good observability. Rolling: replace pods/nodes incrementally (k8s default). Rollback = resume/revert the rollout. Choose by risk: blue/green for big releases, canary for risky changes with metrics, rolling for routine.",
  "1 = names strategies. 2 = explains each + rollback. 3 = picks by risk profile and describes the metrics that gate canary promotion."),
 ("Your build is flaky — how do you make CI trustworthy (retries, quarantine, deterministic tests)?",
  "Trustworthy CI: fix flaky tests (root cause, not just retry) — quarantine flaky tests so they don't block, add retry only for known-infrastructure flakes (network), make tests deterministic (no sleeps, fixed seeds, isolated state), parallelize for speed, and track flake rate. A flaky pipeline teaches devs to ignore red — the worst outcome.",
  "1 = 'retry it'. 2 = quarantine + root-cause. 3 = determinism practices + the trust/fatigue argument."),
 ("Deploy a change to staging and production with a gate — walk me through the whole flow from commit to live",
  "1) push → CI builds + tests; on green, image tagged (build ID) and pushed. 2) deploy same artifact to staging; run e2e/smoke. 3) human approval (the gate) → deploy to prod with a strategy (rolling/canary). 4) post-deploy: health checks, synthetic checks, error-rate/metrics watch for 10–15 min. 5) rollback path defined BEFORE deploy (previous artifact + command). Everything reproducible, no manual steps.",
  "1 = describes stages. 2 = names the gate + artifact immutability. 3 = complete flow with post-deploy verification and pre-planned rollback."),
 ("Your production deploy broke everything — what's your rollback playbook (in order)?",
  "1) Stop the bleeding: revert traffic to the previous good artifact (flip blue/green, canary→0%, or `kubectl rollout undo`) — do NOT debug forward while users are down. 2) Confirm recovery on metrics/alerts. 3) Preserve evidence: capture logs/dashboards for the postmortem. 4) Blameless postmortem: timeline, root cause, action items. Rule: roll back first, investigate second; never 'deploy a fix' as the first move.",
  "1 = 'git revert'. 2 = names the flip-back first. 3 = full playbook incl. evidence capture + blameless postmortem."),
 ("How do you prove the pipeline works — metrics, alerts, verification steps after deploy?",
  "Prove with DORA-style metrics: deploy frequency, lead time, change failure rate, MTTR. Pipeline health: green rate, build duration, flake rate. Post-deploy verification: health checks, smoke tests, synthetic transactions, error-rate + latency alerts (SLO burn). 'Pipeline works' = deploys are boring and fast, and failures are caught before users notice.",
  "1 = 'it goes green'. 2 = names DORA metrics. 3 = ties deploy metrics to SLO/burn alerts + post-deploy verification loop."),
 ("GitHub Actions vs Jenkins vs GitLab CI — what is different and when would a company use each?",
  "GitHub Actions: SaaS, YAML workflows in repo, tight GitHub integration, free for public — great for startups/OSS. Jenkins: self-hosted, plugin ecosystem, master-agent, config as code (Jenkinsfile), mature but ops-heavy — dominant in Indian enterprise (TCS/Infosys/Wipro). GitLab CI: single app (repo+CI+registry+security), .gitlab-ci.yml, strong for GitLab-centric orgs. Pick by where the code lives and team ops appetite.",
  "1 = lists names. 2 = YAML-vs-Jenkinsfile and hosted-vs-self-hosted. 3 = matches tool to org type (enterprise Jenkins, startup Actions) with the India angle."),
 ("Jenkins master/agent: what does an agent run and why is it separate from master?",
  "Master (controller) orchestrates: schedules jobs, stores config/history, serves UI. Agents (workers) execute builds — they can be separate machines/containers to isolate workload, scale horizontally, and protect the controller. Separation = isolation (bad builds can't take down the controller), scalability (add agents), and security (agents can run untrusted code, controller shouldn't).",
  "1 = master runs jobs. 2 = explains separation benefits. 3 = adds the security/isolation + scale rationale."),
 ("A company says 'we use Jenkins' — what is your first question? (version? declarative or scripted? where are secrets stored?)",
  "Good first questions: 1) Jenkins version + how it's maintained (plugin hygiene)? 2) Declarative or scripted pipelines — is config in the repo (Jenkinsfile) or snowflake UI jobs? 3) Where are secrets (credentials plugin, Vault, injected)? 4) How are agents provisioned (static VMs, containers, cloud)? These reveal whether it's a modern, codified Jenkins or an unmaintained snowflake.",
  "1 = 'ok'. 2 = asks 1–2 probing questions. 3 = asks version/pipeline-type/secrets/agents — shows you understand Jenkins maturity."),
 ("Walk me through a sprint: what happens in planning, stand-up, review, retro — and where does the pipeline gate fit?",
  "Planning: team commits to scope for the sprint (backlog → sprint backlog). Stand-up (daily): what I did / will do / blockers. Review: demo completed work to stakeholders; accept/reject. Retro: inspect process, action items to improve. Pipeline gate fits at the definition of done: work is 'done' only when CI/CD passes (tests green, deployed to staging) — the gate is the contract between dev and delivery.",
  "1 = names ceremonies. 2 = describes each. 3 = connects ceremonies to the CI/CD gate as the done-definition."),
 ("Scrum vs Kanban — when would you choose each for a platform team?",
  "Scrum: fixed-length sprints, commitments, roles (PO/SM) — good for product features with priorities and stakeholders. Kanban: continuous flow, WIP limits, no fixed iterations — good for platform/ops work that's interrupt-driven (tickets, incidents, requests). Many platform teams run Kanban (or Scrumban) because work is uneven and urgent — WIP limits beat sprint commitments.",
  "1 = 'both are agile'. 2 = sprint vs flow mechanics. 3 = matches to team type (platform/ops → Kanban) with reasoning."),
 ("Your team has a 2-week release cadence but incidents weekly — how do you reconcile Agile with on-call?",
  "The conflict is real: incident load breaks sprint commitments. Reconcile: (1) reserve capacity — budget 20–30% of sprint for unplanned/on-call work; (2) shift to smaller, safer releases (CI/CD quality) so 'release' stops being the scary event; (3) feed incidents into the backlog as remediation items; (4) blameless postmortems → systemic fixes reduce recurrence; (5) consider Kanban/Scrumban if interrupt load is structural.",
  "1 = 'do both'. 2 = reserves capacity + backlogs incidents. 3 = systemic: quality gates reduce incident rate; org pattern choice."),
 ("Culture: CAMS (Culture, Automation, Measurement, Sharing), Agile vs DevOps, 8 phases of DevOps lifecycle",
  "CAMS: Culture (collab over blame), Automation (repeatable), Measurement (data-driven), Sharing (knowledge/ownership). Agile vs DevOps: Agile is about how teams build (iterations, feedback); DevOps extends to operations — how software is delivered and run (culture + tooling across dev and ops). 8-phase lifecycle: Plan → Code → Build → Test → Release → Deploy → Operate → Monitor (loop).",
  "1 = knows CAMS acronym. 2 = Agile vs DevOps distinction. 3 = lifecycle loop + how CAMS shows up in day-to-day behavior."),
 ("CI: build/test automation, continuous testing, shift-left testing, git hooks (pre-commit, pre-receive/update/post-receive)",
  "CI = automated build+test on every push. Continuous testing: tests run throughout the pipeline, not just at the end. Shift-left: move quality checks earlier (lint/unit before integration, security scanning early) — cheaper to fix. Git hooks: client-side pre-commit (lint before commit), server-side pre-receive/update/post-receive (enforce policies on push — e.g. reject secrets, require sign-off).",
  "1 = CI definition. 2 = shift-left rationale. 3 = hook taxonomy + policy enforcement examples."),
 ("CD: continuous delivery vs continuous deployment (one explicit approval vs zero), deployment strategies (blue/green...)",
  "Delivery: always deployable; production release has one explicit approval. Deployment: zero approvals — every green pipeline goes live. Strategies: blue/green (flip), canary (ramp %), rolling (incremental replace), recreate (downtime). Choice driven by risk + observability. Delivery when humans want final control; deployment when automation + metrics are trustworthy enough.",
  "1 = delivery vs deployment. 2 = approval difference. 3 = strategy selection by risk + metrics maturity."),
 ("KPIs: deploy frequency, failed deployment %, MTTR/MTTD, change failure rate",
  "DORA metrics: deploy frequency (how often), lead time for change (commit→prod), change failure rate (deploys causing incidents), MTTR (mean time to restore) / MTTD (detect). Failed deployment %: share of deploys that fail. Targets: elite performers deploy on-demand, lead time <1 day, CFR <15%, MTTR <1 hour. These are the numbers you instrument in B05.",
  "1 = names a couple. 2 = defines DORA set. 3 = elite benchmarks + how to instrument them from CI/CD data."),
 ("Jenkins: master-slave/agent model, plugins, $JENKINS_HOME/plugins, restart vs safeRestart, pipeline vs freestyle",
  "Master (controller) + agents as above. Plugins: Jenkins' extension ecosystem — stored in $JENKINS_HOME/plugins; version drift/outdated plugins are a common breakage. safeRestart: waits for running jobs to finish before restarting (vs restart which may abort builds). Pipeline (Jenkinsfile, declarative/scripted) vs freestyle jobs (UI-configured, less reproducible) — always prefer pipeline-as-code.",
  "1 = knows plugins. 2 = safeRestart + $JENKINS_HOME. 3 = pipeline-as-code vs freestyle and plugin hygiene."),
 ("IaC tie-in: imperative vs declarative (Ansible/Terraform), config drift",
  "Imperative: you specify HOW (steps) — scripts. Declarative: you specify WHAT (desired state) and the tool converges — Terraform/Ansible. Drift: reality diverges from declared config (manual changes, partial applies) — declarative tools detect and reconcile (terraform plan shows drift; Ansible converges). This is the GitOps philosophy: desired state in Git, reality converges to it.",
  "1 = defines both. 2 = drift concept. 3 = ties declarative/IaC to GitOps reconcile (B05/B02 preview)."),
 ("Anti-patterns: pipeline as snowflake, long-running builds, flaky tests, manual release steps, post-mortem blame",
  "Snowflake pipeline: configured only in UI, undocumented, can't be recreated → make pipeline-as-code. Long builds: slow feedback → cache, parallelize, split. Flaky tests: erode trust → quarantine/root-cause. Manual release steps: error-prone → automate with gates. Blame postmortems: hide problems → blameless culture. Interviewers listen for these as evidence of production experience.",
  "1 = names one. 2 = explains why each hurts. 3 = pairs each anti-pattern with the fix and the trust argument."),
 ("Post-mortems: blameless, action items, incident timelines",
  "Blameless postmortem: focus on system/process causes, not people — no blame so people report honestly. Timeline: reconstruct the incident chronologically (what, when, who noticed, actions). Action items: concrete, owned, tracked fixes (not vague 'monitor more'). Best practice: runbook improvements, automated tests for the failure, alerting gaps closed.",
  "1 = knows what it is. 2 = blameless + timeline. 3 = action-item discipline + how postmortems reduce recurrence."),
],
"A06": [
 ("Walk me through your capstone: what it does, stack, how you'd scale it, what breaks first",
  "Structure: 60-sec pitch (what it does for whom) → stack (one line each: app, container, CI, deploy target) → architecture (request flow) → scale plan (where the bottleneck hits first: DB? single instance? — add replicas/cache/LB) → what breaks first (single point of failure: one VM, no backups). Honesty about limits beats a perfect story.",
  "1 = describes app. 2 = stack + flow. 3 = names the bottleneck + SPOF and has a scaling story."),
 ("Why these projects in this order — what did each teach you?",
  "The order should show progression: server-stats (Linux fundamentals) → log archive (automation/scripts) → Dockerfile (containerization) → CI workflow (automation of testing/deploy) → capstone (integration). Each project teaches the NEXT prerequisite. This mirrors the path's design (A01→A06) and shows you understand dependency-aware learning.",
  "1 = lists projects. 2 = names the skill each built. 3 = justifies order by prerequisites and cumulative skill."),
 ("What would you change if you had another week? (looks for prioritization + judgment)",
  "Answer with prioritization: pick the highest-leverage improvement and defend it — e.g. 'add automated backups + restore drill' (reliability) over 'prettier UI'. Show judgment: know what's good enough vs what matters. Avoid listing everything; pick 1–2 with reasons (risk reduction, security, observability).",
  "1 = 'add more features'. 2 = names a real improvement. 3 = prioritizes by risk/impact and defends the choice."),
 ("What's the trigger that tells you it's time to learn Kubernetes/Terraform/SRE? (looking for honest self-assessment)",
  "The trigger should be a real operational wall: 'when Docker alone isn't enough (5+ servers, orchestration pain)' → Kubernetes; 'when I keep re-provisioning servers by hand' → Terraform; 'when incidents keep recurring and I need systematic reliability' → SRE. Honest self-assessment: naming the pain that precedes the tool shows you learn on demand, not by hype.",
  "1 = 'when I have time'. 2 = names a concrete pain. 3 = ties each tool to a specific wall it solves — demand-driven learning."),
 ("What did you build before learning it, and what problem did it solve?",
  "The 'before' matters: you built a shell script that configures servers (pain: manual), THEN learned Ansible (problem it solves: idempotent config at scale). The narrative: pain → tool → outcome. Shows problem-first learning, which is what senior engineers respect (tools are solutions, not identities).",
  "1 = 'I learned X'. 2 = names the pain. 3 = full pain→tool→outcome arc with a measurable result."),
 ("What's your learning order and why that order?",
  "Reference the path's dependency design: Linux → Git → Networking → Docker → CI/CD → capstone (Phase A); then k8s → Terraform → AWS → observability → GitOps → reliability → automation → ownership → interview prep (Phase B). Why: each builds on the previous (Docker needs Linux/networking; k8s needs Docker; GitOps needs Git + CI/CD). The order is prerequisite-driven, not random.",
  "1 = lists modules. 2 = explains one dependency. 3 = articulates the prerequisite chain and how it accelerates later learning."),
 ("Summarize this path in 60 seconds — what can you now do that you couldn't 10 weeks ago?",
  "Before/after: '10 weeks ago I could use a computer. Now: I can provision and operate Linux servers, version everything in Git, containerize any app with Docker, build CI/CD that tests and deploys automatically, and debug network problems layer by layer. I can take a repo and turn it into a deployed, tested, automated system.' Land on capability, not topics.",
  "1 = lists topics. 2 = capability-focused summary. 3 = tight before/after with the deploy-a-repo capability as the anchor."),
 ("Which 3 projects are your portfolio and why those?",
  "Pick 3 that show a range: one fundamentals (server-stats/log archive — Linux+automation), one container/CI (Dockerfile + pipeline — containerization + automation), one integration (capstone — everything together, deployed). Why: they demonstrate the skill spread JDs list (Linux, scripting, Docker, CI/CD) and each is externally verified (roadmap.sh difficulty-tagged, starter counts).",
  "1 = lists 3. 2 = justifies each by skill. 3 = ties to JD requirements and external validation."),
 ("What's your honest level: what would you need to learn to be production-safe in a junior role?",
  "Honest calibration: 'Phase A done + basics of X. To be production-safe I'd still need: real production exposure (on-call, incident handling), deeper AWS, and team collaboration (PR review, communication).' Interviewers reward self-awareness — overclaiming is instantly detectable in follow-up drills. Frame remaining gaps as a learning plan, not a weakness.",
  "1 = overclaims. 2 = names gaps honestly. 3 = calibrated level + a concrete plan for the gaps (the growth mindset signal)."),
 ("Be able to walk through every project: what it does, stack, how you'd scale it, what breaks",
  "For each project have: 30-sec description, stack (why those choices), request flow, scaling path (bottleneck first), first-failure mode (SPOF). Practice the walkthrough out loud until it's natural. The interviewer probes depth — know your own code and its limits better than anyone.",
  "1 = can describe. 2 = stack + flow. 3 = bottleneck + SPOF + scaling story for every project."),
 ("server-stats (8,038 starters), log-archive-tool (2,031), basic-dockerfile (1,255), file-integrity-checker (1,1...)",
  "These are roadmap.sh community projects with real starter counts — external validation that the difficulty is right for entry level. server-stats: parse /proc + system info into a script (Linux + scripting). Log archive: rotate/compress/archive (automation). basic-dockerfile: containerize (Docker). file-integrity-checker: hash files + detect changes (scripting + security thinking). Mentioning starter counts shows you chose projects with community validation.",
  "1 = lists them. 2 = names the skill per project. 3 = cites validation (starter counts) + the cumulative skill story."),
 ("Intermediate: pomodoro (601), configuration-management/Ansible (339), multi-container (260), automated-backups (2...)",
  "Intermediate tier: pomodoro (app + persistence), configuration-management (Ansible — idempotent config), multi-container (compose — services), automated-backups (reliability — restore drills). These map to Phase B skills (B07 automation, B06 backups/DR) and are the natural portfolio progression after entry projects.",
  "1 = lists names. 2 = maps to Phase B skills. 3 = portfolio progression argument (entry → intermediate → advanced)."),
 ("Advanced: blue-green (582), multiservice-docker (406), prometheus-grafana (296), service-discovery/Consul (253...)",
  "Advanced tier: blue-green (deployment strategy — B05), multiservice-docker (service mesh/network patterns), prometheus-grafana (observability — B04), service-discovery/Consul (registration + discovery). These are interview-fodder: they demonstrate you've touched the exact topics JDs list (deployment strategies, observability).",
  "1 = lists names. 2 = maps each to a module. 3 = the portfolio-tier argument (show progression to advanced patterns)."),
 ("Portfolio story: pick 1 from each tier, deploy to a real cloud, write README + architecture diagram",
  "The rule: one project per tier (entry/intermediate/advanced), each DEPLOYED (free tier: Railway/Render/Fly), each with a README (what/why/how/run) + architecture diagram. A deployed, documented project beats 10 local ones. This mirrors the A06 capstone criteria and gives recruiters a clickable proof trail.",
  "1 = has projects. 2 = deployed + documented. 3 = the tiered portfolio story with diagrams — a complete proof trail."),
],
}

# --- load sub-topics mapping for headers ---
def build(path, phase_ids):
    lines = []
    lines.append("---")
    lines.append("# 🎯 Platform Engineering — Model Answer Bank")
    lines.append("")
    lines.append("> **How to use:** Read the question → answer it out loud (or write it) → expand **Reveal model answer** → self-grade 1/2/3 against the rubric. Any score of 1–2 means re-study that module's checklist item and revisit in 2 days.")
    lines.append(">")
    lines.append("> Generated from `Platform-Engineering-Path.json` research blocks. **410 questions** (145 module-level + 265 sub-topic). Rubrics: **1** = can't answer · **2** = partial/correct with gaps · **3** = confident, complete, production-aware.")
    lines.append("")
    lines.append("## 📖 Contents")
    lines.append("")
    for p in d['phases']:
        if p['id'] not in phase_ids:
            continue
        for m in p['modules']:
            lines.append(f"- [{m['id']} {m['title']}](#{m['id'].lower()}-{m['title'].lower().replace(' ', '-').replace('—','').replace('–','')[:60]})")
    lines.append("")
    return lines

def section(mid, answers):
    m = next(m for p in d['phases'] for m in p['modules'] if m['id'] == mid)
    # sub-topics order from JSON, then module-level
    order = []
    stnames = {}
    for s in m.get('subTopics', []):
        qs = s.get('research', {}).get('interviewFocus', [])
        if qs:
            order.append(('st', s['name'], qs))
            stnames[s['name']] = True
    mq = m.get('research', {}).get('interviewFocus', [])
    if mq:
        order.append(('module', 'Module research', mq))
    return order

def answer_for(q, answers, default_why):
    for tup in answers:
        qu = tup[0]
        if qu.strip().lower().startswith(q.strip().lower()[:40]):
            a = tup[1]
            rubric = tup[2]
            why = tup[3] if len(tup) > 3 and tup[3] else default_why
            return (a, rubric, why)
    return None

def render_q(q, ans, idx):
    if not ans:
        return f"<details>\n<summary>❓ Q{idx}: {q}</summary>\n\n**Model answer:** *(pending — gap to fill)*\n\n**Rubric:** 1=basic · 2=partial · 3=strong\n</details>\n"
    a, rubric, why = ans
    return f"""<details>
<summary>❓ Q{idx}: {q}</summary>

**Model answer:** {a}

**Rubric:** {rubric}

**Why asked:** {why}
</details>
"""

def main():
    out = []
    out.append("# 🎯 Platform Engineering — Model Answer Bank")
    out.append("")
    out.append("> **How to use:** read the question → answer it out loud or in writing → expand **Reveal model answer** → self-grade 1/2/3. A 1–2 means re-study that module's items and revisit in 2 days (spaced repetition). Generated from `Platform-Engineering-Path.json` research blocks — the site's 410 interview questions, now with model answers.")
    out.append(">")
    out.append("> **Rubrics:** 🟥 1 = can't answer / wrong · 🟧 2 = partial, correct with gaps · 🟩 3 = confident, complete, production-aware.")
    out.append("")
    missing = []
    total = 0
    for p in d['phases']:
        if p['id'] != 'A':
            continue
        for m in p['modules']:
            mid = m['id']
            ans = ANSWERS.get(mid, [])
            out.append(f"## {mid} {m['title']}")
            out.append("")
            order = section(mid, ans)
            for kind, name, qs in order:
                out.append(f"### {name}")
                out.append("")
                idx = 0
                for q in qs:
                    idx += 1
                    total += 1
                    a = answer_for(q, ans, f"Asked in {mid} — verify against the module's checklist items and {m['id']} research block.")
                    if not a:
                        missing.append((mid, name, q))
                    out.append(render_q(q, a, idx))
                    out.append("")
            out.append("---")
            out.append("")
    # coverage summary
    out.append("## ✅ Coverage")
    out.append("")
    out.append(f"Answered: {total - len(missing)} / {total} Phase A questions.")
    if missing:
        out.append("")
        out.append("**Questions still needing answers:**")
        out.append("")
        for mid, name, q in missing:
            out.append(f"- [{mid}] {q[:80]}")
    open(os.path.join(ANSWER_BANK, 'Platform-Answer-Bank.md'), 'w', encoding='utf-8').write('\n'.join(out))
    print(f"Phase A done: {total} questions, {len(missing)} missing")
    for mid, name, q in missing:
        print(f"  MISSING [{mid}][{name[:20]}]: {q[:70]}")

main()
