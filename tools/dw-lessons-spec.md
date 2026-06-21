# Authoring a "Data Wrangling" lesson

You write ONE self-contained file `lessons/concept-<id>.js` for one data-wrangling concept.
The reader is a learner becoming expert at the practical craft of turning messy raw data into a
clean, understood, well-presented dataset (the step BEFORE feature engineering). Use the same
lesson structure as the other technique lessons. Be practical and concrete — these are
hands-on pandas/EDA/plotting skills, not heavy math.

Read first:
- `lessons/09-classical-a.js` → `cls-gradient-boosting` for the field schema + whenToUse/pitfalls style.
- `lessons/concept-fe-binning.js` → a recent technique lesson for tone + the three registries.
- `lessons/codeviz-02-ml.js` → CODEVIZ chart shapes: bars `{type:"bars",labels,values,valueLabels,colors}`;
  line `series:[{name,color,points:[[x,y]]}]`; scatter `groups:[{name,color,points}]`; heatmap/hist also exist.

## File skeleton
```
(function () {
  window.LESSONS.push({
    id: "<ID>", title: "<TITLE>", tagline: "<one plain sentence>",
    module: "Data Wrangling",
    prereqs: [<existing ids you VERIFY by grepping window.LESSONS; e.g. skill-data-audit, met-distribution, met-association, met-forecasting, sibling dw-* ids; [] if unsure>],
    whenToUse: `...`,     // when this step matters / when to reach for this technique vs alternatives
    application: `...`,   // where it shows up in real data work
    pitfalls: `...`,      // <ul> of the classic mistakes + the fix (leakage, silent corruption, etc.)
    bigIdea: `...`, buildup: `...`,
    symbols: [ { sym:"$...$", desc:"..." }, ... ],   // light; only if the lesson has real formulas (imputation, IQR, correlation...)
    formula: `$$ ... $$`, whatItDoes: `...`,          // OPTIONAL — many wrangling lessons have little math; omit formula if none
    derivation: `...`,    // the reasoning / why it works
    example: `...`,       // a tiny concrete worked example (real numbers / a small table in words)
    demo: function (host) { ... },   // OPTIONAL theme-aware canvas/Charts demo
    practice: [ { q:`...`, steps:[{do:`...`, why:`...`}], answer:`...` }, ... ]
  });
  window.CODE["<ID>"] = {
    lib: "pandas",        // (or "pandas + scikit-learn" / "matplotlib + seaborn" / "pandas + plotly" as fits)
    runnable: false,
    explain: `<p>...frames the code...</p>`,
    code: `<real, idiomatic pandas/EDA/plotting code that performs this wrangling step end-to-end>`
  };
  window.CODEVIZ["<ID>"] = {
    question: "...",
    charts: [ { type:"...", title, xlabel, ylabel, <...> } ],
    caption: "...",
    code: `<Python that COMPUTES the plotted numbers on a REAL dataset — you may use pandas + numpy + sklearn + scipy>`
  };
})();
```

## Page render order: title/tagline → whenToUse → (where used) → CODE → CODEVIZ → pitfalls →
## "Under the hood" (bigIdea, buildup, symbols, formula?, derivation, example) → demo → practice.

## Code rules
- `CODE.code` is real, idiomatic code for the step — pandas for cleanup/EDA, matplotlib/seaborn (or
  plotly/altair) for presentation, sklearn where relevant (impute/outliers/pipelines). It becomes the
  lesson's Colab notebook, so make it a faithful, runnable end-to-end example on a named real-ish dataset
  (note where to get the dataset if it's not bundled). `runnable:false`.
- `CODEVIZ.code` computes the plotted numbers from a REAL dataset. You MAY use pandas + numpy + scikit-learn
  + scipy (it is run by YOU to get the numbers and shown as text / put in the notebook — it is NOT executed
  in the browser, so pandas is fine). Prefer bundled real data: `sklearn.datasets.load_*(as_frame=True)`
  (breast_cancer / wine / diabetes / digits / iris) or a small REAL inline table you define. ACTUALLY RUN it
  to get real embedded numbers. Subsample to <= 60 plotted points.
- The CODEVIZ chart should make the concept VISIBLE — e.g. missingness per column (bars), a distribution
  before/after cleaning, an outlier scatter, a correlation heatmap, a good-vs-bad chart, dtype memory, etc.

## HARD CONVENTIONS
1. Teaching fields are HTML — `<p>`, `<b>`, `<i>`, `<ul>/<ol><li>`, `<code>`. Short, plain sentences.
2. Any math in `$...$`/`$$...$$`; inside JS strings DOUBLE every backslash. NEVER an HTML entity
   (`&lt;`/`&gt;`) inside `$...$` — use LaTeX `\\lt`/`\\gt` there. Most of these lessons need little/no math.
3. NEVER a raw "<" before a letter/number in prose — write `&lt;`. ">" is fine.
4. Expand every abbreviation on first use — "EDA (Exploratory Data Analysis)", "PII (Personally
   Identifiable Information)", "IQR (Inter-Quartile Range)", "MCAR (Missing Completely At Random)".
5. Run `node --check lessons/concept-<id>.js` and fix any error.

Report: lesson id, the wrangling concept, what the CODE does, the CODEVIZ dataset + chart, node --check result.
