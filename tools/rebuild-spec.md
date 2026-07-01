# All ML notebook + applications rebuild — general agent spec

You rebuild a BATCH of topics for one part of the ml-math-tutor "All ML" curriculum.
Two deliverables **per topic**: (A) the lesson's Real World Applications block, (B) the rebuilt
Colab notebook. Working dir: `/Users/jaykim/workspace/ml-math-tutor`. Only touch files this spec + your prompt assign.

**Follow the part plan exactly. Do NOT simplify — make D5 genuinely complex/real. Implement the real
method, not a cartoon.** Ground every method, number, and pitfall in the plan entry + lesson content.

Shared helpers (DO NOT edit): `tools/nbbuild.py` (md/code/write; write() sets
`enhanced_walkthrough=true` and **raises on dense code**) and `tools/ladders.py` (tested D1–D5
ladders). Your prompt names the ladder function(s) your family uses; embed the ones you need into a
self-contained setup cell (do not `import ladders` inside the notebook — Colab won't have it).

## THE READABLE-CODE RULE (hard, enforced by nbbuild.write)
One statement per line, newline-split, blank lines between logical groups. Never semicolon-chain.

## Notebook spine (nbbuild cells, in order)
1. **Intro** `md` — `# <title>` + lesson tagline + 2–3 sentence Context excerpt. "Save a copy to Drive to edit."
2. **Setup** `code` — imports (one per line), seeds, and the embedded ladder/util functions your family needs.
3. **The concept, built once (D1)** `md`→`code`→`md`→`code` — develop ONE reusable `def <method>(...)` in 2–4 steps, each preceded by a "what & why" markdown. **Render the lesson's formula in `$…$`/`$$…$$` and plug in the lesson's own worked numbers, asserting the EXACT values from the plan entry.** This proves the method matches the lesson.
4. **The dataset ladder** `md`→`code` — build/load D1–D5 (from the named ladder fn, or per the plan for self-contained families). Preview each rung (name, shape, class/'size' info); show a small sample.
5. **Run the SAME method across D1–D5** `code` — collect ONE metric per rung (the plan's metric). Print a per-rung table.
6. **Results visualization** `code` — the TWO-PART closing figure: (a) small-multiples, one panel per rung showing the output artifact; (b) one summary curve: metric vs. rung D1→D5.
7. **Pitfall on the hardest rung** `md`→`code` — reproduce the lesson's named Pitfall (from the plan) on D5, show the wrong number/behavior, then apply the fix and show it improve.
8. **Evaluate it + Practice** `md` (+ empty `code` cells) — 4–5 bullets: metric + no-skill baseline; a cheap sanity check; an ablation (turn the key idea off → metric drops); failure signals. Then 2–3 practice prompts each followed by an empty code cell.

Delete dead template helpers (`conv2d/iou/edit_distance/ce/kl` etc.) — keep only what the notebook calls.

## Build via a reproducible script
Write ONE build script `tools/_build_<PART>_<BATCH>.py` that imports nbbuild, embeds the needed
ladder source as a `code` cell, builds each topic's cells, and `N.write("notebooks/<id>-<slug>.ipynb", cells)`.
Running this build script is FAST (it only assembles JSON) — that is allowed.

## DO NOT EXECUTE THE NOTEBOOKS (hard rule)
**Never run the notebook's training/plotting code — no `exec` of notebook cells, no `MPLBACKEND=Agg`
run, no headless execution, no nbconvert.** Executing the training code throttles the user's machine.
Generate the notebook and validate it STRUCTURALLY only:
- `nbbuild.write()` already guarantees valid nbformat JSON + readable one-statement-per-line code
  (it raises on dense code). If write() succeeds, JSON + readability are proven.
- Self-check each notebook has: the 8-part spine (intro, setup, build-once md/code/md/code, ladder,
  run-across-D1–D5, two-part results viz, pitfall, evaluate+practice); the build-once cell embeds the
  lesson formula in `$…$` and `assert`s the plan's EXACT numbers; `metadata.enhanced_walkthrough=true`.
- Author carefully so the code WOULD run (use the pre-tested ladder functions verbatim; keep methods
  CPU-only, seeded, small), but DO NOT run it. Correctness comes from careful authoring + asserts, not
  from executing.

## Deliverable (A): lesson applications
Write `lessons/_apps-<PART>-<BATCH>.js`, one statement per topic:
```js
window.ALLML_CONTENT["N.X"].applications = [
  { title: "…", background: "<p>… short history / why it exists …</p>",
    numbers: "<p>… a real, re-derivable calculation using the lesson's own numbers …</p>" },
  // EXACTLY 5, breadth (not five flavors of one use)
];
```
Rules: exactly 5; each light background AND a re-derivable number (use the plan's numbers; mark chosen values "illustrative"). HTML + MathJax only. **Double every LaTeX backslash** (`$\\frac{a}{b}$`). No `<i>`/`<em>`, no emojis. Never an HTML entity inside `$…$` (use `\\lt`/`\\gt`). Expand the plan's "Real World Applications (5)" list into title/background/numbers.
Verify: `node --check lessons/_apps-<PART>-<BATCH>.js` passes.

## Report
List notebooks written, the apps file, and any deviation from the plan (one line why). Do NOT run notebooks.
