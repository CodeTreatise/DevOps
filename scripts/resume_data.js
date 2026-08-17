/* Resume template tuned for Platform/DevOps hiring in India.
   ATS-first: keywords from the JD verbatim, metrics everywhere, no images/tables/graphics.
   Sections fill in the {blanks}. Projects map to A06 capstone + B05 GitOps. */
window.RESUME_DATA = {
  "source": "ATS-tuned for DevOps/Platform roles in Pune/India hiring (2025-26). One page for 0-3 yrs, two pages max after that. PDF export, name the file FirstName-LastName-DevOps.pdf.",
  "ats": [
    "ATS parsers read TEXT: no tables, images, icons, graphs, or 2-column layouts. One column, plain bullets.",
    "Mirror the JD's keywords EXACTLY — if the JD says 'CI/CD pipelines', write 'CI/CD pipelines', not 'build automation'.",
    "Section headers must be literal: EXPERIENCE, EDUCATION, SKILLS, PROJECTS, CERTIFICATIONS.",
    "Font: Arial/Calibri 10-11pt; margins 0.5-0.75in; no header/footer text (ATS drops it).",
    "File as PDF named with your name + target role.",
    "Spell out acronyms once at first use (CloudFormation (IaC)) — ATS + humans both score it.",
    "No photos, no 'Resume' title, no color needed.",
    "Dates as 'Jan 2024 - Present' (month+year), never relative ('3 years').",
    "Score 80+ on jobscan/teal keyword checks before sending.",
    "One resume per JOB TYPE (DevOps vs Platform vs SRE have different keyword centers) — keep 3 masters."
  ],
  "template": {
    "header": {
      "note": "Name, role title, city+country, phone, email, LinkedIn, GitHub, portfolio URL — all on ONE line set.",
      "lines": [
        "{Full Name}",
        "DevOps / Platform Engineer",
        "Pune, India · +91 {phone} · {email} · linkedin.com/in/{handle} · github.com/{handle} · {portfolio}"
      ]
    },
    "summary": {
      "note": "3 lines max. Formula: who you are + stack + measurable proof + what you're looking for.",
      "example": "DevOps Engineer with 3+ years building CI/CD pipelines (GitHub Actions, Jenkins) and Kubernetes platforms (EKS, ArgoCD) for fintech-scale workloads. Cut deployment time 65% and achieved 99.9% uptime across 40+ microservices. Seeking Platform Engineer roles focused on developer experience and reliability."
    },
    "skills": {
      "note": "Grouped keyword blocks. Tailor to the JD — this is the ATS scanner's gold mine.",
      "groups": [
        "CI/CD: GitHub Actions, Jenkins, ArgoCD, GitOps, blue-green/canary",
        "Containers & K8s: Docker, Kubernetes (EKS), Helm, Kustomize, HPA, NetworkPolicy",
        "IaC: Terraform, CloudFormation, Ansible, Packer",
        "Cloud: AWS (VPC, IAM, EC2, S3, RDS, EKS), GCP/Azure basics",
        "Observability: Prometheus, Grafana, Loki, OpenTelemetry, Alertmanager",
        "Scripting: Bash, Python, Go (basics)",
        "SCM: Git, GitHub, GitLab, trunk-based workflows",
        "Security: RBAC, Secrets (Vault), image scanning (Trivy), network policy"
      ]
    },
    "projects": {
      "note": "The A06 capstone + B05 GitOps repo ARE your experience if you lack job history. Format: name + 2-3 metric bullets + tech stack line + link.",
      "examples": [
        {
          "name": "GitOps Platform — {A06 capstone}",
          "bullets": [
            "Built CI/CD for 2 services with GitHub Actions: lint → test → scan → build → staging deploy; cut release time from manual to <15 min automated.",
            "Automated canary deploys with Argo Rollouts + Prometheus analysis; bad releases auto-rollback (measured 0 failed rollouts in 30 days).",
            "Provisioned AWS infra (VPC, EKS, RDS) with Terraform modules, remote state + locking.",
            "Stack: GitHub Actions · Docker · Terraform · EKS · ArgoCD · Prometheus/Grafana"
          ]
        },
        {
          "name": "Monitoring Stack — SLO-driven alerting",
          "bullets": [
            "Deployed Prometheus + Grafana + Alertmanager on EKS; RED dashboards per service, USE per host.",
            "Defined 99.5% SLO with burn-rate alerts; alert volume down 70% while catch-rate up.",
            "Stack: Prometheus · Grafana · Loki · OpenTelemetry · Alertmanager"
          ]
        },
        {
          "name": "Incident Response Playbook — {B06 drill}",
          "bullets": [
            "Ran weekly chaos drills (pod-kill, network latency); documented 5 runbooks for top incidents.",
            "Cut MTTR 40% by pre-writing triage commands and rollback checklists.",
            "Stack: Litmus/ChaosMesh · runbooks · blameless postmortems"
          ]
        }
      ]
    },
    "experience": {
      "note": "Even non-DevOps jobs count if you quantify ops work. Formula per bullet: VERB + WHAT + TOOL + METRIC.",
      "bullet_verbs": [
        "Automated", "Reduced", "Cut", "Achieved", "Migrated", "Orchestrated", "Streamlined", "Improved", "Eliminated", "Scaled", "Shortened", "Hardened"
      ],
      "metric_examples": [
        "Cut deployment time from 2 hrs to 20 min (83%)",
        "Reduced infra cost 30% via right-sizing + autoscaling",
        "Achieved 99.9% uptime across 40+ microservices",
        "Reduced alert noise 70% with SLO burn-rate alerting",
        "Cut MTTR 40% with runbooks + drills",
        "Scaled from 5 to 50 services with no new SRE headcount"
      ],
      "if_no_job_history": "If you have no formal DevOps job yet: put PROJECTS above EXPERIENCE, and under EXPERIENCE list internships/college work with ops elements (server admin, CI for a class project, script automation). Recruiters hire the repo + the skills, not the title."
    },
    "education_certs": {
      "note": "Education: Degree + college + year + CGPA (if > 7). Certs: CKA, Terraform Associate, AWS DOP — with dates. Keep to 3-4 lines total.",
      "lines": [
        "Certifications: CKA (Certified Kubernetes Administrator, {month year}) · HashiCorp Terraform Associate (003) · AWS Certified DevOps Engineer – Professional (in progress)",
        "Education: B.E./B.Tech {Branch}, {College}, {year} — CGPA {x}/10"
      ]
    }
  },
  "jds": {
    "note": "Keyword centers per job type — build 3 master resumes around these centers.",
    "centers": {
      "DevOps": ["CI/CD", "Jenkins", "Docker", "Kubernetes", "Terraform", "AWS", "Linux", "Git", "Monitoring", "Scripting"],
      "Platform": ["Kubernetes", "ArgoCD", "Developer Experience", "Golden Path", "Internal Developer Platform", "Service Mesh", "Helm", "Multi-tenant", "Self-service"],
      "SRE": ["SLO", "Error Budget", "Incident Response", "On-call", "Chaos Engineering", "Capacity Planning", "MTTR", "Runbooks", "Reliability"]
    }
  },
  "checklist": [
    "One page (0-3 yrs) — trim summary + skills to fit",
    "Every bullet has a NUMBER (%, min, uptime, count)",
    "JD keywords appear in SKILLS + first bullets of each section",
    "No tables/images/icons/graphics",
    "PDF export, file named FirstName-LastName-DevOps.pdf",
    "Score 80+ on an ATS keyword checker (jobscan/teal) for the target JD",
    "LinkedIn matches resume: same title, same keywords, same dates",
    "Links work: GitHub repo public + README with badge + portfolio live"
  ]
};
