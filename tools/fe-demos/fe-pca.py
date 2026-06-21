# fe-pca.py
# LESSON: PCA (Principal Component Analysis) — reduce many features to a few,
#         as a featurizer for a downstream model.
#
# PROBLEM we reproduce: the digits dataset has 64 pixel features. Many pixels are
# redundant (neighbours look alike) or near-constant (corners are always blank).
# Feeding all 64 to a classifier is wasteful: it trains SLOWER and high
# dimensionality can hurt when data is limited. We also show the data is highly
# COMPRESSIBLE — a cumulative explained-variance curve shows a handful of PCA
# components already capture ~90% of the variance.
# FIX: PCA down to the few components that reach ~90% variance, then refit the
# SAME classifier. We get comparable accuracy with FAR fewer features (faster).
# KEY: we fit the scaler AND PCA on the TRAIN split ONLY, then apply them to the
# test split. Fitting on all the data would leak test info — a classic mistake.
#
# Runs top-to-bottom in Colab. Packages: numpy, matplotlib, scikit-learn only.

import time
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_digits
from sklearn.decomposition import PCA
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score

# ---------------------------------------------------------------------------
# STEP 1: Load real data. 1797 handwritten digits, each an 8x8 image flattened
# to 64 pixel features (values 0..16). y is the digit (0..9).
# ---------------------------------------------------------------------------
data = load_digits()
X, y = data.data, data.target               # X: 1797 rows x 64 pixel features
X_tr, X_te, y_tr, y_te = train_test_split(
    X, y, test_size=0.3, random_state=0, stratify=y)

# Standardize on TRAIN ONLY (fit on train, then apply to both). No leakage.
scaler = StandardScaler().fit(X_tr)
X_tr_s = scaler.transform(X_tr)
X_te_s = scaler.transform(X_te)

# ---------------------------------------------------------------------------
# STEP 2: Visualize the PURE (raw) data — show a few raw 8x8 digit images so the
# beginner sees what one "row of 64 features" actually is.
# ---------------------------------------------------------------------------
fig, axes = plt.subplots(1, 6, figsize=(11, 2))
for ax, img, label in zip(axes, data.images[:6], y[:6]):
    ax.imshow(img, cmap="gray_r"); ax.set_title(f"digit {label}")
    ax.set_xticks([]); ax.set_yticks([])
fig.suptitle("STEP 2: raw digits — each is 64 pixel features")
plt.tight_layout(); plt.show()

# ---------------------------------------------------------------------------
# STEP 3: Reproduce the PROBLEM — fit the classifier on ALL 64 raw features.
# Record accuracy AND training time. 64 dims is wasteful and slower.
# ---------------------------------------------------------------------------
raw_clf = LogisticRegression(max_iter=5000, random_state=0)
t0 = time.perf_counter()
raw_clf.fit(X_tr_s, y_tr)
raw_time = time.perf_counter() - t0
raw_acc = accuracy_score(y_te, raw_clf.predict(X_te_s))
raw_dims = X_tr_s.shape[1]                   # = 64

# ---------------------------------------------------------------------------
# STEP 4: Apply PCA (fit on TRAIN ONLY) and visualize.
# (a) Cumulative explained-variance curve: how much total variance the first k
#     components capture. Pick the smallest k reaching 90% -> our cutoff.
# (b) A 2-component PCA scatter: project to 2D and colour by digit class, to SEE
#     that PCA keeps class structure even after a huge dimensionality drop.
# ---------------------------------------------------------------------------
pca_full = PCA(random_state=0).fit(X_tr_s)   # fit on TRAIN only
cum_var = np.cumsum(pca_full.explained_variance_ratio_)
k = int(np.searchsorted(cum_var, 0.90) + 1)  # smallest #components reaching 90%

fig, ax = plt.subplots(1, 2, figsize=(13, 4))
ax[0].plot(range(1, len(cum_var) + 1), cum_var, "o-", ms=3, color="steelblue")
ax[0].axhline(0.90, color="gray", ls=":", lw=1)
ax[0].axvline(k, color="red", ls="--", lw=1, label=f"cutoff = {k} comps (~90%)")
ax[0].set_title("STEP 4a: cumulative explained variance vs #components")
ax[0].set_xlabel("number of PCA components"); ax[0].set_ylabel("cumulative variance")
ax[0].legend()

X_tr_2d = PCA(n_components=2, random_state=0).fit(X_tr_s).transform(X_tr_s)
sc = ax[1].scatter(X_tr_2d[:, 0], X_tr_2d[:, 1], c=y_tr, cmap="tab10", s=8, alpha=0.7)
ax[1].set_title("STEP 4b: first 2 PCA components, coloured by digit")
ax[1].set_xlabel("PC 1"); ax[1].set_ylabel("PC 2")
fig.colorbar(sc, ax=ax[1], label="digit class")
plt.tight_layout(); plt.show()

# ---------------------------------------------------------------------------
# STEP 5: Show the FIX — PCA to k components (fit on TRAIN ONLY), refit the SAME
# classifier. Comparable accuracy, far fewer features, faster training.
# ---------------------------------------------------------------------------
pca = PCA(n_components=k, random_state=0).fit(X_tr_s)   # fit on TRAIN only
X_tr_p = pca.transform(X_tr_s)
X_te_p = pca.transform(X_te_s)

fix_clf = LogisticRegression(max_iter=5000, random_state=0)
t0 = time.perf_counter()
fix_clf.fit(X_tr_p, y_tr)
fix_time = time.perf_counter() - t0
fix_acc = accuracy_score(y_te, fix_clf.predict(X_te_p))

print(f"PROBLEM (raw):  dims={raw_dims}  acc={raw_acc:.3f}  train_time={raw_time:.3f}s")
print(f"FIX (PCA {k}):   dims={k}  acc={fix_acc:.3f}  train_time={fix_time:.3f}s")
print(f"PROBLEM (raw): {raw_acc:.3f}   →   FIX (engineered): {fix_acc:.3f}")
