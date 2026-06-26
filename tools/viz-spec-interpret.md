# Diagram spec — high quality + interpretation + "what else you might see"

You REWRITE the "Visualize" card of ONE lesson so it teaches the reader how to READ diagrams
for this concept. Three requirements, all mandatory:

1. **High quality.** Clear titles; axes labelled (`xlabel`/`ylabel` for line/scatter);
   real numbers where computable, clearly-illustrative numbers otherwise (say so). No clutter.
2. **Interpretation under EVERY diagram.** Each chart gets an `interpret` field (an HTML
   string) rendered directly below it: in plain English, how to read THIS chart — what the
   axes mean, what the shape/colour is telling you, and what to conclude. 2–4 sentences.
3. **Show 2+ OTHER diagrams you might see — not just the ideal one.** The `charts` array must
   contain the canonical/healthy diagram PLUS at least two VARIANTS the reader could actually
   encounter for this same concept, each with its own `interpret` explaining how to recognise
   it and what it means. This is the most important part. Examples of variant sets:
   - a learning curve: healthy convergence / overfitting (val turns up) / underfitting
     (both stay high) / diverging (loss explodes);
   - an ROC curve: strong (bows to top-left) / near-random (hugs diagonal) / a curve that
     crosses the diagonal (worse than chance in a region);
   - a confusion matrix: balanced-accurate / high-precision-low-recall / majority-class
     collapse on imbalanced data;
   - a distribution/histogram: normal / skewed / bimodal / heavy outlier;
   - a scatter/fit: good linear fit / heteroscedastic fan / non-linear pattern a line misses;
   - a gradient/optimisation path: smooth descent / oscillating (LR too high) / stuck on a
     plateau. Pick variants that fit the lesson's concept.
   Total charts: aim for 3–5 (ideal + 2–4 variants). Do not pad beyond what teaches.

## STEP 1 — READ THE LESSON
Open the file, find the lesson by id, read `formula`, `whatItDoes`, `walkthrough`,
`example`, `pitfalls`. Decide the ONE core thing its diagram should show, then the realistic
variants/failure-modes a practitioner sees.

## STEP 2 — BUILD THE CHARTS
Chart types (renderer supports ONLY these): `bars`/`hist`, `line`, `scatter`, `heatmap`,
`roc`, `confusion`. Schemas:
- line `{type:"line", xlabel, ylabel, series:[{name,color,points:[[x,y],...]}], interpret}`
- bars `{type:"bars", labels:[...], values:[...], valueLabels?:[...], colors?:[...], interpret}`
  (multi-series: `{type:"bars", series:[{name,color,points:[[x,y]]}], labels:[...]}`)
- scatter `{type:"scatter", xlabel, ylabel, groups:[{name,color,points:[[x,y]]}], lines:[{color,dash,points:[[x,y]]}], interpret}`
- heatmap `{type:"heatmap", rows:[...], cols:[...], matrix:[[...]], showVals:true, interpret}`
- roc `{type:"roc", auc, points:[[fpr,tpr],...], interpret}` (axes auto-labelled TPR/FPR)
- confusion `{type:"confusion", labels:[...], matrix:[[...]], interpret}` (rows=actual, cols=predicted)
Every chart needs a `title` (names the case, e.g. "Overfitting: val loss turns back up") and
an `interpret`. Use real computed numbers for the main chart; variants may be illustrative
shapes (state "illustrative" in their interpret) but must be qualitatively honest.

## STEP 3 — WRITE THE CODEVIZ
Keep `question` (a one-line hook) and `code` (a runnable snippet for the MAIN chart; it does
NOT need to generate the illustrative variants). You MAY shorten or drop the card-level
`caption` since each chart now self-explains. Set `charts` to your ideal+variants array.

WRITE TARGET (you are told which applies):
- **Inline lesson** (a `concept-*.js` file): edit it IN PLACE — find `window.CODEVIZ["<id>"]`
  (or `window.CODEVIZ[ID]`) and replace `question`/`charts`/`caption`/`code` only. Leave the
  lesson object (`window.LESSONS.push`) and `window.CODE` block untouched. Keep the existing
  assignment form (if it uses `ID`, keep `ID`).
- **Shared-file lesson**: write a fragment `/tmp/vizfrag2/<id>.js` containing exactly one
  `window.CODEVIZ["<id>"] = { question, charts, caption, code };` assignment. Do NOT edit the
  codeviz-*.js files — the orchestrator assembles fragments.

## CONVENTIONS (hard)
- `title`, `xlabel`, `ylabel`, `labels`, chart-data are PLAIN strings/numbers (no LaTeX).
- `interpret` is an HTML string (you may use `<b>`), plain English, no LaTeX/MathJax.
- `code` is a JS template literal: NEVER let `$` be immediately followed by `{`; NEVER put a
  backtick inside it.
- Colours: "#4ea1ff" blue, "#7ee787" green, "#ffb454" orange, "#c89bff" purple, "#ff7b72"
  red, "#9aa7b4" grey. Use green for healthy/good, red/orange for problem cases.
- `points` are `[[x,y],...]` numbers; `roc.points` start [0,0] end [1,1].

## STEP 4 — VERIFY
Run `node --check` on the file you wrote (fragment or concept file) — MUST pass. A fragment
must be exactly one `window.CODEVIZ["<id>"] = {...};`. An inline edit must keep exactly one
`window.LESSONS.push`, one `window.CODE[...]`, one `window.CODEVIZ[...]`.

## STEP 5 — REPORT (ONE short line)
e.g. "ok <id>: 4 charts (ideal + overfit/underfit/diverging), each interpreted, node --check pass".
Keep it to a single line — do not write a long report.
