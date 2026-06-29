# Lesson expansion spec — teach a newcomer thoroughly

Goal: expand under-explaining lessons so a COMPLETE NEWCOMER to machine learning can
follow them easily. Long is good — "more the merrier." Don't just state concepts, theories,
and formulas: SHOW them with plain-English intuition, worked numbers, example data, HTML
tables, and (where it genuinely helps) a canvas chart. Lessons may legitimately differ in
length — complex concepts deserve more.

You are given lesson id(s) and the file(s) they live in. Work lesson by lesson.

## PER LESSON

### 1. Read everything first
Read the lesson object (ALL fields), `window.CODE[id]`, `window.CODEVIZ[id]`, and
`window.WALKTHROUGHS[id]`. Understand what is taught and WHERE the explanation is thin.

### 2. Judge whether it explains enough
Thin signals: the intuition / big-idea / concept is only 1–3 sentences; a formula is stated
with no plain-English unpacking or derivation; a symbol is used before it is defined in words;
no concrete numbers; a leap in reasoning a newcomer couldn't follow. If a lesson is ALREADY
thorough (most `paper` lessons are long and complete), make only small targeted fixes — do
NOT pad it. Spend your effort where the gap is real.

### 3. Expand the TEACHING fields (never the code/structure)
- **Intuition first.** Open with a jargon-free explanation and a concrete analogy. Define
  EVERY symbol in plain words before it is used.
- **Build up gradually.** Motivate the problem → the idea → the formula → why the formula
  works (a short derivation or worked reasoning, not just the result).
- **Show numbers.** Add at least one fully worked numeric example with small concrete inputs,
  arithmetic shown step by step in a `<ul class="steps">` (one step per `<li>`).
- **Show data / tables.** Wherever there is tabular data, a comparison, a before/after, or a
  per-class / per-step breakdown, render an HTML `<table class="extable">` (textbook style:
  `<thead>`; numeric cells `class="num"`; row labels `class="row-h"`; optional `<caption>`).
- Keep the existing worked `example` field (it already has real numbers + a table). Add depth
  in the OTHER fields — do not shrink `example` to compensate.

Which fields to grow, by lesson type:
- **concept** (foundational — prob/ai/dl/ml/linalg/etc.): expand `bigIdea`, `buildup`,
  `whatItDoes`; ADD a `derivation` field if absent (step-by-step "why it's true" with numbers);
  enrich `whenToUse` / `pitfalls` only if thin.
- **paper** (`l.paper` set): expand only genuinely thin sections (`problem`, `contribution`,
  `walkthrough`, `architecture`, `derivation`, `whatItDoes`, `results`, `evaluation`,
  intuition). Most are already complete — touch lightly.
- **pytorch** (`l.template === "pytorch"`): expand `concept`, the `explain` text inside
  `codeTour` steps, `expected`, and `deeper`.

### 4. Charts — only where they genuinely help
If a concept clearly needs a visual it lacks (a distribution shape, a decision boundary, a
loss curve, a confusion matrix, a comparison bar chart, an ROC), ADD a chart to
`window.CODEVIZ[id].charts` (create the CODEVIZ entry as `{ charts: [...] }` if missing; if it
exists, push to its `charts` array). Use ONLY these spec shapes (from `lessons/charts.js`):
- bars/hist: `{ type:"bars", labels:[...], values:[...], valueLabels?:[...], colors?:[...] }`
- line: `{ type:"line", xlabel?, ylabel?, series:[ {name, color, points:[[x,y],...]} ] }`
- scatter: `{ type:"scatter", xlabel?, ylabel?, groups:[ {name,color,points:[[x,y]]} ], lines?:[ {color,dash?,points:[[x,y]]} ] }`
- roc: `{ type:"roc", auc?, points:[[fpr,tpr],...] }`
- confusion: `{ type:"confusion", labels:[...], matrix:[[...],...] }`
- heatmap: `{ type:"heatmap", rows?:[...], cols?:[...], matrix:[[...]], showVals? }`

Every new chart MUST have a `title` and an `interpret` (1–2 plain-English sentences: how to
read it). Use real, correct numbers. Colors are hex strings (e.g. `"#4ea1ff"`, `"#7ee787"`,
`"#ffb454"`, `"#c89bff"`). Do not exceed ~6 charts per lesson and do not duplicate an existing
chart. If no chart genuinely helps, add none — text + tables are enough.

## CONVENTIONS (hard)
- Edit fields IN PLACE; keep the existing assignment form (`window.LESSONS.push({...})`, or the
  `L({...})` helper in numbered files, or `window.CODEVIZ[ID] = {...}`). Do NOT change `id`,
  `prereqs`, `module`, or `title`, and do NOT remove fields.
- HTML strings: math in `$...$` with DOUBLED backslashes (e.g. `$\\bar{x}$`). NEVER an HTML
  entity inside math — use `\\lt` / `\\gt`. In prose, never a raw `<` before a letter/number —
  use `&lt;`. In a `` `template literal` ``: never let `$` be immediately followed by `{`, and
  never put a backtick inside it (use `"..."` for new strings).
- Arithmetic must be correct — recompute every sum/mean/product. Do not fabricate benchmark or
  paper numbers; reuse the lesson's own, or mark a value illustrative.

## VERIFY (per file, before reporting)
- `node --check <file>` MUST pass.
- The file still has the SAME number of lesson blocks and the SAME lesson ids.
- Any chart you added literally matches one of the spec shapes above (correct keys).

## REPORT
One short line per lesson: what you expanded (which fields) + whether you added a chart.
e.g. "ok prob-bayes: expanded bigIdea+buildup with coin-test intuition, added derivation with
worked posterior table, added a bars chart of prior vs posterior; node --check pass."
