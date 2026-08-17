# 🧠 System Design for DevOps — The Guide

> Companion doc to the site's **System Design** appendix. Read this once, then drill the 8 scenarios on the site out loud (with paper + pencil).

## What it actually is

In a **DevOps/platform interview**, they rarely ask you to design Twitter. They ask you to **design infrastructure**:

- *"Design a CI/CD pipeline for a 50-developer org shipping 10 microservices."*
- *"How would you set up monitoring + alerting for 100 services?"*
- *"Design a zero-downtime deployment strategy for a payment service."*
- *"Design a secrets-management system for dev + prod."*
- *"Design a multi-region deployment with disaster recovery."*

You architect **pipelines, registries, clusters, observability, IaC, and rollback strategies** — and justify tradeoffs. It's the same skill as software system design, but the building blocks are different. **It's the #1 separator between junior (knows tools) and mid (designs systems)**, and Tier-1 companies (Razorpay, Postman, CRED, Atlassian, GitLab…) grill you on it.

## The 6-step answer framework

| Step | What to say |
|---|---|
| **1. Clarify scope** | Ask 2-3 questions: how many devs? services? traffic? budget? cloud or on-prem? Interviewers reward this. *"50 devs, 10 microservices, AWS, zero-downtime required."* |
| **2. Requirements** | 3-5 functional (build, test, deploy, rollback) + 3-4 non-functional (speed-to-prod < 15 min, 99.9% uptime, audit, security gates). |
| **3. High-level components** | Draw the flow: SCM → CI server → artifact registry → env promotion → deploy → monitor. Name tools: GitHub Actions/Jenkins, ECR/Harbor, ArgoCD, Prometheus. |
| **4. Deep dive (pick 1-2)** | Go deep where the interviewer nudges: build caching? secrets? canary analysis? scaling agents? zero-downtime? |
| **5. Tradeoffs & decisions** | Why X over Y: GitHub Actions vs Jenkins (managed vs self-hosted), blue-green vs canary (cost vs risk), YAML vs HCL. |
| **6. Failure modes** | What breaks? Build fails at 2am → alert + auto-retry; bad deploy → auto-rollback + status page; registry down → cached images + multi-region mirror. |

## The 8 canonical scenarios (on the site)

1. **SD01** — CI/CD pipeline for 50 devs / 10 microservices → uses A05 + B05
2. **SD02** — Monitoring + alerting for 100 services → uses B04
3. **SD03** — Zero-downtime deployment strategy → uses A05 + B05
4. **SD04** — Secrets management for dev + prod → uses B08 + B02
5. **SD05** — Multi-region deployment + DR → uses B03 + B06
6. **SD06** — Logging pipeline at 1000 req/s → uses B04
7. **SD07** — Container platform on K8s for a growing team → uses B01 + B02
8. **SD08** — On-call / incident response system → uses B06 + B08

Each has a full walkthrough + a "talk track" on the site. Open the **🧠 System Design** appendix and drill them out loud, one per day, with a timer (20 min each like the real round).

## Cheat sheet of signals interviewers grade

| Say this | Why it scores |
|---|---|
| **RED / USE** (Rate-Errors-Duration / Util-Saturation-Errors) | Shows real monitoring vocabulary |
| **SLO + error-budget burn alerts** | Mid-level signal; juniors say "threshold alerts" |
| **RTO / RPO numbers** | Senior signal; juniors never give numbers |
| **Dynamic credentials + rotation** | 90% of candidates stop at "store it in Vault" |
| **Correlation IDs (trace_id)** in logs | Shows you understand distributed debugging |
| **Golden path / platform team** | Shows platform-engineering maturity |
| **Choose by risk + observability** (blue-green vs canary) | Shows decision logic, not memorization |
| **Failure modes last** | Completes the story; most candidates stop at "it works" |

## How to practice (3 weeks to fluent)

- **Week 1**: Read all 8 walkthroughs, one/day. Re-explain each to a rubber duck / AI in 10 min.
- **Week 2**: Drill with a timer — 20 min each, paper + pencil. Record yourself. Count how many steps of the framework you hit.
- **Week 3**: Mock with a human (study partner / interview-prep community). Ask them to push on step 4 (deep dive) — that's where offers are won.
- Tie every scenario to the modules you've already done (SD → module links are on the site). You're not learning new material — you're assembling what you already know into systems.
