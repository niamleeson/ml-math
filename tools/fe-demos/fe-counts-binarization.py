# Lesson: Binarization — collapse a skewed count to a 0/1 flag.
#
# PROBLEM: a right-skewed count feature has a few HUGE values. Standardizing it
# (subtract mean / divide by std) lets those outliers stretch the scale to +10 std,
# so in a distance model (k-NN) that one column DOMINATES and drowns out good features.
# FIX: binarize to 0/1 ("did it happen / is it big"). The flag is bounded, outlier-free,
# and for many count features the signal IS "crossed a threshold" — so it keeps signal.
#
# We show the raw problem on REAL data (breast-cancer 'mean area'), then the predictive
# fix on a small ILLUSTRATIVE count feature (fixed rng) — honest note: the bundled
# feature is too clean to hurt a 1-D k-NN by itself, so the win is shown where it's real.

import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import cross_val_score
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline

# ---- STEP 1: Load real data --------------------------------------------------
# Breast-cancer 'mean area': real, heavily right-skewed (most tumors small, a few huge).
data = load_breast_cancer()
area = data.data[:, data.feature_names.tolist().index("mean area")]

# ---- STEP 2: Visualize the PURE (raw) data -----------------------------------
fig, ax = plt.subplots(1, 3, figsize=(15, 4))
ax[0].hist(area, bins=40, color="#c0392b")
ax[0].axvline(np.median(area), color="black", ls="--", label="median")
ax[0].set_title(f"STEP 2: raw 'mean area' (right-skewed)\nmax={area.max():.0f} = "
                f"{area.max()/np.median(area):.1f}x the median")
ax[0].set_xlabel("mean area"); ax[0].set_ylabel("count"); ax[0].legend()

# ---- STEP 3: Reproduce the PROBLEM — outliers dominate the standardized range -
# Standardize the raw feature. A well-behaved feature lands roughly in [-3, +3].
# Here the long right tail throws the top values WAY past that: the scale is hijacked
# by a few points, so in a distance model this column would dominate everything else.
z = StandardScaler().fit_transform(area.reshape(-1, 1)).ravel()
print(f"STEP 3 PROBLEM  raw standardized range = [{z.min():.1f}, {z.max():.1f}]")
print(f"  -> {(z > 3).sum()} points sit beyond +3 std (top point at +{z.max():.1f}); "
      f"a healthy feature would stop near +3. The tail hijacks the scale.")

# ---- STEP 4: Binarize, then visualize the engineered feature -----------------
# Threshold the REAL feature at its median -> 0/1. Now standardized it is bounded.
flag = (area > np.median(area)).astype(int)
zb = StandardScaler().fit_transform(flag.reshape(-1, 1)).ravel()
print(f"STEP 4 FIX      binarized standardized range = [{zb.min():.1f}, {zb.max():.1f}] "
      f"(bounded, outlier-free)")
ax[1].hist(z, bins=40, color="#c0392b", alpha=.7, label="raw (tail to +5)")
ax[1].hist(zb, bins=40, color="#27ae60", alpha=.7, label="binarized (bounded)")
ax[1].set_title("STEP 4: standardized RANGE\nraw blows out vs binarized stays bounded")
ax[1].set_xlabel("standardized value"); ax[1].set_ylabel("count"); ax[1].legend()

# ---- STEP 5: Show the FIX helps a real model ---------------------------------
# ILLUSTRATIVE dataset (fixed rng, labeled as such): a clean informative feature
# 'good' PLUS a skewed COUNT feature whose true signal is "happened at all" but whose
# raw magnitude has a heavy lognormal tail. The raw count's outliers dominate the k-NN
# distance and drag accuracy DOWN; the 0/1 flag fixes it. This mirrors the real
# 'mean area' skew above in a setting where the predictive damage is visible.
rng = np.random.default_rng(0)
n = 600
y = rng.integers(0, 2, n)                              # labels
good = y + rng.normal(0, 0.6, n)                       # clean, informative feature
happened = ((y * 0.8 + rng.random(n)) > 0.6).astype(int)   # the TRUE binary signal
count = happened * rng.lognormal(2.0, 1.8, n)          # heavy-tailed raw magnitude

def knn_auc(X):  # same model, same CV everywhere -> honest comparison
    pipe = make_pipeline(StandardScaler(), KNeighborsClassifier(n_neighbors=15))
    return cross_val_score(pipe, X, y, cv=5, scoring="roc_auc").mean()

X_raw = np.column_stack([good, count])                 # good + raw skewed count
X_bin = np.column_stack([good, (count > 0).astype(int)])  # good + 0/1 flag
raw_auc = knn_auc(X_raw)
eng_auc = knn_auc(X_bin)

# class balance per half of the flag — shows the flag carries real signal
for f in (0, 1):
    m = (count > 0).astype(int) == f
    print(f"  flag={f} ('{'big' if f else 'zero'}'): n={m.sum():3d}  "
          f"positive rate = {y[m].mean():.2f}")

# bar of the 0/1 split stacked by class
fl = (count > 0).astype(int)
z0 = ((fl == 0) & (y == 0)).sum(); o0 = ((fl == 0) & (y == 1)).sum()
z1 = ((fl == 1) & (y == 0)).sum(); o1 = ((fl == 1) & (y == 1)).sum()
ax[2].bar([0, 1], [z0, z1], color="#2980b9", label="class 0")
ax[2].bar([0, 1], [o0, o1], bottom=[z0, z1], color="#c0392b", label="class 1")
ax[2].set_xticks([0, 1]); ax[2].set_xticklabels(["flag=0", "flag=1"])
ax[2].set_title("STEP 5: 0/1 split (illustrative)\nclass balance per half"); ax[2].legend()
plt.tight_layout(); plt.show()

print(f"STEP 5  k-NN with raw skewed count   ROC-AUC = {raw_auc:.3f}")
print(f"STEP 5  k-NN with binarized 0/1 flag ROC-AUC = {eng_auc:.3f}")
print(f"PROBLEM (raw): {raw_auc:.3f}   ->   FIX (binarized): {eng_auc:.3f}")
