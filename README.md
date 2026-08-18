# 🧭 Platform Engineering — DevOps / SRE Full Path

Your complete, research-backed learning + interview-prep system for **Platform Engineering / DevOps / SRE** roles (Pune / India / remote market focus).

> 🌐 **Live site:** https://codetreatise.github.io/DevOps/ (auto-deploys on every push to `main`)

---

## 📁 Project structure

```
platform-engineering/
├── curriculum/            ← Source of truth (drives everything)
│   ├── Platform-Engineering-Path.json     canonical data (15 modules, 426 Qs)
│   ├── Platform-Engineering-PATH.md       full markdown path
│   ├── Platform-Fundamentals-INDEX.md     Phase A index (A01–A06, 109 Qs)
│   └── Platform-MidLevel-INDEX.md         Phase B index (B01–B09, 317 Qs)
├── answer-bank/           ← Generated interview banks (self-grading)
│   ├── Platform-Answer-Bank.md            Phase A: 109 model answers
│   └── Platform-Answer-Bank-B.md          Phase B: 317 model answers
├── website/               ← Interactive site (open index.html)
│   ├── index.html · app.js · data.js · styles.css
│   └── answers.js                         auto-generated (Practice Mode / Mastery)
├── scripts/               ← Generators + validators + audits
│   ├── gen_answer_bank_a.py / gen_answer_bank_b.py   build the banks
│   ├── ans_bank_b1.py / b2.py / b3.py                Phase B answer data
│   ├── export_answers_js.py               builds website/answers.js (426 answers)
│   ├── star_data.js                       STAR story bank (5 categories, 20 Qs)
│   ├── check_answers.py / check_answers_b.py         tuple validation
│   ├── audit_coverage.py                             426/426 coverage audit
│   ├── check_site_sync.js                            JSON ↔ site sync check
│   ├── check_crossrefs.js / check_completeness.js    reference + structure audits
│   └── dump_qa.py                                     list questions per phase
├── analysis/
│   ├── PLATFORM_PATH_GAP_ANALYSIS.md      gap analysis (2026-08-17)
│   └── q_inventory.json                   question inventory
├── AI-Agents-Learning-INDEX.md            companion AI-agents track
└── .markdownlint.json                     lint config
```

## 🚀 Daily workflow

| Task | Command (from `platform-engineering/`) |
| --- | --- |
| Rebuild both answer banks | `python3 scripts/gen_answer_bank_a.py && python3 scripts/gen_answer_bank_b.py` |
| Rebuild site answers (Practice/Mastery) | `python3 scripts/export_answers_js.py` |
| Inject extras (certs/sysdesign/labs/resume/STAR…) | `node scripts/sync_companies.js && node scripts/sync_extras.js` |
| Validate answer data | `python3 scripts/check_answers.py && python3 scripts/check_answers_b.py` |
| Prove full coverage (426 Qs) | `python3 scripts/audit_coverage.py` |
| Prove site ↔ JSON in sync | `node scripts/check_site_sync.js` |
| Prove cross-refs + structure | `node scripts/check_crossrefs.js && node scripts/check_completeness.js` |
| Open the site | open `website/index.html` in a browser |

> **Rule:** curriculum is the source of truth. Any change to questions goes in
> `curriculum/Platform-Engineering-Path.json` **and** `website/data.js` **and**
> the PATH.md research blocks — then regenerate the banks and `answers.js`.
> After touching `app.js` always run `node --check website/app.js`.

## 📊 Scale

- **426 interview questions** (Phase A: 109, Phase B: 317) — every question has a model answer + 1/2/3 rubric + why-asked
- **15 modules** · 65 sub-topics · 188 learning items
- Market data for Pune / national India / international, job requirements, 239+ verified sources

## 🧰 Study tools (Study Tools nav group)

- **🔍 Search** — instant site-wide search across all 426 answers, module topics and STAR prompts (press `/` anywhere to jump in)
- **🎴 Practice Mode** — active-recall deck: module filter, shuffle, reveal answer+rubric+why, self-rate; **🔊 Read question** (browser TTS) reads the question aloud
- **📈 Mastery** — aggregates self-ratings into per-module % (weakest first) + spaced-repetition "due for review" list
- **📄 Cheat Sheets** — one-page printable must-know recap per module (mental model, topics, practice questions, exit test); 🖨 Print
- **🗣 STAR Stories** — 5 behavioral categories × 4 prompts, S/T/A/R templates + worked examples
