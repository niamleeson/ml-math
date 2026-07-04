# Module Plan — M10 · Learning with sparse & implicit labels (recsys)

| Field | Value |
|---|---|
| Domain | Domain 1 · Core: Ranking & Evaluation |
| Skip if you can already… | train a recsys model on implicit feedback with principled negatives + debiasing |
| Maps to (projects) | Creator Marketplace AI |
| Primary structure(s) | S2 Method + S6 Applied Engineering / Pitfall |
| Example type | ⚑ Both |
| Sub-lessons | 2 |
| Notebooks | 2 |

## Module hub (the "complete list")
Implicit feedback is abundant but ambiguous: a click is positive evidence, while a missing click is
not automatically a true negative. This module teaches how to construct training examples and
negatives, correct sampling bias, debias exposure/position/delay effects, and evaluate recall@k when
the unobserved universe is not fully labeled.

- M10.1 · Implicit feedback & principled negatives (PU, negative sampling, logQ correction)
- M10.2 · Debiasing (position/selection/delayed, IPS)

## Questions this module answers (→ which sub-lesson teaches the answer)
- What is implicit feedback, and how does PU learning frame positives plus unlabeled examples? → M10.1
- How do you construct negatives with uniform, popularity, in-batch, or hard negative sampling? → M10.1
- What is sampling-bias correction such as logQ, and why is it needed? → M10.1
- What are position, selection, and delayed-feedback bias, and how does IPS debiasing work? → M10.2
- How do semi-supervised learning and augmentation help sparse implicit-label settings? → M10.1, M10.2
- How do you evaluate recall@k without true negatives? → M10.1, M10.2

_Every question maps to a sub-lesson (coverage confirmed below)._

## Concepts (ƒ = genuine, central formula)
- Implicit feedback
- PU learning
- Negative sampling
- Sampling-bias correction logQ **ƒ**
- Position/selection/delayed bias
- IPS debiasing **ƒ**
- Semi-supervised
- Augmentation
- Recall@k

## Sub-lessons

### M10.1 · Implicit feedback & principled negatives (PU, negative sampling, logQ correction)  —  [S2 Method + S6, ⚑]
- **Makes answerable:** implicit feedback & PU learning; negative construction (uniform/popularity/in-batch/hard); sampling-bias correction logQ; semi-supervised/augmentation basics for sparse labels; recall@k without true negatives.
- **You'll be able to say:** "Implicit data has observed positives and many unlabeled pairs, not clean negatives. PU learning treats unobserved examples carefully; negative sampling chooses comparison items by a known distribution such as uniform, popularity, in-batch, or hard negatives. If the training sampler differs from the serving/catalog distribution, logQ-style correction subtracts the sampling probability effect so frequent sampled items are not unfairly favored."
- **Concepts:** implicit feedback, PU learning, negative sampling, sampling-bias correction logQ **ƒ**, semi-supervised, augmentation, recall@k.
- **Key Idea focus:** step-by-step pseudocode — build positives, sample negatives, record sampling probabilities, apply corrected logits/loss, then evaluate with candidate sets.
- **Worked-example shape:** 10+5+5 with process viz: positives-only data → naive missing-as-negative break → principled sampled negatives → logQ-corrected training/eval.
- **Notebook:** Yes — Creator Marketplace AI-style creator↔brand/member interactions; sample uniform/popularity/in-batch/hard negatives; signature viz = sampled negative distribution vs catalog distribution and recall@k table; genuine assert/metric = `assert` popularity-sampled negatives overrepresent head creators and logQ correction changes scores/rankings. Break case = treating every unobserved creator as a true negative.
- **Real numbers to cite:** 1 positive creator interaction among 100,000 possible creators does not mean the other 99,999 are disliked; popularity sampling may draw a head creator 100× more often than a tail creator.

### M10.2 · Debiasing (position/selection/delayed, IPS)  —  [S6 Applied, ⚑]
- **Makes answerable:** position/selection/delayed bias; IPS debiasing; semi-supervised/augmentation in the presence of biased exposure; recall@k without true negatives.
- **You'll be able to say:** "Observed implicit labels are filtered by what the system exposed and where it placed items. Position bias makes top items more likely to be clicked, selection bias hides items the old policy never showed, and delayed feedback makes fresh positives look negative. IPS reweights observed outcomes by exposure propensity so evaluation or training better estimates what would have happened under less biased exposure, but high-variance weights need clipping and diagnostics."
- **Concepts:** position/selection/delayed bias, IPS debiasing **ƒ**, delayed feedback, semi-supervised, augmentation, recall@k.
- **Key Idea focus:** correct pipeline + the failure it prevents — measure exposure propensities, reweight or clip, and evaluate recall@k against observed positives with bias caveats.
- **Worked-example shape:** naive observed CTR/recall → break because top positions get more exposure → fix with IPS/clipping → scale to delayed feedback windows and augmented positives.
- **Notebook:** Yes — synthetic logged recommendation slates with position propensities and delayed labels; signature viz = naive vs IPS-corrected metric by position and weight distribution; genuine assert/metric = `assert` IPS estimate is closer to randomized-truth simulation than naive estimate, with clipped variance reported. Break case = tiny propensities causing exploding IPS weights.
- **Real numbers to cite:** item clicked at position 1 with propensity 0.8 gets weight 1.25; at position 10 with propensity 0.05 gets weight 20, so clipping may be needed to trade bias for variance.

## Coverage check
All 6 module questions map to a sub-lesson: implicit feedback, PU, negative sampling, logQ, sparse-label augmentation, and recall@k caveats → M10.1; position/selection/delayed bias, IPS, delayed-label evaluation, and recall@k debiasing caveats → M10.2. No gaps.

## Decision guide (only if the module has a when-to-pick-X-vs-Y)
| Choice | Use when | Watch out |
|---|---|---|
| Uniform negatives | Need broad catalog coverage | Too easy; may undertrain popular confusions. |
| Popularity negatives | Need realistic exposed/confusable items | Must correct sampling bias; overrepresents head items. |
| In-batch negatives | Need efficient two-tower training | Batch composition defines the negative distribution. |
| Hard negatives | Need fine discrimination | False negatives and training instability. |
| IPS debiasing | Logged exposure propensities are available | High variance when propensities are tiny; clip and diagnose. |
| Recall@k on observed positives | No true negatives exist | Interpret as recall over observed/eligible positives, not full preference truth. |

## Resources (from the guide)
- implicit (library) docs (ALS/BPR on implicit feedback)
- BPR paper (Rendle et al.) (pairwise objective for implicit data)

## SOTA papers (from the guide)
- BPR: Bayesian Personalized Ranking (Rendle et al., 2009)
- Sampling-Bias-Corrected Neural Two-Tower (Yi et al., 2019)
- PU-Learning survey (Bekker & Davis, 2020)
- Modeling Delayed Feedback in Display Advertising (Chapelle, 2014)

## Notes / caveats
- Maps to Creator Marketplace AI: use creator/brand/member examples, but keep methods general.
- The genuine formulas are logQ correction and IPS weighting; avoid pretending missing labels are true negatives.
