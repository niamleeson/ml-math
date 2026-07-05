# M10 · Learning with sparse & implicit labels (recsys)
> **Domain:** Domain 1 · Core: Ranking & Evaluation · **Maps to:** Creator Marketplace AI · **Skip if you can already…** train a recsys model on implicit feedback with principled negatives + debiasing

## Overview

Implicit feedback is abundant and ambiguous. A click, save, reply, or creator contact is positive evidence; a missing click is not proof of dislike. The system may never have exposed the item, may have buried it at a low position, or may still be waiting for delayed feedback. This module teaches how to build training examples without pretending the unobserved universe is fully labeled.

**By the end you can answer:**
- What is implicit feedback, and how does PU learning frame positives plus unlabeled examples?
- How do you construct negatives with uniform, popularity, in-batch, or hard negative sampling?
- What is sampling-bias correction such as logQ, and why is it needed?
- What are position, selection, and delayed-feedback bias, and how does IPS debiasing work?
- How do semi-supervised learning and augmentation help sparse implicit-label settings?
- How do you evaluate recall@k without true negatives?

Two sub-lessons:

- **M10.1 Implicit feedback & principled negatives** — PU framing, samplers, logQ, and recall@k caveats.
- **M10.2 Debiasing** — exposure, position, delay, IPS, and sparse-label augmentation.

---

## M10.1 · Implicit feedback & principled negatives (PU, negative sampling, logQ correction)

**The idea.** In Creator Marketplace AI, a brand contacting a creator, saving a profile, or replying is implicit positive feedback. But if the brand did not contact 99,999 other creators, that does not mean all 99,999 were disliked. Most are simply unlabeled or unexposed.

PU learning treats the data as **positive + unlabeled**, not positive + true negative. The training pipeline must decide which unlabeled examples to compare against positives and must remember how those examples were sampled.

**Everyday analogy.** If a shopper buys one cereal and ignores 200 others, that does not mean they disliked all 200. Many boxes were on a lower shelf, hidden behind a display, or never noticed. Implicit feedback treats the purchase as positive evidence and the missing purchases as unlabeled; negative sampling is choosing a few plausible comparisons without pretending every unchosen box is a thumbs-down.

The key vocabulary is:

- **Positive:** observed action, such as contact or save.
- **Unlabeled:** no observed action; may be negative, unseen, delayed, or simply unknown.
- **Sampled negative:** an unlabeled item chosen for training contrast.
- **False negative:** a sampled negative the user would actually like.


**Naive → break.** Treat every unobserved creator as a negative. A brand has 1 positive creator interaction among **100,000** possible creators. The naive dataset says one positive and **99,999 negatives**. Many of those "negatives" are creators the brand never saw, never had time to evaluate, or might have liked if exposed.

**Fix with principled negative sampling.**

| Sampler | Draws negatives from | Useful for | Watch out |
|---|---|---|---|
| Uniform | Catalog evenly | Broad coverage | Often too easy |
| Popularity | More popular/exposed items | Realistic confusions | Overrepresents head creators |
| In-batch | Other positives in batch | Efficient two-tower training | Batch defines distribution |
| Hard negatives | Items model almost likes | Fine discrimination | False negatives, instability |

**Concrete negative-sampling examples.**

- **Uniform/random:** for one contacted creator, draw 20 creators uniformly from the eligible catalog; this may produce many obviously unrelated creators.
- **Popularity:** draw negatives proportional to exposure count, so a creator shown 100× more often is sampled about 100× more often; this matches common confusions but overweights the head.
- **In-batch:** in a batch of 128 brand→creator positives, use the other 127 creators as negatives for each brand; efficient, but the batch composition defines $Q(i)$.
- **Hard negatives:** retrieve creators the current model scores highly but the brand did not contact; useful for fine distinctions, but some may be future positives.

Popularity sampling may draw a head creator **100×** more often than a tail creator. That can be good for realism, but the loss must know the sampling distribution.

**Sampling-bias correction.** If negatives are sampled from distribution $Q(i)$, logQ correction adjusts logits so the model does not learn that frequently sampled items are inherently more negative or more positive. A common correction subtracts the log sampling probability:

$$s_i^{corr}=s_i-\log Q(i).$$

The exact implementation depends on the loss, but the purpose is stable: account for the sampler's artificial frequency.

```python
score = model(user, item)
score_corrected = score - log_q[item]
loss = binary_loss(score_corrected, label)
```

**Semi-supervised and augmentation.** Sparse implicit-label settings can use content augmentations, pseudo-labels from high-confidence teachers, or consistency training. These help only if they do not convert unknowns into fake certainties. Treat augmented positives and pseudo-labels with thresholds, weights, and validation against observed outcomes.

**Recall@k without true negatives.** Evaluate recall@k against held-out observed positives and eligible candidate sets. Say what universe was used: all catalog items, sampled negatives, exposed items, or eligible creators. Without true negatives, recall@k is "did we retrieve known positives?" not "did we perfectly recover all preferences?"

A clear recall@k table names the candidate universe:

| Evaluation universe | Interpretation |
|---|---|
| Sampled negatives | Fast debug metric, optimistic |
| Full eligible catalog | Retrieval stress test |
| Exposed items only | Less selection bias, narrower truth |
| Randomized bucket | Best audit when available |


**Worked example — Creator Marketplace candidate training.** For each brand→creator positive, sample 20 negatives: 10 uniform, 5 popularity-weighted, 5 hard negatives from the current model. Record each negative's $Q(i)$. Train with corrected logits. Evaluate recall@50 on held-out contacted creators, and report that the metric is over observed positives, not over every creator the brand would have liked.

A small audit before training:

- Count positives per brand and per creator.
- Compare sampled-negative popularity with catalog popularity.
- Estimate how often hard negatives later become positives.
- Keep the sampler version in the training data.


**You'll be able to say:** *"Implicit data has observed positives and many unlabeled pairs, not clean negatives. PU learning treats unobserved examples carefully; negative sampling chooses comparison items by a known distribution such as uniform, popularity, in-batch, or hard negatives. If the training sampler differs from the serving/catalog distribution, logQ-style correction subtracts the sampling probability effect so frequent sampled items are not unfairly favored."*

---

## M10.2 · Debiasing (position/selection/delayed, IPS)

**The idea.** Implicit feedback is filtered by the old system. Items at top positions get more attention. Items never selected by the old policy have no chance to get clicked. Fresh positives may arrive after the training snapshot. These are not random missing labels; they are biased observations.

**Everyday analogy.** A store's eye-level shelf gets more sales partly because it is eye-level, not because every product there is better. Products in the back room cannot be bought at all, and a customer who plans to return tomorrow has not failed to buy yet. Position bias, selection bias, and delayed feedback are those same effects in logs, so debiasing asks what would have happened under fairer exposure and enough time.

**Three biases.**

| Bias | What happens | Failure |
|---|---|---|
| Position | Top-ranked items get more exposure | Model confuses visibility with preference |
| Selection | Old policy chooses what can be observed | Unshown items look worse or invisible |
| Delayed feedback | Positives arrive later | Fresh rows are mislabeled negative |

**Concrete bias examples.**

- **Position bias:** the same creator gets CTR 3% at rank 1 and 0.5% at rank 10 mostly because rank 1 is visible above the fold.
- **Selection bias:** the old policy never shows new creators to enterprise brands, so logs contain no evidence that those brands might like them.
- **Delayed feedback bias:** a brand views a creator on Monday and contacts on Friday; a Wednesday training snapshot would incorrectly mark that row negative.

**Naive → break.** Compute observed CTR or recall directly from logged slates. Position 1 has high CTR, position 10 has low CTR. The model learns "position 1 items are better" even if they were clicked because they were visible. Or it evaluates a new creator poorly because the previous policy never showed that creator to relevant brands.

**Fix with propensities and IPS.** If the logging system records the probability $\pi_i$ that an item was exposed, inverse propensity scoring weights observed outcomes by the inverse of that probability:

$$\hat R_{IPS}=\frac{1}{n}\sum_{i=1}^{n}\frac{y_i}{\pi_i}.$$

A click at position 1 with propensity **0.8** gets weight **1.25**. A click at position 10 with propensity **0.05** gets weight **20**. That large weight is why IPS can have high variance; clipping trades some bias for lower variance.

```python
weight = 1.0 / propensity
weight = min(weight, clip_value)
ips_contribution = weight * label
```

**Scale with diagnostics.** Always inspect the propensity distribution and the weight distribution. If many propensities are tiny, IPS estimates may be dominated by a few examples. Use clipping, self-normalized IPS, randomized exploration buckets, or doubly robust estimators when available.

IPS diagnostics should include:

- minimum and percentile propensities,
- maximum unclipped and clipped weights,
- effective sample size, and
- metric sensitivity to the clipping threshold.


**Delayed feedback.** Do not mark pending outcomes as negatives. For contact, conversion, or event registration labels, use mature attribution windows or delay models. Fresh cohorts can be monitored separately from mature-label training.

For Creator Marketplace, a brand may view a creator today, save tomorrow, and contact next week. A training snapshot taken too early turns that future positive into a false negative. The label policy must say when a row is mature enough to train on.

The safe rule mirrors point-in-time feature joins: score at exposure time, then wait for the agreed outcome window before using the row as labeled training data.



**Semi-supervised and augmentation under bias.** Augment content, use teacher pseudo-labels, or propagate labels through similar creators only after checking exposure. A pseudo-negative for a creator the brand never saw is still not a true negative. Augmentation should increase robustness, not hide logging bias.

**Recall@k under bias.** Report recall@k on held-out observed positives, ideally from randomized or less biased exposure when possible. If the test set only contains what the old policy showed, the metric favors the old policy's region of the catalog. Make that limitation explicit.

**Worked example — naive vs IPS.** A logged Creator Marketplace slate shows creators at positions with propensities 0.8, 0.4, 0.2, 0.1, 0.05. A tail creator clicked at the last position contributes 20 under IPS; the same click at the top contributes 1.25. Clipping at 10 reduces variance while admitting some bias. In a randomized-truth simulation, the IPS estimate should be closer to the randomized estimate than the naive observed CTR, but the clipped and unclipped estimates should both be reported.

**You'll be able to say:** *"Observed implicit labels are filtered by what the system exposed and where it placed items. Position bias makes top items more likely to be clicked, selection bias hides items the old policy never showed, and delayed feedback makes fresh positives look negative. IPS reweights observed outcomes by exposure propensity so evaluation or training better estimates what would have happened under less biased exposure, but high-variance weights need clipping and diagnostics."*

---

## Resources
- implicit (library) docs (ALS/BPR on implicit feedback)
- BPR paper (Rendle et al.) (pairwise objective for implicit data)

## Papers
- BPR: Bayesian Personalized Ranking (Rendle et al., 2009)
- Sampling-Bias-Corrected Neural Two-Tower (Yi et al., 2019)
- PU-Learning survey (Bekker & Davis, 2020)
- Modeling Delayed Feedback in Display Advertising (Chapelle, 2014)
