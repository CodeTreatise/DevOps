#!/usr/bin/env python3
"""Full coverage audit: every JSON question (module + subtopic level, Phases A+B)
must have an answer in the banks; every bank answer must match a JSON question."""
import json, os, re, importlib.util, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
d = json.load(open(os.path.join(ROOT, 'curriculum', 'Platform-Engineering-Path.json'), encoding='utf-8'))

# --- 1. Collect every question from the JSON ---
json_qs = []          # (module_id, 'module'|'subtopic', question)
dup_check = {}
for ph in d['phases']:
    for m in ph['modules']:
        for q in m.get('research', {}).get('interviewFocus', []):
            json_qs.append((m['id'], 'module', q))
            dup_check[q] = dup_check.get(q, 0) + 1
        for st in m.get('subTopics', []):
            for q in st.get('research', {}).get('interviewFocus', []):
                json_qs.append((m['id'], 'subtopic', q))
                dup_check[q] = dup_check.get(q, 0) + 1

def norm(s):
    return re.sub(r'[^a-z0-9]+', '', s.lower())

def prefix_match(q, answers, n=40):
    key = norm(q)[:n]
    return any(norm(a).startswith(key) for a in answers)

def load_module(path):
    spec = importlib.util.spec_from_file_location(
        'm_' + re.sub(r'\W+', '_', path), path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod.ANSWERS

# --- 2. Load all bank answers ---
bank_a = load_module(os.path.join(HERE, 'gen_answer_bank_a.py'))   # Phase A inline ANSWERS
bank_b = {}
for p in ['ans_bank_b1.py', 'ans_bank_b2.py', 'ans_bank_b3.py']:
    bank_b.update(load_module(os.path.join(HERE, p)))

bank_a_qs = [t[0] for sub in bank_a.values() for t in sub]
bank_b_qs = [t[0] for sub in bank_b.values() for t in sub]
print(f'Bank A answers: {len(bank_a_qs)}  |  Bank B answers: {len(bank_b_qs)}')
print(f'JSON questions: {len(json_qs)}  (A={sum(1 for i,_,_ in json_qs if i[0]=="A")}, '
      f'B={sum(1 for i,_,_ in json_qs if i[0]=="B")})')
print()

# --- 3. Missing: JSON question with no bank answer ---
missing = []
for mid, t, q in json_qs:
    pool = bank_a_qs if mid[0] == 'A' else bank_b_qs
    if not prefix_match(q, pool):
        missing.append((mid, t, q))
print(f'=== JSON questions with NO answer: {len(missing)} ===')
for mid, t, q in missing:
    print(f'  [{mid}/{t}] {q[:95]}')
print()

# --- 4. Orphans: bank answer with no JSON question ---
json_by_phase = {
    'A': [q for mid, t, q in json_qs if mid[0] == 'A'],
    'B': [q for mid, t, q in json_qs if mid[0] == 'B'],
}
orphans = []
for ph, pool in [('A', bank_a_qs), ('B', bank_b_qs)]:
    for q in pool:
        if not any(prefix_match(q, [jq]) or prefix_match(jq, [q]) for jq in json_by_phase[ph]):
            orphans.append((ph, q))
print(f'=== ORPHAN answers (no matching JSON question): {len(orphans)} ===')
for ph, q in orphans:
    print(f'  [{ph}] {q[:95]}')
print()

# --- 5. Duplicate questions inside the JSON ---
dups = {q: c for q, c in dup_check.items() if c > 1}
print(f'=== Duplicate questions in JSON: {len(dups)} ===')
for q, c in dups.items():
    print(f'  x{c} {q[:95]}')
print()

# --- 6. Per-module coverage table ---
print('=== Per-module coverage ===')
for ph in d['phases']:
    for m in ph['modules']:
        keys = []
        for q in m.get('research', {}).get('interviewFocus', []):
            keys.append(q)
        for st in m.get('subTopics', []):
            for q in st.get('research', {}).get('interviewFocus', []):
                keys.append(q)
        pool = bank_a_qs if m['id'][0] == 'A' else bank_b_qs
        miss = sum(1 for q in keys if not prefix_match(q, pool))
        flag = 'OK' if miss == 0 else f'!! {miss} missing'
        print(f'  {m["id"]} {m["title"][:45]:47} {len(keys):3} Qs  {flag}')

total_missing = len(missing)
print()
print('RESULT:', 'ALL COVERED ✅' if total_missing == 0 and not orphans else f'{total_missing} missing, {len(orphans)} orphans ❌')
