# 📄 Resume Kit — Platform/DevOps Tuned (India)

> Companion doc to the site's **Resume Kit** appendix. ATS-first template with fill-in blanks.

## ATS rules (non-negotiable)

1. ATS parsers read **TEXT**: no tables, images, icons, graphs, or 2-column layouts. One column, plain bullets.
2. Mirror the JD's keywords **EXACTLY** — JD says "CI/CD pipelines", you write "CI/CD pipelines", not "build automation".
3. Section headers must be literal: `EXPERIENCE`, `EDUCATION`, `SKILLS`, `PROJECTS`, `CERTIFICATIONS`.
4. Font Arial/Calibri 10-11pt; margins 0.5-0.75in; no header/footer text.
5. PDF named `FirstName-LastName-DevOps.pdf`.
6. Spell out acronyms once (e.g., "CloudFormation (IaC)").
7. No photos, no "Resume" title.
8. Dates as `Jan 2024 - Present` (never relative).
9. Score 80+ on jobscan/teal before sending.
10. **One resume per job type** (DevOps vs Platform vs SRE have different keyword centers).

## The template

### Header (one line-set)
```text
{Full Name}
DevOps / Platform Engineer
Pune, India · +91 {phone} · {email} · linkedin.com/in/{handle} · github.com/{handle} · {portfolio}
```

### Summary (3 lines max)
Formula: **who you are + stack + measurable proof + what you're looking for**.

> DevOps Engineer with 3+ years building CI/CD pipelines (GitHub Actions, Jenkins) and Kubernetes platforms (EKS, ArgoCD) for fintech-scale workloads. Cut deployment time 65% and achieved 99.9% uptime across 40+ microservices. Seeking Platform Engineer roles focused on developer experience and reliability.

### Skills (grouped keyword blocks — ATS gold mine)
- **CI/CD**: GitHub Actions, Jenkins, ArgoCD, GitOps, blue-green/canary
- **Containers & K8s**: Docker, Kubernetes (EKS), Helm, Kustomize, HPA, NetworkPolicy
- **IaC**: Terraform, CloudFormation, Ansible, Packer
- **Cloud**: AWS (VPC, IAM, EC2, S3, RDS, EKS), GCP/Azure basics
- **Observability**: Prometheus, Grafana, Loki, OpenTelemetry, Alertmanager
- **Scripting**: Bash, Python, Go (basics)
- **SCM**: Git, GitHub, GitLab, trunk-based workflows
- **Security**: RBAC, Secrets (Vault), image scanning (Trivy), network policy

### Projects (your A06 capstone + B05 GitOps ARE experience if you lack job history)

**GitOps Platform — {A06 capstone}**
- Built CI/CD for 2 services with GitHub Actions: lint → test → scan → build → staging deploy; cut release time from manual to <15 min automated.
- Automated canary deploys with Argo Rollouts + Prometheus analysis; bad releases auto-rollback (0 failed rollouts in 30 days).
- Provisioned AWS infra (VPC, EKS, RDS) with Terraform modules, remote state + locking.
- Stack: GitHub Actions · Docker · Terraform · EKS · ArgoCD · Prometheus/Grafana

**Monitoring Stack — SLO-driven alerting**
- Deployed Prometheus + Grafana + Alertmanager on EKS; RED dashboards per service, USE per host.
- Defined 99.5% SLO with burn-rate alerts; alert volume down 70% while catch-rate up.

**Incident Response Playbook — {B06 drill}**
- Ran weekly chaos drills (pod-kill, network latency); documented 5 runbooks for top incidents.
- Cut MTTR 40% with pre-written triage commands + rollback checklists.

### Experience
Per bullet formula: **VERB + WHAT + TOOL + METRIC**.
- Verbs: Automated, Reduced, Cut, Achieved, Migrated, Orchestrated, Streamlined, Improved, Eliminated, Scaled, Shortened, Hardened
- Metrics that land: "Cut deployment time from 2 hrs to 20 min (83%)" · "Reduced infra cost 30%" · "Achieved 99.9% uptime across 40+ microservices" · "Reduced alert noise 70% with SLO burn-rate alerting" · "Cut MTTR 40%" · "Scaled from 5 to 50 services with no new SRE headcount"

> No formal DevOps job yet? Put PROJECTS above EXPERIENCE; list internships/college work with ops elements (server admin, CI for a class project, script automation). Recruiters hire the repo + the skills, not the title.

### Education & Certifications
```text
Certifications: CKA (Certified Kubernetes Administrator, {month year}) · HashiCorp Terraform Associate (003) · AWS Certified DevOps Engineer – Professional (in progress)
Education: B.E./B.Tech {Branch}, {College}, {year} — CGPA {x}/10
```

## Keyword centers per job type (build 3 masters)

| Type | Keywords |
|---|---|
| **DevOps** | CI/CD, Jenkins, Docker, Kubernetes, Terraform, AWS, Linux, Git, Monitoring, Scripting |
| **Platform** | Kubernetes, ArgoCD, Developer Experience, Golden Path, Internal Developer Platform, Service Mesh, Helm, Multi-tenant, Self-service |
| **SRE** | SLO, Error Budget, Incident Response, On-call, Chaos Engineering, Capacity Planning, MTTR, Runbooks, Reliability |

## Pre-send checklist

- [ ] One page (0-3 yrs) — trim summary + skills to fit
- [ ] Every bullet has a NUMBER (%, min, uptime, count)
- [ ] JD keywords appear in SKILLS + first bullets of each section
- [ ] No tables/images/icons/graphics
- [ ] PDF export, file named FirstName-LastName-DevOps.pdf
- [ ] Score 80+ on an ATS keyword checker (jobscan/teal) for the target JD
- [ ] LinkedIn matches resume: same title, same keywords, same dates
- [ ] Links work: GitHub repo public + README with badge + portfolio live
