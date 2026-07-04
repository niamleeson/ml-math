# M7 · Ranking & CTR-family
> **Domain:** Domain 1 · Core: Ranking & Evaluation · **Maps to:** all · **Skip if you can already…** explain pointwise vs pairwise vs listwise and a multi-objective head

## Overview

Ranking turns retrieved candidates into an ordered slate. In ads and recommendation products, the base score is often a response probability such as pCTR or pVTR, then a serving system combines that probability with bid, value, or business constraints. The hard part is choosing the right training objective and keeping the score meaningful downstream.

**By the end you can answer:**
- How are pCTR/pVTR models trained, and why should their outputs be calibrated probabilities?
- What is the difference between pointwise, pairwise, and listwise ranking?
- How do pairwise losses such as BPR/RankNet and listwise losses such as LambdaMART/NDCG optimization work?
- What is a multi-objective head for click+dwell+value, and how are objectives combined?
- What are common CTR architectures such as Wide&Deep, DeepFM, DCN, and DLRM?
- How does an ML score connect to an auction or serving score?

Three sub-lessons:

- **M7.1 pCTR/pVTR models & the calibration link** — probability prediction as the ranking primitive.
- **M7.2 Learning-to-rank** — pointwise, pairwise, listwise objectives.
- **M7.3 Multi-objective ranking & CTR architectures** — heads, crosses, and serving scores.

---

## M7.1 · pCTR/pVTR models & the calibration link

**The idea.** A pCTR model is a pointwise supervised model: each impression is a row, features describe the member, item/ad, context, and historical signals available at serve time, and the label says whether the click happened in the attribution window. pVTR is the same pattern for view-through, video view, or watch completion.

For binary click labels, the standard pointwise objective is logloss:

$$\ell(y,p)=-y\log p-(1-y)\log(1-p).$$

Logloss rewards probability accuracy, not just ordering. That matters because downstream systems often use the model output as a probability in expected value calculations.

**Ranking well is not enough.** A monotone transform can preserve AUC while destroying probability scale. If a model ranks ad A above ad B correctly but says both probabilities are twice as large as reality, pCTR×bid is wrong. In an auction or serving system, a score of 0.04 means "about 4 clicks per 100 impressions" only if it is calibrated.

**Worked example — rank order vs expected value.** Two ads are eligible:

| Ad | Bid | Calibrated pCTR | Expected value |
|---|---:|---:|---:|
| A | USD 8 | 0.01 | USD 0.08 |
| B | USD 3 | 0.04 | USD 0.12 |

The expected-value score picks B: lower bid, much higher click probability. If a miscalibrated model doubles A's pCTR to 0.02 and halves B's to 0.02 while keeping some global rank metric acceptable, the serving score becomes A = USD 0.16 and B = USD 0.06 — a flipped decision caused by probability scale, not product value.

```python
score_a = 0.01 * 8
score_b = 0.04 * 3
assert score_b > score_a
```

**Where M8 takes over.** This lesson explains why the output should be calibrated. M8 teaches how to measure and repair miscalibration with reliability diagrams, ECE, Platt scaling, and isotonic calibration.

Before handing a pCTR score to serving, check three things:

- The label window matches the product decision window.
- The output is evaluated as a probability, not only as a ranking score.
- Any downstream multiplier, such as bid or value, uses the same unit the model was trained to predict.


**You'll be able to say:** *"pCTR and pVTR models are pointwise supervised models trained on impression-level labels with logloss-like objectives. Their outputs should be calibrated because downstream systems multiply probabilities by bids, values, or expected utility; a score that ranks well but overstates probability can pick the wrong ad or candidate."*

---

## M7.2 · Learning-to-rank (pointwise/pairwise/listwise)

**The idea.** Ranking objectives differ by what a training example means.

| Objective | Example says | Best when | Watch out |
|---|---|---|---|
| Pointwise | This item has label 0/1 or relevance r | Need probability or absolute label | May not optimize top-of-list ordering |
| Pairwise | Item i should outrank item j | Relative preference is cleaner | Conflicting/noisy pairs can explode |
| Listwise | This whole slate should have high metric | Top positions dominate value | More complex and metric-specific |

**Pointwise.** Each row is independent: predict click, conversion, rating, or relevance. It is simple, scalable, and probability-friendly.

**Pairwise.** Build pairs from a query/session/user where one item is preferred. RankNet/BPR-style losses push the positive item score above the negative item score. A common pairwise logistic loss is:

$$\ell(i,j)=\log\big(1+\exp(-(s_i-s_j))\big),$$

where item $i$ should outrank item $j$. If $s_i$ is already much larger, the loss is small; if the skipped item scores higher than the clicked item, the loss is large.

**Listwise.** Listwise methods optimize the slate, often through a surrogate for metrics such as NDCG. NDCG gives more credit to relevant items near the top; moving a relevant item from rank 5 to rank 1 is worth much more than moving it from rank 50 to rank 46 because the discount is position-sensitive.

**Worked example — one slate, three views.** A member sees five jobs or ads. The item at rank 5 is clicked; ranks 1–4 are skipped.

- **Pointwise:** create five rows with one positive and four negatives.
- **Pairwise:** create pairs `(clicked item > skipped item)` for each skipped item.
- **Listwise:** evaluate the whole reordered slate with NDCG@k and put most pressure on moving the clicked/relevant item into the top positions.

```python
pairs = []
for skipped in skipped_items:
    pairs.append((clicked_item, skipped))
assert len(pairs) == len(skipped_items)
```

**Break case.** Clicks are noisy. A user may skip a relevant item because it was below the fold or click a low-quality item by accident. Pairwise labels built from noisy clicks can conflict: A beats B in one session, B beats A in another. Good ranking pipelines use debiasing, minimum exposure rules, or listwise metrics rather than assuming every observed click is pure preference.

**You'll be able to say:** *"Pointwise learns an absolute label per item; pairwise learns that one item should outrank another; listwise optimizes the whole ordered slate or a metric surrogate such as NDCG. Pairwise losses like RankNet/BPR push preferred scores above non-preferred scores, while listwise methods matter when top-of-list positions dominate value."*

---

## M7.3 · Multi-objective ranking & CTR architectures

**The idea.** Real rankers rarely optimize only clicks. A LinkedIn feed, ads, jobs, or Creator Marketplace ranker might care about click, dwell, conversion, predicted value, negative feedback, quality, diversity, and budget pacing. Modern architectures often share a backbone and emit multiple heads.

A simple combined serving score is genuine only if each term has a meaningful unit:

$$\text{score}=w_c\,p(\text{click})+w_d\,p(\text{dwell})+w_v\,\mathbb{E}[\text{value}]-w_q\,\text{risk}.$$

The weights encode product value or business tradeoffs. The heads must be calibrated or normalized; raw dwell seconds can swamp click probability if you add them directly.

**Common CTR-family architectures.**

| Architecture | Main idea | Useful for |
|---|---|---|
| Wide&Deep | Memorized crosses + deep generalization | Sparse IDs plus known crosses |
| DeepFM | Factorization-machine interactions + deep net | Learned low-order crosses |
| DCN/DCN-V2 | Explicit cross layers | Efficient feature crossing |
| DLRM | Embedding tables + dense interactions | Production-scale sparse CTR |
| Shared-bottom multi-head | One backbone, several heads | Click+dwell+value tasks |

**Worked example — one candidate, multiple heads.** Suppose an Event Ad candidate has calibrated outputs `pClick=0.030`, `pDwell=0.120`, and expected downstream value `0.40 value units`. A product score might use 0.7, 0.2, 0.1 weights after putting heads on compatible units:

$$0.7\cdot0.030+0.2\cdot0.120+0.1\cdot0.400=0.085.$$

If another head is raw dwell seconds, say 18.0, then `0.2 * 18.0 = 3.6` swamps the probability terms. That is not a sophisticated multi-objective ranker; it is a unit mismatch.

```python
score = 0.7 * 0.030
score += 0.2 * 0.120
score += 0.1 * 0.400
assert round(score, 3) == 0.085
```

**Score→auction link.** In ads, a serving score often combines pCTR with bid, quality, pacing, or expected value. In organic recommendation, it may combine engagement probability with member value and guardrails. The ML score is not the whole mechanism; it is an input to a serving rule whose units must be understood.

A good multi-objective review asks:

- Is each head calibrated or otherwise put onto a comparable scale?
- Is each weight a product value choice rather than an accidental numeric scale?
- Are guardrails represented as constraints when they should not be traded away?
- Does changing a weight produce an understandable slate change?


**You'll be able to say:** *"Modern rankers often share a backbone and predict several heads: click probability, watch or dwell probability, conversion/value, or quality constraints. The serving score combines calibrated heads with business weights or auction values. Wide&Deep memorizes crosses plus generalizes, DeepFM/DCN learn crosses, and DLRM is a production-scale embedding-and-interaction CTR architecture."*

---

## Resources
- Google — Recommendation Systems course (scoring & ranking stage)
- Tie-Yan Liu — Learning to Rank for Information Retrieval (book)

## Papers
- Practical Lessons from Predicting Clicks on Ads at Facebook (He et al., 2014)
- Wide & Deep (Cheng et al., 2016)
- DeepFM (Guo et al., 2017)
- DCN-V2 (Wang et al., 2021)
- DLRM (Naumov et al., 2019)
