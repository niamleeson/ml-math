# Authoring a "cheat-sheet gap" lesson

You write ONE self-contained file `lessons/concept-<id>.js` for one ML/DL/AI concept that the
Stanford/MIT cheat sheets contain but the app does not yet teach. Match the existing lessons exactly
in structure and style. These join an EXISTING module (do NOT invent a new module name — use the exact
module string you are given).

Read first (for the field schema, voice, and chart shapes):
- `lessons/03-deeplearning.js` → an existing `dl-*` lesson (e.g. `dl-conv`, `dl-rnn`) for the field schema
  + whenToUse/pitfalls voice. (For a `la-*` lesson read `lessons/05-linalg.js` `la-jacobian`/`la-hessian` instead.)
- `lessons/codeviz-03-deeplearning.js` (or `codeviz-05-linalg.js`) → CODEVIZ chart shapes:
  line `series:[{name,color,points:[[x,y]]}]`; bars `{type:"bars",labels,values,valueLabels,colors}`;
  scatter `groups:[{name,color,points}]`; heatmap `{type:"heatmap",rows,cols,matrix,showVals}`.
- Grep `window.LESSONS` to VERIFY every id you put in `prereqs` actually exists.

## File skeleton
```
(function () {
  window.LESSONS.push({
    id: "<ID>", title: "<TITLE>", tagline: "<one plain sentence>",
    module: "<EXACT MODULE STRING GIVEN TO YOU>",
    prereqs: [<existing ids you VERIFY by grepping; [] if unsure>],
    whenToUse: `...`,     // when you reach for this idea vs the alternatives
    application: `...`,   // where it shows up in real model building
    pitfalls: `...`,      // <ul> of classic mistakes + the fix
    bigIdea: `...`, buildup: `...`,
    symbols: [ { sym:"$...$", desc:"plain-English meaning" }, ... ],   // define EVERY symbol in your formula
    formula: `$$ ... $$`, whatItDoes: `...`,   // THE formula from the cheat sheet — this is the point of the lesson
    derivation: `...`,    // derive / justify it; show why it is true
    example: `...`,       // a tiny concrete worked example with real numbers
    demo: function (host) { ... },   // OPTIONAL theme-aware canvas/Charts demo — omit if unsure
    practice: [ { q:`...`, steps:[{do:`...`, why:`...`}], answer:`...` }, ... ]
  });
  window.CODE["<ID>"] = {
    lib: "<NumPy / PyTorch — whatever fits>",
    runnable: false,        // these run in Colab, not the in-browser engine
    explain: `<p>...frames the code...</p>`,
    code: `<real, runnable, idiomatic code that demonstrates the concept; small data; PRINT informative output>`
  };
  window.CODEVIZ["<ID>"] = {
    question: "...",
    charts: [ { type:"line|bars|scatter|heatmap", title, xlabel, ylabel, <...> } ],
    caption: "...",
    code: `<Python (numpy preferred) that COMPUTES the plotted numbers — reproducible; RUN it and embed REAL numbers>`
  };
})();
```

## Page render order: title/tagline → whenToUse → (where used) → CODE → CODEVIZ → pitfalls →
## "Under the hood" (bigIdea, buildup, symbols, formula, derivation, example — the MATH, always visible) → demo → practice.

## Code rules — TWO TRACKS
- `CODE.code` = REAL, runnable code (numpy or PyTorch — torch/torchvision are preinstalled in Colab; never
  pip-install them). Build the tiny example, run it, PRINT informative output. `runnable:false`.
- `CODEVIZ.code` = a SMALL reproducible numpy computation that produces the plotted numbers AND illustrates
  the concept. Actually RUN it and embed the real numbers in the chart. Subsample to <= 60 points.

## HARD CONVENTIONS (these matter — a violation breaks the page)
1. Teaching fields are HTML — `<p>`, `<b>`, `<i>`, `<ul>/<ol><li>`, `<code>`. Short, plain sentences.
   Define every math term in plain English before using it.
2. Math in `$...$`/`$$...$$`; inside JS strings DOUBLE every backslash (`\\sum`, `\\nabla`, `\\prod`,
   `\\alpha`, `\\frac`, `\\top`, `\\mathbb{E}`, `\\operatorname`). NEVER an HTML entity inside `$...$` —
   write `\\lt`/`\\gt`, never `&lt;`/`&gt;` between the dollar signs (it crashes MathJax).
3. NEVER a raw "<" before a letter/number in PROSE — write `&lt;`. ">" in prose is fine.
4. Expand every abbreviation on first use — "CNN (Convolutional Neural Network)", "ResNet (Residual Network)",
   "FLOPs (Floating-Point Operations)", "LM (Language Model)", etc.
5. Run `node --check lessons/concept-<id>.js` and fix any error before reporting done.

Report: lesson id, the concept, the key formula, what CODE runs, the CODEVIZ illustration, node --check result.
