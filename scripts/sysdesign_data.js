/* System Design for DevOps — framework + 8 practice problems with model answers.
   Every scenario maps to curriculum modules so the candidate reuses what they
   already studied. Answers are compact "talk tracks" — expand with your own examples. */
window.SYSDESIGN_DATA = {
  "source": "Compiled from DevOps system-design interview research (devopsboys 50+ CI/CD Qs 2026, algomaster design-a-CI/CD-pipeline, semaphore.io, KodeKloud) + platform interview practice.",
  "what": "System Design for DevOps is NOT designing Twitter. It's designing the INFRASTRUCTURE a product runs on, with the interviewer probing depth, not breadth: 'design a CI/CD pipeline', 'design monitoring for 100 services', 'design a zero-downtime deployment'. You architect pipelines, registries, clusters, observability, IaC, and rollback strategies — and justify tradeoffs. It's the #1 separator between junior (knows tools) and mid (designs systems).",
  "framework": {
    "name": "The 6-step answer framework",
    "steps": [
      { "step": "1. Clarify scope", "detail": "How many devs? How many services? Traffic? Budget? On-prem or cloud? Ask 2-3 questions — interviewers reward this. Example: '50 devs, 10 microservices, AWS, deploys must be zero-downtime'." },
      { "step": "2. Requirements", "detail": "State 3-5 functional (build, test, deploy, rollback) + 3-4 non-functional (speed-to-prod < 15 min, 99.9% uptime, audit, security gates)." },
      { "step": "3. High-level components", "detail": "Draw the flow: SCM → CI server → artifact registry → env promotion → deploy → monitor. Name real tools: GitHub Actions/Jenkins, ECR/Harbor, ArgoCD, Prometheus." },
      { "step": "4. Deep dive (pick 1-2)", "detail": "Go deep on what the interviewer nudges: caching? secrets? canary analysis? scaling the agents? zero-downtime? Show you know the hard parts." },
      { "step": "5. Tradeoffs & decisions", "detail": "Why X over Y: GitHub Actions vs Jenkins (managed vs self-hosted, cost vs control); blue-green vs canary (cost vs risk); YAML vs HCL (who owns IaC)." },
      { "step": "6. Failure modes", "detail": "What breaks? Pipeline build fails at 2am → alert + auto-retry; bad deploy → auto-rollback + status page; registry down → cached images + multi-region mirror." }
    ]
  },
  "problems": [
    {
      "id": "SD01",
      "title": "Design a CI/CD pipeline for a 50-dev org shipping 10 microservices",
      "modules": ["A05", "B05"],
      "walkthrough": [
        "Scope: 50 devs, 10 Java/Node services, GitHub, AWS, target: code-to-prod < 15 min, zero-downtime.",
        "Flow: feature branch → PR → CI (lint, unit tests, build, SAST scan) → merge to main → CD (build image, push ECR, deploy staging) → e2e + security gate → promote prod (blue-green) → smoke + rollback.",
        "Components: GitHub Actions (or Jenkins), artifact registry (ECR/Harbor), IaC (Terraform), deploy (ArgoCD or scripts), monitoring (Prometheus + alert).",
        "Key decisions: trunk-based with short-lived branches; main is always deployable; cache dependencies + buildx layer cache to hit 15-min target; secrets via Vault/SSM, never in YAML.",
        "Failure modes: build failure → alert + auto-retry once; bad prod deploy → auto-rollback to previous image; pipeline self-heals via health check after deploy."
      ],
      "talk_track": "Start with stages, each with clear in/out. Then talk about ONE deep decision (e.g., build cache or canary analysis). End with rollback + monitoring."
    },
    {
      "id": "SD02",
      "title": "Design monitoring + alerting for 100 microservices",
      "modules": ["B04"],
      "walkthrough": [
        "4 pillars: metrics (Prometheus), logs (Loki/ELK), traces (Jaeger/Tempo), events (alertmanager).",
        "Collect: node-exporter per host, kube-state-metrics per pod, service exporters (RED: Rate/Errors/Duration per service).",
        "Storage: TSDB for metrics w/ retention tiers; log shipping via fluent-bit → object store; sampling for traces.",
        "Alerting: SLO-based (error budget burn alerts) not threshold spam; Alertmanager routes to Slack/PagerDuty w/ severity; dedup + grouping.",
        "Dashboards: 1 service dashboard per team (RED), 1 platform overview (USE: Util/Saturation/Errors).",
        "Failure modes: alert fatigue → only alert on SLO burn; prometheus down → HA pair; log volume spike → rate limits + drop rules."
      ],
      "talk_track": "Say RED/USE explicitly (interviewers love it), then the SLO/burn-alert design — that's the mid-level signal."
    },
    {
      "id": "SD03",
      "title": "Design a zero-downtime deployment strategy",
      "modules": ["A05", "B05"],
      "walkthrough": [
        "Options ladder: rolling (default, simple, slow) → blue-green (two envs, instant switch, double cost) → canary (2-5% then ramp, needs good observability) → A/B (traffic split for testing).",
        "Pick by risk: payment service → canary with auto-abort on error-rate spike; internal CRUD → rolling.",
        "Enablers: stateless pods (externalize state to DB/PVC), health checks (readiness probe must pass before traffic), DB migrations backward-compatible (expand-contract), feature flags for instant kill-switch.",
        "Rollback: keep previous image deployable; ArgoCD/Rollouts give automated canary analysis + instant rollback.",
        "Failure modes: bad deploy reaches 100% → auto-abort + rollback + postmortem; migration broke → feature flag off."
      ],
      "talk_track": "Frame it as 'choose by risk + observability' — that decision logic is what they grade."
    },
    {
      "id": "SD04",
      "title": "Design secrets management for dev + prod",
      "modules": ["B08", "B02"],
      "walkthrough": [
        "Never in git/YAML/image. Central vault: HashiCorp Vault (or AWS SSM/Secrets Manager).",
        "Dev: Vault dev-mode or local secrets + .env.template; CI injects short-lived tokens (Vault Agent / external-secrets operator).",
        "Prod: external-secrets operator syncs to k8s secrets; dynamic DB credentials (Vault leases, auto-rotate); rotation policy + audit log.",
        "Access: least-privilege policies (who can read prod secret X), human access via short-lived approval flow.",
        "Failure modes: vault down → cached secrets in memory + fail-open policy decision; leaked secret → revoke + rotate + audit."
      ],
      "talk_track": "Name dynamic credentials + rotation — 90% of candidates stop at 'store it in Vault'."
    },
    {
      "id": "SD05",
      "title": "Design a multi-region deployment + disaster recovery",
      "modules": ["B03", "B06"],
      "walkthrough": [
        "Active-active vs active-passive: active-active for read-heavy (DB multi-master complex), active-passive + failover for most.",
        "IaC: same Terraform in both regions (different state backends/workspaces); image registry replicated or multi-region mirror.",
        "DNS/edge: Route53 latency-based routing + health checks; static assets via CDN.",
        "DB: RDS cross-region read replica + manual/automated failover; or Aurora Global DB.",
        "DR drill: chaos test (B06) region failover at least quarterly; RTO/RPO defined: e.g., RTO 30 min, RPO 5 min.",
        "Failure modes: region down → DNS switches → verify app boots with warm cache; data lag → read-your-writes handling."
      ],
      "talk_track": "Lead with RTO/RPO numbers, then active-passive choice, then the drill. Numbers = senior signal."
    },
    {
      "id": "SD06",
      "title": "Design a logging pipeline for 1000 req/s per service",
      "modules": ["B04"],
      "walkthrough": [
        "Agents: fluent-bit/otel-collector as DaemonSet per node → filter/parse → buffer.",
        "Transport: Kafka (or S3 direct) as durable buffer; never write directly to storage from app.",
        "Storage: Loki (log = metric-friendly) or ES; tiered: hot 7d, warm 30d, cold object storage.",
        "Query: structured JSON logs w/ correlation IDs (trace_id) so you can join logs+traces; k8s metadata enriched.",
        "Failure modes: kafka backpressure → drop non-critical logs; volume spike → sampling + rate limit; query slow → partition by time+service."
      ],
      "talk_track": "Mention correlation IDs + Kafka buffer — the two things juniors miss."
    },
    {
      "id": "SD07",
      "title": "Design a container platform on Kubernetes for a growing team",
      "modules": ["B01", "B02"],
      "walkthrough": [
        "Multi-tenant: namespaces per team + ResourceQuotas + LimitRanges; RBAC: least-privilege per team; network policies per namespace.",
        "Control plane: managed (EKS/GKE/AKS) — don't run your own control plane at this stage.",
        "Golden path: platform templates (Helm charts / Kustomize) + approval; developers don't write raw YAML.",
        "Image supply chain: signed images (cosign), allowlist registry, scan in CI (trivy) + admission policy (OPA/Gatekeeper).",
        "Cost: namespace budgets + autoscaling (HPA + cluster autoscaler/Karpenter).",
        "Failure modes: noisy neighbor → quotas; bad admission policy → canary the policy; cluster upgrade → rolling node pools."
      ],
      "talk_track": "Golden-path + supply chain + quotas — say all three and you've covered what platform teams actually do."
    },
    {
      "id": "SD08",
      "title": "Design an on-call / incident response system",
      "modules": ["B06", "B08"],
      "walkthrough": [
        "Alerting → paging: severity levels; SLO burn → page, non-SLO → ticket. Avoid page-storms with grouping/dedup.",
        "Rotation: 2-person (primary+secondary), follow-the-sun optional; on-call pay/time-off policy.",
        "Response: status page (pre-written templates), incident channel, timeline capture (Slack/Incident.io), roles (IC, comms, scribe).",
        "Runbooks: top 20 incidents → documented runbooks, tested in chaos drills (B06).",
        "Postmortem: blameless, 5-whys, action items tracked; SLO/error budget review monthly.",
        "Failure modes: alert fatigue → restructure; key person only → pair rotations; no runbook → chaos drills."
      ],
      "talk_track": "Blameless culture + runbooks + drill cadence — this is a culture question disguised as a system question."
    }
  ]
};
