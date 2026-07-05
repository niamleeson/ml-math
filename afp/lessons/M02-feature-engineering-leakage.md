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

<p class="cur-colab"><a class="cur-colab-btn" href="https://colab.research.google.com/github/niamleeson/ml-math/blob/main/afp/notebooks/M02-feature-engineering.ipynb" target="_blank" rel="noopener">▶ Open the runnable notebook (20 examples + visualizations) in Google Colab</a></p>

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

<p class="cur-colab"><a class="cur-colab-btn" href="https://colab.research.google.com/github/niamleeson/ml-math/blob/main/afp/notebooks/M02-feature-engineering.ipynb" target="_blank" rel="noopener">▶ Open the runnable notebook (20 examples + visualizations) in Google Colab</a></p>

**The idea.** A categorical feature takes values from a finite set. **Nominal** has no order (campaign id, country); **ordinal** has a real order (small/medium/large) — order-preserving encoding is valid only then. All snippets below use the notebook's synthetic ads table (`train`, `valid`) with `member_country`, `device`, `creative_size`, `campaign_id`, `bid`, `spend`, `dwell_secs`, and `clicked`.

**Everyday analogy.** Turning labels into numbers a model can use. **Nominal** categories are like jersey colors — red/blue/green — where no color is "greater," so numbering them 1/2/3 fakes an order that isn't there (that's why nominal → one-hot, not label-encode). **Ordinal** categories are like T-shirt sizes S/M/L, where the order is real, so 1/2/3 is fine. **Target encoding** (replace a category with its average click rate) is like rating a new restaurant by its average review: trustworthy with 500 reviews, but with only 2 (both 5-star) you shouldn't crown it the city's best — you shrink toward the citywide average until it earns trust (smoothing), and you never count your own visit in its score (out-of-fold).

| Encoder | Best for | Watch out for |
|---|---|---|
| One-hot | low cardinality | dimensionality blow-up at high cardinality |
| Ordinal / label | trees | misleading for linear/NN (implies a fake order) |
| Count / frequency | medium cardinality | ties between equally-frequent categories |
| Target (mean) encoding | medium cardinality, strong signal | **leaks unless out-of-fold + smoothed** |
| Feature hashing | very high cardinality | collisions (fixed width) |
| Embeddings | very high cardinality IDs | needs a model to learn them |

**Golden rule:** fit the encoder on `train` only, then transform `valid` and serving rows. Target encoding needs the stricter rule: fit each training row's value out-of-fold, so the row's own label is never in its feature.

**1 · One-hot encoding — nominal, low-cardinality (`device`; notebook #1).** Input: `valid.device.head()` contains `android`, `ios`, `web`. Code:

```python
from sklearn.preprocessing import OneHotEncoder

ohe = OneHotEncoder(sparse_output=False, handle_unknown="ignore")
ohe.fit(train[["device"]])
enc = ohe.transform(valid[["device"]])
print(pd.DataFrame(enc, columns=ohe.get_feature_names_out(["device"])).head())
```

→ Output: 3 columns (`device_android`, `device_ios`, `device_web`); first rows are one 1.0 and two 0.0s. Use when a nominal feature has few values. Gotcha: one-hotting `campaign_id` creates hundreds/thousands of columns; use `handle_unknown="ignore"` for new serving categories.

**2 · Ordinal encoding — real order only (`creative_size`; notebook #2).** Input: `S`, `M`, `L`. Code:

```python
from sklearn.preprocessing import OrdinalEncoder

oe = OrdinalEncoder(categories=[["S", "M", "L"]])
_ = oe.fit_transform(train[["creative_size"]])
print("mapping:", dict(zip(["S", "M", "L"], [0, 1, 2])))
```

→ Output: `{'S': 0, 'M': 1, 'L': 2}`. Use when the order is genuine. Gotcha: for nominal IDs this invents fake distance/order.

**3 · Label-encoding pitfall — fake order on a nominal feature (`device`; notebook #3).** Code:

```python
from sklearn.preprocessing import LabelEncoder

le = LabelEncoder().fit(train["device"])
print("fake ordering imposed:", dict(zip(le.classes_, le.transform(le.classes_))))
```

→ Output: `{'android': 0, 'ios': 1, 'web': 2}`. This tells a linear model that `web > ios > android`, which is not a product fact. Use only for labels or tree models that can tolerate arbitrary category codes; for features in linear/NN models, prefer one-hot, hashing, or embeddings.

**4 · Frequency encoding — one popularity column (`member_country`; notebook #4).** Code:

```python
freq = train["member_country"].value_counts(normalize=True)
valid_freq = valid["member_country"].map(freq).fillna(0.0)
print(freq.round(3).head())
```

→ Output starts `US 0.307`, `IN 0.176`, `BR 0.117`, `GB 0.083`, `JP 0.070`. Use when category popularity is useful and you want one column. Gotcha: equally frequent categories collapse to the same value; unseen categories need a default (`0.0` here).

**5 · Naive target encoding — reproduce the leak (`campaign_id`; notebook #11).** Code:

```python
global_mean = df.clicked.mean()
leaky_map = df.groupby("campaign_id").clicked.mean()      # WRONG: uses every label
df_leaky = df.assign(camp_te=df.campaign_id.map(leaky_map))
print(df_leaky[["campaign_id", "clicked", "camp_te"]].head())
```

→ Output includes rare campaigns with `camp_te` near 0 or 1 because their own labels were included. Use this cell to recognize the bug, not in production. Gotcha: it leaks even before modeling; validation looks better than serving.

**6 · Leakage-safe smoothed target encoding — out-of-fold (`campaign_id`; notebook #16).** Smoothed target encoding shrinks a category's mean toward the global mean so rare categories aren't trusted blindly:

$$\hat{y}_c = \frac{n_c\,\bar{y}_c + m\,\bar{y}}{n_c + m}.$$

Code:

```python
from sklearn.model_selection import StratifiedKFold
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score

def smoothed_map(frame, m=20):
    g = frame.groupby("campaign_id").clicked
    gm = frame.clicked.mean()
    return (g.count()*g.mean() + m*gm) / (g.count() + m), gm

tr = train.reset_index(drop=True)
oof = np.zeros(len(tr))
for fit_idx, enc_idx in StratifiedKFold(5, shuffle=True, random_state=0).split(tr, tr.clicked):
    m_map, gm = smoothed_map(tr.iloc[fit_idx])
    oof[enc_idx] = tr.iloc[enc_idx].campaign_id.map(m_map).fillna(gm).to_numpy()
print("OOF encoded shape:", oof.reshape(-1, 1).shape)
```

→ Output: `OOF encoded shape: (3000, 1)`; the notebook shows in-fold AUC `0.849` vs honest OOF AUC `0.528`. Use when a high-cardinality category has real signal. Gotcha: for validation/serving, fit the final map on all training rows only; never use validation labels.

**7 · Feature hashing — fixed width for high cardinality (`campaign_id`; notebook #17).** Code:

```python
from sklearn.feature_extraction import FeatureHasher

fh = FeatureHasher(n_features=256, input_type="string")
buckets = np.asarray(fh.transform([[str(c)] for c in df.campaign_id]).argmax(axis=1)).ravel()
print(len(np.unique(buckets)), "used buckets for", df.campaign_id.nunique(), "ids")
```

→ Output: `198 used buckets for 793 ids` (with 256 buckets). Use when IDs are many or the vocabulary changes. Gotcha: collisions are expected; increase `n_features` to trade memory for fewer collisions.

**8 · Embeddings — dense learned ID vectors (`campaign_id`; notebook #18).** The notebook uses `TruncatedSVD` as a runnable stand-in for learned neural embeddings. Code:

```python
from sklearn.decomposition import TruncatedSVD
from sklearn.preprocessing import OneHotEncoder

ctx = OneHotEncoder(sparse_output=False).fit_transform(df[["member_country", "device", "creative_size"]])
camp_codes, camp_uniques = pd.factorize(df.campaign_id)
agg = np.zeros((len(camp_uniques), ctx.shape[1])); np.add.at(agg, camp_codes, ctx)
emb = TruncatedSVD(n_components=2, random_state=0).fit_transform(agg)
print("embedding shape (n_campaigns, dim):", emb.shape)
```

→ Output: `(793, 2)`. Use for very high-cardinality entities when the model can learn/share dense representations. Gotcha: embeddings need enough data and a training objective; cold-start IDs still need a fallback.

**9 · Encoder bake-off — same model, honest validation (`campaign_id`; notebook #20).** The practical takeaway is not "always one-hot." In the notebook's same-model comparison, `frequency` and `target (OOF)` reach AUC `0.624` with **3 total columns** (`bid`, `spend`, encoded campaign) while one-hot gets AUC `0.591` with **780 columns**; hashing(64) gets `0.595` with 66 columns. Use the smallest encoding that matches validation and serving constraints.

**Which encoder, concretely.**

- **One-hot → `device`** (3 values: iOS / Android / web) → 3 binary columns.
- **Ordinal → `creative_size`** (S / M / L) → 0 / 1 / 2 — valid only because the order is real.
- **Frequency → `member_country`** (10 countries in the notebook) → replace "US" with its train share, about 0.307.
- **Target → `campaign_id`** → smoothed, out-of-fold click rate.
- **Hashing → `campaign_id`** → fixed buckets; accept collisions to bound width.
- **Embeddings → `campaign_id` / `member_id`** → learned dense vector.

**You'll be able to say:** *"Low cardinality → one-hot; ordinal only when order is real; medium → count or smoothed target encoding; very high (IDs) → hashing or embeddings. Target encoding must be out-of-fold and smoothed toward the global mean, or it leaks. Always keep an OOV and a missing bucket."*

---

## M2.4 · Numeric & float features

**The idea.** Raw numeric signals need scaling and, for skewed distributions, a transform — but **every fitted statistic must come from the training fold only.** The ads notebook uses `bid` (bounded numeric), `spend` (heavy-tailed float), and `dwell_secs` (missing values).

**Everyday analogy.** Putting different measurements on a common footing before comparing. Comparing income (0–1,000,000) against age (0–100) unscaled is like comparing one distance in millimeters and another in kilometers — the big-number feature drowns out the other, so you standardize both. A log transform is the earthquake Richter scale: it compresses a heavy tail so the few campaigns that spend 100× the rest don't dominate. And "compute the scale from training data only" is the same exam discipline from M1 — your ruler ($\mu, \sigma$) must be built without peeking at the test.

| Technique | Best for | Watch out for |
|---|---|---|
| StandardScaler | linear/NN models needing comparable units | fit $\mu,\sigma$ on train only |
| MinMaxScaler | bounded inputs such as [0,1] | outliers squash the range |
| RobustScaler | heavy-tailed numeric features | median/IQR still must be train-only |
| `log1p` / power / quantile | skewed floats and counts | choose transforms valid for the input domain |
| Impute + indicator | missing numeric values | missingness itself may be signal |
| Binning / clipping | non-linearity and outliers | learn edges/caps on train only |

**1 · StandardScaler — z-score `bid` (notebook #5).** Scaling formula: $z = \dfrac{x - \mu_{\text{train}}}{\sigma_{\text{train}}}$. Code:

```python
from sklearn.preprocessing import StandardScaler

sc = StandardScaler().fit(train[["bid"]])
z_train = sc.transform(train[["bid"]]).ravel()
print("train mean~0:", round(z_train.mean(), 3), " std~1:", round(z_train.std(), 3))
```

→ Output: `train mean~0: -0.0  std~1: 1.0`. Use for linear/neural models. Gotcha: trees usually do not need it; fitting on all rows leaks validation statistics.

**2 · Min–max scaling — `bid` into [0,1] (notebook #6).** Code:

```python
from sklearn.preprocessing import MinMaxScaler

mm = MinMaxScaler().fit(train[["bid"]])
mtr = mm.transform(train[["bid"]]).ravel()
print("range:", round(mtr.min(), 3), "to", round(mtr.max(), 3))
```

→ Output: `range: 0.0 to 1.0`. Use when a downstream model or UI expects bounded inputs. Gotcha: one huge train value compresses everyone else; serving values outside the train range can transform below 0 or above 1.

**3 · RobustScaler — median/IQR for `spend` (notebook #7).** Code:

```python
from sklearn.preprocessing import RobustScaler

rob = RobustScaler().fit(train[["spend"]])
rob_spend = rob.transform(train[["spend"]]).ravel()
print("median after robust scaling:", round(np.median(rob_spend), 3))
```

→ Output: median is about `0.0`. Use for heavy-tailed spend or counts. Gotcha: it reduces outlier influence but does not remove impossible values; still fit only on train.

**4 · `log1p` — compress heavy-tailed `spend` (notebook #8).** Code:

```python
log_spend = np.log1p(train["spend"])
print("skew before:", round(train.spend.skew(), 2), " after:", round(log_spend.skew(), 2))
```

→ Output: `skew before: 2.0  after: -0.53`. Use for nonnegative spend, counts, and engagement. Gotcha: plain `log(x)` fails at zero; for negatives use Yeo-Johnson.

**5 · Missing-value impute + indicator — `dwell_secs` (notebook #9).** Code:

```python
from sklearn.impute import SimpleImputer

med = SimpleImputer(strategy="median").fit(train[["dwell_secs"]])
dwell_missing = valid["dwell_secs"].isna().astype(int).to_numpy()
print("median used:", round(med.statistics_[0], 2),
      "| % missing in valid:", round(dwell_missing.mean(), 3))
```

→ Output: `median used: 30.41 | % missing in valid: 0.141`. Use whenever numeric values are absent. Gotcha: impute with train median, then add the missingness flag because "missing" can itself predict clicks.

**6 · Binning — quantile buckets for `bid` (notebook #10).** Code:

```python
from sklearn.preprocessing import KBinsDiscretizer

kb = KBinsDiscretizer(n_bins=4, encode="ordinal", strategy="quantile", subsample=None)
train_bins = kb.fit_transform(train[["bid"]]).ravel().astype(int)
print("quartile edges:", np.round(kb.bin_edges_[0], 2))
```

→ Output: `quartile edges: [ 0.5   3.42  6.39  9.23 11.99]`. Use for monotonic buckets or simple non-linearity in a linear model. Gotcha: edges are learned from train; serving values outside the edge range need a defined bucket behavior.

**7 · PowerTransformer / Yeo-Johnson — make `spend` more Gaussian (notebook #13).** Code:

```python
from sklearn.preprocessing import PowerTransformer

pt = PowerTransformer(method="yeo-johnson").fit(train[["spend"]])
yj = pt.transform(train[["spend"]]).ravel()
print("skew:", round(train.spend.skew(), 2), "->", round(pd.Series(yj).skew(), 2),
      "| lambda:", round(pt.lambdas_[0], 3))
```

→ Output: `skew: 2.0 -> -0.04 | lambda: 0.201`. Use when a model benefits from roughly normal inputs. Gotcha: the learned lambda is a fitted statistic; train only.

**8 · QuantileTransformer — rank-normalize `spend` (notebook #14).** Code:

```python
from sklearn.preprocessing import QuantileTransformer

qt = QuantileTransformer(output_distribution="normal", n_quantiles=500, random_state=0)
qs = qt.fit_transform(train[["spend"]]).ravel()
print("quantile-normal shape:", qs.shape)
```

→ Output: `quantile-normal shape: (3000,)`. Use for stubborn distributions and outliers. Gotcha: it is nonlinear and rank-based, so it can wash out real distance; fit quantiles on train only.

**9 · Winsorize / clip — cap extreme `spend` (notebook #15).** Code:

```python
lo, hi = np.percentile(train.spend, [1, 99])
clipped = valid.spend.clip(lo, hi)
print(f"clip to [{lo:.1f}, {hi:.1f}] | valid max {valid.spend.max():.1f} -> {clipped.max():.1f}")
```

→ Output: `clip to [0.4, 182.9] | valid max 311.1 -> 182.9`. Use before scaling or linear models when rare extremes dominate. Gotcha: choose caps on train only and monitor how many serving rows hit the cap.

**You'll be able to say:** *"Standardize/min-max/robust-scale for linear and neural models (trees don't need it); log1p/Box-Cox/Yeo-Johnson for skew; winsorize outliers; impute and add a missingness indicator. Fit every statistic (μ, σ, quantiles, imputers) on the train fold only, then apply — fitting on all data leaks."*

---

## M2.5 · Train/serve skew & the feature contract

**The idea.** A feature has **train/serve skew** when the value computed for training differs from the value the online serving path computes for the same request. It is a **feature-definition bug**, not a modeling bug: the weights are fine, but the offline and online code paths disagree about what the feature means.

**Everyday analogy.** A dish that tastes different from the cookbook photo — not because the chef is bad, but because the test kitchen measured "1 cup" differently than the line cook. Train/serve skew is exactly that: the model (chef) is fine, but the *offline* feature recipe and the *online* feature recipe disagree about what a feature means — e.g. "clicks in the last 7 days" versus "last 1 day." The fix isn't a better chef; it's one shared recipe card (a feature store) that both kitchens cook from.

**Skew is not drift.** Skew is an offline-vs-online mismatch *at one point in time*. **Drift** is the data changing *over time* under the same definition. Fix skew by unifying the definition; handle drift with monitoring and retraining. A common drift signal is **PSI** $= \sum_i (a_i - e_i)\log(a_i/e_i)$ between two distributions.

**Prevention is practical: one object owns the feature definition.** Do not hand-normalize in notebooks and reimplement it in serving. Put preprocessing and the model in a `ColumnTransformer` / `Pipeline`; fit on train only; serialize/version that object; log the served feature vector so training can compare against what production actually used.

**1 · ColumnTransformer — one train-only preprocessing definition (notebook #12).** Input: numeric `bid`, `spend`; categorical `device`, `member_country`, `creative_size`. Code:

```python
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler

num = ["bid", "spend"]
cat = ["device", "member_country", "creative_size"]
pre = ColumnTransformer([
    ("num", StandardScaler(), num),
    ("cat", OneHotEncoder(sparse_output=False, handle_unknown="ignore"), cat),
])
Xtr = pre.fit_transform(train)
Xva = pre.transform(valid)
print("train matrix:", Xtr.shape, "| valid matrix:", Xva.shape)
print("numeric cols:", len(num), "| one-hot cols:", Xtr.shape[1]-len(num))
```

→ Output: `train matrix: (3000, 18) | valid matrix: (1000, 18)` and `numeric cols: 2 | one-hot cols: 16`. Use when a table mixes numeric and categorical features. Gotcha: `fit_transform(valid)` would silently learn a different scaler/vocabulary; only `transform(valid)` is correct.

**2 · Full leakage-safe Pipeline — preprocessing + model together (notebook #19).** Code:

```python
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score

num = ["bid", "spend", "dwell_secs"]; cat = ["device", "member_country", "creative_size"]
pre = ColumnTransformer([
    ("num", Pipeline([("impute", SimpleImputer(strategy="median")),
                      ("scale", StandardScaler())]), num),
    ("cat", OneHotEncoder(sparse_output=False, handle_unknown="ignore"), cat),
])
clf = Pipeline([("pre", pre), ("model", LogisticRegression(max_iter=1000))])
clf.fit(train, train.clicked)
auc = roc_auc_score(valid.clicked, clf.predict_proba(valid)[:, 1])
print(f"honest valid AUC (fit on train only): {auc:.3f}")
```

→ Output: `honest valid AUC (fit on train only): 0.648`. Use this as the production shape: the same object transforms train, validation, batch scoring, and serving. Gotcha: if serving cannot run the exact object, export the fitted medians/scales/vocabulary with a version and test parity row-by-row.

**3 · Feature logging — prove serving used the same values.** Log the request key, model version, feature-definition version, and final feature values/probability. Minimal offline shape:

```python
served = valid.head(3).copy()
served["model_version"] = "m2-demo-v1"
served["feature_def_version"] = "pre-v1"
served["p_click"] = clf.predict_proba(served)[:, 1]
print(served[["model_version", "feature_def_version", "p_click"]])
```

→ Output: 3 scored rows with the exact versions used. Use logs to train future datasets from served values, debug offline↔online gaps, and replay parity tests. Gotcha: logging raw features may contain sensitive data; apply your privacy/retention rules.

**4 · PSI check — detect drift after skew is fixed.** PSI compares an expected distribution (train) to an actual one (valid/serving) under the same definition:

```python
def psi(expected, actual, bins=10):
    edges = np.quantile(expected, np.linspace(0, 1, bins + 1))
    edges[0], edges[-1] = -np.inf, np.inf
    e = np.histogram(expected, edges)[0] / len(expected)
    a = np.histogram(actual, edges)[0] / len(actual)
    e, a = np.clip(e, 1e-6, None), np.clip(a, 1e-6, None)
    return np.sum((a - e) * np.log(a / e))

print("PSI spend train vs valid:", round(psi(train.spend, valid.spend), 3))
```

→ Output: `PSI spend train vs valid: 0.004` for this synthetic split (same generator); large PSI means drift or data-quality change, not necessarily skew. Use PSI after train/serve definitions are unified. Gotcha: PSI cannot tell you *why* distributions differ; pair it with feature logs.

**Sources of skew:** separate offline and online code paths, time-zone or unit mismatches, different missing defaults, aggregation windows that don't match, stale online features. The durable fixes: define each feature once and serve it consistently (a **feature store** or shared transformer), version the definition, and **log the served feature values** so training uses exactly what production used.

**Worked example — a window mismatch.** Training uses `campaign_clicks_window` = clicks in the last **7 days**, but the online service returns the last **1 day**. With a one-feature score $s = -2 + 0.08c$: a campaign with 120 clicks in 7 days scores $-2+0.08(120)=7.6$ offline, but 30 clicks in 1 day scores $-2+0.08(30)=0.4$ online — a **7.2 logit-point gap** from nothing but the window. The fix is not the model: unify on one window definition and serve it from one place.

**You'll be able to say:** *"Skew = offline and online compute the feature differently for the same request (a feature-definition bug); drift = the population changes over time under the same definition. Fix skew by defining the feature once and serving it consistently (feature store), versioning it, and logging served values to train on exactly what production used."*

---

## Resources
- **Google — Rules of Machine Learning** — the field guide to features that don't leak.
- **Feature Engineering for Machine Learning** (Zheng & Casari) — encodings, binning, scaling in depth.

## Papers
- **Practical Lessons from Predicting Clicks on Ads at Facebook** (He et al., 2014).
