# Authoring a "PyTorch (a complete course)" lesson

You write ONE self-contained file `lessons/concept-<id>.js` for one PyTorch topic. This module is
a COMPLETE, hands-on PyTorch course — practical and code-first. Teach the API clearly with real,
runnable PyTorch (it RUNS IN GOOGLE COLAB — torch ships preinstalled there). Cross-link the
existing deep-learning CONCEPT lessons (dl-*) rather than re-deriving the math; here the focus is
HOW to do it in PyTorch.

Read first:
- `lessons/09-classical-a.js` → `cls-gradient-boosting` for the field schema + whenToUse/pitfalls style.
- `lessons/03-deeplearning.js` → the `dl-*` concept lessons to cross-link (backprop, conv, dropout, batchnorm, etc.).
- `lessons/codeviz-03-deeplearning.js` → CODEVIZ chart shapes: line `series:[{name,color,points:[[x,y]]}]`;
  bars `{type:"bars",labels,values,valueLabels,colors}`; scatter `groups:[{name,color,points}]`.

## File skeleton
```
(function () {
  window.LESSONS.push({
    id: "<ID>", title: "<TITLE>", tagline: "<one plain sentence>",
    module: "PyTorch (a complete course)",
    prereqs: [<existing ids you VERIFY by grepping window.LESSONS; e.g. dl-backprop, dl-forward-prop,
              dl-conv, dl-optimizers, fnd-gradient, sibling pt-* ids; [] if unsure>],
    whenToUse: `...`,     // when you'd reach for this PyTorch feature / when to use PyTorch vs alternatives
    application: `...`,   // where it's used in real model building
    pitfalls: `...`,      // <ul> of the classic PyTorch gotchas + the fix (the famous ones — see below)
    bigIdea: `...`, buildup: `...`,
    symbols: [ ... ],     // usually light/empty — this is a coding course, not math-heavy (cross-link dl-* for math)
    formula: `$$...$$`, whatItDoes: `...`,   // OPTIONAL — include only if a real formula clarifies (loss, update rule)
    derivation: `...`,    // the mechanism / how it works under the API (the graph, the optimizer step, etc.)
    example: `...`,       // a tiny concrete worked example (a few tensors, a 2-line model)
    demo: function (host) { ... },   // OPTIONAL theme-aware canvas/Charts demo
    practice: [ { q:`...`, steps:[{do:`...`, why:`...`}], answer:`...` }, ... ]   // HANDS-ON CODING TASKS — see below
  });
  window.CODE["<ID>"] = {
    lib: "PyTorch",
    runnable: false,        // the in-browser engine has no torch; THIS CODE RUNS IN COLAB (torch preinstalled)
    explain: `<p>...frames the code...</p>`,
    code: `<real, runnable, idiomatic PyTorch for this topic — complete enough to copy into Colab and run>`
  };
  window.CODEVIZ["<ID>"] = {
    question: "...",
    charts: [ { type:"line|bars|scatter", title, xlabel, ylabel, <...> } ],
    caption: "...",
    code: `<Python that COMPUTES the plotted numbers — numpy (or a tiny torch snippet you run) — reproducible>`
  };
})();
```

## Page render order: title/tagline → whenToUse → (where used) → CODE → CODEVIZ → pitfalls →
## "Under the hood" (bigIdea, buildup, symbols?, formula?, derivation, example) → demo → practice.

## PRACTICE = HANDS-ON CODING TASKS (the learner TYPES these into Colab)
The notebook generator (`tools/gen-notebooks.js`) emits, per practice item, the prompt + an empty
`# Your turn:` code cell + a collapsible solution. So practice must be CODE the learner types — NOT a
conceptual "explain why…" question. Gold standard: `lessons/concept-pt-tensors.js`. Rules:
- 7–9 items per lesson, building from simplest to a small end-to-end task.
- `q`: open with `<b>Type this in Colab.</b>` then a concrete, self-contained coding task with the
  exact inputs/shapes/values named ("Create a 3×4 float tensor …, then …, print …"). One or two
  "predict the output/shape before running, then verify" items per lesson are encouraged.
- `steps`: 2 `{do, why}` pairs — the approach and the reason, naming the key API call.
- `answer`: the REAL solution as `<pre><code>…</code></pre>` containing runnable PyTorch the learner
  could have typed, WITH the expected printed output as inline `# comments`. Numbers must be correct
  (use a seed where there's randomness). Escape `<` as `&lt;` inside code; `>` is fine.
- Cover the lesson's actual API surface and at least one of its famous pitfalls AS a coding task
  (e.g. forgetting `zero_grad`, device mismatch, `view` vs `reshape`, `train()`/`eval()`).

## Code rules — TWO TRACKS
- `CODE.code` = REAL, idiomatic, COMPLETE PyTorch for the topic, runnable in Colab (torch/torchvision are
  preinstalled). Import torch, build the tensors/model/loop, and PRINT informative output. Use small data
  (a few tensors, a tiny synthetic dataset, or torchvision MNIST/CIFAR for the CNN lesson) so it runs fast on
  Colab's free tier. `runnable:false` (no JVM/torch in the browser). For lessons using lightning/onnx, the
  notebook setup cell auto-installs them.
- `CODEVIZ.code` = a SMALL reproducible computation (numpy, or a tiny torch snippet you actually run) that
  produces the plotted numbers and ILLUSTRATES the concept. RUN it to embed real numbers. Great PyTorch charts:
  * a TRAINING LOSS curve falling over epochs (numpy gradient descent on a tiny problem, or a real torch run);
  * autograd: the gradient values PyTorch computes matching the hand-derived derivative;
  * SGD vs Adam loss curves; with vs without batchnorm/dropout; lr too-high/just-right/too-low;
  * CNN vs MLP test accuracy on MNIST; mixed-precision speedup; DataLoader workers vs throughput;
  * broadcasting/shape transformations shown as a small bars/heatmap.
  Subsample to <= 60 points; numbers must be real.

## HARD CONVENTIONS
1. Teaching fields are HTML — `<p>`, `<b>`, `<i>`, `<ul>/<ol><li>`, `<code>`. Short, plain sentences.
2. Any math in `$...$` with DOUBLED backslashes; NEVER an HTML entity inside `$...$` (use `\\lt`/`\\gt`). Most PyTorch lessons need little math.
3. NEVER a raw "<" before a letter/number in prose — write `&lt;`. ">" is fine.
4. Expand every abbreviation on first use — "GPU (Graphics Processing Unit)", "AMP (Automatic Mixed Precision)",
   "DDP (Distributed Data Parallel)", "ONNX (Open Neural Network Exchange)", "API (Application Programming Interface)".
5. Run `node --check lessons/concept-<id>.js` and fix any error.

## Cover the FAMOUS PyTorch pitfalls where relevant (these make the course valuable):
forgetting `optimizer.zero_grad()` (grads accumulate); calling `.backward()` twice / retain_graph; mixing up
`model.train()` vs `model.eval()` (dropout/batchnorm); not using `torch.no_grad()` at inference (memory);
CPU/GPU device mismatch (`Tensor on cuda vs cpu`); in-place ops breaking autograd; `loss.item()` vs keeping the
graph (memory leak across epochs); wrong tensor shapes / `view` vs `reshape`; dataloader `num_workers` on Windows;
forgetting `.to(device)`; not setting seeds; `CrossEntropyLoss` expecting logits (no softmax) and class indices.

Report: lesson id, the PyTorch topic, what CODE runs, the CODEVIZ illustration, node --check result.
