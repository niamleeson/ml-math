# Authoring a "Feature Engineering" lesson (from Zheng & Casari's book)

You write ONE self-contained file `lessons/concept-<id>.js` for one concept from
*Feature Engineering for Machine Learning* (Alice Zheng & Amanda Casari, O'Reilly 2018).
Teach the concept FAITHFULLY to the book — its framing, its examples, its datasets — at a
level that makes a beginner an expert. Same lesson structure as the other technique lessons.

Read first for schema & conventions:
- `lessons/09-classical-a.js` → `cls-gradient-boosting` (field schema, whenToUse/pitfalls style).
- `lessons/02-ml.js` → `ml-regression-metrics` for tone.
- `lessons/codeviz-02-ml.js` → CODEVIZ chart shapes: bars `{type:"bars",labels,values,valueLabels,colors}`;
  line `series:[{name,color,points:[[x,y]]}]`; scatter `groups:[{name,color,points}]`; hist/heatmap exist too.

## File skeleton
```
(function () {
  window.LESSONS.push({
    id: "<ID>", title: "<TITLE>", tagline: "<one plain sentence>",
    module: "Feature Engineering (Zheng & Casari)",
    prereqs: [<existing ids you VERIFY by grepping window.LESSONS; e.g. ml-pca, ml-kmeans, la-svd, fnd-eigen, dl-conv, met-distribution, and sibling fe-* ids; [] if unsure>],
    whenToUse: `...`,     // when to reach for this transform vs alternatives
    application: `...`,   // where it shows up in real pipelines (book's examples)
    pitfalls: `...`,      // <ul> of the book's caveats + the fix
    bigIdea: `...`, buildup: `...`,
    symbols: [ { sym:"$...$", desc:"plain-English meaning" }, ... ],
    formula: `$$ ... $$`, whatItDoes: `...`,
    derivation: `...`,    // why it works, the book's reasoning
    example: `...`,       // a tiny worked numeric example (use the book's numbers when given)
    demo: function (host) { ... },   // OPTIONAL theme-aware canvas/Charts demo
    practice: [ { q:`...`, steps:[{do:`...`, why:`...`}], answer:`...` }, ... ]
  });
  window.CODE["<ID>"] = {
    lib: "<pandas / scikit-learn / numpy / scipy — what the book uses>",
    runnable: false,
    explain: `<p>...frames the code; cite the book's dataset/example...</p>`,
    code: `<THE BOOK'S CODE EXAMPLE for this concept — faithful pandas/numpy/sklearn, on the book's dataset>`
  };
  window.CODEVIZ["<ID>"] = {
    question: "...",
    charts: [ { type:"...", title, xlabel, ylabel, <...> } ],
    caption: "...",
    code: `<Python that COMPUTES the plotted numbers on a REAL dataset, numpy + scikit-learn/scipy ONLY>`
  };
})();
```

## Page render order: title/tagline → whenToUse → (where used) → CODE → CODEVIZ → pitfalls →
## "Under the hood" (bigIdea, buildup, symbols, formula, derivation, example) → demo → practice.

## TWO-TRACK code rule (IMPORTANT — the user wants the book's code in the notebooks)
- `CODE.code` = **the book's actual code example** for this concept, written faithfully: same libraries
  (pandas, numpy, scikit-learn, scipy, matplotlib/seaborn) and the book's dataset (Yelp reviews /
  Online News Popularity / the relevant one). `runnable:false` (the dataset needs downloading), but the
  code must be correct and runnable in Colab once the dataset is loaded. Add a short comment noting where
  to get the dataset (the book's GitHub: github.com/alicezheng/feature-engineering-book). THIS CODE BECOMES
  THE LESSON'S COLAB NOTEBOOK, so make it a faithful, runnable reproduction of the book's example.
- `CODEVIZ.code` = a small REPRODUCIBLE in-browser chart using numpy + scikit-learn/scipy ONLY on a BUNDLED
  real dataset (load_breast_cancer / load_digits / load_wine / load_diabetes) OR a small REAL inline text
  corpus (for the text lessons, sklearn's CountVectorizer/TfidfVectorizer run in-browser on inline strings).
  It should illustrate the SAME concept as the book's example. Subsample to <= 60 points; embedded numbers
  must be plausible real outputs. The caption may note "the book uses <Yelp/News>; this is the same idea on
  a bundled dataset."

## HARD CONVENTIONS
1. Teaching fields are HTML — `<p>`, `<b>`, `<i>`, `<ul>/<ol><li>`, `<code>`. Short, plain sentences.
2. Math in `$...$`/`$$...$$`; inside JS strings DOUBLE every backslash (`\\lambda`, `\\log`, `\\tilde`, `\\sum`).
   NEVER put an HTML entity (`&lt;`/`&gt;`) inside `$...$` — use LaTeX `\\lt` / `\\gt` there.
3. NEVER a raw "<" before a letter/number in prose — write `&lt;`. ">" is fine.
4. Expand every abbreviation on first use — "tf-idf (term frequency–inverse document frequency)",
   "PCA (Principal Component Analysis)", "BoW (bag-of-words)".
5. Run `node --check lessons/concept-<id>.js` and fix any error.

Report: lesson id, the book chapter/concept, the book example reproduced in CODE, CODEVIZ dataset, node --check result.
