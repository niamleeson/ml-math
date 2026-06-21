# fe-binning.py
# LESSON: Quantization / binning — bucket a continuous feature, then one-hot the buckets.
#
# PROBLEM we reproduce: a LINEAR model fits ONE straight line through a raw feature.
# If the target is HIGH in the MIDDLE of x and LOW at both ends (non-monotonic),
# a single line cannot separate the classes -> near-chance accuracy.
# FIX: cut x into quantile buckets and one-hot encode them. Now the linear model
# learns ONE weight PER bucket, so it can say "middle buckets = class 1" -> big jump.
#
# Runs top-to-bottom in Colab. Packages: numpy, matplotlib, scikit-learn only.

import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import KBinsDiscretizer
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# ---------------------------------------------------------------------------
# STEP 1: Load / build the data.
# This concept needs a non-monotonic shape, so we BUILD it with a fixed rng
# (illustrative, not a bundled dataset). y = 1 only when x sits in a MIDDLE band.
# ---------------------------------------------------------------------------
rng = np.random.default_rng(0)              # fixed seed -> reproducible numbers
n = 600
x = rng.uniform(0, 10, size=n)              # one continuous feature in [0, 10]
# Target is 1 in the middle band (3 < x < 7), else 0. Add a little label noise.
y = ((x > 3) & (x < 7)).astype(int)
flip = rng.uniform(size=n) < 0.05           # 5% random label flips (realistic noise)
y = np.where(flip, 1 - y, y)

X = x.reshape(-1, 1)                         # sklearn wants a 2D feature matrix
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.3, random_state=0)

# ---------------------------------------------------------------------------
# STEP 2: Visualize the PURE (raw) data — see the non-monotone pattern.
# ---------------------------------------------------------------------------
fig, ax = plt.subplots(1, 2, figsize=(12, 4))
ax[0].scatter(x, y + rng.normal(0, 0.02, n), s=8, alpha=0.4, label="data (y jittered)")
ax[0].set_title("STEP 2: raw x vs y — class 1 lives in the MIDDLE")
ax[0].set_xlabel("x"); ax[0].set_ylabel("y (0/1)")

# ---------------------------------------------------------------------------
# STEP 3: Reproduce the PROBLEM — LogisticRegression on RAW x.
# A logistic model is a single monotonic S-curve in x; it cannot pick a middle band.
# ---------------------------------------------------------------------------
raw_clf = LogisticRegression()
raw_clf.fit(X_tr, y_tr)
raw_acc = accuracy_score(y_te, raw_clf.predict(X_te))

# Draw the model's predicted P(y=1) — a flat-ish monotone curve that fits nothing.
grid = np.linspace(0, 10, 200).reshape(-1, 1)
ax[0].plot(grid, raw_clf.predict_proba(grid)[:, 1], "r-", lw=2,
           label=f"raw linear fit (acc={raw_acc:.3f})")
ax[0].legend(loc="upper right")

# ---------------------------------------------------------------------------
# STEP 4: Apply the FIX — quantile-bin x, one-hot the buckets. Then visualize.
# KBinsDiscretizer with strategy="quantile" makes equal-count buckets;
# encode="onehot-dense" turns each bucket into its own 0/1 column.
# ---------------------------------------------------------------------------
binner = KBinsDiscretizer(n_bins=8, encode="onehot-dense", strategy="quantile")
X_tr_bin = binner.fit_transform(X_tr)       # fit buckets on TRAIN only (no leakage)
X_te_bin = binner.transform(X_te)

# Plot per-bucket class rate: middle buckets should be ~1, edge buckets ~0.
bucket_id = binner.transform(X).argmax(axis=1)   # which bucket each point fell in
n_bins = X_tr_bin.shape[1]
rates = [y[bucket_id == b].mean() if np.any(bucket_id == b) else 0 for b in range(n_bins)]
ax[1].bar(range(n_bins), rates, color="steelblue")
ax[1].set_title("STEP 4: per-bucket class rate (middle buckets ~ 1)")
ax[1].set_xlabel("quantile bucket"); ax[1].set_ylabel("rate of y=1")
ax[1].set_ylim(0, 1.05)
plt.tight_layout(); plt.show()

# ---------------------------------------------------------------------------
# STEP 5: Show the FIX — the SAME LogisticRegression on the BINNED one-hot features.
# It now learns one weight per bucket -> turns the middle buckets "on".
# ---------------------------------------------------------------------------
bin_clf = LogisticRegression()
bin_clf.fit(X_tr_bin, y_tr)
bin_acc = accuracy_score(y_te, bin_clf.predict(X_te_bin))

print(f"PROBLEM (raw x):       accuracy = {raw_acc:.3f}")
print(f"FIX (quantile-binned): accuracy = {bin_acc:.3f}")
print(f"PROBLEM (raw): {raw_acc:.3f}   →   FIX (engineered): {bin_acc:.3f}")
