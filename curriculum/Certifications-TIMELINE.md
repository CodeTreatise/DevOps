# 🎓 Certification Timeline — Why, When, What, How

> Companion doc to the site's **Certifications** appendix. Prices checked 2026-08-17 — verify on official pages before paying.

## The one-line strategy

Certs are a **shortlist booster**, not a substitute for skills. Take them in this order, and never let prep delay your portfolio (A06 capstone + B05 GitOps repo — Tier-1 interviews test the repo, not the cert).

## The timeline (mapped to your path)

| When | Cert | Cost | Why now |
|---|---|---|---|
| Weeks 1-10 (Phase A) | — (none) | — | Build the A06 capstone + green pipeline first; money → portfolio |
| After **B01** (~wk 11-13) | **CKA** | ~$395 | K8s is the #1 premium skill; biggest ROI cert |
| After **B02** (~wk 13-15) | **Terraform Associate** | ~$70 | Cheap + fast; Terraform co-listed with K8s in most senior JDs |
| After **B03** (~wk 15-18) | **AWS DOP-C02** | $300 | AWS is dominant in India; connects B02+A05+B04 on AWS |
| Weeks 19-22 (B08/B09) | **CKS** (optional) | ~$395 | Only if targeting DevSecOps |

## Why each one (the research)

### CKA — Certified Kubernetes Administrator
- **What**: CNCF/Linux Foundation. Performance-based: ~17 real K8s admin tasks in 2 hours, online proctored, terminal + docs allowed. No multiple choice — you actually run `kubectl`.
- **Validity**: 3 years (retake to recertify).
- **Why**: Kubernetes is the #1 premium skill in the mid-level India market (your marketData). Research shows certified candidates get ~40% more shortlists in Tier-2 volume hiring (TCS/Infosys/Accenture/Capgemini), and it maps directly to B01.
- **How** (after finishing B01 fully):
  1. KodeKloud CKA course (Mumshad's) — 2-3 weeks.
  2. killer.sh mock exams — at least 2 full mocks, aim 60%+.
  3. Practice on `kind`: deployments, rollouts, PVCs, network policies, CrashLoopBackOff debugging.
  4. Buy the bundle w/ retake; book 2-4 weeks out.
- **Links**: [Linux Foundation CKA](https://training.linuxfoundation.org/certification/certified-kubernetes-administrator-cka/) · [certcrush 12-week plan](https://www.certcrush.app/blog/how-to-pass-cka-exam-2026-12-week-study-plan) · [killer.sh](https://killer.sh/)

### Terraform Associate (003)
- **What**: HashiCorp. ~60 MCQ, 1 hour, online proctored, pass ~70%.
- **Validity**: 2 years.
- **Why**: cheap, fast, high recognition in IaC-heavy roles; adds the "Terraform" keyword every senior JD wants.
- **How**: finish B02 → free [HashiCorp Learn Terraform track](https://developer.hashicorp.com/terraform/tutorials/certification) → 1-2 practice exams → book at 80%+.
- **Links**: [HashiCorp certification page](https://www.hashicorp.com/certification/terraform-associate)

### AWS Certified DevOps Engineer – Professional (DOP-C02)
- **What**: AWS. **75 questions** (MC / multiple-response), **180 minutes**, **$300**, **valid 3 years**. Validates CI/CD, IaC, monitoring, and security automation on AWS.
- **Prereq thinking**: AWS recommends **2+ years hands-on AWS experience**. If you have zero AWS history, take **AWS SAA (Associate, ~$150)** first — DOP-C02 assumes the foundation.
- **Why**: AWS is the dominant cloud in India; DOP is the DevOps-specific professional cert and a strong Tier-2 shortlist booster.
- **How**: finish B03 with real AWS hands-on → optional SAA → [official AWS Skill Builder course](https://aws.amazon.com/certification/certified-devops-engineer-professional/) + Tutorials Dojo practice exams → build the B05 GitOps stack on AWS → book 3-4 weeks out.
- **Links**: [AWS DOP-C02](https://aws.amazon.com/certification/certified-devops-engineer-professional/) · [certification.guru 2026 guide](https://www.certification.guru/certifications/aws-certified-devops-engineer-professional-certification/) · [Tutorials Dojo](https://tutorialsdojo.com/)

### CKS (optional, DevSecOps only)
- Requires **CKA first**. Performance-based, 2 hrs. Only take if targeting security-focused companies (Snyk, cloud security roles). → [Linux Foundation CKS](https://training.linuxfoundation.org/certification/certified-kubernetes-security-specialist/)

## ROI order (if you only do two)

1. **CKA** after B01 — most-requested cert, ~40% Tier-2 shortlist boost.
2. **Terraform Associate** after B02 — cheap, fast, keyword win.
3. AWS DOP-C02 after B03 — strong, but needs AWS experience.
4. CKS — only if DevSecOps is the target.

## Golden rule

Cert ≠ job. The **A06 capstone + B05 GitOps repo + interview reps** are what convert. Cert prep sits ON TOP of the path, never instead of it.
