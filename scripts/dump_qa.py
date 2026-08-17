import json
import os
import sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
d = json.load(open(os.path.join(ROOT, 'curriculum', 'Platform-Engineering-Path.json'), encoding='utf-8'))
want = sys.argv[1] if len(sys.argv) > 1 else 'A'
for p in d['phases']:
    if p['id'] != want:
        continue
    for m in p['modules']:
        print(f"===== {m['id']} {m['title'][:45]} =====")
        for s in m.get('subTopics', []):
            qs = s.get('research', {}).get('interviewFocus', [])
            if qs:
                print(f"  [{s['name'][:38]}]")
                for q in qs:
                    print(f"    Q: {q}")
        mq = m.get('research', {}).get('interviewFocus', [])
        if mq:
            print("  [MODULE research]")
            for q in mq:
                print(f"    Q: {q[:110]}")
        print()
