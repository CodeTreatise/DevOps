/* Certification timeline data — why/when/what/how + costs + links.
   Research 2026-08-17: AWS DevOps Pro (DOP-C02) $300/180min/75Q/3yr validity
   (aws.amazon.com); CKA performance-based ~12-week prep (Linux Foundation,
   certcrush); marketData salary uplifts. Verify prices before booking. */
window.CERTS_DATA = {
  "source": "Research 2026-08-17 — aws.amazon.com (DOP-C02: $300, 180 min, 75 Qs, 3-yr validity), Linux Foundation (CKA), certcrush 12-week CKA plan, certification.guru guides. Prices change — verify on official pages before paying.",
  "strategy": "Certs are a SHORTLIST booster, not a substitute for skills. In Tier-2 volume hiring (TCS/Infosys/Accenture/Capgemini) research shows certified candidates get shortlisted ~40% more. In Tier-1 product companies the interview is harder and certs matter less — but they still help pass the resume filter. Strategy: earn the cheap/fast ones early (Terraform Associate), take CKA after B01, AWS DevOps Pro after B03, and don't let cert prep delay your portfolio.",
  "timeline": [
    {
      "phase": "Phase A (weeks 1-10)",
      "recommendation": "No paid certs yet. Build the A06 capstone + a green GitHub Actions pipeline first. Money is better spent on the capstone project and interview reps. If you want a quick win, do the free HashiCorp Terraform Associate prep in parallel with A04/A05 reading.",
      "certs": []
    },
    {
      "phase": "After B01 — Kubernetes (weeks ~11-13)",
      "recommendation": "Take CKA now. B01 gives you the knowledge; add 1-2 weeks of killer.sh mock exams. CKA is the single most-requested cert in India DevOps job ads (K8s is the #1 premium skill in your marketData).",
      "certs": ["CKA"]
    },
    {
      "phase": "After B02 — Terraform (weeks ~13-15)",
      "recommendation": "Terraform Associate (003) is cheap (~$70), fast to pass, and Terraform is co-listed with K8s in most senior JDs. Do it right after B02 while the material is fresh.",
      "certs": ["TF_ASSOCIATE"]
    },
    {
      "phase": "After B03 — Cloud (weeks ~15-18)",
      "recommendation": "AWS Certified DevOps Engineer – Professional (DOP-C02). AWS is the dominant cloud in the Indian market. If you have no AWS history, consider AWS SAA (Associate) first — DOP-C02 assumes 2+ years of AWS ops per AWS's own recommendation. Budget 3-4 weeks of prep.",
      "certs": ["AWS_DOP", "AWS_SAA_OPTIONAL"]
    },
    {
      "phase": "B08/B09 — Security + interview (weeks ~19-22)",
      "recommendation": "Optional stretch: CKS (Certified Kubernetes Security Specialist) if you're targeting DevSecOps roles (Snyk, security-focused Tier-1). Otherwise skip certs and spend the time on mock interviews + the application tracker.",
      "certs": ["CKS_OPTIONAL"]
    }
  ],
  "certs": [
    {
      "id": "CKA",
      "name": "CKA — Certified Kubernetes Administrator",
      "org": "CNCF / Linux Foundation",
      "cost": "~$395 (bundle w/ retake often cheaper; discount codes like TUX35 available)",
      "exam": "Online proctored, performance-based: solve ~17 real K8s admin tasks in 2 hours (no multiple choice — you run kubectl). Terminal + docs allowed.",
      "validity": "3 years. Recertify by retaking the latest exam.",
      "why": "K8s is the #1 premium skill in the mid-level India market (your marketData). CKA is the most-recognized K8s cert; research says certified candidates get ~40% more shortlists in Tier-2 volume hiring and it maps directly to B01.",
      "when": "Immediately after B01 (~week 11-13 of the path). Don't start earlier — you need the B01 depth.",
      "how": [
        "Finish B01 fully (24 items, all labs).",
        "KodeKloud CKA course (or Mumshad's) — 2-3 weeks.",
        "killer.sh mock exams — do at least 2 full mocks, aim 60%+ before the real one.",
        "Practice with `kind` or a cloud cluster: deployments, rollouts, PVCs, network policies, troubleshooting CrashLoopBackOff.",
        "Book 2-4 weeks out; retake included if you buy the bundle."
      ],
      "links": [
        { "name": "Linux Foundation CKA page", "url": "https://training.linuxfoundation.org/certification/certified-kubernetes-administrator-cka/" },
        { "name": "certcrush 12-week CKA study plan", "url": "https://www.certcrush.app/blog/how-to-pass-cka-exam-2026-12-week-study-plan" },
        { "name": "killer.sh mock exams", "url": "https://killer.sh/" }
      ],
      "module": "B01"
    },
    {
      "id": "TF_ASSOCIATE",
      "name": "HashiCorp Terraform Associate (003)",
      "org": "HashiCorp",
      "cost": "~$70 (+ retake option)",
      "exam": "Online proctored, ~60 multiple-choice questions, 1 hour. Pass mark ~70%.",
      "validity": "2 years. Recertify by retaking.",
      "why": "Terraform is co-listed with Kubernetes in most senior JDs (your B02 demandNotes). Cheap, fast, high recognition in IaC-heavy roles; great resume keyword.",
      "when": "Right after B02 (weeks ~13-15), while state/modules/backends are fresh.",
      "how": [
        "Finish B02 (16 items + labs).",
        "HashiCorp Learn (free) Terraform track.",
        "1-2 practice exams (Terraform Associate sample questions).",
        "Book when you're scoring 80%+ on practice."
      ],
      "links": [
        { "name": "HashiCorp certification page", "url": "https://www.hashicorp.com/certification/terraform-associate" },
        { "name": "HashiCorp Learn free track", "url": "https://developer.hashicorp.com/terraform/tutorials/certification" }
      ],
      "module": "B02"
    },
    {
      "id": "AWS_DOP",
      "name": "AWS Certified DevOps Engineer – Professional (DOP-C02)",
      "org": "Amazon Web Services",
      "cost": "$300",
      "exam": "75 questions (MC / multiple-response), 180 minutes. Validates CI/CD, IaC, monitoring, and security automation on AWS.",
      "validity": "3 years. Recertify by passing the latest exam.",
      "why": "AWS is the dominant cloud in the Indian market (B03 demandNotes). DOP-C02 is the DevOps-specific professional cert — a strong Tier-2 shortlist booster and it forces you to connect B02 (Terraform), A05 (CI/CD) and B04 (observability) on AWS services.",
      "when": "After B03 (~weeks 15-18). AWS recommends 2+ years AWS ops experience — if you're fresh, take SAA first or defer DOP until after a few months of hands-on AWS work.",
      "how": [
        "Finish B03 (22 items + labs) with real AWS hands-on.",
        "Optional: AWS SAA (Associate) first if no AWS history (~$150, 3-hr exam).",
        "Official AWS Skill Builder course + Tutorials Dojo practice exams.",
        "Lab: build the B05 GitOps + A06 stack on AWS (CodePipeline/CodeBuild or GH Actions + EKS/ECS).",
        "Book 3-4 weeks out."
      ],
      "links": [
        { "name": "AWS DevOps Engineer Professional", "url": "https://aws.amazon.com/certification/certified-devops-engineer-professional/" },
        { "name": "certification.guru DOP-C02 guide 2026", "url": "https://www.certification.guru/certifications/aws-certified-devops-engineer-professional-certification/" },
        { "name": "Tutorials Dojo practice exams", "url": "https://tutorialsdojo.com/" }
      ],
      "module": "B03"
    },
    {
      "id": "AWS_SAA_OPTIONAL",
      "name": "AWS SAA (Associate) — optional stepping stone",
      "org": "Amazon Web Services",
      "cost": "~$150",
      "exam": "65 questions, 130 minutes, MC / multiple-response.",
      "validity": "3 years.",
      "why": "If you have zero AWS history, SAA builds the AWS foundation DOP-C02 assumes. Also a standalone resume line for cloud roles.",
      "when": "Optional — before DOP-C02 if AWS is new to you.",
      "how": [
        "B03 labs on a real free-tier AWS account.",
        "Official AWS course + Tutorials Dojo SAA practice set."
      ],
      "links": [
        { "name": "AWS SAA certification", "url": "https://aws.amazon.com/certification/certified-solutions-architect-associate/" }
      ],
      "module": "B03"
    },
    {
      "id": "CKS_OPTIONAL",
      "name": "CKS — Certified Kubernetes Security Specialist (optional)",
      "org": "CNCF / Linux Foundation",
      "cost": "~$395 (bundle w/ retake often cheaper)",
      "exam": "Performance-based, 2 hours, ~15-20 tasks. Requires passing CKA first.",
      "validity": "2 years.",
      "why": "DevSecOps is the fastest-rising premium skill (B08 demandNotes). If targeting security-focused Tier-1 companies (Snyk, cloud security roles), CKS is the differentiator.",
      "when": "Optional — only after CKA + B08, if targeting DevSecOps.",
      "how": [
        "CKA first (required prerequisite).",
        "B08 modules (secrets, scanning, RBAC, network policy).",
        "KodeKloud CKS course + killer.sh CKS mocks."
      ],
      "links": [
        { "name": "Linux Foundation CKS page", "url": "https://training.linuxfoundation.org/certification/certified-kubernetes-security-specialist/" }
      ],
      "module": "B08"
    }
  ],
  "roi": [
    "CKA after B01 — biggest ROI: most-requested cert, ~40% Tier-2 shortlist boost (per Pune 2025 research).",
    "Terraform Associate after B02 — cheap (~$70), fast, adds the IaC keyword every senior JD wants.",
    "AWS DOP-C02 after B03 — strong but requires AWS experience; defer if no AWS history.",
    "CKS only if DevSecOps is the target — security premium, but harder and niche.",
    "Never let certs delay the portfolio (A06 capstone + B05 GitOps repo) — Tier-1 interviews test the repo, not the cert."
  ]
};
