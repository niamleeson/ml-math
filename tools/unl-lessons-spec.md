# Authoring a "Learning from Unlabeled Data" lesson

You write ONE self-contained file `lessons/concept-<id>.js` registering a TECHNIQUE lesson
(semi-supervised / self-supervised learning). Goal: make the reader genuinely expert —
the real method, its math, real PyTorch code, and a reproducible chart. Depth like the
algorithm lessons, not a soft overview.

Read first:
- `lessons/09-classical-a.js` → `cls-gradient-boosting` for field schema + `whenToUse`/`pitfalls` style.
- `lessons/03-deeplearning.js` → e.g. `dl-conv` / `dl-attention` for a deep-learning lesson's tone, demo style, symbols.
- `lessons/codeviz-03-deeplearning.js` → CODEVIZ chart shapes: line `series:[{name,color,points:[[x,y]]}]`;
  bars `{type:"bars",labels:[...],values:[...],valueLabels:[...],colors:[...]}`; scatter `groups:[{name,color,points}]`.
- `lessons/code-10-modern-b.js` → a `window.CODE[id]` entry shape (`{lib, code, explain, runnable}`).

## File skeleton
```
(function () {
  window.LESSONS.push({
    id: "<ID>", title: "<TITLE>", tagline: "<one punchy sentence>",
    module: "Learning from Unlabeled Data (semi- & self-supervised)",
    prereqs: [<existing ids you VERIFY by grepping window.LESSONS — e.g. dl-cross-entropy, dl-conv, mod-contrastive, dl-data-augmentation, dl-cosine-similarity, fs-metric-learning, fs-transfer-learning, and sibling unl-* ids>],
    whenToUse: `...`,        // "When to reach for it" — when this method fits vs alternatives
    application: `...`,      // where it's used in real systems
    pitfalls: `...`,         // <ul> of bolded-lead failure modes + fixes
    bigIdea: `...`, buildup: `...`,
    symbols: [ { sym:"$...$", desc:"..." }, ... ],
    formula: `$$ ... $$`, whatItDoes: `...`,   // the KEY loss/objective (NT-Xent/InfoNCE, consistency loss, sharpening, etc.)
    derivation: `...`,      // why the objective works (e.g. InfoNCE as a lower bound on mutual information)
    example: `...`,         // a small concrete numeric example
    demo: function (host) { ... },   // OPTIONAL theme-aware canvas/Charts demo; include if natural
    practice: [ { q:`...`, steps:[{do:`...`, why:`...`}], answer:`...` }, ... ]
  });
  window.CODE["<ID>"] = {
    lib: "PyTorch",            // (or "PyTorch + lightly")
    runnable: false,          // in-browser engine has no torch; THIS CODE IS REAL and RUNS ON A COLAB GPU
    explain: `<p>...one or two sentences...</p>`,
    code: `<faithful, runnable PyTorch implementing the core of the method — the loss/training step, not pseudocode>`
  };
  window.CODEVIZ["<ID>"] = {
    question: "...",
    charts: [ { type:"line|bars|scatter", title, xlabel, ylabel, <series|bars|groups> } ],
    caption: "...explain this is a reproducible sklearn proxy that demonstrates the same effect...",
    code: `<Python that COMPUTES the plotted numbers on a REAL sklearn dataset, sklearn/numpy ONLY>`
  };
})();
```

## Page render order: title/tagline → whenToUse → (where used) → CODE → CODEVIZ → pitfalls →
## "Under the hood" (bigIdea, buildup, symbols, formula, derivation, example — always visible) → demo → practice.

## Two-track code rule (IMPORTANT)
- `CODE.code` = REAL PyTorch for the actual method (e.g. the NT-Xent loss, the FixMatch pseudo-label
  step, the MoCo momentum update + queue). It does NOT run in the in-browser engine (`runnable:false`)
  but it MUST be correct and runnable on a Colab GPU — it becomes the lesson's Colab notebook.
- `CODEVIZ.code` = a small REPRODUCIBLE PROXY using ONLY numpy + scikit-learn on a REAL bundled
  sklearn dataset (load_digits / load_breast_cancer / load_wine), so it renders in-browser. It should
  demonstrate the METHOD'S PAYOFF, e.g.:
  * semi-supervised gains: `sklearn.semi_supervised.SelfTrainingClassifier` / `LabelSpreading` — accuracy
    vs number of labeled examples (few labels + unlabeled beats labels-only);
  * confidence-thresholded pseudo-labeling (FixMatch idea): accuracy vs confidence threshold;
  * representation quality / label-efficiency: linear-probe or k-NN accuracy vs label fraction using a
    representation that groups augmented views (PCA/NCA over noisy "augmented" digit copies) vs raw pixels;
  * contrastive matching (CPC idea): top-1 accuracy of matching a true "future" patch among negatives via cosine InfoNCE.
  Subsample to <= 60 plotted points; embedded numbers must be plausible outputs of the code. State in the
  caption that real SimCLR/MoCo/FixMatch need a GPU and this is a faithful small-scale proxy.

## HARD CONVENTIONS
1. Teaching fields are HTML — `<p>`, `<b>`, `<i>`, `<ul>/<ol><li>`, `<code>`. Short, plain sentences.
2. Math in `$...$`/`$$...$$`; inside JS strings DOUBLE every backslash (`\\tau`, `\\sum`, `\\exp`, `\\mathcal`, `\\sim`).
3. NEVER a raw "<" before a letter/number in prose — write `&lt;`. ">" is fine.
4. Expand every abbreviation on first use — "InfoNCE (Information Noise-Contrastive Estimation)",
   "SSL (Self-Supervised Learning)", "EMA (Exponential Moving Average)", "kNN (k-Nearest Neighbors)".
5. Run `node --check lessons/concept-<id>.js` and fix any error.

Report: lesson id, CODEVIZ dataset, what the PyTorch CODE implements, node --check result.
