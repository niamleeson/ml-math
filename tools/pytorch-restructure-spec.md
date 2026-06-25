# PyTorch course restructure — spec

Turn the flat 20-lesson "PyTorch (a complete course)" module into a **spiral, milestone-driven
curriculum**: 4 ordered sub-modules, each ending in a runnable milestone project that assembles the
pieces learned so far. Mirrors the philosophy already proven in `tools/capstone-spec.md` ("at
milestones you assemble + run the partial system"), applied to the PyTorch fundamentals course.

Nothing is removed. All 20 existing lessons are kept and reordered; 4 new milestone lessons are added.

---

## Why (the three structural problems being fixed)

1. **No milestones / flat reading list.** 20 lessons in one list with no "you can now build X"
   checkpoints. The paper course has spines; this one doesn't.
2. **Dependency inversion.** `pt-data` currently loads *after* `pt-training-loop`, so the loop is
   first taught on toy tensors. Fix: `pt-data` moves *before* `pt-training-loop`.
3. **Survival skills stranded late.** `save-load`, `gpu-amp`, `regularization`, `debugging` sit at
   #12–16, after CNNs/RNNs. Fix: pull all four forward into Phase 2, before architectures.

---

## How the system orders lessons (verified in `index.html`)

- **Module grouping** = each lesson's `module:` field (line ~826: "Build module → lessons structure").
- **Order within a module** = the `<script src>` load order in `index.html` (push order).
- **Module order in sidebar** = `window.MODULE_ORDER` array (line ~470).

So this restructure touches three things: (a) the `module:` field in each `pt-*` lesson, (b) the
`<script>` block order in `index.html`, (c) the `MODULE_ORDER` array. Plus 4 new lesson files.

---

## The four sub-modules

Replace the single module `"PyTorch (a complete course)"` with four, in this `MODULE_ORDER` slot
(where the old single entry was):

```
"PyTorch 1 — The Core Loop",
"PyTorch 2 — Real Training",
"PyTorch 3 — Architectures",
"PyTorch 4 — Production",
```

### Phase 1 — The Core Loop  (module: `"PyTorch 1 — The Core Loop"`)
Goal: build, train, and evaluate one complete model on real data.

| order | lesson id            | note                                  |
|-------|----------------------|---------------------------------------|
| 1     | pt-intro             |                                       |
| 2     | pt-tensors           |                                       |
| 3     | pt-tensor-ops        |                                       |
| 4     | pt-autograd          |                                       |
| 5     | pt-nn-module         |                                       |
| 6     | pt-loss-optim        |                                       |
| 7     | pt-data              | **MOVED earlier** (was #8, after loop)|
| 8     | pt-training-loop     | now taught on real batched data       |
| 9     | **pt-capstone-1** 🏁 | NEW — train+eval an MLP on MNIST      |

### Phase 2 — Real Training  (module: `"PyTorch 2 — Real Training"`)
Goal: make the Phase-1 model robust — GPU, regularized, checkpointed, debuggable.

| order | lesson id            | note                                  |
|-------|----------------------|---------------------------------------|
| 1     | pt-gpu-amp           | pulled forward (was #13)              |
| 2     | pt-regularization    | pulled forward (was #14)              |
| 3     | pt-save-load         | pulled forward (was #12)              |
| 4     | pt-debugging         | pulled forward (was #16)              |
| 5     | **pt-capstone-2** 🏁 | NEW — same model, GPU + ckpt + reg + debugged |

### Phase 3 — Architectures  (module: `"PyTorch 3 — Architectures"`)
Goal: the interesting models.

| order | lesson id            | note                                  |
|-------|----------------------|---------------------------------------|
| 1     | pt-cnn               |                                       |
| 2     | pt-rnn               |                                       |
| 3     | pt-transfer-learning |                                       |
| 4     | pt-custom            |                                       |
| 5     | **pt-capstone-3** 🏁 | NEW — fine-tune a pretrained CNN on your own images |

### Phase 4 — Production  (module: `"PyTorch 4 — Production"`)
Goal: take a model from notebook to served endpoint.

| order | lesson id            | note                                  |
|-------|----------------------|---------------------------------------|
| 1     | pt-performance       |                                       |
| 2     | pt-distributed       |                                       |
| 3     | pt-deployment        |                                       |
| 4     | pt-ecosystem         |                                       |
| 5     | **pt-capstone-4** 🏁 | NEW — export + serve a trained model  |

---

## The 4 new milestone lessons

Each is a normal lesson file (`lessons/concept-pt-capstone-N.js`) using the existing
LESSONS/CODE/CODEVIZ format, but `type: "capstone"` and focused on **assembling prior lessons into one
runnable artifact** rather than introducing a new concept. Keep the same authored sections
(`whenToUse`, `bigIdea`, `derivation`, `example`, `practice`) but frame them around the build.

- **pt-capstone-1 — "Your first complete model: MLP on MNIST."**
  Assembles: tensors → nn.Module → loss+optim → DataLoader → training loop → eval.
  `prereqs`: the 8 Phase-1 lesson ids. CODE = full runnable Colab script (train, then report test
  accuracy). CODEVIZ = real loss + accuracy curves from our run (labeled "our run").

- **pt-capstone-2 — "Make it real: GPU, checkpoints, regularization, debugging."**
  Takes capstone-1's model and adds `.to(device)` + AMP, dropout/weight-decay, save/resume, and a
  worked debugging pass (a shape/NaN bug found and fixed). CODEVIZ = train-vs-val curves showing the
  regularization effect.

- **pt-capstone-3 — "Fine-tune a pretrained CNN on your own images."**
  Assembles: transfer-learning + cnn + custom head + the robust loop from Phase 2. CODEVIZ = the
  pretrained-vs-fine-tuned accuracy jump.

- **pt-capstone-4 — "From notebook to endpoint."**
  Assembles: save-load + performance (`torch.compile`) + deployment (TorchScript/ONNX export) +
  a minimal serving stub. CODEVIZ = latency before/after compile + export.

---

## Edit checklist (in order)

1. **`index.html`** — in `MODULE_ORDER`, replace `"PyTorch (a complete course)"` with the 4 new module
   names (same slot).
2. **`index.html`** — reorder the Wave K `<script>` block to the Phase 1→4 order above, inserting the
   4 new `concept-pt-capstone-N.js` files at each phase boundary. (Key move within Phase 1:
   `pt-data` before `pt-training-loop`.)
3. **20 `pt-*` lesson files** — update each `module:` field to its new sub-module name (table above).
4. **Write 4 new files** — `lessons/concept-pt-capstone-{1,2,3,4}.js`.
5. **`lessons/concept-pt-intro.js`** — its `application`/`derivation` prose lists the course roadmap in
   the OLD order and references `pt-data` as a late step. Update the roadmap to the 4-phase structure
   and name the milestones.
6. **Sanity check** — open `index.html`, confirm 4 PyTorch modules render in order, each ending in its
   🏁 milestone, and no lesson id is dropped.

## Open questions for review
- Milestone datasets: MNIST (Phase 1) and a small pretrained CNN + a tiny custom image set (Phase 3)
  are the lightest Colab-friendly picks. Swap if you prefer CIFAR-10 / a specific dataset.
- Module names: shortened to "PyTorch 1–4 — …". Fine, or keep "(a complete course)" somewhere?
