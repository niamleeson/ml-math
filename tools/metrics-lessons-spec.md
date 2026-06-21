# Authoring a "Metrics & Evaluation" lesson (BEGINNER audience)

You write ONE self-contained file `lessons/concept-<id>.js`. The reader is a COMPLETE
BEGINNER, so teach gently: build intuition first, then the formula, define EVERY symbol
and term in plain English, use a small concrete number example. But still be complete and
correct — this is the reference a learner becomes an expert from.

Read first:
- `lessons/09-classical-a.js` → `cls-gradient-boosting` for field schema + `whenToUse`/`pitfalls` style.
- `lessons/02-ml.js` → `ml-roc-auc` / `ml-classification-metrics` for tone on metrics.
- `lessons/codeviz-02-ml.js` and `codeviz-03-deeplearning.js` → CODEVIZ chart shapes: bars
  `{type:"bars",labels:[...],values:[...],valueLabels:[...],colors:[...]}`; line `series:[{name,color,points:[[x,y]]}]`;
  scatter `groups:[{name,color,points}]`; heatmap/roc/confusion types also exist (see charts.js).
- `lessons/code-02-ml.js` → a `window.CODE[id]` entry shape.

## File skeleton
```
(function () {
  window.LESSONS.push({
    id: "<ID>", title: "<TITLE>", tagline: "<one plain sentence>",
    module: "Metrics & Evaluation — measuring models, data & statistics",
    prereqs: [<existing ids you VERIFY by grepping window.LESSONS; e.g. ml-classification-metrics, ml-roc-auc, prob-normal, prob-estimation, and sibling met-* ids; use [] if unsure>],
    whenToUse: `...`,     // "When to reach for it" — WHICH metric to use WHEN, and which to avoid
    application: `...`,   // where these metrics show up in real work
    pitfalls: `...`,      // <ul> of the classic ways each metric misleads + the fix
    bigIdea: `...`, buildup: `...`,
    symbols: [ { sym:"$...$", desc:"plain-English meaning" }, ... ],
    formula: `$$ ... $$`, whatItDoes: `...`,   // the core formula(s) of the family, explained simply
    derivation: `...`,    // why the formula measures what it claims (gentle)
    example: `...`,       // a tiny worked numeric example a beginner can follow
    demo: function (host) { ... },   // OPTIONAL theme-aware canvas/Charts demo
    practice: [ { q:`...`, steps:[{do:`...`, why:`...`}], answer:`...` }, ... ]
  });
  window.CODE["<ID>"] = {
    lib: "scikit-learn",     // (or scipy / statsmodels / torchmetrics / numpy — the REAL function for these metrics)
    runnable: false,
    explain: `<p>...one or two sentences...</p>`,
    code: `<real Python using the ACTUAL metric functions, e.g. sklearn.metrics.*, scipy.stats.*, statsmodels, torchmetrics>`
  };
  window.CODEVIZ["<ID>"] = {
    question: "...",
    charts: [ { type:"bars|line|scatter|roc|confusion|heatmap", title, xlabel, ylabel, <...> } ],
    caption: "...",
    code: `<Python that COMPUTES the plotted numbers on a REAL dataset, numpy + scikit-learn/scipy ONLY>`
  };
})();
```

## Page render order: title/tagline → whenToUse → (where used) → CODE → CODEVIZ → pitfalls →
## "Under the hood" (bigIdea, buildup, symbols, formula, derivation, example — always visible) → demo → practice.

## Content rules
- BEGINNER tone: define the term, give an everyday analogy, then the formula, then a number example.
- COVER THE WHOLE FAMILY assigned to you — list and define each metric named in your brief, don't skip any.
- `CODE.code` uses the REAL functions practitioners call (sklearn.metrics, scipy.stats, statsmodels,
  torchmetrics) — so the Colab notebook teaches the real API.
- `CODEVIZ.code` computes the plotted numbers from a REAL dataset using numpy + scikit-learn/scipy ONLY
  (so it renders in-browser). Prefer the bundled real datasets: load_breast_cancer, load_digits, load_wine,
  load_iris, load_diabetes. For text/forecasting families with no bundled dataset, use small REAL examples
  (real sentences; a real published series) computed with numpy. Subsample to <= 60 plotted points; embedded
  chart numbers must be plausible real outputs.
- Under-the-hood carries the real MATH (give the formula, define every symbol).

## HARD CONVENTIONS
1. Teaching fields are HTML — `<p>`, `<b>`, `<i>`, `<ul>/<ol><li>`, `<code>`. Short, plain sentences.
2. Math in `$...$`/`$$...$$`; inside JS strings DOUBLE every backslash (`\\hat`, `\\sum`, `\\frac`, `\\sigma`, `\\log`).
3. NEVER a raw "<" before a letter/number in prose — write `&lt;` (e.g. "p &lt; 0.05"). ">" is fine.
4. Expand every abbreviation on first use — "AUC (Area Under the Curve)", "MAE (Mean Absolute Error)",
   "KL (Kullback–Leibler)", "PSI (Population Stability Index)".
5. Run `node --check lessons/concept-<id>.js` and fix any error.

Report: lesson id, the metrics covered, CODEVIZ dataset, libraries in CODE, node --check result.
