# 🤖 AI Agents — Production-Grade Learning Path

> **Goal:** Go from "collecting agent repos" to "building and operating production-grade agents."
> **Estimated time:** ~8–10 weeks part-time · **Cost:** $0 (use Ollama for local inference; free tiers otherwise)
> **Companion note:** This path replaces demo-collection repos like `500-AI-Agents-Projects` with real engineering.

---

## 📌 Master Index

| # | Module | Type | Est. Time | Status |
| --- | --- | --- | --- | --- |
| 00 | Prerequisites & Readiness Check | ⚙️ Prep | 3–7 days | ☐ |
| 00.5 | Node/JS → Python Bridge *(only if you pick the Python track)* | ⚙️ Prep | 5–7 days | ☐ |
| 01 | Agent Fundamentals (ReAct, tools, loops) | 🧠 Theory | Week 1 | ☐ |
| 02 | Framework Deep-Dive (pick ONE) | 🔧 Code | Weeks 2–3 | ☐ |
| 03 | Build 1: Tool-Calling Support Agent | 🛠️ Project | Week 3 | ☐ |
| 04 | Build 2: RAG Agent over your docs | 🛠️ Project | Week 4 | ☐ |
| 05 | Build 3: Human-in-the-Loop Workflow | 🛠️ Project | Week 4 | ☐ |
| 06 | Pillar: Observability (Langfuse) | 📊 Infra | Week 5 | ☐ |
| 07 | Pillar: LLM Gateway (LiteLLM) | 🚪 Infra | Week 5 | ☐ |
| 08 | Pillar: Evaluation (evals + promptfoo) | 🎯 QA | Week 6 | ☐ |
| 08.5 | Pillar: AI Security & Guardrails | 🛡️ QA | Week 6 | ☐ |
| 09 | Pillar: Deployment (Docker + cloud) | ☁️ Ops | Week 6 | ☐ |
| 10 | Pillar: Durable Execution & Recovery | ♻️ Ops | Week 7 | ☐ |
| 11 | Depth: Multi-Agent Orchestration | 🔀 Advanced | Week 8 | ☐ |
| 12 | Depth: MCP (Model Context Protocol) | 🔌 Advanced | Week 8 | ☐ |
| 13 | Depth: Agentic RAG reference (RAGFlow) | 📚 Advanced | Week 9 | ☐ |
| 14 | Depth: Coding Agents (OpenHands) | 💻 Advanced | Week 9 | ☐ |
| 15 | Capstone: Production Portfolio Piece | 🏆 Final | Week 10 | ☐ |
| 16 | Cutting-Edge & Emerging Radar | 🚀 Emerging | Ongoing | ☐ |

---

## 00 · Prerequisites & Readiness Check

### Must-have (do not skip)

- [ ] **Python 3.10+** — functions, classes, decorators, type hints
  - 📚 [Official Python Tutorial](https://docs.python.org/3/tutorial/index.html) (written for programmers) · [learnpython.org](https://www.learnpython.org/) (interactive) · [typing docs](https://docs.python.org/3/library/typing.html) · [Python Cheatsheet](https://github.com/gto76/python-cheatsheet)
- [ ] **Async basics** — `async` / `await` (all modern agent code is async)
  - 📚 [Real Python: Async IO](https://realpython.com/async-io-python/) · [asyncio docs](https://docs.python.org/3/library/asyncio.html)
- [ ] **Virtual environments** — `venv` or `uv`, `pip install`
  - 📚 [uv docs](https://docs.astral.sh/uv/) (replaces pip/venv/poetry/pyenv) · [venv docs](https://docs.python.org/3/library/venv.html)
- [ ] **Git & GitHub** — clone, commit, push, branch, PR
  - 📚 [Pro Git book](https://git-scm.com/book/en/v2) (free) · [GitHub Hello World](https://docs.github.com/en/get-started/quickstart/hello-world) (PR workflow) · [MIT Missing Semester: Git](https://missing.csail.mit.edu/)
- [ ] **Terminal comfort** — navigate, run scripts, env vars (`export FOO=bar`)
  - 📚 [MIT Missing Semester](https://missing.csail.mit.edu/) (shell, env vars, packaging — the famous course)
- [ ] **HTTP/API basics** — what an API key is, REST, JSON, `requests`/`curl`
  - 📚 [MDN HTTP Overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview) · [json.org](https://www.json.org/json-en.html) · [FastAPI Tutorial](https://fastapi.tiangolo.com/tutorial/) (build a real API fast)
- [ ] **LLM literacy** — tokens, temperature, system vs user messages, context window
  - 📚 [Karpathy: Zero-to-Hero](https://karpathy.ai/zero-to-hero.html) (how LLMs work, from scratch) · [Lilian Weng: LLM Agents](https://lilianweng.github.io/posts/2023-06-23-agent/)

### Should-have (fill gaps in parallel)

- [ ] SQL basics (SELECT/JOIN) — for agent tools that query data
  - 📚 [SQLBolt](https://sqlbolt.com/) (interactive SQL in your browser)
- [ ] Docker basics — `docker run`, `docker compose up`
  - 📚 [Docker Get Started](https://docs.docker.com/get-started/) · [FastAPI in Docker](https://fastapi.tiangolo.com/deployment/docker/)
- [ ] YAML/JSON reading/writing — configs everywhere
  - 📚 [json.org](https://www.json.org/json-en.html) · [yaml.org](https://yaml.org/) (official spec)

### Nice-to-have (not blocking)

- [ ] asyncio deeper patterns (tasks, timeouts)
  - 📚 [Real Python: Async IO](https://realpython.com/async-io-python/) (coroutines, gather, queues, timeouts) · [asyncio docs](https://docs.python.org/3/library/asyncio.html)
- [ ] One cloud free tier account (AWS/GCP/Azure/Railway/Render)
  - 📚 [Railway docs](https://docs.railway.com/) · [Render docs](https://docs.render.com/)
- [ ] Basic vector-database exposure (Chroma/Qdrant)
  - 📚 [Pinecone Learning Center](https://www.pinecone.io/learn/) ("What is a vector database?", "What is RAG?")

### Readiness self-test (answer before starting)

1. Can you write a Python function with a type hint and a docstring?
2. Can you `await` an API call and handle `try/except`?
3. Do you know the difference between a system prompt and a user message?
4. Can you clone a repo and run its `requirements.txt`?
5. Can you explain what "a tool call" from an LLM is?

> ⚠️ If you answer "no" to 1–3, spend 3–7 days on: Python crash course + [Microsoft ai-agents-for-beginners](https://github.com/microsoft/ai-agents-for-beginners) Lesson 1.
> 💡 Know JS/Node already? Skip the generic Python course — go to **Module 00.5** below. You're ~60% there.

---

## 00.5 · Node/JS → Python Bridge 🐍 (5–7 days, if you know JS/Node)

**You already know programming, HTTP, JSON, async, and Git — the ideas transfer.** Only the *syntax and tooling* change. Learn the deltas, not a full Python course.

### Concept map: Node → Python

| Node.js | Python | Notes |
| --- | --- | --- |
| `npm install` | `pip install` | use `uv` for speed (`uv add`) |
| `package.json` | `requirements.txt` / `pyproject.toml` | |
| `node_modules` | `.venv` (virtual env) | `python -m venv .venv` |
| `process.env.X` | `os.environ["X"]` / `os.getenv("X")` | |
| `dotenv` | `python-dotenv` | same `.env` file format |
| `fetch()` | `httpx` or `requests` | `httpx` supports async |
| `async/await` (Promises) | `async/await` (asyncio) | very similar mental model |
| TypeScript types | type hints (optional) | Pydantic AI loves these |
| `console.log` | `print` | |
| object `{a: 1}` | dict `{"a": 1}` | |
| `JSON.parse/stringify` | `json.loads / json.dumps` | |
| `undefined` | `None` | |

### The env-var thing you flagged (Node vs Python)

**Node:**

```js
require("dotenv").config();
const key = process.env.OPENAI_API_KEY;
```

**Python:**

```python
from dotenv import load_dotenv
import os

load_dotenv()                       # reads .env — same file format as Node
key = os.environ["OPENAI_API_KEY"]  # KeyError if missing
# or safer:
key = os.getenv("OPENAI_API_KEY")   # returns None if missing
```

Same idea, different spelling. (Frameworks like Pydantic AI even read env vars automatically via `pydantic-settings`.)

### Bridge plan (5–7 days)

- [ ] **Day 1–2:** Python syntax for JS devs — functions, classes, dicts, lists, `for` loops
  - 📚 [Official Python Tutorial](https://docs.python.org/3/tutorial/index.html) (aimed at programmers) · [Python Cheatsheet](https://github.com/gto76/python-cheatsheet)
- [ ] **Day 3:** env vars — `os.environ`, `python-dotenv`, `.env` files (the thing you asked about)
  - 📚 [Python os docs](https://docs.python.org/3/library/os.html)
- [ ] **Day 4:** venv + pip — create `.venv`, install a package, run a script
  - 📚 [uv docs](https://docs.astral.sh/uv/) (skip pip/venv entirely) · [venv docs](https://docs.python.org/3/library/venv.html)
- [ ] **Day 5:** async — `async def`, `await`, `httpx.AsyncClient` (compare to Node)
  - 📚 [Real Python: Async IO](https://realpython.com/async-io-python/) · [httpx docs](https://www.python-httpx.org/)
- [ ] **Day 6–7:** ⭐ **Mini-milestone** — a Python script that: reads an LLM API key from `.env` → calls an LLM API with async HTTP → prints the JSON. That one script proves env + HTTP + async + JSON = you're ready.

> ✅ After this bridge, Module 01 will feel familiar — the concepts are the same, just in Python.

### 🧭 Decision point: which language track? (pick ONE)

| Track | Frameworks (all verified, all free) | Bridge module | Best if |
| --- | --- | --- | --- |
| **A · TypeScript** 🟦 | [Mastra](https://github.com/mastra-ai/mastra) (27k ⭐, Apache-2.0) · [Vercel AI SDK](https://github.com/vercel/ai) (26k ⭐, 100K dependents) · [LangGraph JS](https://github.com/langchain-ai/langgraphjs) (MIT, used by Replit/Uber/LinkedIn/GitLab) · [OpenAI Agents JS](https://github.com/openai/openai-agents-js) (3.6k ⭐, MIT, sandbox + realtime agents) | **Skip Module 00.5** — you already know this stack | You want to ship fastest with existing skills |
| **B · Python** 🟩 | [Pydantic AI](https://ai.pydantic.dev/) · [LangGraph](https://academy.langchain.com/courses/intro-to-langgraph) · [CrewAI](https://learn.crewai.com) · [OpenAI Agents SDK](https://github.com/openai/openai-agents-python) (28.6k ⭐, MIT) | Do Module 00.5 first | You want the biggest ecosystem and all RAG/ML tooling |

> 💡 **My recommendation for you (Node dev): Track A — Mastra.** It's TypeScript-native and already bundles the pillars this index teaches separately (evals, observability, human-in-the-loop, MCP). In Modules 03–15, just swap the framework name (e.g., Mastra workflows instead of LangGraph graphs).

---

## 01 · Agent Fundamentals 🧠 (Week 1)

**Objective:** Understand what an agent actually is — before writing framework code.

- [ ] The ReAct pattern: Reasoning → Acting → Observing (read the [paper](https://arxiv.org/abs/2302.02910), 20 min)
  - 📚 [ReAct paper (arXiv:2210.03629)](https://arxiv.org/abs/2210.03629) · [Lilian Weng: LLM Agents](https://lilianweng.github.io/posts/2023-06-23-agent/) (canonical deep-dive: ReAct, Reflexion, memory, tool use)
- [ ] Model + tools + loop: how an LLM gets structured tool calls back
  - 📚 [Anthropic: Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) (industry reference) · [Lilian Weng: LLM Agents](https://lilianweng.github.io/posts/2023-06-23-agent/) (community reference)
- [ ] The two failure modes: model returns garbage / tool call fails → retry loop
  - 📚 [promptfoo: preventing hallucinations](https://www.promptfoo.dev/docs/guides/prevent-llm-hallucinations/) (garbage-output fixes) · [Anthropic: Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) (retry patterns)
- [ ] Context window: why agents run out of room and what to do (memory, summarization)
  - 📚 [Anthropic: Effective context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) (compaction, note-taking, sub-agents)
- [ ] Structured course: [Microsoft ai-agents-for-beginners](https://github.com/microsoft/ai-agents-for-beginners) (72k ⭐, MIT, **18 lessons**, [STUDY_GUIDE.md](https://github.com/microsoft/ai-agents-for-beginners/blob/main/STUDY_GUIDE.md))
  - ⚠️ Code samples now use **Microsoft Agent Framework + Microsoft Foundry** — an Azure account is required (free tier exists; some samples support OpenAI-compatible providers like MiniMax)
- [ ] Alternative without Azure: LangChain Academy [Intro to LangGraph](https://academy.langchain.com/courses/intro-to-langgraph) (free) or [anthropics/courses](https://github.com/anthropics/courses) (22.6k ⭐; tool use + prompt evals; needs an Anthropic key)
- [ ] **When NOT to use an agent** — deterministic code beats an LLM 90% of the time. Use agents for unstructured input, judgment, multi-step tool use; not for stable logic, math, or parsing. "Use the simplest solution that works"
  - 📚 [Anthropic: Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) ("simplest solution that works" — agents only where you need flexibility)

### Model literacy (know the model you operate)

- [ ] Tokens & long-context mechanics — models "lose" information in the middle of long contexts: put critical instructions/evidence at the start or end, and don't treat context length as usable context
  - 📚 [Lost in the Middle (arXiv:2307.03172)](https://arxiv.org/abs/2307.03172) (the paper that proved mid-context forgetting) · [Anthropic: Effective context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [ ] Tool calls are model output — the `tool_use` → `tool_result` loop is generated by the LLM, so calls can be malformed or hallucinated: validate arguments (Pydantic/zod) and treat the loop as untrusted input
  - 📚 [Anthropic: Tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview) (the full round trip + strict schema mode)
- [ ] RAG vs fine-tuning vs prompting — the decision framework: prompting first, RAG when you need new/private knowledge, fine-tuning only when style/format can't be prompted (the most overused tool in the stack)
  - 📚 [Pinecone Learning Center](https://www.pinecone.io/learn/) (RAG 101 + when fine-tuning makes sense) · [LiteLLM docs](https://docs.litellm.ai/) (model zoo: reasoning vs non-reasoning, cost/latency)

**Deliverable:** One-page diagram of the agent loop you can explain to someone.

---

## 02 · Framework Deep-Dive 🔧 (Weeks 2–3)

**Objective:** Pick ONE framework and know it deeply. Do not learn five.

**Track A — TypeScript (your home turf):**

| Framework | Stars | License | Notes |
| --- | --- | --- | --- |
| **Mastra** | 27.2k | Apache-2.0 (+ `ee/` enterprise) | TS-native; evals, observability, HITL, MCP built in; `npm create mastra@latest`; free [course](https://mastra.ai/course) |
| **Vercel AI SDK** | 26.2k | OSS | 100K dependents; ideal for Next.js/React UIs; `npm install ai` |
| **LangGraph JS** | 3.2k | MIT | Same graph + durable-execution concepts as Python LangGraph; `npm install @langchain/langgraph` |
| **OpenAI Agents JS** | — | MIT | Official OpenAI SDK; handoffs + guardrails built in |

**Track B — Python (biggest ecosystem):**

| Framework | Best for | Docs (free) | Notes |
| --- | --- | --- | --- |
| **LangGraph** | Most production adoption (Klarna, Replit, Elastic) | [LangChain Academy](https://academy.langchain.com/) | State + nodes + durable execution — real concepts; free cert (Certified Agent Engineer) |
| **Pydantic AI** | Python devs, type-safe, fastest to real code | [ai.pydantic.dev](https://ai.pydantic.dev/) | From the Pydantic team; structured output built-in |
| **CrewAI** | Multi-agent teams, quick to ship | [learn.crewai.com](https://learn.crewai.com) | MIT, huge community, 100k+ certified devs |
| **OpenAI Agents SDK** | Lightweight + guardrails + tracing built in | [openai.github.io/openai-agents-python](https://openai.github.io/openai-agents-python/) | MIT, provider-agnostic |

**Recommended starter:** Track A → **Mastra**. Track B → **Pydantic AI**. Come back to LangGraph when you need durable execution.

- [ ] Install framework + run the official "hello world" agent
  - 📚 Framework docs: [Mastra](https://mastra.ai/docs) · [Vercel AI SDK](https://ai-sdk.dev/) · [LangGraph](https://docs.langchain.com/) · [Pydantic AI](https://ai.pydantic.dev/) · [CrewAI](https://docs.crewai.com/)
- [ ] Build one agent with 2 tools (e.g., `web_search`, `calculator`)
- [ ] Build one agent with structured output (Pydantic model as response)
- [ ] Build one agent with dependency injection (pass DB connection)

**Deliverable:** Three tiny agents in a single project with a shared structure.

---

## 03 · Build 1: Tool-Calling Support Agent 🛠️ (Week 3)

**Objective:** First real project — a customer support agent with 3 tools.

- [ ] Tools: search + calculator + DB lookup (SQLite)
  - 📚 [Pydantic docs](https://pydantic.dev/docs/) (structured data) · [sqlite3 docs](https://docs.python.org/3/library/sqlite3.html) · [FastAPI Tutorial](https://fastapi.tiangolo.com/tutorial/)
- [ ] Structured output: ticket summary + risk score (Pydantic model)
- [ ] Dynamic instructions via dependency injection (customer context)
- [ ] Error handling: tool failures → graceful fallback message
- [ ] Log everything to console first (Langfuse comes in Module 06)

**Deliverable:** `support_agent.py` runnable from CLI with mock DB.

---

## 04 · Build 2: RAG Agent over your own docs 🛠️ (Week 4)

**Objective:** Teach retrieval + context engineering.

- [ ] Ingest documents (PDF/MD) → chunk → embed → store
  - 📚 [Pinecone Learning Center](https://www.pinecone.io/learn/) (RAG + vector-DB 101) · [Anthropic: Effective context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [ ] Vector store: Chroma (simplest) or Qdrant
- [ ] Retrieval: top-k chunks → prompt assembly → grounded answer
- [ ] Citations: make the agent show its sources
- [ ] **Hybrid search + rerankers** — combine keyword (BM25/sparse) + semantic (dense) retrieval, then re-rank: the single biggest RAG quality lever (names, IDs, jargon survive keyword; intent survives semantic)
  - 📚 [Pinecone: Hybrid Search](https://www.pinecone.io/learn/hybrid-search/) (dense + sparse vectors, BM25, alpha weighting)
- [ ] Compare naive vs reranked retrieval quality

**Deliverable:** "Ask your own documents" CLI agent with citations.

---

## 05 · Build 3: Human-in-the-Loop Workflow 🛠️ (Week 4)

**Objective:** The #1 production pattern — pause and ask before acting.

- [ ] Agent drafts an email → pauses → asks "approve / edit / reject"
- [ ] Tool approval: flag dangerous tools (send, pay, delete) for approval
- [ ] Timeout + resume: workflow survives restart (checkpointing)
  - 📚 [Temporal](https://temporal.io/) (durable-execution reference; used by OpenAI, Snap, Cloudflare) · [LangGraph Academy](https://academy.langchain.com/) (checkpointing)

**Deliverable:** Email-drafting agent with an approval gate.

---

## 06 · Pillar: Observability 📊 (Week 5)

**Objective:** See every LLM call, token, and cost.

- [ ] Self-host Langfuse: `docker compose up` (5 min)
  - 📚 [Langfuse docs](https://langfuse.com/docs) · [Observability quickstart](https://langfuse.com/docs/observability/get-started)
- [ ] Wire SDK into your Module 03 agent (`@observe()` decorator)
- [ ] Read a trace: prompt, completion, tokens, latency, cost
- [ ] Add a custom span: retrieval step, tool call
- [ ] **Prompt versioning & rollback** — manage prompts in Langfuse (version, diff, promote to `production`, roll back a bad prompt change in seconds — the #1 "whoops" moment in prod)
  - 📚 [Langfuse Prompt Management](https://langfuse.com/docs/prompts/get-started) (versions, labels, rollback)

**Deliverable:** Your support agent producing traces you can inspect.

---

## 07 · Pillar: LLM Gateway 🚪 (Week 5)

**Objective:** One API for 100+ models with cost control.

- [ ] Deploy LiteLLM proxy: `uv tool install 'litellm[proxy]'`
  - 📚 [LiteLLM docs](https://docs.litellm.ai/) (100+ LLMs, one OpenAI-format API) · [Proxy Docker quick start](https://docs.litellm.ai/docs/proxy/docker_quick_start)
- [ ] Route OpenAI + Anthropic + local Ollama through it
- [ ] Virtual keys + spend tracking per project
- [ ] Fallbacks: if provider A fails → auto-retry provider B
- [ ] **Cache LLM responses** — LiteLLM response caching (Redis exact-match) reuses repeated calls: the biggest cost lever (often 30–70% saved on RAG/support agents where users ask the same thing)
  - 📚 [LiteLLM Caching](https://docs.litellm.ai/docs/proxy/caching) (Redis/S3/disk; ⚠️ use exact-match cache, NOT semantic, for agentic traffic — semantic cache replays stale turns)
- [ ] **Route cheap models for easy tasks** — small/cheap model for simple intents, flagship model for hard ones (second-biggest cost lever; LiteLLM routing by regex/rules)
  - 📚 [LiteLLM docs](https://docs.litellm.ai/) (routing, model fallbacks, budget caps)
- [ ] **Provider-side prompt caching** — Anthropic/OpenAI cache exact prompt prefixes (system prompt, tools) automatically; cached reads billed at ~10% of input cost. Distinct from the LiteLLM caching above — this one needs no extra infra, just keep static content first and stable
  - 📚 [Anthropic Prompt Caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching) (auto caching, breakpoints, 5-min TTL) · [OpenAI Prompt Caching](https://developers.openai.com/api/docs/guides/prompt-caching) (1,024-token minimum, cached input ≈0.1×)

**Deliverable:** Your agent calls `http://localhost:4000` — provider-agnostic.

---

## 08 · Pillar: Evaluation 🎯 (Week 6)

**Objective:** Score your agent before you trust it.

- [ ] Build a 20-question eval dataset (good + edge cases)
  - 📚 [promptfoo docs](https://www.promptfoo.dev/docs/intro/) (test-driven LLM dev) · [Langfuse Evaluation](https://langfuse.com/docs/evaluation/overview)
- [ ] LLM-as-a-judge scoring (correctness, groundedness)
- [ ] Run evals in Langfuse or [promptfoo](https://github.com/promptfoo/promptfoo) (24k ⭐, MIT — now part of OpenAI; used by OpenAI & Anthropic; needs Node ≥ 22.22)
- [ ] Track score before/after every prompt change
- [ ] Automate evals in CI/CD so every prompt change runs the suite
- [ ] Run a red-team scan (injection + jailbreak probes) — promptfoo has this built in
- [ ] **Prod feedback loop** — capture real user thumbs up/down + failed runs back into your eval dataset (your 20 questions rot; live traffic always finds cases they missed)
  - 📚 [Langfuse docs](https://langfuse.com/docs) (Annotation queues — human review of real traces → back into evals)
- [ ] **Deterministic unit tests (mock the LLM)** — pytest + VCR.py: record real LLM/API calls once, replay them in CI (offline, deterministic, fast). Evals check *quality*; these check *your code doesn't break* — both belong in CI
  - 📚 [pytest docs](https://docs.pytest.org/) (fixtures, monkeypatch) · [VCR.py](https://vcrpy.readthedocs.io/) (record/replay HTTP → deterministic tests)

**Deliverable:** A number you can point to: "agent scores 92% on eval set" — plus a CI job that keeps it honest.

---

## 08.5 · Pillar: AI Security & Guardrails 🛡️ (Week 6)

**Objective:** Assume every input is hostile — production agents get prompt-injected.

- [ ] Prompt injection 101: why "ignore previous instructions" in user data breaks agents
  - 📚 [OWASP LLM Top 10 (2025)](https://genai.owasp.org/llm-top-10/) · [Simon Willison on prompt injection](https://simonwillison.net/tags/prompt-injection/) (community oracle, 160+ posts)
- [ ] Tool permissioning: gate dangerous tools (send, pay, delete, run-shell) — reuse your Module 05 approval gate
- [ ] Input/output guardrails: validate model output (Pydantic/zod) + filter inputs (OpenAI Agents SDK has guardrails built in)
- [ ] Red-team your Module 03 agent with promptfoo: injection, jailbreaks, PII leakage — fix every escape
- [ ] Secrets hygiene: `.env` in `.gitignore`, never log prompts/keys, scoped keys per service
- [ ] **Secrets vault (when you have a team)** — move secrets out of `.env` into a vault: Doppler (hosted, CLI) or SOPS (encrypted files committed to git, CNCF sandbox) — audit log, rollback, per-service access
  - 📚 [Doppler docs](https://docs.doppler.com/) (secrets management + CLI) · [SOPS](https://github.com/getsops/sops) (22.8k ⭐, MPL-2.0 — encrypt YAML/JSON/ENV with KMS/age/PGP)
- [ ] Cost & rate limits: budget caps and per-key limits via LiteLLM (Module 07)

**Deliverable:** Your agent survives a red-team scan; dangerous tools require approval; `.env` never hits git.

> 📚 Extra: Microsoft's [ai-agents-for-beginners — Securing AI Agents lesson](https://github.com/microsoft/ai-agents-for-beginners) covers this in depth.

---

## 09 · Pillar: Deployment ☁️ (Week 6)

**Objective:** Ship it like a service.

- [ ] Dockerfile for your agent (small, non-root, pinned deps)
  - 📚 [Docker Get Started](https://docs.docker.com/get-started/) · [FastAPI docs](https://fastapi.tiangolo.com/) (API + deploy guides)
- [ ] `docker compose` with: agent + LiteLLM + Langfuse + Postgres
- [ ] Expose via FastAPI (agent as an API endpoint)
- [ ] Deploy to Railway / Render / Fly free tier
- [ ] **Auth on your endpoint** — API-key/Bearer auth on the FastAPI app. A public agent endpoint with no auth gets its key drained and the agent prompt-injected — this is the #1 real-world production bug
  - 📚 [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/first-steps/) (Bearer/OAuth2 in ~10 lines)
- [ ] **Health checks + alerting** — `healthcheck:` in compose so dead containers restart automatically; alert on error rate / token burn before your users do (agents fail silently — garbage output isn't a crash)
  - 📚 [Docker Compose services](https://docs.docker.com/reference/compose-file/services/) (`healthcheck:` + `restart:` policies) · [Langfuse docs](https://langfuse.com/docs) (traces → alert on error rate / cost)

**Deliverable:** A public URL where your agent answers requests.

---

## 10 · Pillar: Durable Execution & Recovery ♻️ (Week 7)

**Objective:** Survive crashes and long-running workflows.

- [ ] Checkpointing: state saved per step (LangGraph checkpointer / Pydantic durable agents)
  - 📚 [Temporal](https://temporal.io/) (industry reference: "write code as if failure doesn't exist") · [LangGraph Academy](https://academy.langchain.com/)
- [ ] Retry with backoff on transient API failures
- [ ] Timeouts on every tool call
- [ ] Replay: re-run a failed workflow from the checkpoint
- [ ] **Backups** — scheduled `pg_dump` of Postgres (traces/evals/state) + vector-store export; do a restore drill once (a backup you've never restored is a rumor)
  - 📚 [PostgreSQL Backup & Restore](https://www.postgresql.org/docs/current/backup-dump.html) (`pg_dump` / `pg_restore`)

**Deliverable:** Kill your agent mid-run → restart → it resumes.

---

## 11 · Depth: Multi-Agent Orchestration 🔀 (Week 8)

- [ ] Supervisor pattern: one agent routes to specialists (LangGraph / CrewAI / OpenAI Agents SDK handoffs)
  - 📚 [Anthropic: How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system) · [LangGraph Academy](https://academy.langchain.com/)
- [ ] When NOT to use multi-agent (most apps don't need it)
- [ ] Shared state, handoffs, loops, and how to avoid agent chaos
- [ ] 🌟 **A2A (Agent2Agent)** — the emerging open protocol (Linux Foundation, [25.3k ⭐](https://github.com/a2aproject/A2A)) for agents to *discover and collaborate with each other as peers*, not tools. JSON-RPC 2.0 over HTTP, Agent Cards, SSE/async push. SDKs for Python/JS/Go/Java/.NET/Rust. Free [DeepLearning.AI course](https://goo.gle/dlai-a2a)
  - Complements MCP: **MCP = agent ↔ tools**, **A2A = agent ↔ agent**

---

## 12 · Depth: MCP 🔌 (Week 8)

- [ ] What MCP is and why it's the standard tool protocol
  - 📚 [modelcontextprotocol.io](https://modelcontextprotocol.io/) (official spec) · [MCP for Beginners](https://github.com/microsoft/mcp-for-beginners) (free course)
- [ ] Build one MCP server (e.g., expose a SQLite DB as a tool)
  - Free course: [microsoft/mcp-for-beginners](https://github.com/microsoft/mcp-for-beginners) (17k ⭐, MIT, 6 languages, 13-lab PostgreSQL MCP capstone)
- [ ] Connect it to your agent via the framework's MCP integration
- [ ] 🌟 Watch the **MCP 2026-07-28 spec** (RC shipped Jul 2026): makes the transport *stateless*, adds an **Extensions framework (MCP Apps, Tasks)**, hardens authorization, deprecates Roots/Sampling/Logging. Learn on 2025-11-25 spec today, design for the new one.

---

## 13 · Depth: Agentic RAG Reference 📚 (Week 9)

- [ ] Study [RAGFlow](https://github.com/infiniflow/ragflow) (87k ⭐, Apache-2.0) as reference architecture
  - ⚠️ Heavy to run: needs 4+ CPU cores, 16 GB RAM, 50 GB disk — read its docs/architecture if your machine can't handle it
- [ ] Read how it does: deep document understanding → chunking → rerank → citations
  - 📚 [Pinecone Learning Center](https://www.pinecone.io/learn/) (RAG concepts behind it)
- [ ] Port one idea (e.g., template-based chunking) into your Module 04 agent

---

## 14 · Depth: Coding Agents 💻 (Week 9)

- [ ] Run [OpenHands](https://github.com/OpenHands/OpenHands) locally (Docker)
  - 📚 [OpenHands docs](https://docs.all-hands.dev/) · [Deep Agents docs](https://docs.langchain.com/deepagents-code)
- [ ] Give it a small repo task; observe its loop: plan → edit → test
- [ ] Try [Deep Agents Code](https://docs.langchain.com/deepagents-code) — a Claude-Code-style terminal coding agent, any LLM: `curl -LsSf https://langch.in/dcode | bash`
- [ ] Free course: [anthropics/courses](https://github.com/anthropics/courses)

---

## 15 · Capstone: Production Portfolio Piece 🏆 (Week 10)

**Objective:** One repo that proves all the pillars.

- [ ] Pick a real problem (support triage, doc QA, report generator)
- [ ] Agent + RAG + HITL + Langfuse tracing + LiteLLM gateway
- [ ] Eval suite with a documented score
- [ ] Docker deploy with README + architecture diagram
- [ ] Publish it — this is your "production-grade" proof

**Deliverable:** Public GitHub repo you'd be proud to show in an interview.

---

## 16 · Cutting-Edge & Emerging Radar 🚀 (ongoing)

**Objective:** Know what's moving in the market — and spot what to adopt early. All facts verified Aug 2026.

### The big ones right now

| Project | What it is | Why it matters | Verified |
| --- | --- | --- | --- |
| **OpenClaw** 🦞 | Personal AI assistant on your devices + chats (WhatsApp/Telegram/Slack/Discord/Signal/iMessage) | The fastest-growing agent project ever — **386k ⭐**, MIT, 2.9k contributors; sponsors incl. OpenAI, GitHub, NVIDIA, Vercel. Gateway + Control UI + CLI/TUI, plugins/skills via ClawHub. Single-operator, own-your-data | `npm install -g openclaw@latest` |
| **Microsoft Agent Framework (MAF)** | Verified successor to Semantic Kernel (SK README points here) | Production-grade multi-agent for **Python + C#/.NET**: middleware, graph workflows (sequential/concurrent/handoff/group), checkpointing, time-travel, declarative YAML agents, Foundry hosting, RL labs. **12.8k ⭐, MIT** | `pip install agent-framework` |
| **Deep Agents** | LangChain's "batteries-included agent harness" on LangGraph | Sub-agents, filesystem, context mgmt, shell, memory, HITL, skills out of the box. The shift from *framework you code* → *harness that runs*. **27.7k ⭐, MIT**; JS version `deepagentsjs` | `uv add deepagents` |
| **Google ADK 2.0** | Google's code-first agent framework, rebuilt | New **Workflow Runtime** (graph engine: routing, fan-out/fan-in, loops, retry, HITL, nested) + **Task API** (structured agent-to-agent delegation). **21.1k ⭐, Apache-2.0** | `pip install google-adk` |
| **A2A Protocol** | Open agent-to-agent protocol (Linux Foundation, contributed by Google) | The "agent internet" standard: agents discover + negotiate + collaborate as peers. **25.3k ⭐, Apache-2.0**, v1.0.1. Pairs with MCP | [a2a-protocol.org](https://a2a-protocol.org/) |
| **OpenAI Agents JS** | Official OpenAI agents SDK for TypeScript | Sandbox agents (filesystem workspace), **realtime/voice agents**, handoffs, guardrails, sessions, tracing. **3.6k ⭐, MIT**, Node 22+/Deno/Bun | `npm install @openai/agents zod` |

### Trends to watch (signal, not hype)

1. **Protocol-ification** — MCP (agent ↔ tools) + A2A (agent ↔ agent) are becoming the "USB-C" of AI. Learn both; frameworks now ship both by default.
2. **Harness shift** — from "write framework code" to "run an opinionated harness" (Deep Agents, Claude Code-style agents). More defaults, less boilerplate.
3. **Personal / single-operator agents** — OpenClaw's explosion shows demand for *your own* assistant on *your* devices/channels, not SaaS.
4. **Sandboxed + realtime agents as defaults** — OpenAI sandbox agents (filesystem, long-horizon) and voice/realtime agents are first-class SDK features now.
5. **Evals + observability built-in** — Mastra, MAF, ADK all ship tracing/evals natively. By 2027 this will be table stakes, not a pillar you add later.

> ⚠️ Cutting-edge means churn. Anything < 1 year old or < 5k ⭐ may change API. Learn the *patterns* (these transfer), not the *APIs*.

---

## 🧰 Toolbox (all free, all verified earlier)

| Tool | Purpose | Install |
| --- | --- | --- |
| Ollama | Local LLMs ($0, offline) | `curl -fsSL https://ollama.com/install.sh \| sh` |
| Langfuse | Tracing + evals | `docker compose up` |
| LiteLLM | LLM gateway | `uv tool install 'litellm[proxy]'` |
| promptfoo | Evals | `npm install -g promptfoo` |
| Chroma/Qdrant | Vector store | `pip install chromadb` / Docker |
| Open WebUI | Chat UI for your team | `docker run -d -p 3000:8080 ghcr.io/open-webui/open-webui:main` |
| Mastra | TS agent framework (Track A) | `npm create mastra@latest` |
| Vercel AI SDK | TS toolkit + UI hooks (Track A) | `npm install ai` |
| OpenAI Agents JS | Official TS agents SDK | `npm install @openai/agents zod` |
| OpenClaw | Personal AI assistant + channels | `npm install -g openclaw@latest` |
| Google ADK | Google's agent framework | `pip install google-adk` |

### 💳 Free ways to get LLM access (no credit card)

| Source | What you get | Where |
| --- | --- | --- |
| **Ollama** | Local models, 100% offline | `curl -fsSL https://ollama.com/install.sh \| sh` |
| **Groq** | Free tier, very fast inference | groq.com |
| **Google AI Studio** | Free Gemini quota | aistudio.google.com |
| **OpenRouter** | Free models + cheap routing | openrouter.ai |
| **GitHub Models** | Free tier (usable via LiteLLM) | docs.github.com/en/copilot/github-models |
| **Azure Foundry** | Free tier (needed for MS course) | azure.microsoft.com |

---

## 🗺️ One-line summary per module (cheat sheet)

- 01 ReAct loop = think → act → observe → repeat
- 02 One framework, deeply
- 03 Support agent = tools + structured output
- 04 RAG agent = retrieve before you answer
- 05 HITL = pause before you act
- 06 Langfuse = see what the LLM did
- 07 LiteLLM = one API, many models
- 08 Evals = a number you trust
- 08.5 Security = assume every input is hostile
- 09 Docker = runs anywhere
- 10 Checkpoints = survives crashes
- 11 Multi-agent = supervisors, not mobs
- 12 MCP = tools as a protocol
- 13 RAGFlow = how the pros do RAG
- 14 OpenHands = agents that code
- 15 Capstone = prove all of it
- 16 Radar = MCP for tools, A2A for agents, harnesses over frameworks, sandboxed + realtime agents

---

*Last updated: 2026-08-13 · Sources verified by direct repo fetches (stars/licenses/releases/features). **📚 Learning links verified by direct web fetches** (docs.python.org, git-scm.com, docs.astral.sh, missing.csail.mit.edu, realpython.com, MDN, sqlbolt.com, docs.docker.com, karpathy.ai, lilianweng.github.io, anthropic.com, pinecone.io, temporal.io, langfuse.com, docs.litellm.ai, promptfoo.dev, genai.owasp.org, simonwillison.net, fastapi.tiangolo.com, yaml.org, docs.github.com, gto76/python-cheatsheet). Emerging projects change quickly — re-verify before adopting.*
