# Platform Engineering Path — Gap Analysis
**Date:** 2026-08-17  
**Scope:** All 4 source files + website  
**Method:** Multi-pass read of every module, cross-checked against roadmap.sh (364K ⭐), India job market data (Aug 2026), and current platform engineering interview standards  

---

## Legend

| Symbol | Meaning |
|--------|---------|
| ✅ FIXED | Already applied in Passes 1–3 |
| 🔴 HIGH | Affects interview readiness — candidate will be visibly underprepared |
| 🟡 MEDIUM | Depth gap — candidate will lack detail under questioning |
| 🔵 LOWER | Completeness — minor, doesn't block employability |
| → FILE:LINE | Exact insertion point in the relevant file |

---

## FIXED GAPS (Passes 1–3 already applied)

### GAP-01 ✅ — index.html hardcoded item count
- **File:** `website/index.html` line 49  
- **Was:** `0 / 163 items` (stale, actual count was 169+)  
- **Fix applied:** Changed to `0 / — items` (JS overwrites dynamically)  
- **Also fixed:** `app.js` — "all 15 modules" hardcoded string in `viewSources()`

### GAP-02 ✅ — Jenkins + GitLab CI awareness missing from A05 (Phase A)
- **Files affected:** All 4 source files  
- **Was:** A05 only taught GitHub Actions; India enterprise job market runs Jenkins (TCS/Infosys/Accenture) and GitLab CI appears in most mid-level JDs  
- **Fix applied:** Added "On the radar: Jenkins & GitLab CI" sub-topic to A05 in all 4 files with 2 items (Jenkins awareness, GitLab CI awareness) + research block  
- **Insertion point was:** After A05 "Exit drill" sub-topic, before "Agile & delivery practice"

### GAP-03 ✅ — CI Secrets handling missing from A05 (Phase A)
- **Files affected:** All 4 source files  
- **Was:** A05 taught pipeline anatomy, gates, deploy step — but never mentioned that API keys and registry credentials must live in GitHub Secrets, not in the YAML. A learner building their first pipeline would not know this.  
- **Fix applied:** Added "Secrets in CI" skill item to the A05 core skills sub-topic in all 4 files  
- **Insertion point was:** After "Deploy step" item in A05 core skills sub-topic

### GAP-04 ✅ — No test suite in A06 Capstone
- **Files affected:** All 4 source files  
- **Was:** Capstone required a Dockerfile + docker-compose + CI workflow, but no tests. The core lesson of CI ("pipeline goes red on failure") is meaningless without something that can fail.  
- **Fix applied:** Updated the "Bring it together" detail in A06 to require a minimal test suite (at least one unit test + one smoke/integration test) in all 4 files  
- **Insertion point was:** The `detail` field of the "Bring it together" item in A06

---

## REMAINING GAPS (Passes 4–15 — not yet applied)

---

### GAP-05 🔴 — `dig`, `mtr`, `tcpdump` missing from A03 Networking skills list

**Why it matters:**  
`mtr` and `tcpdump` appear in the A01 Linux module research block (PATH.md line 114: `7-step flow: ip addr show → ping → mtr → nc -zv → dig +short → curl -v → tcpdump`) and the A03 depth sequence (PATH.md line 133: `tcpdump basics`), but they are **not in the formal skills items list** that learners tick off. A candidate who only reads the checkboxes will never encounter these tools before their interview.  

`dig` is the production-standard DNS debugging tool — more informative than `nslookup`. It shows TTL, record type, authoritative vs cached responses. Interviewers expect it for DNS questions.

**What to add:**
```
- dig — DNS lookup with full detail (TTL, record type, auth vs cached); the production upgrade from nslookup
  📚 dig man page / DNSimple guide
- mtr — combines ping + traceroute in real-time; the right tool for intermittent latency
  📚 mtr docs
- tcpdump — capture packets on the wire; the last-resort tool when nothing else shows what's happening
  📚 tcpdump man page / Daniel Miessler tcpdump primer
```

**Files & insertion points:**

| File | Location | Line (approx) |
|------|----------|---------------|
| `Platform-Fundamentals-INDEX.md` | After `Host reachability` item in A03 core skills | ~93 |
| `Platform-Engineering-PATH.md` | After `Host reachability` item in A03 core skills sub-topic | ~264 |
| `Platform-Engineering-Path.json` | After `Host reachability` item in A03 core skills items array | ~556 |
| `website/data.js` | Same as JSON | ~556 |

**Resources to use:**
- `https://linux.die.net/man/1/dig` (official-doc)
- `https://www.isc.org/blogs/mtr-a-network-diagnostic-tool/` (official-doc)
- `https://danielmiessler.com/study/tcpdump/` (community, fetch-verified)

---

### GAP-06 🔴 — B01 Kubernetes timing is misleading (claims 2 weeks, needs 5+)

**Why it matters:**  
The B01 module heading says "Weeks 1–2" in both the MidLevel INDEX (line 26) and the PATH.md B01 heading. But the module's own depth sequence says "Week 5+: operators, RBAC hardening, Prometheus/Grafana on cluster, ArgoCD" and "Week 4+: add a service mesh lab". The module contains ~25 distinct learnable items across 7 sub-topics. A learner who believes "2 weeks is enough" will rush and emerge underprepared.

**What to add:**  
A realistic timing note under the operator mindset section explaining the 2-week figure covers the core kubectl + debugging loop only; full depth (security, mesh, operators) takes 4–6 weeks.

**Files & insertion points:**

| File | Location | Line (approx) |
|------|----------|---------------|
| `Platform-MidLevel-INDEX.md` | After "The operator mindset" paragraph, B01 section | ~31 |
| `Platform-Engineering-PATH.md` | After B01 mental model callout | ~707 |

**Note:** JSON/data.js don't need this — timing notes are prose context, not structured data items.

---

### GAP-07 🔴 — Chaos Mesh (k8s-native tool) missing from B06 Reliability

**Why it matters:**  
B06 teaches chaos engineering concepts correctly (steady state, hypothesis, blast radius, game days) but the only tools referenced are **Chaos Monkey** (Netflix-specific, doesn't run in Kubernetes) and **Principles of Chaos Engineering** (a principles document, not a tool). A candidate asked "how would you run a chaos experiment on your Kubernetes cluster?" would have no concrete answer.

**Chaos Mesh** (CNCF project, Apache-2.0, runs natively in k8s) and **Litmus Chaos** (CNCF, also k8s-native) are the standard tools. The PATH.md already mentions them in the *research block* (line 1719: "Chaos Mesh vs Litmus vs Gremlin — when would you use each?" and line 1798: "Chaos Mesh docs") and depth sequence (line 1806: "run a chaos experiment (Chaos Mesh/litmus) on your cluster") but they are **not in the actual skill items** that learners tick off.

**What to add:**  
Two skill items in the B06 chaos engineering sub-topic:
```
- Chaos Mesh (k8s-native) — install, run a pod-kill/network-latency experiment, verify hypothesis
  📚 https://chaos-mesh.org/docs/
- Litmus Chaos — CNCF alternative; LitmusChaos portal for experiment management
  📚 https://litmuschaos.io/
```

**Files & insertion points:**

| File | Location | Line (approx) |
|------|----------|---------------|
| `Platform-MidLevel-INDEX.md` | After "Game days" item in B06 chaos engineering sub-topic | ~344 |
| `Platform-Engineering-PATH.md` | After "Game days" item in B06 chaos engineering sub-topic | ~1714 |
| `Platform-Engineering-Path.json` | After "Game days" item in B06 chaos engineering items array | ~3850 |
| `website/data.js` | Same as JSON | ~3850 |

---

### GAP-08 🔴 — Cosign / image signing missing from B08 supply-chain security

**Why it matters:**  
B08 correctly covers SBOM generation (what's in your image) and Trivy scanning (known CVEs), but **image signing** (proving who built the image and that it hasn't been tampered with) is absent. In 2025/2026 DevSecOps interviews, SBOM + signing + policy-as-code is the expected answer stack for supply-chain security. Covering two-thirds of it leaves a visible gap.

**Cosign** (Sigstore project, Linux Foundation) is the standard tool — it signs container images with a cryptographic signature tied to an identity (GitHub OIDC, workload identity). Kyverno policies can then enforce "only signed images from our registry". The MidLevel INDEX B08 SBOM item (line 450-452) mentions "attestations" but never explains the tool to create them.

**What to add:**
```
- Container image signing with Cosign (Sigstore) — keyless signing via OIDC; verify signatures in CI before deploy
  📚 https://docs.sigstore.dev/cosign/overview/
- Enforce signed images with Kyverno — policy that rejects unsigned images in prod namespaces
  📚 https://kyverno.io/docs/writing-policies/verify-images/
```

**Files & insertion points:**

| File | Location | Line (approx) |
|------|----------|---------------|
| `Platform-MidLevel-INDEX.md` | After "SBOM & provenance" item in B08 container & supply-chain security sub-topic | ~452 |
| `Platform-Engineering-PATH.md` | After "SBOM & provenance" item in B08 container & supply-chain security sub-topic | ~1952 |
| `Platform-Engineering-Path.json` | After SBOM item in B08 container supply-chain items array | ~4380 |
| `website/data.js` | Same as JSON | ~4380 |

---

### GAP-09 🔴 — AWS Organizations + SCPs missing from B03 Cloud

**Why it matters:**  
B03 teaches IAM least-privilege at the account level (roles, policies, no root keys) but makes no mention of **AWS Organizations** or **Service Control Policies (SCPs)**. Any company with more than one AWS account — which is the standard security posture — uses Organizations and SCPs to enforce guardrails that IAM alone cannot (e.g., "no account in the org can disable CloudTrail", "prod accounts cannot create public S3 buckets"). Mid-level AWS interviews in enterprise contexts regularly ask about multi-account strategy.

The MidLevel INDEX B03 IAM section (line 202–209) ends with "Second cloud awareness". AWS Organizations should be added here.

**What to add:**
```
- AWS Organizations & SCPs — multi-account strategy; SCPs as guardrails that override IAM; OU hierarchy
  📚 https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html
  📚 https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html
```

**Files & insertion points:**

| File | Location | Line (approx) |
|------|----------|---------------|
| `Platform-MidLevel-INDEX.md` | After "Credentials hygiene" item in B03 IAM & security sub-topic, before "Second cloud awareness" | ~207 |
| `Platform-Engineering-PATH.md` | After "Credentials hygiene" item in B03 IAM & security sub-topic | ~1248 |
| `Platform-Engineering-Path.json` | After credentials hygiene item in B03 IAM items array | ~3150 |
| `website/data.js` | Same as JSON | ~3150 |

---

### GAP-10 🟡 — etcd backup/restore missing from B01 Kubernetes

**Why it matters:**  
etcd is the Kubernetes cluster's state store — the single source of truth for all objects. Losing etcd without a backup = losing the entire cluster. `kubeadm`-managed clusters generate etcd snapshots via `etcdctl snapshot save`. Restoring from snapshot is a CKA exam topic and appears in production incidents ("we lost the control plane — do you have an etcd backup?").

B01 covers node operations, rolling deploys, rollback — all operational skills — but the most consequential operational skill (cluster-level backup) is absent.

**What to add:**
```
- etcd backup & restore — etcdctl snapshot save/restore; backup frequency; storing snapshots safely off-cluster
  📚 https://kubernetes.io/docs/tasks/administer-cluster/configure-upgrade-etcd/#backing-up-an-etcd-cluster
```

**Files & insertion points:**

| File | Location | Line (approx) |
|------|----------|---------------|
| `Platform-MidLevel-INDEX.md` | End of B01 "Operating the cluster" sub-topic, after Helm item | ~68 |
| `Platform-Engineering-PATH.md` | End of B01 "Operating the cluster" sub-topic, after Helm item | ~764 |
| `Platform-Engineering-Path.json` | End of "Operating the cluster" items array in B01 | ~1620 |
| `website/data.js` | Same as JSON | ~1620 |

---

### GAP-11 🟡 — OTel Collector / Grafana Alloy missing from B04 Observability

**Why it matters:**  
B04 teaches OpenTelemetry SDK instrumentation (how to add tracing to your app) and Prometheus scraping (how metrics get collected). But it never mentions the **OpenTelemetry Collector** — the pipeline component that receives telemetry from apps and routes it to backends (Jaeger, Tempo, Loki, Prometheus). In production, apps send to a Collector, not directly to backends. Without this, learners build brittle observability setups that break when they change backends.

**Grafana Alloy** (successor to Grafana Agent, released 2024) is the unified Grafana-native collector. Both OTel Collector and Alloy appear in mid-level JDs and system design questions.

The B04 tracing sub-topic (MidLevel INDEX line 253–256) mentions OTel SDK but not the Collector.

**What to add:**
```
- OpenTelemetry Collector — receives traces/metrics/logs from apps, processes, and routes to backends; replaces direct SDK → backend coupling
  📚 https://opentelemetry.io/docs/collector/
- Grafana Alloy — Grafana-native unified collector (successor to Grafana Agent); pipelines for metrics, logs, traces
  📚 https://grafana.com/docs/alloy/latest/
```

**Files & insertion points:**

| File | Location | Line (approx) |
|------|----------|---------------|
| `Platform-MidLevel-INDEX.md` | After "Sampling & cost" item in B04 tracing sub-topic | ~256 |
| `Platform-Engineering-PATH.md` | After "Sampling & cost" item in B04 tracing sub-topic | ~1475 |
| `Platform-Engineering-Path.json` | After sampling item in B04 tracing items array | ~3310 |
| `website/data.js` | Same as JSON | ~3310 |

---

### GAP-12 🟡 — Ansible collections missing from B07 Automation

**Why it matters:**  
B07 teaches Ansible basics + Ansible Vault + Ansible Galaxy roles (MidLevel INDEX line 407–412). But **Ansible collections** are the modern packaging unit that replaced roles in Ansible 2.9+ (2019). Collections bundle modules, plugins, roles, and docs together and are installed via `ansible-galaxy collection install`. When you install `amazon.aws` or `kubernetes.core` today, you're installing a collection. Candidates who only know Galaxy roles will be confused reading any modern Ansible project.

**What to add:**
```
- Ansible collections — the modern packaging unit (replaces standalone roles); ansible-galaxy collection install; community.general, amazon.aws, kubernetes.core
  📚 https://docs.ansible.com/ansible/latest/collections_guide/index.html
  📚 https://galaxy.ansible.com/ (Ansible Galaxy)
```

**Files & insertion points:**

| File | Location | Line (approx) |
|------|----------|---------------|
| `Platform-MidLevel-INDEX.md` | After "Where Ansible fits vs Terraform" item in B07 config management sub-topic | ~412 |
| `Platform-Engineering-PATH.md` | After "Where Ansible fits vs Terraform" item in B07 config management sub-topic | ~1856 |
| `Platform-Engineering-Path.json` | After ansible vs terraform item in B07 config management items array | ~4170 |
| `website/data.js` | Same as JSON | ~4170 |

---

### GAP-13 🟡 — Infracost missing from B02 Terraform

**Why it matters:**  
B02 correctly teaches plan/apply discipline, lifecycle guards, and IaC quality gates (tflint, checkov). But it never addresses **cost estimation before apply**. Infracost integrates with CI to show "this Terraform plan will cost $X/month more" as a PR comment — preventing expensive misconfigurations from shipping silently. Given the strong emphasis on cost ownership in B08 (FinOps, tagging, right-sizing), the lack of Infracost in B02 is a gap between the path's stated values and its tools.

B02 IaC quality gates (MidLevel INDEX line 151–153) mentions `tflint`, `checkov`, `terrascan`, `terraform test` — Infracost belongs here as the cost-awareness gate.

**What to add:**
```
- Infracost — cost estimation for Terraform plans; CI integration shows $ impact per PR before apply
  📚 https://www.infracost.io/docs/
```

**Files & insertion points:**

| File | Location | Line (approx) |
|------|----------|---------------|
| `Platform-MidLevel-INDEX.md` | Inside B02 "IaC quality gates" item detail — or as a new item after it | ~151 |
| `Platform-Engineering-PATH.md` | After IaC quality gates item in B02 plan/apply discipline sub-topic | ~2095 |
| `Platform-Engineering-Path.json` | After IaC quality gates item in B02 plan/apply items array | ~2750 |
| `website/data.js` | Same as JSON | ~2750 |

---

### GAP-14 🟡 — Pulumi awareness missing from B02 + roadmap.sh cross-check

**Why it matters:**  
roadmap.sh's IaC section (verified in the cross-check table, MidLevel INDEX line 589) explicitly lists "Terraform + CDK + CloudFormation + **Pulumi**". The cross-check correctly notes "Terraform mandatory · CFN/CDK optional (AWS-shop dependent)" but omits Pulumi from the comment. Pulumi is the TypeScript/Python-first IaC tool — it uses real programming languages rather than HCL. Given your TypeScript background, Pulumi is particularly relevant and increasingly appears in job descriptions for platform engineers at product companies.

**What to add:**  
One awareness item in B02 Core language sub-topic, and update the cross-check table comment from "Terraform mandatory · CFN/CDK optional" to include "Pulumi optional (TypeScript/Python-native IaC — relevant for dev-heavy platform teams)".

**Files & insertion points:**

| File | Location | Line (approx) |
|------|----------|---------------|
| `Platform-MidLevel-INDEX.md` | After OpenTofu item in B02 core language sub-topic (~line 131); update cross-check table comment at line ~589 |  |
| `Platform-Engineering-PATH.md` | After OpenTofu item in B02 core language sub-topic; update cross-check table |  |
| `Platform-Engineering-Path.json` | After OpenTofu item in B02 core language items array; update crossCheck rows |  |
| `website/data.js` | Same as JSON |  |

---

### GAP-15 🟡 — DORA metrics instrumentation missing from B05 CI/CD

**Why it matters:**  
B05 teaches GitOps, canary deployments, pipeline design — the practices that improve delivery. But it never teaches how to **measure** whether your delivery is improving. DORA's Four Key Metrics (Deploy Frequency, Lead Time for Changes, Change Failure Rate, Mean Time to Restore) are the industry-standard measurement framework. They appear in interviews ("how do you know your pipeline is improving?") and in senior JDs. The PATH.md B05 module research block mentions "KPIs: deploy frequency, failed deployment %, MTTR/MTTD, change failure rate" (in A05 context) but B05 has no item for actually *instrumenting* these.

**What to add:**
```
- DORA metrics instrumentation — measure deploy frequency, lead time, change failure rate, MTTR; use CI/CD event data + Grafana/custom dashboards
  📚 https://dora.dev/ (the canonical source)
  📚 https://cloud.google.com/blog/products/devops-sre/using-the-four-keys-to-measure-your-devops-performance
```

**Files & insertion points:**

| File | Location | Line (approx) |
|------|----------|---------------|
| `Platform-MidLevel-INDEX.md` | End of B05 pipeline design sub-topic, after "GitLab CI" item | ~289 |
| `Platform-Engineering-PATH.md` | End of B05 pipeline design sub-topic, after "GitLab CI" item | ~1513 |
| `Platform-Engineering-Path.json` | After GitLab CI item in B05 pipeline design items array | ~3380 |
| `website/data.js` | Same as JSON | ~3380 |

---

### GAP-16 🔵 — `tmux` / `screen` missing from B07 Automation (Linux session resilience)

**Why it matters:**  
B07 teaches Bash, Python, Ansible — but not session resilience. When a platform engineer runs a long Ansible playbook or a database migration over SSH and their connection drops, the process dies. `tmux` (and its older cousin `screen`) keep sessions alive across disconnections. This is a daily-use skill that experienced engineers consider obvious but beginners consistently miss. It belongs in B07 as a "daily loop" tool.

**What to add:**
```
- tmux — terminal multiplexer; persist sessions across SSH disconnects; split panes for parallel monitoring during incidents
  📚 https://github.com/tmux/tmux/wiki (official)
  📚 https://www.hamvocke.com/blog/a-quick-and-easy-guide-to-tmux/ (community)
```

**Files & insertion points:**

| File | Location | Line (approx) |
|------|----------|---------------|
| `Platform-MidLevel-INDEX.md` | End of B07 scheduling & tooling sub-topic, after "Task runners" item | ~400 |
| `Platform-Engineering-PATH.md` | End of B07 scheduling & tooling sub-topic | ~1830 |
| `Platform-Engineering-Path.json` | After task runners item in B07 scheduling items array | ~4140 |
| `website/data.js` | Same as JSON | ~4140 |

---

## Summary Table

| Gap ID | Priority | Module | Topic | Status |
|--------|----------|--------|-------|--------|
| GAP-01 | ✅ FIXED | Website | Hardcoded item count in index.html | Done |
| GAP-02 | ✅ FIXED | A05 CI/CD | Jenkins + GitLab CI awareness missing | Done |
| GAP-03 | ✅ FIXED | A05 CI/CD | CI Secrets handling missing | Done |
| GAP-04 | ✅ FIXED | A06 Capstone | No test suite requirement | Done |
| GAP-05 | 🔴 HIGH | A03 Networking | `dig`, `mtr`, `tcpdump` not in skills list | Pending |
| GAP-06 | 🔴 HIGH | B01 Kubernetes | Timing claim (2 weeks) vs real depth (5+) | Pending |
| GAP-07 | 🔴 HIGH | B06 Reliability | No k8s-native chaos tool (Chaos Mesh) | Pending |
| GAP-08 | 🔴 HIGH | B08 Ownership | Image signing (Cosign/Sigstore) missing | Pending |
| GAP-09 | 🔴 HIGH | B03 Cloud (AWS) | AWS Organizations + SCPs missing | Pending |
| GAP-10 | 🟡 MEDIUM | B01 Kubernetes | etcd backup/restore missing | Pending |
| GAP-11 | 🟡 MEDIUM | B04 Observability | OTel Collector + Grafana Alloy missing | Pending |
| GAP-12 | 🟡 MEDIUM | B07 Automation | Ansible collections missing | Pending |
| GAP-13 | 🟡 MEDIUM | B02 Terraform | Infracost missing | Pending |
| GAP-14 | 🟡 MEDIUM | B02 Terraform | Pulumi awareness missing | Pending |
| GAP-15 | 🟡 MEDIUM | B05 CI/CD | DORA metrics instrumentation missing | Pending |
| GAP-16 | 🔵 LOWER | B07 Automation | `tmux`/`screen` missing | Pending |

**Total gaps: 16**  
**Fixed: 4**  
**Remaining: 12**  

---

## Files Being Modified

| File | Role | Notes |
|------|------|-------|
| `Platform-Fundamentals-INDEX.md` | Human-readable Phase A reference | Simpler format, no research blocks |
| `Platform-MidLevel-INDEX.md` | Human-readable Phase B reference | Full sub-topic + research block format |
| `Platform-Engineering-PATH.md` | Merged annotated document (both phases) | Most detailed — includes all research, depth sequences, interview focus |
| `Platform-Engineering-Path.json` | Machine source of truth → drives website | Structured JSON; every change here must be valid JSON |
| `website/data.js` | Website data file (= JSON wrapped in `window.PATH_DATA = {...}`) | Must stay in sync with JSON exactly |

**Rule:** Every gap fix touches all 4 source files + data.js. No partial updates.
