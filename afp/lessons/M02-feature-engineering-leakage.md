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

**Everyday analogy.** Leakage is studying for an exam with a copy of the answer key mixed into your practice problems. You ace every practice test (offline AUC near 1.0), then fail the real exam (production), because in the real world the answer key isn't there. The whole job is to notice which "practice problems" are secretly the answer key in disguise — a feature you could not actually have known at prediction time.

**The five forms.** Leakage is one bug — a feature that "knows the answer" — but it sneaks in through five distinct doors. Learn to name each one, because the *fix* is different for each.

| Form | What leaks | Ads example | Prevention |
|---|---|---|---|
| **Label leakage** | A feature *is* the outcome, or a deterministic proxy of it | `was_charged_for_click` used to predict click | Trace each feature's provenance |
| **Look-ahead leakage** | Data timestamped *after* the freeze time $t$ | `campaign_clicks_24h_after`; today's profile snapshot | Point-in-time / as-of joins (M2.2) |
| **Train-test contamination** | A transform fit on rows outside the training fold | Scaler/target-encoder fit on all rows before the split | Fit on train only, inside a pipeline |
| **Group leakage** | The same entity sits in both train and validation | One campaign's impressions split across train & val | Group-aware or time-based splits |
| **Aggregation leakage** | A statistic computed over a span that includes the row's own future | Global `campaign_ctr` that includes this impression | Trailing windows; leave-one-out |

**One running example — watch each door open on the same three rows.** Three impressions of the *same* campaign C on Monday; we're predicting the **Clicked?** column:

| Impression | Time | Clicked? (label) |
|---|---|---|
| A | 09:00 | ✅ yes |
| B | 10:00 | ❌ no |
| C | 11:00 | ✅ yes |

**1 · Label leakage** — a feature that *is* the outcome in disguise. Add `was_charged` (the advertiser is billed only when a click lands): A = 1, B = 0, C = 1 — byte-for-byte the label. Offline AUC = 1.0; at serving the column is always 0 because billing hasn't happened yet. *Tell:* the column only *exists* because the click did. *Fix:* ask "does this value exist only because the label occurred?" → drop it.

**2 · Look-ahead leakage** — a legitimate feature read from *after* $t$. Add "clicks on C in the next 60 min." For **B** (10:00) you look forward and catch **C**'s 11:00 click → B's feature = 1, a fact that did not exist at 10:00. The subtle version: joining an entity's *today* snapshot (the member's current profile, the campaign's current budget) instead of its state at $t$. *Fix:* as-of join — only events with `timestamp < t` (M2.2).

**3 · Train-test contamination** — the features are fine, but a **transform** peeked. Z-score `bid` using $\mu,\sigma$ computed over **all three** rows, *then* split A, C → train / B → val. B's "normalized bid" was standardized using B's own value — the scaler already saw the validation row. Same bug for an imputer's mean, a target-encoding table, PCA, or a vocabulary. *Fix:* fit every transform on the **train fold only**, then apply to B; wrap it in a pipeline so it can't be forgotten (M2.4).

**4 · Group leakage** — the same entity on both sides of the split. Random-split the rows: A, C → train, B → val. All three are campaign C, so the model just learns "C clicks ~67%" and recites 0.67 for B — looks predictive, then collapses on a genuinely new campaign at serving. *Fix:* keep all of C on one side (`GroupKFold` by campaign/member), or split by time.

**5 · Aggregation leakage** — a summary that swallows the row itself or its future. Feature = C's CTR over the three rows = $2/3 = 0.67$, pasted on A, B, C alike. **B**'s 0.67 was built partly *from B's own outcome* (and from C's later click). Note the contrast with #2: this leaks **even with no clock** — B is simply inside its own average. *Fix:* aggregate only over rows strictly before $t$ **and** leave the current row out (leave-one-out; smooth for small counts, M2.3).

*(The #2-vs-#5 distinction that trips people up: look-ahead is one row peeking* forward in time*; aggregation is one row peeking at* the crowd it belongs to *— including itself. A timestamp filter fixes #2; only leave-one-out fixes the self-inclusion in #5.)*

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

**The one-line idea.** A point-in-time (or *as-of*) join attaches to each training row the feature value **as it was at that row's own prediction moment** — not today's value, and not a value computed over the whole history. Every row gets its features "frozen" at a different instant.

**Why a normal join quietly leaks.** Your labels live in an event log (one row per impression, each with its own timestamp), but your *features* usually live in a table that holds either **(a)** the latest value ("campaign 12345 has 5,000 total clicks") or **(b)** every event for that key. Join the two on `campaign_id` the normal way and you staple *today's* number — or a count over *all* clicks, including ones that happened after the impression — onto a row from three weeks ago. The model trains on a number no one could have known at serving time. That is look-ahead leakage arriving through the join itself.

**The mental model: rewind the world to $t$.** Think of grading a weather forecaster. To score the forecast they made *yesterday morning*, you must use only what they knew *yesterday morning* — not the rain you can now see fell that afternoon. An as-of join does exactly this: for a row whose prediction happened at time $t$, it rewinds every feature table to its state at $t$ and reads the value from then. Different rows rewind to different instants.

**Two clocks: features look back, labels look forward.** The freeze time $t_i$ is the divider. Features may only see events *before* $t_i$; the label is only allowed to see events *after* it. For a campaign-click feature on impression $i$, the leak-free rule is a **backward** sum:

$$c_i = \sum_j \mathbf{1}\big[\text{campaign}(e_j) = \text{campaign}(i)\big]\,\mathbf{1}\big[\text{timestamp}(e_j) < t_i\big].$$

The label comes from a forward **attribution window**: "clicked within 24h" is $y_i = \mathbf{1}[\exists\ \text{click in } [t_i,\ t_i+\Delta)]$. Same event log, opposite directions in time.

**Censoring: why the most recent rows are traps.** Because the label looks *forward* by $\Delta$, a row whose window has not fully elapsed yet is **censored** — a "no-click" there might just mean "the click hasn't happened *yet*." Keeping such rows undercounts positives and teaches the model to be pessimistic. Fix: drop rows newer than $\text{now} - \Delta$, or model the censoring explicitly.

**Splitting.** Split by **time** for time-ordered data — train on the past, validate on the future — so the split mirrors how the model runs in production. Also split by **entity** when the same member or campaign repeats, so a shared entity can't sit on both sides (group leakage, from M2.1).

**Worked example — the leaky join vs the as-of join.** Given an impression at 10:00 with campaign clicks at 09:10, 09:40, 10:04, 10:20:

- Naive equi-join on `campaign_id` (all clicks for the campaign): count = 4 — **leaks** the 10:04 and 10:20 clicks that happened *after* the impression.
- As-of join (`timestamp < 10:00`): count = 2 — correct, because it only sees the 09:10 and 09:40 clicks.

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

**Everyday analogy.** Turning labels into numbers a model can use. **Nominal** categories are like jersey colors — red/blue/green — where no color is "greater," so numbering them 1/2/3 fakes an order that isn't there (that's why nominal → one-hot, not label-encode). **Ordinal** categories are like T-shirt sizes S/M/L, where the order is real, so 1/2/3 is fine. **Target encoding** (replace a category with its average click rate) is like rating a new restaurant by its average review: trustworthy with 500 reviews, but with only 2 (both 5-star) you shouldn't crown it the city's best — you shrink toward the citywide average until it earns trust (smoothing), and you never count your own visit in its score (out-of-fold).

| Encoder | Best for | Watch out for |
|---|---|---|
| One-hot | low cardinality | dimensionality blow-up at high cardinality |
| Ordinal / label | trees | misleading for linear/NN (implies a fake order) |
| Count / frequency | medium cardinality | ties between equally-frequent categories |
| Target (mean) encoding | medium cardinality, strong signal | **leaks unless out-of-fold + smoothed** |
| Feature hashing | very high cardinality | collisions (fixed width) |
| Embeddings | very high cardinality IDs | needs a model to learn them |

**Which encoder, concretely.** Take five real ad features and watch each encoder land on the one it fits:

- **One-hot → `device`** (3 values: iOS / Android / web) → 3 binary columns. Fine because cardinality is low.
- **Ordinal → `creative_size`** (S / M / L) → 0 / 1 / 2 — valid *only* because the order is real.
- **Count / frequency → `member_country`** (25 values) → replace "US" with its share, e.g. 0.42; watch for ties between equally-frequent countries.
- **Target (mean) → `campaign_id`** (medium signal) → replace with the campaign's smoothed, out-of-fold click rate (below).
- **Hashing → `campaign_id`** (80,000 values) → hash into 4,096 buckets; accept rare collisions to bound the width.
- **Embeddings → `member_id`** (millions) → a learned 32-dim vector trained end-to-end with the model.

**Smoothed target encoding** shrinks a category's mean toward the global mean so rare categories aren't trusted blindly:

$$\hat{y}_c = \frac{n_c\,\bar{y}_c + m\,\bar{y}}{n_c + m}.$$

It must be computed **out-of-fold** (encode each fold using the *other* folds' statistics), or it leaks the label.

**Worked example — target encoding that leaks vs one that doesn't.** With 25 kept countries and 80,000 campaign ids, one-hot adds **80,025** columns — impractical, so hash or embed campaign id. For target encoding: naive in-fold encoding of a rare campaign (2 rows, both clicked) gives $\hat{y}=1.0$ — a perfect predictor that vanishes out-of-fold. Smoothed OOF with $m=20,\ \bar{y}=0.06$: $\hat{y} = (2\cdot1.0 + 20\cdot0.06)/(2+20) = 0.145$ — honest.

**You'll be able to say:** *"Low cardinality → one-hot; ordinal only when order is real; medium → count or smoothed target encoding; very high (IDs) → hashing or embeddings. Target encoding must be out-of-fold and smoothed toward the global mean, or it leaks. Always keep an OOV and a missing bucket."*

---

## M2.4 · Numeric & float features

**The idea.** Raw numeric signals need scaling and, for skewed distributions, a transform — but **every fitted statistic must come from the training fold only.**

**Everyday analogy.** Putting different measurements on a common footing before comparing. Comparing income (0–1,000,000) against age (0–100) unscaled is like comparing one distance in millimeters and another in kilometers — the big-number feature drowns out the other, so you standardize both. A log transform is the earthquake Richter scale: it compresses a heavy tail so the few campaigns that spend 100× the rest don't dominate. And "compute the scale from training data only" is the same exam discipline from M1 — your ruler ($\mu, \sigma$) must be built without peeking at the test.

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

**Everyday analogy.** A dish that tastes different from the cookbook photo — not because the chef is bad, but because the test kitchen measured "1 cup" differently than the line cook. Train/serve skew is exactly that: the model (chef) is fine, but the *offline* feature recipe and the *online* feature recipe disagree about what a feature means — e.g. "clicks in the last 7 days" versus "last 1 day." The fix isn't a better chef; it's one shared recipe card (a feature store) that both kitchens cook from.

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
