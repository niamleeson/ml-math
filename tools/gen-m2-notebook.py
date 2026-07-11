#!/usr/bin/env python3
"""Generate afp/notebooks/M02-feature-engineering.ipynb.

A runnable, self-contained Colab notebook teaching how to handle & normalize
categorical, numeric and float features: 10 basic + 5 easy + 5 advanced
examples, each with a runnable cell and a matplotlib visualization. Uses only
libraries preinstalled in Google Colab (pandas / numpy / scikit-learn /
matplotlib) so it runs top-to-bottom with zero installs.

Run:  python3 tools/gen-m2-notebook.py
"""
import json, os

cells = []

def md(text):
    cells.append({"cell_type": "markdown", "metadata": {},
                  "source": text.strip("\n").splitlines(keepends=True)})

def code(src):
    cells.append({"cell_type": "code", "metadata": {}, "execution_count": None,
                  "outputs": [], "source": src.strip("\n").splitlines(keepends=True)})

# ----------------------------------------------------------------------------- intro
md(r"""
# M2 · Feature Engineering & Leakage — Hands-on Notebook

**Companion to curriculum lesson M2.** This notebook teaches you how to *actually*
handle and normalize **categorical**, **numeric** and **float** features with real,
runnable code — the practical side of M2.3, M2.4 and M2.5.

Every example runs top-to-bottom on a shared synthetic **ads** dataset using only
libraries preinstalled in Google Colab (`pandas`, `numpy`, `scikit-learn`,
`matplotlib`) — **no `pip install` needed**.

**Structure**
- **Basic (10)** — one encoder / scaler per example, with a picture.
- **Easy (5)** — combine steps, transforms, pipelines.
- **Advanced (5)** — leakage-safe target encoding, hashing, embeddings, a full
  fit-on-train pipeline, and an encoder bake-off.

> The golden rule you'll see everywhere: **fit every transform on the training
> split only, then apply it to validation / serving** — otherwise you leak.
""")

md("---\n# ✍️ Toy Examples — trace each mechanic by hand")

md(r"""
Before the drills, here is **one tiny, hand-traceable toy example for every
computed mechanic** in this lesson. Each toy uses only a handful of rows, prints
the intermediate values, and draws exactly one picture so you can check the math
by hand before seeing the full ads dataset.
""")

md(r"""
## ✍️ Toy 1 · one-hot encoding (nominal → 0/1 columns)

One-hot encoding turns an unordered label into one indicator per category. The
row has a `1` only under its own category and `0`s everywhere else.
""")
code(r"""
import numpy as np
import matplotlib.pyplot as plt

t1_rng = np.random.default_rng(0)                                      # -> deterministic seed 0
print("rng seed:", 0)                                                  # -> 0
t1_device = np.array(["ios", "web", "android", "ios", "web", "ios"])   # -> 6 devices
print("devices:", t1_device.tolist())                                  # -> ['ios','web','android','ios','web','ios']
t1_categories = np.array(["android", "ios", "web"])                    # -> 3 output columns
print("categories:", t1_categories.tolist())                           # -> ['android','ios','web']
t1_matches = t1_device[:, None] == t1_categories[None, :]              # -> True at the matching category
print("matches:", t1_matches.astype(int).tolist())                     # -> [[0,1,0],[0,0,1],[1,0,0],[0,1,0],[0,0,1],[0,1,0]]
t1_onehot = t1_matches.astype(int)                                     # -> 0/1 encoded matrix
print("one-hot:", t1_onehot.tolist())                                  # -> [[0,1,0],[0,0,1],[1,0,0],[0,1,0],[0,0,1],[0,1,0]]
t1_counts = t1_onehot.sum(axis=0)                                      # -> [1,3,2]
print("column counts:", t1_counts.tolist())                            # -> [1, 3, 2]
assert t1_onehot.shape == (6, 3)

plt.figure(figsize=(4.5, 3))
plt.bar(t1_categories, t1_counts, color="#4C72B0")
plt.title("Toy 1: one-hot column counts")
plt.ylabel("rows with 1")
plt.show()
""")
md("▶ What you'll see: six device labels become a 6×3 matrix, with counts `[1, 3, 2]` for android, ios, and web.")

md(r"""
## ✍️ Toy 2 · ordinal encoding (real order → integers)

Ordinal encoding is safe only when the order is real. Here `S < M < L`, so the
codes `0,1,2` preserve the size order.
""")
code(r"""
t2_sizes = np.array(["S", "M", "L", "S", "L", "M"])                    # -> 6 ordered labels
print("sizes:", t2_sizes.tolist())                                     # -> ['S','M','L','S','L','M']
t2_order = np.array(["S", "M", "L"])                                   # -> S<M<L
print("declared order:", t2_order.tolist())                            # -> ['S','M','L']
t2_matches = t2_sizes[:, None] == t2_order[None, :]                    # -> one True per row
print("matches:", t2_matches.astype(int).tolist())                     # -> [[1,0,0],[0,1,0],[0,0,1],[1,0,0],[0,0,1],[0,1,0]]
t2_codes = t2_matches.argmax(axis=1)                                   # -> [0,1,2,0,2,1]
print("ordinal codes:", t2_codes.tolist())                             # -> [0, 1, 2, 0, 2, 1]
t2_click = np.array([0, 0, 1, 0, 1, 1])                                # -> click labels
print("clicks:", t2_click.tolist())                                    # -> [0,0,1,0,1,1]
t2_sums = np.bincount(t2_codes, weights=t2_click, minlength=3)         # -> [0,1,2]
print("click sums by code:", t2_sums.tolist())                         # -> [0.0, 1.0, 2.0]
t2_counts = np.bincount(t2_codes, minlength=3)                         # -> [2,2,2]
print("counts by code:", t2_counts.tolist())                           # -> [2, 2, 2]
t2_rates = t2_sums / t2_counts                                         # -> [0,.5,1]
print("click rate by size:", t2_rates.tolist())                        # -> [0.0, 0.5, 1.0]
assert t2_codes.tolist() == [0, 1, 2, 0, 2, 1]

plt.figure(figsize=(4.5, 3))
plt.bar(t2_order, t2_rates, color="#55A868")
plt.title("Toy 2: bigger creative size, higher rate")
plt.ylabel("click rate")
plt.show()
""")
md("▶ What you'll see: `S,M,L` map to `0,1,2`, and the tiny click rates rise from `0.0` to `1.0`.")

md(r"""
## ✍️ Toy 3 · label-encoding a nominal feature (the fake-order trap)

Blindly assigning integers to unordered categories creates a fake numeric order.
The model sees `web=2 > ios=1 > android=0`, even though device names have no rank.
""")
code(r"""
t3_devices = np.array(["web", "android", "ios", "web", "ios", "android"])   # -> nominal labels
print("devices:", t3_devices.tolist())                                      # -> ['web','android','ios','web','ios','android']
t3_classes = np.array(["android", "ios", "web"])                            # -> alphabetical code order
print("fake class order:", t3_classes.tolist())                             # -> ['android','ios','web']
t3_codes = np.array([np.where(t3_classes == t3_x)[0][0] for t3_x in t3_devices])  # -> [2,0,1,2,1,0]
print("fake numeric codes:", t3_codes.tolist())                             # -> [2, 0, 1, 2, 1, 0]
t3_click = np.array([0, 1, 1, 0, 0, 1])                                     # -> labels do not follow the fake order
print("clicks:", t3_click.tolist())                                         # -> [0,1,1,0,0,1]
t3_sums = np.array([t3_click[t3_devices == t3_c].sum() for t3_c in t3_classes])  # -> [2,1,0]
print("click sums by device:", t3_sums.tolist())                            # -> [2, 1, 0]
t3_counts = np.array([(t3_devices == t3_c).sum() for t3_c in t3_classes])   # -> [2,2,2]
print("counts by device:", t3_counts.tolist())                              # -> [2, 2, 2]
t3_rates = t3_sums / t3_counts                                              # -> [1,.5,0]
print("real click rates:", t3_rates.tolist())                               # -> [1.0, 0.5, 0.0]
assert t3_codes.tolist() == [2, 0, 1, 2, 1, 0]

plt.figure(figsize=(4.5, 3))
plt.bar(t3_classes, t3_rates, color="#C44E52")
plt.title("Toy 3: rates are real; integer order is fake")
plt.ylabel("click rate")
plt.show()
""")
md("▶ What you'll see: the assigned codes impose an order, but the plotted rates show that order is arbitrary.")

md(r"""
## ✍️ Toy 4 · count / frequency encoding (category popularity)

Frequency encoding replaces each category with how often it appeared in the fit
data. It is compact, but categories with the same frequency collide.
""")
code(r"""
t4_country = np.array(["US", "IN", "US", "BR", "US", "IN", "JP", "US"])  # -> 8 rows
print("countries:", t4_country.tolist())                                # -> ['US','IN','US','BR','US','IN','JP','US']
t4_unique = np.unique(t4_country)                                       # -> ['BR','IN','JP','US']
print("unique countries:", t4_unique.tolist())                          # -> ['BR','IN','JP','US']
t4_counts = np.array([(t4_country == t4_u).sum() for t4_u in t4_unique]) # -> [1,2,1,4]
print("counts:", t4_counts.tolist())                                    # -> [1, 2, 1, 4]
t4_share = t4_counts / len(t4_country)                                  # -> [.125,.25,.125,.5]
print("shares:", t4_share.tolist())                                     # -> [0.125, 0.25, 0.125, 0.5]
t4_encoded = np.array([t4_share[np.where(t4_unique == t4_c)[0][0]] for t4_c in t4_country])  # -> row shares
print("frequency-encoded rows:", t4_encoded.tolist())                   # -> [0.5,0.25,0.5,0.125,0.5,0.25,0.125,0.5]
assert np.isclose(t4_encoded[0], 0.5)

plt.figure(figsize=(4.5, 3))
plt.bar(t4_unique, t4_share, color="#8172B3")
plt.title("Toy 4: frequency per country")
plt.ylabel("share")
plt.show()
""")
md("▶ What you'll see: `US` becomes `0.5`, `IN` becomes `0.25`, and rare `BR/JP` collide at `0.125`.")

md(r"""
## ✍️ Toy 5 · standardization (z-score)

Z-scoring subtracts the fit mean and divides by the fit standard deviation, one
numeric feature at a time.
""")
code(r"""
t5_X = np.array([[0, 5], [0, 5], [0, 5], [2, 7], [2, 7], [2, 7]], float)  # -> 6 rows x 2 dims
print("raw X:", t5_X.tolist())                                           # -> [[0,5],[0,5],[0,5],[2,7],[2,7],[2,7]]
t5_mean = t5_X.mean(axis=0)                                              # -> [1,6]
print("mean:", t5_mean.tolist())                                         # -> [1.0, 6.0]
t5_std = t5_X.std(axis=0)                                                # -> [1,1]
print("std:", t5_std.tolist())                                           # -> [1.0, 1.0]
t5_z = (t5_X - t5_mean) / t5_std                                         # -> z-scores
print("z-scores:", t5_z.tolist())                                        # -> [[-1,-1],[-1,-1],[-1,-1],[1,1],[1,1],[1,1]]
t5_z_mean = t5_z.mean(axis=0)                                            # -> [0,0]
print("z mean:", t5_z_mean.tolist())                                     # -> [0.0, 0.0]
t5_z_std = t5_z.std(axis=0)                                              # -> [1,1]
print("z std:", t5_z_std.tolist())                                       # -> [1.0, 1.0]
assert np.allclose(t5_z_std, [1, 1])

plt.figure(figsize=(4.5, 3))
plt.scatter(t5_z[:, 0], t5_z[:, 1], s=90, color="#55A868")
plt.title("Toy 5: standardized 2-D points")
plt.xlabel("z feature 1")
plt.ylabel("z feature 2")
plt.show()
""")
md("▶ What you'll see: two raw clusters become z-scores at `[-1,-1]` and `[1,1]`, with mean 0 and std 1.")

md(r"""
## ✍️ Toy 6 · min–max scaling (numeric → [0,1])

Min–max scaling uses fit-time minima and maxima to squeeze each numeric feature
into a fixed range.
""")
code(r"""
t6_X = np.array([[2, 10], [4, 20], [6, 30], [8, 40], [10, 50], [12, 60]], float)  # -> 6 rows x 2 dims
print("raw X:", t6_X.tolist())                                                   # -> increasing rows
t6_min = t6_X.min(axis=0)                                                        # -> [2,10]
print("min:", t6_min.tolist())                                                   # -> [2.0, 10.0]
t6_max = t6_X.max(axis=0)                                                        # -> [12,60]
print("max:", t6_max.tolist())                                                   # -> [12.0, 60.0]
t6_range = t6_max - t6_min                                                       # -> [10,50]
print("range:", t6_range.tolist())                                               # -> [10.0, 50.0]
t6_scaled = (t6_X - t6_min) / t6_range                                           # -> [0,1] scale
print("scaled:", np.round(t6_scaled, 2).tolist())                                # -> [[0,0],[.2,.2],[.4,.4],[.6,.6],[.8,.8],[1,1]]
assert np.allclose(t6_scaled[[0, -1]], [[0, 0], [1, 1]])

plt.figure(figsize=(4.5, 3))
plt.plot(t6_scaled[:, 0], marker="o", label="feature 1")
plt.plot(t6_scaled[:, 1], marker="s", label="feature 2")
plt.title("Toy 6: min–max scaled rows")
plt.ylabel("scaled value")
plt.legend()
plt.show()
""")
md("▶ What you'll see: both features land on the same `[0.0, …, 1.0]` scale.")

md(r"""
## ✍️ Toy 7 · robust scaling (median and IQR)

Robust scaling subtracts the median and divides by the interquartile range, so a
single huge outlier does not set the scale.
""")
code(r"""
t7_X = np.array([[10, 1], [11, 2], [12, 3], [13, 4], [14, 5], [15, 6], [100, 50]], float)  # -> 7 rows x 2 dims
print("raw X:", t7_X.tolist())                                                             # -> includes one outlier row
t7_median = np.median(t7_X, axis=0)                                                        # -> [13,4]
print("median:", t7_median.tolist())                                                       # -> [13.0, 4.0]
t7_q1 = np.percentile(t7_X, 25, axis=0)                                                     # -> [11.5,2.5]
print("q1:", t7_q1.tolist())                                                               # -> [11.5, 2.5]
t7_q3 = np.percentile(t7_X, 75, axis=0)                                                     # -> [14.5,5.5]
print("q3:", t7_q3.tolist())                                                               # -> [14.5, 5.5]
t7_iqr = t7_q3 - t7_q1                                                                     # -> [3,3]
print("iqr:", t7_iqr.tolist())                                                             # -> [3.0, 3.0]
t7_robust = (t7_X - t7_median) / t7_iqr                                                    # -> robust-scaled values
print("robust scaled:", np.round(t7_robust, 2).tolist())                                   # -> outlier is large but center uses median/IQR
assert np.allclose(t7_robust[3], [0, 0])

plt.figure(figsize=(4.5, 3))
plt.scatter(t7_robust[:, 0], t7_robust[:, 1], s=80, color="#CCB974")
plt.title("Toy 7: robust scale keeps the center at 0")
plt.xlabel("robust feature 1")
plt.ylabel("robust feature 2")
plt.show()
""")
md("▶ What you'll see: the middle row maps to `[0,0]`; the outlier stays visible instead of defining the scale.")

md(r"""
## ✍️ Toy 8 · log1p transform (compress a heavy tail)

`log1p(x)=log(1+x)` keeps zero at zero and compresses large positive values much
more than small ones.
""")
code(r"""
t8_X = np.array([[0, 0], [1, 3], [3, 8], [7, 15], [15, 24], [31, 35]], float)  # -> 6 nonnegative rows
print("raw X:", t8_X.tolist())                                                # -> heavy right tail
t8_shifted = 1 + t8_X                                                         # -> add 1 before log
print("1 + X:", t8_shifted.tolist())                                          # -> [[1,1],[2,4],[4,9],[8,16],[16,25],[32,36]]
t8_log = np.log(t8_shifted)                                                   # -> log1p values
print("log1p:", np.round(t8_log, 3).tolist())                                 # -> [[0,0],[.693,1.386],[1.386,2.197],...]
t8_gap_raw = t8_X[-1, 0] - t8_X[-2, 0]                                        # -> 16
print("last raw gap:", float(t8_gap_raw))                                     # -> 16.0
t8_gap_log = t8_log[-1, 0] - t8_log[-2, 0]                                    # -> .693
print("last log gap:", round(float(t8_gap_log), 3))                           # -> 0.693
assert np.isclose(t8_log[0, 0], 0.0)

plt.figure(figsize=(4.5, 3))
plt.plot(t8_X[:, 0], label="raw", marker="o")
plt.plot(t8_log[:, 0], label="log1p", marker="s")
plt.title("Toy 8: log compresses the tail")
plt.legend()
plt.show()
""")
md("▶ What you'll see: a raw jump of `16` shrinks to a log jump of about `0.693`.")

md(r"""
## ✍️ Toy 9 · missing-value imputation plus missingness flags

Median imputation fills the numeric hole; the flag keeps the fact that the value
was missing as its own feature.
""")
code(r"""
t9_X = np.array([[10, 1], [np.nan, 2], [30, np.nan], [40, 4], [np.nan, 5], [60, 6]], float)  # -> 6 rows x 2 dims
print("raw X:", t9_X.tolist())                                                              # -> contains nan values
t9_missing = np.isnan(t9_X).astype(int)                                                     # -> 1 where missing
print("missing flags:", t9_missing.tolist())                                                # -> [[0,0],[1,0],[0,1],[0,0],[1,0],[0,0]]
t9_median = np.nanmedian(t9_X, axis=0)                                                      # -> [35,4]
print("median by feature:", t9_median.tolist())                                             # -> [35.0, 4.0]
t9_imputed = np.where(np.isnan(t9_X), t9_median, t9_X)                                      # -> filled matrix
print("imputed X:", t9_imputed.tolist())                                                    # -> nan replaced by [35,4]
t9_full = np.hstack([t9_imputed, t9_missing])                                               # -> add two flag columns
print("imputed + flags:", t9_full.tolist())                                                 # -> 4 columns
t9_missing_count = t9_missing.sum(axis=0)                                                   # -> [2,1]
print("missing count by feature:", t9_missing_count.tolist())                               # -> [2, 1]
assert not np.isnan(t9_imputed).any()

plt.figure(figsize=(4.5, 3))
plt.bar(["feature 1", "feature 2"], t9_missing_count, color="#8172B3")
plt.title("Toy 9: missingness becomes a flag")
plt.ylabel("missing rows")
plt.show()
""")
md("▶ What you'll see: NaNs are filled with medians `[35,4]`, and two flag columns remember where the gaps were.")

md(r"""
## ✍️ Toy 10 · binning / discretization (numeric → buckets)

Binning cuts a numeric feature into bucket IDs. Here the sorted values are split
after every two rows, giving four equal-count buckets.
""")
code(r"""
t10_bid = np.array([1, 2, 3, 4, 5, 6, 7, 8], float)                    # -> 8 bids
print("bid:", t10_bid.tolist())                                       # -> [1,2,3,4,5,6,7,8]
t10_click = np.array([0, 0, 0, 1, 1, 1, 1, 1])                        # -> labels
print("click:", t10_click.tolist())                                   # -> [0,0,0,1,1,1,1,1]
t10_cutpoints = np.array([3, 5, 7], float)                            # -> split after values 2,4,6
print("cutpoints:", t10_cutpoints.tolist())                           # -> [3.0, 5.0, 7.0]
t10_bucket = np.searchsorted(t10_cutpoints, t10_bid, side="right")    # -> [0,0,1,1,2,2,3,3]
print("bucket ids:", t10_bucket.tolist())                             # -> [0, 0, 1, 1, 2, 2, 3, 3]
t10_sums = np.bincount(t10_bucket, weights=t10_click, minlength=4)    # -> [0,1,2,2]
print("click sums by bucket:", t10_sums.tolist())                     # -> [0.0, 1.0, 2.0, 2.0]
t10_counts = np.bincount(t10_bucket, minlength=4)                     # -> [2,2,2,2]
print("counts by bucket:", t10_counts.tolist())                       # -> [2, 2, 2, 2]
t10_rate = t10_sums / t10_counts                                      # -> [0,.5,1,1]
print("click rate by bucket:", t10_rate.tolist())                     # -> [0.0, 0.5, 1.0, 1.0]
assert t10_bucket.tolist() == [0, 0, 1, 1, 2, 2, 3, 3]

plt.figure(figsize=(4.5, 3))
plt.bar(["0", "1", "2", "3"], t10_rate, color="#4C72B0")
plt.title("Toy 10: click rate by bid bucket")
plt.xlabel("bucket")
plt.ylabel("click rate")
plt.show()
""")
md("▶ What you'll see: eight bids become four bucket IDs `[0,0,1,1,2,2,3,3]`.")

md(r"""
## ✍️ Toy 11 · naive target / mean encoding (how leakage appears)

Naive target encoding uses the row labels to compute category means. Singleton
categories then encode their own label exactly, which is leakage.
""")
code(r"""
t11_campaign = np.array([101, 101, 102, 102, 103, 104, 105, 105])       # -> 8 campaign IDs
print("campaign:", t11_campaign.tolist())                              # -> [101,101,102,102,103,104,105,105]
t11_clicked = np.array([1, 0, 1, 1, 0, 1, 0, 1], float)                # -> labels
print("clicked:", t11_clicked.tolist())                                # -> [1,0,1,1,0,1,0,1]
t11_unique = np.unique(t11_campaign)                                   # -> [101,102,103,104,105]
print("unique campaigns:", t11_unique.tolist())                        # -> [101, 102, 103, 104, 105]
t11_counts = np.array([(t11_campaign == t11_c).sum() for t11_c in t11_unique])  # -> [2,2,1,1,2]
print("counts:", t11_counts.tolist())                                  # -> [2, 2, 1, 1, 2]
t11_sums = np.array([t11_clicked[t11_campaign == t11_c].sum() for t11_c in t11_unique])  # -> [1,2,0,1,1]
print("click sums:", t11_sums.tolist())                                # -> [1.0, 2.0, 0.0, 1.0, 1.0]
t11_means = t11_sums / t11_counts                                      # -> [.5,1,0,1,.5]
print("campaign means:", t11_means.tolist())                           # -> [0.5, 1.0, 0.0, 1.0, 0.5]
t11_encoded = np.array([t11_means[np.where(t11_unique == t11_c)[0][0]] for t11_c in t11_campaign])  # -> row encodings
print("naively encoded rows:", t11_encoded.tolist())                   # -> [0.5,0.5,1,1,0,1,0.5,0.5]
t11_singletons = t11_counts == 1                                       # -> [False,False,True,True,False]
print("singleton mask:", t11_singletons.tolist())                      # -> [False, False, True, True, False]
assert t11_encoded[4] == t11_clicked[4] and t11_encoded[5] == t11_clicked[5]

plt.figure(figsize=(4.5, 3))
plt.scatter(np.arange(len(t11_encoded)), t11_encoded, c=t11_clicked, cmap="coolwarm", s=90)
plt.title("Toy 11: singleton IDs memorize labels")
plt.xlabel("row")
plt.ylabel("naive target encoding")
plt.show()
""")
md("▶ What you'll see: campaigns `103` and `104` have one row each, so their encodings equal their labels.")

md(r"""
## ✍️ Toy 12 · column-wise preprocessing (numeric + categorical together)

A column transformer is just routing: scale numeric columns, one-hot categorical
columns, then concatenate the results into one matrix.
""")
code(r"""
t12_bid = np.array([1, 2, 3, 4, 5, 6], float)                         # -> numeric column
print("bid:", t12_bid.tolist())                                       # -> [1,2,3,4,5,6]
t12_device = np.array(["ios", "web", "android", "ios", "web", "android"])  # -> categorical column
print("device:", t12_device.tolist())                                 # -> ['ios','web','android','ios','web','android']
t12_bid_mean = t12_bid.mean()                                         # -> 3.5
print("bid mean:", float(t12_bid_mean))                               # -> 3.5
t12_bid_std = t12_bid.std()                                           # -> 1.708...
print("bid std:", round(float(t12_bid_std), 3))                       # -> 1.708
t12_bid_z = ((t12_bid - t12_bid_mean) / t12_bid_std).reshape(-1, 1)   # -> numeric block
print("numeric block:", np.round(t12_bid_z, 3).ravel().tolist())      # -> [-1.464,-0.878,-0.293,0.293,0.878,1.464]
t12_categories = np.array(["android", "ios", "web"])                  # -> categorical output order
print("categories:", t12_categories.tolist())                         # -> ['android','ios','web']
t12_cat_block = (t12_device[:, None] == t12_categories[None, :]).astype(int)  # -> one-hot block
print("categorical block:", t12_cat_block.tolist())                   # -> 6x3 one-hot
t12_matrix = np.hstack([t12_bid_z, t12_cat_block])                    # -> 6x4 final matrix
print("combined matrix:", np.round(t12_matrix, 3).tolist())           # -> numeric + one-hot
assert t12_matrix.shape == (6, 4)

plt.figure(figsize=(4.5, 3))
plt.imshow(t12_matrix, aspect="auto", cmap="viridis")
plt.colorbar(label="value")
plt.title("Toy 12: concatenated transform matrix")
plt.xlabel("transformed column")
plt.ylabel("row")
plt.show()
""")
md("▶ What you'll see: one scaled numeric column and three one-hot columns become a single 6×4 matrix.")

md(r"""
## ✍️ Toy 13 · Yeo–Johnson power transform (handles negatives too)

Yeo–Johnson is a learned power transform in the full drill. Here we use a fixed
`λ=0.5` so each branch of the formula is easy to trace.
""")
code(r"""
t13_X = np.array([[-3, -1], [-1, 0], [0, 1], [1, 3], [3, 8], [8, 15]], float)  # -> 6 rows x 2 dims
print("raw X:", t13_X.tolist())                                               # -> includes negatives, zero, positives
t13_lambda = 0.5                                                              # -> fixed toy lambda
print("lambda:", t13_lambda)                                                  # -> 0.5
t13_pos = t13_X >= 0                                                          # -> positive branch mask
print("positive mask:", t13_pos.astype(int).tolist())                         # -> 1 where x>=0
t13_yj = np.zeros_like(t13_X)                                                  # -> output buffer
print("start output:", t13_yj.tolist())                                       # -> all zeros
t13_yj[t13_pos] = ((t13_X[t13_pos] + 1) ** t13_lambda - 1) / t13_lambda       # -> positive Yeo-Johnson branch
print("after positive branch:", np.round(t13_yj, 3).tolist())                 # -> positives transformed
t13_yj[~t13_pos] = -(((-t13_X[~t13_pos] + 1) ** (2 - t13_lambda) - 1) / (2 - t13_lambda))  # -> negative branch
print("final Yeo-Johnson:", np.round(t13_yj, 3).tolist())                     # -> [[-4.667,-1.219],[-1.219,0],...]
assert np.isclose(t13_yj[2, 0], 0.0)

plt.figure(figsize=(4.5, 3))
plt.plot(t13_X[:, 0], t13_yj[:, 0], marker="o", color="#55A868")
plt.title("Toy 13: Yeo–Johnson bends signed values")
plt.xlabel("raw feature 1")
plt.ylabel("transformed feature 1")
plt.show()
""")
md("▶ What you'll see: negatives and positives both transform smoothly, with `0` staying `0`.")

md(r"""
## ✍️ Toy 14 · rank / quantile normalization

Quantile transforms replace raw magnitudes with rank positions. That makes the
output robust to outliers because only order matters.
""")
code(r"""
t14_X = np.array([[50, 6], [10, 1], [30, 3], [20, 2], [40, 4], [60, 5]], float)  # -> 6 rows x 2 dims
print("raw X:", t14_X.tolist())                                                # -> unordered values
t14_order = np.argsort(t14_X, axis=0)                                          # -> row order per feature
print("argsort by feature:", t14_order.tolist())                               # -> [[1,1],[3,3],[2,2],[4,4],[0,5],[5,0]]
t14_ranks = np.empty_like(t14_order)                                           # -> rank buffer
print("empty rank shape:", list(t14_ranks.shape))                              # -> [6, 2]
t14_cols = np.arange(t14_X.shape[1])                                           # -> [0,1]
print("columns:", t14_cols.tolist())                                           # -> [0, 1]
t14_ranks[t14_order, t14_cols] = np.arange(1, t14_X.shape[0] + 1)[:, None]     # -> ranks 1..6
print("ranks:", t14_ranks.tolist())                                            # -> [[5,6],[1,1],[3,3],[2,2],[4,4],[6,5]]
t14_uniform = (t14_ranks - 0.5) / t14_X.shape[0]                               # -> quantiles in (0,1)
print("uniform quantiles:", np.round(t14_uniform, 3).tolist())                 # -> [[.75,.917],[.083,.083],...]
assert np.all((t14_uniform > 0) & (t14_uniform < 1))

plt.figure(figsize=(4.5, 3))
plt.scatter(t14_X[:, 0], t14_uniform[:, 0], s=90, color="#4C72B0")
plt.title("Toy 14: raw value → rank quantile")
plt.xlabel("raw feature 1")
plt.ylabel("uniform quantile")
plt.show()
""")
md("▶ What you'll see: raw values are replaced by evenly spaced rank quantiles between 0 and 1.")

md(r"""
## ✍️ Toy 15 · winsorizing / clipping outliers

Winsorizing learns low/high caps from fit data and clips serving values into that
range, limiting extreme leverage.
""")
code(r"""
t15_X = np.array([[1, 10], [2, 20], [3, 30], [4, 40], [5, 50], [100, 600]], float)  # -> 6 rows x 2 dims
print("raw X:", t15_X.tolist())                                                    # -> last row is extreme
t15_sorted = np.sort(t15_X, axis=0)                                                # -> sorted per feature
print("sorted X:", t15_sorted.tolist())                                            # -> outlier at the end
t15_lo = t15_sorted[1]                                                             # -> [2,20]
print("low cap:", t15_lo.tolist())                                                 # -> [2.0, 20.0]
t15_hi = t15_sorted[-2]                                                            # -> [5,50]
print("high cap:", t15_hi.tolist())                                                # -> [5.0, 50.0]
t15_clipped = np.clip(t15_X, t15_lo, t15_hi)                                       # -> clipped matrix
print("clipped X:", t15_clipped.tolist())                                          # -> first row raised, last row capped
t15_changed = t15_X - t15_clipped                                                  # -> amount removed
print("raw minus clipped:", t15_changed.tolist())                                  # -> outlier shrinkage visible
assert t15_clipped[-1].tolist() == [5.0, 50.0]

plt.figure(figsize=(4.5, 3))
plt.plot(t15_X[:, 0], label="raw feature 1", marker="o")
plt.plot(t15_clipped[:, 0], label="clipped feature 1", marker="s")
plt.title("Toy 15: cap the extreme row")
plt.legend()
plt.show()
""")
md("▶ What you'll see: the final raw value `100` is capped to `5`, and the first value is raised to the low cap `2`.")

md(r"""
## ✍️ Toy 16 · leakage-safe target encoding (out-of-fold + smoothing)

Out-of-fold target encoding computes each row's category statistic from other
rows only, then shrinks rare categories toward the fold's global mean.
""")
code(r"""
t16_campaign = np.array([10, 10, 20, 20, 30, 30, 40, 50])              # -> 8 campaign IDs
print("campaign:", t16_campaign.tolist())                             # -> [10,10,20,20,30,30,40,50]
t16_clicked = np.array([1, 0, 1, 1, 0, 0, 1, 0], float)               # -> labels
print("clicked:", t16_clicked.tolist())                               # -> [1,0,1,1,0,0,1,0]
t16_m = 2.0                                                           # -> smoothing strength
print("smoothing m:", t16_m)                                          # -> 2.0
t16_oof = np.zeros(len(t16_campaign))                                 # -> output buffer
print("start OOF:", t16_oof.tolist())                                 # -> all zeros
t16_fit0_idx = np.array([1, 3, 5, 7])                                 # -> rows used to encode fold 0
print("fit rows for fold 0:", t16_fit0_idx.tolist())                  # -> [1,3,5,7]
t16_enc0_idx = np.array([0, 2, 4, 6])                                 # -> rows encoded by fold 0
print("encoded rows for fold 0:", t16_enc0_idx.tolist())              # -> [0,2,4,6]
t16_fit0_c = t16_campaign[t16_fit0_idx]                               # -> [10,20,30,50]
print("fold 0 fit campaigns:", t16_fit0_c.tolist())                   # -> [10,20,30,50]
t16_fit0_y = t16_clicked[t16_fit0_idx]                                # -> [0,1,0,0]
print("fold 0 fit labels:", t16_fit0_y.tolist())                      # -> [0.0,1.0,0.0,0.0]
t16_g0 = t16_fit0_y.mean()                                            # -> .25
print("fold 0 global mean:", float(t16_g0))                            # -> 0.25
t16_u0, t16_inv0 = np.unique(t16_fit0_c, return_inverse=True)         # -> unique campaigns
print("fold 0 unique:", t16_u0.tolist())                              # -> [10,20,30,50]
t16_cnt0 = np.bincount(t16_inv0)                                      # -> [1,1,1,1]
print("fold 0 counts:", t16_cnt0.tolist())                            # -> [1,1,1,1]
t16_sum0 = np.bincount(t16_inv0, weights=t16_fit0_y)                  # -> [0,1,0,0]
print("fold 0 sums:", t16_sum0.tolist())                              # -> [0.0,1.0,0.0,0.0]
t16_smooth0 = (t16_sum0 + t16_m * t16_g0) / (t16_cnt0 + t16_m)        # -> [.167,.5,.167,.167]
print("fold 0 smoothed means:", np.round(t16_smooth0, 3).tolist())    # -> [0.167,0.5,0.167,0.167]
t16_vals0 = np.array([t16_smooth0[np.where(t16_u0 == t16_c)[0][0]] if np.any(t16_u0 == t16_c) else t16_g0 for t16_c in t16_campaign[t16_enc0_idx]])  # -> encode fold 0
print("fold 0 encoded values:", np.round(t16_vals0, 3).tolist())      # -> [0.167,0.5,0.167,0.25]
t16_oof[t16_enc0_idx] = t16_vals0                                    # -> fill fold 0
print("OOF after fold 0:", np.round(t16_oof, 3).tolist())             # -> [0.167,0,0.5,0,0.167,0,0.25,0]
t16_fit1_idx = t16_enc0_idx                                          # -> rows used to encode fold 1
print("fit rows for fold 1:", t16_fit1_idx.tolist())                 # -> [0,2,4,6]
t16_enc1_idx = t16_fit0_idx                                          # -> rows encoded by fold 1
print("encoded rows for fold 1:", t16_enc1_idx.tolist())             # -> [1,3,5,7]
t16_fit1_c = t16_campaign[t16_fit1_idx]                              # -> [10,20,30,40]
print("fold 1 fit campaigns:", t16_fit1_c.tolist())                  # -> [10,20,30,40]
t16_fit1_y = t16_clicked[t16_fit1_idx]                               # -> [1,1,0,1]
print("fold 1 fit labels:", t16_fit1_y.tolist())                     # -> [1.0,1.0,0.0,1.0]
t16_g1 = t16_fit1_y.mean()                                           # -> .75
print("fold 1 global mean:", float(t16_g1))                           # -> 0.75
t16_u1, t16_inv1 = np.unique(t16_fit1_c, return_inverse=True)        # -> unique campaigns
print("fold 1 unique:", t16_u1.tolist())                             # -> [10,20,30,40]
t16_cnt1 = np.bincount(t16_inv1)                                     # -> [1,1,1,1]
print("fold 1 counts:", t16_cnt1.tolist())                           # -> [1,1,1,1]
t16_sum1 = np.bincount(t16_inv1, weights=t16_fit1_y)                 # -> [1,1,0,1]
print("fold 1 sums:", t16_sum1.tolist())                             # -> [1.0,1.0,0.0,1.0]
t16_smooth1 = (t16_sum1 + t16_m * t16_g1) / (t16_cnt1 + t16_m)       # -> [.833,.833,.5,.833]
print("fold 1 smoothed means:", np.round(t16_smooth1, 3).tolist())   # -> [0.833,0.833,0.5,0.833]
t16_vals1 = np.array([t16_smooth1[np.where(t16_u1 == t16_c)[0][0]] if np.any(t16_u1 == t16_c) else t16_g1 for t16_c in t16_campaign[t16_enc1_idx]])  # -> encode fold 1
print("fold 1 encoded values:", np.round(t16_vals1, 3).tolist())     # -> [0.833,0.833,0.5,0.75]
t16_oof[t16_enc1_idx] = t16_vals1                                   # -> fill fold 1
print("final OOF encoding:", np.round(t16_oof, 3).tolist())          # -> [0.167,0.833,0.5,0.833,0.167,0.5,0.25,0.75]
assert np.allclose(np.round(t16_oof, 3), [0.167, 0.833, 0.5, 0.833, 0.167, 0.5, 0.25, 0.75])

plt.figure(figsize=(5, 3))
plt.bar(np.arange(len(t16_oof)), t16_oof, color="#55A868")
plt.title("Toy 16: OOF smoothed target encoding")
plt.xlabel("row")
plt.ylabel("encoded value")
plt.show()
""")
md("▶ What you'll see: every row is encoded from the opposite fold, with singleton IDs shrunk toward the fold mean.")

md(r"""
## ✍️ Toy 17 · feature hashing (fixed width, possible collisions)

The hashing trick maps IDs into a fixed number of buckets without storing a
vocabulary. Collisions are the trade-off.
""")
code(r"""
t17_ids = np.array([101, 102, 103, 104, 105, 106, 107, 108])           # -> 8 high-cardinality IDs
print("ids:", t17_ids.tolist())                                       # -> [101,102,103,104,105,106,107,108]
t17_n_buckets = 4                                                     # -> fixed output width
print("n buckets:", t17_n_buckets)                                    # -> 4
t17_hash_value = t17_ids * 7 + 3                                      # -> simple deterministic toy hash
print("hash values:", t17_hash_value.tolist())                        # -> [710,717,724,731,738,745,752,759]
t17_bucket = (t17_hash_value % t17_n_buckets).astype(int)             # -> [2,1,0,3,2,1,0,3]
print("bucket ids:", t17_bucket.tolist())                             # -> [2,1,0,3,2,1,0,3]
t17_matrix = np.zeros((len(t17_ids), t17_n_buckets), int)             # -> 8x4 zeros
print("start hash matrix:", t17_matrix.tolist())                      # -> all zeros
t17_matrix[np.arange(len(t17_ids)), t17_bucket] = 1                   # -> set hashed bucket to 1
print("hashed matrix:", t17_matrix.tolist())                          # -> one 1 per row
t17_bucket_counts = t17_matrix.sum(axis=0)                            # -> [2,2,2,2]
print("bucket counts:", t17_bucket_counts.tolist())                   # -> [2, 2, 2, 2]
assert t17_bucket_counts.tolist() == [2, 2, 2, 2]

plt.figure(figsize=(4.5, 3))
plt.bar(np.arange(t17_n_buckets), t17_bucket_counts, color="#CCB974")
plt.title("Toy 17: collisions in 4 hash buckets")
plt.xlabel("bucket")
plt.ylabel("IDs mapped here")
plt.show()
""")
md("▶ What you'll see: eight IDs fit into four columns, with exactly two IDs colliding in each bucket.")

md(r"""
## ✍️ Toy 18 · entity embeddings via a tiny SVD

An embedding turns sparse ID/context counts into a dense coordinate. The full
drill uses truncated SVD; this toy uses a tiny matrix where the first two SVD
coordinates are easy to see.
""")
code(r"""
t18_context = np.array([[3, 0, 0], [1, 0, 0], [0, 2, 0], [0, 1, 0], [0, 0, 1], [0, 0, 1]], float)  # -> 6 IDs x 3 contexts
print("campaign-context counts:", t18_context.tolist())                                                       # -> sparse count matrix
t18_U, t18_S, t18_Vt = np.linalg.svd(t18_context, full_matrices=False)                                        # -> SVD
print("singular values:", np.round(t18_S, 3).tolist())                                                        # -> [3.162,2.236,1.414]
t18_raw_embedding = t18_U[:, :2] * t18_S[:2]                                                                  # -> first two SVD dims
print("raw signed embedding:", np.round(t18_raw_embedding, 3).tolist())                                       # -> signs may be negative
t18_embedding = np.abs(t18_raw_embedding)                                                                     # -> sign-stable coordinates
print("2-D embedding:", np.round(t18_embedding, 3).tolist())                                                  # -> [[3,0],[1,0],[0,2],[0,1],[0,0],[0,0]]
t18_norm = np.linalg.norm(t18_embedding, axis=1)                                                              # -> embedding lengths
print("embedding lengths:", np.round(t18_norm, 3).tolist())                                                   # -> [3,1,2,1,0,0]
assert t18_embedding.shape == (6, 2)

plt.figure(figsize=(4.5, 3.5))
plt.scatter(t18_embedding[:, 0], t18_embedding[:, 1], s=90, color="#4C72B0")
for t18_i, (t18_x, t18_y) in enumerate(t18_embedding):
    plt.text(t18_x + 0.05, t18_y + 0.05, str(t18_i))
plt.title("Toy 18: 2-D ID embeddings")
plt.xlabel("embedding dim 1")
plt.ylabel("embedding dim 2")
plt.show()
""")
md("▶ What you'll see: six sparse campaign rows become six 2-D points.")

md(r"""
## ✍️ Toy 19 · fit-on-train pipeline, then transform validation

The production-safe pattern is: learn all statistics and category vocabulary on
train only, then apply those frozen choices to validation/serving rows.
""")
code(r"""
t19_train_bid = np.array([1, 2, 3, 4, 5, 6], float)                       # -> train numeric values
print("train bid:", t19_train_bid.tolist())                               # -> [1,2,3,4,5,6]
t19_train_device = np.array(["ios", "web", "android", "ios", "web", "android"])  # -> train categories
print("train device:", t19_train_device.tolist())                         # -> ['ios','web','android','ios','web','android']
t19_valid_bid = np.array([2, 8], float)                                   # -> validation numeric values
print("valid bid:", t19_valid_bid.tolist())                               # -> [2,8]
t19_valid_device = np.array(["ios", "tablet"])                            # -> one seen, one unseen category
print("valid device:", t19_valid_device.tolist())                         # -> ['ios','tablet']
t19_mean = t19_train_bid.mean()                                           # -> train-only mean 3.5
print("train mean:", float(t19_mean))                                     # -> 3.5
t19_std = t19_train_bid.std()                                             # -> train-only std 1.708...
print("train std:", round(float(t19_std), 3))                             # -> 1.708
t19_categories = np.unique(t19_train_device)                              # -> train-only vocabulary
print("train categories:", t19_categories.tolist())                       # -> ['android','ios','web']
t19_valid_z = ((t19_valid_bid - t19_mean) / t19_std).reshape(-1, 1)       # -> scale valid with train stats
print("valid numeric block:", np.round(t19_valid_z, 3).ravel().tolist()) # -> [-0.878,2.635]
t19_valid_hot = (t19_valid_device[:, None] == t19_categories[None, :]).astype(int)  # -> unseen tablet all zeros
print("valid one-hot block:", t19_valid_hot.tolist())                     # -> [[0,1,0],[0,0,0]]
t19_valid_matrix = np.hstack([t19_valid_z, t19_valid_hot])                # -> validation design matrix
print("valid matrix:", np.round(t19_valid_matrix, 3).tolist())            # -> 2 rows x 4 columns
assert t19_valid_hot[1].tolist() == [0, 0, 0]

plt.figure(figsize=(4.5, 2.8))
plt.imshow(t19_valid_matrix, aspect="auto", cmap="magma")
plt.colorbar(label="value")
plt.title("Toy 19: validation transformed with train stats")
plt.xlabel("pipeline output column")
plt.ylabel("valid row")
plt.show()
""")
md("▶ What you'll see: validation uses the train mean/std and train vocabulary; unseen `tablet` becomes all zeros.")

md(r"""
## ✍️ Toy 20 · encoder bake-off (same IDs, different widths)

The bake-off compares encoders for the same high-cardinality ID. This toy prints
the tiny matrices and the number of columns each choice creates.
""")
code(r"""
t20_campaign = np.array([1, 1, 2, 2, 3, 4, 5, 5])                     # -> 8 IDs
print("campaign:", t20_campaign.tolist())                             # -> [1,1,2,2,3,4,5,5]
t20_clicked = np.array([1, 0, 1, 1, 0, 1, 0, 1], float)               # -> labels for signal encoders
print("clicked:", t20_clicked.tolist())                               # -> [1,0,1,1,0,1,0,1]
t20_unique = np.unique(t20_campaign)                                  # -> [1,2,3,4,5]
print("unique campaigns:", t20_unique.tolist())                       # -> [1,2,3,4,5]
t20_onehot = (t20_campaign[:, None] == t20_unique[None, :]).astype(int)  # -> one-hot matrix
print("one-hot matrix:", t20_onehot.tolist())                         # -> 8x5
t20_counts = np.array([(t20_campaign == t20_c).sum() for t20_c in t20_unique])  # -> [2,2,1,1,2]
print("counts:", t20_counts.tolist())                                 # -> [2,2,1,1,2]
t20_freq_map = t20_counts / len(t20_campaign)                         # -> [.25,.25,.125,.125,.25]
print("frequency map:", t20_freq_map.tolist())                        # -> [0.25,0.25,0.125,0.125,0.25]
t20_freq = np.array([t20_freq_map[np.where(t20_unique == t20_c)[0][0]] for t20_c in t20_campaign]).reshape(-1, 1)  # -> frequency column
print("frequency column:", t20_freq.ravel().tolist())                 # -> [0.25,0.25,0.25,0.25,0.125,0.125,0.25,0.25]
t20_global = t20_clicked.mean()                                       # -> .625
print("global mean:", float(t20_global))                              # -> 0.625
t20_sums = np.array([t20_clicked[t20_campaign == t20_c].sum() for t20_c in t20_unique])  # -> [1,2,0,1,1]
print("click sums:", t20_sums.tolist())                               # -> [1.0,2.0,0.0,1.0,1.0]
t20_target_map = (t20_sums + 2 * t20_global) / (t20_counts + 2)       # -> smoothed means
print("smoothed target map:", np.round(t20_target_map, 3).tolist())   # -> [0.562,0.812,0.417,0.75,0.562]
t20_target = np.array([t20_target_map[np.where(t20_unique == t20_c)[0][0]] for t20_c in t20_campaign]).reshape(-1, 1)  # -> target column
print("target column:", np.round(t20_target.ravel(), 3).tolist())     # -> [0.562,0.562,0.812,0.812,0.417,0.75,0.562,0.562]
t20_bucket = ((t20_campaign * 7 + 3) % 4).astype(int)                 # -> hashed buckets
print("hash buckets:", t20_bucket.tolist())                           # -> [2,2,1,1,0,3,2,2]
t20_hash = np.zeros((len(t20_campaign), 4), int)                      # -> 8x4 zeros
print("start hash matrix:", t20_hash.tolist())                        # -> all zeros
t20_hash[np.arange(len(t20_campaign)), t20_bucket] = 1                # -> hashed one-hot
print("hash matrix:", t20_hash.tolist())                              # -> 8x4
t20_widths = np.array([t20_onehot.shape[1], t20_freq.shape[1], t20_target.shape[1], t20_hash.shape[1]])  # -> [5,1,1,4]
print("encoder widths:", t20_widths.tolist())                         # -> [5, 1, 1, 4]
assert t20_widths.tolist() == [5, 1, 1, 4]

plt.figure(figsize=(4.8, 3))
plt.bar(["one-hot", "freq", "target", "hash"], t20_widths, color=["#4C72B0", "#55A868", "#8172B3", "#CCB974"])
plt.title("Toy 20: encoder width bake-off")
plt.ylabel("columns")
plt.show()
""")
md("▶ What you'll see: one-hot uses 5 columns, frequency and target use 1 each, and hashing uses the fixed width 4.")

# ----------------------------------------------------------------------------- setup
md(r"""
## Setup — a small synthetic ads dataset

One row = one ad impression. Columns mix the three feature families:
- **categorical (nominal):** `member_country`, `device`, `campaign_id`
- **categorical (ordinal):** `creative_size` (S < M < L)
- **numeric / float:** `bid`, `spend` (heavy-tailed), `dwell_secs` (has missing values)
- **label:** `clicked` (0/1)
""")

code(r"""
import numpy as np, pandas as pd
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split

plt.rcParams.update({"axes.grid": True, "grid.alpha": .3, "figure.autolayout": True})
BLUE, GREEN, RED, PURPLE, GOLD = "#4C72B0", "#55A868", "#C44E52", "#8172B3", "#CCB974"

rng = np.random.default_rng(42)
N = 4000
countries = rng.choice(["US","IN","BR","GB","DE","FR","CA","AU","NG","JP"],
                       size=N, p=[.30,.18,.12,.08,.07,.06,.05,.05,.02,.07])
devices   = rng.choice(["ios","android","web"], size=N, p=[.45,.40,.15])
sizes     = rng.choice(["S","M","L"], size=N, p=[.5,.35,.15])
campaign  = rng.integers(1000, 1000+800, size=N)            # 800 campaigns (high card.)
bid       = np.round(rng.uniform(0.5, 12.0, size=N), 2)
spend     = np.round(rng.exponential(scale=40, size=N), 2)  # heavy-tailed
dwell     = rng.normal(30, 12, size=N).clip(0)
dwell[rng.random(N) < 0.15] = np.nan                        # 15% missing

size_lift = pd.Series({"S":0.0,"M":0.4,"L":0.8})[sizes].to_numpy()
logit = (-3.0 + 0.10*bid + 0.004*spend + size_lift
         + (devices=="ios")*0.3 + (countries=="US")*0.2 + rng.normal(0,0.5,size=N))
clicked = (rng.random(N) < 1/(1+np.exp(-logit))).astype(int)

df = pd.DataFrame(dict(member_country=countries, device=devices, creative_size=sizes,
                       campaign_id=campaign, bid=bid, spend=spend, dwell_secs=dwell,
                       clicked=clicked))

# one honest split we reuse everywhere: fit on train, apply to valid
train, valid = train_test_split(df, test_size=0.25, random_state=0, stratify=df.clicked)
print("rows:", len(df), "| click rate:", round(df.clicked.mean(), 3))
print("train:", len(train), "valid:", len(valid))
df.head()
""")

# =========================================================== BASIC (10)
md(r"""
---
# Basic (10) — one technique per example

Each cell: **what it does → runnable code → a picture.**
""")

# 1 One-hot
md(r"""
## 1 · One-hot encoding — *nominal, low cardinality*

Turn an unordered category into one 0/1 column per value. **Use when** the category
has no order and few values (`device`, `member_country`).
**Gotcha:** columns explode at high cardinality — don't one-hot `campaign_id`.
""")
code(r"""
from sklearn.preprocessing import OneHotEncoder

ohe = OneHotEncoder(sparse_output=False, handle_unknown="ignore")
ohe.fit(train[["device"]])                       # fit on train only
enc = ohe.transform(valid[["device"]])
cols = ohe.get_feature_names_out(["device"])
print(pd.DataFrame(enc, columns=cols).head())

plt.figure(figsize=(5,3))
plt.bar(cols, enc.sum(axis=0), color=BLUE)
plt.title("One-hot: impressions per device (valid)"); plt.ylabel("count")
plt.xticks(rotation=15); plt.show()
""")

# 2 Ordinal
md(r"""
## 2 · Ordinal encoding — *ordinal, real order*

Map an **ordered** category to integers that preserve order
(`creative_size` S<M<L → 0,1,2). **Use when** order is genuine.
**Gotcha:** never do this to a nominal feature — it invents a fake order (see #3).
""")
code(r"""
from sklearn.preprocessing import OrdinalEncoder

oe = OrdinalEncoder(categories=[["S","M","L"]])   # declare the true order
_ = oe.fit_transform(train[["creative_size"]])
print("mapping:", dict(zip(["S","M","L"], [0,1,2])))

rate = train.groupby("creative_size").clicked.mean().reindex(["S","M","L"])
plt.figure(figsize=(5,3))
plt.bar(rate.index, rate.values, color=GREEN)
plt.title("Click rate rises with size → order is real"); plt.ylabel("click rate"); plt.show()
""")

# 3 Label-encoding pitfall
md(r"""
## 3 · Label-encoding a *nominal* feature — the fake-order trap

Blindly integer-coding a nominal feature (`device` → 0/1/2) tells a linear model
"web > android > ios", which is meaningless. This is #2 done **wrong**, shown so you
recognize it. **Fix:** one-hot (or hashing / embeddings) for nominal.
""")
code(r"""
from sklearn.preprocessing import LabelEncoder

le = LabelEncoder().fit(train["device"])
print("fake ordering imposed:", dict(zip(le.classes_, le.transform(le.classes_))))

fig, ax = plt.subplots(1, 2, figsize=(9,3))
ax[0].bar(le.classes_, le.transform(le.classes_), color=RED)
ax[0].set_title("device → integer (WRONG for nominal)"); ax[0].set_ylabel("assigned code")
rate = [train.loc[train.device==c, "clicked"].mean() for c in le.classes_]
ax[1].bar(le.classes_, rate, color=BLUE)
ax[1].set_title("real click rate has no such order"); ax[1].set_ylabel("click rate")
plt.show()
""")

# 4 Frequency
md(r"""
## 4 · Count / frequency encoding — *medium cardinality*

Replace each category with how often it appears: cheap, one column, no explosion.
**Use when** popularity itself is signal (`member_country`).
**Gotcha:** two equally-frequent categories collide to the same value.
""")
code(r"""
freq = train["member_country"].value_counts(normalize=True)   # learned on train
valid_freq = valid["member_country"].map(freq).fillna(0.0)     # unseen -> 0
print(freq.round(3).head())

plt.figure(figsize=(6,3))
freq.sort_values().plot(kind="barh", color=PURPLE)
plt.title("Frequency encoding of member_country (train shares)"); plt.xlabel("share"); plt.show()
""")

# 5 Standardization
md(r"""
## 5 · Standardization (z-score) — *numeric*

$z=(x-\mu)/\sigma$ using **train** $\mu,\sigma$: mean 0, unit variance.
**Use for** linear / neural models. **Trees don't need it.**
**Gotcha:** fit $\mu,\sigma$ on train only — fitting on all rows leaks.
""")
code(r"""
from sklearn.preprocessing import StandardScaler

sc = StandardScaler().fit(train[["bid"]])         # mu, sigma from train
z_train = sc.transform(train[["bid"]]).ravel()
print("train mean~0:", round(z_train.mean(),3), " std~1:", round(z_train.std(),3))

fig, ax = plt.subplots(1, 2, figsize=(9,3))
ax[0].hist(train.bid, bins=30, color=BLUE);   ax[0].set_title("bid (raw)")
ax[1].hist(z_train, bins=30, color=GREEN);    ax[1].set_title("bid (standardized)")
plt.show()
""")

# 6 Min-max
md(r"""
## 6 · Min–max scaling — *numeric to [0,1]*

Rescale to a fixed range with train min/max. **Use when** you need bounded inputs.
**Gotcha:** very sensitive to outliers (one huge value squashes everyone else).
""")
code(r"""
from sklearn.preprocessing import MinMaxScaler

mm = MinMaxScaler().fit(train[["bid"]])
mtr = mm.transform(train[["bid"]]).ravel()
print("range:", round(mtr.min(),3), "to", round(mtr.max(),3))

plt.figure(figsize=(5,3))
plt.hist(mtr, bins=30, color=GOLD); plt.title("bid after min-max scaling (train)"); plt.show()
""")

# 7 Robust
md(r"""
## 7 · Robust scaling — *numeric with outliers*

Center by the **median**, scale by the **IQR** — outliers barely move it.
**Use when** the feature has heavy tails / extreme values (`spend`).
""")
code(r"""
from sklearn.preprocessing import StandardScaler, RobustScaler

std = StandardScaler().fit(train[["spend"]]).transform(train[["spend"]]).ravel()
rob = RobustScaler().fit(train[["spend"]]).transform(train[["spend"]]).ravel()

fig, ax = plt.subplots(1, 2, figsize=(9,3), sharey=True)
ax[0].hist(std, bins=30, color=RED);   ax[0].set_title("spend — standardized")
ax[1].hist(rob, bins=30, color=GREEN); ax[1].set_title("spend — robust (median/IQR)")
plt.show()
""")

# 8 Log1p
md(r"""
## 8 · Log transform for skew — *heavy-tailed float*

`log1p(x)=log(1+x)` compresses a long right tail so a few giant campaigns don't
dominate. **Use for** spend, counts, engagement. **Gotcha:** needs `x >= 0`
(use `log1p`, or Yeo-Johnson in #13 for negatives).
""")
code(r"""
log_spend = np.log1p(train["spend"])
print("skew before:", round(train.spend.skew(),2), " after:", round(log_spend.skew(),2))

fig, ax = plt.subplots(1, 2, figsize=(9,3))
ax[0].hist(train.spend, bins=30, color=RED);  ax[0].set_title("spend (raw, skewed)")
ax[1].hist(log_spend, bins=30, color=BLUE);   ax[1].set_title("log1p(spend)")
plt.show()
""")

# 9 Missing + indicator
md(r"""
## 9 · Missing values: impute **and** flag — *numeric*

Fill the gap (median) **and** add a `*_missing` indicator, because "it was missing"
is often signal. **Gotcha:** compute the median on **train** only.
""")
code(r"""
from sklearn.impute import SimpleImputer

med = SimpleImputer(strategy="median").fit(train[["dwell_secs"]])   # train median
dwell_missing = valid["dwell_secs"].isna().astype(int).to_numpy()
print("median used:", round(med.statistics_[0],2),
      "| % missing in valid:", round(dwell_missing.mean(),3))

rate_missing = valid.loc[dwell_missing==1, "clicked"].mean()
rate_present = valid.loc[dwell_missing==0, "clicked"].mean()
plt.figure(figsize=(5,3))
plt.bar(["present","missing"], [rate_present, rate_missing], color=PURPLE)
plt.title("click rate by dwell missingness"); plt.ylabel("click rate"); plt.show()
""")

# 10 Binning
md(r"""
## 10 · Binning / discretization — *numeric → buckets*

Cut a continuous feature into quantile buckets (bid quartiles). **Use when** you
want monotonic, robust buckets or to let a linear model capture non-linearity.
""")
code(r"""
from sklearn.preprocessing import KBinsDiscretizer

kb = KBinsDiscretizer(n_bins=4, encode="ordinal", strategy="quantile", subsample=None)
train_bins = kb.fit_transform(train[["bid"]]).ravel().astype(int)
print("quartile edges:", np.round(kb.bin_edges_[0], 2))

rate = pd.Series(train.clicked.to_numpy()).groupby(train_bins).mean()
plt.figure(figsize=(5,3))
plt.bar(rate.index.astype(str), rate.values, color=BLUE)
plt.title("click rate by bid quartile bucket"); plt.xlabel("bucket"); plt.ylabel("click rate"); plt.show()
""")

# =========================================================== EASY (5)
md(r"""
---
# Easy (5) — combine steps & transforms
""")

# 11 target encoding in-fold leak
md(r"""
## 11 · Target (mean) encoding — and why the naive version **leaks**

Replace `campaign_id` with its mean click rate: powerful for high-cardinality IDs,
but the **naive** version uses each row's own label → the score "knows the answer".
Here we *reproduce* the leak; #16 fixes it with out-of-fold + smoothing.
""")
code(r"""
global_mean = df.clicked.mean()
leaky_map = df.groupby("campaign_id").clicked.mean()          # uses every row's label
df_leaky = df.assign(camp_te=df.campaign_id.map(leaky_map))

counts = df.campaign_id.value_counts()
rare = counts[counts <= 3].index
print("rare-campaign encodings (0/1 = memorized label):")
print(df_leaky[df_leaky.campaign_id.isin(rare)][["campaign_id","clicked","camp_te"]].head())

plt.figure(figsize=(5,3))
plt.hist(df_leaky.camp_te, bins=30, color=RED)
plt.axvline(global_mean, color="k", ls="--", label=f"global mean {global_mean:.2f}")
plt.title("naive target encoding piles mass at 0 and 1 (leak)"); plt.legend(); plt.show()
""")

# 12 ColumnTransformer
md(r"""
## 12 · ColumnTransformer — numeric + categorical in one pass

Real datasets mix types. `ColumnTransformer` applies the right transform to each
column group and produces one matrix — and (crucially) `fit`s on train only.
""")
code(r"""
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler

num = ["bid", "spend"]
cat = ["device", "member_country", "creative_size"]
pre = ColumnTransformer([
    ("num", StandardScaler(), num),
    ("cat", OneHotEncoder(sparse_output=False, handle_unknown="ignore"), cat),
])
Xtr = pre.fit_transform(train)          # fit on train
Xva = pre.transform(valid)              # apply to valid
print("train matrix:", Xtr.shape, "| valid matrix:", Xva.shape)
print("numeric cols:", len(num), "| one-hot cols:", Xtr.shape[1]-len(num))
""")

# 13 PowerTransformer
md(r"""
## 13 · PowerTransformer (Yeo-Johnson) — *make a float ~Gaussian*

Learns the best power transform to reduce skew; Yeo-Johnson also handles zeros /
negatives (Box-Cox needs strictly positive). **Use when** a model assumes roughly
normal inputs.
""")
code(r"""
from sklearn.preprocessing import PowerTransformer

pt = PowerTransformer(method="yeo-johnson").fit(train[["spend"]])
yj = pt.transform(train[["spend"]]).ravel()
print("skew:", round(train.spend.skew(),2), "->", round(pd.Series(yj).skew(),2),
      "| lambda:", round(pt.lambdas_[0],3))

fig, ax = plt.subplots(1, 2, figsize=(9,3))
ax[0].hist(train.spend, bins=30, color=RED);  ax[0].set_title("spend (raw)")
ax[1].hist(yj, bins=30, color=GREEN);         ax[1].set_title("Yeo-Johnson(spend)")
plt.show()
""")

# 14 QuantileTransformer
md(r"""
## 14 · QuantileTransformer — *rank-based normalization*

Maps any distribution onto a uniform or normal one by rank: extremely robust to
outliers. **Gotcha:** non-linear, can wash out fine structure; fit on train.
""")
code(r"""
from sklearn.preprocessing import QuantileTransformer

qt = QuantileTransformer(output_distribution="normal", n_quantiles=500, random_state=0)
qs = qt.fit_transform(train[["spend"]]).ravel()

fig, ax = plt.subplots(1, 2, figsize=(9,3))
ax[0].hist(train.spend, bins=30, color=RED);  ax[0].set_title("spend (raw)")
ax[1].hist(qs, bins=30, color=BLUE);          ax[1].set_title("quantile → normal")
plt.show()
""")

# 15 Winsorize
md(r"""
## 15 · Winsorizing / clipping outliers — *cap extremes*

Clip a feature to the 1st–99th percentile learned on train, so a few extreme
campaigns can't dominate a scaler or a linear weight.
""")
code(r"""
lo, hi = np.percentile(train.spend, [1, 99])       # thresholds from train
clipped = valid.spend.clip(lo, hi)
print(f"clip to [{lo:.1f}, {hi:.1f}] | valid max {valid.spend.max():.1f} -> {clipped.max():.1f}")

fig, ax = plt.subplots(1, 2, figsize=(9,3), sharey=True)
ax[0].hist(valid.spend, bins=30, color=RED);  ax[0].set_title("spend (raw, valid)")
ax[1].hist(clipped, bins=30, color=GREEN);    ax[1].set_title("spend (winsorized 1–99%)")
plt.show()
""")

# =========================================================== ADVANCED (5)
md(r"""
---
# Advanced (5) — leakage-safe & at scale
""")

# 16 OOF target encoding
md(r"""
## 16 · Leakage-safe target encoding (out-of-fold + smoothing)

The right way to do #11: encode each training row using folds that **exclude it**,
and **shrink** rare campaigns toward the global mean:
$\hat{y}_c=\dfrac{n_c\bar{y}_c+m\bar{y}}{n_c+m}$. We compare the honest out-of-fold
AUC to the inflated in-fold AUC to *see* the leak disappear.
""")
code(r"""
from sklearn.model_selection import StratifiedKFold
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score

def smoothed_map(frame, m=20):
    g = frame.groupby("campaign_id").clicked
    gm = frame.clicked.mean()
    return (g.count()*g.mean() + m*gm) / (g.count() + m), gm

tr = train.reset_index(drop=True)

# leaky in-fold encoding on the whole training set
enc_map, gm = smoothed_map(tr)
leak = tr.campaign_id.map(enc_map).fillna(gm).to_numpy().reshape(-1,1)
auc_leak = roc_auc_score(tr.clicked,
            LogisticRegression().fit(leak, tr.clicked).predict_proba(leak)[:,1])

# honest out-of-fold encoding
oof = np.zeros(len(tr))
for fit_idx, enc_idx in StratifiedKFold(5, shuffle=True, random_state=0).split(tr, tr.clicked):
    m_map, g = smoothed_map(tr.iloc[fit_idx])
    oof[enc_idx] = tr.iloc[enc_idx].campaign_id.map(m_map).fillna(g).to_numpy()
auc_oof = roc_auc_score(tr.clicked,
            LogisticRegression().fit(oof.reshape(-1,1), tr.clicked).predict_proba(oof.reshape(-1,1))[:,1])

print(f"in-fold (leaky) AUC:  {auc_leak:.3f}")
print(f"out-of-fold  AUC:     {auc_oof:.3f}")
plt.figure(figsize=(4.5,3))
plt.bar(["in-fold (leak)","out-of-fold"], [auc_leak, auc_oof], color=[RED, GREEN])
plt.ylim(0.4, 1.0); plt.ylabel("train AUC")
plt.title("target-encoding AUC: leak vs honest"); plt.show()
""")

# 17 Hashing
md(r"""
## 17 · Feature hashing — *very high cardinality, fixed width*

Hash `campaign_id` into a fixed number of buckets: constant memory, no vocabulary,
handles unseen ids. **Gotcha:** collisions (two ids share a bucket) — bound them by
choosing enough buckets.
""")
code(r"""
from sklearn.feature_extraction import FeatureHasher

sizes_ = [64, 256, 1024]; used_ = []
for nf in sizes_:
    fh = FeatureHasher(n_features=nf, input_type="string")
    b = np.asarray(fh.transform([[str(c)] for c in df.campaign_id]).argmax(axis=1)).ravel()
    u = len(np.unique(b)); used_.append(u)
    print(f"{nf:>4} buckets -> {u} used for {df.campaign_id.nunique()} distinct ids")

plt.figure(figsize=(5,3))
plt.plot(sizes_, used_, marker="o", color=BLUE)
plt.axhline(df.campaign_id.nunique(), ls="--", color="k", label="distinct ids")
plt.xscale("log", base=2); plt.xlabel("hash buckets"); plt.ylabel("buckets used")
plt.title("more buckets → fewer collisions"); plt.legend(); plt.show()
""")

# 18 Embeddings via SVD
md(r"""
## 18 · Entity embeddings — a dense vector per id

A learned **dense** vector beats one-hot for high-cardinality ids. Deep models use
`torch.nn.Embedding`; here we build a runnable stand-in with **truncated SVD** of a
campaign × context matrix, giving each campaign a 2-D coordinate we can plot and
color by click rate. Similar campaigns land near each other.
""")
code(r"""
from sklearn.decomposition import TruncatedSVD
from sklearn.preprocessing import OneHotEncoder

ctx = OneHotEncoder(sparse_output=False).fit_transform(
        df[["member_country","device","creative_size"]])
camp_codes, camp_uniques = pd.factorize(df.campaign_id)
agg = np.zeros((len(camp_uniques), ctx.shape[1]))
np.add.at(agg, camp_codes, ctx)                       # sum context rows per campaign
emb = TruncatedSVD(n_components=2, random_state=0).fit_transform(agg)

camp_ctr = df.groupby("campaign_id").clicked.mean().reindex(camp_uniques).to_numpy()
plt.figure(figsize=(5.5,4))
sc = plt.scatter(emb[:,0], emb[:,1], c=camp_ctr, cmap="viridis", s=18)
plt.colorbar(sc, label="campaign click rate")
plt.title("2-D campaign embeddings (SVD), colored by CTR")
plt.xlabel("dim 1"); plt.ylabel("dim 2"); plt.show()
print("embedding shape (n_campaigns, dim):", emb.shape)
""")

# 19 Full pipeline fit-on-train
md(r"""
## 19 · A full leakage-safe pipeline (fit on train, score on valid)

Wire preprocessing + model into one `Pipeline`. Because it `fit`s only on train,
validation never touches any statistic — the AUC you get is the one production sees.
""")
code(r"""
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score

num = ["bid","spend","dwell_secs"]; cat = ["device","member_country","creative_size"]
pre = ColumnTransformer([
    ("num", Pipeline([("impute", SimpleImputer(strategy="median")),
                      ("scale", StandardScaler())]), num),
    ("cat", OneHotEncoder(sparse_output=False, handle_unknown="ignore"), cat),
])
clf = Pipeline([("pre", pre), ("model", LogisticRegression(max_iter=1000))])
clf.fit(train, train.clicked)                              # fit on train ONLY
auc = roc_auc_score(valid.clicked, clf.predict_proba(valid)[:,1])
print(f"honest valid AUC (fit on train only): {auc:.3f}")
print("→ this is the number that will match production.")
""")

# 20 Bake-off
md(r"""
## 20 · Encoder bake-off — same model, four encodings of `campaign_id`

Which categorical encoder should you use for a high-cardinality id? Encode it four
ways, train the **same** logistic model, and compare honest valid AUC **and** the
number of columns each produces.
""")
code(r"""
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score
from sklearn.feature_extraction import FeatureHasher
from sklearn.model_selection import StratifiedKFold

y_tr, y_va = train.clicked.to_numpy(), valid.clicked.to_numpy()
base_tr = train[["bid","spend"]].fillna(0).to_numpy()
base_va = valid[["bid","spend"]].fillna(0).to_numpy()

def auc_with(extra_tr, extra_va):
    Xtr = np.hstack([base_tr, extra_tr]); Xva = np.hstack([base_va, extra_va])
    m = LogisticRegression(max_iter=1000).fit(Xtr, y_tr)
    return roc_auc_score(y_va, m.predict_proba(Xva)[:,1]), Xtr.shape[1]

results = {}
oh = OneHotEncoder(sparse_output=False, handle_unknown="ignore").fit(train[["campaign_id"]])
results["one-hot"] = auc_with(oh.transform(train[["campaign_id"]]), oh.transform(valid[["campaign_id"]]))
fr = train.campaign_id.value_counts(normalize=True)
results["frequency"] = auc_with(train.campaign_id.map(fr).fillna(0).to_numpy().reshape(-1,1),
                                valid.campaign_id.map(fr).fillna(0).to_numpy().reshape(-1,1))
def oof_te(m=20):
    t = train.reset_index(drop=True); oof = np.zeros(len(t))
    for fit_idx, enc_idx in StratifiedKFold(5, shuffle=True, random_state=0).split(t, t.clicked):
        f = t.iloc[fit_idx]; g = f.groupby("campaign_id").clicked; gm = f.clicked.mean()
        mp = (g.count()*g.mean() + m*gm)/(g.count()+m)
        oof[enc_idx] = t.iloc[enc_idx].campaign_id.map(mp).fillna(gm).to_numpy()
    full = train.groupby("campaign_id").clicked; gm = train.clicked.mean()
    fmap = (full.count()*full.mean()+m*gm)/(full.count()+m)
    return oof.reshape(-1,1), valid.campaign_id.map(fmap).fillna(gm).to_numpy().reshape(-1,1)
results["target (OOF)"] = auc_with(*oof_te())
fh = FeatureHasher(n_features=64, input_type="string")
htr = fh.transform([[str(c)] for c in train.campaign_id]).toarray()
hva = fh.transform([[str(c)] for c in valid.campaign_id]).toarray()
results["hashing(64)"] = auc_with(htr, hva)

tbl = pd.DataFrame({k: {"valid_AUC": round(v[0],3), "n_cols": v[1]} for k,v in results.items()}).T
print(tbl)
plt.figure(figsize=(6,3))
plt.bar(list(tbl.index), tbl.valid_AUC.to_numpy(), color=[BLUE, GREEN, PURPLE, GOLD])
plt.ylim(0.5, float(tbl.valid_AUC.max())+0.03); plt.ylabel("valid AUC")
plt.title("campaign_id encoder bake-off (same model)"); plt.xticks(rotation=15); plt.show()
""")

# ----------------------------------------------------------------------------- outro
md(r"""
---
## Recap — the practical checklist

- **Categorical:** one-hot (low card., nominal) · ordinal (real order) · frequency
  (medium) · target-encoding **out-of-fold + smoothed** (high card., strong signal)
  · hashing / embeddings (very high card.). Never integer-code a nominal feature.
- **Numeric / float:** standardize / min-max / robust-scale (match the model & the
  outliers) · `log1p` / Yeo-Johnson / quantile for skew · winsorize extremes ·
  impute **and** add a missingness flag.
- **The rule that prevents leakage:** `fit` every transform on the **train split
  only**, then `transform` valid / serving — ideally inside a `Pipeline` /
  `ColumnTransformer` so it's impossible to forget.
""")

nb = {"cells": cells,
      "metadata": {"kernelspec": {"name": "python3", "display_name": "Python 3"},
                   "language_info": {"name": "python"},
                   "colab": {"name": "M02 · Feature Engineering & Leakage",
                             "provenance": [], "toc_visible": True}},
      "nbformat": 4, "nbformat_minor": 5}

out = os.path.join(os.path.dirname(__file__), "..", "afp", "notebooks",
                   "M02-feature-engineering.ipynb")
os.makedirs(os.path.dirname(out), exist_ok=True)
with open(out, "w") as f:
    json.dump(nb, f, indent=1)
print("wrote", os.path.relpath(out), "with", len(cells), "cells",
      f"({sum(c['cell_type']=='code' for c in cells)} code)")
