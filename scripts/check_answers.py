import ast
import os

HERE = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(HERE, 'gen_answer_bank_a.py'), encoding='utf-8').read()
tree = ast.parse(src)
for node in ast.walk(tree):
    if isinstance(node, ast.Assign):
        for t in node.targets:
            if isinstance(t, ast.Name) and t.id == 'ANSWERS':
                dct = ast.literal_eval(node.value)
                for mid, lst in dct.items():
                    bad = [(i, len(tup), str(tup[0])[:55]) for i, tup in enumerate(lst) if len(tup) != 4]
                    if bad:
                        print(f'{mid}:')
                        for i, ln, q in bad:
                            print(f'   [{i}] len={ln} :: {q}')

