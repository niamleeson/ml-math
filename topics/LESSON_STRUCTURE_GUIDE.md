# Curriculum — Lesson & Notebook Structure Guide

This document is the **single source of truth** for how every lesson and Colab notebook in
this curriculum is built. It captures all conventions agreed during design. Every per-lesson
plan under `topics/plans/` applies this guide.

- **Source material:** `../ai-ml-cheatsheets.md` (full reference) and the 38 per-topic files in `topics/`.
- **Per-lesson plans:** `topics/plans/<NN>-<slug>.plan.md` (one per topic).
- **Notebooks:** `topics/notebooks/<NN>-<slug>.ipynb` (only for 💻 and ⚖️ topics).

---

## 1. Topic map & classification

Each topic has a **content category** (what kind of thing it teaches) and an **example type**
(how it's best learned). The example type drives whether it gets a Colab notebook.

**Example types**
- 🧮 **Numeric** — learned by deriving/computing by hand. Pen-and-paper worked examples in the lesson `.md`. **No notebook.**
- 💻 **Colab** — learned by running on data + visualizing. Worked examples live in the notebook. Little hand-math.
- ⚖️ **Both** — hand-derive on a tiny case, then implement/scale in a notebook. Has a notebook; a few examples stay pen-and-paper in the lesson.

| # | Topic (slug) | Source | Content category | Example type |
|---|---|---|---|---|
| 01 | probability-foundations | Probability (MIT) | Formula/Concept | 🧮 |
| 02 | discrete-random-variables | Probability (MIT) | Distributions/Formula | 🧮 |
| 03 | continuous-random-variables | Probability (MIT) | Distributions/Formula | 🧮 |
| 04 | convergence-lln-clt | Probability (MIT) | Formula/Theorem | ⚖️ |
| 05 | supervised-learning-intro | CS 229 | Concept/Framework | 🧮 |
| 06 | linear-models | CS 229 | Model | ⚖️ |
| 07 | support-vector-machines | CS 229 | Model | ⚖️ |
| 08 | generative-learning | CS 229 | Model | ⚖️ |
| 09 | trees-ensembles-knn | CS 229 | Model | 💻 |
| 10 | learning-theory | CS 229 | Formula/Theorem | 🧮 |
| 11 | clustering | CS 229 | Method | 💻 |
| 12 | dimensionality-reduction | CS 229 | Method | ⚖️ |
| 13 | deep-learning-overview | CS 229 | Model | 💻 |
| 14 | ml-metrics | CS 229 | Metric | 🧮 |
| 15 | model-selection-diagnostics | CS 229 | Concept/Tips | ⚖️ |
| 16 | refresher-probability-statistics | CS 229 | Formula | 🧮 |
| 17 | refresher-linear-algebra-calculus | CS 229 | Formula | 🧮 |
| 18 | cnn-fundamentals | CS 230 | Model/Concept | ⚖️ |
| 19 | activation-functions | CS 230 | Function | ⚖️ |
| 20 | object-detection | CS 230 | Method/Model | 💻 |
| 21 | face-recognition-style-transfer | CS 230 | Method/Model | 💻 |
| 22 | cnn-architectures | CS 230 | Model | 💻 |
| 23 | rnn-fundamentals-lstm-gru | CS 230 | Model | ⚖️ |
| 24 | word-embeddings | CS 230 | Method | 💻 |
| 25 | language-models-translation-attention | CS 230 | Model/Method | 💻 |
| 26 | dl-data-processing-training | CS 230 | Tips/Method | 💻 |
| 27 | parameter-tuning-optimization | CS 230 | Method/Tips | ⚖️ |
| 28 | dl-regularization-good-practices | CS 230 | Regularization | ⚖️ |
| 29 | reflex-based-models | CS 221 | Model/Concept | ⚖️ |
| 30 | sgd-fine-tuning | CS 221 | Method | ⚖️ |
| 31 | unsupervised-learning-ai | CS 221 | Method | 💻 |
| 32 | search-optimization | CS 221 | Method/Algorithm | 💻 |
| 33 | markov-decision-processes | CS 221 | Concept+Method | ⚖️ |
| 34 | game-playing | CS 221 | Method/Algorithm | ⚖️ |
| 35 | constraint-satisfaction-problems | CS 221 | Concept+Method | ⚖️ |
| 36 | bayesian-networks | CS 221 | Concept+Method | ⚖️ |
| 37 | propositional-logic | CS 221 | Formula/Concept | 🧮 |
| 38 | first-order-logic | CS 221 | Formula/Concept | 🧮 |

**Counts:** 🧮 Numeric = 10 · 💻 Colab = 11 · ⚖️ Both = 17 → **28 topics get a notebook**, 10 are pen-and-paper only.

---

## 2. Lesson file structure (the `.md` lesson)

Every lesson `.md` has 5 parts. Part 3/4 differ by example type.

**Part 1 — Overview** — what it is + why it matters (2–3 sentences) + one-line intuition.

**Part 2 — Key Idea** — the core content. *Only the flavor changes by category:*

| Content category | Part 2 focuses on |
|---|---|
| Model | formulation + when to use |
| Method / Algorithm | step-by-step (pseudocode) |
| Formula / Theorem | statement + quick derivation |
| Distribution | PMF/PDF + mean/variance |
| Function | formula + graph + gradient |
| Regularization | penalty + its effect |
| Metric | formula + how to read it |
| Concept / Framework | vocabulary + structure |
| Tips | the technique + why it helps |

**Part 3 — Worked Examples (5 easy + 5 advanced), step-by-step university-lecture style.**
- 🧮 topics: written as **pen-and-paper derivations** directly in the lesson `.md` (every step shown with reasoning).
- 💻 topics: **all 10** live in the notebook as granular coded examples; the lesson `.md` lists their titles + links to the notebook.
- ⚖️ topics: hand-derivation examples appear as text in the `.md`; the code examples live in the notebook.

**Part 4 — Hands-on: Google Colab** (💻 and ⚖️ only) — an *Open in Colab* badge + link to `topics/notebooks/<NN>-<slug>.ipynb`. Omitted entirely for 🧮 topics.

**Part 5 — Practice Questions** — 🟢 5 easy + 🔴 5 hard, with solutions in a collapsible `<details>` block. Lives in the lesson `.md` (not the notebook).

---

## 3. Notebook structure (💻 and ⚖️ topics)

Sections, in order. **No "Your Turn", "Practice Questions", or "Wrap-up" sections** — the notebook is
pure concept + granular worked examples + a live experiment.

1. **§ Header & framing** (3 cells): title/badge · roadmap · learning objectives + prerequisites
2. **§ Setup** (3 cells): pinned installs · imports + seed · reusable helpers
3. **§ Concept recap** (2 cells): overview · key idea + core formula (LaTeX)
4. **§ Data — swappable sources** (5 cells): explain toggle · `DATA_SOURCE` switch · explore · raw-data plot · "what to look for"
5. **§ Worked Examples** — 🟢 5 easy + 🔴 5 advanced, each a **variable-length granular block** (see §3.3)
6. **§ Interactive experiment** (3 cells): intro · `ipywidgets` sliders → live plot · prompts

### 3.1 Data-source conventions
A single `DATA_SOURCE` toggle at the top of the Data section, with commented options, e.g.
`"blobs" | "moons" | "iris" | "url" | "upload"`. **Every notebook must include at least one dataset
where the method breaks** (e.g., k-means on moons, linear regression on non-linear data) so learners
see the assumptions, not just the success case.

### 3.2 Commenting standard
**Line-by-line** comments that explain the *why*, not just the *what*. Example intent:
`labels = d.argmin(1)  # assign each point to its NEAREST centroid`.

### 3.3 Granular example anatomy (build↔see loop)
Each worked example is **not** a fixed cell count. It is:
1. `[MD]` goal · data source · what to expect · "we'll build this in **N steps**"
2. **Interleaved build↔see loop**, repeated per sub-operation:
   - `[CODE]` build step *i* — one single-purpose, line-by-line-commented operation
   - `[CODE]` micro-viz of step *i*'s intermediate state (only when it aids understanding)
3. `[CODE]` final **result viz** + a metric
4. `[MD]` 👀 what to look for + takeaway

### 3.4 Granularity scales with complexity
The number of build↔see steps is driven by how many meaningful intermediate states the concept has:

| Concept | Build steps (each may get a micro-viz) |
|---|---|
| Linear regression (normal eq.) | 2–3 |
| k-means, PCA | 4–5 |
| Logistic regression / SGD | 4–6 (init → forward → loss → gradient → update → loop) |
| Decision tree | 5–7 (best-split search, recurse per node) |
| Backprop / neural net | 6–10 (forward per layer → loss → backward per layer → update) |
| CNN forward pass | conv → activation → pool → flatten → dense, each with feature-map viz |
| LSTM cell | one micro-viz **per gate** + state update |
| A* search | per node: pop → expand → update costs → push — grid redrawn each pop |
| Value iteration / Q-learning | value-heatmap redrawn each sweep/episode |
| Minimax | game tree filled node-by-node, pruned branches grayed |

Rule of thumb: simple example ≈ 4–6 cells; complex example (LSTM, A*, backprop) ≈ 15–25 cells.

### 3.5 Topic → visualization mapping
Visualizations must fit the concept and what the code is doing:

| Topic | Process viz | Result viz |
|---|---|---|
| Linear/Logistic regression | loss-vs-iteration; gradient path on 3D loss surface | fitted line + residuals; probability-contour boundary |
| SVM | margin widening as `C` changes | boundary + margins + support vectors circled; linear vs RBF |
| Generative (GDA/NB) | per-class Gaussian contours forming | class densities + boundary |
| Trees/kNN/ensembles | boundary blockier with depth; k sweeping | decision regions; feature-importance bars |
| Clustering | animated centroid movement per iteration | colored clusters; dendrogram; elbow/silhouette |
| PCA/ICA | variance captured as components add | principal axes drawn; 2-D projection; reconstruction |
| Neural nets/CNN | training curves; boundary per epoch; activation histograms | learned filters/feature maps; confusion matrix |
| Activation functions | — | each function **and its derivative** overlaid |
| RNN/LSTM | gate activations over time | sequence prediction; generated text sample |
| Word embeddings | training loss | 2-D t-SNE map; nearest neighbors; analogy arrows |
| Search (A*/BFS/DFS) | grid maze coloring explored nodes + frontier | final path; BFS-vs-A* explored-count |
| MDP/Q-learning | value heatmap updating per sweep; reward-per-episode | value heatmap + policy arrows |
| Minimax | game tree values propagating up; pruned branches grayed | best move highlighted |
| CSP | backtracking search tree unfolding | constraint-graph coloring |
| Bayesian networks | — | DAG with CPTs; posterior bar charts |

### 3.6 Reliability conventions
- Pinned `pip install` (quiet); imports isolated in one cell.
- `np.random.seed(...)` / framework seeds for reproducibility.
- Runs **top-to-bottom on free Colab CPU**; flag the few topics needing a GPU runtime (e.g., 22, 25).
- Use `ipywidgets` `@interact` for the experiment section.
- Wire an **Open in Colab** badge pointing at the notebook in the `niamleeson/ml-math` repo.

---

## 4. Per-lesson plan format

Each `topics/plans/<NN>-<slug>.plan.md` follows the template in `topics/plans/_TEMPLATE.plan.md`
and records: metadata, the Part-2 focus, the concrete **10 worked-example designs**
(title · data source · visualization · build-step granularity), the notebook estimate,
and the 5 easy / 5 hard practice-question themes. See `topics/plans/11-clustering.plan.md`
for a fully worked reference.
