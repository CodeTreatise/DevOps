/* Company-specific question sets — curated "most-asked" questions per hiring tier,
   each linked to where the full answer lives (answer-bank files).
   Tier 1 = platform-native product cos (deep, system-design + hands-on).
   Tier 2 = volume hirers (standard theory, cert-friendly, behavioral).
   Tier 3 = global remote (English clarity, distributed-systems, take-homes). */
window.COMPANY_QS_DATA = {
  "source": "Curated from the 426-question answer bank (Platform-Answer-Bank.md + Platform-Answer-Bank-B.md) mapped to company hiring patterns researched 2026-08-17.",
  "howToUse": [
    "Before applying to a company: open its tier below, drill those questions from the answer banks.",
    "Every question has its full answer in the banks — don't memorize, re-explain in your own words.",
    "Tier 1 expects you to DRAW: have paper/pencil ready for architecture questions.",
    "Tier 2 expects SPEED: crisp 2-min answers, then they move to the next topic.",
    "Tier 3 expects CLARITY: remote interviews = explain like the person can't see your screen."
  ],
  "tiers": [
    {
      "id": "tier1",
      "name": "Tier 1 — Platform-Native (Razorpay, Postman, BrowserStack, PhonePe, CRED, Swiggy, Zoho, Freshworks, ThoughtSpot, Atlassian, GitLab, DigitalOcean)",
      "pattern": "2-3 rounds: (1) core DevOps theory + hands-on, (2) system design (infra), (3) cultural/STAR + take-home or live debugging. Expect deep K8s + Linux + a design question from SD01-SD08.",
      "questions": [
        { "q": "How does Kubernetes schedule a pod? Walk through the scheduler + kubelet flow.", "where": "B01 'Workloads & objects' + 'Scheduling & resources'" },
        { "q": "A pod is CrashLoopBackOff — how do you debug it, top-down?", "where": "B01 'Debugging & failure modes'" },
        { "q": "Design a CI/CD pipeline for 50 microservices with zero-downtime deploys.", "where": "System Design SD01 + SD03 (site view) + B05 'Pipeline design'" },
        { "q": "Explain blue-green vs canary vs rolling — when do you pick each?", "where": "B05 'Progressive delivery'" },
        { "q": "How does Terraform state work? What happens on a state lock or drift?", "where": "B02 'State management'" },
        { "q": "Your monitoring shows 5xx spikes every 10 minutes — walk me through the investigation.", "where": "B04 'SLOs & alerting' + A03 'Debug flow to internalize'" },
        { "q": "How do you handle secrets in CI/CD without leaking them?", "where": "B08 secrets + System Design SD04" },
        { "q": "What's your on-call experience? Describe a real incident from detection to postmortem.", "where": "B06 + B08 on-call + STAR story from B06 drill" },
        { "q": "Linux: a service won't start — show your debug path with commands.", "where": "A01 'Core skills' + journalctl/ss/ps flow" },
        { "q": "Git: how do you recover a deleted branch or a bad merge?", "where": "A02 reflog + cherry-pick sections" }
      ]
    },
    {
      "id": "tier2",
      "name": "Tier 2 — Volume Hirers (TCS, Infosys, Accenture, Capgemini, IBM, HCLTech, Wipro, Cognizant, Amdocs, ZS Associates)",
      "pattern": "Often: online assessment (MCQ on Linux/Docker/K8s/networking) → 1-2 technical rounds → HR. Certifications (CKA/Terraform) are a big shortlist booster here. Answers should be crisp and by-the-book.",
      "questions": [
        { "q": "What is the difference between Docker and Kubernetes?", "where": "A04 + B01 'Workloads & objects'" },
        { "q": "Explain the Linux boot process and common systemd commands.", "where": "A01 'Core skills'" },
        { "q": "Difference between TCP and UDP — give a real example for each.", "where": "A03 'Ports, HTTP & diagnosis'" },
        { "q": "What is a Dockerfile multi-stage build and why use it?", "where": "A04 'Core skills: run, build, stack'" },
        { "q": "Explain the components of a Kubernetes cluster (control plane vs nodes).", "where": "B01 'Workloads & objects'" },
        { "q": "What is Terraform and what problem does it solve?", "where": "B02 'Core language'" },
        { "q": "What is CI vs CD? Give a real pipeline example.", "where": "A05 'Core skills: triggers, jobs, gates'" },
        { "q": "What commands would you run to check disk usage and kill a hung process?", "where": "A01 df/ps/kill flow" },
        { "q": "How does DNS work? Walk through a URL request.", "where": "A03 'DNS' sections" },
        { "q": "Tell me about a project where you automated something — what and how?", "where": "A06 capstone story + STAR" }
      ]
    },
    {
      "id": "tier3",
      "name": "Tier 3 — Global Remote (Zapier, Datadog, Grafana Labs, HashiCorp, MongoDB, Elastic, Cloudflare, Snyk, Docker, Paytm)",
      "pattern": "High English bar, async take-homes, live-coding for scripts, product-focused design. Expect deep observability (Datadog/Grafana), IaC (HashiCorp), and 'how would you design X' with the 6-step framework.",
      "questions": [
        { "q": "Design a metrics + alerting system for a globally distributed product.", "where": "System Design SD02 + B04" },
        { "q": "Explain SLOs and error budgets like I'm a product manager.", "where": "B04 'SLOs & alerting' — practice the PM explanation" },
        { "q": "How would you design a multi-region deployment with DR?", "where": "System Design SD05 + B03 networking" },
        { "q": "Write a bash/python script that retries an API call with backoff — live.", "where": "B07 'Scripting' + A01 practice" },
        { "q": "What's the difference between a self-hosted and managed CI runner, cost-wise?", "where": "A05 'On the radar: Jenkins & GitLab CI'" },
        { "q": "How do you secure a Kubernetes cluster? RBAC, network policies, secrets.", "where": "B08 + B01 'Security & RBAC'" },
        { "q": "Explain how ArgoCD does GitOps sync and drift correction.", "where": "B05 'GitOps'" },
        { "q": "A customer reports slowness — walk me through your full diagnosis.", "where": "B04 traces/logs correlation + A03 debug flow" },
        { "q": "What have you built recently? Walk me through your capstone architecture.", "where": "A06 capstone — rehearse the 5-min tour" },
        { "q": "Design a secrets management system for 100 engineers.", "where": "System Design SD04" }
      ]
    }
  ]
};
