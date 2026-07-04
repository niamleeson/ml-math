# Module Plan — M9 · Cold-start / warm-start / transfer & distillation

| Field | Value |
|---|---|
| Domain | Domain 1 · Core: Ranking & Evaluation |
| Skip if you can already… | design a cold→warm handoff with exit criteria |
| Maps to (projects) | all |
| Primary structure(s) | S6 Applied Engineering / Pitfall + Decision guide |
| Example type | ⚑ Both |
| Sub-lessons | 2 |
| Notebooks | 2 |

## Module hub (the "complete list")
Cold-start is the moment when the learned model has the least evidence but the product still needs a
decision. This module teaches how to bridge with content, popularity, heuristics, and confidence
blends; then how transfer and distillation can warm-start or compress models for production.

- M9.1 · Cold-start & the cold→warm handoff (priors, confidence blend, exit criteria)
- M9.2 · Transfer & distillation

## Questions this module answers (→ which sub-lesson teaches the answer)
- What are cold-start types (item/user/system), and why do they break learned models? → M9.1
- How do content features, popularity priors, and heuristics bridge cold-start? → M9.1
- How do you design a cold→warm handoff with exit criteria? → M9.1
- When does transfer learning help? → M9.2
- Why use distillation for latency or warm-start? → M9.2
- How do you blend a prior with learned evidence using confidence? → M9.1

_Every question maps to a sub-lesson (coverage confirmed below)._

## Concepts (ƒ = genuine, central formula)
- Cold-start types
- Content features
- Popularity priors
- Heuristics
- Cold→warm handoff
- Confidence-weighted blend **ƒ**
- Exit criteria
- Transfer learning
- Knowledge distillation (soft labels, temperature) **ƒ**

## Sub-lessons

### M9.1 · Cold-start & the cold→warm handoff (priors, confidence blend, exit criteria)  —  [S6 Applied + Decision, ⚑]
- **Makes answerable:** cold-start types and why they break learned models; content/popularity/heuristic bridge; cold→warm handoff + exit criteria; confidence-weighted blend; Event Ads pacing cold-start.
- **You'll be able to say:** "User, item, and system cold-start break models because the historical interaction features or learned IDs are missing. Start with content features, popularity priors, and safe heuristics; blend the prior with the learned model as evidence grows; switch only when exit criteria such as impressions, positives, calibration confidence, or pacing stability are met. For Event Ads pacing, the cold phase should avoid overreacting to the first few sparse events."
- **Concepts:** cold-start types, content features, popularity priors, heuristics, cold→warm handoff, confidence-weighted blend **ƒ**, exit criteria.
- **Key Idea focus:** correct pipeline + the failure it prevents — a controlled bridge from prior-driven serving to evidence-driven serving.
- **Worked-example shape:** naive learned-only score → break on new event/ad/user → fix with content/popularity prior → scale with confidence blend and explicit exit criteria.
- **Notebook:** Yes — synthetic Event Ads-style campaign/item launch with sparse early impressions; prior score, learned score, confidence blend; signature viz = score over time and handoff threshold; genuine assert/metric = `assert` early blended score is closer to prior and later score approaches learned estimate after exit criteria. Break case = learned-only model produces zero/unstable score for a new item.
- **Real numbers to cite:** use prior CTR 1.0% with only 2 clicks / 20 impressions (raw 10% is noisy); require, for example, ≥1,000 impressions or ≥20 positives plus stable calibration before full warm handoff.

### M9.2 · Transfer & distillation  —  [S6 Applied, ⚑]
- **Makes answerable:** transfer when it helps; distillation why (latency/warm-start); soft labels and temperature.
- **You'll be able to say:** "Transfer helps when source and target tasks share representations, features, or behavior patterns and the target has limited labels; it hurts when domains or objectives mismatch. Distillation trains a smaller or cheaper student to match a teacher's soft outputs, often with temperature to expose dark knowledge, so the student can serve faster or warm-start before enough target labels arrive."
- **Concepts:** transfer learning, knowledge distillation (soft labels, temperature) **ƒ**, cold→warm handoff.
- **Key Idea focus:** correct pipeline + the failure it prevents — reuse signal without blindly copying a mismatched model or serving an expensive teacher.
- **Worked-example shape:** naive train-from-scratch → break on sparse target → fix by initializing from source or teacher labels → scale by comparing latency/quality tradeoff.
- **Notebook:** Yes — small source/target classification or ranking toy; train target from scratch vs transferred representation vs distilled student; signature viz = learning curve and latency/quality table; genuine assert/metric = `assert` transferred/distilled model reaches target metric with fewer labels or lower latency than teacher baseline. Break case = source labels have a shifted objective and negative transfer appears.
- **Real numbers to cite:** teacher AUC 0.78 at 40 ms, student AUC 0.76 at 5 ms; transfer reaches target AUC 0.70 with 1k labels where scratch needs 10k labels.

## Coverage check
All 6 module questions map to a sub-lesson: cold-start types, bridges, confidence blend, handoff, and exit criteria → M9.1; transfer and distillation → M9.2. No gaps.

## Decision guide (only if the module has a when-to-pick-X-vs-Y)
| Situation | Prefer | Exit / guardrail |
|---|---|---|
| New item with rich metadata but no interactions | Content model + popularity/category prior | Move warm after enough impressions/positives and stable slice calibration. |
| New user with little history | Context/session/popularity heuristics | Personalize as explicit or implicit history accumulates. |
| New system/marketplace with scarce labels | Heuristics + transferred representation | Validate source-target match; monitor negative transfer. |
| Expensive accurate teacher blocks serving | Distilled student | Check quality/latency tradeoff against teacher. |
| Early Event Ads pacing | Prior + confidence blend | Do not let first few events dominate budget allocation. |

## Resources (from the guide)
- Eugene Yan — recsys writing (practical cold-start patterns)
- Microsoft Recommenders (content + hybrid cold-start baselines)

## SOTA papers (from the guide)
- Distilling the Knowledge in a Neural Network (Hinton et al., 2015)

## Notes / caveats
- Tie cold-start examples to Event Ads pacing as requested, but keep the file project-general because Maps to = all.
- The confidence blend and distillation temperature are genuine formulas; do not invent equations for "handoff" beyond explicit operational criteria.
