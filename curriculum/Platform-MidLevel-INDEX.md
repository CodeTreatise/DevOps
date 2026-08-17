# 🏗️ Platform Engineering — Mid-Level Depth Map (DevOps / SRE)

> **Goal:** Go from "junior foundation" to "mid-level operator" — depth, judgment, ownership.
> **Prerequisite:** Platform-Fundamentals-INDEX.md done (or equivalent). This is NOT from-scratch; it's the gap-filler to *interview-eligible mid*.
> **Estimated time:** ~8–12 weeks part-time · **Cost:** $0 (free tiers + docs throughout)
> **The 3 shifts:** Junior *does tasks*, mid *owns systems*. Junior *knows tools*, mid *knows failure modes*. Junior *follows runbooks*, mid *writes them*.
>
> 📖 **Companion deliverable:** [Platform-Answer-Bank-B.md](../answer-bank/Platform-Answer-Bank-B.md) — all 317 Phase B interview questions with model answers + 1/2/3 rubrics (self-grading). Phase A bank: [Platform-Answer-Bank.md](../answer-bank/Platform-Answer-Bank.md) (109 Qs).

---

## 📌 Master Index

| # | Module | Type | Est. Time | Status |
| --- | --- | --- | --- | --- |
| 01 | Kubernetes — operate, don't deploy | 🐳 Core | Weeks 1–2 | ☐ |
| 02 | Terraform & IaC — state & modularity | 🏗️ Core | Weeks 3–4 | ☐ |
| 03 | Cloud (AWS) — VPC, IAM, cost | ☁️ Core | Weeks 5–6 | ☐ |
| 04 | Observability depth — SLOs & traces | 📊 Core | Weeks 5–6 | ☐ |
| 05 | CI/CD as a product — GitOps & canary | ⚡ Core | Weeks 7–8 | ☐ |
| 06 | Reliability craft — incidents & chaos | 🛡️ Core | Weeks 9–10 | ☐ |
| 07 | Automation — idempotent scripts | 🔧 Force-multiplier | Ongoing | ☐ |
| 08 | Ownership — on-call & runbooks | 🧭 Career | Ongoing | ☐ |
| 09 | Mid interview prep + portfolio upgrade | 🏆 Final | Weeks 11–12 | ☐ |

---

## 01 · Kubernetes — operate, don't deploy 🐳 (Weeks 1–2)

### The operator mindset

Not "deployed once" — **operates** it daily. The difference: a junior knows what a pod is; a mid knows what a *crash-looping* pod is and how to fix it in 3 commands.

> ⏱ **Timing:** the "Weeks 1–2" figure covers the core kubectl + debugging loop only. Full depth (RBAC hardening, service mesh, operators, cluster backup) realistically takes 4–6 weeks part-time.

### Sub-topic: Workloads & objects

- [ ] **Workloads** — Deployments, StatefulSets, DaemonSets, Jobs/CronJobs; know which to reach for when
  - 📚 [Kubernetes Workloads](https://kubernetes.io/docs/concepts/workloads/) · [Kubernetes Concepts](https://kubernetes.io/docs/concepts/)
- [ ] **Networking objects** — Services (ClusterIP/NodePort/LoadBalancer), Ingress + controllers, TLS termination
  - 📚 [Kubernetes Services & Networking](https://kubernetes.io/docs/concepts/services-networking/) · [Kubernetes Tutorials](https://kubernetes.io/docs/tutorials/)
- [ ] **Config & storage** — ConfigMaps, Secrets, PVCs/PVs; ephemeral vs persistent
  - 📚 [Kubernetes: Persistent Volumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/) · [Kubernetes Concepts](https://kubernetes.io/docs/concepts/)
- [ ] **Namespaces & labels** — organizing, multi-tenancy basics, label selectors
  - 📚 [Kubernetes: Namespaces](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/) · [kubectl Cheatsheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)

### Sub-topic: Operating the cluster

- [ ] **The daily commands** — `kubectl get/describe/logs/exec/port-forward`, `-o yaml`, contexts (`config use-context`)
  - 📚 [kubectl Cheatsheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/) (the page to keep open)
- [ ] **Node operations** — `cordon`, `drain`, `uncordon`, taints & tolerations; maintenance without downtime
  - 📚 [kubectl Cheatsheet: Nodes](https://kubernetes.io/docs/reference/kubectl/cheatsheet/) · [Kubernetes: Taints & Tolerations](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/)
- [ ] **Rolling deploy + rollback from muscle memory** — `rollout status`, `rollout undo`, `--record`
  - 📚 [kubectl Cheatsheet: Updating resources](https://kubernetes.io/docs/reference/kubectl/cheatsheet/) · [Kubernetes: Rolling updates](https://kubernetes.io/docs/tutorials/kubernetes-basics/update/update-intro/)
- [ ] **Helm** — package apps as charts; `helm install/upgrade/rollback`
  - 📚 [Helm docs](https://helm.sh/docs/) · [Kubernetes Tutorials](https://kubernetes.io/docs/tutorials/)

- [ ] **etcd backup & restore** — etcdctl snapshot save/restore; backup frequency; store snapshots safely off-cluster
  - 📚 [Kubernetes: Configure etcd (backup)](https://kubernetes.io/docs/tasks/administer-cluster/configure-upgrade-etcd/)

### Sub-topic: Debugging & failure modes

- [ ] **The four horsemen** — OOMKilled, ImagePullBackOff, CrashLoopBackOff, node pressure; `kubectl describe` + `logs --previous` are your first two moves
  - 📚 [Kubernetes: Debugging](https://kubernetes.io/docs/tasks/debug/) · [kubectl Cheatsheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [ ] **Debug in-place** — `exec`, ephemeral containers, `port-forward`, `kubectl top` for live metrics
  - 📚 [kubectl Cheatsheet: Interacting with pods](https://kubernetes.io/docs/reference/kubectl/cheatsheet/) · [Kubernetes: Debug](https://kubernetes.io/docs/tasks/debug/)

### Sub-topic: Scheduling & resources

- [ ] **Requests & limits** — how the scheduler places pods; QoS classes (Guaranteed/Burstable/BestEffort)
  - 📚 [Kubernetes: Managing resources](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/) · [Kubernetes Concepts](https://kubernetes.io/docs/concepts/)
- [ ] **Scaling** — HPA (Horizontal Pod Autoscaler) basics, `kubectl scale`
  - 📚 [Kubernetes: HPA](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/) · [kubectl Cheatsheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [ ] 🟡 **VPA & cluster autoscaling** — Vertical Pod Autoscaler (right-size requests) + Cluster Autoscaler/Karpenter (scale nodes); the full autoscaling story beyond HPA
  - 📚 [Kubernetes: VPA](https://kubernetes.io/docs/tasks/run-application/vertical-pod-autoscaling/) · [Karpenter](https://karpenter.sh/) · [Cluster Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler)
- [ ] **Pod Disruption Budgets** — protect availability during drains/upgrades; `minAvailable`/`maxUnavailable`
  - 📚 [Kubernetes: Configure PDBs](https://kubernetes.io/docs/tasks/run-application/configure-pdb/) · [Kubernetes: Disruptions](https://kubernetes.io/docs/concepts/workloads/pods/disruptions/)
- [ ] **ResourceQuota & LimitRange** — namespace-level governance; stop one team eating the whole cluster
  - 📚 [Kubernetes: ResourceQuota](https://kubernetes.io/docs/concepts/policy/resource-quotas/) · [Kubernetes: LimitRange](https://kubernetes.io/docs/concepts/policy/limit-range/)
- [ ] 🟡 **Advanced scheduling** — Topology Spread Constraints, Pod Priorities, node affinity/selectors, evictions; placement control beyond the basics
  - 📚 [Kubernetes: Topology Spread Constraints](https://kubernetes.io/docs/concepts/scheduling-eviction/topology-spread-constraints/) · [Kubernetes: Assigning pods to nodes](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/)

### Sub-topic: Security & RBAC

- [ ] **RBAC** — ServiceAccounts, Roles/RoleBindings vs ClusterRoles; least-privilege default
  - 📚 [Kubernetes: RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) · [Kubernetes: RBAC good practices](https://kubernetes.io/docs/concepts/security/rbac-good-practices/)
- [ ] **Pod security** — `securityContext`, `runAsNonRoot`, Pod Security Standards
  - 📚 [Kubernetes: Pod Security Standards](https://kubernetes.io/docs/concepts/security/pod-security-standards/) · [Kubernetes Concepts](https://kubernetes.io/docs/concepts/)

### Sub-topic: Network policies & service mesh

- [ ] **NetworkPolicies** — default-deny thinking; CNI support (Calico/Cilium); micro-segmentation between pods
  - 📚 [Kubernetes: Network Policies](https://kubernetes.io/docs/concepts/services-networking/network-policies/) · [Cilium docs](https://docs.cilium.io/) (CNI with a built-in policy engine)
- [ ] **Service mesh** — Istio/Linkerd: mTLS, traffic shifting, retries at the mesh level (a ~+30% premium skill per India market data)
  - 📚 [Istio docs](https://istio.io/latest/docs/) · [Linkerd docs](https://linkerd.io/2.16/overview/) · [Kubernetes: Services & Networking](https://kubernetes.io/docs/concepts/services-networking/)

### Sub-topic: Extensions & the Operator pattern

- [ ] 🟡 **CRDs & Operators** — why Argo CD, Kyverno, Prometheus Operator all work: they're just controllers watching custom resources; this mental model unlocks every cloud-native tool
  - 📚 [Kubernetes: Custom Resources](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) · [Operator pattern](https://kubernetes.io/docs/concepts/extend-kubernetes/operator/)
- [ ] 🟡 **Managed vs self-managed + multi-cluster** — the judgment call every platform team faces; EKS/AKS/GKE vs kubeadm; multi-cluster via Argo CD / Cluster API
  - 📚 [Cluster API](https://cluster-api.sigs.k8s.io/) · [AWS EKS docs](https://docs.aws.amazon.com/eks/)

### Practice environment

- [ ] **Local cluster** — `kind` or `k3s`; the whole mid-level set runs on a laptop
  - 📚 [kind](https://kind.sigs.k8s.io/) · [k3s](https://k3s.io/)

### Exit test for Kubernetes

You can debug a crash-looping pod from a blank screen in under 10 minutes, and roll back a bad deploy without reading docs.

---

## 02 · Terraform & IaC — state & modularity 🏗️ (Weeks 3–4)

### The state problem

Terraform's power and its curse is **state** — the record of what exists. Mid-level is when you stop fighting state and start *managing* it: remote, locked, planned.

### Sub-topic: Core language

- [ ] **Blocks & providers** — provider config, `resource`/`data` blocks, provider version pinning
  - 📚 [Terraform: Language](https://developer.hashicorp.com/terraform/language) · [Terraform Tutorials](https://developer.hashicorp.com/terraform/tutorials)
- [ ] **Variables, outputs, locals** — parameterize everything; no hardcoded values; `tfvars` for environments
  - 📚 [Terraform: Values](https://developer.hashicorp.com/terraform/language/values) · [Terraform: Language](https://developer.hashicorp.com/terraform/language)
- [ ] **Expressions & meta-arguments** — `for_each`/`count`, `depends_on`, dynamic blocks
  - 📚 [Terraform: Expressions](https://developer.hashicorp.com/terraform/language/expressions) · [Terraform: Meta-arguments](https://developer.hashicorp.com/terraform/language/meta-arguments/for_each)
- [ ] **OpenTofu** — the open-source fork of Terraform (HashiCorp relicensed to BSL in 2023); drop-in compatible, community-preferred where licensing matters — know when it applies
  - 📚 [OpenTofu docs](https://opentofu.org/docs/) (LF project, MPL-2.0) · [Terraform: Language](https://developer.hashicorp.com/terraform/language)

- [ ] 🟡 **Pulumi awareness** — TypeScript/Python-native IaC; real programming languages instead of HCL; increasingly in product-company JDs
  - 📚 [Pulumi docs](https://www.pulumi.com/docs/)
- [ ] 🟡 **AWS-native IaC awareness** — CloudFormation & AWS CDK: many AWS-heavy Indian shops never touch Terraform; know enough to read and extend
  - 📚 [AWS CloudFormation docs](https://docs.aws.amazon.com/cloudformation/) · [AWS CDK docs](https://docs.aws.amazon.com/cdk/)

### Sub-topic: State management

- [ ] **Remote state + locking** — state in S3/GCS/Terraform Cloud; `plan` before `apply` is a habit
  - 📚 [Terraform: State](https://developer.hashicorp.com/terraform/language/state) · [Terraform Tutorials: cloud-get-started](https://developer.hashicorp.com/terraform/tutorials/cloud-get-started)
- [ ] **State surgery** — drift, `import`, `state mv/rm`; when the real world diverges from config
  - 📚 [Terraform: CLI state commands](https://developer.hashicorp.com/terraform/cli/commands/state) · [Terraform: Import](https://developer.hashicorp.com/terraform/cli/import)
- [ ] **Workspaces** — separating environments (dev/stage/prod) on one config
  - 📚 [Terraform: Workspaces](https://developer.hashicorp.com/terraform/language/state/workspaces) · [Terraform: State](https://developer.hashicorp.com/terraform/language/state)

### Sub-topic: Modules & reuse

- [ ] **Write modular, reusable config** — modules with inputs/outputs, not one giant `main.tf`
  - 📚 [Terraform: Modules](https://developer.hashicorp.com/terraform/language/modules) · [Terraform Tutorials](https://developer.hashicorp.com/terraform/tutorials)
- [ ] **Module registry & versioning** — local vs registry modules; pin versions
  - 📚 [Terraform: Module sources](https://developer.hashicorp.com/terraform/language/modules/sources) · [Terraform Registry](https://registry.terraform.io/)
- [ ] 🟡 **Terragrunt** — the DRY wrapper teams love: tiny module calls, per-environment state config; "have you seen it" interview knowledge
  - 📚 [Terragrunt docs](https://terragrunt.gruntwork.io/docs/) · [Terraform: Modules](https://developer.hashicorp.com/terraform/language/modules)

### Sub-topic: Plan/apply discipline

- [ ] **Plan reading** — a `terraform plan` that shows *only* the intended diff; knowing when a diff is suspicious
  - 📚 [Terraform: Plan](https://developer.hashicorp.com/terraform/cli/commands/plan) · [Terraform Tutorials](https://developer.hashicorp.com/terraform/tutorials)
- [ ] **Lifecycle guards** — `lifecycle` block, `prevent_destroy`, `create_before_destroy`; safe destruction
  - 📚 [Terraform: Lifecycle](https://developer.hashicorp.com/terraform/language/meta-arguments/lifecycle) · [Terraform: Language](https://developer.hashicorp.com/terraform/language)
- [ ] 🟡 **IaC quality gates** — `fmt`/`validate`/`tflint` in CI, `checkov`/`terrascan` security scanning, `terraform test`; DevSecOps wants misconfig caught before `apply`
  - 📚 [Terraform: CLI commands](https://developer.hashicorp.com/terraform/cli/commands) · [Checkov](https://www.checkov.io/) · [Terraform: Test](https://developer.hashicorp.com/terraform/language/tests)

- [ ] 🟡 **Infracost** — Cost estimation for Terraform plans; CI integration shows $ impact per PR before apply
  - 📚 [Infracost docs](https://www.infracost.io/docs/)

### Exit test for Terraform

You can refactor a monolith `main.tf` into modules, move state to remote, and safely `import` an existing resource — without `terraform destroy` as your only undo.

---

## 03 · Cloud (AWS) — VPC, IAM, cost ☁️ (Weeks 5–6)

### The cloud mental model

One primary cloud (usually AWS). Not "click in the console" — **infrastructure as components you can describe and secure**: VPC, subnets, security groups, IAM.

### Sub-topic: Compute & storage

- [ ] **Compute** — EC2 (instances, AMIs, key pairs), EBS volumes; knowing the free tier boundaries
  - 📚 [AWS EC2 docs](https://docs.aws.amazon.com/ec2/) · [AWS Free Tier](https://aws.amazon.com/free/)
- [ ] **Object storage** — S3 (buckets, versioning, lifecycle, buckets-as-backends)
  - 📚 [AWS S3 docs](https://docs.aws.amazon.com/s3/) · [AWS Well-Architected](https://docs.aws.amazon.com/wellarchitected/)
- [ ] **Managed databases** — RDS (Postgres/MySQL), backups, multi-AZ
  - 📚 [AWS RDS docs](https://docs.aws.amazon.com/rds/) · [AWS Free Tier](https://aws.amazon.com/free/)
- [ ] **Serverless** — Lambda: when serverless fits vs containers; triggers, cold starts, function design
  - 📚 [AWS Lambda docs](https://docs.aws.amazon.com/lambda/) · [AWS Compute](https://aws.amazon.com/lambda/)
- [ ] 🟡 **Containers on AWS** — ECS/Fargate + ECR vs EKS: when the managed container service beats running your own k8s (very common in Indian companies)
  - 📚 [AWS ECS docs](https://docs.aws.amazon.com/ecs/) · [AWS Fargate](https://aws.amazon.com/fargate/) · [AWS ECR](https://docs.aws.amazon.com/ecr/)
- [ ] 🟡 **Serverless ecosystem** — API Gateway + DynamoDB: the pattern that pairs with Lambda in real apps
  - 📚 [AWS API Gateway docs](https://docs.aws.amazon.com/apigateway/) · [AWS DynamoDB docs](https://docs.aws.amazon.com/dynamodb/)

### Sub-topic: Databases in production

- [ ] **SQL vs NoSQL** — When to reach for Postgres vs DynamoDB/MongoDB: relations, scale, access patterns
  - 📚 [AWS DynamoDB docs](https://docs.aws.amazon.com/dynamodb/) · [MongoDB documentation](https://www.mongodb.com/docs/)
- [ ] **Backups & point-in-time recovery** — Snapshot, PITR, restore drill; tie to the RTO/RPO targets from B06
  - 📚 [AWS RDS docs](https://docs.aws.amazon.com/rds/) · [PostgreSQL backup docs](https://www.postgresql.org/docs/current/backup-dump.html)
- [ ] **Connection pooling & slow queries** — PgBouncer, indexes, EXPLAIN ANALYZE; the database as the app's bottleneck
  - 📚 [PgBouncer](https://www.pgbouncer.org/) · [PostgreSQL: Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)

### Sub-topic: Networking

- [ ] **VPC fundamentals** — subnets (public/private), route tables, NAT gateway, internet gateway
  - 📚 [AWS VPC docs](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html) · [AWS EC2 docs](https://docs.aws.amazon.com/ec2/)
- [ ] **Security groups & NACLs** — allow-listing, stateful vs stateless, "deny by default" thinking
  - 📚 [AWS VPC: Security groups](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html) · [AWS VPC docs](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html)
- [ ] **DNS** — Route 53 basics: hosted zones, records, routing policies
  - 📚 [AWS Route 53 docs](https://docs.aws.amazon.com/route53/) · [AWS Networking](https://docs.aws.amazon.com/whitepapers/latest/aws-vpc-connectivity-options/welcome.html)

### Sub-topic: Load balancing & scaling

- [ ] **Load balancers** — ALB/NLB; target groups, listeners, health checks
  - 📚 [AWS Elastic Load Balancing docs](https://docs.aws.amazon.com/elasticloadbalancing/) · [AWS EC2 docs](https://docs.aws.amazon.com/ec2/)
- [ ] **Auto Scaling Groups** — launch templates, min/max/desired, scaling policies
  - 📚 [AWS EC2 Auto Scaling docs](https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html) · [AWS EC2 docs](https://docs.aws.amazon.com/ec2/)
- [ ] **Managed Kubernetes** — EKS basics; how it maps to the k8s you learned in Module 01
  - 📚 [AWS EKS docs](https://docs.aws.amazon.com/eks/) · [Kubernetes Tutorials](https://kubernetes.io/docs/tutorials/)
- [ ] **Well-Architected thinking** — the 6 pillars (Operational Excellence, Security, Reliability, Performance, Cost, Sustainability) as your design-review checklist; interviews ask for it
  - 📚 [AWS Well-Architected](https://docs.aws.amazon.com/wellarchitected/) · [AWS WAF Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html)

### Sub-topic: IAM & security

- [ ] **IAM least-privilege** — "who can touch what" is second nature; roles, policies, no root keys in code
  - 📚 [AWS IAM docs](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html) · [AWS Well-Architected](https://docs.aws.amazon.com/wellarchitected/)
- [ ] **Credentials hygiene** — no keys in code/repos; roles for EC2; SSO/identity center
  - 📚 [AWS IAM: Best practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html) · [AWS IAM docs](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html)

- [ ] **AWS Organizations & SCPs** — Multi-account strategy; SCPs as guardrails that override IAM; OU hierarchy
  - 📚 [AWS Organizations: What is AWS Organizations](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html) · [AWS: SCPs](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html)
- [ ] 🟡 **Second cloud awareness** — Azure is growing fast in India (Pune MNCs); multi-cloud is a premium skill: learn the concepts once, the console differs
  - 📚 [Azure DevOps docs](https://learn.microsoft.com/en-us/azure/devops/) · [GCP DevOps](https://cloud.google.com/architecture/devops)

### Sub-topic: Cost & FinOps

- [ ] **Cost awareness** — read a bill, find the money, tag resources, set budgets
  - 📚 [AWS Cost Management](https://docs.aws.amazon.com/cost-management/) · [AWS Well-Architected: Cost pillar](https://docs.aws.amazon.com/wellarchitected/latest/cost-optimization-pillar/welcome.html)
- [ ] **Monitoring basics** — CloudWatch metrics, alarms, log groups
  - 📚 [AWS CloudWatch docs](https://docs.aws.amazon.com/cloudwatch/) · [AWS Well-Architected](https://docs.aws.amazon.com/wellarchitected/)

### Exit test for AWS

You can describe your architecture in terms of VPC/subnet/security-group, and explain who can access what (IAM) without guessing.

---

## 04 · Observability depth — SLOs & traces 📊 (Weeks 5–6)

### From dashboards to answers

A junior installs Prometheus; a mid writes **dashboards that answer questions** and knows the *math* of reliability: SLOs and error budgets.

### Sub-topic: Metrics

- [ ] **Metrics that matter** — RED (Rate, Errors, Duration) and USE (Utilization, Saturation, Errors); p50/p95/p99 and *why* percentiles matter
  - 📚 [Prometheus Overview](https://prometheus.io/docs/introduction/overview/) · [Prometheus: Querying basics (PromQL)](https://prometheus.io/docs/prometheus/latest/querying/basics/)
- [ ] **PromQL** — queries, rate/irate, aggregations, recording rules
  - 📚 [Prometheus: PromQL basics](https://prometheus.io/docs/prometheus/latest/querying/basics/) · [Prometheus: Recording rules](https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/)
- [ ] **Instrumentation** — exposing your own app's metrics (counters, gauges, histograms)
  - 📚 [Prometheus: Instrumenting](https://prometheus.io/docs/instrumenting/clientlibs/) · [Prometheus Overview](https://prometheus.io/docs/introduction/overview/)

### Sub-topic: Dashboards & visualization

- [ ] **Grafana** — dashboards that answer questions; templating, annotations, dashboard-as-code
  - 📚 [Grafana docs](https://grafana.com/docs/) · [Prometheus Overview](https://prometheus.io/docs/introduction/overview/)

### Sub-topic: Logs

- [ ] **Log aggregation** — Loki or ELK; central search across services
  - 📚 [Grafana Loki docs](https://grafana.com/docs/loki/latest/) · [Grafana docs](https://grafana.com/docs/)
- [ ] **Log correlation** — linking a trace ID to logs; logs as the second stop after traces
  - 📚 [OpenTelemetry docs](https://opentelemetry.io/docs/) · [Grafana Loki docs](https://grafana.com/docs/loki/latest/)

### Sub-topic: Tracing

- [ ] **OpenTelemetry** — traces/spans, contexts, propagation; follow one request through 5 services
  - 📚 [OpenTelemetry docs](https://opentelemetry.io/docs/) (industry-standard, vendor-neutral) · [Google SRE: Distributed tracing](https://sre.google/sre-book/distributed-tracing/)
- [ ] **Sampling & cost** — head vs tail sampling; traces-first, logs-second discipline
  - 📚 [OpenTelemetry: Sampling](https://opentelemetry.io/docs/concepts/sampling/) · [OpenTelemetry docs](https://opentelemetry.io/docs/)

- [ ] **OpenTelemetry Collector** — Receives traces/metrics/logs from apps, processes, and routes to backends; replaces direct SDK→backend coupling
  - 📚 [OpenTelemetry Collector docs](https://opentelemetry.io/docs/collector/)
- [ ] 🟡 **Grafana Alloy** — Grafana-native unified collector (successor to Grafana Agent); pipelines for metrics, logs, traces
  - 📚 [Grafana Alloy docs](https://grafana.com/docs/alloy/latest/)

### Sub-topic: SLOs & alerting

- [ ] **SLOs & error budgets** — "99.9% availability = ~43 min downtime/month"; budget for deploys, not just measure uptime
  - 📚 [Google SRE books (free)](https://sre.google/books/) (the SLO chapter is canonical) · [Prometheus: Alerting best practices](https://prometheus.io/docs/practices/alerting/)
- [ ] **Alerting that doesn't scream** — fewer, better alerts; alert on *symptoms* not causes; severity vs silence
  - 📚 [Prometheus: Alerting](https://prometheus.io/docs/alerting/latest/overview/) · [Prometheus: Alertmanager](https://prometheus.io/docs/alerting/latest/alertmanager/) · [Google SRE: Monitoring](https://sre.google/sre-book/monitoring-distributed-systems/)

### Exit test for Observability

Given a slow endpoint, you can say which metric moved, follow the trace to the culprit service, and decide whether it's an alert or noise.

---

## 05 · CI/CD as a product — GitOps & canary ⚡ (Weeks 7–8)

### Pipelines as products

A junior writes one pipeline; a mid writes **reusable, parameterized pipelines** and treats Git as the source of truth (GitOps).

### Sub-topic: Pipeline design

- [ ] **Reusable pipelines** — shared workflows, matrix builds, templates; one change fixes every pipeline
  - 📚 [GitHub Actions docs](https://docs.github.com/en/actions) · [GitHub Skills: Actions](https://skills.github.com/)
- [ ] **Caching & speed** — dependency caching, parallel jobs, buildkit; pipelines that don't waste developer time
  - 📚 [GitHub Actions: Caching](https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows) · [GitHub Actions docs](https://docs.github.com/en/actions)
- [ ] **Jenkins** — still the dominant CI in Indian enterprise/service companies (TCS/Infosys/Accenture); declarative pipelines, plugins, master-agent
  - 📚 [Jenkins docs](https://www.jenkins.io/doc/) · [Jenkins Pipeline tutorial](https://www.jenkins.io/doc/pipeline/tour/getting-started/)
- [ ] **GitLab CI** — one of the "core must-haves" in India job posts; `.gitlab-ci.yml`, runners, built-in registry & security
  - 📚 [GitLab CI docs](https://docs.gitlab.com/ee/ci/) · [GitLab: first pipeline](https://docs.gitlab.com/ci/quick_start/)

- [ ] **DORA metrics instrumentation** — Measure deploy frequency, lead time, change failure rate, MTTR; use CI/CD event data + Grafana/custom dashboards
  - 📚 [DORA (canonical source)](https://dora.dev/) · [Google: Four Keys to measure DevOps performance](https://cloud.google.com/blog/products/devops-sre/using-the-four-keys-to-measure-your-devops-performance)

### Sub-topic: Environments & gates

- [ ] **Environments & approvals** — staging vs prod, manual approval gates, protection rules
  - 📚 [GitHub Actions: Environments](https://docs.github.com/en/actions/deployment) · [GitHub Skills](https://skills.github.com/)
- [ ] **Secrets in CI** — encrypted secrets, scoping, rotation; never in logs
  - 📚 [GitHub Actions: Secrets](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions) · [GitHub Actions: Security](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)

### Sub-topic: GitOps

- [ ] **GitOps** — Git is the source of truth; the cluster syncs itself (Argo CD or Flux)
  - 📚 [Argo CD docs](https://argo-cd.readthedocs.io/en/stable/) (declarative GitOps CD) · [Flux docs](https://fluxcd.io/docs/) (CNCF graduated)
- [ ] **Sync & drift** — how Argo CD/Flux reconcile, OutOfSync states, auto-sync policies
  - 📚 [Argo CD: User guide](https://argo-cd.readthedocs.io/en/stable/user-guide/) · [Flux: Core concepts](https://fluxcd.io/flux/concepts/)

### Sub-topic: Progressive delivery

- [ ] **Canary & blue-green** — deploys that *dare* to go wrong slowly; traffic shifting, automated analysis
  - 📚 [Argo Rollouts docs](https://argoproj.github.io/argo-rollouts/) · [Flagger docs](https://flagger.app/) · [GitHub Actions docs](https://docs.github.com/en/actions)
- [ ] **Feature flags** — dark launches; flag-driven behavior as a rollout tool
  - 📚 [Flagger docs](https://flagger.app/) · [Argo Rollouts docs](https://argoproj.github.io/argo-rollouts/)

### Sub-topic: Artifacts & rollback

- [ ] **Artifacts & registries** — container registry, immutable tags, versioning
  - 📚 [GitHub Packages](https://docs.github.com/en/packages) · [Docker Registry docs](https://docs.docker.com/registry/)
- [ ] **Rollback built in** — every pipeline has a rollback path, not bolted on after an incident
  - 📚 [GitHub Actions: Deployment protection rules](https://docs.github.com/en/actions/deployment) · [Argo CD: Rollback](https://argo-cd.readthedocs.io/en/stable/user-guide/)

### Exit test for CI/CD

You can promote a change through staging → prod with a canary step, and roll it back by reverting one Git commit.

---

## 06 · Reliability craft — incidents & chaos 🛡️ (Weeks 9–10)

### The SRE part

The part that can't be learned from a course — but can be *practiced*: incidents, chaos experiments, scaling, and restore drills.

### Sub-topic: Incident response

- [ ] **Incident response** — severity levels, triage, comms, incident commander role; calm under the pager
  - 📚 [Google SRE books (free)](https://sre.google/books/) (the incident-response chapter) · [Google SRE: Postmortem culture](https://sre.google/sre-book/postmortem-culture/)
- [ ] **Escalation & comms** — when to escalate, status updates, blameless culture
  - 📚 [Google SRE: Being on-call](https://sre.google/sre-book/being-on-call/) · [Google SRE books](https://sre.google/books/)

### Sub-topic: Postmortems

- [ ] **Blameless postmortems** — timeline, root cause, action items, follow-up ownership
  - 📚 [Google SRE: Postmortem culture](https://sre.google/sre-book/postmortem-culture/) · [Google SRE books](https://sre.google/books/)

### Sub-topic: Chaos engineering

- [ ] **Chaos thinking** — steady state, hypothesis, controlled experiments, blast radius
  - 📚 [Principles of Chaos Engineering](https://principlesofchaos.org/) (the canonical principles) · [Chaos Monkey](https://netflix.github.io/chaosmonkey/)
- [ ] **Game days** — kill a pod, throttle a network, see what breaks *before* production does
  - 📚 [Principles of Chaos Engineering](https://principlesofchaos.org/) · [Chaos Monkey](https://netflix.github.io/chaosmonkey/)

- [ ] **Chaos Mesh (k8s-native)** — Install, run a pod-kill / network-latency experiment, verify the hypothesis
  - 📚 [Chaos Mesh docs](https://chaos-mesh.org/docs/)
- [ ] **Litmus Chaos** — CNCF k8s-native alternative; Litmus portal for experiment management
  - 📚 [LitmusChaos](https://litmuschaos.io/)

### Sub-topic: Capacity & scaling

- [ ] **Autoscaling** — HPA, when to scale up vs out, quotas
  - 📚 [Kubernetes: Horizontal Pod Autoscaling](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/) · [Kubernetes docs](https://kubernetes.io/docs/)
- [ ] **Load & performance testing** — baseline, soak, spike; k6 as the standard tool
  - 📚 [k6 docs](https://k6.io/docs/) · [Google SRE books](https://sre.google/books/)

### Sub-topic: Backups & DR

- [ ] **Backups & restore drills** — have *actually restored* from backup, not just taken backups; drills are the test
  - 📚 [PostgreSQL backup docs](https://www.postgresql.org/docs/current/backup-dump.html) · [Google SRE: Data integrity](https://sre.google/sre-book/data-integrity-what-you-read-and-write-is-what-you-served/)
- [ ] **RTO/RPO & failover** — recovery objectives; multi-AZ, multi-region thinking
  - 📚 [AWS Disaster Recovery](https://aws.amazon.com/disaster-recovery/) · [Google SRE: Data integrity](https://sre.google/sre-book/data-integrity-what-you-read-and-write-is-what-you-served/)
- [ ] **Cluster backup with Velero** — backup/restore/migrate entire k8s clusters + persistent volumes; the standard DR answer
  - 📚 [Velero docs](https://velero.io/docs/) (CNCF) · [Velero: disaster recovery](https://velero.io/docs/v1.18/disaster-case)

### Exit test for Reliability

You can run a kill-a-pod experiment, observe the steady state, and write a blameless postmortem with a real follow-up action.

---

## 07 · Automation — idempotent scripts 🔧 (Ongoing)

### The force multiplier

A mid automates the boring stuff *before* being asked — and the scripts are safe to run twice.

### Sub-topic: Bash mastery

- [ ] **Bash, properly** — quoting, exit codes, `set -euo pipefail`, error handling; not copy-paste scripts
  - 📚 [BashGuide (wooledge)](https://mywiki.wooledge.org/BashGuide) (the community's canonical guide) · [ShellCheck](https://github.com/koalaman/shellcheck) (lint your scripts)
- [ ] **JSON processing** — `jq` as the universal field extractor in pipelines
  - 📚 [jq manual](https://jqlang.github.io/jq/) · [BashGuide](https://mywiki.wooledge.org/BashGuide)

### Sub-topic: Python glue

- [ ] **Python for glue** — the automation language; `argparse`, `requests`, clear error handling
  - 📚 [Python docs](https://docs.python.org/3/) · [Real Python](https://realpython.com/)
- [ ] 🟡 **Go (read-level, optional)** — the language k8s, Terraform, and most cloud-native tools are written in; you don't need to write it, but reading tool source is a mid-level superpower
  - 📚 [Go docs](https://go.dev/doc/) · [Go by Example](https://gobyexample.com/)
- [ ] **Logging & observability of scripts** — output that a future-you can read at 3am
  - 📚 [BashGuide: Input and Output](https://mywiki.wooledge.org/BashGuide/InputAndOutput) · [Python logging docs](https://docs.python.org/3/howto/logging.html)

### Sub-topic: Safety & idempotency

- [ ] **Idempotency** — "run twice = run once"; every script should be re-runnable without damage
  - 📚 [BashGuide: Practices](https://mywiki.wooledge.org/BashGuide/Practices) · [ShellCheck](https://github.com/koalaman/shellcheck)
- [ ] **Dry-run & guards** — `--dry-run` flags, lock files, explicit confirmation for destructive steps
  - 📚 [BashGuide: Practices](https://mywiki.wooledge.org/BashGuide/Practices) · [Python docs](https://docs.python.org/3/)

### Sub-topic: Scheduling & tooling

- [ ] **Scheduling** — cron, systemd timers, CI cron; cron expression mastery
  - 📚 [crontab.guru](https://crontab.guru/) (interactive cron learning) · [systemd timers](https://www.freedesktop.org/software/systemd/man/latest/systemd.timer.html)
- [ ] **Task runners** — Makefile as the universal entry point; `make test`, `make deploy`
  - 📚 [GNU Make manual](https://www.gnu.org/software/make/manual/make.html) · [BashGuide](https://mywiki.wooledge.org/BashGuide)

- [ ] **tmux** — Terminal multiplexer; persist sessions across SSH disconnects; split panes for parallel monitoring during incidents
  - 📚 [tmux wiki](https://github.com/tmux/tmux/wiki) · [Ham Vocke: A quick and easy guide to tmux](https://www.hamvocke.com/blog/a-quick-and-easy-guide-to-tmux/)

### Sub-topic: Config management (Ansible)

- [ ] **Ansible basics** — inventory, ad-hoc commands, playbooks; the #1 config-management tool named in Pune/India job skill lists
  - 📚 [Ansible docs](https://docs.ansible.com/ansible/latest/index.html) · [Ansible: Getting started](https://docs.ansible.com/ansible/latest/getting_started/index.html)
- [ ] **Ansible Vault & idempotency** — encrypt secrets in playbooks; playbooks safe to re-run (module/state model)
  - 📚 [Ansible Vault](https://docs.ansible.com/ansible/latest/vault_guide/index.html) · [Ansible: modules intro](https://docs.ansible.com/ansible/latest/module_plugin_guide/modules_intro.html)
- [ ] **Where Ansible fits vs Terraform** — Terraform provisions, Ansible configures; the division of labor every team debates
  - 📚 [Ansible vs Terraform (Red Hat)](https://www.redhat.com/en/topics/automation/ansible-vs-terraform) · [Ansible docs](https://docs.ansible.com/ansible/latest/index.html)

- [ ] **Ansible collections** — The modern packaging unit (replaces standalone roles); ansible-galaxy collection install; community.general, amazon.aws, kubernetes.core
  - 📚 [Ansible: Collections guide](https://docs.ansible.com/ansible/latest/collections_guide/index.html) · [Ansible Galaxy](https://galaxy.ansible.com/)

### Exit test for Automation

Your scripts run unattended, fail loudly with a clear message, and can be re-run safely.

---

## 08 · Ownership — on-call & runbooks 🧭 (Ongoing)

### The career layer

Mid-level is where you stop being assigned work and start *owning* systems. This is the least "technical" module and the most valuable.

### Sub-topic: On-call

- [ ] **On-call maturity** — calm under the pager; know when to escalate, not just fix
  - 📚 [Google SRE: Being on-call](https://sre.google/sre-book/being-on-call/) · [Google SRE books](https://sre.google/books/)
- [ ] **Rotations & handoff** — good shift handoffs, documentation of open issues, pager discipline
  - 📚 [Google SRE: Being on-call](https://sre.google/sre-book/being-on-call/) · [Google SRE books](https://sre.google/books/)

### Sub-topic: Documentation

- [ ] **Runbooks & docs** — written so a future junior can do the job without you
  - 📚 [Google SRE: Effective documentation](https://sre.google/sre-book/effective-documentation/) · [Google SRE books](https://sre.google/books/)
- [ ] **ADRs & architecture notes** — recording *why* decisions were made, not just what
  - 📚 [ADR GitHub](https://adr.github.io/) · [Google SRE: Effective documentation](https://sre.google/sre-book/effective-documentation/)

### Sub-topic: Security instinct

- [ ] **Security instinct** — secrets, least privilege, patching cadence as default behavior, not an afterthought
  - 📚 [OWASP](https://owasp.org/) · [AWS IAM docs](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html)
- [ ] **CVE triage** — knowing what to patch *now* vs next Tuesday; supply-chain awareness
  - 📚 [OWASP](https://owasp.org/) · [GitHub Advisory Database](https://github.com/advisories)

### Sub-topic: Container & supply-chain security

- [ ] **Image scanning** — Trivy/Grype in CI: scan every image for CVEs before it ships; fail the build on criticals
  - 📚 [Trivy docs](https://trivy.dev/docs/) · [Trivy: vulnerability scanning](https://trivy.dev/docs/scanner/vulnerability/)
- [ ] **SBOM & provenance** — know what's inside your images; attestations; the supply-chain story DevSecOps demands
  - 📚 [SLSA framework](https://slsa.dev/) · [Trivy: SBOM](https://trivy.dev/docs/supply-chain/sbom/)

- [ ] **Container image signing (Cosign)** — Keyless signing via Sigstore OIDC; verify signatures in CI before deploy
  - 📚 [Cosign docs (Sigstore)](https://docs.sigstore.dev/cosign/)
- [ ] **Enforce signed images with Kyverno** — Policy that rejects unsigned images in prod namespaces
  - 📚 [Kyverno docs](https://kyverno.io/docs/)
- [ ] **Policy as code** — Kyverno/OPA gate what can be deployed (no latest tags, no privileged pods, image allow-lists)
  - 📚 [Kyverno docs](https://kyverno.io/docs/) · [OPA docs](https://www.openpolicyagent.org/docs/latest/)
- [ ] **Secrets management at scale** — Vault: dynamic secrets, rotation, audit; SOPS covers the basics, Vault is the enterprise answer; in GitOps, External Secrets Operator / Sealed Secrets sync secrets from Git safely
  - 📚 [HashiCorp Vault docs](https://developer.hashicorp.com/vault/docs) · [Vault: getting started](https://developer.hashicorp.com/vault/tutorials/getting-started) · [External Secrets Operator](https://external-secrets.io/)

### Sub-topic: Threat modeling & compliance

- [ ] 🟡 **Threat modeling** — STRIDE: what could go wrong in *this* system; the question behind "secure by design"
  - 📚 [OWASP: Threat modeling](https://owasp.org/www-community/Threat_Modeling) · [Microsoft STRIDE](https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool-threats)
- [ ] 🟡 **Zero Trust** — the industry model: never trust, always verify; identity is the perimeter
  - 📚 [NIST SP 800-207 (Zero Trust)](https://csrc.nist.gov/pubs/sp/800/207/final) · [Zero Trust architecture (Google Cloud)](https://cloud.google.com/architecture/security/zero-trust-architecture)
- [ ] 🟡 **Compliance awareness** — SOC 2 / ISO 27001 / NIST; what auditors actually check (logs, access reviews, patching) — big signal in enterprise & remote hiring
  - 📚 [SOC 2 (AICPA)](https://www.aicpa-cima.com/topic/audit-assurance/audit-and-assurance-greater-than-soc-2) · [ISO/IEC 27001](https://www.iso.org/standard/27001) · [NIST CSF](https://www.nist.gov/cyberframework)

### Sub-topic: Cost responsibility

- [ ] **Cost responsibility** — asking "how much does this cost?" *before* building
  - 📚 [AWS Cost Management](https://docs.aws.amazon.com/cost-management/) · [FinOps Foundation](https://www.finops.org/)
- [ ] **FinOps basics** — tagging discipline, right-sizing, reservations vs on-demand
  - 📚 [FinOps Foundation](https://www.finops.org/) · [AWS Cost Management](https://docs.aws.amazon.com/cost-management/)

### Sub-topic: Team skills

- [ ] **Code review** — reviewing others' infra/scripts with a reliability lens
  - 📚 [Google eng-practices: Code review](https://google.github.io/eng-practices/review/) · [Google SRE books](https://sre.google/books/)
- [ ] **Mentoring & blameless culture** — teaching juniors, modeling calm, writing the culture you want
  - 📚 [Google SRE: Postmortem culture](https://sre.google/sre-book/postmortem-culture/) · [Google SRE books](https://sre.google/books/)

### Exit test for Ownership

A stranger could take your on-call shift using only your runbooks, and your systems have no secrets in code.

---

## 09 · Mid interview prep + portfolio upgrade 🏆 (Weeks 11–12)

### The honest gap

The index above is the *knowledge*; the interview needs the *story*. Two things convert it: a portfolio that shows mid-level behavior, and the incident war-story.

### Sub-topic: The 2am litmus test

- [ ] **The 2am litmus test** — practice answering: "A service is slow in production at 2am. Walk me through what you do." (Traces first → which metric moved → bad deploy? → dependency? → escalate when?)
  - 📚 [Google SRE books](https://sre.google/books/) (the interview chapter) · [Awesome SRE](https://github.com/dastergon/awesome-sre)
- [ ] **Debugging story frameworks** — symptom → hypothesis → isolate → confirm → fix → verify; speak it fluently
  - 📚 [Google SRE books](https://sre.google/books/) · [Awesome SRE](https://github.com/dastergon/awesome-sre)

### Sub-topic: System design for ops

- [ ] **Design a deployment pipeline** — stages, gates, rollback, observability; talk through trade-offs
  - 📚 [Argo CD docs](https://argo-cd.readthedocs.io/en/stable/) · [GitHub Actions docs](https://docs.github.com/en/actions)
- [ ] **Design monitoring for a service** — SLIs, dashboards, alerting, on-call
  - 📚 [Prometheus docs](https://prometheus.io/docs/introduction/overview/) · [Google SRE books](https://sre.google/books/)

### Sub-topic: Your war-story

- [ ] **Your incident war-story** — one real (or practiced) incident, told end-to-end: symptom → diagnosis → fix → postmortem → prevention
  - 📚 [Google SRE: Postmortem culture](https://sre.google/sre-book/postmortem-culture/) · [Blameless (blog)](https://www.blameless.com/blog)

### Sub-topic: Behavioral & ownership

- [ ] **Ownership stories** — times you owned a system, escalated well, or mentored someone; STAR format
  - 📚 [Google SRE books](https://sre.google/books/) · [Google eng-practices: Review](https://google.github.io/eng-practices/review/)

### Sub-topic: Portfolio upgrade

- [ ] **Portfolio upgrade** — one repo that is unmistakably mid-level: GitOps-managed, Terraform-defined, SLO'd, chaos-tested
  - 📚 [Argo CD docs](https://argo-cd.readthedocs.io/en/stable/) · [Terraform Tutorials](https://developer.hashicorp.com/terraform/tutorials) · [Prometheus docs](https://prometheus.io/docs/introduction/overview/)
- [ ] **Community project ladder** — roadmap.sh's DevOps projects (community-tracked, difficulty-tagged) as an externally-validated build list: intermediate → Ansible config mgmt, Terraform IaC, automated DB backups, bastion host; advanced → blue-green deploy, Prometheus+Grafana, service discovery (the beginner tier lives in the Fundamentals index's Capstone)
  - 📚 [roadmap.sh DevOps projects](https://roadmap.sh/devops/projects) · [roadmap.sh AWS projects](https://roadmap.sh/aws/projects) · [roadmap.sh DevOps roadmap](https://roadmap.sh/devops)

### The mid-level promise

> "Junior does tasks; mid owns systems. Junior knows tools; mid knows failure modes. Junior follows runbooks; mid writes them."

---

## 📊 Market Reality Check — what's actually in demand (2025–26 data)

> Everything below is from real market sources fetched 2026-08: SalaryExpert/ERI, Glassdoor India, AmbitionBox, Stack Overflow Developer Survey 2025, DORA, CNCF, and India-specific job-market reports (Pune + remote). Ranges are indicative, not gospel.

### Pune, India (your home market)

| Level | Range (LPA) | Sources |
| --- | --- | --- |
| Fresher (0–2 yrs) | ₹3.6–8 | devopstraininginstitute 2025 · SalaryExpert entry ₹15.9L (1–3 yrs) |
| Mid (2–5 yrs) | ₹8–15 | devopstraininginstitute · Lavatech · Glassdoor India (90th pct ₹16.5L) |
| Senior (5–8 yrs) | ₹15–25 | devopstraininginstitute · SalaryExpert senior ₹25.9L |
| Lead/Architect (8+) | ₹23–30+ | devopstraininginstitute |
| Freelance | ₹800–3,000/hr | devopstraininginstitute · switchtodevops |

**Pune facts:** ~450k tech professionals · 25% YoY growth in DevOps openings · hubs: Hinjewadi 50% / Magarpatta 30% / Kharadi 15% · certs (AWS DevOps, CKA) add ~20–30% · Kubernetes/Terraform skills add ~20–30% · big hirers: TCS, Infosys, Accenture, Capgemini, IBM, HCL, Amdocs, ZS, Barclays, PhonePe.

### Remote India

| Level | Range (LPA) | Notes |
| --- | --- | --- |
| Fresher | ₹4–8 | fully-remote rare; most want 1+ yr |
| Mid (2–5 yrs) | ₹10–22 | **the sweet spot** — most openings |
| Senior (5–8 yrs) | ₹20–40 | often international |
| Lead/Architect | ₹35–70 | full-remote flexibility |
| International remote | $40k–90k (₹33–75L) | GitLab, HashiCorp, Confluent, Elastic, Automattic |

Remote pays ~5–15% less than metro on-site, but a net win after commute/relocation. ~40% of India DevOps roles now have remote flexibility; fully remote ~15–20% and growing ~25% YoY. Top remote employers (reported ranges): GitLab ₹25–55L · HashiCorp ₹30–60L · Confluent ₹28–55L · Elastic ₹26–50L · Razorpay ₹18–42L · Postman ₹20–45L.

### International (what the same skills pay elsewhere)

- **US (ERI/SalaryExpert 2026):** Denver ~$133k · New York-Manhattan ~$142k · Raleigh ~$129k — DevOps/SRE mid-level
- **Stack Overflow 2025 (49k+ respondents, 177 countries):** 32.4% fully remote (US 45%) · **Terraform = most admired/desired infra tool** · GitHub top collaboration tool, GitLab #3 · India = 3rd-largest respondent base · 84% use AI tools
- **DORA:** the industry's canonical model = Four Key Metrics + SLOs — exactly what M04/M06 teach
- **CNCF 2024 survey:** ~1/4 of orgs run nearly all workloads cloud-native; Kubernetes is the default platform

### Skills that command premium pay (from India market data)

| Skill | Premium | Where it lives in this index |
| --- | --- | --- |
| Kubernetes production experience | required in ~90% of remote roles | M01 |
| Terraform / IaC | "non-negotiable" | M02 |
| GitOps (Argo CD) | ~+30% | M05 |
| Service mesh (Istio/Linkerd) | ~+30% | M01 |
| Observability stack (Prometheus/Grafana) | core | M04 |
| DevSecOps / security automation | ~+30% | M08 |
| Multi-cloud | ~+30% | M03 |
| Jenkins + GitLab CI | core must-have (India enterprise) | M05 |
| Ansible | core must-have (India enterprise) | M07 |

### 🧭 Community cross-check: roadmap.sh (2026)

roadmap.sh is the community-standard path — **364K GitHub stars** (6th most-starred repo), 2.8M users, 58K+ people tracking its DevOps roadmap. Its DevOps roadmap literally covers *"DevOps, SRE or any other Operations Role"* (the `/sre` page 404s; SRE lives inside DevOps). **Our indexes already mirror its structure** — every roadmap.sh topic (languages → Linux → networking → Docker → cloud → IaC → config mgmt → CI/CD → observability) is in Fundamentals or MidLevel.

**Full-inventory verified** from the repo's content files (`roadmaps/<slug>/content/`, master branch): DevOps ~95 topics · Kubernetes ~68 · AWS ~105 · Terraform ~130 · DevSecOps ~95 — every topic name cross-checked against this index below.

| Area | roadmap.sh has | We have | Market need |
| --- | --- | --- | --- |
| Languages | Python, Go, Rust, JS/Node | Python + Bash (M07) | Python **mandatory** · Go **optional** (read-level) |
| k8s autoscaling | HPA + VPA + Cluster Autoscaler | HPA (M01) | HPA mandatory · VPA/CA **optional** |
| k8s scheduling | taints, topology spread, priorities, evictions | taints + PDBs + quotas (M01) | basics mandatory · advanced **optional** |
| IaC | Terraform + CDK + CloudFormation + Pulumi | Terraform + OpenTofu (M02) | Terraform **mandatory** · CFN/CDK **optional** (AWS-shop dependent) |
| Config mgmt | Ansible, Chef, Puppet | Ansible (M07) | Ansible **mandatory** (India) |
| CI/CD | GH Actions, GitLab CI, Jenkins, CircleCI | GH Actions + Jenkins + GitLab CI (M05) | all three **mandatory** (India) |
| Secrets | Sealed Secrets, Vault | Vault + SOPS (M08) | **mandatory** at scale |
| Security | DevSecOps roadmap (SBOM, Zero Trust, IR) | Trivy, Kyverno, SLSA, Vault (M08) | DevSecOps ~**+30% premium** |
| k8s extensions | CRDs, Operators, custom controllers | 🟡 now in M01 (Extensions & Operators) | **recommended** — unlocks how GitOps/observability tools work |
| Terraform depth | testing, Checkov/Terrascan, Terragrunt | 🟡 now in M02 (quality gates) | scanning **mandatory** for DevSecOps; Terragrunt optional |
| AWS containers | ECS/Fargate, ECR, API Gateway, DynamoDB | 🟡 now in M03 | **common in India** — ECS often beats EKS for teams |
| Security model | threat modeling, Zero Trust, SOC 2/ISO 27001 | 🟡 now in M08 | **interview + enterprise hiring** signal |
| Projects | DevOps project ladder (beginner→advanced) | Portfolio module (M09) | **recommended** — community-validated builds |

🟡 = optional / good-to-have — everything else is core. Tracking links: [DevOps](https://roadmap.sh/devops) · [Kubernetes](https://roadmap.sh/kubernetes) · [AWS](https://roadmap.sh/aws) · [DevSecOps](https://roadmap.sh/devsecops) · [Projects](https://roadmap.sh/devops/projects)

### Sources

SalaryExpert/ERI (Aug 2026) · Glassdoor India · devopstraininginstitute.com Pune report (Oct 2025) · Lavatech Pune guide (Jan 2026) · switchtodevops.com Remote DevOps India 2026 · Stack Overflow Developer Survey 2025 · DORA research · CNCF Annual Survey 2024.

**Total cost: $0 · Total time: ~8–12 weeks part-time (after the fundamentals index) · All links free & community/industry-preferred.**
