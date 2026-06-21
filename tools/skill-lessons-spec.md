# Authoring a "Doing ML for Real" skill lesson

You write ONE self-contained file: `lessons/concept-<id>.js`. It registers a lesson, its
code, and its visualization. These are PRACTITIONER SKILL lessons — the goal is to make
the reader genuinely expert: concrete methods, the math/stats behind them, the real
libraries, runnable code, and a real-data chart. Same rigor as the algorithm lessons.

Read first for conventions and quality bar:
- `lessons/09-classical-a.js` → the `cls-gradient-boosting` lesson object (field schema,
  `whenToUse` + `pitfalls` style, HTML tone).
- `lessons/codeviz-03-deeplearning.js` → CODEVIZ chart-spec shapes: scatter
  `groups:[{name,color,points:[[x,y]]}]`; line `series:[{name,color,points:[[x,y]]}]`;
  bars `{type:"bars",title,labels:[...],values:[...],valueLabels:[...],colors:[...]}`.
- `lessons/code-02-ml.js` → a `window.CODE[id]` entry shape (`{lib, code, explain, runnable}`).

## File skeleton
```
(function () {
  window.LESSONS.push({
    id: "<ID>",
    title: "<TITLE>",
    tagline: "<one punchy sentence>",
    module: "Doing ML for Real — the skills that matter (2026)",
    prereqs: [<existing lesson ids this skill builds on>],
    whenToUse: `...`,     // "When to reach for it" — why this skill is make-or-break + when it applies
    playbook: `...`,      // THE CORE: a numbered <ol> — the concrete method, each step names the real technique
    application: `...`,   // where this shows up across real ML work
    pitfalls: `...`,      // "Red flags" — anti-patterns and their tells, <ul> of bolded-lead bullets
    checklist: `...`,     // copy-paste <ul> the reader runs on their own project
    bigIdea: `...`, buildup: `...`,
    symbols: [ { sym:"$...$", desc:"..." }, ... ],
    formula: `$$ ... $$`, whatItDoes: `...`,   // the KEY math/stat of this skill (cost formula, KS stat, conformal coverage, CV variance, PSI, etc.)
    derivation: `...`,    // why the math/method works
    example: `...`,       // a concrete worked numeric example
    demo: function (host) { ... },   // OPTIONAL — a small theme-aware canvas/Charts demo; skip if not natural
    practice: [ { q:`...`, steps:[{do:`...`, why:`...`}], answer:`...` }, ... ]   // judgment AND coding scenarios
  });
  window.CODE["<ID>"] = {
    lib: "<the real library, e.g. scikit-learn / cleanlab / evidently / fairlearn / MAPIE>",
    runnable: false,                 // these libs need a real Python runtime, not the in-browser one
    explain: `<p>...one or two sentences framing the code...</p>`,
    code: `<runnable Python using the REAL libraries named in the lesson>`
  };
  window.CODEVIZ["<ID>"] = {
    question: "...",
    charts: [ { type:"line|bars|scatter", title, xlabel, ylabel, <series|bars|groups> } ],
    caption: "...",
    code: `<Python that COMPUTES the plotted numbers on a REAL sklearn dataset, sklearn/numpy only>`
  };
})();
```

## The page renders sections in this order (so write to fit):
1 Title + tagline → 2 "When to reach for it" (whenToUse) → 3 "The playbook" (playbook) →
4 "Where it's used" (application) → 5 "Implement it in code" (CODE) → 6 "Visualize…" (CODEVIZ) →
7 "Production pitfalls" (pitfalls) → 8 "Your checklist" (checklist) →
9 "Under the hood" (bigIdea, buildup, symbols, formula, derivation, example — always visible) →
10 demo → 11 practice.

## Content rules
- `playbook` is the heart: a real, ordered method a practitioner follows, each step naming the
  actual technique/function — not vague advice. Use `<ol><li>`.
- `CODE.code` uses the REAL ecosystem libraries for the skill (cleanlab, evidently, fairlearn,
  MAPIE, great_expectations, river, nannyml, etc.) even though `runnable:false`. Show the real API.
- `CODEVIZ.code` must compute the plotted numbers by running numpy + scikit-learn on a REAL
  bundled sklearn dataset (load_breast_cancer, load_digits, load_wine, load_iris, load_diabetes) —
  NO make_blobs/synthetic, NO non-sklearn libs (it has to be reproducible in-browser). Subsample
  to <= 60 plotted points. Embedded chart numbers must be plausible outputs of that code.
- Under-the-hood fields carry the real MATH of the skill (give a formula and define every symbol
  in plain English).

## HARD CONVENTIONS
1. Teaching fields are HTML strings — `<p>`, `<b>`, `<i>`, `<ul>/<ol><li>`, `<code>`. Short, plain sentences.
2. Math in `$...$` / `$$...$$`; inside JS strings DOUBLE every backslash (`\\sigma`, `\\sum`, `\\Sigma`, `\\alpha`).
3. NEVER a raw "<" before a letter/number in prose — write `&lt;` (e.g. "p &lt; 0.05"). ">" is fine.
4. Expand every abbreviation on first use in parentheses — "AUC (Area Under the Curve)",
   "PSI (Population Stability Index)", "CV (Cross-Validation)", "FN (False Negative)".
5. Run `node --check lessons/concept-<id>.js` and fix any error.

Report: the lesson id, the dataset used in CODEVIZ, the libraries named in CODE, and node --check result.
