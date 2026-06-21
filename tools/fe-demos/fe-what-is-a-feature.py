# What a feature is: features sit BETWEEN raw data and the model.
# The model only sees the numbers you hand it. If those numbers don't expose
# the structure, the model fails -- even when the structure is RIGHT THERE in
# the data. The same data, with a better feature, becomes easy. That choice of
# "which numbers to hand the model" IS feature engineering.
#
# Demo: two concentric rings. Inner ring = class 0, outer ring = class 1.
#   - RAW representation (x, y): a straight-line classifier (LogisticRegression)
#     can't split them -> accuracy ~0.5 (coin flip).
#   - ONE engineered feature, the radius r = sqrt(x^2 + y^2): the same model
#     splits them almost perfectly.

import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score

# ---------------------------------------------------------------------------
# 1. Build the data (numpy, fixed rng so the numbers reproduce exactly).
#    A "ring" of radius R: pick a random angle, sit at distance ~R from origin
#    (with a little noise so it's a fuzzy band, not a perfect circle).
# ---------------------------------------------------------------------------
rng = np.random.default_rng(0)
n = 300  # points per ring

def make_ring(radius, noise):
    angle = rng.uniform(0, 2 * np.pi, n)        # random direction
    r = radius + rng.normal(0, noise, n)        # distance from center
    return np.column_stack([r * np.cos(angle), r * np.sin(angle)])

inner = make_ring(radius=1.0, noise=0.12)   # class 0
outer = make_ring(radius=2.5, noise=0.12)   # class 1

X = np.vstack([inner, outer])               # raw features: columns are x and y
y = np.array([0] * n + [1] * n)             # labels

# ---------------------------------------------------------------------------
# 3. Reproduce the PROBLEM: train the model on the RAW (x, y) features.
#    A straight line through (x, y) cannot wrap around a ring, so it's stuck
#    at chance. cross_val_score averages accuracy over 5 train/test splits.
# ---------------------------------------------------------------------------
clf = LogisticRegression()
raw = cross_val_score(clf, X, y, cv=5).mean()
print(f"RAW (x, y) accuracy:        {raw:.3f}   (chance = 0.5)")

# ---------------------------------------------------------------------------
# 4. Apply the technique: engineer ONE feature, the radius r = sqrt(x^2 + y^2).
#    Distance-from-center is exactly what separates an inner ring from an outer
#    ring -- but the model could never compute it from x and y on its own.
# ---------------------------------------------------------------------------
r = np.sqrt(X[:, 0] ** 2 + X[:, 1] ** 2).reshape(-1, 1)  # shape (N, 1)

# ---------------------------------------------------------------------------
# 5. Show the FIX: the SAME model on the engineered radius feature.
# ---------------------------------------------------------------------------
eng = cross_val_score(clf, r, y, cv=5).mean()
print(f"ENGINEERED (radius) accuracy: {eng:.3f}")

# ---------------------------------------------------------------------------
# 2 & 4 (visualize): raw rings in (x, y) | engineered radius by class.
# ---------------------------------------------------------------------------
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 4.5))

# RAW: a scatter of the two rings. No straight line can separate the colors.
ax1.scatter(inner[:, 0], inner[:, 1], s=12, c="tab:blue", label="class 0 (inner)")
ax1.scatter(outer[:, 0], outer[:, 1], s=12, c="tab:red", label="class 1 (outer)")
ax1.set_title(f"RAW (x, y): no line can split  (acc {raw:.2f})")
ax1.set_xlabel("x"); ax1.set_ylabel("y")
ax1.set_aspect("equal"); ax1.legend(loc="upper right", fontsize=8)

# ENGINEERED: the single radius feature, as a histogram per class.
# The two classes land in clearly separate bands -> one cut splits them.
ax2.hist(r[y == 0], bins=30, color="tab:blue", alpha=0.7, label="class 0 (inner)")
ax2.hist(r[y == 1], bins=30, color="tab:red", alpha=0.7, label="class 1 (outer)")
ax2.set_title(f"ENGINEERED radius: cleanly split  (acc {eng:.2f})")
ax2.set_xlabel("r = sqrt(x^2 + y^2)"); ax2.set_ylabel("count")
ax2.legend(fontsize=8)

plt.tight_layout()
plt.show()

# ---------------------------------------------------------------------------
# One-line takeaway.
# ---------------------------------------------------------------------------
print(f"PROBLEM (raw): {raw:.3f}   ->   FIX (engineered): {eng:.3f}")
