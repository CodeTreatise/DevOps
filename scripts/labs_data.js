/* Hands-on lab checklists per module — "Do → verify → done".
   Each item: concrete command/action + a verify line proving it worked.
   Progress saved in localStorage (key platform-path-labs-v1), same pattern as the main progress. */
window.LABS_DATA = {
  "source": "Hands-on checklist derived from the 8-phase path (A01-A06, B01-B08). Do these on a local VM (VirtualBox/WSL) or free-tier cloud account. Verify each item before checking it off.",
  "howToUse": [
    "Do the action for real (type the commands, break things on purpose).",
    "Confirm the 'verify' line produces the expected output.",
    "Tick the checkbox — progress saves in your browser (localStorage).",
    "If you can't verify, redo the lab — 'seen it in a video' doesn't count."
  ],
  "modules": [
    {
      "id": "A01",
      "title": "Linux & shell — day-1 sysadmin",
      "items": [
        { "do": "Create a user `devops` with no sudo; log in and create ~/labs/scripts", "verify": "whoami → devops; ls -ld ~/labs/scripts → drwxr-xr-x" },
        { "do": "chmod 750 a script; run it as another user (permission denied)", "verify": "./script.sh → Permission denied; chmod +x → works" },
        { "do": "journalctl -u sshd --since today; find a real failure line", "verify": "you see sshd entries and can explain the failing line" },
        { "do": "ps aux | grep nginx, top (sort by CPU), free -h, df -h, ss -tlnp", "verify": "you can name the 5 heaviest processes and listening ports" },
        { "do": "cron: schedule a script every minute that appends timestamp to /tmp/ts.log", "verify": "tail /tmp/ts.log shows a new line each minute" },
        { "do": "Debug: break a service (typo in config), read journalctl, fix, restart", "verify": "service recovers and you can explain root cause in 1 line" }
      ]
    },
    {
      "id": "A02",
      "title": "Git — rebase, reflog, recover",
      "items": [
        { "do": "Simulate a bad merge; recover with git reflog", "verify": "git reflog shows the pre-merge commit; you restore it" },
        { "do": "Interactive rebase: squash 3 commits into 1", "verify": "git log --oneline shows 1 commit with combined message" },
        { "do": "git cherry-pick a commit from another branch", "verify": "commit appears on target branch with same change" },
        { "do": "git bisect to find a breaking commit in a 10-commit history", "verify": "bisect lands on the exact breaking commit" },
        { "do": "PR workflow: branch → push → PR → review comment → fix → merge (GitHub)", "verify": "merged PR with >1 commit and review thread" }
      ]
    },
    {
      "id": "A03",
      "title": "Networking — diagnose like an SRE",
      "items": [
        { "do": "curl -v https://example.com; explain each TLS step (DNS→TCP→TLS→HTTP)", "verify": "you can narrate every line of -v output" },
        { "do": "dig +nocomments example.com; dig +short TXT google.com", "verify": "you can name the record types and TTL meaning" },
        { "do": "tcpdump -i any port 80 (in a sandbox w/ loopback http server)", "verify": "you see SYN/ACK and the HTTP GET in packets" },
        { "do": "openssl s_client -connect example.com:443 -servername example.com | openssl x509 -noout -dates", "verify": "you see cert issuer + validity dates" },
        { "do": "nc -zv google.com 443 / 80; nc -zv google.com 22 (fail)", "verify": "you can tell open vs filtered ports" },
        { "do": "iptables: block one port on loopback, prove connection refused, then unblock", "verify": "nc fails → iptables -L shows rule → unblock → works" }
      ]
    },
    {
      "id": "A04",
      "title": "Docker — build secure images",
      "items": [
        { "do": "Multi-stage Dockerfile: build in golang:alpine, run in scratch/distroless", "verify": "docker images shows final image < 20 MB, app runs" },
        { "do": "Run container as non-root (USER 10001); prove ps shows nobody", "verify": "docker exec id → uid=10001" },
        { "do": "Write .dockerignore; build with build cache; rebuild shows CACHED layers", "verify": "2nd build: most layers say CACHED" },
        { "do": "docker compose: app + redis + healthcheck; docker compose up -d; logs -f", "verify": "3 containers healthy; logs stream; stop removes cleanly" },
        { "do": "docker inspect + exec + cp + logs --tail; debug a container that exits immediately", "verify": "you find the exit reason (logs/entrypoint) and fix it" },
        { "do": "Scan image with trivy (or docker scout); fix at least 1 HIGH vuln", "verify": "trivy image report shows reduced HIGH count" }
      ]
    },
    {
      "id": "A05",
      "title": "CI/CD — green pipeline with gates",
      "items": [
        { "do": "GitHub Actions: on PR → lint + unit tests + build image; on main → push image + deploy to staging", "verify": "PR shows 3 green jobs; main shows 4; artifacts visible" },
        { "do": "Add a quality gate: fail build if test coverage < 70% (or if vuln scan finds HIGH)", "verify": "a PR with low coverage shows ❌ job" },
        { "do": "Secrets: store DB creds in Actions secrets; app reads from env, never hardcoded", "verify": "grep the repo for the secret → not found; deploy uses secret" },
        { "do": "Cache: dependency cache makes install < 30s on 2nd run", "verify": "workflow run shows cache hit" },
        { "do": "Manual approval job before prod deploy (environment protection rule)", "verify": "run waits for approval; approve → deploys" },
        { "do": "Deliberately break a test → pipeline fails → fix → green", "verify": "you saw a real red run and a real green rerun" }
      ]
    },
    {
      "id": "A06",
      "title": "Capstone — full stack app with rollback",
      "items": [
        { "do": "Deploy a 2-service app (web + api) + DB with docker compose on a VM", "verify": "app reachable from browser; data persists across restart" },
        { "do": "CI: build+test+scan on push; CD: deploy to staging automatically", "verify": "push → auto-deploy visible in < 5 min" },
        { "do": "Monitoring: add Prometheus + Grafana; app exposes /metrics", "verify": "Grafana dashboard shows req/s + error rate" },
        { "do": "Deploy v2 with a deliberate bug → verify error rate spike → rollback", "verify": "Grafana shows the spike; rollback restores green" },
        { "do": "Write a 1-page README: arch diagram + how to run + rollback steps", "verify": "a stranger can run it in < 10 min" },
        { "do": "Put it on GitHub + add a status badge (workflow badge)", "verify": "badge shows passing" }
      ]
    },
    {
      "id": "B01",
      "title": "Kubernetes — admin the hard way (kind)",
      "items": [
        { "do": "kind create cluster; kubectl get nodes shows 1 node Ready", "verify": "kubectl cluster-info works" },
        { "do": "Deploy nginx w/ 3 replicas + Service + Ingress (ingress-nginx)", "verify": "curl host header returns nginx from 3 pods" },
        { "do": "Debug: create a CrashLoopBackOff pod; fix via logs + describe", "verify": "pod Running; you can explain root cause" },
        { "do": "PVC + PV: mysql with persistent volume; delete pod → data survives", "verify": "data persists after pod recreation" },
        { "do": "NetworkPolicy: deny all → allow only api pods to db", "verify": "db unreachable from web pod until policy allows" },
        { "do": "HPA: cpu-based autoscale on a load-test workload (kubectl load)", "verify": "kubectl get hpa shows replicas scaling 1→5" },
        { "do": "Rollout: set image to broken v2 → kubectl rollout status fails → rollout undo", "verify": "rollback restores v1; deploy history visible" },
        { "do": "RBAC: create a dev ServiceAccount limited to one namespace; prove it can't read other ns", "verify": "kubectl --as=system:serviceaccount:... get pods -n kube-system → Forbidden" }
      ]
    },
    {
      "id": "B02",
      "title": "Terraform — state, modules, backends",
      "items": [
        { "do": "tf init/plan/apply/plan/destroy loop for an EC2 (or local docker container)", "verify": "2nd plan is empty (no diff); destroy removes resource" },
        { "do": "Remote state: move state to S3 (or local file backend first)", "verify": "state file in backend; team-safe locking" },
        { "do": "Modules: refactor into module vpc + module app; parameterize with variables", "verify": "plan shows module sources" },
        { "do": "Workspaces: dev vs prod workspace with different instance size", "verify": "terraform workspace select prod → plan shows prod size" },
        { "do": "Break a resource in code → plan shows destroy+recreate; use lifecycle prevent_destroy on DB", "verify": "prevent_destroy blocks deletion with error" },
        { "do": "terraform import an existing resource; adopt it into state", "verify": "plan becomes clean after import" }
      ]
    },
    {
      "id": "B03",
      "title": "Cloud (AWS) — build real infra",
      "items": [
        { "do": "VPC: public+private subnets, IGW, NAT (free-tier friendly)", "verify": "private instance reaches internet via NAT; no public IP" },
        { "do": "SG: restrict ssh to your IP only; prove another IP is refused", "verify": "nc/ssh from wrong IP times out" },
        { "do": "IAM: role for EC2 (not keys); policy granting only s3:GetObject on one bucket", "verify": "instance can read bucket; other ops → AccessDenied" },
        { "do": "S3: static website + versioning + lifecycle (transition to IA after 30d)", "verify": "site loads; lifecycle policy visible" },
        { "do": "EC2 user-data: install nginx on boot; verify after launch", "verify": "nginx running without manual ssh setup" },
        { "do": "Cost: Budget alert at $5 + Cost Explorer view", "verify": "budget alarm created; you can see spend by service" },
        { "do": "RDS (or free-tier alternative): create DB, connect app, snapshot", "verify": "app reads/writes; snapshot exists" }
      ]
    },
    {
      "id": "B04",
      "title": "Observability — SLOs you can act on",
      "items": [
        { "do": "Prometheus: scrape node_exporter + app /metrics; write 3 alert rules (high CPU, 5xx spike, disk)", "verify": "rules fire in Alertmanager; alert reaches Slack/Discord" },
        { "do": "Grafana: dashboard with RED per service + USE per host", "verify": "you can answer 'is service X healthy?' from the dashboard" },
        { "do": "Define an SLO: 99.5% availability, 30d window; compute error budget burn", "verify": "you can state remaining budget in % and days" },
        { "do": "Tracing: instrument one service w/ OpenTelemetry; see spans in Jaeger/Tempo", "verify": "trace waterfall shows latency per span" },
        { "do": "Logs: Loki (or ELK) ingest + query; filter by trace_id", "verify": "correlate one trace to its logs in < 1 min" }
      ]
    },
    {
      "id": "B05",
      "title": "GitOps — ArgoCD end-to-end",
      "items": [
        { "do": "Install ArgoCD (or Flux) on kind cluster; login via CLI", "verify": "argocd app list works" },
        { "do": "App-of-apps: config repo with 2 apps (web + api) synced from Git", "verify": "apps appear + healthy; UI shows sync state" },
        { "do": "Drift: kubectl scale outside Git → ArgoCD auto-reconciles back", "verify": "replica count returns to Git value within sync interval" },
        { "do": "Canary: Argo Rollouts + Nginx/istio; traffic 5%→50%→100% with analysis", "verify": "rollout steps visible; metrics gate aborts on error spike" },
        { "do": "Rollback: commit bad image → auto-detect → rollout rollback", "verify": "app returns to previous revision automatically" },
        { "do": "Secrets in GitOps: external-secrets + Vault (or SOPS), no plaintext in repo", "verify": "grep repo for real secret value → not found" }
      ]
    },
    {
      "id": "B06",
      "title": "Reliability & chaos — break it on purpose",
      "items": [
        { "do": "Litmus/ChaosMesh: pod-kill experiment on one service; observe recovery", "verify": "service recovers; Grafana shows the blip" },
        { "do": "Network chaos: latency +200ms for 60s; confirm SLO still holds", "verify": "you can name the impact on p95" },
        { "do": "Run an incident drill with a friend/AI: 30-min simulated outage, timeline doc", "verify": "timeline has 5+ entries: detect→triage→fix→verify" },
        { "do": "Write a blameless postmortem (5-whys) for the drill; 2 action items", "verify": "actions tracked somewhere (issue tracker)" },
        { "do": "DB failover drill: restart DB (or stop replica) → app survives", "verify": "no user-visible outage; app reconnects" }
      ]
    },
    {
      "id": "B07",
      "title": "Automation & scripting — idempotent by default",
      "items": [
        { "do": "Python script: parse server logs, report 5xx per endpoint; idempotent (rerun-safe)", "verify": "running twice gives same result, no side effects" },
        { "do": "Retry + backoff: script that retries a flaky API 3x with exponential backoff", "verify": "logs show backoff pattern; succeeds eventually" },
        { "do": "Bash: script with set -euo pipefail + trap for cleanup", "verify": "failure exits non-zero; temp files cleaned on exit" },
        { "do": "Ansible: playbook installing nginx + configuring vhost; run twice (idempotent)", "verify": "2nd run shows ok=0 changed" },
        { "do": "Schedule: cron/at/systemd timer running the log-summary script daily; output emailed/file", "verify": "output file has yesterday's summary" }
      ]
    },
    {
      "id": "B08",
      "title": "Security & on-call — think like an attacker",
      "items": [
        { "do": "Trivy scan CI images + scan running cluster (kube-bench)", "verify": "fix ≥1 HIGH; kube-bench report read" },
        { "do": "RBAC review: list all SA → find one with cluster-admin; restrict it", "verify": "least-privilege applied; audit shows change" },
        { "do": "NetworkPolicy default-deny in a namespace; prove pod isolation", "verify": "cross-ns traffic blocked until policy" },
        { "do": "Secret scan: add a fake key to repo → detect via gitleaks pre-commit hook", "verify": "commit blocked; gitleaks report shows it" },
        { "do": "Write runbooks for 5 top incidents (disk full, OOM, cert expiry, DB slow, deploy fail)", "verify": "each runbook has: symptoms → 3 diagnostic cmds → fix → verify" },
        { "do": "On-call sim: page yourself via alertmanager webhook; respond in < 5 min with triage", "verify": "triage note written; runbook referenced" }
      ]
    }
  ]
};
