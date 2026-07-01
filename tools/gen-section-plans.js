/* tools/gen-section-plans.js
   Regenerates plans/math/math-part-NN-*.md (per-section explanation-quality worklists)
   and plans/math/_index-table.generated.md from the math lesson objects.
   Usage: node tools/gen-section-plans.js   (run from anywhere)
   Companion to plans/math-track-explanation-improvements.md. */
global.window = { LESSONS: [] };
const fs=require('fs'), path=require('path');
const ROOT=path.join(__dirname,'..');
const dir=path.join(ROOT,'lessons');
const files=fs.readdirSync(dir).filter(f=>/^math-\d+-.*\.js$/.test(f)).sort();
const slug={}; files.forEach(f=>{const m=f.match(/^(math-\d+)-(.*)\.js$/); slug[m[1]]=m[2];});
files.forEach(f=>{try{eval(fs.readFileSync(path.join(dir,f),'utf8'))}catch(e){console.error('ERR',f,e.message)}});
const L=window.LESSONS.filter(l=>l.template==='math');

// ---- helpers ----
const strip=s=>(s||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
const words=s=>strip(s).split(' ').filter(Boolean).length;
const odd=s=>((s||'').replace(/\\\$/g,'').match(/\$/g)||[]).length%2===1;
const cues=/\b(because|since|follows from|derive|derived|comes from|thus|therefore|hence|expand|substitut|so that|this gives|by the|which gives)/i;
const hasFormula=d=>/\$\$/.test(d)||/\$[^$]*=[^$]*\$/.test(d)||/\\(frac|dfrac|sum|int|nabla|prod|lim|sqrt|begin|langle|partial|hat|bar|operatorname)/.test(d||'');
const hasDisplay=d=>/\$\$/.test(d||'');
const stockOpeners=[
 "You already know how one-variable calculus studies a",
 "You already have the coordinate tools from the",
 "You already know that training means changing parameters",
 "You already know the graph picture: dots connected",
 "You already know that a model can fit",
 "You already have the core algebra and calculus.",
 "You have seen matrices act on vectors. Now"];
const opener=s=>strip(s).replace(/\$[^$]*\$/g,'§').split(' ').slice(0,8).join(' ');
const lidNum=id=>id.split('-').slice(-1)[0];

// ---- boilerplate groups (shared §5 title-set) ----
const blocks={};
L.forEach(l=>{const b=(l.applications||[]).map(a=>a.title||'').join('|'); if(b)(blocks[b]=blocks[b]||[]).push(l.id);});
const sharedSet=new Set(); const blockOf={};
Object.entries(blocks).forEach(([b,ids])=>{ if(ids.length>=2){ ids.forEach(id=>{sharedSet.add(id);blockOf[id]=b;}); }});

// group by section
const order=[]; const byMod={};
L.forEach(l=>{const k=l.id.replace(/-\d+$/,''); if(!byMod[k]){byMod[k]=[];order.push(k);} byMod[k].push(l);});

const esc=s=>(s||'').replace(/\|/g,'\\|');
const idx=[];
order.forEach(key=>{
  const ls=byMod[key];
  const sec=ls[0].module, book=ls[0].book||'';
  const N=ls.length;
  // per-lesson flags
  let c5=0,cmot=0,cform=0,cder=0,clatex=0,cExplain=0,cAuthor=0,cDeepen=0;
  const rows=ls.map(l=>{
    const def=l.definition||'', mot=l.motivation||'';
    const f5 = sharedSet.has(l.id);
    const stock = stockOpeners.some(o=>opener(mot).startsWith(o.split(' ').slice(0,6).join(' ')));
    const fmot = stock || words(mot)<=45;
    const hf=hasFormula(def), hd=hasDisplay(def), hc=cues.test(strip(def));
    const fform = hf && !hd;            // has a formula but not in display form
    let deriv, dershort;
    if(!hf){ deriv='explain-only (no derivable formula)'; dershort='explain-only'; cExplain++; }
    else if(hf && !hc){ deriv='AUTHOR full step-by-step'; dershort='AUTHOR'; cAuthor++; }
    else { deriv='deepen (cue present — verify completeness)'; dershort='deepen'; cDeepen++; }
    let flatex=false;
    if(odd(mot)||odd(def)) flatex=true;
    (l.applications||[]).forEach(a=>{if(odd(a.numbers)||odd(a.background))flatex=true;});
    (l.practice||[]).forEach(p=>(p.steps||[]).forEach(s=>{if(odd(s.result))flatex=true;}));
    if(f5)c5++; if(fmot)cmot++; if(fform)cform++; if(!hf||!hc){} if(flatex)clatex++;
    if(dershort!=='explain-only') cder++;
    return {id:l.id, title:l.title,
      s5: f5?'rewrite':'—',
      mot: fmot?'rewrite':'—',
      form: fform?'to-display':(hf?'—':'n/a'),
      deriv: dershort,
      latex: flatex?'FIX':'—'};
  });
  // systemic note
  const secBlocks={};
  ls.forEach(l=>{ if(sharedSet.has(l.id)){ secBlocks[blockOf[l.id]]=(secBlocks[blockOf[l.id]]||0)+1; }});
  const sysLines=Object.entries(secBlocks).sort((a,b)=>b[1]-a[1]).map(([b,n])=>{
    const titles=b.split('|').slice(0,6).join(' · ');
    return `  - **${n}/${N} lessons** share one §5 block — titles: _${esc(titles)}_. Rewrite each to use its own worked object.`;
  });
  // exemplar map (which sections have a full before/after in the master)
  const exemplar={
    'math-02':'master **E-1** (gradient — full derivation) and **C-1** (gradient — §5 rewrite)',
    'math-08':'master **C-2** (conditioning — §5 rewrite + LaTeX fix)',
    'math-15':'master **C-3** (graph Laplacian — derivation + §5 rewrite)',
    'math-17':'master **E-2** (Central Limit Theorem — full "why normal" derivation)',
    'math-19':'master **C-4** (stationary distributions — §5 rewrite + matrix fix)',
    'math-26':'master **C-5** (poles & zeros — motivation + §5 rewrite)'
  }[key];
  // pick author-first lesson: prefer the section's master-exemplar lesson; else a central boilerplate+AUTHOR lesson
  const exLesson={'math-02':'math-02-13','math-08':'math-08-06','math-15':'math-15-23','math-17':'math-17-38','math-19':'math-19-06','math-26':'math-26-06'}[key];
  const authorFirst = (exLesson&&rows.find(r=>r.id===exLesson)) || rows.find(r=>r.s5==='rewrite'&&r.deriv==='AUTHOR') || rows.find(r=>r.deriv==='AUTHOR') || rows.find(r=>r.s5==='rewrite') || rows[0];

  const partNo=key.split('-')[1];
  const fn=`math-part-${partNo}-${slug[key]}.md`;
  const priority = (c5>=Math.ceil(N*0.4)) ? 'HIGH (whole-section §5 rewrite)' : (clatex>0 ? 'MEDIUM (LaTeX + targeted rewrites)' : 'STANDARD (targeted deepening)');

  let md=`# Math · Part ${partNo} — ${sec}\n\n`;
  md+=`> **Per-section execution plan.** Load together with the master `;
  md+=`[\`../math-track-explanation-improvements.md\`](../math-track-explanation-improvements.md) — it holds the shared diagnosis, the **four exposition principles** (warm teacher's voice · complete step-by-step derivations · case-by-case · name every important symbol), the fix recipe, the structural fix, and the Definition of Done.\n`;
  md+=`> This file is the **worklist for this section only**; every count and flag below is generated from the lesson objects (reproduce via the master Appendix).\n\n`;
  md+=`**Section:** ${sec} · **Lessons:** ${N} · **Breadcrumb:** \`${book}\` · **Priority:** ${priority}\n\n`;
  md+=`## Scorecard (current defects)\n\n`;
  md+=`| Defect | Count |\n|---|---:|\n`;
  md+=`| §5 boilerplate (shared app-set with a sibling) | ${c5} / ${N} |\n`;
  md+=`| Templated / thin motivation (stock opener or ≤45 words) | ${cmot} / ${N} |\n`;
  md+=`| Key formula not in display form ($$…$$) | ${cform} / ${N} |\n`;
  md+=`| Unclosed-\`$\` LaTeX bug | ${clatex} / ${N} |\n`;
  md+=`| Derivation to author / deepen / explain-only | ${cAuthor} / ${cDeepen} / ${cExplain} |\n\n`;
  md+=`## Priority & systemic issues\n\n`;
  md+= (sysLines.length? sysLines.join('\n') : '  - No whole-section §5 boilerplate block detected; apply targeted deepening per the worklist.')+'\n';
  if(clatex>0) md+=`  - **${clatex}** lesson(s) carry an unclosed-\`$\` field — fix in the mechanical LaTeX pass first.\n`;
  md+=`\n## Author-first exemplar\n\n`;
  md+=`Start with **\`${authorFirst.id}\` — ${esc(authorFirst.title)}** as this section's pattern`;
  md+= exemplar? `; a fully-worked before→after already exists: ${exemplar}.\n` : `; follow the four principles + the master's worked exemplars (C-1…C-5, E-1/E-2) as the style guide.\n`;
  md+=`\n## Per-lesson worklist (all ${N})\n\n`;
  md+=`| Lesson | Title | §5 | Motiv | Formula | Derivation | LaTeX |\n|---|---|:--:|:--:|:--:|---|:--:|\n`;
  rows.forEach(r=>{ md+=`| \`${r.id}\` | ${esc(r.title)} | ${r.s5} | ${r.mot} | ${r.form} | ${r.deriv} | ${r.latex} |\n`; });
  md+=`\n**Legend.** §5 \`rewrite\` = replace boilerplate applications with ≥6 concept-specific, re-derivable uses · `;
  md+=`Motiv \`rewrite\` = open on a concrete stuck-problem (≥~45 words, no stock opener) · `;
  md+=`Formula \`to-display\` = promote the key inline formula to a \`$$…$$\` block and gloss every symbol; \`n/a\` = definitional lesson, no central formula · `;
  md+=`Derivation \`AUTHOR\` = write the complete step-by-step "why it's true"; \`deepen\` = a derivation cue exists, verify it is complete and warm; \`explain-only\` = no derivable formula, explain warmly (case-by-case — do **not** fake a proof) · `;
  md+=`LaTeX \`FIX\` = balance an unclosed \`$\` / repair a matrix row break.\n`;

  const outPath=path.join(ROOT,'plans','math',fn);
  const preserved = fs.existsSync(outPath) && /deep-authored/.test(fs.readFileSync(outPath,'utf8').slice(0,400));
  if(!preserved) fs.writeFileSync(outPath, md);
  idx.push({partNo, sec, fn, N, c5, cmot, cform, clatex, cAuthor, priority});
});

// index table for the master
let it=`| Part | Section | Lessons | §5 boilerplate | LaTeX bugs | Derivations to author | Plan |\n|---:|---|---:|---:|---:|---:|---|\n`;
idx.forEach(r=>{ it+=`| ${r.partNo} | ${r.sec} | ${r.N} | ${r.c5} | ${r.clatex} | ${r.cAuthor} | [\`math/${r.fn}\`](math/${r.fn}) |\n`; });
const tot=idx.reduce((a,b)=>({N:a.N+b.N,c5:a.c5+b.c5,clatex:a.clatex+b.clatex,cA:a.cA+b.cAuthor}),{N:0,c5:0,clatex:0,cA:0});
it+=`| — | **Total** | **${tot.N}** | **${tot.c5}** | **${tot.clatex}** | **${tot.cA}** | — |\n`;
fs.writeFileSync(path.join(ROOT,'plans','math','_index-table.generated.md'), it);
console.log('Wrote',idx.length,'section files to plans/math/');
console.log('Totals: lessons',tot.N,'| §5 boilerplate',tot.c5,'| LaTeX bugs',tot.clatex,'| derivations to author',tot.cA);
