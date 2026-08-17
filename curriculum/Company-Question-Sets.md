# 🎯 Company Question Sets — Drill Before You Apply

> Companion doc to the site's **Company Q-Sets** appendix. Most-asked questions per hiring tier, each linked to where the full answer lives in the answer banks (Platform-Answer-Bank.md + Platform-Answer-Bank-B.md).

## How to use

1. Before applying to a company: open its tier, drill those questions from the answer banks.
2. Don't memorize — **re-explain in your own words**.
3. Tier 1 expects you to DRAW (paper + pencil ready for architecture questions).
4. Tier 2 expects SPEED (crisp 2-min answers, then next topic).
5. Tier 3 expects CLARITY (remote = explain like they can't see your screen).

## Tier 1 — Platform-Native (Razorpay, Postman, BrowserStack, PhonePe, CRED, Swiggy, Zoho, Freshworks, ThoughtSpot, Atlassian, GitLab, DigitalOcean)

Pattern: 2-3 rounds — core DevOps theory + hands-on → system design (infra) → cultural/STAR + take-home or live debugging. Expect deep K8s + Linux + a design question (SD01-SD08).

1. How does Kubernetes schedule a pod? (B01 Workloads/Scheduling)
2. A pod is CrashLoopBackOff — debug it top-down. (B01 Debugging)
3. Design a CI/CD pipeline for 50 microservices with zero-downtime. (SD01+SD03 / B05)
4. Blue-green vs canary vs rolling — when each? (B05 Progressive delivery)
5. How does Terraform state work? Lock/drift? (B02 State)
6. 5xx spikes every 10 min — walk the investigation. (B04 + A03 debug flow)
7. Secrets in CI/CD without leaking. (B08 / SD04)
8. On-call experience: real incident detection→postmortem. (B06/B08 STAR)
9. Linux: service won't start — debug path with commands. (A01)
10. Git: recover a deleted branch or bad merge. (A02 reflog)

## Tier 2 — Volume Hirers (TCS, Infosys, Accenture, Capgemini, IBM, HCLTech, Wipro, Cognizant, Amdocs, ZS Associates)

Pattern: online assessment (MCQ: Linux/Docker/K8s/networking) → 1-2 technical rounds → HR. **Certs (CKA/Terraform) are a big shortlist booster here.** Crisp, by-the-book answers.

1. Docker vs Kubernetes? (A04 + B01)
2. Linux boot process + common systemd commands. (A01)
3. TCP vs UDP — real example each. (A03)
4. Multi-stage Dockerfile — why? (A04)
5. K8s components: control plane vs nodes. (B01)
6. What is Terraform and what problem does it solve? (B02)
7. CI vs CD — give a real pipeline. (A05)
8. Commands to check disk usage + kill a hung process. (A01)
9. How does DNS work — walk a URL request. (A03)
10. Tell me about a project you automated. (A06 STAR)

## Tier 3 — Global Remote (Zapier, Datadog, Grafana Labs, HashiCorp, MongoDB, Elastic, Cloudflare, Snyk, Docker, Paytm)

Pattern: high English bar, async take-homes, live-coding scripts, product-focused design. Expect deep observability (Datadog/Grafana), IaC (HashiCorp), and 6-step framework design questions.

1. Design metrics + alerting for a globally distributed product. (SD02 / B04)
2. Explain SLOs + error budgets to a PM. (B04)
3. Design multi-region deployment with DR. (SD05 / B03)
4. Live: bash/python retry with backoff. (B07)
5. Self-hosted vs managed CI runner — cost tradeoffs. (A05)
6. How do you secure a K8s cluster? RBAC/netpol/secrets. (B08 + B01)
7. Explain ArgoCD GitOps sync + drift. (B05)
8. Customer reports slowness — full diagnosis. (B04 + A03)
9. Walk me through your capstone architecture. (A06 — rehearse the 5-min tour)
10. Design secrets management for 100 engineers. (SD04)

## The 2-week drill plan

- **Week 1**: Tier 2 set (fast wins, gets you interview-ready for volume hiring) — 10 questions/day from the answer banks.
- **Week 2**: Tier 1 set (the hard ones) — 5/day with paper + pencil; record your answers; score yourself on the 6-step framework for design questions.
- Then Tier 3 as your portfolio matures (post B05/B06).
