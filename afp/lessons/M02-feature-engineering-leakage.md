# M2 · Feature engineering & leakage
> **Domain:** Domain 0 · ML Foundations · **Maps to:** all · **Skip if you can already…** explain target leakage and build a leak-free feature/label join, and handle and normalize categorical, numerical, and float features.

## Overview

Feature engineering is where most production wins — and most quiet disasters — happen. The disasters are quiet because they make the offline numbers look *better*, not worse. This module is built around one serving-time contract: **every feature must be computable at the moment you make the prediction, from only what was known then.** Break that contract and a model that looked brilliant offline turns ordinary online.

**By the end you can answer:**
- What is target leakage, and what are its forms?
- How do you detect leakage?
- What is a point-in-time (as-of) feature/label join, and the freeze-time rule?
- How do you define a label and its attribution window, and handle delayed labels?
- How do you encode categorical features (and why must target encoding be out-of-fold)?
- How do you scale and transform numeric/float features without leaking?
- What is train/serve skew (vs drift), and how do you keep offline == online?

Five sub-lessons:

- **M2.1 Target leakage** — spotting the answer hidden in a feature.
- **M2.2 Point-in-time feature/label joins** — the as-of rule.
- **M2.3 Categorical features** — encoding low- and high-cardinality signals.
- **M2.4 Numeric & float features** — scaling, transforms, missing values.
- **M2.5 Train/serve skew & the feature contract** — keeping offline == online.

---

## M2.1 · Target leakage

**The idea.** Build a row at feature-freeze time $t$ from the history $H_t$ available then, giving features $x_t = \phi(H_t)$; the label $y_{t+\Delta}$ is observed later. The pipeline has **target leakage** if any coordinate of $x_t$ depends on $y_{t+\Delta}$ or on anything observed after $t$.

**The five forms:** *label* leakage (a feature is a function of the outcome), *look-ahead* leakage (post-$t$ data), *train-test contamination* (fitting a transform on all rows before splitting), *group* leakage (the same entity in train and validation), and *aggregation* leakage (a global statistic that includes the row's own future).

**Detection signals:** an implausibly high offline metric (AUC near 1.0), a large offline-to-online gap, and one feature dominating importance.

**Worked example — reproduce the leak, then fix it.** An ads click table has one row per impression: `impression_time`, `clicked_24h` (the label), `campaign_id`, `member_country`, `campaign_clicks_24h_after`, and `campaign_clicks_7d_before`.

```python
# Naive: include every column that correlates with the label.
X_leaky = df[["campaign_clicks_7d_before", "campaign_clicks_24h_after"]]
# -> validation AUC ~0.98  (implausible)
```

`campaign_clicks_24h_after` counts clicks *after* the impression, so it is correlated with this impression's own click — a post-outcome column.

```python
# Fix: keep only features knowable strictly before impression_time.
X = df[["campaign_clicks_7d_before"]]
# -> validation AUC ~0.72  (honest, and it survives the A/B test)
```

Dropping the leaky column moves AUC from an implausible **0.98** to an honest **0.72** — a 0.26 gap that would have vanished online.

**You'll be able to say:** *"Leakage = a feature depending on the label or on anything unknown at prediction time; its forms are label, look-ahead, train-test contamination, group, and aggregation leakage. I spot it from a near-perfect offline metric, a big offline↔online gap, and one dominant feature, and I confirm it with the freeze-time question: could I compute this at prediction time from only what was known then?"*

---

## M2.2 · Point-in-time feature/label joins

**The idea.** A feature-freeze time $t_i$ separates what you may use (before) from what you may not (after). For a click-count feature on impression $i$, the leak-free **as-of** rule is:

$$c_i = \sum_j \mathbf{1}\big[\text{campaign}(e_j) = \text{campaign}(i)\big]\,\mathbf{1}\big[\text{timestamp}(e_j) < t_i\big].$$

The label comes from an **attribution window** *after* $t_i$: e.g. "clicked within 24h" is $y_i = \mathbf{1}[\exists\ \text{click in } [t_i, t_i+\Delta)]$. Rows whose window has not fully elapsed are **censored** — exclude them or model the censoring, or you undercount positives.

**Splitting.** Split by **time** for time-ordered data (train on the past, validate on the future) and by **entity** when members/campaigns repeat, so neither the future nor a shared entity leaks across the split.

**Worked example — the leaky join vs the as-of join.** Given an impression at 10:00 with campaign clicks at 09:10, 09:40, 10:04, 10:20:

- Naive equi-join on `campaign_id` (all clicks): count = 4 — **leaks** the 10:04 and 10:20 clicks.
- As-of join (`timestamp < 10:00`): count = 2 — correct.

```python
feat = pd.merge_asof(
    impressions.sort_values("impression_time"),
    clicks.sort_values("click_time"),
    left_on="impression_time",
    right_on="click_time",
    by="campaign_id",
    direction="backward",   # only clicks strictly before the impression
)
```

The leaky feature correlates with the label; the as-of feature does not.

**You'll be able to say:** *"Freeze features at time t using only events with timestamp < t (an as-of join), then attach the label observed over [t, t+Δ]. Rows whose window hasn't elapsed are censored — exclude or model them. Split by time (and by entity) so the future and shared entities can't leak."*

---

## M2.3 · Categorical features

**The idea.** A categorical feature takes values from a finite set. **Nominal** has no order (campaign id, country); **ordinal** has a real order (small/medium/large) — order-preserving encoding is valid only then.

| Encoder | Best for | Watch out for |
|---|---|---|
| One-hot | low cardinality | dimensionality blow-up at high cardinality |
| Ordinal / label | trees | misleading for linear/NN (implies a fake order) |
| Count / frequency | medium cardinality | ties between equally-frequent categories |
| Target (mean) encoding | medium cardinality, strong signal | **leaks unless out-of-fold + smoothed** |
| Feature hashing | very high cardinality | collisions (fixed width) |
| Embeddings | very high cardinality IDs | needs a model to learn them |

**Smoothed target encoding** shrinks a category's mean toward the global mean so rare categories aren't trusted blindly:

$$\hat{y}_c = \frac{n_c\,\bar{y}_c + m\,\bar{y}}{n_c + m}.$$

It must be computed **out-of-fold** (encode each fold using the *other* folds' statistics), or it leaks the label.

**Worked example — target encoding that leaks vs one that doesn't.** With 25 kept countries and 80,000 campaign ids, one-hot adds **80,025** columns — impractical, so hash or embed campaign id. For target encoding: naive in-fold encoding of a rare campaign (2 rows, both clicked) gives $\hat{y}=1.0$ — a perfect predictor that vanishes out-of-fold. Smoothed OOF with $m=20,\ \bar{y}=0.06$: $\hat{y} = (2\cdot1.0 + 20\cdot0.06)/(2+20) = 0.145$ — honest.

**You'll be able to say:** *"Low cardinality → one-hot; ordinal only when order is real; medium → count or smoothed target encoding; very high (IDs) → hashing or embeddings. Target encoding must be out-of-fold and smoothed toward the global mean, or it leaks. Always keep an OOV and a missing bucket."*

---

## M2.4 · Numeric & float features

**The idea.** Raw numeric signals need scaling and, for skewed distributions, a transform — but **every fitted statistic must come from the training fold only.**

- **Scaling:** z-score $z = \dfrac{x - \mu_{\text{train}}}{\sigma_{\text{train}}}$; min-max; robust (median/IQR) for outlier-heavy data. Linear and neural models need scaling; trees do not.
- **Skew transforms:** `log1p`, Box-Cox, Yeo-Johnson (handles zeros/negatives). Ad-spend and engagement counts are heavy-tailed and almost always need one.
- **Outliers:** winsorize/clip.
- **Missing values:** impute (median/model) **and add a missingness-indicator column** — the fact that a value was missing is often signal.

**Worked example — fit on train only.** Train spend $\{0, 9, 99, 999\}$ → `log1p` → $\{0, 2.303, 4.605, 6.908\}$, a well-behaved feature. A validation campaign with spend 9999 becomes $\log(1{+}9999)=9.21$. Fitting the scaler on *all* rows (including that 9999) would shift $\mu,\sigma$ using validation data — train-test contamination. Fit on train, then apply.

```python
scaler.fit(X_train)          # statistics from train only
X_val = scaler.transform(X_val)   # val never influences the fit
```

**You'll be able to say:** *"Standardize/min-max/robust-scale for linear and neural models (trees don't need it); log1p/Box-Cox/Yeo-Johnson for skew; winsorize outliers; impute and add a missingness indicator. Fit every statistic (μ, σ, quantiles, imputers) on the train fold only, then apply — fitting on all data leaks."*

---

## M2.5 · Train/serve skew & the feature contract

**The idea.** A feature has **train/serve skew** when the value computed for training differs from the value the online serving path computes for the same request. It is a **feature-definition bug**, not a modeling bug: the weights are fine, but the offline and online code paths disagree about what the feature means.

**Skew is not drift.** Skew is an offline-vs-online mismatch *at one point in time*. **Drift** is the data changing *over time* under the same definition. Fix skew by unifying the definition; handle drift with monitoring and retraining. A common drift signal is **PSI** $= \sum_i (a_i - e_i)\log(a_i/e_i)$ between two distributions.

**Sources of skew:** separate offline and online code paths, time-zone or unit mismatches, different missing defaults, aggregation windows that don't match, stale online features. The durable fixes: define each feature once and serve it consistently (a **feature store**), version the definition, and **log the served feature values** so training uses exactly what production used.

**Worked example — a window mismatch.** Training uses `campaign_clicks_window` = clicks in the last **7 days**, but the online service returns the last **1 day**. With a one-feature score $s = -2 + 0.08c$: a campaign with 120 clicks in 7 days scores $-2+0.08(120)=7.6$ offline, but 30 clicks in 1 day scores $-2+0.08(30)=0.4$ online — a **7.2 logit-point gap** from nothing but the window. The fix is not the model: unify on one window definition and serve it from one place.

**You'll be able to say:** *"Skew = offline and online compute the feature differently for the same request (a feature-definition bug); drift = the population changes over time under the same definition. Fix skew by defining the feature once and serving it consistently (feature store), versioning it, and logging served values to train on exactly what production used."*

---

## Resources
- **Google — Rules of Machine Learning** — the field guide to features that don't leak.
- **Feature Engineering for Machine Learning** (Zheng & Casari) — encodings, binning, scaling in depth.

## Papers
- **Practical Lessons from Predicting Clicks on Ads at Facebook** (He et al., 2014).
