/* Researched companies list for Platform Engineering / DevOps / SRE applications.
   Source: web research 2026-08-17 (devopstraininginstitute Pune 2025 report, GUVI
   product-company roundup, remote-India hiring guides). Careers URLs are company
   portals; openings change constantly — verify before applying. */
window.COMPANIES_DATA = {
  "source": "Deep-research compilation · 2026-08-17 · devopstraininginstitute Pune 2025 report + GUVI India product-company roundup + remote-India hiring guides (GitLab/Zapier/Atlassian/Razorpay/CRED etc.)",
  "note": "Job boards (LinkedIn/Naukri/Indeed) block automated scraping; this list was compiled from the sources above plus company career portals. Openings change fast — always open the careers link before applying, and filter by 'Platform Engineer / DevOps / SRE / Cloud Engineer / Site Reliability'.",
  "tiers": {
    "target": "Tier 1 — Best match for this path (platform-native, SRE teams, modern stacks). Apply first.",
    "volume": "Tier 2 — High-volume hirers (entry-friendly, structured interviews, cert-friendly). Apply for first offer + practice interviews.",
    "stretch": "Tier 3 — Stretch (premium pay, tougher bar, often remote-first global). Apply after portfolio + 2-3 mock interviews."
  },
  "categories": [
    {
      "id": "platform-native",
      "name": "Platform-Native & Product Companies (Tier 1)",
      "tier": "target",
      "strategy": "These companies have real platform/SRE orgs, use the exact stack in this curriculum (K8s, Terraform, ArgoCD, Prometheus, Go/Python), and pay the best. They expect STAR stories + a live demo (use your A06 capstone + B05 GitOps repo). Most are remote-friendly or have Pune/India offices.",
      "companies": [
        {
          "name": "Razorpay",
          "location": "Bangalore HQ · remote-friendly India",
          "roles": ["Platform Engineer", "DevOps Engineer", "SRE"],
          "stack": "K8s, Terraform, ArgoCD, Kafka, Go",
          "modules": ["B01", "B02", "B05", "B04"],
          "careers": "https://razorpay.com/jobs/",
          "note": "Fintech scale = incident rigor + on-call maturity. Tests K8s + Linux deeply."
        },
        {
          "name": "Postman",
          "location": "Bangalore · remote-friendly",
          "roles": ["DevOps Engineer", "Platform Engineer", "Site Reliability Engineer"],
          "stack": "AWS, K8s, Terraform, GitHub Actions, Prometheus",
          "modules": ["B03", "B01", "B02", "A05"],
          "careers": "https://www.postman.com/company/careers/",
          "note": "API-platform company; heavy CI/CD + developer-experience focus."
        },
        {
          "name": "BrowserStack",
          "location": "Mumbai · remote-friendly India",
          "roles": ["DevOps Engineer", "SRE", "Cloud Engineer"],
          "stack": "AWS, K8s, Terraform, Jenkins, Ansible",
          "modules": ["B01", "B02", "B03", "B07"],
          "careers": "https://www.browserstack.com/careers",
          "note": "Distributed infra at scale — great for SRE story-building."
        },
        {
          "name": "PhonePe",
          "location": "Bangalore · Pune presence",
          "roles": ["DevOps Engineer", "SRE", "Platform Engineer"],
          "stack": "K8s, AWS, Terraform, Jenkins, Prometheus",
          "modules": ["B01", "B03", "B05", "B04"],
          "careers": "https://www.phonepe.com/careers/",
          "note": "UPI-scale reliability; strong on-call + chaos culture."
        },
        {
          "name": "CRED",
          "location": "Bangalore · remote-friendly",
          "roles": ["DevOps Engineer", "Platform Engineer"],
          "stack": "AWS, K8s, Terraform, ArgoCD, Grafana",
          "modules": ["B01", "B02", "B05", "B04"],
          "careers": "https://cred.club/careers",
          "note": "Startup pay + equity; expects ownership stories."
        },
        {
          "name": "Swiggy",
          "location": "Bangalore · Pune tech presence",
          "roles": ["DevOps Engineer", "SRE", "Platform Engineer"],
          "stack": "K8s, AWS, Terraform, Kafka, Prometheus",
          "modules": ["B01", "B03", "B04", "B05"],
          "careers": "https://careers.swiggy.com",
          "note": "Microservices at massive scale; resilience + performance focus."
        },
        {
          "name": "Zoho",
          "location": "Chennai · remote-friendly",
          "roles": ["DevOps Engineer", "Site Reliability Engineer"],
          "stack": "Private cloud, K8s, Terraform, Linux-first",
          "modules": ["A01", "B01", "B02", "B03"],
          "careers": "https://www.zoho.com/careers/",
          "note": "Owns its own infra/datacenters — deep Linux + networking value."
        },
        {
          "name": "Freshworks",
          "location": "Chennai · remote-friendly",
          "roles": ["DevOps Engineer", "SRE", "Platform Engineer"],
          "stack": "AWS, K8s, Terraform, GitHub Actions, Datadog",
          "modules": ["B03", "B01", "B02", "B04"],
          "careers": "https://www.freshworks.com/company/careers/",
          "note": "SaaS product org with mature platform teams."
        },
        {
          "name": "ThoughtSpot",
          "location": "Bangalore · Pune roles · remote-friendly",
          "roles": ["DevOps Engineer", "SRE"],
          "stack": "AWS, K8s, Terraform, Airflow, observability",
          "modules": ["B03", "B01", "B02", "B04"],
          "careers": "https://www.thoughtspot.com/company/careers",
          "note": "AIOps angle (per research) — data-platform reliability."
        },
        {
          "name": "Atlassian",
          "location": "Bangalore · remote-first",
          "roles": ["Site Reliability Engineer", "DevOps Engineer", "Platform Engineer"],
          "stack": "AWS, K8s, Terraform, Bitbucket Pipelines, Datadog",
          "modules": ["B01", "B02", "B03", "B04"],
          "careers": "https://www.atlassian.com/company/careers",
          "note": "Global remote SRE teams; strong documentation culture."
        },
        {
          "name": "GitLab",
          "location": "Fully remote (hires in India)",
          "roles": ["Site Reliability Engineer", "DevOps Engineer", "Backend/Infra"],
          "stack": "GCP/AWS, K8s, Terraform, GitLab CI, Prometheus",
          "modules": ["A05", "B01", "B02", "B04"],
          "careers": "https://about.gitlab.com/jobs/",
          "note": "All-remote pioneer; hires Indian SREs for global rotations."
        },
        {
          "name": "DigitalOcean",
          "location": "Remote (India-eligible)",
          "roles": ["DevOps Engineer", "SRE", "Platform Engineer"],
          "stack": "K8s, Terraform, Go, Prometheus, Vault",
          "modules": ["B01", "B02", "B07", "B04"],
          "careers": "https://www.digitalocean.com/careers",
          "note": "Cloud-native company; documented DevOps culture (DO Community)."
        }
      ]
    },
    {
      "id": "high-volume",
      "name": "High-Volume Hirers & MNC GCCs (Tier 2)",
      "tier": "volume",
      "strategy": "TCS/Infosys/Accenture/Capgemini/IBM lead Pune DevOps volume hiring (per the Pune 2025 research: 2,500-5,000+ roles each, ₹7-17 LPA). Structured 3-4 round process, Jenkins-heavy, certification-friendly (CKA/AWS boost shortlist ~40%). Best for: first offer, interview reps, and stability. Career portals are the official channel.",
      "companies": [
        {
          "name": "TCS",
          "location": "Pune (Hinjewadi, Magarpatta) · PAN India",
          "roles": ["DevOps Engineer", "Cloud Engineer", "CI/CD Engineer"],
          "stack": "Jenkins, AWS, K8s, Terraform",
          "modules": ["A01", "A05", "B01", "B02", "B03"],
          "careers": "https://www.tcs.com/careers",
          "note": "Largest volume hirer in Pune (research: 5,000+ roles, ₹7-14 LPA)."
        },
        {
          "name": "Infosys",
          "location": "Pune · PAN India",
          "roles": ["DevOps Engineer", "SRE", "Cloud Engineer"],
          "stack": "K8s, AWS/Azure, Jenkins, Ansible",
          "modules": ["B01", "B03", "A05", "B07"],
          "careers": "https://www.infosys.com/careers",
          "note": "Research: 4,000 openings, ₹8-15 LPA, DevSecOps emphasis."
        },
        {
          "name": "Accenture",
          "location": "Pune · PAN India",
          "roles": ["DevOps Engineer", "Azure DevOps Specialist", "Cloud Engineer"],
          "stack": "Azure, Jenkins, Terraform, K8s",
          "modules": ["B03", "A05", "B02", "B01"],
          "careers": "https://www.accenture.com/in-en/careers",
          "note": "Research: 3,500 hires, ₹9-16 LPA, Azure-leaning."
        },
        {
          "name": "Capgemini",
          "location": "Pune · PAN India",
          "roles": ["DevOps Engineer", "Cloud Engineer", "SRE"],
          "stack": "Multi-cloud, Terraform, K8s, Jenkins",
          "modules": ["B02", "B01", "B03", "A05"],
          "careers": "https://www.capgemini.com/careers/",
          "note": "Research: 3,000 roles, ₹10-17 LPA, Terraform + multi-cloud."
        },
        {
          "name": "IBM",
          "location": "Pune · PAN India",
          "roles": ["DevOps Engineer", "SRE", "AIOps Engineer"],
          "stack": "Red Hat OpenShift, K8s, Terraform, Instana",
          "modules": ["B01", "B02", "B04", "B03"],
          "careers": "https://www.ibm.com/careers",
          "note": "Research: 2,500 jobs, ₹8-15 LPA, OpenShift + AIOps angle."
        },
        {
          "name": "HCLTech",
          "location": "Pune · PAN India",
          "roles": ["DevOps Engineer", "Cloud Engineer"],
          "stack": "Hybrid cloud, Jenkins, K8s, Ansible",
          "modules": ["A05", "B01", "B07", "B03"],
          "careers": "https://www.hcltech.com/careers",
          "note": "Research: ~2,000 roles; hybrid-cloud fintech projects."
        },
        {
          "name": "Wipro",
          "location": "Pune · PAN India",
          "roles": ["DevOps Engineer", "Cloud Engineer", "SRE"],
          "stack": "Azure/AWS, Jenkins, Terraform, K8s",
          "modules": ["B03", "A05", "B02", "B01"],
          "careers": "https://careers.wipro.com",
          "note": "Research: ~2,000 roles; full-stack cloud practices."
        },
        {
          "name": "Cognizant",
          "location": "Pune · PAN India",
          "roles": ["DevOps Engineer", "SRE", "Cloud Engineer"],
          "stack": "AWS, Jenkins, K8s, Terraform",
          "modules": ["A05", "B01", "B02", "B03"],
          "careers": "https://careers.cognizant.com",
          "note": "Research: SRE roles in innovation labs; equity on some programs."
        },
        {
          "name": "Amdocs",
          "location": "Pune",
          "roles": ["DevOps Engineer", "Kubernetes Specialist", "Release Engineer"],
          "stack": "Telecom cloud, K8s, OpenStack, Jenkins",
          "modules": ["B01", "A05", "B03"],
          "careers": "https://www.amdocs.com/careers",
          "note": "Research: 800 openings, telecom-grade K8s, ₹9-16 LPA."
        },
        {
          "name": "ZS Associates",
          "location": "Pune",
          "roles": ["DevOps Engineer", "Data Platform Engineer", "SRE"],
          "stack": "AWS, K8s, Terraform, Airflow, Snowflake",
          "modules": ["B03", "B01", "B02", "B04"],
          "careers": "https://www.zs.com/careers",
          "note": "Research: 1,000+ hires, ₹10-18 LPA, analytics-driven DevOps."
        }
      ]
    },
    {
      "id": "global-remote",
      "name": "Global & Remote-First (Tier 3 — Stretch)",
      "tier": "stretch",
      "strategy": "Global platform/SRE employers with India hiring (per remote-India research: GitLab, Zapier, Atlassian, Razorpay, CRED actively hire remote Indian engineers). Pay is 1.5-3x Indian MNC bands but the bar is higher: expect system-design + coding + deep K8s debugging. Apply after you have a strong portfolio (A06 + B05 repos) and interview reps.",
      "companies": [
        {
          "name": "Zapier",
          "location": "Fully remote (hires in India)",
          "roles": ["Site Reliability Engineer", "DevOps Engineer", "Platform Engineer"],
          "stack": "AWS, K8s, Terraform, Python, Datadog",
          "modules": ["B01", "B02", "B03", "B07"],
          "careers": "https://zapier.com/jobs",
          "note": "Fully-remote pioneer; India-friendly hiring; async-culture interviews."
        },
        {
          "name": "Datadog",
          "location": "Remote · India presence",
          "roles": ["SRE", "DevOps Engineer", "Cloud Engineer"],
          "stack": "AWS/GCP, K8s, Terraform, Go, observability (own product)",
          "modules": ["B04", "B01", "B02", "B03"],
          "careers": "https://www.datadoghq.com/careers/",
          "note": "Observability company — B04 depth is your edge."
        },
        {
          "name": "Grafana Labs",
          "location": "Remote (India-eligible)",
          "roles": ["SRE", "DevOps Engineer", "Backend Engineer"],
          "stack": "K8s, Terraform, Prometheus/Grafana (own product), Go",
          "modules": ["B04", "B01", "B02", "B07"],
          "careers": "https://grafana.com/careers/",
          "note": "Open-source SRE tooling company — B04 + B05 demos shine here."
        },
        {
          "name": "HashiCorp",
          "location": "Remote (India-eligible)",
          "roles": ["Solutions Engineer", "Platform Engineer", "SRE"],
          "stack": "Terraform, Vault, Consul, Nomad, HCP",
          "modules": ["B02", "B08", "B01"],
          "careers": "https://www.hashicorp.com/careers",
          "note": "IaC/Vault home turf — B02 + B08 (secrets) are core."
        },
        {
          "name": "MongoDB",
          "location": "Bangalore · remote-friendly",
          "roles": ["SRE", "Cloud Engineer", "DevOps Engineer"],
          "stack": "AWS, K8s, Terraform, Go, MongoDB Atlas",
          "modules": ["B01", "B02", "B03", "B04"],
          "careers": "https://www.mongodb.com/careers",
          "note": "Database platform at scale; strong SRE org in Bangalore."
        },
        {
          "name": "Elastic",
          "location": "Remote (India-eligible)",
          "roles": ["SRE", "DevOps Engineer", "Cloud Engineer"],
          "stack": "AWS/GCP, K8s, Terraform, Elasticsearch, Beats",
          "modules": ["B01", "B02", "B04", "B03"],
          "careers": "https://www.elastic.co/careers",
          "note": "Search/observability product company; distributed infra."
        },
        {
          "name": "Cloudflare",
          "location": "Remote · India presence",
          "roles": ["SRE", "DevOps Engineer", "Network Engineer"],
          "stack": "K8s, Terraform, Rust/Go, edge networking",
          "modules": ["B01", "B02", "B03", "A03"],
          "careers": "https://www.cloudflare.com/careers/",
          "note": "Edge + networking at planetary scale — A03 is relevant here."
        },
        {
          "name": "Snyk",
          "location": "Remote (India-eligible)",
          "roles": ["DevOps Engineer", "SRE", "Platform Engineer"],
          "stack": "AWS, K8s, Terraform, GitHub Actions, security tooling",
          "modules": ["B01", "B02", "B08", "A05"],
          "careers": "https://snyk.io/careers/",
          "note": "DevSecOps product company — B08 security modules are your edge."
        },
        {
          "name": "Docker",
          "location": "Remote (India-eligible)",
          "roles": ["SRE", "DevOps Engineer", "Cloud Engineer"],
          "stack": "AWS/GCP, K8s, Terraform, Go, own products",
          "modules": ["A04", "B01", "B02", "B03"],
          "careers": "https://www.docker.com/careers/",
          "note": "Container platform company — A04 + B01 depth is core."
        },
        {
          "name": "Paytm",
          "location": "Noida/Bangalore · India remote-friendly",
          "roles": ["DevOps Engineer", "SRE", "Platform Engineer"],
          "stack": "AWS, K8s, Terraform, Jenkins, Kafka",
          "modules": ["B01", "B03", "B05", "B04"],
          "careers": "https://paytm.com/careers",
          "note": "Massive Indian fintech scale; payment-system reliability."
        }
      ]
    }
  ],
  "applyChannels": [
    {
      "channel": "Company career portals (primary)",
      "detail": "Every company above has a careers page — set alerts for 'Platform Engineer', 'DevOps Engineer', 'SRE', 'Site Reliability', 'Cloud Engineer'."
    },
    {
      "channel": "LinkedIn (setup)",
      "detail": "Headline: 'Platform/DevOps Engineer — K8s · Terraform · AWS · CI/CD'. Turn on 'Open to Work' (recruiters only), follow the target companies, apply via their job posts + referral ask."
    },
    {
      "channel": "Naukri + Instahyre + Cutshort",
      "detail": "India-specific boards; Instahyre/Cutshort are product-company-heavy and filter by exact role keywords."
    },
    {
      "channel": "Referrals (highest conversion)",
      "detail": "Find 1-2 engineers at each target company (LinkedIn), send a short note with your portfolio link. Referrals convert 5-10x cold applies."
    },
    {
      "channel": "Remote-first boards",
      "detail": "remoteok.com, weworkremotely.com, workatastartup.com (wellfound), and the #hiring channels in DevOps/CloudDiscord+Slack communities."
    },
    {
      "channel": "Meetups & conferences",
      "detail": "Pune DevOps meetups, CNCF meetups, Docker/K8s community days — research says ~30% of Pune DevOps hires come from referrals/networking."
    }
  ],
  "playbook": [
    "Week 1: Pick 10 Tier-1+2 companies. Set career-page alerts; polish LinkedIn + resume to match their exact JD keywords (K8s, Terraform, CI/CD, SRE).",
    "Week 2: Apply to 5 Tier-2 (volume) companies first — they give fast interview reps and a safety offer. Treat them as practice.",
    "Week 3: After 2-3 interviews of reps, apply to Tier-1 product companies with a referral. Attach your A06 capstone + B05 GitOps repo links.",
    "Week 4+: Tier-3 stretch (Datadog/Grafana/HashiCorp/Cloudflare) after portfolio + mock interviews are tight. Target 15-20 active applications, not 100 spam ones.",
    "Track every application in a sheet: company, role, date, stage, next action. Follow up after 7 days of no response.",
    "Certifications (CKA, AWS DevOps Associate) measurably boost shortlisting in Tier-2 volume hiring (~40% per Pune 2025 research) — schedule them during B01/B03."
  ]
};
