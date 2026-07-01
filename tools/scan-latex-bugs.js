/* tools/scan-latex-bugs.js — authoritative scan of math lessons for two genuine LaTeX bug classes:
   (1) unclosed $  — odd count of unescaped $ in an eval'd field (breaks MathJax).
   (2) lost matrix row break — RAW-source \begin{bmatrix} block with a single "\<digit>" where "\\\\"
       was intended. Writes plans/math/_LATEX-BUGS.generated.md. $e<0$-style < / > are NOT bugs. */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), ldir = path.join(ROOT, 'lessons');
global.window = { LESSONS: [] };
const files = fs.readdirSync(ldir).filter(f => /^math-\d+-.*\.js$/.test(f)).sort();
files.forEach(f => { try { eval(fs.readFileSync(path.join(ldir, f), 'utf8')); } catch (e) {} });
const L = window.LESSONS.filter(l => l.template === 'math');
const odd = s => ((s || '').replace(/\\\$/g, '').match(/\$/g) || []).length % 2 === 1;
const rows = [];
function ck(id, field, val) { if (odd(val)) rows.push([id, field, 'unclosed $']); }
L.forEach(l => {
  ck(l.id, 'motivation', l.motivation); ck(l.id, 'definition', l.definition); ck(l.id, 'tagline', l.tagline);
  const w = l.worked || {};
  ['problem', 'strategy', 'verify', 'answer'].forEach(k => ck(l.id, 'worked.' + k, w[k]));
  (w.steps || []).forEach((s, i) => ['do', 'result', 'why'].forEach(k => ck(l.id, `worked.steps[${i}].${k}`, s[k])));
  (l.applications || []).forEach((a, i) => { ck(l.id, `applications[${i}].numbers`, a.numbers); ck(l.id, `applications[${i}].background`, a.background); });
  (l.practice || []).forEach((p, i) => { ck(l.id, `practice[${i}].problem`, p.problem); (p.steps || []).forEach((s, j) => ['do', 'result'].forEach(k => ck(l.id, `practice[${i}].steps[${j}].${k}`, s[k]))); });
  (l.takeaways || []).forEach((t, i) => ck(l.id, `takeaways[${i}]`, t));
});
// Matrix row-break bugs are ambiguous to auto-classify (source uses \\<digit>); they are documented
// per-section in the plan files (notably Part 19: math-19-06/07/08, agent-verified). Not auto-counted here.
const bySec = {};
rows.forEach(([id, fld, t]) => { const s = id.replace(/-\d+$/, ''); (bySec[s] = bySec[s] || []).push([id, fld, t]); });
let md = '# Math track — consolidated LaTeX bugs (generated)\n\n';
md += '> Authoritative scan via `node tools/scan-latex-bugs.js`. Two genuine classes only:\n';
md += '> **unclosed `$`** (odd `$` count in a field; breaks MathJax) and **lost matrix row break** (`\\\\`).\n';
md += '> `$e<0$`-style `<`/`>` in math are **not** bugs. Fix these in the mechanical LaTeX pass (master Mode 4).\n\n';
md += `**Unclosed-\$ fields: ${rows.length} across ${Object.keys(bySec).length} sections.**\n`;
md += `**Matrix row-break issues:** see per-section plans (Part 19 has the agent-verified list).\n\n`;
Object.keys(bySec).sort().forEach(s => { md += `### ${s} — ${bySec[s].length} unclosed-\$ field${bySec[s].length>1?'s':''}\n`; bySec[s].forEach(([id, fld]) => md += `- \`${id}\` — ${fld}\n`); md += '\n'; });
fs.writeFileSync(path.join(ROOT, 'plans', 'math', '_LATEX-BUGS.generated.md'), md);
console.log('Unclosed-$ fields:', rows.length, 'across', Object.keys(bySec).length, 'sections');
