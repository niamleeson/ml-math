# fe-feature-selection.py
# LESSON: Feature selection — prune useless (noise) features before fitting.
#
# PROBLEM we reproduce: irrelevant NOISE features cause OVERFITTING.
# We take the REAL breast-cancer data (30 good features) and bolt on 200 columns
# of PURE RANDOM noise. A classifier eagerly fits that noise, so it memorizes the
# training set (high TRAIN score) but generalizes badly (low TEST score). The
# train-test GAP blows up — the classic signature of overfitting.
# FIX: keep only the top-k most informative features with SelectKBest(mutual_info),
# done INSIDE a Pipeline so the selection is fit on TRAIN folds only (no leakage).
# The SAME model, now fed only real signal, recovers test accuracy and the gap shrinks.
#
# Runs top-to-bottom in Colab. Packages: numpy, matplotlib, scikit-learn only.

import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_breast_cancer
from sklearn.feature_selection import SelectKBest, mutual_info_classif
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score

# ---------------------------------------------------------------------------
# STEP 1: Load real data, then CONCATENATE pure-noise columns onto it.
# 30 real features + 200 random Gaussian columns (fixed rng -> reproducible).
# ---------------------------------------------------------------------------
data = load_breast_cancer()
X_real, y = data.data, data.target          # X_real: 569 rows x 30 real features
n_real = X_real.shape[1]                     # = 30
n_noise = 200                                # number of junk columns to add

rng = np.random.default_rng(0)               # fixed seed -> same numbers every run
X_noise = rng.normal(size=(X_real.shape[0], n_noise))   # pure noise, no signal
X = np.hstack([X_real, X_noise])             # 569 rows x 230 columns (30 real + 200 junk)

X_tr, X_te, y_tr, y_te = train_test_split(
    X, y, test_size=0.3, random_state=0, stratify=y)

# ---------------------------------------------------------------------------
# STEP 2: Visualize the PURE (raw) data — per-feature informativeness.
# Mutual information scores each column's link to y. Real features should TOWER
# over the 200 noise columns (which sit near zero). Scored on TRAIN only.
# ---------------------------------------------------------------------------
mi = mutual_info_classif(X_tr, y_tr, random_state=0)
fig, ax = plt.subplots(1, 2, figsize=(13, 4))
colors = ["seagreen"] * n_real + ["lightgray"] * n_noise
ax[0].bar(range(X.shape[1]), mi, color=colors, width=1.0)
ax[0].axvline(n_real - 0.5, color="red", ls="--", lw=1)
ax[0].set_title("STEP 2: feature score (green=30 real, gray=200 noise)")
ax[0].set_xlabel("feature index"); ax[0].set_ylabel("mutual information with y")

# ---------------------------------------------------------------------------
# STEP 3: Reproduce the PROBLEM — fit the model on ALL 230 raw features.
# The classifier fits the noise -> big train-test gap, lower test accuracy.
# ---------------------------------------------------------------------------
raw_model = Pipeline([
    ("scale", StandardScaler()),
    ("clf", LogisticRegression(max_iter=5000)),
])
raw_model.fit(X_tr, y_tr)
raw_train = accuracy_score(y_tr, raw_model.predict(X_tr))
raw_test = accuracy_score(y_te, raw_model.predict(X_te))
raw_gap = raw_train - raw_test

# ---------------------------------------------------------------------------
# STEP 4: Apply the FIX — SelectKBest INSIDE a Pipeline (leakage-free).
# Selection is re-fit on each TRAIN fold, never peeking at test data.
# Sweep k to see test accuracy rise then plateau as we keep real features.
# ---------------------------------------------------------------------------
def make_selected_model(k):
    return Pipeline([
        ("select", SelectKBest(score_func=mutual_info_classif, k=k)),
        ("scale", StandardScaler()),
        ("clf", LogisticRegression(max_iter=5000)),
    ])

ks = [2, 5, 10, 20, 30, 50, 100, 230]        # number of features kept
test_curve = []
for k in ks:
    m = make_selected_model(k)
    m.fit(X_tr, y_tr)                        # SelectKBest fit on TRAIN only
    test_curve.append(accuracy_score(y_te, m.predict(X_te)))

ax[1].plot(ks, test_curve, "o-", color="steelblue")
ax[1].set_title("STEP 4: test accuracy vs #features kept (rises, then plateaus)")
ax[1].set_xlabel("k = features kept"); ax[1].set_ylabel("test accuracy")
ax[1].set_xscale("log")
plt.tight_layout(); plt.show()

# ---------------------------------------------------------------------------
# STEP 5: Show the FIX — the SAME model keeping only the top-k real features.
# We pick k = n_real (30), the number of genuinely informative columns.
# ---------------------------------------------------------------------------
fix_model = make_selected_model(k=n_real)    # keep top 30
fix_model.fit(X_tr, y_tr)
fix_train = accuracy_score(y_tr, fix_model.predict(X_tr))
fix_test = accuracy_score(y_te, fix_model.predict(X_te))
fix_gap = fix_train - fix_test

print(f"PROBLEM (all 230 raw):  train={raw_train:.3f}  test={raw_test:.3f}  gap={raw_gap:.3f}")
print(f"FIX (top {n_real} selected):   train={fix_train:.3f}  test={fix_test:.3f}  gap={fix_gap:.3f}")
print(f"PROBLEM (raw): {raw_test:.3f}   →   FIX (engineered): {fix_test:.3f}")
