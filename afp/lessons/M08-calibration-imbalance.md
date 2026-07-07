# M8 · Calibration & class imbalance
> **Domain:** Domain 1 · Core: Ranking & Evaluation · **Maps to:** all · **Skip if you can already…** calibrate a sparse-slice model and explain why raw scores mislead

## Overview

A ranker can put candidates in a useful order and still output bad probabilities. That is dangerous in systems that multiply pCTR by bid, value, or budget logic. This module teaches the applied failure pattern: raw scores look good globally, then break on probability scale, rare positives, sparse slices, or delayed feedback.

**By the end you can answer:**
- What does "calibrated probability" mean?
- How do you measure calibration with a reliability diagram and ECE?
- Why can a model rank well but be uncalibrated, and why does that break pCTR×bid?
- When should you use Platt/sigmoid scaling vs isotonic calibration?
- How do you handle class imbalance with weighting, focal loss, or resampling?
- How do you calibrate sparse slices without overfitting tiny groups?
- What is delayed feedback bias and how does it affect calibration/labels?

Three sub-lessons:

- **M8.1 Calibration** — reliability diagrams, ECE, Platt vs isotonic, and pCTR×bid.
- **M8.2 Class imbalance** — weights, focal loss, resampling, and recalibration.
- **M8.3 Sparse slices & delayed feedback** — shrink small groups and respect label timing.

<p class="cur-colab"><a class="cur-colab-btn" href="https://colab.research.google.com/github/niamleeson/ml-math/blob/main/afp/notebooks/M08-calibration-imbalance.ipynb" target="_blank" rel="noopener">▶ Open the runnable calibration &amp; class-imbalance notebook in Google Colab</a></p>

---

## M8.1 · Calibration (definition, ECE, Platt vs isotonic; why it feeds pCTR×bid)

**The idea.** A score is calibrated if examples assigned probability 0.20 happen about 20% of the time. Calibration is about probability scale, not rank order. A reliability diagram bins predictions, then compares each bin's average predicted probability with its observed outcome rate.

**Everyday analogy.** A weather forecaster who says "70% chance of rain" should be right about 70% of the time across many such days. If it rains only 30% of those days, the forecaster may still rank stormy days above sunny days, but the probability is dishonest. Calibration asks whether the number means what it says, which is crucial when another system treats it as expected value.

Expected calibration error summarizes the bin gaps:

$$\text{ECE}=\sum_{b=1}^{B}\frac{n_b}{n}\left|\text{acc}(b)-\text{conf}(b)\right|,$$

where $\text{conf}(b)$ is the mean predicted probability in bin $b$ and $\text{acc}(b)$ is the observed positive rate.

**Naive → break.** A raw pCTR model has strong AUC because it orders candidates well. But in the bin around **0.20**, the observed CTR is **0.08**. That bin has a **12-point calibration gap**. With bid **USD 10**, raw pCTR×bid says expected value is **USD 2.00**, while calibrated pCTR×bid says **USD 0.80**. The rank order might be fine, but the auction or allocation score is wrong.

**Fix.** Fit a calibration model on held-out calibration data.

Platt scaling fits a sigmoid correction over raw score $s$:

$$p=\sigma(as+b)=\frac{1}{1+e^{-(as+b)}}.$$

Isotonic calibration fits a flexible monotone step function. Use Platt when the correction is smooth and sigmoid-shaped or data is limited. Use isotonic when you have enough calibration data and need a more flexible monotone curve.

**Concrete calibration-method examples.**

- **Platt scaling:** raw logit `s=2.0` is too confident on held-out ads; a fitted sigmoid with `a=0.5, b=-1.0` maps it to $\sigma(0)=0.50$.
- **Isotonic calibration:** scores in the 0.20–0.30 bin actually click at 0.12, while 0.30–0.40 clicks at 0.18; a monotone step curve can map those bins to 0.12 and 0.18 without forcing a sigmoid shape.
- **Temperature scaling:** logits `[2, 0]` are softened with `T=2` to `[1, 0]`; the top-class probability drops from about 0.88 to about 0.73 while the class order stays the same.

```python
raw_scores = model.predict_proba(X_cal)[:, 1]
calibrator.fit(raw_scores, y_cal)
p_cal = calibrator.predict(raw_scores)
```

**Scale.** In production, measure reliability overall and on important slices. Track ECE and the before/after pCTR×bid impact, not just AUC. A good calibration pass should reduce ECE while leaving rank metrics mostly unchanged.

A minimal calibration report includes:

- A reliability diagram before and after calibration.
- ECE and bin counts, so tiny bins do not look overconfident.
- AUC or NDCG, to confirm rank order was not harmed unnecessarily.
- A pCTR×bid or expected-value example showing the serving consequence.


**Break case.** Isotonic can overfit a tiny calibration set, creating stair-steps that look perfect in calibration data and unstable online. If the calibration set is small, prefer Platt or shrink slice calibration toward a global curve.

**You'll be able to say:** *"A score is calibrated if examples scored 0.2 happen about 20% of the time. A reliability diagram compares predicted vs observed rates by bin, and ECE summarizes the bin gaps. A monotonic transform can preserve ranking AUC while ruining probability scale; pCTR×bid needs probability scale, so use Platt when a sigmoid-shaped correction is enough and isotonic when you need a flexible monotone correction with enough calibration data."*

---

## M8.2 · Class imbalance (weights/focal/resampling)

**The idea.** Sparse positives make naive training and naive metrics misleading. At **1% positives**, an always-negative model is **99% accurate** and has **zero recall**. For click prediction, rare positives also mean gradients can be dominated by easy negatives.

**Everyday analogy.** Class imbalance is like trying to find the 6 people in a crowd of 100 who will click a link. A lazy guard can say "no one will click" and be right for most people, but they miss every person the product cares about. Weighting, focal loss, and resampling are ways to make the rare clickers loud enough during training without pretending the crowd is balanced.

**Naive → break.** Train a classifier on 1% click labels with ordinary minibatches. It learns to predict near-zero for almost everything. Accuracy looks excellent, but PR-AUC, recall at useful thresholds, and downstream candidate discovery are poor.

**Fix options.**

| Method | What it changes | Good for | Watch out |
|---|---|---|---|
| Class weighting | Loss contribution per class | Rare positives without changing data | Probability scale may shift |
| Focal loss | Downweights easy examples | Many easy negatives | Tune carefully |
| Oversampling positives | Training data balance | Simple baselines | Training prior changes |
| Undersampling negatives | Fewer easy negatives | Speed, balance | Can discard useful negatives |

**Concrete imbalance-technique examples.**

- **Class weights:** with 1% positives, set positive weight 99 and negative weight 1 so one clicked impression contributes roughly as much loss as 99 unclicked impressions.
- **Focal loss:** a negative ad impression already predicted at `p(click)=0.001` is easy, so with $\gamma=2$ its contribution is heavily downweighted compared with a confusing negative predicted at `p(click)=0.40`.
- **Oversampling positives:** duplicate or resample clicked rows until a minibatch is 50/50; useful for learning a boundary, but the raw output must be recalibrated to the real 1% prior.
- **Undersampling negatives:** keep all 10,000 clicks but sample 100,000 of 990,000 non-clicks to train faster; useful negatives are discarded unless the sampler is designed carefully.

Weighted binary loss multiplies positive and negative terms by chosen weights. Focal loss adds a factor that reduces the contribution of easy examples:

$$\text{FL}(p_t)=-\alpha(1-p_t)^\gamma\log(p_t),$$

where $p_t$ is the model probability assigned to the true class. Large $p_t$ means the example is already easy, so the loss shrinks.

**Worked example — oversampling changes the prior.** If serving traffic has **1%** positives but training oversamples positives to **50/50**, the training prior is changed by **50×**. The model may learn useful boundaries, but its raw output is no longer a serving probability. Recalibrate on a validation set with the real serving distribution before using pCTR×bid.

```python
class_weight = {0: 1.0, 1: 99.0}
model.fit(X_train, y_train, class_weight=class_weight)
p_raw = model.predict_proba(X_val)[:, 1]
```

**Scale.** Choose the method by the failure. If recall is zero, weights or focal loss can expose rare positives. If training is too slow or negatives are overwhelming, sample negatives. If probability scale matters, always evaluate calibration after changing weights, focal loss, or sampling.

The practical order is:

1. Use PR-AUC, recall, and calibration instead of accuracy alone.
2. Try class weights or focal loss when positives are ignored.
3. Use resampling when the training distribution is operationally unmanageable.
4. Recalibrate on real-prior validation data before serving probabilities.


**You'll be able to say:** *"Rare positives can make accuracy meaningless and gradients dominated by negatives. Class weights rebalance the loss, focal loss downweights easy examples, and resampling changes the training distribution; each can improve learning, but probability outputs may need recalibration because training priors were changed."*

---

## M8.3 · Calibrating sparse slices & delayed feedback

**The idea.** Global calibration can hide bad slices. A pCTR model may be calibrated overall while overpredicting in one country, underpredicting for new advertisers, or breaking on a sparse Event Ads segment. Sparse slices are noisy, and delayed feedback makes fresh labels look more negative than they really are.

**Everyday analogy.** A restaurant's average review can be accurate overall while the new brunch menu has too few reviews to judge. If two early brunch diners complain, you should not rewrite the whole menu around those two ratings; you shrink that noisy slice toward the restaurant's broader evidence. Delayed feedback is like asking for reviews before diners finish eating: silence right now is not the same as a bad review.

**Naive → break.** Calibrate every slice independently. A tiny slice has **2 clicks in 20 examples**, so observed CTR is **10%**. If the global rate is **5%**, a hard independent correction to 10% overreacts; with only 20 examples, the interval is wide.

**Fix with shrinkage.** Treat tiny-slice estimates as noisy and shrink them toward a global curve or parent segment. The lesson is operational: do not let a 20-example segment rewrite the calibration model. Use minimum-count rules, confidence intervals, hierarchical shrinkage, or pooled calibration.

| Slice size | Independent estimate | Better action |
|---:|---:|---|
| 20 | Very noisy | Shrink toward global or parent |
| 2,000 | Useful | Slice-specific calibration may be stable |
| 200,000 | Strong | Monitor and calibrate directly |

**Delayed feedback.** A click, conversion, reply, or event registration may arrive later. If you train at noon and mark all pending outcomes as negatives, fresh cohorts are biased downward. The fix is the same timing discipline as leakage prevention: define an attribution window, exclude censored rows whose window has not elapsed, or model delay explicitly.

**Worked example — global good, fresh slice bad.** Overall ECE is 0.015, but a fresh Event Ads slice has many impressions whose registration window is still open. Naively treating pending labels as negatives lowers observed CTR from the eventual **4%** to a temporary **2%**. A calibrator trained on those labels will push pCTR down exactly where pacing needs caution.

```python
is_mature = impression_time <= label_cutoff - attribution_window
train = df[is_mature]
assert train["label_window_elapsed"].all()
```

**Scale.** Report calibration by high-value slices, but combine slice estimates with shrinkage. For delayed outcomes, separate mature-label evaluation from fresh-serving monitoring. For ads, calibration feeds pCTR×bid, so sparse-slice overreaction can move budget and delivery.

A sparse-slice calibration review should flag:

- slices with too few examples for independent calibration,
- slices whose label windows are not fully mature,
- slices with large business impact even if global volume is small, and
- whether the fix changes delivery or only offline metrics.


**You'll be able to say:** *"Global calibration can hide bad slices. For sparse segments, estimate slice calibration with shrinkage toward the global curve so tiny groups do not overfit noise. Delayed feedback means some positives have not arrived yet; treating them as negatives biases probabilities downward, especially in fresh cohorts, so labels need attribution windows, censoring rules, or delay modeling."*

---

## Resources
- scikit-learn — probability calibration (Platt & isotonic with reliability curves)
- imbalanced-learn (resampling & class-weighting)

## Papers
- On Calibration of Modern Neural Networks (Guo et al., 2017)
- Focal Loss for Dense Object Detection (Lin et al., 2017)
- Modeling Delayed Feedback in Display Advertising (Chapelle, 2014)
