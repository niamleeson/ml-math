# Module Plan — M7 · Ranking & CTR-family, learning-to-rank

| Field | Value |
|---|---|
| Domain | Domain 1 · Core: Ranking & Evaluation |
| Skip if you can already… | explain pointwise vs pairwise vs listwise and a multi-objective head |
| Maps to (projects) | all |
| Primary structure(s) | S1 Model + S2 Method |
| Example type | ⚑ Both |
| Sub-lessons | 3 |
| Notebooks | 3 |

## Module hub (the "complete list")
Ranking turns retrieved candidates into an ordered slate, often by predicting calibrated response
probabilities such as pCTR or pVTR and combining them with product value. This module teaches the
model family, the learning-to-rank loss choices, and the bridge from ML score to auction or serving
decision.

- M7.1 · pCTR/pVTR models & the calibration link
- M7.2 · Learning-to-rank (pointwise/pairwise/listwise)
- M7.3 · Multi-objective ranking & CTR architectures

## Questions this module answers (→ which sub-lesson teaches the answer)
- How are pCTR/pVTR models trained, and why should their outputs be calibrated probabilities? → M7.1
- What is the difference between pointwise, pairwise, and listwise ranking? → M7.2
- How do pairwise losses such as BPR/RankNet and listwise losses such as LambdaMART/NDCG optimization work? → M7.2
- What is a multi-objective head for click+dwell+value, and how are objectives combined? → M7.3
- What are common CTR architectures such as Wide&Deep, DeepFM, DCN, and DLRM? → M7.3
- How does an ML score connect to an auction or serving score? → M7.1, M7.3

_Every question maps to a sub-lesson (coverage confirmed below)._

## Concepts (ƒ = genuine, central formula)
- pCTR/pVTR as calibrated probabilities **ƒ**
- Pointwise (logloss)
- Pairwise (BPR/RankNet **ƒ**)
- Listwise (LambdaMART/NDCG-opt)
- Multi-objective head + score combination **ƒ**
- Feature crosses
- CTR architectures
- Score→auction linkage

## Sub-lessons

### M7.1 · pCTR/pVTR models & the calibration link  —  [S1 Model, ⚑]
- **Makes answerable:** how pCTR/pVTR are trained & why calibrated; score→auction link for probability-valued scores.
- **You'll be able to say:** "pCTR/pVTR models are pointwise supervised models trained on impression-level labels with logloss-like objectives. Their outputs should be calibrated because downstream systems multiply probabilities by bids, values, or expected utility; a score that ranks well but overstates probability can overcharge opportunity cost and choose the wrong ad."
- **Concepts:** pCTR/pVTR as calibrated probabilities **ƒ**, pointwise logloss, score→auction linkage.
- **Key Idea focus:** formulation + when to use — probability prediction as the base ranking primitive.
- **Worked-example shape:** 10 basics → 5 easy → 5 advanced: read a row as features→click/watch label, train logistic pCTR, compare AUC vs calibration, then compute expected value from pCTR×bid.
- **Notebook:** Yes — synthetic ad impressions with clicks and watches; logistic/GBDT-style pointwise pCTR; signature viz = reliability curve plus score histogram; genuine assert/metric = `assert` calibrated pCTR bins are close to observed CTR and pCTR×bid changes ranking when calibration changes. Break case = monotonic but overconfident raw scores.
- **Real numbers to cite:** two ads with bids $8 and $3: calibrated pCTR 0.01 vs 0.04 gives expected values $0.08 vs $0.12; doubling pCTR by miscalibration can flip auction choices.

### M7.2 · Learning-to-rank (pointwise/pairwise/listwise)  —  [S2 Method, ⚑]
- **Makes answerable:** pointwise vs pairwise vs listwise; pairwise BPR/RankNet; listwise LambdaMART/NDCG-opt losses.
- **You'll be able to say:** "Pointwise learns an absolute label per item; pairwise learns that one item should outrank another; listwise optimizes the whole ordered slate or a metric surrogate such as NDCG. Pairwise losses are useful when relative preference is cleaner than absolute labels; listwise methods matter when top-of-list positions dominate value."
- **Concepts:** pointwise logloss, pairwise BPR/RankNet **ƒ**, listwise LambdaMART/NDCG-opt.
- **Key Idea focus:** step-by-step pseudocode — construct examples, compute scores, apply the loss, update toward the desired ordering.
- **Worked-example shape:** 10+5+5 with process viz: pointwise rows → pairwise clicked-vs-skipped pairs → listwise query/slate with NDCG emphasis at the top.
- **Notebook:** Yes — query/slate toy data; train/compare pointwise logistic, pairwise RankNet-style loss, and listwise metric proxy or LambdaMART-like library if already available; signature viz = before/after ranked slate and NDCG@k; genuine assert/metric = `assert` clicked item moves upward and NDCG@3 improves. Break case = noisy clicks where pairwise labels conflict.
- **Real numbers to cite:** moving a relevant item from rank 5 to rank 1 improves DCG much more than moving it from rank 50 to rank 46 because the discount is position-sensitive.

### M7.3 · Multi-objective ranking & CTR architectures  —  [S1 Model, ⚑]
- **Makes answerable:** multi-objective head click+dwell+value & combination; CTR architectures Wide&Deep/DeepFM/DCN/DLRM; score→auction link for combined utility.
- **You'll be able to say:** "Modern rankers often share a backbone and predict several heads: click probability, watch/dwell probability, conversion/value, or quality constraints. The serving score combines calibrated heads with business weights or auction values. Wide&Deep memorizes crosses plus generalizes, DeepFM/DCN learn crosses, and DLRM is a production-scale embedding-and-interaction CTR architecture."
- **Concepts:** multi-objective head + score combination **ƒ**, feature crosses, CTR architectures, score→auction linkage.
- **Key Idea focus:** formulation + when to use — choose architecture and objective shape based on sparse IDs, feature crosses, and multiple outcomes.
- **Worked-example shape:** 10 basics → 5 easy → 5 advanced: shared embedding features, two heads, weighted score, architecture cards comparing crosses and embedding interactions.
- **Notebook:** Yes — synthetic click+dwell/value labels; train a small shared-bottom multi-head model or simulate calibrated heads; signature viz = Pareto/tradeoff curve and feature-cross diagram; genuine assert/metric = `assert` changing objective weights changes the slate and each head's calibration is evaluated separately. Break case = one head dominates because it is on a larger numeric scale.
- **Real numbers to cite:** score = 0.7·pClick + 0.2·pDwell + 0.1·expectedValue is only meaningful if the heads are calibrated and scaled; raw dwell seconds can swamp click probability unless normalized or valued.

## Coverage check
All 6 module questions map to a sub-lesson: pCTR/pVTR calibration and auction linkage → M7.1; pointwise/pairwise/listwise and their losses → M7.2; multi-objective heads, CTR architectures, and combined serving score → M7.3. No gaps.

## Decision guide (only if the module has a when-to-pick-X-vs-Y)
| Need | Prefer | Why |
|---|---|---|
| Probability for pCTR×bid or expected value | Pointwise calibrated pCTR/pVTR | Produces probability-valued scores downstream systems can consume. |
| Relative preferences are cleaner than absolute labels | Pairwise BPR/RankNet | Learns "A above B" directly. |
| Top-of-slate metric dominates | Listwise/LambdaMART/NDCG-opt | Optimizes ranking shape closer to NDCG or slate utility. |
| Sparse IDs + memorized crosses | Wide&Deep / DeepFM / DCN | Combines memorization and learned feature interactions. |
| Web-scale sparse embeddings and interactions | DLRM-style model | Designed around embedding tables and dense interaction layers. |
| Multiple user/product outcomes | Multi-head ranker | Keeps heads measurable and combineable at serving time. |

## Resources (from the guide)
- Google — Recommendation Systems course (scoring & ranking stage)
- Tie-Yan Liu — Learning to Rank for Information Retrieval (book)

## SOTA papers (from the guide)
- Practical Lessons from Predicting Clicks on Ads at Facebook (He et al., 2014)
- Wide & Deep (Cheng et al., 2016)
- DeepFM (Guo et al., 2017)
- DCN-V2 (Wang et al., 2021)
- DLRM (Naumov et al., 2019)

## Notes / caveats
- M8 covers calibration repair in detail; M7 should explain why calibrated probabilities are needed, not repeat the full calibration toolkit.
- Do not treat multi-objective ranking as "just add numbers"; teach scale, calibration, and business-value units.
