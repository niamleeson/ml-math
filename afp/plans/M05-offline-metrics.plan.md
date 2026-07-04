# Module Plan — M5 · Offline metrics

| Field | Value |
|---|---|
| Domain | Domain 0 · ML Foundations |
| Skip if you can already… | interpret an ROC + NDCG and design a per-slice eval |
| Maps to (projects) | all |
| Primary structure(s) | S4 Metric |
| Example type | 🧮/⚑ Both |
| Sub-lessons | 3 |
| Notebooks | 3 |

## Module hub (the "complete list")
Offline metrics are the language for judging a model before an experiment: classification quality,
ranking quality, calibration, and slice health. This module makes each metric computable by hand
and then frames how to design an ads evaluation that does not hide failures in aggregate averages.

- M5.1 · Classification metrics
- M5.2 · Ranking quality
- M5.3 · Designing an evaluation

## Questions this module answers (→ which sub-lesson teaches the answer)
- Confusion matrix → precision, recall, F1? → M5.1
- Choosing a threshold + the P/R tradeoff? → M5.1
- ROC and AUC (ranking-probability meaning)? → M5.2
- When PR-AUC beats ROC-AUC (imbalance)? → M5.2
- Ranking metrics: MRR, MAP, NDCG (discount + IDCG)? → M5.2
- Compute NDCG@k on a small list by hand? → M5.2
- Calibration vs ranking quality? → M5.3
- Why/how per-slice/segment eval? → M5.3
- How offline metrics relate to (and diverge from) online metrics? → M5.3

_Every question maps to a sub-lesson (coverage confirmed below)._

## Concepts (ƒ = genuine, central formula)
- Confusion matrix: TP, FP, TN, FN
- Precision, recall, F1 **ƒ**
- Threshold selection; precision/recall tradeoff; operating point
- ROC curve; TPR/FPR; AUC ranking-probability meaning **ƒ**
- PR curve and PR-AUC; class imbalance
- Reciprocal rank / MRR **ƒ**; MAP **ƒ**
- DCG/NDCG with IDCG **ƒ**; graded relevance; @k
- Calibration vs ranking; reliability curve / calibration table
- Per-slice / segmented eval; offline↔online relationship; metric guardrails

## Sub-lessons

### M5.1 · Classification metrics  —  [S4 Metric, 🧮/⚑]
- **Makes answerable:** confusion matrix to precision/recall/F1; choosing a threshold and explaining the precision/recall tradeoff.
- **You'll be able to say:** "A threshold turns scores into decisions and creates TP/FP/TN/FN. Precision asks 'of predicted positives, how many were right?', recall asks 'of actual positives, how many did we catch?', and F1 is their harmonic mean. Raising the threshold usually improves precision and lowers recall; pick the operating point from product cost."
- **Concepts:** confusion matrix, precision/recall/F1 **ƒ**, threshold selection, P/R tradeoff, operating point.
- **Key Idea focus:** formula + how to read — compute the metric from counts, then explain what changes when the threshold moves.
- **Worked-example shape:** compute-by-hand + per-slice eval: build a 2×2 confusion matrix from 20 scored impressions, sweep thresholds, identify the cost-aware threshold.
- **Notebook:** Yes — threshold sweep on synthetic pCTR scores; plot precision/recall/F1 vs threshold; `assert` recall decreases or stays flat as threshold rises. Break case = severe imbalance where accuracy looks high but recall is poor.
- **Real numbers to cite:** TP=8, FP=2, FN=4 gives precision 0.80, recall 0.67, F1 ≈ 0.73; a 1% CTR dataset can have 99% accuracy by predicting no clicks.

### M5.2 · Ranking quality  —  [S4 Metric, 🧮/⚑]
- **Makes answerable:** ROC/AUC and ranking-probability meaning; when PR-AUC is better than ROC-AUC; MRR/MAP/NDCG; hand-computing NDCG@k.
- **You'll be able to say:** "AUC is the probability a random positive is scored above a random negative, so it measures threshold-free ranking. With rare positives, ROC-AUC can look good while precision is unusable, so PR-AUC is often more informative. MRR rewards the first relevant result, MAP averages precision at relevant hits, and NDCG discounts graded relevance by rank and normalizes by the ideal ordering."
- **Concepts:** ROC/TPR/FPR, AUC **ƒ**, PR curve/PR-AUC, reciprocal rank/MRR **ƒ**, MAP **ƒ**, DCG/NDCG/IDCG **ƒ**, @k.
- **Key Idea focus:** formula + how to read — connect each ranking metric to the user/product question it answers.
- **Worked-example shape:** compute-by-hand + per-slice eval: pairwise AUC counting, PR curve on imbalanced scores, then DCG/IDCG/NDCG@k for a five-item ranked list.
- **Notebook:** Yes — compute AUC with scikit-learn and by pair counting on a tiny set; compute NDCG@k manually and with a library; `assert` the manual and library NDCG match. Break case = high ROC-AUC but low PR-AUC under 1% positives.
- **Real numbers to cite:** one relevant item at rank 3 has reciprocal rank 1/3; relevance list `[3, 2, 0]` has `DCG@3 = 3 + 2/log2(3) + 0/log2(4)` before normalization by IDCG.

### M5.3 · Designing an evaluation  —  [S4 Metric + Applied, ⚑]
- **Makes answerable:** calibration vs ranking quality; why/how to evaluate per slice; how offline metrics relate to and diverge from online metrics.
- **You'll be able to say:** "Ranking quality asks whether higher-scored items are better ordered; calibration asks whether a score like 0.08 really means about 8% click probability. Aggregate metrics can hide country, campaign, device, or budget-segment failures, so report slices with support and confidence. Offline metrics are fast proxies; online metrics include feedback loops, auction effects, UI changes, latency, and business constraints."
- **Concepts:** calibration vs ranking, reliability table, per-slice/segmented eval, support/min-counts, offline↔online relationship, guardrails.
- **Key Idea focus:** formula + how to read, then applied protocol — choose primary metric, slices, thresholds, and guardrails before comparing models.
- **Worked-example shape:** compute-by-hand + per-slice eval: same global AUC but different country/campaign slice AUCs; compare calibration bins; explain why an online lift may diverge.
- **Notebook:** Yes — create pCTR predictions with good global AUC but a bad country/campaign slice; plot slice table and calibration curve; `assert` the bad slice is detected even when aggregate AUC passes. Break case = aggregate-only evaluation.
- **Real numbers to cite:** global pCTR AUC 0.78 can hide country AUCs US=0.82, IN=0.61, BR=0.75; calibration bin predicted 0.10 but observed CTR 0.06 is overpredicted by 4 percentage points.

## Coverage check
All 9 module questions map to a sub-lesson: confusion matrix/P/R/F1 + threshold tradeoff → M5.1; ROC/AUC + PR-AUC + MRR/MAP/NDCG + NDCG@k by hand → M5.2; calibration + per-slice eval + offline↔online divergence → M5.3. No gaps.

## Decision guide (only if the module has a when-to-pick-X-vs-Y)
Metric choice: binary decision at a threshold → precision/recall/F1; threshold-free binary ranking →
ROC-AUC; rare positives or "how good are top predicted positives?" → PR-AUC; first relevant item
matters → MRR; multiple relevant items → MAP; graded ranked lists and top-k quality → NDCG@k;
probability accuracy / bidding inputs → calibration plus ranking metric.

## Resources (from the guide)
- scikit-learn — model evaluation (every metric with formulas + code)
- Google MLCC — Classification: ROC & AUC (threshold-free ranking quality)
- NDCG (Wikipedia) (graded ranking gain with discount)

## SOTA papers (from the guide)
- (M5 has no dedicated SOTA papers in the guide.)

## Notes / caveats
- M5 overlaps the concurrent `topics/14-ml-metrics.md`; reference it and keep M5 ads-framed:
  pCTR AUC, precision/recall operating thresholds, and per-slice eval by country/campaign.
- Keep ƒ only for genuine metric formulas. Avoid turning offline↔online divergence into a fake equation.
