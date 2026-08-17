# 🧪 Hands-on Lab Checklists — Do, Verify, Done

> Companion doc to the site's **Lab Checklists** appendix. The rule: **do the action for real → confirm the 'verify' line → tick it.** "Seen it in a video" doesn't count. Progress saves in your browser.

Run these on a local VM (VirtualBox/WSL) or free-tier cloud account. Full item list with verify lines is interactive on the site (🧪 Lab Checklists); this doc explains the method + the critical labs.

## How to use

1. **Do** the action for real — type the commands, break things on purpose.
2. **Verify** the expected output appears (each item on the site has a `✔ Verify:` line).
3. **Tick** the checkbox — progress persists in your browser (localStorage).
4. Can't verify? Re-do the lab. The verify line is the proof you actually learned it.

## Why labs matter more than reading

The 426-question answer bank teaches you to *talk*. The labs teach you to *do*. Tier-1 interviews (Razorpay, Postman, CRED, GitLab) include live debugging / hands-on rounds — and your B05 GitOps repo + A06 capstone become the demo you walk them through. Labs convert "I know it" into "I've done it", which is what separates a 12 LPA offer from a 6 LPA one.

## The 14 lab modules (site has full items)

| Module | What you'll have proven |
|---|---|
| A01 | Create users, chmod, journalctl debug, ps/top/ss, cron |
| A02 | reflog recovery, interactive rebase, cherry-pick, bisect, PR flow |
| A03 | curl -v narration, dig, tcpdump, openssl cert check, nc, iptables |
| A04 | multi-stage images, non-root, .dockerignore cache, compose, trivy scan |
| A05 | green GH Actions pipeline, quality gates, secrets, cache, approvals, a real red→green |
| A06 | capstone: 2-service app, CI/CD, monitoring, **v2 bug → spike → rollback**, README, badge |
| B01 | kind cluster, ingress, CrashLoopBackOff debug, PVC persistence, NetworkPolicy, HPA, rollout undo, RBAC deny |
| B02 | tf plan/apply/destroy, remote state, modules, workspaces, prevent_destroy, import |
| B03 | VPC+subnets+NAT, SG by IP, IAM role, S3 versioning+lifecycle, user-data, budget, RDS snapshot |
| B04 | Prometheus rules + Alertmanager, Grafana RED/USE, SLO burn calc, OTel trace, Loki correlate |
| B05 | ArgoCD app-of-apps, drift reconcile, canary w/ analysis, auto-rollback, external-secrets |
| B06 | chaos pod-kill, latency chaos, incident drill w/ timeline, blameless postmortem, DB failover |
| B07 | idempotent log-summary script, retry+backoff, set -euo pipefail, Ansible idempotent, cron |
| B08 | trivy + kube-bench, RBAC least-privilege, default-deny netpol, gitleaks pre-commit, 5 runbooks, on-call sim |

## The 5 labs that win interviews

If you only have time for five, do these — they map to the exact stories interviewers ask for:

1. **A06 rollback demo** — deploy v2 with a bug, watch Grafana spike, roll back. This becomes your #1 STAR story.
2. **B01 CrashLoopBackOff debug** — "walk me through a pod that won't start" is THE most-asked K8s question.
3. **B05 drift reconcile** — kubectl scale outside Git, ArgoCD reverts it. Proves you understand GitOps, not just tools.
4. **B05 canary w/ analysis** — the canary auto-aborts on error spike. This is mid-level proof.
5. **B06 incident drill** — a documented timeline + blameless postmortem. Answers every "tell me about an incident" question.
