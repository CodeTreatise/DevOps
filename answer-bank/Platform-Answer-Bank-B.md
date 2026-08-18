# 🎯 Platform Engineering — Model Answer Bank (Phase B: Mid-Level Depth)

> **How to use:** read the question → answer it out loud or in writing → expand **Reveal model answer** → self-grade 1/2/3. A 1–2 means re-study that module's items and revisit in 2 days (spaced repetition). Phase B = the operating depth layer: you don't just deploy, you operate, debug, and own. Generated from `Platform-Engineering-Path.json` research blocks.
>
> **Rubrics:** 🟥 1 = can't answer / wrong · 🟧 2 = partial, correct with gaps · 🟩 3 = confident, complete, production-aware.

## 📖 Contents

- [B01 Kubernetes — operate, don't deploy](#b01-kubernetes--operate,-don't-deploy)
- [B02 Terraform & IaC — state & modularity](#b02-terraform-&-iac--state-&-modularity)
- [B03 Cloud (AWS) — VPC, IAM, cost](#b03-cloud-(aws)--vpc,-iam,-cost)
- [B04 Observability depth — SLOs & traces](#b04-observability-depth--slos-&-traces)
- [B05 CI/CD as a product — GitOps & canary](#b05-ci/cd-as-a-product--gitops-&-canary)
- [B06 Reliability craft — incidents & chaos](#b06-reliability-craft--incidents-&-chaos)
- [B07 Automation — idempotent scripts](#b07-automation--idempotent-scripts)
- [B08 Ownership — on-call & runbooks](#b08-ownership--on-call-&-runbooks)
- [B09 Mid interview prep + portfolio upgrade](#b09-mid-interview-prep-+-portfolio-upgrade)

## B01 Kubernetes — operate, don't deploy

### Workloads & objects

<details>
<summary>❓ Q1: Pod vs Deployment vs StatefulSet vs DaemonSet vs Job/CronJob — when do you choose each?</summary>

**Model answer:** Deployment: stateless replicas behind a Service — the default for web/API workloads. StatefulSet: stable identity, stable storage (PVC per replica), ordered scaling/updates — for databases, message brokers, anything with persistent identity. DaemonSet: exactly one pod per node — agents (node-exporter, kube-proxy, log collectors, CNI). Job: run-to-completion batch work (one-off); CronJob: scheduled batch (nightly backups, cleanup). Rule of thumb: stateless → Deployment; stateful with identity → StatefulSet; per-node daemon → DaemonSet; finishes → Job; on a schedule → CronJob.

**Rubric:** 1 = names the types. 2 = maps each to a correct workload class. 3 = explains StatefulSet's stable identity/ordering and picks from real tradeoffs (e.g. 'DB in a Deployment' as an anti-pattern).

**Why asked:** Kubernetes fundamentals are 30% of B01 — the 'which object' question separates people who read docs from people who run workloads.
</details>


<details>
<summary>❓ Q2: What are init containers for? Give a real example.</summary>

**Model answer:** Init containers run to completion BEFORE the main container starts, sequentially, in the same pod (shared network + volumes). Use cases: wait-for-dependency (e.g. wait for a DB to accept connections), fetch/transform data into a shared volume, set up permissions, run migration scripts once. Real example: an app pod that needs a config file generated from a template — an init container renders the file into an emptyDir volume, the main container reads it; or a 'wait-for-migrate' init that polls a migration Job's status before the app starts.

**Rubric:** 1 = knows they run before the main container. 2 = explains sequencing + shared volumes. 3 = gives a real wait-for/seed example and the failure semantics (pod restarts on init failure).

**Why asked:** Init containers test whether you understand pod lifecycle and real startup ordering problems — a frequent whiteboard question.
</details>


<details>
<summary>❓ Q3: requests vs limits — what's the QoS model and what happens when a pod exceeds its limits?</summary>

**Model answer:** requests = what the scheduler reserves (guaranteed capacity); limits = what the pod may NOT exceed. Three QoS classes: Guaranteed (requests == limits for all containers), Burstable (requests < limits), BestEffort (no requests/limits). CPU is compressible: exceeding the limit throttles (100ms quota windows), no kill. Memory is NOT compressible: exceeding the limit → OOMKill (the kernel kills a container). If limits are set but requests omitted, Kubernetes copies the limit to the request (making it Guaranteed) unless a LimitRange default applies; if requests are set but limits omitted, the limit stays unset (bounded by node capacity — Burstable). The answer to watch: memory over-limit = OOM kill, CPU over-limit = throttle, and QoS class determines eviction priority under node pressure.

**Rubric:** 1 = defines requests vs limits. 2 = names Guaranteed/Burstable/BestEffort. 3 = explains CPU-throttle vs memory-OOMKill and eviction order by QoS.

**Why asked:** QoS is the single most common resource question — misconfiguring memory limits is the top cause of OOMKilled incidents.
</details>


<details>
<summary>❓ Q4: A pod is CrashLoopBackOff — walk me through your diagnosis (describe, events, logs, probes)</summary>

**Model answer:** Order: `kubectl describe pod <name>` first — events show the LAST failure reason (ImagePullBackOff, OOMKilled, probe failure, invalid spec). Then `kubectl logs <pod> --previous` — the crashed container's last output (CrashLoopBackOff = the container starts then dies repeatedly; the current log may be empty). Check `kubectl get events --sort-by=.lastTimestamp`. Then categorize: (1) app error at startup → read logs; (2) OOMKilled → memory limit too low, `kubectl describe` shows 'Killed' reason; (3) liveness probe failing → app not ready for the probe threshold, check probe path/port; (4) init container failing → check init logs. Never restart blindly — the crash reason is in the previous log.

**Rubric:** 1 = says 'check logs'. 2 = orders describe → logs --previous → events. 3 = distinguishes OOMKilled vs probe vs app-error and reads the right artifact per symptom.

**Why asked:** CrashLoopBackOff is the most common real-world k8s incident — this question tests the actual debugging loop, not memorized flags.
</details>


### Operating the cluster

<details>
<summary>❓ Q1: Control plane vs nodes — name the components and what each does (apiserver, scheduler, controller-manager, etcd | kubelet, kube-proxy, runtime)</summary>

**Model answer:** Control plane: etcd (the cluster's source of truth — key-value store of all objects), kube-apiserver (the only entry point — REST API, authn/authz, admission; everything talks to it), kube-scheduler (decides which node a new pod goes to, based on resource requests, affinities, taints), kube-controller-manager (runs controller loops — Deployment, ReplicaSet, endpoints, node-lifecycle etc., reconciling desired vs current). Nodes: kubelet (the node agent — talks to the apiserver, starts/stops containers, reports status, runs probes), kube-proxy (implements Service networking — iptables/ipvs rules for ClusterIP load-balancing), container runtime (containerd etc. — actually runs the containers). The key mental model: apiserver is the front door; everything else reads/writes through it.

**Rubric:** 1 = names 2-3 components. 2 = lists all with one-line duties. 3 = explains apiserver-centrality (nothing bypasses it) and the kubelet→apiserver control loop.

**Why asked:** Control plane anatomy is the B01 opener — a flawless list with the apiserver-centric model signals real cluster experience.
</details>


<details>
<summary>❓ Q2: What does cordon + drain do and why use a PodDisruptionBudget first?</summary>

**Model answer:** cordon marks a node unschedulable (no NEW pods) but leaves existing ones running. drain evicts all pods from a node (also cordons it), preparing for maintenance/decommission. Drain refuses to evict pods without a controller (bare pods) or with a local PV unless forced. PodDisruptionBudget (PDB): declares 'at least N replicas must remain available' (minAvailable or maxUnavailable) — drain respects PDBs and blocks eviction if it would violate them, so you don't lose all replicas of a service during node maintenance. Order: set the PDB → cordon → drain → maintenance → uncordon. Why PDB first: without it, a rolling node replacement can take a service fully down.

**Rubric:** 1 = defines cordon/drain. 2 = explains PDB concept. 3 = gives the full sequence and the graceful-degradation reasoning.

**Why asked:** Maintenance questions reveal whether you've actually operated clusters — the PDB-first ordering is the senior tell.
</details>


<details>
<summary>❓ Q3: Taints & tolerations vs nodeSelector vs nodeAffinity — when is each appropriate?</summary>

**Model answer:** nodeSelector: hard constraint — pod only lands on nodes with a matching label (simple, coarse). nodeAffinity: richer version — requiredDuringScheduling (hard) or preferredDuringScheduling (soft), with matchExpressions. Taints (on nodes) + tolerations (on pods): 'repel' — a node with a taint only accepts pods that tolerate it. Use taints to reserve node pools (GPU nodes tainted so only GPU workloads land there; control-plane nodes). Affinity is pull-based (pod asks for a node); taints are push-based (node refuses). Combine: dedicated pools = taint + toleration + (optionally) nodeAffinity to spread. Rule: exact label match → nodeSelector; richer conditions/soft preferences → nodeAffinity; keep workloads off a pool → taints/tolerations.

**Rubric:** 1 = defines the three. 2 = contrasts hard/soft affinity. 3 = explains push vs pull model and the GPU/control-plane taint use case.

**Why asked:** Scheduling control is where k8s ops get practical — this distinguishes declarative config users from planners.
</details>


<details>
<summary>❓ Q4: A node is unhealthy — how do you detect it and evacuate workloads safely?</summary>

**Model answer:** Detection: `kubectl get nodes` shows NotReady after the node controller's timeout (default ~40s to mark, ~5m to evict); `kubectl describe node` shows conditions (Ready, MemoryPressure, DiskPressure, PIDPressure) and heartbeats. kubelet reports status/leases; check node-exporter/kubelet metrics for CPU/mem/disk. Evacuate safely: 1) verify the node isn't part of a healthy pool doing a normal restart; 2) cordon it (no new pods); 3) drain with a PDB in place so eviction respects availability; 4) if the node is unreachable (apiserver can't talk to kubelet), pods are force-deleted after the eviction timeout and rescheduled elsewhere — that's the node-lifecycle controller's job. For a hard-down node, don't fight it: cordon, let controllers reschedule pods on remaining nodes, then investigate the node itself (SSH/console, kubelet logs, disk full).

**Rubric:** 1 = checks kubectl get nodes. 2 = uses conditions + cordon/drain. 3 = explains the eviction-timeout path and PDB-aware draining.

**Why asked:** Node failure handling separates operators from deployers — the evacuation order is what's graded.
</details>


<details>
<summary>❓ Q5: Cluster upgrades: how would you upgrade a self-managed cluster without downtime?</summary>

**Model answer:** Principle: never upgrade control plane and data plane at the same time; keep one version gap max (k8s supports n-2). Steps: 1) check upgrade notes/deprecated APIs (`kubectl convert` or kubeconform for manifests); 2) back up etcd (snapshot + restore drill) — this is your rollback; 3) upgrade control plane one node at a time (or in-place if single control node, accepting brief API unavailability); 4) verify apiserver + etcd health; 5) upgrade nodes: drain each node (with PDBs), upgrade kubelet/kubeadm, uncordon, move to the next; 6) roll out node-by-node so workloads stay available. Extra: upgrade a spare node first as a canary, watch workloads, then continue. Never 'upgrade everything at once' — the graceful path is sequential with verification gates.

**Rubric:** 1 = says 'drain nodes'. 2 = mentions etcd backup + version gap. 3 = gives the full sequential control-plane-then-nodes flow with canary + rollback.

**Why asked:** Upgrade questions test operational maturity — the etcd-backup-first and one-version-gap answers are the senior markers.
</details>


<details>
<summary>❓ Q6: etcd backup & restore — how do you snapshot etcd and restore a cluster from it (etcdctl snapshot save/restore, frequency, off-cluster storage)?</summary>

**Model answer:** etcd is the cluster's source of truth — losing it without a backup = losing the cluster. Backup: `etcdctl snapshot save` against a member (kubeadm-managed: etcdctl from the static-pod; EKS managed: automatic but verify). Frequency: every cluster change that matters or daily minimum — snapshots are cheap; keep N (e.g. 7 daily + weekly) off-cluster (S3/object store, encrypted). Restore: stop API server + etcd, `etcdctl snapshot restore <file> --data-dir=<dir>` (creates a new member with new cluster ID), point the etcd manifest's data-dir at it, restart, verify with `etcdctl endpoint health` + `kubectl get nodes`. Practice restores — a snapshot you never restored is a rumor. Also: backup the PKI/certs alongside (restore needs them), and remember restore = last-resort rollback (you lose changes after the snapshot).

**Rubric:** 1 = mentions snapshot save. 2 = frequency + off-cluster storage + restore steps. 3 = restore drill + PKI + last-resort-rollback framing.

**Why asked:** etcd backup is the CKA 'backup and restore' objective and the classic 'we lost the control plane' incident — a concrete drill answer is the senior tell.
</details>


### Debugging & failure modes

<details>
<summary>❓ Q1: Pod stuck Pending — enumerate every cause and how you'd confirm each (describe events first)</summary>

**Model answer:** Pending = scheduler hasn't placed it or can't. `kubectl describe pod` events first — the scheduler writes reasons there. Causes: 1) insufficient resources (requests > node capacity) → '0/5 nodes are available: insufficient cpu' — check requests vs allocatable, add nodes or lower requests; 2) unschedulable node (taints, cordon) → 'node(s) had untolerated taint' — tolerate or fix the taint; 3) nodeSelector/affinity matches nothing; 4) PVC not bound (PV pending) → event 'pod has unbound immediate PersistentVolumeClaims'; 5) image pull problems don't cause Pending (that's ImagePullBackOff after scheduling); 6) scheduler not running / no nodes. Confirm with `kubectl describe`, `kubectl get nodes`, `kubectl get pvc`, and check events for the exact reason string.

**Rubric:** 1 = names 'not enough resources'. 2 = lists 3-4 causes with event strings. 3 = ties each cause to its exact event message and fix.

**Why asked:** Pending is the classic 'read the events' question — interviewers want the event-first discipline.
</details>


<details>
<summary>❓ Q2: ImagePullBackOff vs CrashLoopBackOff vs OOMKilled — distinct diagnoses for each</summary>

**Model answer:** ImagePullBackOff: the container runtime can't pull the image — wrong tag/name, registry auth failure, registry unreachable, or (on kind/minikube) image not present locally. Fix: check `kubectl describe` events for the pull error, fix image reference/credentials. CrashLoopBackOff: image pulled fine, container starts then exits repeatedly — app error, bad config, missing dependency, or a probe killing it. Fix: `kubectl logs --previous`. OOMKilled: container exceeded its memory limit (or node memory) — the kernel killed it. Fix: `kubectl describe` shows 'OOMKilled' in lastState; raise the limit, reduce the app's memory, or add memory limits to neighbors. They can cascade: an image that starts fine but immediately dies on bad config is CrashLoopBackOff; if that process allocates memory it can become OOMKilled.

**Rubric:** 1 = knows the three states exist. 2 = gives one cause each. 3 = distinguishes by evidence (events vs logs vs lastState) and handles cascades.

**Why asked:** This is the k8s triage trifecta — a favorite scenario question with a clear evidence-based answer.
</details>


<details>
<summary>❓ Q3: Service not reachable from outside — check ordering: pod → endpoints → service → ingress → DNS → security group</summary>

**Model answer:** Walk layers bottom-up: 1) pod running? (`kubectl get pods`, describe, logs); 2) endpoints populated? (`kubectl get endpoints` — if empty, selector mismatch, or pod not Ready); 3) Service correct? (type, ports, selector — `kubectl describe svc` shows Endpoints field); 4) Ingress exists and routes? (host/path rules, TLS, ingress controller running); 5) DNS: does the name resolve (`nslookup`, `dig`, or test the Service IP directly with curl); 6) external: security group / firewall allows the port, LoadBalancer created, nodePort reachable. Key gotchas: empty endpoints from selector typos, Service pointing at non-Ready pods, ingress controller not deployed, SG not updated after adding a port.

**Rubric:** 1 = checks pod logs. 2 = follows pod→svc→ingress order. 3 = uses endpoints as the selector check and covers DNS + security groups with the empty-endpoints gotcha.

**Why asked:** Connectivity debugging is the #1 real incident type — the ordered walk-through is exactly what operators do.
</details>


<details>
<summary>❓ Q4: How do you debug DNS inside the cluster (CoreDNS, nslookup, /etc/resolv.conf)?</summary>

**Model answer:** Cluster DNS is CoreDNS — every pod's resolv.conf points at the CoreDNS ClusterIP (kube-dns service). Debug: 1) verify CoreDNS pods Running (`kubectl get pods -n kube-system -l k8s-app=kube-dns`); 2) run a debug pod: `kubectl run tmp --rm -it --image=busybox -- nslookup <svc>` — or `nslookup <svc>.<namespace>.svc.cluster.local` (fully-qualified, bypasses search domains); 3) check /etc/resolv.conf in a pod (search domain, nameserver = ClusterIP); 4) if external DNS fails but internal works → upstream forwarding issue in CoreDNS Corefile; 5) if only some namespaces fail → Service/headless service or endpoint issues; 6) check CoreDNS logs + metrics for QPS/errors. Common gotchas: DNS timeout from bad dnsPolicy, `resolv.conf` search domains causing NXDOMAIN on short names.

**Rubric:** 1 = knows CoreDNS is the resolver. 2 = runs a debug pod with nslookup FQDN. 3 = distinguishes internal vs external resolution and checks CoreDNS logs/Corefile.

**Why asked:** DNS is the most-debugged k8s layer — a clean mental model here is a strong signal.
</details>


### Scheduling & resources

<details>
<summary>❓ Q1: How does the scheduler pick a node — filtering, scoring, and what data does it use?</summary>

**Model answer:** Two phases: filtering (feasibility) then scoring (preference). Filtering removes nodes that can't run the pod: insufficient resources (requests vs allocatable), taints without tolerations, nodeSelector/affinity mismatch, port conflicts, volume zone/availability, node unschedulable (cordon). Scoring ranks remaining nodes: resource fit (most-requested ratio), topology spread, node affinity preferences, pod anti-affinity, image locality (node already has the image), node age/pressure. Data: node status (capacity, allocatable, conditions), pod specs (requests, affinity, tolerations), and the scheduler cache. Result: highest-scoring node wins (ties broken by round-robin). The scheduler never sees actual runtime usage — only requests.

**Rubric:** 1 = says 'filters and scores'. 2 = names filter examples (resources, taints). 3 = explains requests-not-usage, image locality, and scoring tradeoffs.

**Why asked:** Scheduler internals test depth beyond kubectl apply — a strong answer implies you understand WHY pods land where they do.
</details>


<details>
<summary>❓ Q2: Why is a pod stuck Pending — top causes and how events reveal the answer</summary>

**Model answer:** Pending means the scheduler hasn't assigned it. Top causes, each with its event line: insufficient CPU/memory ('0/N nodes are available: insufficient cpu'), tainted nodes with no toleration ('untolerated taint'), nodeSelector/affinity matching nothing, unbound PVC, scheduler disabled on the node (cordon), or no Ready nodes. Events (kubectl describe pod) print the exact scheduler reason — always read events before guessing. Also check `kubectl get events -n <ns> --sort-by=.lastTimestamp` for history. The fix path: read reason → fix the constraint (raise capacity, add toleration, fix selector, bind the PVC) → the pod schedules without manual intervention.

**Rubric:** 1 = knows Pending = unscheduled. 2 = lists resource/taint/PVC causes. 3 = reads the exact event string and maps each to its fix.

**Why asked:** Duplicate-topic questions in one module are deliberate — interviewers ask 'Pending' repeatedly; the events-first answer is the consistent one.
</details>


<details>
<summary>❓ Q3: HPA vs VPA vs Cluster Autoscaler vs Karpenter — what does each scale and what are the limits?</summary>

**Model answer:** HPA (Horizontal Pod Autoscaler): scales POD COUNT by metric (CPU/memory/custom/external) — the default for stateless services; limits: scale-to-zero not native, needs metrics server, metrics can lag. VPA (Vertical Pod Autoscaler): scales REQUESTS/LIMITS of existing pods (recommends and restarts pods) — for stateful or hard-to-shard workloads; limits: requires pod restart, mutating admission, no support with HPA on the same metric, burst can't exceed node. Cluster Autoscaler: scales NODES (adds/removes based on pending pods) at the cluster level — cloud-specific node groups; limits: slow (minutes), node group granularity, can't mix with Karpenter on same pool. Karpenter: node provisioning — fast, bin-packing, instance-type-aware, works with AWS/Azure; limits: newer, provider-specific. Layers compose: HPA handles pod count, CA/Karpenter handles node count.

**Rubric:** 1 = names the four. 2 = maps each to pod vs node scaling. 3 = explains composition (HPA+CA), VPA restart cost, Karpenter bin-packing.

**Why asked:** Autoscaling is the layering test — 'what scales what' shows you understand the stack, not just the tools.
</details>


<details>
<summary>❓ Q4: requests vs limits: why set requests low but limits high, or match them? What breaks if you omit them?</summary>

**Model answer:** Requests low + limits high (Burstable): good utilization — scheduler packs by requests, bursts allowed up to limits; risk: one pod can throttle/OOM-neighbor under contention. Requests == limits (Guaranteed): predictable, but wastes headroom (you reserve everything). Omitting requests: scheduler can overpack a node → CPU starvation, memory pressure, evictions; omitting limits: a runaway process can consume the whole node (memory → OOMKill of neighbors; CPU → everyone throttled). Practical defaults: always set both; requests = typical steady-state, limits = max acceptable; for latency-sensitive services match them (Guaranteed); for batch/elastic, low requests + high limits. Nothing breaks immediately on omission — it breaks at scale/contention.

**Rubric:** 1 = defines requests/limits. 2 = contrasts Burstable vs Guaranteed. 3 = explains exactly what breaks when omitted (node starvation, neighbor OOM) and gives a default policy.

**Why asked:** This drills the earlier QoS question from the policy angle — what would you actually set in production.
</details>


<details>
<summary>❓ Q5: Topology Spread Constraints and node affinity — when do you need them?</summary>

**Model answer:** Topology Spread Constraints: spread replicas across topology domains (zones, nodes) to survive a domain failure and balance load — needed for HA (e.g. 3 replicas across 3 AZs) and to avoid all replicas landing on one node. Node affinity: attract pods to specific node attributes (GPU pool, SSD nodes, region) — needed for placement requirements. Together they answer 'where do I WANT pods' (affinity) vs 'how do I spread them' (spread). Use spread when availability matters; use affinity when hardware/zone matters; they combine naturally (spread across zones, affinity to a GPU-labeled zone).

**Rubric:** 1 = knows spread ≈ distribution. 2 = separates spread (HA) from affinity (placement). 3 = gives a concrete AZ-failure scenario where spread saved the day.

**Why asked:** HA questions distinguish checklist memorizers from architects — spread constraints are the production HA answer.
</details>


<details>
<summary>❓ Q6: AI/GPU workloads: how do scheduling needs change for GPU inference (vLLM) vs CPU apps — node pools, bin-packing, limits?</summary>

**Model answer:** GPU nodes are expensive and scarce → isolate them with taints/tolerations so CPU apps never land there; use node pools per GPU type (A10 vs A100) with nodeAffinity. GPUs are requested via `nvidia.com/gpu` resource — a whole GPU is allocated (no sharing by default; MIG/Time-Slicing for sharing). Bin-packing matters: GPU is the scarce resource, so fit as many models as possible per node (vLLM's continuous batching makes this efficient) — Karpenter/CA with GPU-aware bin-packing. Limits: set memory limits carefully — vLLM preallocates KV cache; OOM kills are disruptive. Requests == limits for GPU pods (Guaranteed) to avoid oversubscription. Consider topology: NVLink/NUMA affinity for multi-GPU inference.

**Rubric:** 1 = says 'GPU nodes are special'. 2 = explains nvidia.com/gpu + taints. 3 = discusses bin-packing, MIG/sharing, KV-cache memory, and pool isolation.

**Why asked:** GPU inference scheduling is the emerging premium k8s question — India job data flags it as a differentiator.
</details>


### Security & RBAC

<details>
<summary>❓ Q1: How do RBAC roles, RoleBindings, ClusterRoles, and ClusterRoleBindings differ? Give a least-privilege example</summary>

**Model answer:** Role: namespaced permission set (verbs + resources + apiGroups). RoleBinding: binds a Role to subjects (users/groups/SAs) WITHIN a namespace. ClusterRole: cluster-wide permission set (or reusable across namespaces). ClusterRoleBinding: binds cluster-wide. Least-privilege example: give a CI service account read-only access to one namespace's pods + deployments: Role {apiGroups: [''], resources: ['pods','deployments'], verbs: ['get','list','watch']} in ns 'ci', RoleBinding {subjects: [ServiceAccount 'ci-bot'], roleRef: that Role}. Use ClusterRoles only when truly cluster-scoped (node ops, cluster-admin, or a Role reused via RoleBinding across namespaces).

**Rubric:** 1 = knows Role vs ClusterRole. 2 = explains the binding pair + namespaces. 3 = writes a correct minimal example and warns against cluster-admin defaults.

**Why asked:** RBAC is the security fundamentals question — least-privilege writing is the graded skill.
</details>


<details>
<summary>❓ Q2: ServiceAccounts: why do pods need one and what happens with automountServiceAccountToken?</summary>

**Model answer:** Every pod has a ServiceAccount — its identity when talking to the API server. The apiserver authenticates via a JWT that the kubelet mounts at /var/run/secrets/kubernetes.io/serviceaccount/token, plus CA and namespace. Default SA is 'default' with no permissions (except token review) — but the token is still mounted, so any pod can authenticate as its SA. automountServiceAccountToken: false on the pod or SA disables the mount — do this for pods that never call the API (reduces token exposure; supply-chain attacks often steal these tokens). For pods that DO need API access, create a dedicated SA + RoleBinding with the minimum verbs. Also: projected token with audience + expiry is the modern pattern; OIDC federation lets workloads exchange k8s tokens for cloud creds.

**Rubric:** 1 = knows pods get a token. 2 = explains default SA + automount. 3 = covers dedicated SAs, token rotation/projection, and disabling automount for API-free pods.

**Why asked:** SA token theft is a real attack path — this question tests security awareness beyond RBAC syntax.
</details>


<details>
<summary>❓ Q3: Pod Security Standards (baseline vs restricted) — how do you enforce them?</summary>

**Model answer:** Pod Security Standards (PSS) define three profiles: privileged (no restrictions), baseline (defaults: no privileged containers, no hostPID/IPC/network, no hostPath except whitelist, drop ALL capabilities, no hostPorts, seccomp not required), restricted (tightest: read-only root FS, seccomp RuntimeDefault, no allowPrivilegeEscalation, capabilities limited to NET_BIND_SERVICE, non-root + specific runAsUser). Enforce via Pod Security Admission (PSA) — the built-in admission controller — with labels on namespaces: pod-security.kubernetes.io/enforce=restricted (warn/audit are softer modes). PSA replaces the deprecated PodSecurityPolicy (PSP). Enforcement happens at admission: a violating pod is rejected (enforce), warned, or audited. For GitOps: keep namespaces labeled; run most workloads under restricted, escalate to baseline only when needed.

**Rubric:** 1 = knows PSS exists. 2 = contrasts baseline vs restricted. 3 = explains PSA labels + enforce/warn/audit and the PSP deprecation.

**Why asked:** Pod security is a must-know in 2026 — PSA labels are the practical enforcement mechanism.
</details>


<details>
<summary>❓ Q4: Secrets: how are they stored in etcd and what are the real-world options (encryption at rest, External Secrets)?</summary>

**Model answer:** By default secrets are base64-encoded in etcd — NOT encrypted (base64 ≠ encryption; anyone with etcd access reads them). First real option: enable encryption at rest — kube-apiserver encrypts secrets in etcd with AES-GCM/KMS keys (--encryption-provider-config; KMS v2 with cloud KMS is the modern way). Second: reduce what's in etcd — use External Secrets Operator (syncs from Vault/AWS Secrets Manager/GCP SM into k8s Secrets), SOPS (encrypts secret manifests in Git, decrypted at apply), or Sealed Secrets (public-key encrypt manifests; only the cluster's controller can decrypt). Layering: encrypt at rest (defense in depth) + don't store raw secrets in Git (SOPS/ESO) + RBAC on secret access + audit logs.

**Rubric:** 1 = knows base64 ≠ encryption. 2 = mentions encryption-at-rest config. 3 = explains ESO/SOPS/Sealed Secrets tradeoffs and the layered approach.

**Why asked:** Secret handling is an instant credibility check — 'base64 is not encryption' is the line they're listening for.
</details>


### Network policies & service mesh

<details>
<summary>❓ Q1: How do NetworkPolicies work — pod selectors, ingress/egress, default-deny vs allow-all?</summary>

**Model answer:** NetworkPolicy is an object that filters pod-to-pod traffic at the CNI level (Calico/Cilium implement it; some CNIs don't). Structure: podSelector (which pods), policyTypes (Ingress/Egress), ingress rules (from: podSelector/namespaceSelector/ipBlock + ports), egress rules (to: + ports). Semantics: empty selector matches ALL pods in the namespace; rules are OR'd; the default is allow-all unless a policy selects the pod — so the pattern is 'default-deny by selecting everything, then allow specific flows'. Critical gotchas: policy must be in the same namespace; no policy = allow all; DNS egress needs an explicit rule (allow egress to CoreDNS IP/namespace:53) or everything breaks; cluster-scoped services and nodePorts need ipBlock rules.

**Rubric:** 1 = knows it filters pod-to-pod. 2 = explains podSelector + ingress/egress. 3 = covers default-deny pattern, DNS gotcha, and CNI dependency.

**Why asked:** NetworkPolicy is the zero-trust microsegmentation primitive — the DNS gotcha is what makes it a senior question.
</details>


<details>
<summary>❓ Q2: Istio vs Linkerd: sidecar model, mTLS, traffic shifting — when would you adopt a mesh?</summary>

**Model answer:** Both inject a sidecar proxy into each pod. Istio (Envoy): full-featured — mTLS, traffic shifting (weighted canary, fault injection), rich observability (distributed tracing, metrics), gateway-based ingress, request routing by header. Heavy: ~30-80MB+ memory per sidecar, adds latency. Linkerd (its own Rust-based proxy): lighter (~10-20MB), simpler, fast — mTLS, golden metrics (success rate, latency), retries/timeouts, some traffic split; less deep routing. Adopt a mesh when you need: automatic mTLS everywhere (zero-trust), consistent metrics/tracing across many services, or canary/weighted routing as a standard practice. Skip it for small clusters, or when NetworkPolicies + app-level TLS + existing tracing suffice — the cost (memory, latency, ops) rarely pays off under ~20-30 services.

**Rubric:** 1 = knows both are sidecar meshes. 2 = contrasts weight/features. 3 = gives adoption criteria (mTLS everywhere, service count) and the cost math.

**Why asked:** Service mesh is a premium B01 topic in the India data — the 'when is it overkill' half is the differentiator.
</details>


<details>
<summary>❓ Q3: What's the cost of a service mesh (latency, ops, resource)? When is it overkill?</summary>

**Model answer:** Costs: resource — Istio sidecar ~0.5-1 vCPU + 50-100MB per pod (Linkerd ~half); latency — every packet crosses the sidecar (L4 proxy adds ~0.5-2ms p99, plus TLS overhead); ops — upgrading the mesh, certificate rotation, debugging 'why is my traffic different', sidecar lifecycle, mesh config drift; complexity — control plane upgrades, ambient/CNI modes to learn. Overkill when: small fleet (<~20 services), single region, no compliance demand for universal mTLS, existing observability is fine, or teams lack the SRE capacity to run the control plane. The honest senior answer: start with NetworkPolicies + app-level mTLS + OpenTelemetry; add a mesh only when a concrete need (per-service mTLS, weighted canary at scale, mesh-wide tracing) justifies the tax.

**Rubric:** 1 = mentions latency/resource cost. 2 = quantifies sidecar overhead. 3 = gives the threshold logic (service count, mTLS need) and a cheaper alternative path.

**Why asked:** Cost-of-mesh is the counterweight to hype — interviewers use it to test judgment.
</details>


<details>
<summary>❓ Q4: How do you enforce 'no pod-to-pod except API' with NetworkPolicies?</summary>

**Model answer:** Goal: pods may only talk to the API service (and DNS). Pattern: 1) default-deny all ingress/egress per namespace: a NetworkPolicy selecting all pods (podSelector: {}) with policyTypes: [Ingress, Egress] and no rules; 2) allow egress to DNS: to: {namespaceSelector: kube-system, podSelector: kube-dns} port 53 TCP/UDP (and optionally the API Service's pods); 3) allow ingress to the API pods only: podSelector matching api pods, from: {} (all) on the API port — or scope tighter (from: frontend pods); 4) allow egress from API pods to DB/redis etc. as needed. Test with a debug pod: `kubectl exec` curl should fail to everything except allowed targets. Remember: NetworkPolicies need a CNI that implements them (Cilium/Calico); default allow-all applies where unsupported.

**Rubric:** 1 = says 'use NetworkPolicy'. 2 = writes default-deny + allow specific. 3 = includes the DNS egress rule and testing step — the two gotchas that break real enforcement.

**Why asked:** This is the zero-trust exercise — the DNS egress gotcha is what separates written answers from deployed ones.
</details>


### Extensions & the Operator pattern

<details>
<summary>❓ Q1: What is a CRD and how does the Operator pattern extend Kubernetes?</summary>

**Model answer:** CRD (CustomResourceDefinition): declares a new API resource type (e.g. 'PostgresCluster') that the apiserver accepts and stores — it gives you declarative config for domain objects. On its own a CRD is just data storage; the Operator pattern adds a controller: a custom control loop that watches CRD objects and reconciles the cluster to match their spec (like the built-in controllers do for Deployments). Operator = CRD + controller (usually via controller-runtime/Operator SDK). It extends k8s from a container orchestrator into a platform where ANY system (databases, certs, message queues) is managed declaratively with self-healing.

**Rubric:** 1 = knows CRD = custom resource. 2 = explains CRD + controller = Operator. 3 = contrasts with plain manifests and gives the self-healing payoff.

**Why asked:** The CRD+controller pairing is the definitional answer — half the module tests this exactly.
</details>


<details>
<summary>❓ Q2: Explain the reconcile loop — what does the controller do when desired != current?</summary>

**Model answer:** Reconcile loop: watch desired state (from the API object, e.g. Deployment.spec.replicas: 3) → observe current state (ReplicaSet count) → diff → take action (create/scale/delete) → re-observe until they match, forever. When desired != current, the controller computes the minimal corrective action and re-applies; it's event-driven (watches) plus resync (periodic full re-check) for self-healing. Key properties: declarative (it doesn't 'get told' what to do, it derives it from the diff), idempotent (re-running the same diff is a no-op), and retry-on-error (backoff + exponential; errors surface in object status). Requeue with backoff is the standard failure path.

**Rubric:** 1 = says 'watch + fix'. 2 = explains diff-driven action + retry. 3 = covers events + resync, idempotency, and status reporting.

**Why asked:** The reconcile loop is the heart of controllers — the diff-and-act mental model is what's graded.
</details>


<details>
<summary>❓ Q3: Give examples of well-known Operators (Prometheus, ArgoCD, cert-manager) and what they automate</summary>

**Model answer:** Prometheus Operator: watches Prometheus/ServiceMonitor CRs — deploys and configures Prometheus servers, scrapes from ServiceMonitors, alerts via AlertmanagerConfig — so monitoring is declarative. ArgoCD: the GitOps engine — Application CRs point at Git repos; the controller syncs cluster state to Git (drift detection + auto-sync). cert-manager: Certificate/Issuer CRs — automatically obtains and renews TLS certs (Let's Encrypt via HTTP-01/DNS-01, or internal CA), injecting secrets + rotation before expiry. Pattern: each turns a previously manual, brittle operation (install/configure monitor, deploy app, get cert) into a declarative, self-healing resource.

**Rubric:** 1 = names the three. 2 = states what each automates. 3 = extracts the shared pattern (CRD + controller replacing manual ops).

**Why asked:** Concrete operator examples prove you've seen the ecosystem, not just read about CRDs.
</details>


<details>
<summary>❓ Q4: When would you write an Operator vs use plain manifests + ArgoCD?</summary>

**Model answer:** Use plain manifests + ArgoCD for: stateless apps, config, most services — declarative deploy with GitOps is enough; the controller already gives self-healing. Write an Operator when you need domain-specific lifecycle logic that manifests can't express: databases (backup/restore, scaling, failover), certificates (renewal timing), message brokers (rebalancing), anything with stateful, multi-step, ordered operations. Signals: you find yourself writing cron jobs to fix drift, shell scripts in CI mutating cluster state, or imperative steps that must run in order — that's a controller's job. Operator cost: significant (controller framework, RBAC, testing, versioning) — start with manifests + Helm/Kustomize + ArgoCD, escalate to an Operator only for genuine stateful lifecycle.

**Rubric:** 1 = knows Operators are for stateful stuff. 2 = contrasts GitOps for stateless vs Operator for lifecycle. 3 = gives the smell signals (drift-fixing scripts) and cost framing.

**Why asked:** This is the judgment question — knowing when NOT to build an operator is the senior answer.
</details>


### Practice environment

<details>
<summary>❓ Q1: minikube vs kind vs a managed cluster (EKS/AKS/GKE) — when would you choose each?</summary>

**Model answer:** minikube: single-node, batteries-included (addons: ingress, dashboard, metrics-server), good for learning + local dev with a UI; heavier than kind, VM-based by default. kind: Kubernetes IN Docker — multi-node clusters on Docker, fastest to start, great for CI and testing controllers/operators (runs in containers). Managed (EKS/AKS/GKE): production-like — real cloud networking/LBs, managed control plane, node autoscaling — use for anything you're testing that involves cloud integration (IAM, ALB, spot, Karpenter), staging, and production. Choice: local experiments + learning → minikube/kind; testing controllers in CI → kind; anything cloud-integrated or real → managed.

**Rubric:** 1 = names the options. 2 = picks by use case (learn vs CI vs prod). 3 = explains the cloud-integration gap (why kind can't test IAM/ALB).

**Why asked:** Environment choice shows whether you understand the gap between local and production k8s.
</details>


<details>
<summary>❓ Q2: How do you keep a local cluster from eating your laptop (resources, ephemeral)?</summary>

**Model answer:** Give it limits: minikube with --cpus 2 --memory 4g (or kind with container resource limits); set Docker's memory limit so the cluster can't consume everything. Keep it ephemeral: create/destroy per experiment (`minikube delete` / `kind delete cluster`); don't let dev clusters accumulate state. Watch node pressure: `kubectl top nodes`, `docker stats`; pause or delete when idle. Avoid running heavyweight workloads locally (GPU, big DBs) — use cloud for those. Standard config: 2 vCPU/4GB for the VM, namespaces per experiment, delete when done.

**Rubric:** 1 = knows it can eat RAM. 2 = sets explicit resource flags. 3 = adds the ephemeral/delete-per-experiment discipline and monitoring.

**Why asked:** A practical question that screens for people who've actually run clusters locally — and hit OOM.
</details>


<details>
<summary>❓ Q3: What's the fastest way to recreate a clean cluster for an experiment?</summary>

**Model answer:** kind: `kind create cluster --name exp && kind delete cluster` — seconds, container-based, reproducible; ideal for fast experiments. minikube delete/create is also quick but slower (VM). For a specific version: `kind create cluster --image kindest/node:v1.31.0`. For GitOps experiments, pair with ArgoCD install script. The key habit: script the whole thing — a `make cluster-up` target that creates kind + installs CNI + ingress + cert-manager, and `make cluster-down` — so 'clean' is one command, not a 20-minute manual teardown.

**Rubric:** 1 = says 'delete and recreate'. 2 = names kind and why. 3 = describes a scripted up/down workflow with version pinning.

**Why asked:** Recreate-speed tests operational taste — a scripted make target is the production answer.
</details>


### Module research

<details>
<summary>❓ Q1: Control plane vs nodes: apiserver, scheduler, controller-manager, etcd | kubelet, kube-proxy, container runtime</summary>

**Model answer:** Control plane: etcd (source of truth), apiserver (sole API front door, authn/authz/admission), scheduler (filters+scores node placement), controller-manager (reconcile loops: deployments, nodes, endpoints). Nodes: kubelet (node agent: runs containers, probes, reports status), kube-proxy (Service networking via iptables/ipvs), container runtime (containerd — executes containers). Mental model: apiserver is the only writer to etcd; kubelet is the only thing on the node that talks to the apiserver; everything else is a controller or data plane.

**Rubric:** 1 = lists half. 2 = full list with duties. 3 = apiserver-central model + kubelet-only-node-agent insight.

**Why asked:** Asked in B01 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q2: Workloads: Pod vs Deployment vs StatefulSet vs DaemonSet vs Job/CronJob; init containers; requests vs limits (QoS)</summary>

**Model answer:** Stateless replicas → Deployment; stable identity/storage → StatefulSet; one-per-node agents → DaemonSet; run-to-completion → Job; scheduled → CronJob. Init containers run before main, sequentially, share volumes (wait-for-dependency, data prep). requests = scheduler reservation, limits = ceiling; QoS: Guaranteed (equal), Burstable (req<lim), BestEffort (none); CPU over-limit throttles, memory over-limit OOMKills; omission → overpacking/evictions at scale.

**Rubric:** 1 = workload mapping only. 2 = adds init containers + QoS classes. 3 = ties omission consequences and throttling vs kill.

**Why asked:** Asked in B01 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q3: Scheduling: nodeName vs nodeSelector vs nodeAffinity; why a pod stays Pending (kubectl describe, events)</summary>

**Model answer:** nodeName: hard, direct pin (bypasses scheduler — used by DaemonSets); nodeSelector: simple label match; nodeAffinity: rich (required/preferred, matchExpressions). Pending = scheduler can't place: insufficient resources, taints, selector/affinity, unbound PVC, cordon — all visible in `kubectl describe pod` events; read events first.

**Rubric:** 1 = defines the three. 2 = adds required vs preferred. 3 = ties each Pending cause to its event line.

**Why asked:** Asked in B01 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q4: Maintenance: cordon/drain (PDB minAvailable), taints/tolerations</summary>

**Model answer:** cordon = no new pods; drain = evict all (respects PDBs — minAvailable/maxUnavailable guarantee availability during eviction; refuses bare pods/local PV). taints repel pods without matching tolerations — reserve pools (GPU, control-plane). Sequence for node maintenance: set PDB → cordon → drain → work → uncordon.

**Rubric:** 1 = defines cordon/drain. 2 = explains PDB role. 3 = full sequence + taint pool reservation.

**Why asked:** Asked in B01 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q5: Networking: service types (ClusterIP/NodePort/LoadBalancer), Ingress (L7, default backend, TLS secretName), NetworkPolicies</summary>

**Model answer:** ClusterIP = internal VIP (default); NodePort = port on every node; LoadBalancer = cloud LB → NodePort. Ingress = L7 routing (host/path), default backend for 404s, TLS via secretName. NetworkPolicy = pod-level firewall (podSelector, ingress/egress, default-deny) — implementer is the CNI. Debug order: pod → endpoints → service → ingress → DNS → SG.

**Rubric:** 1 = lists service types. 2 = adds Ingress TLS/default backend. 3 = NetworkPolicy default-deny + DNS egress gotcha.

**Why asked:** Asked in B01 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q6: Storage: PVC/PV/StorageClass, CSI, emptyDir vs hostPath vs volumes</summary>

**Model answer:** PVC = request for storage; PV = the provisioned volume; StorageClass = dynamic provisioning (AWS EBS gp3, etc.) with reclaim policies. CSI = standard plugin interface (EBS/EFS/azuredisk drivers). Volume types: emptyDir = ephemeral pod-scratch; hostPath = node directory (careful: couples pod to node); cloud volumes = durable, AZ-bound. StatefulSets bind one PVC per replica — storage is per-AZ, so zone affinity matters.

**Rubric:** 1 = PVC/PV/SC basics. 2 = CSI + dynamic provisioning. 3 = emptyDir vs hostPath vs cloud tradeoffs and AZ coupling.

**Why asked:** Asked in B01 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q7: Config: ConfigMap vs Secret, secretKeyRef, envFrom</summary>

**Model answer:** ConfigMap = non-sensitive config (env vars, files, volumes); Secret = sensitive (same mechanics, base64 + optional encryption-at-rest). Mount via envFrom (all keys as env), valueFrom secretKeyRef (one key), or volumes. Changes to CMs/secrets don't auto-restart pods — need rollout restart or a controller that watches them.

**Rubric:** 1 = CM vs Secret difference. 2 = envFrom/secretKeyRef mechanics. 3 = the no-auto-restart gotcha and encryption-at-rest.

**Why asked:** Asked in B01 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q8: Logging: node agent vs sidecar, EFK/ELK stack</summary>

**Model answer:** Two collection models: node-level daemon (Fluentd/Fluent Bit/Filebeat reads container logs from /var/log/containers) vs sidecar (per-pod log shipper — needed for multi-format, structured, or app-level processing). EFK/ELK: shippers → Elasticsearch (index) → Kibana (UI); heavy (JVM). Loki alternative: label-based, cheaper, pairs with Grafana + Promtail. Consider log volume, retention, and cost per GB before choosing.

**Rubric:** 1 = knows EFK/ELK. 2 = contrasts node-agent vs sidecar. 3 = adds Loki tradeoff + volume/retention planning.

**Why asked:** Asked in B01 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q9: Monitoring: Prometheus (server, client libraries, pushgateway, exporters, alertmanager), Grafana</summary>

**Model answer:** Prometheus pulls metrics from exporters/scrape targets (node-exporter, kube-state-metrics, cAdvisor, app /metrics); Alertmanager handles dedup/grouping/routing of alerts (PagerDuty, Slack); pushgateway for short-lived batch jobs (push workaround); recording rules precompute expensive queries. Grafana = dashboards/alerts UI over Prometheus + Loki + Tempo (three pillars). The pipeline: instrument (client libs) → scrape → store → query/alert → visualize.

**Rubric:** 1 = names Prometheus + Grafana. 2 = explains pull model + exporters. 3 = adds Alertmanager routing, recording rules, pushgateway caveats.

**Why asked:** Asked in B01 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q10: Security: RBAC, namespaces (blue/green, multi-team), admission controllers, audit logs, PodSecurity</summary>

**Model answer:** RBAC: Roles/ClusterRoles + Bindings, least privilege per SA. Namespaces: isolation + quota per team/env (blue/green via namespaces). Admission controllers: intercept API requests (mutating/validating — PSA, LimitRange, Kyverno). Audit logs: apiserver audit policy records who did what — needed for compliance. PodSecurity: PSS profiles (baseline/restricted) enforced via PSA labels.

**Rubric:** 1 = RBAC + namespaces. 2 = adds admission + PSA. 3 = ties audit logs to compliance and least-privilege SA design.

**Why asked:** Asked in B01 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q11: Operators: custom resources + control loops; controller pattern</summary>

**Model answer:** Operator = CRD (declarative domain API) + controller (reconcile loop: observe → diff → act → requeue). Controllers are event-driven + periodic resync, idempotent, retry with backoff, report status. Built-in controllers (ReplicaSet etc.) are the pattern; operators extend it to databases/certs/messaging. Write one when lifecycle logic exceeds manifests (backup/failover/renewal), not for stateless apps.

**Rubric:** 1 = CRD + controller. 2 = reconcile loop mechanics. 3 = when-to-build judgment + cost framing.

**Why asked:** Asked in B01 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q12: Concepts: Docker Swarm vs K8s, imperative vs declarative (kubectl apply), self-healing/reconciliation</summary>

**Model answer:** Swarm = simple, Docker-native, limited scheduling/HA; k8s = extensible, self-healing, the ecosystem standard. Declarative (kubectl apply, manifests in Git) = you state desired state, controllers converge; imperative (kubectl run/create, scripts) = you issue commands, easy to drift. Self-healing = controllers constantly reconcile actual → desired (replace crashed pods, reschedule, resync). Declarative + GitOps = auditable, reproducible.

**Rubric:** 1 = Swarm vs k8s. 2 = declarative vs imperative with kubectl apply. 3 = reconciliation as the mechanism of self-healing.

**Why asked:** Asked in B01 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q13: Service mesh: Istio/Linkerd — sidecar injection, mTLS, traffic routing/shift; when a mesh beats NetworkPolicies alone (~+30% premium skill in India data)</summary>

**Model answer:** Both inject sidecars; Istio (Envoy, feature-rich: weighted routing, fault injection, tracing) vs Linkerd (light, fast, golden metrics + mTLS). Mesh wins over NetworkPolicies when you need: universal mTLS without app changes, L7 routing/canary by header/weight, per-service SLO metrics + tracing, or cross-cluster identity. Costs: sidecar CPU/RAM per pod, latency, control-plane ops. Adopt at ~20+ services or when compliance demands universal mTLS; otherwise NP + app mTLS + OTel suffices.

**Rubric:** 1 = sidecar + mTLS basics. 2 = Istio vs Linkerd tradeoff. 3 = adoption threshold logic + cost math.

**Why asked:** Asked in B01 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q14: Autoscaling: HPA (metrics-driven) vs VPA (recommender) vs Cluster Autoscaler vs Karpenter — which layer handles what</summary>

**Model answer:** HPA scales pod count (CPU/custom metrics) — stateless services. VPA adjusts requests/limits (restarts pods) — stateful/bursty. Cluster Autoscaler adds/removes NODES on pending pods (node groups; minutes to react). Karpenter provisions nodes fast with bin-packing (instance-type aware). Layers: HPA (pods) + CA/Karpenter (nodes); VPA is orthogonal (resource sizing). Combine HPA + Karpenter for elastic stateless; avoid VPA+HPA on the same metric.

**Rubric:** 1 = names the four. 2 = maps pod vs node layers. 3 = composition rules + reaction-time differences.

**Why asked:** Asked in B01 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q15: ServiceAccounts: how pods authenticate to the API server, RBAC rolebinding, securityContext + Pod Security Standards</summary>

**Model answer:** Pod mounts its SA's JWT (/var/run/secrets/.../token) — authenticates to apiserver; authorization via RoleBinding to that SA. securityContext sets pod/container security (runAsNonRoot, readOnlyRootFilesystem, capabilities, seccomp). PSS profiles (baseline/restricted) enforced via PSA labels enforce these constraints at admission. Disable automountServiceAccountToken for API-free pods.

**Rubric:** 1 = token mount + RBAC. 2 = securityContext fields. 3 = PSA enforcement + automount tradeoff.

**Why asked:** Asked in B01 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q16: Practice environments: minikube vs kind vs k3s vs managed (EKS/AKS/GKE) — why a real cluster beats a playground</summary>

**Model answer:** minikube = single-node learning VM; kind = multi-node in Docker (CI/controller testing); k3s = lightweight single-binary (edge/raspberry); managed = real cloud control plane + integration (IAM/ALB/spot). Playgrounds teach k8s primitives but hide cloud-specific realities (LB provisioning, node autoscaling, IAM, upgrade cycles) — a managed or kubeadm cluster is where production behaviors surface.

**Rubric:** 1 = lists options. 2 = picks by use case. 3 = explains what playgrounds hide (cloud integration gap).

**Why asked:** Asked in B01 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q17: Operator pattern deep: CRDs (custom resource definitions), controller reconcile loop, Operator SDK; real examples (Prometheus Operator, Argo CD, Kyverno)</summary>

**Model answer:** CRD = new API type (apiserver stores it); controller reconciles desired vs current. Operator SDK / controller-runtime scaffold the controller (watches, RBAC, status). Prometheus Operator: ServiceMonitor CRs → scrape config; Argo CD: Application CR → Git sync; Kyverno: policies as CRs → admission. Deep point: operators replace imperative runbooks (scripts + cron fixes) with declarative self-healing state.

**Rubric:** 1 = CRD + controller. 2 = SDK scaffolding + reconcile mechanics. 3 = real examples + the 'runbooks → operators' shift.

**Why asked:** Asked in B01 — verify against the module's checklist items and research block.
</details>


---

## B02 Terraform & IaC — state & modularity

### Core language

<details>
<summary>❓ Q1: Walk me through write → plan → apply — what happens at each step and what can go wrong?</summary>

**Model answer:** Write: author HCL (providers, resources, variables, outputs). init: downloads providers/modules, initializes backend (state location + locking). plan: reads config + current state, computes the diff (create/update/delete), shows it — no changes yet; wrong here: secrets can appear in plan output, or plan differs from apply if state changed between. apply: executes the plan in dependency order, updates state, saves it to the backend; can fail midway (partial apply — state records what succeeded; re-run to converge). Then destroy if needed. Key failure modes: drift between plan and apply (someone else applied), state lock held, provider API rate limits, destroyed-then-recreated resources with identity change.

**Rubric:** 1 = names the three steps. 2 = describes plan as diff + state update at apply. 3 = explains partial apply, drift-between-plan-and-apply, and state locking.

**Why asked:** The core workflow question — interviews probe whether you understand state as the plan/apply bridge.
</details>


<details>
<summary>❓ Q2: provider vs resource vs data source vs variable vs output — the dependency graph between them</summary>

**Model answer:** provider = the API client (aws, google, kubernetes) — configures how resources talk to the cloud; resources = managed objects (create/update/delete); data sources = read-only queries of existing state (current AMI, existing VPC) used to inform resources; variables = inputs to the config (defaults, tfvars, env); outputs = exported values (IPs, ARNs) for reuse/other configs. Dependency graph: provider → resource/data source; resources reference each other implicitly (${aws_vpc.main.id} creates edges); variables feed resources; outputs read from resources/data sources; graph engine executes in parallel where independent.

**Rubric:** 1 = defines the five. 2 = explains implicit references build the graph. 3 = covers parallel execution, depends_on, and data-source reads.

**Why asked:** Asked in B02 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q3: Terraform vs OpenTofu: what changed after the BSL relicensing and why does it matter?</summary>

**Model answer:** In Aug 2023 HashiCorp relicensed Terraform from MPL 2.0 to BUSL (Business Source License) — source-visible but NOT open-source; it restricts commercial use and competing products. OpenTofu: a fork (backed by Linux Foundation) keeping the MPL license — open source, community-governed, mostly compatible CLI/state. Why it matters: license risk for vendors (can't embed Terraform commercially), vendor lock-in concerns, and community governance. Practical: features diverge slowly; evaluate by your needs — OpenTofu for open-source guarantees, Terraform for HashiCorp ecosystem support (Cloud, Sentinel). State files are compatible either way.

**Rubric:** 1 = knows BSL happened. 2 = explains BUSL vs MPL + OpenTofu fork. 3 = gives migration/compatibility guidance and ecosystem tradeoff.

**Why asked:** Asked in B02 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q4: How does Terraform know what to change (state diff)? What does plan output actually tell you?</summary>

**Model answer:** Terraform compares desired state (config) vs current state (state file, refreshed with real-world API data during plan). The diff drives the plan: + create, ~ update in place, - destroy, -/+ replace (destroy+recreate). Plan output = proposed actions + the attribute-level changes (what field differs and its old/new value), plus the execution order and any 'forces replacement' markers. It does NOT execute anything — it's a prediction; apply re-runs the plan internally to guard against drift.

**Rubric:** 1 = says 'compares config to state'. 2 = explains plan actions (+/~/-/-/+). 3 = covers refresh, forces-replacement, and plan-as-prediction semantics.

**Why asked:** Asked in B02 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q5: Pulumi vs Terraform — what does IaC in a real programming language (TypeScript/Python) give you, and when would you choose it?</summary>

**Model answer:** Pulumi: IaC in real languages (TS, Python, Go, C#) — you write code, not HCL: loops/conditionals/classes natively, shared libraries, IDE type-checking, unit tests of your infra logic. Same declarative model + state (per-project stack, stored in a backend — S3/self-hosted/Pulumi Cloud). Terraform: HCL, the ecosystem default, huge provider/module registry, HashiCorp tooling (Cloud, Sentinel). Choose Pulumi when: dev-heavy team (reuse existing code skills), complex logic (per-env branching, generated config), or you want testable infra; choose Terraform when: HCL is fine, you want the largest provider/module ecosystem and hiring pool, or the org already runs it. Both support the same clouds; migration cost (state + HCL→code rewrite) is the real barrier.

**Rubric:** 1 = names Pulumi. 2 = code-vs-HCL + state model. 3 = ecosystem vs language-power tradeoff + migration-cost honesty.

**Why asked:** Pulumi is the 'awareness' question — roadmap.sh lists it alongside Terraform; interviewers check you know when language-native IaC wins.
</details>


### State management

<details>
<summary>❓ Q1: What is terraform state and why does it matter? What breaks if you lose it?</summary>

**Model answer:** State = Terraform's mapping of config resources → real-world resource IDs + attributes. It's the source of truth for what Terraform manages. Without it: Terraform can't know what exists — plan shows everything as 'create' → re-creating resources (new IDs, data loss risk, orphaned old resources). State also stores metadata (dependencies, sensitive values in some cases). Mitigations: remote backend (S3 + DynamoDB) for durability + locking; `terraform state pull/push` for recovery; import to rebuild state from existing resources. Losing state of managed infra is the classic 'did I just delete my prod' scenario — a remote backend is non-negotiable.

**Rubric:** 1 = says state maps config to real resources. 2 = explains loss consequences (recreate vs import). 3 = covers remote backend + import recovery and locking.

**Why asked:** Asked in B02 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q2: Remote backend: S3 + DynamoDB locking — what does each provide and why both?</summary>

**Model answer:** S3 backend: stores the state file durably + versioned (S3 versioning = accidental-corruption rollback), encrypted (SSE), accessible by the whole team. DynamoDB: provides state LOCKING — a lock table where each apply acquires a lock (prevents two applies racing and clobbering state); without it, concurrent applies corrupt state. Why both: S3 for storage + durability, DynamoDB for mutual exclusion — one without the other leaves a gap (unlocked concurrent applies destroy state integrity; state without versioning can't recover). Also: S3 key per workspace/environment, encryption + least-privilege IAM on both.

**Rubric:** 1 = S3 stores state. 2 = adds DynamoDB locking. 3 = explains why BOTH are needed (durability vs concurrency) + versioning/encryption.

**Why asked:** Asked in B02 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q3: When do you use terraform import vs state rm vs state mv? Give real scenarios</summary>

**Model answer:** import: adopt an EXISTING resource into state (created via console/other tools) so Terraform manages it — e.g. import an old EC2/S3 bucket into config. state rm: unmanage a resource (keep it alive in the cloud but remove from state) — e.g. decommission a resource from Terraform's control, or after import mistakes. state mv: move a resource within state — rename, move between modules (refactor module structure), or move from state rm'd location; critical for refactors so you don't destroy-recreate. Real scenario: consolidating two modules → state mv old.module.res to new.module.res; adopting a manually created S3 bucket → import; stopping Terraform from deleting a legacy resource → state rm (then manage manually).

**Rubric:** 1 = knows import exists. 2 = distinguishes import (adopt) vs rm (unmanage) vs mv (move). 3 = gives refactor + adoption scenarios and the destroy-prevention reasoning.

**Why asked:** Asked in B02 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q4: Sensitive state: how do you keep secrets out of the state file and plan output?</summary>

**Model answer:** State file stores ALL attribute values including secrets (plaintext in state, even if marked sensitive). Mitigations: 1) encrypt state at rest (S3 SSE, Terraform Cloud); 2) restrict state access via IAM (state contains secrets — least-privilege read); 3) avoid putting secrets in config: use variables with sensitive = true (still lands in state) or better, don't store at all: aws_ssm_parameter / aws_secretsmanager_secret data sources, or vault provider — secret fetched at apply, referenced, not embedded; 4) mark sensitive on outputs to redact plan/console display (doesn't remove from state); 5) rotate secrets and audit state access. Honest answer: if a secret must exist in config, it exists in state — reduce exposure (encryption, IAM, avoiding secrets in state) rather than claim you can exclude them.

**Rubric:** 1 = knows secrets live in state. 2 = lists encryption + sensitive flag. 3 = explains data-source indirection (SSM/Secrets Manager) and the 'still in state' reality.

**Why asked:** Asked in B02 — verify against the module's checklist items and research block.
</details>


### Modules & reuse

<details>
<summary>❓ Q1: What makes a good module — inputs, outputs, versioning, and when is a module overkill?</summary>

**Model answer:** Good module: narrow purpose (one thing well), clear inputs (typed variables with descriptions + defaults), minimal required inputs (sensible defaults), explicit outputs (what consumers need), versioned + pinned, tested, documented. Naming convention terraform-<provider>-<name> (registry). Overkill when: single-use wrapper around one resource (a module for an SG with one rule), premature abstraction, or config that varies more than it repeats. Rule: a module earns its cost at 2+ reuse sites or when it encodes policy (compliance-standard VPC).

**Rubric:** 1 = inputs/outputs. 2 = versioning + naming + testing. 3 = the reuse-threshold judgment and policy-encoding value.

**Why asked:** Asked in B02 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q2: How do you version modules (registry, Git tags) and pin them safely?</summary>

**Model answer:** Registry modules: semver versions (v1.2.0); public registry resolves automatically; private via registry mirror or git. Git modules: source = 'git::https://...//modules/vpc?ref=v1.2.0' — ref can be a tag (recommended), branch (dev only), or commit SHA (pinning). Pin safely: use tags/SHAs, never floating branches in prod; update deliberately (review changelog, run plan, test). Registry: constraint strings like '~> 1.2' allow minor upgrades; '>= 1.0, < 2.0' looser. Document upgrade cadence + breaking-change policy.

**Rubric:** 1 = knows registry + git tags. 2 = explains ref pinning and constraints. 3 = the deliberate-upgrade workflow and branch-vs-tag warning.

**Why asked:** Asked in B02 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q3: count vs for_each — when each, and how do you reference their resources?</summary>

**Model answer:** count: creates a LIST of resources by integer index — use when instances are homogeneous and indexed (0..n). for_each: creates a MAP keyed by a unique key (string/set) — use when instances have distinct identities (per-team, per-env, name-derived) and stable keys matter. References: count → aws_instance.web[0], aws_instance.web.*.id; for_each → aws_instance.web["api"].id, values(aws_instance.web), keys(). Why for_each over count: removing an item from the middle of a count list shifts indices → destroys/recreates unrelated resources; for_each keys are stable. Also: count can't create heterogeneous instances easily; for_each can via each.value.

**Rubric:** 1 = knows both exist. 2 = explains list-vs-map and index shifting. 3 = the middle-removal destroy problem and keyed stability argument.

**Why asked:** Asked in B02 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q4: How do you share modules across teams without publishing publicly?</summary>

**Model answer:** Options: 1) private Git repos + git:: source refs (simplest — works with any Git host; pin with ref); 2) private module registry (Terraform Cloud/Enterprise, or self-hosted like Atlantis/Terraform Registry mirror); 3) git submodules/monorepo sharing via relative paths; 4) internal registry (JFrog, GitLab module registry). Best practice: private Git + tags + a registry layer if teams need discoverability/version constraints. Add CI on the module repo (terraform validate, tflint, checkov, plan against a fixture) so shared modules are tested before teams consume them. Governance: keep modules in a 'platform' org, PR review, semver.

**Rubric:** 1 = says 'private git'. 2 = adds registry options + versioning. 3 = CI-on-modules + governance model.

**Why asked:** Asked in B02 — verify against the module's checklist items and research block.
</details>


### Plan/apply discipline

<details>
<summary>❓ Q1: What checks run before apply in a good pipeline (fmt, validate, plan review, tflint, checkov)?</summary>

**Model answer:** Sequence: 1) terraform fmt -check (style); 2) terraform validate (syntax/semantic); 3) tflint (provider-specific lint, deprecated args); 4) checkov/tfsec (security policy: public SG, unencrypted, IAM wildcards); 5) terraform plan against the right workspace/env; 6) human plan review (approval gate on the diff — especially destroys); 7) optionally policy-as-code (Sentinel/OPA) on plan; 8) apply with auto-approve ONLY after gating, or with explicit confirmation. The plan review is the real gate — the diff is the artifact people approve.

**Rubric:** 1 = fmt + validate + plan. 2 = adds tflint/checkov + review gate. 3 = orders the full pipeline and explains WHY plan review is the critical control.

**Why asked:** Asked in B02 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q2: Someone ran apply directly against prod — how do you prevent it (state locking, approval, plan-as-code)?</summary>

**Model answer:** Prevention layers: 1) remote state + locking (S3+DynamoDB) so ops see conflicts; 2) separate workspaces/environments (dev/stage/prod) with IAM restricting who can access prod state/creds; 3) pipeline-only applies: prod apply runs only in CI with protected-branch triggers + manual approval (GitHub Environments / GitLab protected env); 4) no local credentials for prod (assume-role MFA, short-lived); 5) plan-as-code: CI produces the plan artifact, a human reviews and approves, then apply uses THAT plan (not a fresh local one); 6) audit logs (who ran what); 7) drift/change alerts. Culture: make 'apply directly' impossible, not just discouraged.

**Rubric:** 1 = mentions locking. 2 = adds environment separation + approval. 3 = the plan-artifact + protected-env + no-local-prod-creds design.

**Why asked:** Asked in B02 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q3: What's the difference between apply -replace and taint, and why is -replace preferred?</summary>

**Model answer:** taint: marks a resource for destruction+recreation on the NEXT apply (deprecated since v0.15.2 — HashiCorp recommends apply -replace instead, because the change is visible in the plan; taint mutates state directly and other users can plan against it before you review). apply -replace <address>: destroys and recreates the specified resource in the same run, without a separate state mutation step. Why -replace preferred: taint required a separate state-mutating command (confusing, could be forgotten, race-prone); -replace is explicit in the apply invocation, targeted, and doesn't persist state changes. Also: -replace is the modern recovery for 'this resource is in a broken state, rebuild it' without editing config.

**Rubric:** 1 = knows both exist. 2 = explains replace = destroy+recreate same run. 3 = the deprecation story + why -replace is safer/cleaner.

**Why asked:** Asked in B02 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q4: Drift: someone changed infra in the console — how do you detect and reconcile it?</summary>

**Model answer:** Detect: 1) plan output shows diffs vs state (Terraform's refresh detects drifted attributes); 2) terraform plan in CI on schedule (drift detection runs); 3) tools: driftctl, Atlantis drift detection, Terraform Cloud drift detection; 4) cloud-side: AWS Config/CloudTrail for change history. Reconcile options: a) accept the drift (update config to match reality — then import or edit config); b) remove the drifted resource from management (state rm) if it's now managed elsewhere; c) re-apply (terraform apply) to restore desired state (destructive to the console change — warn the team); d) document + follow up. Process: treat drift as an incident-lite: investigate the change (who/what via CloudTrail), decide intent, align config or state.

**Rubric:** 1 = says 'plan shows it'. 2 = adds scheduled drift detection. 3 = the reconcile decision tree (align config vs re-apply vs unmanage) + change audit.

**Why asked:** Asked in B02 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q5: Infracost — how do you estimate a plan's cost before apply and gate expensive changes in CI?</summary>

**Model answer:** Infracost parses a Terraform/OpenTofu plan (or runs its own) and estimates monthly $ by resource, using current cloud pricing. CI integration: run `infracost breakdown` on the plan in a pipeline step → comment the diff on the PR ('this change adds $124/mo — 3 EC2 t3.medium + NAT'). Gating: either informational (comment) or enforced — a workflow that fails the PR when the delta exceeds a budget (e.g. > $200/mo) or when specific expensive resources are added (nat_gateway, multi-AZ RDS). Config: usage-file (actual quantities: GB stored, data transfer) makes estimates accurate; per-workspace config. Value: cost awareness at design time — the PR review becomes the cost checkpoint, catching expensive mistakes before apply.

**Rubric:** 1 = 'estimates plan cost'. 2 = CI PR comment + how it works. 3 = budget gating + usage-file accuracy + cost-review-as-standard-practice.

**Why asked:** Infracost is the FinOps-meets-IaC question — mid-level interviews increasingly ask how cost gates fit into plan/apply discipline.
</details>


### Module research

<details>
<summary>❓ Q1: Core workflow: write -> plan -> apply; providers, resources, data sources</summary>

**Model answer:** Write HCL → init (providers/backend) → plan (diff config vs state) → apply (execute, update state). Providers = API clients; resources = managed objects; data sources = read existing state. State is the bridge: plan computes changes, apply persists them.

**Rubric:** 1 = steps only. 2 = adds provider/resource/data roles. 3 = state-as-bridge + failure modes.

**Why asked:** Asked in B02 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q2: Commands: init/validate/plan/apply/destroy/fmt; apply -replace (preferred over deprecated taint)</summary>

**Model answer:** init: providers/backend/modules; fmt: style; validate: syntax; plan: diff; apply: execute; destroy: teardown (careful). -replace <addr> destroys+recreates one resource (modern replacement for the removed taint).

**Rubric:** 1 = lists commands. 2 = maps each to its phase. 3 = -replace semantics + destroy safety.

**Why asked:** Asked in B02 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q3: State: tfstate, remote backend (S3 + DynamoDB locking), state file locking, sensitive state, refresh vs plan</summary>

**Model answer:** tfstate = config→real-world mapping. Remote backend: S3 (durable, versioned, encrypted) + DynamoDB (lock). Sensitive state: encrypt at rest + restrict IAM + avoid embedding secrets (data sources). refresh = re-read reality; plan = refresh + diff.

**Rubric:** 1 = defines state. 2 = S3+DynamoDB rationale. 3 = secret-in-state reality + refresh-vs-plan.

**Why asked:** Asked in B02 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q4: Modules: terraform-<PROVIDER>-<NAME> naming, registry, outputs -> variables wiring, versioning</summary>

**Model answer:** Registry naming terraform-aws-vpc; modules wire via outputs → consumers' variables; version with semver tags; pin refs (~> 1.2 / git ref). Good module: small scope, typed inputs, explicit outputs, tested, documented.

**Rubric:** 1 = naming + registry. 2 = output→variable wiring. 3 = versioning discipline + when modules are overkill.

**Why asked:** Asked in B02 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q5: Idempotency/rollback: recommit old code (Terraform has no built-in rollback), import existing resources</summary>

**Model answer:** Terraform is idempotent (re-apply converges) but has NO rollback — reverting means recommitting old config and re-applying (which may destroy newer resources). Import adopts existing resources into state. Rollback strategy: keep previous state/plan artifacts; use -replace for bad single resources; for real rollback, apply the last-known-good config.

**Rubric:** 1 = knows no rollback. 2 = recommit + reapply as rollback. 3 = import + plan artifacts + -replace recovery.

**Why asked:** Asked in B02 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q6: Advanced: null_resource, count vs for_each, terraform_workspace vs terraform_remote_state, Terragrunt (DRY, immutable versioned modules)</summary>

**Model answer:** null_resource + local-exec/provisioner = side effects (scripts) — use sparingly, they're not tracked like resources. count = indexed list; for_each = keyed map (stable keys). terraform_workspace = local state separation (dev/prod states); terraform_remote_state = read another config's outputs (cross-config data). Terragrunt: DRY wrapper — shared backend config, module version pinning, dependency orchestration.

**Rubric:** 1 = names the tools. 2 = explains each purpose. 3 = when to reach for Terragrunt + workspace vs remote_state.

**Why asked:** Asked in B02 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q7: Comparisons: vs Ansible (provision vs config, declarative vs procedural), vs CloudFormation (multi-cloud, HCL vs JSON/YAML, state)</summary>

**Model answer:** Ansible = config management + provisioning (procedural tasks, SSH push, agentless) — configures EXISTING machines; Terraform = declarative provisioning (state, destroy) — creates the machines. Often paired (TF for infra, Ansible for config). CloudFormation = AWS-only, JSON/YAML, state managed by AWS (stacks), similar declarative model; Terraform = multi-cloud + HCL + own state/backend. Choose TF for multi-cloud/portable; CF for deep AWS-native integration.

**Rubric:** 1 = TF vs Ansible one-liner. 2 = declarative vs procedural + pairing. 3 = CF comparison + multi-cloud/state angle.

**Why asked:** Asked in B02 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q8: Terraform Cloud/Enterprise: workspaces, policy-as-code (Sentinel/OPA), runs, VCS-driven</summary>

**Model answer:** Terraform Cloud: managed runs (plan/apply in cloud), remote state, workspaces per env/team, VCS-driven (PR → plan → comment → apply on merge), policy-as-code via Sentinel (HCL policies) or OPA (rego), cost estimation, private registry. Enterprise adds SSO, audit, agents. Value: enforces plan-review gates + policy checks centrally.

**Rubric:** 1 = workspaces + VCS. 2 = policy-as-code + runs model. 3 = the governance value (plan gates, Sentinel/OPA, audit).

**Why asked:** Asked in B02 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q9: Request flow architecture: CLI -> provider -> API; graph execution, parallelism</summary>

**Model answer:** terraform CLI → provider plugin (gRPC) → cloud API. Graph: resources/nodes + dependency edges (implicit refs, depends_on); plan/apply traverse the graph in topological order, executing independent branches in parallel (default parallelism 10). Cycles (a depends on b, b on a) are errors.

**Rubric:** 1 = CLI→provider→API. 2 = graph + topological order. 3 = parallel execution + cycle errors + parallelism tuning.

**Why asked:** Asked in B02 — verify against the module's checklist items and research block.
</details>


---

## B03 Cloud (AWS) — VPC, IAM, cost

### Compute & storage

<details>
<summary>❓ Q1: EC2 instance families — how do you pick the right one for a workload (general/compute/memory/storage/accelerated)?</summary>

**Model answer:** Families: general (M/T) — balanced, default for web/app; compute (C) — CPU-heavy (batch, transcoding); memory (R/X) — large RAM (DBs, caches, in-memory); storage (I/D/H) — high local I/O (databases, big data); accelerated (P/G/Inf) — GPU/FPGA (ML training/inference); burstable (T) — variable CPU with CPU credits (dev, spiky). Pick by the bottleneck: measure CPU/memory/IO/GPU utilization; choose the family matching the dominant resource; right-size within family (instance size = vCPU/RAM). Rule: profile first (CloudWatch metrics), then pick family, then size.

**Rubric:** 1 = names a few families. 2 = maps workload → family. 3 = metric-driven selection + right-sizing loop.

**Why asked:** Asked in B03 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q2: On-demand vs spot vs reserved/Savings Plans — cost/latency tradeoffs and when spot is acceptable</summary>

**Model answer:** On-demand: full price, no commitment, instant — for unpredictable/required-uptime. Spot: up to ~90% cheaper, but instances can be reclaimed (2-min warning) — for fault-tolerant, interruptible workloads (batch, CI, stateless workers, ML training with checkpointing). Reserved (1-3yr) / Savings Plans (commit $/hr): up to ~70% off — for steady-state baselines (prod DBs, always-on). Spot acceptable when: work can restart (idempotent), no state on instance, workload tolerates interruption — never for stateful single instances. Design: spot for elastic + reserved/SP for baseline + on-demand for overflow.

**Rubric:** 1 = knows spot is cheaper but interruptible. 2 = maps workload classes to each. 3 = the mix design (spot elastic + SP baseline) + reclamation handling.

**Why asked:** Asked in B03 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q3: stop vs terminate — what survives each? EBS volume lifecycle and snapshots</summary>

**Model answer:** stop: instance halts, EBS volumes (root+data) persist, public IP may change (private IP persists), billed for storage not compute; start resumes. terminate: instance and its root EBS volume (deleteOnTermination) are destroyed — data gone unless you set deleteOnTermination=false or snapshot. Survives stop: EBS data, private IP (for stopped), AMI unchanged; survives terminate: snapshots, AMIs, and detached volumes with deleteOnTermination=false. Lifecycle: snapshot EBS for durability (backup, migration, restore). Rule: for durable data use separate EBS with deleteOnTermination=false + snapshots; instance-store data dies on stop/terminate.

**Rubric:** 1 = stop keeps data, terminate deletes. 2 = EBS persistence + deleteOnTermination. 3 = snapshot strategy + instance-store caveat.

**Why asked:** Asked in B03 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q4: S3 storage classes + lifecycle rules — when does cold storage make sense?</summary>

**Model answer:** Classes: Standard (hot, low latency, frequent access), Intelligent-Tiering (auto moves by access pattern, monitoring fee), Standard-IA (infrequent, retrieval fee), OneZone-IA (single AZ, cheaper, less durable), Glacier Instant/Glacier Flexible (archive, minutes-to-hours retrieval), Glacier Deep Archive (coldest, ~12h retrieval, cheapest). Lifecycle rules transition objects by age (e.g. 30d → IA, 90d → Glacier, 365d → Deep Archive, 730d → expire). Cold storage makes sense for: compliance archives, backups, logs with retention mandates, old versions — where access is rare and retrieval latency acceptable. Cost analysis: compare storage savings vs retrieval + minimum storage durations.

**Rubric:** 1 = lists classes. 2 = lifecycle transition example. 3 = cost/retrieval tradeoff + when cold is wrong (frequent reads).

**Why asked:** Asked in B03 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q5: EBS vs EFS vs S3 — pick storage for a stateful app and justify</summary>

**Model answer:** EBS: block storage attached to ONE EC2 (low latency, high IOPS) — databases, stateful app data. EFS: NFS file system shared across many instances (multi-AZ, POSIX) — shared files, web farms, content. S3: object storage, HTTP API, unlimited scale, strongly consistent — backups, media, static assets, data lakes. Decision rule: single-node latency-sensitive → EBS; multi-node shared files → EFS; object/archive/unstructured → S3. Justify with: access pattern (block vs file vs object), sharing needs, scale, latency budget, cost.

**Rubric:** 1 = knows the three exist. 2 = block vs file vs object mapping. 3 = justified pick with access-pattern reasoning + cost/latency.

**Why asked:** Asked in B03 — verify against the module's checklist items and research block.
</details>


### Databases in production

<details>
<summary>❓ Q1: SQL vs NoSQL — how do you decide for a new service? Give a decision rule, not a preference</summary>

**Model answer:** Decision rule: need ACID transactions, joins, ad-hoc queries, fixed schema, strong consistency → relational (Postgres). Need horizontal scale, flexible schema, high write throughput, document/graph/key-value model → NoSQL (DynamoDB/Mongo). More precisely: if the access pattern is known and queryable-by-key or by-document → NoSQL wins on scale; if queries are unpredictable/analytic or data is highly relational → SQL. Start relational unless you have a concrete scale/schema-flexibility need — Postgres scales further than people think; NoSQL is chosen for a reason (throughput, model fit), not fashion.

**Rubric:** 1 = names tradeoffs. 2 = gives a rule (transactions/joins → SQL). 3 = nuanced: known access pattern → NoSQL; relational default + scale reasoning.

**Why asked:** Asked in B03 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q2: A query is slow in production — what's your diagnosis order (EXPLAIN, indexes, connection pool, locks)?</summary>

**Model answer:** Order: 1) confirm it's the query (app timing, query logs); 2) EXPLAIN / EXPLAIN ANALYZE — plan, seq scan vs index, row estimates vs actual, joins; 3) missing/wrong index → add/composite index; 4) check slow query log + stats (perf insights / pg_stat_statements); 5) connection pool — pool exhaustion (too many connections, pool too small, leaked connections) can make queries 'slow'; 6) locks/blocking — waiting on row/table locks (pg_locks, MySQL innodb status); 7) resource contention (CPU/IO) — sometimes the DB is fine, the box isn't. Fix smallest first: index → query rewrite → schema → hardware. Verify with the same EXPLAIN after.

**Rubric:** 1 = says EXPLAIN. 2 = index + pool order. 3 = full order incl. locks + contention + verify-after-fix.

**Why asked:** Asked in B03 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q3: Walk me through a restore drill: snapshot → PITR → verify — and how it maps to your RTO/RPO</summary>

**Model answer:** Drill: 1) define targets first — RPO (acceptable data loss, e.g. 5 min) and RTO (acceptable downtime, e.g. 1 hr); 2) take a base snapshot (RDS snapshots are transaction-consistent; EBS snapshots + DB-level backup for multi-volume); 3) enable PITR (RDS automated backups = snapshots + transaction logs → restore to any point); 4) restore to a NEW instance (never overwrite prod) — snapshot restore (point-in-time of snapshot) or PITR restore (chosen timestamp within retention); 5) verify: connect, check schema, row counts, recent transactions, app smoke test; 6) cut over via DNS/route change (update endpoint). Measure: RPO achieved = backup interval/log retention; RTO achieved = restore time + verification + cutover. The drill exposes what doc-compliant RTO/RPO claims hide.

**Rubric:** 1 = knows snapshot restore. 2 = PITR + new-instance + verify. 3 = maps drill timing to measured RTO/RPO and tests cutover.

**Why asked:** Asked in B03 — verify against the module's checklist items and research block.
</details>


### Networking

<details>
<summary>❓ Q1: VPC anatomy: subnets/AZ, IGW, NAT, route tables — draw the flow of a request in vs out</summary>

**Model answer:** VPC = isolated network (CIDR, e.g. 10.0.0.0/16); AZs = failure domains; subnets = AZ-scoped slices (public: route 0.0.0.0/0 → IGW; private: no IGW route, egress via NAT). IGW = internet gateway (public inbound/outbound); NAT gateway = outbound-only from private subnets; route tables = per-subnet routing decisions; security groups attach at instance level. INBOUND to public app: internet → IGW → route table → public subnet → SG allows 443 → instance. OUTBOUND from private app (e.g. calling an API): instance → route via NAT GW → IGW → internet. DB in private subnet: no inbound from internet; only app SG allows 3306.

**Rubric:** 1 = names components. 2 = traces a request path in/out. 3 = public vs private routing + NAT direction and SG scoping.

**Why asked:** Asked in B03 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q2: Security Groups vs NACLs — stateful vs stateless, and why SG rules are inbound-only</summary>

**Model answer:** SG: instance-level virtual firewall, STATEFUL (return traffic auto-allowed), rules evaluated as a set (allow-list), no deny rules (implicit deny). NACL: subnet-level, STATELESS (must allow BOTH directions explicitly), numbered rules with allow/deny, evaluated in order. SG has no explicit deny → the 'inbound-only' phrasing is a trap: SG rules are direction-specific (inbound rules + outbound rules are separate lists) but return traffic is handled automatically (stateful). Use SGs as primary (they're the AWS best practice), NACLs as an extra layer for subnet-wide deny (e.g. block an IP range, block specific ports at subnet boundary).

**Rubric:** 1 = SG stateful vs NACL stateless. 2 = explains direction + implicit deny. 3 = the stateful-return-traffic detail + when NACLs add value.

**Why asked:** Asked in B03 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q3: How do you diagnose a blocked connection (VPC Flow Logs, SG/NACL rules, reachability analyzer)?</summary>

**Model answer:** Order: 1) reproduce + identify source/dest/port; 2) VPC Reachability Analyzer (AWS) — path-based check, tells you exactly which SG/NACL/route blocks it; 3) SG rules — is the port allowed on source AND dest SGs (both directions matter); 4) NACLs — stateless, check inbound AND outbound rules; 5) VPC Flow Logs — did packets reach the interface? ACCEPT vs REJECT records + the rule that matched; 6) routing (missing route, IGW/NAT state); 7) also verify: instance listening? (netstat/ss), service healthy. Flow logs answer 'did the packet arrive and why was it dropped'; reachability analyzer answers 'which rule blocks it'.

**Rubric:** 1 = checks SG. 2 = adds NACL + flow logs. 3 = reachability analyzer + reading ACCEPT/REJECT + full stack.

**Why asked:** Asked in B03 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q4: VPC peering vs Transit Gateway vs VPN — when each</summary>

**Model answer:** VPC peering: direct private connection between 2 VPCs (no transitive routing — must peer each pair; for a hub-and-spoke of N VPCs you need N-1 peerings). Transit Gateway: hub router connecting many VPCs + on-prem (transitive, central route control, scales to hundreds of VPCs) — the standard for multi-VPC/org networking. VPN (Site-to-Site): encrypted tunnel over internet to on-prem — for hybrid, no Direct Connect needed; slower/latency. When: 2 VPCs only → peering; many VPCs or org-wide → TGW; on-prem/hybrid → VPN (or Direct Connect for low-latency dedicated). Also: peering has no transitive routing — the gotcha that pushes teams to TGW.

**Rubric:** 1 = knows peering + VPN. 2 = TGW hub for scale. 3 = peering's no-transitive gotcha + hybrid choice.

**Why asked:** Asked in B03 — verify against the module's checklist items and research block.
</details>


### Load balancing & scaling

<details>
<summary>❓ Q1: ALB vs NLB vs CLB — protocol, features, and when you'd pick each</summary>

**Model answer:** ALB (L7): HTTP/HTTPS/gRPC/WebSocket, path/host routing, target groups, sticky sessions (cookie), WAF integration, slow start — for HTTP apps needing routing rules. NLB (L4): TCP/UDP/TLS passthrough, extreme throughput, static IPs, preserve client IP, handles millions of rps — for raw TCP, non-HTTP protocols, or when ALB L7 overhead is unwanted. CLB (classic): legacy, both L4+L7, no modern features — only for old stacks. Pick: HTTP/gRPC with routing → ALB; TCP/UDP/performance → NLB; EKS internal services → NLB for NodePort or ALB via ingress.

**Rubric:** 1 = names the three. 2 = L7 vs L4 mapping. 3 = feature-driven pick (routing vs throughput) + EKS/ingress context.

**Why asked:** Asked in B03 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q2: How does an ASG work with an ELB — health checks, cooldown, lifecycle hooks, scaling policies</summary>

**Model answer:** ASG manages instance count; ELB distributes traffic to the ASG's instances (target group). Health checks: ELB health check (HTTP/TCP) → unhealthy instances deregistered + replaced by ASG (ELB health is used when configured as the ASG health check type). Cooldown: delay after a scaling action before another (prevents oscillation) — replaced by instance warm-up with target tracking. Scaling policies: manual, scheduled, simple (threshold), step, or target-tracking (best: e.g. keep CPU @ 50%); scale-out fast, scale-in slow (hysteresis) to avoid thrash. Lifecycle hooks: pause instances during scale-in/out to run custom actions (drain, register with CMDB, run final scripts). Launch template + min/max/desired define capacity.

**Rubric:** 1 = ASG + ELB pair instances. 2 = health-check-driven replacement + cooldown. 3 = target-tracking + lifecycle hooks + slow scale-in.

**Why asked:** Asked in B03 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q3: Target groups, sticky sessions, and connection draining — what problem does each solve?</summary>

**Model answer:** Target groups: logical group of instances (by port/protocol) that a listener routes to — enables path-based routing to different backends (e.g. /api → API group, /static → web group) and health checks per group. Sticky sessions: pin a client to the same instance via cookie — for session state not in a shared store (caveat: unbalanced traffic; prefer stateless + shared sessions). Connection draining: when an instance deregisters (scale-in/replace), ELB stops new connections but lets in-flight requests finish (deregistration delay, default 300s) — prevents cutting active requests during deploys/scaling. Together: healthy routing (groups), consistent session (sticky), graceful removal (draining).

**Rubric:** 1 = one-line each. 2 = explains the problem each solves. 3 = sticky-vs-shared-session tradeoff + draining during deploys.

**Why asked:** Asked in B03 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q4: Route 53 routing policies: simple, weighted, latency, failover — give a use case for each</summary>

**Model answer:** simple: single record → one target (one web server). weighted: distribute % across targets (canary 5% → new version; A/B testing). latency: route to lowest-latency region (global app across US/EU/AP — users hit nearest). failover: primary/backup with health checks (active-passive DR — fail to standby region when primary health check fails). geolocation: route by user location (compliance, local content). Also: multivalue (random healthy), geoproximity (traffic flow + bias). Use alias records for AWS resources (ELB/S3/CloudFront) — free, no extra DNS charge, auto IP changes.

**Rubric:** 1 = names policies. 2 = matches a use case to each. 3 = alias-vs-CNAME + canary weighted + DR failover design.

**Why asked:** Asked in B03 — verify against the module's checklist items and research block.
</details>


### IAM & security

<details>
<summary>❓ Q1: IAM policy structure: Effect/Action/Resource/Condition — write a least-privilege S3 policy from scratch</summary>

**Model answer:** Structure: {"Version": "2012-10-17", "Statement": [{"Effect": "Allow", "Action": ["s3:GetObject"], "Resource": ["arn:aws:s3:::my-bucket/*"], "Condition": {"IpAddress": {"aws:SourceIp": "10.0.0.0/8"}}}]}. Least-privilege S3: allow only the actions needed (s3:GetObject, not s3:*), scope Resource to the bucket + prefix (arn:...:my-bucket/app/*), add conditions (IP range, Requester pays, VPC endpoint), Deny explicit where needed (e.g. deny s3:PutObject without encryption: Condition StringNotEquals s3:x-amz-server-side-encryption AES256). Prefer managed policies for common jobs; inline for unique. Key principles: deny-by-default, narrow actions/resources, least-privilege conditions.

**Rubric:** 1 = Effect/Action/Resource. 2 = scopes resource + condition. 3 = least-privilege example + encryption condition + deny pattern.

**Why asked:** Asked in B03 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q2: Roles vs users vs instance profiles — when does an EC2 get credentials and how?</summary>

**Model answer:** Users: long-lived creds for humans (access keys, MFA). Roles: identity for entities to ASSUME (no long-lived keys; temporary creds via STS, 15min-12h). Instance profiles: the container that lets an EC2 instance assume a role — you attach an instance profile to the instance; the instance gets temporary creds via the metadata service (IMDSv2 recommended). The EC2 should NEVER have access keys — it assumes a role via its profile. When: humans → users (with MFA); EC2/services → roles (least-privilege per instance); cross-account → assume-role. Pattern: web instances get a role scoped to read their bucket; DB instances a role for backups.

**Rubric:** 1 = users vs roles basics. 2 = instance profile + metadata creds. 3 = no-access-keys-on-EC2 rule + IMDSv2 + least-privilege roles.

**Why asked:** Asked in B03 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q3: How do you scope an IAM role for a CI/CD pipeline (short-lived creds, external ID)?</summary>

**Model answer:** CI/CD needs temporary creds per job, scoped narrowly. Design: 1) OIDC federation — GitHub Actions/GitLab/GitHub OIDC provider: the pipeline assumes a role WITHOUT long-lived keys (trust policy checks the OIDC sub/aud claim → repo + branch/ref); 2) External ID (if a third party assumes the role) — a secret-ish string the trust policy requires, prevents confused-deputy; 3) role scoped to the job: deploy role can only write to the target env's resources (e.g. ECR push + specific S3 + ECS update), NOT full admin; 4) session duration + permissions boundary; 5) audit via CloudTrail. The answer to watch: no static AWS keys in CI secrets — OIDC federation is the modern pattern.

**Rubric:** 1 = mentions short-lived creds. 2 = OIDC federation + scoped role. 3 = trust policy (sub/aud) + External ID + permissions boundary + CloudTrail audit.

**Why asked:** Asked in B03 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q4: What is the AWS shared responsibility model and where does IAM sit in it?</summary>

**Model answer:** AWS secures the CLOUD (physical data centers, hardware, network, managed service internals, hypervisor); customer secures IN THE cloud (OS, app code, data, network config, IAM, encryption of customer data). IAM is customer responsibility — identity and access management for users, roles, policies, MFA, and audit. For managed services (RDS, S3) AWS handles more (patching, storage), but access control to YOUR data is still yours. Know where each service falls: S3 = customer manages data/permissions; Lambda = AWS runtime, customer code/perms.

**Rubric:** 1 = 'AWS physical, you logical'. 2 = IAM is customer-side + examples. 3 = per-service nuance (managed vs self-managed) + data classification.

**Why asked:** Asked in B03 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q5: AWS Organizations & SCPs — how do SCPs act as guardrails that override IAM, and what's a multi-account OU strategy?</summary>

**Model answer:** AWS Organizations: manage many accounts centrally — OUs (organizational units) group accounts (prod/dev, business units); SCPs (Service Control Policies) are guardrails applied at the org/OU/account level that OVERRIDE IAM: they cap the maximum permissions anyone in that account (including root) can have. E.g. SCP 'deny disabling CloudTrail', 'deny public S3 buckets in prod OU', 'deny leaving the org'. SCPs are not grants — they subtract from IAM's effective permissions (IAM allow ∩ SCP allow = effective). Multi-account strategy: separate accounts per env (dev/stage/prod) + security/logging account + sandbox; OUs per business unit; guardrails per OU (prod stricter: no root keys, MFA required, public access denied); centralized CloudTrail/Config in the audit account; cross-account roles for access. Why it matters: IAM alone can't enforce org-wide policy — a developer with account admin can still do anything in their account; SCPs make the guardrail structural.

**Rubric:** 1 = 'SCPs override IAM'. 2 = OU hierarchy + deny examples. 3 = IAM∩SCP effective-permission model + full multi-account architecture.

**Why asked:** Multi-account strategy is standard enterprise AWS — SCP-as-guardrail is exactly what mid-level interviews probe beyond single-account IAM.
</details>


### Cost & FinOps

<details>
<summary>❓ Q1: Your bill doubled — walk me through your investigation order (Cost Explorer, tags, unused resources)</summary>

**Model answer:** Order: 1) Cost Explorer — daily spend by service (which service jumped); 2) group by linked account/region/tag to isolate; 3) drill to the resource: EC2 (unused instances, oversized), NAT GW hours (expensive!), data transfer (egress!), S3 (class transitions, versioning growth), RDS; 4) look for: instances left running after tests, forgotten dev environments, EIPs, unattached volumes, snapshots piling up, data egress spikes (NAT/CloudFront); 5) check anomaly alerts + budgets for recurrence. Communicate: exact service + region + time window + fix. Common culprits: NAT gateways, EBS snapshots, orphaned resources, spot termination refills, license/RI expiry.

**Rubric:** 1 = opens Cost Explorer. 2 = service-level isolation + common culprits. 3 = full drill-down + recurrence prevention (alerts, cleanup automation).

**Why asked:** Asked in B03 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q2: Right-sizing: how do you find over-provisioned instances and what's the fix?</summary>

**Model answer:** Find: CloudWatch metrics per instance (CPU/mem/network utilization over 14-30 days) + Trusted Advisor / Compute Optimizer (recommends size changes by utilization pattern). Look for: avg CPU < 10-20%, memory underused, spiky usage on T-series. Fix: 1) downsize (change instance type — requires stop/start or in-place for same family); 2) for spiky: burstable (T3/T4g) with credits; 3) consolidate multiple underused instances; 4) verify app behavior after resize (re-baseline); 5) automate: rightsizing reports monthly + budgets alert on spend. Compute Optimizer is the free, data-driven answer — use it over guesswork.

**Rubric:** 1 = checks CPU. 2 = Compute Optimizer + CloudWatch window. 3 = resize decision (steady vs spiky) + verify-after + recurring review.

**Why asked:** Asked in B03 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q3: Spot/reserved/Savings Plans: how would you design a cost strategy for dev vs prod?</summary>

**Model answer:** Dev: spot-first (interruptible is fine for test/CI — use spot fleet/mixed ASG), T-series burstable for light work, stop non-work-hours (scheduling), no reserved commitment. Prod: baseline (always-on) → Savings Plans/Reserved (steady load), spot for elastic/fault-tolerant overflow (batch workers, canary pools with min on-demand), on-demand for the irreducible core. Global: tagging + budgets + anomaly alerts on both; rightsizing reviews monthly. The mix: cover predictable baseline with SP/RI (~60-70%), use spot for burst, keep small on-demand buffer.

**Rubric:** 1 = spot dev + reserved prod. 2 = Savings Plans + scheduling dev. 3 = the percentage mix + tagging/budget guardrails + spot-overflow design.

**Why asked:** Asked in B03 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q4: How do you enforce tagging and budgets so costs don't recur (Budget alerts, anomaly detection)?</summary>

**Model answer:** Enforce tagging: 1) tag policies (AWS Organizations) — required tags (env, owner, cost-center) with allowed values; 2) deny un-tagged resource creation via SCP/IAM condition (aws:RequestTag / aws:ResourceTag) — or at least require env/owner; 3) automation to fix/flag missing tags (Config rule + remediation). Budgets: AWS Budgets (monthly + forecast) alerting at thresholds (50/80/100%+) to email/Slack/chatbot; anomaly detection (Cost Anomaly) for unexpected spikes; SCP to cap spending (hard limits) on dev accounts. Recurrence: weekly cost review, rightsizing reports, cleanup automation (idle resources), cost-allocation tags feeding dashboards.

**Rubric:** 1 = budgets + alerts. 2 = tagging enforcement + anomaly detection. 3 = SCP deny + Config remediation + recurring review cadence.

**Why asked:** Asked in B03 — verify against the module's checklist items and research block.
</details>


### Module research

<details>
<summary>❓ Q1: Compute: EC2 (types by use: general/compute/memory/storage/accelerated; T2 burstable), on-demand vs spot vs reserved, stop vs terminate, key pairs, AMI components, private IP immutable</summary>

**Model answer:** EC2 families map to workload bottleneck (M general, C compute, R memory, I/D storage, G/P accelerated); T = burstable (CPU credits). Pricing: on-demand (flex), spot (90% off, reclaimable), reserved/SP (commit for baseline). stop keeps EBS, terminate destroys root volume. Key pairs = SSH auth; AMI = OS+config template (region-scoped); private IP persists across stop/start (bound to the ENI); public IP may change unless an EIP is attached.

**Rubric:** 1 = family mapping. 2 = pricing + stop/terminate. 3 = burstable credits + AMI/region + IP immutability nuance.

**Why asked:** Asked in B03 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q2: Network: VPC (200 subnets max), subnets/AZ, IGW/NAT, security groups (stateful, inbound-only rules) vs NACLs (stateless, explicit in+out), CloudWatch + VPC Flow Logs for monitoring</summary>

**Model answer:** VPC = isolated network; subnets are AZ-scoped (max 200/VPC); IGW = internet gateway; NAT = outbound-only for private. SG = stateful instance firewall (allow-list, return auto-allowed); NACL = stateless subnet firewall (in+out explicit). Monitor with CloudWatch (network metrics) + VPC Flow Logs (ACCEPT/REJECT records for audit/debug).

**Rubric:** 1 = VPC/subnet/IGW. 2 = SG vs NACL statefulness. 3 = flow logs + NAT direction + subnet-AZ design.

**Why asked:** Asked in B03 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q3: Storage: S3 storage classes (Standard/IA/RRS/Glacier), multipart upload >100MB, S3 as REST service, EBS vs instance store, connection draining (ELB)</summary>

**Model answer:** S3 classes: Standard (hot) → IA (infrequent, retrieval fee) → Glacier/Deep Archive (archive, minutes/hours). Multipart upload for >100MB (parallel, resumable); S3 is a REST service (HTTP API, no mounting). EBS = durable network block storage; instance store = ephemeral local (fast, lost on stop). Connection draining = ELB lets in-flight requests finish before deregistering an instance.

**Rubric:** 1 = storage classes. 2 = multipart + EBS vs instance store. 3 = REST model + lifecycle + draining.

**Why asked:** Asked in B03 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q4: DNS/CDN: Route 53 (global DNS, nearest DC routing), CloudFront (Geo-Targeting)</summary>

**Model answer:** Route 53 = AWS DNS (global, latency/geolocation routing, health checks, alias records). CloudFront = CDN (edge caching, TLS termination, Geo-Targeting/restrictions, WAF integration) — put CloudFront in front of S3/ALB for latency + cost + DDoS protection.

**Rubric:** 1 = what each is. 2 = routing policies + edge caching. 3 = geo-targeting + WAF + origin design.

**Why asked:** Asked in B03 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q5: IAM: roles, federated access, Power User vs Admin, password policies, least privilege</summary>

**Model answer:** Roles = assumed identity (temp creds); federated access = SSO/IdP (SAML/OIDC) letting corporate users assume roles; Power User = full services but NO IAM; Admin = IAM too; password policies = complexity/rotation/MFA enforcement; least privilege = minimal actions/resources, deny-by-default, reviewed. Apply: humans via federation + MFA, machines via roles, no shared keys.

**Rubric:** 1 = roles vs users. 2 = federation + Power User vs Admin. 3 = least-privilege workflow + MFA + credential review.

**Why asked:** Asked in B03 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q6: Scaling/HA: AZ vs Region, autoscaling lifecycle hooks, consistency models (eventual vs strong), RTO/RPO</summary>

**Model answer:** AZ = failure-isolated data center (redundancy within region); Region = full independence (DR, compliance). Autoscaling: target-tracking + lifecycle hooks (drain/register). Consistency: strong (RDS, single-node reads) vs eventual (DynamoDB default, replication lag) — pick by correctness needs. RTO (time to recover) / RPO (data loss tolerance) define DR targets — cross-AZ for HA, cross-region for DR.

**Rubric:** 1 = AZ vs region. 2 = autoscaling + consistency. 3 = RTO/RPO-driven DR design + hook use.

**Why asked:** Asked in B03 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q7: Service model: IaaS/PaaS/SaaS, Snowball (data transfer), CloudWatch alarms</summary>

**Model answer:** IaaS = raw compute/storage you manage (EC2, EBS); PaaS = managed platform (RDS, EKS, Lambda — you manage less); SaaS = fully managed product (S3, CloudFront, SES). Snowball = physical device for large data migration (petabytes over slow links). CloudWatch alarms = threshold alerts on metrics (with SNS actions) — the base monitoring primitive.

**Rubric:** 1 = defines the three. 2 = example mapping. 3 = Snowball use case + alarm design (thresholds, SNS, auto-remediation).

**Why asked:** Asked in B03 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q8: Cost & FinOps: right-sizing from CloudWatch metrics, spot vs reserved mix + Savings Plans, tagging strategy + cost allocation tags, AWS Budgets + anomaly detection alerts, idle cleanup (unattached EBS, unused EIPs, stopped instances)</summary>

**Model answer:** FinOps loop: right-size (CloudWatch/Compute Optimizer), mix (spot for elastic + SP/RI for baseline + on-demand buffer), tag everything (cost allocation tags → dashboards), budget alerts (thresholds + forecast) + anomaly detection, idle cleanup automation (unattached EBS, unused EIPs, stopped instances, old snapshots). Make cost a team metric via tagged dashboards + reviews.

**Rubric:** 1 = right-sizing + spot. 2 = tagging + budgets. 3 = full FinOps loop + cleanup automation + team accountability.

**Why asked:** Asked in B03 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q9: ELB specifics: ALB vs NLB vs CLB, target groups, health checks, sticky sessions, connection draining</summary>

**Model answer:** ALB = L7 (HTTP routing, path/host, target groups); NLB = L4 (TCP/UDP, static IP, high throughput); CLB = legacy. Target groups = listener → backend sets with per-group health checks; sticky sessions = cookie-pinned affinity; connection draining = graceful deregistration (in-flight completes).

**Rubric:** 1 = ALB vs NLB. 2 = target groups + health checks. 3 = sticky/draining semantics + pick criteria.

**Why asked:** Asked in B03 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q10: Route 53 routing policies: simple / weighted / latency / failover / geolocation, alias vs CNAME records</summary>

**Model answer:** simple = one target; weighted = % split (canary); latency = nearest region; failover = active/passive with health checks; geolocation = by user location. Alias records = AWS-native (free, auto IP updates, works at zone apex) vs CNAME (only subdomains, extra lookup, can't be apex).

**Rubric:** 1 = names policies. 2 = use-case mapping. 3 = alias-vs-CNAME + health-check-driven failover.

**Why asked:** Asked in B03 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q11: IAM deep: policy structure (Effect/Action/Resource/Condition), inline vs managed policies, roles vs users, instance profiles, cross-account assume-role</summary>

**Model answer:** Policy = Effect/Action/Resource/Condition statements. Managed policies = reusable/versioned (AWS + customer-managed); inline = embedded in a user/role (unique, harder to audit). Users = long-lived humans; roles = assumed (temp creds); instance profiles attach roles to EC2. Cross-account: role in target account + trust policy allowing source account/principal to assume (with External ID for third parties).

**Rubric:** 1 = policy structure. 2 = managed vs inline + instance profiles. 3 = cross-account assume-role flow + External ID + trust policies.

**Why asked:** Asked in B03 — verify against the module's checklist items and research block.
</details>


---

## B04 Observability depth — SLOs & traces

### Metrics

<details>
<summary>❓ Q1: Prometheus pull model — how does scraping work and what happens when a target is down?</summary>

**Model answer:** Prometheus PULLS metrics from targets at a configured scrape_interval (default 60s — commonly tuned to 15-30s): the server resolves the target (DNS/service discovery), does HTTP GET /metrics, parses the exposition format, and stores samples. The target must be reachable FROM the server (in k8s, this is why exporters are ClusterIP Services). When a target is down: the scrape fails, Prometheus records up{job=...}=0 for that target, continues retrying each interval, and alerts fire if up == 0 longer than a threshold. Gaps appear in the time series (no samples during downtime). No data is lost by the server (pushgateway exists for short-lived batch jobs that can't be scraped in time, but it's a workaround, not the norm).

**Rubric:** 1 = 'Prometheus scrapes endpoints'. 2 = explains interval, /metrics, up metric, retries. 3 = covers reachability (why exporters are Services), gaps, and pushgateway tradeoff.

**Why asked:** Asked in B04 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q2: Counter vs gauge vs histogram vs summary — give a real metric for each</summary>

**Model answer:** Counter: monotonically increasing count — http_requests_total (total requests). Gauge: value that goes up AND down — current temperature, in-flight requests, queue depth, node CPU. Histogram: observes values into buckets + count + sum — request latency (buckets: 0.1s, 0.25s, 0.5s...) → percentile estimation (histogram_quantile). Summary: same idea but percentiles computed CLIENT-SIDE and exposed directly (e.g. request_duration_seconds{quantile="0.99"}) — can't aggregate across instances (bug for multi-instance percentile). Prefer histograms: aggregatable, configurable buckets, alerting on quantiles works across replicas.

**Rubric:** 1 = counter vs gauge. 2 = adds histogram + summary distinction. 3 = the 'summaries don't aggregate' insight + histogram_quantile usage.

**Why asked:** Asked in B04 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q3: Labels: how do you design them to avoid cardinality explosions?</summary>

**Model answer:** Labels are the dimensions of a metric — each unique label-value combination creates a new time series. Explosion happens when label values are unbounded: user_id, request_id, IP, tenant at high cardinality, or error strings. Design rules: 1) label by bounded dimensions (endpoint, method, status_class [2xx/4xx/5xx], instance, region); 2) NEVER put IDs/high-cardinality values in labels — put them in logs or exemplars instead; 3) cap: a metric should have < ~10-20 labels and stable value sets; 4) prefer fewer, coarser labels (status_class over status); 5) monitor series count (prometheus_tsdb_head_series); 6) for tenant/request-level data use logs, not metrics. Rule of thumb: if a label can have more values than ~100 distinct known values, it will explode.

**Rubric:** 1 = knows labels = dimensions. 2 = names high-cardinality risks (user_id etc.). 3 = bounded-dimension design + series monitoring + where to push high-card data.

**Why asked:** Asked in B04 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q4: Recording rules — when to precompute and why?</summary>

**Model answer:** Recording rules precompute expensive or frequently-queried expressions into new metrics (e.g. job:http_requests_total:rate5m = sum(rate(http_requests_total[5m])) by (job)). Use when: 1) the query is expensive (aggregations over many series) and hit often by dashboards/alerts; 2) dashboards reload constantly (instant queries each time) — precompute makes them fast; 3) alerting needs consistent values (rules evaluated at fixed intervals, avoid race between queries). They also simplify dashboards (one clear metric vs a monster expression) and stabilize queries against schema changes. Cost: storage for the derived series; keep them few and deliberate.

**Rubric:** 1 = 'precompute queries'. 2 = why: speed + consistency. 3 = naming convention (level:metric:rate) + alerting stability + when NOT to (small scale).

**Why asked:** Asked in B04 — verify against the module's checklist items and research block.
</details>


### Dashboards & visualization

<details>
<summary>❓ Q1: What makes a dashboard useful at 3am — what belongs on the wall vs the page?</summary>

**Model answer:** The wall (big screen, at-a-glance): 4-8 panels that answer 'is the service healthy RIGHT NOW' — RED-style (Rate of requests, Errors, Duration) + saturation (CPU/mem/queue) + one SLO burn-rate panel. Big fonts, red-yellow-green statuses, few numbers. The page (investigation dashboard): the detailed panels — breakdowns by label (per-endpoint latency, per-instance errors), dependency views, logs/grafana links, previous-day comparison. Rule: the wall answers 'is it broken and who's on call'; the page answers 'what broke and why'. 3am test: an engineer who just woke up can tell within 5 seconds whether to page someone.

**Rubric:** 1 = 'show health'. 2 = RED metrics + SLO on wall. 3 = wall-vs-page split + the 3am drill-down path (links into logs/traces).

**Why asked:** Asked in B04 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q2: Grafana: data sources, variables, and how you avoid dashboard sprawl</summary>

**Model answer:** Data sources: Prometheus (metrics), Loki (logs), Tempo (traces), CloudWatch, etc. — Grafana is the unified UI. Variables: templated selectors (${env}, ${service}) that turn one dashboard into many — one 'service overview' dashboard parameterized by env/service instead of 30 copies. Avoid sprawl: 1) dashboards-as-code (JSON in Git, provisioned — no click-made dashboards in prod); 2) folders per team/service + naming convention; 3) template variables instead of duplicate dashboards; 4) shared library panels; 5) archive unused; 6) review cadence (dashboard hygiene like code review). Sprawl signal: 200 dashboards nobody opens and everyone re-creates.

**Rubric:** 1 = data sources + variables. 2 = variables reduce duplication. 3 = dashboards-as-code + folders/ownership + the sprawl-review cadence.

**Why asked:** Asked in B04 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q3: Red-yellow-green vs raw numbers — what do senior engineers actually look at first?</summary>

**Model answer:** On the wall: RYG — the eye finds red instantly; thresholds encode 'is this bad?' so a woken-up engineer doesn't have to know every baseline. But RYG is dangerous if thresholds are wrong or static. In investigation: raw numbers + trends — senior engineers look at the RATE and SHAPE of change (rate of errors rising, latency curve bending), not just the color. First look pattern: SLO burn + error rate (is this real?) → latency p50/p99 (how bad?) → per-label breakdown (where?) → comparison to baseline (what changed?). RYG = triage; raw trends = diagnosis. Best dashboards: RYG panels with the underlying numbers + trend sparklines together.

**Rubric:** 1 = 'colors for triage'. 2 = rate/trend focus. 3 = RYG for triage + raw-trend for diagnosis + threshold-awareness.

**Why asked:** Asked in B04 — verify against the module's checklist items and research block.
</details>


### Logs

<details>
<summary>❓ Q1: Structured vs unstructured logs — what does each give you and how do you enforce structure?</summary>

**Model answer:** Unstructured (free text): human-readable but nearly unsearchable/ungreppable at scale, can't filter by field. Structured (JSON/key-value): machine-parseable — filter by level, service, trace_id, user; power dashboards/alerts; correlate with traces. Enforce: 1) logging libraries with JSON formatters (logfmt/JSON) app-side; 2) standard field schema (ts, level, service, trace_id, message, error fields); 3) schema validation in the pipeline (reject/mark non-conforming); 4) linting/code review gate on log statements; 5) for legacy: a parser (Grok) to normalize at ingestion — but fix the source long-term. Also: log at the right level (debug/info/warn/error), include correlation IDs, never log secrets/PII.

**Rubric:** 1 = structured = parseable. 2 = JSON formatter + field schema. 3 = enforcement (formatters, validation, review gate) + correlation IDs + PII.

**Why asked:** Asked in B04 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q2: Centralized logging: EFK/ELK vs Loki — pull vs push, index vs label tradeoffs</summary>

**Model answer:** EFK/ELK: shipper (Fluentd/Fluent Bit/filebeat) PUSHES to Elasticsearch, which INDEXES full text (powerful full-text search, Kibana UI). Tradeoffs: heavy (JVM ES cluster), index management, cost grows with volume; great for deep ad-hoc text search. Loki: agent (Promtail) pushes logs, Loki indexes only LABELS (like Prometheus) — log CONTENT is stored compressed (chunks) and searched by label queries (LogQL). Much cheaper at scale, tighter Grafana integration (correlate logs/metrics), but full-text search is weaker and expensive (searching content requires scanning). Choose: deep text search/compliance → ES; Prometheus-centric, cost-sensitive, log-volume-heavy → Loki. Both are push (agent → server) — the pull/push distinction in the question is really about the storage model.

**Rubric:** 1 = EFK vs Loki names. 2 = index vs label storage model. 3 = the cost/search tradeoff + Grafana-native integration + retention.

**Why asked:** Asked in B04 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q3: How do you trace one request across 5 services using correlation IDs?</summary>

**Model answer:** The mechanism: a correlation/trace ID is generated at the entry point and PROPAGATED through every service call — via HTTP headers (X-Request-ID / W3C traceparent), message headers (Kafka), RPC metadata (gRPC). Each service logs its spans/logs with that ID; the log aggregator/tracer correlates them. Implementation: 1) middleware generates/reads the header at ingress; 2) pass it to outgoing calls (client libraries auto-propagate with OpenTelemetry); 3) every log line includes trace_id; 4) search logs by trace_id → the full path appears. Without propagation, each service logs its own ID and you can't join them. With OTel, trace_id + span_id are automatic, and the trace view shows the 5 services' timeline with latencies.

**Rubric:** 1 = 'propagate an ID'. 2 = header propagation + logging the ID. 3 = OTel auto-propagation, traceparent, and correlating logs+traces by ID.

**Why asked:** Asked in B04 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q4: Log rotation and retention — how do you avoid the disk-full-and-logs-are-the-cause trap?</summary>

**Model answer:** The trap: apps write unbounded logs → disk fills → everything breaks, and the fix (delete logs) is itself the incident. Prevention: 1) logrotate/systemd journald — size- or time-based rotation (e.g. 100MB or daily, keep N files); 2) retention policy per environment (dev: days, prod: weeks, compliance: months); 3) central shipping with local retention small (ship fast, keep little locally — local logs are for boot-time only); 4) size limits app-side (max log size, sampling debug); 5) monitor disk (alert at 70-80%) + alert on log rate spikes (a busy-loop writing GBs is a bug signal); 6) container logs: kubelet rotation (container-log-max-size/files) — Docker's json-file driver defaults can grow unbounded. Test: journalctl --vacuum-size for journald, logrotate -d dry run.

**Rubric:** 1 = logrotate exists. 2 = rotation + retention + ship-forward. 3 = app-side limits + disk alerts + log-rate spike alerts + container rotation config.

**Why asked:** Asked in B04 — verify against the module's checklist items and research block.
</details>


### Tracing

<details>
<summary>❓ Q1: Trace vs span vs context propagation — how does a trace span service boundaries?</summary>

**Model answer:** Trace = the end-to-end view of one request across all services/spans. Span = one unit of work (a service call, a DB query, a function) with name, start/end, duration, attributes, parent. A trace is a tree of spans connected by parent-child relationships. Context propagation: the trace_id + span_id travel with the request (HTTP headers/`traceparent`, message headers, gRPC metadata) so each service creates its child span attached to the same trace. Service boundaries are crossed by propagation: service A's client adds the header → service B's server extracts it and creates a span with trace_id = A's trace_id, parent = A's span_id. Without propagation, each service starts a NEW trace and the request can't be joined. OTel does this automatically (inject/extract).

**Rubric:** 1 = trace = spans tree. 2 = span = unit of work + parent-child. 3 = propagation mechanics across boundaries + OTel auto-inject/extract.

**Why asked:** Asked in B04 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q2: Sampling: head vs tail, and why trace 100% is a trap</summary>

**Model answer:** Head sampling: decide AT THE START (entry) whether to trace — keep e.g. 10% (consistent per trace, cheap, but you might drop the interesting slow request). Tail sampling: collect all spans, decide at the COLLECTOR (after seeing the full trace) — keep error traces, slow traces, or specific services 100%; discard the rest. Tail = better (keeps the important traces: errors, outliers), costs more (buffering, collector resources). 100% tracing is a trap: storage cost explodes (~GBs/hour), dashboards/queries slow, and the signal-to-noise drops — you can't find the needle in the haystack of 100x more hay. Standard practice: sample ~1-10% head for baseline + tail-keep errors/slow traces (or 100% errors via head decision on error status).

**Rubric:** 1 = head vs tail basics. 2 = tail keeps errors/slow. 3 = the cost/retention math + hybrid strategy (head baseline + tail errors).

**Why asked:** Asked in B04 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q3: OpenTelemetry: how do you instrument an app without touching business logic?</summary>

**Model answer:** Two routes: 1) AUTO-instrumentation — agents/sidecars (Java agent, Python auto-instrumentation, Node) that wrap frameworks (HTTP clients, DB drivers, message libs) via hooks — zero code changes, generates spans for incoming/outgoing calls + metrics + context propagation automatically; 2) SDK + manual spans — add `with tracer.start_as_current_span('db_query')` only where auto misses (custom logic, business-critical paths). Architecture: SDK exports OTLP to the collector (agent) → collector routes/processes (tail sampling, redaction) → backends (Tempo, Jaeger, Prometheus, Loki). Best practice: auto-instrument everything (wide, cheap), add manual spans on business-critical paths, keep business logic untouched (instrumentation in middleware/entry points).

**Rubric:** 1 = auto-instrumentation exists. 2 = SDK/agent split + OTLP collector. 3 = wide-auto + targeted-manual + collector processing (sampling, redaction).

**Why asked:** Asked in B04 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q4: How do you use a trace to find a 500ms hidden dependency?</summary>

**Model answer:** Open the trace for the slow request: the waterfall shows each span's duration. The hidden dependency appears as: 1) a span with high duration you didn't expect (an external API call, a DB query, a lock wait); 2) a gap between spans (time NOT attributed to any span — often network, DNS, connection pool wait, or framework overhead); 3) child spans showing the real cost (e.g. 480ms inside a DB call → the query/index is the problem). Drill: identify the fattest span → look at its attributes (DB statement, URL) → verify with logs/metrics (is it always slow or just now?) → fix (index, cache, timeout, retry). The 500ms might also be serialization or GC — spans expose per-phase duration.

**Rubric:** 1 = look at the waterfall. 2 = fattest span = culprit. 3 = span-vs-gap attribution + per-phase drill + cross-check with logs.

**Why asked:** Asked in B04 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q5: OpenTelemetry Collector — what role does it play between apps and backends (receivers, processors, exporters)?</summary>

**Model answer:** The Collector is the telemetry pipeline component: apps send OTLP to it (instead of directly to backends) and it ROUTES/PROCESSES and forwards to one or many backends. Architecture: RECEIVERS (OTLP, Prometheus, filelog, Jaeger — ingest from apps/agents), PROCESSORS (transform, filter, redact PII, tail-sample, batch, add resource attributes), EXPORTERS (Prometheus, Tempo/Jaeger, Loki, OTLP). Why use it: 1) decoupling — apps don't hardcode backend endpoints; change backends without touching apps; 2) central processing — sampling, redaction, enrichment in one place; 3) scale — batch/compress before export; 4) multi-backend fan-out (metrics→Prometheus, traces→Tempo). Deploy as a daemonset/agent per node + optional gateway per cluster. The rule: app → collector → backend is the production pattern, not app → backend.

**Rubric:** 1 = 'middleman between apps and backends'. 2 = receivers/processors/exporters. 3 = decoupling + central processing + agent-vs-gateway deployment.

**Why asked:** The Collector is the missing link in naive OTel answers — production telemetry flows through one, and interviewers listen for it.
</details>


<details>
<summary>❓ Q6: Grafana Alloy vs OTel Collector — when would you use the Grafana-native collector?</summary>

**Model answer:** Both are collectors (receive → process → export). Grafana Alloy (successor to Grafana Agent): Grafana-native, config in Alloy syntax (or River), built-in integrations for Prometheus/Loki/Tempo/Pyroscope, tight coupling with the Grafana stack — best when you're all-in on Grafana (metrics→Prometheus/Loki, logs→Loki, traces→Tempo) and want one binary with batteries-included exporters. OTel Collector: vendor-neutral standard — same receivers/processors/exporters, OTLP-native, works with ANY backend (Jaeger, Datadog, New Relic, self-hosted); the safe default if you may switch stacks or have mixed vendors. Choose Alloy when: Grafana is your platform and you want less config + built-in components; choose OTel Collector when: you need neutrality, existing OTel skills, or non-Grafana backends. Both support OTLP so they interoperate; Alloy can even run OTel components.

**Rubric:** 1 = both are collectors. 2 = Grafana-bundled vs vendor-neutral. 3 = adoption criteria (stack lock-in, mixed vendors) + interop.

**Why asked:** Alloy is the current-tooling question (replaced Agent in 2024) — knowing the OTel-vs-Alloy split shows your tooling knowledge is current.
</details>


### SLOs & alerting

<details>
<summary>❓ Q1: SLI vs SLO vs SLA — define each and give a real example with numbers</summary>

**Model answer:** SLI (Service Level Indicator): the MEASURED metric — e.g. 'availability = successful requests / total requests' or 'p99 latency'. SLO (Service Level Objective): the TARGET you set internally — e.g. '99.9% availability over 30 days' (error budget = 43 min/month). SLA (Service Level Agreement): the COMMITMENT to customers, often with penalties — usually LOOSER than the SLO (e.g. SLA 99.5%, SLO 99.9% — internal buffer). Example: SLI = % of requests with 200-499 (excluding known 5xx?)... properly: success rate; SLO = 99.9% monthly; SLA = 99.5% with service credits. The key: SLOs are internal engineering targets, SLAs are legal/business; SLO must be stricter than SLA (never the reverse).

**Rubric:** 1 = defines the three. 2 = example with numbers + SLI formula. 3 = SLO-stricter-than-SLA buffer + error budget tie-in.

**Why asked:** Asked in B04 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q2: Error budgets: how do you decide when to freeze features? Walk through the math</summary>

**Model answer:** Error budget = allowed failure in the SLO window: 100% - SLO%. For 99.9%/30d: budget = 0.1% × 30d = 43.2 min/month. Track consumption: convert outages to minutes (e.g. 10 min downtime = 23% of budget gone). Freeze rule: when budget is exhausted or nearly (e.g. < 5% remaining), feature velocity pauses until it regenerates — teams fix reliability first (canaries, capacity, bugs). Math example: 99.9% SLO, 30-day window = 43.2 min budget; a 20-min incident burns ~46%; two such incidents exhaust it → freeze + reliability sprint. The budget converts 'reliability is important' into a number teams can trade against velocity.

**Rubric:** 1 = budget = 100 - SLO. 2 = computes minutes + consumption. 3 = freeze-threshold policy + budget as velocity-vs-reliability currency.

**Why asked:** Asked in B04 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q3: Alert on symptom or cause? Give an alert that follows the rule and one that breaks it</summary>

**Model answer:** Rule: alert on SYMPTOMS (user-visible: error rate, latency, availability) not CAUSES (CPU high, disk filling, queue depth). Cause-alerts fire when nothing is wrong for users and miss real issues (a dependency down but CPU low). Symptom alert (good): 'error rate > 1% for 10 min on checkout service' — user impact signal. Cause alert (bad): 'CPU > 85% on checkout-node-3' — CPU may be fine to be high (busy = good); the alert pages engineers for non-issues. The nuance: cause alerts are useful as DIAGNOSTIC context (dashboards), but pages should be symptom-driven; SLO burn-rate alerts are the gold standard (symptom + urgency).

**Rubric:** 1 = 'alert on symptoms'. 2 = explains why cause-alerts misfire. 3 = symptom paging + cause-as-context + burn-rate alerting.

**Why asked:** Asked in B04 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q4: What's the difference between alerting on burn rate vs static thresholds?</summary>

**Model answer:** Static threshold: alert when metric crosses a fixed value (error rate > 5%) — simple but ignores SLO: 5% for 2 min (fine) and 4.9% for 3 weeks (budget blown) look different. Burn rate: measures how fast you're consuming the ERROR BUDGET relative to the SLO window — e.g. a sustained 14.4x burn exhausts a 30-day/99.9% budget in ~2 days (budget = 0.1% × 720h = 43.2 min; exhaustion = window / burn rate); multi-window burn-rate alerting (e.g. 14.4x over 1h OR 6x over 6h) catches both sudden spikes and slow bleeds. It ties paging directly to SLO impact: burn 14.4x (budget in 2 days) → page immediately; 1x (steady state) → don't page. Static thresholds are easier; burn-rate is SLO-correct.

**Rubric:** 1 = static = fixed threshold. 2 = burn rate = budget consumption. 3 = multi-window (fast+slow burn) + the 'steady state never pages' property.

**Why asked:** Asked in B04 — verify against the module's checklist items and research block.
</details>


### Module research

<details>
<summary>❓ Q1: Definitions: SLI vs SLO vs SLA (measurable indicator, internal target, legal commitment); error budgets</summary>

**Model answer:** SLI = measured indicator (availability, latency); SLO = internal target on the SLI (99.9% monthly); SLA = contractual commitment to customers (usually looser + penalties). Error budget = 100% - SLO% (allowed failure time); spent by incidents, regenerates each window; exhaust → freeze features. SLO > SLA always.

**Rubric:** 1 = three definitions. 2 = example numbers. 3 = SLO>SLA buffer + budget mechanics.

**Why asked:** Asked in B04 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q2: Three pillars: metrics, logs, traces; observability vs monitoring (unknown unknowns)</summary>

**Model answer:** Metrics = numbers over time (what's happening); logs = discrete events with context (what happened); traces = request paths across services (why). Observability = being able to ask NEW questions of production data without new instrumentation (unknown unknowns — correlate metrics→logs→traces via IDs); monitoring = watching known signals against thresholds (known unknowns). Good systems unify: metric spikes drill into traces, traces jump to logs.

**Rubric:** 1 = names the pillars. 2 = observability vs monitoring. 3 = correlated workflows + unknown-unknowns framing.

**Why asked:** Asked in B04 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q3: Prometheus: pull model, metrics types (counter/gauge/histogram/summary), labels, recording rules, alerting (Alertmanager), exporters, pushgateway</summary>

**Model answer:** Pull model: server scrapes /metrics. Types: counter (increasing), gauge (up/down), histogram (buckets → percentiles), summary (client-side percentiles, non-aggregatable). Labels = dimensions (bounded!). Recording rules precompute expensive queries. Alertmanager: dedup/group/route alerts (paging, Slack). Exporters: node-exporter, kube-state-metrics, cAdvisor translate system state into metrics. Pushgateway: for short-lived batch jobs (scrape-while-alive workaround, not for regular services).

**Rubric:** 1 = pull + types. 2 = labels + Alertmanager. 3 = exporters + pushgateway caveats + recording rules.

**Why asked:** Asked in B04 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q4: Grafana: dashboards, data sources, alerting, variables; Loki for logs; Tempo for traces; OpenTelemetry (vendor-neutral instrumentation)</summary>

**Model answer:** Grafana = unified observability UI: dashboards over Prometheus, Loki (logs, LogQL), Tempo (traces), CloudWatch etc.; variables template dashboards (env/service); alerting built-in (with annotations). OpenTelemetry = vendor-neutral instrumentation SDK + collector producing OTLP → Tempo/Jaeger/any backend. Stack story: OTel instruments → Prometheus/Tempo/Loki store → Grafana correlates.

**Rubric:** 1 = Grafana as UI. 2 = Loki/Tempo roles. 3 = OTel → OTLP → backends → Grafana pipeline.

**Why asked:** Asked in B04 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q5: Stack on K8s: node-exporter, kube-state-metrics, cAdvisor; EFK/ELK for logs (filebeat/Fluentd -> ES -> Kibana)</summary>

**Model answer:** node-exporter: host metrics (CPU/mem/disk per node); kube-state-metrics: Kubernetes OBJECT metrics (deployments, replicas, pods status — derived from API, not runtime); cAdvisor (built into kubelet): container resource usage (per-pod CPU/mem). Logs: filebeat/Fluentd (daemonset) → Elasticsearch → Kibana (EFK/ELK). Modern: Prometheus stack for metrics + Loki for logs + Grafana.

**Rubric:** 1 = three exporters' roles. 2 = EFK flow. 3 = the 'what each exporter sees' distinction (host vs k8s objects vs containers).

**Why asked:** Asked in B04 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q6: APR (Accelerated Problem Resolution): monitoring & alerting -> rapid diagnosis -> mitigation -> post-mortem -> improvement</summary>

**Model answer:** APR = the incident workflow loop: 1) monitoring & alerting (detect); 2) rapid diagnosis (metrics/logs/traces — know what to look at first); 3) mitigation (restore service: rollback, reroute, scale — fix symptoms first); 4) post-mortem (blameless, root cause, timeline); 5) improvement (action items → code/alerting/config changes) → loop tightens. Key: it's a CYCLE — each incident improves detection and response time for the next.

**Rubric:** 1 = names stages. 2 = mitigation-before-root-cause. 3 = the improvement loop + measuring MTTA/MTTR.

**Why asked:** Asked in B04 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q7: Practical: build a monitoring strategy for a service that has none (classic SRE question)</summary>

**Model answer:** 1) Define SLIs from user journey: availability (success rate), latency (p50/p99), throughput, saturation (CPU/mem/queue); set SLO + error budget. 2) Instrument: app metrics (RED per endpoint), logs (structured + trace IDs), traces (OTel auto + key spans); exporters for infra (node/container). 3) Collect: Prometheus scrape + Loki/ES + Tempo; dashboards (wall RED + investigation page). 4) Alert: SLO burn-rate + symptom alerts, routed via Alertmanager with runbooks. 5) Review: error budget tracking, on-call, post-incident improvements. Prioritize: start with availability + latency SLI and ONE good alert — don't build 50 dashboards.

**Rubric:** 1 = metrics + alerts. 2 = SLI/SLO + RED + dashboards. 3 = full loop with prioritization (start small, iterate) + runbooks.

**Why asked:** Asked in B04 — verify against the module's checklist items and research block.
</details>


---

## B05 CI/CD as a product — GitOps & canary

### Pipeline design

<details>
<summary>❓ Q1: Design a production pipeline: lint → test → build → push → deploy — where do gates, caching, and secrets live?</summary>

**Model answer:** Stages: lint (style/static) → test (unit → integration; fast feedback) → build (compile, produce artifact) → scan (SAST, image scan) → push (registry, immutable tag) → deploy (staging then prod with gates). Gates: quality gates (tests pass, coverage threshold, scan severity) between stages; approval gate (manual) before prod. Caching: dependencies (package cache, Docker layer cache, Go module cache) shared across runs — speeds up the 90% repeated work; cache keyed on lockfiles. Secrets: injected ONLY at runtime into the job (vault/secret manager), never in the repo or build args (visible in image history); scoped per environment. Key design: fail fast (lint/test early), build once deploy many (one artifact through all envs), secrets short-lived + least-privilege.

**Rubric:** 1 = lists stages. 2 = places gates/caching/secrets roughly right. 3 = build-once artifact + immutable tags + secret-injection timing + scan placement.

**Why asked:** Asked in B05 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q2: Build once, deploy many — how do you avoid rebuilding per environment?</summary>

**Model answer:** Principle: CI builds the artifact ONCE (image tagged with immutable SHA, binary with version); every environment deploys THE SAME artifact with env-specific config. Avoid rebuilding: 1) immutable image tag (commit SHA — not 'latest') — same bytes everywhere; 2) config injection at deploy: env vars, ConfigMaps/secrets mounted per env (kubectl set env / Helm values / Kustomize overlays), NOT baked into the image; 3) artifact promotion: promote the same image reference through dev → staging → prod (registry copy + tag promotion, e.g. dev-sha → stage-sha); 4) environment-conditional code via feature flags, not rebuilds. Why: rebuilding per env means you test different bytes than you deploy (the 'works in dev' lie); build-once guarantees prod = what was tested.

**Rubric:** 1 = 'same artifact everywhere'. 2 = immutable tag + config-injection. 3 = artifact promotion model + feature flags + why it prevents env-divergence bugs.

**Why asked:** Asked in B05 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q3: Pipeline as code: Jenkinsfile vs GitHub Actions workflow — structure, stages, artifacts</summary>

**Model answer:** Jenkinsfile: groovy, runs on Jenkins agents; structure = pipeline { agent; stages { stage('build'){ steps } } }; artifacts via archiveArtifacts; plugins for everything; stateful master + agents. GitHub Actions: YAML in .github/workflows; jobs with steps on runners (Ubuntu/windows/self-hosted); artifacts via actions/upload-artifact; matrix builds; events trigger (push/PR); marketplace actions. Both are pipeline-as-code (Git is source of truth, PR review, versioned). Tradeoffs: Actions = cloud-native, simpler, faster to start, no infra; Jenkins = full control, self-hosted agents (compliance), mature plugin ecosystem, runs anywhere. Pick by: existing infra, compliance, scale.

**Rubric:** 1 = both are as-code. 2 = stage/job structure + artifacts. 3 = tradeoffs (managed vs self-hosted, ecosystem) + matrix/caching.

**Why asked:** Asked in B05 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q4: Your pipeline is the bottleneck — where do you speed it up (cache, parallel, selective runs)?</summary>

**Model answer:** Order of impact: 1) caching (dependency + build caches — usually the biggest win); 2) parallelism: parallel stages/jobs (lint + unit + integration concurrently), matrix builds across shards, test splitting by duration; 3) selective runs: path filters (docs-only changes skip full build), skip on draft PRs, monorepo affected-module detection; 4) faster runners (bigger machines) for compile-heavy stages; 5) build once / artifact reuse (don't rebuild in deploy); 6) reduce redundant steps (single quality gate vs re-running). Measure: pipeline duration by stage (where's the time?) — optimize the longest with data, not guesses.

**Rubric:** 1 = caching. 2 = parallelism + path filters. 3 = measure-first (stage timings) + sharded tests + selective monorepo runs.

**Why asked:** Asked in B05 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q5: DORA metrics — what are the Four Key Metrics and how do you instrument them from CI/CD data?</summary>

**Model answer:** The Four Key Metrics (DORA State of DevOps, the industry-standard performance model): 1) Deploy Frequency — how often you ship to production (throughput); 2) Lead Time for Changes — commit → production (throughput); 3) Change Failure Rate — % of deploys causing failure/rollback (stability); 4) Mean Time to Restore (MTTR) — time to recover from a failure (stability). Instrument from CI/CD event data: record deploy events (timestamp + commit + environment) in a metrics pipeline — e.g. export from GitHub Actions/GitLab/Jenkins via API/webhooks, or emit a deploy event metric from the pipeline itself; store in Prometheus/Grafana or a simple warehouse; failures = rollback/failed deploy + incident correlation. Dashboards per team + targets (elite performers: deploy on-demand, lead time < 1 day, CFR < 15%, MTTR < 1 hr). Use them to drive improvement conversations and tie delivery to outcomes — the 'how do you know your pipeline is improving?' answer.

**Rubric:** 1 = names the four. 2 = deploy frequency + lead time + CFR + MTTR definitions. 3 = instrumentation from CI/CD events + elite targets + improvement loop.

**Why asked:** DORA is the standard answer to 'how do you measure delivery' — the four metrics + how you'd instrument them is the modern expectation.
</details>


### Environments & gates

<details>
<summary>❓ Q1: dev → staging → prod — what's promoted and what changes between environments (config, not code)?</summary>

**Model answer:** Promoted: THE SAME artifact (image/commit) — code never changes between envs. Changes: configuration (endpoints, feature flags, resource sizes), credentials (env-specific secrets), scale (replica counts), data (dev = synthetic, staging = production-like anonymized). The promotion is config + artifact reference, not a rebuild. Staging exists to be as prod-like as possible (same artifact + prod-like config/data) to catch env-specific bugs. Anti-pattern: env-specific code branches, or rebuilding per env, or staging with dev-sized resources (misses capacity bugs).

**Rubric:** 1 = same artifact. 2 = config-differs framing. 3 = promotion model + prod-like staging + env-parity reasoning.

**Why asked:** Asked in B05 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q2: How do you prevent 'works on my machine' — parity, immutable artifacts, env-specific config?</summary>

**Model answer:** 1) Immutable artifacts: one image/artifact built in CI, tested, and deployed everywhere — no local builds in prod. 2) Parity: dev/staging/prod run the same artifact + prod-like config (staging mirrors prod sizing, data anonymized); 3) env-specific config OUTSIDE code: env vars/secrets/ConfigMaps per env, defaults in code for dev; 4) containerization: the runtime (OS, deps) is the image — local and prod run the same container; 5) IaC: environments defined in code (Terraform/Helm), not click-ops; 6) pre-prod verification: staging deploy + smoke tests before prod. The root fix: make the 'machine' identical (artifact + runtime) and config explicit.

**Rubric:** 1 = containers + same artifact. 2 = parity + env-config. 3 = the full stack (artifact, runtime, config, IaC, smoke gates).

**Why asked:** Asked in B05 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q3: Manual approval gates vs automated quality gates — where does each belong?</summary>

**Model answer:** Automated gates: fast, consistent, cheap — lint, unit/integration tests, security scan, deploy smoke tests. Belong: everywhere code moves forward (PR → main → staging). Manual approval: for high-risk, irreversible, or compliance-bound steps — prod deploys (business sign-off), DB migrations, cross-env promotion to prod, releases under compliance (change management). Rule: automate everything a machine can judge; keep human gates ONLY where judgment/accountability matters (prod risk, regulatory). Anti-pattern: manual gates on every step (bottleneck + error-prone) or zero manual oversight on prod (unreviewed destructive changes). Hybrid: automated gates + one manual prod approval with the plan/diff attached.

**Rubric:** 1 = auto vs manual concept. 2 = assigns each to stages. 3 = risk-based placement + anti-patterns + hybrid design.

**Why asked:** Asked in B05 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q4: How do you handle hotfixes bypassing the pipeline safely?</summary>

**Model answer:** Hotfixes should NOT bypass the pipeline — they take a FAST lane through it: 1) branch from the release tag/commit (not main, which has unreleased changes); 2) minimal diff (one focused fix); 3) run the same pipeline with reduced-but-present gates (lint, unit, the critical tests, build, scan — skip only slow optional suites); 4) deploy to staging first if feasible (even a fast smoke), then prod; 5) merge the fix back to main immediately (prevent drift). Safety rules: never deploy untested artifacts; never fix forward from a dirty tree; record the hotfix (postmortem-worthy: why did it need a hotfix?). The answer to avoid: 'I just ran the deploy manually' — that's how hotfixes become outages.

**Rubric:** 1 = 'don't bypass tests'. 2 = fast-lane branch + minimal gates. 3 = branch-from-tag + reduced-gates + merge-back + why-bypass-is-the-real-bug.

**Why asked:** Asked in B05 — verify against the module's checklist items and research block.
</details>


### GitOps

<details>
<summary>❓ Q1: GitOps principles: Git as single source of truth, declarative state, automated convergence — why is this better than kubectl apply?</summary>

**Model answer:** GitOps: 1) Git is the single source of truth for desired state (manifests/Helm/Kustomize in Git); 2) declarative state (what you WANT, not commands); 3) automated convergence — a controller (ArgoCD/Flux) continuously compares cluster state to Git and applies the diff (self-healing: manual kubectl edits get reverted, drift fixed). Better than kubectl apply: 1) auditability (every change = a commit, revert = revert commit); 2) consistency (no 'someone ran a one-off command'); 3) review/PR workflow (changes reviewed before converge); 4) multi-cluster (same Git drives many clusters); 5) disaster recovery (recreate a cluster from Git). kubectl apply from a laptop = no audit, no review, no reconciliation.

**Rubric:** 1 = 'Git is source of truth'. 2 = declarative + convergence. 3 = auditability + PR review + drift self-healing + DR-from-Git.

**Why asked:** Asked in B05 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q2: ArgoCD: how does the app controller detect and fix drift? What is OutOfSync?</summary>

**Model answer:** ArgoCD's Application controller polls (default 3 min) the Git repo + compares live cluster state vs desired (Git). If they differ → status OutOfSync (drift detected — e.g. someone kubectl-edited a Deployment, or Git changed). Fix: with Auto-Sync, ArgoCD applies the diff (reverts drift); with manual sync, an operator reviews + clicks Sync; Sync is git-to-cluster apply. OutOfSync = the reconciliation signal: it means current ≠ desired. Advanced: sync waves/order, PreSync/Sync/PostSync hooks (canary, migrations), health status (Healthy/Progressing/Degraded). Drift causes: manual kubectl, in-cluster mutations, incomplete manifests.

**Rubric:** 1 = 'compares Git to cluster'. 2 = OutOfSync = drift + auto-sync fix. 3 = sync waves/hooks + health statuses + the drift-revert behavior.

**Why asked:** Asked in B05 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q3: ArgoCD vs Flux — architecture and when you'd choose each</summary>

**Model answer:** Both GitOps controllers. ArgoCD: standalone app (3 components: API server, repo server, application controller) with a rich UI, Application CRs, sync waves/hooks, multi-cluster from one instance; great UI + SSO + RBAC. Flux: toolkit of small controllers (source-controller, kustomize-controller, helm-controller, notification-controller), more Kubernetes-native (everything is CRs), tighter GitOps-toolkit integration, no built-in UI (CLI + dashboards via plugins). Choose ArgoCD: want a UI, multi-cluster dashboard, sync hooks, quick adoption. Choose Flux: want lightweight/native, deeper kustomize/helm integration, multi-tenancy via Kustomize, or prefer 'everything is a controller'. Both fine — ArgoCD is the common default.

**Rubric:** 1 = both GitOps. 2 = ArgoCD UI vs Flux toolkit. 3 = adoption criteria + when each shines.

**Why asked:** Asked in B05 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q4: Internal developer platforms (IDP): what problem does Backstage/Port solve, and when does a platform team adopt one vs plain GitOps?</summary>

**Model answer:** Problem: developer experience + discoverability — with plain GitOps, devs must know repos, manifests, deploy processes, and where things live (the 'golden path' is tribal knowledge); Backstage/Port give: a developer portal (service catalog, self-service templates 'create a new service with CI/CD + k8s + monitoring', docs, ownership, tool integration). Adopt an IDP when: 1) teams can't find/own their services; 2) onboarding is slow; 3) self-service requests bottleneck the platform team; 4) you want standard 'golden paths' (approved patterns codified). Don't adopt early: plain GitOps + good templates/CLI suffice for small orgs — an IDP is a product investment (maintenance, adoption). Signal: platform team drowning in 'can you create a repo/env for me' tickets → IDP time.

**Rubric:** 1 = 'developer portal'. 2 = catalog + self-service templates. 3 = when (ticket bottleneck, discoverability) vs when not (small org) + golden-path value.

**Why asked:** Asked in B05 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q5: Secrets in GitOps: SOPS/External Secrets/Sealed Secrets — how do you keep Git the source of truth without leaking?</summary>

**Model answer:** Git is source of truth for DESIRED STATE, not raw secrets. Options: 1) SOPS: encrypts secret values IN the manifest (age/KMS keys), decrypts at apply (ArgoCD/Flux decrypt via plugin); keys out of Git; 2) Sealed Secrets: encrypt secret values with a cluster-bound public key → sealed YAML in Git; only the in-cluster controller can decrypt (private key never leaves cluster); 3) External Secrets Operator: store secrets in Vault/AWS SM/GCP SM, Git holds only a reference (ExternalSecret CR with the key name) → controller syncs to k8s Secret. Choose: SOPS = Git-native, portable; Sealed = zero external deps, cluster-scoped; ESO = central secret store, rotation + audit (best for scale). All keep plaintext out of Git.

**Rubric:** 1 = names the tools. 2 = mechanism of each (encrypt-in-Git vs reference). 3 = tradeoff + when ESO central store wins (rotation/audit).

**Why asked:** Asked in B05 — verify against the module's checklist items and research block.
</details>


### Progressive delivery

<details>
<summary>❓ Q1: Canary vs blue/green vs rolling — tradeoffs and how you shift traffic safely</summary>

**Model answer:** Rolling: replace instances gradually (Deployment strategy) — simple, no extra infra, but slow feedback + mixes old/new during rollout. Blue/green: two full environments; switch traffic atomically (DNS/LB swap) — instant rollback (switch back), but 2x resources + only tests the 'green' as a whole. Canary: route small % (5-10%) of real traffic to new version, observe metrics, ramp up — best risk control + real user feedback, but needs traffic-shifting + analysis tooling (Argo Rollouts, Istio, nginx). Traffic-shift safely: canary is the safest general pattern (start small, analyze, ramp); blue/green for instant switch needs; rolling when simple + fast deploys suffice. Rollback: canary = shift back; blue/green = flip; rolling = redeploy old (slower).

**Rubric:** 1 = names the three. 2 = tradeoffs + when each. 3 = canary analysis gates + rollback speed per strategy.

**Why asked:** Asked in B05 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q2: Argo Rollouts: how do analysis steps (metrics) gate a canary automatically?</summary>

**Model answer:** Argo Rollouts replaces Deployment for progressive delivery: you define a Rollout with steps — e.g. setWeight: 10 → pause → analyze: analysis runs for N minutes querying metrics (Prometheus/CloudWatch/Datadog) against a successCriteria (error rate < 1%, p99 < 300ms). If analysis PASSES → next step (20%, 50%) → 100%; if FAILS → automatic rollback to stable + the rollout aborts (AnalysisRun status: Successful/Failed/Inconclusive). AnalysisTemplates define the queries; queries use the canary's stable/canary tags to compare. This automates 'is the canary healthy' — no human watching dashboards at 2am.

**Rubric:** 1 = steps + pause. 2 = AnalysisRun queries + criteria. 3 = auto-abort/rollback on failed analysis + template reuse.

**Why asked:** Asked in B05 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q3: How do you observe a canary — what metrics prove it's safe before 100%?</summary>

**Model answer:** Compare canary vs stable on the same metrics: 1) error rate (5xx/request success — must be ≤ stable or below threshold); 2) latency p50/p99 (no regression); 3) saturation (CPU/mem/queue — new version isn't leaking); 4) business metrics if available (checkout completions, signup rate); 5) crash/restart rate, logs for new errors. Statistically: compare distributions, not single points (error rate 1.2% vs 1.0% needs enough traffic — that's why canary needs real traffic + minimum observation window). Prove safety: canary within thresholds for the analysis window + no new error signatures in logs + dependency calls healthy. Then ramp.

**Rubric:** 1 = error rate + latency. 2 = canary-vs-stable comparison. 3 = distribution stats + observation window + business metrics + log signature check.

**Why asked:** Asked in B05 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q4: What's the rollback story for each strategy — how fast, how clean?</summary>

**Model answer:** Rolling: redeploy previous version (pipeline re-run) — minutes, no isolation (old+new mixed during). Blue/green: flip the LB/DNS back to blue — seconds, clean (whole old env intact), cost: keep blue running. Canary: shift traffic back to 100% stable — seconds-to-minutes, clean (stable env always running); Argo Rollouts auto-rollback on failed analysis. GitOps: revert the commit (ArgoCD syncs back) — minutes, audit-trailed. Best story: canary/blue-green give fast, clean rollback because the old version is always ready; rolling is slowest/least clean. Rule: whatever strategy, the OLD artifact must be instantly available (never delete the previous image/helm chart).

**Rubric:** 1 = names rollback per strategy. 2 = speed + cleanliness. 3 = auto-rollback + keep-previous-artifact rule + GitOps revert.

**Why asked:** Asked in B05 — verify against the module's checklist items and research block.
</details>


### Artifacts & rollback

<details>
<summary>❓ Q1: Immutable artifacts: why tag images by SHA, never by 'latest'? What's the registry layout?</summary>

**Model answer:** Tag by commit SHA (or SHA + short metadata): each build = unique, immutable reference — you know EXACTLY what's deployed, can roll back to a specific artifact, and 'latest' is a moving target (deployed code changes without a deploy). 'latest' breaks: reproducibility (can't tell what's running), rollback (latest now = bad), and caching. Registry layout: repo per app (ecr.io/team/app), tags = <sha> or <sha>-<build>; promote via tag moves (app:stage = app:sha123) or manifest lists; keep N recent, prune old (lifecycle policy). Add semver for releases (v1.2.0 = sha). Provenance: sign + SBOM attached to the immutable tag.

**Rubric:** 1 = SHA > latest. 2 = why (reproducibility/rollback). 3 = registry layout + promotion + lifecycle pruning + provenance.

**Why asked:** Asked in B05 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q2: SBOM: what's inside your artifact and why does DevSecOps demand it?</summary>

**Model answer:** SBOM (Software Bill of Materials): machine-readable inventory of EVERY component in the artifact — base image layers, OS packages, language dependencies (npm/pip/go modules), each with versions + licenses + CVE-matching identifiers. Why DevSecOps demands it: 1) vulnerability response — a new CVE in libX → query SBOMs to find every image containing libX (instead of re-scanning everything); 2) supply-chain visibility (what's actually in the image); 3) compliance (license, attestation); 4) builds provenance (SBOM generated at build, signed, stored with the artifact). Generate: syft, trivy, cdxgen; scan against (trivy/grype); attach as OCI artifact. The answer to watch: SBOM = 'ingredients list' enabling instant CVE blast-radius queries.

**Rubric:** 1 = 'ingredient list'. 2 = generate + scan + attach. 3 = CVE-blast-radius query use case + signing + build-time generation.

**Why asked:** Asked in B05 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q3: Rollback strategies: roll forward vs roll back vs freeze — decision framework at 2am</summary>

**Model answer:** Framework: 1) Is the failure user-impacting and ongoing? (yes → act); 2) roll BACK if: a clean previous artifact exists, the bad deploy is isolated, revert is low-risk (default for deploy failures — usually fastest + safest); 3) roll FORWARD if: the fix is trivial and known (one-line config), or the regression is already deep (rollback would lose days of data/migrations); 4) FREEZE if: no deploy caused it (infra/dependency issue), rolling back won't help, or you need time to understand (freeze = stop making changes, stabilize, then diagnose). At 2am, bias to rollback (known-good) unless there's a clear forward fix. Precondition: previous artifact always available + rollback runbook tested.

**Rubric:** 1 = names the three. 2 = rollback default reasoning. 3 = the decision tree (user-impact? clean-artifact? forward-fix?) + freeze-when-unknown.

**Why asked:** Asked in B05 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q4: How do you prove a rollback worked (verification, not just 'it's deployed')?</summary>

**Model answer:** Deploying the old artifact ≠ done. Prove: 1) rollout health: pod/instance health (all replicas Ready, no CrashLoopBackOff); 2) metrics: error rate back to baseline, latency p99 restored (compare to pre-incident window); 3) user-path smoke tests: critical flows pass (login, checkout, API health); 4) logs: no new error signatures; 5) SLO/burn: burn-rate back to normal; 6) time-window: observe for a stabilization period (e.g. 15-30 min) before declaring done; 7) document evidence (dashboard links, before/after numbers). If verification fails → escalate (roll forward or investigate). 'It deployed' is a status; 'metrics are green for 30 min' is proof.

**Rubric:** 1 = health + metrics. 2 = smoke tests + baseline comparison. 3 = stabilization window + evidence capture + escalation on failed verify.

**Why asked:** Asked in B05 — verify against the module's checklist items and research block.
</details>


### Module research

<details>
<summary>❓ Q1: GitOps principles: Git = single source of truth, declarative desired state, automated convergence, auditability</summary>

**Model answer:** Git stores desired state; controllers converge cluster to Git; every change = PR/commit (audit); drift reverted automatically; rollback = revert commit; DR = recreate from Git. Beats kubectl apply (no audit, no review, no reconciliation).

**Rubric:** 1 = Git-as-truth. 2 = convergence + audit. 3 = drift-fix + DR + PR workflow.

**Why asked:** Asked in B05 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q2: ArgoCD: declarative GitOps CD for K8s; app controller continuously compares live vs desired state; OutOfSync detection</summary>

**Model answer:** Application CR points to Git path; controller polls Git + compares to live; OutOfSync = drift; sync applies diff (auto or manual); health tracking (Healthy/Degraded); sync waves + hooks for ordering.

**Rubric:** 1 = Application + sync. 2 = OutOfSync meaning. 3 = sync phases + auto-sync + health.

**Why asked:** Asked in B05 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q3: Architecture: Application Controller, Repo Server, API Server, Dex/SSO; kubectl apply -n argocd install</summary>

**Model answer:** Components: repo-server (clones/caches Git, renders manifests), application-controller (compares + syncs), API server (UI/API, RBAC, SSO via Dex/OIDC). Install: kubectl apply -n argocd -f install.yaml (bootstrap — then ArgoCD manages itself via an Application pointing at its own manifests).

**Rubric:** 1 = components. 2 = controller vs repo-server roles. 3 = bootstrap pattern (ArgoCD manages itself) + SSO.

**Why asked:** Asked in B05 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q4: Manifest sources: kustomize, helm, jsonnet, plain YAML, config management plugins</summary>

**Model answer:** ArgoCD renders from: plain YAML, Kustomize (overlays/envs), Helm (values per env), jsonnet, or CMP (config management plugins for custom templating). Choose: Helm for packaged apps (bitnami charts), Kustomize for env overlays (no templating language, native), jsonnet for complex logic.

**Rubric:** 1 = lists sources. 2 = Helm vs Kustomize roles. 3 = when each + CMP for custom.

**Why asked:** Asked in B05 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q5: Tracking: branch, tag, or pinned commit; sync policies (auto/manual), sync waves + phases, PreSync/Sync/PostSync hooks (blue/green & canary)</summary>

**Model answer:** Track branch (always latest), tag (release sets), or pinned commit (exact). Auto-sync: converge on change; manual: operator triggers (safer for prod). Sync waves order resources (0, 1, 2... — e.g. CRDs first, then apps). Hooks: PreSync (migrations), Sync (blue/green switch), PostSync (canary analysis, smoke tests).

**Rubric:** 1 = tracking options. 2 = auto vs manual sync. 3 = waves + hooks for progressive delivery.

**Why asked:** Asked in B05 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q6: Features: multi-cluster management, RBAC/multi-tenancy, SSO (OIDC/OAuth2/LDAP/SAML), rollback to any commit, drift detection, webhooks (GitHub/BitBucket/GitLab), Prometheus metrics</summary>

**Model answer:** One ArgoCD manages many clusters (cluster CRs); RBAC per project (multi-tenancy); SSO via OIDC/OAuth2/LDAP/SAML; rollback = re-sync any commit; drift detection default; webhooks for instant sync (vs 3-min poll); /metrics for monitoring the controller.

**Rubric:** 1 = multi-cluster + RBAC. 2 = SSO + webhooks. 3 = rollback-any-commit + metrics + tenancy model.

**Why asked:** Asked in B05 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q7: Flux vs ArgoCD (one-line each; ArgoCD has richer UI, Flux is tighter with GitOps toolkit)</summary>

**Model answer:** ArgoCD: standalone app with rich UI + sync hooks. Flux: lightweight toolkit of small controllers (kustomize-controller, helm-controller, notification-controller), fully CR-native. Pick by UI/tooling preference and multi-tenancy needs.

**Rubric:** 1 = one-liners. 2 = component-level contrast. 3 = adoption criteria.

**Why asked:** Asked in B05 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q8: Secret management: sealed-secrets, SOPS, External Secrets Operator</summary>

**Model answer:** Sealed Secrets: public-key-encrypt manifests in Git, in-cluster controller decrypts (no external deps). SOPS: encrypt values in manifests with age/KMS, decrypt at apply (portable). ESO: Git holds references (ExternalSecret CR), controller syncs from Vault/AWS SM (central store, rotation, audit).

**Rubric:** 1 = names the three. 2 = mechanism of each. 3 = tradeoff + ESO-at-scale reasoning.

**Why asked:** Asked in B05 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q9: Pipeline design: build once / deploy many (artifact reuse), pipeline as code (Jenkinsfile / GitHub Actions YAML / GitLab CI), stages (lint→test→build→scan→push→deploy), caching, parallel jobs, secrets injection</summary>

**Model answer:** Pipeline-as-code in Git; build once (immutable artifact) deploy many (config per env); stages lint→test→build→scan→push→deploy with gates; caching (deps/build layers); parallel jobs (matrix, sharded tests); secrets injected at runtime per env (never in repo/args).

**Rubric:** 1 = stages + as-code. 2 = caching + parallel. 3 = build-once + scan placement + secret injection timing.

**Why asked:** Asked in B05 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q10: Environments & gates: dev/staging/prod parity, manual approval gates vs auto-promote, UAT, environment-specific config, promotion vs re-deploy</summary>

**Model answer:** Same artifact + env-specific config; parity keeps staging prod-like; automated gates for quality, manual approval for prod risk; UAT = human acceptance on staging; promotion = same artifact to next env (vs re-deploy = rebuild, anti-pattern).

**Rubric:** 1 = parity concept. 2 = gate placement. 3 = promotion-vs-redeploy + UAT flow.

**Why asked:** Asked in B05 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q11: Artifacts & rollback: container registry (ECR/GHCR/Artifactory), immutable tags (sha256), semver, artifact provenance/SBOM, rollback options (revert commit vs redeploy previous artifact vs ArgoCD rollback)</summary>

**Model answer:** Registry: ECR/GHCR/Artifactory (repos per app); immutable sha256 tags + semver releases; SBOM + signature = provenance; rollback: revert Git commit (GitOps resync) vs redeploy previous artifact (same image tag) vs ArgoCD history rollback — all need the old artifact retained.

**Rubric:** 1 = registry + tags. 2 = provenance/SBOM. 3 = the three rollback paths + retain-old-artifact rule.

**Why asked:** Asked in B05 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q12: CI vs CD handoff: CI builds the artifact, CD deploys it; with GitOps nobody kubectl-applies from CI — the controller syncs from Git</summary>

**Model answer:** CI = build + test + scan + push (produces artifact). CD = deploy. GitOps handoff: CI pushes image to registry AND updates the Git manifests (image tag); the controller sees Git change → syncs cluster. Nobody kubectl-applies from CI (no direct cluster creds in CI — secure). Rollback = Git revert.

**Rubric:** 1 = CI/CD split. 2 = Git-update handoff. 3 = no-cluster-creds-in-CI + controller-sync security model.

**Why asked:** Asked in B05 — verify against the module's checklist items and research block.
</details>


---

## B06 Reliability craft — incidents & chaos

### Incident response

<details>
<summary>❓ Q1: Walk me through an incident from detection to resolution — who does what, when do you escalate?</summary>

**Model answer:** 1) DETECTION: alert/monitor fires (or user report) → confirm it's real (check dashboard, not just the alert). 2) TRIAGE: severity (user impact? scope? ongoing?) → declare incident if SEV2+; open a channel/war room; incident commander assigned (IC) + comms lead. 3) MITIGATION: restore service first (rollback, reroute, scale, feature flag off) — IC coordinates, engineers work in parallel (one investigates, one mitigates, no risky experiments). 4) ESCALATION: when not mitigated within target time, or unknown scope, or needs a specialist/other team (DBAs, vendors) — escalate up the tree (on-call → team lead → management/exec for SEV1 + external comms). 5) RESOLUTION: service restored + verified (metrics green). 6) POSTMORTEM: blameless, timeline, root cause, actions. Who: IC (command), comms (updates), operators (fix), SREs (analysis); roles rotate. Escalate EARLY — escalating is not failure.

**Rubric:** 1 = detect → fix → review. 2 = roles (IC/comms) + severity. 3 = parallel work, escalation criteria, restore-first + postmortem loop.

**Why asked:** Asked in B06 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q2: Severity levels: define SEV1–SEV3 and give the escalation criteria for each</summary>

**Model answer:** SEV1 (critical): total or major outage — core service down, revenue/availability severely impacted, data loss risk, security breach → page the full chain immediately (on-call + manager + exec comms), incident declared, war room, customer comms; target: mitigate ASAP, updates every 15-30 min. SEV2 (major): partial degradation — service slow, one feature broken, single region degraded, non-core service down → page on-call, fix within business hours target or SLO, incident channel; escalate to SEV1 if scope grows. SEV3 (minor): cosmetic/individual issues — one user affected, non-urgent bug, degraded internal tool → normal ticket/queue, no paging. Escalation criteria: user impact × scope × duration — if a SEV2 crosses a big customer or 30+ min, promote to SEV1. Define per-org with examples (and what 'resolved' means per level).

**Rubric:** 1 = rough definitions. 2 = severity × scope/duration + escalation. 3 = promotion criteria + comms cadence per level + service-specific SEVs.

**Why asked:** Asked in B06 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q3: Mitigate vs fix: why do you restore service first and debug later? Give an example</summary>

**Model answer:** Mitigation = stop the bleeding (restore users' service); fix = address root cause. Restore-first because: 1) users are impacted NOW — every minute of outage costs money/trust; 2) debugging under pressure is error-prone (you might make it worse); 3) once service is back, you debug calmly with full context. Example: a bad deploy causes 500s → roll back the deploy (mitigation, 2 min) → service restored → THEN investigate why the new version failed (fix: fix the bug, add tests, fix CI gate). Another: DB replica lag → route reads to primary (mitigate) → diagnose replication issue (fix). The discipline: never 'improve' during an incident — restore, then fix.

**Rubric:** 1 = 'restore first'. 2 = example with mitigation action. 3 = the reasoning (user cost, pressure errors) + post-incident fix loop.

**Why asked:** Asked in B06 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q4: How do you communicate during an incident (status pages, war room, stakeholder updates)?</summary>

**Model answer:** Three channels: 1) INTERNAL real-time: war room (Slack channel/video) — IC-driven, engineers post findings (with timestamps); a shared incident doc (timeline, actions, hypotheses) is the artifact; 2) STATUS PAGE (external): user-facing — 'Investigating/Identified/Monitoring/Resolved' + impact scope + ETA; update on changes (not silence); 3) STAKEHOLDERS: exec/business — brief, non-technical, cadenced (e.g. every 30 min for SEV1): what's affected, what we're doing, ETA. Rules: one voice to the outside (IC/comms lead — no conflicting updates), timestamp everything, avoid jargon on status pages, be honest ('unknown cause' beats silence), postmortem link when resolved. Communication is a first-class incident task, not an afterthought.

**Rubric:** 1 = status page + updates. 2 = war room + roles + cadence. 3 = one-voice rule + incident doc artifact + stakeholder translation.

**Why asked:** Asked in B06 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q5: Your page fires at 3am — what's your first 10 minutes in order?</summary>

**Model answer:** 1) ACK the page (or you'll get re-paged/escalated). 2) Check the alert + linked runbook/dashboard (60s: what's the symptom, is it real, who's affected). 3) Decide: is it SEV2+? → declare + open war room/doc; join and start triage. 4) First look: dashboards (error rate, latency, SLO burn) + recent deploys/changes (check 'what changed' — deploy window, config change, dependency release). 5) Collect evidence (metrics screenshots, logs, error signatures) — do NOT change anything yet. 6) Form hypothesis → verify (read-only) → mitigate (rollback/reroute/scale) if clear. 7) If not clear in ~5-10 min → escalate (second engineer/team) rather than rabbit-hole. Rule: ack → triage → evidence → hypothesis → mitigate; change NOTHING until you have a hypothesis.

**Rubric:** 1 = ack + look. 2 = runbook + dashboards + recent-changes. 3 = evidence-before-change discipline + escalate-don't-rabbit-hole.

**Why asked:** Asked in B06 — verify against the module's checklist items and research block.
</details>


### Postmortems

<details>
<summary>❓ Q1: What makes a postmortem blameless? How do you write action items that actually prevent recurrence?</summary>

**Model answer:** Blameless: focus on systems/processes, not people — the question is 'what in the system allowed this to happen?' not 'who did it wrong?'. Language: 'the deploy lacked a rollback test' not 'X forgot to test'. Why: people hide mistakes if punished → you lose the data needed to prevent recurrence; blameless culture = psychological safety = real root causes. Action items that prevent recurrence: 1) specific + owned (owner + due date); 2) actionable (not 'improve testing' → 'add CI gate: deploy blocked if e2e suite fails, owner: Y, due: date'); 3) address ROOT CAUSE + contributing factors (multiple layers: tooling, process, training); 4) verifiable (how will we know it's done: test added, alert fired in drill); 5) prioritized (P0/P1 — not 40 items nobody does); 6) tracked to completion (follow-up in 2 weeks). One great action beats ten vague ones.

**Rubric:** 1 = 'no blame'. 2 = system-focused language. 3 = specific/owned/verifiable actions + root-cause-layering + tracked completion.

**Why asked:** Asked in B06 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q2: Postmortem structure: timeline, root cause, contributing factors, actions — what belongs in each?</summary>

**Model answer:** 1) Summary: one-paragraph what happened + impact (users, duration, revenue). 2) Timeline: chronological, timestamped facts (detection, actions, mitigation, resolution) — what happened when, not what people think happened. 3) Root cause: the deepest systemic cause (e.g. 'config change bypassed review' vs surface 'bad YAML'). 4) Contributing factors: what made it worse/easier (missing alerts, no rollback test, weekend deploy, monitoring gap) — multiple layers, honest. 5) Impact: metrics (error rate, downtime, data loss, affected customers). 6) Actions: prevention items (specific, owned, dated) + detection improvements (alerts) + process. 7) Lessons: what would we do differently. Optional: appendices (links to dashboards, PRs, logs). Timeline is FACTS (from logs/tools), root cause is ANALYSIS — keep them separate.

**Rubric:** 1 = timeline + root cause. 2 = contributing factors + impact. 3 = facts-vs-analysis separation + actionable items with owners.

**Why asked:** Asked in B06 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q3: How do you handle a postmortem where the 'cause' is human error?</summary>

**Model answer:** Reframe: human error is a SYMPTOM, not a root cause — the root cause is the system that allowed the error to be possible or catastrophic. Ask 'why was it possible?': no guardrail (no approval gate), no rollback test, unclear docs, alert fatigue, pressure to deploy fast, poor tooling (manual step that could be automated), no second pair of eyes. Write actions that fix the SYSTEM: add automation/guardrails, make dangerous paths hard (protect prod), improve docs/runbooks, add checklists where humans must act. NEVER: 'retrain the person', 'be more careful', 'remind X' — people will err; systems should tolerate it. If a person was negligent/repeated, that's a management matter outside the blameless postmortem (and even then, fix the system).

**Rubric:** 1 = 'don't blame the person'. 2 = system-allowed-it reframe. 3 = systemic actions (guardrails, automation, protected prod) + why retraining is a non-action.

**Why asked:** Asked in B06 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q4: How do you track postmortem action items to completion without a bureaucracy?</summary>

**Model answer:** Make it lightweight + visible: 1) action items as tickets/issues with owner + due date (single system — the repo's issue tracker, not a spreadsheet); 2) auto-flag: a 'postmortem' label + a weekly review where open items surface (or an automated check: overdue items ping owners); 3) small set: limit actions (top 3-5) — prioritize what prevents recurrence; 4) pair each with a verification ('how will we know it's done') — closes when verified, not when written; 5) SLA on completion (e.g. P0 within 2 weeks) with escalation if missed; 6) leadership: the team lead owns follow-through; every incident's actions reviewed at the next retro. Anti-bureaucracy: don't build a separate tool/process — reuse issues + one standing review slot; the goal is behavior change, not paperwork.

**Rubric:** 1 = issues with owners. 2 = weekly review + label. 3 = small-prioritized set + verification-based closure + leadership ownership.

**Why asked:** Asked in B06 — verify against the module's checklist items and research block.
</details>


### Chaos engineering

<details>
<summary>❓ Q1: What is chaos engineering and what is it NOT (it's not random breaking)?</summary>

**Model answer:** Chaos engineering = the DISCIPLINE of experimenting on a system to build confidence in its ability to withstand turbulent conditions — controlled, hypothesis-driven experiments (like scientific method): define steady state (e.g. p99 < 200ms, error rate < 0.5%), form hypothesis ('if we kill one node, the system stays healthy'), inject a fault (kill node, network partition, high latency), measure, compare to steady state, learn + fix. It is NOT random breaking: no unplanned failures, always in a controlled environment or with blast-radius limits, always with rollback/monitoring, always with a hypothesis. Chaos = validation of resilience, done deliberately and safely. Tools: Chaos Monkey (kill instances), Litmus/Chaos Mesh (k8s faults), Gremlin (host/network faults).

**Rubric:** 1 = 'break things on purpose'. 2 = hypothesis + steady-state framing. 3 = NOT-random distinction + blast radius + learning loop.

**Why asked:** Asked in B06 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q2: Design a chaos experiment: hypothesis, blast radius, rollback — walk me through one</summary>

**Model answer:** Example: kill one replica of a 3-replica stateless API. 1) Steady state: error rate < 0.5%, p99 < 300ms, SLO within budget. 2) Hypothesis: 'killing one of 3 replicas keeps error rate < 0.5% and p99 < 300ms because the LB + health checks redistribute traffic'. 3) Blast radius: scope to ONE service, ONE namespace (staging first, then prod during low-traffic window), max 1/3 replicas affected. 4) Run: inject fault (kubectl delete pod / Chaos Mesh PodChaos kill) with monitoring attached. 5) Measure: error rate, latency during + after; verify LB removed the dead instance within health-check interval. 6) Rollback/roll-forward: kill is naturally recoverable (Deployment recreates the pod) — but define rollback BEFORE: stop the experiment, restore replicas, if steady state violated → stop + investigate. 7) Learn: pass → document confidence; fail → fix (health-check tuning, capacity) and retry. Always: experiment runs in a game-day/controlled window with a kill-switch.

**Rubric:** 1 = kill a pod + measure. 2 = steady state + hypothesis. 3 = blast-radius control + rollback definition + learning loop.

**Why asked:** Asked in B06 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q3: Chaos Mesh vs Litmus vs Gremlin — when would you use each?</summary>

**Model answer:** Chaos Mesh: Kubernetes-native fault injection (CRDs: PodChaos, NetworkChaos, TimeChaos) — run in-cluster, free/open source, good for k8s fault scenarios. Litmus: also k8s-native (ChaosExperiments + ChaosEngine CRs), has a hub of experiments, integrates with Argo for pipeline chaos (chaos as part of CI). Gremlin: commercial SaaS — broad fault library (host, network, container, AWS), GUI, enterprise features (blast-radius controls, scheduled game days, compliance) — when you want managed + non-k8s faults (host-level, AWS faults) + support. Pick: k8s-only + self-hosted → Chaos Mesh/Litmus; want CI-integrated experiment workflows → Litmus; need host/cloud faults, GUI, enterprise → Gremlin.

**Rubric:** 1 = all three exist. 2 = k8s-native vs SaaS. 3 = use-case pick (self-hosted k8s vs CI chaos vs enterprise managed).

**Why asked:** Asked in B06 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q4: How do you convince a skeptical team to allow chaos in staging/prod?</summary>

**Model answer:** Argue from risk, not ideology: 1) start in STAGING only — prove the methodology, show findings ('we found the LB health-check was too slow — a real node failure would have caused 2 min of 5xx'); 2) start small: single fault, tiny blast radius, business-hours, with rollback defined; 3) show the cost of NOT testing: real incidents that would've been caught (use past outage data — 'this experiment simulates last month's outage'); 4) frame as training: chaos experiments train on-call (game days) — the team learns the system's failure modes safely; 5) metrics-driven: every experiment produces an action item or a confidence gain; 6) make it opt-in per service, with a kill-switch; 7) get buy-in from leadership via risk-reduction framing. The winning move: demonstrate in staging, present the findings with a fix — skeptics convert on evidence.

**Rubric:** 1 = start in staging. 2 = small blast radius + rollback. 3 = tie to real past outages + game-day training + evidence-based conversion.

**Why asked:** Asked in B06 — verify against the module's checklist items and research block.
</details>


### Capacity & scaling

<details>
<summary>❓ Q1: How do you forecast capacity — what metrics, what lead time, and what's the margin?</summary>

**Model answer:** Metrics: traffic growth (requests/day, users), utilization trend (CPU/mem/DB connections/queue), peak-vs-average pattern, business drivers (marketing campaigns, product launches, seasonality). Lead time: depends on provisioning speed — EC2/k8s minutes, but procurement/long-term commitments (reserved, hardware) need 3-6 months; DB size growth 1-3 months; scale-in/out (autoscaling) covers the short term. Margin: plan for peak + buffer (e.g. 30-50% above projected peak) + safety for spikes (autoscaling handles variance; reserved covers baseline). Method: project linear/exponential trend from 90-day data, add seasonality + known events, set triggers (scale at 70% utilization — gives headroom before saturation). Review monthly. The senior answer: capacity is trend + event-driven, with autoscaling absorbing error and hard limits reviewed.

**Rubric:** 1 = traffic trend. 2 = utilization metrics + triggers. 3 = lead-time-aware planning + margin policy + event-driven forecasting.

**Why asked:** Asked in B06 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q2: Scale up vs scale out — when each, and what breaks when you scale out (state, sessions)?</summary>

**Model answer:** Scale UP (vertical): bigger instance (more CPU/RAM) — simple, no code changes, good for stateful single-instance (DBs, queues), but has a ceiling + downtime (resize) + single point of failure. Scale OUT (horizontal): more instances — elastic, HA, near-unlimited, but requires statelessness. What breaks scaling out: 1) SESSIONS — sticky in-memory sessions break (user bounces between instances); fix: shared session store (Redis) or stateless JWT; 2) STATE — local files/db on instance are lost/unsynced; fix: external storage (S3/EFS), shared DB, or per-shard data; 3) CACHES — local caches become inconsistent; fix: distributed cache; 4) WRITE contention — DB writes don't scale out (sharding/queues needed); 5) RANDOM seeding — in-flight requests need idempotency. Rule: design stateless from day 1; scale out for elasticity; scale up for stateful cores.

**Rubric:** 1 = vertical vs horizontal. 2 = session/state problems. 3 = full list (sessions, local state, caches, writes, idempotency) + stateless design.

**Why asked:** Asked in B06 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q3: How do you load test safely — tooling, staged ramp, and how you read the knee of the curve?</summary>

**Model answer:** Tooling: k6, Locust, JMeter, Gatling, wrk/hey (quick); cloud load generators (avoid testing from your own infra). Safe method: 1) test in staging or a dedicated environment FIRST, then carefully in prod (low traffic window, feature-flagged); 2) STAGED RAMP: start at low load (10% baseline), increase in steps (10→50→100→150%), hold each step, watch metrics; 3) monitor everything: latency percentiles, error rate, CPU/mem, connection pool, DB load; 4) find the KNEE: the point where latency/error rate suddenly degrades as load rises — that's your real capacity (not the theoretical max); 5) stop immediately on errors/instability (kill-switch); 6) apply learnings: autoscaling thresholds, limits. Reading the knee: plot latency vs throughput — before the knee, latency flat; after, it bends upward (queueing, saturation). Capacity = load at the knee minus margin.

**Rubric:** 1 = k6/JMeter + ramp. 2 = staged ramp + monitor. 3 = knee-of-curve reading + kill-switch + capacity-from-knee.

**Why asked:** Asked in B06 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q4: Your service hit 100% CPU — what's the triage order (hot path, autoscaling, throttling)?</summary>

**Model answer:** 1) Is it user-impacting? check error rate/latency/SLO (if not, low urgency — but don't ignore). 2) Identify WHAT is burning CPU: per-pod/per-instance (which replicas — all or one?), profiling (top/htop, pprof, perf), hot code path (is it a code path — new deploy? config? traffic spike? runaway loop? GC?). 3) Check what changed: recent deploy/feature flag (rollback if correlated). 4) Immediate relief: scale OUT (add replicas — spreads the load; if ALL replicas are at 100%, scaling out just adds more burning cores — scale out only helps if it's per-instance saturation); throttle/rate-limit the input (if it's overload, not a bug); turn off non-essential work (logging, background jobs). 5) Root cause: profile to the hot line, fix, add a regression test + alert on CPU before it hits 100% (alert at 70-80%). The trap: adding replicas to a single-hot-instance doesn't help; a CPU bug (infinite loop, tight regex, GC thrash) needs profiling, not scaling.

**Rubric:** 1 = check impact + scale out. 2 = what-changed + profile. 3 = per-instance-vs-fleet distinction + throttle + alert-early + root-cause profile.

**Why asked:** Asked in B06 — verify against the module's checklist items and research block.
</details>


### Backups & DR

<details>
<summary>❓ Q1: RTO vs RPO — define and give a target for a database service; how do you choose?</summary>

**Model answer:** RPO (Recovery Point Objective): max acceptable data loss measured in time — 'how far back can we restore' (e.g. 5 min → restore to within 5 min of the disaster). RTO (Recovery Time Objective): max acceptable downtime — 'how fast must we be back' (e.g. 1 hr). For a DB service: RPO 5 min → continuous backups (transaction logs/PITR) or replication; RTO 1 hr → standby/restore playbooks + tested restores. How to choose: business cost — how much money/trust does 1 hour of downtime cost? how much does losing 5 min of data cost? Balance technology vs cost (cross-region replication is expensive; hourly snapshots cheap). Example: payments → RPO seconds (synchronous replication), RTO minutes (hot standby); analytics → RPO 1 day (daily snapshots), RTO 4 hrs. Always TEST restore against the targets.

**Rubric:** 1 = definitions. 2 = DB example with numbers. 3 = business-cost-driven selection + test-your-RTO/RPO.

**Why asked:** Asked in B06 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q2: 3-2-1 backup rule — what is it and how does it apply to databases and clusters?</summary>

**Model answer:** 3-2-1: 3 copies of data, on 2 different MEDIA/types, 1 offsite (different location). Apply to databases: 1) primary + 2 backups: daily snapshot + transaction-log/PITR (different granularity = different 'media'), one copy offsite (different region / object storage); snapshots are NOT offsite if same AZ/region — push one copy cross-region. Apply to clusters (k8s): backup etcd (cluster state) + PV data (DBs) + manifests (Git); Velero: cluster backup to object storage (S3) — offsite by default; restore drills. The '1 offsite' is the layer people skip — same-datacenter backups die with the datacenter. Also: rotation (don't keep only latest), encryption, restore testing.

**Rubric:** 1 = the rule. 2 = applies copies to DB/cluster. 3 = offsite + different-media reasoning + rotation + restore drills.

**Why asked:** Asked in B06 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q3: Velero: how do you back up and restore a Kubernetes cluster? What does it NOT back up?</summary>

**Model answer:** Velero = k8s backup/restore/migrate tool: backs up cluster RESOURCES (all objects by namespace/label selection — manifests) + OPTIONAL PV data (via Restic/Kopia, or snapshots via cloud provider) to object storage (S3/GCS). Restore: full or selective (namespace, labels), or MIGRATE to another cluster. It does NOT back up: 1) etcd itself (Velero backs up via the API — CRDs/objects, but not etcd internals/leases — for control-plane disaster restore etcd separately); 2) data outside PVs (hostPath data, in-cluster state like emptyDir); 3) the cluster's infrastructure (nodes, cloud resources — that's Terraform's job); 4) Live state (in-flight requests); 5) Secrets? yes it backs them up (plaintext!) unless configured to encrypt/redact. Restoration caveats: PVC re-provisioning needs StorageClass, Service IPs/NodePorts may change, DNS/ingress must exist. Test restores — Velero is only as good as its restore drill.

**Rubric:** 1 = cluster backup tool. 2 = resources + PV via S3. 3 = does-NOT list (etcd, infra, hostPath) + restore caveats + test drills.

**Why asked:** Asked in B06 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q4: Disaster recovery strategies: backup/restore vs pilot light vs warm standby vs multi-region — tradeoffs</summary>

**Model answer:** Backup/restore: cheapest, slowest (RTO hours) — copy data offsite, restore when disaster hits; RPO = last backup. Pilot light: minimal footprint running (tiny replica, DB replicated), scale up on disaster — moderate cost, faster RTO (minutes-hours); core data always ready. Warm standby: full-size standby running (scaled-down), sync/replication, failover by switching DNS/LB — faster RTO (minutes), higher cost (2x-ish). Multi-region active-active: live in 2+ regions, traffic split, data replicated — lowest RTO/RPO (seconds-minutes), highest cost + complexity (data consistency, conflict handling). Tradeoff axis: cost ↑ / RTO-RPO ↓ from backup/restore → multi-region. Pick by RTO/RPO requirements + budget: analytics → backup/restore; core app → warm standby; payments/global → active-active. The senior answer: match strategy to the business's real RTO/RPO + test it.

**Rubric:** 1 = names the four. 2 = RTO/cost ordering. 3 = requirement-driven pick + data-replication specifics per tier.

**Why asked:** Asked in B06 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q5: When was the last time you tested a restore — and why does untested backup not count?</summary>

**Model answer:** The honest answer: schedule a restore drill (e.g. quarterly) — restore the backup to a scratch environment, verify data + app boots + critical queries work, measure RTO/RPO achieved. Why untested backups don't count: backups fail silently (corrupted files, partial writes, missing permissions, wrong retention) and restore is where it's discovered — a backup that can't restore is not a backup, it's disk space. Classic failures: snapshot too old (RPO missed), restore takes 3x the RTO, credentials expired, storage corrupted, schema mismatch. So: automated restore verification (restore-to-test environment in CI), drill calendar, and every real restore is a practice run. Answer pattern: name your last drill, what you tested, what broke, what you fixed.

**Rubric:** 1 = 'we take backups'. 2 = names a drill + verification. 3 = the 'backups lie' reasoning + automated restore verification + measured RTO/RPO.

**Why asked:** Asked in B06 — verify against the module's checklist items and research block.
</details>


### Module research

<details>
<summary>❓ Q1: SRE fundamentals: what is SRE vs DevOps (DevOps = how software is built; SRE = keeping it running), error budgets, toil reduction, automation</summary>

**Model answer:** DevOps = culture/practice for how software is built+shipped (dev + ops collaboration); SRE = a ROLE/discipline that applies software engineering to operations — runs services with engineering rigor: SLIs/SLOs/error budgets (velocity vs reliability currency), toil reduction (manual, repetitive, automatable work measured + eliminated), automation (self-service, auto-remediation), blameless postmortems, on-call with payback. SRE 'keeps it running' AND makes running it cheaper/easier; error budget allows shipping at speed within reliability limits.

**Rubric:** 1 = one-liner each. 2 = error budget + toil concepts. 3 = engineering-the-ops angle + budget-as-velocity-currency.

**Why asked:** Asked in B06 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q2: Incident response: detection (monitoring/alerting), rapid diagnosis, mitigation (hotfix, reroute, scale), post-mortem (blameless, action items, documentation), continuous improvement</summary>

**Model answer:** Loop: detect (alerts/SLO burn) → diagnose (metrics/logs/traces — fast triage) → mitigate (rollback/reroute/scale/flag — restore first) → postmortem (blameless timeline + owned actions) → improve (fixes, alert tuning, drills) → tighter loop. Measure MTTA/MTTR; practice via game days.

**Rubric:** 1 = names stages. 2 = restore-first + blameless. 3 = improvement loop + metrics + drills.

**Why asked:** Asked in B06 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q3: SLI/SLO/SLA + error budget math; APR stages</summary>

**Model answer:** SLI = metric; SLO = target (99.9%/30d = 43.2 min budget); SLA = contract (looser). Error budget = 100%-SLO; burn rate = consumption speed; exhaust → freeze features. APR = alert → diagnose → mitigate → postmortem → improve (accelerated loop).

**Rubric:** 1 = definitions. 2 = budget math example. 3 = burn-rate + APR cycle.

**Why asked:** Asked in B06 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q4: Reliability patterns: redundancy, failover, retries/backoff, circuit breakers, rate limiting, graceful degradation</summary>

**Model answer:** Redundancy: multiple instances/AZs (survive failures). Failover: automatic switch to healthy (LB health checks, DB replicas, DNS). Retries/backoff: transient errors retried with exponential backoff + jitter (don't hammer). Circuit breakers: fail fast when dependency is down (open circuit → return default/error quickly, half-open to test recovery) — prevents cascading. Rate limiting: protect services from overload (per-user/per-IP quotas). Graceful degradation: serve reduced functionality under stress (cached results, queue instead of fail, feature off) — users get SOMETHING. Together: the toolkit for 'fail without cascading'.

**Rubric:** 1 = names a few. 2 = purpose of each. 3 = how they compose (retry + breaker + degradation) + failure-mode design.

**Why asked:** Asked in B06 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q5: Chaos engineering: game days, chaos experiments (Chaos Monkey, litmus/chaos-mesh), blast radius control</summary>

**Model answer:** Game days: scheduled practice incidents (inject real faults, run the real response process) — train people + test systems. Tools: Chaos Monkey (kill instances in prod — Netflix), Litmus/Chaos Mesh (k8s faults). Blast radius: scope experiments (one service, one namespace, low-traffic window, max impact %), kill-switch, monitor + rollback. Value: validated resilience, trained responders, found gaps.

**Rubric:** 1 = chaos concept. 2 = game days + tools. 3 = blast-radius + learning-loop discipline.

**Why asked:** Asked in B06 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q6: Capacity/scaling: vertical vs horizontal, autoscaling, load testing</summary>

**Model answer:** Vertical = bigger box (stateful cores); horizontal = more boxes (stateless elasticity, but breaks sessions/state). Autoscaling: metric-driven (CPU/custom), target tracking, cooldown/hysteresis. Load testing: staged ramp to the knee, monitor percentiles, kill-switch, capacity = knee - margin.

**Rubric:** 1 = v vs h. 2 = autoscaling mechanics. 3 = load-test method + stateless design constraint.

**Why asked:** Asked in B06 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q7: Backups/DR: RTO/RPO, RAID levels, backups + restore drills, 3-2-1 rule</summary>

**Model answer:** RTO = downtime budget; RPO = data-loss budget (both business-driven, tested). RAID = disk-level redundancy (1 mirror, 5/6 parity — protects DISK failures, not backups!). 3-2-1 = 3 copies, 2 media, 1 offsite. Restore drills validate backups (untested = fiction).

**Rubric:** 1 = RTO/RPO. 2 = 3-2-1 + drills. 3 = RAID-is-not-backup + measured targets.

**Why asked:** Asked in B06 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q8: Culture: blameless post-mortems, on-call best practices, incident communication</summary>

**Model answer:** Blameless postmortems: systems-not-people, psychological safety → real root causes. On-call: runbooks, escalation paths, severity, alert hygiene (few, actionable pages), post-incident relief, rotation fairness. Incident comms: one voice, status page, stakeholder cadence, timestamped war room.

**Rubric:** 1 = blameless concept. 2 = on-call hygiene. 3 = comms discipline + psychological safety payoff.

**Why asked:** Asked in B06 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q9: Incident mechanics: severity levels (SEV1-3), escalation paths, status pages + stakeholder comms, runbook quality, incident timeline reconstruction</summary>

**Model answer:** SEV1-3 by user impact × scope × duration; escalation tree (on-call → lead → exec, promoted as scope grows); status page (investigating→monitoring→resolved) + stakeholder updates; runbooks = step-by-step response (triage, mitigations, contacts) — quality = tested + current; timeline reconstruction from logs/alerts/deploys (facts, timestamped) for the postmortem.

**Rubric:** 1 = SEV levels. 2 = escalation + status page. 3 = runbook quality + timeline-from-tools.

**Why asked:** Asked in B06 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q10: Backups: 3-2-1 rule, Velero for Kubernetes, restore drills, RTO/RPO validation (backups you never restore = fiction)</summary>

**Model answer:** 3-2-1 rule; Velero backs up k8s objects + PVs to S3 (not etcd/infra); restore drills in scratch env, measure RTO/RPO achieved, automated verification; untested backups fail exactly when needed — restore or it's fiction.

**Rubric:** 1 = 3-2-1. 2 = Velero mechanics. 3 = drill-driven validation + the 'untested = fiction' principle.

**Why asked:** Asked in B06 — verify against the module's checklist items and research block.
</details>


---

## B07 Automation — idempotent scripts

### Bash mastery

<details>
<summary>❓ Q1: set -euo pipefail — what does each flag do and why do you use them in every script?</summary>

**Model answer:** -e: exit immediately on ANY command failing (non-zero exit) — no silent continued execution after an error. -u: treat unset variables as errors (fail instead of substituting empty string — catches typos). -o pipefail: a pipeline's exit status is the LAST failing command, not the last command (so `false | true` fails) — without it, pipeline errors are silently swallowed. Why every script: bash's default is 'keep going and pretend nothing happened' — silently wrong is worse than loudly failing; these three flags make scripts fail-fast and debuggable. Gotchas: -e is disabled in conditions (if/&&/||), so `grep ... || true` patterns still work; pair with `trap` for cleanup.

**Rubric:** 1 = one flag roughly. 2 = all three + one example each. 3 = the fail-fast philosophy + -e-in-conditions nuance + trap pairing.

**Why asked:** Asked in B07 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q2: Write a function that retries a command 3 times with backoff — live</summary>

**Model answer:** ```bash
retry() {
  local n=3 delay=1 cmd="$@"
  for i in $(seq 1 $n); do
    if "$@"; then return 0; fi
    echo "attempt $i failed, retrying in ${delay}s" >&2
    sleep "$delay"
    delay=$((delay * 2))   # exponential backoff
  done
  echo "all $n attempts failed" >&2
  return 1
}
retry curl -sf https://api.example.com
```
Points: 3 attempts max, exponential backoff (1→2→4s), logs failures to stderr, returns non-zero on total failure (fail loudly), runs the full command as arguments (`"$@"`). Production-grade adds jitter (randomize delay to avoid thundering herd) and only retries on RETRYABLE failures (network/5xx), not on permanent errors (4xx).

**Rubric:** 1 = loop with sleep. 2 = backoff + fail-loud. 3 = jitter + retryable-vs-permanent classification + "$@" correctness.

**Why asked:** Asked in B07 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q3: Exit codes, $?, positional params, $@ vs $* — scripting fundamentals</summary>

**Model answer:** Exit codes: 0 = success, non-zero = failure (1 generic, 2 usage, 126 found-but-not-executable, 127 command-not-found, 130 SIGINT); $? holds the last command's exit code (check it immediately — it's overwritten by the next command). Positional params: $1..$9, ${10}+; $0 = script name; $# = count. $@ vs $*: both expand all positional params — but $@ keeps each argument INTACT as separate words ("$@" is the safe form: preserves quoting/spaces); $* joins them into one word ("$*" = single string) — use "$@" in almost all cases, "$*" only when you explicitly want concatenation. Also: $? last exit, $$ PID, $! last background PID.

**Rubric:** 1 = $? + $1. 2 = $@ vs $* distinction. 3 = the quoting nuance ("$@" vs unquoted) + exit-code semantics + $! usage.

**Why asked:** Asked in B07 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q4: sed/awk/grep/find — pick the right one for: parse a log, replace in-place, find files by age</summary>

**Model answer:** grep: search/filter lines by pattern — `grep ERROR app.log | wc -l`; also grep -v (invert), grep -E (extended regex), grep -c. sed: stream editor for transform/replace — `sed -i 's/old/new/g' file` (in-place replace), `sed -n '10,20p' file` (print range); also delete lines, insert. awk: columnar/structured processing with fields — `awk '{print $1, $NF}'` (print first + last field), `awk '$3 > 100 {sum+=$3} END {print sum}'` (aggregate); the right tool for 'parse log lines into fields and compute'. find: locate files by metadata — `find /var/log -name '*.log' -mtime +30 -delete` (by age), -type f, -size. The pick: filter lines → grep; transform/replace in a file → sed; field math on structured lines → awk; filesystem questions (age/size/type) → find.

**Rubric:** 1 = one-liner each. 2 = correct tool per task. 3 = awk field-math + sed -i + find -mtime combos and why awk over grep for parsing.

**Why asked:** Asked in B07 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q5: Debugging: set -x, shellcheck — how do you make a failing script explain itself?</summary>

**Model answer:** set -x: trace mode — prints every command (with expanded variables) before executing, so you see exactly what ran and with what values; use `set -x` at the top or `bash -x script.sh`; pair with PS4 for context (PS4='+ ${BASH_SOURCE}:${LINENO}: '). shellcheck: static analyzer — catches real bugs (unquoted variables, missing set -e, common pitfalls) with severity levels; `shellcheck script.sh` → fixes. Strategy: 1) run with set -x to see the failing line + values; 2) add `set -euo pipefail` + trap ERR for automatic reporting ('failed at line N with code M'); 3) run shellcheck in CI so scripts are linted like code; 4) echo checkpoints for long scripts (or bash -x -v). The goal: a failing script tells you WHAT and WHERE without interactive debugging.

**Rubric:** 1 = set -x exists. 2 = set -x + shellcheck combo. 3 = PS4 context + trap ERR + CI linting — scripts that explain themselves.

**Why asked:** Asked in B07 — verify against the module's checklist items and research block.
</details>


### Python glue

<details>
<summary>❓ Q1: Write a script that reads a JSON config, calls an API, and fails loudly — live</summary>

**Model answer:** ```python
import json, os, sys, requests

def load_config(path):
    with open(path) as f:
        return json.load(f)

def main():
    cfg = load_config(os.environ.get("CONFIG", "config.json"))
    url = cfg["api"]["url"]
    token = os.environ["API_TOKEN"]          # secret from env, not config
    try:
        r = requests.get(url, headers={"Authorization": f"Bearer {token}"}, timeout=10)
        r.raise_for_status()                  # fail loudly on HTTP error
    except requests.RequestException as e:
        sys.exit(f"API call failed: {e}")     # non-zero exit + message
    data = r.json()
    print(json.dumps(data, indent=2))

if __name__ == "__main__":
    main()
```
Points: config validated (KeyError → traceback = loud), secret from env not file, timeout set, raise_for_status turns 4xx/5xx into exceptions, sys.exit with message → non-zero exit code + clear error for cron/CI.

**Rubric:** 1 = reads JSON + requests. 2 = timeout + raise_for_status. 3 = env secrets + sys.exit fail-loud + config validation.

**Why asked:** Asked in B07 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q2: argparse vs env vars for CLI tools — when does each make sense?</summary>

**Model answer:** argparse: for USER-facing CLIs — flags with help (-h), validation, types, defaults, subcommands; makes the tool self-documenting. Env vars: for AUTOMATION/CI/container contexts — 12-factor config; secrets especially (API keys, passwords); defaults for non-interactive runs; also for infra tools (kubectl, terraform read env). Practice: support BOTH — CLI flags take precedence over env vars, env vars over defaults; the tool works interactively AND in cron/CI/docker. Rule: flags for humans, env for machines/secrets; document precedence. For quick scripts, env + os.environ.get('X', default) is fine; argparse when the tool grows flags.

**Rubric:** 1 = argparse = CLI, env = automation. 2 = precedence + secrets-via-env. 3 = dual-support pattern + when argparse is overkill.

**Why asked:** Asked in B07 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q3: boto3/requests: error handling, retries with backoff, and how to avoid silent failures</summary>

**Model answer:** requests: exceptions — ConnectionError/Timeout/HTTPError (raise_for_status); wrap in try/except; use requests.Session with Retry (urllib3 Retry: total retries, backoff_factor, status_forcelist for 429/5xx, respect Retry-After) — retries for transient, fail for permanent. boto3: built-in retries (botocore config: max_attempts, retry_mode='adaptive'/'standard') — covers throttling (ThrottlingException), transient 5xx; also: check ResponseMetadata.HTTPStatusCode, handle ClientError/ParamValidationError separately. Avoid silent failures: 1) always handle exceptions (except: pass is a bug); 2) log with context (what failed, what was the input); 3) non-zero exit on unrecoverable failure; 4) set timeouts everywhere (no infinite waits); 5) verify side effects (after upload, check ETag).

**Rubric:** 1 = try/except + raise_for_status. 2 = retry config on both libs. 3 = timeout discipline + verify-after-write + logging context + never-except-pass.

**Why asked:** Asked in B07 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q4: How do you decide bash vs Python for a task? Give the rule of thumb</summary>

**Model answer:** Rule: use bash when it's a GLUE task — orchestrating existing commands (pipes, files, processes, cron), one-liners, quick filtering (grep/sed/awk), where the 'logic' is command composition. Use Python when there's real LOGIC — parsing/transforming data structures (JSON/YAML/CSV), APIs (requests), error handling beyond exit codes, loops/conditionals getting complex, testing needed, or cross-platform. Warning signs for bash: arrays of things to iterate with logic, JSON manipulation, nested conditionals, any math/date logic, >50 lines. Signs for Python: the task is 'program' not 'script'. Middle ground: Python for anything that would need complex quoting; bash for anything that's mostly calling other binaries. Also: performance — awk/sed beat Python for huge text streams; Python beats bash for logic-heavy.

**Rubric:** 1 = 'bash for glue'. 2 = logic→Python, command-composition→bash. 3 = complexity thresholds + performance nuance (awk for huge streams).

**Why asked:** Asked in B07 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q5: YAML/JSON parsing with pyyaml — how do you validate config before acting on it?</summary>

**Model answer:** Steps: 1) parse — yaml.safe_load (prefer over yaml.load — since PyYAML 5.1 it defaults to FullLoader, but safe_load stays the safe default for untrusted input); json.load for JSON; 2) validate SCHEMA — check required keys/types/values before acting: manual checks, or better a schema validator (jsonschema library — define the expected schema, raise on mismatch); 3) validate RANGES/ENUMS — port numbers, mode strings, allowed values; 4) fail loudly on invalid (clear message naming the field, not a cryptic KeyError); 5) use dataclasses/pydantic for typed config in bigger tools (pydantic gives automatic validation + typed access). Golden rule: validate early, fail fast with specific errors, never act on partially-understood config. Also: handle duplicate keys, unexpected fields (reject or warn), and interpolate env vars only where intended.

**Rubric:** 1 = safe_load. 2 = schema check before use. 3 = jsonschema/pydantic + specific errors + fail-fast philosophy.

**Why asked:** Asked in B07 — verify against the module's checklist items and research block.
</details>


### Safety & idempotency

<details>
<summary>❓ Q1: What makes a script idempotent? Give a concrete example (e.g., creating a user or a cron entry)</summary>

**Model answer:** Idempotent = running it N times has the same result as running it once (no errors, no duplicates, same end state). Concretely: creating a user — instead of `useradd bob` (fails/errors if exists), check first or use the idempotent form: `id bob || useradd bob`; or better `useradd bob 2>/dev/null || true` then ensure properties (usermod). Cron entry: `grep -q 'backup.sh' /etc/crontab || echo '0 2 * * * /usr/local/bin/backup.sh' >> /etc/crontab` — add only if absent. Key techniques: check-before-act (test state first), use tools that are naturally idempotent (Ansible modules, apt install (already-installed = no-op), mkdir -p), or make the action overwrite-with-same-value. Idempotency matters for: cron/CI re-runs, retries after failure, config management convergence.

**Rubric:** 1 = 'same result every run'. 2 = check-before-act example. 3 = the three techniques (check, idempotent tools, overwrite) + why it matters for retries/CM.

**Why asked:** Asked in B07 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q2: Lock files / flock — how do you prevent two concurrent runs from corrupting state?</summary>

**Model answer:** flock: advisory lock on a file descriptor — `exec 9>/var/lock/myjob.lock; flock -n 9 || exit 1` (or flock -w timeout) — the classic pattern: acquire exclusive lock at script start; if another instance holds it, exit (or wait) instead of running concurrently. flock is robust (kernel-managed, released on process death — no stale-lock problem). Alternatives: mkdir lockdir (atomic, but stale dir needs cleanup), PID files (check kill -0 $PID — race-prone, stale PIDs). Use flock for: cron jobs that must not overlap (backups, migrations, ETL), anything writing shared files/db. Also add lock metadata (pid, timestamp) for debugging. Design: non-blocking (fail fast + alert) for critical jobs; blocking-with-timeout for queues.

**Rubric:** 1 = flock exists. 2 = exec 9> + flock -n pattern. 3 = stale-lock handling + kill -0/PIDfile pitfalls + fail-fast alerting.

**Why asked:** Asked in B07 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q3: Dry-run mode and --force flags — how do you design safe destructive operations?</summary>

**Model answer:** Pattern: --dry-run (default off): compute + PRINT what would happen (exact commands/changes) without executing; --force: required to actually run destructive actions (delete, overwrite, recreate). Design: 1) dry-run by default for destructive ops (or require --force always); 2) --force with confirmation ('--force --yes' or interactive prompt when TTY); 3) dry-run output must be ACTIONABLE (the exact thing that would run, diff-style), not vague; 4) safety rails: refuse to delete last backup, refuse root-protected paths, require explicit targets (no `rm -rf *` from /); 5) log the actual run; 6) --force should never bypass correctness checks (it bypasses the CONFIRMATION, not the validation). Good examples: terraform plan (dry-run) → apply; kubectl --dry-run=client; rsync --dry-run.

**Rubric:** 1 = dry-run prints, force executes. 2 = the flag design pattern. 3 = actionable dry-run output + force-bypasses-confirmation-not-validation + safety rails.

**Why asked:** Asked in B07 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q4: How do you handle partial failure — run the whole thing or leave it half-done? What's the recovery?</summary>

**Model answer:** Design principle: make the operation recoverable by chunks, not all-or-nothing-without-recovery. Options: 1) transaction-like: stage everything, commit at the end (do all work on temp files/names, rename into place) — atomic where possible; 2) batch + checkpoint: process in small batches, record progress (offset, batch ID) so a re-run RESUMES, not restarts; 3) all-or-nothing with rollback: for DB-like ops use transactions; for files, back up originals first (mv to .bak) so rollback = restore. Recovery: 1) idempotent re-run (the same command continues safely); 2) state file/journal (what succeeded, what didn't) — the recovery inspects it; 3) alerts on partial state ('completed 47/50 batches') instead of silence. The honest answer: never design 'run and hope' — design for re-runability and leave the system in a KNOWN state (success marker or explicit failure), never unknowable half-done.

**Rubric:** 1 = 'make it re-runnable'. 2 = checkpoint/state + idempotent retry. 3 = atomic staging + rollback copies + known-state guarantee + partial alerts.

**Why asked:** Asked in B07 — verify against the module's checklist items and research block.
</details>


### Scheduling & tooling

<details>
<summary>❓ Q1: cron vs systemd timers — when would you choose a timer and what do you get (persist, calendar syntax, logging)?</summary>

**Model answer:** systemd timers over cron: 1) PERSISTENCE — Persistent=true runs missed jobs after boot (cron skips jobs missed while machine was off — the classic problem; anacron helps but timers are cleaner); 2) calendar syntax — OnCalendar= supports richer spec (weekdays, times, intervals: OnCalendar=Mon..Fri 02:00, OnUnitActiveSec=1h for fixed intervals); 3) LOGGING — journald captures output (journalctl -u <timer>), no mail-to-root setup; 4) dependencies/ordering — Before/After, Requires (e.g. wait for network); 5) resource control — cgroup limits per unit; 6) random delay — RandomizedDelaySec= avoids stampede; 7) one system to learn (systemd). When cron still fine: legacy systems, very simple fixed schedules, where systemd not available (containers). Answer: choose timers on any systemd host for anything that matters (persistence + logging alone justify it).

**Rubric:** 1 = timer has persistence. 2 = calendar syntax + journald. 3 = full comparison (ordering, cgroups, randomized delay) + when cron survives.

**Why asked:** Asked in B07 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q2: How do you monitor that a scheduled job actually ran (exit status, output, alerts)?</summary>

**Model answer:** Layers: 1) capture exit status + output — script sets an explicit exit code, logs to a known place (journald or a log file); 2) alert on FAILURE — cron: MAILTO + a wrapper that alerts on non-zero; systemd: OnFailure= unit that pages; 3) alert on MISSED runs — the subtle one: cron silence ≠ success. Use a heartbeat/dead-man's-switch: the job touches a timestamp file / sends a heartbeat (e.g. to a health endpoint or Dead Man's Snitch / Healthchecks.io) every run; an alert fires if the heartbeat doesn't arrive on time — catches jobs that never started (server down, cron broken). 4) verify OUTPUT not just exit: 'job ran' ≠ 'job did the right thing' — jobs should also check results (e.g. backup job verifies file size > X) and fail loudly; 5) dashboards: last-run time + status visible (Grafana/uptime tooling); 6) test the monitoring itself (fail a job deliberately).

**Rubric:** 1 = exit status + alert on failure. 2 = heartbeat for missed runs. 3 = verify-output-not-exit + dead-man's-switch + monitoring-the-monitoring.

**Why asked:** Asked in B07 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q3: make for task automation — when is it the right tool vs a shell script?</summary>

**Model answer:** make: dependency-based task runner — declare TARGETS + PREREQUISITES; it only re-runs when prerequisites changed (file timestamps) → built-in incremental behavior; good for: multi-step workflows with ordering (build, test, deploy chains), files-as-artifacts (a generated file depends on sources), standard entrypoints (make install, make test) that encode the workflow. When a shell script is better: pure orchestration without file dependencies (sequential commands, logic-heavy, remote), where 'up-to-date' checks don't apply. Rule of thumb: make when tasks produce/consume FILES and ordering matters (classic build); shell when it's a linear procedure. In practice teams use both: Makefile entrypoints wrapping scripts; also newer tools (Taskfile, Just) modernize make. Common make in ops: Makefile with cluster-up/cluster-down/test/deploy targets.

**Rubric:** 1 = make = targets/deps. 2 = up-to-date incremental behavior. 3 = files-as-artifacts vs pure-procedure + entrypoint convention.

**Why asked:** Asked in B07 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q4: Log rotation: how do you stop logs from filling the disk (logrotate, retention)?</summary>

**Model answer:** logrotate: the standard — config per app (size-based: rotate 100M; time-based: daily; keep N; compress; delaycompress; postrotate reload). Journald: SystemMaxUse= caps journal size; `journalctl --vacuum-size=500M` reclaims now. App-level: max log size + sampling; container logs: Docker/kubelet rotation (container-log-max-size). Retention policy per env: dev few days, prod weeks-months, compliance longer — SHIP to a central store (Loki/ES/S3) and keep local small (local = boot-time + last N MB). Monitors: disk alerts at 70-80% (before full) + log-growth alerts (a busy-loop spamming logs is a bug signal). Test: logrotate -d (dry run). The trap being asked about: unrotated logs filling disk → everything breaks — rotation + alerts are the fix.

**Rubric:** 1 = logrotate exists. 2 = size/time + retention + compression. 3 = journald caps + ship-forward + disk/growth alerts + container rotation.

**Why asked:** Asked in B07 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q5: tmux — how do you keep a session alive across SSH disconnects and split panes for parallel monitoring?</summary>

**Model answer:** tmux is a terminal multiplexer: it keeps a persistent session server-side, so your work survives SSH drops (the classic 'connection died mid-deploy' problem). Basics: `tmux new -s deploy` (named session), `tmux detach` (Ctrl-b d — session keeps running), `tmux attach -t deploy` (reconnect after the disconnect), `tmux ls` (list). Panes: Ctrl-b % (vertical split), Ctrl-b " (horizontal), Ctrl-b arrows (navigate) — run a deploy in one pane and `journalctl -f` / `htop` in another for parallel monitoring during an incident. Windows: Ctrl-b c (new), Ctrl-b n/p (switch). Why it matters operationally: long Ansible playbooks, migrations, tail-following logs — start in tmux and disconnects stop being an emergency; also enables pairing (tmux -CC / shared sessions). It's the daily-loop skill that 'obvious to seniors, missed by juniors'.

**Rubric:** 1 = 'persists sessions'. 2 = detach/attach + named sessions. 3 = split panes for incident work + why it beats nohup/screen.

**Why asked:** tmux is the session-resilience question — the gap analysis flagged it because disconnects kill unattended jobs and interviewers expect the habit.
</details>


### Config management (Ansible)

<details>
<summary>❓ Q1: Ansible ad-hoc vs playbooks vs roles — when does each scale?</summary>

**Model answer:** ad-hoc: one-liner commands (ansible -m ping, -m apt -a 'name=nginx state=latest') — quick checks, one-off actions, testing inventory; no reuse. Playbooks: ordered task lists with handlers, vars, conditionals — real config management, repeatable, versioned; the workhorse (one file per concern). Roles: packaged playbook pieces (tasks, handlers, vars, defaults, templates, files, meta) with a standard directory layout — reusable units, shared across playbooks/teams, parameterized by role vars; the scaling point (a role = 'install and configure nginx' reusable anywhere). Progression: ad-hoc → playbook (single host) → roles (multiple concerns, reuse) → collections (bundles of roles/modules, like Ansible Galaxy). Rule: ad-hoc for exploration, playbook for a task, roles for anything you'll reuse or share.

**Rubric:** 1 = one-liners vs playbooks. 2 = role = reusable playbook unit. 3 = collections + the reuse-scaling progression + role structure.

**Why asked:** Asked in B07 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q2: Idempotency in Ansible: modules vs shell — why is the apt/service module safer than shell?</summary>

**Model answer:** Modules (apt, service, copy, user) are IDEMPOTENT: they check current state and only act when needed (apt only installs if absent; service only restarts if not running) and report changed/ok. shell/command runs the raw command EVERY time — no state check, always 'changed', not idempotent: `shell: useradd bob` fails on 2nd run; `shell: systemctl restart nginx` restarts even when nothing changed. Why modules are safer: 1) no duplicate/error on re-run (convergent); 2) accurate changed/ok reporting → handlers fire correctly; 3) built-in error handling + no quoting/escaping footguns; 4) modules encode the right checks (apt update-cache logic, service enable). Rule: use a module whenever one exists; shell only for things modules can't do (and make it idempotent manually: `creates=`/`when:` checks). This is the same reason Terraform resources beat shell scripts.

**Rubric:** 1 = modules idempotent. 2 = shell always-runs + changed/ok semantics. 3 = handler-firing correctness + shell-with-creates fallback.

**Why asked:** Asked in B07 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q3: handlers/notify, register/set_fact, delegate_to — give a real use case for each</summary>

**Model answer:** notify + handlers: a task notifies a handler that runs ONCE at play end, only if the task changed — `notify: restart nginx` on a config template change → handler restarts nginx (only when the config actually changed). register: capture a task's output into a variable to use later — `register: result` after a command, then `when: result.rc != 0` or use result.stdout. set_fact: define a variable mid-play (computed values, cross-host data) — e.g. set_fact: app_version={{ result.stdout }} to pass between plays/hosts. delegate_to: run a task on ANOTHER host — e.g. delegate_to: localhost to run the DB-migration command from the control node, or run a health-check task against a load balancer; used with run_once for one-time ops (delegate_to: localhost + run_once: true for creating a shared resource).

**Rubric:** 1 = one of the three. 2 = notify-on-change + register usage. 3 = all three with real workflows + delegate_to+run_once pattern.

**Why asked:** Asked in B07 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q4: Ansible Vault: how do you store secrets and when do you NOT put them in the repo?</summary>

**Model answer:** ansible-vault encrypts files/strings (AES-256); encrypt: secrets.yml (vars with passwords/tokens); use: `ansible-playbook --ask-vault-pass` or a vault password file (with tight permissions) or vault IDs for multiple keys; decrypt at runtime into vars. When NOT to put secrets in the repo: 1) shared/production secrets with many readers — put them in a dedicated secret store (Vault, AWS Secrets Manager, 1Password) and reference via lookups (lookup('community.hashi_vault...')) or env injection; 2) secrets that rotate — central store handles rotation; 3) when repo access ≠ secret access (many clones, CI mirrors, forks); 4) secrets in plaintext anywhere in Git history (vault-encrypted but committed file is fine — the KEY is out-of-band). Best practice: encrypt with vault AND store keys in a real vault/SSM; commit encrypted files only, never the vault password.

**Rubric:** 1 = ansible-vault exists. 2 = encrypt files + password file flow. 3 = when-a-secret-store-beats-vault-in-repo + key management + history caution.

**Why asked:** Asked in B07 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q5: Dynamic inventory (aws_ec2 plugin) — how does Ansible know about your cloud hosts?</summary>

**Model answer:** Dynamic inventory: instead of a static hosts file, a plugin queries the cloud provider at runtime. aws_ec2 plugin (in the amazon.aws collection): configure in inventory file — `plugin: amazon.aws.aws_ec2` + filters (by tag: Name, env; by region; by instance state) → it lists running instances matching filters, groups them (by tags/security groups), and exposes hostvars (IPs, tags, AZ). Flow: ansible-playbook -i aws_ec2.yml playbook.yml → plugin calls AWS API (boto3, creds from env/instance role) → builds inventory → runs against the discovered hosts. Benefits: no stale host lists, hosts added/removed automatically (ASG), group by tag (web:, db:) for targeted runs. Related: other plugins (gcp_compute, azure_rm), and combining with --limit for subsets.

**Rubric:** 1 = plugin queries AWS. 2 = aws_ec2 + tag filters + grouping. 3 = hostvars/grouping + auto-discovery-with-ASG + creds source.

**Why asked:** Asked in B07 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q6: Ansible collections vs roles — what changed and how do you install/use collections (ansible-galaxy)?</summary>

**Model answer:** Collections are the modern Ansible packaging unit (replacing standalone roles as the distribution format since 2.9+): a bundle of roles + modules + plugins + filters + docs in one installable namespace package — e.g. `amazon.aws`, `kubernetes.core`, `community.general` (namespace.collection). Install: `ansible-galaxy collection install amazon.aws` (from Galaxy or a private/automation hub); reference content as `namespace.collection.module` / `namespace.collection.role_name`; requirements.yml pins versions for reproducibility (like requirements.txt). Roles = the unit of REUSE inside a playbook (tasks+handlers+defaults); collections = the unit of DISTRIBUTION (ship many roles/modules together, versioned). You still write roles, but they ship in collections. Modern projects: requirements.yml (collections) + a roles dir; `ansible-galaxy init` scaffolds either.

**Rubric:** 1 = 'new packaging unit'. 2 = namespace.collection + galaxy install. 3 = roles-vs-collections distinction (reuse vs distribution) + pinning.

**Why asked:** Collections replaced standalone roles in modern Ansible — reading any 2025-26 project requires understanding namespace.collection, so this is a currency check.
</details>


### Module research

<details>
<summary>❓ Q1: Bash: shebang, exit codes ($?), positional params ($1..$n, $#, $*, $@), variables (env vs user-defined), control flow (if/case/for/while/until), functions, pipes, metacharacters, sed/awk/grep/find, debug (set -x/-v), $/$$/$!</summary>

**Model answer:** Shebang #!/usr/bin/env bash; exit codes 0/non-zero, $? last; $1..$n, $#, $@ (each arg separate) vs $* (joined); env vars (exported, inherited) vs local; if/case/for/while/until; functions (name() {}); pipes (last-exit with pipefail); metacharacters (quoting: '' vs "" vs \, globs, ; && ||); sed (edit), awk (fields), grep (filter), find (files); set -x (trace), set -v (echo lines); $$ = PID, $! = last bg PID. Master: quoting + "$@" + pipefail.

**Rubric:** 1 = shebang + exit codes. 2 = params + control flow. 3 = quoting semantics + $$/$! + pipefail + set -x discipline.

**Why asked:** Asked in B07 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q2: Cron/anacron: scheduling, cron.allow/cron.deny, log rotation (logrotate)</summary>

**Model answer:** crontab 5-field (min hour dom mon dow); cron runs at fixed times only if machine is on; anacron catches missed runs (daily/weekly jobs); cron.allow (allowlist, wins) / cron.deny (denylist); logrotate handles rotation; systemd timers supersede for persistence+logging.

**Rubric:** 1 = 5-field syntax. 2 = anacron + allow/deny. 3 = timer-vs-cron + rotation + missed-run handling.

**Why asked:** Asked in B07 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q3: Python for ops: scripting, requests/boto3, argparse, error handling, YAML/JSON parsing (pyyaml)</summary>

**Model answer:** Python glue: requests (HTTP, timeouts, raise_for_status, Retry), boto3 (AWS, client config retries, ClientError handling), argparse (CLI), pyyaml safe_load + jsonschema validation, sys.exit for fail-loud, logging module (structured), dotenv/env for config. Use for logic-heavy automation where bash quoting breaks down.

**Rubric:** 1 = requests + pyyaml. 2 = argparse + error handling. 3 = retries/timeouts + schema validation + fail-loud discipline.

**Why asked:** Asked in B07 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q4: jq: JSON parsing on CLI for API/cloud automation</summary>

**Model answer:** jq = JSON swiss-army knife: jq '.key' (select), '.arr[]' (iterate), '.[] | select(.status=="ok")' (filter), 'map(.id)' (transform), 'length', 'group_by', 'to_entries', '-r' raw output; combine with curl: curl -s api | jq '.items[].name'. Used for: API responses, k8s/aws CLI JSON (kubectl get -o json | jq), config extraction in pipelines. Master: select/filter + pipes + raw strings.

**Rubric:** 1 = basic .key. 2 = filters + arrays. 3 = pipelines with curl/kubectl + -r + complex transforms.

**Why asked:** Asked in B07 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q5: Ansible: agentless + SSH push model, inventory (static/dynamic), playbooks/tasks/handlers, modules (core vs extras), roles + Galaxy, ad-hoc commands, vault (secrets), register/set_fact, delegate_to, become, synchronize/rsync, Tower/AWX</summary>

**Model answer:** Agentless: pushes over SSH (no agent on target); inventory static (ini/yaml) or dynamic (aws_ec2); playbooks = ordered tasks, handlers fire on change; modules core vs extras (community); roles package tasks/vars/templates (Galaxy = role registry); ad-hoc for quick ops; vault encrypts secrets; register/set_fact vars; delegate_to runs on other hosts; become = privilege escalation; synchronize = rsync wrapper for file sync; Tower/AWX = UI + scheduling + RBAC for Ansible at scale.

**Rubric:** 1 = SSH push + playbooks. 2 = modules vs shell + handlers. 3 = roles/Galaxy + vault + delegate/become + Tower at scale.

**Why asked:** Asked in B07 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q6: Config management: declarative vs imperative, idempotency, config drift</summary>

**Model answer:** Declarative = state desired (Ansible/Terraform modules: 'nginx should be installed') vs imperative = step-by-step commands (shell scripts: 'run apt install'). Declarative gives idempotency (converge to state, no-op if already there) + drift detection (a run re-aligns state). Drift = actual config diverges from desired (manual edits, ad-hoc changes); CM re-converges; monitoring (Ansible --check, periodic runs) detects it.

**Rubric:** 1 = declarative vs imperative. 2 = idempotency from declarative. 3 = drift detection/convergence loop + --check audits.

**Why asked:** Asked in B07 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q7: Ansible vs Puppet vs Chef vs Terraform (one-line each)</summary>

**Model answer:** Ansible: agentless, push-based, YAML, easiest to start (config + provisioning). Puppet: agent-based, pull model, DSL, enterprise config management. Chef: agent-based, Ruby DSL, code-driven config. Terraform: declarative CLOUD PROVISIONING with state (not config on servers). One-liner each + when: Ansible = quickest/agentless; Puppet/Chef = large fleets with agents + compliance; Terraform = infra, not software config.

**Rubric:** 1 = one-liners. 2 = agentless-vs-agent axis. 3 = provisioning-vs-config split + migration guidance.

**Why asked:** Asked in B07 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q8: Task tooling: make for task automation, cron alternatives (systemd timers, Jenkins scheduled jobs), lock files / flock for idempotent concurrent runs</summary>

**Model answer:** make: dependency/file-based task runner; systemd timers: persistent, logged, calendar-rich cron alternative; Jenkins scheduled jobs: CI-based scheduling with history/UI; flock: prevent concurrent runs of the same job. Choose: make for local dev entrypoints, timers for server jobs, Jenkins for pipeline-integrated schedules, flock inside any job that must not overlap.

**Rubric:** 1 = names tools. 2 = make vs timers vs Jenkins split. 3 = flock + scheduling-by-context + persistence tradeoffs.

**Why asked:** Asked in B07 — verify against the module's checklist items and research block.
</details>


---

## B08 Ownership — on-call & runbooks

### On-call

<details>
<summary>❓ Q1: Walk me through your on-call rotation: what's in your runbook, how do you triage, when do you escalate?</summary>

**Model answer:** Rotation: primary + secondary (shadow/backup), week-long shifts, follow-the-sun optional; handover doc at shift change. Runbook contents: service overview, key dashboards + alerts meaning, common incident playbooks (step-by-step: '5xx spike → check deploy time → rollback procedure'), escalation tree (who to call), contacts, access/how-to (SSH, k8s context, DB), known issues + past incident links, post-incident steps. Triage: ack → check alert + runbook → confirm real (dashboard) → severity (impact × scope) → declare if needed → follow the playbook → mitigate (rollback/reroute/scale) → document. Escalate when: not mitigated in target time, out of knowledge (specialist needed), scope grows (SEV1), needs another team (DBAs, vendor, network) — escalate EARLY, escalation is not failure, it's teamwork.

**Rubric:** 1 = runbook + ack. 2 = triage order + escalation triggers. 3 = secondary/shadow + handover + escalate-early culture.

**Why asked:** Asked in B08 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q2: Severity levels + escalation tree — define them for a service you own</summary>

**Model answer:** Define for YOUR service (e.g. payments API): SEV1 = service down / >5% errors / data loss / security incident — page primary + secondary + manager immediately, war room, exec comms, status page; target mitigation ASAP (< 15 min ack, updates every 30 min). SEV2 = degraded (p99 > 1s, one feature broken, one region slow, >1% errors) — page primary, fix within business SLA (e.g. 4 hrs), incident channel. SEV3 = minor (one user, cosmetic, non-urgent) — ticket, next-day. Escalation tree: primary on-call → secondary → team lead/manager → engineering director/exec (for SEV1) → external (vendor, DBA, security). Promotion rule: SEV2 exceeding SLA or growing scope → SEV1. Include: who's the IC, who does comms, post-incident owner.

**Rubric:** 1 = SEV1-3 definitions. 2 = per-service examples + escalation chain. 3 = promotion criteria + roles (IC/comms) + comms cadence.

**Why asked:** Asked in B08 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q3: A page fires at 3am and the runbook is wrong — what do you do (and how do you fix the runbook after)?</summary>

**Model answer:** Immediately: 1) treat the runbook as a STARTING POINT, not gospel — the wrong step may be for an older version/symptom; 2) verify against the system (dashboards, current deploy, logs) before following risky steps — a wrong runbook step can make things worse; 3) apply judgment: if the playbook says 'roll back' but the dashboard shows no recent deploy, don't blindly roll back; 4) stabilize first (what IS working — revert any half-followed wrong step), then diagnose from evidence; 5) document what you actually did (for the postmortem). After: 1) fix the runbook IMMEDIATELY (it just misled someone at 3am — highest priority); 2) postmortem: why was it wrong (drift — nobody updated after last change?) and add a runbook-review/update step to the change process; 3) validate other runbooks for the same staleness; 4) make runbooks part of change reviews (update-on-change, not update-on-incident).

**Rubric:** 1 = don't blindly follow. 2 = verify-before-act + stabilize. 3 = fix-now + drift root cause + runbook-in-change-process + audit others.

**Why asked:** Asked in B08 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q4: How do you reduce on-call load over time (toil reduction, alert hygiene, automation)?</summary>

**Model answer:** 1) ALERT HYGIENE — the biggest lever: every page must be actionable; delete/refine noisy alerts (tune thresholds, alert on symptoms+SLO burn not causes), consolidate (one alert per incident type, dedup), require runbook-or-remediation per alert (if no action, it's noise); target: < 1-2 pages/day sustainable. 2) TOIL REDUCTION — identify manual, repetitive, automatable work (the SRE definition of toil) and automate: scripted restarts → self-healing (systemd/controller), manual onboarding → self-service, manual checks → automated dashboards/tests. 3) FIX ROOT CAUSES — each incident generates an action; recurring incidents → permanent fix (the loop that reduces pages long-term). 4) SELF-SERVICE + DOCS — good runbooks + self-service tooling mean fewer escalations to seniors. 5) MEASURE — track pages/week, MTTA/MTTR, toil ratio; review monthly; set reduction targets. Culture: on-call load is a metric, not an accepted cost.

**Rubric:** 1 = tune alerts. 2 = toil automation + root-cause loop. 3 = measurement + targets + symptom-alerting + self-service docs.

**Why asked:** Asked in B08 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q5: How do you hand over an incident shift cleanly?</summary>

**Model answer:** Handover = transfer CONTEXT, not just responsibility: 1) WRITTEN summary (the incident doc, always up to date — timeline, current state, what was tried, hypotheses, pending actions); 2) verbal walkthrough (5-10 min, in the war room): what's the current state, what's ACTIVE (rollback in progress?), what's next (pending deploy, waiting on vendor), what NOT to do (traps, half-done experiments); 3) explicit status: who's IC now, open action items with owners, escalation state; 4) access transfer (who has what, where the runbook/doc is); 5) overlap time (primary + secondary together, or the new person shadows for the tail); 6) the doc becomes the source of truth — both people read the SAME doc, not memory. Rule: handover is complete when the new person can answer 'what's the current state and what would you do next?' from the doc alone.

**Rubric:** 1 = write a summary. 2 = verbal + written + active-actions. 3 = doc-as-source-of-truth + overlap + no-touch-list + test-the-transfer.

**Why asked:** Asked in B08 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q6: On-call across time zones — how do you run a follow-the-sun rotation and what makes the handoff safe when you've never met your counterpart?</summary>

**Model answer:** Follow-the-sun = rotations split by timezone so a human is always awake (e.g. India + EU + US shifts; Google SRE explicitly pairs teams across time zones for service continuity). The handoff is the whole game when you've never met your counterpart: 1) a LIVE shared doc updated in real time (timeline, current state, active actions, traps) that both shifts read — no verbal-only transfer; 2) a fixed overlap window (30-60 min) even across zones (shift schedules to overlap, or record + annotate the sync); 3) explicit ownership transfer — who is primary from when, pending actions with owners; 4) a documented global escalation path — the awake zone's on-call is your backup; 5) staffing math: Google SRE suggests ~5-6 engineers per site minimum to sustain 24/7 follow-the-sun; 6) automation is the third shift-mate — runbooks, alerting, self-healing make the solo-zone night survivable. Senior answer: the handoff DOC is the only thing that travels across timezones — make it complete enough that the next shift can answer 'what is the state and what do I do next' without asking.

**Rubric:** 1 = follow-the-sun concept. 2 = written handoff + overlap window. 3 = global escalation + staffing math + doc-as-only-continuity.

**Why asked:** Timezone on-call is the standard distributed-team question — remote-first companies (GitLab, Razorpay) test whether you understand handoff-as-document.
</details>


<details>
<summary>❓ Q7: An incident fires at 2am your time and the rest of the team is asleep in other zones — walk me through your response and escalation.</summary>

**Model answer:** First: triage alone with the runbook — ack, confirm the alert is real (dashboard/status), assess severity (impact × scope). If SEV1 and you can mitigate safely (rollback, reroute, scale, feature-flag off), DO IT — fix symptoms first per the playbook; the runbook + dashboards are your teammates at 2am. Then escalate per the documented tree: follow-the-sun org → the awake-zone on-call; otherwise secondary → manager (a manager expects the 2am call for SEV1 — that's their job). Never escalate what you can safely fix yourself — pages wake people up. Communicate: one-line status to the incident channel (what's happening, what you're doing, next update in X). Document as you go — the postmortem depends on your timeline. Senior answer: 2am solo work is where runbooks earn their keep; if the runbook is wrong or missing, note it and fix it after, but never freewheel — stabilize with the safest known action, then escalate if impact is beyond your comfort.

**Rubric:** 1 = ack + triage. 2 = mitigate-with-runbook + escalation tree. 3 = no-freewheeling + comms cadence + fix-the-runbook-after + solo-decision discipline.

**Why asked:** The solo-2am scenario is the on-call stress test for distributed teams — they want runbook-first discipline and escalation judgment, not heroics.
</details>


### Documentation

<details>
<summary>❓ Q1: What belongs in a runbook vs an architecture doc vs an ADR? When do you write each?</summary>

**Model answer:** Runbook: OPERATIONAL 'how to respond' — alerts + meaning, triage steps, mitigation playbooks, escalation, contacts, known issues; written when a service goes live (or an alert is added). Architecture doc: WHAT and WHY of the system — components, data flow, decisions context, diagrams, constraints, env topology; written at design time + updated on significant changes. ADR (Architecture Decision Record): a DECISION + its context — the problem, options considered, chosen option, tradeoffs, consequences; written when a significant decision is made (chose k8s over Swarm, chose Postgres, chose event-driven); short (1-2 pages), numbered, immutable-ish (superseded by a new ADR). Rule: runbook = how to fix when it breaks; arch doc = how the system works; ADR = why we chose this. Same repo as code, all reviewed.

**Rubric:** 1 = rough distinctions. 2 = when-to-write each. 3 = the 'how/what/why' model + lifecycle (update-on-change).

**Why asked:** Asked in B08 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q2: How do you keep docs from rotting — ownership, review cadence, doc-as-code?</summary>

**Model answer:** Root cause of rot: no owner + no trigger to update. Fixes: 1) OWNERSHIP — every doc has an owner (team + named engineer) listed in the header; 2) doc-as-code — docs live in the repo (same PR flow, reviewed, versioned); docs update in the SAME PR as the code change (update-the-doc is part of done); 3) REVIEW CADENCE — scheduled doc review (quarterly) + freshness check in the on-call rotation ('runbook review' as a to-do during the week); 4) TRIGGER-BASED — change process includes doc impact (runbook linked from alerts; deploy checklist includes 'update runbook'); 5) DEAD-DOC DETECTION — link checks, markdownlint, metrics (last-updated dates), prune what's obsolete (deletion is healthy); 6) make docs findable — link from alerts/dashboards to the runbook (if the alert can't reach the doc, it rots). The senior answer: docs rot when nothing triggers their update — so tie updates to the change pipeline.

**Rubric:** 1 = review cadence. 2 = doc-as-code + owner. 3 = update-in-same-PR + trigger-based + dead-doc pruning + alert-linked runbooks.

**Why asked:** Asked in B08 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q3: Write an ADR for a decision you made — walk me through the format and why it matters</summary>

**Model answer:** Format (MADR/classic): Title (ADR-<N>: <Decision>), Status (Accepted/Proposed/Superseded), Context (the problem, constraints, forces — the 'why now'), Decision (the choice, concise), Consequences (positive + negative + tradeoffs), Alternatives considered (2-3 with why rejected), optionally Links. Example: 'ADR-7: Use OpenTofu over Terraform for new IaC' — Context: BSL relicensing, license risk for tooling; Decision: standardize on OpenTofu; Consequences: + open-source governance, + community; − fewer enterprise features, smaller ecosystem; Alternatives: Terraform (rejected: BUSL), CloudFormation (rejected: AWS lock-in). Why ADRs matter: 1) decisions are RECORDED with context (future devs know why, not just what); 2) alternatives + tradeoffs preserved (avoids re-litigating); 3) audit trail (compliance); 4) onboarding (new people learn the why); 5) forces explicit thinking. Keep them SHORT — a decision record, not an essay.

**Rubric:** 1 = format roughly. 2 = context/decision/consequences. 3 = alternatives + superseded-flow + why-it-matters (onboarding, audit, re-litigation).

**Why asked:** Asked in B08 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q4: How do you document for a future junior so they can do the job without you?</summary>

**Model answer:** Write for the person who has NO context: 1) START at zero — 'this is the service, this is what it does, here's the repo layout'; 2) THE JOURNEY, not the map — the 'golden path': how to run it locally, how to deploy, how to debug the top 5 issues (worked examples with actual commands + expected output); 3) GLOSSARY + acronyms expanded; 4) worked scenarios — 'if you see X, do Y' decision trees, not abstract docs; 5) the WHY — link ADRs for decisions (juniors need context); 6) screenshots/expected-outputs (verifying success without asking); 7) CONTACTS — who knows what (but make the docs good enough that they rarely need it); 8) make it findable — linked from README/alerts; 9) TEST it — have the junior follow it cold (the 'campsite test': leave docs that let the next person succeed without you). The measure: can they deploy + debug solo on day 2?

**Rubric:** 1 = clear steps. 2 = worked examples + run/debug paths. 3 = zero-context + golden-path + decision trees + tested-by-a-real-junior.

**Why asked:** Asked in B08 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q5: Remote-first async work — how does it change how you document and communicate? Give your async communication pattern.</summary>

**Model answer:** Async-first means DEFAULT to writing; sync only when writing is slower. Pattern: 1) decisions and updates in WRITING — status updates, design docs, ADRs, meeting notes (the GitLab handbook-first approach: documentation is the source of truth, not memory or chat); 2) docs over meetings — a well-written doc beats a meeting; meetings are for discussion, not information transfer; 3) everything recorded or summarized — a recorded sync or a written summary so every timezone gets the same information; 4) over-communicate in writing — assume no one saw the Slack message; put it in the doc/issue/PR; 5) structured channels — issues/MRs with threads, docs with owners, chat for quick questions only; 6) live-doc meetings — edit the doc together during the call so the output IS the artifact; 7) async code review — thorough written reviews with clear requests, not sync demands. For platform work specifically: runbook/ADR/README updates ARE the communication — your changes speak through docs. The answer they want: 'I write things down by default, and I make my work visible in writing.'

**Rubric:** 1 = write things down. 2 = docs-over-meetings + recorded syncs. 3 = handbook-first + live-doc meetings + work-visible-in-writing for infra.

**Why asked:** Async communication is the #1 remote-culture screen (GitLab's all-remote handbook is the reference) — they listen for default-to-writing, not tools.
</details>


### Security instinct

<details>
<summary>❓ Q1: Least privilege — walk me through applying it to a new service (IAM, RBAC, network, secrets)</summary>

**Model answer:** For a new service 'checkout-api' (AWS + k8s): 1) IAM — a dedicated role per service, actions scoped to ITS resources only (s3:GetObject on its bucket, sqs:SendMessage on its queue, nothing else); no wildcards on resources; assume via OIDC/instance profile, no long-lived keys; 2) RBAC (k8s) — its own ServiceAccount with RoleBinding limited to what it needs (get/list on its namespace only), no cluster-admin, automountServiceAccountToken=false unless it needs the API; 3) NETWORK — SG/NACL least-open: only required ports from only required sources; NetworkPolicies default-deny + allow its specific flows; DB in private subnet reachable only from app SG; 4) SECRETS — no secrets in code/config/repo; from Vault/SSM per-env, scoped access; rotation enabled; 5) ACCESS REVIEW — quarterly review of who/what can touch it; audit logs on. Principle: start deny-all, add exactly what's needed, verify with a reviewer; least privilege is a per-service exercise, not a one-time policy.

**Rubric:** 1 = IAM least privilege. 2 = RBAC + network layers. 3 = secrets + review cadence + the deny-first methodology across all 4 layers.

**Why asked:** Asked in B08 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q2: Secrets management: Vault vs SOPS vs External Secrets — when do you reach for each?</summary>

**Model answer:** Vault (HashiCorp): central secret store with dynamic secrets (short-lived DB creds, rotating), policies, audit log, encryption-as-a-service; reach for it when: many services/secrets, need rotation/dynamic creds, compliance/audit, team-scale. SOPS: encrypts secret FILES in Git (age/KMS) — lightweight, Git-native, no server; reach for it when: GitOps with a few secrets, small team, want 'Git as source of truth' with encryption, no central infra. External Secrets Operator: syncs FROM a store (Vault/AWS SM/GCP SM) INTO k8s Secrets — the k8s-native bridge; reach for it when: k8s workloads need secrets from an existing central store, automatic sync/rotation into pods. Rules: tiny/simple → SOPS; k8s + existing store → ESO; real scale/dynamic/audit → Vault. They compose (SOPS for bootstrap, Vault for runtime).

**Rubric:** 1 = names the three. 2 = mechanism of each. 3 = scale-based selection + dynamic-secrets/audit trigger + composition.

**Why asked:** Asked in B08 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q3: SSH hardening: what do you actually change on a server (keys, root login, ports, 2FA)?</summary>

**Model answer:** Practical checklist: 1) KEYS ONLY — PasswordAuthentication no (the #1 change; also PermitEmptyPasswords no); 2) ROOT LOGIN — PermitRootLogin prohibit-password (root only via keys, ideally no direct root at all — sudo from a user); 3) USERS — per-user keys, ssh-keygen -t ed25519, authorized_keys with command=/restrictions for service accounts; 4) PORT — moving off 22 reduces bot noise (ChangePort) but security-by-obscurity; real protection is keys + fail2ban/rate-limiting (MaxAuthTries 3, LoginGraceTime); 5) 2FA — TOTP via PAM (google-authenticator) or U2F for human logins (optional but strong; care with automation); 6) PROTOCOL — Protocol 2, disable unused (X11 forwarding off, AllowAgentForwarding off unless needed); 7) NETWORK — firewall: only allow SSH from known ranges/VPN; 8) AUDIT — auditd + fail2ban + monitoring auth logs (failed attempts); 9) key rotation + revocation list. Priority order: keys-only + no-root + firewall first; port/2FA after.

**Rubric:** 1 = keys + root. 2 = full sshd checklist. 3 = priority ordering + fail2ban/rate-limit + 2FA-for-humans + audit.

**Why asked:** Asked in B08 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q4: TLS everywhere: where do certs come from and how do you rotate them automatically?</summary>

**Model answer:** Sources: public CA (Let's Encrypt — free, automated, 90-day certs) for internet-facing; internal CA (smallstep step-ca, or k8s cert-manager with self-signed/internal CA) for internal mTLS; cloud-managed (AWS ACM — free + auto-renew, attach to LB/CloudFront); enterprise CA for compliance. Rotation automation: 1) cert-manager on k8s — Certificate CRs, automatic issuance + renewal before expiry (Issuer: Let's Encrypt HTTP-01/DNS-01 or internal CA), injects into Secrets, pods reload; 2) smallstep for VMs/bare-metal — step-ca issues + renews, client renews automatically; 3) ACM: managed (zero work); 4) ALWAYS: monitor expiry (alert 30/14/7 days out) — expiry is the classic outage; automate the check (prometheus blackbox, cert-expiry exporters). Never: manual renewal of production certs; expiry alerts + auto-renewal are non-negotiable.

**Rubric:** 1 = LE + ACM. 2 = cert-manager renewal flow. 3 = internal CA/mTLS + expiry-alerting + the 'expiry is a classic outage' awareness.

**Why asked:** Asked in B08 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q5: How do you respond to a reported vulnerability in a dependency you run?</summary>

**Model answer:** Process: 1) TRIAGE — confirm the report (CVE, affected versions, severity via NVD/advisory, is OUR version affected? is the vulnerable path REACHABLE in our deployment?); 2) SCOPE — which services/artifacts contain it (query SBOMs/images — this is why SBOMs exist); 3) PLAN — find fixed version; check for mitigations (network isolation, config, WAF rule) for the interim; 4) FIX — update the dependency (pin new version), run tests, deploy through the normal pipeline; 5) VERIFY — scan confirms clean (trivy/grype re-scan), smoke test; 6) COMMUNICATE — internal (affected teams, incident if severe) + external (advisory/notify users if data at risk); 7) POSTMORTEM if it was exploitable — why were we on an old version, how do we prevent (update cadence, scanning in CI, Dependabot/Renovate). Key: severity × reachability decides urgency; have scanning in CI so this is rare (prevention beats response).

**Rubric:** 1 = update the dep. 2 = triage severity/reachability + fix. 3 = SBOM-blast-radius + interim mitigation + prevention loop (CI scanning, Dependabot).

**Why asked:** Asked in B08 — verify against the module's checklist items and research block.
</details>


### Container & supply-chain security

<details>
<summary>❓ Q1: Trivy: image vs filesystem vs SBOM scanning — what does each catch and how do you gate builds on it?</summary>

**Model answer:** Modes: trivy image — scans a container IMAGE (OS packages + language deps + config) for known CVEs + misconfigs; trivy fs — scans a FILESYSTEM/dir (source tree, IaC files, repos) for vulnerabilities + misconfigs + secrets; trivy sbom — generates or scans an SBOM (CycloneDX/SPDX) — the artifact manifest, used for inventory + license + blast-radius (can be scanned without the image). What each catches: image = runtime CVEs in the final artifact; fs = code-time issues (secrets committed, IaC misconfig, dep vulns before build); sbom = supply-chain inventory (also detects components with no image build). Gate builds: 1) scan in CI at build (image scan on push); 2) fail on HIGH/CRITICAL above threshold (or any unfixable critical); 3) allowlist with justification + expiry; 4) re-scan on base-image updates; 5) gate DEPLOYS, not just builds (registry scan / admission); 6) sign + attest the scan result (provenance). The gate question: severity threshold + fixable-or-block policy.

**Rubric:** 1 = three modes exist. 2 = what each catches. 3 = CI gating (fail-threshold + allowlist-with-expiry + deploy gate + attestation).

**Why asked:** Asked in B08 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q2: SBOM + SLSA: what's in your artifact, who built it, and can you prove it?</summary>

**Model answer:** SBOM = WHAT's inside: components (OS packages, libs, versions, licenses) — enables CVE blast-radius queries + license compliance. SLSA = supply-chain provenance — HOW it was built: who/what built it, source, build process, attestations (levels 0-4: L3/L4 = verified build + non-falsifiable provenance). Together: 'what's in the artifact, who built it, and can you prove it' — SBOM answers 'what', SLSA answers 'who/how/trustworthy'. Implementation: generate SBOM at build (syft/trivy), sign it (cosign), attach as OCI artifact; SLSA: build from a trusted CI with provenance attestations (in-toto + DSSE), reproducible builds; store both with the artifact; verify at deploy (cosign verify + policy). Why demand it: supply-chain attacks (SolarWinds, log4j-style blast radius) — you can only respond to what you can inventory and trust.

**Rubric:** 1 = SBOM = what, SLSA = how. 2 = generate + sign + attach. 3 = the verification story (cosign verify at deploy) + levels + attack-response payoff.

**Why asked:** Asked in B08 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q3: How do you secure the pipeline itself (secrets, trusted builders, pinned base images)?</summary>

**Model answer:** 1) SECRETS — never in repo/logs/build args (visible in image history); inject at runtime via secret store (Vault/SSM) scoped per job; rotate; scan for leaked secrets (gitleaks in CI). 2) TRUSTED BUILDERS — run builds on managed/self-hosted hardened runners (not arbitrary PR code on shared runners), pin runner images, least-privilege runner IAM (scoped OIDC role per repo, no broad creds). 3) PINNED BASE IMAGES — use digest-pinned (sha256) base images, not :latest (moving target = supply-chain risk); scan them; rebuild on updates deliberately. 4) DEPENDENCY PINNING — lockfiles, verified deps; 5) SIGNING — sign artifacts (cosign) + SBOM attestation; 6) PROTECTED BRANCHES — main protected, PR review required, no direct push to prod branch; 7) SCA/SAST in CI; 8) audit — CI runs logged, approvals recorded (compliance). The mindset: the pipeline is a privileged system — treat it like prod (creds, isolation, review).

**Rubric:** 1 = secrets + pinned images. 2 = signing + protected branches. 3 = OIDC least-priv + hardened runners + digest-pinning + pipeline-as-privileged-system.

**Why asked:** Asked in B08 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q4: Policy as code: Kyverno vs OPA/Gatekeeper — how do you enforce 'no latest tag' or 'must have SBOM'?</summary>

**Model answer:** Kyverno: k8s-native policy engine — policies as CRDs, no DSL to learn (YAML match/validate/mutate), easy adoption; good for k8s admission policies (image tag rules, required labels, security context). OPA/Gatekeeper: general-purpose policy engine (Rego DSL) — more powerful/expressive, policy as code across k8s + cloud + CI; Gatekeeper = OPA integrated as k8s admission controller (ConstraintTemplates + Constraints). Enforcing 'no latest': policy that blocks images with tag latest (Kyverno: validate image tag != latest; Gatekeeper: Rego checking image). 'Must have SBOM': admission policy requiring an annotation/attestation (image signed with SBOM attach) — or verify via cosign in admission. Choose: k8s-only, want YAML simplicity → Kyverno; need complex logic or cross-platform policies (k8s + Terraform + CI) → OPA/Gatekeeper. Both enforce at admission (before the pod exists) — policy as code = reviewable, versioned, testable.

**Rubric:** 1 = both are admission policy. 2 = Kyverno YAML vs OPA Rego. 3 = the two example policies + admission-timing + cross-platform choice.

**Why asked:** Asked in B08 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q5: What do you do when a scan finds a critical CVE with no fixed version?</summary>

**Model answer:** 1) DON'T PANIC, TRIAGE: is it REACHABLE in our deployment (does our code path touch it? network-exposed? attacker-controllable input?)? — reachability downgrades urgency; 2) MITIGATE with compensating controls while no fix exists: network isolation (block external exposure, restrict egress), WAF/rate-limit/input validation, disable the vulnerable feature, least-privilege the service (containment), monitor aggressively (specific alerting on the vulnerable path); 3) CHECK for workarounds — many CVEs have config-level mitigations (published workarounds); 4) TRACK: escalate to the team, add to risk register, set review date, subscribe to the advisory for the fix; 5) when a fix lands: patch immediately + verify + document; 6) PREVENT: why were we exposed (dependency hygiene, scanning cadence), add regression scanning; 7) communicate honestly (internal + customer if exposed). Senior framing: no-fix criticals happen — the response is risk-based (reachability + compensating controls + tracking), not alarm.

**Rubric:** 1 = wait for fix. 2 = reachability triage + mitigations. 3 = compensating-controls + tracking + prevention loop + honest comms.

**Why asked:** Asked in B08 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q6: Cosign image signing — how do you sign and verify container images (keyless OIDC) and enforce with Kyverno?</summary>

**Model answer:** Cosign (Sigstore) signs container images to prove who built them and that they weren't tampered with. Keyless signing: no long-lived keys — the builder's OIDC identity (GitHub Actions workload identity) is used; cosign exchanges it for a short-lived cert, signs the image, and stores the signature + cert transparency log entry. Sign in CI right after build: `cosign sign <image>` (needs OIDC env in the workflow). Verify: `cosign verify --certificate-identity=... --certificate-oidc-issuer=... <image>` — fails if the signer identity isn't exactly who you expect (the supply-chain check: 'did OUR pipeline build this?'). Enforce admission with Kyverno: a ClusterPolicy with `verifyImages` — 'only allow images signed by our CI identity' → unsigned or wrongly-signed images are rejected at pod creation in prod namespaces. Value: it closes the 'image could be swapped or built by an attacker' gap that SBOM-only leaves open; pairs with SBOM + SLSA provenance for the full 'what/who/prove' story.

**Rubric:** 1 = 'signs images'. 2 = keyless OIDC flow + cosign verify. 3 = Kyverno verifyImages admission policy + the SBOM/SLSA pairing.

**Why asked:** Image signing is the 2025-26 supply-chain standard — SBOM alone answers 'what's inside'; signing answers 'who built it and can you prove it'.
</details>


### Threat modeling & compliance

<details>
<summary>❓ Q1: STRIDE — walk me through threat modeling a simple web service</summary>

**Model answer:** STRIDE categories: Spoofing (fake identity), Tampering (modify data), Repudiation (deny action), Information disclosure (leak), Denial of service (unavailable), Elevation of privilege (more access). Walk a web service (browser → ALB → API → RDS, auth via IdP): 1) draw the data flow (trust boundaries: internet / LB / app / DB); 2) apply STRIDE per component: Spoofing — attacker impersonates users → authN (OIDC, mTLS); session hijacking → HttpOnly cookies, secure headers; Tampering — request/data modification → TLS, signed requests, checksums, input validation; Repudiation — user denies action → audit logs; Info disclosure — SQLi/IDOR/leaked secrets → parameterized queries, least-privilege, encryption at rest; DoS — traffic flood → rate limiting, WAF, autoscaling; Elevation — RCE/privilege escalation → patch cadence, least-privilege roles, no code execution in DB tier; 3) prioritize by risk (likelihood × impact); 4) mitigate the top ones; 5) document + re-review on change. The answer is the METHOD (data flows → threats → mitigations), not a memorized list.

**Rubric:** 1 = names STRIDE. 2 = walks one component. 3 = data-flow + trust boundaries + risk-prioritized mitigations + re-review loop.

**Why asked:** Asked in B08 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q2: Zero Trust: what does 'never trust, always verify' mean operationally (mTLS, identity, microsegmentation)?</summary>

**Model answer:** Operational pillars: 1) IDENTITY as the boundary (not the network) — every request authenticated + authorized, regardless of source (no 'trusted internal network'); 2) mTLS everywhere — mutual TLS between services (both sides verify certificates) → service identity + encrypted in-transit (service mesh or linkerd/istio); 3) MICROSEGMENTATION — fine-grained network policy (NetworkPolicies: default-deny + allow specific flows; service-to-service ACLs) — a compromised workload can't pivot laterally; 4) CONTINUOUS VERIFICATION — not just at entry: re-check tokens, session risk, device posture; short-lived creds; 5) LEAST PRIVILEGE — minimal per-identity access; 6) OBSERVABILITY — log/alert on access (audit: who accessed what). Concretely: k8s cluster with default-deny NetworkPolicies + mTLS mesh + OIDC authN + RBAC least-privilege + audit logs. The 'operationally' part: it's a set of controls, not a product — VPN-less remote access via identity-aware proxy, zero-trust on the wire via mTLS.

**Rubric:** 1 = 'verify everything'. 2 = mTLS + microsegmentation. 3 = identity-as-boundary + continuous-verification + the concrete control stack.

**Why asked:** Asked in B08 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q3: ISO 27001 vs SOC 2 vs NIST CSF — what do they certify and when does a company need each?</summary>

**Model answer:** ISO 27001: certifiable MANAGEMENT SYSTEM for information security (ISMS) — process/controls framework, audited by third party, international standard; companies need it for: global/enterprise contracts, regulated industries (finance, gov), EU business. SOC 2: US trust-services attestation — controls over Security/Availability/Confidentiality/Privacy/Processing integrity (Type I = design, Type II = operating effectiveness over time); SaaS/cloud vendors need it for: US enterprise sales (procurement demands SOC 2), demonstrating controls in practice. NIST CSF: a FRAMEWORK (not certification) — 5 functions (Identify, Protect, Detect, Respond, Recover) + controls, guidance for improving security posture; used as: internal roadmap, US federal/regulated orgs' baseline, sector guidance (critical infrastructure). When: early SaaS → SOC 2 (sales requirement); international/enterprise → ISO 27001; US gov/critical infra → NIST CSF. They overlap in controls — many orgs run one program satisfying multiple (SOC 2 + ISO mapped).

**Rubric:** 1 = rough purposes. 2 = cert vs framework + SOC 2 Type I/II. 3 = market-driven selection (who's asking) + overlapping-controls strategy.

**Why asked:** Asked in B08 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q4: How does compliance show up in your daily work (audit trails, change control, evidence)?</summary>

**Model answer:** Daily mechanics: 1) AUDIT TRAILS — every change is logged: who/what/when (Git history, CloudTrail, k8s audit logs, CI logs); treat logs as evidence (retention per policy); 2) CHANGE CONTROL — changes go through review + approval (PRs, change tickets, approval gates for prod); emergency changes get post-hoc approval; 3) EVIDENCE — compliance asks 'prove it': keep run artifacts (test results, scan reports, approvals) attached to changes; access reviews (quarterly who-has-what, sign-off); 4) GUARDRAILS — policies as code (Kyverno/OPA, Terraform policy, GitHub branch protection) make compliance AUTOMATIC (can't deploy untagged image, can't merge unreviewed); 5) DOCUMENTATION — runbooks, ADRs, incident postmortems double as compliance evidence; 6) periodic: control testing, evidence collection for audits (SOC 2/ISO), remediation of findings. The answer: compliance isn't paperwork — it's the discipline of auditable changes + automated guardrails + retained evidence.

**Rubric:** 1 = audit logs. 2 = change control + evidence. 3 = policy-as-code guardrails + access reviews + postmortems-as-evidence + audit-readiness.

**Why asked:** Asked in B08 — verify against the module's checklist items and research block.
</details>


### Cost responsibility

<details>
<summary>❓ Q1: A team's bill is exploding — how do you investigate and communicate the fix?</summary>

**Model answer:** Investigate: 1) Cost Explorer: daily spend by service → isolate the jumped service; 2) drill: by region/account/tag → by resource (which EC2/ASG/EKS cluster/RDS/NAT); 3) look for the classics: instances left running (dev/experiments), oversized instances, NAT GW hours (expensive + always on), data egress (NAT/CloudFront spikes), unattached volumes/snapshots/EIPs, RDS multi-AZ left on, spot interruptions causing refills; 4) correlate with events (deploy, test run, traffic spike). Communicate: 1) to the team — numbers, not blame: 'API prod +$3.2k since Jun 12, NAT egress 70% — likely the new sync job'; 2) agree the fix (right-size, schedule stop, delete orphaned) with owner + date; 3) to management — one slide: what spiked, root cause, fix + expected saving, prevention (budgets/alerts/tagging). Tone: cost is a system property — investigate like an incident, communicate like an engineer (data + plan), never blame a person.

**Rubric:** 1 = Cost Explorer by service. 2 = drill to resource + classic culprits. 3 = data-driven comms to team + management + prevention loop.

**Why asked:** Asked in B08 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q2: How do you make cost a team responsibility (budgets, tagging, dashboards, reviews)?</summary>

**Model answer:** 1) OWNERSHIP — cost allocation by tag (team/service), so each team sees ITS number (cost-allocation tags, billing by tag); 2) VISIBILITY — per-team cost dashboards (Grafana/QuickSight, daily), embedded in team rituals; 3) BUDGETS — AWS Budgets + alerts at thresholds (50/80/100% + forecast) → email/Slack to the team; anomaly detection; 4) REVIEWS — regular cost review slot (monthly, in the team retro): what changed, biggest items, one action per review; 5) GATES — new infra must estimate cost in the PR/design review (cost as a review criterion); 6) GUARDRAILS — tagging enforcement (deny untagged), idle-cleanup automation, rightsizing reports; 7) INCENTIVES — cost saving recognized like feature work (it IS engineering). The shift: from 'finops team polices us' to 'each team owns its spend' — visibility + ownership + rhythm.

**Rubric:** 1 = budgets + tags. 2 = dashboards + reviews. 3 = cost-in-PR-review + team-ownership culture + automation guardrails.

**Why asked:** Asked in B08 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q3: Right-sizing vs scheduling vs spot — order your cost levers for a stateless service</summary>

**Model answer:** Order by impact/cost-effort: 1) RIGHT-SIZING first — fix over-provisioning (biggest, fastest win): downsize underused instances/containers (utilization data → correct size); stateless = safe to resize; 2) SCHEDULING — stop/scale-to-zero when not needed: dev/test off-hours, batch windows, environment scaling (huge for non-prod); 3) SPOT — for the elastic/burst portion (fault-tolerant stateless = ideal spot candidate): mixed ASG (spot base + on-demand buffer) or spot for overflow; 4) after those: reserved/SP for the remaining steady baseline, then autoscaling tuning, then data/storage cleanup (snapshots, old objects). Rationale: right-sizing cuts the BASE everywhere; scheduling cuts idle time (often >50% of dev spend); spot cuts the elastic remainder — each lever compounds and no lever depends on another. Bonus: measure before/after per lever.

**Rubric:** 1 = names levers. 2 = orders right-size → schedule → spot. 3 = compounding rationale + utilization-data-driven + before/after measurement.

**Why asked:** Asked in B08 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q4: How do you prove cost savings to management (before/after numbers)?</summary>

**Model answer:** Show numbers with a before/after story: 1) BASELINE — pick a stable window (e.g. 30-90 days, seasonality-adjusted): average monthly cost + utilization before; 2) CHANGE — what you did (right-sized N instances, stopped dev off-hours, moved M to spot) — each action with its own attribution; 3) AFTER — the same window after the change, SAME metrics; 4) DELTA — $ saved/month + % (e.g. 'prod API: $4.1k → $2.6k/mo, −36%') AND the non-$ wins (utilization 12% → 45%, no SLO impact); 5) TREND — show the run-rate chart (the dip at the change point); 6) caveats honestly (one-time vs recurring, what you didn't do). Format: one page, chart + table, tied to business terms (annualized $). Include: what we're NOT saving (prevented-spend framing) + prevention going forward (budgets). The senior answer: cost savings need a CONTROL (baseline), an ATTRIBUTION (per action), and a TREND (not one snapshot).

**Rubric:** 1 = before/after numbers. 2 = baseline window + delta. 3 = per-action attribution + trend chart + annualized framing + honest caveats.

**Why asked:** Asked in B08 — verify against the module's checklist items and research block.
</details>


### Team skills

<details>
<summary>❓ Q1: Tell me about a time you disagreed with a teammate on approach — what happened and how did you resolve it?</summary>

**Model answer:** STAR-structured, honest, outcome-focused: Situation — 'choosing a migration approach: they wanted big-bang, I wanted incremental'; Task — 'migrate service X without downtime'; Action — 'I listened to their reasoning (they feared config drift with parallel systems), I gave data (rolling migration with feature flags showed risk per step), we agreed on a HYBRID: incremental per-tenant with a rollback per step, and we time-boxed it'; Result — 'migrated 100% with zero downtime; their concern about drift was valid — we added a drift check per wave; relationship strengthened'. What they're grading: 1) you can disagree WITHOUT being disagreeable (framing: data + shared goal); 2) you LISTENED and their point shaped the outcome (not 'I was right'); 3) the resolution was a synthesis or a clear decision, not avoidance; 4) you learned something. Avoid: villainizing them, claiming total victory, or 'we agreed to disagree' (no closure).

**Rubric:** 1 = describes a disagreement. 2 = STAR + data-driven resolution. 3 = listening + synthesis + shared-goal framing + lesson learned.

**Why asked:** Asked in B08 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q2: How do you give a code review that's firm but kind? What do you check first?</summary>

**Model answer:** Tone: review the CODE, not the author — 'this function risks X because Y' not 'you wrote this wrong'; ask questions instead of commanding ('what happens if input is null here?'); acknowledge what's good; separate nitpicks (style) from blockers (correctness) and label them; give the WHY ('we do X because Y' — context beats rules); be specific + actionable (suggest the fix, not just 'fix this'). Check first (priority order): 1) CORRECTNESS — does it do what it claims? edge cases, error handling (fail loudly), concurrency/race conditions; 2) SECURITY/RELIABILITY — input validation, secrets, authz, timeouts/retries, resource leaks; 3) PERFORMANCE — hot paths, N+1, unbounded growth; 4) TESTABILITY — are there tests? do they assert the right things?; 5) DESIGN — fits the architecture, naming, duplication; 6) then style/nits. The senior move: review with the AUTHOR's goal in mind (help them land it well), not gatekeeping.

**Rubric:** 1 = kind tone. 2 = correctness-first checklist. 3 = question-framing + blocker-vs-nit separation + why-context + author-focused.

**Why asked:** Asked in B08 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q3: How do you onboard a new engineer — what do they need in week 1?</summary>

**Model answer:** Week 1 goals: environment working + first deploy + context + safety net. Concrete: 1) BEFORE day 1: access ready (GitHub, AWS/k8s, Slack), laptop setup doc, their name on the team roster; 2) DAY 1: pairing on setup (don't hand them a doc alone — a buddy walks through it, fixing the doc as you go); the 'golden path' doc (run it locally, deploy to staging, run tests); 3) DAYS 2-3: shadow a deploy + a debugging session (see the real loop); give them a small real task (not busywork): a tiny bug + a tiny feature; 4) WEEKS 1-2: first production deploy WITH a buddy (and a rollback demo — 'kill a pod, restore it'); architecture walkthrough (diagram + live); 5) support structure: who to ask (buddy + on-call intro), where docs live, meeting calendar; 6) measure: by end of week 1 they can run/debug/test solo-ish; by week 2 they've shipped something real. The principle: onboarding is about CONFIDENCE + CONTEXT — every task has a safety net (buddy, staging, rollback), and the docs get fixed by whoever follows them.

**Rubric:** 1 = setup + intro. 2 = golden path + buddy. 3 = first-real-task + shadow-deploy + rollback-demo + doc-fixing-as-you-go.

**Why asked:** Asked in B08 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q4: How do you communicate with a non-technical stakeholder during an outage?</summary>

**Model answer:** Translate to THEIR language: impact + status + trust, not technical detail. Structure: 1) WHAT'S HAPPENING (impact): 'payments are down for ~X% of customers since 2:15pm' — not 'the APISIX ingress is returning 502s'; 2) WHAT WE'RE DOING: 'we've identified a faulty software update and are rolling it back — expected recovery ~30 min' (high-level actions + ETA, even if 'ETA TBD, will update'); 3) WHAT IT MEANS FOR THEM: affected customers, revenue/operations impact, what they should tell their stakeholders; 4) NEXT UPDATE: explicit cadence ('I'll update you every 30 minutes or sooner if it changes') — predictability is calming; 5) HONESTY: 'we don't know yet, investigating' is acceptable — silence and vague optimism are not; 6) AFTER: a short summary (what happened, impact, what we're changing) in plain language. Rules: no jargon/acronyms, no blame, one source of truth (designate the comms person), acknowledge impact first. Practice: 'if you can't explain the outage to your mom, you haven't translated it yet'.

**Rubric:** 1 = plain language. 2 = impact + action + ETA structure. 3 = cadence commitment + honesty + one-voice + post-incident summary.

**Why asked:** Asked in B08 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q5: How do you run a blameless postmortem with a remote, async team spread across time zones?</summary>

**Model answer:** Run it async-first: 1) the INCIDENT DOC is the shared artifact — timeline, impact, actions, hypotheses — filled in by everyone in their own timezone as events unfold (async contributions beat a rushed sync); 2) after resolution, a structured POSTMORTEM template in the repo (summary, timeline, root cause, what went well/wrong, action items) with owners; 3) collect written input from each zone/role (SRE, dev, DBA) — everyone contributes in their working hours; 4) ONE recorded review call for discussion (or a doc-comments thread), recorded so other timezones catch up; keep it blameless: language about systems and processes ('the deploy window lacked a rollback check'), not people ('who pushed this'); 5) action items with owners + due dates tracked in the issue tracker — the postmortem's value is the FOLLOW-UP, and in async that means written, tracked, reviewed; 6) share the outcome widely in writing. Senior answer: in a distributed team the postmortem IS an async document — blamelessness + written action items + a recorded review, not a single live meeting.

**Rubric:** 1 = shared doc + template. 2 = written contributions + recorded review. 3 = blameless language + tracked action items + follow-up-as-the-value.

**Why asked:** Distributed postmortems are the reliability-culture question — blamelessness must survive async, and follow-up must be written and tracked.
</details>


### Module research

<details>
<summary>❓ Q1: On-call: runbooks, severity levels, escalation paths, incident communication, post-incident review, on-call rotations & load</summary>

**Model answer:** Runbooks = step-by-step response (alert→playbook); severity levels SEV1-3 by impact/scope/duration; escalation path (primary→secondary→lead→exec) with promotion criteria; incident comms = status page + stakeholders + war room (one voice, cadence); post-incident review = blameless postmortem + owned actions; rotations = primary/secondary, fair load, handover; load managed via alert hygiene + toil reduction (target < 1-2 actionable pages/day).

**Rubric:** 1 = runbook + severity. 2 = escalation + comms. 3 = load management + postmortem loop + rotation design.

**Why asked:** Asked in B08 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q2: Documentation: runbooks, architecture docs, decision records (ADRs), README discipline, wiki hygiene</summary>

**Model answer:** Runbooks (how to fix), arch docs (how it works), ADRs (why decisions — context/decision/consequences), README (entry: what/run/test/deploy), wiki hygiene (owned, reviewed, findable, pruned). Keep docs-as-code in repos, tied to change pipeline, with owners + review cadence.

**Rubric:** 1 = doc types. 2 = when each is written. 3 = doc-as-code + ownership + anti-rot practices.

**Why asked:** Asked in B08 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q3: Security basics: least privilege, RBAC, secrets management (vault/SOPS/External Secrets), SSH hardening, TLS, container security (content trust, resource limits, Bench Security), supply chain (image scanning, SBOM)</summary>

**Model answer:** Least privilege (deny-first, per-service IAM/RBAC/network); RBAC roles/bindings; secrets via Vault/SOPS/ESO (never in repo); SSH: keys-only, no-root, firewall; TLS: auto-renew (cert-manager/ACM), expiry alerts; containers: signed images, resource limits, CIS benchmark (docker-bench/trivy misconfig); supply chain: image scanning (trivy/grype) + SBOM + SLSA provenance.

**Rubric:** 1 = least privilege + RBAC. 2 = secrets + SSH + TLS. 3 = container hardening + supply chain (scan/SBOM/provenance) as one story.

**Why asked:** Asked in B08 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q4: Threat modeling: STRIDE, attack surface review, threat model as code, OWASP Top 10 awareness</summary>

**Model answer:** STRIDE (spoof/tamper/repudiate/disclose/DoS/elevate) applied over data-flow diagrams with trust boundaries; attack surface review = minimize exposed interfaces (ports, endpoints, accounts); threat model as code = capture models in repo (draw.io/pytm/Owasp Threat Dragon) with review on change; OWASP Top 10 = the practical vulnerability checklist (injection, authz, XSS, SSRF, misconfig...) to seed the model.

**Rubric:** 1 = STRIDE list. 2 = data-flow + attack surface. 3 = threat-model-as-code + OWASP-seeded prioritization + re-review loop.

**Why asked:** Asked in B08 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q5: Cost: FinOps — right-sizing, spot/reserved mix, tagging, cost allocation, idle resource cleanup, budget alerts</summary>

**Model answer:** FinOps loop: right-size (utilization data), spot for elastic + reserved/SP for baseline + on-demand buffer, tag everything (cost allocation), budget alerts + anomaly detection, idle cleanup automation (unattached EBS/EIPs/stopped instances/snapshots), per-team dashboards + reviews. Cost is a team metric, reviewed like reliability.

**Rubric:** 1 = right-size + tags. 2 = spot/reserved mix + budgets. 3 = allocation + cleanup automation + team-ownership culture.

**Why asked:** Asked in B08 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q6: Compliance/audit: audit logs, access reviews, SOC2/ISO awareness, data retention</summary>

**Model answer:** Audit logs: who/what/when (CloudTrail, k8s audit, Git, CI) with retention; access reviews: quarterly re-cert of who can access what (IAM/roles/permissions); SOC 2/ISO: control frameworks — evidence = logs + approvals + policies; data retention: keep only as long as needed (compliance + cost), lifecycle rules, deletion policy. Compliance = auditable changes + guardrails + retained evidence.

**Rubric:** 1 = audit logs. 2 = access reviews + retention. 3 = evidence-based audit-readiness + policy-as-code guardrails.

**Why asked:** Asked in B08 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q7: SRE crossover: toil reduction, automation of repetitive ops, error budgets as guardrails</summary>

**Model answer:** Toil = manual, repetitive, automatable, non-innovative ops work — measure and eliminate (scripting, self-healing, self-service); automation of repetitive ops = the tooling that removes toil (runbooks → automation); error budgets as guardrails = SLO-driven release policy (velocity allowed while budget remains; freeze when exhausted) — reliability made quantitative. Crossover: ownership of reliability + cost + security all lean on the same habits (measure, automate, review).

**Rubric:** 1 = toil definition. 2 = automation of ops. 3 = error-budget-as-guardrail + the ownership mindset.

**Why asked:** Asked in B08 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q8: Team skills: code review culture (security + reliability lens), mentoring juniors, cross-team collaboration, incident communication (status updates, stakeholder comms), teaching/onboarding docs, pushing back on scope with data</summary>

**Model answer:** Code review: correctness/security/reliability first, kind-but-firm tone, learning-focused; mentoring: explain why, escalate independence; cross-team: shared goals, clear owners, communication; incident comms: status page + stakeholders, plain language, cadence; onboarding docs: golden-path, tested by real juniors; push back on scope with DATA (impact/risk/cost numbers, alternative options) — evidence-based 'no', not refusal.

**Rubric:** 1 = review + mentoring. 2 = comms + docs. 3 = data-driven scope pushback + the collaboration pattern across all five.

**Why asked:** Asked in B08 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q9: On-call deep: rotation load, severity + escalation, runbook quality, post-incident communication</summary>

**Model answer:** Rotation load: measure pages/shift, fairness, sustainability (alert hygiene to reduce); severity + escalation: clear SEV defs + promotion rules + escalation tree; runbook quality: tested, current, alert-linked, reviewed; post-incident comms: status updates during, clear summary + actions after, stakeholders informed in plain language.

**Rubric:** 1 = load + severity. 2 = escalation + runbooks. 3 = measured sustainability + comms discipline + improvement loop.

**Why asked:** Asked in B08 — verify against the module's checklist items and research block.
</details>


---

## B09 Mid interview prep + portfolio upgrade

### The 2am litmus test

<details>
<summary>❓ Q1: You're alone at 2am and the deploy is broken — walk me through the decision: roll forward, roll back, or freeze?</summary>

**Model answer:** Decision tree: 1) CONFIRM the deploy caused it (correlate deploy time with error start; if no deploy recently — it's not a deploy problem, treat as incident, don't roll anything); 2) Is there a KNOWN, QUICK fix? → roll FORWARD (apply the one-line fix) — only when confident; 3) Otherwise ROLL BACK — the default: previous artifact available (immutable tags), rollback is a known-tested path, service restored fast; 4) FREEZE when: rollback won't help (infra/dependency issue), the rollback itself is risky (DB migrations), or you need to understand before acting — freeze = stop changes, stabilize, investigate. At 2am the bias: roll back FIRST (restore service = priority), investigate the root cause after; roll forward only with a clear fix. Preconditions that make 2am safe: immutable artifacts (old version retrievable), tested rollback runbook, deploy history visible. The senior answer: the 2am decision is made BEFORE 2am — artifact availability + rollback test + runbook decide for you.

**Rubric:** 1 = roll back. 2 = confirm-deploy-caused + rollback default. 3 = the decision tree + freeze-when-unknown + preconditions (artifact/runbook) decided in advance.

**Why asked:** Asked in B09 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q2: What's in your runbook that makes the 2am call safe?</summary>

**Model answer:** The runbook makes 2am safe by containing: 1) the ALERT-TO-ACTION map — every page links to its playbook (no thinking needed to start); 2) TOP 5 playbooks with exact commands + expected output: 5xx spike → check deploy window → rollback command (kubectl rollout undo / helm rollback / re-deploy previous image) + verify steps; DB slow → read-replica check + failover steps; node down → drain/PDB steps; DNS/ingress → resolution steps; resource exhaustion → scale steps; 3) the rollback + verification procedure (what 'fixed' looks like: metrics thresholds, smoke test); 4) escalation + contacts (secondary, DBA, vendor, manager, exec for SEV1); 5) access quickstart (clusters, creds, dashboards); 6) known issues + past incidents (the 'we've seen this' index); 7) decision guidance (when to roll back vs freeze); 8) post-incident checklist (doc, postmortem, runbook update). The property that matters: a woken-up, stressed engineer can execute step 1 within 60 seconds without improvising.

**Rubric:** 1 = rollback steps. 2 = alert→playbook map + contacts. 3 = exact-commands + verify-definition + known-issues index + 60-second-start property.

**Why asked:** Asked in B09 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q3: Kill a service, deploy a bad artifact, roll back — do it live and explain each step</summary>

**Model answer:** Live demo (k8s): 1) DEPLOY the service: kubectl apply -f deploy.yaml (Deployment, 3 replicas) → verify: kubectl get pods -w (3 Running), kubectl rollout status; 2) KILL it: kubectl delete pod <pod> → watch the ReplicaSet recreate it automatically (self-healing — the controller restores desired state) → explain: this is why we use Deployments; 3) DEPLOY A BAD ARTIFACT: kubectl set image deploy/app app=repo/app:broken (or apply a broken manifest) → watch pods go CrashLoopBackOff/ImagePullBackOff → check: kubectl get pods (ImagePullBackOff), kubectl logs, rollout status shows stalled; 4) ROLL BACK: kubectl rollout undo deployment/app (→ reverts to previous revision) → watch pods recreate from the GOOD image → verify: kubectl get pods (Running), kubectl rollout status deployment/app (successfully rolled out), kubectl get events (no errors), curl/health endpoint green. Explain each step: what's happening, what the controller does, why rollback is safe (previous revision stored, immutable image). That's the 2am exercise: deploy → break → rollback with verification.

**Rubric:** 1 = deploy + delete pod. 2 = self-healing explanation + bad artifact. 3 = rollout undo + verification + why-it's-safe reasoning.

**Why asked:** Asked in B09 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q4: What does 'done' look like at 2am — what proves the system is actually stable again?</summary>

**Model answer:** 'Done' = the system is VERIFIED healthy, not just 'the command finished': 1) ROLLOUT health: kubectl rollout status (successfully rolled out), all replicas Running/Ready, 0 CrashLoopBackOff; 2) METRICS back to baseline: error rate at/near pre-incident level, latency p50/p99 normal, saturation (CPU/mem) within range — compare against the SAME time yesterday or the dashboard's normal band; 3) USER-PATH check: smoke test the critical flow (health endpoint 200, login/checkout/API works — a scripted smoke test); 4) LOGS: no new error signatures; 5) STABILITY WINDOW: observed stable for a defined period (15-30 min) — no flapping, no recurring alerts; 6) ALERTS: the paging alert is resolved/acknowledged with root cause noted, not just silenced; 7) ESCALATION state: incident closed or downgraded appropriately; 8) DOCUMENTED: what happened + what you did (for the postmortem); 9) not-done signals: metrics still creeping, errors intermittently, unknown cause, 'it seems ok' without verification. The senior answer: done = evidence (metrics + smoke + stability window), not elapsed time.

**Rubric:** 1 = pods healthy. 2 = metrics baseline + smoke test. 3 = stability window + evidence-based done + not-done signals.

**Why asked:** Asked in B09 — verify against the module's checklist items and research block.
</details>


### System design for ops

<details>
<summary>❓ Q1: Design a CI/CD system for a team of 20 — scale, failure modes, cost</summary>

**Model answer:** Scale: 20 devs, ~10-20 services, 20-50 deploys/day. Design: 1) pipeline-as-code — GitHub Actions (managed, cheap to start) or GitLab CI (self-hosted option); CI stages: lint → unit → build → scan (SAST/image) → push (immutable SHA tags) → deploy staging; CD: ArgoCD (GitOps) for k8s — controller syncs from Git, env promotion = tag/commit update; 2) caching + parallelism (sharded tests) to keep CI < 10 min; 3) failure modes + mitigations: flaky tests → quarantine + retry policy; secret leaks → gitleaks + short-lived creds; bad artifact deploys → canary + auto-rollback (Argo Rollouts) + immutable tags; CI outage → self-hosted runners fallback / rerun; race in shared envs → namespace/env separation + locking; 4) cost: managed runners ~$20-50/dev/mo (or self-hosted for big fleets), registry storage (prune), env compute (dev off-hours scaling); budget: ~$500-2k/mo all-in at this scale. Senior points: build-once artifact, GitOps CD (no cluster creds in CI), canary + rollback tested, metrics on pipeline (MTTR, deploy frequency).

**Rubric:** 1 = stages + tools. 2 = build-once + GitOps + canary. 3 = failure-mode map (flaky/secrets/bad-artifact) + cost estimate + metrics.

**Why asked:** Asked in B09 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q2: Design a monitoring/alerting system for a microservices fleet — pillars, cardinality, alerting</summary>

**Model answer:** 1) PILLARS: metrics (Prometheus: RED per service — rate/errors/duration + saturation; node/container exporters), logs (Loki: structured + trace IDs), traces (OTel + Tempo: auto-instrument + key spans); 2) COLLECTION: OTel collector → Prometheus/Loki/Tempo; per-service SLOs (availability + latency targets); 3) CARDINALITY CONTROL: bounded labels (service, endpoint, status_class, instance) — no user/request IDs in labels (logs instead); series monitoring; 4) DASHBOARDS: wall (RED + SLO burn) + investigation pages (per-label breakdowns, links to logs/traces); 5) ALERTING: alert on SYMPTOMS + SLO burn rate (multi-window: fast 1h high-burn + slow 6h) → Alertmanager routes (service team, on-call); every alert has a runbook; 6) SLO tracking + error-budget dashboards; 7) failure modes: alert fatigue (tune + dedup), cardinality explosion (guardrails), missing correlation (trace IDs everywhere), on-call not knowing the service (runbooks). Keep it minimal-but-complete: RED + SLO + burn-rate is 80% of the value.

**Rubric:** 1 = three pillars. 2 = RED + SLO + cardinality. 3 = burn-rate alerting + runbook-per-alert + failure-mode awareness.

**Why asked:** Asked in B09 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q3: Design an autoscaling setup for a stateless API — metrics, cooldown, burst handling</summary>

**Model answer:** 1) METRICS: scale on CPU (target-tracking ~50-60%) + custom metric (requests/sec per pod, queue depth, latency p99 threshold) — pick the bottleneck, CPU is easiest, RPS is more accurate for request-bound APIs; 2) HPA: min 3 / max 20 pods, target utilization; vertical dimension: no (stateless = horizontal only); 3) COOLDOWN: scale-out fast (immediate, small cooldown 30-60s), scale-in SLOW (5-10 min stabilization + hysteresis) to avoid thrash (the classic oscillation bug); 4) BURST: scale-out can't beat a 10x instant spike → buffer via: higher min replicas, larger instance pool headroom (Cluster Autoscaler margins), rate limiting/queueing at the edge (graceful degradation), pre-warming (scheduled scale-up before known events); 5) INFRA layer: Cluster Autoscaler/Karpenter adds nodes (with headroom), spot for elastic + on-demand buffer; 6) FAILURE MODES: pod churn on spike (avoid by fast scale-out + readiness), throttling (limits vs requests headroom), cold starts (node provisioning lag — warm pool). The senior answer: autoscaling handles GRADUAL + small spikes; burst handling is pre-planned (headroom, quotas, degradation).

**Rubric:** 1 = CPU metric + HPA. 2 = cooldown asymmetry + min/max. 3 = burst strategy (headroom/limits/degradation) + infra layer + failure modes.

**Why asked:** Asked in B09 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q4: Design a multi-region deployment — failover, data replication, RTO/RPO</summary>

**Model answer:** 1) TOPOLOGY: active-passive (simplest: primary region serves, standby warm for failover) vs active-active (both serve, higher complexity); 2) DATA: the hard part — DB replication: RDS cross-region read replica (promote on failover) or Aurora global (fast failover, RPO ~1s); for app state: replicated storage (S3 cross-region replication), session/cache replicated or regional; 3) FAILOVER: DNS-based (Route 53 failover routing + health checks) or LB/Global Accelerator; runbook'd failover with tested cutover (data loss window = RPO, downtime = RTO); 4) RTO/RPO: define targets (e.g. RPO 5 min, RTO 30 min) → choose replication + failover tech to meet them → TEST quarterly (real failover drills — the only proof); 5) APP: stateless app (same artifact both regions), config per region, idempotent writes (avoid write conflicts in active-active — sharding or last-write-wins with care); 6) COST/COMPLEXITY: active-active is expensive + hard (conflict resolution); start active-passive + tested failover. Senior answer: data replication strategy IS the design — app failover is easy, data is the constraint.

**Rubric:** 1 = active-passive + DNS failover. 2 = cross-region DB replication + RTO/RPO. 3 = replication-tech choice by RPO + tested cutover + active-active conflict reality.

**Why asked:** Asked in B09 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q5: What breaks at 10x traffic and how do you find it?</summary>

**Model answer:** What breaks (in order typically): 1) DATABASE — the usual first: connection pool exhaustion, slow queries (indexes), locks, replica lag (RDS CPU/IO); 2) THIRD-PARTY/API limits — rate limits, external APIs become the bottleneck; 3) STATEFUL SERVICES — sessions/cache (Redis memory), message queues backing up; 4) APP CODE — N+1 queries, memory leaks under load, blocking calls; 5) NETWORK/EGRESS — bandwidth, NAT limits, LB capacity; 6) IDENTITY — authN/authZ services overwhelmed (OIDC provider); 7) cold-start/scale limits — autoscaling lag, node provisioning; 8) hidden: cron jobs colliding, background jobs starving. How to find: 1) LOAD TEST (k6/locust staged ramp) — find the knee per service; 2) traces — the fattest spans at high load; 3) metrics — queue depths, pool saturation, latency percentiles (p99 diverging from p50 = queueing); 4) PREPARE: capacity plan, autoscaling, degradation (cache, queue, throttle). The senior answer: 10x is usually DB + external dependencies + state, and you find it by TESTING (load) not waiting.

**Rubric:** 1 = DB breaks. 2 = pool/queue/external limits. 3 = ordered list + load-test methodology + degradation planning.

**Why asked:** Asked in B09 — verify against the module's checklist items and research block.
</details>


### Your war-story

<details>
<summary>❓ Q1: Tell me about the worst production incident you've handled — what happened, what did you do, what changed after?</summary>

**Model answer:** STAR with the three-part arc they asked for: 1) WHAT HAPPENED: specific — 'a config change disabled the payment webhook retry, silently dropping transactions for 4 hours until a customer reported'; impact: X transactions lost, 4h partial outage; 2) WHAT YOU DID: the response — detected/escalated, mitigated (restored config + replayed queue), the 3am discipline (restore first, investigate after); 3) WHAT CHANGED AFTER: the lasting fix — root cause (config change bypassed review) → actions: config-change review gate, retry monitoring alert (dead-letter queue alarm), replay tooling, postmortem-driven changes. They're grading: ownership (it was YOUR incident), honesty (including your part in it), the response pattern (detect→mitigate→learn), and SYSTEMIC change (not 'we said be more careful'). Have numbers: duration, impact, MTTR. Avoid: choosing an incident where you were passive, or one with no lesson.

**Rubric:** 1 = describes an incident. 2 = response + mitigation. 3 = systemic changes + ownership + numbers + the learning arc.

**Why asked:** Asked in B09 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q2: What's a project you're proud of and what was genuinely hard about it?</summary>

**Model answer:** Pick something with REAL difficulty + measurable outcome: e.g. 'built the team's GitOps setup: ArgoCD + Terraform from zero' — the HARD part: not the tooling, the migration (moving 30 services without downtime: canary per service, feature-flagged rollback, a weekend of supervised cutovers), the political part (getting teams to trust it), or the data (proving it worked: deploy time 40 min → 8 min, rollback from 20 min → 2 min). Structure: what it was → what was GENUINELY hard (the thing that nearly failed, the constraint) → what you did about it → measurable result → what you'd do differently. They're grading: authenticity (real struggle, not a smooth story), depth (you understand WHY it was hard), and outcome with numbers.

**Rubric:** 1 = a project + result. 2 = the difficulty identified. 3 = genuine-struggle + constraint + numbers + what-you'd-change.

**Why asked:** Asked in B09 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q3: Tell me about a time you automated away a painful task — before/after numbers</summary>

**Model answer:** Format: the PAIN (manual, recurring, error-prone, cost) → the AUTOMATION (what you built: script/pipeline/self-service) → BEFORE/AFTER numbers (the proof): 'manual monthly access review: 2 engineers × 2 days = 32h/month, error-prone (missed 3 stale accounts last time) → automated report + Slack review: 30 min/month, zero missed' or 'deploy: 40 min manual runbook (12 steps, 2 errors/month) → one-command pipeline: 8 min, zero manual steps'. Senior points: 1) measure the before (real numbers); 2) the automation is robust (idempotent, monitored, doesn't need babysitting — 'it runs itself and pages me if it fails'); 3) toil reduction framing (SRE vocabulary); 4) what you'd automate next (shows the mindset, not one event).

**Rubric:** 1 = a task + automation. 2 = before/after numbers. 3 = measured-pain + self-running automation + toil-reduction mindset + next-step.

**Why asked:** Asked in B09 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q4: What's a mistake you made and what did it teach you?</summary>

**Model answer:** Pick a REAL mistake with REAL consequences (not a fake-humble one), e.g. 'I merged a migration script that ran against prod because I tested on a copy with different data — it corrupted a table; we restored from backup, 2h impact'. The LESSON + the SYSTEMIC change (the part they grade): 'now migrations run via a reviewed pipeline with a pre-flight data check and a staged rollout; I also learned to question assumptions about environment parity'. Structure: what you did → what happened (impact, honest) → what you learned (the principle, not just the event) → what changed (the systemic fix). They're testing: self-awareness, accountability (no blaming), and that mistakes become PROCESS improvements. Avoid: trivial mistakes, or framing where you were blameless.

**Rubric:** 1 = a mistake. 2 = honest impact + lesson. 3 = systemic-change + accountability + environment-parity insight.

**Why asked:** Asked in B09 — verify against the module's checklist items and research block.
</details>


### Behavioral & ownership

<details>
<summary>❓ Q1: Why DevOps/SRE and not pure development? What draws you to ownership?</summary>

**Model answer:** Honest, personal, specific: e.g. 'pure dev gave me features but I was drawn to the whole lifecycle — seeing something through deploy, operations, and reliability; I like that ownership means the feedback loop is direct (my change, my on-call, my incident — the loop closes fast and I learn fastest there)'. Anchor points: 1) the END-TO-END loop (build → operate → learn → improve is satisfying + high-leverage); 2) PROBLEM DIVERSITY (incidents, capacity, automation, architecture vs feature work); 3) LEVERAGE (platform/automation work multiplies many teams' velocity — 1 pipeline serves 20 devs); 4) ownership culture (blameless learning, ownership of outcomes); 5) if you have an incident story, tie it in ('after my first on-call incident I was hooked — that's where the real lessons are'). Avoid: 'dev is boring', or purely reactive reasons. Frame as a positive pull, with a concrete example.

**Rubric:** 1 = 'I like ops'. 2 = end-to-end loop + leverage. 3 = incident-story tie-in + diversity + ownership-culture pull, positively framed.

**Why asked:** Asked in B09 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q2: Tell me about a time you owned something end-to-end — what did 'done' mean?</summary>

**Model answer:** Pick something you truly OWNED from idea to operation: e.g. 'built the logging pipeline: from choosing the stack (Loki vs ES) → implementation → rollout to 10 teams → on-call for it → metrics proving value'. What 'done' meant (the key part — define YOUR completion bar): 'done = teams self-serve (docs + onboarding, no tickets to me), it's reliable (no pages for 3 months), and it measurably cut MTTR (incident resolution 45 min → 20 min because logs are searchable) — plus the follow-through: training, docs, handover'. Structure: scope of ownership → the full arc (design → build → operate → improve) → how you defined success → evidence (numbers, adoption) → handover/sustainability. They're grading: genuine end-to-end ownership (including the boring parts: docs, on-call, adoption), a DEFINED done (not 'it worked'), and sustainability (it survives without you).

**Rubric:** 1 = a project owned. 2 = full arc + defined done. 3 = adoption/on-call/sustainability + evidence-based done.

**Why asked:** Asked in B09 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q3: How do you handle being on-call for a system you didn't build?</summary>

**Model answer:** 1) PROACTIVE learning BEFORE incidents: read the runbook + past postmortems (the incident history IS the docs); trace the architecture (diagram + key flows); try the deploy/rollback in staging yourself (the 2am test — can YOU run it?); get a buddy walkthrough (the builder or the previous owner); 2) DURING: the runbook + dashboards are your lifeline (alerts link to playbooks); escalate early to someone with history (the builder, the DBA) — escalation to knowledge, not failure; don't improvise on unknown systems (restore service, then ask); 3) AFTER: turn your ignorance into improvement — fix the docs (what confused you = what to document), add runbook steps, write the ADR summary; 4) ASK for a shadow period if it's a critical system. The senior answer: 'didn't build it' is temporary — you make it yours by reading history, practicing the procedures, and documenting your learnings. Also honest: nobody owns it fully alone; the system is the team's.

**Rubric:** 1 = read the runbook. 2 = staging practice + early escalation. 3 = postmortems-as-docs + fix-docs-you-stumbled-on + make-it-yours process.

**Why asked:** Asked in B09 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q4: How do you prioritize when everything is urgent (framework, not vibes)?</summary>

**Model answer:** A repeatable framework: 1) CLASSIFY: user impact × scope × urgency — the incident-style matrix: SEV1 (service down/major), SEV2 (degraded), SEV3 (minor), noise; 2) THE 2x2 / Eisenhower: urgent+important (do now), important-not-urgent (schedule — this is where real work lives), urgent-not-important (delegate/quick), neither (drop); 3) TIME-BOX: protect the deep-work block daily (the important-not-urgent stuff: automation, debt) from the urgent noise; 4) LIMIT WIP: 2-3 commitments max, everything else is backlog (a queue, not a todo list) — saying no with data ('this delays X by a day, is that ok?'); 5) ALIGN to goals: rank by impact on team/company objectives, not loudness; 6) RE-EVALUATE daily: the list changes; 7) the escalator: when truly everything is urgent, escalate the conflict (someone else decides priorities — that's management's job). Answer with the mechanism, not vibes: impact-matrix + time-boxing + WIP limits + data-driven no.

**Rubric:** 1 = urgency matrix. 2 = time-boxing + WIP limits. 3 = goal-aligned ranking + escalate-conflicts + the 2x2 with real examples.

**Why asked:** Asked in B09 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q5: Why do you want a remote role, and how do you prove you'll be productive without supervision?</summary>

**Model answer:** Honest reasons first (they screen for authenticity): focus, no commute, family/flexibility, an async work style, or a specific remote-first company. Then PROVE it, because 'I'm self-motivated' means nothing: 1) past shipped work — projects, PRs, deployments with measurable outcomes (portfolio + STAR stories) that show you finish things without supervision; 2) async communication evidence — sample docs/ADRs/READMEs you've written, a GitHub profile that reads clearly (a reviewer reads your repos like a resume); 3) visible-work discipline — structured updates, issue/MR hygiene, clear written status ('here's what I did, what's next, what's blocking') — this is what a remote manager actually sees; 4) time management — a concrete framework (time-boxing, WIP limits, deep-work blocks) with a real example; 5) remote-tool fluency — git/MR flow, docs, async code review, recorded demos. Tie it to the company: 'remote works because I make my work visible in writing and I own outcomes end-to-end.'

**Rubric:** 1 = honest reason. 2 = shipped-work evidence + portfolio. 3 = async-comms proof + time-management framework + tool fluency + outcome-ownership.

**Why asked:** Remote-product interviews screen hard for self-management — 'prove it' with shipped work + visible async output beats any claim.
</details>


<details>
<summary>❓ Q6: How do you prepare differently for a remote-first product company vs an Indian services firm — what does each screen for?</summary>

**Model answer:** Each screens for different proof — tailor the evidence. REMOTE-FIRST PRODUCT (GitLab, Razorpay, Postman, Datadog): 1) async communication + docs (they read your writing); 2) modern stack depth — k8s, ArgoCD/Flux, Terraform, OTel, Go/Python, system design (their platform teams build IDPs); 3) ownership + product thinking — you own services end-to-end with SLOs and on-call; 4) self-management and visible work; 5) system-design rounds. INDIAN SERVICES/ENTERPRISE (TCS/Infosys/Accenture and clients): 1) enterprise tooling — Jenkins, Ansible, Nagios/Zabbix legacy monitoring, ticketing + change management (process discipline); 2) process discipline — change windows, approvals, client documentation; 3) breadth over depth — many tools, hands-on ops; 4) certifications carry weight (AWS, CKA); 5) client communication. So: for product, bring a portfolio + system design + async-writing samples; for services, bring process examples + enterprise-tool hands-on + certs. Senior answer: know WHICH market you're targeting and tailor the proof — same skills, different evidence.

**Rubric:** 1 = names one difference. 2 = both screens (tooling + culture). 3 = tailored-evidence strategy + the same-skills-different-proof framing.

**Why asked:** Market-aware preparation is the differentiator — your own curriculum's market data (India enterprise vs remote product) is exactly what this tests.
</details>


### Portfolio upgrade

<details>
<summary>❓ Q1: Walk me through your GitHub — how is it organized and which 3 repos prove your level?</summary>

**Model answer:** Organization: profile (photo, bio, pinned repos, clear README), repos organized by theme (platform/automation/infra vs learning), consistent repo quality (README + CI + docs on each), no junk (archived or deleted experiments — a curated profile beats a dump). The 3 repos (pick ones that PROVE the level you claim): 1) an OPERATIONS repo — e.g. 'homelab-gitops' (ArgoCD + Terraform + k8s manifests: shows GitOps, IaC, declarative infra); 2) an AUTOMATION repo — e.g. 'ops-automation' (scripts + a pipeline: shows bash/Python, CI, idempotency); 3) an OBSERVABILITY/PLATFORM repo — a monitoring stack (Prometheus + Grafana dashboards as code + alerts) or a small platform tool (an operator, a controller, a self-service tool). Each repo demonstrates: real tech, real depth (not hello-world), docs + CI + runbook (the trust signals). Tell the story per repo: what problem, what you built, what's hard, link the demo.

**Rubric:** 1 = profile basics. 2 = themed + pinned + quality. 3 = the 3 proof-point repos with story + depth + docs.

**Why asked:** Asked in B09 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q2: What's in a repo that makes a reviewer trust it (README, diagrams, CI badge, runbook, ADR)?</summary>

**Model answer:** Trust signals, in order: 1) README that answers: what/why/quickstart (install + run in 3 commands)/how to test/architecture overview — the reviewer can understand + run it in minutes; 2) ARCHITECTURE DIAGRAM (a real diagram, not ASCII art: components, flows, deploy topology); 3) CI GREEN + badge (build + tests + lint running — proves it works); 4) TESTS that cover the important behavior; 5) RUNBOOK/ops section (how to operate, troubleshoot, roll back — proves production thinking); 6) ADRs (decisions with context — proves thought); 7) IaC/manifests (if relevant — infra as code); 8) good structure (naming, docs per directory, LICENSE); 9) freshness (recent commits — active, maintained); 10) honest scope (what it does NOT do). The reviewer's 5-minute test: can I run it, can I understand it, does it look production-minded? A repo with README + diagram + CI + runbook reads 'senior'; a repo with only code reads 'junior'.

**Rubric:** 1 = README + CI. 2 = diagram + tests + runbook. 3 = the 5-minute-trust-test + ADR + freshness + honest-scope combination.

**Why asked:** Asked in B09 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q3: Record a 3-minute demo — what do you show and what do you leave out?</summary>

**Model answer:** In 3 minutes you show ONE story: the highest-value capability, end-to-end. Show: 1) the PROBLEM + before state (10s: 'deploys took 40 minutes and broke twice a month'); 2) THE FLOW live: the one command / the pipeline / the dashboard — 'watch: one commit → build → test → canary → green deploy' (60-90s, the meat); 3) THE PROOF: metrics/outcome (deploy 40 → 8 min; error rate down; rollback 20 → 2 min); 4) the rollback/self-healing moment if you have 30s (it's the 'I thought about failure' flex). Leave out: 1) setup/installation details (no 'pip install' on screen); 2) boilerplate explanation of what k8s is (your audience knows); 3) every feature — 3 features poorly = 1 feature well; 4) code reading; 5) apologizing/long intros. Production tips: script + rehearse (timed), record in a clean env (no real secrets visible), use zoom/close-ups on the terminal, captions, 1080p, and a thumbnail + title with the outcome. The rule: 3 minutes = problem → live proof → numbers.

**Rubric:** 1 = demo the feature. 2 = problem → live flow → result. 3 = the rollback-flex + no-setup-no-boilerplate + rehearsed-production-quality discipline.

**Why asked:** Asked in B09 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q4: How do you tailor your portfolio to the roles you're applying for?</summary>

**Model answer:** 1) READ the job description for SKILL SIGNALS: an SRE role wants (GitOps, observability, incident stories, automation); a DevOps role wants (CI/CD, IaC, cloud, config mgmt); a platform role wants (IDPs, internal tools, k8s operators, developer experience); 2) RESURFACE the matching work: pinned repos + README first-para + the demo should lead with the role's keywords (their language, not yours); 3) MAP each claim to a proof: 'GitOps' → the argocd repo with drift-detection + rollback demo; 'observability' → the SLO dashboards repo; 'automation' → the pipeline repo with before/after numbers; 4) WRITE role-flavored summaries: the 3-line repo descriptions say what a hiring manager in THAT role cares about; 5) the RESUME mirrors it: same keywords, same order of strength; 6) adjust the demo + war stories to the role (SRE → incident story; DevOps → pipeline story); 7) keep the breadth (don't delete anything) — curate the TOP for the role. Rule: one profile, role-focused top layer — the reviewer should see 'this person is exactly what we need' within 2 minutes.

**Rubric:** 1 = match keywords. 2 = re-pin + rewrite for role. 3 = claim→proof mapping + demo/story alignment + resume mirroring.

**Why asked:** Asked in B09 — verify against the module's checklist items and research block.
</details>


### Module research

<details>
<summary>❓ Q1: System design for ops: design a CI/CD system, a monitoring/alerting system, an autoscaling setup, a multi-region deployment — scale, failure modes, cost</summary>

**Model answer:** CI/CD (team of 20): pipeline-as-code, build-once artifact, GitOps CD (ArgoCD), canary + auto-rollback, caching/parallelism, secrets via store, cost ~$500-2k/mo. Monitoring: RED metrics + SLOs + burn-rate alerting, Loki/Tempo, bounded cardinality, runbook-per-alert, dashboards-as-code. Autoscaling (stateless API): HPA on CPU/RPS, fast-out slow-in cooldown, burst via headroom + degradation, CA/Karpenter with spot. Multi-region: active-passive first, cross-region DB replication by RPO, Route 53 failover, quarterly failover drills. Common thread: every design states scale, lists failure modes + mitigation, and gives a cost estimate.

**Rubric:** 1 = one design. 2 = two designs with failure modes. 3 = all four with scale/cost/failure + the cross-cutting senior patterns.

**Why asked:** Asked in B09 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q2: Behavioral: why DevOps/SRE vs SDE, on-call experience, incident stories (STAR), collaboration, blameless culture</summary>

**Model answer:** Why DevOps/SRE: end-to-end ownership, direct feedback loop, leverage (platform work multiplies teams), problem diversity. On-call: runbooks, escalation, 3am discipline (restore-first), post-incident improvement, load management. Incident stories: STAR with numbers + systemic change + ownership. Collaboration: data-driven disagreement, kind-but-firm reviews, cross-team ownership. Blameless culture: systems-not-people, psychological safety, 'what allowed this'. Practice STAR with real incidents and measurable before/after.

**Rubric:** 1 = one story. 2 = STAR + numbers. 3 = systemic-change arc + ownership + blameless framing.

**Why asked:** Asked in B09 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q3: Coding: shell + python live tasks (file processing, log parsing, API automation), basic DSA awareness (arrays, strings, hashmaps — SRE coding questions like pacific-atlantic, good nodes)</summary>

**Model answer:** Shell live tasks: log parsing (awk/grep/sed), file processing (find/xargs, loops), safe scripts (set -euo pipefail, quoting). Python: JSON/YAML config, requests/API automation with retries + error handling, argparse CLIs, fail-loud. DSA basics: arrays/strings/hashmaps (the SRE bar is lower than SWE — but know: two-pointer, hashmap lookups, string manipulation, BFS/DFS for grid problems — pacific-atlantic, good-nodes are the classic examples). Practice: implement in shell + Python with edge cases + tests; speed + correctness + clean output. Strategy: solve in Python first (faster to write), explain the approach out loud, test edge cases.

**Rubric:** 1 = basic scripts. 2 = log parsing + API automation. 3 = DSA patterns + explanation-out-loud + edge-case testing discipline.

**Why asked:** Asked in B09 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q4: Portfolio walkthrough: deploy architecture diagram, GitHub profile, live demo, metrics showing impact</summary>

**Model answer:** Walkthrough order: 1) the ARCHITECTURE diagram (one slide: components + flows + how it deploys — you draw it, you own it); 2) the GitHub profile (organized, pinned proof-repos, consistent quality); 3) the LIVE DEMO (the one command / pipeline / dashboard — rehearsed, 3 minutes); 4) METRICS (the impact numbers: before/after, adoption, MTTR — every repo/demo has a number attached). The flow tells ONE story: I build real things, they work, I can prove it. Practice: walk it 3x with a timer; expect deep-dive questions on any diagram box (they'll drill the DB, the failure modes, the rollback).

**Rubric:** 1 = diagram + profile. 2 = live demo + numbers. 3 = one-coherent-story + drill-readiness on every box.

**Why asked:** Asked in B09 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q5: Mock interviews: 30-min Linux + 30-min cloud/containers + 30-min behavioral per cycle</summary>

**Model answer:** Structure per cycle: 30 min Linux (terminal, processes, files, networking, systemd — A01/B07 fundamentals + live commands), 30 min cloud/containers (AWS services + k8s/docker — B01/B03 depth: VPC/IAM/networking, deployments, debugging), 30 min behavioral (STAR stories: incident, ownership, conflict, mistake). Method: record yourself, grade against rubrics (1/2/3 per answer), re-do weak ones in 2 days (spaced repetition), track pass-rate per topic. Do one full cycle weekly; rotate topics so weak areas get targeted cycles. The goal: the real interview is a mock — timing, articulation, and stress management are practiced skills.

**Rubric:** 1 = knows the format. 2 = rubric grading + re-study loop. 3 = weekly cycles + recording + weak-topic targeting + timing discipline.

**Why asked:** Asked in B09 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q6: Salary anchoring: SRE 6-15 LPA fresher / 13-26 LPA experienced (India, InterviewBit); DevOps comparable band in Pune</summary>

**Model answer:** Know the market (India data points): SRE fresher 6-15 LPA, experienced 13-26 LPA (InterviewBit); DevOps in Pune comparable (~10-20 LPA mid). Anchoring tactics: 1) never state a number first — redirect: 'I'd like to understand the band for this role first'; 2) if pushed, give a RANGE with your bottom = your true floor (anchoring works both ways — a range signals flexibility, a number anchors); 3) base the ask on DATA: market data (levels.fyi, Glassdoor, InterviewBit) + your proof points (the portfolio/experience maps to the senior end); 4) discuss TOTAL compensation (base + variable + stock + benefits), not just base; 5) negotiate the whole package (WFH, leave, learning budget) if base is capped; 6) practice the conversation (mock it); 7) timing: negotiate after the offer, never during. The answer shows: market awareness + data-backed confidence + negotiation mechanics.

**Rubric:** 1 = knows a band. 2 = never-first + range strategy. 3 = data-backed anchor + total-comp framing + post-offer timing + practiced delivery.

**Why asked:** Asked in B09 — verify against the module's checklist items and research block.
</details>


<details>
<summary>❓ Q7: The 2am litmus test: could you deploy AND roll back your service alone at 2am? one-command deploy, automated rollback, decision tree (roll forward vs roll back vs freeze) — the seniority question</summary>

**Model answer:** The test: can a solo, stressed, half-awake engineer deploy + roll back safely? It's the seniority question because it forces: 1) ONE-COMMAND deploy (pipeline: commit → build → canary → promote — no 12-step runbook); 2) AUTOMATED rollback (canary analysis auto-aborts; old artifact always retrievable — immutable tags; rollback = one command, tested); 3) DECISION TREE ready (deploy-caused? known-fix → roll forward; else roll back; unknown → freeze + investigate); 4) VERIFICATION defined (what 'fixed' looks like: metrics + smoke); 5) RUNBOOK with exact commands; 6) the SYSTEM designed so the 2am person can't make it worse (guarded prod, approvals for destructive, safety rails). Senior answer: the 2am test is passed by DESIGN, not by heroics — if you need a senior's judgment at 2am, the system isn't done. Everything that makes 2am safe (immutability, automation, runbooks, guardrails) is exactly what a mid→senior engineer builds.

**Rubric:** 1 = rollback exists. 2 = one-command + automated rollback. 3 = decision-tree + design-for-2am + 'passed by design not heroics' principle.

**Why asked:** Asked in B09 — verify against the module's checklist items and research block.
</details>


---

## ✅ Coverage

Answered: 317 / 317 Phase B questions.