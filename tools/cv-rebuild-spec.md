# Part-7 (Computer Vision) rebuild — shared agent spec

You rebuild a BATCH of Part-7 topics per `plans/00-MASTER-PLAN.md` + `plans/part-07-computer-vision.md`.
Two deliverables **per topic**: (A) the lesson's Real World Applications block, (B) the rebuilt Colab notebook.
Working dir: `/Users/jaykim/workspace/ml-math-tutor`. **Only** touch the files this spec assigns you.

Shared, pre-tested helpers (DO NOT edit them):
- `tools/cv_ladder.py` — the offline-safe D1–D5 image ladder (validated accuracy curve 1.00→1.00→0.997→0.875→0.285). Inline it into classification-style notebooks.
- `tools/nbbuild.py` — `md()`, `code()`, `write(path, cells)` (writes valid .ipynb, sets `enhanced_walkthrough=true`, and **raises if any code line packs multiple statements with `;`**).

---

## THE READABLE-CODE RULE (hard, enforced)
Every code cell is **one statement per line**, newline-split, blank lines between logical groups.
**Never** semicolon-chain (`plt.figure(); plt.imshow(x); plt.title('t')`). `nbbuild.write()` will reject dense code.

---

## Notebook spine (build with nbbuild cells, in this order)

1. **Intro** `md` — `# <title>` + the lesson tagline + a 2–3 sentence Context excerpt (from the lesson content). One line: "Save a copy to Drive to edit."
2. **Setup** `code` — `import numpy as np`, `import matplotlib.pyplot as plt`, seeds. One import per line.
3. **The concept, built once (D1)** `md`→`code`→`md`→`code` — develop ONE reusable `def <method>(...)` in 2–4 short steps, each preceded by a markdown "what & why". **Render the lesson's formula in `$…$`/`$$…$$`** and **plug in the lesson's own worked numbers, asserting the exact values from the plan entry** (e.g. 7.3: `assert conv_response == -3`, ramp map all `-4`, shapes 4/2/6). This cell PROVES the method matches the lesson.
4. **The dataset ladder** `md`→`code` — for **feature/classifier topics** inline `cv_ladder.py`'s functions and call `load_ladder()`; preview each rung (name, shape, class count) and show a 5-panel image sample. For **geometry topics** (detection/segmentation/flow/pose/OCR/super-res/NeRF) build your OWN 5 synthetic instances of rising complexity (D1 tiny/hand → D5 hardest: more boxes/objects/occlusion/motion/noise).
5. **Run the SAME method across D1–D5** `code` — collect ONE metric per rung (accuracy for classifier topics via `accuracy_with(featurize, X, y)`; IoU/AP/PSNR/EPE for geometry topics). Print a small per-rung table.
6. **Results visualization** `code` — the TWO-PART closing figure: (a) small-multiples, one panel per rung showing the output artifact (feature maps / boundaries / detections / masks / heatmaps); (b) one summary curve: metric vs. rung (D1→D5). Shared axes where sensible.
7. **Pitfall on the hardest rung** `md`→`code` — reproduce the lesson's named Pitfall (from the plan entry) on D5, show the wrong number/behavior, then apply the fix and show it improve.
8. **Evaluate it + Practice** `md` — 4–5 bullets: the metric + a no-skill baseline; a cheap sanity check (e.g. overfit D1); an ablation (turn the key idea off, metric drops); failure signals. Then 2–3 short practice prompts, each followed by an empty `code` cell.

Delete all dead template helpers (`conv2d`, `iou`, etc.) — keep only functions the notebook actually calls.

---

## Build via a script (reproducible)
Write ONE build script per batch, e.g. `tools/_build_cv_<BATCH>.py`, that:
- imports `sys; sys.path.insert(0, "tools")`, then `import nbbuild as N`;
- for classifier topics, reads `tools/cv_ladder.py` source and embeds the needed functions as a `N.code(...)` cell (self-contained for Colab) — do NOT `import cv_ladder` inside the notebook;
- builds each topic's cells and calls `N.write("notebooks/<id>-<slug>.ipynb", cells)`.

Run it: `python3 tools/_build_cv_<BATCH>.py`. Then DELETE the build script (it is scaffolding) OR leave it — but the notebooks are the deliverable.

## Verify EVERY notebook runs (mandatory)
For each notebook you write, extract its code cells and execute them headless; fix until clean:
```
MPLBACKEND=Agg python3 - <<'PY'
import json, sys
src = []
nb = json.load(open("notebooks/<id>-<slug>.ipynb"))
for c in nb["cells"]:
    if c["cell_type"] == "code":
        src.append("".join(c["source"]))
code = "\n\n".join(src)
exec(compile(code, "<nb>", "exec"), {})
print("RAN OK")
PY
```
A notebook is not done until it prints RAN OK and `nbbuild.write` accepted it (readable code). Keep runs fast/CPU-only; D4/D5 use cached MNIST or the offline synthetic fallback automatically.

---

## Deliverable (A): lesson applications
Append to a batch file `lessons/_apps-part07-<BATCH>.js` one statement per topic:
```js
window.ALLML_CONTENT["7.X"].applications = [
  { title: "…", background: "<p>… short history / why it exists …</p>",
    numbers: "<p>… a real, re-derivable calculation with the lesson's own numbers …</p>" },
  // EXACTLY 5, breadth (not five flavors of one use)
];
```
Rules: exactly 5; each has light background AND a re-derivable number (use the lesson's numbers from the plan entry; mark any chosen value "illustrative"). HTML + MathJax only. **Double every LaTeX backslash** in the JS string (`$\\frac{a}{b}$`). No `<i>`/`<em>`, no emojis. Never an HTML entity inside `$…$` (use `\\lt`/`\\gt`). The plan's "Lesson — Real World Applications (5)" list is your grounded source — expand each into title/background/numbers.
Verify: `node --check lessons/_apps-part07-<BATCH>.js` passes.

---

## Report
List the notebooks written (each "RAN OK"), the apps file path, and any topic where you deviated from the plan (e.g. a geometry topic that couldn't use the shared ladder) with one line why.
