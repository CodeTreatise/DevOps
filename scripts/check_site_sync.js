const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const s = fs.readFileSync(path.join(ROOT, 'website', 'data.js'), 'utf8');
eval(s.replace('window.PATH_DATA =', 'var PATH_DATA ='));
const j = JSON.parse(fs.readFileSync(path.join(ROOT, 'curriculum', 'Platform-Engineering-Path.json'), 'utf8'));

function summarize(d) {
  const out = {};
  for (const k of Object.keys(d)) {
    const v = d[k];
    if (Array.isArray(v)) out[k] = 'array[' + v.length + ']';
    else if (v && typeof v === 'object') out[k] = summarize(v);
    else out[k] = typeof v;
  }
  return out;
}
const s1 = JSON.stringify(summarize(PATH_DATA));
const s2 = JSON.stringify(summarize(j));
console.log('data.js === JSON structurally:', s1 === s2);
if (s1 !== s2) {
  for (let i = 0; i < Math.min(s1.length, s2.length); i++) {
    if (s1[i] !== s2[i]) {
      console.log('DIFF at char', i);
      console.log('data.js:', s1.slice(i - 60, i + 60));
      console.log('JSON   :', s2.slice(i - 60, i + 60));
      break;
    }
  }
}

function qs(d) {
  const all = [];
  for (const ph of d.phases) for (const m of ph.modules) {
    for (const q of (m.research || {}).interviewFocus || []) all.push(q);
    for (const st of m.subTopics || []) for (const q of (st.research || {}).interviewFocus || []) all.push(q);
  }
  return all;
}
const a = qs(PATH_DATA), b = qs(j);
console.log('Qs data.js:', a.length, '| Qs JSON:', b.length, '| identical:', JSON.stringify(a) === JSON.stringify(b));

// Also compare subtopic names/ids and items
function subTopics(d) {
  const out = [];
  for (const ph of d.phases) for (const m of ph.modules) {
    for (const st of m.subTopics || []) out.push(m.id + '/' + st.id + ':' + (st.items || []).length);
  }
  return out;
}
const st1 = subTopics(PATH_DATA), st2 = subTopics(j);
console.log('SubTopics identical:', JSON.stringify(st1) === JSON.stringify(st2), '(', st1.length, ')');
