# AFP-AI Learning Guide — Curriculum Plans

Per-module plans for the interactive **AFP-AI Learning Guide** track (Param Kulkarni):
7 domains, 28 modules (M1–M28). Each `M<NN>-<slug>.plan.md` applies the shared design below.
Source of truth for the doc content is the AFP-AI Learning Guide (skip-if, maps-to, resources, papers).

> **Isolation.** This track lives under `afp/` and is intentionally kept separate from the
> concurrent `topics/` (AI Cheat Sheet) curriculum. Several modules overlap that curriculum
> (M1, M5, M15, M16, M17, M26) — reference it rather than duplicate.

---

## Design principles (locked)

0. **The plan exists to make the learner able to answer the module's questions.** Each module has
   a question bank; the sub-lessons must, together, leave the learner able to answer **every**
   question. Each plan maps question → sub-lesson and states, per sub-lesson, the **target answer
   the learner should be able to give** ("You'll be able to say…"). A coverage check confirms no
   question is left unanswered.
1. **No manufactured math.** Formulas, symbol tables, and derivations appear **only where a
   topic genuinely has central math** (marked **ƒ** in each plan). Conceptual/engineering topics
   are taught in **prose** — never invent an equation to fill a template.
2. **Sectioned modules.** Each module = a **hub page** (its "complete list" checklist) + focused
   **sub-lessons**. A module's "Skip if you can already…" usually bundles several sub-skills;
   each becomes a sub-lesson with its own worked example, practice, and (usually) a notebook.
3. **Faithful to the guide.** Every lesson keeps the doc's **Skip-if** self-check, **Maps-to**
   project tags, curated **Resources**, and **SOTA papers**.
4. **Real, hands-on notebooks.** One statement per line, genuine `assert`s, small real/synthetic
   data, and **at least one dataset where the method breaks** (borrowed from the AI Cheat Sheet
   convention). Math cell only where the ƒ is genuine.

## Reused from the AI Cheat Sheet guide (`topics/LESSON_STRUCTURE_GUIDE.md`)

- **Example-type axis:** 🧮 Numeric (pen-paper, no notebook) · 💻 Colab · ⚑ Both.
- **Lesson shape:** Overview → Key Idea → Worked Examples → Hands-on Colab.
- **Notebook shape:** framing → setup (pinned installs, seed) → concept → **swappable data incl. a
  break case** → granular **build↔see** worked examples (granularity scales with complexity) →
  interactive experiment. CPU-first; Open-in-Colab badge → `niamleeson/ml-math`.

## The 9 lesson structures

| # | Structure | Aligns / NEW | Key-Idea focus | Worked-example shape |
|---|---|---|---|---|
| S1 | Model | aligns "Model" | formulation + when to use | 10 basics → 5 easy → 5 advanced |
| S2 | Method / Algorithm | aligns "Method" | step-by-step pseudocode | 10+5+5, process viz |
| S3 | Formula / Theorem | aligns "Formula/Theorem" | statement + honest derivation (ƒ only) | 5 easy + 5 advanced pen-paper |
| S4 | Metric | aligns "Metric" | formula + how to read | compute-by-hand + per-slice eval |
| S5 | Concept / Framework | aligns "Concept" | vocabulary + structure (prose) | small illustrative cases |
| S6 | **Applied Engineering / Pitfall** | **NEW** | correct pipeline + the failure it prevents | naive → break → fix → scale (before/after numbers) |
| S7 | **Systems / Tradeoff** | **NEW** | the knobs + the tradeoff surface | knob-sweep → tradeoff curve → operating point |
| S8 | **Evaluation Protocol** | **NEW** | what you measure + how you validate it + biases | measure → validate vs truth → debias |
| S9 | **Mechanism / Marketplace** | **NEW** | mechanism (objective+constraints+incentives) + allocation | instance → value/allocation/payment → control loop |

**Cross-cutting (on top of any structure):** the AFP wrapper (skip-if · maps-to · resources ·
papers), the module hub, and an optional **Decision guide** block (when-to-pick-X-vs-Y).

## Module → structure map

| Module | Primary structure | Type |
|---|---|---|
| M1 Supervised learning | S5 Concept (+S2) | 🧮/💻 |
| M2 Feature engineering & leakage | **S6 Applied** | ⚑ |
| M3 Loss & optimization | S3 Formula + S2 Method | ⚑ |
| M4 Model families | S1 Model + Decision | 💻 |
| M5 Offline metrics | S4 Metric | 🧮/⚑ |
| M6 RecSys landscape | S5 Concept + Decision | 💻 |
| M7 Ranking & CTR-family | S1 Model + S2 Method | ⚑ |
| M8 Calibration & imbalance | **S6 Applied** | ⚑ |
| M9 Cold-start / distillation | **S6 Applied** + Decision | ⚑ |
| M10 Sparse & implicit labels | S2 Method + **S6 Applied** | ⚑ |
| M11 Embeddings | S2 Method | ⚑ |
| M12 Two-tower / EBR retrieval | S1 Model + **S7 Systems** | ⚑ |
| M13 ANN / vector search | **S7 Systems** + Decision | ⚑ |
| M14 Encoders / contrastive | S2 Method | ⚑ |
| M15 Clustering | S2 Method | 💻 |
| M16 Dim-reduction / anomaly | S2 Method | ⚑ |
| M17 Transformer basics | S1 Model | ⚑ |
| M18 LLM fundamentals + prompting | S5 Concept | 💻 |
| M19 RAG & query understanding | **S6 Applied** | ⚑ |
| M20 Fine-tuning / distillation | **S6 Applied** + Decision | ⚑ |
| M21 Diffusion & visual generation | S1 Model | ⚑ |
| M22 LLM-as-judge | **S8 Eval Protocol** | ⚑ |
| M23 RLHF / DPO / PPO | S2 Method + Decision | ⚑ |
| M24 Off-policy evaluation | S2 Method + **S8 Eval** | ⚑ |
| M25 Contextual bandits | S2 Method | ⚑ |
| M26 RL foundations | S3 Formula + S2 Method | ⚑ |
| M27 Linear & convex optimization | S3 Formula | 🧮/⚑ |
| M28 Ads marketplace optimization | **S9 Mechanism** | ⚑ |

## Files

- `_TEMPLATE.plan.md` — the per-module plan format.
- `M01-supervised-learning.plan.md` … `M28-ads-marketplace-optimization.plan.md` — one per module.
