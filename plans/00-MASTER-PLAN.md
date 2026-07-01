# All ML — Lesson & Notebook Revamp Plan (MASTER)

> **Status: PLAN ONLY. Do not implement yet.** This document + the 26 `part-NN-*.md` files
> are the reference for the next iteration. When we implement, we open the relevant part file,
> follow the per-topic entry, and apply the shared design below.
>
> Scope: the **All ML** section only — 464 lessons/notebooks across 26 parts
> (`window.ALLML` in `lessons/all-ml.js`, content in `lessons/all-ml-content-part-*.js`,
> notebooks in `notebooks/<id>-<slug>.ipynb`). The other app modules (Foundations,
> Probability, ML, DL, AI, papers, PyTorch, …) already have step-by-step
> (`metadata.enhanced_walkthrough`) notebooks and a "where you use this" block, and are **out of scope**.

---

## 0. Why we're doing this

Two problems, established by auditing all 464 notebooks and lessons:

1. **The lesson pages stop at theory.** Each All ML lesson renders four sections —
   `context`, `intuition`, `mathematics`, `pitfalls` — but has **no real-world applications
   section**. A learner never sees where the idea is actually used, with numbers.
   *(Confirmed: the only content fields present across all 463 authored lessons are
   `tagline, colab, context, intuition, mathematics, pitfalls`. There is no `applications` field.)*

2. **The notebooks are one factory template stamped 464 times.** Measured across all 464:
   - 464/464 share the identical `"5 runnable & visualizable examples… computes, plots, and asserts"` intro;
   - 463/464 have exactly 8 cells / 5 asserts / only 2 markdown cells;
   - **1/464** contain any math notation; **0/464** use any real dataset;
   - **450/464** carry dead, never-called helper code (copied template headers).
   Many "examples" assert a hardcoded constant equals itself, or demonstrate the exact
   anti-pattern the lesson's Pitfalls section warns against (e.g. `8.22` computes BLEU on two
   identical strings → `assert bleu==1.0`, which the lesson explicitly calls a trap).

**This plan fixes both**: (A) add a **Real World Applications** section (5 examples) to every
lesson page, and (B) rebuild every notebook as **one built-up example run across five datasets
of rising complexity, with a results visualization at the end**.

---

## PART A — Lesson page: add a "Real World Applications" section (5 examples)

### A.1 Current vs. target

Today the renderer `window.renderAllMLLesson` (in `lessons/all-ml-register.js`) walks a fixed
`SECTIONS` array:

```js
var SECTIONS = [
  { key:"context",     label:"Context",     hint:"…" },
  { key:"intuition",   label:"Intuition",   hint:"…" },
  { key:"mathematics", label:"Mathematics", hint:"…" },
  { key:"pitfalls",    label:"Pitfalls",    hint:"…" }
];
```

**Target:** a fifth section rendered after Pitfalls:

```js
  { key:"applications", label:"Real World Applications",
    hint:"Where this is actually used — five concrete uses, each with real numbers." }
```

### A.2 Content schema (new field per lesson)

Add one field to each `window.ALLML_CONTENT[id]` object. It is an **array of exactly 5**
application objects (mirrors the proven `applications` shape in `tools/AUTHORING-BRIEF.md`):

```js
window.ALLML_CONTENT["8.22"].applications = [
  {
    title: "Google Translate — production NMT",
    background: "<p>Phrase-based systems gave way to neural encoder-decoders in 2016; " +
                "attention removed the fixed-length bottleneck…</p>",
    numbers:  "<p>On WMT'14 EN-DE the attention model lifted BLEU from ~20.7 (phrase-based) " +
              "to ~25.8 — re-derive: a candidate with 8/10 matching unigrams and brevity " +
              "penalty $e^{1-11/8}=0.69$ gives BLEU1 $=0.8\\times0.69=0.55$.</p>"
  },
  // … 5 total
];
```

Rules (inherited from `AUTHORING-BRIEF.md`, non-negotiable):
- **Exactly 5** applications, spanning breadth (not five flavors of the same use).
- Each has **light background** (history / why it exists — no "What it is:" label) **and real
  numbers the learner can re-derive**.
- HTML + MathJax only; **double every LaTeX backslash** in the JS string; no `<i>/<em>`,
  no emojis/glyphs; never an HTML entity inside `$…$` (use `\\lt`/`\\gt`).
- Ground every number: quote the source; mark chosen thresholds as "illustrative."

### A.3 Renderer change (small, additive)

In `all-ml-register.js`:
1. Append the `applications` entry to `SECTIONS`.
2. The `card()` renderer must handle an **array** value (the four existing sections are HTML
   strings). Add a branch: if `l.applications` is an array, render each as a sub-card
   (`title` → `background` → a `numbers` block), else fall back to the scaffold hint.
3. Add scoped CSS for `.card.allml.applications .appitem { … }` (title bold, numbers in a
   tabular-figures block) — same visual family as the existing `.mini` tables.

### A.4 Relationship to the notebook

The lesson's 5 applications and the notebook's 5 datasets are **thematically aligned but not
identical**: applications = *where it's used in the world* (with cited numbers); datasets =
*a runnable complexity ladder*. Each part file lists both per topic so they reinforce each other
(e.g. a translation "application" = production NMT BLEU gains; a translation "dataset rung" =
a longer-sentence toy corpus where BLEU drops).

---

## PART B — Notebook redesign: one example, five datasets, one results figure

### B.1 The spine (cell skeleton, every notebook)

```
1  Lesson intro            markdown   tagline + a 2–3 sentence Context excerpt (from all-ml-content)
2  Setup                   code       imports (+ pip only if truly needed); seed everything
3  THE CONCEPT, BUILT ONCE  md → code → md → code
       The gold-standard paced build-up (see notebooks/ai-mdp.ipynb): develop ONE reusable
       def method(data, …) in 2–4 steps, each preceded by a short markdown "what & why".
       Render the lesson's Mathematics formula ($…$) and plug the lesson's own worked
       numbers into it on the D1 toy, verifying against the lesson.
4  The dataset ladder      md + code   build/load D1…D5; preview each (shape, columns/sample, or images)
5  Run the SAME method on D1…D5   code   collect one result artifact + one metric per rung
6  RESULTS VISUALIZATION   code        the two-part closing figure (B.4)
7  Pitfall on the hardest rung   md + code   reproduce the lesson's Pitfall on D5, then the fix
8  Evaluate it + Practice  md + code   eval block (metric+baseline, overfit-a-batch, ablation, failure signals)
```

The build-up (cell 3) happens **once, on D1** — the fully-inspectable toy that matches the
lesson's numbers. D2–D5 reuse the same `method`. Depth (one honest walkthrough) **and** breadth
(watch it scale) **and** a payoff (the results figure).

### B.2 The D1–D5 complexity ladder (the reusable principle)

Five rungs, simplest → most real/messy, **same concept and same metric throughout**:

| Rung | What | Purpose |
|---|---|---|
| **D1** | hand-built 2–5 points/states | mechanism fully visible; must match the lesson's worked numbers |
| **D2** | clean synthetic, clear structure | it works when conditions are ideal |
| **D3** | synthetic + noise / overlap / conflict | sensitivity appears |
| **D4** | a **small real** dataset (sklearn/seaborn bundled, or tiny inline real) | bridge to reality |
| **D5** | larger/messier real, or a real edge case (imbalance, shift, long input) | **this is where the Pitfall lives** |

The exact D1–D5 for each topic are specified per family in §B.5 and per topic in the part files.

### B.3 The closing visualization (cell 6) — always two parts

- **(a) Small multiples** — one panel per dataset showing the concept's *output artifact*
  (decision boundary / attention alignment / filtered trace / clusters / Pareto front / search
  tree / value map). Shared axes/scales so the progression reads left→right.
- **(b) One summary curve** — the lesson's metric vs. rising complexity (accuracy, BLEU, RMSE,
  silhouette, return, …). **This curve is the lesson**: it shows the idea holding up — or
  degrading — as complexity grows.

### B.4 Cross-cutting conventions (every notebook)

- **Readable code — one statement per line.** Every code cell is written for humans: **exactly one
  statement per line**, split across newlines, with blank lines separating logical groups (setup,
  compute, plot). **Never** pack multiple statements onto one line with semicolons — that dense
  style is the sin of the old notebooks and the single biggest readability regression to avoid.
  - Bad (old): `plt.figure(figsize=(4,3)); plt.imshow(P); plt.xticks(range(2),tgt); plt.title('x')`
  - Good:
    ```python
    fig, ax = plt.subplots(figsize=(4, 3))
    ax.imshow(P)
    ax.set_xticks(range(2), tgt)
    ax.set_title("lexical translation probabilities")
    ```
  One operation per line so a learner can read it top-to-bottom, run it, and edit any single step.
  Applies to **every** code cell in **every** notebook (setup, build-up, ladder, viz, pitfall, eval).
- **CPU-only, run-all-safe, deterministic.** Seed all RNGs; assert on tolerances, not equality
  of floats. No GPU, no long training. Cap D4/D5 at sklearn-bundled or tiny inline real data —
  **no large downloads**; if a torchvision set is used, subsample to a few hundred and cache.
- **Show the math.** At least one `$…$`/`$$…$$` cell per notebook, plugging lesson numbers in.
- **No dead code.** Delete the copied `conv2d/iou/edit_distance/ce/kl` helpers unless the
  notebook actually calls them.
- **Pitfall = D5 demo**, reusing the `tools/fe-demos/<id>.py` "reproduce the problem → apply the
  fix" pattern the generator already supports.
- **Guard against regeneration:** set `metadata.enhanced_walkthrough = true` once a notebook is
  reworked, so `tools/gen-notebooks.js` won't clobber it (existing mechanism).
- **Colab-served:** notebooks are opened from the `niamleeson/ml-math` GitHub repo (the `colab`
  field URL); the rebuilt notebooks must be pushed there.

### B.5 The Family Registry (the backbone)

Every topic is assigned **one family**. A family fixes the D1–D5 ladder mechanics, the default
metric, and the closing visualization. ~16 families cover all 464 topics (far fewer than topics
⇒ generatable). Per-topic tweaks (which specific dataset, which specific pitfall) live in the
part files.

| # | Family | D1 → D5 ladder | Metric | Closing viz |
|---|---|---|---|---|
| F1 | **Supervised-Tabular** (classifier & regressor) | 4 hand pts → clean `make_*` → noisy/overlap → sklearn real (iris/wine/diabetes) → harder real (breast_cancer/california/digits) | accuracy or R²/MSE | boundary/fit panels + metric bar |
| F2 | **Clustering / Density** | 4 pts → blobs → moons/anisotropic → iris(unlabeled) → digits | silhouette / ARI | cluster-assignment panels + silhouette curve |
| F3 | **Dim-Reduction / Manifold** | 2D toy → swiss-roll → S-curve → digits → faces | explained-var / trustworthiness / recon err | 2D embedding panels + curve |
| F4 | **Optimizer** (gradient & black-box/evolutionary) | quadratic bowl → ill-conditioned → Rosenbrock/multimodal → real logistic loss → high-dim/constrained | loss / iters-to-converge / best-fitness | trajectory on contours + loss-vs-iter |
| F5 | **DL-Training** (neuron/backprop/init/norm/reg/optim, small nets) | XOR → moons → 3-class blobs → digits → fashion-mnist(sub) | accuracy / loss | boundary + train/val curves |
| F6 | **Vision** (conv/pool/CNN/detection/seg/caption/style) | 4×4 patch → synthetic shapes → sklearn digits(8×8) → MNIST(sub) → CIFAR(sub) | accuracy / IoU | feature-maps or prediction panels + metric |
| F7 | **Sequence / NLP** (RNN/LSTM/attn/transformer/translation/tagging/QA; speech-as-sequence) | lesson pair → 5-item toy → +structure(reorder/agreement) → tiny real corpus → longer/harder | accuracy / BLEU / perplexity | attention/alignment heatmaps + metric-vs-length |
| F8 | **LLM / Prompt** (tokenize/scale/prompt/in-context/tool-use/RAG/decoding/align) | 1 prompt → few-shot set → +distractors → tiny real corpus/tool set → longer context / scaling ladder | accuracy / calibration / cost | per-rung outcome panels + metric-vs-context/compute |
| F9 | **Generative** (VAE/GAN/diffusion/flows/AR/EBM/score) | 1D gaussian → 2D moons → mixture → digits → faces | NLL / recon / 2-sample dist | generated-sample panels + metric |
| F10 | **Probabilistic-Inference** (MCMC/Gibbs/VI/particle; BN/MRF marginals) | 2-state target → 4-state → bimodal → correlated 2D → higher-dim/ill-cond | TV / marginal error / ESS | samples-vs-target panels + error-vs-iter |
| F11 | **Graph / GNN** (GCN/GAT/sage/spectral/embeddings/pooling) | 4-node toy → karate club → synthetic SBM → cora(sub) → larger | node-acc / cut / modularity | graph layout colored by prediction + curve |
| F12 | **Sequential-Decision / RL** (MDP/DP/TD/Q/PG/AC/PPO/bandits/explore) | 2-state chain → slippery 3-state → 4×4 grid → stochastic/windy grid → larger sparse (or CartPole) | return / value-error / regret | value/policy heatmaps + learning curve |
| F13 | **Time-Series / State-Space** (AR/ARIMA/Kalman/SSM/forecast/season) | constant → drift → drift+noise → seasonal → outlier/regime-shift | RMSE / interval coverage | filtered/forecast-vs-true panels + RMSE-vs-noise |
| F14 | **Ranking / Retrieval / RecSys** (LTR/MF/NCF/BPR/wide-deep; TF-IDF/BM25/ANN/HNSW) | 3-item slate / tiny doc set → small synth → +noise/ties/synonyms → MovieLens/20NG tiny → sparser/long-tail | NDCG / recall@k / MRR | ranking or PR panels + metric-vs-sparsity |
| F15 | **Trust / Interpretability / Robustness** (LIME/SHAP/saliency/calib/fairness/adversarial/OOD/uncertainty/privacy) | linear toy → +interaction → real tabular → image → shifted/attacked | faithfulness / ECE / robust-acc | attribution/reliability panels + metric-vs-stress |
| F16 | **Algorithmic-Instance** (search/planning, symbolic/logic, game/social-choice, **and pure learning theory**) | problem instances of rising size/branching/conflict — OR capacity/n knob for theory | solution-quality / nodes / winner / bound-tightness | structure diagram panels (search/proof tree, payoff/preference matrix) + quality-vs-size curve |
| F17 | **Systems / Operational** (MLOps: serving/latency/batching/quant/distill/monitor/drift/A-B) | small workload → larger → +drift → real-ish trace → prod-scale sim | latency / cost / drift stat | latency/cost/throughput curves per workload |

**Modifier ladders** (compose with a base family instead of inventing a family):
- **Data-quality ladder** (Part 18 Data-Centric): base = F1; rungs vary *data* not model —
  clean → label noise → class imbalance → real tabular → real messy. Metric = accuracy/label quality.
- **Budget/shift ladder** (Part 17 Learning Paradigms): base = the paradigm's underlying learner
  (usually F1/F5); rungs vary label budget / #tasks / domain shift. Metric = accuracy-vs-budget.

### B.6 Generator changes (`tools/gen-notebooks.js` → new `gen-allml-notebooks.js`)

- Replace the "5 asserts" emitter with three registries keyed by family:
  `datasetLadder[family]` (5 loaders returning `(X,y)`/instances + a one-line preview),
  `runMetric[family]`, `plotResults[family]` (the two-part figure).
- Reuse the existing `dataPreviewCells()` (already previews `load_*`/torchvision/seaborn/`make_*`)
  as the **per-rung** preview engine.
- Pull `context/mathematics/pitfalls` for the topic from `all-ml-content-part-*.js` and emit them
  as the teaching markdown cells (cells 1, 3, 7).
- Per topic, an author supplies only: the concept `method()` (once) + the family assignment +
  (optionally) topic-specific D-overrides and the specific pitfall. Everything else is inherited.
- **Emit readable code:** the generator writes one statement per line (newline-split, blank lines
  between logical groups) — never semicolon-packed one-liners. See §B.4.
- Emit `metadata.enhanced_walkthrough = true`.

---

## PART C — Per-part files: schema & index

Each `plans/part-NN-<slug>.md` covers one part and contains, **for every topic**, one entry:

```
### <id> — <title>   [notebook: <id>-<slug>.ipynb]   (gap? / family: F#)

**Lesson — Real World Applications (5):**
1. <application theme> — <one line: where + the number to cite>
2. … (5 total, breadth, each with a re-derivable number)

**Notebook plan:**
- Family: F# <name>
- Concept built once (D1): <the reusable method + which lesson formula/numbers to verify>
- Datasets D1–D5: D1 <toy> · D2 <clean> · D3 <noisy> · D4 <real> · D5 <edge>
- Metric: <the one metric tracked across all 5 rungs>
- Closing viz: (a) <small-multiples artifact>  (b) <metric-vs-complexity curve>
- Pitfall on D5: <the lesson's named pitfall, reproduced then fixed>
- Notes: <dead code to delete / any topic-specific caveat>
```

Entries are **compact** (grounded in the lesson content, not essays). "Gap" topics (flagged
`gap:true` in `all-ml.js`) are noted — their lesson content may be thin, so the plan flags that
the lesson body likely needs authoring before the notebook can cite it.

### Index of part files

| Part | File | Topics | Dominant family |
|---|---|---|---|
| 1  | `part-01-statistical-learning-theory.md` | 11 | F16 (theory instance-ladder) |
| 2  | `part-02-optimization.md` | 16 | F4 |
| 3  | `part-03-core-machine-learning.md` | 48 | F1 (+F2) |
| 4  | `part-04-unsupervised-learning.md` | 26 | F2/F3 |
| 5  | `part-05-probabilistic-graphical-models.md` | 24 | F10 |
| 6  | `part-06-deep-learning-foundations.md` | 34 | F5 |
| 7  | `part-07-computer-vision.md` | 31 | F6 |
| 8  | `part-08-sequence-models-nlp.md` | 28 | F7 |
| 9  | `part-09-large-language-models.md` | 25 | F8 |
| 10 | `part-10-generative-models.md` | 19 | F9 |
| 11 | `part-11-reinforcement-learning.md` | 35 | F12 |
| 12 | `part-12-graph-geometric-learning.md` | 15 | F11 |
| 13 | `part-13-speech-audio.md` | 8 | F7 |
| 14 | `part-14-time-series-forecasting.md` | 10 | F13 |
| 15 | `part-15-recommender-systems-ranking.md` | 11 | F14 |
| 16 | `part-16-information-retrieval-search.md` | 8 | F14 |
| 17 | `part-17-learning-paradigms.md` | 13 | budget/shift modifier |
| 18 | `part-18-data-centric-ai.md` | 10 | data-quality modifier |
| 19 | `part-19-trustworthy-responsible-robust-ai.md` | 22 | F15 |
| 20 | `part-20-ml-systems-mlops-production.md` | 20 | F17 |
| 21 | `part-21-classical-symbolic-ai.md` | 13 | F16 |
| 22 | `part-22-search-planning.md` | 10 | F16 |
| 23 | `part-23-game-theory-multi-agent.md` | 8 | F16 |
| 24 | `part-24-evolutionary-computation-swarm.md` | 9 | F4 (black-box) |
| 25 | `part-25-neurosymbolic-program-synthesis.md` | 5 | F16/F4 |
| 27 | `part-27-frontiers.md` | 5 | F8/F16 |

---

## Rollout order (when we implement)

Do the **worst offenders first** (fully topic-agnostic template + a pitfall actively mistaught):
1. `8.22` machine-translation (BLEU-on-identical-strings) — the canonical before/after.
2. Part 3 generic "score/knob" notebooks (`3.31` online learning et al.).
3. Part 6 off-topic ones (`6.25` data-augmentation shows no augmentation).
4. Part 9 bar-chart-of-a-constant (`9.20` tool-use).
5. Parts 17 & 19 "Base/Knob/Contrast/Edge" generic templates.

For each: (1) add the lesson `applications` field (Part A), (2) rebuild the notebook from its
family ladder (Part B), (3) set `enhanced_walkthrough`, (4) push to `niamleeson/ml-math`.

**Sequencing per topic:** lesson `applications` first (the notebook's D4/D5 real datasets and the
closing-viz "so what" reuse the same real-world numbers), then the notebook.
