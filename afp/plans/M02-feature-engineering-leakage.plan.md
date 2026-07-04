# Module Plan — M2 · Feature engineering & leakage

| Field | Value |
|---|---|
| Domain | Domain 0 · ML Foundations |
| Skip if you can already… | explain target leakage and build a leak-free feature/label join, know how to handle and normalize categorical, numerical, float features |
| Maps to (projects) | all |
| Primary structure(s) | S6 Applied Engineering / Pitfall (with S7 Systems flavor in M2.5) |
| Example type | ⚑ Both |
| Sub-lessons | 5 |
| Notebooks | 5 |

## Module hub (the "complete list")
Feature engineering is where most production wins — and most quiet disasters — happen. The module
breaks into five focused sub-lessons so each craft skill gets a full treatment, a worked example,
and its own notebook. The thread tying them together is one serving-time contract: every feature
must be computable at prediction time from only what was known then.

- M2.1 · Target leakage
- M2.2 · Point-in-time feature/label joins
- M2.3 · Categorical features (encoding low/high cardinality)
- M2.4 · Numeric & float features (scaling, transforms, missing values)
- M2.5 · Train/serve skew & the feature contract

## Questions this module answers (→ which sub-lesson teaches the answer)
- What is target leakage and its forms (label, look-ahead, train-test contamination, group, aggregation)? → M2.1
- How do you detect leakage (near-perfect offline scores, offline↔online gap, one dominant feature)? → M2.1
- What is a point-in-time / as-of feature-label join and the freeze-time rule? → M2.2
- How do you define a label + attribution window, and handle delayed/censored labels? → M2.2
- Categorical encodings (one-hot, ordinal, count, target/OOF + smoothing, hashing, embeddings); rare/OOV/missing; cardinality? → M2.3
- Numeric/float: scaling, log/Box-Cox/Yeo-Johnson, binning, outliers, missing + indicator — fit on train only? → M2.4
- What is train/serve skew (vs drift) and how do you keep offline == online? → M2.5

_Every question maps to a sub-lesson (coverage confirmed below)._

## Concepts (ƒ = genuine, central formula)
- Feature pipeline φ(H_t) **ƒ**; freeze time t vs label time t+Δ
- Target leakage + its 5 forms; leakage detection signals
- Point-in-time / as-of join **ƒ** (indicator sum); attribution window; delayed/censored labels
- Categorical: one-hot, ordinal, count/frequency, target encoding + smoothing **ƒ**, out-of-fold encoding, hashing trick, embeddings, rare/OOV/missing bucket, cardinality management
- Numeric: z-score **ƒ**, min-max, robust/IQR scaling, log1p/Box-Cox/Yeo-Johnson, binning, winsorizing, imputation + missingness indicator, fit-on-train discipline; feature crosses
- Train/serve skew vs drift (prose — no manufactured formula); feature store; versioning; log-at-serving; PSI/KS **ƒ**

## Sub-lessons

### M2.1 · Target leakage  —  [S6 Applied, ⚑]
- **Makes answerable:** what leakage is + its forms; how to detect it.
- **You'll be able to say:** "Leakage = a feature depending on the label or on anything unknown at prediction time; its forms are label, look-ahead, train-test contamination, group, and aggregation leakage. I spot it from a near-perfect offline metric, a big offline↔online gap, and one dominant feature, and I confirm it with the freeze-time question."
- **Concepts:** φ(H_t) **ƒ**, the 5 forms, freeze-time question, detection signals.
- **Key Idea focus:** the correct freeze-time discipline + the failure it prevents.
- **Worked-example shape:** naive → break → fix → scale. Spot the leaky column in an ads impressions table; drop it; watch AUC fall from implausible to honest.
- **Notebook:** Yes — inject a near-copy-of-label feature, train honest vs leaky, `assert` the leaky AUC is implausibly high and the gap is large; bar chart of honest vs leaky AUC. Break case = the label-copy feature.
- **Real numbers:** leaky AUC ~0.98 vs honest ~0.72 (gap 0.26); base-rate log-loss floor.

### M2.2 · Point-in-time feature/label joins  —  [S6 Applied, ⚑]
- **Makes answerable:** the as-of join + freeze-time rule; label/attribution window; delayed/censored labels; temporal vs grouped splits.
- **You'll be able to say:** "Freeze features at time t using only events with timestamp < t (an as-of join), then attach the label observed over [t, t+Δ]. Rows whose window hasn't elapsed are censored — exclude or model them. Split by time (and by entity) so the future and shared entities can't leak."
- **Concepts:** as-of join **ƒ** (indicator sum), attribution window, delayed labels, temporal/grouped split.
- **Key Idea focus:** compute each aggregate from strictly-prior events.
- **Worked-example shape:** naive join (leaks) → correct `merge_asof` → verify feature no longer correlates with the future label.
- **Notebook:** Yes — tiny impressions + clicks event log; leaky join vs `pandas.merge_asof`; `assert` the leaky feature correlates with the label while the correct one does not. Break case = a naive equi-join on campaign id.
- **Real numbers:** a pre-impression click count computed with `< t_i` vs an all-time count; correlation before/after.

### M2.3 · Categorical features (encoding low/high cardinality)  —  [S6 Applied, ⚑]
- **Makes answerable:** the encodings and when each; smoothed OOF target encoding; rare/OOV/missing; cardinality.
- **You'll be able to say:** "Low cardinality → one-hot; ordinal only when order is real; medium → count or smoothed target encoding; very high (IDs) → hashing or embeddings. Target encoding must be out-of-fold and smoothed toward the global mean, or it leaks. Always keep an OOV and a missing bucket."
- **Concepts:** one-hot, ordinal, count, target encoding + smoothing **ƒ**, OOF, hashing, embeddings, rare/OOV/missing bucket.
- **Key Idea focus:** match encoder to cardinality + model; why target encoding must be OOF + smoothed.
- **Worked-example shape:** naive in-fold target encoding (leaks) → OOF + smoothing (does not) → hashing/embeddings for very high cardinality.
- **Notebook:** Yes — one-hot vs target encoding; `assert` in-fold target encoding is suspiciously correlated with the label while OOF is not; one-hot dimensionality blow-up count. Break case = in-fold target encoding.
- **Real numbers:** e.g. 25 countries + 80,000 campaign ids → one-hot adds 80,025 columns; smoothed value `(n_c·ȳ_c + m·ȳ)/(n_c+m)` for two categories.

### M2.4 · Numeric & float features (scaling, transforms, missing values)  —  [S6 Applied, ⚑]
- **Makes answerable:** scaling family; skew transforms; binning; outliers; missing + indicator; fit-on-train.
- **You'll be able to say:** "Standardize/min-max/robust-scale for linear and neural models (trees don't need it); log1p/Box-Cox/Yeo-Johnson for skew; winsorize outliers; impute missing values and add a missingness indicator. Fit every statistic (μ, σ, quantiles, imputers) on the train fold only, then apply — fitting on all data leaks."
- **Concepts:** z-score **ƒ**, min-max, robust/IQR, log1p/Box-Cox/Yeo-Johnson, binning, winsorize, imputation + indicator, fit-on-train discipline.
- **Key Idea focus:** make skewed/float signals useful and honest — statistics fitted on train only.
- **Worked-example shape:** standardize + log1p a skewed feature; fit μ/σ on train, apply to a val row; show fitting on all data leaks.
- **Notebook:** Yes — StandardScaler fit on train vs on all data; `assert` the train-only transform ignores val statistics; log1p on a skewed spend column. Break case = scaler fit on all rows.
- **Real numbers:** train spend {0, 9, 99, 999} → log1p {0, 2.303, 4.605, 6.908}; a val outlier at 9999.

### M2.5 · Train/serve skew & the feature contract  —  [S6 Applied + S7 Systems, ⚑]
- **Makes answerable:** skew vs drift; skew sources; feature store; versioning; log-at-serving.
- **You'll be able to say:** "Skew = offline and online compute the feature differently for the same request (a feature-definition bug); drift = the population changes over time under the same definition. Fix skew by defining the feature once and serving it consistently (feature store), versioning it, and logging served values to train on exactly what production used."
- **Concepts:** train/serve skew vs drift (**prose — no manufactured contract equation**); feature store; versioning; log-at-serving; PSI **ƒ** as a drift signal.
- **Key Idea focus:** the same feature function must run offline and online; skew is a feature-definition bug.
- **Worked-example shape:** compute a feature two ways (offline 7-day window vs online 1-day) → show the prediction gap → unify the definition.
- **Notebook:** Yes — reproduce a window-mismatch skew, `assert` the offline/online predictions diverge, then unify and show the gap close; optional PSI between offline/online distributions. Break case = the window mismatch.
- **Real numbers:** with score `s = -2 + 0.08c`, 7-day count 120 → 7.6 vs 1-day count 30 → 0.4, a 7.2 logit-point gap.

## Decision guide
Encoder choice by cardinality/model (M2.3): low-cardinality → one-hot; medium → target/OOF or count;
very high (IDs) → hashing or embeddings; trees tolerate ordinal, linear/NN do not.

## Coverage check
All 7 module questions map to a sub-lesson: leakage forms + detection → M2.1; as-of join + labels → M2.2; categorical → M2.3; numeric/float → M2.4; train/serve skew → M2.5. No gaps.

## Resources (from the guide)
- Google — Rules of Machine Learning (the field guide to features that don't leak)
- Feature Engineering for Machine Learning (Zheng & Casari) — encodings, binning, scaling in depth

## SOTA papers (from the guide)
- Practical Lessons from Predicting Clicks on Ads at Facebook (He et al., 2014)

## Notes / caveats
- **Do not manufacture math in M2.5** — train/serve skew is an engineering concept; keep the
  definition prose. The genuine ƒ here is PSI (drift), not a "contract equation".
- Reuse the repo's existing `tools/fe-demos/` "reproduce the problem → apply the fix" spirit.
- Notebooks are CPU-only, seeded, one statement per line, with a real `assert` each.
