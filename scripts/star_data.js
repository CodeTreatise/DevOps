/* STAR story bank — behavioral-interview preparation for platform/DevOps roles.
   window.STAR_DATA — synced into curriculum JSON + data.js by sync_extras.js. */
window.STAR_DATA = {
  howToUse: [
    "Behavioral rounds decide offers: after the tech rounds, interviewers check how you behave under incident pressure, disagreement, and ownership — exactly what on-call and platform work demands.",
    "Pick one question per category and write a REAL story from your own experience using the S/T/A/R template. Practise saying it out loud in 90 seconds.",
    "Every story needs a MEASURABLE RESULT (R). Interviewers remember numbers: 'cut recovery from 40min to 7min', 'removed 200 manual steps', 'saved ~$3k/mo'.",
    "Don't invent heroics — pick genuine small stories. A honest 'I broke X, owned it, fixed it, and added a guard' story beats a fake big one.",
    "Map each story to the module it proves (e.g. an incident story proves B06/B08; an automation story proves A05/B07). Say that mapping out loud in the interview."
  ],
  categories: [
    {
      "id": "incident",
      "name": "Incidents & on-call",
      "icon": "🚨",
      "questions": [
        "Tell me about a time you resolved a production incident. What was your role and what did you do first?",
        "Describe an on-call shift where something you'd never seen happened. How did you handle being the first responder?",
        "Tell me about a time a fix you shipped made things worse. What happened and what did you learn?",
        "How do you decide whether to roll back or roll forward during an incident? Give a real example."
      ],
      "template": {
        "s": "Situation — what was running, who was affected, how bad (users, revenue, SLA)?",
        "t": "Task — what was YOUR responsibility in that moment (vs the team's)?",
        "a": "Action — the exact commands/tools you ran, in order; how you triaged (metrics → logs → hypothesis → test)",
        "r": "Result — MTTR before/after, what you changed permanently (runbook, alert, code fix, monitoring)"
      },
      "example": {
        "title": "Payment-webhook backlog — 40min MTTR → 7min with a runbook",
        "story": "S: Our payment webhook consumer crashed every Sunday night under a spike; the queue backed up and retries piled into a thundering herd. T: As the on-call SRE I had to restore processing within the error budget and stop the recurrence. A: I checked the queue depth + consumer logs first (not the dashboard), confirmed the crash loop from an unhandled exception on one message shape, paused the queue input, drained the poisoned message, restarted the consumer, and re-enabled input — all scripted, ~7 minutes. R: MTTR dropped from ~40min to ~7min; I wrote a runbook, added an alert on queue depth + a poison-message DLQ, and the incident review produced a schema-validation fix so it never repeated.",
        "signal": "Interviewer listens for: triage order (metrics→logs→fix), calm under pressure, and a permanent fix — not just 'I restarted it'."
      }
    },
    {
      "id": "automation",
      "name": "Automation & process improvement",
      "icon": "🤖",
      "questions": [
        "Tell me about a time you automated something that was previously done manually.",
        "Describe a time you improved a slow or error-prone deployment process.",
        "Tell me about a time you built a tool or script that saved your team real time.",
        "Give an example of when you chose NOT to automate something and why."
      ],
      "template": {
        "s": "Situation — the manual process: how often, how many people, what went wrong",
        "t": "Task — why you took it on, what outcome you were responsible for",
        "a": "Action — what you built (script/pipeline/tool), the tech, and how you tested it before handing over",
        "r": "Result — hours saved per week, error rate before/after, adoption by the team"
      },
      "example": {
        "title": "Config drift check — 2h of manual audits → a 10-minute cron job",
        "story": "S: Every release, a senior dev manually checked that production configs matched the repo — 2 hours, and it still missed drift twice. T: I owned making that check automatic before the next release. A: I wrote a Python script that pulled live config from the servers, diffed against the versioned files, and posted a report to the team channel; wired it as a cron job plus a pre-release gate in CI. T: scripted the same check the team had been doing by hand and verified it caught the two past drift cases before rollout. R: the audit became 10 minutes of review, drift was caught pre-release instead of in prod, and the script became the basis for our config-as-code work.",
        "signal": "Interviewer listens for: measuring the before/after, testing your own automation, and team adoption — not just 'I wrote a script'."
      }
    },
    {
      "id": "conflict",
      "name": "Conflict & communication",
      "icon": "🤝",
      "questions": [
        "Tell me about a time you disagreed with a senior engineer or manager about an approach.",
        "Describe a time you had to push back on a deadline or scope to protect reliability.",
        "Tell me about a time you explained a technical decision to a non-technical stakeholder.",
        "Give an example of a time you gave tough feedback to a teammate or received it."
      ],
      "template": {
        "s": "Situation — the disagreement: what each side wanted, the stakes",
        "t": "Task — what you needed to achieve while managing the relationship",
        "a": "Action — how you made your case with DATA (measurements, risk, cost), who you involved, where you compromised",
        "r": "Result — the decision, the relationship, and what you'd do differently"
      },
      "example": {
        "title": "Saying no to a Friday 5pm prod deploy — with data, not opinion",
        "story": "S: A feature lead wanted a production deploy Friday 5pm to hit a demo; I knew the change touched auth and our error budget was already thin that week. T: I needed the team to make a good call without me becoming the blocker. A: I showed the deploy's blast radius (auth service, all users), our current error budget, and proposed the alternative: deploy Monday 9am with a canary — and offered to be on-call and prep the rollback so the demo wasn't at risk. R: the team moved it to Monday; the demo used a staging environment I set up. No relationship damage — the lead later said the data made the call easy. Lesson: push back with numbers + alternatives, not 'no'.",
        "signal": "Interviewer listens for: data-backed pushback, offering alternatives, and maintaining the relationship."
      }
    },
    {
      "id": "ownership",
      "name": "Ownership & mistakes",
      "icon": "🧯",
      "questions": [
        "Tell me about a mistake you made in production. What happened and what did you do about it?",
        "Describe a time you took ownership of something that wasn't your job.",
        "Tell me about a time you broke something and how you handled the aftermath.",
        "Give an example of a time you went above the explicit ask to prevent a future problem."
      ],
      "template": {
        "s": "Situation — the mistake: what you did, what broke, who noticed",
        "t": "Task — your immediate responsibility (contain, own it, communicate)",
        "a": "Action — the honest first move (who you told, how fast), the fix, and the permanent guard you added",
        "r": "Result — impact contained, what changed so it can't repeat, what the team now trusts you for"
      },
      "example": {
        "title": "I ran a migration without a dry-run — and owned it publicly",
        "story": "S: I applied a DB migration to production that I'd only tested on a small copy; it locked the table for 6 minutes during peak. T: Own it, restore service fast, and make sure the team learns without blame. A: I told my manager within 5 minutes, rolled back to the previous schema, and posted a blameless note to the team channel with timeline + impact. Then I added: migrations now run through a staging clone with a dry-run, lock-time alerts on the table, and a checklist item in the release runbook. R: service restored in minutes, the runbook now catches it, and the team's postmortem culture improved — my next migration review was actually welcomed.",
        "signal": "Interviewer listens for: speed of owning up, containment first, and a systemic fix — never excuses."
      }
    },
    {
      "id": "teamwork",
      "name": "Teamwork & cross-team delivery",
      "icon": "👥",
      "questions": [
        "Tell me about a time you collaborated with developers or QA to ship a feature.",
        "Describe a time you helped a teammate who was struggling.",
        "Tell me about a time you worked across teams (dev, security, ops) to deliver something.",
        "Give an example of a time you influenced without authority."
      ],
      "template": {
        "s": "Situation — who was involved, what the shared goal was",
        "t": "Task — your part and the coordination you were responsible for",
        "a": "Action — how you communicated (demos, docs, pairing), resolved misalignment, unblocked others",
        "r": "Result — shipped outcome, team velocity, relationships strengthened"
      },
      "example": {
        "title": "Unblocking 4 dev teams with a shared platform service",
        "story": "S: Four dev teams each built their own deploy pipeline, with different failures every sprint. T: As the platform engineer I had to deliver a shared CI/CD service without owning the teams. A: I interviewed each team's pain points, built a thin shared pipeline layer (GitHub Actions + templates) they could adopt incrementally, ran brown-bag demos, and paired with each team to migrate one service each — starting with the team most in pain. R: three teams fully migrated in 6 weeks, deploy time per team dropped from ~1h to ~15min, and the fourth adopted it the next quarter. No mandates needed — adoption came from making the boring path the easy path.",
        "signal": "Interviewer listens for: empathy-first influence, incremental adoption, and evidence the teams actually adopted it."
      }
    }
  ]
};
