# STAR Story Bank — Behavioral Interview Prep

```text
Purpose: build 5-10 genuine STAR stories that map to the exact things
platform/DevOps interviewers probe in behavioral rounds. Behavioral rounds
decide offers — after the tech rounds, interviewers check how you behave
under incident pressure, disagreement, and ownership.
```

## How to use

1. Pick one question per category below and write a **real** story from your own experience using S/T/A/R.
2. Practise saying it out loud in **90 seconds**.
3. Every story needs a **measurable result (R)** — interviewers remember numbers ("cut recovery from 40min to 7min", "removed 200 manual steps", "saved ~$3k/mo").
4. Don't invent heroics — a honest "I broke X, owned it, fixed it, and added a guard" story beats a fake big one.
5. Map each story to the module it proves (incident → B06/B08, automation → A05/B07, etc.) and say that mapping out loud.

## The S/T/A/R template (apply to every story)

| Letter | Meaning | What the interviewer is checking |
|--------|---------|----------------------------------|
| **S** | Situation — what was running, who was affected, how bad (users, revenue, SLA) | Can you frame impact in business terms? |
| **T** | Task — what was *your* responsibility in that moment | Do you know your role vs the team's? |
| **A** | Action — exact commands/tools in order; triage logic (metrics → logs → hypothesis → test) | Do you show working, not vague "I fixed it"? |
| **R** | Result — MTTR before/after, error rate, hours saved, permanent changes | Can you quantify and show durability? |

## Categories & questions

### 🚨 Incidents & on-call
1. Tell me about a time you resolved a production incident. What was your role and what did you do first?
2. Describe an on-call shift where something you'd never seen happened. How did you handle being the first responder?
3. Tell me about a time a fix you shipped made things worse. What happened and what did you learn?
4. How do you decide whether to roll back or roll forward during an incident? Give a real example.

**Worked example — payment-webhook backlog (40min → 7min MTTR):**
S: Payment webhook consumer crashed every Sunday night under a spike; queue backed up, retries piled into a thundering herd. T: As on-call SRE I had to restore processing within the error budget and stop the recurrence. A: Checked queue depth + consumer logs first (not the dashboard), confirmed crash loop from an unhandled exception on one message shape, paused queue input, drained the poisoned message, restarted the consumer, re-enabled input — scripted, ~7 minutes. R: MTTR 40min → 7min; wrote a runbook, added queue-depth alert + poison-message DLQ; schema-validation fix from the review so it never repeated.
**Signal:** triage order (metrics→logs→fix), calm under pressure, permanent fix — not just "I restarted it".

### 🤖 Automation & process improvement
1. Tell me about a time you automated something that was previously done manually.
2. Describe a time you improved a slow or error-prone deployment process.
3. Tell me about a time you built a tool or script that saved your team real time.
4. Give an example of when you chose NOT to automate something and why.

**Worked example — config drift check (2h manual → 10-min cron):**
S: Every release, a senior dev manually checked prod configs matched the repo — 2 hours, still missed drift twice. T: I owned making that check automatic before the next release. A: Wrote a Python script that pulled live config, diffed against versioned files, posted a report to the team channel; wired as cron + a pre-release CI gate; verified it caught the two past drift cases before rollout. R: audit became 10 minutes of review, drift caught pre-release, script became the basis for our config-as-code work.
**Signal:** measuring before/after, testing your own automation, team adoption.

### 🤝 Conflict & communication
1. Tell me about a time you disagreed with a senior engineer or manager about an approach.
2. Describe a time you had to push back on a deadline or scope to protect reliability.
3. Tell me about a time you explained a technical decision to a non-technical stakeholder.
4. Give an example of a time you gave tough feedback to a teammate or received it.

**Worked example — saying no to a Friday 5pm prod deploy:**
S: A feature lead wanted a prod deploy Friday 5pm to hit a demo; the change touched auth and our error budget was thin that week. T: Make the team take the right call without me becoming the blocker. A: Showed blast radius (auth, all users), current error budget, proposed Monday 9am canary instead — and offered to prep the rollback so the demo wasn't at risk. R: team moved it to Monday; demo used staging I set up; the lead later said the data made the call easy.
**Signal:** data-backed pushback, offering alternatives, preserving the relationship.

### 🧯 Ownership & mistakes
1. Tell me about a mistake you made in production. What happened and what did you do about it?
2. Describe a time you took ownership of something that wasn't your job.
3. Tell me about a time you broke something and how you handled the aftermath.
4. Give an example of a time you went above the explicit ask to prevent a future problem.

**Worked example — a migration without a dry-run, owned publicly:**
S: Applied a DB migration to prod that I'd only tested on a small copy; it locked the table 6 minutes during peak. T: Own it, restore service fast, make the team learn without blame. A: Told my manager within 5 minutes, rolled back to the previous schema, posted a blameless timeline+impact note to the team channel; then added staging-clone dry-runs, lock-time alerts, and a release-runbook checklist item. R: service restored in minutes, runbook now catches it, postmortem culture improved.
**Signal:** speed of owning up, containment first, systemic fix — never excuses.

### 👥 Teamwork & cross-team delivery
1. Tell me about a time you collaborated with developers or QA to ship a feature.
2. Describe a time you helped a teammate who was struggling.
3. Tell me about a time you worked across teams (dev, security, ops) to deliver something.
4. Give an example of a time you influenced without authority.

**Worked example — unblocking 4 dev teams with a shared platform service:**
S: Four dev teams each built their own deploy pipeline with different failures every sprint. T: As the platform engineer I had to deliver a shared CI/CD service without owning the teams. A: Interviewed each team's pain points, built a thin shared pipeline layer (GitHub Actions + templates), ran brown-bag demos, paired with each team to migrate one service — starting with the most-pained team. R: three teams migrated in 6 weeks, deploy time ~1h → ~15min, fourth adopted next quarter. Adoption came from making the boring path the easy path.
**Signal:** empathy-first influence, incremental adoption, evidence of real adoption.

## Before the interview

- [ ] 5-10 stories written, one per category (at least incident, automation, conflict, mistake)
- [ ] Every story has a measurable R (number)
- [ ] Every story has a module mapping (B06/B08/A05/B07/…) ready to say
- [ ] Practised aloud in 90 seconds (record yourself once)
- [ ] Story order: S (15s) → T (10s) → A (45s) → R (20s)
