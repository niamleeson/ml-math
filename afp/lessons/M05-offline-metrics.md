# M5 · Offline metrics
> **Domain:** Domain 0 · ML Foundations · **Maps to:** all · **Skip if you can already…** interpret an ROC + NDCG and design a per-slice eval

## Overview

Offline metrics are the language for judging a model before an experiment. They tell you whether predictions classify well, rank well, calibrate as probabilities, and behave safely across slices like country, campaign type, device, or budget segment.

The trap is that one aggregate metric can look healthy while the model is unusable where it matters. A pCTR model with good global AUC but bad calibration for one country can still damage bidding or ranking decisions. This module makes the metrics computable by hand, then turns them into an evaluation protocol.

**By the end you can answer:**
- How do TP, FP, TN, and FN become precision, recall, and F1?
- How does threshold choice create a precision/recall tradeoff?
- What do ROC and AUC measure, including the ranking-probability meaning?
- When is PR-AUC more informative than ROC-AUC?
- How do MRR, MAP, and NDCG read a ranked list?
- How do you compute NDCG@k by hand?
- How is calibration different from ranking quality?
- Why and how do you evaluate per slice or segment?
- How can offline metrics diverge from online metrics?

Three sub-lessons:

- **M5.1 Classification metrics** — confusion matrix, precision, recall, F1, and thresholds.
- **M5.2 Ranking quality** — ROC-AUC, PR-AUC, MRR, MAP, and NDCG.
- **M5.3 Designing an evaluation** — calibration, slices, support, guardrails, and offline↔online gaps.

---

## M5.1 · Classification metrics

**The idea.** A score becomes a binary decision only after you choose a threshold. For pCTR, you might score every impression, then mark impressions above a threshold as "predicted click" for a downstream action. That threshold creates a confusion matrix:

| | Actual positive | Actual negative |
|---|---:|---:|
| Predicted positive | TP | FP |
| Predicted negative | FN | TN |

From those counts:

$$\text{precision}=\frac{TP}{TP+FP},\qquad \text{recall}=\frac{TP}{TP+FN},$$

$$F1=\frac{2\cdot \text{precision}\cdot \text{recall}}{\text{precision}+\text{recall}}.$$

Precision asks: of what we called positive, how much was right? Recall asks: of all actual positives, how much did we catch? F1 is the harmonic mean, so it is high only when both are high.

**Thresholds encode product cost.** Raising the threshold usually reduces predicted positives. False positives fall, so precision often rises; false negatives rise, so recall often falls. The right threshold depends on cost: spam blocking may require high precision; candidate generation may require high recall.

**Worked example — compute by hand.** Suppose a thresholded click model gives TP=8, FP=2, FN=4, TN=86.

- Precision $=8/(8+2)=0.80$.
- Recall $=8/(8+4)=0.67$.
- F1 $=2(0.80)(0.67)/(0.80+0.67)\approx0.73$.

Now lower the threshold. You might get TP=10, FP=10, FN=2, TN=78. Recall improves to $10/12=0.83$, but precision falls to $10/20=0.50$. Neither threshold is universally "better" until the product cost is named.

Accuracy can mislead on rare clicks. If CTR is 1%, predicting "no click" for every impression gives 99% accuracy and 0 recall for clicks.

**You'll be able to say:** *"A threshold turns scores into decisions and creates TP/FP/TN/FN. Precision asks 'of predicted positives, how many were right?', recall asks 'of actual positives, how many did we catch?', and F1 is their harmonic mean. Raising the threshold usually improves precision and lowers recall; pick the operating point from product cost."*

---

## M5.2 · Ranking quality

**The idea.** Many ML systems rank rather than make one fixed binary decision. ROC-AUC measures threshold-free binary ranking quality. AUC has a concrete interpretation: the probability that a randomly chosen positive example is scored above a randomly chosen negative example.

ROC plots true positive rate versus false positive rate across thresholds:

$$TPR=\frac{TP}{TP+FN},\qquad FPR=\frac{FP}{FP+TN}.$$

PR curves plot precision versus recall. With rare positives, PR-AUC is often more informative than ROC-AUC because false positives can be huge in absolute number while FPR still looks small.

For ranked lists, different metrics answer different product questions:

| Metric | Formula idea | Best when |
|---|---|---|
| Reciprocal rank | $1 / \text{rank of first relevant item}$ | first relevant result matters |
| MRR | average reciprocal rank over queries | first hit across many queries matters |
| AP / MAP | average precision at each relevant hit, then average over queries | multiple relevant items matter |
| DCG@k | $\sum_{i=1}^{k}\frac{rel_i}{\log_2(i+1)}$ or gain-discount variant | graded relevance and top-k position matter |
| NDCG@k | $DCG@k / IDCG@k$ | compare to the ideal ordering |

**Worked example — NDCG@3 by hand.** A ranked list has graded relevance `[3, 2, 0]`. Using the simple DCG form:

$$DCG@3 = 3 + \frac{2}{\log_2(3)} + \frac{0}{\log_2(4)} \approx 4.262.$$

If the ideal top three are also `[3, 2, 0]`, then $IDCG@3=4.262$ and $NDCG@3=1.0$. If the model ranked `[0, 2, 3]`, then

$$DCG@3 = 0 + \frac{2}{\log_2(3)} + \frac{3}{\log_2(4)} \approx 2.762,$$

so $NDCG@3\approx2.762/4.262=0.65$.

For MRR, if the first relevant creative appears at rank 3, reciprocal rank is $1/3$. That metric ignores later relevant items; NDCG and MAP do not.

**You'll be able to say:** *"AUC is the probability a random positive is scored above a random negative, so it measures threshold-free ranking. With rare positives, ROC-AUC can look good while precision is unusable, so PR-AUC is often more informative. MRR rewards the first relevant result, MAP averages precision at relevant hits, and NDCG discounts graded relevance by rank and normalizes by the ideal ordering."*

---

## M5.3 · Designing an evaluation

**The idea.** Ranking quality and calibration are different. Ranking asks whether higher-scored items are ordered ahead of lower-quality items. Calibration asks whether a score means what it says as a probability: among impressions scored around 0.08, about 8% should click.

A reliability table makes calibration visible:

| Score bin | Mean predicted pCTR | Observed CTR | Read |
|---|---:|---:|---|
| 0.00–0.05 | 0.03 | 0.03 | calibrated |
| 0.05–0.15 | 0.10 | 0.06 | overpredicts by 4 pp |
| 0.15–0.30 | 0.21 | 0.20 | close |

A model can rank well but be miscalibrated. That matters in ads because pCTR can feed bidding, pacing, or expected-value calculations, not just ordering.

**Per-slice evaluation.** Always report slices with support: country, campaign objective, advertiser segment, device, placement, budget band, new vs mature campaigns. Aggregate metrics hide failures when a large healthy slice dominates the average.

**Worked example — aggregate hides a country failure.** A pCTR model has global AUC 0.78, which passes the launch bar. Slice AUCs tell a different story:

| Slice | Impressions | AUC |
|---|---:|---:|
| US | 5,000,000 | 0.82 |
| IN | 800,000 | 0.61 |
| BR | 700,000 | 0.75 |

The global number mostly reflects the large US slice. If IN is a priority market, this model needs investigation before launch. The eval should include support, uncertainty or confidence intervals where available, and guardrails such as latency, coverage, calibration, and business constraints.

Offline and online can diverge because online systems include feedback loops, auction competition, UI changes, budget pacing, latency, exploration, and other models reacting. Offline metrics are fast proxies; online experiments measure the deployed system.

**A minimal evaluation plan:** choose a primary offline metric, name threshold or top-k operating points, report calibration if probabilities are consumed, define required slices and min-counts, compare to baseline, and list online success and guardrail metrics before looking at results.

**You'll be able to say:** *"Ranking quality asks whether higher-scored items are better ordered; calibration asks whether a score like 0.08 really means about 8% click probability. Aggregate metrics can hide country, campaign, device, or budget-segment failures, so report slices with support and confidence. Offline metrics are fast proxies; online metrics include feedback loops, auction effects, UI changes, latency, and business constraints."*

---

## Resources
- scikit-learn — model evaluation (every metric with formulas + code)
- Google MLCC — Classification: ROC & AUC (threshold-free ranking quality)
- NDCG (Wikipedia) (graded ranking gain with discount)

## Papers
- (M5 has no dedicated SOTA papers in the guide.)

