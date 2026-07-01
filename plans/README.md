# All ML Revamp — Plan Index

> **PLAN ONLY — nothing implemented yet.** Reference these files next time we iterate.

Two coordinated changes to the app's **All ML** section (464 lessons + 464 notebooks):
- **(A) Lesson pages** — add a **Real World Applications** section (exactly 5 examples each).
- **(B) Colab notebooks** — rebuild each as **one built-up example run across five datasets of
  rising complexity (D1–D5) with a results visualization at the end**. All notebook code is written
  **one statement per line** (newline-split, readable) — never dense, semicolon-packed one-liners.

## Read first
- [`00-MASTER-PLAN.md`](00-MASTER-PLAN.md) — the shared design: the lesson-page change (schema +
  renderer + authoring spec), the notebook spine, the **Family Registry (F1–F17)**, the D1–D5
  ladder, the closing-visualization spec, generator changes, the per-topic entry schema, and the
  rollout order.

## Per-part plans (one entry per topic: 5 real-world applications + notebook family/D1–D5/metric/viz/pitfall)

| Part | File | Topics |
|---|---|---|
| 1 | [part-01-statistical-learning-theory.md](part-01-statistical-learning-theory.md) | 11 |
| 2 | [part-02-optimization.md](part-02-optimization.md) | 16 |
| 3 | [part-03-core-machine-learning.md](part-03-core-machine-learning.md) | 48 |
| 4 | [part-04-unsupervised-learning.md](part-04-unsupervised-learning.md) | 26 |
| 5 | [part-05-probabilistic-graphical-models.md](part-05-probabilistic-graphical-models.md) | 24 |
| 6 | [part-06-deep-learning-foundations.md](part-06-deep-learning-foundations.md) | 34 |
| 7 | [part-07-computer-vision.md](part-07-computer-vision.md) | 31 |
| 8 | [part-08-sequence-models-nlp.md](part-08-sequence-models-nlp.md) | 28 |
| 9 | [part-09-large-language-models.md](part-09-large-language-models.md) | 25 |
| 10 | [part-10-generative-models.md](part-10-generative-models.md) | 19 |
| 11 | [part-11-reinforcement-learning.md](part-11-reinforcement-learning.md) | 35 |
| 12 | [part-12-graph-geometric-learning.md](part-12-graph-geometric-learning.md) | 15 |
| 13 | [part-13-speech-audio.md](part-13-speech-audio.md) | 8 |
| 14 | [part-14-time-series-forecasting.md](part-14-time-series-forecasting.md) | 10 |
| 15 | [part-15-recommender-systems-ranking.md](part-15-recommender-systems-ranking.md) | 11 |
| 16 | [part-16-information-retrieval-search.md](part-16-information-retrieval-search.md) | 8 |
| 17 | [part-17-learning-paradigms.md](part-17-learning-paradigms.md) | 13 |
| 18 | [part-18-data-centric-ai.md](part-18-data-centric-ai.md) | 10 |
| 19 | [part-19-trustworthy-responsible-robust-ai.md](part-19-trustworthy-responsible-robust-ai.md) | 22 |
| 20 | [part-20-ml-systems-mlops-production.md](part-20-ml-systems-mlops-production.md) | 20 |
| 21 | [part-21-classical-symbolic-ai.md](part-21-classical-symbolic-ai.md) | 13 |
| 22 | [part-22-search-planning.md](part-22-search-planning.md) | 10 |
| 23 | [part-23-game-theory-multi-agent.md](part-23-game-theory-multi-agent.md) | 8 |
| 24 | [part-24-evolutionary-computation-swarm.md](part-24-evolutionary-computation-swarm.md) | 9 |
| 25 | [part-25-neurosymbolic-program-synthesis.md](part-25-neurosymbolic-program-synthesis.md) | 5 |
| 27 | [part-27-frontiers.md](part-27-frontiers.md) | 5 |

**Total: 464 topics** (all covered; each entry verified to carry exactly 5 applications).

## Known caveat to resolve during iteration
Some parts whose **lesson math is itself generic/templated** (notably **Part 3**, and to a lesser
extent Parts 17/19/20) produced **templated applications** — the 5 themes repeat across topics with
only numbers swapped, because that is what the current lesson content supplies. For those, the real
fix is to **author topic-specific lesson math first**, then regenerate the applications and notebook.
Flagged per-entry in the part files where it applies.
