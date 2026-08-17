import ast

# Validate Phase B answer modules: every entry must be a 3- or 4-tuple
# (question, answer, rubric[, why]) matching the Phase A convention.
# 4-field entries are checked for emptiness of the 'why'; all entries are
# checked against the JSON question list by the generator at build time.
import importlib
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

bad = 0
total = 0
for mod in ('ans_bank_b1', 'ans_bank_b2', 'ans_bank_b3'):
    m = importlib.import_module(mod)
    for mid, lst in m.ANSWERS.items():
        for i, tup in enumerate(lst):
            total += 1
            if len(tup) not in (3, 4):
                bad += 1
                print(f'{mid}[{i}] len={len(tup)} :: {str(tup[0])[:55]}')
                continue
            if len(tup) == 4 and not tup[3].strip():
                bad += 1
                print(f'{mid}[{i}] empty why :: {str(tup[0])[:55]}')
print(f'Phase B check: {total} entries, {"OK" if bad == 0 else str(bad) + " BAD"}')
