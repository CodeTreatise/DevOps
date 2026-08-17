#!/usr/bin/env python3
# Generates Platform-Answer-Bank-B.md — Phase B (B01-B09, Mid-Level Depth)
# Curated answers keyed by exact question text; any missing question is flagged.
import json, os, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ans_bank_b1 import ANSWERS as A1
from ans_bank_b2 import ANSWERS as A2
from ans_bank_b3 import ANSWERS as A3

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CURRICULUM = os.path.join(ROOT, 'curriculum')
ANSWER_BANK = os.path.join(ROOT, 'answer-bank')

d = json.load(open(os.path.join(CURRICULUM, 'Platform-Engineering-Path.json'), encoding='utf-8'))

ANSWERS = {}
for part in (A1, A2, A3):
    for mid, lst in part.items():
        ANSWERS[mid] = lst

PHASE = 'B'


def contents(phase_ids):
    lines = ["## 📖 Contents", ""]
    for p in d['phases']:
        if p['id'] != PHASE:
            continue
        for m in p['modules']:
            if m['id'] not in phase_ids:
                continue
            slug = m['id'].lower() + '-' + m['title'].lower().replace('—', '').replace('–', '').replace(' ', '-')[:60]
            lines.append(f"- [{m['id']} {m['title']}](#{slug})")
    lines.append("")
    return lines


def section(mid):
    m = next(m for p in d['phases'] for m in p['modules'] if m['id'] == mid)
    order = []
    for s in m.get('subTopics', []):
        qs = s.get('research', {}).get('interviewFocus', [])
        if qs:
            order.append(('st', s['name'], qs))
    mq = m.get('research', {}).get('interviewFocus', [])
    if mq:
        order.append(('module', 'Module research', mq))
    return order


def answer_for(q, answers, default_why):
    for tup in answers:
        qu = tup[0]
        if qu.strip().lower().startswith(q.strip().lower()[:40]):
            a = tup[1]
            rubric = tup[2]
            why = tup[3] if len(tup) > 3 and tup[3] else default_why
            return (a, rubric, why)
    return None


def render_q(q, ans, idx):
    if not ans:
        return f"<details>\n<summary>❓ Q{idx}: {q}</summary>\n\n**Model answer:** *(pending — gap to fill)*\n\n**Rubric:** 1=basic · 2=partial · 3=strong\n</details>\n"
    a, rubric, why = ans
    return f"""<details>
<summary>❓ Q{idx}: {q}</summary>

**Model answer:** {a}

**Rubric:** {rubric}

**Why asked:** {why}
</details>
"""


def main():
    out = []
    out.append("# 🎯 Platform Engineering — Model Answer Bank (Phase B: Mid-Level Depth)")
    out.append("")
    out.append("> **How to use:** read the question → answer it out loud or in writing → expand **Reveal model answer** → self-grade 1/2/3. A 1–2 means re-study that module's items and revisit in 2 days (spaced repetition). Phase B = the operating depth layer: you don't just deploy, you operate, debug, and own. Generated from `Platform-Engineering-Path.json` research blocks.")
    out.append(">")
    out.append("> **Rubrics:** 🟥 1 = can't answer / wrong · 🟧 2 = partial, correct with gaps · 🟩 3 = confident, complete, production-aware.")
    out.append("")
    phase_ids = []
    for p in d['phases']:
        if p['id'] == PHASE:
            phase_ids = [m['id'] for m in p['modules']]
    out.extend(contents(phase_ids))

    missing = []
    total = 0
    for p in d['phases']:
        if p['id'] != PHASE:
            continue
        for m in p['modules']:
            mid = m['id']
            ans = ANSWERS.get(mid, [])
            out.append(f"## {mid} {m['title']}")
            out.append("")
            order = section(mid)
            for kind, name, qs in order:
                out.append(f"### {name}")
                out.append("")
                idx = 0
                for q in qs:
                    idx += 1
                    total += 1
                    a = answer_for(q, ans, f"Asked in {mid} — verify against the module's checklist items and research block.")
                    if not a:
                        missing.append((mid, name, q))
                    out.append(render_q(q, a, idx))
                    out.append("")
            out.append("---")
            out.append("")

    out.append("## ✅ Coverage")
    out.append("")
    out.append(f"Answered: {total - len(missing)} / {total} Phase B questions.")
    if missing:
        out.append("")
        out.append("**Questions still needing answers:**")
        out.append("")
        for mid, name, q in missing:
            out.append(f"- [{mid}] {q[:80]}")
    open(os.path.join(ANSWER_BANK, 'Platform-Answer-Bank-B.md'), 'w', encoding='utf-8').write('\n'.join(out))
    print(f"Phase B done: {total} questions, {len(missing)} missing")
    for mid, name, q in missing:
        print(f"  MISSING [{mid}][{name[:20]}]: {q[:70]}")


main()
